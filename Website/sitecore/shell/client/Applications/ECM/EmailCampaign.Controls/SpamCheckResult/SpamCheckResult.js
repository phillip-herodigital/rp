define([
  "sitecore",
  "/-/speak/v1/ecm/DialogService.js",
  "/-/speak/v1/ecm/EmailPreviewResult.js"
], function (
  sitecore,
  DialogService,
  EmailPreviewResult
) {
  "use strict";
  var model = EmailPreviewResult.model;

  var view = EmailPreviewResult.view.extend({
    getOptions: function() {
      var options = this._super();
      options.rootElementSelector = 'div.sc-spamcheckresult';
      options.previewDialogName = 'spamCheck';
      return options;
    },

    render: function() {
      this.setupModel();
      this.bindVariants();
    },

    isVariantElementValid: function (element) {
      return !!element.data("sc-title");
    },

    setIndex: function (element) {
      this.model.setIndex(this.model.getIndexByAttr('title', element.data("sc-title")));
    },
    serializeVariant: function (element) {
      return {
        title: element.data("sc-title"),
        body: element.data("sc-body"),
        name: element.data("sc-name")
      }
    }
  });

  sitecore.Factories.createComponent("SpamCheckResult", model, view, ".sc-SpamCheckResult");

  return { model: model, view: view };
});