ngApp.directive('tokenizeCard', ['$http', function ($http) {
    return {
        require: 'ngModel',
        link: function ($scope, element, attrs, ctrl) {

            ctrl.$parsers.push(function (inputValue) {
                var rawCard = inputValue;
                var token;
                var result = function () {
                    if (token === undefined) {
                        console.log('tokenizing - TODO');
                        // TODO - tokenize it
                        token = rawCard;
                    }
                    return token;
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