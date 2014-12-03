﻿/* Data Usage Summary Controller
 *
 */
ngApp.controller('DataUsageSummaryCtrl', ['$scope', '$rootScope', '$http', 'breakpoint', 'notificationService', function ($scope, $rootScope, $http, breakpoint, notificationService) {
    var GIGA = 1000000000;
    $scope.deviceUsageStats = [];
    $scope.deviceTotal = {
        data: {
            usage: 0,
            limit: 0
        },
        messages: {
            usage: 0,
            limit: 0
        },
        minutes: {
            usage: 0,
            limit: 0
        }
    };
    $scope.estimatedTotalData= 0;
    $scope.graphScale = {
        low: 0,
        middle: 0,
        high: 0
    };
    $scope.hasOverage = false;
    $scope.recentDataUsage = [];
    $scope.currentBillingPeriodDate = -1;
    $scope.billingDaysRemaining = 0;

    //BEGIN dummy data
    $scope.deviceUsageStats = [{
        name: 'Jordan\'s Phone',
        number: '402-249-1975',
        id: 0,
        data: {
            usage: 589000000,
            limit: 1.2 * (589000000)
        },
        messages: {
            usage: 49,
            limit: -1
        },
        minutes: {
            usage: 926,
            limit: -1
        }
    }, {
        name: 'Jason\'s Phone',
        number: '402-249-1822',
        id: 0,
        data: {
            usage: 2450000000,
            limit: 1.2 * (2450000000)
        },
        messages: {
            usage: 842,
            limit: -1
        },
        minutes: {
            usage: 643,
            limit: -1
        }
    }, {
        name: 'Jennifer Campbell',
        number: '402-249-1823',
        id: 0,
        data: {
            usage: 3270000000,
            limit: 1.2 * (3270000000)
        },
        messages: {
            usage: 152,
            limit: -1
        },
        minutes: {
            usage: 773,
            limit: -1
        }
    }];
    

    $scope.init = function () {
        $scope.currentBillingPeriodDate = getCurrentBillingDate();
        $scope.billingDaysRemaining = Math.round((getNextBillingDate() - (new Date()).getTime()) / (24 * 60 * 60 * 1000));
        calculateDeviceTotals();
        renderCurrentDataUsageComponent();
        renderHistoricDataUsageComponent();

        //Display notifications (if necessary)
        if ($scope.estimatedTotalData >= $scope.deviceTotal.data.limit) {
            notificationService.notify(
                'Data Usage Alert',
                'Your plan is at {{ used }} of {{ limit }} GB and is predicted to go over this month. <a href="#">Upgrade Plan</a>', {
                    used: round($scope.deviceTotal.data.usage / GIGA, 2),
                    limit: round($scope.deviceTotal.data.limit / GIGA, 2)
            });
        }
        _.each($scope.deviceUsageStats, function (device) {
            if (device.data.usage >= device.data.limit) {
                notificationService.notify(
                    'Data Overage Alert',
                    'Your plan for {{ account }} is at {{ used }} of {{ limit }} GB. <a href="#">Upgrade Plan</a>', {
                        account: device.number,
                        used: round(device.data.usage / GIGA, 2),
                        limit: round(device.data.limit / GIGA, 2)
                });
            }
        });
    }

    function round(num, p) {
        var m = Math.pow(10, p);
        return Math.round(num * m) / m;
    }

    function getEstimatedTotalData() {
        //BEGIN dummy data
        return $scope.deviceTotal.data.usage * (1+ Math.random());
        //END dummy data
    }

    function getRecentDataUsage(months) {
        //BEGIN dummy data
        var recentDataUsage = [];
        for (var i = 0; i < months; i++) {
            recentDataUsage.push($scope.deviceTotal.data.usage * (1 + Math.random() - 0.5) / GIGA);
        }
        return recentDataUsage;
        //END dummy data
    }

    function getNextBillingDate() {
        //BEGIN dummy data

        var month = 1000 * 60 * 60 * 24 * 30;
        var days = ((new Date()).getTime() % (1000 * 60 * 60 * 24 * 7 * 4.3)) ;
        return (new Date()).getTime() + month - days;
        //END dummy data
    }

    function getCurrentBillingDate() {
        //BEGIN dummy data
        return (new Date()).getTime() - (1000 * 60 * 60 * 24 * 30);
        //END dummy data
    }

    function calculateDeviceTotals() {
        _.each(['data', 'messages', 'minutes'], function (field) {
            $scope.deviceTotal[field].usage = _.reduce($scope.deviceUsageStats, function (total, device) {
                return total + device[field].usage;
            }, 0);
            $scope.deviceTotal[field].limit = _.reduce($scope.deviceUsageStats, function (total, device) {
                return total + device[field].limit;
            }, 0);
        });

        $scope.hasOverage = $scope.deviceTotal.data.usage > $scope.deviceTotal.data.limit;
        $scope.estimatedTotalData = getEstimatedTotalData();

        //Calculate ranges for graphs/charts
        var dataPoints = [$scope.deviceTotal.data.usage, $scope.deviceTotal.data.limit];
        if (!$scope.hasOverage) { // ignore estimate for overages since it is invisible
            dataPoints.push($scope.estimatedTotalData);
        }

        var highBytes = _.max(dataPoints);
        $scope.graphScale.high = Math.ceil(highBytes / GIGA);
        if (_.some(dataPoints, function (point) { return (point / highBytes) > 0.9 })) {
            $scope.graphScale.high += 1;
        }
        $scope.graphScale.middle = Math.round($scope.graphScale.high / 2);
    }

    function renderCurrentDataUsageComponent() {
        //Current Data Usage Component
        var usedPct = (($scope.deviceTotal.data.usage / GIGA) / $scope.graphScale.high) * 100;
        var estimatedPct = (($scope.estimatedTotalData / GIGA) / $scope.graphScale.high) * 100 - usedPct;
        var currentPct = (($scope.deviceTotal.data.limit / GIGA) / $scope.graphScale.high) * 100;
        if ($scope.hasOverage) {
            estimatedPct = 0;
            d3.select(".usage-meter").attr("class", "usage-meter overage");
        }
        d3.select(".used").style("width", usedPct + '%');
        d3.select(".estimated").style("width", estimatedPct + '%');
        d3.select(".remain").style("width", 100 - (usedPct + estimatedPct) + '%');
        if (usedPct + estimatedPct > 75) {
            d3.select(".remain .label").style("float", "right").style("left", "0px");
        }
        d3.select(".current-data").style("width", currentPct + '%');
    }

    function renderHistoricDataUsageComponent() {
        //Historic data usage component
        $scope.recentDataUsage = getRecentDataUsage(12);
        var maxUsage = _.max(_.map($scope.recentDataUsage, function (n) {
            return (n / $scope.graphScale.high) * 100;
        }));

        d3.select(".historical-graph").style("padding-top", function () {
            if (_.max($scope.recentDataUsage) / $scope.graphScale.high < .75) {
                var current = ((($scope.deviceTotal.data.limit / GIGA) / $scope.graphScale.high) * 100);
                return 10 + (100 - current) + 'px';
            }
            return '0px';
        }).selectAll("div").data($scope.recentDataUsage).enter().append("span")
            .style("height", function (d) {
                return (d / $scope.graphScale.high) * 100 + 'px';
            })
            .style("top", function (d) {
                return maxUsage - (d / $scope.graphScale.high * 100) + 'px';
            })
            .style("background-color", function (d) {
                if (d >= $scope.deviceTotal.data.limit / GIGA) {
                    return "#d30";
                } else {
                    return "#ddd";
                }
            })
            .text(' ');

        d3.select(".current-limit").style("top", function () {
            return "-" + ((($scope.deviceTotal.data.limit / GIGA) / $scope.graphScale.high) * 100) + "px";
        });
    }

}]);
