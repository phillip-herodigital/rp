ngApp.controller('MobileEnrollmentProgressBarCtrl', ['$scope', '$filter', '$modal', '$http', '$sce', 'enrollmentService', 'mobileEnrollmentService', 'enrollmentStepsService', 'enrollmentCartService', 'scrollService', 'analytics', function ($scope, $filter, $modal, $http, $sce, enrollmentService, mobileEnrollmentService, enrollmentStepsService, enrollmentCartService, scrollService, analytics) {
    $scope.referral = {
        'Name': "John Smith",
        'JobTitle': "Some Job"
    }
    $scope.mobileEnrollmentService = mobileEnrollmentService;
    $scope.mobileEnrollmentService.cartItemCountText = '';
    $scope.enrollmentCartService = enrollmentCartService;
    $scope.showModal = function (templateUrl) {
        $modal.open({
            'scope': $scope,
            'templateUrl': templateUrl
        })
    };

    $scope.openCartOverlay = function () {
        $scope.enrollmentCartService.cartOverlayOpenFromProgressBar = true;
        enrollmentCartService.toggleCart()
    }
}]);