// Loading Message
ngApp.directive('loadingIndicator', [function () {
	return {
		restrict: 'A',
		transclude: true,
		template: '<div class="loadingMessage" ng-show="isLoading"><span><img src="assets/i/loading.gif" width="32" height="32" /> Loading...</span></div><div ng-transclude></div>',
		link: function(scope, element, attrs) {

		}
	};
}]);