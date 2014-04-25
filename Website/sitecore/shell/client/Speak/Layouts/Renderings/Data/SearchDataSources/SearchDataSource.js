define(["sitecore"], function (Sitecore) {
  "use strict";

  var model = Sitecore.Definitions.Models.ComponentModel.extend(
    {
      initialize: function (attributes) {
        this._super();

        this.set("text", "");
        this.set("searchConfig", null);
        this.set("rootItemId", null);
        this.set("pageSize", 0);
        this.set("pageIndex", 0);
        this.set("totalItemsCount", 0);
        this.set("items", null);
        this.set("selectedFacets", []);
        this.set("facets", []);
        this.set("facetsRootItemId", null);
        this.set("formatting", "");
        this.set("sorting", "");
        this.set("language", "");
        this.set("database", "");
        this.set("pagingMode", "appending");
        this.set("isBusy", false);
        this.set("hasItems", false);
        this.set("hasNoItems", true);
        this.set("hasMoreItems", false);

        this.on("change:searchType change:text change:pageSize change:pageIndex change:selectedFacets change:rootItemId change:searchConfig change:sorting", this.refresh, this);

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
        this.lastPage++;
        this.getItems();
      },

      getItems: function () {
        if (!this.isReady) {
          return;
        }

        var search = this.get("text"),
          options = this.getOptions(),
          url,
          selectedFacets;

        if (!search && !options.root && !options.searchConfig) {
          return;
        }

        url = search || "";

        selectedFacets = this.get("selectedFacets");
        if (selectedFacets != null && selectedFacets.length > 0) {
          url = this.getFacets(url, selectedFacets);
        }

        var databaseUri = new Sitecore.Definitions.Data.DatabaseUri(this.get("database"));
        var database = new Sitecore.Definitions.Data.Database(databaseUri);

        this.pendingRequests++;
        this.set("isBusy", true);

        _sc.debug("SearchDataSource request: '", url, "', options:", options);

        database.search(url, $.proxy(this.completed, this), options);
      },

      getFacets: function (url, selectedFacets) {
        var result = "";

        var facets = {};
        _.each(selectedFacets, function (facet) {
          if (!facets[facet.name]) {
            facets[facet.name] = [];
          }

          facets[facet.name].push(facet.value);
        }, this);

        _.each(_.keys(facets), function (name) {
          var s = "";
          _.each(facets[name], function (i) {
            s += (s != "" ? " OR " : "") + i;
          }, this);

          result += (result != "" ? " AND " : "") + "(" + s + ")";
        }, this);

        if (result != "") {
          url += (url !== "" ? " AND " : "") + result;
        }

        return url;
      },

      getOptions: function () {
        var options = {}, fields;
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

        fields = this.get("fields");
        if (fields && fields.length > 0) {
          options.fields = fields;
        }
        else {
          options.payLoad = "full";
        }

        options.root = this.get("rootItemId");
        options.language = this.get("language");
        options.facetsRootItemId = this.get("facetsRootItemId");
        options.searchConfig = this.get("searchConfig");

        if (this.get("formatting") != "") {
          options.formatting = this.get("formatting");
        }

        if (this.get("sorting") != "") {
          options.sorting = this.get("sorting");
        }

        return options;
      },

      completed: function (items, totalCount, result) {
        _sc.debug("SearchDataSource received: ", result);
        
        // logic for parsing dates when formatting==$send_localized_dates 
        if (this.get("formatting") == "$send_localized_dates") {
          _.each(items, function (item) {
            var formatedFields = [];
            _.each(item.$fields, function (field) {
              if (field.type == "datetime") {
                formatedFields[field.fieldName] = {
                  type: field.type,
                  formattedValue: field.formattedValue,
                  longDateValue: field.longDateValue,
                  shortDateValue: field.shortDateValue
                };
              }
            });
            //extend item with formated fields
            item.$formatedFields = formatedFields;
          });
          
        }

        if (this.get("pagingMode") == "appending" && this.lastPage > 0) {
          items = this.get("items").concat(items);
          this.set("items", items, { force: true });
        }
        else {
          this.set("items", items, { force: true });
          this.set("facets", result.facets ? result.facets : []);
        }

        this.set("totalItemsCount", totalCount);
        this.set("hasItems", items && items.length > 0);
        this.set("hasNoItems", !items || items.length === 0);
        this.set("hasMoreItems", items.length < totalCount);

        this.pendingRequests--;
        if (this.pendingRequests <= 0) {
          this.set("isBusy", false);
          this.pendingRequests = 0;
        }
      }
    }
  );

  var view = Sitecore.Definitions.Views.ComponentView.extend(
    {
      listen: _.extend({}, Sitecore.Definitions.Views.ComponentView.prototype.listen, {
        "refresh:$this": "refresh",
        "next:$this": "next"
      }),

      initialize: function (options) {
        this._super();

        var pageIndex, pageSize, fields;

        pageSize = parseInt(this.$el.attr("data-sc-pagesize"), 10) || 0;
        this.model.set("pageSize", pageSize);

        pageIndex = parseInt(this.$el.attr("data-sc-pageindex"), 10) || 0;
        this.model.set("pageIndex", pageIndex);

        if (this.$el.is("[data-sc-fields]")) {
          fields = $.parseJSON(this.$el.attr("data-sc-fields"));
          this.model.set("fields", fields);
        }
        else {
          this.model.set("fields", null);
        }

        this.model.set("language", this.$el.attr("data-sc-language"));
        this.model.set("database", this.$el.attr("data-sc-database") || "core");
        this.model.set("facetsRootItemId", this.$el.attr("data-sc-facets-root-id"));
        this.model.set("formatting", this.$el.attr("data-sc-formatting"));
        this.model.set("sorting", this.$el.attr("data-sc-sorting"));
        this.model.set("rootItemId", this.$el.attr("data-sc-root-id"));
        this.model.set("text", this.$el.attr("data-sc-text") || "");
        this.model.set("searchConfig", this.$el.attr("data-sc-searchconfig"));
        this.model.set("pagingMode", this.$el.attr("data-sc-pagingmode") || "appending"); // or paged

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

  Sitecore.Factories.createComponent("SearchDataSource", model, view, "script[type='text/x-sitecore-searchdatasource']");
});