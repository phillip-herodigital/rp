define(["/-/speak/v1/EDS/edsUtil.js"], function (edsUtil) {
  return {
    download: function (baseUrl, options, onSuccessCallback, onErrorCallback, context) {
      var hiddenIFrameId = 'hiddenDownloader',
        iframe = $('#' + hiddenIFrameId);
      if (iframe.length === 0) {
        iframe = $("<iframe>", {
          "id": hiddenIFrameId,
          "style": "display:none;",
          "height": "0",
          "width": "0"
        });

        $('body').append(iframe);
      }

      iframe.attr('src', baseUrl + "?" + $.param(options));

      var cookieName = 'fileDownloadToken' + options.token;

      var fileDownloadCheckTimer = window.setInterval(function () {
        var cookieValue = edsUtil.getCookieValue(cookieName);
        if (cookieValue) {
          window.clearInterval(fileDownloadCheckTimer);

          // expire the cookie
          var cookieString = cookieName + '=' + cookieValue + ';expires=' + new Date(new Date().getTime() - 1000);
          document.cookie = cookieString;

          if (cookieValue === options.token.toString()) {
            onSuccessCallback.call(context, options);
          } else {
            onErrorCallback.call(context, options, cookieValue);
          }
        }
      }, 300);
    }
  }
});