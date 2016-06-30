/* Paycenter Map Controller
 *
 */
ngApp.controller('PaycenterCtrl', ['$scope', '$window', '$location', '$filter', 'uiGmapGoogleMapApi', function ($scope, $window, $location, $filter, uiGmapGoogleMapApi) {
    $scope.isLoading = true;
    $scope.showMap = false;
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
        }
    };

    $scope.search = "";
    $scope.searchType = "";
    var searchCoords = { latitude: function () { return 32.74; }, longitude: function () { return -97.03 } };

    $scope.searchbox = {
        template: 'searchbox.tpl.html',
        events: {
            places_changed: function (searchBox) {
                var getPlaces = {};
                var bounds = new google.maps.LatLngBounds();
                getPlaces = searchBox.getPlaces()[0];
                searchCoords = {
                    latitude: getPlaces.geometry.location.lat,
                    longitude: getPlaces.geometry.location.lng
                }
                $scope.searchMarker.options.visible = true;
                $scope.searchMarker.coords = {
                    latitude: getPlaces.geometry.location.lat(),
                    longitude: getPlaces.geometry.location.lng()
                };
                if (getPlaces.adr_address) {
                    $scope.search = getPlaces.adr_address;
                    $scope.searchType = "address";
                }
                else {
                    $scope.search = getPlaces.name;
                    $scope.searchType = "zipcode";
                }
                calculateDistances();
                $scope.mapInstance.setCenter(getPlaces.geometry.location);
                $scope.mapInstance.setZoom(14);
                bounds.extend(getPlaces.geometry.location);
                bounds.extend({ lat: function () { return $scope.sortedMarkers()[0].coords.latitude }, lng: function () { return $scope.sortedMarkers()[0].coords.longitude } });
                $scope.mapInstance.fitBounds(bounds);
            }
        }
    };

    var calculateDistances = function () {
        angular.forEach($scope.markers, function (marker, index) {
            var toRadians = function (degrees) {
                return (degrees / 360) * 2 * Math.PI;
            };
            var lat1 = marker.coords.latitude;
            var lat2 = searchCoords.latitude();
            var lon1 = marker.coords.longitude;
            var lon2 = searchCoords.longitude();

            var R = 3959; // miles
            var φ1 = toRadians(lat1);
            var φ2 = toRadians(lat2);
            var Δφ = toRadians(lat2 - lat1);
            var Δλ = toRadians(lon2 - lon1);

            var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                    Math.cos(φ1) * Math.cos(φ2) *
                    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            $scope.markers[index].distance = (R * c).toFixed(1);
        });
    }

    $scope.window = {
        show: false,
        coords: { latitude: 32.74, longitude: -97.03 },
        options: {
            boxClass: "marker-window",
            pixelOffset: {
                width: -110,
                height: -215
            },
            closeBoxURL: ""
        },
        control: $scope.windowControl
    }

    $scope.searchMarker = {
        id: 0,
        options: {
            clickable: false,
            visible: false,
            animation: google.maps.Animation.DROP,
        },
        coords: { latitude: 32.74, longitude: -97.03 },
    };

    var pinImage = new google.maps.MarkerImage("/frontend/assets/i/icon/pin.png",
        new google.maps.Size(32, 42),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34));

    $scope.markers = [
          {
              id: 0,
              icon: pinImage,
              coords: { latitude: 32.64, longitude: -97.03 },
              locationInfo: {
                  name: "Fiesta Store #57a",
                  address: {
                      line1: "2951 S. Buckner Blvd.",
                      line2: "Dallas, TX 75227",
                      phone: "(214) 275-3020"
                  },
                  hours: "9-5",
                  paymentMethods: ["card", "cash"],
              },
              onClicked: function () {
                  $scope.openWindow(0);
              },
              distance: 0,
              selected: false
          },
          {
              id: 1,
              icon: pinImage,
              coords: { latitude: 32.84, longitude: -97.13 },
              locationInfo: {
                  name: "Fiesta Store #58",
                  address: {
                      line1: "2951 S. Buckner Ave.",
                      line2: "Dallas, TX 12345",
                      phone: "(214) 275-2030"
                  },
                  hours: "9-5",
                  paymentMethods: ["card", "cash"],
              },
              onClicked: function () {
                  $scope.openWindow(1);
              },
              distance: 0,
              selected: false
          },
          {
              id: 2,
              icon: pinImage,
              coords: { latitude: 32.94, longitude: -97.50 },
              locationInfo: {
                  name: "Azle Store",
                  address: {
                      line1: "713 W Main St",
                      line2: "Azle, TX 76020",
                      phone: "(214) 275-2030"
                  },
                  hours: "9-5",
                  paymentMethods: ["card", "cash"],
              },
              onClicked: function () {
                  $scope.openWindow(2);
              },
              distance: 0,
              selected: false
          }
    ];

    $scope.openWindow = function (i) {
        if (windowMarkerIndex == i) {
           $scope.closeWindow();
        }
        else {
            $scope.window.coords = $scope.markers[i].coords;
            $scope.locationInfo = $scope.markers[i].locationInfo;
            if (windowMarkerIndex != -1) {
                $scope.markers[windowMarkerIndex].selected = false;
            }
            $scope.markers[i].selected = true;
            windowMarkerIndex = i;
            $scope.window.show = true;
        }
        $scope.showMap = true;
    }

    var windowMarkerIndex = -1;

    $scope.closeWindow = function () {
        $scope.window.show = false;
        $scope.markers[windowMarkerIndex].selected = false;
        windowMarkerIndex = -1;
    }
    calculateDistances();
    $scope.sortedMarkers = function () {
        return $filter('orderBy')($scope.markers, 'distance');
    }

    //mobile view
    $scope.showMap = false;

    $scope.isMobile = function () {
        return angular.element('body').width() < 768;
    }

    $scope.getDirections = function () {
        var address = "";
        if ($scope.search) {
            address = $scope.search.replace(/ /g, "+");
        }
        else {
            address = $scope.locationInfo.address.line1.replace(/ /g, "+") + "+" + $scope.locationInfo.address.line2.replace(/ /g, "+");
        }

        var uri = "https://www.google.com/maps/place/" + address;

        window.location.href = uri;
    }
}]);