
var arResComponents;
if (window.location.host && window.location.host != '') // launching when address to web-page
  arResComponents = ["sitecore", "PageThumbnail", "css!PageThumbnail"];
else // launching of the code-coverage estemating
  arResComponents = ["sitecore"];

define(arResComponents, function (_sc) {

  describe("PageThumbnail testing|", function () {

    var setupTests = function ($pageElem) {

      var thumbnailImageModel = new _sc.Definitions.Models.ThumbnailImage();

      var thumbnailImageProto = _sc.Definitions.Views.ThumbnailImage.prototype;

      $elem = $pageElem.find(".sc-ThumbnailImage");

      thumbnailImageProto.$el = $elem;
      thumbnailImageProto.model = thumbnailImageModel;

      try {
        thumbnailImageProto.initialize({});
      }
      catch (e) {
      }

      describe("Initialization|", function () {

        it("'$elem' must be defined|", function () {
          expect($elem.length).toBeGreaterThan(0);
        });

        it("'startGetThumbnailUrl', 'tryFinishGetThumbnailUrl' must be defined|", function () {
          var startGetThumbnailUrl = thumbnailImageProto.model.get("startGetThumbnailUrl");
          var tryFinishGetThumbnailUrl = thumbnailImageProto.model.get("tryFinishGetThumbnailUrl");
          var isDefined = startGetThumbnailUrl && startGetThumbnailUrl != "" && tryFinishGetThumbnailUrl && tryFinishGetThumbnailUrl != "";
          expect(isDefined).toBe(true);
        });

      });

      describe("Working|", function () {

        it("'updateLink' checking|", function () {
          var baseUrl = "urlTest";
          var combination = "combTest";
          thumbnailImageProto.model.set("baseLinkUrl", baseUrl);
          thumbnailImageProto.model.set("combination", combination);

          thumbnailImageProto.model.updateLink();
          var link = thumbnailImageProto.model.get("previewUrl");
          var isCorrect = link.indexOf(baseUrl) >= 0 && link.indexOf(combination) >= 0;
          expect(isCorrect).toBe(true);
        });

        it("'model.refresh' checking|", function () {
          thumbnailImageProto.model.set("itemId", "{11111111-1111-1111-1111-111111111111}");          

          thumbnailImageProto.model.refresh();
        });

        it("'refresh' checking|", function () {
          var imgSrc = "testImg";
          thumbnailImageProto.model.set("imgSrc", imgSrc);
          thumbnailImageProto.refresh();

          var $img = thumbnailImageProto.$el.find("img");
          var isSet = $img.length > 0 && $img.attr("src") == imgSrc;
          expect(isSet).toBe(true);
        });

        it("'setState' checking|", function () {
          thumbnailImageProto.model.set("isBusy", true);
          thumbnailImageProto.setState();

          var isContain = thumbnailImageProto.$el.attr("class").indexOf("blank") >= 0;
          expect(isContain).toEqual(false);
          
          thumbnailImageProto.model.set("isBusy", false);
          thumbnailImageProto.model.set("imgSrc", "");
          thumbnailImageProto.setState();

          isContain = thumbnailImageProto.$el.attr("class").indexOf("blank") >= 0;
          expect(isContain).toEqual(true);
        });

      });

    };

    if (window.location.host && window.location.host != '') // launching when address to web-page
      window.runTests(setupTests);
    else // launching of the code-coverage estemating
      setupTests($("<div></div>"));

  });
});
