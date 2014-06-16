// Main Navigation
ngApp.directive('subNav', ['jQuery', 'breakpoint', '$timeout', function (jQuery2, breakpoint, $timeout) {
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
                mainNavItemCenter = mainNavItem.position().left - parseInt(jQuery(".site-header > .wrapper").css('paddingLeft'), 10) + mainNavItem.width() / 2, // Need to account for the .wrapper padding in mainNavItem.position().left
                listItem = element.find('ul'),
                listItemWidth = listItem.width(),
                marginLeft = mainNavItemCenter - listItemWidth / 2;

                if (marginLeft < 0) {
                    marginLeft = 0;
                } else if (marginLeft + listItemWidth > element.width()) {
                    marginLeft = jQuery('.sub-nav .wrapper').width() - listItemWidth;
                }

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