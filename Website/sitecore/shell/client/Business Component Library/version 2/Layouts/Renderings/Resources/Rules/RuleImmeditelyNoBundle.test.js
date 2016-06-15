require.config({
  paths: {
    testUtil: "/sitecore/shell/client/Business Component Library/version 2/Test/TestUtil"
  }
});

define(["testUtil"], function(testUtil) {
  describe("Given a SPEAK page with several Rule components (LoadMode: Immediately, UseBundle: false)", function() {
    var app = Sitecore.Speak.app;
    var button = app.Button1;

    afterEach(function() {
      button.Text = "Run Rule";
      button.IsEnabled = true;
    });

    describe("given the rule component listens to button click", function() {
      describe("when the button is clicked", function() {
        beforeEach(function(done) {
          button.once("change:IsEnabled", done);
          testUtil.smartClick($(button.el));
        });

        it("the rule should be executed", function() {
          expect(button.Text).toBe("Done");
          expect(button.IsEnabled).toBe(false);
        });
      });
    });

    describe("given the rule component listens to app event", function() {
      describe("when the event is triggered for app", function() {
        beforeEach(function(done) {
          button.once("change:IsEnabled", done);
          app.trigger("GoGoGo");
        });

        it("the rule should be executed", function() {
          expect(button.Text).toBe("Done");
          expect(button.IsEnabled).toBe(false);
        });
      });
    });
  });
});