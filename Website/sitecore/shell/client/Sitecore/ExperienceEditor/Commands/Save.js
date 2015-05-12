define(["sitecore"], function (Sitecore) {
  Sitecore.Commands.Save =
  {
    canExecute: function (context, parent) {
      if (!Sitecore.ExperienceEditor.isInMode("edit")) {
        parent.initiator.set({ isVisible: false });
        return false;
      }

      var saveButtonState = window.parent.document.getElementById("__SAVEBUTTONSTATE");
      var modifiedState = Sitecore.ExperienceEditor.Web.getUrlQueryStringValue("sc_smf");
      if (modifiedState == "1") {
        saveButtonState.value = modifiedState;
        Sitecore.ExperienceEditor.isModified = true;
      }

      saveButtonState.onchange = function () {
        Sitecore.ExperienceEditor.setSaveButtonState(true);
        Sitecore.ExperienceEditor.isModified = saveButtonState.value == 1;
        if (parent
          && parent.initiator) {
          parent.initiator.set({ isEnabled: Sitecore.ExperienceEditor.isModified });
        }
      };

      return parseInt(saveButtonState.value) == 1;
    },
    execute: function (context) {
      var postElements;
      var scFieldValues = window.parent.document.getElementById("scFieldValues");
      if (scFieldValues) {
        postElements = scFieldValues.getElementsByTagName("input");
      }
      var fields = {};
      if (postElements) {
        for (var i = 0; i < postElements.length; i++) {
          fields[postElements[i].id] = Sitecore.ExperienceEditor.Web.encodeHtml(postElements[i].value);
        }
      }

      context.currentContext.scLayout = Sitecore.ExperienceEditor.Web.encodeHtml(window.parent.document.getElementById("scLayout").value);
      context.currentContext.scValidatorsKey = "VK_SC_PAGEEDITOR";
      context.currentContext.scFieldValues = fields;

      if (context.app && context.app.disableButtonClickEvents) {
        context.app.disableButtonClickEvents();
      }

      Sitecore.ExperienceEditor.isModified = false;
      Sitecore.ExperienceEditor.isContentSaved = false;
      var pipelineContext = Sitecore.ExperienceEditor.instance || window.top.ExperienceEditor.instance;
      Sitecore.ExperienceEditor.PipelinesUtil.executePipeline(pipelineContext.SavePipeline, function () {
        Sitecore.ExperienceEditor.PipelinesUtil.executeProcessors(Sitecore.Pipelines.Save, context);
        Sitecore.ExperienceEditor.isContentSaved = true;
      });
      Sitecore.ExperienceEditor.setSaveButtonState(context.aborted);

      if (context.app && context.app.enableButtonClickEvents) {
        context.app.enableButtonClickEvents();
      }
    }
  };
});