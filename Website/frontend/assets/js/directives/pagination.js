appRD.directive('paginate', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        scope: true,
        require: '?ngModel',
        link: function(scope, elem, attrs, model) {

            // Debug warnings...

            if (!model) {
                console.warn('Need to set ng-model="model.items" on element, where model.items is the array you are paginating', elem);
                return false;
            }

            // Public Methods

            scope.setCurrentPage = function(val) {
                if (val < 1 || val > scope.numPages) {
                    return;
                }
                scope.currentPage = val;
                refresh();
            };

            // Private Methods

            var refresh = function(reset) {
                scope.currentPage = (reset == true || !scope.currentPage) ? 1 : scope.currentPage;
                scope.pageSize = numPerPage();
                scope.numPages = Math.ceil(model.$modelValue.length / scope.pageSize);

                if (scope.currentPage > scope.numPages) {
                    scope.currentPage = scope.numPages;
                }

                scope.startingItem = (scope.currentPage - 1) * scope.pageSize;
                scope.rangeStart = scope.startingItem + 1;
                scope.rangeEnd = (scope.startingItem + numPerPage() > scope.totalItems) ? scope.totalItems : scope.startingItem + numPerPage();
                scope.totalItems = model.$modelValue.length;

                if (attrs.numRows) {
                    scope.itemWidth = 100 / (scope.pageSize / attrs.numRows) + '%';
                }

                /*$timeout(function() {
					$(".truncate").dotdotdot({
						debug: false
					});
				}, 0);*/
            },
                numPerPage = function() {
                    if (attrs.numRows) {
                        var minItemWidth = 260,
                            containerWidth = $(elem).outerWidth(),
                            numPerRow = Math.floor(containerWidth / minItemWidth);

                        return numPerRow * attrs.numRows;
                    }
                    else {
                        return parseInt(attrs.itemsPerPage, 10) || 10;
                    }
                },
                getEleWidth = function() {
                    return $(elem).outerWidth();
                };

            // Watches

            scope.$watch(function () {
                return model.$modelValue;
            }, function(newVal, oldVal) {
                refresh(true);
            });

            scope.$watch(getEleWidth, function(newValue, oldValue) {
                refresh();
            });

            window.onresize = function() {
                scope.$apply();
            };
        }
    };
}]);