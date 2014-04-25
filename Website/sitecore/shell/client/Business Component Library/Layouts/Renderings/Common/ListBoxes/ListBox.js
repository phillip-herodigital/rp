define(["sitecore"], function (sc) {
  var model = sc.Definitions.Models.InputModel.extend(
    {
      initialize: function (options) {
        this._super();

        this.set("items", []);

        this.set("selectedItem", null);
        this.set("selectedItems", []);
        this.set("selectedItemId", null);
        this.set("selectedItemIds", []);
      }
    });

    var view = sc.Definitions.Views.InputView.extend(
    {
      initialize: function (options) {
        this._super();
        
        var items = this.$el.data("sc-values");
        this.model.set("items", items);

        this.model.on("change:selectedItems", this._selectedItems, this);
      },

      _selectedItems: function () {
        var selectedItems = this.model.get("selectedItems");

        this.model.set("selectedItemIds", _.map(selectedItems, function (e) {
          return e.itemId;
        }));

        this.model.set("selectedItemId", selectedItems.length > 0 ? selectedItems[0].itemId : null);
      }
    });

    sc.Factories.createComponent("ListBox", model, view, ".sc-listbox");
});