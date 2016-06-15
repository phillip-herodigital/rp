define([], function () {
  var Selection = function () { };
  Selection.prototype.constructor = Selection;

  Selection.prototype.initialized = function () {

    this.on("change:SelectedItem", this.select, this);
    this.on("change:SelectedValue", this.selectByValue, this);
    this.on("change:DynamicData", selectDefault.bind(this));

    if (this.hasData()) {
      selectDefault.call(this);
    }
  };

  function selectDefault() {
    var item = this.getByValue(this.SelectedValue) || getDefaultSelection.call(this);
    this.select(item);
  }

  function getDefaultSelection() {
    var isSelectionRequired = (this.IsSelectionRequired === undefined) ? true : this.IsSelectionRequired;

    if (!isSelectionRequired || !this.hasData()) {
      return "";
    }

    return this.at(0);
  }

  Selection.prototype.selectAt = function(index) {
    var item = this.at(index);
    this.select(item);
  };

  Selection.prototype.selectByValue = function (value) {
    if (!this.hasData()) {
      return;
    }

    var item = this.getByValue(value);
    this.select(item);
  };

  Selection.prototype.select = function (item) {
    this.SelectedItem = item || getDefaultSelection.call(this);

    if (this.hasData()) {
      this.SelectedValue = this.SelectedItem ? this.getValue(this.SelectedItem) : "";
    }
  };

  Selection.prototype.toggleSelect = function (item) {
    if (this.SelectedItem === item && !this.IsSelectionRequired) {
      this.select();

      return;
    }

    this.select(item);
  };

  return Selection;
});