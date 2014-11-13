ngApp.controller('MobileEnrollmentChoosePhoneCtrl', ['$scope', '$filter', '$modal', 'mobileEnrollmentService', function ($scope, $filter, $modal, mobileEnrollmentService) {

    $scope.mobileEnrollmentService = mobileEnrollmentService;

    $scope.phoneFilters = {
        condition: undefined,
        brand: [],
        os: []
    };

    $scope.selectedPhone = undefined;
    $scope.phoneOptions = {
        color: undefined,
        size: undefined,
        condition: undefined,
        warranty: undefined,
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
        $scope.phoneOptions.color = item.colors[0].color;
        $scope.phoneOptions.size = item.models[0].size;
    };

    $scope.phoneOptionsValid = function() {
        //check $scope.phoneOptions
        return _.isNotEmpty($scope.phoneOptions);
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
            condition: undefined,
            warranty: undefined,
            number: undefined
        };
    };

    /**
     * Adds the currently selected phone to the cart
     */
    $scope.addDeviceToCart = function() {

        var item = {},
        device;

        if ($scope.mobileEnrollment.phoneTypeTab == "new") { 
            device = $scope.selectedPhone;
            item = {
                type: $scope.mobileEnrollment.phoneTypeTab,
                device: device,
                id: device.id,
                price: _.where(device.models, { size: $scope.phoneOptions.size, condition: $scope.phoneOptions.condition })[0].price,
                buyingOption: _.where(device.models, { size: $scope.phoneOptions.size, condition: $scope.phoneOptions.condition })[0],
                color: _.where(device.colors, { color: $scope.phoneOptions.color})[0],
                warranty: $scope.phoneOptions.warranty
            };
        }
        else {
            item = {
                type: $scope.mobileEnrollment.phoneTypeTab,
                make: $scope.phoneOptions.make,
                model: $scope.phoneOptions.model,
                activationFee: $scope.activationFee,
                imeiNumber: $scope.phoneOptions.imeiNumber,
                simNumber: $scope.phoneOptions.simNumber,
                number: $scope.phoneOptions.number
            };
        }

        mobileEnrollmentService.addItemToCart(item);
        $scope.setCurrentStep('configure-data');
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
    $scope.setPhoneOrder = function(value) {

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

}]);