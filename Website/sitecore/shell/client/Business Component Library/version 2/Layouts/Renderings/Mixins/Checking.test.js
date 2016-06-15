(function (Speak) {

  require.config({
    paths: {
      checking: "/sitecore/shell/client/Business Component Library/version 2/Layouts/Renderings/Mixins/Checking",
      selection: "/sitecore/shell/client/Business Component Library/version 2/Layouts/Renderings/Mixins/Selection",
      collection: "/sitecore/shell/client/Business Component Library/version 2/Layouts/Renderings/Mixins/Collection",
      mock: "/sitecore/shell/client/Speak/Assets/lib/core/2.0/mock"
    }
  });

  define( ["checking", "selection", "collection", "mock"], function (Checking, Selection, Collection ) {

    // Create mock component for collection
    Speak.component(
      Speak.extend({}, Collection.prototype, Selection.prototype, Checking.prototype, {
        name: "CheckingMock",
        presenter: "scComponentPresenter",
        initialized: function () {
          Collection.prototype.initialized.call(this);
          Selection.prototype.initialized.call(this);
          Checking.prototype.initialized.call(this);
        }
      })
    );

    describe("Given a Checking", function () {
      var sut;

      beforeEach(function () {
          var checkingMock = speakMock( "CheckingMock", document.createElement( "div" ) );

        sut = checkingMock.component;
        sut.defineProperty("ValueFieldName", "itemId");
        sut.defineProperty("CheckedItems", []);
        sut.defineProperty("CheckedValues", []);

        checkingMock.run();
      });

      describe("#check()", function () {
        it("should add given items to CheckedItems property", function () {
          // prepares
          var items = [
            { name: "something1" },
            { name: "something2" },
            { name: "something3" },
            { name: "something4" }
          ];
          sut.ValueFieldName = "name";
          sut.reset(items);
          sut.CheckedItems = [items[0]];

          // act
          sut.check([items[1], items[2]]);

          // assert
          expect(sut.CheckedItems[0]).toBe(items[0]);
          expect(sut.CheckedItems[1]).toBe(items[1]);
          expect(sut.CheckedItems[2]).toBe(items[2]);
          expect(sut.CheckedItems.length).toBe(3);
        });

        it("should trigger a change on CheckedItems", function () {
          // prepares
          var jasmineSpy = jasmine.createSpy();
          var items = [
            { name: "something11" },
            { name: "something12" }
          ];
          var items2 = [
            { name: "something21" },
            { name: "something22" }
          ];
          sut.ValueFieldName = "name";
          sut.reset(items.concat(items2));

          // act
          sut.on("change:CheckedItems", jasmineSpy);
          sut.check(items);
          sut.check(items2);

          // assert
          expect(jasmineSpy.calls.count()).toBe(2);
        });

        it("should also update CheckedValues", function () {
          // prepares
          var items = [
            { name: "something1" },
            { name: "something2" }
          ];
          sut.ValueFieldName = "name";
          sut.reset(items);

          // act
          sut.check(items);

          // assert
          expect(sut.CheckedValues[0]).toBe("something1");
          expect(sut.CheckedValues[1]).toBe("something2");
        });
      });

      describe("#checkByValues()", function () {
        it("should update CheckedItems property with items matching the values", function () {
          // prepares
          var items = [
            { name: "something1" },
            { name: "something2" }
          ];
          sut.ValueFieldName = "name";
          sut.reset(items);

          // act
          sut.checkByValues(["something1", "something2"]);

          // assert
          expect(sut.CheckedItems[0]).toBe(items[0]);
          expect(sut.CheckedItems[1]).toBe(items[1]);
        });

        it("should update CheckedValues property with items matching the values", function () {
          // prepares
          var items = [
            { name: "something1" },
            { name: "something2" }
          ];
          sut.ValueFieldName = "name";
          sut.reset(items);

          // act
          sut.checkByValues(["something1", "something2"]);

          // assert
          expect(sut.CheckedValues[0]).toBe(items[0].name);
          expect(sut.CheckedValues[1]).toBe(items[1].name);
        });
      });

      describe("#uncheck()", function () {
        it("should update CheckedItems property with the matching items", function () {
          // prepares
          var items = [
            { name: "something1" },
            { name: "something2" },
            { name: "something3" }
          ];
          sut.ValueFieldName = "name";
          sut.reset(items);
          sut.check(items);

          // act
          sut.uncheck([items[0], items[2]]);

          // assert
          expect(sut.CheckedItems[0]).toBe(items[1]);
        });

        it("should update CheckedValues property with the matching items", function () {
          // prepares
          var items = [
            { name: "something1" },
            { name: "something2" },
            { name: "something3" }
          ];
          sut.ValueFieldName = "name";
          sut.reset(items);
          sut.check(items);

          // act
          sut.uncheck([items[0], items[2]]);

          // assert
          expect(sut.CheckedValues[0]).toBe(items[1].name);
        });
      });

      describe("#uncheckAt()", function () {
        it("should update CheckedItems property without the given indexes", function () {
          // prepares
          var items = [
            { name: "something1" },
            { name: "something2" },
            { name: "something3" }
          ];
          sut.ValueFieldName = "name";
          sut.reset(items);
          sut.check(items);

          // act
          sut.uncheckAt([1]);

          // assert
          expect(sut.CheckedItems[0]).toBe(items[0]);
          expect(sut.CheckedItems[1]).toBe(items[2]);
        });
      });

      describe("#checkAt()", function () {
        it("should update CheckedItems property with the given indexes", function () {
          // prepares
          var items = [
            { name: "something1" },
            { name: "something2" },
            { name: "something3" }
          ];
          sut.ValueFieldName = "name";
          sut.reset(items);

          // act
          sut.checkAt([1]);

          // assert
          expect(sut.CheckedItems[0]).toBe(items[1]);
        });
      });

      describe("#isChecked()", function () {
        it("should return true if item is in CheckedItem", function () {
          // prepares
          var items = [
            { name: "something1" },
            { name: "something2" },
            { name: "something3" }
          ];
          sut.ValueFieldName = "name";
          sut.reset(items);
          sut.check([items[0]]);

          // act
          var isChecked = sut.isChecked(items[0]);

          // assert
          expect(isChecked).toBe(true);
        });
        it("should return false if item is not in CheckedItem", function () {
          // prepares
          var items = [
            { name: "something1" },
            { name: "something2" },
            { name: "something3" }
          ];
          sut.ValueFieldName = "name";
          sut.reset(items);

          // act
          var isChecked = sut.isChecked(items[0]);

          // assert
          expect(isChecked).toBe(false);
        });
      });

      describe("#toggleCheck()", function () {
        it("should check the item, if it is not in the CheckedItems", function () {
          // prepares
          var items = [
            { name: "something1" },
            { name: "something2" },
            { name: "something3" }
          ];
          sut.ValueFieldName = "name";
          sut.reset(items);
          sut.check([items[0]]);

          // act
          sut.toggleCheck(items[2]);

          // assert
          expect(sut.CheckedItems[1]).toBe(items[2]);
        });

        it("should not check the item, if it is in the CheckedItems", function () {
          // prepares
          var items = [
            { name: "something1" },
            { name: "something2" },
            { name: "something3" }
          ];
          sut.ValueFieldName = "name";
          sut.reset(items);
          sut.check([items[0], items[1]]);

          // act
          sut.toggleCheck(items[0]);

          // assert
          expect(sut.CheckedItems[0]).toBe(items[1]);
        });
      });

      describe("#toggleCheckAt()", function () {
        it("should check the item at given index, if it is not in the CheckedItems", function () {
          // prepares
          var items = [
            { name: "something1" },
            { name: "something2" },
            { name: "something3" }
          ];
          sut.ValueFieldName = "name";
          sut.reset(items);
          sut.check([items[0]]);

          // act
          sut.toggleCheckAt(1);

          // assert
          expect(sut.CheckedItems[1]).toBe(items[1]);
        });

        it("should not check the item at given index, if it is in the CheckedItems", function () {
          // prepares
          var items = [
            { name: "something1" },
            { name: "something2" },
            { name: "something3" }
          ];
          sut.ValueFieldName = "name";
          sut.reset(items);
          sut.check([items[0], items[2]]);

          // act
          sut.toggleCheckAt(0);

          // assert
          expect(sut.CheckedItems[0]).toBe(items[2]);
        });
      });

      describe("#checkAll()", function () {
        it("should check all items", function () {
          // prepares
          var items = [
            { name: "something1" },
            { name: "something2" },
            { name: "something3" }
          ];
          sut.ValueFieldName = "name";
          sut.reset(items);

          // act
          sut.checkAll();

          // assert
          expect(sut.CheckedItems[0]).toBe(items[0]);
          expect(sut.CheckedItems[1]).toBe(items[1]);
          expect(sut.CheckedItems[2]).toBe(items[2]);
          expect(sut.CheckedItems.length).toBe(3);
        });
      });

      describe("#uncheckAll()", function () {
        it("should uncheck all items", function () {
          // prepares
          var items = [
            { name: "something1" },
            { name: "something2" },
            { name: "something3" }
          ];
          sut.ValueFieldName = "name";
          sut.reset(items);
          sut.checkAll();

          // act
          sut.uncheckAll();

          // assert
          expect(sut.CheckedItems.length).toBe(0);
        });
      });

      describe("#setCheckedValues()", function () {
        it("should lookup items by given values and update CheckedValues and CheckedItems", function () {
          // prepares
          var items = [
            { name: "something1" },
            { name: "something2" },
            { name: "something3" }
          ];
          sut.ValueFieldName = "name";
          sut.reset(items);

          // act
          sut.setCheckedValues(["something1", "something3"]);

          // assert
          expect(sut.CheckedItems[0]).toBe(items[0]);
          expect(sut.CheckedItems[1]).toBe(items[2]);
          expect(sut.CheckedItems.length).toBe(2);
          expect(sut.CheckedValues[0]).toBe(items[0].name);
          expect(sut.CheckedValues[1]).toBe(items[2].name);
          expect(sut.CheckedValues.length).toBe(2);
        });

        it("should not trigger change events, if given values are already in CheckedValues", function () {
          // prepares
          var items = [
            { name: "something1" },
            { name: "something2" },
            { name: "something3" }
          ],
            jasmineSpy = jasmine.createSpy();
          sut.ValueFieldName = "name";
          sut.reset(items);
          sut.check([items[0], items[2]]);

          // act
          sut.on("change:CheckedItems change:CheckedValues", jasmineSpy);
          sut.setCheckedValues(["something1", "something3"]);

          // assert
          expect(jasmineSpy).not.toHaveBeenCalled();
        });
      });

      describe("#setCheckedItems()", function () {
        it("should update CheckedItems with given items and CheckedValues by their values", function () {
          // prepares
          var items = [
            { name: "something1" },
            { name: "something2" },
            { name: "something3" }
          ];
          sut.ValueFieldName = "name";
          sut.reset(items);

          // act
          sut.setCheckedItems([items[2], items[0]]);

          // assert
          expect(sut.CheckedItems[0]).toBe(items[2]);
          expect(sut.CheckedItems[1]).toBe(items[0]);
          expect(sut.CheckedItems.length).toBe(2);
          expect(sut.CheckedValues[0]).toBe(items[2].name);
          expect(sut.CheckedValues[1]).toBe(items[0].name);
          expect(sut.CheckedValues.length).toBe(2);
        });

        it("should not trigger change events, if given items are already in CheckedItems", function () {
          // prepares
          var items = [
            { name: "something1" },
            { name: "something2" },
            { name: "something3" }
          ],
            jasmineSpy = jasmine.createSpy();
          sut.ValueFieldName = "name";
          sut.reset(items);
          sut.check([items[0], items[2]]);

          // act
          sut.on("change:CheckedItems change:CheckedValues", jasmineSpy);
          sut.setCheckedItems([items[0], items[2]]);

          // assert
          expect(jasmineSpy).not.toHaveBeenCalled();
        });
      });

      describe("#hasCheckedItems()", function () {
        it("should return true if CheckedItems contains items", function () {
          // prepares
          var items = [
            { name: "something1" }
          ];
          sut.ValueFieldName = "name";
          sut.reset(items);

          // act
          sut.checkAt([0]);

          // assert
          expect(sut.hasCheckedItems()).toBe(true);
        });

        it("should return false if CheckedItems does not contains items", function () {
          // prepares
          var items = [
            { name: "something1" }
          ];
          sut.ValueFieldName = "name";
          sut.reset(items);

          // act

          // assert
          expect(sut.hasCheckedItems()).toBe(false);
        });
      });

      describe("#change:CheckedValues", function () {
        it("should update CheckedItems to match CheckedValues, when values are added", function () {
          // prepares
          var items = [
            { name: "something1" },
            { name: "something2" },
            { name: "something3" }
          ];
          sut.ValueFieldName = "name";
          sut.reset(items);

          // act
          sut.CheckedValues = ["something1", "something3"];

          // assert
          expect(sut.CheckedItems[0]).toBe(items[0]);
          expect(sut.CheckedItems[1]).toBe(items[2]);
          expect(sut.CheckedItems.length).toBe(2);
        });

        it("should update CheckedItems to match CheckedValues, when values are removed", function () {
          // prepares
          var items = [
            { name: "something1" },
            { name: "something2" },
            { name: "something3" }
          ];
          sut.ValueFieldName = "name";
          sut.reset(items);
          sut.checkAll();

          // act
          sut.CheckedValues = ["something2", "something3"];

          // assert
          expect(sut.CheckedItems[0]).toBe(items[1]);
          expect(sut.CheckedItems[1]).toBe(items[2]);
          expect(sut.CheckedItems.length).toBe(2);
        });
      });

      describe("#change:CheckedItems", function () {
        it("should update CheckedValues to match CheckedItems, when items are added", function () {
          // prepares
          var items = [
            { name: "something1" },
            { name: "something2" },
            { name: "something3" }
          ];
          sut.ValueFieldName = "name";
          sut.reset(items);

          // act
          sut.CheckedItems = [items[1]];

          // assert
          expect(sut.CheckedValues[0]).toBe(items[1].name);
          expect(sut.CheckedValues.length).toBe(1);
        });

        it("should update CheckedValues to match CheckedItems, when values are removed", function () {
          // prepares
          var items = [
            { name: "something1" },
            { name: "something2" },
            { name: "something3" }
          ];
          sut.ValueFieldName = "name";
          sut.reset(items);
          sut.checkAll();

          // act
          sut.CheckedItems = [items[2]];

          // assert
          expect(sut.CheckedValues[0]).toBe(items[2].name);
          expect(sut.CheckedValues.length).toBe(1);
        });
      });
    });
  });

})(Sitecore.Speak);

