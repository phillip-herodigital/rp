ngApp.controller('ChangeMobilePlanCtrl', ['$scope', '$filter', '$http', function ($scope, $filter, $http) {
    $scope.activeStep = 1;

    $scope.formFields = {
        chosenPlan: null,
        agreeToTerms: false
    };

    $scope.setActiveStep = function(step) {
        $scope.activeStep = step;
    }

    $scope.$watch('selectedAccount.accountNumber', function (newVal) {
        if (newVal) {
            $scope.selectedAcct = newVal;

            $http({
                method: 'POST',
                url: '/api/account/mobileGetPlanOptions',
                data: { 'accountNumber': $scope.selectedAcct },
                headers: { 'Content-Type': 'application/JSON' }
            })
		    .success(function (data, status, headers, config) {
		        $scope.effectiveDate = data.effectiveDate;
		        dataPlans = data.dataPlans;
		        $scope.currentPlan = dataPlans[0];
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

            //make service call...
            $scope.activeStep = 3;
            $scope.currentPlan = $scope.formFields.chosenPlan;
            $scope.isLoading = false;
        }
    };

    $scope.init();
}]);