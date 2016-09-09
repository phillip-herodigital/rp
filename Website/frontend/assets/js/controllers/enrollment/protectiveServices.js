/* Protective Services Enrollment Controller */
ngApp.controller('protectiveServicesEnrollmentCtrl', ['$scope', '$http', '$location', 'enrollmentService', 'enrollmentCartService', 'analytics', function ($scope, $http, $location, enrollmentService, enrollmentCartService, analytics) {
    $scope.services = [
        {
            id: 0,
            name: 'Virtual MD',
            description: 'Access a doctor',
            showDetails: false,
            selected: false,
            details: ['do thing 1', 'do thing 2', 'do thing 3']
        },
        {
            id: 1,
            name: 'Roadside',
            description: 'Access a doctor',
            showDetails: false,
            selected: false,
            details: ['do thing 1', 'do thing 2', 'do thing 3']
        },
        {
            id: 2,
            name: 'Identity',
            description: 'Access a doctor',
            showDetails: false,
            selected: false,
            details: ['do thing 1', 'do thing 2', 'do thing 3']
        },
        {
            id: 3,
            name: 'Credit',
            description: 'Access a doctor',
            showDetails: false,
            selected: false,
            details: ['do thing 1', 'do thing 2', 'do thing 3']
        },
        {
            id: 4,
            name: 'Tech Support',
            description: 'Access a doctor',
            showDetails: false,
            selected: false,
            details: ['do thing 1', 'do thing 2', 'do thing 3']
        }
    ];
    $scope.showChangeLocation = $scope.geoLocation.postalCode5 == '';


    $scope.init = function () {
        if (!$scope.showChangeLocation) {
            $scope.serviceLocation = {};
            enrollmentCartService.addService({
                eligibility: "success",
                location: {
                    address: {
                        city: $scope.geoLocation.city,
                        line1: "",
                        postalCode5: $scope.geoLocation.postalCode5,
                        stateAbbreviation: $scope.geoLocation.stateAbbreviation
                    },
                    capabilities: $scope.serviceLocation.capabilities
                },
                offerInformationByType: [{
                    key: "Mobile",
                    value: {
                        availableOffers: $scope.currentMobileLocationInfo().offerInformationByType[0].value.availableOffers,
                        errors: [],
                        offerSelections: []
                    }
                }]
            });
        }
        var queryPlanID = getParameterByName('PlanID');
        if (queryPlanID) {
            $scope.selectService(queryPlanID);
        }
    }

    $scope.selectService = function (id) {
        angular.forEach($scope.services, function (service) {
            if (service.id === id) {
                enrollmentCartService.addService({})
            }
        });
    }

    $scope.completeStep = function () {
    }

    $scope.lookupZip = function () {
        if ($scope.lookupZipForm.$valid) {
            $scope.isLoading = true;
            analytics.sendVariables(1, $scope.postalCode5);
            $http.get('/api/addresses/lookupZip/' + $scope.postalCode5)
            .success(function (data) {
                $scope.isLoading = false;
                $scope.showChangeLocation = false;
                $scope.serviceLocation = {};
                if (data.length) {
                    analytics.sendTags({
                        EnrollmentZipCode: $scope.postalCode5,
                        EnrollmentCity: data[0],
                        EnrollmentState: data[1]
                    });
                    $scope.geoLocation = {
                        city: data[0],
                        state: data[1],
                        postalCode5: $scope.postalCode5
                    };
                    $scope.serviceLocation.address = {
                        line1: "",
                        city: data[0],
                        stateAbbreviation: data[1],
                        postalCode5: $scope.postalCode5
                    };
                    $scope.serviceLocation.capabilities = [{ "capabilityType": "ServiceStatus", "enrollmentType": "moveIn" }];
                    $scope.serviceLocation.capabilities.push({ "capabilityType": "CustomerType", "customerType": "residential" });
                    $scope.serviceLocation.capabilities.push({ "capabilityType": "Protective" });

                    var activeService = enrollmentCartService.getActiveService();
                    $scope.zipCodeInvalid = false;
                    if (activeService) {
                        activeService.location = $scope.serviceLocation;
                        enrollmentService.setSelectedOffers(true).then(function () {
                            if ($scope.mobileEnrollment.requestedPlanId != "") {
                                $scope.selectPlan($scope.mobileEnrollment.requestedPlanId);
                            }
                        }, function () {
                            console.log("no available offers")
                        });
                    }
                    else {
                        enrollmentCartService.addService({ location: $scope.serviceLocation });
                        enrollmentService.setServiceInformation(true);
                        activeService = enrollmentCartService.getActiveService();
                    }
                }
                else {
                    $scope.showChangeLocation = true;
                    $scope.zipCodeInvalid = true;
                }
            })
        } else {
            $scope.showChangeLocation = true;
            $scope.zipCodeInvalid = true;
        }
    };

    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec($location.absUrl());
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
}]);