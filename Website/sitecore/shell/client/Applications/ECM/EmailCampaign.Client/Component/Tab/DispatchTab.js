define(["sitecore", "/-/speak/v1/ecm/Validation.js", "/-/speak/v1/ecm/ComboBoxDataSource.js"],
function (sitecore, validation, comboBoxDataSource) {
  var daylyPanelId = "{7A98DD5E-E457-4A2A-AA74-CFF28BCAD3E2}",
      weeklyPanelId = "{05B4E5CE-79E9-4C39-8A11-25C927BAAC75}",
      monthlyPanelId = "{6460B91B-F5A4-4429-86FE-45D9FB673749}",
      yearlyPanelId = "{1EE096F9-EF6C-4D16-B749-E41669EA947D}",
      daylyValue = 1,
      weeklyValue = 2,
      monthlyValue = 3,
      yearlyValue = 4;

  return {
    init: function (contextApp) {
      var messageContext = contextApp.MessageContext;
      var messageBar = contextApp.MessageBar;

      if (!sitecore || !contextApp || !messageContext || !messageBar) {
        return;
      }

      var context = contextApp.DispatchContext;
      var schedule = context.get("schedule");

      initButtons();
      initSchedule();
      initNotification();
      initMultilanguage();
      initEmulation();
      initMessageBar();
      initAbTesting();

      var pageHasRecurring = contextApp.ScheduleRecurringRadioButton != undefined;

      if (pageHasRecurring) {
        initScheduleRecurring();

        var timePanelLoaded = false;
        var dailyPanelLoaded = false;

        sitecore.on("ScheduleRecurringTimePanel:initialized", function () {
          timePanelLoaded = true;
          raiseOnLoadComplete();
        });

        sitecore.on("ScheduleRecurringDailyPanel:initialized", function () {
          dailyPanelLoaded = true;
          raiseOnLoadComplete();
        });

        function raiseOnLoadComplete() {
          if (timePanelLoaded && dailyPanelLoaded) {
            sitecore.trigger("dispatchTab:initialized", contextApp);
          }
        }
      } else {
        sitecore.trigger("dispatchTab:initialized", contextApp);
      }

      function initScheduleRecurring() {
        initRecurringIntervalsComboBox();

        sitecore.on("change:messageContext", function () {
          changeDeliveryModeRecurring(contextApp);
        }, this);

        context.on("change:hasRecurringSchedule", function () {
          changeDeliveryModeRecurring(contextApp);
        });

        contextApp.MessageContext.on("change:isReadOnly", function () {
          changeDeliveryModeRecurring(contextApp);
        });

        contextApp.DispatchContext.on("change:recurringSchedule", function () {
          var recurringSchedule = contextApp.DispatchContext.get("recurringSchedule");
          if (recurringSchedule && recurringSchedule.scheduleType !== null) {
            var scheduleType = recurringSchedule.scheduleType;
            if ([weeklyValue, monthlyValue, yearlyValue].indexOf(scheduleType) !== -1) {
              contextApp.ScheduleRecurringIntervalComboBox.set("selectedValue", scheduleType);
            } else if ([0, daylyValue].indexOf(scheduleType) !== -1) {
              if (contextApp.ScheduleRecurringIntervalComboBox.get("selectedValue") === daylyValue) {
                recurringIntervalSelectedValueChanged(null, daylyValue);
              } else {
                contextApp.ScheduleRecurringIntervalComboBox.set("selectedValue", daylyValue);
              }
            }
          }
        });

        function changeDeliveryModeRecurring() {
          if (!contextApp) {
            return;
          }

          var enabled = !contextApp.MessageContext.get("isReadonly") && context.get("hasRecurringSchedule");

          if (contextApp.ScheduleRecurringRadioButton) {
            contextApp.ScheduleRecurringIntervalComboBox.set("isEnabled", enabled && contextApp.ScheduleRecurringRadioButton.get("isChecked"));
          }
          if (contextApp.ScheduleRecurringDateDatePicker) {
            contextApp.ScheduleRecurringDateDatePicker.set("isEnabled", enabled);
          }
          if (contextApp.ScheduleRecurringTimeComboBox) {
            contextApp.ScheduleRecurringTimeComboBox.set("isEnabled", enabled);
          }
          if (contextApp.ScheduleRecurringTimezoneComboBox) {
            contextApp.ScheduleRecurringTimezoneComboBox.set("isEnabled", enabled);
          }
        }

        function initRecurringIntervalsComboBox() {
          var items = [
            { $displayName: contextApp.DispatchStringDictionary.translate("Daily"), itemId: daylyValue },
            { $displayName: contextApp.DispatchStringDictionary.translate("Weekly"), itemId: weeklyValue },
            { $displayName: contextApp.DispatchStringDictionary.translate("Monthly"), itemId: monthlyValue },
            { $displayName: contextApp.DispatchStringDictionary.translate("Yearly"), itemId: yearlyValue }
          ];

          contextApp.ScheduleRecurringIntervalComboBox.set("items", items);
          contextApp.ScheduleRecurringIntervalComboBox.set("selectedValue", daylyValue);
          contextApp.ScheduleRecurringIntervalComboBox.on("change:selectedValue", recurringIntervalSelectedValueChanged, contextApp);
        }

        function recurringIntervalSelectedValueChanged(sender, selectedValue, x) {
          switch (selectedValue) {
            case daylyValue:
              contextApp.ScheduleRecurringDailyPanel.set("itemId", daylyPanelId);
              contextApp.ScheduleRecurringDailyPanel.refresh();
              break;
            case weeklyValue:
              contextApp.ScheduleRecurringDailyPanel.set("itemId", weeklyPanelId);
              contextApp.ScheduleRecurringDailyPanel.refresh();
              break;
            case monthlyValue:
              contextApp.ScheduleRecurringDailyPanel.set("itemId", monthlyPanelId);
              contextApp.ScheduleRecurringDailyPanel.refresh();
              break;
            case yearlyValue:
              contextApp.ScheduleRecurringDailyPanel.set("itemId", yearlyPanelId);
              contextApp.ScheduleRecurringDailyPanel.refresh();
              break;
            default:
              break;
          }
        }
      }

      function initAbTesting() {

        initVariantsSelector();
        initAbVariantSizeComboBox();
        setupAbWinnerTabControl();
        initAutomaticModeControls();

        function initAutomaticModeControls() {

          initAutomaticIntervalsComboBox();

          sitecore.on("change:messageContext", function () { update(); });
          context.on("change:isBusy", function () { update(); });
          contextApp.VariantDataSource.on("change:isBusy", function () {
            if (context.get("abTestWaitingForWinner")) {
              $("[data-sc-id='VariantsList'] .manualWinnerSelectButton").prop('disabled', false);
            } else {
              $("[data-sc-id='VariantsList'] .manualWinnerSelectButton").prop('disabled', true);
            }

            $("[data-sc-id='VariantsList'] .manualWinnerSelectButton").unbind("click");
            $("[data-sc-id='VariantsList'] .manualWinnerSelectButton").click(function (eventArgs) {
              var variantId = eventArgs.target.attributes["data-sc-ecm-variantId"].value;
              sitecore.trigger("dispatch:selectvariant", variantId);
            });
          });

          //TODO: Create correct dependency to Validation.js and use validation.validateNumericInput() instead of copy paste
          $("[data-sc-id='AutomaticTimeTextBox']").keydown(function (e) {
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
          });

          contextApp.AutomaticTimeTextBox.on("change:text", function () {
            var formattedValue = parseInt(contextApp.AutomaticTimeTextBox.get("text")).toString();
            if (formattedValue != contextApp.AutomaticTimeTextBox.get("text")) {
              contextApp.AutomaticTimeTextBox.set("text", formattedValue);
            }
          });

          function initAutomaticIntervalsComboBox() {
            var items = [
              { $displayName: contextApp.AutomaticStringDictionary.translate("Hours"), itemId: 1 },
              { $displayName: contextApp.AutomaticStringDictionary.translate("Days"), itemId: 2 },
              { $displayName: contextApp.AutomaticStringDictionary.translate("Weeks"), itemId: 3 },
              { $displayName: contextApp.AutomaticStringDictionary.translate("Months"), itemId: 4 }
            ];

            contextApp.AutomaticIntervalComboBox.set("items", items);
            contextApp.AutomaticIntervalComboBox.set("selectedValue", 1);
          }

          function update() {
            contextApp.VariantDataSource.viewModel.refresh();

            if (testStartedOrMessageReadonly()) {
              if (context.get("automaticTimeAmount") && context.get("automaticTimeAmount") != 0) {
                contextApp.AutomaticTimeTextBox.set("text", context.get("automaticTimeAmount"));
              }

              contextApp.AutomaticIntervalComboBox.set("selectedValue", context.get("automaticTimeMode"));

              if (context.get("highestOpenRate")) {
                contextApp.AutomationBestValueRadioButton.set("isChecked", false);
                contextApp.AutomationOptionHighestRateRadioButton.set("isChecked", "OpenRate");
              }

              if (context.get("bestValuePerVisit")) {
                contextApp.AutomationOptionHighestRateRadioButton.set("isChecked", false);
                contextApp.AutomationBestValueRadioButton.set("isChecked", "ValuePerVisit");
              }
            }
          }
        }

        function initAbVariantSizeComboBox() {
          var items = [];
          for (var i = 1; i <= 100; i++) {
            items.push({
              $displayName: i + "%",
              itemId: i
            });
          }

          contextApp.ABVariantsSizeComboBox.set("items", items);
          contextApp.ABVariantsSizeComboBox.set("selectedValue", 10);
          context.on("change:isBusy", function () { update(); });
          sitecore.on("change:messageContext", function () { update(); });

          function update() {
            if (testStartedOrMessageReadonly() && context.get("testSize")) {
              contextApp.ABVariantsSizeComboBox.set("selectedValue", context.get("testSize"));
            }
          }
        }

        function initVariantsSelector() {
          sitecore.on("change:messageContext", function () {
            var variants = contextApp.MessageContext.get("variants");

            context.set("showAbTest", variants.length > 1);

            if (!variants) {
              return;
            }

            var variantToShow = [];
            for (var i = 0; i < variants.length; i++) {
              variantToShow.push(i);
            }

            contextApp.ABVariantsSelector.viewModel.showVariants(variantToShow);
            if (!testStartedOrMessageReadonly()) {
              contextApp.ABVariantsSelector.viewModel.enable();
              contextApp.ABVariantsSelector.viewModel.setSelectedVariants(variantToShow);
            } else {
              contextApp.ABVariantsSelector.viewModel.disable();
              contextApp.ABVariantsSelector.viewModel.setSelectedVariants(context.get("selectedVariants"));
            }
          });

          context.on("change:isBusy", function () {
            if (testStartedOrMessageReadonly()) {
              contextApp.ABVariantsSelector.viewModel.disable();
              contextApp.ABVariantsSelector.viewModel.setSelectedVariants(context.get("selectedVariants"));
            } else {
              contextApp.ABVariantsSelector.viewModel.enable();
            }
          });
        }

        function setupAbWinnerTabControl() {
          context.on("change:isBusy", function () {
            if (context.get("showAbTest") && !context.get("selectWinnerAutomaticaly") && !context.get("isBusy") && testStartedOrMessageReadonly()) {
              contextApp.ABWinnerTabControl.viewModel.selectedTab(contextApp.ABWinnerTabControl.viewModel.tabs()[1]);
            }
          });
        }

        function testStartedOrMessageReadonly() {
          return (contextApp.MessageContext.get("isReadonly") || context.get("abTestWaitingForWinner"));
        }
      }

      function initMessageBar() {
        sitecore.on("change:messageContext:currentState", function addStatusMessage(status, statusDescription) {
          if (!statusDescription) {
            return;
          }

          messageBar.removeMessage(function (message) { return message.id === "messagecontext.notification.statuschanged"; });
          var messageToAdd = { id: "messagecontext.notification.statuschanged", text: statusDescription, actions: [], closable: true };
          messageBar.addMessage("notification", messageToAdd);
          context.viewModel.refresh();
        });
      }

      function initButtons() {
        if (!contextApp || !messageContext)
          return;

        // Save message
        contextApp.on("dispatch:send", function () { dispatch("dispatch", false); });
        contextApp.on("dispatch:schedule", function () {
          if (contextApp.MessageContext.get("messageType") == "Trickle") {
            showTriggeredScheduleConfirmationDialog(function () { parametrizedAction("activate", getDispatchDetails()); });
          } else {
            dispatch("dispatch", true);
          }
        });
        contextApp.on("dispatch:starttest", function () { dispatch("starttest", false); });
        contextApp.on("dispatch:scheduletest", function () { dispatch("starttest", true); });

        contextApp.on("dispatch:cancelscheduling", function () { showCancelSchedulingConfirmationDialog(function () { action("cancelscheduling"); }); });
        contextApp.on("dispatch:pause", function () { action("pause"); });
        contextApp.on("dispatch:resume", function () { action("resume"); });
        sitecore.on("dispatch:selectvariant", function (variantid) {
          var actionDetails = {
            messageId: messageContext.get("messageId"),
            variant: variantid
          };

          showManualWinnerSelectionConfirmationDialog(function () { parametrizedAction("selectwinner", actionDetails); }, contextApp.MessageContext.get("messageType"));
        });
        sitecore.on("dispatch:pipeline:success:starttest", function () {
          contextApp.VariantDataSource.viewModel.refresh();
        });

        contextApp.on("dispatch:activate", function () { showActivateConfirmationDialog(function () { action("activate"); }); });
        contextApp.on("dispatch:deactivate", function () { showDeactivateConfirmationDialog(function () { action("deactivate"); }); });
        contextApp.on("dispatch:activatetest", function () { showActivateConfirmationDialog(function () { parametrizedAction("starttest", getDispatchDetails()); }); });

        function getDispatchDetails() {
          var scheduleObj = {
            hasSchedule: context.get("hasSchedule"),
            time: contextApp.ScheduledTimeComboBox.get("selectedItemId"),
            timezone: contextApp.ScheduleTimezoneComboBox.get("selectedItemId"),
            date: contextApp.ScheduledDateDatePicker.get("date")
          };

          if (contextApp.ScheduledEndTimeComboBox) {
            scheduleObj.endTime = contextApp.ScheduledEndTimeComboBox.get("selectedItemId");
          }

          if (contextApp.ScheduledEndDateDatePicker) {
            scheduleObj.endDate = contextApp.ScheduledEndDateDatePicker.get("date");
          }

          var usePreferredLanguage = contextApp.UsePreferredLanguageEnableCheckBox.get("isChecked");
          var useNotificationEmail = contextApp.NotificationEnableCheckBox.get("isChecked");
          var notificationEmail = contextApp.NotificationEmailValueTextBox.get("text");
          var emultaionMode = contextApp.EmulationModeCheckBox.get("isChecked");

          var dispatchDetails = {
            messageId: messageContext.get("messageId"),
            schedule: scheduleObj,
            usePreferredLanguage: usePreferredLanguage,
            useNotificationEmail: useNotificationEmail,
            notificationEmail: notificationEmail,
            emultaionMode: emultaionMode
          };

          if (context.get("showAbTest")) {

            var abTest = {
              selectedVariants: contextApp.ABVariantsSelector.viewModel.getSelectedVariants(),
              testSize: contextApp.ABVariantsSizeComboBox.get("selectedValue"),
              selectWinnerAutomaticaly: contextApp.ABWinnerTabControl.viewModel.selectedTabIndex() == 0,
              bestValuePerVisit: contextApp.AutomationBestValueRadioButton.get("isChecked"),
              highestOpenRate: contextApp.AutomationOptionHighestRateRadioButton.get("isChecked"),
              automaticTimeMode: contextApp.AutomaticIntervalComboBox.get("selectedValue"),
              automaticTimeAmount: contextApp.AutomaticTimeTextBox.get("text")
            };

            dispatchDetails.abTest = abTest;
          }

          sitecore.trigger("dispatchTab:dispatchDetailsGathering", dispatchDetails);


          return dispatchDetails;
        }

        sitecore.on("message:delivery:dispatch", function (actionName, isSchedule) {
          doDispatch(actionName, isSchedule);
        });

        function dispatch(actionName, isSchedule) {
          sitecore.trigger("message:delivery:verifyMessage", actionName, isSchedule);
        };

        function doDispatch(actionName, isSchedule) {
          var dispatchDetails = getDispatchDetails();

          contextApp.currentContext = {
            errorCount: 0,
            messageBar: messageBar,
            request: dispatchDetails,
            actionName: actionName
          };

          var currentContext = clone(contextApp.currentContext);

          var recurringSchedule = dispatchDetails.recurringSchedule;
          if (isSchedule) {
            if (typeof recurringSchedule !== "undefined" && recurringSchedule !== null && recurringSchedule.hasRecurringSchedule === true) {
              if (typeof recurringSchedule.validation !== "undefined" && recurringSchedule.validation !== null && recurringSchedule.validation.isValid === false) {
                Array.prototype.forEach.call(recurringSchedule.validation.errors, function (error) {
                  var errorText = sitecore.Resources.Dictionary.translate(error);
                  var messagetoAddError = { text: errorText, actions: [], closable: true };
                  currentContext.messageBar.addMessage("error", messagetoAddError);
                });
                return;
              }
            }
            sitecore.Pipelines.DispatchMessage.execute({ app: contextApp, currentContext: currentContext });
          } else {
            var confirmationDialogParameters = { app: contextApp, currentContext: currentContext, dispatchDetails: dispatchDetails };
            showDispatchConfirmationDialog(confirmationDialogParameters);
          }
        };


        function action(actionName) {
          var actionDetails = { messageId: messageContext.get("messageId") };

          contextApp.currentContext = {
            errorCount: 0,
            messageBar: messageBar,
            request: actionDetails,
            actionName: actionName
          };

          var context = clone(contextApp.currentContext);

          sitecore.Pipelines.DispatchMessage.execute({ app: contextApp, currentContext: context });
        };

        function parametrizedAction(actionName, requestParameters) {
          contextApp.currentContext = {
            errorCount: 0,
            messageBar: messageBar,
            request: requestParameters,
            actionName: actionName
          };

          var context = clone(contextApp.currentContext);

          sitecore.Pipelines.DispatchMessage.execute({ app: contextApp, currentContext: context });
        };

        function showDispatchConfirmationDialog(confirmationDialogParameters) {
          if (contextApp["showDispatchConfirmationDialog"] === undefined) {
            insertAndShowConfirmationDialog("show", confirmationDialogParameters);
          } else {
            sitecore.trigger("dispatch:confirmation:dialog:show", messageContext.get("languageName"), confirmationDialogParameters);
          }

          function insertAndShowConfirmationDialog(methodName, dialogParameters) {
            if (contextApp["showDispatchConfirmationDialog"] === undefined) {
              contextApp.insertRendering("{0EAF272C-EF39-4155-A4E1-B8CF8FFF2F46}", { $el: $("body") }, function (subApp) {
                contextApp["showDispatchConfirmationDialog"] = subApp;
                sitecore.trigger("dispatch:confirmation:dialog:" + methodName, messageContext.get("languageName"), dialogParameters);
              });
            }
          };
        };

        function showCancelSchedulingConfirmationDialog(callBack) {
          if (contextApp["showCancelSchedulingConfirmationDialog"] === undefined) {
            insertAndShowCancelSchedulingConfirmationDialog("show", callBack);
          } else {
            sitecore.trigger("dispatch:cancelscheduling:confirmation:dialog:show", callBack);
          }

          function insertAndShowCancelSchedulingConfirmationDialog(methodName, callBackMethod) {
            if (contextApp["showCancelSchedulingConfirmationDialog"] === undefined) {
              contextApp.insertRendering("{D9AA3D3A-4986-465F-AC25-C00C6244403D}", { $el: $("body") }, function (subApp) {
                contextApp["showCancelSchedulingConfirmationDialog"] = subApp;
                sitecore.trigger("dispatch:cancelscheduling:confirmation:dialog:" + methodName, callBackMethod);
              });
            }
          };
        };

        function showManualWinnerSelectionConfirmationDialog(callBack, messageType) {
          if (contextApp["showManualWinnerSelectionConfirmationDialog"] === undefined) {
            insertAndShowCancelSchedulingConfirmationDialog("show", callBack);
          } else {
            sitecore.trigger("dispatch:manualwinner:confirmation:dialog:show", callBack, messageType);
          }

          function insertAndShowCancelSchedulingConfirmationDialog(methodName, callBackMethod) {
            if (contextApp["showManualWinnerSelectionConfirmationDialog"] === undefined) {
              contextApp.insertRendering("{125864A1-E4AF-4A6A-87D5-A3534894FE02}", { $el: $("body") }, function (subApp) {
                contextApp["showManualWinnerSelectionConfirmationDialog"] = subApp;
                sitecore.trigger("dispatch:manualwinner:confirmation:dialog:" + methodName, callBackMethod, messageType);
              });
            }
          };
        };

        function showActivateConfirmationDialog(callBack) {
          if (contextApp["showActivateConfirmationDialog"] === undefined) {
            insertAndShowCancelSchedulingConfirmationDialog("show", callBack);
          } else {
            sitecore.trigger("dispatch:triggered:activate:dialog:show", callBack, messageContext.get("languageName"), contextApp.UsePreferredLanguageEnableCheckBox.get("isChecked"));
          }

          function insertAndShowCancelSchedulingConfirmationDialog(methodName, callBackMethod) {
            if (contextApp["showActivateConfirmationDialog"] === undefined) {
              contextApp.insertRendering("{AF46BCDC-AAB7-49C0-91D8-FE48D7CDC94A}", { $el: $("body") }, function (subApp) {
                contextApp["showActivateConfirmationDialog"] = subApp;
                sitecore.trigger("dispatch:triggered:activate:dialog:" + methodName, callBackMethod, messageContext.get("languageName"), contextApp.UsePreferredLanguageEnableCheckBox.get("isChecked"));
              });
            }
          };
        };

        function showDeactivateConfirmationDialog(callBack) {
          if (contextApp["showDeactivateConfirmationDialog"] === undefined) {
            insertAndShowCancelSchedulingConfirmationDialog("show", callBack);
          } else {
            sitecore.trigger("dispatch:triggered:deactivate:dialog:show", callBack);
          }

          function insertAndShowCancelSchedulingConfirmationDialog(methodName, callBackMethod) {
            if (contextApp["showDeactivateConfirmationDialog"] === undefined) {
              contextApp.insertRendering("{A3654969-6B3D-4DDA-817E-38B7CA18D998}", { $el: $("body") }, function (subApp) {
                contextApp["showDeactivateConfirmationDialog"] = subApp;
                sitecore.trigger("dispatch:triggered:deactivate:dialog:" + methodName, callBackMethod);
              });
            }
          };
        };

        function showTriggeredScheduleConfirmationDialog(callBack) {
          if (contextApp["showTriggeredScheduleConfirmationDialog"] === undefined) {
            insertAndShowCancelSchedulingConfirmationDialog("show", callBack);
          } else {
            sitecore.trigger("dispatch:triggered:schedule:dialog:show", callBack);
          }

          function insertAndShowCancelSchedulingConfirmationDialog(methodName, callBackMethod) {
            if (contextApp["showTriggeredScheduleConfirmationDialog"] === undefined) {
              contextApp.insertRendering("{C80C9537-1D83-4A14-ABC6-424C51B3913F}", { $el: $("body") }, function (subApp) {
                contextApp["showTriggeredScheduleConfirmationDialog"] = subApp;
                sitecore.trigger("dispatch:triggered:schedule:dialog:" + methodName, callBackMethod);
              });
            }
          };
        };
      }

      function initSchedule() {
        if (!contextApp)
          return;

        resetScheduleDate();

        context.on("change:isBusy", function () {
          setupScheduleRadioButtons();
        });

        context.on("change:isBusy", function () {
          if (context.get("isBusy") || !context.get("hasSchedule") || !schedule) {
            return;
          }

          contextApp.ScheduledDateDatePicker.set("date", schedule.date);

          //TODO: It is not possible to set the selected item seeSPEAK error TFS 5404
          contextApp.ScheduledTimeComboBox.set("selectedValue", schedule.time);
          contextApp.ScheduleTimezoneComboBox.set("selectedValue", schedule.timeZone);

          if (contextApp.ScheduledEndDateDatePicker && schedule.endDate) {
            contextApp.ScheduledEndDateDatePicker.set("date", schedule.endDate);
          }

          if (contextApp.ScheduledEndTimeComboBox && schedule.endTime) {
            contextApp.ScheduledEndTimeComboBox.set("selectedValue", schedule.endTime);
          }
        });

        sitecore.on("change:messageContext", function () {
          changeDeliveryMode(contextApp);
        }, this);

        context.on("change:hasSchedule", function () {
          changeDeliveryMode(contextApp);
        });

        contextApp.MessageContext.on("change:isReadOnly", function () {
          changeDeliveryMode(contextApp);
        });

        contextApp.ScheduleTimezoneComboBoxDataSource.on("change:selectedItem", function () {
          if (context.get("hasSchedule") && schedule && schedule.timeZone) {
            contextApp.ScheduleTimezoneComboBox.set("selectedValue", schedule.timeZone);
          } else {
            contextApp.ScheduleTimezoneComboBox.set("selectedItem", contextApp.ScheduleTimezoneComboBoxDataSource.get("selectedItem"));
          }
        });

        contextApp.ScheduledTimeComboBoxDataSource.on("change:selectedItem", function () {
          if (context.get("hasSchedule") && schedule && schedule.time) {
            contextApp.ScheduledTimeComboBox.set("selectedValue", schedule.time);
          } else {
            comboBoxDataSource.setNearestTimeInComboBox(contextApp.ScheduledTimeComboBoxDataSource, contextApp.ScheduledTimeComboBox);
          }
        });

        if (contextApp.ScheduledEndTimeComboBoxDataSource) {
          contextApp.ScheduledEndTimeComboBoxDataSource.on("change:selectedItem", function () {
            if (context.get("hasSchedule") && schedule && schedule.endTime) {
              contextApp.ScheduledEndTimeComboBox.set("selectedValue", schedule.endTime);
            } else {
              comboBoxDataSource.setNearestTimeInComboBox(contextApp.ScheduledEndTimeComboBoxDataSource, contextApp.ScheduledEndTimeComboBox);
            }
          });
        }

        context.on("change:showAbTest", function () {
          if (!context.get("isBusy")) {
            setupSendScheduleButtons(contextApp);
          }
        });

        context.on("change:hasSchedule", function () {
          if (!context.get("isBusy")) {
            setupSendScheduleButtons(contextApp);
          }
        });

        context.on("change:hasRecurringSchedule", function () {
          if (!context.get("isBusy")) {
            setupSendScheduleButtons(contextApp);
          }
        });

        contextApp.SendMessageNowRadioButton.on("change:isChecked", function () {
          if (this.get("isChecked")) {
            context.set("hasSchedule", false);
            context.set("hasRecurringSchedule", false);
          }
        });

        contextApp.ScheduleDeliveryRadioButton.on("change:isChecked", function () {
          if (this.get("isChecked")) {
            context.set("hasSchedule", true);
            context.set("hasRecurringSchedule", false);
          }
        });

        if (contextApp.ScheduleRecurringRadioButton) {
          contextApp.ScheduleRecurringRadioButton.on("change:isChecked", function () {
            if (this.get("isChecked")) {
              context.set("hasSchedule", false);
              context.set("hasRecurringSchedule", true);
            }
          });
        }

        function resetScheduleDate() {
          //setting current day date
          var now = new Date();
          var convertedDate = contextApp.ScheduledDateDatePicker.viewModel.convertToISODate(now);
          contextApp.ScheduledDateDatePicker.set("date", convertedDate);
        }

        function setupScheduleRadioButtons() {
          if (context.get("hasSchedule")) {
            if (pageHasRecurring) {
              contextApp.ScheduleRecurringRadioButton.set("isChecked", false);
            }
            contextApp.SendMessageNowRadioButton.set("isChecked", false);
            contextApp.ScheduleDeliveryRadioButton.set("isChecked", "on");
          } else if (context.get("hasRecurringSchedule") && pageHasRecurring) {
            contextApp.ScheduleRecurringRadioButton.set("isChecked", "on");
            contextApp.ScheduleDeliveryRadioButton.set("isChecked", false);
            contextApp.SendMessageNowRadioButton.set("isChecked", false);
          } else {
            if (pageHasRecurring) {
              contextApp.ScheduleRecurringRadioButton.set("isChecked", false);
            }
            contextApp.ScheduleDeliveryRadioButton.set("isChecked", false);
            contextApp.SendMessageNowRadioButton.set("isChecked", "on");
          }
        }
      }

      function initNotification() {
        if (!contextApp)
          return;

        sitecore.on("change:messageContext", function () {
          setAvalibilityOfNotificationTextBox(contextApp);
        }, this);

        contextApp.NotificationEnableCheckBox.on("change:isChecked", function () {
          setAvalibilityOfNotificationTextBox(contextApp);
        });

        contextApp.MessageContext.on("change:isReadOnly", function () {
          setAvalibilityOfNotificationTextBox(contextApp);
        });
      }

      function initMultilanguage() {
        if (!contextApp)
          return;

        sitecore.on("language:addednew", function () {
          context.viewModel.refresh();
        });

        sitecore.on("change:messageContext", function () {
          setAvalibilityMultiLanguageDispatch(contextApp);
        }, this);

        context.on("change:multiLanguageEnabled", function () {
          setAvalibilityMultiLanguageDispatch(contextApp);
        });

        contextApp.MessageContext.on("change:isReadOnly", function () {
          setAvalibilityMultiLanguageDispatch(contextApp);
        });
      }

      //triggers button depends on current mode selected
      function setupSendScheduleButtons() {
        if (!contextApp)
          return;

        //all buttons are hidden, so nothing to trigger
        if (!contextApp.StartTestButton.get("isVisible") &&
            !contextApp.SendButton.get("isVisible") &&
            !contextApp.ScheduleTestButton.get("isVisible") &&
            !contextApp.ScheduleButton.get("isVisible") &&
            !contextApp.ActivateMessageButton.get("isVisible") &&
            !contextApp.ActivateTestButton.get("isVisible")
        ) {
          return;
        }

        if (context.get("hasSchedule") || context.get("hasRecurringSchedule")) {
          if (context.get("showAbTest")) {
            resetButtons();
            context.set("showScheduleTestButton", true);
          } else {
            resetButtons();
            context.set("showScheduleButton", true);
          }
        } else {
          if (context.get("showAbTest")) {
            resetButtons();
            if (contextApp.MessageContext.get("messageType") == "Trickle") {
              context.set("showActivateTestButton", true);
            } else {
              context.set("showStartAbTestButton", true);
            }
          } else {
            resetButtons();
            if (contextApp.MessageContext.get("messageType") == "Trickle") {
              context.set("showActivateMessageButton", true);
            } else {
              context.set("showSendMessageButton", true);
            }
          }
        }

        function resetButtons() {
          context.set("showScheduleTestButton", false);
          context.set("showScheduleButton", false);
          context.set("showActivateTestButton", false);
          context.set("showStartAbTestButton", false);
          context.set("showActivateMessageButton", false);
          context.set("showSendMessageButton", false);
        }
      }

      function changeDeliveryMode() {
        if (!contextApp)
          return;

        var enabled = !contextApp.MessageContext.get("isReadonly") && context.get("hasSchedule");

        contextApp.ScheduledDateDatePicker.set("isEnabled", enabled);
        contextApp.ScheduledTimeComboBox.set("isEnabled", enabled);
        contextApp.ScheduleTimezoneComboBox.set("isEnabled", enabled);

        if (contextApp.ScheduledEndDateDatePicker) {
          contextApp.ScheduledEndDateDatePicker.set("isEnabled", enabled);
        }

        if (contextApp.ScheduledEndTimeComboBox) {
          contextApp.ScheduledEndTimeComboBox.set("isEnabled", enabled);
        }
      }

      function setAvalibilityOfNotificationTextBox() {
        if (!contextApp)
          return;

        var enabled = !contextApp.MessageContext.get("isReadonly") && contextApp.NotificationEnableCheckBox.get("isChecked");

        contextApp.NotificationEmailValueTextBox.set("isEnabled", enabled);
      }

      function setAvalibilityMultiLanguageDispatch() {
        if (!contextApp)
          return;

        var enabled = !contextApp.MessageContext.get("isReadonly") && context.get("multiLanguageEnabled");

        contextApp.UsePreferredLanguageEnableCheckBox.set("isEnabled", enabled);
      }

      function initEmulation() {
        contextApp.EmulationBorder.set("isVisible", contextApp.EmulationExpander.get("isExpanded"));

        contextApp.EmulationExpander.on("change:isExpanded", function () {
          contextApp.EmulationBorder.viewModel.$el.toggle(250);
        }
        );
      }
    }
  };
});