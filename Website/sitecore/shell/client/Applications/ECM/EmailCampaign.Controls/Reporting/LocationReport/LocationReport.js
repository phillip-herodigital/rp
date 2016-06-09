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
            this.set('countries', this.getCountries());
            this.set('regions', this.getRegions());
            this.set('cities', this.getCities());
            this.set('bestClickCountry', this.getBestClickRateCountry());
            this.set('mostValuableCountry', this.getMostValuableCountry());
        },

        getCountryGroup: function() {
            return this.get('dataSource')
                .dimension('country')
                .group({
                    open: { $sum: 'visits', condition: { event: Constants.Reporting.Events.OPEN } },
                    click: { $sum: 'visits', condition: { event: Constants.Reporting.Events.CLICK } },
                    value: '$sum'
                });
        },

        getRegionGroup: function () {
            return this.get('dataSource')
                .dimension('region')
                .group({
                    open: { $sum: 'visits', condition: { event: Constants.Reporting.Events.OPEN } },
                    click: { $sum: 'visits', condition: { event: Constants.Reporting.Events.CLICK } }
                });
        },

        getCityGroup: function () {
            return this.get('dataSource')
                .dimension('city')
                .group({
                    open: { $sum: 'visits', condition: { event: Constants.Reporting.Events.OPEN } },
                    click: { $sum: 'visits', condition: { event: Constants.Reporting.Events.CLICK } }
                });
        },

        updateGroups: function() {
            this.groups = {
                country: this.getCountryGroup(),
                region: this.getRegionGroup(),
                city: this.getCityGroup()
            };
        },

        getBestClickRateCountry: function () {
            var bestClickRateCountry = this.groups.country.order(function (group) {
                return group.click;
            }).top(1)[0];
            return bestClickRateCountry || this.emptyItem();
        },

        getMostValuableCountry: function () {
            var mostValuableCountry = this.groups.country.order(function (group) {
                return new Number(MathHelper.divide(group.value, group.click));
            }).top(1)[0];
            return mostValuableCountry || this.emptyItem();
        },

        getCountries: function() {
            return this.groups.country.orderBy('open').top(Infinity);
        },

        getRegions: function() {
            return this.groups.region.order(function(group) {
                return group.open + group.click;
            }).top(5);
        },
        getCities: function() {
            return this.groups.city.order(function(group) {
                return group.open + group.click;
            }).top(5);
        }
    });

    var view = ReportingBlockBaseTabs.view.extend({
        childComponents: [
            'Tabs',
            'TabContent0',
            'TabContent1',
            'TabContent2',
            'CountriesDoughnutChart',
            'BestClickScoreCard',
            'MostValuableScoreCard',
            'TopRegionsBarChart',
            'TopCitiesBarChart'
        ],

        attachHandlers: function () {
            this._super();
            this.model.on({
                'change:countries': this.updateCountries,
                'change:regions': this.updateRegions,
                'change:cities': this.updateCities,
                'change:bestClickCountry': this.updateBestClickCountry,
                'change:mostValuableCountry': this.updateMostValuableCountry
            }, this);
        },

        updateCountries: function () {
            var countries = this.model.get('countries'),
                countriesChartData = [];
            if (countries && countries.length) {
                countriesChartData = ChartDataConversionService.convert(
                    this.model.get('countries'),
                    { keys: ['open'] }
                );
                /*
                 * Doughnut chart performing percentage calculations, and it breaks if all the values
                 *  are zeros, need to check this.
                 */
                countriesChartData = ChartDataConversionService.isAllZeroValues(countriesChartData) ?
                    [] :
                    countriesChartData;
            }

            this.children.CountriesDoughnutChart.set("dynamicData", countriesChartData);
        },

        updateRegions: function () {
            var regions = this.model.get('regions'),
                regionsChartData = [];
            if (regions && regions.length) {
                regionsChartData = ChartDataConversionService.convert(
                    this.model.get('regions'),
                    { keys: ['click', 'open'] }
                );
            }

            this.children.TopRegionsBarChart.set("dynamicData", regionsChartData);
        },

        updateCities: function () {
            var cities = this.model.get('cities'),
                citiesChartData = [];
            if (cities && cities.length) {
                citiesChartData = ChartDataConversionService.convert(
                    this.model.get('cities'),
                    { keys: ['click', 'open'] }
                );
            }

            this.children.TopCitiesBarChart.set("dynamicData", citiesChartData);
        },

        updateBestClickCountry: function () {
            var bestClickCountry = this.model.get('bestClickCountry');
            this.children.BestClickScoreCard.set('value', bestClickCountry.key);
            this.children.BestClickScoreCard.set(
                'description',
                (bestClickCountry.value.click || 0) +
                ' ' +
                sitecore.Resources.Dictionary.translate("ECM.Reporting.Clicks").toLowerCase()
            );
        },

        updateMostValuableCountry: function() {
            var mostValuableCountry = this.model.get('mostValuableCountry'),
                mostValuableRate = MathHelper.divide(mostValuableCountry.value.value, mostValuableCountry.value.click, 2);
            this.children.MostValuableScoreCard.set('value', mostValuableCountry.key);
            this.children.MostValuableScoreCard.set('description',
                (mostValuableRate || 0) +
                ' ' +
                sitecore.Resources.Dictionary.translate("ECM.Reporting.ValuePerVisit").toLowerCase()
            );
        }
    });

    return sitecore.Factories.createComponent("LocationReport", model, view, ".sc-LocationReport");
});