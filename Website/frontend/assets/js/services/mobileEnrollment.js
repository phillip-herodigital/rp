ngApp.factory('mobileEnrollmentService', [function () {
    var service = {
        state: 'TX',
        postalCode5: '',
        planType: 'Consumer',
        availableNetworks: [],
        hasLTEDevice: false,
        editedDevice: {},
        selectedNetwork: {
        },
        contactInformation: {
        },
        businessInformation: {
        },
        terms: {
        }
    },
    phones = [];

    service.getRestoreData = function() {
        return {
            state: service.state,
            availableNetworks: service.availableNetworks,
            selectedNetwork: service.selectedNetwork,
            cart: service.cart,
            contactInformation: service.contactInformation,
            businessInformation: service.businessInformation,
            terms: service.terms,
            accountInformation: service.accountInformation,
            phones: phones,
        };
    };
    service.restoreData = function (data) {
        service.state = data.state;
        service.availableNetworks = data.availableNetworks;
        service.selectedNetwork = data.selectedNetwork;
        service.cart = data.cart;
        service.contactInformation = data.contactInformation;
        service.businessInformation = data.businessInformation;
        service.terms = data.terms;
        service.accountInformation = data.accountInformation;
        phones = data.phones;
    };

    service.isLoading = false;

    service.setNetworks = function (data) {
        service.availableNetworks = data;
    };
    
    service.setPhoneData = function (data) {
        phones = data;
    };

    service.getPhoneData = function () {
        return phones;
    };

    service.getPhoneDetails = function (deviceId) {
        return _.filter(phones, { id: deviceId });
    };

    service.getPhones = function() {
        if (typeof service.selectedNetwork != 'undefined') {
            return _.filter(phones, function(phone) { 
                return (
                    _.contains(phone.networks, service.selectedNetwork.id) &&
                    !_(phone.models).pluck('sku').contains('7')
                ); 
            });
        } else {
            return null;
        } 
    };

    service.getEditedDevice = function() {
        return service.editedDevice;
    };

    service.getItemPrice = function(priceObject) {
        //I'm assuming we always want the new price if it exists
        if(_.where(priceObject, { condition: "New" })) {
            return _.where(priceObject, { condition: "New" })[0].value;
        } else {
            return _.where(priceObject, { condition: "Refurbished" })[0].value;
        }
    };

    service.getPricesForPhone = function(id, size, color) {
        var item = _.where(this.getPhones(), { id: id })[0];
        if (typeof item != 'undefined') {
            return _.where(item.models, { size: size, color: color, network: service.selectedNetwork.value });
        } else {
            return null;
        }
    };

    service.getConditionPrice = function(id, condition) {
        var item = _.where(this.getPhones(), { id: id })[0];
        var models = _.where(item.models, { condition: condition, network: service.selectedNetwork.value });

        //Return the lowest price for the condition
        return _.min(models, function(model){ return model.price; }).price;
    };

    service.getInstallmentMonths = function(id, plan) {
        var item = _.where(this.getPhones(), { id: id })[0];
        var model =  _.find(item.models, function(model) {
            return model.installmentPlans[0].aGroupSku == plan;
        });

        if (typeof model != 'undefined' && typeof model.installmentPlans != 'undefined') {
            return model.installmentPlans[0].months;
        } else {
            return null;
        }
    };

    service.getInstallmentPrice = function(id) {
        var item = _.where(this.getPhones(), { id: id })[0];
        if (typeof item.models == 'undefined') {
            return null;
        }
        var models =  _.filter(item.models, 'installmentPlans');

        //Return the lowest lease price
        var plans = _.min(models, function(model){ return model.installmentPlans.length > 0 ? model.installmentPlans[0].price : null; });
        if (typeof plans.installmentPlans != 'undefined') {
            return plans.installmentPlans.length > 0 ? plans.installmentPlans[0].price : null;
        } else {
            return null;
        }
    };

    service.getStock = function(id) {
        var item = _.where(this.getPhones(), { id: id })[0];
        //Return true if any of the models or installment plans are in stock
        var stock = _.filter(item.models, function(model) {
            return (model.inStock ||(model.installmentPlans.length > 0 && model.installmentPlans[0].inStock)) && model.network == service.selectedNetwork.value
        });
        if (stock.length > 0) {
            return true;
        } else {
            return false;
        }
    };

    service.getPhoneSizes = function(id) {
        var item = _.where(this.getPhones(), { id: id })[0];
        if (typeof item != 'undefined') {
            var sizes =  _.uniq(_.where(item.models, { network: service.selectedNetwork.value }), 'size');
            return _.sortBy(sizes, function(size) {
                if (size.size.length < 5) {
                    return '0' + size.size;
                } else {
                    return size.size;
                }
            })
        } else {
            return null;
        }
    };

    service.getPhoneColors = function(id) {
        var item = _.where(this.getPhones(), { id: id })[0];
        if (typeof item != 'undefined') {
            var colors =  _.uniq( _.filter(item.models, function(model) {
                return (model.inStock || (model.installmentPlans.length > 0 && model.installmentPlans[0].inStock)) && model.network == service.selectedNetwork.value
            }), 'color');
            return _.sortBy(colors, function(color) {
                return color.color;
            })
        } else {
            return null;
        }
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