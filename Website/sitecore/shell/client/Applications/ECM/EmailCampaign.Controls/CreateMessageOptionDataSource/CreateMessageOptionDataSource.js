define(["jquery", "sitecore"], function ($, sitecore) {
  "use strict";

  var model = sitecore.Definitions.Models.ComponentModel.extend(
    {
      initialize: function () {
        this._super();

        this.set("createMessageOptions", null);
        this.set("itemNameValidation", "");

        this.set("managerRootId", "");
        this.set("request", "");
        this.set("database", "");

        this.set("isBusy", false);
        this.isReady = false;

        this.on("change:managerRootId change:request change:database", this.refresh, this);
      },

      success: function (data) {
        sitecore.debug(data);

        if (data.error) {
          console.log(data);
          return;
        }

        this.set("createMessageOptions", data.createMessageOptions);
        this.set("itemNameValidation", data.itemNameValidation);
      },

      error: function (args) {
        console.log("ERROR");
        this.set("createMessageOptions", null);

        if (args && args.status === 403) {
          console.error("Not logged in, will reload page");
          window.top.location.reload(true);
        }
      },

      refresh: function () {
        if (this.isReady) {
          var data = { managerRootId: this.get("managerRootId"), database: this.get("database") };
          var options = {
            url: "/sitecore/api/ssc/" + this.get("request"),
            data: data,
            type: "POST",
            success: $.proxy(this.success, this),
            error: $.proxy(this.error, this)
          };

          $.ajax(options);
        }
      }
    }
  );

  var view = sitecore.Definitions.Views.ComponentView.extend(
    {
      listen: window._.extend({}, sitecore.Definitions.Views.ComponentView.prototype.listen, {
        "refresh:$this": "refresh"
      }),

      initialize: function () {
        this._super();

        this.model.set("managerRootId", this.$el.attr("data-sc-managerrootid"));
        this.model.set("request", this.$el.attr("data-sc-request"));
        this.model.set("database", this.$el.attr("data-sc-database"));
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
    }
  );

  sitecore.Factories.createComponent("CreateMessageOptionDataSource", model, view, "script[type='text/x-sitecore-ecm-createmessageoptiondatasource']");
});
