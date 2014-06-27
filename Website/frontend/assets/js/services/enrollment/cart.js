ngApp.factory('enrollmentCartService', ['enrollmentStepsService', 'utilityProductsService', function (enrollmentStepsService, utilityProductsService) {
    var sum = function (sum, item) { return sum + item; }

	return {
	    getSelectedPlans: utilityProductsService.getSelectedPlans,

		/**
		 * Return the number of items in the cart
		 * @return {[type]} [description]
		 */
		getCartCount: function() {

		    //Get the count for all utility products
		    return _(utilityProductsService.addresses)
                .map(function (address) { return utilityProductsService.getSelectedPlanIds(address).length; })
                .reduce(sum, 0);
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
		    return _(utilityProductsService.addresses)
                .map(function (address) { return address.offerInformationByType; }).flatten()
		        .map(function (offerInformation) { return offerInformation && offerInformation.value && offerInformation.value.offerSelections; }).flatten()
		        .map(function (offerSelection) { return offerSelection && offerSelection.deposit && offerSelection.deposit.requiredAmount })
		        .reduce(sum, 0);
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