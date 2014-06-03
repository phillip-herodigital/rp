ngApp.factory('scrollService', ['jQuery', function (jQuery) {

    var service = {};

    /**
     * Scroll to ID
     * 
     * @param {string} id
     */
    service.scrollTo = function (id) {
        jQuery('html, body').animate({
            scrollTop: jQuery('#' + id).offset().top
        }, 'fast');
    };

    return service;
}]);
