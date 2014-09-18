ngApp.factory('mobileEnrollmentService', ['$rootScope', function ($rootScope) {
    var service = {},
        mobileNetworks = [],
        phones = [];

    service.setNetworkData = function (data) {
        mobileNetworks = data;
    };

    service.setPhoneData = function (data) {
        phones = data;
    };

    service.getPhones = function() {
        return phones;
    }

    service.getNetworks = function() {
        return mobileNetworks;
    }

    service.getItemPrice = function(priceObject) {
        //I'm assuming we always want the new price if it exists
        if(_.where(priceObject, { condition: "New" })) {
            return _.where(priceObject, { condition: "New" })[0].value;
        } else {
            return _.where(priceObject, { condition: "Refurbished" })[0].value;
        }
    };

    service.getPricesForSize = function(item, size) {
        return _.where(item.models, { size: size });
    };

    service.getConditionPrice = function(item, condition) {
        var models =  _.where(item.models, { condition: condition });

        //Return the lowest price for the condition
        return _.min(models, function(model){ return model.price; }).price;
    };

    service.getPhoneSizes = function(item) {
        var sizes =  _.uniq(_.pluck(item.models, 'size'));
        return _.sortBy(sizes, function(size) {
            return size;
        })
    };

    service.getItemConditions = function(priceObject) {
        return _.pluck(priceObject, 'condition');
    };

    service.getBrands = function() {
        return _.uniq(_.pluck(phones, "brand"));
    };

    service.getOSs = function() {
        return _.uniq(_.pluck(phones, "os"));
    };

    return service;
}]);