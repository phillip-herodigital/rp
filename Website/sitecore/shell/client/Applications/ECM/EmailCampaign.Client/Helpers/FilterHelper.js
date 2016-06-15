define([], function() {
    return {
        filters: {
            arrayOfValues: function(valuesArray, value) {
                return _.indexOf(valuesArray, value) >= 0;
            },
            greaterOrLess: function(options, value) {
                var result = true;
                if (options.$gt) {
                    result = value >= options.$gt;
                }
                if (result && options.$lt) {
                    result = value <= options.$lt;
                }
                return result;
            }
        },

        groups: {
            reduceAdd: function (options, currentGroup, itemToAdd) {
                ++currentGroup.itemsCount;
                _.each(options, _.bind(function (option, key) {
                    switch ($.type(option)) {
                        case 'string':
                            switch (option) {
                                case '$sum':
                                    currentGroup[key] += itemToAdd[key];
                                    break;
                                case '$any':
                                    currentGroup[key] = itemToAdd[key];
                                    break;
                            }
                            break;

                        case 'object':
                            var passed = true;
                            for (var fieldName in option.condition) {
                                if (itemToAdd[fieldName] !== option.condition[fieldName]) {
                                    passed = false;
                                    break;
                                }
                            }
                            if (passed) {
                                currentGroup[key] += itemToAdd[option.$sum || key];
                            }
                            break;
                        case 'function':
                            if (option.condition(itemToAdd)) {
                                currentGroup[key] += itemToAdd[option.$sum || key];
                            }
                            break;
                    }
                }, this));
                return currentGroup;
            },

            reduceRemove: function (options, currentGroup, itemToRemove) {
                --currentGroup.itemsCount;
                _.each(options, _.bind(function (option, key) {
                    switch ($.type(option)) {
                        case 'string':
                            switch (option) {
                                case '$sum':
                                    currentGroup[key] -= itemToRemove[key];
                                    break;
                            }
                            break;

                        case 'object':
                            var passed = true;
                            for (var fieldName in option.condition) {
                                if (itemToRemove[fieldName] !== option.condition[fieldName]) {
                                    passed = false;
                                    break;
                                }
                            }
                            if (passed) {
                                currentGroup[key] -= itemToRemove[option.$sum || key];
                            }
                            break;
                        case 'function':
                            if (option.condition(itemToRemove)) {
                                currentGroup[key] -= itemToRemove[option.$sum || key];
                            }
                            break;
                    }
                }, this));
                return currentGroup;
            },

            reduceInitial: function(options) {
                var initialState = { itemsCount: 0 };
                _.each(options, function(option, key) {
                    initialState[key] = 0;
                });
                return initialState;
            }
        }
    }
});
