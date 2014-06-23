/* My Online Account Controller
 *
 */
ngApp.controller('AcctOnlineAccountCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$window', '$sce', function ($scope, $rootScope, $http, $timeout, $window, $sce) {
	// create a blank object to hold the form information
	$scope.formData = {};

	// initialize the challenges
	$scope.formData.challenges = [{},{}];

	// get the current data
	$timeout(function() {
		$http.get('/api/account/getOnlineAccount').success(function (data, status, headers, config) {
			$scope.formData = data;
			$scope.formDataOriginal = angular.copy($scope.formData);
			$scope.languagePreference = data.languagePreference;
		});
	});

	// create a filter so that the same security question can't be selected twice
	$scope.filter1 = function(item){
	  return (!($scope.formData.challenges[0].selectedQuestion && $scope.formData.challenges[0].selectedQuestion.id)||item.id != $scope.formData.challenges[0].selectedQuestion.id);
	};

	$scope.filter2 = function(item){
	  return (!($scope.formData.challenges[1].selectedQuestion && $scope.formData.challenges[1].selectedQuestion.id)||item.id != $scope.formData.challenges[1].selectedQuestion.id);
	};

	// process the form
	$scope.updateOnlineAccount = function() {
		// format the request data
		var requestData = {};
		var challenge = {};
		requestData.challenges = [];

		if ($scope.formData.username && $scope.formData.username != '') {
			requestData.username = $scope.formData.username;
		}
		requestData.email = $scope.formData.email;
		if ($scope.formData.currentPassword) {
			requestData.currentPassword = $scope.formData.currentPassword;
			requestData.password = $scope.formData.password;
			requestData.confirmPassword = $scope.formData.confirmPassword;
		}
		if ($scope.formData.challenges[0].answer) {
			challenge.selectedQuestion = $scope.formData.challenges[0].selectedQuestion;
			challenge.answer = $scope.formData.challenges[0].answer;
			requestData.challenges.push(challenge);
		}
		if ($scope.formData.challenges[1].answer) {
			challenge.selectedQuestion = $scope.formData.challenges[1].selectedQuestion;
			challenge.answer = $scope.formData.challenges[1].answer;
			requestData.challenges.push(challenge);
		}
		requestData.languagePreference = $scope.formData.languagePreference;

		// sent the update
		$http({
			method  : 'POST',
			url     : '/api/account/updateOnlineAccount',
			data    : requestData,
			headers : { 'Content-Type': 'application/JSON' } 
		})
			.success(function (data, status, headers, config) {
				if (data.validations.length) {
			        // if not successful, bind errors to error variables
			        $scope.validations = data.validations;

				} else {
					// if successful, alert the user
					alert("successful");
				}
			});
	};

}]);