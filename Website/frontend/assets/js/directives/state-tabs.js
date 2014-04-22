// State Tabs Selector
ngApp.directive('stateTabs', function ($rootScope, $filter, $parse) {
	return {
		restrict: 'A',
		//scope: true,
		// The linking function will add behavior to the template
		link: function(scope, element, attrs) {
			
			//scope.pane = 'one';

			scope.selectPane = function(pane) {
				scope.pane = pane;
			};

		}
	};
});

// Main Navigation
ngApp.directive('mainNav', function ($rootScope, $filter, $parse) {
	return {
		restrict: 'A',
		//scope: true,
		// The linking function will add behavior to the template
		link: function(scope, element, attrs) {
			
			//scope.pane = 'one';

			var defaultSelection = 2;

			scope.subnav = defaultSelection;

			scope.showSubnav = function(item) {
				scope.subnav = item;
			};

			scope.hideSubnav = function(item) {
				scope.subnav = defaultSelection;
			};

		}
	};
});

