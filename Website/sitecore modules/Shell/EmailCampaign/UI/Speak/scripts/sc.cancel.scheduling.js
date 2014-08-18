(function ($) {
  $.widget('sc.CancelScheduling', {
    options: {
      cancelButtonId: ''
    },

    _create: function () {
      options = this.options;

      this.addEvents();
    },

    addEvents: function () {
      var self = this;

      self.element.on('click', function () {
          $.netajax(self.element, 'cancelScheduling', true);
      });
    },

    destroy: function () {
      return $.Widget.prototype.destroy.call(this);
    }
  });
})(jQuery);