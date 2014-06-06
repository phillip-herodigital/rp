/* 
	Authentication - Change Passwrd Controller
 */
ngApp.controller('AuthChangePasswordCtrl', ['$scope', '$rootScope', '$http', '$window', '$sce', function ($scope, $rootScope, $http, $window, $sce) {
	// create a blank object to hold the form information
	$scope.formData = {};

	// process the getUserChallengeQuestions form
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

}]);