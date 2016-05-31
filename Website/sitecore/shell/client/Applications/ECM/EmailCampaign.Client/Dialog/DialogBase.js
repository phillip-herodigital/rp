define([
  "sitecore",
  "jquery",
  "/-/speak/v1/ecm/AppBase.js"
], function (sitecore, $, appBase) {
  var DialogBase = appBase.extend({
    defaults: {
      title: "",
      buttons: {
        ok: {
          id: "Ok", show: true
        },
        cancel: {
          id: "Cancel", show: true
        },
        close: {
          selector: '.sc-dialogWindow-close', show: true
        }
      },
      on: {
        ok: $.noop,
        cancel: $.noop,
        complete: $.noop
      }
    },
    initialized: function () {
      this.defaults.title = this.getTitle();
    },

    attachHandlers: function () {
      this.on({
        "dialog:ok": this.ok,
        "dialog:cancel": this.cancel
      }, this);
    },

    detachHandlers: function () {
      this.off("dialog:ok", this.ok);
      this.off("dialog:cancel", this.cancel);
    },

    showDialog: function (options) {
      // Deep extend needed to merge all dialog options correctly, that is why $.extend with true argument used.
      this.options = $.extend(true, {}, this.defaults, options);
      this.attachHandlers();
      this.update();
      this.DialogWindow.show();
    },

    hideDialog: function() {
      this.DialogWindow.hide();
    },

    update: function () {
      this.updateTitle(this.options.title);
      if (this.options.buttons) {
        this.updateButtons(this.options.buttons);
      }
    },

    updateButtons: function (buttonsConfig) {
      var dialogEl = this.DialogWindow.viewModel.$el;
      _.each(buttonsConfig, _.bind(function (button, key) {
        if (this[this.options.buttons[key].id]) {
          this[this.options.buttons[key].id].set("isVisible", button.show);
        } else if (
          this.options.buttons[key].selector &&
          dialogEl.find(this.options.buttons[key].selector)
        ) {
          dialogEl.find(this.options.buttons[key].selector)[button.show ? 'show' : 'hide']();
        }
      }, this));
    },

    ok: function () {
      this.hideDialog();
      this.options.on.ok();
      this.options.on.complete();
      this.resetDefaults();
    },

    cancel: function () {
      this.hideDialog();
      this.options.on.cancel();
      this.options.on.complete();
      this.resetDefaults();
    },

    getTitle: function () {
      var title = this.DialogWindow.viewModel.$el.find(".sc-dialogWindow-header-title");
      return title.length ? title.text() : null;
    },

    updateTitle: function (titleText) {
      var title = this.DialogWindow.viewModel.$el.find(".sc-dialogWindow-header-title");
      if (title.length) {
        title.text(titleText);
      }
    },

    resetDefaults: function () {
      this.detachHandlers();
      this.updateTitle(this.defaults.title);
      this.updateButtons(this.defaults.buttons);
    }
  });

  return DialogBase;
});