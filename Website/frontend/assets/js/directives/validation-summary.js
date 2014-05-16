ngApp.directive('valmsgSummary', ['validation', function (validation) {
    return {
        restrict: 'A',
        scope: {},
        template: '<ul>' +
            '<li data-ng-repeat="err in validationSummary" data-ng-bind-html="err"></span>' +
            '</ul>',
        link: function (scope, element) {
            scope.validationSummary = [];
            // Here we don't need to dispose our watch because we have an isolated scope that goes away when the element does.
            var watch = scope.$parent.$watchCollection(validation.messageArray, function (newValue) {
                var merged = [];
                // flatten the nested arrays into "merged"
                var obj = newValue;
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        angular.forEach(obj[key], function (value) {
                            merged.push(value);
                        });
                    }
                }
                scope.validationSummary = merged;
            });

            element.on('$destroy', function () { watch(); });
        }
    };
}]);
