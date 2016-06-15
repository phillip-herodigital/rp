(function (Speak) {

  require.config({
    paths: {
      scrollable: "/sitecore/shell/client/Business Component Library/version 2/Layouts/Renderings/Mixins/Scrollable",
      mock: "/sitecore/shell/client/Speak/Assets/lib/core/2.0/mock"
    }
  });

  define(["scrollable", "mock"], function (Scrollable) {

    // Create mock component for scrollable
    Speak.component(
      Speak.extend({}, Scrollable.prototype, {
        name: "ScrollableMock",
        presenter: "scComponentPresenter",
        initialize: function () {
          this.defineProperty("Height", 200);
          this.defineProperty("HasScroll", false);
          this.defineProperty("IsScrollTop", false);
          this.defineProperty("IsScrollNearTop", false);
          this.defineProperty("IsScrollBottom", false);
          this.defineProperty("IsScrollNearBottom", false);

          Scrollable.prototype.initialize.call(this);
        },
        initialized: function () {
          Scrollable.prototype.initialized.call(this);

          this.on("change:Height", function (value) {
            this.ScrollElement.style.height = value + "px";
          }, this);
        }
      })
    );

    describe("Given a Scrollable", function () {
      var sut, el;

      beforeEach(function () {

        el = document.createElement("div");
        el.style.overflowY = "scroll";
        el.style.height = "200px";
        el.innerHTML = '<div style="height: 800px"><div>';

        document.body.appendChild(el);

        var scrollableMock = speakMock("ScrollableMock", el);

        sut = scrollableMock.component;
        
        scrollableMock.run();
      });

      afterEach(function() {
        document.body.removeChild(el);
      });
      
      describe("Default scroll states", function () {
        it("IsScrollTop should be true", function () {
          expect(sut.IsScrollTop).toBe(true);
        });

        it("IsScrollNearTop should be true", function () {
          expect(sut.IsScrollNearTop).toBe(true);
        });

        it("IsScrollBottom should be false", function () {
          expect(sut.IsScrollBottom).toBe(false);
        });

        it("IsScrollNearBottom should be false", function () {
          expect(sut.IsScrollNearBottom).toBe(false);
        });

        it("HasScroll should be true", function () {
          expect(sut.HasScroll).toBe(true);
        });
      });

      describe("#scrollToBottom()", function () {
        beforeEach(function () {
          sut.el.scrollTop = 0;
          sut.scrollToBottom();
        });

        it("IsScrollTop should be false", function () {
          expect(sut.IsScrollTop).toBe(false);
        });

        it("IsScrollNearTop should be false", function () {
          expect(sut.IsScrollNearTop).toBe(false);
        });

        it("IsScrollBottom should be true", function () {
          expect(sut.IsScrollBottom).toBe(true);
        });

        it("IsScrollNearBottom should be true", function () {
          expect(sut.IsScrollNearBottom).toBe(true);
        });
      });

      describe("#scrollToTop()", function () {
        beforeEach(function () {
          sut.el.scrollTop = 1000;
          sut.scrollToTop();
        });

        it("IsScrollTop should be true", function () {
          expect(sut.IsScrollTop).toBe(true);
        });

        it("IsScrollNearTop should be true", function () {
          expect(sut.IsScrollNearTop).toBe(true);
        });

        it("IsScrollBottom should be false", function () {
          expect(sut.IsScrollBottom).toBe(false);
        });

        it("IsScrollNearBottom should be false", function () {
          expect(sut.IsScrollNearBottom).toBe(false);
        });
      });

      describe("#scrollTo()", function () {
        beforeEach(function () {
          sut.scrollTo(400);
        });

        it("IsScrollTop should be false", function () {
          expect(sut.IsScrollTop).toBe(false);
        });

        it("IsScrollNearTop should be false", function () {
          expect(sut.IsScrollNearTop).toBe(false);
        });

        it("IsScrollBottom should be false", function () {
          expect(sut.IsScrollBottom).toBe(false);
        });

        it("IsScrollNearBottom should be false", function () {
          expect(sut.IsScrollNearBottom).toBe(false);
        });
      });


      describe("When Height changes to be larger than content", function () {
        it("HasScroll should be false - NOTE: updates async", function (done) {
          sut.Height = 1200;

          setTimeout(function () {
            expect(sut.HasScroll).toBe(false);
            done();
          });
        });
      });

      describe("When Height changes to be smaller than content", function () {
        it("HasScroll should be true - NOTE: updates async", function (done) {      
          sut.Height = 200;

          setTimeout(function () {
            expect(sut.HasScroll).toBe(true);
            done();
          });
        });
      });
      
    });



  });

})(Sitecore.Speak);