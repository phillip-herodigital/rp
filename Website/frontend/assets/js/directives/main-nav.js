// Main Navigation
ngApp.directive('mainNav', [function () {
	return {
		restrict: 'A',
		//scope: true,
		// The linking function will add behavior to the template
		link: function(scope, element, attrs) {
			
			//scope.pane = 'one';

			var defaultSelection = 0;

			scope.subnav = defaultSelection;

			scope.showSubnav = function(item) {
				scope.subnav = item;
			};

			scope.hideSubnav = function(item) {
				scope.subnav = defaultSelection;
			};

		}
	};
}]);