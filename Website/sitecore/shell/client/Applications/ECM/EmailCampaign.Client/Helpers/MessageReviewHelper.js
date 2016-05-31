define([
  "sitecore",
  "/-/speak/v1/ecm/ServerRequest.js"
], function (sitecore, ServerRequest) {

  function addVariantToVariantRepeater(variant, report, focus, repeater, messageContext, type, sitecore) {
    var variants = messageContext.get("variants");
    var letter = "";

    $.each(variants, function (k, v) {
      if (v.id === variant) {
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

    ServerRequest("EXM/CreateReportRepeaterItem", {
      data: {
        variantId: context.variantId,
        variantName: context.variantName,
        dateAndTime: context.dateAndTime,
        reportId: context.reportId,
        messageId: context.messageId,
        language: context.language,
        type: context.type
      },
      success: function(response) {
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
      },
      async: false
    });

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

  function setCheckButtonViewLogic(checkButton, busyImage, condition) {
    if (condition) {
      checkButton.viewModel.disable();
      busyImage.viewModel.show();
    } else {
      checkButton.viewModel.enable();
      busyImage.viewModel.hide();
    }
  }

  return {
    initEmailPreviewMessageVariants: function (report, repeater, messageContext, contextApp, sitecore) {
      contextApp.EmailPreviewVariantsRepeater.viewModel.reset();
      if (!report) {
        return;
      }
      for (var i = 0; i < report.variantIds.length; i++) {
        var variant = report.variantIds[i];
        addVariantToVariantRepeater(variant, report, "false", repeater, messageContext, "", sitecore);
      }
    },

    initSpamCheckMessageVariants: function(report, repeater, messageContext, contextApp, sitecore) {
      contextApp.SpamCheckVariantsRepeater.viewModel.reset();

      if (!report) {
        return;
      }
      for (var i = 0; i < report.variantIds.length; i++) {
        var variant = report.variantIds[i];
        addVariantToVariantRepeater(variant, report, "false", repeater, messageContext, "spamcheck", sitecore);
      }
    },

    setEmailPreviewCheckButtonViewLogic: function(contextApp, isBusy) {
      setCheckButtonViewLogic(contextApp.EmailPreviewRunEmailPreviewCheckButton, contextApp.EmailPreviewBusyImage, isBusy);
    },

    setSpamCheckCheckButtonViewLogic: function(contextApp, isBusy) {
      setCheckButtonViewLogic(contextApp.SpamCheckRunSpamCheckButton, contextApp.SpamCheckBusyImage, isBusy);
    }
  };
});