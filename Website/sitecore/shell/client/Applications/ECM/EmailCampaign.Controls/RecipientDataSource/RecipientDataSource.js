define(["sitecore"], function (sitecore) {
  var model = sitecore.Definitions.Models.ControlModel.extend({
    initialize: function () {
      this._super();

      this.set("recipientLists", []);
      this.set("recipients", []);

      this.set("totalRecipients", 0);

      this.set("messageId", "");
      this.set("recipientListType", "");
      this.set("request", "");
      this.set("recipientRequest", "");

      this.set("pageIndex", 0);
      this.set("pageSize", 0);

      this.set("recipientPageSize", 0);
      this.set("lastRecipientListId", "");
      this.set("lastRecipientIndex", 0);

      this.set("pagingMode", "appending");

      this.set("hasRecipientLists", false);
      this.set("hasMoreRecipientLists", false);
      this.set("hasRecipients", false);
      this.set("hasMoreRecipients", false);
      this.set("loadRecipients", false);
      this.set("isBusy", false);
      this.set("IsRecipientsBusy", false);

      this.set("search", "");

      this.recipientListsToBindRecipients = [];
      this.lastPage = 0;
      this.pendingRequests = 0;
      this.pendingRecipientRequests = 0;
      this.lastRecipientsPage = 0;
      this.isReady = false;

      this.on("change:messageId", this.refresh, this);
      this.on("change:search", this.refreshRecipients, this);
      this.on("change:totalRecipients", function () { this.set("hasRecipients", this.get("totalRecipients") > 0); });
    },

    success: function (data) {
      sitecore.debug(data);

      if (data.error) {
        this.error();
        return;
      }

      if (data.isUncommittedRead) {
        sitecore.trigger("notify:recipientList:locked");
      }

      this.set("totalRecipients", data.totalRecipientsCount);
      this.processRecipientLists(data.recipientLists);
      if (this.get("pagingMode") == "appending" && this.lastPage > 0) {
        this.set("recipientLists", this.get("recipientLists").concat(data.recipientLists));
      } else {
        this.set("recipientLists", data.recipientLists);
      }

      if (this.get("recipientLists") && this.get("recipientLists").length > 0) {
        this.set("hasRecipientLists", true);
        this.set("hasMoreRecipientLists", this.get("recipientLists").length < data.totalCount);
      } else {
        this.set("hasRecipientLists", false);
        this.set("hasMoreRecipientLists", false);
      }

      this.pendingRequests--;
      if (this.pendingRequests <= 0) {
        this.set("isBusy", false);
        this.pendingRequests = 0;
      }
    },

    // Since SPEAK doesn't provide possibility to create custom columns formatting, 
    //   we are forced to implement workarounds to show boolean value as text.
    processRecipientLists: function (recipientLists) {
      recipientLists = recipientLists || this.get("recipientLists");
      _.each(recipientLists, function(list) {
        list.defaultText = list.default ?
          sitecore.Resources.Dictionary.translate("ECM.Pages.Recipients.Yes") :
          '';
      });
    },

    successRecipients: function (data) {
      sitecore.debug(data);

      if (data.error) {
        this.error();
        return;
      }

      if (this.lastRequestGuid) {
        if (this.lastRequestGuid !== data.lastRequestGuid && data.lastRequestGuid != null) {
          this.pendingRecipientRequests--;
          if (this.pendingRecipientRequests <= 0) {
            this.set("IsRecipientsBusy", false);
            this.pendingRecipientRequests = 0;
          }

          return;
        }
      }

      var recipients = data.recipients;
      for (var i = 0; i < recipients.length; i++) {
        recipients[i].url = "/sitecore/client/Applications/ExperienceProfile/contact?cid=" + recipients[i].itemId;
      }
      if (this.get("pagingMode") === "appending" && this.get("lastRecipientListId") !== "") {
        this.set("recipients", this.get("recipients").concat(data.recipients));
      } else {
        this.set("recipients", data.recipients);
      }

      if (this.get("recipients") && this.get("recipients").length > 0) {
        this.set("hasMoreRecipients", data.hasMoreRecipients);
        this.set("lastRecipientListId", data.lastRecipientListId);
        this.set("lastRecipientIndex", data.lastRecipientIndex);
      }

      this.pendingRecipientRequests--;
      if (this.pendingRecipientRequests <= 0) {
        this.set("IsRecipientsBusy", false);
        this.pendingRecipientRequests = 0;
      }
    },

    error: function (args) {
      if (args && args.status === 403) {
        window.top.location.reload(true);
      }

      this.set("recipientLists", []);
      this.set("hasRecipientLists", false);
      this.set("hasMoreRecipientLists", false);

      this.set("recipients", []);
      this.set("hasRecipients", false);

      this.lastRequestGuid = null;

      this.pendingRequests--;
      if (this.pendingRequests <= 0) {
        this.set("isBusy", false);
        this.pendingRequests = 0;
      }

      this.pendingRecipientRequests--;
      if (this.pendingRecipientRequests <= 0) {
        this.set("IsRecipientsBusy", false);
        this.pendingRequests = 0;
      }
    },

    refresh: function () {
      this.lastPage = 0;
      this.set("pageIndex", this.lastPage);
      if (this.get("messageId") !== undefined) { //workaround
        this.getRecipientLists(this.lastPage);
      }
    },

    refreshRecipients: function (recipientLists) {
      this.set("lastRecipientListId", "");
      this.set("lastRecipientIndex", 0);
      this.set("hasMoreRecipients", false);
      this.set("recipients", []);

      if (!recipientLists || recipientLists.length === 0) {
        this.recipientListsToBindRecipients = this.get("recipientLists");
      } else if (recipientLists.length > 0) {
        this.recipientListsToBindRecipients = recipientLists;
      }

      var recipientListIds = [];
      for (var i = 0; i < this.recipientListsToBindRecipients.length; i++) {
        recipientListIds.push(this.recipientListsToBindRecipients[i].itemId);
      }
      
      if (this.get("messageId") !== undefined) { //workaround
        this.getRecipients(recipientListIds, "", 0);
      }
    },

    next: function () {
      this.lastPage++;
      if (this.get("pagingMode") == "paged") {
        this.set("pageIndex", this.lastPage);
      }

      this.getRecipientLists(this.lastPage);
    },

    nextRecipients: function () {
      var recipientLists = this.recipientListsToBindRecipients;
      if (!recipientLists) {
        return;
      }

      var recipientListIds = [];     
      _.each(recipientLists, function (recipientList) {
        recipientListIds.push(recipientList.itemId);
      });

      this.getRecipients(recipientListIds, this.get("lastRecipientListId"), this.get("lastRecipientIndex"));
    },

    getRecipientLists: function (pageIndex) {
      if (!this.isReady) {
        return;
      }

      var data = { messageId: this.get("messageId"), type: this.get("recipientListType"), pageIndex: pageIndex, pageSize: this.get("pageSize") };
      var options = {
        async: false,
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

    getRecipients: function (recipientListIds, lastRecipientListId, lastRecipientIndex) {
      if (!this.isReady || !this.get("loadRecipients") || (this.get("recipients").length !== 0 && !this.get("hasMoreRecipients"))) {
        return;
      }

      if (!recipientListIds || recipientListIds.length === 0) {
        this.error();
        return;
      }

      this.lastRequestGuid = this.createGuid();

      var data = { messageId: this.get("messageId"), lastRequestGuid : this.lastRequestGuid, recipientListIds: recipientListIds, lastRecipientListId: lastRecipientListId, lastRecipientIndex: lastRecipientIndex, pageSize: this.get("recipientPageSize"), filter: this.get("search") };
      var options = {
        url: "/sitecore/api/ssc/" + this.get("recipientRequest"),
        data: data,
        type: "POST",
        success: $.proxy(this.successRecipients, this),
        error: $.proxy(this.error, this)
      };

      this.pendingRecipientRequests++;
      this.set("IsRecipientsBusy", true);

      $.ajax(options);
    },

    createGuid: function () {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
  });

  var view = sitecore.Definitions.Views.ControlView.extend({
    listen: window._.extend({}, sitecore.Definitions.Views.ComponentView.prototype.listen, {
      "refresh:$this": "refresh",
      "next:$this": "next",
      "nextRecipients:$this": "nextRecipients",
      "getRecipients:$this": "getRecipients"
    }),

    initialize: function () {
      this._super();

      this.model.set("messageId", this.$el.attr("data-sc-messageid"));
      this.model.set("recipientListType", this.$el.attr("data-sc-recipientlisttype"));
      this.model.set("pageIndex", parseInt(this.$el.attr("data-sc-pageindex"), 10) || 0);
      this.model.set("pageSize", parseInt(this.$el.attr("data-sc-pagesize"), 10) || 0);
      this.model.set("recipientPageSize", parseInt(this.$el.attr("data-sc-recipientpagesize"), 10) || 0);
      this.model.set("request", this.$el.attr("data-sc-request"));
      this.model.set("recipientRequest", this.$el.attr("data-sc-recipientRequest"));

      this.model.set("pagingMode", this.$el.attr("data-sc-pagingmode") || "appending");
      this.model.isReady = true;
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
    },

    getRecipients: function (recipientListIds, lastRecipientListId, lastRecipientIndex) {
      this.model.getRecipients(recipientListIds, lastRecipientListId, lastRecipientIndex);
    },

    refreshRecipients: function (recipientLists) {
      this.model.refreshRecipients(recipientLists);
    },

    nextRecipients: function () {
      this.model.nextRecipients();
    }
  });

  sitecore.Factories.createComponent("RecipientDataSource", model, view, "script[type='text/x-sitecore-ecm-recipientdatasource']");
});
