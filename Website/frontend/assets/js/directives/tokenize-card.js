ngApp.directive('tokenizeCard', ['$http', '$q', function ($http, $q) {
    return {
        require: 'ngModel',
        link: function ($scope, element, attrs, ctrl) {

            ctrl.$parsers.push(function (inputValue) {
                var rawCard = inputValue;
                var result = function () {
                    var deferred = $q.defer();

                    console.log('tokenizing - TODO');
                    // TODO - tokenize it
                    deferred.resolve(rawCard);

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
                    // TODO - this should be the value of the token from the server... We should probably convert it to a redacted value
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