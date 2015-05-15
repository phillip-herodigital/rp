/* Account Information Controller
 *
 */
ngApp.controller('AcctAccountInformationCtrl', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
	// create a blank object to hold the form information
	$scope.formData = { phone : []};

	// when the account selector changes, reload the data
	$scope.$watch('selectedAccount.accountNumber', function(newVal) { 
		if (newVal) {
			$scope.isLoading = true;
			$http({
				method  : 'POST',
				url     : '/api/account/getAccountInformation',
				data    : { 'accountNumber' : newVal },
				headers : { 'Content-Type': 'application/JSON' } 
			})
				.success(function (data, status, headers, config) {
					$scope.formData = data;
					$scope.formDataOriginal = angular.copy($scope.formData);

					$scope.formData.serviceAddress = $scope.formData.serviceAddresses[0];
					
					$scope.additionalInformation = {
					    showAdditionalPhoneNumber: ($scope.formData.phone[1] && typeof($scope.formData.phone[1].number) != 'undefined'),
					};
					$scope.successMessage = false;
					$scope.isLoading = false;
				});
		}
	}); 

	$scope.showAdditionalPhoneNumberChanged = function() {
        if ($scope.additionalInformation.showAdditionalPhoneNumber) {
            $scope.formData.phone[1] = {};
        } else {
            $scope.formData.phone.splice(1, 1);
        }
    };

    // create a filter so that the same phone type can't be selected twice
    $scope.filter1 = function(item){
        return (!($scope.formData.phone[0] && $scope.formData.phone[0].category) || item.name != $scope.formData.phone[0].category);
    };

    $scope.filter2 = function(item){
        return (!($scope.formData.phone.length > 1 && $scope.formData.phone[1].category) || item.name != $scope.formData.phone[1].category);
    };

    $scope.filterCustomerType = function(item){
        if ($scope.formData.customerType != 'commercial') {
            return (item.name != 'work');
        } else {
            return (item.name != 'home');
        }
    };

	// process the form
	$scope.updateAccountInformation = function() {
		// format the request data
	    var requestData = {};

	    $scope.successMessage = $scope.errorMessage = false;
		
		requestData.accountNumber = $scope.selectedAccount.accountNumber;
		requestData.phone = $scope.formData.phone;
		requestData.email = $scope.formData.email;

		if ($scope.formData.sameAsService) {
			requestData.billingAddress = $scope.formData.serviceAddress;
		} else {
			requestData.billingAddress = $scope.formData.billingAddress;
		}
		requestData.disablePrintedInvoices = $scope.formData.disablePrintedInvoices;

		$scope.isLoading = true;

		// sent the update
		$http({
		    method: 'POST',
		    url: '/api/account/updateAccountInformation',
		    data: requestData,
		    headers: { 'Content-Type': 'application/JSON' }
		})
			.success(function (data, status, headers, config) {
			    $scope.isLoading = false;
			    if (data.validations.length) {
			        // if not successful, bind errors to error variables
			        $scope.validations = data.validations;

			    } else if (!data.success) {
			        $scope.errorMessage = true;
			    } else {
			        // if successful, show the success message
			        $scope.formDataOriginal = angular.copy($scope.formData);
			        $scope.successMessage = true;
			    }
			})
	        .error(function (data, status, headers, config) {
	            $scope.isLoading = false;
	            $scope.errorMessage = true;
	        });
	};

}]);