define(["sitecore"], function (_sc) {

  var TestSummaryDialog = _sc.Definitions.App.extend({

    initialized: function () {
      this.TestSummaryDataSource.on("change:winnerName", this.updateWinnerText, this);
      this.updateWinnerText();

      this.TestSummaryDataSource.on("change:valueChange change:confidence", this.updateValueImproveText, this);
      this.updateValueImproveText();

      this.TestSummaryDataSource.on("change:valueChange change:confidence", this.updateValueDeclineText, this);
      this.updateValueDeclineText();

      this.TestSummaryDataSource.on("change:testScore", this.updateScoreText, this);
      this.updateScoreText();

      this.TestSummaryDataSource.on("change:testOutcome change:guessedTestOutcome", this.updateTestOutcomeCorrectText, this);
      this.updateTestOutcomeCorrectText();

      this.TestSummaryDataSource.on("change:testOutcome change:guessedTestOutcome", this.updateTestOutcomeIncorrectText, this);
      this.updateTestOutcomeIncorrectText();
    },

    updateWinnerText: function () {
      var template = _.template(this.StringDictionary.get("<%= winnerName %> won the test"));
      this.WinnerText.set("text", template({
        winnerName: this.TestSummaryDataSource.get("winnerName")
      }));
    },

    updateValueImproveText: function () {
      var template = _.template(this.StringDictionary.get("The experience improved the engagement value by <%= valueChange %>% compared to the original, based on <%= confidence %> visits."));
      this.ValueImprovedText.set("text", template({
        valueChange: this.TestSummaryDataSource.get("valueChange"),
        confidence: this.TestSummaryDataSource.get("confidence")
      }));
    },

    updateValueDeclineText: function () {
      var template = _.template(this.StringDictionary.get("The experience decreased the engagement value by <%= valueChange %>% compared to the original, based on <%= confidence %> visits."));
      this.ValueDeclineText.set("text", template({
        valueChange: this.TestSummaryDataSource.get("valueChange"),
        confidence: this.TestSummaryDataSource.get("confidence")
      }));
    },

    updateScoreText: function () {
      var template = _.template(this.StringDictionary.get("You have been assigned <%= score %> points to your test score."));
      this.ScoreText.set("text", template({
        score: this.TestSummaryDataSource.get("testScore")
      }));
    },

    updateTestOutcomeCorrectText: function () {
      var template = _.template(this.StringDictionary.get("You guessed the outcome of the test would be \"<%= guess %>\". And the outcome was in fact \"<%= outcome %>\""));
      this.TestOutcomeCorrectText.set("text", template({
        outcome: this.TestSummaryDataSource.get("testOutcome"),
        guess: this.TestSummaryDataSource.get("guessedTestOutcome")
      }));
    },

    updateTestOutcomeIncorrectText: function () {
      var template = _.template(this.StringDictionary.get("You guessed the outcome of the test would be \"<%= guess %>\". However the outcome was \"<%= outcome %>\""));
      this.TestOutcomeIncorrectText.set("text", template({
        outcome: this.TestSummaryDataSource.get("testOutcome"),
        guess: this.TestSummaryDataSource.get("guessedTestOutcome")
      }));
    }
  });

  return TestSummaryDialog;
});