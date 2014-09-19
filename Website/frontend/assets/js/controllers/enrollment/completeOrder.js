﻿/* Enrollment Complete Order Controller
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

    /**
    * Complete Enrollment Section
    */
    $scope.completeStep = function () {
        console.log('Sending confirm order...');

        if ($scope.getCartTotal() > 0) {
            $scope.completeOrder.creditCard().then(function (paymentInfo) {
                console.log({
                    agreeToTerms: $scope.completeOrder.agreeToTerms,
                    paymentInfo: paymentInfo
                });
                enrollmentService.setConfirmOrder({
                    additionalAuthorizations: $scope.completeOrder.additionalAuthorizations,
                    agreeToTerms: $scope.completeOrder.agreeToTerms,
                    paymentInfo: paymentInfo
                });
            });
        } else {
            enrollmentService.setConfirmOrder({
                agreeToTerms: $scope.completeOrder.agreeToTerms,
                paymentInfo: null
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