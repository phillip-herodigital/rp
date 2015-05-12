(function () {
  // The trick to test in node and in browser.
  var dependencies = (typeof window !== "undefined")
    ? ["/-/speak/v1/listmanager/commonPagesDefinition.js",
       "/-/speak/v1/listmanager/guidGenerator.js",
       "/-/speak/v1/listmanager/urlParser.js",
       "/-/speak/v1/listmanager/storageMediator.js",
       "/-/speak/v1/listmanager/dialogs.js"]
    : ["../commonPagesDefinition", "../guidGenerator", "../urlParser", "../storageMediator", null];

  define(dependencies, function (commonPagesDefinition, guidGenerator, urlParser, storageMediator, dialogs) {
    var self,
      global = {},
      fakeLocation = {
        replace: function (path) {
        }
      },
      fakeDocument = {
        title: ""
      },

      setEntireDatabaseActionIds = ["EDE8F210CC444DC48AFDBC6CE5D5BAFC"],
      removeSourceIds = ["2870D2EA7E0040DA904FAB12ED7B03B6", "CDA1E30B5AE54D128B6B7021E9DDFB93"],
      removeAllContactsActionIds = ["715CC24E7AA846A2B5878C5D2AD9B400"],
      viewContactCardActionIds = ["A29930F63F5E4A5197F69A69882AE651", "8620AD7021BB43BC95F5BE7CAF182F64"],
      addSourceActionIds = ["598EDA5938F0485989DC37BC3E88D110", "00A55A2A1F0C4D0B9EE3A16383A8AC97"],
      addExclusionActionIds = ["12F78085A0B348ADB18126D175C4DDC3", "08DFF0549EFC4F67B0382267F491A708"],
      addNewConditionActionIds = ["85E89F67CC694CABA6F5C1BEAD335CD2"],
      deleteActionIds = ["FC47E28D97124B23A1B877E0D6A2B227", "5066350562384C7CB75A12118AB15F66", "225FAAB86B4C4DD38186642AFA32026C", "043A34CE15BF4FB7BAF6005E8BAC2803"],
      exportToCsvFileActionIds = ["59083A283E3545FBA2FA8D8E310B2C73", "B6FD42A5C59643AA96537C0669961405", "68FE4B4E7F1244D59D9E7CC3DF97D311", "C09D2914E7814B5C88A312FEF18B462F"],
      findDuplicatesActionIds = ["7EB1A29B64CF4509BFAFB191AD3500F1", "A16B6E7876CC4F85B7347B18406D49CD"],
      replaceAllListsWithEntireDatabaseSource = "This option will replace all lists that are currently selected as sources. Do you want to continue?",
      convertListNotification = "The list has been converted to a Contact list.",
      deleteAllContactsConfirmation = "All the contacts will be removed from this list. The contacts will still be available in your Contacts database. Do you want to continue?",
      deleteAllContactsNotification = "All the contacts associated with this list have been removed.",
      deleteListConfirmation = "The list will be deleted and all the associations to the list will be removed. This cannot be undone. Do you want to continue?",
      duplicatesRemovedNotification = "duplicate contacts have been removed from this list.",
      saveListNotification = "The list has been saved.",
      entireDatabaseKey = "Entire database",
      listIdKey = "listId",
      filterKey = "filter",
      pageIndexKey = "pageIndex",
      pageSizeKey = "pageSize",
      languageKey = "sc_lang",  
      defaultPageIndex = 0,
      defaultPageSize = 10,
      sourceEmptyText;

    if (typeof window !== "undefined") {
      global = window;
    } else {
      global.location = fakeLocation;
      global.document = fakeDocument;
    }

    var extensionObject = {
      listType: "Contact list",
      location: {},
      initialized: function () {
        self = this;
        this.dialogs = dialogs;
        this.location = global.location;
        this.document = global.document;
        this.GuidGenerator = guidGenerator;
        this.UrlParser = urlParser;
        this.StorageMediator = storageMediator;
        this.RootPath = "";
        this.initializeDataSources();
        this.initializeActions();
        this.initializeShowMore();
        this.initializeSpecificControls();
        this.SaveButton.on("click", this.saveList, this);
        this.ContactsSearchButtonTextBox.viewModel.$el.keyup(this.contactSearchTextBoxKeyUp);
        this.ListOwnerDataSource.on("change:hasResponse", this.initializeList, this);
        this.ListAsimovEntityDataSource.on("change:entity", this.updateUiForList, this);
        this.initializeChangeTracking();
        this.performUrlAction();
        sourceEmptyText = this.IncludedSourcesListControl.get("empty");
        this.initializeAdditionalFields();
        this.dialogs.init(this.DialogsLoadOnDemandPanel);
      },
      initializeDataSources: function () {
        this.refreshDeferredDataSource(this.ListAsimovEntityDataSource);
        this.refreshDeferredDataSource(this.ContactsAsimovEntityDataSource);
        this.ListOwnerDataSource.refresh();
      },
      refreshDeferredDataSource: function (dataSource) {
        dataSource.IsDeferred = true;
        dataSource.refresh();
        dataSource.IsDeferred = false;
      },
      initializeSpecificControls: function () {
        this.baseStructures = [
            {
              control: this.ContactsList,
              dataSource: this.ContactsAsimovEntityDataSource,
              concatItems: false,
              showMoreButton: this.ContactsShowMoreButton,
              accordion: this.ContactsAccordion
            }
        ];
        this.ContactsList.on("change:selectedItemId", this.updateContactActionsStatus);
        this.ExcludedSourcesListControl.on("change:selectedItem", function () { this.selectSourceItem(this.ExcludedSourcesListControl); }, this);
        this.IncludedSourcesListControl.on("change:selectedItem", function () { this.selectSourceItem(this.IncludedSourcesListControl); }, this);

        this.initializeDestinationControl();
      },
      initializeDestinationControl: function() {
        var buttonTextBox = this.GeneralInformationDestinationTextBox.viewModel.$el;
        this.StartItem = buttonTextBox.attr("Value");
        var inputs = buttonTextBox.find("input");
        Array.prototype.forEach.call(inputs, function(i) { i.disabled = true; });
      },
      initializeActions: function () {
        $.each(this.ListSourceActionControl.get("actions"), function () {
          if (removeSourceIds.indexOf(this.id()) > -1) {
            this.disable();
          }
        });
        this.on("view:contact", this.onViewContact, this);
        this.on("remove:contacts", this.onRemoveAllContacts, this);
        this.on("taskpage:add:source", this.addSource, this);
        this.on("taskpage:remove:source", this.removeSource, this);
        this.on("taskpage:add:exclusion", this.addExclusion, this);
        this.on("taskpage.select:folder", this.selectFolder, this);
        this.on("taskpage:remove:duplicates", this.onRemoveDuplicates, this);
        this.on("taskpage:set:entireDatabase", this.setEntireDatabase, this);
        this.on("taskpage:export:csv", this.onExportToCsv, this);
        this.initializeListActions();
      },
      performUrlAction: function () {
        var actionFromUrl = this.UrlParser.getParameterFromLocationSearchByName("action");
        if (actionFromUrl === "convert") {
          this.showNotification(convertListNotification, this.ContactListMessageBar);
        } else if (actionFromUrl === "fromexisting") {
          var items = this.StorageMediator.getFromStorage("items");
          if (items !== null) {
            this.IncludedSourcesListControl.set("items", items);
          }
          this.StorageMediator.removeFromStorage("items");
        }
      },
      initializeListActions: function () {
        this.on("taskpage:delete:list", this.onDeleteList, this);
        this.initializeSpecificListActions();
        var entityId = this.UrlParser.getParameterFromLocationSearchByName("id");
        if (entityId === "") {
          this.ListActions.set("isVisible", false);
        }
      },
      initializeSpecificListActions: function () {
      },
      setActionEnabledStatus: function (list, actionIds, value) {
        Array.prototype.forEach.call(list.get("actions"), function (el) {
          if (actionIds.indexOf(el.id()) >= 0) {
            if (value) {
              el.enable();
            } else {
              el.disable();
            }
          }
        });
      },
      initializeShowMore: function () {
        this.on("show:more", this.onShowMore, this);
      },
      onShowMore: function (parameters) {
        this.showMoreCalled(parameters, this.reloadEmbededList);
      },
      initializeList: function () {
        this.updateOwner();
        var entityId = this.UrlParser.getParameterFromLocationSearchByName("id");
        if (entityId === "") {
          this.updateContactActionsStatus();
          this.GeneralInformationNameValue.viewModel.focus();
        } else {
          this.ListAsimovEntityDataSource.set("entityID", entityId);

          var actionFromUrl = this.UrlParser.getParameterFromLocationSearchByName("action");
          if (actionFromUrl === "convert") {
            this.showNotification(this.StringDictionary.get(convertListNotification), this.ContactListMessageBar);
          }
        }
      },
      initializeContacts: function (entityId) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        var baseStructure = Array.prototype.filter.call(current.baseStructures, function (e) {
          return e.dataSource === current.ContactsAsimovEntityDataSource;
        })[0];

        baseStructure.dataSource.attributes.entityID = entityId;
        baseStructure.dataSource.query.options.single = false;
        baseStructure.dataSource.query.__parameters[listIdKey] = entityId;
        baseStructure.dataSource.query.__parameters[filterKey] = "";
        baseStructure.dataSource.query.__parameters[pageIndexKey] = defaultPageIndex;
        baseStructure.dataSource.query.__parameters[pageSizeKey] = defaultPageSize;
        baseStructure.dataSource.query.__parameters[languageKey] = current.getLanguage();
        var pageSize = baseStructure.control.get("height");
        if (!isNaN(pageSize)) {
          if (pageSize > 0) {
            baseStructure.dataSource.query.__parameters[pageSizeKey] = pageSize;
          }
        }

        current.reloadEmbededList(baseStructure, current, current.updateContactActionsStatus);
      },
      executeAction: function (parameters, methodName, callback, isConfirm, confirmationText, showProgress, errorMessage) {
        var listId = this.ListAsimovEntityDataSource.get("entityID");
        if (listId !== "") {
          if (isConfirm === true) {
            if (!confirm(this.StringDictionary.get(confirmationText))) {
              return;
            }
          }

          if (showProgress === true) {
            this.showContactsProgressBar();
          }

          this.callController(parameters, "/" + methodName + "/" + listId, callback, function (status, statusText) { self.showDefaultError(status, statusText, self.StringDictionary.get(errorMessage), self.ContactListMessageBar); });
        }
      },
      reloadEmbededList: function (baseStructure, current, callback) {
        var promise = baseStructure.dataSource.query.execute();
        promise.then(
          function (items) {
            current.updateEmbededList(items, baseStructure);

            if ((typeof callback != "undefined") && (callback != null)) {
              callback();
            }
          },
          this.reloadEmbededListError
        );
        current.showContactsProgressBar();
      },
      reloadEmbededListError: function (error) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        current.hideContactsProgressBar();
      },
      updateEmbededList: function (items, baseStructure) {
        if (baseStructure.concatItems === true) {
          var currentItems = baseStructure.control.get("items");
          items = Array.prototype.concat.call(currentItems, items);
        }
        baseStructure.control.set("items", items);
        if (items.length == 0) {
          this.setHeader(baseStructure, 0);
        }
        if (items.length > 0) {
          this.setHeader(baseStructure, items[0].Count);
          if (items[0].Count > items.length) {
            baseStructure.showMoreButton.set("isEnabled", true);
          } else {
            baseStructure.showMoreButton.set("isEnabled", false);
          }
        } else {
          baseStructure.showMoreButton.set("isEnabled", false);
        }
        this.hideContactsProgressBar();
      },
      showContactsProgressBar: function () {
        this.ContactsProgressIndicator.set("isBusy", true);
      },
      hideContactsProgressBar: function () {
        this.ContactsProgressIndicator.set("isBusy", false);
      },
      setHeader: function (baseStructure, count) {
        var header = baseStructure.accordion.get("origHeader");
        if (typeof header === "undefined") {
          header = baseStructure.accordion.get("header");
          baseStructure.accordion.set("origHeader", header);
        }
        baseStructure.accordion.set("header", header + " " + count);
      },
      onViewContact: function () {
        var contactId = this.ContactsList.get("selectedItemId");
        if (contactId == "") {
          return;
        }

        var url = "/sitecore/client/Applications/ExperienceProfile/contact?cid={" + contactId + "}";
        this.showContactCard(url);
      },
      onDeleteList: function (parameters, isConfirm) {
        this.executeAction(parameters, "DeleteListById", this.onDeleteListFinished, this.getIsConfirm(isConfirm), deleteListConfirmation, false, "The list was not removed.");
      },
      onDeleteListFinished: function () {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        current.location.href = current.Breadcrumb.get("prevPage");
      },
      onRemoveAllContacts: function (parameters, isConfirm) {
        this.executeAction(parameters, "RemoveAllContactAssociationsAndSources", this.onRemoveAllContactsFinished, this.getIsConfirm(isConfirm), deleteAllContactsConfirmation, true, "The contacts was not removed.");
      },
      onRemoveAllContactsFinished: function () {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        current.showNotification(current.StringDictionary.get(deleteAllContactsNotification), current.ContactListMessageBar);
        current.ContactsList.set('items', []);
        current.IncludedSourcesListControl.set('items', []);
        current.ExcludedSourcesListControl.set('items', []);
        current.setHeader(current.baseStructures[0], 0);
        current.updateContactActionsStatus();
        current.hideContactsProgressBar();
      },
      onRemoveDuplicates: function (parameters) {
        this.executeAction(parameters, "RemoveDuplicates", this.onRemoveDuplicatesFinished, false, "", true, "The duplicate contacts were not removed because an error occurred. Please contact your System Administrator.");
      },
      onRemoveDuplicatesFinished: function (data) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        var message = current.StringDictionary.get(duplicatesRemovedNotification);
        current.reloadEmbededList(current.baseStructures[0], current, current.updateContactActionsStatus);
        current.showNotification(data + " " + message, current.ContactListMessageBar);
        current.hideContactsProgressBar();
      },
      onExportToCsv: function (parameters) {
        var entityId = this.UrlParser.getParameterFromLocationSearchByName("id");
        var targetDataSource = this[parameters.actionsDataSource];
        var actionUrl = targetDataSource.get("url") + "/ExportContacts/" + entityId;

        this.downloadFile(actionUrl, this.onExportToCsvError);
      },
      onExportToCsvError: function (message) {
        self.showError(message, self.ContactListMessageBar);
      },
      showContactCard: function (url) {
        window.open(url, '_blank');
      },
      refreshListControl: function(listControl) {
        listControl.set("items", [{}]);
        listControl.set("items", []);
      },
      updateUiForList: function (dataSource, model) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);

        this.setTitle(model.Name);
        this.GeneralInformationNameValue.set("text", model.Name);
        this.GeneralInformationDescriptionValue.set("text", model.Description);
        this.InfoSpotTypeText.set("text", model.TypeName);
        this.InfoSpotCreatedText.set("text", current.parseIsoDate(model.Created).toLocaleDateString());
        if (commonPagesDefinition.defaultIfValueIsUndefinedOrNull(model.Owner, "") !== "") {
          var items = this.GeneralInformationOwnerComboBox.get("items");
          var itemsToSelect = Array.prototype.filter.call(items, function (i) { return i.itemId == model.Owner; });
          if (itemsToSelect.length > 0) {
            this.GeneralInformationOwnerComboBox.set("selectedItems", itemsToSelect);
          }
        }
        this.setDestination(model.Destination);
        this.updateUiForAdditionalFields(model);
        var sourceIsLocked = this.updateUiForSources(model);

        if (model.IsLocked || model.IsInUse) {
          current.setActionEnabledStatus(current.ListActions, deleteActionIds, false);
          current.setActionEnabledStatus(current.ListActions, findDuplicatesActionIds, false);
          if (current.SegmentationActionControl !== undefined) {
            current.setActionEnabledStatus(current.SegmentationActionControl, addNewConditionActionIds, false);
          }
          if (model.IsLocked) {
            current.setActionEnabledStatus(current.ListActions, exportToCsvFileActionIds, false);
            current.ContactsShowMoreButton.set("isEnabled", false);
            current.showWarning(current.StringDictionary.get("Please note that this list is currently being built and is locked."), current.ContactListMessageBar);
            if (model.Notification) {
              current.showWarning(model.Notification, current.ContactListMessageBar, 0, true);
              current.ContactListMessageBar.set("expanded", true);
            }
          } else if (model.IsInUse) {
            current.showWarning(current.StringDictionary.get("Please note that this list is currently in use."), current.ContactListMessageBar);
          }
        }
        
        if (model.IsLocked || sourceIsLocked) {
          current.ContactsList.set("empty", current.StringDictionary.get("Currently building list. Contacts will be viewable when complete."));
          // Fantastic ListControl refresher!!!
          current.refreshListControl(current.ContactsList);
        }
        
        if (!model.IsLocked && !sourceIsLocked) {
          current.initializeContacts(model.Id);
        }

        this.SaveButton.set("isEnabled", false);
      },
      updateContactActionsStatus: function () {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);

        if (current.ListAsimovEntityDataSource.get("entity").IsLocked || current.ListAsimovEntityDataSource.get("entity").IsInUse) {
          current.setActionEnabledStatus(current.ContactsActionControl, removeAllContactsActionIds, false);
        } else {
          current.setActionEnabledStatus(current.ContactsActionControl, removeAllContactsActionIds, (current.ContactsList.get("items").length > 0) && (current.PredefinedText === ""));
        }
        current.setActionEnabledStatus(current.ContactsActionControl, viewContactCardActionIds, (current.ContactsList.get("items").length > 0) && (commonPagesDefinition.defaultIfValueIsUndefinedOrNull(current.ContactsList.get("selectedItemId"), "") !== ""));
      },
      updateUiForSources: function (model) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);

        var source = JSON.parse(model.Source);

        current.PredefinedText = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(source.PredefinedText, "");
        current.entireDatabase = source.AllDatabase == true;

        if (current.PredefinedText !== "") {
          current.PredefinedSourceLabel.set("text", source.PredefinedText);
          current.IncludedSourcesListControl.set("isVisible", false);
          current.ExcludedSourcesListControl.set("isVisible", false);
          current.ListSourceActionControl.set("isVisible", false);
        }

        current.updateContactActionsStatus();

        if (current.entireDatabase) {
          current.IncludedSourcesListControl.set("empty", this.StringDictionary.get(entireDatabaseKey));
          // Fantastic ListControl refresher!!!
          current.refreshListControl(current.IncludedSourcesListControl);
          current.setActionEnabledStatus(current.ListSourceActionControl, setEntireDatabaseActionIds, false);
        } else {
          current.IncludedSourcesListControl.set("empty", sourceEmptyText);
          // Fantastic ListControl refresher!!!
          current.refreshListControl(current.IncludedSourcesListControl);
          current.IncludedSourcesListControl.set("items", source.IncludedLists);
          current.setActionEnabledStatus(current.ListSourceActionControl, setEntireDatabaseActionIds, true);
        }

        current.ExcludedSourcesListControl.set("items", source.ExcludedLists);

        if (source.ExcludedLists.length > 0) {
          current.ExcludeSourceAccordion.set("isVisible", true);
        }

        if (model.IsLocked || model.IsInUse){
          current.setActionEnabledStatus(current.ListSourceActionControl, addExclusionActionIds, false);
          current.setActionEnabledStatus(current.ListSourceActionControl, addSourceActionIds, false);
          current.setActionEnabledStatus(current.ListSourceActionControl, removeSourceIds, false);
          current.setActionEnabledStatus(current.ListSourceActionControl, setEntireDatabaseActionIds, false);
        }

        return current.hasAdditionalLockCondition(source);
      },
      hasAdditionalLockCondition: function(source) {
        return false;
      },
      getDestination: function () {
        var path = this.GeneralInformationDestinationTextBox.get("text");
        return this.RootPath + path;
      },
      setDestination: function (path) {
        if (typeof path !== "undefined" && path !== null && path !== "") {
          var index = path.indexOf(this.StartItem),
              pathToSet = path;
          if (index >= 0) {
            this.RootPath = path.substring(0, index);
            pathToSet = path.substring(index);
          }
          this.GeneralInformationDestinationTextBox.set("text", pathToSet);
        }
      },
      initializeAdditionalFields: function () {
      },
      updateUiForAdditionalFields: function (model) {
      },
      initializeChangeTracking: function () {
        this.GeneralInformationNameValue.viewModel.$el.keyup(function () { self.updateSaveButtonUi(self.updateSaveButtonUi, self.GeneralInformationNameValue.viewModel.$el.val(), "Name"); });
        this.GeneralInformationDescriptionValue.viewModel.$el.keyup(function () { self.updateSaveButtonUi(self.GeneralInformationDescriptionValue, self.GeneralInformationDescriptionValue.viewModel.$el.val(), "Description"); });
        this.GeneralInformationOwnerComboBox.on("change:selectedItemId", function (control, value) { this.updateSaveButtonUi(control, value, "Owner"); }, this);
        this.GeneralInformationDestinationTextBox.on("change:text", function (control, value) { this.updateSaveButtonUi(control, this.RootPath + value, "Destination"); }, this);
      },
      setTitle: function (title) {
        this.document.title = title;
        this.HeaderTitle.set("text", title);
      },
      updateSaveButtonUi: function (control, value, property) {
        var model = this.ListAsimovEntityDataSource.get("entity"),
            enabled = true;
        if (model !== null) {
          if (property === "Source") {
            this.refreshRequired = true;
          }
          if (property === "Query") {
            this.refreshRequired = true;
          } else {
            enabled = model[property] !== value ||
              this.GeneralInformationNameValue.viewModel.$el.val() !== model["Name"] ||
              this.GeneralInformationDescriptionValue.viewModel.$el.val() !== model["Description"] ||
              this.GeneralInformationOwnerComboBox.get("selectedItemId") !== model["Owner"] ||
              this.RootPath + this.GeneralInformationDestinationTextBox.get("text") !== model["Destination"] ||
              this.refreshRequired;
          }
        }
        enabled = enabled && this.GeneralInformationNameValue.viewModel.$el.val().trim().length > 0;
        this.SaveButton.set("isEnabled", enabled);
      },
      updateOwner: function () {
        if (this.ListOwnerDataSource.get("hasResponse") === true) {
          var response = this.ListOwnerDataSource.get("response");
          var data = JSON.parse(response);
          var items = Array.prototype.map.call(data, function (i) { return { "$displayName": i, "itemId": i }; });
          this.GeneralInformationOwnerComboBox.set("items", items);
          if (items.length > 0) {
            this.GeneralInformationOwnerComboBox.set("selectedItems", Array.prototype.slice.call(items, 0, 1));
          }
        }
      },
      contactSearchTextBoxKeyUp: function (e) {
        if (e.keyCode == 13) {
          // For unit-testing purpose
          var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
          current.findContacts();
        }
      },
      findContacts: function () {
        // For unit-testing purpose
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        var baseStructure = Array.prototype.filter.call(current.baseStructures, function (e) {
          return e.dataSource === current.ContactsAsimovEntityDataSource;
        })[0];
        var searchText = current.ContactsSearchButtonTextBox.get("text");
        baseStructure.dataSource.query.__parameters[filterKey] = searchText;
        baseStructure.dataSource.query.__parameters[pageIndexKey] = defaultPageIndex;
        //baseStructure.showMoreButton.set("isEnabled", true);
        baseStructure.concatItems = false;
        current.reloadEmbededList(baseStructure, current, current.updateContactActionsStatus);
      },
      saveList: function () {
        this.SaveButton.set("isEnabled", false);

        var listName = this.GeneralInformationNameValue.get("text");
        if (listName !== "") {
          var model,
              id,
              owner = this.GeneralInformationOwnerComboBox.get("selectedItemId"),
              description = this.GeneralInformationDescriptionValue.get("text"),
              destination = this.getDestination(),
              entityId = this.ListAsimovEntityDataSource.get("entityID");
          if (entityId === "") {
            id = this.GuidGenerator.getGuid();
            model = { Id: id };
          } else {
            model = this.ListAsimovEntityDataSource.get("entity");
          }

          model.Name = listName;
          model.Owner = owner;
          model.Description = description;
          model.Destination = destination;
          model = this.saveListType(model);
          model = this.saveAdditionalFields(model);
          model.Source = this.getContactListSource();

          if (entityId === "") {
            var query = this.ListAsimovEntityDataSource.Service.create(model);
            var promise = query.execute();
            promise.then(this.updateEntityAndNotify, this.notifyAboutError);
          } else {
            model.save().then(this.notify, this.notifyAboutError);
          }
        } else {
          this.GeneralInformationNameValue.viewModel.focus();
          this.showError(this.StringDictionary.get("The 'List name' field should be specified."), this.ContactListMessageBar);
        }
      },
      saveListType: function (model) {
        model.Type = this.listType;
        return model;
      },
      saveAdditionalFields: function (model) {
        return model;
      },
      notify: function (model) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        current.SaveButton.set("isEnabled", false);
        current.showNotification(current.StringDictionary.get(saveListNotification), current.ContactListMessageBar);
        if (current.refreshRequired === true) {
          current.initializeContacts(model.Id);
          current.refreshRequired = false;
        }
        current.updateUiForSources(model);
        current.setTitle(model.Name);
      },
      updateEntityAndNotify: function (model) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        current.ListAsimovEntityDataSource.set("entityID", model.Id);
        current.showNotification(current.StringDictionary.get(saveListNotification), current.ContactListMessageBar);
        current.ListActions.set("isVisible", true);
        current.initializeContacts(model.Id);

        current.UrlParser.appendQueryParameter("id", model.Id);
        current.setTitle(model.Name);
      },
      notifyAboutError: function (error) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        var message;
        try {
          message = JSON.parse(error.message).Message;
        } catch (e) {
          message = error.message;
        }
        current.showError(message, current.ContactListMessageBar);
      },
      getContactListSource: function () {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);

        var includedLists = current.IncludedSourcesListControl.get("items");
        var excludedLists = current.ExcludedSourcesListControl.get("items");

        return JSON.stringify({ AllDatabase: current.entireDatabase, IncludedLists: includedLists, ExcludedLists: excludedLists, PredefinedText: current.PredefinedText });
      },
      selectSourceItem: function (control) {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        current.toggleRemoveAction();
        current.IncludedSourcesListControl.off("change:selectedItem");
        current.ExcludedSourcesListControl.off("change:selectedItem");
        if (control === current.ExcludedSourcesListControl) {
          current.resetSourceControl(current.IncludedSourcesListControl);
        } else {
          current.resetSourceControl(current.ExcludedSourcesListControl);
        }
        current.IncludedSourcesListControl.on("change:selectedItem", function () { current.selectSourceItem(current.IncludedSourcesListControl); }, current);
        current.ExcludedSourcesListControl.on("change:selectedItem", function () { current.selectSourceItem(current.ExcludedSourcesListControl); }, current);
      },
      resetSourceControl: function (sourceControl) {
        if (sourceControl.get("selectedItem") != "") {
          sourceControl.set("selectedItem", null);
          sourceControl.set("selectedItemId", null);
          sourceControl.set("defaultSelectedItemId", null);
        }
      },
      addSource: function () {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        var callback = function (itemId, item) {
          if (typeof item != "undefined" && item != null) {
            var currentItems = current.IncludedSourcesListControl.get("items");
            var newItems = [];
            newItems.push(item);
            var items;
            if (currentItems.length > 0) {
              items = Array.prototype.concat.call(currentItems, newItems);
            } else {
              items = newItems;
            }

            current.IncludedSourcesListControl.set("items", items);

            current.entireDatabase = false;

            current.updateSaveButtonUi(current.IncludedSourcesListControl, current.getContactListSource(), "Source");
          }
        };

        var includeItems = current.IncludedSourcesListControl.get("items");
        var excludeItem = current.ExcludedSourcesListControl.get("items");

        var allExcludeItems = Array.prototype.concat.call(includeItems, excludeItem);

        var allExcludeItemsIds = [];
        for (var i = 0; i < allExcludeItems.length; i++) {
          allExcludeItemsIds.push(allExcludeItems[i].Id);
        }

        var listId = this.UrlParser.getParameterFromLocationSearchByName("id");

        if (listId !== "") {
          listId = this.ListAsimovEntityDataSource.get("entity").Id;
        }

        var dialogParams = {
          callback: callback,
          excludelists: allExcludeItemsIds,
          currentListId: listId,
          filter: "getContactLists"
        };

        current.dialogs.showDialog(current.dialogs.Ids.SelectListDialog, dialogParams);
      },
      selectFolder: function () {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        var callback = function (itemId, item) {
          if (typeof item !== "undefined" && item !== null) {
            current.setDestination(item.$path);
          }
        };
        // TODO : We Need to be able to parse over the Id of the current Destination folder
        var selectedItemPath = "";
        var dialogParams = {
          callback: callback,
          rootId: current.RootPath,
          selectedItemId: selectedItemPath,
        };
        current.dialogs.showDialog(current.dialogs.Ids.SelectFolderDialog, dialogParams);
      },
      addExclusion: function () {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        var callback = function (itemId, item) {
          if (typeof item != "undefined" && item != null) {
            var currentItems = current.ExcludedSourcesListControl.get("items");
            var newItems = [];
            newItems.push(item);
            var items;
            if (currentItems.length > 0) {
              items = Array.prototype.concat.call(currentItems, newItems);
            } else {
              items = newItems;
            }
            if (items.length > 0) {
              current.ExcludeSourceAccordion.set("isVisible", true);
            }

            current.ExcludedSourcesListControl.set("items", items);
            current.updateSaveButtonUi(current.ExcludedSourcesListControl, current.getContactListSource(), "Source");
          }
        };

        var includeItems = current.IncludedSourcesListControl.get("items");
        var excludeItem = current.ExcludedSourcesListControl.get("items");

        var allExcludeItems = Array.prototype.concat.call(includeItems, excludeItem);

        var allExcludeItemsIds = [];
        for (var i = 0; i < allExcludeItems.length; i++) {
          allExcludeItemsIds.push(allExcludeItems[i].Id);
        }

        var listId = this.UrlParser.getParameterFromLocationSearchByName("id");

        if (listId !== "") {
          listId = this.ListAsimovEntityDataSource.get("entity").Id;
        }

        var dialogParams = {
          callback: callback,
          excludelists: allExcludeItemsIds,
          currentListId: listId,
          filter: "getContactLists"
        };

        current.dialogs.showDialog(current.dialogs.Ids.SelectListDialog, dialogParams);
      },
      setEntireDatabase: function () {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);

        if (current.IncludedSourcesListControl.get("items").length > 0) {
          if (!confirm(this.StringDictionary.get(replaceAllListsWithEntireDatabaseSource))) {
            return;
          }
        }

        current.entireDatabase = true;
        current.IncludedSourcesListControl.set("items", []);
        current.updateUiForSources({ Source: current.getContactListSource() });
        current.updateSaveButtonUi(current.IncludedSourcesListControl, current.getContactListSource(), "Source");
      },
      toggleRemoveAction: function () {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        if (!current.ListAsimovEntityDataSource.get("entity").IsLocked && !current.ListAsimovEntityDataSource.get("entity").IsInUse) {
          if (current.IncludedSourcesListControl.get("selectedItem") != "" || current.ExcludedSourcesListControl.get("selectedItem") != "") {
            $.each(this.ListSourceActionControl.get("actions"), function() {
              if (removeSourceIds.indexOf(this.id()) > -1) {
                this.enable();
              }
            });
          } else {
            $.each(this.ListSourceActionControl.get("actions"), function() {
              if (removeSourceIds.indexOf(this.id()) > -1) {
                this.disable();
              }
            });
          }
        }
      },
      removeSource: function () {
        var current = commonPagesDefinition.defaultIfValueIsUndefinedOrNull(self, this);
        current.removeSourceFromControl(current.IncludedSourcesListControl, current);
        var newExcludedItems = current.removeSourceFromControl(current.ExcludedSourcesListControl, current);
        if (newExcludedItems.length == 0) {
          current.ExcludeSourceAccordion.set("isVisible", false);
        }

        current.updateSaveButtonUi(current.IncludedSourcesListControl, current.getContactListSource(), "Source");
        current.updateUiForSources({ Source: current.getContactListSource() });
      },
      removeSourceFromControl: function (sourceControl, current) {
        var oldItems;
        var newItems = [];
        var index;

        if (sourceControl.get("selectedItemId") !== "") {
          oldItems = sourceControl.get("items");

          for (index = 0; index < oldItems.length; ++index) {
            if (oldItems[index].Id != sourceControl.get("selectedItemId")) {
              newItems.push(oldItems[index]);
            }
          }
          sourceControl.off("change:selectedItem");
          sourceControl.set("selectedItem", null);
          sourceControl.set("selectedItemId", null);
          sourceControl.set("defaultSelectedItemId", null);
          sourceControl.set("items", newItems);
          sourceControl.on("change:selectedItem", function () { current.selectSourceItem(sourceControl); }, current);
          current.toggleRemoveAction();
        }

        return newItems;
      }
    };
    return commonPagesDefinition.mergeListPages(commonPagesDefinition, extensionObject);
  });
})();