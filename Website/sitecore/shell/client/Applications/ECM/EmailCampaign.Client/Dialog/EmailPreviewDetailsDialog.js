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
      this.TestIdValue.set("text", this.model.get("testId"));
      this.initButtons();
    },

    initButtons: function() {
      if (this.model.get('list').length <= 1) {
        this.NextButton.set('isVisible', false);
        this.PreviousButton.set('isVisible', false);
      } else {
        this.NextButton.set('isVisible', true);
        this.PreviousButton.set('isVisible', true);
      }
    },

    detachModel: function() {
      if (this.model) {
        this.model.off(null, null, this);
        this.off(null, null, this.model);
      }
    },

    attachModel: function (model) {
      this.detachModel();
      this.model = model;
      this.model.on({
        'change:index': this.onChangeIndex
      }, this);
      this.on({
        'dialog:next': this.model.next,
        'dialog:previous': this.model.prev
      }, this.model);
    },

    onChangeIndex: function () {
      var list = this.model.get('list'),
        itemData = list[this.model.get('index')];
      this.EmailPreviewImage.set("imageUrl", itemData.url);
      this.updateTitle(itemData.name + ' ' + this.defaults.title);
    }
  });
});
