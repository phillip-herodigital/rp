// State Tabs Selector
ngApp.directive('stateTabs', function ($rootScope, $filter, $parse) {
	return {
		restrict: 'A',
		scope: true,
		// The linking function will add behavior to the template
		link: function(scope, element, attrs) {
			
			if (attrs.stateTabs) {
				scope.pane = attrs.stateTabs;
			}

			scope.selectPane = function(pane) {
				scope.pane = pane;
			};

		}
	};
});