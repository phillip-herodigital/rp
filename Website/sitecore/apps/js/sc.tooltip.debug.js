(function ($) {
    $.widget("sc.tooltip", {
        options: {
            position: ['top', 'left'],
            offset: [0, 0],
            relative: true,
            maxWidth: 300,
            type: 'simple',
            effect: 'simple',
            templates: {
                simple: '{{if direction == "bottom"}}<div class="tooltip-pointer tooltip-pointer-top"></div>{{/if}}<div class="tooltip-content">{{html text}}</div>{{if direction == "top"}}<div class="tooltip-pointer tooltip-pointer-bottom"></div>{{/if}}'
            }
        },

        _create: function () {
            var options = this.options,
                trigger = false;
            this.trigger = this.options.trigger ? typeof (this.options.trigger) == 'String' ? $(this.options.trigger) : this.options.trigger : this.element;
            this.triggerInitialOffset = this.trigger.offset();
            this.options.text = this.options.text ? this.options.text : this.trigger.attr('title');
            this._render();
            this._bind();
            this.triggerTitle = this.trigger.attr('title');
            this.trigger.attr('title', '');
        },
        _position: function () {

            var popupOffset = this.element.parents('.popup-instance:first').size() ? this.element.parents('.popup-instance:first').offset() : { top: 0, left: 0 },
                triggerOffset = this.trigger.size() ? this.trigger.offset() : { top: 0, left: 0 };
            triggerOffset = { top: triggerOffset.top - popupOffset.top, left: triggerOffset.left - popupOffset.left };
            if (!this.css || this.triggerInitialOffset.top != this.trigger.offset().top || this.triggerInitialOffset.left != this.trigger.offset().left) {
                this.tooltip ? this.tooltip.css('display', 'block') : $.noop();
                this.trigger && this.tooltip ? this.css = {
                    'top': this.options.position[0] == 'top' ?
                        (triggerOffset.top - this.tooltip.outerHeight() + (this.options.offset ? -this.options.offset[0] : $.noop())) + 'px' :
                        this.options.position[0] == 'bottom' ?
                        (triggerOffset.top + this.trigger.outerHeight() + (this.options.offset ? +this.options.offset[0] : $.noop())) + 'px' :
                        Math.round((triggerOffset.top - this.tooltip.outerHeight() / 2)) + 'px',
                    'left': (this.options.position[1] == 'left' ?
                        triggerOffset.left + (this.options.offset ? +this.options.offset[1] : 0)  + (this.trigger.outerWidth() / 2) - 27 + 'px' : 
                        this.options.position[1] == 'right' ?
                        triggerOffset.left + (this.options.offset ? +this.options.offset[1] : 0) - this.tooltip.outerWidth() + this.trigger.outerWidth() - (this.trigger.outerWidth() / 2) + 27 + 'px' :

                        this.trigger.outerWidth() >= this.tooltip.outerWidth() ?
                        (Math.round((triggerOffset.left + (this.trigger.outerWidth() / 2) - this.tooltip.outerWidth() / 2)) + 'px') :
                        (Math.round((triggerOffset.left - (this.tooltip.outerWidth() / 2) + this.trigger.outerWidth() / 2))) + 'px')
                } : $.noop();

                this.options.position[1] == 'left' ?
                    $('.tooltip-pointer-top, .tooltip-pointer-bottom').css({ 'margin-left': $('.tooltip-pointer').width() }) : $.noop();
                this.options.position[1] == 'right' ?
                    $('.tooltip-pointer-top, .tooltip-pointer-bottom').css({ 'margin-left': this.tooltip.outerWidth() - 37 }) : $.noop();

                this.tooltip ? this.tooltip.css('display', 'none') : $.noop();
                this.triggerInitialOffset = this.trigger.offset();
            }
            return this.css;
        },
        _render: function () {
            var container = this.option.container ? this.option.container : (this.element.closest('form').size() ? this.element.closest('form') : $('body form:first'));
            this.tooltip = container.find('.tooltip').size() ? container.find('.tooltip') :
                $('<div class="tooltip"></div>').appendTo(container.size() ? container : $('body form:first')).css({ 'max-width': this.options.maxWidth + 'px', 'position': 'absolute', 'float': 'left' });
        },
        _content: function () {
            this.content = this.content ? this.content : $.tmpl(this.options.templates[this.options.type], { 'direction': this.options.position[0], 'text': this.options.text });
            return this.content;
        },
        _bind: function () {
            var self = this;
            this.trigger.off('mouseenter.tooltip').on('mouseenter.tooltip', function () {
                self._effectStart();
            }).off('mouseleave.tooltip click.tooltip').on('mouseleave.tooltip click.tooltip', function () {
                self._effectEnd();
            });
        },
        _effectStart: function (done) {
            this.tooltip.append(this._content());
            this.options.className ? this.tooltip.addClass(this.options.className) : $.noop();
            this.tooltip ? this.tooltip.css(this._position()) : $.noop();
            this.effects[this.options.effect] ? this.effects[this.options.effect]['effectStart'].call() : $.noop();
        },

        _effectEnd: function (done) {
            this.options.className ? this.tooltip.removeClass(this.options.className) : $.noop();
            this.tooltip ? this.options.delay ? this.tooltip.delay(this.options.delay).hide(done ? done : $.noop()) : this.tooltip.hide(done ? done : $.noop()) : $.noop();
            this.effects[this.options.effect] ? this.effects[this.options.effect]['effectEnd'].call() : $.noop();
            this.content = this._content().detach();
        },
        destroy: function () {
            this.tooltip.empty();
            return $.Widget.prototype.destroy.call(this);
        }
    });

})(jQuery);﻿(function ($) {
    var prototype = $.sc.tooltip.prototype;

    $.widget("sc.tooltip", $.extend({}, prototype, {
        _create: function () {
            this.options.templates = $.extend({}, this.options.templates,
                { advanced: '{{if direction == "bottom"}}<div class="tooltip-pointer-top"></div>{{/if}}' +
                    '<div class="tooltip-content"><div class="tooltip-content-inner">{{if html}}{{html html}}' +
                    '{{else}}' +
                    '{{if img}}<div class="tooltip-img"><img src="${img}"></img></div>{{/if}}' +
                    '{{if img}}<div class="tooltip-info">{{/if}}{{if title}}<div class="tooltip-title">${title}</div>{{/if}}' +
                    '{{if text}}<div class="tooltip-text">{{html text}}</div>{{/if}}' +
                    '</div>{{if img}}</div>{{/if}}' +
                    '{{if links}}<div class="tooltip-links"><div style="float:right;">' +
                        '{{each links}}' +
                            '<a href = "${$value}" class="button">${$index}</a> ' +
                        '{{/each}}' +
                    '</div></div>{{/if}}'+
                    '</div>{{/if}}</div>{{if direction == "top"}}<div class="tooltip-pointer-bottom"></div>{{/if}}'
                });
            if(this.options.type == 'advanced'){
                this.options.position = ['bottom', 'left'];
                this.options.maxWidth = 380;
                this.options.offset = [0, -10];
            } 
            prototype._create.apply(this, arguments);
        },
        _render: function () {
            if (this.options.type == 'advanced') {

                this.tooltip = $('.tooltip-advanced').size() ? $('.tooltip-advanced') :
                    $('<div class="tooltip-advanced"></div>').appendTo(this.element.closest('form').size() ? this.element.closest('form') : $('body form:first')).css({ 'max-width': this.options.maxWidth + 'px', 'position': 'absolute', float: 'left' });
            } else {
                prototype._render.apply(this, arguments);
            }
        },
        _content: function () {
            if (this.options.type == 'advanced') {
                this.content = this.content ? this.content : $.tmpl(this.options.templates[this.options.type], { 'direction': this.options.position[0], 'title': this.options.title, 'text': this.options.text, 'img':
this.options.img, links: this.options.links
                });
                return this.content;
            } else {
               return prototype._content.apply(this, arguments);
            }
        },
        _bind: function () {
            if(this.options.type == 'advanced'){
            var self = this;
                this.trigger.off('mouseenter.tooltip').on('mouseenter.tooltip', function () {
                    clearTimeout(self.timeout);
                    self._effectStart();
                }).off('mouseleave.tooltip').on('mouseleave.tooltip', function () {
                    self.timeout = setTimeout(function(){
                        if(self.tooltipMouseover) {
                            clearTimeout(self.timeout);
                        } else {
                            self._effectEnd();
                            clearTimeout(self.timeout);
                        }
                    }, 50); 
                });
                this.tooltip.off('mouseenter.tooltip').on('mouseenter.tooltip', function () {
                    self.tooltipMouseover = true;
                }).off('mouseleave.tooltip').on('mouseleave.tooltip', function(){
                    self.tooltipMouseover = false;
                    self._effectEnd();
                });
            } else {
                prototype._bind.apply(this, arguments);
            }
        }
    }));
})(jQuery);
﻿(function ($) {
    var prototype = $.sc.tooltip.prototype;

    $.widget("sc.tooltip", $.extend({}, prototype, {
        _create: function () {
            prototype._create.apply(this, arguments);
            this._effectsDefault();
        },
        _addEffect: function (name, start, end, done) {
            var self = this;
            this.effects = this.effects ? this.effects : {};
            this.effects[name] ? $.noop() : this.effects[name] = {};
            this.effects[name]['effectStart'] = function () { start(self.tooltip, self.trigger, self.options.delay, done); };
            this.effects[name]['effectEnd'] = function () { end(self.tooltip, self.trigger, self.options.delay, done); };
        },

        _effectsDefault: function () {
            this._addEffect('simple',
                function(tooltip, trigger, delay, done) {
                    tooltip ? delay ? tooltip.delay(delay).show(done ? done : $.noop()) : tooltip.show(done ? done : $.noop()) : $.noop();
                },
                function(tooltip, trigger, delay, done) {
                    tooltip ? delay ? tooltip.delay(delay).hide(done ? done : $.noop()) : tooltip.hide(done ? done : $.noop()) : $.noop();
                }
            );
        }
    }));
})(jQuery)

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