/* 
	Authentication - Login Controller
 */
ngApp.controller('AuthLoginCtrl', ['$scope', '$rootScope', '$http', '$window', '$sce', function ($scope, $rootScope, $http, $window, $sce) {
	// create a blank object to hold the form information
	$scope.formData = {};

	// process the form
	$scope.login = function() {
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
					// if not successful, bind errors to error variables
					$scope.loginError = $sce.trustAsHtml(data.validations[0].text);

				} else {
					// if successful, send the user to the return URL
					$window.location.href = data.returnURI;
				}
			});
	};

}]);