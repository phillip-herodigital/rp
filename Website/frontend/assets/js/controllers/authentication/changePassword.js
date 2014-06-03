/* 
	Authentication - Change Passwrd Controller
 */
ngApp.controller('AuthChangePasswordCtrl', ['$scope', '$rootScope', '$window', function ($scope, $rootScope, $window) {
	$scope.changePassword = function() {
		$window.location.href = '/auth/recover-username';
	};
}]);