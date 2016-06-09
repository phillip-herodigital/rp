define([
    "sitecore",
    "/-/speak/v1/ecm/ServerRequest.js",
    "/-/speak/v1/ecm/MessageReviewHelper.js",
    "/-/speak/v1/ecm/constants.js"
], function(
    sitecore,
    ServerRequest,
    MessageReviewHelper,
    Constants
) {
    return {
        priority: 4,
        execute: function(context) {
            if (context.response) {
                context.app.ReportUpdateWatcher.viewModel.add(context.response.messageReview);
                context.app.SpamCheckReportDataSource.viewModel.refresh();

                context.app.SpamCheckReportListControl.on("change:items", function() {
                    context.app.SpamCheckReportListControl.off(null, null, this);
                    this.startTimer(context);
                }, this);
            }
        },

        refresh: function(context) {
            function getIdForGetState(dsResults, reportListControl) {
                var maxDate;
                var result;
                if (!reportListControl.get("hasSelectedItem")) {
                    _.each(dsResults, function(reportItem) {
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

            MessageReviewHelper.setSpamCheckCheckButtonViewLogic(context.app, true);
            var datasource = context.app.SpamCheckReportDataSource.get("results");
            var id = getIdForGetState(datasource, context.app.SpamCheckReportListControl);
            if (id === undefined || id !== context.response.messageReview.rawData) {
                this.startTimer(context);
                MessageReviewHelper.setSpamCheckCheckButtonViewLogic(context.app, false);
                return;
            }
            var that = this;
            var state;

            ServerRequest(Constants.ServerRequests.SPAM_CHECK_STATE, {
                data: {
                    messageId: context.currentContext.messageId,
                    language: context.currentContext.language,
                    reportId: id
                },
                success: function(response) {
                    if (response.error) {
                        context.currentContext.errorCount = 1;
                        context.aborted = true;
                        MessageReviewHelper.setSpamCheckCheckButtonViewLogic(context.app, false);
                        return;
                    }
                    state = response.state;
                    var report = _.find(datasource, function(reportItem) {
                        return reportItem.itemId === id;
                    });
                    if (report) {
                        MessageReviewHelper.initSpamCheckMessageVariants(report, context.app.SpamCheckVariantsRepeater, context.currentContext.messageContext, context.app, sitecore);
                        if (state === 1) {
                            that.startTimer(context);
                        }
                    }
                    MessageReviewHelper.setSpamCheckCheckButtonViewLogic(context.app, false);
                }
            });
        },
        startTimer: function(context) {
            var that = this;
            that.timer = window.setTimeout(function() {
                that.refresh(context);
            }, 15000);
        },
        timer: null,
        stop: function() {
            if (this.timer) {
                window.clearTimeout(this.timer);
            }
        }
    };
});