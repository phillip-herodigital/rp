/* Enrollment Main Controller
 * This is the main controller for Enrollments. It will keep track of the enrollment state, as well as all fields that will need to be collected.
 */
ngApp.controller('EnrollmentMainCtrl', ['$scope', '$rootScope', '$http', '$anchorScroll', '$timeout', '$filter', 'enrollmentService', 'scrollService', 'jQuery', function ($scope, $rootScope, $http, $anchorScroll, $timeout, $filter, enrollmentService, scrollService, jQuery) {
    $scope.enrollment = {
        serverData: {}, // This array should keep track of all the form fields we collect for the enrollment
        currentSection: 'serviceInformation',
        nextSection: true,
        formErrors: {},
        currentAddress: {},
        headerHeightOffset: jQuery('header.site-header').height() * -1,
        isNewService: 0,
        serviceState: 'TX',
        currentLocation: '', //Keep the ID of the current working location up-to-date here
        sections : [
            {
                id: 'serviceInformation',
                name: 'Let\'s Get Started',
                order: 1,
                isVisible: true
            },
            {
                id: 'planSelection',
                name: 'Choose Your Plan',
                order: 2,
                isVisible: false
            },
            {
                id: 'accountInformation',
                name: 'Setup Your Account',
                order: 3,
                isVisible: false
            },
            {
                id: 'verifyIdentity',
                name: 'Verify Identity',
                order: 4,
                isVisible: false
            },
            {
                id: 'completeOrder',
                name: 'Confirm Order',
                order: 5,
                isVisible: false
            }
        ],
        uiModel: {
            enrollmentLocations: {},
            contactInfo: {},
            language: {},
            billingAddress: {},
            identityQuestions: {}
        }
    };

    //Update the uiModel when the serverData is updated
    $scope.$watch('enrollment.serverData', function(value) {
        $scope.updateUiModel();
    });

    /**
    * Activate Sections
    *
    * @param string location
    */
    $scope.activateSections = function (location) {
        angular.forEach($scope.enrollment.sections, function (value) {
            if (value.id == location) {
                value.isVisible = true;
            }
        });

        $scope.enrollment.currentSection = location;

        //Delay needs to be set to allow angular code to open section.
        $timeout(function () {
            scrollService.scrollTo(location, $scope.enrollment.headerHeightOffset);
        }, 10); 
    };

    /**
    * Get Locations
    *
    * @param string state       //State abbreviation
    * @param string val         //Search string value
    */
    $scope.getLocation = function (state, val) {
        console.log('Getting locations...');

        return locationPromise = enrollmentService.getLocations(state, val).then(function (res) {
            var addresses = [];

            angular.forEach(res.data, function (item) {
                item.formattedAddress = $filter('address')(item.address);
                addresses.push(item);
            });

            return addresses;
        });
    };

    /**
    * Set Server Data
    */
    $scope.setServerData = function () {
        console.log('Setting initial server data:');

        var clientDataPromise = enrollmentService.getClientData();

        clientDataPromise.then(function (data) {
            $scope.enrollment.serverData = data;
        }, function (data) {
            // error response
            $rootScope.$broadcast('connectionFailure');
        });
    };

    $scope.updateUiModel = function() {
        //Placeholders for looping
        var locations = {},
            offers = {},
            offerSelections = {};

        //List of available offers, separated by type
        var availableOffersByType = {},
            selectedOffersByType = {};

        //Loop through the enrollment locations, separate and tag by location id
        angular.forEach($scope.enrollment.serverData.enrollmentLocations, function (location, index) { 
            locations[location.id] = location;
            offers[location.id] = location.availableOffers;
            offerSelections[location.id] = location.offerSelections;
        });

        //We need to separate the offers & offer selections into their respective types by location
        /*angular.forEach(offers, function (offersByLocation, id) {
            availableOffersByType[id] = {};
            angular.forEach(offersByLocation, function (offer, offerId) {
                if(availableOffersByType[id][offer.offerType] == undefined) {
                    availableOffersByType[id][offer.offerType] = [];
                }

                availableOffersByType[id][offer.offerType].push(offer);
            });
        });*/

        //Set the offer selections first by location, then by type
        angular.forEach(offerSelections, function (item, id) {
            selectedOffersByType[id] = {};
            angular.forEach(item, function(selectedOffer, selOfferId) { 
                angular.forEach(offers[id], function (offer, offerId) {
                    if(offer.id == selectedOffer.offerId) {
                        //Set the selected offer
                        var updatedOffer = item[selOfferId]
                        updatedOffer.details = offer;
                        if(selectedOffersByType[id][offer.offerType] == undefined) {
                            selectedOffersByType[id][offer.offerType] = [];
                        }

                        //Set the details of the selected offer (name, description, etc)
                        selectedOffersByType[id][offer.offerType].push(updatedOffer);
                    }
                }); 
            });
        });

        //Set up the ui model
        $scope.enrollment.uiModel = {
            enrollmentLocations: locations,
            offers: offers,
            offerSelections: selectedOffersByType,
            contactInfo: $scope.enrollment.serverData.contactInfo,
            language: $scope.enrollment.serverData.language,
            billingAddress: $scope.enrollment.serverData.billingAddress,
            identityQuestions: $scope.enrollment.serverData.identityQuestions
        }

        console.log($scope.enrollment.uiModel);
    }

    /**
    * Size of object
    *
    * @param object obj
    *
    * return int
    */
    $scope.sizeOf = function (obj) {
        if (typeof obj == 'undefined') {
            return null;
        }
        return Object.keys(obj).length;
    };
}]);