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

		if(address == undefined) {
			return;
		}

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

ngApp.filter('serviceTypeGas', function() {
	return function(offers) {
		var filtered = [];
		angular.forEach(offers, function(offer) {
			if(/Gas/.test(offer.offerType)) {
				filtered.push(offer);
			}
		});
		return filtered;
	}
});

ngApp.filter('serviceTypeElectricity', function() {
	return function(offers) {
		var filtered = [];
		angular.forEach(offers, function(offer) {
			if(/Electricity/.test(offer.offerType)) {
				filtered.push(offer);
			}
		});
		return filtered;
	}
})