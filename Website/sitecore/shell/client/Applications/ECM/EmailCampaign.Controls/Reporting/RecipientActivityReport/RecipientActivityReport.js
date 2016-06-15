define([
    "sitecore",
    "/-/speak/v1/ecm/ReportingBlockBase.js",
    "/-/speak/v1/ecm/MathHelper.js",
    "/-/speak/v1/ecm/ChartDataConversionService.js",
    "/-/speak/v1/ecm/constants.js"
], function (sitecore, ReportingBlockBase, MathHelper, ChartDataConversionService, Constants) {
    var model = ReportingBlockBase.model.extend({
        defaults: {
            clicksToOpens: null
        },
        reCalculate: function () {
            this.set('totals', this.getTotals());
        },
        getTotals: function () {
            return {
                open: this.getOpens(),
                click: this.getClicks(),
                uniqueOpen: this.getUniqueOpens(),
                uniqueClick: this.getUniqueClicks(),
                bounce: this.getBounces(),
                unsubscribe: this.getUnsubscribes(),
                sent: this.getSent()
            }
        },
        attachHandlers: function () {
            this._super();

            this.on({
                'change:totals': function () {
                    var totals = this.get('totals');
                    this.set('clicksToOpens', MathHelper.percentage(totals.click, totals.open));
                }
            }, this);
        },
        getOpens: function() {
            return this.get('dataSource').total(function(fact) {
                return fact.event === Constants.Reporting.Events.OPEN ? fact.visits : 0;
            });
        },
        getClicks: function() {
            return this.get('dataSource').total(function (fact) {
                return fact.event === Constants.Reporting.Events.CLICK ? fact.visits : 0;
            });
        },
        getUniqueOpens: function() {
            return this.get('dataSource').total(function (fact) {
                return fact.event === Constants.Reporting.Events.OPEN ? fact.count : 0;
            });
        },
        getUniqueClicks: function() {
            return this.get('dataSource').total(function (fact) {
                return fact.event === Constants.Reporting.Events.CLICK ? fact.count : 0;
            });
        },
        getBounces: function() {
            return this.get('dataSource').total(function(fact) {
                return fact.event === Constants.Reporting.Events.BOUNCE ? fact.visits : 0;
            });
        },
        getUnsubscribes: function () {
            return this.get('dataSource').total(function (fact) {
                return fact.event === Constants.Reporting.Events.UNSUBSCRIBE ? fact.visits : 0;
            });
        },
        getSent: function() {
            return this.get('dataSource').total(function (fact) {
                return fact.event === Constants.Reporting.Events.SENT ? fact.visits : 0;
            });
        }
    });

    var view = ReportingBlockBase.view.extend({
        childComponents: [
           'DoughnutChart',
           'BouncedScore',
           'UniqueClicksScore',
           'UniqueOpensScore',
           'UnsubscribedScore'
        ],

        attachHandlers: function () {
            this._super();
            this.model.on({
                'change:totals': this.update,
                'change:clicksToOpens': this.updateClicksToOpens
            }, this);
        },

        update: function() {
            this.updateUniqueOpens();
            this.updateUniqueClicks();
            this.updateBounces();
            this.updateUnsubscribes();
        },

        updateClicksToOpens: function() {
            var totals = this.model.get('totals'),
                clicksToOpens = MathHelper.percentage(totals.click, totals.open),
                recipientActivityChartData = [];

            if (totals.click && totals.open) {
                recipientActivityChartData = [
                    {
                        "key": sitecore.Resources.Dictionary.translate("ECM.Reporting.Opens"),
                        "values": [
                            {
                                "x": sitecore.Resources.Dictionary.translate("ECM.Reporting.Clicks"),
                                "y": clicksToOpens
                            },
                            {
                                "x": sitecore.Resources.Dictionary.translate("ECM.Reporting.Opens"),
                                "y": clicksToOpens > 100 ? 0 : 100 - clicksToOpens
                            }
                        ]
                    }
                ];
            }

            this.children.DoughnutChart.set("dynamicData", recipientActivityChartData);
        },
        
        updateUniqueOpens: function () {
            var totals = this.model.get('totals'),
                uniqueOpenRate = MathHelper.percentage(totals.uniqueOpen, totals.sent);

            this.children.UniqueOpensScore.set('value', uniqueOpenRate + '%');
            this.children.UniqueOpensScore.set(
                'description',
                totals.uniqueOpen +
                ' ' +
                sitecore.Resources.Dictionary.translate("ECM.Reporting.UniqueOpens").toLowerCase()
            );
        },

        updateUniqueClicks: function () {
            var totals = this.model.get('totals'),
                uniqueClickRate = MathHelper.percentage(totals.uniqueClick, totals.sent);

            this.children.UniqueClicksScore.set('value', uniqueClickRate + '%');
            this.children.UniqueClicksScore.set(
                'description',
                totals.uniqueClick +
                ' ' +
                sitecore.Resources.Dictionary.translate("ECM.Reporting.UniqueClicks").toLowerCase()
            );
        },

        updateBounces: function () {
            var totals = this.model.get('totals'),
                bouncedRate = MathHelper.percentage(totals.bounce, totals.sent);

            this.children.BouncedScore.set('value', bouncedRate + '%');
            this.children.BouncedScore.set(
                'description',
                totals.bounce +
                ' ' +
                sitecore.Resources.Dictionary.translate("ECM.Reporting.Bounced").toLowerCase()
            );
        },

        updateUnsubscribes: function() {
            var totals = this.model.get('totals'),
                unsubscribedRate = MathHelper.percentage(totals.unsubscribe, totals.sent);

            this.children.UnsubscribedScore.set('value', unsubscribedRate + '%');
            this.children.UnsubscribedScore.set(
                'description',
                totals.unsubscribe +
                ' ' +
                sitecore.Resources.Dictionary.translate("ECM.Reporting.Unsubscribed").toLowerCase()
            );
        }
    });

    sitecore.Factories.createComponent("RecipientActivityReport", model, view, ".sc-RecipientActivityReport");
    return { view: view, model: model };
});