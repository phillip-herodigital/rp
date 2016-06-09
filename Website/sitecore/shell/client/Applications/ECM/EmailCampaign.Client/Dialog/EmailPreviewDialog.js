define([
  "sitecore",
  "/-/speak/v1/ecm/DialogBase.js"
], function (
  sitecore,
  DialogBase
) {
  return DialogBase.extend({
    showDialog: function (options) {
      this._super(options);
      this.EmailPreviewImage.set("imageUrl", options.data.ImageUrl);
    }
  });
});
