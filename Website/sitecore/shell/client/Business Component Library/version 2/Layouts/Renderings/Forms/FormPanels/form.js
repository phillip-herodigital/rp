(function (speak) {

  speak.component([], function () {

    var intializeBinding = function () {

      if (!this.BindingConfiguration) {
        return;
      }
      var bindingConfiguation = JSON.parse(this.BindingConfiguration);

      var speakBindConfig = _.object(_.map(bindingConfiguation, function (num, key) {
          return [key, this.id + "." + num];
      }, this));

      var bindableData = _.object(_.map(bindingConfiguation, function (num, key) {
            var parts = num.split(".");
            return [key, this[parts[0]].get(parts[1])];
      }, this));

      this.FormData = speak.bindable(bindableData);
      rebind = rebind.bind(this, this.app, speakBindConfig);
      rebind(this.FormData);
    },

    rebind = function (app, config, bindableData) {
      var cleanData = getBindingConfigProperties.call(this, bindableData);
      speak.module("bindings").applyBindings(bindableData, config, app);
      this.setFormData(cleanData);
    },

    getBindingConfigProperties = function (bindableData) {
      return _.pick(bindableData, _.keys(JSON.parse(this.BindingConfiguration)));
    },

    disableDefaultFormSubmitOnEnter = function (e) {
      if (e.keyCode === 13) {
        e.preventDefault();
      }
    };

    return {
      initialized: function () {
        intializeBinding.call(this);
        this.on("change:FormData", rebind, this);
        this.el.addEventListener("keydown", disableDefaultFormSubmitOnEnter.bind(this));
      },

      setFormData: function (properties) {
        _.extend(this.FormData, properties);
      },

      getFormData: function () {
        return getBindingConfigProperties.call(this, this.FormData);
      }
    };
  }, "Form");

})(Sitecore.Speak);