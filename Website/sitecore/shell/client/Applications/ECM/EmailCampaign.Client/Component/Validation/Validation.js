define([
  "sitecore",
  '/-/speak/v1/ecm/ValidationModel.js',
  '/-/speak/v1/ecm/ValidationView.js',
], function (sitecore, ValidationModel, ValidationView) {
  return {
    create: function (options) {
      var model = new ValidationModel(options),
        view = new ValidationView({ model: model });
      return model;
    }
  }
});