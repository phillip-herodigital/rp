// Slide Toggle
ngApp.directive('slideToggle', [function () {
	return {
		restrict: 'A',
		scope: true,
		// The linking function will add behavior to the template
		link: function(scope, element, attrs) {
			scope.isOpen = false;
		}
	};
}]);