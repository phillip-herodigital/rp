(function (Speak) {

  require.config({
    paths: {
      multiSelection: "/sitecore/shell/client/Business Component Library/version 2/Layouts/Renderings/Mixins/MultiSelection",
      collection: "/sitecore/shell/client/Business Component Library/version 2/Layouts/Renderings/Mixins/Collection",
      mock: "/sitecore/shell/client/Speak/Assets/lib/core/2.0/mock"
    }
  });

  define( ["multiSelection", "collection", "mock"], function(MultiSelection, Collection) {

    // Create mock component for collection
    Speak.component(
      Speak.extend( {}, Collection.prototype, MultiSelection.prototype, {
        name: "MultiSelectionMock",
        presenter: "scComponentPresenter",
        initialized: function () {
          Collection.prototype.initialized.call(this);
          MultiSelection.prototype.initialized.call( this );
        }
      })
    );

    describe("Given a Selection", function () {
      var sut;

      beforeEach(function () {
          var selectionMock = speakMock( "MultiSelectionMock", document.createElement( "div" ) );

        sut = selectionMock.component;
        sut.defineProperty("DisplayFieldName", "$displayName");
        sut.defineProperty("ValueFieldName", "$itemId");
        sut.defineProperty("SelectedItems", []);
        sut.defineProperty("SelectedValues", []);

        selectionMock.run();
      });

      describe("SelectedItems property", function () {
        it("should be defined", function () {
          expect(sut.SelectedItems).toBeDefined();
        });

        it("should update the SelectedValues property", function () {
          // prepare
          var items = [{ name: "something", value: 1 }];
          sut.ValueFieldName = "value";
          sut.reset( items );

          // act
          sut.SelectedItems = items;

          // assert
          expect(sut.SelectedValues.length).toBe(1);
        });
      });

      describe("SelectedValues property", function () {
        it("should be defined", function () {
          expect(sut.SelectedValues).toBeDefined();
        });
      });

      describe("ValueFieldName property", function () {
        it("should be defined", function () {
          expect(sut.ValueFieldName).toBeDefined();
        });
      });

      describe("DisplayFieldName property", function () {
        it("should be defined", function () {
          expect(sut.DisplayFieldName).toBeDefined();
        });
      });

      describe("when DynamicData dependency changes", function () {
        it("it should set first item as selectedItem", function () {
          // prepare
          var item = { value: 4 };
          sut.ValueFieldName = "value";
          sut.reset([item]);
          sut.SelectedItem = item;

          var newitems = [{ value: 1 }, { value: 2 }, { value: 3 }];

          // act
          sut.reset(newitems);

          // assert
          expect(sut.SelectedItems[0]).toBe(newitems[0]);
        });

        describe("with default SelectedValues set", function () {
          beforeEach(function () {
            var selectionMock = speakMock( "MultiSelectionMock", document.createElement( "div" ) );

            sut = selectionMock.component;
            sut.defineProperty("DisplayFieldName", "$displayName");
            sut.defineProperty("ValueFieldName", "$itemId");
            sut.defineProperty("SelectedItems", []);
            sut.defineProperty("SelectedValues", ["foo"]);

            selectionMock.run();
          });

          it("it should select the first item with that value as SelectedItems", function() {
            // prepare
            sut.ValueFieldName = "value";
            var newitems = [{ value: 1 }, { value: 2 }, { value: "foo"}];

            // act
            sut.reset(newitems);

            // assert
            expect(sut.SelectedItems[0]).toBe(newitems[2]);
          });


        });

        describe("and still includes previous selection", function () {
          it("selectedItems should not change", function () {
            // prepare
            var item = { value: 1 };
            sut.ValueFieldName = "value";
            sut.reset([item]);
            sut.SelectedItem = item;

            var newitems = [{ value: 2 }, { value: 3 }, item];

            // act
            sut.reset(newitems);

            // assert
            expect(sut.SelectedItems[0]).toBe(item);
          });
        });
      });

      describe("#select()", function () {
        it("should update SelectedItems property", function () {
          // prepares
          var item = { name: "something" };
          sut.reset([item]);

          // act
          sut.select([item]);

          // assert
          expect(sut.SelectedItems[0]).toBe(item);
        });

        it("should update SelectedValues property", function () {
          // prepare
          var item = { name: "something", value: 1 };
          sut.ValueFieldName = "value";
          sut.reset([item]);

          // act
          sut.select([item]);

          // assert
          expect(sut.SelectedValues[0]).toBe(1);
        });
      });

      describe("#selectAt()", function () {
        it("should update SelectedItems property", function () {
          // prepare
          var items = [{ value: "foo" }, { value: "bar" }];
          sut.reset(items);

          // act
          sut.selectAt([1]);

          // assert
          expect(sut.SelectedItems[0]).toBe(items[1]);
        });

        it("should update SelectedValues property", function () {
          // prepare
          var items = [{ value: "foo" }, { value: "bar" }];
          sut.ValueFieldName = "value";
          sut.reset(items);

          // act
          sut.selectAt([1]);

          // assert
          expect(sut.SelectedValues[0]).toBe("bar");
        });
      });

      describe("#selectByValue()", function () {
        it("should update SelectedItems property", function () {
          // prepare
          var item = { value: "something" };
          sut.ValueFieldName = "value";
          sut.reset([item]);

          // act
          sut.selectByValue(["something"]);

          // assert
          expect(sut.SelectedItems[0]).toBe(item);
        });

        it("should update SelectedValues property", function () {
          // prepare
          var item = { value: "something" };
          sut.ValueFieldName = "value";
          sut.reset([item]);

          // act
          sut.selectByValue(["something"]);

          // assert
          expect(sut.SelectedValues[0]).toBe("something");
        });
      });
    });
  });

})(Sitecore.Speak);

