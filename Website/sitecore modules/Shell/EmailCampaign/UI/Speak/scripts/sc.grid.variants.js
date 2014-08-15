(function ($) {
    var prototype = $.sc.grid.prototype;
    $.widget("sc.grid", $.extend({}, prototype, {

        onLoadComplete: function (data) {
            var self = this,
                options = this.options,
                rowsOverflow = false;

            prototype.onLoadComplete.apply(this, arguments);
            self.element.find('input[type=radio]').click(function () { var rowid = $(this).closest('tr').attr('id'); self.updateSelected(rowid); });
            //check if any radio selected
            self.element.find('input[type=radio]:checked').each(function () { var rowid = $(this).closest('tr').attr('id'); self.updateSelected(rowid); });
        }
    }))

})(jQuery);