/* Utility Providers Controller
 *
 */
ngApp.controller('AcctUtilityProvidersCtrl', ['$scope', '$rootScope', '$http', '$timeout', function ($scope, $rootScope, $http, $timeout) {
	// create a blank object to hold the information
	$scope.currentProviders = [];

	$scope.isLoading = true;

	$timeout(function() {
		$http.get('/api/account/getUtilityProviders').success(function (data, status, headers, config) {
			$scope.currentProviders = data.providers;
			$scope.isLoading = false;
		});
	}, 800);

	$scope.utilityFilter = function(item){
		return _.contains($scope.currentProviders, item.name);
	};

}]);