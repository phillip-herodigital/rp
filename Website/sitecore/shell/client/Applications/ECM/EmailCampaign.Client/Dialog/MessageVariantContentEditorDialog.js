define([
        "sitecore",
        "/-/speak/v1/ExperienceEditor/ExperienceEditor.js",
        "/-/speak/v1/ecm/DialogBase.js"
    ],
    function(
        sitecore,
        experienceEditor,
        DialogBase
    ) {
        return DialogBase.extend({
            variantContextObj: null,
            initialized: function() {
                this._super();
                this.bindToWebEditRibbonLoaded();
                this.on({
                    "experience:editor:context:loaded": this.onWebEditRibbonLoaded
                }, this);
            },

            showDialog: function(options) {
                this.experienceEditorContext = null;
                if (!options.data.variant && options.data.variant.readonly) {
                    return;
                }
                this._super(options);
                this.updateFrame();
            },

            updateFrame: function() {
                this.Frame.set("sourceUrl", this.options.data.variant.urlToEdit);
            },

            onWebEditRibbonLoaded: function(experienceEditor) {
                this.experienceEditor = experienceEditor;
                this.experienceEditorContext = experienceEditor.Context;
            },

            bindToWebEditRibbonLoaded: function() {
                this.Frame.viewModel.$el.off('load.messageVariantsContentEditorDialog');
                this.Frame.viewModel.$el.on('load.messageVariantsContentEditorDialog', _.bind(function() {
                    var webRibbon = this.Frame.viewModel.$el.contents()
                        .find('#scWebEditRibbon');

                    if (webRibbon.length) {
                        // Need to wait while Sitecore object will be initialized inside webRibbon iframe.
                        // It doesn't trigger any events when initialized, so setInterval is used here.
                        var loadRibbonInterval = setInterval(_.bind(function() {
                            if (sitecore && sitecore.ExperienceEditor) {
                                this.trigger("experience:editor:context:loaded", sitecore.ExperienceEditor);
                                clearInterval(loadRibbonInterval);
                            }
                        }, this), 1000);
                    }
                }, this));
            },

            disableEditMode: function() {
                this.Frame.set('sourceUrl', '');
                document.cookie = 'website#sc_mode=normal;path=/';
            },

            getExperienceEditor: function() {
                return window.top.ExperienceEditor;
            },

            getExperienceEditorContext: function() {
                return window.top && window.top.ExperienceEditor ?
                    this.getExperienceEditor().getContext() :
                    false;
            },

            ok: function() {
                this.experienceEditorContext = this.getExperienceEditorContext();
                if (this.experienceEditorContext && this.experienceEditorContext.isModified) {
                    this.experienceEditorContext.instance.disableRedirection = true;
                    this.experienceEditorContext.instance.executeCommand("Save");

                    this.experienceEditor = this.getExperienceEditor();

                    // wait for content saving
                    this.experienceEditor.Common.addOneTimeEvent(_.bind(function() {
                        return this.experienceEditorContext.isContentSaved;
                    }, this), _.bind(function() {
                        this.options.on.ok();
                        this.hideDialog();
                        this.resetDefaults();
                    }, this), 100, this);
                } else {
                    this._super();
                }
            },

            cancel: function() {
                this.experienceEditorContext = this.getExperienceEditorContext();
                if (this.experienceEditorContext) {
                    this.getExperienceEditor().modifiedHandling(true, _.bind(function(isOkButtonPressed) {
                        if (!isOkButtonPressed) {
                            this.experienceEditorContext.isModified = false;
                        }
                        this._super();
                    }, this));
                } else {
                    this._super();
                }
            },

            complete: function() {
                this._super();
                this.disableEditMode();
            },

            saveMessage: function() {
                var args = { Verified: false };
                sitecore.trigger("message:save", args);
                return args.Verified;
            }
        });
    });