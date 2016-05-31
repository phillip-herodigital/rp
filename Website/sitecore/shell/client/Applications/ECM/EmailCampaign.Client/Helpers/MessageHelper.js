define([
  "sitecore",
  "/-/speak/v1/ecm/ServerRequest.js",
  "/-/speak/v1/ecm/Validation.js",
  "/-/speak/v1/ecm/DialogService.js",
  "/-/speak/v1/ecm/Cookies.js"
], function (
  sitecore,
  ServerRequest,
  Validation,
  DialogService
  ) {
  var MessageHelper = {
    MessageStates: {
      DRAFT: 0,
      DISPATCHSCHEDULED: 1,
      SENDING: 2,
      SENT: 3,
      INACTIVE: 4,
      ACTIVATIONSCHEDULED: 5,
      ACTIVE: 6,
      QUEUING: 7
    },
    SendingStates: {
      UNDEFINED: 0,
      INITIALIZATION: 1,
      QUEUING: 2,
      SENDING: 3,
      PAUSED: 4,
      FINISHING: 5,
      FINISHED: 6
    },
    openSelectedMessage: function(listControl) {
      if (listControl) {
        var selectedItem = listControl.get("selectedItem");
        if (selectedItem) {
          var url = selectedItem.get("url");
          if (url) {
            window.location.href = url;
          }
        }
      }
    },

    deleteSelectedMessage: function (dataSource, selectedItem, app, sitecore) {
      if (!selectedItem || !dataSource) {
        return;
      }
      app.currentContext = {
        messageId: selectedItem.get("itemId"),
        messageName: selectedItem.get("name"),
        datasource: dataSource
      };

      var ctx = _.clone(app.currentContext);

      sitecore.Pipelines.DeleteMessage.execute({ app: app, currentContext: ctx });
    },

    verifyMessage: function (sitecore, contextApp, actionName, callback) {
      var messageId = contextApp.MessageContext.get("messageId");
      if (contextApp.IncludedRecipientDataSource) {
        contextApp.IncludedRecipientDataSource.set("messageId", messageId);
        contextApp.IncludedRecipientDataSource.viewModel.refresh();

        if (actionName === "send" && MessageHelper.hasNoRecipient(contextApp.IncludedRecipientDataSource, contextApp.MessageContext.get("messageType"))) {
          DialogService.show('alert', { text: contextApp.StringDictionary.get("ECM.Pages.Message.ThereIsNoRecipient") });
          return false;
        }
      }

      if (actionName === "send" && !Validation.subjectIsEmpty(contextApp.MessageContext.get("variants"), contextApp.MessageBar, sitecore)) {
        return false;
      }

      if (contextApp.MessageContext.get("messageType") === "Triggered") {
        return true;
      }

      if (contextApp.ExcludedRecipientDataSource) {
        contextApp.ExcludedRecipientDataSource.set("messageId", messageId);
        contextApp.ExcludedRecipientDataSource.viewModel.refresh();
      }

      if (actionName === "save" && MessageHelper.hasNoRecipientList(contextApp.IncludedRecipientDataSource, contextApp.ExcludedRecipientDataSource)) {
        return true;
      }

      if (contextApp.IncludedRecipientDataSource || contextApp.ExcludedRecipientDataSource) {
        var includedListsMessage = contextApp.StringDictionary.get("ECM.Pages.Message.DefaultListsHaveNotBeenSpecifiedForThisMessage");
        var excludedListsMessage = contextApp.StringDictionary.get("ECM.Pages.Message.ThereIsNoDefaultListAssignedForOptOut");

        var verifyIncluded = MessageHelper.verifyLists(includedListsMessage, sitecore, contextApp, callback, contextApp.IncludedRecipientDataSource);
        if (verifyIncluded) {
          return MessageHelper.verifyLists(excludedListsMessage, sitecore, contextApp, callback, contextApp.ExcludedRecipientDataSource);
        }
      }
      return false;
    },

    saveMessage: function (messageContext, messageBar, language, app, sitecore) {
      if (!messageContext || !messageBar || !app)
        return false;

      if (app.IncludedRecipientDataSource) {
        app.IncludedRecipientDataSource.viewModel.refresh();
      }
      if (app.ExcludedRecipientDataSource) {
        app.ExcludedRecipientDataSource.viewModel.refresh();
      }

      var messageId = messageContext.get("messageId");
      var message = messageContext.getMessage();

      app.currentContext = {
        messageId: messageId,
        language: language,
        message: message,
        includedRecipientDataSource: app.IncludedRecipientDataSource,
        errorCount: 0,
        messageBar: messageBar
      };

      var context = _.clone(app.currentContext);

      // if the error count is above 0, we do not clear the flag
      sitecore.Pipelines.Validate.execute({ app: app, currentContext: context });
      if (context.errorCount > 0) {
        return false;
      }
      sitecore.Pipelines.SaveMessage.execute({ app: app, currentContext: context });

      if (context.refreshMessageContext) {
        messageContext.refresh();
      }

      if (context.errorCount > 0) {
        return false;
      }

      messageContext.set("isModified", false);
      return true;
    },

    copySelectedMessage: function (messageContext) {
      var context = {
        data: {
          messageId: messageContext.get('messageId'),
          messageName: messageContext.get('messageName')
        },
        messageContext: messageContext,
        aborted: false
      };

      sitecore.Pipelines.CopyToDraft.execute(context);
    },

    createNewMessage: function (messageContext, messageBar, language, app, sitecore) {
      if (!messageContext || !messageBar || !app) {
        return false;
      }
      if (!('messageTemplateId' in messageContext) || !('managerRootId' in messageContext)
        || !('messageName' in messageContext) || !('messageTypeTemplateId' in messageContext)) {
        return false;
      }

      var messageTemplateId = messageContext.messageTemplateId;
      var managerRootId = messageContext.managerRootId;
      var messageName = messageContext.messageName;
      var messageTypeTemplateId = messageContext.messageTypeTemplateId;

      app.currentContext = {
        messageTemplateId: messageTemplateId,
        managerRootId: managerRootId,
        messageName: messageName,
        language: language,
        messageTypeTemplateId: messageTypeTemplateId,
        errorCount: 0,
        messageBar: messageBar
      };

      var context = _.clone(app.currentContext);

      sitecore.Pipelines.CreateNewMessage.execute({ app: app, currentContext: context });
      if (context.errorCount > 0) {
        return false;
      }

      messageContext.newMessageId = context.newMessageId;
      return true;
    },

    createNewMessageFromImportHtml: function (messageContext, messageBar, language, app, sitecore) {
      if (!messageContext || !messageBar || !app) {
        return false;
      }
      if (!('messageTemplateId' in messageContext) || !('managerRootId' in messageContext) || !('messageName' in messageContext)
        || !('messageTypeTemplateId' in messageContext) || !('fileItemId' in messageContext) || !('fileName' in messageContext) || !('database' in messageContext)) {
        return false;
      }

      var messageTemplateId = messageContext.messageTemplateId;
      var managerRootId = messageContext.managerRootId;
      var messageName = messageContext.messageName;
      var messageTypeTemplateId = messageContext.messageTypeTemplateId;
      var fileItemId = messageContext.fileItemId;
      var fileName = messageContext.fileName;
      var database = messageContext.database;

      app.currentContext = {
        messageTemplateId: messageTemplateId,
        managerRootId: managerRootId,
        messageName: messageName,
        fileItemId: fileItemId,
        fileName: fileName,
        language: language,
        database: database,
        messageTypeTemplateId: messageTypeTemplateId,
        errorCount: 0,
        messageBar: messageBar
      };

      var context = _.clone(app.currentContext);

      sitecore.Pipelines.ImportNewHtmlLayout.execute({ app: app, currentContext: context });
      if (context.errorCount > 0) {
        return false;
      }

      sitecore.Pipelines.CreateNewMessage.execute({ app: app, currentContext: context });
      if (context.errorCount > 0) {
        return false;
      }

      messageContext.newMessageId = context.newMessageId;
      return true;
    },

    createNewMessageFromPreExistingPage: function (messageContext, messageBar, language, app, sitecore) {
      if (!messageContext || !messageBar || !app) {
        return false;
      }
      if (!('messageTemplateId' in messageContext) || !('managerRootId' in messageContext)
        || !('messageName' in messageContext) || !('messageTypeTemplateId' in messageContext)
        || !('existingPagePath' in messageContext) || !('databaseName' in messageContext)) {
        return false;
      }

      var messageTemplateId = messageContext.messageTemplateId;
      var managerRootId = messageContext.managerRootId;
      var messageName = messageContext.messageName;
      var messageTypeTemplateId = messageContext.messageTypeTemplateId;
      var existingPagePath = messageContext.existingPagePath;
      var databaseName = messageContext.databaseName;

      app.currentContext = {
        messageTemplateId: messageTemplateId,
        managerRootId: managerRootId,
        messageName: messageName,
        language: language,
        messageTypeTemplateId: messageTypeTemplateId,
        existingMessagePath: existingPagePath,
        databaseName: databaseName,
        errorCount: 0,
        messageBar: messageBar
      };

      var context = _.clone(app.currentContext);

      sitecore.Pipelines.AddPreExistingPage.execute({ app: app, currentContext: context });
      if (context.errorCount > 0) {
        return false;
      }

      messageContext.newMessageId = context.newMessageId;
      return true;
    },

    createNewTemplatesFromImportedDesign: function (messageContext, messageBar, app, sitecore) {
      if (!messageContext || !messageBar || !app) {
        return false;
      }
      if (!('importFolderId' in messageContext) || !('managerRootId' in messageContext) || !('messageTypeTemplateId' in messageContext)) {
        return false;
      }

      var importFolderId = messageContext.importFolderId;
      var managerRootId = messageContext.managerRootId;
      var messageTypeTemplateId = messageContext.messageTypeTemplateId;

      app.currentContext = {
        importFolderId: importFolderId,
        managerRootId: managerRootId,
        messageTypeTemplateId: messageTypeTemplateId,
        errorCount: 0,
        messageBar: messageBar
      };

      var context = _.clone(app.currentContext);

      sitecore.Pipelines.ImportNewDesign.execute({ app: app, currentContext: context });
      if (context.errorCount > 0) {
        return false;
      }
      messageContext.itemPath = context.itemPath;
      messageContext.messageTemplateId = context.messageTemplateId;
      if (context.errorMessage) {
        messageContext.errorMessage = context.errorMessage;
      }
      return true;
    },

    isCreateMessageAlreadyClicked: function (value) {
      var result = false;
      if (!sessionStorage.createMessageName) {
        sessionStorage.createMessageName = value;
      } else {
        if (sessionStorage.createMessageName === value) {
          result = true;
        }
      }
      return result;
    },

    promtWithoutSaving: function (messageContext, sitecore) {
      if (!messageContext) { return; }
      window.onbeforeunload = function () {
        if (messageContext.get("isModified")) {
          return sitecore.Resources.Dictionary.translate("ECM.MessagePage.SaveBeforeLeaving");
        }
      };
    },

    notFound: function (messageContext, sitecore, messageBar) {
      if (!messageBar || !messageContext) { return; }
      messageContext.on("change:messageNotFound", function () {
        messageBar.addMessage("error", sitecore.Resources.Dictionary.translate("ECM.MessagePage.MessagenotFound"));
      });
    },

    saveBackButtons: function (sitecore, contextApp) {
      if (!sitecore || !contextApp) {
        return;
      }
      var messageContext = contextApp.MessageContext;
      var messageBar = contextApp.MessageBar;
      if (!messageContext || !messageBar) {
        return;
      }

      var self = this;

      sitecore.on("message:save", function (args) {
        contextApp.trigger("message:save", args);
      });

      contextApp.on("message:save", function (args) {
        var verified = MessageHelper.verifyMessage(sitecore, contextApp, "save", MessageHelper.addCreatedEmptyList);
        args.Verified = verified;
        args.Saved = MessageHelper.saveMessage(messageContext, messageBar, messageContext.get("language"), contextApp, sitecore);
      });

      contextApp.on("message:back", function () {
        history.back();
      });
    },

    changeManagerRoot: function (contextApp) {
      // if the root manager id is change, redirect to the start page
      contextApp.EmailManagerRoot.on("change:managerRootId", function () {
        window.parent.location.replace("/sitecore/client/Applications/ECM/Pages/StartPage");
      });
    },

    setTimezoneCookie: function () {
      var timezoneCookie = "utcOffset";
      if (!$.cookie(timezoneCookie)) {
        $.cookie(timezoneCookie, new Date().getTimezoneOffset());
      }
      else {
        var storedOffset = parseInt($.cookie(timezoneCookie));
        var currentOffset = new Date().getTimezoneOffset();
        if (storedOffset !== currentOffset) {
          $.cookie(timezoneCookie, new Date().getTimezoneOffset());
        }
      }
    },

    verifyLists: function (notification, sitecore, contextApp, callback, dataSource) {
      var recipientLists = dataSource.get("recipientLists");
      if ((recipientLists.length == 0) || !recipientLists[0].default) {
        DialogService.show('confirm', {
          text: notification,
          on: {
            ok: function () {
              var recipientListType = dataSource.get("recipientListType");
              var sourceMessageId = dataSource.get("messageId");
              DialogService.show('addEmptyList', {
                ok: function (messageId, listId, listType) {
                  callback(sitecore, contextApp, messageId, listId, listType);
                },
                messageId: sourceMessageId,
                recipientListType: recipientListType
              });
            }
          }
        });
        return false;
      }
      return true;
    },

    hasNoRecipient: function (includedRecipientDataSource, messageType) {
      if (messageType === "Triggered") {
        return false;
      }

      if (!includedRecipientDataSource) {
        return true;
      }
      var recipientLists = includedRecipientDataSource.get("recipientLists");

      for (var i = 0; i < recipientLists.length; i++) {
        if (recipientLists[i].recipients > 0) {
          return false;
        }
      }
      return true;
    },

    hasNoRecipientList: function (includedRecipientDataSource, excludedRecipientDataSource) {
      if (!includedRecipientDataSource && !excludedRecipientDataSource) {
        return true;
      }
      var noIncludedRecipientList = true;
      var noExcludedRecipientList = true;
      if (includedRecipientDataSource && includedRecipientDataSource.get("recipientLists").length > 0) {
        noIncludedRecipientList = false;
      }
      if (excludedRecipientDataSource && excludedRecipientDataSource.get("recipientLists").length > 0) {
        noExcludedRecipientList = false;
      }

      return noIncludedRecipientList && noExcludedRecipientList;
    },

    addCreatedEmptyList: function (sitecore, contextApp, messageId, listId, listType) {
      ServerRequest("EXM/AddRecipientList", {
        data: { messageId: messageId, recipientListId: listId, type: listType },
        success: function (response) {
          if (response.error) {
            return;
          }
          sitecore.trigger("add:list", messageId, listId, listType, response);
        },
        async: false
      });
    }
  };
  return MessageHelper;
});