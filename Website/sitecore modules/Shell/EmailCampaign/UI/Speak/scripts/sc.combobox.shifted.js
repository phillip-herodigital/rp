(function ($) {
    var prototype = $.sc.combobox.prototype;
    $.widget("sc.combobox", $.extend({}, prototype, {
        _countOffset: function (sender) {
            var result = prototype._countOffset.call(this, sender);

            if (this.element.hasClass("shifted")) {
                result.top = result.top + 10;
                result.left = result.left + 2;
            }
           
            return result;
        }
    }));
})(jQuery);
