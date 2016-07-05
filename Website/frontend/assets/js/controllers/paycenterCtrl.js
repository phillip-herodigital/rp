﻿/* Paycenter Map Controller
 *
 */
ngApp.controller('PaycenterCtrl', ['$scope', '$http', '$window', '$location', 'orderByFilter', 'uiGmapGoogleMapApi', function ($scope, $http, $window, $location, orderBy, uiGmapGoogleMapApi) {
    $scope.isLoading = true;
    $scope.showMap = true;
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
                    $scope.isLoading = false;
                });
            },
            drag: function (map) {
                $scope.getMarkers({
                    location: map.center,
                    viewport: map.getBounds()
                });
            },
            zoom_changed: function (map) {
                $scope.getMarkers({
                    location: map.center,
                    viewport: map.getBounds()
                });
            }
        }
    };

    $scope.search = "";
    $scope.searchType = "";
    var updateMarkers = true;

    $scope.searchbox = {
        template: 'searchbox.tpl.html',
        events: {
            places_changed: function (searchBox) {
                $scope.bounds = new google.maps.LatLngBounds();
                var getPlaces = searchBox.getPlaces()[0];
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
                $scope.getMarkers(getPlaces.geometry);
                //calculateDistances();
                $scope.showMap = false;
                updateMarkers = false;
                $scope.mapInstance.setCenter(getPlaces.geometry.location);
                $scope.bounds.extend(getPlaces.geometry.location);
                $scope.bounds.extend(new google.maps.LatLng(
                    $scope.markers[0].coords.latitude,
                    $scope.markers[0].coords.longitude));
                $scope.mapInstance.fitBounds($scope.bounds);
                updateMarkers = true;
            }
        }
    };

    $scope.window = {
        show: false,
        coords: { latitude: 32.74, longitude: -97.03 },
        options: {
            boxClass: "marker-window",
            pixelOffset: {
                width: -181,
                height: -236
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

    $scope.markers = [];

    $scope.getMarkers = function (data) {

        if ($scope.search && updateMarkers) {

            var lat = data.location.lat();
            var lng = data.location.lng();
            var topLat = data.viewport.b.b;
            var bottomLat = data.viewport.b.f;
            var leftLng = data.viewport.f.b;
            var rightLng = data.viewport.f.f;

            //$scope.isLoading = true;
            //$http({
            //    method: 'get',
            //    url: '/api/paymentlocations/' + lat + '/' + lng + '/' + topLat + '/' + bottomLat + '/' + leftLng + '/' + rightLng
            //}).then(function successs(response) {
            //    $scope.markers = response.data;
            //    $scope.isLoading = false;
            //}
            //, function error(response) {
            //});


            $scope.markers = [
              {
                  id: 1,
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
                  id: 2,
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
                  id: 3,
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
        }
    }

    var calculateDistances = function () {
        angular.forEach($scope.markers, function (marker, index) {
            var toRadians = function (degrees) {
                return (degrees / 360) * 2 * Math.PI;
            };
            var lat1 = marker.coords.latitude;
            var lat2 = $scope.searchMarker.coords.latitude;
            var lon1 = marker.coords.longitude;
            var lon2 = $scope.searchMarker.coords.longitude;

            var R = 3959; // miles
            var φ1 = toRadians(lat1);
            var φ2 = toRadians(lat2);
            var Δφ = toRadians(lat2 - lat1);
            var Δλ = toRadians(lon2 - lon1);

            var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                    Math.cos(φ1) * Math.cos(φ2) *
                    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            $scope.markers[index].distance = (R * c).toFixed(1) * 1;
        });
        $scope.markers = orderBy($scope.markers, 'distance');

    }

    //$scope.sortedMarkers = function() {
    //    return orderBy($scope.markers, 'distance');
    //}

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

            if ($scope.isMobile()) {
                $scope.window.options.pixelOffset = {
                    width: -140,
                    height: -313
                };
                $scope.showMap = true;
            }
            else {
                $scope.window.options.pixelOffset = {
                    width: -181,
                    height: -236
                };
            }
        }
    }

    var windowMarkerIndex = -1;

    $scope.closeWindow = function () {
        $scope.window.show = false;
        if (windowMarkerIndex != -1) {
            $scope.markers[windowMarkerIndex].selected = false;
            windowMarkerIndex = -1;
        }
    }

    calculateDistances();

    //mobile view
    $scope.isMobile = function () {
        return angular.element('body').width() < 768;
    }

    $scope.backToResults = function () {
        $scope.showMap = false;
        $scope.closeWindow();
    }

    $scope.getDirections = function () {
        var address = "";
        if ($scope.search) {
            address = $scope.search.replace(/ /g, "+");
        }
        else {
            address = $scope.locationInfo.address.line1.replace(/ /g, "+") + "+" + $scope.locationInfo.address.line2.replace(/ /g, "+");
        }
        window.location.href = "https://www.google.com/maps/place/" + address;
    }
}]);