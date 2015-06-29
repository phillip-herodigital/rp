
var arResComponents;
if (window.location.host && window.location.host != '') // launching when address to web-page
  arResComponents = ["sitecore", "GroupedCheckboxList", "css!GroupedCheckboxList"];
else // launching of the code-coverage estemating
  arResComponents = ["sitecore"];

define(arResComponents, function (_sc) {

  describe("GroupedCheckboxList testing|", function () {

    var setupTests = function ($pageElem) {

      var grCheckboxListModel = new _sc.Definitions.Models.GroupedCheckboxList();

      var grCheckboxListProto = _sc.Definitions.Views.GroupedCheckboxList.prototype;

      $elem = $pageElem.find(".sc-GroupedCheckboxList");
      if ($elem.length == 0)
        $elem = $("<div></div>");

      grCheckboxListProto.setTestingOptions({
        $el: $elem,
        model: grCheckboxListModel,
      });

      describe("Initialization|", function () {

        //$ulContent
        it("'$elem' must be defined|", function () {
          expect($elem.length).toBeGreaterThan(0);
        });        

      });

      describe("'Checking' changing|", function () {

        //$ulContent
        it("Checked 'input' elements must be found|", function () {
          var prevSelectedIds = grCheckboxListProto.model.get("selectedIds");

          var $inputElem = grCheckboxListProto.$el.find("input");
          $inputElem.click();

          grCheckboxListProto.toggle();
          var newSelectedIds = grCheckboxListProto.model.get("selectedIds");

          var isSelectedIdsChanged = prevSelectedIds.length != newSelectedIds.length;
          expect(isSelectedIdsChanged).toEqual(true);
        });

      });

      describe("'_map:checkedCtrls'|", function () {

        it("'_map:checkedCtrls' must return checked ids of 'input' elements|", function () {

          var idList;
          var $inputElem = grCheckboxListProto.$el.find("input");
          if ($inputElem.length == 0) {

            idList = [{ id: 'id_1' }, { id: 'id_2' }, ];
            for (var i = 0; i < idList.length; i++) {
              if(i == 0)
                grCheckboxListProto.$el.html("<input id='" + idList[i] + "' checked='true' ></input>");
              else
                grCheckboxListProto.$el.append("<input id='" + idList[i] + "' checked='true' ></input>");
            }

          } else {            
            if(!$inputElem.prop("checked"))
              $inputElem.click();
            idList = [];
            for (var i = 0; i < $inputElem.length; i++) {
              idList.push($inputElem[i].id);
            }
          }

          grCheckboxListProto.toggle();
          var newSelectedIds = grCheckboxListProto.model.get("selectedIds");

          var isSelectedIdEqual = newSelectedIds.length > 0 && newSelectedIds[0] == idList[0];
          expect(isSelectedIdEqual).toEqual(true);

        });

      });

    };

    if (window.location.host && window.location.host != '') // launching when address to web-page
      window.runTests(setupTests);
    else // launching of the code-coverage estemating
      setupTests($("<div></div>"));

  });
});