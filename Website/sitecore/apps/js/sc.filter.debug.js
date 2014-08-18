(function ($) {
    $.widget("sc.filterbuilder",
    {
        options:
        {
            templates:
            {
                filter: "<div class='grid-filter'><div class='header'><div class='header-inner'><div class='filter-controls'></div><ul class='filter-type'></ul></div></div></div>",
                body: "<div class='filter-area'></div>",
                filterType: "<li class='custom-filter button' data-filter-type='${filterType}'>${title}</li>",
                select: '<select {{if size}}size="${size}"{{/if}}><option value="-1">{{if none}}${none}{{/if}}</option>' +
                    '{{each options}}{{if optgroup}}<optgroup label="${optgroup}">{{/if}}' +
                    '<option title="${title}" value="${index}" {{if selected}} selected="" {{/if}}>${name}</option>' +
                    '{{if optgroupEnd}}</optgroup>{{/if}}{{/each}}</select>',

                customFilterList:
                    '<ul class="filter-list custom-filters">' +
                        '{{if none}}<li  value="-1" class="selected"><span>${none}</span>{{/if}}' +
                        '{{each options}}' +
                            '{{if optgroup}}<li class="optgroup"><span>${optgroup}</span></li>{{/if}}' +
                            '<li title="${name}" value="${index}"></a><span>${name}</span><a class="btn-delete" href="#"></li>' +
                         '{{/each}}' +
                    '</ul>',

                predefinedFilterList:
                    '<ul class="filter-list predefined-filters">' +
                        '{{each options}}' +
                            '{{if optgroup}}<li class="optgroup"><span>${optgroup}</span></li>{{/if}}' +
                            '<li data-value="${index}"><input type="checkbox"/><span>${name}</span><div class="hit-area"></div></li>' +
                         '{{/each}}' +
                    '</ul>'
            }
        },

        _create: function () {
            this.rules = [];
            this.value = this.element.find('input:hidden:first');
            this.element.attr('data-name', this.options.name);
            this.viewState = -1;
            var self = this;
            self._render();
            self._click();
            self._initialState();
        },

        _render: function () {
            this.element.closest('.ui-accordion-content').size() && $(this.element.closest('.ui-accordion-content').children()[0]).is(this.element) ? this.element.closest('.portlet').addClass('collapsed-header') : $.noop();
            if (this.options.filter || this.options.search) {
                this.filter = $(this.options.templates.filter).prependTo(this.element);
                this.body = $(this.options.templates.body).appendTo(this.filter).hide();
            }
            return this;
        },

        _click: function () {
            var self = this;
            self.filter.find('li').each(function (i) {
                $(this).click(function (e) {
                    self.viewState = self.viewState != i ? self.viewState = i : self.viewState = -1;

                    if (self.options.buttonFilters.Enabled) {
                        $(this).hasClass('ui-state-active') ?
                            $(this).removeClass('ui-state-active') : 
                            $(this).addClass('ui-state-active').siblings().removeClass('ui-state-active');
                    }

                    !self.initialization ? self.value.attr('value', '') : $.noop();
                });
            });
        },

        _load: function (callback) {
            var self = this;
            $.netajax(this.element, "")
                .done(function (data) {
                    self.options.prefetch = data;
                    callback();
                });
            return false;
        },
        _applyState: function () {

        },
        _getState: function (predefined) {
            return false;
        },
        _initialState: function () {
            var self = this;
            self.element.unbind('initstart.filterbuilder').bind('initstart.filterbuilder', function () {
                self.initialization = true;
            })
            .unbind('initstop.filterbuilder').bind('initstop.filterbuilder', function () {
                self.initialization = false;
            });

            if (this.value.val() && this.value.val().length > 0) {
                self.element.triggerHandler('initstart');
                self.state = this.value.val().split('¬');
                if (self.state.length) {
                    $.each(self.state, function (i, v) {
                        self.state[i] = eval('(' + v + ')');
                    });
                    self._applyState();
                } else {
                    self.element.triggerHandler('initstop');
                }
            }
        },
        dumpRules: function (predefined) {
            if (!this.initialization) {
                var json = JSON.stringify(this.rules);
                json = json == "[]" ? "" : json;
                if (this.value.val() != json) {
                    var state = this._getState(predefined);
                    this.value.val(state && JSON.stringify(state) != '{}' ? JSON.stringify(state) + (json ? ('¬' + json) : json) : json);
                    __doPostBack(this.options.name, 'change');

                }
            }
        },

        _onchange: function (element, before, done, fadeSpeed) {
            if ($(element).hasClass('ui-state-active')) {
                return this._hide(element);
            }

            if ($(this.body).hasClass('open')) {
                var self = this;
                self.element.closest('.sc-overlay').size() ? this.body.css({ 'position': 'absolute', 'z-index': '10' }) : $.noop();
                self.element.trigger('filterbeforeclose');
                var height = $(self.body).height();
                $(this.body).animate({ 'opacity': 0 }, fadeSpeed !== undefined ? fadeSpeed : 300, function () {
                    if (self.viewState == -1) {
                        self._hide(element);
                        $(self.body).height(height);
                        $(self.body).html('');
                    } else {
                        $(self.body).html('');
                        self._show(height, before, done, fadeSpeed !== undefined ? fadeSpeed : 300);
                    }
                });
            } else {
                $(this.body).html('');
                this._show(0, before, done, fadeSpeed !== undefined ? fadeSpeed : 300);
            }
            return undefined;
        },

        _hide: function (element, fadeSpeed) {
            var self = this;
            self.element.closest('.sc-overlay').size() ? this.body.css({ 'position': 'absolute', 'z-index': '10' }) : $.noop();
            self.element.trigger('filterbeforeclose');
            $(this.body)
                .removeClass('open').stop()
                .animate({ 'height': '0px' }, fadeSpeed !== undefined ? fadeSpeed : 300, function () {
                    $(element).removeClass('ui-state-active');
                    $(self.body).css('display', 'none');
                    self.reset();
                    $('.grid-search').fadeIn(fadeSpeed !== undefined ? fadeSpeed : 300);
                });
        },

        _show: function (oldHeight, before, done, fadeSpeed) {
            var self = this;

            before.call();

            var newHeight = $(this.body).css({ height: 'auto' }).height();
            self.element.closest('.sc-overlay').size() ? this.body.css({ 'position': 'absolute', 'z-index': '10' }) : $.noop();
            $(this.body)
                .css({ 'display': 'block', 'height': oldHeight + 'px', opacity: 0 })
                .animate({ 'opacity': 1, height: newHeight + 'px' }, fadeSpeed !== undefined ? fadeSpeed : 300, function () {
                    $(self.body).css('height', 'auto').addClass('open');
                    self.element.closest('.sc-overlay').size() ? self.body.css('position', 'static') : $.noop();
                    done.call();
                });

        },

        reset: function () {
            this.rules = [];
            this.dumpRules();
        },

        destroy: function () {
            this.filter.remove();
            return $.Widget.prototype.destroy.call(this);
        }
    });

})(jQuery);
﻿(function ($) {
    var prototype = $.sc.filterbuilder.prototype;

    $.widget("sc.filterbuilder", $.extend({}, prototype, {

        _date: function (index, utc) {
            var updateValue = function(dateText, input) {
                input = input.input != null ? input.input : input;

                var keep = new Date();

                var date = $.sc.datetime($(input).datepicker('getDate'));
                if (utc) {
                    $(input).parent().attr('data-value', date.date().toUTC().toJSON());
                } else {
                    $(input).parent().attr('data-value', date.date().toJSON());
                }
            };

            var editor = $("<div><input type='text'></input></div>");

            editor.find("input")
		        .change(function () { updateValue("", this); })
                .datepicker({ buttonImage: "/sitecore/apps/img/arrow-d.png",
                    showOn: 'both',
                    buttonImageOnly: true,
                    dateFormat: 'yy-mm-dd',
                    currentText: ''
                })
		        .datepicker('setDate', new Date())
		        .trigger('change');

            editor.val = function (value) {
                editor.find("input")
                    .datepicker("setDate", $.sc.parseDatetime(value).toSystemDate())
                    .trigger('change');
            };
            return editor;
        },

        _utcDate: function (index) {
            self._date(index, true);
        },

        _select: function (index) {
            return $("<select></select>").append($.tmpl("{{each rules}}<option title='${title}' value='${value}'>${title}</option>{{/each}}",
                $(this.options.prefetch.filters).filter(function (i, e) { return e.name == index; })[0]));
        }

    }));

    function scdate(value) {
        this._d = value || new Date();
    };

    scdate.prototype.addSeconds = function (secondsCount) {
        this._d = new Date(this._d.getTime() + secondsCount * 1000);
        return this;
    };

    scdate.prototype.toSystemDate = function () {
        return this._d;
    };

    scdate.prototype.addMinutes = function (minutesCount) {
        this._d = new Date(this._d.getTime() + minutesCount * 60 * 1000);
        return this;
    };

    scdate.prototype.addHours = function (hoursCount) {
        this._d = new Date(this._d.getTime() + hoursCount * 60 * 60 * 1000);
        return this;
    };

    scdate.prototype.addDays = function (daysCount) {
        this._d = new Date(this._d.getTime() + daysCount * 24 * 60 * 60 * 1000);
        return this;
    };

    scdate.prototype.addMonths = function (monthsCount) {
        if (monthsCount > 0) {
            for (var i = 0; i < monthsCount; ++i) {
                this.addDays(this.getDaysInMonth(this._d.getFullYear(), this._d.getMonth()));
            }
        } else {
            for (var j = 0; j > monthsCount; --j) {
                this.addDays(0 - this.getDaysInMonth(this._d.getFullYear(), this._d.getMonth()));
            }
        }
        return this;
    };

    scdate.prototype.getDaysInMonth = function (month, year) {
        return new Date(year, month, 0).getDate();
    };

    scdate.prototype.addYears = function (yearsCount) {
        this.date.setFullYear(this.date.getFullYear() + yearsCount);
        return this;
    };

    scdate.prototype.toUTC = function () {
        this._d = Date.UTC(this._d.getUTCFullYear(), this._d.getUTCMonth(), this._d.getUTCDate(), this._d.getUTCHours(), this._d.getUTCMinutes(), this._d.getUTCSeconds());
    };

    scdate.prototype.toJSON = function () {
        return this.format(this._d.getFullYear(), 4) + this.format(this._d.getMonth() + 1, 2) +
               this.format(this._d.getDate(), 2) + "T" +
               this.format(this._d.getHours(), 2) + this.format(this._d.getMinutes(), 2) + this.format(this._d.getSeconds(), 2);
    };

    scdate.prototype.getTimezoneOffset = function () {
        return this._d.getTimezoneOffset();
    };

    scdate.prototype.date = function (value) {
        this._d.setHours(0);
        this._d.setMinutes(0);
        this._d.setSeconds(0);
        return this;
    };

    scdate.prototype.format = function (value, numbers) {
        var result = value.toString();
        while (result.length < numbers) {
            result = "0" + result;
        }
        return result;
    };

    jQuery.extend($.sc, {

        datetime: function (value) {
            return new scdate(value);
        },

        parseDatetime: function (value) {
            var parse = function (value, start, length) {
                try {
                    return parseInt(value.substring(start, length), 10);
                } catch (e) {
                    return 0;
                }
            };
            var utc = $.sc.datetime(new Date(parse(value, 0, 4), parse(value, 4, 6) - 1, parse(value, 6, 8), parse(value, 9, 11), parse(value, 11, 13), parse(value, 13, 15)));
            return utc.addHours(-utc.getTimezoneOffset() / 60);
        }

    });

    $.extend(true, $, {
        sc: {
            datetime: function (value) {
                return new scdate(value);
            },

            parseDatetime: function (value) {
                var parse = function (value, start, length) {
                    try {
                        return parseInt(value.substring(start, length), 10);
                    } catch (e) {
                        return 0;
                    }
                };
                var utc = $.sc.datetime(new Date(parse(value, 0, 4), parse(value, 4, 6) - 1, parse(value, 6, 8), parse(value, 9, 11), parse(value, 11, 13), parse(value, 13, 15)));
                return utc.addHours(-utc.getTimezoneOffset() / 60);
            }
        }
    });
})(jQuery);

