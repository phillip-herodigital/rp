define(["sitecore", "/-/speak/v1/EDS/CommonListPage.js", "/-/speak/v1/EDS/edsUtil.js"], function (sitecore, commonListPage, edsUtil) {
  var domainsPageCode = commonListPage.extend({
    dialogIds: {
      AddEditSenderDomainDialog: "{45533D6B-F03C-44BE-A4ED-7D099040C638}",
      ConfirmationDialog: "{86C43DD0-471D-441A-AD14-AB75CBD40D40}"
    },
    actionIds: {
      editId: "A8B8A2BD7A2143E1B30E6959CE64475C",
      removeId: "6E3AD1F14DCE4F98A4FCA305E7F72354"
    },
    initialized: function () {
      this._super();
      this.on({
        "app:loaded": this.appLoaded,
        "domain:add": this.addDomain,
        "domain:edit": this.editDomain,
        "domain:delete": this.deleteDomain
      }, this);
            
      sitecore.on({
        "domain:changed": this.domainChanged
      }, this);

      this.SenderDomainListControl.on("change:items change:selectedItemId", this.updateActionsState, this);
      this.SenderDomainDataSource.on("itemsChanging", this.updateIcons, this);
    },

    appLoaded: function () {
      this.SearchTextBox.viewModel.$el.find("input").focus();
    },

    updateActionsState: function () {
      var items = this.SenderDomainListControl.get("items");
      var hasItems = items && items.length > 0;
      var itemId = this.SenderDomainListControl.get("selectedItemId");

      edsUtil.setActionState(this.SenderDomainActionControl, this.actionIds.editId, hasItems && itemId && itemId.length > 0);
      edsUtil.setActionState(this.SenderDomainActionControl, this.actionIds.removeId, hasItems && itemId && itemId.length > 0);
    },
  
    updateIcons: function(items) {
      var validIcon = this.ValidImage.get("imageUrl");
      var notValidIcon = this.NotValidImage.get("imageUrl");
      _.each(items, function (item) {
        item.SpfValidIcon = item.SpfValid ? validIcon : notValidIcon;
        item.DkimValidIcon = item.DkimValid ? validIcon : notValidIcon;
      });
    },

    addDomain: function () {
      edsUtil.showDialog(this.LoadOnDemandPanel, this.dialogIds.AddEditSenderDomainDialog, null);
    },

    editDomain: function () {
      var selectedItemId = this.SenderDomainListControl.get("selectedItemId");
      if (selectedItemId && selectedItemId.length > 0) {
        var dialogParams = {
          itemId: selectedItemId
        };
        edsUtil.showDialog(this.LoadOnDemandPanel, this.dialogIds.AddEditSenderDomainDialog, dialogParams);
      }
    },

    deleteDomain: function () {
      var selectedItem = this.SenderDomainListControl.get("selectedItem"),
        self = this;
      
      if (selectedItem) {
        var dialogText = sitecore.Resources.Dictionary.translate("You are about to delete the domain \"{0}\".") + "\r\n\r\n" +
         sitecore.Resources.Dictionary.translate("Do you want to continue?");
        dialogText = sitecore.Helpers.string.format(dialogText, selectedItem.get("DomainName"));

        var hasCompleted = false;
        var dialogParams = {
          title: sitecore.Resources.Dictionary.translate("Are you sure?"),
          text: dialogText,
          dialogType: "delete",
          callback: _.bind(function () {
            var service = edsUtil.getEntityService("EDS/SenderDomain");
            var itemId = selectedItem.get("itemId");
            service.fetchEntity(itemId).execute()
              .then(function (domain) {
                self.MessageBar.removeMessage(function (oldMessage) { return oldMessage.id === "fetcherror" + itemId; });

                setTimeout(function () {
                  if (!hasCompleted) {
                    var message = {
                      id: "deleteinprogress" + domain.Id,
                      text: "",
                      actions: [],
                      closable: true
                    };
                    message.text = sitecore.Resources.Dictionary.translate("The domain \"{0}\" is being deleted.");
                    message.text = sitecore.Helpers.string.format(message.text, domain.DomainName);
                    self.MessageBar.addMessage("notification", message);
                  }
                }, 5000);

                domain.destroy()
                  .then(function () {
                    self.MessageBar.removeMessage(function (oldMessage) { return oldMessage.id === "deleteerror" + domain.Id; });
                    sitecore.trigger("domain:changed", domain, "delete");
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
                      message.text = sitecore.Resources.Dictionary.translate("The domain \"{0}\" has not been deleted.") + " " +
                        sitecore.Resources.Dictionary.translate("Please try again later.");
                    }

                    message.text = sitecore.Helpers.string.format(message.text, domain.DomainName);

                    self.MessageBar.removeMessage(function (oldMessage) { return oldMessage.id === "deleteerror" + domain.Id; });
                    self.MessageBar.addMessage("error", message);
                  }).done(function () {
                    hasCompleted = true;
                    self.MessageBar.removeMessage(function (oldMessage) { return oldMessage.id === "deleteinprogress" + domain.Id; });
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

    domainChanged: function (domain, operation) {

      if (operation && operation.length > 0) {
        var message = {
          text: "",
          actions: [],
          closable: true
        };
        switch (operation) {
          case "add":
            message.text = sitecore.Resources.Dictionary.translate("The domain \"{0}\" has been added.");
            break;
          case "delete":
            message.text = sitecore.Resources.Dictionary.translate("The domain \"{0}\" has been deleted.");
            break;
        }

        if (message.text && message.text.length > 0) {
          message.text = sitecore.Helpers.string.format(message.text, domain.DomainName);
          this.MessageBar.addMessage("notification", message);
        }
      }
      this.SenderDomainDataSource.refresh();
      this.SenderDomainListControl.set("selectedItemId", "");
    }
  });

  return domainsPageCode;
});