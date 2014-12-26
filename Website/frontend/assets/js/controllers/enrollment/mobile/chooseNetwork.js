ngApp.controller('MobileEnrollmentChooseNetworkCtrl', ['$scope', '$filter', '$modal', '$http', 'enrollmentService', 'enrollmentCartService', 'enrollmentStepsService', 'mobileEnrollmentService', function ($scope, $filter, $modal, $http, enrollmentService, enrollmentCartService, enrollmentStepsService, mobileEnrollmentService) {

    var excludedStates = ['AK', 'HI', 'PR'];

    $scope.mobileEnrollmentService = mobileEnrollmentService;

    $scope.data = { serviceState: 'TX' };
    $scope.data.serviceLocation = {};
    $scope.showNetworks = true;

    if (window.location.href.indexOf('sprintBuyPhone') > 0) {
        $scope.mobileEnrollmentSettings.sprintBuyPhone = true;
    }

    if (window.location.href.indexOf('sprintByod') > 0) {
        $scope.mobileEnrollmentSettings.sprintByod = true;
    }

    $scope.chooseNetwork = function(network, phoneType) {
        $scope.mobileEnrollment.phoneTypeTab = phoneType;
        mobileEnrollmentService.selectedNetwork = _.where($scope.mobileEnrollmentService.availableNetworks, { value: network })[0];
        enrollmentStepsService.setStep('phoneFlowDevices');
    };

    $scope.lookupZip = function () {
        enrollmentService.isLoading = true;
        $http.get('/api/addresses/lookupZip/' + $scope.postalCode5)
        .success(function (data) {
            enrollmentService.isLoading = false;
            if (data.length != 0) {
                mobileEnrollmentService.state = data[0];
                mobileEnrollmentService.postalCode5 = $scope.postalCode5;

                $scope.data.serviceLocation.address = {
                    line1: '',
                    line2: '',
                    city: '',
                    stateAbbreviation: data[0], 
                    postalCode5: $scope.postalCode5
                };

                $scope.data.serviceLocation.capabilities = [{ "capabilityType": "ServiceStatus", "enrollmentType": "moveIn" }];
                $scope.data.serviceLocation.capabilities.push({ "capabilityType": "CustomerType", "customerType": mobileEnrollmentService.planType });
                $scope.data.serviceLocation.capabilities.push({ "capabilityType": "Mobile", "serviceProvider": mobileEnrollmentService.selectedNetwork });


                var activeService = enrollmentCartService.getActiveService();
                if (activeService) {
                    activeService.location = $scope.data.serviceLocation;
                    enrollmentService.setSelectedOffers(true);
                }
                else {
                    enrollmentCartService.addService({ location: $scope.data.serviceLocation });
                    enrollmentService.setServiceInformation(true);
                }

                // if no plans come back, show the "no plans available" dialog
                if (enrollmentCartService.cart[0].eligibility != 'success') {
                    $scope.showNetworks = false;
                }
            }
            else {
                $scope.showNetworks = false;
            }
        })
    };
    
}]);