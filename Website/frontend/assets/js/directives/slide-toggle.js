// Slide Toggle
ngApp.directive('slideToggle', [function () {
	return {
		restrict: 'A',
		scope: true,
		// The linking function will add behavior to the template
		link: function(scope, element, attrs) {
			if (attrs.openPane) {
				scope.pane = attrs.openPane;
			}

			scope.togglePane = function(pane) {
				if(scope.pane === pane) {
					scope.pane = '';
				} else {
					scope.pane = pane;
				}
			};

		}
	};
}]);