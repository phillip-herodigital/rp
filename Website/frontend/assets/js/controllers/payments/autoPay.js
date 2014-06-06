/* 
	Payments - Auto Pay Controller
 */
ngApp.controller('AutoPayCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
	//Currently set autoPay status to false, will eventually set according to the account
	$scope.autoPay = {
		status:'autoPayOn',
		dt: new Date()
	};
	$scope.autoPayOn = 'autoPayOn';
	$scope.autoPayOff = 'autoPayOff';
	$scope.minDate = new Date();

   // Disable weekend selection
    $scope.disableWeekends = function (date, mode) {
        return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
    };

}]);