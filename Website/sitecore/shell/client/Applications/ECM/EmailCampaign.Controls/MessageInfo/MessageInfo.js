define(["sitecore", "underscore"], function (sitecore) {
  var model = sitecore.Definitions.Models.ControlModel.extend({
    initialize: function () {
      this._super();
      this.set("messageId", "");
      this.set("previewedForRecipient", null);
      // Temporary solution to hide recipient on ReportPage. Will be removed after MessageInfo component will be re-factored
      this.set("hidePreviewForRecipient", false);
      this.attachEventHandlers();
    },

    attachEventHandlers: function () {
      sitecore.on({
        "change:messageContext": function (messageContext) {
          if (messageContext) {
            this.refresh(messageContext);
          }
        },
        "recipientLists:added": this.refresh,
        "recipientLists:removed": this.refresh,
        "recipientLists:changeddefault": this.onRecipientListDefaultChanged,
        "recipientLists:removeddefault": this.onRecipientListDefaultChanged,
        "action:previewRecipientSelected": this.onPreviewRecipientSelected
      }, this);
    },

    onRecipientListDefaultChanged: function () {
      this.set("previewedForRecipient", null);
      this.refresh();
    },

    onPreviewRecipientSelected: function (selectedRecipient) {
      this.setRecipientToData(selectedRecipient);
      this.set("previewedForRecipient", selectedRecipient);
    },

    // Temporary solution
    // @TODO: selected recipient should be saved to message context on server side
    setRecipientToData: function (selectedRecipient) {
      function setTextToLink(previewedForRecipient) {
        var result = previewedForRecipient.get("firstName");
        if (!result) {
          result = previewedForRecipient.get("lastName");
          if (!result) {
            result = previewedForRecipient.get("email");
          }
        } else {
          result = previewedForRecipient.get("firstName") + " " + previewedForRecipient.get("lastName");
        }
        return result;
      }
      var previewedForRecipient = selectedRecipient || this.get("previewedForRecipient");
      if (previewedForRecipient) {
        var recipientData = _.findWhere(this.data, { Key: "PreviewedForRecipient" });

        recipientData.Value = recipientData.Value.split("|");
        if (recipientData.Value[3].split("=")[1] === "True") {
          recipientData.Value[1] = setTextToLink(previewedForRecipient);
        }
        recipientData.Value = recipientData.Value.join("|");
      }
    },

    refresh: function (messageContext) {
      var language = messageContext && messageContext.attributes && messageContext.attributes.language
        ? messageContext.get("language")
        : $("[data-sc-id='LanguageSwitcher']").attr("data-sc-defaultlanguage");

      postServerRequest("EXM/MessageInfo", { messageId: this.get("messageId"), utcOffset: new Date().getTimezoneOffset(), language: language }, _.bind(function (response) {
        if (!response.error) {
          this.data = response.value;
          this.setRecipientToData();
          this.viewModel.redraw(this.data);
        }
      }, this));
    }
  });

  var view = sitecore.Definitions.Views.ControlView.extend({
    initialize: function () {
      this._super();
      this.model.on("change:previewedForRecipient", function () { this.redraw(this.model.data) }, this);
      this.model.on("hidePreviewForRecipient:change", this.togglePreviewForRecipient, this);
    },

    redraw: function (data) {
      var self = this;
      var table = self.$el.find("table");
      $('tr', table).remove();
      $.each(data, _.bind(function (v, vv) {
        if (vv.Key === "Attachments" || vv.Key === "PreviewedForRecipient") {
          var tr;
          var arr = vv.Value.split("|");
          if (vv.Key === "PreviewedForRecipient" && arr[3].split("=")[1] === "False") {
            tr = $("<tr><td >" + arr[0] + "</td><td class='sc-message-progress-value'>" + arr[1] + "</td></tr>");
          } else {
            tr = $("<tr><td >" + arr[0] + "</td><td class='sc-message-progress-value'><a id='" + vv.Key + "DialogLink' title='" + arr[2] + "'>" + arr[1] + "</a></td></tr>");
          }
          // Temporary solution to hide recipient on ReportPage. Will be removed after MessageInfo component will be re-factored
          if (vv.Key === "PreviewedForRecipient" && this.model.get("hidePreviewForRecipient")) {
            tr.addClass("hidden");
          }
        } else {
          tr = $("<tr><td >" + vv.Key + "</td><td class='sc-message-progress-value'>" + vv.Value + "</td></tr>");
        }
        table.append(tr);
      }, this));

      table.find("td a#AttachmentsDialogLink").on("click", function () {
        sitecore.trigger("action:showattachments");
      });

      table.find("td a#PreviewedForRecipientDialogLink").on("click", function () {
        sitecore.trigger("action:previewrecipients");
      });
    },
    // Temporary solution to hide recipient on ReportPage. Will be removed after MessageInfo component will be re-factored
    togglePreviewForRecipient: function () {
      // Previewed for recipient list item have no any identifier, so we have to rely for now that it's last element in MessageInfo list
      var previewForRecipientElement = this.$el.find("table tr:last");
      if (this.model.get("hidePreviewForRecipient") === true) {
        previewForRecipientElement.addClass("hidden");
      } else {
        previewForRecipientElement.removeClass("hidden");
      }

    },

    render: function () {
      var self = this;
      $(function () {
        setTimeout(function () {
          self.model.refresh();
          self.render();
        }, 30000);
      });
    }
  });

  sitecore.Factories.createComponent("MessageInfo", model, view, ".sc-MessageInfo");
});