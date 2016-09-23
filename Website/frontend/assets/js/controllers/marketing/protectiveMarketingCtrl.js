ngApp.controller('protectiveMarketingCtrl', ['$scope', 'scrollService', function ($scope, scrollService) {
    var navBar = $("#navBar"),
        navBarHeight = navBar.height(),
        navBarOffset = navBar.offset().top,
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
        scrollTop = 0;
    $scope.scrollTo = scrollService.scrollTo;

    var removeOtherHighlights = function (navItem) {
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

    $(window).scroll(function () {
        scrollTop = $(this).scrollTop();
        if (scrollTop >= navBarOffset - 38) {
            navBar.addClass("fixed");
        }
        else {
            navBar.removeClass("fixed");
        }
        if (scrollTop > tech.offset().top - navBarHeight - 38) {
            techNav.addClass("highlight");
            removeOtherHighlights(techNav);
        }
        else if (scrollTop > credit.offset().top - navBarHeight - 38) {
            creditNav.addClass("highlight");
            removeOtherHighlights(creditNav);
        }
        else if (scrollTop > identity.offset().top - navBarHeight - 38) {
            identityNav.addClass("highlight");
            removeOtherHighlights(identityNav);
        }
        else if (scrollTop > roadside.offset().top - navBarHeight - 38) {
            roadsideNav.addClass("highlight");
            removeOtherHighlights(roadsideNav);
        }
        else {
            virtualMDNav.addClass("highlight");
            removeOtherHighlights(virtualMDNav);
        }
    });
}]);
