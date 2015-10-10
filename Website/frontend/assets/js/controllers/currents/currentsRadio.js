/* Currents Radio Controller
 *
 */
ngApp.controller('CurrentsRadioCtrl', ['$scope', '$window', '$http', function ($scope, $window, $http) {
    $scope.months = "";
    $scope.currentPage = 1;
    var startRow = 1;
    var maxRows = 16;

    $http.get('/api/currents/GetCurrentsRadioMonths')
        .success(function (data) {
            $scope.months = data;
        });

    $scope.selectMonth = function (month) {
        $http.post('/api/currents/GetCurrentsRadioFromFilter', {
            filter: month
        }).success(function (data) {
            var $item = $(data.html);
            $('.radio-grid').empty();
            $('.radio-grid').append($item).isotope('appended', $item);
        });
    };

    $scope.loadMore = function () {
        startRow = ($scope.currentPage) * maxRows
        $http.post('/api/currents/LoadRadio', {
            currentItemId: "",
            startRowIndex: startRow,
            maximumRows: maxRows,
            language: ""
        }).success(function (data) {
            $scope.currentPage += 1;
            var $item = $(data.html);
            $('.radio-grid').append($item).isotope('appended', $item);
        });
    };
}]);