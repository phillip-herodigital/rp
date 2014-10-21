ngApp.controller('MobileEnrollmentCtrl', ['$scope', '$filter', '$modal', 'mobileEnrollmentService', function ($scope, $filter, $modal, mobileEnrollmentService) {

    var _this = this;

    //Set the data in a service
    this.mobileService = mobileEnrollmentService;
    this.accountInformation = mobileEnrollmentService.accountInformation;

    this.availableNetworks = [];
    this.excludedStates = ['AK', 'HI'];

    this.phoneFilters = {
        phoneTypeTab: "new",
        selectedPhone: undefined,
        selectedNetwork: "att",
        condition: undefined,
        brand: [],
        os: [],
        state: 'TX' // Need to set this with MaxMind...
    };

    this.phoneOptions = {
        color: undefined,
        size: undefined,
        condition: undefined,
        warranty: undefined,
        number: undefined
    };

    this.completeOrder = {
        creditCard: {}
    };

    //Display the extra phone filters
    this.displayFilters = false;

    this.currentStep = 'choose-network';

    /**
     * [updateAvailableNetworks description]
     * @return {[type]} [description]
     */
    this.updateAvailableNetworks = function(state) {
        //Grab the available networks here, for now return the only two we have
        if (_.contains(_this.excludedStates, state)) {
            this.availableNetworks = [];
        } else {
            this.availableNetworks = ['att', 'sprint'];
        }
    };

    /**
     * [chooseNetwork description]
     * @param  {[type]} network   [description]
     * @param  {[type]} phoneType [description]
     * @return {[type]}           [description]
     */
    this.chooseNetwork = function(network, phoneType) {
        this.phoneFilters.selectedNetwork = network;
        this.phoneFilters.phoneTypeTab = phoneType;
        this.currentStep = 'choose-phone';
    };

    this.isAvailableNetwork = function(network) {
        return _.indexOf(this.availableNetworks, network) > -1;
    };

    /** 
     * Set the default options when a new phone is selected
     */
    this.setSelectedPhone = function(id) {
        var item = _.where(this.mobileService.getPhones(), { id: id })[0];

        this.phoneFilters.selectedPhone = item.name;
        this.phoneOptions.color = item.colors[0].color;
        this.phoneOptions.size = item.models[0].size;
    };

    this.isPhoneOptionsValid = function() {
        //check this.phoneOptions
        return _.isNotEmpty(this.phoneOptions);
    };

    /**
     * Clear the phone selection whenever a user navigates
     * to different phone options
     */
    this.clearPhoneSelection = function() {
        this.phoneFilters.selectedPhone = undefined;
        this.phoneOptions = {
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
    this.getSelectedPhone = function() {
        return this.mobileService.getSelectedPhone(this.phoneFilters.selectedPhone);
    };

    /**
     * Adds the currently selected phone to the cart
     */
    this.addPhoneToCart = function() {
        this.mobileService.setSelectedPhone({
            phone: this.phoneFilters.selectedPhone,
            options: this.phoneOptions
        });
        this.currentStep = 'configure-data';
    };

    this.setDataPlan = function() {
        this.currentStep = 'complete-order';
    }

    this.completeOrder = function() {
        this.currentStep = 'order-confirmation';
    }

    /**
     * Change the ordering of the phones
     */
    this.setPhoneOrder = function(value) {

    };

    /**
     *  Controls the checkboxes for the phone brands filter
     */
    this.toggleBrands = function(brand) {
        var idx = this.phoneFilters.brand.indexOf(brand);

        if (idx > -1) {
            this.phoneFilters.brand.splice(idx, 1);
        } else {
            this.phoneFilters.brand.push(brand);
        }
    };

    /**
     * Controls the checkboxes for the phone OS filter
     */
    this.toggleOSs = function(os) {
        var idx = this.phoneFilters.os.indexOf(os);

        if (idx > -1) {
            this.phoneFilters.os.splice(idx, 1);
        } else {
            this.phoneFilters.os.push(os);
        }
    };

    this.showUnlockingModal = function () {
        $modal.open({
            'scope': $scope,
            'templateUrl': 'networkUnlocking/' + this.phoneFilters.selectedNetwork
        })
    };

    $scope.$watch('ctrl.phoneFilters.state', function (newValue, oldValue) {
        _this.updateAvailableNetworks(newValue);
    });

}]);

ngApp.filter('phoneFilter', function() {
  return function(phones, filters) {
    //Filter by brand, OS, Condition
    var filteredElements = phones;
    
    if(filters.brand.length) {
        filteredElements =  _.filter(filteredElements, function(item) {
            return _.contains(filters.brand, item.brand);
        });
    }

    if(filters.os.length) {
        filteredElements =  _.filter(filteredElements, function(item) {
            return _.contains(filters.os, item.os);
        });
    }

    if(filters.condition) {
        filteredElements =  _.filter(filteredElements, function(item) {
            //This makes sure it meets the first condition
            if(_.where(item.models, { condition: filters.condition }).length) {
                //Now we need to only return Refurished phones if New doesn't exist
                if(filters.condition == 'Reconditioned' && !_.where(item.models, { condition: 'New' }).length) {
                    return item;    
                }

                if(filters.condition != 'Reconditioned') {
                    return item;
                }              
            }
        });
    }

    return filteredElements;
  }
});

_.mixin( function() {
    return {
        isNotEmpty: function(value) {
            if (_.isObject(value)) {
                return !_.any( value, function(value, key) {
                    return value === undefined;
                });
            } 
        }
   }
}());