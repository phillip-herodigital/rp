/* 
	Authentication - Login Controller
 */
streamApp.controller('AuthLoginCtrl', ['$scope', '$http', '$window', '$sce', '$location', 'appDataService', function ($scope, $http, $window, $sce, $location, appDataService) {
    // create a blank object to hold the form information
    $scope.formData = {};
    $scope.isLoading = false;
    $scope.timeoutMessage = false;
    $scope.pageClass = 'page-login';

    $scope.init = function (genericErrorMessage, impersonateErrorMessage) {
        var url = $location.absUrl();
        if (url.indexOf('error=true') > 0) {
            if (url.indexOf('type=impersonate') > 0) {
                $scope.loginError = $sce.trustAsHtml(impersonateErrorMessage)
            } else {
                $scope.loginError = $sce.trustAsHtml(genericErrorMessage)
            }
            var indexOfUsername = url.indexOf("username=");
            if (indexOfUsername > 0) {
                $scope.formData.username = url.substring(indexOfUsername + 9);
            }
        }
        if (url.indexOf('timeout=true') > 0) {
            $scope.timeoutMessage = true;
        }
    }
    // process the form
    $scope.login = function () {
        $scope.formData.rememberMe = !!$scope.formData.rememberMe;

        //Maybe delete this
        $scope.isLoading = true;


        // add the URL to the login submission object
        $scope.formData.uri = document.URL;

        var loginAPI = '/api/authentication/login';


        $http({
            method: 'POST',
            url: loginAPI,
            data: $scope.formData,
            //headers: { 'Content-Type': 'application/JSON' }
        })
        .then(function successCallback(response) {
            var data = response.data;
            if (!data.success) {

                if (data.redirect) {
                    $window.location.href = data.redirect;
                }
                $scope.isLoading = false;
                // if not successful, bind errors to error variables
                $scope.loginError = $sce.trustAsHtml(data.validations[0].text);

            } else {
                appDataService.loadData();
                //update this to a promise

                $scope.go("dashboard");
            }
        },
            function errorCallback(response) {
                //This is purely test code for right now to avoid the iP anti/forgery issue in dev.
                //Create a "fake" user to pass through.
                if ($scope.formData.username.toLowerCase() == "fake" && $scope.formData.password.toLowerCase() == "fake") {
                    $scope.go("dashboard");
                }

                //alert(response.statusText)
            }
        )

			//.success(function (data, status, headers, config) {
			    
			//}).error(function (response) {
			//    alert(response.statusText);
			//});
    };

    $scope.logout = function () {
        var logoutApi = "/api/authentication/applogout";
        var data = {'uri':"#"};
        $http({
            method: 'GET',
            url: logoutApi,
            data: data,
            headers: { 'Content-Type': 'application/JSON' }
        })
			.success(function (data, status, headers, config) {
			    //$window.GlobalData.User = null;
			    appDataService.clearData();

			    $scope.go("");
			}).error(function () {
			    appDataService.clearData();
			});
    }

}]);