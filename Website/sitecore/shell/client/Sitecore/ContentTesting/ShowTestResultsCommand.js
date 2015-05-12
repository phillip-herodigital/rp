require.config({
  paths: {
    loadingImage: "/sitecore/shell/client/Sitecore/ContentTesting/LoadingImage"
  }
});

define(["sitecore", "loadingImage"], function (Sitecore, loadingImage) {
  Sitecore.Commands.Results =
  {
    canExecute: function (context, sourceControl) {
      var testCount = context.app.canExecute("Optimization.ActiveItemTests.Count", context.currentContext);
      return testCount > 0;
    },

    execute: function (context) {
      var dialogPath = "/sitecore/client/Applications/ContentTesting/Pages/TestResults.aspx?"
        + "id=" + context.app.currentContext.itemId
        + "&la=" + context.app.currentContext.language
        + "&vs=" + context.app.currentContext.version;

      var dialogFeatures = "dialogHeight: 800px;dialogWidth: 1000px;";
      Sitecore.ExperienceEditor.Dialogs.showModalDialog(dialogPath, '', dialogFeatures, null, function (result) {
        if (!result) {
          return;
        }
      });


      // Show the loading image until dialog doesn't appeared
      loadingImage.showElement();
      loadingImage.waitLoadingDialog("jqueryModalDialogsFrame", { height: 860, minWidth: 1000 });
    }
  };
});