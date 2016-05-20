describe("Given a DropDown component", function () {
  var sut = _sc.app.DropDownButton,
      testingValue = "testingValue",
      $sutEl = $(sut.el),
      sutIconDropDownButton = _sc.app.IconDropDownButton,
      $sutIconDropDownButtonEl = $(sutIconDropDownButton.el);

  it("should exists", function () {
    expect(sut).toBeDefined();
  });
  it("should have an element exists", function () {
    expect($sutEl).toBeDefined();
  });
  it("should have a Text property", function () {
    expect(sut.Text).toBeDefined();
  });
  it("should have a IsOpen property", function () {
    expect(sut.IsOpen).toBeDefined();
  });
  it("should have a IsVisible property", function () {
    expect(sut.IsVisible).toBeDefined();
  });
  it("should have a IsEnabled property", function () {
    expect(sut.IsEnabled).toBeDefined();
  });
  it("should have an ImageUrl property", function () {
    expect(sut.ImageUrl).toBeDefined();
  });
  it("should have an SpritePosition property", function () {
      expect(sut.SpritePosition).toBeDefined();
  });
  describe("when you set text to some value", function () {
    it("should change the text of the dropdown", function () {
      sut.Text = testingValue;
      expect($sutEl.find(".sc-dropdownbutton-text").html()).toEqual(testingValue);
    });
  });
  describe("when you set IsOpen to true", function () {
    it("should open the content", function () {
      sut.IsOpen = true;
      expect($sutEl.find(".sc-dropdownbutton-contentpanel").css("display")).toEqual("block");
    });
  });
  describe("when you have a Dropdown with an icon", function () {
    it("should exists", function () {
      expect(sutIconDropDownButton).toBeDefined();
    });
    it("should be in the HTML exists", function () {
      expect($sutIconDropDownButtonEl).toBeDefined();
    });
    it("should have an image", function () {
      expect($sutIconDropDownButtonEl.find(".sc-icon")).toBeDefined();
    });
  });
  describe("when DropPanelAlignment is set to 'Right'", function() {
    it("The panel should align with the right side of the button", function() {
      sut.DropPanelAlignment = "Right";
      expect($sutEl.find(".sc-dropdownbutton-contentpanel").hasClass("right")).toBe(true);
    });
  });
});