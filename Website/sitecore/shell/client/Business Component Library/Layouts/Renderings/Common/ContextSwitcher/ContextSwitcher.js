define(["sitecore"], function (_sc) {
  _sc.Factories.createBaseComponent({
    name: "ContextSwitcher",
    base: "InputControlBase",
    selector: ".sc-contextswitcher",
    attributes: [
      { name: "isVisible", value: "$el.data:sc-isvisible" },
      { name: "isEnabled", value: "$el.data:sc-isenabled" },
      { name: "tooltip", value: "$el.data:sc-tooltip" },
      { name: "scrollable", defaultValue: false },
      { name: "isOpen", defaultValue: false },
      { name: "tabName", value: "" }
    ],
    initialize: function () {
      this._super();
      this.model.on("change:items", this.updateItems, this);
      
    },
    toggle: function () {
      this.model.set("isOpen", !this.model.get("isOpen") && this.model.get("isEnabled"));
    },
    updateSelectedItem: function (index) {
      this.model.set("tabName", this.model.get("items")[index].Name);
      this.$el.find('button').removeClass("selected");
      this.$el.find('button[index=' + index + ']').addClass("selected");
    },
    _setupButtons: function(items) {
      var columns = items.length === 1 ? 1 : items.length > 12 ? 3 : 2;
      var rows = Math.ceil(items.length / columns);
      var selectedItemIndex = 0;
      var i = 0;
      if (items.length >= 12 && items.length <= 18) {
        rows = 6;
      }
      this.model.set("scrollable", items.length > 18);
      for (var r = 0; r < rows; r++) {
        $('.sc-contextswitcher-table').append('<div class="sc-contextswitcher-row"/>');
        for (var c = 0; c < columns; c++) {    
          $('.sc-contextswitcher-row:last').append('<div class="sc-contextswitcher-cell"/>');
          var element = "";
          if (items[i]) {
            selectedItemIndex = items[i].Selected ? i : selectedItemIndex;
            element = "<button index='" + i + "' class='sc-contextswitcher-item'";
            element += items[i].Tooltip ? " title='" + items[i].Tooltip + "'" : "";
            element += ">" + items[i].Name + "</button>";
          }
          $('.sc-contextswitcher-cell:last').append(element);
          i++;
        }
      }
      this.updateSelectedItem(selectedItemIndex);
    },
    _addClickEvents: function () {
      var that = this;
      this.$el.find(".sc-contextswitcher-item").on("click", function (e) {
        var index = this.getAttribute('index');
        var item = that.model.get("items")[index];
        that.updateSelectedItem(index);
        that.model.set("isOpen", false);
        return item.Click ? _sc.Helpers.invocation.execute(item.Click, { app: that.app }) : null;
      });
    },
    updateItems: function () {
      this.$el.find(".sc-contextswitcher-table").html('');
      var items = this.model.get("items");
      if (!items || !items.length) {
        this.model.set("tabName", "");
        return;
      }
      this._setupButtons(items);
      this._addClickEvents();
    } 
  });
});