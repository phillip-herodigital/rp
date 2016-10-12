/* Enrollment Service Information Controller
 *
 * This is used to control aspects of let's get started on enrollment page.
 */
ngApp.controller('EnrollmentServiceInformationCtrl', ['$scope', '$location', '$filter', 'enrollmentService', 'enrollmentCartService', 'enrollmentStepsService', 'analytics', function ($scope, $location, $filter, enrollmentService, enrollmentCartService, enrollmentStepsService, analytics) {

    if (!$scope.data || !$scope.data.serviceState) {
        var state = getParameterByName("State")
        if (state) {
            $scope.data = { serviceState: state };
        } else if ($scope.geoLocation.state) {
            $scope.data = { serviceState: $scope.geoLocation.state };
        }
        else {
            $scope.data = { serviceState: "TX" };
        }
    }
    $scope.getActiveServiceIndex = enrollmentCartService.getActiveServiceIndex;

    // If the incoming URI indicates this is a commercial enrollment, change the default dropdown
    if (getParameterByName('AccountType') === "C") {
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

    $scope.$watch('data.serviceState', function() {
        $scope.data.serviceLocation = null;
    });

    /**
     * Checking if the current form is valid to continue
     * Form level validation is done outside of here, this is checking to ensure
     * we have the correct data
     * @return {Boolean}
     */
    $scope.isFormValid = function () {
        if ($scope.data.serviceLocation !== null && $scope.data.isNewService !== undefined && (!$scope.isCartFull || !$scope.isNewServiceAddress) && !$scope.isDuplicateAddress($scope.data.serviceLocation.address)) {
            if ($scope.data.serviceState === "TX" || $scope.data.serviceState === "GA") {
                return typeof $scope.data.serviceLocation === 'object';
            }
            else {
                var zipCheck = /^\d{5}(-\d{4})?$/.test($scope.data.serviceLocation.address.postalCode5);
                return zipCheck;
            }
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
        if($scope.data.serviceLocation === null) {
            $scope.errorMessage = true;
            return;
        } 

        if ($scope.data.serviceLocation.capabilities) { //if service got capabilities from the address typeahead, i.e. TX or GA
            $scope.data.serviceLocation.capabilities = _.filter($scope.data.serviceLocation.capabilities, function (cap) { return cap.capabilityType != "ServiceStatus" && cap.capabilityType != "CustomerType"; });
        }
        else {
            $scope.data.serviceLocation = {
                address: {
                    line1: "line1",
                    city: "city",
                    stateAbbreviation: $scope.data.serviceState,
                    postalCode5: $scope.data.serviceLocation.address.postalCode5
                },
                capabilities: []
            };
            if ($scope.data.serviceState === "NJ") {
                $scope.data.serviceLocation.capabilities.push({ "capabilityType": "NewJerseyElectricity" });
                $scope.data.serviceLocation.capabilities.push({ "capabilityType": "NewJerseyGas" });
            }
        }
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

    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec($location.absUrl());
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
}]);