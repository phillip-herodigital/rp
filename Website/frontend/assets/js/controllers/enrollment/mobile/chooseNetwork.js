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

    $scope.$watch(enrollmentCartService.getActiveService, function (address) {
        var availableDevices = [];
        if (address && _.filter(address.offerInformationByType, {'key': 'Mobile'}).length != 0) {
            // change the stock and add prices for the phones we get back from BeQuick
            angular.forEach(_.filter(address.offerInformationByType, {'key': 'Mobile'}).value.availableOffers, function (entry) {
                availableDevices.push(entry.mobileInventory);
            });
            _(availableDevices).flatten().filter().uniq('id').forEach(function (device) {
                _.find(mobileEnrollmentService.getPhoneData(), function(phone) {
                    _.find(phone.models, function(model) {
                        if (model.sku == device.id) {
                            model.inStock = true;
                            model.price = device.price;
                        } else {
                            _.find(model.installmentPlans, function(installmentPlan) {
                                if (installmentPlan.aGroupSku == device.id) {
                                    installmentPlan.inStock = true;
                                    installmentPlan.price = device.price;
                                }
                            })
                        }
                    })
                });
            });
        }
    });

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
                    line1: 'Line1',
                    city: 'City',
                    stateAbbreviation: data[0], 
                    postalCode5: $scope.postalCode5
                };

                $scope.data.serviceLocation.capabilities = [{ "capabilityType": "ServiceStatus", "enrollmentType": "moveIn" }];
                $scope.data.serviceLocation.capabilities.push({ "capabilityType": "CustomerType", "customerType": mobileEnrollmentService.planType.toLowerCase() });
                $scope.data.serviceLocation.capabilities.push({ "capabilityType": "Mobile" });

                //$scope.$parent.customerType = mobileEnrollmentService.planType.toLowerCase();

                var activeService = enrollmentCartService.getActiveService();
                if (activeService) {
                    activeService.location = $scope.data.serviceLocation;
                    enrollmentService.setSelectedOffers(true);
                }
                else {
                    enrollmentCartService.addService({ location: $scope.data.serviceLocation });
                    enrollmentService.setServiceInformation(true);
                    activeService = enrollmentCartService.getActiveService();
                }

                // if no plans come back, show the "no plans available" dialog
                var address = enrollmentCartService.getActiveService();
                if (address.eligibility && address.eligibility != "success") {
                    $scope.showNetworks = false;
                } 
                else {
                    $scope.showNetworks = true;
                }
            }
            else {
                $scope.showNetworks = false;
            }
        })
    };

}]);