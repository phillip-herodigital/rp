/* Enrollment Service Information Controller
 *
 * This is used to control aspects of let's get started on enrollment page.
 */
ngApp.controller('EnrollmentServiceInformationCtrl', ['$scope', '$location', '$filter', 'enrollmentService', 'enrollmentCartService', 'enrollmentStepsService', function ($scope, $location, $filter, enrollmentService, enrollmentCartService, enrollmentStepsService) {
    // TODO - chose state by geoIP
    $scope.data = { serviceState: 'TX' };

    //Checking to see when the active service address has been updated
    //So we can reinitialize all service information for this page
    //There has to be a better way of doing this
    $scope.$watch(enrollmentCartService.getActiveService, function (newValue) {        
        if (!newValue) {
            $scope.data.serviceLocation = null;
            $scope.data.isNewService = undefined;
        } else {
            $scope.data.serviceLocation = newValue.location;
            var target = _(newValue.location.capabilities).find({ capabilityType: "ServiceStatus" });
            if (target) {
                $scope.data.isNewService = target.isNewService;
            }
            else {
                $scope.data.isNewService = undefined;
            }
        }
    });

    $scope.$watch('data', function (newValue) {
        if (!enrollmentCartService.getActiveService() || enrollmentCartService.getActiveService().location != $scope.data.serviceLocation) {
            enrollmentStepsService.setMaxStep('utilityFlowService');
        }
        else {
            console.log(enrollmentCartService.getActiveService(), $scope.data);
        }

        if(typeof newValue.serviceLocation != 'string') {
            $scope.errorMessage = false;
        }
    }, true);

    /**
     * Checking if the current form is valid to continue
     * Form level validation is done outside of here, this is checking to ensure
     * we have the correct data
     * @return {Boolean}
     */
    $scope.isFormValid = function() {
        if ($scope.data.serviceLocation !== null && typeof $scope.data.serviceLocation == 'object' && $scope.data.isNewService !== undefined) {
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

        //Someone bypassed the disabled button, lets send an error
        if(typeof $scope.data.serviceLocation == 'string' || $scope.data.serviceLocation === null) {
            $scope.errorMessage = true;
            return;
        } 

        $scope.data.serviceLocation.capabilities.push({ "capabilityType": "ServiceStatus", "isNewService": $scope.data.isNewService });

        var activeService = enrollmentCartService.getActiveService();
        if (activeService) {
            activeService.location = $scope.data.serviceLocation;
            enrollmentService.setSelectedOffers();
        }
        else {
            enrollmentCartService.addService({ location: $scope.data.serviceLocation });
            enrollmentService.setServiceInformation();
        }
    };
}]);