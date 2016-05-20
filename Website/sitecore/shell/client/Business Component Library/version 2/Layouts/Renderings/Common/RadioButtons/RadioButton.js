(function (speak) {
  speak.component({
    name: "RadioButton",
    initialized: function () {
      this.onCheckChange();
      this.on("change:IsChecked", this.onCheckChange);
    },
    onCheckChange: function () {
      if (this.IsChecked) {
        var self = this;
        this.app.components.forEach(function (c) {
          if (c.id !== self.id && c.key === self.key && c.GroupName === self.GroupName) {
            c.IsChecked = false;
          }
        });
        this.viewModel.IsChecked(this.Value);
        this.app[this.GroupName] = this.Value;
      }
    }
  });
})(Sitecore.Speak);