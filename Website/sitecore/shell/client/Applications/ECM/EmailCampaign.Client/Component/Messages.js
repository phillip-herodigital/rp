define(["sitecore", "/-/speak/v1/ecm/ServerRequest.js",
  "/-/speak/v1/ecm/InsertToken.js",
  "/-/speak/v1/ecm/Cookies.js"]);

function openSelectedMessage(listControl) {
  if (!listControl) {
    return;
  }

  var selectedItem = listControl.get("selectedItem");
  if (!selectedItem) {
    return;
  }

  var url = selectedItem.get("url");
  if (!url) {
    return;
  }

  window.location.href = url;
}

function getSelectedTab() {
  var parameters = function () {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  }

  return parameters()["selectedtab"];
}

function deleteSelectedMessage(dataSource, selectedItem, app, sitecore) {
  if (!selectedItem || !dataSource) {
    return;
  }
  app.currentContext = {
    messageId: selectedItem.get("itemId"),
    messageName: selectedItem.get("name"),
    datasource: dataSource
  };

  var ctx = clone(app.currentContext);
  
  sitecore.Pipelines.DeleteMessage.execute({ app: app, currentContext: ctx });
}

function verifyMessage(sitecore, contextApp, actionName, callback) {
  var messageId = contextApp.MessageContext.get("messageId");
  if (contextApp.IncludedRecipientDataSource) {
    contextApp.IncludedRecipientDataSource.set("messageId", messageId);
    contextApp.IncludedRecipientDataSource.viewModel.refresh();

    if (actionName === "send" && hasNoRecipient(contextApp.IncludedRecipientDataSource)) {
      sitecore.trigger("alertdialog", contextApp.StringDictionary.get("ECM.Pages.Message.ThereIsNoRecipient"));
      return false;
    }
  }

  if (contextApp.ExcludedRecipientDataSource) {
    contextApp.ExcludedRecipientDataSource.set("messageId", messageId);
    contextApp.ExcludedRecipientDataSource.viewModel.refresh();
  }

  if (actionName === "save" && hasNoRecipientList(contextApp.IncludedRecipientDataSource, contextApp.ExcludedRecipientDataSource)) {
    return true;
  }

  if (contextApp.IncludedRecipientDataSource || contextApp.ExcludedRecipientDataSource) {
    var includedListsMessage = contextApp.StringDictionary.get("ECM.Pages.Message.ThereIsNoDefaultListAssignedForOptIn");
    var excludedListsMessage = contextApp.StringDictionary.get("ECM.Pages.Message.ThereIsNoDefaultListAssignedForOptOut");

    var verifyIncluded = verifyLists(includedListsMessage, sitecore, contextApp, callback, contextApp.IncludedRecipientDataSource);
    if (verifyIncluded) {
      return verifyLists(excludedListsMessage, sitecore, contextApp, callback, contextApp.ExcludedRecipientDataSource);
    }
  } 
  return false;
}

function verifyLists(notification, sitecore, contextApp, callback, dataSource) {
  var recipientLists = dataSource.get("recipientLists");
  if ((recipientLists.length == 0) || (recipientLists[0].default !== "Yes")) {
    sitecore.trigger("default:list:confirmation:dialog:show", notification, function() {
      var recipientListType = dataSource.get("recipientListType");
      var sourceMessageId = dataSource.get("messageId");
      sitecore.trigger("recipients:add:empty:list:dialog:show", function(messageId, listId, listType) {
        callback(sitecore, contextApp, messageId, listId, listType);
      }, sourceMessageId, recipientListType);
    });
    return false;
  }
  return true;
}

function hasNoRecipient(includedRecipientDataSource) {
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
}

function hasNoRecipientList(includedRecipientDataSource, excludedRecipientDataSource) {
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
}

function addCreatedEmptyList(sitecore, contextApp, messageId, listId, listType) {
  postServerRequest("ecm.recipientlist.add", { messageId: messageId, recipientListId: listId, type: listType }, function (response) {
    if (response.error) {
      return;
    }
    sitecore.trigger("add:list", messageId, listId, listType, response);
  }, false);
}

