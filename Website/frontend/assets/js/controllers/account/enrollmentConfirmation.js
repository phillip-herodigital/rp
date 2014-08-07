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
        if (result == 'deferred') {
            $window.deferred = function (data) {
                $scope.$apply(function () { $scope.setServerData(data); })
            };
        }
        else {
            //get the result, which should include the expected state
            enrollmentService.setClientData(result);

            //set step to make sure we're supposed to be here
            enrollmentStepsService.setFromServerStep(result.expectedState, true);

            $scope.isRenewal = enrollmentService.isRenewal;

            // copy out the account information the server has
            $scope.accountInformation.contactInfo = result.contactInfo || {};
            $scope.accountInformation.secondaryContactInfo = result.secondaryContactInfo || {};
        }
    };
}]);