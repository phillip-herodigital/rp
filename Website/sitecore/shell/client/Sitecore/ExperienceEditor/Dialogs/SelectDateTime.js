define(["sitecore", "/-/speak/v1/ExperienceEditor/Sitecore.ExperienceEditor.js"], function (Sitecore) {
  var insertPagePageCode = Sitecore.Definitions.App.extend({
    translationContext: null,
    templateId: null,

    initialized: function () {
      this.SelectedDate.viewModel.$el.blur();
      this.setOkButtonClick();
      this.setCancelButtonClick();
      this.setDateTime();
    },
    setDateTime: function () {
      var scDate = Sitecore.ExperienceEditor.Web.getUrlQueryStringValue("sc_date");
      if (!scDate) {
        this.SelectedDate.viewModel.setDate(Date.now());
        this.SelectedTime.set('time', this.SelectedTime.viewModel.convertFormattedTimeToTime(new Date()));
        return;
      }

      this.SelectedDate.set('date', scDate);
      this.SelectedTime.set('time', scDate);
    },
    setOkButtonClick: function () {
      this.on("button:ok", function () {
        var selectedDate = this.SelectedDate.attributes.date;
        this.closeDialog(selectedDate.replace("T000000", this.SelectedTime.get("time")));
      }, this);
    },
    setCancelButtonClick: function () {
      this.on("button:cancel", function () {
        this.closeDialog(null);
      }, this);
    },
  });
  return insertPagePageCode;
});