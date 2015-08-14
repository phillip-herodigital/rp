define(["jquery", "sitecore"], function ($, sitecore) {
  var model = sitecore.Definitions.Models.ControlModel.extend({
    initialize: function (options) {
      this._super();

      //data
      this.set("messageId", "");
      this.set("showAbTest", false);
      this.set("showCancelSchedulingButton", false);
      this.set("showPauseButton", false);
      this.set("showResumeButton", false);
      this.set("showScheduleButton", false);
      this.set("showScheduleTestButton", false);
      this.set("showSendMessageButton", false);
      this.set("showStartAbTestButton", false);
      this.set("showActivateTestButton", false);
      this.set("showActivateMessageButton", false);
      this.set("showDeactivateButton", false);
      this.set("hasSchedule", false);
      this.set("schedule", null);
      this.set("multiLanguageEnabled", false);
      this.set("selectWinnerAutomatically", false);
      this.set("abTestWaitingForWinner", false);
      this.set("selectedVariants", null);
      this.set("testSize", null);
      this.set("bestValuePerVisit", false);
      this.set("highestOpenRate", false);
      this.set("automaticTimeMode", null);
      this.set("automaticTimeAmount", null);
      this.set("hasRecurringSchedule", false);
      this.set("recurringSchedule", null);

      this.set("useNotificationEmail", false);
      this.set("notificationEmail", "");
      this.set("usePreferredLanguage", false);
      this.set("emulationMode", false);

      //state
      this.set("isBusy", true);
      this.set("messageNotFound", true);
      this.on("change:messageId", this.refresh, this);

      ////When currentState is changed back to Draft i.e. when emulation mode finishes
      sitecore.on("change:messageContext:currentState", _.bind(function(status, statusDescription) {
          if (status !== "Draft") {
              return;
          }

          this.refresh();
          sitecore.trigger("change:messageContext:nonReadonly");
      }, this));
    },

    refresh: function () {
      this.getContextFromServer();
    },

    getContextFromServer: function () {
      var messageId = this.get("messageId");
      if (!messageId) {
        return;
      }

      var dispatchRequest = { messageId: messageId };

      var options = {
        url: "/sitecore/api/ssc/EXM/LoadDispatch",
        data: dispatchRequest,
        type: "POST",
        success: $.proxy(this.success, this),
        error: $.proxy(this.error, this)
      };

      this.set("isBusy", true);
      this.request(options);
    },
    success: function (response) {
      if (response.error) {
        this.set("messageNotFound", true);
        this.set("isBusy", false);
        return;
      }
      if (response.notFound) {
        this.set("messageNotFound", true);
        this.set("isBusy", false);
        return;
      }
      if (!this.update(response.dispatchContext))
        return;

      //set state
      this.set("messageNotFound", false);
      this.set("isBusy", false);
    },
    update: function (dispatchContext) {
      if (!dispatchContext)
        return false;

      if (dispatchContext.abTestContext) {
        this.set("showAbTest", dispatchContext.abTestContext.showAbTest);
        this.set("selectWinnerAutomatically", dispatchContext.abTestContext.selectWinnerAutomatically);
        this.set("abTestWaitingForWinner", dispatchContext.abTestContext.abTestWaitingForWinner);
        this.set("selectedVariants", dispatchContext.abTestContext.selectedVariants);
        this.set("testSize", dispatchContext.abTestContext.testSize);
        this.set("bestValuePerVisit", dispatchContext.abTestContext.bestValuePerVisit);
        this.set("highestOpenRate", dispatchContext.abTestContext.highestOpenRate);
        this.set("automaticTimeMode", dispatchContext.abTestContext.automaticTimeMode);
        this.set("automaticTimeAmount", dispatchContext.abTestContext.automaticTimeAmount);
      }

      this.set("multiLanguageEnabled", dispatchContext.multiLanguageEnabled);


      this.set("useNotificationEmail", dispatchContext.useNotificationEmail);
      this.set("notificationEmail", dispatchContext.notificationEmail);
      this.set("usePreferredLanguage", dispatchContext.usePreferredLanguage);
      this.set("emulationMode", dispatchContext.emulationMode);

      if (dispatchContext.buttonState) {
        this.set("showCancelSchedulingButton", dispatchContext.buttonState.showCancelScheduling);
        this.set("showPauseButton", dispatchContext.buttonState.showPause);
        this.set("showResumeButton", dispatchContext.buttonState.showResume);
        this.set("showScheduleButton", dispatchContext.buttonState.showSchedule);
        this.set("showScheduleTestButton", dispatchContext.buttonState.showScheduleAbTest);
        this.set("showSendMessageButton", dispatchContext.buttonState.showSend);
        this.set("showStartAbTestButton", dispatchContext.buttonState.showStartAbTest);
        this.set("showActivateTestButton", dispatchContext.buttonState.showActivateTest);

        var isShowActivateMessage = dispatchContext.buttonState.showActivateMessage;
        this.set("showActivateMessageButton", isShowActivateMessage);
        if (isShowActivateMessage) {
          sitecore.trigger("change:messageContext:nonReadonly");
        }

        this.set("showDeactivateButton", dispatchContext.buttonState.showDeactivate);
      }

      if (!dispatchContext.schedule) {
        this.set("hasSchedule", false);
        this.set("schedule", null);

      } else {
        this.set("hasSchedule", dispatchContext.schedule.hasSchedule);
        this.set("schedule", dispatchContext.schedule);
      }

      if (!dispatchContext.recurringSchedule) {
        this.set("hasRecurringSchedule", false);
        this.set("recurringSchedule", null);
      } else {
        this.set("hasRecurringSchedule", dispatchContext.recurringSchedule.hasRecurringSchedule);
        this.set("recurringSchedule", dispatchContext.recurringSchedule);
      }

      if (dispatchContext.subscriberIdsHaveUncommittedReads) {
        sitecore.trigger("notify:recipientList:locked");
      }

      return true;
    },
    request: function (options) {
      $.ajax(options);
    },
    error: function (response) {
      console.log("ERROR");
      console.log(response);

      this.set("messageNotFound", true);
      this.set("isBusy", false);

      if (response && response.status === 403) {
        console.error("Not logged in, will reload page");
        window.top.location.reload(true);
      }
    }

  });

  var view = sitecore.Definitions.Views.ControlView.extend({
    initialize: function (options) {
      this._super();
      this.refresh();
    },

    refresh: function () {
      this.model.refresh();
    }
  });

  sitecore.Factories.createComponent("DispatchContext", model, view, ".sc-DispatchContext");
});
