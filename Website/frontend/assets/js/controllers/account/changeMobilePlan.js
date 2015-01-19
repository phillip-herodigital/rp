ngApp.controller('ChangeMobilePlanCtrl', ['$scope', '$filter', '$http', 'scrollService', function ($scope, $filter, $http, scrollService) {
    $scope.activeStep = 1;
    $scope.hideComponent = true;

    $scope.formFields = {
        chosenPlan: null,
        agreeToTerms: false
    };

    $scope.setActiveStep = function(step) {
        $scope.activeStep = step;
    };

    $scope.cancelUpgrade = function() {
        $scope.activeStep = 1;
        scrollService.scrollTo('configureData', 0, 0, angular.noop);
    };

    $scope.$watch('selectedAccount.accountNumber', function (newVal) {
        if (newVal) {
            $scope.selectedAcct = newVal;

            $scope.hideComponent = false;

            $http({
                method: 'POST',
                url: '/api/account/mobileGetPlanOptions',
                data: { 'accountNumber': $scope.selectedAcct },
                headers: { 'Content-Type': 'application/JSON' }
            })
		    .success(function (data, status, headers, config) {
		        $scope.effectiveDate = data.effectiveDate;
		        dataPlans = data.dataPlans;
		        $scope.currentPlan = _.find(dataPlans, { 'id': data.currentPlanId });
		        $scope.isLoading = false;
		    });
        }
    });

    var dataPlans = null;
    $scope.init = function () {
        $scope.isLoading = true;
        $scope.selectedAcct = null;
    };

    $scope.getDataPlans = function () {
        return dataPlans;
    };

    $scope.selectPlan = function (plan) {
        $scope.formFields.chosenPlan = plan;
        $scope.activeStep = 2;
    };

    $scope.confirmChange = function () {
        if ($scope.formFields.agreeToTerms) {
            $scope.isLoading = true;

            $http({
                method: 'POST',
                url: '/api/account/changeMobilePlan',
                data: {
                    'accountNumber': $scope.selectedAcct,
                    'oldPlanId': $scope.currentPlan.id,
                    'newPlanId': $scope.formFields.chosenPlan.id,
                    'newChildPlanId': $scope.formFields.chosenPlan.childOfferId
                },
                headers: { 'Content-Type': 'application/JSON' }
            })
		    .success(function (data, status, headers, config) {
		        if (data.success)
		        {
                    $scope.activeStep = 3;
		            $scope.currentPlan = $scope.formFields.chosenPlan;
		            $scope.isLoading = false;
		        }
		    });
        }
    };

    $scope.init();
}]);