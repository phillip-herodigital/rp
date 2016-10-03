ngApp.controller('protectiveMarketingCtrl', ['$scope', 'scrollService', function ($scope, scrollService) {
    var navBar = $("#navBar"),
        navBarHeight = navBar.height(),
        navBarOffset = navBar.offset().top,
        spacer = $("#spacer"),
        virtualMD = $("#virtualMD"),
        roadside = $("#roadside"),
        identity = $("#identity"),
        credit = $("#credit"),
        tech = $("#tech"),
        scrollTop = 0,
        mobileOffset = 0;
    $scope.navHighlightIndex = -1;
    $scope.scrollTo = scrollService.scrollTo;
    $scope.viewFeatures = false;
    $scope.viewFeatures1 = false;
    $scope.viewFeatures2 = false;
    $scope.viewFeatures3 = false;
    $scope.viewFeatures4 = false;

    $(window).resize(function () {
        navBarOffset = navBar.offset().top;
        navBarHeight = navBar.height();
        if ($(this).width() < 767) {
            mobileOffset = 57;
        }
        scrollFunction();
    });

    $(window).scroll(function () {
        scrollFunction();
    });

    var scrollFunction = function () {
        scrollTop = $(window).scrollTop();
        if (scrollTop > (navBarOffset - mobileOffset)) {
            navBar.addClass("fixed");
            spacer.css('height', navBarHeight + 'px');
        }
        else {
            navBar.removeClass("fixed");
            spacer.css('height', '0');
        }
        $scope.$apply(function () {
            if (scrollTop >= tech.offset().top - navBarHeight) {
                $scope.navHighlightIndex = 4;
            }
            else if (scrollTop > credit.offset().top - navBarHeight) {
                $scope.navHighlightIndex = 3;
            }
            else if (scrollTop > identity.offset().top - navBarHeight) {
                $scope.navHighlightIndex = 2;
            }
            else if (scrollTop > roadside.offset().top - navBarHeight) {
                $scope.navHighlightIndex = 1;
            }
            else if (scrollTop > virtualMD.offset().top - navBarHeight) {
                $scope.navHighlightIndex = 0;
            }
            else {
                $scope.navHighlightIndex = -1;
            }
        })
    };
}]);
