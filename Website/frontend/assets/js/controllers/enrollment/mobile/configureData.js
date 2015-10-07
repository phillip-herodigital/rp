ngApp.controller('MobileEnrollmentConfigureDataCtrl', ['$scope', '$filter', '$modal', 'uiGmapGoogleMapApi','uiGmapIsReady', '$location', 'jQuery', '$http', 'enrollmentService', 'mobileEnrollmentService', 'enrollmentStepsService', 'enrollmentCartService', 'analytics', function ($scope, $filter, $modal, uiGmapGoogleMapApi,uiGmapIsReady, $location, jQuery, $http, enrollmentService, mobileEnrollmentService, enrollmentStepsService, enrollmentCartService, analytics) {

    $scope.mobileEnrollmentService = mobileEnrollmentService;
    $scope.currentMobileLocationInfo = enrollmentCartService.getActiveService;
    $scope.getDevicesCount = enrollmentCartService.getDevicesCount;
    $scope.formFields = {
        chosenPlanId: undefined
    };
    $scope.requestedPlanAvailable = false;
    $scope.showChangeLocation = $scope.geoLocation.postalCode5 == '';
    $scope.excludedStates = false;
    $scope.enrollmentStepsService = enrollmentStepsService;

    var coverageMap = $(jQuery.find(".coverage-map-container"));
    var dataCalculator = $(jQuery.find(".data-calculator-container"));

    $scope.filterIndPlans = function(plan){
        if (typeof mobileEnrollmentService.selectedNetwork != 'undefined') {
            var provider = mobileEnrollmentService.selectedNetwork.value,
                devicesCount = enrollmentCartService.getDevicesCount();
                firstDevice = enrollmentCartService.getCartDevices()[0];
            if (devicesCount == 0) {
                return null;
            } else {
                if (provider == "sprint" && !firstDevice.lte) {
                    return plan.provider.toLowerCase() == provider 
                    && !plan.isParentOffer 
                    && !plan.isChildOffer
                    && plan.nonLtePlan;
                } else {
                    return plan.provider.toLowerCase() == provider 
                    && !plan.isParentOffer 
                    && !plan.isChildOffer
                    && !plan.nonLtePlan;
                }
            } 
        } else {
            return null;
        }
    };

    $scope.filterGroupPlans = function(plan){
        if (typeof mobileEnrollmentService.selectedNetwork != 'undefined') {
            var provider = mobileEnrollmentService.selectedNetwork.value,
                devicesCount = enrollmentCartService.getDevicesCount();
                firstDevice = enrollmentCartService.getCartDevices()[0];
            if (devicesCount == 0) {
                return null;
            } else {
                if (provider == "sprint" && !firstDevice.lte) {
                    return plan.provider.toLowerCase() == provider 
                    && plan.isParentOffer 
                    && !plan.isChildOffer
                    && plan.nonLtePlan;
                } else {
                    return plan.provider.toLowerCase() == provider 
                    && plan.isParentOffer 
                    && !plan.isChildOffer
                    && !plan.nonLtePlan;;
                }
            }
        } else {
            return null;
        }
    };

    $scope.totalPlanPrice = enrollmentCartService.totalPlanPrice;

    $scope.$watch(enrollmentCartService.getActiveService, function (address) {
        $scope.planSelection = { selectedOffers: {} };
        if (address && address.offerInformationByType) {
            var devicesCount = enrollmentCartService.getDevicesCount();
            angular.forEach(address.offerInformationByType, function (entry) {
                if (entry.value && _(entry.key).contains('Mobile') && entry.value.offerSelections.length) {
                    $scope.planSelection.selectedOffers[entry.key] = entry.value.offerSelections[0].offerId;
                } else if (entry.value && _(entry.key).contains('Mobile') && entry.value.availableOffers.length == 1) {
                    $scope.planSelection.selectedOffers[entry.key] = entry.value.availableOffers[0].id;
                } else if (entry.value && _(entry.key).contains('Mobile')) {
                    $scope.selectRequestedPlan(devicesCount);
                }
            });
        }
    });

    // clear the plan selection when any device is added to the cart
    $scope.$watch(enrollmentCartService.getDevicesCount, function (newVal, oldVal) {
        if (newVal != oldVal) {
            if (newVal >= 2) {
                $scope.isIndSelected = false; 
                $scope.isGroupSelected = true;
            }
            // if 0 or 1 phone, reset the the selected offers. otherwise, trigger a plan selection
            if (newVal < 2 || typeof $scope.planSelection.selectedOffers.Mobile == 'undefined') {
                $scope.planSelection = { selectedOffers: {} };
            } else {
                // trigger a plan selection
                selectOffers($scope.planSelection.selectedOffers);
            }
            
            // see if the requested plan is available, and if so, select it
            $scope.selectRequestedPlan(newVal);
        }
    });

    //Once a plan is selected, check through all available and see if a selection happend
    $scope.$watchCollection('planSelection.selectedOffers', function (selectedOffers) {
        selectOffers(selectedOffers);
    });

    function selectOffers(selectedOffers) {
        if (enrollmentCartService.getDevicesCount() == 1) {
            enrollmentStepsService.setMaxStep('phoneFlowPlans');   
        }
          
        var activeService = enrollmentCartService.getActiveService();
        var activeServiceIndex = enrollmentCartService.getActiveServiceIndex();
        if (typeof activeService != 'undefined' && selectedOffers.Mobile != null) {
            // clear selected offers
            enrollmentCartService.selectOffers(_(selectedOffers).mapValues(function (offer) { return []; }).value());
            
            var offerInformationForType = _(activeService.offerInformationByType).where({ key: 'Mobile' }).first();
            var selectedOffer = _(offerInformationForType.value.availableOffers).find({ 'id': selectedOffers.Mobile });
            var offerId = selectedOffer.id;
            var childId = selectedOffer.childOfferId;
            var devices = enrollmentCartService.getCartDevices();

            analytics.sendVariables(3, selectedOffer.data, 4, devices.length);
            analytics.sendVariables(8, selectedOffer.id);

            // Add plan for each device, and add to the selected offers array
            for (var i = 0, len = devices.length; i < len; i++) {
                var device = devices[i];
                var offer = { offerId: (i == 0) ? offerId : childId };
                offer.offerOption = {
                    optionType: 'Mobile',
                    data: selectedOffer.data,
                    rates: selectedOffer.rates,
                    activationDate: new Date(),
                    phoneNumber: device.phoneNumber,
                    esnNumber: device.imeiNumber,
                    simNumber: device.simNumber,
                    imeiNumber: device.imeiNumber,
                    iccidNumber: device.iccidNumber,
                    inventoryItemId: device.id,
                    transferInfo: device.transferInfo,
                    useInstallmentPlan: (device.buyingOption == 'New' || device.buyingOption == 'Reconditioned' || device.buyingOption == 'BYOD') ? false : true,
                };
                offerInformationForType.value.offerSelections.push(offer);
            };
            _.find(enrollmentCartService.services[activeServiceIndex].offerInformationByType, function(offerType) {
                if (offerType.key == 'Mobile') {
                    offerType.value = offerInformationForType.value;
                }
            });
        }
    };

    $scope.editDevice = function() {
        $scope.setCurrentStep('choose-phone');
    };

    $scope.addUtilityAddress = function () {
        // save the mobile offer selections
        enrollmentService.setMobileOffers();

        if(enrollmentCartService.getCartVisibility()) {
            enrollmentCartService.toggleCart();
        }
        enrollmentCartService.setActiveService();
        enrollmentStepsService.setFlow('utility', true).setFromServerStep('serviceInformation');
    };

    $scope.completeStep = function() {
        enrollmentService.setAccountInformation();
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
        $scope.selectedNetwork = mobileEnrollmentService.selectedNetwork.value;
        $scope.mapInstance.selectedNetwork = mobileEnrollmentService.selectedNetwork.value;
    };
    $scope.showCalculator = function () {
        dataCalculator.removeClass('hidden');
    }

    $scope.selectRequestedPlan = function (devicesCount) {
        if ($scope.mobileEnrollment.requestedPlanId != '' && devicesCount > 0) {
            $scope.networkType = mobileEnrollmentService.selectedNetwork.value == 'att' ? 'GSM' : 'CDMA';
            var activeService = enrollmentCartService.getActiveService();
            var provider = mobileEnrollmentService.selectedNetwork.value
            var offerInformationForType = _(activeService.offerInformationByType).where({ key: 'Mobile' }).first();
            if (typeof offerInformationForType != 'undefined') {
                $scope.requestedPlanAvailable = _(offerInformationForType.value.availableOffers).filter(function (offer){
                    return offer.id == $scope.mobileEnrollment.requestedPlanId 
                        && offer.provider.toLowerCase() == provider 
                        && !offer.isChildOffer
                        && (devicesCount == 1 || (devicesCount > 1 && offer.isParentOffer)) 
                }).some();
                
                $scope.requestedPlanProvider = _(offerInformationForType.value.availableOffers).filter(function (offer){
                    return offer.id == $scope.mobileEnrollment.requestedPlanId 
                }).flatten().pluck('provider').first();
                
                $scope.requestedPlanNetwork = $scope.requestedPlanProvider == 'ATT' ? 'GSM' : 'CDMA';

                if ($scope.requestedPlanAvailable) {
                    var requestedOffer = { 'Mobile': $scope.mobileEnrollment.requestedPlanId };
                    $scope.planSelection.selectedOffers = requestedOffer;
                    selectOffers(requestedOffer);
                }
            }
        }
    };

    $scope.lookupZip = function () {
        enrollmentService.isLoading = true;
        analytics.sendVariables(1, $scope.postalCode5);
        $http.get('/api/addresses/lookupZip/' + $scope.postalCode5)
        .success(function (data) {
            enrollmentService.isLoading = false;
            $scope.showChangeLocation = false;
            if (data.length != 0) {
                mobileEnrollmentService.stateAbbreviation = data[1];
                mobileEnrollmentService.postalCode5 = $scope.postalCode5;
                $scope.geoLocation = {
                    city: data[0],
                    state: data[1],
                    postalCode5: $scope.postalCode5
                };

                $scope.data.serviceLocation.address = {
                    line1: 'Line1',
                    city: data[0],
                    stateAbbreviation: data[1],
                    postalCode5: $scope.postalCode5
                };
                $scope.data.serviceLocation.capabilities = [{ "capabilityType": "ServiceStatus", "enrollmentType": "moveIn" }];
                $scope.data.serviceLocation.capabilities.push({ "capabilityType": "CustomerType", "customerType": (mobileEnrollmentService.planType == 'Business') ? "commercial" : "residential" });
                $scope.data.serviceLocation.capabilities.push({ "capabilityType": "Mobile" });

                var activeService = enrollmentCartService.getActiveService();
                $scope.excludedStates  = _($scope.mobileEnrollmentSettings.excludedStates).contains(data[1]);
                if (activeService && !$scope.excludedState) {
                    activeService.location = $scope.data.serviceLocation;
                    enrollmentService.setSelectedOffers(true);
                }
                else {
                    enrollmentCartService.addService({ location: $scope.data.serviceLocation });
                    enrollmentService.setServiceInformation(true);
                    activeService = enrollmentCartService.getActiveService();
                }
            }
            else {
                $scope.showNetworks = false;
            }

            
        })
    };

    var ARCOverlay = function (key, layer, opacity) {
        return new google.maps.ImageMapType({
            isPng: true,
            opacity: opacity,
            tileSize: new google.maps.Size(256, 256),
            getTileUrl: function (coord, zoom) {
                return "http://api.cellmaps.com/tiles/cellmap/" + zoom + "/" + coord.x + "/" + coord.y + ".png?key=" + key + "&map=stream" + ((layer != "") ? "&llist=" + layer : "");
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

    //$scope.selectedNetwork = $location.search().carrier || 'att';

    $scope.layers = {
        att: {
            att_voice_roam: true,
            att_data_roam: true,
            att_lte: true
        },
        sprint: {
            sprint_voice_roam: true,
            sprint_data_roam: true,
            sprint_lte: true
        }
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

    $scope.$watch('selectedNetwork', function (newVal, oldVal) {
        $scope.updateMapLayers();
    });

    $scope.$watch('layers', function (newVal, oldVal) {
        $scope.updateMapLayers();
    }, true);

    $scope.updateMapLayers = function () {
        var layers = [];
        angular.forEach($scope.layers[$scope.selectedNetwork], function (value, key) {
            if (value == true) {
                layers.push(key);
            }
        });
        if ($scope.mapInstance) {
            if (layers.length) {
                $scope.mapInstance.overlayMapTypes.setAt(0, new ARCOverlay('d8bfd6a09d07263c52ecb75b5a470a90', layers.join(','), 0.75));
            } else {
                $scope.mapInstance.overlayMapTypes.clear();
            }
        }
    };
}]);