(function (_sc) {
  describe("Given a TabControl component", function () {
    var component1,
      component2,
      component3,
      component4,
      component5,
      component6,
      $element1,
      $element2,
      $element3,
      $element4,
      $element5,
      $element6,
      testAreaApp,
      items,
      initialLeft,
      cin;

    $(".sc-grid.row > div").eq("0").width("447");

    beforeEach(function () {
      testAreaApp = Sitecore.Speak.app;

      component1 = _sc.app.TabControl;
      component2 = _sc.app.TabControl1;
      component3 = _sc.app.TabControl2;
      component4 = _sc.app.TabControl3;
      component5 = _sc.app.TabControl4;
      component6 = _sc.app.TabControl5;
      $element1 = $(component1.el);
      $element2 = $(component2.el);
      $element3 = $(component3.el);
      $element4 = $(component4.el);
      $element5 = $(component5.el);
      $element6 = $(component6.el);

    });

    it("component should exist", function () {
      expect(component1).toBeDefined();
    });

    it("component el should exist", function () {
      expect($element1).toBeDefined();
    });

    it("component should have a IsVisible property", function () {
      expect(component1.IsVisible).toBeDefined();
    });

    it("component should have a IsVisible property to be 'true' by default", function () {
      expect(component1.IsVisible).toBe(true);
    });

    it("component should have a DisplayFieldName property", function () {
      expect(component1.DisplayFieldName).toBeDefined();
    });

    it("component should have a DisplayFieldName property to be 'Header' by default", function () {
      expect(component1.DisplayFieldName).toBe("Header");
    });

    it("component should have a ValueFieldName property", function () {
      expect(component1.ValueFieldName).toBeDefined();
    });

    it("component should have a ValueFieldName property to be 'itemId' by default", function () {
      expect(component1.ValueFieldName).toBe("$itemId");
    });

    it("component should have a SelectedItem property", function () {
      expect(component1.SelectedItem).toBeDefined();
    });

    it("component should have a TabMinWidth property", function () {
      expect(component1.TabMinWidth).toBeDefined();
    });
    it("component should have the TabMinWidth property to be as defined -'70px'", function () {
      expect(component1.TabMinWidth).toBe("70px");
    });
    /*
    TabVisualStyle is disabled for the runtime and made seerver-only
    it("component should have a TabVisualStyle property", function () {
      expect(component1.TabVisualStyle).toBeDefined();
    });

    it("component1 should have a TabVisualStyle property to be 'Normal'", function () {
      expect(component1.TabVisualStyle).toBe("Normal");
    });
    it("component2 should have a TabVisualStyle property to be 'SubTab'", function () {
      expect(component2.TabVisualStyle).toBe("SubTab");
    });
    it("component3 should have a TabVisualStyle property to be 'Progressive'", function () {
      expect(component3.TabVisualStyle).toBe("Progressive");
    });
    */
    it("component should have a SelectedValue property", function () {
      expect(component1.SelectedValue).toBeDefined();
    });

    it("component should have a SelectedValue to be '{A83D50EE-D984-429C-830A-755272491F32}'", function () {
      expect(component1.SelectedValue).toBe("{A83D50EE-D984-429C-830A-755272491F32}");
    });

    it("component should have a SelectedItem property", function () {
      expect(component1.SelectedItem).toBeDefined();
    });

    it("component1 should have a SelectedItem property to be the third item from the collection", function () {
      expect(component1.SelectedItem["itemId"]).toBe('{A83D50EE-D984-429C-830A-755272491F32}');
    });

    it("component1 Tab1 content should be rendered", function (done) {
      cin = setInterval(function () {
        if (testAreaApp.Tab1Text) {
          expect(testAreaApp.Tab1Text).toBeDefined();
          clearInterval(cin);
          cin = 0;
          done();
        }
      }, 500);
    });

    afterEach(function () {
      if (cin)
        clearInterval(cin);
    });
    
    describe("should be rendered properly:", function () {
      it("element1 should have main wrapper with appropriate classes", function () {
        expect($element1.hasClass('sc-tab-control')).toBe(true);
        expect($element1.hasClass('sc-tab-control-normal')).toBe(true);
      });
      it("element2 should have main wrapper with 'sc-tab-control-subtab' class", function () {
        expect($element2.hasClass('sc-tab-control')).toBe(true);
        expect($element2.hasClass('sc-tab-control-subtab')).toBe(true);
      });
      it("element3 should have main wrapper with 'sc-tab-control-progressive' class", function () {
        expect($element3.hasClass('sc-tab-control')).toBe(true);
        expect($element3.hasClass('sc-tab-control-progressive')).toBe(true);
      });
      it("element1 should have 4 tabs inside", function () {
        expect($element1.find('.sc-tab-control-tab-item').length).toBe(4);
      });
      it("element2 should have 4 tabs inside", function () {
        expect($element2.find('.sc-tab-control-tab-item').length).toBe(4);
      });
      it("element3 should have 4 tabs inside", function () {
        expect($element3.find('.sc-tab-control-tab-item').length).toBe(4);
      });
      it("element1 should have 2 arrows inside", function () {
        expect($element1.find('.sc-tab-control-button-left').length).toBe(1);
        expect($element1.find('.sc-tab-control-button-right').length).toBe(1);
      });
      it("element1 should have 3 tabs content to be hidden", function () {
        expect($element1.find('.sc-tab-control-content:hidden').length).toBe(3);
      });
      it("element1 should have 1 tab content to be visible", function () {
        expect($element1.find('.sc-tab-control-content:visible').length).toBe(1);
      });
      it("element2 should have 2 tabs content rendered", function () {
        var emptyNodes = 0;

        $.each($element2.find('.sc-tab-control-content'), function (i, e) {
          if ($(e).has("*").length > 0) {
            emptyNodes++;
          }
        });
        expect(emptyNodes).toBe(2);
      });
      it("element1 should have third tab to have 'selected' class", function () {
        expect($element1.find('.sc-tab-control-tab-item').eq("2").hasClass("selected")).toBe(true);
      });      
      it("Tabcontrol should have disabled tab", function () {
        expect(component3.DynamicData[1].IsDisabled === "1").toBe(true);
        expect($element3.find('.sc-tab-control-tab-item').eq("1").hasClass("disabled")).toBe(true);
      });
      it("Tabcontrol tabs should have tooltip", function () {
        expect(component4.DynamicData[3].Tooltip === "Tab4").toBe(true);
        expect($element4.find('.sc-tab-control-tab-item > a').eq("3").attr("title") === "Tab4").toBe(true);
      });
      it("Tabcontrol should display selected and disabled properly", function () {
        expect(component3.DynamicData[1].IsDisabled === "1").toBe(true);
        expect($element3.find('.sc-tab-control-tab-item').eq("1").hasClass("disabled")).toBe(true);
        expect($element3.find('.sc-tab-control-tab-item').eq("1").hasClass("selected")).toBe(true);
        expect($element3.find('.sc-tab-control-content-disabled').hasClass("selected")).toBe(true);
      });

      describe("when LazyLoad is true for one of the tabs", function () {
        var _inter;
        it("element1 should have 3 tabs content rendered", function (done) {
          _inter = setInterval(function () {
            var emptyNodes = 0;

            $.each($element1.find('.sc-tab-control-content'), function (i, e) {
              if ($(e).has("*").length > 0) {
                emptyNodes++;
              }
            });
            
            if (emptyNodes === 3) {
              expect(emptyNodes).toBe(3);
              done();
            }
          }, 500);
          
        });

        it("component2 should load the content of the Tab3 LazyLoaded content when it's clicked", function (done) {
          $element2.find(".sc-tab-control-tab-item").eq(2).click(); //check that first tab text is rendered
          _inter = setInterval(function () {
            expect(component2.SelectedItem["itemId"]).toBe('{A83D50EE-D984-429C-830A-755272491F32}');
            if ($element2.find(".sc-tab-control-content.selected").find("[data-sc-id='Tab3LazyText']").length === 1) {
              expect($element2.find(".sc-tab-control-content.selected").find("[data-sc-id='Tab3LazyText']").length).toBe(1);
              expect($element2.find(".sc-tab-control-content.selected").find("[data-sc-id='Tab3LazyText']").text()).toBe("Tab 3 lazy loaded content");
              done();
            }
          }, 500);

        });

        afterEach(function() {
          clearInterval(_inter);
        });

      });
      
      describe("when tab becomes disabled", function () {
        it("tab should change disabled state", function () {
          expect(component4.DynamicData[0].IsDisabled === "1").toBe(false);
          component4.toggleEnabledAt(0);
          expect(component4.DynamicData[0].IsDisabled === "1").toBe(true);
          expect($element4.find('.sc-tab-control-tab-item').eq("0").hasClass("disabled")).toBe(true);
        });
        it("selected tab should change disabled state and render it properly", function (done) {
          expect(component4.DynamicData[3].IsDisabled === "1").toBe(false);
          component4.once("change:SelectedItem", function () {
            expect(component4.SelectedItem["itemId"]).toBe('{47A407C3-9948-4256-9974-7B2337B749BA}');
            expect(component4.DynamicData[3].IsDisabled === "1").toBe(false);
            component4.toggleEnabledAt(3);
            expect(component4.DynamicData[3].IsDisabled === "1").toBe(true);
            expect($element4.find('.sc-tab-control-tab-item').eq("3").hasClass("disabled")).toBe(true);
            expect($element4.find('.sc-tab-control-tab-item').eq("3").hasClass("selected")).toBe(true);
            expect($element4.find('.sc-tab-control-content-disabled').hasClass("selected")).toBe(true);
            expect($element4.find('.sc-tab-control-content-wrap > div').eq("3").hasClass("selected")).toBe(false);
            done();
          });
          component4.selectAt(3);
        });
      });
      
      describe("when tab becomes enabled", function () {
        it("tab should change disabled state", function () {
          expect(component4.DynamicData[0].IsDisabled === "1").toBe(true);
          component4.toggleEnabledAt(0);
          expect(component4.DynamicData[0].IsDisabled === "1").toBe(false);
          expect($element4.find('.sc-tab-control-tab-item').eq("0").hasClass("disabled")).toBe(false);
        });
        it("selected tab should change disabled state and render it properly", function (done) {
          expect(component4.DynamicData[3].IsDisabled === "1").toBe(true);
          component4.once("change:SelectedItem", function () {
            expect(component4.SelectedItem["itemId"] === '{47A407C3-9948-4256-9974-7B2337B749BA}').toBe(false);
            component4.once("change:SelectedItem", function () {
              expect(component4.SelectedItem["itemId"]).toBe('{47A407C3-9948-4256-9974-7B2337B749BA}');
              expect(component4.DynamicData[3].IsDisabled === "1").toBe(true);
              component4.toggleEnabledAt(3);
              expect(component4.DynamicData[3].IsDisabled === "1").toBe(false);
              expect($element4.find('.sc-tab-control-tab-item').eq("3").hasClass("disabled")).toBe(false);
              expect($element4.find('.sc-tab-control-tab-item').eq("3").hasClass("selected")).toBe(true);
              expect($element4.find('.sc-tab-control-content-disabled').hasClass("selected")).toBe(false);
              expect($element4.find('.sc-tab-control-content-wrap > div').eq("3").hasClass("selected")).toBe(true);
              done();
            });
            component4.selectAt(3);
          });
          component4.selectAt(2);
        });
      });

      describe("when disabled tab clicked", function() {
        it("tab shouldn't become selected", function (done) {
          expect(component4.SelectedItem["itemId"] === '{F3B84F75-AC17-4364-BBF0-D3A7F2CAFE71}').toBe(false);
          $element4.find(".sc-tab-control-tab-item").eq(1).click();
          setTimeout(function () {
            expect(component4.SelectedItem["itemId"] === '{F3B84F75-AC17-4364-BBF0-D3A7F2CAFE71}').toBe(false);
            done();
          },0);
        });
      });

      describe("when scroll arrows clicked", function () {
        describe("right arrow clicked 2 times", function () {
          it("tabs shouldn't scroll", function (done) {
            initialLeft = $element5.find(".sc-tab-control-nav").offset().left;
            $element5.find(".sc-tab-control-button-right").click();
            $element5.find(".sc-tab-control-button-right").click();
            setTimeout(function() {
              expect($element5.find(".sc-tab-control-nav").offset().left).toBe(initialLeft);
              done();
            }, 1000);
          });
        });
        describe("left arrow clicked 3 times", function () {
          it("tabs should scroll to the first tab", function (done) {
            $element5.find(".sc-tab-control-button-left").click();
            $element5.find(".sc-tab-control-button-left").click();
            $element5.find(".sc-tab-control-button-left").click();
            setTimeout(function() {
              expect($element5.find(".sc-tab-control-nav").offset().left + $element5.offset().left).toBe(30);
              done();
            }, 1000);
          });
        });
        describe("right arrow clicked 5 times", function () {
          it("tabs should scroll to initial position", function (done) {
            $element5.find(".sc-tab-control-button-right").click();
            $element5.find(".sc-tab-control-button-right").click();
            $element5.find(".sc-tab-control-button-right").click();
            $element5.find(".sc-tab-control-button-right").click();
            $element5.find(".sc-tab-control-button-right").click();
            setTimeout(function() {
              expect($element5.find(".sc-tab-control-nav").offset().left).toBe(-185);
              done();
            }, 1000);
          });
        });
      });

    });

    describe("should affect the URL:", function() {
        it(" should change URL when the tab has the appropriate QueryParameter value set and the tab is selected", function(done) {
          expect(window.location.search.indexOf("TabControl5")).toBe(-1);
          $element6.find(".sc-tab-control-tab-item").eq(2).click();
          setTimeout(function () {
            expect(window.location.search.indexOf("TabControl5=tab3")).toBeGreaterThan(0);
            done();
          }, 1000);
        });
        /*it(" should change the selectedItem when the URL is changed", function (done) {
          var urlQuery = window.location.search.replace("TabControl5=tab3", "TabControl5=tab4");
          history.pushState("", "", urlQuery);
          setTimeout(function () {
            expect(_sc.app.TabControl5.SelectedValue).toBe("{47A407C3-9948-4256-9974-7B2337B749BA}");
            done();
          }, 1000);
        });*/
      }
    );


  });

  describe("Given a TabControl component with one lazy tab and two immediate tabs", function() {
    var component = _sc.app.TabControlTabControlSubPages;

    describe("when a lazy tab is selected by default", function() {
      it("load of the lazy tab should be triggered immediately", function() {
        expect(_sc.app.Button1TabControlSubPages.Text).toBe("first tab");
      });

      it("both immediate tabs should be loaded", function() {
        expect(_sc.app.SubAppRenderer1TabControlSubPages.Button2TabControlSubPages).toBeDefined();
        expect(_sc.app.Text2TabControlSubPages).toBeDefined();
      });

      describe("when one of the immediate tabs has SubAppRenderer with SubPageCode", function() {
        it("the SubPageCode should be executed only for SubAppRenderer content", function() {
          expect(_sc.app.SubAppRenderer1TabControlSubPages.Button2TabControlSubPages.Text).toBe("changed by sub page code");
          expect(_sc.app.Text2TabControlSubPages.Text).toBe("tab 3");
        });
      });
    });
  });
})(Sitecore.Speak);