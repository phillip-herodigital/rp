/* Enrollment Complete Order Controller
 *
 * This is used to control aspects of complete order on enrollment page.
 */
ngApp.controller('EnrollmentCompleteOrderCtrl', ['$scope', 'enrollmentService', 'enrollmentCartService', '$modal', '$timeout', 'enrollmentStepsService', function ($scope, enrollmentService, enrollmentCartService, $modal, $timeout, enrollmentStepsService) {

    $scope.completeOrder = {
        additionalAuthorizations: {},
        agreeToTerms: false,
        creditCard: {}
    };

    $scope.w9BusinessData = {};
    $scope.getCartCount = enrollmentCartService.getCartCount;
    $scope.getCartItems = enrollmentCartService.getCartItems;  
    $scope.getCartTotal = enrollmentCartService.calculateCartTotal;  
    $scope.cartHasTxLocation = enrollmentCartService.cartHasTxLocation;
    $scope.isRenewal = enrollmentService.isRenewal;
    $scope.cartHasUtility = enrollmentCartService.cartHasUtility;
    $scope.cartHasMobile = enrollmentCartService.cartHasMobile;
    $scope.getCartDevices = enrollmentCartService.getCartDevices;  
    $scope.getCartDataPlan = enrollmentCartService.getCartDataPlan;
    $scope.getDevicesCount = enrollmentCartService.getDevicesCount;
    $scope.getProratedCost = enrollmentCartService.getProratedCost;
    $scope.getOfferData = enrollmentCartService.getOfferData;
    $scope.getOfferPrice = enrollmentCartService.getOfferPrice;
    $scope.getDeviceTax = enrollmentCartService.getDeviceTax;
    $scope.getDeviceActivationFee = enrollmentCartService.getDeviceActivationFee;
    $scope.getDeviceDeposit = enrollmentCartService.getDeviceDeposit;
    $scope.llcClassifcation = '';
    $scope.currentDate = new Date();

    /**
    * Complete Enrollment Section
    */
    $scope.completeStep = function () {
        var depositWaivers = _(enrollmentCartService.services).map(function (service) {
            return _(service.offerInformationByType).pluck('value').flatten().filter().pluck('offerSelections').flatten().filter().map(function (selection) {
                if (selection.payments != null && _(selection.payments.requiredAmounts).filter({ isWaived: true }).some()) {
                    return {
                        location: service.location,
                        offerId: selection.offerId
                    };
                }
            }).value();
        }).flatten().filter().value();

        var setConfirmOrder = function (paymentInfo) {
            enrollmentService.setConfirmOrder({
                additionalAuthorizations: $scope.completeOrder.additionalAuthorizations,
                agreeToTerms: $scope.completeOrder.agreeToTerms,
                paymentInfo: paymentInfo,
                depositWaivers: depositWaivers,
                w9BusinessData: _.keys($scope.w9BusinessData).length ? $scope.w9BusinessData : null
            });
        };

        if ($scope.getCartTotal() > 0) {
            $scope.completeOrder.creditCard().then(setConfirmOrder);
        } else {
            setConfirmOrder(null);
        }
    };

    /**
    * Calculate Total
    *
    * @param object plans
    *
    * return int
    */
    $scope.calculateTotal = function (plans) {
        var total = 0;

        angular.forEach(plans, function (value, key) {
            total += value.paymentInformation.amount;
        });

        return total;
    };

    $scope.showTerms = function (terms) {

        $modal.open({
            templateUrl: 'Terms/' + terms,
            scope: $scope
        });
    };

    $scope.showDepositWaiver = function (stateAbbreviation) {

        $modal.open({
            templateUrl: 'DepositWaiver/' + stateAbbreviation,
            scope: $scope,
            windowClass: 'depositWaiver'
        });
    };

    $scope.showCreditCardExample = function () {

        $modal.open({
            templateUrl: 'CreditCardExample',
            scope: $scope
        });
    };

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

    $scope.showSignatureModal = function (templateUrl) {
        var $sigdiv;
        var signatureModalInstance = $modal.open({
            'scope': $scope,
            'templateUrl': templateUrl,
            'windowClass': 'signature',
            'controller': 'MobileEnrollmentCompleteOrderSignatureModalCtrl'
        });
        signatureModalInstance.opened.then(function () {
            $timeout ( function(){
                $sigdiv = $('.modal-content #draw-signature').jSignature({width:496, height: 90, 'decor-color': 'transparent'});
            },0);
        });
        signatureModalInstance.result.then(function (modalData) {
            $scope.w9BusinessData.signatureImage = (modalData.selectedTab == 'draw') ? $sigdiv.jSignature("getData", "image")[1] : modalData.image;
            $scope.w9BusinessData.customerSignature = modalData.name;
        });
    };

}]);

ngApp.controller('MobileEnrollmentCompleteOrderSignatureModalCtrl', ['$scope', '$modalInstance', 'mobileEnrollmentService', function ($scope, $modalInstance, mobileEnrollmentService) {

    $scope.selectedTab = 'type';
    $scope.formData = {
        name: ''
    };

    $scope.selectTab = function(name) {
        $scope.selectedTab = name;
    };

    $scope.submit = function () {
        var image;
        if ($scope.selectedTab != 'draw') {
            var canvas = document.createElement('canvas');
            canvas.width = 496;
            canvas.height = 90;
            var context = canvas.getContext('2d');
            
            context.font = '70px "ff-market-web", cursive';
            context.textBaseline = 'top';
            context.textAlign = 'left';
            context.fillText($scope.formData.name, 0, 0)

            image = canvas.toDataURL();
            image = image.substr('data:image/png;base64,'.length);
        }

        var modalData = {
            name: $scope.formData.name,
            selectedTab: $scope.selectedTab,
            image: image
        }
        $modalInstance.close(modalData);
    };

}]);