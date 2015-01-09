/* Data Usage Summary Controller
 *
 */
ngApp.controller('DataUsageSummaryCtrl', ['$scope', '$rootScope', '$http', 'breakpoint', 'notificationService', function ($scope, $rootScope, $http, breakpoint, notificationService) {
    var GIGA = 1000000000;

    $scope.data = {
        graphScale: {
            low: 0,
            middle: 0,
            high: 0
        },
        totalUsage: 0,
        estimatedUsage: 0,
        dataUsageLimit: 0, // Plan amount
        deviceUsage: []
    };

    $scope.showBreakdown = false;

    $scope.$watch('selectedAccount.accountNumber', function(newVal) { 
        if (newVal) {
            $scope.isLoading = true;
            $http({
                method: 'POST',
                url: '/api/account/getMobileUsage',
                data: {
                    accountNumber: newVal,
                },
                headers: { 'Content-Type': 'application/JSON' }
            })
			.success(function (data, status, headers, config) {
                $scope.data = angular.extend($scope.data, data);
                //$scope.data = angular.extend($scope.data, {"lastBillingDate":"2015-01-01T00:00:00","nextBillingDate":"2015-01-30T00:00:00","dataUsageLimit":15.0,"deviceUsage":[{"number":"1234561156","dataUsage":2873560776.33811,"messagesUsage":541.0,"minutesUsage":322.0},{"number":"1234561157","dataUsage":309601205.144169,"messagesUsage":834.0,"minutesUsage":21.0},{"number":"1234561155","dataUsage":68811227.5320427,"messagesUsage":247.0,"minutesUsage":623.0},{"number":"1234561158","dataUsage":3114350753.95024,"messagesUsage":128.0,"minutesUsage":720.0}]});

			    $scope.data.lastBillingDate = new Date($scope.data.lastBillingDate);
                $scope.data.nextBillingDate = new Date($scope.data.nextBillingDate);
                $scope.billingDaysRemaining = Math.round(($scope.data.nextBillingDate - (new Date()).getTime()) / (24 * 60 * 60 * 1000));
                $scope.currentBillingPeriodDate = $scope.data.lastBillingDate;

                $scope.data.dataUsageLimit = $scope.data.dataUsageLimit * GIGA;
                $scope.data.totalUsage = getTotalUsage();
                $scope.data.estimatedUsage = getEstimatedUsage();
                $scope.data.graphScale = calculateGraphScale();
                $scope.isLoading = false;
			});

        }
    });

    $scope.init = function () {
        $scope.isLoading = true;
    };

    $scope.getPercentage = function(val, bottom, top) {
        val = val / GIGA;
        return (val - bottom) / (top - bottom) * 100;
    };

    var getEstimatedUsage = function() {
        return $scope.data.totalUsage * (($scope.data.nextBillingDate - $scope.data.lastBillingDate) / (new Date() - $scope.data.lastBillingDate));
    };

    var getTotalUsage = function() {
        return _.reduce($scope.data.deviceUsage, function (total, device) {
            return total + device.dataUsage;
        }, 0);
    };

    var calculateGraphScale = function() {
        
        //Calculate ranges for graphs/charts
        var dataPoints = [$scope.data.dataUsageLimit, $scope.data.totalUsage, $scope.data.estimatedUsage],
        maxBytes = _.max(dataPoints);

        $scope.data.graphScale.high = Math.ceil(maxBytes / GIGA);
        if (_.some(dataPoints, function (point) { return (point / maxBytes) > 0.9 })) {
            $scope.data.graphScale.high = Math.round($scope.data.graphScale.high * 1.2);
        }
        $scope.data.graphScale.middle = Math.round($scope.data.graphScale.high / 2);

        return $scope.data.graphScale;
    };

}]);
