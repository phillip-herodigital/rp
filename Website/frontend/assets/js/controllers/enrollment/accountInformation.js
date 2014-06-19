/* Enrollment Account Information Controller
 *
 * This is used to control aspects of account information on enrollment page.
 */
ngApp.controller('EnrollmentAccountInformationCtrl', ['$scope', 'enrollmentService', 'utilityProductsService', 'enrollmentCartService', 'verifyIdentityService', function ($scope, enrollmentService, utilityProductsService, enrollmentCartService, verifyIdentityService) {    $scope.validations = enrollmentService.validations;
    $scope.utilityProducts = utilityProductsService;
    $scope.usStates = enrollmentService.usStates;
    $scope.phoneTypes = enrollmentService.phoneTypes;
    $scope.accountInformation = enrollmentService.accountInformation;

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

        var accountInformationPromise = enrollmentService.setAccountInformation(utilityProductsService.addresses);
        accountInformationPromise.then(function (data) {
            $scope.validations = data.validations;
            
            if(data.cart.length) {
            //Update the utilityProviders
                utilityProductsService.addServiceAddress(data.cart);

            //Upate the accountInformation service
                verifyIdentityService.identityQuestions = data.identityQuestions;

            //$scope.enrollment.serverData = data;
            $scope.stepsService.setStep('verifyIdentity')
            }
        }, function (data) {
            // error response
        });
    };
}]);