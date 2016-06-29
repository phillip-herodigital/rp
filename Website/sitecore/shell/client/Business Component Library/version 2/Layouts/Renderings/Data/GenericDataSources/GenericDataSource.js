 (function (speak) {

  require.config({
    paths: {
      baseDataSource: "/sitecore/shell/client/Business Component Library/version 2/Layouts/Renderings/Data/BaseDataSources/BaseDataSource"
    }
  });

  speak.component(["baseDataSource"], function (baseDataSource)  {
    
    return speak.extend(baseDataSource, {
      name: "GenericDataSource",

      initialized: function () {
        this.on("change:ServerSorting", this.formatListSorting, this);
        this.on("change:ListSorting", this.formatServerSorting, this);
        this.formatListSorting();
      },

      formatListSorting: function () {

        if (this.sortingChanging) {
          return;
        }

        this.sortingChanging = true;

        var serverSorting = this.ServerSorting;
        if (serverSorting) {

          var direction,
              field,
              listSorting = "",
              serverSortingLength = serverSorting.length;
          for (var i = 0; i < serverSortingLength; i++) {
            direction = serverSorting[i].direction.substring(0, 1).toLowerCase();
            field = serverSorting[i].field;
            listSorting = listSorting + "|" + direction + field;
          }
          if (listSorting.length > 0) {
            listSorting = listSorting.substring(1, listSorting.length);
          }
          this.ListSorting = listSorting;
        } else {
          this.ListSorting = null;
        }

        this.sortingChanging = false;
      },

      formatServerSorting: function () {
        if (this.sortingChanging) {
          return;
        }

        this.sortingChanging = true;

        var listSorting = this.model.get("listSorting");
        if (listSorting) {
          var direction,
              serverSorting = new Array(),
              listSortingArray = listSorting.split("|"),
              listSortingArrayLenght = listSortingArray.length;
          for (var i = 0; i < listSortingArrayLenght; i++) {
            direction = listSortingArray[i].substring(0, 1);
            direction = direction === "a" ? "Asc" : "Desc";
            var field = listSortingArray[i].substring(1, listSortingArray[i].length);
            serverSorting.push({
              "direction": direction,
              "field": field
            });
          }
          this.ServerSorting = serverSorting;
        } else {
          this.ServerSorting = null;
        }

        this.sortingChanging = false;
      },

      loadData: function (serverRequestOptions) {
        "use strict";

        var serverRequestParameters = null,
          serverRequestOnSuccess = null,
          serverRequestUrl = this.ServiceUrl;

        if (serverRequestOptions) {
          serverRequestParameters = serverRequestOptions["parameters"],
          serverRequestOnSuccess = serverRequestOptions["onSuccess"],
          serverRequestUrl = serverRequestOptions["url"] ? serverRequestOptions["url"] : this.ServiceUrl;
        }
        
        var providerItemProperties = {
          "serverSorting": this.ServerSorting,
          "pageSize": this.PageSize == 0? "" : this.PageSize,
          "pageIndex": this.PageSize == 0 ? "" : this.PageIndex // if Page.Size==0 then PageIndex has no meaning
        };

        this.performRequest(serverRequestUrl, providerItemProperties, serverRequestParameters, serverRequestOnSuccess);
      },

      successHandler: function (jsonData) {

        this.HasMoreData = jsonData.hasMoreData;
        this.TotalRecordCount = jsonData.totalRecordCount;
        this.PageSize = jsonData.pageSize;
        this.PageIndex = jsonData.pageIndex;

        if (jsonData.sorting) {
          this.ServerSorting = jsonData.sorting;
        }
      }

    });
  }, "GenericDataSource");
})(Sitecore.Speak);
