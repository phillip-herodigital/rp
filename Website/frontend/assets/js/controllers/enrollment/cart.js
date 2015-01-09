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
    $scope.editMobileDevice = function (service) {
        //update active service address, send to the correct page
        if(enrollmentCartService.getCartVisibility()) {
            enrollmentCartService.toggleCart();
        }
        enrollmentCartService.setActiveService(service);
        enrollmentStepsService.setFlow('utility', false).setStep('utilityFlowPlans');
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