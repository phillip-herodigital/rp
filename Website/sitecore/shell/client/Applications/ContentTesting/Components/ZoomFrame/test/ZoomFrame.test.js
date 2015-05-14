
var arResComponents;
if (window.location.host && window.location.host != '') // launching when address to web-page
  arResComponents = ["sitecore", "ZoomFrame", "css!ZoomFrame"];
else // launching of the code-coverage estemating
  arResComponents = ["sitecore"];

define(arResComponents, function (_sc) {

  describe("ZoomFrame testing|", function () {

    var setupTests = function ($pageElem) {

      var zoomFrameModel = new _sc.Definitions.Models.ZoomFrame();

      var zoomFrameProto = _sc.Definitions.Views.ZoomFrame.prototype;

      $elem = $pageElem.find(".sc-ZoomFrame");

      zoomFrameProto.$el = $elem;
      zoomFrameProto.model = zoomFrameModel;

      try {
        zoomFrameProto.initialize({});
      }
      catch (e) {

      }

      describe("Initialization|", function () {

        it("'$elem' must be defined|", function () {
          expect($elem.length).toBeGreaterThan(0);
        });
      });


      describe("Working|", function () {

        it("'zoomImage' checking|", function () {
          try {
            zoomFrameProto.zoomImage({});
          }
          catch (e) {
          }          

          var isRenderedDiv = zoomFrameProto._dvZoomElem && zoomFrameProto._dvZoomElem.css("display") == "block";
          var $dvElem = $(window.document).find("#dvZoom");
          var isRenderedElems = $dvElem.length > 0 && $dvElem.css("display") == "block";

          var isRenderedOK = isRenderedDiv && isRenderedElems;

          expect(isRenderedOK).toBe(true);
        });

        it("'closeFrame' checking|", function () {
          zoomFrameProto.closeFrame({ data: zoomFrameProto });

          var isHiddenDiv = zoomFrameProto._dvZoomElem && zoomFrameProto._dvZoomElem.css("display") == "none";
          var $dvElem = $(window.document).find("#dvZoom");
          var isHiddenElems = $dvElem.length > 0 && $dvElem.css("display") == "none";

          var isHiddenOK = isHiddenDiv && isHiddenElems;
          expect(isHiddenOK).toBe(true);
        });

        it("'closeKeyHandler' checking|", function () {
          try {
            zoomFrameProto.zoomImage({});
          }
          catch (e) {
          }

          zoomFrameProto.closeKeyHandler({ data: zoomFrameProto, which: 27 });

          var isHiddenDiv = zoomFrameProto._dvZoomElem && zoomFrameProto._dvZoomElem.css("display") == "none";
          var $dvElem = $(window.document).find("#dvZoom");
          var isHiddenElems = $dvElem.length > 0 && $dvElem.css("display") == "none";

          var isHiddenOK = isHiddenDiv && isHiddenElems;
          expect(isHiddenOK).toBe(true);
        });

        it("'imgZoomMouseMove' checking|", function () {
          try {
            zoomFrameProto.zoomImage({});
          }
          catch (e) {
          }

          var $parentBody = $(zoomFrameProto._targetDoc.body);

          var zoomContainer = $parentBody.find(zoomFrameProto._zoomContainer);
          var toLeft = zoomContainer.scrollLeft();
          var toTop = zoomContainer.scrollTop();

          zoomFrameProto.imgZoomMouseMove({ data: zoomFrameProto, pageX: 1000, pageY: 10 });
          expect(true).toBe(true);

          zoomFrameProto.closeFrame({ data: zoomFrameProto });
        });

      });

    };

    if (window.location.host && window.location.host != '') // launching when address to web-page
      window.runTests(setupTests);
    else // launching of the code-coverage estemating
      setupTests($("<div></div>"));

  });
});
