/**
 * This is an incredibly simplistic solution to fix the iOS fixed positioning
 * problem on input focus.
 *
 * Note: I cannot verify this completely works as I have no iOS devices to test on
 */
ngApp.directive('fixedFix', ['$window', 'jQuery', function ($window, jQuery) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			// Fix mobile floating toolbar when input is focused
			if(/iPhone|iPod|iPad/.test(window.navigator.userAgent)){
				$(document)
					.on('focus', 'textarea, input, select', function(e) {
						element.addClass('fixed-fix');
					})
					.on('blur', 'textarea, input, select', function(e) {
						element.removeClass('fixed-fix');
					});
			}		
		}
	};
}]);