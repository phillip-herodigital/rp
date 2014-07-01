﻿ngApp.factory('scrollService', ['jQuery', '$window', function (jQuery, window) {

    var service = {};

    /**
     * Scroll to ID
     * 
     * @param {string} id       //DOM id of element to scroll to
     * @param {int} offset      //Offset to add padding for adjusting position
     */
    service.scrollTo = function (id, offset) {
        jQuery('html, body').animate({
            scrollTop: jQuery('#' + id).offset().top + offset
        }, 'fast');
    };

    service.toggleScrolling = function(value) {
        var $body = jQuery('body'),
            $pageWrapper = jQuery('.page-wrapper'),
            $window = jQuery(window),
            scrollTop = jQuery(window).scrollTop();

        if(value) {
            $window.scrollTop(0);
            $body.css('overflow-y', 'scroll');
            $pageWrapper.css({ 'top': -(scrollTop), 'position': 'fixed' });
        } else {
            $window.scrollTop(-(parseInt($pageWrapper.css('top'), 10)));
            $pageWrapper.css({ 'top': 'auto', 'position': 'static' });
        }

    };

    return service;
}]);
