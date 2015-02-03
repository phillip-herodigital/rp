/* Enrollment Verify Identity Controller
 *
 * This is used to control aspects of verify identity on enrollment page.
 */
ngApp.controller('EnrollmentVerifyIdentityCtrl', ['$scope', 'enrollmentService', 'enrollmentStepsService', function ($scope, enrollmentService, enrollmentStepsService) {
    $scope.selectedIdentityAnswers = {};

    $scope.getIdentityQuestions = function() {
        return enrollmentService.identityQuestions;
    }

    /**
    * Complete Enrollment Section
    */
    $scope.completeStep = function () {
        // call account information, in case a plan got deleted
        var accountInformation = enrollmentService.setAccountInformation();
        var verifyIdentityPromise = enrollmentService.setVerifyIdentity($scope.selectedIdentityAnswers);

        verifyIdentityPromise.then(function (data) {
            $scope.selectedIdentityAnswers = {};
        }, function (data) {
            // error response
        });
    };

}]);