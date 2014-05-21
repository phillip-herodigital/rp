/* Enrollment Complete Order Controller
 *
 * This is used to control aspects of complete order on enrollment page.
 */
ngApp.controller('EnrollmentCompleteOrderCtrl', ['$scope', '$rootScope', 'enrollmentService', function ($scope, $rootScope, enrollmentService) {

    $scope.serverData.completeOrder = {};

    //Complete enrollment section
    $scope.completeStep = function () {
    };

}]);