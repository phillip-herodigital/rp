define([
    "sitecore"
  ], function (Sitecore) {
  return {
    performRequest: function(options) {
      var token = Sitecore.Helpers.antiForgery.getAntiForgeryToken();
      
      if (options.headers == undefined) {
        options.headers = { };
      }
      
      options.headers[token.headerKey] = token.value;

      $.ajax(options);
    }
  };
});