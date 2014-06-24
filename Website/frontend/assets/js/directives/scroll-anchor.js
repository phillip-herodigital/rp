ngApp.directive('scrollAnchor', ['jQuery', '$window', '$timeout', '$parse', function (jQuery, window, $timeout, $parse) {
    // angular's $window is not a jqLite or jQuery window - it is the actual window object.
    $window = jQuery(window);
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            // element is already a jQuery object, so we can just use the jQuery functions automatically
            var scrollTop;
            var anchorTop;

            var model = $parse(attrs.scrollAnchor);
            model.assign(scope, function () {
                scrollTop = $window.scrollTop();
                anchorTop = element.offset().top;
                var watch = scope.$watch(function () { return element.offset().top; }, function () {
                    $window.scrollTop(scrollTop - anchorTop + element.offset().top);
                });
                $timeout(function () {
                    watch();
                }, 0, false);
            });
        }
    };
}]);