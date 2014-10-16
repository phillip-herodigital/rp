/* 
	Authentication - Login Controller
 */
ngApp.controller('AuthLoginCtrl', ['$scope', '$rootScope', '$http', '$window', '$sce', '$location', function ($scope, $rootScope, $http, $window, $sce, $location) {
	// create a blank object to hold the form information
	$scope.formData = {};
	$scope.isLoading = false;
	var url = $location.absUrl();
	if (url.indexOf('error=true') > 0) {
	    $scope.loginError = $sce.trustAsHtml("<strong>Error</strong><br>Invalid username or password. Please try again.")
	    var indexOfUsername = url.indexOf("username=");
	    if (indexOfUsername > 0){
	        $scope.formData.username = url.substring(indexOfUsername + 9);
	    }
	}
	// process the form
	$scope.login = function() {
		$scope.formData.rememberMe = !!$scope.formData.rememberMe;
		$scope.isLoading = true;
		// add the URL to the login submission object
		$scope.formData.uri = document.URL;
		$http({
			method  : 'POST',
			url     : '/api/authentication/login',
			data    : $scope.formData,
			headers : { 'Content-Type': 'application/JSON' } 
		})
			.success(function (data, status, headers, config) {
			    if (!data.success) {
			        $scope.isLoading = false;
					// if not successful, bind errors to error variables
					$scope.loginError = $sce.trustAsHtml(data.validations[0].text);

				} else {
					// if successful, send the user to the return URL
					$window.location.href = data.returnURI;
				}
			});
	};

}]);