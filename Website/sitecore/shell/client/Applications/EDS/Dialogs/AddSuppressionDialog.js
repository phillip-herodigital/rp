define(["sitecore", "/-/speak/v1/EDS/edsUtil.js"], function (sitecore, edsUtil) {
  return sitecore.Definitions.App.extend({
    initialized: function () {
      this.DialogWindow.set("focusOn", "[data-sc-id=EmailTextBox]");

      this.DialogWindow.viewModel.$el.on("hidden", _.bind(this.cleanUp, this));

      this.on({
        "app:loaded": this.triggerLoaded,
        "suppressiondialog:hide": this.hideDialog,
        "suppressiondialog:submit": this.submitAction,
        "change:contextItem": this.itemChanged
      }, this);

      this.trackChanges();
    },

    triggerLoaded: function () {
      sitecore.trigger("eds:dialog:loaded", this);
    },

    showDialog: function () {
      this.DialogWindow.viewModel.$el.find('.modal-body').parent().data("height", 130);
      this.DialogWindow.show();

      this.initModel();
    },

    hideDialog: function () {
      this.DialogWindow.hide();
    },

    submitAction: function () {
      this.SaveButton.set("isEnabled", false);
      this.MessageBar.removeMessages();

      var contextItem = this.get("contextItem");

      var email = this.EmailTextBox.get("text");
      if (!edsUtil.emailIsValid(email)) {
        this.EmailTextBox.viewModel.focus();
        this.MessageBar.addMessage("error", sitecore.Resources.Dictionary.translate("Email address is not valid."));
        return;
      }
      contextItem.Email = email;

      var self = this;
      if (contextItem.isValid()) {
        self.ProgressIndicator.set("isBusy", true);
        contextItem.save()
          .then(function () {
            self.hideDialog();
            sitecore.trigger("suppression:changed", contextItem, "add");
          }).fail(function (error) {
            var errorMessage = edsUtil.getErrorMessage(error);
            var message;
            if (errorMessage.length > 0 && errorMessage !== "Operation failed.") { 
              message = errorMessage;
            } else {
              message = sitecore.Resources.Dictionary.translate("The email address \"{0}\" has not been added to the suppression list.") + " " +
                sitecore.Resources.Dictionary.translate("Please try again later.");
            }

            message = sitecore.Helpers.string.format(message, contextItem.Email);
            self.MessageBar.addMessage("error", message);
          }).done(function () {
            self.ProgressIndicator.set("isBusy", false);
          });
      } else {
        this.EmailTextBox.viewModel.focus();
        this.MessageBar.addMessage("error", sitecore.Resources.Dictionary.translate("Validation failed"));
      }
    },

    cleanUp: function () {
      this.ProgressIndicator.set("isBusy", false);
      this.MessageBar.removeMessages();
      this.set("contextItem", null, { unset: true });
    },

    initModel: function () {
      var self = this;

      this.ProgressIndicator.set("isBusy", true);

      var service = edsUtil.getEntityService("EDS/Suppression");
      return service.create().then(function (data) {
        self.set("contextItem", data);
      }).fail(function (error) {
        self.set("contextItem", null);

        var errorMessage = edsUtil.getErrorMessage(error);
        if (errorMessage.length > 0) {
          self.MessageBar.addMessage("error", errorMessage);
        }
      }).done(function () {
        self.ProgressIndicator.set("isBusy", false);
      });
    },

    itemChanged: function () {
      var contextItem = this.get("contextItem") || {};

      this.EmailTextBox.set("text", contextItem.Email);

      this.SaveButton.set("isEnabled", false);
    },

    trackChanges: function () {
      this.EmailTextBox.viewModel.$el.on("cut input paste keyup", _.bind(function (event) {
        this.updateSaveButtonState(event, this.EmailTextBox.viewModel.$el.val(), "Email");
      }, this));
    },

    updateSaveButtonState: function (event, value, property) {
      var contextItem = this.get("contextItem");
      var emailValue = this.EmailTextBox.viewModel.$el.val();

      var isEnabled = contextItem !== null &&
      (contextItem[property] !== value ||
        emailValue !== contextItem["Email"]);

      isEnabled = isEnabled && emailValue.length > 0 && edsUtil.emailIsValid(emailValue);
      this.SaveButton.set("isEnabled", isEnabled);

      if (event && event.keyCode == 13 && isEnabled) {
        this.SaveButton.viewModel.click();
      }
    }
  });
});