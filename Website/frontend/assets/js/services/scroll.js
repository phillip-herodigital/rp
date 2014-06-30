ngApp.factory('scrollService', ['jQuery', function (jQuery) {

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

    return service;
}]);
