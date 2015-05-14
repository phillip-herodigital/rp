define(["sitecore", "/-/speak/v1/pathanalyzer/PathAnalyzer.js"], function (Sitecore, pathAnalyzer) {

    Sitecore.Factories.createBaseComponent({
        name: "DateRangeFilter",
        base: "ControlBase",
        selector: ".sc-DateRangeFilter",
        attributes: [
          { name: "fromDate", value: "" },
          { name: "toDate", value: "" }
        ],

        events: {
            "click .sc-radiobutton-input": "selectPreset"
        },

        initialize: function () {
        },

        afterRender: function () {
            this.createPresets();

            this.getToDatePicker().viewModel.$el.datepicker("option", "maxDate", "+1d");

            this.model.on("change:fromDate", this.updateFromDatePicker, this);
            this.model.on("change:toDate", this.updateToDatePicker, this);
            this.getFromDatePicker().on("change:formattedDate", this.updateFromDateAndToDatePickerLimit, this);
            this.getToDatePicker().on("change:formattedDate", this.updateToDateAndFromDatePickerLimit, this);

            this.setGlobalDateRange();

            // temp workaround for #331 until resolved in SPEAK (U2)
            $(".ui-corner-all").click(function (e) {
                e.stopImmediatePropagation();
            });
        },

        setupDefaultDates: function () {
            var dateRange;

            try {
                dateRange = pathAnalyzer.getDateRange() || {};
            } catch (e) {
                pathAnalyzer.showMessage(this.app.DashboardMessageBar, "notification", this.$el.data("sc-errormessages").InvalidDate);
                dateRange = {};
            }

            this.resetDates(dateRange.dateFrom, dateRange.dateTo);
        },

        createPresets: function () {
            var fromPicker = this.getFromDatePicker(),
                presets = this.dates.presets,
                originalDate = fromPicker.viewModel.getDate();

            fromPicker.viewModel.setDate(new Date());
            presets.today = fromPicker.viewModel.getDate();

            fromPicker.viewModel.setDate("-1d");
            presets.yesterday = fromPicker.viewModel.getDate();

            fromPicker.viewModel.setDate("-1d-1w");
            presets.lastWeek = fromPicker.viewModel.getDate();

            fromPicker.viewModel.setDate("-1d-1m");
            presets.lastMonth = fromPicker.viewModel.getDate();

            fromPicker.viewModel.setDate("-1d-3m");
            presets.lastQuarter = fromPicker.viewModel.getDate();

            fromPicker.viewModel.setDate("-1d-6m");
            presets.lastTwoQuarter = fromPicker.viewModel.getDate();

            fromPicker.viewModel.setDate("-1d-1y");
            presets.lastYear = fromPicker.viewModel.getDate();

            fromPicker.viewModel.setDate(originalDate);
        },

        dates: {
            convert: function (date) {
                return (
                  date.constructor === Date ? date :
                    date.constructor === Array ? new Date(date[0], date[1], date[2]) :
                      date.constructor === Number ? new Date(date) :
                        date.constructor === String ? new Date(date) :
                          typeof date === "object" ? new Date(date.year, date.month, date.date) : NaN
                );
            },

            compare: function (a, b) {
                return (
                  isFinite(a = this.convert(a).valueOf()) &&
                  isFinite(b = this.convert(b).valueOf()) ?
                  (a > b) - (a < b) :
                  NaN
                );
            },

            presets: {
                today: null,
                yesterday: null,
                lastWeek: null,
                lastMonth: null,
                lastQuarter: null,
                lastTwoQuarter: null,
                lastYear: null
            }
        },

        getPresets: function () {
            return this.dates.presets;
        },

        selectPreset: function (event) {
            var scId = $(event.currentTarget).parent(".sc-radiobutton").attr("data-sc-id"),
              radiobutton = this.app[scId];

            this.setDateRangePreset(radiobutton.get("value"));
        },

        setDateRangePreset: function (value) {
            var presets = this.dates.presets;
            this.setToDatePickerDate(presets.today);

            switch (value) {
                case "day":
                    this.setFromDatePickerDate(presets.yesterday);
                    break;
                case "week":
                    this.setFromDatePickerDate(presets.lastWeek);
                    break;
                case "month":
                    this.setFromDatePickerDate(presets.lastMonth);
                    break;
                case "quarter":
                    this.setFromDatePickerDate(presets.lastQuarter);
                    break;
                case "twoquarter":
                    this.setFromDatePickerDate(presets.lastTwoQuarter);
                    break;
                case "year":
                    this.setFromDatePickerDate(presets.lastYear);
                    break;
                default:
                    throw new "Preset: '" + value + "' not recognized.";
            }
        },

        setFromDatePickerDate: function (date) {
            this.getFromDatePicker().viewModel.setDate(date);
        },

        setToDatePickerDate: function (date) {
            this.getToDatePicker().viewModel.setDate(date);
        },

        updateFromDatePicker: function (model, value) {
            this.setFromDatePickerDate(value);
        },

        updateToDatePicker: function (model, value) {
            this.setToDatePickerDate(value);
        },

        updateFromDateAndToDatePickerLimit: function (model, value) {
            this.getToDatePicker().viewModel.$el.datepicker("option", "minDate", value);
            this.updateRadioButtons();
            this.model.set("fromDate", value);
        },

        updateToDateAndFromDatePickerLimit: function (model, value) {
            this.getFromDatePicker().viewModel.$el.datepicker("option", "maxDate", value);
            this.updateRadioButtons();
            this.model.set("toDate", value);
        },

        updateRadioButtons: function () {
            var toDate = this.getToDatePicker().viewModel.getDate(),
              fromDate = this.getFromDatePicker().viewModel.getDate();

            if (toDate === null || fromDate === null) {
                return;
            }

            var isToToday = this.dates.compare(this.dates.presets.today, toDate) === 0,
              isFromYesterday = this.dates.compare(this.dates.presets.yesterday, fromDate) === 0,
              isLastWeek = this.dates.compare(this.dates.presets.lastWeek, fromDate) === 0,
              isLastMonth = this.dates.compare(this.dates.presets.lastMonth, fromDate) === 0,
              isLastQuarter = this.dates.compare(this.dates.presets.lastQuarter, fromDate) === 0,
              isLastTwoQuarter = this.dates.compare(this.dates.presets.lastTwoQuarter, fromDate) === 0,
              isLastYear = this.dates.compare(this.dates.presets.lastYear, fromDate) === 0;

            this.$el.find(".sc-radiobutton-input:checked").prop("checked", false);

            if (isToToday) {
                var inputValue = "";

                if (isFromYesterday) {
                    inputValue = "day";
                } else if (isLastWeek) {
                    inputValue = "week";
                } else if (isLastMonth) {
                    inputValue = "month";
                } else if (isLastQuarter) {
                    inputValue = "quarter";
                } else if (isLastTwoQuarter) {
                    inputValue = "twoquarter";
                } else if (isLastYear) {
                    inputValue = "year";
                }

                this.$el.find(".sc-radiobutton-input[value='" + inputValue + "']").prop("checked", true);
            }
        },

        setGlobalDateRange: function () {
            var fromDate = this.getFromDatePicker().get("formattedDate"), //.model.get("fromDate"),
                toDate = this.getToDatePicker().get("formattedDate");//this.model.get("toDate");

            pathAnalyzer.setDateRange(fromDate, toDate);
        },

        resetDates: function (from, to) {
            this.setToDatePickerDate(to || this.dates.presets.today);
            this.setFromDatePickerDate(from || this.dates.presets.yesterday);
            this.setGlobalDateRange();
        },

        getFromDatePicker: function () {
            return this.app[this.model.get('name') + "FromDatePicker"];
        },

        getToDatePicker: function () {
            return this.app[this.model.get('name') + "ToDatePicker"];
        }
    });
});