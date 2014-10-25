ngApp.controller('MobileEnrollmentCartCtrl', ['$scope', '$filter', '$modal', 'mobileEnrollmentService', function ($scope, $filter, $modal, mobileEnrollmentService) {

    $scope.mobileEnrollmentService = mobileEnrollmentService;
    $scope.cart = $scope.mobileEnrollmentService.getCart();

    $scope.getTotalPlanData = function(plan) {
        if (plan.additionalData) {
            return parseInt(plan.baseData, 10) + parseInt(plan.additionalData, 10);
        } else {
            return parseInt(plan.baseData, 10);
        }
    }

    $scope.getCartCount = function() {
        return $scope.cart.items.length;
    }

}]);