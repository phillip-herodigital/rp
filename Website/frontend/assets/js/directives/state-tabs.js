// State Tabs Selector
ngApp.directive('stateTabs', ['breakpoint', function (breakpoint) {
	return {
		restrict: 'A',
		scope: true,
		// The linking function will add behavior to the template
		link: function(scope, element, attrs) {
			var isMobile = false;

			if (attrs.stateTabs) {
				scope.pane = attrs.stateTabs;
			}

			scope.selectPane = function(pane) {
				scope.pane = pane;

				//Calculate the height of the tab items and window scroll offset also accounting for the fixed nav height
				if(isMobile) {
					window.scrollTo(0, element.children()[0].getBoundingClientRect().top + window.pageYOffset + element.children()[0].offsetHeight - 57);	
				}
			};

			//Only use scroll functionality for mobile views
		    scope.$watch(function () {
		        return breakpoint.breakpoint.name
		    }, function (newValue, oldValue) {
		    	isMobile = newValue == 'phone' ? true : false;
		    }, true);
		}
	};
}]);