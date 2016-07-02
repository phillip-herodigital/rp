define(["backbone"], function (backbone) {

  var urlService = backbone.Model.extend({
    initialize: function () {
      // Need to implement service on backend side to get rid of hardcoded urls
      this.set("urls", {
        MessagesOneTime: "/sitecore/client/Applications/ECM/Pages/Messages/OneTime",
        MessagesTriggered: "/sitecore/client/Applications/ECM/Pages/Messages/Triggered",
        MessagesSubscription: "/sitecore/client/Applications/ECM/Pages/Messages/Subscription",
        MessageReport: '/sitecore/client/Applications/ECM/Pages/MessageReport'
      });
    },
    getUrl: function(key, params) {
      var urls = this.get("urls"),
        paramsString = params ? $.param(params) : null;
      return urls[key] + (paramsString ? "?" + paramsString : "");
    }
  });

  return new urlService();
});