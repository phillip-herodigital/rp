define([
  "sitecore",
  "/-/speak/v1/ecm/AppBase.js",
  "/-/speak/v1/ecm/ComboBoxDataSource.js",
  "/-/speak/v1/ecm/DialogService.js",
  "/-/speak/v1/ecm/MessageValidationService.js"
], function (
  sitecore,
  AppBase,
  comboBoxDataSource,
  DialogService,
  MessageValidationService
  ) {
  var daylyPanelId = "{7A98DD5E-E457-4A2A-AA74-CFF28BCAD3E2}",
      weeklyPanelId = "{05B4E5CE-79E9-4C39-8A11-25C927BAAC75}",
      monthlyPanelId = "{6460B91B-F5A4-4429-86FE-45D9FB673749}",
      yearlyPanelId = "{1EE096F9-EF6C-4D16-B749-E41669EA947D}",
      daylyValue = 1,
      weeklyValue = 2,
      monthlyValue = 3,
      yearlyValue = 4;

  var deliveryTab = AppBase.extend({
    dispatchControls: [
      'ABVariantsSizeComboBox',
      'SendMessageNowRadioButton',
      'ScheduleDeliveryRadioButton',
      'ScheduleRecurringRadioButton',
      'ScheduleRecurringIntervalComboBox',
      'NotificationEnableCheckBox',
      'EmulationModeCheckBox',
      'SendButton',
      'ScheduleButton',
      'StartTestButton',
      'ScheduleTestButton',
      'AutomaticTimeTextBox',
      'AutomaticIntervalComboBox',
      'AutomationBestValueRadioButton',
      'AutomationOptionHighestRateRadioButton',
      'ABWinnerAutomaticRadioButton',
      'ABWinnerManualRadioButton'
    ],
    dispatchButtons: [
      'StartTestButton',
      'SendButton',
      'ScheduleTestButton',
      'ScheduleButton',
      'ActivateMessageButton',
      'ActivateTestButton'
    ],

    initialized: function () {
      sitecore.trigger("mainApp", this);

      this.setMessageId();
      this.resetScheduleDate();
      this.attachEventHandlers();
      this.initAbVariantSizeComboBox();
      this.initAutomaticIntervalsComboBox();

      if (!!this.ScheduleRecurringRadioButton) {
        this.initRecurringIntervalsComboBox();
      } else {
        sitecore.trigger("dispatchTab:initialized", this);
      }

      sitecore.trigger("change:messageContext");
    },

    attachEventHandlers: function () {
      sitecore.on({
        "change:messageContext": function() {
          this.onChangeReadOnly();
          this.updateLanguageName();
          this.setIsEnableNotificationEmail();
          this.setIsEnablePreferredLanguage();
          this.changeDeliveryMode();
          this.changeDeliveryModeRecurring();
          this.updateABTesting();
          this.updateVariantSize();
          this.updateVariantsSelector();
        },
        "change:messageContext:nonReadonly": function() {
          this.MessageContext.set("isReadonly", false);
          this.onChangeReadOnly();
        },
        "dispatch:pipeline:success": function () {
            this.setControlsProperties(this.dispatchButtons, { 'isEnabled': true });
        },
        "dispatch:pipeline:success:starttest": function() {
          this.VariantDataSource.viewModel.refresh();
        },
        "message:delivery:dispatch": function(actionName, isSchedule) {
          this.doDispatch(actionName, isSchedule);
        },
        "change:messageContext:currentState": this.addStatusMessage,
        "change:messageContext:currentState:error": this.addErrorMessage,
        "language:addednew": function() {
          this.DispatchContext.viewModel.refresh();
        },
        "ScheduleRecurringTimePanel:initialized": function () {
          this.timePanelLoaded = true;
          this.raiseOnLoadComplete();
        },
        "ScheduleRecurringDailyPanel:initialized": function () {
          this.dailyPanelLoaded = true;
          this.raiseOnLoadComplete();
        },
        "dispatch:selectvariant": function (variantid) {
          var actionDetails = {
            messageId: this.MessageContext.get("messageId"),
            variant: variantid
          };

          DialogService.show('messageManualWinnerSelectConfirmation', {
            on: {
              ok: _.bind(function () {
                this.dispatchAction("selectwinner", actionDetails);
              }, this)
            },
            data: {
              messageType: this.MessageContext.get("messageType")
            }
          });
        },
        'dispatch:pipeline:error': function () {
          this.setControlsProperties(this.dispatchButtons, { 'isEnabled': true });
        }
      }, this);

      this.on({
        "dispatch:send": function() {
          this.dispatch("dispatch", false);
        },
        "dispatch:schedule": function () {
          this.dispatch("dispatch", true);
        },
        "dispatch:starttest": function () { this.dispatch("starttest", false); },
        "dispatch:scheduletest": function () { this.dispatch("starttest", true); },
        "dispatch:cancelscheduling": function () {
          DialogService.show("confirm", {
            text: sitecore.Resources.Dictionary.translate("ECM.MessagePage.DispatchDialog.SchedulingCancel"),
            on: {
              ok: _.bind(function () { this.dispatchAction("cancelscheduling"); }, this)
            }
          });
        },
        "dispatch:pause": function () { this.dispatchAction("pause"); },
        "dispatch:resume": function () { this.dispatchAction("resume"); },
        "dispatch:activate": function () { this.dispatch("activate", false); },
        "dispatch:deactivate": function () {
          DialogService.show('confirm', {
            text: sitecore.Resources.Dictionary.translate("ECM.Pages.Message.WouldYouLikeDeactivateMessage"),
            showIcon: false,
            on: {
              ok: _.bind(function () { this.dispatchAction("deactivate"); }, this)
            }
          });
        },
        "dispatch:activatetest": function () { this.dispatch("activatetest", false); }
      }, this);

      this.DispatchContext.on({
        "change:multiLanguageEnabled": function() {
            this.setIsEnableNotificationEmail();
            this.setIsEnablePreferredLanguage();
        },
        "change:isBusy": function() {
          this.onDispatchContextChangeIsBusy();
          this.updateABTesting();
          this.updateVariantSize();
          this.updateVariantsSelectorOnDispatchContextChange();
          if (this.DispatchContext.get("showAbTest") &&
            !this.DispatchContext.get("selectWinnerAutomatically") &&
            !this.DispatchContext.get("isBusy") &&
            this.testStartedOrMessageReadonly()
          ) {
            this.ABWinnerManualRadioButton.set("isChecked", true);
          }
        },
        "change:hasSchedule": function() {
          this.changeDeliveryMode();
          if (!this.DispatchContext.get("isBusy")) {
            this.setupSendScheduleButtons();
          }
        },
        "change:hasRecurringSchedule": function () {
          this.changeDeliveryModeRecurring();
        },
        "change:recurringSchedule": this.onChangeScheduleRecurring,
        // Need to check multiple events
        "change:showAbTest change:hasRecurringSchedule": function () {
          if (!this.DispatchContext.get("isBusy")) {
            this.setupSendScheduleButtons();
          }
        }
      }, this);

      this.MessageContext.on({
        "change:isReadOnly": function() {
          this.setIsEnableNotificationEmail();
          this.changeDeliveryMode();
          this.changeDeliveryModeRecurring();
        }
      }, this);

      this.AutomaticTimeTextBox.on("change:text", function () {
        var formattedValue = parseInt(this.AutomaticTimeTextBox.get("text")).toString();
        if (formattedValue != this.AutomaticTimeTextBox.get("text")) {
          this.AutomaticTimeTextBox.set("text", formattedValue);
        }
      }, this);

      this.attachScheduleEvents();

      $("[data-sc-id='AutomaticTimeTextBox']").keydown(this.onAutomaticTimeKeyDown);

      // To show/hide ABWinnerVariantProgressIndicator need to take to account several conditions,
      //   standard SPEAK bindings is not working here.
      this.VariantDataSource.on('change:isBusy', function () {
        var isBusy = this.VariantDataSource.get('isBusy') && this.VariantsList.viewModel.$el.is(':visible');
        this.ABWinnerVariantProgressIndicator.set('isBusy', isBusy);
        this.onVariantDataSourceChangeIsBusy();
      }, this);
      
    },

    // TODO: handlers looks very similar need to re-factor them
    attachScheduleEvents: function() {
      this.ScheduleTimezoneComboBoxDataSource.on("change:selectedItem", function () {
        var schedule = this.DispatchContext.get('schedule');
        if (this.DispatchContext.get("hasSchedule") && schedule && schedule.timeZone) {
          this.ScheduleTimezoneComboBox.set("selectedValue", schedule.timeZone);
        } else {
          this.ScheduleTimezoneComboBox.set("selectedItem", this.ScheduleTimezoneComboBoxDataSource.get("selectedItem"));
        }
      }, this);

      this.ScheduledTimeComboBoxDataSource.on("change:selectedItem", function () {
        var schedule = this.DispatchContext.get('schedule');
        if (this.DispatchContext.get("hasSchedule") && schedule && schedule.time) {
          this.ScheduledTimeComboBox.set("selectedValue", schedule.time);
        } else {
          comboBoxDataSource.setNearestTimeInComboBox(this.ScheduledTimeComboBoxDataSource, this.ScheduledTimeComboBox);
        }
      }, this);

      if (this.ScheduledEndTimeComboBoxDataSource) {
        this.ScheduledEndTimeComboBoxDataSource.on("change:selectedItem", function () {
          var schedule = this.DispatchContext.get('schedule');
          if (this.DispatchContext.get("hasSchedule") && schedule && schedule.endTime) {
            this.ScheduledEndTimeComboBox.set("selectedValue", schedule.endTime);
          } else {
            comboBoxDataSource.setNearestTimeInComboBox(this.ScheduledEndTimeComboBoxDataSource, this.ScheduledEndTimeComboBox);
          }
        }, this);
      }

      this.SendMessageNowRadioButton.on("change:isChecked", function () {
        if (this.SendMessageNowRadioButton.get("isChecked")) {
          this.DispatchContext.set("hasSchedule", false);
          this.DispatchContext.set("hasRecurringSchedule", false);
        }
      }, this);

      this.ScheduleDeliveryRadioButton.on("change:isChecked", function () {
        if (this.ScheduleDeliveryRadioButton.get("isChecked")) {
          this.DispatchContext.set("hasSchedule", true);
          this.DispatchContext.set("hasRecurringSchedule", false);
        }
      }, this);

      if (this.ScheduleRecurringRadioButton) {
        this.ScheduleRecurringRadioButton.on("change:isChecked", function () {
          if (this.ScheduleRecurringRadioButton.get("isChecked")) {
            this.DispatchContext.set("hasSchedule", false);
            this.DispatchContext.set("hasRecurringSchedule", true);
          }
        }, this);
      }
    },

    addStatusMessage: function (status, statusDescription) {
      if (!statusDescription) {
        return;
      }

      this.MessageBar.removeMessage(function(message) {
        return message.id === "messagecontext.notification.statuschanged" && message.text === statusDescription;
      });
      var messageToAdd = { id: "messagecontext.notification.statuschanged", text: statusDescription, actions: [], closable: true };
      this.MessageBar.addMessage("notification", messageToAdd);
      this.DispatchContext.viewModel.refresh();
    },

    addErrorMessage: function (errorMessage) {
      if (!errorMessage) {
        return;
      }
      this.MessageBar.removeMessage(function(message) {
        return message.id === "messagecontext.error.statuschanged" && message.text === errorMessage;
      });
      var messageToAdd = { id: "messagecontext.error.statuschanged", text: errorMessage, actions: [], closable: true };
      this.MessageBar.addMessage("error", messageToAdd);
      this.DispatchContext.viewModel.refresh();
    },

    onChangeReadOnly: function () {
      this.setControlsProperties(this.dispatchButtons, { 'isEnabled': !this.MessageContext.get("isReadonly") });
      this.setControlsProperties(this.dispatchControls, { isEnabled: !this.MessageContext.get("isReadonly") });
    },

    setMessageId: function () {
      var messageId = this.MessageContext.get("messageId");
      this.DispatchContext.set("messageId", messageId);
      this.VariantDataSource.set("messageId", messageId);
    },

    updateLanguageName: function () {
      var languageName = this.MessageContext.get("languageName");
      this.UsePreferredLanguageHintTextContextLanguage.set("text", languageName);
    },

    dispatch: function (actionName, isSchedule) {
      if (MessageValidationService.validateMessageVariantsSubject(this.MessageContext.get("variants"))) {
        var args = { Verified: false, Saved: false };
        sitecore.trigger("message:save", args);
        if (!args.Verified || !args.Saved) {
          return;
        }
        sitecore.trigger("message:delivery:verifyMessage", actionName, isSchedule);
      }
    },

    getDispatchRequestData: function (actionName, requestParameters) {
      return {
        errorCount: 0,
        messageBar: this.MessageBar,
        request: requestParameters || this.getDispatchDetails(),
        actionName: actionName
      };
    },

    dispatchAction: function (actionName, requestParameters) {
      this.setControlsProperties(this.dispatchButtons, { 'isEnabled': false });
      sitecore.Pipelines.DispatchMessage.execute({ app: this, currentContext: this.getDispatchRequestData(actionName, requestParameters) });
    },

    getDispatchDetails: function () {
      var dispatchDetails = {
        messageId: this.MessageContext.get("messageId"),
        usePreferredLanguage: this.UsePreferredLanguageEnableCheckBox.get("isChecked"),
        useNotificationEmail: this.NotificationEnableCheckBox.get("isChecked"),
        notificationEmail: this.NotificationEmailValueTextBox.get("text"),
        emulationMode: this.EmulationModeCheckBox.get("isChecked"),
        schedule: {
          hasSchedule: this.DispatchContext.get("hasSchedule"),
          time: this.ScheduledTimeComboBox.get("selectedItemId"),
          timezone: this.ScheduleTimezoneComboBox.get("selectedItemId").replace("+", "_plus_"),
          date: this.ScheduledDateDatePicker.get("date"),
          endTime: this.ScheduledEndTimeComboBox ? this.ScheduledEndTimeComboBox.get("selectedItemId") : null,
          endDate: this.ScheduledEndDateDatePicker ? this.ScheduledEndDateDatePicker.get("date") : null
        },
        abTest: this.DispatchContext.get("showAbTest") ? {
          selectedVariants: this.ABVariantsSelector.viewModel.getSelectedVariants(),
          testSize: this.ABVariantsSizeComboBox.get("selectedValue"),
          selectWinnerAutomatically: this.ABWinnerAutomaticRadioButton.get("isChecked"),
          bestValuePerVisit: this.AutomationBestValueRadioButton.get("isChecked"),
          highestOpenRate: this.AutomationOptionHighestRateRadioButton.get("isChecked"),
          automaticTimeMode: this.AutomaticIntervalComboBox.get("selectedValue"),
          automaticTimeAmount: this.AutomaticTimeTextBox.get("text")
        } : null
      };

      sitecore.trigger("dispatchTab:dispatchDetailsGathering", dispatchDetails);

      return dispatchDetails;
    },

    doDispatch: function (actionName, isSchedule) {
      if (actionName === "activate") {
        DialogService.show('messageActivateConfirmation', {
          on: {
            ok: _.bind(function () {
              this.dispatchAction("activate");
            }, this)
          },
          langaugeName: this.MessageContext.get("languageName"),
          usePreferredLanguage: this.UsePreferredLanguageEnableCheckBox.get("isChecked")
        });
        return;
      }

      if (actionName === "activatetest") {
        DialogService.show('messageActivateConfirmation', {
          on: {
            ok: _.bind(function () { this.dispatchAction("starttest", this.getDispatchDetails()); }, this)
          }
        });
        return;
      }

      var dispatchDetails = this.getDispatchDetails();

      var currentContext = this.getDispatchRequestData(actionName);

      var recurringSchedule = dispatchDetails.recurringSchedule;
      if (isSchedule) {
        var isAbTest = currentContext.request.abTest && currentContext.request.abTest.selectedVariants.length > 1;
        if (this.MessageContext.get("messageType") === "Triggered") {
          DialogService.show('confirm', {
            on: {
              ok: _.bind(function () { this.dispatchAction("activate") }, this)
            },
            text: this.getScheduleConfirmationText(isAbTest ? "activatetest" : "activate")
          });
          return;
        } else if (typeof recurringSchedule !== "undefined" && recurringSchedule !== null && recurringSchedule.hasRecurringSchedule === true) {
          if (typeof recurringSchedule.validation !== "undefined" && recurringSchedule.validation !== null && recurringSchedule.validation.isValid === false) {
            Array.prototype.forEach.call(recurringSchedule.validation.errors, _.bind(function (error) {
              var errorText = sitecore.Resources.Dictionary.translate(error);
              var messagetoAddError = { text: errorText, actions: [], closable: true };
              this.MessageBar.addMessage("error", messagetoAddError);
            }, this));
            return;
          }
        }
        DialogService.show('confirm', {
          on: {
            ok: _.bind(function () { this.dispatchAction(isAbTest ? "starttest" : "dispatch") }, this)
          },
          text: this.getScheduleConfirmationText(isAbTest ? "test" : "dispatch")
        });
      } else {
        var confirmationDialogParameters = {
          app: this,
          currentContext: currentContext,
          dispatchDetails: dispatchDetails,
          languageName: this.MessageContext.get("languageName")
        };
        DialogService.show('messageDispatchConfirmation', confirmationDialogParameters);
      }
    },

    getScheduleConfirmationText: function (action) {
      var dialogMessage;
      switch (action) {
        case "activate":
          dialogMessage = sitecore.Resources.Dictionary.translate("ECM.MessagePage.DispatchDialog.ScheduledActivation");
          break;
        case "activatetest":
          dialogMessage = sitecore.Resources.Dictionary.translate("ECM.MessagePage.DispatchDialog.ScheduledActivationTest");
          break;
        case "test":
          dialogMessage = sitecore.Resources.Dictionary.translate("ECM.MessagePage.DispatchDialog.ScheduledTestStart");
          break;
        default:
          dialogMessage = sitecore.Resources.Dictionary.translate("ECM.MessagePage.DispatchDialog.ScheduledDispatch");
          break;
      }
      return dialogMessage;
    },

    setIsEnablePreferredLanguage: function () {
      if (this.UsePreferredLanguageEnableCheckBox) {
        this.UsePreferredLanguageEnableCheckBox.set('isEnabled', !this.MessageContext.get("isReadonly") && this.DispatchContext.get("multiLanguageEnabled"));
      }
    },

    setIsEnableNotificationEmail: function () {
      if (this.NotificationEmailValueTextBox) {
        this.NotificationEmailValueTextBox.set('isEnabled', !this.MessageContext.get("isReadonly") && this.NotificationEnableCheckBox.get("isChecked"));
      }
    },

    isDispatchButtonsHidden: function() {
      return !this.StartTestButton.get("isVisible") &&
        !this.SendButton.get("isVisible") &&
        !this.ScheduleTestButton.get("isVisible") &&
        !this.ScheduleButton.get("isVisible") &&
        !this.ActivateMessageButton.get("isVisible") &&
        !this.ActivateTestButton.get("isVisible");
    },

    hideDispatchButtons: function () {
      this.setControlsProperties('DispatchContext', {
        showScheduleTestButton: false,
        showScheduleButton: false,
        showActivateTestButton: false,
        showStartAbTestButton: false,
        showActivateMessageButton: false,
        showSendMessageButton: false
      });
    },

    //triggers button depends on current mode selected
    setupSendScheduleButtons: function () {
      //all buttons are hidden, so nothing to trigger
      if (this.isDispatchButtonsHidden()) {
        return;
      }

      this.hideDispatchButtons();
      if (this.DispatchContext.get("hasSchedule") || this.DispatchContext.get("hasRecurringSchedule")) {
        if (this.DispatchContext.get("showAbTest")) {
          this.DispatchContext.set("showScheduleTestButton", true);
        } else {
          this.DispatchContext.set("showScheduleButton", true);
        }
      } else {
        if (this.DispatchContext.get("showAbTest")) {
          if (this.MessageContext.get("messageType") == "Triggered") {
            this.DispatchContext.set("showActivateTestButton", true);
          } else {
            this.DispatchContext.set("showStartAbTestButton", true);
          }
        } else {
          if (this.MessageContext.get("messageType") == "Triggered") {
            this.DispatchContext.set("showActivateMessageButton", true);
          } else {
            this.DispatchContext.set("showSendMessageButton", true);
          }
        }
      }
    },

    onDispatchContextChangeIsBusy: function () {
      this.setupScheduleRadioButtons();
      var schedule = this.DispatchContext.get("schedule");
      if (this.DispatchContext.get("isBusy") || !this.DispatchContext.get("hasSchedule") || !schedule) {
        return;
      }

      this.ScheduledDateDatePicker.set("date", schedule.date);
      this.ScheduledTimeComboBox.set("selectedValue", schedule.time);
      this.ScheduleTimezoneComboBox.set("selectedValue", schedule.timeZone);

      if (this.ScheduledEndDateDatePicker && schedule.endDate) {
        this.ScheduledEndDateDatePicker.set("date", schedule.endDate);
      }

      if (this.ScheduledEndTimeComboBox && schedule.endTime) {
        this.ScheduledEndTimeComboBox.set("selectedValue", schedule.endTime);
      }
    },

    hasRecurring: function() {
      return !!this.ScheduleRecurringRadioButton;
    },

    setupScheduleRadioButtons: function () {
      this.setControlsProperties(
        'ScheduleRecurringRadioButton', { isChecked: this.DispatchContext.get("hasRecurringSchedule") },
        'ScheduleDeliveryRadioButton', { isChecked: this.DispatchContext.get("hasSchedule") },
        'SendMessageNowRadioButton', { isChecked: !this.DispatchContext.get("hasSchedule") && !this.DispatchContext.get("hasRecurringSchedule") }
      );
    },

    resetScheduleDate: function () {
      //setting current day date
      var convertedDate = this.ScheduledDateDatePicker.viewModel.convertToISODate(new Date());
      this.ScheduledDateDatePicker.set("date", convertedDate);
    },

    changeDeliveryMode: function () {
      this.setControlsProperties([
        'ScheduledDateDatePicker',
        'ScheduledTimeComboBox',
        'ScheduleTimezoneComboBox',
        'ScheduledEndDateDatePicker',
        'ScheduledEndTimeComboBox'
      ], { isEnabled: !this.MessageContext.get("isReadonly") && this.DispatchContext.get("hasSchedule") });
    },

    raiseOnLoadComplete: function () {
      if (this.timePanelLoaded && this.dailyPanelLoaded) {
        sitecore.trigger("dispatchTab:initialized", this);
      }
    },

    onChangeScheduleRecurring: function () {
      var recurringSchedule = this.DispatchContext.get("recurringSchedule"),
        scheduleType = recurringSchedule.scheduleType;

      if (recurringSchedule && scheduleType !== null && this.ScheduleRecurringRadioButton) {
        if ([weeklyValue, monthlyValue, yearlyValue].indexOf(scheduleType) !== -1) {
          this.ScheduleRecurringIntervalComboBox.set("selectedValue", scheduleType);
        } else if ([0, daylyValue].indexOf(scheduleType) !== -1) {
          if (this.ScheduleRecurringIntervalComboBox.get("selectedValue") === daylyValue) {
            this.recurringIntervalSelectedValueChanged(null, daylyValue);
          } else {
            this.ScheduleRecurringIntervalComboBox.set("selectedValue", daylyValue);
          }
        }
      }
    },

    initRecurringIntervalsComboBox: function () {
      var items = [
        { $displayName: this.DispatchStringDictionary.translate("Daily"), itemId: daylyValue },
        { $displayName: this.DispatchStringDictionary.translate("Weekly"), itemId: weeklyValue },
        { $displayName: this.DispatchStringDictionary.translate("Monthly"), itemId: monthlyValue },
        { $displayName: this.DispatchStringDictionary.translate("Yearly"), itemId: yearlyValue }
      ];

      this.ScheduleRecurringIntervalComboBox.set("items", items);
      this.ScheduleRecurringIntervalComboBox.set("selectedValue", daylyValue);
      this.ScheduleRecurringIntervalComboBox.on("change:selectedValue", this.recurringIntervalSelectedValueChanged, this);
    },

    initAutomaticIntervalsComboBox: function () {
      var items = [
        { $displayName: this.AutomaticStringDictionary.translate("Hours"), itemId: 1 },
        { $displayName: this.AutomaticStringDictionary.translate("Days"), itemId: 2 },
        { $displayName: this.AutomaticStringDictionary.translate("Weeks"), itemId: 3 },
        { $displayName: this.AutomaticStringDictionary.translate("Months"), itemId: 4 }
      ];

      this.AutomaticIntervalComboBox.set("items", items);
      this.AutomaticIntervalComboBox.set("selectedValue", 1);
    },

    recurringIntervalSelectedValueChanged: function (sender, selectedValue) {
      var panel = this.ScheduleRecurringDailyPanel;
      switch (selectedValue) {
        case daylyValue:
          panel.set("itemId", daylyPanelId);
          break;
        case weeklyValue:
          panel.set("itemId", weeklyPanelId);
          break;
        case monthlyValue:
          panel.set("itemId", monthlyPanelId);
          break;
        case yearlyValue:
          panel.set("itemId", yearlyPanelId);
          break;
        default:
          break;
      }
      this.refreshRecurringDailyPanel();
    },

    refreshRecurringDailyPanel: function () {
      if (this.ScheduleRecurringDailyPanel.get("isLoaded")) {
        this.ScheduleRecurringDailyPanel.refresh();
      } else {
        this.ScheduleRecurringDailyPanel.viewModel.$el.hide("fast").show("fast", _.bind(function() {
           this.ScheduleRecurringDailyPanel.refresh();
        }, this));
      }
    },

    changeDeliveryModeRecurring: function () {
      var enabled = !this.MessageContext.get("isReadonly") && this.DispatchContext.get("hasRecurringSchedule");
      this.setControlsProperties(
        'ScheduleRecurringIntervalComboBox',
        { isEnabled: enabled && this.ScheduleRecurringRadioButton.get("isChecked") },
        ['ScheduleRecurringDateDatePicker', 'ScheduleRecurringTimeComboBox', 'ScheduleRecurringTimezoneComboBox'],
        { isEnabled: enabled }
      );
    },

    updateVariantsSelector: function () {
      var variants = this.MessageContext.get("variants");

      this.DispatchContext.set("showAbTest", variants.length > 1);

      var variantToShow = [];
      for (var i = 0; i < variants.length; i++) {
        variantToShow.push(i);
      }

      this.ABVariantsSelector.viewModel.showVariants(variantToShow);
      if (!this.testStartedOrMessageReadonly()) {
        this.ABVariantsSelector.viewModel.enable();
        this.ABVariantsSelector.viewModel.setSelectedVariants(variantToShow, false);
      } else {
        this.ABVariantsSelector.viewModel.disable();
        this.ABVariantsSelector.viewModel.setSelectedVariants(this.DispatchContext.get("selectedVariants"), false);
      }
    },

    updateVariantsSelectorOnDispatchContextChange: function () {
      if (this.testStartedOrMessageReadonly()) {
        this.ABVariantsSelector.viewModel.disable();
        this.ABVariantsSelector.viewModel.setSelectedVariants(this.DispatchContext.get("selectedVariants"), false);
      } else {
        this.ABVariantsSelector.viewModel.enable();
      }
    },

    onAutomaticTimeKeyDown: function (e) {
      // Allow: backspace, delete, tab, escape, enter
      if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
        // Allow: Ctrl+A Ctrl+C Ctrl+V
        ((e.keyCode == 65 || e.keyCode == 67 || e.keyCode == 86) && e.ctrlKey === true) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
        return;
      }
      // Ensure that it is a number and stop the keypress
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
      }
    },

    onVariantDataSourceChangeIsBusy: function () {
      $("[data-sc-id='VariantsList'] .manualWinnerSelectButton")
        .off('click')
        .on('click', function (eventArgs) {
          var variantId = eventArgs.target.attributes["data-sc-ecm-variantId"].value;
          sitecore.trigger("dispatch:selectvariant", variantId);
        })
        .prop('disabled', !this.DispatchContext.get("abTestWaitingForWinner"));
    },

    initAbVariantSizeComboBox: function () {
      var items = [];
      for (var i = 1; i <= 100; i++) {
        items.push({ $displayName: i + "%", itemId: i });
      }

      this.ABVariantsSizeComboBox.set("items", items);
      this.ABVariantsSizeComboBox.set("selectedValue", 10);
    },

    updateVariantSize: function () {
      if (this.testStartedOrMessageReadonly() && this.DispatchContext.get("testSize")) {
        this.ABVariantsSizeComboBox.set("selectedValue", this.DispatchContext.get("testSize"));
      }
    },

    updateABTesting: function () {
      this.VariantDataSource.viewModel.refresh();

      if (this.testStartedOrMessageReadonly()) {
        if (this.DispatchContext.get("automaticTimeAmount")) {
          this.AutomaticTimeTextBox.set("text", this.DispatchContext.get("automaticTimeAmount"));
        }

        this.AutomaticIntervalComboBox.set("selectedValue", this.DispatchContext.get("automaticTimeMode"));

        if (this.DispatchContext.get("highestOpenRate")) {
          this.AutomationBestValueRadioButton.set("isChecked", false);
          this.AutomationOptionHighestRateRadioButton.set("isChecked", "OpenRate");
        }

        if (this.DispatchContext.get("bestValuePerVisit")) {
          this.AutomationOptionHighestRateRadioButton.set("isChecked", false);
          this.AutomationBestValueRadioButton.set("isChecked", "ValuePerVisit");
        }
      }
    },

    testStartedOrMessageReadonly: function () {
      return (this.MessageContext.get("isReadonly") || this.DispatchContext.get("abTestWaitingForWinner"));
    }
  });

  return deliveryTab;
});
