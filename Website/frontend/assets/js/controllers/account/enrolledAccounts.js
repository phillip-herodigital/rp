/* Enrolled Accounts Controller
 *
 */
ngApp.controller('AcctEnrolledAccountsCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$window', '$sce', function ($scope, $rootScope, $http, $timeout, $window, $sce) {
	// create a blank object to hold the form information
	$scope.formData = {};

	// get the current data
	$timeout(function() {
		$http.get('/api/account/getEnrolledAccounts').success(function (data, status, headers, config) {
			$scope.formData = data;
			$scope.formDataOriginal = angular.copy($scope.formData);
		});
	});

	// remove an enrolled account
	$scope.removeEnrolledAccount = function(accountNumber) {
		// format the request data
		var requestData = {};
		requestData.accountNumber = accountNumber;

		// sent the post
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
					// if successful, alert the user
					alert("successful");
				}
			});
	};

	// send letter of residency
	$scope.sendLetter = function(accountNumber) {
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
					alert("successful");
				}
			});
	};

}]);