
var arResComponents;
if (window.location.host && window.location.host != '') // launching when address to web-page
  arResComponents = ["sitecore", "OptionsMapper", "css!OptionsMapper"];
else // launching of the code-coverage estemating
  arResComponents = ["sitecore"];

define(arResComponents, function (_sc) {

  describe("OptionsMapper testing|", function () {

    var setupTests = function ($pageElem) {

      var optionsMapperModel = new _sc.Definitions.Models.OptionsMapper();

      var optionsMapperProto = _sc.Definitions.Views.OptionsMapper.prototype;

      $elem = $pageElem.find(".sc-OptionsMapper");

      optionsMapperProto.$el = $elem;
      optionsMapperProto.model = optionsMapperModel;

      try {
        optionsMapperProto.initialize({});
      }
      catch (e) {
      }

      describe("Initialization|", function () {

        it("values must be equal to '0'|", function () {
          expect(optionsMapperProto.model.get("TrafficAllocation")).toEqual(0);
          expect(optionsMapperProto.model.get("ConfidenceLevel")).toEqual(0);
        });
      });

    };

    if (window.location.host && window.location.host != '') // launching when address to web-page
      window.runTests(setupTests);
    else // launching of the code-coverage estemating
      setupTests($("<div></div>"));

  });
});
