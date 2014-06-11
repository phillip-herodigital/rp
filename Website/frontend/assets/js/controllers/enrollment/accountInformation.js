/* Enrollment Account Information Controller
 *
 * This is used to control aspects of account information on enrollment page.
 */
ngApp.controller('EnrollmentAccountInformationCtrl', ['$scope', '$rootScope', '$filter', 'enrollmentService', function ($scope, $rootScope, $filter, enrollmentService) {
    /**
    * Initialize function
    */
    $scope.init = function () {
        /*$scope.enrollment.extraFields.accountInformation = {
            serviceAddresses: {},
            personalInformation: {},
            billingAddress: {},
            login: {}
        };

        angular.forEach($scope.enrollment.serverData.locationServices, function (item, id) {
            $scope.enrollment.extraFields.accountInformation.serviceAddresses[id] = {};

            angular.forEach($scope.enrollment.serverData.locationServices[id].selectedOffers, function(plan, type) {
                $scope.enrollment.extraFields.accountInformation.serviceAddresses[id][type] = {};
            });
        });*/
    };

    $scope.updateSameAddress = function() {
        console.log($scope.sizeOf($scope.enrollment.serverData.enrollmentLocations));
        if($scope.sizeOf($scope.enrollment.serverData.enrollmentLocations) == 1) {
            console.log($scope.enrollment.serverData.enrollmentLocations);
        }
    }

    $scope.updateBillingAddress = function() {
        console.log($scope.additionalInformation.billingAddress);
        angular.forEach($scope.enrollment.serverData.enrollmentLocations, function (item, id) {
            if($filter('address')(item.location.address) == $scope.additionalInformation.billingAddress) {
                angular.copy(item.location.address, $scope.enrollment.serverData.billingAddress);
            }
        });
    };

    /**
    * Complete Enrollment Section
    */
    $scope.completeStep = function () {
        console.log('Sending account information...');

        var confirmOrderPromise = enrollmentService.setConfirmOrder();

        confirmOrderPromise.then(function (data) {
            $scope.enrollment.serverData = data;

            $scope.activateSections('verifyIdentity');
        }, function (data) {
            // error response
            $rootScope.$broadcast('connectionFailure');
        });
    };

}]);