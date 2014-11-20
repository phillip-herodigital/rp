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
        var stamp = (new Date()).getTime();
        $scope.dateRanges.push({id: i, begin: stamp - (month * i) - month, end: stamp - (month * i)});
    }

    $scope.currentRangeId = angular.toJson($scope.dateRanges[0].id);

    $scope.getUsageStats = function(){
        var range = $scope.dateRanges[$scope.currentRangeId];
        //BEGIN dummy data
        $scope.deviceUsageStats = [{
            name: 'Jordan Campbell',
            number: '123-456-7890',
            imageURL: '#',
            messageMax: 'unlimited',
            minuteMax: 'unlimited',
            usage: {
                data: 1930000000 + ((new Date()).getTime() - range.begin),
                messages: 49,
                minutes: 926,
            }
        },{
            name: 'Jennifer Campbell',
            number: '123-867-5309',
            imageURL: '#',
            messageMax: 'unlimited',
            minuteMax: 'unlimited',
            usage: {
                data: 2500000000 + ((new Date()).getTime() - range.end),
                messages: 372,
                minutes: 1873,
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
