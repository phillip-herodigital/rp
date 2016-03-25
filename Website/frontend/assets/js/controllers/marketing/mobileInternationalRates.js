
ngApp.controller('MobileInternationalRatesCtrl', ['$scope', '$http', function ($scope, $http) {
    
    $http.get('/api/marketing/mobileInternationalRates').success(function (data, status, headers, config) { 
        $scope.internationalRates = data;
    });
    
}]);