// Dynamic Content
ngApp.directive('dynamic', ['$compile', function ($compile) {
    return {
        restrict: 'A',
        replace: true,
        link: function (scope, ele, attrs) {
            scope.$watch(attrs.dynamic, function(html) {
                $compile(ele.contents())(scope);
            });
        }
    };
}]);