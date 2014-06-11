/* Enrollment Verify Identity Controller
 *
 * This is used to control aspects of verify identity on enrollment page.
 */
ngApp.controller('EnrollmentVerifyIdentityCtrl', ['$scope', '$rootScope', 'enrollmentService', function ($scope, $rootScope, enrollmentService) {

    $scope.$watch('enrollment.serverData.identityQuestions', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            $scope.init();
        }
    });

    /**
    * Initialize function
    */
    $scope.init = function () {
        $scope.enrollment.extraFields.verifyIdentity = {};

        angular.forEach($scope.enrollment.serverData.identityQuestions, function (item) {
            $scope.enrollment.extraFields.verifyIdentity[item.questionId] = undefined;
        });
    };

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