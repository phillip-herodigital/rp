define(["sitecore", "knockout"], function (Sitecore, ko) {
  var model = Sitecore.Definitions.Models.InputModel.extend(
    {
      initialize: function (options) {
        this._super();

        this._super();

        this.set("items", []);
        this.set("item", null);
        this.set("itemName", "");

        this.viewModel.fields = new ko.observableArray();

        this.on("change:items", this.update, this);
      },

      update: function () {
        var items = this.get("items");

        if (!items || items.length == 0) {
          this.set("item", null);
          this.viewModel.fields(null);
          return;
        }

        var item = items[0];

        this.set("item", item);
        this.set("itemName", item.itemName);

        var fields = _.map(item.$fields, function (f) {
          return f.toViewModel();
        }, this);

        fields = _.sortBy(fields, function (field) {
          return field.fieldName;
        });
        
        this.viewModel.fields(fields);
      }
    });

  var view = Sitecore.Definitions.Views.InputView.extend(
    {
      initialize: function (options) {
        this._super();
      }
    });

  Sitecore.Factories.createComponent("DBBrowserEditor", model, view, ".sc-DBBrowserEditor");
});
