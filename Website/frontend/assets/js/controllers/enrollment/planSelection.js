/* Enrollment Plan Selection Controller
 *
 * This is used to control aspects of plan selection on enrollment page.
 */
ngApp.controller('EnrollmentPlanSelectionCtrl', ['$scope', '$rootScope', 'enrollmentService', 'scrollService', function ($scope, $rootScope, enrollmentService, scrollService) {
    /**
    * Scroll To Service Information
    */
    $scope.scrollToServiceInformation = function () {
        scrollService.scrollTo('serviceInformation', $scope.enrollment.headerHeightOffset);
    };

    /**
    * Complete Enrollment Section
    */
    $scope.completeStep = function () {
        console.log('Sending selected offers...');

        var selectedOffersPromise = enrollmentService.setSelectedOffers();

        selectedOffersPromise.then(function (data) {
            $scope.enrollment.serverData = data;

            $scope.activateSections('accountInformation');
        }, function (data) {
            // error response
            $rootScope.$broadcast('connectionFailure');
        });
    };

}]);