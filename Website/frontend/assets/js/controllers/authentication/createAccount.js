/* 
	Authentication - Create Account Controller
 */
ngApp.controller('AuthCreateAccountCtrl', ['$scope', '$rootScope', '$http', '$window', '$sce', function ($scope, $rootScope, $http, $window, $sce) {
	$scope.activeState = 'step1';
	$scope.isLoading = false;
	$scope.noEmail = false;

	// create a blank object to hold the form information
	$scope.formData = {};

	// initialize the challenges
	$scope.formData.challenges = [{},{}];

	// create a filter so that the same security question can't be selected twice
	$scope.filter1 = function(item){
      return (!($scope.formData.challenges[0].selectedQuestion && $scope.formData.challenges[0].selectedQuestion.id)||item.id != $scope.formData.challenges[0].selectedQuestion.id);
    };

    $scope.filter2 = function(item){
      return (!($scope.formData.challenges[1].selectedQuestion && $scope.formData.challenges[1].selectedQuestion.id)||item.id != $scope.formData.challenges[1].selectedQuestion.id);
    };

	// process the findAccount form
	$scope.findAccount = function() {
		$scope.isLoading = true;
		$http({
			method  : 'POST',
			url     : '/api/authentication/findAccount',
			data    : $scope.formData,
			headers : { 'Content-Type': 'application/JSON' } 
		})
			.success(function (data, status, headers, config) {
				$scope.isLoading = false;
				$scope.noEmail = false;
			    $scope.validations = data.validations;
				if (!data.customer) {
					// if not successful, bind errors to error variables
					$scope.findAccountError = data.validations;
				} else {
					// if successful, bind the response data to the scope and send the user to step 2
					$scope.customer = data.customer;
					$scope.address = data.address;
					$scope.accountNumber = data.accountNumber;
					$scope.ssnLastFour = data.ssnLastFour;
					$scope.availableSecurityQuestions = data.availableSecurityQuestions;
					if (data.customer.email.address == '') {
						$scope.noEmail = true;
						$scope.activeState = 'step1a';
					} else {
						// initialize the username to the email address
						$scope.formData.username = $scope.customer.email.address || '';
						$scope.activeState = 'step2';
					}
				}
			});
	};

	// process the findAccount form
	$scope.updateEmail = function() {
		$scope.isLoading = true;
		$http({
			method  : 'POST',
			url     : '/api/authentication/updateEmail',
			data    : $scope.formData,
			headers : { 'Content-Type': 'application/JSON' } 
		})
			.success(function (data, status, headers, config) {
				$scope.isLoading = false;
				$scope.validations = data.validations;
				if (!data.success) {
					// if not successful, bind errors to error variables
					$scope.findAccountError = data.validations;
				} else {
					// initialize the username to the email address
					$scope.customer.email.address = $scope.formData.email.address;
					$scope.formData.username = $scope.customer.email.address;
					$scope.activeState = 'step2';
				}
			});
	};

	// process the createLogin form
	$scope.createLogin = function() {
		$scope.isLoading = true;
		$http({
			method  : 'POST',
			url     : '/api/authentication/createLogin',
			data    : $scope.formData,
			headers : { 'Content-Type': 'application/JSON' } 
		})
			.success(function (data, status, headers, config) {
			    if (!data.success) {
				    $scope.isLoading = false;
			        $scope.validations = data.validations;
					// if not successful, bind errors to error variables
					$scope.createLoginError = $sce.trustAsHtml(data.validations[0].text);

				} else {
					// if successful, send the user to the /account page
					$window.location.href = '/account';
				}
			});
	};

}]);