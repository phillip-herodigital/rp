ngApp.factory('scrollService', ['jQuery', '$window', function (jQuery, window) {

    var service = {};

    /**
     * Scroll to ID
     * 
     * @param {string} id       //DOM id of element to scroll to
     * @param {int} offset      //Offset to add padding for adjusting position
     */
    service.scrollTo = function (id, offset, time, callback) {
        //jQuery animate will call the callback twice because of html,body
        //so we're using a promise instead
        jQuery('html, body').animate({
            scrollTop: jQuery('#' + id).offset().top + offset
        }, time == 0 ? 0 : '500').promise().done(callback || angular.noop);
    };

    service.toggleScrolling = function(value) {
        var $body = jQuery('body'),
            $pageWrapper = jQuery('.page-wrapper'),
            $window = jQuery(window),
            scrollTop = jQuery(window).scrollTop();

        if(value) {
            $body.css('overflow-y', 'scroll');
            $pageWrapper.css({ 'top': -(scrollTop), 'position': 'fixed' });
            $window.scrollTop(0);
        } else {
            var top = -(parseInt($pageWrapper.css('top'), 10));
            $pageWrapper.css({ 'top': 'auto', 'position': 'static' });
            $window.scrollTop(top);
        }
    };

    return service;
}]);
