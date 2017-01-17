streamApp.config(function ($routeProvider) {
    $routeProvider
        // route for the home page
        .when('', {
            templateUrl: 'home',
            controller: 'homeController'
        })
        .when('/', {
            templateUrl: 'home',
            controller: 'homeController'
        })

        // route for the contact page
        .when('/login', {
            templateUrl: 'login/signin',
            controller: 'loginController'
        })
        .when('/login/recoverPassword', {
            templateUrl: 'login/recoverPassword.html',
            controller: 'loginController'
        })
        .when('/login/recoverUsername', {
            templateUrl: 'login/recoverUsername.html',
            controller: 'loginController'
        })
        .when('/createAccount', {
            templateUrl: 'login/createAccount.html',
            controller: 'loginController'
        })
        .when('/shop', {
            templateUrl: 'shop/services.html',
            controller: 'shopController'
        })
        .when('/account/wireless-overview', {
            templateUrl: 'account/wirelessOverview.html',
            controller: 'wirelessOverviewController'
        })
        .when('/account/electric-overview', {
            templateUrl: 'account/electricOverview.html',
            controller: 'energyOverviewController'
        })
        .when('/account/gas-overview', {
            templateUrl: 'account/gasOverview.html',
            controller: 'energyOverviewController'
        })
         .when('/account/payment-methods', {
             templateUrl: 'account/paymentMethods.html',
             controller: 'paymentMethodsController'
         })
        .when('/account/add-payment-method', {
            templateUrl: 'account/addPaymentMethod.html',
            controller: 'addPaymentMethodController'
        })
        .when('/account/invoice-history', {
            templateUrl: 'account/invoiceHistory.html',
            controller: 'InvoiceHistoryController'
        })
        .when('/account/payment-history', {
            templateUrl: 'account/paymentHistory.html',
            controller: 'PaymentHistoryController'
        })
        .when('/account/autopay', {
            templateUrl: 'account/autopay.html',
            controller: 'manageAutoPayController'
        })
         .when('/account/paperless-billing', {
             templateUrl: 'account/paperlessBilling.html',
             controller: 'managePaperlessController'
         })
        .when('/account/linked-accounts', {
            templateUrl: 'account/linkedAccounts.html',
            controller: 'linkedAccountsController'
        })
        .when('/dashboard', {
            templateUrl: 'dashboard.html',
            controller: 'dashboardController'
        })
        .when('/account/makepayment', {
            templateUrl: 'account/makepayment.html',
            controller: 'accountMakePaymentController'
        })
        .when('/account/login-info', {
            templateUrl: 'account/loginInfo.html',
            controller: 'loginInfoController'
        })
        .when('/account/info', {
            templateUrl: 'account/info.html',
            controller: 'accountInformationController'
        })
        .when('/account/dashboard', {
            templateUrl: 'account/dashboard.html',
            controller: 'accountDashboardController'
        });
});

//Create the route loading indicator
var routeLoadingIndicator = function ($rootScope) {
    return {
        restrict: 'E',
        template: "<div class='col-lg-12' ng-show='isRouteLoading'><h1>Loading <i class='fa fa-cog fa-spin'></i></h1></div>",
        link: function (scope, elem, attrs) {
            scope.isRouteLoading = false;

            $rootScope.$on('$routeChangeStart', function () {
                scope.isRouteLoading = true;
            });

            $rootScope.$on('$routeChangeSuccess', function () {
                scope.isRouteLoading = false;
            });
        }
    };
};
routeLoadingIndicator.$inject = ['$rootScope'];
streamApp.directive('routeLoadingIndicator', routeLoadingIndicator);

// create the controller and inject Angular's $scope


