/* 
	Authentication - Reset Password Controller
 */
ngApp.controller('AuthResetPasswordCtrl', ['$scope', '$rootScope', '$window', function ($scope, $rootScope, $window) {
	$scope.activeState = 'step1';

	$scope.stepOneContinue = function() {
		$scope.activeState = 'step2';
	};

	$scope.stepTwoContinue = function() {
		$scope.activeState = 'confirm';
	};

	$scope.return = function() {
		$window.location.href = '/auth/change-password';
	};
}]);