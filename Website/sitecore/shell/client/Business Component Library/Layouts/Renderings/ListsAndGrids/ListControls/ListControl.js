/// <reference path="../../../../../../assets/vendors/underscore/underscore.js" />
/// <reference path="../../../../../../assets/lib/dist/sitecore.js" />
/// <reference path="../../../../../../assets/vendors/Backbone/backbone.js" />

require.config({
  paths: {
    "Scrollbar": "lib/ui/behaviors/Scrollbar",
  },
  shim: {
    'Scrollbar': { deps: ['sitecore'] }
  }
});

define(["sitecore", "Scrollbar"], function (sc) {
  /**
  * Detail List View
  * Composite View which uses:
  * - One Header view
  * - One Footer view
  * - One Row view
  */
    var Header = Backbone.LayoutManager.extend({
        template: "header",
        initialize: function (options) {
            this.parent = options.parent;
        },
        tagName: "tr"
  });

  var Footer = Backbone.LayoutManager.extend({
      template: "footer",
      initialize: function (options) {
          this.parent = options.parent;
      },
      tagName: "tr"
  });

  var Row = Backbone.LayoutManager.extend({
    template: "row",
    tagName: "tr",
    events: { "click": "select" },
    initialize: function (options) {
        this.parent = options.parent;
    },
    afterRender: function () {
      this.sync();
    },
    select:function (e) {
      if (this.$el.hasClass("active")) {
        this.trigger("unselected", this.$el, this.model);
      } else {
        this.trigger("selected", this.$el, this.model);
      }
    }
      
  });

  var DetailList = Backbone.LayoutManager.extend({
    template: "main",
    events: {
        "click .sc-table-sortable": "sort"
    },
    
    // Sorting status definitions
    sortingStatus: {
      noSorting: "",
      ascending: "a",
      descending: "d"
    },
   
    selectRow: function (row, rowModel) {
      this.$el.find(".active").removeClass("active");
      row.addClass("active");

     
      this.model.set("selectedItem", rowModel);
      this.model.set("selectedItemId", rowModel.get("itemId"));
    },
    initialize: function (options) {
        this.parent = options.parent;
        this.setView(".sc-table thead", new Header({ parent: this.parent }));
        this.setView(".sc-table-footer", new Footer({ parent: this.parent }));
        this.sortingParameters = [];
        this.model.on("change:selectedItemId", function () {
          this.model.get("selectedItemId") == null ? this.unselectRow() : $.noop();
        }, this);
    },
    unselectRow: function (row, rowModel) {
      this.$el.find(".active").removeClass("active");
//      
//      this.model.set("selectedItems", _.without(this.model.get("selectedItems"), rowModel));
//      this.model.set("checkedItemIds", _.without(this.model.get("checkedItemIds"), rowModel.get("itemId")));
      
      this.model.set("selectedItemId", "");
      this.model.set("selectedItem", "");
    },
    insertRow: function (model) {
      if (this.hasEmpty) {
        this.removeEmpty();
        this.hasEmpty = false;
      }
      var row = new Row({ parent: this.parent, model: model, serialize: model.viewModel });
      this.insertView(".sc-table tbody", row);
      row.on("selected", this.selectRow, this);
      row.on("unselected", this.unselectRow, this);
    },
    beforeRender: function () {
      this.collection.each(this.insertRow, this);
    },
    afterRender: function () {
      var numberRow = this.$el.find(".sc-table thead tr th").length;
      if (this.collection.length === 0) {
        this.renderEmpty(numberRow);
      }
      this.formatFooter(numberRow);
      
      _.each(this.sortingParameters, function (obj) {
        var $header = this.$el.find("[data-sc-name='" + obj.columnName + "']");
        if (obj.direction === "") {
          $header.removeClass("up");
          $header.addClass("noDirection");
        } else if (obj.direction === "d") {
          $header.addClass("up");
          $header.removeClass("noDirection");
        } else {
          $header.removeClass("up");
          $header.removeClass("noDirection");
        }
      }, this);
    },
    removeEmpty: function () {
      this.$el.find(".empty").remove();
    },
    sort: function (evt) {
        var $source = $(evt.currentTarget),
            parameter = $source.data("sc-sort-name"),
            columnName = $source.data("sc-name"),
            sortConfiguration = "",
            isExisting;

        //check if it exist
        isExisting = _.find(this.sortingParameters, function (param) {
          return param.columnName == columnName;
        });

        if (isExisting) {
          if (isExisting.direction === "") {
            $source.removeClass("noDirection");
            $source.addClass("up");
            isExisting.direction = "d";
          } else if (isExisting.direction === "d") {
              isExisting.direction = "a";
              $source.removeClass("noDirection");
              $source.removeClass("up");
            } else {
              isExisting.direction = "";
              $source.addClass("noDirection");
              // remove sorting element
              var removeIndex = this.sortingParameters.indexOf(isExisting);
              this.sortingParameters.splice(removeIndex, 1);
          }
          
          // move array element to position 0
          if (isExisting.direction != "") {
            var fromIndex = this.sortingParameters.indexOf(isExisting);
            this.sortingParameters.splice(fromIndex, 1);
            this.sortingParameters.splice(0, 0, isExisting);
          }

        } else {
          $source.removeClass("noDirection");
          $source.addClass("up");
          // add at top position
          this.sortingParameters.splice(0, 0, { columnName: columnName, name: parameter, direction: "d" });
        };
        
        sortConfiguration = _.reduce(this.sortingParameters, function (memo, conf) { return memo + "|" + conf.direction + conf.name; }, "");
        sortConfiguration = sortConfiguration.substring(1, sortConfiguration.length);

        this.model.set("sorting", sortConfiguration);
    },
    renderEmpty: function (numberRow) {
      var emptytext = this.model.get("empty") || "",
          html = "<tr class='empty'><td colspan='" + numberRow + "'>{0}</td></tr>";

      html = html.replace("{0}", emptytext);
      this.$el.find(".sc-table tbody").html(html);
      this.hasEmpty = true;
    },
    formatFooter: function (numberRow) {
      //this.$el.find(".sc-table tfoot tr td").attr("colspan", numberRow);
    }
  });

  /**
  * Icon List View
  * Composite View which uses:
  * - Icon view
  */

  var Icon = Backbone.LayoutManager.extend({
    events: {
      "click": "select"
    },
    template: "icon",
    tagName: "div",
	getImage: function () {
		//find Thumbail
	    if (this.model.get("__Thumbnail")) {
	        var shityHtml = this.model.get("__Thumbnail"),
	            extractId = new RegExp(/mediaid="{(.*?)}"/),
	            id = shityHtml.match(extractId)[1],
	            db = this.model.get("itemUri").databaseUri.databaseName;
	        id = id.replace(/-/g, "");

	        return "/" + (sc.Resources.Settings["Media.MediaLinkPrefix"] ? sc.Resources.Settings["Media.MediaLinkPrefix"] : "~/media") + "/" + id + ".ashx?bc=Transparent&thn=1t&h=130&w=130&db=" + db;
	    } else {
	        return this.model.get("$mediaurl");
	    }
	},
    className: "sc-iconList-wrap",
    afterRender: function () {
	  this.model.set("image", this.getImage());
      this.sync();
    },
    select: function (e) {
      e.preventDefault();
      if (this.$el.hasClass("active")) {
        this.trigger("unselected", this.$el, this.model);
      } else {
        this.trigger("selected", this.$el, this.model);
      }
    }
  });

  var IconList = Backbone.LayoutManager.extend({
    template: "iconList",
    initialize: function (options) {
        this.parent = options.parent;
    },
    insertRow: function (model) {
      if (this.hasEmpty) {
        this.removeEmpty();
        this.hasEmpty = false;
      }
      var icon = new Icon({ model: model, serialize: model.toJSON() });
      icon.on("selected", this.selectIcon, this);
      icon.on("unselected", this.unselectIcon, this);
      this.insertView(icon);
    },
    beforeRender: function () {
      this.collection.each(this.insertRow, this);
    },
    selectIcon: function (icon, iconModel) {
      this.$el.find(".active").removeClass("active");
      icon.addClass("active");
      
      
      this.model.set("selectedItem", iconModel);
      this.model.set("selectedItemId", iconModel.get("itemId"));
    },
    unselectIcon: function (icon, iconModel) {
      this.$el.find(".active").removeClass("active");
      
      this.model.set("selectedItem", "");
      this.model.set("selectedItemId", "");
    },
    afterRender: function () {
      if (this.collection.length === 0) {
        this.renderEmpty();
      }
    },
    removeEmpty: function () {
      this.$el.find(".empty").remove();
    },
    renderEmpty: function (numberRow) {
      var emptyText = this.model.get("empty") || "";
      this.$el.html("<div class='empty'>" + emptyText + "</div>");
      this.hasEmpty = true;
    },
    totalScroll: function () {
      this.collection.each(this.insertRow, this);
    }
  });

  /**
  * ListControl is a Composite view
  * It is wrapper in order to switch the view Mode
  * Sorting parameter is a pipe separated string.
  * prefixed with a, it will be ascending
  * prefixed with d, it will be descending
  */
  var ListControl = Backbone.LayoutManager.extend({
    template: "listControl",
    initialize: function (options) {
      this.parent = options.parent;
      this.model.on("change:items", this.refresh, this);
      this.model.on("change:view", this.setViewModel, this);
      this.setViewModel();
    },
    refresh: function () {
      var self = this;
      this.collection.reset();
      _.each(this.model.get("items"), function (item) {

        // creating new item from json
        if (item instanceof this.collection.model) {
          itemModel = item;
        } else {
          var itemModel = new this.collection.model(item);
        }

        // apply formating
        itemModel.viewModel.formatValue = function (name, format) {
          var formatDate = "";
 
          var val = name != "" && typeof this[name]() != 'undefined' ? this[name]() : '';
          var tempValue = '';
          var additionalValues;
          if (this.$formatedFields) {
            additionalValues = this.$formatedFields();
          }
          
          if (!isNaN(val) && format && format.substring(0, 1) === "#") {
            val = self.formatNumber(val, format, self.model.get("language"));
          } else if (format && format == "short") {
            if (additionalValues) {
              tempValue = additionalValues[name].shortDateValue;
              if (tempValue) val = tempValue;
            }
          }
          else if (format && format == "long") {
            if (additionalValues) {
              tempValue = additionalValues[name].longDateValue;
              if (tempValue) val = tempValue;
            }
          }
          else if (format)
          {
            if (val == '') {
              var viewModel = this;
              var getValue = function (fieldname) {
                if (typeof viewModel[fieldname] != "undefined") {
                  return viewModel[fieldname]();
                }
                return undefined;
              };
              tempValue = sc.Helpers.string.formatByTemplate(format, getValue);
            }
            else if (sc.Helpers.date.isISO(val)) {
              var dateConverter = sc.Converters.get("date");
              tempValue = dateConverter.toStringWithFormat(val, format);
            }            
            if (tempValue) val = tempValue;
          }
          return val;
        };
        this.collection.add(itemModel);
      }, this); 

      var parent = this.parent;      
      this.render().done(function () {
        parent.afterRender();
        parent.trigger("didRender");
      });
    },
    

    formatNumber: function (value, format, language) {
      var result;

      if (isNaN(value)) {
        return value;
      }
      
      if (format.length < 2) {
        return value;
      }

      var fomatType = format.substring(1, 2);
      if (fomatType != "P" && fomatType != "N") {
        return value;
      }
      
      var digitsNumber = 2;
      if (format.length > 2) {
        digitsNumber = format.substring(2, format.lenght);

        if (isNaN(parseInt(digitsNumber))) {
          digitsNumber = 2;
        } 
      }

      result = parseFloat(parseFloat(value).toFixed(digitsNumber)).toLocaleString(language);           
      var decimalPosition = Math.max(result.lastIndexOf(","), result.lastIndexOf("."));
      var numberOfDecimals = result.length-1 - decimalPosition;
      while (numberOfDecimals < digitsNumber) {
        result = result + "0";
        numberOfDecimals++;
      }
      
      if (result % 1 === 0) {
        result = parseInt(result);
      }

      if (fomatType === "P") {
        result = result + " %";
      }

      return result;
    },

    setViewModel: function () {
      var view = this.model.get("view");

      if (!view || view.toLowerCase() == "DetailList".toLowerCase()) {
        this.$el.empty();
        this.setView(new DetailList({ model: this.model, parent: this.parent, collection: this.collection }));
      }
      else if (view.toLowerCase() == "IconList".toLowerCase()) {
        this.$el.empty();
        this.setView(new IconList({ model: this.model, parent: this.parent, collection: this.collection }));
      }
      else {
        throw "Unknown view mode: " + view;
      }
      this.render();
    }
  });

  /**
  * Collection
  * will be shared among all the Composite view
  */
  var SC_Collection = Backbone.Collection.extend({
    model: sc.Definitions.Models.Model
  });

  var controlModel = sc.Definitions.Models.ControlModel.extend({
    initialize: function (options) {
      this._super();
      this.set("items", []);

      this.set("selectedItem", "");
      this.set("selectedItemId", "");
      this.set("empty", "");
    }
  });

  /**
  * ControlView
  * Object which allows us to exposed the Composite
  */
  var controlView = sc.Definitions.Views.ControlView.extend({
    listen: _.extend({}, sc.Definitions.Views.ControlView.prototype.listen, {
      "detailList:$this": "setDetailListView",
      "icon:$this": "setIconView"
    }),
    initialize: function (options) {
      this._super();
      this.model.set("empty", this.$el.data("sc-empty")); //the empty should be move in the Composite
      this.model.set("view", this.$el.data("sc-viewmode"));
      this.model.set("height", this.$el.data("sc-height"));
      this.model.set("language",this.$el.data("sc-language"));
      this.model.set("sorting", "");
      sc.Resources = sc.Resources || {};
      sc.Resources.Settings = sc.Resources.Settings || {};
      sc.Resources.Settings["Media.MediaLinkPrefix"] = this.$el.data("sc-media-link-prefix");
      if (typeof this.collection == "undefined") {
        this.collection = new SC_Collection();
      }
      this.listControl = new ListControl({ model: this.model, parent: this, collection: this.collection, app: this.app });
      this.$el.empty().append(this.listControl.el);
      this.listControl.render();
    },
    setDetailListView: function () {
      this.model.set("view", "DetailList");
    },
    setIconView: function () {
      this.model.set("view", "IconList");
    }
  });

  sc.Factories.createComponent("ListControl", controlModel, controlView, ".sc-listcontrol", SC_Collection);
});