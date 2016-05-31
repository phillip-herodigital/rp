define(["sitecore", "/-/speak/v1/ecm/MessageTokenService.js"], function (Sitecore, MessageTokenService) {
  var lastSelected;

  MessageTokenService.on("tokenSelected", function () {
    var selectedToken = MessageTokenService.get("selectedToken");

    if (selectedToken === null || selectedToken === "$undefined$" || !lastSelected) {
      alert(Sitecore.Resources.Dictionary.translate("ECM.Message.NoFocusedElement"));
      return;
    }

    var value = lastSelected.$el.val().substring(0, lastSelected.selectionStart) +
      selectedToken + lastSelected.$el.val().substring(lastSelected.selectionEnd);

    lastSelected.model.set("text", value);
    lastSelected.hide();
  });

  return Sitecore.Factories.createBehavior("InsertMessageToken", {
    tokenInput: null,
    selectionStart: 0,
    selectionEnd: 0,

    afterRender: function () {
      if (!this.$el.is(":input")) {
        return;
      }
      this.init();
    },
    init: function() {
      this.renderTokenField();
      this.attachHandlers();
    },

    attachHandlers: function() {
      this.tokenInput.on("focus", _.bind(this.hide, this));
      this.$el.on("focusout", _.bind(this.onFocusout, this));
      this.model.on({
        "change:text": this.onTextChange,
        "change:isReadOnly": this.onChangeIsReadOnly
      }, this);
      MessageTokenService.on("change:tokens", this.insertToken, this);
    },

    onChangeIsReadOnly: function() {
      this.tokenInput.attr("disabled", this.model.get("isReadOnly"));
    },

    onTextChange: function () {
      this.insertToken();
      if (!this.$el.is(":focus")) {
        this.show();
      }
    },

    insertToken: function() {
      this.tokenInput.val(MessageTokenService.replaceToken(this.model.get("text")));
    },

    onFocusout: function () {
      this.selectionStart = this.$el.get(0).selectionStart;
      this.selectionEnd = this.$el.get(0).selectionEnd;
      lastSelected = this;
      this.show();
    },

    show: function() {
      if (this.$el.is("textarea") && this.$el.is(":visible")) {
        this.tokenInput.height(this.$el.height());
      }
      this.$el.hide().addClass("hidden");
      this.tokenInput.show().removeClass("hidden");
    },

    hide: function () {
      if (this.tokenInput.is("textarea") && this.tokenInput.is(":visible")) {
        this.$el.height(this.tokenInput.height());
      }
      this.$el.show().removeClass("hidden");
      this.$el.focus();
      this.tokenInput.hide().addClass("hidden");
    },

    renderTokenField: function () {
      var input = this.$el,
        inputClone = input.clone();

      inputClone
        .removeAttr("data-sc-id")
        .removeAttr("data-sc-require")
        .removeAttr("data-bind")
        .hide();

      input.after(inputClone);
      this.tokenInput = inputClone;
    }

  });
});