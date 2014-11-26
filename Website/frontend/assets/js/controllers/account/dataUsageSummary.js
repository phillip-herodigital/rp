/* Data Usage Summary Controller
 *
 */
ngApp.controller('DataUsageSummaryCtrl', ['$scope', '$rootScope', '$http', 'breakpoint', function ($scope, $rootScope, $http, breakpoint) {

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
    $scope.estimatedTotalData = 7800000000;
    $scope.graphScale = {
        low: 0,
        middle: 0,
        high: 0
    };
    $scope.hasOverage = false;

    $scope.recentDataUsage = [];

    $scope.getUsageStats = function () {
        //BEGIN dummy data
        $scope.deviceUsageStats = [{
            name: 'Jordan\'s Phone',
            number: '402-249-1975',
            id: 0,
            data: {
                usage: 589000000 ,
                limit: 1.2 * (589000000 )
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
                usage: 2450000000 ,
                limit: 1.2 * (2450000000 )
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
                usage: 3270000000 ,
                limit: 1.2 * (3270000000 )
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
        //END dummy data

        updateDeviceTotals();
    }

    function updateDeviceTotals() {
        _.each(['data', 'messages', 'minutes'], function (field) {
            $scope.deviceTotal[field].usage = _.reduce($scope.deviceUsageStats, function (total, device) {
                return total + device[field].usage;
            }, 0);
            $scope.deviceTotal[field].limit = _.reduce($scope.deviceUsageStats, function (total, device) {
                return total + device[field].limit;
            }, 0);
        });

        //Current Data Usage Component

        //$scope.deviceTotal.data.usage *= 1.5;
        $scope.hasOverage = $scope.deviceTotal.data.usage > $scope.deviceTotal.data.limit;
        var highBytes = $scope.hasOverage ? $scope.deviceTotal.data.usage : $scope.deviceTotal.data.limit;
        $scope.graphScale.high = Math.ceil(highBytes / 1000000000);
        $scope.graphScale.middle = Math.round($scope.graphScale.high / 2);

        var usedPct = (($scope.deviceTotal.data.usage / 1000000000) / $scope.graphScale.high) * 100;
        var estimatedPct = (($scope.estimatedTotalData / 1000000000) / $scope.graphScale.high) * 100 - usedPct;
        var currentPct = (($scope.deviceTotal.data.limit / 1000000000) / $scope.graphScale.high) * 100;
        if ($scope.hasOverage) {
            estimatedPct = 0;
            d3.select(".usage-meter").attr("class", "usage-meter overage");
        }
        d3.select(".used").style("width", usedPct + '%');
        d3.select(".estimated").style("width", estimatedPct + '%');
        d3.select(".remain").style("width", 100 - (usedPct + estimatedPct) + '%');
        d3.select(".current-data").style("width", currentPct + '%');

        //Historic data usage component
        //BEGIN dummy data
        $scope.recentDataUsage = [];
        for (var i = 0; i < 12; i++) {
            $scope.recentDataUsage.push($scope.deviceTotal.data.usage * (1 + Math.random() - 0.5) / 1000000000);
        }
        //END dummy data

        var maxUsage = _.max(_.map($scope.recentDataUsage, function (n) {
            return (n / $scope.graphScale.high) * 100;
        }));

        d3.select(".historical-graph").selectAll("div").data($scope.recentDataUsage)
        .enter().append("span")
        .style("height", function (d) {
            return (d / $scope.graphScale.high) * 100 + 'px';
        })
        .style("top", function (d) {
            return maxUsage - (d / $scope.graphScale.high * 100) + 'px';
        })
        .style("background-color", function (d) {
            if (d >= $scope.deviceTotal.data.limit / 1000000000) {
                return "#d30";
            } else {
                return "#ddd";
            }
        })
        .text(' ');

        d3.select(".current-limit").style("top", function () {
            return "-" + ((($scope.deviceTotal.data.limit / 1000000000) / $scope.graphScale.high) * 100) + "px";
        });
    }

    $scope.getUsageStats();

}]);
