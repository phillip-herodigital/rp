// State Tabs Selector
ngApp.directive('stateTabs', ['breakpoint', 'jQuery', '$window', function (breakpoint, jQuery, $window) {
	return {
		restrict: 'A',
		scope: true,
		// The linking function will add behavior to the template
		link: function(scope, element, attrs) {
			var $tabs = jQuery(element).find('.tabs-nav');

			if (attrs.stateTabs) {
				scope.pane = attrs.stateTabs;
			}

			scope.stateEnrollData = $window.stateEnrollData;

			scope.selectPane = function(pane) {
				scope.pane = pane;

				//Calculate the height of the tab items and window scroll offset also accounting for the fixed nav height
				if(breakpoint.breakpoint.name == 'phone') {
				    $window.scrollTo(0, $tabs.offset().top + $tabs.height() - jQuery('.site-header').height());
				}
			};

			scope.goToEnrollUrl = function () {
			    $window.location = $window.stateEnrollData[scope.pane].enrollUrl;
			}
		}
	};
}]);