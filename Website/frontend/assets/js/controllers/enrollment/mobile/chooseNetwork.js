﻿ngApp.controller('MobileEnrollmentChooseNetworkCtrl', ['$scope', '$filter', '$modal', '$http', 'enrollmentService', 'enrollmentCartService', 'enrollmentStepsService', 'mobileEnrollmentService', 'analytics', function ($scope, $filter, $modal, $http, enrollmentService, enrollmentCartService, enrollmentStepsService, mobileEnrollmentService, analytics) {

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
        if (address && _.any(address.offerInformationByType, { 'key': 'Mobile' })) {
            var plansByProvider = _(address.offerInformationByType).where({ 'key': 'Mobile' }).pluck('value').pluck('availableOffers').flatten()
            // what we REALLY want here is to only show inventory that is actually available to all plans for the appropriate network.
                .groupBy(function (plan) { return plan.provider.toLowerCase(); }).value();

            $scope.gsmIndividualPrice = _(plansByProvider.att).filter({'isChildOffer': false, 'isParentOffer': false}).pluck('rates').filter().flatten().pluck('rateAmount').min().value();
            $scope.cdmaIndividualPrice = _(plansByProvider.sprint).filter({'isChildOffer': false, 'isParentOffer': false}).pluck('rates').filter().flatten().pluck('rateAmount').min().value();
            $scope.gsmSharedPrice =  _(plansByProvider.att).filter({'isChildOffer': false, 'isParentOffer': true}).pluck('rates').filter().flatten().pluck('rateAmount').min().value() +
                _(plansByProvider.att).filter({'isChildOffer': true, 'isParentOffer': false}).pluck('rates').filter().flatten().pluck('rateAmount').min().value();
            $scope.cdmaSharedPrice = _(plansByProvider.sprint).filter({'isChildOffer': false, 'isParentOffer': true}).pluck('rates').filter().flatten().pluck('rateAmount').min().value() +
                _(plansByProvider.sprint).filter({'isChildOffer': true, 'isParentOffer': false}).pluck('rates').filter().flatten().pluck('rateAmount').min().value();

            var networkInventory = _(plansByProvider)
                .mapValues(function (plansForProvider, providerName) {
                    return _(plansForProvider).map(function (plan) { return _.map(plan.mobileInventory, function (inventory) { return { inventory: inventory, plan: plan } }); })
                        .flatten()
                        .groupBy(function (inventoryPlan) { return inventoryPlan.inventory.id; })
                        .mapValues(function (inventoryPlans) { return { inventory: inventoryPlans[0].inventory, plans: _.pluck(inventoryPlans, 'plan') }; })
                        // we may want to remove phones that aren't available for all plans
                        //.where(function (inventoryPlans) { return inventoryPlans.plans.length == plansByProvider[providerName].length })
                        .value();
                }).value();

            var modelData = _(mobileEnrollmentService.getPhoneData()).pluck('models').flatten();
            _(networkInventory).values().map(function (v) { return _.values(v); }).flatten().pluck('inventory').forEach(function (inv) {
                var model = modelData.find(function (model) { return model.sku == inv.id });
                if (model) {
                    model.inStock = true;
                    model.price = inv.price;
                    model.installmentPlans.inStock = inv.installmentPlan.isAvailable;
                    model.installmentPlans.price = inv.installmentPlan.price;
                }
            });

            var providerStats = _(plansByProvider).mapValues(function (plansForProvider) {
                return {
                    planTypes:
                        {
                            individual: {
                                hasAny: _.some(plansForProvider, function (plan) { return !plan.isChildOffer && !plan.isParentOffer; }),
                                lowPrice: _(plansForProvider)
                                    .where(function (plan) { return !plan.isChildOffer && !plan.isParentOffer; })
                                    .map(function (plan) { return plan.rates[0].rateAmount; }).min()
                                    .value()
                            },
                            group: {
                                hasAny: _.some(plansForProvider, function (plan) { return plan.isChildOffer || plan.isParentOffer; }),
                                lowPrice: _(plansForProvider)
                                    .where(function (plan) { return plan.isParentOffer; })
                                    .map(function (plan) { return plan.rates[0].rateAmount; }).min()
                                    .value(),
                                perLine: _(plansForProvider)
                                    .where(function (plan) { return plan.isChildOffer; })
                                    .map(function (plan) { return plan.rates[0].rateAmount; }).min()
                                    .value()
                            }
                        },
                    numberOfPlans: plansForProvider.length
                };
            }).value();
            $scope.providerStats = providerStats;
        }
    });

    $scope.chooseNetwork = function(network, phoneType) {
        analytics.sendVariables(2, network);
        $scope.mobileEnrollment.phoneTypeTab = phoneType;
        mobileEnrollmentService.selectedNetwork = _.where($scope.mobileEnrollmentService.availableNetworks, { value: network })[0];

        enrollmentStepsService.setStep('phoneFlowDevices');
    };

    $scope.lookupZip = function () {
        enrollmentService.isLoading = true;
        analytics.sendVariables(1, $scope.postalCode5);
        $http.get('/api/addresses/lookupZip/' + $scope.postalCode5)
        .success(function (data) {
            enrollmentService.isLoading = false;
            if (data.length != 0) {
                mobileEnrollmentService.state = data[1];
                mobileEnrollmentService.postalCode5 = $scope.postalCode5;

                $scope.data.serviceLocation.address = {
                    line1: 'Line1',
                    city: data[0],
                    stateAbbreviation: data[1], 
                    postalCode5: $scope.postalCode5
                };

                $scope.data.serviceLocation.capabilities = [{ "capabilityType": "ServiceStatus", "enrollmentType": "moveIn" }];
                $scope.data.serviceLocation.capabilities.push({ "capabilityType": "CustomerType", "customerType": (mobileEnrollmentService.planType == 'Business') ? "commercial" : "residential" });
                $scope.data.serviceLocation.capabilities.push({ "capabilityType": "Mobile" });

                $scope.$parent.customerType = (mobileEnrollmentService.planType == 'Business') ? "commercial" : "residential";

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

                // if the state is in the excluded list, show the "no plans available" dialog
                if (_($scope.mobileEnrollmentSettings.excludedStates).contains(data[1])) {
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