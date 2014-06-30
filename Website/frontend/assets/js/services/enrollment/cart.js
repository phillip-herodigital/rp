ngApp.factory('enrollmentCartService', ['enrollmentStepsService', '$filter', function (enrollmentStepsService, $filter) {
    var services = [];
    var activeServiceIndex = -1;

    var sum = function (sum, item) { return sum + item; }

    var updateOffer = function (offerInformation) {
        _(offerInformation.value.offerSelections).forEach(function (offerSelection) {
            offerSelection.offer = _(offerInformation.value.availableOffers).where({ id: offerSelection.offerId }).first();
        });
    };

    var enrollmentCartService = {
        services: services,

        setActiveService: function (service) {
            activeServiceIndex = _(services).indexOf(service);
        },

        getActiveService: function () {
            if (activeServiceIndex >= 0)
                return services[activeServiceIndex];
            return undefined;
        },

        setActiveServiceIndex: function (serviceIndex) {
            if (serviceIndex >= services.length || serviceIndex < 0)
                serviceIndex = -1;
            activeServiceIndex = serviceIndex;
        },

        isNewServiceAddress: function () {
            return activeServiceIndex == -1;
        },

        addService: function (service) {
            activeServiceIndex = services.length;
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
            if (activeServiceIndex >= services.length) {
                activeServiceIndex = services.length - 1;
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

            // TODO - move this logic into the cart service
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

            if (activeServiceIndex >= services.length) {
                activeServiceIndex = services.length - 1;
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
                .pluck('deposit').filter().pluck('requiredAmount').flatten().filter()
		        .reduce(sum, 0);
        },
    };

    return enrollmentCartService;
}]);