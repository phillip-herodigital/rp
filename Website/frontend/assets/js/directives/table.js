// General use data table
ngApp.directive('gridTable', function ($rootScope, $filter, $parse) {
	return {
		restrict: 'A',
		scope: true,
		require: '?ngModel',
		// The linking function will add behavior to the template
		link: function(scope, element, attrs, model) {
			// Table data

			/*var ajaxParams = $parse('ajaxParams');
			console.log(ajaxParams(scope));
			ajaxParams.assign(scope, "New name");*/

			var isAjax = (attrs.ajax != undefined) ? true : false;

			scope.$watch(function () {
				return model.$modelValue;
			}, function(newVal, oldVal) {
				init(newVal);
			}, true);

			if (isAjax) {
				scope.$watch('table', function(newVal, oldVal) {
					if (newVal !== oldVal) {
						scope.table.pagingOptions.totalServerItems = newVal.totalItemCount;
					}
				}, true);
			}

			var init = function(data) {
				
				if (typeof data != "object") {
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

				scope.sortFieldName = '';
				scope.sortOrder = false;

				updatePagingOptions(scope.table.pagingOptions);
			};

			// Range function similar to Python range
			var rangePage = function(stop) {
				var start = (stop - 10) + 1;
				start = start <= 0 ? 1 : start;
				var result = [];
				for (var i = start; i <= stop; i += 1) {
					result.push(i);
				}
				return result;
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
				scope.table.pageRange = rangePage(scope.table.pageNum);
			};

			scope.$watch('table.pagingOptions', function(newVal, oldVal) {
				if (newVal !== oldVal) {
					if (!isAjax) {
						updatePagingOptions(newVal);
					}
				}
			}, true);

			scope.toggleCheckboxes = function() {

				angular.forEach(scope.table.valuesToShow, function(item) {
					item.selected = scope.toggleCheckbox;

					//var sel = $parse('selected');
					//sel.assign(item, scope.toggleCheckbox);
				});

			};

			// Expand row by the index of "inner table"
			scope.expandInnerTable = function (index) {
				scope.expand[index] = !scope.expand[index];
			};

			scope.updateAjaxCallback = function() {
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
						scope.updateAjaxCallback();
					}
				}
			};

			// Previous page
			scope.previousPage = function() {
				if (scope.table.pagingOptions.currentPage > 1) {
					scope.table.pagingOptions.currentPage -= 1;
					if (isAjax) {
						scope.updateAjaxCallback();
					}
				}
			};

			// Next page
			scope.nextPage = function() {
				if (scope.table.pagingOptions.currentPage < scope.table.pageNum) {
					scope.table.pagingOptions.currentPage += 1;
					if (isAjax) {
						scope.updateAjaxCallback();
					}
				}
			};

			// Last page
			scope.lastPage = function() {
				if (scope.table.pagingOptions.currentPage < scope.table.pageNum) {
					scope.table.pagingOptions.currentPage = scope.table.pageNum;
					if (isAjax) {
						scope.updateAjaxCallback();
					}
				}
			};

			scope.updatePageSize = function() {
				if (isAjax) {
					scope.updateAjaxCallback();
				}
			};

			// Select page by number
			scope.selectPageNumber = function(numberPage) {
				scope.table.pagingOptions.currentPage = numberPage;
				if (isAjax) {
					scope.updateAjaxCallback();
				}
			};

			scope.updateSort = function(item) {

				scope.table.values = $filter('orderBy')(scope.table.values, item.field, item.sortOrder);
				scope.sortFieldName = item.field;
				scope.sortOrder = item.sortOrder;

				item.sortOrder = !item.sortOrder;

				if (isAjax) {
					scope.updateAjaxCallback();
				} else {
					scope.table.pagingOptions.currentPage = 1;
					updatePagingOptions(scope.table.pagingOptions);
				}

			};

		}
	};
});