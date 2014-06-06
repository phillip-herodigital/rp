/* 
	Authentication - Reset Password Controller
 */
ngApp.controller('AuthResetPasswordCtrl', ['$scope', '$rootScope', '$http', '$window', '$sce', function ($scope, $rootScope, $http, $window, $sce) {
	$scope.activeState = 'step1';

	// create a blank object to hold the form information
	$scope.formData = {};

	// process the getUserChallengeQuestions form
	$scope.getUserChallengeQuestions = function() {
		$http({
			method  : 'POST',
			url     : '/api/authentication/getUserChallengeQuestions',
			data    : $scope.formData,
			headers : { 'Content-Type': 'application/JSON' } 
		})
			.success(function (data, status, headers, config) {
				if (!data.username) {
					// if not successful, bind errors to error variables
					$scope.getUserError = $sce.trustAsHtml(data.validations[0].text);

				} else {
					// if successful, bind the response data to the scope and send the user to step 2
					$scope.username = data.username;
					$scope.securityQuestions = data.securityQuestions;
					$scope.activeState = 'step2';
				}
			});
	};

	// process the sendResetPasswordEmail form
	$scope.sendResetPasswordEmail = function() {
		$http({
			method  : 'POST',
			url     : '/api/authentication/sendResetPasswordEmail',
			data    : $scope.formData,
			headers : { 'Content-Type': 'application/JSON' } 
		})
			.success(function (data, status, headers, config) {
				if (!data.success) {
					// if not successful, bind errors to error variables
					$scope.sendResetError = $sce.trustAsHtml(data.validations[0].text);

				} else {
					// if successful, send the user to confirm
					$scope.activeState = 'confirm';
				}
			});
	};

	$scope.return = function() {
		$window.location.href = '/auth/reset-password';
	};
	
}]);