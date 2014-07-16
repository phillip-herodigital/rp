// Button Selector
ngApp
    .constant('buttonConfig', {
        unselectedText: 'Select',
        selectedText: 'Selected',
        selectedIcon: '<i class="icon-check"></i>',
        selectedClass: 'selected',
        toggleEvent: 'click'
    })
    .controller('ButtonSelectorController', ['buttonConfig', function (buttonConfig) {
        this.unselectedText = buttonConfig.unselectedText || 'Select';
        this.selectedText = buttonConfig.selectedText || 'Selected';
        this.selectedIcon = buttonConfig.selectedIcon || '<i class="icon-check"></i>';
        this.selectedClass = buttonConfig.selectedClass || 'selected';
        this.toggleEvent = buttonConfig.toggleEvent || 'click';
    }])
    .directive('buttonSelector', [function () {
        return {
            require: ['buttonSelector', 'ngModel'],
            controller: 'ButtonSelectorController',
            link: function (scope, element, attrs, ctrls) {
                var buttonsCtrl = ctrls[0], ngModelCtrl = ctrls[1];

                //model -> UI
                ngModelCtrl.$render = function () {
                    element.toggleClass(buttonsCtrl.selectedClass, angular.equals(ngModelCtrl.$modelValue, scope.$eval(attrs.buttonSelector)));
                    scope.isSelected = element.hasClass(buttonsCtrl.selectedClass);
                };

                //ui->model
                element.bind('click', function () {
                    //We want them to be able to remove a selection    
                    scope.$apply(function () {
                        ngModelCtrl.$setViewValue(scope.isSelected ? null : scope.$eval(attrs.buttonSelector));
                        ngModelCtrl.$render();
                    });
                });
            }
        };
    }]);