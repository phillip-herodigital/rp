define(["sitecore"], function (sitecore) {
  "use strict";

  var model = sitecore.Definitions.Models.ComponentModel.extend(
    {
      initialize: function () {
        this._super();

        this.set("results", null);

        this.set("data", "");
        this.set("language", "");
        this.set("messageId", "");
        this.set("pageIndex", 0);
        this.set("pageSize", 0);
        this.set("reportType", "");
        this.set("search", "");
        this.set("sorting", "");

        this.set("pagingMode", "appending");

        this.set("hasResults", false);
        this.set("hasMoreResults", false);
        this.set("isBusy", false);

        this.lastPage = 0;
        this.pendingRequests = 0;
        this.isReady = false;

        this.on("change:language change:messageId change:pageIndex change:pageSize change:request change:search change:sorting", this.refresh, this);
      },

      success: function (data) {
        sitecore.debug(data);

        if (data.error) {
          console.log(data);
          return;
        }

        if (this.get("pagingMode") == "appending" && this.lastPage > 0) {
          this.set("results", this.get("results").concat(data.results));
        } else {
          this.set("results", data.results);
        }

        if (this.get("results")) {
          this.set("hasResults", true);
          this.set("hasMoreResults", this.get("results").length < data.totalCount);
        } else {
          this.set("hasResults", false);
          this.set("hasMoreResults", false);
        }

        this.pendingRequests--;
        if (this.pendingRequests <= 0) {
          this.set("isBusy", false);
          this.pendingRequests = 0;
        }

        this.trigger("updated");
      },

      error: function (args) {
        console.log("ERROR");

        if (args && args.status === 403) {
          console.error("Not logged in, will reload page");
          window.top.location.reload(true);
        }

        this.set("results ", null);
        this.set("hasResults", false);
        this.set("hasMoreResults", false);

        this.pendingRequests--;
        if (this.pendingRequests <= 0) {
          this.set("isBusy", false);
          this.pendingRequests = 0;
        }
      },

      refresh: function () {
        this.lastPage = 0;
        this.set("pageIndex", this.lastPage);

        this.getResults(this.lastPage);
        this.trigger("refreshed");
      },

      next: function () {
        this.lastPage++;
        if (this.get("pagingMode") == "paged") {
          this.set("pageIndex", this.lastPage);
        }

        this.getResults(this.lastPage);
      },

      getResults: function (pageIndex) {
        if (!this.isReady) {
          return;
        }

        if (!this.get("language")) {
          return;
        }

        if (!this.get("messageId")) {
          return;
        }

        var data = { language: this.get("language"), messageId: this.get("messageId"), pageIndex: pageIndex, pageSize: this.get("pageSize"), reportType: this.get("reportType"), search: this.get("search"), sorting: this.get("sorting") };

        var options = {
          url: "/sitecore/api/ssc/EXM/Reports",
          data: data,
          type: "POST",
          success: $.proxy(this.success, this),
          error: $.proxy(this.error, this)
        };

        this.pendingRequests++;
        this.set("isBusy", true);

        $.ajax(options);
      },
    }
  );

  var view = sitecore.Definitions.Views.ComponentView.extend(
    {
      listen: window._.extend({}, sitecore.Definitions.Views.ComponentView.prototype.listen, {
        "refresh:$this": "refresh",
        "next:$this": "next"
      }),

      initialize: function () {
        this._super();

        this.model.set("data", this.$el.attr("data-sc-data"));
        this.model.set("language", this.$el.attr("data-sc-language"));
        this.model.set("messageId", this.$el.attr("data-sc-messageid"));
        this.model.set("pageIndex", parseInt(this.$el.attr("data-sc-pageindex"), 10) || 0);
        this.model.set("pageSize", parseInt(this.$el.attr("data-sc-pagesize"), 10) || 0);
        this.model.set("reportType", this.$el.attr("data-sc-reporttype"));
        this.model.set("search", this.$el.attr("data-sc-search"));
        this.model.set("sorting", this.$el.attr("data-sc-sorting"));

        this.model.set("pagingMode", this.$el.attr("data-sc-pagingmode") || "appending"); // or paged
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

  sitecore.Factories.createComponent("ReportsDataSource", model, view, "script[type='text/x-sitecore-ecm-reportsdatasource']");
});