﻿(function ($) {
    var prototype = $.sc.filterbuilder.prototype;

    $.widget("sc.filterbuilder", $.extend({}, prototype, {
        _render: function () {
            prototype._render.apply(this, arguments);
            if (this.options.search) {
                this._renderSearch();
            }
            return this;
        },

        dumpRules: function (predefined) {
            var existingRules = this.rules || [];
            this.currentType == 'predefined' ? this.search = this.filter.find('.grid-search input[type="text"]').val() : $.noop();
            if (this.search != undefined) {
                if (this.search.length == 0) {
                    this.rules = [];
                } else {
                    this.rules = [{ name: '*', values: [this.search], op: 'search'}];
                }
                if (existingRules.length > 0) {
                    var temp = [];
                    for (var i = 0; i < existingRules.length; i++) {
                        if (((existingRules[i].constructor.toString().indexOf("Object") != -1) || (existingRules[i].constructor.toString().indexOf("Array") != -1)) && (existingRules[i].op != 'search')) {
                            temp.push(existingRules[i]);
                        }
                        else if (((existingRules[i].constructor.toString().indexOf("Object") == -1) || (existingRules[i].constructor.toString().indexOf("Array") == -1))) {
                            temp.push(existingRules[i]);
                        }
                    }
                    if (temp.length > 0) {
                        if ((this.rules.length > 0) && (this.search.length != 0)) {
                            this.rules.push("and", temp);
                        } else {
                            this.rules = temp;
                        }
                    }
                }
            }
            prototype.dumpRules.apply(this, arguments);
        },
        _applyState: function () {
            var self = this,
                state;
            if (this.currentType != 'custom') {
                state = self.state.length > 1 ? self.state[1] : self.state[0];
                $.each(state, function () {
                    if (this.name && this.name === '*') {
                        self.filter.find('.grid-search input[type="text"]').val(this.values[0]);
                        self.options.lastSearchPattern = this.values[0];
                    };
                });
            }
            self.state[0].custom === undefined && self.state[0].predefined === undefined ? this.element.triggerHandler('initstop') : $.noop();
            prototype._applyState.apply(this, arguments);
        },
        _renderSearch: function () {
            var self = this,
                options = this.options;
            if (self.filter != null) {
                self.searchColumns = [];
                $(options.colModel).each(function () {
                    if (this.searchable == null) {
                        this.searchable = true;
                    } else if (this.searchable == "false") {
                        this.searchable = false;
                    }
                    if (this.searchable) {
                        self.searchColumns.push(this.index);
                    }
                });

                self.filter.find('.filter-controls').prepend("<div class='grid-search'><span></span><input place='" + this.options.texts.searchInList + "' type='text'/><a href='#' class='search-button'><span class='search-icon'></span></a></div>");

                self.filter.find('.grid-search').append($("<div class='search-columns'></div>")).find('input[type="text"], .search-button').on("blur keydown click keypress keyup", function (e) {

                    var input = $(this);
                    if (this.tagName == 'A') {
                        input = self.filter.find('.grid-search>input[type="text"]');
                    }

                    var value = input.val();
                    if (value != '') {
                        e.stopPropagation();
                        switch (e.type) {
                            case 'click':
                                if ($(this).closest('.grid-search').hasClass('clear-input') && this.tagName == 'A') {
                                    input.attr('value', '');
                                    self.search = null;
                                    self.applyValues();
                                    self.dumpRules();
                                    if (input.val().length == 0) {
                                        $(this).closest('.grid-search').removeClass('clear-input');
                                    } else {
                                        $(this).closest('.grid-search').addClass('clear-input');
                                    }
                                }
                                break;
                            default:
                                if (input.val().length == 0) {
                                    $(this).closest('.grid-search').removeClass('clear-input');
                                } else {
                                    $(this).closest('.grid-search').addClass('clear-input');
                                }
                                break;

                        }
                    } else {
                        e.stopPropagation();
                        $(this).closest('.grid-search').removeClass('clear-input');
                    }
                    var startSearch = function () {
                        if (e.keyCode == null || e.keyCode == 0 || e.keyCode == '9' || e.keyCode == '13') {

                            if (e.keyCode == '13') {
                                self.element.closest('form').off('popupdialogclose');
                                input.keypress(function (event) {
                                    event.which == '13' ? event.preventDefault() : $.noop();
                                });
                            }

                            if ((e.type == 'keydown')) {
                                self.search = input.val() != null ? input.val() : '';
                                self.applyValues();
                                self.dumpRules();
                                options.lastSearchPattern = value;

                            }

                        }
                    };

                    e.type == 'click' && $(e.currentTarget).is(self.element.find('.grid-search input[type="text"]')) ? $.noop() : startSearch();

                    if (this.tagName == 'A') {
                        return false;
                    }
                    return undefined;
                });

            }
        }
    }));

})(jQuery);

