define(["sitecore"], function (sitecore) {
  return sitecore.Definitions.App.extend({
    initialized: function () {
      var context = this;
      var variantContextObj;

      this.on("message:variant:content:editor:dialog:ok", function () {
        var ribbonIframe = context.Frame.viewModel.$el[0].contentWindow.document.getElementById("scWebEditRibbon");
        var experienceEditor = ribbonIframe.contentWindow.Sitecore.ExperienceEditor;

        if (experienceEditor.isModified) {
          experienceEditor.instance.disableRedirection = true;
          experienceEditor.CommandsUtil.runCommandExecute("Save", experienceEditor.instance);

          // wait for content saving
          experienceEditor.Common.addOneTimeEvent(function (that) {
            return experienceEditor.isContentSaved;
          }, function (that) {
            
            context.DialogWindow.hide();
          }, 100, this);
        } else {
          context.DialogWindow.hide();
        }
      });

      this.on("message:variant:content:editor:dialog:cancel", function () {
        checkModifiedContent();
      });

      sitecore.on("message:variant:content:editor:dialog:show", function (variantContext) {
        if (!variantContext) {
          return;
        }

        if (variantContext.BodyFrame.get("isReadOnly")) {
          return;
        }

        variantContextObj = variantContext;

        var urlToEdit = variantContext.UrlToEditText.get("text");
        if (urlToEdit) {
          context.Frame.set("sourceUrl", urlToEdit);
          context.DialogWindow.show();

          //Todo: This is the workaround to set the Experience Editor to edit mode. Remove it in Sitecore 8.o update 1. 
         var setEditMode = setInterval(function() {
            var ribbonIframe = context.Frame.viewModel.$el[0].contentWindow.document.getElementById("scWebEditRibbon");
            if (ribbonIframe && ribbonIframe.contentWindow && ribbonIframe.contentWindow.Sitecore) {
              var experienceEditor = ribbonIframe.contentWindow.Sitecore.ExperienceEditor;
              if (experienceEditor && experienceEditor.PageEditorProxy) {
                experienceEditor.PageEditorProxy.changeCapability("edit", true);
                clearInterval(setEditMode);
              }
            }
          }, 1000);
        }

        // make sure the message is saved
        sitecore.trigger("message:save");
      });

      function checkModifiedContent() {
        var ribbonIframe = context.Frame.viewModel.$el[0].contentWindow.document.getElementById("scWebEditRibbon");

        if (!ribbonIframe) {
          context.DialogWindow.hide();
          return true;
        }

        var experienceEditor = ribbonIframe.contentWindow.Sitecore.ExperienceEditor;

        experienceEditor.modifiedHandling(true, function (isOkPressed) {
          if (!isOkPressed) {
            // Cancel button was pressed or no content modifications here.
            context.DialogWindow.hide();
            return;
          }

          // wait for content saving
          experienceEditor.Common.addOneTimeEvent(function (that) {
            return experienceEditor.isContentSaved;
          }, function (that) {
            context.DialogWindow.hide();
          }, 100, this);
        });

        return experienceEditor.isModified;
      }

      context.DialogWindow.viewModel.$el.on("hide", function () {
        var frameElement = variantContextObj.BodyFrame.viewModel.$el;
        frameElement.attr("src", frameElement.attr("src"));
        setTimeout(function () { frameElement.contents().find('html').css("cursor", "pointer"); }, 500);
      });
    }
  });
});