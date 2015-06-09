define(
  [
    "sitecore",
    "/-/speak/v1/ExperienceEditor/PageEditorProxy.js",
    "/-/speak/v1/ExperienceEditor/Sitecore.ExperienceEditor.TranslationsUtils.js"
  ],
  function (Sitecore) {
    var RibbonPageCode = Sitecore.Definitions.App.extend({
      initialized: function () {
        this.currentContext = {
          language: this.PageEditBar.get("language"),
          version: this.PageEditBar.get("version"),
          isHome: this.PageEditBar.get("isHome"),
          itemId: this.PageEditBar.get("itemId"),
          database: this.PageEditBar.get("database"),
          deviceId: this.PageEditBar.get("deviceId"),
          isLocked: this.PageEditBar.get("isLocked"),
          isLockedByCurrentUser: this.PageEditBar.get("isLockedByCurrentUser"),
          ribbonUrl: this.PageEditBar.get("url"),
          siteName: this.PageEditBar.get("siteName"),
          isReadOnly: this.PageEditBar.get("isReadOnly"),
          webEditMode: Sitecore.ExperienceEditor.Web.getUrlQueryStringValue("mode"),
          argument: ""
        };

        this.collapsed = Sitecore.ExperienceEditor.Common.getCookieValue("sitecore_webedit_ribbon") == "1";
        this.setToggleShow();

        Sitecore.ExperienceEditor.instance = this;
        window.top.ExperienceEditor = Sitecore.ExperienceEditor;

        this.initializeExperienceEditorObject(this);
        if (this.currentContext.webEditMode == "edit") {
          this.initializeNotifications(this);
        }

        this.divideButtons("sc-chunk-button-small", "sc-chunk-button-small-list");
        this.divideButtons("sc-chunk-check-small", "sc-chunk-check-list");

        var self = this;
        var pipelineContext = this.clone(this.currentContext);
        Sitecore.ExperienceEditor.PipelinesUtil.executePipeline(this.InitializePageEditPipeline, function () {
          Sitecore.Pipelines.InitializePageEdit.execute({ app: self, currentContext: pipelineContext });
          self.setHeight();
          self.trigger("button:toggleshow", true);
        });

        $(window).bind("click resize", function () {
          self.setHeight();
        });

        this.prepareHeaderButtons();
        this.enableButtonClickEvents();

        Sitecore.ExperienceEditor.Common.addOneTimeEvent(function() {
          return window.parent.Sitecore.PageModes.PageEditor;
        }, function(that) {
          window.parent.Sitecore.PageModes.PageEditor.save = function() {
            that.save();
          };
        }, 50, this);
      },
      save: function() {
        if (!Sitecore.ExperienceEditor.instance.getCommand("Save")) {
          return;
        }

        if (window.parent
          && window.parent.document
          && window.parent.document.activeElement
          && window.parent.document.activeElement.blur) {
          window.parent.document.activeElement.blur();
        }
        Sitecore.ExperienceEditor.instance.executeCommand("Save", null);
      },
      prepareHeaderButtons: function() {
        $(".sc-global-logo").attr("target", "_parent");

        var logoutLink = $(".logout");
        var logoutLinkFunc = logoutLink.click;
        logoutLink.click(function () {
          window.onbeforeunload = function (e) {
            try {
              window.parent.document.getElementById("scWebEditRibbon").style.display = "none";
              window.parent.location.reload();
              return;
            } catch (error) {}
          };

          try {
            logoutLinkFunc();
          } catch (err) {}
        });
      },
      divideButtons: function (buttonsClass, wrapperClass) {
        var wrapper = "<div class='" + wrapperClass + "'/>";
        $("div.sc-chunk").each(function () {
          var buttons = $(this).find("." + buttonsClass);
          for (var i = 0; i < buttons.length; i += 2) {
            buttons.slice(i, i + 2).wrapAll(wrapper);
          }
        });
      },
      initializeNotifications: function (context) {
        this.registerPageEditorNotificationHandler();
        Sitecore.ExperienceEditor.instance.NotificationBar.viewModel.$el.click(function () { Sitecore.ExperienceEditor.instance.setToggleShow(); });
        Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Item.Notifications", function (response) {
          var notificationTypes = ["error", "notification", "warning"];
          var notifications = response.responseValue.value;
          response.context.NotificationBar.removeMessages("");
          for (var i = 0; i < notifications.length; i++) {
            var notification = notifications[i];
            var notificationElement = Sitecore.ExperienceEditor.instance.showNotification(notificationTypes[notification.Type], notification.Description, true);
            if (notificationElement
              && notification.Options.length > 0) {
              for (var j = 0; j < notification.Options.length; j++) {
                $(notificationElement).append("<a onclick=\"javascript: return window.parent.scForm.postEvent(this, event, '" + notification.Options[j].Command + "')\" href=\"#\" class=\"OptionTitle\">" + notification.Options[j].Title + "</a>");
              }
            }
          }
        }).execute(context);
      },
      registerPageEditorNotificationHandler: function () {
        Sitecore.ExperienceEditor.Common.addOneTimeEvent(function () {
          return window.parent.Sitecore.PageEditorProxy;
        }, function (that) {
          window.parent.Sitecore.PageEditorProxy.showNotification = that.handleNotifications;
          window.parent.Sitecore.PageModes.PageEditor.notificationBar.addNotification = that.handleNotifications;
        }, 50, this);
      },
      handleNotifications: function (notification) {
        var notificationElement = Sitecore.ExperienceEditor.instance.showNotification(notification.type, notification.text, true);
        if (!notificationElement
          || !notification.onActionClick
          || !notification.actionText) {
          return;
        }

        var actionLink = $(notificationElement).append("<a href=\"#\" class=\"OptionTitle\">" + notification.actionText + "</a>");
        $(actionLink).click(function () { notification.onActionClick(); });
      },
      showNotification: function (type, text, isClosable, clearMessages) {
        if (clearMessages) {
          Sitecore.ExperienceEditor.instance.NotificationBar.removeMessages("");
        }

        Sitecore.ExperienceEditor.instance.NotificationBar.addMessage(type, {
          text: text,
          actions: [],
          closable: isClosable,
        });
        Sitecore.ExperienceEditor.instance.setHeight();
        return Sitecore.ExperienceEditor.Common.searchElementWithText(text);
      },
      initializeExperienceEditorObject: function (context) {
        // Execute hooks
        var hooks = Sitecore.ExperienceEditor.Hooks || [];
        $.each(hooks, function () {
          this.execute(context);
        });
      },
      setToggleShow: function () {
        Sitecore.ExperienceEditor.Common.addOneTimeEvent(function (that) {
          Sitecore.ExperienceEditor.isFrameLoaded = window.frameElement.contentWindow.document.readyState === "complete";
          var ribbonHeight = that.ScopedEl.height();
          return Sitecore.ExperienceEditor.isRibbonRendered && Sitecore.ExperienceEditor.isFrameLoaded && ribbonHeight > 0 && ribbonHeight < 500;
        }, function (that) {
          that.setHeight(that.ScopedEl.height());
        }, 50, this);

        if (!this.QuickRibbon) {
          return;
        }

        this.QuickRibbon.viewModel.$el.attr("style", "float:right");
        this.QuickRibbon.viewModel.$el.find("img").attr("src", "/sitecore/shell/client/Speak/Assets/img/Speak/Common/16x16/dark_gray/navigate_down.png");
        this.on("button:toggleshow", function (denyCollapse) {
          if (denyCollapse != true) {
            this.collapsed = !this.collapsed;
          }

          if (this.collapsed) {
            this.QuickRibbon.viewModel.$el.find("img").attr("src", "/sitecore/shell/client/Speak/Assets/img/Speak/Common/16x16/dark_gray/navigate_up.png");
            this.Ribbon.viewModel.$el.show();
            this.setHeight(this.ScopedEl.height());
          } else {
            this.QuickRibbon.viewModel.$el.find("img").attr("src", "/sitecore/shell/client/Speak/Assets/img/Speak/Common/16x16/dark_gray/navigate_down.png");
            this.Ribbon.viewModel.$el.hide();
            this.setHeight(this.ScopedEl.height());
          }

          if (denyCollapse == true) {
            return;
          }

          Sitecore.ExperienceEditor.Common.setCookie("sitecore_webedit_ribbon", !this.collapsed ? "0" : "1");
        }, this);
      },
      setHeight: function (height) {
        if (height === undefined)
          height = this.ScopedEl.height();
        var iframe = jQuery("#scWebEditRibbon", window.parent.document.body);
        if (!window.parent.document.getElementById("scCrossPiece")) {
          window.parent.$sc("<div id='scCrossPiece' style='visibility: hidden'> </div>").prependTo(window.parent.document.body);
        }
        var crossPiece = jQuery("#scCrossPiece", window.parent.document.body);
        iframe.height(height);
        crossPiece.height(height);
      },
      findId: function (target) {
        if (target === undefined || target === null)
          return undefined;
        var id = $(target).data("sc-id");
        if (id === undefined)
          id = this.findId(target.parentNode);
        return id;
      },
      canExecute: function (commandQuery, commandContext) {
        var result = false;
        var that = this;
        this.postServerRequest(commandQuery, commandContext, function (response) {
          if (!response.error) {
            result = response.value || response.responseValue.value;
          } else {
            that.handleResponseErrorMessage(response);
          }
        });
        return result;

      },
      postServerRequest: function (requestType, commandContext, handler, async) {
        Sitecore.ExperienceEditor.Web.postServerRequest(requestType, commandContext, handler, async);
      },
      handleResponseErrorMessage: function (responseData) {
        var errorMessage = Sitecore.ExperienceEditor.TranslationsUtils.translateText(Sitecore.ExperienceEditor.TranslationsUtils.keys.An_error_occured);
        var message = responseData.errorMessage !== undefined && responseData.errorMessage !== "" ? responseData.errorMessage : errorMessage;
        this.showNotification("error", message, true, true);
      },
      refreshOnItem: function (context) {
        Sitecore.ExperienceEditor.modifiedHandling(null, function (isOk) {
          if (escape(Sitecore.ExperienceEditor.instance.currentContext.itemId) != escape(context.itemId)) {
            var url = "/?sc_itemid=" + context.itemId + "&sc_lang=" + context.language + "&sc_db=" + context.database + "&sc_device=" + context.deviceId + "&sc_mode=" + context.webEditMode;
            window.parent.location = url;
            return;
          }

          window.parent.location.reload();
        });
      },
      enableButtonClickEvents: function () {
        this.on("button:click", function (event) {
          var button = this.getButton(event.sender.el);
          this.executeButtonCommand(button);
        }, this);
        this.on("button:pressed", function (event) {
          var button = this.getButton(event.sender.el);
          this.setButtonPressed(button);
        }, this);
        this.on("button:check", function (event) {
          var button = this.getButton(event.sender.el);
          button.set({ isChecked: !button.get("isChecked") });
          this.executeButtonCommand(button);
        }, this);
      },
      disableButtonClickEvents: function () {
        this.off("button:click");
        this.off("button:check");
      },
      clone: function (obj) {
        if (obj === null || typeof obj != "object")
          return obj;
        var copy = obj.constructor();
        for (var attr in obj) {
          if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
      },
      getButton: function (eventTarget) {
        var id = this.findId(eventTarget);
        if (id === undefined)
          return undefined;
        return this[id];
      },

      setButtonPressed: function (button) {
        if (button == undefined) {
          return;
        }

        var buttonName = button.get("name");
        var isPressed = button.get("isPressed");
        $.each(this.Controls, function (index, control) {
          if (control.name == buttonName) {
            control.model.viewModel.set({ isPressed: !isPressed });
          }
        });
      },

      executeButtonCommand: function (button) {
        if (button.get("command") != undefined && button.get("command") != "") {
          this.executeCommand(button.get("command"), "", button);
        }
      },

      executeCommand: function (commandName, commandArgument, button) {
        if (!commandName | commandName == "") {
          return;
        }

        var context = this.getContext(button);

        context.currentContext.argument = commandArgument;
        Sitecore.Commands.executeCommand(this.formCommandName(commandName), context);
      },

      getCommand: function (commandName) {
        if (!commandName || commandName == "") {
          return null;
        }

        return Sitecore.Commands.getCommand(this.formCommandName(commandName));
      },

      formCommandName: function (commandName) {
        return "Sitecore.Speak.Commands." + commandName;
      },

      getContext: function (button) {
        return {
          app: this,
          button: button,
          currentContext: this.clone(this.currentContext)
        };
      }
    });

    return RibbonPageCode;
  });