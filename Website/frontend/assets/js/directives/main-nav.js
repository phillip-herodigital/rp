// Main Navigation
ngApp.directive('mainNav', ['$timeout', function ($timeout) {
	return {
		restrict: 'A',
		scope: true,
		// The linking function will add behavior to the template
		link: function(scope, element, attrs) {
			
			defaultSelection = (attrs.mainNav) ? attrs.mainNav : -1;

			scope.subnav = defaultSelection;

			var shouldSetToDefault = true;
			scope.showSubnav = function (item) {
			    shouldSetToDefault = false;
				scope.subnav = item;
			};

			scope.hideSubnav = function (item) {
			    shouldSetToDefault = true;
			    $timeout(function () {
			        if (shouldSetToDefault) {
			            scope.subnav = defaultSelection;
			        }
			    }, 1000);
			};

		}
	};
}]);