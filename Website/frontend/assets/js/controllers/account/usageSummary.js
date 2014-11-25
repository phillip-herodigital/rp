/* My Usage Summary Controller
 *
 */
ngApp.controller('AcctUsageSummaryCtrl', ['$scope', '$rootScope', '$http', 'breakpoint', function ($scope, $rootScope, $http, breakpoint) {

    $scope.dateRanges = [];
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


    //Make some dummy date ranges
    for(var i = 0; i < 4; i++){
        var month = 1000 * 60 * 60 * 24 * 30;
        var now = (new Date()).getTime();
        $scope.dateRanges.push({id: i, begin: now - (month * i) - month, end: now - (month * i)});
    }

    $scope.currentRangeId = $scope.dateRanges[0].id;

    $scope.getUsageStats = function(){
        var range = $scope.dateRanges[$scope.currentRangeId];

        //BEGIN dummy data
        var dummyModifier = (range.id * ((new Date()).getTime() - range.begin)) / $scope.dateRanges.length;
        $scope.deviceUsageStats = [{
            name: 'Jordan\'s Phone',
            number: '402-249-1975',
            id: 0,
            data: {
                usage: 589000000 + dummyModifier,
                limit:  1.2 * (589000000 + dummyModifier)
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
                usage: 2450000000 + dummyModifier,
                limit:  1.2 * (2450000000 + dummyModifier)
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
                usage: 3270000000 + dummyModifier,
                limit:  1.2 * (3270000000 + dummyModifier)
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

    $scope.getDeviceImageURL = function (deviceId) {
        return '#'; //'http://library.columbia.edu/content/dam/libraryweb/locations/sciencelib/dsc/ERIWG_mobile/iphone_icon.png';
    }

    function updateDeviceTotals(){
        _.each(['data', 'messages', 'minutes'], function (field) {
            $scope.deviceTotal[field].usage = _.reduce($scope.deviceUsageStats, function(total,device){
                return total + device[field].usage;
            }, 0);
            $scope.deviceTotal[field].limit = _.reduce($scope.deviceUsageStats, function (total, device) {
                return total + device[field].limit;
            }, 0);
        });
        
        //$scope.deviceTotal.data.usage *= 1.5;

        $scope.hasOverage = $scope.deviceTotal.data.usage > $scope.deviceTotal.data.limit;
        var highBytes = $scope.hasOverage ? $scope.deviceTotal.data.usage : $scope.deviceTotal.data.limit;
        $scope.graphScale.high = Math.ceil(highBytes / 1000000000);
        $scope.graphScale.middle = Math.round($scope.graphScale.high / 2);

        var usedPct =  (($scope.deviceTotal.data.usage / 1000000000) / $scope.graphScale.high) * 100;
        var estimatedPct = (($scope.estimatedTotalData / 1000000000) / $scope.graphScale.high) * 100 - usedPct;
        var currentPct = (($scope.deviceTotal.data.limit / 1000000000) / $scope.graphScale.high) * 100;
        if ($scope.hasOverage) {
            estimatedPct = 0;
            d3.select(".chart").attr("class", "chart overage");
        }
        d3.select(".used").style("width", usedPct + '%');
        d3.select(".estimated").style("width", estimatedPct + '%');
        d3.select(".remain").style("width", 100 - (usedPct + estimatedPct) + '%');
        d3.select(".current-data").style("width", currentPct + '%');
    }

    $scope.getUsageStats();
    
}]);
