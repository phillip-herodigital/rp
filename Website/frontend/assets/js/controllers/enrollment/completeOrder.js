﻿/* Enrollment Complete Order Controller
 *
 * This is used to control aspects of complete order on enrollment page.
 */
ngApp.controller('EnrollmentCompleteOrderCtrl', ['$scope', 'enrollmentService', 'enrollmentCartService', '$modal', '$timeout', 'enrollmentStepsService', 'analytics', function ($scope, enrollmentService, enrollmentCartService, $modal, $timeout, enrollmentStepsService, analytics) {

    $scope.completeOrder = {
        additionalAuthorizations: {},
        agreeToTerms: false,
        creditCard: {},
        autopay: true,
    };
    $scope.w9BusinessData = {};
    $scope.getCartCount = enrollmentCartService.getCartCount;
    $scope.getCartItems = enrollmentCartService.getCartItems;  
    $scope.autopayDiscount = $scope.mobileEnrollmentSettings.autoPayDiscount;
    $scope.getCartTotal = function () {
        if ($scope.completeOrder.autopay) {
            return enrollmentCartService.calculateCartTotal() - ($scope.autopayDiscount * $scope.getDevicesCount());
        }
        else {
            return enrollmentCartService.calculateCartTotal();
        }
    };
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
    $scope.getDeviceDetails = enrollmentCartService.getDeviceDetails;
    $scope.llcClassifcation = '';
    $scope.currentDate = new Date();
    $scope.paymentError = enrollmentService.getPaymentError;


    _.intersectionObjects = _.intersect = function(array) {
    var slice = Array.prototype.slice;
        var rest = slice.call(arguments, 1);
            return _.filter(_.uniq(array), function(item) {
                    return _.every(rest, function(other) {
                        return _.any(other, function(element) {
                            return _.isEqual(element, item);
                });
            });
        });
    };

    /**
    * Complete Enrollment Section
    */
    $scope.completeStep = function () {
        enrollmentService.isLoading = true;
        var depositAlternatives = _(enrollmentCartService.services).map(function (service) {
            return _(service.offerInformationByType).pluck('value').flatten().filter().pluck('offerSelections').flatten().filter().map(function (selection) {
                if (selection.payments != null && _(selection.payments.requiredAmounts).filter({ depositOption: 'depositAlternative' }).some()) {
                    return {
                        location: service.location,
                        offerId: selection.offerId
                    };
                }
            }).value();
        }).flatten().filter().value();

        var depositWaivers = _(enrollmentCartService.services).map(function (service) {
            return _(service.offerInformationByType).pluck('value').flatten().filter().pluck('offerSelections').flatten().filter().map(function (selection) {
                if (selection.payments != null && _(selection.payments.requiredAmounts).filter({ depositOption: 'waived' }).some()) {
                    return {
                        location: service.location,
                        offerId: selection.offerId
                    };
                }
            }).value();
        }).flatten().filter().value();

        var setConfirmOrder = function (paymentInfo) {
            if (!enrollmentService.hitKIQ) analytics.sendTags({
                KIQ: false,
            });

            if (_.some(enrollmentCartService.services, function (service) {
                return _.some(service.offerInformationByType[0].value.offerSelections, function (selection) {
                    return _.some(selection.payments.requiredAmounts, function (amount) {
                        return amount.dollarAmount != 0;
                    });
                });
            })) {
                analytics.sendTags({
                    DepositRequired: true
                });
                angular.forEach(depositAlternatives, function (da) {
                    analytics.sendTags({
                        DepositResolution: "Deposit Alternative"
                    });
                });
                angular.forEach(depositWaivers, function (da) {
                    analytics.sendTags({
                        DepositResolution: "Deposit Waiver"
                    });
                });
                for (var i = 0; i < enrollmentCartService.getServiceCount() - depositAlternatives.length - depositWaivers.length; i++) {
                    analytics.sendTags({
                        DepositResolution: "Paid"
                    });
                }
            }
            else {
                analytics.sendTags({
                    DepositRequired: false
                });
            }

            enrollmentService.setConfirmOrder({
                autopay: $scope.completeOrder.autopay && !enrollmentCartService.cartHasUtility(),
                additionalAuthorizations: $scope.completeOrder.additionalAuthorizations,
                agreeToTerms: $scope.completeOrder.agreeToTerms,
                agreeToAutoPayTerms: $scope.completeOrder.agreeToAutoPayTerms,
                paymentInfo: paymentInfo,
                depositAlternatives: depositAlternatives,
                depositWaivers: depositWaivers,
                w9BusinessData: _.keys($scope.w9BusinessData).length ? $scope.w9BusinessData : null
            });
        };

        if ($scope.getCartTotal() > 0) {
            var allPaymentMethods = _(enrollmentCartService.services)
            .pluck('offerInformationByType').flatten().filter()
            .pluck('value').flatten().pluck('offerSelections').flatten().filter()
            .pluck('payments').flatten().filter().pluck('availablePaymentMethods').value();

            var availablePaymentMethods = _.intersectionObjects.apply(_, allPaymentMethods);

            $scope.completeOrder.creditCard().then(
                function (paymentMethod) {
                    var paymentMethodType = paymentMethod.type;
                    if (_.some(availablePaymentMethods, { 'paymentMethodType': paymentMethodType })) {
                        setConfirmOrder(paymentMethod);
                    } else {
                        $scope.validations = [{
                            "memberName": "PaymentAccount.CreditCardNumber"
                        }];
                        enrollmentService.isLoading = false;
                    }
                },
                function() {
                    enrollmentService.isLoading = false;
                    $scope.streamConnectError = true;                     
                }
            );
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

    $scope.toggleAutoPay = function () {
        if ($scope.completeOrder.autopay) {
            if (_.some($scope.getCartItems(), function (item) {
                return item.offerInformationByType[0].value.offerSelections[0].offer.withAutoPayID != "";
            })) {
                turnOnAutoPay();
            }
        }
        else {
            if (_.some($scope.getCartItems(), function (item) {
                return item.offerInformationByType[0].value.offerSelections[0].offer.nonAutoPayID != "";
            })) {
                angular.forEach($scope.getCartItems(), function (item) {
                    if (item.offerInformationByType[0].value.offerSelections[0].offer.nonAutoPayID != "") {
                        var nonAutoPayOffer = _.find(item.offerInformationByType[0].value.availableOffers, function (o) {
                            return o.id === item.offerInformationByType[0].value.offerSelections[0].offer.nonAutoPayID;
                        });
                        item.offerInformationByType[0].value.offerSelections[0].offer.rates[0].nonAutoPayPrice = nonAutoPayOffer.rates[0].rateAmount;
                    }
                    else {
                        item.offerInformationByType[0].value.offerSelections[0].offer.rates[0].nonAutoPayPrice = item.offerInformationByType[0].value.offerSelections[0].offer.rates[0].rateAmount;
                    }
                });
                $scope.autoPayModalInstance = $modal.open({
                    'scope': $scope,
                    'templateUrl': 'autopay-warning'
                });
            }
        };
    };

    var turnOnAutoPay = function () {
        _.filter(enrollmentCartService.services, function (s) {
            return s.offerInformationByType[0].value.offerSelections[0].offer.withAutoPayID != "";
        }).forEach(function (service) {
            service.offerInformationByType[0].value.offerSelections[0].offerId = service.offerInformationByType[0].value.offerSelections[0].offer.withAutoPayID;
            service.offerInformationByType[0].value.offerSelections[0].offer = _.find(service.offerInformationByType[0].value.availableOffers,
                { id: service.offerInformationByType[0].value.offerSelections[0].offer.withAutoPayID });
        });
        enrollmentService.toggleAutoPay();
    }

    $scope.turnOffAutoPay = function () {
        $scope.autoPayModalInstance.close();
        _.filter(enrollmentCartService.services, function (s) {
            return s.offerInformationByType[0].value.offerSelections[0].offer.nonAutoPayID != "";
            }).forEach(function (service) {
                service.offerInformationByType[0].value.offerSelections[0].offerId = service.offerInformationByType[0].value.offerSelections[0].offer.nonAutoPayID;
                service.offerInformationByType[0].value.offerSelections[0].offer = _.find(service.offerInformationByType[0].value.availableOffers,
                    { id: service.offerInformationByType[0].value.offerSelections[0].offer.nonAutoPayID });
            });
        enrollmentService.toggleAutoPay();
    };

    $scope.keepAutoPay = function () {
        $scope.completeOrder.autopay = true;
        $scope.autoPayModalInstance.close();
        if (_.some($scope.getCartItems(), function (item) {
                return item.offerInformationByType[0].value.offerSelections[0].offer.withAutoPayID != "";
        })) {
            turnOnAutoPay();
        }
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