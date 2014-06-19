/* Enrollment Verify Identity Controller
 *
 * This is used to control aspects of verify identity on enrollment page.
 */
ngApp.controller('EnrollmentVerifyIdentityCtrl', ['$scope', 'enrollmentService', 'enrollmentStepsService', 'verifyIdentityService', function ($scope, enrollmentService, enrollmentStepsService, verifyIdentityService) {
    $scope.selectedIdentityAnswers = {};

    $scope.getIdentityQuestions = function() {
        return verifyIdentityService.identityQuestions;
    }

    /**
    * Complete Enrollment Section
    */
    $scope.completeStep = function () {
        var data = verifyIdentityService.createPostObject($scope.selectedIdentityAnswers);
        var verifyIdentityPromise = enrollmentService.setVerifyIdentity(data);

        verifyIdentityPromise.then(function (data) {
            enrollmentStepsService.nextStep();
        }, function (data) {
            // error response
        });
    };

}]);