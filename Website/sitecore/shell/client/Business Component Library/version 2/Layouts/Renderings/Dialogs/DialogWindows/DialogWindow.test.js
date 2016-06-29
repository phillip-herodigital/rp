(function (_sc) {
  describe("Given a DialogWindow component", function () {
    var sut1 = _sc.app.DialogWindow1,
        $sutEl1 = sut1.$el;
    var sut2 = _sc.app.DialogWindow2,
        $sutEl2 = sut2.$el;
    var sut3 = _sc.app.DialogWindow3,
        $sutEl3 = sut3.$el;
    var sut4 = _sc.app.DialogWindow4,
        $sutEl4 = sut4.$el;
    var sut5 = _sc.app.DialogWindow5,
        $sutEl5 = sut5.$el;

    it("component should exist", function () {
      expect(sut1).toBeDefined();
    });
    it("component el should exist", function () {
      expect($sutEl1).toBeDefined();
    });
    it("component should have a IsVisible property", function () {
      expect(sut1.IsVisible).toBeDefined();
    });
    it("should have a text inside the dialog", function () {
      expect($sutEl1.find("[data-sc-id=Text]")).toBeDefined();
    });
    it("should have a Title header inside the dialog", function () {
      expect($sutEl1.find(".sc-dialogWindow-header-title").html()).toEqual("TestTitle");
    });
    describe("when show method is executed", function() {
      it("dialog should be visible", function() {
        expect($sutEl1.css("display")).toEqual("none");
        sut1.show();
        expect($sutEl1.css("display")).toEqual("block");
      });
    });
    describe("when hide method is executed", function() {
      it("dialogshould not be visible", function() {
        expect($sutEl1.css("display")).toEqual("block");
        sut1.hide();
        expect($sutEl1.css("display")).toEqual("none");
      });
    });
    describe("when show method is executed", function() {
      it("it should trigger show event", function() {
        // prepare
        var showHandler = jasmine.createSpy();
        sut1.on("show", showHandler);

        // act
        sut1.show();

        //assert
        expect(showHandler).toHaveBeenCalled();
      });
    });
    describe("when hide method is executed", function () {
      it("it should trigger show event", function () {
        // prepare
        var hideHandler = jasmine.createSpy();
        sut1.on("hide", hideHandler);

        // act
        sut1.hide();

        //assert
        expect(hideHandler).toHaveBeenCalled();        
      });
    });
    describe("after initialization", function () {
      it("it should calculate a dialog content height taking to account height of dialog header and height of dialog footer", function () {

        sut1.show();

        var headerHeight = $sutEl1.find(".sc-dialogWindow-header").outerHeight(),
          footerHeight = $sutEl1.find(".sc-dialogWindow-buttons").outerHeight(),
          contentHeight = $sutEl1.find(".sc-dialogWindow-body").outerHeight(),
          dialogHeight;

        dialogHeight = $sutEl1.attr("data-height");

        expect(dialogHeight*1).toEqual(contentHeight + headerHeight + footerHeight);
        $sutEl1.hide();
      });
    });
    describe("after initialization dialog with Small size", function () {
      it("it should has height 400 and width 640", function () {

        sut1.show();

        var contentHeight = $sutEl1.outerHeight(),
          contentWidth = $sutEl1.outerWidth();
        
        expect(contentHeight).toEqual(400);
        expect(contentWidth).toEqual(640);
        $sutEl1.hide();
      });
    });
    describe("after initialization dialog with Medium size", function () {
      it("it should has height 600 and width 950", function () {

        sut2.show();

        var contentHeight = $sutEl2.outerHeight(),
          contentWidth = $sutEl2.outerWidth();

        expect(contentHeight).toEqual(600);
        expect(contentWidth).toEqual(950);
        $sutEl2.hide();
      });
    });
    describe("after initialization dialog with Large size", function () {
      it("it should has height 758 and width 1200", function () {

        sut3.show();

        var contentHeight = $sutEl3.outerHeight(),
          contentWidth = $sutEl3.outerWidth();

        expect(contentHeight).toEqual(758);
        expect(contentWidth).toEqual(1200);
        $sutEl3.hide();
      });
    });
    describe("after initialization dialog with X-Large size", function () {
      it("it should has height 1010 and width 1600", function () {

        sut4.show();

        var contentHeight = $sutEl4.outerHeight(),
          contentWidth = $sutEl4.outerWidth();

        expect(contentHeight).toEqual(1010);
        expect(contentWidth).toEqual(1600);
        $sutEl4.hide();
      });
    });
    
    describe("when show event is triggered on model", function () {
      it("it should execute method 'show' on Dialog view which should execute method 'show' on bootstrap modal", function () {
        // prepare
        $sutEl1.modal = jasmine.createSpy();

        //act
        sut1.show();

        //assert
        expect($sutEl1.modal).toHaveBeenCalledWith('show');
      });
    });
    describe("when hide event is triggered on model", function () {
      it("it should execute method 'hide' on Dialog view which should execute method 'hide' on bootstrap modal", function () {
        // prepare
        $sutEl1.modal = jasmine.createSpy();

        //act
        sut1.hide();

        //assert
        expect($sutEl1.modal).toHaveBeenCalledWith('hide');
      });
    });
    describe("when toggle method is executed", function () {
      it("it should execute method 'toggle' on bootstrap modal", function () {
        // prepare
        $sutEl1.modal = jasmine.createSpy();

        //act
        sut1.toggle();

        //assert
        expect($sutEl1.modal).toHaveBeenCalledWith('toggle');
      });
    });
    describe("when loading method is executed", function () {
      it("it should execute method 'loading' on bootstrap modal", function () {
        // prepare
        $sutEl1.modal = jasmine.createSpy();

        //act
        sut1.loading();

        //assert
        expect($sutEl1.modal).toHaveBeenCalledWith('loading');
      });
    });
    describe("when toggle method is executed", function () {
      it("and dialog was hidden it should show dialog", function () {
        expect($sutEl2.css("display")).toEqual("none");
        sut2.toggle();
        expect($sutEl2.css("display")).toEqual("block");
      });
      it("and dialog was shown it should hide dialog", function () {
        expect($sutEl2.css("display")).toEqual("block");
        sut2.toggle();
        expect($sutEl2.css("display")).toEqual("none");
      });
    });
  });
})(Sitecore.Speak);