streamApp.controller('mainController', ['$scope', '$http', '$window', '$location', 'appDataService', function ($scope, $http, $window, $location, appDataService) {
    var loadAppVersion = function () {
        $window.lastCheckedVersion = new Date();
        var versionAPI = '/api/MobileApp/GetAppVersion';
        return $http({
            method: 'GET',
            url: versionAPI
        }).then((function (data) {
            $window.AppVersion = data.data;
            return data.data;
        }))
    }

    $scope.go = function (path, params) {
        if (!$window.AppVersion) {
            loadAppVersion();
        }

        var opts = {};

        params = params ? params : {};
        $.extend(opts, { 'version': $window.AppVersion }, params);

        //if(!params)
        //    $location.path(path);
        //else
        //    $location.path(path).search(params);

        $location.path(path).search(opts);
    }

    $scope.GlobalData = function () {
        if (!$window.DataInitialized) { //On first window load attempt to load data from server
            appDataService.loadData();
            $window.DataInitialized = true;
        }

        var data = appDataService.Data();
        
        

        return data;
    }

    var getName = function () {
        var d = $scope.GlobalData()
        if (d) {
            name = d.user.name;
        }
    }
    //$scope.name = getName();

    $scope.checkMenu = function () {
        if (!$scope.menuOpening) {
            $scope.showMenu = false;
        }

        $scope.menuOpening = false;
    }

    $scope.goBack = function () {
        try {
            var b = $("body");
            b.addClass('going-back');

            var func = function () {
                b.removeClass("going-back");
            }
            setTimeout(func, 600);
        }
        catch (e) {
        }
       

        if ($scope.previousView) { //allow override of just going back in history 1
            var pv = $scope.previousView;

            $scope.previousView = "";

            $window.location.href = pv;

           
        }
        else {
            $window.history.back();
        }
    }

    $scope.backBarisVisible = function () {
        return $window.showBackBar;
    }
}]);

streamApp.controller('homeController', function ($scope, $window) {
    $scope.pageClass = 'page-home';
    $window.showBackBar = false;
});


