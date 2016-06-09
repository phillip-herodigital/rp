define([
  "sitecore",
  "jquery",
  "/-/speak/v1/ecm/AppBase.js"
], function (sitecore, $, appBase) {
  var defaults = {
    title: "",
    buttons: {
      ok: {
        id: "Ok",
        show: true
      },
      cancel: {
        id: "Cancel",
        show: true
      },
      close: {
        selector: '.sc-dialogWindow-close',
        show: true
      }
    },
    on: {
      ok: $.noop,
      cancel: $.noop,
      complete: $.noop
    }
  };

  var DialogBase = appBase.extend({
    initialized: function () {
      this.defaults = _.clone(defaults);
      this.defaults.title = this.getTitle();
    },

    attachHandlers: function () {
      this.on({
        "dialog:ok": this.ok,
        "dialog:cancel": this.cancel
      }, this);
      /*
       * Hide event is not triggers on a model, that is why need to listen on botstrap modal event to catch hide event.
       * ".exm" at the end on event name - is a namespace, which used to safely detach a handler
       */ 
      this.DialogWindow.viewModel.$el.on('hide.bs.modal.exm', _.bind(this.complete, this));
    },

    detachHandlers: function () {
      this.off("dialog:ok", this.ok);
      this.off("dialog:cancel", this.cancel);
      this.DialogWindow.viewModel.$el.off('hide.bs.modal.exm');
    },

    showDialog: function (options) {
      // Deep extend needed to merge all dialog options correctly, that is why $.extend with true argument used.
      this.options = $.extend(true, {}, this.defaults, options || {});
      this.attachHandlers();
      this.update();
      this.DialogWindow.show();
    },

    hideDialog: function () {
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
          dialogEl.find(this.options.buttons[key].selector).length
        ) {
          dialogEl.find(this.options.buttons[key].selector)[button.show ? 'show' : 'hide']();
        }
      }, this));
    },

    ok: function () {
      this.options.on.ok();
      this.hideDialog();
      this.resetDefaults();
    },

    cancel: function () {
      this.options.on.cancel();
      this.hideDialog();
      this.resetDefaults();
    },

    complete: function() {
      this.resetDefaults();
      this.options.on.complete();
    },

    getTitle: function () {
      var title = this.DialogWindow.viewModel.$el.find(".sc-dialogWindow-header-title");
      return title.length ? title.eq(0).text() : null;
    },

    updateTitle: function (titleText) {
      var title = this.DialogWindow.viewModel.$el.find(".sc-dialogWindow-header-title");
      if (title.length) {
        title.eq(0).text(titleText);
      }
    },

    resetDefaults: function () {
      this.detachHandlers();
      this.updateTitle(this.defaults.title);
      this.updateButtons(this.defaults.buttons);
    },
    
    showError: function (err) {
      err = typeof err === 'string' ? { Message: err } : err;
      if (this.MessageBar) {
        this.MessageBar.addMessage("error", {
          id: err.id,
          text: err.Message,
          actions: [],
          closable: true
        });
      }
    }
  });

  return DialogBase;
});