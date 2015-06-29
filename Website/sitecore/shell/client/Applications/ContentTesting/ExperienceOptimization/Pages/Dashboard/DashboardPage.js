require.config({
  paths: {
    dataRepeaterBinding: "/-/speak/v1/contenttesting/DataRepeaterBinding"
  }
});

define(["sitecore", "dataRepeaterBinding", "/-/speak/v1/contenttesting/ModeFix.js"], function (_sc, dataRepeaterBinding, modeFix) {
  var Dashboard = _sc.Definitions.App.extend({
    initialized: function () {
      // workaround
      modeFix.fixModeCookies();

      this.setMode();
      dataRepeaterBinding.init({
        improvementText: this.Texts.get("{0} % improvement from last month"),
        decreaseText: this.Texts.get("{0} % decrease from last month")
      });

      // Bind data repeater data
      this.PrevTestOutcomesDataSource.on("change:items", dataRepeaterBinding.setRepeaterData, { app: this, repeater: this.PrevTestOutcomes, dataSource: this.PrevTestOutcomesDataSource });
      this.CurrentTestOutcomesDataSource.on("change:items", dataRepeaterBinding.setRepeaterData, { app: this, repeater: this.CurrentTestOutcomes, dataSource: this.CurrentTestOutcomesDataSource });
      this.PrevBestGuessingDataSource.on("change:items", dataRepeaterBinding.setRepeaterData, { app: this, repeater: this.PrevBestGuessing, dataSource: this.PrevBestGuessingDataSource });
      this.CurrentBestGuessingDataSource.on("change:items", dataRepeaterBinding.setRepeaterData, { app: this, repeater: this.CurrentBestGuessing, dataSource: this.CurrentBestGuessingDataSource });
      this.PrevEffectDataSource.on("change:items", dataRepeaterBinding.setRepeaterData, { app: this, repeater: this.PrevEffect, dataSource: this.PrevEffectDataSource });
      this.CurrentEffectDataSource.on("change:items", dataRepeaterBinding.setRepeaterData, { app: this, repeater: this.CurrentEffect, dataSource: this.CurrentEffectDataSource });
      this.PrevActiveUserDataSource.on("change:items", dataRepeaterBinding.setRepeaterData, { app: this, repeater: this.PrevActiveUsers, dataSource: this.PrevActiveUserDataSource });
      this.CurrentActiveUserDataSource.on("change:items", dataRepeaterBinding.setRepeaterData, { app: this, repeater: this.CurrentActiveUsers, dataSource: this.CurrentActiveUserDataSource });

      // Bind data repeater entries
      this.PrevTestOutcomes.on("subAppLoaded", dataRepeaterBinding.bindLeaderboardEntryData, this);
      this.CurrentTestOutcomes.on("subAppLoaded", dataRepeaterBinding.bindLeaderboardEntryData, this);

      var guessExtractor = function (data) { return data.Guess; };
      this.PrevBestGuessing.on("subAppLoaded", this.bindMetricEntryData, { app: this, extractor: guessExtractor, metric: this.Texts.get("Guess") });
      this.CurrentBestGuessing.on("subAppLoaded", this.bindMetricEntryData, { app: this, extractor: guessExtractor, metric: this.Texts.get("Guess") });

      var effectExtractor = function (data) { return data.Effect; };
      this.PrevEffect.on("subAppLoaded", this.bindMetricEntryData, { app: this, extractor: effectExtractor, metric: this.Texts.get("Effect") });
      this.CurrentEffect.on("subAppLoaded", this.bindMetricEntryData, { app: this, extractor: effectExtractor, metric: this.Texts.get("Effect") });

      var activityExtractor = function (data) { return data.Activity; };
      this.PrevActiveUsers.on("subAppLoaded", this.bindMetricEntryData, { app: this, extractor: activityExtractor, metric: this.Texts.get("Activity") });
      this.CurrentActiveUsers.on("subAppLoaded", this.bindMetricEntryData, { app: this, extractor: activityExtractor, metric: this.Texts.get("Activity") });
    },

    bindMetricEntryData: function(args) {
      var subapp = args.app;
      var data = args.data;
      var value = this.extractor(data);
      var format = this.format;
      var metric = this.metric;
      var app = this.app;

      subapp.Entry.viewModel.$el.addClass(data.Class);

      subapp.Rank.set("text", data.Rank);
      subapp.Name.set("text", data.User);
      dataRepeaterBinding.setChangeData(subapp.ChangeValue, data.ComparisonChange, "{0}%", "{0}%");
      subapp.MetricValue.set("value", format ? format.replace("{0}", value) : value);
      subapp.MetricName.set("text", metric);
    },

    setMode: function () {
      // If user has read access to OverallMode protected border then change settings for Overall Mode
      if (this.ModeKey) {
        this.PrevTestOutcomesDataSource.set("includeAverage", true);
        this.CurrentTestOutcomesDataSource.set("includeAverage", true);
        this.PrevBestGuessingDataSource.set("includeAverage", true);
        this.CurrentBestGuessingDataSource.set("includeAverage", true);
        this.PrevEffectDataSource.set("includeAverage", true);
        this.CurrentEffectDataSource.set("includeAverage", true);
        this.PrevActiveUserDataSource.set("includeAverage", true);
        this.CurrentActiveUserDataSource.set("includeAverage", true);

        // Explicitly hide individual KPIs. Admins would see both
        if (this.IndividualKPIProtection) {
          this.IndividualKPIProtection.set("isVisible", false);
        }
      }
    }
  });

  return Dashboard;
});
