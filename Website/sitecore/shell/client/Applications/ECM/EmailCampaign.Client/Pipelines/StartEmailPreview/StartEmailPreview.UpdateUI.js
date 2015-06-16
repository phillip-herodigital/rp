define(["sitecore", "/-/speak/v1/ecm/ServerRequest.js"], function (sitecore) {
  return {
    priority: 4,
    execute: function (context) {

      context.app.ReportUpdateWatcher.viewModel.add(context.response.messageReview);

      var id = context.response.messageReview.rawData;

      context.app.EmailPreviewReportDataSource.viewModel.refresh();
      var that = this;
      context.app.EmailPreviewReportListControl.on("change:items", function () {
        context.app.EmailPreviewReportListControl.set("selectedItemId", id);
        context.app.EmailPreviewReportListControl.off(null, null, this);
        context.app.EmailPreviewRunEmailPreviewCheckButton.viewModel.enable();

        // initialize refresher
        that.startTimer(context);
      }, this);

      setTimeout(function () {
        if (!context.app.EmailPreviewRunEmailPreviewCheckButton.get("isEnabled")) {
          context.app.EmailPreviewRunEmailPreviewCheckButton.viewModel.enable();
        }
      }, 20000);

    },

    refresh: function (context) {
      var id = context.response.messageReview.rawData;
      var state;
      postServerRequest("ecm.emailpreviewstate.get", {
        messageId: context.currentContext.messageId,
        language: context.currentContext.language,
        reportId: id
      }, function (response) {
        if (response.error) {
          context.currentContext.messageBar.addMessage("error", response.errorMessage);
          context.currentContext.errorCount = 1;
          context.aborted = true;
          return;
        }

        state = response.state;
      }, false);

      var datasource = context.app.EmailPreviewReportDataSource.get("results");
      var report = _.find(datasource, function (reportItem) {
        return reportItem.itemId == id;
      });

      if (report) {
        initEmailPreviewMessageVariants(report, context.app.EmailPreviewVariantsRepeater, context.currentContext.messageContext, context.app, sitecore);
        if (state == 1) {
          this.startTimer(context);
        } else {
          context.app.EmailPreviewBusyImage.viewModel.hide();
        }
      }
    },
    startTimer: function (context) {
      var that = this;
      window.setTimeout(function () {
        that.refresh(context);
      }, 15000);
    }

  };
});