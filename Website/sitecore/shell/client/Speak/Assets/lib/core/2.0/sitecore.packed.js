/*!

 handlebars v3.0.1

Copyright (C) 2011-2014 by Yehuda Katz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

@license
*/
/* exported Handlebars */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Handlebars = factory();
  }
}(this, function () {
// handlebars/utils.js
var __module3__ = (function() {
  "use strict";
  var __exports__ = {};
  /*jshint -W004 */
  var escape = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "`": "&#x60;"
  };

  var badChars = /[&<>"'`]/g;
  var possible = /[&<>"'`]/;

  function escapeChar(chr) {
    return escape[chr];
  }

  function extend(obj /* , ...source */) {
    for (var i = 1; i < arguments.length; i++) {
      for (var key in arguments[i]) {
        if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
          obj[key] = arguments[i][key];
        }
      }
    }

    return obj;
  }

  __exports__.extend = extend;var toString = Object.prototype.toString;
  __exports__.toString = toString;
  // Sourced from lodash
  // https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
  var isFunction = function(value) {
    return typeof value === 'function';
  };
  // fallback for older versions of Chrome and Safari
  /* istanbul ignore next */
  if (isFunction(/x/)) {
    isFunction = function(value) {
      return typeof value === 'function' && toString.call(value) === '[object Function]';
    };
  }
  var isFunction;
  __exports__.isFunction = isFunction;
  /* istanbul ignore next */
  var isArray = Array.isArray || function(value) {
    return (value && typeof value === 'object') ? toString.call(value) === '[object Array]' : false;
  };
  __exports__.isArray = isArray;
  // Older IE versions do not directly support indexOf so we must implement our own, sadly.
  function indexOf(array, value) {
    for (var i = 0, len = array.length; i < len; i++) {
      if (array[i] === value) {
        return i;
      }
    }
    return -1;
  }

  __exports__.indexOf = indexOf;
  function escapeExpression(string) {
    if (typeof string !== 'string') {
      // don't escape SafeStrings, since they're already safe
      if (string && string.toHTML) {
        return string.toHTML();
      } else if (string == null) {
        return '';
      } else if (!string) {
        return string + '';
      }

      // Force a string conversion as this will be done by the append regardless and
      // the regex test will do this transparently behind the scenes, causing issues if
      // an object's to string has escaped characters in it.
      string = '' + string;
    }

    if (!possible.test(string)) { return string; }
    return string.replace(badChars, escapeChar);
  }

  __exports__.escapeExpression = escapeExpression;function isEmpty(value) {
    if (!value && value !== 0) {
      return true;
    } else if (isArray(value) && value.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  __exports__.isEmpty = isEmpty;function blockParams(params, ids) {
    params.path = ids;
    return params;
  }

  __exports__.blockParams = blockParams;function appendContextPath(contextPath, id) {
    return (contextPath ? contextPath + '.' : '') + id;
  }

  __exports__.appendContextPath = appendContextPath;
  return __exports__;
})();

// handlebars/exception.js
var __module4__ = (function() {
  "use strict";
  var __exports__;

  var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

  function Exception(message, node) {
    var loc = node && node.loc,
        line,
        column;
    if (loc) {
      line = loc.start.line;
      column = loc.start.column;

      message += ' - ' + line + ':' + column;
    }

    var tmp = Error.prototype.constructor.call(this, message);

    // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
    for (var idx = 0; idx < errorProps.length; idx++) {
      this[errorProps[idx]] = tmp[errorProps[idx]];
    }

    if (loc) {
      this.lineNumber = line;
      this.column = column;
    }
  }

  Exception.prototype = new Error();

  __exports__ = Exception;
  return __exports__;
})();

// handlebars/base.js
var __module2__ = (function(__dependency1__, __dependency2__) {
  "use strict";
  var __exports__ = {};
  var Utils = __dependency1__;
  var Exception = __dependency2__;

  var VERSION = "3.0.1";
  __exports__.VERSION = VERSION;var COMPILER_REVISION = 6;
  __exports__.COMPILER_REVISION = COMPILER_REVISION;
  var REVISION_CHANGES = {
    1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
    2: '== 1.0.0-rc.3',
    3: '== 1.0.0-rc.4',
    4: '== 1.x.x',
    5: '== 2.0.0-alpha.x',
    6: '>= 2.0.0-beta.1'
  };
  __exports__.REVISION_CHANGES = REVISION_CHANGES;
  var isArray = Utils.isArray,
      isFunction = Utils.isFunction,
      toString = Utils.toString,
      objectType = '[object Object]';

  function HandlebarsEnvironment(helpers, partials) {
    this.helpers = helpers || {};
    this.partials = partials || {};

    registerDefaultHelpers(this);
  }

  __exports__.HandlebarsEnvironment = HandlebarsEnvironment;HandlebarsEnvironment.prototype = {
    constructor: HandlebarsEnvironment,

    logger: logger,
    log: log,

    registerHelper: function(name, fn) {
      if (toString.call(name) === objectType) {
        if (fn) { throw new Exception('Arg not supported with multiple helpers'); }
        Utils.extend(this.helpers, name);
      } else {
        this.helpers[name] = fn;
      }
    },
    unregisterHelper: function(name) {
      delete this.helpers[name];
    },

    registerPartial: function(name, partial) {
      if (toString.call(name) === objectType) {
        Utils.extend(this.partials,  name);
      } else {
        if (typeof partial === 'undefined') {
          throw new Exception('Attempting to register a partial as undefined');
        }
        this.partials[name] = partial;
      }
    },
    unregisterPartial: function(name) {
      delete this.partials[name];
    }
  };

  function registerDefaultHelpers(instance) {
    instance.registerHelper('helperMissing', function(/* [args, ]options */) {
      if(arguments.length === 1) {
        // A missing field in a {{foo}} constuct.
        return undefined;
      } else {
        // Someone is actually trying to call something, blow up.
        throw new Exception("Missing helper: '" + arguments[arguments.length-1].name + "'");
      }
    });

    instance.registerHelper('blockHelperMissing', function(context, options) {
      var inverse = options.inverse,
          fn = options.fn;

      if(context === true) {
        return fn(this);
      } else if(context === false || context == null) {
        return inverse(this);
      } else if (isArray(context)) {
        if(context.length > 0) {
          if (options.ids) {
            options.ids = [options.name];
          }

          return instance.helpers.each(context, options);
        } else {
          return inverse(this);
        }
      } else {
        if (options.data && options.ids) {
          var data = createFrame(options.data);
          data.contextPath = Utils.appendContextPath(options.data.contextPath, options.name);
          options = {data: data};
        }

        return fn(context, options);
      }
    });

    instance.registerHelper('each', function(context, options) {
      if (!options) {
        throw new Exception('Must pass iterator to #each');
      }

      var fn = options.fn, inverse = options.inverse;
      var i = 0, ret = "", data;

      var contextPath;
      if (options.data && options.ids) {
        contextPath = Utils.appendContextPath(options.data.contextPath, options.ids[0]) + '.';
      }

      if (isFunction(context)) { context = context.call(this); }

      if (options.data) {
        data = createFrame(options.data);
      }

      function execIteration(key, i, last) {
        if (data) {
          data.key = key;
          data.index = i;
          data.first = i === 0;
          data.last  = !!last;

          if (contextPath) {
            data.contextPath = contextPath + key;
          }
        }

        ret = ret + fn(context[key], {
          data: data,
          blockParams: Utils.blockParams([context[key], key], [contextPath + key, null])
        });
      }

      if(context && typeof context === 'object') {
        if (isArray(context)) {
          for(var j = context.length; i<j; i++) {
            execIteration(i, i, i === context.length-1);
          }
        } else {
          var priorKey;

          for(var key in context) {
            if(context.hasOwnProperty(key)) {
              // We're running the iterations one step out of sync so we can detect
              // the last iteration without have to scan the object twice and create
              // an itermediate keys array. 
              if (priorKey) {
                execIteration(priorKey, i-1);
              }
              priorKey = key;
              i++;
            }
          }
          if (priorKey) {
            execIteration(priorKey, i-1, true);
          }
        }
      }

      if(i === 0){
        ret = inverse(this);
      }

      return ret;
    });

    instance.registerHelper('if', function(conditional, options) {
      if (isFunction(conditional)) { conditional = conditional.call(this); }

      // Default behavior is to render the positive path if the value is truthy and not empty.
      // The `includeZero` option may be set to treat the condtional as purely not empty based on the
      // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
      if ((!options.hash.includeZero && !conditional) || Utils.isEmpty(conditional)) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    });

    instance.registerHelper('unless', function(conditional, options) {
      return instance.helpers['if'].call(this, conditional, {fn: options.inverse, inverse: options.fn, hash: options.hash});
    });

    instance.registerHelper('with', function(context, options) {
      if (isFunction(context)) { context = context.call(this); }

      var fn = options.fn;

      if (!Utils.isEmpty(context)) {
        if (options.data && options.ids) {
          var data = createFrame(options.data);
          data.contextPath = Utils.appendContextPath(options.data.contextPath, options.ids[0]);
          options = {data:data};
        }

        return fn(context, options);
      } else {
        return options.inverse(this);
      }
    });

    instance.registerHelper('log', function(message, options) {
      var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
      instance.log(level, message);
    });

    instance.registerHelper('lookup', function(obj, field) {
      return obj && obj[field];
    });
  }

  var logger = {
    methodMap: { 0: 'debug', 1: 'info', 2: 'warn', 3: 'error' },

    // State enum
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    level: 1,

    // Can be overridden in the host environment
    log: function(level, message) {
      if (typeof console !== 'undefined' && logger.level <= level) {
        var method = logger.methodMap[level];
        (console[method] || console.log).call(console, message);
      }
    }
  };
  __exports__.logger = logger;
  var log = logger.log;
  __exports__.log = log;
  var createFrame = function(object) {
    var frame = Utils.extend({}, object);
    frame._parent = object;
    return frame;
  };
  __exports__.createFrame = createFrame;
  return __exports__;
})(__module3__, __module4__);

// handlebars/safe-string.js
var __module5__ = (function() {
  "use strict";
  var __exports__;
  // Build out our basic SafeString type
  function SafeString(string) {
    this.string = string;
  }

  SafeString.prototype.toString = SafeString.prototype.toHTML = function() {
    return "" + this.string;
  };

  __exports__ = SafeString;
  return __exports__;
})();

// handlebars/runtime.js
var __module6__ = (function(__dependency1__, __dependency2__, __dependency3__) {
  "use strict";
  var __exports__ = {};
  var Utils = __dependency1__;
  var Exception = __dependency2__;
  var COMPILER_REVISION = __dependency3__.COMPILER_REVISION;
  var REVISION_CHANGES = __dependency3__.REVISION_CHANGES;
  var createFrame = __dependency3__.createFrame;

  function checkRevision(compilerInfo) {
    var compilerRevision = compilerInfo && compilerInfo[0] || 1,
        currentRevision = COMPILER_REVISION;

    if (compilerRevision !== currentRevision) {
      if (compilerRevision < currentRevision) {
        var runtimeVersions = REVISION_CHANGES[currentRevision],
            compilerVersions = REVISION_CHANGES[compilerRevision];
        throw new Exception("Template was precompiled with an older version of Handlebars than the current runtime. "+
              "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").");
      } else {
        // Use the embedded version info since the runtime doesn't know about this revision yet
        throw new Exception("Template was precompiled with a newer version of Handlebars than the current runtime. "+
              "Please update your runtime to a newer version ("+compilerInfo[1]+").");
      }
    }
  }

  __exports__.checkRevision = checkRevision;// TODO: Remove this line and break up compilePartial

  function template(templateSpec, env) {
    /* istanbul ignore next */
    if (!env) {
      throw new Exception("No environment passed to template");
    }
    if (!templateSpec || !templateSpec.main) {
      throw new Exception('Unknown template object: ' + typeof templateSpec);
    }

    // Note: Using env.VM references rather than local var references throughout this section to allow
    // for external users to override these as psuedo-supported APIs.
    env.VM.checkRevision(templateSpec.compiler);

    var invokePartialWrapper = function(partial, context, options) {
      if (options.hash) {
        context = Utils.extend({}, context, options.hash);
      }

      partial = env.VM.resolvePartial.call(this, partial, context, options);
      var result = env.VM.invokePartial.call(this, partial, context, options);

      if (result == null && env.compile) {
        options.partials[options.name] = env.compile(partial, templateSpec.compilerOptions, env);
        result = options.partials[options.name](context, options);
      }
      if (result != null) {
        if (options.indent) {
          var lines = result.split('\n');
          for (var i = 0, l = lines.length; i < l; i++) {
            if (!lines[i] && i + 1 === l) {
              break;
            }

            lines[i] = options.indent + lines[i];
          }
          result = lines.join('\n');
        }
        return result;
      } else {
        throw new Exception("The partial " + options.name + " could not be compiled when running in runtime-only mode");
      }
    };

    // Just add water
    var container = {
      strict: function(obj, name) {
        if (!(name in obj)) {
          throw new Exception('"' + name + '" not defined in ' + obj);
        }
        return obj[name];
      },
      lookup: function(depths, name) {
        var len = depths.length;
        for (var i = 0; i < len; i++) {
          if (depths[i] && depths[i][name] != null) {
            return depths[i][name];
          }
        }
      },
      lambda: function(current, context) {
        return typeof current === 'function' ? current.call(context) : current;
      },

      escapeExpression: Utils.escapeExpression,
      invokePartial: invokePartialWrapper,

      fn: function(i) {
        return templateSpec[i];
      },

      programs: [],
      program: function(i, data, declaredBlockParams, blockParams, depths) {
        var programWrapper = this.programs[i],
            fn = this.fn(i);
        if (data || depths || blockParams || declaredBlockParams) {
          programWrapper = program(this, i, fn, data, declaredBlockParams, blockParams, depths);
        } else if (!programWrapper) {
          programWrapper = this.programs[i] = program(this, i, fn);
        }
        return programWrapper;
      },

      data: function(data, depth) {
        while (data && depth--) {
          data = data._parent;
        }
        return data;
      },
      merge: function(param, common) {
        var ret = param || common;

        if (param && common && (param !== common)) {
          ret = Utils.extend({}, common, param);
        }

        return ret;
      },

      noop: env.VM.noop,
      compilerInfo: templateSpec.compiler
    };

    var ret = function(context, options) {
      options = options || {};
      var data = options.data;

      ret._setup(options);
      if (!options.partial && templateSpec.useData) {
        data = initData(context, data);
      }
      var depths,
          blockParams = templateSpec.useBlockParams ? [] : undefined;
      if (templateSpec.useDepths) {
        depths = options.depths ? [context].concat(options.depths) : [context];
      }

      return templateSpec.main.call(container, context, container.helpers, container.partials, data, blockParams, depths);
    };
    ret.isTop = true;

    ret._setup = function(options) {
      if (!options.partial) {
        container.helpers = container.merge(options.helpers, env.helpers);

        if (templateSpec.usePartial) {
          container.partials = container.merge(options.partials, env.partials);
        }
      } else {
        container.helpers = options.helpers;
        container.partials = options.partials;
      }
    };

    ret._child = function(i, data, blockParams, depths) {
      if (templateSpec.useBlockParams && !blockParams) {
        throw new Exception('must pass block params');
      }
      if (templateSpec.useDepths && !depths) {
        throw new Exception('must pass parent depths');
      }

      return program(container, i, templateSpec[i], data, 0, blockParams, depths);
    };
    return ret;
  }

  __exports__.template = template;function program(container, i, fn, data, declaredBlockParams, blockParams, depths) {
    var prog = function(context, options) {
      options = options || {};

      return fn.call(container,
          context,
          container.helpers, container.partials,
          options.data || data,
          blockParams && [options.blockParams].concat(blockParams),
          depths && [context].concat(depths));
    };
    prog.program = i;
    prog.depth = depths ? depths.length : 0;
    prog.blockParams = declaredBlockParams || 0;
    return prog;
  }

  __exports__.program = program;function resolvePartial(partial, context, options) {
    if (!partial) {
      partial = options.partials[options.name];
    } else if (!partial.call && !options.name) {
      // This is a dynamic partial that returned a string
      options.name = partial;
      partial = options.partials[partial];
    }
    return partial;
  }

  __exports__.resolvePartial = resolvePartial;function invokePartial(partial, context, options) {
    options.partial = true;

    if(partial === undefined) {
      throw new Exception("The partial " + options.name + " could not be found");
    } else if(partial instanceof Function) {
      return partial(context, options);
    }
  }

  __exports__.invokePartial = invokePartial;function noop() { return ""; }

  __exports__.noop = noop;function initData(context, data) {
    if (!data || !('root' in data)) {
      data = data ? createFrame(data) : {};
      data.root = context;
    }
    return data;
  }
  return __exports__;
})(__module3__, __module4__, __module2__);

// handlebars.runtime.js
var __module1__ = (function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__) {
  "use strict";
  var __exports__;
  /*globals Handlebars: true */
  var base = __dependency1__;

  // Each of these augment the Handlebars object. No need to setup here.
  // (This is done to easily share code between commonjs and browse envs)
  var SafeString = __dependency2__;
  var Exception = __dependency3__;
  var Utils = __dependency4__;
  var runtime = __dependency5__;

  // For compatibility and usage outside of module systems, make the Handlebars object a namespace
  var create = function() {
    var hb = new base.HandlebarsEnvironment();

    Utils.extend(hb, base);
    hb.SafeString = SafeString;
    hb.Exception = Exception;
    hb.Utils = Utils;
    hb.escapeExpression = Utils.escapeExpression;

    hb.VM = runtime;
    hb.template = function(spec) {
      return runtime.template(spec, hb);
    };

    return hb;
  };

  var Handlebars = create();
  Handlebars.create = create;

  /*jshint -W040 */
  /* istanbul ignore next */
  var root = typeof global !== 'undefined' ? global : window,
      $Handlebars = root.Handlebars;
  /* istanbul ignore next */
  Handlebars.noConflict = function() {
    if (root.Handlebars === Handlebars) {
      root.Handlebars = $Handlebars;
    }
  };

  Handlebars['default'] = Handlebars;

  __exports__ = Handlebars;
  return __exports__;
})(__module2__, __module5__, __module4__, __module3__, __module6__);

// handlebars/compiler/ast.js
var __module7__ = (function() {
  "use strict";
  var __exports__;
  var AST = {
    Program: function(statements, blockParams, strip, locInfo) {
      this.loc = locInfo;
      this.type = 'Program';
      this.body = statements;

      this.blockParams = blockParams;
      this.strip = strip;
    },

    MustacheStatement: function(path, params, hash, escaped, strip, locInfo) {
      this.loc = locInfo;
      this.type = 'MustacheStatement';

      this.path = path;
      this.params = params || [];
      this.hash = hash;
      this.escaped = escaped;

      this.strip = strip;
    },

    BlockStatement: function(path, params, hash, program, inverse, openStrip, inverseStrip, closeStrip, locInfo) {
      this.loc = locInfo;
      this.type = 'BlockStatement';

      this.path = path;
      this.params = params || [];
      this.hash = hash;
      this.program  = program;
      this.inverse  = inverse;

      this.openStrip = openStrip;
      this.inverseStrip = inverseStrip;
      this.closeStrip = closeStrip;
    },

    PartialStatement: function(name, params, hash, strip, locInfo) {
      this.loc = locInfo;
      this.type = 'PartialStatement';

      this.name = name;
      this.params = params || [];
      this.hash = hash;

      this.indent = '';
      this.strip = strip;
    },

    ContentStatement: function(string, locInfo) {
      this.loc = locInfo;
      this.type = 'ContentStatement';
      this.original = this.value = string;
    },

    CommentStatement: function(comment, strip, locInfo) {
      this.loc = locInfo;
      this.type = 'CommentStatement';
      this.value = comment;

      this.strip = strip;
    },

    SubExpression: function(path, params, hash, locInfo) {
      this.loc = locInfo;

      this.type = 'SubExpression';
      this.path = path;
      this.params = params || [];
      this.hash = hash;
    },

    PathExpression: function(data, depth, parts, original, locInfo) {
      this.loc = locInfo;
      this.type = 'PathExpression';

      this.data = data;
      this.original = original;
      this.parts    = parts;
      this.depth    = depth;
    },

    StringLiteral: function(string, locInfo) {
      this.loc = locInfo;
      this.type = 'StringLiteral';
      this.original =
        this.value = string;
    },

    NumberLiteral: function(number, locInfo) {
      this.loc = locInfo;
      this.type = 'NumberLiteral';
      this.original =
        this.value = Number(number);
    },

    BooleanLiteral: function(bool, locInfo) {
      this.loc = locInfo;
      this.type = 'BooleanLiteral';
      this.original =
        this.value = bool === 'true';
    },

    Hash: function(pairs, locInfo) {
      this.loc = locInfo;
      this.type = 'Hash';
      this.pairs = pairs;
    },
    HashPair: function(key, value, locInfo) {
      this.loc = locInfo;
      this.type = 'HashPair';
      this.key = key;
      this.value = value;
    },

    // Public API used to evaluate derived attributes regarding AST nodes
    helpers: {
      // a mustache is definitely a helper if:
      // * it is an eligible helper, and
      // * it has at least one parameter or hash segment
      // TODO: Make these public utility methods
      helperExpression: function(node) {
        return !!(node.type === 'SubExpression' || node.params.length || node.hash);
      },

      scopedId: function(path) {
        return (/^\.|this\b/).test(path.original);
      },

      // an ID is simple if it only has one part, and that part is not
      // `..` or `this`.
      simpleId: function(path) {
        return path.parts.length === 1 && !AST.helpers.scopedId(path) && !path.depth;
      }
    }
  };


  // Must be exported as an object rather than the root of the module as the jison lexer
  // must modify the object to operate properly.
  __exports__ = AST;
  return __exports__;
})();

// handlebars/compiler/parser.js
var __module9__ = (function() {
  "use strict";
  var __exports__;
  /* jshint ignore:start */
  /* istanbul ignore next */
  /* Jison generated parser */
  var handlebars = (function(){
  var parser = {trace: function trace() { },
  yy: {},
  symbols_: {"error":2,"root":3,"program":4,"EOF":5,"program_repetition0":6,"statement":7,"mustache":8,"block":9,"rawBlock":10,"partial":11,"content":12,"COMMENT":13,"CONTENT":14,"openRawBlock":15,"END_RAW_BLOCK":16,"OPEN_RAW_BLOCK":17,"helperName":18,"openRawBlock_repetition0":19,"openRawBlock_option0":20,"CLOSE_RAW_BLOCK":21,"openBlock":22,"block_option0":23,"closeBlock":24,"openInverse":25,"block_option1":26,"OPEN_BLOCK":27,"openBlock_repetition0":28,"openBlock_option0":29,"openBlock_option1":30,"CLOSE":31,"OPEN_INVERSE":32,"openInverse_repetition0":33,"openInverse_option0":34,"openInverse_option1":35,"openInverseChain":36,"OPEN_INVERSE_CHAIN":37,"openInverseChain_repetition0":38,"openInverseChain_option0":39,"openInverseChain_option1":40,"inverseAndProgram":41,"INVERSE":42,"inverseChain":43,"inverseChain_option0":44,"OPEN_ENDBLOCK":45,"OPEN":46,"mustache_repetition0":47,"mustache_option0":48,"OPEN_UNESCAPED":49,"mustache_repetition1":50,"mustache_option1":51,"CLOSE_UNESCAPED":52,"OPEN_PARTIAL":53,"partialName":54,"partial_repetition0":55,"partial_option0":56,"param":57,"sexpr":58,"OPEN_SEXPR":59,"sexpr_repetition0":60,"sexpr_option0":61,"CLOSE_SEXPR":62,"hash":63,"hash_repetition_plus0":64,"hashSegment":65,"ID":66,"EQUALS":67,"blockParams":68,"OPEN_BLOCK_PARAMS":69,"blockParams_repetition_plus0":70,"CLOSE_BLOCK_PARAMS":71,"path":72,"dataName":73,"STRING":74,"NUMBER":75,"BOOLEAN":76,"DATA":77,"pathSegments":78,"SEP":79,"$accept":0,"$end":1},
  terminals_: {2:"error",5:"EOF",13:"COMMENT",14:"CONTENT",16:"END_RAW_BLOCK",17:"OPEN_RAW_BLOCK",21:"CLOSE_RAW_BLOCK",27:"OPEN_BLOCK",31:"CLOSE",32:"OPEN_INVERSE",37:"OPEN_INVERSE_CHAIN",42:"INVERSE",45:"OPEN_ENDBLOCK",46:"OPEN",49:"OPEN_UNESCAPED",52:"CLOSE_UNESCAPED",53:"OPEN_PARTIAL",59:"OPEN_SEXPR",62:"CLOSE_SEXPR",66:"ID",67:"EQUALS",69:"OPEN_BLOCK_PARAMS",71:"CLOSE_BLOCK_PARAMS",74:"STRING",75:"NUMBER",76:"BOOLEAN",77:"DATA",79:"SEP"},
  productions_: [0,[3,2],[4,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[12,1],[10,3],[15,5],[9,4],[9,4],[22,6],[25,6],[36,6],[41,2],[43,3],[43,1],[24,3],[8,5],[8,5],[11,5],[57,1],[57,1],[58,5],[63,1],[65,3],[68,3],[18,1],[18,1],[18,1],[18,1],[18,1],[54,1],[54,1],[73,2],[72,1],[78,3],[78,1],[6,0],[6,2],[19,0],[19,2],[20,0],[20,1],[23,0],[23,1],[26,0],[26,1],[28,0],[28,2],[29,0],[29,1],[30,0],[30,1],[33,0],[33,2],[34,0],[34,1],[35,0],[35,1],[38,0],[38,2],[39,0],[39,1],[40,0],[40,1],[44,0],[44,1],[47,0],[47,2],[48,0],[48,1],[50,0],[50,2],[51,0],[51,1],[55,0],[55,2],[56,0],[56,1],[60,0],[60,2],[61,0],[61,1],[64,1],[64,2],[70,1],[70,2]],
  performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

  var $0 = $$.length - 1;
  switch (yystate) {
  case 1: return $$[$0-1]; 
  break;
  case 2:this.$ = new yy.Program($$[$0], null, {}, yy.locInfo(this._$));
  break;
  case 3:this.$ = $$[$0];
  break;
  case 4:this.$ = $$[$0];
  break;
  case 5:this.$ = $$[$0];
  break;
  case 6:this.$ = $$[$0];
  break;
  case 7:this.$ = $$[$0];
  break;
  case 8:this.$ = new yy.CommentStatement(yy.stripComment($$[$0]), yy.stripFlags($$[$0], $$[$0]), yy.locInfo(this._$));
  break;
  case 9:this.$ = new yy.ContentStatement($$[$0], yy.locInfo(this._$));
  break;
  case 10:this.$ = yy.prepareRawBlock($$[$0-2], $$[$0-1], $$[$0], this._$);
  break;
  case 11:this.$ = { path: $$[$0-3], params: $$[$0-2], hash: $$[$0-1] };
  break;
  case 12:this.$ = yy.prepareBlock($$[$0-3], $$[$0-2], $$[$0-1], $$[$0], false, this._$);
  break;
  case 13:this.$ = yy.prepareBlock($$[$0-3], $$[$0-2], $$[$0-1], $$[$0], true, this._$);
  break;
  case 14:this.$ = { path: $$[$0-4], params: $$[$0-3], hash: $$[$0-2], blockParams: $$[$0-1], strip: yy.stripFlags($$[$0-5], $$[$0]) };
  break;
  case 15:this.$ = { path: $$[$0-4], params: $$[$0-3], hash: $$[$0-2], blockParams: $$[$0-1], strip: yy.stripFlags($$[$0-5], $$[$0]) };
  break;
  case 16:this.$ = { path: $$[$0-4], params: $$[$0-3], hash: $$[$0-2], blockParams: $$[$0-1], strip: yy.stripFlags($$[$0-5], $$[$0]) };
  break;
  case 17:this.$ = { strip: yy.stripFlags($$[$0-1], $$[$0-1]), program: $$[$0] };
  break;
  case 18:
      var inverse = yy.prepareBlock($$[$0-2], $$[$0-1], $$[$0], $$[$0], false, this._$),
          program = new yy.Program([inverse], null, {}, yy.locInfo(this._$));
      program.chained = true;

      this.$ = { strip: $$[$0-2].strip, program: program, chain: true };
    
  break;
  case 19:this.$ = $$[$0];
  break;
  case 20:this.$ = {path: $$[$0-1], strip: yy.stripFlags($$[$0-2], $$[$0])};
  break;
  case 21:this.$ = yy.prepareMustache($$[$0-3], $$[$0-2], $$[$0-1], $$[$0-4], yy.stripFlags($$[$0-4], $$[$0]), this._$);
  break;
  case 22:this.$ = yy.prepareMustache($$[$0-3], $$[$0-2], $$[$0-1], $$[$0-4], yy.stripFlags($$[$0-4], $$[$0]), this._$);
  break;
  case 23:this.$ = new yy.PartialStatement($$[$0-3], $$[$0-2], $$[$0-1], yy.stripFlags($$[$0-4], $$[$0]), yy.locInfo(this._$));
  break;
  case 24:this.$ = $$[$0];
  break;
  case 25:this.$ = $$[$0];
  break;
  case 26:this.$ = new yy.SubExpression($$[$0-3], $$[$0-2], $$[$0-1], yy.locInfo(this._$));
  break;
  case 27:this.$ = new yy.Hash($$[$0], yy.locInfo(this._$));
  break;
  case 28:this.$ = new yy.HashPair($$[$0-2], $$[$0], yy.locInfo(this._$));
  break;
  case 29:this.$ = $$[$0-1];
  break;
  case 30:this.$ = $$[$0];
  break;
  case 31:this.$ = $$[$0];
  break;
  case 32:this.$ = new yy.StringLiteral($$[$0], yy.locInfo(this._$));
  break;
  case 33:this.$ = new yy.NumberLiteral($$[$0], yy.locInfo(this._$));
  break;
  case 34:this.$ = new yy.BooleanLiteral($$[$0], yy.locInfo(this._$));
  break;
  case 35:this.$ = $$[$0];
  break;
  case 36:this.$ = $$[$0];
  break;
  case 37:this.$ = yy.preparePath(true, $$[$0], this._$);
  break;
  case 38:this.$ = yy.preparePath(false, $$[$0], this._$);
  break;
  case 39: $$[$0-2].push({part: $$[$0], separator: $$[$0-1]}); this.$ = $$[$0-2]; 
  break;
  case 40:this.$ = [{part: $$[$0]}];
  break;
  case 41:this.$ = [];
  break;
  case 42:$$[$0-1].push($$[$0]);
  break;
  case 43:this.$ = [];
  break;
  case 44:$$[$0-1].push($$[$0]);
  break;
  case 51:this.$ = [];
  break;
  case 52:$$[$0-1].push($$[$0]);
  break;
  case 57:this.$ = [];
  break;
  case 58:$$[$0-1].push($$[$0]);
  break;
  case 63:this.$ = [];
  break;
  case 64:$$[$0-1].push($$[$0]);
  break;
  case 71:this.$ = [];
  break;
  case 72:$$[$0-1].push($$[$0]);
  break;
  case 75:this.$ = [];
  break;
  case 76:$$[$0-1].push($$[$0]);
  break;
  case 79:this.$ = [];
  break;
  case 80:$$[$0-1].push($$[$0]);
  break;
  case 83:this.$ = [];
  break;
  case 84:$$[$0-1].push($$[$0]);
  break;
  case 87:this.$ = [$$[$0]];
  break;
  case 88:$$[$0-1].push($$[$0]);
  break;
  case 89:this.$ = [$$[$0]];
  break;
  case 90:$$[$0-1].push($$[$0]);
  break;
  }
  },
  table: [{3:1,4:2,5:[2,41],6:3,13:[2,41],14:[2,41],17:[2,41],27:[2,41],32:[2,41],46:[2,41],49:[2,41],53:[2,41]},{1:[3]},{5:[1,4]},{5:[2,2],7:5,8:6,9:7,10:8,11:9,12:10,13:[1,11],14:[1,18],15:16,17:[1,21],22:14,25:15,27:[1,19],32:[1,20],37:[2,2],42:[2,2],45:[2,2],46:[1,12],49:[1,13],53:[1,17]},{1:[2,1]},{5:[2,42],13:[2,42],14:[2,42],17:[2,42],27:[2,42],32:[2,42],37:[2,42],42:[2,42],45:[2,42],46:[2,42],49:[2,42],53:[2,42]},{5:[2,3],13:[2,3],14:[2,3],17:[2,3],27:[2,3],32:[2,3],37:[2,3],42:[2,3],45:[2,3],46:[2,3],49:[2,3],53:[2,3]},{5:[2,4],13:[2,4],14:[2,4],17:[2,4],27:[2,4],32:[2,4],37:[2,4],42:[2,4],45:[2,4],46:[2,4],49:[2,4],53:[2,4]},{5:[2,5],13:[2,5],14:[2,5],17:[2,5],27:[2,5],32:[2,5],37:[2,5],42:[2,5],45:[2,5],46:[2,5],49:[2,5],53:[2,5]},{5:[2,6],13:[2,6],14:[2,6],17:[2,6],27:[2,6],32:[2,6],37:[2,6],42:[2,6],45:[2,6],46:[2,6],49:[2,6],53:[2,6]},{5:[2,7],13:[2,7],14:[2,7],17:[2,7],27:[2,7],32:[2,7],37:[2,7],42:[2,7],45:[2,7],46:[2,7],49:[2,7],53:[2,7]},{5:[2,8],13:[2,8],14:[2,8],17:[2,8],27:[2,8],32:[2,8],37:[2,8],42:[2,8],45:[2,8],46:[2,8],49:[2,8],53:[2,8]},{18:22,66:[1,30],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,29],78:28},{18:31,66:[1,30],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,29],78:28},{4:32,6:3,13:[2,41],14:[2,41],17:[2,41],27:[2,41],32:[2,41],37:[2,41],42:[2,41],45:[2,41],46:[2,41],49:[2,41],53:[2,41]},{4:33,6:3,13:[2,41],14:[2,41],17:[2,41],27:[2,41],32:[2,41],42:[2,41],45:[2,41],46:[2,41],49:[2,41],53:[2,41]},{12:34,14:[1,18]},{18:36,54:35,58:37,59:[1,38],66:[1,30],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,29],78:28},{5:[2,9],13:[2,9],14:[2,9],16:[2,9],17:[2,9],27:[2,9],32:[2,9],37:[2,9],42:[2,9],45:[2,9],46:[2,9],49:[2,9],53:[2,9]},{18:39,66:[1,30],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,29],78:28},{18:40,66:[1,30],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,29],78:28},{18:41,66:[1,30],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,29],78:28},{31:[2,71],47:42,59:[2,71],66:[2,71],74:[2,71],75:[2,71],76:[2,71],77:[2,71]},{21:[2,30],31:[2,30],52:[2,30],59:[2,30],62:[2,30],66:[2,30],69:[2,30],74:[2,30],75:[2,30],76:[2,30],77:[2,30]},{21:[2,31],31:[2,31],52:[2,31],59:[2,31],62:[2,31],66:[2,31],69:[2,31],74:[2,31],75:[2,31],76:[2,31],77:[2,31]},{21:[2,32],31:[2,32],52:[2,32],59:[2,32],62:[2,32],66:[2,32],69:[2,32],74:[2,32],75:[2,32],76:[2,32],77:[2,32]},{21:[2,33],31:[2,33],52:[2,33],59:[2,33],62:[2,33],66:[2,33],69:[2,33],74:[2,33],75:[2,33],76:[2,33],77:[2,33]},{21:[2,34],31:[2,34],52:[2,34],59:[2,34],62:[2,34],66:[2,34],69:[2,34],74:[2,34],75:[2,34],76:[2,34],77:[2,34]},{21:[2,38],31:[2,38],52:[2,38],59:[2,38],62:[2,38],66:[2,38],69:[2,38],74:[2,38],75:[2,38],76:[2,38],77:[2,38],79:[1,43]},{66:[1,30],78:44},{21:[2,40],31:[2,40],52:[2,40],59:[2,40],62:[2,40],66:[2,40],69:[2,40],74:[2,40],75:[2,40],76:[2,40],77:[2,40],79:[2,40]},{50:45,52:[2,75],59:[2,75],66:[2,75],74:[2,75],75:[2,75],76:[2,75],77:[2,75]},{23:46,36:48,37:[1,50],41:49,42:[1,51],43:47,45:[2,47]},{26:52,41:53,42:[1,51],45:[2,49]},{16:[1,54]},{31:[2,79],55:55,59:[2,79],66:[2,79],74:[2,79],75:[2,79],76:[2,79],77:[2,79]},{31:[2,35],59:[2,35],66:[2,35],74:[2,35],75:[2,35],76:[2,35],77:[2,35]},{31:[2,36],59:[2,36],66:[2,36],74:[2,36],75:[2,36],76:[2,36],77:[2,36]},{18:56,66:[1,30],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,29],78:28},{28:57,31:[2,51],59:[2,51],66:[2,51],69:[2,51],74:[2,51],75:[2,51],76:[2,51],77:[2,51]},{31:[2,57],33:58,59:[2,57],66:[2,57],69:[2,57],74:[2,57],75:[2,57],76:[2,57],77:[2,57]},{19:59,21:[2,43],59:[2,43],66:[2,43],74:[2,43],75:[2,43],76:[2,43],77:[2,43]},{18:63,31:[2,73],48:60,57:61,58:64,59:[1,38],63:62,64:65,65:66,66:[1,67],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,29],78:28},{66:[1,68]},{21:[2,37],31:[2,37],52:[2,37],59:[2,37],62:[2,37],66:[2,37],69:[2,37],74:[2,37],75:[2,37],76:[2,37],77:[2,37],79:[1,43]},{18:63,51:69,52:[2,77],57:70,58:64,59:[1,38],63:71,64:65,65:66,66:[1,67],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,29],78:28},{24:72,45:[1,73]},{45:[2,48]},{4:74,6:3,13:[2,41],14:[2,41],17:[2,41],27:[2,41],32:[2,41],37:[2,41],42:[2,41],45:[2,41],46:[2,41],49:[2,41],53:[2,41]},{45:[2,19]},{18:75,66:[1,30],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,29],78:28},{4:76,6:3,13:[2,41],14:[2,41],17:[2,41],27:[2,41],32:[2,41],45:[2,41],46:[2,41],49:[2,41],53:[2,41]},{24:77,45:[1,73]},{45:[2,50]},{5:[2,10],13:[2,10],14:[2,10],17:[2,10],27:[2,10],32:[2,10],37:[2,10],42:[2,10],45:[2,10],46:[2,10],49:[2,10],53:[2,10]},{18:63,31:[2,81],56:78,57:79,58:64,59:[1,38],63:80,64:65,65:66,66:[1,67],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,29],78:28},{59:[2,83],60:81,62:[2,83],66:[2,83],74:[2,83],75:[2,83],76:[2,83],77:[2,83]},{18:63,29:82,31:[2,53],57:83,58:64,59:[1,38],63:84,64:65,65:66,66:[1,67],69:[2,53],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,29],78:28},{18:63,31:[2,59],34:85,57:86,58:64,59:[1,38],63:87,64:65,65:66,66:[1,67],69:[2,59],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,29],78:28},{18:63,20:88,21:[2,45],57:89,58:64,59:[1,38],63:90,64:65,65:66,66:[1,67],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,29],78:28},{31:[1,91]},{31:[2,72],59:[2,72],66:[2,72],74:[2,72],75:[2,72],76:[2,72],77:[2,72]},{31:[2,74]},{21:[2,24],31:[2,24],52:[2,24],59:[2,24],62:[2,24],66:[2,24],69:[2,24],74:[2,24],75:[2,24],76:[2,24],77:[2,24]},{21:[2,25],31:[2,25],52:[2,25],59:[2,25],62:[2,25],66:[2,25],69:[2,25],74:[2,25],75:[2,25],76:[2,25],77:[2,25]},{21:[2,27],31:[2,27],52:[2,27],62:[2,27],65:92,66:[1,93],69:[2,27]},{21:[2,87],31:[2,87],52:[2,87],62:[2,87],66:[2,87],69:[2,87]},{21:[2,40],31:[2,40],52:[2,40],59:[2,40],62:[2,40],66:[2,40],67:[1,94],69:[2,40],74:[2,40],75:[2,40],76:[2,40],77:[2,40],79:[2,40]},{21:[2,39],31:[2,39],52:[2,39],59:[2,39],62:[2,39],66:[2,39],69:[2,39],74:[2,39],75:[2,39],76:[2,39],77:[2,39],79:[2,39]},{52:[1,95]},{52:[2,76],59:[2,76],66:[2,76],74:[2,76],75:[2,76],76:[2,76],77:[2,76]},{52:[2,78]},{5:[2,12],13:[2,12],14:[2,12],17:[2,12],27:[2,12],32:[2,12],37:[2,12],42:[2,12],45:[2,12],46:[2,12],49:[2,12],53:[2,12]},{18:96,66:[1,30],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,29],78:28},{36:48,37:[1,50],41:49,42:[1,51],43:98,44:97,45:[2,69]},{31:[2,63],38:99,59:[2,63],66:[2,63],69:[2,63],74:[2,63],75:[2,63],76:[2,63],77:[2,63]},{45:[2,17]},{5:[2,13],13:[2,13],14:[2,13],17:[2,13],27:[2,13],32:[2,13],37:[2,13],42:[2,13],45:[2,13],46:[2,13],49:[2,13],53:[2,13]},{31:[1,100]},{31:[2,80],59:[2,80],66:[2,80],74:[2,80],75:[2,80],76:[2,80],77:[2,80]},{31:[2,82]},{18:63,57:102,58:64,59:[1,38],61:101,62:[2,85],63:103,64:65,65:66,66:[1,67],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,29],78:28},{30:104,31:[2,55],68:105,69:[1,106]},{31:[2,52],59:[2,52],66:[2,52],69:[2,52],74:[2,52],75:[2,52],76:[2,52],77:[2,52]},{31:[2,54],69:[2,54]},{31:[2,61],35:107,68:108,69:[1,106]},{31:[2,58],59:[2,58],66:[2,58],69:[2,58],74:[2,58],75:[2,58],76:[2,58],77:[2,58]},{31:[2,60],69:[2,60]},{21:[1,109]},{21:[2,44],59:[2,44],66:[2,44],74:[2,44],75:[2,44],76:[2,44],77:[2,44]},{21:[2,46]},{5:[2,21],13:[2,21],14:[2,21],17:[2,21],27:[2,21],32:[2,21],37:[2,21],42:[2,21],45:[2,21],46:[2,21],49:[2,21],53:[2,21]},{21:[2,88],31:[2,88],52:[2,88],62:[2,88],66:[2,88],69:[2,88]},{67:[1,94]},{18:63,57:110,58:64,59:[1,38],66:[1,30],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,29],78:28},{5:[2,22],13:[2,22],14:[2,22],17:[2,22],27:[2,22],32:[2,22],37:[2,22],42:[2,22],45:[2,22],46:[2,22],49:[2,22],53:[2,22]},{31:[1,111]},{45:[2,18]},{45:[2,70]},{18:63,31:[2,65],39:112,57:113,58:64,59:[1,38],63:114,64:65,65:66,66:[1,67],69:[2,65],72:23,73:24,74:[1,25],75:[1,26],76:[1,27],77:[1,29],78:28},{5:[2,23],13:[2,23],14:[2,23],17:[2,23],27:[2,23],32:[2,23],37:[2,23],42:[2,23],45:[2,23],46:[2,23],49:[2,23],53:[2,23]},{62:[1,115]},{59:[2,84],62:[2,84],66:[2,84],74:[2,84],75:[2,84],76:[2,84],77:[2,84]},{62:[2,86]},{31:[1,116]},{31:[2,56]},{66:[1,118],70:117},{31:[1,119]},{31:[2,62]},{14:[2,11]},{21:[2,28],31:[2,28],52:[2,28],62:[2,28],66:[2,28],69:[2,28]},{5:[2,20],13:[2,20],14:[2,20],17:[2,20],27:[2,20],32:[2,20],37:[2,20],42:[2,20],45:[2,20],46:[2,20],49:[2,20],53:[2,20]},{31:[2,67],40:120,68:121,69:[1,106]},{31:[2,64],59:[2,64],66:[2,64],69:[2,64],74:[2,64],75:[2,64],76:[2,64],77:[2,64]},{31:[2,66],69:[2,66]},{21:[2,26],31:[2,26],52:[2,26],59:[2,26],62:[2,26],66:[2,26],69:[2,26],74:[2,26],75:[2,26],76:[2,26],77:[2,26]},{13:[2,14],14:[2,14],17:[2,14],27:[2,14],32:[2,14],37:[2,14],42:[2,14],45:[2,14],46:[2,14],49:[2,14],53:[2,14]},{66:[1,123],71:[1,122]},{66:[2,89],71:[2,89]},{13:[2,15],14:[2,15],17:[2,15],27:[2,15],32:[2,15],42:[2,15],45:[2,15],46:[2,15],49:[2,15],53:[2,15]},{31:[1,124]},{31:[2,68]},{31:[2,29]},{66:[2,90],71:[2,90]},{13:[2,16],14:[2,16],17:[2,16],27:[2,16],32:[2,16],37:[2,16],42:[2,16],45:[2,16],46:[2,16],49:[2,16],53:[2,16]}],
  defaultActions: {4:[2,1],47:[2,48],49:[2,19],53:[2,50],62:[2,74],71:[2,78],76:[2,17],80:[2,82],90:[2,46],97:[2,18],98:[2,70],103:[2,86],105:[2,56],108:[2,62],109:[2,11],121:[2,68],122:[2,29]},
  parseError: function parseError(str, hash) {
      throw new Error(str);
  },
  parse: function parse(input) {
      var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
      this.lexer.setInput(input);
      this.lexer.yy = this.yy;
      this.yy.lexer = this.lexer;
      this.yy.parser = this;
      if (typeof this.lexer.yylloc == "undefined")
          this.lexer.yylloc = {};
      var yyloc = this.lexer.yylloc;
      lstack.push(yyloc);
      var ranges = this.lexer.options && this.lexer.options.ranges;
      if (typeof this.yy.parseError === "function")
          this.parseError = this.yy.parseError;
      function popStack(n) {
          stack.length = stack.length - 2 * n;
          vstack.length = vstack.length - n;
          lstack.length = lstack.length - n;
      }
      function lex() {
          var token;
          token = self.lexer.lex() || 1;
          if (typeof token !== "number") {
              token = self.symbols_[token] || token;
          }
          return token;
      }
      var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
      while (true) {
          state = stack[stack.length - 1];
          if (this.defaultActions[state]) {
              action = this.defaultActions[state];
          } else {
              if (symbol === null || typeof symbol == "undefined") {
                  symbol = lex();
              }
              action = table[state] && table[state][symbol];
          }
          if (typeof action === "undefined" || !action.length || !action[0]) {
              var errStr = "";
              if (!recovering) {
                  expected = [];
                  for (p in table[state])
                      if (this.terminals_[p] && p > 2) {
                          expected.push("'" + this.terminals_[p] + "'");
                      }
                  if (this.lexer.showPosition) {
                      errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
                  } else {
                      errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == 1?"end of input":"'" + (this.terminals_[symbol] || symbol) + "'");
                  }
                  this.parseError(errStr, {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
              }
          }
          if (action[0] instanceof Array && action.length > 1) {
              throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
          }
          switch (action[0]) {
          case 1:
              stack.push(symbol);
              vstack.push(this.lexer.yytext);
              lstack.push(this.lexer.yylloc);
              stack.push(action[1]);
              symbol = null;
              if (!preErrorSymbol) {
                  yyleng = this.lexer.yyleng;
                  yytext = this.lexer.yytext;
                  yylineno = this.lexer.yylineno;
                  yyloc = this.lexer.yylloc;
                  if (recovering > 0)
                      recovering--;
              } else {
                  symbol = preErrorSymbol;
                  preErrorSymbol = null;
              }
              break;
          case 2:
              len = this.productions_[action[1]][1];
              yyval.$ = vstack[vstack.length - len];
              yyval._$ = {first_line: lstack[lstack.length - (len || 1)].first_line, last_line: lstack[lstack.length - 1].last_line, first_column: lstack[lstack.length - (len || 1)].first_column, last_column: lstack[lstack.length - 1].last_column};
              if (ranges) {
                  yyval._$.range = [lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]];
              }
              r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
              if (typeof r !== "undefined") {
                  return r;
              }
              if (len) {
                  stack = stack.slice(0, -1 * len * 2);
                  vstack = vstack.slice(0, -1 * len);
                  lstack = lstack.slice(0, -1 * len);
              }
              stack.push(this.productions_[action[1]][0]);
              vstack.push(yyval.$);
              lstack.push(yyval._$);
              newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
              stack.push(newState);
              break;
          case 3:
              return true;
          }
      }
      return true;
  }
  };
  /* Jison generated lexer */
  var lexer = (function(){
  var lexer = ({EOF:1,
  parseError:function parseError(str, hash) {
          if (this.yy.parser) {
              this.yy.parser.parseError(str, hash);
          } else {
              throw new Error(str);
          }
      },
  setInput:function (input) {
          this._input = input;
          this._more = this._less = this.done = false;
          this.yylineno = this.yyleng = 0;
          this.yytext = this.matched = this.match = '';
          this.conditionStack = ['INITIAL'];
          this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};
          if (this.options.ranges) this.yylloc.range = [0,0];
          this.offset = 0;
          return this;
      },
  input:function () {
          var ch = this._input[0];
          this.yytext += ch;
          this.yyleng++;
          this.offset++;
          this.match += ch;
          this.matched += ch;
          var lines = ch.match(/(?:\r\n?|\n).*/g);
          if (lines) {
              this.yylineno++;
              this.yylloc.last_line++;
          } else {
              this.yylloc.last_column++;
          }
          if (this.options.ranges) this.yylloc.range[1]++;

          this._input = this._input.slice(1);
          return ch;
      },
  unput:function (ch) {
          var len = ch.length;
          var lines = ch.split(/(?:\r\n?|\n)/g);

          this._input = ch + this._input;
          this.yytext = this.yytext.substr(0, this.yytext.length-len-1);
          //this.yyleng -= len;
          this.offset -= len;
          var oldLines = this.match.split(/(?:\r\n?|\n)/g);
          this.match = this.match.substr(0, this.match.length-1);
          this.matched = this.matched.substr(0, this.matched.length-1);

          if (lines.length-1) this.yylineno -= lines.length-1;
          var r = this.yylloc.range;

          this.yylloc = {first_line: this.yylloc.first_line,
            last_line: this.yylineno+1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length:
                this.yylloc.first_column - len
            };

          if (this.options.ranges) {
              this.yylloc.range = [r[0], r[0] + this.yyleng - len];
          }
          return this;
      },
  more:function () {
          this._more = true;
          return this;
      },
  less:function (n) {
          this.unput(this.match.slice(n));
      },
  pastInput:function () {
          var past = this.matched.substr(0, this.matched.length - this.match.length);
          return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
      },
  upcomingInput:function () {
          var next = this.match;
          if (next.length < 20) {
              next += this._input.substr(0, 20-next.length);
          }
          return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
      },
  showPosition:function () {
          var pre = this.pastInput();
          var c = new Array(pre.length + 1).join("-");
          return pre + this.upcomingInput() + "\n" + c+"^";
      },
  next:function () {
          if (this.done) {
              return this.EOF;
          }
          if (!this._input) this.done = true;

          var token,
              match,
              tempMatch,
              index,
              col,
              lines;
          if (!this._more) {
              this.yytext = '';
              this.match = '';
          }
          var rules = this._currentRules();
          for (var i=0;i < rules.length; i++) {
              tempMatch = this._input.match(this.rules[rules[i]]);
              if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                  match = tempMatch;
                  index = i;
                  if (!this.options.flex) break;
              }
          }
          if (match) {
              lines = match[0].match(/(?:\r\n?|\n).*/g);
              if (lines) this.yylineno += lines.length;
              this.yylloc = {first_line: this.yylloc.last_line,
                             last_line: this.yylineno+1,
                             first_column: this.yylloc.last_column,
                             last_column: lines ? lines[lines.length-1].length-lines[lines.length-1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length};
              this.yytext += match[0];
              this.match += match[0];
              this.matches = match;
              this.yyleng = this.yytext.length;
              if (this.options.ranges) {
                  this.yylloc.range = [this.offset, this.offset += this.yyleng];
              }
              this._more = false;
              this._input = this._input.slice(match[0].length);
              this.matched += match[0];
              token = this.performAction.call(this, this.yy, this, rules[index],this.conditionStack[this.conditionStack.length-1]);
              if (this.done && this._input) this.done = false;
              if (token) return token;
              else return;
          }
          if (this._input === "") {
              return this.EOF;
          } else {
              return this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(),
                      {text: "", token: null, line: this.yylineno});
          }
      },
  lex:function lex() {
          var r = this.next();
          if (typeof r !== 'undefined') {
              return r;
          } else {
              return this.lex();
          }
      },
  begin:function begin(condition) {
          this.conditionStack.push(condition);
      },
  popState:function popState() {
          return this.conditionStack.pop();
      },
  _currentRules:function _currentRules() {
          return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
      },
  topState:function () {
          return this.conditionStack[this.conditionStack.length-2];
      },
  pushState:function begin(condition) {
          this.begin(condition);
      }});
  lexer.options = {};
  lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {


  function strip(start, end) {
    return yy_.yytext = yy_.yytext.substr(start, yy_.yyleng-end);
  }


  var YYSTATE=YY_START
  switch($avoiding_name_collisions) {
  case 0:
                                     if(yy_.yytext.slice(-2) === "\\\\") {
                                       strip(0,1);
                                       this.begin("mu");
                                     } else if(yy_.yytext.slice(-1) === "\\") {
                                       strip(0,1);
                                       this.begin("emu");
                                     } else {
                                       this.begin("mu");
                                     }
                                     if(yy_.yytext) return 14;
                                   
  break;
  case 1:return 14;
  break;
  case 2:
                                     this.popState();
                                     return 14;
                                   
  break;
  case 3:
                                    yy_.yytext = yy_.yytext.substr(5, yy_.yyleng-9);
                                    this.popState();
                                    return 16;
                                   
  break;
  case 4: return 14; 
  break;
  case 5:
    this.popState();
    return 13;

  break;
  case 6:return 59;
  break;
  case 7:return 62;
  break;
  case 8: return 17; 
  break;
  case 9:
                                    this.popState();
                                    this.begin('raw');
                                    return 21;
                                   
  break;
  case 10:return 53;
  break;
  case 11:return 27;
  break;
  case 12:return 45;
  break;
  case 13:this.popState(); return 42;
  break;
  case 14:this.popState(); return 42;
  break;
  case 15:return 32;
  break;
  case 16:return 37;
  break;
  case 17:return 49;
  break;
  case 18:return 46;
  break;
  case 19:
    this.unput(yy_.yytext);
    this.popState();
    this.begin('com');

  break;
  case 20:
    this.popState();
    return 13;

  break;
  case 21:return 46;
  break;
  case 22:return 67;
  break;
  case 23:return 66;
  break;
  case 24:return 66;
  break;
  case 25:return 79;
  break;
  case 26:// ignore whitespace
  break;
  case 27:this.popState(); return 52;
  break;
  case 28:this.popState(); return 31;
  break;
  case 29:yy_.yytext = strip(1,2).replace(/\\"/g,'"'); return 74;
  break;
  case 30:yy_.yytext = strip(1,2).replace(/\\'/g,"'"); return 74;
  break;
  case 31:return 77;
  break;
  case 32:return 76;
  break;
  case 33:return 76;
  break;
  case 34:return 75;
  break;
  case 35:return 69;
  break;
  case 36:return 71;
  break;
  case 37:return 66;
  break;
  case 38:yy_.yytext = strip(1,2); return 66;
  break;
  case 39:return 'INVALID';
  break;
  case 40:return 5;
  break;
  }
  };
  lexer.rules = [/^(?:[^\x00]*?(?=(\{\{)))/,/^(?:[^\x00]+)/,/^(?:[^\x00]{2,}?(?=(\{\{|\\\{\{|\\\\\{\{|$)))/,/^(?:\{\{\{\{\/[^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=[=}\s\/.])\}\}\}\})/,/^(?:[^\x00]*?(?=(\{\{\{\{\/)))/,/^(?:[\s\S]*?--(~)?\}\})/,/^(?:\()/,/^(?:\))/,/^(?:\{\{\{\{)/,/^(?:\}\}\}\})/,/^(?:\{\{(~)?>)/,/^(?:\{\{(~)?#)/,/^(?:\{\{(~)?\/)/,/^(?:\{\{(~)?\^\s*(~)?\}\})/,/^(?:\{\{(~)?\s*else\s*(~)?\}\})/,/^(?:\{\{(~)?\^)/,/^(?:\{\{(~)?\s*else\b)/,/^(?:\{\{(~)?\{)/,/^(?:\{\{(~)?&)/,/^(?:\{\{(~)?!--)/,/^(?:\{\{(~)?![\s\S]*?\}\})/,/^(?:\{\{(~)?)/,/^(?:=)/,/^(?:\.\.)/,/^(?:\.(?=([=~}\s\/.)|])))/,/^(?:[\/.])/,/^(?:\s+)/,/^(?:\}(~)?\}\})/,/^(?:(~)?\}\})/,/^(?:"(\\["]|[^"])*")/,/^(?:'(\\[']|[^'])*')/,/^(?:@)/,/^(?:true(?=([~}\s)])))/,/^(?:false(?=([~}\s)])))/,/^(?:-?[0-9]+(?:\.[0-9]+)?(?=([~}\s)])))/,/^(?:as\s+\|)/,/^(?:\|)/,/^(?:([^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=([=~}\s\/.)|]))))/,/^(?:\[[^\]]*\])/,/^(?:.)/,/^(?:$)/];
  lexer.conditions = {"mu":{"rules":[6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40],"inclusive":false},"emu":{"rules":[2],"inclusive":false},"com":{"rules":[5],"inclusive":false},"raw":{"rules":[3,4],"inclusive":false},"INITIAL":{"rules":[0,1,40],"inclusive":true}};
  return lexer;})()
  parser.lexer = lexer;
  function Parser () { this.yy = {}; }Parser.prototype = parser;parser.Parser = Parser;
  return new Parser;
  })();__exports__ = handlebars;
  /* jshint ignore:end */
  return __exports__;
})();

// handlebars/compiler/visitor.js
var __module11__ = (function(__dependency1__, __dependency2__) {
  "use strict";
  var __exports__;
  var Exception = __dependency1__;
  var AST = __dependency2__;

  function Visitor() {
    this.parents = [];
  }

  Visitor.prototype = {
    constructor: Visitor,
    mutating: false,

    // Visits a given value. If mutating, will replace the value if necessary.
    acceptKey: function(node, name) {
      var value = this.accept(node[name]);
      if (this.mutating) {
        // Hacky sanity check:
        if (value && (!value.type || !AST[value.type])) {
          throw new Exception('Unexpected node type "' + value.type + '" found when accepting ' + name + ' on ' + node.type);
        }
        node[name] = value;
      }
    },

    // Performs an accept operation with added sanity check to ensure
    // required keys are not removed.
    acceptRequired: function(node, name) {
      this.acceptKey(node, name);

      if (!node[name]) {
        throw new Exception(node.type + ' requires ' + name);
      }
    },

    // Traverses a given array. If mutating, empty respnses will be removed
    // for child elements.
    acceptArray: function(array) {
      for (var i = 0, l = array.length; i < l; i++) {
        this.acceptKey(array, i);

        if (!array[i]) {
          array.splice(i, 1);
          i--;
          l--;
        }
      }
    },

    accept: function(object) {
      if (!object) {
        return;
      }

      if (this.current) {
        this.parents.unshift(this.current);
      }
      this.current = object;

      var ret = this[object.type](object);

      this.current = this.parents.shift();

      if (!this.mutating || ret) {
        return ret;
      } else if (ret !== false) {
        return object;
      }
    },

    Program: function(program) {
      this.acceptArray(program.body);
    },

    MustacheStatement: function(mustache) {
      this.acceptRequired(mustache, 'path');
      this.acceptArray(mustache.params);
      this.acceptKey(mustache, 'hash');
    },

    BlockStatement: function(block) {
      this.acceptRequired(block, 'path');
      this.acceptArray(block.params);
      this.acceptKey(block, 'hash');

      this.acceptKey(block, 'program');
      this.acceptKey(block, 'inverse');
    },

    PartialStatement: function(partial) {
      this.acceptRequired(partial, 'name');
      this.acceptArray(partial.params);
      this.acceptKey(partial, 'hash');
    },

    ContentStatement: function(/* content */) {},
    CommentStatement: function(/* comment */) {},

    SubExpression: function(sexpr) {
      this.acceptRequired(sexpr, 'path');
      this.acceptArray(sexpr.params);
      this.acceptKey(sexpr, 'hash');
    },
    PartialExpression: function(partial) {
      this.acceptRequired(partial, 'name');
      this.acceptArray(partial.params);
      this.acceptKey(partial, 'hash');
    },

    PathExpression: function(/* path */) {},

    StringLiteral: function(/* string */) {},
    NumberLiteral: function(/* number */) {},
    BooleanLiteral: function(/* bool */) {},

    Hash: function(hash) {
      this.acceptArray(hash.pairs);
    },
    HashPair: function(pair) {
      this.acceptRequired(pair, 'value');
    }
  };

  __exports__ = Visitor;
  return __exports__;
})(__module4__, __module7__);

// handlebars/compiler/whitespace-control.js
var __module10__ = (function(__dependency1__) {
  "use strict";
  var __exports__;
  var Visitor = __dependency1__;

  function WhitespaceControl() {
  }
  WhitespaceControl.prototype = new Visitor();

  WhitespaceControl.prototype.Program = function(program) {
    var isRoot = !this.isRootSeen;
    this.isRootSeen = true;

    var body = program.body;
    for (var i = 0, l = body.length; i < l; i++) {
      var current = body[i],
          strip = this.accept(current);

      if (!strip) {
        continue;
      }

      var _isPrevWhitespace = isPrevWhitespace(body, i, isRoot),
          _isNextWhitespace = isNextWhitespace(body, i, isRoot),

          openStandalone = strip.openStandalone && _isPrevWhitespace,
          closeStandalone = strip.closeStandalone && _isNextWhitespace,
          inlineStandalone = strip.inlineStandalone && _isPrevWhitespace && _isNextWhitespace;

      if (strip.close) {
        omitRight(body, i, true);
      }
      if (strip.open) {
        omitLeft(body, i, true);
      }

      if (inlineStandalone) {
        omitRight(body, i);

        if (omitLeft(body, i)) {
          // If we are on a standalone node, save the indent info for partials
          if (current.type === 'PartialStatement') {
            // Pull out the whitespace from the final line
            current.indent = (/([ \t]+$)/).exec(body[i-1].original)[1];
          }
        }
      }
      if (openStandalone) {
        omitRight((current.program || current.inverse).body);

        // Strip out the previous content node if it's whitespace only
        omitLeft(body, i);
      }
      if (closeStandalone) {
        // Always strip the next node
        omitRight(body, i);

        omitLeft((current.inverse || current.program).body);
      }
    }

    return program;
  };
  WhitespaceControl.prototype.BlockStatement = function(block) {
    this.accept(block.program);
    this.accept(block.inverse);

    // Find the inverse program that is involed with whitespace stripping.
    var program = block.program || block.inverse,
        inverse = block.program && block.inverse,
        firstInverse = inverse,
        lastInverse = inverse;

    if (inverse && inverse.chained) {
      firstInverse = inverse.body[0].program;

      // Walk the inverse chain to find the last inverse that is actually in the chain.
      while (lastInverse.chained) {
        lastInverse = lastInverse.body[lastInverse.body.length-1].program;
      }
    }

    var strip = {
      open: block.openStrip.open,
      close: block.closeStrip.close,

      // Determine the standalone candiacy. Basically flag our content as being possibly standalone
      // so our parent can determine if we actually are standalone
      openStandalone: isNextWhitespace(program.body),
      closeStandalone: isPrevWhitespace((firstInverse || program).body)
    };

    if (block.openStrip.close) {
      omitRight(program.body, null, true);
    }

    if (inverse) {
      var inverseStrip = block.inverseStrip;

      if (inverseStrip.open) {
        omitLeft(program.body, null, true);
      }

      if (inverseStrip.close) {
        omitRight(firstInverse.body, null, true);
      }
      if (block.closeStrip.open) {
        omitLeft(lastInverse.body, null, true);
      }

      // Find standalone else statments
      if (isPrevWhitespace(program.body)
          && isNextWhitespace(firstInverse.body)) {

        omitLeft(program.body);
        omitRight(firstInverse.body);
      }
    } else {
      if (block.closeStrip.open) {
        omitLeft(program.body, null, true);
      }
    }

    return strip;
  };

  WhitespaceControl.prototype.MustacheStatement = function(mustache) {
    return mustache.strip;
  };

  WhitespaceControl.prototype.PartialStatement = 
      WhitespaceControl.prototype.CommentStatement = function(node) {
    /* istanbul ignore next */
    var strip = node.strip || {};
    return {
      inlineStandalone: true,
      open: strip.open,
      close: strip.close
    };
  };


  function isPrevWhitespace(body, i, isRoot) {
    if (i === undefined) {
      i = body.length;
    }

    // Nodes that end with newlines are considered whitespace (but are special
    // cased for strip operations)
    var prev = body[i-1],
        sibling = body[i-2];
    if (!prev) {
      return isRoot;
    }

    if (prev.type === 'ContentStatement') {
      return (sibling || !isRoot ? (/\r?\n\s*?$/) : (/(^|\r?\n)\s*?$/)).test(prev.original);
    }
  }
  function isNextWhitespace(body, i, isRoot) {
    if (i === undefined) {
      i = -1;
    }

    var next = body[i+1],
        sibling = body[i+2];
    if (!next) {
      return isRoot;
    }

    if (next.type === 'ContentStatement') {
      return (sibling || !isRoot ? (/^\s*?\r?\n/) : (/^\s*?(\r?\n|$)/)).test(next.original);
    }
  }

  // Marks the node to the right of the position as omitted.
  // I.e. {{foo}}' ' will mark the ' ' node as omitted.
  //
  // If i is undefined, then the first child will be marked as such.
  //
  // If mulitple is truthy then all whitespace will be stripped out until non-whitespace
  // content is met.
  function omitRight(body, i, multiple) {
    var current = body[i == null ? 0 : i + 1];
    if (!current || current.type !== 'ContentStatement' || (!multiple && current.rightStripped)) {
      return;
    }

    var original = current.value;
    current.value = current.value.replace(multiple ? (/^\s+/) : (/^[ \t]*\r?\n?/), '');
    current.rightStripped = current.value !== original;
  }

  // Marks the node to the left of the position as omitted.
  // I.e. ' '{{foo}} will mark the ' ' node as omitted.
  //
  // If i is undefined then the last child will be marked as such.
  //
  // If mulitple is truthy then all whitespace will be stripped out until non-whitespace
  // content is met.
  function omitLeft(body, i, multiple) {
    var current = body[i == null ? body.length - 1 : i - 1];
    if (!current || current.type !== 'ContentStatement' || (!multiple && current.leftStripped)) {
      return;
    }

    // We omit the last node if it's whitespace only and not preceeded by a non-content node.
    var original = current.value;
    current.value = current.value.replace(multiple ? (/\s+$/) : (/[ \t]+$/), '');
    current.leftStripped = current.value !== original;
    return current.leftStripped;
  }

  __exports__ = WhitespaceControl;
  return __exports__;
})(__module11__);

// handlebars/compiler/helpers.js
var __module12__ = (function(__dependency1__) {
  "use strict";
  var __exports__ = {};
  var Exception = __dependency1__;

  function SourceLocation(source, locInfo) {
    this.source = source;
    this.start = {
      line: locInfo.first_line,
      column: locInfo.first_column
    };
    this.end = {
      line: locInfo.last_line,
      column: locInfo.last_column
    };
  }

  __exports__.SourceLocation = SourceLocation;function stripFlags(open, close) {
    return {
      open: open.charAt(2) === '~',
      close: close.charAt(close.length-3) === '~'
    };
  }

  __exports__.stripFlags = stripFlags;function stripComment(comment) {
    return comment.replace(/^\{\{~?\!-?-?/, '')
                  .replace(/-?-?~?\}\}$/, '');
  }

  __exports__.stripComment = stripComment;function preparePath(data, parts, locInfo) {
    /*jshint -W040 */
    locInfo = this.locInfo(locInfo);

    var original = data ? '@' : '',
        dig = [],
        depth = 0,
        depthString = '';

    for(var i=0,l=parts.length; i<l; i++) {
      var part = parts[i].part;
      original += (parts[i].separator || '') + part;

      if (part === '..' || part === '.' || part === 'this') {
        if (dig.length > 0) {
          throw new Exception('Invalid path: ' + original, {loc: locInfo});
        } else if (part === '..') {
          depth++;
          depthString += '../';
        }
      } else {
        dig.push(part);
      }
    }

    return new this.PathExpression(data, depth, dig, original, locInfo);
  }

  __exports__.preparePath = preparePath;function prepareMustache(path, params, hash, open, strip, locInfo) {
    /*jshint -W040 */
    // Must use charAt to support IE pre-10
    var escapeFlag = open.charAt(3) || open.charAt(2),
        escaped = escapeFlag !== '{' && escapeFlag !== '&';

    return new this.MustacheStatement(path, params, hash, escaped, strip, this.locInfo(locInfo));
  }

  __exports__.prepareMustache = prepareMustache;function prepareRawBlock(openRawBlock, content, close, locInfo) {
    /*jshint -W040 */
    if (openRawBlock.path.original !== close) {
      var errorNode = {loc: openRawBlock.path.loc};

      throw new Exception(openRawBlock.path.original + " doesn't match " + close, errorNode);
    }

    locInfo = this.locInfo(locInfo);
    var program = new this.Program([content], null, {}, locInfo);

    return new this.BlockStatement(
        openRawBlock.path, openRawBlock.params, openRawBlock.hash,
        program, undefined,
        {}, {}, {},
        locInfo);
  }

  __exports__.prepareRawBlock = prepareRawBlock;function prepareBlock(openBlock, program, inverseAndProgram, close, inverted, locInfo) {
    /*jshint -W040 */
    // When we are chaining inverse calls, we will not have a close path
    if (close && close.path && openBlock.path.original !== close.path.original) {
      var errorNode = {loc: openBlock.path.loc};

      throw new Exception(openBlock.path.original + ' doesn\'t match ' + close.path.original, errorNode);
    }

    program.blockParams = openBlock.blockParams;

    var inverse,
        inverseStrip;

    if (inverseAndProgram) {
      if (inverseAndProgram.chain) {
        inverseAndProgram.program.body[0].closeStrip = close.strip;
      }

      inverseStrip = inverseAndProgram.strip;
      inverse = inverseAndProgram.program;
    }

    if (inverted) {
      inverted = inverse;
      inverse = program;
      program = inverted;
    }

    return new this.BlockStatement(
        openBlock.path, openBlock.params, openBlock.hash,
        program, inverse,
        openBlock.strip, inverseStrip, close && close.strip,
        this.locInfo(locInfo));
  }

  __exports__.prepareBlock = prepareBlock;
  return __exports__;
})(__module4__);

// handlebars/compiler/base.js
var __module8__ = (function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__) {
  "use strict";
  var __exports__ = {};
  var parser = __dependency1__;
  var AST = __dependency2__;
  var WhitespaceControl = __dependency3__;
  var Helpers = __dependency4__;
  var extend = __dependency5__.extend;

  __exports__.parser = parser;

  var yy = {};
  extend(yy, Helpers, AST);

  function parse(input, options) {
    // Just return if an already-compiled AST was passed in.
    if (input.type === 'Program') { return input; }

    parser.yy = yy;

    // Altering the shared object here, but this is ok as parser is a sync operation
    yy.locInfo = function(locInfo) {
      return new yy.SourceLocation(options && options.srcName, locInfo);
    };

    var strip = new WhitespaceControl();
    return strip.accept(parser.parse(input));
  }

  __exports__.parse = parse;
  return __exports__;
})(__module9__, __module7__, __module10__, __module12__, __module3__);

// handlebars/compiler/compiler.js
var __module13__ = (function(__dependency1__, __dependency2__, __dependency3__) {
  "use strict";
  var __exports__ = {};
  var Exception = __dependency1__;
  var isArray = __dependency2__.isArray;
  var indexOf = __dependency2__.indexOf;
  var AST = __dependency3__;

  var slice = [].slice;


  function Compiler() {}

  __exports__.Compiler = Compiler;// the foundHelper register will disambiguate helper lookup from finding a
  // function in a context. This is necessary for mustache compatibility, which
  // requires that context functions in blocks are evaluated by blockHelperMissing,
  // and then proceed as if the resulting value was provided to blockHelperMissing.

  Compiler.prototype = {
    compiler: Compiler,

    equals: function(other) {
      var len = this.opcodes.length;
      if (other.opcodes.length !== len) {
        return false;
      }

      for (var i = 0; i < len; i++) {
        var opcode = this.opcodes[i],
            otherOpcode = other.opcodes[i];
        if (opcode.opcode !== otherOpcode.opcode || !argEquals(opcode.args, otherOpcode.args)) {
          return false;
        }
      }

      // We know that length is the same between the two arrays because they are directly tied
      // to the opcode behavior above.
      len = this.children.length;
      for (i = 0; i < len; i++) {
        if (!this.children[i].equals(other.children[i])) {
          return false;
        }
      }

      return true;
    },

    guid: 0,

    compile: function(program, options) {
      this.sourceNode = [];
      this.opcodes = [];
      this.children = [];
      this.options = options;
      this.stringParams = options.stringParams;
      this.trackIds = options.trackIds;

      options.blockParams = options.blockParams || [];

      // These changes will propagate to the other compiler components
      var knownHelpers = options.knownHelpers;
      options.knownHelpers = {
        'helperMissing': true,
        'blockHelperMissing': true,
        'each': true,
        'if': true,
        'unless': true,
        'with': true,
        'log': true,
        'lookup': true
      };
      if (knownHelpers) {
        for (var name in knownHelpers) {
          options.knownHelpers[name] = knownHelpers[name];
        }
      }

      return this.accept(program);
    },

    compileProgram: function(program) {
      var result = new this.compiler().compile(program, this.options);
      var guid = this.guid++;

      this.usePartial = this.usePartial || result.usePartial;

      this.children[guid] = result;
      this.useDepths = this.useDepths || result.useDepths;

      return guid;
    },

    accept: function(node) {
      this.sourceNode.unshift(node);
      var ret = this[node.type](node);
      this.sourceNode.shift();
      return ret;
    },

    Program: function(program) {
      this.options.blockParams.unshift(program.blockParams);

      var body = program.body;
      for(var i=0, l=body.length; i<l; i++) {
        this.accept(body[i]);
      }

      this.options.blockParams.shift();

      this.isSimple = l === 1;
      this.blockParams = program.blockParams ? program.blockParams.length : 0;

      return this;
    },

    BlockStatement: function(block) {
      transformLiteralToPath(block);

      var program = block.program,
          inverse = block.inverse;

      program = program && this.compileProgram(program);
      inverse = inverse && this.compileProgram(inverse);

      var type = this.classifySexpr(block);

      if (type === 'helper') {
        this.helperSexpr(block, program, inverse);
      } else if (type === 'simple') {
        this.simpleSexpr(block);

        // now that the simple mustache is resolved, we need to
        // evaluate it by executing `blockHelperMissing`
        this.opcode('pushProgram', program);
        this.opcode('pushProgram', inverse);
        this.opcode('emptyHash');
        this.opcode('blockValue', block.path.original);
      } else {
        this.ambiguousSexpr(block, program, inverse);

        // now that the simple mustache is resolved, we need to
        // evaluate it by executing `blockHelperMissing`
        this.opcode('pushProgram', program);
        this.opcode('pushProgram', inverse);
        this.opcode('emptyHash');
        this.opcode('ambiguousBlockValue');
      }

      this.opcode('append');
    },

    PartialStatement: function(partial) {
      this.usePartial = true;

      var params = partial.params;
      if (params.length > 1) {
        throw new Exception('Unsupported number of partial arguments: ' + params.length, partial);
      } else if (!params.length) {
        params.push({type: 'PathExpression', parts: [], depth: 0});
      }

      var partialName = partial.name.original,
          isDynamic = partial.name.type === 'SubExpression';
      if (isDynamic) {
        this.accept(partial.name);
      }

      this.setupFullMustacheParams(partial, undefined, undefined, true);

      var indent = partial.indent || '';
      if (this.options.preventIndent && indent) {
        this.opcode('appendContent', indent);
        indent = '';
      }

      this.opcode('invokePartial', isDynamic, partialName, indent);
      this.opcode('append');
    },

    MustacheStatement: function(mustache) {
      this.SubExpression(mustache);

      if(mustache.escaped && !this.options.noEscape) {
        this.opcode('appendEscaped');
      } else {
        this.opcode('append');
      }
    },

    ContentStatement: function(content) {
      if (content.value) {
        this.opcode('appendContent', content.value);
      }
    },

    CommentStatement: function() {},

    SubExpression: function(sexpr) {
      transformLiteralToPath(sexpr);
      var type = this.classifySexpr(sexpr);

      if (type === 'simple') {
        this.simpleSexpr(sexpr);
      } else if (type === 'helper') {
        this.helperSexpr(sexpr);
      } else {
        this.ambiguousSexpr(sexpr);
      }
    },
    ambiguousSexpr: function(sexpr, program, inverse) {
      var path = sexpr.path,
          name = path.parts[0],
          isBlock = program != null || inverse != null;

      this.opcode('getContext', path.depth);

      this.opcode('pushProgram', program);
      this.opcode('pushProgram', inverse);

      this.accept(path);

      this.opcode('invokeAmbiguous', name, isBlock);
    },

    simpleSexpr: function(sexpr) {
      this.accept(sexpr.path);
      this.opcode('resolvePossibleLambda');
    },

    helperSexpr: function(sexpr, program, inverse) {
      var params = this.setupFullMustacheParams(sexpr, program, inverse),
          path = sexpr.path,
          name = path.parts[0];

      if (this.options.knownHelpers[name]) {
        this.opcode('invokeKnownHelper', params.length, name);
      } else if (this.options.knownHelpersOnly) {
        throw new Exception("You specified knownHelpersOnly, but used the unknown helper " + name, sexpr);
      } else {
        path.falsy = true;

        this.accept(path);
        this.opcode('invokeHelper', params.length, path.original, AST.helpers.simpleId(path));
      }
    },

    PathExpression: function(path) {
      this.addDepth(path.depth);
      this.opcode('getContext', path.depth);

      var name = path.parts[0],
          scoped = AST.helpers.scopedId(path),
          blockParamId = !path.depth && !scoped && this.blockParamIndex(name);

      if (blockParamId) {
        this.opcode('lookupBlockParam', blockParamId, path.parts);
      } else  if (!name) {
        // Context reference, i.e. `{{foo .}}` or `{{foo ..}}`
        this.opcode('pushContext');
      } else if (path.data) {
        this.options.data = true;
        this.opcode('lookupData', path.depth, path.parts);
      } else {
        this.opcode('lookupOnContext', path.parts, path.falsy, scoped);
      }
    },

    StringLiteral: function(string) {
      this.opcode('pushString', string.value);
    },

    NumberLiteral: function(number) {
      this.opcode('pushLiteral', number.value);
    },

    BooleanLiteral: function(bool) {
      this.opcode('pushLiteral', bool.value);
    },

    Hash: function(hash) {
      var pairs = hash.pairs, i, l;

      this.opcode('pushHash');

      for (i=0, l=pairs.length; i<l; i++) {
        this.pushParam(pairs[i].value);
      }
      while (i--) {
        this.opcode('assignToHash', pairs[i].key);
      }
      this.opcode('popHash');
    },

    // HELPERS
    opcode: function(name) {
      this.opcodes.push({ opcode: name, args: slice.call(arguments, 1), loc: this.sourceNode[0].loc });
    },

    addDepth: function(depth) {
      if (!depth) {
        return;
      }

      this.useDepths = true;
    },

    classifySexpr: function(sexpr) {
      var isSimple = AST.helpers.simpleId(sexpr.path);

      var isBlockParam = isSimple && !!this.blockParamIndex(sexpr.path.parts[0]);

      // a mustache is an eligible helper if:
      // * its id is simple (a single part, not `this` or `..`)
      var isHelper = !isBlockParam && AST.helpers.helperExpression(sexpr);

      // if a mustache is an eligible helper but not a definite
      // helper, it is ambiguous, and will be resolved in a later
      // pass or at runtime.
      var isEligible = !isBlockParam && (isHelper || isSimple);

      var options = this.options;

      // if ambiguous, we can possibly resolve the ambiguity now
      // An eligible helper is one that does not have a complex path, i.e. `this.foo`, `../foo` etc.
      if (isEligible && !isHelper) {
        var name = sexpr.path.parts[0];

        if (options.knownHelpers[name]) {
          isHelper = true;
        } else if (options.knownHelpersOnly) {
          isEligible = false;
        }
      }

      if (isHelper) { return 'helper'; }
      else if (isEligible) { return 'ambiguous'; }
      else { return 'simple'; }
    },

    pushParams: function(params) {
      for(var i=0, l=params.length; i<l; i++) {
        this.pushParam(params[i]);
      }
    },

    pushParam: function(val) {
      var value = val.value != null ? val.value : val.original || '';

      if (this.stringParams) {
        if (value.replace) {
          value = value
              .replace(/^(\.?\.\/)*/g, '')
              .replace(/\//g, '.');
        }

        if(val.depth) {
          this.addDepth(val.depth);
        }
        this.opcode('getContext', val.depth || 0);
        this.opcode('pushStringParam', value, val.type);

        if (val.type === 'SubExpression') {
          // SubExpressions get evaluated and passed in
          // in string params mode.
          this.accept(val);
        }
      } else {
        if (this.trackIds) {
          var blockParamIndex;
          if (val.parts && !AST.helpers.scopedId(val) && !val.depth) {
             blockParamIndex = this.blockParamIndex(val.parts[0]);
          }
          if (blockParamIndex) {
            var blockParamChild = val.parts.slice(1).join('.');
            this.opcode('pushId', 'BlockParam', blockParamIndex, blockParamChild);
          } else {
            value = val.original || value;
            if (value.replace) {
              value = value
                  .replace(/^\.\//g, '')
                  .replace(/^\.$/g, '');
            }

            this.opcode('pushId', val.type, value);
          }
        }
        this.accept(val);
      }
    },

    setupFullMustacheParams: function(sexpr, program, inverse, omitEmpty) {
      var params = sexpr.params;
      this.pushParams(params);

      this.opcode('pushProgram', program);
      this.opcode('pushProgram', inverse);

      if (sexpr.hash) {
        this.accept(sexpr.hash);
      } else {
        this.opcode('emptyHash', omitEmpty);
      }

      return params;
    },

    blockParamIndex: function(name) {
      for (var depth = 0, len = this.options.blockParams.length; depth < len; depth++) {
        var blockParams = this.options.blockParams[depth],
            param = blockParams && indexOf(blockParams, name);
        if (blockParams && param >= 0) {
          return [depth, param];
        }
      }
    }
  };

  function precompile(input, options, env) {
    if (input == null || (typeof input !== 'string' && input.type !== 'Program')) {
      throw new Exception("You must pass a string or Handlebars AST to Handlebars.precompile. You passed " + input);
    }

    options = options || {};
    if (!('data' in options)) {
      options.data = true;
    }
    if (options.compat) {
      options.useDepths = true;
    }

    var ast = env.parse(input, options);
    var environment = new env.Compiler().compile(ast, options);
    return new env.JavaScriptCompiler().compile(environment, options);
  }

  __exports__.precompile = precompile;function compile(input, options, env) {
    if (input == null || (typeof input !== 'string' && input.type !== 'Program')) {
      throw new Exception("You must pass a string or Handlebars AST to Handlebars.compile. You passed " + input);
    }

    options = options || {};

    if (!('data' in options)) {
      options.data = true;
    }
    if (options.compat) {
      options.useDepths = true;
    }

    var compiled;

    function compileInput() {
      var ast = env.parse(input, options);
      var environment = new env.Compiler().compile(ast, options);
      var templateSpec = new env.JavaScriptCompiler().compile(environment, options, undefined, true);
      return env.template(templateSpec);
    }

    // Template is only compiled on first use and cached after that point.
    var ret = function(context, options) {
      if (!compiled) {
        compiled = compileInput();
      }
      return compiled.call(this, context, options);
    };
    ret._setup = function(options) {
      if (!compiled) {
        compiled = compileInput();
      }
      return compiled._setup(options);
    };
    ret._child = function(i, data, blockParams, depths) {
      if (!compiled) {
        compiled = compileInput();
      }
      return compiled._child(i, data, blockParams, depths);
    };
    return ret;
  }

  __exports__.compile = compile;function argEquals(a, b) {
    if (a === b) {
      return true;
    }

    if (isArray(a) && isArray(b) && a.length === b.length) {
      for (var i = 0; i < a.length; i++) {
        if (!argEquals(a[i], b[i])) {
          return false;
        }
      }
      return true;
    }
  }

  function transformLiteralToPath(sexpr) {
    if (!sexpr.path.parts) {
      var literal = sexpr.path;
      // Casting to string here to make false and 0 literal values play nicely with the rest
      // of the system.
      sexpr.path = new AST.PathExpression(false, 0, [literal.original+''], literal.original+'', literal.loc);
    }
  }
  return __exports__;
})(__module4__, __module3__, __module7__);

// handlebars/compiler/code-gen.js
var __module15__ = (function(__dependency1__) {
  "use strict";
  var __exports__;
  var isArray = __dependency1__.isArray;

  try {
    var SourceMap = require('source-map'),
          SourceNode = SourceMap.SourceNode;
  } catch (err) {
    /* istanbul ignore next: tested but not covered in istanbul due to dist build  */
    SourceNode = function(line, column, srcFile, chunks) {
      this.src = '';
      if (chunks) {
        this.add(chunks);
      }
    };
    /* istanbul ignore next */
    SourceNode.prototype = {
      add: function(chunks) {
        if (isArray(chunks)) {
          chunks = chunks.join('');
        }
        this.src += chunks;
      },
      prepend: function(chunks) {
        if (isArray(chunks)) {
          chunks = chunks.join('');
        }
        this.src = chunks + this.src;
      },
      toStringWithSourceMap: function() {
        return {code: this.toString()};
      },
      toString: function() {
        return this.src;
      }
    };
  }


  function castChunk(chunk, codeGen, loc) {
    if (isArray(chunk)) {
      var ret = [];

      for (var i = 0, len = chunk.length; i < len; i++) {
        ret.push(codeGen.wrap(chunk[i], loc));
      }
      return ret;
    } else if (typeof chunk === 'boolean' || typeof chunk === 'number') {
      // Handle primitives that the SourceNode will throw up on
      return chunk+'';
    }
    return chunk;
  }


  function CodeGen(srcFile) {
    this.srcFile = srcFile;
    this.source = [];
  }

  CodeGen.prototype = {
    prepend: function(source, loc) {
      this.source.unshift(this.wrap(source, loc));
    },
    push: function(source, loc) {
      this.source.push(this.wrap(source, loc));
    },

    merge: function() {
      var source = this.empty();
      this.each(function(line) {
        source.add(['  ', line, '\n']);
      });
      return source;
    },

    each: function(iter) {
      for (var i = 0, len = this.source.length; i < len; i++) {
        iter(this.source[i]);
      }
    },

    empty: function(loc) {
      loc = loc || this.currentLocation || {start:{}};
      return new SourceNode(loc.start.line, loc.start.column, this.srcFile);
    },
    wrap: function(chunk, loc) {
      if (chunk instanceof SourceNode) {
        return chunk;
      }

      loc = loc || this.currentLocation || {start:{}};
      chunk = castChunk(chunk, this, loc);

      return new SourceNode(loc.start.line, loc.start.column, this.srcFile, chunk);
    },

    functionCall: function(fn, type, params) {
      params = this.generateList(params);
      return this.wrap([fn, type ? '.' + type + '(' : '(', params, ')']);
    },

    quotedString: function(str) {
      return '"' + (str + '')
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\u2028/g, '\\u2028')   // Per Ecma-262 7.3 + 7.8.4
        .replace(/\u2029/g, '\\u2029') + '"';
    },

    objectLiteral: function(obj) {
      var pairs = [];

      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          var value = castChunk(obj[key], this);
          if (value !== 'undefined') {
            pairs.push([this.quotedString(key), ':', value]);
          }
        }
      }

      var ret = this.generateList(pairs);
      ret.prepend('{');
      ret.add('}');
      return ret;
    },


    generateList: function(entries, loc) {
      var ret = this.empty(loc);

      for (var i = 0, len = entries.length; i < len; i++) {
        if (i) {
          ret.add(',');
        }

        ret.add(castChunk(entries[i], this, loc));
      }

      return ret;
    },

    generateArray: function(entries, loc) {
      var ret = this.generateList(entries, loc);
      ret.prepend('[');
      ret.add(']');

      return ret;
    }
  };

  __exports__ = CodeGen;
  return __exports__;
})(__module3__);

// handlebars/compiler/javascript-compiler.js
var __module14__ = (function(__dependency1__, __dependency2__, __dependency3__, __dependency4__) {
  "use strict";
  var __exports__;
  var COMPILER_REVISION = __dependency1__.COMPILER_REVISION;
  var REVISION_CHANGES = __dependency1__.REVISION_CHANGES;
  var Exception = __dependency2__;
  var isArray = __dependency3__.isArray;
  var CodeGen = __dependency4__;

  function Literal(value) {
    this.value = value;
  }

  function JavaScriptCompiler() {}

  JavaScriptCompiler.prototype = {
    // PUBLIC API: You can override these methods in a subclass to provide
    // alternative compiled forms for name lookup and buffering semantics
    nameLookup: function(parent, name /* , type*/) {
      if (JavaScriptCompiler.isValidJavaScriptVariableName(name)) {
        return [parent, ".", name];
      } else {
        return [parent, "['", name, "']"];
      }
    },
    depthedLookup: function(name) {
      return [this.aliasable('this.lookup'), '(depths, "', name, '")'];
    },

    compilerInfo: function() {
      var revision = COMPILER_REVISION,
          versions = REVISION_CHANGES[revision];
      return [revision, versions];
    },

    appendToBuffer: function(source, location, explicit) {
      // Force a source as this simplifies the merge logic.
      if (!isArray(source)) {
        source = [source];
      }
      source = this.source.wrap(source, location);

      if (this.environment.isSimple) {
        return ['return ', source, ';'];
      } else if (explicit) {
        // This is a case where the buffer operation occurs as a child of another
        // construct, generally braces. We have to explicitly output these buffer
        // operations to ensure that the emitted code goes in the correct location.
        return ['buffer += ', source, ';'];
      } else {
        source.appendToBuffer = true;
        return source;
      }
    },

    initializeBuffer: function() {
      return this.quotedString("");
    },
    // END PUBLIC API

    compile: function(environment, options, context, asObject) {
      this.environment = environment;
      this.options = options;
      this.stringParams = this.options.stringParams;
      this.trackIds = this.options.trackIds;
      this.precompile = !asObject;

      this.name = this.environment.name;
      this.isChild = !!context;
      this.context = context || {
        programs: [],
        environments: []
      };

      this.preamble();

      this.stackSlot = 0;
      this.stackVars = [];
      this.aliases = {};
      this.registers = { list: [] };
      this.hashes = [];
      this.compileStack = [];
      this.inlineStack = [];
      this.blockParams = [];

      this.compileChildren(environment, options);

      this.useDepths = this.useDepths || environment.useDepths || this.options.compat;
      this.useBlockParams = this.useBlockParams || environment.useBlockParams;

      var opcodes = environment.opcodes,
          opcode,
          firstLoc,
          i,
          l;

      for (i = 0, l = opcodes.length; i < l; i++) {
        opcode = opcodes[i];

        this.source.currentLocation = opcode.loc;
        firstLoc = firstLoc || opcode.loc;
        this[opcode.opcode].apply(this, opcode.args);
      }

      // Flush any trailing content that might be pending.
      this.source.currentLocation = firstLoc;
      this.pushSource('');

      /* istanbul ignore next */
      if (this.stackSlot || this.inlineStack.length || this.compileStack.length) {
        throw new Exception('Compile completed with content left on stack');
      }

      var fn = this.createFunctionContext(asObject);
      if (!this.isChild) {
        var ret = {
          compiler: this.compilerInfo(),
          main: fn
        };
        var programs = this.context.programs;
        for (i = 0, l = programs.length; i < l; i++) {
          if (programs[i]) {
            ret[i] = programs[i];
          }
        }

        if (this.environment.usePartial) {
          ret.usePartial = true;
        }
        if (this.options.data) {
          ret.useData = true;
        }
        if (this.useDepths) {
          ret.useDepths = true;
        }
        if (this.useBlockParams) {
          ret.useBlockParams = true;
        }
        if (this.options.compat) {
          ret.compat = true;
        }

        if (!asObject) {
          ret.compiler = JSON.stringify(ret.compiler);

          this.source.currentLocation = {start: {line: 1, column: 0}};
          ret = this.objectLiteral(ret);

          if (options.srcName) {
            ret = ret.toStringWithSourceMap({file: options.destName});
            ret.map = ret.map && ret.map.toString();
          } else {
            ret = ret.toString();
          }
        } else {
          ret.compilerOptions = this.options;
        }

        return ret;
      } else {
        return fn;
      }
    },

    preamble: function() {
      // track the last context pushed into place to allow skipping the
      // getContext opcode when it would be a noop
      this.lastContext = 0;
      this.source = new CodeGen(this.options.srcName);
    },

    createFunctionContext: function(asObject) {
      var varDeclarations = '';

      var locals = this.stackVars.concat(this.registers.list);
      if(locals.length > 0) {
        varDeclarations += ", " + locals.join(", ");
      }

      // Generate minimizer alias mappings
      //
      // When using true SourceNodes, this will update all references to the given alias
      // as the source nodes are reused in situ. For the non-source node compilation mode,
      // aliases will not be used, but this case is already being run on the client and
      // we aren't concern about minimizing the template size.
      var aliasCount = 0;
      for (var alias in this.aliases) {
        var node = this.aliases[alias];

        if (this.aliases.hasOwnProperty(alias) && node.children && node.referenceCount > 1) {
          varDeclarations += ', alias' + (++aliasCount) + '=' + alias;
          node.children[0] = 'alias' + aliasCount;
        }
      }

      var params = ["depth0", "helpers", "partials", "data"];

      if (this.useBlockParams || this.useDepths) {
        params.push('blockParams');
      }
      if (this.useDepths) {
        params.push('depths');
      }

      // Perform a second pass over the output to merge content when possible
      var source = this.mergeSource(varDeclarations);

      if (asObject) {
        params.push(source);

        return Function.apply(this, params);
      } else {
        return this.source.wrap(['function(', params.join(','), ') {\n  ', source, '}']);
      }
    },
    mergeSource: function(varDeclarations) {
      var isSimple = this.environment.isSimple,
          appendOnly = !this.forceBuffer,
          appendFirst,

          sourceSeen,
          bufferStart,
          bufferEnd;
      this.source.each(function(line) {
        if (line.appendToBuffer) {
          if (bufferStart) {
            line.prepend('  + ');
          } else {
            bufferStart = line;
          }
          bufferEnd = line;
        } else {
          if (bufferStart) {
            if (!sourceSeen) {
              appendFirst = true;
            } else {
              bufferStart.prepend('buffer += ');
            }
            bufferEnd.add(';');
            bufferStart = bufferEnd = undefined;
          }

          sourceSeen = true;
          if (!isSimple) {
            appendOnly = false;
          }
        }
      });


      if (appendOnly) {
        if (bufferStart) {
          bufferStart.prepend('return ');
          bufferEnd.add(';');
        } else if (!sourceSeen) {
          this.source.push('return "";');
        }
      } else {
        varDeclarations += ", buffer = " + (appendFirst ? '' : this.initializeBuffer());

        if (bufferStart) {
          bufferStart.prepend('return buffer + ');
          bufferEnd.add(';');
        } else {
          this.source.push('return buffer;');
        }
      }

      if (varDeclarations) {
        this.source.prepend('var ' + varDeclarations.substring(2) + (appendFirst ? '' : ';\n'));
      }

      return this.source.merge();
    },

    // [blockValue]
    //
    // On stack, before: hash, inverse, program, value
    // On stack, after: return value of blockHelperMissing
    //
    // The purpose of this opcode is to take a block of the form
    // `{{#this.foo}}...{{/this.foo}}`, resolve the value of `foo`, and
    // replace it on the stack with the result of properly
    // invoking blockHelperMissing.
    blockValue: function(name) {
      var blockHelperMissing = this.aliasable('helpers.blockHelperMissing'),
          params = [this.contextName(0)];
      this.setupHelperArgs(name, 0, params);

      var blockName = this.popStack();
      params.splice(1, 0, blockName);

      this.push(this.source.functionCall(blockHelperMissing, 'call', params));
    },

    // [ambiguousBlockValue]
    //
    // On stack, before: hash, inverse, program, value
    // Compiler value, before: lastHelper=value of last found helper, if any
    // On stack, after, if no lastHelper: same as [blockValue]
    // On stack, after, if lastHelper: value
    ambiguousBlockValue: function() {
      // We're being a bit cheeky and reusing the options value from the prior exec
      var blockHelperMissing = this.aliasable('helpers.blockHelperMissing'),
          params = [this.contextName(0)];
      this.setupHelperArgs('', 0, params, true);

      this.flushInline();

      var current = this.topStack();
      params.splice(1, 0, current);

      this.pushSource([
          'if (!', this.lastHelper, ') { ',
            current, ' = ', this.source.functionCall(blockHelperMissing, 'call', params),
          '}']);
    },

    // [appendContent]
    //
    // On stack, before: ...
    // On stack, after: ...
    //
    // Appends the string value of `content` to the current buffer
    appendContent: function(content) {
      if (this.pendingContent) {
        content = this.pendingContent + content;
      } else {
        this.pendingLocation = this.source.currentLocation;
      }

      this.pendingContent = content;
    },

    // [append]
    //
    // On stack, before: value, ...
    // On stack, after: ...
    //
    // Coerces `value` to a String and appends it to the current buffer.
    //
    // If `value` is truthy, or 0, it is coerced into a string and appended
    // Otherwise, the empty string is appended
    append: function() {
      if (this.isInline()) {
        this.replaceStack(function(current) {
          return [' != null ? ', current, ' : ""'];
        });

        this.pushSource(this.appendToBuffer(this.popStack()));
      } else {
        var local = this.popStack();
        this.pushSource(['if (', local, ' != null) { ', this.appendToBuffer(local, undefined, true), ' }']);
        if (this.environment.isSimple) {
          this.pushSource(['else { ', this.appendToBuffer("''", undefined, true), ' }']);
        }
      }
    },

    // [appendEscaped]
    //
    // On stack, before: value, ...
    // On stack, after: ...
    //
    // Escape `value` and append it to the buffer
    appendEscaped: function() {
      this.pushSource(this.appendToBuffer(
          [this.aliasable('this.escapeExpression'), '(', this.popStack(), ')']));
    },

    // [getContext]
    //
    // On stack, before: ...
    // On stack, after: ...
    // Compiler value, after: lastContext=depth
    //
    // Set the value of the `lastContext` compiler value to the depth
    getContext: function(depth) {
      this.lastContext = depth;
    },

    // [pushContext]
    //
    // On stack, before: ...
    // On stack, after: currentContext, ...
    //
    // Pushes the value of the current context onto the stack.
    pushContext: function() {
      this.pushStackLiteral(this.contextName(this.lastContext));
    },

    // [lookupOnContext]
    //
    // On stack, before: ...
    // On stack, after: currentContext[name], ...
    //
    // Looks up the value of `name` on the current context and pushes
    // it onto the stack.
    lookupOnContext: function(parts, falsy, scoped) {
      var i = 0;

      if (!scoped && this.options.compat && !this.lastContext) {
        // The depthed query is expected to handle the undefined logic for the root level that
        // is implemented below, so we evaluate that directly in compat mode
        this.push(this.depthedLookup(parts[i++]));
      } else {
        this.pushContext();
      }

      this.resolvePath('context', parts, i, falsy);
    },

    // [lookupBlockParam]
    //
    // On stack, before: ...
    // On stack, after: blockParam[name], ...
    //
    // Looks up the value of `parts` on the given block param and pushes
    // it onto the stack.
    lookupBlockParam: function(blockParamId, parts) {
      this.useBlockParams = true;

      this.push(['blockParams[', blockParamId[0], '][', blockParamId[1], ']']);
      this.resolvePath('context', parts, 1);
    },

    // [lookupData]
    //
    // On stack, before: ...
    // On stack, after: data, ...
    //
    // Push the data lookup operator
    lookupData: function(depth, parts) {
      /*jshint -W083 */
      if (!depth) {
        this.pushStackLiteral('data');
      } else {
        this.pushStackLiteral('this.data(data, ' + depth + ')');
      }

      this.resolvePath('data', parts, 0, true);
    },

    resolvePath: function(type, parts, i, falsy) {
      /*jshint -W083 */
      if (this.options.strict || this.options.assumeObjects) {
        this.push(strictLookup(this.options.strict, this, parts, type));
        return;
      }

      var len = parts.length;
      for (; i < len; i++) {
        this.replaceStack(function(current) {
          var lookup = this.nameLookup(current, parts[i], type);
          // We want to ensure that zero and false are handled properly if the context (falsy flag)
          // needs to have the special handling for these values.
          if (!falsy) {
            return [' != null ? ', lookup, ' : ', current];
          } else {
            // Otherwise we can use generic falsy handling
            return [' && ', lookup];
          }
        });
      }
    },

    // [resolvePossibleLambda]
    //
    // On stack, before: value, ...
    // On stack, after: resolved value, ...
    //
    // If the `value` is a lambda, replace it on the stack by
    // the return value of the lambda
    resolvePossibleLambda: function() {
      this.push([this.aliasable('this.lambda'), '(', this.popStack(), ', ', this.contextName(0), ')']);
    },

    // [pushStringParam]
    //
    // On stack, before: ...
    // On stack, after: string, currentContext, ...
    //
    // This opcode is designed for use in string mode, which
    // provides the string value of a parameter along with its
    // depth rather than resolving it immediately.
    pushStringParam: function(string, type) {
      this.pushContext();
      this.pushString(type);

      // If it's a subexpression, the string result
      // will be pushed after this opcode.
      if (type !== 'SubExpression') {
        if (typeof string === 'string') {
          this.pushString(string);
        } else {
          this.pushStackLiteral(string);
        }
      }
    },

    emptyHash: function(omitEmpty) {
      if (this.trackIds) {
        this.push('{}'); // hashIds
      }
      if (this.stringParams) {
        this.push('{}'); // hashContexts
        this.push('{}'); // hashTypes
      }
      this.pushStackLiteral(omitEmpty ? 'undefined' : '{}');
    },
    pushHash: function() {
      if (this.hash) {
        this.hashes.push(this.hash);
      }
      this.hash = {values: [], types: [], contexts: [], ids: []};
    },
    popHash: function() {
      var hash = this.hash;
      this.hash = this.hashes.pop();

      if (this.trackIds) {
        this.push(this.objectLiteral(hash.ids));
      }
      if (this.stringParams) {
        this.push(this.objectLiteral(hash.contexts));
        this.push(this.objectLiteral(hash.types));
      }

      this.push(this.objectLiteral(hash.values));
    },

    // [pushString]
    //
    // On stack, before: ...
    // On stack, after: quotedString(string), ...
    //
    // Push a quoted version of `string` onto the stack
    pushString: function(string) {
      this.pushStackLiteral(this.quotedString(string));
    },

    // [pushLiteral]
    //
    // On stack, before: ...
    // On stack, after: value, ...
    //
    // Pushes a value onto the stack. This operation prevents
    // the compiler from creating a temporary variable to hold
    // it.
    pushLiteral: function(value) {
      this.pushStackLiteral(value);
    },

    // [pushProgram]
    //
    // On stack, before: ...
    // On stack, after: program(guid), ...
    //
    // Push a program expression onto the stack. This takes
    // a compile-time guid and converts it into a runtime-accessible
    // expression.
    pushProgram: function(guid) {
      if (guid != null) {
        this.pushStackLiteral(this.programExpression(guid));
      } else {
        this.pushStackLiteral(null);
      }
    },

    // [invokeHelper]
    //
    // On stack, before: hash, inverse, program, params..., ...
    // On stack, after: result of helper invocation
    //
    // Pops off the helper's parameters, invokes the helper,
    // and pushes the helper's return value onto the stack.
    //
    // If the helper is not found, `helperMissing` is called.
    invokeHelper: function(paramSize, name, isSimple) {
      var nonHelper = this.popStack();
      var helper = this.setupHelper(paramSize, name);
      var simple = isSimple ? [helper.name, ' || '] : '';

      var lookup = ['('].concat(simple, nonHelper);
      if (!this.options.strict) {
        lookup.push(' || ', this.aliasable('helpers.helperMissing'));
      }
      lookup.push(')');

      this.push(this.source.functionCall(lookup, 'call', helper.callParams));
    },

    // [invokeKnownHelper]
    //
    // On stack, before: hash, inverse, program, params..., ...
    // On stack, after: result of helper invocation
    //
    // This operation is used when the helper is known to exist,
    // so a `helperMissing` fallback is not required.
    invokeKnownHelper: function(paramSize, name) {
      var helper = this.setupHelper(paramSize, name);
      this.push(this.source.functionCall(helper.name, 'call', helper.callParams));
    },

    // [invokeAmbiguous]
    //
    // On stack, before: hash, inverse, program, params..., ...
    // On stack, after: result of disambiguation
    //
    // This operation is used when an expression like `{{foo}}`
    // is provided, but we don't know at compile-time whether it
    // is a helper or a path.
    //
    // This operation emits more code than the other options,
    // and can be avoided by passing the `knownHelpers` and
    // `knownHelpersOnly` flags at compile-time.
    invokeAmbiguous: function(name, helperCall) {
      this.useRegister('helper');

      var nonHelper = this.popStack();

      this.emptyHash();
      var helper = this.setupHelper(0, name, helperCall);

      var helperName = this.lastHelper = this.nameLookup('helpers', name, 'helper');

      var lookup = ['(', '(helper = ', helperName, ' || ', nonHelper, ')'];
      if (!this.options.strict) {
        lookup[0] = '(helper = ';
        lookup.push(
          ' != null ? helper : ',
          this.aliasable('helpers.helperMissing')
        );
      }

      this.push([
          '(', lookup,
          (helper.paramsInit ? ['),(', helper.paramsInit] : []), '),',
          '(typeof helper === ', this.aliasable('"function"'), ' ? ',
          this.source.functionCall('helper','call', helper.callParams), ' : helper))'
      ]);
    },

    // [invokePartial]
    //
    // On stack, before: context, ...
    // On stack after: result of partial invocation
    //
    // This operation pops off a context, invokes a partial with that context,
    // and pushes the result of the invocation back.
    invokePartial: function(isDynamic, name, indent) {
      var params = [],
          options = this.setupParams(name, 1, params, false);

      if (isDynamic) {
        name = this.popStack();
        delete options.name;
      }

      if (indent) {
        options.indent = JSON.stringify(indent);
      }
      options.helpers = 'helpers';
      options.partials = 'partials';

      if (!isDynamic) {
        params.unshift(this.nameLookup('partials', name, 'partial'));
      } else {
        params.unshift(name);
      }

      if (this.options.compat) {
        options.depths = 'depths';
      }
      options = this.objectLiteral(options);
      params.push(options);

      this.push(this.source.functionCall('this.invokePartial', '', params));
    },

    // [assignToHash]
    //
    // On stack, before: value, ..., hash, ...
    // On stack, after: ..., hash, ...
    //
    // Pops a value off the stack and assigns it to the current hash
    assignToHash: function(key) {
      var value = this.popStack(),
          context,
          type,
          id;

      if (this.trackIds) {
        id = this.popStack();
      }
      if (this.stringParams) {
        type = this.popStack();
        context = this.popStack();
      }

      var hash = this.hash;
      if (context) {
        hash.contexts[key] = context;
      }
      if (type) {
        hash.types[key] = type;
      }
      if (id) {
        hash.ids[key] = id;
      }
      hash.values[key] = value;
    },

    pushId: function(type, name, child) {
      if (type === 'BlockParam') {
        this.pushStackLiteral(
            'blockParams[' + name[0] + '].path[' + name[1] + ']'
            + (child ? ' + ' + JSON.stringify('.' + child) : ''));
      } else if (type === 'PathExpression') {
        this.pushString(name);
      } else if (type === 'SubExpression') {
        this.pushStackLiteral('true');
      } else {
        this.pushStackLiteral('null');
      }
    },

    // HELPERS

    compiler: JavaScriptCompiler,

    compileChildren: function(environment, options) {
      var children = environment.children, child, compiler;

      for(var i=0, l=children.length; i<l; i++) {
        child = children[i];
        compiler = new this.compiler();

        var index = this.matchExistingProgram(child);

        if (index == null) {
          this.context.programs.push('');     // Placeholder to prevent name conflicts for nested children
          index = this.context.programs.length;
          child.index = index;
          child.name = 'program' + index;
          this.context.programs[index] = compiler.compile(child, options, this.context, !this.precompile);
          this.context.environments[index] = child;

          this.useDepths = this.useDepths || compiler.useDepths;
          this.useBlockParams = this.useBlockParams || compiler.useBlockParams;
        } else {
          child.index = index;
          child.name = 'program' + index;

          this.useDepths = this.useDepths || child.useDepths;
          this.useBlockParams = this.useBlockParams || child.useBlockParams;
        }
      }
    },
    matchExistingProgram: function(child) {
      for (var i = 0, len = this.context.environments.length; i < len; i++) {
        var environment = this.context.environments[i];
        if (environment && environment.equals(child)) {
          return i;
        }
      }
    },

    programExpression: function(guid) {
      var child = this.environment.children[guid],
          programParams = [child.index, 'data', child.blockParams];

      if (this.useBlockParams || this.useDepths) {
        programParams.push('blockParams');
      }
      if (this.useDepths) {
        programParams.push('depths');
      }

      return 'this.program(' + programParams.join(', ') + ')';
    },

    useRegister: function(name) {
      if(!this.registers[name]) {
        this.registers[name] = true;
        this.registers.list.push(name);
      }
    },

    push: function(expr) {
      if (!(expr instanceof Literal)) {
        expr = this.source.wrap(expr);
      }

      this.inlineStack.push(expr);
      return expr;
    },

    pushStackLiteral: function(item) {
      this.push(new Literal(item));
    },

    pushSource: function(source) {
      if (this.pendingContent) {
        this.source.push(
            this.appendToBuffer(this.source.quotedString(this.pendingContent), this.pendingLocation));
        this.pendingContent = undefined;
      }

      if (source) {
        this.source.push(source);
      }
    },

    replaceStack: function(callback) {
      var prefix = ['('],
          stack,
          createdStack,
          usedLiteral;

      /* istanbul ignore next */
      if (!this.isInline()) {
        throw new Exception('replaceStack on non-inline');
      }

      // We want to merge the inline statement into the replacement statement via ','
      var top = this.popStack(true);

      if (top instanceof Literal) {
        // Literals do not need to be inlined
        stack = [top.value];
        prefix = ['(', stack];
        usedLiteral = true;
      } else {
        // Get or create the current stack name for use by the inline
        createdStack = true;
        var name = this.incrStack();

        prefix = ['((', this.push(name), ' = ', top, ')'];
        stack = this.topStack();
      }

      var item = callback.call(this, stack);

      if (!usedLiteral) {
        this.popStack();
      }
      if (createdStack) {
        this.stackSlot--;
      }
      this.push(prefix.concat(item, ')'));
    },

    incrStack: function() {
      this.stackSlot++;
      if(this.stackSlot > this.stackVars.length) { this.stackVars.push("stack" + this.stackSlot); }
      return this.topStackName();
    },
    topStackName: function() {
      return "stack" + this.stackSlot;
    },
    flushInline: function() {
      var inlineStack = this.inlineStack;
      this.inlineStack = [];
      for (var i = 0, len = inlineStack.length; i < len; i++) {
        var entry = inlineStack[i];
        /* istanbul ignore if */
        if (entry instanceof Literal) {
          this.compileStack.push(entry);
        } else {
          var stack = this.incrStack();
          this.pushSource([stack, ' = ', entry, ';']);
          this.compileStack.push(stack);
        }
      }
    },
    isInline: function() {
      return this.inlineStack.length;
    },

    popStack: function(wrapped) {
      var inline = this.isInline(),
          item = (inline ? this.inlineStack : this.compileStack).pop();

      if (!wrapped && (item instanceof Literal)) {
        return item.value;
      } else {
        if (!inline) {
          /* istanbul ignore next */
          if (!this.stackSlot) {
            throw new Exception('Invalid stack pop');
          }
          this.stackSlot--;
        }
        return item;
      }
    },

    topStack: function() {
      var stack = (this.isInline() ? this.inlineStack : this.compileStack),
          item = stack[stack.length - 1];

      /* istanbul ignore if */
      if (item instanceof Literal) {
        return item.value;
      } else {
        return item;
      }
    },

    contextName: function(context) {
      if (this.useDepths && context) {
        return 'depths[' + context + ']';
      } else {
        return 'depth' + context;
      }
    },

    quotedString: function(str) {
      return this.source.quotedString(str);
    },

    objectLiteral: function(obj) {
      return this.source.objectLiteral(obj);
    },

    aliasable: function(name) {
      var ret = this.aliases[name];
      if (ret) {
        ret.referenceCount++;
        return ret;
      }

      ret = this.aliases[name] = this.source.wrap(name);
      ret.aliasable = true;
      ret.referenceCount = 1;

      return ret;
    },

    setupHelper: function(paramSize, name, blockHelper) {
      var params = [],
          paramsInit = this.setupHelperArgs(name, paramSize, params, blockHelper);
      var foundHelper = this.nameLookup('helpers', name, 'helper');

      return {
        params: params,
        paramsInit: paramsInit,
        name: foundHelper,
        callParams: [this.contextName(0)].concat(params)
      };
    },

    setupParams: function(helper, paramSize, params) {
      var options = {}, contexts = [], types = [], ids = [], param;

      options.name = this.quotedString(helper);
      options.hash = this.popStack();

      if (this.trackIds) {
        options.hashIds = this.popStack();
      }
      if (this.stringParams) {
        options.hashTypes = this.popStack();
        options.hashContexts = this.popStack();
      }

      var inverse = this.popStack(),
          program = this.popStack();

      // Avoid setting fn and inverse if neither are set. This allows
      // helpers to do a check for `if (options.fn)`
      if (program || inverse) {
        options.fn = program || 'this.noop';
        options.inverse = inverse || 'this.noop';
      }

      // The parameters go on to the stack in order (making sure that they are evaluated in order)
      // so we need to pop them off the stack in reverse order
      var i = paramSize;
      while (i--) {
        param = this.popStack();
        params[i] = param;

        if (this.trackIds) {
          ids[i] = this.popStack();
        }
        if (this.stringParams) {
          types[i] = this.popStack();
          contexts[i] = this.popStack();
        }
      }

      if (this.trackIds) {
        options.ids = this.source.generateArray(ids);
      }
      if (this.stringParams) {
        options.types = this.source.generateArray(types);
        options.contexts = this.source.generateArray(contexts);
      }

      if (this.options.data) {
        options.data = 'data';
      }
      if (this.useBlockParams) {
        options.blockParams = 'blockParams';
      }
      return options;
    },

    setupHelperArgs: function(helper, paramSize, params, useRegister) {
      var options = this.setupParams(helper, paramSize, params, true);
      options = this.objectLiteral(options);
      if (useRegister) {
        this.useRegister('options');
        params.push('options');
        return ['options=', options];
      } else {
        params.push(options);
        return '';
      }
    }
  };


  var reservedWords = (
    "break else new var" +
    " case finally return void" +
    " catch for switch while" +
    " continue function this with" +
    " default if throw" +
    " delete in try" +
    " do instanceof typeof" +
    " abstract enum int short" +
    " boolean export interface static" +
    " byte extends long super" +
    " char final native synchronized" +
    " class float package throws" +
    " const goto private transient" +
    " debugger implements protected volatile" +
    " double import public let yield await" +
    " null true false"
  ).split(" ");

  var compilerWords = JavaScriptCompiler.RESERVED_WORDS = {};

  for(var i=0, l=reservedWords.length; i<l; i++) {
    compilerWords[reservedWords[i]] = true;
  }

  JavaScriptCompiler.isValidJavaScriptVariableName = function(name) {
    return !JavaScriptCompiler.RESERVED_WORDS[name] && /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(name);
  };

  function strictLookup(requireTerminal, compiler, parts, type) {
    var stack = compiler.popStack();

    var i = 0,
        len = parts.length;
    if (requireTerminal) {
      len--;
    }

    for (; i < len; i++) {
      stack = compiler.nameLookup(stack, parts[i], type);
    }

    if (requireTerminal) {
      return [compiler.aliasable('this.strict'), '(', stack, ', ', compiler.quotedString(parts[i]), ')'];
    } else {
      return stack;
    }
  }

  __exports__ = JavaScriptCompiler;
  return __exports__;
})(__module2__, __module4__, __module3__, __module15__);

// handlebars.js
var __module0__ = (function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__) {
  "use strict";
  var __exports__;
  /*globals Handlebars: true */
  var Handlebars = __dependency1__;

  // Compiler imports
  var AST = __dependency2__;
  var Parser = __dependency3__.parser;
  var parse = __dependency3__.parse;
  var Compiler = __dependency4__.Compiler;
  var compile = __dependency4__.compile;
  var precompile = __dependency4__.precompile;
  var JavaScriptCompiler = __dependency5__;

  var _create = Handlebars.create;
  var create = function() {
    var hb = _create();

    hb.compile = function(input, options) {
      return compile(input, options, hb);
    };
    hb.precompile = function (input, options) {
      return precompile(input, options, hb);
    };

    hb.AST = AST;
    hb.Compiler = Compiler;
    hb.JavaScriptCompiler = JavaScriptCompiler;
    hb.Parser = Parser;
    hb.parse = parse;

    return hb;
  };

  Handlebars = create();
  Handlebars.create = create;

  /*jshint -W040 */
  /* istanbul ignore next */
  var root = typeof global !== 'undefined' ? global : window,
      $Handlebars = root.Handlebars;
  /* istanbul ignore next */
  Handlebars.noConflict = function() {
    if (root.Handlebars === Handlebars) {
      root.Handlebars = $Handlebars;
    }
  };

  Handlebars['default'] = Handlebars;

  __exports__ = Handlebars;
  return __exports__;
})(__module1__, __module7__, __module8__, __module13__, __module14__);

  return __module0__;
}));

/**!
 *
 * sitecore SPEAK framework
 *
 * Built: Mon Mar 23 2015 10:58:36 GMT+0000 (GMT Standard Time)
 * PackageVersion: 2.0.1
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
                    pageCode = pageCode.apply(window, args);
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

    return {
      presenter: presenter,
      plugin: plugin,
      component: component,
      pageCode: pageCode,
      app: app,
      propertyType: propertyType,
      build: function ( elementsInPage ) {
        //presenter.flush( );
        app.flush( );
        component.flush( );
        pageCode.flush( );
        plugin.flush( );

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
    componentManager = _dereq_("./manager/component")(lifeCycle, stores.component, stores.presenter, bootstrapValues, componentFactory, speak),
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
speak.component = stores.component.create.bind(stores.component);

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

exports = module.exports = speak;

if (isBrowser) {
    window.Sitecore = window.Sitecore || {};
    window.Sitecore.Speak = exports;
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./conf":33,"./events/index":34,"./factory/application":36,"./factory/component":37,"./factory/store":38,"./loader/loader":40,"./manager/app":41,"./manager/component":42,"./manager/plugin":43,"./manager/template":44,"./model/baseModel":45,"./model/basePresenter":46,"./model/pageCode":47,"./parser/index":52,"./utils":61,"./utils/DOM":55,"./utils/context":59,"./utils/inheritance":62,"./utils/inject":63,"modulejs":2,"sc-pipeline":3,"sc-utils":22,"speakevent":32}],40:[function(_dereq_,module,exports){
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
      all = [ ];

    all = all
      .concat( componentkeys )
      .concat( pageCodeKeys )
      .concat( presenterStoreKeys )
      .concat( pluginStoreKeys );

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

    apps.forEach( triggerChanged );
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

      if ( el ) {
        createComponents( this, el );
      }

      var apps = sortByDepth( scUtils.object.flatten( applicationStore.stores ) ),
        exposed = [];

      if ( apps.length > 0 ) {
        apps.forEach( function( app ) {
          var p = applicationFactory.createApplication( app, start );
          exposed.push( p );
          createComponents( p );
          applyApplicationPlugin( p );
        } );

        tree = utils.createTree( exposed );
        
        pageCodePipeline( exposed );

        exposed.forEach( function( app ) {
          applyApplicationPlugin( app );
        } );
      }

      callback( tree, exposed );
    }
  };
};

module.exports = AppManager;
},{"../utils/index":61,"sc-utils":22}],42:[function(_dereq_,module,exports){
var componentParser = _dereq_( "../parser/component" ),
  conf = _dereq_( "../conf" ),
  scUtils = _dereq_( "sc-utils" ),
  utils = _dereq_( "../utils/index" );

var ComponentManager = function( lifeCycle, componentStore, presenterStore, bootValues, componentFactory, _s ) {

  var getInitialValue = function( comp, def ) {

      var init = comp.properties || {},
        properties = utils.extractProperties( def );

      //set property from the definition
      for ( var i in properties ) {
        if ( properties.hasOwnProperty( i ) ) {
          init[ i ] = properties[ i ];
        }
      }

      //override properties from the component
      for ( var j in comp ) {
        if ( comp.hasOwnProperty( j ) ) {
          init[ j ] = comp[ j ];
        }
      }

      return init;
    },
    exposeComp = function( comp, app ) {
      //if already registered
      if ( comp.el && comp.el.__speak ) {
        return;
      }

      var def = componentStore.find( comp.key ) || {},
        initial = getInitialValue( comp, def ),
        result,
        domID = scUtils.string.uniqueId(),
        Component;

      //get deps from requirejs. execute the function and use the object returned.
      var deps = def.deps,
          args = [];

      if ( deps && scUtils.is.a.function( def) ) {
        deps.forEach( function( d ) {
          args.push( requirejs( d ) );
        } );

        def = def.apply( window, args );
      }

      var presenter = presenterStore.find( def.presenter || comp.presenter );

      if ( presenter && presenter.make ) {
        result = presenter.make( def, comp.el, app, initial );
      } else {
        Component = componentFactory.make( presenter, def, comp.el, app, initial );

        result = new Component( initial, app, comp.el, _s );
      }

      if ( comp.el ) {
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
    executeMethod = function( method, app, isPreInit ) {
      return function( c ) {
        if ( c[ method ] ) {
          if ( isPreInit ) {
            c[ method ]( c );
          } else {
            c[ method ]();
          }
        }
      };
    },
    initializeComponents = function( components, app ) {
      var result = [];

      components.forEach( function( c ) {
        var cObject = exposeComp( c, app );

        if ( !cObject ) {
          return;
        }

        //remove cloack
        if ( cObject.el.hasAttribute( conf.cloak ) ) {
          cObject.el.removeAttribute( conf.cloak );
        }

        result.push( cObject );

        if ( cObject.parent && !cObject.depricated ) {
          return;
        }

        var current = app[ cObject.id ];

        if ( current ) {
          if ( scUtils.is.an.array( current ) ) {
            current.push( cObject );
          } else {
            app[ cObject.id ] = [ current, cObject ];
          }
        } else {
          app[ cObject.id ] = cObject;
        }
      } );

      return result;
    };

  return {
    exposeComponent: exposeComp,
    /**
     * Create components for an Application
     * @param  {Application} app application under which you want to create the components
     */
    componentPipeline: function( app, el ) {
      if ( !el ) {
        el = app.el;
      }

      var components = componentParser.parse( el ),
        life = lifeCycle.slice( 0 ); //clone to keep lifeCycle clean

      if ( !scUtils.array.contains( life, "initialize" ) ) {
        throw new Error( "you must have a initialize method in your lifeCycle" );
      }

      while ( life[ 0 ] !== "initialize" ) {
        var beforeInitMethod = life.shift();
        components.forEach( executeMethod( beforeInitMethod, app, true ) );
      }

      var componentObjects = initializeComponents( components, app );

      app.components = app.components || [];
      app.components = app.components.concat( componentObjects );

      life.shift();

      while ( life.length ) {
        var afterInitiMethod = life.shift();
        componentObjects.forEach( executeMethod( afterInitiMethod, app ) );
      }

      return utils.createTree( componentObjects, "id", true );
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
var utils = _dereq_( "../utils/index" ),
  classUtils = _dereq_("../utils/class"),
  extendUtil = _dereq_( "../utils/inheritance" ),
  Events = _dereq_( "../utils/events" );

module.exports = function( propertyStore ) {
  var BaseModel = function ( initial ) {
    utils.initializeProperties( this, initial );
    this.__parameterTemplates = initial || {};
    this.defineProperties();
  };

  extendUtil.extend( BaseModel.prototype, classUtils( propertyStore ) );
  extendUtil.extend( BaseModel.prototype, Events );

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
        self.dependencies.push( deps );
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
    return this.dependencies;
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

    els.forEach( function( e ) {
        if ( !self.stores[ e.key ] ) {
            self.stores[ e.key ] = e;
            if ( e.presenterScript ) {
                var exclude = [ ];
                self.dependencies.forEach( function( depsArray ) {
                    depsArray.forEach( function( dep ) {
                        var depsLength = e.presenterScript.length;
                        for ( var i = 0; i < depsLength; i++ ) {
                            if ( e.presenterScript[ i ] === dep ) {
                                exclude.push( i );
                            }
                        }
                    } );
                } );
                exclude.forEach( function( index ) {
                    e.presenterScript.splice( index, 1 );
                } );
                if ( e.presenterScript.length > 0 ) {
                    self.dependencies.push( e.presenterScript );
                }
            }
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
var conf = _dereq_( "../conf" ),
  DOMutils = _dereq_( "../utils/DOM" ),
  findParentApp = DOMutils.findParentApp,
  findPageCodes = DOMutils.findPageCodes;

var pageCodeParser = {
  /**
   * parse an element to retrieve all the pageCode tags
   * @param  {DOMElement}   els optionnal dom element served as root for the search
   * @return {[DOMElement]} an array of DOMElement
   */
  parse: function( els ) {
    var result = [];

    findPageCodes().forEach( function( el ) {
      var parentApp = findParentApp( el ),
        script = el.getAttribute( "src" );

      //if no parentApp, we fallback to the body element
      if ( !parentApp ) {
        parentApp = document;
      }

      var pageCodeName = parentApp.getAttribute( conf.APP_KEY );

      if ( !pageCodeName ) {
        pageCodeName = "app";
      }

      result.push( {
        el: el,
        id: parentApp.getAttribute( conf.APP_KEY ),
        key: pageCodeName,
        script: [ script ],
      } );
    } );

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

    request = new XMLHttpRequest();
    request.open("GET", url, true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400){

        resp = request.responseText;

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
var scUtils = _dereq_( "sc-utils" ),
    ajaxUtils = _dereq_( "../utils/ajax" ),
    DOM = _dereq_( "../utils/DOM" );

module.exports = {
    closeDialog: function( returnValue ) {
        window.top.returnValue = returnValue;
        window.top.dialogClose( returnValue );
    },
    remove: function( el ) {

        if ( scUtils.is.a.string( el ) ) {
            el = this.el.querySelector( el );
        }

        el = el || this.el;

        var parentApp = this,
            component = [ ],
            removeApp = function( app ) {
                var byUniqueId = function( appObject ) {
                        return app.__domID === appObject.__domID;
                    },
                    appObj = scUtils.array.find( parentApp.children, byUniqueId );

                if ( appObj ) {
                    appObj.remove( );
                    parentApp.children = parentApp.children.filter( byUniqueId );
                }
            },
            removeComponent = function( compEl ) {
                var byUniqueId = function( compObject ) {
                        return compEl.__domID === compObject.__domID;
                    },
                    compObj = scUtils.array.find( parentApp.components, byUniqueId );

                if ( compObj ) {

                    if ( compObj.destroy ) {
                        compObj.destroy( );
                    }

                    var fromApp = parentApp[ compObj.id ];

                    if ( fromApp ) {
                        if ( scUtils.is.an.array( fromApp ) ) {
                            parentApp[ compObj.id ] = parentApp[ compObj.id ].filter( byUniqueId );
                        } else {
                            delete parentApp[ compObj.id ];
                        }
                    }

                    parentApp.components = parentApp.components.filter( byUniqueId );
                }
            };

        //remove applications
        var apps = DOM.findApps( el );

        if ( apps ) {
            apps.forEach( removeApp );
        }

        var comps = DOM.findComponents( el );

        if ( comps ) {
            comps.forEach( removeComponent );
        }

        el.innerHTML = ""; //empty the HTML element

        return parentApp;
    },
    sendMessage: function( returnValue ) {
        window.top.receiveMessage( returnValue, root.getParameterByName( "sp" ) );
    },
    findComponent: function( componentName ) {
        var componentLenght = 0,
            components = this.components,
            nestedApps = this.children,
            result,
            found;

        components.forEach( function( comp ) {
            if ( !found && ( comp.id === componentName ) ) {
                found = true;
                result = comp;
            }
        } );

        if ( !result && nestedApps && nestedApps.length ) {
            nestedApps.forEach( function( app ) {
                if ( !found ) {
                    result = app.findComponent( componentName );
                    found = true;
                }
            } );
        }

        return result;
    },
    findApplication: function( appName ) {
        var result,
            found,
            nestedApps = this.children || [ ];

        if ( !appName ) {
            return null;
        }

        if ( this.key === appName ) {
            return this;
        } else {
            nestedApps.forEach( function( app ) {
                if ( !found ) {
                    var res = app.findApplication( appName );
                    if ( res ) {
                        found = true;
                        result = res;
                    }
                }
            } );
        }

        return result;
    },
    replace: function( config, callback ) {
        config.el = scUtils.is.a.string( config.el ) ? this.el.querySelector( config.el ) : config.el;
        config.el = config.el || this.el;

        this.remove( config.el );
        this.inject( config, callback );
    },
    append: function( config, callback ) {
        if ( scUtils.is.an.object( config ) ) {
            config.el = scUtils.is.a.string( config.el ) ? this.el.querySelector( config.el ) : config.el;
            config.el = config.el || this.el;
        } else {
            config = {
                html: config,
                el: this.el
            };
        }

        config.append = true;

        this.inject( config, callback );
    },
    prepend: function( config, callback ) {
        if ( scUtils.is.an.object( config ) ) {
            config.el = scUtils.is.a.string( config.el ) ? this.el.querySelector( config.el ) : config.el;
            config.el = config.el || this.el;
        } else {
            config = {
                html: config,
                el: this.el
            };
        }

        config.prepend = true;

        this.inject( config, callback );
    },
    insertRendering: function( itemId, options, cb ) {
        var item,
            _sc = window.Sitecore.Speak,
            that = this,
            selector,
            $el,
            queryStringLang = "",
            langFromDom = DOM.findMetaLang( ),
            lang = langFromDom ? langFromDom : "",
            database = "core",
            defaultOptions = {
                database: database,
                path: "/",
                lang: lang
            };

        if ( scUtils.is.a.function( options ) ) {
            cb = options;
        } else if ( options ) {
            defaultOptions = scUtils.object.extend( defaultOptions, options );
        }

        if ( !defaultOptions.name ) {
            defaultOptions.name = scUtils.string.uniqueId( "subapp_" );
        }

        if ( defaultOptions.lang ) {
            queryStringLang = "&sc_lang=" + lang;
        }

        ajaxUtils.get( defaultOptions.path + "?sc_itemid=" + itemId + "&sc_database=" + defaultOptions.database + queryStringLang, function( data ) {
            that.insertMarkups( data.result, defaultOptions.name, defaultOptions, cb );
        } );
    },
    insertMarkups: function( html, options, cb ) {
        var defaultOptions = {
            prepend: false,
            el: options.el,
            html: html
        };

        defaultOptions = scUtils.object.extend( defaultOptions, options );

        if ( !defaultOptions.el ) {
            if ( defaultOptions.selector ) {
                defaultOptions.el = document.querySelectorAll( options.selector );
            } else {
                defaultOptions.el = document.body;
            }
        }

        this.inject( defaultOptions, cb );
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
          this.trigger( "change:" + propertyName, this.get( propertyName ) );
          this.__triggerForComputed(beforeChangeComputedValues);
        }
      }
    },
    __getComputedValues: function( ) {
      var result = {},
          self = this;

      if(!this.computed) {
        return;
      }

      this.computed.forEach( function( key ) {
        result[key] = self[key];
      });

      return result;
    },
    __triggerForComputed: function( currentValues ) {
      if(!this.computed) {
        return;
      }

      var self = this;

      this.computed.forEach(function( key ) {
        if(this[key] !== currentValues[key]) {
          this.trigger( "change:" + key, this.get( key ) );
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

      this.computed = this.computed || [];
      this.computed.push(name);

      Object.defineProperty(this, name, {
        get: function() {
          return getter.call(self);
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

      this.computed = this.computed || [];
      this.computed.push(name);

      Object.defineProperty(this, name, {
        get: function() {
          getterAndSetter.get.apply(self);
        },
        set: function () {
          var value = getterAndSetter.get.apply(self);

          this.trigger( "beforeChange:" + name, value );

          getterAndSetter.set.apply(self, arguments);

          this.trigger( "change:" + name, getterAndSetter.get.apply(self));
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

module.exports = function( loader, parser, stores ) {

    return {
        setupInjectMethod: function( createApp ) {
            return function( config, callback ) {
                var app = this,
                    el = config.el,
                    html = config.html,
                    append = config.append,
                    replace = config.replace,
                    prepend = config.prepend;

                if ( !append && !prepend && !replace ) {
                    append = true;
                }

                if ( !app || !el || !html ) {
                    throw new Error( "incorrect parameter passed" );
                }

                //el.style.display = 'none';
                var emptyDiv = DOM.createDomElement(),
                    elements = DOM.createDomElement( html );

                elements.forEach( function( nodeElement ) {
                    emptyDiv.appendChild( nodeElement );
                } );

                var allElements = parser.parse( emptyDiv );

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
                var exposeApp = function( apps ) {

                    if ( apps ) {
                        app.children = app.children || [];
                        app.children = app.children.concat( apps );
                    }

                    Sitecore.Speak.applications = Sitecore.Speak.applications.concat( apps );


                    if ( callback ) {
                        callback( app );
                    }
                    app.trigger( "change", app );
                };

                stores.build( allElements );

                loader.load( stores, function() {
                    createApp.call( app, el, exposeApp );
                } );
            };
        }
    };
};
},{"./DOM":55}],64:[function(_dereq_,module,exports){
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

},{"./DOM":55}]},{},[39])
(39)
});
// Knockout JavaScript library v3.0.0
// (c) Steven Sanderson - http://knockoutjs.com/
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

(function() {(function(q){var y=this||(0,eval)("this"),w=y.document,K=y.navigator,u=y.jQuery,B=y.JSON;(function(q){"function"===typeof require&&"object"===typeof exports&&"object"===typeof module?q(module.exports||exports):"function"===typeof define&&define.amd?define(["exports"],q):q(y.ko={})})(function(F){function G(a,c){return null===a||typeof a in N?a===c:!1}function H(b,c,d,e){a.d[b]={init:function(b){a.a.f.set(b,L,{});return{controlsDescendantBindings:!0}},update:function(b,h,k,m,f){k=a.a.f.get(b,L);h=a.a.c(h());
m=!d!==!h;var p=!k.ob;if(p||c||m!==k.Db)p&&(k.ob=a.a.Ya(a.e.childNodes(b),!0)),m?(p||a.e.S(b,a.a.Ya(k.ob)),a.Ta(e?e(f,h):f,b)):a.e.Z(b),k.Db=m}};a.g.Y[b]=!1;a.e.P[b]=!0}var a="undefined"!==typeof F?F:{};a.b=function(b,c){for(var d=b.split("."),e=a,g=0;g<d.length-1;g++)e=e[d[g]];e[d[d.length-1]]=c};a.s=function(a,c,d){a[c]=d};a.version="3.0.0";a.b("version",a.version);a.a=function(){function b(a,b){for(var f in a)a.hasOwnProperty(f)&&b(f,a[f])}function c(k,b){if("input"!==a.a.v(k)||!k.type||"click"!=
b.toLowerCase())return!1;var f=k.type;return"checkbox"==f||"radio"==f}var d={},e={};d[K&&/Firefox\/2/i.test(K.userAgent)?"KeyboardEvent":"UIEvents"]=["keyup","keydown","keypress"];d.MouseEvents="click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave".split(" ");b(d,function(a,b){if(b.length)for(var f=0,c=b.length;f<c;f++)e[b[f]]=a});var g={propertychange:!0},h=w&&function(){for(var a=3,b=w.createElement("div"),f=b.getElementsByTagName("i");b.innerHTML="\x3c!--[if gt IE "+
++a+"]><i></i><![endif]--\x3e",f[0];);return 4<a?a:q}();return{$a:["authenticity_token",/^__RequestVerificationToken(_.*)?$/],n:function(a,b){for(var f=0,c=a.length;f<c;f++)b(a[f])},l:function(a,b){if("function"==typeof Array.prototype.indexOf)return Array.prototype.indexOf.call(a,b);for(var f=0,c=a.length;f<c;f++)if(a[f]===b)return f;return-1},Ua:function(a,b,f){for(var c=0,d=a.length;c<d;c++)if(b.call(f,a[c]))return a[c];return null},ia:function(b,c){var f=a.a.l(b,c);0<=f&&b.splice(f,1)},Va:function(b){b=
b||[];for(var c=[],f=0,d=b.length;f<d;f++)0>a.a.l(c,b[f])&&c.push(b[f]);return c},ha:function(a,b){a=a||[];for(var f=[],c=0,d=a.length;c<d;c++)f.push(b(a[c]));return f},ga:function(a,b){a=a||[];for(var f=[],c=0,d=a.length;c<d;c++)b(a[c])&&f.push(a[c]);return f},X:function(a,b){if(b instanceof Array)a.push.apply(a,b);else for(var f=0,c=b.length;f<c;f++)a.push(b[f]);return a},V:function(b,c,f){var d=a.a.l(a.a.Ha(b),c);0>d?f&&b.push(c):f||b.splice(d,1)},extend:function(a,b){if(b)for(var f in b)b.hasOwnProperty(f)&&
(a[f]=b[f]);return a},K:b,Da:function(a,b){if(!a)return a;var f={},c;for(c in a)a.hasOwnProperty(c)&&(f[c]=b(a[c],c,a));return f},wa:function(b){for(;b.firstChild;)a.removeNode(b.firstChild)},Vb:function(b){b=a.a.Q(b);for(var c=w.createElement("div"),f=0,d=b.length;f<d;f++)c.appendChild(a.L(b[f]));return c},Ya:function(b,c){for(var f=0,d=b.length,e=[];f<d;f++){var g=b[f].cloneNode(!0);e.push(c?a.L(g):g)}return e},S:function(b,c){a.a.wa(b);if(c)for(var f=0,d=c.length;f<d;f++)b.appendChild(c[f])},nb:function(b,
c){var f=b.nodeType?[b]:b;if(0<f.length){for(var d=f[0],e=d.parentNode,g=0,n=c.length;g<n;g++)e.insertBefore(c[g],d);g=0;for(n=f.length;g<n;g++)a.removeNode(f[g])}},$:function(a,b){if(a.length){for(b=8===b.nodeType&&b.parentNode||b;a.length&&a[0].parentNode!==b;)a.splice(0,1);if(1<a.length){var f=a[0],c=a[a.length-1];for(a.length=0;f!==c;)if(a.push(f),f=f.nextSibling,!f)return;a.push(c)}}return a},qb:function(a,b){7>h?a.setAttribute("selected",b):a.selected=b},la:function(a){return null===a||a===
q?"":a.trim?a.trim():a.toString().replace(/^[\s\xa0]+|[\s\xa0]+$/g,"")},ec:function(b,c){for(var f=[],d=(b||"").split(c),e=0,g=d.length;e<g;e++){var n=a.a.la(d[e]);""!==n&&f.push(n)}return f},ac:function(a,b){a=a||"";return b.length>a.length?!1:a.substring(0,b.length)===b},Gb:function(a,b){if(a===b)return!0;if(11===a.nodeType)return!1;if(b.contains)return b.contains(3===a.nodeType?a.parentNode:a);if(b.compareDocumentPosition)return 16==(b.compareDocumentPosition(a)&16);for(;a&&a!=b;)a=a.parentNode;
return!!a},va:function(b){return a.a.Gb(b,b.ownerDocument.documentElement)},Ra:function(b){return!!a.a.Ua(b,a.a.va)},v:function(a){return a&&a.tagName&&a.tagName.toLowerCase()},r:function(b,d,f){var e=h&&g[d];if(e||"undefined"==typeof u)if(e||"function"!=typeof b.addEventListener)if("undefined"!=typeof b.attachEvent){var s=function(a){f.call(b,a)},l="on"+d;b.attachEvent(l,s);a.a.C.ea(b,function(){b.detachEvent(l,s)})}else throw Error("Browser doesn't support addEventListener or attachEvent");else b.addEventListener(d,
f,!1);else{if(c(b,d)){var n=f;f=function(a,b){var f=this.checked;b&&(this.checked=!0!==b.Ab);n.call(this,a);this.checked=f}}u(b).bind(d,f)}},da:function(a,b){if(!a||!a.nodeType)throw Error("element must be a DOM node when calling triggerEvent");if("undefined"!=typeof u){var f=[];c(a,b)&&f.push({Ab:a.checked});u(a).trigger(b,f)}else if("function"==typeof w.createEvent)if("function"==typeof a.dispatchEvent)f=w.createEvent(e[b]||"HTMLEvents"),f.initEvent(b,!0,!0,y,0,0,0,0,0,!1,!1,!1,!1,0,a),a.dispatchEvent(f);
else throw Error("The supplied element doesn't support dispatchEvent");else if("undefined"!=typeof a.fireEvent)c(a,b)&&(a.checked=!0!==a.checked),a.fireEvent("on"+b);else throw Error("Browser doesn't support triggering events");},c:function(b){return a.M(b)?b():b},Ha:function(b){return a.M(b)?b.t():b},ma:function(b,c,f){if(c){var d=/\S+/g,e=b.className.match(d)||[];a.a.n(c.match(d),function(b){a.a.V(e,b,f)});b.className=e.join(" ")}},Ma:function(b,c){var f=a.a.c(c);if(null===f||f===q)f="";var d=a.e.firstChild(b);
!d||3!=d.nodeType||a.e.nextSibling(d)?a.e.S(b,[w.createTextNode(f)]):d.data=f;a.a.Jb(b)},pb:function(a,b){a.name=b;if(7>=h)try{a.mergeAttributes(w.createElement("<input name='"+a.name+"'/>"),!1)}catch(f){}},Jb:function(a){9<=h&&(a=1==a.nodeType?a:a.parentNode,a.style&&(a.style.zoom=a.style.zoom))},Hb:function(a){if(h){var b=a.style.width;a.style.width=0;a.style.width=b}},Zb:function(b,c){b=a.a.c(b);c=a.a.c(c);for(var f=[],d=b;d<=c;d++)f.push(d);return f},Q:function(a){for(var b=[],c=0,d=a.length;c<
d;c++)b.push(a[c]);return b},cc:6===h,dc:7===h,ja:h,ab:function(b,c){for(var f=a.a.Q(b.getElementsByTagName("input")).concat(a.a.Q(b.getElementsByTagName("textarea"))),d="string"==typeof c?function(a){return a.name===c}:function(a){return c.test(a.name)},e=[],g=f.length-1;0<=g;g--)d(f[g])&&e.push(f[g]);return e},Wb:function(b){return"string"==typeof b&&(b=a.a.la(b))?B&&B.parse?B.parse(b):(new Function("return "+b))():null},Na:function(b,c,f){if(!B||!B.stringify)throw Error("Cannot find JSON.stringify(). Some browsers (e.g., IE < 8) don't support it natively, but you can overcome this by adding a script reference to json2.js, downloadable from http://www.json.org/json2.js");
return B.stringify(a.a.c(b),c,f)},Xb:function(c,d,f){f=f||{};var e=f.params||{},g=f.includeFields||this.$a,h=c;if("object"==typeof c&&"form"===a.a.v(c))for(var h=c.action,n=g.length-1;0<=n;n--)for(var r=a.a.ab(c,g[n]),v=r.length-1;0<=v;v--)e[r[v].name]=r[v].value;d=a.a.c(d);var t=w.createElement("form");t.style.display="none";t.action=h;t.method="post";for(var E in d)c=w.createElement("input"),c.name=E,c.value=a.a.Na(a.a.c(d[E])),t.appendChild(c);b(e,function(a,b){var c=w.createElement("input");c.name=
a;c.value=b;t.appendChild(c)});w.body.appendChild(t);f.submitter?f.submitter(t):t.submit();setTimeout(function(){t.parentNode.removeChild(t)},0)}}}();a.b("utils",a.a);a.b("utils.arrayForEach",a.a.n);a.b("utils.arrayFirst",a.a.Ua);a.b("utils.arrayFilter",a.a.ga);a.b("utils.arrayGetDistinctValues",a.a.Va);a.b("utils.arrayIndexOf",a.a.l);a.b("utils.arrayMap",a.a.ha);a.b("utils.arrayPushAll",a.a.X);a.b("utils.arrayRemoveItem",a.a.ia);a.b("utils.extend",a.a.extend);a.b("utils.fieldsIncludedWithJsonPost",
a.a.$a);a.b("utils.getFormFields",a.a.ab);a.b("utils.peekObservable",a.a.Ha);a.b("utils.postJson",a.a.Xb);a.b("utils.parseJson",a.a.Wb);a.b("utils.registerEventHandler",a.a.r);a.b("utils.stringifyJson",a.a.Na);a.b("utils.range",a.a.Zb);a.b("utils.toggleDomNodeCssClass",a.a.ma);a.b("utils.triggerEvent",a.a.da);a.b("utils.unwrapObservable",a.a.c);a.b("utils.objectForEach",a.a.K);a.b("utils.addOrRemoveItem",a.a.V);a.b("unwrap",a.a.c);Function.prototype.bind||(Function.prototype.bind=function(a){var c=
this,d=Array.prototype.slice.call(arguments);a=d.shift();return function(){return c.apply(a,d.concat(Array.prototype.slice.call(arguments)))}});a.a.f=new function(){function a(b,h){var k=b[d];if(!k||"null"===k||!e[k]){if(!h)return q;k=b[d]="ko"+c++;e[k]={}}return e[k]}var c=0,d="__ko__"+(new Date).getTime(),e={};return{get:function(c,d){var e=a(c,!1);return e===q?q:e[d]},set:function(c,d,e){if(e!==q||a(c,!1)!==q)a(c,!0)[d]=e},clear:function(a){var b=a[d];return b?(delete e[b],a[d]=null,!0):!1},D:function(){return c++ +
d}}};a.b("utils.domData",a.a.f);a.b("utils.domData.clear",a.a.f.clear);a.a.C=new function(){function b(b,c){var e=a.a.f.get(b,d);e===q&&c&&(e=[],a.a.f.set(b,d,e));return e}function c(d){var e=b(d,!1);if(e)for(var e=e.slice(0),m=0;m<e.length;m++)e[m](d);a.a.f.clear(d);"function"==typeof u&&"function"==typeof u.cleanData&&u.cleanData([d]);if(g[d.nodeType])for(e=d.firstChild;d=e;)e=d.nextSibling,8===d.nodeType&&c(d)}var d=a.a.f.D(),e={1:!0,8:!0,9:!0},g={1:!0,9:!0};return{ea:function(a,c){if("function"!=
typeof c)throw Error("Callback must be a function");b(a,!0).push(c)},mb:function(c,e){var g=b(c,!1);g&&(a.a.ia(g,e),0==g.length&&a.a.f.set(c,d,q))},L:function(b){if(e[b.nodeType]&&(c(b),g[b.nodeType])){var d=[];a.a.X(d,b.getElementsByTagName("*"));for(var m=0,f=d.length;m<f;m++)c(d[m])}return b},removeNode:function(b){a.L(b);b.parentNode&&b.parentNode.removeChild(b)}}};a.L=a.a.C.L;a.removeNode=a.a.C.removeNode;a.b("cleanNode",a.L);a.b("removeNode",a.removeNode);a.b("utils.domNodeDisposal",a.a.C);
a.b("utils.domNodeDisposal.addDisposeCallback",a.a.C.ea);a.b("utils.domNodeDisposal.removeDisposeCallback",a.a.C.mb);(function(){a.a.Fa=function(b){var c;if("undefined"!=typeof u)if(u.parseHTML)c=u.parseHTML(b)||[];else{if((c=u.clean([b]))&&c[0]){for(b=c[0];b.parentNode&&11!==b.parentNode.nodeType;)b=b.parentNode;b.parentNode&&b.parentNode.removeChild(b)}}else{var d=a.a.la(b).toLowerCase();c=w.createElement("div");d=d.match(/^<(thead|tbody|tfoot)/)&&[1,"<table>","</table>"]||!d.indexOf("<tr")&&[2,
"<table><tbody>","</tbody></table>"]||(!d.indexOf("<td")||!d.indexOf("<th"))&&[3,"<table><tbody><tr>","</tr></tbody></table>"]||[0,"",""];b="ignored<div>"+d[1]+b+d[2]+"</div>";for("function"==typeof y.innerShiv?c.appendChild(y.innerShiv(b)):c.innerHTML=b;d[0]--;)c=c.lastChild;c=a.a.Q(c.lastChild.childNodes)}return c};a.a.Ka=function(b,c){a.a.wa(b);c=a.a.c(c);if(null!==c&&c!==q)if("string"!=typeof c&&(c=c.toString()),"undefined"!=typeof u)u(b).html(c);else for(var d=a.a.Fa(c),e=0;e<d.length;e++)b.appendChild(d[e])}})();
a.b("utils.parseHtmlFragment",a.a.Fa);a.b("utils.setHtml",a.a.Ka);a.u=function(){function b(c,e){if(c)if(8==c.nodeType){var g=a.u.jb(c.nodeValue);null!=g&&e.push({Fb:c,Tb:g})}else if(1==c.nodeType)for(var g=0,h=c.childNodes,k=h.length;g<k;g++)b(h[g],e)}var c={};return{Ca:function(a){if("function"!=typeof a)throw Error("You can only pass a function to ko.memoization.memoize()");var b=(4294967296*(1+Math.random())|0).toString(16).substring(1)+(4294967296*(1+Math.random())|0).toString(16).substring(1);
c[b]=a;return"\x3c!--[ko_memo:"+b+"]--\x3e"},ub:function(a,b){var g=c[a];if(g===q)throw Error("Couldn't find any memo with ID "+a+". Perhaps it's already been unmemoized.");try{return g.apply(null,b||[]),!0}finally{delete c[a]}},vb:function(c,e){var g=[];b(c,g);for(var h=0,k=g.length;h<k;h++){var m=g[h].Fb,f=[m];e&&a.a.X(f,e);a.u.ub(g[h].Tb,f);m.nodeValue="";m.parentNode&&m.parentNode.removeChild(m)}},jb:function(a){return(a=a.match(/^\[ko_memo\:(.*?)\]$/))?a[1]:null}}}();a.b("memoization",a.u);a.b("memoization.memoize",
a.u.Ca);a.b("memoization.unmemoize",a.u.ub);a.b("memoization.parseMemoText",a.u.jb);a.b("memoization.unmemoizeDomNodeAndDescendants",a.u.vb);a.xa={throttle:function(b,c){b.throttleEvaluation=c;var d=null;return a.h({read:b,write:function(a){clearTimeout(d);d=setTimeout(function(){b(a)},c)}})},notify:function(a,c){a.equalityComparer="always"==c?null:G}};var N={undefined:1,"boolean":1,number:1,string:1};a.b("extenders",a.xa);a.sb=function(b,c,d){this.target=b;this.qa=c;this.Eb=d;a.s(this,"dispose",
this.B)};a.sb.prototype.B=function(){this.Qb=!0;this.Eb()};a.ca=function(){this.F={};a.a.extend(this,a.ca.fn);a.s(this,"subscribe",this.T);a.s(this,"extend",this.extend);a.s(this,"getSubscriptionsCount",this.Lb)};var I="change";a.ca.fn={T:function(b,c,d){d=d||I;var e=new a.sb(this,c?b.bind(c):b,function(){a.a.ia(this.F[d],e)}.bind(this));this.F[d]||(this.F[d]=[]);this.F[d].push(e);return e},notifySubscribers:function(b,c){c=c||I;if(this.cb(c))try{a.i.Wa();for(var d=this.F[c].slice(0),e=0,g;g=d[e];++e)g&&
!0!==g.Qb&&g.qa(b)}finally{a.i.end()}},cb:function(a){return this.F[a]&&this.F[a].length},Lb:function(){var b=0;a.a.K(this.F,function(a,d){b+=d.length});return b},extend:function(b){var c=this;b&&a.a.K(b,function(b,e){var g=a.xa[b];"function"==typeof g&&(c=g(c,e)||c)});return c}};a.fb=function(a){return null!=a&&"function"==typeof a.T&&"function"==typeof a.notifySubscribers};a.b("subscribable",a.ca);a.b("isSubscribable",a.fb);a.i=function(){var b=[];return{Wa:function(a){b.push(a&&{qa:a,Za:[]})},
end:function(){b.pop()},lb:function(c){if(!a.fb(c))throw Error("Only subscribable things can act as dependencies");if(0<b.length){var d=b[b.length-1];!d||0<=a.a.l(d.Za,c)||(d.Za.push(c),d.qa(c))}},p:function(a,d,e){try{return b.push(null),a.apply(d,e||[])}finally{b.pop()}}}}();a.q=function(b){function c(){if(0<arguments.length)return c.equalityComparer&&c.equalityComparer(d,arguments[0])||(c.O(),d=arguments[0],c.N()),this;a.i.lb(c);return d}var d=b;a.ca.call(c);c.t=function(){return d};c.N=function(){c.notifySubscribers(d)};
c.O=function(){c.notifySubscribers(d,"beforeChange")};a.a.extend(c,a.q.fn);a.s(c,"peek",c.t);a.s(c,"valueHasMutated",c.N);a.s(c,"valueWillMutate",c.O);return c};a.q.fn={equalityComparer:G};var C=a.q.Yb="__ko_proto__";a.q.fn[C]=a.q;a.ya=function(b,c){return null===b||b===q||b[C]===q?!1:b[C]===c?!0:a.ya(b[C],c)};a.M=function(b){return a.ya(b,a.q)};a.gb=function(b){return"function"==typeof b&&b[C]===a.q||"function"==typeof b&&b[C]===a.h&&b.Nb?!0:!1};a.b("observable",a.q);a.b("isObservable",a.M);a.b("isWriteableObservable",
a.gb);a.ba=function(b){b=b||[];if("object"!=typeof b||!("length"in b))throw Error("The argument passed when initializing an observable array must be an array, or null, or undefined.");b=a.q(b);a.a.extend(b,a.ba.fn);return b.extend({trackArrayChanges:!0})};a.ba.fn={remove:function(b){for(var c=this.t(),d=[],e="function"!=typeof b||a.M(b)?function(a){return a===b}:b,g=0;g<c.length;g++){var h=c[g];e(h)&&(0===d.length&&this.O(),d.push(h),c.splice(g,1),g--)}d.length&&this.N();return d},removeAll:function(b){if(b===
q){var c=this.t(),d=c.slice(0);this.O();c.splice(0,c.length);this.N();return d}return b?this.remove(function(c){return 0<=a.a.l(b,c)}):[]},destroy:function(b){var c=this.t(),d="function"!=typeof b||a.M(b)?function(a){return a===b}:b;this.O();for(var e=c.length-1;0<=e;e--)d(c[e])&&(c[e]._destroy=!0);this.N()},destroyAll:function(b){return b===q?this.destroy(function(){return!0}):b?this.destroy(function(c){return 0<=a.a.l(b,c)}):[]},indexOf:function(b){var c=this();return a.a.l(c,b)},replace:function(a,
c){var d=this.indexOf(a);0<=d&&(this.O(),this.t()[d]=c,this.N())}};a.a.n("pop push reverse shift sort splice unshift".split(" "),function(b){a.ba.fn[b]=function(){var a=this.t();this.O();this.Xa(a,b,arguments);a=a[b].apply(a,arguments);this.N();return a}});a.a.n(["slice"],function(b){a.ba.fn[b]=function(){var a=this();return a[b].apply(a,arguments)}});a.b("observableArray",a.ba);var J="arrayChange";a.xa.trackArrayChanges=function(b){function c(){if(!d){d=!0;var c=b.notifySubscribers;b.notifySubscribers=
function(a,b){b&&b!==I||++g;return c.apply(this,arguments)};var m=[].concat(b.t()||[]);e=null;b.T(function(c){c=[].concat(c||[]);if(b.cb(J)){var d;if(!e||1<g)e=a.a.ra(m,c,{sparse:!0});d=e;d.length&&b.notifySubscribers(d,J)}m=c;e=null;g=0})}}if(!b.Xa){var d=!1,e=null,g=0,h=b.T;b.T=b.subscribe=function(a,b,f){f===J&&c();return h.apply(this,arguments)};b.Xa=function(a,b,c){function p(a,b,c){h.push({status:a,value:b,index:c})}if(d&&!g){var h=[],l=a.length,n=c.length,r=0;switch(b){case "push":r=l;case "unshift":for(b=
0;b<n;b++)p("added",c[b],r+b);break;case "pop":r=l-1;case "shift":l&&p("deleted",a[r],r);break;case "splice":b=Math.min(Math.max(0,0>c[0]?l+c[0]:c[0]),l);for(var l=1===n?l:Math.min(b+(c[1]||0),l),n=b+n-2,r=Math.max(l,n),v=2;b<r;++b,++v)b<l&&p("deleted",a[b],b),b<n&&p("added",c[v],b);break;default:return}e=h}}}};a.h=function(b,c,d){function e(){a.a.n(z,function(a){a.B()});z=[]}function g(){var a=k.throttleEvaluation;a&&0<=a?(clearTimeout(x),x=setTimeout(h,a)):h()}function h(){if(!s){if(E&&E()){if(!l){D();
p=!0;return}}else l=!1;s=!0;try{var b=a.a.ha(z,function(a){return a.target});a.i.Wa(function(c){var d;0<=(d=a.a.l(b,c))?b[d]=q:z.push(c.T(g))});for(var d=c?n.call(c):n(),e=b.length-1;0<=e;e--)b[e]&&z.splice(e,1)[0].B();p=!0;k.equalityComparer&&k.equalityComparer(f,d)||(k.notifySubscribers(f,"beforeChange"),f=d,k.notifySubscribers(f))}finally{a.i.end(),s=!1}z.length||D()}}function k(){if(0<arguments.length){if("function"===typeof r)r.apply(c,arguments);else throw Error("Cannot write a value to a ko.computed unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.");
return this}p||h();a.i.lb(k);return f}function m(){return!p||0<z.length}var f,p=!1,s=!1,l=!1,n=b;n&&"object"==typeof n?(d=n,n=d.read):(d=d||{},n||(n=d.read));if("function"!=typeof n)throw Error("Pass a function that returns the value of the ko.computed");var r=d.write,v=d.disposeWhenNodeIsRemoved||d.I||null,t=d.disposeWhen||d.ua,E=t,D=e,z=[],x=null;c||(c=d.owner);k.t=function(){p||h();return f};k.Kb=function(){return z.length};k.Nb="function"===typeof d.write;k.B=function(){D()};k.aa=m;a.ca.call(k);
a.a.extend(k,a.h.fn);a.s(k,"peek",k.t);a.s(k,"dispose",k.B);a.s(k,"isActive",k.aa);a.s(k,"getDependenciesCount",k.Kb);v&&(l=!0,v.nodeType&&(E=function(){return!a.a.va(v)||t&&t()}));!0!==d.deferEvaluation&&h();v&&m()&&(D=function(){a.a.C.mb(v,D);e()},a.a.C.ea(v,D));return k};a.Pb=function(b){return a.ya(b,a.h)};F=a.q.Yb;a.h[F]=a.q;a.h.fn={equalityComparer:G};a.h.fn[F]=a.h;a.b("dependentObservable",a.h);a.b("computed",a.h);a.b("isComputed",a.Pb);(function(){function b(a,g,h){h=h||new d;a=g(a);if("object"!=
typeof a||null===a||a===q||a instanceof Date||a instanceof String||a instanceof Number||a instanceof Boolean)return a;var k=a instanceof Array?[]:{};h.save(a,k);c(a,function(c){var d=g(a[c]);switch(typeof d){case "boolean":case "number":case "string":case "function":k[c]=d;break;case "object":case "undefined":var p=h.get(d);k[c]=p!==q?p:b(d,g,h)}});return k}function c(a,b){if(a instanceof Array){for(var c=0;c<a.length;c++)b(c);"function"==typeof a.toJSON&&b("toJSON")}else for(c in a)b(c)}function d(){this.keys=
[];this.Qa=[]}a.tb=function(c){if(0==arguments.length)throw Error("When calling ko.toJS, pass the object you want to convert.");return b(c,function(b){for(var c=0;a.M(b)&&10>c;c++)b=b();return b})};a.toJSON=function(b,c,d){b=a.tb(b);return a.a.Na(b,c,d)};d.prototype={save:function(b,c){var d=a.a.l(this.keys,b);0<=d?this.Qa[d]=c:(this.keys.push(b),this.Qa.push(c))},get:function(b){b=a.a.l(this.keys,b);return 0<=b?this.Qa[b]:q}}})();a.b("toJS",a.tb);a.b("toJSON",a.toJSON);(function(){a.k={o:function(b){switch(a.a.v(b)){case "option":return!0===
b.__ko__hasDomDataOptionValue__?a.a.f.get(b,a.d.options.Ea):7>=a.a.ja?b.getAttributeNode("value")&&b.getAttributeNode("value").specified?b.value:b.text:b.value;case "select":return 0<=b.selectedIndex?a.k.o(b.options[b.selectedIndex]):q;default:return b.value}},na:function(b,c){switch(a.a.v(b)){case "option":switch(typeof c){case "string":a.a.f.set(b,a.d.options.Ea,q);"__ko__hasDomDataOptionValue__"in b&&delete b.__ko__hasDomDataOptionValue__;b.value=c;break;default:a.a.f.set(b,a.d.options.Ea,c),b.__ko__hasDomDataOptionValue__=
!0,b.value="number"===typeof c?c:""}break;case "select":""===c&&(c=q);if(null===c||c===q)b.selectedIndex=-1;for(var d=b.options.length-1;0<=d;d--)if(a.k.o(b.options[d])==c){b.selectedIndex=d;break}1<b.size||-1!==b.selectedIndex||(b.selectedIndex=0);break;default:if(null===c||c===q)c="";b.value=c}}}})();a.b("selectExtensions",a.k);a.b("selectExtensions.readValue",a.k.o);a.b("selectExtensions.writeValue",a.k.na);a.g=function(){function b(b){b=a.a.la(b);123===b.charCodeAt(0)&&(b=b.slice(1,-1));var c=
[],d=b.match(e),k,l,n=0;if(d){d.push(",");for(var r=0,v;v=d[r];++r){var t=v.charCodeAt(0);if(44===t){if(0>=n){k&&c.push(l?{key:k,value:l.join("")}:{unknown:k});k=l=n=0;continue}}else if(58===t){if(!l)continue}else if(47===t&&r&&1<v.length)(t=d[r-1].match(g))&&!h[t[0]]&&(b=b.substr(b.indexOf(v)+1),d=b.match(e),d.push(","),r=-1,v="/");else if(40===t||123===t||91===t)++n;else if(41===t||125===t||93===t)--n;else if(!k&&!l){k=34===t||39===t?v.slice(1,-1):v;continue}l?l.push(v):l=[v]}}return c}var c=["true",
"false","null","undefined"],d=/^(?:[$_a-z][$\w]*|(.+)(\.\s*[$_a-z][$\w]*|\[.+\]))$/i,e=RegExp("\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*'|/(?:[^/\\\\]|\\\\.)*/w*|[^\\s:,/][^,\"'{}()/:[\\]]*[^\\s,\"'{}()/:[\\]]|[^\\s]","g"),g=/[\])"'A-Za-z0-9_$]+$/,h={"in":1,"return":1,"typeof":1},k={};return{Y:[],U:k,Ga:b,ka:function(e,f){function g(b,f){var e,r=a.getBindingHandler(b);if(r&&r.preprocess?f=r.preprocess(f,b,g):1){if(r=k[b])e=f,0<=a.a.l(c,e)?e=!1:(r=e.match(d),e=null===r?!1:r[1]?"Object("+r[1]+")"+
r[2]:e),r=e;r&&l.push("'"+b+"':function(_z){"+e+"=_z}");n&&(f="function(){return "+f+" }");h.push("'"+b+"':"+f)}}f=f||{};var h=[],l=[],n=f.valueAccessors,r="string"===typeof e?b(e):e;a.a.n(r,function(a){g(a.key||a.unknown,a.value)});l.length&&g("_ko_property_writers","{"+l.join(",")+"}");return h.join(",")},Sb:function(a,b){for(var c=0;c<a.length;c++)if(a[c].key==b)return!0;return!1},oa:function(b,c,d,e,k){if(b&&a.M(b))!a.gb(b)||k&&b.t()===e||b(e);else if((b=c.get("_ko_property_writers"))&&b[d])b[d](e)}}}();
a.b("expressionRewriting",a.g);a.b("expressionRewriting.bindingRewriteValidators",a.g.Y);a.b("expressionRewriting.parseObjectLiteral",a.g.Ga);a.b("expressionRewriting.preProcessBindings",a.g.ka);a.b("expressionRewriting._twoWayBindings",a.g.U);a.b("jsonExpressionRewriting",a.g);a.b("jsonExpressionRewriting.insertPropertyAccessorsIntoJson",a.g.ka);(function(){function b(a){return 8==a.nodeType&&h.test(g?a.text:a.nodeValue)}function c(a){return 8==a.nodeType&&k.test(g?a.text:a.nodeValue)}function d(a,
d){for(var e=a,k=1,n=[];e=e.nextSibling;){if(c(e)&&(k--,0===k))return n;n.push(e);b(e)&&k++}if(!d)throw Error("Cannot find closing comment tag to match: "+a.nodeValue);return null}function e(a,b){var c=d(a,b);return c?0<c.length?c[c.length-1].nextSibling:a.nextSibling:null}var g=w&&"\x3c!--test--\x3e"===w.createComment("test").text,h=g?/^\x3c!--\s*ko(?:\s+([\s\S]+))?\s*--\x3e$/:/^\s*ko(?:\s+([\s\S]+))?\s*$/,k=g?/^\x3c!--\s*\/ko\s*--\x3e$/:/^\s*\/ko\s*$/,m={ul:!0,ol:!0};a.e={P:{},childNodes:function(a){return b(a)?
d(a):a.childNodes},Z:function(c){if(b(c)){c=a.e.childNodes(c);for(var d=0,e=c.length;d<e;d++)a.removeNode(c[d])}else a.a.wa(c)},S:function(c,d){if(b(c)){a.e.Z(c);for(var e=c.nextSibling,k=0,n=d.length;k<n;k++)e.parentNode.insertBefore(d[k],e)}else a.a.S(c,d)},kb:function(a,c){b(a)?a.parentNode.insertBefore(c,a.nextSibling):a.firstChild?a.insertBefore(c,a.firstChild):a.appendChild(c)},eb:function(c,d,e){e?b(c)?c.parentNode.insertBefore(d,e.nextSibling):e.nextSibling?c.insertBefore(d,e.nextSibling):
c.appendChild(d):a.e.kb(c,d)},firstChild:function(a){return b(a)?!a.nextSibling||c(a.nextSibling)?null:a.nextSibling:a.firstChild},nextSibling:function(a){b(a)&&(a=e(a));return a.nextSibling&&c(a.nextSibling)?null:a.nextSibling},Mb:b,bc:function(a){return(a=(g?a.text:a.nodeValue).match(h))?a[1]:null},ib:function(d){if(m[a.a.v(d)]){var k=d.firstChild;if(k){do if(1===k.nodeType){var g;g=k.firstChild;var h=null;if(g){do if(h)h.push(g);else if(b(g)){var n=e(g,!0);n?g=n:h=[g]}else c(g)&&(h=[g]);while(g=
g.nextSibling)}if(g=h)for(h=k.nextSibling,n=0;n<g.length;n++)h?d.insertBefore(g[n],h):d.appendChild(g[n])}while(k=k.nextSibling)}}}}})();a.b("virtualElements",a.e);a.b("virtualElements.allowedBindings",a.e.P);a.b("virtualElements.emptyNode",a.e.Z);a.b("virtualElements.insertAfter",a.e.eb);a.b("virtualElements.prepend",a.e.kb);a.b("virtualElements.setDomNodeChildren",a.e.S);(function(){a.H=function(){this.zb={}};a.a.extend(a.H.prototype,{nodeHasBindings:function(b){switch(b.nodeType){case 1:return null!=
b.getAttribute("data-bind");case 8:return a.e.Mb(b);default:return!1}},getBindings:function(a,c){var d=this.getBindingsString(a,c);return d?this.parseBindingsString(d,c,a):null},getBindingAccessors:function(a,c){var d=this.getBindingsString(a,c);return d?this.parseBindingsString(d,c,a,{valueAccessors:!0}):null},getBindingsString:function(b){switch(b.nodeType){case 1:return b.getAttribute("data-bind");case 8:return a.e.bc(b);default:return null}},parseBindingsString:function(b,c,d,e){try{var g=this.zb,
h=b+(e&&e.valueAccessors||""),k;if(!(k=g[h])){var m,f="with($context){with($data||{}){return{"+a.g.ka(b,e)+"}}}";m=new Function("$context","$element",f);k=g[h]=m}return k(c,d)}catch(p){throw p.message="Unable to parse bindings.\nBindings value: "+b+"\nMessage: "+p.message,p;}}});a.H.instance=new a.H})();a.b("bindingProvider",a.H);(function(){function b(a){return function(){return a}}function c(a){return a()}function d(b){return a.a.Da(a.i.p(b),function(a,c){return function(){return b()[c]}})}function e(a,
b){return d(this.getBindings.bind(this,a,b))}function g(b,c,d){var f,e=a.e.firstChild(c),k=a.H.instance,g=k.preprocessNode;if(g){for(;f=e;)e=a.e.nextSibling(f),g.call(k,f);e=a.e.firstChild(c)}for(;f=e;)e=a.e.nextSibling(f),h(b,f,d)}function h(b,c,d){var f=!0,e=1===c.nodeType;e&&a.e.ib(c);if(e&&d||a.H.instance.nodeHasBindings(c))f=m(c,null,b,d).shouldBindDescendants;f&&!p[a.a.v(c)]&&g(b,c,!e)}function k(b){var c=[],d={},f=[];a.a.K(b,function D(e){if(!d[e]){var k=a.getBindingHandler(e);k&&(k.after&&
(f.push(e),a.a.n(k.after,function(c){if(b[c]){if(-1!==a.a.l(f,c))throw Error("Cannot combine the following bindings, because they have a cyclic dependency: "+f.join(", "));D(c)}}),f.pop()),c.push({key:e,bb:k}));d[e]=!0}});return c}function m(b,d,f,g){var h=a.a.f.get(b,s);if(!d){if(h)throw Error("You cannot apply bindings multiple times to the same element.");a.a.f.set(b,s,!0)}!h&&g&&a.rb(b,f);var m;if(d&&"function"!==typeof d)m=d;else{var p=a.H.instance,l=p.getBindingAccessors||e;if(d||f.A){var A=
a.h(function(){(m=d?d(f,b):l.call(p,b,f))&&f.A&&f.A();return m},null,{I:b});m&&A.aa()||(A=null)}else m=a.i.p(l,p,[b,f])}var u;if(m){var w=A?function(a){return function(){return c(A()[a])}}:function(a){return m[a]},y=function(){return a.a.Da(A?A():m,c)};y.get=function(a){return m[a]&&c(w(a))};y.has=function(a){return a in m};g=k(m);a.a.n(g,function(c){var d=c.bb.init,e=c.bb.update,k=c.key;if(8===b.nodeType&&!a.e.P[k])throw Error("The binding '"+k+"' cannot be used with virtual elements");try{"function"==
typeof d&&a.i.p(function(){var a=d(b,w(k),y,f.$data,f);if(a&&a.controlsDescendantBindings){if(u!==q)throw Error("Multiple bindings ("+u+" and "+k+") are trying to control descendant bindings of the same element. You cannot use these bindings together on the same element.");u=k}}),"function"==typeof e&&a.h(function(){e(b,w(k),y,f.$data,f)},null,{I:b})}catch(g){throw g.message='Unable to process binding "'+k+": "+m[k]+'"\nMessage: '+g.message,g;}})}return{shouldBindDescendants:u===q}}function f(b){return b&&
b instanceof a.G?b:new a.G(b)}a.d={};var p={script:!0};a.getBindingHandler=function(b){return a.d[b]};a.G=function(b,c,d,f){var e=this,k="function"==typeof b,g,h=a.h(function(){var g=k?b():b;c?(c.A&&c.A(),a.a.extend(e,c),h&&(e.A=h)):(e.$parents=[],e.$root=g,e.ko=a);e.$rawData=b;e.$data=g;d&&(e[d]=g);f&&f(e,c,g);return e.$data},null,{ua:function(){return g&&!a.a.Ra(g)},I:!0});h.aa()&&(e.A=h,h.equalityComparer=null,g=[],h.wb=function(b){g.push(b);a.a.C.ea(b,function(b){a.a.ia(g,b);g.length||(h.B(),
e.A=h=q)})})};a.G.prototype.createChildContext=function(b,c,d){return new a.G(b,this,c,function(a,b){a.$parentContext=b;a.$parent=b.$data;a.$parents=(b.$parents||[]).slice(0);a.$parents.unshift(a.$parent);d&&d(a)})};a.G.prototype.extend=function(b){return new a.G(this.$rawData,this,null,function(c){a.a.extend(c,"function"==typeof b?b():b)})};var s=a.a.f.D(),l=a.a.f.D();a.rb=function(b,c){if(2==arguments.length)a.a.f.set(b,l,c),c.A&&c.A.wb(b);else return a.a.f.get(b,l)};a.pa=function(b,c,d){1===b.nodeType&&
a.e.ib(b);return m(b,c,f(d),!0)};a.xb=function(c,e,k){k=f(k);return a.pa(c,"function"===typeof e?d(e.bind(null,k,c)):a.a.Da(e,b),k)};a.Ta=function(a,b){1!==b.nodeType&&8!==b.nodeType||g(f(a),b,!0)};a.Sa=function(a,b){if(b&&1!==b.nodeType&&8!==b.nodeType)throw Error("ko.applyBindings: first parameter should be your view model; second parameter should be a DOM node");b=b||y.document.body;h(f(a),b,!0)};a.ta=function(b){switch(b.nodeType){case 1:case 8:var c=a.rb(b);if(c)return c;if(b.parentNode)return a.ta(b.parentNode)}return q};
a.Cb=function(b){return(b=a.ta(b))?b.$data:q};a.b("bindingHandlers",a.d);a.b("applyBindings",a.Sa);a.b("applyBindingsToDescendants",a.Ta);a.b("applyBindingAccessorsToNode",a.pa);a.b("applyBindingsToNode",a.xb);a.b("contextFor",a.ta);a.b("dataFor",a.Cb)})();var M={"class":"className","for":"htmlFor"};a.d.attr={update:function(b,c){var d=a.a.c(c())||{};a.a.K(d,function(c,d){d=a.a.c(d);var h=!1===d||null===d||d===q;h&&b.removeAttribute(c);8>=a.a.ja&&c in M?(c=M[c],h?b.removeAttribute(c):b[c]=d):h||b.setAttribute(c,
d.toString());"name"===c&&a.a.pb(b,h?"":d.toString())})}};(function(){a.d.checked={after:["value","attr"],init:function(b,c,d){function e(){return d.has("checkedValue")?a.a.c(d.get("checkedValue")):b.value}function g(){var k=b.checked,g=s?e():k;if(l&&(!m||k)){var h=a.i.p(c);f?p!==g?(k&&(a.a.V(h,g,!0),a.a.V(h,p,!1)),p=g):a.a.V(h,g,k):a.g.oa(h,d,"checked",g,!0)}}function h(){var d=a.a.c(c());b.checked=f?0<=a.a.l(d,e()):k?d:e()===d}var k="checkbox"==b.type,m="radio"==b.type;if(k||m){var f=k&&a.a.c(c())instanceof
Array,p=f?e():q,s=m||f,l=!1;m&&!b.name&&a.d.uniqueName.init(b,function(){return!0});a.h(g,null,{I:b});a.a.r(b,"click",g);a.h(h,null,{I:b});l=!0}}};a.g.U.checked=!0;a.d.checkedValue={update:function(b,c){b.value=a.a.c(c())}}})();a.d.css={update:function(b,c){var d=a.a.c(c());"object"==typeof d?a.a.K(d,function(c,d){d=a.a.c(d);a.a.ma(b,c,d)}):(d=String(d||""),a.a.ma(b,b.__ko__cssValue,!1),b.__ko__cssValue=d,a.a.ma(b,d,!0))}};a.d.enable={update:function(b,c){var d=a.a.c(c());d&&b.disabled?b.removeAttribute("disabled"):
d||b.disabled||(b.disabled=!0)}};a.d.disable={update:function(b,c){a.d.enable.update(b,function(){return!a.a.c(c())})}};a.d.event={init:function(b,c,d,e,g){var h=c()||{};a.a.K(h,function(k){"string"==typeof k&&a.a.r(b,k,function(b){var f,h=c()[k];if(h){try{var s=a.a.Q(arguments);e=g.$data;s.unshift(e);f=h.apply(e,s)}finally{!0!==f&&(b.preventDefault?b.preventDefault():b.returnValue=!1)}!1===d.get(k+"Bubble")&&(b.cancelBubble=!0,b.stopPropagation&&b.stopPropagation())}})})}};a.d.foreach={hb:function(b){return function(){var c=
b(),d=a.a.Ha(c);if(!d||"number"==typeof d.length)return{foreach:c,templateEngine:a.J.Aa};a.a.c(c);return{foreach:d.data,as:d.as,includeDestroyed:d.includeDestroyed,afterAdd:d.afterAdd,beforeRemove:d.beforeRemove,afterRender:d.afterRender,beforeMove:d.beforeMove,afterMove:d.afterMove,templateEngine:a.J.Aa}}},init:function(b,c){return a.d.template.init(b,a.d.foreach.hb(c))},update:function(b,c,d,e,g){return a.d.template.update(b,a.d.foreach.hb(c),d,e,g)}};a.g.Y.foreach=!1;a.e.P.foreach=!0;a.d.hasfocus=
{init:function(b,c,d){function e(e){b.__ko_hasfocusUpdating=!0;var g=b.ownerDocument;if("activeElement"in g){var f;try{f=g.activeElement}catch(h){f=g.body}e=f===b}g=c();a.g.oa(g,d,"hasfocus",e,!0);b.__ko_hasfocusLastValue=e;b.__ko_hasfocusUpdating=!1}var g=e.bind(null,!0),h=e.bind(null,!1);a.a.r(b,"focus",g);a.a.r(b,"focusin",g);a.a.r(b,"blur",h);a.a.r(b,"focusout",h)},update:function(b,c){var d=!!a.a.c(c());b.__ko_hasfocusUpdating||b.__ko_hasfocusLastValue===d||(d?b.focus():b.blur(),a.i.p(a.a.da,
null,[b,d?"focusin":"focusout"]))}};a.g.U.hasfocus=!0;a.d.hasFocus=a.d.hasfocus;a.g.U.hasFocus=!0;a.d.html={init:function(){return{controlsDescendantBindings:!0}},update:function(b,c){a.a.Ka(b,c())}};var L=a.a.f.D();H("if");H("ifnot",!1,!0);H("with",!0,!1,function(a,c){return a.createChildContext(c)});a.d.options={init:function(b){if("select"!==a.a.v(b))throw Error("options binding applies only to SELECT elements");for(;0<b.length;)b.remove(0);return{controlsDescendantBindings:!0}},update:function(b,
c,d){function e(){return a.a.ga(b.options,function(a){return a.selected})}function g(a,b,c){var d=typeof b;return"function"==d?b(a):"string"==d?a[b]:c}function h(c,d){if(p.length){var f=0<=a.a.l(p,a.k.o(d[0]));a.a.qb(d[0],f);l&&!f&&a.i.p(a.a.da,null,[b,"change"])}}var k=0!=b.length&&b.multiple?b.scrollTop:null;c=a.a.c(c());var m=d.get("optionsIncludeDestroyed"),f={},p;p=b.multiple?a.a.ha(e(),a.k.o):0<=b.selectedIndex?[a.k.o(b.options[b.selectedIndex])]:[];if(c){"undefined"==typeof c.length&&(c=[c]);
var s=a.a.ga(c,function(b){return m||b===q||null===b||!a.a.c(b._destroy)});d.has("optionsCaption")&&(c=a.a.c(d.get("optionsCaption")),null!==c&&c!==q&&s.unshift(f))}else c=[];var l=!1;c=h;d.has("optionsAfterRender")&&(c=function(b,c){h(0,c);a.i.p(d.get("optionsAfterRender"),null,[c[0],b!==f?b:q])});a.a.Ja(b,s,function(b,c,e){e.length&&(p=e[0].selected?[a.k.o(e[0])]:[],l=!0);c=w.createElement("option");b===f?(a.a.Ma(c,d.get("optionsCaption")),a.k.na(c,q)):(e=g(b,d.get("optionsValue"),b),a.k.na(c,a.a.c(e)),
b=g(b,d.get("optionsText"),e),a.a.Ma(c,b));return[c]},null,c);(b.multiple?p.length&&e().length<p.length:p.length&&0<=b.selectedIndex?a.k.o(b.options[b.selectedIndex])!==p[0]:p.length||0<=b.selectedIndex)&&a.i.p(a.a.da,null,[b,"change"]);a.a.Hb(b);k&&20<Math.abs(k-b.scrollTop)&&(b.scrollTop=k)}};a.d.options.Ea=a.a.f.D();a.d.selectedOptions={after:["options","foreach"],init:function(b,c,d){a.a.r(b,"change",function(){var e=c(),g=[];a.a.n(b.getElementsByTagName("option"),function(b){b.selected&&g.push(a.k.o(b))});
a.g.oa(e,d,"selectedOptions",g)})},update:function(b,c){if("select"!=a.a.v(b))throw Error("values binding applies only to SELECT elements");var d=a.a.c(c());d&&"number"==typeof d.length&&a.a.n(b.getElementsByTagName("option"),function(b){var c=0<=a.a.l(d,a.k.o(b));a.a.qb(b,c)})}};a.g.U.selectedOptions=!0;a.d.style={update:function(b,c){var d=a.a.c(c()||{});a.a.K(d,function(c,d){d=a.a.c(d);b.style[c]=d||""})}};a.d.submit={init:function(b,c,d,e,g){if("function"!=typeof c())throw Error("The value for a submit binding must be a function");
a.a.r(b,"submit",function(a){var d,e=c();try{d=e.call(g.$data,b)}finally{!0!==d&&(a.preventDefault?a.preventDefault():a.returnValue=!1)}})}};a.d.text={init:function(){return{controlsDescendantBindings:!0}},update:function(b,c){a.a.Ma(b,c())}};a.e.P.text=!0;a.d.uniqueName={init:function(b,c){if(c()){var d="ko_unique_"+ ++a.d.uniqueName.Bb;a.a.pb(b,d)}}};a.d.uniqueName.Bb=0;a.d.value={after:["options","foreach"],init:function(b,c,d){function e(){k=!1;var e=c(),f=a.k.o(b);a.g.oa(e,d,"value",f)}var g=
["change"],h=d.get("valueUpdate"),k=!1;h&&("string"==typeof h&&(h=[h]),a.a.X(g,h),g=a.a.Va(g));!a.a.ja||"input"!=b.tagName.toLowerCase()||"text"!=b.type||"off"==b.autocomplete||b.form&&"off"==b.form.autocomplete||-1!=a.a.l(g,"propertychange")||(a.a.r(b,"propertychange",function(){k=!0}),a.a.r(b,"blur",function(){k&&e()}));a.a.n(g,function(c){var d=e;a.a.ac(c,"after")&&(d=function(){setTimeout(e,0)},c=c.substring(5));a.a.r(b,c,d)})},update:function(b,c){var d="select"===a.a.v(b),e=a.a.c(c()),g=a.k.o(b);
e!==g&&(g=function(){a.k.na(b,e)},g(),d&&(e!==a.k.o(b)?a.i.p(a.a.da,null,[b,"change"]):setTimeout(g,0)))}};a.g.U.value=!0;a.d.visible={update:function(b,c){var d=a.a.c(c()),e="none"!=b.style.display;d&&!e?b.style.display="":!d&&e&&(b.style.display="none")}};(function(b){a.d[b]={init:function(c,d,e,g,h){return a.d.event.init.call(this,c,function(){var a={};a[b]=d();return a},e,g,h)}}})("click");a.w=function(){};a.w.prototype.renderTemplateSource=function(){throw Error("Override renderTemplateSource");
};a.w.prototype.createJavaScriptEvaluatorBlock=function(){throw Error("Override createJavaScriptEvaluatorBlock");};a.w.prototype.makeTemplateSource=function(b,c){if("string"==typeof b){c=c||w;var d=c.getElementById(b);if(!d)throw Error("Cannot find template with ID "+b);return new a.m.j(d)}if(1==b.nodeType||8==b.nodeType)return new a.m.W(b);throw Error("Unknown template type: "+b);};a.w.prototype.renderTemplate=function(a,c,d,e){a=this.makeTemplateSource(a,e);return this.renderTemplateSource(a,c,
d)};a.w.prototype.isTemplateRewritten=function(a,c){return!1===this.allowTemplateRewriting?!0:this.makeTemplateSource(a,c).data("isRewritten")};a.w.prototype.rewriteTemplate=function(a,c,d){a=this.makeTemplateSource(a,d);c=c(a.text());a.text(c);a.data("isRewritten",!0)};a.b("templateEngine",a.w);a.Oa=function(){function b(b,c,d,k){b=a.g.Ga(b);for(var m=a.g.Y,f=0;f<b.length;f++){var p=b[f].key;if(m.hasOwnProperty(p)){var s=m[p];if("function"===typeof s){if(p=s(b[f].value))throw Error(p);}else if(!s)throw Error("This template engine does not support the '"+
p+"' binding within its templates");}}d="ko.__tr_ambtns(function($context,$element){return(function(){return{ "+a.g.ka(b,{valueAccessors:!0})+" } })()},'"+d.toLowerCase()+"')";return k.createJavaScriptEvaluatorBlock(d)+c}var c=/(<([a-z]+\d*)(?:\s+(?!data-bind\s*=\s*)[a-z0-9\-]+(?:=(?:\"[^\"]*\"|\'[^\']*\'))?)*\s+)data-bind\s*=\s*(["'])([\s\S]*?)\3/gi,d=/\x3c!--\s*ko\b\s*([\s\S]*?)\s*--\x3e/g;return{Ib:function(b,c,d){c.isTemplateRewritten(b,d)||c.rewriteTemplate(b,function(b){return a.Oa.Ub(b,c)},
d)},Ub:function(a,g){return a.replace(c,function(a,c,d,f,e){return b(e,c,d,g)}).replace(d,function(a,c){return b(c,"\x3c!-- ko --\x3e","#comment",g)})},yb:function(b,c){return a.u.Ca(function(d,k){var m=d.nextSibling;m&&m.nodeName.toLowerCase()===c&&a.pa(m,b,k)})}}}();a.b("__tr_ambtns",a.Oa.yb);(function(){a.m={};a.m.j=function(a){this.j=a};a.m.j.prototype.text=function(){var b=a.a.v(this.j),b="script"===b?"text":"textarea"===b?"value":"innerHTML";if(0==arguments.length)return this.j[b];var c=arguments[0];
"innerHTML"===b?a.a.Ka(this.j,c):this.j[b]=c};var b=a.a.f.D()+"_";a.m.j.prototype.data=function(c){if(1===arguments.length)return a.a.f.get(this.j,b+c);a.a.f.set(this.j,b+c,arguments[1])};var c=a.a.f.D();a.m.W=function(a){this.j=a};a.m.W.prototype=new a.m.j;a.m.W.prototype.text=function(){if(0==arguments.length){var b=a.a.f.get(this.j,c)||{};b.Pa===q&&b.sa&&(b.Pa=b.sa.innerHTML);return b.Pa}a.a.f.set(this.j,c,{Pa:arguments[0]})};a.m.j.prototype.nodes=function(){if(0==arguments.length)return(a.a.f.get(this.j,
c)||{}).sa;a.a.f.set(this.j,c,{sa:arguments[0]})};a.b("templateSources",a.m);a.b("templateSources.domElement",a.m.j);a.b("templateSources.anonymousTemplate",a.m.W)})();(function(){function b(b,c,d){var e;for(c=a.e.nextSibling(c);b&&(e=b)!==c;)b=a.e.nextSibling(e),d(e,b)}function c(c,d){if(c.length){var f=c[0],e=c[c.length-1],g=f.parentNode,h=a.H.instance,n=h.preprocessNode;if(n){b(f,e,function(a,b){var c=a.previousSibling,d=n.call(h,a);d&&(a===f&&(f=d[0]||b),a===e&&(e=d[d.length-1]||c))});c.length=
0;if(!f)return;f===e?c.push(f):(c.push(f,e),a.a.$(c,g))}b(f,e,function(b){1!==b.nodeType&&8!==b.nodeType||a.Sa(d,b)});b(f,e,function(b){1!==b.nodeType&&8!==b.nodeType||a.u.vb(b,[d])});a.a.$(c,g)}}function d(a){return a.nodeType?a:0<a.length?a[0]:null}function e(b,e,f,h,s){s=s||{};var l=b&&d(b),l=l&&l.ownerDocument,n=s.templateEngine||g;a.Oa.Ib(f,n,l);f=n.renderTemplate(f,h,s,l);if("number"!=typeof f.length||0<f.length&&"number"!=typeof f[0].nodeType)throw Error("Template engine must return an array of DOM nodes");
l=!1;switch(e){case "replaceChildren":a.e.S(b,f);l=!0;break;case "replaceNode":a.a.nb(b,f);l=!0;break;case "ignoreTargetNode":break;default:throw Error("Unknown renderMode: "+e);}l&&(c(f,h),s.afterRender&&a.i.p(s.afterRender,null,[f,h.$data]));return f}var g;a.La=function(b){if(b!=q&&!(b instanceof a.w))throw Error("templateEngine must inherit from ko.templateEngine");g=b};a.Ia=function(b,c,f,h,s){f=f||{};if((f.templateEngine||g)==q)throw Error("Set a template engine before calling renderTemplate");
s=s||"replaceChildren";if(h){var l=d(h);return a.h(function(){var g=c&&c instanceof a.G?c:new a.G(a.a.c(c)),r="function"==typeof b?b(g.$data,g):b,g=e(h,s,r,g,f);"replaceNode"==s&&(h=g,l=d(h))},null,{ua:function(){return!l||!a.a.va(l)},I:l&&"replaceNode"==s?l.parentNode:l})}return a.u.Ca(function(d){a.Ia(b,c,f,d,"replaceNode")})};a.$b=function(b,d,f,g,h){function l(a,b){c(b,r);f.afterRender&&f.afterRender(b,a)}function n(a,c){r=h.createChildContext(a,f.as,function(a){a.$index=c});var d="function"==
typeof b?b(a,r):b;return e(null,"ignoreTargetNode",d,r,f)}var r;return a.h(function(){var b=a.a.c(d)||[];"undefined"==typeof b.length&&(b=[b]);b=a.a.ga(b,function(b){return f.includeDestroyed||b===q||null===b||!a.a.c(b._destroy)});a.i.p(a.a.Ja,null,[g,b,n,f,l])},null,{I:g})};var h=a.a.f.D();a.d.template={init:function(b,c){var d=a.a.c(c());"string"==typeof d||d.name?a.e.Z(b):(d=a.e.childNodes(b),d=a.a.Vb(d),(new a.m.W(b)).nodes(d));return{controlsDescendantBindings:!0}},update:function(b,c,d,e,g){c=
a.a.c(c());d={};e=!0;var l,n=null;"string"!=typeof c&&(d=c,c=a.a.c(d.name),"if"in d&&(e=a.a.c(d["if"])),e&&"ifnot"in d&&(e=!a.a.c(d.ifnot)),l=a.a.c(d.data));"foreach"in d?n=a.$b(c||b,e&&d.foreach||[],d,b,g):e?(g="data"in d?g.createChildContext(l,d.as):g,n=a.Ia(c||b,g,d,b)):a.e.Z(b);g=n;(l=a.a.f.get(b,h))&&"function"==typeof l.B&&l.B();a.a.f.set(b,h,g&&g.aa()?g:q)}};a.g.Y.template=function(b){b=a.g.Ga(b);return 1==b.length&&b[0].unknown||a.g.Sb(b,"name")?null:"This template engine does not support anonymous templates nested within its templates"};
a.e.P.template=!0})();a.b("setTemplateEngine",a.La);a.b("renderTemplate",a.Ia);a.a.ra=function(){function a(b,d,e,g,h){var k=Math.min,m=Math.max,f=[],p,q=b.length,l,n=d.length,r=n-q||1,v=q+n+1,t,u,w;for(p=0;p<=q;p++)for(u=t,f.push(t=[]),w=k(n,p+r),l=m(0,p-1);l<=w;l++)t[l]=l?p?b[p-1]===d[l-1]?u[l-1]:k(u[l]||v,t[l-1]||v)+1:l+1:p+1;k=[];m=[];r=[];p=q;for(l=n;p||l;)n=f[p][l]-1,l&&n===f[p][l-1]?m.push(k[k.length]={status:e,value:d[--l],index:l}):p&&n===f[p-1][l]?r.push(k[k.length]={status:g,value:b[--p],
index:p}):(--l,--p,h.sparse||k.push({status:"retained",value:d[l]}));if(m.length&&r.length){b=10*q;var z;for(d=e=0;(h.dontLimitMoves||d<b)&&(z=m[e]);e++){for(g=0;f=r[g];g++)if(z.value===f.value){z.moved=f.index;f.moved=z.index;r.splice(g,1);d=g=0;break}d+=g}}return k.reverse()}return function(c,d,e){e="boolean"===typeof e?{dontLimitMoves:e}:e||{};c=c||[];d=d||[];return c.length<=d.length?a(c,d,"added","deleted",e):a(d,c,"deleted","added",e)}}();a.b("utils.compareArrays",a.a.ra);(function(){function b(b,
c,g,h,k){var m=[],f=a.h(function(){var f=c(g,k,a.a.$(m,b))||[];0<m.length&&(a.a.nb(m,f),h&&a.i.p(h,null,[g,f,k]));m.splice(0,m.length);a.a.X(m,f)},null,{I:b,ua:function(){return!a.a.Ra(m)}});return{R:m,h:f.aa()?f:q}}var c=a.a.f.D();a.a.Ja=function(d,e,g,h,k){function m(b,c){x=s[c];t!==c&&(z[b]=x);x.za(t++);a.a.$(x.R,d);r.push(x);w.push(x)}function f(b,c){if(b)for(var d=0,e=c.length;d<e;d++)c[d]&&a.a.n(c[d].R,function(a){b(a,d,c[d].fa)})}e=e||[];h=h||{};var p=a.a.f.get(d,c)===q,s=a.a.f.get(d,c)||[],
l=a.a.ha(s,function(a){return a.fa}),n=a.a.ra(l,e,h.dontLimitMoves),r=[],v=0,t=0,u=[],w=[];e=[];for(var z=[],l=[],x,A=0,y,B;y=n[A];A++)switch(B=y.moved,y.status){case "deleted":B===q&&(x=s[v],x.h&&x.h.B(),u.push.apply(u,a.a.$(x.R,d)),h.beforeRemove&&(e[A]=x,w.push(x)));v++;break;case "retained":m(A,v++);break;case "added":B!==q?m(A,B):(x={fa:y.value,za:a.q(t++)},r.push(x),w.push(x),p||(l[A]=x))}f(h.beforeMove,z);a.a.n(u,h.beforeRemove?a.L:a.removeNode);for(var A=0,p=a.e.firstChild(d),C;x=w[A];A++){x.R||
a.a.extend(x,b(d,g,x.fa,k,x.za));for(v=0;n=x.R[v];p=n.nextSibling,C=n,v++)n!==p&&a.e.eb(d,n,C);!x.Ob&&k&&(k(x.fa,x.R,x.za),x.Ob=!0)}f(h.beforeRemove,e);f(h.afterMove,z);f(h.afterAdd,l);a.a.f.set(d,c,r)}})();a.b("utils.setDomNodeChildrenFromArrayMapping",a.a.Ja);a.J=function(){this.allowTemplateRewriting=!1};a.J.prototype=new a.w;a.J.prototype.renderTemplateSource=function(b){var c=(9>a.a.ja?0:b.nodes)?b.nodes():null;if(c)return a.a.Q(c.cloneNode(!0).childNodes);b=b.text();return a.a.Fa(b)};a.J.Aa=
new a.J;a.La(a.J.Aa);a.b("nativeTemplateEngine",a.J);(function(){a.Ba=function(){var a=this.Rb=function(){if("undefined"==typeof u||!u.tmpl)return 0;try{if(0<=u.tmpl.tag.tmpl.open.toString().indexOf("__"))return 2}catch(a){}return 1}();this.renderTemplateSource=function(b,e,g){g=g||{};if(2>a)throw Error("Your version of jQuery.tmpl is too old. Please upgrade to jQuery.tmpl 1.0.0pre or later.");var h=b.data("precompiled");h||(h=b.text()||"",h=u.template(null,"{{ko_with $item.koBindingContext}}"+h+
"{{/ko_with}}"),b.data("precompiled",h));b=[e.$data];e=u.extend({koBindingContext:e},g.templateOptions);e=u.tmpl(h,b,e);e.appendTo(w.createElement("div"));u.fragments={};return e};this.createJavaScriptEvaluatorBlock=function(a){return"{{ko_code ((function() { return "+a+" })()) }}"};this.addTemplate=function(a,b){w.write("<script type='text/html' id='"+a+"'>"+b+"\x3c/script>")};0<a&&(u.tmpl.tag.ko_code={open:"__.push($1 || '');"},u.tmpl.tag.ko_with={open:"with($1) {",close:"} "})};a.Ba.prototype=
new a.w;var b=new a.Ba;0<b.Rb&&a.La(b);a.b("jqueryTmplTemplateEngine",a.Ba)})()})})();})();
/*!
 * jQuery JavaScript Library v2.1.1
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2014 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2014-05-01T17:11Z
 */

(function( global, factory ) {

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		// For CommonJS and CommonJS-like environments where a proper window is present,
		// execute the factory and get jQuery
		// For environments that do not inherently posses a window with a document
		// (such as Node.js), expose a jQuery-making factory as module.exports
		// This accentuates the need for the creation of a real window
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//

var arr = [];

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var support = {};



var
	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,

	version = "2.1.1",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android<4.1
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num != null ?

			// Return just the one element from the set
			( num < 0 ? this[ num + this.length ] : this[ num ] ) :

			// Return all the elements in a clean array
			slice.call( this );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray,

	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},

	isNumeric: function( obj ) {
		// parseFloat NaNs numeric-cast false positives (null|true|false|"")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		return !jQuery.isArray( obj ) && obj - parseFloat( obj ) >= 0;
	},

	isPlainObject: function( obj ) {
		// Not plain objects:
		// - Any object or value whose internal [[Class]] property is not "[object Object]"
		// - DOM nodes
		// - window
		if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		if ( obj.constructor &&
				!hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
			return false;
		}

		// If the function hasn't returned already, we're confident that
		// |obj| is a plain object, created by {} or constructed with new Object
		return true;
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}
		// Support: Android < 4.0, iOS < 6 (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call(obj) ] || "object" :
			typeof obj;
	},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		var script,
			indirect = eval;

		code = jQuery.trim( code );

		if ( code ) {
			// If the code includes a valid, prologue position
			// strict mode pragma, execute code by injecting a
			// script tag into the document.
			if ( code.indexOf("use strict") === 1 ) {
				script = document.createElement("script");
				script.text = code;
				document.head.appendChild( script ).parentNode.removeChild( script );
			} else {
			// Otherwise, avoid the DOM node creation, insertion
			// and removal by using an indirect global eval
				indirect( code );
			}
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Support: Android<4.1
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: Date.now,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v1.10.19
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2014-04-18
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + characterEncoding + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,
	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document (jQuery #6963)
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && testContext( context.parentNode ) || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== strundefined && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare,
		doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent !== parent.top ) {
		// IE11 does not have attachEvent, so all must suffer
		if ( parent.addEventListener ) {
			parent.addEventListener( "unload", function() {
				setDocument();
			}, false );
		} else if ( parent.attachEvent ) {
			parent.attachEvent( "onunload", function() {
				setDocument();
			});
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = rnative.test( doc.getElementsByClassName ) && assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [ m ] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select msallowclip=''><option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( div.querySelectorAll("[msallowclip^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {
			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( div.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === doc || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === doc || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (oldCache = outerCache[ dir ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							outerCache[ dir ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context !== document && context;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is no seed and only one group
	if ( match.length === 1 ) {

		// Take a shortcut and set the context if the root selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				support.getById && context.nodeType === 9 && documentIsHTML &&
				Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;



var rneedsContext = jQuery.expr.match.needsContext;

var rsingleTag = (/^<(\w+)\s*\/?>(?:<\/\1>|)$/);



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( risSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( indexOf.call( qualifier, elem ) >= 0 ) !== not;
	});
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	return elems.length === 1 && elem.nodeType === 1 ?
		jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
		jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
			return elem.nodeType === 1;
		}));
};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			len = this.length,
			ret = [],
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},
	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
});


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	init = jQuery.fn.init = function( selector, context ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[0] === "<" && selector[ selector.length - 1 ] === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return typeof rootjQuery.ready !== "undefined" ?
				rootjQuery.ready( selector ) :
				// Execute immediately if ready is not present
				selector( jQuery );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.extend({
	dir: function( elem, dir, until ) {
		var matched = [],
			truncate = until !== undefined;

		while ( (elem = elem[ dir ]) && elem.nodeType !== 9 ) {
			if ( elem.nodeType === 1 ) {
				if ( truncate && jQuery( elem ).is( until ) ) {
					break;
				}
				matched.push( elem );
			}
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var matched = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				matched.push( n );
			}
		}

		return matched;
	}
});

jQuery.fn.extend({
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter(function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					matched.push( cur );
					break;
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.unique( matched ) : matched );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.unique(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	while ( (cur = cur[dir]) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return elem.contentDocument || jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.unique( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
});
var rnotwhite = (/\S+/g);



// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ tuple[ 0 ] + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});


// The deferred used on DOM ready
var readyList;

jQuery.fn.ready = function( fn ) {
	// Add the callback
	jQuery.ready.promise().done( fn );

	return this;
};

jQuery.extend({
	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.triggerHandler ) {
			jQuery( document ).triggerHandler( "ready" );
			jQuery( document ).off( "ready" );
		}
	}
});

/**
 * The ready event handler and self cleanup method
 */
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed, false );
	window.removeEventListener( "load", completed, false );
	jQuery.ready();
}

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		} else {

			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );
		}
	}
	return readyList.promise( obj );
};

// Kick off the DOM ready check even if the user does not
jQuery.ready.promise();




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = jQuery.access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {
			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
			}
		}
	}

	return chainable ?
		elems :

		// Gets
		bulk ?
			fn.call( elems ) :
			len ? fn( elems[0], key ) : emptyGet;
};


/**
 * Determines whether an object can have data
 */
jQuery.acceptData = function( owner ) {
	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	/* jshint -W018 */
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};


function Data() {
	// Support: Android < 4,
	// Old WebKit does not have Object.preventExtensions/freeze method,
	// return new empty object instead with no [[set]] accessor
	Object.defineProperty( this.cache = {}, 0, {
		get: function() {
			return {};
		}
	});

	this.expando = jQuery.expando + Math.random();
}

Data.uid = 1;
Data.accepts = jQuery.acceptData;

Data.prototype = {
	key: function( owner ) {
		// We can accept data for non-element nodes in modern browsers,
		// but we should not, see #8335.
		// Always return the key for a frozen object.
		if ( !Data.accepts( owner ) ) {
			return 0;
		}

		var descriptor = {},
			// Check if the owner object already has a cache key
			unlock = owner[ this.expando ];

		// If not, create one
		if ( !unlock ) {
			unlock = Data.uid++;

			// Secure it in a non-enumerable, non-writable property
			try {
				descriptor[ this.expando ] = { value: unlock };
				Object.defineProperties( owner, descriptor );

			// Support: Android < 4
			// Fallback to a less secure definition
			} catch ( e ) {
				descriptor[ this.expando ] = unlock;
				jQuery.extend( owner, descriptor );
			}
		}

		// Ensure the cache object
		if ( !this.cache[ unlock ] ) {
			this.cache[ unlock ] = {};
		}

		return unlock;
	},
	set: function( owner, data, value ) {
		var prop,
			// There may be an unlock assigned to this node,
			// if there is no entry for this "owner", create one inline
			// and set the unlock as though an owner entry had always existed
			unlock = this.key( owner ),
			cache = this.cache[ unlock ];

		// Handle: [ owner, key, value ] args
		if ( typeof data === "string" ) {
			cache[ data ] = value;

		// Handle: [ owner, { properties } ] args
		} else {
			// Fresh assignments by object are shallow copied
			if ( jQuery.isEmptyObject( cache ) ) {
				jQuery.extend( this.cache[ unlock ], data );
			// Otherwise, copy the properties one-by-one to the cache object
			} else {
				for ( prop in data ) {
					cache[ prop ] = data[ prop ];
				}
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		// Either a valid cache is found, or will be created.
		// New caches will be created and the unlock returned,
		// allowing direct access to the newly created
		// empty data object. A valid owner object must be provided.
		var cache = this.cache[ this.key( owner ) ];

		return key === undefined ?
			cache : cache[ key ];
	},
	access: function( owner, key, value ) {
		var stored;
		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				((key && typeof key === "string") && value === undefined) ) {

			stored = this.get( owner, key );

			return stored !== undefined ?
				stored : this.get( owner, jQuery.camelCase(key) );
		}

		// [*]When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i, name, camel,
			unlock = this.key( owner ),
			cache = this.cache[ unlock ];

		if ( key === undefined ) {
			this.cache[ unlock ] = {};

		} else {
			// Support array or space separated string of keys
			if ( jQuery.isArray( key ) ) {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = key.concat( key.map( jQuery.camelCase ) );
			} else {
				camel = jQuery.camelCase( key );
				// Try the string as a key before any manipulation
				if ( key in cache ) {
					name = [ key, camel ];
				} else {
					// If a key with the spaces exists, use it.
					// Otherwise, create an array by matching non-whitespace
					name = camel;
					name = name in cache ?
						[ name ] : ( name.match( rnotwhite ) || [] );
				}
			}

			i = name.length;
			while ( i-- ) {
				delete cache[ name[ i ] ];
			}
		}
	},
	hasData: function( owner ) {
		return !jQuery.isEmptyObject(
			this.cache[ owner[ this.expando ] ] || {}
		);
	},
	discard: function( owner ) {
		if ( owner[ this.expando ] ) {
			delete this.cache[ owner[ this.expando ] ];
		}
	}
};
var data_priv = new Data();

var data_user = new Data();



/*
	Implementation Summary

	1. Enforce API surface and semantic compatibility with 1.9.x branch
	2. Improve the module's maintainability by reducing the storage
		paths to a single mechanism.
	3. Use the same single mechanism to support "private" and "user" data.
	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
	5. Avoid exposing implementation details on user objects (eg. expando properties)
	6. Provide a clear path for implementation upgrade to WeakMap in 2014
*/
var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /([A-Z])/g;

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			data_user.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend({
	hasData: function( elem ) {
		return data_user.hasData( elem ) || data_priv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return data_user.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		data_user.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to data_priv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return data_priv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		data_priv.remove( elem, name );
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = data_user.get( elem );

				if ( elem.nodeType === 1 && !data_priv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE11+
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice(5) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					data_priv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				data_user.set( this, key );
			});
		}

		return access( this, function( value ) {
			var data,
				camelKey = jQuery.camelCase( key );

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {
				// Attempt to get data from the cache
				// with the key as-is
				data = data_user.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to get data from the cache
				// with the key camelized
				data = data_user.get( elem, camelKey );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, camelKey, undefined );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each(function() {
				// First, attempt to store a copy or reference of any
				// data that might've been store with a camelCased key.
				var data = data_user.get( this, camelKey );

				// For HTML5 data-* attribute interop, we have to
				// store property names with dashes in a camelCase form.
				// This might not apply to all properties...*
				data_user.set( this, camelKey, value );

				// *... In the case of properties that might _actually_
				// have dashes, we need to also store a copy of that
				// unchanged property.
				if ( key.indexOf("-") !== -1 && data !== undefined ) {
					data_user.set( this, key, value );
				}
			});
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each(function() {
			data_user.remove( this, key );
		});
	}
});


jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = data_priv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray( data ) ) {
					queue = data_priv.access( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return data_priv.get( elem, key ) || data_priv.access( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				data_priv.remove( elem, [ type + "queue", key ] );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = data_priv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var pnum = (/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/).source;

var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHidden = function( elem, el ) {
		// isHidden might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;
		return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
	};

var rcheckableType = (/^(?:checkbox|radio)$/i);



(function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// #11217 - WebKit loses check when the name is after the checked attribute
	// Support: Windows Web Apps (WWA)
	// `name` and `type` need .setAttribute for WWA
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Safari 5.1, iOS 5.1, Android 4.x, Android 2.3
	// old WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Make sure textarea (and checkbox) defaultValue is properly cloned
	// Support: IE9-IE11+
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
})();
var strundefined = typeof undefined;



support.focusinBubbles = "onfocusin" in window;


var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = data_priv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== strundefined && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = data_priv.hasData( elem ) && data_priv.get( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;
			data_priv.remove( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( data_priv.get( cur, "events" ) || {} )[ event.type ] && data_priv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && jQuery.acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, j, ret, matched, handleObj,
			handlerQueue = [],
			args = slice.call( arguments ),
			handlers = ( data_priv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, matches, sel, handleObj,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.disabled !== true || event.type !== "click" ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: Cordova 2.5 (WebKit) (#13255)
		// All events should have a target; Cordova deviceready doesn't
		if ( !event.target ) {
			event.target = document;
		}

		// Support: Safari 6.0+, Chrome < 28
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle, false );
	}
};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&
				// Support: Android < 4.0
				src.returnValue === false ?
			returnTrue :
			returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && e.preventDefault ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && e.stopPropagation ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && e.stopImmediatePropagation ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
// Support: Chrome 15+
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// Create "bubbling" focus and blur events
// Support: Firefox, Chrome, Safari
if ( !support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = data_priv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				data_priv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = data_priv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					data_priv.remove( doc, fix );

				} else {
					data_priv.access( doc, fix, attaches );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});


var
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {

		// Support: IE 9
		option: [ 1, "<select multiple='multiple'>", "</select>" ],

		thead: [ 1, "<table>", "</table>" ],
		col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		_default: [ 0, "", "" ]
	};

// Support: IE 9
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// Support: 1.x compatibility
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute("type");
	}

	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		data_priv.set(
			elems[ i ], "globalEval", !refElements || data_priv.get( refElements[ i ], "globalEval" )
		);
	}
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( data_priv.hasData( src ) ) {
		pdataOld = data_priv.access( src );
		pdataCur = data_priv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( data_user.hasData( src ) ) {
		udataOld = data_user.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		data_user.set( dest, udataCur );
	}
}

function getAll( context, tag ) {
	var ret = context.getElementsByTagName ? context.getElementsByTagName( tag || "*" ) :
			context.querySelectorAll ? context.querySelectorAll( tag || "*" ) :
			[];

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], ret ) :
		ret;
}

// Support: IE >= 9
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Support: IE >= 9
		// Fix Cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var elem, tmp, tag, wrap, contains, j,
			fragment = context.createDocumentFragment(),
			nodes = [],
			i = 0,
			l = elems.length;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					// Support: QtWebKit
					// jQuery.merge because push.apply(_, arraylike) throws
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || fragment.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;
					tmp.innerHTML = wrap[ 1 ] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[ 2 ];

					// Descend through wrappers to the right content
					j = wrap[ 0 ];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Support: QtWebKit
					// jQuery.merge because push.apply(_, arraylike) throws
					jQuery.merge( nodes, tmp.childNodes );

					// Remember the top-level container
					tmp = fragment.firstChild;

					// Fixes #12346
					// Support: Webkit, IE
					tmp.textContent = "";
				}
			}
		}

		// Remove wrapper from fragment
		fragment.textContent = "";

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( fragment.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		return fragment;
	},

	cleanData: function( elems ) {
		var data, elem, type, key,
			special = jQuery.event.special,
			i = 0;

		for ( ; (elem = elems[ i ]) !== undefined; i++ ) {
			if ( jQuery.acceptData( elem ) ) {
				key = elem[ data_priv.expando ];

				if ( key && (data = data_priv.cache[ key ]) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}
					if ( data_priv.cache[ key ] ) {
						// Discard any remaining `private` data
						delete data_priv.cache[ key ];
					}
				}
			}
			// Discard any remaining `user` data
			delete data_user.cache[ elem[ data_user.expando ] ];
		}
	}
});

