// Button Selector
ngApp
    .constant('buttonConfig', {
        unselectedText: 'Select',
        selectedText: 'Selected',
        selectedIcon: '<i class="icon-check"></i>',
        selectedClass: 'active'
    })
    .controller('ButtonSelectorController', ['buttonConfig', function (buttonConfig) {
        this.unselectedText = buttonConfig.unselectedText || 'Select';
        this.selectedText = buttonConfig.selectedText || 'Selected';
        this.selectedIcon = buttonConfig.selectedIcon || '<i class="icon-check"></i>';
        this.selectedClass = buttonConfig.selectedClass || 'selected';
    }])
    .directive('buttonSelector', [function () {
        return {
            require: ['buttonSelector', 'ngModel'],
            controller: 'ButtonSelectorController',
            link: function (scope, element, attrs, ctrls) {
                var buttonsCtrl = ctrls[0], ngModelCtrl = ctrls[1];

                element.bind('click', function () {
                    console.log(element);
                });
            }
        };
    }]);