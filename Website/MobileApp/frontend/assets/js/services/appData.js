streamApp.factory('appDataService', ['$http', '$q', '$cookieStore', '$window', '$rootScope', function ($http, $q, $cookieStore, $window, $rootScope) {
    var getData = function(){
        if (!$window.GlobalData) { //set off of a cookie
            var cd = $cookieStore.get('globalData');

            if (cd) {
                $window.GlobalData = cd;
            }
            else {
                $window.GlobalData = {};
            }
        }
    

        return $window.GlobalData;
    }

    var setData = function (data) {

        if (!data) {
            $window.GlobalData = null;
            $cookieStore.remove('globalData');
            return;
        }

        if (!getData()) $window.GlobalData = {};


        $window.GlobalData = data;

        $cookieStore.put('globalData',data);
    }
    var loadUserData = function (clearData) {
        if (clearData)
            setData(null);

        //if (getData()) {
        //    return getData(); //temporary test code!!!
        //}

        var userDataAPI = '/api/MobileApp/loadAppData';
        $rootScope.displayLoadingIndicator = true;
        return $http({
            method: 'GET',
            url: userDataAPI,
            headers: { 'Content-Type': 'application/JSON' }
        }).then((function (data) {
            //Set this to some caching services opposed to window variable long term
            setData(data.data);
            $rootScope.displayLoadingIndicator = false;

            return data.data;
        }))
    }

    var getAccount = function(accountNumber){
        var data = getData();
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
    }

    return {
        Data: function(){
            return getData();
        },
        loadData: function (clearData) {
            return loadUserData(clearData);
        },
        setData: function (data) {
            setData(data);
        },
        clearData: function () {
            setData(null);
        },
        GetAccount: function(accountNumber){
            return getAccount(accountNumber);
        }
    }
}]);