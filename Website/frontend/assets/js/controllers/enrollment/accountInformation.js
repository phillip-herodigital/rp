/* Enrollment Account Information Controller
 *
 * This is used to control aspects of account information on enrollment page.
 */
ngApp.controller('EnrollmentAccountInformationCtrl', ['$scope', 'enrollmentService', 'enrollmentCartService', '$modal', 'validation', 'analytics', function ($scope, enrollmentService, enrollmentCartService, $modal, validation, analytics) {
    $scope.accountInformation = enrollmentService.accountInformation;
    $scope.contacts = {};
    $scope.contacts.options = enrollmentService.loggedInAccountDetails;
    if (typeof $scope.contacts.options != 'undefined' && $scope.contacts.options.length == 1) {
        $scope.accountInformation = $scope.contacts.options[0];
    }
    
    var sci = $scope.accountInformation.secondaryContactInfo;
    $scope.additionalInformation = {
        showSecondaryContact: (sci && sci.first != undefined && sci.first != "" && sci.last != undefined && sci.last != ""),
        hasAssociateReferral: true
    };
    $scope.validations = [];
    $scope.addressOptions = {};
    $scope.modal = {};
    $scope.cartHasUtility = enrollmentCartService.cartHasUtility;
    $scope.cartHasMobile = enrollmentCartService.cartHasMobile;
    $scope.cartHasProtective = enrollmentCartService.cartHasProtective;
    $scope.associateInformation = enrollmentService.associateInformation;

    $scope.accountInformation.contactInfo.phone[0].category = "mobile";
    $scope.createOnlineAccount = true;
    $scope.hasMoveIn = false;
    $scope.hasSwitch = false;
    $scope.$watch(enrollmentCartService.services, function () {
        $scope.hasMoveIn = _(enrollmentCartService.services)
            .filter(function (l) { //Filter out mobile, since mobile moveIn's should return false
                return !_(l.location.capabilities).filter({ capabilityType: "Mobile" }).any();
            })
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

        _(enrollmentCartService.services).map(function (l) {
            return l.offerInformationByType[0].key
        }).uniq().each(function (t) {
            analytics.sendVariables(10, t);
        });
    }, true);

    // create a filter so that the same phone type can't be selected twice
    $scope.filter1 = function(item){
        return (!($scope.accountInformation.contactInfo.phone.length > 1 && $scope.accountInformation.contactInfo.phone[1].category) || item.name != $scope.accountInformation.contactInfo.phone[1].category);
    };

    $scope.filter2 = function(item){
        return (!($scope.accountInformation.contactInfo.phone.length > 0 && $scope.accountInformation.contactInfo.phone[0].category) || item.name != $scope.accountInformation.contactInfo.phone[0].category);
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
    $scope.utilityAddresses = enrollmentCartService.getUtilityAddresses;

    if (!$scope.accountInformation.mailingAddress && $scope.utilityAddresses()[0]) {
        $scope.accountInformation.mailingAddressSame = true;
        $scope.accountInformation.mailingAddress = $scope.utilityAddresses()[0].location.address;
    }

    $scope.hasVirtualMD = function () {
        if ($scope.cartHasProtective()) {
            return _.some(enrollmentCartService.services[0].offerInformationByType[0].value.offerSelections, function (offerSelection) {
                return _.some(offerSelection.offer.suboffers, function (subOffer) {
                    return subOffer.guid === "{0F25180B-5470-4558-9E8F-3D73275A1083}";
                });
            });
        }
        else return false;
    }

    $scope.mailingAddressSameChanged = function() {
            if (!$scope.accountInformation.mailingAddressSame) {
                if ($scope.utilityAddresses().length == 1)
                    $scope.accountInformation.mailingAddress = $scope.utilityAddresses()[0].location.address;
            } else if ($scope.cartHasUtility()) {
                    $scope.accountInformation.mailingAddress = {};
            }
        };

    $scope.showAdditionalPhoneNumberChanged = function() {
        if ($scope.accountInformation.showAdditionalPhoneNumber) {
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

    $scope.updateAccountInformation = function () {
        if ($scope.contacts.selectedContact == null) {
            enrollmentService.accountInformation = $scope.accountInformation = {
                contactTitle: '',
                contactInfo: {
                    name: {
                        first: '',
                        last: ''
                    },
                    phone: [{
                        number: '',
                        category: 'mobile'
                    }],
                    email: {
                        address: ''
                    }
                },
                socialSecurityNumber: '',
                secondaryContactInfo: {},
                isUserLoggedIn: true,
                mailingAddressSame: true
            };
            if ($scope.utilityAddresses().length == 1)
                $scope.accountInformation.mailingAddress = $scope.utilityAddresses()[0].location.address;
        }
        else {
            enrollmentService.accountInformation = $scope.accountInformation = $scope.contacts.selectedContact;
            if (typeof $scope.accountInformation.secondaryContactInfo == 'undefined') {
                $scope.accountInformation.secondaryContactInfo = {};
            }
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
            analytics.sendTags({
                AssociateBoxFilled: false,
            });
            $scope.accountInformation.associateName = null;
        } else {
            if (typeof $scope.accountInformation.associateName != 'undefined') {
                analytics.sendVariables(14, $scope.accountInformation.associateName);
                analytics.sendTags({
                    AssociateBoxFilled: true,
                });
            }
        }
        var addresses = [$scope.accountInformation.mailingAddress];
        if ($scope.hasMoveIn && $scope.customerType != 'commercial') {
            addresses.push($scope.accountInformation.previousAddress);
        }


        var continueWith = function () {
            // update the cleansed address for mobile
            if (($scope.cartHasMobile() || $scope.cartHasProtective()) && typeof $scope.accountInformation.previousAddress == 'undefined') {
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