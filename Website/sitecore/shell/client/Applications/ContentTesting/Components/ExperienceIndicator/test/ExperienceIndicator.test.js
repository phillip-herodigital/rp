
var arResComponents;
if (window.location.host && window.location.host != '') // launching when address to web-page
  arResComponents = ["sitecore", "ExperienceIndicator", "css!ExperienceIndicator"];
else // launching of the code-coverage estemating
  arResComponents = ["sitecore"];

define(arResComponents, function (_sc) {

  describe("ExperienceIndicator testing|", function () {
   
    var setupTests = function ($pageElem) {

      // Testing Parameters
      var TestParameters = {
        getTestGroups: function () {
          var groups = [{
            name: 'name111', items: [
              { NoData: true, guid: "0", isWinner: false, legendIndex: 0, legendIndex2: 1, title: "Experience 1", value: 0, valuePerc: 10, valuePerc2: 20 },
              { NoData: false, guid: "1", isWinner: false, legendIndex: 1, legendIndex2: 0, title: "Experience 2", value: 0, valuePerc: 30, valuePerc2: 40 }, ],
          }];

          return groups;
        },

        getSelectedItem: function () {
          var selectedItem = { guid: "1" };
          return selectedItem;
        },
      };

      var expIndicatorModel = new _sc.Definitions.Models.ExperienceIndicator();

      var expIndicatorProto = _sc.Definitions.Views.ExperienceIndicator.prototype;

      $elem = $pageElem.find(".scExp-dvExperienceList");

      expIndicatorProto.$el = $elem;
      expIndicatorProto.model = expIndicatorModel;

      try {
        expIndicatorProto.initialize({});
      }
      catch (e) {

      }

      describe("Initialization|", function () {

        it("'$elem' must be defined|", function () {
          expect($elem.length).toBeGreaterThan(0);
        });

      });

      describe("Populating and rendering|", function () {

        var groups = TestParameters.getTestGroups();
        expIndicatorProto.model.set("items", groups);

        // legend items
        expIndicatorProto.model.set("IsLegendVisible", false);
        expIndicatorProto.model.set("LegendItems", [{ index: 1, color: '#dc291e', groupLegend: 'Conversion rate' }, { index: 0, color: '#CCCCCC', groupLegend: 'Engagement value' }, { index: 2, color: '#6ea244', groupLegend: 'Conversion rate' },]);

        //$ulContent
        it("'header of the group' must be visible and correct|", function () {

          var $spGroupInfo = expIndicatorProto.$el.find(".spGroupInfo");

          expect($spGroupInfo.length).toBeGreaterThan(0);
          expect($spGroupInfo.html()).toContain(groups[0].name);
          
        });

        it("'items of the group' must be rendered correctly|", function () {

          var $listItemElems = expIndicatorProto.$el.find(".scExp-dvExperience");
          expect($listItemElems.length).toEqual(groups[0].items.length);

          expect($($listItemElems[0]).find(".spSecondSubColumn").html()).toEqual(groups[0].items[0].title);
          expect($($listItemElems[1]).find(".spSecondSubColumn").html()).toEqual(groups[0].items[1].title);

        });

        it("LegendList is rendered|", function () {

          expIndicatorProto.model.set("IsLegendVisible", true);            
          expIndicatorProto.renderComponent();
          
          var $dvLegendItems = expIndicatorProto.$el.find(".scExp-dvLegendItems");
          var isVisible = $dvLegendItems.length > 0 && $dvLegendItems.css("display") != "none";
          expect(isVisible).toBe(true);
        });

        it("Selecting of the item must highlight this item in control|", function () {

          var selectedItem = TestParameters.getSelectedItem();

          expIndicatorProto.model.set("selectedItem", selectedItem);

          var isSelectedElem = expIndicatorProto.selectedItemElem
                               && expIndicatorProto.selectedItemElem.id == selectedItem.guid
                               && expIndicatorProto.selectedItemElem.className.indexOf("Selected") >= 0;
          expect(isSelectedElem).toBe(true);
        });

        it("Finding of the item by id|", function () {

          var selectedItem = TestParameters.getSelectedItem();

          var findItem = expIndicatorProto.findItemById(selectedItem.guid);

          var isFoundCorrectly = findItem
                                 && findItem.guid == selectedItem.guid
                                 && findItem.title != '';
          expect(isFoundCorrectly).toBe(true);

        });

        it("Mousedown on item-element|", function () {

          var groups = TestParameters.getTestGroups();
          var firstItem = groups[0].items[0];

          var firstItemElem = expIndicatorProto.$el.find("#" + firstItem.guid);
          if (firstItemElem.length > 0) {
            var e = jQuery.Event("mousedown");
            jQuery(firstItemElem[0]).trigger(e);            
          }

          var isItemSelected = expIndicatorProto.model.get("selectedItem")
                               && expIndicatorProto.model.get("selectedItem").guid == firstItem.guid;

          expect(isItemSelected).toBe(true);
        });

      });

    };

    if (window.location.host && window.location.host != '') // launching when address to web-page
      window.runTests(setupTests);
    else // launching of the code-coverage estemating
      setupTests($("<div></div>"));

  });
});
