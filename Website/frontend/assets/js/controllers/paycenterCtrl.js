﻿/* Paycenter Map Controller
 *
 */
ngApp.controller('PaycenterCtrl', ['$scope', '$http', '$window', '$location', 'orderByFilter', 'uiGmapGoogleMapApi', function ($scope, $http, $window, $location, orderBy, uiGmapGoogleMapApi) {
    $scope.isLoading = true;
    $scope.inTexas = true;
    $scope.showMap = true;
    $scope.mapMoved = false;
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
        refresh: false,
        events: {
            tilesloaded: function (map) {
                $scope.$apply(function () {
                    $scope.mapInstance = map;
                    $scope.isLoading = false;
                });
            },
            dragend: function (map) {
                if (updateMap) {
                    $scope.mapMoved = true;
                    $scope.isLoading = true;
                }
            },
            zoom_changed: function (map) {
                if (updateMap) {
                    $scope.mapMoved = true;
                    $scope.isLoading = true;
                }
            },
            idle: function (map) {
                if (updateMap && $scope.mapMoved) {
                    var getMarkers = function (getPlaces) {
                        var promise = $scope.getMarkers(getPlaces);
                        promise.then(function (value) {
                            console.log(value);
                        }, function (reason) {
                            console.log(reason);
                        });
                    };
                    var getPlaces = {
                        geometry: {
                            location: map.center,
                            viewport: map.getBounds()
                            }
                    };
                    var lat = map.center.lat();
                    var lng = map.center.lng();
                    var uri = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&key=AIzaSyCKwR5gbRNgWMZ84ZxGFPh1Jpvm5nMRuRY';

                    $http.get(uri)
                    .then(function successCallback(response) {
                        getPlaces.address_components = response.data.results[0].address_components;
                        getMarkers(getPlaces);
                    },
                    function errorCallback(response) {
                        getMarkers(getPlaces);
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
                        $scope.search = getPlaces.formatted_address;
                        $scope.searchType = "zipcode";
                    }
                    fromAddress = getPlaces.formatted_address;
                    if (!getPlaces.geometry.viewport) {
                        updateMap = false;
                        $scope.mapInstance.setCenter(getPlaces.geometry.location);
                        $scope.mapInstance.setZoom(16);
                        getPlaces.geometry.viewport = $scope.mapInstance.getBounds();
                        updateMap = true;
                    }
                    var promise = $scope.getMarkers(getPlaces);
                    promise.then(function (value) {
                        $scope.showMap = false;
                        updateMap = false;
                        $scope.mapMoved = false;
                        $scope.bounds.extend(new google.maps.LatLng(
                            getPlaces.geometry.viewport.f.b,
                            getPlaces.geometry.viewport.b.f));
                        $scope.bounds.extend(new google.maps.LatLng(
                            getPlaces.geometry.viewport.f.f,
                            getPlaces.geometry.viewport.b.b));
                        if ($scope.markers.length) {
                            $scope.bounds.extend(new google.maps.LatLng(
                                $scope.markers[0].coords.latitude,
                                $scope.markers[0].coords.longitude));
                        }
                        else {
                            if ($scope.isMobile()) {
                                $scope.showMap = true;
                            }
                        }
                        $scope.mapInstance.fitBounds($scope.bounds);
                        updateMap = true;
                    }, function (reason) {
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

    $scope.getMarkers = function (getPlaces) {
        var promise = new Promise(function (resolve, reject) {
            var lat = getPlaces.geometry.location.lat();
            var lng = getPlaces.geometry.location.lng();
            var topLat = getPlaces.geometry.viewport.f.b;
            var bottomLat = getPlaces.geometry.viewport.f.f;
            var leftLng = getPlaces.geometry.viewport.b.f;
            var rightLng = getPlaces.geometry.viewport.b.b;
            var maxResults = 50;
            var useCache = 'true';
            $scope.isLoading = true;
            $scope.inTexas = false;
            if (getPlaces.address_components) {
                angular.forEach(getPlaces.address_components, function (component) {
                    if (component.short_name == "TX") {
                        $scope.inTexas = true;
                    }
                });
            }
            else {
                if (getPlaces.formatted_address.includes(" TX ")) {
                    $scope.inTexas = true;
                }
            }
            $http({
                method: 'GET',
                url: '/api/marketing/paymentlocations/' + lat + '/' + lng + '/' + topLat + '/' + leftLng + '/' + bottomLat + '/' + rightLng + '/' + maxResults + '/' + useCache
            }).then(function successCallback(response) {
                $scope.markers = [];
                $scope.isLoading = false;
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
                if (response.data.length) {
                    $scope.noneFound = false;
                    resolve(response.status);
                }
                else {
                    $scope.noneFound = true;
                    resolve("No Results Found");
                }
            }, function errorCallback(response) {
                reject(new Error(response.status));
            });
        });
        return promise;
    }

    var ogCoords = null;
    $scope.openWindow = function (i) {
        if (windowMarkerIndex == i) {
            $scope.closeWindow();
        }
        else {
            if (ogCoords === null) {
                ogCoords = $scope.mapInstance.getCenter();
            }
            updateMap = false;
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
            $scope.mapInstance.panTo(ogCoords);
            ogCoords = null;
            updateMap = true;
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
        var newZoom = $scope.mapInstance.getZoom() - 1;
        $scope.mapInstance.setZoom(newZoom);
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