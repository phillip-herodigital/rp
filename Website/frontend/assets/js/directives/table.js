// General use data table
ngApp.directive('gridTable', ['$filter', 'breakpoint', 'jQuery', function ($filter, breakpoint, jQuery) {
	return {
		restrict: 'A',
		scope: true,
		require: '?ngModel',
		// transclude: true,
		// template: '<div><div ng-transclude></div><div grid-table-pagination></div></div>',
		//replace: true,
		link: function(scope, element, attrs, model) {
			// Table data

			/*var ajaxParams = $parse('ajaxParams');
			console.log(ajaxParams(scope));
			ajaxParams.assign(scope, "New name");*/

			var isAjax = (attrs.ajax != undefined) ? true : false;

			scope.$watch(attrs.ngModel, function (newVal, oldVal) {
				init(newVal);
			}, true);

			if (isAjax) {
				scope.$watch('table', function(newVal, oldVal) {
					if (newVal !== oldVal) {
						scope.table.pagingOptions.totalServerItems = newVal.totalItemCount;
					}
				}, true);
				scope.$watch('table.pagingOptions.pageSize', updateAjaxCallback);
			}

			// Initial sort
			scope.$watch('table.columnList.length', function(newVal, oldVal) {
				if (newVal !== oldVal) {
					var initialSort = _.find(scope.table.columnList, function(col) {
						return _.has(col,'initialSort');
					});
					if (initialSort) {
						scope.updateSort(initialSort);
					}
				}
			}, true);

			var init = function(data) {
				
				if (typeof data != "object" || jQuery.isEmptyObject(data)) {
					// Maybe want to hide the table, or something?
					// Also, might want to make this a better check... Just because it's an object, doesn't mean it's in the right format. :)
					return;
				}

				scope.table = data;
				
				// Initialize the sortOrder properties, if they don't exist
				for(var i=0; i<scope.table.columnList.length; i++) {
					if (!scope.table.columnList[i].hasOwnProperty('sortOrder')) {
						scope.table.columnList[i].sortOrder = false;
					}
				}

				// Pagination default settings
				scope.table.pagingOptions = scope.table.pagingOptions || {};

				// Extending the object, so it will prototypically inherit from the parent: http://stackoverflow.com/a/16846721/1824831
				angular.extend(scope.table.pagingOptions, {
					pageSizes: [5, 10, 15, 20],                                                   // list of available page sizes
					pageSize: scope.table.pagingOptions.pageSize || 5,                                        // currently selected page size
					totalServerItems: scope.table.pagingOptions.totalItemCount || scope.table.values.length,  // total items are on the server
					currentPage: scope.table.pagingOptions.currentPage || 1                                   // the current page
				});

				scope.expand = [];
				for (var i = 0, len = scope.table.values.length; i < len; i++) {
					scope.expand.push(false);
				}

				scope.sortFieldName = '';
				scope.sortOrder = false;

				updatePagingOptions(scope.table.pagingOptions);

				// check for iPad since breakpoints dont work there
				if (breakpoint.breakpoint == null) {
					scope.toggleResponsiveColumns('tablet');
				} else {
					scope.toggleResponsiveColumns(breakpoint.breakpoint.name);
				}
				
			};

			var checkForHiddenColumns = function() {
				scope.hasHiddenColumns = $filter('filter')(scope.table.columnList, { 'isVisible': false }).length || scope.showExpand ? true : false;
			};

			// Range function similar to Python range
			var rangePage = function(stop, currentPage) {
			    var start = Math.max(1, Math.min(stop - 4, currentPage - 2));
			    var end = Math.min(stop, Math.max(start + 4, currentPage + 2));
				return _.range(start, end + 1);
			};

			// Filter table values by pagingOptions
			var updatePagingOptions = function (pagingOptions) {
				var pageSize = parseInt(pagingOptions.pageSize);

				scope.table.startPos = (pagingOptions.currentPage - 1) * pageSize + 1;
				scope.table.endPos = Math.min(scope.table.startPos + pageSize - 1, pagingOptions.totalServerItems);

				if(!isAjax) {
					scope.table.valuesToShow = scope.table.values.slice(scope.table.startPos - 1, scope.table.endPos);
				} else {
					scope.table.valuesToShow = scope.table.values;
				}
				
				scope.table.pageNum = Math.ceil(pagingOptions.totalServerItems / pageSize);
				scope.table.pageRange = rangePage(scope.table.pageNum, scope.table.pagingOptions.currentPage || 1);
			};

			scope.$watch('table.pageNum', function (newVal) {
				if (!scope.table)
					return;
				if (newVal < scope.table.pagingOptions.currentPage) {
					scope.table.pagingOptions.currentPage = scope.table.pageNum;
					if (isAjax) {
						updateAjaxCallback();
					}
				}
			});

			scope.$watch('table.pagingOptions', function(newVal, oldVal) {
				if (newVal !== oldVal) {
					if (!isAjax) {
						updatePagingOptions(newVal);
					}
				}
			}, true);

			scope.toggleCheckboxes = function() {

				angular.forEach(scope.table.valuesToShow, function(item) {
					item.selected = scope.table.toggleCheckbox;

					//var sel = $parse('selected');
					//sel.assign(item, scope.toggleCheckbox);
				});

			};

			scope.showColumn = function(field) {

				var field = $filter('filter')(scope.table.columnList, { 'field': field });
				return field[0].isVisible;
			};

			// Expand row by the index of "inner table"
			scope.expandInnerTable = function (index) {
				scope.expand[index] = !scope.expand[index];
			};

			function updateAjaxCallback() {
				// If this is an ajax table, call updateTableAjax on parent controller
				if (typeof scope[attrs.ajax] == "function") {
					// Call our callback function, and pass in the pagingOptions

					var data = {
						paginatedListRequest: scope.table.pagingOptions,
						//sortFieldId: 0,
						sortFieldName: scope.sortFieldName,
						sortOrder: scope.sortOrder
					};
					scope[attrs.ajax](data);
				} else {
					console.error(attrs.ajax + " is not a function.");
				}
			}

			// First page
			scope.firstPage = function() {
				if (scope.table.pagingOptions.currentPage > 1) {
					scope.table.pagingOptions.currentPage = 0;
					if (isAjax) {
						updateAjaxCallback();
					}
				}
			};

			// Previous page
			scope.previousPage = function() {
				if (scope.table.pagingOptions.currentPage > 1) {
					scope.table.pagingOptions.currentPage -= 1;
					if (isAjax) {
						updateAjaxCallback();
					}
				}
			};

			// Next page
			scope.nextPage = function() {
				if (scope.table.pagingOptions.currentPage < scope.table.pageNum) {
					scope.table.pagingOptions.currentPage += 1;
					if (isAjax) {
						updateAjaxCallback();
					}
				}
			};

			// Last page
			scope.lastPage = function() {
				if (scope.table.pagingOptions.currentPage < scope.table.pageNum) {
					scope.table.pagingOptions.currentPage = scope.table.pageNum;
					if (isAjax) {
						updateAjaxCallback();
					}
				}
			};

			// Select page by number
			scope.selectPageNumber = function(numberPage) {
				scope.table.pagingOptions.currentPage = numberPage;
				if (isAjax) {
					updateAjaxCallback();
				}
			};

			scope.updateSort = function(item) {

				scope.table.values = $filter('orderBy')(scope.table.values, item.field, item.sortOrder);
				scope.sortFieldName = item.field;
				scope.sortOrder = item.sortOrder;

				item.sortOrder = !item.sortOrder;

				if (isAjax) {
					updateAjaxCallback();
				} else {
					scope.table.pagingOptions.currentPage = 1;
					updatePagingOptions(scope.table.pagingOptions);
				}

			};

			// Responsive Tables

			scope.toggleResponsiveColumns = function(breakpoint) {
				angular.forEach(scope.table.columnList, function (col) {
					col.isVisible = jQuery.inArray(breakpoint, col.hide) === -1;
				});
				checkForHiddenColumns();
			};

			scope.$watch(function () {
				// check for iPad since breakpoints dont work there
				return (breakpoint.breakpoint == null) ? 'tablet' : breakpoint.breakpoint.name;
			}, function (newValue, oldValue) {
				if (newValue !== oldValue) {
					scope.toggleResponsiveColumns(newValue);
				}
			}, true);

		}
	};
}]);

