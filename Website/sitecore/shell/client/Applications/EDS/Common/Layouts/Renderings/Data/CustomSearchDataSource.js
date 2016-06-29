define(["sitecore"], function (Sitecore) {
  "use strict";

  var model = Sitecore.Definitions.Models.ComponentModel.extend(
    {
      initialize: function (attributes) {
        this._super();

        this.set("url", null);
        this.set("text", null);
        this.set("pageSize", 10);
        this.set("pageIndex", 0);
        this.set("totalItemsCount", 0);
        this.set("items", null);
        this.set("sorting", "");
        this.set("defaultSorting", "");
        this.set("language", "");

        this.set("pagingMode", "appending");
        this.set("isBusy", false);
        this.set("hasItems", false);
        this.set("hasNoItems", true);
        this.set("hasMoreItems", false);

        this.on("change:pageSize change:pageIndex change:searchConfig change:sorting", this.refresh, this);

        this.isReady = false;
        this.pendingRequests = 0;
        this.lastPage = 0;
      },

      refresh: function () {

        this.set("pageIndex", 0);
        this.lastPage = 0;
        this.getItems();
      },

      next: function () {
        if (this.get("isBusy") == true) {
          return;
        }

        this.lastPage++;
        this.getItems();
      },

      getItems: function () {
        if (!this.isReady) {
          return;
        }

        var url = this.get("url"),
            data = this.getOptions();

        if (_.isNull(url) || _.isUndefined(url) || url === "") {
          return;
        }

        this.pendingRequests++;
        this.set("isBusy", true);

        _sc.debug("CustomSearchDataSource request: '", url, "', options:", data);

        var options = {
          url: url,
          data: data,
          success: $.proxy(this.success, this),
          error: $.proxy(this.error, this)
        }

        $.ajax(options);
      },

      getOptions: function () {
        var options = {};

        var pageSize = this.get("pageSize");
        if (pageSize) {
          options.pageSize = pageSize;

          if (this.get("pagingMode") == "appending") {
            options.pageIndex = this.lastPage;
          }
          else {
            options.pageIndex = this.get("pageIndex");
          }
        }

        options.searchExpression = this.get("text") || "";

        var sorting = this.get("sorting") || this.get("defaultSorting");
        if (sorting != "") {
          options.sorting = sorting;
        }
        options.sc_lang = this.get("language") || "";

        options.utcOffset = new Date().getTimezoneOffset();

        return options;
      },

      success: function (data) {
        _sc.debug("CustomSearchDataSource received: ", data);

        var items = data.items;
        _.each(items, function (item) {
            item.itemId = item.itemId || item.ItemId || item.Id || item.id;
        });

        this.trigger("itemsChanging", items);

        if (this.get("pagingMode") === "appending" && this.lastPage > 0) {
          items = this.get("items").concat(items);
        }
        this.set("items", items, { force: true });

        this.set("totalItemsCount", data.totalCount);
        this.set("hasItems", items && items.length > 0);
        this.set("hasNoItems", !items || items.length === 0);
        this.set("hasMoreItems", items.length < data.totalCount);

        this.pendingRequests--;
        if (this.pendingRequests <= 0) {
          var self = this;
          self.set("isBusy", false);

          this.pendingRequests = 0;
        }

        this.trigger("itemsChanged");
      },

      error: function (response) {
        if (response && response.status === 401) {
          _sc.Helpers.session.unauthorized();
          return;
        }

        this.set("items", null);
        this.set("hasItems", false);
        this.set("hasNoItems", true);
        this.set("hasMoreItems", false);

        this.pendingRequests--;
        if (this.pendingRequests <= 0) {
          this.set("isBusy", false);
          this.pendingRequests = 0;
        }
      },
    });

  var view = Sitecore.Definitions.Views.ComponentView.extend(
    {
      listen: _.extend({}, Sitecore.Definitions.Views.ComponentView.prototype.listen, {
        "refresh:$this": "refresh",
        "next:$this": "next"
      }),

      initialize: function (options) {
        this._super();

        var pageIndex, pageSize;

        pageSize = parseInt(this.$el.attr("data-sc-pagesize"), 10) || 10;
        this.model.set("pageSize", pageSize);

        pageIndex = parseInt(this.$el.attr("data-sc-pageindex"), 10) || 0;
        this.model.set("pageIndex", pageIndex);

        this.model.set("sorting", this.$el.attr("data-sc-sorting") || "");
        this.model.set("defaultSorting", this.$el.attr("data-sc-defaultsorting") || "");
        this.model.set("url", this.$el.attr("data-sc-url") || null);
        this.model.set("text", this.$el.attr("data-sc-text") || null);
        this.model.set("pagingMode", this.$el.attr("data-sc-pagingmode") || "appending"); // or paged
        this.model.set("language", this.$el.attr("data-sc-language"));

        this.model.isReady = true;
      },

      afterRender: function () {
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

  Sitecore.Factories.createComponent("CustomSearchDataSource", model, view, "script[type='text/x-sitecore-eds-customsearchdatasource']");
});
