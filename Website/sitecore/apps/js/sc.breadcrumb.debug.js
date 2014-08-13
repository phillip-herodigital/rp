/**
 * @author Jason Roy for CompareNetworks Inc.
 * Thanks to mikejbond for suggested udaptes
 *
 * Version 1.1
 * Copyright (c) 2009 CompareNetworks Inc.
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */
(function($)
{

    // Private variables
    
    var _options = {};
    var _container = {};
    var _breadCrumbElements = {};
    var _autoIntervalArray = [];
	var _easingEquation;
    
    // Public functions
    
    jQuery.fn.jBreadCrumb = function(options)
    {
        _options = $.extend({}, $.fn.jBreadCrumb.defaults, options);
        
        return this.each(function()
        {
            _container = $(this);
            setupBreadCrumb();
        });
        
    };
    
    // Private functions
    
    function setupBreadCrumb()
    {
		//Check if easing plugin exists. If it doesn't, use "swing"
		if(typeof(jQuery.easing) == 'object')
		{
			_easingEquation = 'easeOutQuad'
		}
		else
		{
			_easingEquation = 'swing'
		}
    
        //The reference object containing all of the breadcrumb elements
        _breadCrumbElements = jQuery(_container).find('li');
        
        //Keep it from overflowing in ie6 & 7
        jQuery(_container).find('ul').wrap('<div style="overflow:hidden; position:relative;  width: ' + jQuery(_container).css("width") + ';"><div>');
        //Set an arbitrary width width to avoid float drop on the animation
        jQuery(_container).find('ul').width(5000);
        
        //If the breadcrumb contains nothing, don't do anything
        if (_breadCrumbElements.length > 0) 
        {
            jQuery(_breadCrumbElements[_breadCrumbElements.length - 1]).addClass('last');
            jQuery(_breadCrumbElements[0]).addClass('first');
            
            //If the breadcrumb object length is long enough, compress.
            
            if (_breadCrumbElements.length > _options.minimumCompressionElements) 
            {
                compressBreadCrumb();
            };
                    };
            };
    
    function compressBreadCrumb()
    {
    
        // Factor to determine if we should compress the element at all
        var finalElement = jQuery(_breadCrumbElements[_breadCrumbElements.length - 1]);
        
        
        // If the final element is really long, compress more elements
        if (jQuery(finalElement).width() > _options.maxFinalElementLength) 
        {
            if (_options.beginingElementsToLeaveOpen > 0) 
            {
                _options.beginingElementsToLeaveOpen--;
                
            }
            if (_options.endElementsToLeaveOpen > 0) 
            {
                _options.endElementsToLeaveOpen--;
            }
        }
        // If the final element is within the short and long range, compress to the default end elements and 1 less beginning elements
        if (jQuery(finalElement).width() < _options.maxFinalElementLength && jQuery(finalElement).width() > _options.minFinalElementLength) 
        {
            if (_options.beginingElementsToLeaveOpen > 0) 
            {
                _options.beginingElementsToLeaveOpen--;
                
            }
        }
        
        var itemsToRemove = _breadCrumbElements.length - 1 - _options.endElementsToLeaveOpen;
        
        // We compress only elements determined by the formula setting below
        
        //TODO : Make this smarter, it's only checking the final elements length.  It could also check the amount of elements.
        jQuery(_breadCrumbElements[_breadCrumbElements.length - 1]).css(
        {
            background: 'none'
        });
        
        $(_breadCrumbElements).each(function(i, listElement)
        {
            if (i > _options.beginingElementsToLeaveOpen && i < itemsToRemove) 
            {
            
                jQuery(listElement).find('a').wrap('<span></span>').width(jQuery(listElement).find('a').width() + 10);
                
                // Add the overlay png.
                jQuery(listElement).append(jQuery('<div class="' + _options.overlayClass + '"></div>').css(
                {
                    display: 'block'
                })).css(
                {
                    background: 'none'
                });
                if (isIE6OrLess()) 
                {
                    fixPNG(jQuery(listElement).find('.' + _options.overlayClass).css(
                    {
                        width: '20px',
                        right: "-1px"
                    }));
                }
                var options = 
                {
                    id: i,
                    width: jQuery(listElement).width(),
                    listElement: jQuery(listElement).find('span'),
                    isAnimating: false,
                    element: jQuery(listElement).find('span')
                
                };
                jQuery(listElement).bind('mouseover', options, expandBreadCrumb).bind('mouseout', options, shrinkBreadCrumb);
                jQuery(listElement).find('a').unbind('mouseover', expandBreadCrumb).unbind('mouseout', shrinkBreadCrumb);
                listElement.autoInterval = setInterval(function()
                {
                    clearInterval(listElement.autoInterval);
                    jQuery(listElement).find('span').animate(
                    {
                        width: _options.previewWidth
                    }, _options.timeInitialCollapse, _options.easing);
                }, (150 * (i - 2)));
                
            }
        });
        
    };
    
    function expandBreadCrumb(e)
    {
        var elementID = e.data.id;
        var originalWidth = e.data.width;
        jQuery(e.data.element).stop();
        jQuery(e.data.element).animate(
        {
            width: originalWidth
        }, 
        {
            duration: _options.timeExpansionAnimation,
            easing: _options.easing,
            queue: false
        });
        return false;
        
    };
    
    function shrinkBreadCrumb(e)
    {
        var elementID = e.data.id;
        jQuery(e.data.element).stop();
        jQuery(e.data.element).animate(
        {
            width: _options.previewWidth
        }, 
        {
            duration: _options.timeCompressionAnimation,
            easing: _options.easing,
            queue: false
        });
        return false;
    };
    
    function isIE6OrLess()
    {
        var isIE6 = $.browser.msie && /MSIE\s(5\.5|6\.)/.test(navigator.userAgent);
        return isIE6;
    };
    // Fix The Overlay for IE6
    function fixPNG(element)
    {
        var image;
        if (jQuery(element).is('img')) 
        {
            image = jQuery(element).attr('src');
        }
        else 
        {
            image = $(element).css('backgroundImage');
            image.match(/^url\(["']?(.*\.png)["']?\)$/i);
            image = RegExp.$1;
            ;
        }
        $(element).css(
        {
            'backgroundImage': 'none',
            'filter': "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=scale, src='" + image + "')"
        });
    };
    
    // Public global variables
    
    jQuery.fn.jBreadCrumb.defaults = 
    {
        maxFinalElementLength: 400,
        minFinalElementLength: 200,
        minimumCompressionElements: 4,
        endElementsToLeaveOpen: 1,
        beginingElementsToLeaveOpen: 1,
        timeExpansionAnimation: 800,
        timeCompressionAnimation: 500,
        timeInitialCollapse: 600,
        easing: _easingEquation,
        overlayClass: 'chevronOverlay',
        previewWidth: 5
    };
    
})(jQuery);
﻿(function ($) {
    $.widget("sc.breadcrumb",
    {
        options: {
            template: "{{if value.length > 1}}<ul>{{each value}}<li {{if $value.index == 2}}class='second'{{/if}}> {{if value.length  != $value.index}}<a href='${$value.url}'{{if $value.title}} title='${$value.title}'{{/if}}>{{/if}}{{if $value.icon}} <span style='background-image: url(${$value.icon})'></span>{{else}}${$value.title}{{/if}}{{if value.length != $value.index}}</a>{{/if}}</li>{{/each}}</ul>{{/if}}"
        },
        _create: function () {
            this.options.enablePaging = false;
            this.element.repeater(this.options);
            this.element.jBreadCrumb();
        },
        _destroy: function () {
            $.Widget.prototype.destroy.apply(this);
        }
    });
    $(document).ready(function () {
        !document.referrer || document.referrer == document.location.href ? localStorage.setItem('previousUrl', localStorage.getItem('previousUrl')) : localStorage.setItem('previousUrl', document.referrer);
        $(window).off('beforeunload.prevpage').on('beforeunload.prevpage', function (e) {
            var storage = new $.Storage({ 'storageKey': 'previousPage' }),
                    previousUrl = storage.get('previousUrl'),
                    location = $.sc.location();
            if (previousUrl) {
                if (previousUrl != $.sc.location().raw) {
                    storage.set('previousTitle', $.trim($('.top:first h1:first').size() ? $('.top h1').text() : $('title').text()));
                    storage.set('previousUrl', location.raw);
                    storage.set('appDomain', document.domain);
                }
            } else {
                storage.set('previousTitle', $.trim($('.top:first h1:first').size() ? $('.top h1').text() : $('title').text()));
                storage.set('previousUrl', $.sc.location().raw);
                storage.set('appDomain', document.domain);
            }
            $(window).trigger('afterbeforeunload');
        });
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