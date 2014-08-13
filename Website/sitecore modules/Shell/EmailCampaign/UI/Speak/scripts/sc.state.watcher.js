var stateWatcherLock = false;

(function ($) {
  $.widget('sc.StateWatcher', {
    options: {
      messageId: '',
      messageState: '',
      sendingState: '',
      initialState: '',
      inactiveState: '',
      finalState: '',
      statusCheckTimer : {interval : 10000},
      sendingTickTimer : {interval : 30000}
    },

    _timerId : null,

    _startTimer : function () {
      var self = this;
      self._stopTimer();
      self._timerId = window.setInterval(function (){ self._timerTick(self.element);}, self.options.sendingTickTimer.interval);
    },
    
    _stopTimer : function () {
      var self = this;
      if (self._timerId) {
        window.clearInterval(self._timerId);
      }
    },
    
    _timerTick : function (element) {
      if (element){
        $.netajax(element, 'TimerTick', true);
      }
    },

    _considerToggleTimer : function (currentState, startTimerState) {
      var self = this;
      if (currentState === startTimerState) {
        self._startTimer();
      }
      else {
        self._stopTimer();
      }
    },

    _create: function () {
      options = this.options;
    },

    _watcherCallback: function (data) {
      var self = this,
          o = self.options;
      
      if (data.d != o.messageState) {
        o.messageState = data.d;
        self._considerToggleTimer(o.messageState, o.sendingState);
        if (data.d != o.initialState) {
          $.netajax(self.element, 'StateWatcherChanged', true);
        }
      }

      if (o.messageState != o.finalState) {
        self._delayedRequest();
      } else {
        stateWatcherLock = false;
      }
    },

    _delayedRequest: function () {
      var self = this;

      setTimeout(function () {
        $.ajax({
          context: self,
          type: "POST",
          contentType: "application/json; charset=utf-8",
          url: "/layouts/EmailCampaign/UI/MessageStateService.asmx/GetMessageState",
          data: "{'id': '" + self.options.messageId + "'}",
          dataType: "json"
        }).done(self._watcherCallback);
      }, self.options.statusCheckTimer.interval);
    },

    start: function () {
      if(!stateWatcherLock) {
        stateWatcherLock = true;
        this._delayedRequest();
        this._considerToggleTimer(this.options.messageState, this.options.sendingState);
      }
    },

    destroy: function () {
      return $.Widget.prototype.destroy.call(this);
    }
  });
})(jQuery);