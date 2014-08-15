function __netajax() {
     var post = '';
     var find = function (name) {
         var element = typeof (name) === 'string' ? $('[name="' + name + '"]').add("[href*='" + name + "']").add("[data-name='" + name + "']").first() : $(name || active);
         return element.data('eventAjax') === true || element.closest('.popup-instance').size() ? element : element.closest('form');
     },    
     active = null;
    var postBackCode = function(name, args) {
        var element = find(name);
        window.theForm = element.closest('form')[0];
        var result = element.is('form') ? post(typeof(name) === 'string' ? name : name.attr('name') || name.data('name'), args) : $.netajax(element, args, false, name) || false;
        if (!element.is("[href*='" + name + "']")) {
            return result;
        }
        return undefined;
    };

     if (window.__doPostBack == null || window.__doPostBack.toString() != postBackCode.toString()) {
         post = window.__doPostBack || $.noop();
       window.__doPostBack = postBackCode;
    }

    $("form").off('.sc')
        .on('click.sc', function(e) { active = $(e.target); })
        .on('submit.sc', function() { return find(active).is('form') ? true : !$.netajax(active); });
}

$.valHooks.textarea = {
    get: function (elem) {
        return elem.value.replace(/\r?\n/g, "\r\n");
    }
};

(function ($) {
    $.extend($, {
        netajax: function(target, args, async, name) {
            var scroll = $(window).scrollTop();
            //name = target.attr('name') || target.data('name') || ((target.attr('href') || "''").match(/'.*?'/)[0] || '').replace(/'/g, '') || name;
            name = target.attr('name') || target.data('name') || (((target.attr('href') || "''").match( /'.*?'/ ) != undefined ? (target.attr('href').match( /'.*?'/ )[0] || "''") : '') || '').replace( /'/g , '') || name;
            var form = target.closest('form'),
                data = $(form.serializeArray()).filter(function() {
                    return $.inArray(this.name, ['__EVENTTARGET', '__EVENTARGUMENT']) == -1;
                });

            data.push({ 'name': '__EVENTTARGET', value: name },
                { 'name': '__EVENTARGUMENT', value: args || '' });

            return !name ? $.noop() : $.ajax(form.attr('action') || window.location.href,
                {
                    data: $.param(data),
                    dataType: "json",
                    async: async == null || async,
                    type: 'POST',
                    beforeSend: function(xhr) { xhr.setRequestHeader('X-Ajax', 'sc'); }
                })
                .success(function(data) {
                    form.trigger('responsesuccess');
                    $.each(data.controls || [], function(i) { $("#" + i, form).replaceWith(data.controls[i]); });
                    $.each(data.scripts || [], function(i) { $.globalEval(data.scripts[i]); });

                })
                .error(function(response, textStatus, e) { form.trigger('responseerror', (e.message || response.responseText || '')); })
                .always(function() {
                    (target = target.filter(function() { return !this.disabled && this.type != 'hidden'; })).attr('disabled', 'disabled');
                })
                .done(function() {
                    target.removeAttr('disabled');
                    $(window).scrollTop(scroll);
                })
                .fail(function() {
                    target.removeAttr('disabled');
                    $(window).scrollTop(scroll);
                });
        }
    });
})(jQuery)﻿
if (typeof (Sys) !== 'undefined') {
    Sys.Browser.WebKit = {};
    if (navigator.userAgent.indexOf('WebKit/') > -1) {
        Sys.Browser.agent = Sys.Browser.WebKit;
        Sys.Browser.version = parseFloat(navigator.userAgent.match(/WebKit\/(\d+(\.\d+)?)/)[1]);
        Sys.Browser.name = 'WebKit';
    }
    Sys.Application.notifyScriptLoaded();
}