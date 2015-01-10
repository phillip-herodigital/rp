ngApp.controller('MobileEnrollmentChoosePhoneCtrl', ['$scope', '$filter', '$modal', 'mobileEnrollmentService', 'enrollmentStepsService', 'enrollmentCartService', 'scrollService', function ($scope, $filter, $modal, mobileEnrollmentService, enrollmentStepsService, enrollmentCartService, scrollService) {

    $scope.mobileEnrollmentService = mobileEnrollmentService;

    $scope.phoneFilters = {
        condition: undefined,
        brand: [],
        os: [],
        phoneOrder: 'high'
    };

    $scope.selectedPhone = undefined;
    $scope.phoneOptions = {
        color: undefined,
        size: undefined,
        //condition: undefined,
        //warranty: undefined,
        number: undefined
    };

    $scope.phoneNumberType = ''; // set phone number type to new number or transfer existing number
    $scope.displayFilters = false; // Display the extra phone filters

    $scope.setPhoneNumberType = function(type) {
        $scope.phoneNumberType = type;
    };

    $scope.switchCarriers = function() {
        $scope.setCurrentStep('choose-network');
    }

    /** 
     * Set the default options when a new phone is selected
     */
    $scope.setSelectedPhone = function(id) {
        var item = _.where(mobileEnrollmentService.getPhones(), { id: id })[0];

        $scope.selectedPhone = item;
        $scope.phoneOptions.color = mobileEnrollmentService.getPhoneColors(id)[0].color;
        $scope.phoneOptions.size = mobileEnrollmentService.getPhoneSizes(id)[0].size;
        scrollService.scrollTo('chooseDevice', jQuery('header.site-header').height() * -1, 0, angular.noop);
    };

    $scope.phoneOptionsValid = function() {
        //check $scope.phoneOptions
        return (_.isNotEmpty($scope.phoneOptions) && $scope.phoneOptions.purchaseOption);
    };

    /**
     * Clear the phone selection whenever a user navigates
     * to different phone options
     */
    $scope.clearPhoneSelection = function() {
        $scope.selectedPhone = undefined;
        $scope.phoneOptions = {
            color: undefined,
            size: undefined,
            //condition: undefined,
            //warranty: undefined,
            number: undefined,
        };
    };

    /**
     * Adds the currently selected phone to the cart
     */
    $scope.addDeviceToCart = function(phoneType) {

        var item = {},
        device,
        selectedModel;

        if ($scope.mobileEnrollment.phoneTypeTab == "new") { 
            device = $scope.selectedPhone;
            selectedModel = _.where(device.models, { size: $scope.phoneOptions.size, color: $scope.phoneOptions.color, network: $scope.mobileEnrollmentService.selectedNetwork.value })[0];
            item = {
                type: $scope.mobileEnrollment.phoneTypeTab,
                device: device,
                id: selectedModel.sku,
                price: ($scope.phoneOptions.purchaseOption == "New") ? selectedModel.price : mobileEnrollmentService.getInstallmentPrice(device.id),
                salesTax: parseFloat(parseFloat(($scope.phoneOptions.purchaseOption == "New") ? selectedModel.price : selectedModel.lease24, 10) * .07).toFixed(2),
                installmentMonths: ($scope.phoneOptions.purchaseOption == "New") ? null : mobileEnrollmentService.getInstallmentMonths(device.id, $scope.phoneOptions.purchaseOption),
                buyingOption: $scope.phoneOptions.purchaseOption,
                activationFee: $scope.activationFee,
                make: { make: device.brand },
                model: { modelName: device.name },
                size: $scope.phoneOptions.size,
                color: $scope.phoneOptions.color,
                imageFront: device.imageFront,
                warranty: $scope.phoneOptions.warranty,
                phoneNumber: ($scope.phoneOptions.number.type == "new") ? null : $scope.phoneOptions.number.value,
                sku: selectedModel.sku
            };
        }
        else {
            item = {
                id: 7,
                buyingOption: "BYOD",
                type: $scope.mobileEnrollment.phoneTypeTab,
                make: $scope.phoneOptions.make,
                model: $scope.phoneOptions.model,
                activationFee: $scope.activationFee,
                imeiNumber: $scope.phoneOptions.imeiNumber,
                simNumber: $scope.phoneOptions.simNumber,
                phoneNumber: ($scope.phoneOptions.number.type == "new") ? null : $scope.phoneOptions.number.value,
            };
        }

        enrollmentCartService.addDeviceToCart(item);
        if (phoneType) {
            $scope.mobileEnrollment.phoneTypeTab = phoneType; 
            $scope.clearPhoneSelection();
            enrollmentStepsService.scrollToStep('phoneFlowDevices');
        }
    };

    /**
     *  Controls the checkboxes for the phone brands filter
     */
    $scope.toggleBrands = function(brand) {
        var idx = $scope.phoneFilters.brand.indexOf(brand);

        if (idx > -1) {
            $scope.phoneFilters.brand.splice(idx, 1);
        } else {
            $scope.phoneFilters.brand.push(brand);
        }
    };

    /**
     * Controls the checkboxes for the phone OS filter
     */
    $scope.toggleOSs = function(os) {
        var idx = $scope.phoneFilters.os.indexOf(os);

        if (idx > -1) {
            $scope.phoneFilters.os.splice(idx, 1);
        } else {
            $scope.phoneFilters.os.push(os);
        }
    };

    /**
     * Change the ordering of the phones
     */
    $scope.setPhoneOrder = function() {

    };

    $scope.isPhoneOrderReversed = function() {
        return $scope.phoneFilters.phoneOrder == 'high';
    };

    $scope.showUnlockingModal = function () {
        $modal.open({
            'scope': $scope,
            'templateUrl': 'networkUnlocking/' + mobileEnrollmentService.selectedNetwork.value
        })
    };

    $scope.showModal = function (templateUrl) {
        $modal.open({
            'scope': $scope,
            'templateUrl': templateUrl
        })
    };

    $scope.$watch(mobileEnrollmentService.getEditedDevice, function (device) {
        if (device.id != null) {
            if (device.id == '7') {
                $scope.mobileEnrollment.phoneTypeTab = 'existing';
            } else {
                $scope.setSelectedPhone(device.device.id);
            }
        }
    });

    /**
     * Complete the Choose Network Step
     * @return {[type]} [description]
     */
    $scope.completeStep = function () {  
        $scope.addDeviceToCart();
        var activeService = enrollmentCartService.getActiveService();
        var dataPlan = _(activeService.offerInformationByType).where({ key: 'Mobile' }).first();
        
        // reset the dataplan if one is selected
        if (typeof dataPlan != 'undefined' && dataPlan.value.offerSelections.length > 0){
            enrollmentCartService.removeMobileOffers(activeService);
        }
        $scope.clearPhoneSelection();
        enrollmentStepsService.setStep('phoneFlowPlans');
    };

}]);