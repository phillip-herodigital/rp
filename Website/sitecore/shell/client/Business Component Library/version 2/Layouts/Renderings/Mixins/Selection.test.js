(function (Speak) {

  require.config({
    paths: {
      selection: "/sitecore/shell/client/Business Component Library/version 2/Layouts/Renderings/Mixins/Selection",
      collection: "/sitecore/shell/client/Business Component Library/version 2/Layouts/Renderings/Mixins/Collection",
      mock: "/sitecore/shell/client/Speak/Assets/lib/core/2.0/mock"
    }
  });

  define(["selection", "collection", "mock"], function (Selection, Collection) {

    // Create mock component for collection
    Speak.component(
      Speak.extend({}, Collection.prototype, Selection.prototype, {
        name: "SelectionMock",
        presenter: "scComponentPresenter",
        initialized: function () {
          Collection.prototype.initialized.call(this);
          Selection.prototype.initialized.call(this);
        }
      })
    );

    Speak.component(
      Speak.extend({}, Collection.prototype, Selection.prototype, {
        name: "SelectionMock2",
        presenter: "scComponentPresenter",
        initialized: function () {
          Collection.prototype.initialized.call(this);
          Selection.prototype.initialized.call(this);
        }
      })
    );

    describe("Given a Selection", function () {
      var sut;

      beforeEach(function () {
        var selectionMock = speakMock("SelectionMock", document.createElement("div"));

        sut = selectionMock.component;
        sut.defineProperty("DisplayFieldName", "$displayName");
        sut.defineProperty("ValueFieldName", "$itemId");
        sut.defineProperty("SelectedItem", "");
        sut.defineProperty("SelectedValue", "");

        selectionMock.run();
      });

      describe("SelectedItem property", function () {
        it("should be defined", function () {
          expect(sut.SelectedItem).toBeDefined();
        });

        it("should update the SelectedValue property", function () {
          // prepare
          var item = { name: "something", value: 1 };
          sut.ValueFieldName = "value";
          sut.reset([item]);

          // act
          sut.SelectedItem = item;

          // assert
          expect(sut.SelectedValue).toBe(1);
        });
      });

      describe("SelectedValue property", function () {
        it("should be defined", function () {
          expect(sut.SelectedValue).toBeDefined();
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

      describe("when IsSelectionRequired flag is passed on initialized", function() {
        beforeEach(function() {
          var selectionMock = speakMock("SelectionMock2", document.createElement("div"));

          sut = selectionMock.component;
          sut.defineProperty("DisplayFieldName", "$displayName");
          sut.defineProperty("ValueFieldName", "$itemId");
          sut.defineProperty("SelectedItem", "");
          sut.defineProperty("SelectedValue", "");
          sut.defineProperty("IsSelectionRequired", false);

          selectionMock.run();
        });

        it("should not have any default selection", function() {
          // prepare
          sut.ValueFieldName = "value";
          sut.reset([{ value: 4 }]);

          // assert
          expect(sut.SelectedItem).toBe("");
          expect(sut.SelectedValue).toBe("");
        });

        describe("with default SelectedValue set", function () {
          beforeEach(function () {
            var selectionMock = speakMock("SelectionMock2", document.createElement("div"));

            sut = selectionMock.component;
            sut.defineProperty("DisplayFieldName", "$displayName");
            sut.defineProperty("ValueFieldName", "$itemId");
            sut.defineProperty("SelectedItem", "");
            sut.defineProperty("IsSelectionRequired", false);
            sut.defineProperty("SelectedValue", "foo");

            selectionMock.run();
          });

          it("it should select the first item with the value 'foo' as SelectedItem", function () {
            // prepare
            sut.ValueFieldName = "value";
            var newitems = [{ value: 1 }, { value: 2 }, { value: "foo" }];

            // act
            sut.reset(newitems);

            // assert
            expect(sut.SelectedItem).toBe(newitems[2]);
          });
        });

        describe("#select()", function() {
          describe("where falsy object is passed", function() {
            it("should set SelectedItem to be the empty string", function() {
              // prepare
              var items = [{ name: "something" }, { name: "foo" }];
              sut.reset(items);

              // act
              sut.selectAt(1);
              sut.select(null);

              // assert
              expect(sut.SelectedItem).toBe("");
            });
          });
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
          expect(sut.SelectedItem).toBe(newitems[0]);
        });

        describe("with default SelectedValue set", function () {
          beforeEach(function () {
            var selectionMock = speakMock("SelectionMock", document.createElement("div"));

            sut = selectionMock.component;
            sut.defineProperty("DisplayFieldName", "$displayName");
            sut.defineProperty("ValueFieldName", "$itemId");
            sut.defineProperty("SelectedItem", "");
            sut.defineProperty("SelectedValue", "foo");

            selectionMock.run();
          });

          it("it should select the first item with the value 'foo' as SelectedItem", function() {
            // prepare
            sut.ValueFieldName = "value";
            var newitems = [{ value: 1 }, { value: 2 }, { value: "foo"}];

            // act
            sut.reset(newitems);

            // assert
            expect(sut.SelectedItem).toBe(newitems[2]);
          });
        });

        describe("and still includes previous selection", function () {
          it("selectedItem should not change", function () {
            // prepare
            var item = { value: 1 };
            sut.ValueFieldName = "value";
            sut.reset([item]);
            sut.SelectedItem = item;

            var newitems = [{ value: 2 }, { value: 3 }, item];

            // act
            sut.reset(newitems);

            // assert
            expect(sut.SelectedItem).toBe(item);
          });
        });
      });

      describe("#select()", function () {
        it("should update SelectedItem property", function () {
          // prepare
          var item = { name: "something" };
          sut.reset([item]);

          // act
          sut.select(item);

          // assert
          expect(sut.SelectedItem).toBe(item);
        });

        it("should update SelectedValue property", function () {
          // prepare
          var item = { name: "something", value: 1 };
          sut.ValueFieldName = "value";
          sut.reset([item]);

          // act
          sut.select(item);

          // assert
          expect(sut.SelectedValue).toBe(1);
        });

        describe("where falsy object is passed", function() {
          it("should set SelectedItem to be the first", function() {
            // prepare
            var items = [{ name: "something" }, { name: "foo"}];
            sut.reset(items);

            // act
            sut.selectAt(1);
            sut.select(null);

            // assert
            expect(sut.SelectedItem).toBe(items[0]);
          });
        });
      });

      describe("#selectAt()", function () {
        it("should update SelectedItem property", function () {
          // prepare
          var items = [{ value: "foo" }, { value: "bar" }];
          sut.reset(items);

          // act
          sut.selectAt(1);

          // assert
          expect(sut.SelectedItem).toBe(items[1]);
        });

        it("should update SelectedValue property", function () {
          // prepare
          var items = [{ value: "foo" }, { value: "bar" }];
          sut.ValueFieldName = "value";
          sut.reset(items);

          // act
          sut.selectAt(1);

          // assert
          expect(sut.SelectedValue).toBe("bar");
        });
      });

      describe("#selectByValue()", function () {
        it("should update SelectedItem property", function () {
          // prepare
          var item = { value: "something" };
          sut.ValueFieldName = "value";
          sut.reset([item]);

          // act
          sut.selectByValue("something");

          // assert
          expect(sut.SelectedItem).toBe(item);
        });

        it("should update SelectedValue property", function () {
          // prepare
          var item = { value: "something" };
          sut.ValueFieldName = "value";
          sut.reset([item]);

          // act
          sut.selectByValue("something");

          // assert
          expect(sut.SelectedValue).toBe("something");
        });
      });

      describe("#toggleSelect()", function () {
        it("should select item if it is not already selected", function () {
          // prepare
          var item = { value: "something" };
          sut.ValueFieldName = "value";
          sut.reset([item]);

          // act
          sut.toggleSelect(item);

          // assert
          expect(sut.SelectedItem).toBe(item);
        });

        it("should deselect item if it is already selected", function () {
          // prepare
          var items = [{ value: "something1" }, { value: "something2" }];
          sut.ValueFieldName = "value";
          sut.reset(items);
          sut.select(items[1]);

          // act
          sut.toggleSelect(items[1]);

          // assert
          expect(sut.SelectedItem).not.toBe(items[1]);
        });

        it("should not deselect item if it is already selected and IsSelectionRequired is true", function () {
          // prepare
          var items = [{ value: "something1" }, { value: "something2" }];
          sut.IsSelectionRequired = true;
          sut.ValueFieldName = "value";
          sut.reset(items);
          sut.select(items[1]);

          // act
          sut.toggleSelect(items[1]);

          // assert
          expect(sut.SelectedItem).toBe(items[1]);
        });
      });
    });
  });

})(Sitecore.Speak);

