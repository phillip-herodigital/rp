define(["sitecore", "/-/speak/v1/pathanalyzer/PathAnalyzer.js"], function (Sitecore, pathAnalyzer) {
  Sitecore.Factories.createBaseComponent({
    name: "NodeGroupingOptions",
    base: "ControlBase",
    selector: ".sc-NodeGroupingOptions",
    attributes: [
      {
        name: "selectedOption", defaultValue: ""
      }
    ],

    extendModel: {
    },

    afterRender: function () {
      var selectedOption = this.$el.attr("data-sc-nodegroupingoption");
      if (!selectedOption)
        return;

      this.model.set("selectedOption", selectedOption);
      pathAnalyzer.setNodeGroupingOption(selectedOption);
    },

    getSelectedOption: function() {
      var selectedOptionElem = this.$el.find("input:checked");
      if (selectedOptionElem) {
        return selectedOptionElem.val();
      }
      return "";
    },

    setSelectedOption: function (value) {
      var selectedOption = value || this.getSelectedOption();

      this.model.set("selectedOption", selectedOption);
      //var selectedNode = selectedOptions.get("selectedNode");
      //this.model.set("selectedTreeDefinitionName", selectedNode.title);

      pathAnalyzer.setNodeGroupingOption(selectedOption);
    }
});
});
