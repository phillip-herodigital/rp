// Slide Toggle
ngApp.directive('slideToggle', ['jQuery', function (jQuery) {
	return {
		restrict: 'A',
		scope: true,
		link: function(scope, element, attrs) {
			var $slidePanel = element.find('.slide-toggle');

			scope.isOpen = attrs.slideToggle == 'open' ? true : false;

			//Hide the slidePanel if true is not passed in
			if(!scope.isOpen) {
				$slidePanel.hide();
			}

			//Toggle the slidePanel visibility
			scope.toggleSlide = function() {
				$slidePanel.slideToggle(300, function() {
					scope.isOpen = !scope.isOpen;
					scope.$apply();
				});
			};		
		}
	};
}]);