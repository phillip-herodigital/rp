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

ngApp.filter('securityQuestion', function () {
    function isIdInUse(selectedIds, id)
    {
        var retVal = false;
        angular.forEach(selectedIds, function (currentSelectedId) {
            if (id == currentSelectedId)
            {
                retVal = true;
            }
        });
        return retVal;
    }
    
    return function(allOptions, selectedIds, index) {
        
        var newOptions = [];
        //var selectedIds = [$scope.formData.challenges[0].selectedQuestion.id, $scope.formData.challenges[1].selectedQuestion.id];
        angular.forEach(allOptions, function (currentOption) {
            
            if (currentOption.id == selectedIds[parseInt(index)] || !isIdInUse(selectedIds, currentOption.id))
            {
                newOptions.push(currentOption);
            }
        });
        
        return newOptions;
    };
});


ngApp.filter('unsafe', function ($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    };
});


ngApp.filter('partition', function($cacheFactory) {
  var arrayCache = $cacheFactory('partition');
  var filter = function(arr, size) {
    if (!arr) { return; }
    var newArr = [];
    for (var i=0; i<arr.length; i+=size) {
        newArr.push(arr.slice(i, i+size));        
    }
    var cachedParts;
    var arrString = JSON.stringify(arr);
    cachedParts = arrayCache.get(arrString+size); 
    if (JSON.stringify(cachedParts) === JSON.stringify(newArr)) {
      return cachedParts;
    }
    arrayCache.put(arrString+size, newArr);
    return newArr;
  };
  return filter;
});