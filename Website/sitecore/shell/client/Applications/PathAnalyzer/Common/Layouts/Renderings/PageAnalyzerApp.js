
define(["sitecore",
        "css!/-/speak/v1/pathanalyzer/PageAnalyzerApp.css",
        "/-/speak/v1/pathanalyzer/PathAnalyzer.js",
        "/-/speak/v1/pathanalyzer/scripts/libs/d3.js",
        "/-/speak/v1/pathanalyzer/scripts/app/application.js",
        "/-/speak/v1/pathanalyzer/scripts/app/utils/eventManager.js",
        "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/userProfile.js"],
        function (Sitecore, css, pageAnalyzer, d3, pathAnalyzerApp, EventManager, userProfile) {
            Sitecore.Factories.createBaseComponent({
                name: "PageAnalyzerApp",
                base: "ControlBase",
                selector: ".sc-PageAnalyzerApp",
                attributes: [
                     { name: "treeId", defaultValue: null, value: "$el.data:sc-treeid" },
                     { name: "startDate", defaultValue: null, value: "$el.data:sc-initialstartdate" },
                     { name: "endDate", defaultValue: null, value: "$el.data:sc-initialenddate" },
                     { name: "userProfileKey", defaultValue: null }
                ],

                initialize: function () {
                    var treeId = this.model.get("treeId");
                    var startDate = this.model.get("startDate");
                    var endDate = this.model.get("endDate");
                    var stringDictionary = this.app.StringDictionaryDomain;

                    this.attachEvents();

                    this.model.set("userProfileKey", this.$el.data("sc-userprofilekey"));

                    userProfile.init(this);
                    userProfile.get(this, function (state) {
                        this.model.set("appstate", state);
                        var hideLegend = this.model.get("appstate").hideLegend;
                        this.app.LegendSmartPanel.set("isOpen", !hideLegend);
                        this.app.NeverShowLegendAgainCheckbox.set("isChecked", hideLegend);
                    }, { stateDataAttributeName: "sc-appstate" });

                    new pathAnalyzerApp.App(500, 900, treeId, startDate, endDate, '', stringDictionary).initialize();

                    var pageName = this.getParameterByName('n');

                    if (this.app.HeaderTitle) {
                        var title = this.app.HeaderTitle.viewModel.text();
                        this.app.HeaderTitle.set("text", title + " - " + pageName);
                    }
                },

                attachEvents: function () {

                    var self = this;
                    this.bus().subscribe("path:selected", function (path) {
                        if (path) {
                            self.showContacts(path.id);
                        }
                    });

                    this.bus().subscribe("reset", function () {
                        self.app.ContactsSmartPanel.set("isOpen", 0);
                    });

                    this.app.ContactsDataRepeater.on("subAppLoaded", this.setContactData, this);

                    this.app.ContactsDataProvider.on("change:data", function () {
                        var data = this.app.ContactsDataProvider.get("data");
                        this.app.ContactsDataRepeater.viewModel.reset();
                        this.app.ContactsDataRepeater.viewModel.addData(data);
                    }, this);

                    this.app.NeverShowLegendAgainCheckbox.on("change:isChecked", function () {
                        var toggled = this.app.NeverShowLegendAgainCheckbox.get("isChecked");
                        this.model.set("appstate", { hideLegend: toggled });
                        userProfile.update(this, this.model.get("appstate"));
                    }, this);
                },
                bus: function () {
                    return new EventManager.Bus();
                },
                showContacts: function (pathId) {
                    this.app.ContactsSmartPanel.set("isOpen", 1);
                    this.findContacts(pathId);
                },
                getParameterByName: function (name) {
                    var search = window.location;
                    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
                    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                        results = regex.exec(search);
                    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
                },
                findContacts: function (pathId) {
                    if (!pathId) {
                        return;
                    }

                    var treeId = this.model.get("treeId");
                    var startDate = this.model.get("startDate");
                    var endDate = this.model.get("endDate");
                    var path = pathId;
                    var uri = "/sitecore/api/PathAnalyzer/Paths/Contacts?treedefinitionid=" + treeId + "&start=" + startDate + "&end=" + endDate + "&path=" + path;

                    var requestOptions = {
                        parameters: null,
                        url: uri
                    };

                    this.app.ContactsDataProvider.viewModel.getData(requestOptions);
                },
                setContactData: function (args) {
                    var dataUriStem = "/sitecore/api/ao/v1/contacts/";
                    var detailUrlStem = "/sitecore/api/ao/redir/cc?skinnymode=1&cid=";
                    var subapp = args.app;
                    var app = this.app;
                    var data = args.data;
                    subapp.contactId = data.Id;
                    var self = this;

                    subapp.Photo.set("imageUrl", dataUriStem + data.Id + "/image?w=72&h=72");
                    subapp.ContactName.set("navigateUrl", "#");

                    subapp.ContactName.viewModel.$el.on("click", function () {
                        app.xfileFrame.set("sourceUrl", detailUrlStem + data.Id);
                        app.xfileDialogWindow.show();
                        return false;
                    });

                    subapp.Photo.viewModel.$el.on("click", function () {
                        app.xfileFrame.set("sourceUrl", detailUrlStem + data.Id);
                        app.xfileDialogWindow.show();
                    });

                    subapp.ContactName.set("text", data.Name);
                    subapp.ContactEmail.set("text", data.Email);
                    subapp.VisitsLabel.set("value", data.Visits);
                    subapp.ValueLabel.set("value", data.Value);
                }
            });
        });