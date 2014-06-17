ngApp.factory('enrollmentCartService', ['enrollmentStepsService', 'utilityProductsService', 'accountInformationService', function (enrollmentStepsService, utilityProductsService, accountInformationService) {

	return {
		getCartCount: function() {
			return utilityProductsService.addresses.length;
		},
		getCartItems: function() {
			return utilityProductsService.getSelectedPlansByLocation;
		},
		getCartTotal: function() {

		}
	}
}]);