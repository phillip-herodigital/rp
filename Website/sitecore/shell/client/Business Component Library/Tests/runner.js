var pendingTests = [];
define(["sitecore"], function (Sitecore) {
  return Sitecore.Definitions.App.extend({
    initialized: function () {
      if (!window.renderings) {
        return;
      }
      this.runJasmine();
    },
    runJasmine: function () {
      require([
          "/sitecore/shell/client/Business Component Library/tests/vendors/jasmine-1.3.1/jasmine.js",
          "/sitecore/shell/client/Business Component Library/Tests/vendors/jquery.mockjax.js"
        ], function () {
          require([
              "/sitecore/shell/client/Business Component Library/Tests/vendors/jquery.mockjax.settings.js",
              "/sitecore/shell/client/Business Component Library/tests/vendors/jasmine-1.3.1/jasmine-html.js"], function () {

                define("jasmineEnv", renderings, function () {

                  var jasmineEnv = jasmine.getEnv();
                  jasmineEnv.updateInterval = 250;

                  var htmlReporter = new jasmine.HtmlReporter();
                  jasmineEnv.addReporter(htmlReporter);
                  jasmineEnv.specFilter = function (spec) {
                    return htmlReporter.specFilter(spec);
                  };

                  //patch jasmine runner to track the tests are completed
                  var oldCallback = jasmineEnv.currentRunner().finishCallback;
                  jasmineEnv.currentRunner().finishCallback = function () {
                    oldCallback.apply(this, arguments);
                    $("body").append("<div id='_test_complete_signal_'></div>");
                    $("[id*='testArea']").hide();
                  };
                  
                  jasmineEnv.runAllPendingTests = function () {
                    var testSetupFunction, template;

                    if (pendingTests.length === renderings.length) {

                      for (var i in pendingTests) {
                        testSetupFunction = pendingTests[i]["tests"];
                        template = pendingTests[i]["template"];
                        testSetupFunction(template);
                      }
                      
                      jasmineEnv.execute();
                    }
                  };
                  return jasmineEnv;
                });

                require(["jasmineEnv"], function (jasmineEnv) {
                  window.runTests = function (jasmineEnv, setupTests, testTemplateFileName) {

                    if (!testTemplateFileName) {
                      pendingTests.push({ 'tests': setupTests, 'template': "" });
                      jasmineEnv.runAllPendingTests();
                      return;
                    }
                    var uniqId = testTemplateFileName.split(".")[0];
                    var testTemplateFolder = "/sitecore/shell/client/Business Component Library/Tests/renderings/templates/";
                    $.get(testTemplateFolder + testTemplateFileName, function (data) {

                      var testAreaElement = $("<div></div>", {
                        "id": "testArea" + uniqId
                      }).html(data);
                      console.log(testAreaElement);

                      $("body").append(testAreaElement);
                      pendingTests.push({ 'tests': setupTests, 'template': testAreaElement });
                      jasmineEnv.runAllPendingTests();
                    });
                  };

                  window.runComponentTests = function (componentName, descriptor, selector, baseModelName) {
                    "use strict";

                    if (descriptor.base) {
                      baseModelName = descriptor.base;
                    }

                    var testSetup = describe("Given a '" + componentName + "' model", function () {
                      var component = new Sitecore.Definitions.Models[componentName]();

                      describe("when I create a '" + componentName + "' model", function () {
                        _.each(descriptor.attributes, function (attribute) {
                          it("it should have a '" + attribute.name + "' attribute " + attribute.which, function () {
                            expect(component.get(attribute.name)).toBeDefined();
                          });
                        }, this);

                        _.each(descriptor.attributes, function (attribute) {
                          var defaultValueText = attribute.defaultValue;
                          if (_.isArray(attribute.defaultValue)) {
                            defaultValueText = "[]";
                          }

                          if (_.isObject(attribute.defaultValue)) {
                            defaultValueText = "{}";
                          }

                          it("it should set the '" + attribute.name + "' attribute to '" + defaultValueText + "' by default", function () {
                            if (_.isArray(attribute.defaultValue)) {
                              expect(_.isArray(component.get(attribute.name))).toBeTruthy();
                            } else if (_.isObject(attribute.defaultValue)) {
                              expect(_.isObject(component.get(attribute.name))).toBeTruthy();
                            } else {
                              expect(component.get(attribute.name)).toBe(attribute.defaultValue);
                            }
                          });
                        }, this);

                        it("it should have a 'viewModel' property", function () {
                          expect(component.viewModel).toBeDefined();
                        });

                        _.each(descriptor.attributes, function (attribute) {
                          it("it should have a '" + attribute.name + "' function in the 'viewModel'", function () {
                            expect(component.viewModel[attribute.name]).toBeDefined();
                          });
                        }, this);

                        _.each(descriptor.attributes, function (attribute) {
                          var defaultValueText = attribute.defaultValue;
                          if (_.isArray(attribute.defaultValue)) {
                            defaultValueText = "[]";
                          }

                          if (_.isObject(attribute.defaultValue)) {
                            defaultValueText = "{}";
                          }

                          it("it should return '" + defaultValueText + "' when I call the  '" + attribute.name + "' function in the 'viewModel'", function () {
                            if (_.isArray(attribute.defaultValue)) {
                              expect(_.isArray(component.viewModel[attribute.name]())).toBeTruthy();
                            } else if (_.isObject(attribute.defaultValue)) {
                              expect(_.isObject(component.viewModel[attribute.name]())).toBeTruthy();
                            } else {
                              expect(component.viewModel[attribute.name]()).toBe(attribute.defaultValue);
                            }
                          });
                        }, this);
                      });

                      if (baseModelName != "ComponentModel") {
                        describe("when I call 'toggle' when isVisible is 'true'", function () {
                          it("it should set 'isVisible' is false", function () {
                            var c = new Sitecore.Definitions.Models[componentName]();
                            c.toggle();

                            expect(c.get("isVisible")).toBe(false);
                          });
                        });

                        describe("when I call 'toggle' when isVisible is 'false'", function () {
                          it("it should set 'isVisible' is false", function () {
                            var c = new Sitecore.Definitions.Models[componentName]();
                            c.set("isVisible", false);
                            c.toggle();

                            expect(c.get("isVisible")).toBe(true);
                          });
                        });
                      }

                      if (descriptor.describe) {
                        descriptor.describe();
                      }
                    });
                    pendingTests.push({ 'tests': testSetup, 'template': '' });
                    jasmineEnv.runAllPendingTests();
                  };

                });
              });
        });
    }
  });
});


