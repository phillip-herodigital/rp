// General use data table
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