ngApp.controller('protectiveMarketingCtrl', ['$scope', 'scrollService', function ($scope, scrollService) {
    var navBar = $("#navBar"),
        navBarHeight = navBar.height(),
        navBarOffset = navBar.offset().top,
        spacer = $("#spacer"),
        virtualMD = $("#virtualMD"),
        virtualMDNav = $("#virtualMDNav"),
        roadside = $("#roadside"),
        roadsideNav = $("#roadsideNav"),
        identity = $("#identity"),
        identityNav = $("#identityNav"),
        credit = $("#credit"),
        creditNav = $("#creditNav"),
        tech = $("#tech"),
        techNav = $("#techNav"),
        scrollTop = 0,
        removeOtherHighlights = function (navItem) {
            if (navItem != virtualMDNav && virtualMDNav.hasClass("highlight")) {
                virtualMDNav.removeClass("highlight");
            }
            if (navItem != roadsideNav && roadsideNav.hasClass("highlight")) {
                roadsideNav.removeClass("highlight");
            }
            if (navItem != identityNav && identityNav.hasClass("highlight")) {
                identityNav.removeClass("highlight");
            }
            if (navItem != creditNav && creditNav.hasClass("highlight")) {
                creditNav.removeClass("highlight");
            }
            if (navItem != techNav && techNav.hasClass("highlight")) {
                techNav.removeClass("highlight");
            }
        };
    $scope.scrollTo = scrollService.scrollTo;
    $scope.viewFeatures = false;
    $scope.viewFeatures1 = false;
    $scope.viewFeatures2 = false;
    $scope.viewFeatures3 = false;
    $scope.viewFeatures4 = false;
    
    $scope.scrollToTop = function () {
        jQuery('html, body').animate({
            scrollTop: 0
        }, '500');
    }

    $(window).scroll(function () {
        scrollTop = $(this).scrollTop();
        navBarHeight = navBar.height();
        if (scrollTop >= navBarOffset - 38) {
            navBar.addClass("fixed");
            spacer.css('height', navBarHeight + 'px');
        }
        else {
            navBar.removeClass("fixed");
            spacer.css('height', '0');
        }
        if (scrollTop > tech.offset().top - navBarHeight) {
            techNav.addClass("highlight");
            removeOtherHighlights(techNav);
        }
        else if (scrollTop > credit.offset().top - navBarHeight) {
            creditNav.addClass("highlight");
            removeOtherHighlights(creditNav);
        }
        else if (scrollTop > identity.offset().top - navBarHeight) {
            identityNav.addClass("highlight");
            removeOtherHighlights(identityNav);
        }
        else if (scrollTop > roadside.offset().top - navBarHeight) {
            roadsideNav.addClass("highlight");
            removeOtherHighlights(roadsideNav);
        }
        else {
            virtualMDNav.addClass("highlight");
            removeOtherHighlights(virtualMDNav);
        }
    });
}]);
