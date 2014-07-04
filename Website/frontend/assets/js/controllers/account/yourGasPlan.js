/* Your Gas Plan Controller
 *
 */
ngApp.controller('AcctYourGasPlanCtrl', ['$scope', '$rootScope', '$http', '$timeout', function ($scope, $rootScope, $http, $timeout) {
	// create a blank object to hold the form information
	$scope.gasPlan = {};

	// when the account selector changes, reload the data
	$scope.$watch('selectedAccount.accountNumber', function(newVal) { 
		if (newVal) {
			$timeout(function () {
				$http({
					method  : 'POST',
					url     : '/api/account/getGasPlan',
					data    : { 'accountNumber' : newVal },
					headers : { 'Content-Type': 'application/JSON' } 
				})
					.success(function (data, status, headers, config) {
						$scope.gasPlan = (data.gasPlan) ? data.gasPlan : {};
					});
			}, 800);
		}
	});

}]);