function saveMessage(messageContext, messageBar, language, app, sitecore) {
  if (!messageContext || !messageBar || !app)
    return false;

  if (messageContext.get("isModified") == false)
    return true;

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

  var context = clone(app.currentContext);

  // if the error count is above 0, we do not clear the flag
  sitecore.Pipelines.Validate.execute({ app: app, currentContext: context });
  if (context.errorCount > 0) {
    return false;
  }
  sitecore.Pipelines.SaveMessage.execute({ app: app, currentContext: context });
  if (context.errorCount > 0) {
    return false;
  }

  messageContext.set("isModified", false);
  return true;
}

function copySelectedMessage(messageId, messageName, sitecore) {
  var context = {
    messageId: messageId,
    messageName: messageName,
    aborted: false
  };

  sitecore.Pipelines.CopyToDraft.execute(context);
}

function createNewMessage(messageContext, messageBar, language, app, sitecore) {
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

  var context = clone(app.currentContext);

  sitecore.Pipelines.CreateNewMessage.execute({ app: app, currentContext: context });
  if (context.errorCount > 0) {
    return false;
  }

  messageContext.newMessageId = context.newMessageId;
  return true;
}

function createNewMessageFromImportHtml(messageContext, messageBar, language, app, sitecore) {
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

  var context = clone(app.currentContext);

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
}

function createNewMessageFromPreExistingPage(messageContext, messageBar, language, app, sitecore) {
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

  var context = clone(app.currentContext);

  sitecore.Pipelines.AddPreExistingPage.execute({ app: app, currentContext: context });
  if (context.errorCount > 0) {
    return false;
  }

  messageContext.newMessageId = context.newMessageId;
  return true;
}

function createNewTemplatesFromImportedDesign(messageContext, messageBar, app, sitecore) {
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

  var context = clone(app.currentContext);

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
}

function clone(obj) {
  if (obj === null || typeof obj != "object")
    return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
}

function messages_InitializeDefaultSettingsDialog(contextApp, sitecore, managerRootId) {
  if (managerRootId == null || managerRootId == "null") {
    insertDefaultSettingsDialog("firstrun");
  }

  contextApp.on("action:defaultsettings", function () {
    getDefaultSettingsDialog();
  }, contextApp);

  if (sessionStorage.firstrun == "1") {
    sessionStorage.removeItem("firstrun");
    getDefaultSettingsDialog();
  }

  function insertDefaultSettingsDialog(methodName) {
    contextApp.insertRendering("{33E6267B-0112-468D-9717-5E8EBFD0ACB9}", { $el: $("body") }, function (subApp) {
      contextApp["showDefaultSettingsDialog"] = subApp;
      sitecore.trigger("default:settings:dialog:" + methodName);
    });
  };

  function getDefaultSettingsDialog() {
    if (contextApp["showDefaultSettingsDialog"] === undefined) {
      insertDefaultSettingsDialog("show");
    } else {
      sitecore.trigger("default:settings:dialog:show");
    }
  };
}

function messages_InitializeAlertDialog(contextApp, sitecore) {
  sitecore.on("alertdialog", function(text) {
    if (contextApp["AlertDialog"] === undefined) {
      contextApp.insertRendering("{6F26F209-5DF3-4BA2-BBEE-D4A76B1010B7}", { $el: $("body") }, function(subApp) {
        contextApp["AlertDialog"] = subApp;
        sitecore.trigger("alertdialog:show", { text: text });
      });
    } else {
      sitecore.trigger("alertdialog:show", { text: text });
    }
  });
}

function messages_InitializeConfirmDialog(contextApp, sitecore) {
  sitecore.on("confirmdialog", function(info) {
    if (contextApp["ConfirmDialog"] === undefined) {
      contextApp.insertRendering("{620AC309-7AAD-4D7E-8AE2-F7163AB0A45F}", { $el: $("body") }, function (subApp) {
        contextApp["ConfirmDialog"] = subApp;
        sitecore.trigger("confirmdialog:show", info);
      });
    } else {
      sitecore.trigger("confirmdialog:show", info);
    }
  });
}

function messages_InitializePromptDialog(contextApp, sitecore) {
  sitecore.on("promptdialog", function(info) {
    if (contextApp["PromptDialog"] === undefined) {
      contextApp.insertRendering("{42245841-8BC6-4879-9E61-06C6DFB5FF43}", { $el: $("body") }, function (subApp) {
        contextApp["PromptDialog"] = subApp;
        sitecore.trigger("promptdialog:show", info);
      });
    } else {
      sitecore.trigger("promptdialog:show", info);
    }
  });
}

