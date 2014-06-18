/* Enrollment Service Information Controller
 *
 * This is used to control aspects of let's get started on enrollment page.
 */
ngApp.controller('EnrollmentServiceInformationCtrl', ['$scope', '$rootScope', '$http', '$location', '$filter', 'enrollmentService', 'utilityProductsService', function ($scope, $rootScope, $http, $location, $filter, enrollmentService, utilityProductsService) {
    $scope.validations = enrollmentService.validations;
    $scope.utilityService = utilityProductsService;

    //Set the default service information
    $scope.serviceInformation = utilityProductsService.getServiceInformationObject();

    //Checking to see when the active service address has been updated
    //So we can reinitialize all service information for this page
    //There has to be a better way of doing this
    $scope.$on('updateActiveServiceAddress', function(event, value) {
        if(utilityProductsService.isNewServiceAddress) {
            $scope.serviceInformation = utilityProductsService.getServiceInformationObject();
        } else {
            $scope.serviceInformation = utilityProductsService.getServiceInformationObject(value);
        }
    });

    /**
     * Checking if the current form is valid to continue
     * Form level validation is done outside of here, this is checking to ensure
     * we have the correct data
     * @return {Boolean}
     */
    $scope.isFormValid = function() {
        //TODO: Check for a duplicate address in cart as well
        if(typeof $scope.serviceInformation.location == 'object' && $scope.serviceInformation.isNewService > -1) {
            return true;
        } else {
            return false;
        }
    };

    /**
     * Complete the Service Information Step
     * @return {[type]} [description]
     */
    $scope.completeStep = function () {
        var postData = utilityProductsService.createPostObject($scope.serviceInformation);

        //Save the updated locations to the server
        var serviceInformationPromise = enrollmentService.setServiceInformation(postData);
        
        serviceInformationPromise.then(function (data) {
            //Set the validations
            $scope.validations = data.validations;

            //Add the locations to our utility service
            utilityProductsService.isNewServiceAddress = false;
            utilityProductsService.addServiceAddress(data.cart);
            utilityProductsService.setActiveServiceAddress($scope.serviceInformation.location.address);

            //Move to the next section
            $scope.stepsService.setStep('utilityFlowPlans');
        }, function (data) {
            // error response
            $rootScope.$broadcast('connectionFailure');
        });
    };
}]);