/* Account Information Controller
 *
 */
ngApp.controller('AcctAccountInformationCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$window', '$sce', function ($scope, $rootScope, $http, $timeout, $window, $sce) {
	// create a blank object to hold the form information
	$scope.formData = {};

	// when the account selector changes, reload the data
	$scope.$watch('selectedAccount.accountNumber', function(newVal) { 
		if (newVal) {
			$scope.isLoading = true;
			$timeout(function () {
				$http({
					method  : 'POST',
					url     : '/api/account/getAccountInformation',
					data    : { 'accountNumber' : newVal },
					headers : { 'Content-Type': 'application/JSON' } 
				})
					.success(function (data, status, headers, config) {
						$scope.formData = data;
						$scope.formDataOriginal = angular.copy($scope.formData);
						$scope.successMessage = false;
						$scope.isLoading = false;
					});
			}, 800);
		}
	});

	// process the form
	$scope.updateAccountInformation = function() {
		// format the request data
		var requestData = {};
		
		requestData.accountNumber = $scope.selectedAccount.accountNumber;
		requestData.primaryPhone = $scope.formData.primaryPhone

		if ($scope.formData.secondaryPhone && $scope.formData.secondaryPhone != '') {
			requestData.secondaryPhone = $scope.formData.secondaryPhone;
		}

		if ($scope.formData.sameAsService) {
			requestData.billingAddress = $scope.formData.serviceAddress;
		} else {
			requestData.billingAddress = $scope.formData.billingAddress;
		}

		$scope.isLoading = true;

		// sent the update
		$timeout(function() {
			$http({
				method  : 'POST',
				url     : '/api/account/updateAccountInformation',
				data    : requestData,
				headers : { 'Content-Type': 'application/JSON' } 
			})
				.success(function (data, status, headers, config) {
					if (data.validations.length) {
				        // if not successful, bind errors to error variables
				        $scope.isLoading = false;
				        $scope.validations = data.validations;

					} else {
						// if successful, show the success message
						$scope.isLoading = false;
						$scope.successMessage = true;
					}
				});
		}, 800);
	};

}]);