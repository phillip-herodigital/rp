angular.module('popover-html', []).run(['$templateCache', function($templateCache) {
    $templateCache.put("template/popover/popover-html.html",
        "<div class=\"popover-html {{placement}}\" ng-class=\"{ in: isOpen(), fade: animation() }\">\n" +
        "  <div class=\"arrow\"></div>\n" +
        "\n" +
        "  <div class=\"popover-inner\">\n" +
        "      <h3 class=\"popover-title\" ng-bind=\"title\" ng-show=\"title\"></h3>\n" +
        "      <div class=\"popover-content\" bind-html-unsafe=\"content\">    </div>\n" +
        "  </div>\n" +
        "</div>\n" +
        "");
}]);

