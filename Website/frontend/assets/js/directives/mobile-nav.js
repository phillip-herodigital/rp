// Mobile Navigation
ngApp.directive('mobileNav', [function () {
	return {
		restrict: 'A',
		scope: true,
		// The linking function will add behavior to the template
		link: function(scope, element, attrs) {
			
			scope.subnav = (attrs.mobileNav) ? attrs.mobileNav : -1;

			scope.toggleSubnav = function(item) {
				scope.subnav = (scope.subnav != item) ? item : -1
			};

			scope.subsubnav = -1;

			scope.toggleSubSubnav = function (item) {
			    scope.subsubnav = (scope.subsubnav != item) ? item : -1
			};

		}
	};
}]);