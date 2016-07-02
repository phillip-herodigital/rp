define(["sitecore"],
  function (sitecore) {
  return sitecore.Definitions.App.extend({
    variantContextObj: null,

    initialized: function () {
      this.bindToWebEditRibbonLoaded();
      this.attachEventHandlers();
    },

    attachEventHandlers: function() {
      sitecore.on("message:variant:content:editor:dialog:show", function (variantContext, hideCallback) {
        this.experienceEditorContext = null;
          this.onDialogShow(variantContext, hideCallback);
      }, this);

      this.on({
        "message:variant:content:editor:dialog:ok": this.onDialogOk,
        "message:variant:content:editor:dialog:cancel": this.onDialogCancel,
        "experience:editor:context:loaded": function (experienceEditorContext) {
          this.experienceEditorContext = experienceEditorContext;
          this.setExperienceEditorEditMode();
        }
      }, this);

      this.DialogWindow.viewModel.$el.on("hide", _.bind(function () {
        if (typeof this.hideCallback === "function") {
          this.hideCallback();
        }
      }, this));
    },

    bindToWebEditRibbonLoaded: function() {
      this.Frame.viewModel.$el.off('load.messageVariantsContentEditorDialog');
      this.Frame.viewModel.$el.on('load.messageVariantsContentEditorDialog', _.bind(function () {
        var webRibbon = this.Frame.viewModel.$el.contents()
          .find('#scWebEditRibbon');

        if (webRibbon.length) {
          // Need to wait while Sitecore object will be initialized inside webRibbon iframe.
          // It doesn't trigger any events when initialized, so setInterval is used here.
          var loadRibbonInterval = setInterval(_.bind(function () {
            var webRiddonSitecore = webRibbon.get(0).contentWindow.Sitecore;
            if (webRiddonSitecore && webRiddonSitecore.ExperienceEditor) {
              this.trigger("experience:editor:context:loaded", webRibbon.get(0).contentWindow.Sitecore.ExperienceEditor);
              clearInterval(loadRibbonInterval);
            }
          }, this), 1000);
        }
      }, this));
    },

    disableEditMode: function () {
      this.Frame.set('sourceUrl', '');
      document.cookie = 'website#sc_mode=normal;path=/';
    },

    onDialogShow: function (variant, hideCallback) {
      if (!variant && variant.readOnly && !this.saveMessage()) {
        return;
      }

      this.hideCallback = hideCallback;

      var urlToEdit = variant.urlToEdit;
      if (urlToEdit) {
        this.Frame.set("sourceUrl", urlToEdit);
        this.DialogWindow.show();
      }
    },

    onDialogOk: function () {
      if (this.experienceEditorContext && this.experienceEditorContext.isModified) {
        this.experienceEditorContext.instance.disableRedirection = true;
        this.experienceEditorContext.CommandsUtil.runCommandExecute("Save", this.experienceEditorContext.instance);

        // wait for content saving
        this.experienceEditorContext.Common.addOneTimeEvent(_.bind(function () {
          return this.experienceEditorContext.isContentSaved;
        }, this), _.bind(function () {
          this.DialogWindow.hide();
          this.disableEditMode();
        }, this), 100, this);
      } else {
        this.DialogWindow.hide();
        this.disableEditMode();
      }
    },

    onDialogCancel: function () {
      if (this.experienceEditorContext) {
        this.experienceEditorContext.modifiedHandling(true, _.bind(function (isOkButtonPressed) {
          if (!isOkButtonPressed) {
            this.experienceEditorContext.isModified = false;
          }
          this.DialogWindow.hide();
          this.disableEditMode();
        }, this));
      }
    },

    //Todo: This is the workaround to set the Experience Editor to edit mode. Remove it in Sitecore 8.o update 1. 
    setExperienceEditorEditMode: function () {
      if (this.experienceEditorContext) {
        this.experienceEditorContext.PageEditorProxy.changeCapability("edit", true);
      }
    },

    saveMessage: function() {
      var args = { Verified: false };
      sitecore.trigger("message:save", args);
      return args.Verified;
    }
  });
});