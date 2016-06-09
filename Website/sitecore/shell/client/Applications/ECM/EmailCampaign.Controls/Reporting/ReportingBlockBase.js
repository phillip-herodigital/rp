define([
    "sitecore",
    "/-/speak/v1/ecm/CompositeComponentBase.js"
], function (sitecore, CompositeComponentBase) {
    var model = sitecore.Definitions.Models.ControlModel.extend({
        defaults: {
            dataSource: null
        },

        initialize: function() {
            this.attachHandlers();
        },

        attachHandlers: function () {
            this.attachDataSourceHandlers();
            this.on('change:dataSource', _.bind(this.attachDataSourceHandlers, this, null));
        },

        attachDataSourceHandlers: function (dataSourceName) {
            dataSourceName = dataSourceName || 'dataSource';
            var previousDataSource = this.previous(dataSourceName),
                currentDataSource = this.get(dataSourceName);

            if (previousDataSource) {
                previousDataSource.off(null, null, this);
            }

            if (currentDataSource) {
                currentDataSource.on('filter:updated filtered', this.getDebouncedReCalculate(), this);
            }
        },

        emptyItem: function () {
            return {
                key: '',
                value: {}
            }
        },

        getDebouncedReCalculate: function () {
            this.debouncedReCalculateFunc = this.debouncedReCalculateFunc || _.debounce(this.reCalculate, 50);
            return this.debouncedReCalculateFunc;
        },

        reCalculate: function() {
            
        }
    });

    var view = CompositeComponentBase.view.extend({
        initialize: function () {
            this._super();
            this.attachHandlers();
        },

        attachHandlers: function() {
            this.attachDataSourceHandlers();
            this.model.on('change:dataSource', _.bind(this.attachDataSourceHandlers, this, null));
        },

        attachDataSourceHandlers: function (dataSourceName) {
            dataSourceName = dataSourceName || 'dataSource';
            var previousDataSource = this.model.previous(dataSourceName),
                currentDataSource = this.model.get(dataSourceName);

            if (previousDataSource) {
                previousDataSource.off(null, null, this);
            }

            if (currentDataSource) {
                currentDataSource.on('change:isBusy', this.onChangeDataSourceIsBusy, this);
            }
        },

        onChangeDataSourceIsBusy: function () {
            var dataSource = this.model.get('dataSource');

            if (dataSource) {
                this.app[this.id + 'Card'].set('isBusy', dataSource.get('isBusy'));
            }
        }
    });

    return { model: model, view: view };
});