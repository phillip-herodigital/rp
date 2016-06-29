describe("Given a DropList component", function () {
  var sut = _sc.app.DropList,
      $sutEl = $(sut.el);
  var sut3 = _sc.app.DropList3;

  beforeEach(function() {
    sut.DynamicData = [{ $displayName: "test", $itemId: "0" }, { $displayName: "test1", $itemId: "1" }];
  });

  it("component should exist", function () {
    expect(sut).toBeDefined();
    expect($sutEl).toBeDefined();
  });
  it("should have a IsVisible property", function () {
    expect(sut.IsVisible).toBeDefined();
  });
  it("should have a IsEnabled property", function () {
    expect(sut.IsEnabled).toBeDefined();
  });
  it("should have a DynamicData property", function () {
    expect(sut.DynamicData).toBeDefined();
  });
  it("should have a SelectedItem property", function () {
    expect(sut.SelectedItem).toBeDefined();
  });
  it("should have a SelectedValue property", function () {
    expect(sut.SelectedItem).toBeDefined();
  });
  it("should have a ValueFieldName property", function () {
    expect(sut.ValueFieldName).toBeDefined();
  });
  it("should have a DisplayFieldName property", function () {
    expect(sut.DisplayFieldName).toBeDefined();
  });
  describe("when you have SelectedValue specified in design time", function () {
    it("it should be selected", function () {
      expect(sut3.SelectedValue).toEqual("{C02DE599-FC31-4059-9B9F-89C0018E0576}");
    });
  });
  
  describe("and a test from 1.1", function () {
    var testArea = Sitecore.Speak.app;
    var testAreaEl = $("body");
    var component;
    var $element;
    var items = [
      {
        $displayName: "1st displayName",
        id: 1,
        $itemId: "1st itemId",
        name: "1st name"
      },
      {
        $displayName: "2nd displayName",
        id: 2,
        $itemId: "2nd itemId",
        name: "2nd name"
      },
      {
        $displayName: "3rd displayName",
        id: 3,
        $itemId: "3rd itemId",
        name: "3rd name"
      }
    ];

    var items2 = [
      {
        $displayName: "4th displayName",
        id: 4,
        $itemId: "4th itemId",
        name: "4th name"
      },
      {
        $displayName: "5th displayName",
        id: 5,
        $itemId: "5th itemId",
        name: "5th name"
      },
      {
        $displayName: "6th displayName",
        id: 6,
        $itemId: "6th itemId",
        name: "6th name"
      }
    ];
   
    it("it should create the Control when I execute Run", function () {
      $element = testAreaEl.find("[data-sc-id=DropList2]");
      expect(testArea.DropList2).toBeDefined();
      component = testArea.DropList2;
    });
   

    it("it should create options when I set items", function () {   
      component.DynamicData = items;
      expect($element.find("option").length).toBe(3);
    });

    it("it should has a selectedItem pointing to the 1st element of the array", function () {
      expect(component.SelectedItem).toBe(items[0]);
    });
    
    it("it should use the items's 'name' field as displayFieldName", function () {
      expect($element.find("option").eq(0).html()).toBe(items[0].$displayName);
    });

    it("it should use the items's '$itemId' field as valueFieldName", function () {
      expect($element.find("option").eq(0).attr('value')).toBe(items[0].$itemId);
    });

    it("it should have the selecetdValue of the 2nd item  when we set selectedItem to be the 2nd element in the options array", function () {
      component.SelectedItem = items[1];
      expect(component.SelectedValue).toBe(items[1].$itemId);
    });

    it("it should have the selecetdItem to be the 3rd item, when we set the selectedValue to be that of the 3rd element in the options array", function () {
      component.SelectedValue = "3rd itemId";
      expect(component.SelectedItem).toBe(items[2]);
    });

    it("it should change the options collection and select the first item, when we change the data", function () {
      component.reset(items2);
      expect($element.find("option").eq(0).attr('value')).toBe(items2[0].$itemId.toString());
      expect(component.SelectedItem).toBe(items2[0]);
    });

    it("it should change the options Value and Text when we change the field names", function () {
      component.ValueFieldName = "id";
      component.DisplayFieldName = "name";
      expect($element.find("option").eq(0).attr('value')).toBe(items2[0].$itemId.toString());
      expect($element.find("option").eq(0).html()).toBe(items2[0].$displayName);
    });

    it("it should change the options collection and the selectedItem when we call set new items and select new item", function () {
      component.reset(items);
      component.select(items[1]);
      expect(component.SelectedItem).toBe(items[1]);
    });

    it("it should have the selecetdItem to be the 3rd item of items2 when we select by value", function () {
      component.selectByValue(items[2].id);
      expect(component.SelectedItem).toBe(items[2]);
    });

  });
});


