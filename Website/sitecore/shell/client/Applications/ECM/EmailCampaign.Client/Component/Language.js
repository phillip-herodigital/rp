define(["sitecore", "/-/speak/v1/ecm/Messages.js", "/-/speak/v1/ecm/ServerRequest.js", "/-/speak/v1/ecm/LanguageSwitcher.js"],
  function (sitecore) {
    return {
      initLanguage: function (contextApp) {
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

        languageSwitcher.on("change:selectedReportLanguage", function () {
          var newReportLanguage = languageSwitcher.get("selectedReportLanguage");
          messageContext.set("selectedReportLanguage", newReportLanguage);
          messageContext.setMessagePerformanceFields(newReportLanguage);
        });

        contextApp.on("language:copyattachmentfromlanguage", copyAttachmentFromLanguage, this);

        sitecore.on("change:messageContext", function () {
          // disable the language switcher if there is only one language
          if (contextApp.LanguageSwitcher.viewModel.getAvailableLanguagesList().length == 1) {
            languageSwitcher.set("isEnabledMenu", false);
            languageSwitcher.viewModel.$el.find('a.btn').addClass("disabled");
          } else {
            languageSwitcher.set("isEnabledMenu", true);
            languageSwitcher.viewModel.$el.find('a.btn').removeClass("disabled");
          }

          if (contextApp.MessageContext.get("messageState") != 0) {
            // hide non-used languages
            contextApp.LanguageSwitcher.viewModel.$el.find(".sc-actionMenu-item").not(".language-all").not(".selected").hide();

            if (contextApp.LanguageSwitcher.viewModel.$el.find(".sc-actionMenu-item").not(".language-all").not(".selected").length == 1) {
              languageSwitcher.set("isEnabledMenu", false);
              languageSwitcher.viewModel.$el.find('a.btn').addClass("disabled");
            }
          }
        });

        // if the language is changed...
        languageSwitcher.on("change:selectedLanguage", function () {

          // if the context language and the new language are the same we do nothing as this could be caused by save failing
          var newLanguage = languageSwitcher.get("selectedLanguage");

          var currentLanguage = messageContext.get("language");
          if (newLanguage == currentLanguage) {
            return;
          }

          // save the message, if modified
          if (messageContext.get("isModified") && !saveMessage(messageContext, messageBar, currentLanguage, contextApp, sitecore)) {
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
          var context = clone(contextApp.currentContext);
          sitecore.Pipelines.CopyAttachmentFromLanguage.execute({ app: contextApp, currentContext: context });
        }

        function findLanguageName(language) {
          var result;
          var id = "data-isocode";
          $.each(contextApp.LanguageSwitcher.viewModel.$el.find('*[' + id + ']'), function () {
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

          var context = clone(contextApp.currentContext);

          sitecore.Pipelines.AddLanguage.execute({ app: contextApp, currentContext: context });

          return context.languageAdded;
        }

        function switchLanguage(messageId, language) {
          if (!contextApp || !messageId || !language) {
            return false;
          }

          var context = {
            messageId: messageId,
            language: language,
            languageSwitched: false
          };

          postServerRequest("ecm.addlanguage.onlyswitch", context, function (response) {
            if (response.error) {
              context.currentContext.messageBar.addMessage("error", response.errorMessage);
              context.aborted = true;
              return;
            }

            if (response.value) {
              context.languageSwitched = true;
            }
          }, false);
          console.log(context.language + " : " + context.languageSwitched);
          return context.languageSwitched;
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