!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.speakItem=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
/**
 * Creates an array with all falsey values removed. The values `false`, `null`,
 * `0`, `""`, `undefined`, and `NaN` are falsey.
 *
 * @static
 * @memberOf _
 * @category Array
 * @param {Array} array The array to compact.
 * @returns {Array} Returns the new array of filtered values.
 * @example
 *
 * _.compact([0, 1, false, 2, '', 3]);
 * // => [1, 2, 3]
 */
function compact(array) {
  var index = -1,
      length = array ? array.length : 0,
      resIndex = -1,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (value) {
      result[++resIndex] = value;
    }
  }
  return result;
}

module.exports = compact;

},{}],2:[function(_dereq_,module,exports){
var arrayFilter = _dereq_('../internal/arrayFilter'),
    baseCallback = _dereq_('../internal/baseCallback'),
    baseFilter = _dereq_('../internal/baseFilter'),
    isArray = _dereq_('../lang/isArray');

/**
 * Iterates over elements of `collection`, returning an array of all elements
 * `predicate` returns truthy for. The predicate is bound to `thisArg` and
 * invoked with three arguments: (value, index|key, collection).
 *
 * If a property name is provided for `predicate` the created `_.property`
 * style callback returns the property value of the given element.
 *
 * If a value is also provided for `thisArg` the created `_.matchesProperty`
 * style callback returns `true` for elements that have a matching property
 * value, else `false`.
 *
 * If an object is provided for `predicate` the created `_.matches` style
 * callback returns `true` for elements that have the properties of the given
 * object, else `false`.
 *
 * @static
 * @memberOf _
 * @alias select
 * @category Collection
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [predicate=_.identity] The function invoked
 *  per iteration.
 * @param {*} [thisArg] The `this` binding of `predicate`.
 * @returns {Array} Returns the new filtered array.
 * @example
 *
 * _.filter([4, 5, 6], function(n) {
 *   return n % 2 == 0;
 * });
 * // => [4, 6]
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36, 'active': true },
 *   { 'user': 'fred',   'age': 40, 'active': false }
 * ];
 *
 * // using the `_.matches` callback shorthand
 * _.pluck(_.filter(users, { 'age': 36, 'active': true }), 'user');
 * // => ['barney']
 *
 * // using the `_.matchesProperty` callback shorthand
 * _.pluck(_.filter(users, 'active', false), 'user');
 * // => ['fred']
 *
 * // using the `_.property` callback shorthand
 * _.pluck(_.filter(users, 'active'), 'user');
 * // => ['barney']
 */
function filter(collection, predicate, thisArg) {
  var func = isArray(collection) ? arrayFilter : baseFilter;
  predicate = baseCallback(predicate, thisArg, 3);
  return func(collection, predicate);
}

module.exports = filter;

},{"../internal/arrayFilter":6,"../internal/baseCallback":9,"../internal/baseFilter":11,"../lang/isArray":40}],3:[function(_dereq_,module,exports){
var baseEach = _dereq_('../internal/baseEach'),
    createFind = _dereq_('../internal/createFind');

/**
 * Iterates over elements of `collection`, returning the first element
 * `predicate` returns truthy for. The predicate is bound to `thisArg` and
 * invoked with three arguments: (value, index|key, collection).
 *
 * If a property name is provided for `predicate` the created `_.property`
 * style callback returns the property value of the given element.
 *
 * If a value is also provided for `thisArg` the created `_.matchesProperty`
 * style callback returns `true` for elements that have a matching property
 * value, else `false`.
 *
 * If an object is provided for `predicate` the created `_.matches` style
 * callback returns `true` for elements that have the properties of the given
 * object, else `false`.
 *
 * @static
 * @memberOf _
 * @alias detect
 * @category Collection
 * @param {Array|Object|string} collection The collection to search.
 * @param {Function|Object|string} [predicate=_.identity] The function invoked
 *  per iteration.
 * @param {*} [thisArg] The `this` binding of `predicate`.
 * @returns {*} Returns the matched element, else `undefined`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'age': 36, 'active': true },
 *   { 'user': 'fred',    'age': 40, 'active': false },
 *   { 'user': 'pebbles', 'age': 1,  'active': true }
 * ];
 *
 * _.result(_.find(users, function(chr) {
 *   return chr.age < 40;
 * }), 'user');
 * // => 'barney'
 *
 * // using the `_.matches` callback shorthand
 * _.result(_.find(users, { 'age': 1, 'active': true }), 'user');
 * // => 'pebbles'
 *
 * // using the `_.matchesProperty` callback shorthand
 * _.result(_.find(users, 'active', false), 'user');
 * // => 'fred'
 *
 * // using the `_.property` callback shorthand
 * _.result(_.find(users, 'active'), 'user');
 * // => 'barney'
 */
var find = createFind(baseEach);

module.exports = find;

},{"../internal/baseEach":10,"../internal/createFind":28}],4:[function(_dereq_,module,exports){
var arrayMap = _dereq_('../internal/arrayMap'),
    baseCallback = _dereq_('../internal/baseCallback'),
    baseMap = _dereq_('../internal/baseMap'),
    isArray = _dereq_('../lang/isArray');

/**
 * Creates an array of values by running each element in `collection` through
 * `iteratee`. The `iteratee` is bound to `thisArg` and invoked with three
 * arguments: (value, index|key, collection).
 *
 * If a property name is provided for `iteratee` the created `_.property`
 * style callback returns the property value of the given element.
 *
 * If a value is also provided for `thisArg` the created `_.matchesProperty`
 * style callback returns `true` for elements that have a matching property
 * value, else `false`.
 *
 * If an object is provided for `iteratee` the created `_.matches` style
 * callback returns `true` for elements that have the properties of the given
 * object, else `false`.
 *
 * Many lodash methods are guarded to work as interatees for methods like
 * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
 *
 * The guarded methods are:
 * `ary`, `callback`, `chunk`, `clone`, `create`, `curry`, `curryRight`, `drop`,
 * `dropRight`, `every`, `fill`, `flatten`, `invert`, `max`, `min`, `parseInt`,
 * `slice`, `sortBy`, `take`, `takeRight`, `template`, `trim`, `trimLeft`,
 * `trimRight`, `trunc`, `random`, `range`, `sample`, `some`, `uniq`, and `words`
 *
 * @static
 * @memberOf _
 * @alias collect
 * @category Collection
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [iteratee=_.identity] The function invoked
 *  per iteration.
 *  create a `_.property` or `_.matches` style callback respectively.
 * @param {*} [thisArg] The `this` binding of `iteratee`.
 * @returns {Array} Returns the new mapped array.
 * @example
 *
 * function timesThree(n) {
 *   return n * 3;
 * }
 *
 * _.map([1, 2], timesThree);
 * // => [3, 6]
 *
 * _.map({ 'a': 1, 'b': 2 }, timesThree);
 * // => [3, 6] (iteration order is not guaranteed)
 *
 * var users = [
 *   { 'user': 'barney' },
 *   { 'user': 'fred' }
 * ];
 *
 * // using the `_.property` callback shorthand
 * _.map(users, 'user');
 * // => ['barney', 'fred']
 */
function map(collection, iteratee, thisArg) {
  var func = isArray(collection) ? arrayMap : baseMap;
  iteratee = baseCallback(iteratee, thisArg, 3);
  return func(collection, iteratee);
}

module.exports = map;

},{"../internal/arrayMap":7,"../internal/baseCallback":9,"../internal/baseMap":19,"../lang/isArray":40}],5:[function(_dereq_,module,exports){
var arrayReduce = _dereq_('../internal/arrayReduce'),
    baseEach = _dereq_('../internal/baseEach'),
    createReduce = _dereq_('../internal/createReduce');

/**
 * Reduces `collection` to a value which is the accumulated result of running
 * each element in `collection` through `iteratee`, where each successive
 * invocation is supplied the return value of the previous. If `accumulator`
 * is not provided the first element of `collection` is used as the initial
 * value. The `iteratee` is bound to `thisArg` and invoked with four arguments:
 * (accumulator, value, index|key, collection).
 *
 * Many lodash methods are guarded to work as interatees for methods like
 * `_.reduce`, `_.reduceRight`, and `_.transform`.
 *
 * The guarded methods are:
 * `assign`, `defaults`, `includes`, `merge`, `sortByAll`, and `sortByOrder`
 *
 * @static
 * @memberOf _
 * @alias foldl, inject
 * @category Collection
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {*} [thisArg] The `this` binding of `iteratee`.
 * @returns {*} Returns the accumulated value.
 * @example
 *
 * _.reduce([1, 2], function(sum, n) {
 *   return sum + n;
 * });
 * // => 3
 *
 * _.reduce({ 'a': 1, 'b': 2 }, function(result, n, key) {
 *   result[key] = n * 3;
 *   return result;
 * }, {});
 * // => { 'a': 3, 'b': 6 } (iteration order is not guaranteed)
 */
var reduce = createReduce(arrayReduce, baseEach);

module.exports = reduce;

},{"../internal/arrayReduce":8,"../internal/baseEach":10,"../internal/createReduce":29}],6:[function(_dereq_,module,exports){
/**
 * A specialized version of `_.filter` for arrays without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array.length,
      resIndex = -1,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[++resIndex] = value;
    }
  }
  return result;
}

module.exports = arrayFilter;

},{}],7:[function(_dereq_,module,exports){
/**
 * A specialized version of `_.map` for arrays without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;

},{}],8:[function(_dereq_,module,exports){
/**
 * A specialized version of `_.reduce` for arrays without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initFromArray] Specify using the first element of `array`
 *  as the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initFromArray) {
  var index = -1,
      length = array.length;

  if (initFromArray && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

module.exports = arrayReduce;

},{}],9:[function(_dereq_,module,exports){
var baseMatches = _dereq_('./baseMatches'),
    baseMatchesProperty = _dereq_('./baseMatchesProperty'),
    baseProperty = _dereq_('./baseProperty'),
    bindCallback = _dereq_('./bindCallback'),
    identity = _dereq_('../utility/identity');

/**
 * The base implementation of `_.callback` which supports specifying the
 * number of arguments to provide to `func`.
 *
 * @private
 * @param {*} [func=_.identity] The value to convert to a callback.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {number} [argCount] The number of arguments to provide to `func`.
 * @returns {Function} Returns the callback.
 */
function baseCallback(func, thisArg, argCount) {
  var type = typeof func;
  if (type == 'function') {
    return typeof thisArg == 'undefined'
      ? func
      : bindCallback(func, thisArg, argCount);
  }
  if (func == null) {
    return identity;
  }
  if (type == 'object') {
    return baseMatches(func);
  }
  return typeof thisArg == 'undefined'
    ? baseProperty(func + '')
    : baseMatchesProperty(func + '', thisArg);
}

module.exports = baseCallback;

},{"../utility/identity":51,"./baseMatches":20,"./baseMatchesProperty":21,"./baseProperty":22,"./bindCallback":25}],10:[function(_dereq_,module,exports){
var baseForOwn = _dereq_('./baseForOwn'),
    createBaseEach = _dereq_('./createBaseEach');

/**
 * The base implementation of `_.forEach` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object|string} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

module.exports = baseEach;

},{"./baseForOwn":15,"./createBaseEach":26}],11:[function(_dereq_,module,exports){
var baseEach = _dereq_('./baseEach');

/**
 * The base implementation of `_.filter` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function baseFilter(collection, predicate) {
  var result = [];
  baseEach(collection, function(value, index, collection) {
    if (predicate(value, index, collection)) {
      result.push(value);
    }
  });
  return result;
}

module.exports = baseFilter;

},{"./baseEach":10}],12:[function(_dereq_,module,exports){
/**
 * The base implementation of `_.find`, `_.findLast`, `_.findKey`, and `_.findLastKey`,
 * without support for callback shorthands and `this` binding, which iterates
 * over `collection` using the provided `eachFunc`.
 *
 * @private
 * @param {Array|Object|string} collection The collection to search.
 * @param {Function} predicate The function invoked per iteration.
 * @param {Function} eachFunc The function to iterate over `collection`.
 * @param {boolean} [retKey] Specify returning the key of the found element
 *  instead of the element itself.
 * @returns {*} Returns the found element or its key, else `undefined`.
 */
function baseFind(collection, predicate, eachFunc, retKey) {
  var result;
  eachFunc(collection, function(value, key, collection) {
    if (predicate(value, key, collection)) {
      result = retKey ? key : value;
      return false;
    }
  });
  return result;
}

module.exports = baseFind;

},{}],13:[function(_dereq_,module,exports){
/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for callback shorthands and `this` binding.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {Function} predicate The function invoked per iteration.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromRight) {
  var length = array.length,
      index = fromRight ? length : -1;

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

module.exports = baseFindIndex;

},{}],14:[function(_dereq_,module,exports){
var createBaseFor = _dereq_('./createBaseFor');

/**
 * The base implementation of `baseForIn` and `baseForOwn` which iterates
 * over `object` properties returned by `keysFunc` invoking `iteratee` for
 * each property. Iterator functions may exit iteration early by explicitly
 * returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

module.exports = baseFor;

},{"./createBaseFor":27}],15:[function(_dereq_,module,exports){
var baseFor = _dereq_('./baseFor'),
    keys = _dereq_('../object/keys');

/**
 * The base implementation of `_.forOwn` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return baseFor(object, iteratee, keys);
}

module.exports = baseForOwn;

},{"../object/keys":45,"./baseFor":14}],16:[function(_dereq_,module,exports){
var baseIsEqualDeep = _dereq_('./baseIsEqualDeep');

/**
 * The base implementation of `_.isEqual` without support for `this` binding
 * `customizer` functions.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {Function} [customizer] The function to customize comparing values.
 * @param {boolean} [isLoose] Specify performing partial comparisons.
 * @param {Array} [stackA] Tracks traversed `value` objects.
 * @param {Array} [stackB] Tracks traversed `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, customizer, isLoose, stackA, stackB) {
  // Exit early for identical values.
  if (value === other) {
    // Treat `+0` vs. `-0` as not equal.
    return value !== 0 || (1 / value == 1 / other);
  }
  var valType = typeof value,
      othType = typeof other;

  // Exit early for unlike primitive values.
  if ((valType != 'function' && valType != 'object' && othType != 'function' && othType != 'object') ||
      value == null || other == null) {
    // Return `false` unless both values are `NaN`.
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, baseIsEqual, customizer, isLoose, stackA, stackB);
}

module.exports = baseIsEqual;

},{"./baseIsEqualDeep":17}],17:[function(_dereq_,module,exports){
var equalArrays = _dereq_('./equalArrays'),
    equalByTag = _dereq_('./equalByTag'),
    equalObjects = _dereq_('./equalObjects'),
    isArray = _dereq_('../lang/isArray'),
    isTypedArray = _dereq_('../lang/isTypedArray');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    funcTag = '[object Function]',
    objectTag = '[object Object]';

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparing objects.
 * @param {boolean} [isLoose] Specify performing partial comparisons.
 * @param {Array} [stackA=[]] Tracks traversed `value` objects.
 * @param {Array} [stackB=[]] Tracks traversed `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = arrayTag,
      othTag = arrayTag;

  if (!objIsArr) {
    objTag = objToString.call(object);
    if (objTag == argsTag) {
      objTag = objectTag;
    } else if (objTag != objectTag) {
      objIsArr = isTypedArray(object);
    }
  }
  if (!othIsArr) {
    othTag = objToString.call(other);
    if (othTag == argsTag) {
      othTag = objectTag;
    } else if (othTag != objectTag) {
      othIsArr = isTypedArray(other);
    }
  }
  var objIsObj = (objTag == objectTag || (isLoose && objTag == funcTag)),
      othIsObj = (othTag == objectTag || (isLoose && othTag == funcTag)),
      isSameTag = objTag == othTag;

  if (isSameTag && !(objIsArr || objIsObj)) {
    return equalByTag(object, other, objTag);
  }
  if (isLoose) {
    if (!isSameTag && !(objIsObj && othIsObj)) {
      return false;
    }
  } else {
    var valWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (valWrapped || othWrapped) {
      return equalFunc(valWrapped ? object.value() : object, othWrapped ? other.value() : other, customizer, isLoose, stackA, stackB);
    }
    if (!isSameTag) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  // For more information on detecting circular references see https://es5.github.io/#JO.
  stackA || (stackA = []);
  stackB || (stackB = []);

  var length = stackA.length;
  while (length--) {
    if (stackA[length] == object) {
      return stackB[length] == other;
    }
  }
  // Add `object` and `other` to the stack of traversed objects.
  stackA.push(object);
  stackB.push(other);

  var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isLoose, stackA, stackB);

  stackA.pop();
  stackB.pop();

  return result;
}

module.exports = baseIsEqualDeep;

},{"../lang/isArray":40,"../lang/isTypedArray":44,"./equalArrays":30,"./equalByTag":31,"./equalObjects":32}],18:[function(_dereq_,module,exports){
var baseIsEqual = _dereq_('./baseIsEqual');

/**
 * The base implementation of `_.isMatch` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Array} props The source property names to match.
 * @param {Array} values The source values to match.
 * @param {Array} strictCompareFlags Strict comparison flags for source values.
 * @param {Function} [customizer] The function to customize comparing objects.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, props, values, strictCompareFlags, customizer) {
  var index = -1,
      length = props.length,
      noCustomizer = !customizer;

  while (++index < length) {
    if ((noCustomizer && strictCompareFlags[index])
          ? values[index] !== object[props[index]]
          : !(props[index] in object)
        ) {
      return false;
    }
  }
  index = -1;
  while (++index < length) {
    var key = props[index],
        objValue = object[key],
        srcValue = values[index];

    if (noCustomizer && strictCompareFlags[index]) {
      var result = typeof objValue != 'undefined' || (key in object);
    } else {
      result = customizer ? customizer(objValue, srcValue, key) : undefined;
      if (typeof result == 'undefined') {
        result = baseIsEqual(srcValue, objValue, customizer, true);
      }
    }
    if (!result) {
      return false;
    }
  }
  return true;
}

module.exports = baseIsMatch;

},{"./baseIsEqual":16}],19:[function(_dereq_,module,exports){
var baseEach = _dereq_('./baseEach');

/**
 * The base implementation of `_.map` without support for callback shorthands
 * and `this` binding.
 *
 * @private
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function baseMap(collection, iteratee) {
  var result = [];
  baseEach(collection, function(value, key, collection) {
    result.push(iteratee(value, key, collection));
  });
  return result;
}

module.exports = baseMap;

},{"./baseEach":10}],20:[function(_dereq_,module,exports){
var baseIsMatch = _dereq_('./baseIsMatch'),
    constant = _dereq_('../utility/constant'),
    isStrictComparable = _dereq_('./isStrictComparable'),
    keys = _dereq_('../object/keys'),
    toObject = _dereq_('./toObject');

/**
 * The base implementation of `_.matches` which does not clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new function.
 */
function baseMatches(source) {
  var props = keys(source),
      length = props.length;

  if (!length) {
    return constant(true);
  }
  if (length == 1) {
    var key = props[0],
        value = source[key];

    if (isStrictComparable(value)) {
      return function(object) {
        return object != null && object[key] === value &&
          (typeof value != 'undefined' || (key in toObject(object)));
      };
    }
  }
  var values = Array(length),
      strictCompareFlags = Array(length);

  while (length--) {
    value = source[props[length]];
    values[length] = value;
    strictCompareFlags[length] = isStrictComparable(value);
  }
  return function(object) {
    return object != null && baseIsMatch(toObject(object), props, values, strictCompareFlags);
  };
}

module.exports = baseMatches;

},{"../object/keys":45,"../utility/constant":50,"./baseIsMatch":18,"./isStrictComparable":36,"./toObject":38}],21:[function(_dereq_,module,exports){
var baseIsEqual = _dereq_('./baseIsEqual'),
    isStrictComparable = _dereq_('./isStrictComparable'),
    toObject = _dereq_('./toObject');

/**
 * The base implementation of `_.matchesProperty` which does not coerce `key`
 * to a string.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} value The value to compare.
 * @returns {Function} Returns the new function.
 */
function baseMatchesProperty(key, value) {
  if (isStrictComparable(value)) {
    return function(object) {
      return object != null && object[key] === value &&
        (typeof value != 'undefined' || (key in toObject(object)));
    };
  }
  return function(object) {
    return object != null && baseIsEqual(value, object[key], null, true);
  };
}

module.exports = baseMatchesProperty;

},{"./baseIsEqual":16,"./isStrictComparable":36,"./toObject":38}],22:[function(_dereq_,module,exports){
/**
 * The base implementation of `_.property` which does not coerce `key` to a string.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

module.exports = baseProperty;

},{}],23:[function(_dereq_,module,exports){
/**
 * The base implementation of `_.reduce` and `_.reduceRight` without support
 * for callback shorthands and `this` binding, which iterates over `collection`
 * using the provided `eachFunc`.
 *
 * @private
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} accumulator The initial value.
 * @param {boolean} initFromCollection Specify using the first or last element
 *  of `collection` as the initial value.
 * @param {Function} eachFunc The function to iterate over `collection`.
 * @returns {*} Returns the accumulated value.
 */
function baseReduce(collection, iteratee, accumulator, initFromCollection, eachFunc) {
  eachFunc(collection, function(value, index, collection) {
    accumulator = initFromCollection
      ? (initFromCollection = false, value)
      : iteratee(accumulator, value, index, collection);
  });
  return accumulator;
}

module.exports = baseReduce;

},{}],24:[function(_dereq_,module,exports){
/**
 * Converts `value` to a string if it is not one. An empty string is returned
 * for `null` or `undefined` values.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  if (typeof value == 'string') {
    return value;
  }
  return value == null ? '' : (value + '');
}

module.exports = baseToString;

},{}],25:[function(_dereq_,module,exports){
var identity = _dereq_('../utility/identity');

/**
 * A specialized version of `baseCallback` which only supports `this` binding
 * and specifying the number of arguments to provide to `func`.
 *
 * @private
 * @param {Function} func The function to bind.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {number} [argCount] The number of arguments to provide to `func`.
 * @returns {Function} Returns the callback.
 */
function bindCallback(func, thisArg, argCount) {
  if (typeof func != 'function') {
    return identity;
  }
  if (typeof thisArg == 'undefined') {
    return func;
  }
  switch (argCount) {
    case 1: return function(value) {
      return func.call(thisArg, value);
    };
    case 3: return function(value, index, collection) {
      return func.call(thisArg, value, index, collection);
    };
    case 4: return function(accumulator, value, index, collection) {
      return func.call(thisArg, accumulator, value, index, collection);
    };
    case 5: return function(value, other, key, object, source) {
      return func.call(thisArg, value, other, key, object, source);
    };
  }
  return function() {
    return func.apply(thisArg, arguments);
  };
}

module.exports = bindCallback;

},{"../utility/identity":51}],26:[function(_dereq_,module,exports){
var isLength = _dereq_('./isLength'),
    toObject = _dereq_('./toObject');

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    var length = collection ? collection.length : 0;
    if (!isLength(length)) {
      return eachFunc(collection, iteratee);
    }
    var index = fromRight ? length : -1,
        iterable = toObject(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

module.exports = createBaseEach;

},{"./isLength":34,"./toObject":38}],27:[function(_dereq_,module,exports){
var toObject = _dereq_('./toObject');

/**
 * Creates a base function for `_.forIn` or `_.forInRight`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var iterable = toObject(object),
        props = keysFunc(object),
        length = props.length,
        index = fromRight ? length : -1;

    while ((fromRight ? index-- : ++index < length)) {
      var key = props[index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

module.exports = createBaseFor;

},{"./toObject":38}],28:[function(_dereq_,module,exports){
var baseCallback = _dereq_('./baseCallback'),
    baseFind = _dereq_('./baseFind'),
    baseFindIndex = _dereq_('./baseFindIndex'),
    isArray = _dereq_('../lang/isArray');

/**
 * Creates a `_.find` or `_.findLast` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new find function.
 */
function createFind(eachFunc, fromRight) {
  return function(collection, predicate, thisArg) {
    predicate = baseCallback(predicate, thisArg, 3);
    if (isArray(collection)) {
      var index = baseFindIndex(collection, predicate, fromRight);
      return index > -1 ? collection[index] : undefined;
    }
    return baseFind(collection, predicate, eachFunc);
  }
}

module.exports = createFind;

},{"../lang/isArray":40,"./baseCallback":9,"./baseFind":12,"./baseFindIndex":13}],29:[function(_dereq_,module,exports){
var baseCallback = _dereq_('./baseCallback'),
    baseReduce = _dereq_('./baseReduce'),
    isArray = _dereq_('../lang/isArray');

/**
 * Creates a function for `_.reduce` or `_.reduceRight`.
 *
 * @private
 * @param {Function} arrayFunc The function to iterate over an array.
 * @param {Function} eachFunc The function to iterate over a collection.
 * @returns {Function} Returns the new each function.
 */
function createReduce(arrayFunc, eachFunc) {
  return function(collection, iteratee, accumulator, thisArg) {
    var initFromArray = arguments.length < 3;
    return (typeof iteratee == 'function' && typeof thisArg == 'undefined' && isArray(collection))
      ? arrayFunc(collection, iteratee, accumulator, initFromArray)
      : baseReduce(collection, baseCallback(iteratee, thisArg, 4), accumulator, initFromArray, eachFunc);
  };
}

module.exports = createReduce;

},{"../lang/isArray":40,"./baseCallback":9,"./baseReduce":23}],30:[function(_dereq_,module,exports){
/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparing arrays.
 * @param {boolean} [isLoose] Specify performing partial comparisons.
 * @param {Array} [stackA] Tracks traversed `value` objects.
 * @param {Array} [stackB] Tracks traversed `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, equalFunc, customizer, isLoose, stackA, stackB) {
  var index = -1,
      arrLength = array.length,
      othLength = other.length,
      result = true;

  if (arrLength != othLength && !(isLoose && othLength > arrLength)) {
    return false;
  }
  // Deep compare the contents, ignoring non-numeric properties.
  while (result && ++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    result = undefined;
    if (customizer) {
      result = isLoose
        ? customizer(othValue, arrValue, index)
        : customizer(arrValue, othValue, index);
    }
    if (typeof result == 'undefined') {
      // Recursively compare arrays (susceptible to call stack limits).
      if (isLoose) {
        var othIndex = othLength;
        while (othIndex--) {
          othValue = other[othIndex];
          result = (arrValue && arrValue === othValue) || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
          if (result) {
            break;
          }
        }
      } else {
        result = (arrValue && arrValue === othValue) || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
      }
    }
  }
  return !!result;
}

module.exports = equalArrays;

},{}],31:[function(_dereq_,module,exports){
/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    stringTag = '[object String]';

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} value The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag) {
  switch (tag) {
    case boolTag:
    case dateTag:
      // Coerce dates and booleans to numbers, dates to milliseconds and booleans
      // to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
      return +object == +other;

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case numberTag:
      // Treat `NaN` vs. `NaN` as equal.
      return (object != +object)
        ? other != +other
        // But, treat `-0` vs. `+0` as not equal.
        : (object == 0 ? ((1 / object) == (1 / other)) : object == +other);

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings primitives and string
      // objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
      return object == (other + '');
  }
  return false;
}

module.exports = equalByTag;

},{}],32:[function(_dereq_,module,exports){
var keys = _dereq_('../object/keys');

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparing values.
 * @param {boolean} [isLoose] Specify performing partial comparisons.
 * @param {Array} [stackA] Tracks traversed `value` objects.
 * @param {Array} [stackB] Tracks traversed `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
  var objProps = keys(object),
      objLength = objProps.length,
      othProps = keys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isLoose) {
    return false;
  }
  var skipCtor = isLoose,
      index = -1;

  while (++index < objLength) {
    var key = objProps[index],
        result = isLoose ? key in other : hasOwnProperty.call(other, key);

    if (result) {
      var objValue = object[key],
          othValue = other[key];

      result = undefined;
      if (customizer) {
        result = isLoose
          ? customizer(othValue, objValue, key)
          : customizer(objValue, othValue, key);
      }
      if (typeof result == 'undefined') {
        // Recursively compare objects (susceptible to call stack limits).
        result = (objValue && objValue === othValue) || equalFunc(objValue, othValue, customizer, isLoose, stackA, stackB);
      }
    }
    if (!result) {
      return false;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (!skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      return false;
    }
  }
  return true;
}

module.exports = equalObjects;

},{"../object/keys":45}],33:[function(_dereq_,module,exports){
/**
 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  value = +value;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return value > -1 && value % 1 == 0 && value < length;
}

module.exports = isIndex;

},{}],34:[function(_dereq_,module,exports){
/**
 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;

},{}],35:[function(_dereq_,module,exports){
/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],36:[function(_dereq_,module,exports){
var isObject = _dereq_('../lang/isObject');

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && (value === 0 ? ((1 / value) > 0) : !isObject(value));
}

module.exports = isStrictComparable;

},{"../lang/isObject":42}],37:[function(_dereq_,module,exports){
var isArguments = _dereq_('../lang/isArguments'),
    isArray = _dereq_('../lang/isArray'),
    isIndex = _dereq_('./isIndex'),
    isLength = _dereq_('./isLength'),
    keysIn = _dereq_('../object/keysIn'),
    support = _dereq_('../support');

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A fallback implementation of `Object.keys` which creates an array of the
 * own enumerable property names of `object`.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @returns {Array} Returns the array of property names.
 */
function shimKeys(object) {
  var props = keysIn(object),
      propsLength = props.length,
      length = propsLength && object.length;

  var allowIndexes = length && isLength(length) &&
    (isArray(object) || (support.nonEnumArgs && isArguments(object)));

  var index = -1,
      result = [];

  while (++index < propsLength) {
    var key = props[index];
    if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
      result.push(key);
    }
  }
  return result;
}

module.exports = shimKeys;

},{"../lang/isArguments":39,"../lang/isArray":40,"../object/keysIn":46,"../support":49,"./isIndex":33,"./isLength":34}],38:[function(_dereq_,module,exports){
var isObject = _dereq_('../lang/isObject');

/**
 * Converts `value` to an object if it is not one.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {Object} Returns the object.
 */
function toObject(value) {
  return isObject(value) ? value : Object(value);
}

module.exports = toObject;

},{"../lang/isObject":42}],39:[function(_dereq_,module,exports){
var isLength = _dereq_('../internal/isLength'),
    isObjectLike = _dereq_('../internal/isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * Checks if `value` is classified as an `arguments` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  var length = isObjectLike(value) ? value.length : undefined;
  return isLength(length) && objToString.call(value) == argsTag;
}

module.exports = isArguments;

},{"../internal/isLength":34,"../internal/isObjectLike":35}],40:[function(_dereq_,module,exports){
var isLength = _dereq_('../internal/isLength'),
    isNative = _dereq_('./isNative'),
    isObjectLike = _dereq_('../internal/isObjectLike');

/** `Object#toString` result references. */
var arrayTag = '[object Array]';

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/* Native method references for those with the same name as other `lodash` methods. */
var nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray;

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(function() { return arguments; }());
 * // => false
 */
var isArray = nativeIsArray || function(value) {
  return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
};

module.exports = isArray;

},{"../internal/isLength":34,"../internal/isObjectLike":35,"./isNative":41}],41:[function(_dereq_,module,exports){
var escapeRegExp = _dereq_('../string/escapeRegExp'),
    isObjectLike = _dereq_('../internal/isObjectLike');

/** `Object#toString` result references. */
var funcTag = '[object Function]';

/** Used to detect host constructors (Safari > 5). */
var reHostCtor = /^\[object .+?Constructor\]$/;

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var fnToString = Function.prototype.toString;

/**
 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/** Used to detect if a method is native. */
var reNative = RegExp('^' +
  escapeRegExp(objToString)
  .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * Checks if `value` is a native function.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (value == null) {
    return false;
  }
  if (objToString.call(value) == funcTag) {
    return reNative.test(fnToString.call(value));
  }
  return isObjectLike(value) && reHostCtor.test(value);
}

module.exports = isNative;

},{"../internal/isObjectLike":35,"../string/escapeRegExp":48}],42:[function(_dereq_,module,exports){
/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return type == 'function' || (!!value && type == 'object');
}

module.exports = isObject;

},{}],43:[function(_dereq_,module,exports){
var isObjectLike = _dereq_('../internal/isObjectLike');

/** `Object#toString` result references. */
var stringTag = '[object String]';

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */
function isString(value) {
  return typeof value == 'string' || (isObjectLike(value) && objToString.call(value) == stringTag);
}

module.exports = isString;

},{"../internal/isObjectLike":35}],44:[function(_dereq_,module,exports){
var isLength = _dereq_('../internal/isLength'),
    isObjectLike = _dereq_('../internal/isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dateTag] = typedArrayTags[errorTag] =
typedArrayTags[funcTag] = typedArrayTags[mapTag] =
typedArrayTags[numberTag] = typedArrayTags[objectTag] =
typedArrayTags[regexpTag] = typedArrayTags[setTag] =
typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
function isTypedArray(value) {
  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objToString.call(value)];
}

module.exports = isTypedArray;

},{"../internal/isLength":34,"../internal/isObjectLike":35}],45:[function(_dereq_,module,exports){
var isLength = _dereq_('../internal/isLength'),
    isNative = _dereq_('../lang/isNative'),
    isObject = _dereq_('../lang/isObject'),
    shimKeys = _dereq_('../internal/shimKeys');

/* Native method references for those with the same name as other `lodash` methods. */
var nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys;

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.keys)
 * for more details.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to inspect.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
var keys = !nativeKeys ? shimKeys : function(object) {
  if (object) {
    var Ctor = object.constructor,
        length = object.length;
  }
  if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
      (typeof object != 'function' && (length && isLength(length)))) {
    return shimKeys(object);
  }
  return isObject(object) ? nativeKeys(object) : [];
};

