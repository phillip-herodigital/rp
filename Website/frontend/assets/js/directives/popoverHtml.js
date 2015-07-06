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
