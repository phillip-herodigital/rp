/* Marketing Controller
 *
 */
ngApp.controller('MarketingCtrl', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {

	$scope.themes = [
		{
			'name': 'blue',
			'bgClass': 'bg-blue',
			'borderClass': 'border border-blue',
			'accentClass': 'accent-blue'
		},
		{
			'name': 'paleblue',
			'bgClass': 'bg-paleblue',
			'borderClass': 'border border-paleblue',
			'accentClass': 'accent-paleblue'
		},
		{
			'name': 'darkblue',
			'bgClass': 'bg-darkblue',
			'borderClass': 'border border-darkblue',
			'accentClass': 'accent-darkblue'
		},
		{
			'name': 'green',
			'bgClass': 'bg-green',
			'borderClass': 'border border-green',
			'accentClass': 'accent-green'
		},
		{
			'name': 'palegreen',
			'bgClass': 'bg-palegreen',
			'borderClass': 'border border-palegreen',
			'accentClass': 'accent-palegreen'
		},
		{
			'name': 'orange',
			'bgClass': 'bg-orange',
			'borderClass': 'border border-orange',
			'accentClass': 'accent-orange'
		},
		{
			'name': 'red',
			'bgClass': 'bg-red',
			'borderClass': 'border border-red',
			'accentClass': 'accent-red'
		},
		{
			'name': 'palered',
			'bgClass': 'bg-palered',
			'borderClass': 'border border-palered',
			'accentClass': 'accent-palered'
		},
		{
			'name': 'white',
			'bgClass': 'bg-white',
			'borderClass': 'border border-white',
			'accentClass': 'accent-white'
		}
	];

	$scope.view = {};

	// Methods
	$scope.toggleTheme = function(theme) {
		// Calling myMethod() from the view will cause this method to run.
		$scope.activeTheme = theme;
	};
	$scope.toggleTheme = function(theme) {
		// Calling myMethod() from the view will cause this method to run.
		$scope.activeTheme = theme;
	};

}]);