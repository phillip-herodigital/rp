(function(a){a.widget("sc.popupdialog",{options:{rel:".sc-overlay",template:"<div><div class='sc-cover'></div><div class='sc-overlay'><div class='popup-content'></div></div></div>",type:"modal",oneInstance:false},_create:function(){var c=this,b=this.options;this.windowH=a(window).height();this.windowW=a(window).width();this.element.attr("data-name",this.element.attr("name")||this.element.closest("[name]").attr("name"));this._initialize();this._bind()},_initialize:function(){},_position:function(){return{top:this.options.size=="full"?"1%":screen.height*.4-this.overlay().height()/2>0?screen.height*.4-this.overlay().height()/2+a(window).scrollTop():a(window).scrollTop(),left:this.options.size=="full"?"1%":(a(window).width()-this.overlay().width())/2}},_effectStart:function(c){var b=this._position();this.overlay().hide().css({left:this.options.size!="full"?b.left+"px":b.left,top:this.options.size!="full"?b.top+"px":b.top,opacity:1}).fadeIn(200,function(){c()});this.cover().css({height:a(document).height()+"px",display:"block",opacity:"0.7"})},_effectEnd:function(a){this.overlay().css("display","none");this.cover().css("display","none");a.call()},_bind:function(){var a=this;a._onclickref=function(){a.open();return false};this.element.on("click",this._onclickref)},overlay:function(){if(!this.scOverlay){this._render();this.scOverlay.addClass("popup-instance")}return this.scOverlay},cover:function(){return this.scCover},_render:function(){var c=this,b=a(this.options.template).prependTo("body");this.scOverlay=b.find(this.options.rel);this.scCover=b.find(".sc-cover")},open:function(d){var b=this,c=false;overlay=this.overlay();this.params=(typeof d=="string"?{hdl:d}:d)||{};c=a.sc.location(b.params,b.options.url?b.options.url:b.element.attr("href"));c.search.size?(b.options.size=c.search.size):a.noop();this.url=c.url+(a.param(c.search)?"?"+a.param(c.search):a.param(this.params)?"?"+a.param(this.params):"");this._loading(function(){b.options.beforeLoaded?b.options.beforeLoaded(overlay,b):a.noop();b.overlay().trigger("contentchanged");b._effectStart(function(){b._loaded()});overlay.prev().size()?overlay.prev(".popup-content").trigger("contenthide"):a.noop();overlay.trigger("contentshow")});return false},close:function(b){var a=this;this._changesCommited()&&a._effectEnd(function(){a.element.triggerHandler("popupdialogclose",[b||""]);a.overlay().off().empty()})},_close:function(b,c){a.netajax(this.element,"close:"+c+":"+(b.result&&b.result!=""?b.result:"")+":"+(b.updated!=""?b.updated:""));return false},_loadingError:function(c,d,e,b){b?b():a.noop();if(d=="error"){a("body").triggerHandler("messagesend",{text:c,type:"sys"});this.cover()?this.cover().css("display","none"):a.noop()}},_loading:function(a){var b=this;this.overlay().find(".popup-content:parent:last").add(this.overlay()).first().empty().load((this.url||this.options.url||this.element.attr("href")).replace(" ","%20"),function(c,d,e){b._loadingError(c,d,e,a)})},_changesCommited:function(e){var b={modified:false};(e||this.overlay().find("form")).trigger("beforeunload.popupdialog",[b]);var c=false;(function d(b){a("iframe",b).each(function(f,e){var b=e.contentWindow.scForm;if(b&&b.modified)c=c||b.modified;d(a(e).contents())})})(this.overlay());if(c){!b.message?(b.message=scForm.translate("There are unsaved changes.")):a.noop();return confirm(b.message)}return true},_loaded:function(){var b=this,c=this.overlay();b.options.resizable?this.scOverlay.find(".ui-dialog").resizable({maxHeight:400,maxWidth:600,minHeight:200,minWidth:400}):a.noop();b.options.draggable?this.scOverlay.draggable({handle:".ui-dialog-titlebar"}):a.noop();c.find(".ui-dialog-buttonset>input:first").focus();c.find("form").on("popupdialogclose",function(c,a){b.close(a)});this.element.off(".sc").on("popupdialogclose.sc",function(c,a){b._close(a,b.params.hdl)})},destroy:function(){this.element.off("click",this._onclickref);this.element.off(".sc");return a.Widget.prototype.destroy.call(this)}})})(jQuery);$(function(){$.ajaxPrefilter("script",function(a,c,b){$("script")&&$("script").each(function(){if((a.url||"").indexOf($(this).attr("src"))!==-1){b.abort();return false}return undefined})})});(function(a){var b=a.sc.popupdialog.prototype;a.widget("sc.popupdialog",a.extend({},b,{_initialize:function(){var c=this;if(this.options.type=="smartpanel"){this.options.template='<div class="popup-content"></div>';this.options.rel=".smart-panel";this.direction="right";this.options.width=this.options.width?this.options.width:500;var d=function(){if(c.windowH!=a(window).height()){c.overlay().closest(".smart-panel").css({height:a(window).height()+"px"});c.windowH=a(window).height()}if(c.windowW!=a(window).width()){c._position();c.windowW=a(window).width()}};a(window).off("resize").on("resize",function(){d()})}b._initialize.apply(this,arguments)},open:function(a,c){var e=this,d=false;overlay=this.overlay();if(this.options.type=="smartpanel"){this.element.off("click").on("click",function(){return false});if(overlay.find("form").size()>0&&!c)if(this._changesCommited(overlay.closest(".smart-panel").find("form"))){this.overlay().closest(".container").css("left","0px");this.open(a,true);this.element.closest("form").off("click")}else this._cancel(a);else b.open.apply(this,arguments)}else b.open.apply(this,arguments)},_position:function(){if(this.options.type=="smartpanel"){var c=a("body .content").size()?a("body .content"):a("body"),d=this.overlay().closest(".smart-panel");this.direction=(a(window).width()-c.outerWidth())/2>this.options.width?"left":"right";this.direction==="left"?d.css("left",c.offset().left+c.outerWidth()+"px"):d.css({left:"auto",right:a(window).width()-c.outerWidth()>0?"0px":a(window).width()-(c.offset().left+c.outerWidth())+"px"})}else return b._position.apply(this,arguments)},_cancel:function(b){a.netajax(this.element,"cancel:"+b);this.element.trigger("cancelopen")},_effectStart:function(e){var c=this,d=this.overlay();if(this.options.type=="smartpanel"){this.element.closest("form").find("input[type=submit]").on("click",function(a){a.stopImmediatePropagation()});this.element.closest("form").on("click",function(b,a){c.close(a)});a(window).scrollTop()>a("body").find(".header").outerHeight()?d.css({"padding-top":"0px"}):a.noop();this.overlay().closest(".smart-panel").css({display:"block",opacity:1,height:a(window).scrollTop()>a("body").find(".header").outerHeight()?a(window).height()+"px":a("body .page-content:first").height()+"px"}).animate({width:this.options.width+"px"},200,function(){c.element.triggerHandler("aftereffectstart");e.call()})}else b._effectStart.apply(this,arguments)},_effectEnd:function(d){if(this.options.type=="smartpanel"){var c=a("body > form .ui-jqgrid").parent("div").find("input:first-child[type=hidden]").val().substr(1);a(".ui-jqgrid").parent("div").find("input:first-child[type=hidden]").val("0"+c);this.element.closest("form").off("click");this.overlay().closest(".smart-panel").animate({width:"0px"},200,function(){a(this).css({display:"none"});d.call()})}else b._effectEnd.apply(this,arguments)},_windowOnScroll:function(){var b=this;a(window).off("scroll.smart").on("scroll.smart",function(){a(window).scrollTop()<a("body").find(".header").outerHeight()?b.overlay().closest(".smart-panel").css({position:"absolute",height:a("body .page-content:first").height()+"px"}).find(".popup-content").css({"padding-top":a("body").find(".header").outerHeight()+"px"}):b.overlay().closest(".smart-panel").css({position:"fixed",height:a(window).height()}).find(".popup-content").css({"padding-top":"0px"})})},_panelOffset:function(b){a(window).scrollTop()<a("body").find(".header").outerHeight()?b.css({width:"0px",top:"0px",height:a("body .page-content:first").height()+"px",position:"absolute"}):b.css({width:"0px",top:"0px",height:a(window).height()+"px",position:"fixed"}).find(".popup-content:first").css({"padding-top":"0px"})},_render:function(){if(this.options.type=="smartpanel"){var d=this.options,c=this;pageContent=a("body .content"),panel=null;if(!a("body .smart-panel").size()){panel=a('<div class="smart-panel"><div class="wrapper"><div class="container"></div></div></div>').prependTo(a("body"));panel.find(".container").append(a(d.template,{}));c._panelOffset(panel);c._windowOnScroll()}else{panel=a("body .smart-panel");a("body .smart-panel").find(".popup-content").size()?a.noop():a("body .smart-panel").find(".container").append(a(d.template,{}))}this.scOverlay=a(".popup-content:first",panel).css({height:pageContent.height()+"px",width:this.options.width+"px","padding-top":a(window).scrollTop()<a("body").find(".header").outerHeight()?a("body").find(".header").outerHeight()+"px":"0px"});c._position()}else b._render.apply(this,arguments)},_bind:function(){var a=this;if(this.options.type=="smartpanel"){this._onclickref=function(){a.open();return false};this.element.off("click").on("click",this._onclickref);this.element.off("aftereffectstart.smart").on("aftereffectstart.smart",function(){a._bind()})}else b._bind.apply(this,arguments)}}))})(jQuery);(function(a){var b=a.sc.popupdialog.prototype;a.widget("sc.popupdialog",a.extend({},b,{_initialize:function(){this.isSmartCarrousel=this.options.type=="smartpanel"&&a(this.element).closest(".smart-panel").size();if(this.isSmartCarrousel){this.options.template='<div class="switched-content popup-content"></div>';this.options.rel=".smart-panel";var c=0}else b._initialize.apply(this,arguments)},_effectStart:function(d){var e=this.overlay().closest(".container"),c=this;if(this.isSmartCarrousel)this.overlay().css({display:"block",opacity:1,height:a(window).scrollTop()>a("body").find(".header").outerHeight()?a(window).height()+"px":a("body .page-content:first").height()+"px"}).closest(".container").animate({left:c.leftOffset+"px"},300,function(){d.call();c.element.triggerHandler("aftereffectstart")});else b._effectStart.apply(this,arguments)},_effectEnd:function(d){var a=this,c=this.overlay().closest(".container");if(this.isSmartCarrousel)c.animate({left:a.leftOffset+a.options.width+"px"},300,function(){d.call();a.overlay().empty();a.overlay().next().remove();c.width(c.width()-a.options.width)});else b._effectEnd.apply(this,arguments)},_render:function(){if(this.isSmartCarrousel){this.panelObj=a.tmpl(this.options.template,{});a(".smart-panel .wrapper .container").append(this.panelObj);this.scOverlay=this.panelObj;this.options.width=this.options.width?this.options.width:this.overlay().closest(".container").find(".popup-content:first").width();this.panelObj.css({width:this.options.width+"px"});this.leftOffset=-(this.overlay().closest(".container").find(".popup-content").size()-1)*this.options.width;a(window).trigger("scroll");return}b._render.apply(this,arguments)},_loading:function(d){var f=d?d:a.noop,c=this.overlay(),e=this;this.isSmartCarrousel?c.css("display","none"):a.noop();b._loading.apply(this,[function(){if(e.isSmartCarrousel){c.closest(".container").width(c.closest(".container").width()+e.options.width);a(".ui-dialog-content .ui-dialog-back",c).show().click(function(){a.globalEval(c.find(".close:first").attr("href"))})}f()}])},open:function(c,a){b.open.apply(this,[c,this.isSmartCarrousel||a])},destroy:function(){this.isSmartCarrousel&&this.overlay().remove();b.destroy.apply(this,arguments)}}))})(jQuery);(function(a){var b=a.sc.popupdialog.prototype;a.widget("sc.popupdialog",a.extend({},b,{open:function(){if(this.options.type=="smartpanel"){var d=this,c=this.overlay();c.on("contentshow",function(){c.prev().find(".notify-item-wrapper").each(function(){var b=a(this).tmplItem().data;b.hidden=true;c.find("form").triggerHandler("validatehighlight",b)})});c.on("validatefocus",function(){d._changesCommited(c.nextAll(".popup-content").find("form"))&&c.closest(".container").animate({left:parseInt(c.closest(".container").css("left"),10)+(c.closest(".container").width()-c.position().left-c.width())+"px"},300,function(){c.closest(".container").width(c.closest(".container").width()-(c.closest(".container").width()-c.position().left)+c.width());c.next().empty();c.next().nextAll(".popup-content").remove()})})}b.open.apply(this,arguments)}}))})(jQuery);(function(a){var b=a.sc.popupdialog.prototype;a.widget("sc.popupdialog",a.extend({},b,{_initialize:function(){if(this.options.type=="inline")this.options.template="<div><div class='sc-overlay inline'><div class='popup-content'></div></div></div>";b._initialize.apply(this,arguments)},_effectStart:function(c){var d=this;if(this.options.type=="inline"){a(".sc-overlay.inline").find("form").trigger("popupdialogclose");content=a(".content").size()?a(".content"):a("body");this.overlay().hide().css({left:this.element.offset().left+(content.offset().left+content.width()-this.element.offset().left>this.overlay().width()?-16:16+this.element.width()-this.overlay().width()),top:this.element.offset().top+this.element.outerHeight()+"px",opacity:1}).fadeIn(200,function(){d.element.addClass("pressed");c()})}else b._effectStart.apply(this,arguments)},_effectEnd:function(a){if(this.options.type=="inline"){this.overlay().empty();this.element.removeClass("pressed");a.call()}else b._effectEnd.apply(this,arguments)},_render:function(){var a=this;b._render.apply(this,arguments)},_bind:function(){if(this.options.type=="inline")this.overlay().on("click",function(a){a.stopPropagation()});b._bind.apply(this,arguments)},_loaded:function(){var c=this;if(this.options.type=="inline")a("body").on("closepopup",function(){c.close()}).on("click",function(){a("body").trigger("closepopup");a("body").off("closepopup")});b._loaded.apply(this,arguments)}}))})(jQuery);(function(a){var b=a.sc.popupdialog.prototype;a.widget("sc.popupdialog",a.extend({},b,{cover:function(){return this.options.type=="modalless"||this.options.type=="modelessdialog"?a():b.cover.apply(this,arguments)},_bind:function(){if(this.options.type=="modalless"||this.options.type=="modelessdialog")this.overlay().on("click",function(a){a.stopPropagation()});b._bind.apply(this,arguments)},_loaded:function(){var c=this;if(this.options.type=="modalless"||this.options.type=="modelessdialog")a("body").on("closepopup",function(){c.close()}).on("click",function(){a("body").trigger("closepopup");a("body").unbind("closepopup")});b._loaded.apply(this,arguments)}}))})(jQuery);(function(a){var b=a.sc.popupdialog.prototype;a.widget("sc.popupdialog",a.extend({},b,{_initialize:function(){var c=this;this.sizes={small:{width:360,minHeight:120,maxHeight:250},standard:{width:490,minHeight:200,maxHeight:350},large:{width:560,minHeight:400,maxHeight:500},extralarge:{width:680,minHeight:500,maxHeight:650},full:{width:"98%",minHeight:"98%",maxHeight:"98%"}};this.options.type=="modal"||this.options.type=="modalless"||this.options.type=="modelessdialog"||this.options.type=="inline"?this.overlay().off("filteropen.popup filterbeforeclose.popup addexpression.popup removeexpression.popup addexpression.popup renderchoice.popup").on("filteropen.popup filterbeforeclose.popup addexpression.popup removeexpression.popup addexpression.popup renderchoice.popup",function(){c._size()}):a.noop();b._initialize.apply(this,arguments)},_size:function(){var d=this,c=this.overlay().find(".ui-dialog").size()?this.overlay().find(".ui-dialog"):this.overlay().find("form");c.find(".ui-dialog-main-content").css({overlfow:"visible","max-height":"none","min-height":"auto",height:"auto"});this.overlay().is(":visible")?a.noop():this.overlay().css({left:"-1000px",display:"block"});var b="small";d.options.size?(b=d.options.size):a.each(this.sizes,function(a,d){if(a!="full"){b=a;return c.css({width:d.width}).height()<d.maxHeight?false:true}});d.options.size=b;var e=0;b=="full"?d.overlay().css({width:this.sizes[b].width,height:this.sizes[b].minHeight}):a.noop();c.css({width:this.sizes[b].width,overflow:"auto"}).find(".ui-dialog-content > div").filter(function(){return!a(this).hasClass("ui-dialog-main-content")}).each(function(){e+=a(this).is(":visible")?a(this).outerHeight():0});c.height()>this.sizes[b].maxHeight?c.find(".ui-dialog-main-content").css({"max-height":this.sizes[b].maxHeight-e+"px"}):c.css({"min-height":this.sizes[b].minHeight+"px","max-height":this.sizes[b].maxHeight+"px"}).closest(".sc-overlay").css(b=="small"?{"min-width":"300px"}:{});if(b=="full"&&(c.find(".sc-scrollbox").size()>0||c.find("iframe").size()>0)){this._usefulHeight(c);a(window).off("resize").on("resize",function(){d._usefulHeight(c)})}},_usefulHeight:function(b){var d=a(window).height()*.96-this.scOverlay.find(".ui-dialog-title").outerHeight()-(this.scOverlay.find(".ui-dialog-buttonset").outerHeight()||0)-10,c=b.find(".sc-scrollbox").size()>0?"auto":"hidden";b.find(".ui-dialog-main-content").css({overflow:c,height:d})},_loaded:function(){var a=this;b._loaded.apply(this,arguments);a.options.size&&a.options.size=="full"&&a.options.type!="smartpanel"&&this.overlay().css("position","fixed")},_render:function(){var c=this;b._render.apply(this,arguments);this.options.type=="modal"||this.options.type=="modalless"||this.options.type=="modelessdialog"||this.options.type=="inline"?this.overlay().off("contentchanged.sc").on("contentchanged.sc",function(){c._size()}):a.noop()}}))})(jQuery);(function(a){a.extend(a,{confirm:function(){this.options={url:"/sitecore/apps/dialogs/popupconfirmation.aspx",title:false,details:false,yes:"Yes",no:"No",icon:false,context:false};var b=this,c=a.Deferred();a.each(arguments,function(d,c){d==0&&typeof c=="string"?(b.options.title=c):a.noop();d==1&&typeof c=="string"?(b.options.details=c):a.noop();typeof c=="object"?(b.options=a.extend({},b.options,c)):a.noop()});this.options.beforeLoaded=function(d,e){d.find(".ui-dialog").addClass("messagebox").css("width",d.find(".ui-dialog").css("width"));var f=a("<p>").append(d.find("form")).html();a.tmpl(f,b.options).appendTo(d);d.trigger("contentchanged");d.find('input[type="submit"], input[type="button"]').click(function(){a(".prompt-content").size()?a(this).attr("id")=="yes"?c.resolve(a(".prompt-content input")):c.resolve(false):c.resolve(a(this).attr("id"));e.close();return false});d.find(".close:first").click(function(){e.close();return false})};var d=this.options.context?this.options.context:a("<div/>");d.popupdialog({url:this.options.url,beforeLoaded:this.options.beforeLoaded,type:this.options.type?this.options.type:"modal"}).on("popupdialogclose",function(a){a.stopImmediatePropagation();return false}).popupdialog("open");return c.promise()}})})(jQuery);if(typeof Sys!=="undefined"){Sys.Browser.WebKit={};if(navigator.userAgent.indexOf("WebKit/")>-1){Sys.Browser.agent=Sys.Browser.WebKit;Sys.Browser.version=parseFloat(navigator.userAgent.match(/WebKit\/(\d+(\.\d+)?)/)[1]);Sys.Browser.name="WebKit"}Sys.Application.notifyScriptLoaded()}