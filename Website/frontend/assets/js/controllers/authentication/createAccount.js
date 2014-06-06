/* 
	Authentication - Create Account Controller
 */
ngApp.controller('AuthCreateAccountCtrl', ['$scope', '$rootScope', '$http', '$window', '$sce', function ($scope, $rootScope, $http, $window, $sce) {
	$scope.activeState = 'step1';

	// create a blank object to hold the form information
	$scope.formData = {};

	// process the findAccount form
	$scope.findAccount = function() {
		$http({
			method  : 'POST',
			url     : '/api/authentication/findAccount',
			data    : $scope.formData,
			headers : { 'Content-Type': 'application/JSON' } 
		})
			.success(function (data, status, headers, config) {
				if (!data.customer) {
					// if not successful, bind errors to error variables
					$scope.findAccountError = $sce.trustAsHtml(data.validations[0].text);

				} else {
					// if successful, bind the response data to the scope and send the user to step 2
					$scope.customer = data.customer;
					$scope.address = data.address;
					$scope.accountNumber = data.accountNumber;
					$scope.ssnLastFour = data.ssnLastFour;
					$scope.availableSecurityQuestions = data.availableSecurityQuestions;
					$scope.activeState = 'step2';
				}
			});
	};

	// process the createLogin form
	$scope.createLogin = function() {
		$http({
			method  : 'POST',
			url     : '/api/authentication/createLogin',
			data    : $scope.formData,
			headers : { 'Content-Type': 'application/JSON' } 
		})
			.success(function (data, status, headers, config) {
				if (!data.success) {
					// if not successful, bind errors to error variables
					$scope.findAccountError = $sce.trustAsHtml(data.validations[0].text);

				} else {
					// if successful, send the user to the /account page
					$window.location.href = '/account';
				}
			});
	};

}]);