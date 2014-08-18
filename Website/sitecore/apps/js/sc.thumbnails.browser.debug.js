(function ($) {
    $.widget("sc.templateBrowser", $.extend({}, $.sc.repeater.prototype,
	{
	    options: {
	        timer: null,
	        templateShowDelay: 1000,
	        template: '<div class="thumbnail"><span class="icon"{{if processing}} data-processing="${processing}"{{/if}}><img src="${image}" alt="${name}"/></span><span class="name">${name}</span></div>',
	        templateDescription: '<div class="thumbnail"><span class="icon"><img src="${image}" alt="${name}"/></span><span class="name"><a name="${idDescription}">${name}{{if titledetails}} - ${titledetails}{{/if}}</a></span><p>${details}</p></div>',
	        detailsTemplate: '<div class="template-details off"><div class="action-panel"></div>' +
			                 '<a href="#" class="thumbnail"><img src="#" width="256" /></a>' +
			                 '<div class="detailsPanel">{{if name}}<span class="name">${name}</span>{{/if}}{{if type}}<span class="type">${type}</span>{{/if}}{{if details}}<span class="details">${details}</span>{{/if}}' +
			                 '</div><div class="splash off"></div></div>',
	        pageSize: 20,
	        loadTemplate: "<div class='loading'><div>{{if text}}${text}{{/if}}</div><img src='/sitecore/apps/img/sc-spinner16.gif'/></div>",
	        hiddenForSelectedThumbnail: 'choosemessagetemplate_content_Thumbnails_selected',
	        fadeSpeed: 100,
	        zoomSpeed: 200,
	        onClientClick: null,
	        sizePanel: false,
	        showPreview: false,
	        showSpinnerOnIConClick: false,
	        spinner: {
	            type: 'global',
	            endless: false,
	            text: ''
	        }
	    },

	    _create: function () {
	        var self = this;
	        if (!this.options.type) {
	            for (var item = 0; item <= this.options.data.length - 1; item++) {
	                self.options.data[item].groupname ? self.options.type = 'list' : $.noop();
	            }
	        }

	        this._sortGroupName();

	        $.sc.repeater.prototype._create.apply(this, arguments);
	        //this._createDetails();
	        this._bindCombobox();
	        this.options.actionsid ? $('#' + options.actionsid).trigger('iconlistcreate') : $.noop();
	    },

	    _createDetails: function (params) {
	        var self = this,
	            options = this.options,
                appendTo = self.element.closest('form').size() ? self.element.closest('form') : self.element.find('form:first').size() ? self.element.find('form:first') : false;
	        self.pos = 0;
	        params = params || {};
	        if (appendTo) {
	            if (this.detailsObj && this.detailsObj.size()) {
	                this.detailsObj.remove();
	                this.detailsObj = $.tmpl(options.detailsTemplate, params).appendTo(appendTo);
	            } else {
	                if (appendTo.find('.template-details').size()) {
	                    appendTo.find('.template-details').remove();
	                    this.detailsObj = $.tmpl(options.detailsTemplate, params).appendTo(appendTo);
	                } else {
	                    this.detailsObj = $.tmpl(options.detailsTemplate, params).appendTo(appendTo);
	                }
	            }
	            this.detailsObj.css('display', 'none');
	            this._bindDetails();
	        }
	    },

	    _createSplash: function () {
	        var self = this,
                appendTo = self.element.closest('form').size() ? self.element.closest('form') : self.element.find('form:first').size() ? self.element.find('form:first') : false;
	        if (appendTo) {
	            this.splashNode = $('<div class="templateSplash"></div>').css({ display: 'none' });

	            if (appendTo.find('.templateSplash').size()) {
	                appendTo.find('.templateSplash').remove();
	                this.splashNode = this.splashNode.appendTo(appendTo);
	            } else {
	                this.splashNode.appendTo(appendTo);
	            }
	            return this.splashNode;
	        } else {
	            return false;
	        }
	    },
	    _position: function ($item) {
	        var self = this,
                offset = { 'left': $item.offset().left - ($item.closest('form').offset() ? $item.closest('form').offset().left : 0), 'top': $item.offset().top - ($item.closest('form').offset() ? $item.closest('form').offset().top : 0) };
	        self.pos =
			{
			    x0: offset.left,
			    y0: offset.top,
			    x1: offset.left - (self.detailsObj.outerWidth() - $item.outerWidth()) / 2,
			    y1: offset.top - (self.detailsObj.outerHeight() - $item.outerHeight()) / 2,

			    w0: $item.width(),
			    h0: $item.height(),
			    w1: self.detailsObj.outerWidth(),
			    h1: self.detailsObj.outerHeight()
			};
	        return self.pos;
	    },

	    _effectStart: function ($item, itemData) {
	        var self = this,
                selectedThumbnail = $('#' + self.options.hiddenForSelectedThumbnail).val(itemData.id),
                item = $item[0],
                options = this.options;
	        self._createDetails(itemData);
	        $('#' + options.actionsid).trigger('over', [$('.action-panel', self.detailsObj), null, null]);
	        $('.thumbnail', self.detailsObj).attr("href", $('.icon', $item).attr("href"));

	        self.detailsObj ? self.detailsObj.off('click').on('click', function () {
	            $.netajax(self.element, itemData.id);
	            return false;
	        }) : $.noop();
	        var pos = self.detailsObj ? self._position($item) : false,
                splash = self._createSplash();
	        splash ? splash
			.css({ left: pos.x0, top: pos.y0, width: pos.w0, height: pos.h0, display: 'block', position: 'absolute' })
			.animate({ left: pos.x1, top: pos.y1, width: pos.w1, height: pos.h1 }, self.options.zoomSpeed, function () {
			    $(this).remove();
			    self.detailsObj
					.css({ left: pos.x1, top: pos.y1, display: 'block' })
					.removeClass("off")
					.addClass("on");

			    $(".thumbnail > img", self.detailsObj).attr("src", $("img", item).attr("src"));

			    $('.splash', self.detailsObj)
					.removeClass("off").addClass("on")
					.animate({ opacity: 0 }, self.options.fadeSpeed, function () {
					    $(this).removeClass("on").addClass("off");
					});

			}) : $.noop();
	        $('#' + options.actionsid).off('show.tbrowser').on('show.tbrowser', function () {
	            self.detailsObj ? self.detailsObj.trigger('cancelhide') : $.noop();
	        }).off('hide.tbrowser').on('hide.tbrowser', function () {
	            self.detailsObj ? self.detailsObj.trigger('canhide') : $.noop();
	        });
	    },

	    _effectEnd: function () {
	        var self = this;

	        $('.splash', self.detailsObj).removeClass("off").addClass("on");
	        $(".thumbnail > img", self.detailsObj).attr("src", "");
	        var splash = self._createSplash();
	        splash ? splash
			.css({ left: self.pos.x1, top: self.pos.y1, width: self.pos.w1, height: self.pos.h1, display: 'block', position: 'absolute' })
			.animate({ left: self.pos.x0, top: self.pos.y0, width: self.pos.w0, height: self.pos.h0 }, self.options.zoomSpeed, function () {
			    $(this).animate({ opacity: 0 }, self.options.fadeSpeed, function () {
			        $(this).remove();
			    });

			    $('#' + self.options.actionsid).trigger('leave', [{ 'position': 'relative', 'top': 'auto', 'right': 'auto' }, null]);

			}) : $.noop();

	        self.detailsObj ? self.detailsObj.removeClass("on").addClass("off") : $.noop();
	    },
	    _bindDetails: function () {
	        var self = this;
	        self.canhide = true;
	        if (this.options.showPreview) {
	            this.detailsObj ? this.detailsObj
                .off('cancelhide.splash')
                .on('cancelhide.splash', function () {
                    self.canhide = false;
                })
                .off('canhide.splash')
                .on('canhide.splash', function () {
                    self.canhide = true;
                }).mouseover(function () {
                    self.timer ? clearTimeout(self.timer) : $.noop();
                }).mouseout(function () {
                    self.timer = setTimeout(function () {
                        self.canhide ? self._effectEnd() : $.noop();
                    },
			    20);
                }) : $.noop();
	            this.detailsObj ? $(window).resize(function () {
	                self.detailsObj.removeClass("on").addClass("off");
	            }) : $.noop();
	        }
	    },
	    _bindCombobox: function () {
	        var self = this;
	    },

	    _composeList: function () {
	        var self = this,
                listHeight = false;
	        listHeight = parseInt(self.element.css('height'), 10) ? self.element.css('height') : false;
	        listHeight ? self.element.css('height', 'auto') : $.noop();

	        if (!self.element.parents('.icon-list').size()) {
	            self.element
				.addClass("item-container")
				.wrap("<div class='item-shell' " + (listHeight ? ("style = 'height:" + listHeight + ";' ") : "") + "><div class='item-group'><div class='container-shell maximized'></div></div></div>");
	            self.element.parent('.icon-list').find('.size-panel').size() ? $.noop() :
                self.options.sizePanel ?
                $('.item-shell').before(
				"<div class='size-panel'><ul class='icon-size'>" +
				"<li><a class='btn-icon-size large selected' href='#'>Large</a></li>" +
				"<li><a class='btn-icon-size medium' href='#'>Medium</a></li>" +
				"<li><a class='btn-icon-size small' href='#'>Small</a></li>" +
				"<li><a class='btn-icon-size extrasmall' href='#'>Extra small</a></li>" +
				"</ul></div>"
			    ) : $.noop();

	            self.element.parents('.item-shell').wrap('<div class="icon-list" style="overflow:auto; height:' + (listHeight ? listHeight + 'px' : '100%') + ';"></div>');
	        }

	        if (!this.options.type) {
	            this.options.activeInstance.prepend(this._template());
	            $('.item-shell').on('onDataLoad', function () { self._initThumbnails(); }).trigger('onDataLoad');
	        }

	        $('.btn-icon-size').click(function () {
	            var $btn = $(this);

	            $('.btn-icon-size').removeClass("selected");
	            $btn.addClass("selected");

	            if ($btn.hasClass("extrasmall")) {
	                self._renderIcons(16, 244);
	            }

	            if ($btn.hasClass("small")) {
	                self._renderIcons(32, 64);
	            }

	            if ($btn.hasClass("medium")) {
	                self._renderIcons(64, 112);
	            }

	            if ($btn.hasClass("large")) {
	                self._renderIcons(128, 144);
	            }
	        });
	    },

	    _initThumbnails: function () {
	        var self = this;

	        if (!this.options.type) {
	            this.options.activeInstance.find('.thumbnail')
				.each(function () { self._listenToItem($(this)); });

	            self._renderIcons();
	        }
	    },

	    _sortGroupName: function () {
	        this.options.data.sort(function (a, b) {
	            return (a.groupindex - b.groupindex);
	        });
	    },

	    _destroy: function () {
	        $.Widget.prototype.destroy.apply(this);
	    },

	    _render: function () { },

	    template: function () { },

	    _renderIcons: function (_iconDimensions, _thumbnailWidth) {
	        var self = this;
	        $('.btn-icon-size.selected').hasClass("extrasmall") ? $(".item-container").addClass("extrasmall") : $(".item-container").removeClass("extrasmall");

	        var iconDimensions = this.iconDimensions = _iconDimensions || this.iconDimensions || 128;
	        var thumbnailWidth = this.thumbnailWidth = _thumbnailWidth || this.thumbnailWidth || (iconDimensions + 16);

	        var $groups = this.element.find(".item-group");
	        var $icons = this.element.find('.icon');

	        $icons.each(function () {
	            $(this).css({ width: iconDimensions, height: iconDimensions });
	            _thumbnailWidth ? $(this.parentNode).css({ width: thumbnailWidth }) : $.noop();
	            $(this).attr("data-processing") === "true" ?
	                $('img', this).css({ 'margin-top': (iconDimensions - 16) / 2 }).closest('.icon').css({ 'background': '#fff' }) :
                    $('img', this).css({ width: iconDimensions, height: iconDimensions });
	        });

	        $groups.each(function () {
	            var $shell = $('.container-shell', this);
	            this.minimizedHeight = $('.thumbnail').height() + 24;
	            $shell.hasClass('minimized') ?
                    $shell.css({ height: this.minimizedHeight }) :
                    $shell.css({ height: 'auto' });
	        });
	    },

	    _listenToItem: function ($item) {
	        var self = this;
	        var icon = $('.icon', $item);

	        var extraSmallSize = 16;

	        if (this.options.showSpinnerOnIConClick) {
	            $item.spinner({
	                'text': this.options.spinnerText,
	                'type': this.options.spinnerType
	            });
	        }

	        if (this.options.showSpinnerOnIConClick) {
	            $item.spinner(this.options.spinner);
	        }


	        $item.click(function (e) {
	            if (typeof self.options.onClientClick === 'function') {
	                self.options.onClientClick(self.element, $item.tmplItem());
	            }
	            if (self.options.type != 'tile') {
	                $.netajax(self.element, $(this).tmplItem().data.id || self.options.data[$(this).index()].id);
	                e.stopImmediatePropagation();
	            }
	        });
	        if (this.options.showPreview) {
	            icon.mouseover(function () {
	                if (self.iconDimensions == extraSmallSize) {
	                    return;
	                }

	                if (self.options.timer) {
	                    clearTimeout(self.options.timer);
	                }

	                self.options.timer = setTimeout(function () {
	                    self._effectStart($item, $item.tmplItem().data);
	                }, self.options.templateShowDelay);
	            });

	            icon.mouseout(function () {
	                if (self.options.timer) {
	                    clearTimeout(self.options.timer);
	                }
	            });
	        }
	    }
	}));

})(jQuery);

