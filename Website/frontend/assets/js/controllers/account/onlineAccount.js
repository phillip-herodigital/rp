/* My Online Account Controller
 *
 */
ngApp.controller('AcctOnlineAccountCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$window', '$sce', function ($scope, $rootScope, $http, $timeout, $window, $sce) {
	// create a blank object to hold the form information
	$scope.formData = {};

	// initialize the challenges
	$scope.formData.challenges = [{},{}];

	$scope.isLoading = true;

	// get the current data
	$http.get('/api/account/getOnlineAccount').success(function (data, status, headers, config) {
		while (data.challenges.length < 2) {
			data.challenges.push({});
		}
		$scope.formData = data;
		$scope.formDataOriginal = angular.copy($scope.formData);
		$scope.languagePreference = data.languagePreference;
		$scope.isLoading = false;
		$scope.selectedIds = [$scope.formData.challenges[0].selectedQuestion.id, $scope.formData.challenges[1].selectedQuestion.id];
	});

	// create a filter so that the same security question can't be selected twice
	$scope.filter1 = function(item){
		return (!($scope.formData.challenges.length > 0 && $scope.formData.challenges[0].selectedQuestion && $scope.formData.challenges[0].selectedQuestion.id) || item.id != $scope.formData.challenges[0].selectedQuestion.id);
	};

	$scope.filter2 = function(item){
		return (!($scope.formData.challenges.length > 1 && $scope.formData.challenges[1].selectedQuestion && $scope.formData.challenges[1].selectedQuestion.id) || item.id != $scope.formData.challenges[1].selectedQuestion.id);
	};

	// hack to fix IE so the filters work when the select options are changed
	$scope.fixIE = function(){
		$scope.selectedIds = [$scope.formData.challenges[0].selectedQuestion.id, $scope.formData.challenges[1].selectedQuestion.id];
		$timeout(function () {
			angular.forEach($('select'), function (currSelect) {
				currSelect.options[currSelect.selectedIndex].text += " ";
			});
		});
	};

	// process the form
	$scope.updateOnlineAccount = function() {
		$scope.isLoading = true;
		$scope.successMessage = false;

		// format the request data
		var requestData = {};
		requestData.challenges = $scope.formData.challenges;

		if ($scope.formData.username && $scope.formData.username != '') {
			requestData.username = $scope.formData.username;
		}
		requestData.email = $scope.formData.email;
		if ($scope.formData.currentPassword) {
			requestData.currentPassword = $scope.formData.currentPassword;
			requestData.password = $scope.formData.password;
			requestData.confirmPassword = $scope.formData.confirmPassword;
		}

		requestData.languagePreference = $scope.formData.languagePreference;

		// sent the update
		$timeout(function () {
			$http({
				method  : 'POST',
				url     : '/api/account/updateOnlineAccount',
				data    : requestData,
				headers : { 'Content-Type': 'application/JSON' } 
			})
				.success(function (data, status, headers, config) {
					if (data.validations) {
						// if not successful, bind errors to error variables
						$scope.isLoading = false;
						$scope.validations = data.validations;

					} else {
						// if successful, alert the user
						$scope.validations = [];
						$scope.isLoading = false;
						$scope.successMessage = true;
					}
				});
		}, 800);		
	};
	
}]);