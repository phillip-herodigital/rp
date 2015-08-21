define([
  "sitecore",
  "/-/speak/v1/ecm/CompositeComponentBase.js",
  "/-/speak/v1/ecm/MessageTokenService.js"
], function (sitecore, CompositeComponentBase, MessageTokenService) {
  var model = sitecore.Definitions.Models.ControlModel.extend({
    initialize: function () {
      this._super();
      this.set("data", null);
      this.set("removable", false);
      this.set("isReadOnly", false);
      this.set("isExistingPageBased", false);
    }
  });

  var view = CompositeComponentBase.view.extend({
    childComponents: [
      "SubjectValue",
      "BodyHTMLBorder",
      "BodyHTML",
      "BodyHTMLOverlay",
      "BodyPlainTextBorder",
      "BodyPlainText",
      "AlternativeTextBorder",
      "AltValue",
      "Actions",
      "AdvancedExpander"
    ],

    // Temporary solution, in future need to set actions ids to a component
    variantActionsIds: {
      remove: "50FC3020046340B29C2FAE24A72405F3",
      abTest: "CCC747CBA58C4574853E8E76EB74DF75",
      editBody: "79311FAE1A9944A88DC0F71BCB014DC7",
      duplicate: "7C0E88DAF11342309964C58A17D063FC"
    },

    initialize: function () {
      this._super();
      this.children.BodyHTML.viewModel.$el.on("load", _.bind(this.updateBodyFrame, this));
      this.children.BodyHTMLBorder.viewModel.$el.on("mouseenter", _.bind(this.showBodyOverlay, this));
      this.children.BodyHTMLBorder.viewModel.$el.on("mouseleave", _.bind(this.hideBodyOverlay, this));
      this.children.BodyHTMLOverlay.viewModel.$el.on("click", _.bind(function () {
        if (!this.children.BodyHTML.get("isReadOnly")) {
          this.app.trigger("action:editmessagevariantcontent");
        }
      }, this));
      MessageTokenService.on("change:context", this.updateBodyUrl, this);
      this.model.on("change:isReadOnly", this.onChangeReadonly, this);
      this.model.on("change:isExistingPageBased", this.applyExistingPageBased, this);
      this.children.BodyHTML.on("change:height", this.adjustBodyHtmlOverlayHeight, this);
      this.children.BodyHTMLOverlay.set("isVisible", false);
    },

    detachHandlers: function() {
      this.children.SubjectValue.off("change:text", this.onViewDataChanged);
      this.children.AltValue.off("change:text", this.onViewDataChanged);
      this.children.BodyPlainText.off("change:text", this.onViewDataChanged);
    },

    attachHandlers: function() {
      this.children.SubjectValue.on("change:text", this.onViewDataChanged, this);
      this.children.AltValue.on("change:text", this.onViewDataChanged, this);
      this.children.BodyPlainText.on("change:text", this.onViewDataChanged, this);
    },

    updateActions: function () {
      if (this.model.get("isReadOnly")) {
        return;
      }

      var actions = this.children.Actions.get("actions");

      _.each(actions, function (action) {
        if (action.id() === this.variantActionsIds.remove ||
          action.id() === this.variantActionsIds.abTest) {
          action[this.model.get("removable") ? "enable" : "disable"]();
        }
        if ((action.id() === this.variantActionsIds.editBody ||
          action.id() === this.variantActionsIds.duplicate) &&
          (this.model.get("isExistingPageBased") || this.model.get("data").isPlainTextMessage)) {
          action["disable"]();
        }
      }, this);
    },

    updateBodyFrame: function () {
      this.children.BodyHTML.set("width", "98%");
      this.children.BodyHTML.set("height", this.children.BodyHTML.viewModel.$el.contents().find("body").outerHeight(true));
    },

    updateBodyUrl: function () {
      var tokensContext = MessageTokenService.get("context"),
        data = this.model.get("data");

      var url = data.bodyUrl;
      if (tokensContext && tokensContext.contactId) {
        url += "&recipient=" + (tokensContext.contactId ? "xdb:" + tokensContext.contactId : null);
      }

      // Need to trigger change event even if urls is the same
      if (this.children.BodyHTML.get("sourceUrl") === url) {
        this.children.BodyHTML.set("sourceUrl", url);
        this.children.BodyHTML.trigger("change:sourceUrl");
      } else {
        this.children.BodyHTML.set("sourceUrl", url);
      }
    },

    adjustBodyHtmlOverlayHeight: function() {
      this.children.BodyHTMLOverlay.viewModel.$el.css({
        height: this.children.BodyHTML.get("height")
      });
    },

    showBodyOverlay: function () {
      if (!this.model.get("isReadOnly")) {
        this.adjustBodyHtmlOverlayHeight();
        this.children.BodyHTMLOverlay.set("isVisible", true);
      }
    },

    hideBodyOverlay: function () {
      if (!this.model.get("isReadOnly")) {
        this.children.BodyHTMLOverlay.set("isVisible", false);
      }
    },

    onViewDataChanged: function () {
      var data = this.model.get("data");

      _.extend(data, {
          subject: this.children.SubjectValue.get("text"),
          plainText: data.isPlainTextMessage ? this.children.BodyPlainText.get("text") : this.children.AltValue.get("text"),
          // Only if readOnly parameter will be set to false, variant will be saved on server
          readOnly: false,
          modified: true
      });

      this.model.trigger("modified");
    },

    onChangeReadonly: function() {
      this.children.SubjectValue.set("isReadOnly", this.model.get("isReadOnly"));
      this.children.AltValue.set("isReadOnly", this.model.get("isReadOnly"));
      this.children.BodyPlainText.set("isReadOnly", this.model.get("isReadOnly"));
      this.children.BodyHTML.set("isReadOnly", this.model.get("isReadOnly"));
      this.children.BodyHTMLOverlay.set("isVisible", this.model.get("isReadOnly"));
      this.$el[this.model.get("isReadOnly") ? "addClass" : "removeClass"]("readOnly");
      this.updateActions();
      if (this.model.get("isExistingPageBased")) {
        this.applyExistingPageBased();
      }
    },

    applyExistingPageBased: function () {
      this.children.SubjectValue.set("isReadOnly", this.model.get("isExistingPageBased"));
      this.children.BodyPlainText.set("isReadOnly", this.model.get("isExistingPageBased"));
      this.children.BodyHTML.set("isReadOnly", this.model.get("isExistingPageBased"));
      this.$el[this.model.get("isExistingPageBased") ? "addClass" : "removeClass"]("existingPageBased");
    },

    refresh: function () {
      this.detachHandlers();
      var data = this.model.get("data");
      this.initialData = _.clone(data);
      this.children.SubjectValue.set("text", data.subject);
      if (data.isPlainTextMessage) {
        this.children.BodyPlainTextBorder.set("isVisible", true);
        this.children.BodyHTMLBorder.set("isVisible", false);
        this.children.AlternativeTextBorder.set("isVisible", false);
        this.children.BodyPlainText.set("text", data.plainText);
      } else {
        this.children.BodyPlainTextBorder.set("isVisible", false);
        this.children.BodyHTMLBorder.set("isVisible", true);
        this.children.AlternativeTextBorder.set("isVisible", true);
        this.updateBodyUrl();
        this.children.AltValue.set("text", data.plainText);
      }
     
      this.updateActions();
      this.attachHandlers();
    }
  });

  sitecore.Factories.createComponent("MessageVariant", model, view, ".sc-MessageVariant");
});
