(function (Speak) {

  // TODO: find a pretty solution for dependency paths
  var collectionPath = "/sitecore/shell/client/Business Component Library/version 2/Layouts/Renderings/Mixins/Collection.js",
    mockPath = "/sitecore/shell/client/Speak/Assets/lib/core/2.0/mock.js";

  define([collectionPath, mockPath], function (Collection) {

    // Create mock component for collection
    Speak.component(
      Speak.extend({}, Collection.prototype, {
        name: "CollectionMock",
        presenter: "scComponentPresenter"
      })
    );

    describe("Given a component with Collection", function () {
      var sut;

      beforeEach(function () {
        var collectionMock = speakMock("CollectionMock", document.createElement("div"));
        collectionMock.run();

        sut = collectionMock.component;
      });

      describe("DynamicData property", function () {
        it("should be defined", function () {
          expect(sut.DynamicData).toBeDefined();
          expect(Array.isArray(sut.DynamicData)).toBe(true);
        });
      });

      describe("Items property", function () {
        it("should by default have copy of DynamicData property", function () {
          // prepare
          var items = [
            { name: "hello", displayName: "Hello world", value: 2 }
          ];

          // act
          sut.reset(items);

          // assert
          expect(sut.Items.length).toBe(sut.DynamicData.length);
          expect(sut.Items[0]).toBe(sut.DynamicData[0]);
          expect(sut.Items).not.toBe(sut.DynamicData);
        });

        it("should dispatch a hook:Items event before it changes", function () {
          // prepare
          var hook,
              spy = {
                eventHandler: function (_hook) {
                  hook = _hook;
                  expect(sut.Items).toBeFalsy();
                }
              };

          var items = [
            { name: "hello", displayName: "Hello world", value: 2 }
          ];

          spyOn(spy, "eventHandler");

          // act
          sut.on("hook:Items", spy.eventHandler);
          sut.reset(items);

          // assert
          expect(spy.eventHandler).toHaveBeenCalled();
        });

        describe("Hook", function () {
          it("should have data property", function () {
            // prepare
            var data = [{ name: "hello" }];

            // act
            var hook;
            sut.on("hook:Items", function (_hook) {hook = _hook; });
            sut.reset(data);

            // assert
            expect(hook.data).toBe(sut.DynamicData);
          });

          it("should have wait property with default value of false", function () {
            // prepare
            var data = [{ name: "hello" }];

            // act
            var hook;
            sut.on("hook:Items", function (_hook) { hook = _hook; });
            sut.reset(data);

            // assert
            expect(hook.wait).toBe(false);
          });

          it("should have result method defined", function () {
            // prepare
            var data = [{ name: "hello" }];

            // act
            var hook;
            sut.on("hook:Items", function (_hook) { hook = _hook; });
            sut.reset(data);

            // assert
            expect(typeof hook.result).toBe("function");
          });

          describe("when wait is true", function() {
            it("should update Items property async, waiting for #result() to be called", function () {
              // prepare
              var data = [{ name: "hello" }],
                newItems = [{ foo: "bar" }];

              // act
              var hook;
              sut.on("hook:Items", function (_hook) {
                hook = _hook;
                hook.wait = true;
              });

              sut.reset(data);

              // assert
              expect(sut.Items).not.toBe(data);
              expect(sut.Items).not.toBe(newItems);

              hook.result(newItems);

              expect(sut.Items).toBe(newItems);
            });
          });

          describe("#result()", function () {
            it("should set Items property", function () {
              // prepare
              var data = [{ name: "hello" }],
                newItems = [{ foo: "bar" }];

              // act
              sut.on("hook:Items", function (hook) {
                hook.result(newItems);
              });

              sut.reset(data);

              // assert
              expect(sut.Items).toBe(newItems);
            });

          });

          describe("Bug #55680:[BUG] Collection triggers change:Items twice", function () {
            var spy;
            beforeEach(function () {
              spy = jasmine.createSpy("change:Items");

              sut.on("hook:Items", function(hookEvent) {
                var result = _.map(hookEvent.data, function(dataObj) {
                  return Speak.extend({ _uniqueId: _.uniqueId() }, dataObj);
                });

                hookEvent.result(result);
              });

              sut.on("change:Items", spy);
            });

            afterEach(function() {
              sut.off("hook:Items");
              sut.off("change:Items");
            });

            it("should trigger \"change:Items\" once", function () {
              // prepare
              

              // act
              sut.reset([{ name: "hello" }]);

              // assert
              expect(spy.calls.count()).toBe(1);
            });
          });
        });
      });

      describe("#reset()", function () {
        it("should remove all items from \"DynamicData\"", function () {
          // prepare
          sut.DynamicData = [
            { name: "hello", displayName: "Hello world", value: 2 },
            { name: "hello", displayName: "Hello world", value: 2 },
            { name: "hello", displayName: "Hello world", value: 2 }
          ];

          // act
          sut.reset();

          // assert
          expect(sut.DynamicData.length).toBe(0);
        });

        it("should remove old items and set the new items provided instead", function () {
          // prepare
          sut.DynamicData = [{ name: "hello", displayName: "Hello world", value: 2 }];

          // act
          var items = [
            { name: "hello", displayName: "Hello world", value: 2 },
            { name: "hello", displayName: "Hello world", value: 2 },
            { name: "hello", displayName: "Hello world", value: 2 }
          ];
          sut.reset(items);

          // assert
          expect(sut.DynamicData.length).toBe(3);
        });

        it("should dispatch a reset event with new items added", function () {
          // prepare
          sut.DynamicData = [{ name: "hello", displayName: "Hello world", value: 2 }];
          var spy = { eventHandler: function () { } };
          spyOn(spy, "eventHandler");

          // act
          sut.on("reset", spy.eventHandler);
          var items = [
            { name: "hello", displayName: "Hello world", value: 2 },
            { name: "hello", displayName: "Hello world", value: 2 },
            { name: "hello", displayName: "Hello world", value: 2 }
          ];
          sut.reset(items);

          // assert
          expect(spy.eventHandler).toHaveBeenCalled();
          expect(spy.eventHandler).toHaveBeenCalledWith(items);
        });

        it("should dispatch a change:DynamicData event", function () {
          // prepare
          var spy = { eventHandler: function () { } };
          spyOn(spy, "eventHandler");

          // act
          sut.on("change:DynamicData", spy.eventHandler);
          sut.reset([
            { name: "hello", displayName: "Hello world", value: 2 },
            { name: "hello", displayName: "Hello world", value: 2 },
            { name: "hello", displayName: "Hello world", value: 2 }
          ]);

          // assert
          expect(spy.eventHandler).toHaveBeenCalled();
        });
      });

      describe("#add()", function () {
        it("should add an object to the \"DynamicData\" property", function () {
          // prepare
          var item = { name: "hello", displayName: "Hello world", value: 2 };

          // act
          sut.add(item);

          // assert
          expect(sut.DynamicData.length).toBe(1);
          expect(sut.at(0)).toBe(item);
        });

        it("should trigger an add event containg added items", function () {
          // prepare
          var item = { name: "hello", displayName: "Hello world", value: 2 };

          var spy = { eventHandler: function () { } };
          spyOn(spy, "eventHandler");

          // act
          sut.on("add", spy.eventHandler);
          sut.add(item);

          // assert
          expect(spy.eventHandler).toHaveBeenCalled();
          expect(spy.eventHandler).toHaveBeenCalledWith(item);
        });

        it("should trigger a change:DynamicData", function () {
          // prepare
          var spy = jasmine.createSpy("change:DynamicData");

          // act
          sut.on("change:DynamicData", spy);
          sut.add({ name: "hello", displayName: "Hello world", value: 2 });

          // assert
          expect(spy).toHaveBeenCalled();
        });

        it("should trigger a change:Items", function () {
          // prepare
          var spy = jasmine.createSpy("change:Items");

          // act
          sut.on("change:Items", spy);
          sut.add({ name: "hello", displayName: "Hello world", value: 2 });

          // assert
          expect(spy).toHaveBeenCalled();
        });
      });

      describe("#remove()", function () {
        it("should remove an already excisting item from \"DynamicData\" property", function () {
          // prepare
          var item = { name: "hello", displayName: "Hello world", value: 2 };
          sut.add(item);
          expect(sut.DynamicData.length).toBe(1);

          // act
          sut.remove(item);

          // assert
          expect(sut.DynamicData.length).toBe(0);
        });

        it("should trigger a remove event containing removed item", function () {
          // prepare
          sut.reset([
            { name: "hello", displayName: "Hello world", value: 2 },
            { name: "hello", displayName: "Hello world", value: 2 },
            { name: "hello", displayName: "Hello world", value: 2 }
          ]);

          var item = sut.at(2),
            spy = { eventHandler: function () { } };
          spyOn(spy, "eventHandler");

          // act
          sut.on("remove", spy.eventHandler);
          sut.remove(item);

          // assert
          expect(spy.eventHandler).toHaveBeenCalled();
          expect(spy.eventHandler).toHaveBeenCalledWith(item);
        });

        it("should trigger a change:DynamicData", function () {
          // prepare
          sut.reset([
            { name: "hello", displayName: "Hello world", value: 2 },
            { name: "hello", displayName: "Hello world", value: 2 },
            { name: "hello", displayName: "Hello world", value: 2 }
          ]);

          var item = sut.at(2),
            spy = { eventHandler: function () { } };
          spyOn(spy, "eventHandler");

          // act
          sut.on("change:DynamicData", spy.eventHandler);
          sut.remove(item);

          // assert
          expect(spy.eventHandler).toHaveBeenCalled();
        });

        it("should throw an exception if item doesn't exist", function () {
          // prepare
          sut.reset([{ name: "foo" }]);
          var item = { name: "bar" };

          // act
          var act = function () {
            sut.remove(item);
          };

          // assert
          expect(act).toThrow("Item does not exist and cannot be removed");
        });
      });

      describe("removeAt()", function() {
        it("should remove an already excisting item from \"DynamicData\" property", function () {
          // prepare
          var item = { name: "hello", displayName: "Hello world", value: 2 };
          sut.add(item);
          expect(sut.DynamicData.length).toBe(1);

          // act
          sut.removeAt(0);

          // assert
          expect(sut.DynamicData.length).toBe(0);
        });

        it("should trigger a remove event containing removed item", function () {
          // prepare
          sut.reset([
            { name: "hello", displayName: "Hello world", value: 2 },
            { name: "hello", displayName: "Hello world", value: 2 },
            { name: "hello", displayName: "Hello world", value: 2 }
          ]);

          var spy = { eventHandler: function () { } };
          spyOn(spy, "eventHandler");

          // act
          sut.on("remove", spy.eventHandler);
          sut.removeAt(2);

          // assert
          expect(spy.eventHandler).toHaveBeenCalled();
        });

        it("should trigger a change:DynamicData", function () {
          // prepare
          sut.reset([
            { name: "hello", displayName: "Hello world", value: 2 },
            { name: "hello", displayName: "Hello world", value: 2 },
            { name: "hello", displayName: "Hello world", value: 2 }
          ]);

          var spy = { eventHandler: function () { } };
          spyOn(spy, "eventHandler");

          // act
          sut.on("change:DynamicData", spy.eventHandler);
          sut.removeAt(2);

          // assert
          expect(spy.eventHandler).toHaveBeenCalled();
        });

        it("should throw an exception if item doesn't exist", function () {
          // prepare
          sut.reset([{ name: "foo" }]);
          
          // act
          var act = function () {
            sut.removeAt(10);
          };

          // assert
          expect(act).toThrow("Item does not exist and cannot be removed");
        });
      });

      describe("#findWhere()", function () {
        it("should return the first item matching the given attributes", function () {
          // prepare
          sut.reset([
            { name: "kee", value: "for" },
            { name: "kee", value: "bar" },
            { name: "kee", value: "bar" }
          ]);

          // act
          var item = sut.findWhere({ name: "kee", value: "bar" });

          // assert
          expect(item).toBe(sut.at(1));
        });
      });

      describe("#at()", function () {
        it("should return the item at the given index", function () {
          // prepare
          sut.reset([
            { name: "kee", value: "for" },
            { name: "kee", value: "bar" },
            { name: "kee", value: "bar" }
          ]);

          // act
          var item = sut.at(1);

          // assert
          expect(item).toBe(sut.DynamicData[1]);
        });
      });

      describe("#getByValue()", function() {
        it("should return first item that contains given value", function() {
          // prepare
          sut.reset([
            { name: "kee", value: "for" },
            { name: "kee", value: "bar" },
            { name: "kee", value: "bar" }
          ]);

          sut.ValueFieldName = "value";

          // act
          var item = sut.getByValue("bar");

          // assert
          expect(item).toBe(sut.DynamicData[1]);
        });
      });

      describe("#indexOf()", function () {
        it("should return the index of the item", function () {
          // prepare
          sut.reset([
            { name: "kee", value: "for" },
            { name: "kee", value: "bar" },
            { name: "kee", value: "bar" }
          ]);

          // act
          var index = sut.indexOf(sut.at(1));

          // assert
          expect(index).toBe(1);
        });
      });

      describe("#contains()", function () {
        it("should return true when given item is found in the collection", function () {
          // prepare
          sut.reset([
            { name: "kee", value: "for" },
            { name: "kee", value: "bar" },
            { name: "kee", value: "bar" }
          ]);

          // act
          var contains = sut.contains(sut.at(1));

          // assert
          expect(contains).toBe(true);
        });

        it("should return false when given item is not found in the collection", function () {
          // prepare
          sut.reset([
            { name: "kee", value: "for" },
            { name: "kee", value: "bar" },
            { name: "kee", value: "bar" }
          ]);

          // act
          var contains = sut.contains({ name: "baz" });

          // assert
          expect(contains).toBe(false);
        });
      });

      describe("#hasData()", function () {
        it("should return true if DynamicData has items", function () {
          // prepare
          sut.reset([
            { name: "kee", value: "for" },
            { name: "kee", value: "bar" },
            { name: "kee", value: "bar" }
          ]);

          // act
          var hasData = sut.hasData();

          // assert
          expect(hasData).toBe(true);
        });

        it("should return false if DynamicData is empty", function () {
          // prepare
          sut.reset([]);

          // act
          var hasData = sut.hasData();

          // assert
          expect(hasData).toBe(false);
        });
      });

      describe("#getValue()", function () {
        it("should return the value of the property defined by ValueFieldName property", function () {
          var item = { name: "something", value: 1 };

          // act
          sut.ValueFieldName = "name";

          // assert
          expect(sut.getValue(item)).toBe("something");
        });
      });

      describe("#getDisplayName()", function () {
        it("should return the value of the property defined by DisplayFieldName property", function () {
          var item = { name: "something", value: 1, myDisplayName: "foo" };

          // act
          sut.DisplayFieldName = "myDisplayName";

          // assert
          expect(sut.getDisplayName(item)).toBe("foo");
        });
      });

      describe("#getNumOfItems()", function () {
        it("should return the number of items in the collection", function () {
          // prepare
          var arr = [
            { name: "kee", value: "for" },
            { name: "kee", value: "bar" },
            { name: "kee", value: "bar" }
          ];
          sut.reset(arr);

          // act
          var numOfItems = sut.getNumOfItems();

          // assert
          expect(arr.length).toBe(numOfItems);
        });
      });
    });

    describe("Given you don't need all Collection features", function() {

      describe("#Collection.assemble()", function() {

        it("should create a custom version with only basic methods that handle DynamicData", function() {
          var BasicCollection = Collection.assemble();
          expect(BasicCollection.prototype.getValue).not.toBeDefined();
          expect(BasicCollection.prototype.getDisplayName).not.toBeDefined();
        });

        describe("with 'DisplayFieldName' option set", function() {
          it("it should have DisplayFieldName related methods", function () {
            var DisplayFieldCollection = Collection.assemble({ DisplayFieldName: true });
            expect(DisplayFieldCollection.prototype.getDisplayName).toBeDefined();
          });
        });

        describe("with 'ValueFieldName' option set", function () {
          it("it should have ValueFieldName related methods", function () {
            var ValueFieldCollection = Collection.assemble({ ValueFieldName: true });
            expect(ValueFieldCollection.prototype.getValue).toBeDefined();
          });
        });
      });

    });
  });

})(Sitecore.Speak);

