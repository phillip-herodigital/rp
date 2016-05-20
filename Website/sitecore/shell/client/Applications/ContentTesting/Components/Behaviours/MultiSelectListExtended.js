require.config({
  paths: {
    MultiSelectList: "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/behaviors/multiselectlist",
  },  
});

define(["sitecore", "knockout", "underscore", "MultiSelectList"], function (sc, ko, _, multiSelectList)
{
  function createChangeArgument(added, removed) {
    return { added: added, removed: removed };
  };

  var MultiSelectListBehavior = _sc.Behaviors["MultiSelectList"];
  
  var MultiSelectListExtended = _.extend(_.clone(MultiSelectListBehavior), {

    beforeRender: function () {
      this.model.set("checkedItems", []);
      this.model.set("checkedItemIds", []);

      this.model.on("change:checkedItems", this.checkedItemsChanged, this);

      var handlers = this.model.on("change:items", function () {
        this.model.set("checkedItems", []);
      }, this)._events['change:items'];

      handlers.unshift(handlers.pop());

      //#48264,yvy: it's not needed to clear the selection
      //this.model.on("change:selectedItem", clearChecksOnSelect, this);
    },
    afterRender: function () {
      this.allCheck = [];
      var items = this.model.get("items");
      if (items && items.length) {
        _.each(this.$el.find("thead tr"), this.insertGlobalcheck, this);
        _.each(this.$el.find(".sc-table tbody tr"), this.insertcheck, this);

        //#48264,yvy: add "itemdId" into "tr" element
        var $listTR = this.$el.find(".sc-table tbody tr");
        if (items.length === $listTR.length) {
          for (var i = 0; i < items.length; i++) {
            var $tr = $($listTR[i]);
            var item = items[i];
            if ((item.itemId && item.itemId !== "") || (item.UId && item.UId !== "")) {
              var itemId;
              if (item.itemId && item.itemId !== "")
                itemId = item.itemId;
              else if (item.UId && item.UId !== "")
                itemId = item.UId;

              $tr.attr("itemId", itemId);
            }

            // Disable checkboxes on Original variations
            if (item.IsOriginal) {
              $tr.find("input[type='checkbox']").prop("disabled", true);
            }
          }
        }
        
        this.globalCheck = this.$el.find(".sc-cball");
        this.on("addrow", this.addrow);
      }

    },

    checkCell: function (evt) {
      // Abort handler if the checkbox is disabled
      var $current = $(evt.currentTarget);
      if ($current.find("input[type='checkbox']").prop("disabled")) {
        return;
      }

      MultiSelectListBehavior.checkCell(evt);
    },

    checkedItemsChanged: function (event) {
      var items = this.model.get("items");
      var checkedItems = this.model.get("checkedItems");
      var disabledItems = _.clone(items);
      _.each(checkedItems, function (item) {
        // checking
        if ((item.itemId && item.itemId !== "") || (item.UId && item.UId !== "")) {
          var itemId;
          if (item.itemId && item.itemId !== "")
            itemId = item.itemId;
          else if (item.UId && item.UId !== "")
            itemId = item.UId;

          var $trFound = this.$el.find("[itemId='" + itemId + "']");
          if ($trFound.length > 0) {
            $trFound.find("input[type='checkbox']").attr("checked", true);
          }
        };

        // "disabledItems"
        if (disabledItems.indexOf(item) >= 0)
          disabledItems.splice(disabledItems.indexOf(item), 1);
      }, this);

      this.model.set("disabledItems", disabledItems);
    },

    check: function (evt) {
      var $current = $(evt.currentTarget),
          $row = $current.closest("tr"),
          rowItem,
          checkedItemsResult,
          checkedItemIdsResult;

      rowItem = this.model.get("items")[$row.index()];

      var colItems = this.model.get("checkedItems"),
          colItemIds = this.model.get("checkedItemIds");

      if ($current.is(":checked")) {
        var containsItemId = _.contains(colItemIds, rowItem.itemId),
            containsItem = _.contains(colItems, rowItem);

        if (!containsItem) {
          colItems.push(rowItem);
          this.model.set("checkedItems", colItems, { silent: true });
          this.model.trigger("change", this.model, colItems);
          this.model.trigger("change:checkedItems", createChangeArgument([rowItem], []));
        }

        if (!containsItemId) {
          colItemIds.push(rowItem.itemId);
          this.model.set("checkedItemIds", colItemIds, { silent: true });
          this.model.trigger("change:checkedItemIds", createChangeArgument([rowItem.itemId], []));
        }

        //#48264,yvy: checking doesn't select the row
        //this.model.set("selectedItemId", null);
        //$current.closest("tr").addClass("checked");
      } else {

        // Check on requiring of the enabled rows
        var requiredEnabledRowCount = this.model.get("requiredEnabledRowCount");
        if (requiredEnabledRowCount && requiredEnabledRowCount !== "") {
          var checkedItems = this.model.get("checkedItems");
          var requireAllowed = parseInt(requiredEnabledRowCount);

          if (checkedItems.length <= requireAllowed) {
            $current[0].checked = true;
            // Trigger validation event to handle try to disable the last item in the list
            this.model.trigger("validation:disableLastItem", this.model);
            return;
          }
        }

        checkedItemsResult = _.filter(colItems, function (item) {
          return item !== rowItem;
        });

        if (checkedItemsResult.length !== colItems.length) {
          this.model.set("checkedItems", checkedItemsResult, { silent: true });
          this.model.trigger("change", this.model, checkedItemsResult);
          this.model.trigger("change:checkedItems", createChangeArgument([], [rowItem]));
        }

        checkedItemIdsResult = _.filter(colItemIds, function (itemId) {
          return itemId !== rowItem.itemId;
        });

        if (checkedItemIdsResult.length !== colItemIds.length) {
          this.model.set("checkedItemIds", checkedItemIdsResult, { silent: true });
          this.model.trigger("change:checkedItemIds", createChangeArgument([], [rowItem.itemId]));
        }

        $current.closest("tr").removeClass("checked");
      }

      var rowsNumber = this.$el.find(".sc-table tbody tr").length;
      var checkedRows = this.$el.find(".sc-cb:checked").length;

      this.globalCheck.prop("checked", (checkedRows > 0 && checkedRows === rowsNumber));

      //
      this.model.trigger("change:checkItem", this.model);
    },

    checkAll: function () {
      var items = this.model.get("items");
      if (items) {
        this.model.set("checkedItems", items);
      }
    },

    disableRow: function (itemId) {
      if (!itemId) {
        return;
      }

      var $trFound = this.$el.find("[itemId='" + itemId + "']");
      if ($trFound.length > 0) {
        $trFound.find("input[type='checkbox']").attr("disabled", true);
      }
    }
  });

  sc.Factories.createBehavior("MultiSelectListExtended", MultiSelectListExtended);
});