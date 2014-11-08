ngApp.controller('MobileEnrollmentOrderSummaryCtrl', ['$scope', '$filter', '$modal', 'mobileEnrollmentService', function ($scope, $filter, $modal, mobileEnrollmentService) {

    $scope.mobileEnrollmentService = mobileEnrollmentService;
    $scope.cart = $scope.mobileEnrollmentService.getCart();

}]);