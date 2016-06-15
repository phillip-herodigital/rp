(function (_sc) {
  describe("Given a Menu component", function () {
    var sut = _sc.app.Breadcrumb,
      sutPages = _sc.app.BreadcrumbPages,
      $sutPagesEl = $(sutPages.el),
      $sutEl = $(sut.el);

    it("component should exist", function () {
      expect(sut).toBeDefined();
    });
    it("component El should exist", function () {
      expect($sutEl).toBeDefined();
    });
    it("IsVisible should exist", function () {
      expect(sut.IsVisible).toBeDefined();
    });
    it("Tooltip should exist", function () {
      expect(sut.Tooltip).toBeDefined();
    });
    describe("when StaticData points to a Bradcrumb items structure with 3 items", function() {
      it("should have (in this example) 3 menu items", function() {
        expect($sutEl.find("li").length).toEqual(3);
      });
      it("should have a selected item", function() {
        expect($sutEl.find("li.selected").length).toEqual(1);
      });
      it("should have a selected item underlined", function() {
        expect($sutEl.find("li.selected a").css("text-decoration")).toEqual("underline");
      });
    });
    
    describe("when StaticData points to a Page items structurewith 1 item", function() {
      it("should have (in this example) 1 menu item", function () {
        expect($sutPagesEl.find("li").length).toEqual(1);
      });
      it("should have a selected item", function () {
        expect($sutPagesEl.find("li.selected").length).toEqual(1);
      });
      it("should have a selected item underlined", function () {
        expect($sutPagesEl.find("li.selected a").css("text-decoration")).toEqual("underline");
      });
    });
  });
})(Sitecore.Speak);