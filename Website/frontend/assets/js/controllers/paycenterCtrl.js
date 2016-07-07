/* Paycenter Map Controller
 *
 */
ngApp.controller('PaycenterCtrl', ['$scope', '$http', '$window', '$location', 'orderByFilter', 'uiGmapGoogleMapApi', function ($scope, $http, $window, $location, orderBy, uiGmapGoogleMapApi) {
    $scope.isLoading = true;
    $scope.showMap = true;
    $scope.map = {
        center: { latitude: 31.37, longitude: -99.23 },
        zoom: 7,
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
            dragend: function (map) {
                if (updateMap) {
                    var promise = $scope.getMarkers({
                        location: map.center,
                        viewport: map.getBounds()
                    });
                    promise.then(function (value) {
                    },function (reason) {
                        console.log(reason);
                    });
                }
            },
            zoom_changed: function (map) {
                if (updateMap) {
                    var promise = $scope.getMarkers({
                        location: map.center,
                        viewport: map.getBounds()
                    });
                    promise.then(function (value) {
                    }, function (reason) {
                        console.log(reason);
                    });
                }
            }
        }
    };

    $scope.search = "";
    var fromAddress = "";
    $scope.searchType = "";
    var updateMap = true;

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
                fromAddress = getPlaces.formatted_address;
                var promise = $scope.getMarkers(getPlaces.geometry);
                promise.then(function (value) {
                    $scope.showMap = false;
                    updateMap = false;
                    //$scope.mapInstance.setCenter(getPlaces.geometry.location);
                    $scope.bounds.extend(getPlaces.geometry.location);
                    $scope.bounds.extend(new google.maps.LatLng(
                        $scope.markers[0].coords.latitude,
                        $scope.markers[0].coords.longitude));
                    $scope.mapInstance.fitBounds($scope.bounds);
                    updateMap = true;
                }).catch(function (reason) {
                    updateMap = false;
                    $scope.mapInstance.fitBounds(getPlaces.geometry.viewport);
                    updateMap = true;
                    $scope.mapInstance.setZoom($scope.mapInstance.getZoom() - 2);
                    console.log(reason);
                });
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
        var promise = new Promise(function (resolve, reject) {
            var lat = data.location.lat();
            var lng = data.location.lng();
            var topLat = data.viewport.f.b;
            var bottomLat = data.viewport.f.f;
            var leftLng = data.viewport.b.f;
            var rightLng = data.viewport.b.b;
            $scope.isLoading = true;
            $http({
                method: 'GET',
                url: '/api/paymentlocations/' + lat + '/' + lng + '/' + topLat + '/' + leftLng + '/' + bottomLat + '/' + rightLng + '/100/true'
            }).then(function successCallback(response) {
                $scope.markers = [];
                angular.forEach(response.data, function (place, index) {
                    $scope.markers.push({
                        id: index + 1,
                        icon: pinImage,
                        coords: {
                            latitude: place.lat,
                            longitude: place.lon
                        },
                        locationInfo: {
                            name: place.name,
                            address: {
                                line1: place.addressLine1,
                                line2: place.addressLine2,
                                city: place.city,
                                state: place.stateAbbreviation,
                                postCode: place.postalCode5,
                                phone: place.phoneNumber
                            },
                            hours: place.hours,
                            paymentMethods: place.paymentMethods
                        },
                        onClicked: function () {
                            $scope.openWindow(index)
                        },
                        distance: place.distance.toFixed(1),
                        selected: false
                    })
                });
                $scope.isLoading = false;
                if (response.data.length) {
                    $scope.noneFound = false;
                    resolve(response.status);
                }
                else {
                    $scope.noneFound = true;
                    reject(new Error("No Results Found"));
                }
            }, function errorCallback(response) {
                reject(new Error(response.status));
            });
        });
        return promise;
    }

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

    $scope.isMobile = function () {
        return angular.element('body').width() < 768;
    }

    $scope.backToResults = function () {
        $scope.showMap = false;
        $scope.closeWindow();
    }

    $scope.zoomOut = function () {
        $scope.mapInstance.setZoom($scope.mapInstance.getZoom() - 1);
    }

    $scope.getDirections = function () {
        var address = $scope.locationInfo.address.line1 + '+';
        if ($scope.locationInfo.address.line2) {
            address = address + $scope.locationInfo.address.line2 + '+';
        }
        address = address + $scope.locationInfo.address.city + '+' +
                            $scope.locationInfo.address.state + '+' +
                            $scope.locationInfo.address.postCode;
        address = address.replace(/ /g, "+");

        if (fromAddress) {
            fromAddress = fromAddress.replace(/ /g, "+");
            window.location.href = "https://www.google.com/maps/dir/" + fromAddress + '/' + address
        }
        else {
            window.location.href = "https://www.google.com/maps/place/" + address;
        }
    }
}]);