require(["jasmineEnv", "/-/speak/v1/business/datepicker.js"], function (jasmineEnv) {
  var setupTests = function (testAreaEl) {
    "use strict";

    describe("Given a DatePicker model", function () {
      var datePicker = new Sitecore.Definitions.Models.DatePicker();

      describe("when I create a DatePicker model", function () {
        it("it should have isVisible property", function () {
          expect(datePicker.get("isVisible")).toBeDefined();
        });

        it("it should set isVisible to true by default", function () {
          expect(datePicker.get("isVisible")).toBe(true);
        });
        
        it("it should have isEnabled property", function () {
          expect(datePicker.get("isEnabled")).toBeDefined();
        });

        it("it should set isEnabled to true by default", function () {
          expect(datePicker.get("isEnabled")).toBe(true);
        });
        
        it("it should have isReadOnly property", function () {
          expect(datePicker.get("isReadOnly")).toBeDefined();
        });

        it("it should set isReadOnly to false by default", function () {
          expect(datePicker.get("isReadOnly")).toBe(false);
        });
        
        it("it should have showOtherMonths property", function () {
          expect(datePicker.get("showOtherMonths")).toBeDefined();
        });

        it("it should set showOtherMonths to false by default", function () {
          expect(datePicker.get("showOtherMonths")).toBe(false);
        });
        
        it("it should have dateFormat property", function () {
          expect(datePicker.get("dateFormat")).toBeDefined();
        });

        it("it should set dateFormat to null by default", function () {
          expect(datePicker.get("dateFormat")).toBeNull();
        });
        
        it("it should have date property", function () {
          expect(datePicker.get("date")).toBeDefined();
        });

        it("it should set date to null by default", function () {
          expect(datePicker.get("date")).toBeNull();
        });
        
        it("it should have firstDay property", function () {
          expect(datePicker.get("firstDay")).toBeDefined();
        });

        it("it should set firstDay to 1 by default", function () {
          expect(datePicker.get("firstDay")).toBe(1);
        });

      });


      describe("Given a DatePicker Control", function () {
        var model1, model2,
            $element1, $element2,
            testAreaApp,
            app,
            appNumber = 0,
            nodeApp;

        beforeEach(function () {
          nodeApp = testAreaEl.clone(true);
          nodeApp.attr("id", testAreaEl.attr("id") + appNumber);

          nodeApp.appendTo($("body"));
          testAreaApp = _sc.Factories.createApp(testAreaEl.attr("id") + appNumber);
          appNumber++;

          model1 = testAreaApp.DatePickerTest1;
          model2 = testAreaApp.DatePickerTest2;

          $element1 = nodeApp.find('[data-sc-id="DatePickerTest1"]');
          $element2 = nodeApp.find('[data-sc-id="DatePickerTest2"]');

          app = testAreaApp;
        });

        afterEach(function () {
          nodeApp.hide();
        });

        it("it should create the control when I execute Run", function () {
          expect(app.DatePickerTest1).toBeDefined();
          expect(app.DatePickerTest2).toBeDefined();
          expect($(".ui-datepicker").hasClass("sc-datepicker-dropdown")).toBe(true);
        });

        it("it should have the viewModel to be defined inside the model", function () {
          expect(model1.viewModel).toBeDefined();
          expect(model2.viewModel).toBeDefined();
        });

        it("it should be disabled when I set isEnabled to false", function () {
          expect(model1.get("isEnabled")).toEqual(true);
          expect($element1.is(":disabled")).toEqual(false);
          model1.set("isEnabled", false);
          expect(model1.get("isEnabled")).toEqual(false);
          expect($element1.is(":disabled")).toEqual(true);
        });

        it("it shouldn't appear when I set isVisible property to false", function () {
          expect(model1.get("isVisible")).toEqual(true);
          expect($element1.is(":visible")).toEqual(true);
          model1.set("isVisible", false);
          expect($element1.is(":visible")).toEqual(false);
        });

        it("it should be isReadOnly when I set isReadOnly to true", function () {
          expect(model1.get("isReadOnly")).toEqual(false);
          expect($element1.is(":read-only")).toEqual(false);
          model1.set("isReadOnly", true);
          expect(model1.get("isReadOnly")).toEqual(true);
          expect($element1.is(":read-only")).toEqual(true);
        });

        it("it should change showOtherMonths property when I set it to true", function () {
          expect($element2.data("showothermonths")).toEqual(true);
          model2.set("showOtherMonths", false);
          expect(model2.get("showOtherMonths")).toEqual(false);
        });

        it("it should change firstDay property  when I set it to 1", function () {
          expect(model2.get("firstDay")).toEqual(3);
          model2.set("firstDay", 1);
          expect(model2.get("firstDay")).toEqual(1);
        });

        it("it should change date property  when I set it to 10/10/2013", function () {
          expect(model2.get("date")).toEqual("9/11/2010");
          model2.set("date", "10/10/2013");
          expect(model2.get("date")).toEqual("10/10/2013");
          expect($(".ui-datepicker").find('.ui-datepicker-current-day a').html()).toBe("10");
          expect($(".ui-datepicker").find('.ui-datepicker-year').html()).toBe("2013");
        });

        it("it should change dateFormat property  when I set it to dd-mm-yyyy", function () {
          expect(model2.get("dateFormat")).toEqual(null);
          model2.set("dateFormat", "dd-mm-yyyy");
          expect(model2.get("dateFormat")).toEqual("dd-mm-yyyy");
        });

        it("it should have the show method to be defined inside viewModel", function () {
          model1.viewModel.show();
          expect($(".ui-datepicker").is(":visible")).toEqual(true);
        });

        it("it should have the hide method to be defined inside viewModel", function () {
          model1.viewModel.show();
          model1.viewModel.hide();
          expect($(".ui-datepicker").is(":visible")).toEqual(false);
        });

        it("it should have the isDisabled method to be defined inside viewModel, which determines whether a date picker has been disabled", function () {
          expect(model1.viewModel.isDisabled()).toBe(false);
          expect(model2.viewModel.isDisabled()).toBe(false);
        });

        it("it should have the dialog method to be defined inside viewModel, which should open datepicker dialog window with date 1/1/2014 inside", function () {
          model1.viewModel.dialog("1/1/2014");
          expect($(".ui-datepicker").is(":visible")).toEqual(true);

          $element1.focus(); // hide input element generated by jquery ui
          model1.viewModel.hide();
          $(".ui-datepicker").hide();
        });

        it("it should have the getDate method to be defined inside viewModel, which should have year = 2010, day = 10, month = 8", function () {
          var date = new Date(model2.viewModel.getDate());
          expect(date).not.toBe(null);    
          expect(date.getFullYear()).toBe(2010);
          expect(date.getUTCDate()).toBe(10);
          expect(date.getMonth()).toBe(8);
        });
       
        it("it should have the setDate method to be defined inside viewModel, which should change year to 2014, day to 0, month to 0", function () {
          var date = new Date(model2.viewModel.getDate());
          expect(date).not.toBe(null);

          date.setFullYear(2014);
          date.setUTCDate(1);
          date.setMonth(1);

          expect(date.getFullYear()).toBe(2014);
          expect(date.getUTCDate()).toBe(1);
          expect(date.getMonth()).toBe(1);
          model2.viewModel.setDate("1/1/2014");
          expect(model2.viewModel.setDate("1/1/2014"));
        });
        
        it("it should have the widget method to be defined inside viewModel, which should return a jQuery object containing the datepicker", function () {
          var wg = model1.viewModel.widget();
          expect(wg.$el.hasClass("sc-datepicker")).toBe(true);
        });
        
        it("it should have the onSelect method, which should change date property", function () {
          var date = "01/01/2014";
          $element2.val(date);
          model2.viewModel.onSelect();
          expect($element2.val()).toBe(date);
        });
        
        
      });
    });
  };

  runTests(jasmineEnv, setupTests, "DatePicker.htm");
});


