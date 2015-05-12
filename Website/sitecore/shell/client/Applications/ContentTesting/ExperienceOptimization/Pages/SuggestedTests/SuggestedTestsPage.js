require.config({
  paths: {
    suggestedTestsListMod: "/-/speak/v1/contenttesting/SuggestedTestsList"
  }
});

define(["sitecore", "suggestedTestsListMod"], function (_sc, suggestedTestsListMod) {
  var SuggestedTests = _sc.Definitions.App.extend({
    initialized: function () {
      this.suggestedTestsList = new suggestedTestsListMod.SuggestedTestsList({ host: this });

      this.TestsDataSource.set("currentPage", this);
    }
  });

  return SuggestedTests;
});