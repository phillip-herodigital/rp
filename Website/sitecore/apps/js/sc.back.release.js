(function(a){a.extend(true,a,{sc:{back:function(){var b=new a.Storage({storageKey:"previousPage"});try{window.document.location.href=localStorage.getItem("previousUrl")}catch(c){}return false},setBackTitle:function(c,e){var b=a(c).size()?a(c):a("#"+c),d=new a.Storage({storageKey:"previousPage"});document.referrer.indexOf(d.get("appDomain"))>=0?b.is("input")?b.attr("value",b.attr("value")+" "+(e?e:d.get("previousTitle"))):a.noop():b.is("input")?b.attr("value",b.attr("value")+" "+document.referrer):a.noop();a(window).off("beforeunload.prevpage")}}})})(jQuery);if(typeof Sys!=="undefined"){Sys.Browser.WebKit={};if(navigator.userAgent.indexOf("WebKit/")>-1){Sys.Browser.agent=Sys.Browser.WebKit;Sys.Browser.version=parseFloat(navigator.userAgent.match(/WebKit\/(\d+(\.\d+)?)/)[1]);Sys.Browser.name="WebKit"}Sys.Application.notifyScriptLoaded()}