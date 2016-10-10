/* Protective Services Enrollment Controller */
ngApp.controller('protectiveServicesEnrollmentCtrl', ['$scope', '$http', '$location', 'enrollmentService', 'enrollmentCartService', 'analytics', function ($scope, $http, $location, enrollmentService, enrollmentCartService, analytics) {
    $scope.showChangeLocation = $scope.geoLocation.country == '';
    $scope.getActiveService = enrollmentCartService.getActiveService;
    $scope.removeOffer = enrollmentCartService.removeProtectiveOffer;

    $scope.init = function () {
        $scope.queryPlanID = getParameterByName('PlanID');
        if (!$scope.showChangeLocation) {
            $scope.currentState = _.find($scope.stateNames, function (state) {
                return state.abbreviation === $scope.geoLocation.state;
            }).display;
        }
        addUpdateService();
    }

    $scope.displayOffer = function (offer) {
        if (offer.isGroupOffer || offer.hasGroupOffer) {
            if (offer.hasGroupOffer) {
                return !$scope.offerSelected(offer.associatedOfferId);
            }
            else {
                return $scope.offerSelected(offer.id);
            }
        }
        else {
            return true;
        }
    }

    $scope.isExcludedState = function (offer) {
        return _.some(offer.excludedStates, function (excludedState) {
            return excludedState === $scope.geoLocation.state;
        });
    }

    $scope.isVideoConferenceState = function (offer) {
        return enrollmentService.isVideoConferenceState(offer, $scope.geoLocation);
    }

    $scope.selectOffer = function (offer) {
        if ($scope.getActiveService().offerInformationByType[0].value.offerSelections.length && $scope.getActiveService().offerInformationByType[0].value.offerSelections[0].offer) {
            var subOffers = angular.copy($scope.getActiveService().offerInformationByType[0].value.offerSelections[0].offer.suboffers);
            subOffers.push(offer);
            $scope.getActiveService().offerInformationByType[0].value.offerSelections[0] = {
                offer: {
                    suboffers: subOffers
                }
            };
        }
        else {
            $scope.getActiveService().offerInformationByType[0].value.offerSelections[0] = {
                offer: {
                    suboffers: [offer]
                }
            };
        }
    }


    $scope.getOfferPrice = function (offerId) {
        return _.find($scope.services, function (offer) {
            return offer.id === offerId;
        }).price;
    }

    $scope.selectAssociatedOffer = function (offer) {
        $scope.selectOffer(_.find($scope.services, function (service) {
            return service.id === offer.associatedOfferId;
        }));
    }

    $scope.offerSelected = function (id) {
        if ($scope.getActiveService().offerInformationByType[0].value.offerSelections.length && $scope.getActiveService().offerInformationByType[0].value.offerSelections[0].offer) {
            return _.some($scope.getActiveService().offerInformationByType[0].value.offerSelections[0].offer.suboffers, function (suboffer) {
                return suboffer.id === id;
            });
        }
        else return false;
    }

    $scope.isFormValid = function () {
        return enrollmentCartService.getCartCount() > 0.
    }

    $scope.completeStep = function () {
        $scope.getActiveService().offerInformationByType[0].value.offerSelections[0].offerOption = { optionType: 'Protective' };
        $scope.getActiveService().offerInformationByType[0].value.offerSelections[0].offerId = enrollmentCartService.findProtectiveProduct().id;
        enrollmentService.setSelectedOffers().then(function (value) { enrollmentService.setAccountInformation() });
    }

    var addUpdateService = function () {
        var location = {
            address: {
                line1: "Line1",
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
            enrollmentService.setServiceInformation(true);
        }
        else {
            enrollmentCartService.addService({
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
            enrollmentService.setServiceInformation(true).then(function success () {
                if ($scope.queryPlanID) {
                    $scope.selectService($scope.queryPlanID);
                }
            }, function error () {
                //handle errors
            });
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
                    $scope.currentState = data[2];
                    $scope.zipCodeInvalid = false;
                    $scope.showChangeLocation = false;
                    addUpdateService();
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