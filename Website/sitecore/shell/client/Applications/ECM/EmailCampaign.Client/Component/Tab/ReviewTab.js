define(["sitecore", "/-/speak/v1/ecm/ReportUpdateWatcher.js"]);

function initReviewTab(sitecore, contextApp, messageContext, messageBar) {
  if (!sitecore || !contextApp || !messageContext || !messageBar) {
    return;
  }

  contextApp.ReportUpdateWatcher.on("addMessage", function (args) {
    // we need to be able to show notifications from the watcher
    messageBar.addMessage(args.type, args.message);
  });

  contextApp.EmailPreviewClientsDropDown.viewModel.$el.on("click", function () {
    if (contextApp.EmailPreviewReportsDropDown.viewModel.isOpen()) {
      contextApp.EmailPreviewReportsDropDown.viewModel.close();
    }
  });

  contextApp.EmailPreviewReportsDropDown.viewModel.$el.on("click", function () {
    if (contextApp.EmailPreviewClientsDropDown.viewModel.isOpen()) {
      contextApp.EmailPreviewClientsDropDown.viewModel.close();
    }
  });

  contextApp.EmailPreviewClientsCheckboxes.on("change:selectedItems", function () {
    if (contextApp.EmailPreviewClientsCheckboxes.get("selectedItems").length == 0) {
      contextApp.EmailPreviewRunEmailPreviewCheckButton.viewModel.disable();
    } else {
      if (messageContext.get("isReadonly")) {
        return;
      }

      contextApp.EmailPreviewRunEmailPreviewCheckButton.viewModel.enable();
    }
  });

  contextApp.SpamCheckClientsDropDown.viewModel.$el.on("click", function () {
    if (contextApp.SpamCheckReportsDropDown.viewModel.isOpen()) {
      contextApp.SpamCheckReportsDropDown.viewModel.close();
    }
  });

  contextApp.SpamCheckReportsDropDown.viewModel.$el.on("click", function () {
    if (contextApp.SpamCheckClientsDropDown.viewModel.isOpen()) {
      contextApp.SpamCheckClientsDropDown.viewModel.close();
    }
  });

  contextApp.SpamCheckClientsCheckboxes.on("change:selectedItems", function () {
    if (contextApp.SpamCheckClientsCheckboxes.get("selectedItems").length == 0) {
      contextApp.SpamCheckRunSpamCheckButton.viewModel.disable();
    } else {
      if (messageContext.get("isReadonly")) {
        return;
      }

      contextApp.SpamCheckRunSpamCheckButton.viewModel.enable();
    }
  });

  this.initVariantsSelectors(sitecore, contextApp);

  contextApp.on("action:startemailpreview", function () {
    contextApp.EmailPreviewRunEmailPreviewCheckButton.viewModel.disable();
    contextApp.EmailPreviewClientsDropDown.viewModel.close();
    contextApp.EmailPreviewReportsDropDown.viewModel.close();
    contextApp.EmailPreviewBusyImage.viewModel.show();

    var selectedCheckboxIds = contextApp.EmailPreviewClientsCheckboxes.viewModel.getSelectedIds();
    var selectedVariantIds = [];

    var variants = messageContext.get("variants");
    $.each(contextApp.EmailPreviewVariantsSelector.viewModel.getSelectedVariants(), function (k, v) {
      selectedVariantIds.push(variants[v].id);
    });

    // only one variant exists, select it
    if (selectedVariantIds.length == 0 && variants.length == 1) {
      selectedVariantIds.push(variants[0].id);
    }
      // else if multiple exists, but none are selected
    else if (selectedVariantIds.length == 0 && variants.length > 1) {
      $.each(variants, function (k, v) {
        selectedVariantIds.push(v.id);
      });
    }

    setTimeout(function () {
      contextApp.currentContext = {
        messageId: messageContext.get("messageId"),
        variantIds: selectedVariantIds,
        language: messageContext.get("language"),
        messageBar: messageBar,
        clientIds: selectedCheckboxIds,
        messageContext: messageContext
      };
      var context = clone(contextApp.currentContext);
      sitecore.Pipelines.StartEmailPreview.execute({ app: contextApp, currentContext: context });
      if (context.errorCount > 0) {
        contextApp.EmailPreviewRunEmailPreviewCheckButton.viewModel.enable();
        contextApp.EmailPreviewBusyImage.viewModel.hide();
      }
    }, 100);

  }, contextApp);

  contextApp.on("action:startspamcheck", function () {
    contextApp.SpamCheckRunSpamCheckButton.viewModel.disable();
    contextApp.SpamCheckClientsDropDown.viewModel.close();
    contextApp.SpamCheckReportsDropDown.viewModel.close();
    contextApp.SpamCheckBusyImage.viewModel.show();

    var selectedCheckboxIds = contextApp.SpamCheckClientsCheckboxes.viewModel.getSelectedIds();
    var selectedVariantIds = [];

    var variants = messageContext.get("variants");
    $.each(contextApp.SpamCheckVariantsSelector.viewModel.getSelectedVariants(), function (k, v) {
      selectedVariantIds.push(variants[v].id);
    });

    // only one variant exists, select it
    if (selectedVariantIds.length == 0 && variants.length == 1) {
      selectedVariantIds.push(variants[0].id);
    }
      // else if multiple exists, but none are selected
    else if (selectedVariantIds.length == 0 && variants.length > 1) {
      $.each(variants, function (k, v) {
        selectedVariantIds.push(v.id);
      });
    }

    setTimeout(function () {
      contextApp.currentContext = {
        messageId: messageContext.get("messageId"),
        variantIds: selectedVariantIds,
        language: messageContext.get("language"),
        messageBar: messageBar,
        clientIds: selectedCheckboxIds,
        messageContext: messageContext
      };
      var context = clone(contextApp.currentContext);
      sitecore.Pipelines.StartSpamCheck.execute({ app: contextApp, currentContext: context });
      if (context.errorCount > 0) {
        contextApp.SpamCheckRunSpamCheckButton.viewModel.enable();
        contextApp.SpamCheckBusyImage.viewModel.hide();
      }
    }, 100);

  }, contextApp);

  contextApp.on("action:sendquicktest", function () {
    contextApp.SendQuickTestButton.viewModel.disable();
    contextApp.SendQuickTestBusyImage.viewModel.show();

    var selectedVariantIds = [];
    var variants = messageContext.get("variants");
    $.each(contextApp.SendQuickTestVariantsSelector.viewModel.getSelectedVariants(), function (k, v) {
      selectedVariantIds.push(variants[v].id);
    });

    // only one variant exists, select it
    if (selectedVariantIds.length == 0 && variants.length == 1) {
      selectedVariantIds.push(variants[0].id);
    }

    setTimeout(function () {
      contextApp.currentContext = {
        messageId: messageContext.get("messageId"),
        variantIds: selectedVariantIds,
        language: messageContext.get("language"),
        messageBar: messageBar,
        messageContext: messageContext,
        testEmails: contextApp.SendQuickTestEmailTextBox.viewModel.text()
      };
      var context = clone(contextApp.currentContext);
      sitecore.Pipelines.SendQuickTest.execute({ app: contextApp, currentContext: context });
      contextApp.SendQuickTestButton.viewModel.enable();
      contextApp.SendQuickTestBusyImage.viewModel.hide();
    }, 100);

  }, contextApp);

  contextApp.EmailPreviewReportListControl.on("change:items", function (args) {
    contextApp.EmailPreviewBusyImage.viewModel.show();
    if (args.get("selectedItemId") == "") {
      var results = contextApp.EmailPreviewReportDataSource.get("results");
      if (results.length > 0) {
        var report = results[results.length - 1];
        contextApp.EmailPreviewReportListControl.set("selectedItemId", report.itemId);
      }
    }
    contextApp.EmailPreviewBusyImage.viewModel.hide();
  });

  contextApp.SpamCheckReportListControl.on("change:items", function (args) {
    contextApp.SpamCheckBusyImage.viewModel.show();
    if (args.get("selectedItemId") == "") {
      var results = contextApp.SpamCheckReportDataSource.get("results");
      if (results.length > 0) {
        var report = results[results.length - 1];
        contextApp.SpamCheckReportListControl.set("selectedItemId", report.itemId);
      }
    }
    contextApp.SpamCheckBusyImage.viewModel.hide();
  });

  contextApp.EmailPreviewReportListControl.on("change:selectedItemId", function (args) {
    var datasource = contextApp.EmailPreviewReportDataSource.get("results");
    var report = _.find(datasource, function (item) {
      return item.itemId == args.get("selectedItemId");
    });

    contextApp.EmailPreviewBusyImage.viewModel.show();
    initEmailPreviewMessageVariants(report, contextApp.EmailPreviewVariantsRepeater, messageContext, contextApp, sitecore);
    contextApp.EmailPreviewBusyImage.viewModel.hide();
  });

  contextApp.SpamCheckReportListControl.on("change:selectedItemId", function (args) {
    var datasource = contextApp.SpamCheckReportDataSource.get("results");
    var report = _.find(datasource, function (item) {
      return item.itemId == args.get("selectedItemId");
    });

    contextApp.SpamCheckBusyImage.viewModel.show();
    initSpamCheckMessageVariants(report, contextApp.SpamCheckVariantsRepeater, messageContext, contextApp, sitecore);
    contextApp.SpamCheckBusyImage.viewModel.hide();
  });

  contextApp.EmailPreviewVariantsRepeater.RenderedItems.on("add", function (arg) {
    // Clean out the temp item in the core database
    var item = contextApp.EmailPreviewVariantsRepeater.getItem(arg.get("app"));
    postServerRequest("ecm.reportrepeateritem.delete", { value: item.itemId }, function (response) { }, true);
  });

  contextApp.SpamCheckVariantsRepeater.RenderedItems.on("add", function (arg) {
    // Clean out the temp item in the core database
    var item = contextApp.SpamCheckVariantsRepeater.getItem(arg.get("app"));
    postServerRequest("ecm.reportrepeateritem.delete", { value: item.itemId }, function (response) { }, true);
  });

  sitecore.on("change:messageContext", function () {
    // hide the variants if there is only one
    if (messageContext.get("variants").length < 2) {
      $("div[data-sc-id='EmailPreviewVariantsColumn']").hide();
      $("div[data-sc-id='SpamCheckVariantsColumn']").hide();
      $("div[data-sc-id='SendQuickTestVariantsColumn']").hide();
    } else {
      $("div[data-sc-id='EmailPreviewVariantsColumn']").show();
      $("div[data-sc-id='SpamCheckVariantsColumn']").show();
      $("div[data-sc-id='SendQuickTestVariantsColumn']").show();
    }

    if (messageContext.get("isReadonly")) {
      contextApp.EmailPreviewRunEmailPreviewCheckButton.viewModel.disable();
      contextApp.SpamCheckRunSpamCheckButton.viewModel.disable();
      contextApp.SendQuickTestButton.viewModel.disable();
    }

    if (!contextApp.EmailPreviewReportDataSource.get("hasResults")) {
      contextApp.EmailPreviewBusyImage.viewModel.hide();
    }
    if (!contextApp.SpamCheckReportDataSource.get("hasResults")) {
      contextApp.SpamCheckBusyImage.viewModel.hide();
    }
  });

  sitecore.on("click:emailpreview", function (args) {
    showPreviewDetailsDialog(args);
  });

  sitecore.on("click:spamcheck", function (args) {
    showSpamCheckDetailsDialog(args);
  });

  contextApp.on("showemailpreviewreport", function (args) {
    sitecore.trigger("action:switchtab", { tab: 3, subtab: 1 });
    contextApp.EmailPreviewReportListControl.set("selectedItemId", args.id);
  });

  contextApp.on("showspamcheckreport", function (args) {
    sitecore.trigger("action:switchtab", { tab: 3, subtab: 2 });
    contextApp.SpamCheckReportListControl.set("selectedItemId", args.id);
  });

  function showPreviewDetailsDialog(parameters) {
    if (contextApp["showPreviewDetailsDialog"] === undefined) {
      insertAndShowDialog(parameters);
    } else {
      sitecore.trigger("emailpreview:details:dialog:show", parameters);
    }

    function insertAndShowDialog(dialogParameters) {
      if (contextApp["showPreviewDetailsDialog"] === undefined) {
        contextApp.insertRendering("{EBD54846-CB01-44D3-B3CF-E6129E8DF6F0}", { $el: $("body") }, function (subApp) {
          contextApp["showPreviewDetailsDialog"] = subApp;
          sitecore.trigger("emailpreview:details:dialog:show", dialogParameters);
        });
      }
    };
  };

  function showSpamCheckDetailsDialog(parameters) {
    if (contextApp["showSpamCheckDetailsDialog"] === undefined) {
      insertAndShowDialog(parameters);
    } else {
      sitecore.trigger("spamcheck:details:dialog:show", parameters);
    }

    function insertAndShowDialog(dialogParameters) {
      if (contextApp["showSpamCheckDetailsDialog"] === undefined) {
        contextApp.insertRendering("{3E4BC47F-75E7-48AB-9C0A-9D0B456FE0DF}", { $el: $("body") }, function (subApp) {
          contextApp["showSpamCheckDetailsDialog"] = subApp;
          sitecore.trigger("spamcheck:details:dialog:show", dialogParameters);
        });
      }
    };
  };
}

