define(["jquery", "sitecore"], function ($, sitecore) {
  "use strict";

  var model = sitecore.Definitions.Models.ComponentModel.extend(
    {
      initialize: function () {
        this._super();

        this.set("messages", null);

        this.set("data", "");
        this.set("managerRootId", "");
        this.set("messageId", "");
        this.set("messageListType", "");
        this.set("pageIndex", 0);
        this.set("pageSize", 0);
        this.set("request", "");
        this.set("seach", "");
        this.set("sorting", "");

        this.set("pagingMode", "appending");

        this.set("hasMessages", false);
        this.set("hasMoreMessages", false);
        this.set("isBusy", false);

        this.lastPage = 0;
        this.pendingRequests = 0;
        this.isReady = false;
        this.isRefreshLoaded = false;

        this.on("change:managerRootId change:messageListType change:pageIndex change:pageSize change:request change:search change:sorting", this.refresh, this);
      },

      success: function (data) {
        sitecore.debug(data);

        if (data.error) {
          console.log(data);
          this.afterResponse();
          return;
        }

        this.processMessages(data.messages);

        if (this.get("pagingMode") == "appending" && this.lastPage > 0 && !this.isRefreshLoaded) {
          this.set("messages", this.get("messages") ?
            this.get("messages").concat(data.messages) :
            data.messages);
        } else {
          this.set("messages", data.messages);
          this.isRefreshLoaded = false;
        }

        if (this.get("messages")) {
          this.set("hasMessages", true);
          this.set("hasMoreMessages", this.get("messages").length < data.totalCount);
        } else {
          this.set("hasMessages", false);
          this.set("hasMoreMessages", false);
        }

        this.pendingRequests--;
        if (this.pendingRequests <= 0) {
          this.afterResponse();
        }
      },

      processMessages: function (messages) {
          messages = messages || this.get("messages");
          _.each(messages, function (message) {
              message.abTestText = message.hasAbn ?
                sitecore.Resources.Dictionary.translate("ECM.Pages.Recipients.Yes") :
                "";
          });
      },

      error: function (args) {
        if (args && args.status === 403) {
          console.error("Not logged in, will reload page");
          window.top.location.reload(true);
        }

        this.set("messages", null);
        this.set("hasMessages", false);
        this.set("hasMoreMessages", false);

        this.pendingRequests--;
        if (this.pendingRequests <= 0) {
          this.afterResponse();
        }
      },

      afterResponse: function() {
        this.set("isBusy", false);
        this.pendingRequests = 0;
      },

      refresh: function () {
        this.lastPage = 0;
        this.set("pageIndex", this.lastPage);
        if (this.get("managerRootId") !== undefined || this.get("messageId") !== undefined) { //workaround
          this.getMessages(this.lastPage);
        }
      },

      refreshLoaded: function () {

        var pageSize = this.get("pageSize"),
          lastPage = this.lastPage,
          dataSize = pageSize * (lastPage + 1);

        this.isRefreshLoaded = true;

        this.getMessages(0, dataSize);
      },

      next: function () {
        this.lastPage++;
        if (this.get("pagingMode") == "paged") {
          this.set("pageIndex", this.lastPage);
        }

        this.getMessages(this.lastPage);
      },

      getMessages: function (pageIndex, pageSize) {
        if (!this.isReady) {
          return;
        }

        pageSize = pageSize ? pageSize : this.get("pageSize");

        var data = {
          managerRootId: this.get("managerRootId"),
          messageId: this.get("messageId"),
          type: this.get("messageListType"),
          pageIndex: pageIndex,
          pageSize: pageSize,
          search: this.get("search"),
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
        this.model.set("managerRootId", this.$el.attr("data-sc-managerrootid"));
        this.model.set("messageId", this.$el.attr("data-sc-messageid"));
        this.model.set("messageListType", this.$el.attr("data-sc-messagelisttype"));
        this.model.set("pageIndex", parseInt(this.$el.attr("data-sc-pageindex"), 10) || 0);
        this.model.set("pageSize", parseInt(this.$el.attr("data-sc-pagesize"), 10) || 0);
        this.model.set("request", this.$el.attr("data-sc-request"));
        this.model.set("search", this.$el.attr("data-sc-search"));
        this.model.set("sorting", this.$el.attr("data-sc-sorting"));

        this.model.set("pagingMode", this.$el.attr("data-sc-pagingmode") || "appending");
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

  sitecore.Factories.createComponent("MessageDataSource", model, view, "script[type='text/x-sitecore-ecm-messagedatasource']");
});