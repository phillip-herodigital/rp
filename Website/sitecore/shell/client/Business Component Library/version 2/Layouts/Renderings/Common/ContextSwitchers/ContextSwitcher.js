(function (speak) {
  speak.component({
    name: "ContextSwitcher",
    initialize: function () {
      this.$el = $(this.el);
      this.defineProperty("IsOpen", false);
    },
    initialized: function () {
      this.on("change:Items", this.updateItems, this);
    },
    _setupButtons: function (items) {
      var columns = items.length === 1 ? 1 : items.length > 12 ? 3 : 2;
      var rows = Math.ceil(items.length / columns);
      var selectedItemIndex = 0;
      var i = 0;
      if (items.length >= 12 && items.length <= 18) {
        rows = 6;
      }
      this.Scrollable = ( items.length > 18);
      for (var r = 0; r < rows; r++) {
        $('.sc-contextswitcher-table').append('<div class="sc-contextswitcher-row"/>');
        for (var c = 0; c < columns; c++) {
          $('.sc-contextswitcher-row:last').append('<div class="sc-contextswitcher-cell"/>');
          var element = "";
          if (items[i]) {
            selectedItemIndex = items[i].Selected ? i : selectedItemIndex;
            element = "<button index='" + i + "' class='sc-contextswitcher-item'";
            element += items[i].Tooltip ? " title='" + items[i].Tooltip + "'" : "";
            element += ">" + items[i].Name + "</button>";
          }
          $('.sc-contextswitcher-cell:last').append(element);
          i++;
        }
      }
      this.updateSelectedItem(selectedItemIndex);
    },
    updateItems: function () {
      this.$el.find(".sc-contextswitcher-table").html('');
      var items = this.Items;
      if (!items || !items.length) {
        this.Text = "";
        return;
      }
      this._setupButtons(items);
      this._addClickEvents();
    },
    _addClickEvents: function () {
      var that = this;
      this.$el.find(".sc-contextswitcher-item").on("click", function (e) {
        var index = this.getAttribute('index');
        var item = that.Items[index];

        that.updateSelectedItem(index);
        that.IsOpen = false;

        if (item.Click) {
          var invocation = item.Click;

          if (invocation) {
            var i = invocation.indexOf(":");
            if (i <= 0) {
              throw "Invocation is malformed (missing 'handler:')";
            }

            speak.module("pipelines").get("Invoke").execute({
              control: that,
              app: that.app,
              handler: invocation.substr(0, i),
              target: invocation.substr(i + 1)
            });
          }
        }
      });
    },
    toggle: function () {
      this.IsOpen = (!this.IsOpen && this.IsEnabled);
    },
    updateSelectedItem: function (index) {
      this.Text = this.Items[index].Name;
      this.$el.find('button').removeClass("selected");
      this.$el.find('button[index=' + index + ']').addClass("selected");
    }
  });
})(Sitecore.Speak);