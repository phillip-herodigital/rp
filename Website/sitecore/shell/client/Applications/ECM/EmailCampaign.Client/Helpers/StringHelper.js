define([], function () {
  return {
    decodeHTMLCharCodes: (function () {
      var decoder = $('<p/>');

      return function(text) {
        return decoder.html(text).text();
      }
    })()
  };
});