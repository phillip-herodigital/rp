(function (Speak) {

  require.config({
    paths: {
      scrollable: "/sitecore/shell/client/Business Component Library/version 2/Layouts/Renderings/Mixins/Scrollable"
    }
  });

  Speak.component(["scrollable"], function (Scrollable) {

    return Speak.extend({}, Scrollable.prototype);
      
  }, "ScrollablePanel");

})(Sitecore.Speak);