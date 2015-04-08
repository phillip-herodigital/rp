ngApp.factory('urlService', ['$location', function ($location) {
    var service = {
        getParameterByName: function (name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec($location.absUrl());
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        },

    };

    return service;
}]);