jQuery.fn.extend({
	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each(function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				});
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	remove: function( selector, keepData /* Internal Use Only */ ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {
			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map(function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var arg = arguments[ 0 ];

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			arg = this.parentNode;

			jQuery.cleanData( getAll( this ) );

			if ( arg ) {
				arg.replaceChild( elem, this );
			}
		});

		// Force removal if there was no new content (e.g., from empty arguments)
		return arg && (arg.length || arg.nodeType) ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback ) {

		// Flatten any nested arrays
		args = concat.apply( [], args );

		var fragment, first, scripts, hasScripts, node, doc,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[ 0 ],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction ||
				( l > 1 && typeof value === "string" &&
					!support.checkClone && rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[ 0 ] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							// Support: QtWebKit
							// jQuery.merge because push.apply(_, arraylike) throws
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[ i ], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!data_priv.access( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Optional AJAX dependency, but won't run scripts if not present
								if ( jQuery._evalUrl ) {
									jQuery._evalUrl( node.src );
								}
							} else {
								jQuery.globalEval( node.textContent.replace( rcleanScript, "" ) );
							}
						}
					}
				}
			}
		}

		return this;
	}
});

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: QtWebKit
			// .get() because push.apply(_, arraylike) throws
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});


var iframe,
	elemdisplay = {};

