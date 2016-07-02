define(["sitecore"], function (_sc) {
  "use strict";

  var model = _sc.Definitions.Models.ComponentModel.extend(
    {
      initialize: function () {
        this._super();
      }
    }
  );

  var view = _sc.Definitions.Views.ComponentView.extend(
    {
      initialize: function () {
        this._super();
      },
      render: function() {
        var rootElement = this.$el.find("div.sc-emailpreviewresult");
        var variantId = rootElement.data("sc-variant-id");
        var dateandtime = rootElement.data("sc-report-dateandtime");
        
        $.each(this.$el.find("div.sc-report-item a"), function (k, v) {
          var item = $(v);
          item.on("click", function () {
            if (item.data("sc-url") == "") {
              return false;
            }

            _sc.trigger("click:emailpreview", { variantId: variantId, dateandtime: dateandtime, url: item.data("sc-url"), name: item.data("sc-name") });
          });
        });
      }

    }
  );

  _sc.Factories.createComponent("EmailPreviewResult", model, view, ".sc-EmailPreviewResult");
});