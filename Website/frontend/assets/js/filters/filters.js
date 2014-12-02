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


ngApp.filter('unsafe', ['$sce', function ($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    };
}]);


ngApp.filter('partition', ['$cacheFactory', function($cacheFactory) {
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
}]);

ngApp.filter('phoneFilter', function() {
  return function(phones, filters) {
    //Filter by brand, OS, Condition
    var filteredElements = phones;
    
    if(filters.brand.length) {
        filteredElements =  _.filter(filteredElements, function(item) {
            return _.contains(filters.brand, item.brand);
        });
    }

    if(filters.os.length) {
        filteredElements =  _.filter(filteredElements, function(item) {
            return _.contains(filters.os, item.os);
        });
    }

    if(filters.condition) {
        filteredElements =  _.filter(filteredElements, function(item) {
            //This makes sure it meets the first condition
            if(_.where(item.models, { condition: filters.condition }).length) {
                //Now we need to only return Refurished phones if New doesn't exist
                if(filters.condition == 'Reconditioned' && !_.where(item.models, { condition: 'New' }).length) {
                    return item;    
                }

                if(filters.condition != 'Reconditioned') {
                    return item;
                }              
            }
        });
    }

    return filteredElements;
  }
});

ngApp.filter('orderByPrice', function() {
  return function(items, field, reverse) {
    var filtered = [];
    
    angular.forEach(items, function(item) {
        filtered.push(item);
    });

    filtered.sort(function (a, b) {
        var aPrice = getConditionToCompare(a),
            bPrice = getConditionToCompare(b);

        return (parseFloat(aPrice, 10) > parseFloat(bPrice, 10) ? 1 : -1);
    });

    if(reverse) filtered.reverse();
    return filtered;

    function getConditionToCompare(item) {
        if(getConditionPrice(item, 'New')) {
            return getConditionPrice(item, 'New');
        } else if(getConditionPrice(item, 'Reconditioned') && !getConditionPrice(item, 'New')) {
            return getConditionPrice(item, 'Reconditioned');
        }

    }

    function getConditionPrice(item, condition) {
        var models =  _.where(item.models, { condition: condition });

        //Return the lowest price for the condition
        return _.min(models, function(model){ return model.price; }).price;
    }
  };
});

ngApp.filter('addSpaces', function () {
    return function (name) {
        var formattedName = '';

        if (!name) {
            return;
        }

        formattedName = name.replace('%20', ' ');
        return formattedName;
    };
});

ngApp.filter('maskNumber', function () {
    return function (number) {
        var formattedNumber = '';
        if (!number) {
            return;
        }
        var newNumber = number.replace(/[^0-9]/g, '');
        formattedNumber = (newNumber.length == 8) ? newNumber.replace(/^[0-9]{4}/, '****') : newNumber.replace(/^[0-9]{5}/, '*****');
        return formattedNumber;
    };
});