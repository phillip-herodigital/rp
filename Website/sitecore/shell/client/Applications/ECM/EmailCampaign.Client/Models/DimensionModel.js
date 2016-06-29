define(['backbone', '/-/speak/v1/ecm/FilterHelper.js'], function(backbone, FilterHelper) {
    var ChartDimension = backbone.Model.extend({
        defaults: {
            dimensionFunction: null,
            dimensionObject: null,
            name: null,
            key: null,
            filter: null
        },

        initialize: function() {
            this.groups = [];
        },
        /*
     * 'Denmark' - exect value
     * {$gt: 100, $lt: 200} - greater then 100, less then 200
     * ['Sweden', 'Denmark', 'Germany'] - array of vlues which will be filtered
     * function (value) { value.length > 5; } - filtering function
     */
        addFilter: function(filter) {
            var dimensionObject = this.get('dimensionObject');

            switch ($.type(filter)) {
            case 'array':
                dimensionObject.filterFunction(_.bind(FilterHelper.filters.arrayOfValues, this, filter));
                break;
            case 'object':
                dimensionObject.filterFunction(_.bind(FilterHelper.filters.greaterOrLess, this, filter));
                break;
            case 'function':
                dimensionObject.filterFunction(filter);
                break;
            default:
                dimensionObject.filter(filter);
                break;
            }
            this.trigger('filtered');
        },

        resetFilters: function() {
            this.get('dimensionObject').filterAll();
        },

        resetGroups: function() {
            this.get('dimensionObject').groupAll();
        },

        findGroup: function(options) {
            for (var index in this.groups) {
                if (_.isEqual(this.groups[index].options, options)) {
                    return this.groups[index].groupObject;
                }
            }
            return null;
        },

        /*
         * {
         *     value: '$sum',
         *     country: '$any'
         *     open: { $sum: 'visits', condition: { event: 2 } }
         *     click: { $sum: 'visits', condition: function (item) { return item.event === 1 } }
         * }
         */
        group: function (options) {
            var existingGroup = this.findGroup(options);

            if (existingGroup) {
                return existingGroup;
            }

            var reduceAdd = _.bind(FilterHelper.groups.reduceAdd, this, options),
                reduceRemove = _.bind(FilterHelper.groups.reduceRemove, this, options),
                reduceInitial = _.bind(FilterHelper.groups.reduceInitial, this, options),
                groupObject = this.get('dimensionObject').group().reduce(reduceAdd, reduceRemove, reduceInitial);

            _.extend(groupObject, {
                orderBy: function (key) {
                    return groupObject.order(function (group) {
                        return group[key];
                    });
                }
            });

            this.groups.push({ options: options, groupObject: groupObject });

            return groupObject;
        }
    });

    return ChartDimension;
});