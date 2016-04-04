ngApp.controller('voiceInternationalCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.countries = [];

    $scope.selectedCountry = "";

    $scope.checkForDeselect = function () {

    }

    //$scope.countriesFromSitecore;

    //var displayCountries = [];
    //for (var i = 0; i < countriesFromSitecore.length; i++) {
    //    displayCountries.push(countriesFromSitecore[i].name);
    //}
    //$scope.displayCountries = [];
    //for (var i = 0; i < 4; i++) {
    //    $scope.displayCountries[i] = displayCountries.splice(0, Math.ceil(sitecoreCountries.length / (5 - i)));
    //}
    //$scope.displayCountries[4] = displayCountries;

    $http.get('/api/marketing/getVoiceInternationalRates')
        .success(function (countries) {
            $scope.countries = countries;
        }).error(function (data, status, headers, config) {
            $scope.ratesError = true;;
        });
}]);