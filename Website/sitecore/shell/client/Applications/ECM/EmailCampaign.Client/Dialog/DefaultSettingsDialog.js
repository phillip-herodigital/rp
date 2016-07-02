var dependencies = [
  "sitecore",
  "/-/speak/v1/listmanager/SelectLists.js",
  "/-/speak/v1/ecm/ServerRequest.js",
  "/-/speak/v1/ecm/Validation.js"
];

define(dependencies, function (sitecore, selectLists) {
  return sitecore.Definitions.App.extend({
    initialized: function () {
      sitecore.on("default:settings:dialog:show", this.showDialog, this);
      this.on("default:settings:select:globaloptoutlist", this.selectGlobalOptOutList, this);
      this.on("default:settings:dialog:close", this.hideDialog, this);
      this.on("default:settings:dialog:ok", this.save, this);
      sitecore.on("default:settings:dialog:firstrun", this.firstrun, this);

      this.globalOptOutListId = null;

      var dialog = this;
      this.BaseUrlTextBox.on("change:text", function () {
        dialog.OK.set("isEnabled", !!dialog.validate_BaseUrlIsValid(this.get("text"), dialog.MessageBar));
      });
      this.PreviewBaseUrlTextBox.on("change:text", function () {
        dialog.OK.set("isEnabled", !!dialog.validate_PreviewBaseUrlIsValid(this.get("text"), dialog.MessageBar));
      });
      this.FromAddressTextBox.on("change:text", function () {
        dialog.OK.set("isEnabled", !!dialog.validate_FromAddressIsValid(this.get("text"), dialog.FromNameTextBox.get("text"), dialog.MessageBar));
      });
      this.FromNameTextBox.on("change:text", function () {
        dialog.OK.set("isEnabled", dialog.validate_FromNameIsValid(this.get("text"), dialog.FromAddressTextBox.get("text"), dialog.MessageBar));
      });
      this.ReplyToTextBox.on("change:text", function () {
        dialog.OK.set("isEnabled", !!dialog.validate_ReplyToIsValid(this.get("text"), dialog.MessageBar));
      });
    },
    showDialog: function () {
      this.refresh();
      this.DefaultSettingsDialog.show();
    },
    selectGlobalOptOutList: function () {
      var dialog = this;

      var callback = function (itemId, item) {
        if (typeof item != "undefined" && item != null) {
          dialog.GlobalOptOutListTextBox.set("text", (item.Name));
          dialog.globalOptOutListId = itemId;
        }

        dialog.DefaultSettingsDialog.show();
      };

      dialog.DefaultSettingsDialog.hide();
      selectLists.SelectContactListForNewList(callback, []);
    },
    hideDialog: function () {
      var rootList = sitecore.Definitions.Views.ManagerRootSwitcher.prototype.getRootsList();
      if (rootList.length == 0) {
        this.DefaultSettingsDialog.hide();
        location.reload();
      } else {
        this.DefaultSettingsDialog.hide();
      }
    },
    save: function () {
      if (!this.validate()) {
        return;
      }
      
      var dialog = this;
      var result = true;

      var defaultSettingsContext = {
        baseUrl: this.BaseUrlTextBox.get("text"),
        previewBaseUrl: this.PreviewBaseUrlTextBox.get("text"),
        fromAddress: this.FromAddressTextBox.get("text"),
        fromName: this.FromNameTextBox.get("text").escapeAmpersand(),
        replyTo: this.ReplyToTextBox.get("text"),
        globalOptOutListId: dialog.globalOptOutListId,
        managerRootId: sessionStorage.managerRootId
      };
      
      postServerRequest("EXM/SaveDefaultSettings", defaultSettingsContext, function (response) {
        if (response.error) {
          result = false;
          sitecore.trigger("alertdialog", response.errorMessage);
          return;
        }
        
        if (!response.value) {
          result = false;
          dialog.MessageBar.addMessage("error", sitecore.Resources.Dictionary.translate("ECM.DefaultSettings.NotSaved"));
        }
      }, false);
      
      if (!result) {
        dialog.MessageBar.set("isVisible", true);
        return;
      }
      
      this.hideDialog();
    },
    validate: function () {
      var dialog = this;
      var result = true;
      
      dialog.MessageBar.removeMessages();
      
      postServerRequest("EXM/CanSaveDefaultSettings", null, function (response) {
        if (response.error) {
          result = false;
          dialog.MessageBar.addMessage("error", response.errorMessage);
          return;
        }

        if (!response.value) {
          result = false;
          dialog.MessageBar.addMessage("error", sitecore.Resources.Dictionary.translate("ECM.DefaultSettings.DoNotHavePermission"));
        }
      }, false);
      
      if (!result) {
        dialog.MessageBar.set("isVisible", true);
        return false;
      }

      var defaultSettingsContext = {
        baseUrl: this.BaseUrlTextBox.get("text"),
        previewBaseUrl: this.PreviewBaseUrlTextBox.get("text"),
        fromAddress: this.FromAddressTextBox.get("text"),
        replyTo: this.ReplyToTextBox.get("text")
      };
      
      postServerRequest("EXM/ValidateDefaultSettings", defaultSettingsContext, function (response) {
        if (response.error) {
          result = false;
          dialog.MessageBar.addMessage("error", response.errorMessage);
          return;
        }
        
        if (!response.value) {
          result = false;
          dialog.MessageBar.removeMessage(function (error) { return error.id === "notSavedMessage"; });
          dialog.validate_BaseUrlIsValid(dialog.BaseUrlTextBox.get("text"), dialog.MessageBar);
          dialog.validate_PreviewBaseUrlIsValid(dialog.PreviewBaseUrlTextBox.get("text"), dialog.MessageBar);
          dialog.validate_FromAddressIsValid(dialog.FromAddressTextBox.get("text"), null, dialog.MessageBar);
          dialog.validate_FromNameIsValid(dialog.FromNameTextBox.get("text"), dialog.FromAddressTextBox.get("text"), dialog.MessageBar);
          dialog.validate_ReplyToIsValid(dialog.ReplyToTextBox.get("text"), dialog.MessageBar);
          if (dialog.MessageBar.get("errors").length === 0) {
            dialog.MessageBar.addMessage("error", createErrorMessage("notSavedMessage", sitecore.Resources.Dictionary.translate("ECM.DefaultSettings.NotSaved")));
          }
          
          dialog.OK.set("isEnabled", false);
        }
      }, false);
      
      dialog.MessageBar.set("isVisible", !result);
      return result;
    },
    refresh: function () {
      var dialog = this;
      dialog.MessageBar.removeMessages();
      postServerRequest("EXM/LoadDefaultSettings", { value: sessionStorage.managerRootId }, function (response) {
        if (response.error) {
          dialog.MessageBar.addMessage("error", response.errorMessage);
          return;
        }
        dialog.BaseUrlTextBox.set("text", response.baseUrl);
        dialog.PreviewBaseUrlTextBox.set("text", response.previewBaseUrl);
        dialog.FromAddressTextBox.set("text", response.fromAddress);
        dialog.FromNameTextBox.set("text", response.fromName);
        dialog.ReplyToTextBox.set("text", response.replyTo);
        dialog.GlobalOptOutListTextBox.set("text", response.globalOptOutList);
        dialog.globalOptOutListId = response.globalOptOutListId;
      });
    },
    firstrun: function () {
      // check if we should show the dialog or not...
      postServerRequest("EXM/FirstUsage", null, function (response) {
        if (response.error) {
          sitecore.trigger("alertdialog", response.errorMessage);
          return;
        }
        if (response.value) {
          sessionStorage.managerRootId = response.value;
          sessionStorage.firstrun = 1;
          location.reload();
        }
      });  
    },
    validate_BaseUrlIsValid: function(url, messageBar) {
      if (!messageBar) {
        return false;
      }
      
      messageBar.removeMessage(function (error) { return error.id === "notSavedMessage"; });
      
      var baseUrlMessage = createErrorMessage("baseUrlMessage", sitecore.Resources.Dictionary.translate("ECM.DefaultSettings.BaseUrlRequired"));
      var result = isRequired(url, baseUrlMessage, messageBar);
      if (!result) {
        messageBar.set("isVisible", true);
        return false;
      }
      
      baseUrlMessage = createErrorMessage("baseUrlMessage", sitecore.Resources.Dictionary.translate("ECM.DefaultSettings.BaseUrlNotValid"));
      result = urlIsValid(url, baseUrlMessage, messageBar);
      if (!result) {
        messageBar.set("isVisible", true);
      }

      return result;
    },
    validate_PreviewBaseUrlIsValid: function (url, messageBar) {
      if (!messageBar) {
        return false;
      }

      messageBar.removeMessage(function (error) { return error.id === "notSavedMessage"; });

      var baseUrlMessage = createErrorMessage("previewBaseUrlMessage", sitecore.Resources.Dictionary.translate("ECM.DefaultSettings.PreviewBaseUrlNotValid"));

      var result = !url || urlIsValid(url, baseUrlMessage, messageBar);
      if (!result) {
        messageBar.set("isVisible", true);
      } else {
        messageBar.removeMessage(function (error) { return error.id === baseUrlMessage.id; });
      }

      return result;
    },
    validate_FromAddressIsValid: function(email, name, messageBar) {
      if (!messageBar) {
        return false;
      }
      
      messageBar.removeMessage(function (error) { return error.id === "notSavedMessage"; });
      
      var fromEmailMessage = createErrorMessage("fromEmailMessage", sitecore.Resources.Dictionary.translate("ECM.DefaultSettings.FromAddressRequired"));
      var result = isRequired(email, fromEmailMessage, messageBar);
      if (!result) {
        messageBar.set("isVisible", true);
        return false;
      }
      
      result = emailIsValid(email, fromEmailMessage, messageBar);
      if (!result) {
        messageBar.set("isVisible", true);
        return false;
      }
      
      if (name == null) {
        return true;
      }
      
      result = fromNameIsValid(name, email, messageBar, sitecore);
      if (!result) {
        messageBar.set("isVisible", true);
      }

      return result;
    },
    validate_FromNameIsValid: function(name, email, messageBar) {
      if (!messageBar) {
        return false;
      }
      
      messageBar.removeMessage(function (error) { return error.id === "notSavedMessage"; });
      
      var result = fromNameIsValid(name, email, messageBar, sitecore);
      if (!result) {
        messageBar.set("isVisible", true);
      }

      return result;
    },
    validate_ReplyToIsValid: function (email, messageBar) {
      if (!messageBar) {
        return false;
      }
      
      var messageErrorId = "replyToMessage";
      messageBar.removeMessage(function (error) { return error.id === messageErrorId; });
      messageBar.removeMessage(function (error) { return error.id === "notSavedMessage"; });

      if (email == "") {
        return true;
      }
      
      var replyToMessage = createErrorMessage(messageErrorId, sitecore.Resources.Dictionary.translate("ECM.DefaultSettings.ReplyToNotValid"));
      var result = emailIsValid(email, replyToMessage, messageBar);
      if (!result) {
        messageBar.set("isVisible", true);
      }

      return result;
    }
  });
});