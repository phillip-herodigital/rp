define(["jquery", "sitecore"], function ($, sitecore) {
  "use strict";

  var model = sitecore.Definitions.Models.ControlModel.extend({
    initialize: function () {
      this._super();
      
      this.set("comboBoxList", null);
      this.set("selectedItem", null);
      this.set("request", "");
      
      this.set("isBusy", false);
      this.isReady = false;

      this.on("change:request", this.refresh, this);
    },
    
    success: function (data) {
      sitecore.debug(data);

      if (data.error) {
        console.log(data);
        return;
      }

      this.set("comboBoxList", data.comboBoxList);

      if (data.selectedItem) {
        this.set("selectedItem", data.selectedItem);
      }
    },

    error: function (args) {
      console.log("ERROR comboBoxList");
      this.set("comboBoxList", null);

      if (args && args.status === 403) {
        console.error("Not logged in, will reload page");
        window.top.location.reload(true);
      }
    },

    refresh: function () {
      if (this.isReady) {
        var options = {
          url: "/sitecore/api/ssc/" + this.get("request"),
          type: "POST",
          success: $.proxy(this.success, this),
          error: $.proxy(this.error, this)
        };

        $.ajax(options);
      }
    },
  });

  var view = sitecore.Definitions.Views.ControlView.extend({
    listen: window._.extend({}, sitecore.Definitions.Views.ComponentView.prototype.listen, {
      "refresh:$this": "refresh",
    }),

    initialize: function () {
      this._super();

      this.model.set("request", this.$el.attr("data-sc-request"));
    },

    beforeRender: function () {
      this.model.isReady = true;
      this.refresh();
    },

    refresh: function () {
      this.model.refresh();
    },

    next: function () {
      this.model.next();
    }
  });

  sitecore.Factories.createComponent("ComboBoxListDataSource", model, view, "script[type='text/x-sitecore-ecm-comboboxlistdatasource']");
});
