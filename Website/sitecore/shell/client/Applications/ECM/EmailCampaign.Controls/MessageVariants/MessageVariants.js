define([
  "sitecore",
  "/-/speak/v1/ecm/CompositeComponentBase.js"
], function (sitecore, CompositeComponentBase) {
  var model = sitecore.Definitions.Models.ControlModel.extend({
    initialize: function () {
      this._super();
      this.set("variants", []);
      this.set("selectedVariant", null);
      this.on("change:selectedVariant", this.onChangeSelectedVariant, this);
    },

    addVariant: function(variant) {
      var variants = this.get("variants");
      variants.push(variant);
      this.set("selectedVariant", variants[variants.length - 1]);
      this.setVariants(variants);
    },

    removeVariant: function (id) {
      var variants = this.get("variants"),
        variantToRemove = _.findWhere(variants, { id: id }),
        variantToRemoveIndex = _.indexOf(variants, variantToRemove);

      var variants = _.without(variants, variantToRemove);

      this.set("selectedVariant", variants[variantToRemoveIndex > 0 ? variantToRemoveIndex - 1 : 0]);
      this.setVariants(variants);
    },

    setVariants: function(variants) {
      this.set("variants", [], { silent: true });
      this.set("variants", variants);
    },

    selectVariant: function(id) {
      this.set("selectedVariant", _.findWhere(this.get("variants"), { id: id }));
    },

    onChangeSelectedVariant: function () {
      this.trigger("select:variant", this.get("selectedVariant"));
    }
  });

  var view = CompositeComponentBase.view.extend({
    childComponents: ["Tabs", "MessageVariant", "AddButton"],

    initialize: function () {
      this.letters = _.map(_.range('a'.charCodeAt(0), 'z'.charCodeAt(0) + 1), String.fromCharCode);

      this._super();
      this.model.on({
        "change:variants": this.refresh,
        "change:selectedVariant": this.updateVariant,
        "change:multivariate": this.onChangeMultivariate
      }, this);

      this.children.Tabs.on("change:selectedTab", this.onSelectTab, this);
      this.children.MessageVariant.on("modified", function () {
        this.model.trigger("modified");
      }, this);
    },

    onChangeMultivariate: function() {
      this.children.Tabs.set("isVisible", this.model.get("multivariate"));
      this.children.AddButton.set("isVisible", this.model.get("multivariate"));
      this.children.AddButton.set("isEnabled", this.model.get("multivariate"));
    },

    onSelectTab: function () {
      this.model.selectVariant(this.children.Tabs.get("selectedTab"));
    },

    resetTabs: function () {
      this.children.Tabs.set("selectedTab", "", { silent: true });
      this.children.Tabs.set("dynamicTabs", [], { silent: true });
      this.children.Tabs.viewModel.$el.find("ul").empty();
      this.children.Tabs.viewModel.$el.find(".tab-content").empty();
    },

    updateTabs: function () {
      var tabs = _.map(this.model.get("variants"), function(variant, index) {
        return {
          id: variant.id,
          header: sitecore.Resources.Dictionary.translate("ECM.Pages.Message.Variant") + " <span class=\"abn-letter\">" + this.letters[index] + "</span>",
          content: ""
        }
      }, this);

      this.resetTabs();

      _.each(tabs, function (tab) {
        this.children.Tabs.viewModel.addDynamicTab(tab);
      }, this);

      var selectedVariant = this.model.get("selectedVariant");
      if (selectedVariant) {
        this.children.Tabs.set("selectedTab", selectedVariant.id);
      }
    },

    updateVariant: function () {
      this.children.MessageVariant.set("removable", this.model.get("variants").length > 1);
      this.children.MessageVariant.set("data", this.model.get("selectedVariant"));
      this.children.MessageVariant.viewModel.refresh();
    },

    refresh: function () {
      var selectedVariant = this.model.get("selectedVariant"),
        variants = this.model.get("variants");

      if (!variants.length) {
        return;
      }

      if (!selectedVariant) {
        this.model.set("selectedVariant", variants[0]);
      }
      this.updateTabs();
      this.updateVariant();
    }
  });

  sitecore.Factories.createComponent("MessageVariants", model, view, ".sc-MessageVariants");
});