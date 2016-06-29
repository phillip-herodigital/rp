define(["sitecore", "/-/speak/v1/pathanalyzer/PathAnalyzer.js"], function (Sitecore, pathAnalyzer) {
  Sitecore.Factories.createBaseComponent({
    name: "PathSignificanceFilter",
    base: "ControlBase",
    selector: ".sc-PathSignificanceFilter",
    attributes: [
      { name: "selectdValue", defaultValue: null, value: "$el.data:sc-selectedvalue" }
    ],

    extendModel: {

    },

    afterRender: function () {
      this.attachEvents();

      var selectedValue = this.$el.data("sc-selectedvalue");
      if (!selectedValue)
        return;

      this.setSelectedValue(selectedValue);
    },

    getSelectedValue: function () {
      var selectedValue = this.$el.find("input:radio[name='PathSignificanceFilterOptions']:checked").val();
      return selectedValue;
    },

    setSelectedValue: function (value) {
      var selectedValue = value || this.getSelectedValue();

      this.model.set("selectedValue", selectedValue);

      var selectedElem = this.$el.find("input:radio[value='" + selectedValue + "']");
      selectedElem.checked = true;
      this.uiHandleSelect(selectedElem.closest('.sc-radiobutton'));

      pathAnalyzer.setPathSignificanceFilterValue(selectedValue);
    },

    attachEvents: function () {
      var self = this;
      this.$el.find(".sc-radiobutton").on('click', function() {
        var elem = jQuery(this);
        self.uiHandleSelect(elem);
      });
    },

    uiHandleSelect: function(element) {
      element.siblings('.sc-radiobutton').removeClass("selected");
      element.addClass("selected");
    }
  });
});