/**
 * Retrieve the actual display of a element
 * @param {String} name nodeName of the element
 * @param {Object} doc Document object
 */
// Called only from within defaultDisplay
function actualDisplay( name, doc ) {
	var style,
		elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),

		// getDefaultComputedStyle might be reliably used only on attached element
		display = window.getDefaultComputedStyle && ( style = window.getDefaultComputedStyle( elem[ 0 ] ) ) ?

			// Use of this method is a temporary fix (more like optmization) until something better comes along,
			// since it was removed from specification and supported only in FF
			style.display : jQuery.css( elem[ 0 ], "display" );

	// We don't have any data stored on the element,
	// so use "detach" method as fast way to get rid of the element
	elem.detach();

	return display;
}

/**
 * Try to determine the default display value of an element
 * @param {String} nodeName
 */
function defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {

			// Use the already-created iframe if possible
			iframe = (iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" )).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = iframe[ 0 ].contentDocument;

			// Support: IE
			doc.write();
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}
var rmargin = (/^margin/);

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {
		return elem.ownerDocument.defaultView.getComputedStyle( elem, null );
	};



function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,
		style = elem.style;

	computed = computed || getStyles( elem );

	// Support: IE9
	// getPropertyValue is only needed for .css('filter') in IE9, see #12537
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];
	}

	if ( computed ) {

		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// Support: iOS < 6
		// A tribute to the "awesome hack by Dean Edwards"
		// iOS < 6 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
		// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
		if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?
		// Support: IE
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {
	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {
				// Hook not needed (or it's not possible to use it due to missing dependency),
				// remove it.
				// Since there are no other hooks for marginRight, remove the whole object.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.

			return (this.get = hookFn).apply( this, arguments );
		}
	};
}


