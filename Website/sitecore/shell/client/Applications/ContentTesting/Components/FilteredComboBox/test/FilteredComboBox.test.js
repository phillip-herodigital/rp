
var arTestComponents = ["sitecore", "FilteredComboBox", "css!FilteredComboBox"];
var arCoverageComponents = ["sitecore"];
var arResComponents;
if (window.location.host && window.location.host != '') // launching when address to web-page
  arResComponents = arTestComponents;
else // launching of the code-coverage estemating
  arResComponents = arCoverageComponents;

define(arResComponents, function (_sc) {
  
  describe("FilteredComboBox testing|", function () {

    getTestItems = function () {
      var items = [{ id: { Guid: '1_1' }, guid: "{00000000-0000-0000-0000-000000000000}", name: "One" },
             { id: { Guid: '2_2' }, guid: "{10000000-0000-0000-0000-000000000000}", name: "Third" },
             { id: { Guid: '3_3' }, guid: "{20000000-0000-0000-0000-000000000000}", name: "Five" },
             { id: { Guid: '4_4' }, guid: "{30000000-0000-0000-0000-000000000000}", name: "Seven" }, ];

      return items;
    };

    var setupTests = function ($pageElem) {

      var comboBoxModel = new _sc.Definitions.Models.FilteredComboBox();

      var comboBoxProto = _sc.Definitions.Views.FilteredComboBox.prototype;

      $elem = $pageElem.find(".sc-filteredcombobox");

      comboBoxProto.setTestingOptions({
        $el: $elem,
        model: comboBoxModel,
      });

      try {
        comboBoxProto.initialize({});
      }
      catch (e) {
      }      

      describe("Initialization|", function () {

        //$ulContent
        it("'$ulContent' must be defined|", function () {
          expect(comboBoxProto.$ulContent.length).toBeGreaterThan(0);
        });


        it("'maxVisibleItems' must be > 0|", function () {
          expect(comboBoxProto.$ulContent.length).toBeGreaterThan(0);
        });

        it("component must be Enabled|", function () {
          expect(comboBoxProto.isEnabled()).toEqual(true);
        });

      });

      describe("Populating and rendering|", function () {

        it("Count of the rendered items must be equal to amount items of the model|", function () {
          var items = getTestItems();
          comboBoxModel.set("items", items);

          var $ulContent = comboBoxProto.$ulContent;

          expect($ulContent.find("li").length).toEqual(4);

          var firstLI = $ulContent.find("li")[0];
          var span = $(firstLI).find("span")[0];
          expect(span.innerHTML).toEqual("One");
        });

        it("'itemsSortAsc' must contain sorted array|", function () {
          expect(comboBoxProto.itemsSortAsc[0].name).toEqual("Five");
          expect(comboBoxProto.itemsSortAsc[1].name).toEqual("One");
          expect(comboBoxProto.itemsSortAsc[2].name).toEqual("Seven");
          expect(comboBoxProto.itemsSortAsc[3].name).toEqual("Third");
        });

      });

      describe("Filtering|", function () {

        it("'HintText' must be defined|", function () {
          expect(comboBoxProto.model.get("HintText")).toBeDefined();
          expect(comboBoxProto.model.get("HintText")).not.toEqual("");

          var inputSearchElem = comboBoxProto.$el.find('.scFiltList-inputSearch');
          inputSearchElem.val("One");
          comboBoxProto.timerHandle();

          var $ulContent = comboBoxProto.$ulContent;
          expect(comboBoxProto.$ulContent.find("li").length).toBeGreaterThan(0);

          var firstLI = $ulContent.find("li")[0];
          var span = $(firstLI).find("span")[0];
          expect(span.innerHTML).toEqual("One");

          // reseting
          inputSearchElem.val("");
        });

      });

      describe("Sorting(ASC)|", function () {

        it("Rendered items(li) must be sorted|", function () {

          var items = getTestItems();
          comboBoxModel.set("items", items);

          comboBoxProto.sortMethod = comboBoxProto.sortMethodEnum.ASC;
          comboBoxProto.isSortChanged = true;
          comboBoxProto.timerHandle();

          var $liList = comboBoxProto.$ulContent.find("li");
          expect($liList.find("span")[0].innerHTML).toEqual("Five");
          expect($liList.find("span")[1].innerHTML).toEqual("One");
          expect($liList.find("span")[2].innerHTML).toEqual("Seven");
          expect($liList.find("span")[3].innerHTML).toEqual("Third");
        });

      });

    };

    if (window.location.host && window.location.host != '') // launching when address to web-page
      window.runTests(setupTests);
    else // launching of the code-coverage estemating
      setupTests($("<div></div>"));

  });
});
