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

    /**
    * Show IMEI Instructions Modal
    */
    $scope.showImeiExample = function () {
        $modal.open({
            'scope': $scope,
            'templateUrl': 'showImeiModal'
        })
    };

    /**
    * Show ESN Instructions Modal
    */
    $scope.showEsnExample = function () {
        $modal.open({
            'scope': $scope,
            'templateUrl': 'showEsnModal'
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
        enrollmentStepsService.setFlow('mobile', false).setStep('phoneFlowPlans');
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
        enrollmentStepsService.setFlow('mobile', false).setStep('phoneFlowDevices');
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
            enrollmentStepsService.setFlow('mobile', false).setStep('phoneFlowPlans');
        } else {
            enrollmentStepsService.setFlow('mobile', false).setStep('phoneFlowDevices');
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
        enrollmentStepsService.setFlow('mobile', false).setStep('phoneFlowDevices');
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
    * Delete plan from cart
    */
    $scope.deleteMobilePlan = function (service) {
        if(enrollmentCartService.getCartVisibility()) {
            enrollmentCartService.toggleCart();
        }
        enrollmentCartService.removeService(service);
    };

    /**
    * Delete address from cart
    */
    $scope.deleteUtilityAddress = function (service) {
        $modal.open({
            'scope': $scope,
            'templateUrl': 'confirmAddressDeleteModal'
        }).result.then( function() { 
            enrollmentCartService.removeService(service);
            enrollmentStepsService.setFlow('utility', false).setStep('utilityFlowService');
        })
    };

}]);