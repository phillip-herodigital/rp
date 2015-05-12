var arResComponents;
if (window.location.host && window.location.host != '') // launching when address to web-page
  arResComponents = ["sitecore", "ImageThumbs", "CompareImage", "css!CompareImage"];
else { // launching of the code-coverage estemating
  require.config({
    paths: {
      imageThumbs: contentTestingDir + "/ContentTesting/Common/lib/imagethumbs"
    },
  });

  arResComponents = ["sitecore", "imageThumbs"];
} 
  

define(arResComponents, function (_sc, thumbs) {


  describe("CompareImage testing|", function () {

    var setupTests = function ($pageElem) {

      var compareImageModel = new _sc.Definitions.Models.CompareImage();
      var compareImageProto = _sc.Definitions.Views.CompareImage.prototype;

      $elem = $pageElem.find(".dvCompareImage");

      compareImageProto.setTestingOptions({
        $el: $elem,
        model: compareImageModel,
      });

      var imageThumbs = new thumbs.ImageThumbs({
        dictionary: this.StringDictionary
      });
      compareImageProto.model.set("imageThumbs", imageThumbs);

      try {
        compareImageProto.initialize({ isTestingUnit: true });
      }
      catch (e) {
      }
      

      var $dvBeforeAfter = compareImageProto.$el.find("#dvBeforeAfter");

      describe("Initialization|", function () {

        it("'#dvBeforeAfter' must be defined|", function () {
          expect($dvBeforeAfter.length).toBeGreaterThan(0);
        });

      });

      describe("Populating and rendering|", function () {

        it("Rendered items must be the same with items in model(amount, attributes)|", function () {

          var items = getTestItems();
          compareImageProto.model.set("items", items);
          compareImageProto.redraw();

          $dvBeforeAfter = compareImageProto.$el.find("#dvBeforeAfter");
          var list_dvSide = $dvBeforeAfter.find(".dvSide");

          expect(list_dvSide.length).toEqual(items.length);
        });

      });

      var getTestItems = function () {
        var items = [
                      {
                        name: "img1",
                        src: "img1"
                      },
                      {
                        name: "img2",
                        src: "img2"
                      },
        ];

        return items;
      };


    };

    if (window.location.host && window.location.host != '') // launching when address to web-page
      window.runTests(setupTests);
    else // launching of the code-coverage estemating
      setupTests($("<div></div>"));

  });
});
