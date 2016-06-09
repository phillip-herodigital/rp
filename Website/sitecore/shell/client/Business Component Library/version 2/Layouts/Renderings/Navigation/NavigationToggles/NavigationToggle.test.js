(function(speak, describe, it, beforeEach, expect) {
  describe("Given a NavigationToggle Control", function() {
    var control = speak.app.NavigationToggle1;
    var $el = $(control.el);
    var navWrapper = $("<div class='sc-navigation-wrapper' />");

    $(speak.app.el).append(navWrapper);

    beforeEach(function() {
      navWrapper.removeClass("active");
    });

    it("it should create a global 'resetNavigation' eventlistener, which executes the 'resetNavigation'", function() {
      expect(speak._events.resetNavigation).toBeDefined();

      speak.trigger("resetNavigation");
      expect(navWrapper.hasClass("active")).toBe(true);
    });

    it("it should toggle the active class when I execute 'togglePanel'", function() {
      control.togglePanel();
      expect(navWrapper.hasClass("active")).toBe(true);

      control.togglePanel();
      expect(navWrapper.hasClass("active")).toBe(false);
    });

    it("it should have toggle button inside", function () {
      var button = $el.find("#" + control.id + "ToggleButton");
      expect(button).toBeDefined();
      expect(control.children[0].id).toBe(control.id + "ToggleButton");
    });

    it("it should have toggle button inside with navigationPanelToggleIcon as Icon", function () {
      expect(control.children[0].Icon.indexOf("navigationPanelToggleIcon.png")>0).toBe(true);
    });

    it("it should have toggle button inside with ShowArrow eq false", function () {
      expect(control.children[0].ShowArrow).toBe(false);
    });

    it("it should have toggle button inside with SpritePosition eq 'center'", function () {
      expect(control.children[0].SpritePosition).toBe("center");
    });
  });
})(Sitecore.Speak, describe, it, beforeEach, expect);