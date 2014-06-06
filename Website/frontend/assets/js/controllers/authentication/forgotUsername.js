/* 
	Authentication - Forgot Username Controller
 */
ngApp.controller('AuthForgotUsernameCtrl', ['$scope', '$rootScope', '$http', '$window', '$sce', function ($scope, $rootScope, $http, $window, $sce) {
	$scope.activeState = 'step1';

	// create a blank object to hold the form information
	$scope.formData = {};

	// process the getUserChallengeQuestions form
	$scope.recoverUsername = function() {
		$http({
			method  : 'POST',
			url     : '/api/authentication/recoverUsername',
			data    : $scope.formData,
			headers : { 'Content-Type': 'application/JSON' } 
		})
			.success(function (data, status, headers, config) {
				if (!data.success) {
					// if not successful, bind errors to error variables
					$scope.recoverUsernameError = $sce.trustAsHtml(data.validations[0].text);

				} else {
					// if successful, bind the response data to the scope and send the user to step 2
					$scope.email = data.email;
					$scope.activeState = 'confirm';
				}
			});
	};

	$scope.confirmReturn = function() {
		$scope.activeState = 'error';
	}

}]);