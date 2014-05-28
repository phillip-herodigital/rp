// State Tabs Selector
ngApp.directive('stateTabs', ['breakpoint', 'jQuery', function (breakpoint, $) {
	return {
		restrict: 'A',
		scope: true,
		// The linking function will add behavior to the template
		link: function(scope, element, attrs) {
			var $tabs = element.find('.tabs-nav');

			if (attrs.stateTabs) {
				scope.pane = attrs.stateTabs;
			}

			scope.selectPane = function(pane) {
				scope.pane = pane;

				//Calculate the height of the tab items and window scroll offset also accounting for the fixed nav height
				if(breakpoint.breakpoint.name == 'phone') {
					window.scrollTo(0, $tabs.offset().top + $tabs.height() - $('.site-header').height());
				}
			};
		}
	};
}]);