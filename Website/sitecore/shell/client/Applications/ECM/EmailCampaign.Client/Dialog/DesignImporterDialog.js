define([
  "sitecore",
  "/-/speak/v1/ecm/MessageCreationService.js",
  "/-/speak/v1/ecm/ServerRequest.js"
], function (
  sitecore,
  MessageCreationService
  ) {
  return sitecore.Definitions.App.extend({
    initialized: function () {
      var contextApp = this;

      sitecore.on("design:importer:dialog:show", contextApp.showDialog, contextApp);

      this.on("design:importer:dialog:ok", this.hideDialog, this);
      this.on("design:importer:dialog:close", this.cancelDialog, this);
    },
    showDialog: function (messageInfo) {
      this.designImporterItemTextBox = messageInfo.designImporterItemTextBox;
      this.managerRootId = messageInfo.managerRootId;
      this.messageTypeTemplateId = messageInfo.messageTypeTemplateId;
      this.createButton = messageInfo.createButton;
      this.nameTextBox = messageInfo.nameTextBox;
      this.DesignImporterDialog.show();
    },

    hideDialog: function () {
      var contextApp = this;
      contextApp.MessageBar.removeMessages();
      var importFolderId = $(".sc-DesignImporter").data("importfolderid");
      if (!importFolderId) {
        var messagetoAdd = { id: "absenceOfEnoughInfomation", text: sitecore.Resources.Dictionary.translate("ECM.Pipeline.CreateMessage.AbsenceOfEnoughInfomation"), actions: [], closable: false };
        this.MessageBar.addMessage("error", messagetoAdd);
        return;
      }

      contextApp.currentContext = {
        importFolderId: importFolderId,
        managerRootId: contextApp.managerRootId,
        messageTypeTemplateId: contextApp.messageTypeTemplateId
      };
      var context = _.clone(contextApp.currentContext);
      var result = MessageCreationService.create('importedDesign', context);
      if (result) {
        contextApp.designImporterItemTextBox.set("text", context.itemPath);
        sessionStorage.newMessageTemplateId = context.messageTemplateId;
        var name = contextApp.nameTextBox.get("text");
        if (name) {
          contextApp.createButton.viewModel.enable();
        }
        contextApp.DesignImporterDialog.hide();
      }
    },
    cancelDialog: function () {
      this.DesignImporterDialog.hide();
    },
  });
})