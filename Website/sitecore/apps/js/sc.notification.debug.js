(function ($) {
    $.widget("sc.notification", {
        options: {
            templates: {
                item: '<div class="notify-item-wrapper message-${item}"><div class="ui-corner-all notify-item ui-state-${item}">' +
                '<div class="notify-item-close"><span class="ui-icon ui-icon-circle-close"></span></div>' +
                '{{if showIcon}}<span class="ui-icon ui-icon-${item}"></span>{{/if}}' +
                '<span class="notify-item-content">' +
                '<div class="notify-item-text">{{html text}}</div>{{if links}}<div class="message-hint">{{each links}}<a href="#">${text}</a><br />{{/each}}</div>{{/if}}</span></div></div>',
                details: '<div class="details-notify"><div class="all-messages">' +
                '<div class="ui-corner-all notify-item ui-state-${group}"><span class="ui-icon ui-icon-${group}" />' +
                '<span class="notify-item-content" >${title}</span>' +
                '</div><div class="small-messages"><div class="small-messages-height"></div></div></div>'
            }
        },

        _create: function () {
            this.element.addClass('notify-wrapper');
            this.element.attr('data-name', this.options.name);
            this._all = [];
            var self = this;
            this.element.on('messageremove.notify', function () {
                self.element.find('.system-error').children().add(self.element.find('.temporary-messages').children()).add(self.element.find('.notifications').children()).size();
                self.element.find('.system-error').children().add(self.element.find('.temporary-messages').children()).add(self.element.find('.notifications').children()).size() ? $.noop() : self.element.css({ 'margin-bottom': '0px' });
                $('.grouped-notify', self.element).size() ? self.element.find('.small-messages').stop().animate({ height: self.group.find('.small-messages-height').height() + 'px' }, 500) : $.noop();
            });

            self.element.closest('.popup-instance') ? self.element.parent('div').prependTo(self.element.closest('.popup-instance').find('.thumbnails')) : $.noop();
        },
        send: function (message, type, sticky, links, append, id) {
            if (message) {
                var text = message.text || message;

                if (this.inQueue(text, id)) {
                    this.withdraw(text, id);
                }

                type = type || message.type || 'error';
                sticky = sticky == null ? (message.sticky == null ? true : message.sticky) : sticky;
                links = links || message.links;

                var current = this._message(text, type, sticky, links, append, id, message.global ? true : false)[0];
                current.uid = id;
                current.mid = text;
                this.element.css({ 'margin-bottom': '15px' });
                this._all.push(current);
            }
        },

        inQueue: function (message, id) {
            return this._find(message, id).size() > 0;
        },

        withdraw: function (message, id) {
            var elements = this._find(message, id),
                size = elements.size();
            elements.remove();
            this._all = $(this._all).filter(function () { return this != elements[0]; });
            return size;
        },

        _find: function (message, id, container) {
            if (id) {
                return $(this._all).filter(function () {
                    return this.uid == id && this.mid == message;
                });
            }

            if (container) {
                return container.find('.notify-item-text').filter(function () {
                    return $(this).html() == $("<div />").html(message).html();
                }).closest('.notify-item-wrapper');
            }

            return $.noop();
        },

        _message: function (text, type, permanent, links, append, id) {
            var message = $.tmpl(this.options.templates.item, { item: type, text: text, showIcon: true, 'links': links, id: id }),
                self = this;
            message.find('.message-hint a').each(function (i) {
                $(this).on('click', links[i].hint);
            });

            message.find('.ui-icon-circle-close').click(function () {
                message.height(0).detach();
                self._updateState();
                self.element.trigger('messageremove.notify');
            });
            return message;
        },

        _add: function (container, message, type, append) {
            append ?
                this._append(container, message, type) : 
                this._prepend(container, message, type);
        },

        _prepend: function (container, message, type) {
            var types = { 'error': '.message-error:first', 'warning': '.message-warning:first, .message-info:first', 'info': '.message-info:first' };
            var element = $(types[type], container).first();
            element.size() ?
                element.before(message) : 
                (type == 'error' ? container.prepend(message) : container.append(message));
        },

        _append: function (container, message, type) {
            var types = {
                'error': '.message-error:last, .message-warning:first, .message-info:first',
                'warning': '.message-warning:last, .message-info:first',
                'info': '.message-info:last'
            };
            var element = $(types[type], container).first();

            if (element.size()) {
                if (type == 'error' && !element.is(".message-error") ||
                    type == 'warning' && element.is(".message-info")) {
                    element.before(message);
                } else {
                    element.after(message);
                }
            } else {
                container.append(message);
            }
        },

        _links: function (links) {
            var content = $('<div class="notify-links"></div>');

            for (var i = 0; i < (links || []).length; i++) {
                var link = $('<a href="#">' + links[i] + '</a><br />');
                content.append(link);
            }

            return content;
        },

        destroy: function () {
            return $.Widget.prototype.destroy.call(this);
        }
    });
})(jQuery);﻿(function ($) {
    var prototype = $.sc.notification.prototype;

    $.widget("sc.notification", $.extend({ }, prototype, {
        _create: function() {
            prototype._create.apply(this, arguments);
            this.sticky = $('<div class="notifications"></div>').prependTo(this.element);
        },

        _find: function(message, id, container) {
            return prototype._find.apply(this, [message, id, this.sticky]);
        },

        _message: function(text, type, sticky, links, append) {
            var message = prototype._message.apply(this, arguments);
            if (sticky && this.sticky.children().size() == 0 && type != 'sys') {
                this._add(this.sticky, message, type, append);
            }
            return message;
        }
    }));

})(jQuery);﻿(function ($) {
    var prototype = $.sc.notification.prototype;

    $.widget("sc.notification", $.extend({}, prototype, {
        options: {
            duration: 3000
        },

        _create: function () {
            this.options = $.extend(true, {}, prototype.options, this.options);

            prototype._create.apply(this, arguments);
            this.quick = $('<div class="temporary-messages"></div>').prependTo(this.element);
        },

        _message: function (text, type, sticky, links, append) {
            var message = prototype._message.apply(this, arguments);
            if (!sticky && type != 'sys') {
                var self = this;
                this._add(this.quick, message, type, append);
                this._show(message);
                self._timeoutHide('quick', this.quick, message);
                //setTimeout(function () { self._hide(message) }, self.options.duration);
            }
            return message;
        },
        _timeoutHide: function (type, element, message) {
            var self = this;
            !this.hideTimeouts ? this.hideTimeouts = new Array() : $.noop();
            !this.hideTimeouts[type] ? this.hideTimeouts[type] = new Array() : $.noop();
            this.hideTimeouts[type].push(setTimeout(function () {
                self._hide(message);
            }, 10000));
            element.unbind('mouseover.notify').bind('mouseover.notify', function () {
                self.hideTimeouts[type] ? $.each(self.hideTimeouts[type], function () { clearTimeout(this); }) : $.noop();
            }).unbind('mouseout.notify').bind('mouseout.notify', function () {
                self.hideTimeouts[type].push(setTimeout(function () { element.find('.notify-item-wrapper').each(function() { self._hide($(this)); }); }, 10000));
            });
        },
        _show: function (message) {
            message.css({ 'height': '0px', 'opacity': 0 })
                .animate({ 'height': message.height() + 'px' }, 600, function (n) {
                    return function () { n.css({ 'height': 'auto' }).animate({ opacity: 1 }, 300); };
                } (message));
        },

        _hide: function (message) {
            var self = this;
            message.animate({ opacity: '0' }, 600, function () {
                message.animate({ height: '0px' }, 300, function () {
                    $.each(message, function () { $(this).detach().remove(); });
                    self.element.trigger('messageremove.notify');
                });
            });
        }
    }));

})(jQuery);﻿(function ($) {
    var prototype = $.sc.notification.prototype;

    $.widget("sc.notification", $.extend({}, prototype, {
        options: {
            templates: {
                group: '<div class="grouped-notify"><div class="messages">' +
                '<div class="notify-item"><span class="ui-icon" />' +
                '<span class="notify-item-content"><span></span><span class="more-info closed"> ${more}<span class="arrow-up-down">&nbsp&nbsp&nbsp&nbsp&nbsp</span></span></span>' +
                '</div><div class="small-messages"><div class="small-messages-height"></div></div></div>',
                description: "<span>${prefix} {{each value}} {{if count > 0}} ${count} ${type} {{/if}}{{/each}}</span>"
            }
        },

        _create: function () {
            this.options = $.extend(true, {}, prototype.options, this.options);
            prototype._create.apply(this, arguments);
        },

        withdraw: function (message, id) {
            if (prototype.withdraw.apply(this, arguments) && this.group) {
                this._close(this.group.find('.more-info'));
                this._updateState();
            }
        },

        _addGroup: function (container) {
            var group = $.tmpl(this.options.templates.group, { more: this.options.texts.moreDetails }),
                self = this;
            group.find('.more-info').click(function () { self._toggle($(this), container); });
            return group.appendTo(container || this.sticky);
        },

        _toggle: function (element) {
            var self = this;
            if (element.hasClass('closed')) {
                self._open(element);

            } else if (element.hasClass('opened')) {
                self._close(element);
            }
        },

        _open: function (element) {
            element.html(' ' + this.options.texts.lessDetails + ' <span class="arrow-up-down">&nbsp&nbsp&nbsp&nbsp&nbsp</span>').removeClass('closed').addClass('opened');
            element.closest('.messages')
                .addClass('shadow').addClass('radius')
                .find('.small-messages').stop().animate({ height: element.closest('.messages').find('.small-messages-height').height() + 'px' }, 500);
        },

        _close: function (element) {
            var self = this;
            element.html(' ' + self.options.texts.moreDetails + '...<span class="arrow-up-down">&nbsp&nbsp&nbsp&nbsp&nbsp</span>').addClass('closed').removeClass('opened');
            element.closest('.messages')
                .removeClass('shadow').removeClass('radius')
                .find('.small-messages:first').stop().animate({ height: '0px' }, 500, function () { 
                    //self.group.height(self.group.find('.messages').height());
                });
        },

        _message: function (text, type, sticky, links, append) {
            var count = this.sticky.children().size(),
                message = prototype._message.apply(this, arguments),
                self = this;

            if (sticky && count > 0 && type != 'sys') {
                this.group = this.group || this._addGroup();
                this.sticky.find('.notify-item-wrapper').detach().appendTo(this.group.find(".small-messages-height"));
                this._add(this.group.find(".small-messages-height"), message, type, append);
                message.find('.ui-icon-circle-close').click(function () {
                    self._updateState();
                    $(this).closest('.small-messages').stop().animate({ height: self.element.closest('.messages').find('.small-messages-height').height() + 'px' }, 500);
                });
            }
            this._updateState();
            return message;
        },

        _updateState: function () {
            if (this.group) {
                var first = $('.notify-item-wrapper', this.group).show().first(),
                    self = this;

                if ($('.notify-item-wrapper', this.group).size() < 2) {
                    $('.notify-item-wrapper', this.group).detach().prependTo(this.sticky);
                    this.group.empty();
                    this.group.height(0).remove();
                    this.group = null;
                    return;
                }
                
                $('.notify-item:first', this.group)
                    .removeClass('ui-state-error ui-state-warning ui-state-info')
                    .addClass("ui-state-" + (first.hasClass('message-error') ? "error" : first.hasClass('message-warning') ? "warning" : "info"))
                    .find('.notify-item-content span:first').html(this.options.texts && this.options.texts.pageContainsProblems ? this.options.texts.pageContainsProblems : '');
                this.group.css('height', 'auto'); //this.find('small-messages', group).css('height', 'auto');
            }
        }
    }));

})(jQuery);﻿(function ($) {
    var prototype = $.sc.notification.prototype;

    $.widget("sc.notification", $.extend({}, prototype, {
        _create: function () {
            prototype._create.apply(this, arguments);
            this.system = $('<div class="system-error"></div>').prependTo(this.element);
            this._bind();
        },

        _bind: function () {
            var self = this;

            this._onmessagesendref = function (e, m) {
                self._onmessagesend(e, m);
                e.stopImmediatePropagation();
            };
            this._onvalidatehiglightref = function (e, v) {
                self._onvalidatehiglight(e, v);
                e.stopPropagation();
            };
            this._onvalidateunhighlightref = function (e, v) {
                self._onvalidateunhighlight(e, v);
                e.stopPropagation();
            };
            this._onresponseerrorref = function (e, t) {
                self._onresponseerror(e, t);
                $(e.target).trigger('hidespinner');
                e.stopImmediatePropagation();
            };
            this.element.closest('body').off('validatehighlight').on('validatehighlight', function () {
            });
            this.element.closest('.popup-content, body').first().add(this.element.closest('form'))
                .on('validatehighlight.notification', this._onvalidatehiglightref)
                .on('validateunhighlight.notification', this._onvalidateunhighlightref)
                .on('messagesend.notification', this._onmessagesendref)
                .on('responseerror.notification', this._onresponseerrorref);

            if (this.options.beforeunload) {
                this._onbeforeunloadref = function (e, s) { return self._onbeforeunload(e, s); };
                $(window).add(this.element.closest('form')).on('beforeunload', this._onbeforeunloadref);
            }
        },

        _onbeforeunload: function (e, s) {
            e.stopPropagation();
            s = s || {};
            $.netajax(this.element, "beforeunload", false)
                .done(function (data) {
                    s.message = data.message;
                    s.modified = s.modified || data.modified;
                });


            if (s.modified) {
                e.stopImmediatePropagation(e);
                return s.message;
            }
            return undefined;
        },

        _onmessagesend: function (e, m) {
            this.send(m);
        },

        _onvalidatehiglight: function (e, v) {
            if (v.hidden || v.submitted) {
                var self = this;
                this.send(v.message || v.text, v.type || v.item, true,
                    v.links ?
                        v.links :
                        [{
                            text: self.options.texts && self.options.texts.goToField ? self.options.texts.goToField : '',
                            hint: function () {
                                if ($(v.element).is(':hidden')) {
                                    $(v.element).closest('.directed').tabstrip('showTab', $(v.element).closest('.tab').index());
                                    $(v.element).trigger('showhiddenvalidator');
                                }
                                $(v.element).trigger('validatefocus', [v.element]);
                                $(v.element).focus();
                                self._close(self.element.find('.more-info'));
                                return false;
                            }
                        }], true, v.element || v.id);
            }
        },

        _onvalidateunhighlight: function (e, v) {
            this.withdraw(v.message, v.element);
        },

        _onresponseerror: function (e, t) {
            if (t && t != '<br/>') {
                this.send(t, 'sys', true);
            }
        },

        _message: function (text, type, sticky, links, append) {
            var message = prototype._message.apply(this, arguments);
            if (type == 'sys') {
                this.system.html('');
                var self = this,
                    group = this.system,
                    title = /<title>([\s\S]*)<\/title>/.exec(text);

                if (title) {
                    group = this._addGroup(this.system.html(''));
                    this._toggle(group);
                    group.find('.notify-item').addClass('ui-state-sys').find('.ui-icon').addClass('ui-icon-sys');
                    group.find('.notify-item-content span:first').html(title[1]);
                    this._add(group.find('.small-messages-height'), message, type, append);
                } else {
                    this._add(group, message, type, append);
                }
                this.system.height(this.system.find('.messages').height());
            }
            return message;
        },

        destroy: function () {
            this.element.closest('.popup-content, body').first().add(this.element.closest('form')).off('messagesend.notification', this._onmessagesendref)
                .off('validatehighlight.notification', this._onvalidatehiglightref)
                .off('validateunhighlight.notification', this._onvalidateunhighlightref)
                .off('responseerror.notification', this._onresponseerrorref);
            if (this.options.beforeunload) {
                $(window).off('beforeunload', this._onbeforeunloadref);
            }
            prototype.destroy.apply(this, arguments);
        }
    }));

})(jQuery);﻿(function ($) {
    var prototype = $.sc.notification.prototype;

    $.widget("sc.notification", $.extend({}, prototype, {
        _create: function () {
            prototype._create.apply(this, arguments);
            this.global = $('<div class="global-messages"></div>').prependTo($('body form:first'));
        },
        _message: function (text, type, sticky, links, append, id, global) {
            var message = prototype._message.apply(this, arguments);
            if (global) {
                var self = this;
                this._add(this.global, message, type, append);
                this.global.find('.notify-item:first').css('height', $('.header').outerHeight() + 'px').wrapInner('<div class="page"></div>');
                this._show(message, true);
                self._timeoutHide('global', this.global, message);
            }
            return message;
        },
        _show: function (message, global) {
            if (global) {
                var height = message.height();
                message.find('.notify-item').css({});
                message.css({ 'height': '0px', opacity: 1 })
                    .animate({ 'height': height + 'px' }, 150, function (n) {
                        return function() {
                        };
                    } (message));

            } else {
                prototype._show.apply(this, arguments);
            }
        },
        _hide: function (message, global) {
            if (global) {

                var height = message.height();
                message.animate({ 'height': '0px' }, 150, function (n) {
                    return function () { n.css({ 'position': 'static', bottom: 'auto', left: 'auto', display: 'none' }); };
                } (message));

            } else {
                prototype._hide.apply(this, arguments);
            }
        },
        destroy: function () {

            prototype.destroy.apply(this, arguments);
        }
    }));

})(jQuery);






﻿
if (typeof (Sys) !== 'undefined') {
    Sys.Browser.WebKit = {};
    if (navigator.userAgent.indexOf('WebKit/') > -1) {
        Sys.Browser.agent = Sys.Browser.WebKit;
        Sys.Browser.version = parseFloat(navigator.userAgent.match(/WebKit\/(\d+(\.\d+)?)/)[1]);
        Sys.Browser.name = 'WebKit';
    }
    Sys.Application.notifyScriptLoaded();
}