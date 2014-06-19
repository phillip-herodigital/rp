/* Enrollment Account Information Controller
 *
 * This is used to control aspects of account information on enrollment page.
 */
ngApp.controller('EnrollmentAccountInformationCtrl', ['$scope', '$rootScope', '$filter', 'enrollmentService', 'utilityProductsService', 'accountInformationService', 'enrollmentCartService', function ($scope, $rootScope, $filter, enrollmentService, utilityProductsService, accountInformationService, enrollmentCartService) {
    $scope.validations = enrollmentService.validations;
    $scope.utilityProducts = utilityProductsService;
    $scope.usStates = enrollmentService.usStates;
    $scope.phoneTypes = enrollmentService.phoneTypes;
    $scope.accountInformation = accountInformationService.accountInformation;

    /**
     * [utilityAddresses description]
     * @return {[type]} [description]
     */
    $scope.utilityAddresses = function() {
        //Keep a temporary array for the typeahead service addresses
        
        //Don't do this, digest loop error
        //$scope.accountInformation.serviceAddress = [];
        return utilityProductsService.getAddresses();
    };

    $scope.updateSameAddress = function (offerOption) {
        if (offerOption.billingAddressSame)
        {
            if ($scope.utilityAddresses().length == 1)
                offerOption.billingAddress = $scope.utilityAddresses()[0].location.address;
        } else {
            offerOption.billingAddress = {};
        }
    };

    /**
     * In addition to normal validation, ensure that at least one item is in the shopping cart
     * @return {Boolean} [description]
     */
    $scope.isFormValid = function() {
        if(enrollmentCartService.getCartCount()) {
            return true;    
        } else {
            return false;
        }
    };

    /**
    * Complete Enrollment Section
    */
    $scope.completeStep = function () {
        var postData = accountInformationService.createPostObject(utilityProductsService.addresses);

        var accountInformationPromise = enrollmentService.setAccountInformation(postData);
        accountInformationPromise.then(function (data) {
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
}]);