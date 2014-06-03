/* 
	Authentication - Create Account Controller
 */
ngApp.controller('AuthCreateAccountCtrl', ['$scope', '$rootScope', '$window', function ($scope, $rootScope, $window) {
	$scope.activeState = 'step1';

	$scope.continue = function() {
		$scope.activeState = 'step2';
	};

	$scope.createAccount = function() {
		$window.location.href = '/account';
	};
}]);