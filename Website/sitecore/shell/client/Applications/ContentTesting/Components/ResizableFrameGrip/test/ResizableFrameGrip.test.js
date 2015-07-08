
var arResComponents;
if (window.location.host && window.location.host != '') // launching when address to web-page
  arResComponents = ["sitecore", "ResizableFrameGrip", "css!ResizableFrameGrip"];
else // launching of the code-coverage estemating
  arResComponents = ["sitecore"];

define(arResComponents, function (_sc) {

  describe("ResizableFrameGrip testing|", function () {

    var setupTests = function ($pageElem) {

      var resizableFrameModel = new _sc.Definitions.Models.ResizableFrameGrip();

      var resizableFrameProto = _sc.Definitions.Views.ResizableFrameGrip.prototype;

      $elem = $pageElem.find(".scExp-dvExperienceList");

      resizableFrameProto.$el = $elem;
      resizableFrameProto.model = resizableFrameModel;

      try {
        resizableFrameProto.initialize({});
      }
      catch (e) {

      }

      describe("Initialization|", function () {

        it("'$elem' must be defined|", function () {
          expect($elem.length).toBeGreaterThan(0);
        });

      });

      describe("Working|", function () {
        it("'mouseupParent' checking|", function () {
          resizableFrameProto.mouseupParent();

          var isHidden = true;
          if (window.frameElement)
            isHidden = $(window.frameElement).css("display") == "none";
          expect(isHidden).toBe(true);
        });

        it("'mouseUp' checking|", function () {
          resizableFrameProto.model.set("dragging", true);

          resizableFrameProto.mouseUp({ data: resizableFrameProto });

          expect(resizableFrameProto.model.get("dragging")).toBe(false);
        });

        it("'clearEvent' checking|", function () {
          var event = { cancelBubble: false, returnValue: true };
          resizableFrameProto.clearEvent(event, true, false);

          expect(event.cancelBubble).toBe(true);
          expect(event.returnValue).toBe(false);
        });

        it("'mouseupWindow' checking|", function () {
          resizableFrameProto.model.set("dragging", true);

          resizableFrameProto.mouseupWindow({ data: resizableFrameProto });
          expect(resizableFrameProto.model.get("dragging")).toBe(false);
        });

        it("'mouseMove' checking|", function () {
          resizableFrameProto.model.set("dragging", true);

          var trackCursor = { x: 100, y: 100 };
          resizableFrameProto.model.set("trackCursor", trackCursor);
          try {
            resizableFrameProto.mouseMove({ data: resizableFrameProto });
          }
          catch (e) {
          }
        });        

        it("'mousemoveWindow' checking|", function () {
          resizableFrameProto.model.set("dragging", true);

          resizableFrameProto.mousemoveWindow({ data: resizableFrameProto });
        });

        it("'mouseDown' checking|", function () {
          resizableFrameProto.model.set("dragging", false);

          resizableFrameProto.mouseDown({ data: resizableFrameProto });
          expect(resizableFrameProto.model.get("dragging")).toBe(true);
        });

      });
    };

    if (window.location.host && window.location.host != '') // launching when address to web-page
      window.runTests(setupTests);
    else // launching of the code-coverage estemating
      setupTests($("<div></div>"));

  });
});
