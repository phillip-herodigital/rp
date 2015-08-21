﻿define(["jquery", "sitecore"], function ($, sitecore) {
  "use strict";
  var model = sitecore.Definitions.Models.ControlModel.extend({
    initialize: function () {
      this._super();
      this.set("tokens", null);
      this.set("request", "");
      this.isReady = false;
    },
    success: function (data) {    
      this.set("tokens", data.comboBoxList);
    },
    error: function(args) {
      console.log("ERROR");

      if (args && args.status === 403) {
        console.error("Not logged in, will reload page");
        window.top.location.reload(true);
      }
    },
    refresh: function () {
        this.getTokens();
    },
    getTokens: function () {
      if (!this.isReady) { return; }
      var data = { managerRootId: sessionStorage.managerRootId, isOnlyNames: true };
      var options = {
        url: "/sitecore/api/ssc/" + this.get("request"),
        data: data,
        type: "POST",
        success: $.proxy(this.success, this),
        error: $.proxy(this.error, this)
      };
      this.set("isBusy", true);
      $.ajax(options);
    }
  });

  var view = sitecore.Definitions.Views.ControlView.extend({
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
    }
  });
  sitecore.Factories.createComponent("TokensDataSource", model, view, "script[type='text/x-sitecore-ecm-tokensdatasource']");
});