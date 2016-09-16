/* Protective Services Enrollment Controller */
ngApp.controller('protectiveServicesEnrollmentCtrl', ['$scope', '$http', '$location', 'enrollmentService', 'enrollmentCartService', 'analytics', function ($scope, $http, $location, enrollmentService, enrollmentCartService, analytics) {
    $scope.showChangeLocation = $scope.geoLocation.postalCode5 == '';
    $scope.getActiveService = enrollmentCartService.getActiveService;

    $scope.init = function () {
        $scope.queryPlanID = getParameterByName('PlanID');
        if (!$scope.showChangeLocation) {
            addUpdateService();
        }
    }

    $scope.getInfo = function () {
        var stuff = $scope.usStates;
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
        else return true;
    }

    $scope.selectOffer = function (offer) {
        if (offer.isGroupOffer || offer.hasGroupOffer) {
            _.remove($scope.getActiveService().offerInformationByType[0].value.offerSelections, function (offerSelection) {
                return offerSelection.offerId === offer.associatedOfferId;
            });
        }
        $scope.getActiveService().offerInformationByType[0].value.offerSelections.push({
            offer: offer,
            offerId: offer.id,
            offerOption: {
                optionType: 'Protective'
            }
        });
        enrollmentService.setSelectedOffers(true);
    }

    $scope.removeOffer = function (offerId) {
        _.remove($scope.getActiveService().offerInformationByType[0].value.offerSelections, function (offerSelection) {
            return offerSelection.offerId === offerId;
        });
        enrollmentService.setSelectedOffers(true);
    }

    $scope.getOfferPrice = function (offerId) {
        return _.find($scope.getActiveService().offerInformationByType[0].value.availableOffers, function (offer) {
            return offer.id === offerId;
        }).price;
    }

    $scope.selectAssociatedOffer = function (offer) {
        $scope.selectOffer(_.find($scope.getActiveService().offerInformationByType[0].value.availableOffers, function (availableOffer) {
            return availableOffer.id === offer.associatedOfferId;
        }));
    }

    $scope.offerSelected = function (id) {
        return _.some($scope.getActiveService().offerInformationByType[0].value.offerSelections, function (offer) {
            return offer.offerId === id;
        });
    }

    $scope.showgroupOffers = function () {
        return _.every($scope.getActiveService().offerInformationByType[0].value.offerSelections, function (offerSelection) {
            return typeof (offerSelection.offer.groupOffer) === 'undefined';
        });
    }

    $scope.isFormValid = function () {
        return enrollmentCartService.getCartCount() > 0.
    }

    $scope.completeStep = function () {
        enrollmentService.setAccountInformation();
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
        $scope.currentState = _.find($scope.usStates, function (state) {
            return state.abbreviation === $scope.geoLocation.state;
        }).display;
        if (activeService) {
            activeService.location = location;
            return enrollmentService.setServiceInformation(true);
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