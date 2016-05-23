define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js", "/-/speak/v1/ExperienceEditor/ExperienceEditorProxy.js"], function (Sitecore, ExperienceEditor, ExperienceEditorProxy) {
  Sitecore.Commands.Save =
  {
    canExecute: function (context, parent) {
      if (!ExperienceEditor.isInMode("edit")) {
        parent.initiator.set({ isVisible: false });
        return false;
      }

      var saveButtonState = window.parent.document.getElementById("__SAVEBUTTONSTATE");
      var modifiedState = ExperienceEditor.Web.getUrlQueryStringValue("sc_smf");
      if (modifiedState == "1") {
        saveButtonState.value = modifiedState;
        ExperienceEditor.getContext().isModified = true;
      }

      saveButtonState.onchange = function () {
        ExperienceEditor.setSaveButtonState(true);
        ExperienceEditor.getContext().isModified = saveButtonState.value == 1;
        if (parent
          && parent.initiator) {
          parent.initiator.set({ isEnabled: ExperienceEditor.getContext().isModified });
        }
      };

      return parseInt(saveButtonState.value) == 1;
    },
    execute: function (context) {
      context = ExperienceEditor.generatePageContext(context, window.parent.document);
      context.currentContext.scLayout = ExperienceEditor.Web.encodeHtml(window.parent.document.getElementById("scLayout").value);
      ExperienceEditorProxy.onSaving();

      if (context.app && context.app.disableButtonClickEvents) {
        context.app.disableButtonClickEvents();
      }

      ExperienceEditor.getContext().isModified = false;
      ExperienceEditor.getContext().isContentSaved = false;
      var pipelineContext = ExperienceEditor.getContext().instance || window.top.ExperienceEditor.instance;
      ExperienceEditor.PipelinesUtil.executePipeline(pipelineContext.SavePipeline, function () {
        ExperienceEditor.PipelinesUtil.executeProcessors(Sitecore.Pipelines.Save, context);
        ExperienceEditor.setSaveButtonState(context.aborted);
      });

      if (context.app && context.app.enableButtonClickEvents) {
        context.app.enableButtonClickEvents();
      }
    }
  };
});