ngApp.controller('EnrollmentConfirmationCtrl', ['$scope', '$window', 'enrollmentService', 'utilityProductsService', 'enrollmentCartService', function ($scope, $window, enrollmentService, utilityProductsService, enrollmentCartService) {
    $scope.accountInformation = {};

    $scope.getPlans = enrollmentCartService.getPlans;
    $scope.getCartItems = enrollmentCartService.getCartItems;  
    $scope.getCartTotal = enrollmentCartService.calculateCartTotal;  

    $scope.onPrint = function() {
        window.print();
    };

    /**
     * Get the server data and populate the form
     */
    $scope.setServerData = function (result) {
        if(result.expectedState != 'orderConfirmed') {
            $window.location.href = '/enrollment';
        }

        // update the cart
        utilityProductsService.updateCart(result.cart);

        // copy out the account information the server has
        $scope.accountInformation.contactInfo = result.contactInfo || {};
        $scope.accountInformation.secondaryContactInfo = result.secondaryContactInfo || {};
    };
}]);