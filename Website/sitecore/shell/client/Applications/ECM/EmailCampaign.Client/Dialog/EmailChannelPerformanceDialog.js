define(["sitecore"], function(sitecore) {
  return sitecore.Definitions.App.extend({
    initialized: function() {
      var context = this;

      this.showDialog = function() {
        context.DialogWindow.show();
      };

    }
  });

});