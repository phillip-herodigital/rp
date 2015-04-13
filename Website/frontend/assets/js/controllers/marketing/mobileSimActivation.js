/* Mobile SIM Activation Controller
 *
 */
ngApp.controller('MobileSimActivationCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
    $scope.selectedPhone = null;
    $scope.isLoading = false;
    $scope.activeState = 'step1';

    $scope.$watch("selectedPhone", function(newVal) { 
        if (newVal == 'gsm') {
            $scope.activeState = 'step2';
        } 
        if (newVal == 'cdma') {
            $scope.activeState = 'step2CDMA';
        }
    }); 

    $scope.cancelActivation = function () {
        $scope.selectedPhone = null;
        $scope.activeState = 'step1';
    };

    $scope.lookupAccount = function () {
        $scope.activeState = 'step3';
    };

    $scope.activateService = function () {
        $scope.activeState = 'step4';
    };

}]);