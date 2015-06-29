define(["sitecore"], function (sitecore) {
  return {
    priority: 2,
    execute: function (c) {
      var fileDownloadCheckTimer;
      c.spinner.set("isBusy", true);
      c.action.disable();

      if (c.currentContext.url) {
        // use the current timestamp as the token value

        var element = '<iframe style="display:none;" src="' + c.currentContext.url + '" width="0" height="0" />';
        $('body').append(element);

        var cookieName = 'fileDownloadToken' + c.currentContext.messageId + c.currentContext.language + c.currentContext.token;

        fileDownloadCheckTimer = window.setInterval(function () {
          var cookieValue = $.cookie(cookieName);
          if (cookieValue == c.currentContext.token)
            finishDownload();
        }, 300);

        function finishDownload() {
          window.clearInterval(fileDownloadCheckTimer);
          $.removeCookie(cookieName);
          c.spinner.set("isBusy", false);
          c.action.enable();
        }
      }
    }
  };
});