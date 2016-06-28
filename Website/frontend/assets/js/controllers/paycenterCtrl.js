/* Paycenter Map Controller
 *
 */
ngApp.controller('PaycenterCtrl', ['$scope', '$window', '$location', '$sce', 'uiGmapGoogleMapApi', function ($scope, $window, $location, $sce, uiGmapGoogleMapApi) {

    var pinImage = new google.maps.MarkerImage("/frontend/assets/i/icon/pin.png",
        new google.maps.Size(32, 42),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34));

    $scope.searchbox = {
        template: 'searchbox.tpl.html',
        events: {
            places_changed: function (searchBox, map) {
                $scope.mapInstance.setCenter(searchBox.getPlaces()[0].geometry.location);
                if (searchBox.getPlaces()[0].geometry.viewport) {
                    $scope.mapInstance.fitBounds(searchBox.getPlaces()[0].geometry.viewport);
                } else {
                    $scope.mapInstance.setZoom(15);
                }
            }
        }
    };

    $scope.markers = [
          {
              id: 1,
              icon: pinImage,
              coords: { latitude: 32.74, longitude: -97.03 },
              showWindow: false,
              options: {
                  boxClass: "marker-window",
                  pixelOffset: {
                      width: -110,
                      height: -215
                  }
              },
              locationInfo: {
                  name: "Fiesta Store #57a",
                  address: {
                      line1: "2951 S. Buckner Blvd.",
                      line2: "Dallas, TX 75227",
                  },
                  phone: "(214) 275-3020"
              },

              onClicked: null
          },
          {
              id: 2,
              icon: pinImage,
              coords: { latitude: 32.84, longitude: -97.13 },
              showWindow: true,
              options: {
                  boxClass: "marker-window",
                  pixelOffset: {
                      width: -110,
                      height: -215
                  },
                  closeBoxURL: ""
              },
              locationInfo: {
                  name: "Fiesta Store #58",
                  address: {
                      line1: "2951 S. Buckner Ave.",
                      line2: "Dallas, TX 12345",
                  },
                  phone: "(214) 275-2030"
              },
              onClicked: null
          },
    ];


    $scope.map = {
        center: { latitude: 32.74, longitude: -97.03 },
        zoom: 10,
        options: {
            disableDefaultUI: false,
            scrollwheel: false,
            panControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            minZoom: 4,
            maxZoom: 18,
            styles: [{ "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{ "color": "#444444" }] }, { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#f2f2f2" }] }, { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "road", "elementType": "all", "stylers": [{ "saturation": -100 }] }, { "featureType": "road.highway", "elementType": "all", "stylers": [{ "visibility": "simplified" }] }, { "featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#00A9E2" }, { "visibility": "on" }] }],
            mapTypeId: google.maps.MapTypeId.ROADMAP
        },
        events: {
            tilesloaded: function (map) {
                $scope.$apply(function () {
                    $scope.mapInstance = map;
                });
            }
        },
        windowOptions: {
            boxClass: "marker-window",
            pixelOffset: {
                width: -110,
                height: -215
            },
            closeBoxURL: ""
        },
    };

    $scope.$watch('map', function (newVal, oldVal) {
        if (newVal) {
            $scope.updateMap();
        }
    });

    $scope.updateMap = function () {
    }
}]);