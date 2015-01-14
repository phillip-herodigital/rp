ngApp.controller('MobileEnrollmentConfigureDataCtrl', ['$scope', '$filter', '$modal', 'enrollmentService', 'mobileEnrollmentService', 'enrollmentStepsService', 'enrollmentCartService', function ($scope, $filter, $modal, enrollmentService, mobileEnrollmentService, enrollmentStepsService, enrollmentCartService) {

    $scope.mobileEnrollmentService = mobileEnrollmentService;
    $scope.currentMobileLocationInfo = enrollmentCartService.getActiveService;

    $scope.formFields = {
        chosenPlanId: undefined
    };

    $scope.filterDataPlans = function(plan){
        if (typeof mobileEnrollmentService.selectedNetwork != 'undefined') {
            var provider = mobileEnrollmentService.selectedNetwork.value,
            devicesCount = enrollmentCartService.getDevicesCount();
        
            if (devicesCount == 0) {
                return null;
            } else if (devicesCount == 1) {
                return plan.provider.toLowerCase() == provider && !plan.isParentOffer && !plan.isChildOffer;
            } else {
                return plan.provider.toLowerCase() == provider && plan.isParentOffer && !plan.isChildOffer;
            }
        } else {
            return null;
        }
    };



    $scope.$watch(enrollmentCartService.getActiveService, function (address) {
        $scope.planSelection = { selectedOffers: {} };
        //$scope.isCartFull = enrollmentCartService.isCartFull($scope.customerType);
        if (address && address.offerInformationByType) {
            angular.forEach(address.offerInformationByType, function (entry) {
                if (entry.value && _(entry.key).contains('Mobile') && entry.value.offerSelections.length) {
                    $scope.planSelection.selectedOffers[entry.key] = entry.value.offerSelections[0].offerId;
                } else if (entry.value && entry.value.availableOffers.length == 1) {
                    $scope.planSelection.selectedOffers[entry.key] = entry.value.availableOffers[0].id;
                }
            });
        }
    });

    // clear the plan selection when any device is added to the cart
    $scope.$watch(enrollmentCartService.getDevicesCount, function (newVal, oldVal) {
        if (newVal != oldVal) {
            $scope.planSelection = { selectedOffers: {} };
        }
    });

    //Once a plan is selected, check through all available and see if a selection happend
    $scope.$watchCollection('planSelection.selectedOffers', function (selectedOffers) {
        enrollmentStepsService.setMaxStep('phoneFlowPlans');
        // clear selected offers
        enrollmentCartService.selectOffers(_(selectedOffers).mapValues(function (offer) { return []; }).value());     

        var activeService = enrollmentCartService.getActiveService();
        var activeServiceIndex = enrollmentCartService.getActiveServiceIndex();
        if (typeof activeService != 'undefined' && selectedOffers.Mobile != null) {
            var offerInformationForType = _(activeService.offerInformationByType).where({ key: 'Mobile' }).first();
            var selectedOffer = _(offerInformationForType.value.availableOffers).find({ 'id': selectedOffers.Mobile });
            var offerId = selectedOffer.id;
            var childId = selectedOffer.childOfferId;
            var devices = enrollmentCartService.getCartDevices();

            // Add plan for each device, and add to the selected offers array
            for (var i = 0, len = devices.length; i < len; i++) {
                var device = devices[i];
                var offer = { offerId: (i == 0) ? offerId : childId };
                offer.offerOption = {
                    optionType: 'Mobile',
                    data: selectedOffer.data,
                    rates: selectedOffer.rates,
                    activationDate: new Date(),
                    phoneNumber: device.phoneNumber,
                    esnNumber: device.imeiNumber,
                    simNumber: device.simNumber,
                    imeiNumber: device.imeiNumber,
                    inventoryItemId: device.id,
                    transferPhoneNumber: (device.phoneNumber == null) ? false : true,
                    useInstallmentPlan: (device.buyingOption == 'New' || device.buyingOption == 'BYOD') ? false : true,
                };
                offerInformationForType.value.offerSelections.push(offer);
            };
            _.find(enrollmentCartService.services[activeServiceIndex].offerInformationByType, function(offerType) {
                if (offerType.key == 'Mobile') {
                    offerType.value = offerInformationForType.value;
                }
            });
        }
    });

    $scope.editDevice = function() {
        $scope.setCurrentStep('choose-phone');
    };

    $scope.addUtilityAddress = function () {
        if(enrollmentCartService.getCartVisibility()) {
            enrollmentCartService.toggleCart();
        }
        enrollmentCartService.setActiveService();
        enrollmentStepsService.setFlow('utility', true).setFromServerStep('serviceInformation');
    };

    $scope.completeStep = function() {
        enrollmentService.setAccountInformation();
    };

}]);