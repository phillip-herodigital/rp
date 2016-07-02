/* Login Horizontal Controller
 *
 */
ngApp.controller('LoginCtrl', ['$scope', '$rootScope', '$http', '$window', function ($scope, $rootScope, $http, $window) {

	var TX_URL, GA_URL;
	$scope.init = function (TxUrl, GaUrl) {
		TX_URL = TxUrl;
		GA_URL = GaUrl;
	}

	$scope.form = {
        username: '',
        password: '',
        state: "TX"
	};

	$scope.loginClicked = function (state) {
	    $scope.form.uri = document.URL;
	    $http({
	        method: 'POST',
	        url: '/api/authentication/login',
	        data: $scope.form,
	        headers: { 'Content-Type': 'application/JSON' }
	    })
            .success(function (data, status, headers, config) {
                if (!data.success) {
                    $window.location.href = "/auth/login?error=true&username=" + $scope.form.username;
                } else {
                    // if successful, send the user to the return URL
                    $window.location.href = data.returnURI;
                }
            });
	}
}]);