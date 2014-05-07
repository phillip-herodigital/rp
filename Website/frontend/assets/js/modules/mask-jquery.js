angular.module('maskJQuery', []).config(function ($provide) {
    var jQuery = window.jQuery;
    window.$ = window.jQuery = undefined;
    $provide.factory('jQuery', [function () {
        return jQuery;
    }]);
});