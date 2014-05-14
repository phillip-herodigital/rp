ngApp.directive('valmsgSummary', ['validation', function (validation) {

    return {
        restrict: 'A',
        scope: {},
        template: '<ul>' +
            '<li data-ng-repeat="err in validationSummary" data-ng-bind-html="err"></span>' +
            '</ul>',
        link: function (scope) {
            console.log('linked');
            scope.validationSummary = [];
            scope.$watchCollection(function () { return scope.$parent[validation.messageArray]; }, function (newValue) {
                var merged = [];
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
