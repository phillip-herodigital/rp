ngApp.factory('mobileEnrollmentService', ['$rootScope', '$window', function ($rootScope, $window) {
    var service = {
        state: 'TX',
        availableNetworks: [],
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
        contactInformation: {

        },
        businessInformation: {

        },
        terms: {

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
    //networks = [],
    dataPlans = [],
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
            dataPlans: dataPlans,
            phones: phones,
        };
    };
    service.restoreData = function(data) {
        service.state = data.state;
        service.availableNetworks = data.availableNetworks;
        service.selectedNetwork = data.selectedNetwork;
        service.cart = data.cart;
        service.contactInformation = data.contactInformation;
        service.businessInformation = data.businessInformation;
        service.terms = data.terms;
        service.accountInformation = data.accountInformation;
        dataPlans = data.dataPlans;
        phones = data.phones;
    };

    service.isLoading = false;

    service.setNetworks = function (data) {
        service.availableNetworks = data;
    };
    
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
        if (typeof service.selectedNetwork != 'undefined') {
            return _.filter(phones, function(phone) { return _.contains(phone.networks, service.selectedNetwork.id); });
        } else {
            return null;
        } 
    };

    service.getItemPrice = function(priceObject) {
        //I'm assuming we always want the new price if it exists
        if(_.where(priceObject, { condition: "New" })) {
            return _.where(priceObject, { condition: "New" })[0].value;
        } else {
            return _.where(priceObject, { condition: "Refurbished" })[0].value;
        }
    };

    service.getPricesForSize = function(id, size, color) {
        var item = _.where(this.getPhones(), { id: id })[0];
        if (typeof item != 'undefined') {
            return _.where(item.models, { size: size, color: color, network: service.selectedNetwork.value });
        } else {
            return null;
        }
    };

    service.getConditionPrice = function(id, condition) {
        var item = _.where(this.getPhones(), { id: id })[0];
        var models =  _.where(item.models, { condition: condition });

        //Return the lowest price for the condition
        return _.min(models, function(model){ return model.price; }).price;
    };

    service.get24LeasePrice = function(id) {
        var item = _.where(this.getPhones(), { id: id })[0];
        var models =  _.filter(item.models, 'lease24');

        //Return the lowest price for the condition
        return _.min(models, function(model){ return model.lease24; }).lease24;
    };

    service.getPhoneSizes = function(id) {
        var item = _.where(this.getPhones(), { id: id })[0];
        if (typeof item != 'undefined') {
            var sizes =  _.uniq(_.where(item.models, { network: service.selectedNetwork.value }), 'size');
            return _.sortBy(sizes, function(size) {
                return size;
            })
        } else {
            return null;
        }
    };

    service.getPhoneColors = function(id) {
        var item = _.where(this.getPhones(), { id: id })[0];
        if (typeof item != 'undefined') {
            var colors =  _.uniq(_.where(item.models, { network: service.selectedNetwork.value }), 'color');
            return _.sortBy(colors, function(color) {
                return color;
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
        return service.cart.dataPlan;
    }

    service.addItemToCart = function(item) {
        // since we're only allowing one phone on launch reset
        service.cart.items = [];
        service.cart.items.push(item);
    };

    service.addDataPlanToCart = function(planId) {
        var plan = _.where(service.getDataPlans(service.selectedNetwork.value).plans, { id: planId })[0];
        console.log(plan);
        service.cart.dataPlan = plan;
    };

    service.getProratedCost = function() {
        var plan = service.cart.dataPlan;
        // a and b are javascript Date objects
        var dateDiffInDays = function(a, b) {
            var _MS_PER_DAY = 1000 * 60 * 60 * 24;
            // Discard the time and time-zone information.
            var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
            var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
            
            return Math.floor((utc1 - utc2) / _MS_PER_DAY);
        };
        var billingCycleEnds = 24;
        var today = new Date();
        var monthOffset = (today.getDate() <= billingCycleEnds) ? 1 : 0;
        var startBillingDate = new Date();
        startBillingDate.setDate(billingCycleEnds);
        startBillingDate.setMonth(startBillingDate.getMonth() - monthOffset);

        var daysInBillingCycle = new Date(startBillingDate.getFullYear(), startBillingDate.getMonth() + 1, 0).getDate(); // setting the day to 0 gets the previous month, so we're adding +1 to the billing month.
        var daysIntoBillingCycle = dateDiffInDays(today, startBillingDate) - 1;
        var multiplier = (daysInBillingCycle - daysIntoBillingCycle) / daysInBillingCycle;

        return (parseFloat(plan.price, 10) + service.getTotalFees()) * multiplier;

    };

    service.getTotalFees = function() {
        var plan = service.cart.dataPlan;
        return parseFloat(plan.fees.salesUseTax, 10) + parseFloat(plan.fees.federalAccessCharge, 10) + parseFloat(plan.fees.streamLineCharge, 10);
    }

    service.getTotalDueToday = function() {

        var total = 0;
        for (var i=0; i<service.cart.items.length; i++) {
            total += parseFloat(service.cart.items[i].activationFee, 10);
        }

        return total + service.getProratedCost();
    };

    service.getEstimatedMonthlyTotal = function() {
        var plan = service.cart.dataPlan;
        return parseFloat(plan.price, 10) + service.getTotalFees();
    };

    service.resetEnrollment = function () {
        // since we're not storing anyhting, a reload will reset
        $window.location.href = '/mobile-enrollment';
    };

    return service;
}]);