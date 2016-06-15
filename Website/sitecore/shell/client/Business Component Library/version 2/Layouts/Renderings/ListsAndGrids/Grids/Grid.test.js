describe("Given a Grid component", function () {
  var sut = Sitecore.Speak.app.Grid;

  it("should exists", function () {
    expect(sut).toBeDefined();
  });


  describe("Given a Grid", function () {
    var sutGrid = Sitecore.Speak.app.Grid;
    $sutEl = $(sut.el);

    it("it should create 9 placeholders when NumberOfCells= 9", function () {
      expect(sutGrid).toBeDefined();
      var placeHolderCount = $sutEl.find("div[class^='col-lg']").length;
      expect(placeHolderCount).toBe(9);
    });

    it("it should create a first element with 3-4-6-12 (lg-md-sm-xs) bootstrap columns classes", function () {
      var placeHolderCount = $sutEl.find(".col-lg-3.col-md-4.col-sm-6.col-xs-12")[0];
      expect(placeHolderCount).toBeDefined();
    });
    it("it should create a second element with 6-8-6-12 (lg-md-sm-xs) bootstrap columns classes", function () {
      var placeHolderCount = $sutEl.find(".col-lg-6.col-md-8.col-sm-6.col-xs-12")[0];
      expect(placeHolderCount).toBeDefined();
    });
    it("it should create a third element with 9-4-12-12 (lg-md-sm-xs) bootstrap columns classes", function () {
      var placeHolderCount = $sutEl.find(".col-lg-9.col-md-4.col-sm-12.col-xs-12")[0];
      expect(placeHolderCount).toBeDefined();
    });

    it("it should create a class'sc-bottom-padding' in each placeholder when UseCellBottomPadding=true", function () {
      var placeHolderCount = $sutEl.find(".sc-bottom-padding").length;
      expect(placeHolderCount).toBe(9);
    });
  });
});