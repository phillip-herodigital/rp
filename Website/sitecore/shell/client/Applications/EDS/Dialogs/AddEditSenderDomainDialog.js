define(["sitecore", "/-/speak/v1/EDS/edsUtil.js"], function (sitecore, edsUtil) {
  return sitecore.Definitions.App.extend({
    initialized: function () {
      this.Service = null;

      this.DialogWindow.set("focusOn", "[data-sc-id=NameTextBox]");

      this.DialogWindow.viewModel.$el.on("hidden", _.bind(this.cleanUp, this));

      this.on({
        "app:loaded": this.triggerLoaded,
        "domaindialog:hide": this.hideDialog,
        "domaindialog:submit": this.submitAction,
        "change:contextItem": this.itemChanged
      }, this);

      this.trackChanges();
    },

    triggerLoaded: function () {
      sitecore.trigger("eds:dialog:loaded", this);
    },

    showDialog: function (dialogParams) {
      var itemId = dialogParams && dialogParams.itemId ? dialogParams.itemId : "";

      this.isEditMode = itemId.length > 0;

      var dialogTitle = this.isEditMode ? this.EditDomainText.get("text") : this.AddDomainText.get("text"),
      dialogHeight = this.isEditMode ? 475 : 130;

      this.setDialogTitle(dialogTitle);

      this.SetupInfoBorder.set("isVisible", this.isEditMode);
      this.DialogWindow.viewModel.$el.find('.modal-body').parent().data("height", dialogHeight);

      this.DialogWindow.show();

      this.initModel(itemId);
    },

    hideDialog: function () {
      this.DialogWindow.hide();
    },

    submitAction: function () {
      this.SaveButton.set("isEnabled", false);
      this.MessageBar.removeMessages();

      var contextItem = this.get("contextItem");

      var isOverview = !this.isEditMode && contextItem.isNew == false;
      if (isOverview) {
        this.hideDialog();
        return;
      }

      var domainName = this.NameTextBox.get("text");
      if (!edsUtil.domainIsValid(domainName)) {
        this.NameTextBox.viewModel.focus();
        this.MessageBar.addMessage("error", sitecore.Resources.Dictionary.translate("The domain name is invalid. Enter a new name and try again."));
        return;
      }
      var isNew = contextItem.isNew == true;

      contextItem.DomainName = domainName;

      var self = this;
      if (contextItem.isValid()) {
        self.ProgressIndicator.set("isBusy", true);
        contextItem.save()
          .then(function () {
            var message = isNew ? "The domain \"{0}\" has been added." : "The domain has been updated.";
            message = sitecore.Helpers.string.format(sitecore.Resources.Dictionary.translate(message), contextItem.DomainName);
            self.MessageBar.addMessage("notification", message);

            self.Service.fetchEntity(decodeURIComponent(contextItem.Id))
              .execute()
              .then(function (data) {
                self.set("contextItem", data);
                if (isNew) {
                  self.animateDialogResize();
                }
              });

            sitecore.trigger("domain:changed", contextItem);
          }).fail(function (error) {
            var errorMessage = edsUtil.getErrorMessage(error);
            var message;
            if (errorMessage.length > 0 && errorMessage !== "Operation failed.") {
              message = errorMessage;
            } else {
              message = isNew ? "The domain \"{0}\" has not been added." : "The domain \"{0}\" has not been updated.";
              message = sitecore.Resources.Dictionary.translate(message) + " " + sitecore.Resources.Dictionary.translate("Please try again later.");
            }

            message = sitecore.Helpers.string.format(message, isNew ? domainName : self.originalName);
            self.MessageBar.addMessage("error", message);
          }).done(function () {
            self.ProgressIndicator.set("isBusy", false);
          });
      } else {
        this.NameTextBox.viewModel.focus();
        this.MessageBar.addMessage("error", sitecore.Resources.Dictionary.translate("Validation failed"));
      }
    },

    setDialogTitle: function (titleText) {
      var title = this.DialogWindow.viewModel.$el.find(".sc-dialogWindow-header-title");
      if (title.length) {
        title.text(titleText);
      }
    },

    animateDialogResize: function (height) {
      var dialogElem = this.DialogWindow.viewModel.$el,
        modal = dialogElem.data('modal'),
        modalBody = dialogElem.find('.modal-body'),
        modalBodyHeight = height || 130 + this.SetupInfoBorder.viewModel.$el.outerHeight(),

        modalOverflow = $(window).height() - 10 < dialogElem.height();

      var step = null;
      if (!modalOverflow && !modal.options.modalOverflow) {
        step = function () {
          dialogElem.css("margin-top", 0 - dialogElem.height() / 2);
        }
      }

      modalBody.animate({ "height": modalBodyHeight + "px" }, {
        duration: 600, step: step, complete: function () {
          modalBody.parent().attr("data-height", modalBodyHeight);
          dialogElem.data("height", modalBodyHeight);
          modal.options.height = modalBodyHeight;
          modal.layout();
        }
      }, 'linear');
    },

    cleanUp: function () {
      this.ProgressIndicator.set("isBusy", false);
      this.MessageBar.removeMessages();
      this.set("contextItem", null, { unset: true });
      this.updateValidationImageState();
    },

    initModel: function (itemId) {
      var self = this,
        query;

      this.ProgressIndicator.set("isBusy", true);

      this.Service = edsUtil.getEntityService("EDS/SenderDomain");
      if (itemId) {
        query = this.Service.fetchEntity(decodeURIComponent(itemId)).execute();
      } else {
        query = this.Service.create();
      }

      query.then(function (data) {
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
      var contextItem = this.get("contextItem") || { isNew: !this.isEditMode };
      var hasItem = contextItem.isNew == false;
      var isOverview = !this.isEditMode && hasItem;

      this.originalName = contextItem.DomainName;

      // this.validateDnsRecords(contextItem.Id);
      var dnsRecords = { "SPF": contextItem.SpfValid, "DKIM": contextItem.DkimValid };
      this.updateValidationImageState(dnsRecords);

      this.SetupInfoBorder.set("isVisible", hasItem);

      this.SaveButton.set("text", sitecore.Resources.Dictionary.translate(isOverview ? "Finish" : (hasItem ? "OK" : "Next")));
      this.SaveButton.set("isEnabled", isOverview);

      this.CancelButton.set("text", sitecore.Resources.Dictionary.translate(hasItem ? "Close" : "Cancel"));
      this.CancelButton.set("isVisible", !isOverview);

      this.NameTextBox.set("isVisible", !isOverview);
      this.NameText.set("isVisible", isOverview);

      this.NameTextBox.set("text", contextItem.DomainName);
      this.NameText.set("text", contextItem.DomainName);

      this.SpfRecordValue.set("text", contextItem.SpfRecord);
      this.DnsTxtRecord1Value.set("text", contextItem.DkimPublicKeyRecord);
      this.DnsTxtRecord2Value.set("text", contextItem.DkimRecord);

      var focusButton = isOverview ? this.SaveButton : this.CancelButton;
      focusButton.viewModel.$el.focus();
    },

    validateDnsRecords: function (id) {
      if (!id || id.length == 0) {
        this.updateValidationImageState(null);
        return;
      }

      var url = this.Service.url + "/" + id + "/ValidateDnsRecords";

      var options = {
        url: url,
        data: { id: id },
        type: "GET",
        success: $.proxy(this.updateValidationImageState, this),
        error: $.proxy(this.updateValidationImageState, this)
      }

      $.ajax(options);
    },

    updateValidationImageState: function (data) {
      var spfValidated = data && data["SPF"] !== undefined,
        dkimValidated = data && data["DKIM"] !== undefined;

      this.SpfInfoImage.set("isVisible", !spfValidated && data != null);
      this.SpfWarningImage.set("isVisible", spfValidated && data["SPF"] == false);
      this.SpfValidImage.set("isVisible", spfValidated && data["SPF"] == true);

      this.DkimInfoImage.set("isVisible", !dkimValidated && data != null);
      this.DkimWarningImage.set("isVisible", dkimValidated && data["DKIM"] == false);
      this.DkimValidImage.set("isVisible", dkimValidated && data["DKIM"] == true);
    },

    trackChanges: function () {
      this.NameTextBox.viewModel.$el.on("cut input paste keyup", _.bind(function (event) {
        this.updateSaveButtonState(event, this.NameTextBox.viewModel.$el.val(), "DomainName");
      }, this));

    },

    updateSaveButtonState: function (event, value, property) {
      var contextItem = this.get("contextItem");
      var domainValue = this.NameTextBox.viewModel.$el.val();

      var isEnabled = contextItem !== null &&
      (contextItem[property] !== value ||
        domainValue !== contextItem["DomainName"]);

      isEnabled = isEnabled && domainValue.length > 0 && edsUtil.domainIsValid(domainValue);
      this.SaveButton.set("isEnabled", isEnabled);

      if (event && event.keyCode == 13 && isEnabled) {
        this.SaveButton.viewModel.click();
      }
    }
  });
});