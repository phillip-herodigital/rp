define(["sitecore", "jquery"], function(sc, $) {
  sc.Factories.createBaseComponent({
    name: "AccountInformation",
    base: "ControlBase",
    selector: ".sc-accountInformation",
    events: {
      "click .logout": "logout"
    },
    logout: function(e) {
      e.preventDefault();

      // Disable cache to make sure that URL is always "followed"
      // and the logout function gets executed on the server
      var ajaxSettings = {
        url: $(e.currentTarget).attr("href"),
        type: "POST",
        data: {},
        cache: false
      };

      var token = sc.Helpers.antiForgery.getAntiForgeryToken();
      ajaxSettings.data[token.formKey] = token.value;

      $.ajax(ajaxSettings).done(function(data) {
        window.location = JSON.parse(data).Redirect;
      });
    }
  });
});
