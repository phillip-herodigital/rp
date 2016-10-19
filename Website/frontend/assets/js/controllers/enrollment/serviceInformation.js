/* Enrollment Service Information Controller
 *
 * This is used to control aspects of let's get started on enrollment page.
 */
ngApp.controller('EnrollmentServiceInformationCtrl', ['$scope', '$http', '$location', '$filter', 'enrollmentService', 'enrollmentCartService', 'enrollmentStepsService', 'analytics', function ($scope, $http, $location, $filter, enrollmentService, enrollmentCartService, enrollmentStepsService, analytics) {

    if (!$scope.data || !$scope.data.serviceState) {
        var state = getParameterByName("St")
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
        if (state === "TX" || state === "GA") {
            return $scope.$parent.getLocation(state, val).then(function (values) {
                $scope.errorMessage = !values.length;
                return values;
            });
        }
        else {
            return $http.get("/api/addresses/TypeAhead/" + val + "/" + state).then(function (value) {
                $scope.errorMessage = !value.data.length;
                return value.data;
            }, function (error) {
                console.log("typeahead error")
            });
        }
    };

    $scope.selectTypeAheadAddress = function (input) {
        $scope.isLoading = true;
        $http.get("/api/addresses/StreetAddressLookup/" + input).then(function (value) {
            $scope.isLoading = false;
            $scope.errorMessage = !value.data.location;
            if (value.data.location) {
                $scope.commercialAddress = value.data.metadata.rdi != "Residential";
                if (value.data.metadata.rdi === "Residential")
                {
                    $scope.data.serviceLocation = value.data.location;
                    $scope.showLine2 = value.data.metadata.record_type === "H";
                }
            }
        }, function (error) {
            $scope.isLoading = false;
            console.log("address lookup error")
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
        $scope.typeAheadModel = null;
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
                return typeof $scope.data.serviceLocation === 'object';
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

        if ($scope.data.serviceLocation.capabilities) {
            $scope.data.serviceLocation.capabilities = _.filter($scope.data.serviceLocation.capabilities, function (cap) { return cap.capabilityType != "ServiceStatus" && cap.capabilityType != "CustomerType"; });
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