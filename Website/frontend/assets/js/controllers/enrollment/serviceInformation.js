/* Enrollment Service Information Controller
 *
 * This is used to control aspects of let's get started on enrollment page.
 */
ngApp.controller('EnrollmentServiceInformationCtrl', ['$scope', '$location', '$filter', 'enrollmentService', 'enrollmentCartService', 'enrollmentStepsService', 'analytics', function ($scope, $location, $filter, enrollmentService, enrollmentCartService, enrollmentStepsService, analytics) {
    // TODO - chose state by geoIP
    if (!$scope.data || !$scope.data.serviceState) {
        if ($location.absUrl().indexOf('State=GA') > 0 || $location.absUrl().indexOf('St=GA') > 0) {
            $scope.data = { serviceState: 'GA' };
        } else {
            $scope.data = { serviceState: 'TX' };
        }
    }
    $scope.getActiveServiceIndex = enrollmentCartService.getActiveServiceIndex;

    // If the incoming URI indicates this is a commercial enrollment, change the default dropdown
    if ($location.absUrl().indexOf('AccountType=C') > 0) {
        $scope.$parent.customerType = 'commercial';
    }

    $scope.getLocation = function (state, val) {
        return $scope.$parent.getLocation(state, val).then(function (values) {
            if (!values.length) {
                return $scope.$parent.getLocation(state,
                    val.toLowerCase()
                    .replace("north", "n")
                    .replace("south", "s")
                    .replace("east", "e")
                    .replace("west", "w")
                    .replace("northeast", "ne")
                    .replace("northwest", "nw")
                    .replace("southeast", "se")
                    .replace("southwest", "sw"))
                    .then(function (values) {
                        $scope.errorMessage = !values.length;
                        return values;
                    });
            }
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

    $scope.$watch('data.serviceState', function() {
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

        var provider = '';
        var tx = _($scope.data.serviceLocation.capabilities).find({ capabilityType: "TexasElectricity" });
        if (tx && tx.tdu) {
            provider = tx.tdu;
        } else if (_($scope.data.serviceLocation.capabilities).some({ capabilityType: "GeorgiaGas" })) {
            provider = "AGLC";
        }
        analytics.sendVariables(1, $scope.data.serviceLocation.address.postalCode5, 2, provider, 5, $scope.data.isNewService ? "Move In" : "Switch");
        analytics.sendTags({
            EnrollmentZipCode: $scope.data.serviceLocation.address.postalCode5,
            EnrollmentCity: $scope.data.serviceLocation.address.city,
            EnrollmentState: $scope.data.serviceLocation.address.stateAbbreviation === "GA" ? "Georgia" : "Texas",
            EnrollmentProvider: provider,
            EnrollmentType: $scope.data.isNewService ? "New" : "Switch",
            EnrollmentChannel: "mystream.com"
        });
    };

}]);