/* My Energy Usage Controller
 *
 */
ngApp.controller('AcctMyEnergyUsageCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$window', function ($scope, $rootScope, $http, $timeout, $window) {
	// set the graph options
	var monthNames = ['','January','February','March','April','May','June','July','August','September','October','November','December']
	var monthAbbreviations = ['','JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
	$scope.options = {
		lineMode: 'cardinal',
		tension: 0.7,
		axes: {
			x: {type: 'linear', key: 'month', 
					labelFunction: function (v) {
						return monthAbbreviations[v];
					}
				},
			y: {type: 'linear', min: 0}//,
			//y2: {type: 'linear', min: 0, max: 100}
		},
		drawLegend: false,
		drawDots: true,
		series: [
			{
				y: 'usage',
				label: 'Usage',
				type: 'column',
				color: '#77bd43',
				axis: 'y',
				visible: true
			}/*,
			{
				y: 'gas',
				label: 'Gas',
				color: '#2a93c7',
				axis: 'y2',
				type: 'line',
				thickness: '3px',
				visible: true
			}*/
		],
		tooltip: {mode: 'scrubber', interpolate: false,
			formatter: function (x, y, series) {
				var month = monthNames[x];
				var units = (series.label == 'Electricity') ? 'kWh' : 'Therms';
				var tooltip = month + ' ' + series.label + ': ' + y + ' ' + units;
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
			$scope.isLoading = true;
			$timeout(function () {
				$http({
					method  : 'POST',
					url     : '/api/account/getEnergyUsage',
					data    : { 'accountNumber' : newVal },
					headers : { 'Content-Type': 'application/JSON' } 
				})
					.success(function (data, status, headers, config) {
						$scope.energyUsage = data.energyUsage;
						// if the window is sized to mobie, only load 4 columns on the graph
						if ($window.innerWidth < 768) {
							$scope.energyUsage = $scope.energyUsage.slice(-4);
							monthAbbreviations[8] = '';
						}
						var lastItem = $scope.energyUsage.length - 1;
						$scope.utilityType = data.utilityType;
						$scope.startMonth = monthNames[$scope.energyUsage[0].month];
						$scope.endMonth = monthNames[$scope.energyUsage[lastItem].month];
						$scope.endYear = $scope.energyUsage[lastItem].year;
						$scope.isLoading = false;
					});
			}, 800);
		}
	});

}]);