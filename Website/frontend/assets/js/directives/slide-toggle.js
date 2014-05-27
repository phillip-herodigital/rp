// Slide Toggle
ngApp.directive('slideToggle', [function () {
	return {
		restrict: 'A',
		scope: true,
		// The linking function will add behavior to the template
		link: function(scope, element, attrs) {
			var anchorElement = element.find('a');

			//Add class collapsed by default
			anchorElement.addClass('collapsed');

			if (attrs.openPane) {
				scope.pane = attrs.openPane;
			}
			scope.togglePane = function(pane) {
				if(scope.pane === pane) {
					scope.pane = '';
					anchorElement.addClass('collapsed');
				} else {
					scope.pane = pane;
					anchorElement.removeClass('collapsed');
				}
			};
		}
	};
}]);