(function() {
	var pixelPositionVal, boxSizingReliableVal,
		docElem = document.documentElement,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	if ( !div.style ) {
		return;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	container.style.cssText = "border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;" +
		"position:absolute";
	container.appendChild( div );

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computePixelPositionAndBoxSizingReliable() {
		div.style.cssText =
			// Support: Firefox<29, Android 2.3
			// Vendor-prefix box-sizing
			"-webkit-box-sizing:border-box;-moz-box-sizing:border-box;" +
			"box-sizing:border-box;display:block;margin-top:1%;top:1%;" +
			"border:1px;padding:1px;width:4px;position:absolute";
		div.innerHTML = "";
		docElem.appendChild( container );

		var divStyle = window.getComputedStyle( div, null );
		pixelPositionVal = divStyle.top !== "1%";
		boxSizingReliableVal = divStyle.width === "4px";

		docElem.removeChild( container );
	}

	// Support: node.js jsdom
	// Don't assume that getComputedStyle is a property of the global object
	if ( window.getComputedStyle ) {
		jQuery.extend( support, {
			pixelPosition: function() {
				// This test is executed only once but we still do memoizing
				// since we can use the boxSizingReliable pre-computing.
				// No need to check if the test was already performed, though.
				computePixelPositionAndBoxSizingReliable();
				return pixelPositionVal;
			},
			boxSizingReliable: function() {
				if ( boxSizingReliableVal == null ) {
					computePixelPositionAndBoxSizingReliable();
				}
				return boxSizingReliableVal;
			},
			reliableMarginRight: function() {
				// Support: Android 2.3
				// Check if div with explicit width and no margin-right incorrectly
				// gets computed margin-right based on width of container. (#3333)
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				// This support function is only executed once so no memoizing is needed.
				var ret,
					marginDiv = div.appendChild( document.createElement( "div" ) );

				// Reset CSS: box-sizing; display; margin; border; padding
				marginDiv.style.cssText = div.style.cssText =
					// Support: Firefox<29, Android 2.3
					// Vendor-prefix box-sizing
					"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
					"box-sizing:content-box;display:block;margin:0;border:0;padding:0";
				marginDiv.style.marginRight = marginDiv.style.width = "0";
				div.style.width = "1px";
				docElem.appendChild( container );

				ret = !parseFloat( window.getComputedStyle( marginDiv, null ).marginRight );

				docElem.removeChild( container );

				return ret;
			}
		});
	}
})();


// A method for quickly swapping in/out CSS properties to get correct calculations.
jQuery.swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rnumsplit = new RegExp( "^(" + pnum + ")(.*)$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + pnum + ")", "i" ),

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name[0].toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox &&
			( support.boxSizingReliable() || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = data_priv.get( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = data_priv.access( elem, "olddisplay", defaultDisplay(elem.nodeName) );
			}
		} else {
			hidden = isHidden( elem );

			if ( display !== "none" || !hidden ) {
				data_priv.set( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": "cssFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set. See: #7116
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifying setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {
				style[ name ] = value;
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) && elem.offsetWidth === 0 ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

// Support: Android 2.3
jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
	function( elem, computed ) {
		if ( computed ) {
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			// Work around by temporarily setting element display to inline-block
			return jQuery.swap( elem, { "display": "inline-block" },
				curCSS, [ elem, "marginRight" ] );
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});

jQuery.fn.extend({
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	}
};

jQuery.fx = Tween.prototype.init;

// Back Compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		} ]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = data_priv.get( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE9-10 do not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		display = jQuery.css( elem, "display" );

		// Test default display if display is currently "none"
		checkDisplay = display === "none" ?
			data_priv.get( elem, "olddisplay" ) || defaultDisplay( elem.nodeName ) : display;

		if ( checkDisplay === "inline" && jQuery.css( elem, "float" ) === "none" ) {
			style.display = "inline-block";
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always(function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		});
	}

	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// If there is dataShow left over from a stopped hide or show and we are going to proceed with show, we should pretend to be hidden
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );

		// Any non-fx value stops us from restoring the original display value
		} else {
			display = undefined;
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = data_priv.access( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;

			data_priv.remove( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}

	// If this is a noop like .hide().hide(), restore an overwritten display value
	} else if ( (display === "none" ? defaultDisplay( elem.nodeName ) : display) === "inline" ) {
		style.display = display;
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || data_priv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = data_priv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = data_priv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	if ( timer() ) {
		jQuery.fx.start();
	} else {
		jQuery.timers.pop();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = setTimeout( next, time );
		hooks.stop = function() {
			clearTimeout( timeout );
		};
	});
};


(function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: iOS 5.1, Android 4.x, Android 2.3
	// Check the default checkbox/radio value ("" on old WebKit; "on" elsewhere)
	support.checkOn = input.value !== "";

	// Must access the parent to make an option select properly
	// Support: IE9, IE10
	support.optSelected = opt.selected;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Check if an input maintains its value after becoming a radio
	// Support: IE9, IE10
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
})();


