/* Account Usage Summary Controller
 *
 */
ngApp.controller('AcctUsageSummaryCtrl', ['$scope', '$rootScope', '$http', 'breakpoint', 'jQuery', 'mobileUsageService', function ($scope, $rootScope, $http, breakpoint, $, mobileUsageService) {

    var GIGA = 1000000;

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
    $scope.streamConnectError = false;
    $scope.noUsage = false;
    $scope.hideComponent = true;
    $scope.$watch('selectedAccount.accountNumber', function (newVal) {
        if (newVal) {
            $scope.hideComponent = false;
            acct = newVal;
            firstLoad = true;
            mobileUsageService.loadCurrentMobileUsage(newVal).then(function (data) {
                $scope.data = angular.copy(data);
                $scope.deviceTotal.data.limit = $scope.data.dataUsageLimit * GIGA;

                $scope.data.lastBillingDate = new Date($scope.data.billFromDate);
                $scope.data.nextBillingDate = new Date($scope.data.billToDate);
            
                if ($scope.data.nextBillingDate < new Date()) {
                    $scope.data.nextBillingDate = new Date();
                }

                updateDeviceTotals();

                $scope.isLoading = $scope.streamConnectError = false;
            }, function () {
                $scope.isLoading = false;
                $scope.streamConnectError = true;
            });
        }
    });

    var invoices = null;
    var loadInvoices = function () {
        $http({
            method: 'GET',
            url: '/api/account/getInvoices',
            headers: { 'Content-Type': 'application/JSON' }
        })
        .success(function (data, status, headers, config) {
            invoices = _.chain(data.invoices.values)
                       .sortBy("invoiceDate")
                       .reverse();
            addInvoiceRanges();
        });
    };

    var addInvoiceRanges = function () {
        if ($scope.isLoading || !invoices) return;
        var temp = invoices.value();
        for (var i = 0, invoice; invoice = temp[i]; i++) {
            var nextInvoice = temp[i + 1];
            if (nextInvoice && invoice.invoiceDate && nextInvoice.invoiceDate && invoice.invoiceDate != nextInvoice.invoiceDate) {
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
                endDate: dateRange != null ? dateRange.end : null
            },
            headers: { 'Content-Type': 'application/JSON' }
        })
        .success(function (data, status, headers, config) {
            $scope.isLoading = false;
            $scope.streamConnectError = false;
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
        })
        .error(function() {
            $scope.isLoading = false;
            $scope.streamConnectError = true; 
        });

    }

    $scope.getDeviceImageURL = function (deviceId) {
        return '/frontend/assets/i/icon/phone-generic.png';
    }

    var updateDeviceTotals = function () {
        if (_.every($scope.data.deviceUsage, function (d) { return (d.dataUsage == null); })) {
            $scope.noUsage = true;
            $scope.data.dataUsageLimit = ($scope.data.dataUsageLimit != 0) ? $scope.data.dataUsageLimit : 1;
            $scope.deviceTotal.data.limit = $scope.data.dataUsageLimit * GIGA;
            var multiplier = parseInt($scope.data.dataUsageLimit) / parseInt($scope.data.deviceUsage.length);
            if (multiplier)
            for (var i = 0, device; device = $scope.data.deviceUsage[i]; i++) {
                var rand = [423, 536, 834, 424, 532, 321, 546, 875, 535, 123][i] * multiplier;
                device.dataUsage = 1000 * rand;
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
