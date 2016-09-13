/* Protective Services Enrollment Controller */
ngApp.controller('protectiveServicesEnrollmentCtrl', ['$scope', '$http', '$location', 'enrollmentService', 'enrollmentCartService', 'analytics', function ($scope, $http, $location, enrollmentService, enrollmentCartService, analytics) {
    $scope.getCartServices = enrollmentCartService.getCartServices;
    $scope.showChangeLocation = $scope.geoLocation.postalCode5 == '';
    $scope.getActiveService = enrollmentCartService.getActiveService;
    $scope.showgroupOffers = false;

    $scope.init = function () {
        $scope.queryPlanID = getParameterByName('PlanID');
        addUpdateService().then(function () {
            if ($scope.queryPlanID) {
                $scope.selectService($scope.queryPlanID);
            }
        }, function () { });
    }

    $scope.zipCodeRegex = "^[0-9]{5}$";

    $scope.selectOffer = function (offer) {
        $scope.getActiveService().offerInformationByType[0].value.offerSelections.push({
            offer: offer,
            offerId: offer.id
        });
        if (offer.groupOffer) $scope.showgroupOffers = true;
        enrollmentService.setSelectedOffers(false);
    }

    $scope.removeOffer = function (offerId) {
        _.remove($scope.getActiveService().offerInformationByType[0].value.offerSelections, function (offerSelection) {
            return offerSelection.offerId === offerId;
        });
        if (_.every($scope.getActiveService().offerInformationByType[0].value.offerSelections, function(offerSelection) {
            return typeof (offerSelection.offer.groupOffer) === 'undefined';
        })) $scope.showgroupOffers = false;
        enrollmentService.setSelectedOffers(false);
    }

    $scope.offerSelected = function (id) {
        return _.some($scope.getActiveService().offerInformationByType[0].value.offerSelections, function (offer) {
            return offer.offerId === id;
        });
    }

    $scope.getInfo = function () {
        return $scope.getCartServices();
    }

    $scope.isFormValid = function () {
        return enrollmentCartService.getCartCount() > 0.
    }

    $scope.completeStep = function () {
    }

    var addUpdateService = function () {
        var location = {
            address: {
                line1: "",
                city: $scope.geoLocation.city,
                stateAbbreviation: $scope.geoLocation.state,
                postalCode5: $scope.geoLocation.postalCode5
            },
            capabilities: [
                { "capabilityType": "ServiceStatus", "enrollmentType": "moveIn" },
                { "capabilityType": "CustomerType", "customerType": "residential" },
                { "capabilityType": "Protective" }]
        }, activeService = enrollmentCartService.getActiveService();
        if (activeService) {
            activeService.location = location;
            return enrollmentService.setSelectedOffers(false);
        }
        else {
            enrollmentCartService.addService({
                eligibility: "success",
                location: location,
                offerInformationByType: [{
                    key: "Protective",
                    value: {
                        availableOffers: [],
                        errors: [],
                        offerSelections: []
                    }
                }]
            });
            return enrollmentService.setServiceInformation(false);
        }
    }

    $scope.lookupZip = function () {
        if ($scope.lookupZipForm.$valid) {
            $scope.isLoading = true;
            analytics.sendVariables(1, $scope.postalCode5);
            $http.get('/api/addresses/lookupZip/' + $scope.postalCode5)
            .success(function (data) {
                $scope.isLoading = false;
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
                    $scope.zipCodeInvalid = false;
                    $scope.showChangeLocation = false;
                    addUpdateService().then(function () {
                        if ($scope.queryPlanID) {
                            $scope.selectService($scope.queryPlanID);
                        }
                    }, function () { });
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