function messages_InitializeAddAttachmentDialog(contextApp, sitecore, messageContext) {
  sitecore.on("action:addattachment", function () {
    if (contextApp["showAddAttachmentDialog"] === undefined) {
      contextApp.insertRendering("{26D93861-13E8-4416-8319-0D03094A19CB}", { $el: $("body") }, function (subApp) {
        contextApp["showAddAttachmentDialog"] = subApp;
        addAttachmentDialogShow();
      });
    } else {
      addAttachmentDialogShow();
    }
  });
  
  contextApp.on("action:addattachment", function() {
    sitecore.trigger("action:addattachment");
  });

  sitecore.on("attachment:file:added", function () {
    contextApp.MessageContext.viewModel.refresh();
  });

  sitecore.on("attachment:file:removed", function () {
    contextApp.MessageContext.viewModel.refresh();
  });

  function addAttachmentDialogShow() {
    sitecore.trigger("add:attachment:dialog:show", { messageId: messageContext.get("messageId"), language: messageContext.get("language") });
  }
}

function messages_InitializeSaveAsSubscriptionDialog(contextApp, sitecore, messageContext) {

  if (window.location.pathname != "/sitecore/client/Applications/ECM/Pages/Messages/OneTime") {
    $('li[data-sc-actionid="0661D49FE0204040A255705AA20F67FA"]').hide(); //"Save as a Subscription message template"
    return;
  }
  contextApp.on("action:saveassubscription", function () {
    if (contextApp["showSaveAsSubscriptionDialog"] === undefined) {
      contextApp.insertRendering("{2CCFF6B5-3FFA-4B15-AE62-F3A70E9FB48C}", { $el: $("body") }, function (subApp) {
        contextApp["showSaveAsSubscriptionDialog"] = subApp;
        saveAsSubscriptionDialogShow();
      });
    } else {
      saveAsSubscriptionDialogShow();
    }
  }, contextApp);

  function saveAsSubscriptionDialogShow() {
    postServerRequest("ecm.saveassubscriptiontemplate.cansave", null, function (response) {
      var errorMessageId = "error.ecm.saveassubscriptiontemplate.execute";
      contextApp.MessageBar.removeMessage(function (error) { return error.id === errorMessageId; });
      if (response.error) {
        contextApp.MessageBar.addMessage("error", { id: errorMessageId, text: response.errorMessage, actions: [], closable: true });
        return;
      }
      sitecore.trigger("save:as:subscription:dialog:show", {
        contextApp: contextApp,
        messageContext: messageContext
      });
    }, false);
  }
}

function messages_PromtWithoutSaving(messageContext, sitecore) {
  if (!messageContext) { return; }
  window.onbeforeunload = function () {
    if (messageContext.get("isModified")) {
      return sitecore.Resources.Dictionary.translate("ECM.MessagePage.SaveBeforeLeaving");
    }
  };
}

function messages_NotFound(messageContext, sitecore, messageBar) {
  if (!messageBar || !messageContext) { return; }
  messageContext.on("change:messageNotFound", function () {
    messageBar.addMessage("error", sitecore.Resources.Dictionary.translate("ECM.MessagePage.MessagenotFound"));
  });
}

