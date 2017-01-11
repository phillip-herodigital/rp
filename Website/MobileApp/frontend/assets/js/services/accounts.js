streamApp.factory('accountService', ['$http', '$q', '$window', 'appDataService', function ($http, $q, $window, appDataService) {
    return {
        GetAccount: function (accountNumber) {
            var data = appDataService.Data();
            var accounts = data.accounts;
            var acct;

            for (var i = 0; i < accounts.length; i++) {
                var account = accounts[i];
                if (account.accountNumber == accountNumber) {
                    acct = account;
                    break;
                }
            }

            return acct;
        },
        BillingCycleDaysLeft: function (account) {
            var billingDate = new Date(account.billingCycleEnd);

            var aDay = 24 * 60 * 60 * 1000;
            var diff = Math.ceil((billingDate.getTime() - new Date().getTime()) / aDay);

            if (diff < 0) return 0;

            return diff;
        },
        GetDataPercentage : function (deviceUsage) {
            if (deviceUsage.length < 2 || deviceUsage[1].number <=0) return 0;

            var pct = Math.abs((deviceUsage[0].number / deviceUsage[1].number) * 100);

            return pct > 100 ? 100 : pct;
        },
        FormatDataUsage : function (bytes) {
            var si = true;
            var thresh = si ? 1000 : 1024;
            if (!bytes) {
                //malformed data
                return 0;
            }
            if (Math.abs(bytes) < thresh) {
                return parseInt(bytes);
            }
            var units = si
                ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
                : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
            var u = -1;
            do {
                bytes /= thresh;
                ++u;
            } while (Math.abs(bytes) >= thresh && u < units.length - 1);
            return bytes.toFixed(1) + ' ' + units[u];
        }
    }
}]);