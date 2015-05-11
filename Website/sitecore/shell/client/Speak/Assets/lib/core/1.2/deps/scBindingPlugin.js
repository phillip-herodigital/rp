/**!
 *
 * scBindingPlugin
 *
 * Built: Wed Jun 25 2014 16:14:16 GMT+0100 (GMT Daylight Time)
 * PackageVersion: 0.1.1
 *
 */

;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*jshint loopfunc: true */
( function( global ) {
  //var bindingJS = require( "sc-bindingJS" );
  var isBrowser = ( typeof window !== "undefined" ),
    sitecore = isBrowser && window.Sitecore ? window.Sitecore.Speak : requirejs( "boot" ),
    converters = {},
    isObject = function( obj ) {
      return obj === Object( obj );
    },
    isFunction = function( content ) {
      return typeof content === "function";
    },
    isDebug = Sitecore.Speak.isDebug(),
    _printDebug = function( string, type ) {
      if ( !type ) {
        type = "log";
      }
      if ( isDebug ) {
        console[ type ]( string );
      }
    },
    lowerCaseFirstLetter = function( string ) {
      return string.charAt( 0 ).toLowerCase() + string.slice( 1 );
    },
    findComponent = function( app, componentKey ) {
      var result;
      app.components.forEach( function( c ) {
        if ( !result && c.id === componentKey ) {
          result = c;
        }
      } );

      return result;
    },
    getConverter = function( converterName ) {
      var converter = converters[ converterName ];
      if ( !converter ) {
        return undefined;
      } else {
        return converter;
      }
    },
    getValue = function( binding ) {
      if ( binding.converter ) {
        var parameters = [];

        _.each( binding.from, function( setup ) {
          parameters.push( setup.model[ setup.attribute ] );
        } );

        return binding.converter( parameters );
      } else {
        var singleModel = binding.from[ 0 ].component,
          attr = binding.from[ 0 ].attribute;

        if ( isFunction( singleModel.get ) ) {
          if ( singleModel.depricated ) {
            attr = lowerCaseFirstLetter( attr );
          }
          value = singleModel.get( attr );
        } else {
          value = singleModel[ attr ];
        }

        _printDebug( "      we set the value to: " + value );

        return value;
      }
    },
    createBindingConfiguration = function( comp, bindingConf, data ) {
      var component = comp,
        config = bindingConf,
        result = [];

      if ( !config ) {
        return result;
      }

      Object.keys( config ).forEach( function( key ) {
        var bindingConfiguration = {
            from: [],
            to: key,
            converter: undefined,
            component: component
          },
          singleKeyConfig = config[ key ],
          modelPath,
          from,
          attribute;

        if ( !isObject( singleKeyConfig ) ) {
          var compName = singleKeyConfig.split( "." )[ 0 ];
          from = data || findComponent( comp.app, compName );

          if ( !from ) {
            throw new Error( "Could not find Component " + compName + " when applying binding from " + comp.id );
          }

          attribute = singleKeyConfig.split( "." )[ 1 ];

          bindingConfiguration.from.push( {
            component: from,
            attribute: attribute
          } );
          result.push( bindingConfiguration );
        } else if ( config.length ) {
          var addBinding = function( conf ) {
            from = data || findComponent( comp.app, conf.split( "." )[ 0 ] );

            result.push( {
              from: [ {
                component: from,
                attribute: conf.split( "." )[ 1 ]
              } ],
              to: key,
              converter: undefined,
              component: component
            } );
          };

          config.forEach( addBinding );
        } else {
          bindingConfiguration.converter = getConverter( singleKeyConfig );

          singleKeyConfig.parameters.forEach( function( value ) {
            from = data || findComponent( comp.app, value.split( "." )[ 0 ] );
            attribute = value.split( "." )[ 1 ];

            bindingConfiguration.from.push( {
              component: from,
              attribute: attribute
            } );
          } );

          result.push( bindingConfiguration );
        }
      } );

      return result;
    },
    /**
     * Create the bindings for a single component
     * @param  {Object} component                Component where the binding will be setup
     * @param  {Object} jsonBindingConfiguration JSON Object which represent a bindingConfiguration
     * @param  {Object} data                     Object used for bindings not set to a Component to a classic Object
     */
    createBinding = function( component, jsonBindingConfiguration, data ) {

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
      var bindingForComponent = createBindingConfiguration( component, jsonBindingConfiguration, data );

      if ( bindingForComponent.length === 0 ) {
        return;
      }
      //For Each bindingConfiguration
      bindingForComponent.forEach( function( binding ) {

        _printDebug( "Applying bindings for the component: " + binding.component.id );
        _printDebug( "  for the property: " + binding.to );

        if ( binding.component.depricated ) {
          binding.to = lowerCaseFirstLetter( binding.to );
        }
        //and for each component used as source for the bindings
        binding.from.forEach( function( source ) {

          _printDebug( "    We initialize the value from the component: " + source.component.id );

          if ( source.component.depricated ) {
            source.attribute = lowerCaseFirstLetter( source.attribute );
          }
          //We initialize the value of the current component to the value of the component's value defined by the bindings
          //NOTE: for multiple bindings, the last one will win for initializing the value
          if ( isFunction( binding.component.set ) ) {
            binding.component.set( binding.to, getValue( binding ) );
          } else {
            binding.component[ binding.to ] = getValue( binding );
          }

          //When the source component change, we update the current component
          var callback = function( newValue ) {

            _printDebug( "We have received a change from " + source.component.id + ":" + binding.to + ", so we update the value for: " + binding.component.id + "." + binding.to );
            if ( isFunction( binding.component.set ) ) {
              binding.component.set( binding.to, getValue( binding ) );
            } else {
              binding.component[ binding.to ] = getValue( binding );
            }
          };

          if ( source.component.subscribe ) {
            source.component.subscribe( "change:" + source.attribute, callback );
          } else if ( !source.component.subscribe && source.component.on ) {
            source.component.on( "change:" + source.attribute, callback );
          } else {
            throw new Error( "Component " + source.component.id + " not suited for Bindings" );
          }

        } );

      } );
    },
    createBindingFromData = function( data, config, app ) {
      for ( var key in config ) {
        if ( config.hasOwnProperty( key ) ) {

          var pathToProperties = config[ key ];

          var addBinding = function( propertyConfig ) {
            var comp = findComponent( app, propertyConfig.split( "." )[ 0 ] ),
              pivotConfig = {},
              property = propertyConfig.split( "." )[ 1 ];

            //TODO: if the property is an array, we need to loop to that array
            //and add one more config
            pivotConfig[ property ] = "data." + key;
            createBinding( comp, pivotConfig, data );
          };

          if ( Array.isArray( pathToProperties ) ) {
            pathToProperties.forEach( addBinding );
          } else {
            addBinding( pathToProperties );
          }
        }
      }
    },
    syncComponentfromData = function( data, config, app ) {
      for ( var key in config ) {
        if ( config.hasOwnProperty( key ) ) {

          var pathToProperties = config[ key ],
            sync = function( propertyConfig ) {
              var comp = findComponent( app, propertyConfig.split( "." )[ 0 ] ),
                property = propertyConfig.split( "." )[ 1 ];

              comp[ property ] = data[ key ];
            };

          if ( Array.isArray( pathToProperties ) ) {
            pathToProperties.forEach( sync );
          } else {
            sync( pathToProperties );
          }
        }
      }
    };

  Sitecore.Speak.module( "bindings", {
    applyBindings: function( data, config, app ) {
      var arrConfig = config[ "data" ];
      if ( arrConfig ) {
        var comp = findComponent( app, arrConfig.split( "." )[ 0 ] );
        //when it is an array we just set the data automaticaly to the appropriate component
        if ( comp.set ) {
          comp.set( arrConfig.split( "." )[ 1 ], data );
        } else {
          comp[ arrConfig.split( "." )[ 1 ] ] = data;
        }
      } else {
        data.app = app;

        //TODO: refactor to integrate sync inside the createBinding
        syncComponentfromData( data, config, app );
        createBinding( data, config ); //this is just one way from component to data
        createBindingFromData( data, config, app );
      }
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
  } );

  Sitecore.Speak.module( "bindings" ).createBindingConverter( {
    name: "Has",
    convert: function( array ) {
      if ( array && array[ 0 ] ) {
        if ( _.isArray( array[ 0 ] ) ) {
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
        //We extract the binding configuration from the attribute data-sc-bindings from the DOM element of the Component
        //and apply the bindings.
        //  
        //The binding configuration is a JSON object which looks like this:
        //
        //  { Text: FromComponent.Text }
        //
        //  Result:
        //  This will bind the Text property from the component called "FromComponent"
        //  with the Text property of the current component (the one defined by the current DOM element).
        var bindingConfiguration = comp.el.getAttribute( "data-sc-bindings" );

        if ( bindingConfiguration ) {
          createBinding( comp, JSON.parse( bindingConfiguration ) );
        }
      } );
    }
  } );
} )( this );
},{}]},{},[1])
;