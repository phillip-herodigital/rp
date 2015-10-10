/*
 * Mobile Usage Service
 *
 */
ngApp.factory('mobileUsageService', ['$http', '$q', function ($http, $q) {
    var currentUsageCache = [],
    usageCache = [],
    invoiceCache = [];

    var handleCache = function (cache, key, loadData) {
        var deferred = $q.defer();

        if (cache[key] != null && cache[key].isLoading == false) {
            deferred.resolve(cache[key].data);

            return deferred.promise;
        }

        if (cache[key] == null) {
            cache[key] = {
                isLoading: true,
                defers: [deferred]
            };
            loadData(function (data) {
                cache[key].data = data;
                cache[key].isLoading = false;

                for (var i = 0, deferred; deferred = cache[key].defers[i]; i++) {
                    deferred.resolve(cache[key].data);
                }
            }, function (error) {
                deferred.reject(error);
            });
        } else {
            cache[key].defers.push(deferred);
        }

        return deferred.promise;
    };

    return {
        loadCurrentMobileUsage: function (acctNumber, startDate, endDate) {
            return handleCache(currentUsageCache, acctNumber + (startDate == null ? null : startDate.toString()) + (endDate == null ? null : endDate.toString()), function (callback, errorCallback) {
                $http({
                    method: 'POST',
                    url: '/api/account/getMobileUsage',
                    data: {
                        accountNumber: acctNumber,
                        startDate: startDate,
                        endDate: endDate
                    },
                    headers: { 'Content-Type': 'application/JSON' }
                })
                .success(function (data, status, headers, config) {
                    callback(data);
                })
                .error(function (data, status) {
                    errorCallback(data);
                });
            });
        },
        loadMobileUsage: function (acctNumber, invoiceIds) {
            return handleCache(usageCache, acctNumber + '-' + invoiceIds.join('-'), function (callback, errorCallback) {
                $http({
                    method: 'POST',
                    url: '/api/account/getMobileUsageByInvoiceNumbers',
                    data: {
                        accountNumber: acctNumber,
                        invoiceIds: invoiceIds
                    },
                    headers: { 'Content-Type': 'application/JSON' }
                })
                .success(function (data, status, headers, config) {
                    callback(data);
                }).error(function (data, status) {
                    errorCallback(data);
                });
            });
        },
        loadMobileInvoices: function (acctNumber) {
            return handleCache(invoiceCache, acctNumber, function (callback, errorCallback) {
                $http({
                    method: 'GET',
                    url: '/api/account/getInvoices',
                    headers: { 'Content-Type': 'application/JSON' }
                })
                .success(function (data, status, headers, config) {
                    callback(_.chain(data.invoices.values)
                              .where({ accountNumber: acctNumber })
                              .sortBy("invoiceDate")
                              .reverse()
                              .value());
                }).error(function (data, status) {
                    errorCallback(data);
                });
            });
        }
    };
}]);