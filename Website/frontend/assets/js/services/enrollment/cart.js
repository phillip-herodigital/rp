ngApp.factory('enrollmentCartService', ['enrollmentStepsService', 'utilityProductsService', function (enrollmentStepsService, utilityProductsService) {
    var sum = function (arr, itemSelector) { return _.reduce(arr || [], function (sum, item) { return sum + itemSelector(item); }); };

	return {
		getPlans: utilityProductsService.getSelectedPlans,

		/**
		 * Return the number of items in the cart
		 * @return {[type]} [description]
		 */
		getCartCount: function() {

		    //Get the count for all utility products
			return sum(utilityProductsService.addresses, function (address) { return utilityProductsService.getSelectedPlanIds(address).length; });
		},

		/**
		 * Currently only offering utilityServices so we're simply returning addresses
		 * Eventually return all products here
		 * @return {[type]} [description]
		 */
		getCartItems: function() {
			return utilityProductsService.addresses;
		},
		
		/**
		 * Return the total cost of all cart items
		 * @return {[type]} [description]
		 */
		calculateCartTotal: function () {
		    return sum(utilityProductsService.addresses,
                function (addr) {
                    return sum(address.offerInformationByType, function (offerInformation) {
                        if (!offerInformation.value)
                            return 0;
                        return sum(offerInformation.value.offerSelections, function (offerSelection) {
                            return offerSelection.deposit && offerSelection.deposit.requiredAmount ? offerSelection.deposit.requiredAmount : 0;
                        })
                    })
                });
		},

		/**
		 * [editUtilityAddress description]
		 * @param  {[type]} location [description]
		 * @return {[type]}          [description]
		 */
		editUtilityAddress: function(location) {
			utilityProductsService.setActiveServiceAddress(location.location.address);
		}
	}
}]);