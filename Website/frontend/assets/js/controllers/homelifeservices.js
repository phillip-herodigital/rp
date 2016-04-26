/* HomeLife Services Controller
 *
 */
ngApp.controller('HomeLifeServicesCtrl', ['$scope', '$rootScope', '$http', '$timeout', function ($scope, $rootScope, $http, $timeout) {
    $scope.campaignName = $scope.productCode = "";
    $scope.freeMonth = false;
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
                $scope.productCode = 'SE4535';
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

        //Currently Ocenture is wanting to leave out the product code, but this might return in the future.
        //document.getElementById("productCode").value = $scope.productCode;

        // Submit the form to Ocenture
        $timeout(function () {
            document.getElementById("formHomeLifeServices").submit();
        }, 10);
    };
    $scope.bundleEnroll = function () {
        var campaignName = "se";
        if ($scope.identity && $scope.support && $scope.monitoring)
            campaignName += "idcrit";
        else if ($scope.identity && $scope.support && $scope.roadside)
            campaignName += "iditra";
        else if ($scope.identity && $scope.support && $scope.virtualmd)
            campaignName += "iditth";
        else if ($scope.identity && $scope.monitoring && $scope.roadside)
            campaignName += "idcrra";
        else if ($scope.identity && $scope.monitoring && $scope.virtualmd)
            campaignName += "idcrth";
        else if ($scope.identity && $scope.virtualmd && $scope.roadside)
            campaignName += "idthra";
        else if ($scope.support && $scope.monitoring && $scope.roadside)
            campaignName += "itcrra";
        else if ($scope.support && $scope.monitoring && $scope.virtualmd)
            campaignName += "itcrth";
        else if ($scope.support && $scope.virtualmd && $scope.roadside)
            campaignName += "itrath";
        else if ($scope.monitoring && $scope.virtualmd && $scope.roadside)
            campaignName += "crrath";

        $scope.enroll(campaignName);
    };
    $scope.numProductsChecked = function () {
        var num = 0;
        if ($scope.identity) num++;
        if ($scope.support) num++;
        if ($scope.monitoring) num++;
        if ($scope.virtualmd) num++;
        if ($scope.roadside) num++;
        return num;
    };
}]);