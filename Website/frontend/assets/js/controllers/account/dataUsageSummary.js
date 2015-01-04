/* Data Usage Summary Controller
 *
 */
ngApp.controller('DataUsageSummaryCtrl', ['$scope', '$rootScope', '$http', 'breakpoint', 'notificationService', function ($scope, $rootScope, $http, breakpoint, notificationService) {
    var GIGA = 1000000000;
    $scope.deviceTotal = {
        data: {
            usage: 0,
            limit: 0
        },
        messages: {
            usage: 0,
            limit: -1
        },
        minutes: {
            usage: 0,
            limit: -1
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

    $scope.init = function () {
        $scope.isLoading = true;
        $http({
            method: 'POST',
            url: '/api/account/getMobileUsage',
            data: {
                accountNumber: '1691',
            },
            headers: { 'Content-Type': 'application/JSON' }
        })
			.success(function (data, status, headers, config) {
			    $scope.data = data;
			    data.lastBillingDate = new Date(data.lastBillingDate);
			    data.nextBillingDate = new Date(data.nextBillingDate);

			    $scope.currentBillingPeriodDate = getCurrentBillingDate();
			    $scope.billingDaysRemaining = Math.round((getNextBillingDate() - (new Date()).getTime()) / (24 * 60 * 60 * 1000));
			    calculateDeviceTotals();
			    renderCurrentDataUsageComponent();
			    $scope.isLoading = false;
			});
        //$scope.data = { "lastBillingDate": "2014-11-26T10:05:17.7947958-08:00", "nextBillingDate": "2014-12-26T10:05:17.7947958-08:00", "dataUsageLimit": 6000000000.0, "deviceUsage": [{ "number": "1234561156", "dataUsage": 1073741824.0, "messagesUsage": 0.0, "minutesUsage": 0.0 }, { "number": "1234561158", "dataUsage": 1073741824.0, "messagesUsage": 0.0, "minutesUsage": 0.0 }, { "number": "1234561155", "dataUsage": 0.0, "messagesUsage": 0.0, "minutesUsage": 0.0 }, { "number": "1234561157", "dataUsage": -1073741824.0, "messagesUsage": 0.0, "minutesUsage": 0.0 }] };

        //renderHistoricDataUsageComponent();

        //Display notifications (if necessary)
        //if ($scope.estimatedTotalData >= $scope.deviceTotal.data.limit) {
        //    notificationService.notify(
        //        'Data Usage Alert',
        //        'Your plan is at {{ used }} of {{ limit }} GB and is predicted to go over this month. <a href="#">Upgrade Plan</a>', {
        //            used: round($scope.deviceTotal.data.usage / GIGA, 2),
        //            limit: round($scope.deviceTotal.data.limit / GIGA, 2)
        //    });
        //}
        //_.each($scope.deviceUsageStats, function (device) {
        //    if (device.data.usage >= device.data.limit) {
        //        notificationService.notify(
        //            'Data Overage Alert',
        //            'Your plan for {{ account }} is at {{ used }} of {{ limit }} GB. <a href="#">Upgrade Plan</a>', {
        //                account: device.number,
        //                used: round(device.data.usage / GIGA, 2),
        //                limit: round(device.data.limit / GIGA, 2)
        //        });
        //    }
        //});
    }

    function round(num, p) {
        var m = Math.pow(10, p);
        return Math.round(num * m) / m;
    }

    function getEstimatedTotalData() {
        return $scope.deviceTotal.data.usage * (($scope.data.nextBillingDate - $scope.data.lastBillingDate) / (new Date() - $scope.data.lastBillingDate));
    }

    function getRecentDataUsage(months) {
        var recentDataUsage = [];
        for (var i = 0; i < months; i++) {
            recentDataUsage.push($scope.deviceTotal.data.usage / GIGA);
        }
        return recentDataUsage;
    }

    function getNextBillingDate() {
        return $scope.data.nextBillingDate.getTime();
    }

    function getCurrentBillingDate() {
        return $scope.data.lastBillingDate.getTime();
    }

    function calculateDeviceTotals() {
        $scope.deviceTotal.data.usage = _.reduce($scope.data.deviceUsage, function (total, device) {
            return total + device.dataUsage;
        }, 0);
        $scope.deviceTotal.data.limit = $scope.data.dataUsageLimit;

        $scope.hasOverage = $scope.deviceTotal.data.usage > $scope.deviceTotal.data.limit;
        $scope.estimatedTotalData = getEstimatedTotalData();

        //Calculate ranges for graphs/charts
        var dataPoints = [$scope.deviceTotal.data.usage, $scope.deviceTotal.data.limit];
        if (!$scope.hasOverage) { // ignore estimate for overages since it is invisible
            dataPoints.push($scope.estimatedTotalData);
        }

        var maxBytes = _.max(dataPoints);
        $scope.graphScale.high = Math.ceil(maxBytes / GIGA);
        if (_.some(dataPoints, function (point) { return (point / maxBytes) > 0.9 })) {
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
            d3.select(".usage-meter").attr("class", "usage-meter clearfix overage");
        }
        d3.select(".used").style("width", usedPct + '%');
        d3.select(".estimated").style("width", estimatedPct + '%');
        d3.select(".remain").style("width", 100 - (usedPct + estimatedPct) + '%');
        if (usedPct + estimatedPct > 75) {
            d3.select(".remain .label").style("float", "right").style("left", "0px");
        }
        d3.select(".current-data").style("width", currentPct + '%');
        d3.select(".breakdown")
            .style("bottom", Math.round(255 + $scope.data.deviceUsage.length * 28) + 'px')
            .style("margin-bottom", '-' + Math.round(255 + $scope.data.deviceUsage.length * 28) + 'px');
        $('.used').on('mouseenter', function () {
            $(this).parent().find('.breakdown').show();
        });
        $('.used').on('mouseleave', function () {
            $(this).parent().find('.breakdown').hide();
        });
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
