// State Selector
ngApp.directive('stateSelector', ['breakpoint', '$filter', '$window', function (breakpoint, $filter, $window) {
	return {
		restrict: 'A',
		scope: true,
		// The linking function will add behavior to the template
		link: function(scope, element, attrs) {

			if (attrs.stateSelector) {
				scope.selectedStateKey = attrs.stateSelector;
			}

			/*scope.selectPane = function(pane) {
				scope.pane = pane;

				//Calculate the height of the tab items and window scroll offset also accounting for the fixed nav height
				if(breakpoint.breakpoint.name == 'phone') {
				    $window.scrollTo(0, $tabs.offset().top + $tabs.height() - jQuery('.site-header').height());
				}
			};*/

			scope.$watch('selectedStateKey', function(newVal, oldVal) {
				scope.selectedState = $filter('filter')(scope.stateEnrollData, {'key': newVal})[0];
			});


			scope.goToEnrollUrl = function () {
			    $window.location = selectedState.enrollURL;
			}

		}
	};
}]);