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

                    var isSelected = element.hasClass(buttonsCtrl.selectedClass);

                    if (isSelected) {
                        element.html(buttonsCtrl.selectedIcon + ' ' + buttonsCtrl.selectedText);
                    } else {
                        element.html(buttonsCtrl.unselectedText);
                    }
                };

                //ui->model
                element.bind('click', function () {
                    var isSelected = element.hasClass(buttonsCtrl.selectedClass);

                    if (!isSelected) {
                        scope.$apply(function () {
                            ngModelCtrl.$setViewValue(isSelected ? null : scope.$eval(attrs.buttonSelector));
                            ngModelCtrl.$render();
                        });
                    }
                });
            }
        };
    }]);