﻿﻿﻿(function ($) {
    var prototype = $.sc.templateBrowser.prototype;
    $.widget("sc.templateBrowser", $.extend({}, prototype, {

        _listenToItem: function ($item) {
            var self = this;
            prototype._listenToItem.apply(this, arguments);
            $item.click(function () {
                self.options.type == 'tile' && !$item.parent().hasClass('description') ?
                window.location.href = '#' + self.element.attr('id') + $item.tmplItem().data.id : $.noop();
            });
        },

        _initThumbnails: function () {
            var self = this;
            prototype._initThumbnails.apply(this, arguments);

            if (self.options.type == 'tile') {
                this.options.activeInstance.find('.thumbnail')
				.each(function () { self._listenToItem($(this)); });
                $('.size-panel').css({ 'display': 'none' });
                self.options.sizePanel = false;
                $('.btn-icon-size').removeClass("selected");
                $(".btn-icon-size.extrasmall").addClass("selected");
                self._renderIcons(16, null);
            }
        },

        _renderIcons: function (_iconDimensions, _thumbnailWidth) {
            var self = this;
            prototype._renderIcons.apply(this, arguments);
            this.options.type == 'tile' ? this.element.closest('.container-shell').addClass('tile-list') : $.noop();
        },

        _composeList: function () {
            var self = this;
            prototype._composeList.apply(this, arguments);
            if (this.options.type == 'tile') {
                this.element.closest('.item-shell').css({ 'height': 'auto' });
                this.element.find('.group-name').append($.tmpl(this.options.template, this.options.data));
                self.template();
                $('.item-shell').on('onDataLoad', function () { self._initThumbnails(); }).trigger('onDataLoad');
            }
        },

        _createCollapsed: function() { 
            var self = this;
            this.element.find('.need-collapsed').each(function(){
                $(this).find('.thumbnail').wrapAll('<div class="field-editor"><div class="field" data-importance="3"></div></div>');

            }) 
        },

        template: function () {
            prototype.template.apply(this, arguments);
            if (this.options.type == 'tile') {
                var tempGroup = [],
				    self = this,
                    options = this.options;
 
                for (i in options.data) {
                    tempGroup[i] = {'groupindex': options.data[i].groupindex, 'groupname': options.data[i].groupname};
                }

                for (var i = tempGroup.length - 1; i > 0; i--) {
                    tempGroup[i].groupname == tempGroup[i - 1].groupname ? tempGroup.splice(i, 1) : $.noop();
                }
   
                 for (i in tempGroup) {
                    for (j in tempGroup) {
                        i != j ? 
                        tempGroup[i].groupname == tempGroup[j].groupname ? 
                            delete tempGroup[j] : $.noop()
                            : $.noop();
                    }  
                }

                for (i in tempGroup) {
                    options.activeInstance.append('<div class="container-group"><div class="group-name">' + tempGroup[i].groupname + '</div></div>');
                }

                for (i in options.data) {
                    options.activeInstance.find('.container-group').each(function () {
                        if ($(this).find('.group-name').text() == options.data[i].groupname) {
                            options.data[i].idDescription = self.element.attr('id') + options.data[i].id;
                            options.data[i].collapsed ? 
                                !$(this).hasClass('need-collapsed') ? $(this).addClass('need-collapsed') : $.noop()
                                : $.noop();

                            if (options.data[i].details) {
                                !options.activeInstance.find('.description').size() ? options.activeInstance.append('<div class="description"></div>') : $.noop();
                                options.activeInstance.find('.description').append($.tmpl(options.templateDescription, options.data[i]));
                            }
                            $(this).append($.tmpl(options.template, options.data[i]));
                        }
                    });
                }

                self._createCollapsed();
                self.element.find('.need-collapsed').fieldsgroup({ "texts": { "more": "More", "less": "Less"} });

            }
        }

    }));
})(jQuery);

