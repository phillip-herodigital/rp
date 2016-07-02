define(["sitecore", "/-/speak/v1/ecm/NumericInputValidation.js", "/-/speak/v1/ecm/ComboBoxDataSource.js"], function (sitecore, validation, comboBoxDataSource) {
  var timePanel = sitecore.Definitions.App.extend({
    initialized: function () {
      var panelApp = this;
      var contextApp;
      var context;
      var getRecurringSchedule;

      resetDatePicker();
      setEndDateRadioButtons();

      sitecore.on("dispatchTab:dispatchDetailsGathering", function (dispatchDetails) {
        if (!dispatchDetails.recurringSchedule) {
          dispatchDetails.recurringSchedule = {};
        }

        dispatchDetails.recurringSchedule.hasRecurringSchedule = context.get("hasRecurringSchedule");
        dispatchDetails.recurringSchedule.startDate = panelApp.ScheduleRecurringDateDatePicker.get("date");
        dispatchDetails.recurringSchedule.endByDate = panelApp.ScheduleRecurringEndByDateColumnPanelDatePicker.get("date");
        dispatchDetails.recurringSchedule.startTime = panelApp.ScheduleRecurringTimeComboBox.get("selectedValue");
        dispatchDetails.recurringSchedule.timeZone = panelApp.ScheduleRecurringTimezoneComboBox.get("selectedValue");
        dispatchDetails.recurringSchedule.endOccurrences = panelApp.ScheduleRecurringEndAfterAmountTextBox.get("text");

        if (panelApp.ScheduleRecurringEndNoEndDateRadioButton.get("isChecked")) {
          dispatchDetails.recurringSchedule.endMode = 1;
        } else if (panelApp.ScheduleRecurringEndAfterRadioButton.get("isChecked")) {
          dispatchDetails.recurringSchedule.endMode = 2;
        } else if (panelApp.ScheduleRecurringEndByRadioButton.get("isChecked")) {
          dispatchDetails.recurringSchedule.endMode = 3;
        }
      });

      sitecore.on("dispatchTab:initialized", function (app) {
        contextApp = app;
        context = contextApp.DispatchContext;
        getRecurringSchedule = context.get("recurringSchedule");
        initialize();
      });
      
      panelApp.ScheduleRecurringTimezoneComboBoxDataSource.on("change:selectedItem", function () {
        if (contextApp
          && context.get("hasRecurringSchedule")
          && getRecurringSchedule
          && getRecurringSchedule.timeZone) {
          panelApp.ScheduleRecurringTimezoneComboBox.set("selectedValue", getRecurringSchedule.timeZone);
        } else {
          panelApp.ScheduleRecurringTimezoneComboBox.set("selectedItem", panelApp.ScheduleRecurringTimezoneComboBoxDataSource.get("selectedItem"));
        }
      });

      panelApp.ScheduleRecurringComboBoxDataSource.on("change:selectedItem", function () {
        if (contextApp
          && context.get("hasRecurringSchedule")
          && getRecurringSchedule
          && getRecurringSchedule.timeZone) {
          panelApp.ScheduleRecurringTimeComboBox.set("selectedValue", getRecurringSchedule.startTime);
        } else {
          panelApp.ScheduleRecurringTimeComboBox.set("selectedItem", panelApp.ScheduleRecurringComboBoxDataSource.get("selectedItem"));
        }
      });

      panelApp.ScheduleRecurringComboBoxDataSource.on("change:selectedItem", function () {
        if (contextApp && context.get("hasRecurringSchedule") && getRecurringSchedule && getRecurringSchedule.timeZone) {
          panelApp.ScheduleRecurringTimeComboBox.set("selectedValue", getRecurringSchedule.startTime);
        } else {
          comboBoxDataSource.setNearestTimeInComboBox(panelApp.ScheduleRecurringComboBoxDataSource, panelApp.ScheduleRecurringTimeComboBox);
        }
      });

      function initialize() {
        setUpValuesFromContext();
        changeDeliveryModeRecurring();

        sitecore.on("change:messageContext", function () {
          changeDeliveryModeRecurring();
        }, this);

        context.on("change:hasRecurringSchedule", function () {
          changeDeliveryModeRecurring();
        });

        contextApp.MessageContext.on("change:isReadOnly", function () {
          changeDeliveryModeRecurring();
        });

        panelApp.ScheduleRecurringEndAfterRadioButton.on("change:isChecked", function () {
          setEndModeControls();
        });

        panelApp.ScheduleRecurringEndByRadioButton.on("change:isChecked", function () {
          setEndModeControls();
        });

        panelApp.ScheduleRecurringEndAfterAmountTextBox.viewModel.$el.keydown(validation.validate);

        context.on("change:isBusy", function () {
          getRecurringSchedule = context.get("recurringSchedule");
          setUpValuesFromContext();
        });

        function changeDeliveryModeRecurring() {
          if (!contextApp)
            return;

          var enabled = !contextApp.MessageContext.get("isReadonly") && context.get("hasRecurringSchedule");

          panelApp.ScheduleRecurringDateDatePicker.set("isEnabled", enabled);
          panelApp.ScheduleRecurringTimeComboBox.set("isEnabled", enabled);
          panelApp.ScheduleRecurringTimezoneComboBox.set("isEnabled", enabled);
          panelApp.ScheduleRecurringEndNoEndDateRadioButton.set("isEnabled", enabled);
          panelApp.ScheduleRecurringEndByRadioButton.set("isEnabled", enabled);
          panelApp.ScheduleRecurringEndAfterRadioButton.set("isEnabled", enabled);
          if (enabled) {
            setEndModeControls();
          }
          else {
            panelApp.ScheduleRecurringEndAfterAmountTextBox.set("isEnabled", enabled);
            panelApp.ScheduleRecurringEndByDateColumnPanelDatePicker.set("isEnabled", enabled);
          }
        }

        function setUpValuesFromContext() {
          if (context.get("isBusy") || !context.get("hasRecurringSchedule") || !getRecurringSchedule) {
            return;
          }

          if (getRecurringSchedule.scheduleType === 0) {
            return;
          }

          panelApp.ScheduleRecurringDateDatePicker.set("date", getRecurringSchedule.startDate);
          panelApp.ScheduleRecurringEndByDateColumnPanelDatePicker.set("date", getRecurringSchedule.endByDate);

          panelApp.ScheduleRecurringTimeComboBox.set("selectedValue", getRecurringSchedule.startTime);
          panelApp.ScheduleRecurringTimezoneComboBox.set("selectedValue", getRecurringSchedule.timeZone);

          panelApp.ScheduleRecurringEndAfterAmountTextBox.set("text", getRecurringSchedule.endOccurrences);


          panelApp.ScheduleRecurringEndNoEndDateRadioButton.set("isChecked", false);
          panelApp.ScheduleRecurringEndByRadioButton.set("isChecked", false);
          panelApp.ScheduleRecurringEndAfterRadioButton.set("isChecked", false);
          switch (getRecurringSchedule.endMode) {
            case 1:
              panelApp.ScheduleRecurringEndNoEndDateRadioButton.set("isChecked", "NoEndDate");
              break;
            case 2:
              panelApp.ScheduleRecurringEndAfterRadioButton.set("isChecked", "EndAfter");
              break;
            case 3:
              panelApp.ScheduleRecurringEndByRadioButton.set("isChecked", "EndBy");
              break;
            default:
          }
        }

        function setEndModeControls() {
          panelApp.ScheduleRecurringEndAfterAmountTextBox.set("isEnabled", panelApp.ScheduleRecurringEndAfterRadioButton.get("isChecked"));
          panelApp.ScheduleRecurringEndByDateColumnPanelDatePicker.set("isEnabled", panelApp.ScheduleRecurringEndByRadioButton.get("isChecked"));
        }
      };

      function resetDatePicker() {
        //setting current day date
        var now = new Date();
        var convertedDate = panelApp.ScheduleRecurringDateDatePicker.viewModel.convertToISODate(now);
        panelApp.ScheduleRecurringDateDatePicker.set("date", convertedDate);
        panelApp.ScheduleRecurringEndByDateColumnPanelDatePicker.set("date", convertedDate);
      }

      function setEndDateRadioButtons() {
        panelApp.ScheduleRecurringEndNoEndDateRadioButton.set("isChecked", "NoEndDate");
        panelApp.ScheduleRecurringEndByRadioButton.set("isChecked", false);
        panelApp.ScheduleRecurringEndAfterRadioButton.set("isChecked", false);
      }

      sitecore.trigger("ScheduleRecurringTimePanel:initialized");
    }
  });

  return timePanel;
});