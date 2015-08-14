define([
  "sitecore",
  "underscore",
  "/-/speak/v1/listmanager/SelectLists.js",
  "/-/speak/v1/listmanager/ImportWizard.js",
  "/-/speak/v1/ecm/Validation.js"
], function (sitecore, _, selectLists, importWizard) {
  var contextApp;
  var self = this;

  this.includedRecipientsAccordionChange = function () {
    if (!contextApp.IncludedRecipientDataSource) {
      return;
    }

    self.recipientsAccordionChange(contextApp.IncludedRecipientDataSource.get("recipientListType"));
  };

  this.excludedRecipientsAccordionChange = function () {
    if (!contextApp.ExcludedRecipientDataSource) {
      return;
    }

    self.recipientsAccordionChange(contextApp.ExcludedRecipientDataSource.get("recipientListType"));
  };

  this.includedRecipientListsAccordionChange = function () {
    if (!contextApp.IncludedRecipientDataSource) {
      return;
    }

    self.recipientListsAccordionChange(contextApp.IncludedRecipientDataSource.get("recipientListType"));
  };

  this.excludedRecipientListsAccordionChange = function () {
    if (!contextApp.ExcludedRecipientDataSource) {
      return;
    }

    self.recipientListsAccordionChange(contextApp.ExcludedRecipientDataSource.get("recipientListType"));
  };

  this.includedRecipientListSelectedItemChanged = function () {
    var recipientListType = contextApp.IncludedRecipientDataSource.get("recipientListType");

    if (self.getRecipientListSelection(recipientListType) === "All") {
      this.toggleIncludedRecipientsControls();
      self.showRecipientOnCheckedItemsChanged(recipientListType);
    }
  };

  this.includedRecipientListCheckedItemsChanged = function (sender, args) {
    if (!contextApp.IncludedRecipientDataSource) {
      return;
    }

    this.toggleIncludedRecipientsControls();
    self.showRecipientOnCheckedItemsChanged(contextApp.IncludedRecipientDataSource.get("recipientListType"));
  };

  this.includedRecipientListItemsChanged = function () {
    if (!contextApp.IncludedRecipientDataSource || !contextApp.IncludedRecipientListControl) {
      return;
    }
    if (contextApp.IncludedRecipientListControl.get("items").length > 0) {
      contextApp.MessageBar.removeMessage(function (error) { return error.id === "error.ecm.savemessage.norecipientlist"; });
    }

    if (contextApp.MessageContext.get("messageType") === "Triggered") {
      if (!contextApp.IncludeRecipientsExistingListButton || !contextApp.IncludeRecipientsCreateEmptyListButton) {
        return;
      }

      if (contextApp.IncludedRecipientListControl.get("items").length > 0) {
        contextApp.IncludeRecipientsExistingListButton.viewModel.disable();
        contextApp.IncludeRecipientsCreateEmptyListButton.viewModel.disable();
      } else {
        contextApp.IncludeRecipientsExistingListButton.viewModel.enable();
        contextApp.IncludeRecipientsCreateEmptyListButton.viewModel.enable();
      }
    }
    self.onRecipientListsItemChange(contextApp.IncludedRecipientDataSource.get("recipientListType"));
  };

  this.excludedRecipientListItemsChanged = function () {
    if (!contextApp.ExcludedRecipientDataSource) {
      return;
    }

    self.onRecipientListsItemChange(contextApp.ExcludedRecipientDataSource.get("recipientListType"));
  };

  this.excludedRecipientListSelectedItemChanged = function () {
    this.toggleExcludedRecipientsControls();
    var recipientListType = contextApp.ExcludedRecipientDataSource.get("recipientListType");

    if (self.getRecipientListSelection(recipientListType) === "Selected") {
      self.showRecipientOnCheckedItemsChanged(contextApp.ExcludedRecipientDataSource.get("recipientListType"));
    }
  };

  this.excludedRecipientListCheckedItemsChagned = function (sender, args) {
    if (!contextApp.ExcludedRecipientDataSource) {
      return;
    }

    this.toggleExcludedRecipientsControls();
    self.showRecipientOnCheckedItemsChanged(contextApp.ExcludedRecipientDataSource.get("recipientListType"));
  };

  this.recipientListsAccordionChange = function (recipientListType) {
    if (!recipientListType) {
      return;
    }

    var recipientListsAccordion, recipientDataSource, showMoreRecipientListsButton;
    if (recipientListType === "{AAD5DC30-CC86-4988-BAF1-98661B02B79B}") {
      recipientListsAccordion = contextApp.IncludedRecipientListsAccordion;
      recipientDataSource = contextApp.IncludedRecipientDataSource;
      showMoreRecipientListsButton = contextApp.IncludedShowMoreButton;
    } else if (recipientListType === "{CCFBB206-497D-4528-9837-C3CDD8E06791}") {
      recipientListsAccordion = contextApp.ExcludedRecipientListsAccordion;
      recipientDataSource = contextApp.ExcludedRecipientDataSource;
      showMoreRecipientListsButton = contextApp.ExcludedShowMoreButton;
    } else {
      return;
    }
    if (!recipientListsAccordion || !showMoreRecipientListsButton) {
      return;
    }
    if (recipientListsAccordion.get("isOpen")) {
      if (recipientDataSource.get("hasMoreRecipientLists")) {
        showMoreRecipientListsButton.viewModel.enable();
      }
    } else {
      showMoreRecipientListsButton.viewModel.disable();
    }
  };

  this.recipientsAccordionChange = function (recipientListType) {
    if (!recipientListType) {
      return;
    }

    var recipientsAccordion, recipientListControl, recipientDataSource, recipientsListControl;
    if (recipientListType === "{AAD5DC30-CC86-4988-BAF1-98661B02B79B}") {
      recipientsAccordion = contextApp.IncludedRecipientsAccordion;
      recipientListControl = contextApp.IncludedRecipientListControl;
      recipientDataSource = contextApp.IncludedRecipientDataSource;
      recipientsListControl = contextApp.IncludedRecipientsListControl;
    } else if (recipientListType === "{CCFBB206-497D-4528-9837-C3CDD8E06791}") {
      recipientsAccordion = contextApp.ExcludedRecipientsAccordion;
      recipientListControl = contextApp.ExcludedRecipientListControl;
      recipientDataSource = contextApp.ExcludedRecipientDataSource;
      recipientsListControl = contextApp.ExcludedRecipientsListControl;
    } else {
      return;
    }
    if (!recipientsAccordion || !recipientListControl || !recipientDataSource || !recipientsListControl) {
      return;
    }
    if (recipientsAccordion.get("isOpen")) {
      if (recipientListControl.get("checkedItems").length > 0) {
        recipientDataSource.viewModel.refreshRecipients(recipientListControl.get("checkedItems"));
      } else {
        recipientDataSource.viewModel.refreshRecipients(recipientListControl.get("items"));
      }
    }
  };

  this.showRecipientOnCheckedItemsChanged = function (recipientListType) {
    var selection = this.getRecipientListSelection(recipientListType);
    if (!selection) {
      return null;
    }

    var recipientListControl, recipientDataSource;
    if (recipientListType === "{AAD5DC30-CC86-4988-BAF1-98661B02B79B}") {
      recipientListControl = contextApp.IncludedRecipientListControl;
      recipientDataSource = contextApp.IncludedRecipientDataSource;
    } else if (recipientListType === "{CCFBB206-497D-4528-9837-C3CDD8E06791}") {
      recipientListControl = contextApp.ExcludedRecipientListControl;
      recipientDataSource = contextApp.ExcludedRecipientDataSource;
    } else {
      return null;
    }
    if (!recipientListControl || !recipientDataSource) {
      return null;
    }

    if (selection === "Selected") {
      recipientDataSource.viewModel.refreshRecipients([recipientListControl.get("selectedItem").attributes]);
    } else if (selection === "Checked") {
      recipientDataSource.viewModel.refreshRecipients(recipientListControl.get("checkedItems"));
    } else if (selection === "All") {
      recipientDataSource.viewModel.refreshRecipients(recipientListControl.get("items"));
    }

    return true;
  };

  this.getRecipientListSelection = function (recipientListType) {
    if (!recipientListType) {
      return null;
    }

    var recipientListControl, recipientDataSource;
    if (recipientListType === "{AAD5DC30-CC86-4988-BAF1-98661B02B79B}") {
      recipientListControl = contextApp.IncludedRecipientListControl;
      recipientDataSource = contextApp.IncludedRecipientDataSource;
    } else if (recipientListType === "{CCFBB206-497D-4528-9837-C3CDD8E06791}") {
      recipientListControl = contextApp.ExcludedRecipientListControl;
      recipientDataSource = contextApp.ExcludedRecipientDataSource;
    } else {
      return null;
    }
    if (!recipientListControl || !recipientDataSource) {
      return null;
    }

    if (recipientListControl.get("checkedItems").length > 0) {
      return "Checked";
    } else if (recipientListControl.get("selectedItem")) {
      return "Selected";
    } else {
      return "All";
    }
  };

  this.onRecipientListsItemChange = function (recipientListType) {
    if (!recipientListType) {
      return;
    }

    var recipientsAccordion, recipientListControl, recipientDataSource;
    if (recipientListType === "{AAD5DC30-CC86-4988-BAF1-98661B02B79B}") {
      recipientsAccordion = contextApp.IncludedRecipientsAccordion;
      recipientListControl = contextApp.IncludedRecipientListControl;
      recipientDataSource = contextApp.IncludedRecipientDataSource;
    } else if (recipientListType === "{CCFBB206-497D-4528-9837-C3CDD8E06791}") {
      recipientsAccordion = contextApp.ExcludedRecipientsAccordion;
      recipientListControl = contextApp.ExcludedRecipientListControl;
      recipientDataSource = contextApp.ExcludedRecipientDataSource;
    } else {
      return;
    }
    if (!recipientsAccordion || !recipientListControl || !recipientDataSource) {
      return;
    }
    var header = recipientsAccordion.get("header");
    var totalRecipients = recipientDataSource.get("totalRecipients");
    var indexOfColon = header.indexOf(":");
    if (indexOfColon === -1) {
      header = header + " : " + totalRecipients;
    } else {
      header = header.substr(0, indexOfColon) + ": " + totalRecipients;
    }

    recipientsAccordion.set("header", header);

    if (recipientListControl.get("checkedItems").length == 0) {
      recipientDataSource.viewModel.refreshRecipients(recipientListControl.get("items"));
    }
  };

  this.toggleRecipientsActionControl = function (recipientListType) {
    if (!recipientListType) {
      return;
    }

    var recipientListsActionControl, recipientListControl, removeAction, editAction, setDefaultAction,
      removeBouncedRecipientsAction, removeUnsbuscribedAction, removeComplainedRecipientsAction;
    if (recipientListType === "{AAD5DC30-CC86-4988-BAF1-98661B02B79B}") {
      recipientListsActionControl = contextApp.IncludedRecipientListsActionControl;
      recipientListControl = contextApp.IncludedRecipientListControl;
      editAction = "A84CE5AE632D414A8F0AD11516BF4E45";
      removeAction = "817E5DA324014FD2AF7E861EB1564BB7";
      setDefaultAction = "0D6763C2CFD743D1A3027E4585D9404E";
      removeBouncedRecipientsAction = "EB89819A9A39490E88483BA699040FBD";
      removeUnsbuscribedAction = "A782C29B652C4E5EA5FAA4CF27A8EC2A";
      removeComplainedRecipientsAction = "36F893562F6344A8BD3192FA3C32FEDE";
    } else if (recipientListType === "{CCFBB206-497D-4528-9837-C3CDD8E06791}") {
      recipientListsActionControl = contextApp.ExcludedRecipientListsActionControl;
      recipientListControl = contextApp.ExcludedRecipientListControl;
      editAction = "55917BD5549F411B85A203C4B48382E5";
      removeAction = "64BCCD55711F4FC288E7749EC98BD0CD";
      setDefaultAction = "5522F067CF40452AA1CEF98E8B0C21F6";
      removeBouncedRecipientsAction = null;
      removeUnsbuscribedAction = null;
      removeComplainedRecipientsAction = null;
    } else {
      return;
    }

    var recipientListSelectedItem = recipientListControl.get("selectedItem"),
      recipientListSelectedItemId = recipientListSelectedItem ? recipientListSelectedItem.get("itemId") : "";

    var isReadOnly = contextApp.MessageContext.get("isReadonly"),
        isNothingSelected = recipientListSelectedItemId === "" && recipientListControl.get("checkedItems").length === 0,
        isSent = contextApp.MessageContext.get("messageState") === 3;

    if ((recipientListSelectedItem && recipientListSelectedItem !== "" && recipientListControl.get("checkedItems").length === 0)
      || recipientListControl.get("checkedItems").length === 1) {

      this.enableAction(recipientListsActionControl, editAction, !isReadOnly);
      this.enableAction(recipientListsActionControl, removeAction, !isReadOnly);

      var recipientList, isDefault, type;
      if (recipientListControl.get("checkedItems").length === 1) {
        recipientList = recipientListControl.get("checkedItems")[0];
        isDefault = recipientList.default;
        type = recipientList.type;
      } else {
        recipientList = recipientListSelectedItem;
        isDefault = recipientList.get("default");
        type = recipientList.get("type");
      }
      this.enableAction(recipientListsActionControl, setDefaultAction, type !== "Segmented list" && isDefault !== contextApp.RecipientsStringDictionary.translate("ECM.Pages.Recipients.Yes") && !isReadOnly);
      this.enableAction(recipientListsActionControl, removeBouncedRecipientsAction, type !== "Segmented list" && !isNothingSelected);
      this.enableAction(recipientListsActionControl, removeUnsbuscribedAction, type !== "Segmented list" && isSent && !isNothingSelected);
      this.enableAction(recipientListsActionControl, removeComplainedRecipientsAction, type !== "Segmented list" && isSent && !isNothingSelected);
    } else if (recipientListControl.get("checkedItems").length > 1) {
      this.enableAction(recipientListsActionControl, editAction, false);
      this.enableAction(recipientListsActionControl, removeAction, !isReadOnly);
      this.enableAction(recipientListsActionControl, setDefaultAction, false);
      this.enableAction(recipientListsActionControl, removeBouncedRecipientsAction, false);
      this.enableAction(recipientListsActionControl, removeUnsbuscribedAction, isSent && !isNothingSelected);
      this.enableAction(recipientListsActionControl, removeComplainedRecipientsAction, isSent && !isNothingSelected);
    } else {
      this.enableAction(recipientListsActionControl, editAction, false);
      this.enableAction(recipientListsActionControl, removeAction, false);
      this.enableAction(recipientListsActionControl, setDefaultAction, false);
      this.enableAction(recipientListsActionControl, removeBouncedRecipientsAction, false);
      this.enableAction(recipientListsActionControl, removeUnsbuscribedAction, false);
      this.enableAction(recipientListsActionControl, removeComplainedRecipientsAction, false);
    }
  };

  this.enableAction = function (actionControl, actionId, enable) {
    if (actionId) {
      var actions = actionControl.attributes.actions;
      for (var i = 0; i < actions.length; i++) {
        if (actions[i].id() === actionId) {
          enable ? actions[i].enable() : actions[i].disable();
          break;
        }
      }
    }
  };

  this.resetSelectedItems = function (recipientListControl) {
    recipientListControl.set("checkedItemIds", []);
    recipientListControl.set("checkedItems", []);
    recipientListControl.set("selectedItemId", "");
    recipientListControl.set("selectedItem", "");
  };

  this.addListToListControl = function (messageId, recipientListId, recipientListType) {
    if (typeof recipientListId != "undefined" && recipientListId != null) {
        postServerRequest("EXM/AddRecipientList", { messageId: messageId, recipientListId: recipientListId, type: recipientListType }, function (response) {
        if (response.error) {
          return;
        }
        self.refreshListControls(messageId, recipientListId, recipientListType, response);
        sitecore.trigger("recipientLists:added");
      }, false);
    }
  };

  this.refreshListControls = function (messageId, recipientListId, recipientListType, response) {
    if (typeof recipientListId != "undefined" && recipientListId != null) {
      var recipientListControl, recipientDataSource;
      if (recipientListType === "{AAD5DC30-CC86-4988-BAF1-98661B02B79B}") {
        recipientListControl = contextApp.IncludedRecipientListControl;
        recipientDataSource = contextApp.IncludedRecipientDataSource;
      } else if (recipientListType === "{CCFBB206-497D-4528-9837-C3CDD8E06791}") {
        recipientListControl = contextApp.ExcludedRecipientListControl;
        recipientDataSource = contextApp.ExcludedRecipientDataSource;
      } else {
        return;
      }
      if (!recipientListControl || !recipientDataSource) {
        return;
      }

      var newRecipientList = response.recipientLists[0];

      var totalRecipients = recipientDataSource.get("totalRecipients") + newRecipientList.recipients;
      recipientDataSource.set("totalRecipients", totalRecipients);

      if (response.isUncommittedRead) {
        sitecore.trigger("notify:recipientList:locked");
      }

      var currentItems = recipientListControl.get("items");
      var newItems = [];
      newItems.push(newRecipientList);
      var items;
      if (currentItems.length > 0) {
        items = Array.prototype.concat.call(currentItems, newItems);
      } else {
        items = newItems;
      }

      var defaultListIndex = -1;
      for (var index = 0; index < items.length; ++index) {
        if (items[index].default == contextApp.RecipientsStringDictionary.translate("ECM.Pages.Recipients.Yes")) {
          defaultListIndex = index;
          break;
        }
      }

      if (defaultListIndex > 0) {
        var defaultList = items[defaultListIndex];
        items.splice(defaultListIndex, 1);
        items.splice(0, 0, defaultList);
      }
      recipientListControl.set("items", items);
    }
  };

  this.addList = function (messageId, recipientListType, showDialogCallback) {
    var callback = function (itemId, item) {
      if (typeof itemId != "undefined" && itemId != null) {
        if (item && contextApp.MessageContext.get("messageType") === "Triggered") {
          if (item.Type === "Segmented list") {
            var messagetoAdd = { id: "cannotAddSegmentedList", text: sitecore.Resources.Dictionary.translate("ECM.Recipients.TriggeredMessageCanNotHaveSegmentedList"), actions: [], closable: true };
            contextApp.MessageBar.addMessage("error", messagetoAdd);
            return;
          }
        }
        self.addListToListControl(messageId, itemId, recipientListType);
      }
    };
    contextApp.MessageBar.removeMessage(function (error) { return error.id === "cannotAddSegmentedList"; });

    var includeItems = contextApp.IncludedRecipientListControl.get("items");
    var excludeItems = [];
    if (contextApp.ExcludedRecipientListControl) {
      excludeItems = contextApp.ExcludedRecipientListControl.get("items");
    }
    var allExcludeItems = Array.prototype.concat.call(includeItems, excludeItems);

    var allExcludeItemsIds = [];
    for (var i = 0; i < allExcludeItems.length; i++) {
      allExcludeItemsIds.push(allExcludeItems[i].itemId);
    }
    showDialogCallback(callback, allExcludeItemsIds);
  };

  this.removeList = function (messageId, recipientListType) {
    var itemIds = [];
    var recipientListControl, recipientDataSource;
    if (recipientListType === "{AAD5DC30-CC86-4988-BAF1-98661B02B79B}") {
      recipientListControl = contextApp.IncludedRecipientListControl;
      recipientDataSource = contextApp.IncludedRecipientDataSource;
    } else if (recipientListType === "{CCFBB206-497D-4528-9837-C3CDD8E06791}") {
      recipientListControl = contextApp.ExcludedRecipientListControl;
      recipientDataSource = contextApp.ExcludedRecipientDataSource;
    } else {
      return;
    }

    if (!recipientListControl || !recipientDataSource) {
      return;
    }

    if (recipientListControl.get("checkedItemIds").length > 0) {
      itemIds = recipientListControl.get("checkedItemIds");
    } else if (recipientListControl.get("selectedItemId")) {
      itemIds.push(recipientListControl.get("selectedItemId"));
    }

    postServerRequest("EXM/RemoveRecipientList", { messageId: messageId, recipientListIds: itemIds, type: recipientListType }, function (response) {
      if (response.error) {
        return;
      }

      var newItems = [];
      var index;
      var isRemovedListWasDefault = false;
      var oldItems = recipientListControl.get("items");

      for (index = 0; index < oldItems.length; ++index) {
        if (!_.contains(itemIds, oldItems[index].itemId)) {
          newItems.push(oldItems[index]);
        } else {
          isRemovedListWasDefault = oldItems[index].default === contextApp.RecipientsStringDictionary.translate("ECM.Pages.Recipients.Yes");
        }
      }

      var totalRecipients = 0;
      for (index = 0; index < newItems.length; ++index) {
        totalRecipients += newItems[index].recipients;
      }
      recipientDataSource.set("totalRecipients", totalRecipients);

      var defaultListIndex = -1;
      
      for (index = 0; index < newItems.length; ++index) {
        if (newItems[index].type !== "Segmented list") {
          defaultListIndex = index;
          break;
        }
      }
      if (defaultListIndex > 0) {
        var defaultList = newItems[defaultListIndex];
        defaultList.default = contextApp.RecipientsStringDictionary.translate("ECM.Pages.Recipients.Yes");
        newItems.splice(defaultListIndex, 1);
        newItems.splice(0, 0, defaultList);
      } else if (defaultListIndex === 0) {
        newItems[defaultListIndex].default = contextApp.RecipientsStringDictionary.translate("ECM.Pages.Recipients.Yes");
      }

      self.resetSelectedItems(recipientListControl);
      recipientListControl.set("items", newItems);

      var triggerName = isRemovedListWasDefault ? "recipientLists:removeddefault" : "recipientLists:removed";
      sitecore.trigger(triggerName);
    });
  };

  this.setDefaultList = function (messageId, recipientListType) {
    var recipientListControl;
    if (recipientListType === "{AAD5DC30-CC86-4988-BAF1-98661B02B79B}") {
      recipientListControl = contextApp.IncludedRecipientListControl;
    } else {
      recipientListControl = contextApp.ExcludedRecipientListControl;
    }

    if (!recipientListControl.get("selectedItemId")
      && recipientListControl.get("checkedItemIds").length !== 1) {
      return;
    }
    var recipientList, recipientListId;
    if (recipientListControl.get("checkedItems").length === 1) {
      recipientList = recipientListControl.get("checkedItems")[0];
      recipientListId = recipientList.itemId;
    } else {
      recipientList = recipientListControl.get("selectedItem");
      recipientListId = recipientList.get("itemId");
    }

    if (recipientList.type === "Segmented list") {
      return;
    }

    postServerRequest("EXM/SetDefaultRecipientList", { messageId: messageId, recipientListId: recipientListId, type: recipientListType }, function (response) {
      if (response.error) {
        return;
      }

      var index;
      var newItems = [];
      var defaultListIndex = -1;
      var items = recipientListControl.get("items");
      for (index = 0; index < items.length; ++index) {
        if (items[index].itemId === recipientListId) {
          defaultListIndex = index;
          break;
        }
      }

      if (defaultListIndex > 0) {
        items[0].default = "";
        items[defaultListIndex].default = contextApp.RecipientsStringDictionary.translate("ECM.Pages.Recipients.Yes");
        newItems.push(items[defaultListIndex]);
        items.splice(defaultListIndex, 1);
        for (index = 0; index < items.length; ++index) {
          newItems.push(items[index]);
        }
      }

      recipientListControl.set("items", newItems);
      self.resetSelectedItems(recipientListControl);
      sitecore.trigger("recipientLists:changeddefault");
    });
  };

  this.editList = function (recipientListType) {
    var recipientListControl;
    if (recipientListType === "{AAD5DC30-CC86-4988-BAF1-98661B02B79B}") {
      recipientListControl = contextApp.IncludedRecipientListControl;
    } else {
      recipientListControl = contextApp.ExcludedRecipientListControl;
    }

    var recipientListId, type;
    if (recipientListControl.get("checkedItems").length === 1) {
      var recipientList = recipientListControl.get("checkedItems")[0];
      recipientListId = this.convertToLMIdFormat(recipientList.itemId);
      type = recipientList.type;
    } else {
      recipientList = recipientListControl.get("selectedItem");
      recipientListId = this.convertToLMIdFormat(recipientList.get("itemId"));
      type = recipientList.get("type");
    }
    var url = "/sitecore/client/Applications/List Manager/Taskpages/" + type + "?id=" + recipientListId;
    window.open(url);
  };

  this.convertToLMIdFormat = function (itemId) {
    return itemId.replace("{", "").replace("}", "").replace(/-/g, "");
  };

  this.searchRecipients = function (searchText, recipientListType) {
    if (!recipientListType) {
      return;
    }
    var recipientDataSource;
    if (recipientListType === "{AAD5DC30-CC86-4988-BAF1-98661B02B79B}") {
      recipientDataSource = contextApp.IncludedRecipientDataSource;
    } else if (recipientListType === "{CCFBB206-497D-4528-9837-C3CDD8E06791}") {
      recipientDataSource = contextApp.ExcludedRecipientDataSource;
    } else {
      return;
    }

    recipientDataSource.set("search", searchText);
  };

  return {
    init: function (app) {
      contextApp = app;
      selectLists.init(contextApp);
      importWizard.init(contextApp);

      this.toggleIncludedRecipientsControls();
      this.toggleExcludedRecipientsControls();

      // Hide progress indicators when List controls is not visible yet.
      contextApp.IncludedRecipientDataSource.on("change:IsRecipientsBusy", function () {
        if (!contextApp.IncludedRecipientListControl.viewModel.$el.is(":visible")) {
          contextApp.IncludedRecipientListsProgressIndicator.set("isBusy", false);
          contextApp.IncludedRecipientsProgressIndicator.set("isBusy", false);
        }
      }, this);

      // Triggered messages have no ExcludedRecipients list
      if (contextApp.ExcludedRecipientDataSource) {
        contextApp.ExcludedRecipientDataSource.on("change:IsRecipientsBusy", function () {
          if (!contextApp.ExcludedRecipientListControl.viewModel.$el.is(":visible")) {
            contextApp.ExcludedRecipientListsProgressIndicator.set("isBusy", false);
            contextApp.ExcludedRecipientsProgressIndicator.set("isBusy", false);
          }
        }, this);
      }
      
      contextApp.MessageContext.on("change:isBusy", this.initRecipientsTab, this);
      contextApp.MessageContext.on("change:isReadonly", this.initRecipientsTab, this);

      contextApp.on("add:included:from:existinglist", this.addIncludeList, this);
      contextApp.on("add:included:from:file", this.addIncludeFile, this);
      contextApp.on("add:excluded:from:file", this.addExcludeFile, this);
      contextApp.on("remove:included:from:existinglist", this.removeIncludedList, this);
      contextApp.on("setdefault:included:from:existinglist", this.setDefaultIncludedList, this);
      contextApp.on("removebouncedrecipients:from:included", this.removeBouncedRecipientsFromIncluded);
      contextApp.on("removeunsubscribedrecipients:from:included", this.removeUnsubscribedRecipientsFromIncluded);
      contextApp.on("removecomplainedrecipients:from:included", this.removeComplainedRecipientsFromIncluded);
      contextApp.on("edit:included:from:existinglist", this.editIncludedList, this);

      contextApp.on("add:excluded:from:existinglist", this.addExcludeList, this);
      contextApp.on("remove:excluded:from:existinglist", this.removeExcludedList, this);
      contextApp.on("setdefault:excluded:from:existinglist", this.setDefaultExcludedList, this);
      contextApp.on("edit:excluded:from:existinglist", this.editExcludedList, this);

      contextApp.on("add:included:empty:list", this.addEmptyIncludedList, this);
      sitecore.on("add:list", self.refreshListControls, self);

      sitecore.on("change:messageContext:currentState", contextApp.MessageContext.viewModel.refresh, this);

      contextApp.on("action:Included:SearchItems", function () {
        var text = contextApp.IncludedRecipientsSearchTextBox.viewModel.$el.find("input").val();
        self.searchRecipients(text, contextApp.IncludedRecipientDataSource.get("recipientListType"));
      }, contextApp);

      contextApp.on("action:excluded:SearchItems", function () {
        var text = contextApp.ExcludedRecipientsSearchTextBox.viewModel.$el.find("input").val();
        self.searchRecipients(text, contextApp.ExcludedRecipientDataSource.get("recipientListType"));
      }, contextApp);

      if (contextApp.IncludedRecipientListControl) {
        contextApp.IncludedRecipientListControl.on("change:selectedItem", self.includedRecipientListSelectedItemChanged, this);
        contextApp.IncludedRecipientListControl.on("change:checkedItems", self.includedRecipientListCheckedItemsChanged, this);
        contextApp.IncludedRecipientListControl.on("change:items", self.includedRecipientListItemsChanged, this);
        contextApp.IncludedRecipientsAccordion.on("change:isOpen", self.includedRecipientsAccordionChange, this);
        contextApp.IncludedRecipientListsAccordion.on("change:isOpen", self.includedRecipientListsAccordionChange, this);
        self.includedRecipientListItemsChanged();
      }

      if (contextApp.ExcludedRecipientListControl) {
        contextApp.ExcludedRecipientListControl.on("change:selectedItem", self.excludedRecipientListSelectedItemChanged, this);
        contextApp.ExcludedRecipientListControl.on("change:checkedItems", self.excludedRecipientListCheckedItemsChagned, this);
        contextApp.ExcludedRecipientListControl.on("change:items", self.excludedRecipientListItemsChanged, this);
        contextApp.ExcludedRecipientsAccordion.on("change:isOpen", self.excludedRecipientsAccordionChange, this);
        contextApp.ExcludedRecipientListsAccordion.on("change:isOpen", self.excludedRecipientListsAccordionChange, this);
        self.excludedRecipientListItemsChanged();
      }

      if (contextApp.IncludedRecipientsSearchTextBox) {
        contextApp.IncludedRecipientsSearchTextBox.viewModel.$el.on("keypress", function (event) {
          var text = contextApp.IncludedRecipientsSearchTextBox.viewModel.$el.find("input").val();
          if (event.which == '13'/*Enter*/) {
            self.searchRecipients(text, contextApp.IncludedRecipientDataSource.get("recipientListType"));
          }
        });

        contextApp.IncludedRecipientsSearchTextBox.viewModel.$el.on("keyup", function (event) {
          if (event.which == '27'/*Escape*/) {
            self.cancelSearch(contextApp.IncludedRecipientDataSource.get("recipientListType"));
          }
        });
      }

      if (contextApp.ExcludedRecipientsSearchTextBox) {

        contextApp.ExcludedRecipientsSearchTextBox.viewModel.$el.on("keypress", function (event) {
          var text = contextApp.ExcludedRecipientsSearchTextBox.viewModel.$el.find("input").val();
          if (event.which == '13'/*Enter*/) {
            self.searchRecipients(text, contextApp.ExcludedRecipientDataSource.get("recipientListType"));
          }
        });

        contextApp.ExcludedRecipientsSearchTextBox.viewModel.$el.on("keyup", function (event) {
          if (event.which == '27'/*Escape*/) {
            self.cancelSearch(contextApp.ExcludedRecipientDataSource.get("recipientListType"));
          }
        });
      }
    },

    initRecipientsTab: function () {
      var isBusy = contextApp.MessageContext.get("isBusy");
      var isReadonly = contextApp.MessageContext.get("isReadonly");
      if (!isBusy && isReadonly) {
        if (contextApp.IncludedRecipientListsActionControl) {
          contextApp.IncludeRecipientsExistingListButton.viewModel.disable();
          if (contextApp.MessageContext.get("messageType") === "Triggered") {
            contextApp.IncludeRecipientsCreateEmptyListButton.viewModel.disable();
          } else {
            contextApp.IncludeRecipientsSelectFileButton.viewModel.disable();
          }
          self.enableAction(contextApp.IncludedRecipientListsActionControl, "A84CE5AE632D414A8F0AD11516BF4E45", false);
          self.enableAction(contextApp.IncludedRecipientListsActionControl, "817E5DA324014FD2AF7E861EB1564BB7", false);
          self.enableAction(contextApp.IncludedRecipientListsActionControl, "0D6763C2CFD743D1A3027E4585D9404E", false);
        }

        if (contextApp.ExcludedRecipientListsActionControl) {
          contextApp.ExcludeRecipientsExistingListButton.viewModel.disable();
          contextApp.ExcludeRecipientsSelectFileButton.viewModel.disable();
          self.enableAction(contextApp.ExcludedRecipientListsActionControl, "55917BD5549F411B85A203C4B48382E5", false);
          self.enableAction(contextApp.ExcludedRecipientListsActionControl, "64BCCD55711F4FC288E7749EC98BD0CD", false);
          self.enableAction(contextApp.ExcludedRecipientListsActionControl, "5522F067CF40452AA1CEF98E8B0C21F6", false);
        }
      }

      if (!isBusy) {
        if (contextApp.MessageContext.get("messageType") === "Triggered") {
          contextApp.insertRendering("{BDC2AB0C-9FC6-41F4-B821-214A8F156A91}", { $el: $("body") }, function (subApp) {
            contextApp["addEmptyRecipientListDialog"] = subApp;
          });
        }
      }
    },

    toggleIncludedRecipientsControls: function () {
      self.toggleRecipientsActionControl(contextApp.IncludedRecipientDataSource.get("recipientListType"));
    },

    toggleExcludedRecipientsControls: function () {
      if (contextApp.ExcludedRecipientDataSource) {
        self.toggleRecipientsActionControl(contextApp.ExcludedRecipientDataSource.get("recipientListType"));
      }
    },

    addIncludeList: function () {
      self.addList(contextApp.IncludedRecipientDataSource.get("messageId"), contextApp.IncludedRecipientDataSource.get("recipientListType"),
        function (callback, allExcludeItemsIds) { selectLists.SelectList(callback, allExcludeItemsIds); });
    },

    addIncludeFile: function () {
      self.addList(contextApp.IncludedRecipientDataSource.get("messageId"), contextApp.IncludedRecipientDataSource.get("recipientListType"),
        function (callback) {
          // window usage should be removed after LM fix. LM have a misstake and uses global context (window) instead of application context
          if (window["showImportWizardDialog"] && window["showImportWizardDialog"].ImportWizardDialog)
            window["showImportWizardDialog"].ImportWizardDialog.set("backdrop", "static");
          if (importWizard["showImportWizardDialog"] && importWizard["showImportWizardDialog"].ImportWizardDialog)
            importWizard["showImportWizardDialog"].ImportWizardDialog.set("backdrop", "static");
          importWizard.ImportWizardToXDB("ImportContactsAndCreateList", callback);
        });
    },

    addExcludeFile: function () {
      self.addList(contextApp.ExcludedRecipientDataSource.get("messageId"), contextApp.ExcludedRecipientDataSource.get("recipientListType"),
        function (callback) {
          // window usage should be removed after LM fix. LM have a misstake and uses global context (window) instead of application context
          if (window["showImportWizardDialog"] && window["showImportWizardDialog"].ImportWizardDialog)
            window["showImportWizardDialog"].ImportWizardDialog.set("backdrop", "static");
          if (importWizard["showImportWizardDialog"] && importWizard["showImportWizardDialog"].ImportWizardDialog)
            importWizard["showImportWizardDialog"].ImportWizardDialog.set("backdrop", "static");
          importWizard.ImportWizardToXDB("ImportContactsAndCreateList", callback);
        });
    },

    addExcludeList: function () {
      if (contextApp.ExcludedRecipientDataSource) {
        self.addList(contextApp.ExcludedRecipientDataSource.get("messageId"), contextApp.ExcludedRecipientDataSource.get("recipientListType"),
          function (callback, allExcludeItemsIds) { selectLists.SelectList(callback, allExcludeItemsIds); });
      }
    },

    removeIncludedList: function () {
      self.removeList(contextApp.IncludedRecipientDataSource.get("messageId"), contextApp.IncludedRecipientDataSource.get("recipientListType"));
    },

    removeExcludedList: function () {
      self.removeList(contextApp.ExcludedRecipientDataSource.get("messageId"), contextApp.ExcludedRecipientDataSource.get("recipientListType"));
    },

    setDefaultIncludedList: function () {
      self.setDefaultList(contextApp.IncludedRecipientDataSource.get("messageId"), contextApp.IncludedRecipientDataSource.get("recipientListType"));
    },

    removeBouncedRecipientsFromIncluded: function () {
      var recipientList = null;
      var selectedItem = contextApp.IncludedRecipientListControl.get("selectedItem");

      if (contextApp.IncludedRecipientListControl.get("checkedItems").length == 1) {
        recipientList = contextApp.IncludedRecipientListControl.get("checkedItems")[0];
      } else if (selectedItem != "" && contextApp.IncludedRecipientListControl.get("checkedItems").length === 0) {
        recipientList = {
          itemId: selectedItem.get("itemId"),
          name: selectedItem.get("name"),
        };
      }

      if (recipientList != null) {
        sitecore.Pipelines.RemoveBouncedRecipients.execute({
          recipientList: recipientList,
          messageId: contextApp.IncludedRecipientDataSource.get("messageId"),
          messageBar: contextApp.MessageBar
        });
      }
    },

    removeUnsubscribedRecipientsFromIncluded: function () {
      var recipientLists = [];
      var selectedItem = contextApp.IncludedRecipientListControl.get("selectedItem");

      if (contextApp.IncludedRecipientListControl.get("checkedItems").length > 0) {
        recipientLists = contextApp.IncludedRecipientListControl.get("checkedItems");
      } else if (selectedItem != "" && contextApp.IncludedRecipientListControl.get("checkedItems").length === 0) {
        recipientLists[0] = {
          itemId: selectedItem.get("itemId"),
          name: selectedItem.get("name"),
        };
      }

      if (recipientLists.length > 0) {
        sitecore.Pipelines.RemoveUnsubscribedRecipients.execute({
          recipientLists: recipientLists,
          messageId: contextApp.IncludedRecipientDataSource.get("messageId"),
          messageBar: contextApp.MessageBar
        });
      }
    },

    removeComplainedRecipientsFromIncluded: function () {
      var recipientLists = [];
      var selectedItem = contextApp.IncludedRecipientListControl.get("selectedItem");

      if (contextApp.IncludedRecipientListControl.get("checkedItems").length > 0) {
        recipientLists = contextApp.IncludedRecipientListControl.get("checkedItems");
      } else if (selectedItem !== "" && contextApp.IncludedRecipientListControl.get("checkedItems").length === 0) {
        recipientLists[0] = {
          itemId: selectedItem.get("itemId"),
          name: selectedItem.get("name"),
        };
      }

      for (var i = 0; i < recipientLists.length > 0; i++) {
        sitecore.Pipelines.RemoveComplainedRecipients.execute({
          recipientList: recipientLists[i],
          messageId: contextApp.IncludedRecipientDataSource.get("messageId"),
          messageBar: contextApp.MessageBar
        });
      }
    },

    setDefaultExcludedList: function () {
      self.setDefaultList(contextApp.ExcludedRecipientDataSource.get("messageId"), contextApp.ExcludedRecipientDataSource.get("recipientListType"));
    },

    editIncludedList: function () {
      self.editList(contextApp.IncludedRecipientDataSource.get("recipientListType"));
    },

    editExcludedList: function () {
      self.editList(contextApp.ExcludedRecipientDataSource.get("recipientListType"));
    },

    addEmptyIncludedList: function () {
      sitecore.trigger("recipients:add:empty:list:dialog:show", self.addListToListControl, contextApp.IncludedRecipientDataSource.get("messageId"), contextApp.IncludedRecipientDataSource.get("recipientListType"));
    },
  };
});
