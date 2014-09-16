ngApp.factory('enrollmentCartService', ['enrollmentStepsService', '$filter', 'scrollService', function (enrollmentStepsService, $filter, scrollService) {
    var services = [],
        cart = {
            activeServiceIndex: -1,
            isCartOpen: false
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
        });
    };

    var enrollmentCartService = {
        services: services,

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

        /**
		 * Set the plan for the current service based on the offer type
		 * @param  {[type]} plan
		 */
        selectOffers: function (plans) {
            var activeService = enrollmentCartService.getActiveService();
            //Set the active plans
            _(plans).keys().forEach(function (key) {
                var offerInformationForType = _(activeService.offerInformationByType).where({ key: key }).first();
                offerInformationForType.value.offerSelections = _(plans[key]).map(function (plan) { return { offerId: plan }; }).value();
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
            return _(services)
                .pluck('offerInformationByType').flatten().filter()
                .pluck('value').filter().pluck('offerSelections').flatten().filter()
                .size();
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
                .pluck('payments').filter().pluck('requiredAmounts').flatten().filter()
                .pluck('dollarAmount').filter()
		        .reduce(sum, 0);
        },
        cartHasTDU: function (tdu) {
            return _(services)
               .map(function (l) {
                   return _(l.location.capabilities).filter({ capabilityType: "TexasElectricity" }).first().tdu.toUpperCase();
               }).contains(tdu);
        },
        locationHasService: function (location) {
            return location.offerInformationByType.some(function (o) {
                return o.value.offerSelections.length;
            });
        }
    };

    return enrollmentCartService;
}]);