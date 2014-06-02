/* 
	Authentication - Forgot Username Controller
 */
ngApp.controller('AuthForgotUsernameCtrl', ['$scope', '$rootScope', '$window', function ($scope, $rootScope, $window) {
	$scope.activeState = 'step1';

	$scope.sendUsername = function() {
		$scope.activeState = 'confirm';
	};

	$scope.confirmReturn = function() {
		$scope.activeState = 'error';
	}

	$scope.errorReturn = function() {
		$window.location.href = '/auth/login';
	};
}]);