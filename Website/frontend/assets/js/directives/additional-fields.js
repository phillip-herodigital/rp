// Additional Fields
ngApp.directive('additionalFields', ['jQuery', function (jQuery) {
	return {
		restrict: 'A',
		scope: true,
		link: function(scope, element, attrs) {
			var $fieldGroup = jQuery(element).find('.additional-fields');

			scope.isOpen = attrs.additionalFields == 'open' ? true : false;

			//Hide the fieldGroup if true is not passed in
			if(!scope.isOpen) {
				$fieldGroup.hide();
			}

			//Toggle the fieldGroup visibility
			scope.toggleFields = function () {
			    $fieldGroup.slideToggle(250, function () {
			        scope.isOpen = !scope.isOpen;
			        scope.updateFields();
			    });
			};

			scope.showFields = function () {
			    if (!scope.isOpen) {
			        $fieldGroup.slideDown(250, function () {
			            scope.isOpen = true;
			            scope.updateFields();
			        });
			    }
			};

			scope.hideFields = function () {
			    if (scope.isOpen) {
			        $fieldGroup.slideUp(250, function () {
			            scope.isOpen = false;
			            scope.updateFields();
			        });
			    }
			};

			scope.updateFields = function () {
			    scope.$apply();
			    $fieldGroup.css('overflow', 'visible');
			};
		}
	};
}]);