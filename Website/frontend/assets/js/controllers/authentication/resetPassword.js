/* 
	Authentication - Reset Password Controller
 */
ngApp.controller('AuthResetPasswordCtrl', ['$scope', '$rootScope', '$http', '$window', '$sce', function ($scope, $rootScope, $http, $window, $sce) {
	$scope.activeState = 'step1';

	// create a blank object to hold the form information
	$scope.formData = { answers: {}};

	// process the getUserChallengeQuestions form
	$scope.getUserChallengeQuestions = function() {
		$http({
			method  : 'POST',
			url     : '/api/authentication/getUserChallengeQuestions',
			data    : $scope.formData,
			headers : { 'Content-Type': 'application/JSON' } 
		})
			.success(function (data, status, headers, config) {
			    if (data.validations.length) {
			        // if not successful, bind errors to error variables
			        $scope.validations = data.validations;

				} else {
					// if successful, bind the response data to the scope and send the user to step 2
					$scope.username = data.username;
					$scope.securityQuestions = data.securityQuestions;
					$scope.activeState = 'step2';
                    
					console.log($scope);
				}
			});
	};

    // process the verifySecurityQuestions form
	$scope.verifySecurityQuestions = function () {
		$http({
			method  : 'POST',
			url     : '/api/authentication/VerifySecurityQuestions',
			data    : $scope.formData,
			headers : { 'Content-Type': 'application/JSON' } 
		})
			.success(function (data, status, headers, config) {
			    if (data.validations.length) {
					// if not successful, bind errors to error variables
				    $scope.validations = data.validations;

				} else {
					// if successful, send the user to confirm
			        $scope.activeState = data.success ? 'changepassword' : 'hard-stop-error';
				}
			});
	};

    // process the changePassword form
	$scope.changePassword = function() {
		$http({
			method  : 'POST',
			url     : '/api/authentication/changePassword',
			data    : $scope.formData,
			headers : { 'Content-Type': 'application/JSON' } 
		})
			.success(function (data, status, headers, config) {
				if (!data.success) {
					// if not successful, bind errors to error variables
					$scope.recoverUsernameError = $sce.trustAsHtml(data.validations[0].text);

				} else {
					// if successful, send the user to the login page
					$window.location.href = '/auth/login';

				}
			});
	};

	$scope.return = function() {
		$window.location.href = '/auth/login';
	};
	
}]);