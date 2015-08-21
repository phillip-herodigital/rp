define(["sitecore", "/-/speak/v1/ecm/NumericInputValidation.js"], function (sitecore, validation) {
  var monthlyPanel = sitecore.Definitions.App.extend({
    monthlyScheduleType: 3,
    isDayOfMonthMode: true,
    contextApp: null,
    initialized: function () {
      sitecore.on("dispatchTab:dispatchDetailsGathering", this.getMonthlyDispatchDetails, this);

      sitecore.on("dispatchTab:initialized", function (app) {
        this.contextApp = app;
        this.dispatchTabInitialized();
      }, this);

      sitecore.trigger("ScheduleRecurringDailyPanel:initialized");
    },

    dispatchTabInitialized: function () {
      if (this.MonthlyPanelBorder) {
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

        this.MonthlyAmountTextBox.viewModel.$el.keydown(validation.validate);
        this.MonthlyOfEveryDaysAmountTextBox.viewModel.$el.keydown(validation.validate);
        this.MonthlyOfEveryTheAmountTextBox.viewModel.$el.keydown(validation.validate);

        this.MonthlyDaysRadioButton.on("change:isChecked", function () {
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
      if (this.MonthlyPanelBorder) {
        this.isDayOfMonthMode = this.MonthlyDaysRadioButton.get("isChecked");
        if (this.isDayOfMonthMode) {
          this.MonthlyCounterComboBox.set("isEnabled", false);
          this.MonthlyDaysOfWeekComboBox.set("isEnabled", false);
          this.MonthlyOfEveryTheAmountTextBox.set("isEnabled", false);

          this.MonthlyAmountTextBox.set("isEnabled", true);
          this.MonthlyOfEveryDaysAmountTextBox.set("isEnabled", true);
        } else {
          this.MonthlyCounterComboBox.set("isEnabled", true);
          this.MonthlyDaysOfWeekComboBox.set("isEnabled", true);
          this.MonthlyOfEveryTheAmountTextBox.set("isEnabled", true);

          this.MonthlyAmountTextBox.set("isEnabled", false);
          this.MonthlyOfEveryDaysAmountTextBox.set("isEnabled", false);
        }
      }
    },

    getMonthlyDispatchDetails: function (dispatchDetails) {
      if (this.MonthlyPanelBorder) {
        if (!dispatchDetails.recurringSchedule) {
          dispatchDetails.recurringSchedule = {};
        }

        dispatchDetails.recurringSchedule.scheduleType = this.monthlyScheduleType;
        dispatchDetails.recurringSchedule.monthly = {};
        dispatchDetails.recurringSchedule.daily = null;
        dispatchDetails.recurringSchedule.weekly = null;
        dispatchDetails.recurringSchedule.yearly = null;
        dispatchDetails.recurringSchedule.validation = {};
        dispatchDetails.recurringSchedule.validation.errors = [];
        dispatchDetails.recurringSchedule.validation.isValid = true;

        if (this.isDayOfMonthMode) {
          var every = this.MonthlyOfEveryDaysAmountTextBox.get("text"),
              dayOfMonth = this.MonthlyAmountTextBox.get("text");
          dispatchDetails.recurringSchedule.monthly.every = every;
          dispatchDetails.recurringSchedule.monthly.dayOfMonth = dayOfMonth;

          if (typeof every === "undefined" || every === null || every === "") {
            dispatchDetails.recurringSchedule.validation.isValid = false;
          }
          if (typeof dayOfMonth === "undefined" || dayOfMonth === null || dayOfMonth === "") {
            dispatchDetails.recurringSchedule.validation.isValid = false;
          }
        } else {
          var everyThe = this.MonthlyOfEveryTheAmountTextBox.get("text");
          dispatchDetails.recurringSchedule.monthly.every = everyThe;
          dispatchDetails.recurringSchedule.monthly.weekOfMonth = this.MonthlyCounterComboBox.get("selectedValue");
          dispatchDetails.recurringSchedule.monthly.days = this.MonthlyDaysOfWeekComboBox.get("selectedValue");

          if (typeof everyThe === "undefined" || everyThe === null || everyThe === "") {
            dispatchDetails.recurringSchedule.validation.isValid = false;
          }
        }
        
        if (dispatchDetails.recurringSchedule.validation.isValid === false) {
          dispatchDetails.recurringSchedule.validation.errors.push("ECM.Pages.Message.PleaseFillAllRequiredFields");
        }
      }
    },

    setUpValuesFromContext: function () {
      if (this.MonthlyPanelBorder) {
        var dispatchContext = this.contextApp.DispatchContext,
            recurringSchedule = dispatchContext.get("recurringSchedule");

        if (dispatchContext.get("isBusy") || !dispatchContext.get("hasRecurringSchedule") || !recurringSchedule) {
          return;
        }

        if (recurringSchedule.scheduleType === 0) {
          return;
        }

        var monthly = recurringSchedule.monthly;
        if (!monthly) {
          return;
        }

        this.isDayOfMonthMode = monthly.weekOfMonth === 0;
        if (this.isDayOfMonthMode) {
          this.MonthlyOfEveryDaysAmountTextBox.set("text", monthly.every);
          this.MonthlyAmountTextBox.set("text", monthly.dayOfMonth);
          this.MonthlyDaysRadioButton.set("isChecked", true);
        } else {
          this.MonthlyOfEveryTheAmountTextBox.set("text", monthly.every);

          this.MonthlyCounterComboBox.on("change:items", function (combobox) {
            this.setSelectedItem(combobox, monthly.weekOfMonth);
          }, this);

          this.MonthlyDaysOfWeekComboBox.on("change:items", function (combobox) {
            this.setSelectedItem(combobox, monthly.days);
          }, this);

          this.MonthlyTheRadioButton.set("isChecked", true);
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
      if (this.MonthlyPanelBorder) {
        if (!this.contextApp) {
          return;
        }

        var disabled = this.contextApp.MessageContext.get("isReadonly") || !this.contextApp.DispatchContext.get("hasRecurringSchedule");
        this.MonthlyPanelBorder.viewModel.$el.find('*').attr('disabled', disabled);
        this.MonthlyCounterComboBox.set("isEnabled", !disabled);
        this.MonthlyDaysOfWeekComboBox.set("isEnabled", !disabled);
        this.MonthlyDaysRadioButton.set("isEnabled", !disabled);
        this.MonthlyTheRadioButton.set("isEnabled", !disabled);
        this.MonthlyAmountTextBox.set("isEnabled", !disabled);
        this.MonthlyOfEveryDaysAmountTextBox.set("isEnabled", !disabled);
        this.MonthlyOfEveryTheAmountTextBox.set("isEnabled", !disabled);
        if (!disabled) {
          this.switchMode();
        }
      }
    }
  });

  return monthlyPanel;
});