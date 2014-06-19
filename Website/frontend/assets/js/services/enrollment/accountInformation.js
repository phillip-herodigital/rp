ngApp.factory('accountInformationService', [function () {
	var accountInformation = {
		 contactInfo: {
			name: {
			    first: '',
			    last: ''
			},
		     phone: [{
		         number: '',
		         category: ''
		     }],
		     email: {
		         address: ''
		     }
		},
		socialSecurityNumber: '',
		driversLicense: {
			number: '',
			stateAbbreviation: ''
		},
	    secondaryContactInfo: {}
	};
	
	return {
		accountInformation: accountInformation,
		createPostObject: function(utilityProduct) {
			//Need to pass it the utilityProduct information as well, if it exists
			var utilityProduct = (typeof utilityProduct == 'undefined') ? [] : utilityProduct;
			
			var data = {
				contactInfo: accountInformation.contactInfo,
				socialSecurityNumber: accountInformation.socialSecurityNumber,
				driversLicense: accountInformation.driversLicense,
				secondaryContactInfo: accountInformation.secondaryContactInfo,
				cart: utilityProduct
			};
			return data;
		}
	}

	//When typeahead item is selected for serviceAddress, check against current TDU vs new TDU,
	//if different, ask to continue? then do popup with new service plans?
}]);

