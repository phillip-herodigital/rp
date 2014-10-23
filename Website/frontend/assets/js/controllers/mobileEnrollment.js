ngApp.controller('MobileEnrollmentCtrl', ['$scope', '$filter', '$modal', 'mobileEnrollmentService', function ($scope, $filter, $modal, mobileEnrollmentService) {

    $scope.mobileEnrollment = {
        currentStep: 'complete-order'
    };

    $scope.mobileFields = {
        state: 'TX'
    };

    $scope.phoneFilters = {
        phoneTypeTab: "new",
        selectedPhone: undefined,
        selectedNetwork: "att",
        condition: undefined,
        brand: [],
        os: [],
        state: 'TX' // Need to set this with MaxMind...
    };

    $scope.phoneOptions = {
        color: undefined,
        size: undefined,
        condition: undefined,
        warranty: undefined,
        number: undefined
    };

    $scope.completeOrder = {
        creditCard: {}
    };

    $scope.setCurrentStep = function(step) {
        $scope.mobileEnrollment.currentStep = step;
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