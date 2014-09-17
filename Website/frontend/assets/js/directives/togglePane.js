/* 
    Lets take any sort of elements in a list and allow them
    to be toggleable
*/
ngApp.directive('togglePane', [function() {
    return {
        restrict: 'E',
        scope: {
            value: '='
        },
        transclude: true,
        replace: true,
        template: '<div class="pane-item" ng-show="value == name" ng-transclude></div>',
        link: function(scope, element, attrs) {
            scope.name = attrs.name;
        }
    };
}]);