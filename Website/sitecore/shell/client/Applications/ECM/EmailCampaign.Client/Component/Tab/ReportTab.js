define(["sitecore", "/-/speak/v1/ecm/MessageState.js"]);

function initReportTab(sitecore, contextApp) {
  if (!sitecore || !contextApp) {
    return;
  }

  contextApp.on("action:reload", function () {
    ReloadDashboard();
  }, contextApp);

  contextApp.BestEmailLandingPagesListControl.on("change:selectedItem", function () {
    var selectedItem = contextApp.BestEmailLandingPagesListControl.get("selectedItem");
    if (selectedItem && selectedItem.get("url") !== "-") {
      contextApp.BestEmailLandingPagesSmartPanel.set("isOpen", true);

      var name = selectedItem.get("performanceIndicatorColumn");
      switch (name) {
        case "ValuePerVisit":
          contextApp.LandingPagesValuePerVisitAccordion.set("isVisible", true);
          contextApp.LandingPagesValuePerVisitListControl.set("items", selectedItem.get("emailLandingPages"));

          contextApp.LandingPagesValueAccordion.set("isVisible", false);
          contextApp.LandingPagesVisitsAccordion.set("isVisible", false);
          contextApp.LandingPagesAttentionAccordion.set("isVisible", false);
          contextApp.LandingPagesPotentialAccordion.set("isVisible", false);
          break;
        case "Value":
          contextApp.LandingPagesValueAccordion.set("isVisible", true);
          contextApp.LandingPagesValueListControl.set("items", selectedItem.get("emailLandingPages"));

          contextApp.LandingPagesValuePerVisitAccordion.set("isVisible", false);
          contextApp.LandingPagesVisitsAccordion.set("isVisible", false);
          contextApp.LandingPagesAttentionAccordion.set("isVisible", false);
          contextApp.LandingPagesPotentialAccordion.set("isVisible", false);
          break;
        case "Visits":
          contextApp.LandingPagesVisitsAccordion.set("isVisible", true);
          contextApp.LandingPagesVisitsListControl.set("items", selectedItem.get("emailLandingPages"));

          contextApp.LandingPagesValuePerVisitAccordion.set("isVisible", false);
          contextApp.LandingPagesValueAccordion.set("isVisible", false);
          contextApp.LandingPagesAttentionAccordion.set("isVisible", false);
          contextApp.LandingPagesPotentialAccordion.set("isVisible", false);
          break;
        case "Attention":
          contextApp.LandingPagesAttentionAccordion.set("isVisible", true);
          contextApp.LandingPagesAttentionListControl.set("items", selectedItem.get("emailLandingPages"));

          contextApp.LandingPagesValuePerVisitAccordion.set("isVisible", false);
          contextApp.LandingPagesValueAccordion.set("isVisible", false);
          contextApp.LandingPagesVisitsAccordion.set("isVisible", false);
          contextApp.LandingPagesPotentialAccordion.set("isVisible", false);
          break;
        case "Potential":
          contextApp.LandingPagesPotentialAccordion.set("isVisible", true);
          contextApp.LandingPagesPotentialListControl.set("items", selectedItem.get("emailLandingPages"));

          contextApp.LandingPagesValuePerVisitAccordion.set("isVisible", false);
          contextApp.LandingPagesValueAccordion.set("isVisible", false);
          contextApp.LandingPagesVisitsAccordion.set("isVisible", false);
          contextApp.LandingPagesAttentionAccordion.set("isVisible", false);
          break;
      }
    } else {
      contextApp.BestEmailLandingPagesSmartPanel.set("isOpen", false);
    }

  }, this);

  // export unsubscribed users
  contextApp.on("action:exportunsubscribers", function (event) {
    if (!contextApp.MessageContext) {
      return;
    }
    var token = new Date().getTime();

    sitecore.Pipelines.ExportToCSV.execute({ app: contextApp, currentContext: { token: token, dataSourceItemId: contextApp.UnsubscribersDataSource.get("messageReport"), messageId: contextApp.MessageContext.get("messageId"), language: contextApp.MessageContext.get("selectedReportLanguage") }, spinner: contextApp.UnsubscribersDataSource, action: event.sender.model.viewModel });
  });

  // export bounced users
  contextApp.on("action:exportbounces", function (event) {
    if (!contextApp.MessageContext) {
      return;
    }
    var token = new Date().getTime();

    sitecore.Pipelines.ExportToCSV.execute({ app: contextApp, currentContext: { token: token, dataSourceItemId: contextApp.EmailBouncesDetailsDataSource.get("messageReport"), messageId: contextApp.MessageContext.get("messageId"), language: contextApp.MessageContext.get("selectedReportLanguage") }, spinner: contextApp.EmailBouncesDetailsDataSource, action: event.sender.model.viewModel });
  });

  // open engagement monitor
  contextApp.on("action:openengagementplan", function() {
    sitecore.trigger("action:openengagementplan");
  });
  
  // export message performance per language
  contextApp.on("action:exportMessagePerformancePerLanguage", function (event) {
    if (!contextApp.MessageContext) {
      return;
    }
    var token = new Date().getTime();

    sitecore.Pipelines.ExportToCSV.execute({ app: contextApp, currentContext: { token: token, dataSourceItemId: contextApp.MessagePerformancePerLanguageDataSource.get("messageReport"), messageId: contextApp.MessageContext.get("messageId"), language: contextApp.MessageContext.get("selectedReportLanguage") }, spinner: contextApp.MessagePerformancePerLanguageDataSource, action: event.sender.model.viewModel });
  });

  // disable action
  contextApp.UnsubscribersListControl.on("change:items", function (e) {
    var id = "24DEE13785F24809BE04D8CB778DA94D";
    var action = _.find(contextApp.UnsubscribersActionControl.viewModel.actions(), function (x) { return x.id() == id; });
    if (action) {
      if (contextApp.MessageContext.get("messageState") == 0) {
        action.disable();
        return;
      }
      var length = contextApp.UnsubscribersListControl.get("items").length;
      if (length > 0) {
        action.enable();
      } else {
        action.disable();
      }
    }
  });

  // disable action
  contextApp.EmailBouncesDetailsListControl.on("change:items", function () {
    var id = "B890341876C54D569B00F8C67FD955C3";
    var action = _.find(contextApp.EmailBouncesDetailsActionControl.viewModel.actions(), function (x) { return x.id() == id; });
    if (action) {
      if (contextApp.MessageContext.get("messageState") == 0) {
        action.disable();
        return;
      }
      var length = contextApp.EmailBouncesDetailsListControl.get("items").length;
      if (length > 0) {
        action.enable();
      } else {
        action.disable();
      }
    }
  });

  // disable action
  contextApp.MessagePerformancePerLanguageListControl.on("change:items", function () {
    var id = "D23F1E1570BF41E08D3A39DEA8737525";
    var action = _.find(contextApp.MessagePerformancePerLanguageActionControl.viewModel.actions(), function (x) { return x.id() == id; });
    if (action) {
      if (contextApp.MessageContext.get("messageState") == 0) {
        action.disable();
        return;
      }
      var length = contextApp.MessagePerformancePerLanguageListControl.get("items").length;
      if (length > 0) {
        action.enable();
      } else {
        action.disable();
      }
    }
  });
}

