define(["sitecore", "knockout"], function (sitecore, ko) {
  var model = sitecore.Definitions.Models.ControlModel.extend({
    initialize: function () {
      this._super();
    }
  });

  var view = sitecore.Definitions.Views.ControlView.extend({
    initialize: function () {
      this._super();

      var self = this;
      this.$el.find(".sc-variants-selector-body").on("click", function () {
        self.model.trigger("change:variants");
      });
    },

    showVariants: function (data) {
      if (!data) {
        return;
      }

      var selector = this.$el[0];
      var elements = $(".variant-button", selector);
      elements.hide();

      $.each(data, function (index, value) {
        $("[data-variants-selector-index=" + value + "]", selector).show();
      });
    },

    getSelectedVariants: function () {
      var selector = this.$el[0];
      var elements = $(".variant-button", selector);
      var selectedVariants = [];

      $.each(elements, function (index, element) {
        var button = $(element).children("button.up");
        var isToggled = button.length !== 0;

        if (isToggled) {
          var variantIndex = $(element).attr("data-variants-selector-index");
          selectedVariants.push(variantIndex);
        }
      });

      return selectedVariants;
    },

    setSelectedVariants: function (data, isClick) {
      if (!data) {
        return;
      }

      var contextApp = this.app;
      var selector = this.$el[0];
      var elements = $(".variant-button button", selector);
     
      $.each(elements, function () {
        var $button = $(this);
        if ($button.hasClass("up")) {
          $button.click();
        }
      }); 

      $.each(data, function (index, value) {
        var $button = $("[data-variants-selector-index=" + value + "] button", selector);
        if (isClick) {
          if (!$button.hasClass("up")) {
            $button.click();
          }
        } else {
          var id = $button.attr("data-sc-id");
          contextApp[id].viewModel.open();
        }
      });
    },

    enable: function () {
      var contextApp = this.app;
      var selector = this.$el[0];
      var elements = $(".variant-button button", selector);

      $.each(elements, function (index, element) {
        var id = element.attributes["data-sc-id"].value;
        var button = contextApp[id];
        button.viewModel.enable();
      });
    },

    disable: function () {
      var contextApp = this.app;
      var selector = this.$el[0];
      var elements = $(".variant-button button", selector);

      $.each(elements, function (index, element) {
        var id = element.attributes["data-sc-id"].value;
        var button = contextApp[id];
        button.viewModel.disable();
      });
    }
  });

  sitecore.Factories.createComponent("EcmVariantsSelector", model, view, ".sc-variants-selector");
});
