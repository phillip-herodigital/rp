/* Your Gas Plan Controller
 *
 */
ngApp.controller('AcctYourUtilityPlanCtrl', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
    $scope.utilityPlan = {};
    $scope.isLoading = true;

    // when the account selector changes, reload the data
    $scope.$watch('selectedAccount.accountNumber', function(newVal) { 
        if (newVal) {
            $scope.isLoading = true;
            $http({
                method  : 'POST',
                url     : '/api/account/getUtilityPlan',
                data    : { 'accountNumber' : newVal },
                headers : { 'Content-Type': 'application/JSON' } 
            }).success(function (data, status, headers, config) {
                $scope.utilityPlan = data.subAccounts[0];
                
                // get the plan description from sitecore if it exists
                var product = _.find($scope.georgiaProducts, { 'code': $scope.utilityPlan.productCode });
                $scope.utilityPlan.description = (product) ? product.description : null;
                
                $scope.isLoading = false;
            });
        }
    });

}]);