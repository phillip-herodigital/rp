/* Add New Account Controller
 *
 */
ngApp.controller('AcctAddNewAccountCtrl', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
	// create a blank object to hold the form information
	$scope.formData = {};

	// process the form
	$scope.addNewAccount = function() {
		$scope.isLoading = true;
		$scope.successMessage = false;

		// sent the update
		$http({
			method  : 'POST',
			url     : '/api/account/addNewAccount',
			data    : $scope.formData,
			headers : { 'Content-Type': 'application/JSON' } 
		})
			.success(function (data, status, headers, config) {
				if (!data.success) {
					// if not successful, bind errors to error variables
					$scope.validations = data.validations;
					$scope.isLoading = false;
					$scope.errorMessage = true;

				} else {
					// if successful, clear the fields 
					$scope.formData = {};
					$scope.isLoading = false;
					$scope.errorMessage = false;
					$scope.successMessage = true;
					$scope.newAccountAdded.added = true;
				}
			});
	};

}]);