ngApp.factory('accountInformationService', [function () {
	var accountInformation = {
		 contactInfo: {
			name: {
				first: 'first name',
				last: 'last name'
			},
			primaryPhone: {
				number: '555-555-5555',
				category: 'home'
			},
			secondaryPhone: {
				number: '666-666-6666',
				category: 'mobile'
			},
			email: {
				address: 'test@test.com'
			}
		},
		socialSecurityNumber: '123-123-1234',
		driversLicense: {
			number: '123456789',
			state: 'TX'
		},
		billingAddress: {

		}
	};
	
	return {
		accountInformation: accountInformation
	}

	//When typeahead item is selected, check against current TDU vs new TDU,
	//if different, ask to continue? then do popup with new service plans?
}]);

