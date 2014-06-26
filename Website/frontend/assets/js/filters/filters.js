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

ngApp.filter('phone', function () {
    return function (phone) {
        var formattedPhone = '';

        if (!phone) {
            return;
        }

        phone = phone.replace(/[^0-9]/g, '');
        formattedPhone = phone.replace(/^([0-9]{3})([0-9]{3})([0-9]{4})$/, '$1-$2-$3');


        return formattedPhone;
    };
});


ngApp.filter('objectAsArray', function () {
    return function (input) {
        if (!angular.isObject(input)) return input;

        var array = [];
        for (var objectKey in input) {
            array.push(input[objectKey]);
        }

        return array;
    }
});