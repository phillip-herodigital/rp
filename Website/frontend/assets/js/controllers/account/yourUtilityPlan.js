/* Your Gas Plan Controller
 *
 */
ngApp.controller('AcctYourUtilityPlanCtrl', ['$scope', '$rootScope', '$http', '$window', '$location', 'enrollmentService', 'enrollmentCartService', 'enrollmentStepsService', 'scrollService', 'analytics', '$parse', '$window', function ($scope, $rootScope, $http, $window, $location, enrollmentService, enrollmentCartService, enrollmentStepsService, scrollService, analytics, $parse, $window) {
    $scope.utilityPlan = {};
    $scope.isLoading = true;
    $scope.streamConnectError = false;
    $scope.showPlanSelector = false;
    $scope.renewalRedirect = ($location.absUrl().toLowerCase().indexOf('renew') > 0);

    var hasSubmitted = false;

    $scope.footnotes = {};
    $scope.activeFootnotes = [];
    $scope.footnoteIndices = {};

    $scope.filterTexasPlans = function(plan) {
        return !plan.isDisabled;
    };

    $scope.getAssociatedPlan = function (plan) {
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

    $http.get('/api/account/getAccounts').success(function (data, status, headers, config) {
        $scope.accounts = _.filter(data, function (acct) {
            return !$scope.filterAccountType || acct.accountType.toLowerCase() == $scope.filterAccountType.toLowerCase();
        });

        if ($scope.accounts.length == 0) {
            $scope.updateSelectedAccount(false, false, false);
        } else if ($scope.accounts.length == 2) {
            // if 2 accounts, check if either is eligible to renew, and if so, default to that account
            $scope.isLoading = true;
            $http({
                method: 'POST',
                url: '/api/account/getUtilityPlan',
                data: { 'accountNumber': $scope.accounts[1].accountNumber },
                headers: { 'Content-Type': 'application/JSON' }
            }).success(function (data, status, headers, config) {
                $scope.accountId = data.accountId;
                $scope.utilityPlan = data.subAccounts[0];
                $scope.utilityPlans = data.subAccounts;
                $scope.utilityPlansCount = data.subAccounts.length;
                // get the plan description from sitecore if it exists
                if (typeof $scope.utilityPlan != 'undefined') {
                    var product = _.find($scope.georgiaProducts, { 'code': $scope.utilityPlan.productCode });
                    $scope.utilityPlan.description = (product) ? product.description : null;
                }
                $scope.renewal = data.hasRenewalEligibiltiy;
                $scope.streamConnectError = false;
                if ($scope.renewal) {
                    $scope.setupRenewal($scope.utilityPlan.id);
                    $scope.currentAccount = $scope.accounts[1];
                } else {
                    $scope.isLoading = false;
                    $scope.currentAccount = $scope.accounts[0];
                }
                $scope.accountsCount = $scope.accounts.length;
                $scope.updateSelectedAccount($scope.currentAccount.accountNumber, $scope.currentAccount.subAccountLabel, $scope.currentSubAccount);
            }).error(function () {
                $scope.isLoading = false;
                $scope.streamConnectError = true;
            });
        } else {
            $scope.accountsCount = $scope.accounts.length;
            $scope.currentAccount = $scope.accounts[0];
            $scope.updateSelectedAccount($scope.currentAccount.accountNumber, $scope.currentAccount.subAccountLabel, $scope.currentSubAccount);
        }
        $scope.isLoading = false;
        $scope.streamConnectError = false;

    }).error(function () { 
        $scope.isLoading = false;
        $scope.streamConnectError = true; 
    });

    $scope.updateSelectedAccount = function(accountNumber, subAccountLabel, subaccount) {
        $scope.selectedAccount.accountNumber = accountNumber;
        $scope.selectedAccount.subAccountLabel = subAccountLabel;
        $scope.selectedAccount.subaccount = subaccount;
    };

    // when the account selector changes, reload the data
    $scope.$watch('selectedAccount.accountNumber', function (newVal) {
        if (newVal && !$scope.isLoading) {
            $scope.isLoading = true;
            $scope.hideCurrentRatePrice = false;
            $http({
                method: 'POST',
                url: '/api/account/getUtilityPlan',
                data: { 'accountNumber': newVal },
                headers: { 'Content-Type': 'application/JSON' }
            }).success(function (data, status, headers, config) {
                $scope.accountId = data.accountId;
                $scope.utilityPlan = data.subAccounts[0];
                $scope.utilityPlans = data.subAccounts;
                $scope.utilityPlansCount = data.subAccounts.length;
                // get the plan description from sitecore if it exists
                if (typeof $scope.utilityPlan != 'undefined') {
                    var product = _.find($scope.georgiaProducts, { 'code': $scope.utilityPlan.productCode });
                    $scope.utilityPlan.description = (product) ? product.description : null;
                }
                $scope.renewal = data.hasRenewalEligibiltiy;
                $scope.streamConnectError = false;
                if ($scope.renewal) {
                    $scope.setupRenewal($scope.utilityPlan.id);
                } else {
                    $scope.isLoading = false;
                }
            }).error(function () {
                $scope.isLoading = false;
                $scope.streamConnectError = true;
            });
        }
    });

    $scope.isEligible = function (utilityPlanId) {
        var subAccount = _.find($scope.utilityPlans, { 'id': utilityPlanId });
        return _.find(subAccount.capabilities, { 'capabilityType': 'Renewal' }).isEligible;
    };

    $scope.setupRenewal = function (utilityPlanId) {
        $scope.isLoading = true;
        var accountData = {
            accountId: $scope.accountId,
            subAccountId: utilityPlanId
        };
        $http.post('/api/account/setupRenewal', accountData)
        .success(function (data) {
            if (data.isRenewal) {
                $scope.showPlanSelector = true;
                enrollmentService.setClientData(data);

                var allisMore = true;
                for (var i = 0; i < data.cart.length;i++){
                    var c = data.cart[i];

                    for (var j = 0; j < c.offerInformationByType.length; j++) {
                        var t = c.offerInformationByType[j].value;

                        var offers = t.availableOffers;

                        for (var k = 0; k < offers.length; k++) {
                            var rate = offers[k].rate;
                            if (rate <= ($scope.utilityPlan.rate * 100))
                            {
                                allisMore = false;
                                break;
                            }
                        }

                        if (!allisMore) break;
                    }

                    if (!allisMore) break;
                }

                $scope.hideCurrentRatePrice = allisMore;

                $scope.isLoading = false;
            } else {
                // the account is no longer eligible, or something else went wrong
                $scope.isLoading = false;
            }
        })
        .error(function () {
            $scope.isLoading = false;
            $scope.streamConnectError = true;
        });
    };

    //We need this for the button select model in the ng-repeats
    $scope.$watch(function () {
        $scope.currentLocationInfo = enrollmentCartService.getActiveService;
        $scope.isRenewal = enrollmentService.isRenewal;
        var temp = enrollmentCartService.getActiveService();
        return temp && temp.location;
    }, function (address) {
        hasSubmitted = false;
    }, true);

    $scope.$watch(enrollmentCartService.getActiveService, function (address) {
        $scope.planSelection = { selectedOffers: {} };
        $scope.isCartFull = enrollmentCartService.isCartFull($scope.customerType);
        if (address && address.location.address.stateAbbreviation == "TX" && !$scope.isRenewal && _(address.location.capabilities).filter({ capabilityType: "TexasElectricity" }).size() != 0) {
            $scope.provider = _(address.location.capabilities).filter({ capabilityType: "TexasElectricity" }).first().tdu;
        }
        if (address && address.offerInformationByType) {
            angular.forEach(address.offerInformationByType, function (entry) {
                if (entry.value && !_(entry.key).contains('Mobile') && entry.value.offerSelections && entry.value.offerSelections.length) {
                    $scope.planSelection.selectedOffers[entry.key] = entry.value.offerSelections[0].offerId;
                } else if (entry.value && !_(entry.key).contains('Mobile') && entry.value.availableOffers.length == 1) {
                    $scope.planSelection.selectedOffers[entry.key] = entry.value.availableOffers[0].id;
                }
            });
        }

        updateFootnotes();
    });

    $scope.$watch('footnotes', function () {
        updateFootnotes();
    }, true);

    function updateFootnotes() {
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

            for (var i = 0; i < address.offerInformationByType.length; i++) {
                $scope.footnoteIndices[address.offerInformationByType[i].key] = {};
            }
            for (var i = 0; i < footnoteParts.length; i++) {
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
        var isValid = true;

        //Simple check on length first
        if ($scope.planSelection.selectedOffers.length == 00) {
            isValid = false;
        }

        var allNull = true;
        //Then check if any values are null in case of deselection
        angular.forEach($scope.planSelection.selectedOffers, function (value, key) {
            if (value) {
                allNull = false;
            }
        });
        isValid = isValid && !allNull;

        return isValid;
    };

    /**
     * Complete plan selections page
     * @param  {Boolean} Add an additional service address
     */
    $scope.completeStep = function (addAdditional) {
        $scope.isLoading = true;
        submitStep(addAdditional);

        var planId = ($scope.planSelection.selectedOffers.TexasElectricity || $scope.planSelection.selectedOffers.GeorgiaGas);

        var i = _.findIndex($scope.currentLocationInfo().offerInformationByType[0].value.availableOffers, function (o) {
            return (o.id == planId);
        }),
        plan = $scope.currentLocationInfo().offerInformationByType[0].value.availableOffers[i];

        analytics.sendVariables(6, plan.rateType == "fixed" ? "Fixed" : "Variable", 7, plan.termMonths, 8, (i + 1), 9, plan.id);
        analytics.sendTags({
            EnrollmentPlanType: plan.rateType == "fixed" ? "Fixed" : "Variable",
            EnrollmentPlanTerm: plan.termMonths,
            EnrollmentPlanIndex: (i + 1),
            EnrollmentPlanID: plan.id
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
            $window.location = '/enrollment?renewal=true';
        };

        if (!hasSubmitted || !addAdditional) {
            var selectedOffersPromise = enrollmentService.setSelectedOffers(addAdditional);

            selectedOffersPromise.then(onComplete, function (data) {
                // error response
            });
        } else {
            onComplete();
        }
    };

    $scope.sortBy = function (param, reverse) {
        if (param == undefined) {
            return function (plan) { return 0; };
        }
        var evalFunc = $parse(param);
        return function (plan) {
            var value = evalFunc($scope, { plan: plan });
            return value;
        }
    };
}]);