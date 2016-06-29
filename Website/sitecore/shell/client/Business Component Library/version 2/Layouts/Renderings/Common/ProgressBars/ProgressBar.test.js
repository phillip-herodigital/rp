(function (_sc) {
  describe("Given a ProgressBar component", function () {
    var sut = _sc.app.ProgressBar,
        $sutEl = $(sut.el),
        testingValue = 88;

    it("component should exist", function () {
      expect(sut).toBeDefined();
    });
    it("component el should exist", function () {
      expect($sutEl).toBeDefined();
    });
    it("it should have a 'IsVisible' property, which is set to 'true' by default", function () {
      expect(sut.IsVisible).toBeDefined();
      expect(sut.IsVisible).toBe(true);
    });
    it("it should have a 'MaxValue' property, which is set to '100' by default", function () {
      expect(sut.MaxValue).toBeDefined();
      expect(sut.MaxValue).toBe(100);
    });
    it("it should have a 'UpdateInterval' property, which is set to '2000' by default", function () {
      expect(sut.UpdateInterval).toBeDefined();
      expect(sut.UpdateInterval).toBe('2000');
    });
    it("it should have a 'Value' property, which is set to 20 by default", function () {
      expect(sut.Value).toBeDefined();
      expect(sut.Value).toBe(20);
    });
    it("it should have a 'ShowLabel' property, which is set to 'false' by default", function () {
      expect(sut.ShowLabel).toBeDefined();
      expect(sut.ShowLabel).toBe(false);
    });

    it("it should have a change event listener on 'Value'", function () {
      expect(sut._events["change:Value"]).toBeDefined();
    });
    it("it should have a change event listener on 'MaxValue'", function () {
      expect(sut._events["change:MaxValue"]).toBeDefined();
    });

    it("it should have a change event listener on 'ShowLabel'", function () {
      expect(sut._events["change:ShowLabel"]).toBeDefined();
    });

    var sut2 = _sc.app.ProgressBar2;
    describe("When I set maxValue=200 and value=50", function () {
      it("it should set 'percentage' to '25'", function () {
        sut2.MaxValue = 200;
        sut2.Value = 50;
        expect(sut2.Percentage).toBe(25);
      });
      it("it should set 'value' to 'maxValue' if it is bigger", function () {
        sut2.MaxValue= 77;
        sut2.Value = 88;
        expect(sut2.Value).toBe(77);
      });
      it("it should set 'value' to '0' if smaller than 0", function () {
        sut2.Value = -50;
        expect(sut2.Value).toBe(0);
      });
    });

    describe("Given a progressBar called ProgressBar2", function() {
      it("fires an event 'intervalCompleted:ProgressBar2'", function () {
        var spyd = jasmine.createSpy('spy');
        _sc.on("intervalCompleted:ProgressBar2", spyd);
        console.log(spyd());
        expect(spyd).toHaveBeenCalled();
        _sc.off("intervalCompleted:ProgressBar2");
      });
    });

    describe("when I change the Value, it should change the bar", function (done) {
      it("should be reflected in the HTML", function (done) {
        sut.Value = testingValue;
        var $progressBar = $sutEl.find(".progress-bar");
       
        setTimeout(function () {
          var width = $progressBar.width();
          var parentWidth = $("body").width(); // this will return parent element's width which also can be replaced with docuent to get viewport width
          var percent = Math.round((100 * width / parentWidth));
         // console.log(percent);
          expect(percent).toEqual(testingValue);
          done();
        }, 1000);        
      });
    });
    describe("when I set showLabel to true", function () {
      it("should be reflected in the html", function () {
        sut.ShowLabel = true;
        expect($sutEl.find("span").html()).toEqual(testingValue + "%");
        expect($sutEl.find("span").css("display")).toEqual("block");
      });
    });
  });
})(Sitecore.Speak);