describe("Given a Popover component", function () {
  var sut1 = _sc.app.Popover1,
      sut2 = _sc.app.Popover2,
      $sutEl1 = $(sut1.el);

  it("component should exist", function () {
    expect(sut1).toBeDefined();
  });
  it("component El should exist", function () {
    expect($sutEl1).toBeDefined();
  });
  it("should have a TargetControl Property", function () {
    expect(sut1.TargetControl).toBeDefined();
  });
  it("should have a Trigger property", function () {
    expect(sut1.Trigger).toBeDefined();
  });

  describe("on initialize", function () {
    it("it should set 'targetControl' to the target control defined", function () {
      expect(sut1.TargetControl).toBe("Button1");
    });

    it("it should set 'trigger' to 'click' by default", function () {
      expect(sut1.Trigger).toBe("click");
    });

    it("it should set 'trigger' to the trigger value defined", function () {
      expect(sut2.Trigger).toBe("hover");
    });

    it("it should set 'Placement' to 'auto' by default", function () {
      expect(sut1.Placement).toBe("auto");
    });

    it("it should set 'Placement' to the placement defined", function () {
      expect(sut2.Placement).toBe("left auto");
    });
  });

  describe("when I click on the TargetControl", function () {
    it("should open popover", function (done) {
      var $target = $("[data-sc-id=" + sut1.TargetControl + "]");

      $target.click();
      expect($(".popover").length).toEqual(1);
      
      $target.click();
      //let time for the transition
      setTimeout(function () {
        expect($(".popover").length).toEqual(0);
        done();
      }, 1000);
    });
  });
});