ngApp.factory('enrollmentService', ['$rootScope', '$http', '$q', function ($rootScope, $http, $q) {

    var service = {},
        urlPrefix = '/en/api/enrollment/';

    /**
     * Get client data.
     * 
     * @return {object}            Promise object returned when API call has successfully completed.
     */
    service.getClientData = function () {

        var deferred = $q.defer(),
            start = new Date().getTime();

        $http.get('/frontend/assets/json/enrollment.txt')
        //$http.get(urlPrefix + 'ClientData')
        .success(function (data) {
            console.log('time taken for request: ' + (new Date().getTime() - start) + 'ms');
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
            console.log('time taken for request: ' + (new Date().getTime() - start) + 'ms');
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

        //$http.post(urlPrefix + 'ServiceInformation', data)
        $http.get('/frontend/assets/json/enrollment.txt')
        .success(function(data) {
            console.log('time taken for request: ' + (new Date().getTime() - start) + 'ms');
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

        //$http.post(urlPrefix + 'SelectedOffers', data)
        $http.get('/frontend/assets/json/enrollment.txt')
        .success(function (data) {
            console.log('time taken for request: ' + (new Date().getTime() - start) + 'ms');
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

        var deferred = $q.defer(),
        start = new Date().getTime();

        //$http.post(urlPrefix + 'AccountInformation', data)
        $http.get('/frontend/assets/json/enrollment.txt')
        .success(function (data) {
            console.log('time taken for request: ' + (new Date().getTime() - start) + 'ms');
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

        //$http.post(urlPrefix + 'VerifyIdentity', data)
        $http.get('/frontend/assets/json/enrollment.txt')
        .success(function (data) {
            console.log('time taken for request: ' + (new Date().getTime() - start) + 'ms');
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

        //$http.post(urlPrefix + 'PaymentInfo', data)
        $http.get('/frontend/assets/json/enrollment.txt')
        .success(function (data) {
            console.log('time taken for request: ' + (new Date().getTime() - start) + 'ms');
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

        //$http.post(urlPrefix + 'ConfirmOrder', data)
        $http.get('/frontend/assets/json/enrollment.txt')
        .success(function (data) {
            console.log('time taken for request: ' + (new Date().getTime() - start) + 'ms');
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
            console.log('time taken for request: ' + (new Date().getTime() - start) + 'ms');
        });
    };

    return service;
}]);
