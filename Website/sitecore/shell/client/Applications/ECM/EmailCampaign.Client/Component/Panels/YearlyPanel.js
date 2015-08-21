define(["sitecore", "/-/speak/v1/ecm/NumericInputValidation.js"], function (sitecore, validation) {
  var yearlyPanel = sitecore.Definitions.App.extend({
    yearlyScheduleType: 4,
    isDayOfMonthMode: true,
    contextApp: null,
    initialized: function () {
      sitecore.on("dispatchTab:dispatchDetailsGathering", this.getYearlyDispatchDetails, this);

      sitecore.on("dispatchTab:initialized", function (app) {
        this.contextApp = app;
        this.dispatchTabInitialized();
      }, this);
      sitecore.trigger("ScheduleRecurringDailyPanel:initialized");
    },

    dispatchTabInitialized: function () {
      if (this.YearlyPanelBorder) {
        this.setUpValuesFromContext();
        this.changeDeliveryModeRecurring();

        sitecore.on("change:messageContext", function () {
          this.changeDeliveryModeRecurring();
        }, this);

        this.contextApp.DispatchContext.on("change:hasRecurringSchedule", function () {
          this.changeDeliveryModeRecurring();
        }, this);

        this.contextApp.MessageContext.on("change:isReadOnly", function () {
          this.changeDeliveryModeRecurring();
        }, this);

        this.YearlyAmountTextBox.viewModel.$el.keydown(validation.validate);
        this.YearlyOnDayTextBox.viewModel.$el.keydown(validation.validate);

        this.YearlyOnRadioButton.on("change:isChecked", function () {
          var disabled = this.contextApp.MessageContext.get("isReadonly") || !this.contextApp.DispatchContext.get("hasRecurringSchedule");
          if (!disabled) {
            this.switchMode();
          }
        }, this);

        this.contextApp.DispatchContext.on("change:isBusy", function () {
          this.setUpValuesFromContext();
        }, this);
      }
    },

    switchMode: function () {
      if (this.YearlyPanelBorder) {
        this.isDayOfMonthMode = this.YearlyOnRadioButton.get("isChecked");
        if (this.isDayOfMonthMode) {
          this.YearlyCounterComboBox.set("isEnabled", false);
          this.YearlyDaysOfWeekComboBox.set("isEnabled", false);
          this.YearlyMonthComboBox2.set("isEnabled", false);

          this.YearlyOnDayTextBox.set("isEnabled", true);
          this.YearlyMonthComboBox.set("isEnabled", true);
        } else {
          this.YearlyCounterComboBox.set("isEnabled", true);
          this.YearlyDaysOfWeekComboBox.set("isEnabled", true);
          this.YearlyMonthComboBox2.set("isEnabled", true);

          this.YearlyOnDayTextBox.set("isEnabled", false);
          this.YearlyMonthComboBox.set("isEnabled", false);
        }
      }
    },


    getYearlyDispatchDetails: function (dispatchDetails) {
      if (this.YearlyPanelBorder) {
        if (!dispatchDetails.recurringSchedule) {
          dispatchDetails.recurringSchedule = {};
        }

        dispatchDetails.recurringSchedule.scheduleType = this.yearlyScheduleType;
        dispatchDetails.recurringSchedule.yearly = {};
        dispatchDetails.recurringSchedule.daily = null;
        dispatchDetails.recurringSchedule.weekly = null;
        dispatchDetails.recurringSchedule.monthly = null;

        dispatchDetails.recurringSchedule.validation = {};
        dispatchDetails.recurringSchedule.validation.errors = [];
        dispatchDetails.recurringSchedule.validation.isValid = true;

        var every = this.YearlyAmountTextBox.get("text");
        dispatchDetails.recurringSchedule.yearly.every = every;

        if (typeof every === "undefined" || every === null || every === "") {
          dispatchDetails.recurringSchedule.validation.isValid = false;
        }

        if (this.isDayOfMonthMode) {
          var dayOfMonth = this.YearlyOnDayTextBox.get("text");
          dispatchDetails.recurringSchedule.yearly.dayOfMonth = dayOfMonth;
          dispatchDetails.recurringSchedule.yearly.month = this.YearlyMonthComboBox.get("selectedValue");

          if (typeof dayOfMonth === "undefined" || dayOfMonth === null || dayOfMonth === "") {
            dispatchDetails.recurringSchedule.validation.isValid = false;
          }
        } else {
          dispatchDetails.recurringSchedule.yearly.weekOfMonth = this.YearlyCounterComboBox.get("selectedValue");
          dispatchDetails.recurringSchedule.yearly.days = this.YearlyDaysOfWeekComboBox.get("selectedValue");
          dispatchDetails.recurringSchedule.yearly.month = this.YearlyMonthComboBox2.get("selectedValue");
        }
        
        if (dispatchDetails.recurringSchedule.validation.isValid === false) {
          dispatchDetails.recurringSchedule.validation.errors.push("ECM.Pages.Message.PleaseFillAllRequiredFields");
        }
      }
    },

    setUpValuesFromContext: function () {
      if (this.YearlyPanelBorder) {
        var dispatchContext = this.contextApp.DispatchContext,
           recurringSchedule = dispatchContext.get("recurringSchedule");

        if (dispatchContext.get("isBusy") || !dispatchContext.get("hasRecurringSchedule") || !recurringSchedule) {
          return;
        }

        if (recurringSchedule.scheduleType === 0) {
          return;
        }

        var yearly = recurringSchedule.yearly;
        if (!yearly) {
          return;
        }

        this.YearlyAmountTextBox.set("text", yearly.every);

        this.isDayOfMonthMode = yearly.weekOfMonth === 0;
        if (this.isDayOfMonthMode) {
          this.YearlyOnDayTextBox.set("text", yearly.dayOfMonth);

          this.YearlyMonthComboBox.on("change:items", function (combobox) {
            this.setSelectedItem(combobox, yearly.month);
          }, this);

          this.YearlyOnRadioButton.set("isChecked", true);
        } else {

          this.YearlyCounterComboBox.on("change:items", function (combobox) {
            this.setSelectedItem(combobox, yearly.weekOfMonth);
          }, this);

          this.YearlyDaysOfWeekComboBox.on("change:items", function (combobox) {
            this.setSelectedItem(combobox, yearly.days);
          }, this);

          this.YearlyMonthComboBox2.on("change:items", function (combobox) {
            this.setSelectedItem(combobox, yearly.month);
          }, this);

          this.YearlyOnTheRadioButton.set("isChecked", true);
        }
      }
    },

    setSelectedItem: function (combobox, value) {
      var items = combobox.get("items");
      var item = items.filter(function (e) {
        return e.Value === value.toString();
      })[0];
      if (typeof item !== "undefined") {
        combobox.set("selectedItem", item);
      }
    },

    changeDeliveryModeRecurring: function () {
      if (this.YearlyPanelBorder) {
        if (!this.contextApp) {
          return;
        }

        var disabled = this.contextApp.MessageContext.get("isReadonly") || !this.contextApp.DispatchContext.get("hasRecurringSchedule");

        this.YearlyPanelBorder.viewModel.$el.find('*').attr('disabled', disabled);
        this.YearlyCounterComboBox.set("isEnabled", !disabled);
        this.YearlyDaysOfWeekComboBox.set("isEnabled", !disabled);
        this.YearlyMonthComboBox2.set("isEnabled", !disabled);
        this.YearlyMonthComboBox.set("isEnabled", !disabled);
        this.YearlyOnRadioButton.set("isEnabled", !disabled);
        this.YearlyOnTheRadioButton.set("isEnabled", !disabled);
        this.YearlyAmountTextBox.set("isEnabled", !disabled);
        this.YearlyOnDayTextBox.set("isEnabled", !disabled);
        if (!disabled) {
          this.switchMode();
        }
      }
    }
  });

  return yearlyPanel;
});