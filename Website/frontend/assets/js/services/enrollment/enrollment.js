ngApp.factory('enrollmentService', ['$rootScope', '$http', '$q', 'utilityProductsService', 'enrollmentStepsService', function ($rootScope, $http, $q, utilityProductsService, enrollmentStepsService) {

    var service = {},
        urlPrefix = '/api/enrollment/';

    service.validations = [];

    service.phoneTypes = [
        {
            'name': 'home',
            'label': 'Home'
        },
        {
            'name': 'work',
            'label': 'Work'
        },
        {
            'name': 'mobile',
            'label': 'Mobile'
        }
    ];

    service.usStates = [
        {
            "name": "Alabama",
            "abbreviation": "AL"
        },
        {
            "name": "Alaska",
            "abbreviation": "AK"
        },
        {
            "name": "American Samoa",
            "abbreviation": "AS"
        },
        {
            "name": "Arizona",
            "abbreviation": "AZ"
        },
        {
            "name": "Arkansas",
            "abbreviation": "AR"
        },
        {
            "name": "California",
            "abbreviation": "CA"
        },
        {
            "name": "Colorado",
            "abbreviation": "CO"
        },
        {
            "name": "Connecticut",
            "abbreviation": "CT"
        },
        {
            "name": "Delaware",
            "abbreviation": "DE"
        },
        {
            "name": "District Of Columbia",
            "abbreviation": "DC"
        },
        {
            "name": "Federated States Of Micronesia",
            "abbreviation": "FM"
        },
        {
            "name": "Florida",
            "abbreviation": "FL"
        },
        {
            "name": "Georgia",
            "abbreviation": "GA"
        },
        {
            "name": "Guam",
            "abbreviation": "GU"
        },
        {
            "name": "Hawaii",
            "abbreviation": "HI"
        },
        {
            "name": "Idaho",
            "abbreviation": "ID"
        },
        {
            "name": "Illinois",
            "abbreviation": "IL"
        },
        {
            "name": "Indiana",
            "abbreviation": "IN"
        },
        {
            "name": "Iowa",
            "abbreviation": "IA"
        },
        {
            "name": "Kansas",
            "abbreviation": "KS"
        },
        {
            "name": "Kentucky",
            "abbreviation": "KY"
        },
        {
            "name": "Louisiana",
            "abbreviation": "LA"
        },
        {
            "name": "Maine",
            "abbreviation": "ME"
        },
        {
            "name": "Marshall Islands",
            "abbreviation": "MH"
        },
        {
            "name": "Maryland",
            "abbreviation": "MD"
        },
        {
            "name": "Massachusetts",
            "abbreviation": "MA"
        },
        {
            "name": "Michigan",
            "abbreviation": "MI"
        },
        {
            "name": "Minnesota",
            "abbreviation": "MN"
        },
        {
            "name": "Mississippi",
            "abbreviation": "MS"
        },
        {
            "name": "Missouri",
            "abbreviation": "MO"
        },
        {
            "name": "Montana",
            "abbreviation": "MT"
        },
        {
            "name": "Nebraska",
            "abbreviation": "NE"
        },
        {
            "name": "Nevada",
            "abbreviation": "NV"
        },
        {
            "name": "New Hampshire",
            "abbreviation": "NH"
        },
        {
            "name": "New Jersey",
            "abbreviation": "NJ"
        },
        {
            "name": "New Mexico",
            "abbreviation": "NM"
        },
        {
            "name": "New York",
            "abbreviation": "NY"
        },
        {
            "name": "North Carolina",
            "abbreviation": "NC"
        },
        {
            "name": "North Dakota",
            "abbreviation": "ND"
        },
        {
            "name": "Northern Mariana Islands",
            "abbreviation": "MP"
        },
        {
            "name": "Ohio",
            "abbreviation": "OH"
        },
        {
            "name": "Oklahoma",
            "abbreviation": "OK"
        },
        {
            "name": "Oregon",
            "abbreviation": "OR"
        },
        {
            "name": "Palau",
            "abbreviation": "PW"
        },
        {
            "name": "Pennsylvania",
            "abbreviation": "PA"
        },
        {
            "name": "Puerto Rico",
            "abbreviation": "PR"
        },
        {
            "name": "Rhode Island",
            "abbreviation": "RI"
        },
        {
            "name": "South Carolina",
            "abbreviation": "SC"
        },
        {
            "name": "South Dakota",
            "abbreviation": "SD"
        },
        {
            "name": "Tennessee",
            "abbreviation": "TN"
        },
        {
            "name": "Texas",
            "abbreviation": "TX"
        },
        {
            "name": "Utah",
            "abbreviation": "UT"
        },
        {
            "name": "Vermont",
            "abbreviation": "VT"
        },
        {
            "name": "Virgin Islands",
            "abbreviation": "VI"
        },
        {
            "name": "Virginia",
            "abbreviation": "VA"
        },
        {
            "name": "Washington",
            "abbreviation": "WA"
        },
        {
            "name": "West Virginia",
            "abbreviation": "WV"
        },
        {
            "name": "Wisconsin",
            "abbreviation": "WI"
        },
        {
            "name": "Wyoming",
            "abbreviation": "WY"
        }
    ];

    service.accountInformation = {
        contactInfo: {
            name: {
                first: '',
                last: ''
            },
            phone: [{
                number: '',
                category: ''
            }],
            email: {
                address: ''
            }
        },
        socialSecurityNumber: '',
        driversLicense: {
            number: '',
            stateAbbreviation: ''
        },
        secondaryContactInfo: {}
    };
    service.identityQuestions = [];

    service.setClientData = function (result) {
        // update our validations - don't make a new array, just copy all the validations over from the returned one. Saves copying back to the scope elsewhere.
        angular.copy(result.validations, service.validation);

        // update the cart
        utilityProductsService.updateCart(result.cart);
        var serviceIndexErrors = [];
        angular.forEach(result.validations, function (entry) {
            var capture = /^Services\[(\d+)\]/g.exec(entry.memberName);
            if (capture) {
                serviceIndexErrors.push(parseInt(capture[1]));
            }
        });
        if (serviceIndexErrors.length) {
            utilityProductsService.setActiveServiceAddress(utilityProductsService.getAddresses()[serviceIndexErrors[0]].location.address);
        }
        else if (utilityProductsService.getAddresses().length == 0) {
            // new service
            utilityProductsService.setActiveServiceAddress(undefined);
        }

        // copy out the account information the server has
        service.accountInformation.contactInfo = result.contactInfo || {};
        service.accountInformation.secondaryContactInfo = result.secondaryContactInfo || {};
        service.accountInformation.driversLicense = result.driversLicense || {};
        service.accountInformation.language = result.language;

        // Default these object to prevent errors
        service.accountInformation.contactInfo.phone = service.accountInformation.contactInfo.phone || [{ }];
        service.accountInformation.contactInfo.email = service.accountInformation.contactInfo.email || { };

        // set the identity questions from the server
        service.identityQuestions = result.identityQuestions;

        enrollmentStepsService.setFromServerStep(result.expectedState);
    };

    function makeCall(urlSuffix, data, mode) {
        var deferred = $q.defer(),
        start = new Date().getTime();
        mode = mode || 'post';

        $http.post(urlPrefix + urlSuffix, data)
        .success(function (data) {
            deferred.resolve(data);
        })
        .error(function (data, status) {
            $rootScope.$broadcast('connectionFailure');
            deferred.reject({
                'status': status,
                'data': data
            });
        });

        return deferred.promise.then(function (result) {
            service.setClientData(result);

            return result;
        });
    };

    /**
     * Get client data.
     * 
     * @return {object}            Promise object returned when API call has successfully completed.
     */
    service.getClientData = function () {
        return makeCall('clientData', undefined, 'get');
    };

    /**
     * Reset enrollment process.
     * 
     * @return {object}            Promise object returned when API call has successfully completed.
     */
    service.resetEnrollment = function () {
        return makeCall('reset');
    };

    /**
    * Set service information
    * 
    * @return {object}            Promise object returned when API call has successfully completed.
    */
    service.setServiceInformation = function () {
        var addresses = utilityProductsService.getAddresses();
        //Create our empty locations object
        var data = { 'locations': [] };

        angular.forEach(addresses, function (address) {
            data.locations.push(address.location);
        });

        return makeCall('serviceInformation', data);
    };

    /**
    * Set selected offers
    * 
    * @return {object}            Promise object returned when API call has successfully completed.
    */
    service.setSelectedOffers = function () {
        var addresses = utilityProductsService.getAddresses();

        //Get from the activeServiceAddress object
        var data = {
            'selection': []
        };

        angular.forEach(addresses, function (address) {
            var selectedPlans = [];
            angular.forEach(address.offerInformationByType, function (entry) {
                if (entry.value.offerSelections.length) {
                    selectedPlans.push(entry.value.offerSelections[0].offerId);
                }
            });

            data.selection.push({
                'location': address.location,
                'offerIds': selectedPlans
            });
        });

        return makeCall('selectedOffers', data);
    };

    /**
    * Set account information
    * 
    * @return {object}            Promise object returned when API call has successfully completed.
    */
    service.setAccountInformation = function () {
        var utilityProduct = utilityProductsService.addresses || [];

        var data = angular.copy({
            contactInfo: service.accountInformation.contactInfo,
            socialSecurityNumber: service.accountInformation.socialSecurityNumber,
            driversLicense: service.accountInformation.driversLicense,
            secondaryContactInfo: service.accountInformation.secondaryContactInfo,
            onlineAccount: service.accountInformation.onlineAccount,
            cart: utilityProduct
        });
        // sanitize data
        angular.forEach(data.cart, function (cartItem) {
            angular.forEach(cartItem.offerInformationByType, function (typedOrderInfo) {
                typedOrderInfo.value.availableOffers = null;
                angular.forEach(typedOrderInfo.value.offerSelections, function (offerSelection) {
                    offerSelection.optionRules = null;
                })
            });
        });
        if (!data.driversLicense.number && !data.driversLicense.stateAbbreviation)
            data.driversLicense = null;
        if (!data.secondaryContactInfo.first && !data.secondaryContactInfo.last)
            data.secondaryContactInfo = null;
        if (!data.onlineAccount.username)
            data.onlineAccount = null;

        return makeCall('accountInformation', data);
    };

    /**
    * Set verify identity
    * 
    * @return {object}            Promise object returned when API call has successfully completed.
    */
    service.setVerifyIdentity = function (identityAnswers) {
        var data = { 'selectedIdentityAnswers': identityAnswers };

        return makeCall('verifyIdentity', data);
    };

    /**
    * Set confirm order
    * 
    * @return {object}            Promise object returned when API call has successfully completed.
    */
    service.setConfirmOrder = function (data) {
        return makeCall('confirmOrder', data);
    };

    /**
     * Get locations.
     * 
     * @param {string} val         Location search string
     * @return {object}            Promise object returned when API call has successfully completed.
     */
    service.getLocations = function (state, val) {
        var start = new Date().getTime();

        return $http.get('/api/address/lookup/' + state + '/' + val)
            .success(function (data) {
        });
    };

    return service;
}]);
