
var arTestComponents = ["sitecore", "CarouselImage", "css!CarouselImage"];
var arCoverageComponents = ["sitecore"];
var arResComponents;
if (window.location.host && window.location.host != '') // launching when address to web-page
  arResComponents = arTestComponents;
else // launching of the code-coverage estemating
  arResComponents = arCoverageComponents;

define(arResComponents, function (_sc) {

  describe("CarouselImage testing|", function () {

    var setupTests = function ($pageElem) {

      var carouselModel = new _sc.Definitions.Models.CarouselImage();
      var carouselProto = _sc.Definitions.Views.CarouselImage.prototype;

      $elem = $pageElem.find(".sc-carouselimage");

      carouselProto.setTestingOptions({
        $el: $elem,
        model: carouselModel,
      });

      try {
        carouselProto.initialize({});
      }
      catch (e) {
      }
      

      var $dvInfoPanel = carouselProto.$el.find(".dvInfoPanel");
      var $dvCarouselContent = carouselProto.$el.find(".dvCarouselContent");
      var $elastislideList = carouselProto.$el.find(".elastislide-list");

      describe("Initialization|", function () {

        it("'$dvInfoPanel' must be defined|", function () {
          expect($dvInfoPanel.length).toBeGreaterThan(0);
        });
        it("'$dvCarouselContent' must be defined|", function () {
          expect($dvCarouselContent.length).toBeGreaterThan(0);
        });
        it("'$elastislideList' must be defined|", function () {
          expect($elastislideList.length).toBeGreaterThan(0);
        });

      });

      var getTestItems = function () {
        var items = [
                      {
                        name: "img1",
                        uId: "1",
                        src: "img1"
                      },
                      {
                        name: "img2",
                        uId: "2",
                        src: "img2"
                      },
        ];

        return items;
      };

      describe("Populating and rendering|", function () {

        it("Rendered items must be the same with items in model(amount, attributes)|", function () {
          var items = getTestItems();

          carouselProto.model.set("items", items);

          var $elastislideList = carouselProto.$el.find(".elastislide-list");
          var list_imgCarouselWrapper = $elastislideList.find(".imgCarouselWrapper");
          expect(list_imgCarouselWrapper.length).toEqual(items.length);

          expect($(list_imgCarouselWrapper[0]).find("img").attr("src")).toEqual(items[0].src);
          expect($(list_imgCarouselWrapper[0]).find("span").html()).toEqual(items[0].name);

          expect($(list_imgCarouselWrapper[1]).find("img").attr("src")).toEqual(items[1].src);
          expect($(list_imgCarouselWrapper[1]).find("span").html()).toEqual(items[1].name);

        });

      });

    };

    if (window.location.host && window.location.host != '') // launching when address to web-page
      window.runTests(setupTests);
    else // launching of the code-coverage estemating
      setupTests($("<div></div>"));

  });
});
