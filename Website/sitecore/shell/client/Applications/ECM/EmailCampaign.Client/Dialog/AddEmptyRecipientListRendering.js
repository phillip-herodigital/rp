define(["sitecore", "/-/speak/v1/listmanager/SelectFolder.js", "/-/speak/v1/ecm/guidGenerator.js"], function (sitecore, selectFolder, guidGenerator, selectLists) {
  var self;
  return sitecore.Definitions.App.extend({
    initialized: function () {
      self = this;
      var contextApp = this;

      contextApp.insertRendering("{64D170BF-507C-4D53-BB4F-8FC76F5F2BBC}", { $el: $("body") }, function (subApp) {
        contextApp["selectFolderDialog"] = subApp;
        subApp.SelectFolderDialog.set("backdrop", "static");
      });

      contextApp.on("list:select:destination", contextApp.showSelectDestinationDialog, contextApp);

      sitecore.on("recipients:add:empty:list:dialog:show", contextApp.showAddListDialog, contextApp);

      contextApp.on("add:list:dialog:close", contextApp.hideAddListDialog, contextApp);
      contextApp.on("add:list:dialog:ok", contextApp.addList, contextApp);

      self.addListCallback = null;
      self.addListMessageId = null;
      self.addListRecipientListType = "";
    },

    showAddListDialog: function (callback, messageId, addListRecipientListType) {
      self.AddListMessageBar.removeMessage(function (error) { return error.id === "listNameIsEmpty"; });
      self.ListDescriptionTextArea.set("text", "");
      self.ListNameTextBox.set("text", "");
      self.ListDestinationButtonTextBox.set("text", "/sitecore/system/List Manager/All Lists");

      self.addListCallback = callback;
      self.addListMessageId = messageId;
      self.addListRecipientListType = addListRecipientListType;

      self.OKButton.viewModel.enable();
      self.AddListDialogWindow.show();
      
      var setFocus = function() {
        if (self.ListNameTextBox.viewModel.$el.is(':visible')) {
          self.ListNameTextBox.viewModel.$el.focus();
        } else
          setTimeout(setFocus, 100);
      };
      setTimeout(setFocus, 100);
      // bootstrap dialog set focus on the div after showing, so we need also handle focus on div not to loose focus
      self.AddListDialogWindow.viewModel.$el.focus(setFocus);
    },

    addList: function () {
      self.OKButton.viewModel.enable();
      var listName = self.ListNameTextBox.get("text");
      if (!listName) {
        var messagetoAdd = { id: "listNameIsEmpty", text: sitecore.Resources.Dictionary.translate("ECM.Recipients.AddEmptyRecipientList"), actions: [], closable: true };
        self.AddListMessageBar.addMessage("error", messagetoAdd);
        return;
      }

      var listDst = self.ListDestinationButtonTextBox.get("text");

      var listDescrption = self.ListDescriptionTextArea.get("text");
      var listId = guidGenerator.getGuid();
      var data = { "Id": listId, "Name": listName, "Owner": "", "Description": listDescrption, "Destination": listDst, "Type": "Contact list", "Source": "{\"IncludedLists\":[],\"ExcludedLists\":[]}" };
      var url = "/sitecore/api/ssc/ListManagement/ContactList";
      
      $.ajax({
        url: url,
        data: data,
        error: function(args) {
          if (args.status === 403) {
            console.error("Not logged in, will reload page");
            window.top.location.reload(true);
          }
        },
        success: function () {
          if (!self.addListCallback || !self.addListMessageId || !self.addListRecipientListType) {
            self.hideAddListDialog();
            self.notify();
          } else {
            self.addListCallback(self.addListMessageId, listId, self.addListRecipientListType);
            self.hideAddListDialog();
            self.notify();
          }
        },
        type: "POST"
      });
    },

    hideAddListDialog: function () {
      self.AddListDialogWindow.hide();
    },

    notify: function () {
      sitecore.trigger("listManager:listCreated");
    },
    
    showSelectDestinationDialog: function () {
      self.AddListMessageBar.removeMessage(function (error) { return error.id === "listNameIsEmpty"; });

      self.AddListDialogWindow.hide();
      var callback = function (itemId, item) {
        if (typeof item != "undefined" && item != null) {
          self.ListDestinationButtonTextBox.set("text", (item.$path));
        } else {
          self.ListDestinationButtonTextBox.set("text", "/sitecore/system/List Manager/All Lists");
        }
        self.AddListDialogWindow.show();
      };
      selectFolder.SelectFolder(callback, "{BC799B34-8423-48AC-A2FE-D128E6300659}", self.ListDestinationButtonTextBox.get("text"));
    },

  });
});
