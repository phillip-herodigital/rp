ngApp.controller('MobileEnrollmentCartCtrl', ['$scope', '$filter', '$modal', 'mobileEnrollmentService', function ($scope, $filter, $modal, mobileEnrollmentService) {

    $scope.mobileEnrollmentService = mobileEnrollmentService;
    $scope.cart = $scope.mobileEnrollmentService.getCart();

    $scope.getCartCount = function() {
        return $scope.cart.items.length;
    }

}]);