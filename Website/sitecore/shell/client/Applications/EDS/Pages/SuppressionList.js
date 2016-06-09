define(["sitecore", "/-/speak/v1/EDS/CommonListPage.js", "/-/speak/v1/EDS/edsUtil.js"], function (sitecore, commonListPage, edsUtil) {
  var suppressionListPageCode = commonListPage.extend({
    dialogIds: {
      AddSuppressionDialog: "{45CE126C-E8CA-4301-A290-5E1DE404B8F3}",
      ConfirmationDialog: "{86C43DD0-471D-441A-AD14-AB75CBD40D40}",
      ExportSuppressionDialog: "{9F2696F0-DCE0-4039-97D1-1558CAE61C03}"
    },
    actionIds: {
      removeId: "0FD46520D2F048899D1470A868EC5610",
      exportId: "0293FE032BF64343B342CA04FBD48E0E"
    },
    initialized: function () {
      this._super();
      this.on({
        "app:loaded": this.appLoaded,
        "suppression:add": this.addSuppression,
        "suppression:remove": this.removeSuppression,
        "suppression:export": this.exportSuppressionList
      }, this);

      sitecore.on({
        "suppression:changed": this.suppressionChanged
      }, this);

      this.SuppressionListControl.on("change:items change:selectedItemId", this.updateActionsState, this);
    },

    appLoaded: function () {
      this.SearchTextBox.viewModel.$el.find("input").focus();
    },

    updateActionsState: function () {
      var items = this.SuppressionListControl.get("items");
      var hasItems = items && items.length > 0;
      var itemId = this.SuppressionListControl.get("selectedItemId");

      edsUtil.setActionState(this.SuppressionActionControl, this.actionIds.removeId, hasItems && itemId && itemId.length > 0);
      edsUtil.setActionState(this.SuppressionActionControl, this.actionIds.exportId, hasItems);
    },

    addSuppression: function () {
      edsUtil.showDialog(this.LoadOnDemandPanel, this.dialogIds.AddSuppressionDialog, null);
    },

    removeSuppression: function () {
      var selectedItem = this.SuppressionListControl.get("selectedItem"),
        self = this;
      
      if (selectedItem) {
        var dialogText = sitecore.Resources.Dictionary.translate("You are about to delete the email address \"{0}\" from the suppression list.") + "\r\n\r\n" +
         sitecore.Resources.Dictionary.translate("Do you want to continue?");
        dialogText = sitecore.Helpers.string.format(dialogText, selectedItem.get("Email"));

        var hasCompleted = false;
        var dialogParams = {
          title: sitecore.Resources.Dictionary.translate("Are you sure?"),
          text: dialogText,
          dialogType: "delete",
          callback: _.bind(function () {
            var service = edsUtil.getEntityService("EDS/Suppression");
            var itemId = selectedItem.get("itemId");
            service.fetchEntity(itemId).execute()
              .then(function (suppression) {
                self.MessageBar.removeMessage(function (oldMessage) { return oldMessage.id === "fetcherror" + itemId; });

                setTimeout(function () {
                  if (!hasCompleted) {
                    var message = {
                      id: "deleteinprogress" + suppression.Id,
                      text: "",
                      actions: [],
                      closable: true
                    };
                    message.text = sitecore.Resources.Dictionary.translate("The email address \"{0}\" is being deleted from the suppression list.");
                    message.text = sitecore.Helpers.string.format(message.text, suppression.Email);
                    self.MessageBar.addMessage("notification", message);
                  }
                }, 5000);

                suppression.destroy()
                  .then(function () {
                    self.MessageBar.removeMessage(function (oldMessage) { return oldMessage.id === "deleteerror" + suppression.Id; });
                    sitecore.trigger("suppression:changed", suppression, "delete");
                  }).fail(function (error) {
                    var message = {
                      id: "deleteerror" + domain.Id,
                      text: "",
                      actions: [],
                      closable: false
                    };
                    var errorMessage = edsUtil.getErrorMessage(error);
                    if (errorMessage.length > 0 && errorMessage !== "Operation failed.") {
                      message.text = errorMessage;
                      } else {
                      message.text = sitecore.Resources.Dictionary.translate("The email address \"{0}\" has not been deleted from the suppression list.") + " " +
                        sitecore.Resources.Dictionary.translate("Please try again later.");
                    }

                    message.text = sitecore.Helpers.string.format(message.text, suppression.Email);

                    self.MessageBar.removeMessage(function (oldMessage) { return oldMessage.id === "deleteerror" + suppression.Id; });
                    self.MessageBar.addMessage("error", message);
                  }).done(function () {
                    hasCompleted = true;
                    self.MessageBar.removeMessage(function (oldMessage) { return oldMessage.id === "deleteinprogress" + suppression.Id; });
                  });
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

    exportSuppressionList: function (e) {
      var options = e.exportOptions || {}
      options.contextApp = this;
      edsUtil.showDialog(this.LoadOnDemandPanel, this.dialogIds.ExportSuppressionDialog, options);
    },

    suppressionChanged: function (suppression, operation) {
      var message = {
        text: "",
        actions: [],
        closable: true
      };

      if (operation == "add") {
        message.text = sitecore.Resources.Dictionary.translate("The email address \"{0}\" has been added to the suppression list.");
      } else if (operation == "delete") {
        message.text = sitecore.Resources.Dictionary.translate("The email address \"{0}\" has been deleted from the suppression list.");
      }
      message.text = sitecore.Helpers.string.format(message.text, suppression.Email);

      this.MessageBar.addMessage("notification", message);

      this.SuppressionDataSource.refresh();
      this.SuppressionListControl.set("selectedItemId", "");
    }
  });

  return suppressionListPageCode;
});