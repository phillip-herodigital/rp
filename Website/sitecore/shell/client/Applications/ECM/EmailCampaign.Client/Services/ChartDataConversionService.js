define(['sitecore', 'jqueryui'], function(sitecore) {

    var valueConvertors = {
        date: function(date, format) {
            date = new Date(date);
            return $.datepicker.formatDate(format, date);
        }
    };

    var chartDataKeysMapping = {
        open: "ECM.Reporting.Opens",
        click: "ECM.Reporting.Clicks"
    };

    function ChartDataConversionService() {
    };

    _.extend(ChartDataConversionService.prototype, {
        /*
     * {dimensionValueConverter: 'date:M yy', keys: [{key: 'visits', title: 'Visits'}]}
     * {keys: ['open', 'click']}
     */
        convert: function(data, options) {
            var converted = [];
            if (data.length) {
                _.each(data, _.bind(function(dataItem) {
                    _.each(options.keys, _.bind(function(mapping, index) {
                        var dimensionValue = dataItem.key,
                            key,
                            title;

                        if (options.dimensionValueConverter) {
                            dimensionValue = this.convertDimensionValue(dimensionValue, options.dimensionValueConverter);
                        }

                        if ($.type(mapping) === 'string') {
                            title = sitecore.Resources.Dictionary.translate(chartDataKeysMapping[mapping]);
                            key = mapping;
                        } else if ($.type(mapping) === 'object') {
                            title = mapping.title;
                            key = mapping.key;
                        }

                        converted[index] = converted[index] || { key: title, values: [] };
                        converted[index].values.push({ x: dimensionValue, y: dataItem.value[key] });

                    }, this));
                }, this));
            } else {
                return null;
            }
            
            return converted;
        },

        convertDimensionValue: function(dimensionValue, converter) {
            var converter = converter.split(':'),
                converterName = converter[0],
                converterArg = converter[1];
            return valueConvertors[converterName](dimensionValue, converterArg);
        },

        getEmptyChartData: function() {
            return [{ key: ' ', values: [{ x: ' ', y: 0 }] }];
        },

        isAllZeroValues: function(data) {
            var isAllZeroValues = true;
            _.each(data, function(dataItem) {
                var zeros = _.filter(dataItem.values, function(value) {
                    return !value.y;
                });

                if (zeros.length !== dataItem.values.length) {
                    isAllZeroValues = false;
                }
            });
            return isAllZeroValues;
        }
    });

    return new ChartDataConversionService();
});