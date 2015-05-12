/**!
 *
 * scBindingPlugin
 *
 * Built: Tue Oct 28 2014 11:25:38 GMT+0000 (GMT Standard Time)
 * PackageVersion: 0.1.1
 *
 */

;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function( speakUtils, isDebug ) {
    var utils = require( "./utils" )( isDebug );

    var Binding = function( bindingConfiguration ) {
        this.bindingConfiguration = bindingConfiguration;
    };

    var resolve = function( component, to, callback ) {
        if ( to.indexOf( "." ) === -1 ) {
            return {
                component: component,
                lastProperty: to
            };
        }

        var toAttributeParts = to.split( "." ),
            lastProperty = toAttributeParts.pop(),
            toAttributePartslength = toAttributeParts.length,
            comp = component;

        for ( var i = 0; i < toAttributePartslength; i++ ) {
            comp = comp[ toAttributeParts[ i ] ];
        }

        return {
            component: comp,
            lastProperty: lastProperty
        };
    };

    Binding.prototype.getValue = function( binding ) {
        if ( binding.converter ) {
            var parameters = [];

            binding.from.forEach( function( setup ) {
                parameters.push( setup.component[ setup.attribute ] );
            } );

            return binding.converter( parameters );
        }

        var singleModel = binding.from[ 0 ].component,
            attr = binding.from[ 0 ].attribute;

        if ( utils.isComponentProperty( singleModel, attr ) ) {
            if ( singleModel.depricated ) {
                attr = utils.lowerCaseFirstLetter( attr );
            }

            value = singleModel.get( attr );
        } else {
            var res = resolve( singleModel, attr );
            value = res.component[ res.lastProperty ];
        }

        utils._printDebug( "      we set the value to: " + value );

        return value;

    };

    Binding.prototype._synchronizeProperty = function( binding ) {
        //We initialize the value of the current component to the value of the component's value defined by the bindings
        //NOTE: for multiple bindings, the last one will win for initializing the value
        var self = this;
        if ( utils.isComponentProperty( binding.component, binding.to ) ) {
            return binding.component.set( binding.to, this.getValue( binding ) );
        }

        var res = resolve( binding.component, binding.to );

        res.component[ res.lastProperty ] = this.getValue( binding );
    };

    Binding.prototype._registerChanges = function( binding, source ) {
        var self = this;
        //When the source component change, we update the current component
        var callback = function( newValue ) {
            self._synchronizeProperty( binding );
        };

        if ( source.component.subscribe ) {
            source.component.subscribe( "change:" + source.attribute, callback );
        } else if ( !source.component.subscribe && source.component.on ) {
            source.component.on( "change:" + source.attribute, callback );
        } else {
            throw new Error( "Component " + source.component.id + " not suited for Bindings" );
        }
    };

    Binding.prototype.syncAndRegisterChanges = function() {
        var self = this;
        //For Each bindingConfiguration
        this.bindingConfiguration.forEach( function( binding ) {
            utils._printDebug( "Applying bindings for the component: " + ( binding.component.id ? binding.component.id : "$app" ) );
            utils._printDebug( "  for the property: " + binding.to );
            //and for each component used as source for the bindings
            binding.from.forEach( function( source ) {

                utils._printDebug( "    We initialize the value from the component: " + ( source.component ? source.component.id : "a piece of $data" ) );

                self._synchronizeProperty( binding );
                self._registerChanges( binding, source );

            } );
        } );
    };

    return Binding;
};
},{"./utils":5}],2:[function(require,module,exports){
module.exports = function( speakUtils, converterApi, isDebug ) {
    var utils = require( "./utils" )( isDebug );
    /**
     * Create the bindings for a single component
     * @param  {Object} component                Component where the binding will be setup
     * @param  {Object} jsonBindingConfiguration JSON Object which represent a bindingConfiguration
     * ex: { "text": "XBinding2.text" }, {"text":{"mode":"twoway","parameters":["TextOustide2.text"]}}, {"text":{"converter":"Has","parameters":["Text1.text"]}}
     * @param  {Object} data                     Object used for bindings not set to a Component to a classic Object
     */
    var BindingConfigurationBuilder = function( component, jsonBindingConfiguration, isTwoWay, isData, isApp ) {
        this.component = component;
        this.bindingConfiguration = jsonBindingConfiguration;
        this.isTwoWay = isTwoWay;
        this.isData = isData;
        this.isApp = isApp;
    };

    BindingConfigurationBuilder.prototype._createBindingConfigurationForProperty = function( property, bindingConfig ) {
        var bindingConfForProperty = [];

        if ( !speakUtils.is.an.object( bindingConfig ) ) { //simple binding
            var bindingConfigInObject = {
                parameters: [ bindingConfig ]
            };
            bindingConfig = bindingConfigInObject;
        }

        bindingConfForProperty = bindingConfForProperty.concat( this._createBindingConfigurationForPropertyFromObject( property, bindingConfig ) );

        return bindingConfForProperty;
    };

    BindingConfigurationBuilder.prototype._createBindingConfigurationForPropertyFromObject = function( property, bindingConfig ) {
        var result = [],
            from = [],
            converter = converterApi.getConverter( bindingConfig.converter ),
            currentApp = this.isApp ? this.component : this.component.app,
            self = this;

        bindingConfig.parameters.forEach( function( value ) {
            var componentAndMetaData = utils.getComponentAndBindingMetaData( value, currentApp, self.isData ? self.bindingConfiguration.$data : void 0 );
            //var compMetaData = utils.getComponentAndBindingMetaData( value );
            //var fromComponent = self.isData ? self.bindingConfiguration.$data : utils.findComponent( self.component.app, compMetaData.fullCompName );

            from.push( {
                component: componentAndMetaData.component,
                attribute: componentAndMetaData.attribute
            } );

            if ( self.isTwoWay || bindingConfig.mode && bindingConfig.mode.toLowerCase() === "twoway" ) {
                var reverseBinding = {};
                var compName = self.isApp ? "$app" : utils.getFullComponentNameFromComponent( self.component );
                var isData = false,
                    isApp = ( componentAndMetaData.fullCompName === "$app" ) ? true : false;

                if ( !compName ) {
                    reverseBinding[ componentAndMetaData.attribute ] = "$data." + property;
                    reverseBinding.$data = self.component;
                    isData = true;
                } else {
                    reverseBinding[ componentAndMetaData.attribute ] = compName + "." + property;
                }

                var bindingConfBuilder = new BindingConfigurationBuilder( componentAndMetaData.component, reverseBinding, false, isData, isApp );

                result = result.concat( bindingConfBuilder.generate() );
            }

            result.push( {
                from: from,
                to: property,
                converter: converter,
                component: self.component
            } );

        } );

        return result.reverse();
    },

    //Create a binding configuration based on the config set on the data-sc-bindings
    //List of bindingConfiguration is an array which looks like:
    //
    //[
    //  {
    //    from: [
    //            {
    //              component: "Component - component which will be used for setting the value",
    //              attribute: "String - property used to set the value"
    //            }
    //          ],
    //    to: "String - component's property that will be set",
    //    component: "Component - currentComponent (the one from the EL)"
    //  }, ...
    //]
    BindingConfigurationBuilder.prototype.generate = function() {
        var result = [],
            self = this;

        if ( !this.bindingConfiguration ) {
            return result;
        }

        utils.forEachPropertyWithBinding( this.bindingConfiguration, function( property, propertyBindingConfiguration ) {

            if ( self.component.depricated ) {
                property = utils.lowerCaseFirstLetter( property );
            }

            if ( speakUtils.is.an.array( propertyBindingConfiguration ) ) {
                propertyBindingConfiguration.forEach( function( propertyConf ) {
                    result = result.concat( self._createBindingConfigurationForProperty( property, propertyConf ) );
                } );
            } else {
                result = result.concat( self._createBindingConfigurationForProperty( property, propertyBindingConfiguration ) );
            }
        } );

        return result;
    };

    return BindingConfigurationBuilder;
};
},{"./utils":5}],3:[function(require,module,exports){
var converters = {};

var converterApi = {
    getConverter: function( converterName ) {
        var converter = converters[ converterName ];
        if ( !converter ) {
            return undefined;
        }
        return converter;
    },
    createBindingConverter: function( convert ) {
        if ( !convert.name || !convert.convert ) {
            throw "invalid binding converter";
        }
        if ( converters[ convert.name ] ) {
            throw "already a converter with the same name";
        }

        converters[ convert.name ] = convert.convert;
    }
};

module.exports = converterApi;
},{}],4:[function(require,module,exports){
/*jshint loopfunc: true */
( function( global ) {
  var isBrowser = ( typeof window !== "undefined" ),
    sitecore = isBrowser && window.Sitecore ? window.Sitecore.Speak : requirejs( "boot" ),
    speakUtils = sitecore.utils,
    isDebug = Sitecore.Speak.isDebug(),
    converterApi = require( "./converter" ),
    BindingConfigurationBuilder = require( "./bindingConfiguration" )( speakUtils, converterApi, isDebug ),
    Binding = require( "./binding" )( speakUtils, isDebug ),
    utils = require( "./utils" )( isDebug );

  /**
   * Create the bindings for a single component
   * @param  {Object} component                Component where the binding will be setup
   * @param  {Object} jsonBindingConfiguration JSON Object which represent a bindingConfiguration
   * @param  {Object} data                     Object used for bindings not set to a Component to a classic Object
   */
  var createBinding = function( component, jsonBindingConfiguration, isTwoWays ) {
    var bindingConfigurationBuilder = new BindingConfigurationBuilder( component, jsonBindingConfiguration, isTwoWays ),
      bindingConfigurationForAComponent = bindingConfigurationBuilder.generate();

    if ( bindingConfigurationForAComponent.length === 0 ) {
      return;
    }

    var binding = new Binding( bindingConfigurationForAComponent );

    binding.syncAndRegisterChanges();
  };

  Sitecore.Speak.module( "bindings", {
    applyBindings: function( data, config, app ) {
      data.app = app;
      createBinding( data, config, true, true );
    },
    createBindingConverter: function( convert ) {
      converterApi.createBindingConverter( convert );
    }
  } );

  Sitecore.Speak.module( "bindings" ).createBindingConverter( {
    name: "Has",
    convert: function( array ) {
      if ( array && array[ 0 ] ) {
        if ( Array.isArray( array[ 0 ] ) ) {
          if ( array[ 0 ].length === 0 ) {
            return false;
          }
          return true;
        }
        return true;
      }
      return false;
    }
  } );

  Sitecore.Speak.module( "bindings" ).createBindingConverter( {
    name: "Not",
    convert: function( array ) {
      return !( array && array[ 0 ] );
    }
  } );

  Sitecore.Speak.plugin( {
    name: "bindings",
    extendApplication: function( app ) {

      //For each component into this application (app)
      app.components.forEach( function( comp ) {
        var bindingConfiguration = comp.el.getAttribute( "data-sc-bindings" );

        if ( bindingConfiguration ) {
          createBinding( comp, JSON.parse( bindingConfiguration ) );
        }
      } );
    }
  } );
} )( this );
},{"./binding":1,"./bindingConfiguration":2,"./converter":3,"./utils":5}],5:[function(require,module,exports){
module.exports = function( isDebug ) {
    return {
        _printDebug: function( string, type ) {
            if ( !type ) {
                type = "log";
            }
            if ( isDebug ) {
                console[ type ]( string );
            }
        },
        isComponentProperty: function( component, property ) {
            if ( component.set && ( property in component.__properties ) ) { //I know it is private, should add a method in SPEAK
                return true;
            }

            return false;
        },
        lowerCaseFirstLetter: function( string ) {
            return string.charAt( 0 ).toLowerCase() + string.slice( 1 );
        },
        findComponent: function( app, componentKey ) {
            var componentSplitByName = componentKey.split( "." ),
                result = app,
                levelOfNest = componentSplitByName.length;

            if ( componentSplitByName.length === 1 ) {
                return app[ componentKey ];
            }

            for ( var i = 0; i < levelOfNest; i++ ) {
                result = result[ componentSplitByName[ i ] ];
            }

            return result;
        },
        /**
         * nameWithAttribute can be:
         *     - CompName.PropertyName
         *     - ParentName.CompName.PropertyName
         *     - CompName.PropertyName.PropertyName
         *     - ParentName.CompName.PropertyName
         */
        getComponentAndBindingMetaData: function( nameWithAttribute, app, data ) {
            var compMetaData = this.getFullComponentNameAndAttribute( nameWithAttribute ), //first call assume, only one property at the end
                compNameParts = compMetaData.fullCompName.split( "." ),
                itemLength = compNameParts.length,
                addedProperty = [],
                comp;

            if ( data ) {
                return {
                    component: data,
                    attribute: compMetaData.attribute,
                    fullCompName: compMetaData.fullCompName
                };
            }

            if ( compMetaData.fullCompName === "$app" ) {
                return {
                    component: app,
                    attribute: compMetaData.attribute,
                    fullCompName: compMetaData.fullCompName
                };
            }

            while ( itemLength-- ) {
                comp = this.findComponent( app, compNameParts.join( "." ) );

                if ( comp.app ) {
                    break;
                }

                addedProperty.push( compNameParts.pop() );
            }

            return {
                component: comp,
                attribute: ( addedProperty.length > 0 ) ? addedProperty.reverse().join( "." ) + "." + compMetaData.attribute : compMetaData.attribute,
                fullCompName: compNameParts ? compNameParts.join( "." ) : void 0
            };
        },
        getFullComponentNameAndAttribute: function( nameWithAttribute, depricated ) {
            var onlyCompName = nameWithAttribute.split( "." ),
                attribute = onlyCompName.pop();

            if ( Array.isArray( onlyCompName ) && onlyCompName.length > 1 ) {
                compName = onlyCompName.join( "." );
            } else {
                compName = onlyCompName[ 0 ];
            }

            return {
                fullCompName: compName,
                attribute: depricated ? utils.lowerCaseFirstLetter( source.attribute ) : attribute
            };
        },
        getFullComponentNameFromComponent: function( comp ) {
            var memo = comp,
                result = comp.id;

            while ( memo.parent ) {
                result = comp.parent.id + "." + result;
                memo = comp.parent;
            }

            return result;
        },
        forEachPropertyWithBinding: function( config, callback ) {
            Object.keys( config ).forEach( function( property ) {
                if ( property !== "$data" ) {
                    callback( property, config[ property ] );
                }
            } );
        }
    };
};
},{}]},{},[4])
;