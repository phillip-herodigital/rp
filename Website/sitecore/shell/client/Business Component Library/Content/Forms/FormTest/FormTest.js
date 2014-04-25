define(["sitecore"], function (Sitecore) {
  var FormTest = Sitecore.Definitions.App.extend({
      initialized: function () {
          this.Carousel.on("change:clickedItemId", this.showPopup, this);          
      },
      showPopup: function(carousel, args) {
          alert(args["position"]);
      }
  });

  return FormTest;
});