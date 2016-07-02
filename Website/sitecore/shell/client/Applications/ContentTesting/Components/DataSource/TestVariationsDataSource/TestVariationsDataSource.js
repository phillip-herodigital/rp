define([
    "sitecore",
    "/-/speak/v1/contenttesting/RequestUtil.js"],
  function (Sitecore, requestUtil) {
  var model = Sitecore.Definitions.Models.ControlModel.extend({
    initialize: function (options) {
      this._super();

      var uri = this.getQueryVariable("uri");
      this.set("itemuri", uri);
      this.on("change:testid", this.getTestVariations, this);
    },

    getTestVariations: function () {
      var ajaxOptions = {
        url: "/sitecore/shell/api/ct/TestVariables/GetTestVariableVariations?itemuri=" + this.get("itemuri") + "&testid=" + this.get("testid"),
        context: this,
        cache: false,
        success: function(data) {
          this.set("items", data);
        }
      };

      requestUtil.performRequest(ajaxOptions);
    },

    getQueryVariable: function (variable) {
      var query = window.location.search.substring(1);
      var vars = query.split('&');

      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');

        if (decodeURIComponent(pair[0]) === variable) {
          return pair[1];
        }
      }

      return null;
    }
  });

  var view = Sitecore.Definitions.Views.ControlView.extend({
    initialize: function (options) {
      this._super();
    }
  });

  Sitecore.Factories.createComponent("TestVariationsDataSource", model, view, ".sc-TestVariationsDataSource");
});
