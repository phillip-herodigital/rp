(function ($) {
    $.widget("sc.spinner", {
        options: {
            icon: "/sitecore/apps/img/sc-spinner16.gif",
            text: "",
            type: 'global',
            endless: false,
            position: 'right',
            hidetimeout: 3000
        },
        _create: function () {
            $('*[data-target-id = ' + this.element.attr('id') + ']').size() ?
            $('*[data-target-id = ' + this.element.attr('id') + ']').remove() :
             $.noop();
            this._bind();
        },
        _bind: function () {
            var self = this;
            self.element.on('click show.spinner', function (e) { //e.stopPropagation();
                if (!(self.element.parents('form:first').find('.error-field').size() && e.target.type === "submit")) {
                    self.display();
                } else {
                    return false; 
                }
            });
        },
        display: function () {
            var self = this;
            self._render();
            self.show();
            self.element.parents('form:first').off('submit.spinner').on('submit.spinner', function () {
                self.element.off('click.spinner show.spinner').on('click.spinner show.spinner', function () {
                    return false;
                });
            });
        },
        show: function () {
            if (this.spinner) {
                this.spinner.show();
            }
        },

        hide: function () {
            if (this.spinner) {
                var self = this;
                this.spinner.remove();
                this.spinner = false;
            }
        },
        _render: function (tmplOptions) {
            var self = this;
            if (self.spinner) {
                self.timeout ? clearTimeout(self.timeout) : $.noop();
                self.spinner.remove();
            }
            var prepend = self.element.closest('.tab.current').size() && self.options.type == 'inline' ? '.tab.current' : 'body';
            self.spinner = $.tmpl(self.options.templates[self.options.type], tmplOptions ? tmplOptions : self.options).attr('data-target-id', self.element.attr('id')).prependTo(self.element.closest(prepend));
            self.element.closest('form').on('responsesuccess.spinner responseerror.spinner hidespinner.spinner', function (e) {
                if (!self.options.endless) {
                    self.hide();
                    self.element.off('click.spinner');
                    self.element.closest('form').off('responsesuccess.spinner responseerror.spinner');
                }
            });
            self.element.closest('form').on('hidespinner.spinner', function () { self.hide(); });

        },
        destroy: function () {
            return $.Widget.prototype.destroy.call(this);
        }
    });

})(jQuery); 

﻿(function ($) {
    var prototype = $.sc.spinner.prototype;

    $.widget("sc.spinner", $.extend({ }, prototype, {
        _create: function() {
            !this.options.templates ? this.options.templates = { } : $.noop();
            this.options.templates = $.extend({ }, this.options.templates, { 'global': '<div class="spinner-global"><div class="sc-cover"></div><div class="spinner"><img src="${icon}" /><p>${text}</p></div></div>' });
            prototype._create.apply(this, arguments);
        }
    }));

})(jQuery);﻿(function ($) {
    var prototype = $.sc.spinner.prototype;

    $.widget("sc.spinner", $.extend({}, prototype, {
        _create: function () {
            !this.options.templates ? this.options.templates = {} : $.noop();
            this.options.templates = $.extend({}, this.options.templates, { 'inline': '<div class="spinner-inline">{{if icon}}<img src="${icon}" />{{/if}}<span>${text}</span></div></div>' });
            prototype._create.apply(this, arguments);

        },
        show: function () {
            var self = this;
            prototype.show.apply(this, arguments);
            if (this.options.type == "inline") {
                self.element.addClass('ui-state-disabled');
            }
        },
        hide: function () {
            var self = this;
            prototype.hide.apply(this, arguments);
            if (this.options.type == "inline") {
                self._render({ text: self.options.responseMessage });
                self.timeout = setTimeout(function () {
                    self.spinner ? self.spinner.animate({ 'opacity': '0' }, 300,
                        function () {
                            self.element.removeClass('ui-state-disabled');
                            self.spinner.remove();
                            self.spinner = false;
                        }) : $.noop();
                }, self.options.hidetimeout);
            }
        },
        _render: function (tmplOptions) {
            var self = this;
            prototype._render.apply(this, arguments);
            if (self.options.type == "inline") {
                $(self.spinner).css({ 'top': self.element.offset().top });
                (self.options.position == 'left' || (!self.options.position && self.element.next().size())) ? $(self.spinner).css({ 'right': $('body').width() - self.element.offset().left }) : $.noop();
                (self.options.position == 'right' || (!self.options.position && !self.element.next().size())) ? $(self.spinner).css({ 'left': self.element.offset().left + self.element.outerWidth() }) : $.noop();
            }
        }
    }));

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