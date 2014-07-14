ngApp.directive('tokenizeCard', ['$http', function ($http) {
    return {
        require: 'ngModel',
        link: function ($scope, element, attrs, ctrl) {

            function getTokenizedCard()
            {
                var rawCard = ctrl.$viewValue;
                // TODO - tokenize it
                return rawCard;
            }

            ctrl.$parsers.push(function (inputValue) {
                return getTokenizedCard;
            });

            ctrl.$formatters.push(function (modelValue) {
                if (modelValue)
                {
                    if (typeof modelValue == 'function') {
                        return ctrl.$viewValue;
                    }
                    // TODO - this should be the value of the token from the server... We should probably convert it to a redacted value
                    console.log(ctrl);
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