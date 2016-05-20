(function (_sc) {
  describe("Given a MessageBar", function () {
    var messageBar = _sc.app.MessageBar;

    //--------------------------------------------------------------------------
    it("it should have an 'IsOpen' property to be 'false' by default", function () {
      expect(messageBar.IsOpen).toBe(false);
    });

    it("it should have a 'Severity' property set to '' by default", function () {
      expect(messageBar.Severity).toBe("");
    });

    //--------------------------------------------------------------------------
    describe("Adding the messages should change the cssClass of the head-message", function () {

      afterEach(function () {
        messageBar.reset();
      });

      describe("when I add a notification", function () {
        it("it should have a Severity property set to 'notification' ", function () {
          messageBar.add({ Type: "notification", Text: "dummy text", Actions: [], IsClosable: false });

          expect(messageBar.Severity).toBe("notification");
        });
      });

      describe("when I add a warning", function () {
        it("it should have a Severity property set to 'warning'", function () {
          messageBar.add({ Type: "warning", Text: "dummy text", Actions: [], IsClosable: false });

          expect(messageBar.Severity).toBe("warning");
        });
      });

      describe("when I add an error", function () {
        it("it should have a Severity property set to 'error'", function () {
          messageBar.add({ Type: "error", Text: "dummy text", Actions: [], IsClosable: false });

          expect(messageBar.Severity).toBe("error");
        });
      });





    });

    //--------------------------------------------------------------------------
    describe("Adding multiple message should display the MessageBar head", function () {
      afterEach(function () {
        messageBar.reset();

        messageBar.add({ Type: "notification", Text: "dummy text", Actions: [], IsClosable: false });

        expect(messageBar.el.querySelector(".sc-messageBar-head").offsetParent).not.toBeNull();
      });
      
    });
    
    //--------------------------------------------------------------------------
    describe("when adding a message", function () {
      afterEach(function () {
        messageBar.reset();
      });

      it("HasMessages should be true", function () {
        messageBar.add({ Text: "dummy text" });
        expect(messageBar.HasMessages).toBe(true);
      });

      describe("of type error", function () {
        it("HasErrorMessages should be true", function () {
          messageBar.add({ Type: "error", Text: "dummy text", Actions: [], IsClosable: false });
          expect(messageBar.HasErrorMessages).toBe(true);
        });
      });

      describe("of type warning", function () {
        it("HasWarningMessages should be true", function () {
          messageBar.add({ Type: "warning", Text: "dummy text", Actions: [], IsClosable: false });
          expect(messageBar.HasWarningMessages).toBe(true);
        });
      });

      describe("of type notification", function () {
        it("HasNotificationMessages should be true", function() {
          messageBar.add({ Type: "notification", Text: "dummy text", Actions: [], IsClosable: false });
          expect(messageBar.HasNotificationMessages).toBe(true);
        });
      });

      describe("when I remove all messages", function () {
        it("HasMessages should be false", function () {
          messageBar.add({ Type: "notification", Text: "dummy text", Actions: [], IsClosable: false });
          messageBar.reset();
          expect(messageBar.HasMessages).toBe(false);
        });
      });

    });
  });

})(Sitecore.Speak);
