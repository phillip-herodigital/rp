/* Enrollment Plan Selection Controller
 *
 * This is used to control aspects of plan selection on enrollment page.
 */
ngApp.controller('EnrollmentPlanSelectionCtrl', ['$scope', 'enrollmentService', 'scrollService', 'enrollmentStepsService', '$modal', 'enrollmentCartService', '$parse', '$window', 'analytics', function ($scope, enrollmentService, scrollService, enrollmentStepsService, $modal, enrollmentCartService, $parse, $window, analytics) {
    var hasSubmitted = false;
    $scope.currentLocationInfo = enrollmentCartService.getActiveService;
    $scope.isRenewal = enrollmentService.isRenewal;

    $scope.footnotes = {};
    $scope.activeFootnotes = [];
    $scope.footnoteIndices = {};

    $scope.filterTexasPlans = function(plan) {
        return !plan.isDisabled;
    };

    $scope.filterNEPlans = function(plan) {
        if (enrollmentService.renewalProviderID != null) {
            var providerID = JSON.parse(plan.provider).Id;
            return providerID == enrollmentService.renewalProviderID;
        }
        return plan;
    };

    $scope.getAssociatedPlan = function(plan) {
        return _.find($scope.currentLocationInfo().offerInformationByType[0].value.availableOffers, function (availableOffer) {
            if (plan.tdu) {
                return availableOffer.associatedPlanID === plan.id.replace(plan.tdu + "/", "");
            }
            return availableOffer.associatedPlanID === plan.code;
        });
    }

    $scope.selectAssociatedOffer = function (plan, associatedPlan) {
        plan.hidePlan = true;
        associatedPlan.hidePlan = false;
        var planIndex = _.findIndex($scope.currentLocationInfo().offerInformationByType[0].value.availableOffers, function (availableOffer) {
            return availableOffer.id === plan.id;
        });
        var associatedPlanIndex = _.findIndex($scope.currentLocationInfo().offerInformationByType[0].value.availableOffers, function (availableOffer) {
            return availableOffer.id === associatedPlan.id;
        });
        $scope.currentLocationInfo().offerInformationByType[0].value.availableOffers[planIndex] = associatedPlan;
        $scope.currentLocationInfo().offerInformationByType[0].value.availableOffers[associatedPlanIndex] = plan;
    }

    //We need this for the button select model in the ng-repeats
    $scope.$watch(function () {
        var temp = enrollmentCartService.getActiveService();
        return temp && temp.location;
    }, function (address) {
        hasSubmitted = false;
    }, true);
    $scope.$watch(enrollmentCartService.getActiveService, function (address) {
        $scope.planSelection = { selectedOffers: {} };
        $scope.isCartFull = enrollmentCartService.isCartFull($scope.customerType);
        if (address && address.location.address.stateAbbreviation == "TX" && !$scope.isRenewal && _(address.location.capabilities).filter({ capabilityType: "TexasElectricity" }).size() != 0)
        {
            $scope.provider = _(address.location.capabilities).filter({ capabilityType: "TexasElectricity" }).first().tdu;
        }
        if (address && address.eligibility == "mustMoveIn") {
            $modal.open({
                'scope': $scope,
                'templateUrl': 'mustMoveInModal'
            }).result.then(function () { 
                address.location.capabilities[1].enrollmentType = 'moveIn';
                enrollmentService.setSelectedOffers();
            })
        } else if (address && address.eligibility == "alreadyInEnetrak") {
            $modal.open({
                'scope': $scope,
                'templateUrl': 'alreadyInEnetrakModal'
            }).result.then(function () { 
                enrollmentCartService.removeService(address);
                enrollmentStepsService.setFromServerStep('serviceInformation');
            })
        } else if (address && address.eligibility == "generalError") {
            $window.location.href = '/enrollment/please-contact';
        }
        if (address && address.offerInformationByType) {
            angular.forEach(address.offerInformationByType, function (entry) {
                if (entry.value && !_(entry.key).contains('Mobile') && entry.value.offerSelections && entry.value.offerSelections.length) {
                    $scope.planSelection.selectedOffers[entry.key] = entry.value.offerSelections[0].offerId;
                } else if (entry.value && !_(entry.key).contains('Mobile') && entry.value.availableOffers.length == 1 && address.offerInformationByType.length === 1) {
                    $scope.planSelection.selectedOffers[entry.key] = entry.value.availableOffers[0].id;
                }
            });
            if ($scope.utilityEnrollment.requestedPlanId != '') {
                var i = _.findIndex($scope.currentLocationInfo().offerInformationByType[0].value.availableOffers, function (o) {
                    return _(o.id).contains($scope.utilityEnrollment.requestedPlanId);
                }),
                plan = $scope.currentLocationInfo().offerInformationByType[0].value.availableOffers[i],
                key = $scope.currentLocationInfo().offerInformationByType[0].key;
                if (typeof plan != 'undefined') {
                    $scope.planSelection.selectedOffers[key] = plan.id;
                    $scope.currentLocationInfo().offerInformationByType[0].sortBy = function (plan) {
                        if (plan) {
                            return plan.id.indexOf($scope.utilityEnrollment.requestedPlanId) == -1;
                        }
                    };
                }
            }
        }
        updateFootnotes();
    });

    $scope.$watch('footnotes', function () {
        updateFootnotes();
    }, true);

    function updateFootnotes()
    {
        var address = enrollmentCartService.getActiveService();
        if (address && address.offerInformationByType) {
            var footnoteParts = _(address.offerInformationByType)
                .pluck('key')
                .map(function (item) { return _.map($scope.footnotes[item], function (entry) { entry.type = item; return entry; }); })
                .flatten()
                .filter(function (obj) { return obj.value; })
                .value();
            $scope.activeFootnotes = footnoteParts;
            $scope.footnoteIndices = {};

            for (var i = 0; i < address.offerInformationByType.length; i++)
            {
                $scope.footnoteIndices[address.offerInformationByType[i].key] = {};
            }
            for (var i = 0; i < footnoteParts.length; i++)
            {
                $scope.footnoteIndices[footnoteParts[i].type][footnoteParts[i].key] = i + 1;
            }
        }
    }

    $scope.calculateFootnotes = function calculateFootnotes(footnotes) {
        var result = {};
        result.active = footnotes;
        result.indices = {};

        for (var i = 0; i < footnotes.length; i++) {
            result.indices[footnotes[i].key] = $scope.footnoteDisplay[i];
        }

        return result;
    }

    $scope.footnoteDisplay = ['*', '†', '‡'];

    //Once a non-mobile plan is selected, check through all available and see if a selection happend
    $scope.$watchCollection('planSelection.selectedOffers', function (selectedOffers) {
        enrollmentStepsService.setMaxStep('utilityFlowPlans');
        if (typeof selectedOffers != 'undefined' && typeof selectedOffers.Mobile == 'undefined') {
            // Map the offers to arrays because, although utilities (which this controller is for) does not allow multiple offers of a type, the cart service does.
            enrollmentCartService.selectOffers(_(selectedOffers).mapValues(function (offer) { if (offer) { return [offer]; } else return []; }).value());
        }
    });

    $scope.deleteUtilityAddress = function (service) {
        enrollmentCartService.removeService(service);
        enrollmentStepsService.setFlow('utility', false).setStep('utilityFlowService');
    };

    /**
     * [isFormValid description]
     * @return {Boolean} [description]
     */
    $scope.isFormValid = function () {
        return $scope.sizeOf($scope.planSelection.selectedOffers) != 00 && _.some($scope.planSelection.selectedOffers, function (value) {
            return value != null;
        });
    };

    /**
     * Complete plan selections page
     * @param  {Boolean} Add an additional service address
     */
    $scope.completeStep = function (addAdditional) {
        if (!enrollmentCartService.getActiveService().location.address.line1) {
            $modal.open({
                'scope': $scope,
                'controller': 'EnrollmentZipToAddressCtrl as modal',
                'templateUrl': 'enrollmentZipToAddressPicker'
            }).result.then(function () { submitStep(addAdditional); })
        }
        else {
            submitStep(addAdditional);
        }

        var planId = ($scope.planSelection.selectedOffers.TexasElectricity ||
                      $scope.planSelection.selectedOffers.GeorgiaGas ||
                      $scope.planSelection.selectedOffers.NewJerseyElectricity ||
                      $scope.planSelection.selectedOffers.NewJerseyGas ||
                      $scope.planSelection.selectedOffers.PennsylvaniaGas ||
                      $scope.planSelection.selectedOffers.PennsylvaniaElectricity ||
                      $scope.planSelection.selectedOffers.MarylandGas ||
                      $scope.planSelection.selectedOffers.MarylandElectricity ||
                      $scope.planSelection.selectedOffers.DCElectricity ||
                      $scope.planSelection.selectedOffers.NewYorkElectricity ||
                      $scope.planSelection.selectedOffers.NewYorkGas);

        var i = _.findIndex($scope.currentLocationInfo().offerInformationByType[0].value.availableOffers, function (o) {
            return (o.id == planId);
        }),
        plan = $scope.currentLocationInfo().offerInformationByType[0].value.availableOffers[i];

        analytics.sendVariables(6, plan.rateType == "fixed" ? "Fixed" : "Variable", 7, plan.termMonths, 8, (i+1), 9, plan.id);
        analytics.sendTags({
            EnrollmentPlanType: $scope.isRenewal ? "Renewal" : plan.rateType == "fixed" ? "Fixed" : "Variable",
            EnrollmentPlanTerm: plan.termMonths,
            EnrollmentPlanIndex: $scope.currentLocationInfo().offerInformationByType[0].value.availableOffers.length - i, //the plans are reversed when displayed
            EnrollmentPlanID: plan.id,
            EnrollmentProductTypeInCart: plan.offerType
        });
    };
    var submitStep = function (addAdditional) {
        var onComplete = function () {
            hasSubmitted = true;

            //Move to the next section, this is the last of the utilityAccounts, so
            //If addAdditional, go back to step one else move to the next section
            if (addAdditional) {
                enrollmentCartService.setActiveService();
                enrollmentStepsService.setFlow('utility', true).setFromServerStep('serviceInformation');
            }
            else {
                angular.forEach(enrollmentCartService.services, function (service, index) {
                    if (service.location.address.line1.indexOf("line1") != -1) {
                        enrollmentCartService.services[index].location.address.line1 = "";
                        enrollmentCartService.services[index].location.address.city = "";
                    }
                });
            }
        };

        if (!hasSubmitted || !addAdditional) {
            if (!addAdditional) analytics.sendTags({
                EnrollmentNumberOfEndpoints: enrollmentCartService.getServiceCount()
            });
            var activeService = enrollmentCartService.getActiveService();
            if (activeService.offerInformationByType.length > 1) {
                angular.forEach(activeService.offerInformationByType, function (offerInfoByType) {
                    if (offerInfoByType.value.offerSelections.length === 0) {
                        _.remove(activeService.location.capabilities, function (capability) {
                            return capability.capabilityType === offerInfoByType.key;
                        });
                    }
                });
                _.remove(activeService.offerInformationByType, function (offerInfoByType) {
                    return offerInfoByType.value.offerSelections.length === 0;
                });
            }
            var selectedOffersPromise = enrollmentService.setSelectedOffers(addAdditional);
            selectedOffersPromise.then(onComplete, function (data) {
                // error response
            });
        } else {
            onComplete();
        }
    };

    $scope.sortBy = function (param, reverse) {
        if (param == undefined)
        {
            return function (plan) { return 0; };
        }
        var evalFunc = $parse(param);
        return function (plan) {
            var value = evalFunc($scope, { plan: plan });
            return value;
        }
    };
}]);