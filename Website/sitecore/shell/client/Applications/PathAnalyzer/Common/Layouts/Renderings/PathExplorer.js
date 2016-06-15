define(["sitecore", "/-/speak/v1/pathanalyzer/PathAnalyzer.js", "jquery", "/-/speak/v1/pathanalyzer/spider.js"], function (Sitecore, pathAnalyzer, jQuery, spider) {
    var pathExplorer = Sitecore.Definitions.App.extend({
        cookiePrefix: "scPathAnalyzer_",

        initialize: function () {
          Sitecore.on("OpenDialog", this.openDialogWindow, this);
          Sitecore.on("MapDataUpdated", this.mapDataUpdated, this);
        },

        openDialogWindow: function (params) {
            var url = "/sitecore/client/applications/PathAnalyzer/PageAnalyzerDialog?id=" + params.id + "&n=" + params.name + "&treeDefinition=" + params.treeId + "&dateFrom=" + params.startDate + "&dateTo=" + params.endDate;
            this.PageAnalyzerFrame.set("sourceUrl", url);

            var appName = this.PageAnalyzerFrameTitle.get("text");
            $(".sc-dialogWindow-header-title").html(appName + " - " + params.name);
            this.AnalyzeItemWindow.show();
        },

        mapDataUpdated: function (params) {
          var mapData = jQuery.parseJSON(params.mapData);

          this.displayFilterMessage(mapData);
        },

        displayFilterMessage: function (mapData) {
          var messageId = "ShowingXofYNodes";
          var messageBar = pathAnalyzer.get("messageBar");
          //remove existing "showing x of y nodes message", otherwise new notifications are just appended to the notification list.
          //this also clears the message each time the data are updated.
          messageBar.removeMessage(function (msg) { return msg.id === messageId; });

          if (isNaN(mapData.postConversionNodeCount) || isNaN(mapData.originalNodeCount)) {
            return;
          }

          //don't show the message if the node counts match
          if (mapData.postConversionNodeCount === mapData.originalNodeCount) {
            return;
          }

          var stringDictionary = pathAnalyzer.get("stringDictionary");
          var message = stringDictionary.get(messageId).replace('{0}', mapData.postConversionNodeCount).replace('{1}', mapData.originalNodeCount);

          pathAnalyzer.showMessage(messageBar, "notification", { text: message, id: messageId });
        }
    });

    return pathExplorer;
});

function OpenSelectRootDialog() {
    var control = document.getElementById("scSilverlightPathExplorer");
    control.Content.PathMapCreation.RootSelected("110D559F-DEA5-42EA-9C1C-8A5DF7E70EF9|Home");
}

function OpenSelectFiltersDialog() {
    var control = document.getElementById("scSilverlightPathExplorer");
    control.Content.PathMapCreation.FilterSelected("110D559F-DEA5-42EA-9C1C-8A5DF7E70EF9|110D559F-DEA5-42EA-9C1C-8A5DF7E70EF9|110D559F-DEA5-42EA-9C1C-8A5DF7E70EF9");
}

function OpenImage(url, height) {
    setTimeout(function () {

        var dialogUrl = url;
        var dialogStyle = "dialogWidth: 500px; dialogHeight: " + height + "px; resizable: yes";
        var returnValue = showModalDialog(dialogUrl, null, dialogStyle);

        if (typeof (returnValue) == "undefined") {
            return;
        }
    }
   , 100);
}

function OpenNewTab(url) {
    setTimeout(function () {
        var myWindow = window.open(url.toString(), "_blank", "toolbar=no, scrollbars=yes, width=1200px, height=600px, resizable: yes");
    }
   , 100);
}

function OpenDialogWindow(id, name, treeId, startDate, endDate) {
    setTimeout(function () {
        _sc.trigger("OpenDialog", { id: id, name: name, treeId: treeId, startDate: startDate, endDate: endDate });
    }, 100);
}

function MapDataUpdated(mapData) {
  setTimeout(function() {
    _sc.trigger('MapDataUpdated', { mapData: mapData });
  }, 100);
}

function PA_AuthenticatedCheck() {
  setTimeout(function() {
    var token = _sc.Helpers.antiForgery.getAntiForgeryToken();

    var ajaxSettings = {
      url: "/sitecore/api/PathAnalyzer/Authentication/IsAuthenticationTicketExpired",
      type: "GET",
      data: {},
      cache: false,
      headers: { "X-RequestVerificationToken": token.value }
    };

    $.ajax(ajaxSettings)
    .done(function (data) {
      if (data) {
        window.top.location.reload(true);
      }
    });

  }, 100);
}
