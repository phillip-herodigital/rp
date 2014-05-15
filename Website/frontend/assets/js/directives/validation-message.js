ngApp.directive('valmsgFor', ['validation', function (validation) {

    return {
        restrict: 'A',
        scope: {
            valmsgFor: '@'
        },
        template: '<span for="{{valmsgFor}}" data-ng-repeat="err in messages" generated="true" data-ng-bind-html="err"></span>',

        link: function (scope, element) {
            scope.validationSummary = [];
            // Here we don't need to dispose our watch because we have an isolated scope that goes away when the element does.
            var watch = scope.$parent.$watchCollection(function () { return validation.messageArray(scope.$parent, scope.valmsgFor) }, function (newValue) {
                scope.messages = newValue;
            });

            element.on('$destroy', function () { watch(); });
        }
    };
}]);
