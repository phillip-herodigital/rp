ngApp.directive( 'popoverHtmlPopup', [ function() {
    return {
        restrict: 'EA',
        replace: true,
        scope: { title: '@', content: '@', placement: '@', animation: '&', isOpen: '&' },
        templateUrl: 'template/popover/popover-html.html'
    };
}])

ngApp.directive( 'popoverHtml', [ '$compile', '$timeout', '$parse', '$window', '$tooltip', '$sce', function ( $compile, $timeout, $parse, $window, $tooltip, $sce ) {
    return $tooltip( 'popoverHtml', 'popover', 'click' );
}])

angular.module('popover-html', []).run(['$templateCache', function($templateCache) {
    $templateCache.put("template/popover/popover-html.html",
            "<div class=\"popover {{placement}}\" ng-class=\"{ in: isOpen(), fade: animation() }\">\n" +
            "  <div class=\"arrow\"></div>\n" +
            "\n" +
            "  <div class=\"popover-inner\">\n" +
            "      <h3 class=\"popover-title\" ng-bind=\"title\" ng-show=\"title\"></h3>\n" +
            "      <div class=\"popover-content\" bind-html-unsafe=\"content\">    </div>\n" +
            "  </div>\n" +
            "</div>\n" +
            "");
}]);