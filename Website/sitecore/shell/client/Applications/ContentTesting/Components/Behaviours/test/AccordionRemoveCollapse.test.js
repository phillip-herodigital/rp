
var arResComponents;
if (window.location.host && window.location.host != '') // launching when address to web-page
  arResComponents = ["sitecore", "AccordionRemoveCollapse", "css!AccordionRemoveCollapse"];
else // launching of the code-coverage estemating
  arResComponents = ["sitecore"];

define(arResComponents, function (_sc) {

  describe("AccordionRemoveCollapse testing|", function () {

    var setupTests = function ($pageElem) {

      var accordionRemoveBehaviour = _sc.Behaviors.AccordionRemoveCollapse;
      accordionRemoveBehaviour.initialize();

      describe("Working|", function () {
        it("'beforeRender' checking|", function () {          
          try {
            accordionRemoveBehaviour.beforeRender();
          }
          catch (e) { }
          
          var isElemRemoved = typeof accordionRemoveBehaviour.$el == 'undefined' || (accordionRemoveBehaviour.$el.find("td.sc-accordion-header-chevron")).length == 0;
          expect(isElemRemoved).toBe(true);
        });

      });

    };

    if (window.location.host && window.location.host != '') // launching when address to web-page
      window.runTests(setupTests);
    else // launching of the code-coverage estemating
      setupTests($("<div></div>"));

  });
});
