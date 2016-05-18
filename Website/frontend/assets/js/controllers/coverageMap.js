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
                
                var url = "/api/mapserver/tile/" + coord.x + "," + coord.y + "," + zoom + "/";
                var layers = layer.split(",");
                for (var i = 0; i < layers.length; i++) {
                    url += (i > 0 ? "," : "") + layers[i];
                }
                
                return url;
            }
        });
    };

    var pinColor = "00A9E2";
    var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
        new google.maps.Size(21, 34),
        new google.maps.Point(0,0),
        new google.maps.Point(10, 34));

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
                
                var marker = new google.maps.Marker({
                  position: searchBox.getPlaces()[0].geometry.location,
                  map: $scope.mapInstance,
                  title: '',
                  icon: pinImage,
                });
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
            minZoom: 4,
            maxZoom: 18,
            styles: [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#00A9E2"},{"visibility":"on"}]}],
            mapTypeId: google.maps.MapTypeId.ROADMAP
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