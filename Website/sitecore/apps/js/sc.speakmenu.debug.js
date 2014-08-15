(function ($) {
    var template = '{{if favorite}}{{if item.state != 0}}<span class="favorite-icon{{if item.favorite}} selected{{/if}}" />{{/if}}{{/if}}' +
					'{{if item.state == 1 || item.state == 2 || item.state == 3}}<a {{if item.spinnerenabled != null && item.spinnerenabled && item.state != 2}}' +
                    'onclick="{{if item.spinnertype=="global"}}$(this).spinner({\'type\':\'global\', \'text\':\'\'});{{else}}$(\'#${item.inlinespinnercontainer}\').spinner({\'type\':\'inline\', \'text\':\'\', \'position\':\'${item.spinnerposition}\' });$(\'#${item.inlinespinnercontainer}\').trigger(\'show.spinner\');{{/if}}" {{/if}}class="menu-item{{if item.quick != null}} menu-item-name{{/if}}{{if item.state == 2}} disabled{{/if}}{{if item.state == 3}} selected{{/if}}"  {{if item.state != 2}}{{if item.name.indexOf("menuitem") == 0 && !item.popup}} href="${item.url}"{{/if}}{{/if}}' +
						'name="${item.name}" ' +
						'{{each item.attr}} ${item.name}="${item.value}" {{/each}}' +
						'{{if item.accessKey}}accessKey="${item.accessKey}"{{/if}} ' +
						'title="{{if item.tooltip}}${item.tooltip}{{else}}${item.title}{{/if}}{{if item.fullAccessKey}}( ${item.fullAccessKey} ){{else}}{{if item.accessKey}}( ${item.accessKey} ){{/if}}{{/if}}" ' +
				    '>{{if item.icon}}<img src="${item.icon}" class="menu-item-icon" />{{/if}}{{if !item.quick }}<span class="menu-item-title">${item.title}</span>{{/if}}</a>{{else}}<span class="hidden"></span>{{/if}}';

    $.widget("sc.speakmenu", {
        options: {
            templates: {
                favorite: template,
                item: '{{if item.state != 0}}{{if typeof(item) == "string" }}' +
                '{{if item == "separator" }}<li class="separator" ></li>' +
                '{{else}}<li class="menu-title" >${item}</li>{{/if}}' +
                '{{else}}<li {{if item.state == 2}}class = "disabled"{{/if}} {{if item.state == 3}}class = "selected"{{/if}}>' + template + '</li>{{/if}}{{/if}}',
                template: '<ul class="${type}" >{{if title}}<li class="menu-title">${title}</li>{{/if}}</ul>'
            }
        },

        _create: function () {
            this._initialize();
            this._render();
            this._bind();
        },

        _initialize: function () {
            this.element.attr('data-name', this.options.name);
        },

        _render: function () {
            var self = this,
                menu = $.tmpl(this.options.templates.template, this.options.data);
            menu.append();
            $(this.options.data.items).each(function () {
                this.state == undefined ? this.state = 1 : $.noop();
                this.state ? menu.append($.tmpl(self.options.templates.item, { item: this, favorite: self.options.favorite })) : $.noop();
            });
            menu.find('li').size() > 1 ? menu.appendTo(this.element) : this.element.detach();
            return this;
        },

        _bind: function () {
            return this._click();
        },

        _click: function (menu) {
            var self = this;
            var commands = (menu || self.element).find('a');
            $(commands).each(function () { self._clickItem($(this)); });
            return this;
        },

        getItem: function (element) {
            var name = $(element).attr('name');
            var item = $(this.options.data.items).filter(function () {
                return name && this.name == $(element).attr('name');
            });
            return item.size() ? item[0] : null;
        },

        _clickItem: function (element) {
            var self = this;

            $(element).on('click', function (e) {
                var item = self.getItem(element);
                if (item != null && item.state != 2) {
                    e.stopPropagation();
                    setTimeout(function () {
                        self.element.triggerHandler('beforeclick');
                        if (item) {
                            item.name.indexOf(self.element.attr('name')) == 0 ? self.click(item.name, "command") : item.popup ? self.open(element) : $.noop();
                        }
                        self.element.trigger('menuclick', [element, item]);
                        return element.attr('href') != '#';
                    }, 50);
                } else {
                    e.stopImmediatePropagation();
                    return false;
                }

            });
        },

        _popupdialogclose: function (menu, a, hdl) {
            $.netajax(this.element, "close:" + menu.attr('name') + ":" + hdl + ":" + a);
        },

        click: function (command, type) {
            $.netajax(this.element, type + ":" + command);
        },

        open: function (element) {
            var item = this.getItem(element);
            if (item) {
                var self = this;
                item.popup ? $(element).popupdialog({ url: item.url })
                    .on('popupdialogclose', function (e, a, hdl) {
                        e.stopImmediatePropagation();
                        self._popupdialogclose(element, a, hdl);

                        $(element).popupdialog('destroy');

                        return false;
                    })
                    .popupdialog('open') : location.replace(item.url);
            }
        },
        update: function (params) {
            var self = this;
            self.options.data = params.data;
            var element = self.element,
                options = self.options;
            this.element.empty();
            this.destroy();
            element.combobox('destroy');
            element.menu(options);
        },
        destroy: function () {
            this.hoverClone ? this.hoverClone.remove() : $.noop();
            this.selectClone ? this.selectClone.remove() : $.noop();
            return $.Widget.prototype.destroy.call(this);
        }
    });
})(jQuery);





    ﻿(function ($) {
    var prototype = $.sc.speakmenu.prototype;

    $.widget("sc.speakmenu", $.extend({}, prototype, {
        _initialize: function () {
            if (this.options.type == 'popup') {
                this._initColumns();
            } else {
                prototype._initialize.apply(this, arguments);
            }
        },

        _initColumns: function () {
            var self = this,
                options = this.options,
                group = 'empty-group';

            self.groups = {},
            self.groupsСount = 0;

            options.columnWidth = options.columnWidth || 220;
            options.columns = options.columns || 1;
            options.closeOnClick = true;
            options.templates.template = '<div class="ui-combobox-trigger button important"><div class="no-top-shadow"></div><div class="trigger-inner"><span class="ui-icon-triangle-1-s ui-icon ui-combobox-icon"></span><a href="#" class="ui-combobox-menu-title">${title}</a></div></div>';

            $(options.data.items).each(function (index) {
                this.quick = null;
                group = this.group = this.group || group;
                self.groups[group] = (self.groups[group] || []);
                self.groups[group].push(this);
            });
            $.each(this.groups, function (i) {
                $.each(this, function () {
                    if (this.state != 0) {
                        ++self.groupsСount;
                        return false;
                    }
                });
            });
            self.groupsСount = self.groupsСount > 0 ? self.groupsСount : 1;
        },

        _render: function () {
            var self = this;
            if (this.options.type == 'popup') {
                this._rendePopup();
                this.element.addClass('popup-menu');
                this.element.on('show.combobox', function () {
                    $(this).find('.ui-combobox-trigger').addClass('pressed');
                    self.element.addClass('ui-state-open');
                }).on('hide.combobox', function () {
                    $(this).find('.ui-combobox-trigger').removeClass('pressed');
                    self.element.removeClass('ui-state-open');
                });
            } else {
                prototype._render.apply(this, arguments);
            }
        },

        _rendePopup: function () {
            var self = this,
                options = this.options,
                popupClone = popup = $('<div class="popup-menu-body"></div>').css({ width: (this.options.data.columnWidth * this.options.data.columns) });

            popup.append('<div class="popup-title"><a href="#" class="close"></a><div >' + self.options.data.title + '</div></div>').append(this._renderColumns()).find('ul').addClass('popup');

            popupClone = popup.clone(true);

            this.element.append(popup).addClass('ui-popupmenu').removeClass('menu');
            this.element.combobox({
                comboboxTemplate: $.tmpl(options.templates.template, { title: options.data.title || ' ' })[0],
                height: 'auto',
                width: this.options.columnWidth * this.groupsСount + 8,
                closeOnClick: self.options.closeOnClick,
                onClose: function (t) { return function () { $('.ui-combobox-trigger', t).removeClass('ui-state-hover'); }; } (this.element),
                show: function (popup) {
                    popup.stop().slideDown(100);
                }
            });
            this.element.combobox('getPopup').html(popupClone);
            this.popup = popupClone;
            this.popup.find('.close').on('click', function () { self.element.combobox('hidePopup'); });
            $('.popup-menu-body').closest('.ui-widget-content').addClass('round-corner');
        },

        _clickItem: function (element) {
            if (this.options.type == 'popup') {
                var self = this,
                    item = self.getItem(element);
                if (item != null && item.state != 2) {
                    $(element).on('click', function (e) {
                        self.element.combobox('hidePopup'); 
                    });
                }
            }
            return prototype._clickItem.apply(this, arguments);
        },

        _renderColumns: function () {
            var options = this.options,
                columns = $('<div class="columns"></div>'),
                self = this,
                items = [],
                count = Math.floor((self.groupsСount + self.options.data.items ? self.options.data.items.length : 0) / self.groupsСount);

            $.each(this.groups, function (i, value) {

                if ((items.length + value.length) >= count && items.length) {
                    self._renderColumn(columns, items, {});
                    items = [];
                }

                if (i != 'empty-group') {
                    items.push(i);
                }

                $(value).each(function () { items.push(this); });
            });

            this._renderColumn(columns, items, {});

            columns.find('.column:first').addClass('first');
            columns.find('.column:last').addClass('last');
            return columns.append($('<div style="clear:both;"></div>'));
        },

        _renderColumn: function (element, items, settings) {
            var options = this.options,
                column = $('<div class="column vertical"><ul ></ul></div>');

            $.each(items, function (i, value) {
                value.state == undefined ? value.state = 1 : $.noop();
                column.find('ul').append($.tmpl(options.templates.item, $.extend({ item: value }, settings)));
            });
            column.find('li').size() > 1 ? column.appendTo(element) : element.detach();
        }
    }));

})(jQuery);﻿(function ($) {
    var prototype = $.sc.speakmenu.prototype;

    $.widget("sc.speakmenu", $.extend({}, prototype, {
        _bind: function() {
            var self = this;
            if (this.options.type == 'popup') {
                this._favorite();
                return this._click(this.popup);
            }
            return prototype._bind.apply(this, arguments);
        },
        _favorite: function() {
            var self = this;
            self.popup.find('.favorite-icon').click(function() {
                var element = $(this).next('.menu-item:first');
                (self.getItem(element) || { }).favorite = !$(this).hasClass('selected');
                $(this).hasClass('selected') ? $(this).removeClass('selected') : $(this).addClass('selected');
                $.netajax(self.element, "favorite:" + element.attr('name'), false);
                self._renderFavorites(self.favorite);
            });
        },

        _renderFavorites: function(appendTo) {
            appendTo.empty();

            var options = this.options,
                self = this,
                icons = $('<div class="favorite-items"></div>').appendTo(appendTo),
                favNoIcons = [];

            $(this.options.data.items).each(function(i) { this.key = i; }).filter(function(i) {
                this.quick = !!this.icon;
                return this.favorite && this.icon;
            }).each(function(i) {
                self._renderFavorite(this, icons);
            });

            var names = $(this.options.data.items).filter(function() {
                this.quick = !!this.icon;
                return this.favorite && !this.icon;
            });
            names.length ? icons = $("<div class='favorite-item-names'></div>").appendTo(icons) : $.noop();
            names.each(function(i) {
                self._renderFavorite(this, icons);
            });
            $('.menu-item', icons.parent()).each(function() {
                $(this).tooltip({ 'trigger': $(this).closest('a'), position: ['top', 'center'], 'text': $(this).attr('title'), offset: [0, 0], delay: 0, container: self.element.closest('form') });
            });

            icons.find('.menu-item-name:first').addClass('first');
            icons.find('.menu-item-name:last').addClass('last');
        },

        _renderFavorite: function(item, container, replace) {
            var element;
            if (replace || replace === 0) {
                element = $.tmpl(this.options.templates.favorite, { 'item': item });
                $(container).find('[data-favkey = "' + replace + '"]').replaceWith(element);
            } else {
                element = $.tmpl(this.options.templates.favorite, { 'item': item }).appendTo(container);
            }
            this._clickItem(element);
            element.attr('data-favkey', item.key).filter(function() {
                return $('.menu-item-title', this).css('width') != $('.menu-item-title', this).css('max-width');
            }).find('.ellipsis').css('display', 'none');
        },

        _render: function() {
            prototype._render.apply(this, arguments);
            if (this.options.type == 'popup') {
                this._renderFavorites(this.favorite);
            }
        },

        _rendePopup: function() {
            prototype._rendePopup.apply(this, arguments);
            this.favorite = $('<div class="favorite"></div>').appendTo(this.element);
        },

        _renderColumn: function(element, items, settings) {
            settings.favorite = this.options.favorite;
            prototype._renderColumn.apply(this, arguments);
        }
    }));

})(jQuery);﻿(function ($) {
    var prototype = $.sc.speakmenu.prototype;

    $.widget("sc.speakmenu", $.extend({}, prototype, {
        _bind: function() {
            var self = this;
            if (this.options.type == 'popup') {
                this.element.off('over.menu selectgridrow.menu').on('over.menu selectgridrow.menu', function(e, element, css, done, states) {
                    if (e.type != 'selectgridrow') {
                        if (states) {
                            self._setStates(states, 'hover');
                        }
                        element ? element.is(self.hoverClone.parent()) ? self.hoverClone.css(css ? css : { }) : element.append(self.hoverClone.css(css ? css : { })) : $.noop();
                        done ? self.hoverClone.off('mouseover.menu').on('mouseover.menu', function() { done(); }) : $.noop();
                    } else {
                        if (states) {
                            self._setStates(states, 'select');
                        }
                        if (element && self.selectClone) {
                            element.append(self.selectClone.css(css ? css : { }));
                        } else {

                            self.selectClone = self.selectClone ? self.selectClone.detach() : false;
                        }
                    }
                }).off('leave.menu').on('leave.menu', function(e, done) {
                    self.hoverClone = self.hoverClone ? self.hoverClone.detach() : false;
                    self.hoverClone ? self.hoverClone.off('mouseleave.menu').on('mouseleave.menu', function() { done ? done() : $.noop(); }) : $.noop();
                    done ? done() : $.noop();
                }).off('beforeclick.menu').on('beforeclick.menu', function() {
                    self.element.trigger('leave');
                }).off('gridcomplete.menu favoritesclone.menu iconlistcreate.menu').on('gridcomplete.menu favoritesclone.menu iconlistcreate.menu', function() {
                    self.hoverClone = self.hoverClone ? self.hoverClone : $('<div class="favorite hover-clone"></div>');
                    self.selectClone = self.selectClone ? self.selectClone : $('<div class="favorite select-clone"></div>');
                    self._renderFavorites(self.hoverClone);
                    self._renderFavorites(self.selectClone);
                }).off('allfavorites.menu').on('allfavorites.menu', function() { self._allFavorites(); });
            }
            return prototype._bind.apply(this, arguments);
        },
        _allFavorites: function() {
            $.each(this.options.data.items, function() {
                this.favorite = true;
            });
            this._renderFavorites(this.favorite);
            this.element.trigger('favoritesclone');
        },
        _setStates: function(states, type) {
            var self = this;
            this.hoverSates ? $.noop() : this.hoverSates = new Array();
            this.selectSates ? $.noop() : this.selectSates = new Array();
            type == 'hover' ? this.hoverSates.length > 0 ? $.noop() : $.each(this.options.data.items, function() { self.hoverSates.push(this.state); }) :
                type == 'select' ? this.selectSates.length > 0 ? $.noop() : $.each(this.options.data.items, function() { self.selectSates.push(this.state); }) :
                    $.noop();
            var currentStates = type == 'hover' ? this.hoverSates : type == 'select' ? this.selectSates : [];
            var container = type == 'hover' ? self.hoverClone : self.selectClone;
            if (currentStates.toString() != states.toString()) {
                $.each(currentStates, function(index, value) {
                    if (value != states[index]) {
                        currentStates[index] = states[index];
                        self.options.data.items[index].state = states[index];
                        self._renderFavorite(self.options.data.items[index], container, index);
                        var element = container.find('[data-favkey = "' + index + '"]');
                        element.tooltip('destroy').tooltip({ 'trigger': element, position: ['top', 'left'], 'text': element.attr('title'), offset: [0, 0], delay: 0, container: self.element.closest('form') });
                    }
                });
            }
        }
    }));

})(jQuery);(function ($) {
    var prototype = $.sc.speakmenu.prototype;

    $.widget("sc.speakmenu", $.extend({}, prototype,
        {
            _initialize: function () {
                if (this.options.type == 'switcher') {
                    this._initColumns();
                } else {
                    prototype._initialize.apply(this, arguments);
                }
            },

            _render: function () {
                this.options.type == 'switcher' ? 
                    this._renderSwitcher() : prototype._render.apply(this, arguments);
            },

            _renderSwitcher: function () {
                var self = this,
                    options = this.options,
                    items = options.data.items;

                this.element.addClass('content-switcher');
                var shell = this.shell = $('<div class="shell"></div>').addClass('popup-menu-body').css({ 'padding': '0 4px 4px 4px', 'overflow': 'hidden' });
                var columns = this.columns = this._renderColumns().css({ display: "inline-block", padding: "4px 0" });
                var columnsWrapper = this.columnsWrapper = $('<div class="border"></div>').append(columns);
                var button = this.button = $('<div class="button"><a href="#">Context Switcher</a></div>');
                var btnLink = this.btnLink = $('a', button);

                var elementHolder = this.element.parent();

                this.element
                    .append(shell.append(columnsWrapper).append('<div></div>').append(button))
                    .css({ top: 0, right: $(window).width() - elementHolder.offset().left - elementHolder.width() - 4 });

                this.element.css({ top: -columnsWrapper.outerHeight() });

                for (var i = 0; i < items.length; i++) {
                    if (items[i].state == 3) {
                        btnLink.text(items[i].title);
                        break;
                    }
                }
                shell.find('.border').css('box-shadow', 'none');
                shell.find('.button').css('box-shadow', 'none');
                btnLink.click(function () {
                    var targetTop = !self.element[0].offsetTop ? -columnsWrapper.outerHeight() : 0;
                    $('.popup-menu').trigger('over.combobox');
                    self.element.animate({ top: targetTop }, 200, function () {
                        if (!targetTop) {
                            shell.find('.border').css('box-shadow', '0 2px 4px rgba(0, 0, 0, 0.5)');
                            shell.find('.button').css('box-shadow', '0 2px 4px rgba(0, 0, 0, 0.5)');
                        } else {
                            shell.find('.border').css('box-shadow', 'none');
                            shell.find('.button').css('box-shadow', 'none');
                        }
                    });

                    return false;
                });

            },

            _click: function (menu) {
                var self = this;
                if (this.options.type == 'switcher') {
                    $('a', this.columns).each(function () { self._clickItem($(this)); });
                } else {
                    prototype._click.apply(this, arguments);
                }

                return this;
            },

            _clickItem: function (element) {
                var self = this;

                if (this.options.type == 'switcher') {
                    $(element).bind('click', function (e) {
                        self.btnLink.text($(this).text());

                        self.element.triggerHandler('beforeclick');

                        var item = self.getItem(element);
                        var targetTop = !self.element[0].offsetTop ? -self.columnsWrapper.outerHeight() : 0;

                        self.element.animate({ top: targetTop }, 200, function () {
                            if (item) {
                                item.name.indexOf(self.element.attr('name')) == 0 ? self.click(item.name, "command") : item.popup ? self.open(element) : $.noop();
                            }

                            self.element.trigger('menuclick', [element, item]);
                        });

                        self.element.trigger('menuclick', [element, item]);
                        return element.attr('href') != '#';

                    });
                } else {
                    prototype._clickItem.apply(this, arguments);
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