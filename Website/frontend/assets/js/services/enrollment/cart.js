ngApp.factory('enrollmentCartService', ['enrollmentStepsService', '$filter', 'scrollService', function (enrollmentStepsService, $filter, scrollService) {
    var services = [],
        cart = {
            activeServiceIndex: -1,
            isCartOpen: false,
            items: []
        },
        maxResidentialItems = 3,
        maxCommercialItems = 70;

    var sum = function (sum, item) { return sum + item; }

    var updateOffer = function (offerInformation) {
        _(offerInformation.value.offerSelections).forEach(function (offerSelection) {
            offerSelection.offer = _(offerInformation.value.availableOffers).where({ id: offerSelection.offerId }).first();
            if (offerSelection.optionRules && !offerSelection.offerOption) {
                offerSelection.offerOption = { optionType: offerSelection.optionRules.optionRulesType };
            }
            if (offerSelection.payments && offerSelection.payments.requiredAmounts)
            {
                _(offerSelection.payments.requiredAmounts).forEach(function (payment) {
                    payment.isWaived = payment.isWaived !== undefined ? payment.isWaived : false;
                });
            }
        });
    };

    var enrollmentCartService = {
        services: services,

        getActiveServiceIndex: function() {
            return cart.activeServiceIndex;
        },

        toggleCart: function() {
            cart.isCartOpen = !cart.isCartOpen;
            scrollService.toggleScrolling(cart.isCartOpen);
        },

        getCartVisibility: function() {
            return cart.isCartOpen;
        },

        setActiveService: function (service) {
            cart.activeServiceIndex = _(services).indexOf(service);
        },

        getActiveService: function () {
            if (cart.activeServiceIndex >= 0)
                return services[cart.activeServiceIndex];
            return undefined;
        },

        setActiveServiceIndex: function (serviceIndex) {
            if (serviceIndex >= services.length || serviceIndex < 0)
                serviceIndex = -1;
            cart.activeServiceIndex = serviceIndex;
        },

        isNewServiceAddress: function () {
            return cart.activeServiceIndex == -1;
        },

        addService: function (service) {
            cart.activeServiceIndex = services.length;
            services.push(service);
        },

        /**
		 * Update the list of service addresses. This is use primarily when
		 * data is returned from the server. We simply copy the cart back over
		 *
		 * This may need to be updated to filter out other cart items when new
		 * products are added
		 * 
		 * @param {Array} cart
		 */
        updateCart: function (cart) {
            //Map out the location items
            angular.copy(cart, services);

            _(services).pluck('offerInformationByType').flatten().forEach(updateOffer);
            if (cart.activeServiceIndex >= services.length) {
                cart.activeServiceIndex = services.length - 1;
            }
        },

        findMatchingAddress: function (address) {
            var result;
            angular.forEach(services, function (item) {
                if ($filter('address')(address) == $filter('address')(item.location.address)) {
                    result = item;
                }
            });
            return result;
        },

        getCartDevices: function() {
            return cart.items;
        },

        getConfirmationDevices: function() {
            return _(services)
            .pluck('offerInformationByType').flatten().filter(function (offer) {
                    if (typeof offer != 'undefined' && _(offer.key).intersection(['Mobile'])) {
                        return offer;
                    }
                })
            .pluck('value').flatten().pluck('offerSelections').flatten().filter()
            .pluck('offerOption').flatten().filter().pluck('inventoryItemId').flatten().filter();
        },

        getCartDataPlan: function() {
            var dataPlan = [];
            var selectedPlan = _(services)
            .pluck('offerInformationByType').flatten().filter(function (offer) {
                    if (typeof offer != 'undefined' && _(offer.key).intersection(['Mobile'])) {
                        return offer;
                    }
                })
            .pluck('value').flatten().pluck('offerSelections').first();
            
            if (typeof selectedPlan != 'undefined' && selectedPlan.length > 0) {
                dataPlan.push(_(services).pluck('offerInformationByType').flatten().filter(function (offer) {
                    if (typeof offer != 'undefined' && _(offer.key).intersection(['Mobile'])) {
                        return offer;
                    }
                }).pluck('value').flatten().pluck('availableOffers').flatten().filter({ id: selectedPlan[0].offerId }).first());
            }
            return dataPlan;
        },

        getDevicesCount: function() {
            return cart.items.length;
        },

        getConfirmationDevicesCount: function() {
            return _(services).pluck('offerInformationByType').flatten().filter(function (offer) {
                    if (typeof offer != 'undefined' && _(offer.key).intersection(['Mobile'])) {
                        return offer;
                    }
                })
            .pluck('value').flatten().pluck('offerSelections').flatten().size();
        },

        addDeviceToCart: function(item) {
            cart.items.push(item);
        },

        removeDeviceFromCart: function(item) {
            var i = _(cart.items).indexOf(item);
            cart.items.splice(i, 1);
        },

        getOfferData: function(offerId) {
            return _(services)
            .pluck('offerInformationByType').flatten().filter(function (offer) {
                    if (typeof offer != 'undefined' && _(offer.key).intersection(['Mobile'])) {
                        return offer;
                    }
                })
            .pluck('value').flatten().pluck('availableOffers').flatten().filter({ id: offerId }).first().data;
        },

        getOfferPrice: function(offerId) {
            return _(services)
            .pluck('offerInformationByType').flatten().filter(function (offer) {
                    if (typeof offer != 'undefined' && _(offer.key).intersection(['Mobile'])) {
                        return offer;
                    }
                })
            .pluck('value').flatten().pluck('availableOffers').flatten().filter({ id: offerId }).first().rates[0].rateAmount;
        },

        getDeviceTax: function (deviceId) {
            var activeService = enrollmentCartService.getActiveService();
            return _(activeService)
                .pluck('offerInformationByType').flatten().filter()
                .pluck('value').filter().pluck('offerSelections').flatten()
                .filter(function(offer){
                    if (offer.offerOption.inventoryItemId == deviceId){ 
                        return offer
                    }
                }).pluck('payments').filter().pluck('requiredAmounts').flatten().filter()
                .pluck('taxTotal').filter()
                .reduce(sum, 0);
        },

        isDeviceInstallmentPlan: function (deviceId) {
            return _(services)
                .pluck('offerInformationByType').flatten().filter()
                .pluck('value').filter().pluck('offerSelections').flatten()
                .filter(function(offer){
                    if (offer.offerOption.inventoryItemId == deviceId){ 
                        return offer
                    }
                }).first().offerOption.useInstallmentPlan;
        },

        getDeviceActivationFee: function (deviceId) {
            var activeService = enrollmentCartService.getActiveService();
            return _(activeService)
                .pluck('offerInformationByType').flatten().filter()
                .pluck('value').filter().pluck('offerSelections').flatten()
                .filter(function(offer){
                    if (offer.offerOption.inventoryItemId == deviceId){ 
                        return offer
                    }
                }).pluck('payments').filter().pluck('requiredAmounts').flatten().filter()
                .pluck('activationFee').filter()
                .reduce(sum, 0);
        },

        getDevicePrice: function (deviceId) {
            var subTotal = _(services)
                .pluck('offerInformationByType').flatten().filter()
                .pluck('value').filter().pluck('offerSelections').flatten()
                .filter(function(offer){
                    if (offer.offerOption.inventoryItemId == deviceId){ 
                        return offer
                    }
                }).pluck('payments').filter().pluck('requiredAmounts').flatten().filter()
                .pluck('subTotal').filter()
                .reduce(sum, 0);
            return subTotal - enrollmentCartService.getDeviceActivationFee(deviceId);
        },

        getDeviceDeposit: function (deviceId) {
            return _(services)
                .pluck('offerInformationByType').flatten().filter()
                .pluck('value').filter().pluck('offerSelections').flatten()
                .filter(function(offer){
                    if (offer.offerOption.inventoryItemId == deviceId){ 
                        return offer
                    }
                }).pluck('payments').filter().pluck('requiredAmounts').flatten().filter()
                .pluck('subTotal').filter()
                .reduce(sum, 0);
        },

        getProratedCost: function() {
            var plan = enrollmentCartService.getCartDataPlan();
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

            return (parseFloat(plan[0].rates[0].rateAmount, 10) + enrollmentCartService.getTotalFees()) * multiplier;

        },

        getTotalFees: function() {
            var plan = enrollmentCartService.getCartDataPlan();
            return 0;//parseFloat(plan[0].fees.salesUseTax, 10) + parseFloat(plan[0].fees.federalAccessCharge, 10) + parseFloat(plan[0].fees.streamLineCharge, 10);
        },

        getTotalDueToday: function() {
            var total = 0;
            for (var i=0; i<cart.items.length; i++) {
                total += (typeof cart.items[i].price != 'undefined') ? parseFloat(cart.items[i].price, 10) : 0;
                total += (typeof cart.items[i].activationFee != 'undefined') ? parseFloat(cart.items[i].activationFee, 10) : 0;
                total += (typeof cart.items[i].salesTax != 'undefined') ? parseFloat(cart.items[i].salesTax, 10) : 0;
            }

            return total + getProratedCost();
        },

        getEstimatedMonthlyTotal: function() {
            var plan = cart.dataPlan;
            var total = parseFloat(plan.price, 10) + getTotalFees();
            for (var i=0; i<cart.items.length; i++) {
                total += (typeof cart.items[i].warranty != 'undefined' && cart.items[i].warranty == 'accept') ? 9.99 : 0;
                total += (typeof cart.items[i].buyingOption != 'undefined' && cart.items[i].buyingOption != 'New') ? parseFloat(cart.items[i].price, 10) : 0;
            }
            return total;
        },

        /**
		 * Set the plan for the current service based on the offer type
		 * @param  {[type]} plan
		 */
        selectOffers: function (plans) {
            var activeService = enrollmentCartService.getActiveService();
            //Set the active plans
            _(plans).keys().forEach(function (key) {
                var offerInformationForType = _(activeService.offerInformationByType).where({ key: key }).first();
                offerInformationForType.value.offerSelections = _(plans[key]).map(function (plan) {
                    return _.find(offerInformationForType.value.offerSelections, { 'offerId': plan }) || { offerId: plan };
                }).value();
                updateOffer(offerInformationForType);
            });
        },

        removeOffer: function (service, planToRemove) {

            var byType = _(service.offerInformationByType).find({ key: planToRemove.offer.offerType });
            var offerSelections = byType.value.offerSelections;
            var i = _(offerSelections).indexOf(planToRemove);
            offerSelections.splice(i, 1);

            if (_(service.offerInformationByType).pluck('value').pluck('offerSelections').flatten().size() == 0) {
                enrollmentCartService.removeService(service);
            }
        },

        removeMobileOffers: function (service) {
            var byType = _(service.offerInformationByType).find({ key: 'Mobile' });
            byType.value.offerSelections = [];
        },

        removeService: function (service) {
            var index = _(services).indexOf(service);
            services.splice(index, 1);

            if (cart.activeServiceIndex >= services.length) {
                cart.activeServiceIndex = services.length - 1;
            }
        },

        /**
		 * Return the number of items in the cart
		 * @return {[type]} [description]
		 */
        getCartCount: function () {

            //Get the count for all utility products
            var utility = _(services)
                .pluck('offerInformationByType').flatten().filter(function (offer) {
                    if (typeof offer != 'undefined' && _(offer.key).intersection(['TexasElectricity', 'TexasElectricityRenewal', 'GeorgiaGas', 'GeorgiaGasRenewal'])) {
                        return offer;
                    }
                })
                .pluck('value').filter().pluck('offerSelections').flatten().filter()
                .size();

            //Get the count for all mobile products
            var dataPlan = _(services)
                .pluck('offerInformationByType').flatten().filter(function (offer) {
                    if (typeof offer != 'undefined' && _(offer.key).intersection(['Mobile'])) {
                        return offer;
                    }
                })
                .pluck('value').filter().pluck('offerSelections').flatten().filter()
                .size();
            var mobile = (dataPlan > 0) ? 1 : cart.items.length;

            return utility + mobile;
        },

        /**
         * Return the number of service locations in the cart
         * @return {[type]} [description]
         */
        getCartLocationsCount: function () {

            //Get the count for all utility products
            return _(services)
                .size();
        },

        isCartFull: function (customerType) {

            if ((customerType == 'residential' && _(services).size() == maxResidentialItems) || (customerType == 'commercial' && _(services).size() == maxCommercialItems)) {
                return true;
            } else {
                return false;
            }
        },

        /**
		 * Currently only offering utilityServices so we're simply returning addresses
		 * Eventually return all products here
		 * @return {[type]} [description]
		 */
        getCartItems: function () {
            return services;
        },

        /**
		 * Return the total cost of all cart items
		 * @return {[type]} [description]
		 */
        calculateCartTotal: function () {
            return _(services)
                .pluck('offerInformationByType').flatten().filter()
                .pluck('value').filter().pluck('offerSelections').flatten().filter()
                .pluck('payments').filter().pluck('requiredAmounts').flatten().filter({isWaived: false})
                .pluck('dollarAmount').filter()
		        .reduce(sum, 0);
        },
        cartHasTDU: function (tdu) {
            return _(services)
               .map(function (l) {
                   if (l.location.address.stateAbbreviation == "TX" && _(l.location.capabilities).filter({ capabilityType: "TexasElectricity" }).size() != 0) {
                       return _(l.location.capabilities).filter({ capabilityType: "TexasElectricity" }).first().tdu;
                   }
               }).contains(tdu);
        },
        cartHasTxLocation: function () {
            return _(services)
               .map(function (l) {
                   return l.location.address.stateAbbreviation;
               }).contains('TX');
        },
        cartHasMobile: function () {
            return _(services).pluck('location').pluck('capabilities').flatten().pluck('capabilityType')
                .intersection(['Mobile'])
                .some();
        },
        cartHasUtility: function () {
            return _(services).pluck('location').pluck('capabilities').flatten().pluck('capabilityType')
                .intersection(['TexasElectricity', 'TexasElectricityRenewal', 'GeorgiaGas', 'GeorgiaGasRenewal'])
                .some();
        },
        locationHasService: function (location) {
            if (!location.offerInformationByType)
                return false;
            return location.offerInformationByType.some(function (o) {
                return o.value.offerSelections.length;
            });
        }
    };

    return enrollmentCartService;
}]);