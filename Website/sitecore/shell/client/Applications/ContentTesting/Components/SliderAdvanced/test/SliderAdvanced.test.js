
var arTestComponents = ["sitecore", "SliderAdvanced", "css!SliderAdvanced"];
var arCoverageComponents = ["sitecore"];
var arResComponents;
if (window.location.host && window.location.host != '')
  arResComponents = arTestComponents;
else
  arResComponents = arCoverageComponents;

//define(["sitecore", "SliderAdvanced", "css!SliderAdvanced"], function (_sc) {
define(arResComponents, function (_sc) {

  describe("SliderAdvanced testing|", function () {

    var setupTests = function ($pageElem) {

      var sliderModel = new _sc.Definitions.Models.SliderAdvanced();
      var sliderProto = _sc.Definitions.Views.SliderAdvanced.prototype;

      $elem = $pageElem.find(".sc-SliderAdvanced");

      sliderProto.setTestingOptions({
        $el: $elem,
        model: sliderModel,
      });

      try {
        sliderProto.initializeParameters();
      }
      catch (e) {

      }      

      var $dvPanel = sliderProto.$el.find(".sliderAdv-dvPanel");
      var $dvSelectedPanel = sliderProto.$el.find(".sliderAdv-dvSelectedPanel");

      describe("Initialization|", function () {
        
        it("'$dvPanel' must be defined|", function () {
          expect($dvPanel.length).toBeGreaterThan(0);
        });
        it("'$dvSelectedPanel' must be defined|", function () {
          expect($dvSelectedPanel.length).toBeGreaterThan(0);
        });

        it("component must be Enabled|", function () {
          expect(sliderProto.isEnabled()).toEqual(true);
        });

        it("minimum, maximum, countPoints must be defined|", function () {
          expect(sliderProto.model.get("minimum")).toBeDefined();
          expect(sliderProto.model.get("maximum")).toBeDefined();
          expect(sliderProto.model.get("countPoints")).toBeDefined();
        });

      });

      var populateSlider = function (minimum, maximum, countPoints) {
        sliderProto.model.set("minimum", minimum);
        sliderProto.model.set("maximum", maximum);
        sliderProto.model.set("countPoints", countPoints);

        sliderProto.initializeParameters();
      };

      describe("Populating and rendering|", function () {

        it("points must be rendered and have defined value|", function () {
          populateSlider(0, 100, 5);

          var $dvTitlePanel = sliderProto.$el.find(".sliderAdv-dvTitlePanel");
          var children = $dvTitlePanel.children();
          expect(children.length).toEqual(5 + 1);

          expect(children[0].innerText).toEqual("0");
          expect(children[1].innerText).toEqual("20");
          expect(children[2].innerText).toEqual("40");
          expect(children[3].innerText).toEqual("60");
          expect(children[4].innerText).toEqual("80");
          expect(children[5].innerText).toEqual("100");
        });

      });

      describe("Selecting value|", function () {

        it("Selected value in model must be rendered|", function () {
          sliderProto.model.set("selectedValue", 40);
          sliderProto.selectedValueChanged();

          var $markValue = sliderProto.$el.find(".sliderAdv-markValue");
          $dvSelectedPanel = sliderProto.$el.find(".sliderAdv-dvSelectedPanel");

          expect($markValue.html()).toEqual("40");
          expect($dvSelectedPanel[0].style.width).toEqual("40%");
        });

      });

    };

    if (window.location.host && window.location.host != '')
      window.runTests(setupTests);
    else
      setupTests($("<div></div>"));

  });
});
