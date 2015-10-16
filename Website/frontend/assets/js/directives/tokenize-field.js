ngApp.directive('tokenizeField', ['$http', '$q', '$parse', '$window', function ($http, $q, $parse, $window) {
    return {
        require: 'ngModel',
        link: function ($scope, element, attrs, ctrl) {
            var attributes = $scope.$eval(attrs.tokenizeField);
            ctrl.$parsers.push(function (inputValue, $scope) {
            //ctrl.$parsers.unshift(function (inputValue, $scope) {
                var rawField = inputValue.replace(/[^\d]/g, "");
                var result = function (opts) {
                    var deferred = $q.defer();
                    // The tokenizer does not provide a way to customize the callback, so we have no option but to declare a global variable
                    $window.processToken = function (data) {
                        if (data.action == "CE") {
                            deferred.resolve(data.data);
                        } else {
                            element.injector().get('logger').log('Failed to tokenize credit card', 'Error', null);
                            deferred.reject();
                        }
                    };
                    var action = "CE";
                    var data = rawField;
                    if (opts && opts.routingNumber)
                    {
                        data = opts.routingNumber + "/" + data;
                    }
                    $http.jsonp(attributes.tokenizerDomain + "/cardsecure/cs?action=" + action + "&data=" + data + "&type=json")
                    .then(function(response) {
                            // noop
                        }, function(response) {
                            if(response.status !== 404) {
                                element.injector().get('logger').log('Failed to tokenize credit card', 'Error', null);
                                ctrl.$setValidity('tokenizeField', false);
                                deferred.reject();
                            }
                    });
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