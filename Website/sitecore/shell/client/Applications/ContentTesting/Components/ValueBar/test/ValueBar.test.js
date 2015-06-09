
var arTestComponents = ["sitecore", "ValueBar", "css!ValueBar"];
var arCoverageComponents = ["sitecore"];
var arResComponents;
if (window.location.host && window.location.host != '')
  arResComponents = arTestComponents;
else
  arResComponents = arCoverageComponents;

define(arResComponents, function (_sc) {

  describe("ValueBar testing|", function () {


    var setupTests = function ($pageElem) {

      var valueBarModel = new _sc.Definitions.Models.ValueBar();

      var valueBarProto = _sc.Definitions.Views.ValueBar.prototype;

      $elem = $pageElem.find(".sc-ValueBar");

      valueBarProto.setTestingOptions({
        $el: $elem,
        model: valueBarModel,
      });

      try {
        valueBarProto.initialize({});
      }
      catch (e) {
      }

      describe("Initialization", function () {

        //$ulContent
        it("'$elem' must be defined", function () {
          expect($elem.length).toBeGreaterThan(0);
        });

      });

      describe("Redraw", function () {

        it("Width of the bar(filled, valued) must be right", function () {
          valueBarModel.set("maxValue", 100);
          valueBarModel.set("value", 10);
          valueBarProto.redraw();

          expect(valueBarProto.$el[0].style.width).toEqual("10%");
        });

      });

    };

    if (window.location.host && window.location.host != '')
      window.runTests(setupTests);
    else
      setupTests($("<div></div>"));

  });
});
