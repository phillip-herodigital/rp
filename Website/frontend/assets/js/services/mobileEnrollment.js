ngApp.factory('mobileEnrollmentService', ['$rootScope', function ($rootScope) {
    var service = {
        state: "TX",
        selectedNetwork: undefined,
        cart: {
            items: [
                /*{
                    id: undefined,
                    type: undefined, // New or Existing
                    name: undefined,
                    make: undefined,
                    model: undefined,
                    imeiNumber: undefined,
                    simNumber: undefined,
                    warranty: false,
                    color: {
                        name: undefined,
                        value: undefined
                    },
                    //plan: undefined,
                    number: {
                        type: undefined,
                        value: undefined
                    }
                }*/
            ],
            dataPlan: {
                /*price: undefined,
                includedData: {
                    amount: undefined,
                    cost: undefined
                },
                additionalData: {
                    amount: undefined,
                    cost: undefined
                }*/
            }
        },
        accountInformation: {
            contactInfo: {
                name: {
                    first: '',
                    last: ''
                },
                phone: [{
                    number: '',
                    category: ''
                }],
                email: {
                    address: ''
                }
            },
            socialSecurityNumber: '',
            secondaryContactInfo: {}
        }
    },
    dataPlans = [],
    phones = [];
    
    service.setPhoneData = function (data) {
        phones = data;
    };

    service.setDataPlans = function(data) {
        dataPlans = data;
    };

    service.getDataPlans = function(network) {
        if(network) {
            return _.where(dataPlans, { name: network })[0];
        } else {
            return dataPlans;
        }
    }

    service.getPhones = function() {
        return phones;
    };

    service.getItemPrice = function(priceObject) {
        //I'm assuming we always want the new price if it exists
        if(_.where(priceObject, { condition: "New" })) {
            return _.where(priceObject, { condition: "New" })[0].value;
        } else {
            return _.where(priceObject, { condition: "Refurbished" })[0].value;
        }
    };

    service.getPricesForSize = function(id, size) {
        var item = _.where(this.getPhones(), { id: id })[0];
        return _.where(item.models, { size: size });
    };

    service.getConditionPrice = function(id, condition) {
        var item = _.where(this.getPhones(), { id: id })[0];
        var models =  _.where(item.models, { condition: condition });

        //Return the lowest price for the condition
        return _.min(models, function(model){ return model.price; }).price;
    };

    service.getPhoneSizes = function(id) {
        var item = _.where(this.getPhones(), { id: id })[0];
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


    /**
     * Set the cart options
     * @param {[type]} value [description]
     */
    service.getCart = function(phoneName) {
        return service.cart;
    };

    service.getCartItems = function() {
        return service.cart.items;
    }

    service.getCartDataPlan = function() {
        console.log(service.cart.dataPlan);
        return service.cart.dataPlan;
    }

    service.addItemToCart = function(item) {
        service.cart.items.push(item);
    };

    service.addDataPlanToCart = function(plan) {
        service.cart.dataPlan = plan;
    };

    return service;
}]);