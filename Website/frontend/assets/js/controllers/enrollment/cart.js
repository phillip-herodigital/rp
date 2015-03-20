/* Enrollment Cart Controller
 *
 * This is used to control aspects of the cart on enrollment page.
 */
ngApp.controller('EnrollmentCartCtrl', ['$scope', 'enrollmentStepsService', 'enrollmentService', 'mobileEnrollmentService', 'enrollmentCartService', '$modal', function ($scope, enrollmentStepsService, enrollmentService, mobileEnrollmentService, enrollmentCartService, $modal) {
    
    /*$scope.enrollmentStepsService = enrollmentStepsService;
    $scope.accountInformationService = accountInformationService;*/


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
    $scope.mobileEnrollmentService = mobileEnrollmentService;
    $scope.getCartDevices = enrollmentCartService.getCartDevices;
    $scope.getDevicesCount = enrollmentCartService.getDevicesCount;
    $scope.getCartDataPlan = enrollmentCartService.getCartDataPlan;
    $scope.getMobileAddresses = enrollmentCartService.getMobileAddresses;
    $scope.getUtilityAddresses = enrollmentCartService.getUtilityAddresses;
    $scope.getActiveServiceType = enrollmentCartService.getActiveServiceType;
    $scope.totalPlanPrice = enrollmentCartService.totalPlanPrice;
    $scope.addDeviceError = false;
    $scope.addDataPlanError = false;
    $scope.addUtilityPlanError = false;

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
    * Show ICCID Instructions Modal
    */
    $scope.showIccidExample = function () {
        $modal.open({
            'scope': $scope,
            'templateUrl': 'instructions/iccid'
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

    /**
    * Change Mobile Plan
    */
    $scope.changeMobilePlan = function (service) {
        //update active service address, send to the correct page
        if(enrollmentCartService.getCartVisibility()) {
            enrollmentCartService.toggleCart();
        }
        enrollmentCartService.setActiveService(service);
        enrollmentStepsService.setFlow('phone', false).setStep('phoneFlowPlans');
    };

    /**
    * Edit Mobile Device
    */
    $scope.editMobileDevice = function (item) {
        //update active service address, send to the correct page
        if(enrollmentCartService.getCartVisibility()) {
            enrollmentCartService.toggleCart();
        }
        //update the editedDevice object so the Choose Phone page can get its state
        mobileEnrollmentService.editedDevice = item;
        //remove the device from the cart items array
        enrollmentCartService.removeDeviceFromCart(item);
        enrollmentStepsService.setFlow('phone', false).setStep('phoneFlowDevices');
    };

    /**
    * Delete Mobile Device
    */
    $scope.deleteMobileDevice = function (item) {
        //update active service address, send to the correct page
        if(enrollmentCartService.getCartVisibility()) {
            enrollmentCartService.toggleCart();
        }
        //remove the device from the cart items array
        enrollmentCartService.removeDeviceFromCart(item);
        //if there are still devices in the cart, go to data plan selection,
        //otherwise go to phone selection
        if (enrollmentCartService.getDevicesCount () > 0) {
            var service = enrollmentCartService.getActiveService();
            enrollmentCartService.setActiveService(service);
            enrollmentStepsService.setFlow('phone', false).setStep('phoneFlowPlans');
        } else {
            enrollmentStepsService.setFlow('phone', false).setStep('phoneFlowDevices');
        }
    };

    /**
    * Add Mobile Device
    */
    $scope.addMobileDevice = function (service) {
        //update active service address, send to the correct page
        if(enrollmentCartService.getCartVisibility()) {
            enrollmentCartService.toggleCart();
        }
        enrollmentCartService.setActiveService(service);
        enrollmentStepsService.setFlow('phone', false).setStep('phoneFlowDevices');
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
        if (activeService == service) {
            enrollmentCartService.setActiveServiceIndex(-1);
        } else if (!$scope.cartHasUtility()) {
            enrollmentStepsService.setFlow('phone', false).setStep('phoneFlowNetwork');
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
            if (activeService == service) {
                enrollmentCartService.setActiveServiceIndex(-1);
            } else if (!$scope.cartHasMobile()) {
                enrollmentStepsService.setFlow('utility', false).setStep('utilityFlowService');
            } 
        })
    };

    /**
    * Handle the checkout button
    */
    $scope.cartCheckout = function () {
        var success = true;
        var service = enrollmentCartService.getActiveService();
        var serviceType = $scope.getActiveServiceType();
        var devicesCount = $scope.getDevicesCount();
        
        // validate the current state
        if (serviceType == 'Mobile') {
            if (devicesCount == 0 && (!$scope.addDevice.$valid || $scope.isCartFull() || $scope.esnInvalid))  {
                success = false;
                $scope.addDeviceError = true;
            }
            else if (devicesCount > 0 && $scope.getCartDataPlan().length == 0) {
                success = false;
                $scope.addDataPlanError = true;
            }
        }
        else if (serviceType == 'TexasElectricity' || serviceType == 'GeorgiaGas') {
            if (service.offerInformationByType[0].value.offerSelections.length == 0) {
                success = false;
                $scope.addUtilityPlanError = true;
            }
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
                $scope.completeStep();
            }
        }
    };

}]);