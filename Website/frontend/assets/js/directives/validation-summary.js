﻿ngApp.directive('valmsgSummary', ['validation', function (validation) {
    return {
        restrict: 'A',
        scope: {},
        template: '<div class="alert alert-error" ng-if="started" ng-show="validationSummary.length">' +
            '   <ul>' +
            '       <li data-ng-repeat="err in validationSummary" data-ng-bind-html="err"></span>' +
            '   </ul>' +
            '</div>' +
            '<div class="alert alert-error" ng-transclude ng-if="!started"></div>',
        transclude: true,
        link: function (scope, element) {
            scope.started = false;
            scope.validationSummary = [];
            // Here we don't need to dispose our watch because we have an isolated scope that goes away when the element does.
            var watch = scope.$parent.$watchCollection(validation.messageArray, function (newValue) {
                var merged = [];
                // flatten the nested arrays into "merged"
                var obj = newValue;
                angular.forEach(obj, function (value, key) {
                    if (obj.hasOwnProperty(key)) {
                        scope.started = true;
                        angular.forEach(value, function (innerValue) {
                            if (innerValue && merged.indexOf(innerValue) == -1) {
                                merged.push(innerValue);
                            }
                        });
                    }
                });
                scope.validationSummary = merged;
            });

            element.on('$destroy', function () { watch(); });
        }
    };
}]);
