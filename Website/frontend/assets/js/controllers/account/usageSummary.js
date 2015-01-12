/* Account Usage Summary Controller
 *
 */
ngApp.controller('AcctUsageSummaryCtrl', ['$scope', '$rootScope', '$http', 'breakpoint', 'jQuery', function ($scope, $rootScope, $http, breakpoint, $) {

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

    var acct = null;
    $scope.isLoading = true;
    $scope.noUsage = false;
    $scope.$watch('selectedAccount.accountNumber', function (newVal) {
        if (newVal) {
            acct = newVal;
            firstLoad = true;
            $scope.getUsageStats();
            loadInvoices();
        }
    });

    var invoices = null;
    var loadInvoices = function () {
        $http({
            method: 'GET',
            url: '/api/account/getInvoices',
            data: {
                accountNumber: acct,
            },
            headers: { 'Content-Type': 'application/JSON' }
        })
        .success(function (data, status, headers, config) {
            invoices = data.invoices.values;
            addInvoiceRanges();
        });
    };

    var addInvoiceRanges = function () {
        if ($scope.isLoading || !invoices) return;
        for (var i = 0, invoice; invoice = invoices[i]; i++) {
            var nextInvoice = invoices[i + 1];
            if (nextInvoice) {
                $scope.dateRanges.push({
                    begin: new Date(nextInvoice.invoiceDate),
                    end: new Date(invoice.invoiceDate),
                    id: i + 2,
                });
            }
        }
    };
    
    var firstLoad = true;

    $scope.getUsageStats = function(){
        $scope.isLoading = true;

        var dateRange = _.find($scope.dateRanges, { id: parseInt($scope.currentRangeId) });
        
        $http({
            method: 'POST',
            url: '/api/account/getMobileUsage',
            data: {
                accountNumber: acct,
                startDate: dateRange != null ? dateRange.begin : null,
                endDate: dateRange != null ? dateRange.end : null,
            },
            headers: { 'Content-Type': 'application/JSON' }
        })
        .success(function (data, status, headers, config) {
            $scope.isLoading = false;
            $scope.data = data;

            if (firstLoad)
            {
                $scope.dateRanges = [
                    {
                        begin: new Date(data.lastBillingDate),
                        end: new Date(data.nextBillingDate),
                        id: 1,
                    }
                ];
                $scope.currentRangeId = 1;
                addInvoiceRanges();
                firstLoad = false;
            }
            
            $scope.deviceTotal.data.limit = $scope.data.dataUsageLimit * GIGA;
            updateDeviceTotals();
        });

    }

    $scope.getDeviceImageURL = function (deviceId) {
        return '/frontend/assets/i/icon/phone-generic.png';
    }

    var updateDeviceTotals = function () {
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

        $scope.deviceTotal.data.usage = _.reduce($scope.data.deviceUsage, function (total, device) {
            return total + device.dataUsage;
        }, 0);
        $scope.deviceTotal.minutes.usage = _.reduce($scope.data.deviceUsage, function (total, device) {
            return total + device.minutesUsage;
        }, 0);
        $scope.deviceTotal.messages.usage = _.reduce($scope.data.deviceUsage, function (total, device) {
            return total + device.messagesUsage;
        }, 0);
    };
    
    $scope.getSampleDivStyles = function () {
        return {
            'height': $('article.usage-details table').height() + 'px',
        };
    };
}]);
