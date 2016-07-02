define(["jquery", "sitecore"], function ($, Sitecore) {
    "use strict";
  var model = Sitecore.Definitions.Models.ComponentModel.extend(
    {
      initialize: function (attributes) {
        this._super();
        this.set("isBusy", false);
        this.set("pageSize", 0);
        this.set("pageIndex", 0);
        this.on("change:pageSize change:pageIndex", this.refresh, this);
        this.isReady = false;
      },
      refresh: function () {
        this.set("pageIndex", 0);
        this.lastPage = 0;
        this.getActiveUsers();
      },
      next: function () {
        this.lastPage++;
        this.getActiveUsers();
      },
      getActiveUsers: function () {
        if (!this.isReady) {
          return;
        }
        var options = {
          url: "/api/sitecore/DomainAccessGuard/GetActiveSessions?ps=" + this.get("pageSize") + "&pi=" + this.get("pageIndex"),
          type: "GET",
          success: $.proxy(this.success, this),
          error: $.proxy(this.error, this)
        };
        this.pendingRequests++;
        this.set("isBusy", true);
        $.ajax(options);
      },
      success: function (data) {
        if (this.lastPage > 0)
          this.set("users", this.get("users").concat(data.messages));
        else
          this.set("users", data);
        this.pendingRequests--;
        if (this.pendingRequests <= 0) {
          this.set("isBusy", false);
          this.pendingRequests = 0;
        }
        console.log(data);
      },
      error: function () {
        this.set("users", null);
        this.pendingRequests--;
        if (this.pendingRequests <= 0) {
          this.set("isBusy", false);
          this.pendingRequests = 0;
        }
      },
    }
  );

  var view = Sitecore.Definitions.Views.ComponentView.extend(
    {
      listen: _.extend({}, Sitecore.Definitions.Views.ComponentView.prototype.listen, {
        "refresh:$this": "refresh",
        "next:$this": "next"
      }),

      initialize: function () {
        this._super();
        this.model.set("users", null);
        var pageSize;
        pageSize = parseInt(this.$el.attr("data-sc-pagesize"), 10) || 0;
        this.model.set("pageSize", pageSize);
      },

      afterRender: function () {
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
  Sitecore.Factories.createComponent("ActiveUsersDataSource", model, view, ".sc-ActiveUsersDataSource");
});