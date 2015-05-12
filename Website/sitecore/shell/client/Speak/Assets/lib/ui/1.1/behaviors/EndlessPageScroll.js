define(["sitecore"], function (Sitecore) {
  var SCROLL_PADDING = 50;

  Sitecore.Factories.createBehavior("EndlessPageScroll", {
    setupEventHandlers: _.once(function () {
      $(document).on("scroll", this.scrollHandler.bind(this));
    }),

    beforeRender: function () {
      this.setupEventHandlers();
    },

    scrollHandler: function (e) {
      if (this.model.get("isEndlessScrollEnabled") && this.isScrolledToBottom()) {
        this.invokeMoreData();
      }
    },

    isScrolledToBottom: function () {
      return $(window).scrollTop() + $(window).height() >= $(document).height() - SCROLL_PADDING;
    },

    invokeMoreData: function () {
      var invocation = this.$el.data("sc-scrollmoredata");
      if (invocation) {
        _sc.Helpers.invocation.execute(invocation, { control: this, app: this.app });
      }
    }
  });
});