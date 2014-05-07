// Float Labels
ngApp.directive('floatLabel', ['$timeout', '$parse', 'breakpoint', function ($timeout, $parse, breakpoint) {
	return {
	    restrict: 'A',
        scope: true,
        template: '<div ng-class="{\'fl-enabled\': isEnabled, \'fl-active\': isActive}" ng-transclude></div>',
	    transclude: true,
        replace: true,
		link: function(scope, element, attrs) {
		    var formEl = angular.element(element[0].querySelectorAll('input,select,textarea')[0]); // Get first form input

		    formEl.on('propertychange keyup input paste', function () {
		        if (formEl.val() === '') {
		            scope.isActive = false;
		            scope.$apply();
		        } else {
		            scope.isActive = true;
		            scope.$apply();
		        }
		    });

            // Check if a model is bound to element, and bind watch
		    var modelValue = $parse(formEl.attr('ng-model'));
		    scope.$watch(modelValue, function (newValue, oldValue) {
		        if (newValue === '') {
		            scope.isActive = false;
		        } else {
		            scope.isActive = true;
		        }
		    });

		    scope.$watch(function () {
		        return breakpoint.breakpoint.name
		    }, function (newValue, oldValue) {
		        if (newValue == 'phone') {
		            scope.isEnabled = true;
		        } else {
		            scope.isEnabled = false;
		        }
		    }, true);

		    $timeout(function () {
                // Wait for a model to be bound
		        formEl.triggerHandler('keyup');
		    });
            
		}
	};
}]);