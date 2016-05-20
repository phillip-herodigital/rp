(function (speak) {
  speak.component({
    name: "AccountInformation",
    logout: function ( event, callback ) {
      var e = event;
      if ( arguments.length === 1 ) {
          e = arguments[0][1];
      }
      e.preventDefault();

      var ajaxSettings = {
        type: "POST",
        url: $(e.currentTarget).attr("href"),
        data: {},
        cache: false
      };

      var token = speak.utils.security.antiForgery.getAntiForgeryToken();
      ajaxSettings.data[token.formKey] = token.value;
      // Disable cache to make sure that URL is always "followed"
      // and the logout function gets executed on the server
      $.ajax( ajaxSettings ).done( function ( data ) {

          data = JSON.parse( data );

          if ( callback ) {
              callback( data );
          } else {
              window.location =  data.Redirect;
          }
      });
    }
  });
})(Sitecore.Speak);