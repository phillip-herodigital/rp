(function (_sc) {
  describe("Given a HyperLinkButton component", function () {
    var testValue = "TestValue",
        testLink = "/toto",
        sut = _sc.app.RegularButton,
        $sutEl = $(sut.el);

    it("component should exist", function () {
      expect(sut).toBeDefined();
      expect($sutEl).toBeDefined();
    });
    it("should have Text Property", function () {
      expect(sut.Text).toBeDefined();
    });
    it("should have IsVisible Property", function () {
      expect(sut.IsVisible).toBeDefined();
    });
    it("should have IsEnabled Property", function () {
      expect(sut.IsEnabled).toBeDefined();
    });
    it("should have NavigateUrl Property", function () {
      expect(sut.NavigateUrl).toBeDefined();
    });
    describe("when I change the Text property", function () {
      it("should update the Value of the Text", function () {
        sut.Text = testValue;
        expect($sutEl.find(".sc-hyperlink-text").html()).toEqual(testValue);
      });
    });
    describe("when I change the IsEnabled property", function () {
      it("should be disabled", function () {
        sut.IsEnabled = false;
        expect($sutEl.hasClass("disabled")).toBeTruthy();
      });
    });
    describe("when I change the NavigateUrl property", function () {
      it("should change the Href attribute", function () {
        sut.NavigateUrl = testLink;
        expect($sutEl.attr("href")).toEqual(testLink);
      });
    });
    describe("when the hyperLink is in ButtonMode", function () {
      var sutButtonMode = _sc.app.ButtonHyperLinkButton,
          $sutButtonModelEl = $(sutButtonMode.el);

      it("component should be defined", function () {
        expect(sutButtonMode).toBeDefined();
      });
      it("el should be defined", function () {
        expect($sutButtonModelEl).toBeDefined();
      });
      it("el should have btn class", function () {
        expect($sutButtonModelEl.hasClass("btn")).toBeTruthy();
      });
      it("el should have btn-default class", function () {
        expect($sutButtonModelEl.hasClass("btn-default")).toBeTruthy();
      });
    });
    describe("when the hyperLink has Icon", function () {
      var sutIcon = _sc.app.IconHyperLinkButton1,
          $sutIconEl = $(sutIcon.el);

      it("component should be defined", function () {
        expect(sutIcon).toBeDefined();
      });
      it("el should be defined", function () {
        expect($sutIconEl).toBeDefined();
      });
      it("it should have Icon specified", function () {
        expect(sutIcon.Icon).toBe("/sitecore/shell/client/Speak/Assets/img/sc-sprite.png");
      });
      it("it should have SpritePosition specified", function () {
        expect(sutIcon.SpritePosition).toBe("-153px -136px");
      });
      it("el should have icon class", function () {
        expect($sutIconEl.hasClass("icon")).toBeTruthy();
      });
    });
  });
})(Sitecore.Speak);