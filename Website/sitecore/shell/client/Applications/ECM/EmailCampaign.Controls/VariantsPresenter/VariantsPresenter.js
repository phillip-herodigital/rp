define(["sitecore"], function (sitecore) {
  var model = sitecore.Definitions.Models.ControlModel.extend({
    initialize: function () {
      this._super();
    }
  });

  var view = sitecore.Definitions.Views.ControlView.extend({
    initialize: function () {
      this._super();
    },

    showVariants: function (data) {
      this.$el.parent().show();
      if (data.length == 0) {
        this.$el.parent().hide();
      }

      $('.variant-button', this.$el).hide();
      var that = this;
      $.each(data, function (index, value) {
        $("[data-variants-selector-index=" + value + "]", that.$el).show();
      });
    }
  });

  sitecore.Factories.createComponent("EcmVariantsPresenter", model, view, ".sc-variants-presenter");
});