function initVariantsSelectors(sitecore, contextApp) {
  // update on change in messageContext
  sitecore.on("change:messageContext", function () {
    var variants = $.map(contextApp.MessageContext.get("variants"), function (m, v) {
      return v;
    });
    contextApp.EmailPreviewVariantsSelector.viewModel.showVariants(variants);
    contextApp.SpamCheckVariantsSelector.viewModel.showVariants(variants);
    contextApp.SendQuickTestVariantsSelector.viewModel.showVariants(variants);

    if (variants.length > 1) {
      $('div[data-sc-id="EmailPreviewButtonsToTheLeft"], div[data-sc-id="SpamCheckButtonsToTheLeft"], div[data-sc-id="SendQuickTestButtonsToTheLeft"]').removeClass("col-md-8").addClass("col-md-6");
    }
    var selectedVariantsEmailPreview = contextApp.EmailPreviewVariantsSelector.viewModel.getSelectedVariants();
    var selectedVariantsSpamCheck = contextApp.SpamCheckVariantsSelector.viewModel.getSelectedVariants();
    var selectedVariantsSendQuickTest = contextApp.SendQuickTestVariantsSelector.viewModel.getSelectedVariants();

    contextApp.EmailPreviewVariantsPresenter.viewModel.showVariants(selectedVariantsEmailPreview);
    contextApp.SpamCheckVariantsPresenter.viewModel.showVariants(selectedVariantsSpamCheck);
    contextApp.SendQuickTestVariantsPresenter.viewModel.showVariants(selectedVariantsSendQuickTest);
  });

  // bind to change in variants in order to display them
  contextApp.EmailPreviewVariantsSelector.on("change:variants", function () {
    contextApp.EmailPreviewVariantsPresenter.viewModel.showVariants(contextApp.EmailPreviewVariantsSelector.viewModel.getSelectedVariants());
  });

  contextApp.SpamCheckVariantsSelector.on("change:variants", function () {
    contextApp.SpamCheckVariantsPresenter.viewModel.showVariants(contextApp.SpamCheckVariantsSelector.viewModel.getSelectedVariants());
  });

  contextApp.SendQuickTestVariantsSelector.on("change:variants", function () {
    contextApp.SendQuickTestVariantsPresenter.viewModel.showVariants(contextApp.SendQuickTestVariantsSelector.viewModel.getSelectedVariants());
  });
}

