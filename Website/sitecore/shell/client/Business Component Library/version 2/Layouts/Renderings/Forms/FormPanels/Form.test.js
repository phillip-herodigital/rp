(function (_sc) {
  describe("Given a Form component", function () {
    var sut = _sc.app.Form,
        $sutEl = $(sut.el);

    it("component should exist", function () {
      expect(sut).toBeDefined();
    });
    it("component el should exist", function () {
      expect($sutEl).toBeDefined();
    });
    it("component should have a IsVisible property", function () {
      expect(sut.IsVisible).toBeDefined();
    });

    it("component should have a 2 Text components inside", function () {
      expect($sutEl.find("[data-sc-component='TextBox']").length).toBe(2);
    });

    it("TextBox1.Text should be 'Text1'", function () {
      expect(sut.TextBox1.Value).toBe("Text1");
    });

    it("TextBox2.Text should be 'Text2'", function () {
      expect(sut.TextBox2.Value).toBe("Text2");
    });

    it("component should have a FormData property", function () {
      expect(sut.FormData).toBeDefined();
    });

    it("FormData.textbox1 should be Text1", function () {
      expect(sut.FormData.TextBox1).toBe("Text1");
    });

    it("FormData.textbox2 should be Text2", function () {
      expect(sut.FormData.TextBox2).toBe("Text2");
    });

    it("FormData.getFormData() should returnJSON.string JSON '{\"textbox1\":\"Text1\",\"textbox2\":\"Text2\"}'", function () {
      expect(JSON.stringify(sut.getFormData())).toBe("{\"TextBox1\":\"Text1\",\"TextBox2\":\"Text2\"}");
    });
  });
})(Sitecore.Speak);