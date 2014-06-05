/* 
	Payments - Auto Pay Controller
 */
ngApp.controller('AutoPayCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
	//Currently set autoPay status to false, will eventually set according to the account
	$scope.autoPay = {
		status:'autoPayOff'
	};
	$scope.autoPayOn = 'autoPayOn';
	$scope.autoPayOff = 'autoPayOff';
}]);