/* Make a Payment Controller
 *
 */
ngApp.controller('MakePaymentCtrl', ['$scope', function ($scope) {

    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };

    // Disable weekends selection
    $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 || date.getDay() < $scope.today ) );
    };

    // Disable past dates selection
    $scope.toggleMin = function() {
        $scope.minDate = new Date();
    };
    $scope.toggleMin();

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yyyy',
        startingDay: 0,
        showWeeks: false,
    };

    $scope.format = 'MM/dd/yyyy';

}]);