/**!
 *
 * sitecore SPEAK framework
 *
 * Built: Fri Jul 10 2015 12:27:14 GMT+0200 (Romance Daylight Time)
 * PackageVersion: 2.0.24
 *
 */

!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.sc=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){

},{}],2:[function(_dereq_,module,exports){
/* jshint forin: false*/

var isObject = function ( obj ) {
  return typeof {} === typeof obj;
};

var extend = function ( base, ext ) {
  for ( var i in ext ) {
    if ( base[ i ] ) {
      throw "key " + i + " already exists in the module";
    }
    base[ i ] = ext[ i ];
  }
};

var mod = function ( key, obj ) {
  var fn, extension;

  fn = this.fn = this.fn || {};

  if ( !key && !obj ) {
    throw "Please, pass at least a module name";
  }

  if ( fn[ key ] && !obj ) {
    return fn[ key ];
  }

  if ( !fn[ key ] && !obj ) {
    return null;
  }

  extension = isObject( obj ) ? obj : obj.apply( {}, [ this ] );

  if ( !fn[ key ] && obj ) {
    fn[ key ] = extension;
  } else {
    extend( fn[ key ], extension );
  }

  return fn[ key ];
};

module.exports = {
  attach: function ( sitecore ) {
    if ( sitecore.module ) {
      return;
    }
    sitecore.module = mod.bind( sitecore );
  }
};
},{}],3:[function(_dereq_,module,exports){
var pipelines = _dereq_( "./model/pipelines" );

//export the Pipeline's model via the pipelines API
pipelines.Pipeline = _dereq_( "./model/pipeline" );

var invoke = _dereq_( "./pipelines/Invoke/index" );
var serverInvoke = _dereq_( "./pipelines/ServerInvoke/index" );

pipelines.add( invoke );
pipelines.add( serverInvoke );

module.exports = pipelines;
},{"./model/pipeline":4,"./model/pipelines":5,"./pipelines/Invoke/index":10,"./pipelines/ServerInvoke/index":12}],4:[function(_dereq_,module,exports){
var utils = _dereq_( "../utils/index" );

var Pipeline = function ( name ) {

  var result = {
    processors: [],
    name: name,
    add: function ( processor ) {

      if ( !processor || !processor.priority || !processor.execute || !utils.isNumber( processor.priority ) || !utils.isFunction( processor.execute ) ) {
        throw "not valid step";
      }

      this.processors.push( processor );
    },
    length: function () {
      return this.processors.length;
    },
    remove: function ( processor ) {
      this.processors = utils.reject( this.processors, function ( p ) {
        return p.priority === processor.priority;
      } );
    },
    execute: function ( context ) {
      //TODO: sort on adding processors
      var list = utils.sortBy( this.processors, function ( processor ) {
        return processor.priority;
      } );

      list.forEach( function ( processor ) {
        if ( context.aborted ) {
          return false;
        }
        processor.execute( context );
      } );
    }
  };

  return result;
};

module.exports = Pipeline;
},{"../utils/index":14}],5:[function(_dereq_,module,exports){
var utils = _dereq_( "../utils/index" ),
  pipelines = [];

var api = {
  get: function ( name ) {
    var result;

    pipelines.forEach( function ( pip ) {
      if ( pip.name === name ) {
        result = pip;
      }
    } );

    return result;
  },
  add: function ( pipeline ) {
    if ( !pipeline || !pipeline.name || !utils.isObject( pipeline ) ) {
      throw new Error( "invalid pipeline" );
    }

    pipelines.push( pipeline );
    this[ pipeline.name ] = pipeline;
  },
  remove: function ( pipelineName ) {
    pipelines = utils.reject( pipelines, function ( p ) {
      return p.name === pipelineName;
    } );
  },
  length: function () {
    return pipelines.length;
  }
};

module.exports = api;
},{"../utils/index":14}],6:[function(_dereq_,module,exports){
var utils = _dereq_( "../../utils/index" );

var handleJavaScript = {
  priority: 1000,
  execute: function ( context ) {
    if ( context.handler === "javascript" ) {
      if ( context.target.indexOf( ";" ) > 0 ) {
        context.target.split( ";" ).forEach( function ( tar ) {
          utils.executeContext( tar, context );
        } );
      } else {
        utils.executeContext( context.target, context );
      }
    }
  }
};

module.exports = handleJavaScript;
},{"../../utils/index":14}],7:[function(_dereq_,module,exports){
var utils = _dereq_( "../../utils/index" ),
  commands = _dereq_( "../../utils/command" );

var handleCommand = {
  priority: 2000,
  execute: function ( context ) {
    if ( context.handler === "command" ) {
      commands.executeCommand( context.target );
    }
  }
};

module.exports = handleCommand;
},{"../../utils/command":13,"../../utils/index":14}],8:[function(_dereq_,module,exports){
var utils = _dereq_( "../../utils/index" );

var serverClick = {
  priority: 3000,
  execute: function ( context ) {
    if ( context.handler !== "serverclick" ) {
      return;
    }

    //TODO: maybe we should validate
    var options = {
      url: context.target,
      type: "POST",
      dataType: "json"
    };

    var completed = function ( result ) {
      //TODO: validate result
      Sitecore.Speak.module( "pipelines" ).get( "ServerInvoke" ).execute( {
        data: result,
        model: context.model
      } );
    };
    //jQuery won't be here
    //TODO: replace with something more robut

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( options.type, options.url, true );

    if ( options.type.toLowerCase() === "post" ) {
      xmlHttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
    }

    var token = Sitecore.Speak.utils.security.antiForgery.getAntiForgeryToken();

    var data = {};
    data[token.formKey] = token.value;
    
    xmlHttp.send( data );

    xmlHttp.onreadystatechange = function () {
      if ( xmlHttp.readyState === 4 ) {
        if ( xmlHttp.status === 200 ) {
          completed( JSON.parse( xmlHttp.responseText ) );
        } else {
          console.log( "Error: " + xmlHttp.responseText );
        }
      }
    };
  }
};

module.exports = serverClick;
},{"../../utils/index":14}],9:[function(_dereq_,module,exports){
var utils = _dereq_( "../../utils/index" );

var triggerEvent = {
  priority: 4000,
  execute: function ( context ) {
    var app = context.app,
      target = context.target,
      args = {};

    if ( context.handler !== "trigger" ) {
      return;
    }

    if ( !app ) {
      throw new Error( "An application is a required when triggering events" );
    }

    var n = target.indexOf( "(" );
    if ( n >= 0 ) {
      if ( target.indexOf( ")", target.length - 1 ) === -1 ) {
        throw "Missing ')'";
      }
      var parameters = target.substr( n + 1, target.length - n - 2 );
      args = JSON.parse( parameters );
      target = target.substr( 0, n );
    }

    args.sender = context.control;

    app.trigger( target, args );
  }
};

module.exports = triggerEvent;
},{"../../utils/index":14}],10:[function(_dereq_,module,exports){
var Pipeline = _dereq_( "../../model/pipeline" ),
  invokePipeline = new Pipeline( "Invoke" );

invokePipeline.add( _dereq_( "./1000-HandleJavascript" ) );
invokePipeline.add( _dereq_( "./2000-HandleCommand" ) );
invokePipeline.add( _dereq_( "./3000-ServerClick" ) );
invokePipeline.add( _dereq_( "./4000-TriggerEvent" ) );

module.exports = invokePipeline;
},{"../../model/pipeline":4,"./1000-HandleJavascript":6,"./2000-HandleCommand":7,"./3000-ServerClick":8,"./4000-TriggerEvent":9}],11:[function(_dereq_,module,exports){
var updateModel = {
  priority: 1000,
  execute: function ( context ) {
    var viewModel = context.data.ViewModel;
    if ( viewModel != null ) {
      ko.mapping.fromJS( viewModel, {}, context.model );
    }
  }
};

module.exports = updateModel;
},{}],12:[function(_dereq_,module,exports){
var Pipeline = _dereq_( "../../model/pipeline" ),
  serverInvokePipeline = new Pipeline( "ServerInvoke" );

serverInvokePipeline.add( _dereq_( "./1000-UpdateModel" ) );

module.exports = serverInvokePipeline;
},{"../../model/pipeline":4,"./1000-UpdateModel":11}],13:[function(_dereq_,module,exports){
var utils = _dereq_( "./index" );

/**
 * resovle the property name in the global Object
 * @params {propertyName} property we will try to resolve
 * return the value of the property
 */
var resolve = function ( propertyName ) {
  if ( !utils.isString( propertyName ) ) {
    throw "provied a correct Path to resolve";
  }

  var parts = propertyName.split( "." );

  var property = root || window;
  for ( var n = 0; n < parts.length; n++ ) {
    property = property[ parts[ n ] ];
    if ( property == null ) {
      throw "Reference '" + propertyName + "' not found";
    }
  }

  return property;
};

/**
 * getCommand avialable
 * @params {commandName} the command you want to retrieve
 * @returns the command
 */
var getCommand = function ( commandName ) {
  return resolve( commandName );
};

/**
 * execute some command available in the Sitecore.Commands namespace
 * @params {commandName} the name of the command
 * @params {context} the context you want to pass to the command
 */
var executeCommand = function ( commandName, context ) {
  if ( !commandName || !utils.isString( commandName ) ) {
    throw new Error( "cannot execute command without commandName" );
  }

  var command = getCommand( commandName );

  if ( command.canExecute( context ) ) {
    command.execute( context );
  }
};

var command = {
  resolve: resolve,
  getCommand: getCommand,
  executeCommand: executeCommand
};

module.exports = command;
},{"./index":14}],14:[function(_dereq_,module,exports){
/*jshint -W054 */
var toString = Object.prototype.toString;

var utils = {
  lookupIterator: function ( value ) {
    return utils.isFunction( value ) ? value : function ( obj ) {
      return obj[ value ];
    };
  },
  isFunction: function ( obj ) {
    return typeof obj === "function";
  },
  isObject: function ( obj ) {
    return toString.call( obj ) === "[object Object]";
  },
  isNumber: function ( obj ) {
    return toString.call( obj ) === "[object Number]";
  },
  isString: function ( obj ) {
    return ttoString.call( obj ) === "[object String]";
  },
  pluck: function ( obj, key ) {
    return obj.map( function ( value ) {
      return value[ key ];
    } );
  },
  reject: function ( obj, iterator, context ) {
    return obj.filter( function ( value, index, list ) {
      return !iterator.call( context, value, index, list );
    } );
  },
  sortBy: function ( obj, value, context ) {
    var iterator = utils.lookupIterator( value );
    return utils.pluck( obj.map( function ( value, index, list ) {
      return {
        value: value,
        index: index,
        criteria: iterator.call( context, value, index, list )
      };
    } ).sort( function ( left, right ) {
      var a = left.criteria;
      var b = right.criteria;
      if ( a !== b ) {
        if ( a > b || a === void 0 ) {
          return 1;
        }

        if ( a < b || b === void 0 ) {
          return -1;
        }
      }
      return left.index - right.index;
    } ), "value" );
  },
  executeContext: function ( target, context ) {
    //First we check if you want to existing something in the app.
    var targets = target.split( "." ),
      firstPath = targets[ 0 ];

    if ( firstPath === "this" ) {
      new Function( target ).call( context.control.model );
    } else if ( context.app && firstPath === "app" ) {
      var ex = target.replace( "app", "this" );
      new Function( ex ).call( context.app );
    } else {
      /*!!! dangerous zone !!!*/
      new Function( target )();
    }
  }
};

module.exports = utils;
},{}],15:[function(_dereq_,module,exports){
var type = _dereq_( "./ises/type" ),
  is = {
    a: {},
    an: {},
    not: {
      a: {},
      an: {}
    }
  };

var ises = {
  "arguments": [ "arguments", type( "arguments" ) ],
  "array": [ "array", type( "array" ) ],
  "boolean": [ "boolean", type( "boolean" ) ],
  "date": [ "date", type( "date" ) ],
  "function": [ "function", "func", "fn", type( "function" ) ],
  "null": [ "null", type( "null" ) ],
  "number": [ "number", "integer", "int", type( "number" ) ],
  "object": [ "object", type( "object" ) ],
  "regexp": [ "regexp", type( "regexp" ) ],
  "string": [ "string", type( "string" ) ],
  "undefined": [ "undefined", type( "undefined" ) ],
  "empty": [ "empty", _dereq_( "./ises/empty" ) ],
  "nullorundefined": [ "nullOrUndefined", "nullorundefined", _dereq_( "./ises/nullorundefined" ) ],
  "guid": [ "guid", _dereq_( "./ises/guid" ) ]
}

Object.keys( ises ).forEach( function ( key ) {

  var methods = ises[ key ].slice( 0, ises[ key ].length - 1 ),
    fn = ises[ key ][ ises[ key ].length - 1 ];

  methods.forEach( function ( methodKey ) {
    is[ methodKey ] = is.a[ methodKey ] = is.an[ methodKey ] = fn;
    is.not[ methodKey ] = is.not.a[ methodKey ] = is.not.an[ methodKey ] = function () {
      return fn.apply( this, arguments ) ? false : true;
    }
  } );

} );

exports = module.exports = is;
exports.type = type;
},{"./ises/empty":16,"./ises/guid":17,"./ises/nullorundefined":18,"./ises/type":19}],16:[function(_dereq_,module,exports){
var type = _dereq_("../type");

module.exports = function ( value ) {
  var empty = false;

  if ( type( value ) === "null" || type( value ) === "undefined" ) {
    empty = true;
  } else if ( type( value ) === "object" ) {
    empty = Object.keys( value ).length === 0;
  } else if ( type( value ) === "boolean" ) {
    empty = value === false;
  } else if ( type( value ) === "number" ) {
    empty = value === 0 || value === -1;
  } else if ( type( value ) === "array" || type( value ) === "string" ) {
    empty = value.length === 0;
  }

  return empty;

};
},{"../type":21}],17:[function(_dereq_,module,exports){
var guid = _dereq_( "sc-guid" );

module.exports = function ( value ) {
  return guid.isValid( value );
};
},{"sc-guid":20}],18:[function(_dereq_,module,exports){
module.exports = function ( value ) {
	return value === null || value === undefined || value === void 0;
};
},{}],19:[function(_dereq_,module,exports){
var type = _dereq_( "../type" );

module.exports = function ( _type ) {
  return function ( _value ) {
    return type( _value ) === _type;
  }
}
},{"../type":21}],20:[function(_dereq_,module,exports){
var guidRx = "{?[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}}?";

exports.generate = function () {
  var d = new Date().getTime();
  var guid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace( /[xy]/g, function ( c ) {
    var r = ( d + Math.random() * 16 ) % 16 | 0;
    d = Math.floor( d / 16 );
    return ( c === "x" ? r : ( r & 0x7 | 0x8 ) ).toString( 16 );
  } );
  return guid;
};

exports.match = function ( string ) {
  var rx = new RegExp( guidRx, "g" ),
    matches = ( typeof string === "string" ? string : "" ).match( rx );
  return Array.isArray( matches ) ? matches : [];
};

exports.isValid = function ( guid ) {
  var rx = new RegExp( guidRx );
  return rx.test( guid );
};
},{}],21:[function(_dereq_,module,exports){
var toString = Object.prototype.toString;

module.exports = function ( val ) {
  switch ( toString.call( val ) ) {
  case '[object Function]':
    return 'function';
  case '[object Date]':
    return 'date';
  case '[object RegExp]':
    return 'regexp';
  case '[object Arguments]':
    return 'arguments';
  case '[object Array]':
    return 'array';
  }

  if ( val === null ) return 'null';
  if ( val === undefined ) return 'undefined';
  if ( val === Object( val ) ) return 'object';

  return typeof val;
};
},{}],22:[function(_dereq_,module,exports){
var is = _dereq_("sc-is");

module.exports = {
    is: _dereq_("./utils/is"),
    string: _dereq_("./utils/string"),
    object: _dereq_("./utils/object"),
    array: _dereq_("./utils/array"),
    url: _dereq_("./utils/url"),
    function: _dereq_("./utils/function"),
    async: _dereq_("./utils/async"),
    date: _dereq_("./utils/date")
};
},{"./utils/array":23,"./utils/async":24,"./utils/date":25,"./utils/function":26,"./utils/is":27,"./utils/object":29,"./utils/string":30,"./utils/url":31,"sc-is":15}],23:[function(_dereq_,module,exports){
var is = _dereq_( "sc-is" );
var arrayProto = Array.prototype;

var toArray = function( arrayLike ) {
        var array = [],
            i = arrayLike.length >>> 0; // ensure that length is an Uint32
        while ( i-- ) {
            array[ i ] = arrayLike[ i ];
        }
        return array;
    },
    contains = function( array, obj ) {
        var i = array.length;
        while ( i-- ) {
            if ( array[ i ] === obj ) {
                return true;
            }
        }
        return false;
    },
    flatten = function( all, shallow ) {

        shallow = shallow || [];

        if ( !is.an.array( all ) ) {
            return all;
        }

        all.forEach( function( input ) {
            if ( is.an.array( input ) ) {

                var child = flatten( input );

                if ( is.an.array( child ) ) {
                    shallow = arrayProto.concat( shallow, child );
                } else {
                    shallow.push( input );
                }
            } else {
                shallow.push( input );
            }
        } );

        return shallow;
    },
    find = function( obj, predicate, context ) {
        var result,
            context = context ? context : this;

        obj.forEach( function( value, index ) {
            if ( predicate.call( context, value, index, obj ) ) {
                result = value;
            }
        } );

        return result;
    };

module.exports = {
    /**
     * toArray transform an array-like (DOM) to a real Array
     * @param  {Array-like} arrayLike result returned by querySelectorAll
     * @return {[Array]} a real array
     */
    toArray: toArray,
    contains: contains,
    flatten: flatten,
    find: find
};
},{"sc-is":15}],24:[function(_dereq_,module,exports){
var native = _dereq_( "./native" ),
    nativeSlice = native.slice;

var doParallel = function( fn ) {
        return function() {
            var args = nativeSlice.call( arguments );
            return fn.apply( null, [ _asyncEach ].concat( args ) );
        };
    },
    only_once = function( fn ) {
        var called = false;
        return function() {
            if ( called ) {
                throw new Error( "Callback was already called." );
            }
            called = true;
            fn.apply( window, arguments );
        };
    },
    _asyncEach = function( arr, iterator, callback ) {
        callback = callback || function() {};
        if ( !arr.length ) {
            return callback();
        }
        var completed = 0;
        arr.forEach( function( x ) {
            iterator( x, only_once( function( err ) {
                if ( err ) {
                    callback( err );
                    callback = function() {};
                } else {
                    completed += 1;
                    if ( completed >= arr.length ) {
                        callback( null );
                    }
                }
            } ) );
        } );
    },
    _asyncMap = function( eachfn, arr, iterator, callback ) {
        var results = [];
        //!!! Verify - wierd !!!
        arr = arr.map( function( x, i ) {
            return {
                index: i,
                value: x
            };
        } );
        eachfn( arr, function( x, callback ) {
            iterator( x.value, function( err, v ) {
                results[ x.index ] = v;
                callback( err );
            } );
        }, function( err ) {
            callback( err, results );
        } );
    };

module.exports = {
    each: _asyncEach,
    map: doParallel( _asyncMap )
};
},{"./native":28}],25:[function(_dereq_,module,exports){
var is = _dereq_("./is"),
  ensureTwoDigits = function(number) {
    return (number < 10) ? "0" + number.toString() : number.toString();
  };
var formats = {
  mmss: {
    expression: "(\\W|^)mm(\\W+s{1,2}\\W|\\W+s{1,2}$)",
    value: function(date) {
      return ensureTwoDigits(date.getUTCMinutes())
    }
  },
  mss: {
    expression: "(\\W|^)m(\\W+s{1,2}\\W|\\W+s{1,2}$)",
    value: function(date) {
      return date.getUTCMinutes().toString();
    }
  },
  hmm: {
    expression: "(\\Wh{1,2}\\W+|^h{1,2}\\W+)mm(\\W|$)",
    value: function(date) {
      return ensureTwoDigits(date.getUTCMinutes());
    }
  },
  hm: {
    expression: "(\\Wh{1,2}\\W+|^h{1,2}\\W+)m(\\W|$)",
    value: function(date) {
      return date.getUTCMinutes().toString();
    }
  },
  ms: {
    expression: "(\\Wss\\W|^ss\\W)00(\\W|$)",
    value: function(date) {
      return ensureTwoDigits(date.getUTCMilliseconds())
    }
  },
  ampm: {
    expression: "(\\W|^)AM/PM(\\W|$)",
    value: function(date) {
      return ((date.getUTCHours() >= 12) ? "PM" : "AM");
    }
  },
  ap: {
    expression: "(\\W|^)A/P(\\W|$)",
    value: function(date) {
      return ((date.getUTCHours() >= 12) ? "P" : "A");
    }
  },
  yyyy: {
    expression: "(\\W|^)yyyy(\\W|$)",
    value: function(date) {
      return date.getUTCFullYear().toString();
    }
  },
  yy: {
    expression: "(\\W|^)yy(\\W|$)",
    value: function(date) {
      return ensureTwoDigits(date.getUTCFullYear() % 100);
    }
  },
  mm: {
    expression: "(\\W|^)mm(\\W|$)",
    value: function(date) {
      return ensureTwoDigits(date.getUTCMonth() + 1);
    }
  },
  m: {
    expression: "(\\W|^)m(\\W|$)",
    value: function(date) {
      return (date.getUTCMonth() + 1).toString();
    }
  },
  dd: {
    expression: "(\\W|^)dd(\\W|$)",
    value: function(date) {
      return ensureTwoDigits(date.getUTCDate());
    }
  },
  d: {
    expression: "(\\W|^)d(\\W|$)",
    value: function(date) {
      return date.getUTCDate().toString();
    }
  },
  hh: {
    expression: "(\\W|^)hh(\\W|$)",
    value: function(date) {
      return ensureTwoDigits(date.getUTCHours());
    }
  },
  h: {
    expression: "(\\W|^)h(\\W|$)",
    value: function(date) {
      return (date.getUTCHours() > 12) ? (date.getUTCHours() - 12).toString() : ((date.getUTCHours() == 0) ? 12 : date.getUTCHours()).toString();
    }
  },
  ss: {
    expression: "(\\W|^)ss(\\W|$)",
    value: function(date) {
      return ensureTwoDigits(date.getUTCSeconds());
    }
  },
  s: {
    expression: "(\\W|^)s(\\W|$)",
    value: function(date) {
      return date.getUTCSeconds().toString();
    }
  }
};

var dateHelper = {
  //TODO: Not sure about that logic, just trying to port it from 1.1
  toISO: function(date) {

    if (!is.a.date(date)) {
      return false;
    }

    var y = ensureTwoDigits(date.getFullYear()),
      m = ensureTwoDigits(date.getMonth() + 1),
      d = ensureTwoDigits(date.getDate());

    return y + m + d;
  },
  parseISO: function(dateString) {
    var year,
      month,
      day,
      hours,
      minutes,
      seconds;

    if (!is.a.string(dateString)) {
      return null;
    }

    year = parseInt(dateString.substr(0, 4), 10);
    // month should start from 0 !!!
    // minus one in order to have the right month
    month = parseInt(dateString.substr(4, 2), 10) - 1;
    day = parseInt(dateString.substr(6, 2), 10);

    if (dateString.indexOf("T") !== 8) {
      return new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
    }

    hours = parseInt(dateString.substr(9, 2), 10);
    minutes = parseInt(dateString.substr(11, 2), 10);
    seconds = parseInt(dateString.substr(13, 2), 10);

    return new Date(Date.UTC(year, month, day, hours, minutes, seconds));
  },
  isISO: function(date) {
    var dateValue;

    if (is.a.date(date)) {
      date = date.toString();
    }

    if (!is.a.string(date)) {
      return false;
    }

    // Removes the ticks
    if (date.charAt(15) === ":") {
      date = date.substr(0, 15);
    }

    if (!(date.length == 8 || date.length == 15)) {
      return false;
    }

    dateValue = this.parseISO(date);

    if (is.a.date(dateValue)) {
      // it is a date
      if (isNaN(dateValue.getYear())) { // d.valueOf() could also work
        return false;
      }
      return true;
    }

    return false;
  },
  toStringWithFormat: function(value, format) {
    if (this.isISO(value)) {
      try {
        var date = this.parseISO(value);

        for (var step in formats) {
          var find = (formats[step]) ? formats[step].expression : "";
          var replace = "$1" + formats[step].value(date) + "$2";
          if (find != "") {
            var expression = new RegExp(find, 'g');

            format = format.replace(expression, replace);
          }
        }

        return format;
      } catch (e) {
        return false;
      }
    }
    return false;
  }
};

module.exports = dateHelper;
},{"./is":27}],26:[function(_dereq_,module,exports){
var once = function( func ) {

    var ran = false,
        memo;

    return function() {
        if ( ran ) {
            return memo;
        }
        ran = true;
        memo = func.apply( this, arguments );
        func = null;
        return memo;
    };
};

module.exports = {
    once: once
};
},{}],27:[function(_dereq_,module,exports){
var is = _dereq_( "sc-is" );

var isCapitalize = function( str ) {
    return str.charAt( 0 ) === str.charAt( 0 ).toUpperCase();
};

is.capitalize = isCapitalize;

module.exports = is;
},{"sc-is":15}],28:[function(_dereq_,module,exports){
var arrayProto = Array.prototype;

module.exports = {
    arrayProto: arrayProto,
    forEach: arrayProto.forEach,
    slice: arrayProto.slice
};
},{}],29:[function(_dereq_,module,exports){
var native = _dereq_( "./native" ),
    navtiveForEach = native.forEach,
    nativeSlice = native.slice;

var extend = function( obj ) {
        navtiveForEach.call( nativeSlice.call( arguments, 1 ), function( source ) {
            if ( source ) {
                for ( var prop in source ) {
                    if ( source.hasOwnProperty( prop ) ) {
                        obj[ prop ] = source[ prop ];
                    }
                }
            }
        } );
        return obj;
    },
    inherits = function( base, init, proto ) {
        var child = function() {
            return base.apply( this, arguments );
        };
        extend( child, base );

        var Surrogate = function() {
            this.constructor = child;
        };

        Surrogate.prototype = base.prototype;
        child.prototype = new Surrogate();

        child.prototype.initialize = init || base.prototype.initialize || function() {};
        if ( proto ) {
            for ( var i in proto ) {
                if ( proto.hasOwnProperty( i ) ) {
                    child.prototype[ i ] = proto[ i ];
                }
            }
        }

        child.__super__ = base.prototype;

        return child;

    },
    defaults = function( obj ) {
        nativeSlice.call( arguments, 1 ).forEach( function( source ) {
            if ( source ) {
                for ( var prop in source ) {
                    if ( obj[ prop ] === void 0 ) {
                        obj[ prop ] = source[ prop ];
                    }
                }
            }
        } );
        return obj;
    },
    extendProto = function( obj, proto ) {
        for ( var p in proto ) {
            if ( proto.hasOwnProperty( p ) ) {
                obj.prototype[ p ] = proto[ p ];
            }
        }
        return obj;
    },
    flattenObject = function( obj ) {
        var result = [];

        for ( var app in obj ) {
            if ( obj.hasOwnProperty( app ) ) {
                result.push( obj[ app ] );
            }
        }
        return result;
    };

module.exports = {
    extend: extend,
    inherits: inherits,
    defaults: defaults,
    extendProto: extendProto,
    flatten: flattenObject
};
},{"./native":28}],30:[function(_dereq_,module,exports){
var idCounter = 0;

var capitalize = function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    lowerFirstLetter = function(str) {
        return str.charAt(0).toLowerCase() + str.slice(1);
    },
    uniqueId = function(prefix) {
        var id = ++idCounter + "";
        return prefix ? prefix + id : id;
    };

module.exports = {
    capitalize: capitalize,
    lowerFirstLetter: lowerFirstLetter,
    uniqueId: uniqueId
};
},{}],31:[function(_dereq_,module,exports){
var getParameterByName = function( name ) {
    name = name.replace( /[\[]/, "\\[" ).replace( /[\]]/, "\\]" );

    var regexS = "[\\?&]" + name + "=([^&#]*)",
        regex = new RegExp( regexS ),
        results = regex.exec( window.location.href );

    if ( results == null ) {
        return "";
    } else {
        return decodeURIComponent( results[ 1 ].replace( /\+/g, " " ) );
    }
};

module.exports = {
    parameterByName: getParameterByName
};
},{}],32:[function(_dereq_,module,exports){
/* jshint forin:false,  loopfunc: true  */

/**
 * This is a module extracted from the backboneJS source code
 * but works without Underscore and backbone
 */
var idCounter = 0;

var _uniqueId = function () {
  var id = ++idCounter + "";
  return prefix ? prefix + id : id;
};

var eventSplitter = /\s+/;

var triggerEvents = function ( events, args ) {
  var ev, i = -1,
    l = events.length,
    a1 = args[ 0 ],
    a2 = args[ 1 ],
    a3 = args[ 2 ];

  switch ( args.length ) {
  case 0:
    while ( ++i < l ) {
      ( ev = events[ i ] ).callback.call( ev.ctx );
    }
    return;
  case 1:
    while ( ++i < l ) {
      ( ev = events[ i ] ).callback.call( ev.ctx, a1 );
    }
    return;
  case 2:
    while ( ++i < l ) {
      ( ev = events[ i ] ).callback.call( ev.ctx, a1, a2 );
    }
    return;
  case 3:
    while ( ++i < l ) {
      ( ev = events[ i ] ).callback.call( ev.ctx, a1, a2, a3 );
    }
    return;
  default:
    while ( ++i < l ) {
      ( ev = events[ i ] ).callback.apply( ev.ctx, args );
    }
  }
};

var eventsApi = function ( obj, action, name, rest ) {
  if ( !name ) {
    return true;
  }

  if ( typeof name === "object" ) {
    for ( var key in name ) {
      obj[ action ].apply( obj, [ key, name[ key ] ].concat( rest ) );
    }
    return false;
  }
  if ( eventSplitter.test( name ) ) {
    var names = name.split( eventSplitter );
    for ( var i = 0, l = names.length; i < l; i++ ) {
      obj[ action ].apply( obj, [ names[ i ] ].concat( rest ) );
    }
    return false;
  }

  return true;
};

/**
 * @class Events
 */
var Events = {
  /**
   * On
   * @method on
   * @static
   */
  on: function ( name, callback, context ) {
    if ( !eventsApi( this, "on", name, [ callback, context ] ) || !callback ) {
      return this;
    }

    this._events || ( this._events = {} );

    var events = this._events[ name ] || ( this._events[ name ] = [] );

    events.push( {
      callback: callback,
      context: context,
      ctx: context || this
    } );

    return this;
  },
  /** Once
   * @method once
   * @static
   */
  once: function ( name, callback, context ) {
    if ( !eventsApi( this, "once", name, [ callback, context ] ) || !callback ) {
      return this;
    }

    var self = this;

    var once = _.once( function () {
      self.off( name, once );
      callback.apply( this, arguments );
    } );
    once._callback = callback;

    return this.on( name, once, context );
  },
  /** 
   * Off
   * @method off
   * @static
   */
  off: function ( name, callback, context ) {
    var retain, ev, events, names, i, l, j, k;

    if ( !this._events || !eventsApi( this, "off", name, [ callback, context ] ) ) {
      return this;
    }

    if ( !name && !callback && !context ) {
      this._events = {};
      return this;
    }
    names = name ? [ name ] : Object.keys( this._events );

    for ( i = 0, l = names.length; i < l; i++ ) {
      name = names[ i ];
      if ( events = this._events[ name ] ) {
        this._events[ name ] = retain = [];
        if ( callback || context ) {
          for ( j = 0, k = events.length; j < k; j++ ) {
            ev = events[ j ];
            if ( ( callback && callback !== ev.callback && callback !== ev.callback._callback ) ||
              ( context && context !== ev.context ) ) {
              retain.push( ev );
            }
          }
        }
        if ( !retain.length ) {
          delete this._events[ name ];
        }
      }
    }

    return this;
  },
  /** 
   * Trigger events
   * @method trigger
   * @static
   */
  trigger: function ( name ) {
    if ( !this._events ) {
      return this;
    }

    var args = Array.prototype.slice.call( arguments, 1 );

    if ( !eventsApi( this, "trigger", name, args ) ) {
      return this;
    }

    var events = this._events[ name ];
    var allEvents = this._events.change;
    if ( events ) {
      triggerEvents( events, args );
    }
    if ( allEvents ) {
      triggerEvents( allEvents, arguments );
    }
    return this;
  },
  stopListening: function ( obj, name, callback ) {
    var listeningTo = this._listeningTo;

    if ( !listeningTo ) {
      return this;
    }

    var remove = !name && !callback;
    if ( !callback && typeof name === "object" ) {
      callback = this;
    }

    if ( obj ) {
      ( listeningTo = {} )[ obj._listenId ] = obj;
    }
    for ( var id in listeningTo ) {
      obj = listeningTo[ id ];
      obj.off( name, callback, this );
      if ( remove || Object.keys( obj._events ) === 0 ) {
        delete this._listeningTo[ id ];
      }
    }
    return this;
  }
};
/*
 * Credit to Backbone source code, please find it here:
 * http://backbonejs.org/docs/backbone.html
 */

var listenMethods = {
  /**
   * listenTo
   * @method listenTo
   * @static
   */
  listenTo: "on",
  /** 
   * listenToOnce
   * @method listenToOnce
   * @static
   */
  listenToOnce: "once"
};

//TODO: verify if implemtnation and method are well defined, see backbone source code
for ( var i in listenMethods ) {
  var implementation = listenMethods[ i ],
    method = i;

  Events[ method ] = function ( obj, name, callback ) {
    var listeningTo = this._listeningTo || ( this._listeningTo = {} );
    var id = obj._listenId || ( obj._listenId = _uniqueId( "l" ) );
    listeningTo[ id ] = obj;
    if ( !callback && typeof name === "object" ) {
      callback = this;
    }
    obj[ implementation ]( name, callback, this );
    return this;
  };
}

module.exports = Events;
},{}],33:[function(_dereq_,module,exports){
var TYPE = "data-sc-component",
    ID = "data-sc-id",
    APP_KEY = "data-sc-app",
    SCRIPT = "data-sc-require",
    ATTR_PAGECODE = "script[type='text/x-sitecore-pagecode']",
    TEMPLATE = "data-sc-template",
    PROPERTIES = "data-sc-properties",
    PRESENTER = "data-sc-presenter",
    PLUGIN_ID = "data-sc-pluginId",
    NESTED = "data-sc-hasnested",
    COMPONENT = "data-sc-id",
    ATTR_PLUGIN = "script[type='text/x-sitecore-pluginscript']";

module.exports = {
    TYPE: TYPE,
    ID: ID,
    SCRIPT: SCRIPT,
    ROOTSTATICURL: "",
    TEMPLATE: TEMPLATE,
    PROPERTIES: PROPERTIES,
    PRESENTER: PRESENTER,
    APP_KEY: APP_KEY,
    NESTED: NESTED,
    ATTR_COMPONENT: "[" + COMPONENT + "]",
    ATTR_TYPE: "[" + TYPE + "]",
    ATTR_ID: "[" + ID + "]",
    ATTR_APP: "[" + APP_KEY + "]",
    ATTR_SCRIPT: "[" + SCRIPT + "]",
    ATTR_PAGECODE: ATTR_PAGECODE,
    ATTR_PLUGIN: ATTR_PLUGIN,
    PLUGIN_ID: PLUGIN_ID,
    /*ATTR_PAGECODE_ID: "[" + PAGECODE_ID + "]",*/
    deferred: false,
    useBundle: false,
    cloak: "data-sc-cloak",
    defaultPresenter: "scComponentPresenter",
    lifeCycle: [ "initialize", "initialized", "beforeRender", "render", "afterRender" ]
};

},{}],34:[function(_dereq_,module,exports){
module.exports = function( Sitecore ) {
  var eventsHandler = {
    handleEvent: function ( invocation, component ) {

      if (!invocation) {
        throw new Error( "You must pass an invocation" );
      }

      var index = invocation.indexOf( ":" );

      if ( index <= 0 ) {
        throw new Error( "Invocation is malformed (missing 'handler:')" );
      }

      var context = {
          control: component,
          app: component.app,
          handler: invocation.substr( 0, index ),
          target: invocation.substr( index + 1 )
      };

      Sitecore.module( "pipelines" ).get( "Invoke" ).execute( context );
    }
  };

  return eventsHandler;
};

},{}],35:[function(_dereq_,module,exports){
/* jshint forin:false */
var baseProperty = _dereq_( "../model/property" ),
    basePropertyPrototype = baseProperty.prototype,
    scUtils = _dereq_( "sc-utils" );

var make = function( propertyDef ) {
    var property = function( ) {
        baseProperty.apply( this, arguments );
    };

    if ( scUtils.is.a.function( propertyDef ) ) {
        property = function( ) {
            baseProperty.apply( this, arguments );
            propertyDef.apply( this, arguments );
        };
    }

    for ( var i in basePropertyPrototype ) {
        property.prototype[ i ] = basePropertyPrototype[ i ];
    }

    for ( var j in propertyDef ) {
        property.prototype[ j ] = propertyDef[ j ];
    }

    return property;
};

module.exports = {
    make: make
};

},{"../model/property":48,"sc-utils":22}],36:[function(_dereq_,module,exports){
var inheritante = _dereq_("../utils/inheritance"),
    appHelper = _dereq_("../utils/app"),
    Events = _dereq_("speakevent"),
    utils = _dereq_("sc-utils");

module.exports = function(pageCodeStore, configureInject, PageCode) {

    return {
        createApplication: function(app, start) {

            if (app.registered) {
                return;
            }

            var domID = utils.string.uniqueId(),
                injectMethod = configureInject.setupInjectMethod(start),
                pageCode = pageCodeStore.find(app.key),
                P;

            if (pageCode) {

                //get deps from requirejs. execute the function and use the object returned.
                var deps = pageCode.deps,
                    args = [];

                if (deps && utils.is.a.function(pageCode)) {
                    deps.forEach(function(d) {
                        args.push(requirejs(d));
                    });
                }

                if (utils.is.a.function(pageCode) && Object.keys(pageCode.prototype).length === 0) {
                    pageCode = pageCode.apply(app, args);
                }


                P = inheritante.wrap(PageCode, pageCode);
                app = new P(app);
            }

            utils.object.extend(app, appHelper);
            utils.object.extend(app, Events);

            app.inject = function() {
                injectMethod.apply(this, arguments);
            };

            if (app.el) {
                app.el.__domID = domID;
                app.__domID = domID;
            }

            app.registered = true;
            return app;
        }
    };
};

},{"../utils/app":57,"../utils/inheritance":62,"sc-utils":22,"speakevent":32}],37:[function(_dereq_,module,exports){
var inheritanceUtils = _dereq_( "../utils/inheritance" );

var ComponentFactory = function( basePresenter ) {

    var buildPresenter = function( base, presenterDefinition ) {

        var ctor = ( {}.constructor !== presenterDefinition.constructor ) ? presenterDefinition.constructor : base.prototype.constructor,
            basePrototype = base.prototype;

        var Presenter = ( function( ctor ) {
            return function( ) {
                ctor.apply( this, arguments );
            };
        } )( ctor );

        if ( presenterDefinition.constructor !== {}.constructor ) { //the presenter has its own CTRO, we take it
            //Presenter = presenterDefinition.constructor;
            if ( presenterDefinition.prototype ) {
                basePrototype = presenterDefinition.prototype;
            }
        }

        for ( var i in basePrototype ) {
            if ( basePrototype.hasOwnProperty( i ) && presenterDefinition[ i ] /*&& i !== "constructor" -- constructor won't be there*/ ) {
                Presenter.prototype[ i ] = presenterDefinition[ i ];
            } else {
                Presenter.prototype[ i ] = basePrototype[ i ];
            }
        }

        return Presenter;
    };

    return {
        /**
         * Make a Component class that can be instantiated
         * the same way as the base Component
         * @param  {Object} adapt an adatper object
         * @param  {Def} def definition of the Object
         * @return {Class} a custom Component class
         */
        make: function( presenter, componentDefinition, el ) {
            var Presenter,
                presenterDefinition = presenter || basePresenter.prototype;

            if ( presenterDefinition.make ) {
                //delegate construction to present
                return presenterDefinition.make( componentDefinition, el );
            }

            Presenter = buildPresenter( basePresenter, presenterDefinition );

            return inheritanceUtils.wrap( Presenter, componentDefinition );
        }
    };
};

module.exports = ComponentFactory;

},{"../utils/inheritance":62}],38:[function(_dereq_,module,exports){
var Store = _dereq_( "../model/store" );

var adapter, plugin, component, pageCode, app;

var storeFactory = {
  /**
   * Create all the stores for SPEAK
   * @return {Object} an object with all the store and a general build function
   */
  create: function () {
    presenter = new Store( "presenters" );
    plugin = new Store( "plugins" );
    component = new Store( "components" );
    pageCode = new Store( "pagecodes" );
    app = new Store( "applications" );
    propertyType = new Store( "properties" );
    definition = new Store("definitions");

    return {
      presenter: presenter,
      plugin: plugin,
      component: component,
      pageCode: pageCode,
      definition: definition,
      app: app,
      propertyType: propertyType,
      markAsRegistered: function () {
         app.markAsRegistered( );
      },
      markAsLoaded: function(){
        app.markAsLoaded( );
        component.markAsLoaded( );
        pageCode.markAsLoaded( );
        plugin.markAsLoaded( );
        definition.markAsLoaded();
      },
      build: function ( elementsInPage ) {

        app.build( elementsInPage.applications );
        component.build( elementsInPage.components );
        pageCode.build( elementsInPage.pageCodes );
        plugin.build( elementsInPage.plugins );
      }
    };
  }
};

module.exports = storeFactory;
},{"../model/store":49}],39:[function(_dereq_,module,exports){
(function (global){
var scUtils = _dereq_("sc-utils"),
    utils = _dereq_("./utils"),
    modulejs = _dereq_("modulejs"),
    conf = _dereq_("./conf"),
    DOM = _dereq_("./utils/DOM"),
    Events = _dereq_("speakevent"),
    /**
     * The sitecore.speak global namespace object
     *
     * You can configure the sitecore.speak global object with an enigmatic Global variable
     *
     * ```
     * __speak_config = {
     *     //Required, point to the loader you want to use
     *     loader: function(deps, callback) {
     *       //deps is an array of dependencies
     *       //callback needs to be called when the deps are all loaded
     *     },
     *     //Required, template is the Template engine you want to use with SPEAK
     *     template: Handlebar,
     *     //Optional, set if the init function needs to be manualy set
     *     deferred: false,
     * }
     * ```
     * @class sitecore
     * @uses Events
     **/
    speak = {};

modulejs.attach(speak);

//1st: we setup all internal variable used accross modules
var isBrowser = typeof window !== "undefined",
    root = isBrowser ? window : global,
    isInitialized = root.__SPEAK_LOADED,
    config = root.__speak_config || {},
    Handlebars = root.Handlebars,
    deferred = config.deferred,
    lifeCycle = config.lifeCycle || conf.lifeCycle,
    ready = function() {},
    onBeforeParse = function() {},
    onAfterParse = function() {},
    onBeforeLoad = function() {},
    onAfterLoad = function() {},
    bootstrapValues = (isBrowser && config.conf) ? config.conf : [];


var defaultConfig = {
    loader: function(deps, loaded) {
        var flat = scUtils.array.flatten(deps);

        if (flat.length) {
            requirejs(flat, function() {
                loaded.apply(this, arguments);
            });
        } else {
            loaded();
        }
    },
    template: Handlebars
};

if (isBrowser && !root.console) {
    root.log = function() {};
}

config = scUtils.object.defaults(config, defaultConfig);

var templateEngine = config.template,
    template = _dereq_("./manager/template")(templateEngine),
    //2nd: We setup the loader, the stores, the parsers
    loader = _dereq_("./loader/loader")(config),
    stores = _dereq_("./factory/store").create(),
    parser = _dereq_("./parser/index"),

    //3rd: We setup the baseComponent used by default
    //it needs the pluginManager for later use
    pluginManager = _dereq_("./manager/plugin")(stores.plugin),
    baseComponent = _dereq_("./model/basePresenter")(pluginManager, stores.propertyType),
    baseData = _dereq_("./model/baseModel")(stores.propertyType),
    basePageCode = _dereq_("./model/pageCode")(stores.propertyType),

    //Setup the componentFactory with the baseComponent and the presenterStore for later use
    componentFactory = _dereq_("./factory/component")(baseComponent),

    //Setup the component and application manager with the appropriates store and shared variable
    //we pass isInitialized in order to have access to the public API later inside a Component
    componentManager = _dereq_("./manager/component")(lifeCycle, stores.definition, stores.presenter, bootstrapValues, componentFactory, speak),
    injectMethod = _dereq_("./utils/inject")(loader, parser, stores),
    applicationFactory = _dereq_("./factory/application")(stores.pageCode, injectMethod, basePageCode),
    applicationManager = _dereq_("./manager/app")(stores.app, componentManager.componentPipeline, pluginManager.initializeApplication, applicationFactory);
/**
 * Create the speak.app object, register all the component(s), presenter(s), pageCode(s), plugin(s)
 *
 * @static
 * @async
 * @method init
 * @param {Function} callback
 *
 * @example
 * ```
 * Sitecore.Speak.init( function( tree, apps ) {
 *   //tree will be exposed in sitecore.app
 *   //apps is a flat list of all the applications in the page
 * } );
 * ```
 *
 * If sitecore is not loaded by a AMD Loader, the init function will be called automatically
 *
 * How do I defer the exection ?
 *
 *```
 * window.__speak_config = {
 *   deferred: true,
 * };
 * ```
 */
speak.init = function(callback) {
    if (isInitialized) {
        return;
    }
    isInitialized = true;

    //finding all the components, applications and pagecode in the page
    //build stores based on DOM's Item
    onBeforeParse(speak);
    speak.trigger("beforeParsing");
    var allElements = parser.parse();
    speak.trigger("afterParsing");
    onAfterParse(speak);

    stores.build(allElements);

    onBeforeLoad(speak);
    speak.trigger("beforeLoading");
    //load all the store
    loader.load(stores, function() {
        //when everything gets loaded, we instanciate the components and create the applications
        speak.trigger("afterLoading");
        onAfterLoad(speak);
        stores.markAsLoaded();
        
        applicationManager.start(
            function(tree, flat) {
                if (tree.length === 1) {
                    tree = tree[0];
                }
            
                speak.app = tree;
                speak.applications = flat;

                speak.trigger("apps:loaded", tree);

                if (callback) {
                    callback(tree);
                }
            }
        );
    });
};

/**
 * Template manager that will be used for the speak object
 * @property template
 * @static
 * @type Template
 */
speak.template = template;

speak.isDebug = function() {
    return config.debug || scUtils.url.parameterByName("sc_debug");
};

/**
 * Template engine is exposed to allow extensions
 * @static
 * @property templateEngine
 */
speak.tmpl = template.tmp;
/**
 * Returns a unique Id across the speak object
 * @method uniqueId
 * @static
 * @return {string} UniqueId
 */
speak.uniqueId = scUtils.string.uniqueId;

/**
 * Async library provided by speak
 * @property async
 * @static
 * @return {Object} async API
 */
speak.async = scUtils.async;

/**
 * Attach a scriptfile in the Page and load it
 * @method attachScript
 * @static
 * @async
 */
//sitecore.attach = utils.attachScript;

/**
 * Register your presenter(s)
 * @method presenter
 * @param {String} name The name of your presenter
 * @param {Object} presenter The definition of your presenter
 * @static
 */
speak.presenter = stores.presenter.create.bind(stores.presenter);

speak.presenter({
    name: conf.defaultPresenter
}); //empty presenter

/**
 * Register your plugin(s)
 * @method plugin
 * @param {String} name The name of your plugin
 * @param {Object} plugin The definition of your plugin
 * @static
 */
speak.plugin = stores.plugin.create.bind(stores.plugin);

/**
 * Register your component(s)
 * @method component
 * @param {String} name The name of your component
 * @param {Object} component The definition of your component
 * @static
 */
speak.component = stores.definition.create.bind(stores.definition);

/**
 * Register your pageCode(s)
 * @method pageCode
 * @param {String} name The name of your pageCode
 * @param {Object} pageCode The definition of your pageCode
 * @static
 */
speak.pageCode = function() {
    stores.pageCode.isPageCode = true;
    stores.pageCode.create.apply(stores.pageCode, arguments);
};
/**
 * Expose a propertyType inside an application
 * @method propertyType
 * @static
 */
speak.propertyType = stores.propertyType.create.bind(stores.propertyType);

/**
 * Expose a component inside an application
 * @method exposeComponent
 * @static
 */
speak.exposeComponent = componentManager.exposeComponent;

/**
 * Extending the speak object
 * @method extend
 * @static
 */
speak.extend = scUtils.object.extend;

speak.inherit = _dereq_("./utils/inheritance").inherit;

/**
 * Apply all the pluagins to all the application
 * @method applyPlugins
 * @static
 */
speak.applyPlugins = pluginManager.initializeComponent;

/**
 * See utils, exposed our utility method to the speak object
 * @property utils
 * @static
 */
speak.utils = scUtils.object.extend(scUtils, utils);
speak.utils.Events = Events;

speak.Context = _dereq_("./utils/context");

speak.Pipelines = speak.module("pipelines", _dereq_("sc-pipeline"));

speak.Events = _dereq_("./events/index")(speak);

speak.bindable = function(data) {
    return new baseData(data);
};

scUtils.object.extend(speak, Events);

//start the engine if not deferred
if (isBrowser) {
    //expose to Global object if in browser
    //window.Sitecore = speak;
    DOM.addCloak();
    //be sure wherever the boot file is used,
    //the DOM is constructed and all the components are in the Page
    root.document.onreadystatechange = function() {
        if (!deferred && !isInitialized) {
            speak.init(ready);
        }
    };
}

/**
 * Execute a callback when all the application has been instanciated
 * @method ready
 * @static
 */
speak.ready = function(callback) {
    ready = callback;
};

/**
 * Execute some code before and after the page has been parsed
 * @property parser
 * @static
 */
speak.parser = {
    before: function(callback) {
        onBeforeParse = callback;
    },
    after: function(callback) {
        onAfterParse = callback;
    }
};

/**
 * Execute some code before and after the page has been loaded
 * @property loaded
 * @static
 */
speak.loaded = {
    before: function(callback) {
        onBeforeLoad = callback;
    },
    after: function(callback) {
        onAfterParseLoad = callback;
    }
};

speak.version = _dereq_("./version");

exports = module.exports = speak;

if (isBrowser) {
    window.Sitecore = window.Sitecore || {};
    if (window.Sitecore.Speak) {
        scUtils.object.extend(window.Sitecore.Speak, exports);
    } else {
        window.Sitecore.Speak = exports;
    }
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./conf":33,"./events/index":34,"./factory/application":36,"./factory/component":37,"./factory/store":38,"./loader/loader":40,"./manager/app":41,"./manager/component":42,"./manager/plugin":43,"./manager/template":44,"./model/baseModel":45,"./model/basePresenter":46,"./model/pageCode":47,"./parser/index":52,"./utils":61,"./utils/DOM":55,"./utils/context":59,"./utils/inheritance":62,"./utils/inject":63,"./version":66,"modulejs":2,"sc-pipeline":3,"sc-utils":22,"speakevent":32}],40:[function(_dereq_,module,exports){
var utils = _dereq_( "../utils/index" );

var Loader = function( conf ) {

  var useBundle = conf.useBundle,
    load = conf.loader ? conf.loader : void 0;

  if ( !load ) {
    load = _dereq_( "loaderJS" ).use;
  }

  var loadAssets = function( stores, type, callback ) {
    var componentkeys = stores.component[ type ](),
      pageCodeKeys = stores.pageCode[ type ](),
      presenterStoreKeys = stores.presenter[ type ](),
      pluginStoreKeys = stores.plugin[ type ](),
      definitionStoresKeys = stores.definition[ type ]();
      all = [ ];

    all = all
      .concat( componentkeys )
      .concat( pageCodeKeys )
      .concat( presenterStoreKeys )
      .concat( pluginStoreKeys )
      .concat( definitionStoresKeys );

    if ( all.length === 0 ) {
      return callback();
    }

    if ( type !== "deps" && useBundle ) {
      return load( utils.buildModRequest( all ), function() {
        requirejs( all, callback );
      } );
    }

    load( all, callback );
  };

  return {
    /**
     * load all the appropriate depedencies needed to create all the applications
     * @param  {Object} All the stores
     * @param  {Function} callback called when done
     */
    load: function( stores, callback ) {
      loadAssets( stores, "scripts", function() {
        loadAssets( stores, "deps", callback );
      } );
    }
  };
};

module.exports = Loader;
},{"../utils/index":61,"loaderJS":1}],41:[function(_dereq_,module,exports){
var utils = _dereq_( "../utils/index" ),
  sortByDepth = utils.sortByDepth,
  pageCodeLifeCycle = [ "initialize", "initialized", "render" ],
  scUtils = _dereq_( "sc-utils" );

var AppManager = function( applicationStore, createComponents, applyApplicationPlugin, applicationFactory ) {

  var executeMethod = function( methodName ) {
    return function( app ) {
      var method = app[ methodName ];

      if ( method ) {
        method.call( app );
      }
    };
  };

  var triggerChanged = function( a ) {
    a.trigger( "app:loaded", a );
  };

  var pageCodePipeline = function( apps ) {
    var life = pageCodeLifeCycle.slice( 0 );
    while ( life.length ) {
      var methodName = life.shift();
      apps.forEach( executeMethod( methodName ) );
    }
  };

  return {
    /**
     * Create an application tree which has all the components instantiated
     * @param  {Function} createComponents a Function which will be executed for each Application
     * @param  {Function} applyApplicationPlugin a Function which will be executed after all PageCodes are instantiated
     * @param  {Function} callback called when done
     */
    start: function start( el, callback ) {
      var tree;
      if ( !callback ) {
        callback = el;
        el = void 0;
      }

      var apps = sortByDepth( scUtils.object.flatten( applicationStore.stores ) ),
        exposed = [],
        freshlyCreatedApps = [];

      if ( apps.length > 0 ) {
        apps.forEach( function( app ) {
          if (app.registered) {
            exposed.push( app );
            createComponents( app, app.el );
            applyApplicationPlugin( app );
            return;
          }
          var applicationFreshlyCreated = applicationFactory.createApplication( app, start );
          applicationStore.stores[app.key] = applicationFreshlyCreated;
          freshlyCreatedApps.push(applicationFreshlyCreated);
          exposed.push( applicationFreshlyCreated );
          createComponents( applicationFreshlyCreated, app.el );
          applyApplicationPlugin( applicationFreshlyCreated );
        } );

        tree = utils.createTree( exposed, "key", true);
        
        pageCodePipeline( freshlyCreatedApps );

        freshlyCreatedApps.forEach( function( app ) {
          applyApplicationPlugin( app );
        } );
      }

      callback( tree, exposed );

      freshlyCreatedApps.forEach( function( freshApp ) {
        freshApp.registered = true;
        freshApp.trigger( "app:loaded", freshApp );
      } );
    }
  };
};

module.exports = AppManager;
},{"../utils/index":61,"sc-utils":22}],42:[function(_dereq_,module,exports){
var componentParser = _dereq_("../parser/component"),
    conf = _dereq_("../conf"),
    scUtils = _dereq_("sc-utils"),
    utils = _dereq_("../utils/index");

var ComponentManager = function(lifeCycle, definitionStore, presenterStore, bootValues, componentFactory, _s) {

    var getInitialValue = function(comp, def) {

            var init = comp.properties || {},
                properties = utils.extractProperties(def);

            //set property from the definition
            for (var i in properties) {
                if (properties.hasOwnProperty(i)) {
                    init[i] = properties[i];
                }
            }

            //override properties from the component
            for (var j in comp) {
                if (comp.hasOwnProperty(j)) {
                    init[j] = comp[j];
                }
            }

            return init;
        },
        exposeComp = function(comp, app) {
            //if already registered
            if (comp.el && comp.el.__speak) {
                return;
            }

            var def = definitionStore.find(comp.key) || {},
                initial = getInitialValue(comp, def),
                result,
                domID = scUtils.string.uniqueId(),
                Component;

            //get deps from requirejs. execute the function and use the object returned.
            var deps = def.deps,
                args = [];

            if (deps && scUtils.is.a.function(def)) {
                deps.forEach(function(d) {
                    args.push(requirejs(d));
                });

                def = def.apply(window, args);
            }

            var presenter = presenterStore.find(def.presenter || comp.presenter);

            if (presenter && presenter.make) {
                result = presenter.make(def, comp.el, app, initial);
            } else {
                Component = componentFactory.make(presenter, def, comp.el, app, initial);

                result = new Component(initial, app, comp.el, _s);
            }

            if (comp.el) {
                comp.el.__speak = true;
                comp.el.__domID = domID;
            }

            result.id = comp.id;
            result.__domID = domID;
            result.type = comp.type;
            result.name = comp.name;
            result.el = comp.el;
            result.app = app;
            result.parent = comp.parent;
            result.template = comp.template || comp.id;

            return result;
        },
        executeMethod = function(method, app, isPreInit) {
            return function(c) {
                if (c[method]) {
                    if (isPreInit) {
                        c[method](c);
                    } else {
                        c[method]();
                    }
                }
            };
        },
        initializeComponents = function(components, app) {
            var result = [];

            components.forEach(function(c) {
                var cObject = exposeComp(c, app);

                if (!cObject) {
                    return;
                }

                //remove cloack
                if (cObject.el.hasAttribute(conf.cloak)) {
                    cObject.el.removeAttribute(conf.cloak);
                }

                result.push(cObject);

                if (cObject.parent && !cObject.depricated) {
                    return;
                }

                var current = app[cObject.id];

                if (current) {
                    if (scUtils.is.an.array(current)) {
                        current.push(cObject);
                    } else {
                        app[cObject.id] = [current, cObject];
                    }
                } else {
                    app[cObject.id] = cObject;
                }
            });

            return result;
        };

    return {
        exposeComponent: exposeComp,
        /**
         * Create components for an Application
         * @param  {Application} app application under which you want to create the components
         */
        componentPipeline: function(app, el) {
            if (!el) {
                el = app.el;
            }

            var components = componentParser.parse(el),
                life = lifeCycle.slice(0); //clone to keep lifeCycle clean

            if (!scUtils.array.contains(life, "initialize")) {
                throw new Error("you must have a initialize method in your lifeCycle");
            }

            while (life[0] !== "initialize") {
                var beforeInitMethod = life.shift();
                components.forEach(executeMethod(beforeInitMethod, app, true));
            }

            var componentObjects = initializeComponents(components, app);

            app.components = app.components || [];
            app.components = app.components.concat(componentObjects);

            var tree = utils.createTree(componentObjects, "id", true);
            life.shift();

            while (life.length) {
                var afterInitiMethod = life.shift();
                componentObjects.forEach(executeMethod(afterInitiMethod, app));
            }

            return tree;
        }
    };
};

module.exports = ComponentManager;

},{"../conf":33,"../parser/component":51,"../utils/index":61,"sc-utils":22}],43:[function(_dereq_,module,exports){
var PluginManager = function ( plugins ) {

  return {
    /**
     * Take a component and apply the appropriate plugins
     * @param  {Component} a Component
     */
    initializeComponent: function ( obj ) {
      plugins.each( function ( plugin ) {
        if ( plugin.extendComponent ) {
          plugin.extendComponent( obj );
        }
      } );
    },
    /**
     * Take a Pagecode and apply the appropriate plugins
     * @param  {PageCode} a PageCode
     */
    initializeApplication: function ( obj ) {
      plugins.each( function ( plugin ) {
        if ( plugin.extendApplication ) {
          plugin.extendApplication( obj );
        }
      } );
    }
  };
};

module.exports = PluginManager;
},{}],44:[function(_dereq_,module,exports){
var utils = _dereq_( "../utils/index" );

/**
 * @class Template
 * @constructor
 * @async
 * @param  {Object} Template engine
 * @return {Template} return a Template Object
 */
var template = function ( templateEngine ) {

  if ( !templateEngine ) {
    throw new Error( "Template engine has not been set" );
  }

  var cache = {};

  return {
    /**
     * get a Tempalte from the server and cache it
     * @param  {String}   path       name of the Component
     * @param  {Function} callback   called when done
     */
    get: function ( path, callback ) {
      var template = cache[ path ];
      if ( !template ) {
        utils.xhr( {
          type: "GET",
          url: path,
          cb: function ( data ) {
            cache[ path ] = data;
            return callback( data );
          }
        } );
      } else {
        return callback( template );
      }
    },
    tmp: {
      compile: function () {
        return templateEngine.compile.apply( this, arguments );
      },
      original: templateEngine
    }
  };
};

module.exports = template;
},{"../utils/index":61}],45:[function(_dereq_,module,exports){
var utils = _dereq_("../utils/index"),
    classUtils = _dereq_("../utils/class"),
    extendUtil = _dereq_("../utils/inheritance"),
    Events = _dereq_("../utils/events");

module.exports = function(propertyStore) {
    var BaseModel = window.SpeakBaseModel = function BaseModel(initial) {
        utils.initializeProperties(this, initial);
        this.__parameterTemplates = initial || {};
        this.defineProperties();
    };

    extendUtil.extend(BaseModel.prototype, classUtils(propertyStore));
    extendUtil.extend(BaseModel.prototype, Events);

    return BaseModel;
};

},{"../utils/class":58,"../utils/events":60,"../utils/index":61,"../utils/inheritance":62}],46:[function(_dereq_,module,exports){
var utils = _dereq_("../utils/index"),
    extendUtil = _dereq_("../utils/inheritance"),
    classUtil = _dereq_("../utils/class"),
    Events = _dereq_("../utils/events"),
    DOM = _dereq_("../utils/DOM");

//Component Model needs the pluginManager to be be created
var SetupComponentModel = function(pluginManager, propertyStore) {

    /**
     * Component class
     *
     * @class Component
     * @constructor
     * @param  {initial} initial value
     * @param  {initial} app where the component will be contained
     * @param  {el} the component DOM element
     * @param  {_s} the SPEAK framework
     * @returns {Component}
     */
    var Component = function(initial, app, el, _s) {

    };

    Component.prototype.constructor = function(initial, app, el, _s) {
        this.el = el;
        this._s = _s;
        this.app = app;
        this.id = initial.id;
        this.name = initial.name;
        this.children = [];
        this.parent = initial.parent;
        this.__properties = {};
        this.__parameterTemplates = initial._properties || {};


        utils.initializeProperties(this, initial);

        this.initialize.apply(this, arguments);

        pluginManager.initializeComponent(this);

        this.defineProperties();

        if (this.listen) {
            for (var evtKey in this.listen) {
                if (this.listen.hasOwnProperty(evtKey)) {

                    if (evtKey.indexOf(":$this") === -1) {
                        return;
                    }

                    var evtKeyWithId = evtKey.replace("$this", this.id);

                    this.app.on(evtKeyWithId, this[this.listen[evtKey]], this);
                }
            }
        }
    };

    /**
     * Initialize the component {{#crossLink "Component"}}{{/crossLink}}.
     *div
     * @for  Component
     * @method initialize
     */
    Component.prototype.initialize = function() {};


    /**
     * Call this function when the component is fully initialize
     *
     * @for  Component
     * @method initialized
     */
    Component.prototype.initialized = function() {};

    /**
     * Render the component {{#crossLink "Component"}}{{/crossLink}}.
     *
     * @for  Component
     * @method render
     * @param  {Function} callback a callback
     * @return {Component}            The {{#crossLink "Component"}}{{/crossLink}}
     */
    Component.prototype.render = function(callback) {
        if (!this.hasTemplate) {
            return;
        }

        var html,
            toClient = [],
            self = this,
            template = this.template || this.type || undefined,
            data = (self.serialize) ? self.serialize() : self;

        this._s.template.get(template, function(tmplContent, extendObj) {
            var compiled = self._s.tmpl.compile(tmplContent);

            html = compiled(data);
            if (!html && callback) {
                return callback(html);
            }

            var elements = DOM.createDomElement(html);

            if (elements.length === 1) {
                self.el.appendChild(elements[0]);
            } else {
                console.log("A component must have only one root Element");
            }

            self.el = self.el.firstChild;
            if (self.appendTo) {
                self.appendTo.appendChild(self.el);
            }

            if (callback) {
                return callback(html);
            }
        });

        return this;
    };

    /**
     * Serialize the component {{#crossLink "Component"}}{{/crossLink}}.
     *
     * @for  Component
     * @method serialize
     * @return {JSON}            a JSON representation of the component
     */
    Component.prototype.serialize = function() {
        var result = {};
        for (var i in this) {
            if (i !== "template" && i !== "render" && i !== "serialize" && i !== "placeholder" && i !== "app") {
                var a = this[i];
                if (typeof a !== "function") {
                    result[i] = a;
                }
            }
        }
        return result;
    };

    extendUtil.extend(Component.prototype, classUtil(propertyStore));
    extendUtil.extend(Component.prototype, Events);

    return Component;
};

module.exports = SetupComponentModel;

},{"../utils/DOM":55,"../utils/class":58,"../utils/events":60,"../utils/index":61,"../utils/inheritance":62}],47:[function(_dereq_,module,exports){
var utils = _dereq_( "../utils/index" ),
    classUtils = _dereq_( "../utils/class" ),
    extendUtil = _dereq_( "../utils/inheritance" );

module.exports = function( propertyStore ) {
    /**
     * PageCode class
     *
     * @class PageCode
     * @constructor
     * @param  {app} initial value
     * @returns {PageCode}
     */
    var PageCode = function( app ) {
        utils.initializeProperties( this, app );
        this.__parameterTemplates = {};
        this.defineProperties();
    };

    extendUtil.extend( PageCode.prototype, classUtils( propertyStore ) );
    return PageCode;
};
},{"../utils/class":58,"../utils/index":61,"../utils/inheritance":62}],48:[function(_dereq_,module,exports){
var Property = function Property( initialValue, component, propertyName ) {
  this.propertyName = propertyName;
  this.value = initialValue;
  this.component = component;

  this.initialize.apply( this, arguments );
};

Property.prototype.__type = "Property"; //explicit to avoir dealing with typescript

Property.prototype.initialize = function () {

};

Property.prototype.set = function () {
  throw new Error( "read only property" );
};

Property.prototype.get = function () {
  return this.value;
};

module.exports = Property;
},{}],49:[function(_dereq_,module,exports){
var scUtils = _dereq_( "sc-utils" );

/**
 * Store object is use to keep all the items used by SPEAK
 *
 * @class Store
 * @constructor
 * @param  {String} store name
 * @returns {Store}
 */
var Store = function( name, key ) {
    this.name = name;
    this.key = key || "name";
    this.dependencies = [ ];
    this.stores = {};
};

/**
 * Save the object in the store and get its dependencies
 * @method create
 * @param  {Array} deps an array of dependencies to load for this object
 * @param  {Object} obj  an object
 * @param  {String} name forcing the name of your element
 */
Store.prototype.create = function( deps, obj, name ) {
    var self = this,
        compName = name,
        comp = obj;

    if ( arguments.length === 1 ) {
        if ( scUtils.is.a.string( deps ) ) {
            return this.find( deps );
        }
    }
    if ( arguments.length === 1 ) {
        comp = deps;
        if ( !this.isPageCode || !scUtils.is.a.function( comp ) ) {
            compName = comp.name;
        }
        deps = void 0;
    }

    if ( arguments.length === 2 && !scUtils.is.an.array( deps ) ) {
        comp = deps;
        deps = void 0;
        compName = obj;
    }

    if ( !name && arguments.length === 2 && scUtils.is.an.array( deps ) ) {
        if ( !scUtils.is.a.function( obj ) ) {
            compName = obj.name;
        }
    }

    if ( !name && !compName ) {
        compName = "app";
    }

    this.stores[ compName ] = comp || {};
    this.stores[ compName ].deps = deps;

    if ( scUtils.is.an.array( deps ) ) {
        var depsWithFlag = deps.map(function( dep ){
             return { script: dep, loaded: false };
        });

        this.dependencies.push(depsWithFlag);
    }

    return this.stores[ compName ];
};

Store.prototype.flush = function( ) {
    this.dependencies = [ ];
    this.stores = {};
};

/**
 * find the object in the store based on a name or a function
 * @method find
 * @param  {String} name is a string but can be a function
 * @return {[type]}      the Object found
 */
Store.prototype.find = function( name ) {
    if ( scUtils.is.a.function( name ) ) {
        var result = [ ];
        this.each( function( item ) {
            if ( name( item ) ) {
                result.push( item );
            }
        } );
        return result[ 0 ];
    } else {
        return this.stores[ name ];
    }
};

/**
 * return all the dependencies for this store
 * @method deps
 * @return {Array} array of string
 */
Store.prototype.deps = function( ) {
    var result = [];

    this.dependencies.forEach( function( dependency ) {
        if( scUtils.is.an.array( dependency ) ) {
            dependency.forEach( function( dwithloaded ){
                if( scUtils.is.an.array( dwithloaded ) ) {
                    dwithloaded.forEach(function(definitionFromEl){
                        if( !definitionFromEl.loaded ) {
                            result.push( definitionFromEl.script );
                        }
                    });
                } else {
                    if(!dwithloaded.loaded){
                        result.push( dwithloaded.script );   
                    }
                }
            } );
        } else {
            if(!dependency.loaded) {
                result.push( dependency.script );   
            }
        }
    } );

    return result;
};

/**
 * Method to loop thourgh all the object
 * @method each
 * @param  {Function} func callback to execute for each object in the store
 */
Store.prototype.each = function( func ) {
    for ( var k in this.stores ) {
        if ( this.stores.hasOwnProperty( k ) ) {
            func( this.stores[ k ] );
        }
    }
};

/**
 * Method which returns all the keys in the store
 * @method keys
 * @return {Array} Array of string
 */
Store.prototype.keys = function( ) {
    var keys = Object.keys( this.stores ),
        result = [ ];

    for ( var k in keys ) {
        if ( keys.hasOwnProperty( k ) ) {
            result.push( [ keys[ k ] ] );
        }
    }
    return result;
};


/**
 * Build the store based on an array of element
 * @method build
 * @param  {Array} els An array of DOMElement
 */
Store.prototype.build = function( els ) {
    var self = this;

    els.forEach( function( elementFromStore ) {
        if ( !self.stores[ elementFromStore.key ] ) {
            self.stores[ elementFromStore.key ] = elementFromStore;
            if ( elementFromStore.presenterScript ) {
                var exclude = [ ];
                self.dependencies.forEach( function( depsArray ) {
                    if( scUtils.is.an.array( depsArray ) ) {
                        if( depsArray ) {
                            depsArray.forEach( function( dep ) {
                                var depsLength = elementFromStore.presenterScript.length;
                                for ( var i = 0; i < depsLength; i++ ) {
                                    if ( elementFromStore.presenterScript[ i ] === dep.script ) {
                                        exclude.push( i );
                                    }
                                }
                            } );
                        }
                    } else {
                        var depsLength = elementFromStore.presenterScript.length;
                        for ( var i = 0; i < depsLength; i++ ) {
                            if ( elementFromStore.presenterScript[ i ] === depsArray.script ) {
                                exclude.push( i );
                            }
                        }
                    }
                } );

                exclude.forEach( function( index ) {
                    elementFromStore.presenterScript.splice( index, 1 );
                } );
                
                if ( elementFromStore.presenterScript.length > 0 ) {
                    self.dependencies.push( {
                        loaded: false,
                        script: elementFromStore.presenterScript
                    });
                }
            }
        }
    } );
};

Store.prototype.markAsLoaded = function () {

    for ( var c in this.stores ) {
        if ( this.stores.hasOwnProperty( c ) && this.stores[ c ].script ) {
            this.stores[ c ].scriptLoaded = true;
        }
    }

    this.dependencies.forEach( function( d ) {
        if( scUtils.is.an.array( d ) ) {
            d.forEach( function( dwithloaded ){
                if( scUtils.is.an.array( dwithloaded ) ) {
                    dwithloaded.forEach(function(e){
                        e.loaded = true;
                    });
                } else {
                    dwithloaded.loaded = true;
                }
            } );
        } else {
            d.loaded = true;
        }
    } );
};


/**
 * Return all the scripts needed to load inside the store
 * @method scripts
 * @return {Array} array of link to script
 */
Store.prototype.scripts = function( ) {
    var result = [ ];

    for ( var c in this.stores ) {
        if ( this.stores.hasOwnProperty( c ) && this.stores[ c ].script ) {
            if ( scUtils.is.an.array( this.stores[ c ].script ) ) {
                result = result.concat( this.stores[ c ].script );
            } else {
                result.push( this.stores[ c ].script );
            }
        }
    }
    return result;
};

Store.prototype.markAsRegistered = function () {
    for ( var c in this.stores ) {
        if ( this.stores.hasOwnProperty( c ) ) {
            this.stores[c].registered = true;
        }
    }
};

Store.prototype.getNotRegister = function () {
    var result = {};

    for ( var c in this.stores ) {
        if ( this.stores.hasOwnProperty( c ) ) {
            if(!this.stores[c].registered){
                result[c] = this.stores[c];
            }
        }
    }

    return result;
};


module.exports = Store;
},{"sc-utils":22}],50:[function(_dereq_,module,exports){
var conf = _dereq_( "../conf" ),
  DOMutils = _dereq_( "../utils/DOM" ),
  findApps = DOMutils.findApps,
  getDepth = DOMutils.getDepth,
  findParentApp = DOMutils.findParentApp,
  findNestedApplications = DOMutils.findNestedApplications,
  findPageCode = DOMutils.findPageCode;

var appParser = {
  /**
   * parse the Page to retreive the applications
   * @return {Array} an array of Page Component
   */
  parse: function ( el ) {
    var result = [];

    findApps( el ).forEach( function ( el ) {
      var parent = findParentApp( el ),
        parentKey = void 0,
        pageCode = findPageCode( el );

      if ( parent ) {
        parentKey = parent.getAttribute( conf.APP_KEY ) || "app";
      }

      return result.push( {
        el: el,
        key: el.getAttribute( conf.APP_KEY ) || "app",
        depth: getDepth( el ),
        components: [],
        parent: parentKey,
        pageCode: pageCode
      } );
    } );

    return result;
  }
};

module.exports = appParser;
},{"../conf":33,"../utils/DOM":55}],51:[function(_dereq_,module,exports){
var conf = _dereq_( "../conf" ),
  utils = _dereq_( "../utils/index" ),
  DOMutils = _dereq_( "../utils/DOM" ),
  findComponents = DOMutils.findComponents,
  findParentComponent = DOMutils.findParentComponent,
  getDepth = DOMutils.getDepth;

var compAttributes = function ( el ) {
  var type = el.getAttribute( conf.TYPE ),
    depth = getDepth( el ),
    id = el.getAttribute( conf.ID ),
    parent = findParentComponent( el ),
    script = el.getAttribute( conf.SCRIPT ),
    template = el.getAttribute( conf.TEMPLATE ),
    hasPresenter = el.hasAttribute( conf.PRESENTER ),
    presenterScript = el.getAttribute( conf.PRESENTER ),
    _properties = el.getAttribute( conf.PROPERTIES ),
    hasTemplate = el.hasAttribute( conf.TEMPLATE ),
    deps,
    presenter;

  if(script) {
    script = script.split( "," );//utils.removeFileExtensionIfNeeded( script );
  }

  if ( hasPresenter && presenterScript ) {
    var cleanPresenterPath = utils.removeFileExtensionIfNeeded( presenterScript );
    if( cleanPresenterPath.toLowerCase() !== conf.defaultPresenter.toLowerCase() ) {
      deps = [ cleanPresenterPath ];
    }
    presenter = presenterScript.substring( presenterScript.lastIndexOf( "/" ) + 1, cleanPresenterPath.length );
  }

  if ( !hasPresenter ) {
    if( !script ) {
      return void 0;
    }
    presenter = "SpeakPresenter";
    type = script.join( "," );
  }

  return {
    el: el,
    id: id,
    depth: depth,
    key: type || "generic",
    parent: parent ? parent.getAttribute( conf.ID ) : void 0,
    script: script,
    template: template,
    _properties: _properties ? JSON.parse( _properties ) : void 0,
    hasTemplate: hasTemplate,
    presenter: presenter ? presenter : void 0,
    presenterScript: deps ? deps : void 0
  };
};

var removeUdefined = function ( node ) {
  return node;
};

var componentParser = {
  /**
   * parse an element to retrieve the Components
   * @param  {DOMElement} els optionnal dom element served as root for the search
   * @return {Array} components
   */
  parse: function ( el ) {
    var els = findComponents( el );

    return utils.sortByDepth( els.map( compAttributes ).filter( removeUdefined ) );
  }
};

module.exports = componentParser;
},{"../conf":33,"../utils/DOM":55,"../utils/index":61}],52:[function(_dereq_,module,exports){
var pageCodeParser = _dereq_( "./pageCode" ),
    componentParser = _dereq_( "./component" ),
    applicationParser = _dereq_( "./app" ),
    pluginParser = _dereq_( "./plugin" );

var Parser = {
    /**
     * parse the Page to retreive, components, applications, pageCodes, plugins
     * @return {Object} object wrapping all the element found in the page
     */
    parse: function( el ) {
        var allComponents = componentParser.parse( el ),
            allApplications = applicationParser.parse( el ),
            allPageCodes = pageCodeParser.parse( el ),
            allPlugins = pluginParser.parse( el );

        return {
            components: allComponents,
            applications: allApplications,
            pageCodes: allPageCodes,
            plugins: allPlugins
        };
    }
};

module.exports = Parser;

},{"./app":50,"./component":51,"./pageCode":53,"./plugin":54}],53:[function(_dereq_,module,exports){
var conf = _dereq_("../conf"),
    DOMutils = _dereq_("../utils/DOM"),
    findParentApp = DOMutils.findParentApp,
    findPageCodes = DOMutils.findPageCodes;

var pageCodeParser = {
    /**
     * parse an element to retrieve all the pageCode tags
     * @param  {DOMElement}   els optionnal dom element served as root for the search
     * @return {[DOMElement]} an array of DOMElement
     */
    parse: function(el) {
        var result = [];

        findPageCodes(el).forEach(function(el) {
            var parentApp = findParentApp(el),
                script = el.getAttribute("src");

            if (!script) {
                script = el.getAttribute("data-sc-require");
            }
            //if no parentApp, we fallback to the body element
            if (!parentApp) {
                parentApp = document;
            }

            var pageCodeName = parentApp.getAttribute(conf.APP_KEY);

            if (!pageCodeName) {
                pageCodeName = "app";
            }

            result.push({
                el: el,
                id: parentApp.getAttribute(conf.APP_KEY),
                key: pageCodeName,
                script: [script],
            });
        });

        return result;
    }
};

module.exports = pageCodeParser;

},{"../conf":33,"../utils/DOM":55}],54:[function(_dereq_,module,exports){
var conf = _dereq_( "../conf" ),
  DOMutils = _dereq_( "../utils/DOM" ),
  findPlugins = DOMutils.findPlugins;

var pluginParser = {
  /**
   * parse an element to retrieve the Plugin tags
   * @param  {DOMElement} els optionnal dom element served as root for the search
   * @return {[DOMElement]}     an array of DOMElement
   */
  parse: function( els ) {
    var result = [];

    findPlugins().forEach( function( el ) {
      var script = el.getAttribute( conf.SCRIPT );
      result.push( {
        el: el,
        key: el.getAttribute( conf.PLUGIN_ID ),
        script: [ script ]
      } );
    } );

    return result;
  }
};

module.exports = pluginParser;
},{"../conf":33,"../utils/DOM":55}],55:[function(_dereq_,module,exports){
var toArray = _dereq_( "sc-utils" ).array.toArray,
    conf = _dereq_( "../conf" );

var isBrowser = typeof window !== "undefined",
    root = isBrowser ? window : module.exports,
    doc = root.document;

if ( isBrowser ) {
    var table = doc.createElement( "table" ),
        tableRow = doc.createElement( "tr" ),
        containers = {
            "tr": doc.createElement( "tbody" ),
            "tbody": table,
            "thead": table,
            "tfoot": table,
            "td": tableRow,
            "th": tableRow,
            "*": doc.createElement( "div" )
        },
        fragmentRE = /^\s*<(\w+|!)[^>]*>/;
}

var DOMutils = {
    /**
     * Find all the DOM element which has the appropriate markup for an application
     * @return {Array} array of DOM Element
     */
    findApps: function( el ) {
        var element = el ? el : document;

        return toArray( element.querySelectorAll( conf.ATTR_APP ) );
    },
    /**
     * Find among all the childer of a DOM
     * to retreive all the DOM elements which as the appropriate markup for a component
     * @param  {[type]} el [description]
     * @return {[type]}    [description]
     */
    findComponents: function( el ) {
        var element = el ? el : document;

        return toArray( element.querySelectorAll( conf.ATTR_COMPONENT ) );
    },
    findPageCodes: function( el ) {
        var element = el ? el : document;

        return toArray( element.querySelectorAll( conf.ATTR_PAGECODE ) );
    },
    findPageCode: function( el ) {
        var element = el ? el : document;

        return element.querySelector( conf.ATTR_PAGECODE );
    },
    findPlugins: function( el ) {
        var element = el ? el : document;

        return toArray( element.querySelectorAll( conf.ATTR_PLUGIN ) );
    },
    /**
     * Based his parent, find the depth of a child Node
     * @param  {DOM Element} child the DOM element you want to find the depth
     * @param  {DOM Element} parent the parent DOM element you want as root, if not, the parent is the window Object
     * @return {Integer}        the depth of the DOM element compared o his parent.
     */
    getDepth: function( child, parent ) {
        var node = child,
            comp = null,
            depth = 0;

        if ( parent ) {
            comp = parent.id;
        }

        while ( node.parentNode !== comp ) {
            node = node.parentNode;
            depth++;
        }
        return depth;
    },
    // Find first ancestor of el with tagName
    // or undefined if not found
    findParentApp: function( el ) {

        do {
            el = el.parentNode;
            if ( el.hasAttribute && el.hasAttribute( conf.APP_KEY ) ) {
                return el;
            }
        } while ( el.parentNode );

        // Many DOM methods return null if they don't 
        // find the element they are searching for
        // It would be OK to omit the following and just
        // return undefined
        return null;
    },
    findParentComponent: function( el ) {
        do {
            el = el.parentNode;
            if ( el.hasAttribute && el.hasAttribute( conf.ID ) && el.hasAttribute( conf.NESTED ) ) {
                return el;
            }
            if ( el.hasAttribute && el.hasAttribute( conf.APP_KEY ) ) {
                return null;
            }
        } while ( el.parentNode );

        return null;
    },
    findNestedApplications: function( el ) {
        return toArray( el.querySelectorAll( conf.ATTR_APP ) );
    },
    createDomElement: function( html ) {
        var dom, container, name;

        if ( !html ) {
            return doc.createElement( "div" );
        }

        name = fragmentRE.test( html ) && RegExp.$1;

        if ( !( name in containers ) ) {
            name = "*";
        }

        container = containers[ name ];
        container.innerHTML = "" + html;

        dom = container.childNodes;

        //clear DOM
        var realArray = Array.prototype.slice.call( container.childNodes );

        /*realArray.forEach( function ( node ) {
          container.removeChild( node );
        } );*/

        /*if ( realArray.length === 1 ) {
          dom = realArray[ 0 ];
        }*/

        return realArray;
    },
    addCss: function( cssCode ) {
        var styleElement = document.createElement( "style" );

        styleElement.type = "text/css";
        if ( styleElement.styleSheet ) {
            styleElement.styleSheet.cssText = cssCode;
        } else {
            styleElement.appendChild( document.createTextNode( cssCode ) );
        }
        document.getElementsByTagName( "head" )[ 0 ].appendChild( styleElement );
    },
    addCloak: function( ) {
        this.addCss( "*[" + conf.cloak + "] { display:none; !important }" );
    },
    findMetaLang: function( ) {
        var lang = document.querySelector( "meta[data-sc-name=sitecoreLanguage]" );

        if ( !lang ) {
            return;
        }

        return lang.getAttribute( "data-sc-content" );
    },
    findAntiForgeryToken: function( ) {
        var elements = doc.querySelectorAll( "input[name=__RequestVerificationToken]" );
        if ( !elements ) {
            return;
        }

        if ( elements.length === 0 ) {
            return;
        }

        return elements[ 0 ].value;
    },
    findDatabase: function () {
        var element = doc.querySelector( "meta[data-sc-name=sitecoreDatabase]" );
        if ( !element ) {
            return;
        }

        return element.getAttribute( "data-sc-content" );
    },
    findContentDatabase: function() {
        var element = doc.querySelector( "meta[data-sc-name=sitecoreContentDatabase]" );
        if ( !element ) {
            return;
        }

        return element.getAttribute( "data-sc-content" );
    }
};

module.exports = DOMutils;

},{"../conf":33,"sc-utils":22}],56:[function(_dereq_,module,exports){
module.exports = {
  get: function( url, callback ) {
    var errorCallback = function ( args ) {
      console.log( args );
      callback( {
        error: "Something went wrong when loading: " + url
      } );
    };

    var request = new XMLHttpRequest();
    request.open("GET", url, true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400){

        var resp = request.responseText;

        callback({
          result: resp,
          error: null
        });

      } else {
        errorCallback();
      }
    };

    request.onerror = errorCallback;

    request.send();
  }
};
},{}],57:[function(_dereq_,module,exports){
var scUtils = _dereq_("sc-utils"),
    ajaxUtils = _dereq_("../utils/ajax"),
    DOM = _dereq_("../utils/DOM");

module.exports = {
    closeDialog: function(returnValue) {
        window.top.returnValue = returnValue;
        window.top.dialogClose(returnValue);
    },
    remove: function(el) {

        if (scUtils.is.a.string(el)) {
            el = this.el.querySelector(el);
        }

        el = el || this.el;

        var parentApp = this,
            component = [],
            removeApp = function(app) {
                var byUniqueId = function(appObject) {
                        return app.__domID === appObject.__domID;
                    },
                    appObj = scUtils.array.find(parentApp.children, byUniqueId);

                if (appObj) {
                    appObj.remove();
                    parentApp.children = parentApp.children.filter(byUniqueId);
                }
            },
            removeComponent = function(compEl) {
                var byUniqueId = function(compObject) {
                        return compEl.__domID === compObject.__domID;
                    },
                    compObj = scUtils.array.find(parentApp.components, byUniqueId);

                if (compObj) {

                    if (compObj.destroy) {
                        compObj.destroy();
                    }

                    var fromApp = parentApp[compObj.id];

                    if (fromApp) {
                        if (scUtils.is.an.array(fromApp)) {
                            parentApp[compObj.id] = parentApp[compObj.id].filter(byUniqueId);
                        } else {
                            delete parentApp[compObj.id];
                        }
                    }

                    parentApp.components = parentApp.components.filter(byUniqueId);
                }
            };

        //remove applications
        var apps = DOM.findApps(el);

        if (apps) {
            apps.forEach(removeApp);
        }

        var comps = DOM.findComponents(el);

        if (comps) {
            comps.forEach(removeComponent);
        }

        el.innerHTML = ""; //empty the HTML element

        return parentApp;
    },
    sendMessage: function(returnValue) {
        window.top.receiveMessage(returnValue, root.getParameterByName("sp"));
    },
    findComponent: function(componentName) {
        var componentLenght = 0,
            components = this.components,
            nestedApps = this.children,
            result,
            found;

        components.forEach(function(comp) {
            if (!found && (comp.id === componentName)) {
                found = true;
                result = comp;
            }
        });

        if (!result && nestedApps && nestedApps.length) {
            nestedApps.forEach(function(app) {
                if (!found) {
                    result = app.findComponent(componentName);
                    found = true;
                }
            });
        }

        return result;
    },
    findApplication: function(appName) {
        var result,
            found,
            nestedApps = this.children || [];

        if (!appName) {
            return null;
        }

        if (this.key === appName) {
            return this;
        } else {
            nestedApps.forEach(function(app) {
                if (!found) {
                    var res = app.findApplication(appName);
                    if (res) {
                        found = true;
                        result = res;
                    }
                }
            });
        }

        return result;
    },
    replace: function(config, callback) {
        config.el = scUtils.is.a.string(config.el) ? this.el.querySelector(config.el) : config.el;
        config.el = config.el || this.el;

        this.remove(config.el);
        this.inject(config, callback);
    },
    append: function(config, callback) {
        if (scUtils.is.an.object(config)) {
            config.el = scUtils.is.a.string(config.el) ? this.el.querySelector(config.el) : config.el;
            config.el = config.el || this.el;
        } else {
            config = {
                html: config,
                el: this.el
            };
        }

        config.append = true;

        this.inject(config, callback);
    },
    prepend: function(config, callback) {
        if (scUtils.is.an.object(config)) {
            config.el = scUtils.is.a.string(config.el) ? this.el.querySelector(config.el) : config.el;
            config.el = config.el || this.el;
        } else {
            config = {
                html: config,
                el: this.el
            };
        }

        config.prepend = true;

        this.inject(config, callback);
    },
    insertRendering: function(itemId, options, cb) {
        var item,
            _sc = window.Sitecore.Speak,
            that = this,
            selector,
            $el,
            queryStringLang = "",
            langFromDom = DOM.findMetaLang(),
            lang = langFromDom ? langFromDom : "",
            database = "core",
            defaultOptions = {
                contentDabase: "",
                database: database,
                path: "/api/sitecore/Layout/RenderItem",
                lang: lang
            };

        if (scUtils.is.a.function(options)) {
            cb = options;
        } else if (options) {
            defaultOptions = scUtils.object.extend(defaultOptions, options);
        }

        if (!defaultOptions.name) {
            defaultOptions.name = scUtils.string.uniqueId("subapp_");
        }

        if (defaultOptions.lang) {
            queryStringLang = "&sc_lang=" + lang;
        }
        var urlToCall = defaultOptions.path + "?sc_itemid=" + itemId + "&sc_database=" + defaultOptions.database + queryStringLang;

        if (defaultOptions.contentDabase) {
            urlToCall = urlToCall + "&sc_content=" + defaultOptions.contentDabase;
        }

        ajaxUtils.get(urlToCall, function(data) {
            that.insertMarkups(data.result, defaultOptions, cb);
        });
    },
    insertMarkups: function(html, options, cb) {
        var defaultOptions = {
            prepend: false,
            el: options.el,
            html: html
        };

        defaultOptions = scUtils.object.extend(defaultOptions, options);

        if (!defaultOptions.el) {
            if (defaultOptions.selector) {
                defaultOptions.el = document.querySelector(options.selector);
            } else {
                defaultOptions.el = document.body;
            }
        }

        this.inject(defaultOptions, cb);
    },
    parse: function ( el, callback ) {
         var defaultOptions = {
            parse: true,
            el: el
        };
       this.inject(defaultOptions, callback);
    }
};

},{"../utils/DOM":55,"../utils/ajax":56,"sc-utils":22}],58:[function(_dereq_,module,exports){
var propertyHelper = _dereq_( "../utils/propertyHelper" ),
  scUtils = _dereq_( "sc-utils" ),
  propertyFactory = _dereq_( "../factory/Property" );

module.exports = function( propertyStore ) {
  return {
    get: function( propertyName ) {
      propertyName = scUtils.is.capitalize( propertyName ) ? propertyName : scUtils.string.capitalize( propertyName );

      var value = this.__properties[ propertyName ];

      if ( value && value.__type === "Property" ) {
        return value.get( propertyName );
      } else {
        return value;
      }
    },
    set: function( propertyName, newValue, silent ) {
      propertyName = scUtils.is.capitalize( propertyName ) ? propertyName : scUtils.string.capitalize( propertyName );

      var property = this.__properties[ propertyName ],
        beforeChangeComputedValues = this.__getComputedValues(),
        isNew;

      if ( property && property.__type === "Property" && property.isNew ) {
        isNew = property.isNew( newValue );
      } else {
        isNew = property !== newValue;
      }

      if ( isNew ) {
        if ( !silent ) {
          this.trigger( "beforeChange:" + propertyName, this.get( propertyName ) );
        }

        if ( property && property.__type === "Property" ) {

          property.set( newValue );
        } else {
          this.__properties[ propertyName ] = newValue;
        }

        if ( !silent ) {
          this.__triggerForComputed(beforeChangeComputedValues);
          this.trigger( "change:" + propertyName, this.get( propertyName ) );
        }
      }
    },
    __getComputedValues: function( ) {
      var result = {},
          self = this;

      if(!this.computed) {
        return;
      }
      var keys = Object.keys(this.computed);

      keys.forEach( function( key ) {
        result[key] = self[key];
      });

      return result;
    },
    __triggerForComputed: function( currentValues ) {
      if(!this.computed) {
        return;
      }

      var self = this,
          keys = Object.keys(this.computed);

      keys.forEach(function( key ) {
        if(this[key] !== currentValues[key]) {
          this.trigger( "change:" + scUtils.string.capitalize(key), this.get( key ) );
        }
      }, this);
    },
    defineProperties: function() {
      this.__properties = this.__properties || {};

      for ( var i in this.__parameterTemplates ) {
        if ( propertyHelper.isProperty( this.__parameterTemplates, i ) ) {

          this.defineProperty( i, this.__parameterTemplates[ i ] );
        }
      }

      if(this.properties) {
        for(var key in this.properties) {
          if( !this.__properties[scUtils.string.capitalize( key )] ) {
            var value = this.properties[key];
            if(scUtils.is.a.function(value)) {
              this.defineComputedProperty(key, value);
            } else if(scUtils.is.a.object(value) && scUtils.is.a.function(value.get) && scUtils.is.a.function(value.set)) {
              this.definePureComputedProperty(key, value);
            } else {
              this.defineProperty(key , value);
            }
          }
        }
      }
    },
    defineProperty: function( propertyName, value ) {
      var comp = this,
        initial = value,
        metaProperty = propertyHelper.getCustomType( propertyName ),
        propertyDef = metaProperty.type ? propertyStore.find( metaProperty.type ) : void 0;

      var p = metaProperty.type ? metaProperty.property : propertyName;

      if ( metaProperty.type ) {
        var Property = propertyFactory.make( propertyDef );
        this.__properties[ scUtils.string.capitalize( p ) ] = new Property( initial, this, propertyName );
      } else {
        this.__properties[ scUtils.string.capitalize( p ) ] = initial;
      }

      Object.defineProperty( this, p, {
        get: function() {
          return comp.get( p );
        },
        set: function( newValue ) {
          comp.set( p, newValue );
        },
        enumerable: true
      } );
    },
    defineComputedProperty: function( name, getter ) {
      var self = this;

      if( !scUtils.is.a.string( name ) ) {
        throw "please provide a valid name";
      }

      if( !scUtils.is.a.function( getter ) ) {
        throw "please provide a valid name";
      }

      this.computed = this.computed || {};

      this.computed[name] = {
        read: getter
      };

      Object.defineProperty(this, name, {
        get: function() {
          return self.computed[name].read.call(self);
        },
        set: function () {
          throw "this is a readonly property";
        }
      });
    },
    definePureComputedProperty: function( name, getterAndSetter) {
      var self = this;

      if( !scUtils.is.a.string( name ) ) {
        throw "please provide a valid name";
      }

      if( !scUtils.is.an.object( getterAndSetter ) && ! scUtils.is.an.function(getterAndSetter.set) && ! scUtils.is.an.function(getterAndSetter.get) ) {
        throw "please provide a valid name";
      }

      this.computed = this.computed || {};

      this.computed[name] = {
        read: getterAndSetter.get,
        write: getterAndSetter.set
      };

      Object.defineProperty(this, name, {
        get: function() {
          return self.computed[name].read.call(self);
        },
        set: function () {
          var value = self.computed[name].read.call(self);

          this.trigger( "beforeChange:" + name, value );

          self.computed[name].write.apply(self, arguments);

          this.trigger( "change:" + name, self.computed[name].read.call(self));
        }
      });
    }
  };
};
},{"../factory/Property":35,"../utils/propertyHelper":64,"sc-utils":22}],59:[function(_dereq_,module,exports){
var DOMHelper = _dereq_("./DOM"),
    language, database, contentDatabase;

module.exports = {
    current: function() {
        language = language || DOMHelper.findMetaLang();
        database = database || DOMHelper.findDatabase();
        contentDatabase = contentDatabase || DOMHelper.findContentDatabase();

        return {
            language: language,
            database: database,
            contentDatabase: contentDatabase
        };
    }
};
},{"./DOM":55}],60:[function(_dereq_,module,exports){
/* jshint forin: false, loopfunc: true */
/* Events from backbonejs */
var scUtils = _dereq_( "sc-utils" );
var eventSplitter = /\s+/;

var triggerEvents = function ( events, args ) {
    var ev, i = -1,
        l = events.length,
        a1 = args[ 0 ],
        a2 = args[ 1 ],
        a3 = args[ 2 ];

    switch ( args.length ) {
    case 0:
        while ( ++i < l ) {
            ( ev = events[ i ] ).callback.call( ev.ctx );
        }
        return;
    case 1:
        while ( ++i < l ) {
            ( ev = events[ i ] ).callback.call( ev.ctx, a1 );
        }
        return;
    case 2:
        while ( ++i < l ) {
            ( ev = events[ i ] ).callback.call( ev.ctx, a1, a2 );
        }
        return;
    case 3:
        while ( ++i < l ) {
            ( ev = events[ i ] ).callback.call( ev.ctx, a1, a2, a3 );
        }
        return;
    default:
        while ( ++i < l ) {
            ( ev = events[ i ] ).callback.apply( ev.ctx, args );
        }
    }
};

var eventsApi = function ( obj, action, name, rest ) {
    if ( !name ) {
        return true;
    }

    if ( typeof name === "object" ) {
        for ( var key in name ) {
            obj[ action ].apply( obj, [ key, name[ key ] ].concat( rest ) );
        }
        return false;
    }
    if ( eventSplitter.test( name ) ) {
        var names = name.split( eventSplitter );
        for ( var i = 0, l = names.length; i < l; i++ ) {
            var evtName = names[ i ];

            evtName = evtName.split( ":" );
            evtName[ 1 ] = scUtils.string.capitalize( evtName[ 1 ] );

            obj[ action ].apply( obj, [ evtName.join( ":" ) ].concat( rest ) );
        }
        return false;
    }

    return true;
};

/**
 * @class Events
 */
var Events = {
    /**
     * On
     * @method on
     * @static
     */
    on: function ( name, callback, context ) {
        if ( !eventsApi( this, "on", name, [ callback, context ] ) || !callback ) {
            return this;
        }

        this._events || ( this._events = {} );

        if ( name.indexOf( ":" ) > 0 ) {
            var evtArr = name.split( ":" );
            evtArr[ 1 ] = scUtils.string.capitalize( evtArr[ 1 ] );
            name = evtArr.join( ":" );
        }

        var events = this._events[ name ] || ( this._events[ name ] = [ ] );

        events.push( {
            callback: callback,
            context: context,
            ctx: context || this
        } );

        return this;
    },
    /** Once
     * @method once
     * @static
     */
    once: function ( name, callback, context ) {
        if ( !eventsApi( this, "once", name, [ callback, context ] ) || !callback ) {
            return this;
        }

        var self = this;

        var once = scUtils.function.once( function ( ) {
            self.off( name, once );
            callback.apply( this, arguments );
        } );

        once._callback = callback;

        return this.on( name, once, context );
    },
    /** 
     * Off
     * @method off
     * @static
     */
    off: function ( name, callback, context ) {
        var retain, ev, events, names, i, l, j, k;

        if ( !this._events || !eventsApi( this, "off", name, [ callback, context ] ) ) {
            return this;
        }

        if ( !name && !callback && !context ) {
            this._events = {};
            return this;
        }

        if ( name.indexOf( ":" ) > 0 ) {
            var evtArr = name.split( ":" );
            evtArr[ 1 ] = scUtils.string.capitalize( evtArr[ 1 ] );
            name = evtArr.join( ":" );
        }

        names = name ? [ name ] : Object.keys( this._events );

        for ( i = 0, l = names.length; i < l; i++ ) {
            name = names[ i ];
            if ( events = this._events[ name ] ) {
                this._events[ name ] = retain = [ ];
                if ( callback || context ) {
                    for ( j = 0, k = events.length; j < k; j++ ) {
                        ev = events[ j ];
                        if ( ( callback && callback !== ev.callback && callback !== ev.callback._callback ) ||
                            ( context && context !== ev.context ) ) {
                            retain.push( ev );
                        }
                    }
                }
                if ( !retain.length ) {
                    delete this._events[ name ];
                }
            }
        }

        return this;
    },
    /** 
     * Trigger events
     * @method trigger
     * @static
     */
    trigger: function ( name ) {
        if ( !this._events ) {
            return this;
        }

        var args = Array.prototype.slice.call( arguments, 1 );

        if ( !eventsApi( this, "trigger", name, args ) ) {
            return this;
        }

        var events = this._events[ name ];
        var allEvents = this._events.change;
        if ( events ) {
            triggerEvents( events, args );
        }
        if ( allEvents ) {
            triggerEvents( allEvents, arguments );
        }
        return this;
    },
    stopListening: function ( obj, name, callback ) {
        var listeningTo = this._listeningTo;

        if ( !listeningTo ) {
            return this;
        }

        var remove = !name && !callback;
        if ( !callback && typeof name === "object" ) {
            callback = this;
        }

        if ( obj ) {
            ( listeningTo = {} )[ obj._listenId ] = obj;
        }
        for ( var id in listeningTo ) {
            obj = listeningTo[ id ];
            obj.off( name, callback, this );
            if ( remove || Object.keys( obj._events ) === 0 ) {
                delete this._listeningTo[ id ];
            }
        }
        return this;
    }
};
/*
 * Credit to Backbone source code, please find it here:
 * http://backbonejs.org/docs/backbone.html
 */

var listenMethods = {
    /**
     * listenTo
     * @method listenTo
     * @static
     */
    listenTo: "on",
    /** 
     * listenToOnce
     * @method listenToOnce
     * @static
     */
    listenToOnce: "once"
};

//TODO: verify if implemtnation and method are well defined, see backbone source code
for ( var i in listenMethods ) {
    var implementation = listenMethods[ i ],
        method = i;

    Events[ method ] = function ( obj, name, callback ) {
        var listeningTo = this._listeningTo || ( this._listeningTo = {} );
        var id = obj._listenId || ( obj._listenId = scUtils.string.uniqueId( "l" ) );
        listeningTo[ id ] = obj;
        if ( !callback && typeof name === "object" ) {
            callback = this;
        }
        obj[ implementation ]( name, callback, this );
        return this;
    };
}

module.exports = Events;

},{"sc-utils":22}],61:[function(_dereq_,module,exports){
/* jshint forin:false */
var conf = _dereq_( "../conf" );
var scUtils = _dereq_( "sc-utils" );

var arrayProto = Array.prototype,
    nativeForEach = arrayProto.forEach,
    nativeSlice = arrayProto.slice,
    xhr = function( obj ) {
        var type = obj.type,
            url = obj.url,
            data = obj.data,
            cb = obj.cb;

        var xmlHttp = new XMLHttpRequest( );

        xmlHttp.open( type, url, true );
        if ( type.toLowerCase( ) === "post" ) {
            xmlHttp.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
        }

        xmlHttp.send( type === "post" ? JSON.stringify( data ) : null );
        xmlHttp.onreadystatechange = function( ) {
            if ( xmlHttp.readyState === 4 ) {
                if ( xmlHttp.status === 200 || xmlHttp.status === 0 /*remove this*/ ) {
                    cb( xmlHttp.responseText );
                } else {
                    console.log( "Error: " + xmlHttp.responseText );
                }
            }
        };
    },
    scriptLoadError = function( ) {
        console.log( arguments );
    },
    attachScript = function( url, cb ) {
        var script = document.createElement( "script" );
        script.src = url;
        script.onload = function( ) {
            cb( );
        };
        script.onerror = scriptLoadError;
        ( document.head || document.getElementsByTagName( "head" )[ 0 ] ).appendChild( script );
    },
    extractProperties = function( def ) {
        var initialValues = {};
        for ( var i in def ) {
            if ( def.hasOwnProperty( i ) ) {
                var property = def[ i ];
                if ( typeof proto !== "function" ) {
                    initialValues[ i ] = property;
                }
            }
        }
        return initialValues;
    },
    extractProto = function( def ) {
        var protoprops = {};
        for ( var i in def ) {
            var proto = def[ i ];
            if ( typeof proto === "function" && i !== "initialize" && i !== "constructor" ) {
                protoprops[ i ] = proto;
            }
        }
        return protoprops;
    },
    initializeProperties = function( obj, properties ) {
        for ( var i in properties ) {
            if ( properties.hasOwnProperty( i ) && !scUtils.is.a.function( properties[ i ] ) ) {
                obj[ i ] = properties[ i ];
            }
        }
    },
    byDepth = function compare( a, b ) {
        if ( a.depth < b.depth ) {
            return -1;
        }
        if ( a.depth > b.depth ) {
            return 1;
        }
        return 0;
    },
    sortByDepth = function( arr ) {
        return arr.sort( byDepth ).reverse( );
    },
    /**
     * Build the request for bundled file
     * eg. /-/speak/v1/bundles/bundle.js?f=/-/speak/v1/business/button.js,/-/speak/v1/business/text.js
     * @param  {[type]} types [description]
     * @return {[type]}       [description]
     */
    buildModRequest = function( types ) {
        var request = conf.ROOTSTATICURL ? conf.ROOTSTATICURL : ( window.location.origin + "/" ),
            mod = "/-/speak/v1/bundles/bundle.js?d=1&c=1&n=1&f=";
        return [ request + mod + types.join( "," ) ];
    },
    createTree = function( flatArray, k, expose ) {
        var number = flatArray.length,
            tree = [ ],
            key = k ? k : "key",
            node, map = {},
            roots = [ ];

        for ( var j = 0; j < number; j++ ) {
            map[ flatArray[ j ][ key ] ] = j;
            flatArray[ j ].children = [ ];
        }

        for ( var i = 0; i < number; i++ ) {
            node = flatArray[ i ];

            if ( node.parent ) {
                var parentKey = map[ node.parent ];

                if ( parentKey ) {
                    var parent = flatArray[ parentKey ];
                    node.parent = parent ? parent : void 0;

                    if ( parent ) {
                        var c = node.PageCodeObject || node;
                        parent.children.push( c );
                        if ( expose ) {
                            if ( parent[ c[ k ] ] ) {
                                throw new Error( "Conflicting id for " + k + "in object " + c.id );
                            }
                            parent[ c[ k ] ] = c;
                        }
                    }
                }
            } else {
                roots.push( node.PageCodeObject || node );
            }
        }

        return roots;
    },
    removeFileExtensionIfNeeded = function( str ) {
        str = str.trim( );
        if ( /.js$/i.test( str ) ) {
            str = str.slice( 0, -3 );
        }
        return str;
    };

module.exports = {
    attachScript: attachScript,
    extractProto: extractProto,
    xhr: xhr,
    extractProperties: extractProperties,
    initializeProperties: initializeProperties,
    buildModRequest: buildModRequest,
    sortByDepth: sortByDepth,
    createTree: createTree,
    removeFileExtensionIfNeeded: removeFileExtensionIfNeeded,
    security: _dereq_( "./security" )
};

},{"../conf":33,"./security":65,"sc-utils":22}],62:[function(_dereq_,module,exports){
  /*jshint loopfunc: true */
  var scUtils = _dereq_( "sc-utils" );

  var extend = function( obj ) {
      if ( !scUtils.is.an.object( obj ) ) {
          return obj;
      }

      var source, prop;
      for ( var i = 1, length = arguments.length; i < length; i++ ) {
          source = arguments[ i ];
          for ( prop in source ) {
              if ( hasOwnProperty.call( source, prop ) ) {
                  obj[ prop ] = source[ prop ];
              }
          }
      }
      return obj;
  };

  var inheritance = {
      wrap: function( Presenter, componentDefinition ) {
          var component = ( function( _ctor ) {
              return function( ) {
                  _ctor.apply( this, arguments ); //closure
              };
          } )( Presenter.prototype.constructor );

          for ( var j in Presenter.prototype ) {
              if ( Presenter.prototype.hasOwnProperty( j ) ) {
                  component.prototype[ j ] = Presenter.prototype[ j ];
              }
          }

          if ( componentDefinition.prototype ) { //componentDefinition has a prototype
              componentDefinition = componentDefinition.prototype;
          }

          for ( var i in componentDefinition ) {
              if ( component.prototype[ i ] && scUtils.is.a.function( componentDefinition[ i ] ) ) {
                  component.prototype[ i ] = ( function( _presenter, _component ) {

                      return function( ) {
                          _component.apply( this, arguments );
                          _presenter.apply( this, arguments );

                      };
                  }( Presenter.prototype[ i ], componentDefinition[ i ] ) );
              } else {
                  component.prototype[ i ] = componentDefinition[ i ];
              }
          }

          return component;
      },
      extend: extend
  };

  module.exports = inheritance;

},{"sc-utils":22}],63:[function(_dereq_,module,exports){
var DOM = _dereq_( "./DOM" );
var utils = _dereq_("./index");

module.exports = function( loader, parser, stores ) {

    return {
        setupInjectMethod: function( createApp ) {
            return function( config, callback ) {
                var app = this,
                    el = config.el,
                    html = config.html,
                    append = config.append,
                    replace = config.replace,
                    parse = config.parse,
                    prepend = config.prepend;

                var exposeApp = function( apps, exposed ) {

                    if ( exposed ) {
                        app.children = app.children || [];
                        app.children = app.children.concat( exposed );
                    }

                    if ( callback ) {
                        callback( app );
                    }

                    app.trigger( "change", app );
                };

                if ( !append && !prepend && !replace && !parse ) {
                    append = true;
                }

                if ( !app || !el || !( html || parse ) ) {
                    throw new Error( "incorrect parameter passed" );
                }

                if( parse ) {
                    stores.build( parser.parse( el ) );
                    loader.load( stores, function() {
                        stores.markAsLoaded();
                        createApp.call( app, el, exposeApp );
                    } );
                    return;
                }

                //el.style.display = 'none';
                var emptyDiv = DOM.createDomElement(),
                    elements = DOM.createDomElement( html );

                elements.forEach( function( nodeElement ) {
                    emptyDiv.appendChild( nodeElement );
                } );

                if ( append || replace ) {

                    if ( replace ) {
                        el.innerHTML = "";
                        //should clean up app;
                    }
                    elements.forEach( function( nodeElement ) {
                        el.appendChild( nodeElement );
                    } );
                } else {
                    elements.reverse().forEach( function( nodeElement ) {
                        el.parentNode.insertBefore( nodeElement, el );
                    } );
                }

                var allElements = parser.parse( el ); //this is parsing

                stores.build( allElements );

                loader.load( stores, function() {
                    stores.markAsLoaded();
                    createApp.call( app, el, exposeApp );
                } );
            };
        }
    };
};
},{"./DOM":55,"./index":61}],64:[function(_dereq_,module,exports){
var excludes = [],
  isObject = function ( obj ) {
    return obj === Object( obj );
  },
  isValidProperty = function ( obj, i ) {
    var value = obj[ i ],
      isExclude,
      type;

    excludes.forEach( function ( excludeKey ) {
      if ( excludeKey === i ) {
        isExclude = true;
      }
    } );

    if ( isExclude ) {
      return false;
    }

    if ( !value ) {
      //if the property does not have any value, we force it to be a string
      //if we do not do this 
      value = "";
    }
    type = value.toString();

    if ( Array.isArray( value ) ) {
      return true;
    }

    return ( !isObject( value ) && type !== "[object Function]" && type !== "[object RegExp]" );
  };

var propertyHelper = {
  isProperty: function ( obj, i, ex ) {
    excludes = ex || [];

    return ( obj.hasOwnProperty( i ) && isValidProperty( obj, i ) );
  },
  getCustomType: function ( property ) {
    if ( property.indexOf( ":" ) === -1 ) {
      return {
        type: void 0,
        property: property
      };
    }

    return {
      type: property.split( ":" )[ 1 ],
      property: property.split( ":" )[ 0 ]
    };
  }
};

module.exports = propertyHelper;
},{}],65:[function(_dereq_,module,exports){
var DOMHelper = _dereq_("./DOM"),
    antiForgeryTokenValue,
    formKey = "__RequestVerificationToken";

module.exports = {
    antiForgery: {
        getAntiForgeryToken: function() {
            antiForgeryTokenValue = antiForgeryTokenValue || DOMHelper.findAntiForgeryToken();
            return {
                formKey: formKey,
                headerKey: "X-RequestVerificationToken",
                value: antiForgeryTokenValue
            };
        }
    }
};

},{"./DOM":55}],66:[function(_dereq_,module,exports){
module.exports = "2.0.24";
},{}]},{},[39])
(39)
});