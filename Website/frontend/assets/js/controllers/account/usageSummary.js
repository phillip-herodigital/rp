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

    var acct = null;
    $scope.isLoading = true;
    $scope.$watch('selectedAccount.accountNumber', function (newVal) {
        if (newVal) {
            acct = newVal;
            $scope.getUsageStats();
        }
    });

    $scope.getUsageStats = function(){
        var range = $scope.dateRanges[$scope.currentRangeId];
        $scope.isLoading = true;

        $http({
            method: 'POST',
            url: '/api/account/getMobileUsage',
            data: {
                accountNumber: acct,
            },
            headers: { 'Content-Type': 'application/JSON' }
        })
			.success(function (data, status, headers, config) {
			    $scope.isLoading = false;
			    $scope.data = data;

			    $scope.deviceTotal.data.limit = $scope.data.dataUsageLimit;
			    updateDeviceTotals();
			});

        $http({
            method: 'GET',
            url: '/api/account/getInvoices',
            headers: { 'Content-Type': 'application/JSON' }
        })
			.success(function (data, status, headers, config) {
			    //$scope.data = data;

			    console.log(data);

			    //$scope.deviceTotal.data.limit = $scope.data.dataUsageLimit;
			    //updateDeviceTotals();
			});
    }

    $scope.getDeviceImageURL = function (deviceId) {
        return '#'; //'http://library.columbia.edu/content/dam/libraryweb/locations/sciencelib/dsc/ERIWG_mobile/iphone_icon.png';
    }

    function updateDeviceTotals() {
        $scope.deviceTotal.data.usage = _.reduce($scope.data.deviceUsage, function (total, device) {
            return total + device.dataUsage;
        }, 0);
        $scope.deviceTotal.minutes.usage = _.reduce($scope.data.deviceUsage, function (total, device) {
            return total + device.minutesUsage;
        }, 0);
        $scope.deviceTotal.messages.usage = _.reduce($scope.data.deviceUsage, function (total, device) {
            return total + device.messagesUsage;
        }, 0);
    }
    
}]);
