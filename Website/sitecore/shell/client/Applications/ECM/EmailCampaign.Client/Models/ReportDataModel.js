require.config({
    paths: {
        crossFilter: '/sitecore/shell/client/Applications/ECM/EmailCampaign.Client/Assets/Lib/crossfilter.min'
    },
    shim: {
        'crossFilter': { exports: 'crossfilter' }
    }
});

define([
    'sitecore',
    'backbone',
    'jquery',
    'crossFilter',
    '/-/speak/v1/ecm/DimensionModel.js',
     'jqueryui'
], function(
    sitecore,
    backbone,
    $,
    crossFilter,
    DimensionModel
) {
    var eventTypes = ['open', 'click', 'unsubscribe', 'emailSent', 'emailBounced', 'spamReportedOnEmail'];

    var Dimensions = backbone.Collection.extend({
        model: DimensionModel
    });

    var ReportData = backbone.Model.extend({
        defaults: {
            reportingItems: null,
            name: 'ReportData',
            serverDimensionId: null,
            dateFrom: null,
            dateTo: null,
            contentFields: ['key', 'visits', 'date', 'bounces', 'value', 'count'],
            additionalParams: {},
            keysFromAncestor : null,
            urlRoot: '/sitecore/api/ao/aggregates/all/',
            url: null,
            isBusy: false
        },

        requestParamsDefaults: {
            dateGrouping: 'by-day',
            keyGrouping: 'by-key',
            pademptydates: false
        },

        idAttribute: 'name',

        filter: null,

        initialize: function () {
            this.dimensions = new Dimensions();
            this.filter = crossFilter([]);
            this.attachEventHandlers();
        },

        getEventTypes: function() {
            return eventTypes;
        },

        fetch: function (ajaxOptions) {
            this.set('isBusy', true);
            this._super(ajaxOptions);
        },

        attachEventHandlers: function() {
            var debouncedUpdateUrl = _.debounce(this.updateUrl, 50);
            this.on({
                'change:reportingItems': this.updateFilter,
                'change:requestParams': debouncedUpdateUrl,
                'change:urlRoot': debouncedUpdateUrl,
                'change:serverDimensionId': debouncedUpdateUrl,
                'change:dateFrom': debouncedUpdateUrl,
                'change:dateTo': debouncedUpdateUrl,
                'change:contentFields': debouncedUpdateUrl,
                'change:keysFromAncestor': debouncedUpdateUrl,
                'change:url': this.onChangeUrl
            }, this);
            this.dimensions.on('filtered', function() {
                this.trigger('filtered');
            }, this);
        },

        updateUrl: function () {
            var url = this.get('urlRoot') + this.get('serverDimensionId') + '/all',
                params = _.extend(
                    {},
                    this.requestParamsDefaults,
                    this.get('requestParams'),
                    {
                        dateFrom: $.datepicker.formatDate('dd-mm-yy', this.get('dateFrom')),
                        dateTo: $.datepicker.formatDate('dd-mm-yy', this.get('dateTo')),
                        fields: this.get('contentFields').join(','),
                        keysFromAncestor: this.get('keysFromAncestor')
                    }
                );

            url += '?' + $.param(params);
            this.set('url', url);
        },

        updateFilter: function () {
            this.filter.remove();
            this.filter.add(this.get('reportingItems'));
            this.trigger('filter:updated');
        },

        onChangeUrl: function () {
            this.url = this.get('url');
            var token = sitecore.Helpers.antiForgery.getAntiForgeryToken(),
                ajaxOptions = {
                    headers: {},
                    dataType: "json",
                    // If Experience Analytics responding with 404 error, then need to reset reporting items.
                    error: _.bind(function (e, jqXHR) {
                        if (jqXHR.status === 404) {
                            this.set('reportingItems', []);
                            this.set('isBusy', false);
                        }
                    }, this)
                };

            ajaxOptions.headers[token.headerKey] = token.value;

            this.fetch(ajaxOptions);
        },

        parseKeys: function(keys) {
            _.each(keys, _.bind(function (key, index) {
                key = $.type(key) === 'string' ? JSON.parse(key) : key;
                keys[index] = _.object(this.get('keyFieldNames'), key);
            }, this));
            return keys;
        },

        prepareContentItems: function(items, keys) {
            _.each(items, _.bind(function(contentItem) {
                _.extend(contentItem, keys[contentItem.key] || {});
                this.prepareFields(contentItem);
            }, this));
            return items;
        },

        parse: function(data) {
            data = data.data;
            var items = [];

            if (data) {
                var keys = _.findWhere(data.localization.fields, { field: 'key' }),
                    parsedKeys = this.parseKeys(keys.translations);
                items = this.prepareContentItems(data.content, parsedKeys);
            }
            
            this.set('isBusy', false);

            return { reportingItems: items };
        },

        prepareFields: function(item) {
            item.date = new Date(item.date);
            var month = item.date.getUTCMonth() + 1,
                year = item.date.getUTCFullYear(),
                day = item.date.getUTCDay();
            item.year = new Date(year).getTime();
            item.month = new Date(year, month).getTime();
            item.day = new Date(year, month, day).getTime();
        },

        getDimensionOptions: function(dimension) {
            var options = {};
            switch ($.type(dimension)) {
            case 'string':
                options.name = options.key = dimension;
                break;
            case 'object':
                options.name = dimension.name || dimension.key;
                options.key = dimension.key;
                options.dimensionFunction = dimension.func;
                break;
            }
            return options;
        },

        dimension: function(dimension) {
            var creationOptions = this.getDimensionOptions(dimension);
            if (creationOptions.name && creationOptions.key) {
                var exsistDimension = this.dimensions.findWhere({ name: creationOptions.name });
                if (exsistDimension) {
                    return exsistDimension;
                } else {
                    var dimensionObject = this.filter.dimension(creationOptions.dimensionFunction || function(d) {
                        return d[creationOptions.key];
                    });
                    creationOptions = _.extend({ dimensionObject: dimensionObject }, creationOptions);
                    this.dimensions.add(creationOptions);
                }
                return this.dimensions.findWhere({ name: creationOptions.name });
            }

            return null;
        },

        resetDimensions: function() {
            _.each(this.dimensions, this.resetDimension);
        },

        resetDimension: function(dimension) {
            dimension.resetFilters();
            dimension.resetGroups();
        },

        total: function(key) {
            return this.filter.groupAll().reduceSum($.type(key) === 'function' ? key : function(fact) {
                return fact[key];
            }).value();
        },

        totals: function (arrayOfKeys) {
            var result = {};

            _.each(arrayOfKeys, _.bind(function (key) {
                result[key] = this.total(key);
            }, this));
            return result;
        },

        count: function (dimensionName) {
            return this.dimension(dimensionName).group().size();
        }
    });

    return ReportData;
});