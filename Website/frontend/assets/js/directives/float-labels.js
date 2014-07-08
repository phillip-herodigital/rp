// Float Labels
ngApp.directive('floatLabel', ['$compile', function ($compile) {
    // The sole purpose of this directive is to apply the other directives in the standard usage. As such, this directive is kind of a hack.
    // Referenced http://stackoverflow.com/questions/19224028/add-directives-from-directive-in-angularjs.
    // We aren't using templates here because of the reliance of inner elements, which is generally a bad practice; this is why the directive is broken into Container and Target.
    return {
        restrict: 'A',
        priority: 1000,
        terminal: true,
        link: function link(scope, element, attrs) {
            var formEl = angular.element(element[0].querySelectorAll('input,select,textarea')[0]); // Get first form input
            var labelEl = angular.element(element[0].querySelectorAll('label')[0]); // Get first label

            formEl.attr('float-label-target', attrs['floatLabel'] || labelEl.text());
            element.attr('float-label-container', '');
            element.removeAttr("float-label"); //remove the attribute to avoid indefinite loop
            element.removeAttr("data-float-label"); //also remove the same attribute with data- prefix in case users specify data-common-things in the html

            $compile(element)(scope);
        }
    };
}]).directive('floatLabelContainer', ['$timeout', 'breakpoint', function ($timeout, breakpoint) {
    return {
        restrict: 'A',
        controller: function() {
            this.shouldAnimate = false; // Set to false while we set up default state
            this.isActive = false; // whether the label should be displayed as a float
            this.isEnabled = false; // whether we're to a size that should display the float-label
        },
        link: function (scope, element, attrs, ctrl) {
            var hasPlaceholder = false;

            var toggleClass = function (className) {
                return function (val) {
                    if (val)
                        element.addClass(className);
                    else
                        element.removeClass(className);
                }
            };

            var watches = [
                scope.$watch(function () { return ctrl.shouldAnimate; }, toggleClass('fl-animate')),
                scope.$watch(function () { return ctrl.isActive; }, toggleClass('fl-active')),
                scope.$watch(function () { return ctrl.isEnabled; }, toggleClass('fl-enabled')),

                scope.$watch(function () {
                    return breakpoint.breakpoint.name
                }, function (newValue, oldValue) {
                    if (newValue == 'phone') {
                        ctrl.isEnabled = true;
                    } else {
                        ctrl.isEnabled = false;
                    }
                }, true)
            ];
            element.on('$destroy', function () {
                angular.forEach(watches, function (elem) { elem(); });
            });

            $timeout(function () {
                // Wait for a model to be bound to turn on shouldAnimate; this causes it to just be displayed on page load if the field is already populated.
                ctrl.shouldAnimate = true;
            });
        }
    };
}]).directive('floatLabelTarget', [function () {
    return {
        restrict: 'A',
        require: ['^floatLabelContainer', '?ngModel'],
        link: function(scope, element, attr, ctrl)
        {
            var hasPlaceholder = !!element.attr('placeholder');
            var placeholderText = (attr['floatLabelTarget'] || '').replace(/\: *$/g, '');

            var floatLabelContainerController = ctrl[0];
            var ngModelController = ctrl[1];
            
            var watches = [];

            if (ngModelController) {
                watches.push(scope.$watch(function () { return ngModelController.$viewValue; }, function (value) {
                    floatLabelContainerController.isActive = !!value;
                }));
            }
            else {
                // mostly this is just to get it to work with html solutions where they didn't put the ngModel; not really a practical application.
                element.on('input keyup keydown paste cut change', function () {
                    floatLabelContainerController.isActive = !!element.val();
                });
            }

            if (!hasPlaceholder) {
                watches.push(scope.$watch(function () { return floatLabelContainerController.isEnabled; }, function (isEnabled) {
                    element.attr('placeholder', isEnabled ? placeholderText : '');
                }));
            }

            element.on('$destroy', function () {
                angular.forEach(watches, function (elem) { elem(); });
            });
        }
    };
}]);