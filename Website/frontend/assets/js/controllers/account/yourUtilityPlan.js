/* Your Gas Plan Controller
 *
 */
ngApp.controller('AcctYourUtilityPlanCtrl', ['$scope', '$rootScope', '$http', '$window', '$location', function ($scope, $rootScope, $http, $window, $location) {
    $scope.utilityPlan = {};
    $scope.isLoading = true;
    $scope.renewalRedirect = ($location.absUrl().toLowerCase().indexOf('renew') > 0);

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
                $scope.accountId = data.accountId;
                $scope.utilityPlan = data.subAccounts[0];
                $scope.utilityPlans = data.subAccounts;
                $scope.renewal = data.hasRenewalEligibiltiy;
                // get the plan description from sitecore if it exists
                var product = _.find($scope.georgiaProducts, { 'code': $scope.utilityPlan.productCode });
                $scope.utilityPlan.description = (product) ? product.description : null;
                
                $scope.isLoading = false;
            });
        }
    });

    $scope.isEligible = function(utilityPlanId) {
        var subAccount = _.find($scope.utilityPlans, { 'id': utilityPlanId });
        return _.find(subAccount.capabilities, { 'capabilityType': 'Renewal' }).isEligible;
    };

    $scope.setupRenewal = function(utilityPlanId) {
        $scope.isLoading = true;
        var accountData = {
            accountId: $scope.accountId,
            subAccountId: utilityPlanId
        };
        $http.post('/api/account/setupRenewal', accountData)
        .success(function (data) {
            if (data.isSuccess) {
                $window.location = '/enrollment?renewal=true';
            } else {
                // the account is no longer eligible, or something else went wrong
                $scope.isLoading = false;
            }
        })
    };

}]);