module.exports = keys;

},{"../internal/isLength":34,"../internal/shimKeys":37,"../lang/isNative":41,"../lang/isObject":42}],46:[function(_dereq_,module,exports){
var isArguments = _dereq_('../lang/isArguments'),
    isArray = _dereq_('../lang/isArray'),
    isIndex = _dereq_('../internal/isIndex'),
    isLength = _dereq_('../internal/isLength'),
    isObject = _dereq_('../lang/isObject'),
    support = _dereq_('../support');

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to inspect.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  if (object == null) {
    return [];
  }
  if (!isObject(object)) {
    object = Object(object);
  }
  var length = object.length;
  length = (length && isLength(length) &&
    (isArray(object) || (support.nonEnumArgs && isArguments(object))) && length) || 0;

  var Ctor = object.constructor,
      index = -1,
      isProto = typeof Ctor == 'function' && Ctor.prototype === object,
      result = Array(length),
      skipIndexes = length > 0;

  while (++index < length) {
    result[index] = (index + '');
  }
  for (var key in object) {
    if (!(skipIndexes && isIndex(key, length)) &&
        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = keysIn;

},{"../internal/isIndex":33,"../internal/isLength":34,"../lang/isArguments":39,"../lang/isArray":40,"../lang/isObject":42,"../support":49}],47:[function(_dereq_,module,exports){
var keys = _dereq_('./keys');

/**
 * Creates a two dimensional array of the key-value pairs for `object`,
 * e.g. `[[key1, value1], [key2, value2]]`.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to inspect.
 * @returns {Array} Returns the new array of key-value pairs.
 * @example
 *
 * _.pairs({ 'barney': 36, 'fred': 40 });
 * // => [['barney', 36], ['fred', 40]] (iteration order is not guaranteed)
 */
function pairs(object) {
  var index = -1,
      props = keys(object),
      length = props.length,
      result = Array(length);

  while (++index < length) {
    var key = props[index];
    result[index] = [key, object[key]];
  }
  return result;
}

module.exports = pairs;

},{"./keys":45}],48:[function(_dereq_,module,exports){
var baseToString = _dereq_('../internal/baseToString');

/**
 * Used to match `RegExp` [special characters](http://www.regular-expressions.info/characters.html#special).
 * In addition to special characters the forward slash is escaped to allow for
 * easier `eval` use and `Function` compilation.
 */
var reRegExpChars = /[.*+?^${}()|[\]\/\\]/g,
    reHasRegExpChars = RegExp(reRegExpChars.source);

/**
 * Escapes the `RegExp` special characters "\", "/", "^", "$", ".", "|", "?",
 * "*", "+", "(", ")", "[", "]", "{" and "}" in `string`.
 *
 * @static
 * @memberOf _
 * @category String
 * @param {string} [string=''] The string to escape.
 * @returns {string} Returns the escaped string.
 * @example
 *
 * _.escapeRegExp('[lodash](https://lodash.com/)');
 * // => '\[lodash\]\(https:\/\/lodash\.com\/\)'
 */
function escapeRegExp(string) {
  string = baseToString(string);
  return (string && reHasRegExpChars.test(string))
    ? string.replace(reRegExpChars, '\\$&')
    : string;
}

module.exports = escapeRegExp;

},{"../internal/baseToString":24}],49:[function(_dereq_,module,exports){
(function (global){
/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to detect DOM support. */
var document = (document = global.window) && document.document;

/** Native method references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * An object environment feature flags.
 *
 * @static
 * @memberOf _
 * @type Object
 */
var support = {};

(function(x) {

  /**
   * Detect if functions can be decompiled by `Function#toString`
   * (all but Firefox OS certified apps, older Opera mobile browsers, and
   * the PlayStation 3; forced `false` for Windows 8 apps).
   *
   * @memberOf _.support
   * @type boolean
   */
  support.funcDecomp = /\bthis\b/.test(function() { return this; });

  /**
   * Detect if `Function#name` is supported (all but IE).
   *
   * @memberOf _.support
   * @type boolean
   */
  support.funcNames = typeof Function.name == 'string';

  /**
   * Detect if the DOM is supported.
   *
   * @memberOf _.support
   * @type boolean
   */
  try {
    support.dom = document.createDocumentFragment().nodeType === 11;
  } catch(e) {
    support.dom = false;
  }

  /**
   * Detect if `arguments` object indexes are non-enumerable.
   *
   * In Firefox < 4, IE < 9, PhantomJS, and Safari < 5.1 `arguments` object
   * indexes are non-enumerable. Chrome < 25 and Node.js < 0.11.0 treat
   * `arguments` object indexes as non-enumerable and fail `hasOwnProperty`
   * checks for indexes that exceed their function's formal parameters with
   * associated values of `0`.
   *
   * @memberOf _.support
   * @type boolean
   */
  try {
    support.nonEnumArgs = !propertyIsEnumerable.call(arguments, 1);
  } catch(e) {
    support.nonEnumArgs = true;
  }
}(0, 0));

module.exports = support;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],50:[function(_dereq_,module,exports){
/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var object = { 'user': 'fred' };
 * var getter = _.constant(object);
 *
 * getter() === object;
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

module.exports = constant;

},{}],51:[function(_dereq_,module,exports){
/**
 * This method returns the first argument provided to it.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'user': 'fred' };
 *
 * _.identity(object) === object;
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;

},{}],52:[function(_dereq_,module,exports){
module.exports = {
    options: function(method, data) {
        return {
            dataType: "json",
            type: method,
            data: data
        };
    },
    convertResponse: function(data) {
        if (data.statusCode !== 200) {
            return $.Deferred().reject({
                readyState: 4,
                status: data.statusCode,
                responseText: data.error.message
            });
        }

        return data.result;
    },
    triggerCreated: function(item) {
        _sc.trigger("item:created", item);
        return item;
    },
    get: function(url) {
        return $.ajax({
            url: url,
            dataType: "JSON"
        });
    }
};

},{}],53:[function(_dereq_,module,exports){
var isString = _dereq_("lodash/lang/isString");

module.exports = {
    isId: function(value) {
        if (!isString(value)) {
            return false;
        }

        return (/^\{?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\}?$/i).test(value);
    }
};

},{"lodash/lang/isString":43}],54:[function(_dereq_,module,exports){
var Item = _dereq_("../model/item");

var convertToItems = function(data) {
    if (!data.result) {
        console.debug("ERROR: No data from server");
        return {
            items: [],
            totalCount: 0,
            data: data
        };
    }

    if (!data.result.items) {
        console.debug("ERROR: No items from server");
        return {
            items: [],
            totalCount: 0,
            data: data
        };
    }

    var items = [];

    data.result.items.forEach(function(itemData) {
        items.push(new Item(itemData));
    });

    return {
        items: items,
        total: data.result.totalCount,
        data: data.result
    };
};

var convertToItem = function(data) {
    if (!data.result) {
        console.debug("ERROR: No data from server");
        return null;
    }

    if (!data.result.items) {
        console.debug("ERROR: No items from server");
        return null;
    }

    if (data.result.items.length === 0) {
        return null;
    }

    if (data.result.items.length > 1) {
        console.debug("ERROR: Expected a single item");
        return null;
    }

    return new Item(data.result.items[0]);
};

module.exports = {
    convertToItem: convertToItem,
    convertToItems: convertToItems
};

},{"../model/item":64}],55:[function(_dereq_,module,exports){
var urlHelper = _dereq_("./urlHelper");
var compact = _dereq_("lodash/array/compact");
var isString = _dereq_("lodash/lang/isString");
var isArray = _dereq_("lodash/lang/isArray");
var map = _dereq_("lodash/collection/map");
var idHelper = _dereq_("./idHelper");

var takeValidScope = function(elem) {
        switch (elem) {
            case "self":
                return "s";
            case "children":
                return "c";
            case "parent":
                return "p";
            default:
                throw "Unsupported scope. It must be either 'self', 'children' or 'parent'";
        }
    },
    addScope = function(url, scope) {
        if (scope && isArray(scope)) {
            var result = compact(map(scope, takeValidScope)).join("|");

            url = urlHelper.addQueryParameters(url, {
                scope: result
            });
        }

        return url;
    },
    addDatabase = function(url, database) {
        if (database && isString(database)) {
            url = urlHelper.addQueryParameters(url, {
                sc_database: database
            });
        }

        return url;
    },
    addContentDatabase = function(url, database) {
        if (database && isString(database)) {
            url = urlHelper.addQueryParameters(url, {
                sc_content: database
            });
        }

        return url;
    },
    addItemSelectorUrlPortion = function(url, itemSelector, options) {
        if (itemSelector && isString(itemSelector)) {
            if (options && options.facetsRootItemId) {
                url = urlHelper.addQueryParameters(url, {
                    facetsRootItemId: options.facetsRootItemId
                });
            }

            if (itemSelector.indexOf("search:") === 0) {
                url = urlHelper.addQueryParameters(url, {
                    search: itemSelector.substr("search:".length)
                });

                if (options && options.root && idHelper.isId(options.root)) {
                    url = urlHelper.addQueryParameters(url, {
                        root: options.root
                    });
                }

                if (options && options.searchConfig) {
                    url = urlHelper.addQueryParameters(url, {
                        searchConfig: options.searchConfig
                    });
                }
            } else if (itemSelector.indexOf("query:") === 0) {
                url = urlHelper.addQueryParameters(url, {
                    query: itemSelector.substr("query:".length)
                });
            } else if (idHelper.isId(itemSelector)) {
                url = urlHelper.addQueryParameters(url, {
                    sc_itemid: itemSelector
                });
            } else {
                url = urlHelper.combine(url, itemSelector);
            }
        }
        return url;
    },
    addLanguage = function(url, language) {
        if (language) {
            url = urlHelper.addQueryParameters(url, {
                language: language
            });
        }
        return url;
    },
    addItemVersion = function(url, version) {
        if (version) {
            url = urlHelper.addQueryParameters(url, {
                sc_itemversion: version
            });
        }

        return url;
    },
    buildUrl = function(itemSelector, options) {
        options = options || {};

        var webApi = "/-/item/v1";
        var virtualFolder = "";

        if (options.webApi) {
            webApi = options.webApi;
        }

        if (options.virtualFolder) {
            virtualFolder = options.virtualFolder;
        }

        var url = urlHelper.combine(webApi, virtualFolder);
        url = addItemSelectorUrlPortion(url, itemSelector, options);

        if (options.scope) {
            url = addScope(url, options.scope);
        }

        // for search datasource we should use Content Database
        if (options.database && itemSelector !== "" && itemSelector.indexOf("search:") === 0) {
            url = addContentDatabase(url, options.database);
        } else if (options.database) {
            url = addDatabase(url, options.database);
        }

        if (options.language) {
            url = addLanguage(url, options.language);
        }

        if (options.version) {
            url = addItemVersion(url, options.version);
        }

        if (options.payLoad) {
            url = urlHelper.addQueryParameters(url, {
                payload: "full"
            });
        }

        if (options.formatting) {
            url = urlHelper.addQueryParameters(url, {
                format: options.formatting
            });
        }

        if (options.sorting) {
            url = urlHelper.addQueryParameters(url, {
                sorting: options.sorting
            });
        }

        if (options.showHiddenItems) {
            url = urlHelper.addQueryParameters(url, {
                showHiddenItems: options.showHiddenItems
            });
        }

        if (options.fields) {
            url = urlHelper.addQueryParameters(url, {
                fields: options.fields.join("|")
            });
        }

        if (options.pageSize && options.pageSize > 0) {
            url = urlHelper.addQueryParameters(url, {
                pageIndex: options.pageIndex,
                pageSize: options.pageSize
            });
        }

        return url;
    };

module.exports = {
    buildUrl: buildUrl,
    getUrl: function(itemSelector, databaseUri, options) {
        options = options || {};

        if (!options.database) {
            options.database = databaseUri.databaseName;
        }

        if (!options.webApi) {
            options.webApi = databaseUri.webApi;
        }

        if (!options.virtualFolder) {
            options.virtualFolder = databaseUri.virtualFolder;
        }

        var url = buildUrl(itemSelector, options);

        return url;
    }
};

},{"./idHelper":53,"./urlHelper":56,"lodash/array/compact":1,"lodash/collection/map":4,"lodash/lang/isArray":40,"lodash/lang/isString":43}],56:[function(_dereq_,module,exports){
var reduce = _dereq_("lodash/collection/reduce");
var compact = _dereq_("lodash/array/compact");
var pairs = _dereq_("lodash/object/pairs");


var isParameterNameAlreadyInUrl = function(uri, parameterName) {
    return uri.indexOf("?" + parameterName + "=") >= 0 || uri.indexOf("&" + parameterName + "=") >= 0;
};

module.exports = {
    combine: function() {
        if (arguments.length === 0) {
            return "";
        }

        var result = reduce(arguments, function(memo, part) {
            if (part) {
                return memo + "/" + compact(part.split("/")).join("/");
            }
            return memo;
        });

        if (!result) {
            return "";
        }

        if (result.indexOf("/") === 0) {
            return result;
        }

        return "/" + result;
    },
    isParameterNameAlreadyInUrl: isParameterNameAlreadyInUrl,
    addQueryParameters: function(url, parameterObject) {
        var p = pairs(parameterObject),
            matchEncodedParamNamePattern = "([\\?&])({{param}}=[^&]+)",
            regexMatchEncodedParam,
            result = url;

        p.forEach(function(pair) {
            if (isParameterNameAlreadyInUrl(result, pair[0])) {
                regexMatchEncodedParam = new RegExp(matchEncodedParamNamePattern.replace("{{param}}", encodeURIComponent(pair[0])), "i");
                result = result.replace(regexMatchEncodedParam, "$1" + pair[0] + "=" + pair[1]);
            } else {
                result = ~result.indexOf("?") ? result += "&" : result += "?";
                result += encodeURIComponent(pair[0]) + "=" + encodeURIComponent(pair[1]);
            }
        });

        return result;
    },

    getQueryParameters: function(url) {
        var result = {},
            parts;

        if (!url) {
            return result;
        }

        parts = url.split("?");

        if (parts.length > 1) { //it is a full url
            parts = parts[1].split("&");
        } else { //it is not
            parts = parts[0].split("&");
        }

        if (!parts) {
            return undefined;
        }
        parts.forEach(function(part) {
            var p = part.split("=");
            if (p.length === 2) {
                result[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
            }
        });
        //some comment
        return result;
    }
};

},{"lodash/array/compact":1,"lodash/collection/reduce":5,"lodash/object/pairs":47}],57:[function(_dereq_,module,exports){
var DatabaseUri = _dereq_("./model/databaseUri");
var Database = _dereq_("./model/database");
var itemWebApiUrlHelper = _dereq_("./helpers/itemWebApiUrlHelper");

module.exports = {
    search: function(options, done) {
        if (typeof options === "string" || options instanceof String) {
            options = {
                searchText: options
            };
        } else {
            options = options || {};
        }

        var databaseUri = new DatabaseUri(options.database);
        var database = new Database(databaseUri);

        return database.search(options.searchText, done, options);
    },
    query: function(options, done) {
        if (typeof options === "string" || options instanceof String) {
            options = {
                query: options
            };
        } else {
            options = options || {};
        }

        var databaseUri = new DatabaseUri(options.database);
        var database = new Database(databaseUri);

        return database.query(options.query, done, options);
    },
    fetch: function(id, options, done) {
        var optionsParameter, completed;

        if (arguments.length < 3) {
            completed = options;
            optionsParameter = {};
        } else {
            optionsParameter = options;
            completed = done;
        }

        var databaseUri = new DatabaseUri(optionsParameter.database);
        var database = new Database(databaseUri);

        return database.fetch(id, completed, optionsParameter);
    },
    fetchChildren: function(id, options, done) {
        var optionsParameter, completed;

        if (arguments.length === 2) {
            completed = options;
            optionsParameter = {};
        } else {
            optionsParameter = options;
            completed = done;
        }

        var databaseUri = new DatabaseUri(optionsParameter.database);
        var database = new Database(databaseUri);

        return database.fetchChildren(id, completed, optionsParameter);
    },
    create: _dereq_("./repo").create
};

},{"./helpers/itemWebApiUrlHelper":55,"./model/database":60,"./model/databaseUri":61,"./repo":65}],58:[function(_dereq_,module,exports){
var ItemUri = function(databaseUri, itemId) {
    if (!databaseUri) {
        throw "Parameter 'databaseUri' is null or empty";
    }

    if (!itemId) {
        throw "Parameter 'itemId' is null or empty";
    }

    this.databaseUri = databaseUri;
    this.itemId = itemId;
};

ItemUri.prototype.getDatabaseName = function() {
    return this.databaseUri.databaseName;
};

ItemUri.prototype.getDatabaseUri = function() {
    return this.databaseUri;
};

ItemUri.prototype.getItemId = function() {
    return this.itemId;
};

module.exports = ItemUri;

},{}],59:[function(_dereq_,module,exports){
var ItemVersionUri = function(itemUri, language, version) {
    if (!itemUri) {
        throw "Parameter 'itemUri' is null";
    }

    if (!language) {
        throw "Parameter 'language' is null or empty";
    }

    if (!_.isNumber(version)) {
        throw "Parameter 'version' is null or not a number";
    }

    this.itemUri = itemUri;
    this.language = language;
    this.version = version;
};

ItemVersionUri.prototype.getDatabaseUri = function() {
    return this.itemUri.getDatabaseUri();
};

ItemVersionUri.prototype.getDatabaseName = function() {
    return this.itemUri.getDatabaseName();
};

ItemVersionUri.prototype.getItemId = function() {
    return this.itemUri.getItemId();
};

module.exports = ItemVersionUri;

},{}],60:[function(_dereq_,module,exports){
var itemWebApiUrlHelper = _dereq_("../helpers/itemWebApiUrlHelper");
var itemHelper = _dereq_("../helpers/itemHelper");
var ajaxHelper = _dereq_("../helpers/ajaxHelper");
var ItemUri = _dereq_("./ItemUri");
var ItemVersionUri = _dereq_("./ItemVersionUri");
var noop = function() {};

var Database = function(databaseUri) {
    if (!databaseUri) {
        throw "Parameter 'databaseUri' is null";
    }

    this.databaseUri = databaseUri;
};


Database.prototype.fetch = function(id, completed, options) {
    if (!id) {
        throw "Parameter 'id' is null";
    }

    options = options || {};
    completed = completed || noop;

    if (id instanceof ItemUri) {
        options.database = id.getDatabaseName();
        id = id.getItemId();
    }

    if (id instanceof ItemVersionUri) {
        options.database = id.getDatabaseName();
        options.language = id.getLanguage();
        options.version = id.getVersion();
        id = id.getItemId();
    }

    var url = itemWebApiUrlHelper.getUrl(id, this.databaseUri, options);

    if (options["scope"] && (_.contains(options["scope"], "parent") || _.contains(options["scope"], "children"))) {
        return ajaxHelper.get(url).pipe(itemHelper.convertToItems).then(completed);
    } else {
        return ajaxHelper.get(url).pipe(itemHelper.convertToItem).then(completed);
    }
};

Database.prototype.search = function(searchText, completed, options) {
    if (!searchText && !options.root && !options.searchConfig) {
        throw new Error("No search parameters has been passed");
    }

    completed = completed || noop;

    var url = itemWebApiUrlHelper.getUrl("search:" + searchText, this.databaseUri, options);

    return ajaxHelper.get(url).pipe(itemHelper.convertToItems).then(function(data) {
        completed(data.items, data.total, data.data);
    });
};

Database.prototype.query = function(queryExpression, completed, options) {
    if (!queryExpression) {
        throw "Parameter 'queryExpression' is null";
    }

    completed = completed || noop;

    var url = itemWebApiUrlHelper.getUrl("query:" + queryExpression, this.databaseUri, options);

    return ajaxHelper.get(url).pipe(itemHelper.convertToItems).then(function(data) {
        completed(data.items, data.total, data.data);
    });
};

Database.prototype.fetchChildren = function(id, completed, options) {
    if (!id) {
        throw "Parameter 'id' is null";
    }

    options = options || {};
    completed = completed || noop;

    if (!options.scope) {
        options.scope = ["children"];
    }

    var url = itemWebApiUrlHelper.getUrl(id, this.databaseUri, options);

    return ajaxHelper.get(url).pipe(itemHelper.convertToItems).then(function(data) {
        completed(data.items, data.total, data.data);
    });
};

module.exports = Database;

},{"../helpers/ajaxHelper":52,"../helpers/itemHelper":54,"../helpers/itemWebApiUrlHelper":55,"./ItemUri":58,"./ItemVersionUri":59}],61:[function(_dereq_,module,exports){
var DatabaseUri = function(databaseName) {
    this.databaseName = databaseName || "core";
    this.webApi = "";
    this.virtualFolder = "/sitecore/shell";
};

module.exports = DatabaseUri;

},{}],62:[function(_dereq_,module,exports){
var FieldUri = _dereq_("./fieldUri");

var Field = function(item, fieldUri, fieldName, value, type) {
    if (!item) {
        throw "Parameter 'item' is null";
    }

    if (!(fieldUri instanceof FieldUri)) {
        throw "Parameter 'fieldUri' is null";
    }

    this.item = item;
    this.fieldUri = fieldUri;
    this.fieldName = fieldName || "";
    this.value = value || "";
    this.type = type || "Single-Line Text";
};
/*
Field.prototype.toModel = function() {
    if (!this.$model) {
        this.$model = new _sc.Definitions.Models.Model(this);
    }

    return this.$model;
};
*/

/*
Field.prototype.toViewModel = function() {
    var vm = {
        fieldId: this.fieldUri.getFieldId(),
        fieldName: this.fieldName,
        type: this.type,
        value: new ko.observable(this.value)
    };

    var self = this;
    vm.value.subscribe(function(newValue) {
        self.item[self.fieldName] = newValue;
        self.value = newValue;
    });
    return vm;
};
*/

module.exports = Field;

},{"./fieldUri":63}],63:[function(_dereq_,module,exports){
var FieldUri = function(itemVersionUri, fieldId) {
    if (!itemVersionUri) {
        throw "Parameter 'itemVersionUri' is null or empty";
    }

    if (!fieldId) {
        throw "Parameter 'fieldId' is null or empty";
    }

    this.itemVersionUri = itemVersionUri;
    this.fieldId = fieldId;
};

FieldUri.prototype.getDatabaseUri = function() {
    return this.itemVersionUri.getDatabaseUri();
};

FieldUri.prototype.getDatabaseName = function() {
    return this.itemVersionUri.getDatabaseName();
};

FieldUri.prototype.getItemUri = function() {
    return this.itemVersionUri.getItemUri();
};

FieldUri.prototype.getItemId = function() {
    return this.itemVersionUri.getItemId();
};

FieldUri.prototype.getLanguage = function() {
    return this.itemVersionUri.getLanguage();
};

FieldUri.prototype.getVersion = function() {
    return this.itemVersionUri.getVersion();
};

module.exports = FieldUri;

},{}],64:[function(_dereq_,module,exports){
var map = _dereq_("lodash/collection/map");
var find = _dereq_("lodash/collection/find");
var filter = _dereq_("lodash/collection/filter");
var FieldUri = _dereq_("./fieldUri");
var DatabaseUri = _dereq_("./databaseUri");
var ItemUri = _dereq_("./ItemUri");
var ajaxHelper = _dereq_("../helpers/ajaxHelper");
var Field = _dereq_("./field");
var itemWebApiUrlHelper = _dereq_("../helpers/itemWebApiUrlHelper");

var shallowCopy = function(item) {
    this.$fields = item.$fields;

    var self = this;

    item.$fields.forEach(function(field, fieldId) {
        self[field.Name] = field.Value;
    });

    this.$itemUri = item.$itemUri;
    this.$itemId = item.$itemId;
    this.$itemName = item.$itemName;
    this.$displayName = item.$displayName;
    this.$language = item.$language;
    this.$version = item.$version;
    this.$templateName = item.$templateName;
    this.$templateId = item.$templateId;
    this.$hasChildren = item.$hasChildren;
    this.$path = item.$path;
    this.$url = item.$url;
    this.$mediaurl = item.$mediaurl;
};

var Item = function(itemData, itemUri) {
    itemData = itemData || {};

    this.databaseUri = new DatabaseUri(itemData.Database);

    if (!itemUri) {
        if (itemData.itemUri) {
            itemUri = itemData.itemUri;
        } else {
            itemUri = new ItemUri(this.databaseUri, itemData.ID);
        }
    }


    if (itemData instanceof Item) {
        shallowCopy.call(this, itemData);
        return;
    }

    this.$fields = [];

    var self = this;
    var fields = itemData.Fields || {};

    for (var fieldId in fields) {
        if (fields.hasOwnProperty(fieldId)) {
            var field = fields[fieldId];

            self[field.Name] = field.Value;

            var fieldUri = new FieldUri(itemUri, fieldId);

            var itemField = new Field(self, fieldUri, field.Name, field.Value, field.Type);

            if (field.FormattedValue) {
                itemField.formattedValue = field.FormattedValue;
            }
            if (field.LongDateValue) {
                itemField.longDateValue = field.LongDateValue;
            }
            if (field.ShortDateValue) {
                itemField.shortDateValue = field.ShortDateValue;
            }
            self.$fields.push(itemField);
        }
    }

    this.$itemUri = itemUri;
    this.$itemId = itemUri.getItemId();
    this.$itemName = itemData.Name || "";
    /*not field on the Item on Sitecore */
    this.$displayName = itemData.DisplayName || "";
    this.$database = itemData.Database || "";
    this.$language = itemData.Language || "";
    this.$version = itemData.Version || 0;
    this.$templateName = itemData.TemplateName || "";
    this.$templateId = itemData.TemplateId || "";
    this.$hasChildren = itemData.HasChildren || false;
    this.$path = itemData.Path || "";
    this.$url = itemData.Url || "";
    this.$mediaurl = itemData.MediaUrl || "";
    this.$icon = itemData.Icon || "";
};

Item.prototype.getFieldById = function(fieldId) {
    return find(this.$fields, function(field) {
        return field.fieldUri.getFieldId() === fieldId;
    }, this);
};

Item.prototype.save = function(completed, context) {
    var dataToSend = map(this.$fields, function(field) {
        return {
            name: field.fieldName,
            value: this[field.fieldName]
        };
    }, this);


    var url = itemWebApiUrlHelper.getUrl(this.$itemId, this.databaseUri);

    var ajaxOptions = {
        dataType: "json",
        type: "PUT",
        data: dataToSend
    };

    return $.when($.ajax(url, ajaxOptions)).pipe(ajaxHelper.convertResponse).then($.proxy(completed, context));
};

Item.prototype.rename = function(newName, completed, context) {
    var data = [{
        name: "__itemName",
        value: newName
    }];

    var url = itemWebApiUrlHelper.getUrl(this.$itemId, this.databaseUri);
    var ajaxOptions = {
        dataType: "json",
        type: "PUT",
        data: data
    };

    return $.when($.ajax(url, ajaxOptions)).pipe(ajaxHelper.convertResponse).then($.proxy(completed, context));
};

Item.prototype.remove = function(completed, context) {
    var url = itemWebApiUrlHelper.getUrl(this.$itemId, this.databaseUri);
    var ajaxOptions = {
        dataType: "json",
        type: "DELETE"
    };

    return $.when($.ajax(url, ajaxOptions)).pipe(ajaxHelper.convertResponse).then($.proxy(completed, context));
};

module.exports = Item;

},{"../helpers/ajaxHelper":52,"../helpers/itemWebApiUrlHelper":55,"./ItemUri":58,"./databaseUri":61,"./field":62,"./fieldUri":63,"lodash/collection/filter":2,"lodash/collection/find":3,"lodash/collection/map":4}],65:[function(_dereq_,module,exports){
var itemWebApiUrlHelper = _dereq_("../helpers/itemWebApiUrlHelper");
var itemHelper = _dereq_("../helpers/itemHelper");
var urlHelper = _dereq_("../helpers/urlHelper");
var ajaxHelper = _dereq_("../helpers/ajaxHelper");
var Item = _dereq_("../model/item");
var Field = _dereq_("../model/field");
var noop = function() {};

var repo = {
    create: function(itemDefinition, completed) {
        var item = itemDefinition;

        completed = completed || noop;

        if (!itemDefinition.Name || !itemDefinition.TemplateId || !itemDefinition.ParentId) {
            throw "Provide valid parameter in order to create an Item";
        }

        if (!itemDefinition.Database) {
            itemDefinition.Database = "core";
        }

        var url = itemWebApiUrlHelper.buildUrl(item.ParentId, {
            webApi: "/-/item/v1/sitecore/shell",
            database: itemDefinition.Database
        });

        url = urlHelper.addQueryParameters(url, {
            name: itemDefinition.Name
        });

        url = urlHelper.addQueryParameters(url, {
            template: itemDefinition.TemplateId
        });

        return $.when($.ajax(url, ajaxHelper.options("POST", itemDefinition.Fields)))
            .pipe(ajaxHelper.convertResponse)
            .pipe(function(data) {
                return new Item(data.items);
            })
            //.pipe(ajaxHelper.triggerCreated)
            .then(completed);
    }
};

module.exports = repo;

},{"../helpers/ajaxHelper":52,"../helpers/itemHelper":54,"../helpers/itemWebApiUrlHelper":55,"../helpers/urlHelper":56,"../model/field":62,"../model/item":64}]},{},[57])
(57)
});