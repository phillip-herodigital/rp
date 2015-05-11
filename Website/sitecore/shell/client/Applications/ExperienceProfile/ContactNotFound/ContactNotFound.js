define(["sitecore", "/-/speak/v1/experienceprofile/DataProviderHelper.js", "/-/speak/v1/experienceprofile/CintelUtl.js"], function (sc, providerHelper, cintelUtil)
{
  var app = sc.Definitions.App.extend({
    initialized: function () {
      this.SearchTextBox.viewModel.$el.keyup($.proxy(function (e) {
        if (e.keyCode == 13) {
          this.SearchButton.viewModel.click();
        }
      }, this));

      var cid = decodeURIComponent(cintelUtil.getQueryParam("cid"));
      if (!cid) {
        return;
      }
   
      var notificationMessage = this.NotFoundMessageBarText.get("text").replace("{0}", cid);
      this.ContactNotFoundMessageBar.addMessage("notification", notificationMessage);
    },

    findContact: function () {
      window.location.assign('search?text=' + encodeURIComponent(this.SearchTextBox.get('text')));
    }
  });
  return app;
});

