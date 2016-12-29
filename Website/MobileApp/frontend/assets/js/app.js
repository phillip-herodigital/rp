// script.js
// create the module and name it scotchApp
// configure our routes
var streamApp = angular.module('scotchApp', ['ngRoute', 'ngAnimate']);

streamApp.config(function ($routeProvider) {
    $routeProvider
        // route for the home page
        .when('/', {
            templateUrl: 'pages/home.html',
            controller: 'homeController'
        })

        // route for the contact page
        .when('/login', {
            templateUrl: 'login/signin.html',
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
    
        .when('/account/dashboard', {
            templateUrl: 'account/dashboard.html',
            controller: 'accountDashboardController'
        });
});


// create the controller and inject Angular's $scope
streamApp.controller('mainController', function ($scope, $window, $location) {
    $scope.go = function (path) {
        $location.path(path);
    }

    $scope.GlobalData = function () {
        return $window.GlobalData;
    }


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
});

streamApp.controller('homeController', function ($scope, $window) {
    $scope.pageClass = 'page-home';
    $window.showBackBar = false;
});


streamApp.controller('dashboardController', function ($scope, $window) {
    $scope.pageClass = 'page-dashboard';
    $window.showBackBar = false;
});


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

streamApp.controller('wirelessOverviewController', function ($scope, $window) {
    $scope.pageClass = 'page-wireless-overview';
    $window.showBackBar = true;
});

streamApp.controller('energyOverviewController', function ($scope, $window) {
    $scope.pageClass = 'page-energy-overview';
    $window.showBackBar = true;
});

streamApp.controller('paymentMethodsController', function ($scope, $window) {
    $scope.pageClass = 'page-manage-account';
    $window.showBackBar = true;
});

streamApp.controller('addPaymentMethodController', function ($scope, $window) {
    $scope.pageClass = 'page-add-payment-method';
    $window.showBackBar = true;
});

streamApp.controller('InvoiceHistoryController', function ($scope, $window) {
    $scope.pageClass = 'page-invoice-history';
    $window.showBackBar = true;

    var invoices = new Array();

    //obvious test code here.  Replace this with invoice call
    var createInvoice = function (invoiceNumber) {
        return { 'AccountNumber': "#290184723", 'Balance': 214.70, 'AccountType': "Energy", "InvoiceNumber": invoiceNumber + 1, "DueDate": "10/25/2016" };
    }


    for (var i = 0; i < 6; i++) {
        invoices.push(createInvoice(i));
    }

    $scope.invoices = invoices;
});

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

streamApp.controller('manageAutoPayController', function ($scope, $window) {
    $scope.pageClass = 'page-manage-autopay';
    $window.showBackBar = true;
});
streamApp.controller('managePaperlessController', function ($scope, $window) {
    $scope.pageClass = 'page-manage-paperless';
    $window.showBackBar = true;
});
streamApp.controller('loginInfoController', function ($scope, $window) {
    $scope.pageClass = 'page-login-info';
    $window.showBackBar = true;
});




