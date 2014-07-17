ngApp.controller('EnrollmentConfirmationCtrl', ['$scope', '$window', 'enrollmentService', 'enrollmentStepsService', 'enrollmentCartService', function ($scope, $window, enrollmentService, enrollmentStepsService, enrollmentCartService) {
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
        //get the result, which should include the expected state
        enrollmentService.setClientData(result);
        enrollmentStepsService.setFromServerStep(result.expectedState, true);


        //set step to make sure we're supposed to be here
        //enrollmentStepsService

        // copy out the account information the server has
        $scope.accountInformation.contactInfo = result.contactInfo || {};
        $scope.accountInformation.secondaryContactInfo = result.secondaryContactInfo || {};
    };
}]);