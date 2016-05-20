describe("Given a tooltip component", function () {
  describe("in tooltip mode", function () {
    var sut = _sc.app.DefaultTooltip,
        $sutEl = _sc.app.DefaultTooltip.el;

    it("component should exist", function () {
      expect(sut).toBeDefined();
    });
    it("component El should exist", function () {
      expect($sutEl).toBeDefined();
    });
    it("should have a Title Property", function () {
      expect(sut.Title).toBeDefined();
    });
    it("should have a Content Property", function () {
      expect(sut.Content).toBeDefined();
    });
    it("should have a IsSimple Property", function () {
      expect(sut.Simple).toBeDefined();
    });
    it("should have a Delay Property", function () {
      expect(sut.Delay).toBeDefined();
    });
    it("should have a ContainsHTML Property", function () {
      expect(sut.ContainsHTML).toBeDefined();
    });
    it("should have a TargetControl Property", function () {
      expect(sut.ContainsHTML).toBeDefined();
    });
    it("should have a TriggerOption Property", function () {
      expect(sut.ContainsHTML).toBeDefined();
    });
    it("should have a Placement Property", function () {
      expect(sut.Placement).toBeDefined();
    });
    describe("which should trigger on click", function () {
      var sutTooltipOnClick = _sc.app.TooltipOnClick,
          $sutTooltipOnClickEl = $(sutTooltipOnClick.el);
    
      it("when you click, Bootstrap html should be there", function () {
        expect(sutTooltipOnClick).toBeDefined();
        expect($sutTooltipOnClickEl).toBeDefined();

        expect($("[role=tooltip]").length).toEqual(0);

        $(_sc.app.ButtonOnClick.el).click();
      
        expect($("[role=tooltip]").length).toEqual(1);
      });
    });
  });
  describe("in popover mode", function () {
    var sutPopover = _sc.app.TooltipPopover,
        $sutPopoverEl = $(sutPopover.el);
    it("when you click, Bootstrap html for popover should be there", function () {
      expect(sutPopover).toBeDefined();
      expect($sutPopoverEl).toBeDefined();

      expect($("[role=tooltip]").length).toEqual(1);

      $(_sc.app.ButtonTooltipPopover.el).click();

      expect($("[role=tooltip]").length).toEqual(2);
    });
  });
});