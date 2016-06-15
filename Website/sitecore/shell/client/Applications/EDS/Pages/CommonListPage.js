define(["sitecore", "/-/speak/v1/EDS/edsUtil.js", "/-/speak/v1/ecm/ListPageBase.js"], function (sitecore, edsUtil, listPageBase) {
  var commonListPage = listPageBase.extend({
    initialized: function () {
      this._super();

      $(document).off("ajaxError").on("ajaxError", edsUtil.handleAjaxError);

      this.on({
        "headers:update": this.updateCustomHeaders
      }, this);
      sitecore.on({
        "error:accessdenied": this.showAccessDenied,
        "error:unavailable": this.showError,
        "error:general": this.showError
      }, this);

      this.checkCustomHeaders();
    },

    showAccessDenied: function () {
      var dialogParams = {
        title: sitecore.Resources.Dictionary.translate("No access rights"),
        text: sitecore.Resources.Dictionary.translate("You do not have the necessary access rights. Please contact your administrator."),
        dialogType: "warning",
        alertMode: true,
        callback: function () {
          location.replace("/sitecore/shell/sitecore/client/Applications/Launchpad");
        }
      };

      edsUtil.showDialog(this.LoadOnDemandPanel, this.dialogIds.ConfirmationDialog, dialogParams);
    },

    showError: function (jqXHR) {
      var errorText = edsUtil.getPropertyValue(jqXHR, "responseText", "Message") || sitecore.Resources.Dictionary.translate("ECM.WeAreVerySorryButThereHasBeenAProblem");
      if (errorText.length > 0) {
        var errorMessage = {
          id: jqXHR.status || "generalerror",
          text: errorText,
          actions: [],
          closable: false
        };

        this.MessageBar.removeMessage(function (oldMessage) { return oldMessage.id === errorMessage.id && oldMessage.text === errorMessage.text; });
        this.MessageBar.addMessage("error", errorMessage);
      }
    },

    checkCustomHeaders: function () {
      this.MessageBar.removeMessage(function (oldMessage) { return oldMessage.id === "getcustomheaders" || oldMessage.id === "updatecustomheaders"; });

      var ajaxOptions = {
        type: "GET",
        url: "/sitecore/api/ssc/EDS/CustomHeaders",
        context: this,
        success: function (data) {
          if (data == false) {
            var warningMessage = {
              id: "getcustomheaders",
              text: sitecore.Resources.Dictionary.translate("There are missing custom headers."),
              actions: [{ text: sitecore.Resources.Dictionary.translate("Update"), action: "trigger:headers:update" }],
              closable: false
            };

            this.MessageBar.addMessage("warning", warningMessage);
          }
        },
        error: function (error) {
          // fails when dyn is not the current provider or get headers returns null. Don't show message here.
        }
      };

      $.ajax(ajaxOptions);
    },

    updateCustomHeaders: function () {
      var ajaxOptions = {
        type: "PUT",
        url: "/sitecore/api/ssc/EDS/CustomHeaders",
        context: this,
        success: $.proxy(this.updateCustomHeadersCompleted, this),
        error: function (error) {
          this.updateCustomHeadersCompleted(false);
        }
      };

      $.ajax(ajaxOptions);
    },

    updateCustomHeadersCompleted: function (success) {
      this.MessageBar.removeMessage(function (oldMessage) { return oldMessage.id === "getcustomheaders" || oldMessage.id === "updatecustomheaders"; });

      if (success) {
        var successMessage = {
          id: "updatecustomheaders",
          text: sitecore.Resources.Dictionary.translate("The custom headers have been updated."),
          actions: [],
          closable: true,
          temporary: true
        };

        this.MessageBar.addMessage("notification", successMessage);
      }
      else {
        var errorMessage = {
          id: "updatecustomheaders",
          text: sitecore.Resources.Dictionary.translate("The custom headers have not been updated."),
          actions: [{ text: sitecore.Resources.Dictionary.translate("Try again."), action: "trigger:headers:update" }],
          closable: false
        };

        this.MessageBar.addMessage("error", errorMessage);
      }
    }
  });

  return commonListPage;
});