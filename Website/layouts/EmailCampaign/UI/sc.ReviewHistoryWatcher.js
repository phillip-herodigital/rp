(function ($) {
  $.widget('sc.ReviewHistoryWatcher', {
    options: {
      messageId: null,
      activeReviews: null,
      checkInterval: 30000
    },
    reviewsToAppend: new Array(),
    timer: null,

    _create: function () {
      var self = this;

      options = this.options;
      self._init_request();

      $("body").off('append.ReviewHistoryWatcher').on('append.ReviewHistoryWatcher', function (event, data) {
        self.reviewsToAppend.push(data);
      });
    },

    _init_request: function () {
      var self = this;
      $.netajax(self.element, 'initialize');
    },

    initialize: function (data) {
      var self = this;
      self._setOption('messageId', data.messageId);
      self._setOption('activeReviews', JSON.parse(data.activeReviews));
      self.start();
    },

    _setOption: function (name, value) {
      $.Widget.prototype._setOption.apply(this, arguments);
    },

    destroy: function () {
      return $.Widget.prototype.destroy.call(this);
    },

    start: function () {
      var self = this;
      self.stop();
      self.timer = window.setTimeout(function () { self._tick(); }, self.options.checkInterval);
    },

    stop: function () {
      if (this.timer)
        window.clearTimeout(this.timer);
    },

    _tick: function () {
      var self = this;
      self._check();
    },

    _check: function () {
      var self = this;

      if ((self.options.activeReviews && (self.options.activeReviews.EmailPreviews.length > 0 || self.options.activeReviews.SpamChecks.length)) || (self.reviewsToAppend && self.reviewsToAppend.length > 0)) {
        $.ajax({
          context: self,
          type: "POST",
          contentType: "application/json; charset=utf-8",
          url: "/layouts/EmailCampaign/UI/ReviewHistory.asmx/GetActiveReviews",
          data: "{'messageId': '" + self.options.messageId + "', 'messageReviews' : " + JSON.stringify(self.options.activeReviews) + ", 'reviewsToAppend' : " + JSON.stringify(self.reviewsToAppend) + "}",
          dataType: "json"
        }).done(self._checked);

        self.reviewsToAppend = new Array();
      }

      self.start();
    },

    _checked: function (data) {
      var self = this;

      self._setOption('activeReviews', data.d.MessageReviews);
      self._notify(data.d.CompletedMessages);

      self.start();
    },

    _notify: function (messages) {
      if (messages && messages.length > 0) {
        for (var message in messages) {
          $("body").triggerHandler('messagesend', { text: messages[message], type: 'info', sticky: true });
        }
      }
    }

  });
})(jQuery);