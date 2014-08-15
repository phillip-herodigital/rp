(function ($) {
  $(document).ready(function() {
    if (window.scBrowser && $.browser.msie) {
      window.scBrowser.prototype.prompt = function(text, defaultValue) {
        var arguments = new Array(text, defaultValue);
        var features = "dialogWidth:400px;dialogHeight:110px;help:no;scroll:no;resizable:no;status:no;center:yes";
        return showModalDialog("/sitecore/shell/prompt.html", arguments, features);
      };
    }
  });
})(jQuery);