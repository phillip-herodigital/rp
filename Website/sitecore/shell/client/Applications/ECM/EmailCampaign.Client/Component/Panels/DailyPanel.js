define(["sitecore", "/-/speak/v1/ecm/NumericInputValidation.js"], function (sitecore, validation) {
  var dailyPanel = sitecore.Definitions.App.extend({
    dailyScheduleType: 1,
    contextApp: null,
    initialized: function () {
      sitecore.on("dispatchTab:dispatchDetailsGathering", this.getDailyDispatchDetails, this);

      sitecore.on("dispatchTab:initialized", function (app) {
        this.contextApp = app;
        this.dispatchTabInitialized();
      }, this);

      sitecore.trigger("ScheduleRecurringDailyPanel:initialized");
    },

    isLoaded: function () {
      return this.ScheduleRecurringDaysAmountTextBox ? true : false;
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

      this.ScheduleRecurringDaysAmountTextBox.viewModel.$el.keydown(validation.validate);

      this.contextApp.DispatchContext.on("change:isBusy", function () {
        this.setUpValuesFromContext();
      }, this);
    },

    getDailyDispatchDetails: function (dispatchDetails) {
      if (!this.isLoaded()) {
        return;
      }

      if (!dispatchDetails.recurringSchedule) {
        dispatchDetails.recurringSchedule = {};
      }

      dispatchDetails.recurringSchedule.scheduleType = this.dailyScheduleType;

      var every = this.ScheduleRecurringDaysAmountTextBox.get("text");
      dispatchDetails.recurringSchedule.daily = { every: every };
      dispatchDetails.recurringSchedule.weekly = null;
      dispatchDetails.recurringSchedule.monthly = null;
      dispatchDetails.recurringSchedule.yearly = null;
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

      var daily = recurringSchedule.daily;
      if (!daily) {
        return;
      }

      this.ScheduleRecurringDaysAmountTextBox.set("text", daily.every);
    },

    changeDeliveryModeRecurring: function () {
      if (!this.isLoaded()) {
        return;
      }

      if (!this.contextApp) {
        return;
      }

      var enabled = !this.contextApp.MessageContext.get("isReadonly") && this.contextApp.DispatchContext.get("hasRecurringSchedule");

      this.ScheduleRecurringDaysAmountTextBox.set("isEnabled", enabled);
    }
  });

  return dailyPanel;
});