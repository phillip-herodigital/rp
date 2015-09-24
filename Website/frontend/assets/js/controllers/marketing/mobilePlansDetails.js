/* Mobile Plans Details Controller
 *
 */
ngApp.controller('MobilePlansDetailsCtrl', ['$scope', function ($scope) {
   
    $scope.numLines = 2;

    $scope.groupPlanCost = function (planCost, extraLineCost) {
        var cost = parseFloat(planCost) + (($scope.numLines - 1) * extraLineCost);
        return $scope.superCents(cost.toFixed(2));
    };

    $scope.superCents = function (planCost) {
        var array = planCost.toString().split('.');
        var planCostFinal = "";
        if (array.length > 1 && array[1] != "00") {
            planCostFinal = '$' + array[0] + "<sup>." + array[1] + "</sup>";
        } else {
            planCostFinal = '$' + array[0];
        }
        return planCostFinal;
    }
}]);