/* Notification Settings Controller
 *
 */
ngApp.controller('AcctNotificationSettingsCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$window', '$sce', function ($scope, $rootScope, $http, $timeout, $window, $sce) {
	// create a blank object to hold the form information
	$scope.formData = {};

	// set the account ID - this will eventually get passed in
	$scope.accountId = { 'accountId' : '11111' };

	// get the current data
	$timeout(function() {
		$http({
			method  : 'POST',
			url     : '/api/account/getNotificationSettings',
			data    : $scope.accountId,
			headers : { 'Content-Type': 'application/JSON' } 
		})
			.success(function (data, status, headers, config) {
				$scope.formData = data;
				$scope.formDataOriginal = angular.copy($scope.formData);
			});
	}, 1000);

	// cancel the current preference changes
	$scope.cancelPreference = function() {
		$scope.formData.accountId = $scope.accountId;

		$http({
			method  : 'POST',
			url     : '/api/account/updateNotificationSettins',
			data    : $scope.formData,
			headers : { 'Content-Type': 'application/JSON' } 
		})
			.success(function (data, status, headers, config) {
				if (!data.success) {
					// if not successful, bind errors to error variables
					$scope.loginError = $sce.trustAsHtml(data.validations[0].text);

				} else {
					// if successful, display the success message
					$window.location.href = '/account';
				}
			});
	};

	// update a single notification preference
	$scope.updateNotification = function(notificationName) {
		// format the request data
		var requestData = {};
		requestData.accountId = $scope.accountId;
		requestData.notificationName = notificationName;

		$http({
			method  : 'POST',
			url     : '/api/account/updateNotification',
			data    : requestData,
			headers : { 'Content-Type': 'application/JSON' } 
		})
			.success(function (data, status, headers, config) {
				if (!data.success) {
					// if not successful, bind errors to error variables

				} else {
					// if successful, close the panel and update the icons
					
				}
			});
	};

	// process the full form
	$scope.updateNotificationSettins = function() {
		$scope.formData.accountId = $scope.accountId;

		$http({
			method  : 'POST',
			url     : '/api/account/updateNotificationSettings',
			data    : $scope.formData,
			headers : { 'Content-Type': 'application/JSON' } 
		})
			.success(function (data, status, headers, config) {
				if (!data.success) {
					// if not successful, bind errors to error variables
					$scope.loginError = $sce.trustAsHtml(data.validations[0].text);

				} else {
					// if successful, display the success message
					$window.location.href = '/account';
				}
			});
	};

}]);