/* Enrollment Plan Selection Controller
 *
 * This is used to control aspects of plan selection on enrollment page.
 */
ngApp.controller('EnrollmentPlanSelectionCtrl', ['$scope', 'enrollmentService', 'scrollService', 'enrollmentStepsService', '$modal', 'enrollmentCartService', '$parse', '$window', function ($scope, enrollmentService, scrollService, enrollmentStepsService, $modal, enrollmentCartService, $parse, $window) {
    var hasSubmitted = false;
    $scope.currentLocationInfo = enrollmentCartService.getActiveService;

    $scope.footnotes = {};
    $scope.activeFootnotes = [];
    $scope.footnoteIndices = {};

    //We need this for the button select model in the ng-repeats
    $scope.$watch(function () {
        var temp = enrollmentCartService.getActiveService();
        return temp && temp.location;
    }, function (address) {
        hasSubmitted = false;
        console.log('hasSubmitted = false;', address);
    }, true);
    $scope.$watch(enrollmentCartService.getActiveService, function (address) {
        $scope.planSelection = { selectedOffers: {} };
        $scope.isCartFull = enrollmentCartService.isCartFull($scope.customerType);
        if (address)
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
        } else if (address && address.eligibility == "generalError") {
            $window.location.href = '/enrollment/please-contact';
        }
        if (address && address.offerInformationByType) {
            angular.forEach(address.offerInformationByType, function (entry) {
                if (entry.value && entry.value.offerSelections && entry.value.offerSelections.length) {
                    $scope.planSelection.selectedOffers[entry.key] = entry.value.offerSelections[0].offerId;
                } else if (entry.value && entry.value.availableOffers.length == 1) {
                    $scope.planSelection.selectedOffers[entry.key] = entry.value.availableOffers[0].id;
                }
            });
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

    //Once a plan is selected, check through all available and see if a selection happend
    $scope.$watchCollection('planSelection.selectedOffers', function (selectedOffers) {
        enrollmentStepsService.setMaxStep('utilityFlowPlans');
        if (typeof selectedOffers != 'undefined') {
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
        if($scope.sizeOf($scope.planSelection.selectedOffers) == 00) {
            isValid = false;
        }

        var allNull = true;
        //Then check if any values are null in case of deselection
        angular.forEach($scope.planSelection.selectedOffers, function(value, key) {
            if(value) {
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
        };

        if (!hasSubmitted) {
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
        console.log(param);
        var evalFunc = $parse(param);
        return function (plan) {
            var value = evalFunc($scope, { plan: plan });
            console.log(value);
            return value;
        }
    };
}]);