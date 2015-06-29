define(["sitecore", "/-/speak/v1/ecm/NumericInputValidation.js"], function (sitecore, validation) {
  var weeklyPanel = sitecore.Definitions.App.extend({
    weeklyScheduleType: 2,
    contextApp: null,
    initialized: function () {
      sitecore.on("dispatchTab:dispatchDetailsGathering", this.getWeeklyDispatchDetails, this);

      sitecore.on("dispatchTab:initialized", function (app) {
        this.contextApp = app;
        this.dispatchTabInitialized();
      }, this);

      sitecore.trigger("ScheduleRecurringDailyPanel:initialized");
    },

    isLoaded: function () {
      return this.WeeklyPanelBorder ? true : false;
    },

    dispatchTabInitialized: function () {
      if (!this.isLoaded()) {
        return;
      }

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

      this.WeeksAmountTextBox.viewModel.$el.keydown(validation.validate);

      this.contextApp.DispatchContext.on("change:isBusy", function () {
        this.setUpValuesFromContext();
      }, this);
    },

    getWeeklyDispatchDetails: function (dispatchDetails) {
      if (!this.isLoaded()) {
        return;
      }

      if (!dispatchDetails.recurringSchedule) {
        dispatchDetails.recurringSchedule = {};
      }

      dispatchDetails.recurringSchedule.scheduleType = this.weeklyScheduleType;
      var every = this.WeeksAmountTextBox.get("text");
      dispatchDetails.recurringSchedule.weekly = {
        every: every
      };
      dispatchDetails.recurringSchedule.daily = null;
      dispatchDetails.recurringSchedule.monthly = null;
      dispatchDetails.recurringSchedule.yearly = null;
      var sundayValue = this.SundayCheckBox.get("value"),
          mondayValue = this.MondayCheckBox.get("value"),
          tuesdayValue = this.TuesdayCheckBox.get("value"),
          wednesdayValue = this.WednesdayCheckBox.get("value"),
          thursdayValue = this.ThursdayCheckBox.get("value"),
          fridayValue = this.FridayCheckBox.get("value"),
          saturdayValue = this.SaturdayCheckBox.get("value");
      var isSunday = this.SundayCheckBox.get("isChecked") ? sundayValue : 0,
          isMonday = this.MondayCheckBox.get("isChecked") ? mondayValue : 0,
          isTuesday = this.TuesdayCheckBox.get("isChecked") ? tuesdayValue : 0,
          isWednesday = this.WednesdayCheckBox.get("isChecked") ? wednesdayValue : 0,
          isThursday = this.ThursdayCheckBox.get("isChecked") ? thursdayValue : 0,
          isFriday = this.FridayCheckBox.get("isChecked") ? fridayValue : 0,
          isSaturday = this.SaturdayCheckBox.get("isChecked") ? saturdayValue : 0;
      var days = 0 | isSunday | isMonday | isTuesday | isWednesday | isThursday | isFriday | isSaturday;
      dispatchDetails.recurringSchedule.weekly.days = days;

      dispatchDetails.recurringSchedule.validation = {};
      dispatchDetails.recurringSchedule.validation.errors = [];
      dispatchDetails.recurringSchedule.validation.isValid = true;

      if (typeof every === "undefined" || every === null || every === "") {
        dispatchDetails.recurringSchedule.validation.isValid = false;
        dispatchDetails.recurringSchedule.validation.errors.push("ECM.Pages.Message.PleaseFillAllRequiredFields");
      }
    },

    setUpValuesFromContext: function () {
      if (!this.isLoaded()) {
        return;
      }

      var dispatchContext = this.contextApp.DispatchContext,
          recurringSchedule = dispatchContext.get("recurringSchedule");

      if (dispatchContext.get("isBusy") || !dispatchContext.get("hasRecurringSchedule") || !recurringSchedule) {
        return;
      }

      if (recurringSchedule.scheduleType === 0) {
        return;
      }

      var weekly = recurringSchedule.weekly;
      if (!weekly) {
        return;
      }

      this.WeeksAmountTextBox.set("text", weekly.every);

      var days = recurringSchedule.weekly.days,
            sundayValue = Number(this.SundayCheckBox.get("value")),
            mondayValue = Number(this.MondayCheckBox.get("value")),
            tuesdayValue = Number(this.TuesdayCheckBox.get("value")),
            wednesdayValue = Number(this.WednesdayCheckBox.get("value")),
            thursdayValue = Number(this.ThursdayCheckBox.get("value")),
            fridayValue = Number(this.FridayCheckBox.get("value")),
            saturdayValue = Number(this.SaturdayCheckBox.get("value"));
      this.SundayCheckBox.set("isChecked", (days & sundayValue) === sundayValue);
      this.MondayCheckBox.set("isChecked", (days & mondayValue) === mondayValue);
      this.TuesdayCheckBox.set("isChecked", (days & tuesdayValue) === tuesdayValue);
      this.WednesdayCheckBox.set("isChecked", (days & wednesdayValue) === wednesdayValue);
      this.ThursdayCheckBox.set("isChecked", (days & thursdayValue) === thursdayValue);
      this.FridayCheckBox.set("isChecked", (days & fridayValue) === fridayValue);
      this.SaturdayCheckBox.set("isChecked", (days & saturdayValue) === saturdayValue);
    },

    changeDeliveryModeRecurring: function () {
      if (!this.isLoaded()) {
        return;
      }

      if (!this.contextApp)
        return;

      var disabled = this.contextApp.MessageContext.get("isReadonly") || !this.contextApp.DispatchContext.get("hasRecurringSchedule");

      this.WeeklyPanelBorder.viewModel.$el.find('*').attr('disabled', disabled);
      this.WeeksAmountTextBox.set("isEnabled", !disabled);
    }
  });

  return weeklyPanel;
});