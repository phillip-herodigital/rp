define(["sitecore", "/-/speak/v1/EDS/fileDownloader.js", "/-/speak/v1/EDS/edsUtil.js"], function (sitecore, fileDownloader, edsUtil) {
  return sitecore.Definitions.App.extend({
    initialized: function() {
      this.on({
        "app:loaded": this.triggerLoaded,
        "exportsuppressiondialog:hide": this.hideDialog,
        "exportsuppressiondialog:submit": this.submitAction
      }, this);
    },

    triggerLoaded: function() {
      sitecore.trigger("eds:dialog:loaded", this);
    },

    showDialog: function(dialogParams) {
      dialogParams = dialogParams || {};
      this.contextApp = dialogParams.contextApp || this;

      if (dialogParams.token) {
        this.removeMessages(dialogParams.token);
      }

      this.FullListRadioButton.set("isChecked", !dialogParams.isDateRange);
      this.DateRangeRadioButton.set("isChecked", dialogParams.isDateRange);

      this.setDateValue(dialogParams.startDate, this.StartDateDatePicker, this.StartDateTimePicker);
      this.setDateValue(dialogParams.endDate, this.EndDateDatePicker, this.EndDateTimePicker);
      
      this.DialogWindow.show();
    },

    hideDialog: function() {
      this.DialogWindow.hide();
    },

    submitAction: function() {
      this.MessageBar.removeMessages();

      var startDate = this.StartDateDatePicker.get("date");
      var endDate = this.EndDateDatePicker.get("date");

      var options = {};
      options.isDateRange = this.DateRangeRadioButton.get("isChecked");
      if (options.isDateRange) {

        if (startDate && endDate && startDate > endDate) {
          this.MessageBar.addMessage('error', sitecore.Resources.Dictionary.translate("The end date must be later than the start date. Change the end date and try again."));
          return;
        }

        if (startDate) {
          options.startDate = this.convertDateKind(startDate, true);
        }

        if (endDate) {
          options.endDate = this.convertDateKind(endDate, true);
        }
      }

      options.token = new Date().getTime();
      this.hasCompleted = false;

      setTimeout(function() {
        this.downloadInProgress(options);
      }.bind(this), 2000);
      
      fileDownloader.download("/sitecore/api/ssc/EDS/ExportSuppression", options, this.downloadComplete, this.downloadError, this);
      this.hideDialog();
    },

    downloadInProgress: function(options) {
      if (!this.downloadCompleted) {
        var message = {
          id: "exportinprogress" + options.token,
          text: "",
          actions: [],
          closable: true,
          temporary: true
        };
        message.text = sitecore.Resources.Dictionary.translate("The list is being exported. A notification appears when the export is complete. You can continue your work.");
        this.contextApp.MessageBar.addMessage("notification", message);
      }
    },

    downloadComplete: function (options) {
      this.downloadCompleted = true;
      this.removeMessages(options.token);
    },

    downloadError: function (options, cookieValue) {
      this.downloadComplete(options);

      var message = {
        id: "exporterror" + options.token,
        text: "",
        actions: [{ text: sitecore.Resources.Dictionary.translate("Try again."), action: "trigger:suppression:export({\"exportOptions\":" + JSON.stringify(options) + "})" }],
        closable: false
      };

      if (cookieValue.toLowerCase() === "true") {
        message.text = sitecore.Resources.Dictionary.translate("The date range is invalid. Please select a date range that is within the range of the list.");
        } else {
        message.text = sitecore.Resources.Dictionary.translate("An error occurred and the list was not exported.") + " " +
          sitecore.Resources.Dictionary.translate("Check the log file for details.");
      }

      this.contextApp.MessageBar.addMessage("warning", message);
    },

    removeMessages: function(token) {
      token = token || "";
      this.contextApp.MessageBar.removeMessage(function(oldMessage) { return oldMessage.id === "exportinprogress" + token; });
      this.contextApp.MessageBar.removeMessage(function(oldMessage) { return oldMessage.id === "exporterror" + token; });
    },
    
    convertDateKind: function (isoDate, fromLocaltoUtc) {
      var date = sitecore.Helpers.date.parseISO(isoDate);
      var convertedDate = new Date(date * 1 + date.getTimezoneOffset() * 60000 * (fromLocaltoUtc ? 1 : -1));
      return sitecore.Helpers.date.toISO(convertedDate);
    },

    setDateValue: function (dateValue, datePicker, timePicker) {
      var startTime = "T000000";
      if (sitecore.Helpers.date.isISO(dateValue)) {
        dateValue = this.convertDateKind(dateValue, false);
        datePicker.set("date", dateValue);

        startTime = dateValue.substring(8) || startTime;
      } else {
        datePicker.viewModel.setDate(null);
      }

      timePicker.set("time", startTime);    
    }
  });
});