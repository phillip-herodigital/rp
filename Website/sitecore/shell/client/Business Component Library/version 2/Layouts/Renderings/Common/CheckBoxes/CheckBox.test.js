describe("Given a CheckBox component", function () {
  var sut = _sc.app.DefaultCheckbox,
      $sutEl = $(sut.el);
  it("component should exist", function () {
    expect(sut).toBeDefined();
    expect($sutEl).toBeDefined();
  });
  it("should have a IsVisible property", function () {
    expect(sut.IsVisible).toBeDefined();
  });
  it("it should set isVisible to true by default", function () {
    expect(sut.IsVisible).toBe(true);
  });
  it("should have a IsEnabled property", function () {
    expect(sut.IsEnabled).toBeDefined();
  });
  it("it should set isEnable to true by default", function () {
    expect(sut.IsEnabled).toBe(true);
  });
  it("should have a IsChecked property", function () {
    expect(sut.IsChecked).toBeDefined();
  });
  it("it should set isChecked to false by default", function () {
    expect(sut.IsChecked).toBe(false);
  });
  it("should have a Label property", function () {
    expect(sut.Label).toBeDefined();
  });
  it("should have a Value property", function () {
    expect(sut.Value).toBeDefined();
  });
  it("it should set value to empty string by default", function () {
    expect(sut.Value).toBe("");
  });
  it("when I change the IsChecked property itshould checked the input checkbox", function () {
      sut.IsChecked = true;
      expect($sutEl.find("input").is(':checked')).toBeTruthy();
  });
  it("when I change the isVisible property it should disappear", function () {
    sut.IsVisible = false;
    expect(sut.IsVisible).toBe(false);
    expect($sutEl.is(":visible")).toEqual(sut.IsVisible);
    sut.IsVisible = true;
  });
  it("when I change the Label property it should change the text value of the HTML element", function () {
    sut.Label = "new value";
    expect(sut.Label).toEqual("new value");
    expect($sutEl.find("span").html()).toEqual(sut.Label);
  });
  afterEach(function () {
    sut.IsVisible = true;
    sut.IsEnabled = true;
    sut.IsChecked = false;
    sut.Label = "";
  });
});

describe("when I change the Value property", function () {
  var sutCheckBox = _sc.app.CheckBox,
      $sutCheckBoxEl = $(sutCheckBox.el),
    foo, beforeValue;
  
  beforeEach(function () {
    foo = {
      handler: function () {
        var x = 1;
      }
    };

    spyOn(foo, 'handler');
    beforeValue = sutCheckBox.Value;
  });
  
  it("change:Value event should be triggered", function () {
    sutCheckBox.on("change:Value", foo.handler);
    sutCheckBox.Value = "someValue";
    expect(foo.handler).toHaveBeenCalled();
  });
  afterEach(function () {
    sutCheckBox.Value = beforeValue;
  });
});

describe("when I define Value property server-side", function () {
  var sutCheckBox = _sc.app.CheckBox,
      $sutCheckBoxEl = $(sutCheckBox.el);
  it("it should set value property to value of the element after initialization", function () {
    expect(sutCheckBox.Value).toEqual("toto");
    expect($sutCheckBoxEl.find("input").val()).toEqual("toto");
  });
});
describe("when I change the isEnabled property to true", function () {
  var sutCheckedCheckBox = _sc.app.CheckedCheckBox,
      $sutCheckedCheckBoxEl = $(sutCheckedCheckBox.el);
  it("should enable input element", function () {
    sutCheckedCheckBox.IsEnabled = true;
    expect(sutCheckedCheckBox.IsEnabled).toBe(true);
    expect($sutCheckedCheckBoxEl.find("input").is(":disabled")).toEqual(false);
  });
  afterEach(function () {
    sutCheckedCheckBox.IsEnabled = false;
  });
});
describe("when I change the isChecked property to true", function () {
  var sutCheckedCheckBox = _sc.app.CheckBox,
      $sutCheckedCheckBoxEl = $(sutCheckedCheckBox.el);
  it("should change input checked value", function () {
    sutCheckedCheckBox.isChecked = false;
    expect(sutCheckedCheckBox.isChecked).toBe(false);
    expect($sutCheckedCheckBoxEl.find("input").is(":checked")).toBe(false);
  });
});
describe("when was checked server-side", function () {
  var sutCheckedCheckBox = _sc.app.CheckedCheckBox,
      $sutCheckedCheckBoxEl = $(sutCheckedCheckBox.el);

  it("component should exist", function () {
    expect(sutCheckedCheckBox).toBeTruthy();
    expect($sutCheckedCheckBoxEl).toBeTruthy();
  });
  it("isChecked property should be true", function () {
    expect(sutCheckedCheckBox.IsChecked).toBeTruthy();
  });
});