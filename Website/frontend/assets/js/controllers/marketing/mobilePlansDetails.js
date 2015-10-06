/* Mobile Plans Details Controller
 *
 */
ngApp.controller('MobilePlansDetailsCtrl', ['$scope', '$window', '$modal', 'uiGmapGoogleMapApi','uiGmapIsReady', 'jQuery', function ($scope, $window, $modal, uiGmapGoogleMapApi,uiGmapIsReady, jQuery) {
   
    $scope.numLines = 2;
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

    var coverageMap = $(jQuery.find(".coverage-map-container"));

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

    $scope.groupPlanCost = function (planCost, extraLineCost) {
        var cost = parseFloat(planCost) + (($scope.numLines - 1) * extraLineCost);
        return $scope.superCents(cost.toFixed(2));
    };

    $scope.superCents = function (planCost) {
        var array = planCost.toString().split('.');
        var planCostFinal = "";
        if (array.length > 1 && array[1] != "00") {
            planCostFinal = '$' + array[0] + "<sup>." + array[1] + "</sup>";
        } else {
            planCostFinal = '$' + array[0];
        }
        return planCostFinal;
    }

    $scope.showCoverageMapOverlay = function (network) {
        coverageMap.removeClass('hidden-map');
        var center = $scope.mapInstance.getCenter();
        google.maps.event.trigger($scope.mapInstance, 'resize');
        $scope.mapInstance.setCenter(center); 
        $scope.selectedNetwork = network;
        $scope.mapInstance.selectedNetwork = network;
    };

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
        //$scope.mapInstance.selectedNetwork = newVal;
    });

    $scope.$watch('layers', function (newVal, oldVal) {
        $scope.updateMapLayers();
    }, true);
    
    $scope.enrollmentLink = '/enrollment?ServiceType=Mob&MobilePlanId=';
}]);