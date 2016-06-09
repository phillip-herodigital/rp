define(function (require) {
  describe("=== ListControl ===", function () {
    //Prepare
    var component = _sc.app.ListControlUnitTest,
      $componentEl = $(component.el),
      //helper
      getColumnTypeIndex = function (component, colTypeString) {
        var colDefString = component.ColumnDefinitionItems ? component.ColumnDefinitionItems : "";
        if (colDefString !== "") {
          var colDefs = JSON.parse(colDefString);
          for (var i = 0, len = colDefs.length; i < len; i = i + 1) {
            var item = colDefs[i];
            if (item.ColumnType === colTypeString) {
              return i;
            }
          }
        }
        return -1;
      };

    describe("- Unit tests", function () {
      describe("Given a ListControl component", function () {
        it("it should exist", function () {
          expect(component).toBeDefined();
          expect($componentEl).toBeDefined();
        });

        it("it should have a CheckedItems property", function () {
          expect(component.CheckedItems).toBeDefined();
        });

        it("it should have a CheckedValues property", function () {
          expect(component.CheckedValues).toBeDefined();
        });

        it("it should have a ColumnDefinitionItems property", function () {
          expect(component.ColumnDefinitionItems).toBeDefined();
        });

        it("it should have a DynamicData property", function () {
          expect(component.DynamicData).toBeDefined();
        });

        it("it should have a IsCheckModeEnabled property", function () {
          expect(component.IsCheckModeEnabled).toBeDefined();
        });

        it("it should have a IsColumnWidthFixed property", function () {
          expect(component.IsColumnWidthFixed).toBeDefined();
        });

        it("it should have a IsSelectionDisabled property", function () {
          expect(component.IsSelectionDisabled).toBeDefined();
        });

        it("it should have a IsSelectionRequired property", function () {
          expect(component.IsSelectionRequired).toBeDefined();
        });

        it("it should have a IsVisible property", function () {
          expect(component.IsVisible).toBeDefined();
        });

        it("it should have a ItemClick property", function () {
          expect(component.ItemClick).toBeDefined();
        });

        it("it should have a SelectedItem property", function () {
          expect(component.SelectedItem).toBeDefined();
        });

        it("it should have a SelectedValue property", function () {
          expect(component.SelectedValue).toBeDefined();
        });

        it("it should have a ValueFieldName property", function () {
          expect(component.ValueFieldName).toBeDefined();
        });

        it("it should have a ViewMode property", function () {
          expect(component.ViewMode).toBeDefined();
        });

        it("it should have a MinRows property", function () {
          expect(component.MinRows).toBeDefined();
        });

        it("it should have a MaxRows property", function () {
          expect(component.MaxRows).toBeDefined();
        });

        it("it should have a IsHeightInherited property", function () {
          expect(component.IsHeightInherited).toBeDefined();
        });

        it("it should have a IsStateDiscarded property", function () {
          expect(component.IsStateDiscarded).toBeDefined();
        });

        describe("#swapColumns()", function () {
          it("should swap column A with column B", function () {
            //prepare
            component.ColumnDefinitionItems = ["foo", "bar"];

            //act
            component.swapColumns(0, 1);

            //assert
            expect(component.ColumnDefinitionItems[0]).toBe("bar");
            expect(component.ColumnDefinitionItems[1]).toBe("foo");
          });

          it("should trigger a change in ColumnDefinitionItems", function () {
            //prepare
            component.ColumnDefinitionItems = ["foo", "bar"];
            var spy = jasmine.createSpy();
            component.on("change:ColumnDefinitionItems", spy);

            //act
            component.swapColumns(0, 1);

            //assert
            expect(spy).toHaveBeenCalled();
          });
        });
      });

      describe("Given a ViewModel", function () {
        var ViewModel = require("ListControl/ViewModel"),
          baseModelMock;

        beforeEach(function () {
          baseModelMock = {
            on: function () { },
            getNumOfItems: function () { },
            MaxRows: 0,
            MinRows: 0
          };
        });

        describe("#getItems()", function () {
          it("should return model.Items", function () {
            //prepare
            var model = _sc.extend(baseModelMock, { Items: "foo" });
            var viewModel = new ViewModel(model);

            //act

            //assert
            expect(viewModel.getItems()).toBe("foo");
          });
        });

        describe("#getNumberOfRows()", function () {
          it("should return 0, if both MinRows and MaxRows are 0", function () {
            //prepare
            var model = _sc.extend({}, baseModelMock, { MinRows: 0, MaxRows: 0 });
            var viewModel = new ViewModel(model);

            //act

            //assert
            expect(viewModel.getNumberOfRows()).toBe(0);
          });

          it("should return 2, if MinRows is 2 and MaxRows are 0", function () {
            //prepare
            var model = _sc.extend({}, baseModelMock, { MinRows: 2, MaxRows: 0 });
            var viewModel = new ViewModel(model);

            //act

            //assert
            expect(viewModel.getNumberOfRows()).toBe(2);
          });

          it("should return 2, if MinRows is 5 and MaxRows are 2", function () {
            //prepare
            var model = _sc.extend({}, baseModelMock, { MinRows: 5, MaxRows: 2 });
            var viewModel = new ViewModel(model);

            //act

            //assert
            expect(viewModel.getNumberOfRows()).toBe(2);
          });
        });

        describe("#getNumberOfFillers()", function () {
          it("should return 0, if AssociatedListPage is set", function () {
            //prepare
            var model = _sc.extend({}, baseModelMock, {
              Items: ["foo", "bar", "fiz"],
              MinRows: 5,
              MaxRows: 0,
              AssociatedListPage: "someUrl",
              getNumOfItems: function () {
                return this.Items.length;
              }
            });
            var viewModel = new ViewModel(model);

            //act

            //assert
            expect(viewModel.getNumberOfFillers()).toBe(0);
          });

          it("should return 2, if MinRows is 5 and num of items is 3", function () {
            //prepare
            var model = _sc.extend({}, baseModelMock, {
              Items: ["foo", "bar", "fiz"],
              MinRows: 5,
              MaxRows: 0,
              AssociatedListPage: "",
              getNumOfItems: function () {
                return this.Items.length;
              }
            });
            var viewModel = new ViewModel(model);

            //act

            //assert
            expect(viewModel.getNumberOfFillers()).toBe(2);
          });

          it("should return 0, if MinRows is 5, MaxRows is 3 and num of items is 3", function () {
            //prepare
            var model = _sc.extend({}, baseModelMock, {
              Items: ["foo", "bar", "fiz"],
              MinRows: 5,
              MaxRows: 3,
              AssociatedListPage: "",
              getNumOfItems: function () {
                return this.Items.length;
              }
            });
            var viewModel = new ViewModel(model);

            //act

            //assert
            expect(viewModel.getNumberOfFillers()).toBe(0);
          });

        });

        describe("#associatedListPage", function () {
          it("should return '', if IsHeightInherited is true", function () {
            //prepare
            var model = _sc.extend({}, baseModelMock, {
              Items: ["foo", "bar", "fiz"],
              MinRows: 5,
              MaxRows: 0,
              AssociatedListPage: "someUrl",
              IsHeightInherited: true,
              getNumOfItems: function () {
                return this.Items.length;
              }
            });
            var viewModel = new ViewModel(model);

            //act

            //assert
            expect(viewModel.associatedListPage()).toBe("");
          });

          it("should return '', if num of items is smaller than max rows", function () {
            //prepare
            var model = _sc.extend({}, baseModelMock, {
              Items: ["foo", "bar", "fiz"],
              MinRows: 0,
              MaxRows: 5,
              AssociatedListPage: "someUrl",
              IsHeightInherited: false,
              getNumOfItems: function () {
                return this.Items.length;
              }
            });
            var viewModel = new ViewModel(model);

            //act

            //assert
            expect(viewModel.associatedListPage()).toBe("");
          });

          it("should return 'someUrl', if num of items is bigger than max rows", function () {
            //prepare
            var model = _sc.extend({}, baseModelMock, {
              Items: ["foo", "bar", "fiz"],
              MinRows: 0,
              MaxRows: 2,
              AssociatedListPage: "someUrl",
              IsHeightInherited: false,
              getNumOfItems: function () {
                return this.Items.length;
              }
            });
            var viewModel = new ViewModel(model);

            //act

            //assert
            expect(viewModel.associatedListPage()).toBe("someUrl");
          });
        });

        describe("#isColumnWidthFixed()", function () {
          it("should return model.IsColumnWidthFixed", function () {
            //prepare
            var model = _sc.extend(baseModelMock, { IsColumnWidthFixed: "foo" });
            var viewModel = new ViewModel(model);

            //act

            //assert
            expect(viewModel.isColumnWidthFixed()).toBe("foo");
          });
        });

        describe("#isCheckModeEnabled()", function () {
          it("should return model.IsCheckModeEnabled", function () {
            //prepare
            var model = _sc.extend(baseModelMock, { IsCheckModeEnabled: "foo" });
            var viewModel = new ViewModel(model);

            //act

            //assert
            expect(viewModel.isCheckModeEnabled()).toBe("foo");
          });
        });

        describe("#isSelectionDisabled()", function () {
          it("should return model.IsSelectionDisabled", function () {
            //prepare
            var model = _sc.extend(baseModelMock, { IsSelectionDisabled: "foo" });
            var viewModel = new ViewModel(model);

            //act

            //assert
            expect(viewModel.isSelectionDisabled()).toBe("foo");
          });
        });

        describe("#isSelectionRequired()", function () {
          it("should return model.IsSelectionRequired", function () {
            //prepare
            var model = _sc.extend(baseModelMock, { IsSelectionRequired: "foo" });
            var viewModel = new ViewModel(model);

            //act

            //assert
            expect(viewModel.isSelectionRequired()).toBe("foo");
          });
        });

        describe("#getSelectedIndex()", function () {
          it("should call indexOf on the model with the SelectedItem", function () {
            //prepare
            var model = _sc.extend(baseModelMock, { SelectedItem: "bar", indexOf: jasmine.createSpy() });
            var viewModel = new ViewModel(model);

            //act
            viewModel.getSelectedIndex();

            //assert
            expect(model.indexOf).toHaveBeenCalledWith("bar");
          });
        });

        describe("#toggleCheck()", function () {
          it("should call toggleCheck on the model with the item passed on as parameter", function () {
            //prepare
            var model = _sc.extend(baseModelMock, { at: function (prop) { return prop; }, toggleCheck: jasmine.createSpy() });
            var viewModel = new ViewModel(model);

            //act
            viewModel.toggleCheck("bar");

            //assert
            expect(model.toggleCheck).toHaveBeenCalledWith("bar");
          });
        });

        describe("#checkItems()", function () {
          it("should trigger 'change:CheckedItems' on the ViewModel if there are checked items", function () {
            //prepare
            var model = _sc.extend(baseModelMock, { CheckedItems: ["foo", "bar"], Items: [], indexOf: function() { return true; } });
            var viewModel = new ViewModel(model);
            var spy = jasmine.createSpy();
            viewModel.on("change:CheckedItems", spy);

            //act
            viewModel.checkItems();

            //assert
            expect(spy).toHaveBeenCalled();
          });

          it("should not trigger 'change:CheckedItems' on the ViewModel if there are no checked items", function () {
            //prepare
            var model = _sc.extend(baseModelMock, { CheckedItems: [] });
            var viewModel = new ViewModel(model);
            var spy = jasmine.createSpy();
            viewModel.on("change:CheckedItems", spy);

            //act
            viewModel.checkItems();

            //assert
            expect(spy).not.toHaveBeenCalled();
          });
        });

        describe("#toggleCheckAll()", function () {
          var model;

          beforeEach(function () {
            model = _sc.extend(baseModelMock, { checkAll: jasmine.createSpy(), uncheckAll: jasmine.createSpy() });
          });

          it("should call checkAll on the model if parameter is true", function () {
            //prepare
            var viewModel = new ViewModel(model);

            //act
            viewModel.toggleCheckAll(true);

            //assert
            expect(model.checkAll).toHaveBeenCalled();
            expect(model.uncheckAll).not.toHaveBeenCalled();
          });

          it("should call uncheckAll on the model if parameter is false", function () {
            //prepare
            var viewModel = new ViewModel(model);

            //act
            viewModel.toggleCheckAll(false);

            //assert
            expect(model.checkAll).not.toHaveBeenCalled();
            expect(model.uncheckAll).toHaveBeenCalled();
          });
        });

        describe("#toggleCheckOverSelect()", function () {
          var model;

          beforeEach(function () {
            model = _sc.extend(baseModelMock, { at: function (prop) { return prop; }, toggleCheck: jasmine.createSpy(), toggleSelect: jasmine.createSpy() });
          });

          describe("when hasCheckedItems() returns true", function () {
            beforeEach(function () {
              model = _sc.extend(baseModelMock, { hasCheckedItems: function () { return true; } });
            });

            it("should call toggleCheck with the item", function () {
              //prepare
              var viewModel = new ViewModel(model);

              //act
              viewModel.toggleCheckOverSelect("bar");

              //assert
              expect(model.toggleCheck).toHaveBeenCalledWith("bar");
            });

            it("should not call toggleSelect", function () {
              //prepare
              var viewModel = new ViewModel(model);

              //act
              viewModel.toggleCheckOverSelect("bar");

              //assert
              expect(model.toggleSelect).not.toHaveBeenCalled();
            });
          });

          describe("when hasCheckedItems() returns false", function () {
            beforeEach(function () {
              model = _sc.extend(baseModelMock, { hasCheckedItems: function () { return false; } });
            });

            it("should not call toggleCheck", function () {
              //prepare
              var viewModel = new ViewModel(model);

              //act
              viewModel.toggleCheckOverSelect("bar");

              //assert
              expect(model.toggleCheck).not.toHaveBeenCalled();
            });

            it("should call toggleSelect with the item", function () {
              //prepare
              var viewModel = new ViewModel(model);

              //act
              viewModel.toggleCheckOverSelect("bar");

              //assert
              expect(model.toggleSelect).toHaveBeenCalledWith("bar");
            });
          });
        });

        describe("#click()", function () {
          it("should throw an error if the model.ItemClick is malformed", function () {
            //prepare
            var model = _sc.extend(baseModelMock, { ItemClick: "alert(1);" });
            var viewModel = new ViewModel(model);

            //act

            //assert
            expect(function () {
              viewModel.click();
            }).toThrow();
          });

          it("should execute model.ItemClick invocation if it is in the correct format", function () {
            //prepare
            var model = _sc.extend(baseModelMock, { ItemClick: "javascript:listControlClickTestFunction();" });
            var viewModel = new ViewModel(model);
            var spy = jasmine.createSpy();

            window.listControlClickTestFunction = function () {
              spy("success");
            };

            //act
            viewModel.click();

            //assert
            expect(spy).toHaveBeenCalledWith("success");

            //clean up
            delete window.listControlClickTestFunction;
          });
        });

        describe("#change:SelectedItem", function () {
          var model;

          beforeEach(function () {
            model = _sc.extend(baseModelMock, Backbone.Events);
          });

          it("should call selectCallback() with given index, when item index is not -1", function () {
            //prepare
            model = _sc.extend(model, { indexOf: function () { return "foo"; } });
            var viewModel = new ViewModel(model);
            var spy = jasmine.createSpy();
            viewModel.on("change:SelectedItem", spy);

            //act
            model.trigger("change:SelectedItem");

            //assert
            expect(spy).toHaveBeenCalledWith("foo");
          });

          it("should call selectCallback() with index of -1, when item index is -1, and model.IsSelectionRequired is false", function () {
            //prepare
            model = _sc.extend(model, { indexOf: function () { return -1; }, IsSelectionRequired: false });
            var viewModel = new ViewModel(model);
            var spy = jasmine.createSpy();
            viewModel.on("change:SelectedItem", spy);

            //act
            model.trigger("change:SelectedItem");

            //assert
            expect(spy).toHaveBeenCalledWith(-1);
          });

          it("should call selectCallback() with index of -1, when item index is -1, and model.IsSelectionRequired is true, and model.hasCheckedItems() is truthy", function () {
            //prepare
            model = _sc.extend(model, { indexOf: function () { return -1; }, IsSelectionRequired: true, hasCheckedItems: function () { return "foo"; } });
            var viewModel = new ViewModel(model);
            var spy = jasmine.createSpy();
            viewModel.on("change:SelectedItem", spy);

            //act
            model.trigger("change:SelectedItem");

            //assert
            expect(spy).toHaveBeenCalledWith(-1);
          });

          it("should call selectCallback() with index of 0, when item index is -1, and model.IsSelectionRequired is true, and model.hasCheckedItems() is falsy", function () {
            //prepare
            model = _sc.extend(model, { indexOf: function () { return -1; }, IsSelectionRequired: true, hasCheckedItems: function () { return null; } });
            var viewModel = new ViewModel(model);
            var spy = jasmine.createSpy();
            viewModel.on("change:SelectedItem", spy);

            //act
            model.trigger("change:SelectedItem");

            //assert
            expect(spy).toHaveBeenCalledWith(0);
          });
        });

        describe("#change:CheckedItems", function () {
          var model,
            itemArray;

          beforeEach(function () {
            itemArray = ["foo", "bar"];
            model = _sc.extend(baseModelMock, { CheckedItems: itemArray, i: 0, indexOf: function () { return this.i++; }, Items: itemArray }, Backbone.Events);
          });

          it("should call checkCallback() with indexes, and true if all items are checked", function () {
            //prepare
            var viewModel = new ViewModel(model);
            var spy = jasmine.createSpy();
            viewModel.on("change:CheckedItems", spy);

            //act
            model.trigger("change:CheckedItems", itemArray);

            //assert
            expect(spy).toHaveBeenCalledWith([0, 1], true);
          });

          it("should call checkCallback() with indexes, and false if not all items are checked", function () {
            //prepare
            model.Items = ["foo", "bar", "baz"];
            var viewModel = new ViewModel(model);
            var spy = jasmine.createSpy();
            viewModel.on("change:CheckedItems", spy);

            //act
            model.trigger("change:CheckedItems", itemArray);

            //assert
            expect(spy).toHaveBeenCalledWith([0, 1], false);
          });
        });
        it("it should have a MinRows property", function () {
          expect(component.MinRows).toBeDefined();
        });
        it("it should have a MaxRows property", function () {
          expect(component.MaxRows).toBeDefined();
        });
        it("it should have a IsHeightInherited property", function () {
          expect(component.IsHeightInherited).toBeDefined();
        });

        describe("#swapColumns()", function () {
          it("should call swapColumns on the model with the given parameters", function () {
            //prepare
            var spy = jasmine.createSpy();
            var model = _sc.extend(baseModelMock, { swapColumns: spy });
            var viewModel = new ViewModel(model);
            var parameter1 = "foo";
            var parameter2 = "bar";

            //act
            viewModel.swapColumns(parameter1, parameter2);

            //assert
            expect(spy).toHaveBeenCalledWith(parameter1, parameter2);
          });
        });

        describe("#getSortingValue()", function () {
          it("should return the value of 'DataFieldName', if column type is text", function () {
            //prepare
            var column = { ColumnType: "text", DataFieldName: "foo" };
            var viewModel = new ViewModel(baseModelMock);

            //act
            var sortingValue = viewModel.getSortingValue(column);

            //assert
            expect(sortingValue).toBe("foo");
          });

          it("should return the value of 'DataFieldName', if column type is 'datesandtime", function () {
            //prepare
            var column = { ColumnType: "datesandtime", DataFieldName: "foo" };
            var viewModel = new ViewModel(baseModelMock);

            //act
            var sortingValue = viewModel.getSortingValue(column);

            //assert
            expect(sortingValue).toBe("foo");
          });

          it("should return the value of 'DataFieldName', if column type is 'datesandtime", function () {
            //prepare
            var column = { ColumnType: "datesandtime", DataFieldName: "foo" };
            var viewModel = new ViewModel(baseModelMock);

            //act
            var sortingValue = viewModel.getSortingValue(column);

            //assert
            expect(sortingValue).toBe("foo");
          });

          it("should return the value of 'LinkTextFieldName', if column type is 'link", function () {
            //prepare
            var column = { ColumnType: "link", LinkTextFieldName: "foo" };
            var viewModel = new ViewModel(baseModelMock);

            //act
            var sortingValue = viewModel.getSortingValue(column);

            //assert
            expect(sortingValue).toBe("foo");
          });

          it("should return the value of 'ImageFieldName', if column type is 'image", function () {
            //prepare
            var column = { ColumnType: "image", ImageFieldName: "foo" };
            var viewModel = new ViewModel(baseModelMock);

            //act
            var sortingValue = viewModel.getSortingValue(column);

            //assert
            expect(sortingValue).toBe("foo");
          });

          it("should return the value of 'HtmlTemplate', if column type is 'htmltemplate", function () {
            //prepare
            var column = { ColumnType: "htmltemplate", HtmlTemplate: "foo" };
            var viewModel = new ViewModel(baseModelMock);

            //act
            var sortingValue = viewModel.getSortingValue(column);

            //assert
            expect(sortingValue).toBe("foo");
          });

          it("should return the value of 'ProgressFieldName', if column type is 'progressbar", function () {
            //prepare
            var column = { ColumnType: "progressbar", ProgressFieldName: "foo" };
            var viewModel = new ViewModel(baseModelMock);

            //act
            var sortingValue = viewModel.getSortingValue(column);

            //assert
            expect(sortingValue).toBe("foo");
          });
        });

        describe("#setItemSortDirections()", function () {
          describe("and IsMultipleColumnSortEnabled is true", function () {
            it("it should set SortDirection on each column accordingly to the Sorting property on the model", function () {
              //prepare
              var columnDefinitionItems = [
                { ColumnType: "text", DataFieldName: "Foo" },
                { ColumnType: "text", DataFieldName: "Bar" },
                { ColumnType: "text", DataFieldName: "Baz" }
              ];
              var model = _sc.extend(baseModelMock, { IsMultipleColumnSortEnabled: true, Sorting: "aFoo|dBar" });
              var viewModel = new ViewModel(model);

              //act
              columnDefinitionItems = viewModel.setItemSortDirections(columnDefinitionItems);

              //assert
              expect(columnDefinitionItems[0].SortDirection).toBe("ascending");
              expect(columnDefinitionItems[1].SortDirection).toBe("descending");
              expect(columnDefinitionItems[2].SortDirection).toBe("no-sorting");
            });
          });

          describe("and IsMultipleColumnSortEnabled is false", function () {
            it("it should set SortDirection on one column accordingly to the Sorting property on the model", function () {
              //prepare
              var columnDefinitionItems = [
                { ColumnType: "text", DataFieldName: "Foo" },
                { ColumnType: "text", DataFieldName: "Bar" },
                { ColumnType: "text", DataFieldName: "Baz" }
              ];
              var model = _sc.extend(baseModelMock, { IsMultipleColumnSortEnabled: false, Sorting: "aFoo|dBar" });
              var viewModel = new ViewModel(model);

              //act
              columnDefinitionItems = viewModel.setItemSortDirections(columnDefinitionItems);

              //assert
              expect(columnDefinitionItems[0].SortDirection).toBe("ascending");
              expect(columnDefinitionItems[1].SortDirection).toBe("no-sorting");
              expect(columnDefinitionItems[2].SortDirection).toBe("no-sorting");
            });
          });
        });

        describe("#setSorting()", function () {
          it("should remove sorting from Sorting, if direction 'no-sorting' was given", function () {
            //prepare
            var model = _sc.extend(baseModelMock, { ColumnDefinitionItems: [{ ColumnType: "text", DataFieldName: "Foo", SortDirection: "ascending" }], Sorting: "aFoo" });
            var viewModel = new ViewModel(model);

            //act
            viewModel.setSorting(0, "no-sorting");

            //assert
            expect(model.Sorting).toBe("");
          });

          it("should change sorting from Sorting, if direction was changed", function () {
            //prepare
            var model = _sc.extend(baseModelMock, { ColumnDefinitionItems: [{ ColumnType: "text", DataFieldName: "Foo", SortDirection: "ascending" }], Sorting: "aFoo" });
            var viewModel = new ViewModel(model);

            //act
            viewModel.setSorting(0, "descending");

            //assert
            expect(model.Sorting).toBe("dFoo");
          });

          describe("and IsMultipleColumnSortEnabled is true", function () {
            it("should append sorting to Sorting, if sorting was not empty", function () {
              //prepare
              var model = _sc.extend(baseModelMock, { ColumnDefinitionItems: [{ ColumnType: "text", DataFieldName: "Bar", SortDirection: "ascending" }], IsMultipleColumnSortEnabled: true, Sorting: "dFoo" });
              var viewModel = new ViewModel(model);

              //act
              viewModel.setSorting(0, "ascending");

              //assert
              expect(model.Sorting).toBe("dFoo|aBar");
            });

            it("should change order of sortings in Sorting, if a sorting was altered", function () {
              //prepare
              var model = _sc.extend(baseModelMock, { ColumnDefinitionItems: [{ ColumnType: "text", DataFieldName: "Bar", SortDirection: "ascending" }], IsMultipleColumnSortEnabled: true, Sorting: "dBar|dFoo" });
              var viewModel = new ViewModel(model);

              //act
              viewModel.setSorting(0, "ascending");

              //assert
              expect(model.Sorting).toBe("dFoo|aBar");
            });
          });

          describe("and IsMultipleColumnSortEnabled is false", function() {
            it("should set Sorting to sorting parameter", function() {
              //prepare
              var model = _sc.extend(baseModelMock, { ColumnDefinitionItems: [{ ColumnType: "text", DataFieldName: "Bar", SortDirection: "ascending" }], IsMultipleColumnSortEnabled: false, Sorting: "dFoo" });
              var viewModel = new ViewModel(model);

              //act
              viewModel.setSorting(0, "ascending");

              //assert
              expect(model.Sorting).toBe("aBar");
            });
          });
        });

        describe("#toggleSorting()", function () {
          it("should set sort direction of column to 'ascending' if previous SortDirection was 'no-sorting'", function () {
            //prepare
            var model = _sc.extend(baseModelMock, { ColumnDefinitionItems: [{ ColumnType: "text", DataFieldName: "Foo", SortDirection: "no-sorting" }], Sorting: "" });
            var viewModel = new ViewModel(model);

            //act
            viewModel.toggleSorting(0);

            //assert
            expect(model.Sorting).toBe("aFoo");
          });

          it("should set sort direction of column to 'descending' if previous SortDirection was 'ascending'", function () {
            //prepare
            var model = _sc.extend(baseModelMock, { ColumnDefinitionItems: [{ ColumnType: "text", DataFieldName: "Foo", SortDirection: "ascending" }], Sorting: "" });
            var viewModel = new ViewModel(model);

            //act
            viewModel.toggleSorting(0);

            //assert
            expect(model.Sorting).toBe("dFoo");
          });

          it("should set sort direction of column to 'no-sorting' if previous SortDirection was 'descending'", function () {
            //prepare
            var model = _sc.extend(baseModelMock, { ColumnDefinitionItems: [{ ColumnType: "text", DataFieldName: "Foo", SortDirection: "descending" }], Sorting: "" });
            var viewModel = new ViewModel(model);

            //act
            viewModel.toggleSorting(0);

            //assert
            expect(model.Sorting).toBe("");
          });
        });
      });

      describe("Given a TemplateHelper", function () {
        var templateHelper = require("ListControl/TemplateHelper");
        var handlebars = require("handlebars");

        describe("#buildConditionalString()", function () {
          describe("when configured to handle isFoo, isBar, isBaz", function () {
            it("should return 'foo', when isFoo is set to true", function () {
              //prepare
              var settings = '{ "isFoo": "foo","isBar": "bar", "isBaz": "baz"}',
                item = {
                  isFoo: true,
                  isBar: false,
                  isBaz: false
                },
                options = {};

              //act
              var classString = templateHelper.prototype.buildConditionalString(settings, item, options);

              //assert
              expect(classString).toBe("foo");
            });

            it("should return 'col-md-7', when template is set to 'col-md-{VALUE}' and isFoo is set to 7", function () {
              //prepare
              var settings = '{ "isFoo": "col-md-{VALUE}","isBar": "bar", "isBaz": "baz"}',
                  item = {
                    isFoo: 7,
                    isBar: false,
                    isBaz: false
                  },
                  options = {};

              //act
              var classString = templateHelper.prototype.buildConditionalString(settings, item, options);

              //assert
              expect(classString).toBe("col-md-7");
            });

            it("should return 'min-width: 100px;', when template is set to 'min-width: {VALUE}px;' and isBar is set to (string) 100", function () {
              //prepare
              var settings = '{ "isFoo": "foo","isBar": "min-width: {VALUE}px;", "isBaz": "baz"}',
                item = {
                  isFoo: false,
                  isBar: "100",
                  isBaz: false
                },
                options = {};

              //act
              var classString = templateHelper.prototype.buildConditionalString(settings, item, options);

              //assert
              expect(classString).toBe("min-width: 100px;");
            });

            it("should return 'min-width: 0px;', when template is set to 'min-width: {VALUE}px;' and isBar is set to (number) 0", function () {
              //prepare
              var settings = '{ "isFoo": "foo","isBar": "min-width: {VALUE}px;", "isBaz": "baz"}',
                item = {
                  isFoo: false,
                  isBar: 0,
                  isBaz: false
                },
                options = {};

              //act
              var classString = templateHelper.prototype.buildConditionalString(settings, item, options);

              //assert
              expect(classString).toBe("min-width: 0px;");
            });

            it("should return 'foo baz', when isFoo and isBaz is set to true", function () {
              //prepare
              var settings = '{ "isFoo": "foo","isBar": "bar", "isBaz": "baz"}',
                item = {
                  isFoo: true,
                  isBar: false,
                  isBaz: true
                },
                options = {};

              //act
              var classString = templateHelper.prototype.buildConditionalString(settings, item, options);

              //assert
              expect(classString).toBe("foo baz");
            });
          });
        });

        describe("#conditionalWrap()", function () {
          //Mock handlebars options object
          var options = {
            fn: function (obj) {
              return "mock string";
            }
          };

          describe("When configured with a handlebars input string 'mock string' and properties IsBold and IsItalic", function () {

            it('it should return <strong>mock string</strong> if settings are [{"IsBold": "strong"}, {"IsItalic": "em"}], and IsBold is true', function () {
              //prepare 
              var settings = '[{"IsBold": "strong"}, {"IsItalic": "em"}]',
                item = {
                  IsBold: true,
                  IsItalic: false
                };

              //act
              var hbObj = templateHelper.prototype.conditionalWrap(settings, item, options);

              //handlebars helpers unsing 'SafeString' creates an object with a string propety set to the output.
              //therefore we are testing on the obj.string property.
              expect(hbObj.string).toBe('<strong>mock string</strong>');
            });

            it('it should return <em>mock string</em> if settings are [{"IsBold": "strong"}, {"IsItalic": "em"}], and IsItalic is set to true', function () {
              //prepare 
              var settings = '[{"IsBold": "strong"}, {"IsItalic": "em"}]',
                item = {
                  IsBold: false,
                  IsItalic: true
                };

              //act
              var hbObj = templateHelper.prototype.conditionalWrap(settings, item, options);

              //assert
              expect(hbObj.string).toBe('<em>mock string</em>');
            });

            it('it should return <strong><em>mock string</em></strong> if settings are [{"IsBold": "strong"}, {"IsItalic": "em"}], and IsBold AND IsItalic is set to true', function () {
              //prepare 
              var settings = '[{"IsBold": "strong"}, {"IsItalic": "em"}]',
                item = {
                  IsBold: true,
                  IsItalic: true
                };

              //act
              var hbObj = templateHelper.prototype.conditionalWrap(settings, item, options);

              //assert
              expect(hbObj.string).toBe('<strong><em>mock string</em></strong>');
            });

          });
        });

        describe("#getColumnPartial()", function () {
          describe("when given a column type, a context, an item and options", function () {
            it("it should return 'test result'", function () {
              //prepare
              var columnType = "columntype123";
              var ctx = "ctx123";
              var item = "item123";
              var option = "option123";
              var testResult = "test result";

              handlebars.partials["template-detaillist-column-" + columnType] = function () {
                return testResult;
              };

              //act
              var columnPartial = templateHelper.prototype.getColumnPartial.call({ ColumnType: columnType }, { prop: ctx }, { prop: item }, option);

              //assert
              expect(columnPartial).toBe(testResult);

              //cleanup
              delete handlebars.partials["template-detaillist-column-" + columnType];
            });
          });
        });

        describe("#getProgressPercentage()", function () {
          describe("when given a progress-bar columnDefinitionItem, a valueItem (and a handlebar options object)", function () {
            // Mock data
            var options = {
              fn: function () { return "handlebars"; }
            },
                columnDefinitionItem = {
                  ColumnType: "progressbar",
                  IsPreCalculated: false,
                  IsDividedByFixedValue: false,
                  DivideByValue: 100,
                  DivideByFieldName: "total",
                  ProgressFieldName: "val"
                },
                dataObj = {
                  val: 50,
                  total: 200,
                  percentage: 0.1225,
                  valString: "50",
                  totalString: "100",
                  percentageString: "0.456",
                  randomString: "I am not a number"
                },
                //helper
                clone = function (obj) { return JSON.parse(JSON.stringify(obj)) };

            it("it should return 'NaN' if retrived value from dataObj is not a valid number'", function () {
              //prepare
              var colDefItem = clone(columnDefinitionItem);
              colDefItem.IsPreCalculated = true;
              colDefItem.ProgressFieldName = "randomString";

              //act
              var output = templateHelper.prototype.getProgressPercentage.call(colDefItem, dataObj, options);

              //assert
              expect(output).toBeNaN();
            });

            it("it should return '12.25' if property IsPreCalculated is true on ColumnDefinitionItem'", function () {
              //prepare
              var colDefItem = clone(columnDefinitionItem);
              colDefItem.IsPreCalculated = true;
              colDefItem.ProgressFieldName = "percentage";

              //act
              var output = templateHelper.prototype.getProgressPercentage.call(colDefItem, dataObj, options);

              //assert
              expect(output).toBe(12.25);
            });

            it("it should return '50' if property IsDividedByFixedValue is true on ColumnDefinitionItem'", function () {
              //prepare
              var colDefItem = clone(columnDefinitionItem);
              colDefItem.IsDividedByFixedValue = true;

              //act
              var output = templateHelper.prototype.getProgressPercentage.call(colDefItem, dataObj, options);

              //assert
              expect(output).toBe(50);
            });

            it("it should return '25' if property IsDividedByFixedValue & isPreCalcualted are false and DivideByFieldName is set on ColumnDefinitionItem'", function () {
              //prepare
              var colDefItem = clone(columnDefinitionItem);

              //act
              var output = templateHelper.prototype.getProgressPercentage.call(colDefItem, dataObj, options);

              //assert
              expect(output).toBe(25);
            });

          });
        });

        describe("#compilePartial()", function () {
          describe("when given a html source '<b>{{testvar}}</b>' and a context '{ testvar: 'Hello world!' }'", function () {
            it("it should return the compiled html '<b>Hello world!</b>'", function () {
              //prepare
              var htmlSource = "<b>{{testvar}}</b>";
              var ctx = { ColumnFieldId: "{123457890}", testvar: "Hello world!" };

              //act
              var partial = templateHelper.prototype.compilePartial(htmlSource, ctx);

              //assert
              expect(partial).toBe("<b>Hello world!</b>");
            });
          });
        });

        describe("#getImageUrl", function () {
          //Mock data
          var ctx = { ImageUrlFieldName: "Image" },
            valueItem = {
              "$database": "core",
              Image: "<image mediapath=\"\" alt=\"Peace, man!\" width=\"\" height=\"\" hspace=\"\" vspace=\"\" showineditor=\"\" usethumbnail=\"\" src=\"\" mediaid=\"{041FC676-C07B-40D9-8B8A-9567747E569A}\" />",
              ImageUrl: "/sitecore/shell/client/Speak/Assets/img/Speak/Common/32x32/dark_gray/document_empty.png",
              Text: "Lorem"
            },
            imageProp = "ImageUrlFieldName";

          describe("when given context and a data object, and an image property", function () {
            it("it should return '/sitecore/shell/~/media/041FC676C07B40D98B8A9567747E569A.ashx?h=&w=&db=core' if context' imageProp is set to 'Image' and image is a Sitecore Image XML", function () {

              //act
              var output = templateHelper.prototype.getImageUrl.call(ctx, valueItem, imageProp);

              //assert
              expect(output).toBe("/sitecore/shell/~/media/041FC676C07B40D98B8A9567747E569A.ashx?h=&w=&db=core");
            });

            it("it should return '/sitecore/shell/client/Speak/Assets/img/Speak/Common/32x32/dark_gray/document_empty.png' if context' imageProp is set to 'ImageUrl'", function () {
              //prepare
              var newCtx = { ImageUrlFieldName: "ImageUrl" };

              //act
              var output = templateHelper.prototype.getImageUrl.call(newCtx, valueItem, imageProp);

              //assert
              expect(output).toBe("/sitecore/shell/client/Speak/Assets/img/Speak/Common/32x32/dark_gray/document_empty.png");
            });

            it("it should throw an error if image prop is empty", function () {
              //prepare
              var dataObj = _.extend({}, valueItem, { Image: null });

              //act
              var tothrow = function () {
                templateHelper.prototype.getImageUrl.call(ctx, dataObj, imageProp);
              };

              //assert
              expect(tothrow).toThrow();
            });

          });
        });

        describe("#getImageAlt", function () {
          //Mock data
          var ctx = {},
            valueItem = {
              Image: "<image mediapath=\"\" alt=\"Peace, man!\" width=\"\" height=\"\" hspace=\"\" vspace=\"\" showineditor=\"\" usethumbnail=\"\" src=\"\" mediaid=\"{041FC676-C07B-40D9-8B8A-9567747E569A}\" />",
              ImageUrl: "/sitecore/shell/client/Speak/Assets/img/Speak/Common/32x32/dark_gray/document_empty.png",
              Text: "Lorem"
            },
            altProp = "AltFieldName",
            imageProp = "ImageUrlFieldName";


          describe("when given context and a data object, and an alt and an image property", function () {
            it("it should return 'Lorem' if context' altProp is set to 'Text'", function () {
              //prepare
              ctx = { AltFieldName: "Text", ImageUrlFieldName: "Image" };

              //act
              var output = templateHelper.prototype.getImageAlt.call(ctx, valueItem, altProp, imageProp);

              //assert
              expect(output).toBe("Lorem");
            });

            it("it should return 'Peace, Man!' if context' altProp is set to 'Text' but empty and image is a Sitecore Image XML", function () {
              //prepare
              ctx = { AltFieldName: "Text", ImageUrlFieldName: "Image" };
              var dataObj = _.extend({}, valueItem, { Text: "" });

              //act
              var output = templateHelper.prototype.getImageAlt.call(ctx, dataObj, altProp, imageProp);

              //assert
              expect(output).toBe("Peace, man!");
            });

            it("it should return '' if alt prop is empty and image is not a Sitecore Image XML", function () {
              //prepare
              ctx = { AltFieldName: "Text", ImageUrlFieldName: "ImageUrl" };
              var dataObj = _.extend({}, valueItem, { Text: "" });

              //act
              var output = templateHelper.prototype.getImageAlt.call(ctx, dataObj, altProp, imageProp);

              //assert
              expect(output).toBe("");
            });

          });
        });
      });

      describe("Given a ResizableColumns", function () {
        var resizableColumns = require("ListControl/ResizableColumns");

        describe("#initResizableColumns()", function () {
          describe("when configured with an element and internal ListControl data", function () {
            var scope;
            var internalListControlData;
            var tableHeaderString = "<table><thead><tr><th></th><th></th><th></th></tr></thead></table>";
            var tableBodyString = "<table><tbody><tr><td></td><td></td><td></td></tr></tbody></table>";

            beforeEach(function () {
              var $container = $("<div />");
              var $tableHeader = $(tableHeaderString);
              var $tableBody = $(tableBodyString);

              $tableHeader.appendTo($container);
              $tableBody.appendTo($container);

              scope = {
                el: $container[0]
              };

              internalListControlData = {
                Settings: {
                  DetailList: {
                    ColumnDefinitionItems: [
                      {
                        ColumnMinWidth: 30
                      },
                      {
                        ColumnMinWidth: 70
                      },
                      {
                        ColumnMinWidth: ""
                      }
                    ]
                  }
                }
              };

              $(scope.el).appendTo("#test-dom");
            });

            afterEach(function () {
              $(scope.el).remove();
            });

            it("it should not apply resizable columns, when el is hidden", function () {
              //prepare
              scope.el.style.display = "none";

              //act
              resizableColumns.render(internalListControlData, scope.el);

              //assert
              expect(scope.el.innerHTML).toBe(tableHeaderString + tableBodyString);
            });

            describe("and el is visible", function () {
              var $el;

              beforeEach(function () {
                $el = $(scope.el);
                $.fn.extend({
                  resizableColumns: jasmine.createSpy()
                });
              });

              afterEach(function () {
                delete $.fn.resizableColumns;
              });

              it("it should destroy any existing resizable column handlers", function () {
                //prepare
                var $handleContainer = $("<div class='sc-rc-handle-container'>Hello world</div>");
                var returnFalse = function() { return false; };
                var viewModel = {
                  isColumnWidthFixed: returnFalse,
                  isCheckModeEnabled: returnFalse
                };
                
                $handleContainer.prependTo($el);
                $el.data("sc-resizableColumns", "HelloWorld");

                //act
                resizableColumns.render(internalListControlData, scope.el, viewModel);

                //assert
                expect($el.resizableColumns).toHaveBeenCalledWith("destroy");
              });

              it("it should call the jQuery widget 'resizableColumns' with the correct properties, if isColumnWidthFixed is false", function () {
                //prepare
                var returnFalse = function () { return false; };
                var viewModel = {
                  isColumnWidthFixed: returnFalse,
                  isCheckModeEnabled: returnFalse
                };

                //act
                resizableColumns.render(internalListControlData, scope.el, viewModel);

                //assert
                expect($el.resizableColumns).toHaveBeenCalled();
                expect($el.resizableColumns.calls.mostRecent().args[0].columnWidths).toBe(null);
                expect($el.resizableColumns.calls.mostRecent().args[0].dragOnlyHandlers).toBe(true);
                expect(_.difference($el.resizableColumns.calls.mostRecent().args[0].minWidths, [30, 70, ""]).length).toBe(0);
                expect(typeof $el.resizableColumns.calls.mostRecent().args[0].resized).toBe("function");
              });
            });
          });
        });
      });

      describe("Given a ResponsiveColumns", function () {
        var responsiveColumns = require("ListControl/ResponsiveColumns");

        describe("#getVisibleColumns()", function () {
          it("should return the visible columns", function () {
            //prepare
            var table = document.createElement("table");
            var thead = document.createElement("thead");
            var tr = document.createElement("tr");
            var th1 = document.createElement("th");
            var th2 = document.createElement("th");
            var th3 = document.createElement("th");

            th3.style.display = "none";

            th1.innerText = "foo";
            th2.innerText = "bar";
            th3.innerText = "baz";

            var columns = tr.childNodes;

            document.querySelector("body").appendChild(table);
            table.appendChild(thead);
            thead.appendChild(tr);
            tr.appendChild(th1);
            tr.appendChild(th2);
            tr.appendChild(th3);

            //act
            var visibleColumns = responsiveColumns.prototype.getVisibleColumns(columns);

            //assert
            expect(visibleColumns.length).toBe(2);
            expect(visibleColumns[0].innerText).toBe("foo");
            expect(visibleColumns[1].innerText).toBe("bar");

            //clean
            table.remove();
          });
        });

        describe("#getLastVisibleColumn()", function () {
          it("should return the last visible column", function () {
            //prepare
            var table = document.createElement("table");
            var thead = document.createElement("thead");
            var tr = document.createElement("tr");
            var th1 = document.createElement("th");
            var th2 = document.createElement("th");
            var th3 = document.createElement("th");

            th3.style.display = "none";

            th1.innerText = "foo";
            th2.innerText = "bar";
            th3.innerText = "baz";

            var columns = tr.childNodes;

            document.querySelector("body").appendChild(table);
            table.appendChild(thead);
            thead.appendChild(tr);
            tr.appendChild(th1);
            tr.appendChild(th2);
            tr.appendChild(th3);

            //act
            var lastVisibleColumn = responsiveColumns.prototype.getLastVisibleColumn(columns);

            //assert
            expect(lastVisibleColumn.innerText).toBe("bar");

            //clean
            table.remove();
          });
        });

        describe("#getHiddenColumns()", function () {
          it("should return the hidden columns", function () {
            //prepare
            var table = document.createElement("table");
            var thead = document.createElement("thead");
            var tr = document.createElement("tr");
            var th1 = document.createElement("th");
            var th2 = document.createElement("th");
            var th3 = document.createElement("th");

            th2.style.display = "none";
            th3.style.display = "none";

            th1.innerText = "foo";
            th2.innerText = "bar";
            th3.innerText = "baz";

            var columns = tr.childNodes;

            document.querySelector("body").appendChild(table);
            table.appendChild(thead);
            thead.appendChild(tr);
            tr.appendChild(th1);
            tr.appendChild(th2);
            tr.appendChild(th3);

            //act
            var hiddenColumns = responsiveColumns.prototype.getHiddenColumns(columns);

            //assert
            expect(hiddenColumns.length).toBe(2);
            expect(hiddenColumns[0].innerText).toBe("bar");
            expect(hiddenColumns[1].innerText).toBe("baz");

            //clean
            table.remove();
          });
        });

        describe("#getFirstHiddenColumn()", function () {
          it("should return the first hidden column", function () {
            //prepare
            var table = document.createElement("table");
            var thead = document.createElement("thead");
            var tr = document.createElement("tr");
            var th1 = document.createElement("th");
            var th2 = document.createElement("th");
            var th3 = document.createElement("th");

            th2.style.display = "none";
            th3.style.display = "none";

            th1.innerText = "foo";
            th2.innerText = "bar";
            th3.innerText = "baz";

            var columns = tr.childNodes;

            document.querySelector("body").appendChild(table);
            table.appendChild(thead);
            thead.appendChild(tr);
            tr.appendChild(th1);
            tr.appendChild(th2);
            tr.appendChild(th3);

            //act
            var firstHiddenColumn = responsiveColumns.prototype.getFirstHiddenColumn(columns);

            //assert
            expect(firstHiddenColumn.innerText).toBe("bar");

            //clean
            table.remove();
          });
        });

        describe("#getMinWidth()", function () {
          it("should return the minimum width as int of the given element", function () {
            //prepare
            var element = document.createElement("div");
            element.style.minWidth = "60px";

            //act
            var minWidth = responsiveColumns.prototype.getMinWidth(element);

            //assert
            expect(minWidth).toBe(60);
          });
        });

        describe("#getMinWidths()", function () {
          it("should return the minimum widths of all given elements as int", function () {
            //prepare
            var element1 = document.createElement("div");
            var element2 = document.createElement("div");
            element1.style.minWidth = "60px";
            element2.style.minWidth = "30px";

            //act
            var minWidths = responsiveColumns.prototype.getMinWidths([element1, element2]);

            //assert
            expect(minWidths[0]).toBe(60);
            expect(minWidths[1]).toBe(30);
          });
        });

        describe("#getSum()", function () {
          it("should return the sum of all given values in array", function () {
            //prepare
            var values = [1, 2, 3];

            //act
            var sum = responsiveColumns.prototype.getSum(values);

            //assert
            expect(sum).toBe(6);
          });
        });

        describe("#isWidthExceeded()", function () {
          var table,
            columns;

          beforeEach(function () {
            table = document.createElement("table");
            table.style.tableLayout = "fixed";

            var thead = document.createElement("thead");
            var tr = document.createElement("tr");
            var th1 = document.createElement("th");
            var th2 = document.createElement("th");
            var th3 = document.createElement("th");

            th1.style.minWidth = "100px";
            th2.style.minWidth = "100px";
            th3.style.minWidth = "100px";

            th1.innerText = "foo";
            th2.innerText = "bar";
            th3.innerText = "baz";

            columns = tr.childNodes;

            document.querySelector("body").appendChild(table);
            table.appendChild(thead);
            thead.appendChild(tr);
            tr.appendChild(th1);
            tr.appendChild(th2);
            tr.appendChild(th3);
          });

          afterEach(function () {
            table.remove();
          });

          it("should return true if minimum width of columns are larger than the width of element", function () {
            //prepare
            table.style.width = "200px";

            //act
            var isWidthExceeded = responsiveColumns.prototype.isWidthExceeded(table, columns);

            //assert
            expect(isWidthExceeded).toBe(true);
          });

          it("should return false if minimum width of columns are smaller than the width of element", function () {
            //prepare
            table.style.width = "400px";

            //act
            var isWidthExceeded = responsiveColumns.prototype.isWidthExceeded(table, columns);

            //assert
            expect(isWidthExceeded).toBe(false);
          });

          it("should return false if minimum width of columns are equal to the width of element", function () {
            //prepare
            table.style.width = "300px";

            //act
            var isWidthExceeded = responsiveColumns.prototype.isWidthExceeded(table, columns);

            //assert
            expect(isWidthExceeded).toBe(false);
          });
        });

        describe("#isWidthBigEnoughForMore()", function () {
          var table,
            columns;

          beforeEach(function () {
            table = document.createElement("table");
            table.style.tableLayout = "fixed";

            var thead = document.createElement("thead");
            var tr = document.createElement("tr");
            var th1 = document.createElement("th");
            var th2 = document.createElement("th");
            var th3 = document.createElement("th");

            th1.style.minWidth = "100px";
            th2.style.minWidth = "100px";
            th3.style.minWidth = "100px";
            th3.style.display = "none";

            th1.innerText = "foo";
            th2.innerText = "bar";
            th3.innerText = "baz";

            columns = tr.childNodes;

            document.querySelector("body").appendChild(table);
            table.appendChild(thead);
            thead.appendChild(tr);
            tr.appendChild(th1);
            tr.appendChild(th2);
            tr.appendChild(th3);
          });

          afterEach(function () {
            table.remove();
          });

          it("should return true if minimum width of columns are smaller than the width of element", function () {
            //prepare
            table.style.width = "400px";

            //act
            var isWidthBigEnoughForMore = responsiveColumns.prototype.isWidthBigEnoughForMore(table, columns);

            //assert
            expect(isWidthBigEnoughForMore).toBe(true);
          });

          it("should return true if minimum width of columns are equal to the width of element", function () {
            //prepare
            table.style.width = "300px";

            //act
            var isWidthBigEnoughForMore = responsiveColumns.prototype.isWidthBigEnoughForMore(table, columns);

            //assert
            expect(isWidthBigEnoughForMore).toBe(true);
          });

          it("should return false if minimum width of columns are larger than the width of element", function () {
            //prepare
            table.style.width = "200px";

            //act
            var isWidthBigEnoughForMore = responsiveColumns.prototype.isWidthBigEnoughForMore(table, columns);

            //assert
            expect(isWidthBigEnoughForMore).toBe(false);
          });
        });

        describe("#getFirstHeaderColumns()", function () {
          it("should return the columns in the first table header of the given element", function () {
            //prepare
            var element = document.createElement("div");
            var table1 = "<table><thead><tr><th>foo1</th><th>bar1</th><th>baz1</th></tr></thead><tbody><tr><td>lorem1</td><td>ipsum1</td><td>dolor1</td></tr></tbody></table>";
            var table2 = "<table><thead><tr><th>foo2</th><th>bar2</th><th>baz2</th></tr></thead><tbody><tr><td>lorem2</td><td>ipsum2</td><td>dolor2</td></tr></tbody></table>";

            document.querySelector("body").appendChild(element);
            element.innerHTML += table1 + table2;

            //act
            var headerColumns = responsiveColumns.prototype.getFirstHeaderColumns(element);

            //assert
            expect(headerColumns.length).toBe(3);
            expect(headerColumns[0].innerText).toBe("foo1");
            expect(headerColumns[1].innerText).toBe("bar1");
            expect(headerColumns[2].innerText).toBe("baz1");

            //clean
            element.remove();
          });
        });

        describe("#getFirstHiddenBodyColumnCells()", function () {
          it("should return the first hidden column cells in the table body of a given element", function () {
            //prepare
            var table = document.createElement("table");
            table.innerHTML = '<thead><tr><th>foo</th><th style="display: none">bar</th><th style="display: none">baz</th></tr></thead><tbody><tr><td>foo</td><td style="display: none">bar</td><td style="display: none">baz</td></tr><tr><td>lorem</td><td style="display: none">ipsum</td><td style="display: none">dolor</td></tr></tbody>';
            document.querySelector("body").appendChild(table);

            //act
            var columns = responsiveColumns.prototype.getFirstHiddenBodyColumnCells(table);

            //assert
            expect(columns.length).toBe(2);
            expect(columns[0].innerText).toBe("bar");
            expect(columns[1].innerText).toBe("ipsum");

            //clean
            table.remove();
          });

          it("should return the an empty array if there are no hidden columns", function () {
            //prepare
            var table = document.createElement("table");
            table.innerHTML = '<thead><tr><th>foo</th><th>bar</th><th>baz</th></tr></thead><tbody><tr><td>foo</td><td>bar</td><td>baz</td></tr><tr><td>lorem</td><td>ipsum</td><td>dolor</td></tr></tbody>';
            document.querySelector("body").appendChild(table);

            //act
            var columns = responsiveColumns.prototype.getFirstHiddenBodyColumnCells(table);

            //assert
            expect(columns.length).toBe(0);

            //clean
            table.remove();
          });
        });

        describe("#getLastVisibleBodyColumnCells()", function () {
          it("should return the last visible column cells in the table body of a given element", function () {
            //prepare
            var table = document.createElement("table");
            table.innerHTML = '<thead><tr><th>foo</th><th>bar</th><th style="display: none">baz</th></tr></thead><tbody><tr><td>foo</td><td>bar</td><td style="display: none">baz</td></tr><tr><td>lorem</td><td>ipsum</td><td style="display: none">dolor</td></tr></tbody>';
            document.querySelector("body").appendChild(table);

            //act
            var columns = responsiveColumns.prototype.getLastVisibleBodyColumnCells(table);

            //assert
            expect(columns.length).toBe(2);
            expect(columns[0].innerText).toBe("bar");
            expect(columns[1].innerText).toBe("ipsum");

            //clean
            table.remove();
          });

          it("should return the last visible column cells in the table body of a given element, even if there are no hidden cells", function () {
            //prepare
            var table = document.createElement("table");
            table.innerHTML = '<thead><tr><th>foo</th><th>bar</th><th>baz</th></tr></thead><tbody><tr><td>foo</td><td>bar</td><td>baz</td></tr><tr><td>lorem</td><td>ipsum</td><td>dolor</td></tr></tbody>';
            document.querySelector("body").appendChild(table);

            //act
            var columns = responsiveColumns.prototype.getLastVisibleBodyColumnCells(table);

            //assert
            expect(columns.length).toBe(2);
            expect(columns[0].innerText).toBe("baz");
            expect(columns[1].innerText).toBe("dolor");

            //clean
            table.remove();
          });
        });

        describe("#getColumnIndex()", function () {
          it("should return index of the column", function () {
            //prepare
            var table = document.createElement("table");
            var thead = document.createElement("thead");
            var tr = document.createElement("tr");
            var th1 = document.createElement("th");
            var th2 = document.createElement("th");
            var th3 = document.createElement("th");

            document.querySelector("body").appendChild(table);
            table.appendChild(thead);
            thead.appendChild(tr);
            tr.appendChild(th1);
            tr.appendChild(th2);
            tr.appendChild(th3);

            //act
            var columnIndex = responsiveColumns.prototype.getColumnIndex(th2);

            //assert
            expect(columnIndex).toBe(1);

            //clean
            table.remove();
          });
        });

        describe("#render()", function () {
          describe("when cell minimum widths are 100, 100, 100", function () {
            var table,
              th1, th2, th3,
              td11, td12, td13,
              td21, td22, td23,
              viewModel = {
                isCheckModeEnabled: function () {
                  return false;
                }
              };

            _sc.extend(viewModel, _sc.utils.Events);

            beforeEach(function () {
              table = document.createElement("table");
              var thead = document.createElement("thead");
              var tbody = document.createElement("tbody");
              var headerTr = document.createElement("tr");
              var bodyTr1 = document.createElement("tr");
              var bodyTr2 = document.createElement("tr");
              th1 = document.createElement("th");
              th2 = document.createElement("th");
              th3 = document.createElement("th");
              td11 = document.createElement("td");
              td12 = document.createElement("td");
              td13 = document.createElement("td");
              td21 = document.createElement("td");
              td22 = document.createElement("td");
              td23 = document.createElement("td");

              table.style.tableLayout = "fixed";
              th1.style.minWidth = "100px";
              th2.style.minWidth = "100px";
              th3.style.minWidth = "100px";

              th1.innerText = "foo";
              th2.innerText = "bar";
              th3.innerText = "baz";
              td11.innerText = "lorem1";
              td12.innerText = "ipsum1";
              td13.innerText = "dolor1";
              td21.innerText = "lorem2";
              td22.innerText = "ipsum2";
              td23.innerText = "dolor2";

              document.querySelector("body").appendChild(table);
              table.appendChild(thead);
              thead.appendChild(headerTr);
              headerTr.appendChild(th1);
              headerTr.appendChild(th2);
              headerTr.appendChild(th3);
              table.appendChild(tbody);
              tbody.appendChild(bodyTr1);
              tbody.appendChild(bodyTr2);
              bodyTr1.appendChild(td11);
              bodyTr1.appendChild(td12);
              bodyTr1.appendChild(td13);
              bodyTr2.appendChild(td21);
              bodyTr2.appendChild(td22);
              bodyTr2.appendChild(td23);
            });

            afterEach(function () {
              table.remove();
            });

            it("should show all columns if element width is 400", function () {
              //prepare
              table.style.width = "400px";
              var spy = jasmine.createSpy();

              //act
              responsiveColumns.prototype.render(table, viewModel, spy);

              //assert
              expect(th1.style.display === "none").toBe(false);
              expect(th2.style.display === "none").toBe(false);
              expect(th3.style.display === "none").toBe(false);
              expect(td11.style.display === "none").toBe(false);
              expect(td12.style.display === "none").toBe(false);
              expect(td13.style.display === "none").toBe(false);
              expect(td21.style.display === "none").toBe(false);
              expect(td22.style.display === "none").toBe(false);
              expect(td23.style.display === "none").toBe(false);
            });

            it("should show two columns if element width is 250", function () {
              //prepare
              table.style.width = "250px";
              var spy = jasmine.createSpy();

              //act
              responsiveColumns.prototype.render(table, viewModel, spy);

              //assert
              expect(th1.style.display === "none").toBe(false);
              expect(th2.style.display === "none").toBe(false);
              expect(th3.style.display === "none").toBe(true);
              expect(td11.style.display === "none").toBe(false);
              expect(td12.style.display === "none").toBe(false);
              expect(td13.style.display === "none").toBe(true);
              expect(td21.style.display === "none").toBe(false);
              expect(td22.style.display === "none").toBe(false);
              expect(td23.style.display === "none").toBe(true);
            });

            it("should show two columns if element width is 200", function () {
              //prepare
              table.style.width = "200px";
              var spy = jasmine.createSpy();

              //act
              responsiveColumns.prototype.render(table, viewModel, spy);

              //assert
              expect(th1.style.display === "none").toBe(false);
              expect(th2.style.display === "none").toBe(false);
              expect(th3.style.display === "none").toBe(true);
              expect(td11.style.display === "none").toBe(false);
              expect(td12.style.display === "none").toBe(false);
              expect(td13.style.display === "none").toBe(true);
              expect(td21.style.display === "none").toBe(false);
              expect(td22.style.display === "none").toBe(false);
              expect(td23.style.display === "none").toBe(true);
            });

            it("should never hide all columns, even if the width is too small", function () {
              //prepare
              table.style.width = "50px";
              var spy = jasmine.createSpy();

              //act
              responsiveColumns.prototype.render(table, viewModel, spy);

              //assert
              expect(th1.style.display === "none").toBe(false);
              expect(th2.style.display === "none").toBe(true);
              expect(th3.style.display === "none").toBe(true);
              expect(td11.style.display === "none").toBe(false);
              expect(td12.style.display === "none").toBe(true);
              expect(td13.style.display === "none").toBe(true);
              expect(td21.style.display === "none").toBe(false);
              expect(td22.style.display === "none").toBe(true);
              expect(td23.style.display === "none").toBe(true);
            });

            it("should show three columns when width is 300, and the last column was hidden", function () {
              //prepare
              table.style.width = "300px";
              th3.style.display = "none";
              td13.style.display = "none";
              td23.style.display = "none";
              var spy = jasmine.createSpy();

              //act
              responsiveColumns.prototype.render(table, viewModel, spy);

              //assert
              expect(th1.style.display === "none").toBe(false);
              expect(th2.style.display === "none").toBe(false);
              expect(th3.style.display === "none").toBe(false);
              expect(td11.style.display === "none").toBe(false);
              expect(td12.style.display === "none").toBe(false);
              expect(td13.style.display === "none").toBe(false);
              expect(td21.style.display === "none").toBe(false);
              expect(td22.style.display === "none").toBe(false);
              expect(td23.style.display === "none").toBe(false);
            });

            describe("given a callback method", function () {
              it("it should execute, if there are hidden columns", function () {
                //prepare
                table.style.width = "250px";
                var spy = jasmine.createSpy();

                //act
                responsiveColumns.prototype.render(table, viewModel, spy);

                //assert
                expect(spy).toHaveBeenCalled();
              });
            });
          });
        });

      });
    });

    describe("- Integration tests", function () {
      describe("Given a ListControl component", function () {
        it("it should add 'sc-detaillist' as a class to the element, when ViewMode is ''", function () {
          component = _sc.app.ListControlViewModeDefault;

          expect(component.el.className.indexOf("sc-detaillist")).not.toBe(-1);
        });

        describe("when ItemClick is set", function () {
          var spy;

          beforeEach(function () {
            spy = jasmine.createSpy();
            window.verifyItemClick = function () {
              spy();
            };
          });

          afterEach(function () {
            delete window.verifyItemClick;
          });

          it("it should not execute when empty and item is clicked", function () {
            //prepare
            component = _sc.app.ListControlItemClickDefault;
            var tr = component.el.querySelectorAll(".sc-listcontrol-body tbody > tr")[0];

            //act
            $(tr).click();

            //assert
            expect(spy).not.toHaveBeenCalled();
          });

          it("it should execute when set and item is clicked", function () {
            //prepare
            component = _sc.app.ListControlItemClickValue;
            var tr = component.el.querySelectorAll(".sc-listcontrol-body tbody > tr")[0];

            //act
            $(tr).click();

            //assert
            expect(spy).toHaveBeenCalled();
          });

          it("it should throw an error when set with malformed string and item is clicked", function () {
            //prepare
            component = _sc.app.ListControlItemClickMalformed;
            var tr = component.el.querySelectorAll(".sc-listcontrol-body tbody > tr")[0];

            //act
            var click = $(tr).click;

            //assert
            expect(click).toThrow();
          });

        });

        describe("when ScrollEnded is set", function () {
          var spy;

          beforeEach(function () {
            spy = jasmine.createSpy();
            window.verifyScrollEnded = function () {
              spy();
            };
          });

          afterEach(function () {
            delete window.verifyScrollEnded;
          });

          it("it should not execute when empty and scroll reaches near bottom", function () {
            //prepare
            component = _sc.app.ListControlScrollEndedDefault;
            
            //act
            component.scrollToBottom();

            //assert
            expect(spy).not.toHaveBeenCalled();
          });

          it("it should execute when empty and scroll reaches near bottom", function () {
            //prepare
            component = _sc.app.ListControlScrollEndedValue;
            

            //act
            component.scrollToBottom();

            //assert
            expect(spy).toHaveBeenCalled();
          });

          it("it should throw an error when set with malformed string and scroll reaches near bottom", function () {
            //prepare
            component = _sc.app.ListControlScrollEndedMalformed;

            //act
            var action = component.scrollToBottom;

            //assert
            expect(action).toThrow();
          });

        });

        describe("when ViewMode is DetailList", function () {
          //helper
          var getColumnTypeIndex = function (component, colTypeString) {
            var colDefs = component.ColumnDefinitionItems;
            for (var i = 0, len = colDefs.length; i < len; i = i + 1) {
              var item = colDefs[i];
              if (item.ColumnType === colTypeString) {
                return i;
              }
            }

            return -1;
          };

          it("it should add 'sc-detaillist' as a class to the element", function () {
            component = _sc.app.ListControlViewModeDetailList;

            expect(component.el.className.indexOf("sc-detaillist")).not.toBe(-1);
          });

          it("it should have 3 rows if there are 3 objects in DynamicData", function () {
            component = _sc.app.ListControlDynamicData;

            expect(component.el.querySelectorAll(".sc-listcontrol-body tbody > tr").length).toBe(3);
          });

          it("it should prompt a 'no data to display' row - and a header - if there are no objects in DynamicData, but object(s) in the ColumnDefinitionItems", function () {
            component = _sc.app.ListControlEmptyData;

            expect(component.el.querySelectorAll("tbody > tr")[0].classList.contains("sc-nodata-row")).toBe(true);
            expect(component.el.querySelectorAll("thead > tr > th")[0].innerText).toBe("DemoColumnField");
          });

          it("it should prompt a 'no data to display' row - and no header - if there are no objects in ColumnDefinitionItems", function () {
            component = _sc.app.ListControlNoColumnDefinitionItems;

            expect(component.el.querySelectorAll("tbody > tr")[0].classList.contains("sc-nodata-row")).toBe(true);
            expect(component.el.querySelectorAll("thead").length).toBe(0);
          });

          it("it should automatically show all columns, if there are enough space", function () {
            //prepare
            component = _sc.app.ListControlResponsiveColumnsAllShown;
            var headerCells = Array.prototype.filter.call(component.el.querySelectorAll("thead > tr > th"), function (el) { return el.style.display === "none"; });
            var bodyCells = Array.prototype.filter.call(component.el.querySelectorAll("tbody > tr > td"), function (el) { return el.style.display === "none" });

            //assert
            expect(headerCells.length).toBe(0);
            expect(bodyCells.length).toBe(0);
          });

          it("it should automatically hidden the columns, when there is not enough space", function () {
            //prepare
            component = _sc.app.ListControlResponsiveColumnsTwoHidden;

            //act
            component.el.style.width = "200px";
            component.render();

            //assert
            var headerCells = Array.prototype.filter.call(component.el.querySelectorAll("thead > tr > th"), function (el) { return el.style.display === "none" });
            var bodyCells = Array.prototype.filter.call(component.el.querySelectorAll("tbody > tr > td"), function (el) { return el.style.display === "none" });

            expect(headerCells.length).toBe(2);
            expect(bodyCells.length).toBe(6);
          });

          it("it should always show minimum one column", function () {
            //prepare
            component = _sc.app.ListControlResponsiveColumnsMinimumOne;

            //act
            component.el.style.width = "100px";
            component.render();

            //assert
            var headerCells = Array.prototype.filter.call(component.el.querySelectorAll("thead > tr > th"), function (el) { return el.style.display === "none" });
            var bodyCells = Array.prototype.filter.call(component.el.querySelectorAll("tbody > tr > td"), function (el) { return el.style.display === "none" });

            expect(headerCells.length).toBe(2);
            expect(bodyCells.length).toBe(6);
          });

          it("it should hide columns if needed when it becomes visible", function (done) {
            //prepare
            component = _sc.app.ListControlResponsiveColumnsHiddenContainer;
            var border = _sc.app.BorderResponsiveColumnsHiddenContainer;

            //act

            //assert
            expect(Array.prototype.filter.call(component.el.querySelectorAll("thead th"), function (column) { return column.style.display === "none"; }).length).toBe(0);

            border.IsVisible = true;

            setTimeout(function() {
              expect(Array.prototype.filter.call(component.el.querySelectorAll("thead th"), function (column) { return column.style.display === "none"; }).length).toBe(1);
              done();
            }, 1010);
          });

          it("it should retain the same scroll position on re-render", function () {
            component = _sc.app.ListControlScrollEndedDefault;
            var scrollPos = 50;
            component.scrollTo(scrollPos);

            //act
            component.trigger("change:Items");

            //assert
            expect(component.ScrollPosition).toBe(scrollPos);


          });

          it("it should show a popover, when I click on the first cell in the header, if columns are hidden", function () {
            //prepare
            component = _sc.app.ListControlResponsiveColumnsColumnSwapEnabled;

            //act
            component.el.style.width = "400px";
            component.render();
            component.el.querySelector("thead > tr > th").click();

            //assert
            expect(component.el.querySelectorAll(".sc-popover").length).toBe(1);
          });

          it("it should show the hidden columns in the popover", function () {
            //prepare
            component = _sc.app.ListControlResponsiveColumnsPopoverHiddenColumns;

            //act
            component.el.style.width = "200px";
            component.render();
            component.el.querySelector("thead > tr > th").click();

            //assert
            expect(component.el.querySelectorAll(".sc-columnswap-item").length).toBe(2);
          });

          it("it should swap columns, when I click on a hidden column in the popover", function () {
            //prepare
            component = _sc.app.ListControlResponsiveColumnsColumnSwap;

            //act
            component.el.style.width = "200px";
            component.render();
            component.el.querySelector("thead > tr > th").click();
            component.el.querySelector(".sc-columnswap-item").click();

            //assert
            expect(component.el.querySelector("thead > tr > th").innerText.trim()).toBe("ResponsiveColumn2");
          });

          describe("when IsColumnWidthFixed is set", function () {
            it("it should not enable resizing of columns, if true", function () {
              component = _sc.app.ListControlIsColumnWidthFixedTrue;

              expect(component.el.querySelectorAll(".sc-rc-handle-container").length).toBe(0);
            });

            it("it should enable resizing of columns, if false", function () {
              component = _sc.app.ListControlIsColumnWidthFixedFalse;

              expect(component.el.querySelectorAll(".sc-rc-handle-container").length).toBe(1);
            });

            it("it should resize columns accordingly, if false", function (done) {
              require(["/sitecore/shell/client/Business Component Library/version 2/Test/vendors/jquery.simulate.js"], function () {
                //prepare
                component = _sc.app.ListControlIsColumnWidthFixedFalse;
                var $handleElement = $(component.el).find(".sc-rc-handle").eq(0);
                var amountOfPixels = 40;
                var $headerElementA = $(component.el).find("thead th").eq(0);
                var originalWidthA = $headerElementA.width();
                var $headerElementB = $(component.el).find("thead th").eq(1);
                var originalWidthB = $headerElementB.width();

                //act
                $handleElement.simulate("drag", { moves: 1, dx: amountOfPixels });

                //assert
                var higher = amountOfPixels - 1;
                var lower = amountOfPixels + 1;
                var differenceA = $headerElementA.width() - originalWidthA;
                var differenceB = originalWidthB - $headerElementB.width();

                expect(differenceA >= higher && differenceA <= lower).toBe(true);
                expect(differenceB >= higher && differenceB <= lower).toBe(true);

                done();
              });
            });
          });

          describe("when IsSelectionRequired is set", function () {
            describe("and 'SelectedValue' is empty", function () {
              it("it should have first row selected by default, if set to true", function () {
                //prepare
                component = _sc.app.ListControlIsSelectionRequiredTrueSelectedValueNull;
                var tr = component.el.querySelectorAll(".sc-listcontrol-body tbody > tr")[0];

                //act

                //assert
                expect(tr.classList.contains("selected")).toBe(true);
              });

              it("it should not have first row selected by default, if set to false", function () {
                //prepare
                component = _sc.app.ListControlIsSelectionRequiredFalseSelectedValueNull;
                var tr = component.el.querySelectorAll(".sc-listcontrol-body tbody > tr")[0];

                //act

                //assert
                expect(tr.classList.contains("selected")).toBe(false);
              });
            });

            describe("and 'SelectedValue' is set", function () {
              it("it should have the row with selected value to be selected by default, if set to true", function () {
                //prepare
                component = _sc.app.ListControlIsSelectionRequiredTrueSelectedValue;
                var tr = component.el.querySelectorAll(".sc-listcontrol-body tbody > tr")[1];

                //act

                //assert
                expect(tr.classList.contains("selected")).toBe(true);
              });

              it("it should have the row with selected value to be selected by default, if set to false", function () {
                //prepare
                component = _sc.app.ListControlIsSelectionRequiredFalseSelectedValue;
                var tr = component.el.querySelectorAll(".sc-listcontrol-body tbody > tr")[1];

                //act

                //assert
                expect(tr.classList.contains("selected")).toBe(true);
              });
            });

            it("it should be possible to deselect row, if set to false", function () {
              //prepare
              component = _sc.app.ListControlIsSelectionRequiredFalse;
              var tr = component.el.querySelectorAll(".sc-listcontrol-body tbody > tr")[0];

              //act
              $(tr).trigger("click");
              $(tr).trigger("click");

              //assert
              expect(tr.classList.contains("selected")).toBe(false);
            });

            it("it should not be possible to deselect row, if set to true", function () {
              //prepare
              component = _sc.app.ListControlIsSelectionRequiredTrue;
              var tr = component.el.querySelectorAll(".sc-listcontrol-body tbody > tr")[0];

              //act
              $(tr).trigger("click");

              //assert
              expect(tr.classList.contains("selected")).toBe(true);
            });
          });

          describe("when IsSelectionDisabled is set", function () {
            it("it should not be possible to select row, if set to true", function () {
              //prepare
              component = _sc.app.ListControlIsSelectionDisabledTrue;
              var tr = component.el.querySelectorAll(".sc-listcontrol-body tbody > tr")[0];

              //act
              $(tr).trigger("click");

              //assert
              expect(tr.classList.contains("selected")).toBe(false);
            });

            it("it should be possible to select row, if set to false, and CheckedItems is empty", function () {
              //prepare
              component = _sc.app.ListControlIsSelectionDisabledFalse;
              var tr = component.el.querySelectorAll(".sc-listcontrol-body tbody > tr")[0];

              //act
              $(tr).trigger("click");

              //assert
              expect(tr.classList.contains("selected")).toBe(true);
            });

            it("it should not be possible to select row, if set to false, and CheckedItems contains items", function () {
              //prepare
              component = _sc.app.ListControlIsSelectionDisabledFalseCheckItemsSet;
              var tr = component.el.querySelectorAll(".sc-listcontrol-body tbody > tr")[0];
              component.checkAt([1]);

              //act
              $(tr).trigger("click");

              //assert
              expect(tr.classList.contains("selected")).toBe(false);
            });
          });

          describe("when IsCheckModeEnabled is set", function () {
            describe("and it is set to false", function () {
              it("it should not have checkboxes in both header and body in the first column", function () {
                //prepare
                component = _sc.app.ListControlIsCheckModeEnabledFalse;
                var headerCheckbox = component.el.querySelectorAll('.sc-listcontrol-header thead > tr > th:first-child > input[type="checkbox"]');
                var bodyCheckbox = component.el.querySelectorAll('.sc-listcontrol-body tbody > tr > td:first-child > input[type="checkbox"]');

                //assert
                expect(headerCheckbox.length).toBe(0);
                expect(bodyCheckbox.length).toBe(0);
              });
            });

            describe("and it is set to true", function () {
              it("it should have checkboxes in both header and body in the first column", function () {
                //prepare
                component = _sc.app.ListControlIsCheckModeEnabledTrue;
                var headerCheckbox = component.el.querySelectorAll('.sc-listcontrol-header thead > tr > th:first-child > input[type="checkbox"]');
                var bodyCheckbox = component.el.querySelectorAll('.sc-listcontrol-body tbody > tr > td:first-child > input[type="checkbox"]');

                //assert
                expect(headerCheckbox.length).toBe(1);
                expect(bodyCheckbox.length).toBe(3);
              });

              it("it should be possible to check a single row", function () {
                //prepare
                component = _sc.app.ListControlIsCheckModeEnabledTrueSingleChecking;
                var row = component.el.querySelector('.sc-listcontrol-body tbody > tr:first-child');
                var checkbox = row.querySelector(':scope > td.sc-listcontrol-checking > input[type="checkbox"]');

                //act
                $(checkbox).trigger("click");

                //assert
                expect(row.classList.contains("checked")).toBe(true);
                expect(component.CheckedValues.length).toBe(1);
                expect(component.CheckedValues[0]).toBe("{97460826-99A4-4090-91F1-C2B07312553D}");
              });

              it("it should be possible to uncheck a single row", function () {
                //prepare
                component = _sc.app.ListControlIsCheckModeEnabledTrueSingleUncheck;
                var row = component.el.querySelector('.sc-listcontrol-body tbody > tr:first-child');
                var checkbox = row.querySelector(':scope > td.sc-listcontrol-checking > input[type="checkbox"]');

                //act
                $(checkbox).trigger("click");
                $(checkbox).trigger("click");

                //assert
                expect(row.classList.contains("checked")).toBe(false);
                expect(component.CheckedValues.length).toBe(0);
              });

              it("it should be possible to check a multiple rows", function () {
                //prepare
                component = _sc.app.ListControlIsCheckModeEnabledTrueMultipleChecking;
                var rows = component.el.querySelectorAll('.sc-listcontrol-body tbody > tr');
                var row1 = rows[0];
                var row2 = rows[1];
                var checkbox1 = row1.querySelector(':scope > td.sc-listcontrol-checking > input[type="checkbox"]');
                var checkbox2 = row2.querySelector(':scope > td.sc-listcontrol-checking > input[type="checkbox"]');

                //act
                $(checkbox1).trigger("click");
                $(checkbox2).trigger("click");

                //assert
                expect(row1.classList.contains("checked")).toBe(true);
                expect(row2.classList.contains("checked")).toBe(true);
                expect(component.CheckedValues.length).toBe(2);
                expect(component.CheckedValues[0]).toBe("{97460826-99A4-4090-91F1-C2B07312553D}");
                expect(component.CheckedValues[1]).toBe("{22C99932-18C6-4D64-ADD4-76CB7F239820}");
              });

              it("it should be possible to check the checkbox by clicking the table cell", function () {
                //prepare
                component = _sc.app.ListControlIsCheckModeEnabledTrueTableCellChecking;
                var row = component.el.querySelector('.sc-listcontrol-body tbody > tr:first-child');
                var cell = row.querySelector(':scope > td.sc-listcontrol-checking');

                //act
                $(cell).trigger("click");

                //assert
                expect(row.classList.contains("checked")).toBe(true);
                expect(component.CheckedValues.length).toBe(1);
                expect(component.CheckedValues[0]).toBe("{97460826-99A4-4090-91F1-C2B07312553D}");
              });

              it("it should be possible to check the checkbox by clicking the table row, when there are already checked items", function () {
                //prepare
                component = _sc.app.ListControlIsCheckModeEnabledTrueCheckedItemsSetTableRowCheck;
                var rows = component.el.querySelectorAll('.sc-listcontrol-body tbody > tr');
                var cell = rows[0].querySelector(':scope > td.sc-listcontrol-checking');

                //act
                $(cell).trigger("click");
                $(rows[2]).trigger("click");

                //assert
                expect(rows[0].classList.contains("checked")).toBe(true);
                expect(rows[2].classList.contains("checked")).toBe(true);
                expect(component.CheckedValues.length).toBe(2);
                expect(component.CheckedValues[0]).toBe("{97460826-99A4-4090-91F1-C2B07312553D}");
                expect(component.CheckedValues[1]).toBe("{F7A27765-EEF6-4631-BF63-F03730F11AB2}");
              });

              it("it should be possible to check the checkbox by clicking the table row, when there are already checked items", function () {
                //prepare
                component = _sc.app.ListControlIsCheckModeEnabledTrueCheckedItemsSetTableRowUncheck;
                var rows = component.el.querySelectorAll('.sc-listcontrol-body tbody > tr');
                var cell = rows[0].querySelector(':scope > td.sc-listcontrol-checking');

                //act
                $(cell).trigger("click");
                $(rows[0]).trigger("click");

                //assert
                expect(rows[0].classList.contains("checked")).toBe(false);
                expect(component.CheckedValues.length).toBe(0);
              });

              it("it should not be possible to check the checkbox by clicking the table row, when there are no checked items", function () {
                //prepare
                component = _sc.app.ListControlIsCheckModeEnabledTrueCheckedItemsNullTableRowCheck;
                var row = component.el.querySelector('.sc-listcontrol-body tbody > tr:first-child');

                //act
                $(row).trigger("click");

                //assert
                expect(row.classList.contains("checked")).toBe(false);
                expect(component.CheckedValues.length).toBe(0);
              });

              it("it should be possible to check all by clicking the header checkbox", function () {
                //prepare
                component = _sc.app.ListControlIsCheckModeEnabledTrueCheckboxCheckAll;
                var headerRow = component.el.querySelector('.sc-listcontrol-header > thead > tr');
                var checkbox = headerRow.querySelector('.sc-listcontrol-checking-all > input[type="checkbox"]');
                var bodyRows = component.el.querySelectorAll('.sc-listcontrol-body tbody > tr');

                //act
                $(checkbox).trigger("click");

                //assert
                expect(bodyRows[0].classList.contains("checked")).toBe(true);
                expect(bodyRows[1].classList.contains("checked")).toBe(true);
                expect(bodyRows[2].classList.contains("checked")).toBe(true);
                expect(component.CheckedValues.length).toBe(3);
              });

              it("it should be possible to check all by clicking the header cell", function () {
                //prepare
                component = _sc.app.ListControlIsCheckModeEnabledTrueHeaderCellCheckAll;
                var headerRow = component.el.querySelector('.sc-listcontrol-header');
                var headerCell = headerRow.querySelector('.sc-listcontrol-checking-all');
                var bodyRows = component.el.querySelectorAll('.sc-listcontrol-body tbody > tr');

                //act
                $(headerCell).trigger("click");

                //assert
                expect(bodyRows[0].classList.contains("checked")).toBe(true);
                expect(bodyRows[1].classList.contains("checked")).toBe(true);
                expect(bodyRows[2].classList.contains("checked")).toBe(true);
                expect(component.CheckedValues.length).toBe(3);
              });

              it("it should be possible to uncheck all by clicking the header checkbox", function () {
                //prepare
                component = _sc.app.ListControlIsCheckModeEnabledTrueCheckboxUncheckAll;
                var headerRow = component.el.querySelector('.sc-listcontrol-header');
                var checkbox = headerRow.querySelector('.sc-listcontrol-checking-all > input[type="checkbox"]');
                var bodyRows = component.el.querySelectorAll('.sc-listcontrol-body tbody > tr');

                //act
                $(checkbox).trigger("click");
                $(checkbox).trigger("click");

                //assert
                expect(bodyRows[0].classList.contains("checked")).toBe(false);
                expect(bodyRows[1].classList.contains("checked")).toBe(false);
                expect(bodyRows[2].classList.contains("checked")).toBe(false);
                expect(component.CheckedValues.length).toBe(0);
              });

              it("it should be possible to uncheck all by clicking the header cell", function () {
                //prepare
                component = _sc.app.ListControlIsCheckModeEnabledTrueHeaderCellUncheckAll;
                var headerRow = component.el.querySelector('.sc-listcontrol-header');
                var headerCell = headerRow.querySelector('.sc-listcontrol-checking-all');
                var bodyRows = component.el.querySelectorAll('.sc-listcontrol-body tbody > tr');

                //act
                $(headerCell).trigger("click");
                $(headerCell).trigger("click");

                //assert
                expect(bodyRows[0].classList.contains("checked")).toBe(false);
                expect(bodyRows[1].classList.contains("checked")).toBe(false);
                expect(bodyRows[2].classList.contains("checked")).toBe(false);
                expect(component.CheckedValues.length).toBe(0);
              });

              it("it should check the header checkbox, when CheckedItems contains all items", function () {
                //prepare
                component = _sc.app.ListControlIsCheckModeEnabledTrueHeaderCheckboxCheckedTrue;
                var headerRow = component.el.querySelector('.sc-listcontrol-header');
                var checkbox = headerRow.querySelector('.sc-listcontrol-checking-all > input[type="checkbox"]');

                //act
                component.checkAll();

                //assert
                expect(checkbox.checked).toBe(true);
              });

              it("it should not check the header checkbox, when CheckedItems does not contain all items", function () {
                //prepare
                component = _sc.app.ListControlIsCheckModeEnabledTrueHeaderCheckboxCheckedFalse;
                var headerRow = component.el.querySelector('.sc-listcontrol-header');
                var checkbox = headerRow.querySelector('.sc-listcontrol-checking-all > input[type="checkbox"]');

                //act
                component.checkAt([1, 2]);

                //assert
                expect(checkbox.checked).toBe(false);
              });

              it("it should select the first row, when CheckedItems becomes empty, and IsSelectionRequired is true", function () {
                //prepare
                component = _sc.app.ListControlIsCheckModeEnabledTrueIsSelectionRequiredTrue;
                var rows = component.el.querySelectorAll('.sc-listcontrol-body tbody > tr');
                var cell = rows[1].querySelector('.sc-listcontrol-checking');
                component.selectAt(2);

                //act
                $(cell).trigger("click");
                $(cell).trigger("click");

                //assert
                expect(component.CheckedItems.length).toBe(0);
                expect(rows[0].classList.contains("selected")).toBe(true);
              });

              it("it should not select the first row, when CheckedItems becomes empty, and IsSelectionRequired is false", function () {
                //prepare
                component = _sc.app.ListControlIsCheckModeEnabledTrueIsSelectionRequiredFalse;
                var rows = component.el.querySelectorAll('.sc-listcontrol-body tbody > tr');
                var cell = rows[1].querySelector('.sc-listcontrol-checking');
                component.selectAt(2);

                //act
                $(cell).trigger("click");
                $(cell).trigger("click");

                //assert
                expect(component.CheckedItems.length).toBe(0);
                expect(rows[0].classList.contains("selected")).toBe(false);
              });

              describe("and when CheckedItems contains items", function () {
                it("it should set SelectedItem and SelectedValue to empty", function () {
                  //prepare
                  component = _sc.app.ListControlIsCheckModeEnabledTrueCheckedItemsSetSelectedItemsNull;
                  var row = component.el.querySelector('.sc-listcontrol-body tbody > tr:first-child');
                  var cell = row.querySelector('.sc-listcontrol-checking');
                  component.selectAt(1);

                  //act
                  $(cell).trigger("click");

                  //assert
                  expect(component.SelectedItem.length).toBe(0);
                  expect(component.SelectedValue.length).toBe(0);
                });
              });

              it("it should not show a popover, when I click on the first cell in the header, if columns are hidden", function () {
                //prepare
                component = _sc.app.ListControlIsCheckModeEnabledColumnSwapDisabled;

                //act
                component.el.style.width = "400px";
                component.render();
                component.el.querySelector("thead > tr > th").click();

                //assert
                expect(component.el.querySelectorAll(".sc-popover").length).toBe(0);
              });

              it("it should swap appropiate columns, when I click on a hidden column in the popover", function () {
                //prepare
                component = _sc.app.ListControlIsCheckModeEnabledColumnSwap;

                //act
                component.el.style.width = "200px";
                component.render();
                component.el.querySelectorAll("thead > tr > th")[1].click();
                component.el.querySelector(".sc-columnswap-item").click();

                //assert
                expect(component.el.querySelectorAll("thead > tr > th")[1].innerText.trim()).toBe("ResponsiveColumn2");
              });
            });
          });

          describe("when IsHeightInherited is set", function () {
            //helpers
            var hasScrollBar = function (el) {
              var styles = window.getComputedStyle(el);
              if (styles.overflow === "hidden" || styles.overflowY === "hidden") {
                return false;
              }
              return el.scrollHeight > el.offsetHeight;
            };

            describe("and set to true", function () {
              it("it should have the same height as it's parent", function () {
                //Prepare
                component = _sc.app.ListControlIsHeightInheritedTrue;
                var componentParent = component.el.parentElement;

                //act
                var parentHeight = componentParent.clientHeight;
                var componentHeight = component.el.offsetHeight;

                //assert
                expect(componentHeight).toBe(parentHeight);
              });

              it("it should show 3 items, no scrollbar, and have filler rows for the remaining height", function () {
                //prepare 
                component = _sc.app.ListControlIsHeightInheritedTrue;
                var componentParent = component.el.parentElement;
                var scrollBox = component.el.querySelector(".sc-listcontrol-body-wrapper");
                var fillers = component.el.querySelector(".sc-filler-rows tbody");

                //act
                var parentHeight = componentParent.clientHeight;
                var componentHeight = component.el.offsetHeight;
                var numOfFillers = fillers.querySelectorAll("tr").length;
                //assert
                expect(componentHeight).toBe(parentHeight);
                expect(hasScrollBar(scrollBox)).toBe(false);
                expect(numOfFillers > 0).toBe(true);
              });

              it("it should have a scrollbar and not show fillers, if DynamicData has 3 items and parent height is less the the height of 3 items", function () {
                //prepare
                component = _sc.app.ListControlIsHeightInheritedTrueSmallParentHeight;
                var items = component.el.querySelector(".sc-listcontrol-body");
                var parent = component.el.querySelector(".sc-listcontrol-body-wrapper");
                var numOfFillers = component.el.querySelectorAll(".sc-filler-rows tbody tr").length;

                //assert
                expect(hasScrollBar(parent)).toBe(true);
                expect(numOfFillers).toBe(0);
              });

            });

            describe("and set to false", function () {

              describe("and MinRows is set", function () {
                it("it should show 4 filler rows, if there is 0 or 1 item in DynamicData, and MinRows is set to 5", function () {
                  //prepare
                  component = _sc.app.ListControlMinRowsValueBiggerThanItems;
                  var numOfFillers = component.el.querySelectorAll(".sc-filler-rows tbody tr").length;

                  //assert
                  expect(numOfFillers).toBe(4);
                });

                it("it should apply 'reverse-stripes' class to fillers, if there is an uneven number of items in DynamicData, and MinRows is set to 5", function () {
                  //prepare
                  component = _sc.app.ListControlMinRowsValueBiggerThanItems;

                  //assert
                  expect(component.el.querySelector(".sc-filler-rows").classList.contains("sc-reverse-stripes")).toBe(true);

                });

                it("it should not apply 'reverse-stripes' class to fillers, if there is an even number of items in DynamicData and MinRows is set to 5", function () {
                  //prepare
                  component = _sc.app.ListControlMinRowsValueBiggerThanItemsWithEvenNumber;

                  //assert
                  expect(component.el.querySelector(".sc-filler-rows").classList.contains("sc-reverse-stripes")).toBe(false);
                });

                it("it should not show any filler row, if there are 3 items in DynamicData, and MinRows is set to 3", function () {
                  //prepare
                  component = _sc.app.ListControlMinRowsValueSmallerOrEqualsItems;
                  var numOfFillers = component.el.querySelectorAll(".sc-filler-rows tbody tr").length;

                  //assert
                  expect(numOfFillers).toBe(0);
                });
              });

              describe("and MaxRows is set", function () {
                it("it should show exactly 2 rows, and be scrollable if there are 3 items in DynamicData, and MaxRows is set to 2", function () {
                  //prepare
                  component = _sc.app.ListControlMaxRowsValueSmallerThanItems;
                  var rowContainer = component.el.querySelector(".sc-listcontrol-body-wrapper"),
                    numOfFillers = component.el.querySelectorAll(".sc-filler-rows tbody tr").length,
                    rowHeight = 40,
                    numOfVisibleItems = 2;

                  //assert
                  expect(numOfFillers).toBe(0);
                  expect(hasScrollBar(rowContainer)).toBe(true);
                  expect(rowContainer.offsetHeight).toBe(numOfVisibleItems * rowHeight);
                });

                it("it should show exactly 3 rows, and not be scrollable if there 3 items in DynamicData, and MaxRows is set to 3", function () {
                  //prepare
                  component = _sc.app.ListControlMaxRowsValueEqualsItems;
                  var rowContainer = component.el.querySelector(".sc-listcontrol-body-wrapper"),
                    numOfFillers = component.el.querySelectorAll(".sc-filler-rows tbody tr").length,
                    rowHeight = 40,
                    numOfVisibleItems = 3;

                  //assert
                  expect(numOfFillers).toBe(0);
                  expect(hasScrollBar(rowContainer)).toBe(false);
                  expect(rowContainer.offsetHeight).toBe(numOfVisibleItems * rowHeight);
                });
              });

              describe("and both MinRows and MaxRows is set", function () {
                it("it should show 3 rows and 2 filler rows, and not be scrollable if there are 3 items in DynamicData, and MinRows is set to 5 and MaxRows is set to 5", function () {
                  //prepare
                  component = _sc.app.ListControlMaxRowsValueEqualMinRowsValue;
                  var rowContainer = component.el.querySelector(".sc-listcontrol-body-wrapper"),
                    numOfFillers = component.el.querySelectorAll(".sc-filler-rows tbody tr").length,
                    rowHeight = 40,
                    numOfVisibleRowsWithFillers = 5;

                  //assert
                  expect(numOfFillers).toBe(2);
                  expect(hasScrollBar(rowContainer)).toBe(false);
                  expect(rowContainer.offsetHeight).toBe(numOfVisibleRowsWithFillers * rowHeight);

                });

                it("it should show 3 rows and no fillers row and not be scrollable if there are 3 items in DynamicData, and MinRows is set to 5 and MaxRoes is set to 3", function () {
                  //prepare
                  component = _sc.app.ListControlMaxRowsIsLessThanMinRows;
                  var rowContainer = component.el.querySelector(".sc-listcontrol-body-wrapper"),
                    numOfFillers = component.el.querySelectorAll(".sc-filler-rows tbody tr").length,
                    rowHeight = 40,
                    numOfVisibleItems = 3;

                  //assert
                  expect(numOfFillers).toBe(0);
                  expect(hasScrollBar(rowContainer)).toBe(false);
                  expect(rowContainer.offsetHeight).toBe(numOfVisibleItems * rowHeight);
                });
              });
            });
          });

          describe("when AssociatedListPage is set", function () {

            describe("Given MinRows, MaxRows and IsHeightInhertied is not set", function () {
              it("should show a footer row at the bottom of the ListControl", function () {
                //Prepare
                component = _sc.app.ListControlAssociatedListPage;
                var selector = ".sc-associated-listpage";

                //act
                var footerRow = component.el.querySelector(selector);

                expect(footerRow.classList.contains("hide")).toBe(false);
              });

              it("should contain a link with href set in the footer row", function () {
                //Prepare
                component = _sc.app.ListControlAssociatedListPage;
                var selector = ".sc-associated-listpage > a";

                //act
                var footerLink = component.el.querySelector(selector);
                var href = footerLink.getAttribute("href");

                expect(href !== "").toBe(true);
              });

              it("should update the link's href when Associated ListPage is set at runtime", function () {
                //Prepare
                component = _sc.app.ListControlAssociatedListPage;
                var selector = ".sc-associated-listpage a",
                  link = component.el.querySelector(selector),
                  before = link.href,
                  newUrl = "http://google.com/",
                  after = "";

                //act
                component.AssociatedListPage = newUrl;
                after = link.href;

                //assert
                expect(after).not.toBe(before);
                expect(after).toBe(newUrl);
              });


              it("should add the class 'sc-hide-scrollbar' to the scroll container", function () {
                //Prepare
                component = _sc.app.ListControlAssociatedListPage;
                var selector = ".sc-listcontrol-body-wrapper";

                //act
                var scrollCon = component.el.querySelector(selector);

                expect(scrollCon.classList.contains("sc-hide-scrollbar")).toBe(true);
              });

              
            });

            describe("Given MaxRows is set", function () {
              it("should NOT show a footer row at the bottom of the ListControl, if there are less items than MaxRows", function () {
                //Prepare
                component = _sc.app.ListControlAssociatedListPageWithItemsLessThanMaxRows;
                var selector = ".sc-associated-listpage";

                //act
                var footerRow = component.el.querySelector(selector);

                expect(footerRow.classList.contains("hide")).toBe(true);
              });

              it("should show a footer row at the bottom of the ListControl, if there are more items than MaxRows", function () {
                //Prepare
                component = _sc.app.ListControlAssociatedListPageWithItemsBiggerThanMaxRows;
                var selector = ".sc-associated-listpage";

                //act
                var footerRow = component.el.querySelector(selector);

                expect(footerRow.classList.contains("hide")).toBe(false);
              });

            });

            describe("Given MinRows is set", function () {
              it("should NOT show any row fillers in the ListControl", function () {
                //Prepare
                component = _sc.app.ListControlAssociatedListWithMinRowsSet;
                var selector = ".sc-filler-rows tbody > tr";

                //act
                var fillerRows = component.el.querySelectorAll(selector);

                expect(fillerRows.length).toBe(0);
              });
            });

            describe("Given IsHeightInhertied is set to true", function () {
              it("should NOT show a footer row at the bottom of the ListControl", function () {
                //Prepare
                component = _sc.app.ListControlAssociatedListPageWithIsHeightInheritedTrue;
                var selector = ".sc-associated-listpage";

                //act
                var footerRow = component.el.querySelector(selector);

                expect(footerRow.classList.contains("hide")).toBe(true);
              });
            });

          });

          describe("and Sorting is set", function () {
            it("all columns should not be sorted, if set to empty", function () {
              //Prepare
              component = _sc.app.ListControlSortingNull;

              //act

              //assert
              expect(component.el.querySelectorAll(".sc-no-sorting").length).toBe(3);
            });

            describe("and IsMultipleColumnSortEnabled is set to true", function () {
              it("it should sort the defined columns in the correct direction", function () {
                //Prepare
                component = _sc.app.ListControlSortingValueIsMultipleColumnSortEnabledTrue;
                var ascendingElements = component.el.querySelectorAll(".sc-ascending");
                var descendingElements = component.el.querySelectorAll(".sc-descending");

                //act

                //assert
                expect(ascendingElements.length).toBe(1);
                expect(ascendingElements[0].innerText).toBe("ResponsiveColumn2");
                expect(descendingElements.length).toBe(1);
                expect(descendingElements[0].innerText).toBe("ResponsiveColumn");
              });
            });

            describe("and IsMultipleColumnSortEnabled is set to false", function () {
              it("it should sort only sort one column in the correct direction", function () {
                //Prepare
                component = _sc.app.ListControlSortingValueIsMultipleColumnSortEnabledFalse;
                var ascendingElements = component.el.querySelectorAll(".sc-ascending");
                var descendingElements = component.el.querySelectorAll(".sc-descending");

                //act

                //assert
                expect(ascendingElements.length).toBe(1);
                expect(ascendingElements[0].innerText).toBe("ResponsiveColumn2");
                expect(descendingElements.length).toBe(0);
              });
            });
          });

          describe("~ Given a ColumnFieldText", function () {
            describe("And DataFieldName is defined", function () {
              it("it should display 'Lorem' in the first cell in the first row", function () {
                component = _sc.app.ListControlDataFieldName;
                var index = getColumnTypeIndex(component, "text");

                expect(component.el.querySelectorAll("tbody > tr:first-child > td")[index].innerText).toBe("Lorem");
              });
            });

            describe("And IsBold is defined", function () {
              it("it should not have a strong tag when false", function () {
                component = _sc.app.ListControlIsBoldFalse;
                var index = getColumnTypeIndex(component, "text");
                var td = component.el.querySelector("tbody > tr").children[index];

                expect(td.querySelectorAll("strong").length).toBe(0);
              });

              it("it should have a strong tag when true", function () {
                component = _sc.app.ListControlIsBoldTrue;
                var index = getColumnTypeIndex(component, "text");
                var td = component.el.querySelector("tbody > tr").children[index];

                expect(td.querySelectorAll("strong").length).not.toBe(0);
              });
            });

            describe("And IsItalic is defined", function () {
              it("it should not have a em tag when false", function () {
                component = _sc.app.ListControlIsItalicFalse;
                var index = getColumnTypeIndex(component, "text");
                var td = component.el.querySelector("tbody > tr").children[index];

                expect(td.querySelectorAll("em").length).toBe(0);
              });

              it("it should have a em tag when true", function () {
                component = _sc.app.ListControlIsItalicTrue;
                var index = getColumnTypeIndex(component, "text");
                var td = component.el.querySelector("tbody > tr").children[index];

                expect(td.querySelectorAll("em").length).not.toBe(0);
              });
            });

            describe("And IsWrapped is defined", function () {
              it("it should not have a 'sc-text-wrapped' class in both cell and header when false", function () {
                component = _sc.app.ListControlIsWrappedFalse;
                var index = getColumnTypeIndex(component, "text");

                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-text-wrapped")).toBe(false);
              });

              it("it should have a 'sc-text-wrapped' class in both cell and header when true", function () {
                component = _sc.app.ListControlIsWrappedTrue;
                var index = getColumnTypeIndex(component, "text");
                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-text-wrapped")).toBe(true);
              });
            });

            describe("And ColumnTitle is defined", function () {
              it("it should display 'Column title text' in the first cell in the header", function () {
                component = _sc.app.ListControlColumnTitle;
                var index = getColumnTypeIndex(component, "text");

                expect(component.el.querySelectorAll("thead > tr:first-child > th")[index].innerText).toBe("Column title text");
              });
            });

            describe("And IsSortable is defined", function () {
              describe("and set to false", function () {
                it("it should not have a 'sc-sortable' class", function () {
                  component = _sc.app.ListControlIsSortableFalse;
                  var index = getColumnTypeIndex(component, "text");

                  expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-sortable")).toBe(false);
                });
              });

              describe("and set to true", function () {
                it("it should have a 'sc-sortable' class", function () {
                  component = _sc.app.ListControlIsSortableTrue;
                  var index = getColumnTypeIndex(component, "text");

                  expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-sortable")).toBe(true);
                });

                it("it should change sort direction of column, when header cell is clicked", function () {
                  // Prepare
                  component = _sc.app.ListControlIsSortableTrueHeaderClick;
                  var index = getColumnTypeIndex(component, "text");
                  component.on("change:Sorting", component.render);

                  component.el.querySelectorAll("thead > tr > th")[index].click();
                  expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-ascending")).toBe(true);

                  component.el.querySelectorAll("thead > tr > th")[index].click();
                  expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-descending")).toBe(true);

                  component.el.querySelectorAll("thead > tr > th")[index].click();
                  expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-no-sorting")).toBe(true);
                });

                it("it should change sort direction of column, when sort direction is clicked in popover", function () {
                  //prepare
                  component = _sc.app.ListControlIsSortableTruePopoverClick;
                  var index = getColumnTypeIndex(component, "text");
                  component.on("change:Sorting", component.render);

                  //act
                  component.el.style.width = "200px";
                  component.render();

                  //assert
                  component.el.querySelectorAll("thead > tr > th")[index].click();
                  component.el.querySelector(".sc-popover .sc-no-sorting").click();
                  expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-no-sorting")).toBe(true);

                  component.el.querySelectorAll("thead > tr > th")[index].click();
                  component.el.querySelector(".sc-popover .sc-ascending").click();
                  expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-ascending")).toBe(true);

                  component.el.querySelectorAll("thead > tr > th")[index].click();
                  component.el.querySelector(".sc-popover .sc-descending").click();
                  expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-descending")).toBe(true);
                });
              });
            });

            describe("And ColumnAlignment is defined", function () {
              it("it should have a 'text-left' class when '', in both cell and header by default", function () {
                component = _sc.app.ListControlColumnAlignmentDefault;
                var index = getColumnTypeIndex(component, "text");

                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("text-left")).toBe(true);
                expect(component.el.querySelectorAll("tbody > tr > td")[index].classList.contains("text-left")).toBe(true);
              });

              it("it should have a 'text-left' class when 'left', in both cell and header", function () {
                component = _sc.app.ListControlColumnAlignmentLeft;
                var index = getColumnTypeIndex(component, "text");

                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("text-left")).toBe(true);
                expect(component.el.querySelectorAll("tbody > tr > td")[index].classList.contains("text-left")).toBe(true);
              });

              it("it should have a 'text-right' class when 'right', in both cell and header", function () {
                component = _sc.app.ListControlColumnAlignmentRight;
                var index = getColumnTypeIndex(component, "text");

                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("text-right")).toBe(true);
                expect(component.el.querySelectorAll("tbody > tr > td")[index].classList.contains("text-right")).toBe(true);
              });

              it("it should have a 'text-center' class when 'center', in both cell and header", function () {
                component = _sc.app.ListControlColumnAlignmentCenter;
                var index = getColumnTypeIndex(component, "text");

                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("text-center")).toBe(true);
                expect(component.el.querySelectorAll("tbody > tr > td")[index].classList.contains("text-center")).toBe(true);
              });
            });

            describe("And ColumnMinWidth is defined", function () {

              it("it should have a 'min-width: 100px' when '', in both cell and header by default", function () {
                component = _sc.app.ListControlColumnMinWidthDefault;
                var index = getColumnTypeIndex(component, "text");

                expect(window.getComputedStyle(component.el.querySelectorAll("thead > tr > th")[index]).getPropertyValue("min-width")).toBe("100px");
                expect(window.getComputedStyle(component.el.querySelectorAll("tbody > tr > td")[index]).getPropertyValue("min-width")).toBe("100px");
              });

              it("it should have a 'min-width: 200px' when '200', in both cell and header", function () {
                component = _sc.app.ListControlColumnMinWidthValue;
                var index = getColumnTypeIndex(component, "text");

                expect(window.getComputedStyle(component.el.querySelectorAll("thead > tr > th")[index]).getPropertyValue("min-width")).toBe("200px");
                expect(window.getComputedStyle(component.el.querySelectorAll("tbody > tr > td")[index]).getPropertyValue("min-width")).toBe("200px");
              });
            });

            describe("And ColumnWidth is defined", function () {

              it("it should not have a 'col-md-*' class when '', in both cell and header by default", function () {
                component = _sc.app.ListControlColumnWidthDefault;
                var index = getColumnTypeIndex(component, "text");

                expect(component.el.querySelectorAll("thead > tr > th")[index].className.indexOf("col-md-")).toBe(-1);
                expect(component.el.querySelectorAll("tbody > tr > td")[index].className.indexOf("col-md-")).toBe(-1);
              });

              it("it should have a 'col-md-5' class when '5', in both cell and header", function () {
                component = _sc.app.ListControlColumnWidthValue;
                var index = getColumnTypeIndex(component, "text");

                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("col-md-5")).toBe(true);
                expect(component.el.querySelectorAll("tbody > tr > td")[index].classList.contains("col-md-5")).toBe(true);
              });
            });

          });

          describe("~ Given a ColumnFieldImage", function () {

            describe("And ImageFieldName is defined", function () {

              it("it should display '/sitecore/shell/~/media/E87D6197F0B3448093056B0F126E7D13.ashx?h=&w=&db=core' in the image source in the first cell in the first row, if SiteCore Image", function () {
                component = _sc.app.ListControlImageFieldNameWithSitecoreImage;

                var index = getColumnTypeIndex(component, "image");

                expect(component.el.querySelectorAll("tbody > tr:first-child > td:first-child > img")[index].getAttribute("src")).toBe("/sitecore/shell/~/media/E87D6197F0B3448093056B0F126E7D13.ashx?h=&w=&db=core");
              });

              it("it should display '/sitecore/shell/client/Speak/Assets/img/Speak/Common/32x32/dark_gray/document_empty.png' in the image source in the first cell in the first row", function () {
                component = _sc.app.ListControlImageFieldName;

                var index = getColumnTypeIndex(component, "image");

                expect(component.el.querySelectorAll("tbody > tr:first-child > td:first-child > img")[index].getAttribute("src")).toBe("/sitecore/shell/client/Speak/Assets/img/Speak/Common/32x32/dark_gray/document_empty.png");
              });

            });

            describe("And AltFieldName is defined", function () {
              it("it should display 'Peace, man!' in the image alternative text in the first cell in the first row, if SiteCore Image and AltFieldName is not set", function () {
                component = _sc.app.ListControlImageFieldNameWithSitecoreImage;

                var index = getColumnTypeIndex(component, "image");

                expect(component.el.querySelectorAll("tbody > tr:first-child > td:first-child > img")[index].getAttribute("alt")).toBe("Peace, man!");
              });

              it("it should display 'Lorem' in the image alternative text in the first cell in the first row", function () {
                component = _sc.app.ListControlAltFieldName;
                var index = getColumnTypeIndex(component, "image");

                expect(component.el.querySelectorAll("tbody > tr:first-child > td:first-child > img")[index].getAttribute("alt")).toBe("Lorem");
              });
            });

            describe("And ImageSize is defined", function () {
              it("it should have a height of 48 pixels and a width of 48 pixels, on the image by default", function () {
                component = _sc.app.ListControlImageSizeDefault;
                var index = getColumnTypeIndex(component, "image");

                expect(component.el.querySelectorAll("tbody > tr:first-child > td:first-child > img")[index].getAttribute("height")).toBe("48");
                expect(component.el.querySelectorAll("tbody > tr:first-child > td:first-child > img")[index].getAttribute("width")).toBe("48");
              });

              it("it should have a height of 128 pixels and a width of 128 pixels", function () {
                component = _sc.app.ListControlImageSizeValue;
                var index = getColumnTypeIndex(component, "image");

                expect(component.el.querySelectorAll("tbody > tr:first-child > td:first-child > img")[index].getAttribute("height")).toBe("128");
                expect(component.el.querySelectorAll("tbody > tr:first-child > td:first-child > img")[index].getAttribute("width")).toBe("128");
              });
            });

            describe("And ColumnTitle is defined", function () {
              it("it should display 'Column title image' in the first cell in the header", function () {
                component = _sc.app.ListControlColumnTitle;
                var index = getColumnTypeIndex(component, "image");

                expect(component.el.querySelectorAll("thead > tr:first-child > th")[index].innerText).toBe("Column title image");
              });
            });

            describe("And IsSortable is defined", function () {
              describe("and set to false", function () {
                it("it should not have a 'sc-sortable' class", function () {
                  component = _sc.app.ListControlIsSortableFalse;
                  var index = getColumnTypeIndex(component, "image");

                  expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-sortable")).toBe(false);
                });
              });

              describe("and set to true", function () {
                it("it should have a 'sc-sortable' class", function () {
                  component = _sc.app.ListControlIsSortableTrue;
                  var index = getColumnTypeIndex(component, "image");

                  expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-sortable")).toBe(true);
                });

                it("it should change sort direction of column, when header cell is clicked", function () {
                  // Prepare
                  component = _sc.app.ListControlIsSortableTrueHeaderClick;
                  var index = getColumnTypeIndex(component, "image");
                  component.on("change:Sorting", component.render);

                  component.el.querySelectorAll("thead > tr > th")[index].click();
                  expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-ascending")).toBe(true);

                  component.el.querySelectorAll("thead > tr > th")[index].click();
                  expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-descending")).toBe(true);

                  component.el.querySelectorAll("thead > tr > th")[index].click();
                  expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-no-sorting")).toBe(true);
                });

                it("it should change sort direction of column, when sort direction is clicked in popover", function () {
                  //prepare
                  component = _sc.app.ListControlIsSortableTruePopoverClick;
                  var index = getColumnTypeIndex(component, "image");
                  component.on("change:Sorting", component.render);

                  //act
                  component.el.style.width = "200px";
                  component.render();

                  //assert
                  component.el.querySelectorAll("thead > tr > th")[index].click();
                  component.el.querySelector(".sc-popover .sc-no-sorting").click();
                  expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-no-sorting")).toBe(true);

                  component.el.querySelectorAll("thead > tr > th")[index].click();
                  component.el.querySelector(".sc-popover .sc-ascending").click();
                  expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-ascending")).toBe(true);

                  component.el.querySelectorAll("thead > tr > th")[index].click();
                  component.el.querySelector(".sc-popover .sc-descending").click();
                  expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-descending")).toBe(true);
                });
              });
            });

            describe("And ColumnAlignment is defined", function () {
              it("it should have a 'text-left' class when '', in both cell and header by default", function () {
                component = _sc.app.ListControlColumnAlignmentDefault;
                var index = getColumnTypeIndex(component, "image");

                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("text-left")).toBe(true);
                expect(component.el.querySelectorAll("tbody > tr > td")[index].classList.contains("text-left")).toBe(true);
              });

              it("it should have a 'text-left' class when 'left', in both cell and header", function () {
                component = _sc.app.ListControlColumnAlignmentLeft;
                var index = getColumnTypeIndex(component, "image");

                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("text-left")).toBe(true);
                expect(component.el.querySelectorAll("tbody > tr > td")[index].classList.contains("text-left")).toBe(true);
              });

              it("it should have a 'text-right' class when 'right', in both cell and header", function () {
                component = _sc.app.ListControlColumnAlignmentRight;
                var index = getColumnTypeIndex(component, "image");

                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("text-right")).toBe(true);
                expect(component.el.querySelectorAll("tbody > tr > td")[index].classList.contains("text-right")).toBe(true);
              });

              it("it should have a 'text-center' class when 'center', in both cell and header", function () {
                component = _sc.app.ListControlColumnAlignmentCenter;
                var index = getColumnTypeIndex(component, "image");

                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("text-center")).toBe(true);
                expect(component.el.querySelectorAll("tbody > tr > td")[index].classList.contains("text-center")).toBe(true);
              });
            });

            describe("And ColumnMinWidth is defined", function () {
              it("it should have a 'min-width: 100px' when '', in both cell and header by default", function () {
                component = _sc.app.ListControlColumnMinWidthDefault;
                var index = getColumnTypeIndex(component, "image");

                expect(window.getComputedStyle(component.el.querySelectorAll("thead > tr > th")[index]).getPropertyValue("min-width")).toBe("100px");
                expect(window.getComputedStyle(component.el.querySelectorAll("tbody > tr > td")[index]).getPropertyValue("min-width")).toBe("100px");
              });

              it("it should have a 'min-width: 200px' when '200', in both cell and header", function () {
                component = _sc.app.ListControlColumnMinWidthValue;
                var index = getColumnTypeIndex(component, "image");

                expect(window.getComputedStyle(component.el.querySelectorAll("thead > tr > th")[index]).getPropertyValue("min-width")).toBe("200px");
                expect(window.getComputedStyle(component.el.querySelectorAll("tbody > tr > td")[index]).getPropertyValue("min-width")).toBe("200px");
              });
            });

            describe("And ColumnWidth is defined", function () {
              it("it should not have a 'col-md-*' class when '', in both cell and header by default", function () {
                component = _sc.app.ListControlColumnWidthDefault;
                var index = getColumnTypeIndex(component, "image");

                expect(component.el.querySelectorAll("thead > tr > th")[index].className.indexOf("col-md-")).toBe(-1);
                expect(component.el.querySelectorAll("tbody > tr > td")[index].className.indexOf("col-md-")).toBe(-1);
              });

              it("it should have a 'col-md-5' class when '5', in both cell and header", function () {
                component = _sc.app.ListControlColumnWidthValue;
                var index = getColumnTypeIndex(component, "image");

                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("col-md-5")).toBe(true);
                expect(component.el.querySelectorAll("tbody > tr > td")[index].classList.contains("col-md-5")).toBe(true);
              });
            });

          });

          describe("~ Given a ColumnFieldTemplate", function () {
            describe("And HtmlTemplate is defined as '<b>{{Text}}</b>'", function () {
              it("it should display '<b>Lorem</b>' in the first cell in the first row", function () {
                component = _sc.app.ListControlHtmlTemplate;
                var index = getColumnTypeIndex(component, "htmltemplate");

                expect(component.el.querySelectorAll("tbody > tr:first-child > td")[index].innerHTML.trim()).toBe("<b>Lorem</b>");
              });
            });

            describe("And another ColumnFieldTemplate is defined", function () {
              it("it should show both columns with each their own template", function () {
                component = _sc.app.ListControlHtmlTemplateMultiple;

                expect(component.el.querySelectorAll("tbody > tr:first-child > td")[0].innerHTML.trim()).toBe("<b>Lorem</b>");
                expect(component.el.querySelectorAll("tbody > tr:first-child > td")[1].innerHTML.trim()).toBe("<i>Lorem</i>");
              });
            });

            describe("And ColumnTitle is defined", function () {
              it("it should display 'Column title image' in the first cell in the header", function () {
                component = _sc.app.ListControlColumnTitle;
                var index = getColumnTypeIndex(component, "htmltemplate");

                expect(component.el.querySelectorAll("thead > tr:first-child > th")[index].innerText).toBe("Column title image");
              });
            });

            describe("And IsSortable is defined", function () {
              describe("and set to false", function () {
                it("it should not have a 'sc-sortable' class", function () {
                  component = _sc.app.ListControlIsSortableFalse;
                  var index = getColumnTypeIndex(component, "htmltemplate");

                  expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-sortable")).toBe(false);
                });
              });

              describe("and set to true", function () {
                it("it should have a 'sc-sortable' class", function () {
                  component = _sc.app.ListControlIsSortableTrue;
                  var index = getColumnTypeIndex(component, "htmltemplate");

                  expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-sortable")).toBe(true);
                });

                it("it should change sort direction of column, when header cell is clicked", function () {
                  // Prepare
                  component = _sc.app.ListControlIsSortableTrueHeaderClick;
                  var index = getColumnTypeIndex(component, "htmltemplate");
                  component.on("change:Sorting", component.render);

                  component.el.querySelectorAll("thead > tr > th")[index].click();
                  expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-ascending")).toBe(true);

                  component.el.querySelectorAll("thead > tr > th")[index].click();
                  expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-descending")).toBe(true);

                  component.el.querySelectorAll("thead > tr > th")[index].click();
                  expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-no-sorting")).toBe(true);
                });

                it("it should change sort direction of column, when sort direction is clicked in popover", function () {
                  //prepare
                  component = _sc.app.ListControlIsSortableTruePopoverClick;
                  var index = getColumnTypeIndex(component, "htmltemplate");
                  component.on("change:Sorting", component.render);

                  //act
                  component.el.style.width = "200px";
                  component.render();

                  //assert
                  component.el.querySelectorAll("thead > tr > th")[index].click();
                  component.el.querySelector(".sc-popover .sc-no-sorting").click();
                  expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-no-sorting")).toBe(true);

                  component.el.querySelectorAll("thead > tr > th")[index].click();
                  component.el.querySelector(".sc-popover .sc-ascending").click();
                  expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-ascending")).toBe(true);

                  component.el.querySelectorAll("thead > tr > th")[index].click();
                  component.el.querySelector(".sc-popover .sc-descending").click();
                  expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-descending")).toBe(true);
                });
              });
            });

            describe("And ColumnAlignment is defined", function () {
              it("it should have a 'text-left' class when '', in both cell and header by default", function () {
                component = _sc.app.ListControlColumnAlignmentDefault;
                var index = getColumnTypeIndex(component, "htmltemplate");

                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("text-left")).toBe(true);
                expect(component.el.querySelectorAll("tbody > tr > td")[2].classList.contains("text-left")).toBe(true);
              });

              it("it should have a 'text-left' class when 'left', in both cell and header", function () {
                component = _sc.app.ListControlColumnAlignmentLeft;
                var index = getColumnTypeIndex(component, "htmltemplate");

                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("text-left")).toBe(true);
                expect(component.el.querySelectorAll("tbody > tr > td")[index].classList.contains("text-left")).toBe(true);
              });

              it("it should have a 'text-right' class when 'right', in both cell and header", function () {
                component = _sc.app.ListControlColumnAlignmentRight;
                var index = getColumnTypeIndex(component, "htmltemplate");

                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("text-right")).toBe(true);
                expect(component.el.querySelectorAll("tbody > tr > td")[index].classList.contains("text-right")).toBe(true);
              });

              it("it should have a 'text-center' class when 'center', in both cell and header", function () {
                component = _sc.app.ListControlColumnAlignmentCenter;
                var index = getColumnTypeIndex(component, "htmltemplate");

                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("text-center")).toBe(true);
                expect(component.el.querySelectorAll("tbody > tr > td")[index].classList.contains("text-center")).toBe(true);
              });
            });

            describe("And ColumnMinWidth is defined", function () {
              it("it should have a 'min-width: 100px' when '', in both cell and header by default", function () {
                component = _sc.app.ListControlColumnMinWidthDefault;
                var index = getColumnTypeIndex(component, "htmltemplate");

                expect(window.getComputedStyle(component.el.querySelectorAll("thead > tr > th")[index]).getPropertyValue("min-width")).toBe("100px");
                expect(window.getComputedStyle(component.el.querySelectorAll("tbody > tr > td")[index]).getPropertyValue("min-width")).toBe("100px");
              });

              it("it should have a 'min-width: 200px' when '200', in both cell and header", function () {
                component = _sc.app.ListControlColumnMinWidthValue;
                var index = getColumnTypeIndex(component, "htmltemplate");

                expect(window.getComputedStyle(component.el.querySelectorAll("thead > tr > th")[index]).getPropertyValue("min-width")).toBe("200px");
                expect(window.getComputedStyle(component.el.querySelectorAll("tbody > tr > td")[index]).getPropertyValue("min-width")).toBe("200px");
              });
            });

            describe("And ColumnWidth is defined", function () {
              it("it should not have a 'col-md-*' class when '', in both cell and header by default", function () {
                component = _sc.app.ListControlColumnWidthDefault;
                var index = getColumnTypeIndex(component, "htmltemplate");

                expect(component.el.querySelectorAll("thead > tr > th")[index].className.indexOf("col-md-")).toBe(-1);
                expect(component.el.querySelectorAll("tbody > tr > td")[index].className.indexOf("col-md-")).toBe(-1);
              });

              it("it should have a 'col-md-5' class when '5', in both cell and header", function () {
                component = _sc.app.ListControlColumnWidthValue;
                var index = getColumnTypeIndex(component, "htmltemplate");

                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("col-md-5")).toBe(true);
                expect(component.el.querySelectorAll("tbody > tr > td")[index].classList.contains("col-md-5")).toBe(true);
              });
            });

          });

          describe("~ Given a ColumnFieldLink", function () {
            describe("And LinkTextFieldName is defined", function () {
              it("it should display 'Lorem' in the link text in the first cell in the first row", function () {
                component = _sc.app.ListControlLinkTextFieldName;

                expect(component.el.querySelectorAll("tbody > tr:first-child > td:first-child > a")[0].innerHTML.trim()).toBe("Lorem");
              });
            });

            describe("And LinkUrlFieldName is defined", function () {
              it("it should display '{97460826-99A4-4090-91F1-C2B07312553D}' in the link href in the first cell in the first row", function () {
                component = _sc.app.ListControlLinkUrlFieldName;

                expect(component.el.querySelectorAll("tbody > tr:first-child > td:first-child > a")[0].getAttribute("href")).toBe("{97460826-99A4-4090-91F1-C2B07312553D}");
              });
            });

            describe("And LinkTarget is defined", function () {
              it("it should display '_blank' in the link target in the first cell in the first row", function () {
                component = _sc.app.ListControlLinkTarget;

                expect(component.el.querySelectorAll("tbody > tr:first-child > td:first-child > a")[0].getAttribute("target")).toBe("_blank");
              });
            });

            describe("And ColumnTitle is defined", function () {
              it("it should display 'Column title image' in the first cell in the header", function () {
                component = _sc.app.ListControlColumnTitle;
                var index = getColumnTypeIndex(component, "link");

                expect(component.el.querySelectorAll("thead > tr:first-child > th")[index].innerText).toBe("Column title image");
              });
            });

            describe("And IsSortable is defined", function () {
              describe("and set to false", function () {
                it("it should not have a 'sc-sortable' class", function () {
                  component = _sc.app.ListControlIsSortableFalse;
                  var index = getColumnTypeIndex(component, "link");

                  expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-sortable")).toBe(false);
                });
              });

              describe("and set to true", function () {
                it("it should have a 'sc-sortable' class", function () {
                  component = _sc.app.ListControlIsSortableTrue;
                  var index = getColumnTypeIndex(component, "link");

                  expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-sortable")).toBe(true);
                });

                it("it should change sort direction of column, when header cell is clicked", function () {
                  // Prepare
                  component = _sc.app.ListControlIsSortableTrueHeaderClick;
                  var index = getColumnTypeIndex(component, "link");
                  component.on("change:Sorting", component.render);

                  component.el.querySelectorAll("thead > tr > th")[index].click();
                  expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-ascending")).toBe(true);

                  component.el.querySelectorAll("thead > tr > th")[index].click();
                  expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-descending")).toBe(true);

                  component.el.querySelectorAll("thead > tr > th")[index].click();
                  expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-no-sorting")).toBe(true);
                });

                it("it should change sort direction of column, when sort direction is clicked in popover", function () {
                  //prepare
                  component = _sc.app.ListControlIsSortableTruePopoverClick;
                  var index = getColumnTypeIndex(component, "link");
                  component.on("change:Sorting", component.render);

                  //act
                  component.el.style.width = "200px";
                  component.render();

                  //assert
                  component.el.querySelectorAll("thead > tr > th")[index].click();
                  component.el.querySelector(".sc-popover .sc-no-sorting").click();
                  expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-no-sorting")).toBe(true);

                  component.el.querySelectorAll("thead > tr > th")[index].click();
                  component.el.querySelector(".sc-popover .sc-ascending").click();
                  expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-ascending")).toBe(true);

                  component.el.querySelectorAll("thead > tr > th")[index].click();
                  component.el.querySelector(".sc-popover .sc-descending").click();
                  expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-descending")).toBe(true);
                });
              });
            });

            describe("And ColumnAlignment is defined", function () {
              it("it should have a 'text-left' class when '', in both cell and header by default", function () {
                component = _sc.app.ListControlColumnAlignmentDefault;
                var index = getColumnTypeIndex(component, "link");

                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("text-left")).toBe(true);
                expect(component.el.querySelectorAll("tbody > tr > td")[index].classList.contains("text-left")).toBe(true);
              });

              it("it should have a 'text-left' class when 'left', in both cell and header", function () {
                component = _sc.app.ListControlColumnAlignmentLeft;
                var index = getColumnTypeIndex(component, "link");

                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("text-left")).toBe(true);
                expect(component.el.querySelectorAll("tbody > tr > td")[index].classList.contains("text-left")).toBe(true);
              });

              it("it should have a 'text-right' class when 'right', in both cell and header", function () {
                component = _sc.app.ListControlColumnAlignmentRight;
                var index = getColumnTypeIndex(component, "link");

                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("text-right")).toBe(true);
                expect(component.el.querySelectorAll("tbody > tr > td")[index].classList.contains("text-right")).toBe(true);
              });

              it("it should have a 'text-center' class when 'center', in both cell and header", function () {
                component = _sc.app.ListControlColumnAlignmentCenter;
                var index = getColumnTypeIndex(component, "link");

                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("text-center")).toBe(true);
                expect(component.el.querySelectorAll("tbody > tr > td")[index].classList.contains("text-center")).toBe(true);
              });
            });

            describe("And ColumnMinWidth is defined", function () {
              it("it should have a 'min-width: 100px' when '', in both cell and header by default", function () {
                component = _sc.app.ListControlColumnMinWidthDefault;
                var index = getColumnTypeIndex(component, "link");

                expect(window.getComputedStyle(component.el.querySelectorAll("thead > tr > th")[index]).getPropertyValue("min-width")).toBe("100px");
                expect(window.getComputedStyle(component.el.querySelectorAll("tbody > tr > td")[index]).getPropertyValue("min-width")).toBe("100px");
              });

              it("it should have a 'min-width: 200px' when '200', in both cell and header", function () {
                component = _sc.app.ListControlColumnMinWidthValue;
                var index = getColumnTypeIndex(component, "link");

                expect(window.getComputedStyle(component.el.querySelectorAll("thead > tr > th")[index]).getPropertyValue("min-width")).toBe("200px");
                expect(window.getComputedStyle(component.el.querySelectorAll("tbody > tr > td")[index]).getPropertyValue("min-width")).toBe("200px");
              });
            });

            describe("And ColumnWidth is defined", function () {
              it("it should not have a 'col-md-*' class when '', in both cell and header by default", function () {
                component = _sc.app.ListControlColumnWidthDefault;
                var index = getColumnTypeIndex(component, "link");

                expect(component.el.querySelectorAll("thead > tr > th")[index].className.indexOf("col-md-")).toBe(-1);
                expect(component.el.querySelectorAll("tbody > tr > td")[index].className.indexOf("col-md-")).toBe(-1);
              });

              it("it should have a 'col-md-5' class when '5', in both cell and header", function () {
                component = _sc.app.ListControlColumnWidthValue;
                var index = getColumnTypeIndex(component, "link");

                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("col-md-5")).toBe(true);
                expect(component.el.querySelectorAll("tbody > tr > td")[index].classList.contains("col-md-5")).toBe(true);
              });
            });

          });

          describe("~ Given a ColumnFieldProgressBar", function () {
            describe("And ProgressFieldName is defined", function () {

              it("it should display 'NaN%' in the first cell in the 4th row, if value is non-numeric", function () {
                component = _sc.app.ListControlProgressFieldName;

                expect(component.el.querySelectorAll("tbody > tr:nth-child(4) > td:first-child .progress")[0].getAttribute("title")).toBe("NaN%");
              });


              describe("And IsPreCalculated  is defined", function () {
                it("it should display '12.35%' in the first cell in the 5th row, if set to true", function () {
                  component = _sc.app.ListControlIsPreCalculatedTrue;

                  expect(component.el.querySelectorAll("tbody > tr:nth-child(5) > td:first-child .progress")[0].getAttribute("title")).toBe("12.35%");
                });
              });

              describe("And IsDividedByFixedValue is defined", function () {
                describe("And DivideByValue is defined", function () {
                  it("it should display '42.46%' in the first cell in the first row, if set to 100, and IsDividedByFixedValue is set to true", function () {
                    component = _sc.app.ListControlDivideByValue;

                    expect(component.el.querySelectorAll("tbody > tr:nth-child(1) > td:first-child .progress")[0].getAttribute("title")).toBe("42.46%");
                  });
                });


                describe("And DivideByFieldName is defined", function () {
                  it("it should display '21.23%' in the first cell in the first row, if IsDividedByFixedValue is set to false", function () {
                    component = _sc.app.ListControlDivideByFieldName;

                    expect(component.el.querySelectorAll("tbody > tr:nth-child(1) > td:first-child .progress")[0].getAttribute("title")).toBe("21.23%");
                  });
                });
              });


            });

            describe("And ColumnTitle is defined", function () {
              it("it should display 'Column title progress bar' in the first cell in the header", function () {
                component = _sc.app.ListControlColumnTitle;
                var index = getColumnTypeIndex(component, "progressbar");

                expect(component.el.querySelectorAll("thead > tr:first-child > th")[index].innerText).toBe("Column title progress bar");
              });
            });

            describe("And IsSortable is defined", function () {
              describe("and set to false", function () {
                it("it should not have a 'sc-sortable' class", function () {
                  component = _sc.app.ListControlIsSortableFalse;
                  var index = getColumnTypeIndex(component, "progressbar");

                  expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-sortable")).toBe(false);
                });
              });

              describe("and set to true", function () {
                it("it should have a 'sc-sortable' class", function () {
                  component = _sc.app.ListControlIsSortableTrue;
                  var index = getColumnTypeIndex(component, "progressbar");

                  expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-sortable")).toBe(true);
                });

                it("it should change sort direction of column, when header cell is clicked", function () {
                  // Prepare
                  component = _sc.app.ListControlIsSortableTrueHeaderClick;
                  var index = getColumnTypeIndex(component, "progressbar");
                  component.on("change:Sorting", component.render);

                  component.el.querySelectorAll("thead > tr > th")[index].click();
                  expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-ascending")).toBe(true);

                  component.el.querySelectorAll("thead > tr > th")[index].click();
                  expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-descending")).toBe(true);

                  component.el.querySelectorAll("thead > tr > th")[index].click();
                  expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-no-sorting")).toBe(true);
                });

                it("it should change sort direction of column, when sort direction is clicked in popover", function () {
                  //prepare
                  component = _sc.app.ListControlIsSortableTruePopoverClick;
                  var index = getColumnTypeIndex(component, "progressbar");
                  component.on("change:Sorting", component.render);

                  //act
                  component.el.style.width = "200px";
                  component.render();

                  //assert
                  component.el.querySelectorAll("thead > tr > th")[index].click();
                  component.el.querySelector(".sc-popover .sc-no-sorting").click();
                  expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-no-sorting")).toBe(true);

                  component.el.querySelectorAll("thead > tr > th")[index].click();
                  component.el.querySelector(".sc-popover .sc-ascending").click();
                  expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-ascending")).toBe(true);

                  component.el.querySelectorAll("thead > tr > th")[index].click();
                  component.el.querySelector(".sc-popover .sc-descending").click();
                  expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-descending")).toBe(true);
                });
              });
            });

            describe("And ColumnMinWidth is defined", function () {
              it("it should have a 'min-width: 100px' when '', in both cell and header by default", function () {
                component = _sc.app.ListControlColumnMinWidthDefault;
                var index = getColumnTypeIndex(component, "progressbar");

                expect(window.getComputedStyle(component.el.querySelectorAll("thead > tr > th")[index]).getPropertyValue("min-width")).toBe("100px");
                expect(window.getComputedStyle(component.el.querySelectorAll("tbody > tr > td")[index]).getPropertyValue("min-width")).toBe("100px");
              });

              it("it should have a 'min-width: 200px' when '200', in both cell and header", function () {
                component = _sc.app.ListControlColumnMinWidthValue;
                var index = getColumnTypeIndex(component, "progressbar");

                expect(window.getComputedStyle(component.el.querySelectorAll("thead > tr > th")[index]).getPropertyValue("min-width")).toBe("200px");
                expect(window.getComputedStyle(component.el.querySelectorAll("tbody > tr > td")[index]).getPropertyValue("min-width")).toBe("200px");
              });
            });

            describe("And ColumnWidth is defined", function () {
              it("it should not have a 'col-md-*' class when '', in both cell and header by default", function () {
                component = _sc.app.ListControlColumnWidthDefault;
                var index = getColumnTypeIndex(component, "progressbar");

                expect(component.el.querySelectorAll("thead > tr > th")[index].className.indexOf("col-md-")).toBe(-1);
                expect(component.el.querySelectorAll("tbody > tr > td")[index].className.indexOf("col-md-")).toBe(-1);
              });

              it("it should have a 'col-md-5' class when '5', in both cell and header", function () {
                component = _sc.app.ListControlColumnWidthValue;
                var index = getColumnTypeIndex(component, "progressbar");

                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("col-md-5")).toBe(true);
                expect(component.el.querySelectorAll("tbody > tr > td")[index].classList.contains("col-md-5")).toBe(true);
              });
            });

          });
        });
        describe("~ Given a ColumnFieldDate", function () {
          describe("And DataFieldName is defined", function () {
            it("it should display 'July 13, 1995' in the first cell in the first row", function () {
              component = _sc.app.ListControlDataFieldName;
              var index = 1;

              expect(component.el.querySelectorAll("tbody > tr:first-child > td")[index].innerText).toBe("July 13, 1995");
            });
          });

          describe("And IsBold is defined", function () {
            it("it should not have a strong tag when false", function () {
              component = _sc.app.ListControlIsBoldFalse;
              var index = 1;
              var td = component.el.querySelector("tbody > tr").children[index];

              expect(td.querySelectorAll("strong").length).toBe(0);
            });

            it("it should have a strong tag when true", function () {
              component = _sc.app.ListControlIsBoldTrue;
              var index = 1;
              var td = component.el.querySelector("tbody > tr").children[index];

              expect(td.querySelectorAll("strong").length).not.toBe(0);
            });
          });

          describe("And IsItalic is defined", function () {
            it("it should not have a em tag when false", function () {
              component = _sc.app.ListControlIsItalicFalse;
              var index = 1;
              var td = component.el.querySelector("tbody > tr").children[index];

              expect(td.querySelectorAll("em").length).toBe(0);
            });

            it("it should have a em tag when true", function () {
              component = _sc.app.ListControlIsItalicTrue;

              var index = 1;
              var td = component.el.querySelector("tbody > tr").children[index];

              expect(td.querySelectorAll("em").length).not.toBe(0);
            });
          });

          describe("And ColumnTitle is defined", function () {
            it("it should display 'Column title text' in the first cell in the header", function () {
              component = _sc.app.ListControlColumnTitle;
              var index = 5;

              expect(component.el.querySelectorAll("thead > tr:first-child > th")[index].innerText).toBe("Column title text");
            });
          });

          describe("And IsSortable is defined", function () {
            describe("and set to false", function () {
              it("it should not have a 'sc-sortable' class", function () {
                component = _sc.app.ListControlIsSortableFalse;
                var index = 5;

                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-sortable")).toBe(false);
              });
            });

            describe("and set to true", function () {
              it("it should have a 'sc-sortable' class", function () {
                component = _sc.app.ListControlIsSortableTrue;
                var index = 5;

                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-sortable")).toBe(true);
              });

              it("it should change sort direction of column, when header cell is clicked", function () {
                // Prepare
                component = _sc.app.ListControlIsSortableTrueHeaderClick;
                var index = 5;
                component.on("change:Sorting", component.render);

                component.el.querySelectorAll("thead > tr > th")[index].click();
                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-ascending")).toBe(true);

                component.el.querySelectorAll("thead > tr > th")[index].click();
                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-descending")).toBe(true);

                component.el.querySelectorAll("thead > tr > th")[index].click();
                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-no-sorting")).toBe(true);
              });

              it("it should change sort direction of column, when sort direction is clicked in popover", function () {
                //prepare
                component = _sc.app.ListControlIsSortableTruePopoverClick;
                var index = 5;
                component.on("change:Sorting", component.render);

                //act
                component.el.style.width = "200px";
                component.render();

                //assert
                component.el.querySelectorAll("thead > tr > th")[index].click();
                component.el.querySelector(".sc-popover .sc-no-sorting").click();
                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-no-sorting")).toBe(true);

                component.el.querySelectorAll("thead > tr > th")[index].click();
                component.el.querySelector(".sc-popover .sc-ascending").click();
                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-ascending")).toBe(true);

                component.el.querySelectorAll("thead > tr > th")[index].click();
                component.el.querySelector(".sc-popover .sc-descending").click();
                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-descending")).toBe(true);
              });
            });
          });

          describe("And ColumnAlignment is defined", function () {
            it("it should have a 'text-left' class when '', in both cell and header by default", function () {
              component = _sc.app.ListControlColumnAlignmentDefault;
              var index = 4;

              expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("text-left")).toBe(true);
              expect(component.el.querySelectorAll("tbody > tr > td")[index].classList.contains("text-left")).toBe(true);
            });

            it("it should have a 'text-left' class when 'left', in both cell and header", function () {
              component = _sc.app.ListControlColumnAlignmentLeft;
              var index = 4;

              expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("text-left")).toBe(true);
              expect(component.el.querySelectorAll("tbody > tr > td")[index].classList.contains("text-left")).toBe(true);
            });

            it("it should have a 'text-right' class when 'right', in both cell and header", function () {
              component = _sc.app.ListControlColumnAlignmentRight;
              var index = 4;

              expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("text-right")).toBe(true);
              expect(component.el.querySelectorAll("tbody > tr > td")[index].classList.contains("text-right")).toBe(true);
            });

            it("it should have a 'text-center' class when 'center', in both cell and header", function () {
              component = _sc.app.ListControlColumnAlignmentCenter;
              var index = 4;

              expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("text-center")).toBe(true);
              expect(component.el.querySelectorAll("tbody > tr > td")[index].classList.contains("text-center")).toBe(true);
            });
          });

          describe("And ColumnMinWidth is defined", function () {

            it("it should have a 'min-width: 100px' when '', in both cell and header by default", function () {
              component = _sc.app.ListControlColumnMinWidthDefault;
              var index = 5;

              expect(window.getComputedStyle(component.el.querySelectorAll("thead > tr > th")[index]).getPropertyValue("min-width")).toBe("100px");
              expect(window.getComputedStyle(component.el.querySelectorAll("tbody > tr > td")[index]).getPropertyValue("min-width")).toBe("100px");
            });

            it("it should have a 'min-width: 200px' when '200', in both cell and header", function () {
              component = _sc.app.ListControlColumnMinWidthValue;
              var index = 5;

              expect(window.getComputedStyle(component.el.querySelectorAll("thead > tr > th")[index]).getPropertyValue("min-width")).toBe("200px");
              expect(window.getComputedStyle(component.el.querySelectorAll("tbody > tr > td")[index]).getPropertyValue("min-width")).toBe("200px");
            });
          });

          describe("And ColumnWidth is defined", function () {

            it("it should not have a 'col-md-*' class when '', in both cell and header by default", function () {
              component = _sc.app.ListControlColumnWidthDefault;
              var index = 5;

              expect(component.el.querySelectorAll("thead > tr > th")[index].className.indexOf("col-md-")).toBe(-1);
              expect(component.el.querySelectorAll("tbody > tr > td")[index].className.indexOf("col-md-")).toBe(-1);
            });

            it("it should have a 'col-md-5' class when '5', in both cell and header", function () {
              component = _sc.app.ListControlColumnWidthValue;
              var index = 5;

              expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("col-md-5")).toBe(true);
              expect(component.el.querySelectorAll("tbody > tr > td")[index].classList.contains("col-md-5")).toBe(true);
            });
          });

          describe("And DisplayFormatPreset is defined", function () {
            it("it should use 'Long date' format by default", function () {
              component = _sc.app.ListControlDisplayFormatPresetNull;

              var index = 0;

              expect(component.el.querySelectorAll("tbody > tr > td")[index].innerText).toBe("July 13, 1995");
            });

            it("it should use 'll' date format, when it is set to 'Short date with year'", function () {
              component = _sc.app.ListControlDisplayFormatPresetShortDateWithYear;

              var index = 0;

              expect(component.el.querySelectorAll("tbody > tr > td")[index].innerText).toBe("Jul 13, 1995");
            });

            it("it should use 'MMM D' date format, when it is set to 'Short date'", function () {
              component = _sc.app.ListControlDisplayFormatPresetShortDate;

              var index = 0;

              expect(component.el.querySelectorAll("tbody > tr > td")[index].innerText).toBe("Jul 13");
            });

            it("it should use 'L' date format, when it is set to 'Numeral date'", function () {
              component = _sc.app.ListControlDisplayFormatPresetNumeralDate;

              var index = 0;

              expect(component.el.querySelectorAll("tbody > tr > td")[index].innerText).toBe("07/13/1995");
            });

            it("it should use 'M' date format, when it is set to 'Month'", function () {
              component = _sc.app.ListControlDisplayFormatPresetMonth;

              var index = 0;

              expect(component.el.querySelectorAll("tbody > tr > td")[index].innerText).toBe("7");
            });

            it("it should use 'D' date format, when it is set to 'Day'", function () {
              component = _sc.app.ListControlDisplayFormatPresetDay;

              var index = 0;

              expect(component.el.querySelectorAll("tbody > tr > td")[index].innerText).toBe("13");
            });

            it("it should use 'YYYY' date format, when it is set to 'Year'", function () {
              component = _sc.app.ListControlDisplayFormatPresetYear;

              var index = 0;

              expect(component.el.querySelectorAll("tbody > tr > td")[index].innerText).toBe("1995");
            });

            describe("And it is set to 'Custom'", function () {
              it("it should use 'Long date' format, when DisplayFormatCustom is empty", function () {
                component = _sc.app.ListControlDisplayFormatCustomNull;

                var index = 0;

                expect(component.el.querySelectorAll("tbody > tr > td")[index].innerText).toBe("July 13, 1995");
              });

              it("it should use the given format, when DisplayFormatCustom is set", function () {
                component = _sc.app.ListControlDisplayFormatCustomValue;

                var index = 0;

                expect(component.el.querySelectorAll("tbody > tr > td")[index].innerText).toBe("13-07-1995");
              });
            });
          });

          describe("And ValueFormat is defined", function () {
            it("it should use standard Sitecore format by default", function () {
              component = _sc.app.ListControlValueFormatNull;
              var index = 0;

              expect(component.el.querySelectorAll("tbody > tr > td")[index].innerText).toBe("July 13, 1995, 000");
            });

            it("it should use the given format, when ValueFormat is set", function () {
              component = _sc.app.ListControlValueFormatValue;
              var index = 0;

              expect(component.el.querySelectorAll("tbody > tr > td")[index].innerText).toBe("July 13, 1995, 555");
            });
          });

        });

        describe("~ Given a ColumnFieldDatetime", function () {
          describe("And DataFieldName is defined", function () {
            it("it should display 'July 13, 1995 10:33 PM' in the first cell in the first row", function () {
              component = _sc.app.ListControlDataFieldName;
              var index = 2;

              expect(component.el.querySelectorAll("tbody > tr:first-child > td")[index].innerText).toBe("July 13, 1995 10:33 PM");
            });
          });

          describe("And IsBold is defined", function () {
            it("it should not have a strong tag when false", function () {
              component = _sc.app.ListControlIsBoldFalse;
              var index = 2;
              var td = component.el.querySelector("tbody > tr").children[index];

              expect(td.querySelectorAll("strong").length).toBe(0);
            });

            it("it should have a strong tag when true", function () {
              component = _sc.app.ListControlIsBoldTrue;
              var index = 2;
              var td = component.el.querySelector("tbody > tr").children[index];

              expect(td.querySelectorAll("strong").length).not.toBe(0);
            });
          });

          describe("And IsItalic is defined", function () {
            it("it should not have a em tag when false", function () {
              component = _sc.app.ListControlIsItalicFalse;
              var index = 2;
              var td = component.el.querySelector("tbody > tr").children[index];

              expect(td.querySelectorAll("em").length).toBe(0);
            });

            it("it should have a em tag when true", function () {
              component = _sc.app.ListControlIsItalicTrue;

              var index = 2;
              var td = component.el.querySelector("tbody > tr").children[index];

              expect(td.querySelectorAll("em").length).not.toBe(0);
            });
          });

          describe("And ColumnTitle is defined", function () {
            it("it should display 'Column title text' in the first cell in the header", function () {
              component = _sc.app.ListControlColumnTitle;
              var index = 6;

              expect(component.el.querySelectorAll("thead > tr:first-child > th")[index].innerText).toBe("Column title text");
            });
          });

          describe("And IsSortable is defined", function () {
            describe("and set to false", function () {
              it("it should not have a 'sc-sortable' class", function () {
                component = _sc.app.ListControlIsSortableFalse;
                var index = 6;

                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-sortable")).toBe(false);
              });
            });

            describe("and set to true", function () {
              it("it should have a 'sc-sortable' class", function () {
                component = _sc.app.ListControlIsSortableTrue;
                var index = 6;

                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-sortable")).toBe(true);
              });

              it("it should change sort direction of column, when header cell is clicked", function () {
                // Prepare
                component = _sc.app.ListControlIsSortableTrueHeaderClick;
                var index = 6;
                component.on("change:Sorting", component.render);

                component.el.querySelectorAll("thead > tr > th")[index].click();
                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-ascending")).toBe(true);

                component.el.querySelectorAll("thead > tr > th")[index].click();
                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-descending")).toBe(true);

                component.el.querySelectorAll("thead > tr > th")[index].click();
                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-no-sorting")).toBe(true);
              });

              it("it should change sort direction of column, when sort direction is clicked in popover", function () {
                //prepare
                component = _sc.app.ListControlIsSortableTruePopoverClick;
                var index = 6;
                component.on("change:Sorting", component.render);

                //act
                component.el.style.width = "200px";
                component.render();

                //assert
                component.el.querySelectorAll("thead > tr > th")[index].click();
                component.el.querySelector(".sc-popover .sc-no-sorting").click();
                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-no-sorting")).toBe(true);

                component.el.querySelectorAll("thead > tr > th")[index].click();
                component.el.querySelector(".sc-popover .sc-ascending").click();
                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-ascending")).toBe(true);

                component.el.querySelectorAll("thead > tr > th")[index].click();
                component.el.querySelector(".sc-popover .sc-descending").click();
                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-descending")).toBe(true);
              });
            });
          });

          describe("And ColumnAlignment is defined", function () {
            it("it should have a 'text-left' class when '', in both cell and header by default", function () {
              component = _sc.app.ListControlColumnAlignmentDefault;
              var index = 5;

              expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("text-left")).toBe(true);
              expect(component.el.querySelectorAll("tbody > tr > td")[index].classList.contains("text-left")).toBe(true);
            });

            it("it should have a 'text-left' class when 'left', in both cell and header", function () {
              component = _sc.app.ListControlColumnAlignmentLeft;
              var index = 5;

              expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("text-left")).toBe(true);
              expect(component.el.querySelectorAll("tbody > tr > td")[index].classList.contains("text-left")).toBe(true);
            });

            it("it should have a 'text-right' class when 'right', in both cell and header", function () {
              component = _sc.app.ListControlColumnAlignmentRight;
              var index = 5;

              expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("text-right")).toBe(true);
              expect(component.el.querySelectorAll("tbody > tr > td")[index].classList.contains("text-right")).toBe(true);
            });

            it("it should have a 'text-center' class when 'center', in both cell and header", function () {
              component = _sc.app.ListControlColumnAlignmentCenter;
              var index = 5;

              expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("text-center")).toBe(true);
              expect(component.el.querySelectorAll("tbody > tr > td")[index].classList.contains("text-center")).toBe(true);
            });
          });

          describe("And ColumnMinWidth is defined", function () {

            it("it should have a 'min-width: 100px' when '', in both cell and header by default", function () {
              component = _sc.app.ListControlColumnMinWidthDefault;
              var index = 6;

              expect(window.getComputedStyle(component.el.querySelectorAll("thead > tr > th")[index]).getPropertyValue("min-width")).toBe("100px");
              expect(window.getComputedStyle(component.el.querySelectorAll("tbody > tr > td")[index]).getPropertyValue("min-width")).toBe("100px");
            });

            it("it should have a 'min-width: 200px' when '200', in both cell and header", function () {
              component = _sc.app.ListControlColumnMinWidthValue;
              var index = 6;

              expect(window.getComputedStyle(component.el.querySelectorAll("thead > tr > th")[index]).getPropertyValue("min-width")).toBe("200px");
              expect(window.getComputedStyle(component.el.querySelectorAll("tbody > tr > td")[index]).getPropertyValue("min-width")).toBe("200px");
            });
          });

          describe("And ColumnWidth is defined", function () {

            it("it should not have a 'col-md-*' class when '', in both cell and header by default", function () {
              component = _sc.app.ListControlColumnWidthDefault;
              var index = 6;

              expect(component.el.querySelectorAll("thead > tr > th")[index].className.indexOf("col-md-")).toBe(-1);
              expect(component.el.querySelectorAll("tbody > tr > td")[index].className.indexOf("col-md-")).toBe(-1);
            });

            it("it should have a 'col-md-5' class when '5', in both cell and header", function () {
              component = _sc.app.ListControlColumnWidthValue;
              var index = 6;

              expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("col-md-5")).toBe(true);
              expect(component.el.querySelectorAll("tbody > tr > td")[index].classList.contains("col-md-5")).toBe(true);
            });
          });

          describe("And DisplayFormatPreset is defined", function () {
            it("it should use 'Long datetime' format by default", function () {
              component = _sc.app.ListControlDisplayFormatPresetNull;
              var index = 1;

              expect(component.el.querySelectorAll("tbody > tr > td")[index].innerText).toBe("July 13, 1995 10:33 PM");
            });

            it("it should use 'LLL' date format, when it is set to 'Long datetime'", function () {
              component = _sc.app.ListControlDisplayFormatPresetLongDatetime;
              var index = 0;

              expect(component.el.querySelectorAll("tbody > tr > td")[index].innerText).toBe("July 13, 1995 10:33 PM");
            });

            it("it should use 'lll' date format, when it is set to 'Short datetime'", function () {
              component = _sc.app.ListControlDisplayFormatPresetShortDatetime;
              var index = 0;

              expect(component.el.querySelectorAll("tbody > tr > td")[index].innerText).toBe("Jul 13, 1995 10:33 PM");
            });

            describe("And it is set to 'Custom'", function () {
              it("it should use 'Long datetime' format, when DisplayFormatCustom is empty", function () {
                component = _sc.app.ListControlDisplayFormatCustomNull;
                var index = 1;

                expect(component.el.querySelectorAll("tbody > tr > td")[index].innerText).toBe("July 13, 1995 10:33 PM");
              });

              it("it should use the given format, when DisplayFormatCustom is set", function () {
                component = _sc.app.ListControlDisplayFormatCustomValue;
                var index = 1;

                expect(component.el.querySelectorAll("tbody > tr > td")[index].innerText).toBe("Thursday, July 13, 1995 10:33 PM");
              });
            });
          });

          describe("And ValueFormat is defined", function () {
            it("it should use standard Sitecore format by default", function () {
              component = _sc.app.ListControlValueFormatNull;
              var index = 1;

              expect(component.el.querySelectorAll("tbody > tr > td")[index].innerText).toBe("Thursday, July 13, 1995, 22:33:44:000");
            });

            it("it should use the given format, when ValueFormat is set", function () {
              component = _sc.app.ListControlValueFormatValue;
              var index = 1;

              expect(component.el.querySelectorAll("tbody > tr > td")[index].innerText).toBe("Thursday, July 13, 1995, 22:33:44:555");
            });
          });

        });

        describe("~ Given a ColumnFieldTime", function () {
          describe("And DataFieldName is defined", function () {
            it("it should display '10:33 PM' in the first cell in the first row", function () {
              component = _sc.app.ListControlDataFieldName;
              var index = 3;

              expect(component.el.querySelectorAll("tbody > tr:first-child > td")[index].innerText).toBe("10:33 PM");
            });
          });

          describe("And IsBold is defined", function () {
            it("it should not have a strong tag when false", function () {
              component = _sc.app.ListControlIsBoldFalse;
              var index = 3;
              var td = component.el.querySelector("tbody > tr").children[index];

              expect(td.querySelectorAll("strong").length).toBe(0);
            });

            it("it should have a strong tag when true", function () {
              component = _sc.app.ListControlIsBoldTrue;
              var index = 3;
              var td = component.el.querySelector("tbody > tr").children[index];

              expect(td.querySelectorAll("strong").length).not.toBe(0);
            });
          });

          describe("And IsItalic is defined", function () {
            it("it should not have a em tag when false", function () {
              component = _sc.app.ListControlIsItalicFalse;
              var index = 3;
              var td = component.el.querySelector("tbody > tr").children[index];

              expect(td.querySelectorAll("em").length).toBe(0);
            });

            it("it should have a em tag when true", function () {
              component = _sc.app.ListControlIsItalicTrue;

              var index = 3;
              var td = component.el.querySelector("tbody > tr").children[index];

              expect(td.querySelectorAll("em").length).not.toBe(0);
            });
          });

          describe("And ColumnTitle is defined", function () {
            it("it should display 'Column title text' in the first cell in the header", function () {
              component = _sc.app.ListControlColumnTitle;
              var index = 7;

              expect(component.el.querySelectorAll("thead > tr:first-child > th")[index].innerText).toBe("Column title text");
            });
          });

          describe("And IsSortable is defined", function () {
            describe("and set to false", function () {
              it("it should not have a 'sc-sortable' class", function () {
                component = _sc.app.ListControlIsSortableFalse;
                var index = 7;

                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-sortable")).toBe(false);
              });
            });

            describe("and set to true", function () {
              it("it should have a 'sc-sortable' class", function () {
                component = _sc.app.ListControlIsSortableTrue;
                var index = 7;

                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-sortable")).toBe(true);
              });

              it("it should change sort direction of column, when header cell is clicked", function () {
                // Prepare
                component = _sc.app.ListControlIsSortableTrueHeaderClick;
                var index = 7;
                component.on("change:Sorting", component.render);

                component.el.querySelectorAll("thead > tr > th")[index].click();
                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-ascending")).toBe(true);

                component.el.querySelectorAll("thead > tr > th")[index].click();
                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-descending")).toBe(true);

                component.el.querySelectorAll("thead > tr > th")[index].click();
                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-no-sorting")).toBe(true);
              });

              it("it should change sort direction of column, when sort direction is clicked in popover", function () {
                //prepare
                component = _sc.app.ListControlIsSortableTruePopoverClick;
                var index = 7;
                component.on("change:Sorting", component.render);

                //act
                component.el.style.width = "200px";
                component.render();

                //assert
                component.el.querySelectorAll("thead > tr > th")[index].click();
                component.el.querySelector(".sc-popover .sc-no-sorting").click();
                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-no-sorting")).toBe(true);

                component.el.querySelectorAll("thead > tr > th")[index].click();
                component.el.querySelector(".sc-popover .sc-ascending").click();
                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-ascending")).toBe(true);

                component.el.querySelectorAll("thead > tr > th")[index].click();
                component.el.querySelector(".sc-popover .sc-descending").click();
                expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("sc-descending")).toBe(true);
              });
            });
          });

          describe("And ColumnAlignment is defined", function () {
            it("it should have a 'text-left' class when '', in both cell and header by default", function () {
              component = _sc.app.ListControlColumnAlignmentDefault;
              var index = 6;

              expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("text-left")).toBe(true);
              expect(component.el.querySelectorAll("tbody > tr > td")[index].classList.contains("text-left")).toBe(true);
            });

            it("it should have a 'text-left' class when 'left', in both cell and header", function () {
              component = _sc.app.ListControlColumnAlignmentLeft;
              var index = 6;

              expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("text-left")).toBe(true);
              expect(component.el.querySelectorAll("tbody > tr > td")[index].classList.contains("text-left")).toBe(true);
            });

            it("it should have a 'text-right' class when 'right', in both cell and header", function () {
              component = _sc.app.ListControlColumnAlignmentRight;
              var index = 6;

              expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("text-right")).toBe(true);
              expect(component.el.querySelectorAll("tbody > tr > td")[index].classList.contains("text-right")).toBe(true);
            });

            it("it should have a 'text-center' class when 'center', in both cell and header", function () {
              component = _sc.app.ListControlColumnAlignmentCenter;
              var index = 6;

              expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("text-center")).toBe(true);
              expect(component.el.querySelectorAll("tbody > tr > td")[index].classList.contains("text-center")).toBe(true);
            });
          });

          describe("And ColumnMinWidth is defined", function () {

            it("it should have a 'min-width: 100px' when '', in both cell and header by default", function () {
              component = _sc.app.ListControlColumnMinWidthDefault;
              var index = 7;

              expect(window.getComputedStyle(component.el.querySelectorAll("thead > tr > th")[index]).getPropertyValue("min-width")).toBe("100px");
              expect(window.getComputedStyle(component.el.querySelectorAll("tbody > tr > td")[index]).getPropertyValue("min-width")).toBe("100px");
            });

            it("it should have a 'min-width: 200px' when '200', in both cell and header", function () {
              component = _sc.app.ListControlColumnMinWidthValue;
              var index = 7;

              expect(window.getComputedStyle(component.el.querySelectorAll("thead > tr > th")[index]).getPropertyValue("min-width")).toBe("200px");
              expect(window.getComputedStyle(component.el.querySelectorAll("tbody > tr > td")[index]).getPropertyValue("min-width")).toBe("200px");
            });
          });

          describe("And ColumnWidth is defined", function () {

            it("it should not have a 'col-md-*' class when '', in both cell and header by default", function () {
              component = _sc.app.ListControlColumnWidthDefault;
              var index = 7;

              expect(component.el.querySelectorAll("thead > tr > th")[index].className.indexOf("col-md-")).toBe(-1);
              expect(component.el.querySelectorAll("tbody > tr > td")[index].className.indexOf("col-md-")).toBe(-1);
            });

            it("it should have a 'col-md-5' class when '5', in both cell and header", function () {
              component = _sc.app.ListControlColumnWidthValue;
              var index = 7;

              expect(component.el.querySelectorAll("thead > tr > th")[index].classList.contains("col-md-5")).toBe(true);
              expect(component.el.querySelectorAll("tbody > tr > td")[index].classList.contains("col-md-5")).toBe(true);
            });
          });

          describe("And DisplayFormatPreset is defined", function () {
            it("it should use 'Time' format by default", function () {
              component = _sc.app.ListControlDisplayFormatPresetNull;
              var index = 2;

              expect(component.el.querySelectorAll("tbody > tr > td")[index].innerText).toBe("10:33 PM");
            });

            it("it should use 'LT' date format, when it is set to 'Time'", function () {
              component = _sc.app.ListControlDisplayFormatPresetTime;
              var index = 0;

              expect(component.el.querySelectorAll("tbody > tr > td")[index].innerText).toBe("10:33 PM");
            });

            it("it should use 'LTS' date format, when it is set to 'Time with seconds'", function () {
              component = _sc.app.ListControlDisplayFormatPresetTimeWithSeconds;
              var index = 0;

              expect(component.el.querySelectorAll("tbody > tr > td")[index].innerText).toBe("10:33:44 PM");
            });

            it("it should use 'HH:mm:ss:SSS' date format, when it is set to 'Time with milliseconds'", function () {
              component = _sc.app.ListControlDisplayFormatPresetTimeWithMilliseconds;
              var index = 0;

              expect(component.el.querySelectorAll("tbody > tr > td")[index].innerText).toBe("22:33:44:000");
            });

            describe("And it is set to 'Custom'", function () {
              it("it should use 'Time' format, when DisplayFormatCustom is empty", function () {
                component = _sc.app.ListControlDisplayFormatCustomNull;
                var index = 2;

                expect(component.el.querySelectorAll("tbody > tr > td")[index].innerText).toBe("10:33 PM");
              });

              it("it should use the given format, when DisplayFormatCustom is set", function () {
                component = _sc.app.ListControlDisplayFormatCustomValue;
                var index = 2;

                expect(component.el.querySelectorAll("tbody > tr > td")[index].innerText).toBe("Thursday, 22:33:44:000");
              });
            });
          });

          describe("And ValueFormat is defined", function () {
            it("it should use standard Sitecore format by default", function () {
              component = _sc.app.ListControlValueFormatNull;
              var index = 2;

              expect(component.el.querySelectorAll("tbody > tr > td")[index].innerText).toBe("22:33:44:000");
            });

            it("it should use the given format, when ValueFormat is set", function () {
              component = _sc.app.ListControlValueFormatValue;
              var index = 2;

              expect(component.el.querySelectorAll("tbody > tr > td")[index].innerText).toBe("22:33:44:555");
            });
          });

        });
      });
    });

  });
});