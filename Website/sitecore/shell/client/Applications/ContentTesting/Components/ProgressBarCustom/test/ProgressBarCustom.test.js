
var arTestComponents = ["sitecore", "ProgressBarCustom", "css!ProgressBarCustom"];
var arCoverageComponents = ["sitecore"];
var arResComponents;
if (window.location.host && window.location.host != '') // launching when address to web-page
  arResComponents = arTestComponents;
else // launching of the code-coverage estemating
  arResComponents = arCoverageComponents;

define(arResComponents, function (_sc) {

  describe("ProgressBarCustom testing|", function () {

    var setupTests = function ($pageElem) {

      var progressBarModel = new _sc.Definitions.Models.ProgressBarCustom();

      var progressBarProto = _sc.Definitions.Views.ProgressBarCustom.prototype;

      $elem = $pageElem.find(".sc-progressbarcustom");

      progressBarProto.setTestingOptions({
        $el: $elem,
        model: progressBarModel,
      });

      try {
        progressBarProto.initialize({});
      }
      catch (e) {
      }

      describe("Initialization|", function () {

        it("'$elem' must be defined|", function () {

          expect($elem.length).toBeGreaterThan(0);
        });

      });

      describe("Populating and rendering|", function () {

        it("'ValueAll' rendering|", function () {

          var valueAll = 20;
          progressBarProto.model.set("ValueAll", valueAll);

          var $valueAllElem = progressBarProto.$el.find(".scPrBar-spValueAll");
          var isRenderedCorrect = $valueAllElem.length > 0 && $valueAllElem.html() == valueAll.toString();
          expect(isRenderedCorrect).toEqual(true);

        });

        it("'Header' rendering|", function () {

          var headerBar = "HeaderBar_Test";
          progressBarProto.model.set("HeaderBar", headerBar);

          var $headerBarElem = progressBarProto.$el.find(".scPrBar-spHeader");
          var isRenderedCorrect = $headerBarElem.length > 0 && $headerBarElem.html().indexOf(headerBar) >= 0;
          expect(isRenderedCorrect).toEqual(true);

        });

        it("'Value' rendering|", function () {
          var minimum = 0;
          var maximum = 100;
          var value = 10;

          progressBarProto.model.set("Minimum", minimum);
          progressBarProto.model.set("Maximum", maximum);
          progressBarProto.model.set("Value", value);

          var $spValueElem = progressBarProto.$el.find(".scPrBar-spValue");
          var isRenderedCorrect = $spValueElem.length > 0 && $spValueElem.html() == (value + "%");
          expect(isRenderedCorrect).toEqual(true);


          var $dvValueElem = progressBarProto.$el.find(".scPrBar-dvValue");
          isRenderedCorrect = $dvValueElem.length > 0 && $dvValueElem[0].style.width == (value + "%");
          expect(isRenderedCorrect).toEqual(true);          

        });
        
      });

      

    };

    if (window.location.host && window.location.host != '') // launching when address to web-page
      window.runTests(setupTests);
    else // launching of the code-coverage estemating
      setupTests($("<div></div>"));

  });
});
