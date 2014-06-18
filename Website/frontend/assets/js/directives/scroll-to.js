// Scroll To
ngApp.directive('scrollTo', ['$window', 'jQuery', function ($window, jQuery) {
    return {
        restrict: 'A',
        scope: true,
        link: function (scope, element, attrs) {

            element.on('click', function () {

                var target, targetEl;

                if (attrs.scrollTo) {
                    target = attrs.scrollTo;
                } else if (element.attr("href")) {
                    target = element.attr("href");
                    // Check if it starts with a double hash and trim one
                    if (target.match('^##')) {
                        target = target.substring(1);
                    }
                }

                targetEl = jQuery(target);

                if (targetEl.length) {
                    $('html, body').animate({
                        scrollTop: Math.ceil(targetEl.offset().top)
                    }, 500);
                }

                return false;
            });

        }
    };
}]);