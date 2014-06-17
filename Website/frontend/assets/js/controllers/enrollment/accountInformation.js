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
        return true;
    }

    /**
    * Complete Enrollment Section
    */
    $scope.completeStep = function () {
        var postData = accountInformationService.createPostObject(utilityProductsService.addresses);

        var confirmOrderPromise = enrollmentService.setConfirmOrder(postData);
        confirmOrderPromise.then(function (data) {
            $scope.validations = data.validations;
            
            //Update the utilityProviders
            //Upate the accountInformation service

            //$scope.enrollment.serverData = data;
            $scope.stepsService.setStep('verifyIdentity')
        }, function (data) {
            // error response
            $rootScope.$broadcast('connectionFailure');
        });
    };

    $scope.updateSameAddress = function (offerOption) {
        if (offerOption.billingAddressSame)
        {
            if ($scope.utilityAddresses().length == 1)
                offerOption.billingAddress = $scope.utilityAddresses()[0].location.address;
        }
        else
        {
            offerOption.billingAddress = {};
        }
    }
}]);