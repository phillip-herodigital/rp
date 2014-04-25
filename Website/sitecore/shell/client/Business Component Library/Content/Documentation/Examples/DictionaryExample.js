define(["sitecore"], function (_sc) {
  var model = Sitecore.Definitions.Models.ControlModel;
  var view = Sitecore.Definitions.Views.ControlView.extend({
    initialize: function () {
      this._super();
      if (this.app && this.app.Dictionary1 && this.app.Dictionary2) {
        var app = this.app;
        var values = app.Dictionary1.attributes;
        var data = [];
        _.each(_.pairs(values), function (value) {
          if (value[0] != 'type' && value[0] != 'name') {
            data.push({
              itemId: '',
              $displayName: value[0]
            });
            data.push({
              itemId: '',
              $displayName: value[1]
            });
          }
        });
        app.ListBox1.set('items', data);
        
        values = app.Dictionary2.attributes;
        data = [];
        _.each(_.pairs(values), function (value) {
          if (value[0] != 'type' && value[0] != 'name') {
            data.push({
              itemId: '',
              $displayName: value[0]
            });
            data.push({
              itemId: '',
              $displayName: value[1]
            });
          }
        });
        app.ListBox2.set('items', data);
      }
    }
  });
  _sc.Factories.createComponent("InitControls", model, view, ".sc-dictionary-example");
});