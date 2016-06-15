(function (speak) {
  speak.component({
    name: "SmartPanel",
    initialize: function () {
      this.$el = $(this.el);
    },
    initialized: function () {
      //hide the panel and set position class for display
      this.$el.hide().addClass('panel-' + this.Position);
      //reset any defined a positions
      this.$el.css('left', '').css('right', '').css('top', '').css('bottom', '');

      //set a default top value for left and right positions
      //and set the starting position based on element width
      var cssOptions = {};
      cssOptions['border-' + this.Position] = 0;

      if (this.Position === 'left' || this.Position === 'right') {
        if (isNaN(this.OffsetBottom)) {
          this.OffsetBottom = 0;
        }
        if (isNaN(this.OffsetTop)) {
          this.OffsetTop = 0;
        }

        cssOptions['top'] = this.OffsetTop;
        cssOptions['bottom'] = this.OffsetBottom;
        cssOptions[this.Position] = -this.$el.width();

        if (this.OffsetTop === 0) {
          cssOptions['border-top'] = 0;
        }

        if (this.OffsetBottom === 0) {
          cssOptions['border-bottom'] = 0;
        }

        this.$el.css(cssOptions);
      }

      //set a default left value for top and bottom positions
      //and set the starting position based on element height
      if (this.Position === 'top' || this.Position === 'bottom') {
        cssOptions['left'] = 0;
        cssOptions[this.Position] = -this.$el.height();
        cssOptions['border-left'] = 0;
        cssOptions['border-right'] = 0;
        this.$el.css(cssOptions);
      }

      this.on("change:IsOpen", this._changeStatus, this);
      this.on("change:OffsetTop", this._changeOffsetTop, this);
    },
    _changeOffsetTop: function () {
      this.$el.css({ 'top': this.OffsetTop });
    },
    open: function () {
      this.IsOpen = true;
    },
    toggle: function () {
      this.IsOpen = !this.IsOpen;
    },
    close: function (e) {
      if (e && e.target) {
        e.preventDefault();
      }
      this.IsOpen = false;
    },
    _changeStatus: function () {
      if (this.IsOpen) {
        this.expand();
      } else {
        this.collapse();
      }
    },
    expand: function () {
      var panelOptions = {},
          bodyOptions = {};

      panelOptions.visible = 'show';
      this.IsVisible = true;
      
      panelOptions[this.Position] = 0;
      bodyOptions[this.Position] = (this.Position === 'top' || this.Position === 'bottom') ? this.$el.height() : this.$el.width();
      
      this.$el.animate(panelOptions, 100);
    },
    collapse: function () {
      var panelOptions = {},
          bodyOptions = {};

      panelOptions.visible = 'hide';
      this.IsVisible = false;
      
      panelOptions[this.Position] = -(this.$el.width());
      bodyOptions[this.Position] = 0;
      this.$el.animate(panelOptions, 100);
    }
  });
})(Sitecore.Speak);