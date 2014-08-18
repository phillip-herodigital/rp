(function ($) {
    var prototype = $.sc.grid.prototype;
    $.widget("sc.grid", $.extend({}, prototype, {
        beforeSelectRow: function (rowid, e) {
            if (this.element.hasClass("unselectable")) {
                return false;
            }

            prototype.beforeSelectRow.apply(this, arguments);
            return true;
        }
    }));
})(jQuery);
