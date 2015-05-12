require.config({
  paths: {
    executedTestsListMod: "/-/speak/v1/contenttesting/ExecutedTestsList"
  }
});

define(["sitecore", "executedTestsListMod"], function (_sc, executedTestsListMod) {
  var HistoricalTests = _sc.Definitions.App.extend({
    initialized: function () {
      this.historicalTestsList = new executedTestsListMod.ExecutedTestsList({ host: this });

      this.TestsDataSource.set("currentPage", this);
    }
  });

  return HistoricalTests;
});