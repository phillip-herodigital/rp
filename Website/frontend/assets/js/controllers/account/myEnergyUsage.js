/* My Energy Usage Controller
 *
 */
ngApp.controller('AcctMyEnergyUsageCtrl', ['$scope', '$rootScope', '$http', '$timeout', function ($scope, $rootScope, $http, $timeout) {
	// set the graph options
	$scope.options = {
		lineMode: "cardinal",
		tension: 0.7,
		axes: {
		x: {type: "linear", key: "month", 
				labelFunction: function (v) {
					switch (v) {
						case 1: return 'JAN';
						case 2: return 'FEB';
						case 3: return 'MAR';
						case 4: return 'APR';
						case 5: return 'MAY';
						case 6: return 'JUN';
						case 7: return 'JUL';
						case 8: return 'AUG';
						case 9: return 'SEP';
						case 10: return 'OCT';
						case 11: return 'NOV';
						case 12: return 'DEC';
						default: return '';
					}
				}
			},
		y: {type: "linear", min: 0, max: 250,
				labelFunction: function (v) {
					if (v/20 % 2) {
						return ""
					} else {
						return v;
					}
				}
			},
		y2: {type: "linear", min: 0, max: 100,
				labelFunction: function (v) {
					if (v/2 % 2) {
						return ""
					} else {
						return v;
					}
				}
			}
		},
		drawLegend: false,
		drawDots: true,
		series: [
			{
				y: "electric",
				label: "Electricity",
				type: "column",
				color: "#77bd43",
				axis: "y",
				visible: true
			},
			{
				y: "gas",
				label: "Gas",
				color: "#2a93c7",
				axis: "y2",
				type: "line",
				thickness: "3px",
				visible: true
			}
		],
		tooltip: {mode: "scrubber", interpolate: false,
			formatter: function (x, y, series) {
				var month = "";
				switch (x) {
						case 1: month = "January"; break
						case 2: month = "February"; break
						case 3: month = "March"; break
						case 4: month = "April"; break
						case 5: month = "May"; break
						case 6: month = "June"; break
						case 7: month = "July"; break
						case 8: month = "August"; break
						case 9: month = "September"; break
						case 10: month = "October"; break
						case 11: month = "November"; break
						case 12: month = "December"; break
					}
				var units = (series.label == "Electricity") ? "kWh" : "Therms";
				var tooltip = month + " " + series.label + ": "+ y + " " + units;
				return tooltip;
			}
		}
	};

	// get the account selector data
	$http.get('/api/account/getAccounts').success(function (data, status, headers, config) {
		$scope.accounts = data;
		// initialize the current account
		$scope.currentAccount = $scope.accounts[0];
		$scope.currentSubAccount = $scope.currentAccount.subAccounts[0];
		$scope.updateSelectedAccount($scope.currentAccount.accountNumber, $scope.currentAccount.subAccountLabel, $scope.currentSubAccount);

	});

	$scope.updateSelectedAccount = function(accountNumber, subAccountLabel, subaccount) {
		$scope.selectedAccount.accountNumber = accountNumber;
		$scope.selectedAccount.subAccountLabel = subAccountLabel;
		$scope.selectedAccount.subaccount = subaccount;
	};
	
	// create a blank array to hold the graph data
	$scope.energyUsage = [];

	// when the account selector changes, reload the data
	$scope.$watch('selectedAccount.accountNumber', function(newVal) { 
		if (newVal) {
			$timeout(function () {
				$http({
					method  : 'POST',
					url     : '/api/account/getEnergyUsage',
					data    : { 'accountNumber' : newVal },
					headers : { 'Content-Type': 'application/JSON' } 
				})
					.success(function (data, status, headers, config) {
						$scope.energyUsage = data.energyUsage;
					});
			}, 800);
		}
	});

	$scope.data = [   
		{ month: 01, electric: 80, gas: 42 },  
		{ month: 02, electric: 70, gas: 45 },  
		{ month: 03, electric: 80, gas: 60 },  
		{ month: 04, electric: 110, gas: 58 },  
		{ month: 05, electric: 110, gas: 70 },  
		{ month: 06, electric: 125, gas: 78 },  
		{ month: 07, electric: 175, gas: 90 },  
		{ month: 08, electric: 200, gas: 81 },  
		{ month: 09, electric: 175, gas: 77 },  
		{ month: 10, electric: 160, gas: 79 },  
		{ month: 11, electric: 140, gas: 62 },  
		{ month: 12, electric: 130, gas: 58 } 
	];


}]);