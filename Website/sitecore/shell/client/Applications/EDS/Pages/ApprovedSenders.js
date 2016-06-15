define(["sitecore", "/-/speak/v1/EDS/CommonListPage.js", "/-/speak/v1/EDS/edsUtil.js"], function (sitecore, commonListPage, edsUtil) {
  var approvedSendersPageCode = commonListPage.extend({
    dialogIds: {
      AddEditApprovedSenderDialog: "{4BBF6CCC-0242-4985-9804-00E2635FD790}",
      ConfirmationDialog: "{86C43DD0-471D-441A-AD14-AB75CBD40D40}"
    },
    actionIds: {
      removeId: "4EB99BA9DD3F40DDAE5479C51F4A2B2D"
    },
    initialized: function () {
      this._super();
      this.on({
        "app:loaded": this.appLoaded,
        "sender:add": this.addSender,
        "sender:delete": this.deleteSender
      }, this);

      sitecore.on({
        "sender:changed": this.senderChanged
      }, this);

      this.ApprovedSenderListControl.on("change:items change:selectedItemId", this.updateActionsState, this);
    },

    appLoaded: function () {
      this.SearchTextBox.viewModel.$el.find("input").focus();
    },

    updateActionsState: function () {
      var items = this.ApprovedSenderListControl.get("items");
      var hasItems = items && items.length > 0;
      var itemId = this.ApprovedSenderListControl.get("selectedItemId");

      edsUtil.setActionState(this.ApprovedSenderActionControl, this.actionIds.removeId, hasItems && itemId && itemId.length > 0);
    },

    addSender: function () {
      edsUtil.showDialog(this.LoadOnDemandPanel, this.dialogIds.AddEditApprovedSenderDialog, null);
    },

    deleteSender: function () {
      var selectedItem = this.ApprovedSenderListControl.get("selectedItem"),
        self = this;
      
      if (selectedItem) {
        var dialogText = sitecore.Resources.Dictionary.translate("You are about to delete the approved sender \"{0}\".") + "\r\n\r\n" +
          sitecore.Resources.Dictionary.translate("Do you want to continue?");
        dialogText = sitecore.Helpers.string.format(dialogText, selectedItem.get("EmailAddress"));

        var hasCompleted = false;
        var dialogParams = {
          title: sitecore.Resources.Dictionary.translate("Are you sure?"),
          text: dialogText,
          dialogType: "delete",
          callback: _.bind(function () {
            var service = edsUtil.getEntityService("EDS/ApprovedSender");
            var itemId = selectedItem.get("itemId");
            service.fetchEntity(itemId).execute()
              .then(function (sender) {
                self.MessageBar.removeMessage(function (oldMessage) { return oldMessage.id === "fetcherror" + itemId; });

                setTimeout(function () {
                  if (!hasCompleted) {
                    var message = {
                      id: "deleteinprogress" + sender.Id,
                      text: "",
                      actions: [],
                      closable: true
                    };
                    message.text = sitecore.Resources.Dictionary.translate("The approved sender \"{0}\" is being deleted.");
                    message.text = sitecore.Helpers.string.format(message.text, sender.EmailAddress);
                    self.MessageBar.addMessage("notification", message);
                  }
                }, 5000);

                sender.destroy()
                  .then(function () {
                    self.MessageBar.removeMessage(function (oldMessage) { return oldMessage.id === "deleteerror" + sender.Id; });
                    sitecore.trigger("sender:changed", sender, "delete");
                  }).fail(function (error) {
                    var message = {
                      id: "deleteerror" + sender.Id,
                      text: "",
                      actions: [],
                      closable: false
                    };
                    var errorMessage = edsUtil.getErrorMessage(error);
                    if (errorMessage.length > 0 && errorMessage !== "Operation failed.") {
                      message.text = errorMessage;
                    } else {
                      message.text = sitecore.Resources.Dictionary.translate("The approved sender \"{0}\" could not be deleted.") + " " +
                        sitecore.Resources.Dictionary.translate("Please try again later.");
                    }

                    message.text = sitecore.Helpers.string.format(message.text, sender.EmailAddress);

                    self.MessageBar.removeMessage(function (oldMessage) { return oldMessage.id === "deleteerror" + sender.Id; });
                    self.MessageBar.addMessage("error", message);
                  }).done(function () {
                    hasCompleted = true;
                    self.MessageBar.removeMessage(function (oldMessage) { return oldMessage.id === "deleteinprogress" + sender.Id; });
                  });;
              })
              .fail(function (error) {
                var errorMessage = edsUtil.getErrorMessage(error);
                if (errorMessage.length > 0) {
                  var message = {
                    id: "fetcherror" + itemId,
                    text: errorMessage,
                    actions: [],
                    closable: false
                  };
                  self.MessageBar.addMessage("error", message);
                }
              });
          }, this)
        };

        edsUtil.showDialog(this.LoadOnDemandPanel, this.dialogIds.ConfirmationDialog, dialogParams);
      };
    },

    senderChanged: function (sender, operation) {
      var message = {
        text: "",
        actions: [],
        closable: true
      };

      if (operation == "add") {
        message.text = sitecore.Resources.Dictionary.translate("The approved sender \"{0}\" has been added. Please allow approximately 15 minutes for the system to update before you use this approved sender.");
      } else if (operation == "delete") {
        message.text = sitecore.Resources.Dictionary.translate("The approved sender \"{0}\" has been deleted.");
      }
      message.text = sitecore.Helpers.string.format(message.text, sender.EmailAddress);

      this.MessageBar.addMessage("notification", message);
      this.ApprovedSenderDataSource.refresh();
      this.ApprovedSenderListControl.set("selectedItemId", "");
    }
  });

  return approvedSendersPageCode;
});