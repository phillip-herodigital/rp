ngApp.controller('EnrollmentBillingAddressCtrl', ['$scope', 'enrollmentCartService', function ($scope, enrollmentCartService) {
    if ($scope.item.location.address.line1) {
        $scope.$watch('selectedOffer.offerOption', function (offerOption) {
            if (offerOption != null) {
                if (!offerOption.billingAddress) {
                    offerOption.billingAddress = $scope.item.location.address;
                    offerOption.billingAddressSame = true;
                }
                else {
                    var match = enrollmentCartService.findMatchingAddress(offerOption.billingAddress);
                    if (match) {
                        offerOption.billingAddressSame = true;
                        offerOption.billingAddress = match.location.address;
                    }
                    else {
                        offerOption.billingAddressSame = false;
                    }
                }
            }
        })

    }
}]);