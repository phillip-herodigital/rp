define(["sitecore", "/-/speak/v1/ecm/ServerRequest.js"], function (sitecore) {
  return {
    priority: 4,
    execute: function (context) {

      context.app.ReportUpdateWatcher.viewModel.add(context.response.messageReview);

      var id = context.response.messageReview.rawData;

      context.app.SpamCheckReportDataSource.viewModel.refresh();
      var that = this;
      context.app.SpamCheckReportListControl.on("change:items", function () {
        context.app.SpamCheckReportListControl.set("selectedItemId", id);
        context.app.SpamCheckReportListControl.off(null, null, this);
        context.app.SpamCheckRunSpamCheckButton.viewModel.enable();

        // initialize refresher
        that.startTimer(context);
      }, this);

      setTimeout(function () {
        if (!context.app.SpamCheckRunSpamCheckButton.get("isEnabled")) {
          context.app.SpamCheckRunSpamCheckButton.viewModel.enable();
        }
      }, 20000);

    },

    refresh: function (context) {
      var id = context.response.messageReview.rawData;
      var state;
      postServerRequest("ecm.spamcheckstate.get", {
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

      var datasource = context.app.SpamCheckReportDataSource.get("results");
      var report = _.find(datasource, function (reportItem) {
        return reportItem.itemId == id;
      });

      if (report) {
        initSpamCheckMessageVariants(report, context.app.SpamCheckVariantsRepeater, context.currentContext.messageContext, context.app, sitecore);
        if (state == 1) {
          this.startTimer(context);
        } else {
          context.app.SpamCheckBusyImage.viewModel.hide();
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