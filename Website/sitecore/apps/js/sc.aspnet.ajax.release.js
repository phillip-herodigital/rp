function __netajax(){var d="",c=function(b){var c=typeof b==="string"?$('[name="'+b+'"]').add("[href*='"+b+"']").add("[data-name='"+b+"']").first():$(b||a);return c.data("eventAjax")===true||c.closest(".popup-instance").size()?c:c.closest("form")},a=null,b=function(a,e){var b=c(a);window.theForm=b.closest("form")[0];var f=b.is("form")?d(typeof a==="string"?a:a.attr("name")||a.data("name"),e):$.netajax(b,e,false,a)||false;return!b.is("[href*='"+a+"']")?f:undefined};if(window.__doPostBack==null||window.__doPostBack.toString()!=b.toString()){d=window.__doPostBack||$.noop();window.__doPostBack=b}$("form").off(".sc").on("click.sc",function(b){a=$(b.target)}).on("submit.sc",function(){return c(a).is("form")?true:!$.netajax(a)})}$.valHooks.textarea={"get":function(a){return a.value.replace(/\r?\n/g,"\r\n")}};(function(a){a.extend(a,{netajax:function(b,h,f,d){var e=a(window).scrollTop();d=b.attr("name")||b.data("name")||(((b.attr("href")||"''").match(/'.*?'/)!=undefined?b.attr("href").match(/'.*?'/)[0]||"''":"")||"").replace(/'/g,"")||d;var c=b.closest("form"),g=a(c.serializeArray()).filter(function(){return a.inArray(this.name,["__EVENTTARGET","__EVENTARGUMENT"])==-1});g.push({name:"__EVENTTARGET",value:d},{name:"__EVENTARGUMENT",value:h||""});return!d?a.noop():a.ajax(c.attr("action")||window.location.href,{data:a.param(g),dataType:"json",async:f==null||f,type:"POST",beforeSend:function(a){a.setRequestHeader("X-Ajax","sc")}}).success(function(b){c.trigger("responsesuccess");a.each(b.controls||[],function(d){a("#"+d,c).replaceWith(b.controls[d])});a.each(b.scripts||[],function(c){a.globalEval(b.scripts[c])})}).error(function(a,d,b){c.trigger("responseerror",b.message||a.responseText||"")}).always(function(){(b=b.filter(function(){return!this.disabled&&this.type!="hidden"})).attr("disabled","disabled")}).done(function(){b.removeAttr("disabled");a(window).scrollTop(e)}).fail(function(){b.removeAttr("disabled");a(window).scrollTop(e)})}})})(jQuery);if(typeof Sys!=="undefined"){Sys.Browser.WebKit={};if(navigator.userAgent.indexOf("WebKit/")>-1){Sys.Browser.agent=Sys.Browser.WebKit;Sys.Browser.version=parseFloat(navigator.userAgent.match(/WebKit\/(\d+(\.\d+)?)/)[1]);Sys.Browser.name="WebKit"}Sys.Application.notifyScriptLoaded()}
