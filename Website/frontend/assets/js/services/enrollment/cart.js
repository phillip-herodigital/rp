ngApp.factory('enrollmentCartService', ['enrollmentStepsService', 'utilityProductsService', 'accountInformationService', function (enrollmentStepsService, utilityProductsService, accountInformationService) {

	return {
		getPlans: utilityProductsService.getSelectedPlans,

		/**
		 * Return the number of items in the cart
		 * @return {[type]} [description]
		 */
		getCartCount: function() {
			return utilityProductsService.addresses.length;
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
		getCartTotal: function() {

		}
	}
}]);