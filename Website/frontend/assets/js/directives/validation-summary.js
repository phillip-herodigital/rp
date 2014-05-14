ngApp.directive('valmsgSummary', ['validation', function (validation) {
    return {
        restrict: 'A',
        scope: {},
        template: '<ul>' +
            '<li data-ng-repeat="err in validationSummary" data-ng-bind-html="err"></span>' +
            '</ul>',
        link: function (scope) {
            scope.validationSummary = [];
            // Here we don't need to dispose our watch because we have an isolated scope that goes away when the element does.
            scope.$watchCollection(function () { return scope.$parent[validation.messageArray]; }, function (newValue) {
                var merged = [];
                // flatten the nested arrays into "merged"
                var obj = scope.$parent[validation.messageArray];
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        merged = merged.concat(obj[key]);
                    }
                }
                scope.validationSummary = merged;
            });
        }
    };
}]);
