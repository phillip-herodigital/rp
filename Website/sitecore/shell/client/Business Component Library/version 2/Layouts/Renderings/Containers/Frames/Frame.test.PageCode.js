(function(speak, $) {
  var src = $('[data-sc-id="Frame1"]').attr('src');
  window.speakFrame1TestSrcInit = src;
  speak.pageCode({
    initialize: function() {
    }
  });
})(Sitecore.Speak, jQuery);