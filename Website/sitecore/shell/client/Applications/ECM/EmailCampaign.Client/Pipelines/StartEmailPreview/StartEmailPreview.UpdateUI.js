define(["sitecore", "/-/speak/v1/ecm/ServerRequest.js"], function (sitecore) {
  return {
    priority: 4,
    execute: function (context) {
      context.app.ReportUpdateWatcher.viewModel.add(context.response.messageReview);
      context.app.EmailPreviewReportDataSource.viewModel.refresh();

      context.app.EmailPreviewReportListControl.on("change:items", function () {
        context.app.EmailPreviewReportListControl.off(null, null, this);
        this.startTimer(context);
      }, this);
    },

    refresh: function (context) {
      function getIdForGetState(dsResults, reportListControl) {
        var maxDate;
        var result;
        if (!reportListControl.get("hasSelectedItem")) {
          _.each(dsResults, function (reportItem) {
            if (!maxDate || maxDate < reportItem.date) {
              maxDate = reportItem.date;
              result = reportItem.itemId;
            }
          });
        } else {
          result = reportListControl.get("selectedItemId");
        }
        return result;
      }

      setEmailPreviewCheckButtonViewLogic(context.app, true);
      var datasource = context.app.EmailPreviewReportDataSource.get("results");
      var id = getIdForGetState(datasource, context.app.EmailPreviewReportListControl);
      if (id === undefined || id !== context.response.messageReview.rawData) {
        this.startTimer(context);
        setEmailPreviewCheckButtonViewLogic(context.app, false);
        return;
      }
      var that = this;
      var state;
      postServerRequest("EXM/EmailPreviewState", {
        messageId: context.currentContext.messageId,
        language: context.currentContext.language,
        reportId: id
      }, function (response) {
        if (response.error) {
          context.currentContext.messageBar.addMessage("error", response.errorMessage);
          context.currentContext.errorCount = 1;
          context.aborted = true;
          setEmailPreviewCheckButtonViewLogic(context.app, false);
          return;
        }
        state = response.state;
        var report = _.find(datasource, function (reportItem) {
          return reportItem.itemId === id;
        });
        if (report) {
          initEmailPreviewMessageVariants(report, context.app.EmailPreviewVariantsRepeater, context.currentContext.messageContext, context.app, sitecore);
          if (state === 1) {
            that.startTimer(context);
          }
        }
        setEmailPreviewCheckButtonViewLogic(context.app, false);
      });
    },
    startTimer: function (context) {
      var that = this;
      that.timer = window.setTimeout(function () {
        that.refresh(context);
      }, 15000);
    },
    timer: null,
    stop: function () {
      if (this.timer) {
        window.clearTimeout(this.timer);
      }
    }
  };
});