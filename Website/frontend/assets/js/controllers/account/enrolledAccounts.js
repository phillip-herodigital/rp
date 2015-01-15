/* Enrolled Accounts Controller
 *
 */
ngApp.controller('AcctEnrolledAccountsCtrl', ['$scope', '$rootScope', '$http', '$modal', 'jQuery', function ($scope, $rootScope, $http, $modal, jQuery) {
	// create a blank object to hold the form information
	$scope.formData = {};

	$scope.isLoading = true;
	$scope.successMessage = false;
	$scope.failureMessage = false;

	// get the current data
	$http.get('/api/account/getEnrolledAccounts').success(function (data, status, headers, config) {
		$scope.formData = data;
		$scope.formDataOriginal = angular.copy($scope.formData);
		$scope.isLoading = false;
	});

	// when a new account is added, reload the data
	$scope.$watch('newAccountAdded.added', function(newVal) { 
		if (newVal) {
			$scope.isLoading = true;
			$http.get('/api/account/getEnrolledAccounts').success(function (data, status, headers, config) {
				$scope.formData = data;
				$scope.formDataOriginal = angular.copy($scope.formData);
				$scope.newAccountAdded.added = false;
				$scope.isLoading = false;
			});
		}
	});

	$scope.open = function (accountNumber, accountId) {
		$scope.currentAccount = accountNumber;

		var modalInstance = $modal.open({
			templateUrl: 'removeAccount.html',
			scope: $scope
		});	

		modalInstance.result.then( function() {
			removeEnrolledAccount(accountId);
		})
	};

	// remove an enrolled account
	var removeEnrolledAccount = function (accountId) {
		// format the request data
		var requestData = {};
		requestData.accountId = accountId;

		$http({
			method  : 'POST',
			url     : '/api/account/removeEnrolledAccount',
			data    : requestData,
			headers : { 'Content-Type': 'application/JSON' } 
		})
			.success(function (data, status, headers, config) {
				if (!data.success) {
					// if not successful, show an error
					$scope.failureMessage = true;
				} else {
					// if successful, refresh the list
					$scope.isLoading = true;
					$http.get('/api/account/getEnrolledAccounts').success(function (data, status, headers, config) {
						$scope.formData = data;
						$scope.formDataOriginal = angular.copy($scope.formData);
						$scope.newAccountAdded.added = false;
						$scope.isLoading = false;
						$scope.failureMessage = false;
					});
				}
			});
	};

	// send letter of residency
	$scope.sendLetter = function (accountNumber) {
		// format the request data
		var requestData = {};
		requestData.accountNumber = accountNumber;

		// sent the post
		$http({
			method  : 'POST',
			url     : '/api/account/sendLetter',
			data    : requestData,
			headers : { 'Content-Type': 'application/JSON' } 
		})
			.success(function (data, status, headers, config) {
				if (!data.success) {
					// if not successful, show an error

				} else {
					// if successful, alert the user
					$scope.successMessage = true;
				}
			});
	};

}]);