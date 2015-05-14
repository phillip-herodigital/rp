var requestUtilPath;
if (window.location.host && window.location.host != '') { // launching when address to web-page
  requestUtilPath = "/-/speak/v1/contenttesting/RequestUtil.js";
}
else { // launching of the code-coverage estemating
  require.config({
    paths: {
      requestUtilPath: contentTestingDir + "/Common/lib/RequestUtil"
    },
  });
  requestUtilPath = "requestUtilPath";
}

define([
    "sitecore",
    requestUtilPath],
  function (Sitecore, requestUtil) {
    var actionUrl = "/sitecore/shell/api/ct/TestObjectives/GetTestObjectives";

    var model = Sitecore.Definitions.Models.ControlModel.extend({
      initialize: function (options) {
        this._super();

        this.set("excludeItems", "");
        this.set("items", []);
        this.set("totalItems", 0);
        this.set("page", 1);
        this.set("pageSize", 5);
        this.set("searchTerm", "");
        
        this.on("change:searchTerm change:page", this.refresh, this);
      },

      refresh: function () {
        var excludeItems = this.get("excludeItems") || "";
        if (this.changed.searchTerm != undefined){
          this.set("page", 1, {silent: true});
        }
        
        var page = this.get("page");
        var pageSize = this.get("pageSize");
        var searchTerm = this.get("searchTerm");
        /*var parameters = (excludeListParameter === undefined || excludeListParameter === "")
          ? ""
          : "?excludeitems=" + excludeListParameter;*/

        /*var contentLanguage = this.get("contentLanguage");
        if (contentLanguage != null) {
          parameters = (parameters == "") ? "?" : "&";
          parameters += "scLanguage=" + contentLanguage;
        }*/

        var url = Sitecore.Helpers.url.addQueryParameters(actionUrl, {
          excludeitems: excludeItems
        });
        
        url = Sitecore.Helpers.url.addQueryParameters(url, {
          "page": page
        });
        
        url = Sitecore.Helpers.url.addQueryParameters(url, {
          "pageSize": pageSize
        });
        
        url = Sitecore.Helpers.url.addQueryParameters(url, {
          "query": searchTerm
        });
        
        

        var ajaxOptions = {
          cache: false,
          url: url,
          context: this,
          success: function (data) {
            this.set({"items": data.items,"totalItems": data.totalResults});
          }
        };

        requestUtil.performRequest(ajaxOptions);
      }
    });

    var view = Sitecore.Definitions.Views.ControlView.extend({
      initialize: function (options) {
        //this._super();

        this.model.set("excludeItems", this.$el.attr("data-sc-excludeItems") || "");
        this.model.set("items", this.$el.attr("data-sc-items") || []);
        this.model.set("contentLanguage", this.$el.attr("data-sc-contentLanguage"));

        this.model.refresh();
      }
    });

    Sitecore.Factories.createComponent("TestObjectivesDataSource", model, view, ".sc-TestObjectivesDataSource");
  });
