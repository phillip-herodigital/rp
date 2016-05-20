describe("Given a SearchableDropList model", function () {
  var component, component2, $element, $element2, testAreaApp, items;

  beforeEach(function () {
    testAreaApp = Sitecore.Speak.app;

    component = testAreaApp.SearchableDropList1;
    $element = component.$el;

    component2 = testAreaApp.SearchableDropList2;
    $element2 = component2.$el;

    items = [
      {
        $displayName: "1st displayName",
        id: 1,
        $itemId: "1st itemId",
        name: "1st name",
        $templateName: "audio",
        category: "test"
      },
      {
        $displayName: "2nd displayName",
        id: 2,
        $itemId: "2nd itemId",
        name: "2nd name",
        $templateName: "video",
        category: "test"
      },
      {
        $displayName: "3rd displayName",
        id: 3,
        $itemId: "3rd itemId",
        name: "3rd name",
        $templateName: "audio",
        category: "test2"
      }
    ];

    component.reset(items);
    component2.reset(items);
  });

  it("it should create options when I set items", function () {
    expect($element.find("option").length).toBe(3);
  });

  it("it should have selected first item by default", function() {
    expect(component.SelectedItem).toBe(items[0]);
    expect(component.SelectedValue).toBe("1st itemId");
  });

  it("it should preselect item if selectedValue property is set at design-time", function () {
    expect(component2.SelectedValue).toBe("2nd itemId");
    expect(component2.SelectedItem).toBe(items[1]);
  });

  it("it should use displayFieldName property to render option label", function () {
    expect($element.find("option").eq(0).html()).toBe(items[0][component.DisplayFieldName]);
  });

  it("it should use valueFieldName property to render option value", function () {
    expect($element.find("option").eq(0).attr("value")).toBe(items[0][component.ValueFieldName]);
  });

  it("it should use groupFieldName property to group to organize options in groups", function () {
    expect($element.find("optgroup").eq(0).attr("label")).toBe(items[0][component.GroupFieldName]);
  });

  it("it should have the selecetdValue of the 2nd item when we set selectedItem to be the 2nd element", function () {
    component.SelectedItem = items[1];
    expect(component.SelectedValue).toBe(items[1].$itemId);
  });

  it("it should have the selecetdItem to be the 3rd item when we set the selectedValue to be that of the 3rd element", function () {
    component.SelectedValue = "3rd itemId";
    expect(component.SelectedItem).toBe(items[2]);
  });

  it("TFS bug #56321: SearchableDropList does not work when inside a container", function () {
    var com = testAreaApp.SearchableDropList3;
    expect($(com.el).find("select option").length).toBeGreaterThan(0);
  });
});

