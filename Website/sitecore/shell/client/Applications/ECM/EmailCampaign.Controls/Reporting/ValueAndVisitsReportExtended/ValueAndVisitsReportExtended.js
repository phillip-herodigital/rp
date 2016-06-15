define([
    'sitecore',
    '/-/speak/v1/ecm/ValueAndVisitsReport.js'
], function (sitecore, ValueAndVisitsReport) {
    var model = ValueAndVisitsReport.model.extend({
        // Filling in empty dates.
        getMonthActivity: function () {
            var monthActivity = this._super(),
                minimumAmountOfMonths = 6;

            if (monthActivity.length && monthActivity.length < minimumAmountOfMonths) {
                var earliestDate = new Date(),
                    earliestDateTime = monthActivity[0].key,
                    monthActivityLength = monthActivity.length;
                earliestDate.setTime(earliestDateTime);

                for (var i = 0; i < minimumAmountOfMonths - monthActivityLength; i++) {
                    earliestDate.setMonth(earliestDate.getMonth() - 1);
                    var date = new Date();
                    date.setTime(earliestDate.getTime());
                    monthActivity.unshift({
                        key: date,
                        value: {
                            click: 0,
                            itemsCount: 0,
                            value: 0,
                            valuePerVisit: 0,
                            month: earliestDate.getTime()
                        }
                    });
                }
            }
            return monthActivity;
        }
    });

    var view = ValueAndVisitsReport.view.extend({ });

    return sitecore.Factories.createComponent("ValueAndVisitsReportExtended", model, view, ".sc-ValueAndVisitsReportExtended");
});