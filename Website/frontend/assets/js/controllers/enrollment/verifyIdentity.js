/* Enrollment Verify Identity Controller
 *
 * This is used to control aspects of verify identity on enrollment page.
 */
ngApp.controller('EnrollmentVerifyIdentityCtrl', ['$scope', 'enrollmentService', 'enrollmentStepsService', 'validation', function ($scope, enrollmentService, enrollmentStepsService, validation) {
    $scope.selectedIdentityAnswers = {};

    $scope.getIdentityQuestions = function() {
        return enrollmentService.identityQuestions;
    }

    /**
    * Complete Enrollment Section
    */
    $scope.completeStep = function () {
        // call account information, in case a plan got deleted
        // Adam B. - We can't call setAccountInformation at this point; it reloads credit and KIQ questions
        //var accountInformation = enrollmentService.setAccountInformation();
        if ($scope.idQuestions.$valid) {
            var verifyIdentityPromise = enrollmentService.setVerifyIdentity($scope.selectedIdentityAnswers);

            verifyIdentityPromise.then(function (data) {
                $scope.selectedIdentityAnswers = {};
            }, function (data) {
                // error response
            });
        } else {
            validation.showValidationSummary = true; 
            validation.cancelSuppress($scope);
        }
        
    };

}]);