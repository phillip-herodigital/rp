define([
        "sitecore",
        "/-/speak/v1/pathanalyzer/libs/d3.min.js",
        "jquery",
        "/-/speak/v1/pathanalyzer/spider.js",
        "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/userProfile.js",
        "css!/-/speak/v1/pathanalyzer/spider.css",
        "css!/-/speak/v1/pathanalyzer/pageAnalyzer.css"
],
    function (Sitecore, d3, $, spider, userProfile) {
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
                this.attachEvents();

                this.model.set("userProfileKey", this.$el.data("sc-userprofilekey"));

                userProfile.init(this);
                userProfile.get(this, function (state) {
                    this.model.set("appstate", state);
                    var hideLegend = this.model.get("appstate").hideLegend;
                    this.app.LegendSmartPanel.set("isOpen", !hideLegend);
                    this.app.NeverShowLegendAgainCheckbox.set("isChecked", hideLegend);
                }, { stateDataAttributeName: "sc-appstate" });


                var mapId = this.model.get("treeId");
                var startDate = this.model.get("startDate");
                var endDate = this.model.get("endDate");
                var stringDictionary = this.app.StringDictionaryDomain;
                var uriResolver = new ServiceUriResolver("/sitecore/api/PathAnalyzer/Paths", mapId, startDate, endDate);
                new Application(500, 900, uriResolver, stringDictionary).initialize();

                var pageName = this.getParameterByName('n');

                if (this.app.HeaderTitle) {
                    var title = this.app.HeaderTitle.viewModel.text();
                    this.app.HeaderTitle.set("text", title + " - " + pageName);
                }

                var self = this;
                Bus.instance().subscribe("click", function (path) {
                    if (path) {
                        self.showContacts(path.id);
                    }
                });

                Bus.instance().subscribe("reset", function () {
                    self.app.ContactsSmartPanel.set("isOpen", 0);
                });

                Bus.instance().subscribe("query:changed", function () {
                    self.app.ProgressIndicator.set("isBusy", 1);
                });

                Bus.instance().subscribe("data:error", function (error) {
                    if (error) {
                        var type = "notification";
                        if (error.status !== 404) {
                            type = "error";
                        }

                        // messagebar requires some error text
                        var errorText = self.app.StringDictionaryDomain.get("ErrorRequest");
                        if (error.responseText) {
                            try {
                                var response = $.parseJSON(error.responseText);
                                if (response && response.message)
                                    errorText = response.message;
                            } catch (e) {
                                errorText = error.responseText;
                            }
                        }

                        var message = {
                            text: errorText,
                            actions: [],
                            closable: true
                        };
                        self.app.MessageBar.addMessage(type, message);
                    }
                    self.app.ProgressIndicator.set("isBusy", 0);
                });

                Bus.instance().subscribe("data:empty", function () {
                    var messageText = self.app.StringDictionaryDomain.get("NoData");
                    self.app.MessageBar.addMessage("notification", { text: messageText, actions: [], closable: true });
                    self.app.ProgressIndicator.set("isBusy", 0);
                });

                Bus.instance().subscribe("data:loaded", function () {
                    self.app.MessageBar.removeMessages();
                    self.app.ProgressIndicator.set("isBusy", 0);
                });

                Bus.instance().subscribe("data:updated", function () {
                    self.app.MessageBar.removeMessages();
                    self.app.ProgressIndicator.set("isBusy", 0);
                });
            },

            attachEvents: function () {
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
                var uri = "/sitecore/api/PathAnalyzer/ContactsByPath?treedefinitionid=" + treeId + "&start=" + startDate + "&end=" + endDate + "&path=" + path;

                var requestOptions = {
                    parameters: null,
                    url: uri
                };

                this.app.ContactsDataProvider.viewModel.getData(requestOptions);
            },
            setContactData: function (args) {
                var subapp = args.app;
                var app = this.app;
                var data = args.data;
                var contactId = data.Id;
                subapp.contactId = contactId;

                var dataUri = "/sitecore/api/ao/v1/contacts/" + contactId + "/image?w=72&h=72";
                var detailUri = "/sitecore/api/ao/redir/cc?skinnymode=1&cid=" + contactId;

                subapp.Photo.set("imageUrl", dataUri);
                subapp.ContactName.set("navigateUrl", "#");

                subapp.ContactName.viewModel.$el.on("click", function () {
                    app.xfileFrame.set("sourceUrl", detailUri);
                    app.xfileDialogWindow.show();
                    return false;
                });

                subapp.Photo.viewModel.$el.on("click", function () {
                    app.xfileFrame.set("sourceUrl", detailUri);
                    app.xfileDialogWindow.show();
                });

                subapp.ContactName.set("text", data.Name);
                subapp.ContactEmail.set("text", data.Email);
                subapp.VisitsLabel.set("value", data.Visits);
                subapp.ValueLabel.set("value", data.Value);
            }
        });
    });