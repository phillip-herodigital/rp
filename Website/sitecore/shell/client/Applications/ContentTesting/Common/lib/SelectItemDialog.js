define([], function () {
  return {
    SelectItemDialog: function (options) {
      // define object
      var ob = {
        // member variables
        _dialogWindow: options.dialogWindow,
        _itemIdPropertyName: options.itemIdPropertyName,
        _itemTemplateIdPropertyName: options.itemTemplateIdPropertyName,
        _hostPage: options.host,

        // ctor / init
        init: function(){
          this._hostPage.TreeView.on("change:selectedItemId", this.setSelectedItemFromTree, this);
          this._hostPage.ResultsList.on("change:selectedItemId", this.setSelectedItemFromList, this);
        },

        // member functions
        setSelectedItemFromTree: function () {
          this._hostPage.set(this._itemIdPropertyName, this._hostPage.TreeView.get("selectedItemId"));
          var node = this._hostPage.TreeView.get("selectedNode");
          var rawItem = node.rawItem;
          this._hostPage.set(this._itemTemplateIdPropertyName, rawItem.$templateId);
          
        },

        setSelectedItemFromList: function () {
          this._hostPage.set(this._itemIdPropertyName, this._hostPage.ResultsList.get("selectedItemId"));
        },

        setTitle: function (title) {
          var titleEl = this._dialogWindow.viewModel.$el.find(".sc-dialogWindow-header-title");
          titleEl.text(title);
        },

        setSelectButtonText: function (text) {
          var buttonEl = this._dialogWindow.viewModel.$el.find("div[data-sc-id=\"SelectButton\"]");
          buttonEl.text(text);
        },

        setSelectButtonCallback: function (callback) {
          var buttonEl = this._dialogWindow.viewModel.$el.find("button[data-sc-id=\"SelectButton\"]");
          buttonEl.attr("data-sc-click", "javascript:app." + callback + "()");
        },

        show: function () {
          this._dialogWindow.show();
        },

        hide: function () {
          this._dialogWindow.hide();
        }
      };

      ob.init();
      return ob;
    }
  };
});