var nodeHook, boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend({
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	}
});

jQuery.extend({
	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					elem[ propName ] = false;
				}

				elem.removeAttribute( name );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					jQuery.nodeName( elem, "input" ) ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	}
});

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle;
		if ( !isXML ) {
			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ name ];
			attrHandle[ name ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				name.toLowerCase() :
				null;
			attrHandle[ name ] = handle;
		}
		return ret;
	};
});




var rfocusable = /^(?:input|select|textarea|button)$/i;

jQuery.fn.extend({
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each(function() {
			delete this[ jQuery.propFix[ name ] || name ];
		});
	}
});

jQuery.extend({
	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				return elem.hasAttribute( "tabindex" ) || rfocusable.test( elem.nodeName ) || elem.href ?
					elem.tabIndex :
					-1;
			}
		}
	}
});

// Support: IE9+
// Selectedness for an option in an optgroup can be inaccurate
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});




var rclass = /[\t\r\n\f]/g;

jQuery.fn.extend({
	addClass: function( value ) {
		var classes, elem, cur, clazz, j, finalValue,
			proceed = typeof value === "string" && value,
			i = 0,
			len = this.length;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( elem.className !== finalValue ) {
						elem.className = finalValue;
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j, finalValue,
			proceed = arguments.length === 0 || typeof value === "string" && value,
			i = 0,
			len = this.length;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// only assign if different to avoid unneeded rendering.
					finalValue = value ? jQuery.trim( cur ) : "";
					if ( elem.className !== finalValue ) {
						elem.className = finalValue;
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					data_priv.set( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : data_priv.get( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	}
});




var rreturn = /\r/g;

jQuery.fn.extend({
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					// Support: IE10-11+
					// option.text throws exceptions (#14686, #14858)
					jQuery.trim( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// IE6-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( support.optDisabled ? !option.disabled : option.getAttribute( "disabled" ) === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( option.value, values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
});

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});




// Return jQuery for attributes-only inclusion


jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});


var nonce = jQuery.now();

var rquery = (/\?/);



// Support: Android 2.3
// Workaround failure to string-cast null input
jQuery.parseJSON = function( data ) {
	return JSON.parse( data + "" );
};


// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml, tmp;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE9
	try {
		tmp = new DOMParser();
		xml = tmp.parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	// Document location
	ajaxLocParts,
	ajaxLocation,

	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

		// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,
			// URL without anti-cache param
			cacheURL,
			// Response headers
			responseHeadersString,
			responseHeaders,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" )
			.replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
});


