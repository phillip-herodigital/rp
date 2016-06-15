 (function (speak) {

  require.config({
    paths: {
      baseDataSource: "/sitecore/shell/client/Business Component Library/version 2/Layouts/Renderings/Data/BaseDataSources/BaseDataSource"
    }
  });

  speak.component(["baseDataSource"], function (baseDataSource)  {
    
    return speak.extend(baseDataSource, {
      name: "ChartDataSource",

      loadData: function (serverRequestOptions) {
        "use strict";

        var serverRequestParameters = null,
          serverRequestOnSuccess = null,
          serverRequestUrl = this.ServiceUrl;

        if (serverRequestOptions) {
          serverRequestParameters = serverRequestOptions["parameters"],
          serverRequestOnSuccess = serverRequestOptions["onSuccess"],
          serverRequestUrl = serverRequestOptions["url"] ? serverRequestOptions["url"] : this.ServiceUrl;
        }

        var providerItemProperties = {
          "dateFrom": this.DateFrom,
          "dateTo": this.DateTo,
          "resolution": this.Resolution,
          "resolutionRange": this.ResolutionRange
        };
      
        this.performRequest(serverRequestUrl, providerItemProperties, serverRequestParameters, serverRequestOnSuccess);
                 
      },
    
      successHandler: function (jsonData) {        
      }

    });
  }, "ChartDataSource");
})(Sitecore.Speak);
