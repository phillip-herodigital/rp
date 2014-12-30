/* Mobile Plans Details Controller
 *
 */
ngApp.controller('MobilePlansDetailsCtrl', ['$scope', function ($scope) {

    $scope.numLines = 2;

    $scope.groupPlanCost = function (planCost, extraLineCost) {
        return planCost + (($scope.numLines - 1) * extraLineCost);
    };

}]);