ngApp.directive('gridTableHeader', [function () {
	return {
		restrict: 'A',
		transclude: true,
		template:	'<thead>' +
					'	<tr>' +
					'		<th style="width:30px;" ng-if="hasCheckboxes">' +
					'			<input type="checkbox" ng-model="table.toggleCheckbox" ng-change="toggleCheckboxes()" />' +
					'		</th>' +
					'		<th ng-repeat="item in table.columnList | filter:{isVisible: true} | orderBy:\'displayOrder\'" ng-click="updateSort(item)">' +
					'			<span>{{ item.displayName }}</span>' +
					'		</th>' +
					'		<th style="width:30px;" ng-if="hasHiddenColumns"></th>' +
					'	</tr>' +
					'</thead>',
		replace: true,
		link: function(scope, element, attrs, model) {
			scope.hasCheckboxes = attrs.checkboxes || false;
		}
	};
}]);

ngApp.directive('gridTablePagination', [function () {
	return {
		restrict: 'A',
		transclude: true,
		template:	'<tfoot ng-if="table.pagingOptions.totalServerItems > table.pagingOptions.pageSizes[0]">' +
					'	<tr>' +
					'		<td colspan="{{table.columnList.length+1}}" class="pagination">' +
					'			<div class="page-size">' +
					'				Show: <select ng-model="table.pagingOptions.pageSize">' +
					'					<option ng-repeat="size in table.pagingOptions.pageSizes">{{ size }}</option>' +
					'				</select>' +
					'				entries.' +
					'			</div>' +
					'			<p class="showing">' +
					'				Showing <strong>{{ table.startPos }}-{{ table.endPos }}</strong> of <strong>{{ table.pagingOptions.totalServerItems }}</strong> Items' +
					'			</p>' +
					'			<ul class="page-selection" ng-if="table.pageRange.length > 1">' +
					'				<li ng-class="{disabled: table.pagingOptions.currentPage == 1}"><a href="" ng-click="firstPage()"><i class="icon-arrow-left"></i> First</a></li>' +
					'				<li ng-class="{disabled: table.pagingOptions.currentPage == 1}"><a href="" ng-click="previousPage()"><i class="icon-arrow-left"></i> Previous</a></li>' +
					'				<li ng-repeat="number in table.pageRange" class="page-number">' +
					'					<a ng-class="{selected: number == table.pagingOptions.currentPage}" ng-click="selectPageNumber(number)" ng-bind="number"></a>' +
					'				</li>' +
					'				<li ng-class="{disabled: table.pagingOptions.currentPage == table.pageNum}"><a href="" ng-click="nextPage()">Next <i class="icon-arrow-right"></i></a></li>' +
					'				<li ng-class="{disabled: table.pagingOptions.currentPage == table.pageNum}"><a href="" ng-click="lastPage()">Last <i class="icon-arrow-right"></i></a></li>' +
					'			</ul>' +
					'		</td>' +
					'	</tr>' +
					'</tfoot>',
		replace: true,
		link: function(scope, element, attrs, model) {

		}
	};
}]);