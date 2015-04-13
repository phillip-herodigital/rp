/* Mobile Plans Details Controller
 *
 */
ngApp.controller('MobileValidateEsnCtrl', ['$scope', '$http', '$sce', '$modal', function ($scope, $http, $sce, $modal) {

    $scope.form = {
        esn: null
    };
    $scope.esnValidationMessages = [];

    $scope.validateESN = function () {
        $scope.esnError = $scope.esnValid = false;
        $http.post('/api/enrollment/validateEsn', $scope.form.esn, { transformRequest: function (code) { return JSON.stringify(code); } })
        .success(function (data) {
            var esnResponse = JSON.parse(data);
            if (esnResponse != 'success') {
                $scope.esnError = true;
                $scope.esnMessage = $sce.trustAsHtml(_.find($scope.esnValidationMessages, function (message) {
                    return message.code.toLowerCase() == esnResponse.toLowerCase();
                }).message);
            } else {
                $scope.esnValid = true;
            }
        })
    };

    $scope.showModal = function (templateUrl) {
        $modal.open({
            'scope': $scope,
            'templateUrl': templateUrl
        })
    };

}]);