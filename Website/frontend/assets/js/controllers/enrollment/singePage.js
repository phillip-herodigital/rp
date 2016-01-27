/* Enrollment Single Page Controller
 *
 * This is used to control aspects of single page enrollment.
 */
ngApp.controller('EnrollmentSinglePageCtrl', ['$scope', 'enrollmentService', 'enrollmentCartService', '$modal', 'validation', 'analytics', '$http', function ($scope, enrollmentService, enrollmentCartService, $modal, validation, analytics, $http) {

    $scope.getClientData = function (serviceLocation) {
        enrollmentService.isLoading = true;
        if (serviceLocation == undefined) {
            serviceLocation = {
                'capabilities' : [{
                    'capabilityType': 'TexasElectricity',
                    'esiId': $scope.utilityEnrollment.esiId
                }]
            };
        }
        $scope.esiIdInvalid = false;
        $scope.addressIneligible = false;
        $scope.ssnMismatch = false;
        $scope.item = {};
        $http.post('/api/enrollment/previousClientData', serviceLocation)
            .success(function (data) {
                enrollmentService.isLoading = false;
                if (data.validations.length) {
                    if (data.validations[0].memberName == "Location Ineligible") {
                        $scope.addressIneligible = true;
                        $scope.addressEditing = true;
                    }
                    if (data.validations[0].memberName == "ESIID Invalid") {
                        $scope.esiIdInvalid = true;
                        $scope.addressEditing = true;
                    }
                } else {
                    var email = data.contactInfo.email.address;
                    var atIndex = email.indexOf("@");
                    $scope.origEmail = data.contactInfo.email.address;
                    $scope.origPhone = data.contactInfo.phone[0].number;
                    data.contactInfo.email.address = email[0] + new Array(atIndex).join( "*" ) + email.substring(atIndex);
                    data.contactInfo.phone[0].number = "***-***-" + data.contactInfo.phone[0].number.substring(data.contactInfo.phone[0].number.length - 4);
                    enrollmentService.setClientData(data);
                    enrollmentCartService.setActiveServiceIndex(0);
                    $scope.item = $scope.utilityAddresses()[0];
                    $scope.plan = enrollmentCartService.getUtilityAddresses()[0].offerInformationByType[0].value.offerSelections[0].offer;
                    $scope.addressEditing = false;
                }
                
            });
    };

    $scope.getClientData();

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
    $scope.accountInformation.contactInfo.phone[0].category = "mobile";
    $scope.utilityAddresses = enrollmentCartService.getUtilityAddresses;
    $scope.addressEditing = false;
    $scope.contactEditing = false;
    $scope.footnotes = {};
    $scope.activeFootnotes = [];
    $scope.footnoteIndices = {};
    $scope.completeOrder = {};


    if (!$scope.accountInformation.mailingAddress && $scope.utilityAddresses()[0]) {
        $scope.accountInformation.mailingAddressSame = true;
        $scope.accountInformation.mailingAddress = $scope.utilityAddresses()[0].location.address;
    }

    $scope.showAdditionalPhoneNumberChanged = function() {
        if ($scope.additionalInformation.showSecondaryContact && !$scope.contactEditing) {
            $scope.additionalInformation.showSecondaryContact = false;
        }
        if ($scope.additionalInformation.showAdditionalPhoneNumber && $scope.accountInformation.contactInfo.phone.length == 1) {
            $scope.accountInformation.contactInfo.phone[1] = {};
        }
    };

    $scope.showSecondaryContactChanged = function () {
        if ($scope.additionalInformation.showAdditionalPhoneNumber && !$scope.contactEditing) {
            $scope.additionalInformation.showAdditionalPhoneNumber = false;
        }
        if (!$scope.additionalInformation.showSecondaryContact) {
            $scope.accountInformation.secondaryContactInfo.first = null;
            $scope.accountInformation.secondaryContactInfo.last = null;
        }
    };

    $scope.editContactInfo = function () {
        $scope.contactEditing = true;
        $scope.tempAccountInformation = angular.copy($scope.accountInformation);
    };

    $scope.saveContactInfo = function () {
        $scope.contactEditing = false;
    };

    $scope.cancelContactInfo = function () {
        $scope.contactEditing = false;
        $scope.accountInformation = angular.copy($scope.tempAccountInformation);
    };

    $scope.editAddress = function () {
        $scope.addressEditing = !$scope.addressEditing;
    };

    $scope.$watch('footnotes', function () {
        updateFootnotes();
    }, true);

    $scope.$watch(enrollmentCartService.getActiveService, function (address) {
        updateFootnotes();
    });

    function updateFootnotes()
    {
        var address = enrollmentCartService.getActiveService();
        if (address && address.offerInformationByType) {
            var footnoteParts = _(address.offerInformationByType)
                .pluck('key')
                .map(function (item) { return _.map($scope.footnotes[item], function (entry) { entry.type = item; return entry; }); })
                .flatten()
                .filter(function (obj) { return obj.value; })
                .value();
            $scope.activeFootnotes = footnoteParts;
            $scope.footnoteIndices = {};

            for (var i = 0; i < address.offerInformationByType.length; i++)
            {
                $scope.footnoteIndices[address.offerInformationByType[i].key] = {};
            }
            for (var i = 0; i < footnoteParts.length; i++)
            {
                $scope.footnoteIndices[footnoteParts[i].type][footnoteParts[i].key] = i + 1;
            }
        }
    }

    $scope.calculateFootnotes = function calculateFootnotes(footnotes) {
        var result = {};
        result.active = footnotes;
        result.indices = {};

        for (var i = 0; i < footnotes.length; i++) {
            result.indices[footnotes[i].key] = $scope.footnoteDisplay[i];
        }

        return result;
    }

    $scope.footnoteDisplay = ['*', '†', '‡'];

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

        var continueWith = function () {
            if ($scope.accountInformation.contactInfo.phone[0].number.substr(0,1) == "*") {
                $scope.accountInformation.contactInfo.phone[0].number = $scope.origPhone;
            }
            if ($scope.accountInformation.contactInfo.email.address.substr(1,1) == "*") {
                $scope.accountInformation.contactInfo.email.address = $scope.origEmail;
            }
            $scope.ssnMismatch = false;
            enrollmentService.setSinglePageOrder({
                additionalAuthorizations: $scope.completeOrder.additionalAuthorizations,
                agreeToTerms: $scope.completeOrder.agreeToTerms
            }).then(function (data) {
                $scope.validations = data.validations;
                if (data.validations[0].memberName == "SSN Mismatch") {
                    $scope.ssnMismatch = true;
                }
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