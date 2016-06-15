define([
    'sitecore',
    'backbone',
    '/-/speak/v1/ecm/ListPageBase.js',
    '/-/speak/v1/ecm/ReportDataModel.js',
    '/-/speak/v1/ecm/ServerRequest.js',
    '/-/speak/v1/ecm/constants.js',
    '/-/speak/v1/ecm/ReportDataService.js'
], function (
    sitecore,
    backbone,
    ListPageBase,
    ReportDataModel,
    ServerRequest,
    constants,
    ReportDataService
) {

    var ReportDataCollection = backbone.Collection.extend({
        model: ReportDataModel
    });

    return ListPageBase.extend({

        initialized: function () {
            this._super();

            this.set('keysFromAncestor', null);
            this.initReports();
            this.attachHandlers();
            this.getKeysFormAncestor();

            this.setDateRangeButtonText();
        },

        getKeysFormAncestor: function() {
            ReportDataService.getKeysFormAncestor({ managerRootId: this.EmailManagerRoot.get('managerRoot').id })
                .done(_.bind(function (key) {
                    this.set('keysFromAncestor', key);
                }, this));
        },

        attachHandlers: function() {
            this.on({
                'change:keysFromAncestor': this.updateReports
            }, this);
            this.DateRangeFilterSubmitButton.on("click", this.onApplyDateRange, this);
            this.DateRangeFilterResetButton.on("click", this.onApplyDateRange, this);
            this.EmailManagerRoot.on("change:managerRootId", this.getKeysFormAncestor, this);
        },

        initReports: function() {
            this.initDataSources();

            this.TopCampaignsReport.set('dataSource', this.dataSources.get('byMessage'));
            this.RecipientActivityReport.set('dataSource', this.dataSources.get('byMessage'));
            this.ValueAndVisitsReport.set('dataSource', this.dataSources.get('byMessage'));
            this.LandingPagesReport.set('dataSource', this.dataSources.get('byUrl'));
            this.LocationReport.set('dataSource', this.dataSources.get('byLocation'));
            this.TechnologyReport.set('dataSource', this.dataSources.get('byDevice'));
        },

        getDateRange: function() {
            var fromDatePicker = this.DateRangeFilter.viewModel.getFromDatePicker(),
                toDatePicker = this.DateRangeFilter.viewModel.getToDatePicker();
            return {
                fromDate: fromDatePicker.viewModel.getDate(),
                toDate: toDatePicker.viewModel.getDate()
            }
        },

        initDataSources: function () {
            this.dataSources = new ReportDataCollection([
                {
                    name: 'byMessage', 
                    keyFieldNames: ['managerRootId', 'messageId', 'messageName', 'event', 'language'],
                    serverDimensionId: '7558FC89-C25F-4606-BBC5-43B91A382AC9',
                    requestParams: {
                        dateGrouping: 'by-month',
                        pademptydates: true
                    }
                },
                {
                    name: 'byUrl',
                    keyFieldNames: ['managerRootId', 'messageId', 'url', 'event'],
                    serverDimensionId: 'C1745F34-F2B9-4AC3-A6DE-FAEE8CE62AE1'
                },
                {
                    name: 'byLocation',
                    'keyFieldNames': ['managerRootId', 'messageId', 'event', 'country', 'region', 'city'],
                    serverDimensionId: '1F031117-B5A9-41EA-B0CB-6D8A759E8968'
                },
                {
                    name: 'byDevice',
                    keyFieldNames: ['managerRootId', 'messageId', 'event', 'deviceType', 'deviceModel', 'browser', 'os'],
                    serverDimensionId: '0FC2E978-1623-4723-A747-DF4A56EA8518'
                }
            ]);
        },

        updateReports: _.debounce(function () {
            var byMessage = this.dataSources.get('byMessage'),
                byUrl = this.dataSources.get('byUrl'),
                byLocation = this.dataSources.get('byLocation'),
                byDevice = this.dataSources.get('byDevice'),
                keysFromAncestor = this.get('keysFromAncestor'),
                dateRange = this.getDateRange();

            byMessage.set('dateFrom', dateRange.fromDate);
            byMessage.set('dateTo', dateRange.toDate);
            byMessage.set('keysFromAncestor', keysFromAncestor);

            byUrl.set('dateFrom', dateRange.fromDate);
            byUrl.set('dateTo', dateRange.toDate);
            byUrl.set('keysFromAncestor', keysFromAncestor);

            byLocation.set('dateFrom', dateRange.fromDate);
            byLocation.set('dateTo', dateRange.toDate);
            byLocation.set('keysFromAncestor', keysFromAncestor);

            byDevice.set('dateFrom', dateRange.fromDate);
            byDevice.set('dateTo', dateRange.toDate);
            byDevice.set('keysFromAncestor', keysFromAncestor);
        }, 50),

        setDateRangeButtonText: _.debounce(function () {
            this.DateRangeDropDownButton.set("isOpen", false);
            this.DateRangeDropDownButton.set("text", this.DateRangeFilter.get("fromDate") + " - " + this.DateRangeFilter.get("toDate"));
        }, 50),

        onApplyDateRange: function() {
            this.setDateRangeButtonText();
            this.updateReports();
        }
    });
});