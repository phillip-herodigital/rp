define(["sitecore"], function (Sitecore) {
  return Sitecore.Factories.createBehavior("ScrollToMessage", {
    afterRender: function () {
      this.messageCountOldValue = 0;
      this.model.on({
        'change:totalMessageCount': this.onMessageCountChanged
      }, this);
    },

    isMessageBarOnAScreen: function () {
      var element = this.$el.get(0),
        clientRect = element.getBoundingClientRect();

      return clientRect.top >= 0 && clientRect.bottom <= window.innerHeight;
    },

    onMessageCountChanged: function () {
      var messageCount = this.model.get("totalMessageCount");
      if (
        messageCount > this.messageCountOldValue &&
        this.$el.is(':visible') &&
        !this.isMessageBarOnAScreen()
        ) {
        var globalHeaderHeight = $('.sc-globalHeader').outerHeight();
        $('html, body').animate({
          scrollTop: this.$el.offset().top - globalHeaderHeight
        }, 500);
      }
      this.messageCountOldValue = messageCount;
    }
  });
});