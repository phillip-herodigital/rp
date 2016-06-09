Sitecore.Speak.D3 = Sitecore.Speak.D3 || {};
Sitecore.Speak.D3.models = Sitecore.Speak.D3.models || {};

(function (models) {
    var defaults = {
        maximumFractionDigits: 2
    }
    /**
     * In order to use a different formmating module than Globalize.js
     * you need to redefine models.formatterConfig specifying a new date, currency, number formatter function       
     */
    models.formatterConfig = {
        dateFormatter: function (options) {
            return function (value) {
                return $.datepicker.formatDate('M yy', value);
            };
        },
        currencyFormatter: function (options) { return function (value) { return value; }; },
        numberFormatter: function (options) {
            return function (value) {
                value = value || 0;
                if (options.style === "percent") {
                    value = parseFloat((value * 100).toFixed(options.maximumFractionDigits)) + '%';
                } else {
                    /* SPEAK 1 does not contain data formating templates, as result 
                     *    it's impossible to pass options into formatting methods, 
                     *    so was decided to have global formatting for all charts in ExM.
                     *    For float numbers needed only 2 digits after dot.
                     */
                    value = parseFloat(value.toFixed(defaults.maximumFractionDigits));
                }

                return value;
            };
        },
        metricsFormatter: function (options) {
            return function (value) {
                return models.metricsFormatter.getFormattedString(
                  value,
                  options.numberScale,
                  options.numberScaleUnits,
                  options.numberScaleValues);
            };
        }
    };
}(Sitecore.Speak.D3.models));