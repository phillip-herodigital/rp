/* Add New Account Controller
 *
 */
ngApp.controller('AcctAddNewAccountCtrl', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
	// create a blank object to hold the form information
	$scope.formData = {};

	// process the form
	$scope.addNewAccount = function() {
		// sent the update
		$http({
			method  : 'POST',
			url     : '/api/account/addNewAccount',
			data    : $scope.formData,
			headers : { 'Content-Type': 'application/JSON' } 
		})
			.success(function (data, status, headers, config) {
				if (data.validations.length) {
			        // if not successful, bind errors to error variables
			        $scope.validations = data.validations;

				} else {
					// if successful, clear the fields 
					$scope.formData = {};
					//$svc.enableSuppress();
					//$scope.addAccountForm.$setValidity('AccountNumber', true);
				}
			});
	};

}]);