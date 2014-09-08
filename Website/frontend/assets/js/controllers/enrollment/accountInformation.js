/* Enrollment Account Information Controller
 *
 * This is used to control aspects of account information on enrollment page.
 */
ngApp.controller('EnrollmentAccountInformationCtrl', ['$scope', 'enrollmentService', 'enrollmentCartService', function ($scope, enrollmentService, enrollmentCartService) {
    $scope.accountInformation = enrollmentService.accountInformation;
    $scope.validations = [];

    $scope.hasMoveIn = false;
    $scope.$watch(enrollmentCartService.services, function () {
        $scope.hasMoveIn = _(enrollmentCartService.services)
            .map(function (l) {
                return _(l.location.capabilities).filter({ capabilityType: "ServiceStatus" }).first();
            })
            .filter({ enrollmentType: "moveIn" })
            .any();
    }, true);

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

    if (!$scope.accountInformation.mailingAddress)
        $scope.accountInformation.mailingAddressSame = true;

    $scope.$watch('accountInformation.mailingAddressSame', function () {
        if ($scope.accountInformation.mailingAddressSame) {
            if ($scope.utilityAddresses().length == 1 && !$scope.accountInformation.mailingAddress)
                $scope.accountInformation.mailingAddress = $scope.utilityAddresses()[0].location.address;
        } else {
            $scope.accountInformation.mailingAddress = {};
        }
    });

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