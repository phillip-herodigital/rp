define(["sitecore", "/-/speak/v1/listmanager/SelectFolder.js", "/-/speak/v1/listmanager/guidGenerator.js",
"/-/speak/v1/listmanager/SelectLists.js"], function (sitecore, selectFolder, guidGenerator, selectLists) {
  var self;
  return sitecore.Definitions.App.extend({
    initialized: function () {
      self = this;
      var contextApp = this;

      contextApp.insertRendering("{64D170BF-507C-4D53-BB4F-8FC76F5F2BBC}", { $el: $("body") }, function (subApp) {
        contextApp["selectFolderDialog"] = subApp;
      });

      selectLists.init(contextApp);

      contextApp.on("list:select:list", contextApp.showSelectListDialog, contextApp);
      contextApp.on("list:select:destination", contextApp.showSelectDestinationDialog, contextApp);

      sitecore.on("recipients:add:list:from:existinglist:dialog:show", contextApp.showAddListFromExistingDialog, contextApp);

      contextApp.on("add:list:dialog:close", contextApp.hideAddListDialog, contextApp);
      contextApp.on("add:list:dialog:ok", contextApp.addList, contextApp);

      self.addListMessageId = null;
      self.existingList = "";
    },

    showAddListFromExistingDialog: function () {
      self.AddListMessageBar.removeMessage(function (error) { return error.id === "listNameIsEmpty"; });
      self.AddListMessageBar.removeMessage(function (error) { return error.id === "existinglistIsEmpty"; });

      self.ListNameTextBox.set("text", "");
      self.ListDescriptionTextArea.set("text", "");
      self.ListDestinationTextBox.set("text", "/sitecore/system/List Manager/All Lists");
      self.ListSelectListTextBox.set("text", "");

      self.OKButton.viewModel.enable();
      self.AddListDialogWindow.show();

      // ANB 14-Nov-13: kind of a hack, but it's theonly way it work, because the modal div has the focus
      setTimeout(function () { self.ListNameTextBox.viewModel.$el.focus(); }, 500);
    },

    addList: function () {
      self.OKButton.viewModel.disable();
      var listName = self.ListNameTextBox.get("text");
      if (!listName) {
        self.AddListMessageBar.addMessage("error", { id: "listNameIsEmpty", text: sitecore.Resources.Dictionary.translate("ECM.Recipients.AddEmptyRecipientList"), actions: [], closable: true });
        return;
      }

      var listDst = self.ListDestinationTextBox.get("text");
      var selectList = self.ListSelectListTextBox.get("text");
      if (!selectList) {
        self.AddListMessageBar.addMessage("error", { id: "existinglistIsEmpty", text: sitecore.Resources.Dictionary.translate("ECM.Recipients.NoExistingListSelected"), actions: [], closable: true });
        return;
      }

      var listDescrption = self.ListDescriptionTextArea.get("text");
      var listId = guidGenerator.getGuid();
      var data = { "Id": listId, "Name": listName, "Owner": "", "Description": listDescrption, "Destination": listDst, "Type": "Contact list", "Source": "{\"IncludedLists\":[" + JSON.stringify(self.existingList) + "],\"ExcludedLists\":[]}" };
      var url = "/sitecore/api/ssc/ListManagement/ContactList";

      $.ajax({
        url: url,
        data: data,
        success: function () {
          self.hideAddListDialog();
          self.notify();
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
      self.AddListMessageBar.removeMessage(function (error) { return error.id === "existinglistIsEmpty"; });

      self.AddListDialogWindow.hide();
      var callback = function (itemId, item) {
        if (typeof item != "undefined" && item != null) {
          self.ListDestinationTextBox.set("text", (item.$path));
        } else {
          self.ListDestinationTextBox.set("text", "/sitecore/system/List Manager/All Lists");
        }
        self.AddListDialogWindow.show();
      };
      selectFolder.SelectFolder(callback, "{BC799B34-8423-48AC-A2FE-D128E6300659}", self.ListDestinationTextBox.get("text"));
    },

    showSelectListDialog: function () {
      self.AddListMessageBar.removeMessage(function (error) { return error.id === "listNameIsEmpty"; });
      self.AddListMessageBar.removeMessage(function (error) { return error.id === "existinglistIsEmpty"; });

      self.AddListDialogWindow.hide();
      var callback = function (itemId, item) {
        if (typeof item != "undefined" && item != null) {
          self.ListSelectListTextBox.set("text", (item.Name));
          self.existingList = item;
        }
        self.AddListDialogWindow.show();
      };
      selectLists.SelectContactListForNewList(callback, []);
    }
  });
});
