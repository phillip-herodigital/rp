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
                    payment.depositOption = payment.depositOption !== undefined ? payment.depositOption : 'deposit';
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

        getCartServices: function() {
            return services;
        },

        getActiveServiceType: function () {
            if (cart.activeServiceIndex >= 0 && typeof services[cart.activeServiceIndex].offerInformationByType != 'undefined')
                return services[cart.activeServiceIndex].offerInformationByType[0].key;
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

        getServiceCount: function() {
            return services.length;
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
            if (cart.length && cart[0].offerInformationByType.length && cart[0].offerInformationByType[0].key == "Protective") {
                var div = document.createElement('div');
                var htmlDecode = function (item) {
                    div.innerHTML = item;
                    return div.textContent;
                }
                if (cart[0].offerInformationByType[0].value.availableOffers.length) {
                    angular.forEach(cart[0].offerInformationByType[0].value.availableOffers, function (availableOffer, AOIndex) {
                        angular.forEach(availableOffer.suboffers, function (suboffer, SOIndex) {
                            cart[0].offerInformationByType[0].value.availableOffers[AOIndex].suboffers[SOIndex].name = htmlDecode(suboffer.name);
                            cart[0].offerInformationByType[0].value.availableOffers[AOIndex].suboffers[SOIndex].description = htmlDecode(suboffer.description);
                            angular.forEach(cart[0].offerInformationByType[0].value.availableOffers[AOIndex].suboffers[SOIndex].details, function (detail, dIndex) {
                                cart[0].offerInformationByType[0].value.availableOffers[AOIndex].suboffers[SOIndex].details[dIndex] = htmlDecode(detail);
                            });
                        });
                    });
                }
            }
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

        getConfirmationTransfers: function() {
            return _(services)
            .pluck('offerInformationByType').flatten().filter(function (offer) {
                    if (typeof offer != 'undefined' && _(offer.key).intersection(['Mobile'])) {
                        return offer;
                    }
                })
            .pluck('value').flatten().pluck('offerSelections').flatten().filter()
            .pluck('offerOption').flatten().filter().pluck('transferInfo');
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

        getPlanPrice: function(serviceIndex) {
            if (serviceIndex && serviceIndex < services.length) {
                var plan = services[serviceIndex];
                return plan.offerInformationByType[0].value.offerSelections[0].rates[0].rateAmount;
            }
            else {
                return null;
            }
        },

        totalPlanPrice: function (plan, plans) {
            plan = plan || enrollmentCartService.getCartDataPlan();
            plans = plans || _(services).pluck('offerInformationByType').flatten().filter(function (offer) {
                    if (typeof offer != 'undefined' && _(offer.key).intersection(['Mobile'])) {
                        return offer;
                    }
                }).pluck('value').flatten().pluck('availableOffers').flatten().value();

            var childPlan = _.find(plans, function (childPlan) { return childPlan.id == plan.childOfferId; });
            
            var devicesCount = enrollmentCartService.getDevicesCount();
            if (devicesCount == 0) {
                return null;
            } else if (devicesCount == 1) {
                return plan.rates[0].rateAmount;
            } else if (childPlan != null && typeof childPlan.rates != 'undefined') {
                return plan.rates[0].rateAmount + (devicesCount - 1) * childPlan.rates[0].rateAmount;
            }
        },

        getDevicesCount: function() {
            return cart.items.length;
        },

        getConfirmationDevicesCount: function() {
            var mobileAddresses = enrollmentCartService.getMobileAddresses();
            return _(mobileAddresses)
                .pluck('offerInformationByType').flatten().filter()
                .pluck('value').filter()
                .pluck('offerSelections').flatten().filter()
                .size();
        },

        addDeviceToCart: function(item) {
            cart.items.push(item);
        },

        removeDeviceFromCart: function(item) {
            var i = _(cart.items).indexOf(item);
            cart.items.splice(i, 1);
        },

        getOfferData: function(offerId) {
            if (offerId != undefined) {
            return _(services)
            .pluck('offerInformationByType').flatten().filter(function (offer) {
                    if (typeof offer != 'undefined' && _(offer.key).intersection(['Mobile'])) {
                        return offer;
                    }
                })
            .pluck('value').flatten().pluck('availableOffers').flatten().filter({ id: offerId }).first().data;
            }
            else {
                return null;
            }
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

        getDeviceDetails: function (device) {
            if (device != undefined) {
                return _.find(cart.items, { imeiNumber: device.imeiNumber });
            }
            else {
                return null;
            }
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

        calculateMobileMonthlyTotal: function (addLineSubAccounts) {
            var total = 0;
            for (var i = 0; i < services.length; i++) {
                if (services[i].offerInformationByType[0].key == "Mobile") {
                    total += _.find(services[i].offerInformationByType[0].value.availableOffers, function (availableOffer) {
                        return services[i].offerInformationByType[0].value.offerSelections[0].offerId === availableOffer.id;
                    }).rates[0].rateAmount;
                }
            }
            angular.forEach(addLineSubAccounts, function (subAccount) {
                total += subAccount.cost;
            });
            return total;
        },

        /**
        * Handle Protective Cart Functions
        */
        removeProtectiveOffer: function (offerId) {
            _.remove(enrollmentCartService.services[0].offerInformationByType[0].value.offerSelections[0].offer.suboffers, function (suboffer) {
                return suboffer.id === offerId;
            });
            if (enrollmentCartService.services[0].offerInformationByType[0].value.offerSelections[0].offer.suboffers.length != 0) {
                enrollmentCartService.services[0].offerInformationByType[0].value.offerSelections[0].offerId = enrollmentCartService.findProtectiveProduct().id;
            }
            else {
                enrollmentStepsService.setStep("protectiveFlowServices");
                enrollmentStepsService.hideStep("accountInformation");
                enrollmentStepsService.hideStep("verifyIdentity");
            }
        },

        findProtectiveProduct: function () {
            if (enrollmentCartService.services[0].offerInformationByType[0].value.offerSelections.length) {
                return _.find(enrollmentCartService.services[0].offerInformationByType[0].value.availableOffers, function (availableOffer) {
                    if (availableOffer.suboffers.length === enrollmentCartService.services[0].offerInformationByType[0].value.offerSelections[0].offer.suboffers.length) {
                        return _.every(enrollmentCartService.services[0].offerInformationByType[0].value.offerSelections[0].offer.suboffers, function (suboffer) {
                            return _.some(availableOffer.suboffers, function (availableSuboffer) {
                                return suboffer.guid === availableSuboffer.guid;
                            });
                        });
                    }
                    else return false
                });
            }
            else return {};
        },

        getProtectiveDiscount: function () {
            var count = 0;
            var discount = 0;
            var selectedOffer = enrollmentCartService.findProtectiveProduct();
            if (selectedOffer) {
                angular.forEach(selectedOffer.suboffers, function (suboffer) {
                    discount += suboffer.threeServiceDiscount;
                    if (suboffer.isGroupOffer) count += 2;
                    else count++;
                });
            }
            if (count > 2) {
                return discount;
            }
            else {
                return 0;
            }
        },

        getProtectiveTotal: function () {
            var total = 0;
            var selectedOffer = enrollmentCartService.findProtectiveProduct();
            if (selectedOffer) {
                angular.forEach(selectedOffer.suboffers, function (suboffer) {
                    total += suboffer.price;
                });
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
            var utiltiyAddresses = enrollmentCartService.getUtilityAddresses();
            var utility = _(utiltiyAddresses)
                .pluck('offerInformationByType').flatten().filter()
                .pluck('value').filter()
                .pluck('offerSelections').flatten().filter()
                .size();

            //Get the count for all mobile products
            var mobile = cart.items.length;

            //Get the count for all protective products
            var protective = _(enrollmentCartService.getProtectiveServices())
                .pluck('offerInformationByType').flatten().filter()
                .pluck('value').filter()
                .pluck('offerSelections').flatten().filter()
                .pluck('offer').filter()
                .pluck('suboffers').flatten().filter()
                .size();

            return utility + mobile + protective;
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
            var depositType = '';
            return _(services)
                .pluck('offerInformationByType').flatten().filter()
                .pluck('value').filter().pluck('offerSelections').flatten().filter(function(offerSelection){
                    if (typeof offerSelection.depositType != 'undefined')
                        depositType = offerSelection.depositType;
                    if (typeof offerSelection.depositType != 'undefined' && offerSelection.depositType != 'DepositWaived')
                        return offerSelection;
                })
                .pluck('payments').filter().pluck('requiredAmounts').flatten()
                .map(function(payment){ 
                    if (payment.depositOption == 'deposit' && depositType != 'DepositAlternative') 
                        return payment.dollarAmount;
                    if (payment.depositOption == 'depositAlternative' || depositType == 'DepositAlternative') 
                        return payment.depositAlternativeAmount;
                })
                .filter()
		        .reduce(sum, 0);
        },
        calculateConfirmationTotal: function () {
            var depositType = '';
            return _(services)
                .pluck('offerInformationByType').flatten().filter()
                .pluck('value').filter().pluck('offerSelections').flatten().filter(function(offerSelection){
                    if (typeof offerSelection.depositType != 'undefined' && offerSelection.depositType != 'DepositWaived')
                        return offerSelection;
                }).map(function(offerSelection){ 
                    if (typeof offerSelection.depositType != 'undefined' && typeof offerSelection.payments != 'undefined') {
                        if (offerSelection.depositType == 'Deposit') 
                            return _(offerSelection.payments.requiredAmounts).pluck('dollarAmount').flatten().filter().reduce();
                        if (offerSelection.depositType == 'DepositAlternative') 
                            return _(offerSelection.payments.requiredAmounts).pluck('depositAlternativeAmount').flatten().filter().reduce();
                    }
                }).filter()
                .reduce(sum,0);
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
            return _(services).pluck('location').pluck('capabilities').flatten().pluck('capabilityType')
                .intersection(['TexasElectricity', 'TexasElectricityRenewal'])
                .some();
        },
        cartHasGaLocation: function () {
            return _(services).pluck('location').pluck('capabilities').flatten().pluck('capabilityType')
                .intersection(['GeorgiaGas', 'GeorgiaGasRenewal'])
                .some();
        },
        cartHasMobile: function () {
            return _(services).pluck('location').pluck('capabilities').flatten().pluck('capabilityType')
                .intersection(['Mobile'])
                .some();
        },
        cartHasCommercialQuote: function () {
            return _(services).pluck('location').pluck('capabilities').flatten()
                .filter({ capabilityType: "CustomerType" }).pluck('customerType')
                .intersection(['commercial'])
                .some();
        },
        getMobileAddresses: function() {
            return _(services)
                .filter(function(service) { 
                    if (_(service.offerInformationByType).pluck('key')
                        .intersection(['Mobile'])
                        .some()) {
                        return service;
                    } 
                }).value();
        },
        cartHasUtility: function () {
            return _(services).pluck('location').pluck('capabilities').flatten().pluck('capabilityType')
                .intersection(['TexasElectricity', 'TexasElectricityCommercialQuote', 'TexasElectricityRenewal',
                    'NewJerseyElectricity', 'NewJerseyElectricityRenewal',
                    'NewYorkElectricity', 'NewYorkElectricityRenewal',
                    'MarylandElectricity', 'MarylandElectricityRenewal',
                    'PennsylvaniaElectricity', 'PennsylvaniaElectricityRenewal',
                    'DCElectricity', 'DCElectricityRenewal',
                    'GeorgiaGas', 'GeorgiaGasRenewal',
                    'NewJerseyGas', 'NewJerseyGasRenewal',
                    'NewYorkGas', 'NewYorkGasRenewal',
                    'MarylandGas', 'MarylandGasRenewal',
                    'PennsylvaniaGas', 'PennsylvaniaGasRenewal'])
                .some();
        },
        cartHasProtective: function () {
            return _(services).pluck('location').pluck('capabilities').flatten().pluck('capabilityType')
                .intersection(['Protective'])
                .some();
        },
        getUtilityAddresses: function() {
            return _(services)
                .filter(function(service) { 
                    if (_(service.offerInformationByType).pluck('key')
                        .intersection(['TexasElectricity', 'TexasElectricityCommercialQuote', 'TexasElectricityRenewal',
                        'NewJerseyElectricity', 'NewJerseyElectricityRenewal',
                        'NewYorkElectricity', 'NewYorkElectricityRenewal',
                        'DCElectricity', 'DCElectricityRenewal',
                        'MarylandElectricity', 'MarylandElectricityRenewal',
                        'PennsylvaniaElectricity', 'PennsylvaniaElectricityRenewal',
                        'GeorgiaGas', 'GeorgiaGasRenewal',
                        'NewJerseyGas', 'NewJerseyGasRenewal',
                        'NewYorkGas', 'NewYorkGasRenewal',
                        'MarylandGas', 'MarylandGasRenewal',
                        'PennsylvaniaGas', 'PennsylvaniaGasRenewal'])
                        .some()) {
                        return service;
                    } 
                }).value();
        },
        getProtectiveServices: function () {
            return _(services)
                .filter(function (service) {
                    if (_(service.offerInformationByType).pluck('key')
                        .intersection(['Protective'])
                        .some()) {
                        return service;
                    }
                }).value();
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