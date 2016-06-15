(function(speak, describe, it, beforeEach, afterEach, expect) {
  describe("Given a SPEAK page with several Rule components (LoadMode: Inline)", function() {
    var app = Sitecore.Speak.app;
    var textBox = app.TextBox1;

    afterEach(function() {
      textBox.Value = "default";
      textBox.IsEnabled = true;
    });

    describe("when True (always) condition is triggered", function() {
      beforeEach(function(done) {
        textBox.once("change:IsEnabled", done);
        app.trigger("SetPropertyWhenTrue");
      });

      it("the configured action should be executed", function() {
        expect(textBox.IsEnabled).toBe(false);
      });
    });

    describe("when ComponentHasPropertyValue condition is triggered", function() {
      beforeEach(function(done) {
        textBox.once("change:Value", done);
        app.trigger("ComponentHasPropertyValue");
      });

      it("the configured action should be executed", function() {
        expect(textBox.Value).toBe("ComponentHasPropertyValue");
      });
    });

    describe("when SetComponentPropertyToValue action is executed", function() {
      beforeEach(function(done) {
        textBox.once("change:IsEnabled", done);
        app.trigger("SetPropertyWhenTrue");
      });

      it("the value should be set to specified property", function() {
        expect(textBox.Value).toBe("SetPropertyWhenTrue");
      });
    });
  });
})(Sitecore.Speak, describe, it, beforeEach, afterEach, expect);