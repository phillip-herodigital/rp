define([
  "sitecore",
  "/-/speak/v1/contenttesting/DataUtil.js",
  "/-/speak/v1/contenttesting/RequestUtil.js"
], function (Sitecore, dataUtil, requestUtil) {
  var model = Sitecore.Definitions.Models.ControlModel.extend({
    initialize: function (options) {
      this._super();

      this.set("items", []);

      this.getVariables();
      this.on("change:variableId", this.getVariable, this);
    },
    
    getVariable: function () {
      var variableId = this.get("variableId");
      var uri = dataUtil.composeUri(this);
      var ajaxOptions = {
        cache: false,
        url: "/sitecore/shell/api/ct/TestResults/GetVariable?itemuri=" + encodeURIComponent(uri) + "&variableId=" + variableId,
        context: this,
        success: function(data) {
          this.set("items", data.Items);
        }
      };

      requestUtil.performRequest(ajaxOptions);
    },

    getVariables: function () {
      var uri = dataUtil.composeUri(this);
      var ajaxOptions = {
        cache: false,
        url: "/sitecore/shell/api/ct/TestResults/GetVariables?itemuri=" + encodeURIComponent(uri),
        context: this,
        success: function(data) {
          this.set("items", data.Items);
        }
      };

      requestUtil.performRequest(ajaxOptions);
    }
  });


  var view = Sitecore.Definitions.Views.ControlView.extend({
    initialize: function (options) {
      this._super();

      // Set initial settings
      this.model.set("itemId", this.$el.attr("data-sc-itemid") || null);
      this.model.set("language", this.$el.attr("data-sc-language") || "");
      this.model.set("version", this.$el.attr("data-sc-version") || 0);
    }
  });

  Sitecore.Factories.createComponent("VariablesDataSource", model, view, ".sc-VariablesDataSource");
});
