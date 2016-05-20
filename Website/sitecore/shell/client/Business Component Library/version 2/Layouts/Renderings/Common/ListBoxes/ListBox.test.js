describe("Given a ListBox component", function () {
  var sut = _sc.app.ListBox1,
      $sutEl = $(sut.el);

  var testData = [{ $displayName: "test", $itemId: "0" }, { $displayName: "test1", $itemId: "1" }];
  
  it("component should exist", function () {
    expect(sut).toBeDefined();
  });
  it("should have a IsVisible property", function () {
    expect(sut.IsVisible).toBeDefined();
  });
  it("should have a IsEnabled property", function () {
    expect(sut.IsEnabled).toBeDefined();
  });
  it("should have a DynamicData property", function () {
      expect( sut.DynamicData ).toBeDefined();
  });
  it("should have a SelectedItems property", function () {
      expect( sut.SelectedItems ).toBeDefined();
  });
  it("should have a SelectedValues property", function () {
      expect( sut.SelectedValues ).toBeDefined();
  });
  it("should have a ValueFieldName property", function () {
    expect(sut.ValueFieldName).toBeDefined();
  });
  it("should have a DisplayFieldName property", function () {
    expect(sut.DisplayFieldName).toBeDefined();
  });
  describe("when you add items to the ComboBox", function () {
    it("it should be reflected to the HTML", function () {
        sut.DynamicData = testData;
      expect($sutEl.find("option").length).toEqual(2);
    });
  } );
    describe("when changine the selected values", function () {
        it("it should have a selectedValues defined as an array of item id's when we set selectedItems = [items[0], items[1]]", function () {  
            sut.SelectedItems = [ testData[0], testData[1] ];
            expect( sut.SelectedValues[0] ).toBe( testData[0].$itemId );
            expect( sut.SelectedValues[1] ).toBe( testData[1].$itemId );
        });

        it("it should use the items's 'name' field as displayFieldName", function () {
            expect( $sutEl.find( "option" ).eq( 0 ).html() ).toBe( testData[0].$displayName );
        });

        it("it should use the items's '$itemId' field as defalut valueFieldName", function () {
            expect( $sutEl.find( "option" ).eq( 0 ).attr( 'value' ) ).toBe( testData[0].$itemId );
        });


        it("it should have the selecetdItem to be the 3rd item, when we set the selectedValues to be that of the 3rd element in the options array", function () {
            sut.SelectedValues = [ testData[0].$itemId ];
            expect( sut.SelectedItems[0] ).toBe( testData[0] );
        });   
    });
});