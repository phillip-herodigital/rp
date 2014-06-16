ngApp.factory('accountInformationService', [function () {
	var accountInformation = {
		 contactInfo: {
			name: {
				first: 'first name',
				last: 'last name'
			},
			phone: [{
				number: '555-555-5555',
				category: 'home'
			}, 
			{
				number: '',
				category: ''
			}],
			email: {
				address: 'test@test.com'
			}
		},
		socialSecurityNumber: '123-123-1234',
		driversLicense: {
			number: '123456789',
			state: 'TX'
		}
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
				cart: utilityProduct
			};
			return data;
		}
	}

	//When typeahead item is selected for serviceAddress, check against current TDU vs new TDU,
	//if different, ask to continue? then do popup with new service plans?
}]);

