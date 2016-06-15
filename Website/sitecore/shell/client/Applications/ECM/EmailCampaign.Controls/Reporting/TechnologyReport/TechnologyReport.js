define([
    "sitecore",
    "/-/speak/v1/ecm/ReportingBlockBaseTabs.js",
    '/-/speak/v1/ecm/ChartDataConversionService.js',
    '/-/speak/v1/ecm/MathHelper.js',
    "/-/speak/v1/ecm/constants.js"
], function (sitecore, ReportingBlockBaseTabs, ChartDataConversionService, MathHelper, Constants) {
    var model = ReportingBlockBaseTabs.model.extend({
        reCalculate: function() {
            this.updateGroups();
            this.updateTotals();
            this.set('devices', this.getDevices());
            this.set('osData', this.getOsData());
            this.set('browsers', this.getBrowsers());

        },

        getDeviceGroup: function() {
            return this.get('dataSource').dimension('deviceType').group({
                open: { $sum: 'visits', condition: { event: Constants.Reporting.Events.OPEN } },
                click: { $sum: 'visits', condition: { event: Constants.Reporting.Events.CLICK } }
            });
        },

        getOsGroup: function() {
            return this.get('dataSource').dimension('os').group({
                open: { $sum: 'visits', condition: { event: Constants.Reporting.Events.OPEN } },
                click: { $sum: 'visits', condition: { event: Constants.Reporting.Events.CLICK } },
                value: '$sum'
            });
        },

        getBrowserGroup: function () {
            return this.get('dataSource').dimension('browser').group({
                open: { $sum: 'visits', condition: { event: Constants.Reporting.Events.OPEN } },
                click: { $sum: 'visits', condition: { event: Constants.Reporting.Events.CLICK } },
                value: '$sum'
            });
        },

        getTotalClicks: function() {
            return this.get('dataSource').total(function(fact) {
                return fact.event === Constants.Reporting.Events.CLICK ? fact.visits : 0;
            });
        },

        getTotalOpens: function() {
            return this.get('dataSource').total(function(fact) {
                return fact.event === Constants.Reporting.Events.OPEN ? fact.visits : 0;
            });
        },

        getDevices: function() {
            return this.groups.deviceType.order(function(group) {
                return group.click + group.open;
            }).top(5);
        },

        getOsData: function() {
            return this.groups.os.orderBy('open').top(Infinity);
        },

        getBrowsers: function() {
            return this.groups.browser.orderBy('open').top(Infinity);
        },

        getTotals: function () {
            return {
                click: this.getTotalClicks(),
                open: this.getTotalOpens(),
                value: this.get('dataSource').total('value')
            }
        },

        updateTotals: function() {
            this.set('totals', this.getTotals());
        },

        updateGroups: function () {
            this.groups = {
                deviceType: this.getDeviceGroup(),
                os: this.getOsGroup(),
                browser: this.getBrowserGroup()
            };
        }
    });

    var view = ReportingBlockBaseTabs.view.extend({
        childComponents: [
            'Tabs',
            'TabContent0',
            'TabContent1',
            'TabContent2',
            'BrowserList',
            'DeviceBarChart',
            'OsList'
        ],

        attachHandlers: function () {
            this._super();
            var debouncedUpdateOs = _.debounce(this.updateOs, 50);
            this.model.on({
                'change:osData': debouncedUpdateOs,
                'change:totals': debouncedUpdateOs,
                'change:devices': this.updateDevices,
                'change:browsers': this.updateBrowsers
            }, this);
        },

        convertDataToBrowsersList: function(data) {
            return _.map(
                data,
                function(item) {
                    return {
                        Browser: item.key,
                        Opens: item.value.open,
                        Clicks: item.value.click,
                        Value: item.value.value
                    };
                }
            );
        },

        convertDataToOsList: function(data) {
            var totals = this.model.get('totals');

            return _.map(
                data,
                function(item) {
                    return {
                        Os: item.key,
                        Opens: item.value.open,
                        Clicks: item.value.click,
                        Value: item.value.value,
                        OpensPercent: MathHelper.percentage(item.value.open, totals.open),
                        ClicksPercent: MathHelper.percentage(item.value.click, totals.click),
                        ValuePercent: MathHelper.percentage(item.value.value, totals.value)
                    };
                }
            );
        },

        updateOs: function() {
            var osListData = this.convertDataToOsList(this.model.get('osData'));
            this.children.OsList.set("items", osListData);
        },

        updateDevices: function () {
            var devices = this.model.get('devices'),
                deviceTypeChartData = [];

            if (devices && devices.length) {
                deviceTypeChartData = ChartDataConversionService.convert(
                    this.model.get('devices'),
                    { keys: ['click', 'open'] }
                );
            }

            this.children.DeviceBarChart.set("dynamicData", deviceTypeChartData);
        },

        updateBrowsers: function() {
            var browsersListData = this.convertDataToBrowsersList(this.model.get('browsers'));
            this.children.BrowserList.set("items", browsersListData);
        }
    });

    sitecore.Factories.createComponent("TechnologyReport", model, view, ".sc-TechnologyReport");
    return { view: view, model: model };
});