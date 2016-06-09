define([
    "sitecore",
    "/-/speak/v1/ecm/TechnologyReport.js",
    "/-/speak/v1/ecm/constants.js",
    "/-/speak/v1/ecm/MathHelper.js",
    "/-/speak/v1/ecm/ChartDataConversionService.js"
], function (sitecore, TechnologyReport, Constants, MathHelper, ChartDataConversionService) {
    var model = TechnologyReport.model.extend({
        defaults: {
            byMessageDataSource: null
        },
        reCalculate: function () {
            this._super();
            this.set('osList', this.getOsList());
            this.set('browsers', this.getBrowsers());
        },
        getTotals: function () {
            var totals = this._super(),
                sent = this.getSent();

            _.extend(totals, {
                sent: sent,
                mosts: {
                    deviceType: {
                        openRate: this.getMostOpenRate('deviceType', sent),
                        clickRate: this.getMostClickRate('deviceType', sent),
                        valuable: this.getMostValuable('deviceType'),
                        valuePerVisit: this.getMostValuePerVisit('deviceType')
                    },
                    os: {
                        openRate: this.getMostOpenRate('os', sent),
                        clickRate: this.getMostClickRate('os', sent),
                        valuable: this.getMostValuable('os'),
                        valuePerVisit: this.getMostValuePerVisit('os')
                    },
                    browser: {
                        openRate: this.getMostOpenRate('browser', sent),
                        clickRate: this.getMostClickRate('browser', sent),
                        valuable: this.getMostValuable('browser'),
                        valuePerVisit: this.getMostValuePerVisit('browser')
                    }
                }
            });
            return totals;
        },
        getSent: function () {
            return this.get('byMessageDataSource').total(function (fact) {
                return fact.event === Constants.Reporting.Events.SENT ? fact.visits : 0;
            });
        },
        getDeviceGroup: function () {
            return this.get('dataSource').dimension('deviceType').group({
                open: { $sum: 'visits', condition: { event: Constants.Reporting.Events.OPEN } },
                click: { $sum: 'visits', condition: { event: Constants.Reporting.Events.CLICK } },
                uniqueOpen: { $sum: 'count', condition: { event: Constants.Reporting.Events.OPEN } },
                uniqueClick: { $sum: 'count', condition: { event: Constants.Reporting.Events.ClICK } },
                value: '$sum'
            });
        },

        getOsGroup: function () {
            return this.get('dataSource').dimension('os').group({
                open: { $sum: 'visits', condition: { event: Constants.Reporting.Events.OPEN } },
                click: { $sum: 'visits', condition: { event: Constants.Reporting.Events.CLICK } },
                uniqueOpen: { $sum: 'count', condition: { event: Constants.Reporting.Events.OPEN } },
                uniqueClick: { $sum: 'count', condition: { event: Constants.Reporting.Events.ClICK } },
                value: '$sum'
            });
        },

        getBrowserGroup: function () {
            return this.get('dataSource').dimension('browser').group({
                open: { $sum: 'visits', condition: { event: Constants.Reporting.Events.OPEN } },
                click: { $sum: 'visits', condition: { event: Constants.Reporting.Events.CLICK } },
                uniqueOpen: { $sum: 'count', condition: { event: Constants.Reporting.Events.OPEN } },
                uniqueClick: { $sum: 'count', condition: { event: Constants.Reporting.Events.ClICK } },
                value: '$sum'
            });
        },
        getMostOpenRate: function (groupName, sent) {
            return this.groups[groupName].order(function (group) {
                return new Number(MathHelper.percentage(group.open, sent));
            }).top(1)[0];
        },
        getMostClickRate: function (groupName, sent) {
            return this.groups[groupName].order(function (group) {
                return new Number(MathHelper.percentage(group.click, sent));
            }).top(1)[0];
        },
        getMostValuable: function (groupName) {
            return this.groups[groupName].orderBy('value').top(1)[0];
        },
        getMostValuePerVisit: function (groupName) {
            return this.groups[groupName].order(function (group) {
                return new Number(MathHelper.divide(group.value, group.click));
            }).top(1)[0];
        },
        getOsList: function () {
            return this.groups.os.order(function (group) {
                return group.click + group.open;
            }).top(5);
        },
        getBrowsers: function () {
            return this.groups.browser.order(function (group) {
                return group.click + group.open;
            }).top(Infinity);
        },
        attachHandlers: function () {
            this._super();
            this.attachDataSourceHandlers('byMessageDataSource');
            this.on('change:byMessageDataSource', _.bind(this.attachDataSourceHandlers, this, 'byMessageDataSource'));
        }
    });

    var view = TechnologyReport.view.extend({
        childComponents: [
            'Tabs',
            'TabContent0',
            'TabContent1',
            'TabContent2',
            'BrowserDoughnutChart',
            'DeviceBarChart',
            'OsBarChart',
            'DeviceValuePerVisitScoreCard',
            'DeviceClickRateScoreCard',
            'DeviceMostValuableScoreCard',
            'DeviceOpenRateScoreCard',
            'OsValuePerVisitScoreCard',
            'OsClickRateScoreCard',
            'OsMostValuableScoreCard',
            'OsOpenRateScoreCard',
            'BrowserValuePerVisitScoreCard',
            'BrowserClickRateScoreCard',
            'BrowserMostValuableScoreCard',
            'BrowserOpenRateScoreCard'
        ],

        updateOs: function () {
            var osList = this.model.get('osList'),
                osChartData = [];

            if (osList && osList.length) {
                osChartData = ChartDataConversionService.convert(
                    osList,
                    { keys: ['click', 'open'] }
                );
            }

            this.children.OsBarChart.set("dynamicData", osChartData);
        },

        updateBrowsers: function () {
            var browsers = this.model.get('browsers'),
                browsersChartData = [];

            if (browsers && browsers.length) {
                browsersChartData = ChartDataConversionService.convert(
                    browsers,
                    { keys: ['open'] }
                );
            }

            this.children.BrowserDoughnutChart.set("dynamicData", browsersChartData);
        },

        updateOpenRate: function (type, scoreCardName) {
            var totals = this.model.get('totals'),
                mosts = totals.mosts[type];
            
            if (mosts.openRate) {
                this.children[scoreCardName].set(
                    'value',
                    mosts.openRate.key + ' ' + MathHelper.percentage(mosts.openRate.value.open, totals.sent) + '%'
                );
                this.children[scoreCardName].set(
                    'description',
                    mosts.openRate.value.open + ' ' +
                    sitecore.Resources.Dictionary.translate("ECM.Reporting.Opens").toLowerCase()
                );
            }
        },

        updateClickRate: function (type, scoreCardName) {
            var totals = this.model.get('totals'),
                mosts = totals.mosts[type];

            if (mosts.clickRate) {
                this.children[scoreCardName].set(
                    'value',
                    mosts.clickRate.key + ' ' + MathHelper.percentage(mosts.clickRate.value.click, totals.sent) + '%'
                );
                this.children[scoreCardName].set(
                    'description',
                    mosts.clickRate.value.click + ' ' +
                    sitecore.Resources.Dictionary.translate("ECM.Reporting.Clicks").toLowerCase()
                );
            }
        },

        updateValuable: function (type, scoreCardName) {
            var totals = this.model.get('totals'),
                mosts = totals.mosts[type];

            if (mosts.valuable) {
                this.children[scoreCardName].set(
                    'value',
                    mosts.valuable.key + ' ' + mosts.valuable.value.value
                );

                this.children[scoreCardName].set(
                    'description',
                    mosts.valuable.value.click + ' ' +
                    sitecore.Resources.Dictionary.translate("ECM.Reporting.Clicks").toLowerCase()
                );
            }
        },

        updateValuePerVisit: function (type, scoreCardName) {
            var totals = this.model.get('totals'),
               mosts = totals.mosts[type];

            if (mosts.valuePerVisit) {
                this.children[scoreCardName].set(
                    'value',
                    mosts.valuePerVisit.key + ' ' + MathHelper.divide(mosts.valuePerVisit.value.value, mosts.valuePerVisit.value.click, 2)
                );
                this.children[scoreCardName].set(
                    'description',
                    mosts.valuePerVisit.value.click + ' ' +
                    sitecore.Resources.Dictionary.translate("ECM.Reporting.Clicks").toLowerCase()
                );
            }
        },

        updateDeviceMosts: function () {

            this.updateOpenRate('deviceType', 'DeviceOpenRateScoreCard');

            this.updateClickRate('deviceType', 'DeviceClickRateScoreCard');

            this.updateValuable('deviceType', 'DeviceMostValuableScoreCard');

            this.updateValuePerVisit('deviceType', 'DeviceValuePerVisitScoreCard');
        },

        updateBrowserMosts: function() {
            this.updateOpenRate('browser', 'BrowserOpenRateScoreCard');

            this.updateClickRate('browser', 'BrowserClickRateScoreCard');

            this.updateValuable('browser', 'BrowserMostValuableScoreCard');

            this.updateValuePerVisit('browser', 'BrowserValuePerVisitScoreCard');
        },

        updateOsMosts: function () {
            this.updateOpenRate('os', 'OsOpenRateScoreCard');

            this.updateClickRate('os', 'OsClickRateScoreCard');

            this.updateValuable('os', 'OsMostValuableScoreCard');

            this.updateValuePerVisit('os', 'OsValuePerVisitScoreCard');
        },

        attachHandlers: function () {
            this._super();

            this.model.on({
                'change:totals': function () {
                    this.updateDeviceMosts();
                    this.updateBrowserMosts();
                    this.updateOsMosts();
                },
                'change:osList': this.updateOs,
                'change:browsers': this.updateBrowsers
            }, this);
        }
    });

    return sitecore.Factories.createComponent("TechnologyReportExtended", model, view, ".sc-TechnologyReportExtended");
});