jQuery._evalUrl = function( url ) {
	return jQuery.ajax({
		url: url,
		type: "GET",
		dataType: "script",
		async: false,
		global: false,
		"throws": true
	});
};


jQuery.fn.extend({
	wrapAll: function( html ) {
		var wrap;

		if ( jQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				jQuery( this ).wrapAll( html.call(this, i) );
			});
		}

		if ( this[ 0 ] ) {

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				jQuery( this ).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});


jQuery.expr.filters.hidden = function( elem ) {
	// Support: Opera <= 12.12
	// Opera reports offsetWidths and offsetHeights less than zero on some elements
	return elem.offsetWidth <= 0 && elem.offsetHeight <= 0;
};
jQuery.expr.filters.visible = function( elem ) {
	return !jQuery.expr.filters.hidden( elem );
};




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function() {
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		})
		.map(function( i, elem ) {
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ) {
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});


jQuery.ajaxSettings.xhr = function() {
	try {
		return new XMLHttpRequest();
	} catch( e ) {}
};

var xhrId = 0,
	xhrCallbacks = {},
	xhrSuccessStatus = {
		// file protocol always yields status code 0, assume 200
		0: 200,
		// Support: IE9
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

// Support: IE9
// Open requests must be manually aborted on unload (#5280)
if ( window.ActiveXObject ) {
	jQuery( window ).on( "unload", function() {
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]();
		}
	});
}

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport(function( options ) {
	var callback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr(),
					id = ++xhrId;

				xhr.open( options.type, options.url, options.async, options.username, options.password );

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers["X-Requested-With"] ) {
					headers["X-Requested-With"] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							delete xhrCallbacks[ id ];
							callback = xhr.onload = xhr.onerror = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {
								complete(
									// file: protocol always yields status 0; see #8605, #14207
									xhr.status,
									xhr.statusText
								);
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,
									// Support: IE9
									// Accessing binary-data responseText throws an exception
									// (#11426)
									typeof xhr.responseText === "string" ? {
										text: xhr.responseText
									} : undefined,
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				xhr.onerror = callback("error");

				// Create the abort callback
				callback = xhrCallbacks[ id ] = callback("abort");

				try {
					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {
					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
});




// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {
	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery("<script>").prop({
					async: true,
					charset: s.scriptCharset,
					src: s.url
				}).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
});




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});




// data: string of html
// context (optional): If specified, the fragment will be created in this context, defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}
	context = context || document;

	var parsed = rsingleTag.exec( data ),
		scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[1] ) ];
	}

	parsed = jQuery.buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


// Keep a copy of the old load method
var _load = jQuery.fn.load;

/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, type, response,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = jQuery.trim( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};




jQuery.expr.filters.animated = function( elem ) {
	return jQuery.grep(jQuery.timers, function( fn ) {
		return elem === fn.elem;
	}).length;
};




var docElem = window.document.documentElement;

/**
 * Gets a window from an element
 */
function getWindow( elem ) {
	return jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
}

jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf("auto") > -1;

		// Need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend({
	offset: function( options ) {
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each(function( i ) {
					jQuery.offset.setOffset( this, options, i );
				});
		}

		var docElem, win,
			elem = this[ 0 ],
			box = { top: 0, left: 0 },
			doc = elem && elem.ownerDocument;

		if ( !doc ) {
			return;
		}

		docElem = doc.documentElement;

		// Make sure it's not a disconnected DOM node
		if ( !jQuery.contains( docElem, elem ) ) {
			return box;
		}

		// If we don't have gBCR, just use 0,0 rather than error
		// BlackBerry 5, iOS 3 (original iPhone)
		if ( typeof elem.getBoundingClientRect !== strundefined ) {
			box = elem.getBoundingClientRect();
		}
		win = getWindow( doc );
		return {
			top: box.top + win.pageYOffset - docElem.clientTop,
			left: box.left + win.pageXOffset - docElem.clientLeft
		};
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// We assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();

		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;

			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position" ) === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || docElem;
		});
	}
});

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : window.pageXOffset,
					top ? val : window.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// getComputedStyle returns percent when specified for top/left/bottom/right
// rather than make the css module depend on the offset module, we just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );
				// if curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
});


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});


// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	});
}




var
	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in
// AMD (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( typeof noGlobal === strundefined ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;

}));

