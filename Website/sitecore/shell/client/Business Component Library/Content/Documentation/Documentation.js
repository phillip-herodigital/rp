define(["sitecore", "knockout"], function (Sitecore, ko) {
  return Sitecore.Definitions.App.extend({
    initialized: function () {
      if (!window.rendering) {
        return;
      }

      this.getMembers(ko);
      this.runJasmine();
    },

    getMembers: function () {
      try {
        var componentname = rendering.itemName.toLowerCase();
        var component = _.find(Sitecore.Components, function (c) {
          return c.type.toLowerCase() == componentname;
        });

        var data = {
          modelMembers: new Array(),
          viewMembers: new Array()
        };

        if (component != null) {
          var model = new component.model({ isDocumenting: true });
          for (var key in model.attributes) {
            if (key == "isDocumenting") {
              continue;
            }
              
            data.modelMembers.push({ name: key });
          }

          var view = new component.view({ el: null, model: model, isDocumenting: true });
          for (var key in view.applicableFunctionsFromView) {
            var f = view.applicableFunctionsFromView[key];
            if (f === "_scInit" || f === "_scInitFromObject") {
              continue;
            }

            var summary = this.getSummary(view[f].toString());
            data.viewMembers.push({ name: f, summary: summary });
          }
        }

        $("#modelMembersSection").toggle(data.modelMembers.length > 0);
        $("#viewMembersSection").toggle(data.viewMembers.length > 0);

        ko.applyBindings(data, $("#modelMembers").get(0));
        ko.applyBindings(data, $("#viewMembers").get(0));
      }
      catch (e) {
        alert("The Model Members and View Members section cannot be rendered as an empty control could not be created.\n\n" + e);
      }
    },
    
    getSummary: function (code) {
      var n = code.indexOf("/// <summary>");
      if (n < 0) {
        return "";
      }
      
      var summary = code.substr(n + 13);
      n = summary.indexOf("</summary>");
      if (n < 0) {
        return "";
      }

      summary = summary.substr(0, n);

      return summary;
    },

    runJasmine: function () {
      if (rendering.testFileName == "") {
        return;
      }

      require([
          "/sitecore/shell/client/Business Component Library/Tests/vendors/jasmine-1.3.1/jasmine.js",
          "/sitecore/shell/client/Business Component Library/Tests/vendors/jquery.mockjax.js"
        ], function () {
          require([
              "/sitecore/shell/client/Business Component Library/Tests/vendors/jquery.mockjax.settings.js",
              //"/sitecore/shell/client/Speak/Tests/vendors/jasmine-1.3.1/jasmine!css",
              "/sitecore/shell/client/Business Component Library/tests/vendors/jasmine-1.3.1/jasmine-html.js"], function () {

                define("jasmineEnv", [rendering.testFileName], function () {
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
                    $("#HTMLReporter").appendTo($("#jasmine_report"));
                    $("[id*='testArea']").hide();
                  };

                  return jasmineEnv;
                });

                require(["jasmineEnv"], function () {
                  window.runTests = function (jasmineEnv, setupTests, testTemplateFileName) {
                    if (!testTemplateFileName) {
                      setupTests();
                      jasmineEnv.execute();
                      return;
                    }
                    var uniqId = testTemplateFileName.split(".")[0];
                    var testTemplateFolder = "/sitecore/shell/client/Business Component Library/Tests/renderings/templates/";
                    $.get(testTemplateFolder + testTemplateFileName, function (data) {
                      var testAreaElement = $("<div></div>", {
                        "id": "testArea" + uniqId
                      }).html(data);

                      $("body").append(testAreaElement);

                      setupTests(testAreaElement);

                      jasmineEnv.execute();
                    });
                  };

                  window.runComponentTests = function (componentName, descriptor, selector, baseModelName) {
                    "use strict";

                    if (descriptor.base) {
                      baseModelName = descriptor.base;
                    }

                    describe("Given a '" + componentName + "' model", function () {
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
                  }
                });
              });
        });
    }
  });
});

