/* Currents Controller
 *
 */
ngApp.controller('CurrentsCtrl', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
    $scope.currentItem = '';
    $scope.searchHeading = '';
    $scope.categoryID = '';
    $scope.authorID = '';
    $scope.tagID = '';
    $scope.searchText = '';
    $scope.isLoading = false;
    $scope.currentPage = 1;
    var startRow = 1;
    var maxRows = 16;

    $scope.loadMore = function () {
        $scope.isLoading = true;
        startRow = ($scope.currentPage) * maxRows
        $http.post('/api/currents/LoadPosts', {
            currentItemId: $scope.currentItem,
            categoryID: $scope.categoryID, 
            authorID: $scope.authorID, 
            tagID: $scope.tagID, 
            searchText: $scope.searchText, 
            startRowIndex: startRow, 
            maximumRows: maxRows, 
            language: $scope.language
        }).success(function (data) {
            $scope.isLoading = false;
            $scope.currentPage += 1;
            var $item = $(data.html);
            $('.currents-grid').append($item).isotope('appended', $item);
        });
    };

    angular.element(document).ready(function () {
        $('.currents-grid').isotope({
            itemSelector: '.grid-item',
            percentPosition: true,
            masonry: {
                columnWidth: '.grid-sizer',
                gutter: '.gutter-sizer'
            }
        });
    });

}]);