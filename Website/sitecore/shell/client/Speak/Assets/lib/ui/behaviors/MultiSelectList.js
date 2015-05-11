define(["sitecore", "knockout"], function (_sc, ko) {

  _sc.Factories.createBehavior("MultiSelectList", {
    events: {
      "change .sc-cb": "check",
      "change .sc-cball": "checkAll"
    },
    initialize: function () {

    },
    beforeRender: function () {

      this.model.set("checkedItems", []);
      this.model.set("checkedItemIds", []);
    },
    afterRender: function () {
      this.allCheck = [];
      this.$el.find("thead tr").each(this.insertGlobalcheck);
      _.each(this.$el.find(".sc-table tbody tr"), this.insertcheck, this);
      this.globalCheck = this.$el.find(".sc-cball");
      this.on("addrow", this.addrow);
    },
    addrow: function () {
      this.insertcheck(this.$el.find(".sc-table tbody tr").last());

    },
    insertGlobalcheck: function () {
      var checkbox = "<th class='cb'><input class='sc-cball' type='checkbox' /></th>";
      $(this).prepend(checkbox);
    },
    insertcheck: function (el) {
      var $el = $(el);
      if (!$el.hasClass("empty")) {
        var checkbox = "<td class='cb'><input class='sc-cb' type='checkbox' /></td>";
        $el.prepend(checkbox);
        this.allCheck.push($el);
      } else {
        $el.prepend("<td></td>");
      }
    },
    checkAll: function () {
      if (this.globalCheck.is(":checked")) {
        _.each(this.allCheck, function (el) {

          var cb = el.find(".sc-cb");
          cb.prop("checked", true);
          cb.trigger("change");

        });

      } else {
        _.each(this.allCheck, function (el) {
          var cb = el.find(".sc-cb");
          cb.prop("checked", false);
          cb.trigger("change");
        });
        this.currentSelection = [];
      }
    },

    check: function (evt) {
      var $current = $(evt.currentTarget),
          $row = $current.closest("tr"),
          rowItem,
          checkedItemsResult,
          checkedItemIdsResult,
          rowItemCalc = {};
      
      //getting the ko context item
      rowItem = ko.contextFor($row[0]).$data;
      
      //translate ko-observable properties into regular values
      _.each(rowItem, function (value, key) {
        
        if (_.isFunction(value) && (ko.isObservable(value) || ko.isComputed(value))) {
          rowItemCalc[key] = value();
        }
      });
      rowItem = rowItemCalc;

      //this.model.set("checkedItemIds", []);

      if ($current.is(":checked")) {
        var colItems = this.model.get("checkedItems"),
          colItemIds = this.model.get("checkedItemIds"),
          containsItem = _.contains(colItems, rowItem),
          containsItemId = _.contains(colItemIds, rowItem.itemId);
          
        if (!containsItem) {
          colItems.push(rowItem);
          this.model.set("checkedItems", colItems, { force: true });
          this.model.trigger("change", this.model, colItems);
          this.model.trigger("change:checkedItems");
        }

        if (!containsItemId) {
          colItemIds.push(rowItem.itemId);
          this.model.set("checkedItemIds", colItemIds, { force: true });
          this.model.trigger("change:checkedItemIds");
        }
      } else {
     
          checkedItemsResult = _.filter(this.model.get("checkedItems"), function (item) {
            return item.itemId !== rowItem.itemId;
          });
          this.model.set("checkedItems", checkedItemsResult);
          this.model.trigger("change", this.model, checkedItemsResult);
          
          checkedItemIdsResult = _.filter(this.model.get("checkedItemIds"), function (item) {
            return item !== rowItem.itemId;
          });
          this.model.set("checkedItemIds", checkedItemIdsResult);

      }

      if (this.model.get("checkedItemIds").length != 0 && this.model.get("checkedItemIds").length === this.$el.find(".sc-table tbody tr").length) {
        this.globalCheck.prop("checked", true);
      } else {
        this.globalCheck.prop("checked", false);
      }
    }
  });
});