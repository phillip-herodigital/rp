/* Invoices Controller
 */
ngApp.controller('InvoicesCtrl', ['$scope', '$rootScope', '$http', '$filter', '$timeout', function ($scope, $rootScope, $http, $filter, $timeout) {

	// Scope properties

	// $scope.invoicesTable = {
	// 	"columnList": [
	// 		{
	// 			"field": "accountNumber",
	// 			"displayName": "Account Number",
	// 			"isVisible": true,
	// 			"hide": ["phone"]
	// 		},
	// 		{
	// 			"field": "serviceType",
	// 			"displayName": "Service Type",
	// 			"isVisible": true
	// 		},
	// 		{
	// 			"field": "invoiceNumber",
	// 			"displayName": "Invoice Number",
	// 			"isVisible": true,
	// 			"hide": ["tablet", "phone"]
	// 		},
	// 		{
	// 			"field": "invoiceAmount",
	// 			"displayName": "Invoice Amount",
	// 			"isVisible": true,
	// 		},
	// 		{
	// 			"field": "dueDate",
	// 			"displayName": "Due Date",
	// 			"isVisible": true,
	// 			"hide": ["tablet", "phone"]
	// 		},
	// 		{
	// 			"field": "action",
	// 			"displayName": "Action",
	// 			"isVisible": true,
	// 			"hide": ["phone"]
	// 		}
	// 	],
	// 	"values": [
	// 		{
	// 			"accountNumber": 1197015532,
	// 			"serviceType": "HomeLife Services",
	// 			"invoiceNumber": 1030523546381,
	// 			"invoiceAmount": "24.99",
	// 			"dueDate": "04/05/2014",
	// 			"isPaid": false,
	// 			"canRequestExtension": true
	// 		},
	// 		{
	// 			"accountNumber": 219849302,
	// 			"serviceType": "Utility",
	// 			"invoiceNumber": 1020453546012,
	// 			"invoiceAmount": "93.72",
	// 			"dueDate": "04/03/2014",
	// 			"isPaid": false,
	// 			"canRequestExtension": false
	// 		},
	// 		{
	// 			"accountNumber": 194829927,
	// 			"serviceType": "Utility",
	// 			"invoiceNumber": 1030523546381,
	// 			"invoiceAmount": "52.24",
	// 			"dueDate": "04/01/2014",
	// 			"isPaid": false,
	// 			"canRequestExtension": false
	// 		},
	// 		{
	// 			"accountNumber": 1197015532,
	// 			"serviceType": "HomeLife Services",
	// 			"invoiceNumber": 1030523546381,
	// 			"invoiceAmount": "24.99",
	// 			"dueDate": "03/05/2014",
	// 			"isPaid": true,
	// 			"canRequestExtension": true
	// 		},
	// 		{
	// 			"accountNumber": 219849302,
	// 			"serviceType": "Utility",
	// 			"invoiceNumber": 1020453546012,
	// 			"invoiceAmount": "93.72",
	// 			"dueDate": "03/03/2014",
	// 			"isPaid": true,
	// 			"canRequestExtension": false
	// 		},
	// 		{
	// 			"accountNumber": 194829927,
	// 			"serviceType": "Utility",
	// 			"invoiceNumber": 1030523546381,
	// 			"invoiceAmount": "52.24",
	// 			"dueDate": "03/01/2014",
	// 			"isPaid": true,
	// 			"canRequestExtension": false
	// 		},
	// 		{
	// 			"accountNumber": 1197015532,
	// 			"serviceType": "HomeLife Services",
	// 			"invoiceNumber": 1030523546381,
	// 			"invoiceAmount": "24.99",
	// 			"dueDate": "02/05/2014",
	// 			"isPaid": true,
	// 			"canRequestExtension": true
	// 		},
	// 		{
	// 			"accountNumber": 219849302,
	// 			"serviceType": "Utility",
	// 			"invoiceNumber": 1020453546012,
	// 			"invoiceAmount": "93.72",
	// 			"dueDate": "02/03/2014",
	// 			"isPaid": true,
	// 			"canRequestExtension": false
	// 		},
	// 		{
	// 			"accountNumber": 194829927,
	// 			"serviceType": "Utility",
	// 			"invoiceNumber": 1030523546381,
	// 			"invoiceAmount": "52.24",
	// 			"dueDate": "02/01/2014",
	// 			"isPaid": true,
	// 			"canRequestExtension": false
	// 		},


	// 		{
	// 			"accountNumber": 1197015532,
	// 			"serviceType": "HomeLife Services",
	// 			"invoiceNumber": 1030523546381,
	// 			"invoiceAmount": "24.99",
	// 			"dueDate": "04/05/2014",
	// 			"isPaid": true,
	// 			"canRequestExtension": true
	// 		},
	// 		{
	// 			"accountNumber": 219849302,
	// 			"serviceType": "Utility",
	// 			"invoiceNumber": 1020453546012,
	// 			"invoiceAmount": "93.72",
	// 			"dueDate": "04/03/2014",
	// 			"isPaid": true,
	// 			"canRequestExtension": false
	// 		},
	// 		{
	// 			"accountNumber": 194829927,
	// 			"serviceType": "Utility",
	// 			"invoiceNumber": 1030523546381,
	// 			"invoiceAmount": "52.24",
	// 			"dueDate": "04/01/2014",
	// 			"isPaid": true,
	// 			"canRequestExtension": false
	// 		},
	// 		{
	// 			"accountNumber": 1197015532,
	// 			"serviceType": "HomeLife Services",
	// 			"invoiceNumber": 1030523546381,
	// 			"invoiceAmount": "24.99",
	// 			"dueDate": "03/05/2014",
	// 			"isPaid": true,
	// 			"canRequestExtension": true
	// 		},
	// 		{
	// 			"accountNumber": 219849302,
	// 			"serviceType": "Utility",
	// 			"invoiceNumber": 1020453546012,
	// 			"invoiceAmount": "93.72",
	// 			"dueDate": "03/03/2014",
	// 			"isPaid": true,
	// 			"canRequestExtension": false
	// 		},
	// 		{
	// 			"accountNumber": 194829927,
	// 			"serviceType": "Utility",
	// 			"invoiceNumber": 1030523546381,
	// 			"invoiceAmount": "52.24",
	// 			"dueDate": "03/01/2014",
	// 			"isPaid": true,
	// 			"canRequestExtension": false
	// 		},
	// 		{
	// 			"accountNumber": 1197015532,
	// 			"serviceType": "HomeLife Services",
	// 			"invoiceNumber": 1030523546381,
	// 			"invoiceAmount": "24.99",
	// 			"dueDate": "02/05/2014",
	// 			"isPaid": true,
	// 			"canRequestExtension": true
	// 		},
	// 		{
	// 			"accountNumber": 219849302,
	// 			"serviceType": "Utility",
	// 			"invoiceNumber": 1020453546012,
	// 			"invoiceAmount": "93.72",
	// 			"dueDate": "02/03/2014",
	// 			"isPaid": true,
	// 			"canRequestExtension": false
	// 		},
	// 		{
	// 			"accountNumber": 194829927,
	// 			"serviceType": "Utility",
	// 			"invoiceNumber": 1030523546381,
	// 			"invoiceAmount": "52.24",
	// 			"dueDate": "02/01/2014",
	// 			"isPaid": true,
	// 			"canRequestExtension": false
	// 		}
	// 	]
	// };

	$scope.invoicesTable = {
		"columnList": [
			{
				"field": "accountNumber",
				"displayName": "Account Number",
				"isVisible": true,
				"hide": ["phone"]
			},
			{
				"field": "serviceType",
				"displayName": "Service Type",
				"isVisible": true
			},
			{
				"field": "invoiceNumber",
				"displayName": "Invoice Number",
				"isVisible": true,
				"hide": ["tablet", "phone"]
			},
			{
				"field": "invoiceAmount",
				"displayName": "Invoice Amount",
				"isVisible": true,
			},
			{
				"field": "dueDate",
				"displayName": "Due Date",
				"isVisible": true,
				"hide": ["tablet", "phone"]
			},
			{
				"field": "action",
				"displayName": "Action",
				"isVisible": true,
				"hide": ["phone"]
			}
		],
		"values": [
			
		]
	};

	//$scope.invoicesTable = {};
	$scope.isLoading = true;

	$timeout(function() {

		$http.get('assets/json/invoices.json').success(function(data, status, headers, config) {
			$scope.invoicesTable = data;
			$scope.invoicesTableOriginal = angular.copy($scope.invoicesTable);
			$scope.isLoading = false;
		});
	}, 2000);

	$scope.filters = {};
	$scope.filtersList = {
		"serviceType": [
			{
				"name": "HomeLife Services",
				"value": "HomeLife Services"
			},
			{
				"name": "Utility",
				"value": "Utility"
			}
		],
		"accountNumber": [
			{
				"name": "1197015532",
				"value": "1197015532"
			},
			{
				"name": "219849302",
				"value": "219849302"
			},
			{
				"name": "194829927",
				"value": "194829927"
			}
		],
		"isPaid": [
			{
				"name": "Paid",
				"value": true
			},
			{
				"name": "Unpaid",
				"value": false
			}
		]
	};

	// Methods

	$scope.resetFilters = function() {
		$scope.filters = {};
	};

	$scope.isFiltered = function() {
		return !_.isEmpty($scope.filters);
	}

	$scope.test = function() {
		console.log($scope);
	};

	// Watches

	$scope.$watch('filters', function(newVal, oldVal) {
		
		$scope.filters = $filter('removeNullProps')($scope.filters);
		if ($scope.invoicesTable.length) {
			$scope.invoicesTable.values = $filter('filter')($scope.invoicesTableOriginal.values, $scope.filters);
		}

	}, true);

}]);