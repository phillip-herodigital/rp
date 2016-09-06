ngApp.controller('EnrollmentConfirmationCtrl', ['$scope', '$window', 'enrollmentService', 'enrollmentStepsService', 'enrollmentCartService', 'mobileEnrollmentService', 'analytics', '$timeout', function ($scope, $window, enrollmentService, enrollmentStepsService, enrollmentCartService, mobileEnrollmentService, analytics, $timeout) {
    $scope.accountInformation = {};
    var confirmationDevices = [];
    var allPhones = [];
    var selectedDevices = [];

    $scope.mobileEnrollmentService = mobileEnrollmentService;
    $scope.getCartItems = enrollmentCartService.getCartItems;  
    $scope.getCartMonthly = enrollmentCartService.calculateMobileMonthlyTotal;
    $scope.customerType = '';
    $scope.confirmationSuccess = false;
    $scope.cartHasTxLocation = enrollmentCartService.cartHasTxLocation;
    $scope.cartHasUtility = enrollmentCartService.cartHasUtility;
    $scope.cartHasMobile = enrollmentCartService.cartHasMobile;  
    $scope.getCartDataPlan = enrollmentCartService.getCartDataPlan;
    $scope.getProratedCost = enrollmentCartService.getProratedCost;
    $scope.getOfferData = enrollmentCartService.getOfferData;
    $scope.getOfferPrice = enrollmentCartService.getOfferPrice;
    $scope.getDeviceTax = enrollmentCartService.getDeviceTax;
    $scope.getDeviceActivationFee = enrollmentCartService.getDeviceActivationFee;
    $scope.getDeviceDeposit = enrollmentCartService.getDeviceDeposit;
    $scope.isDeviceInstallmentPlan = enrollmentCartService.isDeviceInstallmentPlan;

    $scope.onPrint = function() {
        window.print();
    };

    $scope.totalAutoPaySavings = function () {
        return $scope.autoPayDiscount * $scope.getCartItems().length;
    }

    $scope.$watch(mobileEnrollmentService.getPhoneData, function (phoneData) {
        allPhones = phoneData;
        confirmationDevices = enrollmentCartService.getConfirmationDevices();
        confirmationTransfers = enrollmentCartService.getConfirmationTransfers();
        selectedDevices = _(confirmationDevices).map(function(device) { 
            var selected = _(allPhones).find(function(phone) { 
                if ( _(phone.models).pluck('sku').flatten().filter().contains(device) ) { 
                    return phone;
                } 
            }); 
            var model = (device == '7') ? null : _(selected.models).where({'sku': device}).first(); 
            return { 
                'id': device,
                'device':  (device == '7') ? null : selected, 
                'imageFront': (device == '7') ? null : selected.imageFront, 
                'size': (device == '7') ? null : model.size, 
                'color': (device == '7') ? null : model.color,
                'type': (device == '7') ? 'existing' : 'new' 
            } 
        }).value();
        $scope.sprintByod = $scope.getCartDataPlan()[0].provider == 'Sprint' && _.some(selectedDevices, { 'id': '7' });
        $scope.sprintByodNew = $scope.sprintByod && _(confirmationTransfers).contains(undefined);
        $scope.sprintByodTransfer = $scope.sprintByod && _(confirmationTransfers).flatten().filter().some('phoneNumber');
    });

    $scope.getConfirmationDeviceDetails = function(deviceId) {
        return _.find(selectedDevices, { id: deviceId });
    }

    $scope.getCartTotal = function () {
        if ($scope.autopay) {
            return enrollmentCartService.calculateConfirmationTotal() - $scope.totalAutoPaySavings();
        }
        else {
            return enrollmentCartService.calculateConfirmationTotal();
        }
    }

    /**
     * Get the server data and populate the form
     */
    $scope.setServerData = function (result) {
        if (result == 'deferred') {
            $window.deferred = function (data) {
                $scope.$apply(function () { $scope.setServerData(data); })
            };
        }
        else {
            // get the result, which should include the expected state
            enrollmentService.setClientData(result);

            // set step to make sure we're supposed to be here
            enrollmentStepsService.setFromServerStep(result.expectedState, true);

            $scope.isRenewal = enrollmentService.isRenewal;

            // copy out the account information the server has
            $scope.accountInformation.contactInfo = result.contactInfo || {};
            var userName = result.newAccountUserName;
            if (userName != "") {
                var slashPosition = userName.indexOf("\\");
                userName = userName.substring(slashPosition + 1);
            }
            $scope.accountInformation.userName = userName;
            $scope.accountInformation.secondaryContactInfo = result.secondaryContactInfo || {};
            $scope.accountInformation.mailingAddress = result.mailingAddress || {};
            $scope.autopay = result.enrolledInAutoPay;
            $scope.autoPayDiscount = result.autoPayDiscount;
            $scope.isAddLine = enrollmentService.isAddLine;
            $scope.addLineSubAccounts = enrollmentService.addLineSubAccounts;

            // set the customer type, since we're no longer using the enrollment main controller
            $scope.customerType = $scope.getCartItems()[0].location.capabilities[2].customerType;

            // find out if we got a successful confirmation
            $scope.confirmationSuccess = $scope.getCartItems()[0].offerInformationByType[0].value.offerSelections[0].confirmationSuccess;
            $scope.confirmationNumber = $scope.getCartItems()[0].offerInformationByType[0].value.offerSelections[0].confirmationNumber;

            // if it's a commercial enrollment, and we don't get a success message, redirect to the error page
            if ($scope.customerType == 'commercial' && !$scope.confirmationSuccess) {
                $window.location.href = '/enrollment/please-contact';
            }

            $timeout(function () {
                analytics.sendVariables(11, $scope.confirmationSuccess ? "Confirmed" : "Submitted");
                analytics.sendTags({
                    EnrollmentFinalized: $scope.confirmationSuccess ? "Confirmed" : "Submitted",
                    EnrollmentProductTypeEnrolled: $scope.cartHasUtility() ? $scope.cartHasTxLocation() ? "TexasElectricity": "GeorgiaGas" : "Mobile"
                });
                _(enrollmentCartService.services).map(function (l) {
                    return l.offerInformationByType[0].key
                }).uniq().each(function (t) {
                    analytics.sendVariables(12, t);
                });
            }, 5000);
        }
    };
}]);