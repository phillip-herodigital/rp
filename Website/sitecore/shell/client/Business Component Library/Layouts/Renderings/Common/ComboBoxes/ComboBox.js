define(["sitecore"], function (sc) {
  var model = sc.Definitions.Models.InputModel.extend(
    {
      initialize: function (options) {
        this._super();

        this.set("items", []);
        this.set("selectedItems", []);
        this.set("selectedItem", null);
        this.set("selectedItemId", null);
      }
    });

  var view = sc.Definitions.Views.InputView.extend(
    {
      initialize: function (options) {
        this._super();

        var items = this.$el.data("sc-values");

        this.model.set("items", items);
        this.model.set("selectedItems", []);

        this.model.on("change:selectedItems", function () {
          var selectedItems = this.model.get("selectedItems");

          if (selectedItems.length > 0) {
            var selectedItem = selectedItems[0];
            this.model.set("selectedItem", selectedItem);
            this.model.set("selectedItemId", selectedItem.itemId);
          }
          else {
            this.model.set("selectedItem", null);
            this.model.set("selectedItemId", null);
          }
        }, this);
      }
    });

    sc.Factories.createComponent("ComboBox", model, view, ".sc-combobox");
  });