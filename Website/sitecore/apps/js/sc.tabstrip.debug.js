(function ($) {

    $.widget("sc.tabstrip",
    {
        options: {
            tabSelector: '> .tabs li',
            paneSelector: '> .tab'
        },
        _create: function () {

            var self = this,
            options = self.options;
            this.storage = new $.Storage();
            if (!options.active && options.active !== 0) {
                options.active = 0;
                options.active = this.storage.get(this.element.attr('id'));
                options.active = parseInt(isNaN(options.active) || !options.active ? 0 : options.active, 10);
                if (!options.active) {
                    options.active = 0;
                    this.storage.set(this.element.attr('id'), options.active);
                }
            }
            var tabs = this.getTabs();
            tabs.each(function (index) {
                $(this).addClass(index ? '' : 'first').css('z-index', tabs.length - index);
            });
            this.element.addClass('directed');
            this._bind();
            this._showTab(options.active);
            self.currentPane().triggerHandler('contentshow');
        },
        _bind: function () {
            var tabs = this.getTabs(),
				panes = this.getPanes(),
				self = this,
				options = this.options;
            $.each(tabs, function (index) {
                $(this).find('a').on('click', function () {
                    options.beforeClick ? options.beforeClick() : $.noop();
                    self.currentPane().triggerHandler('contenthide');
                    self._showTab(index);
                    options.onClick ? options.onClick() : $.noop();
                    self.currentPane().triggerHandler('contentshow');
                    $('.sc-button').trigger('over.combobox');
                    $('.popup-menu').trigger('over.combobox');
                    $('body').trigger('click');
                    self.storage.set(self.element.attr('id'), self.getIndex());
                    return false;
                });
            });
            $.each(panes, function (index) {
                //var pane = this;
                $(this).on('validatefocus', function () {
                    $(tabs[index]).find('a').trigger('click');
                });
            });
        },
        getIndex: function () {
            var index = 0;
            this.getTabs().each(function (i) { $(this).find('a').hasClass('current') ? index = i : $.noop(); });
            return index;
        },
        currentPane: function () {
            return this.getPanes().filter(function (i) { return $(this).hasClass('current'); });
        },
        currentTab: function () {
            return this.getTabs().filter(function (i) { return $(this).hasClass('current'); });
        },
        getTabs: function () {
            return this.element.find(this.options.tabSelector);
        },
        getPanes: function () {
            return this.element.find(this.options.paneSelector);
        },
        _showTab: function (index) {
            var tabs = this.getTabs(),
				panes = this.getPanes();
            tabs.find('a').removeClass('current');
            panes.removeClass('current');
            tabs.filter(function (i) { return index == i; }).find('a').addClass('current');
            panes.filter(function (i) { return index == i; }).addClass('current');
        },
        showTab: function (index) {
            this._showTab(index);
        },
        destroy: function () {
            return $.Widget.prototype.destroy.call(this);
        }

    });

})(jQuery);﻿
if (typeof (Sys) !== 'undefined') {
    Sys.Browser.WebKit = {};
    if (navigator.userAgent.indexOf('WebKit/') > -1) {
        Sys.Browser.agent = Sys.Browser.WebKit;
        Sys.Browser.version = parseFloat(navigator.userAgent.match(/WebKit\/(\d+(\.\d+)?)/)[1]);
        Sys.Browser.name = 'WebKit';
    }
    Sys.Application.notifyScriptLoaded();
}