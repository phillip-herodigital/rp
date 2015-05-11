define(["sitecore", "knockout"], function (sc, ko)
{
  // Clears checkedItems array when control gets new data.
  function addRefreshEventHandler(control)
  {
    var handlers = control.model.on("change:items", function()
    {
      this.model.set("checkedItems", []);
    }, control)._events['change:items'];

    handlers.unshift(handlers.pop());
  }

  function restoreRowCheck(control, rowElement)
  {
    var rowItem = getRowData(rowElement);
    if(rowItem.itemId && _.contains(control.model.get("checkedItemIds"), rowItem.itemId()))
    {
      updateCheckBox(rowElement, true);
    }
  }
  
  function convertToIdArray(items)
  {
    if(!items[0].itemId)
    {
      return items;
    }

    return _.map(items, function(item) { return item.itemId; });
  }

  function setChecked(control, itemIds, checked)
  {
    _.each(control.allCheck, function(rowElement)
    {
      var rowItem = getRowData(rowElement);
      
      if(_.contains(itemIds, rowItem.itemId()))
      {
        updateCheckBox(rowElement, checked);
      }
    });
  }
  
  function updateCheckBox(el, checked)
  {
    var checkBox = el.find(".sc-cb");
    checkBox.prop("checked", checked);
    checkBox.trigger("change");
  }
  
  function getRowData(rowElement)
  {
    return ko.contextFor(rowElement[0]).$data;
  }
  
  sc.Factories.createBehavior("MultiSelectList", {
    events: {
      "change .sc-cb": "check",
      "change .sc-cball": "checkAll"
    },
    initialize: function () {

    },
    beforeRender: function () {
      this.model.set("checkedItems", []);
      this.model.set("checkedItemIds", []);

      addRefreshEventHandler(this);
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

      restoreRowCheck(this, $el);
    },
    
    checkItem: function (item)
    {
      this.checkItems([item]);
    },

    checkItems: function (items)
    {
      if(items.length < 1)
      {
        return;
      }

      items = convertToIdArray(items);
      
      this.model.set("checkedItemIds", _.union(this.model.get("checkedItemIds"), items));
      setChecked(this, items, true);
    },
    
    uncheckItem: function (item)
    {
      this.uncheckItems([item]);
    },
    
    uncheckItems: function(items)
    {
      if(items.length < 1)
      {
        return;
      }

      items = convertToIdArray(items);

      this.model.set("checkedItemIds", _.difference(this.model.get("checkedItemIds"), items));
      setChecked(this, items, false);
    },

    checkAll: function ()
    {
      var checked = this.globalCheck.is(":checked");
      _.each(this.allCheck, function(el)
      {
        updateCheckBox(el, checked);
      });
      
      if(!checked)
      {
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
      rowItem = getRowData($row);
      
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
          containsItemId = _.contains(colItemIds, rowItem.itemId),
          containsItem = _.some(colItems, function(item) { return item.itemId === rowItem.itemId; });
          
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