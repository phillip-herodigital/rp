define(["sitecore", "/-/speak/v1/controls/webservicedatasource.js"], function(sitecore, webService) {
    "use strict";

    var model = sitecore.Definitions.Models.WebServiceDataSource.extend(
      {
        initialize: function (attributes) {
          this._super();
        },

        request: function (options) {
          if (options.data.typeName.indexOf("Sitecore.Rocks.Server.Requests.") != 0) {
            options.data.typeName = "Sitecore.Rocks.Server.Requests." + options.data.typeName;
          }

          $.hardrockwebservice(options);
        }
      }
    );

    var view = sitecore.Definitions.Views.WebServiceDataSource.extend(
      {
        initialize: function(options) {
          this._super();
        }
      }
    );

    sitecore.Factories.createComponent("HardRockWebService", model, view, "script[type='text/x-sitecore-hardrockwebservice']");
  });