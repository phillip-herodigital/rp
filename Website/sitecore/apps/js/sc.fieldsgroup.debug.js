(function ($) {

    $.widget("sc.fieldsgroup", {

        options: {
            header: 'legend'
        },

        _create: function () {
            var self = this;
            if (!this.element.parents('.collapsible').size() || this.element.find('.group-name').size()) {
                this.storage = new $.Storage();
                self.state = this.storage.get(this.element.attr('id') ? this.element.attr('id') : this.element.attr('data-id') + '_fieldsgroup');
                self.state = self.state ? self.state : 'closed';
                this.header = this.element.find(this.options.header).first();
                self.id = self.element.attr('id');
                this.element.find('.layout-column').each(function () {
                    $(this).hasClass('right-column') ?
                    $.noop() :
                    ($(this).next().hasClass('layout-column') ? $(this).addClass('left-column').next().addClass('right-column') : $(this).addClass('left-column'));
                });
                if (this.element.find('*[data-importance = "3"]').size()) {
                    (self.state == 'closed' && !self.element.hasClass('abn-item')) ? this.element.find('*[data-importance = "3"]').css({ 'display': 'none' }) : $.noop();
                    this.more = $('<div class="more-block" style="overflow:hidden" />').append(
                    $('<a href="#" class="more-info ">' +
                            (self.state == 'closed' ? self.options.texts && self.options.texts.more ? self.options.texts.more : '' + ' <span class="arrow-up-down">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' : self.options.texts && self.options.texts.less ? self.options.texts.less : '' + ' <span class="arrow-up-down">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>') +
                     '</a>').addClass(self.state).css('float', 'right').on('click', function () {
                         var field = self.element.find('*[data-importance = "3"]'),
                            link = $(this);
                         self.state == "closed" ? field.slideDown(300, function () { link.triggerHandler('aftereffect', true); }) : field.slideUp(300, function () { link.triggerHandler('aftereffect', false); });

                         return false;
                     }).on('aftereffect.sc', function (e, show) {
                         if (show) {
                             $(this).removeClass('closed').addClass('opened').html(self.options.texts && self.options.texts.less ? self.options.texts.less : '' + ' <span class="arrow-up-down">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');
                             self.state = 'opened';
                             self.storage.set(self.element.attr('id') ? self.element.attr('id') : self.element.attr('data-id') + '_fieldsgroup', 'opened');
                         } else {
                             $(this).removeClass('opened').addClass('closed').html(self.options.texts && self.options.texts.more ? self.options.texts.more : '' + ' <span class="arrow-up-down">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');
                             self.state = 'closed';
                             self.storage.set(self.element.attr('id') ? self.element.attr('id') : self.element.attr('data-id') + '_fieldsgroup', 'closed');
                         }
                     })
                    );
                    !this.element.find('.field-editor:last .more-block').size() ? this.more.appendTo(this.element.find('.field-editor:last')) : $.noop();
                    if (self.options.texts) {
                        this.element.find('.more-block a').addClass('arrow');
                    }
                }

                this._bind();
            }
        },
        _bind: function () {
            var self = this;
            this.element.on('beforetoggle.fieldsgroup', function () { self._beforeOpen(); });
            this.element.on('aftertoggle.fieldsgroup', function () { self._afterClose(); });
            this.element.on('showhiddenvalidator.fieldsgroup', function () { self.state == "opened" ? $.noop() : self.element.find('.more-info').triggerHandler('click'); });
            this.element.find('input[type=text]').on("keydown", function (e) {
                if (e.keyCode == '13') {
                    var nextInput = $(this).closest('.field').next().find('input:visible');
                    nextInput.size() ? nextInput.focus() : $(this).blur();
                    return false;
                }
            });
        },

        _afterClose: function () {
            var self = this;

            if (this.element.find('*[data-importance = "1"]').size()) {
                self.header.find('.p-title:first > span:first').append('<div class="field-description"><div class="field-text"></div></div>');
                var description = self.header.find('.field-description'); //.width(self.header.find('.field-description').width());
                this.element.find('*[data-importance = "1"]').each(function (i) {
                    var val = (
                        $(this).find('.field-value').size() ?
                            $(this).find('.field-value').get(0).tagName.toLowerCase() == 'input' || $(this).find('.field-value').get(0).tagName.toLowerCase() == 'select' ?
                                $(this).find('.field-value').attr('value') :
                                $(this).find('.field-value').text() :
                            $(this).find('.editor').size() ?
                                $(this).find('.editor').text() :
                                $(this).find('.editor-ro').size() ?
                                    $(this).find('.editor-ro').text() :
                                    $(this).text()
                    ),
                        field = $(this).find('.field-value'),
                        span = val ?
                            $('<span>' + val + '</span>') :
                            false;
                    span ? description.find('.field-text').append(i ? '&nbsp;&nbsp;&#124;&nbsp;&nbsp;' : '').append(span.on('click', function () { self.element.off('show.input').on('show.input', function () { field.focus(); }); })) : $.noop();
                    span ? $(this).find('label.title').text() ? span.tooltip({ position: ['bottom', 'center'], 'text': '<div class="title">' + $(this).find('label.title').text() + '</div><div class="value">' + val + '</div>', offset: [0, 0] }) : $(this).find('span.title').text() ? span.tooltip({ position: ['bottom', 'center'], 'text': '<div class="title">' + $(this).find('span.title').text() + '</div><div class="value">' + val + '</div>', offset: [0, 0] }) : $.noop() : $.noop();
                    //$(this).find('span.title').text() ? span.tooltip({ position: ['bottom', 'center'], 'text': '<div class="title">' + $(this).find('span.title').text() + '</div><div class="value">' + val + '</div>', offset: [0, 0] }) : $.noop();
                    $(this).is("img") ?
                    description.prepend($(this).clone().addClass('preview-img').css({ 'display': 'block', opacity: 0, width: '48px', height: '48px' })).append('<div style="clear:both"></div>') : $.noop();

                });
                self.header.find('.field-description').children().size() ? self.header.find('.field-description').css({ 'display': 'none' }).slideDown(200, function () { $(this).find('.preview-img').animate({ opacity: 1 }, 200); }) : self.header.find('.field-description').css({ 'display': 'none' });
            }

        },
        _beforeOpen: function () {
            var self = this;
            self.header.find('.field-description').size() ?
                self.header.find('.field-description').slideUp(200, function () { $(this).remove(); }) :
                $.noop();
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