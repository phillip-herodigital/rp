angular.module('maskJQuery', []).config(['$provide', function ($provide) {
    var jQuery = window.jQuery;
    //window.$ = window.jQuery = undefined;
    $provide.factory('jQuery', [function () {
        return jQuery;
    }]);
}]);