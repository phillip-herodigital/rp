define([
        "sitecore",
        "/-/speak/v1/ecm/constants.js",
        "/-/speak/v1/ecm/ServerRequest.js",
        "/-/speak/v1/ecm/MessageValidationService.js",
        "/-/speak/v1/ecm/LanguageSwitcher.js"
    ],
    function(sitecore, Constants, ServerRequest, MessageValidationService) {
        return {
            initLanguage: function(contextApp) {
                if (!contextApp) {
                    return;
                }

                var messageContext = contextApp.MessageContext;
                var languageSwitcher = contextApp.LanguageSwitcher;
                languageSwitcher.set("selectedReportLanguage", "0");

                var messageBar = contextApp.MessageBar;
                var defaultLanguage = languageSwitcher.get("selectedLanguage");
                messageContext.set("language", defaultLanguage);
                messageContext.set("languageName", findLanguageName(defaultLanguage));

                languageSwitcher.on("change:selectedReportLanguage", function() {
                    var newReportLanguage = languageSwitcher.get("selectedReportLanguage");
                    messageContext.set("selectedReportLanguage", newReportLanguage);
                });

                contextApp.on("language:copyattachmentfromlanguage", copyAttachmentFromLanguage, this);

                // change:MessageContext triggered very often, to improve performance better to use _.debounce
                var onChangeMessageContext = _.debounce(function() {
                    languageSwitcher.viewModel.setSelectedLanguages(messageContext.get("languages"));

                    if (
                        contextApp.MessageContext.get("messageState") != Constants.MessageStates.DRAFT &&
                            contextApp.MessageContext.get("messageState") != Constants.MessageStates.INACTIVE) {
                        // hide non-used languages
                        contextApp.LanguageSwitcher.viewModel.$el.find(".sc-actionMenu-item").not(".language-all").not(".selected").hide();

                        if (contextApp.LanguageSwitcher.viewModel.$el.find(".sc-actionMenu-item.selected").not(".language-all").length == 1) {
                            languageSwitcher.set('isEnabled', false);
                        }
                    } else {
                        contextApp.LanguageSwitcher.viewModel.$el.find(".sc-actionMenu-item").not(".language-all").not(".selected").show();

                        if (contextApp.LanguageSwitcher.viewModel.$el.find(".sc-actionMenu-item").not(".language-all").length > 1) {
                            languageSwitcher.set('isEnabled', true);
                        } else {
                            languageSwitcher.set('isEnabled', false);
                        }
                    }
                }, 50);

                sitecore.on("change:messageContext", onChangeMessageContext);
                contextApp.MessageContext.on("change:messageState", onChangeMessageContext);

                // if the language is changed...
                languageSwitcher.on("change:selectedLanguage", function() {

                    // if the context language and the new language are the same we do nothing as this could be caused by save failing
                    var newLanguage = languageSwitcher.get("selectedLanguage");

                    var currentLanguage = messageContext.get("language");
                    if (newLanguage == currentLanguage) {
                        return;
                    }

                    // save the message, if modified
                    if (messageContext.get("isModified") && !messageContext.saveMessage(messageContext, messageBar, currentLanguage, contextApp, sitecore)) {
                        languageSwitcher.viewModel.setSelectedLanguage(currentLanguage);
                        return;
                    }

                    if (!MessageValidationService.validateMessageVariantsSubject(contextApp.MessageContext.get("variants"))) {
                        languageSwitcher.viewModel.setSelectedLanguage(currentLanguage);
                        return;
                    }

                    // prepare languages array
                    messageContext.set("languages", languageSwitcher.viewModel.getLanguageList(contextApp));

                    // do we need create the language?
                    if (!languageExists(newLanguage)) {
                        var addResult = addLanguage(messageContext.get("messageId"), currentLanguage, newLanguage);
                        if (!addResult) {
                            languageSwitcher.viewModel.setSelectedLanguage(currentLanguage);
                            return;
                        } else {
                            languageSwitcher.viewModel.languageAdded(newLanguage);
                            languageSwitcher.viewModel.setSelectedLanguage(newLanguage);
                            languageSwitcher.viewModel.getLanguageList(contextApp);
                            sitecore.trigger("language:addednew");
                        }
                    } else {
                        //only switch
                        var switchResult = switchLanguage(messageContext.get("messageId"), newLanguage);
                        languageSwitcher.viewModel.setSelectedLanguage(newLanguage);
                    }

                    // change the context language
                    messageContext.set("language", newLanguage);
                    messageContext.set("languageName", findLanguageName(newLanguage));
                });

                function copyAttachmentFromLanguage(args) {
                    contextApp.currentContext = { fromLanguage: args.fromLanguage, toLanguage: args.toLanguage, messageId: messageContext.get("messageId"), messageBar: contextApp.MessageBar };
                    var context = _.clone(contextApp.currentContext);
                    sitecore.Pipelines.CopyAttachmentFromLanguage.execute({ app: contextApp, currentContext: context });
                }

                function findLanguageName(language) {
                    var result;
                    var id = "data-isocode";
                    $.each(contextApp.LanguageSwitcher.viewModel.$el.find('*[' + id + ']'), function() {
                        if ($(this).attr(id) == language) {
                            result = $(this).text();
                            return;
                        }
                    });

                    return result;
                }

                function addLanguage(messageId, currentLanguage, newLanguage) {
                    if (!contextApp || !messageId || !messageBar || !currentLanguage || !newLanguage) {
                        return false;
                    }

                    contextApp.currentContext = {
                        messageId: messageId,
                        language: currentLanguage,
                        newLanguage: newLanguage,
                        languageAdded: false,
                        messageBar: messageBar
                    };

                    var context = _.clone(contextApp.currentContext);

                    sitecore.Pipelines.AddLanguage.execute({ app: contextApp, currentContext: context });

                    return context.languageAdded;
                }

                function switchLanguage(messageId, language) {
                    if (!contextApp || !messageId || !language) {
                        return false;
                    }

                    var context = {
                        messageId: messageId,
                        language: language
                    };

                    var languageSwitched = false;

                    contextApp.PageProgressIndicator.set('isBusy', true);
                    ServerRequest(Constants.ServerRequests.SWITCH_LANGUAGE, {
                        data: context,
                        success: function(response) {
                            contextApp.PageProgressIndicator.set('isBusy', false);
                            if (response.error) {
                                var messagetoAddError = { id: "error.ecm.language.switch", text: response.errorMessage, actions: [], closable: true };
                                contextApp.MessageBar.addMessage("error", messagetoAddError);
                                messageContext.refresh();
                                context.aborted = true;
                                return;
                            }

                            if (response.value) {
                                languageSwitched = true;
                            }
                        },
                        error: function() {
                            contextApp.PageProgressIndicator.set('isBusy', false);
                        }
                    });

                    return languageSwitched;
                }

                function languageExists(newLanguage) {
                    if (!messageContext || !newLanguage) {
                        return false;
                    }

                    return _.contains(messageContext.get("languages"), newLanguage);
                }
            }
        };
    });