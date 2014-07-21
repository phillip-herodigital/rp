/* Enrollment Account Information Controller
 *
 * This is used to control aspects of account information on enrollment page.
 */
ngApp.controller('EnrollmentAccountInformationCtrl', ['$scope', 'enrollmentService', 'enrollmentCartService', function ($scope, enrollmentService, enrollmentCartService) {
    $scope.accountInformation = enrollmentService.accountInformation;
    $scope.validations = [];

    /**
     * [utilityAddresses description]
     * @return {[type]} [description]
     */
    $scope.utilityAddresses = function () {
        //Keep a temporary array for the typeahead service addresses

        //Don't do this, digest loop error
        //$scope.accountInformation.serviceAddress = [];
        return enrollmentCartService.services;
    };

    $scope.updateSameAddress = function (offerOption) {
        if (offerOption.billingAddressSame) {
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
    $scope.isFormValid = function () {
        if (enrollmentCartService.getCartCount()) {
            return true;
        } else {
            return false;
        }
    };

    /**
    * Complete Enrollment Section
    */
    $scope.completeStep = function () {

        enrollmentService.setAccountInformation().then(function (data) {
            console.log(data);
            $scope.validations = data.validations;
        });
    };
}]);