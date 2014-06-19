ngApp.factory('enrollmentCartService', ['enrollmentStepsService', 'utilityProductsService', function (enrollmentStepsService, utilityProductsService) {

	return {
		getPlans: utilityProductsService.getSelectedPlans,

		/**
		 * Return the number of items in the cart
		 * @return {[type]} [description]
		 */
		getCartCount: function() {
			var count = 0;

			//Get the count for all utility products
			angular.forEach(utilityProductsService.addresses, function(address, index) {
				count += utilityProductsService.getSelectedPlanIds(address).length; 
			});
			
			return count;
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

		},

		/**
		 * [changeUtilityPlan description]
		 * @param  {[type]} location [description]
		 * @return {[type]}          [description]
		 */
		changeUtilityPlan: function(location) {

		},

		/**
		 * [editUtilityAddress description]
		 * @param  {[type]} location [description]
		 * @return {[type]}          [description]
		 */
		editUtilityAddress: function(location) {
			utilityProductsService.isNewServiceAddress = false;
			utilityProductsService.setActiveServiceAddress(location.location.address);
		},

		/**
		 * [deleteUtilityAddress description]
		 * @return {[type]} [description]
		 */
		deleteUtilityAddress: function(location) {

		}
	}
}]);