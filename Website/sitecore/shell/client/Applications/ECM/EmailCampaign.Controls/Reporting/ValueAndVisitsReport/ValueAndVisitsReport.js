define([
    'sitecore',
    '/-/speak/v1/ecm/ReportingBlockBaseTabs.js',
    '/-/speak/v1/ecm/ChartDataConversionService.js',
    "/-/speak/v1/ecm/MathHelper.js",
    "/-/speak/v1/ecm/constants.js"
], function (sitecore, ReportingBlockBaseTabs, ChartDataConversionService, MathHelper, Constants) {
    var model = ReportingBlockBaseTabs.model.extend({
        reCalculate: function () {
            this.updateTotals();
            this.monthGroup = this.getMonthGroup();
            this.set('monthActivity', this.getMonthActivity());
        },

        getMonthActivity: function () {
            var monthActivity = this.monthGroup.orderBy('month').top(Infinity).reverse();

            _.each(monthActivity, function (item) {
                var d = new Date();
                d.setTime(item.key);
                item.key = d;
                item.value.valuePerVisit = new Number(MathHelper.divide(item.value.value, item.value.click));
            });

            return monthActivity;
        },

        getMonthGroup: function () {
            return this.get('dataSource').dimension('month').group({
                click: { $sum: 'visits', condition: { event: Constants.Reporting.Events.CLICK } },
                value: '$sum',
                month: '$any'
            });
        },

        updateTotals: function() {
            this.set('totals', {
                sent: this.getSent(),
                click: this.getClicks(),
                bounce: this.getBounces(),
                value: this.getValue()
            });
        },

        getSent: function() {
            return this.get('dataSource').total(function (fact) {
                return fact.event === Constants.Reporting.Events.SENT ? fact.visits : 0;
            });
        },

        getClicks: function () {
            return this.get('dataSource').total(function (fact) {
                return fact.event === Constants.Reporting.Events.CLICK ? fact.visits : 0;
            });
        },

        getValue: function () {
            return this.get('dataSource').total(function (fact) {
                return fact.event === Constants.Reporting.Events.CLICK ? fact.value : 0;
            });
        },

        getBounces: function() {
            return this.get('dataSource').total(function (fact) {
                return fact.event === Constants.Reporting.Events.BOUNCE ? fact.visits : 0;
            });
        }
    });

    var view = ReportingBlockBaseTabs.view.extend({
        childComponents: [
            'Tabs',
            'TabContent0',
            'TabContent1',
            'BarChart',
            'ValueScoreCard',
            'ValuePerVisitScoreCard',
            'ValuePerEmailScoreCard',
            'VisitsPerEmailScoreCard',
            'CombinationChart'
        ],

        attachHandlers: function () {
            this._super();
            this.model.on({
                'change:monthActivity': this.updateValueOverTimeChart,
                'change:totals': this.updateTotals
            }, this);
        },

        updateValueOverTimeChart: function() {
            var monthActivity = this.model.get('monthActivity'),
                valueOverTimeChartData = [];

            if (monthActivity.length) {
                valueOverTimeChartData = ChartDataConversionService.convert(
                    this.model.get('monthActivity'),
                    {
                        keys: [
                            { key: 'click', title: sitecore.Resources.Dictionary.translate("ECM.Reporting.Visits") },
                            { key: 'value', title: sitecore.Resources.Dictionary.translate("ECM.Reporting.Value") },
                            { key: 'valuePerVisit', title: sitecore.Resources.Dictionary.translate("ECM.Reporting.ValuePerVisit") }
                        ]
                    }
                );
                valueOverTimeChartData[0].bar = true;
            }

            this.children.CombinationChart.set("dynamicData", valueOverTimeChartData);
            
        },

        updateTotals: function () {
            var totals = this.model.get('totals'),
                overTimeChartData = [
                {
                    "key": "Visits",
                    "values": [
                        { "x": sitecore.Resources.Dictionary.translate("ECM.Reporting.TotalSent"), "y": totals.sent },
                        { "x": sitecore.Resources.Dictionary.translate("ECM.Reporting.Visits"), "y": totals.click },
                        { "x": sitecore.Resources.Dictionary.translate("ECM.Reporting.Browsed"), "y": totals.click - totals.bounce }
                    ]
                }
            ];

            this.children.BarChart.set("dynamicData", overTimeChartData);
            this.children.ValueScoreCard.set('value', new Number(totals.value));
            this.children.ValuePerVisitScoreCard.set('value', new Number(MathHelper.divide(totals.value, totals.click, 2)));
            this.children.ValuePerEmailScoreCard.set('value', new Number(MathHelper.divide(totals.value, totals.sent, 2)));
            this.children.VisitsPerEmailScoreCard.set('value', new Number(MathHelper.divide(totals.click, totals.sent, 2)));
        }
    });

    sitecore.Factories.createComponent("ValueAndVisitsReport", model, view, ".sc-ValueAndVisitsReport");
    return { view: view, model: model };
});