/* Enrollment Account Information Controller
 *
 * This is used to control aspects of account information on enrollment page.
 */
ngApp.controller('EnrollmentAccountInformationCtrl', ['$scope', '$rootScope', '$filter', 'enrollmentService', 'utilityProductsService', 'accountInformationService', function ($scope, $rootScope, $filter, enrollmentService, utilityProductsService, accountInformationService) {
    $scope.validations = enrollmentService.validations;
    $scope.utilityProducts = utilityProductsService;
    $scope.usStates = enrollmentService.usStates;
    $scope.phoneTypes = enrollmentService.phoneTypes;

    $scope.accountInformation = accountInformationService.accountInformation;

    $scope.utilityAddresses = function() {
        //Keep a temporary array for the typeahead service addresses
        
        //Don't do this, digest loop error
        //$scope.accountInformation.serviceAddress = [];
        return utilityProductsService.getAddresses();
    }

    $scope.isFormValid = function() {
        return false;
    }

    /**
    * Complete Enrollment Section
    */
    $scope.completeStep = function () {
        var confirmOrderPromise = enrollmentService.setConfirmOrder();

        confirmOrderPromise.then(function (data) {
            $scope.validations = data.validations;
            
            //Update the utilityProviders
            //Upate the accountInformation service

            //$scope.enrollment.serverData = data;

            $scope.activateSections('verifyIdentity');
        }, function (data) {
            // error response
            $rootScope.$broadcast('connectionFailure');
        });
    };

    /**
    * Initialize function
    */
    /*
    $scope.updateSameAddress = function() {
        if($scope.sizeOf($scope.enrollment.serverData.enrollmentLocations) == 1) {
            console.log($scope.enrollment.serverData.enrollmentLocations);
        }
    }

    $scope.updateBillingAddress = function() {
        angular.forEach($scope.enrollment.serverData.enrollmentLocations, function (item, id) {
            if($filter('address')(item.location.address) == $scope.additionalInformation.billingAddress) {
                angular.copy(item.location.address, $scope.enrollment.serverData.billingAddress);
            }
        });
    };
*/
}]);