require.config({
  paths: {
    executedTestsListMod: "/-/speak/v1/contenttesting/ExecutedTestsList"
  }
});

define(["sitecore", "executedTestsListMod"], function (_sc, executedTestsListMod) {
  var HistoricalTests = _sc.Definitions.App.extend({
    initialized: function () {
      this.historicalTestsList = new executedTestsListMod.ExecutedTestsList({ host: this });
      this.TestsDataSource.set("hostItemId", this.ItemFromQueryString.get("itemId")); // no need to bind these as ItemFromQueryString won't change after load
      this.TestsDataSource.set("pageSize", 10);
    },
      
    close: function() {
      var frame = window.frameElement;
      $(frame).hide();
    }
  });

  return HistoricalTests;
});