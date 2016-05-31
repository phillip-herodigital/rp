define(["sitecore", "backbone"], function (sitecore, backbone) {
  window.exm = window.exm && window.exm.Definitions ? window.exm : { Definitions: {} };

  exm.Definitions.AppBase = sitecore.Definitions.App.extend({
    _super: function () {
      var fn = backbone.Controller.prototype._super.caller, funcName;

      $.each(this, function (propName, prop) {
        if (prop == fn) {
          funcName = propName;
        }
      });

      return this.constructor.__super__[funcName].apply(this, _.rest(arguments));
    },

    setControlsProperties: function () {
      var args = Array.prototype.slice.call(arguments),
        controlNames;

      _.each(args, _.bind(function (arg, index) {
        if ($.type(arg) === 'string' && !index % 2) {
          controlNames = [arg];
        } else if ($.type(arg) === 'array' && !index % 2) {
          controlNames = arg;
        } else if ($.type(arg) === 'object' && controlNames) {
          _.each(controlNames, _.bind(function (controlName) {
            if (this[controlName]) {
              _.each(arg, _.bind(function (value, key) {
                this[controlName].set(key, value);
              }, this));
            }
          }, this));
          controlNames = null;
        }
      }, this));
    }
  });
  return exm.Definitions.AppBase;
});