/* Add New Account Controller
 *
 */
ngApp.controller('AcctAddNewAccountCtrl', ['$scope', '$rootScope', '$http', '$timeout', function ($scope, $rootScope, $http, $timeout) {
	// create a blank object to hold the form information
	$scope.formData = {};

	// process the form
	$scope.addNewAccount = function() {
		$scope.isLoading = true;
		$scope.successMessage = false;

		// sent the update
		$timeout(function () {
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
						$scope.isLoading = false;
						$scope.successMessage = true;
					}
				});
		}, 800);
	};

}]);