﻿ngApp.directive('tokenizeField', ['$http', '$q', '$parse', '$window', 'logger', function ($http, $q, $parse, $window, logger) {
    var _logger = logger;
    var writeLog = function (attributes, rawField, response) {
        response.config.url = response.config.url.replace(/data=[\d\\]*&/, "data=XXXX&");
        if (attributes.type == "bank") {
            _logger.log('Failed to tokenize bank account', 'Error', { 'first2': rawField.substring(0, 2), 'last4': rawField.substr(rawField.length - 4), 'tokenizerError': 'bankAccount', response: response });
        } else {
            _logger.log('Failed to tokenize credit card', 'Error', { 'first2': rawField.substring(0, 2), 'last4': rawField.substr(rawField.length - 4), 'tokenizerError': 'creditCard', response: response });
        }
    };
    return {
        require: 'ngModel',
        link: function ($scope, element, attrs, ctrl) {
            var attributes = $scope.$eval(attrs.tokenizeField);
            ctrl.$parsers.push(function (inputValue) {
                var rawField = inputValue.replace(/[^\d]/g, "");
                var result = function (opts) {
                    var deferred = $q.defer();
                    var action = "CE";
                    var data = rawField;
                    if (opts && opts.routingNumber)
                    {
                        data = opts.routingNumber + "/" + data;
                    }
                    $window.processToken = function (data) {
                        $window.angular.callbacks[funcName](data);
                    };
                    $http.jsonp(attributes.tokenizerDomain + "/cardsecure/cs?action=" + action + "&data=" + data + "&type=json", {"callback":"processToken"})
                    .then(function (response) {
                        if (response.data.action == "CE") {
                            deferred.resolve(response.data.data);
                        } else {
                            writeLog(attributes, rawField, response);
                            deferred.reject();
                        }
                    }, function(response) {
                        writeLog(attributes, rawField, response);
                        ctrl.$setValidity('tokenizeField', false);
                        deferred.reject();
                    });

                    var funcName = '_' + $window.angular.callbacks.counter.toString(36);
                    return deferred.promise;
                };
                result.redacted = "************" + rawField.slice(-4)

                if (attributes.type == "bank") {
                    result.type = "Bank";
                } else if (rawField.indexOf("34") == 0 || rawField.indexOf("37") == 0) {
                    result.type = "AmericanExpress";
                } else if (rawField.indexOf("6011") == 0 || rawField.indexOf("622") == 0 || rawField.indexOf("64") == 0 || rawField.indexOf("65") == 0) {
                    result.type = "Discover";
                } else if (rawField.indexOf("50") == 0 || rawField.indexOf("51") == 0 || rawField.indexOf("52") == 0 || rawField.indexOf("53") == 0 || rawField.indexOf("54") == 0 || rawField.indexOf("55") == 0) {
                    result.type = "Mastercard";
                } else if (rawField.indexOf("4") == 0) {
                    result.type = "Visa";
                } else {
                    result.type = "Unknown";
                }
                
                return result;
            });

            ctrl.$formatters.push(function (modelValue) {
                if (modelValue)
                {
                    if (typeof modelValue == 'function') {
                        return ctrl.$viewValue;
                    }
                    
                    return modelValue;
                }
                else
                {
                    return '';
                }
            });
        }
    };
}]);