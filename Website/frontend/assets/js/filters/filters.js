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