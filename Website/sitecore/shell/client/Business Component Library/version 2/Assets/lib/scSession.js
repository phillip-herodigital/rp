(function() {
  var isBrowser = typeof window !== "undefined",
      root = isBrowser ? window : global,
      speak = root.Sitecore.Speak,
      logout = function (callback) {
        var ajaxSettings = {
          url: "/api/sitecore/Authentication/Logout?sc_database=master",
          type: "POST",
          data: {},
          cache: false
        };

        var token = speak.utils.security.antiForgery.getAntiForgeryToken();
        ajaxSettings.data[token.formKey] = token.value;
        $.ajax(ajaxSettings).complete(callback);
      },
      unauthorized = function () {
        logout(function () {
          window.top.location.reload(true);
        });
      };


  if (isBrowser && Sitecore) {
    Sitecore.Speak.module("session", {
      logout: logout,
      unauthorized: unauthorized
    });
  } else {
      exports = module.exports = Session;
  }
})();
