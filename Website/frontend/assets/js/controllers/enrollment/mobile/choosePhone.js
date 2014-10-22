ngApp.controller('MobileEnrollmentChoosePhoneCtrl', ['$scope', '$filter', '$modal', 'mobileEnrollmentService', function ($scope, $filter, $modal, mobileEnrollmentService) {

    $scope.phoneNumberType = ''; // set phone number type to new number or transfer existing number
    $scope.displayFilters = false; // Display the extra phone filters

    $scope.setPhoneNumberType = function(type) {
        $scope.phoneNumberType = type;
    };

    /** 
     * Set the default options when a new phone is selected
     */
    $scope.setSelectedPhone = function(id) {
        var item = _.where(mobileEnrollmentService.getPhones(), { id: id })[0];

        $scope.phoneFilters.selectedPhone = item.name;
        $scope.phoneOptions.color = item.colors[0].color;
        $scope.phoneOptions.size = item.models[0].size;
    };

    $scope.isPhoneOptionsValid = function() {
        //check $scope.phoneOptions
        return _.isNotEmpty($scope.phoneOptions);
    };

    /**
     * Clear the phone selection whenever a user navigates
     * to different phone options
     */
    $scope.clearPhoneSelection = function() {
        $scope.phoneFilters.selectedPhone = undefined;
        $scope.phoneOptions = {
            color: undefined,
            size: undefined,
            condition: undefined,
            warranty: undefined,
            number: undefined
        };
    };

    /**
     * Get the currently selected phone details
     */
    $scope.getSelectedPhone = function() {
        return mobileEnrollmentService.getSelectedPhone($scope.phoneFilters.selectedPhone);
    };

    /**
     * Adds the currently selected phone to the cart
     */
    $scope.addPhoneToCart = function() {
        mobileEnrollmentService.setSelectedPhone({
            phone: $scope.phoneFilters.selectedPhone,
            options: $scope.phoneOptions
        });
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
            'templateUrl': 'networkUnlocking/' + $scope.phoneFilters.selectedNetwork
        })
    };

}]);