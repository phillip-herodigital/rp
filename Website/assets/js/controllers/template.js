/* Template Controller
 *
 * This file can be used as a starting point for new controllers. We're injecting the most common service dependencies, but additional may be needed.
 * New JS files should be added to Titan.Website/App_Start/BundleConfig.cs
 * See http://docs.angularjs.org/guide/controller for additional information about AngularJS Controllers
 */
ngApp.controller('TemplateCtrl', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {

	// Scope properties
	//$scope.propertyName = model.propertyName; // Bind a model value to a scope variable to it can be accessed from the view.

	// Methods
	$scope.myMethod = function() {
		// Calling myMethod() from the view will cause this method to run.
	};

}]);