describe("Given a Checbox component", function () {
  var sut1 = Sitecore.Speak.app.CheckBox1,
    sut2 = Sitecore.Speak.app.CheckBox2,
    sut3 = Sitecore.Speak.app.CheckBox3,
    sut4 = Sitecore.Speak.app.CheckBox4,
    sut5 = Sitecore.Speak.app.CheckBox5,
    sut6 = Sitecore.Speak.app.CheckBox6,
    sut7 = Sitecore.Speak.app.CheckBox7,
    sut8 = Sitecore.Speak.app.CheckBox8;

  describe("when ConfigurationItem is empty", function () {
    it("item with the name = control Id should be used for properties", function () {
      expect(sut1.Label).toEqual("CheckBox1");
    });
  });
  describe("when ConfigurationItem contains Id", function () {
    it("the item by Id should be used for properties", function () {
      expect(sut2.Label).toEqual("CheckBox2");
    });
  });
  describe("when ConfigurationItem contains absolute path", function () {
    it("the item by path should be used for properties", function () {
      expect(sut3.Label).toEqual("CheckBox3");
    });
  });
  describe("when ConfigurationItem contains relative path started from item name", function () {
    it("the item by relative path should be used for properties", function () {
      expect(sut4.Label).toEqual("CheckBox1");
    });
  });
  describe("when ConfigurationItem contains relative path started from ./ ", function () {
    it("the item by relative path should be used for properties", function () {
      expect(sut8.Label).toEqual("CheckBox1");
    });
  });
  describe("when ConfigurationItem contains relative path started from ../ ", function () {
    it("the item by relative path should be used for properties", function () {
      expect(sut5.Label).toEqual("CheckBox1");
    });
  });
  describe("when Datasource specified", function () {
    it("it should be ignored", function () {
      expect(sut6.Label).toEqual("");
    });
  });
  describe("when value specified in the property", function () {
    it("it should have higher priority then from ConfigurationItem", function () {
      expect(sut7.Label).toEqual("CheckBox7");
    });
  });
});