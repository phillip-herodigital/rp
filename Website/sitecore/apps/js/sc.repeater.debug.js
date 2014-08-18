(function ($) {
    $.widget("sc.repeater", {
        options: {
            enablePaging: true,
            page: 1,
            pageSize: 1,
            loadMoreHolderSelector: null,
            scrollHolderSelector: null,
            template: null,
            callbackid: null,
            data: null,
            sord: "asc",
            sidx: "",
            loadTemplate: "<div class='loading'><div>{{if text}}${text}{{/if}}</div><img src='/sitecore/apps/img/sc-spinner16.gif'/></div>"
        },

        _create: function () {

            var self = this,
            options = this.options;

            this.element.attr('data-name', this.options.name);

            options.activeInstance = this.element;
            options.cloneInstance = this.element.clone();

            self.settings = this.element.find('input:first');

            this._composeList();

            if (options.enablePaging) {
                if (options.loadMoreHolderSelector != null) {
                    self.attachLoadMore();
                    return;
                }
                self.attachScroll();
            }
        },

        _composeList: function () {
            if (this.options.template != null && this.options.data != null) {
                this.options.activeInstance.prepend(this._template());
            };

            return null;
        },

        _template: function () {
            return $.tmpl(this.options.template, this.options.data);
        },

        attachScroll: function () {

            var self = this,
            options = this.options;

            self.options.data.length ? self.options.page = 1 : self.options.page = 0;
            self.options.data.length ? $.noop() : self.options.data = [];
            //var element = $(this);
            var element = self.element.parents('.item-shell');

            if (!element.length) {
                return false;
            }

            var scrollHolder = element[0].scrollHeight > element.outerHeight() ? element : element.parent();
            var scrollAjax = function () {
                if (self.isNearBottom(scrollHolder)) {
                    var b = $.tmpl(options.loadTemplate, { text: self.options.texts && self.options.texts.loading ? self.options.texts.loading : '' });
                    var loadMoreCopy = $.tmpl(options.loadTemplate, { text: self.options.texts && self.options.texts.loading ? self.options.texts.loading : '' }).clone();
                    if (!$(this).find(".loading").size()) {
                        $(this).append(loadMoreCopy);
                    }

                    var scrollElement = $(this);
                    self.settings.val((self.options.page += 1) + ',' + (self.options.pageSize || '') + ',' + (self.options.sord || '') + ',' + (self.options.sidx || ''));
                    self.element.find('input:hidden').val(self.settings.val());
                    //self.element.prepend("<input id='rows' type='hidden' value='" + (self.options.pageSize || '') + "'>");
                    $.netajax(self.element, null, false, self.options.name)
                        .done(function (data) {
                            if (data != null) {
                                var dataBefore = self.serializeData(self.options.data);
                                self.options.data = self.merge(true, self.options.data, data);
                                var copy = self.options.cloneInstance.clone();
                                $('.container-group', element).size() ? $.noop() : $('.item-container', element).html(copy.prepend($.tmpl(self.options.template, self.options.data)).html());
                                $(loadMoreCopy).remove();
                                if (self.serializeData(options.data) == dataBefore) {
                                    scrollHolder.off('scroll');
                                }
                                element.trigger("onDataLoad");
                            }
                        });

                    return false;
                }
                return undefined;
            };
            scrollHolder.off('scroll').on('scroll', function () {
                self.timeout ? clearTimeout(self.timeout) : $.noop();
                self.timeout = setTimeout(scrollAjax, 50);
            });

            return undefined;
        },

        attachLoadMore: function () {
            var self = this,
            options = this.options;

                $(options.loadMoreHolderSelector).click(function (e) {
                    $(options.loadMoreHolderSelector).replaceWith($.tmpl(options.loadTemplate, { text: self.options.texts && self.options.texts.loading ? self.options.texts.loading : '' }));

                    $.getJSON(
                        $.sc.location({}, options.activeInstance).url + '\\' + options.callbackid + '\\readpage',
                        $.sc.location({ "page": options.page += 1, "sord": options.sord, "sidx": options.sidx }).search,
                        function (data) {
                            if (data != null) {
                                var dataBefore = self.serializeData(options.data);
                                options.data = self.merge(true, options.data, data);

                                var copy = options.cloneInstance.clone();

                                copy.hide();
                                options.activeInstance.replaceWith(copy.prepend($.tmpl(options.template, options.data)));
                                options.activeInstance = copy;

                                copy.fadeIn('slow', function () {
                                });
                                $(options.loadMoreHolderSelector).focus();
                                if (self.serializeData(options.data) == dataBefore) {
                                    $(options.loadMoreHolderSelector).hide();
                                }
                            }
                        }
                    );

                    return false;
                });
        },

        serializeData: function (data) {
            var result = '';
                if ($.isArray(data)) {
                    for (var i = 0; i < data.length; i++) {
                        result += ";" + this.serializeData(data[i]);
                    }
                } else {
                    for (var name in data) {
                        if ($.isArray(data[name])) {
                            result += ";" + name + "=" + this.serializeData(data[name]);
                        } else {
                            result += ";" + name + "=" + data[name];
                        }
                    }
                }
            return result;
        },

        isNearBottom: function (scrollHolder) {
            return this.getDocumentHeight(scrollHolder) - scrollHolder.scrollTop() - 20 <= scrollHolder.height();
        },

        getDocumentHeight: function (scrollHolder) {
            return scrollHolder[0].scrollHeight;
        },

        getUrl: function (instance) {
            var url = (instance || this.element).parents('form').attr('action') || location.href;
            url = (url || window.location.pathname);
            if (url.indexOf("?") > -1) {
                url = url.substring(0, url.indexOf("?"));
            }
            return url;
        },

        merge: function (deep, obj1, obj2) {
            var result = obj1;
            if ($.isArray(obj2)) {
                result = $.merge(obj1, obj2);
            }
            else {
                for (var name in obj2) {
                    result[name] = $.merge(obj1[name], obj2[name]);
                    if (deep && typeof obj2[name] == 'object') {
                        this.merge(obj1[name], obj2[name]);
                    }
                }
            }
            return result;
        },

        getQs: function () {
            var data = {};
            if (location.search) {
                var pair = (location.search.substr(1)).split('&');
                for (var i = 0; i < pair.length; i++) {
                    var param = pair[i].split('=');
                    data[param[0]] = param[1];
                }
            }
            return data;
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