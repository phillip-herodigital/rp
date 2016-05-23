define(
  [
    "sitecore",
    "/-/speak/v1/ExperienceEditor/ExperienceEditor.Context.js",
    "/-/speak/v1/ExperienceEditor/ExperienceEditorProxy.js",
    "/-/speak/v1/ExperienceEditor/TranslationUtil.js"
  ],
  function (Sitecore, ExperienceEditorContext, ExperienceEditorProxy, TranslationUtil) {
  var experienceEditor = {
    getContext: function() {
      return ExperienceEditorContext;
    },

    isInMode: function (mode) {
      return experienceEditor.getContext().instance.currentContext.webEditMode.toLowerCase() == mode.toLowerCase();
    },

    isDebugging: function () {
      return experienceEditor.Web.getUrlQueryStringValue("sc_debug") == "1";
    },

    canToggleDebug: function () {
      if (experienceEditor.canDebug == null) {
        experienceEditor.canDebug = experienceEditor.getContext().instance.canExecute("ExperienceEditor.ToggleDebugRequests.CanToggleDebug", experienceEditor.getContext().instance.currentContext);
      }

      return experienceEditor.canDebug;
    },

    isInSharedLayout: function(context) {
      var editAllVersionsControls = this.CommandsUtil.getControlsByCommand(Sitecore.ExperienceEditor.Context.instance.Controls, "SelectLayout");
      if (editAllVersionsControls.length < 1
        || !editAllVersionsControls[0]
        || !editAllVersionsControls[0].model
        || !editAllVersionsControls[0].model.get) {
        return false;
      }

      return context.app.canExecute("ExperienceEditor.Versions.GetStatus", context.currentContext);
    },

    setSaveButtonState: function (isEnabled) {
      var saveButtonControls = experienceEditor.CommandsUtil.getControlsByCommand(ExperienceEditorContext.instance.Controls, "Save");
      if (saveButtonControls.length < 1
        || !saveButtonControls[0]
        || !saveButtonControls[0].view
        || !saveButtonControls[0].view.$el) {
        return;
      }

      var saveButton = saveButtonControls[0].view.$el;
      if (isEnabled) {
        saveButton.removeClass("disabled");
      } else {
        saveButton.addClass("disabled");
      }
    },

    modifiedHandling: function (disableRedirection, onCloseCallback) {
      if (!ExperienceEditorContext.isModified) {
        if (onCloseCallback) {
          return onCloseCallback(null);
        }

        return null;
      }

      experienceEditor.Dialogs.confirm(TranslationUtil.translateText(TranslationUtil.keys.The_item_has_been_modified), function (isOk) {
        if (!isOk) {
          if (onCloseCallback) {
            return onCloseCallback(isOk);
          }

          return null;
        }

        ExperienceEditorContext.instance.disableRedirection = disableRedirection;
        Sitecore.Commands.Save.execute(ExperienceEditorContext.instance);
        experienceEditor.Common.addOneTimeEvent(function () {
          return ExperienceEditorContext.isContentSaved;
        }, function () {
          if (onCloseCallback) {
            return onCloseCallback(isOk);
          }
        }, 100, this);

        return null;
      });
    },

    handleIsModified: function () {
      try {
        if (!Sitecore) {
          return;
        }

        if (!ExperienceEditorContext.isModified) {
          return;
        }

        return TranslationUtil.translateText(TranslationUtil.keys.There_are_unsaved_changes);
      } catch (e) {
        return;
      }
    },

    generatePageContext: function(context, doc) {
      var postElements;
      var scFieldValues = doc.getElementById("scFieldValues");
      if (scFieldValues) {
        postElements = scFieldValues.getElementsByTagName("input");
      }
      var fields = {};
      if (postElements) {
        for (var i = 0; i < postElements.length; i++) {
          fields[postElements[i].id] = experienceEditor.Web.encodeHtml(postElements[i].value);
        }
      }
      context.currentContext.scValidatorsKey = "VK_SC_PAGEEDITOR";
      context.currentContext.scFieldValues = fields;

      return context;
    },

    generateDefaultContext: function () {
      var currentLanguage = experienceEditor.Web.getUrlQueryStringValue("sc_lang");
      if (currentLanguage == '') {
        currentLanguage = ExperienceEditorProxy.language();
      }
      return {
        currentContext: {
          language: currentLanguage,
          version: "",
          isHome: false,
          itemId: experienceEditor.Web.getUrlQueryStringValue("itemId"),
          database: experienceEditor.Web.getUrlQueryStringValue("database"),
          deviceId: experienceEditor.Web.getUrlQueryStringValue("deviceId"),
          isLocked: false,
          webEditMode: experienceEditor.Web.getUrlQueryStringValue("mode"),
          argument: ""
        }
      };
    },

    navigateToItem: function (itemId) {
      var origin = window.parent.location.origin;
      if (!origin) {
        origin = window.parent.location.protocol + "//" + window.parent.location.hostname + (window.parent.location.port ? ':' + window.parent.location.port : '');
      }

      var virtualFolder = experienceEditor.getContext().instance.currentContext.virtualFolder;
      if (virtualFolder != "/" && virtualFolder != "") {
        origin = origin + virtualFolder;
      }

      var url = origin + window.parent.location.search;
      url = experienceEditor.Web.replaceItemIdParameter(url, itemId);
      url = experienceEditor.Web.setQueryStringValue(url, "sc_ee_fb", "false");
      url = experienceEditor.Web.removeQueryStringParameter(url, "sc_version");

      experienceEditor.navigateToUrl(url);
    },

    navigateToItemInCE: function (itemId) {
      var context = experienceEditor.generateDefaultContext();
      context.currentContext.value = itemId;
      var usePopUpContentEditor = window.parent.Sitecore.WebEditSettings.usePopUpContentEditor;
      if (usePopUpContentEditor) {
        experienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Breadcrumb.EditItem", function (response) {
          var value = response.responseValue.value.split('|');
          if (value.length != 2) {
            return;
          }

          var dialogUrl = value[0];
          var dialogFeatures = value[1];
          console.log(response.responseValue.value);
          experienceEditor.Dialogs.showModalDialog(dialogUrl, null, dialogFeatures);
        }).execute(context);

        return;
      }

      experienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Item.GetUri", function (response) {
        var url = experienceEditor.Web.replaceCEParameter(window.top.location.toString(), "1");
        url = experienceEditor.Web.setQueryStringValue(url, "sc_ce_uri", encodeURIComponent(response.responseValue.value));
        experienceEditor.navigateToUrl(url);
      }).execute(context);
    },

    navigateToUrl: function (url) {
      experienceEditor.modifiedHandling(true, function (isOk) {
        window.parent.location = url;
      });
    },

    ribbonFrame: function () {
      return window.parent.document.getElementById("scWebEditRibbon");
    },

    ribbonDocument: function () {
      return experienceEditor.ribbonFrame().contentWindow.document;
    }
  };

  experienceEditor.Common = {
    registerDocumentStyles: function (stylesCollection, documentElement) {
      var doc = documentElement || document;
      for (var i = 0; i < stylesCollection.length; i++) {
        var cssHref = stylesCollection[i].toLowerCase();
        var isExists = false;
        for (var j = 0; j < doc.styleSheets.length; j++) {
          if (doc.styleSheets[j]
            && doc.styleSheets[j].href
            && doc.styleSheets[j].href.toLowerCase() == cssHref) {
            isExists = true;
            break;
          }
        }
        if (!isExists) {
          var link = document.createElement("link");
          link.href = cssHref;
          link.type = "text/css";
          link.rel = "stylesheet";
          doc.getElementsByTagName("head")[0].appendChild(link);
        }
      }
    },

    searchElementWithText: function (text, element) {
      var el = element || window.document.body;
      var elements = el.getElementsByTagName("*");
      for (var i = 0; i < elements.length; i++) {
        if ($(elements[i]).text() == text) {
          return elements[i];
        }
      }
      return null;
    },

    closeFullContentIframe: function (iframe) {
      if (!iframe && ExperienceEditorContext.openedFullContentIframe) {
        ExperienceEditorContext.openedFullContentIframe.ownerDocument.body.removeChild(ExperienceEditorContext.openedFullContentIframe);
        return;
      }

      if (iframe && iframe.parentNode === window.parent.document.body) {
        window.parent.document.body.removeChild(iframe);
      }
    },

    getCookieValue: function (cookieName) {
      var name = cookieName + "=";
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.indexOf(name) == 0) {
          return cookie.substring(name.length, cookie.length);
        }
      }

      return "";
    },

    displayTab: function(tabControl) {
      if (!tabControl) {
        var tabs = jQuery(".sc-quickbar-tab");
        tabs.first().addClass("sc-quickbar-tab-selected");
        document.cookie = "sitecore_webedit_activestrip" + "=" + escape(tabs.first().attr('id'));
        return;
      }

      if (ExperienceEditorContext.instance && ExperienceEditorContext.instance.cachedCommands) {
        experienceEditor.CommandsUtil.runCommandsCollectionCanExecute(ExperienceEditorContext.instance.cachedCommands, function (stripId) {
          return stripId + "_ribbon_tab" !== tabControl.id;
        }, true);
      }

      var clickedTab = jQuery(tabControl);
      var selectedClassName = "sc-quickbar-tab-selected";
      var tabs = jQuery(".sc-quickbar-tab");
      var strips = jQuery(".sc-strip");

      tabs.removeClass(selectedClassName);
      clickedTab.addClass(selectedClassName);

      var tabIndex = tabs.index(clickedTab);
      strips.hide().eq(tabIndex).show();
      document.cookie = "sitecore_webedit_activestrip" + "=" + escape(tabControl.id);
    },

    setCookie: function (name, value, expires, path, domain, secure) {
      if (expires == null) {
        expires = new Date();
        expires.setMonth(expires.getMonth() + 3);
      }

      if (path == null) {
        path = "/";
      }

      document.cookie = name + "=" + escape(value) +
      (expires ? "; expires=" + expires.toGMTString() : "") +
      (path ? "; path=" + path : "") +
      (domain ? "; domain=" + domain : "") +
      (secure ? "; secure" : "");
    },

    addOneTimeEvent: function (conditionFunc, doFunc, interval, context) {
      var intervalFunc = window.setInterval(function () {
        if (conditionFunc(context)) {
          window.clearInterval(intervalFunc);
          doFunc(context);
        }
      }, interval);
    },

    showGallery: function (url, initiator, dimensions) {
      experienceEditor.Common.registerDocumentStyles(["/-/speak/v1/ribbon/Gallery.css"], window.parent.document);
      var clientRect = initiator.getBoundingClientRect();
      var iframeContentStyle = "z-index: 10000; display: none; overflow:auto; position: fixed; top: " + clientRect.top + "px; left: " + clientRect.left + "px; width: " + dimensions.width + "; height: " +
        dimensions.height;
      var iframeContent = document.createElement("iframe");
      iframeContent.className = "scGalleryFrame";
      iframeContent.contentEditable = "true";
      iframeContent.style.cssText = iframeContentStyle;
      iframeContent.src = url;
      iframeContent.id = "ee_iframeGallery";
      var ribbonWindow = window;
      ExperienceEditorContext.openedFullContentIframe = iframeContent;

      iframeContent.onload = function () {
        iframeContent.style.display = "block";

        window.document.onclick = function () {
          experienceEditor.Common.closeFullContentIframe(iframeContent);
        };

        ribbonWindow.parent.document.onclick = function () {
          experienceEditor.Common.closeFullContentIframe(iframeContent);
        };
      };
      window.parent.document.body.appendChild(iframeContent);
    },

    getElementById: function (id) {
      return document.querySelector('[data-sc-id="' + id + '"]');
    },

    removeNotificationMessage: function(messageText) {
      experienceEditor.getContext().instance.NotificationBar.removeMessage(function (message) {
        return message.text == messageText;
      });

      if (!window.parent.Sitecore
        || !window.parent.Sitecore.PageModes
        || !window.parent.Sitecore.PageModes.DesignManager) {
        return;
      }

      window.parent.Sitecore.PageModes.DesignManager.sortingEnd();
    }
  };

  experienceEditor.Dialogs = {
    alert: function (message, onCloseCallback) {
      window.alert(message);
      if (onCloseCallback) {
        onCloseCallback();
      }
    },

    confirm: function (message, onCloseCallback) {
      var dialogUrl = "/sitecore/client/Applications/ExperienceEditor/Dialogs/Confirm/?message=" + message;
      experienceEditor.Dialogs.showModalDialog(dialogUrl, "", "", null, onCloseCallback);
    },

    prompt: function (message, defaultValue, onCloseCallback) {
      var dialogUrl = "/sitecore/client/Applications/ExperienceEditor/Dialogs/Prompt/?message=" + message + "&defaultValue=" + defaultValue;
      experienceEditor.Dialogs.showModalDialog(dialogUrl, "", "", null, onCloseCallback);
    },

    showModalDialog: function (dialogUrl, dialogArguments, dialogFeatures, request, onCloseCallback) {
      this.setDialogLoadedEvent();
      var dialogFrame = this.getjqueryModalDialogsFrame();
      if (!dialogFrame) {
        return;
      }

      if (dialogUrl.toLowerCase().indexOf("/sitecore/client/applications/experienceeditor/dialogs/") == 0) {
        dialogFrame.style.opacity = "0";
        dialogFrame.style.filter = 'alpha(opacity=0)';
      }

      if (!dialogFeatures) {
        dialogFeatures = "dialogHeight: 700px;dialogWidth: 800px;";
      }

      if (!request) {
        request = {
          dialogResult: "",
          resume: function (data) { }
        };
      }

      dialogFrame.contentWindow.showModalDialog(dialogUrl, dialogArguments, dialogFeatures, request, null, window, onCloseCallback);
    },

    setDialogLoadedEvent: function () {
      var jqueryModalDialogsFrame = this.getjqueryModalDialogsFrame();
      if (!jqueryModalDialogsFrame) {
        return;
      }

      jQuery(jqueryModalDialogsFrame.contentWindow.document).one("DOMSubtreeModified", function () {
        var scContentIframeId0 = jqueryModalDialogsFrame.contentWindow.document.getElementById("scContentIframeId0");
        if (!scContentIframeId0) {
          return;
        }

        scContentIframeId0.onload = function () {
          jQuery(document).trigger("dialog:loaded", scContentIframeId0.contentWindow.document);
        };
      });
    },

    getjqueryModalDialogsFrame: function () {
      return window.parent.parent.parent.document.getElementById("jqueryModalDialogsFrame");
    }
  };

  experienceEditor.Web = {
    downloadFile: function (filename) {
      var sitecore = scSitecore.prototype;
      var request = { pipeline: "DownloadFile" };
      var command = { value: filename };
      sitecore.state = {};
      sitecore.process(request, command, "Download");
    },

    updateHtml5Cache: function () {
      if (!navigator.onLine) {
        return;
      }

      window.applicationCache.addEventListener('updateready', function (e) {
        if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
          window.applicationCache.swapCache();
        }
      }, false);
      try {
        window.applicationCache.update();
      } catch (err) {
        console.log("ApplicationCache is not declared.");
      }
    },

    encodeHtml: function (htmlSource) {
      htmlSource = htmlSource.replace(/\\/g, '\\\\').replace(/\"/g, "\\\"");
      var encodedHtml = encodeURIComponent(htmlSource);
      return encodedHtml;
    },

    getUrlQueryStringValue: function (parameterName) {
      return this.getQueryStringValue(location.href, parameterName);
    },

    getQueryStringValue: function (url, parameterName) {
      parameterName = parameterName.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + parameterName + "=([^&#]*)");
      var results = regex.exec(decodeURIComponent(url));
      return results == null ? "" : results[1].replace(/\+/g, " ");
    },

    setQueryStringValue: function (url, parameterName, newValue) {
      url = url.toLowerCase();
      parameterName = parameterName.toLowerCase();
      if (url.indexOf("&" + parameterName + "=") == -1 && url.indexOf("?" + parameterName + "=") == -1) {
        var divider = url.indexOf("?") == -1 ? "?" : "&";
        url += divider + parameterName + "=" + newValue;
      } else {
        var regExp = new RegExp("(" + parameterName + "=)[^\&]+");
        url = (url.replace(regExp, '$1' + newValue));
      }

      return url;
    },

    removeQueryStringParameter: function (url, parameterName) {
      url = url.toLowerCase();
      parameterName = parameterName.toLowerCase();
      if (url.indexOf("?" + parameterName + "=") != -1) {
        url = url.replace(new RegExp("(" + parameterName + "=)[^\&]+\&?"), "");
      }

      if (url.indexOf("&" + parameterName + "=") != -1) {
        url = url.replace(new RegExp("(\&" + parameterName + "=)[^\&]+"), "");
      }

      return url;
    },

    replaceItemIdParameter: function (url, itemId) {
      return experienceEditor.Web.setQueryStringValue(url, "sc_itemid", itemId);
    },

    replaceCEParameter: function (url, value) {
      return experienceEditor.Web.setQueryStringValue(url, "sc_ce", value);
    },

    postServerRequest: function (requestType, commandContext, handler, async) {
      var token = $('input[name="__RequestVerificationToken"]').val();
      jQuery.ajax({
        url: "/-/speak/request/v1/expeditor/" + requestType,
        data: {
          __RequestVerificationToken: token,
          data: decodeURIComponent(JSON.stringify(commandContext))
        },
        success: handler,
        type: "POST",
        async: async != undefined ? async : false
      });
    }
  };

  experienceEditor.PipelinesUtil = {
    generateDialogCallProcessor: function (options) {
      var pipelineProcessor = {
        priority: 1,
        execute: function(context) {
          context.suspend();
          experienceEditor.Dialogs.showModalDialog(options.url(context), options.arguments, options.features, options.request, function(responseValue) {
            if (!responseValue || responseValue.length <= 0) {
              context.aborted = true;
              return;
            }

            if (options.onSuccess) {
              options.onSuccess(context, responseValue);
            }

            context.resume();
          });
        }
      };

      return pipelineProcessor;
    },

    generateRequestProcessor: function (requestType, onSuccess, customContext) {
      var pipelineProcessor =
      {
        priority: 1,
        execute: function (context, appPostRequest) {
          if (context == null) {
            context = experienceEditor.generateDefaultContext();
          }
          var postContext = !customContext ? context.currentContext : customContext;
          var app = !appPostRequest ? context.app : appPostRequest;
          if (!app || !app.postServerRequest) {
            if (!app) {
              app = {};
            }
            app.postServerRequest = experienceEditor.Web.postServerRequest;
          }
          app.postServerRequest(requestType, postContext, function (response) {
            if (response.error) {
              if (app && app.handleResponseErrorMessage) {
                app.handleResponseErrorMessage(response, true);
              } else {
                if (response.errorMessage) {
                  //experienceEditor.Dialogs.alert(response.errorMessage);
                }
              }
              context.aborted = true;
              return;
            }

            if (!response.responseValue) {
              console.log(requestType + " is not implemented on server side.");
              context.aborted = true;
              return;
            }

            if (response.responseValue.abortMessage
              && response.responseValue.abortMessage != "") {
              experienceEditor.Dialogs.alert(response.responseValue.abortMessage);
              context.aborted = true;
              return;
            }

            if (response.responseValue.confirmMessage
              && response.responseValue.confirmMessage != "") {
              experienceEditor.Dialogs.confirm(response.responseValue.confirmMessage, function (isOk) {
                if (!isOk) {
                  context.aborted = true;
                  return;
                }

                context.resume();
                experienceEditor.PipelinesUtil.onRequestProcessorSuccessCallback(onSuccess, context, postContext, response);
              });
              context.suspend();
              return;
            }

            experienceEditor.PipelinesUtil.onRequestProcessorSuccessCallback(onSuccess, context, postContext, response);
          }, false);
        }
      };

      return pipelineProcessor;
    },

    onRequestProcessorSuccessCallback: function (onSuccess, context, postContext, response) {
      if (!onSuccess) {
        return;
      }

      var responseContext = {};
      if (context) {
        responseContext = context;
      } else {
        responseContext.currentContext = postContext;
      }
      response.context = responseContext;

      onSuccess(response);
    },

    executeProcessors: function (pipeline, context) {
      if (pipeline == null) {
        return;
      }
      var processors = pipeline.processors;
      var list = _.sortBy(processors, function (processor) {
        return processor.priority;
      });

      var firstProcessor = list[0];
      if (!firstProcessor) {
        return;
      }

      context.pipelineProcessors = list;
      context.currentProcessorIndex = 0;

      experienceEditor.PipelinesUtil.runProcessor(context);
    },

    runProcessor: function (context) {
      var processor = context.pipelineProcessors[context.currentProcessorIndex];
      if (!processor) {
        return;
      }

      context.suspend = function () {
        context.suspended = true;
      };

      context.resume = function () {
        context.suspended = false;
        context.currentProcessorIndex++;
        experienceEditor.PipelinesUtil.runProcessor(context);
      };

      processor.execute(context);
      if (context.aborted) {
        return;
      }

      if (context.suspended) {
        return;
      }

      context.resume();
    },

    executePipeline: function (pipeline, executionFunction) {
      if (pipeline.get("isPipelineReady")) {
        executionFunction();
      } else {
        pipeline.loadAndInitPipeline();
        pipeline.on("pipelineready", executionFunction);
      }
    },
  };

  experienceEditor.CommandsUtil = {
    dropDownMenuItemCommands: new Array(),

    addDropDownMenuItemCommand: function (menuItemId, commandName) {
      if (menuItemId == "" || commandName == "") {
        return;
      }

      this.dropDownMenuItemCommands.push({
        menuItemId: menuItemId,
        commandName: commandName
      });
    },

    runCommandsCollectionCanExecute: function(commands, skipConditionFuncByStripId, skipEvaluated) {
      $.each(commands, function () {
        if (skipConditionFuncByStripId && skipConditionFuncByStripId(this.stripId)) {
          return;
        }

        if (this.command === undefined) {
          var controlStateResult = this.initiator.viewModel.$el.attr("data-sc-controlstateresult");
          if (controlStateResult && controlStateResult != "") {
            this.initiator.set({ isEnabled: controlStateResult == "True" });
          }
          return;
        }

        if (skipEvaluated && this.evaluated) {
          return;
        }

        var context = experienceEditor.getContext().instance.getContext(this.initiator);
        var clonedContext = experienceEditor.getContext().instance.clone(context);
        this.initiator.set({ isEnabled: this.command.canExecute(clonedContext, this) });
        this.evaluated = true;
      });
    },

    getCommandByDropDownMenuItemId: function (dropDownMenuItemId) {
      if (dropDownMenuItemId == "") {
        return null;
      }

      var command = null;

      $.each(this.dropDownMenuItemCommands, function () {
        if (this.menuItemId == dropDownMenuItemId) {
          command = this;
        }
      });

      return command;
    },

    runCommandCanExecute: function (commandName, context) {
      var command = ExperienceEditorContext.instance.getCommand(commandName);
      if (!command) {
        return false;
      }

      return command.canExecute(context);
    },

    runCommandExecute: function (commandName, context) {
      var command = ExperienceEditorContext.instance.getCommand(commandName);
      if (!command) {
        return;
      }

      command.execute(context);
    },

    getControlsByCommand: function (app, command) {
      var controls = [];
      $.each(app, function () {
        if (this.get && this.get("command") == command
          || this.model && this.model.get && this.model.get("command") == command) {
          controls.push(this);
        }
      });

      return controls;
    },

    triggerControlStateByCommand: function (that, isPressedModelName) {
      that.toggleInternalPressed();
      var id = that.$el.attr("data-sc-id");
      var subscribedControls = experienceEditor.CommandsUtil.getControlsByCommand(that.app, that.model.get("command"));
      var buttonValue = that.model.get(isPressedModelName);
      $.each(subscribedControls, function () {
        if (this.viewModel.toggleInternalPressed
          && id != this.viewModel.$el.attr("data-sc-id")) {

          this.viewModel.updatePressed(buttonValue);
        }
      });
    },
  };

  return experienceEditor;
});