/* Enrollment Service Information Controller
 *
 * This is used to control aspects of let's get started on enrollment page.
 */
ngApp.controller('EnrollmentServiceInformationCtrl', ['$scope', '$location', '$filter', 'enrollmentService', 'enrollmentCartService', 'enrollmentStepsService', function ($scope, $location, $filter, enrollmentService, enrollmentCartService, enrollmentStepsService) {
    // TODO - chose state by geoIP
    $scope.data = { serviceState: 'TX' };

    // If the incoming URI indicates this is a commercial enrollment, change the default dropdown
    if ($location.absUrl().indexOf('AccountType=C') > 0) {
        $scope.$parent.customerType = 'commercial';
    }

    $scope.getLocation = function (state, val) {
        return $scope.$parent.getLocation(state, val).then(function (values) {
            $scope.errorMessage = !values.length;
            return values;
        });
    };
    $scope.isDuplicateAddress = $scope.$parent.isDuplicateAddress;

    //Checking to see when the active service address has been updated
    //So we can reinitialize all service information for this page
    //There has to be a better way of doing this
    $scope.$watch(enrollmentCartService.getActiveService, function (newValue) {        
        $scope.cartLocationsCount = enrollmentCartService.getCartLocationsCount();
        if (!newValue) {
            $scope.data.serviceLocation = null;
            $scope.data.isNewService = undefined;
        } else {
            $scope.data.serviceLocation = newValue.location;
            $scope.isCartFull = enrollmentCartService.isCartFull($scope.customerType);
            $scope.isNewServiceAddress = enrollmentCartService.isNewServiceAddress();
            var target = _(newValue.location.capabilities).find({ capabilityType: "ServiceStatus" });
            if (target) {
                $scope.data.isNewService = target.enrollmentType == 'moveIn';
            }
            else {
                $scope.data.isNewService = undefined;
            }
        }
    });

    $scope.$watch('data', function (newValue) {
        if (!enrollmentCartService.getActiveService() || enrollmentCartService.getActiveService().location != $scope.data.serviceLocation) {
            enrollmentStepsService.setMaxStep('utilityFlowService');
        }

        if (typeof newValue.serviceLocation != 'string') {
            var activeService = enrollmentCartService.getActiveService();
            if (activeService && activeService.offerInformationByType && !activeService.offerInformationByType.length) {
                $scope.errorMessage = true;
            } else {
                $scope.errorMessage = false;
            }
        }
    }, true);

    $scope.$watch('customerType', function() {
        $scope.data.serviceLocation = null;
    });

    /**
     * Checking if the current form is valid to continue
     * Form level validation is done outside of here, this is checking to ensure
     * we have the correct data
     * @return {Boolean}
     */
    $scope.isFormValid = function() {
        if ($scope.data.serviceLocation !== null && typeof $scope.data.serviceLocation == 'object' && $scope.data.isNewService !== undefined && (!$scope.isCartFull || !$scope.isNewServiceAddress) && !$scope.isDuplicateAddress($scope.data.serviceLocation.address)) {
            return true;
        } else {
            return false;
        }
    };

    /**
     * Complete the Service Information Step
     * @return {[type]} [description]
     */
    $scope.completeStep = function () {

        //Someone bypassed the disabled button, lets send an error
        if(typeof $scope.data.serviceLocation == 'string' || $scope.data.serviceLocation === null) {
            $scope.errorMessage = true;
            return;
        } 

        $scope.data.serviceLocation.capabilities = _.filter($scope.data.serviceLocation.capabilities, function (cap) { return cap.capabilityType != "ServiceStatus" && cap.capabilityType != "CustomerType"; });
        $scope.data.serviceLocation.capabilities.push({ "capabilityType": "ServiceStatus", "enrollmentType": $scope.data.isNewService ? 'moveIn' : 'switch' });
        $scope.data.serviceLocation.capabilities.push({ "capabilityType": "CustomerType", "customerType": $scope.customerType });


        var activeService = enrollmentCartService.getActiveService();
        if (activeService) {
            activeService.location = $scope.data.serviceLocation;
            enrollmentService.setSelectedOffers();
        }
        else {
            enrollmentCartService.addService({ location: $scope.data.serviceLocation });
            enrollmentService.setServiceInformation();
        }
    };

}]);