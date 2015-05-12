
var arResComponents;
if (window.location.host && window.location.host != '') // launching when address to web-page
  arResComponents = ["sitecore", "UnorderedList", "css!UnorderedList"];
else // launching of the code-coverage estemating
  arResComponents = ["sitecore"];

define(arResComponents, function (_sc) {

  describe("UnorderedList testing|", function () {

    var setupTests = function ($pageElem) {

      var unorderedListModel = new _sc.Definitions.Models.UnorderedList();

      var unorderedListProto = _sc.Definitions.Views.UnorderedList.prototype;

      $elem = $pageElem.find(".sc-UnorderedList");

      unorderedListProto.$el = $elem;
      unorderedListProto.model = unorderedListModel;

      try {
        unorderedListProto.initialize({});
      }
      catch (e) {

      }

      describe("Initialization|", function () {

        it("'$elem' must be defined|", function () {
          expect($elem.length).toBeGreaterThan(0);
        });

      });

    };

    if (window.location.host && window.location.host != '') // launching when address to web-page
      window.runTests(setupTests);
    else // launching of the code-coverage estemating
      setupTests($("<div></div>"));

  });
});
