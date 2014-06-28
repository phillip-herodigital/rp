/* Enrolled Accounts Controller
 *
 */
ngApp.controller('AcctEnrolledAccountsCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$modal', 'jQuery', function ($scope, $rootScope, $http, $timeout, $modal, jQuery) {
	// create a blank object to hold the form information
	$scope.formData = {};

	// get the current data

	$http.get('/api/account/getEnrolledAccounts').success(function (data, status, headers, config) {
		$scope.formData = data;
		$scope.formDataOriginal = angular.copy($scope.formData);
	});

	$scope.open = function (accountNumber) {
		$scope.currentAccount = accountNumber;

		var modalInstance = $modal.open({
			templateUrl: 'removeAccount.html',
			scope: $scope
		});	

		modalInstance.result.then( function() {
			removeEnrolledAccount(accountNumber);
		})
	};

	// remove an enrolled account
	var removeEnrolledAccount = function (accountNumber) {
		// format the request data
		var requestData = {};
		requestData.accountNumber = accountNumber;

		$http({
			method  : 'POST',
			url     : '/api/account/removeEnrolledAccount',
			data    : requestData,
			headers : { 'Content-Type': 'application/JSON' } 
		})
			.success(function (data, status, headers, config) {
				if (!data.success) {
					// if not successful, show an error

				} else {
					// if successful, remove the row
					var index = _.findIndex($scope.formData.enrolledAccounts, { 'accountNumber' : accountNumber });
					$scope.formData.enrolledAccounts.splice(index, 1);
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
					//alert("successful");
				}
			});
	};

}]);