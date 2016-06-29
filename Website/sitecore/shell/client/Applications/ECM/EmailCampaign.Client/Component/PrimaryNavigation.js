define([
  "sitecore",
  "/-/speak/v1/listmanager/SelectLists.js",
  "/-/speak/v1/listmanager/storageMediator.js",
  "/-/speak/v1/listmanager/ImportWizard.js",
  "/-/speak/v1/ecm/DialogService.js",
  "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/deps/bootstrap/js/bootstrap.js"
], function (
  sitecore,
  selectLists,
  storageMediator,
  importWizard,
  DialogService
  ) {
  var contextApp, self;
  
  return {
    initializePrimaryNavigation: function(app) {
      contextApp = app;
      self = this;
      selectLists.init(contextApp);
      importWizard.init(contextApp);
      
      contextApp.on({
        'create:onetimemessage': function () {
          self.clickCreateButton();
          DialogService.show("createOneTimeMessage", { data: self.getMessageCreationContext(contextApp) });
        },
        'create:subscriptionmessage': function () {
          self.clickCreateButton();
          DialogService.show("createSubscriptionMessage", { data: self.getMessageCreationContext(contextApp) });
        },
        'create:triggeredmessage': function () {
          self.clickCreateButton();
          DialogService.show("createTriggeredMessage", { data: self.getMessageCreationContext(contextApp) });
        },
        'create:listemptylist': function () {
          self.clickCreateButton();
          DialogService.show("addEmptyList", { notify: false });
        },
        'create:listfromexistinglist': function () {
          self.clickCreateButton();
          DialogService.show("addFromExistingList", { notify: false });
        }
      });

      contextApp.on("create:listfromfile", function () {
        self.clickCreateButton();
        //Pass a dummy callback to importWizard.ImportWizardToXDB so that it will not redirect to list managment task page.
        importWizard.ImportWizardToXDB("ImportContactsAndCreateList", function(id) {
          sitecore.trigger("listManager:listCreated");
        });
      });

      self.primaryNavigation_addSegmentedList("create:segmentedlistfromexisting");
      self.primaryNavigation_addSegmentedList("create:segmentedlistfromall");

      self.primaryNavigation_addClickToBorder(app.CreateMessageBorder);
      self.primaryNavigation_addClickToBorder(app.CreateListBorder);
    },
    getMessageCreationContext: function(contextApp) {
      return {
        createMessageOptions: contextApp.CreateMessageDialogDataSource.get('createMessageOptions'),
        nameValidationExpression: contextApp.CreateMessageDialogDataSource.get('itemNameValidation')
      };
    },
    primaryNavigation_addClickToBorder: function(border) {
      border.viewModel.$el.find("> div").css('cursor', 'pointer').on("click", function () {
        $(this).find(".sc-hyperlinkbutton")[0].click();
        //self.clickCreateButton();
      });
    },

    primaryNavigation_addSegmentedList: function (eventName) {
      contextApp.on(eventName, function () {
        self.clickCreateButton();
        var pagePattern = "/sitecore/client/Applications/List Manager/Taskpages/Segmented list",
          actionQueryString = "action=fromexisting",
          href = "";

        if (eventName === "create:segmentedlistfromexisting") {
          sessionStorage.createMessageParameters = "";
          selectLists.SelectContactListForNewList(function(itemId, item) {
            if (typeof item !== "undefined" && item !== null) {
              var items = [];
              items.push(item);
              storageMediator.addToStorage("items", items);
              href = pagePattern + "?" + actionQueryString;
              window.open(href, "_blank");
            } else {
              href = pagePattern;
              window.open(href, "_blank");
            }
          }, []);
        } else if (eventName === "create:segmentedlistfromall") {
          sessionStorage.createMessageParameters = "Entire Database";
          href = pagePattern;
          window.open(href, "_blank");
        }

      });
    },

    //This is workaround to close the popover when user click a link on the popover.
    // ANB: 14-Nov-14: removed workaround, we call the popover "hide".
    clickCreateButton: function () {
      if (!contextApp.CreateButton) {
        return;
      }

      contextApp.CreateButton.viewModel.$el.popover("hide");
    }
  }
});