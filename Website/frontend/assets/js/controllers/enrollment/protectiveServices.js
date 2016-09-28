/* Protective Services Enrollment Controller */
ngApp.controller('protectiveServicesEnrollmentCtrl', ['$scope', '$http', '$location', 'enrollmentService', 'enrollmentCartService', 'analytics', function ($scope, $http, $location, enrollmentService, enrollmentCartService, analytics) {
    $scope.showChangeLocation = $scope.geoLocation.country == '';
    $scope.getActiveService = enrollmentCartService.getActiveService;

    $scope.init = function () {
        $scope.queryPlanID = getParameterByName('PlanID');
        if (!$scope.showChangeLocation) {
            $scope.currentState = _.find($scope.stateNames, function (state) {
                return state.abbreviation === $scope.geoLocation.state;
            }).display;
        }
        addUpdateService();
    }

    $scope.getInfo = function () {
        var stuff = $scope.usStates;
        var thing = enrollmentCartService;
        return $scope.getActiveService();
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
        return _.some(offer.videoConferenceStates, function (videoConferenceState) {
            return videoConferenceState === $scope.geoLocation.state;
        });
    }

    $scope.selectOffer = function (offer) {
        if ($scope.getActiveService().offerInformationByType[0].value.offerSelections.length && $scope.getActiveService().offerInformationByType[0].value.offerSelections[0].subOffers) {
            $scope.getActiveService().offerInformationByType[0].value.offerSelections[0].subOffers.push({
                offer: offer,
                offerId: offer.id,
            });
        }
        else {
            $scope.getActiveService().offerInformationByType[0].value.offerSelections[0] = {
                subOffers: [{
                    offer: offer,
                    offerId: offer.id,
                }]
            };
        }
    }

    $scope.removeOffer = function (offerId) {
        _.remove($scope.getActiveService().offerInformationByType[0].value.offerSelections[0].subOffers, function (subOffer) {
            return subOffer.offerId === offerId;
        });
    }

    $scope.getOfferPrice = function (offerId) {
        return _.find($scope.services, function (offer) {
            return offer.id === offerId;
        }).price;
    }

    $scope.selectAssociatedOffer = function (offer) {
        $scope.selectOffer(_.find($scope.getActiveService().offerInformationByType[0].value.availableOffers, function (availableOffer) {
            return availableOffer.id === offer.associatedOfferId;
        }));
    }

    $scope.offerSelected = function (id) {
        if ($scope.getActiveService().offerInformationByType[0].value.offerSelections.length) {
            return _.some($scope.getActiveService().offerInformationByType[0].value.offerSelections[0].subOffers, function (subOffer) {
                return subOffer.offerId === id;
            });
        }
        else return false;
    }

    $scope.showgroupOffers = function () {
        return _.every($scope.getActiveService().offerInformationByType[0].value.offerSelections[0].subOffers, function (subOffer) {
            return typeof (subOffer.offer.groupOffer) === 'undefined';
        });
    }

    $scope.isFormValid = function () {
        return enrollmentCartService.getCartCount() > 0.
    }

    $scope.completeStep = function () {
        $scope.getActiveService().offerInformationByType[0].value.offerSelections[0].offerOption = {
            optionType: 'Protective'
        };
        var product = _.find($scope.getActiveService().offerInformationByType[0].value.availableOffers, function (availableOffer) {
            if (availableOffer.subOfferGuids.length === $scope.getActiveService().offerInformationByType[0].value.offerSelections[0].subOffers.length) {
                return _.every($scope.getActiveService().offerInformationByType[0].value.offerSelections[0].subOffers, function (subOffer) {
                    return _.some(availableOffer.subOfferGuids, function (subOfferGuid) {
                        return subOfferGuid === subOffer.offer.guid;
                    });
                });
            }
            else return false
        });
        $scope.getActiveService().offerInformationByType[0].value.offerSelections[0].offerId = product.id;
        enrollmentService.setSelectedOffers(true).then(enrollmentService.setAccountInformation());
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