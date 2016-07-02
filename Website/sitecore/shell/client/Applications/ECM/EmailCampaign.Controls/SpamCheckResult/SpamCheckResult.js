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
        var rootElement = this.$el.find("div.sc-spamcheckresult");
        var variantId = rootElement.data("sc-variant-id");
        var dateandtime = rootElement.data("sc-report-dateandtime");
        var elements = this.$el.find("div.sc-report-item a");

        $.each(elements, function (k, v) {
          var item = $(v);
          item.on("click", function () {
            if (item.data("sc-title") == "") {
              return false;
            }
            
            _sc.trigger("click:spamcheck", { variantId: variantId, dateandtime: dateandtime, title: item.data("sc-title"), body: item.data("sc-body"), name: item.data("sc-name") });
          });
        });
      }

    }
  );

  _sc.Factories.createComponent("SpamCheckResult", model, view, ".sc-SpamCheckResult");
});