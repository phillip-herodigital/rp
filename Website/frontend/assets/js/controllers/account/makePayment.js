/* Make a Payment Controller
 *
 */
ngApp.controller('MakePaymentCtrl', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {

    // Disable weekends selection
    $scope.disableWeekends = function (date, mode) {
        return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
    };
    $scope.minDate = new Date();
    
    $scope.activeState = 'step1';

    $scope.continue = function() {
        $scope.activeState = (($scope.activeState == 'step1') ? 'step2' : 'step3');
    };

    $scope.back = function() {
        $scope.activeState = 'step1';
    };

}]);