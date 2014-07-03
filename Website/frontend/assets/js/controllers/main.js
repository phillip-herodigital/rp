/* Main Controller
 *
 * This is used to control aspects of the overall page, such as the mobile navigation sidebar.
 */
ngApp.controller('MainCtrl', ['$scope', '$rootScope', '$http', '$templateCache', 'enrollmentCartService', function ($scope, $rootScope, $http, $templateCache, enrollmentCartService) {

	// Private Methods
	var buildNavLinks = function() {
		var menu = [];
		/*links = $("header nav > ul > li a");

		links.each(function() {
			menu.push({
				'name': $(this).html(),
				'href': $(this).attr('href')
			});
		});*/
		return menu;
	};

	// Scope properties
	$scope.sidebarOpen = false;
	$scope.hasMobileNav = $templateCache.get('mobileNav') == undefined ? false : true;

	//$scope.navLinks = buildNavLinks();

	// Public Methods
	$scope.toggleSidebar = function() {
		$scope.sidebarOpen = !$scope.sidebarOpen;
	};

	$scope.isCartOpen = enrollmentCartService.getCartVisibility;
	$scope.toggleCart = enrollmentCartService.toggleCart;

}]);