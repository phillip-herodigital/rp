define(["sitecore", "/-/speak/v1/ExperienceEditor/Sitecore.ExperienceEditor.js"], function (Sitecore) {
  var confirmDialog = Sitecore.Definitions.App.extend({
    initialized: function () {
      $(this.MessageBody.viewModel.$el[0]).text(Sitecore.ExperienceEditor.Web.getUrlQueryStringValue("message"));
      this.setOkButtonClick();
      this.setCancelButtonClick();
    },
    setCancelButtonClick: function () {
      this.on("button:cancel", function () {
        this.closeDialog(false);
      }, this);
    },
    setOkButtonClick: function () {
      this.on("button:ok", function () {
        this.closeDialog(true);
      }, this);
    },
  });
  return confirmDialog;
});