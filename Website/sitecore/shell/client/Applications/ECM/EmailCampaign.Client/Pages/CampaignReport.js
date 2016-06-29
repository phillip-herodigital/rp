define([
  "sitecore",
  'backbone',
  "/-/speak/v1/ecm/constants.js",
  "/-/speak/v1/ecm/MessageReport.js",
  "/-/speak/v1/ecm/UrlService.js",
  "/-/speak/v1/ecm/ServerRequest.js",
  "/-/speak/v1/ecm/DialogService.js",
  '/-/speak/v1/ecm/ReportDataModel.js',
  '/-/speak/v1/ecm/ReportDataService.js'
], function (
  sitecore,
  backbone,
  Constants,
  MessageReport,
  urlService,
  ServerRequest,
  DialogService,
  ReportDataModel,
  ReportDataService
  ) {
  var ReportDataCollection = backbone.Collection.extend({
    model: ReportDataModel
  });

    var messageReport = MessageReport.extend({
        initialized: function() {
            this._super();

            this.set('keysFromAncestor', null);
            this.initReports();
            this.attachHandlers();
            this.getKeysFormAncestor();
        },

        getKeysFormAncestor: function() {
            ReportDataService.getKeysFormAncestor({
                    managerRootId: this.EmailManagerRoot.get('managerRoot').id,
                    messageId: this.MessageContext.get('messageId')
                })
                .done(_.bind(function(key) {
                    this.set('keysFromAncestor', key);
                }, this));
        },

        attachHandlers: function() {
            this.on({
                'change:keysFromAncestor': this.updateReports
            }, this);
        },

        initReports: function() {
            this.initDataSources();

            this.RecipientActivityReportExtended.set('dataSource', this.dataSources.get('byMessage'));
            this.LandingPagesReport.set('dataSource', this.dataSources.get('byUrl'));
            this.ValueAndVisitsReportExtended.set('dataSource', this.dataSources.get('byMessage'));
            this.LocationReport.set('dataSource', this.dataSources.get('byLocation'));
            this.TechnologyReportExtended.set('dataSource', this.dataSources.get('byDevice'));
            this.TechnologyReportExtended.set('byMessageDataSource', this.dataSources.get('byMessage'));
            
        },

        initDataSources: function() {
            this.dataSources = new ReportDataCollection([
                {
                    name: 'byMessage',
                    keyFieldNames: ['managerRootId', 'messageId', 'messageName', 'event', 'language'],
                    serverDimensionId: '7558FC89-C25F-4606-BBC5-43B91A382AC9',
                    keysFromAncestor: this.get('keysFromAncestor'),
                    requestParams: {
                        dateGrouping: 'by-month',
                        pademptydates: true
                    }
                },
                {
                    name: 'byUrl',
                    keyFieldNames: ['managerRootId', 'messageId', 'url', 'event'],
                    serverDimensionId: 'C1745F34-F2B9-4AC3-A6DE-FAEE8CE62AE1',
                    keysFromAncestor: this.get('keysFromAncestor')
                },
                {
                    name: 'byLocation',
                    'keyFieldNames': ['managerRootId', 'messageId', 'event', 'country', 'region', 'city'],
                    serverDimensionId: '1F031117-B5A9-41EA-B0CB-6D8A759E8968',
                    keysFromAncestor: this.get('keysFromAncestor')
                },
                {
                    name: 'byDevice',
                    keyFieldNames: ['managerRootId', 'messageId', 'event', 'deviceType', 'deviceModel', 'browser', 'os'],
                    serverDimensionId: '0FC2E978-1623-4723-A747-DF4A56EA8518',
                    keysFromAncestor: this.get('keysFromAncestor')
                }
            ]);
        },

        updateReports: _.debounce(function() {
            var byMessage = this.dataSources.get('byMessage'),
                byUrl = this.dataSources.get('byUrl'),
                byLocation = this.dataSources.get('byLocation'),
                byDevice = this.dataSources.get('byDevice'),
                keysFromAncestor = this.get('keysFromAncestor');

            byMessage.set('keysFromAncestor', keysFromAncestor);

            byUrl.set('keysFromAncestor', keysFromAncestor);

            byLocation.set('keysFromAncestor', keysFromAncestor);

            byDevice.set('keysFromAncestor', keysFromAncestor);
        }, 50)
});


  return messageReport;
});