function messages_SaveBackButtons(sitecore, contextApp) {
  if (!sitecore || !contextApp) {
    return;
  }
  var messageContext = contextApp.MessageContext;
  var messageBar = contextApp.MessageBar;
  if (!messageContext || !messageBar) {
    return;
  }

  var self = this;

  contextApp.insertRendering("{3FEF3A04-64A8-4C3A-B78D-F0007F159949}", { $el: $("body") }, function (subApp) {
    contextApp["showDefaultSettingsDialog"] = subApp;
    sitecore.on("default:list:confirmation:dialog:show", subApp.showDialog, subApp);
  });

  contextApp.insertRendering("{BDC2AB0C-9FC6-41F4-B821-214A8F156A91}", { $el: $("body") }, function (dialog) {
    contextApp["addEmptyList"] = dialog;
  });

  sitecore.on("message:save", function() {
    contextApp.trigger("message:save");
  });

  contextApp.on("message:save", function () {
    verifyMessage(sitecore, contextApp, "save", self.addCreatedEmptyList);
    saveMessage(messageContext, messageBar, messageContext.get("language"), contextApp, sitecore);
  });

  $(window).on("beforeunload", function () {
    if (contextApp.ExcludedRecipientDataSource && contextApp.ExcludedRecipientDataSource.viewModel) {
      contextApp.ExcludedRecipientDataSource.viewModel.refresh();
    }

    if (contextApp.IncludedRecipientDataSource && contextApp.IncludedRecipientDataSource.viewModel) {
      contextApp.IncludedRecipientDataSource.viewModel.refresh();
    }

    if (((contextApp.IncludedRecipientDataSource && (contextApp.IncludedRecipientDataSource.get("recipientLists").length > 0)) || (contextApp.ExcludedRecipientDataSource && (contextApp.ExcludedRecipientDataSource.get("recipientLists").length > 0))) &&
       ((contextApp.ExcludedRecipientDataSource && ((contextApp.ExcludedRecipientDataSource.get("recipientLists").length == 0) || (contextApp.ExcludedRecipientDataSource.get("recipientLists")[0].default !== "Yes"))) ||
       (contextApp.IncludedRecipientDataSource && (contextApp.IncludedRecipientDataSource.get("recipientLists").length == 0) || (contextApp.IncludedRecipientDataSource.get("recipientLists")[0].default !== "Yes")))) {
      return contextApp.StringDictionary.get("ECM.Pages.Message.YourChangesHaveNotBeenSaved");
    }
  });

  contextApp.on("message:back", function () {
    history.back();
  });
}

function messages_ChangeManagerRoot(contextApp) {
  // if the root manager id is change, redirect to the start page
  contextApp.EmailManagerRoot.on("change:managerRootId", function () {
    window.parent.location.replace("/sitecore/client/Applications/ECM/Pages/StartPage");
  });
}

function messages_TabOnClick(sitecore, contextApp) {
  // sets currentTabId in MessageContext and binds event onClick foreach tabs to Main TabControl 
  var tabControl = contextApp.TabControl;

  tabControl.viewModel.$el.children("ul.sc-tabcontrol-navigation").find("a").on("click", function () {
    setTimeout(function () {
      ActivatePanel(contextApp, sitecore);
    }, 10);
  });
}

function ActivatePanel(contextApp, sitecore, selectedTab) {
  var tabControl = contextApp.TabControl;
  var currentTabId = tabControl.get("selectedTab");

  var panels = GetLoadOnDemandPanels(contextApp);

  _.each(panels, function (f) {
    if (f.get("isVisible")) {
      f.set("isVisible", false);
    }
  });

  var panel;
  if (selectedTab && panels[selectedTab]) {
    panel = LoadOrActivatePanel(panels[selectedTab]);
  } else {
    panel = LoadOrActivatePanel(panels[tabControl.get("selectedTabIndex")]);
  }

  sitecore.trigger("mainApp", contextApp);

  contextApp.MessageContext.set("currentTabId", currentTabId);
  contextApp.LanguageSwitcher.viewModel.updateViewByTabId(currentTabId);

  return panel;
}

function LoadOrActivatePanel(panel) {
  if (!panel.get("isLoaded")) {
    panel.refresh();
  }

  panel.set("isVisible", true);

  return panel;
}

function GetLoadOnDemandPanels(contextApp) {
  return [
        contextApp.GeneralTabLoadOnDemandPanel,
        contextApp.RecipientTabLoadOnDemandPanel,
        contextApp.MessageTabLoadOnDemandPanel,
        contextApp.ReviewTabLoadOnDemandPanel,
        contextApp.DeliveryTabLoadOnDemandPanel,
        contextApp.ReportsTabLoadOnDemandPanel
  ];
}

function messages_SetPreselectedTab(contextApp, sitecore) {
  var selectedTab = getSelectedTab();

  if (selectedTab) {
    window.setTimeout(function () {
     var tab = contextApp.TabControl.viewModel.tabs()[selectedTab];
      if (tab) {
        var foundTab = contextApp.TabControl.viewModel.$el.find('[data-tab-id="' + tab + '"]');
        if (foundTab) {
          foundTab.click();
        }
      }

      if (contextApp.MessageContext.get("isBusy")) {
        contextApp.MessageContext.once("change:isBusy",
          function ()
          {
            ActivatePanel(contextApp, sitecore, selectedTab);
          }
        );
      } else {
        ActivatePanel(contextApp, sitecore, selectedTab);
      }
    }, 10);
  }
}

String.prototype.escapeAmpersand = function () {
  return this.replace(/&/g, "%26");
}

function messages_setTimezoneCookie() {
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
}