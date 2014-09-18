ngApp.controller('MobileEnrollmentCtrl', ['$scope', '$filter', 'mobileEnrollmentService', function ($scope, $filter, mobileEnrollmentService) {
    //Set the data in a service
    this.mobileService = mobileEnrollmentService;

    //Choose Network Settings
    this.phoneFilters = {
        phoneTypeTab: "new",
        zipCode: "",
        selectedPhone: "",
        selectedNetwork: "att",
        condition: "",
        brand: [],
        os: []
    };

    this.phoneOptions = {
        color: "",
        size: "",
        condition: "",
        warranty: "",
        number: ""
    };

    this.displayFilters = false;

    //Set the default options when a new phone is selected
    this.setSelectedPhone = function(item) {
        this.phoneFilters.selectedPhone = item.name;
        this.phoneOptions.color = item.colors[0].color;
        this.phoneOptions.size = item.models[0].size;
    };
    
    /* Change the ordering of the phones */
    this.setPhoneOrder = function(value) {

    };

    this.clearPhoneSelection = function() {
        this.phoneFilters.selectedPhone = "";
        this.phoneOptions = {
            color: "",
            size: "",
            condition: "",
            warranty: "",
            number: ""
        };
    };

    this.toggleBrands = function(brand) {
        var idx = this.phoneFilters.brand.indexOf(brand);

        if (idx > -1) {
            this.phoneFilters.brand.splice(idx, 1);
        } else {
            this.phoneFilters.brand.push(brand);
        }
    };

     this.toggleOSs = function(os) {
        var idx = this.phoneFilters.os.indexOf(os);

        if (idx > -1) {
            this.phoneFilters.os.splice(idx, 1);
        } else {
            this.phoneFilters.os.push(os);
        }
    };

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

    return filteredElements;
  }
});