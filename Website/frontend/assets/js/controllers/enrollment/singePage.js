/* Enrollment Single Page Controller
 *
 * This is used to control aspects of single page enrollment.
 */
ngApp.controller('EnrollmentSinglePageCtrl', ['$scope', 'enrollmentService', 'enrollmentCartService', '$modal', 'validation', 'analytics', '$http', function ($scope, enrollmentService, enrollmentCartService, $modal, validation, analytics, $http) {
    
    $http.get('/api/enrollment/previousClientData?esiId=1008901018146760805100').success(function (data, status, headers, config) {
        enrollmentService.setClientData(data); 
    });

    $scope.accountInformation = enrollmentService.accountInformation;
    var sci = $scope.accountInformation.secondaryContactInfo;
    $scope.additionalInformation = {
        showAdditionalPhoneNumber: $scope.accountInformation.contactInfo.phone.length > 1,
        showSecondaryContact: (sci && sci.first != undefined && sci.first != "" && sci.last != undefined && sci.last != ""),
        hasAssociateReferral: true
    };
    $scope.validations = [];
    $scope.addressOptions = {};
    $scope.modal = {};
    $scope.cartHasUtility = enrollmentCartService.cartHasUtility;
    $scope.cartHasMobile = enrollmentCartService.cartHasMobile;
    $scope.associateInformation = enrollmentService.associateInformation;

    $scope.accountInformation.contactInfo.phone[0].category = "mobile";

    

    /**
     * [utilityAddresses description]
     * @return {[type]} [description]
     */
    $scope.utilityAddresses = enrollmentCartService.getUtilityAddresses;

    if (!$scope.accountInformation.mailingAddress && $scope.utilityAddresses()[0]) {
        $scope.accountInformation.mailingAddressSame = true;
        $scope.accountInformation.mailingAddress = $scope.utilityAddresses()[0].location.address;
    }

    $scope.$watch('accountInformation.mailingAddressSame', function (newVal, oldVal) {
        if (newVal != oldVal) {
            if ($scope.accountInformation.mailingAddressSame) {
                if ($scope.utilityAddresses().length == 1)
                    $scope.accountInformation.mailingAddress = $scope.utilityAddresses()[0].location.address;
            } else if ($scope.cartHasUtility()) {
                $scope.accountInformation.mailingAddress = {};
            }
        }
    });

    $scope.showAdditionalPhoneNumberChanged = function() {
        if ($scope.additionalInformation.showAdditionalPhoneNumber) {
            $scope.accountInformation.contactInfo.phone[1] = {};
        } else {
            $scope.accountInformation.contactInfo.phone.splice(1, 1);
        }
    };

    $scope.showSecondaryContactChanged = function () {
        if (!$scope.additionalInformation.showSecondaryContact) {
            $scope.accountInformation.secondaryContactInfo.first = null;
            $scope.accountInformation.secondaryContactInfo.last = null;
        }
    };

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
        if (!$scope.additionalInformation.hasAssociateReferral) {

            //Google analytics - track for no associate name.
            analytics.sendVariables(13, 'NO_ASSOCIATE_NAME');

            $scope.accountInformation.associateName = null;
        } else {
            if (typeof $scope.accountInformation.associateName != 'undefined') {
                analytics.sendVariables(14, $scope.accountInformation.associateName);
            }
        }
        var addresses = [$scope.accountInformation.mailingAddress];
        if ($scope.hasMoveIn && $scope.customerType != 'commercial') {
            addresses.push($scope.accountInformation.previousAddress);
        }


        var continueWith = function () {
            // update the cleansed address for mobile
            if ($scope.cartHasMobile() && typeof $scope.accountInformation.previousAddress == 'undefined') {
                $scope.accountInformation.previousAddress = $scope.accountInformation.mailingAddress;
            }
            enrollmentService.setAccountInformation().then(function (data) {
                $scope.validations = data.validations;
            });
            
        }

        if ($scope.accountInfo.$valid && $scope.isFormValid()) {
            enrollmentService.cleanseAddresses(addresses).then(function (data) {
                if ((data.length > 0 && data[0].length) || (data.length > 0 && typeof data[1] != 'undefined' && data[1].length)) {
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
        } else {
            validation.showValidationSummary = true; 
            validation.cancelSuppress($scope);
        }
        
    };
}]);