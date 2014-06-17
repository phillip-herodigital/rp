// Additional Fields
ngApp.directive('additionalFields', ['jQuery', function (jQuery) {
	return {
		restrict: 'A',
		scope: true,
		link: function(scope, element, attrs) {
			var $fieldGroup = jQuery(element).next();

			scope.isOpen = attrs.additionalFields == 'open' ? true : false;

			//Hide the fieldGroup if true is not passed in
			if(!scope.isOpen) {
				$fieldGroup.hide();
			}

			//Toggle the fieldGroup visibility
			scope.toggleFields = function() {
				$fieldGroup.slideToggle(250, function() {
					scope.isOpen = !scope.isOpen;
					scope.$apply();
					$fieldGroup.css('overflow','visible');
					var $details = $fieldGroup.parent().find('a.details-link');
				});
			};		
		}
	};
}]);