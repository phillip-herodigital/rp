ngApp.directive('scrollAnchor', ['jQuery', '$window', '$timeout', '$parse', function (jQuery, window, $timeout, $parse) {
    // angular's $window is not a jqLite or jQuery window - it is the actual window object.
    $window = jQuery(window);
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            // element is already a jQuery object, so we can just use the jQuery functions automatically
            var scrollTop;
            var anchorTop;
            var timeoutPromise;
            var isSafari = (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) ? true : false;
            var getOffsetFloor = function (offset) { return Math.floor(element.offset().top); };

            var model = $parse(attrs.scrollAnchor);
            model.assign(scope, function () {
                scrollTop = $window.scrollTop();
                anchorTop = element.offset().top;

                scope.$watch(
                    getOffsetFloor,
                    function () {
                        // add a 2ms timeout for Safari
                        if (isSafari) {
                            $timeout.cancel(timeoutPromise);
                            timeoutPromise = $timeout(function(){
                                $window.scrollTop(Math.floor(scrollTop - anchorTop + element.offset().top));
                            }, 2);
                        } else {
                            $window.scrollTop(Math.floor(scrollTop - anchorTop + element.offset().top));
                        }
                    }
                );
            });
        }
    };
}]);