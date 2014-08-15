(function ($) {

    $.widget("sc.reviewresult", {

        options: {
            mode: null
            , tabPath: []
            , refreshInterval: 0
        },

        _refreshTimer: null,

        _create: function () {
            var self = this;

            $(document).on('showreport.' + self.options.mode, $.proxy(self._showReportEventHandler, self));
            $(document).on('stoprefreshing.' + self.options.mode, $.proxy(self._stopRefreshingEventHandler, self));

            if (self.options.refreshInterval && self.options.refreshInterval > 0) {
                self._refreshTimer = window.setInterval($.proxy(self.refreshReport, self), self.options.refreshInterval);
            }
        },

        _stopRefreshingEventHandler: function (event, data) {
            var self = this;

            if (!data) {
                return;
            }

            if (data.mode === self.options.mode) {
                self.stopRefreshing();
            }
        },

        stopRefreshing: function () {
            var self = this;
            if (self._refreshTimer) {
                window.clearInterval(self._refreshTimer);
            }
        },

        _navigateToParentTab: function () {
            var tabPath = this.options.tabPath;
            if (!tabPath) {
                return;
            }

            var length = tabPath.length;
            if (length < 1) {
                return;
            }

            for (var i = 0; i < length; i++) {
                var tabInfo = tabPath[i];
                $('#' + tabInfo.clientId).tabstrip('showTab', tabInfo.tabIndex);
            }
        },

        refreshReport: function () {
            $.netajax(this.element, "refresh", true);
        },

        _showReportEventHandler: function (event, data) {
            var self = this;

            if (!data) {
                return;
            }

            if (data.mode === self.options.mode) {
                self.showReport(data.reportKey);
            }

        },

        showReport: function (reportKey) {
            var self = this;
            self._navigateToParentTab();
            $.netajax(self.element, "showreport:" + reportKey, true);
        },

        destroy: function () {
            var self = this;

            $(document).off('.' + self.options.mode, self._showReportEventHandler);
            $(document).off('.' + self.options.mode, self._stopRefreshingEventHandler);

            self.stopRefreshing();

            $.Widget.prototype.destroy.apply(this);
        }

    });
})(jQuery);

function showPreviewReport(data) {
    $(document).trigger('showreport', { mode: 'EmailPreview', reportKey: data });
}

function showSpamCheckReport(data) {
    $(document).trigger('showreport', { mode: 'SpamCheck', reportKey: data });
}