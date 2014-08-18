(function ($) {
    $.widget("sc.multilist", {
        options: {

        },

        _create: function () {
            this.prepareHtml();
            this.addachEvent();
        },

        addachEvent: function () {
            var self = this;
            var element = self.element.parent();
            element.find('.add-right').click(function (e) {
                self.addRight(e);
                self.stopEvent(e);
            });
            element.find('.add-left').click(function (e) {
                self.addLeft(e);
                self.stopEvent(e);
            });
            element.find('.move-top').click(function (e) {
                self.moveTop(e);
                self.stopEvent(e);
            });
            element.find('.move-bottom').click(function (e) {
                self.moveBottom(e);
                self.stopEvent(e);
            });
            element.find('.multiselect-left').dblclick(function (e) {
                self.addRight(e);
                self.stopEvent(e);
            });
            element.find('.multiselect-right').dblclick(function (e) {
                self.addLeft(e);
                self.stopEvent(e);
            });

            this.updateValue(element);
        },

        stopEvent: function (e) {
            this.updateValue($(e.currentTarget).parents('div.multiselect'));

            e.preventDefault();
            e.stopPropagation();
            return false;
        },

        addLeft: function (e) {
            var multiselect = $(e.currentTarget).parents('div.multiselect');
            this.moveSelectedOptions(multiselect.find('.multiselect-right'), multiselect.find('.multiselect-left'));
        },

        moveSelectedOptions: function (from, to) {
            var option = from.find("option[selected]");
            if (option.length > 0) {
                option.each(function () { this.selected = false; }).appendTo(to);
            }
        },

        addRight: function (e) {
            var multiselect = $(e.currentTarget).parents('div.multiselect');
            this.moveSelectedOptions(multiselect.find('.multiselect-left'), multiselect.find('.multiselect-right'));
        },

        moveTop: function (e) {
            var multiselect = $(e.currentTarget).parents('div.multiselect').find(".multiselect-right");
            var selected = multiselect.find('option:selected');
            selected.prev('option:not(:selected):first').before(selected);
        },

        moveBottom: function (e) {
            var multiselect = $(e.currentTarget).parents('div.multiselect').find(".multiselect-right");
            var selected = multiselect.find('option:selected');
            selected.next('option:not(:selected):first').after(selected);
        },

        updateValue: function (multiselect) {
            multiselect.find('select:hidden').empty().append(multiselect.find('select.multiselect-right option').clone().each(function () { this.selected = true; }));
        },

        prepareHtml: function () {
            this.element.addClass('multiselect-part multiselect-left');
            this.element.removeClass('field-value').parent().addClass('multiselect')
                .prepend("<div class='title'><div class='all-title'>" + this.options.texts.all + ":</div><div class='button-title'></div><div class='selected-title'>" + this.options.texts.selected + ":</div></div>")
                .prepend($("<select multiple='multiple'></select>").addClass('field-value').css('display', 'none').attr({ id: this.element.attr('id'), name: this.element.attr('name') }))
                .append("<div><a class='add-right ui-button' href='#'><span class='ui-icon ui-icon-carat-1-e'/></a><a href='#' class='add-left ui-button'><span class='ui-icon ui-icon-carat-1-w'/></a></div>")
                .append($("<select multiple='multiple'></select>").addClass('multiselect-part multiselect-right').append(this.element.find(':selected').each(function () { this.selected = false; })))
                .append("<div><a href='#' class='move-top ui-button'><span class='ui-icon ui-icon-carat-1-n'/></a><a href='#' class='move-bottom ui-button'><span class='ui-icon ui-icon-carat-1-s'/></a></div>");
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