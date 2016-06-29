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
            this.getFromDatePicker().on("change:formattedDate", this.updateToDatePickerLimit, this);
            this.getToDatePicker().on("change:formattedDate", this.updateFromDatePickerLimit, this);

            this.setupDefaultDates();
        },

        setupDefaultDates: function () {
            var dateRange;

          try {
            dateRange = pathAnalyzer.getDateRange() || {};
          } catch (e) {
            pathAnalyzer.showMessage(this.app.DashboardMessageBar, "notification", { text: this.$el.data("sc-errormessages").InvalidDate, id: "" });
               dateRange = {};
            }

            if (dateRange.dateFrom != null)
              this.setFromDatePickerDate(dateRange.dateFrom);

            if(dateRange.dateTo != null)
              this.setToDatePickerDate(dateRange.dateTo);

            this.updateRadioButtons();

            this.setGlobalDateRange(dateRange.dateFrom, dateRange.dateTo);
        },

        createPresets: function () {
            var picker = $('<div />').datepicker(),
              presets = this.dates.presets,
              dateFormat = "yymmddT000000",
              now = new Date();

            picker.datepicker("setDate", now);
            //if we don't explicitly format the date, the datepicker will always return a time component, which we don't want.
            presets.today = $.datepicker.formatDate(dateFormat, picker.datepicker("getDate"));

            picker.datepicker("setDate", now);
            picker.datepicker("setDate", "+1d");
            presets.tomorrow = $.datepicker.formatDate(dateFormat, picker.datepicker("getDate"));

            picker.datepicker("setDate", now);
            picker.datepicker("setDate", "-1d");
            presets.yesterday = $.datepicker.formatDate(dateFormat, picker.datepicker("getDate"));

            picker.datepicker("setDate", now);
            picker.datepicker("setDate", "-1d-1w");
            presets.lastWeek = $.datepicker.formatDate(dateFormat, picker.datepicker("getDate"));

            picker.datepicker("setDate", now);
            picker.datepicker("setDate", "-1d-1m");
            presets.lastMonth = $.datepicker.formatDate(dateFormat, picker.datepicker("getDate"));

            picker.datepicker("setDate", now);
            picker.datepicker("setDate", "-1d-3m");
            presets.lastQuarter = $.datepicker.formatDate(dateFormat, picker.datepicker("getDate"));

            picker.datepicker("setDate", now);
            picker.datepicker("setDate", "-1d-6m");
            presets.lastTwoQuarter = $.datepicker.formatDate(dateFormat, picker.datepicker("getDate"));

            picker.datepicker("setDate", now);
            picker.datepicker("setDate", "-1d-1y");
            presets.lastYear = $.datepicker.formatDate(dateFormat, picker.datepicker("getDate"));
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
                tomorrow: null,
                today: null,
                yesterday: null,
                lastWeek: null,
                lastMonth: null,
                lastQuarter: null,
                lastTwoQuarter: null,
                lastYear: null
            },

            removeTimeComponent: function (date) {
              if (date.indexOf('T') !== -1) {
                return date.substring(0, date.indexOf('T'));
              }
              return date;
            },

            resetTimeComponent: function(date) {
              if (date.indexOf('T') !== -1) {
                date = this.removeTimeComponent(date);
                return date + 'T000000';
              }
              return date;
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
                case "today":
                    this.setFromDatePickerDate(presets.today);
                    this.setToDatePickerDate(presets.tomorrow);
                    break;
                case "yesterday":
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
            this.getFromDatePicker().set("date", date);
        },

        setToDatePickerDate: function (date) {
            this.getToDatePicker().set("date", date);
        },

        updateFromDatePicker: function (model, value) {
          this.setFromDatePickerDate(value);
        },

        updateToDatePicker: function (model, value) {
          this.setToDatePickerDate(value);
        },

        updateToDatePickerLimit: function (model, value) {
            this.getToDatePicker().viewModel.$el.datepicker("option", "minDate", value);
            this.updateRadioButtons();
        },

        updateFromDatePickerLimit: function (model, value) {
            this.getFromDatePicker().viewModel.$el.datepicker("option", "maxDate", value);
            this.updateRadioButtons();
        },

        updateRadioButtons: function () {
            var toDate = this.getToDatePicker().get("date"),
                fromDate = this.getFromDatePicker().get("date");

            if (toDate == null || fromDate == null) {
                return;
            }

            //preset dates have a time component of 'T000000'
            //dates from the datepickers will include a specific time, e.g. 'T123000'
            //need to reset the time component from the date picker date so that the comparison to preset dates is accurate
            toDate = this.dates.resetTimeComponent(toDate);
            fromDate = this.dates.resetTimeComponent(fromDate);

            var isToToday = this.dates.presets.today === toDate,
              isToTomorrow = this.dates.presets.tomorrow === toDate,
              isFromToday = this.dates.presets.today === fromDate,
              isFromYesterday = this.dates.presets.yesterday === fromDate,
              isLastWeek = this.dates.presets.lastWeek === fromDate,
              isLastMonth = this.dates.presets.lastMonth === fromDate,
              isLastQuarter = this.dates.presets.lastQuarter === fromDate,
              isLastTwoQuarter = this.dates.presets.lastTwoQuarter === fromDate,
              isLastYear = this.dates.presets.lastYear === fromDate;

            this.$el.find(".sc-radiobutton-input:checked").prop("checked", false);

            if (isToToday || isFromToday) {
                var inputValue = "";
                if (isFromToday && isToTomorrow) {
                  inputValue = "today";
                } else if (isFromYesterday) {
                    inputValue = "yesterday";
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

        setGlobalDateRange: function (fromDate, toDate) {
            if (fromDate == null) {
              var fromDatePicker = this.getFromDatePicker();
              fromDate = fromDatePicker.get("date");
            }
            if (toDate == null) {
              var toDatePicker = this.getToDatePicker();
              toDate = toDatePicker.get("date");
            }

            pathAnalyzer.setDateRange(fromDate, toDate);
        },

        getFromDatePicker: function () {
            return this.app[this.model.get('name') + "FromDatePicker"];
        },

        getToDatePicker: function () {
            return this.app[this.model.get('name') + "ToDatePicker"];
        }
    });
});
