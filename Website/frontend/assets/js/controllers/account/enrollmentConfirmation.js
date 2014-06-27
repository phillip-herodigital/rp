ngApp.controller('EnrollmentConfirmationCtrl', ['$scope', '$window', 'enrollmentService', 'enrollmentCartService', function ($scope, $window, enrollmentService, enrollmentCartService) {
    $scope.accountInformation = {};

    $scope.getCartItems = enrollmentCartService.getCartItems;  
    $scope.getCartTotal = enrollmentCartService.calculateCartTotal;  

    $scope.onPrint = function() {
        window.print();
    };

    /**
     * Get the server data and populate the form
     */
    $scope.setServerData = function (result) {
        enrollmentService.setClientData(result, true);

        // copy out the account information the server has
        $scope.accountInformation.contactInfo = result.contactInfo || {};
        $scope.accountInformation.secondaryContactInfo = result.secondaryContactInfo || {};
    };
}]);