ngApp.controller('MobileEnrollmentConfigureDataCtrl', ['$scope', '$modal', 'uiGmapGoogleMapApi','uiGmapIsReady', '$http', 'enrollmentService', 'enrollmentStepsService', 'enrollmentCartService', 'analytics', function ($scope, $modal, uiGmapGoogleMapApi, uiGmapIsReady, $http, enrollmentService, enrollmentStepsService, enrollmentCartService, analytics) {

    $scope.currentMobileLocationInfo = enrollmentCartService.getActiveService;
    $scope.cartDevices = enrollmentCartService.getCartDevices;
    $scope.formFields = {
        chosenPlanId: undefined
    };
    var activeServiceIndex = enrollmentCartService.getActiveServiceIndex;
    $scope.requestedPlanAvailable = false;
    $scope.showChangeLocation = $scope.geoLocation.postalCode5 == '';
    $scope.excludedStates = false;
    $scope.zipCodeInvalid = false;
    $scope.enrollmentStepsService = enrollmentStepsService;
    $scope.itemIndex = 0;

    $scope.$watch("cartDevices().length", function (newVal, oldVal) {
        if (newVal != oldVal) {
            $scope.phoneOptions = $scope.cartDevices()[activeServiceIndex()];
            $scope.selectedPlan = {};
        }
    });

    $scope.$watch(enrollmentCartService.getActiveService, function (newVal, oldVal) {
        if (newVal != oldVal) {
            $scope.phoneOptions = $scope.cartDevices()[activeServiceIndex()];
        }
    });

    var coverageMap = angular.element(document.getElementsByClassName('coverage-map-container'));
    var dataCalculator = angular.element(document.getElementsByClassName('data-calculator-container'));

    $scope.filterPlans = function (plan) {
        return plan.displayPlan;
    };

    $scope.totalPlanPrice = enrollmentCartService.totalPlanPrice;

    $scope.phoneNumberDisabled = function () {
        if ($scope.phoneOptions) {
            return $scope.phoneOptions.showIccid && ($scope.phoneOptions.phoneOS == null ||
                (($scope.configureData.iccid.$invalid || $scope.phoneOptions.missingIccid) &&
                $scope.phoneOptions.phoneOS != 'Apple') ||
                (($scope.configureData.iccid.$invalid && !$scope.phoneOptions.missingIccid) &&
                $scope.phoneOptions.phoneOS == 'Apple'));
        }
        else {
            return false;
        }
    };

    $scope.selectPlan = function (planID) {
        var i = _.findIndex($scope.currentMobileLocationInfo().offerInformationByType[0].value.availableOffers, function (o) {
            return _(o.id).contains(planID);
        }),
        plan = $scope.currentMobileLocationInfo().offerInformationByType[0].value.availableOffers[i];
        if (typeof plan != 'undefined') {
            $scope.selectedPlan = plan;
            if ($scope.currentMobileLocationInfo().offerInformationByType[0].value.offerSelections.length != 0) {
                $scope.currentMobileLocationInfo().offerInformationByType[0].value.offerSelections[0].offer = plan;
                $scope.currentMobileLocationInfo().offerInformationByType[0].value.offerSelections[0].offerId = plan.id;
            }
            else {
                $scope.currentMobileLocationInfo().offerInformationByType[0].value.offerSelections.push({
                    offer: plan,
                    offerId: plan.id
                });
            }
        }
    };

    var addNewService = function () {
        var location = {
            address: {
                city: $scope.data.serviceLocation.address.city,
                line1: "",
                postalCode5: $scope.data.serviceLocation.address.postalCode5,
                stateAbbreviation: $scope.data.serviceLocation.address.stateAbbreviation
            },
            capabilities: $scope.data.serviceLocation.capabilities
        };
        var offerInfo = [{
            key: "Mobile",
            value: {
                availableOffers: $scope.availableOffers,
                errors: [],
                offerSelections: []
            }
        }];
        enrollmentCartService.addService({
            eligibility: "success",
            location: location,
            offerInformationByType: offerInfo
        });
    };

    $scope.toggleInternational = function () {
        var i = 0;
        if ($scope.selectedPlan.includesInternational) {
            i = _.findIndex($scope.currentMobileLocationInfo().offerInformationByType[0].value.availableOffers, function (o) {
                if (!o.includesInternational) {
                    return _.isEqual(o.data, $scope.selectedPlan.data) && o.withAutoPayID === "";
                }
            });
        }
        else {
            i = _.findIndex($scope.currentMobileLocationInfo().offerInformationByType[0].value.availableOffers, function (o) {
                if (o.includesInternational) {
                    return _.isEqual(o.data, $scope.selectedPlan.data) && o.withAutoPayID === "";
                }
            });
        }
        var plan = $scope.currentMobileLocationInfo().offerInformationByType[0].value.availableOffers[i];
        $scope.selectedPlan = plan;
        $scope.currentMobileLocationInfo().offerInformationByType[0].value.offerSelections[0].offer = plan;
        $scope.currentMobileLocationInfo().offerInformationByType[0].value.offerSelections[0].offerId = plan.id;
    }

    $scope.editDevice = function (saveIMEI) {
        if (saveIMEI) {
            enrollmentService.editPhoneIMEI = angular.copy($scope.phoneOptions.imeiNumber);
        }
        enrollmentCartService.removeDeviceFromCart($scope.phoneOptions);
        enrollmentCartService.removeService(enrollmentCartService.getActiveService())
        enrollmentService.setSelectedOffers().then(
            function(value) {
                addNewService();
                enrollmentStepsService.setStep('phoneFlowDevices');
                enrollmentStepsService.hideStep('phoneFlowPlans');
            });

    }

    $scope.addUtilityAddress = function () {
        // save the mobile offer selections
        enrollmentService.setMobileOffers();

        if(enrollmentCartService.getCartVisibility()) {
            enrollmentCartService.toggleCart();
        }
        enrollmentCartService.setActiveService();
        enrollmentStepsService.setFlow('utility', true).setFromServerStep('serviceInformation');
    };

    $scope.completeStep = function (addLine) {
        if ($scope.phoneOptions.missingIccid) {
            $scope.phoneOptions.iccidNumber = null;
        }
        var offer = [{
            offerId: $scope.selectedPlan.id,
            offer: $scope.selectedPlan,
            offerOption: {
                optionType: 'Mobile'
            }
        }];
        var offerSelections = [{
            offerId: $scope.selectedPlan.id,
            offerOption: {
                optionType: 'Mobile',
                activationDate: new Date(),
                esnNumber: $scope.phoneOptions.imeiNumber,
                imeiNumber: $scope.phoneOptions.imeiNumber,
                iccidNumber: $scope.phoneOptions.iccidNumber,
                inventoryItemId: $scope.selectedPlan.mobileInventory[0].id,
                activeDevice: $scope.phoneOptions.activeDevice,
                transferInfo: ($scope.phoneOptions.transferInfo.type == "new") ? null : $scope.phoneOptions.transferInfo
            }
        }];

        //all analytics
        analytics.sendVariables(
            2, 'sprint',
            3, $scope.selectedPlan.data,
            4, 1,
            5, ($scope.phoneOptions.type == "new") ? "New Number" : "Transfer",
            9, $scope.selectedPlan.id,
            16, $scope.phoneOptions.imeiNumber,
            18, $scope.phoneOptions.phoneOS,
            19, $scope.phoneOptions.iccidNumber);

        $scope.currentMobileLocationInfo().offerInformationByType[0].value.offerSelections = offerSelections;
        $scope.currentMobileLocationInfo().location.address.line1 = angular.copy($scope.phoneOptions.imeiNumber);
        if (addLine) {
            addNewService();
            enrollmentStepsService.setStep('phoneFlowDevices');
            enrollmentStepsService.hideStep('phoneFlowPlans');
        }
        else {
            enrollmentService.setAccountInformation();
            $scope.selectedPlan = {};
        }
    };

    $scope.showModal = function (templateUrl, size) {
        $modal.open({
            'scope': $scope,
            'templateUrl': templateUrl,
            'size': size ? size : ''
        })
    };

    $scope.showCoverageMapOverlay = function () {
        coverageMap.removeClass('hidden-map');
        var center = $scope.mapInstance.getCenter();
        google.maps.event.trigger($scope.mapInstance, 'resize');
        $scope.mapInstance.setCenter(center);
        $scope.selectedNetwork = 'sprint';
        $scope.mapInstance.selectedNetwork = 'sprint';
    };
    $scope.showCalculator = function () {
        dataCalculator.removeClass('hidden');
    }
    $scope.lookupZip = function () {
        if ($scope.lookupZipForm.$valid) {
            enrollmentService.isLoading = true;
            analytics.sendVariables(1, $scope.postalCode5);
            $http.get('/api/addresses/lookupZip/' + $scope.postalCode5)
            .success(function (data) {
                enrollmentService.isLoading = false;
                $scope.showChangeLocation = false;
                if (data.length != 0) {
                    $scope.geoLocation = {
                        city: data[0],
                        state: data[1],
                        postalCode5: $scope.postalCode5
                    };
                    $scope.data.serviceLocation.address = {
                        line1: $scope.phoneOptions.imeiNumber,
                        city: data[0],
                        stateAbbreviation: data[1],
                        postalCode5: $scope.postalCode5
                    };
                    $scope.data.serviceLocation.capabilities = [{ "capabilityType": "ServiceStatus", "enrollmentType": "moveIn" }];
                    $scope.data.serviceLocation.capabilities.push({ "capabilityType": "CustomerType", "customerType": "residential" });
                    $scope.data.serviceLocation.capabilities.push({ "capabilityType": "Mobile" });

                    var activeService = enrollmentCartService.getActiveService();
                    $scope.excludedStates = _($scope.mobileEnrollmentSettings.excludedStates).contains(data[1]);
                    $scope.zipCodeInvalid = false;
                    if (activeService && !$scope.excludedState) {
                        activeService.location = $scope.data.serviceLocation;
                        enrollmentService.setSelectedOffers(true).then(function () {
                            $scope.availableOffers = enrollmentCartService.getActiveService().offerInformationByType[0].value.availableOffers;
                            if ($scope.mobileEnrollment.requestedPlanId != "") {
                                $scope.selectPlan($scope.mobileEnrollment.requestedPlanId);
                            }
                        }, function(){
                            console.log("no available offers")
                        });
                    }
                    else {
                        enrollmentCartService.addService({ location: $scope.data.serviceLocation });
                        enrollmentService.setServiceInformation(true);
                        activeService = enrollmentCartService.getActiveService();
                    }
                }
                else {
                    $scope.showNetworks = false;
                    $scope.showChangeLocation = true;
                    $scope.zipCodeInvalid = true;
                }
            })
        } else {
            $scope.showChangeLocation = true;
            $scope.zipCodeInvalid = true;
        }
    };

    var ARCOverlay = function (key, layer, opacity) {
        return new google.maps.ImageMapType({
            isPng: true,
            opacity: opacity,
            tileSize: new google.maps.Size(256, 256),

            getTileUrl: function (coord, zoom) {
                var bounds = $scope.mapInstance.getBounds().toJSON();
                var output = bounds.west + " " + bounds.south + " " + bounds.east + " " + bounds.north;

                var url = "/api/mapserver/tile/" + coord.x + "," + coord.y + "," + zoom + "/";
                var layers = layer.split(",");
                for (var i = 0; i < layers.length; i++) {
                    url += (i > 0 ? "," : "") + layers[i];
                }

                return url;
            }
        });
    };

    $scope.searchbox = {
        template: 'searchbox.tpl.html',
        events: {
            places_changed: function (searchBox) {
                $scope.mapInstance.setCenter(searchBox.getPlaces()[0].geometry.location);
                if (searchBox.getPlaces()[0].geometry.viewport) {
                    $scope.mapInstance.fitBounds(searchBox.getPlaces()[0].geometry.viewport);
                } else {
                    $scope.mapInstance.setZoom(15);
                }
            }
        }
    };

    $scope.layers = {
            sprint_voice_roam: true,
            sprint_data_roam: true,
            sprint_lte: true
    };
    $scope.superCents = function (planCost) {
        if (planCost == null) return null;
        var array = planCost.toString().split('.');
        var planCostFinal = "";
        if (array.length > 1 && array[1] != "00") {
            if (array[1].length == 1) {
                array[1] = array[1] + "0";
            }

            planCostFinal = '$' + array[0] + "<sup>." + array[1] + "</sup>";
        } else {
            planCostFinal = '$' + array[0];
        }
        return planCostFinal;
    }

    $scope.map = {
        center: { latitude: 38.850033, longitude: -98.6500523 },
        zoom: 4,
        options: {
            disableDefaultUI: false,
            scrollwheel: false,
            panControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            styles: [{ "featureType": "poi", "stylers": [{ "visibility": "off" }] }, { "stylers": [{ "saturation": -70 }, { "lightness": 37 }, { "gamma": 1.15 }] }, { "elementType": "labels", "stylers": [{ "gamma": 0.26 }, { "visibility": "off" }] }, { "featureType": "road", "stylers": [{ "lightness": 0 }, { "saturation": 0 }, { "hue": "#ffffff" }, { "gamma": 0 }] }, { "featureType": "road", "elementType": "labels.text.stroke", "stylers": [{ "visibility": "off" }] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "lightness": 20 }] }, { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "lightness": 50 }, { "saturation": 0 }, { "hue": "#ffffff" }] }, { "featureType": "administrative.province", "stylers": [{ "visibility": "on" }, { "lightness": -50 }] }, { "featureType": "administrative.province", "elementType": "labels.text.stroke", "stylers": [{ "visibility": "off" }] }, { "featureType": "administrative.province", "elementType": "labels.text", "stylers": [{ "lightness": 20 }] }] // https://snazzymaps.com/style/19/subtle
        },
        events: {
            tilesloaded: function (map) {
                $scope.$apply(function () {
                    $scope.mapInstance = map;
                    $scope.$parent.mapInstance = map;
                });
            }
        }
    };

    $scope.$watch('mapInstance', function (newVal, oldVal) {
        if (newVal) {
            $scope.updateMapLayers();
        }
    });

    $scope.$watch('layers', function (newVal, oldVal) {
        $scope.updateMapLayers();
    }, true);

    $scope.updateMapLayers = function () {
        var layers = [];
        angular.forEach($scope.layers, function (value, key) {
            if (value == true) {
                layers.push(key);
            }
        });
        if ($scope.mapInstance) {
            $scope.mapInstance.overlayMapTypes.clear();

            if (layers.length) {
                var opacity = .35;
                if (layers.length == 2) {
                    opacity = .50;
                } else if (layers.length == 1) {
                    opacity = .75;
                }
                for (var i = 0, layer; layer = layers[i]; i++) {
                    $scope.mapInstance.overlayMapTypes.setAt(i, new ARCOverlay('d8bfd6a09d07263c52ecb75b5a470a90', layer, opacity));
                }
            }
        }
    };
}]);