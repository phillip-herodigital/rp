/* Enrolled Accounts Controller
 *
 */
ngApp.controller('AcctEnrolledAccountsCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$modal',  'modalFactory', 'jQuery', function ($scope, $rootScope, $http, $timeout, $modal, modalFactory, jQuery) {
	// create a blank object to hold the form information
	$scope.formData = {};

	// get the current data
	$timeout(function() {
		$http.get('/api/account/getEnrolledAccounts').success(function (data, status, headers, config) {
			$scope.formData = data;
			$scope.formDataOriginal = angular.copy($scope.formData);
		});
	});

	$scope.open = function (accountNumber, modalTitle, modalBody, cancelButton, removeButton ) {
		/*
        var modalInstance = modalFactory.open({
            //templateUrl: 'myModalContent.html',
            controller: 'AcctEnrolledAccountsCtrl',
            modalContent: {
                title: modalTitle,
                body: modalBody,
                footer: '<button class="secondary" ng-click="close()">' + cancelButton + '</button>' +
                	'    <button ng-click="removeEnrolledAccount(' + accountNumber +')">' + removeButton + '</button>'
            },
            resolve: {
                data: function () {
                    return {
                        items: $scope.items
                    };
                }
            }
        });
		*/
    };

    $scope.close = function (result) {
        //$modalInstance.close(result);
        $rootScope.modalInstance.dismiss('Cancel');
    };


	// remove an enrolled account
	$scope.removeEnrolledAccount = function (accountNumber) {
		// format the request data
		var requestData = {};
		requestData.accountNumber = accountNumber;

		if (confirm('Are you sure that you want to remove this account?')){
			// sent the post
			$http({
				method  : 'POST',
				url     : '/api/account/removeEnrolledAccount',
				data    : requestData,
				headers : { 'Content-Type': 'application/JSON' } 
			})
				.success(function (data, status, headers, config) {
					if (!data.success) {
				        // if not successful, show an error

					} else {
						// if successful, remove the row
						for (var i = 0, len = $scope.formData.enrolledAccounts.length; i < len; i += 1) {
					        if ($scope.formData.enrolledAccounts[i] && $scope.formData.enrolledAccounts[i].accountNumber === accountNumber) {
					            $scope.formData.enrolledAccounts.splice(i, 1);
					        }
					    } 
					}
				});
		}	
	};

	// send letter of residency
	$scope.sendLetter = function (accountNumber) {
		// format the request data
		var requestData = {};
		requestData.accountNumber = accountNumber;

		// sent the post
		$http({
			method  : 'POST',
			url     : '/api/account/sendLetter',
			data    : requestData,
			headers : { 'Content-Type': 'application/JSON' } 
		})
			.success(function (data, status, headers, config) {
				if (!data.success) {
			        // if not successful, show an error

				} else {
					// if successful, alert the user
					//alert("successful");
				}
			});
	};

}]);