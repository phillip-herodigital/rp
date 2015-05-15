define(["sitecore"], function (Sitecore) {
    var pathExplorer = Sitecore.Definitions.App.extend({
        cookiePrefix: "scPathAnalyzer_",

        initialize: function () {
            Sitecore.on("OpenDialog", this.openDialogWindow, this);
        },

        openDialogWindow: function (params) {
            var url = "/sitecore/client/applications/PathAnalyzer/PageAnalyzerDialog?id=" + params.id + "&n=" + params.name + "&treeDefinition=" + params.treeId + "&dateFrom=" + params.startDate + "&dateTo=" + params.endDate;
            this.PageAnalyzerFrame.set("sourceUrl", url);

            var appName = this.PageAnalyzerFrameTitle.get("text");
            $(".sc-dialogWindow-header-title").html(appName + " - " + params.name);
            this.AnalyzeItemWindow.show();
        }
    });

    return pathExplorer;
});

function OpenSelectRootDialog() {
    var control = document.getElementById("scSilverlightPathExplorer");
    control.Content.PathMapCreation.RootSelected("110D559F-DEA5-42EA-9C1C-8A5DF7E70EF9|Home");
};

function OpenSelectFiltersDialog() {
    var control = document.getElementById("scSilverlightPathExplorer");
    control.Content.PathMapCreation.FilterSelected("110D559F-DEA5-42EA-9C1C-8A5DF7E70EF9|110D559F-DEA5-42EA-9C1C-8A5DF7E70EF9|110D559F-DEA5-42EA-9C1C-8A5DF7E70EF9");
};

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
};

function OpenNewTab(url) {
    setTimeout(function () {
        var myWindow = window.open(url.toString(), "_blank", "toolbar=no, scrollbars=yes, width=1200px, height=600px, resizable: yes");
    }
   , 100);
};

function OpenDialogWindow(id, name, treeId, startDate, endDate) {
    setTimeout(function () {
        _sc.trigger("OpenDialog", { id: id, name: name, treeId: treeId, startDate: startDate, endDate: endDate });
    }, 100);
};