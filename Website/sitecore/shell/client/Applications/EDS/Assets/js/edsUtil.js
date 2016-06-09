define(["sitecore", "/-/speak/v1/client/entityservice.js"], function (sitecore, entityService) {
  return {
    getEntityService: function (path) {
      var service = new entityService({
        url: "/sitecore/api/ssc/" + path,
        headers: {
          "X-RequestVerificationToken": $('[name=__RequestVerificationToken]').val(),
          "X-Requested-With": "XMLHttpRequest"
        }
      });

      return service;
    },

    showDialog: function (panel, dialogId, dialogParams) {
      if (!panel || panel.get("isBusy"))
        return;

      var matchItemId = dialogId && dialogId.length > 0 ? panel.viewModel.itemId() === dialogId : true;

      if (matchItemId && panel.get("isLoaded") && this.CurrentDialog) {
        this.CurrentDialog.showDialog(dialogParams);
      } else {
        panel.set("isBusy", true);
        if (!matchItemId) {
          panel.set("itemId", dialogId);
        }

        var self = this;
        sitecore.off("eds:dialog:loaded").on("eds:dialog:loaded", function (dialog) {
          panel.set("isBusy", false);
          self.CurrentDialog = dialog;
          dialog.showDialog(dialogParams);
        });

        panel.refresh();
      }
    },

    domainIsValid: function (domain) {
      var domainRegex = /^(?=^.{1,240}$)(?:(?:\[(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}\])|(?:(?!www\.)(?:(?:(?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9])\.)+(?:(?!-|[0-9])(?:[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]))))$/;
      return domainRegex.test(domain);
    },

    emailIsValid: function (email) {
      var emailRegex = /^(?=^.{1,254}$)(?:([a-zA-Z0-9_\.\-])+\@(?:(?:\[(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}\])|(?:(?!www\.)(?:(?:(?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9])\.)+(?:(?!-|[0-9])(?:[a-zA-Z0-9-]{0,62}[a-zA-Z0-9])))))$/;
      return emailRegex.test(email);
    },

    setActionState: function (actionControl, actionId, enabled) {
      var actions = actionControl.viewModel.actions();
      for (var i = 0; i < actions.length; i++) {
        if (actions[i].id() === actionId) {
          enabled ? actions[i].enable() : actions[i].disable();
          break;
        }
      }
    },

    getPropertyValue: function (obj, property, jsonProperty) {
      var value = obj ? obj[property] || "" : "";
      if (typeof (value) == "string" && value.length > 0) {
        try {
          var jsonValue = $.parseJSON(value);
          if (jsonValue) {
            return jsonValue[jsonProperty] || "";
          }
        } catch (e) {
        }
      }

      return value;
    },

    handleAjaxError : function (e, jqXHR) {
      switch (jqXHR.status) {
        case 401:
          sitecore.Helpers.session.unauthorized();
          break;
        case 403:
          sitecore.trigger("error:accessdenied", jqXHR);
          break;
        case 500:
          sitecore.trigger('error:general', jqXHR);
          break;
        case 503:
          sitecore.trigger('error:unavailable', jqXHR);
          break;
      }
    },

    getErrorMessage: function (error) {
      return this.getPropertyValue(error, "message", "Message");
    },

    getCookieValue: function (name) {
      var cookie = document.cookie,
        cookieArray = cookie.split(";");

      for (var i = 0; i < cookieArray.length; i++) {
        var cookieItem = cookieArray[i].trim().split("=");

        if (cookieItem[0] === name) {
          return cookieItem[1];
        }
      }

      return null;
    }
  }
});