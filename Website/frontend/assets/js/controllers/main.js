/* Main Controller
 *
 * This is used to control aspects of the overall page, such as the mobile navigation sidebar.
 */
ngApp.controller('MainCtrl', ['$scope', '$rootScope', '$http', '$templateCache', '$timeout', '$window', '$modal', 'enrollmentCartService', 'scrollService', function ($scope, $rootScope, $http, $templateCache, $timeout, $window, $modal, enrollmentCartService, scrollService) {

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

    $scope.isFixedHeader = false;

    $scope.setFixedHeader = function(val) {
        $scope.isFixedHeader = val;
    };

    $scope.scrollToTop = function() {
        scrollService.scrollTo('top', 0, 500, angular.noop);
    }

    // in the account section send the user to the login page 
    // if it's close to the session timeout
    var pathName = $window.location.pathname;
    var reg = /^\/(e[ns]\/)?account($|\/|\?|#)/;
    var delay = 60000 * 29;
    if (reg.exec(pathName) != null) {
        $timeout(function() {
            $window.location.href = '/auth/login?timeout=true&url=' + encodeURIComponent(pathName);
        }, delay);
    }

    $scope.showLightbox = function (templateUrl) {
        $http.get('/api/marketing/getModal/' + templateUrl)
        .success(function (data) {
            $modal.open({
                scope: $scope,
                template: '<div class="modal-header">' +
                    '<a href="" ng-click="$dismiss()">Close</a>' +
                    '<h2>' + data.title + '</h2>' +
                    '</div>' +
                    '<div class="modal-body">' + data.content + '</div>'
            });
        })
    };

}]);