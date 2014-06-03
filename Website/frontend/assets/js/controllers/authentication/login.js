/* 
	Authentication - Login Controller
 */
ngApp.controller('AuthLoginCtrl', ['$scope', '$rootScope', '$window', function ($scope, $rootScope, $window) {
	$scope.signIn = function() {
		$window.location.href = '/account';
	};

	$scope.createAccount = function() {
		$window.location.href = '/auth/create-account';
	};
}]);