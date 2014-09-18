ngApp.directive('tokenizeCard', ['$http', '$q', '$parse', '$window', function ($http, $q, $parse, $window) {
    return {
        require: 'ngModel',
        link: function ($scope, element, attrs, ctrl) {
            var attributes = $scope.$eval(attrs.tokenizeCard)
            ctrl.$parsers.push(function (inputValue) {
                var rawCard = inputValue;
                var result = function () {
                    var deferred = $q.defer();
                    
                    // The tokenizer does not provide a way to customize the callback, so we have no option but to declare a global variable
                    $window.processToken = function (data) {
                        if (data.action == "CE") {
                            deferred.resolve(data.data);
                        } else {
                            deferred.reject();
                        }
                    };
                    $http.jsonp(attributes.tokenizerDomain + "/cardsecure/cs?action=CE&data=" + rawCard + "&type=json")
                    .error(function (data, status, headers, config) {
                        deferred.reject();
                    });

                    return deferred.promise;
                };
                result.redacted = "************" + rawCard.slice(-4)

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