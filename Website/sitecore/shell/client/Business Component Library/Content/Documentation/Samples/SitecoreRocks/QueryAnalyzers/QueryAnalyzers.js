define(["jquery", "sitecore"], function ($, Sitecore) {
  var queryAnalyzer = Sitecore.Definitions.App.extend({
    initialized: function () {
      require(["css!/-/speak/v1/client/queryanalyzer.css"]);
      this.QueryTextArea.set("text", "help;");

      this.on("page:execute", this.execute, this);
      this.WebService.on("change:response", this.updateResult, this);
    },
    
    execute: function () {
      var queryText = this.QueryTextArea.get("text");
      var webService = this.WebService;

      webService.set("parameters", { typeName: "QueryAnalyzer.Run", parameters: [ "master", "", queryText, "0" ], userName: "sitecore\\admin", password: "b" });

      webService.refresh();
    },
    
    updateResult: function () {
      var json = this.WebService.getJson();
      
      var executeResult = json.Body.ExecuteResponse.ExecuteResult;

      if (executeResult.indexOf("***ERROR***") == 0) {
        this.ResultPane.set("data", null);
        this.ResultPane.set("hasResponse", false);
        alert(executeResult.substr(71));
      } else {
        var data = this.WebService.xml2json(executeResult);
        this.ResultPane.set("data", data);
      }

      this.trigger("focus:QueryTextArea");
    }
  });

  return queryAnalyzer;
});
