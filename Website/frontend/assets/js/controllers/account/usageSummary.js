/* Account Usage Summary Controller
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

    //Make some dummy date ranges
    for(var i = 0; i < 4; i++){
        var month = 1000 * 60 * 60 * 24 * 30;
        var now = (new Date()).getTime();
        $scope.dateRanges.push({id: i, begin: now - (month * i) - month, end: now - (month * i)});
    }

    $scope.currentRangeId = $scope.dateRanges[0].id;

    $scope.getUsageStats = function(){
        var range = $scope.dateRanges[$scope.currentRangeId];

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

			    $scope.deviceTotal.data.limit = $scope.data.dataUsageLimit;
			    updateDeviceTotals();
			});
    }

    $scope.getDeviceImageURL = function (deviceId) {
        return '#'; //'http://library.columbia.edu/content/dam/libraryweb/locations/sciencelib/dsc/ERIWG_mobile/iphone_icon.png';
    }

    function updateDeviceTotals() {
        $scope.deviceTotal.data.usage = _.reduce($scope.data.deviceUsage, function (total, device) {
            return total + device.dataUsage;
        }, 0);
    }

    $scope.getUsageStats();
    
}]);
