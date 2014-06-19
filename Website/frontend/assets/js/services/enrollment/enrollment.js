ngApp.factory('enrollmentService', ['$rootScope', '$http', '$q', 'jQuery', function ($rootScope, $http, $q, jQuery) {

    var service = {},
        urlPrefix = '/en/api/enrollment/';

    service.validations = {};

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

    service.getCartLocations = function(cart) {
        jQuery.map(cart, function(item) {
            return item.location;
        });
    }

    //TODO: Refactor this into a single function and just pass the API string and request type

    /**
     * Get client data.
     * 
     * @return {object}            Promise object returned when API call has successfully completed.
     */
    service.getClientData = function () {
        var deferred = $q.defer(),
            start = new Date().getTime();

        $http.get(urlPrefix + 'clientData')
        .success(function (data) {
            deferred.resolve(data);
        })
        .error(function (data, status) {
            deferred.reject({
                'status': status,
                'data': data
            });
        });
        
        return deferred.promise;
    };

    /**
     * Reset enrollment process.
     * 
     * @return {object}            Promise object returned when API call has successfully completed.
     */
    service.resetEnrollment = function () {
        var deferred = $q.defer(),
            start = new Date().getTime();

        $http.get(urlPrefix + 'reset')
        .success(function (data) {
            deferred.resolve(data);
        })
        .error(function (data, status) {
            deferred.reject({
                'status': status,
                'data': data
            });
        });

        return deferred.promise;
    };

    /**
    * Set service information
    * 
    * @return {object}            Promise object returned when API call has successfully completed.
    */
    service.setServiceInformation = function(data) {
        var deferred = $q.defer(),
        start = new Date().getTime();

        $http.post(urlPrefix + 'serviceInformation', data)
        .success(function(data) {
            deferred.resolve(data);
        })
        .error(function(data, status){
            deferred.reject({
                'status': status,
                'data': data
            });
        });

        return deferred.promise;
    };

    /**
    * Set selected offers
    * 
    * @return {object}            Promise object returned when API call has successfully completed.
    */
    service.setSelectedOffers = function (data) {
        var deferred = $q.defer(),
        start = new Date().getTime();

        $http.post(urlPrefix + 'selectedOffers', data)
        .success(function (data) {
            deferred.resolve(data);
        })
        .error(function (data, status) {
            deferred.reject({
                'status': status,
                'data': data
            });
        });

        return deferred.promise;
    };

    /**
    * Set account information
    * 
    * @return {object}            Promise object returned when API call has successfully completed.
    */
    service.setAccountInformation = function (data) {
        data = angular.copy(data);
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

        var deferred = $q.defer(),
        start = new Date().getTime();

        $http.post(urlPrefix + 'accountInformation', data)
        .success(function (data) {
            deferred.resolve(data);
        })
        .error(function (data, status) {
            deferred.reject({
                'status': status,
                'data': data
            });
        });

        return deferred.promise;
    };

    /**
    * Set verify identity
    * 
    * @return {object}            Promise object returned when API call has successfully completed.
    */
    service.setVerifyIdentity = function (data) {
        var deferred = $q.defer(),
        start = new Date().getTime();

        $http.post(urlPrefix + 'verifyIdentity', data)
        .success(function (data) {
            deferred.resolve(data);
        })
        .error(function (data, status) {
            deferred.reject({
                'status': status,
                'data': data
            });
        });

        return deferred.promise;
    };

    /**
    * Set payment info
    * 
    * @return {object}            Promise object returned when API call has successfully completed.
    */
    service.setPaymentInfo = function (data) {
        var deferred = $q.defer(),
        start = new Date().getTime();

        $http.post(urlPrefix + 'paymentInfo', data)
        .success(function (data) {
            deferred.resolve(data);
        })
        .error(function (data, status) {
            deferred.reject({
                'status': status,
                'data': data
            });
        });

        return deferred.promise;
    };

    /**
    * Set confirm order
    * 
    * @return {object}            Promise object returned when API call has successfully completed.
    */
    service.setConfirmOrder = function (data) {
        var deferred = $q.defer(),
        start = new Date().getTime();

        $http.post(urlPrefix + 'confirmOrder', data)
        .success(function (data) {
            deferred.resolve(data);
        })
        .error(function (data, status) {
            deferred.reject({
                'status': status,
                'data': data
            });
        });

        return deferred.promise;
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
