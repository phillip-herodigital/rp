define(["jquery", "sitecore"], function($, sitecore) {
  "use strict";

  var model = sitecore.Definitions.Models.ComponentModel.extend(
    {
      initialize: function() {
        this._super();

        this.set("results", null);
        this.set("hasResults", false);
        this.set("hasMoreResults", false);

        this.set("request", "");
        this.set("messageReport", "");
        this.set("messageId", "");
        this.set("language", "");
        this.set("pageIndex", 0);
        this.set("pageSize", 0);
        this.set("pagingMode", "appending");
        this.set("sorting", "");
        this.set("isBusy", false);
        
        this.lastPage = 0;
        this.pendingRequests = 0;
        this.isReady = false;

        this.on("change:messageId change:language change:pageIndex change:pageSize change:sorting", this.refresh, this);
      },

      success: function(data) {
        if (data.error) {
          sitecore.trigger("alertdialog", sitecore.Resources.Dictionary.translate("ECM.AnErrorHasOccurred"));
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
      },

      error: function(args) {
        if (args && args.status === 403) {
          console.error("Not logged in, will reload page");
          window.top.location.reload(true);
        }
        
        sitecore.trigger("alertdialog", sitecore.Resources.Dictionary.translate("ECM.AnErrorHasOccurred"));
        
        this.set("results ", null);
        this.set("hasResults", false);
        this.set("hasMoreResults", false);

        this.pendingRequests--;
        if (this.pendingRequests <= 0) {
          this.set("isBusy", false);
          this.pendingRequests = 0;
        }
      },

      refresh: function() {
        this.lastPage = 0;
        this.set("pageIndex", this.lastPage);
        this.getData(this.lastPage);
      },
      
      next: function() {
        this.lastPage++;
        if (this.get("pagingMode") == "paged") {
          this.set("pageIndex", this.lastPage);
        }

        this.getData(this.lastPage);
      },

      getData: function (pageIndex) {
        if (!this.isReady) {
          return;
        }

        if (!this.get("messageId")) {
          return;
        }
        if (this.get("language") === "0") {
          this.set("language", "");
        }
        var data = {
          type: this.get("messageReport"),
          messageId: this.get("messageId"),
          language: this.get("language"),
          pageIndex: pageIndex,
          pageSize: this.get("pageSize"),
          sorting: this.get("sorting"),
          utcOffset: new Date().getTimezoneOffset()
        };

        var options = {
          url: "/sitecore/api/ssc/" + this.get("request"),
          data: data,
          type: "POST",
          success: $.proxy(this.success, this),
          error: $.proxy(this.error, this)
        };

        this.pendingRequests++;
        this.set("isBusy", true);

        $.ajax(options);
      }
    }
  );

  var view = sitecore.Definitions.Views.ComponentView.extend(
    {
      listen: window._.extend({}, sitecore.Definitions.Views.ComponentView.prototype.listen, {
        "refresh:$this": "refresh",
        "next:$this": "next"
      }),

      initialize: function() {
        this._super();

        this.model.set("request", this.$el.attr("data-sc-request"));
        this.model.set("messageReport", this.$el.attr("data-sc-messagereport"));
        this.model.set("messageId", this.$el.attr("data-sc-messageid"));
        this.model.set("language", this.$el.attr("data-sc-language"));
        this.model.set("pageIndex", parseInt(this.$el.attr("data-sc-pageindex"), 10) || 0);
        this.model.set("pageSize", parseInt(this.$el.attr("data-sc-pagesize"), 10) || 0);
        this.model.set("pagingMode", this.$el.attr("data-sc-pagingmode") || "appending");
        this.model.set("sorting", this.$el.attr("data-sc-sorting"));
      },

      beforeRender: function() {
        this.model.isReady = true;
        this.refresh();
      },

      refresh: function() {
        this.model.refresh();
      },

      next: function() {
        this.model.next();
      }
    }
  );

  sitecore.Factories.createComponent("MessageReportDataSource", model, view, "script[type='text/x-sitecore-ecm-messagereportdatasource']");
});