//     Underscore.js 1.6.0
//     http://underscorejs.org
//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function () {

    // Baseline setup
    // --------------

    // Establish the root object, `window` in the browser, or `exports` on the server.
    var root = this;

    // Save the previous value of the `_` variable.
    var previousUnderscore = root._;

    // Establish the object that gets returned to break out of a loop iteration.
    var breaker = {};

    // Save bytes in the minified (but not gzipped) version:
    var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

    // Create quick reference variables for speed access to core prototypes.
    var
      push = ArrayProto.push,
      slice = ArrayProto.slice,
      concat = ArrayProto.concat,
      toString = ObjProto.toString,
      hasOwnProperty = ObjProto.hasOwnProperty;

    // All **ECMAScript 5** native function implementations that we hope to use
    // are declared here.
    var
      nativeForEach = ArrayProto.forEach,
      nativeMap = ArrayProto.map,
      nativeReduce = ArrayProto.reduce,
      nativeReduceRight = ArrayProto.reduceRight,
      nativeFilter = ArrayProto.filter,
      nativeEvery = ArrayProto.every,
      nativeSome = ArrayProto.some,
      nativeIndexOf = ArrayProto.indexOf,
      nativeLastIndexOf = ArrayProto.lastIndexOf,
      nativeIsArray = Array.isArray,
      nativeKeys = Object.keys,
      nativeBind = FuncProto.bind;

    // Create a safe reference to the Underscore object for use below.
    var _ = function (obj) {
        if (obj instanceof _) return obj;
        if (!(this instanceof _)) return new _(obj);
        this._wrapped = obj;
    };

    // Export the Underscore object for **Node.js**, with
    // backwards-compatibility for the old `require()` API. If we're in
    // the browser, add `_` as a global object via a string identifier,
    // for Closure Compiler "advanced" mode.
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = _;
        }
        exports._ = _;
    } else {
        root._ = _;
    }

    // Current version.
    _.VERSION = '1.6.0';

    // Collection Functions
    // --------------------

    // The cornerstone, an `each` implementation, aka `forEach`.
    // Handles objects with the built-in `forEach`, arrays, and raw objects.
    // Delegates to **ECMAScript 5**'s native `forEach` if available.
    var each = _.each = _.forEach = function (obj, iterator, context) {
        if (obj == null) return obj;
        if (nativeForEach && obj.forEach === nativeForEach) {
            obj.forEach(iterator, context);
        } else if (obj.length === +obj.length) {
            for (var i = 0, length = obj.length; i < length; i++) {
                if (iterator.call(context, obj[i], i, obj) === breaker) return;
            }
        } else {
            var keys = _.keys(obj);
            for (var i = 0, length = keys.length; i < length; i++) {
                if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
            }
        }
        return obj;
    };

    // Return the results of applying the iterator to each element.
    // Delegates to **ECMAScript 5**'s native `map` if available.
    _.map = _.collect = function (obj, iterator, context) {
        var results = [];
        if (obj == null) return results;
        if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
        each(obj, function (value, index, list) {
            results.push(iterator.call(context, value, index, list));
        });
        return results;
    };

    var reduceError = 'Reduce of empty array with no initial value';

    // **Reduce** builds up a single result from a list of values, aka `inject`,
    // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
    _.reduce = _.foldl = _.inject = function (obj, iterator, memo, context) {
        var initial = arguments.length > 2;
        if (obj == null) obj = [];
        if (nativeReduce && obj.reduce === nativeReduce) {
            if (context) iterator = _.bind(iterator, context);
            return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
        }
        each(obj, function (value, index, list) {
            if (!initial) {
                memo = value;
                initial = true;
            } else {
                memo = iterator.call(context, memo, value, index, list);
            }
        });
        if (!initial) throw new TypeError(reduceError);
        return memo;
    };

    // The right-associative version of reduce, also known as `foldr`.
    // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
    _.reduceRight = _.foldr = function (obj, iterator, memo, context) {
        var initial = arguments.length > 2;
        if (obj == null) obj = [];
        if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
            if (context) iterator = _.bind(iterator, context);
            return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
        }
        var length = obj.length;
        if (length !== +length) {
            var keys = _.keys(obj);
            length = keys.length;
        }
        each(obj, function (value, index, list) {
            index = keys ? keys[--length] : --length;
            if (!initial) {
                memo = obj[index];
                initial = true;
            } else {
                memo = iterator.call(context, memo, obj[index], index, list);
            }
        });
        if (!initial) throw new TypeError(reduceError);
        return memo;
    };

    // Return the first value which passes a truth test. Aliased as `detect`.
    _.find = _.detect = function (obj, predicate, context) {
        var result;
        any(obj, function (value, index, list) {
            if (predicate.call(context, value, index, list)) {
                result = value;
                return true;
            }
        });
        return result;
    };

    // Return all the elements that pass a truth test.
    // Delegates to **ECMAScript 5**'s native `filter` if available.
    // Aliased as `select`.
    _.filter = _.select = function (obj, predicate, context) {
        var results = [];
        if (obj == null) return results;
        if (nativeFilter && obj.filter === nativeFilter) return obj.filter(predicate, context);
        each(obj, function (value, index, list) {
            if (predicate.call(context, value, index, list)) results.push(value);
        });
        return results;
    };

    // Return all the elements for which a truth test fails.
    _.reject = function (obj, predicate, context) {
        return _.filter(obj, function (value, index, list) {
            return !predicate.call(context, value, index, list);
        }, context);
    };

    // Determine whether all of the elements match a truth test.
    // Delegates to **ECMAScript 5**'s native `every` if available.
    // Aliased as `all`.
    _.every = _.all = function (obj, predicate, context) {
        predicate || (predicate = _.identity);
        var result = true;
        if (obj == null) return result;
        if (nativeEvery && obj.every === nativeEvery) return obj.every(predicate, context);
        each(obj, function (value, index, list) {
            if (!(result = result && predicate.call(context, value, index, list))) return breaker;
        });
        return !!result;
    };

    // Determine if at least one element in the object matches a truth test.
    // Delegates to **ECMAScript 5**'s native `some` if available.
    // Aliased as `any`.
    var any = _.some = _.any = function (obj, predicate, context) {
        predicate || (predicate = _.identity);
        var result = false;
        if (obj == null) return result;
        if (nativeSome && obj.some === nativeSome) return obj.some(predicate, context);
        each(obj, function (value, index, list) {
            if (result || (result = predicate.call(context, value, index, list))) return breaker;
        });
        return !!result;
    };

    // Determine if the array or object contains a given value (using `===`).
    // Aliased as `include`.
    _.contains = _.include = function (obj, target) {
        if (obj == null) return false;
        if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
        return any(obj, function (value) {
            return value === target;
        });
    };

    // Invoke a method (with arguments) on every item in a collection.
    _.invoke = function (obj, method) {
        var args = slice.call(arguments, 2);
        var isFunc = _.isFunction(method);
        return _.map(obj, function (value) {
            return (isFunc ? method : value[method]).apply(value, args);
        });
    };

    // Convenience version of a common use case of `map`: fetching a property.
    _.pluck = function (obj, key) {
        return _.map(obj, _.property(key));
    };

    // Convenience version of a common use case of `filter`: selecting only objects
    // containing specific `key:value` pairs.
    _.where = function (obj, attrs) {
        return _.filter(obj, _.matches(attrs));
    };

    // Convenience version of a common use case of `find`: getting the first object
    // containing specific `key:value` pairs.
    _.findWhere = function (obj, attrs) {
        return _.find(obj, _.matches(attrs));
    };

    // Return the maximum element or (element-based computation).
    // Can't optimize arrays of integers longer than 65,535 elements.
    // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
    _.max = function (obj, iterator, context) {
        if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
            return Math.max.apply(Math, obj);
        }
        var result = -Infinity, lastComputed = -Infinity;
        each(obj, function (value, index, list) {
            var computed = iterator ? iterator.call(context, value, index, list) : value;
            if (computed > lastComputed) {
                result = value;
                lastComputed = computed;
            }
        });
        return result;
    };

    // Return the minimum element (or element-based computation).
    _.min = function (obj, iterator, context) {
        if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
            return Math.min.apply(Math, obj);
        }
        var result = Infinity, lastComputed = Infinity;
        each(obj, function (value, index, list) {
            var computed = iterator ? iterator.call(context, value, index, list) : value;
            if (computed < lastComputed) {
                result = value;
                lastComputed = computed;
            }
        });
        return result;
    };

    // Shuffle an array, using the modern version of the
    // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
    _.shuffle = function (obj) {
        var rand;
        var index = 0;
        var shuffled = [];
        each(obj, function (value) {
            rand = _.random(index++);
            shuffled[index - 1] = shuffled[rand];
            shuffled[rand] = value;
        });
        return shuffled;
    };

    // Sample **n** random values from a collection.
    // If **n** is not specified, returns a single random element.
    // The internal `guard` argument allows it to work with `map`.
    _.sample = function (obj, n, guard) {
        if (n == null || guard) {
            if (obj.length !== +obj.length) obj = _.values(obj);
            return obj[_.random(obj.length - 1)];
        }
        return _.shuffle(obj).slice(0, Math.max(0, n));
    };

    // An internal function to generate lookup iterators.
    var lookupIterator = function (value) {
        if (value == null) return _.identity;
        if (_.isFunction(value)) return value;
        return _.property(value);
    };

    // Sort the object's values by a criterion produced by an iterator.
    _.sortBy = function (obj, iterator, context) {
        iterator = lookupIterator(iterator);
        return _.pluck(_.map(obj, function (value, index, list) {
            return {
                value: value,
                index: index,
                criteria: iterator.call(context, value, index, list)
            };
        }).sort(function (left, right) {
            var a = left.criteria;
            var b = right.criteria;
            if (a !== b) {
                if (a > b || a === void 0) return 1;
                if (a < b || b === void 0) return -1;
            }
            return left.index - right.index;
        }), 'value');
    };

    // An internal function used for aggregate "group by" operations.
    var group = function (behavior) {
        return function (obj, iterator, context) {
            var result = {};
            iterator = lookupIterator(iterator);
            each(obj, function (value, index) {
                var key = iterator.call(context, value, index, obj);
                behavior(result, key, value);
            });
            return result;
        };
    };

    // Groups the object's values by a criterion. Pass either a string attribute
    // to group by, or a function that returns the criterion.
    _.groupBy = group(function (result, key, value) {
        _.has(result, key) ? result[key].push(value) : result[key] = [value];
    });

    // Indexes the object's values by a criterion, similar to `groupBy`, but for
    // when you know that your index values will be unique.
    _.indexBy = group(function (result, key, value) {
        result[key] = value;
    });

    // Counts instances of an object that group by a certain criterion. Pass
    // either a string attribute to count by, or a function that returns the
    // criterion.
    _.countBy = group(function (result, key) {
        _.has(result, key) ? result[key]++ : result[key] = 1;
    });

    // Use a comparator function to figure out the smallest index at which
    // an object should be inserted so as to maintain order. Uses binary search.
    _.sortedIndex = function (array, obj, iterator, context) {
        iterator = lookupIterator(iterator);
        var value = iterator.call(context, obj);
        var low = 0, high = array.length;
        while (low < high) {
            var mid = (low + high) >>> 1;
            iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
        }
        return low;
    };

    // Safely create a real, live array from anything iterable.
    _.toArray = function (obj) {
        if (!obj) return [];
        if (_.isArray(obj)) return slice.call(obj);
        if (obj.length === +obj.length) return _.map(obj, _.identity);
        return _.values(obj);
    };

    // Return the number of elements in an object.
    _.size = function (obj) {
        if (obj == null) return 0;
        return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
    };

    // Array Functions
    // ---------------

    // Get the first element of an array. Passing **n** will return the first N
    // values in the array. Aliased as `head` and `take`. The **guard** check
    // allows it to work with `_.map`.
    _.first = _.head = _.take = function (array, n, guard) {
        if (array == null) return void 0;
        if ((n == null) || guard) return array[0];
        if (n < 0) return [];
        return slice.call(array, 0, n);
    };

    // Returns everything but the last entry of the array. Especially useful on
    // the arguments object. Passing **n** will return all the values in
    // the array, excluding the last N. The **guard** check allows it to work with
    // `_.map`.
    _.initial = function (array, n, guard) {
        return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
    };

    // Get the last element of an array. Passing **n** will return the last N
    // values in the array. The **guard** check allows it to work with `_.map`.
    _.last = function (array, n, guard) {
        if (array == null) return void 0;
        if ((n == null) || guard) return array[array.length - 1];
        return slice.call(array, Math.max(array.length - n, 0));
    };

    // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
    // Especially useful on the arguments object. Passing an **n** will return
    // the rest N values in the array. The **guard**
    // check allows it to work with `_.map`.
    _.rest = _.tail = _.drop = function (array, n, guard) {
        return slice.call(array, (n == null) || guard ? 1 : n);
    };

    // Trim out all falsy values from an array.
    _.compact = function (array) {
        return _.filter(array, _.identity);
    };

    // Internal implementation of a recursive `flatten` function.
    var flatten = function (input, shallow, output) {
        if (shallow && _.every(input, _.isArray)) {
            return concat.apply(output, input);
        }
        each(input, function (value) {
            if (_.isArray(value) || _.isArguments(value)) {
                shallow ? push.apply(output, value) : flatten(value, shallow, output);
            } else {
                output.push(value);
            }
        });
        return output;
    };

    // Flatten out an array, either recursively (by default), or just one level.
    _.flatten = function (array, shallow) {
        return flatten(array, shallow, []);
    };

    // Return a version of the array that does not contain the specified value(s).
    _.without = function (array) {
        return _.difference(array, slice.call(arguments, 1));
    };

    // Split an array into two arrays: one whose elements all satisfy the given
    // predicate, and one whose elements all do not satisfy the predicate.
    _.partition = function (array, predicate, context) {
        predicate = lookupIterator(predicate);
        var pass = [], fail = [];
        each(array, function (elem) {
            (predicate.call(context, elem) ? pass : fail).push(elem);
        });
        return [pass, fail];
    };

    // Produce a duplicate-free version of the array. If the array has already
    // been sorted, you have the option of using a faster algorithm.
    // Aliased as `unique`.
    _.uniq = _.unique = function (array, isSorted, iterator, context) {
        if (_.isFunction(isSorted)) {
            context = iterator;
            iterator = isSorted;
            isSorted = false;
        }
        var initial = iterator ? _.map(array, iterator, context) : array;
        var results = [];
        var seen = [];
        each(initial, function (value, index) {
            if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
                seen.push(value);
                results.push(array[index]);
            }
        });
        return results;
    };

    // Produce an array that contains the union: each distinct element from all of
    // the passed-in arrays.
    _.union = function () {
        return _.uniq(_.flatten(arguments, true));
    };

    // Produce an array that contains every item shared between all the
    // passed-in arrays.
    _.intersection = function (array) {
        var rest = slice.call(arguments, 1);
        return _.filter(_.uniq(array), function (item) {
            return _.every(rest, function (other) {
                return _.contains(other, item);
            });
        });
    };

    // Take the difference between one array and a number of other arrays.
    // Only the elements present in just the first array will remain.
    _.difference = function (array) {
        var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
        return _.filter(array, function (value) { return !_.contains(rest, value); });
    };

    // Zip together multiple lists into a single array -- elements that share
    // an index go together.
    _.zip = function () {
        var length = _.max(_.pluck(arguments, 'length').concat(0));
        var results = new Array(length);
        for (var i = 0; i < length; i++) {
            results[i] = _.pluck(arguments, '' + i);
        }
        return results;
    };

    // Converts lists into objects. Pass either a single array of `[key, value]`
    // pairs, or two parallel arrays of the same length -- one of keys, and one of
    // the corresponding values.
    _.object = function (list, values) {
        if (list == null) return {};
        var result = {};
        for (var i = 0, length = list.length; i < length; i++) {
            if (values) {
                result[list[i]] = values[i];
            } else {
                result[list[i][0]] = list[i][1];
            }
        }
        return result;
    };

    // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
    // we need this function. Return the position of the first occurrence of an
    // item in an array, or -1 if the item is not included in the array.
    // Delegates to **ECMAScript 5**'s native `indexOf` if available.
    // If the array is large and already in sort order, pass `true`
    // for **isSorted** to use binary search.
    _.indexOf = function (array, item, isSorted) {
        if (array == null) return -1;
        var i = 0, length = array.length;
        if (isSorted) {
            if (typeof isSorted == 'number') {
                i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
            } else {
                i = _.sortedIndex(array, item);
                return array[i] === item ? i : -1;
            }
        }
        if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
        for (; i < length; i++) if (array[i] === item) return i;
        return -1;
    };

    // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
    _.lastIndexOf = function (array, item, from) {
        if (array == null) return -1;
        var hasIndex = from != null;
        if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
            return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
        }
        var i = (hasIndex ? from : array.length);
        while (i--) if (array[i] === item) return i;
        return -1;
    };

    // Generate an integer Array containing an arithmetic progression. A port of
    // the native Python `range()` function. See
    // [the Python documentation](http://docs.python.org/library/functions.html#range).
    _.range = function (start, stop, step) {
        if (arguments.length <= 1) {
            stop = start || 0;
            start = 0;
        }
        step = arguments[2] || 1;

        var length = Math.max(Math.ceil((stop - start) / step), 0);
        var idx = 0;
        var range = new Array(length);

        while (idx < length) {
            range[idx++] = start;
            start += step;
        }

        return range;
    };

    // Function (ahem) Functions
    // ------------------

    // Reusable constructor function for prototype setting.
    var ctor = function () { };

    // Create a function bound to a given object (assigning `this`, and arguments,
    // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
    // available.
    _.bind = function (func, context) {
        var args, bound;
        if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
        if (!_.isFunction(func)) throw new TypeError;
        args = slice.call(arguments, 2);
        return bound = function () {
            if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
            ctor.prototype = func.prototype;
            var self = new ctor;
            ctor.prototype = null;
            var result = func.apply(self, args.concat(slice.call(arguments)));
            if (Object(result) === result) return result;
            return self;
        };
    };

    // Partially apply a function by creating a version that has had some of its
    // arguments pre-filled, without changing its dynamic `this` context. _ acts
    // as a placeholder, allowing any combination of arguments to be pre-filled.
    _.partial = function (func) {
        var boundArgs = slice.call(arguments, 1);
        return function () {
            var position = 0;
            var args = boundArgs.slice();
            for (var i = 0, length = args.length; i < length; i++) {
                if (args[i] === _) args[i] = arguments[position++];
            }
            while (position < arguments.length) args.push(arguments[position++]);
            return func.apply(this, args);
        };
    };

    // Bind a number of an object's methods to that object. Remaining arguments
    // are the method names to be bound. Useful for ensuring that all callbacks
    // defined on an object belong to it.
    _.bindAll = function (obj) {
        var funcs = slice.call(arguments, 1);
        if (funcs.length === 0) throw new Error('bindAll must be passed function names');
        each(funcs, function (f) { obj[f] = _.bind(obj[f], obj); });
        return obj;
    };

    // Memoize an expensive function by storing its results.
    _.memoize = function (func, hasher) {
        var memo = {};
        hasher || (hasher = _.identity);
        return function () {
            var key = hasher.apply(this, arguments);
            return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
        };
    };

    // Delays a function for the given number of milliseconds, and then calls
    // it with the arguments supplied.
    _.delay = function (func, wait) {
        var args = slice.call(arguments, 2);
        return setTimeout(function () { return func.apply(null, args); }, wait);
    };

    // Defers a function, scheduling it to run after the current call stack has
    // cleared.
    _.defer = function (func) {
        return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
    };

    // Returns a function, that, when invoked, will only be triggered at most once
    // during a given window of time. Normally, the throttled function will run
    // as much as it can, without ever going more than once per `wait` duration;
    // but if you'd like to disable the execution on the leading edge, pass
    // `{leading: false}`. To disable execution on the trailing edge, ditto.
    _.throttle = function (func, wait, options) {
        var context, args, result;
        var timeout = null;
        var previous = 0;
        options || (options = {});
        var later = function () {
            previous = options.leading === false ? 0 : _.now();
            timeout = null;
            result = func.apply(context, args);
            context = args = null;
        };
        return function () {
            var now = _.now();
            if (!previous && options.leading === false) previous = now;
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0) {
                clearTimeout(timeout);
                timeout = null;
                previous = now;
                result = func.apply(context, args);
                context = args = null;
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    };

    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    _.debounce = function (func, wait, immediate) {
        var timeout, args, context, timestamp, result;

        var later = function () {
            var last = _.now() - timestamp;
            if (last < wait) {
                timeout = setTimeout(later, wait - last);
            } else {
                timeout = null;
                if (!immediate) {
                    result = func.apply(context, args);
                    context = args = null;
                }
            }
        };

        return function () {
            context = this;
            args = arguments;
            timestamp = _.now();
            var callNow = immediate && !timeout;
            if (!timeout) {
                timeout = setTimeout(later, wait);
            }
            if (callNow) {
                result = func.apply(context, args);
                context = args = null;
            }

            return result;
        };
    };

    // Returns a function that will be executed at most one time, no matter how
    // often you call it. Useful for lazy initialization.
    _.once = function (func) {
        var ran = false, memo;
        return function () {
            if (ran) return memo;
            ran = true;
            memo = func.apply(this, arguments);
            func = null;
            return memo;
        };
    };

    // Returns the first function passed as an argument to the second,
    // allowing you to adjust arguments, run code before and after, and
    // conditionally execute the original function.
    _.wrap = function (func, wrapper) {
        return _.partial(wrapper, func);
    };

    // Returns a function that is the composition of a list of functions, each
    // consuming the return value of the function that follows.
    _.compose = function () {
        var funcs = arguments;
        return function () {
            var args = arguments;
            for (var i = funcs.length - 1; i >= 0; i--) {
                args = [funcs[i].apply(this, args)];
            }
            return args[0];
        };
    };

    // Returns a function that will only be executed after being called N times.
    _.after = function (times, func) {
        return function () {
            if (--times < 1) {
                return func.apply(this, arguments);
            }
        };
    };

    // Object Functions
    // ----------------

    // Retrieve the names of an object's properties.
    // Delegates to **ECMAScript 5**'s native `Object.keys`
    _.keys = function (obj) {
        if (!_.isObject(obj)) return [];
        if (nativeKeys) return nativeKeys(obj);
        var keys = [];
        for (var key in obj) if (_.has(obj, key)) keys.push(key);
        return keys;
    };

    // Retrieve the values of an object's properties.
    _.values = function (obj) {
        var keys = _.keys(obj);
        var length = keys.length;
        var values = new Array(length);
        for (var i = 0; i < length; i++) {
            values[i] = obj[keys[i]];
        }
        return values;
    };

    // Convert an object into a list of `[key, value]` pairs.
    _.pairs = function (obj) {
        var keys = _.keys(obj);
        var length = keys.length;
        var pairs = new Array(length);
        for (var i = 0; i < length; i++) {
            pairs[i] = [keys[i], obj[keys[i]]];
        }
        return pairs;
    };

    // Invert the keys and values of an object. The values must be serializable.
    _.invert = function (obj) {
        var result = {};
        var keys = _.keys(obj);
        for (var i = 0, length = keys.length; i < length; i++) {
            result[obj[keys[i]]] = keys[i];
        }
        return result;
    };

    // Return a sorted list of the function names available on the object.
    // Aliased as `methods`
    _.functions = _.methods = function (obj) {
        var names = [];
        for (var key in obj) {
            if (_.isFunction(obj[key])) names.push(key);
        }
        return names.sort();
    };

    // Extend a given object with all the properties in passed-in object(s).
    _.extend = function (obj) {
        each(slice.call(arguments, 1), function (source) {
            if (source) {
                for (var prop in source) {
                    obj[prop] = source[prop];
                }
            }
        });
        return obj;
    };

    // Return a copy of the object only containing the whitelisted properties.
    _.pick = function (obj) {
        var copy = {};
        var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
        each(keys, function (key) {
            if (key in obj) copy[key] = obj[key];
        });
        return copy;
    };

    // Return a copy of the object without the blacklisted properties.
    _.omit = function (obj) {
        var copy = {};
        var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
        for (var key in obj) {
            if (!_.contains(keys, key)) copy[key] = obj[key];
        }
        return copy;
    };

    // Fill in a given object with default properties.
    _.defaults = function (obj) {
        each(slice.call(arguments, 1), function (source) {
            if (source) {
                for (var prop in source) {
                    if (obj[prop] === void 0) obj[prop] = source[prop];
                }
            }
        });
        return obj;
    };

    // Create a (shallow-cloned) duplicate of an object.
    _.clone = function (obj) {
        if (!_.isObject(obj)) return obj;
        return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
    };

    // Invokes interceptor with the obj, and then returns obj.
    // The primary purpose of this method is to "tap into" a method chain, in
    // order to perform operations on intermediate results within the chain.
    _.tap = function (obj, interceptor) {
        interceptor(obj);
        return obj;
    };

    // Internal recursive comparison function for `isEqual`.
    var eq = function (a, b, aStack, bStack) {
        // Identical objects are equal. `0 === -0`, but they aren't identical.
        // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
        if (a === b) return a !== 0 || 1 / a == 1 / b;
        // A strict comparison is necessary because `null == undefined`.
        if (a == null || b == null) return a === b;
        // Unwrap any wrapped objects.
        if (a instanceof _) a = a._wrapped;
        if (b instanceof _) b = b._wrapped;
        // Compare `[[Class]]` names.
        var className = toString.call(a);
        if (className != toString.call(b)) return false;
        switch (className) {
            // Strings, numbers, dates, and booleans are compared by value.
            case '[object String]':
                // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
                // equivalent to `new String("5")`.
                return a == String(b);
            case '[object Number]':
                // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
                // other numeric values.
                return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
            case '[object Date]':
            case '[object Boolean]':
                // Coerce dates and booleans to numeric primitive values. Dates are compared by their
                // millisecond representations. Note that invalid dates with millisecond representations
                // of `NaN` are not equivalent.
                return +a == +b;
                // RegExps are compared by their source patterns and flags.
            case '[object RegExp]':
                return a.source == b.source &&
                       a.global == b.global &&
                       a.multiline == b.multiline &&
                       a.ignoreCase == b.ignoreCase;
        }
        if (typeof a != 'object' || typeof b != 'object') return false;
        // Assume equality for cyclic structures. The algorithm for detecting cyclic
        // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
        var length = aStack.length;
        while (length--) {
            // Linear search. Performance is inversely proportional to the number of
            // unique nested structures.
            if (aStack[length] == a) return bStack[length] == b;
        }
        // Objects with different constructors are not equivalent, but `Object`s
        // from different frames are.
        var aCtor = a.constructor, bCtor = b.constructor;
        if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                                 _.isFunction(bCtor) && (bCtor instanceof bCtor))
                            && ('constructor' in a && 'constructor' in b)) {
            return false;
        }
        // Add the first object to the stack of traversed objects.
        aStack.push(a);
        bStack.push(b);
        var size = 0, result = true;
        // Recursively compare objects and arrays.
        if (className == '[object Array]') {
            // Compare array lengths to determine if a deep comparison is necessary.
            size = a.length;
            result = size == b.length;
            if (result) {
                // Deep compare the contents, ignoring non-numeric properties.
                while (size--) {
                    if (!(result = eq(a[size], b[size], aStack, bStack))) break;
                }
            }
        } else {
            // Deep compare objects.
            for (var key in a) {
                if (_.has(a, key)) {
                    // Count the expected number of properties.
                    size++;
                    // Deep compare each member.
                    if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
                }
            }
            // Ensure that both objects contain the same number of properties.
            if (result) {
                for (key in b) {
                    if (_.has(b, key) && !(size--)) break;
                }
                result = !size;
            }
        }
        // Remove the first object from the stack of traversed objects.
        aStack.pop();
        bStack.pop();
        return result;
    };

    // Perform a deep comparison to check if two objects are equal.
    _.isEqual = function (a, b) {
        return eq(a, b, [], []);
    };

    // Is a given array, string, or object empty?
    // An "empty" object has no enumerable own-properties.
    _.isEmpty = function (obj) {
        if (obj == null) return true;
        if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
        for (var key in obj) if (_.has(obj, key)) return false;
        return true;
    };

    // Is a given value a DOM element?
    _.isElement = function (obj) {
        return !!(obj && obj.nodeType === 1);
    };

    // Is a given value an array?
    // Delegates to ECMA5's native Array.isArray
    _.isArray = nativeIsArray || function (obj) {
        return toString.call(obj) == '[object Array]';
    };

    // Is a given variable an object?
    _.isObject = function (obj) {
        return obj === Object(obj);
    };

    // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
    each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function (name) {
        _['is' + name] = function (obj) {
            return toString.call(obj) == '[object ' + name + ']';
        };
    });

    // Define a fallback version of the method in browsers (ahem, IE), where
    // there isn't any inspectable "Arguments" type.
    if (!_.isArguments(arguments)) {
        _.isArguments = function (obj) {
            return !!(obj && _.has(obj, 'callee'));
        };
    }

    // Optimize `isFunction` if appropriate.
    if (typeof (/./) !== 'function') {
        _.isFunction = function (obj) {
            return typeof obj === 'function';
        };
    }

    // Is a given object a finite number?
    _.isFinite = function (obj) {
        return isFinite(obj) && !isNaN(parseFloat(obj));
    };

    // Is the given value `NaN`? (NaN is the only number which does not equal itself).
    _.isNaN = function (obj) {
        return _.isNumber(obj) && obj != +obj;
    };

    // Is a given value a boolean?
    _.isBoolean = function (obj) {
        return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
    };

    // Is a given value equal to null?
    _.isNull = function (obj) {
        return obj === null;
    };

    // Is a given variable undefined?
    _.isUndefined = function (obj) {
        return obj === void 0;
    };

    // Shortcut function for checking if an object has a given property directly
    // on itself (in other words, not on a prototype).
    _.has = function (obj, key) {
        return hasOwnProperty.call(obj, key);
    };

    // Utility Functions
    // -----------------

    // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
    // previous owner. Returns a reference to the Underscore object.
    _.noConflict = function () {
        root._ = previousUnderscore;
        return this;
    };

    // Keep the identity function around for default iterators.
    _.identity = function (value) {
        return value;
    };

    _.constant = function (value) {
        return function () {
            return value;
        };
    };

    _.property = function (key) {
        return function (obj) {
            return obj[key];
        };
    };

    // Returns a predicate for checking whether an object has a given set of `key:value` pairs.
    _.matches = function (attrs) {
        return function (obj) {
            if (obj === attrs) return true; //avoid comparing an object to itself.
            for (var key in attrs) {
                if (attrs[key] !== obj[key])
                    return false;
            }
            return true;
        }
    };

    // Run a function **n** times.
    _.times = function (n, iterator, context) {
        var accum = Array(Math.max(0, n));
        for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
        return accum;
    };

    // Return a random integer between min and max (inclusive).
    _.random = function (min, max) {
        if (max == null) {
            max = min;
            min = 0;
        }
        return min + Math.floor(Math.random() * (max - min + 1));
    };

    // A (possibly faster) way to get the current timestamp as an integer.
    _.now = Date.now || function () { return new Date().getTime(); };

    // List of HTML entities for escaping.
    var entityMap = {
        escape: {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;'
        }
    };
    entityMap.unescape = _.invert(entityMap.escape);

    // Regexes containing the keys and values listed immediately above.
    var entityRegexes = {
        escape: new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
        unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
    };

    // Functions for escaping and unescaping strings to/from HTML interpolation.
    _.each(['escape', 'unescape'], function (method) {
        _[method] = function (string) {
            if (string == null) return '';
            return ('' + string).replace(entityRegexes[method], function (match) {
                return entityMap[method][match];
            });
        };
    });

    // If the value of the named `property` is a function then invoke it with the
    // `object` as context; otherwise, return it.
    _.result = function (object, property) {
        if (object == null) return void 0;
        var value = object[property];
        return _.isFunction(value) ? value.call(object) : value;
    };

    // Add your own custom functions to the Underscore object.
    _.mixin = function (obj) {
        each(_.functions(obj), function (name) {
            var func = _[name] = obj[name];
            _.prototype[name] = function () {
                var args = [this._wrapped];
                push.apply(args, arguments);
                return result.call(this, func.apply(_, args));
            };
        });
    };

    // Generate a unique integer id (unique within the entire client session).
    // Useful for temporary DOM ids.
    var idCounter = 0;
    _.uniqueId = function (prefix) {
        var id = ++idCounter + '';
        return prefix ? prefix + id : id;
    };

    // By default, Underscore uses ERB-style template delimiters, change the
    // following template settings to use alternative delimiters.
    _.templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
    };

    // When customizing `templateSettings`, if you don't want to define an
    // interpolation, evaluation or escaping regex, we need one that is
    // guaranteed not to match.
    var noMatch = /(.)^/;

    // Certain characters need to be escaped so that they can be put into a
    // string literal.
    var escapes = {
        "'": "'",
        '\\': '\\',
        '\r': 'r',
        '\n': 'n',
        '\t': 't',
        '\u2028': 'u2028',
        '\u2029': 'u2029'
    };

    var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

    // JavaScript micro-templating, similar to John Resig's implementation.
    // Underscore templating handles arbitrary delimiters, preserves whitespace,
    // and correctly escapes quotes within interpolated code.
    _.template = function (text, data, settings) {
        var render;
        settings = _.defaults({}, settings, _.templateSettings);

        // Combine delimiters into one regular expression via alternation.
        var matcher = new RegExp([
          (settings.escape || noMatch).source,
          (settings.interpolate || noMatch).source,
          (settings.evaluate || noMatch).source
        ].join('|') + '|$', 'g');

        // Compile the template source, escaping string literals appropriately.
        var index = 0;
        var source = "__p+='";
        text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
            source += text.slice(index, offset)
              .replace(escaper, function (match) { return '\\' + escapes[match]; });

            if (escape) {
                source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
            }
            if (interpolate) {
                source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
            }
            if (evaluate) {
                source += "';\n" + evaluate + "\n__p+='";
            }
            index = offset + match.length;
            return match;
        });
        source += "';\n";

        // If a variable is not specified, place data values in local scope.
        if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

        source = "var __t,__p='',__j=Array.prototype.join," +
          "print=function(){__p+=__j.call(arguments,'');};\n" +
          source + "return __p;\n";

        try {
            render = new Function(settings.variable || 'obj', '_', source);
        } catch (e) {
            e.source = source;
            throw e;
        }

        if (data) return render(data, _);
        var template = function (data) {
            return render.call(this, data, _);
        };

        // Provide the compiled function source as a convenience for precompilation.
        template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

        return template;
    };

    // Add a "chain" function, which will delegate to the wrapper.
    _.chain = function (obj) {
        return _(obj).chain();
    };

    // OOP
    // ---------------
    // If Underscore is called as a function, it returns a wrapped object that
    // can be used OO-style. This wrapper holds altered versions of all the
    // underscore functions. Wrapped objects may be chained.

    // Helper function to continue chaining intermediate results.
    var result = function (obj) {
        return this._chain ? _(obj).chain() : obj;
    };

    // Add all of the Underscore functions to the wrapper object.
    _.mixin(_);

    // Add all mutator Array functions to the wrapper.
    each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function (name) {
        var method = ArrayProto[name];
        _.prototype[name] = function () {
            var obj = this._wrapped;
            method.apply(obj, arguments);
            if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
            return result.call(this, obj);
        };
    });

    // Add all accessor Array functions to the wrapper.
    each(['concat', 'join', 'slice'], function (name) {
        var method = ArrayProto[name];
        _.prototype[name] = function () {
            return result.call(this, method.apply(this._wrapped, arguments));
        };
    });

    _.extend(_.prototype, {

        // Start chaining a wrapped Underscore object.
        chain: function () {
            this._chain = true;
            return this;
        },

        // Extracts the result from a wrapped and chained object.
        value: function () {
            return this._wrapped;
        }

    });

    // AMD registration happens at the end for compatibility with AMD loaders
    // that may not enforce next-turn semantics on modules. Even though general
    // practice for AMD registration is to be anonymous, underscore registers
    // as a named module because, like jQuery, it is a base library that is
    // popular enough to be bundled in a third party lib, but not be part of
    // an AMD load request. Those cases could generate an error when an
    // anonymous define() is called outside of a loader request.
    if (typeof define === 'function' && define.amd) {
        define('underscore', [], function () {
            return _;
        });
    }
}).call(this);
//     Backbone.js 1.1.1

//     (c) 2010-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org

