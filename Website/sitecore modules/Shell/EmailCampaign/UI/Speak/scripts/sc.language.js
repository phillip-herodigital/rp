(function ($) {
    $.widget('sc.language', {
        
    _create: function () {
      this.addEvents();
    },

    addEvents: function () {
      this.element.bind('change', function () {
        $(".field-editor").each(function () { var validate = $(this).data('validate'); if (validate) { validate.validate(null); } });
        if ($('*[aria-invalid="true"]').length > 0) {
          $('form').parents().triggerHandler('contenthide');
        }
        
        return true;
      });
    },

    destroy: function () {
      return $.Widget.prototype.destroy.call(this);
    }
  });
})(jQuery);