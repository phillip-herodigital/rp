/* 
	Authentication - Forgot Username Controller
 */
ngApp.controller('AuthForgotUsernameCtrl', ['$scope', '$rootScope', '$http', '$window', '$sce', function ($scope, $rootScope, $http, $window, $sce) {
	$scope.activeState = 'step1';
	$scope.isLoading = false;

	// create a blank object to hold the form information
	$scope.formData = {};

	// process the getUserChallengeQuestions form
	$scope.recoverUsername = function() {
		$scope.isLoading = true;
		$http({
			method  : 'POST',
			url     : '/api/authentication/recoverUsername',
			data    : $scope.formData,
			headers : { 'Content-Type': 'application/JSON' } 
		})
			.success(function (data, status, headers, config) {
				$scope.isLoading = false;
				if (data.validations.length) {
			        // if not successful, bind errors to error variables
			        $scope.validations = data.validations;

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