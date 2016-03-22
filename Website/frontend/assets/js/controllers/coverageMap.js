/* Coverage Map Controller
 *
 */
ngApp.controller('CoverageMapCtrl', ['$scope', '$location', 'uiGmapGoogleMapApi', function ($scope, $location, uiGmapGoogleMapApi) {

    var ARCOverlay = function (key, layer, opacity) {
        return new google.maps.ImageMapType({
            isPng: true,
            opacity: opacity,
            tileSize: new google.maps.Size(256, 256),
            
            getTileUrl: function (coord, zoom) {
                var bounds = $scope.mapInstance.getBounds().toJSON();
                var output = bounds.west + " " + bounds.south + " " + bounds.east + " " + bounds.north;
                console.log(layer);

                var url = "http://127.0.0.1:1025/cgi-bin/mapserv.exe?map=C:/OSGeo4W/mapserver/web/stream.map&mode=tile&tilemode=gmap&tile=" + coord.x + "+" + coord.y + "+" + zoom;
                var url2 = "http://localhost:59203/api/mapserver/tile/" + coord.x + "," + coord.y + "," + zoom + "/";
                var layers = layer.split(",");
                for (var i = 0; i < layers.length; i++) {
                    url += "&layer=" + layers[i];

                    url2 += (i > 0 ? "," : "") + layers[i];
                }
                console.log(url2);
                //console.log(url);
                return url2;
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
    $scope.selectedNetwork = $location.search().carrier || 'sprint';
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
    }, true);

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
            console.log("checking length");
            if (layers.length) {
                $scope.mapInstance.overlayMapTypes.setAt(0, new ARCOverlay('d8bfd6a09d07263c52ecb75b5a470a90', layers.join(','), 0.75));

            } else {
                $scope.mapInstance.overlayMapTypes.clear();
            }
        }
    };

}]);