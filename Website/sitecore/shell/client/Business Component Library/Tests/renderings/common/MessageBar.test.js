/*global define, it, console, expect, describe*/
/// <reference path="~/sitecore/shell/client/test/vendors/jasmine-standalone-1.0.0/jasmine.js" />
/// <reference path="../../vendors/jasmine-standalone-1.0.0/jasmine-html.js" />
/// <reference path="../../jasmine.ui.runner.test.js" />
/// <reference path="../../../Sitecore/Repository/Layouts/Renderings/Common/MessageBars/MessageBar.js" />
require(["jasmineEnv", "/-/speak/v1/business/MessageBar.js"], function (jasmineEnv) {
  var setupTests = function (testAreaEl) {
    "use strict";

    describe("Given a messageBar model", function () {
      var messageBar = new Sitecore.Definitions.Models.MessageBar();

      //--------------------------------------------------------------------------
      describe("when I create a messageBar model", function () {
        it("it should have an errors array which holds the errors", function () {
          expect(messageBar.get("errors")).toBeDefined();
        });

        it("it should have a warnings array which holds the warnings", function () {
          expect(messageBar.get("warnings")).toBeDefined();
        });

        it("it should have a notifications array which holds the notifications", function () {
          expect(messageBar.get("notifications")).toBeDefined();
        });

        it("it should have an 'expanded' property to be defined", function () {
          expect(messageBar.get("expanded")).toBeDefined();
        });

        it("it should have an expanded property to be 'false' by default", function () {
          expect(messageBar.get("expanded")).toBe(false);
        });

        it("it should have an 'topMessageClass' property to be defined", function () {
          expect(messageBar.get("topMessageClass")).toBeDefined();
        });

        it("it should have an 'topMessageClass' property to be 'sc-messageBar-head' by default", function () {
          expect(messageBar.get("topMessageClass")).toBe("sc-messageBar-head");
        });

        it("it should have an 'headText' property to be defined", function () {
          expect(messageBar.get("topMessageClass")).toBeDefined();
        });

        it("it should have an 'headText' property to be an empty by default", function () {
          expect(messageBar.get("headText")).toBe("");
        });
      });

      //--------------------------------------------------------------------------
      describe("Adding the messages to the appropriate arrays should cange the cssClass of the head-message", function () {

        afterEach(function () {
          messageBar.viewModel.errors.removeAll();
          messageBar.viewModel.warnings.removeAll();
          messageBar.viewModel.notifications.removeAll();
        });

        describe("when I add an error", function () {
          it("it should assign 'sc-messageBar-head' to the 'topMessageClass' property ", function () {
            messageBar.viewModel.errors.push({ text: "dummy text", actions: [], closable: false });
            expect(messageBar.get("topMessageClass")).toBe("sc-messageBar-head");
          });
        });

        describe("when I add a warning", function () {
          it("it should assign 'sc-messageBar-head' to the 'topMessageClass' property ", function () {
            messageBar.viewModel.warnings.push({ text: "dummy text", actions: [], closable: false });
            expect(messageBar.get("topMessageClass")).toBe("sc-messageBar-head");
          });
        });

        describe("when I add a notification", function () {
          it("it should assign 'sc-messageBar-head' to the 'topMessageClass' property ", function () {
            messageBar.viewModel.notifications.push({ text: "dummy text", actions: [], closable: false });
            expect(messageBar.get("topMessageClass")).toBe("sc-messageBar-head");
          });
        });

        describe("when I add a notification and an error", function () {
          it("it should assign 'alert alert-error' to the 'topMessageClass' property ", function () {
            messageBar.viewModel.errors.push({ text: "dummy text", actions: [], closable: false });
            messageBar.viewModel.notifications.push({ text: "dummy text", actions: [], closable: false });
            expect(messageBar.get("topMessageClass")).toBe("sc-messageBar-head alert alert-error");
          });
        });

        describe("when I add a notification and a warning", function () {
          it("it should assign 'alert' to the 'topMessageClass' property ", function () {
            messageBar.viewModel.warnings.push({ text: "dummy text", actions: [], closable: false });
            messageBar.viewModel.notifications.push({ text: "dummy text", actions: [], closable: false });
            expect(messageBar.get("topMessageClass")).toBe("sc-messageBar-head alert");
          });
        });

        describe("when I add a warning and an error", function () {
          it("it should assign 'alert' to the 'topMessageClass' property ", function () {
            messageBar.viewModel.warnings.push({ text: "dummy text", actions: [], closable: false });
            messageBar.viewModel.errors.push({ text: "dummy text", actions: [], closable: false });
            expect(messageBar.get("topMessageClass")).toBe("sc-messageBar-head alert alert-error");
          });
        });
      });

      //--------------------------------------------------------------------------
      describe("Adding the messages to the appropriate arrays should change the Text of the head-message", function () {
        afterEach(function () {
          messageBar.viewModel.errors.removeAll();
          messageBar.viewModel.warnings.removeAll();
          messageBar.viewModel.notifications.removeAll();
        });

        describe("when I add an error", function () {
          it("it should not change headText, it should be empty ", function () {
            messageBar.viewModel.errors.push({ text: "dummy text", actions: [], closable: false });
            expect(messageBar.get("headText")).toBe("");
          });
        });

        describe("when I add a warning", function () {
          it("it should not change headText, it should be empty ", function () {
            messageBar.viewModel.warnings.push({ text: "dummy text", actions: [], closable: false });
            expect(messageBar.get("headText")).toBe("");
          });
        });

        describe("when I add a notification", function () {
          it("it should not change headText, it should be empty ", function () {
            messageBar.viewModel.notifications.push({ text: "dummy text", actions: [], closable: false });
            expect(messageBar.get("headText")).toBe("");
          });
        });

        describe("when I add 2 errors", function () {
          it("it should change headText to 'You have few errors' ", function () {
            messageBar.viewModel.errors.push({ text: "dummy text", actions: [], closable: false });
            messageBar.viewModel.errors.push({ text: "dummy text", actions: [], closable: false });
            expect(messageBar.get("headText")).toBe("You have few errors");
          });
        });

        describe("when I add 2 warnings", function () {
          it("it should change headText to 'You have few warnings' ", function () {
            messageBar.viewModel.warnings.push({ text: "dummy text", actions: [], closable: false });
            messageBar.viewModel.warnings.push({ text: "dummy text", actions: [], closable: false });
            expect(messageBar.get("headText")).toBe("You have few warnings");
          });
        });

        describe("when I add 2 notifications", function () {
          it("it should change headText to 'You have few notifications' ", function () {
            messageBar.viewModel.notifications.push({ text: "dummy text", actions: [], closable: false });
            messageBar.viewModel.notifications.push({ text: "dummy text", actions: [], closable: false });
            expect(messageBar.get("headText")).toBe("You have few notifications");
          });
        });

        describe("when I add an errors and warning", function () {
          it("it should change headText to 'You have few errors, warnings' ", function () {
            messageBar.viewModel.errors.push({ text: "dummy text", actions: [], closable: false });
            messageBar.viewModel.warnings.push({ text: "dummy text", actions: [], closable: false });
            expect(messageBar.get("headText")).toBe("You have few errors, warnings");
          });
        });

        describe("when I add an errors and notification", function () {
          it("it should change headText to 'You have few errors, notifications' ", function () {
            messageBar.viewModel.errors.push({ text: "dummy text", actions: [], closable: false });
            messageBar.viewModel.notifications.push({ text: "dummy text", actions: [], closable: false });
            expect(messageBar.get("headText")).toBe("You have few errors, notifications");
          });
        });

        describe("when I add a warning and notification", function () {
          it("it should change headText to 'You have few errors, warnings' ", function () {
            messageBar.viewModel.notifications.push({ text: "dummy text", actions: [], closable: false });
            messageBar.viewModel.warnings.push({ text: "dummy text", actions: [], closable: false });
            expect(messageBar.get("headText")).toBe("You have few warnings, notifications");
          });
        });

        describe("when I add an errors, warning and notification", function () {
          it("it should change headText to 'You have few errors, warnings, notifications' ", function () {
            messageBar.viewModel.errors.push({ text: "dummy text", actions: [], closable: false });
            messageBar.viewModel.warnings.push({ text: "dummy text", actions: [], closable: false });
            messageBar.viewModel.notifications.push({ text: "dummy text", actions: [], closable: false });
            expect(messageBar.get("headText")).toBe("You have few errors, warnings, notifications");
          });
        });
      });
      //--------------------------------------------------------------------------
      describe("Removing the messages with removeMessage method", function () {
        beforeEach(function () {
          messageBar.addMessage("error", "Error Message");
          messageBar.addMessage("warning", "Warning Message");
          messageBar.addMessage("notification", "Notification Message");
        });
        afterEach(function () {
          messageBar.viewModel.errors.removeAll();
          messageBar.viewModel.warnings.removeAll();
          messageBar.viewModel.notifications.removeAll();
        });
        describe("when I execute method with wrong params", function () {
          it("it should throw an exception", function () {
            expect(function () {
              messageBar.removeMessage();
            }).toThrow();
            expect(function () {
              messageBar.removeMessage("error");
            }).toThrow();
            expect(function () {
              messageBar.removeMessage([1, 2, 2]);
            }).toThrow();
          });

        });

        describe("when I pass a testing function to provide delete logic", function () {
          var testEFunc = function (msg) {
            return msg["text"].indexOf("Error") != -1;
          },
            testWFunc = function (msg) {
              return msg["text"].indexOf("Warning") != -1;
            },
            testNFunc = function (msg) {
              return msg["text"].indexOf("Notification") != -1;
            };

          it("testEFunc it should delete the error", function () {
            expect(messageBar.get("errors").length).toBe(1);
            messageBar.removeMessage(testEFunc);
            expect(messageBar.get("errors").length).toBe(0);
          });
          it("testWFunc it should delete the warning", function () {
            expect(messageBar.get("warnings").length).toBe(1);
            messageBar.removeMessage(testWFunc);
            expect(messageBar.get("warnings").length).toBe(0);
          });
          it("testNFunc it should delete the notification", function () {
            expect(messageBar.get("notifications").length).toBe(1);
            messageBar.removeMessage(testNFunc);
            expect(messageBar.get("notifications").length).toBe(0);
          });

          it("testEFunc it should delete the error and return deleted item", function () {
            var deleted = messageBar.removeMessage(testEFunc);
            expect(deleted.length).toBe(1);
            expect(deleted[0]["text"]).toBe("Error Message");
          });
          it("testWFunc it should delete the warning and return deleted item", function () {
            var deleted = messageBar.removeMessage(testWFunc);
            expect(deleted.length).toBe(1);
            expect(deleted[0]["text"]).toBe("Warning Message");
          });
          it("testNFunc it should delete the notification and return deleted item", function () {
            var deleted = messageBar.removeMessage(testNFunc);
            expect(deleted.length).toBe(1);
            expect(deleted[0]["text"]).toBe("Notification Message");
          });
        });
      });
      //--------------------------------------------------------------------------
      describe("Removing the messages with removeError, removeWarning and removeNotification method", function () {
        var testEFunc = function (msg) {
          return msg["text"].indexOf("Error") != -1;
        },
          testWFunc = function (msg) {
            return msg["text"].indexOf("Warning") != -1;
          },
          testNFunc = function (msg) {
            return msg["text"].indexOf("Notification") != -1;
          };
        beforeEach(function () {
          messageBar.addMessage("error", "Error Message");
          messageBar.addMessage("warning", "Warning Message");
          messageBar.addMessage("notification", "Notification Message");
        });
        afterEach(function () {
          messageBar.viewModel.errors.removeAll();
          messageBar.viewModel.warnings.removeAll();
          messageBar.viewModel.notifications.removeAll();
        });

        it("removeError(testEFunc) - it should delete the error", function () {
          expect(messageBar.get("errors").length).toBe(1);
          messageBar.removeError(testEFunc);
          expect(messageBar.get("errors").length).toBe(0);
        });

        it("removeError(testEFunc) - it should delete the error and return deleted item", function () {
          var deleted = messageBar.removeError(testEFunc);
          expect(deleted.length).toBe(1);
          expect(deleted[0]["text"]).toBe("Error Message");
        });

        it("removeWarning(testWFunc) - it should delete the warning", function () {
          expect(messageBar.get("warnings").length).toBe(1);
          messageBar.removeWarning(testWFunc);
          expect(messageBar.get("warnings").length).toBe(0);
        });

        it("removeWarning(testWFunc) - it should delete the warning and return deleted item", function () {
          var deleted = messageBar.removeWarning(testWFunc);
          expect(deleted.length).toBe(1);
          expect(deleted[0]["text"]).toBe("Warning Message");
        });

        it("removeNotification(testNFunc) - it should delete the notification", function () {
          expect(messageBar.get("notifications").length).toBe(1);
          messageBar.removeNotification(testNFunc);
          expect(messageBar.get("notifications").length).toBe(0);
        });

        it("removeWarning(testWFunc) - it should delete the warning and return deleted item", function () {
          var deleted = messageBar.removeNotification(testNFunc);
          expect(deleted.length).toBe(1);
          expect(deleted[0]["text"]).toBe("Notification Message");
        });
      });

      //--------------------------------------------------------------------------
      describe("Adding the messages with addMessage method", function () {
        afterEach(function () {
          messageBar.viewModel.errors.removeAll();
          messageBar.viewModel.warnings.removeAll();
          messageBar.viewModel.notifications.removeAll();
        });

        describe("when I add a message with wrong params", function () {
          it("it should throw an exception", function () {
            expect(function () {
              messageBar.addMessage({ text: "dummy text", actions: [], closable: false });
            }).toThrow();
            expect(function () {
              messageBar.addMessage("error");
            }).toThrow();
            expect(function () {
              messageBar.addMessage();
            }).toThrow();
          });

        });
        describe("when I add a message as an object", function () {
          it("it should affect on the appropriate arrays", function () {
            messageBar.addMessage("error", { text: "dummy text", actions: [], closable: false });
            expect(messageBar.get("errors").length).toBe(1);

            messageBar.addMessage("warning", { text: "dummy text", actions: [], closable: false });
            expect(messageBar.get("warnings").length).toBe(1);

            messageBar.addMessage("notification", { text: "dummy text", actions: [], closable: false });
            expect(messageBar.get("notifications").length).toBe(1);
          });
        });

        describe("when I add a message as string", function () {
          it("it should affect on the appropriate arrays", function () {
            messageBar.addMessage("error", "dummy text");
            //expect(messageBar.get("errors")().length).toBe(1);
            messageBar.addMessage("error", "dummy text2");
            expect(messageBar.get("errors").length).toBe(2);

            messageBar.addMessage("warning", "dummy text");
            expect(messageBar.get("warnings").length).toBe(1);

            messageBar.addMessage("notification", "dummy text");
            expect(messageBar.get("notifications").length).toBe(1);
          });
        });

        describe("when I add an error", function () {
          it("it should change errors collection", function () {
            messageBar.addMessage("error", { text: "dummy text", actions: [], closable: false });
            expect(messageBar.get("errors").length).toBe(1);
          });
          
          it("it should have property hasErrorMessages=true", function () {            
            expect(messageBar.get("hasErrorMessages")).toBe(true);
          });
          it("it should have property hasMessages=true", function () {
            expect(messageBar.get("hasMessages")).toBe(true);
          });
        });
        describe("when I add a warning", function () {
          it("it should change warnings collection", function () {
            messageBar.addMessage("warning", { text: "dummy text", actions: [], closable: false });
            expect(messageBar.get("warnings").length).toBe(1);
          });
          it("it should have property hasWarningMessages=true", function () {
            expect(messageBar.get("hasWarningMessages")).toBe(true);
          });
          it("it should have property hasMessages=true", function () {
            expect(messageBar.get("hasMessages")).toBe(true);
          });
        });
        describe("when I add a notification", function () {
          it("it should change notifications collection", function () {
            messageBar.addMessage("notification", { text: "dummy text", actions: [], closable: false });
            expect(messageBar.get("notifications").length).toBe(1);
          });
          it("it should have property hasNotificationMessages=true", function () {
            expect(messageBar.get("hasNotificationMessages")).toBe(true);
          });
          it("it should have property hasMessages=true", function () {
            expect(messageBar.get("hasMessages")).toBe(true);
          });
        });
        describe("when I remove all messages", function () {        
          it("it should have property hasMessages=false", function () {
            messageBar.removeMessages();
            expect(messageBar.get("hasMessages")).toBe(false);
          });
        });
      });
    });

    describe("Given a MessageBar Control", function () {
      var model;
      var $element;

      it("it should create the Control when I execute Run", function () {
        var testArea = _sc.Factories.createApp(testAreaEl.attr("id"));
        expect(testArea.MessageBarTest).toBeDefined();
        model = testArea.MessageBarTest;
        $element = testAreaEl.find(".sc-messageBar");
      });

      it("it should not appear when I set the isVisible property", function () {
        var value = false;
        expect($element.is(":visible")).toEqual(!value);
        model.set("isVisible", value);
        expect(model.get("isVisible")).toEqual(value);
        expect($element.is(":visible")).toEqual(value);
      });

    });
  };

  runTests(jasmineEnv, setupTests, "MessageBar.htm");
});