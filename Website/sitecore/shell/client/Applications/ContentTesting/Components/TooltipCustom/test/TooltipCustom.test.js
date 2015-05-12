
var arResComponents;
if (window.location.host && window.location.host != '') // launching when address to web-page
  arResComponents = ["sitecore", "TooltipCustom"];
else // launching of the code-coverage estemating
  arResComponents = ["sitecore"];

define(arResComponents, function (_sc) {

  describe("TooltipCustomTest testing|", function () {

    var setupTests = function ($pageElem) {

      var tooltip = new TooltipCustom(false);
      var tooltipId = tooltip.getId();

      $tooltipElem = $("body").find("#" + tooltipId);
      $tooltipElem.remove();
      $pageElem.append($tooltipElem);

      describe("Initialization|", function () {

        it("'#tooltipElem' must be defined|", function () {
          expect($tooltipElem.length).toBeGreaterThan(0);
        });

        it("checking 'cssStyleAdd()'  - adding css-styles|", function () {

          var isTooltipStyleExist = false;
          if ($("body").find("style").length > 0 && $("body").find("style")[0].innerHTML.indexOf("tooltipCustom") >= 0) {
            isTooltipStyleExist = true;
          }

          expect(isTooltipStyleExist).toEqual(true);
        });        

      });

      describe("Rendering|", function () {

        it("'show' checking|", function () {
          tooltip.show(100, 1, "tooltip Message");

          var isDisplayVisible = false;
          isDisplayVisible = $tooltipElem.css("display") == "block" || $tooltipElem.css("display") == "inline";
          expect(isDisplayVisible).toEqual(true);
        });

        it("'hide' checking|", function () {
          tooltip.hide(100, 1, "tooltip Message");

          expect($tooltipElem.css("display")).toEqual("none");
        });

        it("'showElem' checking|", function () {
          tooltip.showElem(100, 1, "tooltip Message");

          var isDisplayVisible = false;
          isDisplayVisible = $tooltipElem.css("display") == "block" || $tooltipElem.css("display") == "inline";
          expect(isDisplayVisible).toEqual(true);

          expect($tooltipElem.css("left")).toEqual("100px");
          expect($tooltipElem.css("top")).toEqual("1px");
        });

        it("'showCorrect' checking|", function () {
          tooltip.showCorrect(100, 1, "tooltip Message");

          var isDisplayVisible = false;
          isDisplayVisible = $tooltipElem.css("display") == "block" || $tooltipElem.css("display") == "inline";
          expect(isDisplayVisible).toEqual(true);
        });

        //it("'setTarget' checking|", function () {
        //  var buttonTestHtml = "<input id='btnTest' type='button'></input>";
        //  $tooltipElem.parent().append(buttonTestHtml);
        //  var $btnTest = $tooltipElem.parent().find("#btnTest");

        //  tooltip.setTarget($btnTest[0], "tooltip Message");          
        //});

      });


    };

    if (window.location.host && window.location.host != '') // launching when address to web-page
      window.runTests(setupTests);
    else // launching of the code-coverage estemating
      setupTests($("<div></div>"));

  });

});
