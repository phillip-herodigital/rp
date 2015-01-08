// Main Navigation
ngApp.directive('subNav', ['jQuery', 'breakpoint', '$timeout', function (jQuery, breakpoint, $timeout) {
    return {
        restrict: 'A',
        scope: true,
        // The linking function will add behavior to the template
        link: function (scope, element, attrs) {
            
            var centerSubNav = function (num) {
                if (num && num != attrs.subNav) {
                    return;
                }
                var mainNavItem = jQuery('.main-nav .nav-' + attrs.subNav),
                mainNavItemCenter = Math.floor(mainNavItem.position().left + parseInt(jQuery(".site-header .main-nav > .wrapper").position().left, 10) + mainNavItem.width() / 2), // Need to account for the .wrapper padding in mainNavItem.position().left
                listItem = element.find('ul'),
                listItemWidth = listItem.width(),
                marginLeft = Math.ceil(mainNavItemCenter - listItemWidth / 2);

                //console.log(mainNavItem);

                if (marginLeft < 0) {
                    marginLeft = 0;
                } else if (marginLeft + listItemWidth > element.width()) {
                    marginLeft = element.width() - listItemWidth;
                }

                marginLeft = marginLeft - 1; // Exact widths was causing a bug in Firefox, for some reason.

                scope.marginLeft = Math.floor(marginLeft);
            };
            centerSubNav();

            scope.$watch(function () {
                return breakpoint.windowWidth
            }, function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    centerSubNav(scope.subnav);
                }
            }, true);

            // scope.subnav is inherited from the parent. Wouldn't normally do this, but since they are tightly coupled anyway, I did.
            scope.$watch('subnav', function (newValue, oldValue) {
                $timeout(function () {
                    centerSubNav(newValue);
                }, 0); // Need to give the nav time to display
            }, true);

        }
    };
}]);