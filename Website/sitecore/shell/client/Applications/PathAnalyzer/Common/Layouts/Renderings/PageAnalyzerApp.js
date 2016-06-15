require.config({
    paths: {
        spiderApp: '/-/speak/v1/pathanalyzer/spider'
    }
});

define(["sitecore",
        "jquery",
        "/-/speak/v1/pathanalyzer/PathAnalyzer.js",
        "spiderApp",
        "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/userProfile.js",
        "css!/-/speak/v1/pathanalyzer/spider.css",
        "css!/-/speak/v1/pathanalyzer/pageAnalyzer.css"],
    function (Sitecore, $, pa, spiderApp, userProfile) {
        var dispatch = pa.getDispatch();

        Sitecore.Factories.createBaseComponent({
            name: "PageAnalyzerApp",
            base: "ControlBase",
            selector: ".sc-PageAnalyzerApp",
            attributes: [
                { name: "treeId", defaultValue: null, value: "$el.data:sc-treeid" },
                { name: "startDate", defaultValue: null, value: "$el.data:sc-initialstartdate" },
                { name: "endDate", defaultValue: null, value: "$el.data:sc-initialenddate" },
                { name: "nodeGroupingOption", defaultValue: null, value: "$el.data:sc-nodegroupingoption" },
                { name: "pathSignificanceFilterValue", defaultValue: null, value: "$el.data:sc-pathsignificancefiltervalue" },
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

                new spiderApp.Application(900, 600, dispatch, true, this.app.StringDictionaryDomain).init();
                dispatch.contextchanged(this.getParams());

                var pageName = this.getParameterByName('n');

                if (this.app.HeaderTitle) {
                    var title = this.app.HeaderTitle.viewModel.text();
                    this.app.HeaderTitle.set("text", title + " - " + pageName);
                }

                var self = this;
                dispatch.on("dataloaded.host", function () {
                    self.app.MessageBar.removeMessages();
                    var treeId = self.model.get("treeId");
                    self.displayMapBuildStatus(treeId);
                    self.app.ProgressIndicator.set("isBusy", 0);
                });

                dispatch.on("pathclick.host", function (path) {
                    self.showContacts(path.pid);
                });

                dispatch.on("reset.host", function (path) {
                    self.hideContacts();
                });

                dispatch.on("baddata.host", function (error) {
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

                dispatch.on("nodata.host", function () {
                    var messageText = self.app.StringDictionaryDomain.get("NoData");
                    self.app.MessageBar.addMessage("notification", { text: messageText, actions: [], closable: true });
                    self.app.ProgressIndicator.set("isBusy", 0);
                });
            },

            attachEvents: function () {

                pa.on("contextchanged", this.reload, this);

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
            hideContacts: function () {
                this.app.ContactsSmartPanel.set("isOpen", 0);
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
                var params = this.getParams();
                params += "&path=" + pathId;
                var uri = "/sitecore/api/PathAnalyzer/ContactsByPath" + params;

                var requestOptions = {
                    parameters: null,
                    url: uri
                };

                this.app.ContactsDataProvider.viewModel.getData(requestOptions);
            },
            reload: function (context) {
                this.app.ProgressIndicator.set("isBusy", 1);
                this.updateContext(context);
                dispatch.contextchanged(this.getParams());
            },
            updateContext: function (context) {
                this.model.set("treeId", context.treeDefinitionId);
                this.model.set("startDate", context.startDate);
                this.model.set("endDate", context.endDate);
                this.model.set("nodeGroupingOption", context.group);
                this.model.set("pathSignificanceFilterValue", context.pathfilter);
            },
            getParams: function () {
                var itemId = this.getParameterByName('id');
                return '?treedefinitionid=' + this.model.get("treeId") + '&itemid=' + itemId + '&start=' + this.model.get("startDate") + '&end=' + this.model.get("endDate") + '&group=' + this.model.get("nodeGroupingOption") + '&pathfilter=' + this.model.get("pathSignificanceFilterValue");
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
            },

            displayFilterMessage: function (data) {
                var messageId = "DisplayingFilteredMapData";

                this.app.MessageBar.removeMessage(function (msg) { return msg.id === messageId; });

                if (!data || isNaN(data.postConversionNodeCount) || isNaN(data.originalNodeCount)) {
                    return;
                }

                if (data.originalNodeCount !== data.postConversionNodeCount) {
                    var messageObj = {
                        text: this.app.StringDictionaryDomain.get(messageId),
                        actions: [],
                        closable: true,
                        id: messageId
                    };

                    this.app.MessageBar.addMessage("notification", messageObj);
                }
            },

            displayMapBuildStatus: function (mapId) {
                var token = $('input[name=__RequestVerificationToken]').val();

                var messageId = "MapStatus";
                var messageBar = this.app.MessageBar;
                //remove existing status message, otherwise new notifications are just appended to the notification list.
                //this also clears the message each time the data are updated.
                messageBar.removeMessage(function (msg) { return msg.id === messageId; });

                var stringDictionary = this.app.StringDictionaryDomain;

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
                            var messageObj = {
                                text: message.Text,
                                actions: [],
                                closable: true,
                                id: messageId
                            };
                            messageBar.addMessage(message.Type, messageObj);
                        }
                    }
                })
                .fail(function (data) {
                    var message = stringDictionary.get("ErrorRetrievingMapBuildStatus");
                    var messageObj = {
                        text: message,
                        actions: [],
                        closable: true,
                        id: messageId
                    };
                    messageBar.addMessage("error", messageObj);
                })
                .always(function (data) {

                });
            }
        });
    });
