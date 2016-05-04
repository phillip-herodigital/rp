/* HomeLife Services Controller
 *
 */
ngApp.controller('HomeLifeServicesCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$window', function ($scope, $rootScope, $http, $timeout, $window) {
    $scope.campaignName = $scope.productCode = "";
    $scope.freeMonth = false;
    var domain = null;
    $scope.init = function (freeMonth, d) {
        $scope.freeMonth = freeMonth;
        domain = d;
    };
    $scope.enroll = function () {
        if ($scope.numProductsChecked() == 3) {
            document.getElementById("campaignName").value = getCampaignName();

            //Currently Ocenture is wanting to leave out the product code, but this might return in the future.
            //document.getElementById("productCode").value = $scope.productCode;

            // Submit the form to Ocenture
            $timeout(function () {
                document.getElementById("formHomeLifeServices").submit();
            }, 10);
        }
    };
    var getCampaignName = function() {
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

        campaignName += ($scope.freeMonth ? "02" : "01");

        return campaignName;
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