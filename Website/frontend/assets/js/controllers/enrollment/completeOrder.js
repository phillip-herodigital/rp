/* Enrollment Complete Order Controller
 *
 * This is used to control aspects of complete order on enrollment page.
 */
ngApp.controller('EnrollmentCompleteOrderCtrl', ['$scope', 'enrollmentService', 'enrollmentCartService', '$modal', function ($scope, enrollmentService, enrollmentCartService, $modal) {

    $scope.completeOrder = {
        additionalAuthorizations: {},
        agreeToTerms: false,
        creditCard: {}
    };

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

        if ($scope.getCartTotal() > 0) {
            $scope.completeOrder.creditCard().then(function (paymentInfo) {
                enrollmentService.setConfirmOrder({
                    additionalAuthorizations: $scope.completeOrder.additionalAuthorizations,
                    agreeToTerms: $scope.completeOrder.agreeToTerms,
                    paymentInfo: paymentInfo,
                    depositWaivers: depositWaivers
                });
            });
        } else {
            enrollmentService.setConfirmOrder({
                additionalAuthorizations: $scope.completeOrder.additionalAuthorizations,
                agreeToTerms: $scope.completeOrder.agreeToTerms,
                paymentInfo: null,
                depositWaivers: depositWaivers
            });
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
}]);