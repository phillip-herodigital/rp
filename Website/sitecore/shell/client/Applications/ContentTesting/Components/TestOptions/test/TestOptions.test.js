var arResComponents;
if (window.location.host && window.location.host != '') // launching when address to web-page
  arResComponents = ["sitecore", "TestOptions", "css!TestOptions"];
else // launching of the code-coverage estemating
  arResComponents = ["sitecore"];

define(arResComponents, function (_sc) {

  describe("TestOptions testing|", function () {

    var setupTests = function ($pageElem) {

      var testOptionsModel = new _sc.TestOptions({ paramTest: 'paramValue' });

      describe("'toJSONString' checking|", function () {
        it("JSON string must be correct|", function () {
          testOptionsModel.initialize({ paramTest: 'paramValue' });

          var stJSON = testOptionsModel.toJSONString();
          var isCorrect = stJSON.indexOf("paramTest") >= 0 && stJSON.indexOf("paramValue") >= 0;
          expect(isCorrect).toBe(true);
        });
      });

    };

    if (window.location.host && window.location.host != '') // launching when address to web-page
      window.runTests(setupTests);
    else // launching of the code-coverage estemating
      setupTests($("<div></div>"));

  });
});
