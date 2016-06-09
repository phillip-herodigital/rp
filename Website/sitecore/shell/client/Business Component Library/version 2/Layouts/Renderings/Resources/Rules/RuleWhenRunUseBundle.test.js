(function(speak, describe, it, beforeEach, afterEach, expect) {
  describe("Given a SPEAK page with several Rule components (LoadMode: WhenRun, UseBundle: true)", function() {
    var app = speak.app;
    var textBox = app.TextBox1;

    afterEach(function() {
      textBox.Value = "default";
      textBox.IsEnabled = true;
    });

    describe("given 'and' operator between two conditions", function() {
      describe("when both conditions are true", function() {
        beforeEach(function(done) {
          textBox.once("change:Value", done);
          app.trigger("And");
        });

        it("the configured action should be executed", function() {
          expect(textBox.Value).toBe("And");
        });
      });
    });

    describe("given 'or' operator between two conditions", function() {
      describe("when only one of the conditions is true", function() {
        beforeEach(function(done) {
          textBox.once("change:Value", done);
          app.trigger("Or");
        });

        it("the configured action should be executed", function() {
          expect(textBox.Value).toBe("Or");
        });
      });
    });

    describe("given 'except' prefix is set before the condition", function() {
      describe("when the condition is false", function() {
        beforeEach(function(done) {
          textBox.once("change:Value", done);
          app.trigger("Except");
        });

        it("the configured action should be executed", function() {
          expect(textBox.Value).toBe("Except");
        });
      });
    });

    describe("given two rules are configured in a single rule definition item", function() {
      describe("when the component is triggered", function() {
        beforeEach(function(done) {
          textBox.once("change:IsEnabled", done);
          app.trigger("TwoRules");
        });

        it("both rules should be executed", function() {
          expect(textBox.Value).toBe("Two Rules");
          expect(textBox.IsEnabled).toBe(false);
        });
      });
    });
  });
})(Sitecore.Speak, describe, it, beforeEach, afterEach, expect);