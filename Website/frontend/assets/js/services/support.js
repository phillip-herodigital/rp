/*
 * Support Center Service
 *
 */
ngApp.factory('supportCenterService', ['$http', function ($http) {
    var service = {
        categories: [],
        popFaqs: []
    }
    return service;
}]);