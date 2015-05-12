/**!
 *
 * koPresenter
 *
 * Built: Tue Oct 28 2014 11:23:49 GMT+0000 (GMT Standard Time)
 * PackageVersion: 0.0.9
 *
 */

;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var computeComments = function ( el, callback ) {
  function traverseDom( curr_element ) { // this is the recursive function
    // base case: node is a comment node
    if ( curr_element.nodeType === 8 ) {
      // You need this OR because some browsers won't support either nodType or nodeName... I think...
      callback( curr_element );
    }
    // recursive case: node is not a comment node
    else if ( curr_element.childNodes.length > 0 ) {
      for ( var i = 0; i < curr_element.childNodes.length; i++ ) {
        // adventures with recursion!
        traverseDom( curr_element.childNodes[ i ], callback );
      }
    }
  }
  return traverseDom( el, callback );
};

module.exports = {
  computeComments: computeComments
};
},{}],2:[function(require,module,exports){

module.exports = function( sitecore, ko ) {
  return require( "./ko" )( sitecore, ko );
}
},{"./ko":3}],3:[function(require,module,exports){
var DOMUtils = require( "./dom" );

module.exports = function( sitecore, ko ) {

  var markAsRegistered = function( comp ) {
    if ( !comp.el ) {
      return;
    }

    var bindingsElement = [ comp.el ],
      nestedBinding = sitecore.utils.array.toArray( comp.el.querySelectorAll( "[data-bind]" ) );

    bindingsElement = bindingsElement.concat( nestedBinding );

    bindingsElement.forEach( function( el ) {
      el.__registered = true;
    } );

    DOMUtils.computeComments( comp.el, function( el ) {
      el.__registered = true;
    } );

    comp.el.__registered = true;
  };

  /**
   * Setup ko
   */
  var SPEAKBindingProvider = function() {
    var result = new ko.bindingProvider(),
      originalHasBindings = result.nodeHasBindings;

    result.nodeHasBindings = function( node ) {
      if ( !node.__registered ) {
        return originalHasBindings.call( this, node );
      }
      return false;
    };

    return result;
  };

  return {
    markAsRegistered: markAsRegistered,
    SPEAKBindingProvider: SPEAKBindingProvider
  };
};
},{"./dom":1}],4:[function(require,module,exports){
var skip = {
      el: 1,
      id: 1,
      key: 1,
      script: 1,
      template: 1,
      depth: 1,
      ko: 1,
      app: 1,
      parent: 1,
      on: 1,
      trigger: 1,
      once: 1,
      listenToOnce: 1,
      listenTo: 1,
      off: 1,
      children: 1,
      __properties: 1,
      processSubscribers: 1,
      _s: 1,
      viewModel: 1
};

module.exports = {
      skip: skip
};
},{}],5:[function(require,module,exports){
( function() {

  var isBrowser = ( typeof window !== "undefined" ),
    ko = window.ko || requirejs( "knockout" ),
    sitecore = isBrowser && window.Sitecore ? window.Sitecore.Speak : requirejs( "boot" ),
    conf = require( "./conf" ),
    skipkeys = conf.skip,
    koUtils = require( "sc-kospeakbindingprovider" )( sitecore, ko ),
    vmHelper = require( "./utils/viewModel" )( ko ),
    compHelper = require( "./utils/component" )( ko ),
    isDebug = Sitecore.Speak.isDebug(),
    _printDebug = function( string, type ) {
      if ( !type ) {
        type = "log";
      }

      if ( isDebug ) {
        console[ type ]( string );
      }
    };

  var syncModelandViewModel = function( key, component, viewModel, force ) {
      vmHelper.updateViewModelWhenComponentChange( key, component, viewModel );
      compHelper.updateComponentWhenViewModelChange( key, component, viewModel, force );
    },
    _forEachValidProperty = function( component, callback ) {
      for ( var i in component ) { //no check if hasOwnProperty on purpose
        if ( !skipkeys[ i ] ) {
          callback( i );
        }
      }
    },
    _buildViewModel = function( component, viewModel, force ) {

      _printDebug( "Create ViewModel for Component: " + component.id );

      _forEachValidProperty( component, function( key ) {

        vmHelper.buildPropertyForViewModel( key, component, viewModel, force );

        syncModelandViewModel( key, component, viewModel, force );
      } );

      vmHelper.buildComputed( component, viewModel );

      _printDebug( "Finish creating ViewModel " + component.id + ", result is:" );
      _printDebug( viewModel );

    };

  //to prevent registering the same component multiple times
  ko.bindingProvider.instance = new koUtils.SPEAKBindingProvider();

  Sitecore.Speak.module( "scKoPresenter", {
    buildViewModel: function( object ) {
      object.viewModel = object.viewModel || {};
      _buildViewModel( object );
    }
  } );

  Sitecore.Speak.presenter( {
    name: "scKoPresenter",
    updateViewModel: function() {
      _buildViewModel( this, this.viewModel, true );
    },
    initialized: function() {

      //Setup container for the ViewModel
      this.viewModel = this.viewModel || {};
      this._subscriptions = {}; //store subscription

      _buildViewModel( this, this.viewModel, true );

      this.viewModel.app = this.app;

      if ( !this.hasTemplate ) {

        _printDebug( "Applying bindings for component: " + this.id );
        _printDebug( "Dom element for " + this.id + " is:" );
        _printDebug( this.el );

        ko.applyBindings( this.viewModel, this.el );
        koUtils.markAsRegistered( this );
      }
    }
  } );
} )();
},{"./conf":4,"./utils/component":6,"./utils/viewModel":8,"sc-kospeakbindingprovider":2}],6:[function(require,module,exports){
module.exports = function ( ko ) {

  var syncUtils = require( "./sync" )( ko );

  var updateComponentWhenViewModelChange = function ( key, component, viewModel ) {
    if ( viewModel[ key ].arrayBinding ) {
      component._subscriptions[ key ] = syncUtils.syncFromKoObsToSpeakObs( key, component, viewModel, ko );
    } else {
      if ( ko.isObservable( viewModel[ key ] ) ) {
        component._subscriptions[ key ] = viewModel[ key ].subscribe( syncUtils.updateComponent( key, component, viewModel ) );
      }
    }
  };

  return {
    updateComponentWhenViewModelChange: updateComponentWhenViewModelChange
  };
};
},{"./sync":7}],7:[function(require,module,exports){
module.exports = function( ko ) { //keep reference to ko
  var updateViewModel = function( key, model, viewModel ) {
      return function() {
        if ( Array.isArray( model[ key ] ) && model[ key ].length > 0 && model[ key ][ 0 ] ) {
          //should desable the 
          viewModel[ key ]._changing = true;
          if ( viewModel[ key ]().length > 0) {
              viewModel[ key ].removeAll();
          }

          model[ key ].forEach( function( i ) {
            viewModel[ key ].push( i );
          } );
          viewModel[ key ]._changing = false;
          return;
        }
        
        if(!Array.isArray(model[key])) {
          viewModel[ key ]( model[ key ] );
        }
      };
    },
    syncFromSpeakObsToKoObs = function( key, model, viewModel ) {
      var appropriateFunc = function( funcToCall ) {
        var callToCall = funcToCall;

        return function() {
          if ( !viewModel[ key ]._changing ) {
            viewModel[ key ]._changing = true;
            viewModel[ key ][ callToCall ].apply( viewModel[ key ], arguments );
            viewModel[ key ]._changing = false;
          }
        };
      };

      model[ key ].on( "push", appropriateFunc( "push" ) );
      model[ key ].on( "pop", appropriateFunc( "pop" ) );
      model[ key ].on( "slice", appropriateFunc( "slice" ) );
      model[ key ].on( "concat", appropriateFunc( "concat" ) );
      model[ key ].on( "shift", appropriateFunc( "shift" ) );
      model[ key ].on( "unshift", appropriateFunc( "unshift" ) );
      model[ key ].on( "reverse", appropriateFunc( "reverse" ) );
      model[ key ].on( "sort", appropriateFunc( "sort" ) );
    },
    syncFromKoObsToSpeakObs = function( key, model, viewModel ) {
      var previousValue;

      viewModel[ key ].subscribe( function( _previousValue ) {
        previousValue = _previousValue.slice( 0 );
      }, undefined, "beforeChange" );

      return viewModel[ key ].subscribe( function( latestValue ) {

        var editScript = ko.utils.compareArrays( previousValue, latestValue );

        //viewModel[ key ]._changing = false;
        for ( var i = 0, j = editScript.length; i < j; i++ ) {
          var index = ko.utils.arrayIndexOf( model[ key ].array || model[ key ], editScript[ i ].value );

          switch ( editScript[ i ].status ) {
            case "retained":
              break;
            case "deleted":
              if ( index >= 0 && !viewModel[ key ]._changing ) {
                model[ key ].splice( index, 1 );
              }
              break;
            case "added":
              if ( !viewModel[ key ]._changing ) {
                if ( editScript[ i ].index === 0 ) {
                  model[ key ].unshift( editScript[ i ].value );
                } else {
                  model[ key ].push( editScript[ i ].value );
                }
              }
              break;
          }
        }
        if ( !model[ key ].array && !viewModel[ key ]._changing ) { //this is an original, should manually trigger the change
          model.trigger( "change:" + key, model.get( key ) );
          viewModel[ key ]._changing = false;
        }
        previousValue = undefined;
      } );
    },
    updateComponent = function( key, model, viewModel ) {
      return function( newValue ) {
        if ( !viewModel[ key ]._changing ) {
          model[ key ] = newValue;
        }
      };
    };

  return {
    updateViewModel: updateViewModel,
    syncFromSpeakObsToKoObs: syncFromSpeakObsToKoObs,
    syncFromKoObsToSpeakObs: syncFromKoObsToSpeakObs,
    updateComponent: updateComponent
  };
};
},{}],8:[function(require,module,exports){
module.exports = function( ko ) {

  var syncUtils = require( "./sync" )( ko );

  var buildComputed = function( model, viewModel ) {
      var computedConfiguration = model.computed || {},
        keys = Object.keys( computedConfiguration );

      keys.forEach( function( key ) {
        var computed = computedConfiguration[ key ];

        if ( computed[ key ][ "write" ] && !computed[ key ][ "owner" ] ) {
          computed[ key ][ "owner" ] = viewModel;
        }

        if ( !computed.write ) {
          viewModel[ key ] = ko.computed( computed.read, viewModel ); //be carefully you can only value already defined
        } else {
          viewModel[ key ] = ko.computed( computed ); //be carefully you can only value already defined
        }
        viewModel[ key ].isComputed = true;
      } );
    },
    updateViewModelWhenComponentChange = function( key, component, viewModel ) {
      var model = component;

      if ( typeof model[ key ] === "function" ) {
        return;
      }

      if ( viewModel[ key ].arrayType !== "speak" ) {
        model.on( "change:" + key, syncUtils.updateViewModel( key, model, viewModel ) );
      } else {
        //this will sync both array from Model and viewModel
        syncUtils.syncFromSpeakObsToKoObs( key, model, viewModel );
      }
    },
    buildPropertyForViewModel = function( key, component, viewModel, force ) {
      var vm = viewModel,
        value = component[ key ],
        isSPEAKObs = ( value && value.array ),
        isArray = Array.isArray( value ),
        arrayToBind;

      if ( vm[ key ] || !force ) { //if we do not force and key already exists, we skip it
        return;
      }

      if ( isArray || isSPEAKObs ) { //if it is an array
        arrayToBind = isSPEAKObs ? value.array : value;

        vm[ key ] = ko.observableArray( arrayToBind.slice( 0 ) );
        vm[ key ].arrayBinding = true;
        vm[ key ].arrayType = isSPEAKObs ? "speak" : "original";

      } else if ( component._s.utils.is.a.function( value ) ) { //if it is a function

        if ( !vm[ key ] && component._s.utils.is.a.function( value ) ) {
          vm[ key ] = function() {
            return component[ key ].call( component, arguments );
          };
        }
      } else if ( ko.isObservable( value ) ) { //if it is a an observable

        vm[ key ] = value; //leave it alone if it is already a observable

      } else { //then it is a regular property
        vm[ key ] = ko.observable( value );
      }
    };

  return {
    buildPropertyForViewModel: buildPropertyForViewModel,
    updateViewModelWhenComponentChange: updateViewModelWhenComponentChange,
    buildComputed: buildComputed
  };
};
},{"./sync":7}]},{},[5])
;