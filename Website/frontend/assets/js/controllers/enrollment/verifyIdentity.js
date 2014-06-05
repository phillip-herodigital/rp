﻿/* Enrollment Verify Identity Controller
 *
 * This is used to control aspects of verify identity on enrollment page.
 */
ngApp.controller('EnrollmentVerifyIdentityCtrl', ['$scope', '$rootScope', 'enrollmentService', function ($scope, $rootScope, enrollmentService) {

    /**
    * Complete Enrollment Section
    */
    $scope.completeStep = function () {
        console.log('Sending verify identity...');

        var verifyIdentityPromise = enrollmentService.setVerifyIdentity();

        verifyIdentityPromise.then(function (data) {
            $scope.enrollment.serverData = data;

            $scope.activateSections('completeOrder');
        }, function (data) {
            // error response
            $rootScope.$broadcast('connectionFailure');
        });
    };

}]);