/* Data Usage Summary Controller
 *
 */
ngApp.controller('DataUsageSummaryCtrl', ['$scope', '$rootScope', '$http', 'breakpoint', 'notificationService', 'mobileUsageService', function ($scope, $rootScope, $http, breakpoint, notificationService, mobileUsageService) {
    var GIGA = 1000000;

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
            mobileUsageService.loadCurrentMobileUsage(newVal).then(function (data) {
                $scope.data = angular.extend($scope.data, data);
                
                if (_.every($scope.data.deviceUsage, function (d) { return (d.dataUsage == null); })) {
                    $scope.noUsage = true;
                    $scope.data.dataUsageLimit = ($scope.data.dataUsageLimit != 0) ? $scope.data.dataUsageLimit : 1;
                    var multiplier = parseInt($scope.data.dataUsageLimit) / parseInt($scope.data.deviceUsage.length);
                    for (var i = 0, device; device = $scope.data.deviceUsage[i]; i++) {
                        var rand = [423, 536, 834, 424, 532, 321, 546, 875, 535, 123][i] * multiplier;
                        device.dataUsage = 1000000 * rand;
                        device.minutesUsage = Math.round(rand * .5);
                        device.messagesUsage = Math.round(rand * .75);
                    }
                    var date = new Date();
                    date.setDate(date.getDate() - 15);
                    $scope.data.lastBillingDate = new Date(date);
                    date.setDate(date.getDate() + 30);
                    $scope.data.nextBillingDate = new Date(date);
                } else {
                    $scope.data.lastBillingDate = new Date($scope.data.billFromDate);
                    $scope.data.nextBillingDate = new Date($scope.data.billToDate);
                }

                if ($scope.data.nextBillingDate < new Date()) {
                    $scope.data.nextBillingDate = new Date();
                }

                $scope.billingDaysRemaining = Math.round(($scope.data.nextBillingDate - (new Date()).getTime()) / (24 * 60 * 60 * 1000));
                $scope.currentBillingPeriodDate = new Date();

                $scope.data.dataUsageLimit = $scope.data.dataUsageLimit * GIGA;
                $scope.data.totalUsage = getTotalUsage();
                $scope.data.estimatedUsage = getEstimatedUsage();
                $scope.data.graphScale = calculateGraphScale();
                $scope.isLoading = false;
                $scope.streamConnectError = false;
			}, function() {
                $scope.isLoading = false;
                $scope.streamConnectError = true; 
            });

        }
    });

    $scope.init = function () {
        $scope.isLoading = true;
        $scope.streamConnectError = false;
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
        $scope.data.graphScale.middle = Math.round($scope.data.graphScale.high / 2 * 10) / 10;

        return $scope.data.graphScale;
    };

}]);
