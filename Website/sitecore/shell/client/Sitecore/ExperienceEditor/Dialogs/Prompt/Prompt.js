define(["sitecore", "/-/speak/v1/ExperienceEditor/Sitecore.ExperienceEditor.js"], function (Sitecore) {
  var promptDialog = Sitecore.Definitions.App.extend({
    initialized: function () {
      $(this.MessageBody.viewModel.$el[0]).text(Sitecore.ExperienceEditor.Web.getUrlQueryStringValue("message"));
      this.InputTextBox.viewModel.$el[0].value = Sitecore.ExperienceEditor.Web.getUrlQueryStringValue("defaultValue");
      this.setOkButtonClick();
      this.setCancelButtonClick();
    },
    setCancelButtonClick: function () {
      this.on("button:cancel", function () {
        this.closeDialog(null);
      }, this);
    },
    setOkButtonClick: function () {
      this.on("button:ok", function () {
        this.closeDialog(this.InputTextBox.viewModel.$el[0].value);
      }, this);
    },
  });
  return promptDialog;
});