/* Login Horizontal Controller
 *
 */
ngApp.controller('LoginCtrl', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {

	var TX_URL, GA_URL;
	$scope.init = function (TxUrl, GaUrl) {
		TX_URL = TxUrl;
		GA_URL = GaUrl;
	}

	$scope.username = '';
	$scope.password = '';
	$scope.state = 'TX';

	$scope.loginClicked = function (state) {
		var values = {
			"__VIEWSTATE": "/wEPDwULLTIwNTMxMjY4NjYPZBYCZg9kFgICAw9kFgJmD2QWAmYPZBYCAgEPZBYEZg9kFgQCAQ8PFgIeB1Zpc2libGVoZGQCAw8WAh8AaBYCAgEPEGQPFgJmAgEWAhAFDlByZS1Qcm9kdWN0aW9uBQRQUkVQZxAFClByb2R1Y3Rpb24FBFBST0RnFgFmZAIFDw8WAh8AaGRkGAIFHl9fQ29udHJvbHNSZXF1aXJlUG9zdEJhY2tLZXlfXxYDBRdjdGwwMCRsb2dpblN0YXR1cyRjdGwwMQUXY3RsMDAkbG9naW5TdGF0dXMkY3RsMDMFImN0bDAwJE1haW4kTG9naW5Cb3gkY2JMQlJlbWVtYmVyTWUFEmN0bDAwJE1haW4kbXZMb2dpbg8PZGZkxS0tI0PhTMIq8gdTrw02Y+RcNKM=",
			"__EVENTVALIDATION": "/wEWBwKC5be7BQKigqXKBwKCxOKEAgKbnbviAQK0lemyDwKdkPieBQKn1slAc4mkMU6f92LK1R7AIGnOiYCg6ZU=",
			"ctl00$Main$LoginBox$UserName": $scope.username,
			"ctl00$Main$LoginBox$Password": $scope.password,
			"ctl00$Main$LoginBox$btLogin": "login"
		};
		if (state == "GA" || $scope.state == "GA") {
			values["__VIEWSTATE"] = "/wEPDwULLTIwNTMxMjY4NjYPZBYCZg9kFgICAw9kFgJmD2QWAmYPZBYCAgEPZBYEZg9kFgQCAQ8PFgIeB1Zpc2libGVoZGQCAw8WAh8AaBYCAgEPEGQPFgJmAgEWAhAFDlByZS1Qcm9kdWN0aW9uBQRQUkVQZxAFClByb2R1Y3Rpb24FBFBST0RnFgFmZAIFDw8WAh8AaGRkGAIFHl9fQ29udHJvbHNSZXF1aXJlUG9zdEJhY2tLZXlfXxYDBRdjdGwwMCRsb2dpblN0YXR1cyRjdGwwMQUXY3RsMDAkbG9naW5TdGF0dXMkY3RsMDMFImN0bDAwJE1haW4kTG9naW5Cb3gkY2JMQlJlbWVtYmVyTWUFEmN0bDAwJE1haW4kbXZMb2dpbg8PZGZkmoTRR5OvQRbE7n9Nkz2gh3HdLsk=";
			values["__EVENTVALIDATION"] = "/wEWBwLn5YY6AqKCpcoHAoLE4oQCApudu+IBArSV6bIPAp2Q+J4FAqfWyUAEnNCT7gLFbsM26Kb2VWeCqr2Q3w==";
		}

		var form = document.createElement("form");
		form.setAttribute("method", "post");
		form.setAttribute("action", (state == "GA" || $scope.state == "GA") ? GA_URL : TX_URL);

		for (var value in values) {
			var field = document.createElement("input");
			field.setAttribute("name", value);
			field.setAttribute("value", values[value]);
			form.appendChild(field);
		}

		document.body.appendChild(form);
		form.submit();
	}
}]);