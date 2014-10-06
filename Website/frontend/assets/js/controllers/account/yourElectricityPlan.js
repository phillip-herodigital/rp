/* Your Electricity Plan Controller
 *
 */
ngApp.controller('AcctYourElectricityPlanCtrl', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
	// create a blank object to hold the form information
	$scope.electricityPlan = {};

	// when the account selector changes, reload the data
	/*
	$scope.$watch('selectedAccount.accountNumber', function(newVal) { 
		if (newVal) {
			$http({
				method  : 'POST',
				url     : '/api/account/getElectricityPlan',
				data    : { 'accountNumber' : newVal },
				headers : { 'Content-Type': 'application/JSON' } 
			})
				.success(function (data, status, headers, config) {
					$scope.electricityPlan = (data.electricityPlan) ? data.electricityPlan : {};
				});
		}
	});
	*/

}]);