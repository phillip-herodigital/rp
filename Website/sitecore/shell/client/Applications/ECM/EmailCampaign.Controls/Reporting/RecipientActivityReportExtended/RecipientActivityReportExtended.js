define([
    "sitecore",
    "/-/speak/v1/ecm/RecipientActivityReport.js",
    "/-/speak/v1/ecm/constants.js",
    "/-/speak/v1/ecm/MathHelper.js"
], function (sitecore, RecipientActivityReport, Constants, MathHelper) {
    var model = RecipientActivityReport.model.extend({
        getSpam: function() {
            return this.get('dataSource').total(function (fact) {
                return fact.event === Constants.Reporting.Events.SPAM ? fact.visits : 0;
            });
        },

        getTotals: function() {
            var totals = this._super();
            totals.spam = this.getSpam();
            return totals;
        }
    });

    var view = RecipientActivityReport.view.extend({
        childComponents: [
           'DoughnutChart',
           'BouncedScore',
           'UniqueClicksScore',
           'UniqueOpensScore',
           'UnsubscribedScore',
           'DeliveredScore',
           'SpamComplaintsScore',
           'ClickRateScore',
           'OpenRateScore',
           'TotalSentScore'
        ],

        update: function () {
            this._super();
            this.updateSpamComplaints();
            this.updateDeliveredScore();
            this.updateClickRate();
            this.updateUOpenRate();
            this.updateTotalSent();
        },

        updateSpamComplaints: function () {
            var totals = this.model.get('totals'),
                spamRate = MathHelper.percentage(totals.spam, totals.sent);

            this.children.SpamComplaintsScore.set('value', spamRate + ' %');
            this.children.SpamComplaintsScore.set(
                'description',
                totals.spam + ' ' + 
                sitecore.Resources.Dictionary.translate("ECM.Reporting.MarkedAsSpam").toLowerCase()
            );
        },

        updateDeliveredScore: function () {
            var totals = this.model.get('totals'),
                deliveredRate = MathHelper.percentage((totals.sent - totals.bounce), totals.sent);

            this.children.DeliveredScore.set('value', deliveredRate + ' %');
            this.children.DeliveredScore.set(
                'description',
                (totals.sent - totals.bounce) + ' ' +
                sitecore.Resources.Dictionary.translate("ECM.Reporting.Of").toLowerCase() +
                ' ' + totals.sent + ' ' + 
                sitecore.Resources.Dictionary.translate("ECM.Reporting.Sent").toLowerCase()
            );
        },

        updateClickRate: function () {
            var totals = this.model.get('totals'),
                clickRate = MathHelper.percentage(totals.click, totals.sent);

            this.children.ClickRateScore.set('value', clickRate + ' %');
            this.children.ClickRateScore.set(
                'description',
                totals.click +
                ' ' +
                sitecore.Resources.Dictionary.translate("ECM.Reporting.Clicks").toLowerCase()
            );
        },

        updateUOpenRate: function () {
            var totals = this.model.get('totals'),
                openRate = MathHelper.percentage(totals.open, totals.sent);

            this.children.OpenRateScore.set('value', openRate + '%');
            this.children.OpenRateScore.set(
                'description',
                totals.open +
                ' ' +
                sitecore.Resources.Dictionary.translate("ECM.Reporting.Opens").toLowerCase()
            );
        },

        updateTotalSent: function() {
            var totals = this.model.get('totals');

            this.children.TotalSentScore.set('value', totals.sent);
        }
    });


    return sitecore.Factories.createComponent("RecipientActivityReportExtended", model, view, ".sc-RecipientActivityReportExtended");
});