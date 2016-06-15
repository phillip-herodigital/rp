define(["backbone", "/-/speak/v1/ecm/ServerRequest.js"], function (backbone, serverRequest) {

  return {
    expectedDatabase: function(dbName) {
      var defer = $.Deferred();
      serverRequest({
        url: '/sitecore/SelectedDatabase.ashx',
        data: { expectedDatabase: dbName },
        type: 'get',
        success: function (response) {
          if (typeof response === "boolean" && response) {
            defer.resolve();
          } else {
            defer.reject();
          }
        },
        context: this
      });
      return defer.promise();
    }
  };
});