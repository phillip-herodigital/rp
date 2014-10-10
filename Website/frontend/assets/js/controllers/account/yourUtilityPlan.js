/* Your Gas Plan Controller
 *
 */
ngApp.controller('AcctYourUtilityPlanCtrl', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
	// create a blank object to hold the form information
	$scope.utilityPlan = {};

	// when the account selector changes, reload the data
	$scope.$watch('selectedAccount.accountNumber', function(newVal) { 
		if (newVal) {
			$http({
				method  : 'POST',
				url     : '/api/account/getUtilityPlan',
				data    : { 'accountNumber' : newVal },
				headers : { 'Content-Type': 'application/JSON' } 
			})
				.success(function (data, status, headers, config) {
					$scope.utilityPlan = data.utilityPlan;
				});
		}
	});

}]);