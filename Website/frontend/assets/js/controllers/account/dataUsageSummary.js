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
    $scope.noUsage = false;
    $scope.hideComponent = true;

    $scope.$watch('selectedAccount.accountNumber', function(newVal) { 
        if (newVal) {
            $scope.hideComponent = false;
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
                
                if (_.every($scope.data.deviceUsage, function (d) { return (d.dataUsage == null); })) {
                    $scope.noUsage = true;
                    for (var i = 0, device; device = $scope.data.deviceUsage[i]; i++) {
                        var rand = Math.sin(device.number) * 1000;
                        rand -= rand - Math.floor(rand);
                        device.dataUsage = 1000000 * rand;
                        device.minutesUsage = Math.round(rand * .5);
                        device.messagesUsage = Math.round(rand * .75);
                    }
                }

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
