define(["sitecore", "/-/speak/v1/ExperienceEditor/Sitecore.ExperienceEditor.js"], function (Sitecore) {
  var dialogFrame = window.top.document.getElementById("jqueryModalDialogsFrame");
  var progressBar = Sitecore.ExperienceEditor.Common.getElementById("dialogProgressIndicator");
  Sitecore.ExperienceEditor.Common.addOneTimeEvent(function () {
    return window.frameElement.contentWindow.document.readyState === "complete";
  }, function () {
    resizeDialog();
    progressBar.style.display = "none";
    dialogFrame.style.opacity = "1";
    dialogFrame.style.filter = 'alpha(opacity=100)';
  }, 100, this);
  progressBar.style.height = "100%";
  resizeDialog();

  function resizeDialog() {
    try {
      dialogFrame.contentWindow.setDialogDimension(parseInt(width), parseInt(height));
    } catch (ex) {
    }
  };
});