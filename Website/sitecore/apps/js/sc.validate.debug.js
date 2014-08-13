(function ($) {
    $.widget("sc.validate", {

        options: {
            group: null,
            submit: false,
            ignore: ".cancel"
        },

        rules: {},

        _create: function () {
            this.submitted = false;
            this.hidden = false;
            this.cancelValidate = false;

            this._bind();
        },

        _bind: function () {
            var self = this,
                func = function (e, name, args, target) {
                    self.submitted = self.options.submit || (e || {}).type === 'submit' || ((e || {}).target && $((e || {}).target).attr('type') === 'submit');
                    if (!self.cancelValidate && (target == null || !$(target).is(self.options.ignore))) {
                        if (!self.validate(null, !e ? { 'error': self.rules['error'], 'warning': self.rules['warning'], 'information': self.rules['information']} : null)) {
                            ((e || {}).type === 'submit') || (e.target && $(e.target).attr('type') === 'submit') ?
                                self.element.trigger('validateclientfailure') :
                                $.noop();
                            return false;
                        }
                    }
                    self.cancelValidate = false;
                    return true;
                };


            if (self.options.group) {
                $("#" + self.options.group, this.element).on('click', func);
            } else {
                $('*[type="submit"]').on('click', function (e) { return func(e); });
                this.element.parents('form').on('submit', func)
                    .click(function (e) {
                        self.cancelValidate = $(e.target).is(self.options.ignore);
                    });
            }

            func();

            self.options.submit = false;
            self.submitted = false;
        },

        validate: function (element, rules) {
            var self = this;
            self.valid = true;

            (($(element, this.element).size() ? $(element, this.element) : false) || $('*[data-val="true"]', this.element)).each(function () {
                $.each(self.validators(this, rules || null), function () {
                    return self._test(this) ? self._unhighlight(this) : self._highlight(this);
                });
            });
            return self.valid;
        },

        highlighted: function () {
            var self = this,
				active = [];

            $('*[aria-invalid="true"]', this.element).each(function () {
                active.push(
                    self.validators(this).filter(function (e, i) {
                        return !(e.rule == 'error' || e.rule == 'warning' || e.rule == 'information' ? false : self._test(e));
                    })[0]);
            });

            return active.filter(function (e) { return e; });
        },

        validators: function (element, filter) {
            var self = this,
				data = $(element).data(),
				rules = { 'error': [], 'warning': [], 'information': [] };

            for (var rule in filter || self.rules) {
                var key = "val" + $.map(rule, function (n, i) {
                    return i == 0 ? n.toUpperCase() : n;
                }).join(''),
                    message = data[key],
					messageType = data[key + 'Type'];
                if (message) {
                    var params = [];
                    $.each(data, function (index, value) {
                        if (index.search(key) != -1 && index != key && index != key + 'Type') {
                            params.push(value);
                        }
                    });
                    params.sort().reverse();
                    if (rule == 'error' || rule == 'warning' || rule == 'information') {
                        messageType = rule;
                        message = message + '<br />' + params.join('<br />');
                    }
                    rules[messageType || 'error'].push({ 'rule': rule, 'submitted': self.submitted, 'message': message, 'params': params, 'value': $(element).val(), 'element': element, 'type': (messageType || 'error') });
                }
            }
            return rules.error.concat(rules.warning, rules.information);
        },

        _test: function (validator) {
            return this.rules[validator.rule](validator.value, validator.element, validator.params) && validator.type !== 'information';
        },

        _highlight: function (validator) {
            this._unhighlight(validator, true);
            (!this.element.closest('.popup-content').size() || this.element.closest('.smart-panel').size()) ? this.element.trigger('validatehighlight', [validator]) : $.noop();
            var editor = $(validator.element).closest('.editor'),
				field = $(validator.element).closest('.field');
            field.addClass(validator.type + '-field');
            var label = $('<div class="validation-icon ' + validator.type + '"></div>');
            label.insertAfter(editor).tooltip({ position: ['top', 'left'], offset: [0, 0], effect: "simple", delay: 0, type: 'simple', className: validator.type, 'text': validator.message });
            this.valid = validator.type !== 'error';
            $(validator.element).attr('aria-invalid', validator.type === 'error' || validator.type === 'warning' ? true : false);
            return false;
        },

        _unhighlight: function (validator, silent) {
            silent ? $.noop() : ((!this.element.closest('.popup-content').size() || this.element.closest('.smart-panel').size()) ? this.element.trigger('validateunhighlight', [validator]) : $.noop());
            var field = $(validator.element).closest('.field').removeClass(validator.type + '-field');
            field.find('.validation-icon').tooltip('destroy').remove();
            $(validator.element).attr('aria-invalid', false);
            return true;
        },

        destroy: function () {
            return $.Widget.prototype.destroy.call(this);
        }
    });
})(jQuery);﻿(function ($) {
    var prototype = $.sc.validate.prototype;

    $.widget("sc.validate", $.extend({ }, prototype, {
        _bind: function() {
            var self = this;
            prototype._bind.apply(this, arguments);

            $('*[data-val="true"]', this.element)
                .focus(function() { self.onfocus(this); })
                .blur(function() { self.onblur(this); })
                .keyup(function() { self.onkeyup(this); })
                .change(function() { self.onchange(this); });
            this.element.parents().on("contenthide", function(e) {
                $.each(self.highlighted(), function() {
                    this.hidden = true;
                    $(this.element).trigger('validatehighlight', this);
                });
            });
        },

        onfocus: function(element) {
            this.active = element;
            $(element).closest('.field').find('.validation-icon').triggerHandler('mouseenter');
        },

        onblur: function(element) {
            $(element).closest('.field').find('.validation-icon').triggerHandler('mouseleave');
            this.validate(element);
        },

        onkeyup: function(element) {
            this.validate(element);
            $(element).closest('.field').find('.validation-icon').triggerHandler('mouseenter');
        },

        onchange: function(element) {
            this.validate(element);
        },

        onclick: function(element) {

        }
    }));

})(jQuery);﻿(function ($) {
    var prototype = $.sc.validate.prototype;

    $.widget("sc.validate", $.extend({}, prototype, {
        _create: function () {
            var self = this;
            this.rules = $.extend({}, prototype.rules, {
                required: function (value, element, param) {
                    return $.trim(value).length > 0;
                },

                length: function (value, element, param) {
                    if (value.length <= param[0]) {
                        return true;
                    }
                    return false;
                },

                range: function (value, element, param) {
                    var val = $.trim(value);
                    if (/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(val)) {
                        var intVal = parseInt(val, 10);
                        if (param.length > 1) {
                            if (param[0] > param[1]) {
                                var temp = param[0];
                                param[0] = param[1];
                                param[1] = temp;
                            }
                            return (intVal > param[0] && intVal < param[1]) ? true : false;
                        } else {
                            return intVal <= param[0] ? true : false;
                        }
                    }
                    return false;
                },
                itemname: function (value, element, param) {
                    var result = '';
                    $.netajax($("#" + param[0]), value, false)
                    .done(function (data) {
                        result = data.message;
                    });
                    if (result.length > 0) {
                        $(element).attr("data-val-itemname", result);
                        return false;
                    }
                    return true;
                },
                regex: function (value, element, param) {
                    var regexp = new RegExp(param[0], 'g');
                    return regexp.test(value);
                },
                error: function (value, element, param) {
                    return $(element).attr('aria-invalid') == undefined ? false : true;
                },
                warning: function (value, element, param) {
                    return $(element).attr('aria-invalid') == undefined ? false : true;
                },
                information: function (value, element, param) {
                    return true;
                }
            });
            prototype._create.apply(this, arguments);
        },
        _removeAttributes: function (element, prefix, attrPrefix) {
            var data = $(element).data();
            $.each(data, function (index, value) {
                if (index.search(prefix) != -1) {
                    $(element).removeData(index);
                    var attrVal = index.replace(prefix, '').toLowerCase();
                    $(element).removeAttr('data-' + attrPrefix + (attrVal.length ? '-' + attrVal : ''));
                }
            });
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