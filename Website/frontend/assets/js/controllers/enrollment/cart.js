﻿/* Enrollment Cart Controller
 *
 * This is used to control aspects of the cart on enrollment page.
 */
ngApp.controller('EnrollmentCartCtrl', ['$scope', 'enrollmentStepsService', 'enrollmentService', 'enrollmentCartService', '$modal', function ($scope, enrollmentStepsService, enrollmentService, enrollmentCartService, $modal) {
    
    /*$scope.enrollmentStepsService = enrollmentStepsService;
    $scope.accountInformationService = accountInformationService;*/


    $scope.time = function () { return enrollmentStepsService.timeRemaining(); };
    $scope.isRenewal = enrollmentService.isRenewal;
    $scope.isCartOpen = enrollmentCartService.getCartVisibility;
    $scope.getCartCount = enrollmentCartService.getCartCount;
    $scope.getCartLocationsCount = enrollmentCartService.getCartLocationsCount;
    $scope.getCartItems = enrollmentCartService.getCartItems;
    
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