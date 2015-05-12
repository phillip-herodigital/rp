var defaultUtilPath;
var requestUtilPath;
if (window.location.host && window.location.host != '') { // launching when address to web-page
  defaultUtilPath = "/-/speak/v1/contenttesting/DataUtil.js";
  requestUtilPath = "/-/speak/v1/contenttesting/RequestUtil.js";
}
else { // launching of the code-coverage estemating
  require.config({
    paths: {
      defaultUtilPath: contentTestingDir + "/Common/lib/DataUtil",
      requestUtilPath: contentTestingDir + "/Common/lib/RequestUtil",
    },
  });
  defaultUtilPath = "defaultUtilPath";
  requestUtilPath = "requestUtilPath";
}

define([
  "sitecore",
  defaultUtilPath,
  requestUtilPath
], function (Sitecore, dataUtil, requestUtil) {
  var actionUrl = "/sitecore/shell/api/ct/Action/StopTest";

  var model = Sitecore.Definitions.Models.ControlModel.extend({
    initialize: function () {
      this._super();

      this.set({
        isBusy: false,
        invalidated: false,
        itemId: null,
        languageName: null,
        version: 0,
        combination: null
      });
    },

    stopTest: function (callback, errorCallback, callbackContext, rulesToKeep) {
      var uri = dataUtil.composeUri(this);
      if (!uri) {
        return;
      }

      var combination = this.get("combination");
      if (!combination) {
        return;
      }

      if (this.get("isBusy")) {
        this.set("invalidated", true);
        return;
      }

      if (_.isArray(rulesToKeep)) {
        rulesToKeep = rulesToKeep.join("|");
      }

      var url = Sitecore.Helpers.url.addQueryParameters(actionUrl, {
        itemuri: uri,
        combination: combination,
        rulesToKeep: rulesToKeep || ""
      });

      var ajaxOptions = {
        type: "POST",
        cache: false,
        url: url,
        context: this,
        success: function(data) {
          this.set("isBusy", false);
          if (this.get("invalidated")) {
            this.stopTest(callback);
          } else {
            callback.call(callbackContext, data);
          }
        },
        error: function(req, status, error) {
          console.log("Ajax call failed");
          console.log(status);
          console.log(error);
          console.log(req);

          if (errorCallback) {
            errorCallback.call(callbackContext);
          }
        }
      };

      requestUtil.performRequest(ajaxOptions);
    }
  });

  var view = Sitecore.Definitions.Views.ControlView.extend({
    initialize: function () {
      this._super();

      this.model.set("isBusy", true);

      // Set initial settings
      this.model.set({
        itemId: this.$el.attr("data-sc-itemid") || null,
        languageName: this.$el.attr("data-sc-language") || "",
        version: this.$el.attr("data-sc-version") || 0,
      });

      this.model.set("isBusy", false);
    }
  });

  Sitecore.Factories.createComponent("TestActions", model, view, "script[type='x-sitecore-testactions']");
});
