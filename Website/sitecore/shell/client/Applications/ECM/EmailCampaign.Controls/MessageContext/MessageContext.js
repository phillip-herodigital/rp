define(["jquery", "sitecore", "/-/speak/v1/ecm/ServerRequest.js"], function ($, sitecore) {
  "use strict";

  var model = sitecore.Definitions.Models.ComponentModel.extend(
    {
      initialize: function () {
        this._super();

        this.set("messageId", "");

        // general
        this.set("messageName", "");
        this.set("description", "");
        this.set("campaignCategory", "");
        this.set("campaignCategoryPath", "");
        this.set("targetDevice", "");
        this.set("messageType", "");

        // sender
        this.set("fromName", "");
        this.set("fromEmail", "");
        this.set("replyTo", "");
        this.set("isSenderDetailsReadonly", false);

        // template
        this.set("templateName", "");
        //The following is workaround due to an error with the image control that casts an exception if the image URL is empty
        this.set("thumbnail", "/sitecore/shell/client/Applications/ECM/EmailCampaign.Client/Assets/Images/ecm16x16.png");
        this.set("templateId", "");
        this.set("isExistingPageBased", false);

        // language
        this.set("language", "");
        this.set("languageName", "");
        this.set("languages", []);
        this.set("selectedReportLanguage", "0");

        // state
        this.set("isBusy", true);
        this.set("isModified", false);
        this.set("isReadonly", false);
        this.set("messageNotFound", false);
        
        this.set("sendingState", 0);
        this.set("messageState", 0);
        this.set("hasCampaign", false);
        this.set("currentTabId", "");

        // attachments
        this.set("attachments", []);
        this.set("hasAttachments", false);

        // variants
        this.set("isAbTesting", false);
        this.set("variants", []);
        this.set("hasVariants", false);

        // message performance
        this.set("value", 0);
        this.set("valuePerEmail", "");
        this.set("valuePerVisit", "");
        this.set("visitsPerEmail", "");
        this.set("totalRecipients", 0);
        this.set("actualRecipients", 0);
        this.set("opened", 0);
        this.set("clicked", 0);
        this.set("browsed", 0);
        this.set("productive", 0);

        // message statistics
        this.set("messageStatistics", {});

        // testing
        this.set("lastTestEmail", "");

        // listen for changes
        this.on("change:messageName", this.modified, this);
        this.on("change:description", this.modified, this);
        this.on("change:campaignCategory", this.modified, this);
        this.on("change:targetDevice", this.modified, this);
        this.on("change:fromName", this.modified, this);
        this.on("change:fromEmail", this.modified, this);
        this.on("change:replyTo", this.modified, this);

        this.on("change:messageId", this.refresh, this);
        this.on("change:language", this.refresh, this);
        this.on("change:selectedReportLanguage", this.refresh, this);

        this.isReady = false;
        
        this.initStateWatcher(this);
      },

      modified: function () {
        this.set("isModified", true);
      },

      refresh: function () {
        this.getMessageFromServer();
      },

      getMessageFromServer: function () {
        if (!this.isReady) {
          return;
        }

        var messageId = this.get("messageId");
        if (!messageId) {
          this.set("messageNotFound", true);
          return;
        }

        var language = this.get("language");
        if (!language) {
          return;
        }

        var data = { messageId: messageId, language: language };
        var options = {
          url: "/-/speak/request/v1/ecm.messagecontext.getmessage",
          data: "data=" + JSON.stringify(data),
          type: "POST",
          success: $.proxy(this.success, this),
        };

        this.set("isBusy", true);
        $.ajax(options);
      },

      success: function (response) {
        if (response.error || response.notFound || !response.message || !response.message.sender || !response.message.template) {
          this.set("messageNotFound", true);
          this.set("isBusy", false);
          return;
        }

        // general
        this.set("messageName", response.message.name);
        this.set("description", response.message.description);
        this.set("campaignCategory", response.message.campaignCategory);
        this.set("campaignCategoryPath", response.message.campaignCategoryPath);
        this.set("targetDevice", response.message.targetDevice);
        this.set("messageType", response.message.messageType);

        // sender
        this.set("fromName", response.message.sender.name);
        this.set("fromEmail", response.message.sender.email);
        this.set("replyTo", response.message.sender.replyTo);
        this.set("isSenderDetailsReadonly", response.message.sender.readonly);

        // template
        this.set("templateName", response.message.template.name);
        this.set("thumbnail", response.message.template.thumbnail);
        this.set("templateId", response.message.template.id);
        this.set("isExistingPageBased", response.message.template.isExistingPageBased);

        // language
        this.set("languages", response.message.languages);
        
        // attachments
        this.set("attachments", response.message.attachments);
        this.set("hasAttachments", response.message.attachments != null && response.message.attachments.length > 0);

        // variants
        this.set("isAbTesting", response.message.isAbTesting);
        this.set("variants", response.message.variants);
        this.set("hasVariants", response.message.variants > 1);

        // message statistics
        this.set("messageStatistics", response.message.messageStatistics);
        
        if (this.get("selectedReportLanguage") != "") {
          this.setMessagePerformanceFields(this.get("selectedReportLanguage"));
        } 

        // testing
        this.set("lastTestEmail", response.message.lastTestEmail);

        this.set("sendingState", response.message.sendingState);
        this.set("messageState", response.message.messageState);
        this.set("hasCampaign", response.message.hasCampaign);

        // state
        this.set("isBusy", false);
        this.set("isModified", false);
        this.set("isReadonly", response.message.readonly);
        this.set("messageNotFound", false);

        sitecore.trigger("change:messageContext", this);
      },

      getMessage: function () {
        var variants = this.get("variants");
        for (var i = 0; i < variants.length; i++) {
          //We don't need to get the bodyUrl. Otherwise, we need to endoce the bodyUrl.
          variants[i].bodyUrl = "";
          variants[i].urlToEdit = variants[i].urlToEdit.escapeAmpersand();
        }

        var message = {
          id: this.get("messageId"),
          name: this.get("messageName").escapeAmpersand(),
          description: this.get("description").escapeAmpersand(),
          campaignCategory: this.get("campaignCategory"),
          targetDevice: this.get("targetDevice"),
          attachments: this.get("attachments"),
          variants: variants,
          isAbTesting: this.get("isAbTesting")
        };

        message.sender = {
          name: this.get("fromName"),
          email: this.get("fromEmail"),
          replyTo: this.get("replyTo")
        };

        return message;
      },

      setMessagePerformanceFields: function (language) {
        var self = this;

        $.each(self.get("messageStatistics"), function (i, v) {
          if (v.language == language) {
            self.set("value", v.value);
            self.set("valuePerEmail", v.valuePerEmailFormatted);
            self.set("valuePerVisit", v.valuePerVisitFormatted);
            self.set("visitsPerEmail", v.visitsPerEmailFormatted);
            self.set("totalRecipients", v.sent);
            self.set("actualRecipients", v.actualRecipients);
            self.set("opened", v.opened);
            self.set("clicked", v.clicked);
            self.set("browsed", v.browsed);
            self.set("productive", v.productive);
          }
        });
      },

      getUrlVars: function () {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
          vars[key] = value;
        });

        return vars;
      },

      initStateWatcher: function (messageContext) {
        var currentState = null;

        refreshState();

        sitecore.on("change:messageContext", function() {
           stateRefreshPostback();
        });

        function stateRefreshPostback() {
          var request = { messageId: messageContext.get("messageId") };

          postServerRequest("ecm.messagecontext.getcurrentstate", request, function (response) {
            if (currentState != null && currentState != response.state) {
              sitecore.trigger("change:messageContext:currentState", response.state, response.stateDescription, this);
            }

            currentState = response.state;
          });
        }

        function refreshState() {
          $(function () {
            setTimeout(function () {
              stateRefreshPostback();
              refreshState();
            }, 30000);
          });
        }
      }
    }
  );

  var view = sitecore.Definitions.Views.ComponentView.extend(
    {
      initialize: function () {
        this._super();

        var messageId = this.$el.attr("data-sc-messageid");
        if (messageId == "" || messageId === undefined) {
          messageId = this.model.getUrlVars()["id"];
        }

        this.model.set("messageId", messageId);

        this.model.isReady = true;
        this.refresh();
      },

      refresh: function () {
        this.model.refresh();
      }
    }
  );

  sitecore.Factories.createComponent("MessageContext", model, view, "script[type='text/x-sitecore-messagecontext']");
});