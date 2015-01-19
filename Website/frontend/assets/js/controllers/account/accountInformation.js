/* Account Information Controller
 *
 */
ngApp.controller('AcctAccountInformationCtrl', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
	// create a blank object to hold the form information
	$scope.formData = {};

	// when the account selector changes, reload the data
	$scope.$watch('selectedAccount.accountNumber', function(newVal) { 
		if (newVal) {
			$scope.isLoading = true;
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
		}
	});

	// process the form
	$scope.updateAccountInformation = function() {
		// format the request data
	    var requestData = {};

	    $scope.successMessage = $scope.errorMessage = false;
		
		requestData.accountNumber = $scope.selectedAccount.accountNumber;
		requestData.mobilePhone = $scope.formData.mobilePhone;
		requestData.email = $scope.formData.email;

		if ($scope.formData.homePhone.number && $scope.formData.homePhone.number != '') {
			requestData.homePhone = $scope.formData.homePhone;
		}

		if ($scope.formData.sameAsService) {
			requestData.billingAddress = $scope.formData.serviceAddress;
		} else {
			requestData.billingAddress = $scope.formData.billingAddress;
		}
		requestData.disablePrintedInvoices = $scope.formData.disablePrintedInvoices;

		$scope.isLoading = true;

		// sent the update
		$http({
			method  : 'POST',
			url     : '/api/account/updateAccountInformation',
			data    : requestData,
			headers : { 'Content-Type': 'application/JSON' } 
		})
			.success(function (data, status, headers, config) {
			    $scope.isLoading = false;
				if (data.validations.length) {
					// if not successful, bind errors to error variables
					$scope.validations = data.validations;

				} else if (!data.success) {
				    $scope.errorMessage = true;
				} else {
				    // if successful, show the success message
				    $scope.formDataOriginal = angular.copy($scope.formData);
				    $scope.successMessage = true;
				}
			});
	};

}]);