streamApp.controller('dashboardController', ['$scope', '$http', '$window', '$location', 'appDataService', function ($scope, $http, $window, $location, appDataService){
    $scope.pageClass = 'page-dashboard';
    $window.showBackBar = false;

    var data = appDataService.Data();

    var accounts = data.accounts;

    $scope.accounts = accounts;
    $scope.getAddress = function (account) {
        return account.serviceAddress.line1 + " " + account.serviceAddress.line2;
    }

    var mobileAccounts = new Array(), utilityAccounts = new Array();

    var paymentDate;
    var balance = 0;
    for (var i = 0; i < accounts.length; i++) {
        var acct = accounts[i];
        if (!paymentDate){
            paymentDate = acct.dueDate;
            balance = acct.amountDue;
        }
        else if(acct.dueDate < paymentDate){
            paymentDate = acct.dueDate;
        }

        switch(acct.accountType.toLowerCase()){
            case "utility": {
                utilityAccounts.push(acct);
                break;
            }
            case "mobile":{
                mobileAccounts.push(acct);
                break;
            }   
        }

    }
    
    $scope.paymentDate = new Date(paymentDate);
    $scope.paymentBalance = balance;

    $scope.utilityAccounts = utilityAccounts;
    $scope.mobileAccounts = mobileAccounts;

    $scope.billingCycleDaysLeft = function (account) {
        var billingDate = new Date(account.billingCycleEnd);
        
        var aDay = 24 * 60 * 60 * 1000;
        var diff = Math.ceil((billingDate.getTime() - new Date().getTime()) / aDay);

        if (diff < 0) return 0;

        return diff;
    }

    $scope.getDataPercentage = function (deviceUsage) {
        if (deviceUsage.length < 2 || deviceUsage[1].number <=0) return 0;

        var pct = Math.abs((deviceUsage[0].number / deviceUsage[1].number) * 100);

        return pct > 100 ? 100 : pct;
    }

    $scope.formatDataUsage = function (bytes) {
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
}]);


streamApp.controller('accountMakePaymentController', function ($scope, $window) {
    $scope.pageClass = 'page-make-payment';
    $window.showBackBar = true;

    $scope.EnergyChecked = false;
    $scope.WirelessChecked = false;
});

streamApp.controller('accountDashboardController', function ($scope, $window) {
    $scope.pageClass = 'page-dashboard';
    $window.showBackBar = true;
});


streamApp.controller('loginController', function ($scope, $window) {
    $scope.pageClass = 'page-login';
    $window.showBackBar = true;
});

streamApp.controller('shopController', function ($scope, $window) {
    $scope.pageClass = 'page-shop';
    $window.showBackBar = true;
});

streamApp.controller('wirelessOverviewController', ['$scope', '$http', '$window', 'appDataService', 'accountService', '$routeParams', function ($scope, $http, $window, appDataService, accountService, $routeParams) {
    $scope.pageClass = 'page-wireless-overview';
    $window.showBackBar = true;

    var accountNumber = $routeParams.accountNumber;
    $scope.accountNumber = accountNumber;

    var acct = accountService.GetAccount(accountNumber);
    var aDay = 24 * 60 * 60 * 1000;

    $scope.account = acct;
    $scope.accountService = accountService;

    $scope.estimatedUsage = function (account) {
        var usage = 0;

        for (var i = 0; i < account.mobileAppPhoneLines.length; i++) { //Get all usage for lines
            var line = account.mobileAppPhoneLines[i];
            if (!line.deviceUsage) continue;

            usage += line.deviceUsage[0].number;
        }
        
        var start = new Date(account.billingCycleStart);
        var diff = Math.ceil((new Date().getTime() - start.getTime() ) / aDay);
        
        var usePerDay = usage / diff;
        var total = (usePerDay * accountService.BillingCycleDaysLeft(account)) + usage;
        return accountService.FormatDataUsage(total);
    }

    $scope.DaysRemainingPercentage = function (account) {
        var start = new Date(account.billingCycleStart);
        var end = new Date(account.billingCycleEnd);
        var diff = Math.ceil((end.getTime() - start.getTime()) / aDay);
        var diff2 =  Math.ceil((new Date().getTime() - start.getTime() ) / aDay);
        if (diff <= 0)
            return 100;

        return Math.ceil((diff2 / diff) * 100);
    }
}]);

streamApp.controller('energyOverviewController', ['$scope', '$http', '$window', 'appDataService', 'accountService', '$routeParams', function ($scope, $http, $window, appDataService, accountService, $routeParams) {
    $scope.pageClass = 'page-energy-overview';
    $window.showBackBar = true;

    var accountNumber = $routeParams.accountNumber;
    var acct = accountService.GetAccount(accountNumber);
    $scope.account = acct;
    $scope.accountNumber;
}]);

streamApp.controller('paymentMethodsController', ['$scope', '$http', '$window', 'appDataService', 'accountService', '$routeParams', function ($scope, $http, $window, appDataService, accountService, $routeParams) {
    $scope.pageClass = 'page-manage-account';
    $window.showBackBar = true;
    var data = appDataService.Data();
    //var accounts = angular.copy(data.accounts);

    //var paymentMethods = new Array();
    //var addedMethods = new Array();

    //for (var i = 0; i < data.accounts.length; i++) {
    //    var account = data.accounts[i];

    //    if (!account.availablePaymentMethods || account.availablePaymentMethods.length < 1)
    //        continue;

    //    for (var j = 0; j < account.availablePaymentMethods.length; j++) {
    //        var pm = account.availablePaymentMethods[j];
    //        var key = pm.paymentMethodType;
    //        if (addedMethods[key])//should set this to an account number
    //            continue;

    //        addedMethods[key] = pm;

    //        paymentMethods.push(pm);
    //    }
    //}

    //$scope.paymentMethods = paymentMethods;

    $scope.paymentMethods = data.user.paymentMethods;

    $scope.getAccountDisplay = function (accountNumber) {
        return accountNumber.substr(accountNumber.length - 7);
    }

    
}]);

streamApp.controller('addPaymentMethodController', function ($scope, $window) {
    $scope.pageClass = 'page-add-payment-method';
    $window.showBackBar = true;
});

streamApp.controller('InvoiceHistoryController', ['$scope', '$http', '$window', 'appDataService', 'accountService', '$routeParams', function ($scope, $http, $window, appDataService, accountService, $routeParams) {
    $scope.pageClass = 'page-invoice-history';
    $window.showBackBar = true;
    $scope.formData = {};

    var data = appDataService.Data();

    var invoices = new Array();
    var serviceTypes = new Array();

    var createInvoice = function (acct, baseInvoice) {
        var invoice = angular.extend({ 'accountNumber': acct.accountNumber }, baseInvoice);
        return invoice;
    }

    for (var i = 0; i < data.accounts.length; i++) {
        var acct = data.accounts[i];
        if (!acct || !acct.invoiceHistory || acct.invoiceHistory < 1)
            continue;

        if (serviceTypes.indexOf(acct.accountType) == -1) {
            serviceTypes.push(acct.accountType)
        }

        for (var j = 0; j < acct.invoiceHistory.length; j++) {
            var invoice = acct.invoiceHistory[j];
            invoices.push(createInvoice(acct, invoice));
        }
    }

    $scope.invoices = invoices;
    $scope.accounts = data.accounts;
    $scope.serviceTypes = serviceTypes;

    $scope.getInvoiceAccount = function (invoice) {
        var accountNumber = invoice.accountNumber

        return accountService.GetAccount(accountNumber);
    }

    $scope.showAccountOption = function (account) {
        return !$scope.formData.invoiceServiceType || $scope.formData.invoiceServiceType == account.accountType;
    }

    $scope.checkResetAccountOption = function (serviceType) {
        if ($scope.formData.invoiceServiceType != serviceType) { $scope.formData.InvoiceAccount = '' }
    }

    $scope.$watch($scope.formData.invoiceServiceType, function () {
        
        if (!$scope.formData.InvoiceAccount ||
            !$scope.formData.invoiceServiceType ||
            $scope.formData.InvoiceAccount.accountType == $scope.formData.invoiceServiceType) {
            return;
        }
                
        $scope.formData.InvoiceAccount = ''


        //if ($scope.formData.invoiceServiceType != serviceType) { $scope.formData.InvoiceAccount = '' }
    });

    $scope.showInvoice = function (invoice) {
        var invoiceAcct = $scope.getInvoiceAccount(invoice);

        if (($scope.formData.invoiceServiceType && $scope.formData.invoiceServiceType != invoiceAcct.accountType) ||
            ($scope.formData.InvoiceAccount && $scope.formData.InvoiceAccount != invoiceAcct.accountNumber)
            ) {
            return false;
        }
        else
            return true;
    }
}]);

streamApp.controller('PaymentHistoryController', function ($scope, $window) {
    $scope.pageClass = 'page-payment-history';
    $window.showBackBar = true;

    var payments = new Array();

    //obvious test code here.  Replace this with invoice call
    var createPayment = function (invoiceNumber) {
        return { 'AccountNumber': "#290184723", 'Amount': 214.70, 'AccountType': "Energy", "InvoiceNumber": invoiceNumber + 1, "DueDate": "10/25/2016" };
    }


    for (var i = 0; i < 6; i++) {
        payments.push(createPayment(i));
    }

    $scope.payments = payments;
});

streamApp.controller('linkedAccountsController', function ($scope, $window) {
    $scope.pageClass = 'page-manage-autopay';
    $window.showBackBar = true;
});

streamApp.controller('manageAutoPayController', ['$scope', '$http', '$window', 'appDataService', '$routeParams', function ($scope, $http, $window, appDataService, $routeParams) {
    $scope.pageClass = 'page-manage-autopay';
    $window.showBackBar = true;

    var data = appDataService.Data();
    $scope.accounts = angular.copy(data.accounts);

    $scope.saveChanges = function () {
        //call api to save the changes
        alert("IMPLEMENT SAVE CHANGES CALL");
    }
}]);

streamApp.controller('managePaperlessController', ['$scope', '$http', '$window', 'appDataService', '$routeParams', function ($scope, $http, $window, appDataService, $routeParams) {
    $scope.pageClass = 'page-manage-paperless';
    $window.showBackBar = true;

    var data = appDataService.Data();
    $scope.accounts = angular.copy(data.accounts);

    $scope.saveChanges = function () {
        //call api to save the changes
        alert("IMPLEMENT SAVE CHANGES CALL");
    }
}]);

streamApp.controller('loginInfoController', function ($scope, $window) {
    $scope.pageClass = 'page-login-info';
    $window.showBackBar = true;
});

streamApp.controller('accountInformationController', function ($scope, $window) {
    $scope.pageClass = 'page-account-info';
    $window.showBackBar = true;

    var accounts = new Array();
    $scope.formData = {};

    $scope.saveAccountInfo = function(account){
        alert(account.AccountType + " " +  account.AccountNumber)
    }

    var createPhoneNumber = function () {
        return { 'Number': '', 'PhoneType': '' };
    }

    $scope.addPhoneNumber = function (account) {
        account.PhoneNumbers.push(createPhoneNumber());
    }

    //test code
    
    var createAccount = function (acctNumber) {
        var phoneNumbers = new Array();
        phoneNumbers.push(createPhoneNumber());

        return {
            'AccountNumber': acctNumber, 'AccountType': 'Electricity',
            'HolderName': 'Account Holder ' + acctNumber, 'PhoneNumbers': phoneNumbers
        };
    }
    for (var i = 0; i < 5; i++) {
        accounts.push(createAccount(i + 1));
    }

    $scope.Accounts = accounts;
    $scope.formData.AccountNumber = accounts[0].AccountNumber;
});

