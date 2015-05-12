
var arResComponents;
if (window.location.host && window.location.host != '') // launching when address to web-page
  arResComponents = ["sitecore", "QueryStringParameterResolver", "css!QueryStringParameterResolver"];
else // launching of the code-coverage estemating
  arResComponents = ["sitecore"];

define(arResComponents, function (_sc) {

  describe("QueryStringParameterResolver testing|", function () {

    var setupTests = function ($pageElem) {

      var queryStrParamModel = new _sc.Definitions.Models.QueryStringParameterResolver();

      var queryStrParamProto = _sc.Definitions.Views.QueryStringParameterResolver.prototype;

      $elem = $pageElem.find(".sc-QueryStringParameterResolver");

      queryStrParamProto.$el = $elem;
      queryStrParamProto.model = queryStrParamModel;

      try {
        queryStrParamProto.initialize({});
      }
      catch (e) {
      }

      describe("Initialization|", function () {
        it("'$elem' must be defined|", function () {
          expect($elem.length).toBeGreaterThan(0);
        });
      });

      //describe("Resolving parameters|", function () {        
      //  it("Parameters must be resolved|", function () {
      //    var paramName = "p1";
      //    var paramValue = "10";
      //    var stParam = paramName + "=" + paramValue;
      //    if (window.location.href.indexOf(stParam) < 0) {
      //      if (window.location.href.indexOf("?") >= 0)
      //        window.location.href += "&" + stParam;
      //      else
      //        window.location.href += "?" + stParam;
      //    }

      //    queryStrParamProto.model.set("parameterName", paramName);
      //    queryStrParamProto.model.resolveParameter();

      //    expect(queryStrParamProto.model.get("value")).toEqual(paramValue);
      //  });
      //});

    };

    if (window.location.host && window.location.host != '') // launching when address to web-page
      window.runTests(setupTests);
    else // launching of the code-coverage estemating
      setupTests($("<div></div>"));

  });
});
