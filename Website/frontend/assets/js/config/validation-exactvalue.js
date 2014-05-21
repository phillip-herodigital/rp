/// <reference path="../libs/angular/angular.js" />
/// <reference path="../app.js" />
/// <reference path="../providers/validation.js" />

ngApp.config(['validationProvider', function (validationProvider) {
    validationProvider.addValidator('exactvalue', function (val, options) {
        return !val || options.parameters['value'] == JSON.stringify(val);
    });
}]);
