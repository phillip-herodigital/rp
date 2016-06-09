(function(sc) {
  var testingImage = "/sitecore/shell/themes/standard/images/SitecoreImage.png";

  describe("Given an empty Image component", function() {
    var sutEmptyImage = sc.app.EmptyImage,
        $sutEmptyImageEl = $(sutEmptyImage.el).find("img");

    it("component should exist", function() {
      expect(sutEmptyImage).toBeDefined();
      expect($sutEmptyImageEl).toBeDefined();
    });
    it("component should have an ImageUrl property", function() {
      expect(sutEmptyImage.ImageUrl).toBeDefined();
    });
    it("component should have default value set to a blank property", function() {
      expect(sutEmptyImage.ImageUrl).toEqual("/sitecore/images/blank.gif");
    });
    it("component should have an Alt property", function() {
      expect(sutEmptyImage.Alt).toBeDefined();
    });
    it("component should have an IsVisible property", function() {
      expect(sutEmptyImage.IsVisible).toBeDefined();
    });
    it("component should have an Width property - no clientSide Binding", function() {
      expect(sutEmptyImage.Width).toBeDefined();
    });
    it("component should have an Height property - no clientSide Binding", function() {
      expect(sutEmptyImage.Height).toBeDefined();
    });
    it("component should have the 'small' class", function () {
      expect($sutEmptyImageEl.parent().hasClass('small')).toBe(true);
    });
    it("component should have the 'show-default-image' class", function (done) {
      expect($sutEmptyImageEl.parent().hasClass('show-default-image')).toBe(true);
      done();
    });
  });

  describe("Given an normal Image component", function() {
    var sutNormalImage = sc.app.NormalImage,
        $sutNormalImageEl = $(sutNormalImage.el).find("img");

    it("image markup should reflect changes of the ImageUrl property", function() {
      sutNormalImage.ImageUrl = testingImage;
      expect($sutNormalImageEl.attr("src")).toEqual(testingImage);
    });

    it("image markup should reflect changes of the Alt property", function() {
      sutNormalImage.Alt = testingImage;
      expect($sutNormalImageEl.attr("alt")).toEqual(testingImage);
    });

    it("image markup should reflect changes of the Height property", function() {
      sutNormalImage.Height = "100px";
      expect($sutNormalImageEl.attr("height")).toEqual("100px");
    });

    it("image markup should reflect changes of the Width property", function() {
      sutNormalImage.Width = "100px";
      expect($sutNormalImageEl.attr("width")).toEqual("100px");
    });

    it("image markup should reflect changes of the IsVisible property", function() {
      expect($sutNormalImageEl.is(":visible")).toEqual(true);

      sutNormalImage.IsVisible = false;
      expect($sutNormalImageEl.is(":visible")).toEqual(false);

      sutNormalImage.IsVisible = true;
      expect($sutNormalImageEl.is(":visible")).toEqual(true);
    });

  });

  describe("Given an Image which uses media Handler width Height and Width", function() {
    var sutImageSetFromMedia = sc.app.ImageFromMedia;

    it("ImageUrl property should point media item", function() {
      expect(sutImageSetFromMedia.ImageUrl).toContain("/media/Speak/app-icon.ashx?db=core");
    });

  });

  describe("Given an Image with Height and Width and broken ImageURL", function () {
    var sutBadURLImage = sc.app.BadURLImage,
    $sutBadURLImageEl = $(sutBadURLImage.el).find("img");

    it("component should not have the 'show-default-image' class", function (done) {
      expect($sutBadURLImageEl.parent().hasClass('show-default-image')).toBe(false);
      done(); 
    });

  });


})(Sitecore.Speak);