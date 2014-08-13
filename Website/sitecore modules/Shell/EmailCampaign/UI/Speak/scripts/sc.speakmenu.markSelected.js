(function ($) {
    var prototype = $.sc.speakmenu.prototype;
    $.widget("sc.speakmenu", $.extend({}, prototype, {
        _clickItem: function (element) {
            prototype._clickItem.call(this, element);

            // If menu-item has been checked before we should mark it as selected with the help of css class
            var src = element.children().first().attr('src');
            if (src != null && src.indexOf("check.png") !== -1) {
                element.addClass("menu-item-selected");
            }
        }
    }));
})(jQuery);
