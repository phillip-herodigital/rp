/* My Usage Summary Controller
 *
 */
ngApp.controller('AcctUsageSummaryCtrl', ['$scope', '$rootScope', '$http', 'breakpoint', function ($scope, $rootScope, $http, breakpoint) {

    $scope.dateRanges = [];
    $scope.deviceUsageStats = [];
    $scope.usageTotal = {data: 0, messages: 0, minutes: 0};

    //Make some dummy date ranges
    for(var i = 0; i < 15; i++){
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
            imageURL: '#',
            messageMax: 'unlimited',
            minuteMax: 'unlimited',
            usage: {
                data: 689000000 + dummyModifier,
                messages: 49,
                minutes: 926,
            }
        }, {
            name: 'Jason\'s Phone',
            number: '402-249-1822',
            imageURL: '#',
            messageMax: 'unlimited',
            minuteMax: 'unlimited',
            usage: {
                data: 2450000000 + dummyModifier,
                messages: 842,
                minutes: 643,
            }
        }, {
            name: 'Jennifer Campbell',
            number: '402-249-1823',
            imageURL: '#',
            messageMax: 'unlimited',
            minuteMax: 'unlimited',
            usage: {
                data: 3270000000 + dummyModifier,
                messages: 152,
                minutes: 773,
            }
        }];
        //END dummy data

        updateUsageTotals();
    }

    function updateUsageTotals(){
        _.each(['data','messages','minutes'], function(field){
            $scope.usageTotal[field] = _.reduce($scope.deviceUsageStats, function(total,device){
                return total + device.usage[field];
            }, 0);
        });
    }

    $scope.getUsageStats();
    
}]);