function showMessagePerformanceDialog(contextApp) {
  if (!contextApp) {
    return;
  }

  if (contextApp["messagePerformanceDialog"] === undefined) {
    contextApp.insertRendering("{DCFDCF47-C3BD-48F8-9F71-77E752FF5D4D}", { $el: $("body") }, function (subApp) {
      contextApp["messagePerformanceDialog"] = subApp;
      showMessagePerformanceDialog();
    });
  } else {
    showMessagePerformanceDialog();
  }

  function showMessagePerformanceDialog() {
    if (!contextApp.messagePerformanceDialog || !contextApp.MessageContext || !contextApp.LanguageSwitcher) {
      return;
    }

    if (contextApp.messagePerformanceDialog.showDialog) {
      var url = contextApp.messagePerformanceDialog.Frame.get("sourceUrl");

      url = url.concat("?id=", contextApp.MessageContext.get("messageId"));
      if (0 !== contextApp.LanguageSwitcher.get("selectedReportLanguage")) {
        url.concat("&filterByLanguage=true&messageContentLanguage=", contextApp.LanguageSwitcher.get("selectedLanguage"));
      }

      contextApp.messagePerformanceDialog.Frame.set("sourceUrl", url);
      contextApp.messagePerformanceDialog.showDialog();
    }
  }
}
