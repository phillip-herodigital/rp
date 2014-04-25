define(["sitecore"], function (_sc) {
  "use strict";

  var model = Sitecore.Definitions.Models.ComponentModel.extend({
      initialize: function(attributes)
      {
        this._super();

        this.set("query", "");
        this.set("language", "");
        this.set("database", "");
        this.set("pageSize", 0);
        this.set("pageIndex", 0);
        this.set("pageCount", 1);
        this.set("totalItemsCount", 0);
        this.set("items", []);
        this.set("fields", null);
        this.set("isBusy", false);

        this.on("change:query change:pageSize change:pageIndex", this.refresh, this);

        this.pendingRequests = 0;
      },

      refresh: function()
      {
        var query = this.get("query"), options = {}, fields;
        if (!query)
        {
          return;
        }

        var pageSize = this.get("pageSize");
        if (pageSize)
        {
          options.pageSize = pageSize;
          options.page = this.get("pageIndex");
        }

        fields = this.get("fields");
        if (fields && fields.length > 0)
        {
          options.fields = fields;
        }
        else
        {
          options.payLoad = "full";
        }

        var language = this.get("language");
        if (language)
        {
          options.language = language;
        }

        var databaseUri = new Sitecore.Definitions.Data.DatabaseUri(this.get("database"));
        var database = new Sitecore.Definitions.Data.Database(databaseUri);
        
        this.pendingRequests++;
        this.set("isBusy", true);

        database.query(query, $.proxy(this.completed, this), options);
      },

      completed: function(items, totalCount)
      {
        this.set("items", items);
        this.set("totalItemsCount", totalCount);
        var pageSize = this.get("pageSize");
        if (pageSize <= 1)
        {
          this.set("pageCount", 1);
        }

        this.set("pageCount", Math.ceil(totalCount / pageSize));

        this.pendingRequests--;
        if (this.pendingRequests <= 0) {
          this.set("isBusy", false);
          this.pendingRequests = 0;
        }
      }
    }
  );

  var view = Sitecore.Definitions.Views.ComponentView.extend({
      initialize: function(options)
      {
        this._super();

        var pageIndex, pageSize, fields;

        pageIndex = parseInt(this.$el.attr("data-sc-pageindex")) || 0;
        this.model.set("pageIndex", pageIndex);

        pageSize = parseInt(this.$el.attr("data-sc-pagesize")) || 0;
        this.model.set("pageSize", pageSize);
        
        if (this.$el.is("[data-sc-fields]"))
        {
          fields = $.parseJSON(this.$el.attr("data-sc-fields"));
          this.model.set("fields", fields);
        }
        else
        {
          this.model.set("fields", null);
        }

        this.model.set("items", []);
        
        this.model.set("language", this.$el.attr("data-sc-language"));
        this.model.set("database", this.$el.attr("data-sc-database") || "master");
        this.model.set("query", this.$el.attr("data-sc-query") || "");
      }
    }
  );

  _sc.Factories.createComponent("QueryDataSource", model, view, "script[type='text/x-sitecore-querydatasource']");
});