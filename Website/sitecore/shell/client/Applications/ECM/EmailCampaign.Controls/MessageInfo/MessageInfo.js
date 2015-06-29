define(["sitecore"], function (sitecore) {
  var model = sitecore.Definitions.Models.ControlModel.extend({
    initialize: function () {
      this._super();

      this.set("messageId", "");

      var self = this;
      sitecore.on("change:messageContext", function () {
        self.refresh();
      }, this);
    },

    refresh: function () {
      var self = this;

      postServerRequest("ecm.messageinfo.get", { messageId: self.get("messageId"), utcOffset: new Date().getTimezoneOffset() }, function (response) {
        if (!response.error) {
          self.data = response.value;
          self.viewModel.redraw(self.data);
        }
      });
    }
  });

  var view = sitecore.Definitions.Views.ControlView.extend({
    initialize: function () {
      this._super();
    },

    redraw: function (data) {
      var self = this;
      var table = self.$el.find("table");
      $('tr', table).remove();
      $.each(data, function (v, vv) {
        table.append("<tr><td >" + vv.Key + "</td><td class='sc-message-progress-value'>" + vv.Value + "</td></tr>");
      });
    },

    render: function () {
      var self = this;
      $(function () {
        setTimeout(function () {
          self.model.refresh();
          self.render();
        }, 30000);
      });
    }
  });

  sitecore.Factories.createComponent("MessageInfo", model, view, ".sc-MessageInfo");
});