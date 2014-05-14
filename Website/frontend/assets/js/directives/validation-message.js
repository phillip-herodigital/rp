ngApp.directive('valmsgFor', ['validation', function (validation) {

    return {
        restrict: 'A',
        scope: {
            valmsgFor: '@'
        },
        template: '<span for="{{valmsgFor}}" data-ng-repeat="err in $parent.' + validation.messageArray + '[valmsgFor]" generated="true" data-ng-bind-html="err"></span>'
    };
}]);
