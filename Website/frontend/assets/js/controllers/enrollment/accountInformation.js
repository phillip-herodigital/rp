/* Enrollment Account Information Controller
 *
 * This is used to control aspects of account information on enrollment page.
 */
ngApp.controller('EnrollmentAccountInformationCtrl', ['$scope', 'enrollmentService', 'enrollmentCartService', '$modal', function ($scope, enrollmentService, enrollmentCartService, $modal) {
    $scope.accountInformation = enrollmentService.accountInformation;
    $scope.additionalInformation = {};
    $scope.validations = [];
    $scope.addressOptions = {};
    $scope.modal = {};
    $scope.cartHasUtility = enrollmentCartService.cartHasUtility;
    $scope.cartHasMobile = enrollmentCartService.cartHasMobile;

    $scope.accountInformation.contactInfo.phone[0].category = "mobile";

    $scope.hasMoveIn = false;
    $scope.hasSwitch = false;
    $scope.$watch(enrollmentCartService.services, function () {
        $scope.hasMoveIn = _(enrollmentCartService.services)
            .map(function (l) {
                return _(l.location.capabilities).filter({ capabilityType: "ServiceStatus" }).first();
            })
            .filter({ enrollmentType: "moveIn" })
            .any();
        $scope.hasSwitch = _(enrollmentCartService.services)
            .map(function (l) {
                return _(l.location.capabilities).filter({ capabilityType: "ServiceStatus" }).first();
            })
            .filter({ enrollmentType: "switch" })
            .any();
    }, true);

    // create a filter so that the same phone type can't be selected twice
    $scope.filter1 = function(item){
        return (!($scope.accountInformation.contactInfo.phone.length > 0 && $scope.accountInformation.contactInfo.phone[0].category) || item.name != $scope.accountInformation.contactInfo.phone[0].category);
    };

    $scope.filter2 = function(item){
        return (!($scope.accountInformation.contactInfo.phone.length > 1 && $scope.accountInformation.contactInfo.phone[1].category) || item.name != $scope.accountInformation.contactInfo.phone[1].category);
    };

    $scope.filterCustomerType = function(item){
        if ($scope.customerType != 'commercial') {
            return (item.name != 'work');
        } else {
            return (item.name != 'home');
        }
    };

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

    $scope.mobileAddresses = function () {
        //Keep a temporary array for the typeahead service addresses

        //Don't do this, digest loop error
        //$scope.accountInformation.serviceAddress = [];
        return enrollmentCartService.services;
    };

    if (!$scope.accountInformation.mailingAddress)
        $scope.accountInformation.mailingAddressSame = true;

    $scope.$watch('accountInformation.mailingAddressSame', function () {
        if ($scope.accountInformation.mailingAddressSame) {
            if ($scope.utilityAddresses().length == 1)
                $scope.accountInformation.mailingAddress = $scope.utilityAddresses()[0].location.address;
        } else {
            $scope.accountInformation.mailingAddress = {};
        }
    });

    $scope.$watch('additionalInformation.showAdditionalPhoneNumber', function (newValue) {
        if (newValue) {
            $scope.accountInformation.contactInfo.phone[1] = {};
        } else {
            $scope.accountInformation.contactInfo.phone.splice(1, 1);
        }        
    });

    $scope.showAglcExample = function () {

        $modal.open({
            templateUrl: 'AglcExample',
            scope: $scope
        });
    };

    $scope.getPreviousProviders = function () {
        if (_(enrollmentCartService.services)
            .map(function (l) {
                return _(l.location.capabilities).filter({ capabilityType: "TexasElectricity" }).first();
        }).filter().any()) {
            return $scope.previousProviders;
        } else {
            return $scope.previousProvidersGeorgia;
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
        var addresses = [$scope.accountInformation.mailingAddress];
        if ($scope.hasMoveIn && $scope.customerType != 'commercial') {
            addresses.push($scope.accountInformation.previousAddress);
        }


        var continueWith = function () {
            enrollmentService.setAccountInformation().then(function (data) {
                $scope.validations = data.validations;
            });
        }
        enrollmentService.cleanseAddresses(addresses).then(function (data) {
            if ((data.length > 1 && data[0].length) || (data.length > 1 && data[1].length)) {
                var addressOptions = { };
                if (data[0] && data[0].length) {
                    data[0].unshift($scope.accountInformation.mailingAddress);
                    addressOptions.mailingAddress = data[0];
                }
                if (data[1] && data[1].length) {
                    data[1].unshift($scope.accountInformation.previousAddress);
                    addressOptions.previousAddress = data[1];
                }
                if (addressOptions.mailingAddress || addressOptions.previousAddress) {
                    $scope.addressOptions = addressOptions;
                    var modalInstance = $modal.open({
                        scope: $scope,
                        templateUrl: 'cleanseAddressesModal'
                    });
                    modalInstance.result.then(function (selectedOptions) {
                        if (addressOptions.mailingAddress && $scope.modal.mailingAddress != 'original') {
                            $scope.accountInformation.mailingAddress = $scope.addressOptions.mailingAddress[1];
                        }
                        if (addressOptions.previousAddress && $scope.modal.previousAddress != 'original') {
                            $scope.accountInformation.previousAddress = $scope.addressOptions.previousAddress[1];
                        }
                        continueWith();
                    });
                }
            }
            else {
                continueWith();
            }
        });

        
    };
}]);