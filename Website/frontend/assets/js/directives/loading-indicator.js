// Loading Message
ngApp.directive('loadingIndicator', function ($rootScope, $filter, $parse) {
	return {
		restrict: 'A',
		transclude: true,
		template: '<div class="loadingMessage" ng-show="isLoading"><span><img src="assets/i/loading.gif" width="32" height="32" style="vertical-align: middle;" /> Loading...</span></div><div ng-transclude></div>',
		// <img src="assets/i/loading.gif" width="32" height="32" style="vertical-align: middle;" /> Loading...
		link: function(scope, element, attrs) {

		}
	};
});