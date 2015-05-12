require.config({
  paths: {
    "Scrollbar": "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/behaviors/Scrollbar",
    "EndlessPageScroll": "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/behaviors/EndlessPageScroll",
    "userProfile": "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/userProfile"
  },
  shim: {
    'Scrollbar': { deps: ['sitecore'] }
  }
});

define(["sitecore", "userProfile", "Scrollbar", "EndlessPageScroll"], function (sc, userProfile) {
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
    select: function (e) {
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

      // Call updateArrows here so user sees immediate change in arrow direction.
      // updateArrows is called again after the ListControl is re-rendered.
      this.model.on("change:sorting", function () {
        this.updateArrows();
      }, this);
      
      this.model.on("globalcheck:inserted", this.resizableColumnsSyncHandleWidths, this);
      this.model.on("scrollheader:inserted", this.resizableColumnsSyncHandleWidths, this);
      this.model.on("change:isActiveResizeEnabled", this.resizableColumnsSyncActiveResize, this);
      
      this.resizable = null;

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
      this.updateArrows();
      this.initResizableColumns();
    },
    initResizableColumns: function () {
      var $header = this.$el.find(".sc-table-header.table");
      var $body = this.$el.find(".sc-listcontrol-body .sc-table.table");

      if (this.resizable == null && $header && $body && $body.is(":visible") && $.contains(document.documentElement, $header[0]) && $body.find(ResizableColumns.prototype.defaults.selectorTD).length > 1) {
        var state = userProfile.get(this.parent);
        var columnWidths = state ? state.columnWidths : null;
        this.resizable = new ResizableColumns($header, $body, columnWidths, { dragOnlyHandlers: !this.model.get("isActiveResizeEnabled") });
        this.resizable.model.on("change:columnWidths", function () {
          this.updateResizableState();
        }, this);
      }
      else if (this.resizable != null) {
        this.resizable.reinitAndKeepWidth($header, $body);
      }
    },
    resizableColumnsSyncHandleWidths: function () {
      if (this.resizable != null) {
        this.resizable.syncHandleWidthsEndless();
      }
    },
    resizableColumnsSyncActiveResize: function () {
      if (this.resizable != null) {
        this.resizable.options.dragOnlyHandlers = !this.model.get("isActiveResizeEnabled");
      }
    },
    updateResizableState: function () {
      var state = { columnWidths: this.resizable.model.get("columnWidths") };
      userProfile.update(this.parent, state);
    },
    removeEmpty: function () {
      this.$el.find(".empty").remove();
    },
    updateArrows: function () {
      var sortingArray = [];
      if (this.model.get("sorting")) {
        sortingArray = this.model.get("sorting").split('|');
      }

      $(".sc-table-sortable").removeClass("up").addClass("noDirection");

      for (var index = 0; index < sortingArray.length; ++index) {
        var sortElement = sortingArray[index].trim();
        if (sortElement) {
          var direction = sortElement.charAt(0),
            sortName = sortElement.substr(1),
           $header = this.$el.find("[data-sc-sort-name='" + sortName + "']");

          _.each($header, function (header) {
            if (direction === "d") {
              $(header).removeClass("noDirection");

            } else if (direction === "a") {
              $(header).removeClass("noDirection").addClass("up");
            }
          });
        }
      }
    },
    sort: function (evt) {
      var $source = $(evt.currentTarget),
        sortingAttribute = this.model.get("sorting"),
        sortNameAttribute = $source.attr("data-sc-sort-name").trim(),
        sortingArray = sortingAttribute ? sortingAttribute.split("|") : [],
        isInSortingArray = false;

      for (var i = 0; i < sortingArray.length; i++) {
        var sortElement = sortingArray[i],
          direction = sortElement.charAt(0),
            sortName = sortElement.substr(1);

        if (sortNameAttribute === sortName) {
          if (direction === "a") {
            direction = "d";
          } else if (direction === "d") {
            direction = "";
          }
          sortElement = direction + sortName;
          isInSortingArray = true;
          sortingArray.splice(i, 1);

          if (direction) {
            sortingArray.unshift(sortElement);
          }
        }
      }

      if (!isInSortingArray) {
        sortingArray.unshift("a" + sortNameAttribute);
      }

       if (!this.model.get("allowMultipleColumnSorting")) {
        sortingArray.splice(1);
      }

      this.model.set("sorting", sortingArray.join("|"));
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
    //template: "icon",
    tagName: "div",
    contentLanguage: "",
    getImage: function ()
    {
      var url;

      //find Thumbail
      if (this.model.get("__Thumbnail")) {
        var dummyHTML = this.model.get("__Thumbnail"),
            extractId = new RegExp(/mediaid="{(.*?)}"/),
            id = dummyHTML.match(extractId)[1],
            db = this.model.get("itemUri").databaseUri.databaseName;
        id = id.replace(/-/g, "");

        url = (sc.Resources.Settings["Media.MediaLinkPrefix"]
          ? sc.Resources.Settings["Media.MediaLinkPrefix"]
          : "/~/media/") + id + ".ashx?bc=Transparent&thn=1&db=" + db + "&la=" + this.contentLanguage;
      } else {
        url = this.model.get("$mediaurl");
      }

      var size = this.model.get("maxIconSize");
      size = size ? parseInt(size.substr(0, size.length - 2)) : 0;

      if(size > 150)
      {
        url += url.indexOf('?') > -1 ? '&' : '?';
        url += "h=" + size + "&w=" + size;
      }
      
      return url;
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
    className: "clearfix",
    initialize: function (options) {
      this.parent = options.parent;
      
      this.model.on("change:selectedItemId", function () {
        
        (this.model.get("selectedItemId") == null || this.model.get("selectedItemId").length == 0) ? this.unselectIcon() : $.noop();
      }, this);
      
      this.model.on("change:maxIconSize", applyMaxIconSize, this);
    },
    insertRow: function (model) {
      if (this.hasEmpty) {
        this.removeEmpty();
        this.hasEmpty = false;
      }

      var maxIconSize = this.model.get("maxIconSize");
      setIconSize(model, maxIconSize);
      
      var formattedSize = formatSize(maxIconSize);
      var attributes = { style: "width: " + formattedSize + "; height: " + formattedSize + ";" };
      
      var icon = new Icon({ template: "icon" + this.parent.model.get("name"), model: model, serialize: model.toJSON(), attributes: attributes });
      icon.on("selected", this.selectIcon, this);
      icon.on("unselected", this.unselectIcon, this);
      icon.contentLanguage = this.model.get("contentLanguage");
      this.insertView(icon);
      if (model.get("itemId") === this.model.get("defaultSelectedItemId")) {
        this.selectIcon(icon.$el, model);        
      }
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
  * Tile List View
  * Composite View which uses:
  * - Tile view
  */

  var Tile = Backbone.LayoutManager.extend({
    events: {
      "click": "select"
    },
    tagName: "div",
    className: "sc-tileList-item-container",
    afterRender: function () {
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

  var TileList = Backbone.LayoutManager.extend({
    template: "tileList",
    className: "clearfix",
    initialize: function (options) {
      this.parent = options.parent;

      this.model.on("change:selectedItemId", function () {

        (this.model.get("selectedItemId") == null || this.model.get("selectedItemId").length == 0) ? this.unselectTile() : $.noop();
      }, this);
    },
    insertRow: function (model) {
      if (this.hasEmpty) {
        this.removeEmpty();
        this.hasEmpty = false;
      }
      
      var tile = new Tile({ template: "tile" + this.parent.model.get("name"), model: model, serialize: model.toJSON() });
      tile.on("selected", this.selectTile, this);
      tile.on("unselected", this.unselectTile, this);
      this.insertView(tile);
      if (model.get("itemId") === this.model.get("defaultSelectedItemId")) {
        this.selectTile(tile.$el, model);
      }
    },
    beforeRender: function () {
      this.collection.each(this.insertRow, this);
    },
    selectTile: function (tile, tileModel) {
      this.$el.find(".active").removeClass("active");
      tile.addClass("active");

      this.model.set("selectedItem", tileModel);
      this.model.set("selectedItemId", tileModel.get("itemId"));
    },
    unselectTile: function (tile, tileModel) {
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
    
    appendLanguageParameter: function (item) {
      if (item.$icon && item.$icon.indexOf(".ashx") > 0) {
        item.$icon += "&la=" + this.model.get("contentLanguage");
        item.$mediaurl += "&la=" + this.model.get("contentLanguage");
      }
    },
    refresh: function () {
      var self = this;
      this.collection.reset();
      _.each(this.model.get("items"), function (item) {

        this.appendLanguageParameter(item);
        
        // creating new item from json
        if (item instanceof this.collection.model) {
          itemModel = item;
        } else {
          var itemModel = new this.collection.model(item);
        }
        
        // apply formating
        itemModel.viewModel.formatValue = function (name, format) {

          var val = "";
          
          //  Checking for this[name]() invokes binding, so make sure this[name] is a function
          if (typeof this[name] === 'function' && name != "" && typeof this[name]() != 'undefined') {
            val = this[name]();
          }

          var tempValue = '';
          var additionalValues;
          if (this.$formatedFields) {
            additionalValues = this.$formatedFields();
          }

         if (format && format == "short") {
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
          else if (format) {
            var isHtmlTemplate = val == "" && name == "";
            if (isHtmlTemplate) {
              var viewModel = this;
              var getValue = function (fieldname) {
                if (typeof viewModel[fieldname] != "undefined") {
                  return viewModel[fieldname]();
                }
                return undefined;
              };
              tempValue = sc.Helpers.string.formatByTemplate(format, getValue);
              
            } else if (sc.Helpers.date.isISO(val)) {
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
        parent.model.trigger("didRender");
      });
    },

     setViewModel: function () {
      var view = this.model.get("view");

      if (!view || view.toLowerCase() == "DetailList".toLowerCase()) {
        this.$el.empty();
        this.setView(new DetailList({ model: this.model, parent: this.parent, collection: this.collection }));
      }
      else if (view.toLowerCase() == "IconList".toLowerCase()) {
        // destroy resizable
        this.destroyResizableColumns();
        this.$el.empty();
        this.setView(new IconList({ model: this.model, parent: this.parent, collection: this.collection }));
      }
      else if (view.toLowerCase() == "TileList".toLowerCase()) {
        // destroy resizable
        this.destroyResizableColumns();
        this.$el.empty();
        this.setView(new TileList({ model: this.model, parent: this.parent, collection: this.collection }));
      }
      else {
        throw "Unknown view mode: " + view;
      }
      var parent = this.parent;
      this.render().done(function () {
        parent.afterRender();
        this.model.trigger("change:columnWidths");
      });
    },
    destroyResizableColumns: function () {
      if (this.views[0] && this.views[0].resizable) {
        this.views[0].resizable.destroy();
      }
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
      this.set("hasSelectedItem", false);
      this.set("empty", "");
      this.set("maxIconSize", null);
      this.set("isActiveResizeEnabled", false);   
      this.set("isEndlessScrollEnabled", false);
      this.set("maxHeight", 0);
      this.set("minHeight", 0);

      this.on("change:selectedItem", updateHasSelectedItem, this);

      function updateHasSelectedItem() {
        this.set("hasSelectedItem", _.isObject(this.get("selectedItem")));
      }
    }
  });

  /**
  * ControlView
  * Object which allows us to exposed the Composite
  */
  var controlView = sc.Definitions.Views.ControlView.extend({
    listen: _.extend({}, sc.Definitions.Views.ControlView.prototype.listen, {
      "detailList:$this": "setDetailListView",
      "icon:$this": "setIconView",
      "tile:$this": "setTileView"
    }),
    initialize: function (options) {
      this._super();
      this.model.set("empty", this.$el.data("sc-empty")); //the empty should be move in the Composite
      this.model.set("view", this.$el.data("sc-viewmode") ? this.$el.data("sc-viewmode") : "DetailList");
      this.model.set("height", this.$el.data("sc-height"));
      this.model.set("contextLanguage", this.$el.data("sc-contextlanguage"));
      this.model.set("contentLanguage", this.$el.data("sc-contentlanguage"));
      this.model.set("defaultSelectedItemId", this.$el.data("sc-defaultselecteditemsd"));    
      this.model.set("sorting", this.$el.attr("data-sc-sorting"));
      this.model.set("allowMultipleColumnSorting", this.$el.data("sc-allowmultiplecolumnsorting"));
      this.model.set("maxIconSize", this.$el.data("sc-maxiconsize"));
      this.model.set("isActiveResizeEnabled", this.$el.data("sc-isactiveresizeenabled"));
      this.model.set("isEndlessScrollEnabled", this.$el.data("sc-isendlessscrollenabled"));
      this.model.set("maxHeight", this.$el.data("sc-maxheight"));
      this.model.set("minHeight", this.$el.data("sc-minheight"));

      userProfile.init(this);
      
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
    },
    setTileView: function () {
      this.model.set("view", "TileList");
    },
    afterRender: function() {     
    }
  });
  
  function applyMaxIconSize(model)
  {
    var formattedSize = formatSize(model.get("maxIconSize"));
    model.viewModel.$el.find(".sc-iconList-wrap").css({ "width": formattedSize, "height": formattedSize });

    _.each(this.views[""], function(viewItem)
    {
      setIconSize(viewItem.model, this.get("maxIconSize"));
      viewItem.model.set("image", viewItem.getImage());
    }, model);
  }

  function setIconSize(model, size)
  {
    if(size)
    {
      model.set("maxIconSize", formatSize(parseInt(size) - 1));
    } else
    {
      model.unset("maxIconSize");
    }
  }
  
  function formatSize(size)
  {
    return size ? size + "px" : "";
  }
  
  var ResizableColumns = (function () {
    var __bind, parseWidth, pointerX, setWidth;

    __bind = function (fn, me) {
      return function () { return fn.apply(me, arguments); };
    };
    
    parseWidth = function (node) {
      return parseFloat(node.style.width.replace('%', ''));
    };
    
    setWidth = function (node, width) {
      if (typeof(width) == "string") {
        width = parseFloat(width.replace('%', ''));
      }
      width = width.toFixed(1);
      return node.style.width = "" + width + "%";
    };
    
    pointerX = function (e) {
      if (e.type.indexOf('touch') === 0) {
        return (e.originalEvent.touches[0] || e.originalEvent.changedTouches[0]).pageX;
      }
      return e.pageX;
    };
    
    ResizableColumns.prototype.defaults = {
      selector: 'tr th.sc-table-head',
      selectorTD: 'tr td.ventilate',
      syncHandlers: false,
      dragOnlyHandlers: true,
      minWidth: 60
    };

    function ResizableColumns($header, $body, columnWidths, options) {
      this.pointerdown = __bind(this.pointerdown, this);
      this.constrainWidth = __bind(this.constrainWidth, this);
      this.options = {};
      _.extend(this.options, this.defaults);
      _.extend(this.options, options);
      this.$table = $header;
      this.$body = $body;
      this.columnWidths = columnWidths || [];
      this.model = new Backbone.Model();
      this.model.set("columnWidths", this.columnWidths);
      this.setHeaders();
      this.syncHandleWidths();
      $(window).on('resize.sc-rc', (function (_this) {
        return function () {
          _this.syncHandleWidths();
        };
      })(this));
    }
    
    ResizableColumns.prototype.setHeaders = function () {
      this.$tableHeaders = this.$table.find(this.options.selector);
      this.$tableBodies = this.$body.find(this.options.selectorTD);
      if (this.columnWidths.length > 0 && this.$tableHeaders.length == this.columnWidths.length) {
        this.assignWidthsFromOld(this.columnWidths);
      } else {
        this.assignHeaderPercentageWidths();
        this.assignBodyPercentageWidths();        
      }
      this.createHandles();
    };

    ResizableColumns.prototype.destroy = function () {
      _.each(this.$handleContainer.find('.sc-rc-handle'), function (el, i) {
        var $el;
        $el = $(el);
        $el.data('th').css({ width: "" });
        $el.data('td').css({ width: "" });
      });
      if ((this.$handleContainer) != null) {
        this.$handleContainer.remove();
      }
      if ((this.$handleBorder) != null) {
        this.$handleBorder.remove();
      }
      this.$table.removeData('resizableColumns');
      this.$table.add(window).off('.sc-rc');
    };

    ResizableColumns.prototype.assignHeaderPercentageWidths = function () {
      //var tablewidth = this.$table.width();
      var tablewidth = 0;
      var widthsPx = [];
      _.each(this.$tableHeaders, function (el, i) {
        var $el;
        $el = $(el);
        tablewidth += $el.outerWidth();
        widthsPx.push($el.outerWidth());
      }, this);
      _.each(this.$tableHeaders, function (el, i) {
        var $el;
        $el = $(el);
        setWidth($el[0], widthsPx[i] / tablewidth * 100);
        this.columnWidths[i] = $el[0].style.width;
      }, this);
      this.model.trigger("change:columnWidths");
    };

    ResizableColumns.prototype.assignBodyPercentageWidths = function () {
      //var tablewidth = this.$body.width();
      var tablewidth = 0;
      var widthsPx = [];
      _.each(this.$tableBodies, function (el, i) {
        if (i >= this.columnWidths.length) {
          return;
        }
        var $el;
        $el = $(el);
        tablewidth += $el.outerWidth();
        widthsPx.push($el.outerWidth());
      }, this);
      _.each(this.$tableBodies, function (el, i) {
        if (i >= this.columnWidths.length) {
          return;
        }
        var $el;
        $el = $(el);
        setWidth($el[0], widthsPx[i] / tablewidth * 100);
      }, this);
    };

    ResizableColumns.prototype.createHandles = function () {
      if ((this.$handleContainer) != null) {
        this.$handleContainer.remove();
      }
      if ((this.$handleBorder) != null) {
        this.$handleBorder.remove();
      }
      this.$table.after((this.$handleContainer = $("<div class='sc-rc-handle-container' />")));
      _.each(this.$tableHeaders, function (el, i) {
        var $handle;
        if (this.$tableHeaders.eq(i + 1).length === 0 || (this.$tableHeaders.eq(i).attr('data-noresize') != null) || (this.$tableHeaders.eq(i + 1).attr('data-noresize') != null)) {
          return;
        }
        $handle = $("<div class='sc-rc-handle' />");
        $handle.data('th', $(el));
        if ($('td', this.$body).length > 1) {
          $handle.data('td', $($('td', this.$body)[i]));
        }
        $handle.appendTo(this.$handleContainer);
      }, this);
      this.$body.parent().after((this.$handleBorder = $("<div class='sc-rc-handle-border-container'><div class='sc-rc-handle-border' /></div>")));
      this.$handleContainer.on('mousedown touchstart', '.sc-rc-handle', this.pointerdown);
    };

    ResizableColumns.prototype.syncHandleWidthsEndless = function () {
      // hack for multiselect behavior
      this.endlessSyncHandler = setInterval((function (_this) { return function () { _this.syncHandleWidths(); }; })(this), 500);
    };

    ResizableColumns.prototype.syncHandleWidths = function () {
      if (this.$handleContainer) {
        this.$handleContainer.css({
          top: -this.$table.height()
        });
        _.each(this.$handleContainer.width(this.$table.width()).find('.sc-rc-handle'), function (el, i) {
          var $el;
          $el = $(el);
          if ($el.data('th')) {
            var left = $el.data('th').outerWidth() + ($el.data('th').offset().left - this.$handleContainer.offset().left);
            var height = this.$table.height();
            $el.css({
              left: left,
              height: height
            });
          }
        }, this);
      }
    };

    ResizableColumns.prototype.reinitAndKeepWidth = function ($header, $body) {
      this.$table = $header;
      this.$body = $body;
      this.$tableHeaders = this.$table.find(this.options.selector);
      this.$tableBodies = this.$body.find(this.options.selectorTD);
      this.assignWidthsFromOld(this.columnWidths);
      this.createHandles();
      this.syncHandleWidths();
    };

    ResizableColumns.prototype.assignWidthsFromOld = function (widths) {
      _.each(this.$tableHeaders, function (el, i) {
        var $el;
        $el = $(el);
        setWidth($el[0], widths[i]);
      });
      _.each(this.$tableBodies, function (el, i) {
        if (i >= widths.length) {
          return;
        }
        var $el;
        $el = $(el);
        setWidth($el[0], widths[i]);
      }, this);
    };

    ResizableColumns.prototype.pointerdown = function (e) {
      var $currentGrip, $leftColumn, $ownerDocument, $rightColumn, newWidths, startPosition, widths, widthsPx;
      e.preventDefault();
      if (this.endlessSyncHandler) {
        clearInterval(this.endlessSyncHandler);
        this.endlessSyncHandler = null;
      }
      $ownerDocument = $(e.currentTarget.ownerDocument);
      startPosition = pointerX(e);
      $currentGrip = $(e.currentTarget);
      $leftColumn = $currentGrip.data('th');
      $leftColumnTD = $currentGrip.data('td');
      $rightColumn = this.$tableHeaders.eq(this.$tableHeaders.index($leftColumn) + 1);
      $rightColumnTD = this.$tableBodies.eq(this.$tableBodies.index($leftColumnTD) + 1);
      widths = {
        left: parseWidth($leftColumn[0]),
        right: parseWidth($rightColumn[0])
      };
      widthsPx = {
        left: $leftColumn.outerWidth(),
        right: $rightColumn.outerWidth()
      };
      newWidths = {
        left: widths.left,
        right: widths.right
      };
      if (this.options.dragOnlyHandlers) {
        var fulltableHeight = this.$table.height() + this.$body.parents(".sc-listcontrol-body").height();
        $(".sc-rc-handle-border", this.$handleBorder).css({
          top: -fulltableHeight,
          height: fulltableHeight - 2,
          left: widthsPx.left + ($currentGrip.data('th').offset().left - this.$handleBorder.offset().left)
        }).show();
      }
      this.$handleContainer.add(this.$table).addClass('sc-rc-table-resizing');
      $leftColumn.add($rightColumn).add($currentGrip).addClass('sc-rc-column-resizing');
      $ownerDocument.on('mousemove.sc-rc touchmove.sc-rc', (function (_this) {
        return function (e) {
          var difference, differencePx, leftWidthPx, rightWidthPx;
          differencePx = pointerX(e) - startPosition;
          leftWidthPx = widthsPx.left + differencePx;
          rightWidthPx = widthsPx.right - differencePx;
          if (leftWidthPx >= _this.options.minWidth && rightWidthPx >= _this.options.minWidth) {
            difference = (pointerX(e) - startPosition) / _this.$table.width() * 100;
            newWidths.left = (widths.left + difference);
            newWidths.right = (widths.right - difference);
            if (!_this.options.dragOnlyHandlers) {
              setWidth($leftColumn[0], newWidths.left);
              setWidth($rightColumn[0], newWidths.right);
              setWidth($leftColumnTD[0], newWidths.left);
              setWidth($rightColumnTD[0], newWidths.right);
            } else {
              var $el = $currentGrip;
              var $border = $(".sc-rc-handle-border", this.$handleBorder);
              var left = leftWidthPx + ($el.data('th').offset().left - _this.$handleContainer.offset().left);
              $el.add($border).css("left", left);
            }
          }
          if (_this.options.syncHandlers != null && _this.options.syncHandlers) {
            _this.syncHandleWidths();
          }
        };
      })(this));
      $ownerDocument.one('mouseup touchend', (function (_this) {
        return function () {
          if (_this.options.dragOnlyHandlers) {
            setWidth($leftColumn[0], newWidths.left);
            setWidth($rightColumn[0], newWidths.right);
            setWidth($leftColumnTD[0], newWidths.left);
            setWidth($rightColumnTD[0], newWidths.right);
            $(".sc-rc-handle-border", this.$handleBorder).hide();
          }
          var i = _this.$tableHeaders.index($leftColumn);
          _this.columnWidths[i] = $leftColumn[0].style.width;
          _this.columnWidths[i + 1] = $rightColumn[0].style.width;
          //_this.model.set("columnWidths", _this.columnWidths);
          _this.model.trigger("change:columnWidths");
          $ownerDocument.off('mousemove.sc-rc touchmove.sc-rc');
          _this.$handleContainer.add(_this.$table).removeClass('sc-rc-table-resizing');
          $leftColumn.add($rightColumn).add($currentGrip).removeClass('sc-rc-column-resizing');
          _this.syncHandleWidths();
        };
      })(this));
    };

    return ResizableColumns;

  })();

  sc.Factories.createComponent("ListControl", controlModel, controlView, ".sc-listcontrol", SC_Collection);
});