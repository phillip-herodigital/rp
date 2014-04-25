define(["sitecore"], function (_sc) {
  var App = _sc.Definitions.App.extend({
    speak: function () {
      alert(this.FirstNameText.get("text") + " " + this.LastNameText.get("text"));
    }
  });
  return App;
});
