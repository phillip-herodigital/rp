/* Account Selector Controller
 *
 */
ngApp.controller('AcctAccountSelectorCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$window', '$sce', function ($scope, $rootScope, $http, $timeout, $window, $sce) {
	// create a blank object to hold the form information
	$scope.formData = {};

	// get the current data
	$timeout(function() {
		$http.get('/api/account/getAccounts').success(function (data, status, headers, config) {
			$scope.formData = data;
			$scope.formDataOriginal = angular.copy($scope.formData);
		});
	});

}]);