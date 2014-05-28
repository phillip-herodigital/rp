// Dropdown Select
ngApp.directive('dropdownSelect', [function () {
    return {
        restrict: 'AE', //element or attribute
        scope: {
            dropdownItems: '=',
            value: '=',
        },
        replace: true,
        controller: function ($scope) {
            $scope.selectedItem = {
                'class': '',
                'name' : 'Please Choose'
            };

            $scope.selectItem = function (item) {
                $scope.selectedItem = item;
                $scope.status.isopen = false;
                $scope.value = item.value;
            };
        },
        template: '<div class="btn-group" dropdown is-open="status.isopen">' +
            '<button type="button" class="btn btn-primary dropdown-toggle {{selectedItem.class}}" ng-disabled="disabled">' +
            '{{selectedItem.name}} <span class="caret"><i class="icon-nav-arrow-collapsed"></i></span>' +
            '</button>' +
            '<ul class="dropdown-menu" role="menu">' +
            '<li ng-repeat="item in dropdownItems"><a class="{{item.class}}" ng-click="selectItem(item);" href="">{{item.name}}</a></li>' +
             '</ul></div>',
        link: function (scope, element, attrs, ctrl) {

        }
    };
}]);