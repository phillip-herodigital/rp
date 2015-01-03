// State Selector
ngApp.directive('stateSelector', ['breakpoint', '$filter', function (breakpoint, $filter) {
	return {
		restrict: 'A',
		scope: true,
		// The linking function will add behavior to the template
		link: function(scope, element, attrs) {

			if (attrs.stateSelector) {
				scope.selectedStateKey = attrs.stateSelector;
			}

			scope.$watch('selectedStateKey', function(newVal, oldVal) {
				scope.selectedState = $filter('filter')(scope.stateEnrollData, {'key': newVal})[0];
			});

		}
	};
}]);