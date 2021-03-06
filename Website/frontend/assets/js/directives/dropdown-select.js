﻿// Dropdown Select
ngApp.directive('dropdownSelect', [function () {
    return {
        restrict: 'AE', //element or attribute
        scope: {
            dropdownItems: '=',
            value: '=',
            disabled: '='
        },
        replace: true,
        controller: ["$scope", function ($scope) {
            if ($scope.value) {
                angular.forEach($scope.dropdownItems, function (item) {
                    if (item.value == $scope.value) {
                        $scope.selectedItem = item;
                    }
                });
            } else {
                $scope.selectedItem = {
                    'class': '',
                    'name': 'Please Choose'
                };
            }

            $scope.selectItem = function (item) {
                $scope.selectedItem = item;
                $scope.status.isopen = false;
                $scope.value = item.value;
            };
        }],
        template: '<div class="btn-dropdown" dropdown on-toggle="toggled(open)" is-open="status.isopen">' +
            '<button type="button" class="btn btn-primary dropdown-toggle {{selectedItem.class}}" ng-disabled="disabled" dropdown-toggle>' +
            '{{selectedItem.name}} <span ng-show="!disabled" class="caret"><i class="icon-nav-arrow-collapsed"></i></span>' +
            '</button>' +
            '<ul class="dropdown-menu dropdown-menu-{{alignment}}" role="menu">' +
            '<li ng-repeat="item in dropdownItems"><a class="{{item.class}}" ng-click="selectItem(item);" href="">{{item.name}}</a></li>' +
             '</ul></div>',
        link: function (scope, element, attrs, ctrl) {
            scope.alignment = attrs.alignment || 'left';
        }
    };
}]);