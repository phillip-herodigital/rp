require.config({
  paths: {
    bootstrapSlider: "lib/ui/deps/BootstrapSlider/bootstrap-slider",
    sliderCss: "../../Business Component Library/Layouts/Renderings/Common/Slider/Slider"
  }
});

define(["sitecore", "bootstrapSlider", "css!sliderCss"], function (_sc) {
  _sc.Factories.createBaseComponent({
    name: "Slider",
    base: "ComponentBase",
    selector: ".sc-Slider",
    sliderControl: null,
    attributes: [
      { name: "minimum", defaultValue: null, value: "$el.data:sc-minimum" },
      { name: "maximum", defaultValue: null, value: "$el.data:sc-maximum" },
      { name: "step", defaultValue: null, value: "$el.data:sc-step" },
      { name: "value", defaultValue: null, value: "$el.data:sc-value" },
      { name: "showTooltip", defaultValue: null },
      { name: "selectedValue", defaultValue: null, value: "$el.data:sc-selectedvalue" },
      { name: "selectedValueStart", defaultValue: null, value: "$el.data:sc-selectedvaluestart" },
      { name: "selectedValueEnd", defaultValue: null, value: "$el.data:sc-selectedvalueend" },
      { name: "selectedItem", defaultValue: null },
      { name: "selectedItems", defaultValue: null },
      { name: "items", defaultValue: null, value: "$el.data:sc-items" },
      { name: "displayFieldName", defaultValue: null, value: "$el.data:sc-displayfieldname" },
      { name: "valueFieldName", defaultValue: null, value: "$el.data:sc-valuefieldname" },
      { name: "type", defaultValue: null, value: "$el.data:sc-type" },
      { name: "isEnabled", defaultValue: null, value: "$el.data:sc-isenabled" },
      { name: "isVisible", defaultValue: null, value: "$el.data:sc-isvisible" }
    ],
    initialize: function() {
      var items = this.model.get("items");      
      this.model.on("change:isEnabled", this.toggleEnable, this);      
      this.initializeSlider(items); 
    },

    // <summary>
    // Rebinds the slider items.
    // <param name="items">The items array. If not specified the original items colelction is kept</param>
    // </summary>    
    rebind: function (items) {
      if (typeof items === "undefined") {
        items = this.model.get("items");
      }
      
      this.model.set("items", items);

      this.initializeSlider(items);
    },

    // <summary>
    // Initialize the slider control.
    // <param name="items">The items array.</param>
    // </summary>
    initializeSlider: function (items) {

      var inputControl,
        sliderValue,
        that = this,
        hasItems = (items && items.length > 0),
        sliderParent;

      var options = {
        formater: function(value) {
          var displayValue = value;
          if (hasItems) {
            displayValue = items[value].itemName;
          }

          if (!displayValue) {
            displayValue = Math.round(value * 10) / 10;
          }

          return " " + displayValue + " ";
        }
      };

      this.validateMinMax(items);
      
      inputControl = this.$el.find(".sliderControl");
      inputControl.attr("data-slider-min", this.model.get("minimum"));
      inputControl.attr("data-slider-max", this.model.get("maximum"));
      inputControl.attr("data-slider-step", this.model.get("step"));

      sliderValue = this.calculateSliderValue(
        items,
        this.model.get("minimum"),
        this.model.get("maximum"),
        this.model.get("selectedValue"),
        this.model.get("selectedValueStart"),
        this.model.get("selectedValueEnd"),
        this.model.get("type"));
      
      inputControl.attr("data-slider-value", sliderValue);
      
      // If it's already a slider control, then this will "reset"
      sliderParent = inputControl.parents(".slider");
      if (sliderParent.length > 0) {
        sliderParent.before(inputControl);
        sliderParent.remove();
      }

      var slider = inputControl.slider(options);      
      
      this.sliderControl = slider[0];
      this.toggleEnable();
      
      slider.on('slide', function (ev) {
        if (Array.isArray(ev.value)) {
          if (hasItems) {
            that.model.set("selectedValueStart", items[ev.value[0]].value);
            that.model.set("selectedValueEnd", items[ev.value[1]].value);
            that.model.set("selectedItem", items[ev.value[0]]);
            that.model.set("selectedItems", "{" + items[ev.value[0]] + "," + items[ev.value[1]] + "}");
          } else {
            that.model.set("selectedValueStart", ev.value[0]);
            that.model.set("selectedValueEnd", ev.value[1]);
            that.model.set("selectedItem", null);
            that.model.set("selectedItems", null);
          }
        } else {
          if (hasItems) {
            that.model.set("selectedValue", items[ev.value].value);
            that.model.set("selectedItem", items[ev.value]);
            that.model.set("selectedItems", items[ev.value]);
          } else {
            that.model.set("selectedValue", ev.value);
            that.model.set("selectedItem", null);
            that.model.set("selectedItems", null);
          }
        }
      });
    },
    
    // <summary>
    // Validate Mimimum and Maximum.
    // </summary>
    validateMinMax: function (items) {
      if (items && items.length > 0) {
        this.model.set("items", items);
        this.model.set("minimum", 0);
        this.model.set("maximum", items.length - 1);
        this.model.set("step", 1);
      }
      else {
        if ((isNaN(this.model.get("minimum")) || isNaN(this.model.get("maximum")))
          || ( parseFloat(this.model.get("minimum")) === 0 &&  parseFloat(this.model.get("maximum")) === 0)) {
          this.model.set("minimum", 0);
          this.model.set("maximum", 10);
          this.model.set("step", 1);
        } else {
          this.model.set("minimum", parseFloat(this.model.get("minimum")));
          this.model.set("maximum", parseFloat(this.model.get("maximum")));
        }
      }
    },

    // <summary>
    // Toggle SLider control Enabled property.
    // </summary>
    toggleSliderControlEnabled: function(){
      this.sliderControl.disabled = !this.model.get("isEnabled");
    },

    // <summary>
    // Toggle component Enabled property.
    // </summary>
    toggleEnable: function () {
      if (!this.model.get("isEnabled")) {
        this.$el.addClass("disabled");
      } else {
        this.$el.removeClass("disabled");
      }

      this.sliderControl.disabled = !this.model.get("isEnabled");
    },
    
    // <summary>
    // CalculateSliderValue.
    // </summary>
    // <param name="items">The items array.</param>
    // <param name="minimum">The minimum index.</param>
    // <param name="maximum">The maximum index.</param>
    // <param name="selectedValue">The selected value (single).</param>
    // <param name="selectedValueStart">The selected value start (range).</param>
    // <param name="selectedValueEnd">The selected value end (range).</param>
    // <param name="type">The slider type (Single|Range)</param>
    // <returns>The slider value.</returns>
    calculateSliderValue: function(items, minimum, maximum, selectedValue, selectedValueStart, selectedValueEnd, type) {
      
      var selectedValueIndex = this.getValueIndex(items, selectedValue, maximum);
      var selectedValueStartIndex = this.getValueIndex(items, selectedValueStart, minimum);
      var selectedValueEndIndex = this.getValueIndex(items, selectedValueEnd, maximum);

      if (type === "Range") {
        if (selectedValueStartIndex < minimum || selectedValueStartIndex > maximum) {
          selectedValueStartIndex = minimum;
        }
        
        if (selectedValueEndIndex < minimum || selectedValueEndIndex > maximum) {
          selectedValueEndIndex = maximum;
        }

        this.model.set("selectedValueStart", this.getIndexValue(items, selectedValueStartIndex));
        this.model.set("selectedValueEnd", this.getIndexValue(items, selectedValueEndIndex));
        
        return selectedValueStartIndex + ";" + selectedValueEndIndex;
      }
      
      if (selectedValueIndex < minimum || selectedValueIndex > maximum) {
        selectedValueIndex = maximum;
      }
      
      this.model.set("selectedValue", this.getIndexValue(items, selectedValueIndex));
      return selectedValueIndex;
    },
    // <summary>
    // Get slider index from item's value.
    // </summary>
    // <param name="items">The items array.</param>
    // <param name="value">The item's value.</param>
    // <param name="value">The default value.</param>
    // <returns>The value index.</returns>
    getValueIndex: function(items, value, defaultValue) {
      
      if (items && items.length > 0)
      {
        for (var i = 0; i < items.length; i++) {
          if (items[i].value === value.toString()) {
            return i;
          }
        }

        return defaultValue;
      }

      if (isNaN(value) || value === "") {
        return defaultValue;
      }
      
      return value;
    },
    
    // <summary>
    // Get slider value from item's index.
    // </summary>
    // <param name="items">The items array.</param>
    // <param name="value">The item's value.</param>
    // <returns>The value index.</returns>
    getIndexValue: function(items, index) {
      
    if (items && items.length > 0) {
      return items[index].value;
    }
          
    return index;
  }
  });
});