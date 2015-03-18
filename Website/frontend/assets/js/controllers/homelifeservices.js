/* HomeLife Services Controller
 *
 */
ngApp.controller('HomeLifeServicesCtrl', ['$scope', '$rootScope', '$http', '$timeout', function ($scope, $rootScope, $http, $timeout) {
    $scope.identity = $scope.support = $scope.monitoring = false;
    $scope.campaignName = $scope.productCode = "";
    $scope.freeMonth = false;
    $scope.identity = true;
    $scope.monitoring = true;
    $scope.init = function (freeMonth) {
        $scope.freeMonth = freeMonth;
    };
    $scope.enroll = function (campaignName) {
        // Set the trial vs no trial 01/02 tag
        $scope.campaignName = campaignName + ($scope.freeMonth ? "02" : "01");

        // Based on the Campaign set the Product Code
        switch ($scope.campaignName) {
            case 'seid01':
            case 'seidcr01':
            case 'seidit01':
            case 'seidcrit01':
                $scope.productCode = 'SE4531';
                break;
            case 'seid02':
            case 'seidcr02':
            case 'seidit02':
            case 'seidcrit02':
                $scope.productCode = 'SE4532';
                break;
            case 'secr01':
            case 'secrit01':
                $scope.productCode = 'SE4521';
                break;
            case 'secr02':
            case 'secrit02':
                $scope.productCode = 'SE4522';
                break;
            case 'seit01':
                $scope.productCode = 'SE4541';
                break;
            case 'seit02':
                $scope.productCode = 'SE4542';
                break;
            default:
                $scope.productCode = 'UNKNOWN';
                break;
        }

        document.getElementById("campaignName").value = $scope.campaignName;
        document.getElementById("productCode").value = $scope.productCode;

        // Submit the form to Ocenture
        $timeout(function () {
            document.getElementById("formHomeLifeServices").submit();
        }, 10);
    };
    $scope.goldenroll = function () {
        if ($scope.numProductsChecked() < 2) return;
        var campaignName = "se";
        if ($scope.identity) campaignName += "id";
        if ($scope.monitoring) campaignName += "cr";
        if ($scope.support) campaignName += "it";
        $scope.enroll(campaignName);
    };
    $scope.numProductsChecked = function () {
        var num = 0;
        if ($scope.identity) num++;
        if ($scope.support) num++;
        if ($scope.monitoring) num++;
        return num;
    };
}]);