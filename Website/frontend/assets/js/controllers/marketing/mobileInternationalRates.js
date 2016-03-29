
ngApp.controller('MobileInternationalRatesCtrl', ['$scope', '$http', function ($scope, $http) {
    
    $http.get('/api/marketing/mobileInternationalRates').success(function (data, status, headers, config) { 
        $scope.internationalRates = data;
    });

    /*$scope.$watch($scope.selectedCountry.country, function (newVal, oldVal) {
        console.log("selectedCountry");
        document.getElementById("country").blur();
    })*/

    $scope.focusSelect = function () {
        console.log('selecting focus');
        document.getElementById("country").focus();
    }
}]);