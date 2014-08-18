(function ($) {
    $.widget("sc.combobox", {

        options: {
            watermark: 'Select Item',
            defaultValue: '',
            width: null,
            height: 200,
            readonly: false,
            show: function (popup) {
                popup.stop().slideDown(100).scrollTop(0).trigger('scroll');
            },
            hide: function (popup, onClose) {
                popup.stop().slideUp(100, onClose);
            },
            onSelect: function () { },
            onClose: function () { },
            closeOnClick: false,
            popupTemplate: '<div class="ui-widget-content ui-combobox"></div>',
            comboboxTemplate: '<div class="ui-combobox-trigger"><span class="ui-icon-triangle-1-s ui-icon ui-combobox-icon"></span><input type="text" class="ui-combobox-title"></input></div>',
            visible: false,
            position: 'right'
        },

        _create: function () {
            var self = this,
            options = this.options;

            self.combobox = $(options.comboboxTemplate);
            self.element.off('over.combobox').on('over.combobox', function () {
                self.hidePopup();
                self.comboboxZIndex = self.popup.css('z-index');
                // self.popup.css('z-index', '1001');
                //self.combobox.removeClass('ui-state-hover');
            })
                .off('leave.combobox').on('leave.combobox', function () {
                    self.popup.css('z-index', self.comboboxZIndex);
                });
            if (options.getValue == null) {
                options.getValue = function () {
                    return $("#" + options.content + "_selected").val();
                };
            }

            if (!options.readonly) {
                self.combobox.click(
                    function (e) {
                        if (self.options.visible) {
                            self.hidePopup($(e.currentTarget), e);
                            self.combobox.removeClass('ui-state-hover');
                        } else {
                            $('.ui-popupmenu, .filter-combobox, .ui-state-hover').filter(function () { return !$(this).is(self.popup); });
                            self.showPopup($(e.currentTarget), e);
                        }
                        return false;
                    })
                .hover(
                    function () { $(this).addClass('ui-state-hover'); },
                    function () { if (!self.popup.is(':animated') && self.popup.is(':hidden')) { $(this).removeClass('ui-state-hover'); } });
            } else {
                self.combobox.attr('disabled', 'disabled');
            }
            $('body').click(function (e) {
                if (self.options.visible) {
                    self.combobox.trigger('click', [e]);
                }
            });

            var inputField = self.combobox.find('.ui-combobox-title');
            inputField.attr({ 'title': options.watermark || '', 'value': options.defaultValue });
            if (options.readonly) {
                inputField.attr('disabled', 'disabled');
            }

            self.popup = $(options.popupTemplate).hover(
                    function () { },
                    function () { if (self.options.visible && !options.closeOnClick) { self.hidePopup(); } })
                .css({ width: self.combobox.width(), height: options.height });
            self.element.closest('.ui-accordion-header, .ui-dialog-title').size() ? $.noop() : self.element.css('position', 'relative');

            self.addContent();
            self.popup.parents('.smart-panel').size() ? self.popup.css('position', 'fixed') : $.noop();
            //self.element.find('.ui-combobox-icon').css({ 'margin-top': this.combobox.height() > 0 ? (this.combobox.height() / 2 - 8) : 0 + "px" });
        },
        getPopup: function () {
            return this.popup;
        },
        addContent: function () {
            var self = this,
            options = this.options;

            var nestedContent;

            if (options.content != null) {
                var content = $('#' + options.content);
                if (!content.parent().hasClass("ui-combobox")) {
                    content.detach();
                }
                nestedContent = content.clone();
            }
            else {
                nestedContent = $(self.element.html());
                self.element.html('');
            }

            self.element.append(self.combobox);
            this.element.closest('form').append(self.popup);

            self.popup.hide();

            nestedContent.appendTo(self.popup);

            nestedContent.delegate("a", "click", function (e) {
                self.onClick(e);
            }).click(function (e) {
                $(e.target).is('.close') ?
                $.noop() :
                e.stopPropagation();
            });

            nestedContent.delegate('input[type="checkbox"]', 'change', function (e) {
                !this.closest('th').size() ? self.onClick(e) : $.noop();
            });
        },

        onClick: function (e) {
            var self = this,
            options = this.options,
            nestedValue = this.options.getValue(e, this);

            e.preventDefault();
            if (nestedValue != null) {
                var title;
                var value;
                if (typeof (nestedValue) == 'string') {
                    value = nestedValue;
                    title = nestedValue;
                } else {

                    title = nestedValue.title;
                    value = nestedValue.value || title;
                }

                if (self[0] != null) {
                    var id = self[0].id;
                    if (id != null) {
                        $('#' + id + '_selected').val(value);
                    }
                }

                if (title && title.length > 60) {
                    title = "..." + title.substring(title.length - 60);
                }

                self.combobox.find('.ui-combobox-title').val(title).trigger('change');
                options.onSelect(value);
            }
            if (options.closeOnClick) {
                self.hidePopup();
            }
            e.stopPropagation();

            self.element.trigger('select', [$(e.currentTarget), nestedValue, this]);

            return this;
        },
        _countOffset: function (sender) {
            var self = this,
                options = this.options;
            return {
                top: self.popup.parents('.smart-panel').size() ? (sender.offset().top - $(window).scrollTop()) + (sender.hasClass('no-offset') ? 0 : (sender.height() + 1)) : self.formOffset().top + (sender.hasClass('no-offset') ? 0 : (sender.height() + 1)),
                left: self.popup.parents('.smart-panel').size() ? sender.offset().left - ((options.width != null ? options.width : sender.width()) - sender.outerWidth()) : self.formOffset().left,
                width: (options.width != null ? options.width : sender.width())
            };
        },
        onBeforeShow: function (target, e, position) {
            var self = this,
                sender = target,
                options = self.options,
                popup = self.popup;


            if (self.combobox.closest('.ui-widget-content').size() == 0) {
                $('body').trigger('click');
                $('.ui-state-hover').trigger('over.combobox');
            }

            popup.css(this._countOffset(sender, position));
            //popup.css({top: 100, left: 300, width: 420});
            if (options.height == 'auto') {
                popup.css('height', 'auto');
            }
            self.combobox.addClass('sc-state-active');
        },
        _onAfterShow: function (target, e) {
            var self = this,
                sender = target,
                options = this.options,
                popup = this.popup;
            if (options.width == null) {
                var delta = popup.innerWidth() - sender.innerWidth();
                if (delta != 0) {
                    popup.width(popup.width() - delta);
                }
            }

            self.element.trigger('show.combobox', [this]);
            self.options.visible = true;
            $(window).on('resize.combobox', function () { self.onBeforeShow(target, e); });
        },
        showPopup: function (target, e) {
            this.onBeforeShow(target, e);
            this.options.show(this.popup);
            this._onAfterShow(target, e);
        },

        getLeftPopupPosition: function () {
            var self = this,
            options = this.options;
            if (options.width != null) {
                var leftPopupPosition = options.position == 'left' ? self.combobox.offset().left : (self.combobox.offset().left + self.combobox.outerWidth() - options.width || self.combobox.width());
                return leftPopupPosition;
            }
            return self.element.offset().left;
        },
        offsetFrom: function (obj) {
            return {
                top: this.element.offset().top - obj.offset().top,
                left: this.getLeftPopupPosition() - obj.offset().left
            };
        },

        formOffset: function () {
            if (this.element.closest('#sc_overlay, .sc-overlay').length > 0) {
                return this.offsetFrom(this.element.closest('#sc_overlay, .sc-overlay'));
            }

            if (this.element.closest('.smart-panel').length > 0) {
                return this.offsetFrom(this.element.closest('.switched-content').size() > 0 ? this.element.closest('.switched-content') : this.element.closest('.popup-content'));
            } else {
                return { top: this.element.offset().top, left: this.getLeftPopupPosition() };
            }
        },

        _onAfterHide: function () {
            this.element.trigger('hide.combobox', [this]);
            $(window).off('resize.combobox');
            this.options.visible = false;
            this.combobox.removeClass('sc-state-active');
        },
        hidePopup: function () {
            this.options.hide(this.popup, this.options.onClose);
            this._onAfterHide();
        },

        destroy: function () {
            this.combobox.remove();
            this.popup.remove();
            return $.Widget.prototype.destroy.call(this);
        }
    });
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