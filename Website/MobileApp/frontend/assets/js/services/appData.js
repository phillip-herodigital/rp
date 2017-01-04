﻿streamApp.factory('appDataService', ['$http', '$q', '$cookieStore', '$window', function ($http, $q, $cookieStore, $window) {
    var getData = function(){
        
        if (!$window.GlobalData) { //set off of a cookie
            var cd = $cookieStore.get('globalData');

            if (cd) {
                $window.GlobalData = cd;
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


    return {
        Data: function(){
            return getData();
        },
        loadData: function (clearData) {

            if (clearData)
                setData(null);

            if (getData()) {
                return getData(); //temporary test code!!!
            }

            //setData({ 'user': { 'name': 'test2' } });

            //return;
            var userDataAPI = '/api/MobileApp/loadAppData';
            $http({
                method: 'GET',
                url: userDataAPI,
                headers: { 'Content-Type': 'application/JSON' }
            }).success((function (data, status, headers, config) {
                //Set this to some caching services opposed to window variable long term

                setData(data);
                //return data;
            }))

        },
        clearData: function () {
            setData(null);
        }
    }
}]);