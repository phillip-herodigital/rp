define([
  "sitecore",
  "/-/speak/v1/ecm/AppBase.js",
  "/-/speak/v1/ecm/Validation.js"
], function (sitecore, appBase) {
  var messageCreationBase = appBase.extend({
    showEvent: "base:message:dialog:show",
    dialogName: "BaseMessageDialog",
    initialized: function () {
      sitecore.on(this.showEvent, this.showDialog, this);
      this.on("select:existing:page:dialog:ok", this.existhideDialog, this);
      this.on("select:existing:page:dialog:cancel", this.existcancelDialog, this);
      sitecore.on("create:message:click", _.bind(function (eventInfo) {
        if (!eventInfo || !eventInfo.url) {
          return;
        }

        sessionStorage.createMessageParameters = JSON.stringify(eventInfo.parameters);
        var contextApp = eventInfo.app;

        contextApp.NameTextBox.viewModel.$el.on("keyup", _.bind(function (e) {
          var value = contextApp.NameTextBox.viewModel.$el.val().trim();
          var isEnabled = !!value;
          contextApp.Create.set("isEnabled", isEnabled);
          this.createByEnterKey(contextApp, value, e);
        }, this));

        contextApp.ImportNameTextBox.viewModel.$el.on("keyup", _.bind(function (e) {
          var value = contextApp.ImportNameTextBox.viewModel.$el.val().trim();
          var isUploadFilled = contextApp.Uploader.viewModel.totalFiles() > 0 && contextApp.Uploader.get("isVisible");
          var isBrowseFilled = contextApp.BrowseTextBox.get("text").trim() !== "" && contextApp.BrowseTextBox.get("isVisible");
          var isEnabled = !!value && (isUploadFilled || isBrowseFilled);
          contextApp.Create.set("isEnabled", isEnabled);
          this.createByEnterKey(contextApp, value, e);
        }, this));

        contextApp.Uploader.on("change:totalFiles", function () {
          var name = contextApp.ImportNameTextBox.viewModel.$el.val().escapeAmpersand();
          var isEnabled = !!(name && contextApp.Uploader.viewModel.totalFiles() > 0);
          contextApp.Create.set("isEnabled", isEnabled);
        });

        contextApp.on("selectExistingPage:browse", function () {

          var selectedPagePath = contextApp.BrowseTextBox.get("text");
          if (selectedPagePath) {
            if (selectedPagePath[selectedPagePath.length - 1] === "/") {
              selectedPagePath = selectedPagePath.substring(0, selectedPagePath.length - 1);
            }
            var arr = selectedPagePath.split("/");
            var selectedLink = contextApp.ExistingPageTreeView.viewModel.$el.find("a.dynatree-title:contains('" + arr[arr.length - 1] + "')");
            selectedLink.click();
          }
          this[this.dialogName].hide();
          contextApp.SelectExistingPageDialogWindow.viewModel.show();
        
        });

        contextApp.on("one:time:createmessage:create", function () {
          var parameters = JSON.parse(sessionStorage.createMessageParameters);
          if (eventInfo.parameters.messageTemplateId !== parameters.messageTemplateId) {
            return;
          }
          this._events["one:time:createmessage:create"].length = 0;
          eventInfo.parameters = parameters;
          contextApp.MessageBar.removeMessages();
          var url = eventInfo.url;
          var position = url.lastIndexOf('/');
          var createType = url.substring(position + 1);
          contextApp.Create.set("isEnabled", false);
          history.pushState({ path: window.location.href }, null, window.location.href);
          switch (createType) {
            case "ExistingTemplate":
              this.createExistingTemplate(contextApp, eventInfo);
              break;
            case "ExistingPage":
              this.createExistingPage(contextApp, eventInfo);
              break;
            case "ImportHtml":
              this.createImportHtml(contextApp);
              break;
            default:
          }
        });
      }, this));

      this.on("one:time:cancel", function () {
        this[this.dialogName].viewModel.hide();
        this.SelectExistingPageDialogWindow.hide();
        this.clearMessageCreationForm();
      });

    },

    createExistingTemplate: function (contextApp, eventInfo) {
      var name = contextApp.NameTextBox.get("text").escapeAmpersand();
      if (!name) {
        var createMessageEmptyName = { id: "createMessageEmptyName", text: sitecore.Resources.Dictionary.translate("ECM.Pipeline.CreateMessage.CreateMessageEmptyName"), actions: [], closable: false };
        contextApp.MessageBar.addMessage("error", createMessageEmptyName);
        contextApp.NameTextBox.viewModel.focus();
        return;
      }

      var templateId = eventInfo.parameters.messageTemplateId;
      var messageTypeTemplateId = eventInfo.parameters.messageTypeTemplateId;
      var rootId = sessionStorage.managerRootId;

      contextApp.currentContext = {
        messageTemplateId: templateId,
        managerRootId: rootId,
        messageName: name,
        messageTypeTemplateId: messageTypeTemplateId
      };
      var context = clone(contextApp.currentContext);

      createNewMessage(context, contextApp.MessageBar, null, contextApp, sitecore);

    },

    createExistingPage: function (contextApp, eventInfo) {
      var hasErrors = false;
      var name = contextApp.ImportNameTextBox.get("text").escapeAmpersand();
      if (!name) {
        var createMessageEmptyName = { id: "createMessageEmptyName", text: sitecore.Resources.Dictionary.translate("ECM.Pipeline.CreateMessage.CreateMessageEmptyName"), actions: [], closable: false };
        contextApp.MessageBar.addMessage("error", createMessageEmptyName);
        contextApp.NameTextBox.viewModel.focus();
        hasErrors = true;
      }

      var selectedPagePath = contextApp.BrowseTextBox.get("text");
      if (!selectedPagePath) {
        this.MessageBar.removeMessage(function (error) { return error.id === "notSelectExistingPage"; });
        var notSelectExistingPage = { id: "notSelectExistingPage", text: sitecore.Resources.Dictionary.translate("ECM.Pipeline.AddPreExstingPage.NotSelectExistingPage"), actions: [], closable: false };
        this.MessageBar.addMessage("error", notSelectExistingPage);
        hasErrors = true;
      }

      if (hasErrors) {
        return;
      }
      var templateId = eventInfo.parameters.messageTemplateId;
      var messageTypeTemplateId = eventInfo.parameters.messageTypeTemplateId;
      var rootId = sessionStorage.managerRootId;

      contextApp.currentContext = {
        messageTemplateId: templateId,
        managerRootId: rootId,
        messageName: name,
        messageTypeTemplateId: messageTypeTemplateId,
        existingPagePath: selectedPagePath,
        databaseName: "master"
      };

      var context = clone(contextApp.currentContext);

      createNewMessageFromPreExistingPage(context, this.MessageBar, null, contextApp, sitecore);

    },

    createNewMessage: function (file) {
      var contextApp = this;
      var parameters = JSON.parse(sessionStorage.createMessageParameters);
      var name = contextApp.ImportNameTextBox.get("text");
      var templateId = parameters.messageTemplateId;
      var messageTypeTemplateId = parameters.messageTypeTemplateId;
      var rootId = sessionStorage.managerRootId;

      contextApp.currentContext = {
        messageTemplateId: templateId,
        managerRootId: rootId,
        messageName: name,
        messageTypeTemplateId: messageTypeTemplateId,
        fileItemId: file.itemId,
        fileName: file.data.name,
        database: contextApp.Uploader.viewModel.$el.data("sc-databasename")
      };
      var context = clone(contextApp.currentContext);

      var result = createNewMessageFromImportHtml(context, contextApp.MessageBar, null, contextApp, sitecore);
      if (!result) {
        contextApp.UploaderInfo.viewModel.$el.find("div.sc-uploaderInfo-row").parent().remove();
      }
    },

    createImportHtml: function (contextApp) {

      if (contextApp.Uploader.viewModel.totalFiles() == 0) {
        var notImportHtml = { id: "notImportHtml", text: sitecore.Resources.Dictionary.translate("ECM.Pipeline.ImportHtmlLayout.NotImportHtml"), actions: [], closable: false };
        contextApp.MessageBar.addMessage("error", notImportHtml);
      } else {
        if (contextApp.Uploader.viewModel.totalFiles() > 1) {
          var oneHtmlOnly = { id: "oneHtmlOnly", text: sitecore.Resources.Dictionary.translate("ECM.Pipeline.ImportHtmlLayout.OneHtmlOnly"), actions: [], closable: false };
          contextApp.MessageBar.addMessage("error", oneHtmlOnly);
        } else {

          if (contextApp.UploaderInfo.viewModel.files()[0].type() !== 'text/html') {
            var notHtmlFile = { id: "notHtmlFile", text: sitecore.Resources.Dictionary.translate("ECM.Pipeline.ImportHtmlLayout.NotHtmlFile"), actions: [], closable: false };
            contextApp.MessageBar.addMessage("error", notHtmlFile);
          } else {

            contextApp.on("upload-fileUploaded", contextApp.createNewMessage, contextApp);
            contextApp.Uploader.viewModel.upload();
          }
        }
      }
    },

    showDialog: function (createMessageDialogDataSource) {
      if (!createMessageDialogDataSource || createMessageDialogDataSource.createMessageOptions.get("createMessageOptions").length < 1) {
        return;
      }
      var contextApp = this;
      contextApp.CreateMessage.set("dataSourceValue", createMessageDialogDataSource.createMessageOptions.get("createMessageOptions"));
      contextApp.CreateMessage.viewModel.renderDataSource();
      this.clearMessageCreationForm();
      this[this.dialogName].viewModel.show();
    },

    existhideDialog: function () {
      var contextApp = this;
      var selectItem = contextApp.ExistingPageTreeView.viewModel.getActiveNode();
      contextApp.BrowseTextBox.set("text", selectItem.data.path);
      var name = contextApp.BrowseTextBox.get("text");
      var importName = contextApp.ImportNameTextBox.get("text");
      if (name != "" & importName != "") {
        contextApp.Create.viewModel.enable();
      }
      contextApp.SelectExistingPageDialogWindow.viewModel.hide();

      this[this.dialogName].viewModel.show();
      contextApp.ImportNameLabel.set("isVisible", true);
      contextApp.ImportNameTextBox.set("isVisible", true);

      contextApp.BrowseNameLabel.set("isVisible", true);
      contextApp.BrowseTextBox.set("isVisible", true);

      var isEnabled = contextApp.ImportNameTextBox.viewModel.$el.val() !== "" && contextApp.BrowseTextBox.get("text") !== "";
      contextApp.Create.set("isEnabled", isEnabled);
    },

    existcancelDialog: function () {
      this.SelectExistingPageDialogWindow.viewModel.hide();
      this[this.dialogName].viewModel.show();
    },

    clearMessageCreationForm: function () {
      this.NameLabel.set("isVisible", false);
      this.NameTextBox.set("isVisible", false);
      this.NameTextBox.set("text", "");

      this.ImportNameLabel.set("isVisible", false);
      this.ImportNameTextBox.set("isVisible", false);
      this.ImportNameTextBox.set("text", "");

      this.BrowseNameLabel.set("isVisible", false);
      this.BrowseTextBox.set("isVisible", false);
      this.BrowseTextBox.set("text", "");
      this.MessageBar.removeMessages();
      $("[data-sc-id=UploaderRowPanel]").hide();
    },

    isCreateMessageAlreadyClicked: function(value) {
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

    createByEnterKey: function (contextApp, value, e) {
      if (e.keyCode === 13) {
        contextApp.Create.set("isEnabled", false);
        if (this.isCreateMessageAlreadyClicked(value)) { return; }
        contextApp.trigger("one:time:createmessage:create");
        sessionStorage.removeItem("createMessageName");
      }
    }
  });

  return messageCreationBase;
});
