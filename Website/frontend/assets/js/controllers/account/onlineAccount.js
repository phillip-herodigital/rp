/* My Online Account Controller
 *
 */
ngApp.controller('AcctOnlineAccountCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$window', '$sce', function ($scope, $rootScope, $http, $timeout, $window, $sce) {
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

	// get the current data
	$timeout(function() {
		$http.get('/api/account/getOnlineAccount').success(function (data, status, headers, config) {
			$scope.formData = data;
			$scope.formDataOriginal = angular.copy($scope.formData);
			$scope.languagePreference = data.languagePreference;
		});
	}, 1000);

	// process the form
	$scope.updateOnlineAccount = function() {
		// add the original username to the form data
		$scope.formData.usernameOriginal = $scope.formDataOriginal.username;

		// sent the update
		$http({
			method  : 'POST',
			url     : '/api/account/updateOnlineAccount',
			data    : $scope.formData,
			headers : { 'Content-Type': 'application/JSON' } 
		})
			.success(function (data, status, headers, config) {
				if (!data.success) {
					// if not successful, bind errors to error variables
					$scope.loginError = $sce.trustAsHtml(data.validations[0].text);

				} else {
					// if successful, send the user to the /account page
					$window.location.href = '/account';
				}
			});
	};

}]);