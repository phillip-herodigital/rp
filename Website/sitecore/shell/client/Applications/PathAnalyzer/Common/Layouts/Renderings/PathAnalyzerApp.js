define(["sitecore", "/-/speak/v1/pathanalyzer/PathAnalyzer.js"], function (Sitecore, pathAnalyzer) {
    Sitecore.Factories.createBaseComponent({
        name: "PathAnalyzerApp",
        base: "ControlBase",
        selector: ".sc-PathAnalyzerApp",
        attributes: [
        ],

        extendModel: {
        },

        initialize: function () {
          pathAnalyzer.on("contextchanged", this.contextChanged, this);
          //var self = this;
          //Bus.instance().subscribe("query:changed", function (data) { self.queryChanged(data); }, true);
        },

        afterRender: function () {
          var treeDef = pathAnalyzer.get("treeDefinition");
          this.displayMapBuildStatus(treeDef);
        },

        contextChanged: function (data) {
            this.displayMapBuildStatus(data.treeDefinitionId);
        },

        displayMapBuildStatus: function (mapId) {
          var token = $('input[name=__RequestVerificationToken]').val();

          var messageId = "MapStatus";
          var messageBar = pathAnalyzer.get("messageBar");
          //remove existing status message, otherwise new notifications are just appended to the notification list.
          //this also clears the message each time the data are updated.
          messageBar.removeMessage(function (msg) { return msg.id === messageId; });

          var dictionary = pathAnalyzer.get("stringDictionary");

          $.ajax({
            url: "/sitecore/api/PathAnalyzer/TreeDefinition/GetStatus",
            method: "GET",
            data: { "treedefinitionid": mapId, "ignorecache": true },
            dataType: "json",
            headers: { "X-RequestVerificationToken": token }
          })
          .done(function (data) {
              if (!data) {
                  return;
              }
              for (var i = 0; i < data.length; i++) {
                var message = data[i];
                if (message) {
                    pathAnalyzer.showMessage(messageBar, message.Type, { text: message.Text, id: messageId, closable: true, actions: [] });
                }
              }
           })
          .fail(function (data) {
              pathAnalyzer.showMessage(messageBar, "error", { text: dictionary.get("ErrorRetrievingMapBuildStatus"), id: messageId });
          })
          .always(function (data) {

          });
        }
    });
});