﻿﻿﻿(function ($) {
    var prototype = $.sc.templateBrowser.prototype;
    $.widget("sc.templateBrowser", $.extend({}, prototype, {

        _initThumbnails: function () {
            var self = this;
            prototype._initThumbnails.apply(this, arguments);

            if (self.options.type == 'list') {
                this.options.activeInstance.find('.thumbnail')
				.each(function () { self._listenToItem($(this)); });

                $('.size-panel').css({ 'display': 'none' });
                self.options.sizePanel = false;
                $('.btn-icon-size').removeClass("selected");
                $(".btn-icon-size.large").addClass("selected");
                self._renderIcons(128, null);
            }
        },

        _composeList: function () {
            var self = this;
            prototype._composeList.apply(this, arguments);
            if (this.options.type == 'list') {
                this.element.find('.group-name').append($.tmpl(this.options.template, this.options.data));
                $('.item-shell').on('onDataLoad', function () { 
                    self.template(); 
                    self._initThumbnails(); 
                }).trigger('onDataLoad');
            }
        },      

        _removeDuplicateItems: function(data) {
            var newData = [];
            for (var i = 0; i < data.length; i++) {
                var item = data[i].id;
                var add = true;
                for (var n = 0; n < newData.length; n++) {
                    data[i].id == newData[n].id ? add = false : $.noop();
                }
                add ? newData.push(data[i]) : this.options.data.splice(i, 1);
            }
        },

        template: function () {
            prototype.template.apply(this, arguments);
            if (this.options.type == 'list') {
                var tempGroup = [],
				    self = this,
                    options = this.options;
                options.emptyGroupName = '';

                for (i in options.data) {
                    !options.data[i].groupname ? options.data[i].groupname = options.emptyGroupName : $.noop();
                    tempGroup[i] = {'groupindex': options.data[i].groupindex || 0, 'groupname': options.data[i].groupname};
                }

                for (var i = tempGroup.length - 1; i > 0; i--) {
                    tempGroup[i].groupname == tempGroup[i - 1].groupname ? tempGroup.splice(i, 1) : $.noop();
                }
   
                for (i in tempGroup) {
                    for (j in tempGroup) {
                        i != j ? 
                        tempGroup[i].groupname == tempGroup[j].groupname ? 
                            delete tempGroup[j] : $.noop()
                            : $.noop();
                    }  
                }

                self.element.find('.container-group').size() ? self.element.find('.container-group').remove() : $.noop();
                for (i in tempGroup) {
                    options.activeInstance.append('<div class="container-group container-bg"><div class="group-name">' + tempGroup[i].groupname + '</div></div>');
                }

                options.activeInstance.find('.container-group').size() ? self._removeDuplicateItems(self.options.data) : $.noop();
                for (i in options.data) {
                    options.activeInstance.find('.container-group').each(function () {
                        $(this).find('.group-name').text() == options.data[i].groupname ? $(this).append($.tmpl(options.template, options.data[i])) : $.noop();
                    });
                }

            }
        }

    }));
})(jQuery);﻿

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