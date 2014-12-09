ngApp.controller('EnrollmentConfirmationCtrl', ['$scope', '$window', 'enrollmentService', 'enrollmentStepsService', 'enrollmentCartService', function ($scope, $window, enrollmentService, enrollmentStepsService, enrollmentCartService) {
    $scope.accountInformation = {};

    $scope.getCartItems = enrollmentCartService.getCartItems;  
    $scope.getCartTotal = enrollmentCartService.calculateCartTotal;  
    $scope.customerType = '';
    $scope.confirmationSuccess = false;
    $scope.cartHasTxLocation = enrollmentCartService.cartHasTxLocation;

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
            // get the result, which should include the expected state
            enrollmentService.setClientData(result);

            // set step to make sure we're supposed to be here
            enrollmentStepsService.setFromServerStep(result.expectedState, true);

            $scope.isRenewal = enrollmentService.isRenewal;

            // copy out the account information the server has
            $scope.accountInformation.contactInfo = result.contactInfo || {};
            $scope.accountInformation.secondaryContactInfo = result.secondaryContactInfo || {};
            $scope.accountInformation.mailingAddress = result.mailingAddress || {};

            // set the customer type, since we're no longer using the enrollment main controller
            $scope.customerType = $scope.getCartItems()[0].location.capabilities[2].customerType;

            // find out if we got a successful confirmation
            $scope.confirmationSuccess = $scope.getCartItems()[0].offerInformationByType[0].value.offerSelections[0].confirmationSuccess;

            // if it's a commercial enrollment, and we don't get a success message, redirect to the error page
            if ($scope.customerType == 'commercial' && !$scope.confirmationSuccess) {
                $window.location.href = '/enrollment/please-contact';
            }

        }
    };
}]);