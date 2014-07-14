// Loading Message
// Rewritten to remove the need for transcluding.
ngApp.directive('loadingIndicator', ['$compile', function ($compile) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			var html = angular.element('<div class="loadingMessage" ng-show="isLoading"><span><img src="/frontend/assets/i/loading.gif" width="32" height="32" /> Loading...</span></div>');
			$compile(html)(scope);
			element.prepend(html);
		}
	};
}]);