(function (root, factory) {

    // Set up Backbone appropriately for the environment. Start with AMD.
    if (typeof define === 'function' && define.amd) {
        define(['underscore', 'jquery', 'exports'], function (_, $, exports) {
            // Export global even in AMD case in case this script is loaded with
            // others that may still expect a global Backbone.
            root.Backbone = factory(root, exports, _, $);
        });

        // Next for Node.js or CommonJS. jQuery may not be needed as a module.
    } else if (typeof exports !== 'undefined') {
        var _ = require('underscore'), $;
        try { $ = require('jquery'); } catch (e) { }
        factory(root, exports, _, $);

        // Finally, as a browser global.
    } else {
        root.Backbone = factory(root, {}, root._, (root.jQuery || root.Zepto || root.ender || root.$));
    }

}(this, function (root, Backbone, _, $) {

    // Initial Setup
    // -------------

    // Save the previous value of the `Backbone` variable, so that it can be
    // restored later on, if `noConflict` is used.
    var previousBackbone = root.Backbone;

    // Create local references to array methods we'll want to use later.
    var array = [];
    var push = array.push;
    var slice = array.slice;
    var splice = array.splice;

    // Current version of the library. Keep in sync with `package.json`.
    Backbone.VERSION = '1.1.1';

    // For Backbone's purposes, jQuery, Zepto, Ender, or My Library (kidding) owns
    // the `$` variable.
    Backbone.$ = $;

    // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
    // to its previous owner. Returns a reference to this Backbone object.
    Backbone.noConflict = function () {
        root.Backbone = previousBackbone;
        return this;
    };

    // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option
    // will fake `"PATCH"`, `"PUT"` and `"DELETE"` requests via the `_method` parameter and
    // set a `X-Http-Method-Override` header.
    Backbone.emulateHTTP = false;

    // Turn on `emulateJSON` to support legacy servers that can't deal with direct
    // `application/json` requests ... will encode the body as
    // `application/x-www-form-urlencoded` instead and will send the model in a
    // form param named `model`.
    Backbone.emulateJSON = false;

    // Backbone.Events
    // ---------------

    // A module that can be mixed in to *any object* in order to provide it with
    // custom events. You may bind with `on` or remove with `off` callback
    // functions to an event; `trigger`-ing an event fires all callbacks in
    // succession.
    //
    //     var object = {};
    //     _.extend(object, Backbone.Events);
    //     object.on('expand', function(){ alert('expanded'); });
    //     object.trigger('expand');
    //
    var Events = Backbone.Events = {

        // Bind an event to a `callback` function. Passing `"all"` will bind
        // the callback to all events fired.
        on: function (name, callback, context) {
            if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
            this._events || (this._events = {});
            var events = this._events[name] || (this._events[name] = []);
            events.push({ callback: callback, context: context, ctx: context || this });
            return this;
        },

        // Bind an event to only be triggered a single time. After the first time
        // the callback is invoked, it will be removed.
        once: function (name, callback, context) {
            if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
            var self = this;
            var once = _.once(function () {
                self.off(name, once);
                callback.apply(this, arguments);
            });
            once._callback = callback;
            return this.on(name, once, context);
        },

        // Remove one or many callbacks. If `context` is null, removes all
        // callbacks with that function. If `callback` is null, removes all
        // callbacks for the event. If `name` is null, removes all bound
        // callbacks for all events.
        off: function (name, callback, context) {
            var retain, ev, events, names, i, l, j, k;
            if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
            if (!name && !callback && !context) {
                this._events = void 0;
                return this;
            }
            names = name ? [name] : _.keys(this._events);
            for (i = 0, l = names.length; i < l; i++) {
                name = names[i];
                if (events = this._events[name]) {
                    this._events[name] = retain = [];
                    if (callback || context) {
                        for (j = 0, k = events.length; j < k; j++) {
                            ev = events[j];
                            if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
                                (context && context !== ev.context)) {
                                retain.push(ev);
                            }
                        }
                    }
                    if (!retain.length) delete this._events[name];
                }
            }

            return this;
        },

        // Trigger one or many events, firing all bound callbacks. Callbacks are
        // passed the same arguments as `trigger` is, apart from the event name
        // (unless you're listening on `"all"`, which will cause your callback to
        // receive the true name of the event as the first argument).
        trigger: function (name) {
            if (!this._events) return this;
            var args = slice.call(arguments, 1);
            if (!eventsApi(this, 'trigger', name, args)) return this;
            var events = this._events[name];
            var allEvents = this._events.all;
            if (events) triggerEvents(events, args);
            if (allEvents) triggerEvents(allEvents, arguments);
            return this;
        },

        // Tell this object to stop listening to either specific events ... or
        // to every object it's currently listening to.
        stopListening: function (obj, name, callback) {
            var listeningTo = this._listeningTo;
            if (!listeningTo) return this;
            var remove = !name && !callback;
            if (!callback && typeof name === 'object') callback = this;
            if (obj) (listeningTo = {})[obj._listenId] = obj;
            for (var id in listeningTo) {
                obj = listeningTo[id];
                obj.off(name, callback, this);
                if (remove || _.isEmpty(obj._events)) delete this._listeningTo[id];
            }
            return this;
        }

    };

    // Regular expression used to split event strings.
    var eventSplitter = /\s+/;

    // Implement fancy features of the Events API such as multiple event
    // names `"change blur"` and jQuery-style event maps `{change: action}`
    // in terms of the existing API.
    var eventsApi = function (obj, action, name, rest) {
        if (!name) return true;

        // Handle event maps.
        if (typeof name === 'object') {
            for (var key in name) {
                obj[action].apply(obj, [key, name[key]].concat(rest));
            }
            return false;
        }

        // Handle space separated event names.
        if (eventSplitter.test(name)) {
            var names = name.split(eventSplitter);
            for (var i = 0, l = names.length; i < l; i++) {
                obj[action].apply(obj, [names[i]].concat(rest));
            }
            return false;
        }

        return true;
    };

    // A difficult-to-believe, but optimized internal dispatch function for
    // triggering events. Tries to keep the usual cases speedy (most internal
    // Backbone events have 3 arguments).
    var triggerEvents = function (events, args) {
        var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
        switch (args.length) {
            case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
            case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
            case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
            case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
            default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
        }
    };

    var listenMethods = { listenTo: 'on', listenToOnce: 'once' };

    // Inversion-of-control versions of `on` and `once`. Tell *this* object to
    // listen to an event in another object ... keeping track of what it's
    // listening to.
    _.each(listenMethods, function (implementation, method) {
        Events[method] = function (obj, name, callback) {
            var listeningTo = this._listeningTo || (this._listeningTo = {});
            var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
            listeningTo[id] = obj;
            if (!callback && typeof name === 'object') callback = this;
            obj[implementation](name, callback, this);
            return this;
        };
    });

    // Aliases for backwards compatibility.
    Events.bind = Events.on;
    Events.unbind = Events.off;

    // Allow the `Backbone` object to serve as a global event bus, for folks who
    // want global "pubsub" in a convenient place.
    _.extend(Backbone, Events);

    // Backbone.Model
    // --------------

    // Backbone **Models** are the basic data object in the framework --
    // frequently representing a row in a table in a database on your server.
    // A discrete chunk of data and a bunch of useful, related methods for
    // performing computations and transformations on that data.

    // Create a new model with the specified attributes. A client id (`cid`)
    // is automatically generated and assigned for you.
    var Model = Backbone.Model = function (attributes, options) {
        var attrs = attributes || {};
        options || (options = {});
        this.cid = _.uniqueId('c');
        this.attributes = {};
        if (options.collection) this.collection = options.collection;
        if (options.parse) attrs = this.parse(attrs, options) || {};
        attrs = _.defaults({}, attrs, _.result(this, 'defaults'));
        this.set(attrs, options);
        this.changed = {};
        this.initialize.apply(this, arguments);
    };

    // Attach all inheritable methods to the Model prototype.
    _.extend(Model.prototype, Events, {

        // A hash of attributes whose current and previous value differ.
        changed: null,

        // The value returned during the last failed validation.
        validationError: null,

        // The default name for the JSON `id` attribute is `"id"`. MongoDB and
        // CouchDB users may want to set this to `"_id"`.
        idAttribute: 'id',

        // Initialize is an empty function by default. Override it with your own
        // initialization logic.
        initialize: function () { },

        // Return a copy of the model's `attributes` object.
        toJSON: function (options) {
            return _.clone(this.attributes);
        },

        // Proxy `Backbone.sync` by default -- but override this if you need
        // custom syncing semantics for *this* particular model.
        sync: function () {
            return Backbone.sync.apply(this, arguments);
        },

        // Get the value of an attribute.
        get: function (attr) {
            return this.attributes[attr];
        },

        // Get the HTML-escaped value of an attribute.
        escape: function (attr) {
            return _.escape(this.get(attr));
        },

        // Returns `true` if the attribute contains a value that is not null
        // or undefined.
        has: function (attr) {
            return this.get(attr) != null;
        },

        // Set a hash of model attributes on the object, firing `"change"`. This is
        // the core primitive operation of a model, updating the data and notifying
        // anyone who needs to know about the change in state. The heart of the beast.
        set: function (key, val, options) {
            var attr, attrs, unset, changes, silent, changing, prev, current;
            if (key == null) return this;

            // Handle both `"key", value` and `{key: value}` -style arguments.
            if (typeof key === 'object') {
                attrs = key;
                options = val;
            } else {
                (attrs = {})[key] = val;
            }

            options || (options = {});

            // Run validation.
            if (!this._validate(attrs, options)) return false;

            // Extract attributes and options.
            unset = options.unset;
            silent = options.silent;
            changes = [];
            changing = this._changing;
            this._changing = true;

            if (!changing) {
                this._previousAttributes = _.clone(this.attributes);
                this.changed = {};
            }
            current = this.attributes, prev = this._previousAttributes;

            // Check for changes of `id`.
            if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

            // For each `set` attribute, update or delete the current value.
            for (attr in attrs) {
                val = attrs[attr];
                if (!_.isEqual(current[attr], val)) changes.push(attr);
                if (!_.isEqual(prev[attr], val)) {
                    this.changed[attr] = val;
                } else {
                    delete this.changed[attr];
                }
                unset ? delete current[attr] : current[attr] = val;
            }

            // Trigger all relevant attribute changes.
            if (!silent) {
                if (changes.length) this._pending = options;
                for (var i = 0, l = changes.length; i < l; i++) {
                    this.trigger('change:' + changes[i], this, current[changes[i]], options);
                }
            }

            // You might be wondering why there's a `while` loop here. Changes can
            // be recursively nested within `"change"` events.
            if (changing) return this;
            if (!silent) {
                while (this._pending) {
                    options = this._pending;
                    this._pending = false;
                    this.trigger('change', this, options);
                }
            }
            this._pending = false;
            this._changing = false;
            return this;
        },

        // Remove an attribute from the model, firing `"change"`. `unset` is a noop
        // if the attribute doesn't exist.
        unset: function (attr, options) {
            return this.set(attr, void 0, _.extend({}, options, { unset: true }));
        },

        // Clear all attributes on the model, firing `"change"`.
        clear: function (options) {
            var attrs = {};
            for (var key in this.attributes) attrs[key] = void 0;
            return this.set(attrs, _.extend({}, options, { unset: true }));
        },

        // Determine if the model has changed since the last `"change"` event.
        // If you specify an attribute name, determine if that attribute has changed.
        hasChanged: function (attr) {
            if (attr == null) return !_.isEmpty(this.changed);
            return _.has(this.changed, attr);
        },

        // Return an object containing all the attributes that have changed, or
        // false if there are no changed attributes. Useful for determining what
        // parts of a view need to be updated and/or what attributes need to be
        // persisted to the server. Unset attributes will be set to undefined.
        // You can also pass an attributes object to diff against the model,
        // determining if there *would be* a change.
        changedAttributes: function (diff) {
            if (!diff) return this.hasChanged() ? _.clone(this.changed) : false;
            var val, changed = false;
            var old = this._changing ? this._previousAttributes : this.attributes;
            for (var attr in diff) {
                if (_.isEqual(old[attr], (val = diff[attr]))) continue;
                (changed || (changed = {}))[attr] = val;
            }
            return changed;
        },

        // Get the previous value of an attribute, recorded at the time the last
        // `"change"` event was fired.
        previous: function (attr) {
            if (attr == null || !this._previousAttributes) return null;
            return this._previousAttributes[attr];
        },

        // Get all of the attributes of the model at the time of the previous
        // `"change"` event.
        previousAttributes: function () {
            return _.clone(this._previousAttributes);
        },

        // Fetch the model from the server. If the server's representation of the
        // model differs from its current attributes, they will be overridden,
        // triggering a `"change"` event.
        fetch: function (options) {
            options = options ? _.clone(options) : {};
            if (options.parse === void 0) options.parse = true;
            var model = this;
            var success = options.success;
            options.success = function (resp) {
                if (!model.set(model.parse(resp, options), options)) return false;
                if (success) success(model, resp, options);
                model.trigger('sync', model, resp, options);
            };
            wrapError(this, options);
            return this.sync('read', this, options);
        },

        // Set a hash of model attributes, and sync the model to the server.
        // If the server returns an attributes hash that differs, the model's
        // state will be `set` again.
        save: function (key, val, options) {
            var attrs, method, xhr, attributes = this.attributes;

            // Handle both `"key", value` and `{key: value}` -style arguments.
            if (key == null || typeof key === 'object') {
                attrs = key;
                options = val;
            } else {
                (attrs = {})[key] = val;
            }

            options = _.extend({ validate: true }, options);

            // If we're not waiting and attributes exist, save acts as
            // `set(attr).save(null, opts)` with validation. Otherwise, check if
            // the model will be valid when the attributes, if any, are set.
            if (attrs && !options.wait) {
                if (!this.set(attrs, options)) return false;
            } else {
                if (!this._validate(attrs, options)) return false;
            }

            // Set temporary attributes if `{wait: true}`.
            if (attrs && options.wait) {
                this.attributes = _.extend({}, attributes, attrs);
            }

            // After a successful server-side save, the client is (optionally)
            // updated with the server-side state.
            if (options.parse === void 0) options.parse = true;
            var model = this;
            var success = options.success;
            options.success = function (resp) {
                // Ensure attributes are restored during synchronous saves.
                model.attributes = attributes;
                var serverAttrs = model.parse(resp, options);
                if (options.wait) serverAttrs = _.extend(attrs || {}, serverAttrs);
                if (_.isObject(serverAttrs) && !model.set(serverAttrs, options)) {
                    return false;
                }
                if (success) success(model, resp, options);
                model.trigger('sync', model, resp, options);
            };
            wrapError(this, options);

            method = this.isNew() ? 'create' : (options.patch ? 'patch' : 'update');
            if (method === 'patch') options.attrs = attrs;
            xhr = this.sync(method, this, options);

            // Restore attributes.
            if (attrs && options.wait) this.attributes = attributes;

            return xhr;
        },

        // Destroy this model on the server if it was already persisted.
        // Optimistically removes the model from its collection, if it has one.
        // If `wait: true` is passed, waits for the server to respond before removal.
        destroy: function (options) {
            options = options ? _.clone(options) : {};
            var model = this;
            var success = options.success;

            var destroy = function () {
                model.trigger('destroy', model, model.collection, options);
            };

            options.success = function (resp) {
                if (options.wait || model.isNew()) destroy();
                if (success) success(model, resp, options);
                if (!model.isNew()) model.trigger('sync', model, resp, options);
            };

            if (this.isNew()) {
                options.success();
                return false;
            }
            wrapError(this, options);

            var xhr = this.sync('delete', this, options);
            if (!options.wait) destroy();
            return xhr;
        },

        // Default URL for the model's representation on the server -- if you're
        // using Backbone's restful methods, override this to change the endpoint
        // that will be called.
        url: function () {
            var base =
              _.result(this, 'urlRoot') ||
              _.result(this.collection, 'url') ||
              urlError();
            if (this.isNew()) return base;
            return base.replace(/([^\/])$/, '$1/') + encodeURIComponent(this.id);
        },

        // **parse** converts a response into the hash of attributes to be `set` on
        // the model. The default implementation is just to pass the response along.
        parse: function (resp, options) {
            return resp;
        },

        // Create a new model with identical attributes to this one.
        clone: function () {
            return new this.constructor(this.attributes);
        },

        // A model is new if it has never been saved to the server, and lacks an id.
        isNew: function () {
            return !this.has(this.idAttribute);
        },

        // Check if the model is currently in a valid state.
        isValid: function (options) {
            return this._validate({}, _.extend(options || {}, { validate: true }));
        },

        // Run validation against the next complete set of model attributes,
        // returning `true` if all is well. Otherwise, fire an `"invalid"` event.
        _validate: function (attrs, options) {
            if (!options.validate || !this.validate) return true;
            attrs = _.extend({}, this.attributes, attrs);
            var error = this.validationError = this.validate(attrs, options) || null;
            if (!error) return true;
            this.trigger('invalid', this, error, _.extend(options, { validationError: error }));
            return false;
        }

    });

    // Underscore methods that we want to implement on the Model.
    var modelMethods = ['keys', 'values', 'pairs', 'invert', 'pick', 'omit'];

    // Mix in each Underscore method as a proxy to `Model#attributes`.
    _.each(modelMethods, function (method) {
        Model.prototype[method] = function () {
            var args = slice.call(arguments);
            args.unshift(this.attributes);
            return _[method].apply(_, args);
        };
    });

    // Backbone.Collection
    // -------------------

    // If models tend to represent a single row of data, a Backbone Collection is
    // more analagous to a table full of data ... or a small slice or page of that
    // table, or a collection of rows that belong together for a particular reason
    // -- all of the messages in this particular folder, all of the documents
    // belonging to this particular author, and so on. Collections maintain
    // indexes of their models, both in order, and for lookup by `id`.

    // Create a new **Collection**, perhaps to contain a specific type of `model`.
    // If a `comparator` is specified, the Collection will maintain
    // its models in sort order, as they're added and removed.
    var Collection = Backbone.Collection = function (models, options) {
        options || (options = {});
        if (options.model) this.model = options.model;
        if (options.comparator !== void 0) this.comparator = options.comparator;
        this._reset();
        this.initialize.apply(this, arguments);
        if (models) this.reset(models, _.extend({ silent: true }, options));
    };

    // Default options for `Collection#set`.
    var setOptions = { add: true, remove: true, merge: true };
    var addOptions = { add: true, remove: false };

    // Define the Collection's inheritable methods.
    _.extend(Collection.prototype, Events, {

        // The default model for a collection is just a **Backbone.Model**.
        // This should be overridden in most cases.
        model: Model,

        // Initialize is an empty function by default. Override it with your own
        // initialization logic.
        initialize: function () { },

        // The JSON representation of a Collection is an array of the
        // models' attributes.
        toJSON: function (options) {
            return this.map(function (model) { return model.toJSON(options); });
        },

        // Proxy `Backbone.sync` by default.
        sync: function () {
            return Backbone.sync.apply(this, arguments);
        },

        // Add a model, or list of models to the set.
        add: function (models, options) {
            return this.set(models, _.extend({ merge: false }, options, addOptions));
        },

        // Remove a model, or a list of models from the set.
        remove: function (models, options) {
            var singular = !_.isArray(models);
            models = singular ? [models] : _.clone(models);
            options || (options = {});
            var i, l, index, model;
            for (i = 0, l = models.length; i < l; i++) {
                model = models[i] = this.get(models[i]);
                if (!model) continue;
                delete this._byId[model.id];
                delete this._byId[model.cid];
                index = this.indexOf(model);
                this.models.splice(index, 1);
                this.length--;
                if (!options.silent) {
                    options.index = index;
                    model.trigger('remove', model, this, options);
                }
                this._removeReference(model, options);
            }
            return singular ? models[0] : models;
        },

        // Update a collection by `set`-ing a new list of models, adding new ones,
        // removing models that are no longer present, and merging models that
        // already exist in the collection, as necessary. Similar to **Model#set**,
        // the core operation for updating the data contained by the collection.
        set: function (models, options) {
            options = _.defaults({}, options, setOptions);
            if (options.parse) models = this.parse(models, options);
            var singular = !_.isArray(models);
            models = singular ? (models ? [models] : []) : _.clone(models);
            var i, l, id, model, attrs, existing, sort;
            var at = options.at;
            var targetModel = this.model;
            var sortable = this.comparator && (at == null) && options.sort !== false;
            var sortAttr = _.isString(this.comparator) ? this.comparator : null;
            var toAdd = [], toRemove = [], modelMap = {};
            var add = options.add, merge = options.merge, remove = options.remove;
            var order = !sortable && add && remove ? [] : false;

            // Turn bare objects into model references, and prevent invalid models
            // from being added.
            for (i = 0, l = models.length; i < l; i++) {
                attrs = models[i] || {};
                if (attrs instanceof Model) {
                    id = model = attrs;
                } else {
                    id = attrs[targetModel.prototype.idAttribute || 'id'];
                }

                // If a duplicate is found, prevent it from being added and
                // optionally merge it into the existing model.
                if (existing = this.get(id)) {
                    if (remove) modelMap[existing.cid] = true;
                    if (merge) {
                        attrs = attrs === model ? model.attributes : attrs;
                        if (options.parse) attrs = existing.parse(attrs, options);
                        existing.set(attrs, options);
                        if (sortable && !sort && existing.hasChanged(sortAttr)) sort = true;
                    }
                    models[i] = existing;

                    // If this is a new, valid model, push it to the `toAdd` list.
                } else if (add) {
                    model = models[i] = this._prepareModel(attrs, options);
                    if (!model) continue;
                    toAdd.push(model);
                    this._addReference(model, options);
                }

                // Do not add multiple models with the same `id`.
                model = existing || model;
                if (order && (model.isNew() || !modelMap[model.id])) order.push(model);
                modelMap[model.id] = true;
            }

            // Remove nonexistent models if appropriate.
            if (remove) {
                for (i = 0, l = this.length; i < l; ++i) {
                    if (!modelMap[(model = this.models[i]).cid]) toRemove.push(model);
                }
                if (toRemove.length) this.remove(toRemove, options);
            }

            // See if sorting is needed, update `length` and splice in new models.
            if (toAdd.length || (order && order.length)) {
                if (sortable) sort = true;
                this.length += toAdd.length;
                if (at != null) {
                    for (i = 0, l = toAdd.length; i < l; i++) {
                        this.models.splice(at + i, 0, toAdd[i]);
                    }
                } else {
                    if (order) this.models.length = 0;
                    var orderedModels = order || toAdd;
                    for (i = 0, l = orderedModels.length; i < l; i++) {
                        this.models.push(orderedModels[i]);
                    }
                }
            }

            // Silently sort the collection if appropriate.
            if (sort) this.sort({ silent: true });

            // Unless silenced, it's time to fire all appropriate add/sort events.
            if (!options.silent) {
                for (i = 0, l = toAdd.length; i < l; i++) {
                    (model = toAdd[i]).trigger('add', model, this, options);
                }
                if (sort || (order && order.length)) this.trigger('sort', this, options);
            }

            // Return the added (or merged) model (or models).
            return singular ? models[0] : models;
        },

        // When you have more items than you want to add or remove individually,
        // you can reset the entire set with a new list of models, without firing
        // any granular `add` or `remove` events. Fires `reset` when finished.
        // Useful for bulk operations and optimizations.
        reset: function (models, options) {
            options || (options = {});
            for (var i = 0, l = this.models.length; i < l; i++) {
                this._removeReference(this.models[i], options);
            }
            options.previousModels = this.models;
            this._reset();
            models = this.add(models, _.extend({ silent: true }, options));
            if (!options.silent) this.trigger('reset', this, options);
            return models;
        },

        // Add a model to the end of the collection.
        push: function (model, options) {
            return this.add(model, _.extend({ at: this.length }, options));
        },

        // Remove a model from the end of the collection.
        pop: function (options) {
            var model = this.at(this.length - 1);
            this.remove(model, options);
            return model;
        },

        // Add a model to the beginning of the collection.
        unshift: function (model, options) {
            return this.add(model, _.extend({ at: 0 }, options));
        },

        // Remove a model from the beginning of the collection.
        shift: function (options) {
            var model = this.at(0);
            this.remove(model, options);
            return model;
        },

        // Slice out a sub-array of models from the collection.
        slice: function () {
            return slice.apply(this.models, arguments);
        },

        // Get a model from the set by id.
        get: function (obj) {
            if (obj == null) return void 0;
            return this._byId[obj] || this._byId[obj.id] || this._byId[obj.cid];
        },

        // Get the model at the given index.
        at: function (index) {
            return this.models[index];
        },

        // Return models with matching attributes. Useful for simple cases of
        // `filter`.
        where: function (attrs, first) {
            if (_.isEmpty(attrs)) return first ? void 0 : [];
            return this[first ? 'find' : 'filter'](function (model) {
                for (var key in attrs) {
                    if (attrs[key] !== model.get(key)) return false;
                }
                return true;
            });
        },

        // Return the first model with matching attributes. Useful for simple cases
        // of `find`.
        findWhere: function (attrs) {
            return this.where(attrs, true);
        },

        // Force the collection to re-sort itself. You don't need to call this under
        // normal circumstances, as the set will maintain sort order as each item
        // is added.
        sort: function (options) {
            if (!this.comparator) throw new Error('Cannot sort a set without a comparator');
            options || (options = {});

            // Run sort based on type of `comparator`.
            if (_.isString(this.comparator) || this.comparator.length === 1) {
                this.models = this.sortBy(this.comparator, this);
            } else {
                this.models.sort(_.bind(this.comparator, this));
            }

            if (!options.silent) this.trigger('sort', this, options);
            return this;
        },

        // Pluck an attribute from each model in the collection.
        pluck: function (attr) {
            return _.invoke(this.models, 'get', attr);
        },

        // Fetch the default set of models for this collection, resetting the
        // collection when they arrive. If `reset: true` is passed, the response
        // data will be passed through the `reset` method instead of `set`.
        fetch: function (options) {
            options = options ? _.clone(options) : {};
            if (options.parse === void 0) options.parse = true;
            var success = options.success;
            var collection = this;
            options.success = function (resp) {
                var method = options.reset ? 'reset' : 'set';
                collection[method](resp, options);
                if (success) success(collection, resp, options);
                collection.trigger('sync', collection, resp, options);
            };
            wrapError(this, options);
            return this.sync('read', this, options);
        },

        // Create a new instance of a model in this collection. Add the model to the
        // collection immediately, unless `wait: true` is passed, in which case we
        // wait for the server to agree.
        create: function (model, options) {
            options = options ? _.clone(options) : {};
            if (!(model = this._prepareModel(model, options))) return false;
            if (!options.wait) this.add(model, options);
            var collection = this;
            var success = options.success;
            options.success = function (model, resp) {
                if (options.wait) collection.add(model, options);
                if (success) success(model, resp, options);
            };
            model.save(null, options);
            return model;
        },

        // **parse** converts a response into a list of models to be added to the
        // collection. The default implementation is just to pass it through.
        parse: function (resp, options) {
            return resp;
        },

        // Create a new collection with an identical list of models as this one.
        clone: function () {
            return new this.constructor(this.models);
        },

        // Private method to reset all internal state. Called when the collection
        // is first initialized or reset.
        _reset: function () {
            this.length = 0;
            this.models = [];
            this._byId = {};
        },

        // Prepare a hash of attributes (or other model) to be added to this
        // collection.
        _prepareModel: function (attrs, options) {
            if (attrs instanceof Model) return attrs;
            options = options ? _.clone(options) : {};
            options.collection = this;
            var model = new this.model(attrs, options);
            if (!model.validationError) return model;
            this.trigger('invalid', this, model.validationError, options);
            return false;
        },

        // Internal method to create a model's ties to a collection.
        _addReference: function (model, options) {
            this._byId[model.cid] = model;
            if (model.id != null) this._byId[model.id] = model;
            if (!model.collection) model.collection = this;
            model.on('all', this._onModelEvent, this);
        },

        // Internal method to sever a model's ties to a collection.
        _removeReference: function (model, options) {
            if (this === model.collection) delete model.collection;
            model.off('all', this._onModelEvent, this);
        },

        // Internal method called every time a model in the set fires an event.
        // Sets need to update their indexes when models change ids. All other
        // events simply proxy through. "add" and "remove" events that originate
        // in other collections are ignored.
        _onModelEvent: function (event, model, collection, options) {
            if ((event === 'add' || event === 'remove') && collection !== this) return;
            if (event === 'destroy') this.remove(model, options);
            if (model && event === 'change:' + model.idAttribute) {
                delete this._byId[model.previous(model.idAttribute)];
                if (model.id != null) this._byId[model.id] = model;
            }
            this.trigger.apply(this, arguments);
        }

    });

    // Underscore methods that we want to implement on the Collection.
    // 90% of the core usefulness of Backbone Collections is actually implemented
    // right here:
    var methods = ['forEach', 'each', 'map', 'collect', 'reduce', 'foldl',
      'inject', 'reduceRight', 'foldr', 'find', 'detect', 'filter', 'select',
      'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke',
      'max', 'min', 'toArray', 'size', 'first', 'head', 'take', 'initial', 'rest',
      'tail', 'drop', 'last', 'without', 'difference', 'indexOf', 'shuffle',
      'lastIndexOf', 'isEmpty', 'chain', 'sample'];

    // Mix in each Underscore method as a proxy to `Collection#models`.
    _.each(methods, function (method) {
        Collection.prototype[method] = function () {
            var args = slice.call(arguments);
            args.unshift(this.models);
            return _[method].apply(_, args);
        };
    });

    // Underscore methods that take a property name as an argument.
    var attributeMethods = ['groupBy', 'countBy', 'sortBy', 'indexBy'];

    // Use attributes instead of properties.
    _.each(attributeMethods, function (method) {
        Collection.prototype[method] = function (value, context) {
            var iterator = _.isFunction(value) ? value : function (model) {
                return model.get(value);
            };
            return _[method](this.models, iterator, context);
        };
    });

    // Backbone.View
    // -------------

    // Backbone Views are almost more convention than they are actual code. A View
    // is simply a JavaScript object that represents a logical chunk of UI in the
    // DOM. This might be a single item, an entire list, a sidebar or panel, or
    // even the surrounding frame which wraps your whole app. Defining a chunk of
    // UI as a **View** allows you to define your DOM events declaratively, without
    // having to worry about render order ... and makes it easy for the view to
    // react to specific changes in the state of your models.

    // Creating a Backbone.View creates its initial element outside of the DOM,
    // if an existing element is not provided...
    var View = Backbone.View = function (options) {
        this.cid = _.uniqueId('view');
        options || (options = {});
        _.extend(this, _.pick(options, viewOptions));
        this._ensureElement();
        this.initialize.apply(this, arguments);
        this.delegateEvents();
    };

    // Cached regex to split keys for `delegate`.
    var delegateEventSplitter = /^(\S+)\s*(.*)$/;

    // List of view options to be merged as properties.
    var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];

    // Set up all inheritable **Backbone.View** properties and methods.
    _.extend(View.prototype, Events, {

        // The default `tagName` of a View's element is `"div"`.
        tagName: 'div',

        // jQuery delegate for element lookup, scoped to DOM elements within the
        // current view. This should be preferred to global lookups where possible.
        $: function (selector) {
            return this.$el.find(selector);
        },

        // Initialize is an empty function by default. Override it with your own
        // initialization logic.
        initialize: function () { },

        // **render** is the core function that your view should override, in order
        // to populate its element (`this.el`), with the appropriate HTML. The
        // convention is for **render** to always return `this`.
        render: function () {
            return this;
        },

        // Remove this view by taking the element out of the DOM, and removing any
        // applicable Backbone.Events listeners.
        remove: function () {
            this.$el.remove();
            this.stopListening();
            return this;
        },

        // Change the view's element (`this.el` property), including event
        // re-delegation.
        setElement: function (element, delegate) {
            if (this.$el) this.undelegateEvents();
            this.$el = element instanceof Backbone.$ ? element : Backbone.$(element);
            this.el = this.$el[0];
            if (delegate !== false) this.delegateEvents();
            return this;
        },

        // Set callbacks, where `this.events` is a hash of
        //
        // *{"event selector": "callback"}*
        //
        //     {
        //       'mousedown .title':  'edit',
        //       'click .button':     'save',
        //       'click .open':       function(e) { ... }
        //     }
        //
        // pairs. Callbacks will be bound to the view, with `this` set properly.
        // Uses event delegation for efficiency.
        // Omitting the selector binds the event to `this.el`.
        // This only works for delegate-able events: not `focus`, `blur`, and
        // not `change`, `submit`, and `reset` in Internet Explorer.
        delegateEvents: function (events) {
            if (!(events || (events = _.result(this, 'events')))) return this;
            this.undelegateEvents();
            for (var key in events) {
                var method = events[key];
                if (!_.isFunction(method)) method = this[events[key]];
                if (!method) continue;

                var match = key.match(delegateEventSplitter);
                var eventName = match[1], selector = match[2];
                method = _.bind(method, this);
                eventName += '.delegateEvents' + this.cid;
                if (selector === '') {
                    this.$el.on(eventName, method);
                } else {
                    this.$el.on(eventName, selector, method);
                }
            }
            return this;
        },

        // Clears all callbacks previously bound to the view with `delegateEvents`.
        // You usually don't need to use this, but may wish to if you have multiple
        // Backbone views attached to the same DOM element.
        undelegateEvents: function () {
            this.$el.off('.delegateEvents' + this.cid);
            return this;
        },

        // Ensure that the View has a DOM element to render into.
        // If `this.el` is a string, pass it through `$()`, take the first
        // matching element, and re-assign it to `el`. Otherwise, create
        // an element from the `id`, `className` and `tagName` properties.
        _ensureElement: function () {
            if (!this.el) {
                var attrs = _.extend({}, _.result(this, 'attributes'));
                if (this.id) attrs.id = _.result(this, 'id');
                if (this.className) attrs['class'] = _.result(this, 'className');
                var $el = Backbone.$('<' + _.result(this, 'tagName') + '>').attr(attrs);
                this.setElement($el, false);
            } else {
                this.setElement(_.result(this, 'el'), false);
            }
        }

    });

    // Backbone.sync
    // -------------

    // Override this function to change the manner in which Backbone persists
    // models to the server. You will be passed the type of request, and the
    // model in question. By default, makes a RESTful Ajax request
    // to the model's `url()`. Some possible customizations could be:
    //
    // * Use `setTimeout` to batch rapid-fire updates into a single request.
    // * Send up the models as XML instead of JSON.
    // * Persist models via WebSockets instead of Ajax.
    //
    // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
    // as `POST`, with a `_method` parameter containing the true HTTP method,
    // as well as all requests with the body as `application/x-www-form-urlencoded`
    // instead of `application/json` with the model in a param named `model`.
    // Useful when interfacing with server-side languages like **PHP** that make
    // it difficult to read the body of `PUT` requests.
    Backbone.sync = function (method, model, options) {
        var type = methodMap[method];

        // Default options, unless specified.
        _.defaults(options || (options = {}), {
            emulateHTTP: Backbone.emulateHTTP,
            emulateJSON: Backbone.emulateJSON
        });

        // Default JSON-request options.
        var params = { type: type, dataType: 'json' };

        // Ensure that we have a URL.
        if (!options.url) {
            params.url = _.result(model, 'url') || urlError();
        }

        // Ensure that we have the appropriate request data.
        if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
            params.contentType = 'application/json';
            params.data = JSON.stringify(options.attrs || model.toJSON(options));
        }

        // For older servers, emulate JSON by encoding the request into an HTML-form.
        if (options.emulateJSON) {
            params.contentType = 'application/x-www-form-urlencoded';
            params.data = params.data ? { model: params.data } : {};
        }

        // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
        // And an `X-HTTP-Method-Override` header.
        if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
            params.type = 'POST';
            if (options.emulateJSON) params.data._method = type;
            var beforeSend = options.beforeSend;
            options.beforeSend = function (xhr) {
                xhr.setRequestHeader('X-HTTP-Method-Override', type);
                if (beforeSend) return beforeSend.apply(this, arguments);
            };
        }

        // Don't process data on a non-GET request.
        if (params.type !== 'GET' && !options.emulateJSON) {
            params.processData = false;
        }

        // If we're sending a `PATCH` request, and we're in an old Internet Explorer
        // that still has ActiveX enabled by default, override jQuery to use that
        // for XHR instead. Remove this line when jQuery supports `PATCH` on IE8.
        if (params.type === 'PATCH' && noXhrPatch) {
            params.xhr = function () {
                return new ActiveXObject("Microsoft.XMLHTTP");
            };
        }

        // Make the request, allowing the user to override any Ajax options.
        var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
        model.trigger('request', model, xhr, options);
        return xhr;
    };

    var noXhrPatch =
      typeof window !== 'undefined' && !!window.ActiveXObject &&
        !(window.XMLHttpRequest && (new XMLHttpRequest).dispatchEvent);

    // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
    var methodMap = {
        'create': 'POST',
        'update': 'PUT',
        'patch': 'PATCH',
        'delete': 'DELETE',
        'read': 'GET'
    };

    // Set the default implementation of `Backbone.ajax` to proxy through to `$`.
    // Override this if you'd like to use a different library.
    Backbone.ajax = function () {
        return Backbone.$.ajax.apply(Backbone.$, arguments);
    };

    // Backbone.Router
    // ---------------

    // Routers map faux-URLs to actions, and fire events when routes are
    // matched. Creating a new one sets its `routes` hash, if not set statically.
    var Router = Backbone.Router = function (options) {
        options || (options = {});
        if (options.routes) this.routes = options.routes;
        this._bindRoutes();
        this.initialize.apply(this, arguments);
    };

    // Cached regular expressions for matching named param parts and splatted
    // parts of route strings.
    var optionalParam = /\((.*?)\)/g;
    var namedParam = /(\(\?)?:\w+/g;
    var splatParam = /\*\w+/g;
    var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;

    // Set up all inheritable **Backbone.Router** properties and methods.
    _.extend(Router.prototype, Events, {

        // Initialize is an empty function by default. Override it with your own
        // initialization logic.
        initialize: function () { },

        // Manually bind a single named route to a callback. For example:
        //
        //     this.route('search/:query/p:num', 'search', function(query, num) {
        //       ...
        //     });
        //
        route: function (route, name, callback) {
            if (!_.isRegExp(route)) route = this._routeToRegExp(route);
            if (_.isFunction(name)) {
                callback = name;
                name = '';
            }
            if (!callback) callback = this[name];
            var router = this;
            Backbone.history.route(route, function (fragment) {
                var args = router._extractParameters(route, fragment);
                router.execute(callback, args);
                router.trigger.apply(router, ['route:' + name].concat(args));
                router.trigger('route', name, args);
                Backbone.history.trigger('route', router, name, args);
            });
            return this;
        },

        // Execute a route handler with the provided parameters.  This is an
        // excellent place to do pre-route setup or post-route cleanup.
        execute: function (callback, args) {
            if (callback) callback.apply(this, args);
        },

        // Simple proxy to `Backbone.history` to save a fragment into the history.
        navigate: function (fragment, options) {
            Backbone.history.navigate(fragment, options);
            return this;
        },

        // Bind all defined routes to `Backbone.history`. We have to reverse the
        // order of the routes here to support behavior where the most general
        // routes can be defined at the bottom of the route map.
        _bindRoutes: function () {
            if (!this.routes) return;
            this.routes = _.result(this, 'routes');
            var route, routes = _.keys(this.routes);
            while ((route = routes.pop()) != null) {
                this.route(route, this.routes[route]);
            }
        },

        // Convert a route string into a regular expression, suitable for matching
        // against the current location hash.
        _routeToRegExp: function (route) {
            route = route.replace(escapeRegExp, '\\$&')
                         .replace(optionalParam, '(?:$1)?')
                         .replace(namedParam, function (match, optional) {
                             return optional ? match : '([^/?]+)';
                         })
                         .replace(splatParam, '([^?]*?)');
            return new RegExp('^' + route + '(?:\\?(.*))?$');
        },

        // Given a route, and a URL fragment that it matches, return the array of
        // extracted decoded parameters. Empty or unmatched parameters will be
        // treated as `null` to normalize cross-browser behavior.
        _extractParameters: function (route, fragment) {
            var params = route.exec(fragment).slice(1);
            return _.map(params, function (param, i) {
                // Don't decode the search params.
                if (i === params.length - 1) return param || null;
                return param ? decodeURIComponent(param) : null;
            });
        }

    });

    // Backbone.History
    // ----------------

    // Handles cross-browser history management, based on either
    // [pushState](http://diveintohtml5.info/history.html) and real URLs, or
    // [onhashchange](https://developer.mozilla.org/en-US/docs/DOM/window.onhashchange)
    // and URL fragments. If the browser supports neither (old IE, natch),
    // falls back to polling.
    var History = Backbone.History = function () {
        this.handlers = [];
        _.bindAll(this, 'checkUrl');

        // Ensure that `History` can be used outside of the browser.
        if (typeof window !== 'undefined') {
            this.location = window.location;
            this.history = window.history;
        }
    };

    // Cached regex for stripping a leading hash/slash and trailing space.
    var routeStripper = /^[#\/]|\s+$/g;

    // Cached regex for stripping leading and trailing slashes.
    var rootStripper = /^\/+|\/+$/g;

    // Cached regex for detecting MSIE.
    var isExplorer = /msie [\w.]+/;

    // Cached regex for removing a trailing slash.
    var trailingSlash = /\/$/;

    // Cached regex for stripping urls of hash.
    var pathStripper = /#.*$/;

    // Has the history handling already been started?
    History.started = false;

    // Set up all inheritable **Backbone.History** properties and methods.
    _.extend(History.prototype, Events, {

        // The default interval to poll for hash changes, if necessary, is
        // twenty times a second.
        interval: 50,

        // Are we at the app root?
        atRoot: function () {
            return this.location.pathname.replace(/[^\/]$/, '$&/') === this.root;
        },

        // Gets the true hash value. Cannot use location.hash directly due to bug
        // in Firefox where location.hash will always be decoded.
        getHash: function (window) {
            var match = (window || this).location.href.match(/#(.*)$/);
            return match ? match[1] : '';
        },

        // Get the cross-browser normalized URL fragment, either from the URL,
        // the hash, or the override.
        getFragment: function (fragment, forcePushState) {
            if (fragment == null) {
                if (this._hasPushState || !this._wantsHashChange || forcePushState) {
                    fragment = decodeURI(this.location.pathname + this.location.search);
                    var root = this.root.replace(trailingSlash, '');
                    if (!fragment.indexOf(root)) fragment = fragment.slice(root.length);
                } else {
                    fragment = this.getHash();
                }
            }
            return fragment.replace(routeStripper, '');
        },

        // Start the hash change handling, returning `true` if the current URL matches
        // an existing route, and `false` otherwise.
        start: function (options) {
            if (History.started) throw new Error("Backbone.history has already been started");
            History.started = true;

            // Figure out the initial configuration. Do we need an iframe?
            // Is pushState desired ... is it available?
            this.options = _.extend({ root: '/' }, this.options, options);
            this.root = this.options.root;
            this._wantsHashChange = this.options.hashChange !== false;
            this._wantsPushState = !!this.options.pushState;
            this._hasPushState = !!(this.options.pushState && this.history && this.history.pushState);
            var fragment = this.getFragment();
            var docMode = document.documentMode;
            var oldIE = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));

            // Normalize root to always include a leading and trailing slash.
            this.root = ('/' + this.root + '/').replace(rootStripper, '/');

            if (oldIE && this._wantsHashChange) {
                var frame = Backbone.$('<iframe src="javascript:0" tabindex="-1">');
                this.iframe = frame.hide().appendTo('body')[0].contentWindow;
                this.navigate(fragment);
            }

            // Depending on whether we're using pushState or hashes, and whether
            // 'onhashchange' is supported, determine how we check the URL state.
            if (this._hasPushState) {
                Backbone.$(window).on('popstate', this.checkUrl);
            } else if (this._wantsHashChange && ('onhashchange' in window) && !oldIE) {
                Backbone.$(window).on('hashchange', this.checkUrl);
            } else if (this._wantsHashChange) {
                this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
            }

            // Determine if we need to change the base url, for a pushState link
            // opened by a non-pushState browser.
            this.fragment = fragment;
            var loc = this.location;

            // Transition from hashChange to pushState or vice versa if both are
            // requested.
            if (this._wantsHashChange && this._wantsPushState) {

                // If we've started off with a route from a `pushState`-enabled
                // browser, but we're currently in a browser that doesn't support it...
                if (!this._hasPushState && !this.atRoot()) {
                    this.fragment = this.getFragment(null, true);
                    this.location.replace(this.root + '#' + this.fragment);
                    // Return immediately as browser will do redirect to new url
                    return true;

                    // Or if we've started out with a hash-based route, but we're currently
                    // in a browser where it could be `pushState`-based instead...
                } else if (this._hasPushState && this.atRoot() && loc.hash) {
                    this.fragment = this.getHash().replace(routeStripper, '');
                    this.history.replaceState({}, document.title, this.root + this.fragment);
                }

            }

            if (!this.options.silent) return this.loadUrl();
        },

        // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
        // but possibly useful for unit testing Routers.
        stop: function () {
            Backbone.$(window).off('popstate', this.checkUrl).off('hashchange', this.checkUrl);
            clearInterval(this._checkUrlInterval);
            History.started = false;
        },

        // Add a route to be tested when the fragment changes. Routes added later
        // may override previous routes.
        route: function (route, callback) {
            this.handlers.unshift({ route: route, callback: callback });
        },

        // Checks the current URL to see if it has changed, and if it has,
        // calls `loadUrl`, normalizing across the hidden iframe.
        checkUrl: function (e) {
            var current = this.getFragment();
            if (current === this.fragment && this.iframe) {
                current = this.getFragment(this.getHash(this.iframe));
            }
            if (current === this.fragment) return false;
            if (this.iframe) this.navigate(current);
            this.loadUrl();
        },

        // Attempt to load the current URL fragment. If a route succeeds with a
        // match, returns `true`. If no defined routes matches the fragment,
        // returns `false`.
        loadUrl: function (fragment) {
            fragment = this.fragment = this.getFragment(fragment);
            return _.any(this.handlers, function (handler) {
                if (handler.route.test(fragment)) {
                    handler.callback(fragment);
                    return true;
                }
            });
        },

        // Save a fragment into the hash history, or replace the URL state if the
        // 'replace' option is passed. You are responsible for properly URL-encoding
        // the fragment in advance.
        //
        // The options object can contain `trigger: true` if you wish to have the
        // route callback be fired (not usually desirable), or `replace: true`, if
        // you wish to modify the current URL without adding an entry to the history.
        navigate: function (fragment, options) {
            if (!History.started) return false;
            if (!options || options === true) options = { trigger: !!options };

            var url = this.root + (fragment = this.getFragment(fragment || ''));

            // Strip the hash for matching.
            fragment = fragment.replace(pathStripper, '');

            if (this.fragment === fragment) return;
            this.fragment = fragment;

            // Don't include a trailing slash on the root.
            if (fragment === '' && url !== '/') url = url.slice(0, -1);

            // If pushState is available, we use it to set the fragment as a real URL.
            if (this._hasPushState) {
                this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

                // If hash changes haven't been explicitly disabled, update the hash
                // fragment to store history.
            } else if (this._wantsHashChange) {
                this._updateHash(this.location, fragment, options.replace);
                if (this.iframe && (fragment !== this.getFragment(this.getHash(this.iframe)))) {
                    // Opening and closing the iframe tricks IE7 and earlier to push a
                    // history entry on hash-tag change.  When replace is true, we don't
                    // want this.
                    if (!options.replace) this.iframe.document.open().close();
                    this._updateHash(this.iframe.location, fragment, options.replace);
                }

                // If you've told us that you explicitly don't want fallback hashchange-
                // based history, then `navigate` becomes a page refresh.
            } else {
                return this.location.assign(url);
            }
            if (options.trigger) return this.loadUrl(fragment);
        },

        // Update the hash location, either replacing the current entry, or adding
        // a new one to the browser history.
        _updateHash: function (location, fragment, replace) {
            if (replace) {
                var href = location.href.replace(/(javascript:|#).*$/, '');
                location.replace(href + '#' + fragment);
            } else {
                // Some browsers require that `hash` contains a leading #.
                location.hash = '#' + fragment;
            }
        }

    });

    // Create the default Backbone.history.
    Backbone.history = new History;

    // Helpers
    // -------

    // Helper function to correctly set up the prototype chain, for subclasses.
    // Similar to `goog.inherits`, but uses a hash of prototype properties and
    // class properties to be extended.
    var extend = function (protoProps, staticProps) {
        var parent = this;
        var child;

        // The constructor function for the new subclass is either defined by you
        // (the "constructor" property in your `extend` definition), or defaulted
        // by us to simply call the parent's constructor.
        if (protoProps && _.has(protoProps, 'constructor')) {
            child = protoProps.constructor;
        } else {
            child = function () { return parent.apply(this, arguments); };
        }

        // Add static properties to the constructor function, if supplied.
        _.extend(child, parent, staticProps);

        // Set the prototype chain to inherit from `parent`, without calling
        // `parent`'s constructor function.
        var Surrogate = function () { this.constructor = child; };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate;

        // Add prototype properties (instance properties) to the subclass,
        // if supplied.
        if (protoProps) _.extend(child.prototype, protoProps);

        // Set a convenience property in case the parent's prototype is needed
        // later.
        child.__super__ = parent.prototype;

        return child;
    };

    // Set up inheritance for the model, collection, router, view and history.
    Model.extend = Collection.extend = Router.extend = View.extend = History.extend = extend;

    // Throw an error when a URL is needed, and none is supplied.
    var urlError = function () {
        throw new Error('A "url" property or function must be specified');
    };

    // Wrap an optional error callback with a fallback error event.
    var wrapError = function (model, options) {
        var error = options.error;
        options.error = function (resp) {
            if (error) error(model, resp, options);
            model.trigger('error', model, resp, options);
        };
    };

    return Backbone;

}));