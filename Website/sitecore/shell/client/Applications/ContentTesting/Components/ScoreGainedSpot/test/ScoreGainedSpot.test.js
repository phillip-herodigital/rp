
var arResComponents;
if (window.location.host && window.location.host != '') // launching when address to web-page
  arResComponents = ["sitecore", "ScoreGainedSpot", "css!ScoreGainedSpot"];
else // launching of the code-coverage estemating
  arResComponents = ["sitecore"];

define(arResComponents, function (_sc) {

  describe("ScoreGainedSpot testing|", function () {

    var setupTests = function ($pageElem) {

      var scoreGainedSpotModel = new _sc.Definitions.Models.ScoreGainedSpot();

      var scoreGainedSpotProto = _sc.Definitions.Views.ScoreGainedSpot.prototype;

      $elem = $pageElem.find(".sc-ScoreGainedSpot");

      scoreGainedSpotProto.$el = $elem;        
      scoreGainedSpotProto.model = scoreGainedSpotModel;

      try {
        scoreGainedSpotProto.initialize({});
      }
      catch (e) {
      }

      describe("Initialization|", function () {

        it("'$elem' must be defined|", function () {
          expect($elem.length).toBeGreaterThan(0);
        });
      });

      describe("Populating and rendering|", function () {

        it("'Score' must be visible and correct|", function () {
          scoreGainedSpotProto.model.set("Score", 5);
          expect(scoreGainedSpotProto.$el.find(".new-score").html()).toEqual("5");
        });

        it("setting 'Score' using 'model.render'|", function () {
          scoreGainedSpotProto.model.viewModel = scoreGainedSpotProto;
          scoreGainedSpotProto.model.render({"Score": 6});
          expect(scoreGainedSpotProto.$el.find(".new-score").html()).toEqual("6");
        });

      });

    };

    if (window.location.host && window.location.host != '') // launching when address to web-page
      window.runTests(setupTests);
    else // launching of the code-coverage estemating
      setupTests($("<div></div>"));

  });
});
