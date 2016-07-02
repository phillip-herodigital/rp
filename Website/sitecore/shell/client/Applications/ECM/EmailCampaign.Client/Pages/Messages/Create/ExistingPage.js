define(["sitecore", "/-/speak/v1/ecm/Messages.js"], function (sitecore) {
  return sitecore.Definitions.App.extend({
    initialized: function() {
      var contextApp = this;
      
      if (!sessionStorage.createMessageParameters) {
        this.MessageBar.removeMessage(function (error) { return error.id === "absenceOfEnoughInfomation"; });
        var messagetoAdd = { id: "absenceOfEnoughInfomation", text: sitecore.Resources.Dictionary.translate("ECM.Pipeline.CreateMessage.AbsenceOfEnoughInfomation"), actions: [], closable: false };
        this.MessageBar.addMessage("error", messagetoAdd);
        return;
      }
      
      var parameters = JSON.parse(sessionStorage.createMessageParameters);
      contextApp.setBylineText(parameters.messageTypeTemplateId, contextApp);

      //Set the notification text style to italic.
      contextApp.NotificationText.viewModel.$el.css("font-style", "italic");
      var nameTextBoxViewModel = contextApp.NameTextBox.viewModel;
      nameTextBoxViewModel.focus();
      sessionStorage.removeItem("createMessageName");

      nameTextBoxViewModel.$el.on("keyup", function (e) {
        $(this).change();
        var createButtonViewModel = contextApp.CreateButton.viewModel;
        var value = $(this).val();
        var selectedPagePath = contextApp.ExistingPagePathTextBox.get("text");
        if (!value) {
          createButtonViewModel.disable();
        } else if (selectedPagePath) {
          createButtonViewModel.enable();
          if (e.keyCode === 13) {
            createButtonViewModel.disable();
            if (messages_isCreateMessageAlreadyClicked(value)) { return; }
            contextApp.trigger("createmessage:create");
          }
        }
      });

      contextApp.ExistingPagePathTextBox.viewModel.$el.on("keyup", function () {
        contextApp.ExistingPagePathTextBox.viewModel.$el.change();
        var name = contextApp.NameTextBox.viewModel.$el.val();
        var selectedPagePath = contextApp.ExistingPagePathTextBox.get("text");
        if (!selectedPagePath) {
          contextApp.CreateButton.viewModel.disable();
        } else if (name) {
          contextApp.CreateButton.viewModel.enable();
        }
      });

      contextApp.on("selectExistingPage:browse", contextApp.showDialog, contextApp);
      contextApp.on("select:existing:page:dialog:ok", contextApp.hideDialog, contextApp);
      contextApp.on("select:existing:page:dialog:cancel", contextApp.cancelDialog, contextApp);

      // back
      contextApp.on("createmessage:back", function() {
        history.back();
      });

      window.onbeforeunload = function() {
        //sessionStorage.removeItem("createMessageParameters");
      };

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

        var selectedPagePath = contextApp.ExistingPagePathTextBox.get("text");
        if (!selectedPagePath) {
          this.MessageBar.removeMessage(function (error) { return error.id === "notSelectExistingPage"; });
          var notSelectExistingPage = { id: "notSelectExistingPage", text: sitecore.Resources.Dictionary.translate("ECM.Pipeline.AddPreExstingPage.NotSelectExistingPage"), actions: [], closable: false };
          this.MessageBar.addMessage("error", notSelectExistingPage);
          hasErrors = true;
        }
        
        if (hasErrors) {
          return;
        }
        var rootId = contextApp.EmailManagerRoot.get("managerRootId");
        var templateId = parameters.messageTemplateId;
        var messageTypeTemplateId = parameters.messageTypeTemplateId;
        
        contextApp.currentContext = {
          messageTemplateId: templateId,
          managerRootId: rootId,
          messageName: name,
          messageTypeTemplateId: messageTypeTemplateId,
          existingPagePath: selectedPagePath,
          databaseName: "master"
        };
        
        var context = clone(contextApp.currentContext);

        createNewMessageFromPreExistingPage(context, this.MessageBar, null, contextApp, sitecore);
      });
    },

    showDialog: function () {
      var contextApp = this;
      var selectedPagePath = contextApp.ExistingPagePathTextBox.get("text");
      if (selectedPagePath) {
        if (selectedPagePath[selectedPagePath.length - 1] === "/") {
          selectedPagePath = selectedPagePath.substring(0, selectedPagePath.length - 1);
        }
        var arr = selectedPagePath.split("/");
        var selectedLink = contextApp.ExistingPageTreeView.viewModel.$el.find("a.dynatree-title:contains('" + arr[arr.length - 1] + "')");
        selectedLink.click();
      }

      contextApp.SelectExistingPageDialogWindow.show();
    },

    hideDialog: function () {
      var contextApp = this;
      var selectItem = contextApp.ExistingPageTreeView.viewModel.getActiveNode();
      contextApp.ExistingPagePathTextBox.set("text", selectItem.data.path);
      var name = contextApp.NameTextBox.get("text");
      if (name) {
        contextApp.CreateButton.viewModel.enable();
      }
      contextApp.SelectExistingPageDialogWindow.hide();
    },
    cancelDialog: function () {
      this.SelectExistingPageDialogWindow.hide();
    },

    setBylineText: function (messageTypeTemplateId, contextApp) {
    	switch (messageTypeTemplateId) {
    		case "{54E7880D-2621-49EA-A417-982FCD372903}":
    			contextApp.MessageNameBylineText.set("text", sitecore.Resources.Dictionary.translate("ECM.BylineTexts.OneTimeMessageNameByline"));
    			break;
    		case "{7BE25E20-281C-43DD-AACC-156102617D66}":
    			contextApp.MessageNameBylineText.set("text", sitecore.Resources.Dictionary.translate("ECM.BylineTexts.SubscriptionMessageNameByline"));
    			break;
    		case "{9795C562-98D9-4A9E-BC9C-C6B7A079FDF4}":
    			contextApp.MessageNameBylineText.set("text", sitecore.Resources.Dictionary.translate("ECM.BylineTexts.TriggeredMessageNameByline"));
    			break;
    		default:
    			break;
    	}
    	contextApp.MessageNameBylineText.viewModel.$el.css("font-style", "italic");
    }
  });
});