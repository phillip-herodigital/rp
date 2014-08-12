/* My Payments Controller
 *
 */
ngApp.controller('AcctPaymentAccountsListingCtrl', ['$scope', '$http', function ($scope, $http) {
	// create  blank objects to hold the information
	$scope.paymentAccounts = [];
	$scope.isLoading = true;

	$http.get('/api/account/getSavedPaymentMethods').success(function (data, status, headers, config) {
        $scope.paymentAccounts = data;
        $scope.isLoading = false;
	});
}]);