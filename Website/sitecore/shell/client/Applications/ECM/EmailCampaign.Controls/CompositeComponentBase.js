define(["sitecore"], function (sitecore) {
  var model = sitecore.Definitions.Models.ControlModel.extend({
    initialize: function () {
      this._super();
    }
  });

  var view = sitecore.Definitions.Views.ControlView.extend({
    children: {},
    childComponents: [],

    initialize: function () {
      this._super();
      this.id = this.$el.data("sc-id");
      this._findChilds();
    },

    _findChilds: function() {
      _.each(this.childComponents, function (child) {
        this.children[child] = this.app[this.id + child];
      }, this);
    },

    getChild: function(name) {
      return this.children[name];
    }
  });

  return {
    model: model,
    view: view
  };
});