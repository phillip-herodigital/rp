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
		calculateCartTotal: function () {
		    var total = 0;
		    if (utilityProductsService.addresses) {
		        for (var i = 0; i < utilityProductsService.addresses.length; i++) {
		            var address = utilityProductsService.addresses[i];
		            if (address.offerInformationByType) {
		                for (var j = 0; j < address.offerInformationByType.length; j++) {
		                    var offerInformation = address.offerInformationByType[j];
		                    if (offerInformation.value && offerInformation.value.offerSelections) {
		                        for (var k = 0; k < offerInformation.value.offerSelections.length; k++) {
		                            var offerSelection = offerInformation.value.offerSelections[k];
		                            if (offerSelection.deposit && offerSelection.deposit.requiredAmount) {
		                                total += offerSelection.deposit.requiredAmount;
		                            }
		                        }
		                    }
		                }
		            }
		        }
		    }
		    return total;
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