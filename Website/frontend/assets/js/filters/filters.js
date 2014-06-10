ngApp.filter('removeNullProps', function() {
	return function (obj) {
		
		newObj = {};
		angular.forEach(obj, function(value, key) {
			if (value != null) {
				newObj[key] = value;
			}
		});
		return newObj;

	}
});


ngApp.filter('address', function() {
  	return function(address) {
		var formattedAddress = '';

		if (address.line1) {
		    formattedAddress += address.line1 + ', ';
		}

		if (address.unitNumber) {
		    formattedAddress += address.unitNumber + ', ';
		}

		if (address.city) {
		    formattedAddress += address.city + ', ';
		}

		if (address.stateAbbreviation) {
		    formattedAddress += address.stateAbbreviation + ', ';
		}

		if (address.postalCode5) {
		    formattedAddress += address.postalCode5;
		    if (address.postalCodePlus4) {
		        formattedAddress += '-' + address.postalCodePlus4;
		    }
		}

		return formattedAddress;
  	};
});