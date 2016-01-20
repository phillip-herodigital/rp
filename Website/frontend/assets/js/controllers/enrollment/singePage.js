/* Enrollment Single Page Controller
 *
 * This is used to control aspects of single page enrollment.
 */
ngApp.controller('EnrollmentSinglePageCtrl', ['$scope', 'enrollmentService', 'enrollmentCartService', '$modal', 'validation', 'analytics', '$http', function ($scope, enrollmentService, enrollmentCartService, $modal, validation, analytics, $http) {
    
    $scope.isLoading = true;
    $http.get('/api/enrollment/previousClientData?esiId=1008901018146760805100').success(function (data, status, headers, config) {
        enrollmentService.setClientData(data);
        $scope.item = $scope.utilityAddresses()[0];
        $scope.offer = enrollmentCartService.getUtilityAddresses()[0].offerInformationByType[0].value.offerSelections[0].offer;
        $scope.isLoading = false;
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
    $scope.accountInformation.contactInfo.phone[0].category = "mobile";
    $scope.utilityAddresses = enrollmentCartService.getUtilityAddresses;
    $scope.addressEditing = false;
    $scope.contactEditing = false;


    if (!$scope.accountInformation.mailingAddress && $scope.utilityAddresses()[0]) {
        $scope.accountInformation.mailingAddressSame = true;
        $scope.accountInformation.mailingAddress = $scope.utilityAddresses()[0].location.address;
    }

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