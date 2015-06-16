var dependencies = ["sitecore", "/-/speak/v1/listmanager/SelectLists.js", "/-/speak/v1/listmanager/storageMediator.js", "/-/speak/v1/listmanager/ImportWizard.js"];

define(dependencies, function (sitecore, selectLists, storageMediator, importWizard) {
  var contextApp, self;
  
  return {
    initializePrimaryNavigation: function(app) {
      contextApp = app;
      self = this;
      selectLists.init(contextApp);
      importWizard.init(contextApp);

      self.primaryNavigation_addDialog("create:onetimemessage", "showOneTimeMessageDialog", "{C70377E9-BC2A-4685-8766-C845A941B7F9}", "one:time:message:dialog:show");
      self.primaryNavigation_addDialog("create:subscriptionmessage", "showSubscriptionMessageDialog", "{2732E19C-8644-48F4-98F1-389FE3F2A968}", "subscription:message:dialog:show");
      self.primaryNavigation_addDialog("create:triggeredmessage", "showTriggeredMessageDialog", "{42B80D20-5148-4291-BA75-ACA39A99592D}", "triggered:message:dialog:show");

      contextApp.on("create:listfromfile", function () {
        self.clickCreateButton();
        //Pass a dummy callback to importWizard.ImportWizardToXDB so that it will not redirect to list managment task page.
        importWizard.ImportWizardToXDB("ImportContactsAndCreateList", function(id) {
          console.log(id);
          sitecore.trigger("listManager:listCreated");
        });
      });

      self.primaryNavigation_addListDialog("create:listemptylist", "addEmptyList", "{BDC2AB0C-9FC6-41F4-B821-214A8F156A91}", "recipients:add:empty:list:dialog:show");
      self.primaryNavigation_addListDialog("create:listfromexistinglist", "addFromExistingList", "{BCBFAB6D-15A7-4509-9D55-E570B301355E}", "recipients:add:list:from:existinglist:dialog:show");

      self.primaryNavigation_addSegmentedList("create:segmentedlistfromexisting");
      self.primaryNavigation_addSegmentedList("create:segmentedlistfromall");

      self.primaryNavigation_addClickToBorder(app.CreateMessageBorder);
      self.primaryNavigation_addClickToBorder(app.CreateListBorder);
    },

    primaryNavigation_addClickToBorder: function(border) {
      border.viewModel.$el.find("> div").css('cursor', 'pointer').on("click", function () {
        $(this).find(".sc-hyperlinkbutton")[0].click();
        //self.clickCreateButton();
      });
    },

    primaryNavigation_addDialog: function (eventName, dialogName, renderingId, triggerName) {
      contextApp.on(eventName, function () {
        self.clickCreateButton();
        if (contextApp[dialogName] === undefined) {
          contextApp.insertRendering(renderingId, { $el: $("body") }, function(dialog) {
            contextApp[dialogName] = dialog;
            sitecore.trigger(triggerName, { createMessageOptions: contextApp.CreateMessageDialogDataSource });
          });
        } else {
          sitecore.trigger(triggerName, { createMessageOptions: contextApp.CreateMessageDialogDataSource });
        }

      }, contextApp);
    },

    primaryNavigation_addListDialog: function (eventName, dialogName, renderingId, triggerName) {
      contextApp.on(eventName, function () {
        self.clickCreateButton();
        if (contextApp[dialogName] === undefined) {
          contextApp.insertRendering(renderingId, { $el: $("body") }, function(dialog) {
            contextApp[dialogName] = dialog;
            sitecore.trigger(triggerName);
          });
        } else {
          sitecore.trigger(triggerName);
        }
      }, contextApp);
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