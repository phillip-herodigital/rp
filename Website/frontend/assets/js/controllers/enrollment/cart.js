/* Enrollment Cart Controller
 *
 * This is used to control aspects of the cart on enrollment page.
 */
ngApp.controller('EnrollmentCartCtrl', ['$scope', 'enrollmentStepsService', 'enrollmentService', 'mobileEnrollmentService', 'enrollmentCartService', '$modal', '$timeout', function ($scope, enrollmentStepsService, enrollmentService, mobileEnrollmentService, enrollmentCartService, $modal, $timeout) {

    $scope.time = function () { return enrollmentStepsService.timeRemaining(); };
    $scope.isRenewal = enrollmentService.isRenewal;
    $scope.isCartOpen = enrollmentCartService.getCartVisibility;
    $scope.getCartCount = enrollmentCartService.getCartCount;
    $scope.getCartLocationsCount = enrollmentCartService.getCartLocationsCount;
    $scope.getCartItems = enrollmentCartService.getCartItems;
    $scope.cartHasTDU = enrollmentCartService.cartHasTDU;
    $scope.locationHasService = enrollmentCartService.locationHasService;
    $scope.cartHasTxLocation = enrollmentCartService.cartHasTxLocation;
    $scope.cartHasMobile = enrollmentCartService.cartHasMobile;
    $scope.cartHasUtility = enrollmentCartService.cartHasUtility;
    $scope.cartHasProtective = enrollmentCartService.cartHasProtective;
    $scope.cartHasCommercialQuote = enrollmentCartService.cartHasCommercialQuote;
    $scope.mobileEnrollmentService = mobileEnrollmentService;
    $scope.getCartDevices = enrollmentCartService.getCartDevices;
    $scope.getDevicesCount = enrollmentCartService.getDevicesCount;
    $scope.getCartDataPlan = enrollmentCartService.getCartDataPlan;
    $scope.getMobileAddresses = enrollmentCartService.getMobileAddresses;
    $scope.getUtilityAddresses = enrollmentCartService.getUtilityAddresses;
    $scope.getProtectiveServices = enrollmentCartService.getProtectiveServices;
    $scope.getActiveServiceType = enrollmentCartService.getActiveServiceType;
    $scope.getPlanPrice = enrollmentCartService.getPlanPrice;
    $scope.totalPlanPrice = enrollmentCartService.totalPlanPrice;
    $scope.getEstimatedMonthlyTotal = enrollmentCartService.getEstimatedMonthlyTotal;
    $scope.associateInformation = enrollmentService.associateInformation;
    $scope.addDeviceError = false;
    $scope.addDataPlanError = false;
    $scope.addUtilityPlanError = false;
    $scope.getCurrentStep = enrollmentStepsService.getCurrentStep;
    $scope.services = enrollmentCartService.services;
    $scope.getServicesCount = enrollmentCartService.getServicesCount;
    $scope.getProtectiveDiscount = enrollmentCartService.getProtectiveDiscount;
    $scope.getProtectiveTotal = enrollmentCartService.getProtectiveTotal;
    /**
    * Show IMEI Instructions Modal
    */
    $scope.showImeiExample = function () {
        $modal.open({
            'scope': $scope,
            'templateUrl': 'instructions/imei'
        })
    };

    /**
    * Show ESN Instructions Modal
    */
    $scope.showEsnExample = function () {
        $modal.open({
            'scope': $scope,
            'templateUrl': 'instructions/esn'
        })
    };

    /**
    * Show Bill Account Example Modal
    */
    $scope.showBillAccountExample = function () {
        $modal.open({
            'scope': $scope,
            'templateUrl': 'showBillAccountModal'
        })
    };

    $scope.showModal = function (templateUrl, size) {
        $modal.open({
            'scope': $scope,
            'templateUrl': templateUrl,
            'size': size ? size : ''
        })
    };

    /**
    * Show Utility Provider Example Modal
    */
    $scope.showUtilityProviderExample = function () {
        $modal.open({
            'scope': $scope,
            'templateUrl': 'showUtilityProviderModal'
        })
    };
    
    /**
    * Change Plan
    */
    $scope.changeUtilityPlan = function (service) {
        //update active service address, send to the correct page
        if(enrollmentCartService.getCartVisibility()) {
            enrollmentCartService.toggleCart();
        }
        enrollmentCartService.setActiveService(service);
        enrollmentStepsService.setFlow('utility', false).setStep('utilityFlowPlans');
    };

    $scope.removeProtectiveOffer = function (offerId) {
        enrollmentCartService.removeProtectiveOffer(offerId);
        if (enrollmentStepsService.getCurrentStep().id === "verifyIdentity") {
            enrollmentService.setAccountInformation();
        }
    }

    /**
    * Change Mobile Plan
    */
    $scope.changeMobilePlan = function (item, service) {
        //update active service address, send to the correct page
        if(enrollmentCartService.getCartVisibility()) {
            enrollmentCartService.toggleCart();
        }
        enrollmentCartService.removeDeviceFromCart(item);
        enrollmentCartService.removeService(service);
        addNewService();
        enrollmentCartService.addDeviceToCart(item);
        enrollmentStepsService.setStep('phoneFlowPlans');
        enrollmentStepsService.hideStep('accountInformation');
    };

    /**
    * Edit/Delete Mobile Device
    */
    $scope.editMobileDevice = function (item, serviceIndex, saveIMEI) {
        if (saveIMEI) {
            enrollmentService.editPhoneIMEI = angular.copy(item.imeiNumber);
        }
        enrollmentCartService.removeDeviceFromCart(item);
        enrollmentCartService.removeService(enrollmentCartService.services[serviceIndex]);
        if (saveIMEI || enrollmentCartService.getDevicesCount() == 0) {
            addNewService();
            enrollmentStepsService.setStep('phoneFlowDevices');
            enrollmentStepsService.hideStep('phoneFlowPlans');
            enrollmentStepsService.hideStep('accountInformation');
        }
        else {
            enrollmentService.setSelectedOffers();
        }
    };

    /**
    * Add new Mobile Service
    */
    var addNewService = function () {
        $scope.location = {
            address: {
                city: enrollmentCartService.services[0].location.address.city,
                line1: "",
                postalCode5: enrollmentCartService.services[0].location.address.postalCode5,
                stateAbbreviation: enrollmentCartService.services[0].location.address.stateAbbreviation
            },
            capabilities: enrollmentCartService.services[0].location.capabilities
        };
        $scope.offerInfo = [{
            key: "Mobile",
            value: {
                availableOffers: enrollmentCartService.services[0].offerInformationByType[0].value.availableOffers,
                errors: [],
                offerSelections: []
            }
        }];
        enrollmentCartService.addService({
            eligibility: "success",
            location: $scope.location,
            offerInformationByType: $scope.offerInfo
        });
    };

    $scope.addMobileDevice = function () {
        //update active service address, send to the correct page
        if(enrollmentCartService.getCartVisibility()) {
            enrollmentCartService.toggleCart();
        }
        addNewService();
        enrollmentStepsService.setStep('phoneFlowDevices');
        enrollmentStepsService.hideStep('phoneFlowPlans');
    };

    /**
    * Edit Address
    */
    $scope.editUtilityAddress = function (service, isCartOpen) {
        if(enrollmentCartService.getCartVisibility()) {
            enrollmentCartService.toggleCart();
        }
        enrollmentCartService.setActiveService(service);
        enrollmentStepsService.setFlow('utility', false).setStep('utilityFlowService');
        //we should probably focus on the input field as well
    };

    /**
    * Delete plan from cart
    */
    $scope.deleteUtilityPlan = function (service, selectedOffer) {
        $modal.open({
            'scope': $scope,
            'templateUrl': 'confirmAddressDeleteModal'
        }).result.then( function() { 
            enrollmentCartService.removeOffer(service, selectedOffer);
            enrollmentService.setSelectedOffers(); 
        })
    };

    /**
    * Delete mobile service from cart
    */
    $scope.deleteMobilePlan = function (service) {
        var activeService = enrollmentCartService.getActiveService();
        if(enrollmentCartService.getCartVisibility()) {
            enrollmentCartService.toggleCart();
        }
        $scope.addDeviceError = false;
        $scope.addDataPlanError = false;
        enrollmentCartService.removeService(service);
        // if this was the last service in the cart, go to the start
        if (!$scope.cartHasUtility()) {
            enrollmentStepsService.setFlow('phone', false).setStep('phoneFlowVerifyPhone');
        } else {
            enrollmentCartService.setActiveServiceIndex(0);
            enrollmentService.setAccountInformation();
        }
    };

    /**
    * Delete address from cart
    */
    $scope.deleteUtilityAddress = function (service) {
        $modal.open({
            'scope': $scope,
            'templateUrl': 'confirmAddressDeleteModal'
        }).result.then( function() { 
            var activeService = enrollmentCartService.getActiveService();
            $scope.addUtilityPlanError = false;
            enrollmentCartService.removeService(service);
            // if this was the last service in the cart, go to the start
            if (!$scope.cartHasMobile() && !$scope.cartHasUtility()) {
                enrollmentStepsService.setFlow('utility', false).setStep('utilityFlowService');
            } else {
                enrollmentCartService.setActiveServiceIndex(0);
                enrollmentService.setAccountInformation();
            }
        })
    };

    /**
    * Add additional address
    */
    $scope.addUtilityAddress = function () {
        enrollmentCartService.setActiveServiceIndex(enrollmentCartService.getActiveServiceIndex()+1);
        enrollmentStepsService.setFlow('utility', false).setStep('utilityFlowService');
    };


    /**
    * Handle the checkout button
    */
    $scope.cartCheckout = function (addAdditional) {
        var success = true;
        var service = enrollmentCartService.getActiveService();
        var serviceType = $scope.getActiveServiceType();
        var devicesCount = $scope.getDevicesCount();
        
        // validate the current state
        if ($scope.cartHasMobile() && devicesCount == 0 && (serviceType != 'Mobile' || !$scope.addDevice.$valid || $scope.isCartFull() || $scope.esnInvalid))  {
            success = false;
            $scope.addDeviceError = true;
        }
        else if ($scope.cartHasMobile() && devicesCount > 0 && $scope.getCartDataPlan().length == 0) {
            success = false;
            $scope.addDataPlanError = true;
        }
        else if ($scope.cartHasUtility() && service.offerInformationByType[0].value.offerSelections.length == 0) {
            success = false;
            $scope.addUtilityPlanError = true;
        }

        // if valid, run the complete step
        if (success) {
            $scope.addDeviceError = false;
            $scope.addDataPlanError = false;
            $scope.addUtilityPlanError = false;
            // if the current services was removed,
            // set the active service and go to Account Information
            // otherwise, complete the current step
            if (service == undefined) {
                enrollmentCartService.setActiveServiceIndex(0);
                serviceType = $scope.getActiveServiceType();
                if (serviceType == 'Mobile') {
                    enrollmentStepsService.setFlow('phone', true);
                    enrollmentStepsService.activateStep('phoneFlowPlans');
                    enrollmentStepsService.setFromServerStep('planSelection');
                    enrollmentService.setAccountInformation();
                } 
                else if (serviceType == 'TexasElectricity' || serviceType == 'GeorgiaGas') {
                    enrollmentStepsService.setFlow('utility', true);
                    enrollmentStepsService.activateStep('utilityFlowPlans');
                    enrollmentStepsService.setFromServerStep('planSelection');
                    enrollmentService.setSelectedOffers(false);
                }
            } else {
                $scope.completeStep(addAdditional);
            }
        }
    };

}]);