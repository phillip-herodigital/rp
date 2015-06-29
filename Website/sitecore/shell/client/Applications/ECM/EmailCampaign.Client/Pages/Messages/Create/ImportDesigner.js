define(["sitecore", "/-/speak/v1/ecm/Messages.js", "/-/speak/v1/ecm/ServerRequest.js"], function (sitecore) {
  return sitecore.Definitions.App.extend({
    initialized: function () {
      var contextApp = this;

      messages_InitializeAlertDialog(contextApp, sitecore);
      messages_InitializePromptDialog(contextApp, sitecore);
      messages_InitializeConfirmDialog(contextApp, sitecore);

      // Set the notification text style to italic.
      contextApp.NotificationText.viewModel.$el.css("font-style", "italic");

      // Set the cursor of DesignImporterItemTextBox to "auto" instead of "not-allowed".
      contextApp.DesignImporterItemTextBox.viewModel.$el.css("cursor", "auto");

      contextApp.MessageBar.removeMessage(function (error) { return error.id === "absenceOfEnoughInfomation"; });
      if (!sessionStorage.createMessageParameters) {
        var absenceOfEnoughInfomation = { id: "absenceOfEnoughInfomation", text: sitecore.Resources.Dictionary.translate("ECM.Pipeline.CreateMessage.AbsenceOfEnoughInfomation"), actions: [], closable: false };
        contextApp.MessageBar.addMessage("error", absenceOfEnoughInfomation);
        return;
      }

      contextApp.NameTextBox.viewModel.$el.on("keyup", function () {
        contextApp.NameTextBox.viewModel.$el.change();
        var name = contextApp.NameTextBox.viewModel.$el.val();
        var designName = contextApp.DesignImporterItemTextBox.get("text");
        if (!name) {
          contextApp.CreateButton.viewModel.disable();
        } else if (designName) {
          contextApp.CreateButton.viewModel.enable();
        }
      });

      contextApp.DesignImporterItemTextBox.viewModel.$el.on("keyup", function () {
        contextApp.DesignImporterItemTextBox.viewModel.$el.change();
        var name = contextApp.NameTextBox.viewModel.$el.val();
        var designName = contextApp.DesignImporterItemTextBox.get("text");
        if (!designName) {
          contextApp.CreateButton.viewModel.disable();
        } else if (name) {
          contextApp.CreateButton.viewModel.enable();
        }
      });

      //  add the Default settings dialog
      this.insertRendering("{710FEC5A-C168-4603-A171-43BC7B602467}", { $el: $("body") }, function (subApp) {
        contextApp["showDesignImporterDialog"] = subApp;
      });

      contextApp.NameTextBox.viewModel.focus();

      // back
      var numberOfEntriesWhenPageLoaded = history.length;
      contextApp.on("createmessage:back", function () {
        var updatednumberOfEntries = history.length;
        var pageToGoBack = (updatednumberOfEntries - numberOfEntriesWhenPageLoaded + 1) * -1;
        history.go(pageToGoBack);
      });

      contextApp.on("desingimporter:import", function () {
        var managerRootId = contextApp.EmailManagerRoot.get("managerRootId");
        var parameters = JSON.parse(sessionStorage.createMessageParameters);
        sitecore.trigger("design:importer:dialog:show", { designImporterItemTextBox: contextApp.DesignImporterItemTextBox, managerRootId: managerRootId, messageTypeTemplateId: parameters.messageTypeTemplateId, createButton: contextApp.CreateButton, nameTextBox: contextApp.NameTextBox });
      }, contextApp);

      contextApp.on("createmessage:create", function () {
        contextApp.MessageBar.removeMessages();
        var hasErrors = false;

        var name = contextApp.NameTextBox.get("text").escapeAmpersand();
        if (!name) {
          var createMessageEmptyName = { id: "createMessageEmptyName", text: sitecore.Resources.Dictionary.translate("ECM.Pipeline.CreateMessage.CreateMessageEmptyName"), actions: [], closable: false };
          contextApp.MessageBar.addMessage("error", createMessageEmptyName);
          contextApp.NameTextBox.viewModel.focus();
          hasErrors = true;
        }

        var designName = contextApp.DesignImporterItemTextBox.get("text");
        if (!designName || !sessionStorage.newMessageTemplateId) {
          this.MessageBar.removeMessage(function (error) { return error.id === "notImportDesign"; });
          var notImportDesign = { id: "notImportDesign", text: sitecore.Resources.Dictionary.translate("ECM.Pipeline.ImportNewDesign.OneImportDesign"), actions: [], closable: false };
          this.MessageBar.addMessage("error", notImportDesign);
          hasErrors = true;
        }

        if (hasErrors) {
          return;
        }

        var parameters = JSON.parse(sessionStorage.createMessageParameters);
        var rootId = contextApp.EmailManagerRoot.get("managerRootId");
        var templateId = sessionStorage.newMessageTemplateId;
        var messageTypeTemplateId = parameters.messageTypeTemplateId;;

        contextApp.currentContext = {
          messageTemplateId: templateId,
          managerRootId: rootId,
          messageName: name,
          messageTypeTemplateId: messageTypeTemplateId
        };
        var context = clone(contextApp.currentContext);

        createNewMessage(context, contextApp.MessageBar, null, contextApp, sitecore);
      });

      window.onbeforeunload = function () {
        //sessionStorage.removeItem("createMessageParameters");
        //sessionStorage.removeItem("newMessageTemplateId");

        var importFolderId = $(".sc-DesignImporter").data("importfolderid");
        if (!importFolderId) {
          return;
        }

        contextApp.RemoveImportFolder(importFolderId);
      };
    },

    RemoveImportFolder: function (importFolderId) {
      if (!importFolderId) {
        return;
      }

      var contextApp = this;
      contextApp.currentContext = {
        folderId: importFolderId
      };

      var context = clone(contextApp.currentContext);
      sitecore.Pipelines.DeleteFolder.execute({ app: contextApp, currentContext: context });
    }
  });
});