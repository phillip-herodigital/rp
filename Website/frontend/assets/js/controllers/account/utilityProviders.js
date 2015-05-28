/* Utility Providers Controller
 *
 */
ngApp.controller('AcctUtilityProvidersCtrl', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
	// create a blank object to hold the information
	$scope.currentProviders = [];

	$scope.isLoading = true;
	$scope.streamConnectError = false;

	$http.get('/api/account/getUtilityProviders').success(function (data, status, headers, config) {
		$scope.currentProviders = data.providers;
		$scope.isLoading = false;
		$scope.streamConnectError = false;
	}).error(function() {
		$scope.isLoading = false;
        $scope.streamConnectError = true; 
	});

	$scope.utilityFilter = function(item){
		return _.contains($scope.currentProviders, item.name);
	};

}]);