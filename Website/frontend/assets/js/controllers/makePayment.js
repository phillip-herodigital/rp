/* Make a Payment Controller
 *
 */
ngApp.controller('MakePaymentCtrl', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {

    // Disable weekends selection
    $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    // Disable past date selection
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
        showWeeks: false,
        maxMode: 'month'
    };

    $scope.format = 'MM/dd/yyyy';

}]);