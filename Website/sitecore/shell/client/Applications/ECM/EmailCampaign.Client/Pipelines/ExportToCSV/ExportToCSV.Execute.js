define(["sitecore"], function (sitecore) {
  return {
      priority: 1,
      execute: function (c) {
          var fileDownloadCheckTimer;
          c.spinner.set("isBusy", true);
          c.action.disable();
          
          var element = '<iframe style="display:none;" src="/sitecore/api/ssc/EXM/ExportToCSV?' + $.param(c.currentContext) + '" width="0" height="0" />';
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
  };
});