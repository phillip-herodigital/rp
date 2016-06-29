define([
  "sitecore",
  "/-/speak/v1/ecm/DialogService.js"
], function (
  sitecore,
  DialogService
) {
  "use strict";

  var model = sitecore.Definitions.Models.ComponentModel.extend(
    {
      initialize: function () {
        this.set('list', []);
        this.set('index', -1);
        this.set('variantId', null);
        this.set('testId', null);
        this._super();
      },

      setIndex: function (index) {
        var list = this.get('list');
        if (index >= list.length) {
          index = 0;
        }
        if (index < 0) {
          index = list.length - 1;
        }
        this.set('index', index);
      },

      next: function () {
        this.setIndex(this.get('index') + 1);
      },

      prev: function () {
        this.setIndex(this.get('index') - 1);
      },

      getIndexByAttr: function (attr, value) {
        var list = this.get('list');
        var condition = {};
        condition[attr] = value;
        return _.indexOf(list, _.findWhere(list, condition));
      }
    }
  );

  var view = sitecore.Definitions.Views.ComponentView.extend(
    {
      initialize: function () {
        this.options = this.getOptions();
        this._super();
        this.attachModelToDialog();
      },

      getOptions: function() {
        return {
          rootElementSelector: 'div.sc-emailpreviewresult',
          variantIdAttr: 'sc-variant-id',
          dateTimeAttr: 'sc-report-dateandtime',
          variantElementSelector: 'div.sc-report-item a',
          previewDialogName: 'emailPreviewDetails',
          testIdselector: 'sc-test-id'
        };
      },

      render: function() {
        this.setupModel();
        this.bindVariants();
      },

      bindVariants: function() {
        $.each(this.$el.find(this.options.variantElementSelector), _.bind(function (index, variantElement) {
          var variantElement = $(variantElement);
          variantElement.on("click", _.bind(this.onVariantElementClick, this));
        }, this));
      },

      setupModel: function() {
        var rootElement = this.$el.find(this.options.rootElementSelector);
        var variantId = rootElement.data(this.options.variantIdAttr);
        
        this.model.set('list', this.getPreviews(variantId));
        this.model.set('variantId', variantId);
        this.model.set('testId', this.getTestId(variantId));
        this.model.set('datetime', rootElement.data(this.options.dateTimeAttr));
      },

      isVariantElementValid: function(element) {
        return !!element.data("sc-url");
      },

      setIndex: function(element) {
        this.model.setIndex(this.model.getIndexByAttr('url', element.data("sc-url")));
      },

      onVariantElementClick: function (e) {
        var element = $(e.currentTarget);
        if (this.isVariantElementValid(element)) {
          DialogService.show(this.options.previewDialogName);
          this.setIndex(element);
        }
      },

      attachModelToDialog: function() {
        DialogService.get(this.options.previewDialogName).done(_.bind(function (dialog) {
          dialog.attachModel(this.model);
        }, this));
      },

      getVariantsContainer: function(id) {
        return $(this.options.rootElementSelector + '[data-' + this.options.variantIdAttr + '="' + id + '"]');
      },

      getPreviews: function(id) {
        var container = this.getVariantsContainer(id),
          list = [];

        $.each($(this.options.variantElementSelector, container), _.bind(function (index, element) {
          var element = $(element);
          if (element.data("sc-url") != "") {
            list.push(this.serializeVariant(element));
          }
        }, this));

        return list;
      },

      serializeVariant: function(element) {
        return {
          name: element.data("sc-name"),
          url: element.data("sc-url")
        }
      },

      getTestId: function(id) {
        var container = this.getVariantsContainer(id);
        return container.data(this.options.testIdselector);
      }
    }
  );

  sitecore.Factories.createComponent("EmailPreviewResult", model, view, ".sc-EmailPreviewResult");
  return { view: view, model: model };
});