﻿(function ($) {
    var prototype = $.sc.filterbuilder.prototype;

    $.widget("sc.filterbuilder", $.extend({}, prototype,
        {
            _render: function () {
                this.options = $.extend({}, this.options, {
                    requestDelay: null
                });

                prototype._render.apply(this, arguments);
                if (this.options.buttonFilters.Visible) {
                    this.addPrefetch();
                    !this.options.buttonFilters.Enabled ? this.element.find('.custom-filter').addClass('disabled') : $.noop();
                }
                return this;
            },

            addPrefetch: function () {
                var self = this,
                    options = this.options;

                $.tmpl(options.templates.filterType, { title: options.buttonFilters.Text, filterType: 'predefined' })

                    .appendTo(self.filter.find('ul.filter-type'))
                    .click(function (e, fadeSpeed, afterLoad) {
                        if (options.buttonFilters.Enabled == true) {
                            var loaded = function () {
                                $('.grid-search').fadeIn(fadeSpeed !== undefined ? fadeSpeed : 300);
                                self._onchange(this, function () {
                                    self.reset();
                                    self.renderPrefetch(options.prefetch.filters);
                                    self.currentType = 'predefined';
                                }, function () { self.element.trigger('filteropen'); }, fadeSpeed);
                                afterLoad ? afterLoad() : $.noop();
                            };
                            !self.options.prefetch ? self._load(function () { loaded(); }) : loaded();
                        }

                    });

            },

            renderPrefetch: function (data) {
                var self = this;

                $(self.body).html('').show();

                var newData = new Array();
                $.each(data, function () {
                    this.rules.length ? newData.push(this) : $.noop();
                });
                $(newData).each(function (i) {
                    if (i < 3 && this.rules.length) {
                        self.renderColumn(this, i, -1, i, newData);
                    }
                });
            },

            getSelectedItemIndex: function (item) {
                var list = item.parentNode;

                for (var i = 0; i < list.childNodes.length; i++) {
                    if (list.childNodes[i] == item) {
                        return i;
                    }
                }

                return -1;
            },

            applyValues: function () {
                var options = this.options,
                    rules = [];

                $('.filter-area .column-filter', this.element).each(function (i) {
                    var name = $("a.ui-combobox-menu-title", this).text(),
                        orRules = [],
                        column = $(options.prefetch.filters).filter(function () { return this.title == name; })[0];

                    $('.filter-list li', this).each(function (j) {
                        if ($(":first-child", this).is(':checked')) {
                            var rule = column.rules[j],
                                value;

                            try {
                                value = eval(rule.value);
                            } catch (e) {
                                value = (rule.value || '').toString();
                            }

                            if (orRules.length > 0) {
                                orRules.push("or");
                            }
                            orRules.push({ 'name': column.name, 'values': $.merge([], $.isArray(value) ? value : [value]), 'op': rule.op });
                        }
                    });

                    if (orRules.length > 0) {
                        if (rules.length > 0) {
                             rules.push("and");
                        }
                        rules.push(orRules.length > 1 ? orRules : orRules[0]);
                    }

                });

                this.rules = rules;
            },
            _getState: function (predefined) {
                var self = this,
                    state = {};
                if (this.element.find('.filter-area').size() && this.element.find('.filter-area').hasClass('open')) {
                    if (this.currentType == 'predefined') {
                        var states = [],
                            nothingChecked = true;
                        state.predefined = 0;
                        self.options.prefetch && self.options.prefetch.filters ?
                            $.each(self.options.prefetch.filters, function (iColumn) {
                                states.push(1);
                                var listItems = self.element.find('.filter-area .column-filter .ui-combobox-menu-title:contains(' + this.title + ')').size() ?
                                    self.element.find('.filter-area .column-filter .ui-combobox-menu-title:contains(' + this.title + ')').parents('.column-filter').find('.options li') :
                                    false;
                                $.each(this.rules, function (iRule) {
                                    if (listItems) {
                                        if ($(listItems[iRule]).find('input[type="checkbox"]:checked').size()) {
                                            states.push(1);
                                            nothingChecked = false;
                                        } else {
                                            states.push(0);
                                        }
                                    } else {
                                        states.push(0);
                                    }
                                });
                            }) : $.noop();
                        var key = 1;
                        !nothingChecked ? $.each(states, function (i, v) {
                            key = key << 1;
                            state.predefined = v ? state.predefined | key : state.predefined;
                        }) : state.predefined = 0;
                        return state;
                    }
                }
                return prototype._getState.apply(this, arguments);
            },
            _applyState: function () {
                prototype._applyState.apply(this, arguments);
                var self = this;
                if (self.state[0].predefined != undefined) {
                    self.state[0].predefined = parseInt(self.state[0].predefined, 10);
                    self.filter.find('ul.filter-type *[data-filter-type="predefined"]').trigger('click', [0, function () {
                        var count = 0;
                        self.options.prefetch && self.options.prefetch.filters ?
                            $.each(self.options.prefetch.filters, function (iColumn) {
                                count++;
                                var listItems = self.element.find('.filter-area .column-filter .ui-combobox-menu-title:contains(' + this.title + ')').size() ?
                                    self.element.find('.filter-area .column-filter .ui-combobox-menu-title:contains(' + this.title + ')').parents('.column-filter').find('.options li') :
                                    false;
                                $.each(this.rules, function (iRule) {
                                    count++;
                                    (self.state[0].predefined & (1 << count)) == 1 << count ?
                                        $(listItems[iRule]).find('.hit-area').trigger('click') :
                                        $.noop();
                                });
                            }) : $.noop();
                        self.element.triggerHandler('initstop');
                    } ]);

                }
            },
            renderColumn: function (column, i, insertTo, uiIndex, columns) {
                var self = this,
                    options = this.options;

                $(columns).each(function () { this.current = false; });
                columns[i].current = true;

                /*
                var select = $.tmpl(options.templates.select, { none: $T('None'), selectedNone: true, size: Math.max(column.rules.length + 1, 2), options: $.map(column.rules, function (element, index) {
                return { index: index, name: element.title, title: element.title };
                })});
                */

                var list = $.tmpl(options.templates.predefinedFilterList, {
                    none: 'None',
                    selectedNone: true,
                    size: Math.max(column.rules.length + 1, 2),
                    options: $.map(column.rules, function (element, index) {
                        return { index: index, name: element.title, title: element.title };
                    })
                });

                var filterOptions = $("<div class='options' />").append(list);

                list[0].selectedItem = null;
                list[0].value = -1;

                $('.hit-area', list).click(function () {
                    if (self.options.requestDelay) {
                        clearTimeout(self.options.requestDelay);
                    }

                    var listNode = list[0];
                    listNode.value = this.parentNode.getAttribute("data-value");

                    //-------------------------------------------------------------
                    // Processing selected item in fiter list
                    //-------------------------------------------------------------

                    var item = this.parentNode;
                    var selectedItemIndex = self.getSelectedItemIndex(item);

                    if (item.selected) {
                        if (self.rules[uiIndex] && self.rules[uiIndex][selectedItemIndex]) {
                            delete self.rules[uiIndex][selectedItemIndex];
                        }
                    }

                    item.selected = item.selected ? false : true;
                    item.className = item.selected ? "selected" : "";
                    $(':checkbox', item).attr("checked", item.selected);

                    //-------------------------------------------------------------

                    self.applyValues();
                    //clearTimeout(self.options.requestDelay);
                    //self.options.requestDelay = setTimeout(function () {
                    self.dumpRules(true);
                    //},
                    // 300)
                });

                var childrens = self.body.children();

                var element = $("<div class='column-filter'></div>");

                if (insertTo > -1 && childrens.length > insertTo) {
                    $(childrens[insertTo]).find('.filter-combobox').combobox('destroy');
                    $(childrens[insertTo]).replaceWith(element);
                } else {
                    element.appendTo(self.body);
                }
                uiIndex == 2 ? element.addClass('last') : $.noop();
                var columnWidth = parseInt(self.body.width() / Math.min(columns.length, 3), 10),
                    lastColumnWidth = self.body.width() - columnWidth * 2;
                columnWidth = uiIndex == 2 ? lastColumnWidth : columnWidth;
                element.append(filterOptions).css({ 'width': (uiIndex == 2 ? 'auto' : columnWidth) + "px", 'float': (uiIndex == 2 ? 'none' : 'left') });

                var popup = $('<div class="filter-combobox"></div>').appendTo($("<div class='filter-menu'></div>").prependTo(element));
                var menu = $('<div class="menu simple"></div>').menu({ 'data': { 'items': columns} });

                popup.combobox({
                    comboboxTemplate: '<div class="ui-combobox-trigger"><div class="no-top-shadow"></div><div class="trigger-inner"><span class="ui-icon-triangle-1-s ui-icon ui-combobox-icon"></span><a href="#" class="ui-combobox-menu-title">' + column.title + '</a></div></div>',
                    height: 72,
                    width: columnWidth,
                    closeOnClick: true,
                    popupTemplate: '<div class="ui-widget-content ui-combobox simple"></div>'
                })
                    .on('show', function () { popup.closest('.filter-menu').addClass('open'); })
                    .on('hide', function () { popup.closest('.filter-menu').removeClass('open'); })
                    .combobox('getPopup').on('menuclick', function (e, target, item) {
                        var newColumn = null,
                            columnIndex = 0;

                        $(columns).each(function (i) {
                            if (this.name == target.attr('name')) {
                                newColumn = this;
                                columnIndex = i;
                            }
                        });
                        self.renderColumn(newColumn, columnIndex, uiIndex, uiIndex, columns);

                    }).combobox('getPopup').append(menu);

                list.width(list.width() + list.width() - list[0].clientWidth);

                if (insertTo > -1 && childrens.length > insertTo) {
                    list.trigger('change');
                }
            }
        }));

})(jQuery);
﻿(function ($) {
    var prototype = $.sc.filterbuilder.prototype;

    $.widget("sc.filterbuilder", $.extend({ }, prototype, {
        _render: function() {
            prototype._render.apply(this, arguments);
            this.options.templates = $.extend({ }, this.options.templates,
                {
                    filterBuilder:
                        '<div class="filter-builder"><div class="filter-builder-header"><div class="filter-settings">' +
                            '<a href="#" class="button important">${buttonText}</a><div class="filter-criteria-title">${criteriaTitle}</div>' +
                                '<div class="save-filter round-corner"><label>${saveLabel}<input type="text" class="filter-name"/></label><input type="submit" value="${buttonText}"></input></div>' +
                                    '</div><div class="filter-title favourites">${columnTitle}</div>' +
                                        '</div><div class="column-filter"></div>' +
                                            '<div class="filter-expressions"><div class="filter-builder-area"></div></div></div>'
                });

                if (this.options.texts.customFilter) {
             //   this.addBuilder();
            }
            return this;
        },
        _getState: function(predefined) {
            var state = { };
            if (this.element.find('.filter-area').size() && this.element.find('.filter-area').hasClass('open')) {
                if (this.currentType == 'custom') {
                    this.element.find('.filter-list li').each(function(i) { $(this).hasClass('selected') ? state.custom = i : $.noop(); });
                    return state;
                }
            }
            return prototype._getState.apply(this, arguments);
        },
        _applyState: function() {
            prototype._applyState.apply(this, arguments);
            var self = this;
            if (self.state.length > 1 && self.state[0].custom != undefined) {
                var b = self.filter.find('ul.filter-type *[data-filter-type="custom"]');
                self.filter.find('ul.filter-type *[data-filter-type="custom"]').trigger('click', [0, function() {
                    self.element.find('.filter-list li')[self.state[0].custom] ? $(self.element.find('.filter-list li')[self.state[0].custom]).trigger('click') : $.noop();
                    self.element.find('.filter-builder-area').empty();
                    var expressions = [];
                    var exCount = 0;
                    $.each(self.state[1], function(i, v) {
                        if (!expressions[exCount]) {
                            self.renderDefaultExpression();
                            expressions = self.element.find('.filter-expressions .expressions');
                        }
                        if (typeof(v) != 'string') {
                            self.renderExpression($(expressions[exCount]), this.name, this.op, this.values[0], self.state[1][i + 1]);
                            self.state[1][i + 1] ?
                                $(expressions[exCount]).find('.ex-union-operator').css('display', 'block').parents('.expressions').find('.ex-add').css('display', 'none') :
                                $(expressions[exCount]).find('.ex-add').css('display', 'block').parents('.expressions').find('.ex-union-operator').css('display', 'none');
                            exCount++;
                        }
                    });
                    self.element.triggerHandler('initstop');
                }]);
            }
        },
        addBuilder: function() {
            var self = this,
                options = this.options;
            $.tmpl(options.templates.filterType, { title: this.options.texts.customizeFilters, filterType: 'custom' }).appendTo(self.filter.find('ul.filter-type')).click(function(e, fadeSpeed, afterLoad) {
                var loaded = function() {
                    $('.grid-search').fadeOut(fadeSpeed !== undefined ? fadeSpeed : 300).find('input[type="text"]:first').val('');
                    self._onchange(this, function() {
                        self.reset();
                        self.renderBuilder();
                        self.currentType = 'custom';
                    }, function() { self.element.trigger('filteropen'); }, fadeSpeed !== undefined ? fadeSpeed : 300);
                    afterLoad ? afterLoad() : $.noop();
                };
                !self.options.prefetch ? self._load(function() { loaded(); }) : loaded();
            });
        },

        renderBuilder: function() {
            var self = this,
                options = this.options;

            if (options.prefetch == null) {
                self._load(function() {
                    self.renderBuilder();
                });

                return;
            }

            var element = $.tmpl(options.templates.filterBuilder, { buttonText: this.options.texts.saveFilter, saveLabel: self.options.texts && self.options.texts.enterTheFilterName ? self.options.texts.enterTheFilterName : '', columnTitle: this.options.texts.savedFilters, criteriaTitle: self.options.texts && self.options.texts.filterCriteria ? self.options.texts.filterCriteria : '' }).appendTo(self.body);
            element.find('.filter-expressions');
            var filterOptions = $("<div class='options'></div>");

            element.find('.column-filter').append(filterOptions);
            self.renderDefaultExpression();
            self.re_loadCustom();
            self.saveCustom();
            self._bind();
        },

        _bind: function() {
            var self = this,
                link = this.element.find('.save-filter').parent().find('a:first');

            link.click(function(e) {

                var value = self.body.find('.options>ul')[0].value;

                var filterName = value == "-1" ? self.options.texts && self.options.texts.customFilter ? self.options.texts.customFilter : '' + (self.options.prefetch.custom.length + 1) : value;

                $.confirm({ context: link, url: "/sitecore/apps/popupprompt.aspx", type: 'inline', title: self.options.pleaseEnterFilter, inputValue: filterName, yes: self.options.texts && self.options.texts.save ? self.options.texts.save : '', no: self.options.texts && self.options.texts.cancel ? self.options.texts.cancel : '' })
                    .done(function(txt) {
                        if (txt) {
                            self.doSaveCustom(txt.val());
                        }
                    });
                e.stopImmediatePropagation();
                return false;
            }).on('popupdialogclose', function(e, a, hdl) {
                e.stopImmediatePropagation();
                $(link).popupdialog('destroy');
                return false;
            });

        },

        doSaveCustom: function(filterName) {
            var self = this;

            if (filterName == null || filterName == '') {
                filterName = self.options.texts && self.options.texts.customFilter ? self.options.texts.customFilter + ' ' : '' + (sef.options.prefetch.custom.length + 1);
            }

            var select = self.body.find('.options>ul');
            var current = 0;

            select.find('li > span').each(function(i) {
                if (this.firstChild.nodeValue == filterName) {
                    current = i;
                }
            });

            var customFilter = null;

            if (current > 0) {
                customFilter = self.options.prefetch.custom[current - 1];

                if (customFilter.title != filterName) {
                    customFilter = null;
                    //current = 0;
                }
            }

            if (customFilter == null) {
                customFilter = { };
                self.options.prefetch.custom.push(customFilter);
            }

            customFilter.title = filterName;
            customFilter.exps = self.rules;
            self.postCustom(current, customFilter);
            self.re_loadCustom(current > 0 ? current : self.options.prefetch.custom.length);

            return false;
        },

        saveCustom: function() {
            var self = this,
                options = this.options;

            self.element.find('.filter-settings>a:first').click(function(e) {
                self.updateName();
                return false;
            });
        },

        postCustom: function(index, customFilter) {
            $.netajax(this.element, "save:" + index + ":" + customFilter.title);
        },

        updateName: function(hide) {
            var self = this;
            var panel = this.element.find('.save-filter');
            var link = panel.fadeOut(300).parent().find('a:first');

            link.click(function() {
                var value = self.body.find('.options>ul')[0].value;
                var filterName = value == "-1" ? self.options.texts && self.options.texts.customFilter ? self.options.texts.customFilter + ' ' : '' + (self.options.prefetch.custom.length + 1) : value;

                $.confirm({ context: link, url: "/sitecore/apps/popupprompt.aspx", type: 'inline', inputValue: filterName, yes: self.options.texts && self.options.texts.save ? self.options.texts.save : '', no: self.options.texts && self.options.texts.cancel ? self.options.texts.cancel : '' })
                    .done(function(txt) {
                        if (txt) {
                            self.doSaveCustom(txt.val());
                        }
                    });

                return false;
            });
        },

        getListSelectedIndex: function(item) {
            if (item) {
                for (var i = 0; i < item.parentNode.childNodes.length; i++) {
                    if (item.parentNode.childNodes[i] == item) {
                        return i;
                    }
                }
            }

            return -1;
        },

        re_loadCustom: function(_selectedIndex) {
            var selectedIndex = _selectedIndex || 0;

            var self = this,
                options = this.options;

            var list = $.tmpl(options.templates.customFilterList, {
                none: self.options.texts && self.options.texts.none ? self.options.texts.none : 'None',
                selectedNone: true,
                options: $.map(options.prefetch.custom, function(element, index) {
                    return { title: element.title, index: element.title, name: element.title };
                })
            }).appendTo(self.body.find('.options').off().html(''));

            $('li', list).removeClass("selected");

            list[0].selectedItem = list[0].childNodes[selectedIndex] || null;
            list[0].value = list[0].selectedItem ? list[0].selectedItem.getAttribute("value") : "-1";

            list[0].selectedItem.className = "selected";

            //-------------------------------------------------------------
            // Show tooltip only if filter name width longer as item width
            //-------------------------------------------------------------
            $('li > span', list).hover(function() {
                var item = this.parentNode;

                if (this.offsetWidth > item.offsetWidth) {
                    item.setAttribute("title", item.getAttribute("_title"));
                }
            });

            //-------------------------------------------------------------
            // Processing Delete button
            //-------------------------------------------------------------
            $('.btn-delete', list).click(function() {

                var item = this.parentNode;
                var index = self.getListSelectedIndex(item) - 1;

                /*
                $.netajax(self.element, "remove:" + index);

                options.prefetch.custom.splice(index, 1);
                item.parentNode.removeChild(item);
                */

                $.confirm({ context: $(this), type: 'inline', yes: self.options.texts && self.options.texts["delete"] ? self.options.texts["delete"] : '', no: self.options.texts && self.options.texts.cancel ? self.options.texts.cancel : '', title: self.options.texts && self.options.texts.doDelete ? self.options.texts.doDelete : '' })
                    .done(function(val) {
                        if (val == "yes") {
                            $.netajax(self.element, "remove:" + index);

                            options.prefetch.custom.splice(index, 1);
                            item.parentNode.removeChild(item);

                            self.re_loadCustom();
                        }
                    });

                return false;
            })
                .on('popupdialogclose', function(e, a, hdl) {
                    e.stopImmediatePropagation();
                    $(this).popupdialog('destroy');
                    return false;
                });

            $('li', list).click(function() {
                //-------------------------------------------------------------
                // Processing selected item in fiter list
                //-------------------------------------------------------------
                var listNode = this.parentNode;

                if (this == listNode.selectedItem) {
                    return;
                }

                if (listNode.selectedItem) {
                    listNode.selectedItem.className = "";
                }

                this.className = "selected";

                listNode.selectedItem = this;
                listNode.value = this.getAttribute("value");

                //-------------------------------------------------------------

                self.body.find('.filter-builder-area').off().html('');

                var selectedIndex = self.getListSelectedIndex(this);

                if (selectedIndex > 0) {
                    var exps = options.prefetch.custom[selectedIndex - 1].exps;

                    if (exps != null && exps.length > 0) {
                        var i = 0;
                        while (i < exps.length) {
                            var a = exps[i];
                            ++i;
                            var o = exps.length > i ? exps[i] : "or";
                            ++i;
                            self.renderExpression($("<div class='expressions'></div>").appendTo(self.body.find('.filter-builder-area')), a.name, a.op, a.values[0], o);
                        }

                        self.body.find('.expressions').trigger('sortupdate');
                    } else {
                        self.renderDefaultExpression();
                    }
                } else {
                    self.renderDefaultExpression();
                }

                self.updateName(true);
                self.applyCustom();
            });
        },

        renderDefaultExpression: function() {
            this.renderExpression($("<div class='expressions'></div>").appendTo(this.body.find('.filter-builder-area')));
        },

        applyCustom: function() {
            var self = this,
                options = this.options;

            self.rules = [];
            var expressions = self.body.find(".expressions");
            var i = 0;
            expressions.each(function() {
                var ex = $(this);

                self.rules.push({
                    name: ex.find('.ex-column>select').val(),
                    values: [ex.find('.ex-value>[data-value]').attr('data-value') || ex.find('.ex-value>input, .ex-value>select').val()] || "",
                    op: ex.find('.ex-operator>select').val()
                });

                ++i;

                self.rules.push(ex.find('.ex-union-operator>a').attr('rel'));

                ++i;
            });

            self.rules.pop();

            self.dumpRules();
        },

        renderExpression: function(parent, column, operator, value, uop) {
            var self = this,
                options = this.options;

            this.renderRemoveExpression(parent);
            this.renderExpressionColumn(parent, column);
            this.renderExpressionOperators(parent, operator, value, uop);

            parent.off().on('blur change', function(e) {
                self.applyCustom();
            });

            parent.parent().off('sortupdate').sortable('destroy')
                .sortable().on("sortupdate", function(event, ui) {
                    var expressions = $(this).find('.expressions');
                    expressions.each(function(i) {
                        if (i < expressions.length - 1) {
                            $(this).find('.ex-add').hide();
                            $(this).find('.ex-union-operator').show();
                        } else {
                            $(this).find('.ex-add').show();
                            $(this).find('.ex-union-operator').hide();
                        }
                    });
                    self.applyCustom();
                });
        },

        renderExpressionColumn: function(expression, column) {
            var self = this,
                options = this.options;
            var data = [];
            $(options.prefetch.filters).each(function(i) {
                this.index = this.name;
                this.selected = this.name == column;
                data.push(this);
            });
            self.renderChoice(expression, data, column || (data[0] || { index: '' }).index, 'ex-column').on('change', function() {
                self.renderExpressionValue(expression);
            });
        },

        renderExpressionOperators: function(expression, operator, value, uop) {
            var self = this,
                options = this.options;

            this.renderChoice(expression, this.options.prefetch.operators, operator || (this.options.prefetch.operators[0] || { index: '' }).index, 'ex-operator').on('change', function(e) {
                if (e.currentTarget.hasClass('ex-operator')) {
                    self.renderExpressionValue(expression, expression.find('.ex-value').val());
                } else {
                    self.renderExpressionValue(expression);
                }
            });

            this.renderExpressionValue(expression, value);

            this.renderUnionOperator(expression, uop);
            this.renderAddExpression(expression);
        },

        renderExpressionValue: function(expression, value) {
            var options = this.options;
            var activeOption = expression.find('.ex-operator>select')[0].selectedIndex;


            this.renderChoice(expression, null, null, 'ex-value', this.getType(expression.find('.ex-column>select').val(), value));

        },

        getType: function(name, value) {
            var column = $(this.options.prefetch.filters)
                .filter(function(i, e) { return e.name == name; })[0] || { };

            column.type = column.type || 'input';

            var editor = this["_" + column.type] ? this["_" + column.type](name) : this["_input"](name);

            if (value) {
                editor.val(value);
            }

            return editor;
        },

        _input: function(index) {
            return $("<input type='text'></input>");
        },

        renderUnionOperator: function(expression, value) {
            var texts = this.options.texts;
            if (!value) {
                value = 'or';
            }
            this.renderChoice(expression, null, null, 'ex-union-operator', $('<a href="#" rel="' + value + '">' + (value == 'or' ? texts.or : texts.and) + '</a>').click(function(e) {
                var self = $(this);
                if (self.attr('rel') == 'or') {
                    self.text(texts && texts.and ? texts.and : '').attr('rel', 'and');
                } else {
                    self.text(texts && texts.or ? texts.or : '').attr('rel', 'or');
                }
                $(this).trigger('change', [e, this]);
                return false;
            })).hide();
        },

        renderAddExpression: function(expression) {
            var self = this;
            this.renderChoice(expression, null, null, 'ex-add', $('<span class="ui-icon ui-icon-plus"></span>').hover(
                function() { $(this).parent().addClass('ui-state-hover'); },
                function() { $(this).parent().removeClass('ui-state-hover'); }))
                .click(function(e) {
                    expression.find('.ex-remove').css('visibility', 'visible');
                    expression.find('.ex-add').hide();
                    expression.find('.ex-union-operator').show();
                    self.renderDefaultExpression();
                    return false;
                });
            self.element.trigger('addexpression');
        },

        renderRemoveExpression: function(expression) {
            var self = this;

            this.renderChoice(expression, null, null, 'ex-remove', $('<span class="ui-icon ui-icon-minus"></span>')
                .hover(
                    function() {
                        $(this).parent().addClass('ui-state-hover');
                    },
                    function() {
                        $(this).parent().removeClass('ui-state-hover');
                    }
                ))
                .click(function() {
                    if (expression.next().length == 0) {
                        expression.prev().find('.ex-add').show();
                        expression.prev().find('.ex-union-operator').hide();
                    }

                    var parent = expression.parent();
                    expression.remove();
                    self.element.trigger('removeexpression');
                    if (parent.find('.ex-remove').length == 1) {
                        parent.find('.ex-remove').css('visibility', 'hidden');
                    }

                    self.applyCustom();

                    return false;
                });

            if (expression.siblings().length < 1) {
                expression.find('.ex-remove').css('visibility', 'hidden');
            } else if (expression.siblings().length == 1) {
                expression.siblings().find(".ex-remove").css('visibility', 'visible');
            }
        },

        renderChoice: function(expression, data, active, className, editor) {
            var self = this,
                options = this.options;
            var instance = expression.find('div.' + className).off().html('');
            if (instance.length == 0) {
                instance = $("<div class='" + className + "'></div>").appendTo(expression);
            }

            if (editor == null) {
                var currentGroup = false;
                instance.append($.tmpl(options.templates.select,
                    {
                        options: $.map(data, function(element, index) {
                            element.selected = element.index == active;
                            if (index == 0) {
                                currentGroup = element.group || false;
                                element.optgroup = currentGroup || false;
                            } else if (index < data.length - 1 && data[index + 1].group && data[index + 1].group != currentGroup) {
                                element.optgroupEnd = true;
                                currentGroup = data[index + 1].group;
                                data[index + 1].optgroup = currentGroup;
                            }
                            if (index == data.length - 1) {
                                element.optgroupEnd = true;
                            }
                            return element;

                        })
                    }));
            } else {
                instance.append(editor);
            }
            instance.find('ex-add').click(function() { $(this).trigger('change'); });
            return instance;
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