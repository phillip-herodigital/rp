ngApp.directive('dropdownMenu', ['$document', '$rootScope', function ($document, $rootScope) {
    return {
        restrict: 'C',
        link: function (scope, element, attrs) {
            var single;

            scope.$watch('matches', function (newValue) {
                if (newValue && newValue.length == 1) {
                    single = newValue[0];
                } else {
                    single = undefined;
                }
            }, true);

            var dismissHandler = function () {
                if (single) {
                    scope.matches.push(single);
                    scope.selectMatch(0);
                    $rootScope.$digest();
                }
            }

            $document.bind('click', dismissHandler);

            element.on('$destroy', function () {
                $document.unbind('click', dismissHandler);
            });
        }
    };
}]);