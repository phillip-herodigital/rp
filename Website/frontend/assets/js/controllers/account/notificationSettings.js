/* Notification Settings Controller
 *
 */
ngApp.controller('AcctNotificationSettingsCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$window', '$sce', function ($scope, $rootScope, $http, $timeout, $window, $sce) {
	// create a blank object to hold the form information
	$scope.formData = {};

	// when the account selector changes, reload the data
	$scope.$watch('selectedAccount.accountNumber', function(newVal) { 
		if (newVal) {
			$scope.isLoading = true;
			$timeout(function () {
				$http({
					method  : 'POST',
					url     : '/api/account/getNotificationSettings',
					data    : { 'accountNumber' : newVal },
					headers : { 'Content-Type': 'application/JSON' } 
				})
					.success(function (data, status, headers, config) {
						$scope.formData = data;
						$scope.formDataOriginal = angular.copy($scope.formData);
						$scope.successMessage = false;
						$scope.preferenceSuccessMessage = false;
						$scope.isLoading = false;
					});
			}, 800);
		}
	});

	// cancel the current preference changes
	$scope.cancelPreference = function(currentObject, originalObject) {
		// revert the changes
		angular.copy(originalObject, currentObject);
	};

	// update a single notification preference
	$scope.updateNotification = function(settingName, notificationObject, originalObject) {
		// format the request data
		var requestData = {};
		
		requestData.accountNumber = $scope.selectedAccount.accountNumber;
		requestData.settingName = settingName;
		requestData.notificationSetting = notificationObject;

		// clear any existing messages
		$scope.successMessage = false;
		$scope.preferenceSuccessMessage = false;

		$scope.isLoading = true;

		$timeout(function() {
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
						// if successful, close the panel, update the icons, and display the success message
						angular.copy(notificationObject, originalObject);
						$scope.isLoading = false;
						$scope.preferenceSuccessMessage = true;
					}
				});
		}, 800);
	};

	// process the full form
	$scope.updateNotificationSettings = function() {
		// clear any existing messages
		$scope.successMessage = false;
		$scope.preferenceSuccessMessage = false;

		$scope.isLoading = true;

		$timeout(function() {
			$http({
				method  : 'POST',
				url     : '/api/account/updateNotificationSettings',
				data    : $scope.formData,
				headers : { 'Content-Type': 'application/JSON' } 
			})
				.success(function (data, status, headers, config) {
					if (!data.success) {
						// if not successful, bind errors to error variables
						
					} else {
						// if successful, update the icons
						angular.copy($scope.formData.newDocumentArrives, $scope.formDataOriginal.newDocumentArrives);
						angular.copy($scope.formData.onlinePaymentsMade, $scope.formDataOriginal.onlinePaymentsMade);
						angular.copy($scope.formData.recurringPaymentsMade, $scope.formDataOriginal.recurringPaymentsMade);
						angular.copy($scope.formData.recurringProfileExpires, $scope.formDataOriginal.recurringProfileExpires);
						// display the success message
						$scope.isLoading = false;
						$scope.successMessage = true;
					}
				});
		}, 800);
	};

}]);