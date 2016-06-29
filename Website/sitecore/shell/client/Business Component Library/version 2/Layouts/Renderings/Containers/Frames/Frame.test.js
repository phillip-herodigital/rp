(function(_sc) {
    describe("Given a Frame component", function() {
        var sut = _sc.app.Frame,
            $sutEl = $(sut.el);

        it("component should exist", function() {
            expect(sut).toBeDefined();
        });
        it("component el should exist", function() {
            expect($sutEl).toBeDefined();
        });
        it("component should have a IsVisible property", function() {
            expect(sut.IsVisible).toBeDefined();
        });
        it("component should have a IsVisible property to be 'true' by default", function() {
            expect(sut.IsVisible).toBe(true);
        });
        it("component should have a Height property", function() {
            expect(sut.Height).toBeDefined();
        });
        it("component should have a SourceUrl property", function() {
            expect(sut.SourceUrl).toBeDefined();
        });
        it("component should have an IsDeferred property", function() {
            expect(sut.IsDeferred).toBeDefined();
        });
        describe("when I change the SourceUrl property", function() {
            it("should change the url", function() {
                var testValue = "http://www.sitecore.net/About.aspx";
                sut.SourceUrl = testValue;
                expect($sutEl.attr("src")).toEqual(testValue);
            });
        });
        describe("when I change the height property", function() {
            it("should change height of the iFrame", function() {
                var testValue = "800";
                sut.Height = testValue;
                expect($sutEl.attr("height")).toEqual(testValue);
            });
        });
        describe("Given a Frame1 Control", function () {
            var frame1 = _sc.app.Frame1, $frame1 = $(frame1.el);

            it("it should set 'IsDeferred' as defined", function () {
                expect(frame1.IsDeferred).toBe(true);
            });
            it("it should set 'SourceUrl' as defined after the control is initialized", function () {
                expect(frame1.SourceUrl).toBe("http://sitecore.net/");
            });
            it("it should set the 'src' attribute to an empty string from the server when 'IsDeffered' set to 'true'", function () {
              expect(window.speakFrame1TestSrcInit).toBe("");
            });
        });
    });
})(Sitecore.Speak);