(function(a){a.widget("sc.fieldsgroup",{options:{header:"legend"},_create:function(){var b=this;if(!this.element.parents(".collapsible").size()||this.element.find(".group-name").size()){this.storage=new a.Storage;b.state=this.storage.get(this.element.attr("id")?this.element.attr("id"):this.element.attr("data-id")+"_fieldsgroup");b.state=b.state?b.state:"closed";this.header=this.element.find(this.options.header).first();b.id=b.element.attr("id");this.element.find(".layout-column").each(function(){a(this).hasClass("right-column")?a.noop():a(this).next().hasClass("layout-column")?a(this).addClass("left-column").next().addClass("right-column"):a(this).addClass("left-column")});if(this.element.find('*[data-importance = "3"]').size()){b.state=="closed"&&!b.element.hasClass("abn-item")?this.element.find('*[data-importance = "3"]').css({display:"none"}):a.noop();this.more=a('<div class="more-block" style="overflow:hidden" />').append(a('<a href="#" class="more-info ">'+(b.state=="closed"?b.options.texts&&b.options.texts.more?b.options.texts.more:' <span class="arrow-up-down">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>':b.options.texts&&b.options.texts.less?b.options.texts.less:' <span class="arrow-up-down">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>')+"</a>").addClass(b.state).css("float","right").on("click",function(){var c=b.element.find('*[data-importance = "3"]'),d=a(this);b.state=="closed"?c.slideDown(300,function(){d.triggerHandler("aftereffect",true)}):c.slideUp(300,function(){d.triggerHandler("aftereffect",false)});return false}).on("aftereffect.sc",function(d,c){if(c){a(this).removeClass("closed").addClass("opened").html(b.options.texts&&b.options.texts.less?b.options.texts.less:' <span class="arrow-up-down">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');b.state="opened";b.storage.set(b.element.attr("id")?b.element.attr("id"):b.element.attr("data-id")+"_fieldsgroup","opened")}else{a(this).removeClass("opened").addClass("closed").html(b.options.texts&&b.options.texts.more?b.options.texts.more:' <span class="arrow-up-down">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');b.state="closed";b.storage.set(b.element.attr("id")?b.element.attr("id"):b.element.attr("data-id")+"_fieldsgroup","closed")}}));!this.element.find(".field-editor:last .more-block").size()?this.more.appendTo(this.element.find(".field-editor:last")):a.noop();b.options.texts&&this.element.find(".more-block a").addClass("arrow")}this._bind()}},_bind:function(){var b=this;this.element.on("beforetoggle.fieldsgroup",function(){b._beforeOpen()});this.element.on("aftertoggle.fieldsgroup",function(){b._afterClose()});this.element.on("showhiddenvalidator.fieldsgroup",function(){b.state=="opened"?a.noop():b.element.find(".more-info").triggerHandler("click")});this.element.find("input[type=text]").on("keydown",function(c){if(c.keyCode=="13"){var b=a(this).closest(".field").next().find("input:visible");b.size()?b.focus():a(this).blur();return false}})},_afterClose:function(){var b=this;if(this.element.find('*[data-importance = "1"]').size()){b.header.find(".p-title:first > span:first").append('<div class="field-description"><div class="field-text"></div></div>');var c=b.header.find(".field-description");this.element.find('*[data-importance = "1"]').each(function(g){var e=a(this).find(".field-value").size()?a(this).find(".field-value").get(0).tagName.toLowerCase()=="input"||a(this).find(".field-value").get(0).tagName.toLowerCase()=="select"?a(this).find(".field-value").attr("value"):a(this).find(".field-value").text():a(this).find(".editor").size()?a(this).find(".editor").text():a(this).find(".editor-ro").size()?a(this).find(".editor-ro").text():a(this).text(),f=a(this).find(".field-value"),d=e?a("<span>"+e+"</span>"):false;d?c.find(".field-text").append(g?"&nbsp;&nbsp;&#124;&nbsp;&nbsp;":"").append(d.on("click",function(){b.element.off("show.input").on("show.input",function(){f.focus()})})):a.noop();d?a(this).find("label.title").text()?d.tooltip({position:["bottom","center"],text:'<div class="title">'+a(this).find("label.title").text()+'</div><div class="value">'+e+"</div>",offset:[0,0]}):a(this).find("span.title").text()?d.tooltip({position:["bottom","center"],text:'<div class="title">'+a(this).find("span.title").text()+'</div><div class="value">'+e+"</div>",offset:[0,0]}):a.noop():a.noop();a(this).is("img")?c.prepend(a(this).clone().addClass("preview-img").css({display:"block",opacity:0,width:"48px",height:"48px"})).append('<div style="clear:both"></div>'):a.noop()});b.header.find(".field-description").children().size()?b.header.find(".field-description").css({display:"none"}).slideDown(200,function(){a(this).find(".preview-img").animate({opacity:1},200)}):b.header.find(".field-description").css({display:"none"})}},_beforeOpen:function(){var b=this;b.header.find(".field-description").size()?b.header.find(".field-description").slideUp(200,function(){a(this).remove()}):a.noop()},destroy:function(){return a.Widget.prototype.destroy.call(this)}})})(jQuery);if(typeof Sys!=="undefined"){Sys.Browser.WebKit={};if(navigator.userAgent.indexOf("WebKit/")>-1){Sys.Browser.agent=Sys.Browser.WebKit;Sys.Browser.version=parseFloat(navigator.userAgent.match(/WebKit\/(\d+(\.\d+)?)/)[1]);Sys.Browser.name="WebKit"}Sys.Application.notifyScriptLoaded()}