function initEmailPreviewMessageVariants(report, repeater, messageContext, contextApp, sitecore) {
  contextApp.EmailPreviewVariantsRepeater.viewModel.reset();

  if (!report) {
    console.log("error");
    return;
  }
  for (var i = 0; i < report.variantIds.length; i++) {
    var variant = report.variantIds[i];
    addVariantToVariantRepeater(variant, report, "false", repeater, messageContext, "", sitecore);
  }
}

function initSpamCheckMessageVariants(report, repeater, messageContext, contextApp, sitecore) {
  contextApp.SpamCheckVariantsRepeater.viewModel.reset();

  if (!report) {
    console.log("error");
    return;
  }
  for (var i = 0; i < report.variantIds.length; i++) {
    var variant = report.variantIds[i];
    addVariantToVariantRepeater(variant, report, "false", repeater, messageContext, "spamcheck", sitecore);
  }
}

function addVariantToVariantRepeater(variant, report, focus, repeater, messageContext, type, sitecore) {
  var variants = messageContext.get("variants");
  var letter = "";

  $.each(variants, function (k, v) {
    if (v.id == variant) {
      letter = String.fromCharCode(65 + k);
      return;
    }
  });

  var context = {
    variantId: variant,
    variantName: letter,
    dateAndTime: report.date,
    reportId: report.itemId,
    language: messageContext.get("language"),
    messageId: messageContext.get("messageId"),
    type: type
  };

  postServerRequest("ecm.reportrepeateritem.create", {
    variantId: context.variantId,
    variantName: context.variantName,
    dateAndTime: context.dateAndTime,
    reportId: context.reportId,
    messageId: context.messageId,
    language: context.language,
    type: context.type
  }, function (response) {
    if (response.error) {
      context.errorCount = 1;
      context.aborted = true;
      return;
    }

    if (!response.value) {
      context.aborted = true;
      context.errorCount = 1;
      return;
    } else {
      context.newItemId = response.value;
    }
  }, false);


  if (context.errorCount > 0) {
    return;
  }
  var item = {
    itemId: context.newItemId,
    $database: "core",
    Focus: focus
  };
  repeater.viewModel.add(item);
}

