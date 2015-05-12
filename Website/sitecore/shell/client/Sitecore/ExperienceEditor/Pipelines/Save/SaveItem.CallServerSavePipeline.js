define(["sitecore"], function (Sitecore) {
  return Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Save.CallServerSavePipeline", function () {
    Sitecore.ExperienceEditor.isModified = false;
    if (!Sitecore.ExperienceEditor.instance.disableRedirection) {
      window.parent.location.reload();
    }

    Sitecore.ExperienceEditor.instance.disableRedirection = false;
  });
});