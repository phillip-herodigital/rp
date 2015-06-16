define(["sitecore"], function (sitecore) {
  var model = sitecore.Definitions.Models.ControlModel.extend({
    initialize: function () {
      this._super();
      this.set("items", {});
      this.set("selectedItems", []);
    }
  });

  var view = sitecore.Definitions.Views.ControlView.extend({
    initialize: function () {
      this._super();
    },

    render: function () {
      var div = this.$el.find('.sc-checkboxrepeater');
      
      $.each(this.model.get("items"), function (v, vv) {
        div.append('<div class="sc-checkboxrepeater-item">' +
          '<input type="checkbox" data-id="' + vv.id + '" id="cb-' + vv.id + '" />' +
          '<label for="cb-' + vv.id + '">' + vv.name + '</label>' +
          '</div>');
      });

      var that = this;
      $('.sc-checkboxrepeater-item input[type="checkbox"]', div).change(function() {
        that.model.set("selectedItems", that.getSelectedIds());
      });
    },

    toggleAll: function () {
      var div = this.$el.find('.sc-checkboxrepeater');
      var a = this.$el.find("a");
      if (this.$el.data("all-checked") == "true") {
        $("input[type=checkbox]", div).prop('checked', false);
        this.$el.data("all-checked", "false");
        a.text(a.data("sc-selectalltext"));
      } else {
        $("input[type=checkbox]", div).prop('checked', true);
        this.$el.data("all-checked", "true");
        a.text(a.data("sc-selectnonetext"));
      }

      // make sure that listeners gets triggered by this
      $('.sc-checkboxrepeater-item input[type="checkbox"]', div).trigger('change');
    },

    getSelectedIds: function () {
      return $("input[type=checkbox]:checked", this.$el.find('.sc-checkboxrepeater')).map(function () {
        return $(this).attr('data-id');
      }).get();
    }
  });

  sitecore.Factories.createComponent("CheckboxRepeater", model, view, ".sc-CheckboxRepeater");
});