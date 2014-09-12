(function () {
  var method;
  var noop = function () { };
  var methods = [
  'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
  'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
  'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
  'timeStamp', 'trace', 'warn'
  ];
  var length = methods.length;
  var console = (window.console = window.console || {});

  while (length--) {
    method = methods[length];

    // Only stub undefined methods.
    if (!console[method]) {
      console[method] = noop;
    }
  }
}());
/*! jQuery v1.6.4 http://jquery.com/ | http://jquery.org/license */
(function(a,b){function cu(a){return f.isWindow(a)?a:a.nodeType===9?a.defaultView||a.parentWindow:!1}function cr(a){if(!cg[a]){var b=c.body,d=f("<"+a+">").appendTo(b),e=d.css("display");d.remove();if(e==="none"||e===""){ch||(ch=c.createElement("iframe"),ch.frameBorder=ch.width=ch.height=0),b.appendChild(ch);if(!ci||!ch.createElement)ci=(ch.contentWindow||ch.contentDocument).document,ci.write((c.compatMode==="CSS1Compat"?"<!doctype html>":"")+"<html><body>"),ci.close();d=ci.createElement(a),ci.body.appendChild(d),e=f.css(d,"display"),b.removeChild(ch)}cg[a]=e}return cg[a]}function cq(a,b){var c={};f.each(cm.concat.apply([],cm.slice(0,b)),function(){c[this]=a});return c}function cp(){cn=b}function co(){setTimeout(cp,0);return cn=f.now()}function cf(){try{return new a.ActiveXObject("Microsoft.XMLHTTP")}catch(b){}}function ce(){try{return new a.XMLHttpRequest}catch(b){}}function b$(a,c){a.dataFilter&&(c=a.dataFilter(c,a.dataType));var d=a.dataTypes,e={},g,h,i=d.length,j,k=d[0],l,m,n,o,p;for(g=1;g<i;g++){if(g===1)for(h in a.converters)typeof h=="string"&&(e[h.toLowerCase()]=a.converters[h]);l=k,k=d[g];if(k==="*")k=l;else if(l!=="*"&&l!==k){m=l+" "+k,n=e[m]||e["* "+k];if(!n){p=b;for(o in e){j=o.split(" ");if(j[0]===l||j[0]==="*"){p=e[j[1]+" "+k];if(p){o=e[o],o===!0?n=p:p===!0&&(n=o);break}}}}!n&&!p&&f.error("No conversion from "+m.replace(" "," to ")),n!==!0&&(c=n?n(c):p(o(c)))}}return c}function bZ(a,c,d){var e=a.contents,f=a.dataTypes,g=a.responseFields,h,i,j,k;for(i in g)i in d&&(c[g[i]]=d[i]);while(f[0]==="*")f.shift(),h===b&&(h=a.mimeType||c.getResponseHeader("content-type"));if(h)for(i in e)if(e[i]&&e[i].test(h)){f.unshift(i);break}if(f[0]in d)j=f[0];else{for(i in d){if(!f[0]||a.converters[i+" "+f[0]]){j=i;break}k||(k=i)}j=j||k}if(j){j!==f[0]&&f.unshift(j);return d[j]}}function bY(a,b,c,d){if(f.isArray(b))f.each(b,function(b,e){c||bA.test(a)?d(a,e):bY(a+"["+(typeof e=="object"||f.isArray(e)?b:"")+"]",e,c,d)});else if(!c&&b!=null&&typeof b=="object")for(var e in b)bY(a+"["+e+"]",b[e],c,d);else d(a,b)}function bX(a,c){var d,e,g=f.ajaxSettings.flatOptions||{};for(d in c)c[d]!==b&&((g[d]?a:e||(e={}))[d]=c[d]);e&&f.extend(!0,a,e)}function bW(a,c,d,e,f,g){f=f||c.dataTypes[0],g=g||{},g[f]=!0;var h=a[f],i=0,j=h?h.length:0,k=a===bP,l;for(;i<j&&(k||!l);i++)l=h[i](c,d,e),typeof l=="string"&&(!k||g[l]?l=b:(c.dataTypes.unshift(l),l=bW(a,c,d,e,l,g)));(k||!l)&&!g["*"]&&(l=bW(a,c,d,e,"*",g));return l}function bV(a){return function(b,c){typeof b!="string"&&(c=b,b="*");if(f.isFunction(c)){var d=b.toLowerCase().split(bL),e=0,g=d.length,h,i,j;for(;e<g;e++)h=d[e],j=/^\+/.test(h),j&&(h=h.substr(1)||"*"),i=a[h]=a[h]||[],i[j?"unshift":"push"](c)}}}function by(a,b,c){var d=b==="width"?a.offsetWidth:a.offsetHeight,e=b==="width"?bt:bu;if(d>0){c!=="border"&&f.each(e,function(){c||(d-=parseFloat(f.css(a,"padding"+this))||0),c==="margin"?d+=parseFloat(f.css(a,c+this))||0:d-=parseFloat(f.css(a,"border"+this+"Width"))||0});return d+"px"}d=bv(a,b,b);if(d<0||d==null)d=a.style[b]||0;d=parseFloat(d)||0,c&&f.each(e,function(){d+=parseFloat(f.css(a,"padding"+this))||0,c!=="padding"&&(d+=parseFloat(f.css(a,"border"+this+"Width"))||0),c==="margin"&&(d+=parseFloat(f.css(a,c+this))||0)});return d+"px"}function bl(a,b){b.src?f.ajax({url:b.src,async:!1,dataType:"script"}):f.globalEval((b.text||b.textContent||b.innerHTML||"").replace(bd,"/*$0*/")),b.parentNode&&b.parentNode.removeChild(b)}function bk(a){f.nodeName(a,"input")?bj(a):"getElementsByTagName"in a&&f.grep(a.getElementsByTagName("input"),bj)}function bj(a){if(a.type==="checkbox"||a.type==="radio")a.defaultChecked=a.checked}function bi(a){return"getElementsByTagName"in a?a.getElementsByTagName("*"):"querySelectorAll"in a?a.querySelectorAll("*"):[]}function bh(a,b){var c;if(b.nodeType===1){b.clearAttributes&&b.clearAttributes(),b.mergeAttributes&&b.mergeAttributes(a),c=b.nodeName.toLowerCase();if(c==="object")b.outerHTML=a.outerHTML;else if(c!=="input"||a.type!=="checkbox"&&a.type!=="radio"){if(c==="option")b.selected=a.defaultSelected;else if(c==="input"||c==="textarea")b.defaultValue=a.defaultValue}else a.checked&&(b.defaultChecked=b.checked=a.checked),b.value!==a.value&&(b.value=a.value);b.removeAttribute(f.expando)}}function bg(a,b){if(b.nodeType===1&&!!f.hasData(a)){var c=f.expando,d=f.data(a),e=f.data(b,d);if(d=d[c]){var g=d.events;e=e[c]=f.extend({},d);if(g){delete e.handle,e.events={};for(var h in g)for(var i=0,j=g[h].length;i<j;i++)f.event.add(b,h+(g[h][i].namespace?".":"")+g[h][i].namespace,g[h][i],g[h][i].data)}}}}function bf(a,b){return f.nodeName(a,"table")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function V(a,b,c){b=b||0;if(f.isFunction(b))return f.grep(a,function(a,d){var e=!!b.call(a,d,a);return e===c});if(b.nodeType)return f.grep(a,function(a,d){return a===b===c});if(typeof b=="string"){var d=f.grep(a,function(a){return a.nodeType===1});if(Q.test(b))return f.filter(b,d,!c);b=f.filter(b,d)}return f.grep(a,function(a,d){return f.inArray(a,b)>=0===c})}function U(a){return!a||!a.parentNode||a.parentNode.nodeType===11}function M(a,b){return(a&&a!=="*"?a+".":"")+b.replace(y,"`").replace(z,"&")}function L(a){var b,c,d,e,g,h,i,j,k,l,m,n,o,p=[],q=[],r=f._data(this,"events");if(!(a.liveFired===this||!r||!r.live||a.target.disabled||a.button&&a.type==="click")){a.namespace&&(n=new RegExp("(^|\\.)"+a.namespace.split(".").join("\\.(?:.*\\.)?")+"(\\.|$)")),a.liveFired=this;var s=r.live.slice(0);for(i=0;i<s.length;i++)g=s[i],g.origType.replace(w,"")===a.type?q.push(g.selector):s.splice(i--,1);e=f(a.target).closest(q,a.currentTarget);for(j=0,k=e.length;j<k;j++){m=e[j];for(i=0;i<s.length;i++){g=s[i];if(m.selector===g.selector&&(!n||n.test(g.namespace))&&!m.elem.disabled){h=m.elem,d=null;if(g.preType==="mouseenter"||g.preType==="mouseleave")a.type=g.preType,d=f(a.relatedTarget).closest(g.selector)[0],d&&f.contains(h,d)&&(d=h);(!d||d!==h)&&p.push({elem:h,handleObj:g,level:m.level})}}}for(j=0,k=p.length;j<k;j++){e=p[j];if(c&&e.level>c)break;a.currentTarget=e.elem,a.data=e.handleObj.data,a.handleObj=e.handleObj,o=e.handleObj.origHandler.apply(e.elem,arguments);if(o===!1||a.isPropagationStopped()){c=e.level,o===!1&&(b=!1);if(a.isImmediatePropagationStopped())break}}return b}}function J(a,c,d){var e=f.extend({},d[0]);e.type=a,e.originalEvent={},e.liveFired=b,f.event.handle.call(c,e),e.isDefaultPrevented()&&d[0].preventDefault()}function D(){return!0}function C(){return!1}function m(a,c,d){var e=c+"defer",g=c+"queue",h=c+"mark",i=f.data(a,e,b,!0);i&&(d==="queue"||!f.data(a,g,b,!0))&&(d==="mark"||!f.data(a,h,b,!0))&&setTimeout(function(){!f.data(a,g,b,!0)&&!f.data(a,h,b,!0)&&(f.removeData(a,e,!0),i.resolve())},0)}function l(a){for(var b in a)if(b!=="toJSON")return!1;return!0}function k(a,c,d){if(d===b&&a.nodeType===1){var e="data-"+c.replace(j,"-$1").toLowerCase();d=a.getAttribute(e);if(typeof d=="string"){try{d=d==="true"?!0:d==="false"?!1:d==="null"?null:f.isNaN(d)?i.test(d)?f.parseJSON(d):d:parseFloat(d)}catch(g){}f.data(a,c,d)}else d=b}return d}var c=a.document,d=a.navigator,e=a.location,f=function(){function K(){if(!e.isReady){try{c.documentElement.doScroll("left")}catch(a){setTimeout(K,1);return}e.ready()}}var e=function(a,b){return new e.fn.init(a,b,h)},f=a.jQuery,g=a.$,h,i=/^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,j=/\S/,k=/^\s+/,l=/\s+$/,m=/\d/,n=/^<(\w+)\s*\/?>(?:<\/\1>)?$/,o=/^[\],:{}\s]*$/,p=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,q=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,r=/(?:^|:|,)(?:\s*\[)+/g,s=/(webkit)[ \/]([\w.]+)/,t=/(opera)(?:.*version)?[ \/]([\w.]+)/,u=/(msie) ([\w.]+)/,v=/(mozilla)(?:.*? rv:([\w.]+))?/,w=/-([a-z]|[0-9])/ig,x=/^-ms-/,y=function(a,b){return(b+"").toUpperCase()},z=d.userAgent,A,B,C,D=Object.prototype.toString,E=Object.prototype.hasOwnProperty,F=Array.prototype.push,G=Array.prototype.slice,H=String.prototype.trim,I=Array.prototype.indexOf,J={};e.fn=e.prototype={constructor:e,init:function(a,d,f){var g,h,j,k;if(!a)return this;if(a.nodeType){this.context=this[0]=a,this.length=1;return this}if(a==="body"&&!d&&c.body){this.context=c,this[0]=c.body,this.selector=a,this.length=1;return this}if(typeof a=="string"){a.charAt(0)!=="<"||a.charAt(a.length-1)!==">"||a.length<3?g=i.exec(a):g=[null,a,null];if(g&&(g[1]||!d)){if(g[1]){d=d instanceof e?d[0]:d,k=d?d.ownerDocument||d:c,j=n.exec(a),j?e.isPlainObject(d)?(a=[c.createElement(j[1])],e.fn.attr.call(a,d,!0)):a=[k.createElement(j[1])]:(j=e.buildFragment([g[1]],[k]),a=(j.cacheable?e.clone(j.fragment):j.fragment).childNodes);return e.merge(this,a)}h=c.getElementById(g[2]);if(h&&h.parentNode){if(h.id!==g[2])return f.find(a);this.length=1,this[0]=h}this.context=c,this.selector=a;return this}return!d||d.jquery?(d||f).find(a):this.constructor(d).find(a)}if(e.isFunction(a))return f.ready(a);a.selector!==b&&(this.selector=a.selector,this.context=a.context);return e.makeArray(a,this)},selector:"",jquery:"1.6.4",length:0,size:function(){return this.length},toArray:function(){return G.call(this,0)},get:function(a){return a==null?this.toArray():a<0?this[this.length+a]:this[a]},pushStack:function(a,b,c){var d=this.constructor();e.isArray(a)?F.apply(d,a):e.merge(d,a),d.prevObject=this,d.context=this.context,b==="find"?d.selector=this.selector+(this.selector?" ":"")+c:b&&(d.selector=this.selector+"."+b+"("+c+")");return d},each:function(a,b){return e.each(this,a,b)},ready:function(a){e.bindReady(),B.done(a);return this},eq:function(a){return a===-1?this.slice(a):this.slice(a,+a+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(G.apply(this,arguments),"slice",G.call(arguments).join(","))},map:function(a){return this.pushStack(e.map(this,function(b,c){return a.call(b,c,b)}))},end:function(){return this.prevObject||this.constructor(null)},push:F,sort:[].sort,splice:[].splice},e.fn.init.prototype=e.fn,e.extend=e.fn.extend=function(){var a,c,d,f,g,h,i=arguments[0]||{},j=1,k=arguments.length,l=!1;typeof i=="boolean"&&(l=i,i=arguments[1]||{},j=2),typeof i!="object"&&!e.isFunction(i)&&(i={}),k===j&&(i=this,--j);for(;j<k;j++)if((a=arguments[j])!=null)for(c in a){d=i[c],f=a[c];if(i===f)continue;l&&f&&(e.isPlainObject(f)||(g=e.isArray(f)))?(g?(g=!1,h=d&&e.isArray(d)?d:[]):h=d&&e.isPlainObject(d)?d:{},i[c]=e.extend(l,h,f)):f!==b&&(i[c]=f)}return i},e.extend({noConflict:function(b){a.$===e&&(a.$=g),b&&a.jQuery===e&&(a.jQuery=f);return e},isReady:!1,readyWait:1,holdReady:function(a){a?e.readyWait++:e.ready(!0)},ready:function(a){if(a===!0&&!--e.readyWait||a!==!0&&!e.isReady){if(!c.body)return setTimeout(e.ready,1);e.isReady=!0;if(a!==!0&&--e.readyWait>0)return;B.resolveWith(c,[e]),e.fn.trigger&&e(c).trigger("ready").unbind("ready")}},bindReady:function(){if(!B){B=e._Deferred();if(c.readyState==="complete")return setTimeout(e.ready,1);if(c.addEventListener)c.addEventListener("DOMContentLoaded",C,!1),a.addEventListener("load",e.ready,!1);else if(c.attachEvent){c.attachEvent("onreadystatechange",C),a.attachEvent("onload",e.ready);var b=!1;try{b=a.frameElement==null}catch(d){}c.documentElement.doScroll&&b&&K()}}},isFunction:function(a){return e.type(a)==="function"},isArray:Array.isArray||function(a){return e.type(a)==="array"},isWindow:function(a){return a&&typeof a=="object"&&"setInterval"in a},isNaN:function(a){return a==null||!m.test(a)||isNaN(a)},type:function(a){return a==null?String(a):J[D.call(a)]||"object"},isPlainObject:function(a){if(!a||e.type(a)!=="object"||a.nodeType||e.isWindow(a))return!1;try{if(a.constructor&&!E.call(a,"constructor")&&!E.call(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}var d;for(d in a);return d===b||E.call(a,d)},isEmptyObject:function(a){for(var b in a)return!1;return!0},error:function(a){throw a},parseJSON:function(b){if(typeof b!="string"||!b)return null;b=e.trim(b);if(a.JSON&&a.JSON.parse)return a.JSON.parse(b);if(o.test(b.replace(p,"@").replace(q,"]").replace(r,"")))return(new Function("return "+b))();e.error("Invalid JSON: "+b)},parseXML:function(c){var d,f;try{a.DOMParser?(f=new DOMParser,d=f.parseFromString(c,"text/xml")):(d=new ActiveXObject("Microsoft.XMLDOM"),d.async="false",d.loadXML(c))}catch(g){d=b}(!d||!d.documentElement||d.getElementsByTagName("parsererror").length)&&e.error("Invalid XML: "+c);return d},noop:function(){},globalEval:function(b){b&&j.test(b)&&(a.execScript||function(b){a.eval.call(a,b)})(b)},camelCase:function(a){return a.replace(x,"ms-").replace(w,y)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toUpperCase()===b.toUpperCase()},each:function(a,c,d){var f,g=0,h=a.length,i=h===b||e.isFunction(a);if(d){if(i){for(f in a)if(c.apply(a[f],d)===!1)break}else for(;g<h;)if(c.apply(a[g++],d)===!1)break}else if(i){for(f in a)if(c.call(a[f],f,a[f])===!1)break}else for(;g<h;)if(c.call(a[g],g,a[g++])===!1)break;return a},trim:H?function(a){return a==null?"":H.call(a)}:function(a){return a==null?"":(a+"").replace(k,"").replace(l,"")},makeArray:function(a,b){var c=b||[];if(a!=null){var d=e.type(a);a.length==null||d==="string"||d==="function"||d==="regexp"||e.isWindow(a)?F.call(c,a):e.merge(c,a)}return c},inArray:function(a,b){if(!b)return-1;if(I)return I.call(b,a);for(var c=0,d=b.length;c<d;c++)if(b[c]===a)return c;return-1},merge:function(a,c){var d=a.length,e=0;if(typeof c.length=="number")for(var f=c.length;e<f;e++)a[d++]=c[e];else while(c[e]!==b)a[d++]=c[e++];a.length=d;return a},grep:function(a,b,c){var d=[],e;c=!!c;for(var f=0,g=a.length;f<g;f++)e=!!b(a[f],f),c!==e&&d.push(a[f]);return d},map:function(a,c,d){var f,g,h=[],i=0,j=a.length,k=a instanceof e||j!==b&&typeof j=="number"&&(j>0&&a[0]&&a[j-1]||j===0||e.isArray(a));if(k)for(;i<j;i++)f=c(a[i],i,d),f!=null&&(h[h.length]=f);else for(g in a)f=c(a[g],g,d),f!=null&&(h[h.length]=f);return h.concat.apply([],h)},guid:1,proxy:function(a,c){if(typeof c=="string"){var d=a[c];c=a,a=d}if(!e.isFunction(a))return b;var f=G.call(arguments,2),g=function(){return a.apply(c,f.concat(G.call(arguments)))};g.guid=a.guid=a.guid||g.guid||e.guid++;return g},access:function(a,c,d,f,g,h){var i=a.length;if(typeof c=="object"){for(var j in c)e.access(a,j,c[j],f,g,d);return a}if(d!==b){f=!h&&f&&e.isFunction(d);for(var k=0;k<i;k++)g(a[k],c,f?d.call(a[k],k,g(a[k],c)):d,h);return a}return i?g(a[0],c):b},now:function(){return(new Date).getTime()},uaMatch:function(a){a=a.toLowerCase();var b=s.exec(a)||t.exec(a)||u.exec(a)||a.indexOf("compatible")<0&&v.exec(a)||[];return{browser:b[1]||"",version:b[2]||"0"}},sub:function(){function a(b,c){return new a.fn.init(b,c)}e.extend(!0,a,this),a.superclass=this,a.fn=a.prototype=this(),a.fn.constructor=a,a.sub=this.sub,a.fn.init=function(d,f){f&&f instanceof e&&!(f instanceof a)&&(f=a(f));return e.fn.init.call(this,d,f,b)},a.fn.init.prototype=a.fn;var b=a(c);return a},browser:{}}),e.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(a,b){J["[object "+b+"]"]=b.toLowerCase()}),A=e.uaMatch(z),A.browser&&(e.browser[A.browser]=!0,e.browser.version=A.version),e.browser.webkit&&(e.browser.safari=!0),j.test(" ")&&(k=/^[\s\xA0]+/,l=/[\s\xA0]+$/),h=e(c),c.addEventListener?C=function(){c.removeEventListener("DOMContentLoaded",C,!1),e.ready()}:c.attachEvent&&(C=function(){c.readyState==="complete"&&(c.detachEvent("onreadystatechange",C),e.ready())});return e}(),g="done fail isResolved isRejected promise then always pipe".split(" "),h=[].slice;f.extend({_Deferred:function(){var a=[],b,c,d,e={done:function(){if(!d){var c=arguments,g,h,i,j,k;b&&(k=b,b=0);for(g=0,h=c.length;g<h;g++)i=c[g],j=f.type(i),j==="array"?e.done.apply(e,i):j==="function"&&a.push(i);k&&e.resolveWith(k[0],k[1])}return this},resolveWith:function(e,f){if(!d&&!b&&!c){f=f||[],c=1;try{while(a[0])a.shift().apply(e,f)}finally{b=[e,f],c=0}}return this},resolve:function(){e.resolveWith(this,arguments);return this},isResolved:function(){return!!c||!!b},cancel:function(){d=1,a=[];return this}};return e},Deferred:function(a){var b=f._Deferred(),c=f._Deferred(),d;f.extend(b,{then:function(a,c){b.done(a).fail(c);return this},always:function(){return b.done.apply(b,arguments).fail.apply(this,arguments)},fail:c.done,rejectWith:c.resolveWith,reject:c.resolve,isRejected:c.isResolved,pipe:function(a,c){return f.Deferred(function(d){f.each({done:[a,"resolve"],fail:[c,"reject"]},function(a,c){var e=c[0],g=c[1],h;f.isFunction(e)?b[a](function(){h=e.apply(this,arguments),h&&f.isFunction(h.promise)?h.promise().then(d.resolve,d.reject):d[g+"With"](this===b?d:this,[h])}):b[a](d[g])})}).promise()},promise:function(a){if(a==null){if(d)return d;d=a={}}var c=g.length;while(c--)a[g[c]]=b[g[c]];return a}}),b.done(c.cancel).fail(b.cancel),delete b.cancel,a&&a.call(b,b);return b},when:function(a){function i(a){return function(c){b[a]=arguments.length>1?h.call(arguments,0):c,--e||g.resolveWith(g,h.call(b,0))}}var b=arguments,c=0,d=b.length,e=d,g=d<=1&&a&&f.isFunction(a.promise)?a:f.Deferred();if(d>1){for(;c<d;c++)b[c]&&f.isFunction(b[c].promise)?b[c].promise().then(i(c),g.reject):--e;e||g.resolveWith(g,b)}else g!==a&&g.resolveWith(g,d?[a]:[]);return g.promise()}}),f.support=function(){var a=c.createElement("div"),b=c.documentElement,d,e,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u;a.setAttribute("className","t"),a.innerHTML="   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>",d=a.getElementsByTagName("*"),e=a.getElementsByTagName("a")[0];if(!d||!d.length||!e)return{};g=c.createElement("select"),h=g.appendChild(c.createElement("option")),i=a.getElementsByTagName("input")[0],k={leadingWhitespace:a.firstChild.nodeType===3,tbody:!a.getElementsByTagName("tbody").length,htmlSerialize:!!a.getElementsByTagName("link").length,style:/top/.test(e.getAttribute("style")),hrefNormalized:e.getAttribute("href")==="/a",opacity:/^0.55$/.test(e.style.opacity),cssFloat:!!e.style.cssFloat,checkOn:i.value==="on",optSelected:h.selected,getSetAttribute:a.className!=="t",submitBubbles:!0,changeBubbles:!0,focusinBubbles:!1,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0},i.checked=!0,k.noCloneChecked=i.cloneNode(!0).checked,g.disabled=!0,k.optDisabled=!h.disabled;try{delete a.test}catch(v){k.deleteExpando=!1}!a.addEventListener&&a.attachEvent&&a.fireEvent&&(a.attachEvent("onclick",function(){k.noCloneEvent=!1}),a.cloneNode(!0).fireEvent("onclick")),i=c.createElement("input"),i.value="t",i.setAttribute("type","radio"),k.radioValue=i.value==="t",i.setAttribute("checked","checked"),a.appendChild(i),l=c.createDocumentFragment(),l.appendChild(a.firstChild),k.checkClone=l.cloneNode(!0).cloneNode(!0).lastChild.checked,a.innerHTML="",a.style.width=a.style.paddingLeft="1px",m=c.getElementsByTagName("body")[0],o=c.createElement(m?"div":"body"),p={visibility:"hidden",width:0,height:0,border:0,margin:0,background:"none"},m&&f.extend(p,{position:"absolute",left:"-1000px",top:"-1000px"});for(t in p)o.style[t]=p[t];o.appendChild(a),n=m||b,n.insertBefore(o,n.firstChild),k.appendChecked=i.checked,k.boxModel=a.offsetWidth===2,"zoom"in a.style&&(a.style.display="inline",a.style.zoom=1,k.inlineBlockNeedsLayout=a.offsetWidth===2,a.style.display="",a.innerHTML="<div style='width:4px;'></div>",k.shrinkWrapBlocks=a.offsetWidth!==2),a.innerHTML="<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>",q=a.getElementsByTagName("td"),u=q[0].offsetHeight===0,q[0].style.display="",q[1].style.display="none",k.reliableHiddenOffsets=u&&q[0].offsetHeight===0,a.innerHTML="",c.defaultView&&c.defaultView.getComputedStyle&&(j=c.createElement("div"),j.style.width="0",j.style.marginRight="0",a.appendChild(j),k.reliableMarginRight=(parseInt((c.defaultView.getComputedStyle(j,null)||{marginRight:0}).marginRight,10)||0)===0),o.innerHTML="",n.removeChild(o);if(a.attachEvent)for(t in{submit:1,change:1,focusin:1})s="on"+t,u=s in a,u||(a.setAttribute(s,"return;"),u=typeof a[s]=="function"),k[t+"Bubbles"]=u;o=l=g=h=m=j=a=i=null;return k}(),f.boxModel=f.support.boxModel;var i=/^(?:\{.*\}|\[.*\])$/,j=/([A-Z])/g;f.extend({cache:{},uuid:0,expando:"jQuery"+(f.fn.jquery+Math.random()).replace(/\D/g,""),noData:{embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:!0},hasData:function(a){a=a.nodeType?f.cache[a[f.expando]]:a[f.expando];return!!a&&!l(a)},data:function(a,c,d,e){if(!!f.acceptData(a)){var g,h,i=f.expando,j=typeof c=="string",k=a.nodeType,l=k?f.cache:a,m=k?a[f.expando]:a[f.expando]&&f.expando;if((!m||e&&m&&l[m]&&!l[m][i])&&j&&d===b)return;m||(k?a[f.expando]=m=++f.uuid:m=f.expando),l[m]||(l[m]={},k||(l[m].toJSON=f.noop));if(typeof c=="object"||typeof c=="function")e?l[m][i]=f.extend(l[m][i],c):l[m]=f.extend(l[m],c);g=l[m],e&&(g[i]||(g[i]={}),g=g[i]),d!==b&&(g[f.camelCase(c)]=d);if(c==="events"&&!g[c])return g[i]&&g[i].events;j?(h=g[c],h==null&&(h=g[f.camelCase(c)])):h=g;return h}},removeData:function(a,b,c){if(!!f.acceptData(a)){var d,e=f.expando,g=a.nodeType,h=g?f.cache:a,i=g?a[f.expando]:f.expando;if(!h[i])return;if(b){d=c?h[i][e]:h[i];if(d){d[b]||(b=f.camelCase(b)),delete d[b];if(!l(d))return}}if(c){delete h[i][e];if(!l(h[i]))return}var j=h[i][e];f.support.deleteExpando||!h.setInterval?delete h[i]:h[i]=null,j?(h[i]={},g||(h[i].toJSON=f.noop),h[i][e]=j):g&&(f.support.deleteExpando?delete a[f.expando]:a.removeAttribute?a.removeAttribute(f.expando):a[f.expando]=null)}},_data:function(a,b,c){return f.data(a,b,c,!0)},acceptData:function(a){if(a.nodeName){var b=f.noData[a.nodeName.toLowerCase()];if(b)return b!==!0&&a.getAttribute("classid")===b}return!0}}),f.fn.extend({data:function(a,c){var d=null;if(typeof a=="undefined"){if(this.length){d=f.data(this[0]);if(this[0].nodeType===1){var e=this[0].attributes,g;for(var h=0,i=e.length;h<i;h++)g=e[h].name,g.indexOf("data-")===0&&(g=f.camelCase(g.substring(5)),k(this[0],g,d[g]))}}return d}if(typeof a=="object")return this.each(function(){f.data(this,a)});var j=a.split(".");j[1]=j[1]?"."+j[1]:"";if(c===b){d=this.triggerHandler("getData"+j[1]+"!",[j[0]]),d===b&&this.length&&(d=f.data(this[0],a),d=k(this[0],a,d));return d===b&&j[1]?this.data(j[0]):d}return this.each(function(){var b=f(this),d=[j[0],c];b.triggerHandler("setData"+j[1]+"!",d),f.data(this,a,c),b.triggerHandler("changeData"+j[1]+"!",d)})},removeData:function(a){return this.each(function(){f.removeData(this,a)})}}),f.extend({_mark:function(a,c){a&&(c=(c||"fx")+"mark",f.data(a,c,(f.data(a,c,b,!0)||0)+1,!0))},_unmark:function(a,c,d){a!==!0&&(d=c,c=a,a=!1);if(c){d=d||"fx";var e=d+"mark",g=a?0:(f.data(c,e,b,!0)||1)-1;g?f.data(c,e,g,!0):(f.removeData(c,e,!0),m(c,d,"mark"))}},queue:function(a,c,d){if(a){c=(c||"fx")+"queue";var e=f.data(a,c,b,!0);d&&(!e||f.isArray(d)?e=f.data(a,c,f.makeArray(d),!0):e.push(d));return e||[]}},dequeue:function(a,b){b=b||"fx";var c=f.queue(a,b),d=c.shift(),e;d==="inprogress"&&(d=c.shift()),d&&(b==="fx"&&c.unshift("inprogress"),d.call(a,function(){f.dequeue(a,b)})),c.length||(f.removeData(a,b+"queue",!0),m(a,b,"queue"))}}),f.fn.extend({queue:function(a,c){typeof a!="string"&&(c=a,a="fx");if(c===b)return f.queue(this[0],a);return this.each(function(){var b=f.queue(this,a,c);a==="fx"&&b[0]!=="inprogress"&&f.dequeue(this,a)})},dequeue:function(a){return this.each(function(){f.dequeue(this,a)})},delay:function(a,b){a=f.fx?f.fx.speeds[a]||a:a,b=b||"fx";return this.queue(b,function(){var c=this;setTimeout(function(){f.dequeue(c,b)},a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,c){function m(){--h||d.resolveWith(e,[e])}typeof a!="string"&&(c=a,a=b),a=a||"fx";var d=f.Deferred(),e=this,g=e.length,h=1,i=a+"defer",j=a+"queue",k=a+"mark",l;while(g--)if(l=f.data(e[g],i,b,!0)||(f.data(e[g],j,b,!0)||f.data(e[g],k,b,!0))&&f.data(e[g],i,f._Deferred(),!0))h++,l.done(m);m();return d.promise()}});var n=/[\n\t\r]/g,o=/\s+/,p=/\r/g,q=/^(?:button|input)$/i,r=/^(?:button|input|object|select|textarea)$/i,s=/^a(?:rea)?$/i,t=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,u,v;f.fn.extend({attr:function(a,b){return f.access(this,a,b,!0,f.attr)},removeAttr:function(a){return this.each(function(){f.removeAttr(this,a)})},prop:function(a,b){return f.access(this,a,b,!0,f.prop)},removeProp:function(a){a=f.propFix[a]||a;return this.each(function(){try{this[a]=b,delete this[a]}catch(c){}})},addClass:function(a){var b,c,d,e,g,h,i;if(f.isFunction(a))return this.each(function(b){f(this).addClass(a.call(this,b,this.className))});if(a&&typeof a=="string"){b=a.split(o);for(c=0,d=this.length;c<d;c++){e=this[c];if(e.nodeType===1)if(!e.className&&b.length===1)e.className=a;else{g=" "+e.className+" ";for(h=0,i=b.length;h<i;h++)~g.indexOf(" "+b[h]+" ")||(g+=b[h]+" ");e.className=f.trim(g)}}}return this},removeClass:function(a){var c,d,e,g,h,i,j;if(f.isFunction(a))return this.each(function(b){f(this).removeClass(a.call(this,b,this.className))});if(a&&typeof a=="string"||a===b){c=(a||"").split(o);for(d=0,e=this.length;d<e;d++){g=this[d];if(g.nodeType===1&&g.className)if(a){h=(" "+g.className+" ").replace(n," ");for(i=0,j=c.length;i<j;i++)h=h.replace(" "+c[i]+" "," ");g.className=f.trim(h)}else g.className=""}}return this},toggleClass:function(a,b){var c=typeof a,d=typeof b=="boolean";if(f.isFunction(a))return this.each(function(c){f(this).toggleClass(a.call(this,c,this.className,b),b)});return this.each(function(){if(c==="string"){var e,g=0,h=f(this),i=b,j=a.split(o);while(e=j[g++])i=d?i:!h.hasClass(e),h[i?"addClass":"removeClass"](e)}else if(c==="undefined"||c==="boolean")this.className&&f._data(this,"__className__",this.className),this.className=this.className||a===!1?"":f._data(this,"__className__")||""})},hasClass:function(a){var b=" "+a+" ";for(var c=0,d=this.length;c<d;c++)if(this[c].nodeType===1&&(" "+this[c].className+" ").replace(n," ").indexOf(b)>-1)return!0;return!1},val:function(a){var c,d,e=this[0];if(!arguments.length){if(e){c=f.valHooks[e.nodeName.toLowerCase()]||f.valHooks[e.type];if(c&&"get"in c&&(d=c.get(e,"value"))!==b)return d;d=e.value;return typeof d=="string"?d.replace(p,""):d==null?"":d}return b}var g=f.isFunction(a);return this.each(function(d){var e=f(this),h;if(this.nodeType===1){g?h=a.call(this,d,e.val()):h=a,h==null?h="":typeof h=="number"?h+="":f.isArray(h)&&(h=f.map(h,function(a){return a==null?"":a+""})),c=f.valHooks[this.nodeName.toLowerCase()]||f.valHooks[this.type];if(!c||!("set"in c)||c.set(this,h,"value")===b)this.value=h}})}}),f.extend({valHooks:{option:{get:function(a){var b=a.attributes.value;return!b||b.specified?a.value:a.text}},select:{get:function(a){var b,c=a.selectedIndex,d=[],e=a.options,g=a.type==="select-one";if(c<0)return null;for(var h=g?c:0,i=g?c+1:e.length;h<i;h++){var j=e[h];if(j.selected&&(f.support.optDisabled?!j.disabled:j.getAttribute("disabled")===null)&&(!j.parentNode.disabled||!f.nodeName(j.parentNode,"optgroup"))){b=f(j).val();if(g)return b;d.push(b)}}if(g&&!d.length&&e.length)return f(e[c]).val();return d},set:function(a,b){var c=f.makeArray(b);f(a).find("option").each(function(){this.selected=f.inArray(f(this).val(),c)>=0}),c.length||(a.selectedIndex=-1);return c}}},attrFn:{val:!0,css:!0,html:!0,text:!0,data:!0,width:!0,height:!0,offset:!0},attrFix:{tabindex:"tabIndex"},attr:function(a,c,d,e){var g=a.nodeType;if(!a||g===3||g===8||g===2)return b;if(e&&c in f.attrFn)return f(a)[c](d);if(!("getAttribute"in a))return f.prop(a,c,d);var h,i,j=g!==1||!f.isXMLDoc(a);j&&(c=f.attrFix[c]||c,i=f.attrHooks[c],i||(t.test(c)?i=v:u&&(i=u)));if(d!==b){if(d===null){f.removeAttr(a,c);return b}if(i&&"set"in i&&j&&(h=i.set(a,d,c))!==b)return h;a.setAttribute(c,""+d);return d}if(i&&"get"in i&&j&&(h=i.get(a,c))!==null)return h;h=a.getAttribute(c);return h===null?b:h},removeAttr:function(a,b){var c;a.nodeType===1&&(b=f.attrFix[b]||b,f.attr(a,b,""),a.removeAttribute(b),t.test(b)&&(c=f.propFix[b]||b)in a&&(a[c]=!1))},attrHooks:{type:{set:function(a,b){if(q.test(a.nodeName)&&a.parentNode)f.error("type property can't be changed");else if(!f.support.radioValue&&b==="radio"&&f.nodeName(a,"input")){var c=a.value;a.setAttribute("type",b),c&&(a.value=c);return b}}},value:{get:function(a,b){if(u&&f.nodeName(a,"button"))return u.get(a,b);return b in a?a.value:null},set:function(a,b,c){if(u&&f.nodeName(a,"button"))return u.set(a,b,c);a.value=b}}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},prop:function(a,c,d){var e=a.nodeType;if(!a||e===3||e===8||e===2)return b;var g,h,i=e!==1||!f.isXMLDoc(a);i&&(c=f.propFix[c]||c,h=f.propHooks[c]);return d!==b?h&&"set"in h&&(g=h.set(a,d,c))!==b?g:a[c]=d:h&&"get"in h&&(g=h.get(a,c))!==null?g:a[c]},propHooks:{tabIndex:{get:function(a){var c=a.getAttributeNode("tabindex");return c&&c.specified?parseInt(c.value,10):r.test(a.nodeName)||s.test(a.nodeName)&&a.href?0:b}}}}),f.attrHooks.tabIndex=f.propHooks.tabIndex,v={get:function(a,c){var d;return f.prop(a,c)===!0||(d=a.getAttributeNode(c))&&d.nodeValue!==!1?c.toLowerCase():b},set:function(a,b,c){var d;b===!1?f.removeAttr(a,c):(d=f.propFix[c]||c,d in a&&(a[d]=!0),a.setAttribute(c,c.toLowerCase()));return c}},f.support.getSetAttribute||(u=f.valHooks.button={get:function(a,c){var d;d=a.getAttributeNode(c);return d&&d.nodeValue!==""?d.nodeValue:b},set:function(a,b,d){var e=a.getAttributeNode(d);e||(e=c.createAttribute(d),a.setAttributeNode(e));return e.nodeValue=b+""}},f.each(["width","height"],function(a,b){f.attrHooks[b]=f.extend(f.attrHooks[b],{set:function(a,c){if(c===""){a.setAttribute(b,"auto");return c}}})})),f.support.hrefNormalized||f.each(["href","src","width","height"],function(a,c){f.attrHooks[c]=f.extend(f.attrHooks[c],{get:function(a){var d=a.getAttribute(c,2);return d===null?b:d}})}),f.support.style||(f.attrHooks.style={get:function(a){return a.style.cssText.toLowerCase()||b},set:function(a,b){return a.style.cssText=""+b}}),f.support.optSelected||(f.propHooks.selected=f.extend(f.propHooks.selected,{get:function(a){var b=a.parentNode;b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex);return null}})),f.support.checkOn||f.each(["radio","checkbox"],function(){f.valHooks[this]={get:function(a){return a.getAttribute("value")===null?"on":a.value}}}),f.each(["radio","checkbox"],function(){f.valHooks[this]=f.extend(f.valHooks[this],{set:function(a,b){if(f.isArray(b))return a.checked=f.inArray(f(a).val(),b)>=0}})});var w=/\.(.*)$/,x=/^(?:textarea|input|select)$/i,y=/\./g,z=/ /g,A=/[^\w\s.|`]/g,B=function(a){return a.replace(A,"\\$&")};f.event={add:function(a,c,d,e){if(a.nodeType!==3&&a.nodeType!==8){if(d===!1)d=C;else if(!d)return;var g,h;d.handler&&(g=d,d=g.handler),d.guid||(d.guid=f.guid++);var i=f._data(a);if(!i)return;var j=i.events,k=i.handle;j||(i.events=j={}),k||(i.handle=k=function(a){return typeof f!="undefined"&&(!a||f.event.triggered!==a.type)?f.event.handle.apply(k.elem,arguments):b}),k.elem=a,c=c.split(" ");var l,m=0,n;while(l=c[m++]){h=g?f.extend({},g):{handler:d,data:e},l.indexOf(".")>-1?(n=l.split("."),l=n.shift(),h.namespace=n.slice(0).sort().join(".")):(n=[],h.namespace=""),h.type=l,h.guid||(h.guid=d.guid);var o=j[l],p=f.event.special[l]||{};if(!o){o=j[l]=[];if(!p.setup||p.setup.call(a,e,n,k)===!1)a.addEventListener?a.addEventListener(l,k,!1):a.attachEvent&&a.attachEvent("on"+l,k)}p.add&&(p.add.call(a,h),h.handler.guid||(h.handler.guid=d.guid)),o.push(h),f.event.global[l]=!0}a=null}},global:{},remove:function(a,c,d,e){if(a.nodeType!==3&&a.nodeType!==8){d===!1&&(d=C);var g,h,i,j,k=0,l,m,n,o,p,q,r,s=f.hasData(a)&&f._data(a),t=s&&s.events;if(!s||!t)return;c&&c.type&&(d=c.handler,c=c.type);if(!c||typeof c=="string"&&c.charAt(0)==="."){c=c||"";for(h in t)f.event.remove(a,h+c);return}c=c.split(" ");while(h=c[k++]){r=h,q=null,l=h.indexOf(".")<0,m=[],l||(m=h.split("."),h=m.shift(),n=new RegExp("(^|\\.)"+f.map(m.slice(0).sort(),B).join("\\.(?:.*\\.)?")+"(\\.|$)")),p=t[h];if(!p)continue;if(!d){for(j=0;j<p.length;j++){q=p[j];if(l||n.test(q.namespace))f.event.remove(a,r,q.handler,j),p.splice(j--,1)}continue}o=f.event.special[h]||{};for(j=e||0;j<p.length;j++){q=p[j];if(d.guid===q.guid){if(l||n.test(q.namespace))e==null&&p.splice(j--,1),o.remove&&o.remove.call(a,q);if(e!=null)break}}if(p.length===0||e!=null&&p.length===1)(!o.teardown||o.teardown.call(a,m)===!1)&&f.removeEvent(a,h,s.handle),g=null,delete 
t[h]}if(f.isEmptyObject(t)){var u=s.handle;u&&(u.elem=null),delete s.events,delete s.handle,f.isEmptyObject(s)&&f.removeData(a,b,!0)}}},customEvent:{getData:!0,setData:!0,changeData:!0},trigger:function(c,d,e,g){var h=c.type||c,i=[],j;h.indexOf("!")>=0&&(h=h.slice(0,-1),j=!0),h.indexOf(".")>=0&&(i=h.split("."),h=i.shift(),i.sort());if(!!e&&!f.event.customEvent[h]||!!f.event.global[h]){c=typeof c=="object"?c[f.expando]?c:new f.Event(h,c):new f.Event(h),c.type=h,c.exclusive=j,c.namespace=i.join("."),c.namespace_re=new RegExp("(^|\\.)"+i.join("\\.(?:.*\\.)?")+"(\\.|$)");if(g||!e)c.preventDefault(),c.stopPropagation();if(!e){f.each(f.cache,function(){var a=f.expando,b=this[a];b&&b.events&&b.events[h]&&f.event.trigger(c,d,b.handle.elem)});return}if(e.nodeType===3||e.nodeType===8)return;c.result=b,c.target=e,d=d!=null?f.makeArray(d):[],d.unshift(c);var k=e,l=h.indexOf(":")<0?"on"+h:"";do{var m=f._data(k,"handle");c.currentTarget=k,m&&m.apply(k,d),l&&f.acceptData(k)&&k[l]&&k[l].apply(k,d)===!1&&(c.result=!1,c.preventDefault()),k=k.parentNode||k.ownerDocument||k===c.target.ownerDocument&&a}while(k&&!c.isPropagationStopped());if(!c.isDefaultPrevented()){var n,o=f.event.special[h]||{};if((!o._default||o._default.call(e.ownerDocument,c)===!1)&&(h!=="click"||!f.nodeName(e,"a"))&&f.acceptData(e)){try{l&&e[h]&&(n=e[l],n&&(e[l]=null),f.event.triggered=h,e[h]())}catch(p){}n&&(e[l]=n),f.event.triggered=b}}return c.result}},handle:function(c){c=f.event.fix(c||a.event);var d=((f._data(this,"events")||{})[c.type]||[]).slice(0),e=!c.exclusive&&!c.namespace,g=Array.prototype.slice.call(arguments,0);g[0]=c,c.currentTarget=this;for(var h=0,i=d.length;h<i;h++){var j=d[h];if(e||c.namespace_re.test(j.namespace)){c.handler=j.handler,c.data=j.data,c.handleObj=j;var k=j.handler.apply(this,g);k!==b&&(c.result=k,k===!1&&(c.preventDefault(),c.stopPropagation()));if(c.isImmediatePropagationStopped())break}}return c.result},props:"altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),fix:function(a){if(a[f.expando])return a;var d=a;a=f.Event(d);for(var e=this.props.length,g;e;)g=this.props[--e],a[g]=d[g];a.target||(a.target=a.srcElement||c),a.target.nodeType===3&&(a.target=a.target.parentNode),!a.relatedTarget&&a.fromElement&&(a.relatedTarget=a.fromElement===a.target?a.toElement:a.fromElement);if(a.pageX==null&&a.clientX!=null){var h=a.target.ownerDocument||c,i=h.documentElement,j=h.body;a.pageX=a.clientX+(i&&i.scrollLeft||j&&j.scrollLeft||0)-(i&&i.clientLeft||j&&j.clientLeft||0),a.pageY=a.clientY+(i&&i.scrollTop||j&&j.scrollTop||0)-(i&&i.clientTop||j&&j.clientTop||0)}a.which==null&&(a.charCode!=null||a.keyCode!=null)&&(a.which=a.charCode!=null?a.charCode:a.keyCode),!a.metaKey&&a.ctrlKey&&(a.metaKey=a.ctrlKey),!a.which&&a.button!==b&&(a.which=a.button&1?1:a.button&2?3:a.button&4?2:0);return a},guid:1e8,proxy:f.proxy,special:{ready:{setup:f.bindReady,teardown:f.noop},live:{add:function(a){f.event.add(this,M(a.origType,a.selector),f.extend({},a,{handler:L,guid:a.handler.guid}))},remove:function(a){f.event.remove(this,M(a.origType,a.selector),a)}},beforeunload:{setup:function(a,b,c){f.isWindow(this)&&(this.onbeforeunload=c)},teardown:function(a,b){this.onbeforeunload===b&&(this.onbeforeunload=null)}}}},f.removeEvent=c.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)}:function(a,b,c){a.detachEvent&&a.detachEvent("on"+b,c)},f.Event=function(a,b){if(!this.preventDefault)return new f.Event(a,b);a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||a.returnValue===!1||a.getPreventDefault&&a.getPreventDefault()?D:C):this.type=a,b&&f.extend(this,b),this.timeStamp=f.now(),this[f.expando]=!0},f.Event.prototype={preventDefault:function(){this.isDefaultPrevented=D;var a=this.originalEvent;!a||(a.preventDefault?a.preventDefault():a.returnValue=!1)},stopPropagation:function(){this.isPropagationStopped=D;var a=this.originalEvent;!a||(a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=D,this.stopPropagation()},isDefaultPrevented:C,isPropagationStopped:C,isImmediatePropagationStopped:C};var E=function(a){var b=a.relatedTarget,c=!1,d=a.type;a.type=a.data,b!==this&&(b&&(c=f.contains(this,b)),c||(f.event.handle.apply(this,arguments),a.type=d))},F=function(a){a.type=a.data,f.event.handle.apply(this,arguments)};f.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(a,b){f.event.special[a]={setup:function(c){f.event.add(this,b,c&&c.selector?F:E,a)},teardown:function(a){f.event.remove(this,b,a&&a.selector?F:E)}}}),f.support.submitBubbles||(f.event.special.submit={setup:function(a,b){if(!f.nodeName(this,"form"))f.event.add(this,"click.specialSubmit",function(a){var b=a.target,c=f.nodeName(b,"input")||f.nodeName(b,"button")?b.type:"";(c==="submit"||c==="image")&&f(b).closest("form").length&&J("submit",this,arguments)}),f.event.add(this,"keypress.specialSubmit",function(a){var b=a.target,c=f.nodeName(b,"input")||f.nodeName(b,"button")?b.type:"";(c==="text"||c==="password")&&f(b).closest("form").length&&a.keyCode===13&&J("submit",this,arguments)});else return!1},teardown:function(a){f.event.remove(this,".specialSubmit")}});if(!f.support.changeBubbles){var G,H=function(a){var b=f.nodeName(a,"input")?a.type:"",c=a.value;b==="radio"||b==="checkbox"?c=a.checked:b==="select-multiple"?c=a.selectedIndex>-1?f.map(a.options,function(a){return a.selected}).join("-"):"":f.nodeName(a,"select")&&(c=a.selectedIndex);return c},I=function(c){var d=c.target,e,g;if(!!x.test(d.nodeName)&&!d.readOnly){e=f._data(d,"_change_data"),g=H(d),(c.type!=="focusout"||d.type!=="radio")&&f._data(d,"_change_data",g);if(e===b||g===e)return;if(e!=null||g)c.type="change",c.liveFired=b,f.event.trigger(c,arguments[1],d)}};f.event.special.change={filters:{focusout:I,beforedeactivate:I,click:function(a){var b=a.target,c=f.nodeName(b,"input")?b.type:"";(c==="radio"||c==="checkbox"||f.nodeName(b,"select"))&&I.call(this,a)},keydown:function(a){var b=a.target,c=f.nodeName(b,"input")?b.type:"";(a.keyCode===13&&!f.nodeName(b,"textarea")||a.keyCode===32&&(c==="checkbox"||c==="radio")||c==="select-multiple")&&I.call(this,a)},beforeactivate:function(a){var b=a.target;f._data(b,"_change_data",H(b))}},setup:function(a,b){if(this.type==="file")return!1;for(var c in G)f.event.add(this,c+".specialChange",G[c]);return x.test(this.nodeName)},teardown:function(a){f.event.remove(this,".specialChange");return x.test(this.nodeName)}},G=f.event.special.change.filters,G.focus=G.beforeactivate}f.support.focusinBubbles||f.each({focus:"focusin",blur:"focusout"},function(a,b){function e(a){var c=f.event.fix(a);c.type=b,c.originalEvent={},f.event.trigger(c,null,c.target),c.isDefaultPrevented()&&a.preventDefault()}var d=0;f.event.special[b]={setup:function(){d++===0&&c.addEventListener(a,e,!0)},teardown:function(){--d===0&&c.removeEventListener(a,e,!0)}}}),f.each(["bind","one"],function(a,c){f.fn[c]=function(a,d,e){var g;if(typeof a=="object"){for(var h in a)this[c](h,d,a[h],e);return this}if(arguments.length===2||d===!1)e=d,d=b;c==="one"?(g=function(a){f(this).unbind(a,g);return e.apply(this,arguments)},g.guid=e.guid||f.guid++):g=e;if(a==="unload"&&c!=="one")this.one(a,d,e);else for(var i=0,j=this.length;i<j;i++)f.event.add(this[i],a,g,d);return this}}),f.fn.extend({unbind:function(a,b){if(typeof a=="object"&&!a.preventDefault)for(var c in a)this.unbind(c,a[c]);else for(var d=0,e=this.length;d<e;d++)f.event.remove(this[d],a,b);return this},delegate:function(a,b,c,d){return this.live(b,c,d,a)},undelegate:function(a,b,c){return arguments.length===0?this.unbind("live"):this.die(b,null,c,a)},trigger:function(a,b){return this.each(function(){f.event.trigger(a,b,this)})},triggerHandler:function(a,b){if(this[0])return f.event.trigger(a,b,this[0],!0)},toggle:function(a){var b=arguments,c=a.guid||f.guid++,d=0,e=function(c){var e=(f.data(this,"lastToggle"+a.guid)||0)%d;f.data(this,"lastToggle"+a.guid,e+1),c.preventDefault();return b[e].apply(this,arguments)||!1};e.guid=c;while(d<b.length)b[d++].guid=c;return this.click(e)},hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}});var K={focus:"focusin",blur:"focusout",mouseenter:"mouseover",mouseleave:"mouseout"};f.each(["live","die"],function(a,c){f.fn[c]=function(a,d,e,g){var h,i=0,j,k,l,m=g||this.selector,n=g?this:f(this.context);if(typeof a=="object"&&!a.preventDefault){for(var o in a)n[c](o,d,a[o],m);return this}if(c==="die"&&!a&&g&&g.charAt(0)==="."){n.unbind(g);return this}if(d===!1||f.isFunction(d))e=d||C,d=b;a=(a||"").split(" ");while((h=a[i++])!=null){j=w.exec(h),k="",j&&(k=j[0],h=h.replace(w,""));if(h==="hover"){a.push("mouseenter"+k,"mouseleave"+k);continue}l=h,K[h]?(a.push(K[h]+k),h=h+k):h=(K[h]||h)+k;if(c==="live")for(var p=0,q=n.length;p<q;p++)f.event.add(n[p],"live."+M(h,m),{data:d,selector:m,handler:e,origType:h,origHandler:e,preType:l});else n.unbind("live."+M(h,m),e)}return this}}),f.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error".split(" "),function(a,b){f.fn[b]=function(a,c){c==null&&(c=a,a=null);return arguments.length>0?this.bind(b,a,c):this.trigger(b)},f.attrFn&&(f.attrFn[b]=!0)}),function(){function u(a,b,c,d,e,f){for(var g=0,h=d.length;g<h;g++){var i=d[g];if(i){var j=!1;i=i[a];while(i){if(i.sizcache===c){j=d[i.sizset];break}if(i.nodeType===1){f||(i.sizcache=c,i.sizset=g);if(typeof b!="string"){if(i===b){j=!0;break}}else if(k.filter(b,[i]).length>0){j=i;break}}i=i[a]}d[g]=j}}}function t(a,b,c,d,e,f){for(var g=0,h=d.length;g<h;g++){var i=d[g];if(i){var j=!1;i=i[a];while(i){if(i.sizcache===c){j=d[i.sizset];break}i.nodeType===1&&!f&&(i.sizcache=c,i.sizset=g);if(i.nodeName.toLowerCase()===b){j=i;break}i=i[a]}d[g]=j}}}var a=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,d=0,e=Object.prototype.toString,g=!1,h=!0,i=/\\/g,j=/\W/;[0,0].sort(function(){h=!1;return 0});var k=function(b,d,f,g){f=f||[],d=d||c;var h=d;if(d.nodeType!==1&&d.nodeType!==9)return[];if(!b||typeof b!="string")return f;var i,j,n,o,q,r,s,t,u=!0,w=k.isXML(d),x=[],y=b;do{a.exec(""),i=a.exec(y);if(i){y=i[3],x.push(i[1]);if(i[2]){o=i[3];break}}}while(i);if(x.length>1&&m.exec(b))if(x.length===2&&l.relative[x[0]])j=v(x[0]+x[1],d);else{j=l.relative[x[0]]?[d]:k(x.shift(),d);while(x.length)b=x.shift(),l.relative[b]&&(b+=x.shift()),j=v(b,j)}else{!g&&x.length>1&&d.nodeType===9&&!w&&l.match.ID.test(x[0])&&!l.match.ID.test(x[x.length-1])&&(q=k.find(x.shift(),d,w),d=q.expr?k.filter(q.expr,q.set)[0]:q.set[0]);if(d){q=g?{expr:x.pop(),set:p(g)}:k.find(x.pop(),x.length===1&&(x[0]==="~"||x[0]==="+")&&d.parentNode?d.parentNode:d,w),j=q.expr?k.filter(q.expr,q.set):q.set,x.length>0?n=p(j):u=!1;while(x.length)r=x.pop(),s=r,l.relative[r]?s=x.pop():r="",s==null&&(s=d),l.relative[r](n,s,w)}else n=x=[]}n||(n=j),n||k.error(r||b);if(e.call(n)==="[object Array]")if(!u)f.push.apply(f,n);else if(d&&d.nodeType===1)for(t=0;n[t]!=null;t++)n[t]&&(n[t]===!0||n[t].nodeType===1&&k.contains(d,n[t]))&&f.push(j[t]);else for(t=0;n[t]!=null;t++)n[t]&&n[t].nodeType===1&&f.push(j[t]);else p(n,f);o&&(k(o,h,f,g),k.uniqueSort(f));return f};k.uniqueSort=function(a){if(r){g=h,a.sort(r);if(g)for(var b=1;b<a.length;b++)a[b]===a[b-1]&&a.splice(b--,1)}return a},k.matches=function(a,b){return k(a,null,null,b)},k.matchesSelector=function(a,b){return k(b,null,null,[a]).length>0},k.find=function(a,b,c){var d;if(!a)return[];for(var e=0,f=l.order.length;e<f;e++){var g,h=l.order[e];if(g=l.leftMatch[h].exec(a)){var j=g[1];g.splice(1,1);if(j.substr(j.length-1)!=="\\"){g[1]=(g[1]||"").replace(i,""),d=l.find[h](g,b,c);if(d!=null){a=a.replace(l.match[h],"");break}}}}d||(d=typeof b.getElementsByTagName!="undefined"?b.getElementsByTagName("*"):[]);return{set:d,expr:a}},k.filter=function(a,c,d,e){var f,g,h=a,i=[],j=c,m=c&&c[0]&&k.isXML(c[0]);while(a&&c.length){for(var n in l.filter)if((f=l.leftMatch[n].exec(a))!=null&&f[2]){var o,p,q=l.filter[n],r=f[1];g=!1,f.splice(1,1);if(r.substr(r.length-1)==="\\")continue;j===i&&(i=[]);if(l.preFilter[n]){f=l.preFilter[n](f,j,d,i,e,m);if(!f)g=o=!0;else if(f===!0)continue}if(f)for(var s=0;(p=j[s])!=null;s++)if(p){o=q(p,f,s,j);var t=e^!!o;d&&o!=null?t?g=!0:j[s]=!1:t&&(i.push(p),g=!0)}if(o!==b){d||(j=i),a=a.replace(l.match[n],"");if(!g)return[];break}}if(a===h)if(g==null)k.error(a);else break;h=a}return j},k.error=function(a){throw"Syntax error, unrecognized expression: "+a};var l=k.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/},leftMatch:{},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(a){return a.getAttribute("href")},type:function(a){return a.getAttribute("type")}},relative:{"+":function(a,b){var c=typeof b=="string",d=c&&!j.test(b),e=c&&!d;d&&(b=b.toLowerCase());for(var f=0,g=a.length,h;f<g;f++)if(h=a[f]){while((h=h.previousSibling)&&h.nodeType!==1);a[f]=e||h&&h.nodeName.toLowerCase()===b?h||!1:h===b}e&&k.filter(b,a,!0)},">":function(a,b){var c,d=typeof b=="string",e=0,f=a.length;if(d&&!j.test(b)){b=b.toLowerCase();for(;e<f;e++){c=a[e];if(c){var g=c.parentNode;a[e]=g.nodeName.toLowerCase()===b?g:!1}}}else{for(;e<f;e++)c=a[e],c&&(a[e]=d?c.parentNode:c.parentNode===b);d&&k.filter(b,a,!0)}},"":function(a,b,c){var e,f=d++,g=u;typeof b=="string"&&!j.test(b)&&(b=b.toLowerCase(),e=b,g=t),g("parentNode",b,f,a,e,c)},"~":function(a,b,c){var e,f=d++,g=u;typeof b=="string"&&!j.test(b)&&(b=b.toLowerCase(),e=b,g=t),g("previousSibling",b,f,a,e,c)}},find:{ID:function(a,b,c){if(typeof b.getElementById!="undefined"&&!c){var d=b.getElementById(a[1]);return d&&d.parentNode?[d]:[]}},NAME:function(a,b){if(typeof b.getElementsByName!="undefined"){var c=[],d=b.getElementsByName(a[1]);for(var e=0,f=d.length;e<f;e++)d[e].getAttribute("name")===a[1]&&c.push(d[e]);return c.length===0?null:c}},TAG:function(a,b){if(typeof b.getElementsByTagName!="undefined")return b.getElementsByTagName(a[1])}},preFilter:{CLASS:function(a,b,c,d,e,f){a=" "+a[1].replace(i,"")+" ";if(f)return a;for(var g=0,h;(h=b[g])!=null;g++)h&&(e^(h.className&&(" "+h.className+" ").replace(/[\t\n\r]/g," ").indexOf(a)>=0)?c||d.push(h):c&&(b[g]=!1));return!1},ID:function(a){return a[1].replace(i,"")},TAG:function(a,b){return a[1].replace(i,"").toLowerCase()},CHILD:function(a){if(a[1]==="nth"){a[2]||k.error(a[0]),a[2]=a[2].replace(/^\+|\s*/g,"");var b=/(-?)(\d*)(?:n([+\-]?\d*))?/.exec(a[2]==="even"&&"2n"||a[2]==="odd"&&"2n+1"||!/\D/.test(a[2])&&"0n+"+a[2]||a[2]);a[2]=b[1]+(b[2]||1)-0,a[3]=b[3]-0}else a[2]&&k.error(a[0]);a[0]=d++;return a},ATTR:function(a,b,c,d,e,f){var g=a[1]=a[1].replace(i,"");!f&&l.attrMap[g]&&(a[1]=l.attrMap[g]),a[4]=(a[4]||a[5]||"").replace(i,""),a[2]==="~="&&(a[4]=" "+a[4]+" ");return a},PSEUDO:function(b,c,d,e,f){if(b[1]==="not")if((a.exec(b[3])||"").length>1||/^\w/.test(b[3]))b[3]=k(b[3],null,null,c);else{var g=k.filter(b[3],c,d,!0^f);d||e.push.apply(e,g);return!1}else if(l.match.POS.test(b[0])||l.match.CHILD.test(b[0]))return!0;return b},POS:function(a){a.unshift(!0);return a}},filters:{enabled:function(a){return a.disabled===!1&&a.type!=="hidden"},disabled:function(a){return a.disabled===!0},checked:function(a){return a.checked===!0},selected:function(a){a.parentNode&&a.parentNode.selectedIndex;return a.selected===!0},parent:function(a){return!!a.firstChild},empty:function(a){return!a.firstChild},has:function(a,b,c){return!!k(c[3],a).length},header:function(a){return/h\d/i.test(a.nodeName)},text:function(a){var b=a.getAttribute("type"),c=a.type;return a.nodeName.toLowerCase()==="input"&&"text"===c&&(b===c||b===null)},radio:function(a){return a.nodeName.toLowerCase()==="input"&&"radio"===a.type},checkbox:function(a){return a.nodeName.toLowerCase()==="input"&&"checkbox"===a.type},file:function(a){return a.nodeName.toLowerCase()==="input"&&"file"===a.type},password:function(a){return a.nodeName.toLowerCase()==="input"&&"password"===a.type},submit:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"submit"===a.type},image:function(a){return a.nodeName.toLowerCase()==="input"&&"image"===a.type},reset:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"reset"===a.type},button:function(a){var b=a.nodeName.toLowerCase();return b==="input"&&"button"===a.type||b==="button"},input:function(a){return/input|select|textarea|button/i.test(a.nodeName)},focus:function(a){return a===a.ownerDocument.activeElement}},setFilters:{first:function(a,b){return b===0},last:function(a,b,c,d){return b===d.length-1},even:function(a,b){return b%2===0},odd:function(a,b){return b%2===1},lt:function(a,b,c){return b<c[3]-0},gt:function(a,b,c){return b>c[3]-0},nth:function(a,b,c){return c[3]-0===b},eq:function(a,b,c){return c[3]-0===b}},filter:{PSEUDO:function(a,b,c,d){var e=b[1],f=l.filters[e];if(f)return f(a,c,b,d);if(e==="contains")return(a.textContent||a.innerText||k.getText([a])||"").indexOf(b[3])>=0;if(e==="not"){var g=b[3];for(var h=0,i=g.length;h<i;h++)if(g[h]===a)return!1;return!0}k.error(e)},CHILD:function(a,b){var c=b[1],d=a;switch(c){case"only":case"first":while(d=d.previousSibling)if(d.nodeType===1)return!1;if(c==="first")return!0;d=a;case"last":while(d=d.nextSibling)if(d.nodeType===1)return!1;return!0;case"nth":var e=b[2],f=b[3];if(e===1&&f===0)return!0;var g=b[0],h=a.parentNode;if(h&&(h.sizcache!==g||!a.nodeIndex)){var i=0;for(d=h.firstChild;d;d=d.nextSibling)d.nodeType===1&&(d.nodeIndex=++i);h.sizcache=g}var j=a.nodeIndex-f;return e===0?j===0:j%e===0&&j/e>=0}},ID:function(a,b){return a.nodeType===1&&a.getAttribute("id")===b},TAG:function(a,b){return b==="*"&&a.nodeType===1||a.nodeName.toLowerCase()===b},CLASS:function(a,b){return(" "+(a.className||a.getAttribute("class"))+" ").indexOf(b)>-1},ATTR:function(a,b){var c=b[1],d=l.attrHandle[c]?l.attrHandle[c](a):a[c]!=null?a[c]:a.getAttribute(c),e=d+"",f=b[2],g=b[4];return d==null?f==="!=":f==="="?e===g:f==="*="?e.indexOf(g)>=0:f==="~="?(" "+e+" ").indexOf(g)>=0:g?f==="!="?e!==g:f==="^="?e.indexOf(g)===0:f==="$="?e.substr(e.length-g.length)===g:f==="|="?e===g||e.substr(0,g.length+1)===g+"-":!1:e&&d!==!1},POS:function(a,b,c,d){var e=b[2],f=l.setFilters[e];if(f)return f(a,c,b,d)}}},m=l.match.POS,n=function(a,b){return"\\"+(b-0+1)};for(var o in l.match)l.match[o]=new RegExp(l.match[o].source+/(?![^\[]*\])(?![^\(]*\))/.source),l.leftMatch[o]=new RegExp(/(^(?:.|\r|\n)*?)/.source+l.match[o].source.replace(/\\(\d+)/g,n));var p=function(a,b){a=Array.prototype.slice.call(a,0);if(b){b.push.apply(b,a);return b}return a};try{Array.prototype.slice.call(c.documentElement.childNodes,0)[0].nodeType}catch(q){p=function(a,b){var c=0,d=b||[];if(e.call(a)==="[object Array]")Array.prototype.push.apply(d,a);else if(typeof a.length=="number")for(var f=a.length;c<f;c++)d.push(a[c]);else for(;a[c];c++)d.push(a[c]);return d}}var r,s;c.documentElement.compareDocumentPosition?r=function(a,b){if(a===b){g=!0;return 0}if(!a.compareDocumentPosition||!b.compareDocumentPosition)return a.compareDocumentPosition?-1:1;return a.compareDocumentPosition(b)&4?-1:1}:(r=function(a,b){if(a===b){g=!0;return 0}if(a.sourceIndex&&b.sourceIndex)return a.sourceIndex-b.sourceIndex;var c,d,e=[],f=[],h=a.parentNode,i=b.parentNode,j=h;if(h===i)return s(a,b);if(!h)return-1;if(!i)return 1;while(j)e.unshift(j),j=j.parentNode;j=i;while(j)f.unshift(j),j=j.parentNode;c=e.length,d=f.length;for(var k=0;k<c&&k<d;k++)if(e[k]!==f[k])return s(e[k],f[k]);return k===c?s(a,f[k],-1):s(e[k],b,1)},s=function(a,b,c){if(a===b)return c;var d=a.nextSibling;while(d){if(d===b)return-1;d=d.nextSibling}return 1}),k.getText=function(a){var b="",c;for(var d=0;a[d];d++)c=a[d],c.nodeType===3||c.nodeType===4?b+=c.nodeValue:c.nodeType!==8&&(b+=k.getText(c.childNodes));return b},function(){var a=c.createElement("div"),d="script"+(new Date).getTime(),e=c.documentElement;a.innerHTML="<a name='"+d+"'/>",e.insertBefore(a,e.firstChild),c.getElementById(d)&&(l.find.ID=function(a,c,d){if(typeof c.getElementById!="undefined"&&!d){var e=c.getElementById(a[1]);return e?e.id===a[1]||typeof e.getAttributeNode!="undefined"&&e.getAttributeNode("id").nodeValue===a[1]?[e]:b:[]}},l.filter.ID=function(a,b){var c=typeof a.getAttributeNode!="undefined"&&a.getAttributeNode("id");return a.nodeType===1&&c&&c.nodeValue===b}),e.removeChild(a),e=a=null}(),function(){var a=c.createElement("div");a.appendChild(c.createComment("")),a.getElementsByTagName("*").length>0&&(l.find.TAG=function(a,b){var c=b.getElementsByTagName(a[1]);if(a[1]==="*"){var d=[];for(var e=0;c[e];e++)c[e].nodeType===1&&d.push(c[e]);c=d}return c}),a.innerHTML="<a href='#'></a>",a.firstChild&&typeof a.firstChild.getAttribute!="undefined"&&a.firstChild.getAttribute("href")!=="#"&&(l.attrHandle.href=function(a){return a.getAttribute("href",2)}),a=null}(),c.querySelectorAll&&function(){var a=k,b=c.createElement("div"),d="__sizzle__";b.innerHTML="<p class='TEST'></p>";if(!b.querySelectorAll||b.querySelectorAll(".TEST").length!==0){k=function(b,e,f,g){e=e||c;if(!g&&!k.isXML(e)){var h=/^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(b);if(h&&(e.nodeType===1||e.nodeType===9)){if(h[1])return p(e.getElementsByTagName(b),f);if(h[2]&&l.find.CLASS&&e.getElementsByClassName)return p(e.getElementsByClassName(h[2]),f)}if(e.nodeType===9){if(b==="body"&&e.body)return p([e.body],f);if(h&&h[3]){var i=e.getElementById(h[3]);if(!i||!i.parentNode)return p([],f);if(i.id===h[3])return p([i],f)}try{return p(e.querySelectorAll(b),f)}catch(j){}}else if(e.nodeType===1&&e.nodeName.toLowerCase()!=="object"){var m=e,n=e.getAttribute("id"),o=n||d,q=e.parentNode,r=/^\s*[+~]/.test(b);n?o=o.replace(/'/g,"\\$&"):e.setAttribute("id",o),r&&q&&(e=e.parentNode);try{if(!r||q)return p(e.querySelectorAll("[id='"+o+"'] "+b),f)}catch(s){}finally{n||m.removeAttribute("id")}}}return a(b,e,f,g)};for(var e in a)k[e]=a[e];b=null}}(),function(){var a=c.documentElement,b=a.matchesSelector||a.mozMatchesSelector||a.webkitMatchesSelector||a.msMatchesSelector;if(b){var d=!b.call(c.createElement("div"),"div"),e=!1;try{b.call(c.documentElement,"[test!='']:sizzle")}catch(f){e=!0}k.matchesSelector=function(a,c){c=c.replace(/\=\s*([^'"\]]*)\s*\]/g,"='$1']");if(!k.isXML(a))try{if(e||!l.match.PSEUDO.test(c)&&!/!=/.test(c)){var f=b.call(a,c);if(f||!d||a.document&&a.document.nodeType!==11)return f}}catch(g){}return k(c,null,null,[a]).length>0}}}(),function(){var a=c.createElement("div");a.innerHTML="<div class='test e'></div><div class='test'></div>";if(!!a.getElementsByClassName&&a.getElementsByClassName("e").length!==0){a.lastChild.className="e";if(a.getElementsByClassName("e").length===1)return;l.order.splice(1,0,"CLASS"),l.find.CLASS=function(a,b,c){if(typeof b.getElementsByClassName!="undefined"&&!c)return b.getElementsByClassName(a[1])},a=null}}(),c.documentElement.contains?k.contains=function(a,b){return a!==b&&(a.contains?a.contains(b):!0)}:c.documentElement.compareDocumentPosition?k.contains=function(a,b){return!!(a.compareDocumentPosition(b)&16)}:k.contains=function(){return!1},k.isXML=function(a){var b=(a?a.ownerDocument||a:0).documentElement;return b?b.nodeName!=="HTML":!1};var v=function(a,b){var c,d=[],e="",f=b.nodeType?[b]:b;while(c=l.match.PSEUDO.exec(a))e+=c[0],a=a.replace(l.match.PSEUDO,"");a=l.relative[a]?a+"*":a;for(var g=0,h=f.length;g<h;g++)k(a,f[g],d);return k.filter(e,d)};f.find=k,f.expr=k.selectors,f.expr[":"]=f.expr.filters,f.unique=k.uniqueSort,f.text=k.getText,f.isXMLDoc=k.isXML,f.contains=k.contains}();var N=/Until$/,O=/^(?:parents|prevUntil|prevAll)/,P=/,/,Q=/^.[^:#\[\.,]*$/,R=Array.prototype.slice,S=f.expr.match.POS,T={children:!0,contents:!0,next:!0,prev:!0};f.fn.extend({find:function(a){var b=this,c,d;if(typeof a!="string")return f(a).filter(function(){for(c=0,d=b.length;c<d;c++)if(f.contains(b[c],this))return!0});var e=this.pushStack("","find",a),g,h,i;for(c=0,d=this.length;c<d;c++){g=e.length,f.find(a,this[c],e);if(c>0)for(h=g;h<e.length;h++)for(i=0;i<g;i++)if(e[i]===e[h]){e.splice(h--,1);break}}return e},has:function(a){var b=f(a);return this.filter(function(){for(var a=0,c=b.length;a<c;a++)if(f.contains(this,b[a]))return!0})},not:function(a){return this.pushStack(V(this,a,!1),"not",a)},filter:function(a){return this.pushStack(V(this,a,!0),"filter",a)},is:function(a){return!!a&&(typeof a=="string"?f.filter(a,this).length>0:this.filter(a).length>0)},closest:function(a,b){var c=[],d,e,g=this[0];if(f.isArray(a)){var h,i,j={},k=1;if(g&&a.length){for(d=0,e=a.length;d<e;d++)i=a[d],j[i]||(j[i]=S.test(i)?f(i,b||this.context):i);while(g&&g.ownerDocument&&g!==b){for(i in j)h=j[i],(h.jquery?h.index(g)>-1:f(g).is(h))&&c.push({selector:i,elem:g,level:k});g=g.parentNode,k++}}return c}var l=S.test(a)||typeof a!="string"?f(a,b||this.context):0;for(d=0,e=this.length;d<e;d++){g=this[d];while(g){if(l?l.index(g)>-1:f.find.matchesSelector(g,a)){c.push(g);break}g=g.parentNode;if(!g||!g.ownerDocument||g===b||g.nodeType===11)break}}c=c.length>1?f.unique(c):c;return this.pushStack(c,"closest",a)},index:function(a){if(!a)return this[0]&&this[0].parentNode?this.prevAll().length:-1;if(typeof a=="string")return f.inArray(this[0],f(a));return f.inArray(a.jquery?a[0]:a,this)},add:function(a,b){var c=typeof a=="string"?f(a,b):f.makeArray(a&&a.nodeType?[a]:a),d=f.merge(this.get(),c);return this.pushStack(U(c[0])||U(d[0])?d:f.unique(d))},andSelf:function(){return this.add(this.prevObject)}}),f.each({parent:function(a){var b=a.parentNode;return b&&b.nodeType!==11?b:null},parents:function(a){return f.dir(a,"parentNode")},parentsUntil:function(a,b,c){return f.dir(a,"parentNode",c)},next:function(a){return f.nth(a,2,"nextSibling")},prev:function(a){return f.nth(a,2,"previousSibling")},nextAll:function(a){return f.dir(a,"nextSibling")},prevAll:function(a){return f.dir(a,"previousSibling")},nextUntil:function(a,b,c){return f.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return f.dir(a,"previousSibling",c)},siblings:function(a){return f.sibling(a.parentNode.firstChild,a)},children:function(a){return f.sibling(a.firstChild)},contents:function(a){return f.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:f.makeArray(a.childNodes)}},function(a,b){f.fn[a]=function(c,d){var e=f.map(this,b,c),g=R.call(arguments);N.test(a)||(d=c),d&&typeof d=="string"&&(e=f.filter(d,e)),e=this.length>1&&!T[a]?f.unique(e):e,(this.length>1||P.test(d))&&O.test(a)&&(e=e.reverse());return this.pushStack(e,a,g.join(","))}}),f.extend({filter:function(a,b,c){c&&(a=":not("+a+")");return b.length===1?f.find.matchesSelector(b[0],a)?[b[0]]:[]:f.find.matches(a,b)},dir:function(a,c,d){var e=[],g=a[c];while(g&&g.nodeType!==9&&(d===b||g.nodeType!==1||!f(g).is(d)))g.nodeType===1&&e.push(g),g=g[c];return e},nth:function(a,b,c,d){b=b||1;var e=0;for(;a;a=a[c])if(a.nodeType===1&&++e===b)break;return a},sibling:function(a,b){var c=[];for(;a;a=a.nextSibling)a.nodeType===1&&a!==b&&c.push(a);return c}});var W=/ jQuery\d+="(?:\d+|null)"/g,X=/^\s+/,Y=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,Z=/<([\w:]+)/,$=/<tbody/i,_=/<|&#?\w+;/,ba=/<(?:script|object|embed|option|style)/i,bb=/checked\s*(?:[^=]|=\s*.checked.)/i,bc=/\/(java|ecma)script/i,bd=/^\s*<!(?:\[CDATA\[|\-\-)/,be={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]};be.optgroup=be.option,be.tbody=be.tfoot=be.colgroup=be.caption=be.thead,be.th=be.td,f.support.htmlSerialize||(be._default=[1,"div<div>","</div>"]),f.fn.extend({text:function(a){if(f.isFunction(a))return this.each(function(b){var c=f(this);c.text(a.call(this,b,c.text()))});if(typeof a!="object"&&a!==b)return this.empty().append((this[0]&&this[0].ownerDocument||c).createTextNode(a));return f.text(this)},wrapAll:function(a){if(f.isFunction(a))return this.each(function(b){f(this).wrapAll(a.call(this,b))});if(this[0]){var b=f(a,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstChild&&a.firstChild.nodeType===1)a=a.firstChild;return a}).append(this)}return this},wrapInner:function(a){if(f.isFunction(a))return this.each(function(b){f(this).wrapInner(a.call(this,b))});return this.each(function(){var b=f(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){return this.each(function(){f(this).wrapAll(a)})},unwrap:function(){return this.parent().each(function(){f.nodeName(this,"body")||f(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.appendChild(a)})},prepend:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.insertBefore(a,this.firstChild)})},before:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this)});if(arguments.length){var a=f(arguments[0]);a.push.apply(a,this.toArray());return this.pushStack(a,"before",arguments)}},after:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this.nextSibling)});if(arguments.length){var a=this.pushStack(this,"after",arguments);a.push.apply(a,f(arguments[0]).toArray());return a}},remove:function(a,b){for(var c=0,d;(d=this[c])!=null;c++)if(!a||f.filter(a,[d]).length)!b&&d.nodeType===1&&(f.cleanData(d.getElementsByTagName("*")),f.cleanData([d])),d.parentNode&&d.parentNode.removeChild(d);return this},empty:function(){for(var a=0,b;(b=this[a])!=null;a++){b.nodeType===1&&f.cleanData(b.getElementsByTagName("*"));while(b.firstChild)b.removeChild(b.firstChild)}return this},clone:function(a,b){a=a==null?!1:a,b=b==null?a:b;return this.map(function(){return f.clone(this,a,b)})},html:function(a){if(a===b)return this[0]&&this[0].nodeType===1?this[0].innerHTML.replace(W,""):null;if(typeof a=="string"&&!ba.test(a)&&(f.support.leadingWhitespace||!X.test(a))&&!be[(Z.exec(a)||["",""])[1].toLowerCase()]){a=a.replace(Y,"<$1></$2>");try{for(var c=0,d=this.length;c<d;c++)this[c].nodeType===1&&(f.cleanData(this[c].getElementsByTagName("*")),this[c].innerHTML=a)}catch(e){this.empty().append(a)}}else f.isFunction(a)?this.each(function(b){var c=f(this);c.html(a.call(this,b,c.html()))}):this.empty().append(a);return this},replaceWith:function(a){if(this[0]&&this[0].parentNode){if(f.isFunction(a))return this.each(function(b){var c=f(this),d=c.html();c.replaceWith(a.call(this,b,d))});typeof a!="string"&&(a=f(a).detach());return this.each(function(){var b=this.nextSibling,c=this.parentNode;f(this).remove(),b?f(b).before(a):f(c).append(a)})}return this.length?this.pushStack(f(f.isFunction(a)?a():a),"replaceWith",a):this},detach:function(a){return this.remove(a,!0)},domManip:function(a,c,d){var e,g,h,i,j=a[0],k=[];if(!f.support.checkClone&&arguments.length===3&&typeof j=="string"&&bb.test(j))return this.each(function(){f(this).domManip(a,c,d,!0)});if(f.isFunction(j))return this.each(function(e){var g=f(this);a[0]=j.call(this,e,c?g.html():b),g.domManip(a,c,d)});if(this[0]){i=j&&j.parentNode,f.support.parentNode&&i&&i.nodeType===11&&i.childNodes.length===this.length?e={fragment:i}:e=f.buildFragment(a,this,k),h=e.fragment,h.childNodes.length===1?g=h=h.firstChild:g=h.firstChild;if(g){c=c&&f.nodeName(g,"tr");for(var l=0,m=this.length,n=m-1;l<m;l++)d.call(c?bf(this[l],g):this[l],e.cacheable||m>1&&l<n?f.clone(h,!0,!0):h)}k.length&&f.each(k,bl)}return this}}),f.buildFragment=function(a,b,d){var e,g,h,i;b&&b[0]&&(i=b[0].ownerDocument||b[0]),i.createDocumentFragment||(i=c),a.length===1&&typeof a[0]=="string"&&a[0].length<512&&i===c&&a[0].charAt(0)==="<"&&!ba.test(a[0])&&(f.support.checkClone||!bb.test(a[0]))&&(g=!0,h=f.fragments[a[0]],h&&h!==1&&(e=h)),e||(e=i.createDocumentFragment(),f.clean
(a,i,e,d)),g&&(f.fragments[a[0]]=h?e:1);return{fragment:e,cacheable:g}},f.fragments={},f.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){f.fn[a]=function(c){var d=[],e=f(c),g=this.length===1&&this[0].parentNode;if(g&&g.nodeType===11&&g.childNodes.length===1&&e.length===1){e[b](this[0]);return this}for(var h=0,i=e.length;h<i;h++){var j=(h>0?this.clone(!0):this).get();f(e[h])[b](j),d=d.concat(j)}return this.pushStack(d,a,e.selector)}}),f.extend({clone:function(a,b,c){var d=a.cloneNode(!0),e,g,h;if((!f.support.noCloneEvent||!f.support.noCloneChecked)&&(a.nodeType===1||a.nodeType===11)&&!f.isXMLDoc(a)){bh(a,d),e=bi(a),g=bi(d);for(h=0;e[h];++h)g[h]&&bh(e[h],g[h])}if(b){bg(a,d);if(c){e=bi(a),g=bi(d);for(h=0;e[h];++h)bg(e[h],g[h])}}e=g=null;return d},clean:function(a,b,d,e){var g;b=b||c,typeof b.createElement=="undefined"&&(b=b.ownerDocument||b[0]&&b[0].ownerDocument||c);var h=[],i;for(var j=0,k;(k=a[j])!=null;j++){typeof k=="number"&&(k+="");if(!k)continue;if(typeof k=="string")if(!_.test(k))k=b.createTextNode(k);else{k=k.replace(Y,"<$1></$2>");var l=(Z.exec(k)||["",""])[1].toLowerCase(),m=be[l]||be._default,n=m[0],o=b.createElement("div");o.innerHTML=m[1]+k+m[2];while(n--)o=o.lastChild;if(!f.support.tbody){var p=$.test(k),q=l==="table"&&!p?o.firstChild&&o.firstChild.childNodes:m[1]==="<table>"&&!p?o.childNodes:[];for(i=q.length-1;i>=0;--i)f.nodeName(q[i],"tbody")&&!q[i].childNodes.length&&q[i].parentNode.removeChild(q[i])}!f.support.leadingWhitespace&&X.test(k)&&o.insertBefore(b.createTextNode(X.exec(k)[0]),o.firstChild),k=o.childNodes}var r;if(!f.support.appendChecked)if(k[0]&&typeof (r=k.length)=="number")for(i=0;i<r;i++)bk(k[i]);else bk(k);k.nodeType?h.push(k):h=f.merge(h,k)}if(d){g=function(a){return!a.type||bc.test(a.type)};for(j=0;h[j];j++)if(e&&f.nodeName(h[j],"script")&&(!h[j].type||h[j].type.toLowerCase()==="text/javascript"))e.push(h[j].parentNode?h[j].parentNode.removeChild(h[j]):h[j]);else{if(h[j].nodeType===1){var s=f.grep(h[j].getElementsByTagName("script"),g);h.splice.apply(h,[j+1,0].concat(s))}d.appendChild(h[j])}}return h},cleanData:function(a){var b,c,d=f.cache,e=f.expando,g=f.event.special,h=f.support.deleteExpando;for(var i=0,j;(j=a[i])!=null;i++){if(j.nodeName&&f.noData[j.nodeName.toLowerCase()])continue;c=j[f.expando];if(c){b=d[c]&&d[c][e];if(b&&b.events){for(var k in b.events)g[k]?f.event.remove(j,k):f.removeEvent(j,k,b.handle);b.handle&&(b.handle.elem=null)}h?delete j[f.expando]:j.removeAttribute&&j.removeAttribute(f.expando),delete d[c]}}}});var bm=/alpha\([^)]*\)/i,bn=/opacity=([^)]*)/,bo=/([A-Z]|^ms)/g,bp=/^-?\d+(?:px)?$/i,bq=/^-?\d/,br=/^([\-+])=([\-+.\de]+)/,bs={position:"absolute",visibility:"hidden",display:"block"},bt=["Left","Right"],bu=["Top","Bottom"],bv,bw,bx;f.fn.css=function(a,c){if(arguments.length===2&&c===b)return this;return f.access(this,a,c,!0,function(a,c,d){return d!==b?f.style(a,c,d):f.css(a,c)})},f.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=bv(a,"opacity","opacity");return c===""?"1":c}return a.style.opacity}}},cssNumber:{fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":f.support.cssFloat?"cssFloat":"styleFloat"},style:function(a,c,d,e){if(!!a&&a.nodeType!==3&&a.nodeType!==8&&!!a.style){var g,h,i=f.camelCase(c),j=a.style,k=f.cssHooks[i];c=f.cssProps[i]||i;if(d===b){if(k&&"get"in k&&(g=k.get(a,!1,e))!==b)return g;return j[c]}h=typeof d,h==="string"&&(g=br.exec(d))&&(d=+(g[1]+1)*+g[2]+parseFloat(f.css(a,c)),h="number");if(d==null||h==="number"&&isNaN(d))return;h==="number"&&!f.cssNumber[i]&&(d+="px");if(!k||!("set"in k)||(d=k.set(a,d))!==b)try{j[c]=d}catch(l){}}},css:function(a,c,d){var e,g;c=f.camelCase(c),g=f.cssHooks[c],c=f.cssProps[c]||c,c==="cssFloat"&&(c="float");if(g&&"get"in g&&(e=g.get(a,!0,d))!==b)return e;if(bv)return bv(a,c)},swap:function(a,b,c){var d={};for(var e in b)d[e]=a.style[e],a.style[e]=b[e];c.call(a);for(e in b)a.style[e]=d[e]}}),f.curCSS=f.css,f.each(["height","width"],function(a,b){f.cssHooks[b]={get:function(a,c,d){var e;if(c){if(a.offsetWidth!==0)return by(a,b,d);f.swap(a,bs,function(){e=by(a,b,d)});return e}},set:function(a,b){if(!bp.test(b))return b;b=parseFloat(b);if(b>=0)return b+"px"}}}),f.support.opacity||(f.cssHooks.opacity={get:function(a,b){return bn.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?parseFloat(RegExp.$1)/100+"":b?"1":""},set:function(a,b){var c=a.style,d=a.currentStyle,e=f.isNaN(b)?"":"alpha(opacity="+b*100+")",g=d&&d.filter||c.filter||"";c.zoom=1;if(b>=1&&f.trim(g.replace(bm,""))===""){c.removeAttribute("filter");if(d&&!d.filter)return}c.filter=bm.test(g)?g.replace(bm,e):g+" "+e}}),f(function(){f.support.reliableMarginRight||(f.cssHooks.marginRight={get:function(a,b){var c;f.swap(a,{display:"inline-block"},function(){b?c=bv(a,"margin-right","marginRight"):c=a.style.marginRight});return c}})}),c.defaultView&&c.defaultView.getComputedStyle&&(bw=function(a,c){var d,e,g;c=c.replace(bo,"-$1").toLowerCase();if(!(e=a.ownerDocument.defaultView))return b;if(g=e.getComputedStyle(a,null))d=g.getPropertyValue(c),d===""&&!f.contains(a.ownerDocument.documentElement,a)&&(d=f.style(a,c));return d}),c.documentElement.currentStyle&&(bx=function(a,b){var c,d=a.currentStyle&&a.currentStyle[b],e=a.runtimeStyle&&a.runtimeStyle[b],f=a.style;!bp.test(d)&&bq.test(d)&&(c=f.left,e&&(a.runtimeStyle.left=a.currentStyle.left),f.left=b==="fontSize"?"1em":d||0,d=f.pixelLeft+"px",f.left=c,e&&(a.runtimeStyle.left=e));return d===""?"auto":d}),bv=bw||bx,f.expr&&f.expr.filters&&(f.expr.filters.hidden=function(a){var b=a.offsetWidth,c=a.offsetHeight;return b===0&&c===0||!f.support.reliableHiddenOffsets&&(a.style.display||f.css(a,"display"))==="none"},f.expr.filters.visible=function(a){return!f.expr.filters.hidden(a)});var bz=/%20/g,bA=/\[\]$/,bB=/\r?\n/g,bC=/#.*$/,bD=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,bE=/^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,bF=/^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,bG=/^(?:GET|HEAD)$/,bH=/^\/\//,bI=/\?/,bJ=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,bK=/^(?:select|textarea)/i,bL=/\s+/,bM=/([?&])_=[^&]*/,bN=/^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,bO=f.fn.load,bP={},bQ={},bR,bS,bT=["*/"]+["*"];try{bR=e.href}catch(bU){bR=c.createElement("a"),bR.href="",bR=bR.href}bS=bN.exec(bR.toLowerCase())||[],f.fn.extend({load:function(a,c,d){if(typeof a!="string"&&bO)return bO.apply(this,arguments);if(!this.length)return this;var e=a.indexOf(" ");if(e>=0){var g=a.slice(e,a.length);a=a.slice(0,e)}var h="GET";c&&(f.isFunction(c)?(d=c,c=b):typeof c=="object"&&(c=f.param(c,f.ajaxSettings.traditional),h="POST"));var i=this;f.ajax({url:a,type:h,dataType:"html",data:c,complete:function(a,b,c){c=a.responseText,a.isResolved()&&(a.done(function(a){c=a}),i.html(g?f("<div>").append(c.replace(bJ,"")).find(g):c)),d&&i.each(d,[c,b,a])}});return this},serialize:function(){return f.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?f.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||bK.test(this.nodeName)||bE.test(this.type))}).map(function(a,b){var c=f(this).val();return c==null?null:f.isArray(c)?f.map(c,function(a,c){return{name:b.name,value:a.replace(bB,"\r\n")}}):{name:b.name,value:c.replace(bB,"\r\n")}}).get()}}),f.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(a,b){f.fn[b]=function(a){return this.bind(b,a)}}),f.each(["get","post"],function(a,c){f[c]=function(a,d,e,g){f.isFunction(d)&&(g=g||e,e=d,d=b);return f.ajax({type:c,url:a,data:d,success:e,dataType:g})}}),f.extend({getScript:function(a,c){return f.get(a,b,c,"script")},getJSON:function(a,b,c){return f.get(a,b,c,"json")},ajaxSetup:function(a,b){b?bX(a,f.ajaxSettings):(b=a,a=f.ajaxSettings),bX(a,b);return a},ajaxSettings:{url:bR,isLocal:bF.test(bS[1]),global:!0,type:"GET",contentType:"application/x-www-form-urlencoded",processData:!0,async:!0,accepts:{xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript","*":bT},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":a.String,"text html":!0,"text json":f.parseJSON,"text xml":f.parseXML},flatOptions:{context:!0,url:!0}},ajaxPrefilter:bV(bP),ajaxTransport:bV(bQ),ajax:function(a,c){function w(a,c,l,m){if(s!==2){s=2,q&&clearTimeout(q),p=b,n=m||"",v.readyState=a>0?4:0;var o,r,u,w=c,x=l?bZ(d,v,l):b,y,z;if(a>=200&&a<300||a===304){if(d.ifModified){if(y=v.getResponseHeader("Last-Modified"))f.lastModified[k]=y;if(z=v.getResponseHeader("Etag"))f.etag[k]=z}if(a===304)w="notmodified",o=!0;else try{r=b$(d,x),w="success",o=!0}catch(A){w="parsererror",u=A}}else{u=w;if(!w||a)w="error",a<0&&(a=0)}v.status=a,v.statusText=""+(c||w),o?h.resolveWith(e,[r,w,v]):h.rejectWith(e,[v,w,u]),v.statusCode(j),j=b,t&&g.trigger("ajax"+(o?"Success":"Error"),[v,d,o?r:u]),i.resolveWith(e,[v,w]),t&&(g.trigger("ajaxComplete",[v,d]),--f.active||f.event.trigger("ajaxStop"))}}typeof a=="object"&&(c=a,a=b),c=c||{};var d=f.ajaxSetup({},c),e=d.context||d,g=e!==d&&(e.nodeType||e instanceof f)?f(e):f.event,h=f.Deferred(),i=f._Deferred(),j=d.statusCode||{},k,l={},m={},n,o,p,q,r,s=0,t,u,v={readyState:0,setRequestHeader:function(a,b){if(!s){var c=a.toLowerCase();a=m[c]=m[c]||a,l[a]=b}return this},getAllResponseHeaders:function(){return s===2?n:null},getResponseHeader:function(a){var c;if(s===2){if(!o){o={};while(c=bD.exec(n))o[c[1].toLowerCase()]=c[2]}c=o[a.toLowerCase()]}return c===b?null:c},overrideMimeType:function(a){s||(d.mimeType=a);return this},abort:function(a){a=a||"abort",p&&p.abort(a),w(0,a);return this}};h.promise(v),v.success=v.done,v.error=v.fail,v.complete=i.done,v.statusCode=function(a){if(a){var b;if(s<2)for(b in a)j[b]=[j[b],a[b]];else b=a[v.status],v.then(b,b)}return this},d.url=((a||d.url)+"").replace(bC,"").replace(bH,bS[1]+"//"),d.dataTypes=f.trim(d.dataType||"*").toLowerCase().split(bL),d.crossDomain==null&&(r=bN.exec(d.url.toLowerCase()),d.crossDomain=!(!r||r[1]==bS[1]&&r[2]==bS[2]&&(r[3]||(r[1]==="http:"?80:443))==(bS[3]||(bS[1]==="http:"?80:443)))),d.data&&d.processData&&typeof d.data!="string"&&(d.data=f.param(d.data,d.traditional)),bW(bP,d,c,v);if(s===2)return!1;t=d.global,d.type=d.type.toUpperCase(),d.hasContent=!bG.test(d.type),t&&f.active++===0&&f.event.trigger("ajaxStart");if(!d.hasContent){d.data&&(d.url+=(bI.test(d.url)?"&":"?")+d.data,delete d.data),k=d.url;if(d.cache===!1){var x=f.now(),y=d.url.replace(bM,"$1_="+x);d.url=y+(y===d.url?(bI.test(d.url)?"&":"?")+"_="+x:"")}}(d.data&&d.hasContent&&d.contentType!==!1||c.contentType)&&v.setRequestHeader("Content-Type",d.contentType),d.ifModified&&(k=k||d.url,f.lastModified[k]&&v.setRequestHeader("If-Modified-Since",f.lastModified[k]),f.etag[k]&&v.setRequestHeader("If-None-Match",f.etag[k])),v.setRequestHeader("Accept",d.dataTypes[0]&&d.accepts[d.dataTypes[0]]?d.accepts[d.dataTypes[0]]+(d.dataTypes[0]!=="*"?", "+bT+"; q=0.01":""):d.accepts["*"]);for(u in d.headers)v.setRequestHeader(u,d.headers[u]);if(d.beforeSend&&(d.beforeSend.call(e,v,d)===!1||s===2)){v.abort();return!1}for(u in{success:1,error:1,complete:1})v[u](d[u]);p=bW(bQ,d,c,v);if(!p)w(-1,"No Transport");else{v.readyState=1,t&&g.trigger("ajaxSend",[v,d]),d.async&&d.timeout>0&&(q=setTimeout(function(){v.abort("timeout")},d.timeout));try{s=1,p.send(l,w)}catch(z){s<2?w(-1,z):f.error(z)}}return v},param:function(a,c){var d=[],e=function(a,b){b=f.isFunction(b)?b():b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};c===b&&(c=f.ajaxSettings.traditional);if(f.isArray(a)||a.jquery&&!f.isPlainObject(a))f.each(a,function(){e(this.name,this.value)});else for(var g in a)bY(g,a[g],c,e);return d.join("&").replace(bz,"+")}}),f.extend({active:0,lastModified:{},etag:{}});var b_=f.now(),ca=/(\=)\?(&|$)|\?\?/i;f.ajaxSetup({jsonp:"callback",jsonpCallback:function(){return f.expando+"_"+b_++}}),f.ajaxPrefilter("json jsonp",function(b,c,d){var e=b.contentType==="application/x-www-form-urlencoded"&&typeof b.data=="string";if(b.dataTypes[0]==="jsonp"||b.jsonp!==!1&&(ca.test(b.url)||e&&ca.test(b.data))){var g,h=b.jsonpCallback=f.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,i=a[h],j=b.url,k=b.data,l="$1"+h+"$2";b.jsonp!==!1&&(j=j.replace(ca,l),b.url===j&&(e&&(k=k.replace(ca,l)),b.data===k&&(j+=(/\?/.test(j)?"&":"?")+b.jsonp+"="+h))),b.url=j,b.data=k,a[h]=function(a){g=[a]},d.always(function(){a[h]=i,g&&f.isFunction(i)&&a[h](g[0])}),b.converters["script json"]=function(){g||f.error(h+" was not called");return g[0]},b.dataTypes[0]="json";return"script"}}),f.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/javascript|ecmascript/},converters:{"text script":function(a){f.globalEval(a);return a}}}),f.ajaxPrefilter("script",function(a){a.cache===b&&(a.cache=!1),a.crossDomain&&(a.type="GET",a.global=!1)}),f.ajaxTransport("script",function(a){if(a.crossDomain){var d,e=c.head||c.getElementsByTagName("head")[0]||c.documentElement;return{send:function(f,g){d=c.createElement("script"),d.async="async",a.scriptCharset&&(d.charset=a.scriptCharset),d.src=a.url,d.onload=d.onreadystatechange=function(a,c){if(c||!d.readyState||/loaded|complete/.test(d.readyState))d.onload=d.onreadystatechange=null,e&&d.parentNode&&e.removeChild(d),d=b,c||g(200,"success")},e.insertBefore(d,e.firstChild)},abort:function(){d&&d.onload(0,1)}}}});var cb=a.ActiveXObject?function(){for(var a in cd)cd[a](0,1)}:!1,cc=0,cd;f.ajaxSettings.xhr=a.ActiveXObject?function(){return!this.isLocal&&ce()||cf()}:ce,function(a){f.extend(f.support,{ajax:!!a,cors:!!a&&"withCredentials"in a})}(f.ajaxSettings.xhr()),f.support.ajax&&f.ajaxTransport(function(c){if(!c.crossDomain||f.support.cors){var d;return{send:function(e,g){var h=c.xhr(),i,j;c.username?h.open(c.type,c.url,c.async,c.username,c.password):h.open(c.type,c.url,c.async);if(c.xhrFields)for(j in c.xhrFields)h[j]=c.xhrFields[j];c.mimeType&&h.overrideMimeType&&h.overrideMimeType(c.mimeType),!c.crossDomain&&!e["X-Requested-With"]&&(e["X-Requested-With"]="XMLHttpRequest");try{for(j in e)h.setRequestHeader(j,e[j])}catch(k){}h.send(c.hasContent&&c.data||null),d=function(a,e){var j,k,l,m,n;try{if(d&&(e||h.readyState===4)){d=b,i&&(h.onreadystatechange=f.noop,cb&&delete cd[i]);if(e)h.readyState!==4&&h.abort();else{j=h.status,l=h.getAllResponseHeaders(),m={},n=h.responseXML,n&&n.documentElement&&(m.xml=n),m.text=h.responseText;try{k=h.statusText}catch(o){k=""}!j&&c.isLocal&&!c.crossDomain?j=m.text?200:404:j===1223&&(j=204)}}}catch(p){e||g(-1,p)}m&&g(j,k,m,l)},!c.async||h.readyState===4?d():(i=++cc,cb&&(cd||(cd={},f(a).unload(cb)),cd[i]=d),h.onreadystatechange=d)},abort:function(){d&&d(0,1)}}}});var cg={},ch,ci,cj=/^(?:toggle|show|hide)$/,ck=/^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,cl,cm=[["height","marginTop","marginBottom","paddingTop","paddingBottom"],["width","marginLeft","marginRight","paddingLeft","paddingRight"],["opacity"]],cn;f.fn.extend({show:function(a,b,c){var d,e;if(a||a===0)return this.animate(cq("show",3),a,b,c);for(var g=0,h=this.length;g<h;g++)d=this[g],d.style&&(e=d.style.display,!f._data(d,"olddisplay")&&e==="none"&&(e=d.style.display=""),e===""&&f.css(d,"display")==="none"&&f._data(d,"olddisplay",cr(d.nodeName)));for(g=0;g<h;g++){d=this[g];if(d.style){e=d.style.display;if(e===""||e==="none")d.style.display=f._data(d,"olddisplay")||""}}return this},hide:function(a,b,c){if(a||a===0)return this.animate(cq("hide",3),a,b,c);for(var d=0,e=this.length;d<e;d++)if(this[d].style){var g=f.css(this[d],"display");g!=="none"&&!f._data(this[d],"olddisplay")&&f._data(this[d],"olddisplay",g)}for(d=0;d<e;d++)this[d].style&&(this[d].style.display="none");return this},_toggle:f.fn.toggle,toggle:function(a,b,c){var d=typeof a=="boolean";f.isFunction(a)&&f.isFunction(b)?this._toggle.apply(this,arguments):a==null||d?this.each(function(){var b=d?a:f(this).is(":hidden");f(this)[b?"show":"hide"]()}):this.animate(cq("toggle",3),a,b,c);return this},fadeTo:function(a,b,c,d){return this.filter(":hidden").css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=f.speed(b,c,d);if(f.isEmptyObject(a))return this.each(e.complete,[!1]);a=f.extend({},a);return this[e.queue===!1?"each":"queue"](function(){e.queue===!1&&f._mark(this);var b=f.extend({},e),c=this.nodeType===1,d=c&&f(this).is(":hidden"),g,h,i,j,k,l,m,n,o;b.animatedProperties={};for(i in a){g=f.camelCase(i),i!==g&&(a[g]=a[i],delete a[i]),h=a[g],f.isArray(h)?(b.animatedProperties[g]=h[1],h=a[g]=h[0]):b.animatedProperties[g]=b.specialEasing&&b.specialEasing[g]||b.easing||"swing";if(h==="hide"&&d||h==="show"&&!d)return b.complete.call(this);c&&(g==="height"||g==="width")&&(b.overflow=[this.style.overflow,this.style.overflowX,this.style.overflowY],f.css(this,"display")==="inline"&&f.css(this,"float")==="none"&&(f.support.inlineBlockNeedsLayout?(j=cr(this.nodeName),j==="inline"?this.style.display="inline-block":(this.style.display="inline",this.style.zoom=1)):this.style.display="inline-block"))}b.overflow!=null&&(this.style.overflow="hidden");for(i in a)k=new f.fx(this,b,i),h=a[i],cj.test(h)?k[h==="toggle"?d?"show":"hide":h]():(l=ck.exec(h),m=k.cur(),l?(n=parseFloat(l[2]),o=l[3]||(f.cssNumber[i]?"":"px"),o!=="px"&&(f.style(this,i,(n||1)+o),m=(n||1)/k.cur()*m,f.style(this,i,m+o)),l[1]&&(n=(l[1]==="-="?-1:1)*n+m),k.custom(m,n,o)):k.custom(m,h,""));return!0})},stop:function(a,b){a&&this.queue([]),this.each(function(){var a=f.timers,c=a.length;b||f._unmark(!0,this);while(c--)a[c].elem===this&&(b&&a[c](!0),a.splice(c,1))}),b||this.dequeue();return this}}),f.each({slideDown:cq("show",1),slideUp:cq("hide",1),slideToggle:cq("toggle",1),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){f.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),f.extend({speed:function(a,b,c){var d=a&&typeof a=="object"?f.extend({},a):{complete:c||!c&&b||f.isFunction(a)&&a,duration:a,easing:c&&b||b&&!f.isFunction(b)&&b};d.duration=f.fx.off?0:typeof d.duration=="number"?d.duration:d.duration in f.fx.speeds?f.fx.speeds[d.duration]:f.fx.speeds._default,d.old=d.complete,d.complete=function(a){f.isFunction(d.old)&&d.old.call(this),d.queue!==!1?f.dequeue(this):a!==!1&&f._unmark(this)};return d},easing:{linear:function(a,b,c,d){return c+d*a},swing:function(a,b,c,d){return(-Math.cos(a*Math.PI)/2+.5)*d+c}},timers:[],fx:function(a,b,c){this.options=b,this.elem=a,this.prop=c,b.orig=b.orig||{}}}),f.fx.prototype={update:function(){this.options.step&&this.options.step.call(this.elem,this.now,this),(f.fx.step[this.prop]||f.fx.step._default)(this)},cur:function(){if(this.elem[this.prop]!=null&&(!this.elem.style||this.elem.style[this.prop]==null))return this.elem[this.prop];var a,b=f.css(this.elem,this.prop);return isNaN(a=parseFloat(b))?!b||b==="auto"?0:b:a},custom:function(a,b,c){function g(a){return d.step(a)}var d=this,e=f.fx;this.startTime=cn||co(),this.start=a,this.end=b,this.unit=c||this.unit||(f.cssNumber[this.prop]?"":"px"),this.now=this.start,this.pos=this.state=0,g.elem=this.elem,g()&&f.timers.push(g)&&!cl&&(cl=setInterval(e.tick,e.interval))},show:function(){this.options.orig[this.prop]=f.style(this.elem,this.prop),this.options.show=!0,this.custom(this.prop==="width"||this.prop==="height"?1:0,this.cur()),f(this.elem).show()},hide:function(){this.options.orig[this.prop]=f.style(this.elem,this.prop),this.options.hide=!0,this.custom(this.cur(),0)},step:function(a){var b=cn||co(),c=!0,d=this.elem,e=this.options,g,h;if(a||b>=e.duration+this.startTime){this.now=this.end,this.pos=this.state=1,this.update(),e.animatedProperties[this.prop]=!0;for(g in e.animatedProperties)e.animatedProperties[g]!==!0&&(c=!1);if(c){e.overflow!=null&&!f.support.shrinkWrapBlocks&&f.each(["","X","Y"],function(a,b){d.style["overflow"+b]=e.overflow[a]}),e.hide&&f(d).hide();if(e.hide||e.show)for(var i in e.animatedProperties)f.style(d,i,e.orig[i]);e.complete.call(d)}return!1}e.duration==Infinity?this.now=b:(h=b-this.startTime,this.state=h/e.duration,this.pos=f.easing[e.animatedProperties[this.prop]](this.state,h,0,1,e.duration),this.now=this.start+(this.end-this.start)*this.pos),this.update();return!0}},f.extend(f.fx,{tick:function(){for(var a=f.timers,b=0;b<a.length;++b)a[b]()||a.splice(b--,1);a.length||f.fx.stop()},interval:13,stop:function(){clearInterval(cl),cl=null},speeds:{slow:600,fast:200,_default:400},step:{opacity:function(a){f.style(a.elem,"opacity",a.now)},_default:function(a){a.elem.style&&a.elem.style[a.prop]!=null?a.elem.style[a.prop]=(a.prop==="width"||a.prop==="height"?Math.max(0,a.now):a.now)+a.unit:a.elem[a.prop]=a.now}}}),f.expr&&f.expr.filters&&(f.expr.filters.animated=function(a){return f.grep(f.timers,function(b){return a===b.elem}).length});var cs=/^t(?:able|d|h)$/i,ct=/^(?:body|html)$/i;"getBoundingClientRect"in c.documentElement?f.fn.offset=function(a){var b=this[0],c;if(a)return this.each(function(b){f.offset.setOffset(this,a,b)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return f.offset.bodyOffset(b);try{c=b.getBoundingClientRect()}catch(d){}var e=b.ownerDocument,g=e.documentElement;if(!c||!f.contains(g,b))return c?{top:c.top,left:c.left}:{top:0,left:0};var h=e.body,i=cu(e),j=g.clientTop||h.clientTop||0,k=g.clientLeft||h.clientLeft||0,l=i.pageYOffset||f.support.boxModel&&g.scrollTop||h.scrollTop,m=i.pageXOffset||f.support.boxModel&&g.scrollLeft||h.scrollLeft,n=c.top+l-j,o=c.left+m-k;return{top:n,left:o}}:f.fn.offset=function(a){var b=this[0];if(a)return this.each(function(b){f.offset.setOffset(this,a,b)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return f.offset.bodyOffset(b);f.offset.initialize();var c,d=b.offsetParent,e=b,g=b.ownerDocument,h=g.documentElement,i=g.body,j=g.defaultView,k=j?j.getComputedStyle(b,null):b.currentStyle,l=b.offsetTop,m=b.offsetLeft;while((b=b.parentNode)&&b!==i&&b!==h){if(f.offset.supportsFixedPosition&&k.position==="fixed")break;c=j?j.getComputedStyle(b,null):b.currentStyle,l-=b.scrollTop,m-=b.scrollLeft,b===d&&(l+=b.offsetTop,m+=b.offsetLeft,f.offset.doesNotAddBorder&&(!f.offset.doesAddBorderForTableAndCells||!cs.test(b.nodeName))&&(l+=parseFloat(c.borderTopWidth)||0,m+=parseFloat(c.borderLeftWidth)||0),e=d,d=b.offsetParent),f.offset.subtractsBorderForOverflowNotVisible&&c.overflow!=="visible"&&(l+=parseFloat(c.borderTopWidth)||0,m+=parseFloat(c.borderLeftWidth)||0),k=c}if(k.position==="relative"||k.position==="static")l+=i.offsetTop,m+=i.offsetLeft;f.offset.supportsFixedPosition&&k.position==="fixed"&&(l+=Math.max(h.scrollTop,i.scrollTop),m+=Math.max(h.scrollLeft,i.scrollLeft));return{top:l,left:m}},f.offset={initialize:function(){var a=c.body,b=c.createElement("div"),d,e,g,h,i=parseFloat(f.css(a,"marginTop"))||0,j="<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";f.extend(b.style,{position:"absolute",top:0,left:0,margin:0,border:0,width:"1px",height:"1px",visibility:"hidden"}),b.innerHTML=j,a.insertBefore(b,a.firstChild),d=b.firstChild,e=d.firstChild,h=d.nextSibling.firstChild.firstChild,this.doesNotAddBorder=e.offsetTop!==5,this.doesAddBorderForTableAndCells=h.offsetTop===5,e.style.position="fixed",e.style.top="20px",this.supportsFixedPosition=e.offsetTop===20||e.offsetTop===15,e.style.position=e.style.top="",d.style.overflow="hidden",d.style.position="relative",this.subtractsBorderForOverflowNotVisible=e.offsetTop===-5,this.doesNotIncludeMarginInBodyOffset=a.offsetTop!==i,a.removeChild(b),f.offset.initialize=f.noop},bodyOffset:function(a){var b=a.offsetTop,c=a.offsetLeft;f.offset.initialize(),f.offset.doesNotIncludeMarginInBodyOffset&&(b+=parseFloat(f.css(a,"marginTop"))||0,c+=parseFloat(f.css(a,"marginLeft"))||0);return{top:b,left:c}},setOffset:function(a,b,c){var d=f.css(a,"position");d==="static"&&(a.style.position="relative");var e=f(a),g=e.offset(),h=f.css(a,"top"),i=f.css(a,"left"),j=(d==="absolute"||d==="fixed")&&f.inArray("auto",[h,i])>-1,k={},l={},m,n;j?(l=e.position(),m=l.top,n=l.left):(m=parseFloat(h)||0,n=parseFloat(i)||0),f.isFunction(b)&&(b=b.call(a,c,g)),b.top!=null&&(k.top=b.top-g.top+m),b.left!=null&&(k.left=b.left-g.left+n),"using"in b?b.using.call(a,k):e.css(k)}},f.fn.extend({position:function(){if(!this[0])return null;var a=this[0],b=this.offsetParent(),c=this.offset(),d=ct.test(b[0].nodeName)?{top:0,left:0}:b.offset();c.top-=parseFloat(f.css(a,"marginTop"))||0,c.left-=parseFloat(f.css(a,"marginLeft"))||0,d.top+=parseFloat(f.css(b[0],"borderTopWidth"))||0,d.left+=parseFloat(f.css(b[0],"borderLeftWidth"))||0;return{top:c.top-d.top,left:c.left-d.left}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||c.body;while(a&&!ct.test(a.nodeName)&&f.css(a,"position")==="static")a=a.offsetParent;return a})}}),f.each(["Left","Top"],function(a,c){var d="scroll"+c;f.fn[d]=function(c){var e,g;if(c===b){e=this[0];if(!e)return null;g=cu(e);return g?"pageXOffset"in g?g[a?"pageYOffset":"pageXOffset"]:f.support.boxModel&&g.document.documentElement[d]||g.document.body[d]:e[d]}return this.each(function(){g=cu(this),g?g.scrollTo(a?f(g).scrollLeft():c,a?c:f(g).scrollTop()):this[d]=c})}}),f.each(["Height","Width"],function(a,c){var d=c.toLowerCase();f.fn["inner"+c]=function(){var a=this[0];return a&&a.style?parseFloat(f.css(a,d,"padding")):null},f.fn["outer"+c]=function(a){var b=this[0];return b&&b.style?parseFloat(f.css(b,d,a?"margin":"border")):null},f.fn[d]=function(a){var e=this[0];if(!e)return a==null?null:this;if(f.isFunction(a))return this.each(function(b){var c=f(this);c[d](a.call(this,b,c[d]()))});if(f.isWindow(e)){var g=e.document.documentElement["client"+c],h=e.document.body;return e.document.compatMode==="CSS1Compat"&&g||h&&h["client"+c]||g}if(e.nodeType===9)return Math.max(e.documentElement["client"+c],e.body["scroll"+c],e.documentElement["scroll"+c],e.body["offset"+c],e.documentElement["offset"+c]);if(a===b){var i=f.css(e,d),j=parseFloat(i);return f.isNaN(j)?i:j}return this.css(d,typeof a=="string"?a:a+"px")}}),a.jQuery=a.$=f})(window);/*! jQuery UI - v1.10.3 - 2013-07-01
* http://jqueryui.com
* Includes: jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.mouse.js, jquery.ui.position.js, jquery.ui.draggable.js, jquery.ui.droppable.js, jquery.ui.resizable.js, jquery.ui.selectable.js, jquery.ui.sortable.js, jquery.ui.accordion.js, jquery.ui.autocomplete.js, jquery.ui.button.js, jquery.ui.datepicker.js, jquery.ui.dialog.js, jquery.ui.menu.js, jquery.ui.progressbar.js, jquery.ui.slider.js, jquery.ui.spinner.js, jquery.ui.tabs.js, jquery.ui.tooltip.js, jquery.ui.effect.js, jquery.ui.effect-blind.js, jquery.ui.effect-bounce.js, jquery.ui.effect-clip.js, jquery.ui.effect-drop.js, jquery.ui.effect-explode.js, jquery.ui.effect-fade.js, jquery.ui.effect-fold.js, jquery.ui.effect-highlight.js, jquery.ui.effect-pulsate.js, jquery.ui.effect-scale.js, jquery.ui.effect-shake.js, jquery.ui.effect-slide.js, jquery.ui.effect-transfer.js
* Copyright 2013 jQuery Foundation and other contributors Licensed MIT */

(function(e,t){function i(t,i){var a,n,r,o=t.nodeName.toLowerCase();return"area"===o?(a=t.parentNode,n=a.name,t.href&&n&&"map"===a.nodeName.toLowerCase()?(r=e("img[usemap=#"+n+"]")[0],!!r&&s(r)):!1):(/input|select|textarea|button|object/.test(o)?!t.disabled:"a"===o?t.href||i:i)&&s(t)}function s(t){return e.expr.filters.visible(t)&&!e(t).parents().addBack().filter(function(){return"hidden"===e.css(this,"visibility")}).length}var a=0,n=/^ui-id-\d+$/;e.ui=e.ui||{},e.extend(e.ui,{version:"1.10.3",keyCode:{BACKSPACE:8,COMMA:188,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SPACE:32,TAB:9,UP:38}}),e.fn.extend({focus:function(t){return function(i,s){return"number"==typeof i?this.each(function(){var t=this;setTimeout(function(){e(t).focus(),s&&s.call(t)},i)}):t.apply(this,arguments)}}(e.fn.focus),scrollParent:function(){var t;return t=e.ui.ie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?this.parents().filter(function(){return/(relative|absolute|fixed)/.test(e.css(this,"position"))&&/(auto|scroll)/.test(e.css(this,"overflow")+e.css(this,"overflow-y")+e.css(this,"overflow-x"))}).eq(0):this.parents().filter(function(){return/(auto|scroll)/.test(e.css(this,"overflow")+e.css(this,"overflow-y")+e.css(this,"overflow-x"))}).eq(0),/fixed/.test(this.css("position"))||!t.length?e(document):t},zIndex:function(i){if(i!==t)return this.css("zIndex",i);if(this.length)for(var s,a,n=e(this[0]);n.length&&n[0]!==document;){if(s=n.css("position"),("absolute"===s||"relative"===s||"fixed"===s)&&(a=parseInt(n.css("zIndex"),10),!isNaN(a)&&0!==a))return a;n=n.parent()}return 0},uniqueId:function(){return this.each(function(){this.id||(this.id="ui-id-"+ ++a)})},removeUniqueId:function(){return this.each(function(){n.test(this.id)&&e(this).removeAttr("id")})}}),e.extend(e.expr[":"],{data:e.expr.createPseudo?e.expr.createPseudo(function(t){return function(i){return!!e.data(i,t)}}):function(t,i,s){return!!e.data(t,s[3])},focusable:function(t){return i(t,!isNaN(e.attr(t,"tabindex")))},tabbable:function(t){var s=e.attr(t,"tabindex"),a=isNaN(s);return(a||s>=0)&&i(t,!a)}}),e("<a>").outerWidth(1).jquery||e.each(["Width","Height"],function(i,s){function a(t,i,s,a){return e.each(n,function(){i-=parseFloat(e.css(t,"padding"+this))||0,s&&(i-=parseFloat(e.css(t,"border"+this+"Width"))||0),a&&(i-=parseFloat(e.css(t,"margin"+this))||0)}),i}var n="Width"===s?["Left","Right"]:["Top","Bottom"],r=s.toLowerCase(),o={innerWidth:e.fn.innerWidth,innerHeight:e.fn.innerHeight,outerWidth:e.fn.outerWidth,outerHeight:e.fn.outerHeight};e.fn["inner"+s]=function(i){return i===t?o["inner"+s].call(this):this.each(function(){e(this).css(r,a(this,i)+"px")})},e.fn["outer"+s]=function(t,i){return"number"!=typeof t?o["outer"+s].call(this,t):this.each(function(){e(this).css(r,a(this,t,!0,i)+"px")})}}),e.fn.addBack||(e.fn.addBack=function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}),e("<a>").data("a-b","a").removeData("a-b").data("a-b")&&(e.fn.removeData=function(t){return function(i){return arguments.length?t.call(this,e.camelCase(i)):t.call(this)}}(e.fn.removeData)),e.ui.ie=!!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()),e.support.selectstart="onselectstart"in document.createElement("div"),e.fn.extend({disableSelection:function(){return this.bind((e.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(e){e.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")}}),e.extend(e.ui,{plugin:{add:function(t,i,s){var a,n=e.ui[t].prototype;for(a in s)n.plugins[a]=n.plugins[a]||[],n.plugins[a].push([i,s[a]])},call:function(e,t,i){var s,a=e.plugins[t];if(a&&e.element[0].parentNode&&11!==e.element[0].parentNode.nodeType)for(s=0;a.length>s;s++)e.options[a[s][0]]&&a[s][1].apply(e.element,i)}},hasScroll:function(t,i){if("hidden"===e(t).css("overflow"))return!1;var s=i&&"left"===i?"scrollLeft":"scrollTop",a=!1;return t[s]>0?!0:(t[s]=1,a=t[s]>0,t[s]=0,a)}})})(jQuery);(function(e,t){var i=0,s=Array.prototype.slice,n=e.cleanData;e.cleanData=function(t){for(var i,s=0;null!=(i=t[s]);s++)try{e(i).triggerHandler("remove")}catch(a){}n(t)},e.widget=function(i,s,n){var a,r,o,h,l={},u=i.split(".")[0];i=i.split(".")[1],a=u+"-"+i,n||(n=s,s=e.Widget),e.expr[":"][a.toLowerCase()]=function(t){return!!e.data(t,a)},e[u]=e[u]||{},r=e[u][i],o=e[u][i]=function(e,i){return this._createWidget?(arguments.length&&this._createWidget(e,i),t):new o(e,i)},e.extend(o,r,{version:n.version,_proto:e.extend({},n),_childConstructors:[]}),h=new s,h.options=e.widget.extend({},h.options),e.each(n,function(i,n){return e.isFunction(n)?(l[i]=function(){var e=function(){return s.prototype[i].apply(this,arguments)},t=function(e){return s.prototype[i].apply(this,e)};return function(){var i,s=this._super,a=this._superApply;return this._super=e,this._superApply=t,i=n.apply(this,arguments),this._super=s,this._superApply=a,i}}(),t):(l[i]=n,t)}),o.prototype=e.widget.extend(h,{widgetEventPrefix:r?h.widgetEventPrefix:i},l,{constructor:o,namespace:u,widgetName:i,widgetFullName:a}),r?(e.each(r._childConstructors,function(t,i){var s=i.prototype;e.widget(s.namespace+"."+s.widgetName,o,i._proto)}),delete r._childConstructors):s._childConstructors.push(o),e.widget.bridge(i,o)},e.widget.extend=function(i){for(var n,a,r=s.call(arguments,1),o=0,h=r.length;h>o;o++)for(n in r[o])a=r[o][n],r[o].hasOwnProperty(n)&&a!==t&&(i[n]=e.isPlainObject(a)?e.isPlainObject(i[n])?e.widget.extend({},i[n],a):e.widget.extend({},a):a);return i},e.widget.bridge=function(i,n){var a=n.prototype.widgetFullName||i;e.fn[i]=function(r){var o="string"==typeof r,h=s.call(arguments,1),l=this;return r=!o&&h.length?e.widget.extend.apply(null,[r].concat(h)):r,o?this.each(function(){var s,n=e.data(this,a);return n?e.isFunction(n[r])&&"_"!==r.charAt(0)?(s=n[r].apply(n,h),s!==n&&s!==t?(l=s&&s.jquery?l.pushStack(s.get()):s,!1):t):e.error("no such method '"+r+"' for "+i+" widget instance"):e.error("cannot call methods on "+i+" prior to initialization; "+"attempted to call method '"+r+"'")}):this.each(function(){var t=e.data(this,a);t?t.option(r||{})._init():e.data(this,a,new n(r,this))}),l}},e.Widget=function(){},e.Widget._childConstructors=[],e.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{disabled:!1,create:null},_createWidget:function(t,s){s=e(s||this.defaultElement||this)[0],this.element=e(s),this.uuid=i++,this.eventNamespace="."+this.widgetName+this.uuid,this.options=e.widget.extend({},this.options,this._getCreateOptions(),t),this.bindings=e(),this.hoverable=e(),this.focusable=e(),s!==this&&(e.data(s,this.widgetFullName,this),this._on(!0,this.element,{remove:function(e){e.target===s&&this.destroy()}}),this.document=e(s.style?s.ownerDocument:s.document||s),this.window=e(this.document[0].defaultView||this.document[0].parentWindow)),this._create(),this._trigger("create",null,this._getCreateEventData()),this._init()},_getCreateOptions:e.noop,_getCreateEventData:e.noop,_create:e.noop,_init:e.noop,destroy:function(){this._destroy(),this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(e.camelCase(this.widgetFullName)),this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName+"-disabled "+"ui-state-disabled"),this.bindings.unbind(this.eventNamespace),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")},_destroy:e.noop,widget:function(){return this.element},option:function(i,s){var n,a,r,o=i;if(0===arguments.length)return e.widget.extend({},this.options);if("string"==typeof i)if(o={},n=i.split("."),i=n.shift(),n.length){for(a=o[i]=e.widget.extend({},this.options[i]),r=0;n.length-1>r;r++)a[n[r]]=a[n[r]]||{},a=a[n[r]];if(i=n.pop(),s===t)return a[i]===t?null:a[i];a[i]=s}else{if(s===t)return this.options[i]===t?null:this.options[i];o[i]=s}return this._setOptions(o),this},_setOptions:function(e){var t;for(t in e)this._setOption(t,e[t]);return this},_setOption:function(e,t){return this.options[e]=t,"disabled"===e&&(this.widget().toggleClass(this.widgetFullName+"-disabled ui-state-disabled",!!t).attr("aria-disabled",t),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")),this},enable:function(){return this._setOption("disabled",!1)},disable:function(){return this._setOption("disabled",!0)},_on:function(i,s,n){var a,r=this;"boolean"!=typeof i&&(n=s,s=i,i=!1),n?(s=a=e(s),this.bindings=this.bindings.add(s)):(n=s,s=this.element,a=this.widget()),e.each(n,function(n,o){function h(){return i||r.options.disabled!==!0&&!e(this).hasClass("ui-state-disabled")?("string"==typeof o?r[o]:o).apply(r,arguments):t}"string"!=typeof o&&(h.guid=o.guid=o.guid||h.guid||e.guid++);var l=n.match(/^(\w+)\s*(.*)$/),u=l[1]+r.eventNamespace,c=l[2];c?a.delegate(c,u,h):s.bind(u,h)})},_off:function(e,t){t=(t||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace,e.unbind(t).undelegate(t)},_delay:function(e,t){function i(){return("string"==typeof e?s[e]:e).apply(s,arguments)}var s=this;return setTimeout(i,t||0)},_hoverable:function(t){this.hoverable=this.hoverable.add(t),this._on(t,{mouseenter:function(t){e(t.currentTarget).addClass("ui-state-hover")},mouseleave:function(t){e(t.currentTarget).removeClass("ui-state-hover")}})},_focusable:function(t){this.focusable=this.focusable.add(t),this._on(t,{focusin:function(t){e(t.currentTarget).addClass("ui-state-focus")},focusout:function(t){e(t.currentTarget).removeClass("ui-state-focus")}})},_trigger:function(t,i,s){var n,a,r=this.options[t];if(s=s||{},i=e.Event(i),i.type=(t===this.widgetEventPrefix?t:this.widgetEventPrefix+t).toLowerCase(),i.target=this.element[0],a=i.originalEvent)for(n in a)n in i||(i[n]=a[n]);return this.element.trigger(i,s),!(e.isFunction(r)&&r.apply(this.element[0],[i].concat(s))===!1||i.isDefaultPrevented())}},e.each({show:"fadeIn",hide:"fadeOut"},function(t,i){e.Widget.prototype["_"+t]=function(s,n,a){"string"==typeof n&&(n={effect:n});var r,o=n?n===!0||"number"==typeof n?i:n.effect||i:t;n=n||{},"number"==typeof n&&(n={duration:n}),r=!e.isEmptyObject(n),n.complete=a,n.delay&&s.delay(n.delay),r&&e.effects&&e.effects.effect[o]?s[t](n):o!==t&&s[o]?s[o](n.duration,n.easing,a):s.queue(function(i){e(this)[t](),a&&a.call(s[0]),i()})}})})(jQuery);(function(e){var t=!1;e(document).mouseup(function(){t=!1}),e.widget("ui.mouse",{version:"1.10.3",options:{cancel:"input,textarea,button,select,option",distance:1,delay:0},_mouseInit:function(){var t=this;this.element.bind("mousedown."+this.widgetName,function(e){return t._mouseDown(e)}).bind("click."+this.widgetName,function(i){return!0===e.data(i.target,t.widgetName+".preventClickEvent")?(e.removeData(i.target,t.widgetName+".preventClickEvent"),i.stopImmediatePropagation(),!1):undefined}),this.started=!1},_mouseDestroy:function(){this.element.unbind("."+this.widgetName),this._mouseMoveDelegate&&e(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate)},_mouseDown:function(i){if(!t){this._mouseStarted&&this._mouseUp(i),this._mouseDownEvent=i;var s=this,n=1===i.which,a="string"==typeof this.options.cancel&&i.target.nodeName?e(i.target).closest(this.options.cancel).length:!1;return n&&!a&&this._mouseCapture(i)?(this.mouseDelayMet=!this.options.delay,this.mouseDelayMet||(this._mouseDelayTimer=setTimeout(function(){s.mouseDelayMet=!0},this.options.delay)),this._mouseDistanceMet(i)&&this._mouseDelayMet(i)&&(this._mouseStarted=this._mouseStart(i)!==!1,!this._mouseStarted)?(i.preventDefault(),!0):(!0===e.data(i.target,this.widgetName+".preventClickEvent")&&e.removeData(i.target,this.widgetName+".preventClickEvent"),this._mouseMoveDelegate=function(e){return s._mouseMove(e)},this._mouseUpDelegate=function(e){return s._mouseUp(e)},e(document).bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate),i.preventDefault(),t=!0,!0)):!0}},_mouseMove:function(t){return e.ui.ie&&(!document.documentMode||9>document.documentMode)&&!t.button?this._mouseUp(t):this._mouseStarted?(this._mouseDrag(t),t.preventDefault()):(this._mouseDistanceMet(t)&&this._mouseDelayMet(t)&&(this._mouseStarted=this._mouseStart(this._mouseDownEvent,t)!==!1,this._mouseStarted?this._mouseDrag(t):this._mouseUp(t)),!this._mouseStarted)},_mouseUp:function(t){return e(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate),this._mouseStarted&&(this._mouseStarted=!1,t.target===this._mouseDownEvent.target&&e.data(t.target,this.widgetName+".preventClickEvent",!0),this._mouseStop(t)),!1},_mouseDistanceMet:function(e){return Math.max(Math.abs(this._mouseDownEvent.pageX-e.pageX),Math.abs(this._mouseDownEvent.pageY-e.pageY))>=this.options.distance},_mouseDelayMet:function(){return this.mouseDelayMet},_mouseStart:function(){},_mouseDrag:function(){},_mouseStop:function(){},_mouseCapture:function(){return!0}})})(jQuery);(function(t,e){function i(t,e,i){return[parseFloat(t[0])*(p.test(t[0])?e/100:1),parseFloat(t[1])*(p.test(t[1])?i/100:1)]}function s(e,i){return parseInt(t.css(e,i),10)||0}function n(e){var i=e[0];return 9===i.nodeType?{width:e.width(),height:e.height(),offset:{top:0,left:0}}:t.isWindow(i)?{width:e.width(),height:e.height(),offset:{top:e.scrollTop(),left:e.scrollLeft()}}:i.preventDefault?{width:0,height:0,offset:{top:i.pageY,left:i.pageX}}:{width:e.outerWidth(),height:e.outerHeight(),offset:e.offset()}}t.ui=t.ui||{};var a,o=Math.max,r=Math.abs,h=Math.round,l=/left|center|right/,c=/top|center|bottom/,u=/[\+\-]\d+(\.[\d]+)?%?/,d=/^\w+/,p=/%$/,f=t.fn.position;t.position={scrollbarWidth:function(){if(a!==e)return a;var i,s,n=t("<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),o=n.children()[0];return t("body").append(n),i=o.offsetWidth,n.css("overflow","scroll"),s=o.offsetWidth,i===s&&(s=n[0].clientWidth),n.remove(),a=i-s},getScrollInfo:function(e){var i=e.isWindow?"":e.element.css("overflow-x"),s=e.isWindow?"":e.element.css("overflow-y"),n="scroll"===i||"auto"===i&&e.width<e.element[0].scrollWidth,a="scroll"===s||"auto"===s&&e.height<e.element[0].scrollHeight;return{width:a?t.position.scrollbarWidth():0,height:n?t.position.scrollbarWidth():0}},getWithinInfo:function(e){var i=t(e||window),s=t.isWindow(i[0]);return{element:i,isWindow:s,offset:i.offset()||{left:0,top:0},scrollLeft:i.scrollLeft(),scrollTop:i.scrollTop(),width:s?i.width():i.outerWidth(),height:s?i.height():i.outerHeight()}}},t.fn.position=function(e){if(!e||!e.of)return f.apply(this,arguments);e=t.extend({},e);var a,p,m,g,v,b,_=t(e.of),y=t.position.getWithinInfo(e.within),w=t.position.getScrollInfo(y),x=(e.collision||"flip").split(" "),k={};return b=n(_),_[0].preventDefault&&(e.at="left top"),p=b.width,m=b.height,g=b.offset,v=t.extend({},g),t.each(["my","at"],function(){var t,i,s=(e[this]||"").split(" ");1===s.length&&(s=l.test(s[0])?s.concat(["center"]):c.test(s[0])?["center"].concat(s):["center","center"]),s[0]=l.test(s[0])?s[0]:"center",s[1]=c.test(s[1])?s[1]:"center",t=u.exec(s[0]),i=u.exec(s[1]),k[this]=[t?t[0]:0,i?i[0]:0],e[this]=[d.exec(s[0])[0],d.exec(s[1])[0]]}),1===x.length&&(x[1]=x[0]),"right"===e.at[0]?v.left+=p:"center"===e.at[0]&&(v.left+=p/2),"bottom"===e.at[1]?v.top+=m:"center"===e.at[1]&&(v.top+=m/2),a=i(k.at,p,m),v.left+=a[0],v.top+=a[1],this.each(function(){var n,l,c=t(this),u=c.outerWidth(),d=c.outerHeight(),f=s(this,"marginLeft"),b=s(this,"marginTop"),D=u+f+s(this,"marginRight")+w.width,T=d+b+s(this,"marginBottom")+w.height,C=t.extend({},v),M=i(k.my,c.outerWidth(),c.outerHeight());"right"===e.my[0]?C.left-=u:"center"===e.my[0]&&(C.left-=u/2),"bottom"===e.my[1]?C.top-=d:"center"===e.my[1]&&(C.top-=d/2),C.left+=M[0],C.top+=M[1],t.support.offsetFractions||(C.left=h(C.left),C.top=h(C.top)),n={marginLeft:f,marginTop:b},t.each(["left","top"],function(i,s){t.ui.position[x[i]]&&t.ui.position[x[i]][s](C,{targetWidth:p,targetHeight:m,elemWidth:u,elemHeight:d,collisionPosition:n,collisionWidth:D,collisionHeight:T,offset:[a[0]+M[0],a[1]+M[1]],my:e.my,at:e.at,within:y,elem:c})}),e.using&&(l=function(t){var i=g.left-C.left,s=i+p-u,n=g.top-C.top,a=n+m-d,h={target:{element:_,left:g.left,top:g.top,width:p,height:m},element:{element:c,left:C.left,top:C.top,width:u,height:d},horizontal:0>s?"left":i>0?"right":"center",vertical:0>a?"top":n>0?"bottom":"middle"};u>p&&p>r(i+s)&&(h.horizontal="center"),d>m&&m>r(n+a)&&(h.vertical="middle"),h.important=o(r(i),r(s))>o(r(n),r(a))?"horizontal":"vertical",e.using.call(this,t,h)}),c.offset(t.extend(C,{using:l}))})},t.ui.position={fit:{left:function(t,e){var i,s=e.within,n=s.isWindow?s.scrollLeft:s.offset.left,a=s.width,r=t.left-e.collisionPosition.marginLeft,h=n-r,l=r+e.collisionWidth-a-n;e.collisionWidth>a?h>0&&0>=l?(i=t.left+h+e.collisionWidth-a-n,t.left+=h-i):t.left=l>0&&0>=h?n:h>l?n+a-e.collisionWidth:n:h>0?t.left+=h:l>0?t.left-=l:t.left=o(t.left-r,t.left)},top:function(t,e){var i,s=e.within,n=s.isWindow?s.scrollTop:s.offset.top,a=e.within.height,r=t.top-e.collisionPosition.marginTop,h=n-r,l=r+e.collisionHeight-a-n;e.collisionHeight>a?h>0&&0>=l?(i=t.top+h+e.collisionHeight-a-n,t.top+=h-i):t.top=l>0&&0>=h?n:h>l?n+a-e.collisionHeight:n:h>0?t.top+=h:l>0?t.top-=l:t.top=o(t.top-r,t.top)}},flip:{left:function(t,e){var i,s,n=e.within,a=n.offset.left+n.scrollLeft,o=n.width,h=n.isWindow?n.scrollLeft:n.offset.left,l=t.left-e.collisionPosition.marginLeft,c=l-h,u=l+e.collisionWidth-o-h,d="left"===e.my[0]?-e.elemWidth:"right"===e.my[0]?e.elemWidth:0,p="left"===e.at[0]?e.targetWidth:"right"===e.at[0]?-e.targetWidth:0,f=-2*e.offset[0];0>c?(i=t.left+d+p+f+e.collisionWidth-o-a,(0>i||r(c)>i)&&(t.left+=d+p+f)):u>0&&(s=t.left-e.collisionPosition.marginLeft+d+p+f-h,(s>0||u>r(s))&&(t.left+=d+p+f))},top:function(t,e){var i,s,n=e.within,a=n.offset.top+n.scrollTop,o=n.height,h=n.isWindow?n.scrollTop:n.offset.top,l=t.top-e.collisionPosition.marginTop,c=l-h,u=l+e.collisionHeight-o-h,d="top"===e.my[1],p=d?-e.elemHeight:"bottom"===e.my[1]?e.elemHeight:0,f="top"===e.at[1]?e.targetHeight:"bottom"===e.at[1]?-e.targetHeight:0,m=-2*e.offset[1];0>c?(s=t.top+p+f+m+e.collisionHeight-o-a,t.top+p+f+m>c&&(0>s||r(c)>s)&&(t.top+=p+f+m)):u>0&&(i=t.top-e.collisionPosition.marginTop+p+f+m-h,t.top+p+f+m>u&&(i>0||u>r(i))&&(t.top+=p+f+m))}},flipfit:{left:function(){t.ui.position.flip.left.apply(this,arguments),t.ui.position.fit.left.apply(this,arguments)},top:function(){t.ui.position.flip.top.apply(this,arguments),t.ui.position.fit.top.apply(this,arguments)}}},function(){var e,i,s,n,a,o=document.getElementsByTagName("body")[0],r=document.createElement("div");e=document.createElement(o?"div":"body"),s={visibility:"hidden",width:0,height:0,border:0,margin:0,background:"none"},o&&t.extend(s,{position:"absolute",left:"-1000px",top:"-1000px"});for(a in s)e.style[a]=s[a];e.appendChild(r),i=o||document.documentElement,i.insertBefore(e,i.firstChild),r.style.cssText="position: absolute; left: 10.7432222px;",n=t(r).offset().left,t.support.offsetFractions=n>10&&11>n,e.innerHTML="",i.removeChild(e)}()})(jQuery);(function(e){e.widget("ui.draggable",e.ui.mouse,{version:"1.10.3",widgetEventPrefix:"drag",options:{addClasses:!0,appendTo:"parent",axis:!1,connectToSortable:!1,containment:!1,cursor:"auto",cursorAt:!1,grid:!1,handle:!1,helper:"original",iframeFix:!1,opacity:!1,refreshPositions:!1,revert:!1,revertDuration:500,scope:"default",scroll:!0,scrollSensitivity:20,scrollSpeed:20,snap:!1,snapMode:"both",snapTolerance:20,stack:!1,zIndex:!1,drag:null,start:null,stop:null},_create:function(){"original"!==this.options.helper||/^(?:r|a|f)/.test(this.element.css("position"))||(this.element[0].style.position="relative"),this.options.addClasses&&this.element.addClass("ui-draggable"),this.options.disabled&&this.element.addClass("ui-draggable-disabled"),this._mouseInit()},_destroy:function(){this.element.removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled"),this._mouseDestroy()},_mouseCapture:function(t){var i=this.options;return this.helper||i.disabled||e(t.target).closest(".ui-resizable-handle").length>0?!1:(this.handle=this._getHandle(t),this.handle?(e(i.iframeFix===!0?"iframe":i.iframeFix).each(function(){e("<div class='ui-draggable-iframeFix' style='background: #fff;'></div>").css({width:this.offsetWidth+"px",height:this.offsetHeight+"px",position:"absolute",opacity:"0.001",zIndex:1e3}).css(e(this).offset()).appendTo("body")}),!0):!1)},_mouseStart:function(t){var i=this.options;return this.helper=this._createHelper(t),this.helper.addClass("ui-draggable-dragging"),this._cacheHelperProportions(),e.ui.ddmanager&&(e.ui.ddmanager.current=this),this._cacheMargins(),this.cssPosition=this.helper.css("position"),this.scrollParent=this.helper.scrollParent(),this.offsetParent=this.helper.offsetParent(),this.offsetParentCssPosition=this.offsetParent.css("position"),this.offset=this.positionAbs=this.element.offset(),this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left},this.offset.scroll=!1,e.extend(this.offset,{click:{left:t.pageX-this.offset.left,top:t.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()}),this.originalPosition=this.position=this._generatePosition(t),this.originalPageX=t.pageX,this.originalPageY=t.pageY,i.cursorAt&&this._adjustOffsetFromHelper(i.cursorAt),this._setContainment(),this._trigger("start",t)===!1?(this._clear(),!1):(this._cacheHelperProportions(),e.ui.ddmanager&&!i.dropBehaviour&&e.ui.ddmanager.prepareOffsets(this,t),this._mouseDrag(t,!0),e.ui.ddmanager&&e.ui.ddmanager.dragStart(this,t),!0)},_mouseDrag:function(t,i){if("fixed"===this.offsetParentCssPosition&&(this.offset.parent=this._getParentOffset()),this.position=this._generatePosition(t),this.positionAbs=this._convertPositionTo("absolute"),!i){var s=this._uiHash();if(this._trigger("drag",t,s)===!1)return this._mouseUp({}),!1;this.position=s.position}return this.options.axis&&"y"===this.options.axis||(this.helper[0].style.left=this.position.left+"px"),this.options.axis&&"x"===this.options.axis||(this.helper[0].style.top=this.position.top+"px"),e.ui.ddmanager&&e.ui.ddmanager.drag(this,t),!1},_mouseStop:function(t){var i=this,s=!1;return e.ui.ddmanager&&!this.options.dropBehaviour&&(s=e.ui.ddmanager.drop(this,t)),this.dropped&&(s=this.dropped,this.dropped=!1),"original"!==this.options.helper||e.contains(this.element[0].ownerDocument,this.element[0])?("invalid"===this.options.revert&&!s||"valid"===this.options.revert&&s||this.options.revert===!0||e.isFunction(this.options.revert)&&this.options.revert.call(this.element,s)?e(this.helper).animate(this.originalPosition,parseInt(this.options.revertDuration,10),function(){i._trigger("stop",t)!==!1&&i._clear()}):this._trigger("stop",t)!==!1&&this._clear(),!1):!1},_mouseUp:function(t){return e("div.ui-draggable-iframeFix").each(function(){this.parentNode.removeChild(this)}),e.ui.ddmanager&&e.ui.ddmanager.dragStop(this,t),e.ui.mouse.prototype._mouseUp.call(this,t)},cancel:function(){return this.helper.is(".ui-draggable-dragging")?this._mouseUp({}):this._clear(),this},_getHandle:function(t){return this.options.handle?!!e(t.target).closest(this.element.find(this.options.handle)).length:!0},_createHelper:function(t){var i=this.options,s=e.isFunction(i.helper)?e(i.helper.apply(this.element[0],[t])):"clone"===i.helper?this.element.clone().removeAttr("id"):this.element;return s.parents("body").length||s.appendTo("parent"===i.appendTo?this.element[0].parentNode:i.appendTo),s[0]===this.element[0]||/(fixed|absolute)/.test(s.css("position"))||s.css("position","absolute"),s},_adjustOffsetFromHelper:function(t){"string"==typeof t&&(t=t.split(" ")),e.isArray(t)&&(t={left:+t[0],top:+t[1]||0}),"left"in t&&(this.offset.click.left=t.left+this.margins.left),"right"in t&&(this.offset.click.left=this.helperProportions.width-t.right+this.margins.left),"top"in t&&(this.offset.click.top=t.top+this.margins.top),"bottom"in t&&(this.offset.click.top=this.helperProportions.height-t.bottom+this.margins.top)},_getParentOffset:function(){var t=this.offsetParent.offset();return"absolute"===this.cssPosition&&this.scrollParent[0]!==document&&e.contains(this.scrollParent[0],this.offsetParent[0])&&(t.left+=this.scrollParent.scrollLeft(),t.top+=this.scrollParent.scrollTop()),(this.offsetParent[0]===document.body||this.offsetParent[0].tagName&&"html"===this.offsetParent[0].tagName.toLowerCase()&&e.ui.ie)&&(t={top:0,left:0}),{top:t.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:t.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if("relative"===this.cssPosition){var e=this.element.position();return{top:e.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:e.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.element.css("marginLeft"),10)||0,top:parseInt(this.element.css("marginTop"),10)||0,right:parseInt(this.element.css("marginRight"),10)||0,bottom:parseInt(this.element.css("marginBottom"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var t,i,s,n=this.options;return n.containment?"window"===n.containment?(this.containment=[e(window).scrollLeft()-this.offset.relative.left-this.offset.parent.left,e(window).scrollTop()-this.offset.relative.top-this.offset.parent.top,e(window).scrollLeft()+e(window).width()-this.helperProportions.width-this.margins.left,e(window).scrollTop()+(e(window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top],undefined):"document"===n.containment?(this.containment=[0,0,e(document).width()-this.helperProportions.width-this.margins.left,(e(document).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top],undefined):n.containment.constructor===Array?(this.containment=n.containment,undefined):("parent"===n.containment&&(n.containment=this.helper[0].parentNode),i=e(n.containment),s=i[0],s&&(t="hidden"!==i.css("overflow"),this.containment=[(parseInt(i.css("borderLeftWidth"),10)||0)+(parseInt(i.css("paddingLeft"),10)||0),(parseInt(i.css("borderTopWidth"),10)||0)+(parseInt(i.css("paddingTop"),10)||0),(t?Math.max(s.scrollWidth,s.offsetWidth):s.offsetWidth)-(parseInt(i.css("borderRightWidth"),10)||0)-(parseInt(i.css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left-this.margins.right,(t?Math.max(s.scrollHeight,s.offsetHeight):s.offsetHeight)-(parseInt(i.css("borderBottomWidth"),10)||0)-(parseInt(i.css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top-this.margins.bottom],this.relative_container=i),undefined):(this.containment=null,undefined)},_convertPositionTo:function(t,i){i||(i=this.position);var s="absolute"===t?1:-1,n="absolute"!==this.cssPosition||this.scrollParent[0]!==document&&e.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent;return this.offset.scroll||(this.offset.scroll={top:n.scrollTop(),left:n.scrollLeft()}),{top:i.top+this.offset.relative.top*s+this.offset.parent.top*s-("fixed"===this.cssPosition?-this.scrollParent.scrollTop():this.offset.scroll.top)*s,left:i.left+this.offset.relative.left*s+this.offset.parent.left*s-("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():this.offset.scroll.left)*s}},_generatePosition:function(t){var i,s,n,a,o=this.options,r="absolute"!==this.cssPosition||this.scrollParent[0]!==document&&e.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,h=t.pageX,l=t.pageY;return this.offset.scroll||(this.offset.scroll={top:r.scrollTop(),left:r.scrollLeft()}),this.originalPosition&&(this.containment&&(this.relative_container?(s=this.relative_container.offset(),i=[this.containment[0]+s.left,this.containment[1]+s.top,this.containment[2]+s.left,this.containment[3]+s.top]):i=this.containment,t.pageX-this.offset.click.left<i[0]&&(h=i[0]+this.offset.click.left),t.pageY-this.offset.click.top<i[1]&&(l=i[1]+this.offset.click.top),t.pageX-this.offset.click.left>i[2]&&(h=i[2]+this.offset.click.left),t.pageY-this.offset.click.top>i[3]&&(l=i[3]+this.offset.click.top)),o.grid&&(n=o.grid[1]?this.originalPageY+Math.round((l-this.originalPageY)/o.grid[1])*o.grid[1]:this.originalPageY,l=i?n-this.offset.click.top>=i[1]||n-this.offset.click.top>i[3]?n:n-this.offset.click.top>=i[1]?n-o.grid[1]:n+o.grid[1]:n,a=o.grid[0]?this.originalPageX+Math.round((h-this.originalPageX)/o.grid[0])*o.grid[0]:this.originalPageX,h=i?a-this.offset.click.left>=i[0]||a-this.offset.click.left>i[2]?a:a-this.offset.click.left>=i[0]?a-o.grid[0]:a+o.grid[0]:a)),{top:l-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+("fixed"===this.cssPosition?-this.scrollParent.scrollTop():this.offset.scroll.top),left:h-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():this.offset.scroll.left)}},_clear:function(){this.helper.removeClass("ui-draggable-dragging"),this.helper[0]===this.element[0]||this.cancelHelperRemoval||this.helper.remove(),this.helper=null,this.cancelHelperRemoval=!1},_trigger:function(t,i,s){return s=s||this._uiHash(),e.ui.plugin.call(this,t,[i,s]),"drag"===t&&(this.positionAbs=this._convertPositionTo("absolute")),e.Widget.prototype._trigger.call(this,t,i,s)},plugins:{},_uiHash:function(){return{helper:this.helper,position:this.position,originalPosition:this.originalPosition,offset:this.positionAbs}}}),e.ui.plugin.add("draggable","connectToSortable",{start:function(t,i){var s=e(this).data("ui-draggable"),n=s.options,a=e.extend({},i,{item:s.element});s.sortables=[],e(n.connectToSortable).each(function(){var i=e.data(this,"ui-sortable");i&&!i.options.disabled&&(s.sortables.push({instance:i,shouldRevert:i.options.revert}),i.refreshPositions(),i._trigger("activate",t,a))})},stop:function(t,i){var s=e(this).data("ui-draggable"),n=e.extend({},i,{item:s.element});e.each(s.sortables,function(){this.instance.isOver?(this.instance.isOver=0,s.cancelHelperRemoval=!0,this.instance.cancelHelperRemoval=!1,this.shouldRevert&&(this.instance.options.revert=this.shouldRevert),this.instance._mouseStop(t),this.instance.options.helper=this.instance.options._helper,"original"===s.options.helper&&this.instance.currentItem.css({top:"auto",left:"auto"})):(this.instance.cancelHelperRemoval=!1,this.instance._trigger("deactivate",t,n))})},drag:function(t,i){var s=e(this).data("ui-draggable"),n=this;e.each(s.sortables,function(){var a=!1,o=this;this.instance.positionAbs=s.positionAbs,this.instance.helperProportions=s.helperProportions,this.instance.offset.click=s.offset.click,this.instance._intersectsWith(this.instance.containerCache)&&(a=!0,e.each(s.sortables,function(){return this.instance.positionAbs=s.positionAbs,this.instance.helperProportions=s.helperProportions,this.instance.offset.click=s.offset.click,this!==o&&this.instance._intersectsWith(this.instance.containerCache)&&e.contains(o.instance.element[0],this.instance.element[0])&&(a=!1),a})),a?(this.instance.isOver||(this.instance.isOver=1,this.instance.currentItem=e(n).clone().removeAttr("id").appendTo(this.instance.element).data("ui-sortable-item",!0),this.instance.options._helper=this.instance.options.helper,this.instance.options.helper=function(){return i.helper[0]},t.target=this.instance.currentItem[0],this.instance._mouseCapture(t,!0),this.instance._mouseStart(t,!0,!0),this.instance.offset.click.top=s.offset.click.top,this.instance.offset.click.left=s.offset.click.left,this.instance.offset.parent.left-=s.offset.parent.left-this.instance.offset.parent.left,this.instance.offset.parent.top-=s.offset.parent.top-this.instance.offset.parent.top,s._trigger("toSortable",t),s.dropped=this.instance.element,s.currentItem=s.element,this.instance.fromOutside=s),this.instance.currentItem&&this.instance._mouseDrag(t)):this.instance.isOver&&(this.instance.isOver=0,this.instance.cancelHelperRemoval=!0,this.instance.options.revert=!1,this.instance._trigger("out",t,this.instance._uiHash(this.instance)),this.instance._mouseStop(t,!0),this.instance.options.helper=this.instance.options._helper,this.instance.currentItem.remove(),this.instance.placeholder&&this.instance.placeholder.remove(),s._trigger("fromSortable",t),s.dropped=!1)})}}),e.ui.plugin.add("draggable","cursor",{start:function(){var t=e("body"),i=e(this).data("ui-draggable").options;t.css("cursor")&&(i._cursor=t.css("cursor")),t.css("cursor",i.cursor)},stop:function(){var t=e(this).data("ui-draggable").options;t._cursor&&e("body").css("cursor",t._cursor)}}),e.ui.plugin.add("draggable","opacity",{start:function(t,i){var s=e(i.helper),n=e(this).data("ui-draggable").options;s.css("opacity")&&(n._opacity=s.css("opacity")),s.css("opacity",n.opacity)},stop:function(t,i){var s=e(this).data("ui-draggable").options;s._opacity&&e(i.helper).css("opacity",s._opacity)}}),e.ui.plugin.add("draggable","scroll",{start:function(){var t=e(this).data("ui-draggable");t.scrollParent[0]!==document&&"HTML"!==t.scrollParent[0].tagName&&(t.overflowOffset=t.scrollParent.offset())},drag:function(t){var i=e(this).data("ui-draggable"),s=i.options,n=!1;i.scrollParent[0]!==document&&"HTML"!==i.scrollParent[0].tagName?(s.axis&&"x"===s.axis||(i.overflowOffset.top+i.scrollParent[0].offsetHeight-t.pageY<s.scrollSensitivity?i.scrollParent[0].scrollTop=n=i.scrollParent[0].scrollTop+s.scrollSpeed:t.pageY-i.overflowOffset.top<s.scrollSensitivity&&(i.scrollParent[0].scrollTop=n=i.scrollParent[0].scrollTop-s.scrollSpeed)),s.axis&&"y"===s.axis||(i.overflowOffset.left+i.scrollParent[0].offsetWidth-t.pageX<s.scrollSensitivity?i.scrollParent[0].scrollLeft=n=i.scrollParent[0].scrollLeft+s.scrollSpeed:t.pageX-i.overflowOffset.left<s.scrollSensitivity&&(i.scrollParent[0].scrollLeft=n=i.scrollParent[0].scrollLeft-s.scrollSpeed))):(s.axis&&"x"===s.axis||(t.pageY-e(document).scrollTop()<s.scrollSensitivity?n=e(document).scrollTop(e(document).scrollTop()-s.scrollSpeed):e(window).height()-(t.pageY-e(document).scrollTop())<s.scrollSensitivity&&(n=e(document).scrollTop(e(document).scrollTop()+s.scrollSpeed))),s.axis&&"y"===s.axis||(t.pageX-e(document).scrollLeft()<s.scrollSensitivity?n=e(document).scrollLeft(e(document).scrollLeft()-s.scrollSpeed):e(window).width()-(t.pageX-e(document).scrollLeft())<s.scrollSensitivity&&(n=e(document).scrollLeft(e(document).scrollLeft()+s.scrollSpeed)))),n!==!1&&e.ui.ddmanager&&!s.dropBehaviour&&e.ui.ddmanager.prepareOffsets(i,t)}}),e.ui.plugin.add("draggable","snap",{start:function(){var t=e(this).data("ui-draggable"),i=t.options;t.snapElements=[],e(i.snap.constructor!==String?i.snap.items||":data(ui-draggable)":i.snap).each(function(){var i=e(this),s=i.offset();this!==t.element[0]&&t.snapElements.push({item:this,width:i.outerWidth(),height:i.outerHeight(),top:s.top,left:s.left})})},drag:function(t,i){var s,n,a,o,r,h,l,u,c,d,p=e(this).data("ui-draggable"),f=p.options,m=f.snapTolerance,g=i.offset.left,v=g+p.helperProportions.width,b=i.offset.top,y=b+p.helperProportions.height;for(c=p.snapElements.length-1;c>=0;c--)r=p.snapElements[c].left,h=r+p.snapElements[c].width,l=p.snapElements[c].top,u=l+p.snapElements[c].height,r-m>v||g>h+m||l-m>y||b>u+m||!e.contains(p.snapElements[c].item.ownerDocument,p.snapElements[c].item)?(p.snapElements[c].snapping&&p.options.snap.release&&p.options.snap.release.call(p.element,t,e.extend(p._uiHash(),{snapItem:p.snapElements[c].item})),p.snapElements[c].snapping=!1):("inner"!==f.snapMode&&(s=m>=Math.abs(l-y),n=m>=Math.abs(u-b),a=m>=Math.abs(r-v),o=m>=Math.abs(h-g),s&&(i.position.top=p._convertPositionTo("relative",{top:l-p.helperProportions.height,left:0}).top-p.margins.top),n&&(i.position.top=p._convertPositionTo("relative",{top:u,left:0}).top-p.margins.top),a&&(i.position.left=p._convertPositionTo("relative",{top:0,left:r-p.helperProportions.width}).left-p.margins.left),o&&(i.position.left=p._convertPositionTo("relative",{top:0,left:h}).left-p.margins.left)),d=s||n||a||o,"outer"!==f.snapMode&&(s=m>=Math.abs(l-b),n=m>=Math.abs(u-y),a=m>=Math.abs(r-g),o=m>=Math.abs(h-v),s&&(i.position.top=p._convertPositionTo("relative",{top:l,left:0}).top-p.margins.top),n&&(i.position.top=p._convertPositionTo("relative",{top:u-p.helperProportions.height,left:0}).top-p.margins.top),a&&(i.position.left=p._convertPositionTo("relative",{top:0,left:r}).left-p.margins.left),o&&(i.position.left=p._convertPositionTo("relative",{top:0,left:h-p.helperProportions.width}).left-p.margins.left)),!p.snapElements[c].snapping&&(s||n||a||o||d)&&p.options.snap.snap&&p.options.snap.snap.call(p.element,t,e.extend(p._uiHash(),{snapItem:p.snapElements[c].item})),p.snapElements[c].snapping=s||n||a||o||d)}}),e.ui.plugin.add("draggable","stack",{start:function(){var t,i=this.data("ui-draggable").options,s=e.makeArray(e(i.stack)).sort(function(t,i){return(parseInt(e(t).css("zIndex"),10)||0)-(parseInt(e(i).css("zIndex"),10)||0)});s.length&&(t=parseInt(e(s[0]).css("zIndex"),10)||0,e(s).each(function(i){e(this).css("zIndex",t+i)}),this.css("zIndex",t+s.length))}}),e.ui.plugin.add("draggable","zIndex",{start:function(t,i){var s=e(i.helper),n=e(this).data("ui-draggable").options;s.css("zIndex")&&(n._zIndex=s.css("zIndex")),s.css("zIndex",n.zIndex)},stop:function(t,i){var s=e(this).data("ui-draggable").options;s._zIndex&&e(i.helper).css("zIndex",s._zIndex)}})})(jQuery);(function(e){function t(e,t,i){return e>t&&t+i>e}e.widget("ui.droppable",{version:"1.10.3",widgetEventPrefix:"drop",options:{accept:"*",activeClass:!1,addClasses:!0,greedy:!1,hoverClass:!1,scope:"default",tolerance:"intersect",activate:null,deactivate:null,drop:null,out:null,over:null},_create:function(){var t=this.options,i=t.accept;this.isover=!1,this.isout=!0,this.accept=e.isFunction(i)?i:function(e){return e.is(i)},this.proportions={width:this.element[0].offsetWidth,height:this.element[0].offsetHeight},e.ui.ddmanager.droppables[t.scope]=e.ui.ddmanager.droppables[t.scope]||[],e.ui.ddmanager.droppables[t.scope].push(this),t.addClasses&&this.element.addClass("ui-droppable")},_destroy:function(){for(var t=0,i=e.ui.ddmanager.droppables[this.options.scope];i.length>t;t++)i[t]===this&&i.splice(t,1);this.element.removeClass("ui-droppable ui-droppable-disabled")},_setOption:function(t,i){"accept"===t&&(this.accept=e.isFunction(i)?i:function(e){return e.is(i)}),e.Widget.prototype._setOption.apply(this,arguments)},_activate:function(t){var i=e.ui.ddmanager.current;this.options.activeClass&&this.element.addClass(this.options.activeClass),i&&this._trigger("activate",t,this.ui(i))},_deactivate:function(t){var i=e.ui.ddmanager.current;this.options.activeClass&&this.element.removeClass(this.options.activeClass),i&&this._trigger("deactivate",t,this.ui(i))},_over:function(t){var i=e.ui.ddmanager.current;i&&(i.currentItem||i.element)[0]!==this.element[0]&&this.accept.call(this.element[0],i.currentItem||i.element)&&(this.options.hoverClass&&this.element.addClass(this.options.hoverClass),this._trigger("over",t,this.ui(i)))},_out:function(t){var i=e.ui.ddmanager.current;i&&(i.currentItem||i.element)[0]!==this.element[0]&&this.accept.call(this.element[0],i.currentItem||i.element)&&(this.options.hoverClass&&this.element.removeClass(this.options.hoverClass),this._trigger("out",t,this.ui(i)))},_drop:function(t,i){var s=i||e.ui.ddmanager.current,n=!1;return s&&(s.currentItem||s.element)[0]!==this.element[0]?(this.element.find(":data(ui-droppable)").not(".ui-draggable-dragging").each(function(){var t=e.data(this,"ui-droppable");return t.options.greedy&&!t.options.disabled&&t.options.scope===s.options.scope&&t.accept.call(t.element[0],s.currentItem||s.element)&&e.ui.intersect(s,e.extend(t,{offset:t.element.offset()}),t.options.tolerance)?(n=!0,!1):undefined}),n?!1:this.accept.call(this.element[0],s.currentItem||s.element)?(this.options.activeClass&&this.element.removeClass(this.options.activeClass),this.options.hoverClass&&this.element.removeClass(this.options.hoverClass),this._trigger("drop",t,this.ui(s)),this.element):!1):!1},ui:function(e){return{draggable:e.currentItem||e.element,helper:e.helper,position:e.position,offset:e.positionAbs}}}),e.ui.intersect=function(e,i,s){if(!i.offset)return!1;var n,a,o=(e.positionAbs||e.position.absolute).left,r=o+e.helperProportions.width,h=(e.positionAbs||e.position.absolute).top,l=h+e.helperProportions.height,u=i.offset.left,c=u+i.proportions.width,d=i.offset.top,p=d+i.proportions.height;switch(s){case"fit":return o>=u&&c>=r&&h>=d&&p>=l;case"intersect":return o+e.helperProportions.width/2>u&&c>r-e.helperProportions.width/2&&h+e.helperProportions.height/2>d&&p>l-e.helperProportions.height/2;case"pointer":return n=(e.positionAbs||e.position.absolute).left+(e.clickOffset||e.offset.click).left,a=(e.positionAbs||e.position.absolute).top+(e.clickOffset||e.offset.click).top,t(a,d,i.proportions.height)&&t(n,u,i.proportions.width);case"touch":return(h>=d&&p>=h||l>=d&&p>=l||d>h&&l>p)&&(o>=u&&c>=o||r>=u&&c>=r||u>o&&r>c);default:return!1}},e.ui.ddmanager={current:null,droppables:{"default":[]},prepareOffsets:function(t,i){var s,n,a=e.ui.ddmanager.droppables[t.options.scope]||[],o=i?i.type:null,r=(t.currentItem||t.element).find(":data(ui-droppable)").addBack();e:for(s=0;a.length>s;s++)if(!(a[s].options.disabled||t&&!a[s].accept.call(a[s].element[0],t.currentItem||t.element))){for(n=0;r.length>n;n++)if(r[n]===a[s].element[0]){a[s].proportions.height=0;continue e}a[s].visible="none"!==a[s].element.css("display"),a[s].visible&&("mousedown"===o&&a[s]._activate.call(a[s],i),a[s].offset=a[s].element.offset(),a[s].proportions={width:a[s].element[0].offsetWidth,height:a[s].element[0].offsetHeight})}},drop:function(t,i){var s=!1;return e.each((e.ui.ddmanager.droppables[t.options.scope]||[]).slice(),function(){this.options&&(!this.options.disabled&&this.visible&&e.ui.intersect(t,this,this.options.tolerance)&&(s=this._drop.call(this,i)||s),!this.options.disabled&&this.visible&&this.accept.call(this.element[0],t.currentItem||t.element)&&(this.isout=!0,this.isover=!1,this._deactivate.call(this,i)))}),s},dragStart:function(t,i){t.element.parentsUntil("body").bind("scroll.droppable",function(){t.options.refreshPositions||e.ui.ddmanager.prepareOffsets(t,i)})},drag:function(t,i){t.options.refreshPositions&&e.ui.ddmanager.prepareOffsets(t,i),e.each(e.ui.ddmanager.droppables[t.options.scope]||[],function(){if(!this.options.disabled&&!this.greedyChild&&this.visible){var s,n,a,o=e.ui.intersect(t,this,this.options.tolerance),r=!o&&this.isover?"isout":o&&!this.isover?"isover":null;r&&(this.options.greedy&&(n=this.options.scope,a=this.element.parents(":data(ui-droppable)").filter(function(){return e.data(this,"ui-droppable").options.scope===n}),a.length&&(s=e.data(a[0],"ui-droppable"),s.greedyChild="isover"===r)),s&&"isover"===r&&(s.isover=!1,s.isout=!0,s._out.call(s,i)),this[r]=!0,this["isout"===r?"isover":"isout"]=!1,this["isover"===r?"_over":"_out"].call(this,i),s&&"isout"===r&&(s.isout=!1,s.isover=!0,s._over.call(s,i)))}})},dragStop:function(t,i){t.element.parentsUntil("body").unbind("scroll.droppable"),t.options.refreshPositions||e.ui.ddmanager.prepareOffsets(t,i)}}})(jQuery);(function(e){function t(e){return parseInt(e,10)||0}function i(e){return!isNaN(parseInt(e,10))}e.widget("ui.resizable",e.ui.mouse,{version:"1.10.3",widgetEventPrefix:"resize",options:{alsoResize:!1,animate:!1,animateDuration:"slow",animateEasing:"swing",aspectRatio:!1,autoHide:!1,containment:!1,ghost:!1,grid:!1,handles:"e,s,se",helper:!1,maxHeight:null,maxWidth:null,minHeight:10,minWidth:10,zIndex:90,resize:null,start:null,stop:null},_create:function(){var t,i,s,n,a,o=this,r=this.options;if(this.element.addClass("ui-resizable"),e.extend(this,{_aspectRatio:!!r.aspectRatio,aspectRatio:r.aspectRatio,originalElement:this.element,_proportionallyResizeElements:[],_helper:r.helper||r.ghost||r.animate?r.helper||"ui-resizable-helper":null}),this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i)&&(this.element.wrap(e("<div class='ui-wrapper' style='overflow: hidden;'></div>").css({position:this.element.css("position"),width:this.element.outerWidth(),height:this.element.outerHeight(),top:this.element.css("top"),left:this.element.css("left")})),this.element=this.element.parent().data("ui-resizable",this.element.data("ui-resizable")),this.elementIsWrapper=!0,this.element.css({marginLeft:this.originalElement.css("marginLeft"),marginTop:this.originalElement.css("marginTop"),marginRight:this.originalElement.css("marginRight"),marginBottom:this.originalElement.css("marginBottom")}),this.originalElement.css({marginLeft:0,marginTop:0,marginRight:0,marginBottom:0}),this.originalResizeStyle=this.originalElement.css("resize"),this.originalElement.css("resize","none"),this._proportionallyResizeElements.push(this.originalElement.css({position:"static",zoom:1,display:"block"})),this.originalElement.css({margin:this.originalElement.css("margin")}),this._proportionallyResize()),this.handles=r.handles||(e(".ui-resizable-handle",this.element).length?{n:".ui-resizable-n",e:".ui-resizable-e",s:".ui-resizable-s",w:".ui-resizable-w",se:".ui-resizable-se",sw:".ui-resizable-sw",ne:".ui-resizable-ne",nw:".ui-resizable-nw"}:"e,s,se"),this.handles.constructor===String)for("all"===this.handles&&(this.handles="n,e,s,w,se,sw,ne,nw"),t=this.handles.split(","),this.handles={},i=0;t.length>i;i++)s=e.trim(t[i]),a="ui-resizable-"+s,n=e("<div class='ui-resizable-handle "+a+"'></div>"),n.css({zIndex:r.zIndex}),"se"===s&&n.addClass("ui-icon ui-icon-gripsmall-diagonal-se"),this.handles[s]=".ui-resizable-"+s,this.element.append(n);this._renderAxis=function(t){var i,s,n,a;t=t||this.element;for(i in this.handles)this.handles[i].constructor===String&&(this.handles[i]=e(this.handles[i],this.element).show()),this.elementIsWrapper&&this.originalElement[0].nodeName.match(/textarea|input|select|button/i)&&(s=e(this.handles[i],this.element),a=/sw|ne|nw|se|n|s/.test(i)?s.outerHeight():s.outerWidth(),n=["padding",/ne|nw|n/.test(i)?"Top":/se|sw|s/.test(i)?"Bottom":/^e$/.test(i)?"Right":"Left"].join(""),t.css(n,a),this._proportionallyResize()),e(this.handles[i]).length},this._renderAxis(this.element),this._handles=e(".ui-resizable-handle",this.element).disableSelection(),this._handles.mouseover(function(){o.resizing||(this.className&&(n=this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i)),o.axis=n&&n[1]?n[1]:"se")}),r.autoHide&&(this._handles.hide(),e(this.element).addClass("ui-resizable-autohide").mouseenter(function(){r.disabled||(e(this).removeClass("ui-resizable-autohide"),o._handles.show())}).mouseleave(function(){r.disabled||o.resizing||(e(this).addClass("ui-resizable-autohide"),o._handles.hide())})),this._mouseInit()},_destroy:function(){this._mouseDestroy();var t,i=function(t){e(t).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing").removeData("resizable").removeData("ui-resizable").unbind(".resizable").find(".ui-resizable-handle").remove()};return this.elementIsWrapper&&(i(this.element),t=this.element,this.originalElement.css({position:t.css("position"),width:t.outerWidth(),height:t.outerHeight(),top:t.css("top"),left:t.css("left")}).insertAfter(t),t.remove()),this.originalElement.css("resize",this.originalResizeStyle),i(this.originalElement),this},_mouseCapture:function(t){var i,s,n=!1;for(i in this.handles)s=e(this.handles[i])[0],(s===t.target||e.contains(s,t.target))&&(n=!0);return!this.options.disabled&&n},_mouseStart:function(i){var s,n,a,o=this.options,r=this.element.position(),h=this.element;return this.resizing=!0,/absolute/.test(h.css("position"))?h.css({position:"absolute",top:h.css("top"),left:h.css("left")}):h.is(".ui-draggable")&&h.css({position:"absolute",top:r.top,left:r.left}),this._renderProxy(),s=t(this.helper.css("left")),n=t(this.helper.css("top")),o.containment&&(s+=e(o.containment).scrollLeft()||0,n+=e(o.containment).scrollTop()||0),this.offset=this.helper.offset(),this.position={left:s,top:n},this.size=this._helper?{width:h.outerWidth(),height:h.outerHeight()}:{width:h.width(),height:h.height()},this.originalSize=this._helper?{width:h.outerWidth(),height:h.outerHeight()}:{width:h.width(),height:h.height()},this.originalPosition={left:s,top:n},this.sizeDiff={width:h.outerWidth()-h.width(),height:h.outerHeight()-h.height()},this.originalMousePosition={left:i.pageX,top:i.pageY},this.aspectRatio="number"==typeof o.aspectRatio?o.aspectRatio:this.originalSize.width/this.originalSize.height||1,a=e(".ui-resizable-"+this.axis).css("cursor"),e("body").css("cursor","auto"===a?this.axis+"-resize":a),h.addClass("ui-resizable-resizing"),this._propagate("start",i),!0},_mouseDrag:function(t){var i,s=this.helper,n={},a=this.originalMousePosition,o=this.axis,r=this.position.top,h=this.position.left,l=this.size.width,u=this.size.height,c=t.pageX-a.left||0,d=t.pageY-a.top||0,p=this._change[o];return p?(i=p.apply(this,[t,c,d]),this._updateVirtualBoundaries(t.shiftKey),(this._aspectRatio||t.shiftKey)&&(i=this._updateRatio(i,t)),i=this._respectSize(i,t),this._updateCache(i),this._propagate("resize",t),this.position.top!==r&&(n.top=this.position.top+"px"),this.position.left!==h&&(n.left=this.position.left+"px"),this.size.width!==l&&(n.width=this.size.width+"px"),this.size.height!==u&&(n.height=this.size.height+"px"),s.css(n),!this._helper&&this._proportionallyResizeElements.length&&this._proportionallyResize(),e.isEmptyObject(n)||this._trigger("resize",t,this.ui()),!1):!1},_mouseStop:function(t){this.resizing=!1;var i,s,n,a,o,r,h,l=this.options,u=this;return this._helper&&(i=this._proportionallyResizeElements,s=i.length&&/textarea/i.test(i[0].nodeName),n=s&&e.ui.hasScroll(i[0],"left")?0:u.sizeDiff.height,a=s?0:u.sizeDiff.width,o={width:u.helper.width()-a,height:u.helper.height()-n},r=parseInt(u.element.css("left"),10)+(u.position.left-u.originalPosition.left)||null,h=parseInt(u.element.css("top"),10)+(u.position.top-u.originalPosition.top)||null,l.animate||this.element.css(e.extend(o,{top:h,left:r})),u.helper.height(u.size.height),u.helper.width(u.size.width),this._helper&&!l.animate&&this._proportionallyResize()),e("body").css("cursor","auto"),this.element.removeClass("ui-resizable-resizing"),this._propagate("stop",t),this._helper&&this.helper.remove(),!1},_updateVirtualBoundaries:function(e){var t,s,n,a,o,r=this.options;o={minWidth:i(r.minWidth)?r.minWidth:0,maxWidth:i(r.maxWidth)?r.maxWidth:1/0,minHeight:i(r.minHeight)?r.minHeight:0,maxHeight:i(r.maxHeight)?r.maxHeight:1/0},(this._aspectRatio||e)&&(t=o.minHeight*this.aspectRatio,n=o.minWidth/this.aspectRatio,s=o.maxHeight*this.aspectRatio,a=o.maxWidth/this.aspectRatio,t>o.minWidth&&(o.minWidth=t),n>o.minHeight&&(o.minHeight=n),o.maxWidth>s&&(o.maxWidth=s),o.maxHeight>a&&(o.maxHeight=a)),this._vBoundaries=o},_updateCache:function(e){this.offset=this.helper.offset(),i(e.left)&&(this.position.left=e.left),i(e.top)&&(this.position.top=e.top),i(e.height)&&(this.size.height=e.height),i(e.width)&&(this.size.width=e.width)},_updateRatio:function(e){var t=this.position,s=this.size,n=this.axis;return i(e.height)?e.width=e.height*this.aspectRatio:i(e.width)&&(e.height=e.width/this.aspectRatio),"sw"===n&&(e.left=t.left+(s.width-e.width),e.top=null),"nw"===n&&(e.top=t.top+(s.height-e.height),e.left=t.left+(s.width-e.width)),e},_respectSize:function(e){var t=this._vBoundaries,s=this.axis,n=i(e.width)&&t.maxWidth&&t.maxWidth<e.width,a=i(e.height)&&t.maxHeight&&t.maxHeight<e.height,o=i(e.width)&&t.minWidth&&t.minWidth>e.width,r=i(e.height)&&t.minHeight&&t.minHeight>e.height,h=this.originalPosition.left+this.originalSize.width,l=this.position.top+this.size.height,u=/sw|nw|w/.test(s),c=/nw|ne|n/.test(s);return o&&(e.width=t.minWidth),r&&(e.height=t.minHeight),n&&(e.width=t.maxWidth),a&&(e.height=t.maxHeight),o&&u&&(e.left=h-t.minWidth),n&&u&&(e.left=h-t.maxWidth),r&&c&&(e.top=l-t.minHeight),a&&c&&(e.top=l-t.maxHeight),e.width||e.height||e.left||!e.top?e.width||e.height||e.top||!e.left||(e.left=null):e.top=null,e},_proportionallyResize:function(){if(this._proportionallyResizeElements.length){var e,t,i,s,n,a=this.helper||this.element;for(e=0;this._proportionallyResizeElements.length>e;e++){if(n=this._proportionallyResizeElements[e],!this.borderDif)for(this.borderDif=[],i=[n.css("borderTopWidth"),n.css("borderRightWidth"),n.css("borderBottomWidth"),n.css("borderLeftWidth")],s=[n.css("paddingTop"),n.css("paddingRight"),n.css("paddingBottom"),n.css("paddingLeft")],t=0;i.length>t;t++)this.borderDif[t]=(parseInt(i[t],10)||0)+(parseInt(s[t],10)||0);n.css({height:a.height()-this.borderDif[0]-this.borderDif[2]||0,width:a.width()-this.borderDif[1]-this.borderDif[3]||0})}}},_renderProxy:function(){var t=this.element,i=this.options;this.elementOffset=t.offset(),this._helper?(this.helper=this.helper||e("<div style='overflow:hidden;'></div>"),this.helper.addClass(this._helper).css({width:this.element.outerWidth()-1,height:this.element.outerHeight()-1,position:"absolute",left:this.elementOffset.left+"px",top:this.elementOffset.top+"px",zIndex:++i.zIndex}),this.helper.appendTo("body").disableSelection()):this.helper=this.element},_change:{e:function(e,t){return{width:this.originalSize.width+t}},w:function(e,t){var i=this.originalSize,s=this.originalPosition;return{left:s.left+t,width:i.width-t}},n:function(e,t,i){var s=this.originalSize,n=this.originalPosition;return{top:n.top+i,height:s.height-i}},s:function(e,t,i){return{height:this.originalSize.height+i}},se:function(t,i,s){return e.extend(this._change.s.apply(this,arguments),this._change.e.apply(this,[t,i,s]))},sw:function(t,i,s){return e.extend(this._change.s.apply(this,arguments),this._change.w.apply(this,[t,i,s]))},ne:function(t,i,s){return e.extend(this._change.n.apply(this,arguments),this._change.e.apply(this,[t,i,s]))},nw:function(t,i,s){return e.extend(this._change.n.apply(this,arguments),this._change.w.apply(this,[t,i,s]))}},_propagate:function(t,i){e.ui.plugin.call(this,t,[i,this.ui()]),"resize"!==t&&this._trigger(t,i,this.ui())},plugins:{},ui:function(){return{originalElement:this.originalElement,element:this.element,helper:this.helper,position:this.position,size:this.size,originalSize:this.originalSize,originalPosition:this.originalPosition}}}),e.ui.plugin.add("resizable","animate",{stop:function(t){var i=e(this).data("ui-resizable"),s=i.options,n=i._proportionallyResizeElements,a=n.length&&/textarea/i.test(n[0].nodeName),o=a&&e.ui.hasScroll(n[0],"left")?0:i.sizeDiff.height,r=a?0:i.sizeDiff.width,h={width:i.size.width-r,height:i.size.height-o},l=parseInt(i.element.css("left"),10)+(i.position.left-i.originalPosition.left)||null,u=parseInt(i.element.css("top"),10)+(i.position.top-i.originalPosition.top)||null;i.element.animate(e.extend(h,u&&l?{top:u,left:l}:{}),{duration:s.animateDuration,easing:s.animateEasing,step:function(){var s={width:parseInt(i.element.css("width"),10),height:parseInt(i.element.css("height"),10),top:parseInt(i.element.css("top"),10),left:parseInt(i.element.css("left"),10)};n&&n.length&&e(n[0]).css({width:s.width,height:s.height}),i._updateCache(s),i._propagate("resize",t)}})}}),e.ui.plugin.add("resizable","containment",{start:function(){var i,s,n,a,o,r,h,l=e(this).data("ui-resizable"),u=l.options,c=l.element,d=u.containment,p=d instanceof e?d.get(0):/parent/.test(d)?c.parent().get(0):d;p&&(l.containerElement=e(p),/document/.test(d)||d===document?(l.containerOffset={left:0,top:0},l.containerPosition={left:0,top:0},l.parentData={element:e(document),left:0,top:0,width:e(document).width(),height:e(document).height()||document.body.parentNode.scrollHeight}):(i=e(p),s=[],e(["Top","Right","Left","Bottom"]).each(function(e,n){s[e]=t(i.css("padding"+n))}),l.containerOffset=i.offset(),l.containerPosition=i.position(),l.containerSize={height:i.innerHeight()-s[3],width:i.innerWidth()-s[1]},n=l.containerOffset,a=l.containerSize.height,o=l.containerSize.width,r=e.ui.hasScroll(p,"left")?p.scrollWidth:o,h=e.ui.hasScroll(p)?p.scrollHeight:a,l.parentData={element:p,left:n.left,top:n.top,width:r,height:h}))},resize:function(t){var i,s,n,a,o=e(this).data("ui-resizable"),r=o.options,h=o.containerOffset,l=o.position,u=o._aspectRatio||t.shiftKey,c={top:0,left:0},d=o.containerElement;d[0]!==document&&/static/.test(d.css("position"))&&(c=h),l.left<(o._helper?h.left:0)&&(o.size.width=o.size.width+(o._helper?o.position.left-h.left:o.position.left-c.left),u&&(o.size.height=o.size.width/o.aspectRatio),o.position.left=r.helper?h.left:0),l.top<(o._helper?h.top:0)&&(o.size.height=o.size.height+(o._helper?o.position.top-h.top:o.position.top),u&&(o.size.width=o.size.height*o.aspectRatio),o.position.top=o._helper?h.top:0),o.offset.left=o.parentData.left+o.position.left,o.offset.top=o.parentData.top+o.position.top,i=Math.abs((o._helper?o.offset.left-c.left:o.offset.left-c.left)+o.sizeDiff.width),s=Math.abs((o._helper?o.offset.top-c.top:o.offset.top-h.top)+o.sizeDiff.height),n=o.containerElement.get(0)===o.element.parent().get(0),a=/relative|absolute/.test(o.containerElement.css("position")),n&&a&&(i-=o.parentData.left),i+o.size.width>=o.parentData.width&&(o.size.width=o.parentData.width-i,u&&(o.size.height=o.size.width/o.aspectRatio)),s+o.size.height>=o.parentData.height&&(o.size.height=o.parentData.height-s,u&&(o.size.width=o.size.height*o.aspectRatio))},stop:function(){var t=e(this).data("ui-resizable"),i=t.options,s=t.containerOffset,n=t.containerPosition,a=t.containerElement,o=e(t.helper),r=o.offset(),h=o.outerWidth()-t.sizeDiff.width,l=o.outerHeight()-t.sizeDiff.height;t._helper&&!i.animate&&/relative/.test(a.css("position"))&&e(this).css({left:r.left-n.left-s.left,width:h,height:l}),t._helper&&!i.animate&&/static/.test(a.css("position"))&&e(this).css({left:r.left-n.left-s.left,width:h,height:l})}}),e.ui.plugin.add("resizable","alsoResize",{start:function(){var t=e(this).data("ui-resizable"),i=t.options,s=function(t){e(t).each(function(){var t=e(this);t.data("ui-resizable-alsoresize",{width:parseInt(t.width(),10),height:parseInt(t.height(),10),left:parseInt(t.css("left"),10),top:parseInt(t.css("top"),10)})})};"object"!=typeof i.alsoResize||i.alsoResize.parentNode?s(i.alsoResize):i.alsoResize.length?(i.alsoResize=i.alsoResize[0],s(i.alsoResize)):e.each(i.alsoResize,function(e){s(e)})},resize:function(t,i){var s=e(this).data("ui-resizable"),n=s.options,a=s.originalSize,o=s.originalPosition,r={height:s.size.height-a.height||0,width:s.size.width-a.width||0,top:s.position.top-o.top||0,left:s.position.left-o.left||0},h=function(t,s){e(t).each(function(){var t=e(this),n=e(this).data("ui-resizable-alsoresize"),a={},o=s&&s.length?s:t.parents(i.originalElement[0]).length?["width","height"]:["width","height","top","left"];e.each(o,function(e,t){var i=(n[t]||0)+(r[t]||0);i&&i>=0&&(a[t]=i||null)}),t.css(a)})};"object"!=typeof n.alsoResize||n.alsoResize.nodeType?h(n.alsoResize):e.each(n.alsoResize,function(e,t){h(e,t)})},stop:function(){e(this).removeData("resizable-alsoresize")}}),e.ui.plugin.add("resizable","ghost",{start:function(){var t=e(this).data("ui-resizable"),i=t.options,s=t.size;t.ghost=t.originalElement.clone(),t.ghost.css({opacity:.25,display:"block",position:"relative",height:s.height,width:s.width,margin:0,left:0,top:0}).addClass("ui-resizable-ghost").addClass("string"==typeof i.ghost?i.ghost:""),t.ghost.appendTo(t.helper)},resize:function(){var t=e(this).data("ui-resizable");t.ghost&&t.ghost.css({position:"relative",height:t.size.height,width:t.size.width})},stop:function(){var t=e(this).data("ui-resizable");t.ghost&&t.helper&&t.helper.get(0).removeChild(t.ghost.get(0))}}),e.ui.plugin.add("resizable","grid",{resize:function(){var t=e(this).data("ui-resizable"),i=t.options,s=t.size,n=t.originalSize,a=t.originalPosition,o=t.axis,r="number"==typeof i.grid?[i.grid,i.grid]:i.grid,h=r[0]||1,l=r[1]||1,u=Math.round((s.width-n.width)/h)*h,c=Math.round((s.height-n.height)/l)*l,d=n.width+u,p=n.height+c,f=i.maxWidth&&d>i.maxWidth,m=i.maxHeight&&p>i.maxHeight,g=i.minWidth&&i.minWidth>d,v=i.minHeight&&i.minHeight>p;i.grid=r,g&&(d+=h),v&&(p+=l),f&&(d-=h),m&&(p-=l),/^(se|s|e)$/.test(o)?(t.size.width=d,t.size.height=p):/^(ne)$/.test(o)?(t.size.width=d,t.size.height=p,t.position.top=a.top-c):/^(sw)$/.test(o)?(t.size.width=d,t.size.height=p,t.position.left=a.left-u):(t.size.width=d,t.size.height=p,t.position.top=a.top-c,t.position.left=a.left-u)}})})(jQuery);(function(e){e.widget("ui.selectable",e.ui.mouse,{version:"1.10.3",options:{appendTo:"body",autoRefresh:!0,distance:0,filter:"*",tolerance:"touch",selected:null,selecting:null,start:null,stop:null,unselected:null,unselecting:null},_create:function(){var t,i=this;this.element.addClass("ui-selectable"),this.dragged=!1,this.refresh=function(){t=e(i.options.filter,i.element[0]),t.addClass("ui-selectee"),t.each(function(){var t=e(this),i=t.offset();e.data(this,"selectable-item",{element:this,$element:t,left:i.left,top:i.top,right:i.left+t.outerWidth(),bottom:i.top+t.outerHeight(),startselected:!1,selected:t.hasClass("ui-selected"),selecting:t.hasClass("ui-selecting"),unselecting:t.hasClass("ui-unselecting")})})},this.refresh(),this.selectees=t.addClass("ui-selectee"),this._mouseInit(),this.helper=e("<div class='ui-selectable-helper'></div>")},_destroy:function(){this.selectees.removeClass("ui-selectee").removeData("selectable-item"),this.element.removeClass("ui-selectable ui-selectable-disabled"),this._mouseDestroy()},_mouseStart:function(t){var i=this,s=this.options;this.opos=[t.pageX,t.pageY],this.options.disabled||(this.selectees=e(s.filter,this.element[0]),this._trigger("start",t),e(s.appendTo).append(this.helper),this.helper.css({left:t.pageX,top:t.pageY,width:0,height:0}),s.autoRefresh&&this.refresh(),this.selectees.filter(".ui-selected").each(function(){var s=e.data(this,"selectable-item");s.startselected=!0,t.metaKey||t.ctrlKey||(s.$element.removeClass("ui-selected"),s.selected=!1,s.$element.addClass("ui-unselecting"),s.unselecting=!0,i._trigger("unselecting",t,{unselecting:s.element}))}),e(t.target).parents().addBack().each(function(){var s,n=e.data(this,"selectable-item");return n?(s=!t.metaKey&&!t.ctrlKey||!n.$element.hasClass("ui-selected"),n.$element.removeClass(s?"ui-unselecting":"ui-selected").addClass(s?"ui-selecting":"ui-unselecting"),n.unselecting=!s,n.selecting=s,n.selected=s,s?i._trigger("selecting",t,{selecting:n.element}):i._trigger("unselecting",t,{unselecting:n.element}),!1):undefined}))},_mouseDrag:function(t){if(this.dragged=!0,!this.options.disabled){var i,s=this,n=this.options,a=this.opos[0],o=this.opos[1],r=t.pageX,h=t.pageY;return a>r&&(i=r,r=a,a=i),o>h&&(i=h,h=o,o=i),this.helper.css({left:a,top:o,width:r-a,height:h-o}),this.selectees.each(function(){var i=e.data(this,"selectable-item"),l=!1;i&&i.element!==s.element[0]&&("touch"===n.tolerance?l=!(i.left>r||a>i.right||i.top>h||o>i.bottom):"fit"===n.tolerance&&(l=i.left>a&&r>i.right&&i.top>o&&h>i.bottom),l?(i.selected&&(i.$element.removeClass("ui-selected"),i.selected=!1),i.unselecting&&(i.$element.removeClass("ui-unselecting"),i.unselecting=!1),i.selecting||(i.$element.addClass("ui-selecting"),i.selecting=!0,s._trigger("selecting",t,{selecting:i.element}))):(i.selecting&&((t.metaKey||t.ctrlKey)&&i.startselected?(i.$element.removeClass("ui-selecting"),i.selecting=!1,i.$element.addClass("ui-selected"),i.selected=!0):(i.$element.removeClass("ui-selecting"),i.selecting=!1,i.startselected&&(i.$element.addClass("ui-unselecting"),i.unselecting=!0),s._trigger("unselecting",t,{unselecting:i.element}))),i.selected&&(t.metaKey||t.ctrlKey||i.startselected||(i.$element.removeClass("ui-selected"),i.selected=!1,i.$element.addClass("ui-unselecting"),i.unselecting=!0,s._trigger("unselecting",t,{unselecting:i.element})))))}),!1}},_mouseStop:function(t){var i=this;return this.dragged=!1,e(".ui-unselecting",this.element[0]).each(function(){var s=e.data(this,"selectable-item");s.$element.removeClass("ui-unselecting"),s.unselecting=!1,s.startselected=!1,i._trigger("unselected",t,{unselected:s.element})}),e(".ui-selecting",this.element[0]).each(function(){var s=e.data(this,"selectable-item");s.$element.removeClass("ui-selecting").addClass("ui-selected"),s.selecting=!1,s.selected=!0,s.startselected=!0,i._trigger("selected",t,{selected:s.element})}),this._trigger("stop",t),this.helper.remove(),!1}})})(jQuery);(function(t){function e(t,e,i){return t>e&&e+i>t}function i(t){return/left|right/.test(t.css("float"))||/inline|table-cell/.test(t.css("display"))}t.widget("ui.sortable",t.ui.mouse,{version:"1.10.3",widgetEventPrefix:"sort",ready:!1,options:{appendTo:"parent",axis:!1,connectWith:!1,containment:!1,cursor:"auto",cursorAt:!1,dropOnEmpty:!0,forcePlaceholderSize:!1,forceHelperSize:!1,grid:!1,handle:!1,helper:"original",items:"> *",opacity:!1,placeholder:!1,revert:!1,scroll:!0,scrollSensitivity:20,scrollSpeed:20,scope:"default",tolerance:"intersect",zIndex:1e3,activate:null,beforeStop:null,change:null,deactivate:null,out:null,over:null,receive:null,remove:null,sort:null,start:null,stop:null,update:null},_create:function(){var t=this.options;this.containerCache={},this.element.addClass("ui-sortable"),this.refresh(),this.floating=this.items.length?"x"===t.axis||i(this.items[0].item):!1,this.offset=this.element.offset(),this._mouseInit(),this.ready=!0},_destroy:function(){this.element.removeClass("ui-sortable ui-sortable-disabled"),this._mouseDestroy();for(var t=this.items.length-1;t>=0;t--)this.items[t].item.removeData(this.widgetName+"-item");return this},_setOption:function(e,i){"disabled"===e?(this.options[e]=i,this.widget().toggleClass("ui-sortable-disabled",!!i)):t.Widget.prototype._setOption.apply(this,arguments)},_mouseCapture:function(e,i){var s=null,n=!1,a=this;return this.reverting?!1:this.options.disabled||"static"===this.options.type?!1:(this._refreshItems(e),t(e.target).parents().each(function(){return t.data(this,a.widgetName+"-item")===a?(s=t(this),!1):undefined}),t.data(e.target,a.widgetName+"-item")===a&&(s=t(e.target)),s?!this.options.handle||i||(t(this.options.handle,s).find("*").addBack().each(function(){this===e.target&&(n=!0)}),n)?(this.currentItem=s,this._removeCurrentsFromItems(),!0):!1:!1)},_mouseStart:function(e,i,s){var n,a,o=this.options;if(this.currentContainer=this,this.refreshPositions(),this.helper=this._createHelper(e),this._cacheHelperProportions(),this._cacheMargins(),this.scrollParent=this.helper.scrollParent(),this.offset=this.currentItem.offset(),this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left},t.extend(this.offset,{click:{left:e.pageX-this.offset.left,top:e.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()}),this.helper.css("position","absolute"),this.cssPosition=this.helper.css("position"),this.originalPosition=this._generatePosition(e),this.originalPageX=e.pageX,this.originalPageY=e.pageY,o.cursorAt&&this._adjustOffsetFromHelper(o.cursorAt),this.domPosition={prev:this.currentItem.prev()[0],parent:this.currentItem.parent()[0]},this.helper[0]!==this.currentItem[0]&&this.currentItem.hide(),this._createPlaceholder(),o.containment&&this._setContainment(),o.cursor&&"auto"!==o.cursor&&(a=this.document.find("body"),this.storedCursor=a.css("cursor"),a.css("cursor",o.cursor),this.storedStylesheet=t("<style>*{ cursor: "+o.cursor+" !important; }</style>").appendTo(a)),o.opacity&&(this.helper.css("opacity")&&(this._storedOpacity=this.helper.css("opacity")),this.helper.css("opacity",o.opacity)),o.zIndex&&(this.helper.css("zIndex")&&(this._storedZIndex=this.helper.css("zIndex")),this.helper.css("zIndex",o.zIndex)),this.scrollParent[0]!==document&&"HTML"!==this.scrollParent[0].tagName&&(this.overflowOffset=this.scrollParent.offset()),this._trigger("start",e,this._uiHash()),this._preserveHelperProportions||this._cacheHelperProportions(),!s)for(n=this.containers.length-1;n>=0;n--)this.containers[n]._trigger("activate",e,this._uiHash(this));return t.ui.ddmanager&&(t.ui.ddmanager.current=this),t.ui.ddmanager&&!o.dropBehaviour&&t.ui.ddmanager.prepareOffsets(this,e),this.dragging=!0,this.helper.addClass("ui-sortable-helper"),this._mouseDrag(e),!0},_mouseDrag:function(e){var i,s,n,a,o=this.options,r=!1;for(this.position=this._generatePosition(e),this.positionAbs=this._convertPositionTo("absolute"),this.lastPositionAbs||(this.lastPositionAbs=this.positionAbs),this.options.scroll&&(this.scrollParent[0]!==document&&"HTML"!==this.scrollParent[0].tagName?(this.overflowOffset.top+this.scrollParent[0].offsetHeight-e.pageY<o.scrollSensitivity?this.scrollParent[0].scrollTop=r=this.scrollParent[0].scrollTop+o.scrollSpeed:e.pageY-this.overflowOffset.top<o.scrollSensitivity&&(this.scrollParent[0].scrollTop=r=this.scrollParent[0].scrollTop-o.scrollSpeed),this.overflowOffset.left+this.scrollParent[0].offsetWidth-e.pageX<o.scrollSensitivity?this.scrollParent[0].scrollLeft=r=this.scrollParent[0].scrollLeft+o.scrollSpeed:e.pageX-this.overflowOffset.left<o.scrollSensitivity&&(this.scrollParent[0].scrollLeft=r=this.scrollParent[0].scrollLeft-o.scrollSpeed)):(e.pageY-t(document).scrollTop()<o.scrollSensitivity?r=t(document).scrollTop(t(document).scrollTop()-o.scrollSpeed):t(window).height()-(e.pageY-t(document).scrollTop())<o.scrollSensitivity&&(r=t(document).scrollTop(t(document).scrollTop()+o.scrollSpeed)),e.pageX-t(document).scrollLeft()<o.scrollSensitivity?r=t(document).scrollLeft(t(document).scrollLeft()-o.scrollSpeed):t(window).width()-(e.pageX-t(document).scrollLeft())<o.scrollSensitivity&&(r=t(document).scrollLeft(t(document).scrollLeft()+o.scrollSpeed))),r!==!1&&t.ui.ddmanager&&!o.dropBehaviour&&t.ui.ddmanager.prepareOffsets(this,e)),this.positionAbs=this._convertPositionTo("absolute"),this.options.axis&&"y"===this.options.axis||(this.helper[0].style.left=this.position.left+"px"),this.options.axis&&"x"===this.options.axis||(this.helper[0].style.top=this.position.top+"px"),i=this.items.length-1;i>=0;i--)if(s=this.items[i],n=s.item[0],a=this._intersectsWithPointer(s),a&&s.instance===this.currentContainer&&n!==this.currentItem[0]&&this.placeholder[1===a?"next":"prev"]()[0]!==n&&!t.contains(this.placeholder[0],n)&&("semi-dynamic"===this.options.type?!t.contains(this.element[0],n):!0)){if(this.direction=1===a?"down":"up","pointer"!==this.options.tolerance&&!this._intersectsWithSides(s))break;this._rearrange(e,s),this._trigger("change",e,this._uiHash());break}return this._contactContainers(e),t.ui.ddmanager&&t.ui.ddmanager.drag(this,e),this._trigger("sort",e,this._uiHash()),this.lastPositionAbs=this.positionAbs,!1},_mouseStop:function(e,i){if(e){if(t.ui.ddmanager&&!this.options.dropBehaviour&&t.ui.ddmanager.drop(this,e),this.options.revert){var s=this,n=this.placeholder.offset(),a=this.options.axis,o={};a&&"x"!==a||(o.left=n.left-this.offset.parent.left-this.margins.left+(this.offsetParent[0]===document.body?0:this.offsetParent[0].scrollLeft)),a&&"y"!==a||(o.top=n.top-this.offset.parent.top-this.margins.top+(this.offsetParent[0]===document.body?0:this.offsetParent[0].scrollTop)),this.reverting=!0,t(this.helper).animate(o,parseInt(this.options.revert,10)||500,function(){s._clear(e)})}else this._clear(e,i);return!1}},cancel:function(){if(this.dragging){this._mouseUp({target:null}),"original"===this.options.helper?this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper"):this.currentItem.show();for(var e=this.containers.length-1;e>=0;e--)this.containers[e]._trigger("deactivate",null,this._uiHash(this)),this.containers[e].containerCache.over&&(this.containers[e]._trigger("out",null,this._uiHash(this)),this.containers[e].containerCache.over=0)}return this.placeholder&&(this.placeholder[0].parentNode&&this.placeholder[0].parentNode.removeChild(this.placeholder[0]),"original"!==this.options.helper&&this.helper&&this.helper[0].parentNode&&this.helper.remove(),t.extend(this,{helper:null,dragging:!1,reverting:!1,_noFinalSort:null}),this.domPosition.prev?t(this.domPosition.prev).after(this.currentItem):t(this.domPosition.parent).prepend(this.currentItem)),this},serialize:function(e){var i=this._getItemsAsjQuery(e&&e.connected),s=[];return e=e||{},t(i).each(function(){var i=(t(e.item||this).attr(e.attribute||"id")||"").match(e.expression||/(.+)[\-=_](.+)/);i&&s.push((e.key||i[1]+"[]")+"="+(e.key&&e.expression?i[1]:i[2]))}),!s.length&&e.key&&s.push(e.key+"="),s.join("&")},toArray:function(e){var i=this._getItemsAsjQuery(e&&e.connected),s=[];return e=e||{},i.each(function(){s.push(t(e.item||this).attr(e.attribute||"id")||"")}),s},_intersectsWith:function(t){var e=this.positionAbs.left,i=e+this.helperProportions.width,s=this.positionAbs.top,n=s+this.helperProportions.height,a=t.left,o=a+t.width,r=t.top,h=r+t.height,l=this.offset.click.top,c=this.offset.click.left,u="x"===this.options.axis||s+l>r&&h>s+l,d="y"===this.options.axis||e+c>a&&o>e+c,p=u&&d;return"pointer"===this.options.tolerance||this.options.forcePointerForContainers||"pointer"!==this.options.tolerance&&this.helperProportions[this.floating?"width":"height"]>t[this.floating?"width":"height"]?p:e+this.helperProportions.width/2>a&&o>i-this.helperProportions.width/2&&s+this.helperProportions.height/2>r&&h>n-this.helperProportions.height/2},_intersectsWithPointer:function(t){var i="x"===this.options.axis||e(this.positionAbs.top+this.offset.click.top,t.top,t.height),s="y"===this.options.axis||e(this.positionAbs.left+this.offset.click.left,t.left,t.width),n=i&&s,a=this._getDragVerticalDirection(),o=this._getDragHorizontalDirection();return n?this.floating?o&&"right"===o||"down"===a?2:1:a&&("down"===a?2:1):!1},_intersectsWithSides:function(t){var i=e(this.positionAbs.top+this.offset.click.top,t.top+t.height/2,t.height),s=e(this.positionAbs.left+this.offset.click.left,t.left+t.width/2,t.width),n=this._getDragVerticalDirection(),a=this._getDragHorizontalDirection();return this.floating&&a?"right"===a&&s||"left"===a&&!s:n&&("down"===n&&i||"up"===n&&!i)},_getDragVerticalDirection:function(){var t=this.positionAbs.top-this.lastPositionAbs.top;return 0!==t&&(t>0?"down":"up")},_getDragHorizontalDirection:function(){var t=this.positionAbs.left-this.lastPositionAbs.left;return 0!==t&&(t>0?"right":"left")},refresh:function(t){return this._refreshItems(t),this.refreshPositions(),this},_connectWith:function(){var t=this.options;return t.connectWith.constructor===String?[t.connectWith]:t.connectWith},_getItemsAsjQuery:function(e){var i,s,n,a,o=[],r=[],h=this._connectWith();if(h&&e)for(i=h.length-1;i>=0;i--)for(n=t(h[i]),s=n.length-1;s>=0;s--)a=t.data(n[s],this.widgetFullName),a&&a!==this&&!a.options.disabled&&r.push([t.isFunction(a.options.items)?a.options.items.call(a.element):t(a.options.items,a.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),a]);for(r.push([t.isFunction(this.options.items)?this.options.items.call(this.element,null,{options:this.options,item:this.currentItem}):t(this.options.items,this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),this]),i=r.length-1;i>=0;i--)r[i][0].each(function(){o.push(this)});return t(o)},_removeCurrentsFromItems:function(){var e=this.currentItem.find(":data("+this.widgetName+"-item)");this.items=t.grep(this.items,function(t){for(var i=0;e.length>i;i++)if(e[i]===t.item[0])return!1;return!0})},_refreshItems:function(e){this.items=[],this.containers=[this];var i,s,n,a,o,r,h,l,c=this.items,u=[[t.isFunction(this.options.items)?this.options.items.call(this.element[0],e,{item:this.currentItem}):t(this.options.items,this.element),this]],d=this._connectWith();if(d&&this.ready)for(i=d.length-1;i>=0;i--)for(n=t(d[i]),s=n.length-1;s>=0;s--)a=t.data(n[s],this.widgetFullName),a&&a!==this&&!a.options.disabled&&(u.push([t.isFunction(a.options.items)?a.options.items.call(a.element[0],e,{item:this.currentItem}):t(a.options.items,a.element),a]),this.containers.push(a));for(i=u.length-1;i>=0;i--)for(o=u[i][1],r=u[i][0],s=0,l=r.length;l>s;s++)h=t(r[s]),h.data(this.widgetName+"-item",o),c.push({item:h,instance:o,width:0,height:0,left:0,top:0})},refreshPositions:function(e){this.offsetParent&&this.helper&&(this.offset.parent=this._getParentOffset());var i,s,n,a;for(i=this.items.length-1;i>=0;i--)s=this.items[i],s.instance!==this.currentContainer&&this.currentContainer&&s.item[0]!==this.currentItem[0]||(n=this.options.toleranceElement?t(this.options.toleranceElement,s.item):s.item,e||(s.width=n.outerWidth(),s.height=n.outerHeight()),a=n.offset(),s.left=a.left,s.top=a.top);if(this.options.custom&&this.options.custom.refreshContainers)this.options.custom.refreshContainers.call(this);else for(i=this.containers.length-1;i>=0;i--)a=this.containers[i].element.offset(),this.containers[i].containerCache.left=a.left,this.containers[i].containerCache.top=a.top,this.containers[i].containerCache.width=this.containers[i].element.outerWidth(),this.containers[i].containerCache.height=this.containers[i].element.outerHeight();return this},_createPlaceholder:function(e){e=e||this;var i,s=e.options;s.placeholder&&s.placeholder.constructor!==String||(i=s.placeholder,s.placeholder={element:function(){var s=e.currentItem[0].nodeName.toLowerCase(),n=t("<"+s+">",e.document[0]).addClass(i||e.currentItem[0].className+" ui-sortable-placeholder").removeClass("ui-sortable-helper");return"tr"===s?e.currentItem.children().each(function(){t("<td>&#160;</td>",e.document[0]).attr("colspan",t(this).attr("colspan")||1).appendTo(n)}):"img"===s&&n.attr("src",e.currentItem.attr("src")),i||n.css("visibility","hidden"),n},update:function(t,n){(!i||s.forcePlaceholderSize)&&(n.height()||n.height(e.currentItem.innerHeight()-parseInt(e.currentItem.css("paddingTop")||0,10)-parseInt(e.currentItem.css("paddingBottom")||0,10)),n.width()||n.width(e.currentItem.innerWidth()-parseInt(e.currentItem.css("paddingLeft")||0,10)-parseInt(e.currentItem.css("paddingRight")||0,10)))}}),e.placeholder=t(s.placeholder.element.call(e.element,e.currentItem)),e.currentItem.after(e.placeholder),s.placeholder.update(e,e.placeholder)},_contactContainers:function(s){var n,a,o,r,h,l,c,u,d,p,f=null,m=null;for(n=this.containers.length-1;n>=0;n--)if(!t.contains(this.currentItem[0],this.containers[n].element[0]))if(this._intersectsWith(this.containers[n].containerCache)){if(f&&t.contains(this.containers[n].element[0],f.element[0]))continue;f=this.containers[n],m=n}else this.containers[n].containerCache.over&&(this.containers[n]._trigger("out",s,this._uiHash(this)),this.containers[n].containerCache.over=0);if(f)if(1===this.containers.length)this.containers[m].containerCache.over||(this.containers[m]._trigger("over",s,this._uiHash(this)),this.containers[m].containerCache.over=1);else{for(o=1e4,r=null,p=f.floating||i(this.currentItem),h=p?"left":"top",l=p?"width":"height",c=this.positionAbs[h]+this.offset.click[h],a=this.items.length-1;a>=0;a--)t.contains(this.containers[m].element[0],this.items[a].item[0])&&this.items[a].item[0]!==this.currentItem[0]&&(!p||e(this.positionAbs.top+this.offset.click.top,this.items[a].top,this.items[a].height))&&(u=this.items[a].item.offset()[h],d=!1,Math.abs(u-c)>Math.abs(u+this.items[a][l]-c)&&(d=!0,u+=this.items[a][l]),o>Math.abs(u-c)&&(o=Math.abs(u-c),r=this.items[a],this.direction=d?"up":"down"));if(!r&&!this.options.dropOnEmpty)return;if(this.currentContainer===this.containers[m])return;r?this._rearrange(s,r,null,!0):this._rearrange(s,null,this.containers[m].element,!0),this._trigger("change",s,this._uiHash()),this.containers[m]._trigger("change",s,this._uiHash(this)),this.currentContainer=this.containers[m],this.options.placeholder.update(this.currentContainer,this.placeholder),this.containers[m]._trigger("over",s,this._uiHash(this)),this.containers[m].containerCache.over=1}},_createHelper:function(e){var i=this.options,s=t.isFunction(i.helper)?t(i.helper.apply(this.element[0],[e,this.currentItem])):"clone"===i.helper?this.currentItem.clone():this.currentItem;return s.parents("body").length||t("parent"!==i.appendTo?i.appendTo:this.currentItem[0].parentNode)[0].appendChild(s[0]),s[0]===this.currentItem[0]&&(this._storedCSS={width:this.currentItem[0].style.width,height:this.currentItem[0].style.height,position:this.currentItem.css("position"),top:this.currentItem.css("top"),left:this.currentItem.css("left")}),(!s[0].style.width||i.forceHelperSize)&&s.width(this.currentItem.width()),(!s[0].style.height||i.forceHelperSize)&&s.height(this.currentItem.height()),s},_adjustOffsetFromHelper:function(e){"string"==typeof e&&(e=e.split(" ")),t.isArray(e)&&(e={left:+e[0],top:+e[1]||0}),"left"in e&&(this.offset.click.left=e.left+this.margins.left),"right"in e&&(this.offset.click.left=this.helperProportions.width-e.right+this.margins.left),"top"in e&&(this.offset.click.top=e.top+this.margins.top),"bottom"in e&&(this.offset.click.top=this.helperProportions.height-e.bottom+this.margins.top)},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var e=this.offsetParent.offset();return"absolute"===this.cssPosition&&this.scrollParent[0]!==document&&t.contains(this.scrollParent[0],this.offsetParent[0])&&(e.left+=this.scrollParent.scrollLeft(),e.top+=this.scrollParent.scrollTop()),(this.offsetParent[0]===document.body||this.offsetParent[0].tagName&&"html"===this.offsetParent[0].tagName.toLowerCase()&&t.ui.ie)&&(e={top:0,left:0}),{top:e.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:e.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if("relative"===this.cssPosition){var t=this.currentItem.position();return{top:t.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:t.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.currentItem.css("marginLeft"),10)||0,top:parseInt(this.currentItem.css("marginTop"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var e,i,s,n=this.options;"parent"===n.containment&&(n.containment=this.helper[0].parentNode),("document"===n.containment||"window"===n.containment)&&(this.containment=[0-this.offset.relative.left-this.offset.parent.left,0-this.offset.relative.top-this.offset.parent.top,t("document"===n.containment?document:window).width()-this.helperProportions.width-this.margins.left,(t("document"===n.containment?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top]),/^(document|window|parent)$/.test(n.containment)||(e=t(n.containment)[0],i=t(n.containment).offset(),s="hidden"!==t(e).css("overflow"),this.containment=[i.left+(parseInt(t(e).css("borderLeftWidth"),10)||0)+(parseInt(t(e).css("paddingLeft"),10)||0)-this.margins.left,i.top+(parseInt(t(e).css("borderTopWidth"),10)||0)+(parseInt(t(e).css("paddingTop"),10)||0)-this.margins.top,i.left+(s?Math.max(e.scrollWidth,e.offsetWidth):e.offsetWidth)-(parseInt(t(e).css("borderLeftWidth"),10)||0)-(parseInt(t(e).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left,i.top+(s?Math.max(e.scrollHeight,e.offsetHeight):e.offsetHeight)-(parseInt(t(e).css("borderTopWidth"),10)||0)-(parseInt(t(e).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top])},_convertPositionTo:function(e,i){i||(i=this.position);var s="absolute"===e?1:-1,n="absolute"!==this.cssPosition||this.scrollParent[0]!==document&&t.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,a=/(html|body)/i.test(n[0].tagName);return{top:i.top+this.offset.relative.top*s+this.offset.parent.top*s-("fixed"===this.cssPosition?-this.scrollParent.scrollTop():a?0:n.scrollTop())*s,left:i.left+this.offset.relative.left*s+this.offset.parent.left*s-("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():a?0:n.scrollLeft())*s}},_generatePosition:function(e){var i,s,n=this.options,a=e.pageX,o=e.pageY,r="absolute"!==this.cssPosition||this.scrollParent[0]!==document&&t.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,h=/(html|body)/i.test(r[0].tagName);return"relative"!==this.cssPosition||this.scrollParent[0]!==document&&this.scrollParent[0]!==this.offsetParent[0]||(this.offset.relative=this._getRelativeOffset()),this.originalPosition&&(this.containment&&(e.pageX-this.offset.click.left<this.containment[0]&&(a=this.containment[0]+this.offset.click.left),e.pageY-this.offset.click.top<this.containment[1]&&(o=this.containment[1]+this.offset.click.top),e.pageX-this.offset.click.left>this.containment[2]&&(a=this.containment[2]+this.offset.click.left),e.pageY-this.offset.click.top>this.containment[3]&&(o=this.containment[3]+this.offset.click.top)),n.grid&&(i=this.originalPageY+Math.round((o-this.originalPageY)/n.grid[1])*n.grid[1],o=this.containment?i-this.offset.click.top>=this.containment[1]&&i-this.offset.click.top<=this.containment[3]?i:i-this.offset.click.top>=this.containment[1]?i-n.grid[1]:i+n.grid[1]:i,s=this.originalPageX+Math.round((a-this.originalPageX)/n.grid[0])*n.grid[0],a=this.containment?s-this.offset.click.left>=this.containment[0]&&s-this.offset.click.left<=this.containment[2]?s:s-this.offset.click.left>=this.containment[0]?s-n.grid[0]:s+n.grid[0]:s)),{top:o-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+("fixed"===this.cssPosition?-this.scrollParent.scrollTop():h?0:r.scrollTop()),left:a-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():h?0:r.scrollLeft())}},_rearrange:function(t,e,i,s){i?i[0].appendChild(this.placeholder[0]):e.item[0].parentNode.insertBefore(this.placeholder[0],"down"===this.direction?e.item[0]:e.item[0].nextSibling),this.counter=this.counter?++this.counter:1;var n=this.counter;this._delay(function(){n===this.counter&&this.refreshPositions(!s)})},_clear:function(t,e){this.reverting=!1;var i,s=[];if(!this._noFinalSort&&this.currentItem.parent().length&&this.placeholder.before(this.currentItem),this._noFinalSort=null,this.helper[0]===this.currentItem[0]){for(i in this._storedCSS)("auto"===this._storedCSS[i]||"static"===this._storedCSS[i])&&(this._storedCSS[i]="");this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")}else this.currentItem.show();for(this.fromOutside&&!e&&s.push(function(t){this._trigger("receive",t,this._uiHash(this.fromOutside))}),!this.fromOutside&&this.domPosition.prev===this.currentItem.prev().not(".ui-sortable-helper")[0]&&this.domPosition.parent===this.currentItem.parent()[0]||e||s.push(function(t){this._trigger("update",t,this._uiHash())}),this!==this.currentContainer&&(e||(s.push(function(t){this._trigger("remove",t,this._uiHash())}),s.push(function(t){return function(e){t._trigger("receive",e,this._uiHash(this))}}.call(this,this.currentContainer)),s.push(function(t){return function(e){t._trigger("update",e,this._uiHash(this))}}.call(this,this.currentContainer)))),i=this.containers.length-1;i>=0;i--)e||s.push(function(t){return function(e){t._trigger("deactivate",e,this._uiHash(this))}}.call(this,this.containers[i])),this.containers[i].containerCache.over&&(s.push(function(t){return function(e){t._trigger("out",e,this._uiHash(this))}}.call(this,this.containers[i])),this.containers[i].containerCache.over=0);if(this.storedCursor&&(this.document.find("body").css("cursor",this.storedCursor),this.storedStylesheet.remove()),this._storedOpacity&&this.helper.css("opacity",this._storedOpacity),this._storedZIndex&&this.helper.css("zIndex","auto"===this._storedZIndex?"":this._storedZIndex),this.dragging=!1,this.cancelHelperRemoval){if(!e){for(this._trigger("beforeStop",t,this._uiHash()),i=0;s.length>i;i++)s[i].call(this,t);this._trigger("stop",t,this._uiHash())}return this.fromOutside=!1,!1}if(e||this._trigger("beforeStop",t,this._uiHash()),this.placeholder[0].parentNode.removeChild(this.placeholder[0]),this.helper[0]!==this.currentItem[0]&&this.helper.remove(),this.helper=null,!e){for(i=0;s.length>i;i++)s[i].call(this,t);this._trigger("stop",t,this._uiHash())}return this.fromOutside=!1,!0},_trigger:function(){t.Widget.prototype._trigger.apply(this,arguments)===!1&&this.cancel()},_uiHash:function(e){var i=e||this;return{helper:i.helper,placeholder:i.placeholder||t([]),position:i.position,originalPosition:i.originalPosition,offset:i.positionAbs,item:i.currentItem,sender:e?e.element:null}}})})(jQuery);(function(t){var e=0,i={},s={};i.height=i.paddingTop=i.paddingBottom=i.borderTopWidth=i.borderBottomWidth="hide",s.height=s.paddingTop=s.paddingBottom=s.borderTopWidth=s.borderBottomWidth="show",t.widget("ui.accordion",{version:"1.10.3",options:{active:0,animate:{},collapsible:!1,event:"click",header:"> li > :first-child,> :not(li):even",heightStyle:"auto",icons:{activeHeader:"ui-icon-triangle-1-s",header:"ui-icon-triangle-1-e"},activate:null,beforeActivate:null},_create:function(){var e=this.options;this.prevShow=this.prevHide=t(),this.element.addClass("ui-accordion ui-widget ui-helper-reset").attr("role","tablist"),e.collapsible||e.active!==!1&&null!=e.active||(e.active=0),this._processPanels(),0>e.active&&(e.active+=this.headers.length),this._refresh()},_getCreateEventData:function(){return{header:this.active,panel:this.active.length?this.active.next():t(),content:this.active.length?this.active.next():t()}},_createIcons:function(){var e=this.options.icons;e&&(t("<span>").addClass("ui-accordion-header-icon ui-icon "+e.header).prependTo(this.headers),this.active.children(".ui-accordion-header-icon").removeClass(e.header).addClass(e.activeHeader),this.headers.addClass("ui-accordion-icons"))},_destroyIcons:function(){this.headers.removeClass("ui-accordion-icons").children(".ui-accordion-header-icon").remove()},_destroy:function(){var t;this.element.removeClass("ui-accordion ui-widget ui-helper-reset").removeAttr("role"),this.headers.removeClass("ui-accordion-header ui-accordion-header-active ui-helper-reset ui-state-default ui-corner-all ui-state-active ui-state-disabled ui-corner-top").removeAttr("role").removeAttr("aria-selected").removeAttr("aria-controls").removeAttr("tabIndex").each(function(){/^ui-accordion/.test(this.id)&&this.removeAttribute("id")}),this._destroyIcons(),t=this.headers.next().css("display","").removeAttr("role").removeAttr("aria-expanded").removeAttr("aria-hidden").removeAttr("aria-labelledby").removeClass("ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content ui-accordion-content-active ui-state-disabled").each(function(){/^ui-accordion/.test(this.id)&&this.removeAttribute("id")}),"content"!==this.options.heightStyle&&t.css("height","")},_setOption:function(t,e){return"active"===t?(this._activate(e),undefined):("event"===t&&(this.options.event&&this._off(this.headers,this.options.event),this._setupEvents(e)),this._super(t,e),"collapsible"!==t||e||this.options.active!==!1||this._activate(0),"icons"===t&&(this._destroyIcons(),e&&this._createIcons()),"disabled"===t&&this.headers.add(this.headers.next()).toggleClass("ui-state-disabled",!!e),undefined)},_keydown:function(e){if(!e.altKey&&!e.ctrlKey){var i=t.ui.keyCode,s=this.headers.length,n=this.headers.index(e.target),a=!1;switch(e.keyCode){case i.RIGHT:case i.DOWN:a=this.headers[(n+1)%s];break;case i.LEFT:case i.UP:a=this.headers[(n-1+s)%s];break;case i.SPACE:case i.ENTER:this._eventHandler(e);break;case i.HOME:a=this.headers[0];break;case i.END:a=this.headers[s-1]}a&&(t(e.target).attr("tabIndex",-1),t(a).attr("tabIndex",0),a.focus(),e.preventDefault())}},_panelKeyDown:function(e){e.keyCode===t.ui.keyCode.UP&&e.ctrlKey&&t(e.currentTarget).prev().focus()},refresh:function(){var e=this.options;this._processPanels(),e.active===!1&&e.collapsible===!0||!this.headers.length?(e.active=!1,this.active=t()):e.active===!1?this._activate(0):this.active.length&&!t.contains(this.element[0],this.active[0])?this.headers.length===this.headers.find(".ui-state-disabled").length?(e.active=!1,this.active=t()):this._activate(Math.max(0,e.active-1)):e.active=this.headers.index(this.active),this._destroyIcons(),this._refresh()},_processPanels:function(){this.headers=this.element.find(this.options.header).addClass("ui-accordion-header ui-helper-reset ui-state-default ui-corner-all"),this.headers.next().addClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom").filter(":not(.ui-accordion-content-active)").hide()},_refresh:function(){var i,s=this.options,n=s.heightStyle,a=this.element.parent(),o=this.accordionId="ui-accordion-"+(this.element.attr("id")||++e);this.active=this._findActive(s.active).addClass("ui-accordion-header-active ui-state-active ui-corner-top").removeClass("ui-corner-all"),this.active.next().addClass("ui-accordion-content-active").show(),this.headers.attr("role","tab").each(function(e){var i=t(this),s=i.attr("id"),n=i.next(),a=n.attr("id");s||(s=o+"-header-"+e,i.attr("id",s)),a||(a=o+"-panel-"+e,n.attr("id",a)),i.attr("aria-controls",a),n.attr("aria-labelledby",s)}).next().attr("role","tabpanel"),this.headers.not(this.active).attr({"aria-selected":"false",tabIndex:-1}).next().attr({"aria-expanded":"false","aria-hidden":"true"}).hide(),this.active.length?this.active.attr({"aria-selected":"true",tabIndex:0}).next().attr({"aria-expanded":"true","aria-hidden":"false"}):this.headers.eq(0).attr("tabIndex",0),this._createIcons(),this._setupEvents(s.event),"fill"===n?(i=a.height(),this.element.siblings(":visible").each(function(){var e=t(this),s=e.css("position");"absolute"!==s&&"fixed"!==s&&(i-=e.outerHeight(!0))}),this.headers.each(function(){i-=t(this).outerHeight(!0)}),this.headers.next().each(function(){t(this).height(Math.max(0,i-t(this).innerHeight()+t(this).height()))}).css("overflow","auto")):"auto"===n&&(i=0,this.headers.next().each(function(){i=Math.max(i,t(this).css("height","").height())}).height(i))},_activate:function(e){var i=this._findActive(e)[0];i!==this.active[0]&&(i=i||this.active[0],this._eventHandler({target:i,currentTarget:i,preventDefault:t.noop}))},_findActive:function(e){return"number"==typeof e?this.headers.eq(e):t()},_setupEvents:function(e){var i={keydown:"_keydown"};e&&t.each(e.split(" "),function(t,e){i[e]="_eventHandler"}),this._off(this.headers.add(this.headers.next())),this._on(this.headers,i),this._on(this.headers.next(),{keydown:"_panelKeyDown"}),this._hoverable(this.headers),this._focusable(this.headers)},_eventHandler:function(e){var i=this.options,s=this.active,n=t(e.currentTarget),a=n[0]===s[0],o=a&&i.collapsible,r=o?t():n.next(),h=s.next(),l={oldHeader:s,oldPanel:h,newHeader:o?t():n,newPanel:r};e.preventDefault(),a&&!i.collapsible||this._trigger("beforeActivate",e,l)===!1||(i.active=o?!1:this.headers.index(n),this.active=a?t():n,this._toggle(l),s.removeClass("ui-accordion-header-active ui-state-active"),i.icons&&s.children(".ui-accordion-header-icon").removeClass(i.icons.activeHeader).addClass(i.icons.header),a||(n.removeClass("ui-corner-all").addClass("ui-accordion-header-active ui-state-active ui-corner-top"),i.icons&&n.children(".ui-accordion-header-icon").removeClass(i.icons.header).addClass(i.icons.activeHeader),n.next().addClass("ui-accordion-content-active")))},_toggle:function(e){var i=e.newPanel,s=this.prevShow.length?this.prevShow:e.oldPanel;this.prevShow.add(this.prevHide).stop(!0,!0),this.prevShow=i,this.prevHide=s,this.options.animate?this._animate(i,s,e):(s.hide(),i.show(),this._toggleComplete(e)),s.attr({"aria-expanded":"false","aria-hidden":"true"}),s.prev().attr("aria-selected","false"),i.length&&s.length?s.prev().attr("tabIndex",-1):i.length&&this.headers.filter(function(){return 0===t(this).attr("tabIndex")}).attr("tabIndex",-1),i.attr({"aria-expanded":"true","aria-hidden":"false"}).prev().attr({"aria-selected":"true",tabIndex:0})},_animate:function(t,e,n){var a,o,r,h=this,l=0,c=t.length&&(!e.length||t.index()<e.index()),u=this.options.animate||{},d=c&&u.down||u,p=function(){h._toggleComplete(n)};return"number"==typeof d&&(r=d),"string"==typeof d&&(o=d),o=o||d.easing||u.easing,r=r||d.duration||u.duration,e.length?t.length?(a=t.show().outerHeight(),e.animate(i,{duration:r,easing:o,step:function(t,e){e.now=Math.round(t)}}),t.hide().animate(s,{duration:r,easing:o,complete:p,step:function(t,i){i.now=Math.round(t),"height"!==i.prop?l+=i.now:"content"!==h.options.heightStyle&&(i.now=Math.round(a-e.outerHeight()-l),l=0)}}),undefined):e.animate(i,r,o,p):t.animate(s,r,o,p)},_toggleComplete:function(t){var e=t.oldPanel;e.removeClass("ui-accordion-content-active").prev().removeClass("ui-corner-top").addClass("ui-corner-all"),e.length&&(e.parent()[0].className=e.parent()[0].className),this._trigger("activate",null,t)}})})(jQuery);(function(t){var e=0;t.widget("ui.autocomplete",{version:"1.10.3",defaultElement:"<input>",options:{appendTo:null,autoFocus:!1,delay:300,minLength:1,position:{my:"left top",at:"left bottom",collision:"none"},source:null,change:null,close:null,focus:null,open:null,response:null,search:null,select:null},pending:0,_create:function(){var e,i,s,n=this.element[0].nodeName.toLowerCase(),a="textarea"===n,o="input"===n;this.isMultiLine=a?!0:o?!1:this.element.prop("isContentEditable"),this.valueMethod=this.element[a||o?"val":"text"],this.isNewMenu=!0,this.element.addClass("ui-autocomplete-input").attr("autocomplete","off"),this._on(this.element,{keydown:function(n){if(this.element.prop("readOnly"))return e=!0,s=!0,i=!0,undefined;e=!1,s=!1,i=!1;var a=t.ui.keyCode;switch(n.keyCode){case a.PAGE_UP:e=!0,this._move("previousPage",n);break;case a.PAGE_DOWN:e=!0,this._move("nextPage",n);break;case a.UP:e=!0,this._keyEvent("previous",n);break;case a.DOWN:e=!0,this._keyEvent("next",n);break;case a.ENTER:case a.NUMPAD_ENTER:this.menu.active&&(e=!0,n.preventDefault(),this.menu.select(n));break;case a.TAB:this.menu.active&&this.menu.select(n);break;case a.ESCAPE:this.menu.element.is(":visible")&&(this._value(this.term),this.close(n),n.preventDefault());break;default:i=!0,this._searchTimeout(n)}},keypress:function(s){if(e)return e=!1,(!this.isMultiLine||this.menu.element.is(":visible"))&&s.preventDefault(),undefined;if(!i){var n=t.ui.keyCode;switch(s.keyCode){case n.PAGE_UP:this._move("previousPage",s);break;case n.PAGE_DOWN:this._move("nextPage",s);break;case n.UP:this._keyEvent("previous",s);break;case n.DOWN:this._keyEvent("next",s)}}},input:function(t){return s?(s=!1,t.preventDefault(),undefined):(this._searchTimeout(t),undefined)},focus:function(){this.selectedItem=null,this.previous=this._value()},blur:function(t){return this.cancelBlur?(delete this.cancelBlur,undefined):(clearTimeout(this.searching),this.close(t),this._change(t),undefined)}}),this._initSource(),this.menu=t("<ul>").addClass("ui-autocomplete ui-front").appendTo(this._appendTo()).menu({role:null}).hide().data("ui-menu"),this._on(this.menu.element,{mousedown:function(e){e.preventDefault(),this.cancelBlur=!0,this._delay(function(){delete this.cancelBlur});var i=this.menu.element[0];t(e.target).closest(".ui-menu-item").length||this._delay(function(){var e=this;this.document.one("mousedown",function(s){s.target===e.element[0]||s.target===i||t.contains(i,s.target)||e.close()})})},menufocus:function(e,i){if(this.isNewMenu&&(this.isNewMenu=!1,e.originalEvent&&/^mouse/.test(e.originalEvent.type)))return this.menu.blur(),this.document.one("mousemove",function(){t(e.target).trigger(e.originalEvent)}),undefined;var s=i.item.data("ui-autocomplete-item");!1!==this._trigger("focus",e,{item:s})?e.originalEvent&&/^key/.test(e.originalEvent.type)&&this._value(s.value):this.liveRegion.text(s.value)},menuselect:function(t,e){var i=e.item.data("ui-autocomplete-item"),s=this.previous;this.element[0]!==this.document[0].activeElement&&(this.element.focus(),this.previous=s,this._delay(function(){this.previous=s,this.selectedItem=i})),!1!==this._trigger("select",t,{item:i})&&this._value(i.value),this.term=this._value(),this.close(t),this.selectedItem=i}}),this.liveRegion=t("<span>",{role:"status","aria-live":"polite"}).addClass("ui-helper-hidden-accessible").insertBefore(this.element),this._on(this.window,{beforeunload:function(){this.element.removeAttr("autocomplete")}})},_destroy:function(){clearTimeout(this.searching),this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete"),this.menu.element.remove(),this.liveRegion.remove()},_setOption:function(t,e){this._super(t,e),"source"===t&&this._initSource(),"appendTo"===t&&this.menu.element.appendTo(this._appendTo()),"disabled"===t&&e&&this.xhr&&this.xhr.abort()},_appendTo:function(){var e=this.options.appendTo;return e&&(e=e.jquery||e.nodeType?t(e):this.document.find(e).eq(0)),e||(e=this.element.closest(".ui-front")),e.length||(e=this.document[0].body),e},_initSource:function(){var e,i,s=this;t.isArray(this.options.source)?(e=this.options.source,this.source=function(i,s){s(t.ui.autocomplete.filter(e,i.term))}):"string"==typeof this.options.source?(i=this.options.source,this.source=function(e,n){s.xhr&&s.xhr.abort(),s.xhr=t.ajax({url:i,data:e,dataType:"json",success:function(t){n(t)},error:function(){n([])}})}):this.source=this.options.source},_searchTimeout:function(t){clearTimeout(this.searching),this.searching=this._delay(function(){this.term!==this._value()&&(this.selectedItem=null,this.search(null,t))},this.options.delay)},search:function(t,e){return t=null!=t?t:this._value(),this.term=this._value(),t.length<this.options.minLength?this.close(e):this._trigger("search",e)!==!1?this._search(t):undefined},_search:function(t){this.pending++,this.element.addClass("ui-autocomplete-loading"),this.cancelSearch=!1,this.source({term:t},this._response())},_response:function(){var t=this,i=++e;return function(s){i===e&&t.__response(s),t.pending--,t.pending||t.element.removeClass("ui-autocomplete-loading")}},__response:function(t){t&&(t=this._normalize(t)),this._trigger("response",null,{content:t}),!this.options.disabled&&t&&t.length&&!this.cancelSearch?(this._suggest(t),this._trigger("open")):this._close()},close:function(t){this.cancelSearch=!0,this._close(t)},_close:function(t){this.menu.element.is(":visible")&&(this.menu.element.hide(),this.menu.blur(),this.isNewMenu=!0,this._trigger("close",t))},_change:function(t){this.previous!==this._value()&&this._trigger("change",t,{item:this.selectedItem})},_normalize:function(e){return e.length&&e[0].label&&e[0].value?e:t.map(e,function(e){return"string"==typeof e?{label:e,value:e}:t.extend({label:e.label||e.value,value:e.value||e.label},e)})},_suggest:function(e){var i=this.menu.element.empty();this._renderMenu(i,e),this.isNewMenu=!0,this.menu.refresh(),i.show(),this._resizeMenu(),i.position(t.extend({of:this.element},this.options.position)),this.options.autoFocus&&this.menu.next()},_resizeMenu:function(){var t=this.menu.element;t.outerWidth(Math.max(t.width("").outerWidth()+1,this.element.outerWidth()))},_renderMenu:function(e,i){var s=this;t.each(i,function(t,i){s._renderItemData(e,i)})},_renderItemData:function(t,e){return this._renderItem(t,e).data("ui-autocomplete-item",e)},_renderItem:function(e,i){return t("<li>").append(t("<a>").text(i.label)).appendTo(e)},_move:function(t,e){return this.menu.element.is(":visible")?this.menu.isFirstItem()&&/^previous/.test(t)||this.menu.isLastItem()&&/^next/.test(t)?(this._value(this.term),this.menu.blur(),undefined):(this.menu[t](e),undefined):(this.search(null,e),undefined)},widget:function(){return this.menu.element},_value:function(){return this.valueMethod.apply(this.element,arguments)},_keyEvent:function(t,e){(!this.isMultiLine||this.menu.element.is(":visible"))&&(this._move(t,e),e.preventDefault())}}),t.extend(t.ui.autocomplete,{escapeRegex:function(t){return t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")},filter:function(e,i){var s=RegExp(t.ui.autocomplete.escapeRegex(i),"i");return t.grep(e,function(t){return s.test(t.label||t.value||t)})}}),t.widget("ui.autocomplete",t.ui.autocomplete,{options:{messages:{noResults:"No search results.",results:function(t){return t+(t>1?" results are":" result is")+" available, use up and down arrow keys to navigate."}}},__response:function(t){var e;this._superApply(arguments),this.options.disabled||this.cancelSearch||(e=t&&t.length?this.options.messages.results(t.length):this.options.messages.noResults,this.liveRegion.text(e))}})})(jQuery);(function(t){var e,i,s,n,a="ui-button ui-widget ui-state-default ui-corner-all",o="ui-state-hover ui-state-active ",r="ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only",h=function(){var e=t(this);setTimeout(function(){e.find(":ui-button").button("refresh")},1)},l=function(e){var i=e.name,s=e.form,n=t([]);return i&&(i=i.replace(/'/g,"\\'"),n=s?t(s).find("[name='"+i+"']"):t("[name='"+i+"']",e.ownerDocument).filter(function(){return!this.form})),n};t.widget("ui.button",{version:"1.10.3",defaultElement:"<button>",options:{disabled:null,text:!0,label:null,icons:{primary:null,secondary:null}},_create:function(){this.element.closest("form").unbind("reset"+this.eventNamespace).bind("reset"+this.eventNamespace,h),"boolean"!=typeof this.options.disabled?this.options.disabled=!!this.element.prop("disabled"):this.element.prop("disabled",this.options.disabled),this._determineButtonType(),this.hasTitle=!!this.buttonElement.attr("title");var o=this,r=this.options,c="checkbox"===this.type||"radio"===this.type,u=c?"":"ui-state-active",d="ui-state-focus";null===r.label&&(r.label="input"===this.type?this.buttonElement.val():this.buttonElement.html()),this._hoverable(this.buttonElement),this.buttonElement.addClass(a).attr("role","button").bind("mouseenter"+this.eventNamespace,function(){r.disabled||this===e&&t(this).addClass("ui-state-active")}).bind("mouseleave"+this.eventNamespace,function(){r.disabled||t(this).removeClass(u)}).bind("click"+this.eventNamespace,function(t){r.disabled&&(t.preventDefault(),t.stopImmediatePropagation())}),this.element.bind("focus"+this.eventNamespace,function(){o.buttonElement.addClass(d)}).bind("blur"+this.eventNamespace,function(){o.buttonElement.removeClass(d)}),c&&(this.element.bind("change"+this.eventNamespace,function(){n||o.refresh()}),this.buttonElement.bind("mousedown"+this.eventNamespace,function(t){r.disabled||(n=!1,i=t.pageX,s=t.pageY)}).bind("mouseup"+this.eventNamespace,function(t){r.disabled||(i!==t.pageX||s!==t.pageY)&&(n=!0)})),"checkbox"===this.type?this.buttonElement.bind("click"+this.eventNamespace,function(){return r.disabled||n?!1:undefined}):"radio"===this.type?this.buttonElement.bind("click"+this.eventNamespace,function(){if(r.disabled||n)return!1;t(this).addClass("ui-state-active"),o.buttonElement.attr("aria-pressed","true");var e=o.element[0];l(e).not(e).map(function(){return t(this).button("widget")[0]}).removeClass("ui-state-active").attr("aria-pressed","false")}):(this.buttonElement.bind("mousedown"+this.eventNamespace,function(){return r.disabled?!1:(t(this).addClass("ui-state-active"),e=this,o.document.one("mouseup",function(){e=null}),undefined)}).bind("mouseup"+this.eventNamespace,function(){return r.disabled?!1:(t(this).removeClass("ui-state-active"),undefined)}).bind("keydown"+this.eventNamespace,function(e){return r.disabled?!1:((e.keyCode===t.ui.keyCode.SPACE||e.keyCode===t.ui.keyCode.ENTER)&&t(this).addClass("ui-state-active"),undefined)}).bind("keyup"+this.eventNamespace+" blur"+this.eventNamespace,function(){t(this).removeClass("ui-state-active")}),this.buttonElement.is("a")&&this.buttonElement.keyup(function(e){e.keyCode===t.ui.keyCode.SPACE&&t(this).click()})),this._setOption("disabled",r.disabled),this._resetButton()},_determineButtonType:function(){var t,e,i;this.type=this.element.is("[type=checkbox]")?"checkbox":this.element.is("[type=radio]")?"radio":this.element.is("input")?"input":"button","checkbox"===this.type||"radio"===this.type?(t=this.element.parents().last(),e="label[for='"+this.element.attr("id")+"']",this.buttonElement=t.find(e),this.buttonElement.length||(t=t.length?t.siblings():this.element.siblings(),this.buttonElement=t.filter(e),this.buttonElement.length||(this.buttonElement=t.find(e))),this.element.addClass("ui-helper-hidden-accessible"),i=this.element.is(":checked"),i&&this.buttonElement.addClass("ui-state-active"),this.buttonElement.prop("aria-pressed",i)):this.buttonElement=this.element},widget:function(){return this.buttonElement},_destroy:function(){this.element.removeClass("ui-helper-hidden-accessible"),this.buttonElement.removeClass(a+" "+o+" "+r).removeAttr("role").removeAttr("aria-pressed").html(this.buttonElement.find(".ui-button-text").html()),this.hasTitle||this.buttonElement.removeAttr("title")},_setOption:function(t,e){return this._super(t,e),"disabled"===t?(e?this.element.prop("disabled",!0):this.element.prop("disabled",!1),undefined):(this._resetButton(),undefined)},refresh:function(){var e=this.element.is("input, button")?this.element.is(":disabled"):this.element.hasClass("ui-button-disabled");e!==this.options.disabled&&this._setOption("disabled",e),"radio"===this.type?l(this.element[0]).each(function(){t(this).is(":checked")?t(this).button("widget").addClass("ui-state-active").attr("aria-pressed","true"):t(this).button("widget").removeClass("ui-state-active").attr("aria-pressed","false")}):"checkbox"===this.type&&(this.element.is(":checked")?this.buttonElement.addClass("ui-state-active").attr("aria-pressed","true"):this.buttonElement.removeClass("ui-state-active").attr("aria-pressed","false"))},_resetButton:function(){if("input"===this.type)return this.options.label&&this.element.val(this.options.label),undefined;var e=this.buttonElement.removeClass(r),i=t("<span></span>",this.document[0]).addClass("ui-button-text").html(this.options.label).appendTo(e.empty()).text(),s=this.options.icons,n=s.primary&&s.secondary,a=[];s.primary||s.secondary?(this.options.text&&a.push("ui-button-text-icon"+(n?"s":s.primary?"-primary":"-secondary")),s.primary&&e.prepend("<span class='ui-button-icon-primary ui-icon "+s.primary+"'></span>"),s.secondary&&e.append("<span class='ui-button-icon-secondary ui-icon "+s.secondary+"'></span>"),this.options.text||(a.push(n?"ui-button-icons-only":"ui-button-icon-only"),this.hasTitle||e.attr("title",t.trim(i)))):a.push("ui-button-text-only"),e.addClass(a.join(" "))}}),t.widget("ui.buttonset",{version:"1.10.3",options:{items:"button, input[type=button], input[type=submit], input[type=reset], input[type=checkbox], input[type=radio], a, :data(ui-button)"},_create:function(){this.element.addClass("ui-buttonset")},_init:function(){this.refresh()},_setOption:function(t,e){"disabled"===t&&this.buttons.button("option",t,e),this._super(t,e)},refresh:function(){var e="rtl"===this.element.css("direction");this.buttons=this.element.find(this.options.items).filter(":ui-button").button("refresh").end().not(":ui-button").button().end().map(function(){return t(this).button("widget")[0]}).removeClass("ui-corner-all ui-corner-left ui-corner-right").filter(":first").addClass(e?"ui-corner-right":"ui-corner-left").end().filter(":last").addClass(e?"ui-corner-left":"ui-corner-right").end().end()},_destroy:function(){this.element.removeClass("ui-buttonset"),this.buttons.map(function(){return t(this).button("widget")[0]}).removeClass("ui-corner-left ui-corner-right").end().button("destroy")}})})(jQuery);(function(t,e){function i(){this._curInst=null,this._keyEvent=!1,this._disabledInputs=[],this._datepickerShowing=!1,this._inDialog=!1,this._mainDivId="ui-datepicker-div",this._inlineClass="ui-datepicker-inline",this._appendClass="ui-datepicker-append",this._triggerClass="ui-datepicker-trigger",this._dialogClass="ui-datepicker-dialog",this._disableClass="ui-datepicker-disabled",this._unselectableClass="ui-datepicker-unselectable",this._currentClass="ui-datepicker-current-day",this._dayOverClass="ui-datepicker-days-cell-over",this.regional=[],this.regional[""]={closeText:"Done",prevText:"Prev",nextText:"Next",currentText:"Today",monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],dayNamesMin:["Su","Mo","Tu","We","Th","Fr","Sa"],weekHeader:"Wk",dateFormat:"mm/dd/yy",firstDay:0,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},this._defaults={showOn:"focus",showAnim:"fadeIn",showOptions:{},defaultDate:null,appendText:"",buttonText:"...",buttonImage:"",buttonImageOnly:!1,hideIfNoPrevNext:!1,navigationAsDateFormat:!1,gotoCurrent:!1,changeMonth:!1,changeYear:!1,yearRange:"c-10:c+10",showOtherMonths:!1,selectOtherMonths:!1,showWeek:!1,calculateWeek:this.iso8601Week,shortYearCutoff:"+10",minDate:null,maxDate:null,duration:"fast",beforeShowDay:null,beforeShow:null,onSelect:null,onChangeMonthYear:null,onClose:null,numberOfMonths:1,showCurrentAtPos:0,stepMonths:1,stepBigMonths:12,altField:"",altFormat:"",constrainInput:!0,showButtonPanel:!1,autoSize:!1,disabled:!1},t.extend(this._defaults,this.regional[""]),this.dpDiv=s(t("<div id='"+this._mainDivId+"' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"))}function s(e){var i="button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";return e.delegate(i,"mouseout",function(){t(this).removeClass("ui-state-hover"),-1!==this.className.indexOf("ui-datepicker-prev")&&t(this).removeClass("ui-datepicker-prev-hover"),-1!==this.className.indexOf("ui-datepicker-next")&&t(this).removeClass("ui-datepicker-next-hover")}).delegate(i,"mouseover",function(){t.datepicker._isDisabledDatepicker(a.inline?e.parent()[0]:a.input[0])||(t(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover"),t(this).addClass("ui-state-hover"),-1!==this.className.indexOf("ui-datepicker-prev")&&t(this).addClass("ui-datepicker-prev-hover"),-1!==this.className.indexOf("ui-datepicker-next")&&t(this).addClass("ui-datepicker-next-hover"))})}function n(e,i){t.extend(e,i);for(var s in i)null==i[s]&&(e[s]=i[s]);return e}t.extend(t.ui,{datepicker:{version:"1.10.3"}});var a,r="datepicker";t.extend(i.prototype,{markerClassName:"hasDatepicker",maxRows:4,_widgetDatepicker:function(){return this.dpDiv},setDefaults:function(t){return n(this._defaults,t||{}),this},_attachDatepicker:function(e,i){var s,n,a;s=e.nodeName.toLowerCase(),n="div"===s||"span"===s,e.id||(this.uuid+=1,e.id="dp"+this.uuid),a=this._newInst(t(e),n),a.settings=t.extend({},i||{}),"input"===s?this._connectDatepicker(e,a):n&&this._inlineDatepicker(e,a)},_newInst:function(e,i){var n=e[0].id.replace(/([^A-Za-z0-9_\-])/g,"\\\\$1");return{id:n,input:e,selectedDay:0,selectedMonth:0,selectedYear:0,drawMonth:0,drawYear:0,inline:i,dpDiv:i?s(t("<div class='"+this._inlineClass+" ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>")):this.dpDiv}},_connectDatepicker:function(e,i){var s=t(e);i.append=t([]),i.trigger=t([]),s.hasClass(this.markerClassName)||(this._attachments(s,i),s.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).keyup(this._doKeyUp),this._autoSize(i),t.data(e,r,i),i.settings.disabled&&this._disableDatepicker(e))},_attachments:function(e,i){var s,n,a,r=this._get(i,"appendText"),o=this._get(i,"isRTL");i.append&&i.append.remove(),r&&(i.append=t("<span class='"+this._appendClass+"'>"+r+"</span>"),e[o?"before":"after"](i.append)),e.unbind("focus",this._showDatepicker),i.trigger&&i.trigger.remove(),s=this._get(i,"showOn"),("focus"===s||"both"===s)&&e.focus(this._showDatepicker),("button"===s||"both"===s)&&(n=this._get(i,"buttonText"),a=this._get(i,"buttonImage"),i.trigger=t(this._get(i,"buttonImageOnly")?t("<img/>").addClass(this._triggerClass).attr({src:a,alt:n,title:n}):t("<button type='button'></button>").addClass(this._triggerClass).html(a?t("<img/>").attr({src:a,alt:n,title:n}):n)),e[o?"before":"after"](i.trigger),i.trigger.click(function(){return t.datepicker._datepickerShowing&&t.datepicker._lastInput===e[0]?t.datepicker._hideDatepicker():t.datepicker._datepickerShowing&&t.datepicker._lastInput!==e[0]?(t.datepicker._hideDatepicker(),t.datepicker._showDatepicker(e[0])):t.datepicker._showDatepicker(e[0]),!1}))},_autoSize:function(t){if(this._get(t,"autoSize")&&!t.inline){var e,i,s,n,a=new Date(2009,11,20),r=this._get(t,"dateFormat");r.match(/[DM]/)&&(e=function(t){for(i=0,s=0,n=0;t.length>n;n++)t[n].length>i&&(i=t[n].length,s=n);return s},a.setMonth(e(this._get(t,r.match(/MM/)?"monthNames":"monthNamesShort"))),a.setDate(e(this._get(t,r.match(/DD/)?"dayNames":"dayNamesShort"))+20-a.getDay())),t.input.attr("size",this._formatDate(t,a).length)}},_inlineDatepicker:function(e,i){var s=t(e);s.hasClass(this.markerClassName)||(s.addClass(this.markerClassName).append(i.dpDiv),t.data(e,r,i),this._setDate(i,this._getDefaultDate(i),!0),this._updateDatepicker(i),this._updateAlternate(i),i.settings.disabled&&this._disableDatepicker(e),i.dpDiv.css("display","block"))},_dialogDatepicker:function(e,i,s,a,o){var h,l,c,u,d,p=this._dialogInst;return p||(this.uuid+=1,h="dp"+this.uuid,this._dialogInput=t("<input type='text' id='"+h+"' style='position: absolute; top: -100px; width: 0px;'/>"),this._dialogInput.keydown(this._doKeyDown),t("body").append(this._dialogInput),p=this._dialogInst=this._newInst(this._dialogInput,!1),p.settings={},t.data(this._dialogInput[0],r,p)),n(p.settings,a||{}),i=i&&i.constructor===Date?this._formatDate(p,i):i,this._dialogInput.val(i),this._pos=o?o.length?o:[o.pageX,o.pageY]:null,this._pos||(l=document.documentElement.clientWidth,c=document.documentElement.clientHeight,u=document.documentElement.scrollLeft||document.body.scrollLeft,d=document.documentElement.scrollTop||document.body.scrollTop,this._pos=[l/2-100+u,c/2-150+d]),this._dialogInput.css("left",this._pos[0]+20+"px").css("top",this._pos[1]+"px"),p.settings.onSelect=s,this._inDialog=!0,this.dpDiv.addClass(this._dialogClass),this._showDatepicker(this._dialogInput[0]),t.blockUI&&t.blockUI(this.dpDiv),t.data(this._dialogInput[0],r,p),this},_destroyDatepicker:function(e){var i,s=t(e),n=t.data(e,r);s.hasClass(this.markerClassName)&&(i=e.nodeName.toLowerCase(),t.removeData(e,r),"input"===i?(n.append.remove(),n.trigger.remove(),s.removeClass(this.markerClassName).unbind("focus",this._showDatepicker).unbind("keydown",this._doKeyDown).unbind("keypress",this._doKeyPress).unbind("keyup",this._doKeyUp)):("div"===i||"span"===i)&&s.removeClass(this.markerClassName).empty())},_enableDatepicker:function(e){var i,s,n=t(e),a=t.data(e,r);n.hasClass(this.markerClassName)&&(i=e.nodeName.toLowerCase(),"input"===i?(e.disabled=!1,a.trigger.filter("button").each(function(){this.disabled=!1}).end().filter("img").css({opacity:"1.0",cursor:""})):("div"===i||"span"===i)&&(s=n.children("."+this._inlineClass),s.children().removeClass("ui-state-disabled"),s.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled",!1)),this._disabledInputs=t.map(this._disabledInputs,function(t){return t===e?null:t}))},_disableDatepicker:function(e){var i,s,n=t(e),a=t.data(e,r);n.hasClass(this.markerClassName)&&(i=e.nodeName.toLowerCase(),"input"===i?(e.disabled=!0,a.trigger.filter("button").each(function(){this.disabled=!0}).end().filter("img").css({opacity:"0.5",cursor:"default"})):("div"===i||"span"===i)&&(s=n.children("."+this._inlineClass),s.children().addClass("ui-state-disabled"),s.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled",!0)),this._disabledInputs=t.map(this._disabledInputs,function(t){return t===e?null:t}),this._disabledInputs[this._disabledInputs.length]=e)},_isDisabledDatepicker:function(t){if(!t)return!1;for(var e=0;this._disabledInputs.length>e;e++)if(this._disabledInputs[e]===t)return!0;return!1},_getInst:function(e){try{return t.data(e,r)}catch(i){throw"Missing instance data for this datepicker"}},_optionDatepicker:function(i,s,a){var r,o,h,l,c=this._getInst(i);return 2===arguments.length&&"string"==typeof s?"defaults"===s?t.extend({},t.datepicker._defaults):c?"all"===s?t.extend({},c.settings):this._get(c,s):null:(r=s||{},"string"==typeof s&&(r={},r[s]=a),c&&(this._curInst===c&&this._hideDatepicker(),o=this._getDateDatepicker(i,!0),h=this._getMinMaxDate(c,"min"),l=this._getMinMaxDate(c,"max"),n(c.settings,r),null!==h&&r.dateFormat!==e&&r.minDate===e&&(c.settings.minDate=this._formatDate(c,h)),null!==l&&r.dateFormat!==e&&r.maxDate===e&&(c.settings.maxDate=this._formatDate(c,l)),"disabled"in r&&(r.disabled?this._disableDatepicker(i):this._enableDatepicker(i)),this._attachments(t(i),c),this._autoSize(c),this._setDate(c,o),this._updateAlternate(c),this._updateDatepicker(c)),e)},_changeDatepicker:function(t,e,i){this._optionDatepicker(t,e,i)},_refreshDatepicker:function(t){var e=this._getInst(t);e&&this._updateDatepicker(e)},_setDateDatepicker:function(t,e){var i=this._getInst(t);i&&(this._setDate(i,e),this._updateDatepicker(i),this._updateAlternate(i))},_getDateDatepicker:function(t,e){var i=this._getInst(t);return i&&!i.inline&&this._setDateFromField(i,e),i?this._getDate(i):null},_doKeyDown:function(e){var i,s,n,a=t.datepicker._getInst(e.target),r=!0,o=a.dpDiv.is(".ui-datepicker-rtl");if(a._keyEvent=!0,t.datepicker._datepickerShowing)switch(e.keyCode){case 9:t.datepicker._hideDatepicker(),r=!1;break;case 13:return n=t("td."+t.datepicker._dayOverClass+":not(."+t.datepicker._currentClass+")",a.dpDiv),n[0]&&t.datepicker._selectDay(e.target,a.selectedMonth,a.selectedYear,n[0]),i=t.datepicker._get(a,"onSelect"),i?(s=t.datepicker._formatDate(a),i.apply(a.input?a.input[0]:null,[s,a])):t.datepicker._hideDatepicker(),!1;case 27:t.datepicker._hideDatepicker();break;case 33:t.datepicker._adjustDate(e.target,e.ctrlKey?-t.datepicker._get(a,"stepBigMonths"):-t.datepicker._get(a,"stepMonths"),"M");break;case 34:t.datepicker._adjustDate(e.target,e.ctrlKey?+t.datepicker._get(a,"stepBigMonths"):+t.datepicker._get(a,"stepMonths"),"M");break;case 35:(e.ctrlKey||e.metaKey)&&t.datepicker._clearDate(e.target),r=e.ctrlKey||e.metaKey;break;case 36:(e.ctrlKey||e.metaKey)&&t.datepicker._gotoToday(e.target),r=e.ctrlKey||e.metaKey;break;case 37:(e.ctrlKey||e.metaKey)&&t.datepicker._adjustDate(e.target,o?1:-1,"D"),r=e.ctrlKey||e.metaKey,e.originalEvent.altKey&&t.datepicker._adjustDate(e.target,e.ctrlKey?-t.datepicker._get(a,"stepBigMonths"):-t.datepicker._get(a,"stepMonths"),"M");break;case 38:(e.ctrlKey||e.metaKey)&&t.datepicker._adjustDate(e.target,-7,"D"),r=e.ctrlKey||e.metaKey;break;case 39:(e.ctrlKey||e.metaKey)&&t.datepicker._adjustDate(e.target,o?-1:1,"D"),r=e.ctrlKey||e.metaKey,e.originalEvent.altKey&&t.datepicker._adjustDate(e.target,e.ctrlKey?+t.datepicker._get(a,"stepBigMonths"):+t.datepicker._get(a,"stepMonths"),"M");break;case 40:(e.ctrlKey||e.metaKey)&&t.datepicker._adjustDate(e.target,7,"D"),r=e.ctrlKey||e.metaKey;break;default:r=!1}else 36===e.keyCode&&e.ctrlKey?t.datepicker._showDatepicker(this):r=!1;r&&(e.preventDefault(),e.stopPropagation())},_doKeyPress:function(i){var s,n,a=t.datepicker._getInst(i.target);return t.datepicker._get(a,"constrainInput")?(s=t.datepicker._possibleChars(t.datepicker._get(a,"dateFormat")),n=String.fromCharCode(null==i.charCode?i.keyCode:i.charCode),i.ctrlKey||i.metaKey||" ">n||!s||s.indexOf(n)>-1):e},_doKeyUp:function(e){var i,s=t.datepicker._getInst(e.target);if(s.input.val()!==s.lastVal)try{i=t.datepicker.parseDate(t.datepicker._get(s,"dateFormat"),s.input?s.input.val():null,t.datepicker._getFormatConfig(s)),i&&(t.datepicker._setDateFromField(s),t.datepicker._updateAlternate(s),t.datepicker._updateDatepicker(s))}catch(n){}return!0},_showDatepicker:function(e){if(e=e.target||e,"input"!==e.nodeName.toLowerCase()&&(e=t("input",e.parentNode)[0]),!t.datepicker._isDisabledDatepicker(e)&&t.datepicker._lastInput!==e){var i,s,a,r,o,h,l;i=t.datepicker._getInst(e),t.datepicker._curInst&&t.datepicker._curInst!==i&&(t.datepicker._curInst.dpDiv.stop(!0,!0),i&&t.datepicker._datepickerShowing&&t.datepicker._hideDatepicker(t.datepicker._curInst.input[0])),s=t.datepicker._get(i,"beforeShow"),a=s?s.apply(e,[e,i]):{},a!==!1&&(n(i.settings,a),i.lastVal=null,t.datepicker._lastInput=e,t.datepicker._setDateFromField(i),t.datepicker._inDialog&&(e.value=""),t.datepicker._pos||(t.datepicker._pos=t.datepicker._findPos(e),t.datepicker._pos[1]+=e.offsetHeight),r=!1,t(e).parents().each(function(){return r|="fixed"===t(this).css("position"),!r}),o={left:t.datepicker._pos[0],top:t.datepicker._pos[1]},t.datepicker._pos=null,i.dpDiv.empty(),i.dpDiv.css({position:"absolute",display:"block",top:"-1000px"}),t.datepicker._updateDatepicker(i),o=t.datepicker._checkOffset(i,o,r),i.dpDiv.css({position:t.datepicker._inDialog&&t.blockUI?"static":r?"fixed":"absolute",display:"none",left:o.left+"px",top:o.top+"px"}),i.inline||(h=t.datepicker._get(i,"showAnim"),l=t.datepicker._get(i,"duration"),i.dpDiv.zIndex(t(e).zIndex()+1),t.datepicker._datepickerShowing=!0,t.effects&&t.effects.effect[h]?i.dpDiv.show(h,t.datepicker._get(i,"showOptions"),l):i.dpDiv[h||"show"](h?l:null),t.datepicker._shouldFocusInput(i)&&i.input.focus(),t.datepicker._curInst=i))}},_updateDatepicker:function(e){this.maxRows=4,a=e,e.dpDiv.empty().append(this._generateHTML(e)),this._attachHandlers(e),e.dpDiv.find("."+this._dayOverClass+" a").mouseover();var i,s=this._getNumberOfMonths(e),n=s[1],r=17;e.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width(""),n>1&&e.dpDiv.addClass("ui-datepicker-multi-"+n).css("width",r*n+"em"),e.dpDiv[(1!==s[0]||1!==s[1]?"add":"remove")+"Class"]("ui-datepicker-multi"),e.dpDiv[(this._get(e,"isRTL")?"add":"remove")+"Class"]("ui-datepicker-rtl"),e===t.datepicker._curInst&&t.datepicker._datepickerShowing&&t.datepicker._shouldFocusInput(e)&&e.input.focus(),e.yearshtml&&(i=e.yearshtml,setTimeout(function(){i===e.yearshtml&&e.yearshtml&&e.dpDiv.find("select.ui-datepicker-year:first").replaceWith(e.yearshtml),i=e.yearshtml=null},0))},_shouldFocusInput:function(t){return t.input&&t.input.is(":visible")&&!t.input.is(":disabled")&&!t.input.is(":focus")},_checkOffset:function(e,i,s){var n=e.dpDiv.outerWidth(),a=e.dpDiv.outerHeight(),r=e.input?e.input.outerWidth():0,o=e.input?e.input.outerHeight():0,h=document.documentElement.clientWidth+(s?0:t(document).scrollLeft()),l=document.documentElement.clientHeight+(s?0:t(document).scrollTop());return i.left-=this._get(e,"isRTL")?n-r:0,i.left-=s&&i.left===e.input.offset().left?t(document).scrollLeft():0,i.top-=s&&i.top===e.input.offset().top+o?t(document).scrollTop():0,i.left-=Math.min(i.left,i.left+n>h&&h>n?Math.abs(i.left+n-h):0),i.top-=Math.min(i.top,i.top+a>l&&l>a?Math.abs(a+o):0),i},_findPos:function(e){for(var i,s=this._getInst(e),n=this._get(s,"isRTL");e&&("hidden"===e.type||1!==e.nodeType||t.expr.filters.hidden(e));)e=e[n?"previousSibling":"nextSibling"];return i=t(e).offset(),[i.left,i.top]},_hideDatepicker:function(e){var i,s,n,a,o=this._curInst;!o||e&&o!==t.data(e,r)||this._datepickerShowing&&(i=this._get(o,"showAnim"),s=this._get(o,"duration"),n=function(){t.datepicker._tidyDialog(o)},t.effects&&(t.effects.effect[i]||t.effects[i])?o.dpDiv.hide(i,t.datepicker._get(o,"showOptions"),s,n):o.dpDiv["slideDown"===i?"slideUp":"fadeIn"===i?"fadeOut":"hide"](i?s:null,n),i||n(),this._datepickerShowing=!1,a=this._get(o,"onClose"),a&&a.apply(o.input?o.input[0]:null,[o.input?o.input.val():"",o]),this._lastInput=null,this._inDialog&&(this._dialogInput.css({position:"absolute",left:"0",top:"-100px"}),t.blockUI&&(t.unblockUI(),t("body").append(this.dpDiv))),this._inDialog=!1)},_tidyDialog:function(t){t.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar")},_checkExternalClick:function(e){if(t.datepicker._curInst){var i=t(e.target),s=t.datepicker._getInst(i[0]);(i[0].id!==t.datepicker._mainDivId&&0===i.parents("#"+t.datepicker._mainDivId).length&&!i.hasClass(t.datepicker.markerClassName)&&!i.closest("."+t.datepicker._triggerClass).length&&t.datepicker._datepickerShowing&&(!t.datepicker._inDialog||!t.blockUI)||i.hasClass(t.datepicker.markerClassName)&&t.datepicker._curInst!==s)&&t.datepicker._hideDatepicker()}},_adjustDate:function(e,i,s){var n=t(e),a=this._getInst(n[0]);this._isDisabledDatepicker(n[0])||(this._adjustInstDate(a,i+("M"===s?this._get(a,"showCurrentAtPos"):0),s),this._updateDatepicker(a))},_gotoToday:function(e){var i,s=t(e),n=this._getInst(s[0]);this._get(n,"gotoCurrent")&&n.currentDay?(n.selectedDay=n.currentDay,n.drawMonth=n.selectedMonth=n.currentMonth,n.drawYear=n.selectedYear=n.currentYear):(i=new Date,n.selectedDay=i.getDate(),n.drawMonth=n.selectedMonth=i.getMonth(),n.drawYear=n.selectedYear=i.getFullYear()),this._notifyChange(n),this._adjustDate(s)},_selectMonthYear:function(e,i,s){var n=t(e),a=this._getInst(n[0]);a["selected"+("M"===s?"Month":"Year")]=a["draw"+("M"===s?"Month":"Year")]=parseInt(i.options[i.selectedIndex].value,10),this._notifyChange(a),this._adjustDate(n)},_selectDay:function(e,i,s,n){var a,r=t(e);t(n).hasClass(this._unselectableClass)||this._isDisabledDatepicker(r[0])||(a=this._getInst(r[0]),a.selectedDay=a.currentDay=t("a",n).html(),a.selectedMonth=a.currentMonth=i,a.selectedYear=a.currentYear=s,this._selectDate(e,this._formatDate(a,a.currentDay,a.currentMonth,a.currentYear)))},_clearDate:function(e){var i=t(e);this._selectDate(i,"")},_selectDate:function(e,i){var s,n=t(e),a=this._getInst(n[0]);i=null!=i?i:this._formatDate(a),a.input&&a.input.val(i),this._updateAlternate(a),s=this._get(a,"onSelect"),s?s.apply(a.input?a.input[0]:null,[i,a]):a.input&&a.input.trigger("change"),a.inline?this._updateDatepicker(a):(this._hideDatepicker(),this._lastInput=a.input[0],"object"!=typeof a.input[0]&&a.input.focus(),this._lastInput=null)},_updateAlternate:function(e){var i,s,n,a=this._get(e,"altField");a&&(i=this._get(e,"altFormat")||this._get(e,"dateFormat"),s=this._getDate(e),n=this.formatDate(i,s,this._getFormatConfig(e)),t(a).each(function(){t(this).val(n)}))},noWeekends:function(t){var e=t.getDay();return[e>0&&6>e,""]},iso8601Week:function(t){var e,i=new Date(t.getTime());return i.setDate(i.getDate()+4-(i.getDay()||7)),e=i.getTime(),i.setMonth(0),i.setDate(1),Math.floor(Math.round((e-i)/864e5)/7)+1},parseDate:function(i,s,n){if(null==i||null==s)throw"Invalid arguments";if(s="object"==typeof s?""+s:s+"",""===s)return null;var a,r,o,h,l=0,c=(n?n.shortYearCutoff:null)||this._defaults.shortYearCutoff,u="string"!=typeof c?c:(new Date).getFullYear()%100+parseInt(c,10),d=(n?n.dayNamesShort:null)||this._defaults.dayNamesShort,p=(n?n.dayNames:null)||this._defaults.dayNames,f=(n?n.monthNamesShort:null)||this._defaults.monthNamesShort,m=(n?n.monthNames:null)||this._defaults.monthNames,g=-1,v=-1,_=-1,b=-1,y=!1,x=function(t){var e=i.length>a+1&&i.charAt(a+1)===t;return e&&a++,e},k=function(t){var e=x(t),i="@"===t?14:"!"===t?20:"y"===t&&e?4:"o"===t?3:2,n=RegExp("^\\d{1,"+i+"}"),a=s.substring(l).match(n);if(!a)throw"Missing number at position "+l;return l+=a[0].length,parseInt(a[0],10)},w=function(i,n,a){var r=-1,o=t.map(x(i)?a:n,function(t,e){return[[e,t]]}).sort(function(t,e){return-(t[1].length-e[1].length)});if(t.each(o,function(t,i){var n=i[1];return s.substr(l,n.length).toLowerCase()===n.toLowerCase()?(r=i[0],l+=n.length,!1):e}),-1!==r)return r+1;throw"Unknown name at position "+l},D=function(){if(s.charAt(l)!==i.charAt(a))throw"Unexpected literal at position "+l;l++};for(a=0;i.length>a;a++)if(y)"'"!==i.charAt(a)||x("'")?D():y=!1;else switch(i.charAt(a)){case"d":_=k("d");break;case"D":w("D",d,p);break;case"o":b=k("o");break;case"m":v=k("m");break;case"M":v=w("M",f,m);break;case"y":g=k("y");break;case"@":h=new Date(k("@")),g=h.getFullYear(),v=h.getMonth()+1,_=h.getDate();break;case"!":h=new Date((k("!")-this._ticksTo1970)/1e4),g=h.getFullYear(),v=h.getMonth()+1,_=h.getDate();break;case"'":x("'")?D():y=!0;break;default:D()}if(s.length>l&&(o=s.substr(l),!/^\s+/.test(o)))throw"Extra/unparsed characters found in date: "+o;if(-1===g?g=(new Date).getFullYear():100>g&&(g+=(new Date).getFullYear()-(new Date).getFullYear()%100+(u>=g?0:-100)),b>-1)for(v=1,_=b;;){if(r=this._getDaysInMonth(g,v-1),r>=_)break;v++,_-=r}if(h=this._daylightSavingAdjust(new Date(g,v-1,_)),h.getFullYear()!==g||h.getMonth()+1!==v||h.getDate()!==_)throw"Invalid date";return h},ATOM:"yy-mm-dd",COOKIE:"D, dd M yy",ISO_8601:"yy-mm-dd",RFC_822:"D, d M y",RFC_850:"DD, dd-M-y",RFC_1036:"D, d M y",RFC_1123:"D, d M yy",RFC_2822:"D, d M yy",RSS:"D, d M y",TICKS:"!",TIMESTAMP:"@",W3C:"yy-mm-dd",_ticksTo1970:1e7*60*60*24*(718685+Math.floor(492.5)-Math.floor(19.7)+Math.floor(4.925)),formatDate:function(t,e,i){if(!e)return"";var s,n=(i?i.dayNamesShort:null)||this._defaults.dayNamesShort,a=(i?i.dayNames:null)||this._defaults.dayNames,r=(i?i.monthNamesShort:null)||this._defaults.monthNamesShort,o=(i?i.monthNames:null)||this._defaults.monthNames,h=function(e){var i=t.length>s+1&&t.charAt(s+1)===e;return i&&s++,i},l=function(t,e,i){var s=""+e;if(h(t))for(;i>s.length;)s="0"+s;return s},c=function(t,e,i,s){return h(t)?s[e]:i[e]},u="",d=!1;if(e)for(s=0;t.length>s;s++)if(d)"'"!==t.charAt(s)||h("'")?u+=t.charAt(s):d=!1;else switch(t.charAt(s)){case"d":u+=l("d",e.getDate(),2);break;case"D":u+=c("D",e.getDay(),n,a);break;case"o":u+=l("o",Math.round((new Date(e.getFullYear(),e.getMonth(),e.getDate()).getTime()-new Date(e.getFullYear(),0,0).getTime())/864e5),3);break;case"m":u+=l("m",e.getMonth()+1,2);break;case"M":u+=c("M",e.getMonth(),r,o);break;case"y":u+=h("y")?e.getFullYear():(10>e.getYear()%100?"0":"")+e.getYear()%100;break;case"@":u+=e.getTime();break;case"!":u+=1e4*e.getTime()+this._ticksTo1970;break;case"'":h("'")?u+="'":d=!0;break;default:u+=t.charAt(s)}return u},_possibleChars:function(t){var e,i="",s=!1,n=function(i){var s=t.length>e+1&&t.charAt(e+1)===i;return s&&e++,s};for(e=0;t.length>e;e++)if(s)"'"!==t.charAt(e)||n("'")?i+=t.charAt(e):s=!1;else switch(t.charAt(e)){case"d":case"m":case"y":case"@":i+="0123456789";break;case"D":case"M":return null;case"'":n("'")?i+="'":s=!0;break;default:i+=t.charAt(e)}return i},_get:function(t,i){return t.settings[i]!==e?t.settings[i]:this._defaults[i]},_setDateFromField:function(t,e){if(t.input.val()!==t.lastVal){var i=this._get(t,"dateFormat"),s=t.lastVal=t.input?t.input.val():null,n=this._getDefaultDate(t),a=n,r=this._getFormatConfig(t);try{a=this.parseDate(i,s,r)||n}catch(o){s=e?"":s}t.selectedDay=a.getDate(),t.drawMonth=t.selectedMonth=a.getMonth(),t.drawYear=t.selectedYear=a.getFullYear(),t.currentDay=s?a.getDate():0,t.currentMonth=s?a.getMonth():0,t.currentYear=s?a.getFullYear():0,this._adjustInstDate(t)}},_getDefaultDate:function(t){return this._restrictMinMax(t,this._determineDate(t,this._get(t,"defaultDate"),new Date))},_determineDate:function(e,i,s){var n=function(t){var e=new Date;return e.setDate(e.getDate()+t),e},a=function(i){try{return t.datepicker.parseDate(t.datepicker._get(e,"dateFormat"),i,t.datepicker._getFormatConfig(e))}catch(s){}for(var n=(i.toLowerCase().match(/^c/)?t.datepicker._getDate(e):null)||new Date,a=n.getFullYear(),r=n.getMonth(),o=n.getDate(),h=/([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,l=h.exec(i);l;){switch(l[2]||"d"){case"d":case"D":o+=parseInt(l[1],10);break;case"w":case"W":o+=7*parseInt(l[1],10);break;case"m":case"M":r+=parseInt(l[1],10),o=Math.min(o,t.datepicker._getDaysInMonth(a,r));break;case"y":case"Y":a+=parseInt(l[1],10),o=Math.min(o,t.datepicker._getDaysInMonth(a,r))}l=h.exec(i)}return new Date(a,r,o)},r=null==i||""===i?s:"string"==typeof i?a(i):"number"==typeof i?isNaN(i)?s:n(i):new Date(i.getTime());return r=r&&"Invalid Date"==""+r?s:r,r&&(r.setHours(0),r.setMinutes(0),r.setSeconds(0),r.setMilliseconds(0)),this._daylightSavingAdjust(r)},_daylightSavingAdjust:function(t){return t?(t.setHours(t.getHours()>12?t.getHours()+2:0),t):null},_setDate:function(t,e,i){var s=!e,n=t.selectedMonth,a=t.selectedYear,r=this._restrictMinMax(t,this._determineDate(t,e,new Date));t.selectedDay=t.currentDay=r.getDate(),t.drawMonth=t.selectedMonth=t.currentMonth=r.getMonth(),t.drawYear=t.selectedYear=t.currentYear=r.getFullYear(),n===t.selectedMonth&&a===t.selectedYear||i||this._notifyChange(t),this._adjustInstDate(t),t.input&&t.input.val(s?"":this._formatDate(t))},_getDate:function(t){var e=!t.currentYear||t.input&&""===t.input.val()?null:this._daylightSavingAdjust(new Date(t.currentYear,t.currentMonth,t.currentDay));return e},_attachHandlers:function(e){var i=this._get(e,"stepMonths"),s="#"+e.id.replace(/\\\\/g,"\\");e.dpDiv.find("[data-handler]").map(function(){var e={prev:function(){t.datepicker._adjustDate(s,-i,"M")},next:function(){t.datepicker._adjustDate(s,+i,"M")},hide:function(){t.datepicker._hideDatepicker()},today:function(){t.datepicker._gotoToday(s)},selectDay:function(){return t.datepicker._selectDay(s,+this.getAttribute("data-month"),+this.getAttribute("data-year"),this),!1},selectMonth:function(){return t.datepicker._selectMonthYear(s,this,"M"),!1},selectYear:function(){return t.datepicker._selectMonthYear(s,this,"Y"),!1}};t(this).bind(this.getAttribute("data-event"),e[this.getAttribute("data-handler")])})},_generateHTML:function(t){var e,i,s,n,a,r,o,h,l,c,u,d,p,f,m,g,v,_,b,y,x,k,w,D,T,C,M,S,N,I,P,A,z,H,E,F,O,W,j,R=new Date,L=this._daylightSavingAdjust(new Date(R.getFullYear(),R.getMonth(),R.getDate())),Y=this._get(t,"isRTL"),B=this._get(t,"showButtonPanel"),J=this._get(t,"hideIfNoPrevNext"),K=this._get(t,"navigationAsDateFormat"),Q=this._getNumberOfMonths(t),V=this._get(t,"showCurrentAtPos"),U=this._get(t,"stepMonths"),q=1!==Q[0]||1!==Q[1],X=this._daylightSavingAdjust(t.currentDay?new Date(t.currentYear,t.currentMonth,t.currentDay):new Date(9999,9,9)),G=this._getMinMaxDate(t,"min"),$=this._getMinMaxDate(t,"max"),Z=t.drawMonth-V,te=t.drawYear;if(0>Z&&(Z+=12,te--),$)for(e=this._daylightSavingAdjust(new Date($.getFullYear(),$.getMonth()-Q[0]*Q[1]+1,$.getDate())),e=G&&G>e?G:e;this._daylightSavingAdjust(new Date(te,Z,1))>e;)Z--,0>Z&&(Z=11,te--);for(t.drawMonth=Z,t.drawYear=te,i=this._get(t,"prevText"),i=K?this.formatDate(i,this._daylightSavingAdjust(new Date(te,Z-U,1)),this._getFormatConfig(t)):i,s=this._canAdjustMonth(t,-1,te,Z)?"<a class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click' title='"+i+"'><span class='ui-icon ui-icon-circle-triangle-"+(Y?"e":"w")+"'>"+i+"</span></a>":J?"":"<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='"+i+"'><span class='ui-icon ui-icon-circle-triangle-"+(Y?"e":"w")+"'>"+i+"</span></a>",n=this._get(t,"nextText"),n=K?this.formatDate(n,this._daylightSavingAdjust(new Date(te,Z+U,1)),this._getFormatConfig(t)):n,a=this._canAdjustMonth(t,1,te,Z)?"<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click' title='"+n+"'><span class='ui-icon ui-icon-circle-triangle-"+(Y?"w":"e")+"'>"+n+"</span></a>":J?"":"<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='"+n+"'><span class='ui-icon ui-icon-circle-triangle-"+(Y?"w":"e")+"'>"+n+"</span></a>",r=this._get(t,"currentText"),o=this._get(t,"gotoCurrent")&&t.currentDay?X:L,r=K?this.formatDate(r,o,this._getFormatConfig(t)):r,h=t.inline?"":"<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>"+this._get(t,"closeText")+"</button>",l=B?"<div class='ui-datepicker-buttonpane ui-widget-content'>"+(Y?h:"")+(this._isInRange(t,o)?"<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'>"+r+"</button>":"")+(Y?"":h)+"</div>":"",c=parseInt(this._get(t,"firstDay"),10),c=isNaN(c)?0:c,u=this._get(t,"showWeek"),d=this._get(t,"dayNames"),p=this._get(t,"dayNamesMin"),f=this._get(t,"monthNames"),m=this._get(t,"monthNamesShort"),g=this._get(t,"beforeShowDay"),v=this._get(t,"showOtherMonths"),_=this._get(t,"selectOtherMonths"),b=this._getDefaultDate(t),y="",k=0;Q[0]>k;k++){for(w="",this.maxRows=4,D=0;Q[1]>D;D++){if(T=this._daylightSavingAdjust(new Date(te,Z,t.selectedDay)),C=" ui-corner-all",M="",q){if(M+="<div class='ui-datepicker-group",Q[1]>1)switch(D){case 0:M+=" ui-datepicker-group-first",C=" ui-corner-"+(Y?"right":"left");break;case Q[1]-1:M+=" ui-datepicker-group-last",C=" ui-corner-"+(Y?"left":"right");break;default:M+=" ui-datepicker-group-middle",C=""}M+="'>"}for(M+="<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix"+C+"'>"+(/all|left/.test(C)&&0===k?Y?a:s:"")+(/all|right/.test(C)&&0===k?Y?s:a:"")+this._generateMonthYearHeader(t,Z,te,G,$,k>0||D>0,f,m)+"</div><table class='ui-datepicker-calendar'><thead>"+"<tr>",S=u?"<th class='ui-datepicker-week-col'>"+this._get(t,"weekHeader")+"</th>":"",x=0;7>x;x++)N=(x+c)%7,S+="<th"+((x+c+6)%7>=5?" class='ui-datepicker-week-end'":"")+">"+"<span title='"+d[N]+"'>"+p[N]+"</span></th>";for(M+=S+"</tr></thead><tbody>",I=this._getDaysInMonth(te,Z),te===t.selectedYear&&Z===t.selectedMonth&&(t.selectedDay=Math.min(t.selectedDay,I)),P=(this._getFirstDayOfMonth(te,Z)-c+7)%7,A=Math.ceil((P+I)/7),z=q?this.maxRows>A?this.maxRows:A:A,this.maxRows=z,H=this._daylightSavingAdjust(new Date(te,Z,1-P)),E=0;z>E;E++){for(M+="<tr>",F=u?"<td class='ui-datepicker-week-col'>"+this._get(t,"calculateWeek")(H)+"</td>":"",x=0;7>x;x++)O=g?g.apply(t.input?t.input[0]:null,[H]):[!0,""],W=H.getMonth()!==Z,j=W&&!_||!O[0]||G&&G>H||$&&H>$,F+="<td class='"+((x+c+6)%7>=5?" ui-datepicker-week-end":"")+(W?" ui-datepicker-other-month":"")+(H.getTime()===T.getTime()&&Z===t.selectedMonth&&t._keyEvent||b.getTime()===H.getTime()&&b.getTime()===T.getTime()?" "+this._dayOverClass:"")+(j?" "+this._unselectableClass+" ui-state-disabled":"")+(W&&!v?"":" "+O[1]+(H.getTime()===X.getTime()?" "+this._currentClass:"")+(H.getTime()===L.getTime()?" ui-datepicker-today":""))+"'"+(W&&!v||!O[2]?"":" title='"+O[2].replace(/'/g,"&#39;")+"'")+(j?"":" data-handler='selectDay' data-event='click' data-month='"+H.getMonth()+"' data-year='"+H.getFullYear()+"'")+">"+(W&&!v?"&#xa0;":j?"<span class='ui-state-default'>"+H.getDate()+"</span>":"<a class='ui-state-default"+(H.getTime()===L.getTime()?" ui-state-highlight":"")+(H.getTime()===X.getTime()?" ui-state-active":"")+(W?" ui-priority-secondary":"")+"' href='#'>"+H.getDate()+"</a>")+"</td>",H.setDate(H.getDate()+1),H=this._daylightSavingAdjust(H);M+=F+"</tr>"}Z++,Z>11&&(Z=0,te++),M+="</tbody></table>"+(q?"</div>"+(Q[0]>0&&D===Q[1]-1?"<div class='ui-datepicker-row-break'></div>":""):""),w+=M}y+=w}return y+=l,t._keyEvent=!1,y},_generateMonthYearHeader:function(t,e,i,s,n,a,r,o){var h,l,c,u,d,p,f,m,g=this._get(t,"changeMonth"),v=this._get(t,"changeYear"),_=this._get(t,"showMonthAfterYear"),b="<div class='ui-datepicker-title'>",y="";if(a||!g)y+="<span class='ui-datepicker-month'>"+r[e]+"</span>";else{for(h=s&&s.getFullYear()===i,l=n&&n.getFullYear()===i,y+="<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>",c=0;12>c;c++)(!h||c>=s.getMonth())&&(!l||n.getMonth()>=c)&&(y+="<option value='"+c+"'"+(c===e?" selected='selected'":"")+">"+o[c]+"</option>");y+="</select>"}if(_||(b+=y+(!a&&g&&v?"":"&#xa0;")),!t.yearshtml)if(t.yearshtml="",a||!v)b+="<span class='ui-datepicker-year'>"+i+"</span>";else{for(u=this._get(t,"yearRange").split(":"),d=(new Date).getFullYear(),p=function(t){var e=t.match(/c[+\-].*/)?i+parseInt(t.substring(1),10):t.match(/[+\-].*/)?d+parseInt(t,10):parseInt(t,10);
return isNaN(e)?d:e},f=p(u[0]),m=Math.max(f,p(u[1]||"")),f=s?Math.max(f,s.getFullYear()):f,m=n?Math.min(m,n.getFullYear()):m,t.yearshtml+="<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>";m>=f;f++)t.yearshtml+="<option value='"+f+"'"+(f===i?" selected='selected'":"")+">"+f+"</option>";t.yearshtml+="</select>",b+=t.yearshtml,t.yearshtml=null}return b+=this._get(t,"yearSuffix"),_&&(b+=(!a&&g&&v?"":"&#xa0;")+y),b+="</div>"},_adjustInstDate:function(t,e,i){var s=t.drawYear+("Y"===i?e:0),n=t.drawMonth+("M"===i?e:0),a=Math.min(t.selectedDay,this._getDaysInMonth(s,n))+("D"===i?e:0),r=this._restrictMinMax(t,this._daylightSavingAdjust(new Date(s,n,a)));t.selectedDay=r.getDate(),t.drawMonth=t.selectedMonth=r.getMonth(),t.drawYear=t.selectedYear=r.getFullYear(),("M"===i||"Y"===i)&&this._notifyChange(t)},_restrictMinMax:function(t,e){var i=this._getMinMaxDate(t,"min"),s=this._getMinMaxDate(t,"max"),n=i&&i>e?i:e;return s&&n>s?s:n},_notifyChange:function(t){var e=this._get(t,"onChangeMonthYear");e&&e.apply(t.input?t.input[0]:null,[t.selectedYear,t.selectedMonth+1,t])},_getNumberOfMonths:function(t){var e=this._get(t,"numberOfMonths");return null==e?[1,1]:"number"==typeof e?[1,e]:e},_getMinMaxDate:function(t,e){return this._determineDate(t,this._get(t,e+"Date"),null)},_getDaysInMonth:function(t,e){return 32-this._daylightSavingAdjust(new Date(t,e,32)).getDate()},_getFirstDayOfMonth:function(t,e){return new Date(t,e,1).getDay()},_canAdjustMonth:function(t,e,i,s){var n=this._getNumberOfMonths(t),a=this._daylightSavingAdjust(new Date(i,s+(0>e?e:n[0]*n[1]),1));return 0>e&&a.setDate(this._getDaysInMonth(a.getFullYear(),a.getMonth())),this._isInRange(t,a)},_isInRange:function(t,e){var i,s,n=this._getMinMaxDate(t,"min"),a=this._getMinMaxDate(t,"max"),r=null,o=null,h=this._get(t,"yearRange");return h&&(i=h.split(":"),s=(new Date).getFullYear(),r=parseInt(i[0],10),o=parseInt(i[1],10),i[0].match(/[+\-].*/)&&(r+=s),i[1].match(/[+\-].*/)&&(o+=s)),(!n||e.getTime()>=n.getTime())&&(!a||e.getTime()<=a.getTime())&&(!r||e.getFullYear()>=r)&&(!o||o>=e.getFullYear())},_getFormatConfig:function(t){var e=this._get(t,"shortYearCutoff");return e="string"!=typeof e?e:(new Date).getFullYear()%100+parseInt(e,10),{shortYearCutoff:e,dayNamesShort:this._get(t,"dayNamesShort"),dayNames:this._get(t,"dayNames"),monthNamesShort:this._get(t,"monthNamesShort"),monthNames:this._get(t,"monthNames")}},_formatDate:function(t,e,i,s){e||(t.currentDay=t.selectedDay,t.currentMonth=t.selectedMonth,t.currentYear=t.selectedYear);var n=e?"object"==typeof e?e:this._daylightSavingAdjust(new Date(s,i,e)):this._daylightSavingAdjust(new Date(t.currentYear,t.currentMonth,t.currentDay));return this.formatDate(this._get(t,"dateFormat"),n,this._getFormatConfig(t))}}),t.fn.datepicker=function(e){if(!this.length)return this;t.datepicker.initialized||(t(document).mousedown(t.datepicker._checkExternalClick),t.datepicker.initialized=!0),0===t("#"+t.datepicker._mainDivId).length&&t("body").append(t.datepicker.dpDiv);var i=Array.prototype.slice.call(arguments,1);return"string"!=typeof e||"isDisabled"!==e&&"getDate"!==e&&"widget"!==e?"option"===e&&2===arguments.length&&"string"==typeof arguments[1]?t.datepicker["_"+e+"Datepicker"].apply(t.datepicker,[this[0]].concat(i)):this.each(function(){"string"==typeof e?t.datepicker["_"+e+"Datepicker"].apply(t.datepicker,[this].concat(i)):t.datepicker._attachDatepicker(this,e)}):t.datepicker["_"+e+"Datepicker"].apply(t.datepicker,[this[0]].concat(i))},t.datepicker=new i,t.datepicker.initialized=!1,t.datepicker.uuid=(new Date).getTime(),t.datepicker.version="1.10.3"})(jQuery);(function(t){var e={buttons:!0,height:!0,maxHeight:!0,maxWidth:!0,minHeight:!0,minWidth:!0,width:!0},i={maxHeight:!0,maxWidth:!0,minHeight:!0,minWidth:!0};t.widget("ui.dialog",{version:"1.10.3",options:{appendTo:"body",autoOpen:!0,buttons:[],closeOnEscape:!0,closeText:"close",dialogClass:"",draggable:!0,hide:null,height:"auto",maxHeight:null,maxWidth:null,minHeight:150,minWidth:150,modal:!1,position:{my:"center",at:"center",of:window,collision:"fit",using:function(e){var i=t(this).css(e).offset().top;0>i&&t(this).css("top",e.top-i)}},resizable:!0,show:null,title:null,width:300,beforeClose:null,close:null,drag:null,dragStart:null,dragStop:null,focus:null,open:null,resize:null,resizeStart:null,resizeStop:null},_create:function(){this.originalCss={display:this.element[0].style.display,width:this.element[0].style.width,minHeight:this.element[0].style.minHeight,maxHeight:this.element[0].style.maxHeight,height:this.element[0].style.height},this.originalPosition={parent:this.element.parent(),index:this.element.parent().children().index(this.element)},this.originalTitle=this.element.attr("title"),this.options.title=this.options.title||this.originalTitle,this._createWrapper(),this.element.show().removeAttr("title").addClass("ui-dialog-content ui-widget-content").appendTo(this.uiDialog),this._createTitlebar(),this._createButtonPane(),this.options.draggable&&t.fn.draggable&&this._makeDraggable(),this.options.resizable&&t.fn.resizable&&this._makeResizable(),this._isOpen=!1},_init:function(){this.options.autoOpen&&this.open()},_appendTo:function(){var e=this.options.appendTo;return e&&(e.jquery||e.nodeType)?t(e):this.document.find(e||"body").eq(0)},_destroy:function(){var t,e=this.originalPosition;this._destroyOverlay(),this.element.removeUniqueId().removeClass("ui-dialog-content ui-widget-content").css(this.originalCss).detach(),this.uiDialog.stop(!0,!0).remove(),this.originalTitle&&this.element.attr("title",this.originalTitle),t=e.parent.children().eq(e.index),t.length&&t[0]!==this.element[0]?t.before(this.element):e.parent.append(this.element)},widget:function(){return this.uiDialog},disable:t.noop,enable:t.noop,close:function(e){var i=this;this._isOpen&&this._trigger("beforeClose",e)!==!1&&(this._isOpen=!1,this._destroyOverlay(),this.opener.filter(":focusable").focus().length||t(this.document[0].activeElement).blur(),this._hide(this.uiDialog,this.options.hide,function(){i._trigger("close",e)}))},isOpen:function(){return this._isOpen},moveToTop:function(){this._moveToTop()},_moveToTop:function(t,e){var i=!!this.uiDialog.nextAll(":visible").insertBefore(this.uiDialog).length;return i&&!e&&this._trigger("focus",t),i},open:function(){var e=this;return this._isOpen?(this._moveToTop()&&this._focusTabbable(),undefined):(this._isOpen=!0,this.opener=t(this.document[0].activeElement),this._size(),this._position(),this._createOverlay(),this._moveToTop(null,!0),this._show(this.uiDialog,this.options.show,function(){e._focusTabbable(),e._trigger("focus")}),this._trigger("open"),undefined)},_focusTabbable:function(){var t=this.element.find("[autofocus]");t.length||(t=this.element.find(":tabbable")),t.length||(t=this.uiDialogButtonPane.find(":tabbable")),t.length||(t=this.uiDialogTitlebarClose.filter(":tabbable")),t.length||(t=this.uiDialog),t.eq(0).focus()},_keepFocus:function(e){function i(){var e=this.document[0].activeElement,i=this.uiDialog[0]===e||t.contains(this.uiDialog[0],e);i||this._focusTabbable()}e.preventDefault(),i.call(this),this._delay(i)},_createWrapper:function(){this.uiDialog=t("<div>").addClass("ui-dialog ui-widget ui-widget-content ui-corner-all ui-front "+this.options.dialogClass).hide().attr({tabIndex:-1,role:"dialog"}).appendTo(this._appendTo()),this._on(this.uiDialog,{keydown:function(e){if(this.options.closeOnEscape&&!e.isDefaultPrevented()&&e.keyCode&&e.keyCode===t.ui.keyCode.ESCAPE)return e.preventDefault(),this.close(e),undefined;if(e.keyCode===t.ui.keyCode.TAB){var i=this.uiDialog.find(":tabbable"),s=i.filter(":first"),n=i.filter(":last");e.target!==n[0]&&e.target!==this.uiDialog[0]||e.shiftKey?e.target!==s[0]&&e.target!==this.uiDialog[0]||!e.shiftKey||(n.focus(1),e.preventDefault()):(s.focus(1),e.preventDefault())}},mousedown:function(t){this._moveToTop(t)&&this._focusTabbable()}}),this.element.find("[aria-describedby]").length||this.uiDialog.attr({"aria-describedby":this.element.uniqueId().attr("id")})},_createTitlebar:function(){var e;this.uiDialogTitlebar=t("<div>").addClass("ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix").prependTo(this.uiDialog),this._on(this.uiDialogTitlebar,{mousedown:function(e){t(e.target).closest(".ui-dialog-titlebar-close")||this.uiDialog.focus()}}),this.uiDialogTitlebarClose=t("<button></button>").button({label:this.options.closeText,icons:{primary:"ui-icon-closethick"},text:!1}).addClass("ui-dialog-titlebar-close").appendTo(this.uiDialogTitlebar),this._on(this.uiDialogTitlebarClose,{click:function(t){t.preventDefault(),this.close(t)}}),e=t("<span>").uniqueId().addClass("ui-dialog-title").prependTo(this.uiDialogTitlebar),this._title(e),this.uiDialog.attr({"aria-labelledby":e.attr("id")})},_title:function(t){this.options.title||t.html("&#160;"),t.text(this.options.title)},_createButtonPane:function(){this.uiDialogButtonPane=t("<div>").addClass("ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"),this.uiButtonSet=t("<div>").addClass("ui-dialog-buttonset").appendTo(this.uiDialogButtonPane),this._createButtons()},_createButtons:function(){var e=this,i=this.options.buttons;return this.uiDialogButtonPane.remove(),this.uiButtonSet.empty(),t.isEmptyObject(i)||t.isArray(i)&&!i.length?(this.uiDialog.removeClass("ui-dialog-buttons"),undefined):(t.each(i,function(i,s){var n,a;s=t.isFunction(s)?{click:s,text:i}:s,s=t.extend({type:"button"},s),n=s.click,s.click=function(){n.apply(e.element[0],arguments)},a={icons:s.icons,text:s.showText},delete s.icons,delete s.showText,t("<button></button>",s).button(a).appendTo(e.uiButtonSet)}),this.uiDialog.addClass("ui-dialog-buttons"),this.uiDialogButtonPane.appendTo(this.uiDialog),undefined)},_makeDraggable:function(){function e(t){return{position:t.position,offset:t.offset}}var i=this,s=this.options;this.uiDialog.draggable({cancel:".ui-dialog-content, .ui-dialog-titlebar-close",handle:".ui-dialog-titlebar",containment:"document",start:function(s,n){t(this).addClass("ui-dialog-dragging"),i._blockFrames(),i._trigger("dragStart",s,e(n))},drag:function(t,s){i._trigger("drag",t,e(s))},stop:function(n,a){s.position=[a.position.left-i.document.scrollLeft(),a.position.top-i.document.scrollTop()],t(this).removeClass("ui-dialog-dragging"),i._unblockFrames(),i._trigger("dragStop",n,e(a))}})},_makeResizable:function(){function e(t){return{originalPosition:t.originalPosition,originalSize:t.originalSize,position:t.position,size:t.size}}var i=this,s=this.options,n=s.resizable,a=this.uiDialog.css("position"),o="string"==typeof n?n:"n,e,s,w,se,sw,ne,nw";this.uiDialog.resizable({cancel:".ui-dialog-content",containment:"document",alsoResize:this.element,maxWidth:s.maxWidth,maxHeight:s.maxHeight,minWidth:s.minWidth,minHeight:this._minHeight(),handles:o,start:function(s,n){t(this).addClass("ui-dialog-resizing"),i._blockFrames(),i._trigger("resizeStart",s,e(n))},resize:function(t,s){i._trigger("resize",t,e(s))},stop:function(n,a){s.height=t(this).height(),s.width=t(this).width(),t(this).removeClass("ui-dialog-resizing"),i._unblockFrames(),i._trigger("resizeStop",n,e(a))}}).css("position",a)},_minHeight:function(){var t=this.options;return"auto"===t.height?t.minHeight:Math.min(t.minHeight,t.height)},_position:function(){var t=this.uiDialog.is(":visible");t||this.uiDialog.show(),this.uiDialog.position(this.options.position),t||this.uiDialog.hide()},_setOptions:function(s){var n=this,a=!1,o={};t.each(s,function(t,s){n._setOption(t,s),t in e&&(a=!0),t in i&&(o[t]=s)}),a&&(this._size(),this._position()),this.uiDialog.is(":data(ui-resizable)")&&this.uiDialog.resizable("option",o)},_setOption:function(t,e){var i,s,n=this.uiDialog;"dialogClass"===t&&n.removeClass(this.options.dialogClass).addClass(e),"disabled"!==t&&(this._super(t,e),"appendTo"===t&&this.uiDialog.appendTo(this._appendTo()),"buttons"===t&&this._createButtons(),"closeText"===t&&this.uiDialogTitlebarClose.button({label:""+e}),"draggable"===t&&(i=n.is(":data(ui-draggable)"),i&&!e&&n.draggable("destroy"),!i&&e&&this._makeDraggable()),"position"===t&&this._position(),"resizable"===t&&(s=n.is(":data(ui-resizable)"),s&&!e&&n.resizable("destroy"),s&&"string"==typeof e&&n.resizable("option","handles",e),s||e===!1||this._makeResizable()),"title"===t&&this._title(this.uiDialogTitlebar.find(".ui-dialog-title")))},_size:function(){var t,e,i,s=this.options;this.element.show().css({width:"auto",minHeight:0,maxHeight:"none",height:0}),s.minWidth>s.width&&(s.width=s.minWidth),t=this.uiDialog.css({height:"auto",width:s.width}).outerHeight(),e=Math.max(0,s.minHeight-t),i="number"==typeof s.maxHeight?Math.max(0,s.maxHeight-t):"none","auto"===s.height?this.element.css({minHeight:e,maxHeight:i,height:"auto"}):this.element.height(Math.max(0,s.height-t)),this.uiDialog.is(":data(ui-resizable)")&&this.uiDialog.resizable("option","minHeight",this._minHeight())},_blockFrames:function(){this.iframeBlocks=this.document.find("iframe").map(function(){var e=t(this);return t("<div>").css({position:"absolute",width:e.outerWidth(),height:e.outerHeight()}).appendTo(e.parent()).offset(e.offset())[0]})},_unblockFrames:function(){this.iframeBlocks&&(this.iframeBlocks.remove(),delete this.iframeBlocks)},_allowInteraction:function(e){return t(e.target).closest(".ui-dialog").length?!0:!!t(e.target).closest(".ui-datepicker").length},_createOverlay:function(){if(this.options.modal){var e=this,i=this.widgetFullName;t.ui.dialog.overlayInstances||this._delay(function(){t.ui.dialog.overlayInstances&&this.document.bind("focusin.dialog",function(s){e._allowInteraction(s)||(s.preventDefault(),t(".ui-dialog:visible:last .ui-dialog-content").data(i)._focusTabbable())})}),this.overlay=t("<div>").addClass("ui-widget-overlay ui-front").appendTo(this._appendTo()),this._on(this.overlay,{mousedown:"_keepFocus"}),t.ui.dialog.overlayInstances++}},_destroyOverlay:function(){this.options.modal&&this.overlay&&(t.ui.dialog.overlayInstances--,t.ui.dialog.overlayInstances||this.document.unbind("focusin.dialog"),this.overlay.remove(),this.overlay=null)}}),t.ui.dialog.overlayInstances=0,t.uiBackCompat!==!1&&t.widget("ui.dialog",t.ui.dialog,{_position:function(){var e,i=this.options.position,s=[],n=[0,0];i?(("string"==typeof i||"object"==typeof i&&"0"in i)&&(s=i.split?i.split(" "):[i[0],i[1]],1===s.length&&(s[1]=s[0]),t.each(["left","top"],function(t,e){+s[t]===s[t]&&(n[t]=s[t],s[t]=e)}),i={my:s[0]+(0>n[0]?n[0]:"+"+n[0])+" "+s[1]+(0>n[1]?n[1]:"+"+n[1]),at:s.join(" ")}),i=t.extend({},t.ui.dialog.prototype.options.position,i)):i=t.ui.dialog.prototype.options.position,e=this.uiDialog.is(":visible"),e||this.uiDialog.show(),this.uiDialog.position(i),e||this.uiDialog.hide()}})})(jQuery);(function(t){t.widget("ui.menu",{version:"1.10.3",defaultElement:"<ul>",delay:300,options:{icons:{submenu:"ui-icon-carat-1-e"},menus:"ul",position:{my:"left top",at:"right top"},role:"menu",blur:null,focus:null,select:null},_create:function(){this.activeMenu=this.element,this.mouseHandled=!1,this.element.uniqueId().addClass("ui-menu ui-widget ui-widget-content ui-corner-all").toggleClass("ui-menu-icons",!!this.element.find(".ui-icon").length).attr({role:this.options.role,tabIndex:0}).bind("click"+this.eventNamespace,t.proxy(function(t){this.options.disabled&&t.preventDefault()},this)),this.options.disabled&&this.element.addClass("ui-state-disabled").attr("aria-disabled","true"),this._on({"mousedown .ui-menu-item > a":function(t){t.preventDefault()},"click .ui-state-disabled > a":function(t){t.preventDefault()},"click .ui-menu-item:has(a)":function(e){var i=t(e.target).closest(".ui-menu-item");!this.mouseHandled&&i.not(".ui-state-disabled").length&&(this.mouseHandled=!0,this.select(e),i.has(".ui-menu").length?this.expand(e):this.element.is(":focus")||(this.element.trigger("focus",[!0]),this.active&&1===this.active.parents(".ui-menu").length&&clearTimeout(this.timer)))},"mouseenter .ui-menu-item":function(e){var i=t(e.currentTarget);i.siblings().children(".ui-state-active").removeClass("ui-state-active"),this.focus(e,i)},mouseleave:"collapseAll","mouseleave .ui-menu":"collapseAll",focus:function(t,e){var i=this.active||this.element.children(".ui-menu-item").eq(0);e||this.focus(t,i)},blur:function(e){this._delay(function(){t.contains(this.element[0],this.document[0].activeElement)||this.collapseAll(e)})},keydown:"_keydown"}),this.refresh(),this._on(this.document,{click:function(e){t(e.target).closest(".ui-menu").length||this.collapseAll(e),this.mouseHandled=!1}})},_destroy:function(){this.element.removeAttr("aria-activedescendant").find(".ui-menu").addBack().removeClass("ui-menu ui-widget ui-widget-content ui-corner-all ui-menu-icons").removeAttr("role").removeAttr("tabIndex").removeAttr("aria-labelledby").removeAttr("aria-expanded").removeAttr("aria-hidden").removeAttr("aria-disabled").removeUniqueId().show(),this.element.find(".ui-menu-item").removeClass("ui-menu-item").removeAttr("role").removeAttr("aria-disabled").children("a").removeUniqueId().removeClass("ui-corner-all ui-state-hover").removeAttr("tabIndex").removeAttr("role").removeAttr("aria-haspopup").children().each(function(){var e=t(this);e.data("ui-menu-submenu-carat")&&e.remove()}),this.element.find(".ui-menu-divider").removeClass("ui-menu-divider ui-widget-content")},_keydown:function(e){function i(t){return t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}var s,n,a,o,r,h=!0;switch(e.keyCode){case t.ui.keyCode.PAGE_UP:this.previousPage(e);break;case t.ui.keyCode.PAGE_DOWN:this.nextPage(e);break;case t.ui.keyCode.HOME:this._move("first","first",e);break;case t.ui.keyCode.END:this._move("last","last",e);break;case t.ui.keyCode.UP:this.previous(e);break;case t.ui.keyCode.DOWN:this.next(e);break;case t.ui.keyCode.LEFT:this.collapse(e);break;case t.ui.keyCode.RIGHT:this.active&&!this.active.is(".ui-state-disabled")&&this.expand(e);break;case t.ui.keyCode.ENTER:case t.ui.keyCode.SPACE:this._activate(e);break;case t.ui.keyCode.ESCAPE:this.collapse(e);break;default:h=!1,n=this.previousFilter||"",a=String.fromCharCode(e.keyCode),o=!1,clearTimeout(this.filterTimer),a===n?o=!0:a=n+a,r=RegExp("^"+i(a),"i"),s=this.activeMenu.children(".ui-menu-item").filter(function(){return r.test(t(this).children("a").text())}),s=o&&-1!==s.index(this.active.next())?this.active.nextAll(".ui-menu-item"):s,s.length||(a=String.fromCharCode(e.keyCode),r=RegExp("^"+i(a),"i"),s=this.activeMenu.children(".ui-menu-item").filter(function(){return r.test(t(this).children("a").text())})),s.length?(this.focus(e,s),s.length>1?(this.previousFilter=a,this.filterTimer=this._delay(function(){delete this.previousFilter},1e3)):delete this.previousFilter):delete this.previousFilter}h&&e.preventDefault()},_activate:function(t){this.active.is(".ui-state-disabled")||(this.active.children("a[aria-haspopup='true']").length?this.expand(t):this.select(t))},refresh:function(){var e,i=this.options.icons.submenu,s=this.element.find(this.options.menus);s.filter(":not(.ui-menu)").addClass("ui-menu ui-widget ui-widget-content ui-corner-all").hide().attr({role:this.options.role,"aria-hidden":"true","aria-expanded":"false"}).each(function(){var e=t(this),s=e.prev("a"),n=t("<span>").addClass("ui-menu-icon ui-icon "+i).data("ui-menu-submenu-carat",!0);s.attr("aria-haspopup","true").prepend(n),e.attr("aria-labelledby",s.attr("id"))}),e=s.add(this.element),e.children(":not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role","presentation").children("a").uniqueId().addClass("ui-corner-all").attr({tabIndex:-1,role:this._itemRole()}),e.children(":not(.ui-menu-item)").each(function(){var e=t(this);/[^\-\u2014\u2013\s]/.test(e.text())||e.addClass("ui-widget-content ui-menu-divider")}),e.children(".ui-state-disabled").attr("aria-disabled","true"),this.active&&!t.contains(this.element[0],this.active[0])&&this.blur()},_itemRole:function(){return{menu:"menuitem",listbox:"option"}[this.options.role]},_setOption:function(t,e){"icons"===t&&this.element.find(".ui-menu-icon").removeClass(this.options.icons.submenu).addClass(e.submenu),this._super(t,e)},focus:function(t,e){var i,s;this.blur(t,t&&"focus"===t.type),this._scrollIntoView(e),this.active=e.first(),s=this.active.children("a").addClass("ui-state-focus"),this.options.role&&this.element.attr("aria-activedescendant",s.attr("id")),this.active.parent().closest(".ui-menu-item").children("a:first").addClass("ui-state-active"),t&&"keydown"===t.type?this._close():this.timer=this._delay(function(){this._close()},this.delay),i=e.children(".ui-menu"),i.length&&/^mouse/.test(t.type)&&this._startOpening(i),this.activeMenu=e.parent(),this._trigger("focus",t,{item:e})},_scrollIntoView:function(e){var i,s,n,a,o,r;this._hasScroll()&&(i=parseFloat(t.css(this.activeMenu[0],"borderTopWidth"))||0,s=parseFloat(t.css(this.activeMenu[0],"paddingTop"))||0,n=e.offset().top-this.activeMenu.offset().top-i-s,a=this.activeMenu.scrollTop(),o=this.activeMenu.height(),r=e.height(),0>n?this.activeMenu.scrollTop(a+n):n+r>o&&this.activeMenu.scrollTop(a+n-o+r))},blur:function(t,e){e||clearTimeout(this.timer),this.active&&(this.active.children("a").removeClass("ui-state-focus"),this.active=null,this._trigger("blur",t,{item:this.active}))},_startOpening:function(t){clearTimeout(this.timer),"true"===t.attr("aria-hidden")&&(this.timer=this._delay(function(){this._close(),this._open(t)},this.delay))},_open:function(e){var i=t.extend({of:this.active},this.options.position);clearTimeout(this.timer),this.element.find(".ui-menu").not(e.parents(".ui-menu")).hide().attr("aria-hidden","true"),e.show().removeAttr("aria-hidden").attr("aria-expanded","true").position(i)},collapseAll:function(e,i){clearTimeout(this.timer),this.timer=this._delay(function(){var s=i?this.element:t(e&&e.target).closest(this.element.find(".ui-menu"));s.length||(s=this.element),this._close(s),this.blur(e),this.activeMenu=s},this.delay)},_close:function(t){t||(t=this.active?this.active.parent():this.element),t.find(".ui-menu").hide().attr("aria-hidden","true").attr("aria-expanded","false").end().find("a.ui-state-active").removeClass("ui-state-active")},collapse:function(t){var e=this.active&&this.active.parent().closest(".ui-menu-item",this.element);e&&e.length&&(this._close(),this.focus(t,e))},expand:function(t){var e=this.active&&this.active.children(".ui-menu ").children(".ui-menu-item").first();e&&e.length&&(this._open(e.parent()),this._delay(function(){this.focus(t,e)}))},next:function(t){this._move("next","first",t)},previous:function(t){this._move("prev","last",t)},isFirstItem:function(){return this.active&&!this.active.prevAll(".ui-menu-item").length},isLastItem:function(){return this.active&&!this.active.nextAll(".ui-menu-item").length},_move:function(t,e,i){var s;this.active&&(s="first"===t||"last"===t?this.active["first"===t?"prevAll":"nextAll"](".ui-menu-item").eq(-1):this.active[t+"All"](".ui-menu-item").eq(0)),s&&s.length&&this.active||(s=this.activeMenu.children(".ui-menu-item")[e]()),this.focus(i,s)},nextPage:function(e){var i,s,n;return this.active?(this.isLastItem()||(this._hasScroll()?(s=this.active.offset().top,n=this.element.height(),this.active.nextAll(".ui-menu-item").each(function(){return i=t(this),0>i.offset().top-s-n}),this.focus(e,i)):this.focus(e,this.activeMenu.children(".ui-menu-item")[this.active?"last":"first"]())),undefined):(this.next(e),undefined)},previousPage:function(e){var i,s,n;return this.active?(this.isFirstItem()||(this._hasScroll()?(s=this.active.offset().top,n=this.element.height(),this.active.prevAll(".ui-menu-item").each(function(){return i=t(this),i.offset().top-s+n>0}),this.focus(e,i)):this.focus(e,this.activeMenu.children(".ui-menu-item").first())),undefined):(this.next(e),undefined)},_hasScroll:function(){return this.element.outerHeight()<this.element.prop("scrollHeight")},select:function(e){this.active=this.active||t(e.target).closest(".ui-menu-item");var i={item:this.active};this.active.has(".ui-menu").length||this.collapseAll(e,!0),this._trigger("select",e,i)}})})(jQuery);(function(t,e){t.widget("ui.progressbar",{version:"1.10.3",options:{max:100,value:0,change:null,complete:null},min:0,_create:function(){this.oldValue=this.options.value=this._constrainedValue(),this.element.addClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").attr({role:"progressbar","aria-valuemin":this.min}),this.valueDiv=t("<div class='ui-progressbar-value ui-widget-header ui-corner-left'></div>").appendTo(this.element),this._refreshValue()},_destroy:function(){this.element.removeClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow"),this.valueDiv.remove()},value:function(t){return t===e?this.options.value:(this.options.value=this._constrainedValue(t),this._refreshValue(),e)},_constrainedValue:function(t){return t===e&&(t=this.options.value),this.indeterminate=t===!1,"number"!=typeof t&&(t=0),this.indeterminate?!1:Math.min(this.options.max,Math.max(this.min,t))},_setOptions:function(t){var e=t.value;delete t.value,this._super(t),this.options.value=this._constrainedValue(e),this._refreshValue()},_setOption:function(t,e){"max"===t&&(e=Math.max(this.min,e)),this._super(t,e)},_percentage:function(){return this.indeterminate?100:100*(this.options.value-this.min)/(this.options.max-this.min)},_refreshValue:function(){var e=this.options.value,i=this._percentage();this.valueDiv.toggle(this.indeterminate||e>this.min).toggleClass("ui-corner-right",e===this.options.max).width(i.toFixed(0)+"%"),this.element.toggleClass("ui-progressbar-indeterminate",this.indeterminate),this.indeterminate?(this.element.removeAttr("aria-valuenow"),this.overlayDiv||(this.overlayDiv=t("<div class='ui-progressbar-overlay'></div>").appendTo(this.valueDiv))):(this.element.attr({"aria-valuemax":this.options.max,"aria-valuenow":e}),this.overlayDiv&&(this.overlayDiv.remove(),this.overlayDiv=null)),this.oldValue!==e&&(this.oldValue=e,this._trigger("change")),e===this.options.max&&this._trigger("complete")}})})(jQuery);(function(t){var e=5;t.widget("ui.slider",t.ui.mouse,{version:"1.10.3",widgetEventPrefix:"slide",options:{animate:!1,distance:0,max:100,min:0,orientation:"horizontal",range:!1,step:1,value:0,values:null,change:null,slide:null,start:null,stop:null},_create:function(){this._keySliding=!1,this._mouseSliding=!1,this._animateOff=!0,this._handleIndex=null,this._detectOrientation(),this._mouseInit(),this.element.addClass("ui-slider ui-slider-"+this.orientation+" ui-widget"+" ui-widget-content"+" ui-corner-all"),this._refresh(),this._setOption("disabled",this.options.disabled),this._animateOff=!1},_refresh:function(){this._createRange(),this._createHandles(),this._setupEvents(),this._refreshValue()},_createHandles:function(){var e,i,s=this.options,n=this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"),a="<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>",o=[];for(i=s.values&&s.values.length||1,n.length>i&&(n.slice(i).remove(),n=n.slice(0,i)),e=n.length;i>e;e++)o.push(a);this.handles=n.add(t(o.join("")).appendTo(this.element)),this.handle=this.handles.eq(0),this.handles.each(function(e){t(this).data("ui-slider-handle-index",e)})},_createRange:function(){var e=this.options,i="";e.range?(e.range===!0&&(e.values?e.values.length&&2!==e.values.length?e.values=[e.values[0],e.values[0]]:t.isArray(e.values)&&(e.values=e.values.slice(0)):e.values=[this._valueMin(),this._valueMin()]),this.range&&this.range.length?this.range.removeClass("ui-slider-range-min ui-slider-range-max").css({left:"",bottom:""}):(this.range=t("<div></div>").appendTo(this.element),i="ui-slider-range ui-widget-header ui-corner-all"),this.range.addClass(i+("min"===e.range||"max"===e.range?" ui-slider-range-"+e.range:""))):this.range=t([])},_setupEvents:function(){var t=this.handles.add(this.range).filter("a");this._off(t),this._on(t,this._handleEvents),this._hoverable(t),this._focusable(t)},_destroy:function(){this.handles.remove(),this.range.remove(),this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-widget ui-widget-content ui-corner-all"),this._mouseDestroy()},_mouseCapture:function(e){var i,s,n,a,o,r,h,l,u=this,c=this.options;return c.disabled?!1:(this.elementSize={width:this.element.outerWidth(),height:this.element.outerHeight()},this.elementOffset=this.element.offset(),i={x:e.pageX,y:e.pageY},s=this._normValueFromMouse(i),n=this._valueMax()-this._valueMin()+1,this.handles.each(function(e){var i=Math.abs(s-u.values(e));(n>i||n===i&&(e===u._lastChangedValue||u.values(e)===c.min))&&(n=i,a=t(this),o=e)}),r=this._start(e,o),r===!1?!1:(this._mouseSliding=!0,this._handleIndex=o,a.addClass("ui-state-active").focus(),h=a.offset(),l=!t(e.target).parents().addBack().is(".ui-slider-handle"),this._clickOffset=l?{left:0,top:0}:{left:e.pageX-h.left-a.width()/2,top:e.pageY-h.top-a.height()/2-(parseInt(a.css("borderTopWidth"),10)||0)-(parseInt(a.css("borderBottomWidth"),10)||0)+(parseInt(a.css("marginTop"),10)||0)},this.handles.hasClass("ui-state-hover")||this._slide(e,o,s),this._animateOff=!0,!0))},_mouseStart:function(){return!0},_mouseDrag:function(t){var e={x:t.pageX,y:t.pageY},i=this._normValueFromMouse(e);return this._slide(t,this._handleIndex,i),!1},_mouseStop:function(t){return this.handles.removeClass("ui-state-active"),this._mouseSliding=!1,this._stop(t,this._handleIndex),this._change(t,this._handleIndex),this._handleIndex=null,this._clickOffset=null,this._animateOff=!1,!1},_detectOrientation:function(){this.orientation="vertical"===this.options.orientation?"vertical":"horizontal"},_normValueFromMouse:function(t){var e,i,s,n,a;return"horizontal"===this.orientation?(e=this.elementSize.width,i=t.x-this.elementOffset.left-(this._clickOffset?this._clickOffset.left:0)):(e=this.elementSize.height,i=t.y-this.elementOffset.top-(this._clickOffset?this._clickOffset.top:0)),s=i/e,s>1&&(s=1),0>s&&(s=0),"vertical"===this.orientation&&(s=1-s),n=this._valueMax()-this._valueMin(),a=this._valueMin()+s*n,this._trimAlignValue(a)},_start:function(t,e){var i={handle:this.handles[e],value:this.value()};return this.options.values&&this.options.values.length&&(i.value=this.values(e),i.values=this.values()),this._trigger("start",t,i)},_slide:function(t,e,i){var s,n,a;this.options.values&&this.options.values.length?(s=this.values(e?0:1),2===this.options.values.length&&this.options.range===!0&&(0===e&&i>s||1===e&&s>i)&&(i=s),i!==this.values(e)&&(n=this.values(),n[e]=i,a=this._trigger("slide",t,{handle:this.handles[e],value:i,values:n}),s=this.values(e?0:1),a!==!1&&this.values(e,i,!0))):i!==this.value()&&(a=this._trigger("slide",t,{handle:this.handles[e],value:i}),a!==!1&&this.value(i))},_stop:function(t,e){var i={handle:this.handles[e],value:this.value()};this.options.values&&this.options.values.length&&(i.value=this.values(e),i.values=this.values()),this._trigger("stop",t,i)},_change:function(t,e){if(!this._keySliding&&!this._mouseSliding){var i={handle:this.handles[e],value:this.value()};this.options.values&&this.options.values.length&&(i.value=this.values(e),i.values=this.values()),this._lastChangedValue=e,this._trigger("change",t,i)}},value:function(t){return arguments.length?(this.options.value=this._trimAlignValue(t),this._refreshValue(),this._change(null,0),undefined):this._value()},values:function(e,i){var s,n,a;if(arguments.length>1)return this.options.values[e]=this._trimAlignValue(i),this._refreshValue(),this._change(null,e),undefined;if(!arguments.length)return this._values();if(!t.isArray(arguments[0]))return this.options.values&&this.options.values.length?this._values(e):this.value();for(s=this.options.values,n=arguments[0],a=0;s.length>a;a+=1)s[a]=this._trimAlignValue(n[a]),this._change(null,a);this._refreshValue()},_setOption:function(e,i){var s,n=0;switch("range"===e&&this.options.range===!0&&("min"===i?(this.options.value=this._values(0),this.options.values=null):"max"===i&&(this.options.value=this._values(this.options.values.length-1),this.options.values=null)),t.isArray(this.options.values)&&(n=this.options.values.length),t.Widget.prototype._setOption.apply(this,arguments),e){case"orientation":this._detectOrientation(),this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-"+this.orientation),this._refreshValue();break;case"value":this._animateOff=!0,this._refreshValue(),this._change(null,0),this._animateOff=!1;break;case"values":for(this._animateOff=!0,this._refreshValue(),s=0;n>s;s+=1)this._change(null,s);this._animateOff=!1;break;case"min":case"max":this._animateOff=!0,this._refreshValue(),this._animateOff=!1;break;case"range":this._animateOff=!0,this._refresh(),this._animateOff=!1}},_value:function(){var t=this.options.value;return t=this._trimAlignValue(t)},_values:function(t){var e,i,s;if(arguments.length)return e=this.options.values[t],e=this._trimAlignValue(e);if(this.options.values&&this.options.values.length){for(i=this.options.values.slice(),s=0;i.length>s;s+=1)i[s]=this._trimAlignValue(i[s]);return i}return[]},_trimAlignValue:function(t){if(this._valueMin()>=t)return this._valueMin();if(t>=this._valueMax())return this._valueMax();var e=this.options.step>0?this.options.step:1,i=(t-this._valueMin())%e,s=t-i;return 2*Math.abs(i)>=e&&(s+=i>0?e:-e),parseFloat(s.toFixed(5))},_valueMin:function(){return this.options.min},_valueMax:function(){return this.options.max},_refreshValue:function(){var e,i,s,n,a,o=this.options.range,r=this.options,h=this,l=this._animateOff?!1:r.animate,u={};this.options.values&&this.options.values.length?this.handles.each(function(s){i=100*((h.values(s)-h._valueMin())/(h._valueMax()-h._valueMin())),u["horizontal"===h.orientation?"left":"bottom"]=i+"%",t(this).stop(1,1)[l?"animate":"css"](u,r.animate),h.options.range===!0&&("horizontal"===h.orientation?(0===s&&h.range.stop(1,1)[l?"animate":"css"]({left:i+"%"},r.animate),1===s&&h.range[l?"animate":"css"]({width:i-e+"%"},{queue:!1,duration:r.animate})):(0===s&&h.range.stop(1,1)[l?"animate":"css"]({bottom:i+"%"},r.animate),1===s&&h.range[l?"animate":"css"]({height:i-e+"%"},{queue:!1,duration:r.animate}))),e=i}):(s=this.value(),n=this._valueMin(),a=this._valueMax(),i=a!==n?100*((s-n)/(a-n)):0,u["horizontal"===this.orientation?"left":"bottom"]=i+"%",this.handle.stop(1,1)[l?"animate":"css"](u,r.animate),"min"===o&&"horizontal"===this.orientation&&this.range.stop(1,1)[l?"animate":"css"]({width:i+"%"},r.animate),"max"===o&&"horizontal"===this.orientation&&this.range[l?"animate":"css"]({width:100-i+"%"},{queue:!1,duration:r.animate}),"min"===o&&"vertical"===this.orientation&&this.range.stop(1,1)[l?"animate":"css"]({height:i+"%"},r.animate),"max"===o&&"vertical"===this.orientation&&this.range[l?"animate":"css"]({height:100-i+"%"},{queue:!1,duration:r.animate}))},_handleEvents:{keydown:function(i){var s,n,a,o,r=t(i.target).data("ui-slider-handle-index");switch(i.keyCode){case t.ui.keyCode.HOME:case t.ui.keyCode.END:case t.ui.keyCode.PAGE_UP:case t.ui.keyCode.PAGE_DOWN:case t.ui.keyCode.UP:case t.ui.keyCode.RIGHT:case t.ui.keyCode.DOWN:case t.ui.keyCode.LEFT:if(i.preventDefault(),!this._keySliding&&(this._keySliding=!0,t(i.target).addClass("ui-state-active"),s=this._start(i,r),s===!1))return}switch(o=this.options.step,n=a=this.options.values&&this.options.values.length?this.values(r):this.value(),i.keyCode){case t.ui.keyCode.HOME:a=this._valueMin();break;case t.ui.keyCode.END:a=this._valueMax();break;case t.ui.keyCode.PAGE_UP:a=this._trimAlignValue(n+(this._valueMax()-this._valueMin())/e);break;case t.ui.keyCode.PAGE_DOWN:a=this._trimAlignValue(n-(this._valueMax()-this._valueMin())/e);break;case t.ui.keyCode.UP:case t.ui.keyCode.RIGHT:if(n===this._valueMax())return;a=this._trimAlignValue(n+o);break;case t.ui.keyCode.DOWN:case t.ui.keyCode.LEFT:if(n===this._valueMin())return;a=this._trimAlignValue(n-o)}this._slide(i,r,a)},click:function(t){t.preventDefault()},keyup:function(e){var i=t(e.target).data("ui-slider-handle-index");this._keySliding&&(this._keySliding=!1,this._stop(e,i),this._change(e,i),t(e.target).removeClass("ui-state-active"))}}})})(jQuery);(function(t){function e(t){return function(){var e=this.element.val();t.apply(this,arguments),this._refresh(),e!==this.element.val()&&this._trigger("change")}}t.widget("ui.spinner",{version:"1.10.3",defaultElement:"<input>",widgetEventPrefix:"spin",options:{culture:null,icons:{down:"ui-icon-triangle-1-s",up:"ui-icon-triangle-1-n"},incremental:!0,max:null,min:null,numberFormat:null,page:10,step:1,change:null,spin:null,start:null,stop:null},_create:function(){this._setOption("max",this.options.max),this._setOption("min",this.options.min),this._setOption("step",this.options.step),this._value(this.element.val(),!0),this._draw(),this._on(this._events),this._refresh(),this._on(this.window,{beforeunload:function(){this.element.removeAttr("autocomplete")}})},_getCreateOptions:function(){var e={},i=this.element;return t.each(["min","max","step"],function(t,s){var n=i.attr(s);void 0!==n&&n.length&&(e[s]=n)}),e},_events:{keydown:function(t){this._start(t)&&this._keydown(t)&&t.preventDefault()},keyup:"_stop",focus:function(){this.previous=this.element.val()},blur:function(t){return this.cancelBlur?(delete this.cancelBlur,void 0):(this._stop(),this._refresh(),this.previous!==this.element.val()&&this._trigger("change",t),void 0)},mousewheel:function(t,e){if(e){if(!this.spinning&&!this._start(t))return!1;this._spin((e>0?1:-1)*this.options.step,t),clearTimeout(this.mousewheelTimer),this.mousewheelTimer=this._delay(function(){this.spinning&&this._stop(t)},100),t.preventDefault()}},"mousedown .ui-spinner-button":function(e){function i(){var t=this.element[0]===this.document[0].activeElement;t||(this.element.focus(),this.previous=s,this._delay(function(){this.previous=s}))}var s;s=this.element[0]===this.document[0].activeElement?this.previous:this.element.val(),e.preventDefault(),i.call(this),this.cancelBlur=!0,this._delay(function(){delete this.cancelBlur,i.call(this)}),this._start(e)!==!1&&this._repeat(null,t(e.currentTarget).hasClass("ui-spinner-up")?1:-1,e)},"mouseup .ui-spinner-button":"_stop","mouseenter .ui-spinner-button":function(e){return t(e.currentTarget).hasClass("ui-state-active")?this._start(e)===!1?!1:(this._repeat(null,t(e.currentTarget).hasClass("ui-spinner-up")?1:-1,e),void 0):void 0},"mouseleave .ui-spinner-button":"_stop"},_draw:function(){var t=this.uiSpinner=this.element.addClass("ui-spinner-input").attr("autocomplete","off").wrap(this._uiSpinnerHtml()).parent().append(this._buttonHtml());this.element.attr("role","spinbutton"),this.buttons=t.find(".ui-spinner-button").attr("tabIndex",-1).button().removeClass("ui-corner-all"),this.buttons.height()>Math.ceil(.5*t.height())&&t.height()>0&&t.height(t.height()),this.options.disabled&&this.disable()},_keydown:function(e){var i=this.options,s=t.ui.keyCode;switch(e.keyCode){case s.UP:return this._repeat(null,1,e),!0;case s.DOWN:return this._repeat(null,-1,e),!0;case s.PAGE_UP:return this._repeat(null,i.page,e),!0;case s.PAGE_DOWN:return this._repeat(null,-i.page,e),!0}return!1},_uiSpinnerHtml:function(){return"<span class='ui-spinner ui-widget ui-widget-content ui-corner-all'></span>"},_buttonHtml:function(){return"<a class='ui-spinner-button ui-spinner-up ui-corner-tr'><span class='ui-icon "+this.options.icons.up+"'>&#9650;</span>"+"</a>"+"<a class='ui-spinner-button ui-spinner-down ui-corner-br'>"+"<span class='ui-icon "+this.options.icons.down+"'>&#9660;</span>"+"</a>"},_start:function(t){return this.spinning||this._trigger("start",t)!==!1?(this.counter||(this.counter=1),this.spinning=!0,!0):!1},_repeat:function(t,e,i){t=t||500,clearTimeout(this.timer),this.timer=this._delay(function(){this._repeat(40,e,i)},t),this._spin(e*this.options.step,i)},_spin:function(t,e){var i=this.value()||0;this.counter||(this.counter=1),i=this._adjustValue(i+t*this._increment(this.counter)),this.spinning&&this._trigger("spin",e,{value:i})===!1||(this._value(i),this.counter++)},_increment:function(e){var i=this.options.incremental;return i?t.isFunction(i)?i(e):Math.floor(e*e*e/5e4-e*e/500+17*e/200+1):1},_precision:function(){var t=this._precisionOf(this.options.step);return null!==this.options.min&&(t=Math.max(t,this._precisionOf(this.options.min))),t},_precisionOf:function(t){var e=""+t,i=e.indexOf(".");return-1===i?0:e.length-i-1},_adjustValue:function(t){var e,i,s=this.options;return e=null!==s.min?s.min:0,i=t-e,i=Math.round(i/s.step)*s.step,t=e+i,t=parseFloat(t.toFixed(this._precision())),null!==s.max&&t>s.max?s.max:null!==s.min&&s.min>t?s.min:t},_stop:function(t){this.spinning&&(clearTimeout(this.timer),clearTimeout(this.mousewheelTimer),this.counter=0,this.spinning=!1,this._trigger("stop",t))},_setOption:function(t,e){if("culture"===t||"numberFormat"===t){var i=this._parse(this.element.val());return this.options[t]=e,this.element.val(this._format(i)),void 0}("max"===t||"min"===t||"step"===t)&&"string"==typeof e&&(e=this._parse(e)),"icons"===t&&(this.buttons.first().find(".ui-icon").removeClass(this.options.icons.up).addClass(e.up),this.buttons.last().find(".ui-icon").removeClass(this.options.icons.down).addClass(e.down)),this._super(t,e),"disabled"===t&&(e?(this.element.prop("disabled",!0),this.buttons.button("disable")):(this.element.prop("disabled",!1),this.buttons.button("enable")))},_setOptions:e(function(t){this._super(t),this._value(this.element.val())}),_parse:function(t){return"string"==typeof t&&""!==t&&(t=window.Globalize&&this.options.numberFormat?Globalize.parseFloat(t,10,this.options.culture):+t),""===t||isNaN(t)?null:t},_format:function(t){return""===t?"":window.Globalize&&this.options.numberFormat?Globalize.format(t,this.options.numberFormat,this.options.culture):t},_refresh:function(){this.element.attr({"aria-valuemin":this.options.min,"aria-valuemax":this.options.max,"aria-valuenow":this._parse(this.element.val())})},_value:function(t,e){var i;""!==t&&(i=this._parse(t),null!==i&&(e||(i=this._adjustValue(i)),t=this._format(i))),this.element.val(t),this._refresh()},_destroy:function(){this.element.removeClass("ui-spinner-input").prop("disabled",!1).removeAttr("autocomplete").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow"),this.uiSpinner.replaceWith(this.element)},stepUp:e(function(t){this._stepUp(t)}),_stepUp:function(t){this._start()&&(this._spin((t||1)*this.options.step),this._stop())},stepDown:e(function(t){this._stepDown(t)}),_stepDown:function(t){this._start()&&(this._spin((t||1)*-this.options.step),this._stop())},pageUp:e(function(t){this._stepUp((t||1)*this.options.page)}),pageDown:e(function(t){this._stepDown((t||1)*this.options.page)}),value:function(t){return arguments.length?(e(this._value).call(this,t),void 0):this._parse(this.element.val())},widget:function(){return this.uiSpinner}})})(jQuery);(function(t,e){function i(){return++n}function s(t){return t.hash.length>1&&decodeURIComponent(t.href.replace(a,""))===decodeURIComponent(location.href.replace(a,""))}var n=0,a=/#.*$/;t.widget("ui.tabs",{version:"1.10.3",delay:300,options:{active:null,collapsible:!1,event:"click",heightStyle:"content",hide:null,show:null,activate:null,beforeActivate:null,beforeLoad:null,load:null},_create:function(){var e=this,i=this.options;this.running=!1,this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all").toggleClass("ui-tabs-collapsible",i.collapsible).delegate(".ui-tabs-nav > li","mousedown"+this.eventNamespace,function(e){t(this).is(".ui-state-disabled")&&e.preventDefault()}).delegate(".ui-tabs-anchor","focus"+this.eventNamespace,function(){t(this).closest("li").is(".ui-state-disabled")&&this.blur()}),this._processTabs(),i.active=this._initialActive(),t.isArray(i.disabled)&&(i.disabled=t.unique(i.disabled.concat(t.map(this.tabs.filter(".ui-state-disabled"),function(t){return e.tabs.index(t)}))).sort()),this.active=this.options.active!==!1&&this.anchors.length?this._findActive(i.active):t(),this._refresh(),this.active.length&&this.load(i.active)},_initialActive:function(){var i=this.options.active,s=this.options.collapsible,n=location.hash.substring(1);return null===i&&(n&&this.tabs.each(function(s,a){return t(a).attr("aria-controls")===n?(i=s,!1):e}),null===i&&(i=this.tabs.index(this.tabs.filter(".ui-tabs-active"))),(null===i||-1===i)&&(i=this.tabs.length?0:!1)),i!==!1&&(i=this.tabs.index(this.tabs.eq(i)),-1===i&&(i=s?!1:0)),!s&&i===!1&&this.anchors.length&&(i=0),i},_getCreateEventData:function(){return{tab:this.active,panel:this.active.length?this._getPanelForTab(this.active):t()}},_tabKeydown:function(i){var s=t(this.document[0].activeElement).closest("li"),n=this.tabs.index(s),a=!0;if(!this._handlePageNav(i)){switch(i.keyCode){case t.ui.keyCode.RIGHT:case t.ui.keyCode.DOWN:n++;break;case t.ui.keyCode.UP:case t.ui.keyCode.LEFT:a=!1,n--;break;case t.ui.keyCode.END:n=this.anchors.length-1;break;case t.ui.keyCode.HOME:n=0;break;case t.ui.keyCode.SPACE:return i.preventDefault(),clearTimeout(this.activating),this._activate(n),e;case t.ui.keyCode.ENTER:return i.preventDefault(),clearTimeout(this.activating),this._activate(n===this.options.active?!1:n),e;default:return}i.preventDefault(),clearTimeout(this.activating),n=this._focusNextTab(n,a),i.ctrlKey||(s.attr("aria-selected","false"),this.tabs.eq(n).attr("aria-selected","true"),this.activating=this._delay(function(){this.option("active",n)},this.delay))}},_panelKeydown:function(e){this._handlePageNav(e)||e.ctrlKey&&e.keyCode===t.ui.keyCode.UP&&(e.preventDefault(),this.active.focus())},_handlePageNav:function(i){return i.altKey&&i.keyCode===t.ui.keyCode.PAGE_UP?(this._activate(this._focusNextTab(this.options.active-1,!1)),!0):i.altKey&&i.keyCode===t.ui.keyCode.PAGE_DOWN?(this._activate(this._focusNextTab(this.options.active+1,!0)),!0):e},_findNextTab:function(e,i){function s(){return e>n&&(e=0),0>e&&(e=n),e}for(var n=this.tabs.length-1;-1!==t.inArray(s(),this.options.disabled);)e=i?e+1:e-1;return e},_focusNextTab:function(t,e){return t=this._findNextTab(t,e),this.tabs.eq(t).focus(),t},_setOption:function(t,i){return"active"===t?(this._activate(i),e):"disabled"===t?(this._setupDisabled(i),e):(this._super(t,i),"collapsible"===t&&(this.element.toggleClass("ui-tabs-collapsible",i),i||this.options.active!==!1||this._activate(0)),"event"===t&&this._setupEvents(i),"heightStyle"===t&&this._setupHeightStyle(i),e)},_tabId:function(t){return t.attr("aria-controls")||"ui-tabs-"+i()},_sanitizeSelector:function(t){return t?t.replace(/[!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g,"\\$&"):""},refresh:function(){var e=this.options,i=this.tablist.children(":has(a[href])");e.disabled=t.map(i.filter(".ui-state-disabled"),function(t){return i.index(t)}),this._processTabs(),e.active!==!1&&this.anchors.length?this.active.length&&!t.contains(this.tablist[0],this.active[0])?this.tabs.length===e.disabled.length?(e.active=!1,this.active=t()):this._activate(this._findNextTab(Math.max(0,e.active-1),!1)):e.active=this.tabs.index(this.active):(e.active=!1,this.active=t()),this._refresh()},_refresh:function(){this._setupDisabled(this.options.disabled),this._setupEvents(this.options.event),this._setupHeightStyle(this.options.heightStyle),this.tabs.not(this.active).attr({"aria-selected":"false",tabIndex:-1}),this.panels.not(this._getPanelForTab(this.active)).hide().attr({"aria-expanded":"false","aria-hidden":"true"}),this.active.length?(this.active.addClass("ui-tabs-active ui-state-active").attr({"aria-selected":"true",tabIndex:0}),this._getPanelForTab(this.active).show().attr({"aria-expanded":"true","aria-hidden":"false"})):this.tabs.eq(0).attr("tabIndex",0)},_processTabs:function(){var e=this;this.tablist=this._getList().addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").attr("role","tablist"),this.tabs=this.tablist.find("> li:has(a[href])").addClass("ui-state-default ui-corner-top").attr({role:"tab",tabIndex:-1}),this.anchors=this.tabs.map(function(){return t("a",this)[0]}).addClass("ui-tabs-anchor").attr({role:"presentation",tabIndex:-1}),this.panels=t(),this.anchors.each(function(i,n){var a,o,r,h=t(n).uniqueId().attr("id"),l=t(n).closest("li"),u=l.attr("aria-controls");s(n)?(a=n.hash,o=e.element.find(e._sanitizeSelector(a))):(r=e._tabId(l),a="#"+r,o=e.element.find(a),o.length||(o=e._createPanel(r),o.insertAfter(e.panels[i-1]||e.tablist)),o.attr("aria-live","polite")),o.length&&(e.panels=e.panels.add(o)),u&&l.data("ui-tabs-aria-controls",u),l.attr({"aria-controls":a.substring(1),"aria-labelledby":h}),o.attr("aria-labelledby",h)}),this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").attr("role","tabpanel")},_getList:function(){return this.element.find("ol,ul").eq(0)},_createPanel:function(e){return t("<div>").attr("id",e).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").data("ui-tabs-destroy",!0)},_setupDisabled:function(e){t.isArray(e)&&(e.length?e.length===this.anchors.length&&(e=!0):e=!1);for(var i,s=0;i=this.tabs[s];s++)e===!0||-1!==t.inArray(s,e)?t(i).addClass("ui-state-disabled").attr("aria-disabled","true"):t(i).removeClass("ui-state-disabled").removeAttr("aria-disabled");this.options.disabled=e},_setupEvents:function(e){var i={click:function(t){t.preventDefault()}};e&&t.each(e.split(" "),function(t,e){i[e]="_eventHandler"}),this._off(this.anchors.add(this.tabs).add(this.panels)),this._on(this.anchors,i),this._on(this.tabs,{keydown:"_tabKeydown"}),this._on(this.panels,{keydown:"_panelKeydown"}),this._focusable(this.tabs),this._hoverable(this.tabs)},_setupHeightStyle:function(e){var i,s=this.element.parent();"fill"===e?(i=s.height(),i-=this.element.outerHeight()-this.element.height(),this.element.siblings(":visible").each(function(){var e=t(this),s=e.css("position");"absolute"!==s&&"fixed"!==s&&(i-=e.outerHeight(!0))}),this.element.children().not(this.panels).each(function(){i-=t(this).outerHeight(!0)}),this.panels.each(function(){t(this).height(Math.max(0,i-t(this).innerHeight()+t(this).height()))}).css("overflow","auto")):"auto"===e&&(i=0,this.panels.each(function(){i=Math.max(i,t(this).height("").height())}).height(i))},_eventHandler:function(e){var i=this.options,s=this.active,n=t(e.currentTarget),a=n.closest("li"),o=a[0]===s[0],r=o&&i.collapsible,h=r?t():this._getPanelForTab(a),l=s.length?this._getPanelForTab(s):t(),u={oldTab:s,oldPanel:l,newTab:r?t():a,newPanel:h};e.preventDefault(),a.hasClass("ui-state-disabled")||a.hasClass("ui-tabs-loading")||this.running||o&&!i.collapsible||this._trigger("beforeActivate",e,u)===!1||(i.active=r?!1:this.tabs.index(a),this.active=o?t():a,this.xhr&&this.xhr.abort(),l.length||h.length||t.error("jQuery UI Tabs: Mismatching fragment identifier."),h.length&&this.load(this.tabs.index(a),e),this._toggle(e,u))},_toggle:function(e,i){function s(){a.running=!1,a._trigger("activate",e,i)}function n(){i.newTab.closest("li").addClass("ui-tabs-active ui-state-active"),o.length&&a.options.show?a._show(o,a.options.show,s):(o.show(),s())}var a=this,o=i.newPanel,r=i.oldPanel;this.running=!0,r.length&&this.options.hide?this._hide(r,this.options.hide,function(){i.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"),n()}):(i.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"),r.hide(),n()),r.attr({"aria-expanded":"false","aria-hidden":"true"}),i.oldTab.attr("aria-selected","false"),o.length&&r.length?i.oldTab.attr("tabIndex",-1):o.length&&this.tabs.filter(function(){return 0===t(this).attr("tabIndex")}).attr("tabIndex",-1),o.attr({"aria-expanded":"true","aria-hidden":"false"}),i.newTab.attr({"aria-selected":"true",tabIndex:0})},_activate:function(e){var i,s=this._findActive(e);s[0]!==this.active[0]&&(s.length||(s=this.active),i=s.find(".ui-tabs-anchor")[0],this._eventHandler({target:i,currentTarget:i,preventDefault:t.noop}))},_findActive:function(e){return e===!1?t():this.tabs.eq(e)},_getIndex:function(t){return"string"==typeof t&&(t=this.anchors.index(this.anchors.filter("[href$='"+t+"']"))),t},_destroy:function(){this.xhr&&this.xhr.abort(),this.element.removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible"),this.tablist.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").removeAttr("role"),this.anchors.removeClass("ui-tabs-anchor").removeAttr("role").removeAttr("tabIndex").removeUniqueId(),this.tabs.add(this.panels).each(function(){t.data(this,"ui-tabs-destroy")?t(this).remove():t(this).removeClass("ui-state-default ui-state-active ui-state-disabled ui-corner-top ui-corner-bottom ui-widget-content ui-tabs-active ui-tabs-panel").removeAttr("tabIndex").removeAttr("aria-live").removeAttr("aria-busy").removeAttr("aria-selected").removeAttr("aria-labelledby").removeAttr("aria-hidden").removeAttr("aria-expanded").removeAttr("role")}),this.tabs.each(function(){var e=t(this),i=e.data("ui-tabs-aria-controls");i?e.attr("aria-controls",i).removeData("ui-tabs-aria-controls"):e.removeAttr("aria-controls")}),this.panels.show(),"content"!==this.options.heightStyle&&this.panels.css("height","")},enable:function(i){var s=this.options.disabled;s!==!1&&(i===e?s=!1:(i=this._getIndex(i),s=t.isArray(s)?t.map(s,function(t){return t!==i?t:null}):t.map(this.tabs,function(t,e){return e!==i?e:null})),this._setupDisabled(s))},disable:function(i){var s=this.options.disabled;if(s!==!0){if(i===e)s=!0;else{if(i=this._getIndex(i),-1!==t.inArray(i,s))return;s=t.isArray(s)?t.merge([i],s).sort():[i]}this._setupDisabled(s)}},load:function(e,i){e=this._getIndex(e);var n=this,a=this.tabs.eq(e),o=a.find(".ui-tabs-anchor"),r=this._getPanelForTab(a),h={tab:a,panel:r};s(o[0])||(this.xhr=t.ajax(this._ajaxSettings(o,i,h)),this.xhr&&"canceled"!==this.xhr.statusText&&(a.addClass("ui-tabs-loading"),r.attr("aria-busy","true"),this.xhr.success(function(t){setTimeout(function(){r.html(t),n._trigger("load",i,h)},1)}).complete(function(t,e){setTimeout(function(){"abort"===e&&n.panels.stop(!1,!0),a.removeClass("ui-tabs-loading"),r.removeAttr("aria-busy"),t===n.xhr&&delete n.xhr},1)})))},_ajaxSettings:function(e,i,s){var n=this;return{url:e.attr("href"),beforeSend:function(e,a){return n._trigger("beforeLoad",i,t.extend({jqXHR:e,ajaxSettings:a},s))}}},_getPanelForTab:function(e){var i=t(e).attr("aria-controls");return this.element.find(this._sanitizeSelector("#"+i))}})})(jQuery);(function(t){function e(e,i){var s=(e.attr("aria-describedby")||"").split(/\s+/);s.push(i),e.data("ui-tooltip-id",i).attr("aria-describedby",t.trim(s.join(" ")))}function i(e){var i=e.data("ui-tooltip-id"),s=(e.attr("aria-describedby")||"").split(/\s+/),n=t.inArray(i,s);-1!==n&&s.splice(n,1),e.removeData("ui-tooltip-id"),s=t.trim(s.join(" ")),s?e.attr("aria-describedby",s):e.removeAttr("aria-describedby")}var s=0;t.widget("ui.tooltip",{version:"1.10.3",options:{content:function(){var e=t(this).attr("title")||"";return t("<a>").text(e).html()},hide:!0,items:"[title]:not([disabled])",position:{my:"left top+15",at:"left bottom",collision:"flipfit flip"},show:!0,tooltipClass:null,track:!1,close:null,open:null},_create:function(){this._on({mouseover:"open",focusin:"open"}),this.tooltips={},this.parents={},this.options.disabled&&this._disable()},_setOption:function(e,i){var s=this;return"disabled"===e?(this[i?"_disable":"_enable"](),this.options[e]=i,void 0):(this._super(e,i),"content"===e&&t.each(this.tooltips,function(t,e){s._updateContent(e)}),void 0)},_disable:function(){var e=this;t.each(this.tooltips,function(i,s){var n=t.Event("blur");n.target=n.currentTarget=s[0],e.close(n,!0)}),this.element.find(this.options.items).addBack().each(function(){var e=t(this);e.is("[title]")&&e.data("ui-tooltip-title",e.attr("title")).attr("title","")})},_enable:function(){this.element.find(this.options.items).addBack().each(function(){var e=t(this);e.data("ui-tooltip-title")&&e.attr("title",e.data("ui-tooltip-title"))})},open:function(e){var i=this,s=t(e?e.target:this.element).closest(this.options.items);s.length&&!s.data("ui-tooltip-id")&&(s.attr("title")&&s.data("ui-tooltip-title",s.attr("title")),s.data("ui-tooltip-open",!0),e&&"mouseover"===e.type&&s.parents().each(function(){var e,s=t(this);s.data("ui-tooltip-open")&&(e=t.Event("blur"),e.target=e.currentTarget=this,i.close(e,!0)),s.attr("title")&&(s.uniqueId(),i.parents[this.id]={element:this,title:s.attr("title")},s.attr("title",""))}),this._updateContent(s,e))},_updateContent:function(t,e){var i,s=this.options.content,n=this,a=e?e.type:null;return"string"==typeof s?this._open(e,t,s):(i=s.call(t[0],function(i){t.data("ui-tooltip-open")&&n._delay(function(){e&&(e.type=a),this._open(e,t,i)})}),i&&this._open(e,t,i),void 0)},_open:function(i,s,n){function a(t){l.of=t,o.is(":hidden")||o.position(l)}var o,r,h,l=t.extend({},this.options.position);if(n){if(o=this._find(s),o.length)return o.find(".ui-tooltip-content").html(n),void 0;s.is("[title]")&&(i&&"mouseover"===i.type?s.attr("title",""):s.removeAttr("title")),o=this._tooltip(s),e(s,o.attr("id")),o.find(".ui-tooltip-content").html(n),this.options.track&&i&&/^mouse/.test(i.type)?(this._on(this.document,{mousemove:a}),a(i)):o.position(t.extend({of:s},this.options.position)),o.hide(),this._show(o,this.options.show),this.options.show&&this.options.show.delay&&(h=this.delayedShow=setInterval(function(){o.is(":visible")&&(a(l.of),clearInterval(h))},t.fx.interval)),this._trigger("open",i,{tooltip:o}),r={keyup:function(e){if(e.keyCode===t.ui.keyCode.ESCAPE){var i=t.Event(e);i.currentTarget=s[0],this.close(i,!0)}},remove:function(){this._removeTooltip(o)}},i&&"mouseover"!==i.type||(r.mouseleave="close"),i&&"focusin"!==i.type||(r.focusout="close"),this._on(!0,s,r)}},close:function(e){var s=this,n=t(e?e.currentTarget:this.element),a=this._find(n);this.closing||(clearInterval(this.delayedShow),n.data("ui-tooltip-title")&&n.attr("title",n.data("ui-tooltip-title")),i(n),a.stop(!0),this._hide(a,this.options.hide,function(){s._removeTooltip(t(this))}),n.removeData("ui-tooltip-open"),this._off(n,"mouseleave focusout keyup"),n[0]!==this.element[0]&&this._off(n,"remove"),this._off(this.document,"mousemove"),e&&"mouseleave"===e.type&&t.each(this.parents,function(e,i){t(i.element).attr("title",i.title),delete s.parents[e]}),this.closing=!0,this._trigger("close",e,{tooltip:a}),this.closing=!1)},_tooltip:function(e){var i="ui-tooltip-"+s++,n=t("<div>").attr({id:i,role:"tooltip"}).addClass("ui-tooltip ui-widget ui-corner-all ui-widget-content "+(this.options.tooltipClass||""));return t("<div>").addClass("ui-tooltip-content").appendTo(n),n.appendTo(this.document[0].body),this.tooltips[i]=e,n},_find:function(e){var i=e.data("ui-tooltip-id");return i?t("#"+i):t()},_removeTooltip:function(t){t.remove(),delete this.tooltips[t.attr("id")]},_destroy:function(){var e=this;t.each(this.tooltips,function(i,s){var n=t.Event("blur");n.target=n.currentTarget=s[0],e.close(n,!0),t("#"+i).remove(),s.data("ui-tooltip-title")&&(s.attr("title",s.data("ui-tooltip-title")),s.removeData("ui-tooltip-title"))})}})})(jQuery);(function(t,e){var i="ui-effects-";t.effects={effect:{}},function(t,e){function i(t,e,i){var s=u[e.type]||{};return null==t?i||!e.def?null:e.def:(t=s.floor?~~t:parseFloat(t),isNaN(t)?e.def:s.mod?(t+s.mod)%s.mod:0>t?0:t>s.max?s.max:t)}function s(i){var s=l(),n=s._rgba=[];return i=i.toLowerCase(),f(h,function(t,a){var o,r=a.re.exec(i),h=r&&a.parse(r),l=a.space||"rgba";return h?(o=s[l](h),s[c[l].cache]=o[c[l].cache],n=s._rgba=o._rgba,!1):e}),n.length?("0,0,0,0"===n.join()&&t.extend(n,a.transparent),s):a[i]}function n(t,e,i){return i=(i+1)%1,1>6*i?t+6*(e-t)*i:1>2*i?e:2>3*i?t+6*(e-t)*(2/3-i):t}var a,o="backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor",r=/^([\-+])=\s*(\d+\.?\d*)/,h=[{re:/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,parse:function(t){return[t[1],t[2],t[3],t[4]]}},{re:/rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,parse:function(t){return[2.55*t[1],2.55*t[2],2.55*t[3],t[4]]}},{re:/#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,parse:function(t){return[parseInt(t[1],16),parseInt(t[2],16),parseInt(t[3],16)]}},{re:/#([a-f0-9])([a-f0-9])([a-f0-9])/,parse:function(t){return[parseInt(t[1]+t[1],16),parseInt(t[2]+t[2],16),parseInt(t[3]+t[3],16)]}},{re:/hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,space:"hsla",parse:function(t){return[t[1],t[2]/100,t[3]/100,t[4]]}}],l=t.Color=function(e,i,s,n){return new t.Color.fn.parse(e,i,s,n)},c={rgba:{props:{red:{idx:0,type:"byte"},green:{idx:1,type:"byte"},blue:{idx:2,type:"byte"}}},hsla:{props:{hue:{idx:0,type:"degrees"},saturation:{idx:1,type:"percent"},lightness:{idx:2,type:"percent"}}}},u={"byte":{floor:!0,max:255},percent:{max:1},degrees:{mod:360,floor:!0}},d=l.support={},p=t("<p>")[0],f=t.each;p.style.cssText="background-color:rgba(1,1,1,.5)",d.rgba=p.style.backgroundColor.indexOf("rgba")>-1,f(c,function(t,e){e.cache="_"+t,e.props.alpha={idx:3,type:"percent",def:1}}),l.fn=t.extend(l.prototype,{parse:function(n,o,r,h){if(n===e)return this._rgba=[null,null,null,null],this;(n.jquery||n.nodeType)&&(n=t(n).css(o),o=e);var u=this,d=t.type(n),p=this._rgba=[];return o!==e&&(n=[n,o,r,h],d="array"),"string"===d?this.parse(s(n)||a._default):"array"===d?(f(c.rgba.props,function(t,e){p[e.idx]=i(n[e.idx],e)}),this):"object"===d?(n instanceof l?f(c,function(t,e){n[e.cache]&&(u[e.cache]=n[e.cache].slice())}):f(c,function(e,s){var a=s.cache;f(s.props,function(t,e){if(!u[a]&&s.to){if("alpha"===t||null==n[t])return;u[a]=s.to(u._rgba)}u[a][e.idx]=i(n[t],e,!0)}),u[a]&&0>t.inArray(null,u[a].slice(0,3))&&(u[a][3]=1,s.from&&(u._rgba=s.from(u[a])))}),this):e},is:function(t){var i=l(t),s=!0,n=this;return f(c,function(t,a){var o,r=i[a.cache];return r&&(o=n[a.cache]||a.to&&a.to(n._rgba)||[],f(a.props,function(t,i){return null!=r[i.idx]?s=r[i.idx]===o[i.idx]:e})),s}),s},_space:function(){var t=[],e=this;return f(c,function(i,s){e[s.cache]&&t.push(i)}),t.pop()},transition:function(t,e){var s=l(t),n=s._space(),a=c[n],o=0===this.alpha()?l("transparent"):this,r=o[a.cache]||a.to(o._rgba),h=r.slice();return s=s[a.cache],f(a.props,function(t,n){var a=n.idx,o=r[a],l=s[a],c=u[n.type]||{};null!==l&&(null===o?h[a]=l:(c.mod&&(l-o>c.mod/2?o+=c.mod:o-l>c.mod/2&&(o-=c.mod)),h[a]=i((l-o)*e+o,n)))}),this[n](h)},blend:function(e){if(1===this._rgba[3])return this;var i=this._rgba.slice(),s=i.pop(),n=l(e)._rgba;return l(t.map(i,function(t,e){return(1-s)*n[e]+s*t}))},toRgbaString:function(){var e="rgba(",i=t.map(this._rgba,function(t,e){return null==t?e>2?1:0:t});return 1===i[3]&&(i.pop(),e="rgb("),e+i.join()+")"},toHslaString:function(){var e="hsla(",i=t.map(this.hsla(),function(t,e){return null==t&&(t=e>2?1:0),e&&3>e&&(t=Math.round(100*t)+"%"),t});return 1===i[3]&&(i.pop(),e="hsl("),e+i.join()+")"},toHexString:function(e){var i=this._rgba.slice(),s=i.pop();return e&&i.push(~~(255*s)),"#"+t.map(i,function(t){return t=(t||0).toString(16),1===t.length?"0"+t:t}).join("")},toString:function(){return 0===this._rgba[3]?"transparent":this.toRgbaString()}}),l.fn.parse.prototype=l.fn,c.hsla.to=function(t){if(null==t[0]||null==t[1]||null==t[2])return[null,null,null,t[3]];var e,i,s=t[0]/255,n=t[1]/255,a=t[2]/255,o=t[3],r=Math.max(s,n,a),h=Math.min(s,n,a),l=r-h,c=r+h,u=.5*c;return e=h===r?0:s===r?60*(n-a)/l+360:n===r?60*(a-s)/l+120:60*(s-n)/l+240,i=0===l?0:.5>=u?l/c:l/(2-c),[Math.round(e)%360,i,u,null==o?1:o]},c.hsla.from=function(t){if(null==t[0]||null==t[1]||null==t[2])return[null,null,null,t[3]];var e=t[0]/360,i=t[1],s=t[2],a=t[3],o=.5>=s?s*(1+i):s+i-s*i,r=2*s-o;return[Math.round(255*n(r,o,e+1/3)),Math.round(255*n(r,o,e)),Math.round(255*n(r,o,e-1/3)),a]},f(c,function(s,n){var a=n.props,o=n.cache,h=n.to,c=n.from;l.fn[s]=function(s){if(h&&!this[o]&&(this[o]=h(this._rgba)),s===e)return this[o].slice();var n,r=t.type(s),u="array"===r||"object"===r?s:arguments,d=this[o].slice();return f(a,function(t,e){var s=u["object"===r?t:e.idx];null==s&&(s=d[e.idx]),d[e.idx]=i(s,e)}),c?(n=l(c(d)),n[o]=d,n):l(d)},f(a,function(e,i){l.fn[e]||(l.fn[e]=function(n){var a,o=t.type(n),h="alpha"===e?this._hsla?"hsla":"rgba":s,l=this[h](),c=l[i.idx];return"undefined"===o?c:("function"===o&&(n=n.call(this,c),o=t.type(n)),null==n&&i.empty?this:("string"===o&&(a=r.exec(n),a&&(n=c+parseFloat(a[2])*("+"===a[1]?1:-1))),l[i.idx]=n,this[h](l)))})})}),l.hook=function(e){var i=e.split(" ");f(i,function(e,i){t.cssHooks[i]={set:function(e,n){var a,o,r="";if("transparent"!==n&&("string"!==t.type(n)||(a=s(n)))){if(n=l(a||n),!d.rgba&&1!==n._rgba[3]){for(o="backgroundColor"===i?e.parentNode:e;(""===r||"transparent"===r)&&o&&o.style;)try{r=t.css(o,"backgroundColor"),o=o.parentNode}catch(h){}n=n.blend(r&&"transparent"!==r?r:"_default")}n=n.toRgbaString()}try{e.style[i]=n}catch(h){}}},t.fx.step[i]=function(e){e.colorInit||(e.start=l(e.elem,i),e.end=l(e.end),e.colorInit=!0),t.cssHooks[i].set(e.elem,e.start.transition(e.end,e.pos))}})},l.hook(o),t.cssHooks.borderColor={expand:function(t){var e={};return f(["Top","Right","Bottom","Left"],function(i,s){e["border"+s+"Color"]=t}),e}},a=t.Color.names={aqua:"#00ffff",black:"#000000",blue:"#0000ff",fuchsia:"#ff00ff",gray:"#808080",green:"#008000",lime:"#00ff00",maroon:"#800000",navy:"#000080",olive:"#808000",purple:"#800080",red:"#ff0000",silver:"#c0c0c0",teal:"#008080",white:"#ffffff",yellow:"#ffff00",transparent:[null,null,null,0],_default:"#ffffff"}}(jQuery),function(){function i(e){var i,s,n=e.ownerDocument.defaultView?e.ownerDocument.defaultView.getComputedStyle(e,null):e.currentStyle,a={};if(n&&n.length&&n[0]&&n[n[0]])for(s=n.length;s--;)i=n[s],"string"==typeof n[i]&&(a[t.camelCase(i)]=n[i]);else for(i in n)"string"==typeof n[i]&&(a[i]=n[i]);return a}function s(e,i){var s,n,o={};for(s in i)n=i[s],e[s]!==n&&(a[s]||(t.fx.step[s]||!isNaN(parseFloat(n)))&&(o[s]=n));return o}var n=["add","remove","toggle"],a={border:1,borderBottom:1,borderColor:1,borderLeft:1,borderRight:1,borderTop:1,borderWidth:1,margin:1,padding:1};t.each(["borderLeftStyle","borderRightStyle","borderBottomStyle","borderTopStyle"],function(e,i){t.fx.step[i]=function(t){("none"!==t.end&&!t.setAttr||1===t.pos&&!t.setAttr)&&(jQuery.style(t.elem,i,t.end),t.setAttr=!0)}}),t.fn.addBack||(t.fn.addBack=function(t){return this.add(null==t?this.prevObject:this.prevObject.filter(t))}),t.effects.animateClass=function(e,a,o,r){var h=t.speed(a,o,r);return this.queue(function(){var a,o=t(this),r=o.attr("class")||"",l=h.children?o.find("*").addBack():o;l=l.map(function(){var e=t(this);return{el:e,start:i(this)}}),a=function(){t.each(n,function(t,i){e[i]&&o[i+"Class"](e[i])})},a(),l=l.map(function(){return this.end=i(this.el[0]),this.diff=s(this.start,this.end),this}),o.attr("class",r),l=l.map(function(){var e=this,i=t.Deferred(),s=t.extend({},h,{queue:!1,complete:function(){i.resolve(e)}});return this.el.animate(this.diff,s),i.promise()}),t.when.apply(t,l.get()).done(function(){a(),t.each(arguments,function(){var e=this.el;t.each(this.diff,function(t){e.css(t,"")})}),h.complete.call(o[0])})})},t.fn.extend({addClass:function(e){return function(i,s,n,a){return s?t.effects.animateClass.call(this,{add:i},s,n,a):e.apply(this,arguments)}}(t.fn.addClass),removeClass:function(e){return function(i,s,n,a){return arguments.length>1?t.effects.animateClass.call(this,{remove:i},s,n,a):e.apply(this,arguments)}}(t.fn.removeClass),toggleClass:function(i){return function(s,n,a,o,r){return"boolean"==typeof n||n===e?a?t.effects.animateClass.call(this,n?{add:s}:{remove:s},a,o,r):i.apply(this,arguments):t.effects.animateClass.call(this,{toggle:s},n,a,o)}}(t.fn.toggleClass),switchClass:function(e,i,s,n,a){return t.effects.animateClass.call(this,{add:i,remove:e},s,n,a)}})}(),function(){function s(e,i,s,n){return t.isPlainObject(e)&&(i=e,e=e.effect),e={effect:e},null==i&&(i={}),t.isFunction(i)&&(n=i,s=null,i={}),("number"==typeof i||t.fx.speeds[i])&&(n=s,s=i,i={}),t.isFunction(s)&&(n=s,s=null),i&&t.extend(e,i),s=s||i.duration,e.duration=t.fx.off?0:"number"==typeof s?s:s in t.fx.speeds?t.fx.speeds[s]:t.fx.speeds._default,e.complete=n||i.complete,e}function n(e){return!e||"number"==typeof e||t.fx.speeds[e]?!0:"string"!=typeof e||t.effects.effect[e]?t.isFunction(e)?!0:"object"!=typeof e||e.effect?!1:!0:!0}t.extend(t.effects,{version:"1.10.3",save:function(t,e){for(var s=0;e.length>s;s++)null!==e[s]&&t.data(i+e[s],t[0].style[e[s]])},restore:function(t,s){var n,a;for(a=0;s.length>a;a++)null!==s[a]&&(n=t.data(i+s[a]),n===e&&(n=""),t.css(s[a],n))},setMode:function(t,e){return"toggle"===e&&(e=t.is(":hidden")?"show":"hide"),e},getBaseline:function(t,e){var i,s;switch(t[0]){case"top":i=0;break;case"middle":i=.5;break;case"bottom":i=1;break;default:i=t[0]/e.height}switch(t[1]){case"left":s=0;break;case"center":s=.5;break;case"right":s=1;break;default:s=t[1]/e.width}return{x:s,y:i}},createWrapper:function(e){if(e.parent().is(".ui-effects-wrapper"))return e.parent();var i={width:e.outerWidth(!0),height:e.outerHeight(!0),"float":e.css("float")},s=t("<div></div>").addClass("ui-effects-wrapper").css({fontSize:"100%",background:"transparent",border:"none",margin:0,padding:0}),n={width:e.width(),height:e.height()},a=document.activeElement;try{a.id}catch(o){a=document.body}return e.wrap(s),(e[0]===a||t.contains(e[0],a))&&t(a).focus(),s=e.parent(),"static"===e.css("position")?(s.css({position:"relative"}),e.css({position:"relative"})):(t.extend(i,{position:e.css("position"),zIndex:e.css("z-index")}),t.each(["top","left","bottom","right"],function(t,s){i[s]=e.css(s),isNaN(parseInt(i[s],10))&&(i[s]="auto")}),e.css({position:"relative",top:0,left:0,right:"auto",bottom:"auto"})),e.css(n),s.css(i).show()},removeWrapper:function(e){var i=document.activeElement;return e.parent().is(".ui-effects-wrapper")&&(e.parent().replaceWith(e),(e[0]===i||t.contains(e[0],i))&&t(i).focus()),e},setTransition:function(e,i,s,n){return n=n||{},t.each(i,function(t,i){var a=e.cssUnit(i);a[0]>0&&(n[i]=a[0]*s+a[1])}),n}}),t.fn.extend({effect:function(){function e(e){function s(){t.isFunction(a)&&a.call(n[0]),t.isFunction(e)&&e()}var n=t(this),a=i.complete,r=i.mode;(n.is(":hidden")?"hide"===r:"show"===r)?(n[r](),s()):o.call(n[0],i,s)}var i=s.apply(this,arguments),n=i.mode,a=i.queue,o=t.effects.effect[i.effect];return t.fx.off||!o?n?this[n](i.duration,i.complete):this.each(function(){i.complete&&i.complete.call(this)}):a===!1?this.each(e):this.queue(a||"fx",e)},show:function(t){return function(e){if(n(e))return t.apply(this,arguments);var i=s.apply(this,arguments);return i.mode="show",this.effect.call(this,i)}}(t.fn.show),hide:function(t){return function(e){if(n(e))return t.apply(this,arguments);var i=s.apply(this,arguments);return i.mode="hide",this.effect.call(this,i)}}(t.fn.hide),toggle:function(t){return function(e){if(n(e)||"boolean"==typeof e)return t.apply(this,arguments);var i=s.apply(this,arguments);return i.mode="toggle",this.effect.call(this,i)}}(t.fn.toggle),cssUnit:function(e){var i=this.css(e),s=[];return t.each(["em","px","%","pt"],function(t,e){i.indexOf(e)>0&&(s=[parseFloat(i),e])}),s}})}(),function(){var e={};t.each(["Quad","Cubic","Quart","Quint","Expo"],function(t,i){e[i]=function(e){return Math.pow(e,t+2)}}),t.extend(e,{Sine:function(t){return 1-Math.cos(t*Math.PI/2)},Circ:function(t){return 1-Math.sqrt(1-t*t)},Elastic:function(t){return 0===t||1===t?t:-Math.pow(2,8*(t-1))*Math.sin((80*(t-1)-7.5)*Math.PI/15)},Back:function(t){return t*t*(3*t-2)},Bounce:function(t){for(var e,i=4;((e=Math.pow(2,--i))-1)/11>t;);return 1/Math.pow(4,3-i)-7.5625*Math.pow((3*e-2)/22-t,2)}}),t.each(e,function(e,i){t.easing["easeIn"+e]=i,t.easing["easeOut"+e]=function(t){return 1-i(1-t)},t.easing["easeInOut"+e]=function(t){return.5>t?i(2*t)/2:1-i(-2*t+2)/2}})}()})(jQuery);(function(t){var e=/up|down|vertical/,i=/up|left|vertical|horizontal/;t.effects.effect.blind=function(s,n){var a,o,r,h=t(this),l=["position","top","bottom","left","right","height","width"],c=t.effects.setMode(h,s.mode||"hide"),u=s.direction||"up",d=e.test(u),p=d?"height":"width",f=d?"top":"left",m=i.test(u),g={},v="show"===c;h.parent().is(".ui-effects-wrapper")?t.effects.save(h.parent(),l):t.effects.save(h,l),h.show(),a=t.effects.createWrapper(h).css({overflow:"hidden"}),o=a[p](),r=parseFloat(a.css(f))||0,g[p]=v?o:0,m||(h.css(d?"bottom":"right",0).css(d?"top":"left","auto").css({position:"absolute"}),g[f]=v?r:o+r),v&&(a.css(p,0),m||a.css(f,r+o)),a.animate(g,{duration:s.duration,easing:s.easing,queue:!1,complete:function(){"hide"===c&&h.hide(),t.effects.restore(h,l),t.effects.removeWrapper(h),n()}})}})(jQuery);(function(t){t.effects.effect.bounce=function(e,i){var s,n,a,o=t(this),r=["position","top","bottom","left","right","height","width"],h=t.effects.setMode(o,e.mode||"effect"),l="hide"===h,c="show"===h,u=e.direction||"up",d=e.distance,p=e.times||5,f=2*p+(c||l?1:0),m=e.duration/f,g=e.easing,v="up"===u||"down"===u?"top":"left",_="up"===u||"left"===u,b=o.queue(),y=b.length;for((c||l)&&r.push("opacity"),t.effects.save(o,r),o.show(),t.effects.createWrapper(o),d||(d=o["top"===v?"outerHeight":"outerWidth"]()/3),c&&(a={opacity:1},a[v]=0,o.css("opacity",0).css(v,_?2*-d:2*d).animate(a,m,g)),l&&(d/=Math.pow(2,p-1)),a={},a[v]=0,s=0;p>s;s++)n={},n[v]=(_?"-=":"+=")+d,o.animate(n,m,g).animate(a,m,g),d=l?2*d:d/2;l&&(n={opacity:0},n[v]=(_?"-=":"+=")+d,o.animate(n,m,g)),o.queue(function(){l&&o.hide(),t.effects.restore(o,r),t.effects.removeWrapper(o),i()}),y>1&&b.splice.apply(b,[1,0].concat(b.splice(y,f+1))),o.dequeue()}})(jQuery);(function(t){t.effects.effect.clip=function(e,i){var s,n,a,o=t(this),r=["position","top","bottom","left","right","height","width"],h=t.effects.setMode(o,e.mode||"hide"),l="show"===h,c=e.direction||"vertical",u="vertical"===c,d=u?"height":"width",p=u?"top":"left",f={};t.effects.save(o,r),o.show(),s=t.effects.createWrapper(o).css({overflow:"hidden"}),n="IMG"===o[0].tagName?s:o,a=n[d](),l&&(n.css(d,0),n.css(p,a/2)),f[d]=l?a:0,f[p]=l?0:a/2,n.animate(f,{queue:!1,duration:e.duration,easing:e.easing,complete:function(){l||o.hide(),t.effects.restore(o,r),t.effects.removeWrapper(o),i()}})}})(jQuery);(function(t){t.effects.effect.drop=function(e,i){var s,n=t(this),a=["position","top","bottom","left","right","opacity","height","width"],o=t.effects.setMode(n,e.mode||"hide"),r="show"===o,h=e.direction||"left",l="up"===h||"down"===h?"top":"left",c="up"===h||"left"===h?"pos":"neg",u={opacity:r?1:0};t.effects.save(n,a),n.show(),t.effects.createWrapper(n),s=e.distance||n["top"===l?"outerHeight":"outerWidth"](!0)/2,r&&n.css("opacity",0).css(l,"pos"===c?-s:s),u[l]=(r?"pos"===c?"+=":"-=":"pos"===c?"-=":"+=")+s,n.animate(u,{queue:!1,duration:e.duration,easing:e.easing,complete:function(){"hide"===o&&n.hide(),t.effects.restore(n,a),t.effects.removeWrapper(n),i()}})}})(jQuery);(function(t){t.effects.effect.explode=function(e,i){function s(){b.push(this),b.length===u*d&&n()}function n(){p.css({visibility:"visible"}),t(b).remove(),m||p.hide(),i()}var a,o,r,h,l,c,u=e.pieces?Math.round(Math.sqrt(e.pieces)):3,d=u,p=t(this),f=t.effects.setMode(p,e.mode||"hide"),m="show"===f,g=p.show().css("visibility","hidden").offset(),v=Math.ceil(p.outerWidth()/d),_=Math.ceil(p.outerHeight()/u),b=[];for(a=0;u>a;a++)for(h=g.top+a*_,c=a-(u-1)/2,o=0;d>o;o++)r=g.left+o*v,l=o-(d-1)/2,p.clone().appendTo("body").wrap("<div></div>").css({position:"absolute",visibility:"visible",left:-o*v,top:-a*_}).parent().addClass("ui-effects-explode").css({position:"absolute",overflow:"hidden",width:v,height:_,left:r+(m?l*v:0),top:h+(m?c*_:0),opacity:m?0:1}).animate({left:r+(m?0:l*v),top:h+(m?0:c*_),opacity:m?1:0},e.duration||500,e.easing,s)}})(jQuery);(function(t){t.effects.effect.fade=function(e,i){var s=t(this),n=t.effects.setMode(s,e.mode||"toggle");s.animate({opacity:n},{queue:!1,duration:e.duration,easing:e.easing,complete:i})}})(jQuery);(function(t){t.effects.effect.fold=function(e,i){var s,n,a=t(this),o=["position","top","bottom","left","right","height","width"],r=t.effects.setMode(a,e.mode||"hide"),h="show"===r,l="hide"===r,c=e.size||15,u=/([0-9]+)%/.exec(c),d=!!e.horizFirst,p=h!==d,f=p?["width","height"]:["height","width"],m=e.duration/2,g={},v={};t.effects.save(a,o),a.show(),s=t.effects.createWrapper(a).css({overflow:"hidden"}),n=p?[s.width(),s.height()]:[s.height(),s.width()],u&&(c=parseInt(u[1],10)/100*n[l?0:1]),h&&s.css(d?{height:0,width:c}:{height:c,width:0}),g[f[0]]=h?n[0]:c,v[f[1]]=h?n[1]:0,s.animate(g,m,e.easing).animate(v,m,e.easing,function(){l&&a.hide(),t.effects.restore(a,o),t.effects.removeWrapper(a),i()})}})(jQuery);(function(t){t.effects.effect.highlight=function(e,i){var s=t(this),n=["backgroundImage","backgroundColor","opacity"],a=t.effects.setMode(s,e.mode||"show"),o={backgroundColor:s.css("backgroundColor")};"hide"===a&&(o.opacity=0),t.effects.save(s,n),s.show().css({backgroundImage:"none",backgroundColor:e.color||"#ffff99"}).animate(o,{queue:!1,duration:e.duration,easing:e.easing,complete:function(){"hide"===a&&s.hide(),t.effects.restore(s,n),i()}})}})(jQuery);(function(t){t.effects.effect.pulsate=function(e,i){var s,n=t(this),a=t.effects.setMode(n,e.mode||"show"),o="show"===a,r="hide"===a,h=o||"hide"===a,l=2*(e.times||5)+(h?1:0),c=e.duration/l,u=0,d=n.queue(),p=d.length;for((o||!n.is(":visible"))&&(n.css("opacity",0).show(),u=1),s=1;l>s;s++)n.animate({opacity:u},c,e.easing),u=1-u;n.animate({opacity:u},c,e.easing),n.queue(function(){r&&n.hide(),i()}),p>1&&d.splice.apply(d,[1,0].concat(d.splice(p,l+1))),n.dequeue()}})(jQuery);(function(t){t.effects.effect.puff=function(e,i){var s=t(this),n=t.effects.setMode(s,e.mode||"hide"),a="hide"===n,o=parseInt(e.percent,10)||150,r=o/100,h={height:s.height(),width:s.width(),outerHeight:s.outerHeight(),outerWidth:s.outerWidth()};t.extend(e,{effect:"scale",queue:!1,fade:!0,mode:n,complete:i,percent:a?o:100,from:a?h:{height:h.height*r,width:h.width*r,outerHeight:h.outerHeight*r,outerWidth:h.outerWidth*r}}),s.effect(e)},t.effects.effect.scale=function(e,i){var s=t(this),n=t.extend(!0,{},e),a=t.effects.setMode(s,e.mode||"effect"),o=parseInt(e.percent,10)||(0===parseInt(e.percent,10)?0:"hide"===a?0:100),r=e.direction||"both",h=e.origin,l={height:s.height(),width:s.width(),outerHeight:s.outerHeight(),outerWidth:s.outerWidth()},c={y:"horizontal"!==r?o/100:1,x:"vertical"!==r?o/100:1};n.effect="size",n.queue=!1,n.complete=i,"effect"!==a&&(n.origin=h||["middle","center"],n.restore=!0),n.from=e.from||("show"===a?{height:0,width:0,outerHeight:0,outerWidth:0}:l),n.to={height:l.height*c.y,width:l.width*c.x,outerHeight:l.outerHeight*c.y,outerWidth:l.outerWidth*c.x},n.fade&&("show"===a&&(n.from.opacity=0,n.to.opacity=1),"hide"===a&&(n.from.opacity=1,n.to.opacity=0)),s.effect(n)},t.effects.effect.size=function(e,i){var s,n,a,o=t(this),r=["position","top","bottom","left","right","width","height","overflow","opacity"],h=["position","top","bottom","left","right","overflow","opacity"],l=["width","height","overflow"],c=["fontSize"],u=["borderTopWidth","borderBottomWidth","paddingTop","paddingBottom"],d=["borderLeftWidth","borderRightWidth","paddingLeft","paddingRight"],p=t.effects.setMode(o,e.mode||"effect"),f=e.restore||"effect"!==p,m=e.scale||"both",g=e.origin||["middle","center"],v=o.css("position"),_=f?r:h,b={height:0,width:0,outerHeight:0,outerWidth:0};"show"===p&&o.show(),s={height:o.height(),width:o.width(),outerHeight:o.outerHeight(),outerWidth:o.outerWidth()},"toggle"===e.mode&&"show"===p?(o.from=e.to||b,o.to=e.from||s):(o.from=e.from||("show"===p?b:s),o.to=e.to||("hide"===p?b:s)),a={from:{y:o.from.height/s.height,x:o.from.width/s.width},to:{y:o.to.height/s.height,x:o.to.width/s.width}},("box"===m||"both"===m)&&(a.from.y!==a.to.y&&(_=_.concat(u),o.from=t.effects.setTransition(o,u,a.from.y,o.from),o.to=t.effects.setTransition(o,u,a.to.y,o.to)),a.from.x!==a.to.x&&(_=_.concat(d),o.from=t.effects.setTransition(o,d,a.from.x,o.from),o.to=t.effects.setTransition(o,d,a.to.x,o.to))),("content"===m||"both"===m)&&a.from.y!==a.to.y&&(_=_.concat(c).concat(l),o.from=t.effects.setTransition(o,c,a.from.y,o.from),o.to=t.effects.setTransition(o,c,a.to.y,o.to)),t.effects.save(o,_),o.show(),t.effects.createWrapper(o),o.css("overflow","hidden").css(o.from),g&&(n=t.effects.getBaseline(g,s),o.from.top=(s.outerHeight-o.outerHeight())*n.y,o.from.left=(s.outerWidth-o.outerWidth())*n.x,o.to.top=(s.outerHeight-o.to.outerHeight)*n.y,o.to.left=(s.outerWidth-o.to.outerWidth)*n.x),o.css(o.from),("content"===m||"both"===m)&&(u=u.concat(["marginTop","marginBottom"]).concat(c),d=d.concat(["marginLeft","marginRight"]),l=r.concat(u).concat(d),o.find("*[width]").each(function(){var i=t(this),s={height:i.height(),width:i.width(),outerHeight:i.outerHeight(),outerWidth:i.outerWidth()};f&&t.effects.save(i,l),i.from={height:s.height*a.from.y,width:s.width*a.from.x,outerHeight:s.outerHeight*a.from.y,outerWidth:s.outerWidth*a.from.x},i.to={height:s.height*a.to.y,width:s.width*a.to.x,outerHeight:s.height*a.to.y,outerWidth:s.width*a.to.x},a.from.y!==a.to.y&&(i.from=t.effects.setTransition(i,u,a.from.y,i.from),i.to=t.effects.setTransition(i,u,a.to.y,i.to)),a.from.x!==a.to.x&&(i.from=t.effects.setTransition(i,d,a.from.x,i.from),i.to=t.effects.setTransition(i,d,a.to.x,i.to)),i.css(i.from),i.animate(i.to,e.duration,e.easing,function(){f&&t.effects.restore(i,l)})})),o.animate(o.to,{queue:!1,duration:e.duration,easing:e.easing,complete:function(){0===o.to.opacity&&o.css("opacity",o.from.opacity),"hide"===p&&o.hide(),t.effects.restore(o,_),f||("static"===v?o.css({position:"relative",top:o.to.top,left:o.to.left}):t.each(["top","left"],function(t,e){o.css(e,function(e,i){var s=parseInt(i,10),n=t?o.to.left:o.to.top;return"auto"===i?n+"px":s+n+"px"})})),t.effects.removeWrapper(o),i()}})}})(jQuery);(function(t){t.effects.effect.shake=function(e,i){var s,n=t(this),a=["position","top","bottom","left","right","height","width"],o=t.effects.setMode(n,e.mode||"effect"),r=e.direction||"left",h=e.distance||20,l=e.times||3,c=2*l+1,u=Math.round(e.duration/c),d="up"===r||"down"===r?"top":"left",p="up"===r||"left"===r,f={},m={},g={},v=n.queue(),_=v.length;for(t.effects.save(n,a),n.show(),t.effects.createWrapper(n),f[d]=(p?"-=":"+=")+h,m[d]=(p?"+=":"-=")+2*h,g[d]=(p?"-=":"+=")+2*h,n.animate(f,u,e.easing),s=1;l>s;s++)n.animate(m,u,e.easing).animate(g,u,e.easing);n.animate(m,u,e.easing).animate(f,u/2,e.easing).queue(function(){"hide"===o&&n.hide(),t.effects.restore(n,a),t.effects.removeWrapper(n),i()}),_>1&&v.splice.apply(v,[1,0].concat(v.splice(_,c+1))),n.dequeue()}})(jQuery);(function(t){t.effects.effect.slide=function(e,i){var s,n=t(this),a=["position","top","bottom","left","right","width","height"],o=t.effects.setMode(n,e.mode||"show"),r="show"===o,h=e.direction||"left",l="up"===h||"down"===h?"top":"left",c="up"===h||"left"===h,u={};t.effects.save(n,a),n.show(),s=e.distance||n["top"===l?"outerHeight":"outerWidth"](!0),t.effects.createWrapper(n).css({overflow:"hidden"}),r&&n.css(l,c?isNaN(s)?"-"+s:-s:s),u[l]=(r?c?"+=":"-=":c?"-=":"+=")+s,n.animate(u,{queue:!1,duration:e.duration,easing:e.easing,complete:function(){"hide"===o&&n.hide(),t.effects.restore(n,a),t.effects.removeWrapper(n),i()}})}})(jQuery);(function(t){t.effects.effect.transfer=function(e,i){var s=t(this),n=t(e.to),a="fixed"===n.css("position"),o=t("body"),r=a?o.scrollTop():0,h=a?o.scrollLeft():0,l=n.offset(),c={top:l.top-r,left:l.left-h,height:n.innerHeight(),width:n.innerWidth()},u=s.offset(),d=t("<div class='ui-effects-transfer'></div>").appendTo(document.body).addClass(e.className).css({top:u.top-r,left:u.left-h,height:s.innerHeight(),width:s.innerWidth(),position:a?"fixed":"absolute"}).animate(c,e.duration,e.easing,function(){d.remove(),i()})}})(jQuery);/*
 * jQuery Templates Plugin 1.0.0pre
 * http://github.com/jquery/jquery-tmpl
 * Requires jQuery 1.4.2
 *
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */
(function (a) { var r = a.fn.domManip, d = "_tmplitem", q = /^[^<]*(<[\w\W]+>)[^>]*$|\{\{\! /, b = {}, f = {}, e, p = { key: 0, data: {} }, i = 0, c = 0, l = []; function g(e, d, g, h) { var c = { data: h || (d ? d.data : {}), _wrap: d ? d._wrap : null, tmpl: null, parent: d || null, nodes: [], calls: u, nest: w, wrap: x, html: v, update: t }; e && a.extend(c, e, { nodes: [], parent: d }); if (g) { c.tmpl = g; c._ctnt = c._ctnt || c.tmpl(a, c); c.key = ++i; (l.length ? f : b)[i] = c } return c } a.each({ appendTo: "append", prependTo: "prepend", insertBefore: "before", insertAfter: "after", replaceAll: "replaceWith" }, function (f, d) { a.fn[f] = function (n) { var g = [], i = a(n), k, h, m, l, j = this.length === 1 && this[0].parentNode; e = b || {}; if (j && j.nodeType === 11 && j.childNodes.length === 1 && i.length === 1) { i[d](this[0]); g = this } else { for (h = 0, m = i.length; h < m; h++) { c = h; k = (h > 0 ? this.clone(true) : this).get(); a(i[h])[d](k); g = g.concat(k) } c = 0; g = this.pushStack(g, f, i.selector) } l = e; e = null; a.tmpl.complete(l); return g } }); a.fn.extend({ tmpl: function (d, c, b) { return a.tmpl(this[0], d, c, b) }, tmplItem: function () { return a.tmplItem(this[0]) }, template: function (b) { return a.template(b, this[0]) }, domManip: function (d, m, k) { if (d[0] && a.isArray(d[0])) { var g = a.makeArray(arguments), h = d[0], j = h.length, i = 0, f; while (i < j && !(f = a.data(h[i++], "tmplItem"))); if (f && c) g[2] = function (b) { a.tmpl.afterManip(this, b, k) }; r.apply(this, g) } else r.apply(this, arguments); c = 0; !e && a.tmpl.complete(b); return this } }); a.extend({ tmpl: function (d, h, e, c) { var i, k = !c; if (k) { c = p; d = a.template[d] || a.template(null, d); f = {} } else if (!d) { d = c.tmpl; b[c.key] = c; c.nodes = []; c.wrapped && n(c, c.wrapped); return a(j(c, null, c.tmpl(a, c))) } if (!d) return []; if (typeof h === "function") h = h.call(c || {}); e && e.wrapped && n(e, e.wrapped); i = a.isArray(h) ? a.map(h, function (a) { return a ? g(e, c, d, a) : null }) : [g(e, c, d, h)]; return k ? a(j(c, null, i)) : i }, tmplItem: function (b) { var c; if (b instanceof a) b = b[0]; while (b && b.nodeType === 1 && !(c = a.data(b, "tmplItem")) && (b = b.parentNode)); return c || p }, template: function (c, b) { if (b) { if (typeof b === "string") b = o(b); else if (b instanceof a) b = b[0] || {}; if (b.nodeType) b = a.data(b, "tmpl") || a.data(b, "tmpl", o(b.innerHTML)); return typeof c === "string" ? (a.template[c] = b) : b } return c ? typeof c !== "string" ? a.template(null, c) : a.template[c] || a.template(null, q.test(c) ? c : a(c)) : null }, encode: function (a) { return ("" + a).split("<").join("&lt;").split(">").join("&gt;").split('"').join("&#34;").split("'").join("&#39;") } }); a.extend(a.tmpl, { tag: { tmpl: { _default: { $2: "null" }, open: "if($notnull_1){_=_.concat($item.nest($1,$2));}" }, wrap: { _default: { $2: "null" }, open: "$item.calls(_,$1,$2);_=[];", close: "call=$item.calls();_=call._.concat($item.wrap(call,_));" }, each: { _default: { $2: "$index, $value" }, open: "if($notnull_1){$.each($1a,function($2){with(this){", close: "}});}" }, "if": { open: "if(($notnull_1) && $1a){", close: "}" }, "else": { _default: { $1: "true" }, open: "}else if(($notnull_1) && $1a){" }, html: { open: "if($notnull_1){_.push($1a);}" }, "=": { _default: { $1: "$data" }, open: "if($notnull_1){_.push($.encode($1a));}" }, "!": { open: ""} }, complete: function () { b = {} }, afterManip: function (f, b, d) { var e = b.nodeType === 11 ? a.makeArray(b.childNodes) : b.nodeType === 1 ? [b] : []; d.call(f, b); m(e); c++ } }); function j(e, g, f) { var b, c = f ? a.map(f, function (a) { return typeof a === "string" ? e.key ? a.replace(/(<\w+)(?=[\s>])(?![^>]*_tmplitem)([^>]*)/g, "$1 " + d + '="' + e.key + '" $2') : a : j(a, e, a._ctnt) }) : e; if (g) return c; c = c.join(""); c.replace(/^\s*([^<\s][^<]*)?(<[\w\W]+>)([^>]*[^>\s])?\s*$/, function (f, c, e, d) { b = a(e).get(); m(b); if (c) b = k(c).concat(b); if (d) b = b.concat(k(d)) }); return b ? b : k(c) } function k(c) { var b = document.createElement("div"); b.innerHTML = c; return a.makeArray(b.childNodes) } function o(b) { return new Function("jQuery", "$item", "var $=jQuery,call,_=[],$data=$item.data;with($data){_.push('" + a.trim(b).replace(/([\\'])/g, "\\$1").replace(/[\r\t\n]/g, " ").replace(/\$\{([^\}]*)\}/g, "{{= $1}}").replace(/\{\{(\/?)(\w+|.)(?:\(((?:[^\}]|\}(?!\}))*?)?\))?(?:\s+(.*?)?)?(\(((?:[^\}]|\}(?!\}))*?)\))?\s*\}\}/g, function (m, l, k, d, b, c, e) { var j = a.tmpl.tag[k], i, f, g; if (!j) throw "Template command not found: " + k; i = j._default || []; if (c && !/\w$/.test(b)) { b += c; c = "" } if (b) { b = h(b); e = e ? "," + h(e) + ")" : c ? ")" : ""; f = c ? b.indexOf(".") > -1 ? b + h(c) : "(" + b + ").call($item" + e : b; g = c ? f : "(typeof(" + b + ")==='function'?(" + b + ").call($item):(" + b + "))" } else g = f = i.$1 || "null"; d = h(d); return "');" + j[l ? "close" : "open"].split("$notnull_1").join(b ? "typeof(" + b + ")!=='undefined' && (" + b + ")!=null" : "true").split("$1a").join(g).split("$1").join(f).split("$2").join(d ? d.replace(/\s*([^\(]+)\s*(\((.*?)\))?/g, function (d, c, b, a) { a = a ? "," + a + ")" : b ? ")" : ""; return a ? "(" + c + ").call($item" + a : d }) : i.$2 || "") + "_.push('" }) + "');}return _;") } function n(c, b) { c._wrap = j(c, true, a.isArray(b) ? b : [q.test(b) ? b : a(b).html()]).join("") } function h(a) { return a ? a.replace(/\\'/g, "'").replace(/\\\\/g, "\\") : null } function s(b) { var a = document.createElement("div"); a.appendChild(b.cloneNode(true)); return a.innerHTML } function m(o) { var n = "_" + c, k, j, l = {}, e, p, h; for (e = 0, p = o.length; e < p; e++) { if ((k = o[e]).nodeType !== 1) continue; j = k.getElementsByTagName("*"); for (h = j.length - 1; h >= 0; h--) m(j[h]); m(k) } function m(j) { var p, h = j, k, e, m; if (m = j.getAttribute(d)) { while (h.parentNode && (h = h.parentNode).nodeType === 1 && !(p = h.getAttribute(d))); if (p !== m) { h = h.parentNode ? h.nodeType === 11 ? 0 : h.getAttribute(d) || 0 : 0; if (!(e = b[m])) { e = f[m]; e = g(e, b[h] || f[h]); e.key = ++i; b[i] = e } c && o(m) } j.removeAttribute(d) } else if (c && (e = a.data(j, "tmplItem"))) { o(e.key); b[e.key] = e; h = a.data(j.parentNode, "tmplItem"); h = h ? h.key : 0 } if (e) { k = e; while (k && k.key != h) { k.nodes.push(j); k = k.parent } delete e._ctnt; delete e._wrap; a.data(j, "tmplItem", e) } function o(a) { a = a + n; e = l[a] = l[a] || g(e, b[e.parent.key + n] || e.parent) } } } function u(a, d, c, b) { if (!a) return l.pop(); l.push({ _: a, tmpl: d, item: this, data: c, options: b }) } function w(d, c, b) { return a.tmpl(a.template(d), c, b, this) } function x(b, d) { var c = b.options || {}; c.wrapped = d; return a.tmpl(a.template(b.tmpl), b.data, c, b.item) } function v(d, c) { var b = this._wrap; return a.map(a(a.isArray(b) ? b.join("") : b).filter(d || "*"), function (a) { return c ? a.innerText || a.textContent : a.outerHTML || s(a) }) } function t() { var b = this.nodes; a.tmpl(null, null, null, this).insertBefore(b[0]); a(b).remove() } })(jQuery || $sc)
﻿if (typeof(window.$sc) == "undefined") window.$sc = jQuery.noConflict(true);﻿if (typeof(window.$sc) != "undefined") {
  $sc.Event.prototype.stop = function() {    
    this.stopPropagation();
    this.preventDefault();
  };

  $sc.Event.prototype.isLeftButton = function() {
    var button = this.originalEvent.button;
    if (typeof(button) != "undefined") {
      return $sc.browser.msie ? button === 1 : button === 0;
    }
    else {
      return this.originalEvent.which === 1;
    }
  };

  $sc.event.special.elementresize = {
    setup:function() {
      // There's no native 'elementresize' event. Don't allow jQuery to attach it.
      return true;
    },

    add: function(handleObj) {
      if (this && this.attachEvent && handleObj.handler) {      
        this.attachEvent("onresize", handleObj.handler);                         
      }
    },

    remove: function(handleObj) {
      if (this && this.detachEvent && handleObj.handler) {       
        this.detachEvent("onresize", handleObj.handler);        
      }
    }
  };

  $sc.fn.update = function(html) {
    this.get(0).innerHTML = html;
    return this;
  };

  $sc.fn.outerHtml = function(value) {
    if(value) {
      $sc(value).insertBefore(this);
      $sc(this).remove();
    }
    else { 
      // IE has problems with cloning <SCRIPT> nodes. 
      if ($sc.browser.msie) {
        var html = "";
        this.each(function() { html += this.outerHTML; });
        return html;
      }

      return $sc("<div>").append($sc(this).clone()).html(); 
    }
  };

  $sc.extend({
    util: function() {
      return Sitecore.PageModes.Utility;
    },
       
    areEqualStrings: function (string1, string2, ignoreCase) {
      if ($sc.type(string1) !== "string") {
        throw "First parameter must be of a String type";
      }
      
      if ($sc.type(string2) !== "string") {
        throw "Second parameter must be of a String type";
      }
              
      if (ignoreCase) {
        return string1.toLowerCase() === string2.toLowerCase();                    
      }
      
      return string1 === string2; 
    },

    evalJSON: function(json) {
      return eval("("+json+")");
    },
      
    exists: function(_array, callback) {
      var length = _array.length;
      for (var i = 0; i < length; i++) {
        if (callback.call(_array[i], i)) {
          return true;
        }
      }

      return false;
    },

    findIndex: function(_array, callback) {
      var length = _array.length;
      for (var i = 0; i < length; i++) {
        if (callback.call(_array[i], i)) {
          return i;
        }
      }

      return -1;
    },

    first: function(_array, callback) {
      var length = _array.length;
      for (var i = 0; i < length; i++) {
        if (callback.call(_array[i], i)) {
          return _array[i];
        }
      }

      return null;
    },

    formatString: function(str) {
      if (!str) {
        return str;
      }

      for (var i = 1; i < arguments.length; i++) {
        str = str.replace(new RegExp('\\{' + (i - 1) + '\\}', 'gi'), arguments[i]);
      }

      return str;
    },

    last: function(_array, callback) {
      var length = _array.length;
      for (var i = length - 1; i >= 0; i--) {
        if (callback.call(_array[i], i)) {
          return _array[i];
        }
      }

      return null;
    },

    isHtml: function(content) {
      return this.removeTags(content) !== content;
    },

    parseQuery:function(query) {
      var result = {};
      query.replace(/([^?=&]+)(=([^&]*))?/g,
	      function($0, $1, $2, $3) { 
          result[$1] = $3;        
        }
	    );

      return result;
    },

    removeTags:function(html) {
      return html.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, "");
    },

    toShortId:function(id) {
      if (!id) {
        return id;
      }

      return id.replace(/-|{|}/g ,"");
    },

    toId: function(shortId) {
      if (!shortId || shortId.length != 32) return shortId;
      return "{" +shortId.substr(0, 8) + "-" + shortId.substr(8, 4) + "-" + shortId.substr(12, 4) + "-" + shortId.substr(16, 4) + "-" + shortId.substr(20, 12) + "}";
    },

    truncate: function(string, length) {
      if (string.length > length) {
        return string.substr(0, length) + "...";
      }

      return string;
    }
  });
}﻿/* json2.js
 * 2008-01-17
 * Public Domain
 * No warranty expressed or implied. Use at your own risk.
 * See http://www.JSON.org/js.html
*/
if(!this.JSON){JSON=function(){function f(n){return n<10?'0'+n:n;}
Date.prototype.toJSON=function(){return this.getUTCFullYear()+'-'+
f(this.getUTCMonth()+1)+'-'+
f(this.getUTCDate())+'T'+
f(this.getUTCHours())+':'+
f(this.getUTCMinutes())+':'+
f(this.getUTCSeconds())+'Z';};var m={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'};function stringify(value,whitelist){var a,i,k,l,r=/["\\\x00-\x1f\x7f-\x9f]/g,v;switch(typeof value){case'string':return r.test(value)?'"'+value.replace(r,function(a){var c=m[a];if(c){return c;}
c=a.charCodeAt();return'\\u00'+Math.floor(c/16).toString(16)+
(c%16).toString(16);})+'"':'"'+value+'"';case'number':return isFinite(value)?String(value):'null';case'boolean':case'null':return String(value);case'object':if(!value){return'null';}
if(typeof value.toJSON==='function'){return stringify(value.toJSON());}
a=[];if(typeof value.length==='number'&&!(value.propertyIsEnumerable('length'))){l=value.length;for(i=0;i<l;i+=1){a.push(stringify(value[i],whitelist)||'null');}
return'['+a.join(',')+']';}
if(whitelist){l=whitelist.length;for(i=0;i<l;i+=1){k=whitelist[i];if(typeof k==='string'){v=stringify(value[k],whitelist);if(v){a.push(stringify(k)+':'+v);}}}}else{for(k in value){if(typeof k==='string'){v=stringify(value[k],whitelist);if(v){a.push(stringify(k)+':'+v);}}}}
return'{'+a.join(',')+'}';}}
return{stringify:stringify,parse:function(text,filter){var j;function walk(k,v){var i,n;if(v&&typeof v==='object'){for(i in v){if(Object.prototype.hasOwnProperty.apply(v,[i])){n=walk(i,v[i]);if(n!==undefined){v[i]=n;}}}}
return filter(k,v);}
if(/^[\],:{}\s]*$/.test(text.replace(/\\./g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))){j=eval('('+text+')');return typeof filter==='function'?walk('',j):j;}
throw new SyntaxError('parseJSON');}};}();}/*
	Base.js, version 1.1a
	Copyright 2006-2010, Dean Edwards
	License: http://www.opensource.org/licenses/mit-license.php
*/

var Base = function() {
	// dummy
};

Base.extend = function(_instance, _static) { // subclass
	var extend = Base.prototype.extend;
	
	// build the prototype
	Base._prototyping = true;
	var proto = new this;
	extend.call(proto, _instance);
  proto.base = function() {
    // call this method from any other method to invoke that method's ancestor
  };
	delete Base._prototyping;
	
	// create the wrapper for the constructor function
	//var constructor = proto.constructor.valueOf(); //-dean
	var constructor = proto.constructor;
	var klass = proto.constructor = function() {
		if (!Base._prototyping) {
			if (this._constructing || this.constructor == klass) { // instantiation
				this._constructing = true;
				constructor.apply(this, arguments);
				delete this._constructing;
			} else if (arguments[0] != null) { // casting
				return (arguments[0].extend || extend).call(arguments[0], proto);
			}
		}
	};
	
	// build the class interface
	klass.ancestor = this;
	klass.extend = this.extend;
	klass.forEach = this.forEach;
	klass.implement = this.implement;
	klass.prototype = proto;
	klass.toString = this.toString;
	klass.valueOf = function(type) {
		//return (type == "object") ? klass : constructor; //-dean
		return (type == "object") ? klass : constructor.valueOf();
	};
	extend.call(klass, _static);
	// class initialisation
	if (typeof klass.init == "function") klass.init();
	return klass;
};

Base.prototype = {	
	extend: function(source, value) {
		if (arguments.length > 1) { // extending with a name/value pair
			var ancestor = this[source];
			if (ancestor && (typeof value == "function") && // overriding a method?
				// the valueOf() comparison is to avoid circular references
				(!ancestor.valueOf || ancestor.valueOf() != value.valueOf()) &&
				/\bbase\b/.test(value)) {
				// get the underlying method
				var method = value.valueOf();
				// override
				value = function() {
					var previous = this.base || Base.prototype.base;
					this.base = ancestor;
					var returnValue = method.apply(this, arguments);
					this.base = previous;
					return returnValue;
				};
				// point to the underlying method
				value.valueOf = function(type) {
					return (type == "object") ? value : method;
				};
				value.toString = Base.toString;
			}
			this[source] = value;
		} else if (source) { // extending with an object literal
			var extend = Base.prototype.extend;
			// if this object has a customised extend method then use it
			if (!Base._prototyping && typeof this != "function") {
				extend = this.extend || extend;
			}
			var proto = {toSource: null};
			// do the "toString" and other methods manually
			var hidden = ["constructor", "toString", "valueOf"];
			// if we are prototyping then include the constructor
			var i = Base._prototyping ? 0 : 1;
			while (key = hidden[i++]) {
				if (source[key] != proto[key]) {
					extend.call(this, key, source[key]);

				}
			}
			// copy each of the source object's properties to this object
			for (var key in source) {
				if (!proto[key]) extend.call(this, key, source[key]);
			}
		}
		return this;
	}
};

// initialise
Base = Base.extend({
	constructor: function() {
		this.extend(arguments[0]);
	}
}, {
	ancestor: Object,
	version: "1.1",
	
	forEach: function(object, block, context) {
		for (var key in object) {
			if (this.prototype[key] === undefined) {
				block.call(context, object[key], key, object);
			}
		}
	},
		
	implement: function() {
		for (var i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] == "function") {
				// if it's a function, call it
				arguments[i](this.prototype);
			} else {
				// add the interface using the extend method
				this.prototype.extend(arguments[i]);
			}
		}
		return this;
	},
	
	toString: function() {
		return String(this.valueOf());
	}
});
﻿function WordOCX_Initialize(wordObject) {

  // Disabling "Save" button
  wordObject.EnableFileCommand(3) = false; // "Save"
  wordObject.EnableFileCommand(4) = false; // "Save As"
}

function WordOCX_InsertLink(word, link, defaultText) {
  word.Activate();
  var doc = word.ActiveDocument;
  var range = doc.Application.Selection.Range;
  if (!range.Text){
    range.Text = defaultText;
  }
  else{
    var selectedHyperlinks = range.Hyperlinks;
    if (selectedHyperlinks) {
      while(selectedHyperlinks.Count > 0){
        selectedHyperlinks.Item(1).Delete();
      }
    }
  }
  doc.Hyperlinks.Add(range, link, '');
}

function WordOCX_InsertPicture(word, imagePath, alt) {
  var image;
  try {
    word.Activate();
    image = word.ActiveDocument.Application.Selection.InlineShapes.AddPicture(imagePath); //, false /* LinkToFile */, true /*SaveWithDocument*/);
  }
  catch(err) {
    if(err.description.indexOf('This is not a valid file name') > 0) {
       alert('Failed to insert media. \n. Possible reason: Item has not been published.');
    }
    throw err;
  }
  if(alt != null && alt != '') {
    image.AlternativeText = alt;
  }
  return image;
}

function WordOCX_UploadDocument(word, uploadLink, restoreDocument) {
  word.Activate();
  var tempFilePath1 = word.GetTempFilePath();    
  var tempFilePath2 = word.GetTempFilePath();    
  word.ActiveDocument.WebOptions.AllowPNG = true;
  
  word.ActiveDocument.SaveAs(tempFilePath1, 16 /* wdFormatDocumentDefault */, false, '', false, '', false, false, false, false, false);
  word.ActiveDocument.SaveAs(tempFilePath2, 10 /* wdFormatFilteredHTML */, false, '', false, '', false, false, false, false, false);      
  WordOCX_RestoreViewType(word);
  word.Close(); // We cannot upload an opened document
  
  word.HttpInit();
  word.HttpAddPostFile(tempFilePath1, "file.docx");
  word.HttpAddPostFile(tempFilePath2, "file.mhtml"); // we use 'mhtml' extension, since posting with 'html' extension did not work
  word.HttpAddPostRelatedFiles(tempFilePath2); // Adding image files to post data
  
  word.HttpPost(uploadLink);
}

function WordOCX_ToggleToolbar(word){
  word.Activate();
  word.Toolbars = !word.Toolbars;
}

 function WordOCX_RestoreViewType(word){
    if(!word.currentView){
      return;
    }
    if (!word.IsOpened) {
        wordObject.CreateNew("Word.Document");
    }
    word.ActiveDocument.ActiveWindow.View.Type = word.currentView;
  }
﻿if (typeof(Sitecore) == "undefined") Sitecore = {};
if (typeof(Sitecore.PageModes) == "undefined") Sitecore.PageModes = new Object();

Sitecore.PageModes.Utility = new function() {
  this.isIE =  $sc.browser.msie;

  this.elements = function(object) {
    if (object instanceof $sc) {
      return object;
    }

    if (object.elementsAndMarkers) {
      return object.elementsAndMarkers();
    }

    throw "Unexpected object, can accept only jQuery objects or chromes";
  };
       
  //Defines if browser is IE in non-standards mode (standards mode:IE 8 standards mode and higher)
  this.isNoStandardsIE = function() {
    return this.isIE && (!document.documentMode || document.documentMode < 8);
  };
  
  this.addStyleSheet = function(cssRule) {
    var el= document.createElement("style");
    el.type= "text/css";        
    if(el.styleSheet) { 
      el.styleSheet.cssText= cssRule;
    }
    else { 
      el.appendChild(document.createTextNode(cssRule));
    }

    return document.getElementsByTagName("head")[0].appendChild(el);
  };

  this.areEqualPlaceholders = function(lhsPlaceholderKey, rhsPlaceholderKey) {
    var ignoreCase = true;
    if (lhsPlaceholderKey == null || rhsPlaceholderKey == null) {
      return lhsPlaceholderKey == rhsPlaceholderKey;
    }

    var lhsSlashIndex = lhsPlaceholderKey.lastIndexOf('/');
    var rhsSlashIndex = rhsPlaceholderKey.lastIndexOf('/');
    if (lhsSlashIndex >= 0 && rhsSlashIndex >=0)
    {
      return $sc.areEqualStrings(lhsPlaceholderKey, rhsPlaceholderKey, ignoreCase);
    }

    var lhsShortKey = (lhsSlashIndex >= 0) ? lhsPlaceholderKey.substr(lhsSlashIndex + 1) : lhsPlaceholderKey;
    var rhsShortKey = (rhsSlashIndex >= 0) ? rhsPlaceholderKey.substr(rhsSlashIndex + 1) : rhsPlaceholderKey;
    return $sc.areEqualStrings(lhsShortKey, rhsShortKey, ignoreCase);
  };

  this.copyAttributes = function(source, target) {
    var i;
    if (!target || !target.attributes) {
      return;
    }
          
    for (i = 0; i < target.attributes.length; i++) {        
      if (target.attributes.item(i).specified) {
        target.attributes.removeNamedItem(target.attributes.item(i).name);
      }
    }

    if (!source || !source.attributes) {
      return;
    }
               
    var length = source.attributes.length;
    for (i = 0; i < length; i++) {
      if (source.attributes.item(i).specified && source.attributes.item(i).value ) {
        var attrName = source.attributes.item(i).name;
        var attrValue = source.attributes.item(i).value;
        // OT issue #341614              
        if (attrName.toLowerCase() === "class") {
          target.className = attrValue;
          continue;  
        }
             
        target[attrName] = attrValue;       
      }
    }              
  };

  this.getCookie = function(name) {
    name = name + "=";
    var i = 0;
    while(i < document.cookie.length) {
      var j = i + name.length;
      if(document.cookie.substring(i, j) == name) {
        var n = document.cookie.indexOf(";", j);
        if(n == -1) {
          n = document.cookie.length;
        }

        return unescape(document.cookie.substring(j, n));
      }

      i = document.cookie.indexOf(" ", i) + 1;
      if(i == 0) {
        break;
      }
    }

    return null;
  };

  this.getObjectAlternateHtml = function(element) {
    if (!element) {
      return;
    }
    
    var childObject, wrapper = $sc("<div></div>");
    var $element = element.jquery ? element : $sc(element);
    if ($element.is("embed")) {
      var noembed = $element.children("noembed")[0] || $element.next("noembed")[0];
      if (!noembed) {
        return;
      }
             
      return this.unescapeHtml(noembed.innerHTML);     
    }

    if (!$element.is("object")) {
      return;
    }
        
    if (this.isIE && document.documentMode && document.documentMode < 9) {
      wrapper.html($element[0].altHtml);
      childObject = wrapper.children("object")[0];
      if (childObject) {
        return this.getObjectAlternateHtml(childObject);      
      }

      return wrapper.html();      
    }
       
    childObject = $element.children("object")[0];
    if (childObject) {
      return this.getObjectAlternateHtml(childObject);      
    }

    $element.contents().not("param, embed, noembed").clone().appendTo(wrapper);    
    return wrapper.html();
  };

  this.log = function(message) {
    if (!Sitecore.PageModes.PageEditor.debug()) {
      return;
    }

    console.log(message);
  };

  this.parseCommandClick = function(commandClick) {
    var msg = commandClick;
    var commandParams = null;
    var idx1 = commandClick.indexOf("(");
    var idx2 = commandClick.indexOf(")");
    if (idx1 >= 0 && idx2 > idx1) {
      msg = commandClick.substring(0, idx1);
      try {
        commandParams = $sc.evalJSON(commandClick.substring(idx1 + 1, idx2));
      }
      catch (e) {
        console.log("Cannot parse command parameters");
      }
    }

    return { message: msg, params : commandParams};
  };

  this.parsePalleteResponse = function(response) {
    if (!response) {
      return null;
    }

    var tmp = document.createElement("div");
    tmp.innerHTML = response;
    var form = $sc(tmp).find("#scPaletteForm");
    if (form.length < 1) {
      delete tmp;
      return null;
    }
    
    var scripts = [];
    form.find("script").each(function() {
      if (this.src) {
        scripts.push(this.src);
      }
      
      $sc(this).filter("[type!='text/sitecore']").remove();      
    });

    var styleSheets = [];
    form.find("link[rel='stylesheet']").each(function() {
      if (this.href) {
        styleSheets.push(this.href);
      }
      
      $sc(this).remove();
    });
       
    var layout = form.find("#scLayoutDefinitionHolder");
    if (layout.length < 1) {
      delete tmp;
      return null;
    }

    var result = {};
    result.scripts = scripts;
    result.styleSheets = styleSheets;
    result.layout = layout.text();
    
    var url = form.find("#scUrlHolder");
    if (url.length > 0) {
      result.url = url.text();
      delete tmp;
      return result;
    }

    var htmlHolder = form.find("#scHTMLHolder");
    if (htmlHolder.length < 1)
    {
      delete tmp;
      return null;
    }

    result.html = htmlHolder.get(0).innerHTML;   

    delete tmp;
    return result;
  };

  this.renderTemplate = function(templateName, template, data, options) {
    if (!$sc.template[templateName]) {
      $sc.template(templateName, template);
    }

    return $sc.tmpl(templateName, data, options);
  };

  this.removeCookie = function(name, path, domain, secure) {
    if (this.getCookie(name)) {
      var expires = new Date();
      expires.setMonth(expires.getMonth() - 1);
      this.setCookie(name, "", expires, path, domain, secure); 
    }
  }; 

  this.setCookie = function(name, value, expires, path, domain, secure) {
    if (expires == null) {
      expires = new Date();
      expires.setMonth(expires.getMonth() + 3);
    }
    
    if (path == null) {
      path = "/";
    }

    document.cookie = name + "=" + escape(value) +
      (expires ? "; expires=" + expires.toGMTString() : "") +
      (path ? "; path=" + path : "") +
      (domain ? "; domain=" + domain : "") +
      (secure ? "; secure" : "");
  };
  
  this.tryAddScripts = function(scriptUrls) {
    if (!scriptUrls) {
      return;
    }

    if (!scriptUrls.length || scriptUrls.length < 1) {
      return;
    }

    var pageScripts = $sc("script");    
    for (var i = 0; i < scriptUrls.length; i++) {
      var url = scriptUrls[i];
      if (!$sc.exists(pageScripts, function () { return this.src == url; })) {
        try {
          var script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = url;
          var head = document.getElementsByTagName("head")[0];
          if (!head) {
            head = document.createElement("head");
            document.appendChild(head);
          }

          head.appendChild(script);
        }
        catch(ex) {
          console.log("Failed to add script " + url);
        }
      }            
    }
  };

  this.tryAddStyleSheets = function(hrefs) {
    if (!hrefs) {
      return;
    }

    if (!hrefs.length || hrefs.length < 1) {
      return;
    }

    var styleSheets = $sc("link[rel='stylesheet']");    
    for (var i = 0; i < hrefs.length; i++) {
      var url = hrefs[i];
      if (!$sc.exists(styleSheets, function () { return this.href == url; })) {
        try {
          if (document.createStyleSheet) {
            document.createStyleSheet(url);
          }
          else {
            var newSS = document.createElement('link');
            newSS.rel = 'stylesheet';
            newSS.href = url;
            document.getElementsByTagName("head")[0].appendChild(newSS);
          }
        }
        catch(ex) {
          console.log("Failed to add styleshhet " + url);
        }
      }            
    }
  }; 

  this.unescapeHtml = function(html) {
    if (!html) {
      return html;
    }

    return html.replace(/&lt;/gi, "<").replace(/&gt;/gi, ">");
};
};
﻿Sitecore.Event = Base.extend({
  constructor: function() {
    this._callbacks = new Array();
  },
  
  fire: function(args) {
    var length = this._callbacks.length;
    for (var i = 0; i < length; i++) {
      this._callbacks[i](args);
    }    
  },
  
  observe: function(callback) {
    if ($sc.inArray(callback, this._callbacks) > -1) {
      return;
    }
    
    this._callbacks.push(callback);
  },
  
  stopObserving: function(callback) {    
    this._callbacks = $sc.grep(this._callbacks, function(func) { return func !== callback; });    
  }
});﻿if (typeof(Sitecore.PageModes) == "undefined") {
  Sitecore.PageModes = new Object();
}

/**
* @class Reperesents a cache
*/
Sitecore.PageModes.Cache = Base.extend({
  _cacheInstance: {},
  
  /**
  * @description Adds the specified value under the specified key
  * @param {String} key The key
  * @param {} value The value
  */
  setValue: function(key, value) {
    this._cacheInstance[key] = value;
  },

  /**
  * @description Gets the value from the cache
  * @param {String} key The key
  * @returns The value or 'undefined' if the value under the specified key is not in the cache
  */
  getValue: function(key) {
    return this._cacheInstance[key];
  },

  /**
  * @description Removes the value from the cache
  * @param {String} key The key  
  */
  clear: function(key) {
    delete this._cacheInstance[key];
  },

  /**
  * @description Removes all instances from the cache
  */
  clearAll: function() {
    this._cacheInstance = {};
  }
});﻿if (typeof(Sitecore.PageModes) == "undefined") Sitecore.PageModes = new Object();
if (typeof(Sitecore.PageModes.ChromeTypes) == "undefined") Sitecore.PageModes.ChromeTypes = new Object();

Sitecore.PageModes.ChromeTypes.ChromeType = Base.extend({
  constructor: function() {
    this._isReadOnly = false;
  },

  controlId: function() {
    return this.chrome.element.attr("id");
  },
  
  dataNode: function(domElement) {
    if (!domElement) {
      console.warn("no dom element");
    }

    if (domElement.is("code[type='text/sitecore']")) {
      return domElement;
    }

    return domElement.children(".scChromeData");
  },

  elements: function(domElement) {
    return { opening: null, content: domElement, closing: null};
  },
   
  // Return values:
  // * null - the ribbon context item shouldn't be changed
  // * "" - the ribbon context item should be changed to the one of the whole page
  // * non-empty string - the context item should be changed to the one specified by the string uri 
  getContextItemUri: function () {
    var uri = this.chrome.data.contextItemUri;
    return uri == null ? "" : uri;
  },
      
  handleMessage: function(message, params, sender) {
  },

  delegateMessageHandling: function(sender, recipient, message, params)
  {
    if (recipient) {
      recipient.handleMessage(message, params, sender);
    }
    else {
      console.error("delegated message handler not found");
    }
  },
    
  icon: function() {
    return '/sitecore/shell/~/icon/ApplicationsV2/16x16/bullet_square_glass_blue.png.aspx';
  },

  isEnabled: function() {
    return this.chrome && this.chrome.hasDataNode;
  },

  isReadOnly: function() {
    return this._isReadOnly;
  },

  setReadOnly: function() {
    this._isReadOnly = true;
  },

  key: function() {
    return "override chrometype type key";
  },
    
  layoutRoot: function() {        
    return this.chrome.element;
  },

  onShow: function() {
  },

  onHide: function() {
  },
  
  onDelete: function(preserveData) {
    var childChromes = this.chrome.getChildChromes(function() { return this != null;});
    $sc.each(childChromes, function() { this.onDelete(preserveData); });
  },
  
  _getElementsBetweenScriptTags: function(openingScriptNode) {
    var result = new Array();

    var currentNode = openingScriptNode.next();
    
    while(currentNode && !currentNode.is("code[type='text/sitecore'][kind='close'][chromeType='" + this.key() + "']")) {      
      //field value inputs (with scFieldValue class) are moved from their original dom poisition into special "scFieldValue" container.
      //Considering them as part of chrome will cause problems with chrome hierarchies. 
      if (!currentNode.is("code[type='text/sitecore']") && !currentNode.hasClass("scFieldValue")) {
        result.push(currentNode.get(0));
      }

      currentNode = currentNode.next();

      if (currentNode.length == 0) {
        console.error("Malformed page editor <script></script> tags - closing tag not found. Opening tag:");
        console.log(openingScriptNode);
        throw "Failed to parse page editor element demarked by script tags";
      }
    }

    return { opening: openingScriptNode, content:$sc(result), closing: currentNode };
  }
});
﻿if (typeof(Sitecore.PageModes) == "undefined") {
  Sitecore.PageModes = new Object();
}

/**
* @class represents single notification message
*/
Sitecore.PageModes.Notification = Base.extend({
   /**
  * @constructor Creates an instance of a class 
  */
  constructor: function(id, text, options) {
    if (!options) {
      options = {};
    }

    this.id = id.toLowerCase();
    this.text = text;
    this.actionText = options.actionText;
    this.onActionClick = options.onActionClick || $sc.noop();
    this.type = options.type || "warning";
    switch(this.type) {
      case "warning":
        this.notificationTypeCssClass = "scWarning";
        break;
      case "error":
        this.notificationTypeCssClass = "scError";
        break;
      case "info":
        this.notificationTypeCssClass = "scInfo";
        break;
      default:
        this.notificationTypeCssClass = "scWarning";
    }
  }
},
{
  template: [      
      " <div data-notification-id='${id}' class='scNotification  ${notificationTypeCssClass}'>",
      "    <img class='scClose' src='/sitecore/shell/Themes/Standard/Images/Progress/globalsearch_close.png'/>",
      "    <span class='scDescription'>${text}</span>",
      "    {{if actionText}}",
      "    <a class='scAction' href='#'>${actionText}</a>",
      "    {{/if}}",
      " </div>",   
    ].join("\n")
}
);

/**
* @class represents the notification bar
*/
Sitecore.PageModes.NotificationBar = Base.extend({
  /**
  * @constructor Creates an instance of a class 
  */
  constructor: function() {   
    this.position = null;
    this.notifications = [];    
  },

  /**
  * @description Adds new notification unless it is not already in the list
  * @param {Notification} The notification. @see Sitecore.PageModes.Notification
  */
  addNotification: function(notification) {
    var notificationId = notification.id;
    if ($sc.exists(this.notifications, function() { return this.id == notificationId; })) {
      return;
    }

    this.notifications.push(notification);
  },

  /**
  * @description Gets the notification message by id
  * @param {String} id The notification id.
  * @return {Notification} The notification. @see Sitecore.PageModes.Notification
  */
  getNotification:  function(id) {
    return $sc.first(this.notifications, function() { return this.id == id});
  },

  /**
  * @description Removes the specified notification from the list
  * @param {String} id The notification id.
  * @return {Notification} The notification. @see Sitecore.PageModes.Notification
  */
  removeNotification: function(id) {
    var idx = $sc.findIndex(this.notifications, function() { return this.id == id; });
    if (idx < 0) {
      return;
    }

    this.notifications.splice(idx, 1);
  },

  /**
  * @description Create DOM nodes
  */
  create: function() {    
    this.bar = $sc("<div></div>").addClass("scNotificationBar").hide().appendTo(document.body);
    this.bar.click($sc.proxy(this.clickHandler, this));
  },

   /**
  * @description Handles click on notification bar
  * @param {Event} e The event.
  */
  clickHandler: function(e) {
    var sender = $sc(e.target), notification, n;
    if (sender.hasClass("scClose")) {
      notification = sender.closest(".scNotification");
      if (!notification.length) {
        return;
      }

      notification.hide();
      this.removeNotification(notification.attr("data-notification-id").toLowerCase());
      return;
    }

    if (sender.hasClass("scAction")) {
      notification = sender.closest(".scNotification");
      if (!notification.length) {
        return;
      }

      notification = this.getNotification(notification.attr("data-notification-id").toLowerCase());
      if (notification && notification.onActionClick) {
        notification.onActionClick();
      }
    }
  },

  /**
  * @description Defines if position is specifed for the bar
  * @returns {Boolean} Value indication if position is specified
  */
  hasPosition: function() {
    return this.position != null;
  },

  /**
  * @description Hides the bar 
  */
  hide: function() {
    if (this.bar) {
      this.bar.hide();
    }
  },

  /**
  * @description Renders the notification
  */
  render:function() {
    if (!this.bar) {
      this.create();
    }
   
    var template = Sitecore.PageModes.Notification.template;
    this.bar.html("").append($sc.util().renderTemplate("sc-notificationBar", template, this.notifications));
  },

  /**
  * @description Resets the bar 
  */
  resetPosition: function() {
    this.position = null;
  },

  /**
  * @description Sets the position 
  */
  setPosition: function(pos) {
    this.position = pos;
  },

  /**
  * @description Shows the bar 
  */
  show: function() {  
    this.render();
    if (this.hasPosition()) {    
      this.bar.css({top: this.position.top + "px", left: this.position.left + "px"});          
    }
        
    this.bar.show();
  },

  /**
  * @description Defines if bar is visisble
  * @retruns {Boolean} Value indicating if bar is visible 
  */
  visible: function() {
    return this.bar && this.bar.is(":visible");
  }
});
﻿if (typeof(Sitecore.PageModes) == "undefined") {
  Sitecore.PageModes = new Object();
}

// Manages element's positioning inside an available viewport.
Sitecore.PageModes.PositioningManager = function() {
  this.instance = null;

  var getInstance = function() {
    if (!this.instance) {
      this.instance = createInstance();
    }
    return this.instance;
  };
    
  var createInstance = function() {    
    return {

      //Sets  available region inside which elements can be positioned 
      calculateViewportRegion: function() {
        if (!this.$document) {
          this.$document = $sc(document);          
        }

        if (!this.window){
          this.$window = $sc(window);
        }
         
        var dimensions = {width: this.$window.width(), height: this.$window.height()};
        var offset = {top: this.$document.scrollTop(), left: this.$document.scrollLeft()};               
        var ribbon = $sc("#scWebEditRibbon");
        var ribbonHeight = ribbon.hasClass("scFixedRibbon") ? ribbon.outerHeight() : 0;       
        this.viewportRegion = {left: offset.left, right: offset.left + dimensions.width, top: offset.top + ribbonHeight, bottom: offset.top + dimensions.height};
      },
      
      // Returns values indicating in what dimensions element overflows the viewport.
      getElementOverflow: function(top, left, element) {       
        this.calculateViewportRegion();       
        return this._getOverflow(top, left, element.outerWidth(), element.outerHeight());        
      },

      // Returns element's top and left values, that will make element appear inside the viewport
      getFixedElementPosition: function(top, left, element) {        
        var overflow = this.getElementOverflow(top, left, element);
        return { top: top + overflow.deltaY, left: left + overflow.deltaX };
      },

      // Returns element's top and left values, that will make element appear inside the viewport and docked to chrome's border if possible
      getFixedChromeRelativeElementPosition: function(dimensions, chrome) {        
        var bottomMargin = 2;
        var topMargin = -1;
        this.calculateViewportRegion();               
        var chromeOffset = chrome.position.offset();
        var chromeDimensions = chrome.position.dimensions();
        var top = chromeOffset.top - dimensions.height;
        var left = chromeOffset.left + 2;
        if (chrome.type.key() == "word field") {
          if ( this._getOverflow(chromeOffset.top, chromeOffset.left, chromeDimensions.width, chromeDimensions.height).isOutOfViewport) {
            return {top: chromeOffset.top + chromeDimensions.height + bottomMargin, left: -1000};
          }

          return {top: chromeOffset.top + chromeDimensions.height + bottomMargin, left: left};
        }
                
        if (chrome.type.key() == "field" && chrome.type.contentEditable()) {
          left--;
        }

        var overflow = this._getOverflow(top, left, dimensions.width, dimensions.height);
        if (!overflow.hasOverflow) {
          return {top: top, left: left};
        }
        
        var chromeOverflow = this._getOverflow(chromeOffset.top, chromeOffset.left, chromeDimensions.width, chromeDimensions.height);
        if (chromeOverflow.isOutOfViewport) {
          return {top: top, left: -1000};
        }

        var fixedLeft = left;
        var fixedTop = top;                
        //right overflow - dock element to the chrome's right border 
        if (overflow.deltaX < 0) {                                        
          fixedLeft = chromeOffset.left + chromeDimensions.width - dimensions.width;           
        }
        //left overflow - dock element to the chrome's left border
        if (overflow.deltaX > 0) {
          fixedLeft = chromeOffset.left;          
        }
        //top overflow - dock element to the chrome's bottom border
        if (overflow.deltaY > 0) {                    
          fixedTop = chromeOffset.top + chromeDimensions.height + bottomMargin;
        }
        //bottom overflow - dock element to the chrome's top border
        if (overflow.deltaY < 0) {          
          fixedTop = chromeOffset.top - dimensions.height + topMargin;
        }
        
        var fixedOverflow = this._getOverflow(fixedTop, fixedLeft, dimensions.width, dimensions.height);
        //Docking to one of the chrome's borders failed - just position element inside a viewport.
        if (fixedOverflow.hasOverflow) {
          var returnValue = new Object();
          returnValue.left = ( fixedOverflow.deltaX == 0 ) ? fixedLeft : left + overflow.deltaX;
          returnValue.top = ( fixedOverflow.deltaY == 0) ? fixedTop : top + overflow.deltaY;
          return returnValue;
        }

        return { top: fixedTop, left: fixedLeft };
      },
      
      scrollIntoView: function(chrome) {
        this.calculateViewportRegion();               
        var chromeOffset = chrome.position.offset();
        var chromeDimensions = chrome.position.dimensions();
        var overflow = this._getOverflow(chromeOffset.top, chromeOffset.left, chromeDimensions.width, chromeDimensions.height);
        if (!overflow.hasOverflow) {
          return;
        }

        var currentScrollTop = this.$document.scrollTop();
        var currentScrollLeft = this.$document.scrollLeft();
        this.$window.scrollTop(currentScrollTop - overflow.deltaY).scrollLeft(currentScrollLeft - overflow.deltaX);
      },
      
      _getOverflow: function(top, left, width, height) {
        var dX = 0;
        var isOutOfViewport = false;        
        if (left < this.viewportRegion.left) {
          dX = this.viewportRegion.left - left;
          if (left + width < this.viewportRegion.left) {
            isOutOfViewport = true;
          }
        }
        //It's OK if we return the only overflow when element has both right and left one (Element is wider than viewport hence we can't position it correctly anyway)
        if (left + width > this.viewportRegion.right) {
          dX = this.viewportRegion.right - (left + width);
          if (left > this.viewportRegion.right) {
            isOutOfViewport = true;
          }
        }

        var dY = 0;
        if (top < this.viewportRegion.top) {
          dY = this.viewportRegion.top - top;
          if (top + height < this.viewportRegion.top) {
            isOutOfViewport = true;
          }
        }
        
        if (top + height > this.viewportRegion.bottom) {
          dY = this.viewportRegion.bottom - (top + height);
          if (top > this.viewportRegion.bottom) {
            isOutOfViewport = true;
          }
        }

        return {
                  hasOverflow: dX != 0 || dY != 0, 
                  deltaX: dX, 
                  deltaY: dY, 
                  isOutOfViewport: isOutOfViewport                  
               };
      }     
    };
  };
 
  return getInstance();
};﻿if (typeof(Sitecore.PageModes) == "undefined") {
  Sitecore.PageModes = new Object();
}

/**
* The enumeration for availablle page editor's capabilities.
* @enum {String}
*/
Sitecore.PageModes.Capabilities = {
  design: "design",
  edit: "edit",
  personalization: "personalization",
  testing: "testing"
};


/**
* @static
* @class represents Page Editor
*/
Sitecore.PageModes.PageEditor = new function() {
  /** @private */
  this._capabilities = [];  
  this.onSave = new Sitecore.Event();
  this.onWindowScroll = new Sitecore.Event();
  this.onCapabilityChanged = new Sitecore.Event();
  this.onControlBarStateChanged = new Sitecore.Event();
  this.notificationBar = new Sitecore.PageModes.NotificationBar(); 
  this.onLoadComplete = new Sitecore.Event();
    
  /**
  * @description enables/disables Page Editor's capability. @see Sitecore.PageModes.Capabilities
  * @param {String} capability The name of the capability
  * @param {Boolean} enabled Determines if capability should be enabled or disabled
  */
  this.changeCapability = function(capability, enabled) {
    if (!this.editing()) {
        return;
    }
        
    if (!enabled) {         
      var idx = $sc.inArray(capability, this._capabilities);
      if (idx > -1) {
        this._capabilities.splice(idx, 1);
      }
    }
    else {      
      this._capabilities.push(capability);
    }

    this.onCapabilityChanged.fire();
  };

  /**
  * @description enables/disables Page Editor's controls highlight.  
  * @param {Boolean} enabled Determines if highlight should be enabled or disabled
  */
  this.changeShowControls = function(enabled) {
    if (!this.editing()) {
        return;
    }

    if (!enabled) {
      Sitecore.PageModes.ChromeHighlightManager.deactivate();
    }
    else {
      Sitecore.PageModes.ChromeHighlightManager.activate();
    } 
  };

  this.changeVariations = function(combination, selectChrome) {    
    Sitecore.PageModes.ChromeManager.batchChangeVariations(combination, selectChrome);              
  };

  this.debug = function() {
    return window.location.href.indexOf("pedebug=1") >= 0 || this._debug;
  };

  this.editVariationsComplete = function(controlId, params) {
    var component = $sc.first(Sitecore.PageModes.ChromeManager.chromes(), function() { 
      return this.controlId() === controlId;
    });

    if (component) {
      Sitecore.PageModes.ChromeManager.select(component);      
      component.handleMessage("chrome:rendering:editvariationscompleted", params); 
    }
  };

  /**
  * @description Gets the currently enabled capabilities. See @Sitecore.PageModes.Capabilities
  * @returns {String[]} The names of enbled capabilities
  */
  this.getCapabilities = function() {
    return this._capabilities;
  };

  this.getTestingComponents = function() {
    var result = {};
    $sc.each(Sitecore.PageModes.ChromeManager.chromes(), function() {
      if (this.key() === "rendering") {
        var variations = this.type.getVariations();
        if (variations.length > 0) {
          var arr = [];
          $sc.each(variations, function() {
            arr.push({id: this.id, isActive: this.isActive, value: this.value});            
          });

          result[this.type.uniqueId()] = arr;
        }
      }
    });

    return result;
  };

  /**
  * @description Indicates if analytics is enabled
  * @returns {Boolean} The value indicating if analytics is enabled
  */
  this.isAnalyticsEnabled = function() {
    return !!Sitecore.WebEditSettings.anlyticsEnabled;
  };

  /**
  * @description Indicates if the ribbon is displayed in fixed position (on top of the screen), or is running in the legacy placeholder mode. 
  * @return {Boolean} The value indicating if the ribbon is fixed.
  */
  this.isFixedRibbon = function() {
    var ribbon = $sc(this.ribbon());

    return ribbon.hasClass("scFixedRibbon");
  };

  /**
  * @description Indicates if there are unsaved changes in Page Editor
  * @returns {Boolean} The value indicating if there are unsaved changes
  */
  this.isModified = function() {
    var form = this.ribbonForm();
    if (!form) {
      return !!this.modified;
    }

    return form.modified;
  };

  this.isTestRunning = function() {
    if (this._isTestRunning != null) {
      return this._isTestRunning;
    }
        
    var testRunningFlag = document.getElementById("scTestRunningFlag");
    if (!testRunningFlag) {
      this._isTestRunning = false;
      return false;
    }

    this._isTestRunning = testRunningFlag.value === "true";
    return this._isTestRunning;
  };

  /**
  * @description Indicates if Page Editor editing is allowed.
  * @returns {Boolean} The value indicating if Page Editor editing is allowed.
  */
  this.editing = function() {
    return !!Sitecore.WebEditSettings.editing;
  };
  
  this.controlBarStateChange = function() {
     Sitecore.PageModes.ChromeManager.resetSelectionFrame();
     this.onControlBarStateChanged.fire();
  };

  /**
  * @description Defines if personalization bar is visible
  * @returns {Boolean} value indicating whether personalization bar is visisble or not
  */
  this.isControlBarVisible = function() {
    var ribbon = this.ribbon();
    return ribbon && ribbon.contentWindow && ribbon.contentWindow.scControlBar;
  };

  /**
  * @description Defines if Page Editor is loaded
  * @returns {Boolean} value indicating whether Page Editor is loaded or not
  */
  this.isLoaded = function() {
    return !!this._isLoaded;
  }; 

  /**
  * @description Defines if personalization feature is accesible for the user
  * @returns {Boolean} value indicating whether personalization feature is enabled
  */
  this.isPersonalizationAccessible = function() {
     return $sc.inArray(Sitecore.PageModes.Capabilities.personalization, this._capabilities) > -1;
  };

  /**
  * @description Defines if testing feature is accesible for the user
  * @returns {Boolean} value indicating whether testing feature is enabled
  */
  this.isTestingAccessible = function() {
     return $sc.inArray(Sitecore.PageModes.Capabilities.testing, this._capabilities) > -1;
  };

  /**
  * @description Gets the id of the context item
  * @returns {String} The short id
  */
  this.itemId = function() {
    return $sc("#scItemID").val()
  };

   /**
  * @description Gets the content language
  * @returns {String} The language
  */
  this.language = function() {
    return $sc("#scLanguage").val()
  };

  /**
  * @description Gets the language CSS class
  * @returns {String} The language CSS class
  */
  this.languageCssClass = function () {
    return $sc("#scLanguageCssClass").val()
  };

  /**
  * @description Gets the client device id
  * @returns {String} The device id
  */
  this.deviceId = function() {
    return $sc("#scDeviceID").val();
  };

  /**
  * @description Gets the current layout definition
  * @returns {String} The Layout definition (in JSON notation)
  */
  this.layout = function() {
    return $sc("#scLayout").val();
  };

  /**
  * @description Action performed on saving action.  
  */
  this.onSaving = function() {    
    this.notificationBar.removeNotification("fieldchanges");
    this.notificationBar.show();
    this.onSave.fire();
  };

  /**
  * @description Makes a request to Sitecore
  * @param request Request parameters
  * @param {Function} [callback] A callback function to be called after request is complete.
  * @param {Boolean} [async=true] The value indicating if the request should be asynchronous.
  */
  this.postRequest = function(request, callback, async) {
    var form = this.ribbonForm();
    if (!form) {
      return;
    }

    isAsync = (typeof (async) == 'undefined') ? true : async;
    form.postRequest("", "", "", request, callback, isAsync);
  };

  /**
  * @description Refreshes the ribbon  
  */
  this.refreshRibbon = function() {
    this.postRequest("ribbon:update", null, true);
  };

  /**
  * @description Gets the Page Editor's ribbon instance
  * @returns {Node} The iframe containing the ribbon.
  */
  this.ribbon = function() {
    return $sc("#scWebEditRibbon")[0];
  };

  /**
  * @description Gets the ribbon's Sitecore form instance
  * @returns {scSitecore} The sitecore form. @see scSitecore.
  */
  this.ribbonForm = function() {
    var ribbon = this.ribbon();
    if (!ribbon) {
      return null;
    }
    
    if (!ribbon.contentWindow) {
      return null;
    }

    return ribbon.contentWindow.scForm;
  };
    
  /**
  * @description Saves the changes
  * @param {String} postaction The post action to be performed afer saving.
  */
  this.save = function(postaction) {    
    var command = "webedit:save";
    if (postaction) {
      command += "(postaction=" + postaction + ")";
    }
        
    this.onSaving();
    this.postRequest(command, null, false);
  };
  
  this.selectElement = function(id) {
    var element = $sc.first(Sitecore.PageModes.ChromeManager.chromes(), function() { return this.controlId() === id; });
    if (element) {           
      Sitecore.PageModes.ChromeManager.scrollChromeIntoView(element);
      Sitecore.PageModes.ChromeManager.select(element);
      return element;
    }

    return null;
  };

  this.highlightElement = function(id) {
    var element = $sc.first(Sitecore.PageModes.ChromeManager.chromes(), function() { return this.controlId() == id; });
    if (element) {
      element.showHover();
      return element;
    }

    return null;
  };

  this.stopElementHighlighting = function(id) {
    var element = $sc.first(Sitecore.PageModes.ChromeManager.chromes(), function() { return this.controlId() == id; });
    if (element) {
      element.hideHover();
      return element;
    }

    return null;
  };
  
  /**
  * @description Shows the notification bar  
  */
  this.showNotificationBar = function() {    
    if (!this.notificationBar.hasPosition()) {
      var ribbon = this.ribbon();
      if (ribbon) {
        var $ribbon = $sc(ribbon);
        var top = 0;
        if ($ribbon.hasClass("scFixedRibbon")) {
          var height = $ribbon.outerHeight();          
          top = parseInt($ribbon.css("top")) + height;
        }

        this.notificationBar.setPosition({top: top, left: 0});
      }      
    }
        
    this.notificationBar.show();
  };

  /**
  * @description Updates the specified field with specified values
  * @param {String} id - The id. (i.e "fld_ItemId_filedId_lang_ver")
  * @param {String} htmlValue - The field's rendered value
  * @param {String} plainValue - The field's raw value
  * @param {Boolean} [preserveInnerContent] - Instead of setting whole innerHtml only setting needed attributes    
  */
  this.updateField = function(id, htmlValue, plainValue, preserveInnerContent) {
    Sitecore.PageModes.ChromeManager.updateField(id, htmlValue, plainValue, preserveInnerContent);
  };
 
  /**
  * @description Sets a value indicating if Page editor has unsaved  changes or not
  * @param {Boolean} value indicating if Page Editor has unsaved changes
  */
  this.setModified = function(value) {   
    this.modified = value;
    var form = this.ribbonForm();
    if (!form) {
      return;
    }

    form.setModified(value);
  };

  /**
    @description Shows all places in a page where a new rendering can be inserted
  */
  this.showRenderingTargets = function() {
    Sitecore.PageModes.DesignManager.insertionStart();
  };
       
  /** @private */
  this._fixStyles = function() {
    if ($sc.browser.msie) {
      return;
    }

    // min-height and min-width are added to prevent browser form setting height and with of contenteditable elements to 0 when they have no content.        
    $sc.util().addStyleSheet("body .scWebEditInput { display: inline-block;}\r\n.scWebEditInput[contenteditable=\"true\"] { min-height: 1em;}");
  };
  /** @private */
  this._initCapabilities = function() {            
    var capabilities =  document.getElementById("scCapabilities");
    var enabledCapabilities = [];
    if (capabilities && capabilities.value) {
      enabledCapabilities = capabilities.value.split("|");
    }
    
    for (var n in Sitecore.PageModes.Capabilities) {        
      if ($sc.inArray(Sitecore.PageModes.Capabilities[n], enabledCapabilities) > -1) {
        this._capabilities.push(Sitecore.PageModes.Capabilities[n]);
      }
    }    
  };

   /** @private */  
  this.onDocumentClick = function(e) {        
    Sitecore.PageModes.ChromeManager.select(null);
  };
  /** @private */
  this.onDomLoaded = function() {
    if (!this.editing()) {
      return;
    }

    this._fixStyles();
    this._initCapabilities();
    Sitecore.PageModes.ChromeManager.init();
    var $doc = $sc(document);
    $doc.click($sc.proxy(this.onDocumentClick, this));
    $doc.keydown($sc.proxy(this.onKeyDown, this));
    $doc.keyup($sc.proxy(this.onKeyUp, this));
    if ($sc.browser.mozilla) {
       $doc.keypress($sc.proxy(this.onKeyPress, this));      
    }    

    $sc(".scWebEditInput[contenteditable='true']").live("mouseup", function(e) {
      if (e.target.tagName.toUpperCase() === "IMG") {
        fixImageParameters(e.target, Sitecore.WebEditSettings.mediaPrefixes.split("|"));
      }
      else {
        $sc.each($sc(e.target).find("img"), function(index, value) {
          fixImageParameters(value, Sitecore.WebEditSettings.mediaPrefixes.split("|"));
        })
      }
    });
  };
  /** @private */
  this.onKeyDown = function(e) {     
    //Escape    
    if (e.keyCode == 27) {
      Sitecore.PageModes.ChromeManager.hideSelection();
      return;      
    }

    //Ctrl+S
    if (e.keyCode == 83 && e.ctrlKey) {            
      e.preventDefault();            
      this.save();
      return;
    }

    if (e.keyCode == 17 && !this.ctrlPressed) {
      this.ctrlPressed = true;
      Sitecore.PageModes.ChromeManager.hoverFrame().deactivate();
      Sitecore.PageModes.ChromeManager.selectionFrame().deactivate();
      return;
    }
    
    // Workaround for browser's shortcuts, e.q. Ctrl + Shift + Del
    // In such cases keydown event is fired, but keyup is not, hence Ctrl got stuck.
    if (e.ctrlKey && e.keyCode != 17 && this.ctrlPressed) {      
      this.ctrlPressed = false;
      Sitecore.PageModes.ChromeManager.hoverFrame().activate();
      Sitecore.PageModes.ChromeManager.selectionFrame().activate();
      return;
    }    
  };
  /** @private */
  this.onKeyPress = function(e) {         
    // Preventing FF from showing standard "Save as" dialog when clicking <Ctrl>+<S>   
    if (e.ctrlKey && String.fromCharCode(e.which).toLowerCase() == "s") {          
      e.preventDefault();
    }
  };
  /** @private */
  this.onKeyUp = function(e) {
    if (e.keyCode == 17) {
      this.ctrlPressed = false;
      Sitecore.PageModes.ChromeManager.hoverFrame().activate();
      Sitecore.PageModes.ChromeManager.selectionFrame().activate();
    }
        
    if (e.keyCode == 27) {
      if (Sitecore.PageModes.DesignManager.sorting) {
        Sitecore.PageModes.DesignManager.sortingEnd();
      }

      if (Sitecore.PageModes.DesignManager.inserting) {
        Sitecore.PageModes.DesignManager.insertionEnd();
      }
    }    
  };
  /** @private */
  this.onPageLoaded = function() {
    if (Sitecore.WebEditSettings.disableAnimations) {
      $sc.fx.off = true;
    }

    var ribbon = this.ribbon();   
    if (!ribbon) {
      return;
    }        
    
    $sc(ribbon.contentWindow).resize($sc.proxy(this.onRibbonResize, this));
        
    if (this.editing()) {
      $sc(window).bind("scroll", $sc.proxy(this.onWindowScroll.fire, this.onWindowScroll));
      if (typeof(ribbon.contentWindow.scShowControls) != "undefined" && ribbon.contentWindow.scShowControls) {
        setTimeout($sc.proxy(Sitecore.PageModes.ChromeHighlightManager.activate, Sitecore.PageModes.ChromeHighlightManager), 100);      
      }
    }
       
    var $ribbonDoc = $sc(ribbon.contentWindow.document);
    $ribbonDoc.keyup($sc.proxy(this.onKeyUp, this));
    $ribbonDoc.keydown($sc.proxy(this.onKeyDown, this));      
    
    // Hide loading indicator
    $sc("#scPeLoadingIndicator").hide();
    this._isLoaded = true;
    this.onLoadComplete.fire();      
  };
  /** @private */
  this.onRibbonResize = function() {
    if (!this.editing()) {
      return;
    }

    if (this.notificationBar.visible()) {      
      this.notificationBar.resetPosition();
      this.showNotificationBar();
    }
    
    Sitecore.PageModes.ChromeManager.resetSelectionFrame();   
    Sitecore.PageModes.ChromeHighlightManager.planUpdate();
  };

  $sc(document).ready($sc.proxy(this.onDomLoaded, this));
  $sc(window).load($sc.proxy(this.onPageLoaded, this));      
};﻿if (typeof(Sitecore.PageModes) == "undefined") {
  Sitecore.PageModes = new Object();
}

Sitecore.PageModes.ChromeManager = new function() {
  this.overChromes = new Array();        
  this.ignoreDOMChanges = false;
  this.selectionChanged = new Sitecore.Event();
  this.chromeUpdating = new Sitecore.Event(); 
  this.chromeUpdated = new Sitecore.Event();
  this.chromesReseting = new Sitecore.Event();
  this.chromesReseted = new Sitecore.Event();
  this.positioningManager = new Sitecore.PageModes.PositioningManager();
  this._updateVariationsQueue = [];   
      
  this.init = function() {
    Sitecore.PageModes.PageEditor.onCapabilityChanged.observe($sc.proxy(this.onCapabilityChanged, this));
    $sc.each(this.chromes(), function(){ this.load(); });
    this._selectionFrame = new Sitecore.PageModes.SelectionFrame();
    this._hoverFrame = new Sitecore.PageModes.HoverFrame();
    this._moveControlFrame = new Sitecore.PageModes.MoveControlFrame();            
  };
     
  this.addFieldValue = function(fieldValueElement) {
    if (this.fieldValuesContainer == null) {
      this._createFieldValuesContainer();
    }
    
    var elem = null;
    if (!fieldValueElement.jquery) {
      elem = $sc(fieldValueElement);
    }
    else {
      elem = fieldValueElement;
    }
    
    this.fieldValuesContainer.append(elem); 
    elem.bind("setData", $sc.proxy(this.onFieldModified, this));
  };

  this.chromes = function() {
    if (!this._chromes) {
      var chromesToLoad = new Array();
      this._chromes = $sc(".scLooseFrameZone, .scWebEditInput, code[type='text/sitecore'][kind='open']")
                      .map($sc.proxy(function(idx, element) {
                        // preserve existing chromes in case of reset, only create chromes for new dom elements
                        var $domElement = $sc(element);

                        var chrome = this.getChrome($domElement);

                        if (!chrome || this.isElementButNotInitializedYet($domElement)) {
                          var type = this.getChromeType($domElement);
                          chrome = new Sitecore.PageModes.Chrome($domElement, type);

                          if (this._reseted) {
                            chromesToLoad.push(chrome);
                          }
                        }

                        return chrome;
                      }, this));

      this._reseted = false;
      $sc.each(chromesToLoad, function(){ this.load(); });
      this._chromes = $sc.grep(this._chromes, function(c) { return c != null; });
    }

    return this._chromes;
  };

  // Updates current chromes position in array according to DOM changes
  this.rearrangeChromes = function() {
    var l = this._chromes ? this._chromes.length : 0;
    this._chromes = $sc(".scLooseFrameZone, .scWebEditInput, code[type='text/sitecore'][kind='open']")
                      .map($sc.proxy(function(idx, element) {                       
                        var $domElement = $sc(element);
                        var chrome = this.getChrome($domElement);
                        if (chrome) {
                          return chrome;
                        }
                      }, this));

     if (l !== this._chromes.length) {
      console.error(l + " chromes expected." + this._chromes.length + " found");
     } 
  }

  // Not the most elegant of all methods.
  // If the domElement is an editFrame or field root node, but the this.getChrome doesn't return the corresponding chrome, this means that this
  // dom element hasn't been initialized as corrseponding chrome.
  // The reason this method is here, is because the same domElement might have been initialized as a part of placeholder or rendering, which would give it an scChromes 
  // collection.
  this.isElementButNotInitializedYet = function(domElement) {
    var chrome = this.getChrome(domElement);

    if (!chrome) {
      return false;
    }

    if (!domElement.is(".scLooseFrameZone, .scWebEditInput, code[type='text/sitecore'][chromeType='field']")) {        
      return false;
    }

    if (chrome.key() == "editframe" || chrome.key() == "field") {
      return false;
    }

    return true;
  };

  this.getChrome = function(domElement) {
    var chromes = domElement.data("scChromes");
    
    if (!chromes || chromes.length == 0) {
      return null;
    }

    return chromes[chromes.length - 1];
  };

  this.getChromesByType = function(chromeType) {
    return $sc.grep(this.chromes(), function(c) {
      return (c.type instanceof chromeType);
    });
  };

  this.getChromeType = function(domElement) {
    if (domElement.hasClass("scWebEditInput")) {
      if (domElement.hasClass("scWordContainer")) {
        return new Sitecore.PageModes.ChromeTypes.WordField();
      }

      return new Sitecore.PageModes.ChromeTypes.Field();
    }

    if (domElement.is("code[type='text/sitecore'][chromeType='field']")) {
      return new Sitecore.PageModes.ChromeTypes.WrapperlessField();
    }

    if (domElement.hasClass("scLooseFrameZone")) {
      return new Sitecore.PageModes.ChromeTypes.EditFrame();
    }

    if (domElement.is("code[type='text/sitecore'][chromeType='placeholder']")) {
      return new Sitecore.PageModes.ChromeTypes.Placeholder();
    }

    if (domElement.is("code[type='text/sitecore'][chromeType='rendering']")) {
      return new Sitecore.PageModes.ChromeTypes.Rendering();
    }

    console.error("Unknown chrome type:");
    console.log(domElement);

    throw ("Unknown chrome type");
  };

  this.handleMessage = function(msgName, params) {
    var msgHandler = null;
    if (this._commandSender) {
      msgHandler = this._commandSender;
    }
    else if (this.selectedChrome()) {
      msgHandler = this.selectedChrome();
    }

    if (params && params.controlId) {
      if (msgHandler == null || (msgHandler != null && msgHandler.controlId() != params.controlId)) {
        msgHandler = $sc.first(this.chromes(), function() { return this.controlId() == params.controlId; });
      }
    }
    
    if (msgHandler != null) {
      msgHandler.handleMessage(msgName, params);
    }
  };

  this.handleCommonCommands = function (sender, msgName, params) {
    if (msgName == "chrome:common:edititem") {      
      var reGuid = /(\{){0,1}[0-9A-F]{8}\-[0-9A-F]{4}\-[0-9A-F]{4}\-[0-9A-F]{4}\-[0-9A-F]{12}(\}){0,1}/i;
      var matches = reGuid.exec(sender.getContextItemUri());
      if (matches != null && matches.length > 0) {
        var itemid = matches[0];
        Sitecore.PageModes.PageEditor.postRequest(params.command + "(id=" + itemid + ")", null, false);
      }        
    }
    // throw message further in order corresponding chrome could handle it either/
    sender.handleMessage(msgName, params);
  }; 
          
  this.hideSelection = function() {
    if (this._selectedChrome) {
      this._selectedChrome.hideSelection();
      this._selectedChrome = null;
      this.selectionFrame().hide();
    }
  };

  this.hoverActive = function() {
    return !Sitecore.PageModes.DesignManager.sorting;
  };

  this.hoverFrame = function() {
    return this._hoverFrame;
  };

  this.moveControlFrame = function() {
    return this._moveControlFrame;
  };
          
  this.onMouseOver = function(chrome) {
    if (!Sitecore.PageModes.PageEditor.isLoaded()) {
      return;
    }

    if (!this.hoverActive()) {
      return;
    }

    this.overChromes.push(chrome);
    this.updateHoverChrome();
  };

  this.onMouseOut = function(chrome) {
    if (!Sitecore.PageModes.PageEditor.isLoaded()) {
      return;
    }

    var idx = $sc.inArray(chrome, this.overChromes); 
    if (idx > -1) {
      this.overChromes.splice(idx,1);
    }

    this.updateHoverChrome();
  };   
  /**
  * @deprecated since Sitecore 6.5. You should now use @see Sitecore.PageModes.PageEditor#postRequest.
  */  
  this.postRequest = function(request, callback, async) {
    Sitecore.PageModes.PageEditor.postRequest(request, callback, async);    
  };
  
  this.resetChromes = function() {   
    this.chromesReseting.fire();
    $sc.each(this.chromes(), function(){ this.reset();});

    this._chromes = null;
    this._reseted = true;

    // force init of new chromes to attach event handlers
    this.chromes();
    this.chromesReseted.fire();
    Sitecore.PageModes.ChromeHighlightManager.planUpdate();
  };

  this.resetSelectionFrame = function () {
    var selectionFrame = this.selectionFrame();
    if (!selectionFrame) {
      return;
    }

    var selectedChrome = this.selectedChrome();    
    if (selectedChrome) {
      this.hideSelection();
      this.select(selectedChrome);
    }
  };

  this.save = function(postaction) {
    Sitecore.PageModes.PageEditor.save(postaction);
  };
  
  this.select = function(chrome) {       
    if (!Sitecore.PageModes.PageEditor.isLoaded()) {
      return;
    }

    if (!chrome || !chrome.isEnabled()) {
      this.hideSelection();            
      this.selectionChanged.fire(null);
      return;
    }

    this.selectionChanged.fire(chrome);

    if (this._selectedChrome == chrome) {
      this.selectionFrame().show(chrome);
      return;
    }

    if (this._selectedChrome && this._selectedChrome != chrome) {
      this._selectedChrome.hideSelection();
    }

    this._selectedChrome = chrome;
    chrome.showSelection();
    this.selectionFrame().show(chrome);    
  };

  this.selectedChrome = function() {
    return this._selectedChrome;
  };

  this.selectionFrame = function() {
    return this._selectionFrame;
  };

  /**
  * @deprecated since Sitecore 6.5. You should now use @see Sitecore.PageModes.PageEditor#setModified.
  */
  this.setModified = function(value) {   
     Sitecore.PageModes.PageEditor.setModified(value);   
  };

  /**
  * @deprecated since Sitecore 6.5. You should now use @see Sitecore.PageModes.PageEditor#isModified.
  */
  this.isModified = function() {
    return Sitecore.PageModes.PageEditor.isModified();
  };

  this.setCommandSender = function(chrome) {
    this._commandSender = chrome;
  };
    
  this.onCapabilityChanged = function() {
    var selectedChrome =  this.selectedChrome();
    this.hideSelection();    
    this.resetChromes();
    $sc.each(this.chromes(), function() { this.reload();});
    if (selectedChrome && selectedChrome.isEnabled()) {
       this.select(selectedChrome);        
    }    
  };

  /**
  * @description Handles the event when Ajax request was sent to update chrome content (insert rendering, change condition etc.)
  */
  this.onChromeUpdating = function() {    
    this.chromeUpdating.fire(this._commandSender);
  };

  /**
  * @description Handles the event when Ajax request for chrome updating has finished;
  */
  this.onChromeUpdated = function(chrome, reason) {
    this.chromeUpdated.fire();
    var isBatchUpdate = false;
    if (chrome && chrome.key() == "rendering" && reason == "changevariation") {
      var id = chrome.type.uniqueId();
      var idx = $sc.findIndex(this._updateVariationsQueue, function() { return this.componentId == id; });
      if (idx >= 0) {
        this._updateVariationsQueue.splice(idx, 1); 
        isBatchUpdate = true; 
      }
      
      var next = this._updateVariationsQueue[0];
      if (!next) {
        if (isBatchUpdate) {
          if (this._selectChromeAfterBatchUpdate === false) {
            this.select(null);
          }
          else {
            this.scrollChromeIntoView(chrome);           
          }          
        }

        this.selectionFrame().activate();       
        return;
      }

      var component = $sc.first(this.chromes(), function() { 
        return this.key() === "rendering" && this.type.uniqueId() === next.componentId;
      });

      if (!component) {
        return;
      }
      
      Sitecore.PageModes.ChromeManager.select(component);     
      component.handleMessage("chrome:testing:variationchange", {id: next.variationId});      
    }
  };

  this.onFieldModified = function(evt, key, value) {    
    if (key == "modified") {      
      evt.stop();
      modifiedControlId = value;
      $sc.each(this.chromes(), function() { 
        if (this.key() == "field" && this.controlId() != modifiedControlId && this.type.isFieldValueContainer(evt.target)) {
          this.type.setReadOnly();
        } 
      });
    }
  };
  
  this.scrollChromeIntoView = function(chrome) {
     this.positioningManager.scrollIntoView(chrome);
  }; 

  this.updateHoverChrome = function() {
    var result = [], l = this.overChromes.length;

    for (var i = 0; i < l; i++) {
      var isUnique = true;

      if (this.overChromes[i].removed()) {
        continue;
      }

      for (var j = 0; j < result.length; j++) {
        if (result[j] == this.overChromes[i]) {
          isUnique = false;
          break;
        }
      }

      if (isUnique) {
        result.push(this.overChromes[i]);
      }
    }

    this.overChromes = result;
    
    var level = 0;
    var deepestChrome = null;

    $sc.each(this.overChromes, function() {
      if (this.level() > level) {
        level = this.level();
        deepestChrome = this;
      }
    });

    if (this._hoverChrome && this._hoverChrome != deepestChrome) {
      this._hoverChrome.hideHover();
    }

    if (deepestChrome) {
      this._hoverChrome = deepestChrome;
      deepestChrome.showHover();
    }
  };

  this.updateChromeDimensions = function() {    
    if (this._selectedChrome) {     
        this._selectedChrome.position.reset();      
    }
  };

  this.updateField = function(id, htmlValue, plainValue, preserveInnerContent) {
    var fieldToUpdate = $sc.first(this.chromes(), function() { return this.key() == "field" && this.controlId() == id;});
    if (fieldToUpdate) {
      var params = {
          plainValue: plainValue,
          value: htmlValue,
          preserveInnerContent: !!preserveInnerContent 
        };
              
      fieldToUpdate.handleMessage("chrome:field:editcontrolcompleted", params);
      if (!preserveInnerContent) {        
        fieldToUpdate.position.reset();
      }
    }
    else {
      console.error("The field with " + id + "was not found");
    }
  };

  this.batchChangeVariations = function(combination, selectChrome) {
    this._selectChromeAfterBatchUpdate = !!selectChrome
    for (var n in combination) {
      if (!combination.hasOwnProperty(n)) {
        continue;
      }

      var isQueueEmpty = this._updateVariationsQueue.length == 0;                      
      var componentId = n;
      var variationId = combination[n];
      this._updateVariationsQueue.push({componentId:componentId, variationId: variationId});
      if (isQueueEmpty) {
        var component = $sc.first(Sitecore.PageModes.ChromeManager.chromes(), function() { 
          return this.key() === "rendering" && this.type.uniqueId() === componentId;
        });

        if (component) {
          this.selectionFrame().deactivate();
          this.select(component);     
          component.handleMessage("chrome:testing:variationchange", {id: variationId}); 
        }
      }      
    }
  };

  this.getFieldValueContainer = function(itemUri, fieldID) {
    return this._getFieldValueContainer(itemUri, fieldID);
  };

  this.getFieldValueContainerById = function(id) {    
    if (!this.fieldValuesContainer) {
      return null;
    }

    var parts = id.split("_");
    // normalizaed id doesn't contain trailing _revision and _sequencer
    var normalizedId = parts.slice(0, 5).join("_");

    var result = $sc("input", this.fieldValuesContainer).filter(function() {
      return this.id.indexOf(normalizedId) == 0;
    });

    return result[0];    
  };

  this._createFieldValuesContainer = function() {    
    this.fieldValuesContainer = $sc("<div id='scFieldValues'></div>").prependTo(document.body);
  };
    
  this._getFieldValueContainer = function(itemUri, fieldID) {
    var id = "fld_" + itemUri.id + "_" + fieldID + "_" + itemUri.language + "_" + itemUri.version;
    return this.getFieldValueContainerById(id);
  };

  this.getFieldValue = function(itemUri, fieldID) {
    var container = this._getFieldValueContainer(itemUri, fieldID);

    if (!container) {
      return null;
    }

    return container.value;
  };

  this.setFieldValue = function(itemUri, fieldID, value) {    
    value = value.replace(/-,scDQuote,-/g, "\"");
    value = value.replace(/-,scSQuote,-/g, "'");

    var container = this._getFieldValueContainer(itemUri, fieldID, value);    
    if (!container) {
      var revision = itemUri.revision || "#!#Ignore revision#!#";

      var id = "fld_" + itemUri.id + "_" + fieldID + "_" + itemUri.language + "_" + itemUri.version + "_" + revision + "_999";
     
      container = $sc("<input type='hidden' />").attr({
          name: id,
          id: id,
          value: value
        }).get(0);

      if (!this.fieldValuesContainer) {
        this._createFieldValuesContainer();
      }

      this.fieldValuesContainer.append(container); 
      Sitecore.PageModes.PageEditor.setModified(true);
      if (this.selectedChrome() && this.selectedChrome().key() == "editframe") {
        this.selectedChrome().type.fieldsChangedDuringFrameUpdate = true;
      }
      
      return;     
    }

    if (container.value != value) {
      container.value = value;
      Sitecore.PageModes.PageEditor.setModified(true);
      if (this.selectedChrome() && this.selectedChrome().key() == "editframe") {
        this.selectedChrome().type.fieldsChangedDuringFrameUpdate = true;
      }

      $sc.each(this.chromes(), function() { 
        if (this.key() == "field" && this.type.isFieldValueContainer(container)) {
          this.type.refreshValue();
        }
      });
    }          
  };   
};﻿Sitecore.PageModes.DesignManager = new function() {      
  this.inserting = false;
  this.sorting = false;
  Sitecore.PageModes.ChromeManager.chromesReseting.observe($sc.proxy(function() { this._placeholders = null;}, this))

  this.insertionStart = function() {
    Sitecore.PageModes.ChromeManager.hideSelection();
    if (this.inserting) return;

    $sc.each(this.placeholders(), function() {
      this.type.onShow();
    });

    this.inserting = true;
  };

  this.insertionEnd = function() {
     $sc.each(this.placeholders(), function() {
      this.type.onHide();
    });

    this.inserting = false;
  };
  
  this.moveControlTo = function(rendering, placeholder, position) {
    var descendants = rendering.descendants();       
    
    if ($sc.exists(descendants, function() { return this.key() == "word field" && this.type.hasModifications();} )) {
      if (confirm(Sitecore.PageModes.Texts.ThereAreUnsavedChanges)) {
        placeholder.type.insertRenderingAt(rendering, position);        
        Sitecore.LayoutDefinition.moveToPosition(rendering.type.uniqueId(), placeholder.type.placeholderKey(), position);
      }   
    }
    else {
      placeholder.type.insertRenderingAt(rendering, position);        
      Sitecore.LayoutDefinition.moveToPosition(rendering.type.uniqueId(), placeholder.type.placeholderKey(), position);
    }
  };
      
  this.placeholders = function() {
    if (!this._placeholders) {
      this._placeholders = $sc.grep(Sitecore.PageModes.ChromeManager.chromes(), function(chrome) { return chrome.key() == "placeholder" && chrome.isEnabled(); });
    }
    
    return this._placeholders;
  };

  this.onSelectionChanged = function(chrome) {
    if (this.inserting) {
      this.insertionEnd();
    }
  };

  this.canMoveRendering = function(rendering) {    
    var originalPlaceholder, placeholderRenderings, placeholders, renderingId;
            
    if (!rendering) {
      return false;
    }

    originalPlaceholder = rendering.type.getPlaceholder();
    if (!originalPlaceholder) {
      return false;
    }

    // Original placeholder is not editable. Do not allow move rendering away from it
    if (!originalPlaceholder.isEnabled()) {
      return false;
    }

    placeholderRenderings = originalPlaceholder.type.renderings();
    // We can move rendering inside the same placeholder
    if (placeholderRenderings.length > 1) {
      return true;
    }

    placeholders = this.placeholders();
    renderingId = rendering.type.renderingId();
    for (var i = 0, l = placeholders.length; i < l; i++) {
      if (placeholders[i] == originalPlaceholder) {
        continue;
      }

      if (placeholders[i].type.renderingAllowed(renderingId)) {
        return true;
      }
    }

    return false;
  };
  
  this.sortingStart = function(rendering) {
    if (this.sorting) return;

    $sc.each(this.placeholders(), function() {
      this.type.sortingStart(rendering);
    });
    
    this.sorting = true;
    this.sortableRendering = rendering;
    
  };
  
  this.sortingEnd = function() {
    if (!this.sorting) {
      return;
    }
    
    this.sorting = false;
    
    this.sortableRendering.type.sortingEnd();
  
    $sc.each(this.placeholders(), function() {
      this.type.sortingEnd();
    });
  };

  Sitecore.PageModes.ChromeManager.selectionChanged.observe($sc.proxy(this.onSelectionChanged, this));
};﻿Sitecore.LayoutDefinition = new function() {
};

Sitecore.LayoutDefinition.insert = function(placeholderKey, id) {
  var layoutDefinition = this.getLayoutDefinition();
  var device = this.getDevice(layoutDefinition);

  var r = new Object();
  r["@id"] = id;
  r["@ph"] = placeholderKey;

  device.r.splice(0, 0, r);

  this.setLayoutDefinition(layoutDefinition);
};

Sitecore.LayoutDefinition.getRendering = function(uid) {
  var layoutDefinition = this.getLayoutDefinition();
  var device = this.getDevice(layoutDefinition);
  if (!device) {
    return null;
  }

  for (var n = 0; n < device.r.length; n++) {
    if (this.getShortID(device.r[n]["@uid"]) == uid) {
      return device.r[n];            
    }
  }
};

Sitecore.LayoutDefinition.remove = function(uid) {
  var layoutDefinition = this.getLayoutDefinition();
  var device = this.getDevice(layoutDefinition);

  this.removeRendering(device, uid);  
  this.setLayoutDefinition(layoutDefinition);
};

Sitecore.LayoutDefinition.removeRendering = function(device, uid) {
  for (n = 0; n < device.r.length; n++) {
    if (this.getShortID(device.r[n]["@uid"]) == uid) {
      r = device.r[n];
      device.r.splice(n, 1);
      return r;
    }
  }
  return null;
};

Sitecore.LayoutDefinition.moveToPosition = function(uid, placeholderKey, position) {
  var layoutDefinition = this.getLayoutDefinition();
  var device = this.getDevice(layoutDefinition);
  var originalPosition = this._getRenderingPositionInPlaceholder(device, placeholderKey, uid);
  var r = this.removeRendering(device, uid);
  if (r == null) {
    return;
  }
  
  r["@ph"] = placeholderKey;

  if (position == 0) {
     device.r.splice(0, 0, r);
     this.setLayoutDefinition(layoutDefinition);
     return;
  }
  // Rendering is moving down inside the same placeholder. Decrement the real position, because rendering itself is removed 
  // from his original position. 
  if (originalPosition > -1 && originalPosition < position) {
    position--;
  }

  var placeholderWiseCount = 0;
  for (var totalCount = 0; totalCount < device.r.length; totalCount++)
  {
    var rendering = device.r[totalCount];       
    if (Sitecore.PageModes.Utility.areEqualPlaceholders(rendering["@ph"], placeholderKey))
    {
      placeholderWiseCount++;
    }

    if (placeholderWiseCount == position)
    {
      device.r.splice(totalCount + 1, 0, r);
      break;
    }
  }
    
  this.setLayoutDefinition(layoutDefinition);
};

Sitecore.LayoutDefinition.getRenderingConditions = function(renderingUid) {
  if (!Sitecore.PageModes.Personalization) {
    return [];
  }

  var layoutDefinition = this.getLayoutDefinition();
  var device = this.getDevice(layoutDefinition);
  var conditions = [];
  for (var i = 0; i < device.r.length; i++) {
    if (this.getShortID(device.r[i]["@uid"]) == renderingUid && device.r[i].rls) {
      var rules = device.r[i].rls.ruleset;
      if (rules && rules.rule) {
        if(!$sc.isArray(rules.rule)) {
          rules.rule = [rules.rule];
        }

        for (var j = 0; j < rules.rule.length; j++) {
          var conditionId = rules.rule[j]["@uid"];
          var isActive = Sitecore.PageModes.Personalization.ConditionStateStorage.isConditionActive(renderingUid, conditionId);
          conditions.push(new Sitecore.PageModes.Personalization.Condition(
            conditionId,
            rules.rule[j]["@name"],
            isActive
          ));
        }
      }
    }
  }

  return conditions;
};

Sitecore.LayoutDefinition.GetConditionById = function(conditionId) {
  var layoutDefinition = this.getLayoutDefinition();
  var device = this.getDevice(layoutDefinition);  
  for (var i = 0; i < device.r.length; i++) {
     var rules = device.r[i].rls ? device.r[i].rls.ruleset: null;
     if (rules && rules.rule) {
        if(!$sc.isArray(rules.rule)) {
          rules.rule = [rules.rule];
        }

        for (var j = 0; j < rules.rule.length; j++) {
          if (rules.rule[j]["@uid"] == conditionId) {
            return {rule : rules.rule[j]};
          }
        }
     }
  }

  return {};
};

Sitecore.LayoutDefinition.getRenderingIndex = function(placeholderKey, index) {
  var layoutDefinition = this.getLayoutDefinition();
  var device = this.getDevice(layoutDefinition);

  var i = 0;

  for (n = 0; n < device.r.length; n++) {
    if (device.r[n]["@ph"] == placeholderKey) {
      if (i == index) {
        return n;
      }

      i++;
    }
  }

  return -1;
};

Sitecore.LayoutDefinition.getRenderingPositionInPlaceholder = function(placeholderKey, uid) {
  var layoutDefinition = this.getLayoutDefinition();
  var device = this.getDevice(layoutDefinition);
  return this._getRenderingPositionInPlaceholder(device, placeholderKey, uid);
};

Sitecore.LayoutDefinition.getLayoutDefinition = function() {
  return JSON.parse($sc("#scLayout").val());
};

Sitecore.LayoutDefinition.setLayoutDefinition = function(layoutDefinition) {
  var newValue = $sc.type(layoutDefinition) === "string" ? layoutDefinition : JSON.stringify(layoutDefinition);
  if ($sc("#scLayout").val() != newValue) {
    $sc("#scLayout").val(newValue);
    Sitecore.PageModes.PageEditor.setModified(true);
  }
};

Sitecore.LayoutDefinition.getDeviceID = function() {
  return $sc("#scDeviceID").val();
};

Sitecore.LayoutDefinition.getDevice = function(layoutDefinition) {
  var deviceID = this.getDeviceID();

  if (!layoutDefinition.r.d) {
    return null;
  }

  //By serialization behaivour. If there is single element- it would not be serialized as array
  if (!layoutDefinition.r.d.length) {
    layoutDefinition.r.d = [layoutDefinition.r.d];
  }

  var list = layoutDefinition.r.d;

  for (var n = 0; n < list.length; n++) {
    var d = list[n];

    var id = this.getShortID(d["@id"]);

    if (id == deviceID) {
      //By serialization behaivour. If there is single element- it would not be serialized as array
      if (d.r && !d.r.length) {
        d.r = [d.r];
      }
      return d;
    }
  }

  return null;
};

Sitecore.LayoutDefinition.getShortID = function(id) {
  return id.substr(1, 8) + id.substr(10, 4) + id.substr(15, 4) + id.substr(20, 4) + id.substr(25, 12);
};

Sitecore.LayoutDefinition.readLayoutFromRibbon = function() {
  var layout = Sitecore.PageModes.PageEditor.ribbon().contentWindow.$("scLayoutDefinition").value;    
  if (layout && layout.length > 0) {
    this.setLayoutDefinition(layout);
    return true;
  }

  return false;
};

Sitecore.LayoutDefinition._getRenderingPositionInPlaceholder = function(device, placeholderKey, uid) {
  var counter = 0;
  for (var i = 0; i < device.r.length; i++) {
    if (Sitecore.PageModes.Utility.areEqualPlaceholders(device.r[i]["@ph"],placeholderKey)) {
      if (this.getShortID(device.r[i]["@uid"]) == uid) {
        return counter;
      }

      counter++;
    }
  }

  return -1;
};

﻿if (typeof(Sitecore.PageModes) == "undefined") {
  Sitecore.PageModes = new Object();
}

Sitecore.PageModes.Chrome = Base.extend({
  constructor: function(domElement, type) {
    this._originalDOMElement = domElement;
    
    this.type = type;
    type.chrome = this;
    this._parseElements();    
    this._level = -1;
    var dataNode = this.type.dataNode(domElement);
    this.setData(dataNode);
    // force init display name. Chrome data may change(i.e. when changing variations or conditions), but the name 
    // of the chrome should be the same during all the lifetime.
    this.displayName();
    this.position = new Sitecore.PageModes.Position(this);
    this._clickHandler = $sc.proxy(this._clickHandler, this);
    this._mouseEnterHandler = $sc.proxy(this._mouseEnterHandler, this);
    this._mouseLeaveHandler = $sc.proxy(this._mouseLeaveHandler, this);

    $sc.util().log("initialized new chrome: " + this.type.key());
  },

  /* DOM manipulation */

  after: function(chromeOrElements) {
    var elements = $sc.util().elements(chromeOrElements);

    this.closingMarker().after(elements);
  },

  append: function(chromeOrElements) {
    var elements = $sc.util().elements(chromeOrElements);

    this.closingMarker().before(elements);
  },

  before: function(chromeOrElements) {
    var elements = $sc.util().elements(chromeOrElements);

    this.openingMarker().before(elements);
  },

  empty: function() {
    this.element.remove();
  },

  prepend: function(chromeOrElements) {
    var elements = $sc.util().elements(chromeOrElements);

    this.openingMarker().after(elements);
  },

  update: function(elements) {
    if (!(elements instanceof $sc)) {
      throw "Unexpected elements";
    }

    this.empty();
    this.append(elements);
    this.element = elements;
  },

  /* End DOM manipulation */

  ancestors: function() {
    var result = new Array();

    var parent = this.parent();

    while (parent) {
      result.push(parent);
      parent = parent.parent();
    }

    return result;
  },

  attachEvents: function() {
    this.element.click(this._clickHandler);
    this.element.mouseenter(this._mouseEnterHandler);
    this.element.mouseleave(this._mouseLeaveHandler);
  },

  detachEvents: function() {
    this.element.unbind("click", this._clickHandler);
    this.element.unbind("mouseenter", this._mouseEnterHandler);
    this.element.unbind("mouseleave", this._mouseLeaveHandler);
  },

  detachElements: function() {
    this.element.data("scChromes", null);
  },

  // Returns currently enabled child chromes.  
  descendants: function() {          
     var deep = true;
     return this.getChildChromes(function() { return this && this.isEnabled();}, deep);                    
  },

  // Returns currently enabled child chromes, immediate descentants of the current chrome.
  // The returning value is cached.
  children: function() {
    if (!this._children) {      
      this._children = this.getChildChromes(function() { return this && this.isEnabled();});            
    }

    return this._children;
  },
  
  closingMarker: function() {
    return this._closingMarker;
  },

  commands: function() {
    return this.data.commands ? this.data.commands : new Array();
  },

  controlId: function() {
    return this.type.controlId();
  },

  displayName: function() {
    if (this._displayName != null) {
      return this._displayName;
    }

    this._displayName = this.data.displayName ? this.data.displayName : Sitecore.PageModes.Texts.NotSet;
    return this._displayName;
  },

  elementsAndMarkers: function() {
    return this.openingMarker().add(this.element).add(this.closingMarker());
  },

  expand: function() {
    var excludeFakeParents = true;
    var parent = this.parent(excludeFakeParents);
    if (parent) {
      Sitecore.PageModes.ChromeManager.select(parent);
    }
    else {
      console.error("no parent - nowhere to expand");
    }
  },
    
  // Returns child chromes, immediate descentants of the current chrome, which match the specified predicate.
  // If deep = true, all descendant chromes are returned, otherwise only immediate children are returned.
  getChildChromes: function(predicate, deep) {    
    if (typeof(predicate) == "undefined" || !predicate) {
      predicate = function() { return this; };
    }
   
    var result = [];

    /* first checking all DOMElements that are a part of this chrome to see if they have other chromes associated with them */
    for (var i = 0; i < this.element.length; i++) {
      var part = $sc(this.element[i]);

      var chromes = part.data("scChromes");
      if (!chromes || chromes.length == 0) {
        continue;
      }
      
      if (chromes.length < 2) {
        continue;
      }

      var index = $sc.inArray(this, chromes);
      if (index < 0) {
        throw "The chrome must be present in scChrome collections of its DOM elements";
      }

      /* if the chrome is last in collection, it means it doesn't have any children bound to same DOM elements */
      if (index == chromes.length - 1) {
        continue;
      }

      for (var j = index + 1; j < chromes.length; j++) {
        var childChrome = chromes[j];
        
        if (!predicate.call(childChrome, childChrome)) {
          continue;
        }
        
        if ($sc.inArray(childChrome, result) >= 0) {
          continue;
        }
        
        result.push(childChrome);        
      }
    }
    
    /* then we traverse the DOM tree to get child (or descendant) chromes */
    var selector = ".scLooseFrameZone, .scWebEditInput, code[type='text/sitecore'][kind='open']";
    
    var elements = this.element.find(selector);
    var l = elements.length;     
     
    for (var i = 0; i < l; i++) {
      var currentElem = $sc(elements[i]);
      var chrome = Sitecore.PageModes.ChromeManager.getChrome(currentElem);
        
      if (!deep) {
        /* if dom node's parent chrome is not this chrome, it means there is a chrome in between, so we disregard it a descendant, but not a child. */
        if (chrome.parent(false, false) != this) {
          continue;
        }
      }  
      
      if (!chrome || !predicate.call(chrome, chrome)) {
        continue;
      }

      result.push(chrome);
    }
   
    return result;
  },

  handleMessage: function(message, params, sender) {   
    this.type.handleMessage(message, params, sender);
  },

  icon: function() {
    return this.type.icon();
  },

  isEnabled: function() {
    return this.type.isEnabled();
  },

  isReadOnly: function() {
    return this.type.isReadOnly();
  },

  setReadOnly: function() {
    this.type.setReadOnly();
  },
  
  isFake: function() {
    if (this.key() == "field") {
      var childField = $sc.first(this.children(), function() { return this.key() == "field"; });
      return !!childField;
    }

    return false;
  },

  key: function() {
    return this.type.key();
  },

  level: function() {
    if (this._level <= 0) {           
      this._level = this.ancestors().length + 1;
    }

    return this._level;
  },

  load: function() {
    this.attachEvents();       
    if (this.type.load) {
      this.type.load();
    }

    var parent = this.parent(false, false);
    if (parent != null && parent.isReadOnly()) {
      this.setReadOnly();
    }

    this._fixCursor();
  },

  openingMarker: function() {
    return this._openingMarker;
  },

  setData: function(dataNode) {
    if (dataNode && $sc.trim(dataNode.text()) !== "") {
      this.hasDataNode = true;     
      var json = dataNode.get(0).innerHTML;      
      this.data = $sc.evalJSON(json);
    }
    else {
      this.hasDataNode = false;
      this.data = {};
      this.data.custom = {};      
    }
  },

  showHover: function() {
    if (!this._selected) {
      Sitecore.PageModes.ChromeManager.hoverFrame().show(this);
    }
  },
 
  hideHover: function() {
    Sitecore.PageModes.ChromeManager.hoverFrame().hide();
  },
  
  //excludeFake determines if we should consider fake parents (if field chrome A has nested field chrome B, then A is fake parent)
  //enabledOnly - defines if only enabled chromes may be retuned as a parent
  parent: function(excludeFake, enabledOnly) {
    var includeDisabled = false;
    if (typeof(enabledOnly) != "undefined") {
      includeDisabled = !enabledOnly;
    }

    var chrome = null;

    // checks if more then one chrome is associated with a given dom node. if so, return next chrome in stack.
    var chromes = this.element.data("scChromes");

    if (typeof(chromes) == "undefined") {
      if (this.element.length > 0) {
        console.warn("Chrome elements do not have scChrome collection assigned");
        console.log(this.element);
      }

      chromes = new Array();
    }

    if (chromes.length > 1) {
      var index = $sc.inArray(this, chromes);
      if (index < 0) {
        throw new "A chrome must be found in the elements chrome collection";
      }

      if (index > 0) {
        if (includeDisabled) {
          return chromes[index - 1];
        }

        var ancestor = $sc.last(chromes.slice(0 , index), function() { return this.isEnabled(); });
        if (ancestor) {
          return ancestor;
        } 
      }
    }

    // traverses DOM tree to find parent chromes
    var node = this.element.parent();
    var partOf = "";

    while (node.length > 0) {
      partOf = node.attr("sc-part-of");
        
      if (typeof(partOf) != "undefined" && partOf.length > 0) {
        chrome = Sitecore.PageModes.ChromeManager.getChrome(node);
        if (!chrome) {
          console.error("Any [sc-part-of] node is expected to have its scChromes collection");
          console.log(node.data("scChromes"));
          return null;
        }

        if (partOf == "field") {
          if (includeDisabled || chrome.isEnabled()) {
            if (excludeFake) {
              if (!chrome.isFake()) return chrome;
            }
            else return chrome;
          }

        }
        else {
          if (includeDisabled || chrome.isEnabled()) return chrome;
          return chrome.parent(excludeFake, enabledOnly);
        }
      }

      node = node.parent();
    }

    return null;
  },

  showHighlight: function() {
    if (this._selected) return;

    if (!this._highlight) {      
      this._highlight = new Sitecore.PageModes.HighlightFrame();
    }
       
    this._highlight.show(this);    
  },

  hideHighlight: function() {
    if (this._highlight) {      
      this._highlight.hide();
    }
  },
  
  showSelection: function() {
    this._selected = true;
    this.hideHover();
    this.hideHighlight();
        
    if (this.type.onShow) {
      this.type.onShow();
    }
  },

  hideSelection: function() {
    this._selected = false;
    if (Sitecore.PageModes.ChromeHighlightManager.isHighlightActive(this)) {
      this.showHighlight();
    }
        
    if (this.type.onHide) {
      this.type.onHide();
    }
  },

  getContextItemUri: function() {
    return this.type.getContextItemUri();
  },

  previous: function() {
    if (!this.parent()) {
      return;
    }

    var children = this.parent().children();

    var index = $sc.inArray(this, children);
    if (index == 0) {
      return;
    }

    return children[index - 1];
  },

  next: function() {
    if (!this.parent()) {
      return;
    }

    var children = this.parent().children();

    var index = $sc.inArray(this, children);
    if (children.length <= index + 1) {
      return;
    }

    return children[index + 1];
  },

  reload: function() {
    this._fixCursor();

    if (this.type.reload) {
      this.type.reload();
    }
  },
  
  reset: function() {
    this._children = null;
    
    this.detachEvents();

    this._parseElements();
    
    this.attachEvents();
    
    this.position.reset();
  },

  remove: function() {
    this.onDelete();
    this.openingMarker().remove();
    this.element.remove();
    this.closingMarker().remove();
    this._removed = true;    
  },

  removed: function() {
    return this._removed ? true : false;
  },
    
  onDelete: function(preserveData) {
    if (this._highlight) {
      this._highlight.dispose();
    }
        
    this.type.onDelete(preserveData);
  },
  
  _fixCursor: function() {
    var l = this.element.length, 
        i = 0,
        isEnabled = this.isEnabled();
    
    for (i; i < l; i++) {
      var element = $sc(this.element[i]);
      var chrome = Sitecore.PageModes.ChromeManager.getChrome(element);
      if (chrome != this) {
        continue;
      }

      if (isEnabled) {
        element.addClass("scEnabledChrome");
      }
      else {
        element.removeClass("scEnabledChrome");
      }
    }  
  },

  /* event handlers */
  _clickHandler: function(e) {
    if (!this.isEnabled()) {
      return;
    }

    if (e.ctrlKey) return;               
    e.stopPropagation();
        
    if (Sitecore.PageModes.ChromeManager.selectedChrome() != this || this.key() == "field" ) {          
      e.preventDefault();         
    }

    var target = $sc(e.target);
    target = target.closest("[sc-part-of]");

    if (!target.attr("sc-part-of")) {
      console.warn("this element wasn't supposed to get the click event");
      console.log(e.target);
      return;
    }

    var chromes = $sc(target).data("scChromes");
    if (!chromes || chromes.length < 1) {
      console.log(target);
      throw "DOM element is expected to have a non-empty chromes collection.";
    }

    var enabledChrome = $sc.last(chromes, function() { return this.isEnabled(); });
    Sitecore.PageModes.ChromeManager.select(enabledChrome? enabledChrome : this);
  },

  _mouseEnterHandler: function(e) { 
    if (!this.isEnabled()) {
      return;
    }

    Sitecore.PageModes.ChromeManager.onMouseOver(this);
  },

  _mouseLeaveHandler: function() {
    if (!this.isEnabled()) {
      return;
    }

    Sitecore.PageModes.ChromeManager.onMouseOut(this);
  },
  
  /* establishes connection between DOM elements and chrome objects. */
  _markElements: function() {
    var chrome = this;

    if (this.openingMarker() && !this.openingMarker().data("scChromes")) {
      var chromes = new Array();
      chromes.push(this);
      this.openingMarker().data("scChromes", chromes);
    }

    this.element.each(function(index, raw) {
      var element = $sc(raw);

      if (!element.is("[sc-part-of*=" + chrome.type.key() + "]")) {
        var attr = element.attr("sc-part-of");
        if (typeof(attr) == "undefined") {
          attr = "";
        }

        if (attr.length > 0) {
            attr += " ";
        }
      
        attr += chrome.type.key();
        element.attr("sc-part-of", attr);
      }

      var chromes = element.data("scChromes");
      if (!chromes) {
        chromes = new Array();
      }

      if ($sc.inArray(chrome, chromes) < 0) {
        chromes.push(chrome);
      }

      element.data("scChromes", chromes);     
    });
  },

  _parseElements: function() {
    /* if this is an orphan chrome that is being deleted, not do anything */
    if (!this._originalDOMElement || this._originalDOMElement.parent().length == 0) {
      return;
    }

    var elements = this.type.elements(this._originalDOMElement);
    
    this.element = elements.content;
    this._openingMarker = elements.opening;
    this._closingMarker = elements.closing;

    this._markElements();
  }
});﻿Sitecore.PageModes.ChromeControls = Base.extend({
  constructor: function () {
    var cssClass = Sitecore.PageModes.PageEditor.languageCssClass() + (Sitecore.PageModes.Utility.isIE ? " ie" : "");
    this.toolbar = $sc("<div class='scChromeToolbar " + cssClass + "'></div>"); 
   
    // we need this element to calculate real dimensions of toolbar. Since
    // the toolbar will change the position (top and left) on the page 
    // it's dimensions may be calculated incorrectly when it is docked to the page's border. 
    this.dummy = this.toolbar.clone().attr("id", "scDummyToolbar");
    this.dummy.prependTo(document.body);
    
    this.commands = $sc("<div class='scChromeControls'></div>");
    this._overlay = $sc("<div class='scControlsOverlay'></div>")
                    .click(function(e) {e.stop();})
                    .hide()
                    .appendTo(this.toolbar);

    this.commands.hide().click($sc.proxy(function(e) {
        this.hideMoreCommands();
        this.hideAncestors();
        this.triggerEvent("click");
        e.stop();        
      }, this));
                                      
    this.toolbar.append(this.commands);
    this.toolbar.appendTo(document.body);

    this.ancestorList = $sc("<div class='scChromeDropDown " + cssClass + "'></div>");
    this.ancestorList.hide().prependTo(document.body);

    this.moreCommands = $sc("<div class='scChromeDropDown " + cssClass + "'></div>");
    this.moreCommands.hide().prependTo(document.body);            
    
    this.positioningManager = new Sitecore.PageModes.PositioningManager();    
    Sitecore.PageModes.PageEditor.onWindowScroll.observe($sc.proxy(this.scrollHandler, this));
    Sitecore.PageModes.ChromeManager.chromeUpdating.observe($sc.proxy(function() {
        $sc(".scToolbarIndicator", this.commands)
          .delay(Sitecore.PageModes.ChromeOverlay.animationStartDelay)
          .fadeTo(0, 1);
        this.showOverlay();
    }, this));

    Sitecore.PageModes.ChromeManager.chromeUpdated.observe($sc.proxy(function() {
        $sc(".scToolbarIndicator", this.commands).stop(true).fadeTo(0, 0)       
        this.hideOverlay();        
    }, this));
        
    this.eventDispatcher = $sc({});   
  },
      
  activate: function() {
    this.toolbar.removeClass("scInvisible");
  },

  deactivate: function() {
    this.toolbar.addClass("scInvisible");
  },

  getCommandRenderer: function(click, chrome) {
    try {
      var command = Sitecore.PageModes.Utility.parseCommandClick(click);
      if (command && command.message) {
        var key = chrome.key() + ":" + command.message;
        var renderer = Sitecore.PageModes.ChromeControls.commandRenderers[key];
        if (renderer) {
          return renderer;
        }

        return Sitecore.PageModes.ChromeControls.commandRenderers[command.message];
      }
    }
    catch(e) {
      return null;
    }
  },
    
  hide: function() {
    this.chrome = null;
    this.dimensions = null;
    this.commands.hide();
    this.hideMoreCommands();
    this.hideAncestors();
    this.triggerEvent("hide");
    this.hideOverlay();
  },

  hideAncestors: function() {
    if (this.ancestorList.is(":visible")) {
      this.ancestorList.hide();
      this.commands.find(".scChromeComboButton").removeClass("scDdExpanded");      
    }     
  },

  hideMoreCommands: function() {
    if (this.moreCommands.is(":visible")) {
      this.moreCommands.hide();
      this.commands.find(".scChromeMoreSection").removeClass("scDdExpanded");      
    }  
  },

  observe: function(eventName, handler) {
    this.eventDispatcher.bind(Sitecore.PageModes.ChromeControls.eventNameSpace + eventName, handler);
  },

  stopObserving: function(eventName, handler) {
    this.eventDispatcher.unbind(Sitecore.PageModes.ChromeControls.eventNameSpace + eventName, handler);
  },

  triggerEvent: function(eventName) {
    this.eventDispatcher.trigger(Sitecore.PageModes.ChromeControls.eventNameSpace + eventName);
  },
  
  showAncestors: function() {
    if (!this.ancestorList.is(":visible")) {
      this.ancestorList.show();
      this.commands.find(".scChromeComboButton").addClass("scDdExpanded");      
    }
  },

  showMoreCommands: function() {
    if (!this.moreCommands.is(":visible")) {
      this.moreCommands.show();
      this.commands.find(".scChromeMoreSection").addClass("scDdExpanded");      
    }  
  },

  renderAncestors: function() {  
    this.ancestorList.update("");
    var ancestors = this.chrome.ancestors();
    for(var i = ancestors.length - 1; i >= 0; i--) {
      if(!ancestors[i].isFake()) {
        var level = ancestors.length - i - 1;
        this.ancestorList.append(this.renderAncestor(ancestors[i], level));
      }
    }

    return this.ancestorList;
  },

  renderAncestor: function(ancestor, level) {    
    var paddingValue = 16;
    var row = $sc("<a class='scChromeDropDownRow' href='#'></a>");
    if (level > 0) {          
      var levelConnection = $sc("<img src='/sitecore/shell/themes/standard/images/pageeditor/corner.gif' class='scLevelConnection' />");
      levelConnection.css("padding-left", (level - 1) * paddingValue + "px");      
      row.append(levelConnection);
    }   
       
    $sc("<img class='scChromeAncestorIcon' />").attr("src", ancestor.icon()).appendTo(row);                
    $sc("<span></span>").text(ancestor.displayName()).appendTo(row);
              
    row.mouseenter(function() {
      ancestor.showHover("ancestor menu mouseenter");
    });

    row.mouseleave(function() {
      ancestor.hideHover("ancestor menu mouseleave");
    });

    row.click($sc.proxy(function(e) {
      e.stop();      
      this.hideAncestors();
      Sitecore.PageModes.ChromeManager.select(ancestor);
    }, this));
    
    return row;
  },

  /*
  command:
    -- click
    -- header
    -- tooltip
    -- icon
  */
  renderCommand: function(command, chrome, isMoreCommand /*Defines if commnad appears in More dropDown*/ ) {           
    var renderer = this.getCommandRenderer(command.click, chrome.type);
    if (renderer) {
      var result = renderer.call(chrome.type, command, isMoreCommand, this);
      if (result) {
        return result;
      }

      if (result === null) {
        return null;
      }
    }

    return this.renderCommandTag(command, chrome, isMoreCommand);
  },

  renderCommandTag: function(command, chrome, isMoreCommand /*Defines if commnad appears in 'More' dropDown*/) {
    var tag = $sc("<a href='#' ></a>").attr("title", command.tooltip);
    tag.addClass(isMoreCommand ? "scChromeDropDownRow" : "scChromeCommand");
    var isDisabled = (chrome.isReadOnly() || command.disabled) && !command.alwaysEnabled;
    if (!command.click) {
      isDisabled = true;
    }
    var icon = !isDisabled ? command.icon : command.disabledIcon;
    $sc("<img />").attr({ src: icon, alt: command.tooltip }).appendTo(tag);    
    if (isMoreCommand) {
      $sc("<span></span>").text(command.header ? command.header : command.tooltip).appendTo(tag);      
    }

    if (isDisabled) {
      tag.addClass("scDisabledCommand");      
      return tag;
    }

    if (command.click.indexOf("chrome:") == 0) {
      var click = Sitecore.PageModes.Utility.parseCommandClick(command.click);
      if (command.type == "common") {
        tag.click(function(e) {       
          Sitecore.PageModes.ChromeManager.setCommandSender(chrome);
          Sitecore.PageModes.ChromeManager.handleCommonCommands(chrome, click.message, click.params);
        });
      }
      else {
        tag.click(function(e) {       
          Sitecore.PageModes.ChromeManager.setCommandSender(chrome);
          chrome.handleMessage(click.message, click.params);
        });
      }
    }
    else if (command.click.indexOf("javascript:") == 0) {      
      if ($sc.util().isNoStandardsIE()) {
        tag.get(0).onclick = new Function(command.click.replace("javascript:",""));
      }
      else {
        tag.get(0).setAttribute("onclick", command.click);
      }

      tag.mouseup(function(e) {        
        Sitecore.PageModes.ChromeManager.setCommandSender(chrome);        
      });
    }
    else {
      tag.click( function(e) {       
        Sitecore.PageModes.ChromeManager.setCommandSender(chrome);
        eval(command.click);        
      });
    }
    
    return tag;
  },

  renderExpandCommand: function() {
    var excludeFakeParents = true;

    var parent = this.chrome.parent(excludeFakeParents);

    if (!parent) {
      return;
    }

    var container = $sc("<span class='scChromeComboButton' ></span>");

    var tag = $sc("<a href='#' class='scChromeCommand'></a>").attr("title", Sitecore.PageModes.Texts.SelectParentElement.replace("{0}", parent.displayName()) );    
    tag.mouseenter(function() {
      parent.showHover("ancestor menu mouseenter");
    });

    tag.mouseleave(function() {
      parent.hideHover("ancestor menu mouseleave");
    });

    tag.click($sc.proxy(function(e) {
      e.stop();
      this.chrome.expand();
    }, this));

    var icon = $sc("<img />").attr({ src: "/sitecore/shell/~/icon/ApplicationsV2/16x16/nav_up_left_blue.png.aspx", alt: parent.displayName() });    
    tag.append(icon);

    container.append(tag);
    container.append(this.renderExpandDropdown());

    return container;
  },

  renderExpandDropdown: function() {
    var tag = $sc("<a class='scChromeCommand scExpandDropdown' href='#' ></a>").attr("title", Sitecore.PageModes.Texts.ShowAncestors);

    tag.click($sc.proxy(function(e) {
      e.stop();

      var sender = $sc(e.currentTarget);            
      var offset = sender.offset();
      var height = sender.outerHeight(); 
      this.showAncestorList({top: offset.top + height, left: offset.left});
    }, this));

    $sc("<img src='/sitecore/shell/Themes/Standard/Images/menudropdown_black9x8.png' />")
      .attr("alt", Sitecore.PageModes.Texts.ShowAncestors )
      .appendTo(tag);
   
    return tag;
  },

  renderMoreSection: function() {
    var template = [
      "<a href='#' class='scChromeCommand scChromeMoreSection' title='${texts.ShowMoreCommands}'>",
      "  <span class='scChromeCommandText'>${texts.More}</span>",
      "  <img src='/sitecore/shell/Themes/Standard/Images/menudropdown_black9x8.png' alt='${texts.ShowMoreCommands}' />",
      "</a>"
    ].join("\n");

    var tag = $sc.util().renderTemplate("sc-renderMoreSection", template, {
      texts: Sitecore.PageModes.Texts
    });

    tag.click($sc.proxy(function(e) {
      e.stop();
      var sender = $sc(e.currentTarget);
                  
      var offset = sender.offset();
      var height = sender.outerHeight();     
      this.showMoreCommandsList({top: offset.top + height, left:offset.left});
    }, this));
    
    return tag;
  },
   
  renderTitle: function() {
    var container = $sc("<div class='scChromeName'></div>");

    var tooltip = this.chrome.data.expandedDisplayName || this.chrome.displayName();

    var displayName = this.chrome.displayName();
    
    var isReadOnly = this.chrome.isReadOnly();
           
    var title = $sc("<span class='scChromeText'></span>")     
      .text($sc.truncate(displayName, this._maxDisplayNameLength))
      .appendTo(container);

    if (isReadOnly) {
      $sc("<span class='scReadonlyText'></span>").text("["+ Sitecore.PageModes.Texts.ReadOnly +"]").appendTo(container);
    }
    else {
      title.attr("title", tooltip);
    }

    $sc("<img class='scToolbarIndicator' src='/sitecore/shell/Themes/Standard/Images/PageEditor/toolbar_progress.gif' />")
      .css({opacity : 0.0})
      .appendTo(container);
            
    return container;
  },

  renderSeparator: function() {
    return $sc("<span class='scChromeCommandSectionDelimiter'>|</span>");
  },

  updateCommands: function() {
    this.hideOverlay();
    this.commands.show();    
    this.commands.update("");
    
    this.hideMoreCommands();
    this.moreCommands.update("");    

    /* first row - icon and name */   
    this.commands.append(this.renderTitle());

    /* second row - commands */
    var commandsRow = $sc("<div id='commandRow'></div>").appendTo(this.commands);
    var parent = this.chrome.parent();

    var hasCommands = false;
    var commandsCounter = 0;
    
    var commonCommands = [], commands = [], stickyCommands = [];     
    $sc.each(this.chrome.commands(), function () { 
      if (this.type == "common") {
        commonCommands.push(this);
        return;
      }

      if (this.type == "sticky") {
        stickyCommands.push(this);
        return;
      }
        
      commands.push(this);        
    });

    var insertionIdx = this._maxToolbarCommands - stickyCommands.length;
    var nonSeparatorsCount = 0;
    var ii = 0;
    for (ii; ii < commands.length; ii++) {
      if (commands[ii].type === "separator") {
        continue;
      }
      
      if (++nonSeparatorsCount >  insertionIdx) {        
        break;
      }
    }

    var args = [ii, 0].concat(stickyCommands);
    Array.prototype.splice.apply(commands, args);
               
    if (parent != null && parent.key() == "field") {
      var parentCommandsAdded = false;
      var commandClicks = $sc.map(commands, function() { return this.click; });

      $sc.each(parent.commands(), $sc.proxy(function(idx, command) {
        if (command.type != "common" && $sc.inArray(command.click, commandClicks) < 0) {          
          var res = this._addCommand(command, parent, commandsCounter);
          commandsCounter = commandsCounter + res;
          hasCommands = hasCommands || res;
          parentCommandsAdded = true;
        }
      }, this));

      if (parentCommandsAdded 
            && commands.length > 0 
            && commandsCounter < this._maxToolbarCommands /*at least one command will be added to toolbar*/ 
            && this._isSeparatorAcceptible()) {
        commandsRow.append(this.renderSeparator());
      }
    }
   
    $sc.each(commands, $sc.proxy(function(idx, command) {
      if (command.hidden) {
        return;
      }
     
      var res = this._addCommand(command, this.chrome, commandsCounter);
      commandsCounter = commandsCounter +  res;
      hasCommands = hasCommands || res;
    }, this));
        
    /* The "expand" section */
    var expandCommand = this.renderExpandCommand();
    if (expandCommand) {
      if (hasCommands && this._isSeparatorAcceptible()) {
        commandsRow.append(this.renderSeparator());
      }

      commandsRow.append(expandCommand);      
      hasCommands = true; 
    }
    
    /*The "more" section */
    $sc.each(commonCommands, $sc.proxy(function (i, c) {
      var idx = this._maxToolbarCommands;/*The command should appear in "More" dropdown */
      this._addCommand(c, this.chrome, idx); 
    }, this));

    if (this._hasMoreCommands()) {
      if (hasCommands && this._isSeparatorAcceptible()) {
        commandsRow.append(this.renderSeparator());
      }

      commandsRow.append(this.renderMoreSection());
    }

    if (commandsRow.children().length > 0) {
      commandsRow.append($sc("<div class='scClearBoth'></div>"));      
    }   
  },

  scrollHandler: function() {
    if (!this.commands.is(":visible") || this.chrome == null) return;
    this.triggerEvent("scroll");
    this.hideMoreCommands();
    this.hideAncestors();          
    var fixedPosition =  this.positioningManager.getFixedChromeRelativeElementPosition(this.dimensions == null ? this.toolbar.getDimensions() : this.dimensions, this.chrome);
    this.toolbar.css({ left: fixedPosition.left + 'px', top: fixedPosition.top + 'px' });    
  },

  show: function(chrome, duration) {
    if (this.chrome != chrome) {
      this.chrome = chrome;
      this.updateCommands();      
      this.dummy.update(this.toolbar.get(0).innerHTML);
      this.dimensions = {height : this.dummy.outerHeight(), width: this.dummy.outerWidth()};      
    }
        
    this.hideAncestors();
                
    var toolbarDimensions = this.dimensions == null ? 
                              {height: this.toolbar.outerHeight(), width: this.toolbar.outerWidth()} : null;
    var fixedPosition;
    if (duration) {          
      fixedPosition = this.positioningManager.getFixedChromeRelativeElementPosition(this.dimensions == null ? toolbarDimensions : this.dimensions, chrome);            
      this.toolbar.stop(true).animate({ left: fixedPosition.left + "px", top: fixedPosition.top + "px"}, duration);
    }
    else {
      this.commands.show();
      fixedPosition = this.positioningManager.getFixedChromeRelativeElementPosition(this.dimensions == null ? toolbarDimensions : this.dimensions, chrome);                        
      this.toolbar.css({ left: fixedPosition.left + "px", top: fixedPosition.top + "px" });      
    }

    this.triggerEvent("show");
  },

  showAncestorList: function(position) {
    if (this.ancestorList.is(":visible")) return;
    this.triggerEvent("dropdownshown");
    this.renderAncestors();
    this.showAncestors();   
    this.hideMoreCommands();
                  
    var fixedPosition = this.positioningManager.getFixedElementPosition(position.top, position.left, this.ancestorList);    
    this.ancestorList.css({ top: fixedPosition.top + 'px', left: fixedPosition.left + 'px' });     
  },

  showMoreCommandsList: function(position) {                  
    this.showMoreCommands();           
    this.triggerEvent("dropdownshown");
    var fixedPosition = this.positioningManager.getFixedElementPosition(position.top, position.left, this.moreCommands);    
    this.moreCommands.css({ top: fixedPosition.top + 'px', left: fixedPosition.left + 'px' });       
    this.hideAncestors();
  },
 
  _addCommand: function(command, chrome, index) {
    var isMoreCommand;

    if (command.type == "separator") {
      if (index < this._maxToolbarCommands && this._isSeparatorAcceptible()) {
        $sc("#commandRow", this.commands).append(this.renderSeparator());
      }

      return false;      
    }

    if (index >= this._maxToolbarCommands ) {
      isMoreCommand = true;
      var c = this.renderCommand(command, chrome, isMoreCommand);
      if (c) {
        this.moreCommands.append(c);
        return true;
      }
    }
    else {
      isMoreCommand = false;
      var c = this.renderCommand(command, chrome, isMoreCommand);
      if (c) {
        $sc("#commandRow", this.commands).append(c);
        return true;
      }      
    }

    return false;
  },

  _isSeparatorAcceptible: function() {    
    var commandsRow = $sc("#commandRow", this.commands);
    return commandsRow.length > 0
            && commandsRow.children().length > 0 
            && commandsRow.children(".scChromeCommandSectionDelimiter:last-child").length == 0; 
  },

  _maxToolbarCommands: 7,

  _maxDisplayNameLength: 40,

  _hasMoreCommands: function() {
    return this.moreCommands.children().length > 0;
  },

  hideOverlay: function() {
    this._overlay.hide();
  },

  showOverlay: function(dimensions) {
    var dims = dimensions;
    if (!dims) {
      dims = {};
      dims.height = this.commands.innerHeight();
      dims.width = this.commands.innerWidth();
    }
    
    this._overlay.css({width: dims.width + "px", height: dims.height + "px"});
    this._overlay.show();    
  }
},
{
  commandRenderers: {},
  eventNameSpace: "chromecontrols.",
  registerCommandRenderer: function(commandName, renderer, chromeType) {
    var key = chromeType != null ? chromeType.key() + ":" + commandName : commandName;
    Sitecore.PageModes.ChromeControls.commandRenderers[key] = renderer;
  }
});﻿// Hack described here http://www.telerik.com/community/forums/sharepoint-2007/full-featured-editor/paragraph-style-names-don-t-match-config.aspx
function OnClientSelectionChange(editor, args) {
  var tool = editor.getToolByName("FormatBlock");
  if (tool) {
    setTimeout(function () {
      var defaultBlockSets = [
        ["p", "Normal"],
        ["h1", "Heading 1"],
        ["h2", "Heading 2"],
        ["h3", "Heading 3"],
        ["h4", "Heading 4"],
        ["h5", "Heading 5"],
        ["menu", "Menu list"],
        ["pre", "Formatted"],
        ["address", "Address"]];

      var value = tool.get_value();

      var block = Prototype.Browser.IE
        ? defaultBlockSets.find(function (element) { return element[1] == value; })
        : [value];

      if (block) {
        var tag = block[0];
        var correctBlock = editor._paragraphs.find(function (element) { return element[0].indexOf(tag) > -1; });
        if (correctBlock) {
          tool.set_value(correctBlock[1]);
        }
      }
    }, 0);
  }
}

function OnClientModeChange(editor) {
    var url = window.location.protocol + '//' + window.location.hostname;
    var html = editor.get_html();
    var originalHtml = html;

    var lastIndexOf = window.location.pathname.lastIndexOf("/");
    var path = "";
    if (lastIndexOf !== -1) {
        path = window.location.pathname.substring(0, lastIndexOf);
    }

    if (path.indexOf("/") !== 0) {
        path = "/" + path;
    }

    var regexpWithPath = new RegExp(url + path, "gi");
    var regexpWithUrl = new RegExp(url, "gi");

    html = html.replace(regexpWithPath, "");
    html = html.replace(regexpWithUrl, "");

    if (html !== originalHtml) {
        editor.set_html(html);
        editor.saveClientState();
    }
}

function OnClientCommandExecuted(sender, args) {
  if (args.get_commandName() == "SetImageProperties") {
    replaceClearImgeDimensionsFunction();
  }
}

function replaceClearImgeDimensionsFunction(count) {
  if (!count) count = 0;
  setTimeout(function () {
      try {
          var selector = 'iframe[src^="Telerik.Web.UI.DialogHandler.aspx?DialogName=ImageProperties"]';
          $$(selector)[0].contentWindow.Telerik.Web.UI.Widgets.ImageProperties.prototype._clearImgeDimensions = function (image) {
              fixImageParameters(image, prefixes.split('|'));
          };
      } catch (e) {
          if (count < 10) {
              count++;
              replaceClearImgeDimensionsFunction(count);
          }
      }
  }, 500);
}

function fixImageParameters(image, mediaPrefixes) {

    var isMediaLink = false;

    for (var i = 0; i < mediaPrefixes.length; i++) {
        if (mediaPrefixes[i] === undefined || mediaPrefixes[i] === "") {
            continue;
        };

      var imageHost = decodeURI(window.location.protocol + "//" + window.location.hostname);

      if (new RegExp("^" + imageHost + "(.)*/" + decodeURI(mediaPrefixes[i]) + "*", "i").test(decodeURI(image.src))) {
          isMediaLink = true;
          break;
      };
    };

    if (!isMediaLink) { return; };

    _toQueryParams = function(href) {
        var result = {};

        var search = href.split("?")[1];

        if (search !== undefined) {
            var params = search.split("&");
            $sc.each(params, function(index, value) {
                var param = value.split("=");
                result[param[0]] = param[1];
            });
        };

        return result;
    };

    // This code corrects inconsistencies between image sizes set in style attribute, width and height attributes, w and h image parameters.
    var src = image.getAttribute("src");

    var params = _toQueryParams(src);

    var n = src.indexOf("?");
    if (n >= 0) {
        src = src.substr(0, n + 1);
    } else {
        src = src + "?";
    }

    for (var param in params) {
        if (params[param] === undefined || params[param] === "") {
            delete params[param];
        }
    }

    // if style
    if (image.style.height !== undefined && image.style.height !== "") {
        var height = image.style.height.replace("px", "");
        image.removeAttribute("height");
        params["h"] = height;
    }
    // else if attribute
    else if (image.attributes !== undefined && image.attributes["height"] !== undefined && image.attributes["height"] !== "") {
        image.style.height = image.attributes["height"].value + "px";
        params["h"] = image.attributes["height"].value;
    }
    // no style, no attribute
    else {
        delete params["h"];
    }

    // if style
    if (image.style.width !== undefined && image.style.width !== "") {
        var width = image.style.width.replace("px", "");
        image.removeAttribute("width");
        params["w"] = width;
    }
    // else if attribute
    else if (image.attributes !== undefined && image.attributes["width"] !== undefined && image.attributes["width"] !== "") {
        image.style.width = image.attributes["width"].value + "px";
        params["w"] = image.attributes["width"].value;
    }
    // no style, no attribute
    else {
        delete params["w"];
    }

    if ($sc.param(params) === "" && src.endsWith("?")) {
        src = src.substr(0, src.length - 1);
    } else {
        src = src + $sc.param(params);
    }

    image.setAttribute("src", src);
}

// Fix mentioned here http://www.telerik.com/community/forums/aspnet-ajax/editor/html-entity-characters-are-not-escaped-on-hyperlink-editor-email-subject.aspx
function OnClientPasteHtml(sender, args) {
  var commandName = args.get_commandName();
  var value = args.get_value();
  if (Prototype.Browser.IE && (commandName == "LinkManager" || commandName == "SetLinkProperties")) {
    if (/<a[^>]*href=['|"]mailto:.*subject=/i.test(value)) {
      var hrefMarker = 'href=';

      // quote could be ' or " depending on subject content
      var quote = value.charAt(value.indexOf(hrefMarker) + hrefMarker.length);
      var regex = new RegExp(hrefMarker + quote + 'mailto:.*subject=.*' + quote, 'i');
      var fixedValue = value.replace(regex, function (str) { return str.replace(/</g, "&lt;").replace(/>/g, "&gt;"); });
      args.set_value(fixedValue);
    }
} else if (commandName == "Paste") {
    // The StripPathsFilter() method receives as a parameter an array of strings (devided by a white space) that will be stripped from the absolute links.
    var relativeUrl = getRelativeUrl(); //returns the relative url.
    var domainUrl = window.location.protocol + '//' + window.location.host;
    if (relativeUrl) {
      var filter = new Telerik.Web.UI.Editor.StripPathsFilter([relativeUrl, domainUrl]); //strip the domain name from the absolute path

      var contentElement = document.createElement("SPAN");
      contentElement.innerHTML = value;
      var newElement = filter.getHtmlContent(contentElement);
      value = newElement.innerHTML;
      if (scForm.browser.isFirefox) {
        value = value.replace(/%7e\//ig, '~/');
      }

      args.set_value(value);  //set the modified pasted content in the editor
  }
  }

  if (Prototype.Browser.IE) {
    var helperIframe = $$("iframe[title^='Paste helper']:first")[0];
    if (helperIframe) {
        Element.setStyle(helperIframe, { width: 0, height: 0 });
    }
  }
}

function getRelativeUrl() {
  var result = window.location.href;
  if (result) {
    var query = window.location.search;
    if (query) {
      result = result.substring(0, result.length - query.length);
    }

    var slashPosition = result.lastIndexOf('/');
    if (slashPosition > -1) {
      result = result.substring(0, slashPosition + 1);
    }
  }

  return result;
}

function fixIeObjectTagBug() {
  var objects = Element.select($('Editor_contentIframe').contentWindow.document, 'object');
  var i;
  for (i = 0; i < objects.length; i++) {
    if (!objects[i].id || objects[i].id.indexOf('IE_NEEDS_AN_ID_') > -1) {
      objects[i].id = 'IE_NEEDS_AN_ID_' + i;
    }
  }
}﻿if (typeof(Sitecore.PageModes.Controls) == "undefined") {
  Sitecore.PageModes.Controls = {};
}

/**
* @class Represents context for rich controls
*/
Sitecore.PageModes.Controls.Context = Base.extend({
  /**
  * @constructor
  */
  constructor: function (chrome, chromeControls, command) {
    this.chrome = chrome;
    this.chromeControls = chromeControls;
    this.command = command;       
  },
  
  items: function () 
  {
    return [];
  },

  activeItem: function()
  {
    return null;
  }
});﻿if (typeof(Sitecore.PageModes.RichControls) == "undefined") {
  Sitecore.PageModes.RichControls = {};
}

Sitecore.PageModes.RichControls.Bar = Base.extend({
  /**
  * @constructor
  */
  constructor: function(panel, dropdown) {
    this.panel = panel;
    this.dropdown = dropdown;
    this.panel.events.bind("click.bar", $sc.proxy(function(e, nativeEvent) {
      this.showDropDown(nativeEvent); 
      this.panel.titleArea.addClass("scDdExpanded"); 
    }, this));
      
    this.positioningManager = new Sitecore.PageModes.PositioningManager();      
  },

  render : function(context) {    
    this._update(context);
    var panel = this.panel.render(context);
    return panel;
  },
  
  renderHidden: function(context, title, icon) {
    this._update(context);
    var tag = $sc("<a class='scChromeCommand' href='#' ></a>").attr("title", (title ? title : context.command.tooltip));
    $sc("<img />").attr({ src: (icon ? icon : context.command.icon)}).appendTo(tag);
    $sc("<img class='scDdArrow' src='/sitecore/shell/Themes/Standard/Images/menudropdown_black9x8.png' />").appendTo(tag);
    tag.append(this.panel.renderBadge(context));
    tag.click($sc.proxy(function(e) {this.showDropDown(e);this.button.addClass("scDdExpanded");}, this));
    this.button = tag;
    return tag;    
  },
  
  showDropDown: function(e) {    
    e.stop();
    var sender = $sc(e.currentTarget);            
    var offset = sender.offset();
    var height = sender.outerHeight();
    var fixedPosition = this.positioningManager.getFixedElementPosition(offset.top + height, offset.left, this.dropdown.dropDown); 
    this.dropdown.show({top: fixedPosition.top, left: fixedPosition.left});            
    
    if (this.chromeControls) {
      this.chromeControls.hideMoreCommands();
      this.chromeControls.hideAncestors();
    }
   },
   
   hideDropDown: function() {   
    if (this.button) {
      this.button.removeClass("scDdExpanded");
    }      
    
    if (this.panel.titleArea) {
      this.panel.titleArea.removeClass("scDdExpanded");
    }

    this.dropdown.hide();
  },
  
  _update: function(context) {
     if (!this.handlersAttached) {
      this.handler = $sc.proxy(this.hideDropDown, this);
      context.chromeControls.observe("hide", this.handler);
      context.chromeControls.observe("show", this.handler);      
      context.chromeControls.observe("dropdownshown",this.handler);
      context.chromeControls.observe("click", this.handler);
      context.chromeControls.observe("scroll",this.handler);
      this.handlersAttached = true;
    }

    this.chromeControls = context.chromeControls;
    this.dropdown.update(context);
  }            
});﻿if (typeof(Sitecore.PageModes.RichControls) == "undefined") {
  Sitecore.PageModes.RichControls = {};
}

/**
* @class Base class for bar panel
*/
Sitecore.PageModes.RichControls.Panel = Base.extend({  
  constructor: function(cssClass) {          
    this.cssClass = cssClass;
    this.maxTitleLength = 30;
    this.events = $sc({});
  },
 
  createDom: function() {
    var template = [
    "<div class='scBar {{if cssClass}} ${cssClass} {{/if}}'>",
    "  <div class='scBarLeftSection'>",
    "    <div class='scLabel'></div>",
    "    <div class='scPrevNextContainer'>",
    "      <img class='scPrev' src='/sitecore/shell/themes/standard/images/pageeditor/prev.png' />",
    "      <img class='scNext' src='/sitecore/shell/themes/standard/images/pageeditor/next.png' />",
    "    </div>",
    "  </div>",
    "  <a href='#' class='scTitleArea'>",
    "    <div class='scTitleContainer'>",
    "      <div class='scTitleAnimationContainer'>",
    "        <span class='scTitle'></span>",
    "      </div>",
    "    </div>",
    "  </a>",
    "  <div class='scClearBoth'></div>",
    "</div>"
    ].join("\n");

    this.panel = $sc.util().renderTemplate("sc-richControls.Panel", template, this);

    this.label = this.panel.find(".scLabel");
    this.prev = this.panel.find(".scPrev").click($sc.proxy(this.prevClick, this));
    this.next = this.panel.find(".scNext").click($sc.proxy(this.nextClick, this));

    this.titleArea = this.panel.find(".scTitleArea").click($sc.proxy(function(e) { 
      this.events.triggerHandler("click.bar", [e]);
    }, this));
    
    this.title = this.panel.find(".scTitle");
  },
       
  changeItem: function(item, direction) {
    var shift = 20;
    if (direction) {
      shift = direction * shift;
    }
       
    this.currentName = $sc.truncate(item.name, this.maxTitleLength);
    this.title.animate({"top" : shift + "px"}, 100)
      .animate({"left": "-500px"}, 0, $sc.proxy(function() {          
          this.title.html(this.currentName);                    
      }, this))
      .animate({"left": "0px", "top" : (- shift) + "px"}, 0)
      .animate({top: "0px"}, 100);
  },
 
  nextClick: function(e) {
    e.stop();
    
    if (!this.nextItem) {     
      return;
    }
    
    this.changeItem(this.nextItem, -1); 
    this.events.triggerHandler("change.bar", [this.nextItem, this.chrome]);    
  },
   
  prevClick: function(e) {
    e.stop();
    if (!this.prevItem) {      
      return false;
    }
       
    this.changeItem(this.prevItem, 1);
    this.events.triggerHandler("change.bar", [this.prevItem, this.chrome]);
  },
 
  render: function(context) {        
    var activeItem = context.activeItem();
    if (!activeItem) {
      return;
    }

    var items = context.items();
    if (!items) {
      return;
    }

    var idx = $sc.inArray(activeItem, items);
    if (idx < 0) {
      return;
    }
    
    this.chrome = context.chrome;
       
    this.createDom();              
    this.configureLabel(context);
    this.configureTitleArea(context);   
    
    this.prevItem = items[idx - 1];
    this.nextItem = items[idx + 1];
    if (!this.prevItem) {
      this.prev.addClass("scDisabled");
    }

    this.configurePrev(context);   
    if (!this.nextItem) {
      this.next.addClass("scDisabled");
    }

    this.configureNext(context);            
    var name = $sc.truncate(activeItem.name, this.maxTitleLength)
    this.currentName = name
    this.title.stop(true).html(name);                   
    return this.panel;        
  },

  renderBadge: function (context) {    
    var badge = $sc("<span class='scChromeBadge'></span>");        
    return badge;
  },

  configureLabel: function(context) {   
  },

  configureNext: function(context) {
  },

  configurePrev: function(context) {
  },

  configureTitleArea: function(context) {    
  } 
});﻿if (typeof(Sitecore.PageModes.Personalization) == "undefined") {
  Sitecore.PageModes.Personalization = {};
}

/**
* @static
* @class Represents the HTML cache
*/
Sitecore.PageModes.Personalization.RenderingCache = new function() {
  this.innerCache = new Sitecore.PageModes.Cache();

  /**
  * @description Gets the key for the cache
  * @param {Sitecore.PageModes.ChromeTypes.Rendering} renderingChrome The rendering chrome. 
            @see Sitecore.PageModes.ChromeTypes.Rendering
  * @param {Sitecore.PageModes.Personalization.Condition|String} condition The condition (or condition id)
            @see Sitecore.PageModes.Personalization.Condition
  * @returns {String} The key
  */
  this.getConditionKey = function(renderingChrome, condition) {
    if (!renderingChrome || renderingChrome.key() != "rendering") {
      return null;
    }

    if (!condition) {
      return null;
    }

    return renderingChrome.type.uniqueId() + "$" + ($sc.type(condition) === "string" ? condition : condition.id);
  };

   /**
  * @description Addes to cache the html of the specified rendering in specified contition
  * @param {Sitecore.PageModes.ChromeTypes.Rendering} renderingChrome The rendering chrome. 
            @see Sitecore.PageModes.ChromeTypes.Rendering
  * @param {Sitecore.PageModes.Personalization.Condition|String} condition The condition (or condition id)
            @see Sitecore.PageModes.Personalization.Condition
  * @returns {Boolean} The value indicating if the instance was succesfully added to the cache 
  */
  this.cacheCondition = function (renderingChrome, condition, value) {
    var key = this.getConditionKey(renderingChrome, condition);
    if (key !== null) {
      this.innerCache.setValue(key, value);
      return true;
    }
    
    return false;    
  };

  /**
  * @description Gets the html of the specified rendering in specified contition
  * @param {Sitecore.PageModes.ChromeTypes.Rendering} renderingChrome The rendering chrome. 
            @see Sitecore.PageModes.ChromeTypes.Rendering
  * @param {Sitecore.PageModes.Personalization.Condition|String} condition The condition (or condition id)
            @see Sitecore.PageModes.Personalization.Condition
  * @returns {String} The html 
  */
  this.getCachedCondition = function(renderingChrome, condition) {
    var key = this.getConditionKey(renderingChrome, condition);
    if (key !== null) {
      return this.innerCache.getValue(key);      
    }
    
    return null; 
  };

  /**
  * @description Removes the html of the specified rendering in specified contition from the cache
  * @param {Sitecore.PageModes.ChromeTypes.Rendering} renderingChrome The rendering chrome. 
            @see Sitecore.PageModes.ChromeTypes.Rendering
  * @param {Sitecore.PageModes.Personalization.Condition|String} condition The condition (or condition id)
            @see Sitecore.PageModes.Personalization.Condition  
  */
  this.removeCondition = function(renderingChrome, condition) {
    var key = this.getConditionKey(renderingChrome, condition);
    if (key !== null) {
      this.innerCache.clear(key);      
    }
  };

  /**
  * @description Removes all instances from the cache
  */
  this.clear = function() {
    this.innerCache.clearAll();
  };

  Sitecore.PageModes.PageEditor.onSave.observe($sc.proxy(this.clear, this));
};﻿if (typeof(Sitecore.PageModes.Personalization) == "undefined") {
  Sitecore.PageModes.Personalization = {};
}

/**
* @class Represents personalization condition
*/
Sitecore.PageModes.Personalization.Condition = Base.extend({
  /**
  * @constructor
  * @param {String} [id] The unique id of the condition (id attribute of the rule in rendering definition)
  *                 This parameter should be omitted for the default condition.
  * @param {String} [name="Default"] The name of the condition
  * @param {Boolean} [isActive="false"] The name of the condition
  */
  constructor:function(id, name, isActive) {
    this.id = id ? id : Sitecore.PageModes.Personalization.Condition.defaultId;    
    this.name = name ? name : "Default condition";
    this.isActive = !!isActive; 
  },

  /**
  * @description Defines if the condition is a default one
  * @retruns {Boolean} The value indicating if the condition is a default one
  */
  isDefault:function() {
    return this.id == Sitecore.PageModes.Personalization.Condition.defaultId;
  },

  /**
  * @description Renders the condition presentation into the specified destination
  * @param destination The node which will be a prent for condition presentation
  */
  renderCondition: function(destination) {    
    if (this.isDefault()) {      
      destination.html(Sitecore.PageModes.Texts.Analytics.DefaultConditionDescription);
      return;
    }

    if (typeof(this._cachedDescription) != "undefined") {      
      destination.html(this._cachedDescription);
      return;
    }

    var conditionDefinition = Sitecore.LayoutDefinition.GetConditionById(this.id);
    if (!conditionDefinition) {
      destination.html("");
      return;
    }

    destination.addClass("scConditionDescriptionUpdating");
    destination.html("");
    $sc.ajax({
      type: "POST",
      dataType: "html",
      url: "/sitecore/shell/Applications/Page%20Modes/Personalization/GetConditionDescription.ashx",
      context: this,
      data: { condition: JSON.stringify(conditionDefinition) },
      global: false,
      success: function (data) {
        var span = document.createElement("span");
        span.innerHTML = data;
        var innerText = $sc.browser.msie ? span.innerText : span.textContent;
        delete span;
        this._cachedDescription = $sc.truncate(innerText, 60);       
        destination.html(this._cachedDescription);
        destination.removeClass("scConditionDescriptionUpdating");
      },

      error:function(xhr, textStatus, errorThrown) {
        // TODO: display error message
        destination.html("");
        destination.removeClass("scConditionDescriptionUpdating");
        console.error(textStatus);
      }
    });    
  }
},
{
  /**
  * @description The short id of the default condition
  */
  defaultId: "{00000000-0000-0000-0000-000000000000}"
}
);﻿if (typeof(Sitecore.PageModes.Personalization) == "undefined") {
  Sitecore.PageModes.Personalization = {};
}

/**
* @static
* @class Represents the persistent(cookie based) page-level storage for states of rendering condition.
* @description Persists the RenderingUniqueId:ConditionId pairs in cookie. Default conditions are omitted.
*/
Sitecore.PageModes.Personalization.ConditionStateStorage = new function() {
  this.storage = null;
  this.cookieName = "pe_conditions_";
  this.keyValueDelimiter = "@";
  this.pairsDelimiter = "_";
    
  /**
  * @description Clears the storage
  */
  this.clear = function() {
    this.storage = {};
  };

  /**
  * @description Removes the storage cookies related to other pages
  */
  this.deleteOtherPageStorage = function() {
    var cookieSet = document.cookie;
    if (cookieSet) {
      var cookies = cookieSet.split(";");
      var currentPageCookieName = this.getCookieName();
      for (var i = 0; i < cookies.length; i++) {
        var cookie = $sc.trim(cookies[i]);
        if (cookie.indexOf(this.cookieName) === 0 && cookie.indexOf(currentPageCookieName) !== 0) {
          var name = cookie.split("=")[0];
          if (name) {
            $sc.util().removeCookie(name);
          }
        }
      } 
    }
  };

  /**
  * @description Defines if the specified condition of the specified rendering has active state in the storage
  * @param {String} renderingId - the renderings unique id
  * @param {String} conditionId - the condition id
  * @return {Boolean} The value indicating if rendering is active
  */
  this.isConditionActive = function(renderingId, conditionId) {
    if (!this.storage) {
      this.populateStorage();
    }

    return this.storage[renderingId] === conditionId;
  };

  /**
  * @description Gets the name of the cookie to store the values in
  * @return {String} The cookie name
  */
  this.getCookieName = function() {
    var itemId = Sitecore.PageModes.PageEditor.itemId();
    var lang = Sitecore.PageModes.PageEditor.language();
    return this.cookieName + itemId + "_" + lang;
  };

  /**
  * @description Parses thes cookie value
  * @return {Object} The renderingid-conditionid HashTable 
  */
  this.parse = function(value) {
    var result = {}, parts, renderingId, conditionId;
    var pairs = value.split(this.pairsDelimiter);
    for (var i = 0; i < pairs.length; i++) {
      parts = pairs[i].split(this.keyValueDelimiter);
      renderingId = parts[0];
      conditionId = $sc.toId(parts[1]);
      
      if (renderingId && conditionId) {
        result[renderingId] = conditionId;
      }
    }

    return result;
  };

  /**
  * @description Popupates the storage from the cookie
  */
  this.populateStorage = function() {    
    var cookieName = this.getCookieName();
    var cookieValue = $sc.util().getCookie(cookieName);
    if (cookieValue) {
      this.storage = this.parse(cookieValue);
    }
    else {
      this.storage = {};
    }
  };

  /**
  * @description Removes the key-value pair for the specified rendering from the storage
  * @param {String} renderingId The rendering unique Id
  */
  this.remove = function(renderingId) {
    if (this.storage) {
      delete this.storage[renderingId];
    }
  };

  /**
  * @description Saves the storage to cookie
  */
  this.save = function() {
    if (!Sitecore.PageModes.PageEditor.isAnalyticsEnabled()) {
      return;
    }

    var cookieName = this.getCookieName();
    var value = this.serialize(true/*Default condition shouldn't be saved in a cookie*/);       
    if (value) {
      $sc.util().setCookie(cookieName, value, "");
    }
    else {
      $sc.util().removeCookie(cookieName);
    }
  };

  /**
  * @description Serializes the storage to a string
  * @param {Boolean} omitDefault - If set to true omits default condition while serializing
  * @return {String} The serialized storage
  */
  this.serialize = function(omitDefault) {
    if (this.storage) {
      var result = "";
      for (var renderingId in this.storage) {
        var conditionId = this.storage[renderingId];
        if (omitDefault && conditionId === Sitecore.PageModes.Personalization.Condition.defaultId) {
          continue;
        }

        if (result) {
          result += this.pairsDelimiter;
        }

        result += (renderingId + this.keyValueDelimiter + $sc.toShortId(conditionId));
      }
      
      return result;
    }

    return null;
  };

  /**
  * @description Sets the sepcified condition as an active one for the specified rendering
  * @param {String} renderingId - the renderings unique id
  * @param {String} conditionId - the condition id
  */
  this.setConditionActive = function(renderingId, conditionId) {
    if (!this.storage) {
      this.populateStorage();
    }

    this.storage[renderingId] = conditionId;
  };

  Sitecore.PageModes.PageEditor.onSave.observe($sc.proxy(this.save, this));
  $sc(window).load($sc.proxy(this.deleteOtherPageStorage, this)); 
};﻿if (typeof(Sitecore.PageModes.Personalization) == "undefined") {
  Sitecore.PageModes.Personalization = {};
}

/**
* @class Represents context fro rendering personalization controls
*/
Sitecore.PageModes.Personalization.ControlsContext = Sitecore.PageModes.Controls.Context.extend({
  /**
  * @constructor
  */
  constructor: function (chrome, chromeControls, command) {
    this.base(chrome, chromeControls, command);  
    if (this.chrome.type.getConditions) {
      this.conditions = chrome.type.getConditions();
    }
    else {
      this.conditions = [];
    }
  },

  /**
  * @description Get the currenty active condition
  * @return {Object} The object containing the condition and its position (1-based) in the condition list
  */
  getActiveCondition: function() {
    var idx = -1;
    var selectedCondition = $sc.first(this.conditions, function(i) { if (this.isActive) { idx = i; return true;}});
    return {condition: selectedCondition, position: idx + 1};
  },

  items: function() {
    return this.conditions;  
  },

  activeItem: function() {
    var activeCondition = this.getActiveCondition();
    return activeCondition.condition;
  }
});﻿if (typeof(Sitecore.PageModes.Personalization) == "undefined") {
  Sitecore.PageModes.Personalization = {};
}

/**
* @class Reperesents personalization bar
*/
Sitecore.PageModes.Personalization.Panel = Sitecore.PageModes.RichControls.Panel.extend({    
   /**
  * @constructor
  */
  constructor: function(cssClass) {          
    this.base(cssClass);
    this.events.bind("change.bar", function(e, condition, chrome) {
      Sitecore.PageModes.ChromeManager.setCommandSender(chrome);
      chrome.handleMessage("chrome:personalization:conditionchange", {id: condition.id});
    });
  },
   
  configureLabel: function(context) {
    var activeCondition = context.getActiveCondition();
    var condition = activeCondition.condition;
    var position = activeCondition.position;
    this.label.text(position + "/" + context.conditions.length);
    if (condition.isDefault()) {      
      this.label.attr("title", $sc.formatString(Sitecore.PageModes.Texts.Analytics.DefaultConditionActive));      
    }
    else {
      this.label.addClass("scActive");
      this.label.attr("title", $sc.formatString(Sitecore.PageModes.Texts.Analytics.CurrentActiveConditions, position));      
    }
  },

  configureNext: function(context) {
    if (this.next.hasClass("scDisabled")) {
      this.next.attr("title", "");     
    }
    else {
      this.next.attr("title", Sitecore.PageModes.Texts.Analytics.ActivateNextCondition);
    }
  },

  configurePrev: function(context) {
    if (this.prev.hasClass("scDisabled")) {
      this.prev.attr("title", "");     
    }
    else {
      this.prev.attr("title", Sitecore.PageModes.Texts.Analytics.ActivatePreviousCondition);
    }
  },

  configureTitleArea: function(context) {
    var activeCondition = context.getActiveCondition();
    var condition = activeCondition.condition;
    if (condition.isDefault()) {            
      this.titleArea.attr("title", Sitecore.PageModes.Texts.Analytics.DefaultPersonalizationConditionActive);
    }
    else {      
      this.titleArea.attr("title", $sc.formatString(Sitecore.PageModes.Texts.Analytics.PersonalizationConditionActive, condition.name));
    }    
  },

  renderBadge: function (context) { 
    var badge = this.base(context);
    var activeCondition = context.getActiveCondition();      
    if (!activeCondition.condition) {
      return badge;
    }

    badge.text(activeCondition.position + "/" + context.conditions.length);
    if (!activeCondition.condition.isDefault()) {
       badge.addClass("scActive");
    }
    return badge;
  }
});﻿if (typeof(Sitecore.PageModes.Personalization) == "undefined") {
  Sitecore.PageModes.Personalization = {};
}

 /**
 * @class The personalization DropDown.
 */
Sitecore.PageModes.Personalization.DropDown = Base.extend({
  /**
  * @constructor
  */
  constructor: function () {
    var cssClass = Sitecore.PageModes.PageEditor.languageCssClass() + (Sitecore.PageModes.Utility.isIE ? " ie" : "");
    var template = [
    "<div class='scChromeDropDown scPersonalization " + cssClass + "'>",
    "  <div class='scHeader'>${texts.Analytics.SelectedCondition}</div>",
    "  <div class='scSubHeader'></div>",
    "  <div class='scConditions'></div>",
    "  <div class='scHeader'>${texts.Analytics.AvailableConditions}</div>",
    "  <div class='scItemsList'></div>",
    "  <a class='scEditButton'>",
    "    <div><img src='/sitecore/shell/~/icon/PeopleV2/16x16/users3_edit.png' /></div>",
    "    ${texts.Analytics.EditConditions}",
    "  </a>",
    "</div>",
    ].join("\n");

    this.dropDown = $sc.util().renderTemplate("sc-personalizationDropdown", template, { texts: Sitecore.PageModes.Texts });

    this.dropDown.hide().click(function(e) {
      if (e.target.className == "scEditButton") {
        return;
      }
        
      e.stop();
    });

    this._conditionHeader = this.dropDown.find(".scSubHeader");
    this._conditions = this.dropDown.find(".scConditions");
    this._conditionsList = this.dropDown.find(".scItemsList");
    this._editButton = this.dropDown.find(".scEditButton");

    this.dropDown.prependTo(document.body);
  },

  /**
  * @description Resets inner controls
  */
  clear: function() {   
    this._conditionsList.html("");
    this._editButton.unbind("click");
    this._editButton.removeClass("scDisabled");  
  },

  /**
  * @description Hides the dropdown
  */
  hide:function() {
    this.dropDown.hide();
  },

  /**
  * @description Shows the dropdown in specific position
  * @param {Object} position. The coordinates of the topleft corner of the dropdown. 
  */
  show: function(position) {
    if (this.currentCondition) {
      this.currentCondition.renderCondition(this._conditions);
    }

    this.dropDown.css({top: position.top + "px", left: position.left + "px"});
    this.dropDown.show();   
    
    var activeCondition = this._conditionsList.children(".scActiveListItem:eq(0)");
    if (activeCondition) {
      var top = activeCondition.position().top;
      var height = activeCondition.outerHeight();
      var listHeight = this._conditionsList.height();
      if (top + height > listHeight) {
        var scrollPosition = this._conditionsList.scrollTop() + top;
        this._conditionsList.scrollTop(scrollPosition);
      }
    }
  },

  /**
  * @description Renders condition for conditions list
  * @param {Sitecore.PageModes.Chrome} chrome The context chrome. @see Sitecore.PageModes.Chrome
  * @param {Sitccore.PageModes.Personalization.Condition} condition The condition. @see Sitccore.PageModes.Personalization.Condition
  * @returns {Node} The node presenting the condition in a list
  */
  renderCondition: function(chrome, condition, idx) {
    var prefix = (idx + 1) + ".&nbsp;"
    var maxLength = 30;
    var tag = $sc("<a href='#'></a>").addClass(condition.isActive ? "scActiveListItem" : "scListItem").html(            
      $sc.truncate(prefix + condition.name, maxLength + prefix.length));

    tag.attr("title", condition.name);
    var c = chrome;
    if (condition.isActive) {      
      tag.click(function(e) {e.stop();});
    }
    else {
      tag.click(function(e) {
        Sitecore.PageModes.ChromeManager.setCommandSender(c);
        c.handleMessage("chrome:personalization:conditionchange", {id: condition.id});        
      });
    }

    return tag;
  },

  /**
  * @description Updates inner controls
  * @param {Sitecore.Page.Modes.Presonalization.ControlsContext} context The controls context.
  *        @see Sitecore.Page.Modes.Presonalization.ControlsContext
  */
  update: function(context) {
    this.clear();    
    
    var activeCondition = context.getActiveCondition();   
    var command = context.command;
    var chrome = context.chrome;
    
    if (!Sitecore.PageModes.PageEditor.isPersonalizationAccessible()) {
      this._editButton.click(function(e) { e.stop();});
      this._editButton.addClass("scDisabled");         
    }
    else if (command.click.indexOf("chrome:") == 0) {      
      var click = Sitecore.PageModes.Utility.parseCommandClick(command.click);      
      this._editButton.click(function(e) {       
          Sitecore.PageModes.ChromeManager.setCommandSender(chrome);
          chrome.handleMessage(click.message, click.params);
        });
    }
    
    this.currentCondition = activeCondition.condition;
    if (this.currentCondition) {
      this._conditionHeader.html(activeCondition.position + ".&nbsp;" + activeCondition.condition.name);
    }

    for (var i = 0; i < context.conditions.length; i++) {
      this._conditionsList.append(this.renderCondition(context.chrome, context.conditions[i], i)); 
    }        
  }
});﻿if (typeof(Sitecore.PageModes.Testing) == "undefined") {
  Sitecore.PageModes.Testing = {};
}

if (typeof(Sitecore.PageModes.Testing) == "undefined") {
  Sitecore.PageModes.Testing = {};
}

Sitecore.PageModes.Testing.Panel = Sitecore.PageModes.RichControls.Panel.extend({    
   /**
  * @constructor
  */
  constructor: function(cssClass) {          
    this.base(cssClass);
    this.events.bind("change.bar", function(e, item, chrome) {
      Sitecore.PageModes.ChromeManager.setCommandSender(chrome);
      chrome.handleMessage("chrome:testing:variationchange", {id: item.id});
    });
  },
   
  configureLabel: function(context) {
    var activeVariation = context.activeItem();
    if (!activeVariation) {
      return;
    }

    var idx = $sc.inArray(activeVariation, context.items());
    if (idx < 0) {
      return;
    }
       
    var varLabel = String.fromCharCode(65 + context.items().length - idx -1);
    this.label.text(varLabel);
    this.label.attr("title", $sc.formatString(Sitecore.PageModes.Texts.Analytics.VariationName, varLabel));         
  },

  configureNext: function(context) {   
     if (this.next.hasClass("scDisabled")) {
      this.next.attr("title", "");     
    }
    else {
      this.next.attr("title", Sitecore.PageModes.Texts.Analytics.ActivateNextVariation);
    }    
  },

  configurePrev: function(context) {    
    if (this.prev.hasClass("scDisabled")) {
      this.prev.attr("title", "");     
    }
    else {
      this.prev.attr("title", Sitecore.PageModes.Texts.Analytics.ActivatePreviousVariation);
     }    
  },

  configureTitleArea: function(context) {
    var activeVariation = context.activeItem();
    if (!activeVariation) {
      return;
    }
    
    this.titleArea.attr("title", $sc.formatString(Sitecore.PageModes.Texts.Analytics.VariationActive, activeVariation.name));
  },

  renderBadge: function (context) { 
    var badge = this.base(context);
    badge.addClass("scTestingBadge");
    var activeVariation = context.activeItem();      
    if (!activeVariation) {
      return badge;
    }

    var idx = $sc.inArray(activeVariation, context.items());
    if (idx < 0) {
      return badge;
    }

    badge.text(String.fromCharCode(65 + idx));   
    return badge;
  }
});﻿if (typeof(Sitecore.PageModes.Testing) == "undefined") {
  Sitecore.PageModes.Personalization = {};
}

/**
* @class Represents context fro rendering personalization controls
*/
Sitecore.PageModes.Testing.ControlsContext = Sitecore.PageModes.Controls.Context.extend({
  /**
  * @constructor
  */
  constructor: function (chrome, chromeControls, command) {
    this.base(chrome, chromeControls, command);  
    if (this.chrome.type.getVariations) {
      this.variations = chrome.type.getVariations();
    }
    else {
      this.variations = [];
    }
  },
  
  items: function() {
    return this.variations;  
  },

  activeItem: function() {    
    return $sc.first(this.variations, function() { return this.isActive;});
  }
});﻿if (typeof(Sitecore.PageModes.Testing) == "undefined") {
  Sitecore.PageModes.Testing = {};
}

 /**
 * @class The personalization DropDown.
 */
Sitecore.PageModes.Testing.DropDown = Base.extend({
  /**
  * @constructor
  */
  constructor: function() {
    var cssClass = Sitecore.PageModes.PageEditor.languageCssClass() + (Sitecore.PageModes.Utility.isIE ? " ie" : "");
    var template = [
      "<div class='scChromeDropDown scTesting " + cssClass + "'>",
      "  <div class='scHeader'>${texts.Analytics.SelectedVariation}</div>",
      "  <div class='scSubHeader'></div>",
      "  <div class='scHeader'>",
      "  {{if (displayValue == true)}}",
      "  <span class='scValueLabel'>${texts.Analytics.Value}</span>",
      "  {{/if}}",
      "  ${texts.Analytics.AvailableVariations}",
      "  </div>",
      "  <div class='scItemsList'>",
      // Inner container is needed to fix the problem with scroll bar and table width=100% in IE 7
      "    <div style='zoom:1'>",
      "      <table cellspacing='0' cellpadding='0' class='scVariations'></table>",
      "    </div>",
      "  </div>",
      "  <a class='scEditButton ${editButtonClass}'>",
      "    <div><img src='/sitecore/shell/~/icon/SoftwareV2/16x16/breakpoints.png' /></div>",
      "    ${texts.Analytics.EditVariations}",
      "  </a>",
      "</div>"
    ].join("\n");

    this.dropDown = $sc.util().renderTemplate("sc-testingDropdown", template, { 
      texts: Sitecore.PageModes.Texts,
      editButtonClass: Sitecore.PageModes.PageEditor.isTestRunning() ? "scDisabled" : "",
      displayValue: Sitecore.PageModes.PageEditor.isTestRunning()
    }).hide();

    this._variationHeader = this.dropDown.find(".scSubHeader");
    this._variationsList = this.dropDown.find(".scItemsList");
    this._variations = this._variationsList.find("table").click($sc.proxy(this._clickHandler, this));
    this._editButton = this.dropDown.find(".scEditButton");

    this.dropDown.click(function(e) {                
      if (e.target.className == "scEditButton") {
        return;
      }
       
      e.stop();
    });

    if (Sitecore.PageModes.PageEditor.isTestingAccessible()) {
      this._editButton.click($sc.proxy(this._editButtonClick, this));
    }
    else {
      this._editButton.click(function(e) {e.stop();});
      this._editButton.addClass("scDisabled");
    }

    this.dropDown.prependTo(document.body);
  },
  
  hide:function() {
    this.dropDown.hide();
  },
 
  show:function(position) {   
    this.dropDown.css({top: position.top + "px", left: position.left + "px"});
    this.dropDown.show();
    var activeVariation = this._variations.find(".scActiveListItem:eq(0)");
    if (activeVariation) {
      var top = activeVariation.position().top;
      var height = activeVariation.outerHeight();
      var listHeight = this._variationsList.height();
      if (top + height > listHeight) {
        var scrollPosition = this._variationsList.scrollTop() + top;
        this._variationsList.scrollTop(scrollPosition);
      }
    }       
  },
  
  update: function(context) {   
    var activeVariation = context.activeItem();
    if (!activeVariation) {
      return;
    }

    var idx = $sc.inArray(activeVariation, context.items());
    if (idx < 0) {
      return;
    }
                   
    this._chrome = context.chrome;
    this._command = context.command;
    this._variationHeader.html(String.fromCharCode(65 + context.items().length - idx -1) + ".&nbsp;" + activeVariation.name);
    var html = this._getVariationsHTML(context.items());
    this._variations.html(html);           
  },

  _clickHandler: function(evt) {
    var variation = $sc(evt.target).closest(".scListItem");
    variationId = null;
    if (variation.length > 0) {
      variationId = variation.attr("data-variation-id");
    }

    if (variationId && this._chrome) {
      Sitecore.PageModes.ChromeManager.setCommandSender(this._chrome);
      this._chrome.handleMessage("chrome:testing:variationchange", {id: variationId}); 
    }
  },

  _editButtonClick: function(evt) {
    var sender = $sc(evt.currentTarget);
    if (sender.hasClass("scDisabled")) {
      evt.stop();
      return;
    }

    if (this._chrome && this._command) {
      if (this._command.click.indexOf("chrome:") !== 0) {
        return;
      }

      var click = Sitecore.PageModes.Utility.parseCommandClick(this._command.click); 
      Sitecore.PageModes.ChromeManager.setCommandSender(this._chrome);
      this._chrome.handleMessage(click.message, click.params);
    }
  },
  
  _getVariationsHTML: function(variations) {
    var maxLength = 28;
    var renderBars = Sitecore.PageModes.PageEditor.isTestRunning();
    var result = "";
    var max = -1, width = 0, barCssClass = "scValueBarInner",l;
    
    $sc.each(variations, function() {
      if (this.value != null && this.value > max) max = this.value;
    });

    if (max <= 0) {
      max = 1;
    }

    l = variations.length;
    for (var i = 0; i < l; i++) {
      result += "<tr>";
      var cssClass = "scListItem";
      if (variations[i].isActive) {
        cssClass = "scActiveListItem";
      } 
      result += "<td class='" + cssClass + "' data-variation-id='" + variations[i].id +"'>";
      result += String.fromCharCode(65 + l - i - 1) + ".&nbsp;" +  $sc.truncate(variations[i].name, 28);
      result += "</td>";      
      
      if (renderBars) {
        result += "<td class='scVariationValue'>";
        result += "<div class='scValueBar'>";
        result += "<span style='position:absolute;left:50%'><span style='position:absolute;left:-50%'>";
        result += Math.round(variations[i].value * 100) / 100;
        result += "</span></span>";
        width = Math.floor((variations[i].value * 100) / max);
        if (variations[i].value === 0) {
          barCssClass += " scZeroValue";
        } 

        result += "<div class='" + barCssClass + "' style='width:" + width +"%'>";
        result += "</div>";
        result += "</div>";
        result += "</td>";
      }
      result += "</tr>";
    }
    
    return result;   
  }
});﻿if (typeof(Sitecore.PageModes.Testing) == "undefined") {
  Sitecore.PageModes.Testing = {};
}

/**
* @static
* @class Represents the HTML cache for variations
*/
Sitecore.PageModes.Testing.RenderingCache = new function() {
  this.innerCache = new Sitecore.PageModes.Cache();
 
  this.getVariationKey = function(renderingChrome, variation) {
    if (!renderingChrome || renderingChrome.key() != "rendering") {
      return null;
    }

    if (!variation) {
      return null;
    }

    return renderingChrome.type.uniqueId() + "$" + ($sc.type(variation) === "string" ? variation : variation.id);
  };
  
  this.cacheVariation = function (renderingChrome, variation, value) {
    var key = this.getVariationKey(renderingChrome, variation);
    if (key !== null) {
      this.innerCache.setValue(key, value);
      return true;
    }
    
    return false;    
  };
 
  this.getCachedVariation = function(renderingChrome, variation) {
    var key = this.getVariationKey(renderingChrome, variation);
    if (key !== null) {
      return this.innerCache.getValue(key);      
    }
    
    return null; 
  };
  
  this.removeVariation = function(renderingChrome, variation) {
    var key = this.getVariationKey(renderingChrome, variation);
    if (key !== null) {
      this.innerCache.clear(key);      
    }
  };
 
  this.clear = function() {
    this.innerCache.clearAll();
  };

  Sitecore.PageModes.PageEditor.onSave.observe($sc.proxy(this.clear, this));
};﻿Sitecore.PageModes.Position = Base.extend({
  constructor: function(chrome) {
    this.chrome = chrome;
    this.element = chrome.type.layoutRoot();    
    this.onResizeHandler = $sc.proxy(this.onResize, this);
    this.element.bind(this._getResizeEventName(), this.onResizeHandler);        
    this.updated = new Sitecore.Event();
  },
  
  dimensions: function() {
    /*cache only for IE. FF and Chrome are fast enough*/
    var shouldCache = Sitecore.PageModes.Utility.isIE
    if (!shouldCache || !this._dimensions) {           
      Sitecore.PageModes.ChromeManager.ignoreDOMChanges = true;
      this._dimensions = this._calculateDimensions(this.element);
      this._dimensions = this._fixInlineContainerHeight(this._dimensions);
      Sitecore.PageModes.ChromeManager.ignoreDOMChanges = false;     
    }

    return this._dimensions;
  },
  
  offset: function() {
    var minLeft, minTop;
    minLeft = minTop = 100000;

    if (!this._ignoreOffsetTags) {
      this._ignoreOffsetTags = ["br", "hr", "script", "style", "link", "noframes" ];
    }

    var ignoreTags = this._ignoreOffsetTags;

    this.element.each(function(index, part) {
      var offset = $sc(part).offset();

      if ($sc.inArray(part.tagName.toLowerCase(), ignoreTags) >= 0) {
        return;
      }

      if (Sitecore.PageModes.PageEditor.isFixedRibbon() && offset.top == 0) {
        return;
      }

      if ($sc(part).is("input[type='hidden'], .scChromeData")) {
        return;
      }

      if (offset.left < minLeft) minLeft = offset.left;
      if (offset.top < minTop) minTop = offset.top;
    });

    if (minLeft == 100000) {
      minLeft = minTop = 0;
    }

    return { left: minLeft, top: minTop };
  },
  
  onResize: function(e) {           
    if ($sc.util().isIE) {    
      this.reset();
      Sitecore.PageModes.ChromeHighlightManager.planUpdate();
    } 
    else {
      e.stop();
      if (Sitecore.PageModes.ChromeManager.ignoreDOMChanges) return;
      var selectedChrome = Sitecore.PageModes.ChromeManager.selectedChrome();
      if (selectedChrome && selectedChrome == this.chrome) {        
        this.reset();
        Sitecore.PageModes.ChromeHighlightManager.planUpdate();
      }
    }    
  },
  
  reset: function() {
    this._dimensions = null;
    var newRoot = this.chrome.type.layoutRoot();    
    if (this.element) {
      this.element.unbind(this._getResizeEventName());
    }

    this.element = newRoot;      
    this.element.bind(this._getResizeEventName(), this.onResizeHandler);      
    this.updated.fire();
  },

  _calculateDimensions: function(element) {
    var maxRight, maxBottom;
    maxRight = maxBottom = 0;

    var offset = this.offset();

    this.element.each(function(index, partRaw) {
      var part = $sc(partRaw);
      var partOffset = $sc(part).offset();

      var right = partOffset.left + part.outerWidth();
      var bottom = partOffset.top + part.outerHeight();

      if (right > maxRight) maxRight = right;
      if (bottom > maxBottom) maxBottom = bottom;
    });

    return { width: maxRight - offset.left, height: maxBottom  - offset.top };
  },

  _fixInlineContainerHeight: function(dimensions) {
    if (dimensions.height == 0 && this.element.css("display") == "inline") {
      var max = 0;
      this.element.children().each(function() { 
        var h = $sc(this).outerHeight();
        if (h < max) {
          max = h;
        } 
      });

      dimensions.height = max;
    }
    
    return dimensions;
  },

  _getResizeEventName: function() {
    var eventName;
    if (this._resizeEventName) {
      return this._resizeEventName;
    }

    var nameSpace;
    if (this.chrome.key() == "field") {
      nameSpace = "field";
    }
    else {
      nameSpace = this.chrome.controlId();
    }

    if ($sc.util().isIE) {
      eventName = "resize";
      //In IE9 or later, the resize event for element layout changes is deprecated.
      //Registration for the event using addEventListener only works on the window (which fires for window resizes). Resize of element layout cannot be detected using addEventListener registration. 
      // Using special event instead.
      if (parseInt($sc.browser.version) > 8) {
        eventName = "elementresize";
      }
    }
    else {
      eventName = "DOMSubtreeModified"; 
    }
    
    if (nameSpace) {
      eventName += "." + nameSpace;
    }
    
    this._resizeEventName = eventName;
    return eventName;
  }
});﻿Sitecore.PageModes.ChromeFrame = Base.extend({
  constructor: function() {
    this.sides = new Array();
  },
  
  addSidesToDom: function() {       
    $sc.each(this.sides, function() {
      $sc(this).css("display", "none").appendTo(document.body);      
    });
  },

  applyCssClass:function(className) {
    $sc.each(this.sides, function() {
      this.addClass(className);
    });
  },

  removeCssClass:function(className) {
    $sc.each(this.sides, function() {
      this.removeClass(className);
    });
  },

  activate: function() {
    this.removeCssClass("scInvisible");
  },

  deactivate: function() {
    this.applyCssClass("scInvisible");
  },

  horizontalSideClassName: function() {
    return "";
  },

  verticalSideClassName: function() {
    return "";
  },

  createSides: function() {
    this.addSidesToDom();
  },

  hide: function() {
    if (this.sides) {
      var length = this.sides.length;
      for (var i = 0; i < length; i++) {
        this.sides[i].hide();
    }
    }
  },

  show: function(chrome) {
    if (chrome == null) return;

    if (this.sides == null || this.sides.length == 0) {
      this.createSides();
    }
            
    this.showSides(chrome);
  },
  
  showSides: function() {
     var length = this.sides.length;
     for (var i = 0; i < length; i++) {
       this.sides[i].show();
     }
  },

  setSideStyle: function (side, top, left, length) {
    side.css({top: top + "px", left: left + "px" });
    if (typeof(length) == "undefined") return;
    
    if (side.hasClass(this.horizontalSideClassName())) {
      side.css({ width: length < 0 ? "0" : length  + "px" });
      return;
    }

    if (side.hasClass(this.verticalSideClassName())) {
      side.css({ height: length < 0 ? "0" : length + "px"});
      return;
    }

    console.error("Unknown side type");
  } 
});﻿Sitecore.PageModes.SelectionFrame = Sitecore.PageModes.ChromeFrame.extend({
 constructor: function() {
    this.base();
    this.createSides();                
    this.controls = new Sitecore.PageModes.ChromeControls();    
    this._chromeResizeHandler = $sc.proxy(this.onChromeResize, this);
  },

  activate: function() {
    this.controls.activate();
    this.base();
  },

  deactivate: function() {
    this.controls.deactivate();
    this.base();
  },

  horizontalSideClassName: function() {
    return "scFrameSideHorizontal";
  },

  verticalSideClassName: function() {
    return "scFrameSideVertical";
  },
   
  calculateSideLengths: function(dimensions) {
    var horizontal = dimensions.width;
    var vertical = dimensions.height;
    
    return { horizontal: horizontal, vertical: vertical};    
  },

  createSides: function() {
    this.top = $sc("<div></div>").addClass(this.horizontalSideClassName());            
    this.right = $sc("<div></div>").addClass(this.verticalSideClassName());  
    this.bottom = $sc("<div></div>").addClass(this.horizontalSideClassName());
    this.left = $sc("<div></div>").addClass(this.verticalSideClassName());
           
    sides = new Array();
    this.sides = sides;
    
    sides.push(this.top);
    sides.push(this.right);
    sides.push(this.left);
    sides.push(this.bottom);
    
    this.base();  
  },
  
  hide: function() {
    this.base();
    this.controls.hide();
    
    this.visible = false;
    
    this.chrome.position.updated.stopObserving(this._chromeResizeHandler);
  },
  
  onChromeResize: function() {        
    this.show(this.chrome);
  },
  
  show: function(chrome) {
    if (this.chrome) {
      this.chrome.position.updated.stopObserving(this._chromeResizeHandler);
    }

    this.chrome = chrome;    
    this.base(chrome);
  },

  showSides: function(chrome) {              
    var offset = chrome.position.offset();
    var dimensions = chrome.position.dimensions();
       
    var sideLengths = this.calculateSideLengths(dimensions);       
    var duration = 200;    
    if (this.visible) {
      var previousOffset = this.top.offset();
      var distance = Math.sqrt(Math.pow(offset.left - previousOffset.left, 2) + Math.pow(offset.top - previousOffset.top, 2));
      
      duration = distance / 1.5;
      if (duration < 200) duration = 200;
      if (duration > 1000) duration = 1000;
    }
        
    this.controls.show(chrome, this.visible ? duration : false);

    var horizontalTopY = offset.top;
    var horizontalX =  offset.left;
    var horizontalBottomY = offset.top + sideLengths.vertical - 1;

    var verticalLeftX = offset.left;
    var verticalY = offset.top;
    var verticalRightX =  offset.left + sideLengths.horizontal - 1;

    //make selection frame wider for content editable elements in order to make caret visible in the first and last position
    if (chrome.type.key() == "field" && chrome.type.contentEditable()) {
      // Decrease left border coordinates to make cursor visible when it is placed in the first position 
      verticalLeftX--;
      // increase right border coordinates to avoid the lagging right border overlap the text when typing.
      // This also resolves the problem with the first space inserted at the last position doesn't increase the border width(sc:332300)
      var rightShift = chrome.type.fontSize ? chrome.type.fontSize : 1;
      verticalRightX += rightShift;
      
      sideLengths.horizontal += rightShift;
    }
     
    if (!this.visible) {
      this.setSideStyle(this.top, horizontalTopY, horizontalX, sideLengths.horizontal);                 
      this.setSideStyle(this.right, verticalY, verticalRightX, sideLengths.vertical);      
      this.setSideStyle(this.left, verticalY, verticalLeftX , sideLengths.vertical);      
      this.setSideStyle(this.bottom, horizontalBottomY , horizontalX, sideLengths.horizontal);
                  
      this.visible = true;
      this.base(dimensions, offset);
    }
    else {
      this.top.stop(true).animate({ width: sideLengths.horizontal + "px", top: horizontalTopY + "px", left: horizontalX + "px"}, duration);            
      this.right.stop(true).animate({ height: sideLengths.vertical + "px", top: verticalY + "px", left: verticalRightX + "px"}, duration);      
      this.left.stop(true).animate({ height: sideLengths.vertical + "px", top: verticalY + "px", left: verticalLeftX + "px"}, duration);      
      this.bottom.stop(true).animate({ width: sideLengths.horizontal + "px", top: horizontalBottomY + "px", left: horizontalX + "px"}, duration);      
    }
    
    chrome.position.updated.observe(this._chromeResizeHandler);       
  }
});﻿Sitecore.PageModes.HoverFrame = Sitecore.PageModes.ChromeFrame.extend({
  constructor: function() {
    this.base();
    this.cornerSize = {height: 4, width: 4};
    this.createSides();   
  },

  createSides: function() {
    this.top = $sc("<div></div>").addClass(this.horizontalSideClassName());
    this.topLeftCorner = $sc("<div></div>").addClass(this.verticalSideClassName() + " scTlHoverFrameCorner");

    this.topRightCorner = $sc("<div></div>").addClass(this.horizontalSideClassName() + " scTrHoverFrameCorner");
    this.right = $sc("<div></div>").addClass(this.verticalSideClassName());

    this.bottom = $sc("<div></div>").addClass(this.horizontalSideClassName());
    this.bottomLeftCorner = $sc("<div></div>").addClass(this.verticalSideClassName() + " scBlHoverFrameCorner");

    this.bottomRightCorner = $sc("<div></div>").addClass(this.horizontalSideClassName() + " scBrHoverFrameCorner");
    this.left = $sc("<div></div>").addClass(this.verticalSideClassName());
    
    sides = new Array();
    this.sides = sides;
    
    sides.push(this.top);
    sides.push(this.topLeftCorner);
    sides.push(this.topRightCorner);
    sides.push(this.right);
    sides.push(this.bottom);
    sides.push(this.bottomLeftCorner);
    sides.push(this.bottomRightCorner);
    sides.push(this.left);

    this.base();
  },
  
  horizontalSideClassName: function() {
    return "scHoverFrameSideHorizontal";
  },

  verticalSideClassName: function() {
    return "scHoverFrameSideVertical";
  },
  
  calculateSideLengths: function(dimensions) {
    var horizontal = dimensions.width - 2 * this.cornerSize.width;
    var vertical = dimensions.height - 2 * this.cornerSize.height;
    
    return { horizontal: horizontal > 0 ? horizontal : 0, vertical: vertical > 0 ? vertical : 0};    
  },
      
  showSides: function(chrome) {            
    var offset = chrome.position.offset();
    var dimensions = chrome.position.dimensions();
    
    var sideLengths = this.calculateSideLengths(dimensions);

    var leftCornerX = offset.left;    
    var horizontalX = leftCornerX + this.cornerSize.width;    
    var verticalLeftX = leftCornerX;
    var verticalRightX = offset.left + dimensions.width - 1;
    var rightCornerX = verticalRightX - this.cornerSize.width + 1;

    var topY = offset.top;
    var bottomY = offset.top + dimensions.height - 1;
    var verticalY = topY + this.cornerSize.height;
    var bottomCornerY = offset.top + dimensions.height - this.cornerSize.height;

    this.setSideStyle(this.top, topY, horizontalX, sideLengths.horizontal);
    this.setSideStyle(this.topLeftCorner, topY , leftCornerX);
    
    this.setSideStyle(this.topRightCorner, topY, rightCornerX);
    this.setSideStyle(this.right, verticalY, verticalRightX, sideLengths.vertical);

    this.setSideStyle(this.bottom, bottomY, horizontalX, sideLengths.horizontal);
    this.setSideStyle(this.bottomLeftCorner, bottomCornerY, leftCornerX);
    
    this.setSideStyle(this.bottomRightCorner, bottomCornerY, rightCornerX);
    this.setSideStyle(this.left, verticalY, verticalLeftX, sideLengths.vertical);
      
    this.base(chrome);
  }
});﻿Sitecore.PageModes.HighlightFrame = Sitecore.PageModes.HoverFrame.extend({      
  horizontalSideClassName: function() {
    return this.base() + " scHilghlightedChrome";
  },

  verticalSideClassName: function() {
    return this.base() + " scHilghlightedChrome";
  },
   
  dispose: function() {
    if (this.sides) {
      $sc.each(this.sides, function() {
        this.remove();
      });
    }

    this.sides = null;
  }  
});﻿Sitecore.PageModes.ChromeTypes.Placeholder = Sitecore.PageModes.ChromeTypes.ChromeType.extend( {
  constructor: function() {
    this.base();
  },

  controlId: function() {
    var marker = this.chrome.openingMarker();
    if (marker) {
      return marker.attr("id");
    }

    return this.base();
  },

  selectable: function() {
    if (this._selectable != null) {
      return this._selectable;
    }

    var marker = this.chrome.openingMarker();
    this._selectable = marker != null && marker.attr("data-selectable") === "true";
    return this._selectable;
  },

  addControl: function(position) {
    this._insertPosition = position;

    var ribbon = Sitecore.PageModes.PageEditor.ribbon();

    ribbon.contentWindow.$("scLayoutDefinition").value = $sc("#scLayout").val();        
    Sitecore.PageModes.PageEditor.postRequest("webedit:addrendering(placeholder=" + this.placeholderKey() + ")");
  },
  
  addControlResponse: function(id, openProperties, ds) {                       
    var options = Sitecore.PageModes.ChromeTypes.Placeholder.getDefaultAjaxOptions("insert");
    options.context = this;    
    options.data.rendering = id;
    options.data.placeholderKey = this.placeholderKey();
    options.data.position = this._insertPosition;
    options.data.url = window.location.href;                
    
    if (ds) {
      options.data.datasource = ds;
    }

    options.success = function(serverData) {
      var data = Sitecore.PageModes.Utility.parsePalleteResponse(serverData);       
      var persistedLayout;
      if (data.layout) {
        var layoutCtrl = $sc("#scLayout");
        persistedLayout = layoutCtrl.val();
        layoutCtrl.val(data.layout);          
      }

      // sublayout
      if (data.url != null) {
        this._loadRenderingFromUrl(data.url, function(callbackData) {
          if (callbackData.error == null) {                            
            data.html = $sc(callbackData.renderingElement.combined).outerHtml();
            Sitecore.PageModes.ChromeManager.select(null);
            this.insertRendering(data, openProperties);
          }
          else {
            if (persistedLayout) {
              $sc("#scLayout").val(persistedLayout);
            }

            alert(callbackData.error);
          } 
        });                   
      }
      // plain rendering, not a sublayout
      else {
        Sitecore.PageModes.Utility.tryAddStyleSheets(data.styleSheets);
        Sitecore.PageModes.Utility.tryAddScripts(data.scripts);          
        Sitecore.PageModes.ChromeManager.select(null);
        this.insertRendering(data, openProperties);
      }      
    };
      
    $sc.ajax(options);                  
  },
  
  deleteControl: function(chrome) {
    Sitecore.LayoutDefinition.remove(chrome.type.uniqueId());    
    
    Sitecore.PageModes.ChromeManager.select(null);
    Sitecore.PageModes.ChromeHighlightManager.stop();         
    
    var l = chrome.element.length;   
    chrome.element.fadeOut(200, $sc.proxy(function() {      
        if (--l > 0) return;
        this._removeRendering(chrome);                      
        if (this.isEmpty()) {
          this.showEmptyLook();
        }

        Sitecore.PageModes.ChromeHighlightManager.resume();         
      }, this));
  },
  
  editProperties: function(chrome) {
    var ribbon = Sitecore.PageModes.PageEditor.ribbon();

    if (ribbon == null) {
      return;
    }
    
    ribbon.contentWindow.$("scLayoutDefinition").value = $sc("#scLayout").val();
        
    Sitecore.PageModes.PageEditor.postRequest("webedit:editrenderingproperties(uniqueid=" + chrome.type.uniqueId() + ")");
  },
  
  editPropertiesResponse: function(renderingChrome) {
    if (!Sitecore.LayoutDefinition.readLayoutFromRibbon()) {
      return;
    }
    
    var commandName = "preview";        
    var options = Sitecore.PageModes.ChromeTypes.Placeholder.getDefaultAjaxOptions(commandName);
    options.data.renderingUniqueId = renderingChrome.type.uniqueId();       
    options.data.url = window.location.href;
    this._addAnalyticsOptions(renderingChrome, options);
    if (options.data.variationId) {
      options.data.command += "variation";
    }
    else if (options.data.conditionId) {
      options.data.command += "condition";
    }
            
    options.context = this;                    
    options.success = function(serverData) {               
      var data = Sitecore.PageModes.Utility.parsePalleteResponse(serverData);
      
      Sitecore.PageModes.ChromeHighlightManager.stop();                 
            
      if (data.url != null) {          
        this._loadRenderingFromUrl(data.url, function(callbackData) {
          if (callbackData.error == null) {
            Sitecore.PageModes.ChromeManager.select(null);            
            this._doUpdateRenderingProperties(renderingChrome, callbackData.renderingElement.combined.outerHtml());                        
          }
          else {
            console.log(callbackData.error);
          }
        }); 
      }
      else {
        Sitecore.PageModes.ChromeManager.select(null);
        Sitecore.PageModes.Utility.tryAddStyleSheets(data.styleSheets);
        Sitecore.PageModes.Utility.tryAddScripts(data.scripts);                  
        this._doUpdateRenderingProperties(renderingChrome, data.html);                
      }                     
    };
     
    $sc.ajax(options);
  },

  editSettings: function() {
    var ribbon = Sitecore.PageModes.PageEditor.ribbon();
    if (ribbon == null) {
      return;
    }
        
    ribbon.contentWindow.$("scLayoutDefinition").value = $sc("#scLayout").val();  
    Sitecore.PageModes.PageEditor.postRequest("webedit:editplaceholdersettings(key=" + this.placeholderKey() + ")");    
  },

  editSettingsCompleted: function(isEditable, allowedRenderingIds) {
    Sitecore.LayoutDefinition.readLayoutFromRibbon();
    if (this.chrome.hasDataNode) {
      this.chrome.data.custom.editable = isEditable ? "true": "false";
      this.chrome.data.custom.allowedRenderings = allowedRenderingIds;      
    }

    Sitecore.PageModes.ChromeManager.select(null);
    this.reload();
    Sitecore.PageModes.ChromeManager.resetChromes();    
    Sitecore.PageModes.ChromeManager.select(this.chrome);     
  },
  
  /* used when new controls are being inserted (or if they replace other controls) when returned from the server */
  insertRendering: function(data, openProperties) {   
    console.group("insertRendering"); 
    var placeholder = this.chrome;          
    
    if (this.emptyLook()) {
      this.hideEmptyLook();
    }

    Sitecore.PageModes.ChromeHighlightManager.stop();

    var newElement = $sc(data.html);

    var position = this._insertPosition;
    this._insertPosition = null;

    var childRenderings = this.renderings();

    if (position == 0) {
      placeholder.prepend(newElement);
    }
    else if (position < childRenderings.length) {
      var rendering = childRenderings[position - 1];

      rendering.after(newElement);
    }
    else {
      placeholder.append(newElement);
    }

    Sitecore.PageModes.ChromeManager.resetChromes();
        
    var newRenderingUniqueId = newElement.attr("id").substring(2);
    var newRenderingChrome = this._getChildRenderingByUid(newRenderingUniqueId);

    if (!newRenderingChrome) {
      console.error("Cannot find rendering chrome with unique id: " + newRenderingUniqueId);
      Sitecore.PageModes.ChromeHighlightManager.resume();
      return;
    }

    Sitecore.PageModes.PageEditor.setModified(true);
    var l = newRenderingChrome.element.length;   
    newRenderingChrome.element.fadeIn(500, function() {        
      if (--l > 0) return;
      if (!openProperties) {        
        Sitecore.PageModes.ChromeManager.select(newRenderingChrome);
        Sitecore.PageModes.ChromeHighlightManager.resume();          
      }        
    });
                                  
    if (openProperties && newRenderingChrome.isEnabled()) {
      Sitecore.PageModes.ChromeManager.setCommandSender(newRenderingChrome);                        
      this.editProperties(newRenderingChrome);            
    }

    console.groupEnd("insertRendering");
  },

  /* used by design manager while moving controls around on the page */
  insertRenderingAt: function(control, position) { 
    Sitecore.PageModes.ChromeManager.ignoreDOMChanges = true;    
    var originalPlaceholder = control.type.getPlaceholder();
    if (this.emptyLook()) {
      this.hideEmptyLook();
    }

    Sitecore.PageModes.ChromeHighlightManager.stop();

    if (this.isEmpty()) {
      this.chrome.append(control);
    }
    else {
      var renderings = this.renderings();      
      
      if (position < renderings.length) {    
        var rendering = renderings[position];
        rendering.before(control);
      }
      else {
        this.chrome.append(control);
      }
    }
    
    control._placeholder = this;
    var l = control.element.length;   
    control.element.fadeIn(500, function() {     
      if (--l > 0) return;
      $sc.each(control.descendants(), function() { if (this.key() == "word field") this.type.initWord(); });
      control.detachElements();
      // The position of DOM nodes has change.
      // Rearange chromes position in the _chromes array to make the chromes reset method occurr in correct sequence
      Sitecore.PageModes.ChromeManager.rearrangeChromes();
      Sitecore.PageModes.ChromeManager.resetChromes();
      
      if (originalPlaceholder) {
        originalPlaceholder.type.reload();
      }

      Sitecore.PageModes.ChromeHighlightManager.resume();
      Sitecore.PageModes.ChromeManager.select(control);
      Sitecore.PageModes.ChromeManager.ignoreDOMChanges = false;
    });       
  },

  isEmpty: function() {
    return this.chrome.element.length === 0 ||
           this.chrome.element.hasClass(Sitecore.PageModes.ChromeTypes.Placeholder.emptyLookFillerCssClass);
  },

  isEnabled: function() {
    return this.base() &&
            this.selectable() &&
            this.chrome.data.custom.editable === "true" && 
            $sc.inArray(Sitecore.PageModes.Capabilities.design, Sitecore.PageModes.PageEditor.getCapabilities()) > -1;            
  },

  elements: function(domElement) {
    if (!domElement.is("code[type='text/sitecore'][chromeType='placeholder']")) {
      console.error("Unexpected domelement passed to PlaceholderChromeType for initialization:");
      console.log(domElement);
      
      throw "Failed to parse page editor placeholder demarked by script tags";
    }  

    return this._getElementsBetweenScriptTags(domElement);
  },
  
  emptyLook: function() {
    return this.chrome.element.filter(this._emptyLookSelector()).length > 0;
  },
    
  getContextItemUri: function() {
    return "";
  },
  
  handleMessage: function(message, params) {
    switch (message) {
      case "chrome:placeholder:addControl":
        this.addControl();
        break;
      case "chrome:placeholder:editSettings":
        this.editSettings();
        break;
      case "chrome:placeholder:editSettingscompleted":
        this.editSettingsCompleted(params.editable, params.allowedRenderingIds);
        break;
      case "chrome:placeholder:controladded":
        this.addControlResponse(params.id, params.openProperties, params.dataSource);
        break;
    }    
  },
  
  hideEmptyLook: function() {        
    this.chrome.element.filter(this._emptyLookSelector()).remove();
  },
    
  key: function() {
    return "placeholder";
  },
  
  load: function() {
    if (this.isEmpty()) {
      this.showEmptyLook();
    }

    var addCommand = $sc.first(this.chrome.commands(), function() { return this.click.indexOf("chrome:placeholder:addControl") > -1; });
    if (addCommand) {
      this._insertionEnabled = true;
      addCommand.hidden = true;
    }
  },

  loadRenderingFromUrl: function(url, callback) {
    this._loadRenderingFromUrl(url, callback);
  },

  morphRenderings: function(chrome, morphingRenderingsIds) {
    var ribbon = Sitecore.PageModes.PageEditor.ribbon();

    ribbon.contentWindow.$("scLayoutDefinition").value = $sc("#scLayout").val();    
    this._insertPosition = chrome.type.positionInPlaceholder();    
    Sitecore.PageModes.PageEditor.postRequest("webedit:addrendering(placeholder=" + this.placeholderKey() + ",renderingIds=" + 
                                                morphingRenderingsIds.join('|') + ")");
  },

  morphRenderingsResponse: function(renderingChrome, id, openProperties) {            
    if (id == "") {
      return;
    }
    
    var options = Sitecore.PageModes.ChromeTypes.Placeholder.getDefaultAjaxOptions("morph");
    options.data.morphedRenderingUid = renderingChrome.type.uniqueId();
    options.data.rendering =  id; 
    options.data.placeholderKey = this.placeholderKey();
    options.data.url = window.location.href       
    options.context = this;
    this._addAnalyticsOptions(renderingChrome, options, true);
    
    options.success = function(serverData) {               
      var data = Sitecore.PageModes.Utility.parsePalleteResponse(serverData);
      var persistedLayout;
      
      if (data.layout) {
        var layoutCtrl = $sc("#scLayout");
        persistedLayout = layoutCtrl.val();
        layoutCtrl.val(data.layout);  
      }
        
      Sitecore.PageModes.ChromeManager.hideSelection();
        
      if (data.url != null) {          
        this._loadRenderingFromUrl(data.url, function(callbackData) {
          if (callbackData.error == null) {
            data.html = callbackData.renderingElement.combined.outerHtml();
            this._removeRendering(renderingChrome);
            this.insertRendering(data, openProperties);
          }
          else {
            if (persistedLayout) {
              $sc("#scLayout").val(persistedLayout);
            }

            alert(callbackData.error);
          } 
        });                   
      }
      else {
        this._removeRendering(renderingChrome);
        Sitecore.PageModes.Utility.tryAddStyleSheets(data.styleSheets);
        Sitecore.PageModes.Utility.tryAddScripts(data.scripts);          
        this.insertRendering(data, openProperties);
      }

      if (renderingChrome.type.hasVariations()) {        
        Sitecore.PageModes.PageEditor.refreshRibbon();   
      }
    };

    $sc.ajax(options);
  },

  onShow: function() {
    if (!this._insertionEnabled) {
      return;
    }

    if (this.isReadOnly()) {
      return;
    } 
       
    this.inserter = new Sitecore.PageModes.ChromeTypes.PlaceholderInsertion(this.chrome);
    this.inserter.activate();
  },

  onHide: function() {
    if (this.inserter) {
      this.inserter.deactivate();
      this.inserter = null;
    }
  },
        
  placeholderKey: function() {
    return this.chrome.openingMarker().attr("key");
  },
  
  removeChrome: function(chrome) {
    chrome.element.remove();
  },

  renderings: function() {
    return this.chrome.getChildChromes(function() { return this.key() == "rendering" });
  },

  renderingAllowed: function(renderingId) {
    var allowedRenderings = this.chrome.data.custom.allowedRenderings;
    return allowedRenderings.length == 0 || $sc.inArray(renderingId, allowedRenderings) > -1;
  },

  reload: function() {
    if (!this.isEmpty()) {
      return;
    }

    this.isEnabled() ? this.showEmptyLook() : this.hideEmptyLook();
  },
  
  sortingStart: function(rendering) {
    if (!this.renderingAllowed(rendering.type.renderingId())) {
      return;
    }

    if (this.isReadOnly()) {
      return;
    }
  
    this.sorter = new Sitecore.PageModes.ChromeTypes.PlaceholderSorting(this.chrome, rendering);
    this.sorter.activate(); 
  },
  
  sortingEnd: function() {
    if (!this.sorter) {      
      return;
    }
    
    this.sorter.deactivate();
    this.sorter = null;
  },
    
  showEmptyLook: function() {
    if (this.emptyLook()) {
      return;
    }

    if (!this.isEnabled()) {
      return;
    }
    
    var emptyLookFiller = $sc("<div class='scEnabledChrome' />")
                                .addClass(Sitecore.PageModes.ChromeTypes.Placeholder.emptyLookFillerCssClass)
                                .attr("sc-placeholder-id", this.controlId());

    this.chrome.append(emptyLookFiller);
    this.chrome.reset();
  },

  _addAnalyticsOptions: function(renderingChrome, options, useDefault) {
    var activeVariation, activeCondition;
    activeVariation = $sc.first(renderingChrome.type.getVariations(), function() { return useDefault || this.isActive; });
    if (!activeVariation) {              
      activeCondition = $sc.first(renderingChrome.type.getConditions(), function() { return useDefault? this.isDefault() : this.isActive; });      
    } 
           
    if (activeVariation) {
      options.data.variationId = activeVariation.id;
    }

    if (activeCondition) {
      options.data.conditionId = $sc.toShortId(activeCondition.id);
    } 
  },

  _doUpdateRenderingProperties: function(renderingChrome, html) {
    renderingChrome.type.update(html);            
    Sitecore.PageModes.ChromeManager.resetChromes();
    renderingChrome.reload();
    // Changing properies may effect appearance of other conditions or variations
    renderingChrome.type.clearCachedConditions();
    renderingChrome.type.clearCachedVariations();
    var chrome = this._getChildRenderingByUid(renderingChrome.type.uniqueId());
      
    if (chrome) {
      setTimeout(function() {           
        Sitecore.PageModes.ChromeHighlightManager.resume();
        Sitecore.PageModes.ChromeManager.select(chrome);          
      }, 100);
    }
    else {
      Sitecore.PageModes.ChromeHighlightManager.resume();
    }
  },

  _emptyLookSelector: function() {
    // Using only CSS class is not enough, becuase we can get the empty placeholder of some inner rendering by mistake.
    return "." + Sitecore.PageModes.ChromeTypes.Placeholder.emptyLookFillerCssClass + "[sc-placeholder-id='" + this.controlId() + "']";
  },

  _getChildRenderingByUid: function(uid) {
    return this.chrome.getChildChromes(function() { return this.key() == "rendering" && this.type.uniqueId() == uid; })[0];
  },
  
  _loadRenderingFromUrl: function(url, callback) {    
    if (!this._loadingFrame) {
      this._loadingFrame = $sc("<iframe id='scLoadingFrame'></iframe>").attr({ height:"0px", width:"0px"}).appendTo(document.body);
      this._loadingFrame.bind("load", $sc.proxy(this._frameLoaded, this));   
    }

    this._frameLoadedCallback = callback;
    this._loadingFrame[0].src = url + "&rnd=" + Math.random();       
  },

  _frameLoaded: function() {
    if (this._loadingFrame == null) {
      console.error("cannot load data from frame. Frame isn't defined");
      return;    
    }

    var frame = this._loadingFrame.get(0);
    var renderingUniqueId = $sc.parseQuery(frame.contentWindow.location.href)["sc_ruid"];
    var doc = frame.contentDocument || frame.contentWindow.document;
        
    var renderingDomElement = doc.getElementById("r_" + renderingUniqueId);

    var callbackData = new Object();   
    
    if (renderingDomElement != null) {      
      var start = $sc(renderingDomElement);
      
      if (!start.is("code[type='text/sitecore'][chromeType='rendering'][kind='open']")) {
         throw "Loaded unexpected element while trying to get rendering html from server. Expected opening script marker.";
      }

      var middle = start.nextUntil("code[type='text/sitecore'][chromeType='rendering'][kind='close']");
      var end = middle.last().next();
      start = start.clone();
      middle = middle.clone();
      end = end.clone();     
      var elements = start.add(middle).add(end);

      if (!elements.last().is("code[type='text/sitecore'][chromeType='rendering'][kind='close']")) {
        console.error(elements);

        throw "Loaded unexpected element while trying to get rendering html from server. Expecting last tag to be closing script marker";
      }

      callbackData.renderingElement = {opening: start, content: middle, closing: end, combined: elements };
    }
    else
    {
      console.error("Could not find the rendering in the HTML loaded from server");

      if (frame.contentWindow.location.href.toLowerCase().indexOf("pagedesignererror.aspx") > -1) {     
        callbackData.error = Sitecore.PageModes.Texts.SublayoutWasInsertedIntoItself;
      }
      else {
        callbackData.error = Sitecore.PageModes.Texts.ErrorOcurred;
      }
    }
   
    if (this._frameLoadedCallback != null) {
      this._frameLoadedCallback(callbackData);
      this._frameLoadedCallback = null;
    }    
  },
  
  _removeRendering: function(renderingChrome) {
    if (renderingChrome == null || renderingChrome.key() != "rendering") return;
    if (Sitecore.PageModes.Personalization) {
      Sitecore.PageModes.Personalization.ConditionStateStorage.remove(renderingChrome.type.uniqueId());
    }

    renderingChrome.remove();
    Sitecore.PageModes.ChromeManager.resetChromes();
  } 
},
{
  emptyLookFillerCssClass: "scEmptyPlaceholder",
  getDefaultAjaxOptions: function(commandName) {
    var options = {
      type: "POST",
      url: "/sitecore/shell/Applications/WebEdit/Palette.aspx",     
      dataType: "html",
      data: {
        command: commandName,
        itemid: Sitecore.PageModes.PageEditor.itemId(),
        language: Sitecore.PageModes.PageEditor.language(),
        layout: $sc("#scLayout").val(),
        deviceid:$sc("#scDeviceID").val(),
        siteName: $sc("#scSite").val()
      },

      beforeSend: function (xhr) {
        Sitecore.PageModes.ChromeManager.onChromeUpdating();
      },

      complete: function () {
        Sitecore.PageModes.ChromeManager.onChromeUpdated();  
      },
      error: function(xhr, error) {       
        alert(Sitecore.PageModes.Texts.ErrorOcurred);
      },

      global: false
    };

    return options;
  }
});﻿Sitecore.PageModes.ChromeTypes.Rendering = Sitecore.PageModes.ChromeTypes.ChromeType.extend({
  constructor: function() {
    this.base();
  },
  
  deleteControl: function() {
    var placeholder = this.getPlaceholder();
    
    if (placeholder) {     
      placeholder.type.deleteControl(this.chrome);      
    }
  },

  controlId: function() {
    var marker = this.chrome.openingMarker();
    if (marker) {
      return marker.attr("id");
    }

    return this.base();
  },

  selectable: function() {
    if (this._selectable != null) {
      return this._selectable;
    }

    var marker = this.chrome.openingMarker();
    this._selectable = marker != null && marker.attr("data-selectable") === "true";
    return this._selectable;
  },
  
  editProperties: function() {
    var placeholder = this.getPlaceholder();
    
    if (placeholder) {
      placeholder.type.editProperties(this.chrome);
    }
  },

  editPropertiesCompleted: function() {
    var placeholder = this.getPlaceholder();
    
    if (placeholder) {
      placeholder.type.editPropertiesResponse(this.chrome);
    }
  },

  elements: function(domElement) {
    if (!domElement.is("code[type='text/sitecore'][chromeType='rendering']")) {
      console.error("Unexpected domelement passed to RenderingChromeType for initialization:");
      console.log(domElement);
      throw "Failed to parse page editor rendering demarked by script tags";
    }  

    return this._getElementsBetweenScriptTags(domElement);
  },

  clearCachedConditions: function() {
    var conditions = this.getConditions();
    for (var i = 0; i < conditions.length; i++) {
      Sitecore.PageModes.Personalization.RenderingCache.removeCondition(this.chrome, conditions[i]);
    }
  },
  
  clearCachedVariations: function() {
    var chrome = this.chrome;
    $sc.each(this.getVariations(), function() {Sitecore.PageModes.Testing.RenderingCache.removeVariation(chrome, this);});
  }, 
  
  getConditions: function() {
    if (this._conditions) {
      return this._conditions;
    }

    this._conditions = Sitecore.LayoutDefinition.getRenderingConditions(this.uniqueId());        
    var isActiveConditionSpecified = $sc.exists(this._conditions, function(){ return this.isActive})
    if (!isActiveConditionSpecified) {
      var defaultCondition = $sc.first(this._conditions, function(){ return this.isDefault();});
      if (defaultCondition) {
        defaultCondition.isActive = true;
      }
    }
                               
    return this._conditions;
  },

  resetConditions: function() {        
    this._conditions = null;    
  },
  
  getControl: function(placeholder) {
    var element = this.chrome.element;
    
    return $sc.first(placeholder.controls(), function() {
      return this.element == element;
    });
  },
  
  getPlaceholder: function() {
    var result = this.chrome.parent(false, false);

    if (!result) {
      return null;
    }
    
    if (result.type.key() != "placeholder") {
      console.warn(result.element);
      console.log();
      throw "Rendering must have placeholder chrome as its parent. Got '" + result.type.key() + "' instead";
    }

    return result;
  },

  getVariations: function() {
    return this._variations;
  },
     
  handleMessage: function(message, params, sender) {
    switch (message) {
      case "chrome:rendering:sort":
        this.sort();
        break;
      case "chrome:rendering:properties":
        this.editProperties();
        break;
      case "chrome:rendering:propertiescompleted":
        this.editPropertiesCompleted();
        break;
      case "chrome:rendering:delete": 
        this.deleteControl();
        break;
      case "chrome:rendering:morph":
        this.morph(params);
        break;
      case "chrome:rendering:morphcompleted":
        this.morphCompleted(params.id, params.openProperties);
        break;
      case "chrome:rendering:personalize":
        if (Sitecore.PageModes.Personalization) {
          this.personalize(params.command);
        }
        break;
      case "chrome:rendering:personalizationcompleted":
        if (Sitecore.PageModes.Personalization) {
          this.presonalizationCompleted(params, sender);
        }                
        break;
      case "chrome:personalization:conditionchange":
        if (Sitecore.PageModes.Personalization) {
          this.changeCondition(params.id, sender);
        }
        break;      
      case "chrome:rendering:editvariations":
        if (Sitecore.PageModes.Testing) {
          this.editVariations(params.command, sender);
        }
        break;
      case "chrome:rendering:editvariationscompleted":
        if (Sitecore.PageModes.Testing) {
          this.editVariationsCompleted(params, sender);
        }
        break;
      case "chrome:testing:variationchange":
        if (Sitecore.PageModes.Testing) {
          this.changeVariation(params.id, sender);
        }        
        break;         
    }
  },

  editVariations: function(commandName, sender) {
    if (!this.hasVariations()) {      
      if (this.chrome.getChildChromes(function () {return this.key() == "rendering" && this.type.hasVariations();}, true).length) {
        alert(Sitecore.PageModes.Texts.Analytics.TestSetUpOnDescendant);
        return;
      }
      
      var ancestors = this.chrome.ancestors();
      if ($sc.first(ancestors, function() {return this.key() == "rendering" && this.type.hasVariations()})) {
        alert(Sitecore.PageModes.Texts.Analytics.TestSetUpOnAscendant);
        return;
      }
    }

    var ribbon = Sitecore.PageModes.PageEditor.ribbon();
    ribbon.contentWindow.$("scLayoutDefinition").value = $sc("#scLayout").val();
    var controlId = this.controlId();
    if (sender) {
      controlId = sender.controlId(); 
    }

    Sitecore.PageModes.PageEditor.postRequest(commandName + "(uniqueId=" + this.uniqueId() + ",controlId=" + controlId + ")");
  },

  editVariationsCompleted: function(parameters, sender) {
    var variations = parameters.variations;     
    Sitecore.LayoutDefinition.readLayoutFromRibbon(); 
    // reset command
    if (variations.length == 0) {
      var chrome = this.chrome;
      //Clear caches
      $sc.each(this.getVariations(), function() {Sitecore.PageModes.Testing.RenderingCache.removeVariation(chrome, this);});      
      this._variations = [];
      // TODO: change this. Currently changing rendering properties doesn't update chrome data.
      this.editPropertiesCompleted();      
      // Update ribbon controls which display testing components     
      Sitecore.PageModes.PageEditor.refreshRibbon();      
      return;        
    }
 
    var activeVariation = $sc.first(this.getVariations(), function() { return this.isActive;});           
    // By default last variation is active
    variations[variations.length - 1].isActive = true;    
    var activeVariationId;
    if (activeVariation) {
      activeVariationId = activeVariation.id
      for (var i = 0; i < variations.length; i++) {        
        if (variations[i].id === activeVariationId) {
          //Reset default active variation
          variations[variations.length - 1].isActive = false;
          variations[i].isActive = true;
          break;
        }        
      }
    }
    else {
      // Component is testable now.
      // Update ribbon controls which display testing components 
      Sitecore.PageModes.PageEditor.refreshRibbon();
    }

    var isActiveVariationModified = false;
    var modifiedVariations = parameters.modifiedIds;
    for (var i = 0; i < modifiedVariations.length; i++) {
      Sitecore.PageModes.Testing.RenderingCache.removeVariation(this.chrome,  modifiedVariations[i]);
      if (modifiedVariations[i] === activeVariationId) {
        isActiveVariationModified = true;
      }
    }
    
    this._variations = variations;
    if (isActiveVariationModified || activeVariation == null) {
      var newActiveVariation = $sc.first(this.getVariations(), function() { return this.isActive;});
      if (newActiveVariation) {
        var preserveCacheUpdating = true;                            
        this.changeVariation(newActiveVariation.id, sender, preserveCacheUpdating);
        return;
      }        
    }

    if (Sitecore.PageModes.ChromeManager.selectedChrome() != null) {
      Sitecore.PageModes.ChromeManager.resetSelectionFrame();
    }
    else {
      Sitecore.PageModes.ChromeManager.select(this.chrome);
    } 
  },

  isEnabled: function() {
    return  this.base() &&
            this.selectable() &&
            this.chrome.data.custom.editable === "true" &&             
            $sc.inArray(Sitecore.PageModes.Capabilities.design, Sitecore.PageModes.PageEditor.getCapabilities()) > -1;            
  },

  hasVariations: function() {
    return this._variations.length > 0;
  },
  
  key: function() {
    return "rendering";
  },

  morph: function(morphingRenderings) {
    var placeholder = this.getPlaceholder();
    
    if (placeholder) {
      placeholder.type.morphRenderings(this.chrome, morphingRenderings);
    }
  },

  morphCompleted: function(mophedRenderingId, openProperties) {
    var placeholder = this.getPlaceholder();
    
    if (placeholder) {
      placeholder.type.morphRenderingsResponse(this.chrome, mophedRenderingId, openProperties);
    }
  },

  personalize: function(commandName) {
    var ribbon = Sitecore.PageModes.PageEditor.ribbon();
    ribbon.contentWindow.$("scLayoutDefinition").value = $sc("#scLayout").val();         
    Sitecore.PageModes.PageEditor.postRequest(commandName + "(uniqueId=" + this.uniqueId() +")");
  },

  presonalizationCompleted: function(modifiedConditions, sender) {    
    if (!Sitecore.LayoutDefinition.readLayoutFromRibbon()) {
      return;
    }
    var previousActiveCondition = $sc.first(this.getConditions(), function() {return this.isActive;});
    this.resetConditions();
    var activeCondition = $sc.first(this.getConditions(), function() {return this.isActive;});
    var isActivaeConditionModified = false;
    for (var i = 0; i < modifiedConditions.length; i++) {
      Sitecore.PageModes.Personalization.RenderingCache.removeCondition(this.chrome,  modifiedConditions[i]);
      if (modifiedConditions[i] == activeCondition.id) {
        isActivaeConditionModified = true;
      }
    }
                      
    var activaeConditionChanged = previousActiveCondition && activeCondition && previousActiveCondition.id !== activeCondition.id;
    if (activaeConditionChanged || isActivaeConditionModified) {
      var preserveCacheUpdating = true;                            
      this.changeCondition(activeCondition.id, sender, preserveCacheUpdating);
      return;
    }

    if (Sitecore.PageModes.ChromeManager.selectedChrome() != null) {
      Sitecore.PageModes.ChromeManager.resetSelectionFrame();
    }
    else {
      Sitecore.PageModes.ChromeManager.select(this.chrome);
    }          
  },

  load: function() {    
    this.canUpdateRenderingCache = true;

    if (Sitecore.PageModes.Personalization) {        
      Sitecore.PageModes.ChromeControls.registerCommandRenderer("chrome:rendering:personalize", Sitecore.PageModes.ChromeTypes.Rendering.renderPersonalizationCommand, this);
    }

    this._variations = [];
    if (Sitecore.PageModes.Testing) {        
      Sitecore.PageModes.ChromeControls.registerCommandRenderer("chrome:rendering:editvariations", Sitecore.PageModes.ChromeTypes.Rendering.renderEditVariationsCommand, this);
              
      if (this.chrome.hasDataNode && this.chrome.data.custom.testVariations) {
        this._variations = this.chrome.data.custom.testVariations;
        if (Sitecore.PageModes.PageEditor.isTestRunning()) {
          this.setReadOnly();
        }
      }
    }

    this.queryCommands();
    this.saveHandler = $sc.proxy(this.onSave, this);
    this.resetHandler = $sc.proxy(this.onReset, this);
    Sitecore.PageModes.ChromeManager.chromesReseted.observe(this.resetHandler);
    Sitecore.PageModes.PageEditor.onSave.observe(this.saveHandler);    
  },

  queryCommands: function() {
    var morphCommand = $sc.first(this.chrome.commands(), function() { return this.click && this.click.toLowerCase().indexOf("chrome:rendering:morph") > -1; });
    var chrome = this.chrome;
    var placeholder = this.getPlaceholder();
    var hasVariations = this.hasVariations();
    if (morphCommand && placeholder) {
      var hasAllowedMorphingRenderings = false;
      var click = Sitecore.PageModes.Utility.parseCommandClick(morphCommand.click);
      var morphingRenderingsIds = click.params;
      
      for (var i = 0; i < morphingRenderingsIds.length; i++) {
        if (placeholder.type.renderingAllowed(morphingRenderingsIds[i])) {
          hasAllowedMorphingRenderings = true;
          break;
        }
      }
     
      //None of the morphing rendering is not allowed in this placeholder due to its setting. Don't show the morph command.
      if (!hasAllowedMorphingRenderings) {
        morphCommand.disabled = true;
      }       
    }
       
    var isPlaceholderDisabled = placeholder && !placeholder.isEnabled();   
      $sc.each(chrome.commands(), function() { 
        if (!this.click) return;
        var click = this.click.toLowerCase();
        if (click.indexOf("chrome:rendering:sort") > -1) {
          this.disabled = !Sitecore.PageModes.DesignManager.canMoveRendering(chrome);
        }

        if (click.indexOf("chrome:rendering:delete") > -1) {
          this.disabled = isPlaceholderDisabled || hasVariations;
        }
      });    
  },
      
  onHide: function() {
    this.base();
    if (this._sorting) {
      this.sortingEnd();
    }
  },

  onReset: function() {    
    this.queryCommands();
  },

  onSave: function() {
    this.canUpdateRenderingCache = false;
  },

  positionInPlaceholder: function() {    
    var placeholder = this.getPlaceholder();    
    return placeholder ? Sitecore.LayoutDefinition.getRenderingPositionInPlaceholder(placeholder.type.placeholderKey(), this.uniqueId()) : -1;    
  },

  changeCondition: function(id, sender, preserveCacheUpdating) {
    var fieldId;
    if (sender && sender.key() == "field")
    {
      fieldId = sender.type.id();
    }

    var conditions = this.getConditions();
    if (!preserveCacheUpdating) {
      this.updateConditionCache($sc.first(conditions, function() { return this.isActive; }));
    }
                         
    Sitecore.PageModes.ChromeManager.chromeUpdating.fire(this.chrome);
    Sitecore.PageModes.ChromeOverlay.showOverlay(this.chrome);
   
    var cachedElements = Sitecore.PageModes.Personalization.RenderingCache.getCachedCondition(this.chrome, id);
    if (cachedElements) {
      Sitecore.PageModes.ChromeHighlightManager.stop();      
      this.updateOnConditionActivation(id, cachedElements, fieldId);
      Sitecore.PageModes.ChromeHighlightManager.resume();
      return;
    }
        
    var options = Sitecore.PageModes.ChromeTypes.Placeholder.getDefaultAjaxOptions("activatecondition");
    options.data.renderingUniqueId = this.uniqueId(); 
    options.data.conditionId = $sc.toShortId(id);
    options.data.url = window.location.href;       
    options.context = this;
    options.beforeSend = $sc.noop();
    options.complete = $sc.noop();
    options.error = function(xhr, error) {
      console.error(xhr.statusText + ":" + error);
      this._endActivation("changecondition");
      Sitecore.PageModes.ChromeManager.resetSelectionFrame();      
    };

    options.success = function(serverData) {               
        var data = Sitecore.PageModes.Utility.parsePalleteResponse(serverData);        
        Sitecore.PageModes.ChromeHighlightManager.stop();
        if (data.url != null) {          
           this.getPlaceholder().type.loadRenderingFromUrl(data.url, $sc.proxy(function(callbackData) {
              if (callbackData.error == null) {                                                
                this.updateOnConditionActivation(id, callbackData.renderingElement.combined, fieldId);
              }
              else {
                console.error(callbackData.error);
                this._endActivation("changecondition");
                Sitecore.PageModes.ChromeManager.resetSelectionFrame();
              }

              Sitecore.PageModes.ChromeHighlightManager.resume();
            }, this)); 
        }
        else {            
          Sitecore.PageModes.Utility.tryAddStyleSheets(data.styleSheets);
          Sitecore.PageModes.Utility.tryAddScripts(data.scripts);          
          this.updateOnConditionActivation(id, $sc(data.html), fieldId);
          Sitecore.PageModes.ChromeHighlightManager.resume();
        }
    };

    $sc.ajax(options);
  },

  changeVariation: function(id, sender, preserveCacheUpdating) {
    var fieldId;
    if (sender && sender.key() == "field")
    {
      fieldId = sender.type.id();
    }
    
    if (!preserveCacheUpdating) {
      this.updateVariationCache($sc.first(this.getVariations(), function() { return this.isActive; }));
    }

    Sitecore.PageModes.ChromeManager.chromeUpdating.fire(this.chrome);
    Sitecore.PageModes.ChromeOverlay.showOverlay(this.chrome);
    var cachedElems = Sitecore.PageModes.Testing.RenderingCache.getCachedVariation(this.chrome, id);
    if (cachedElems) {
      Sitecore.PageModes.ChromeHighlightManager.stop();      
      this.updateOnVariationActivation(id, cachedElems, fieldId);
      Sitecore.PageModes.ChromeHighlightManager.resume();
      return;
    }

    var options = Sitecore.PageModes.ChromeTypes.Placeholder.getDefaultAjaxOptions("activatevariation");
    options.data.renderingUniqueId = this.uniqueId(); 
    options.data.variationId = $sc.toShortId(id);
    options.data.url = window.location.href;       
    options.context = this;
    options.beforeSend = $sc.noop();
    options.complete = $sc.noop();
    options.error = function(xhr, error) {
      console.error(xhr.statusText + ":" + error);
      this._endActivation("changevariation");
      Sitecore.PageModes.ChromeManager.resetSelectionFrame();      
    };

    options.success = function(serverData) {               
        var data = Sitecore.PageModes.Utility.parsePalleteResponse(serverData);        
        Sitecore.PageModes.ChromeHighlightManager.stop();
        if (data.url != null) {          
           this.getPlaceholder().type.loadRenderingFromUrl(data.url, $sc.proxy(function(callbackData) {
              if (callbackData.error == null) {                                                
                this.updateOnVariationActivation(id, callbackData.renderingElement.combined, fieldId);
              }
              else {
                console.error(callbackData.error);
                this._endActivation("changevariation");
                Sitecore.PageModes.ChromeManager.resetSelectionFrame();
              }

              Sitecore.PageModes.ChromeHighlightManager.resume();
            }, this)); 
        }
        else {            
          Sitecore.PageModes.Utility.tryAddStyleSheets(data.styleSheets);
          Sitecore.PageModes.Utility.tryAddScripts(data.scripts);          
          this.updateOnVariationActivation(id, $sc(data.html), fieldId);
          Sitecore.PageModes.ChromeHighlightManager.resume();
        }
    };

    $sc.ajax(options);
  },

  onDelete: function (preserveData) {
    this.base(preserveData);
    if (!preserveData) {
      if (this.saveHandler) {
        Sitecore.PageModes.PageEditor.onSave.stopObserving(this.saveHandler);
      }

      if (this.resetHandler) {
        Sitecore.PageModes.PageEditor.onSave.stopObserving(this.resetHandler);
      }
    }   
  },
  
  renderingId: function() {
    return this.chrome.data.custom.renderingID;
  },
   
  sort: function() {        
    Sitecore.PageModes.DesignManager.sortingStart(this.chrome);
    this._sorting = true;
    
    Sitecore.PageModes.ChromeManager.selectionFrame().controls.hide();        
    Sitecore.PageModes.ChromeManager.moveControlFrame().show(this.chrome);
  },
  
  sortingEnd: function() {
    Sitecore.PageModes.DesignManager.sortingEnd();
    Sitecore.PageModes.ChromeManager.moveControlFrame().hide();
    this._sorting = false;
  },
  
  uniqueId: function() {
    return this.chrome.openingMarker().attr("id").substring(2);
  },
  
  update: function(data) {
    var html, updateChromeData = false;
    
    if ($sc.type(data) === "string") {
      html = data;
    }
    else {
      html = data.html;
      updateChromeData = data.updateChromeData;
    }
    
    if (!html) {
      throw "Argument 'html' cannot be empty";
    }

    var fragmnet = document.createDocumentFragment();
    var newElements = $sc(html).appendTo(fragmnet);        
    if (!newElements) {
      return;
    }

    var elements = this.elements($sc(newElements[0]));            
    this.chrome.onDelete(true);   
    /* todo: rewrite to avoid going too much into Chrome's responsibility. */
    if (updateChromeData) {
      var dataNode = this.dataNode(elements.opening);
      this.chrome.setData(dataNode);
      var marker = this.chrome.openingMarker();
      if (marker && dataNode) {
        // Dirty hack. Persist the chrome data html into a DOM node in order it could be successfully
        // placed into html cache.
        marker[0].innerHTML = dataNode[0].innerHTML;
      }      
    }
        
    this.chrome.empty();
    this.chrome.append(elements.content);                
    this.canUpdateRenderingCache = true;
  },

  updateConditionCache: function(condition) {
    if (!this.canUpdateRenderingCache) {
      return;
    }

    if (condition) {
      var nodes = this.chrome.elementsAndMarkers().clone(false,false);      
      Sitecore.PageModes.Personalization.RenderingCache.cacheCondition(this.chrome, condition, nodes);
    }
  },
  
  updateVariationCache: function(variation) {
    if (!this.canUpdateRenderingCache) {
      return;
    }

    if (variation) {
      var nodes = this.chrome.elementsAndMarkers().clone(false,false);
      Sitecore.PageModes.Testing.RenderingCache.cacheVariation(this.chrome, variation, nodes);
    }
  }, 
  
  updateOnConditionActivation: function(conditionId, markersAndElements, fieldId) {            
    var conditions = this.getConditions();
    for (var i = 0; i < conditions.length; i++) {
      if (conditions[i].id === conditionId) {
        conditions[i].isActive = true;
        Sitecore.PageModes.Personalization.ConditionStateStorage.setConditionActive(this.uniqueId(), conditionId);        
      }
      else {
        conditions[i].isActive = false;
      }
    }
    
    this._startActivation(markersAndElements, "changecondition", fieldId);       
  },

  updateOnVariationActivation: function(variationId, markersAndElements, fieldId) {
    for (var i = 0; i < this._variations.length; i++) {
      this._variations[i].isActive = this._variations[i].id === variationId;
    }
   
    this._startActivation(markersAndElements, "changevariation", fieldId);
  },

  _endActivation: function(startReason) {
    Sitecore.PageModes.ChromeManager.onChromeUpdated(this.chrome, startReason);
    Sitecore.PageModes.ChromeOverlay.hideOverlay();
  },

  _startActivation: function(markersAndElements, reason, fieldId) {
    var delay = Sitecore.PageModes.ChromeOverlay.getShowingDuration();       
    
    setTimeout($sc.proxy(function() {   
      Sitecore.PageModes.ChromeManager.ignoreDOMChanges = true;
      Sitecore.PageModes.ChromeHighlightManager.stop();          
      Sitecore.PageModes.ChromeManager.select(null);                       
      
      this.update({html: markersAndElements, updateChromeData: this.selectable()});                                                  
      
      Sitecore.PageModes.ChromeManager.resetChromes();
      
      this.chrome.reload();
      if (!fieldId) {
        Sitecore.PageModes.ChromeManager.select(this.chrome); 
      }
           
      // If condition activation was initiated by the the field try to select it.
      if (fieldId) {           
        var deep = true;
        var field = this.chrome.getChildChromes(function() {
                                                return this && this.key() == "field" && 
                                                        this.isEnabled() && this.type.id() == fieldId;
                                                }, deep)[0];
        if (field) {
          Sitecore.PageModes.ChromeManager.select(field);       
        }
        else {
          Sitecore.PageModes.ChromeManager.select(this.chrome);       
        }                                   
      }
                  
      Sitecore.PageModes.ChromeManager.ignoreDOMChanges = false;
      Sitecore.PageModes.ChromeHighlightManager.resume();
      this._endActivation(reason);
    }, this), delay); 
  }
},
{
  renderPersonalizationCommand : function(command, isMoreCommand, chromeControls) {        
    command.enabledWhenReadonly = true;    
    command.disabled = false;
    var hasVariations = this.getVariations().length > 0;
    if (hasVariations || !Sitecore.PageModes.PageEditor.isPersonalizationAccessible()) {
      command.disabled = true;
      if (hasVariations) {
        return false; 
      }          
    }
        
    if (isMoreCommand) {
      return false;
    }

    if (this.getConditions().length <= 1) {
      if (!Sitecore.PageModes.PageEditor.isPersonalizationAccessible()) {
        return null;        
      }

      return false;
    }

    if (!Sitecore.PageModes.ChromeTypes.Rendering.personalizationBar) {      
      Sitecore.PageModes.ChromeTypes.Rendering.personalizationBar = new Sitecore.PageModes.RichControls.Bar(
        new Sitecore.PageModes.Personalization.Panel(),
        new Sitecore.PageModes.Personalization.DropDown()
      );
    }
    
    var context = new Sitecore.PageModes.Personalization.ControlsContext(this.chrome, chromeControls, command);
    if (!Sitecore.PageModes.PageEditor.isControlBarVisible()) {
      return Sitecore.PageModes.ChromeTypes.Rendering.personalizationBar.renderHidden(
        context,        
        Sitecore.PageModes.Texts.Analytics.ChangeCondition, 
        "/sitecore/shell/~/icon/PeopleV2/16x16/users3.png");
    }
    
    var ctrl = Sitecore.PageModes.ChromeTypes.Rendering.personalizationBar.render(context)
    chromeControls.commands.append(ctrl);     
    return false;    
  },

  renderEditVariationsCommand: function (command, isMoreCommand, chromeControls) {
    command.enabledWhenReadonly = true;
    if (Sitecore.PageModes.PageEditor.isTestRunning() || !Sitecore.PageModes.PageEditor.isTestingAccessible()) {
      command.disabled = true;
    }

    if (isMoreCommand) {
      return false;
    }
   
    if (this.getVariations().length <= 1) {      
      if (!Sitecore.PageModes.PageEditor.isTestingAccessible()) {
        return null;        
      }

      return false;
    }

    if (!Sitecore.PageModes.ChromeTypes.Rendering.testingBar) {      
      Sitecore.PageModes.ChromeTypes.Rendering.testingBar = new Sitecore.PageModes.RichControls.Bar(
        new Sitecore.PageModes.Testing.Panel("scTestingPanel"),
        new Sitecore.PageModes.Testing.DropDown()
      );
    }
    
    var context = new Sitecore.PageModes.Testing.ControlsContext(this.chrome, chromeControls, command);
    if (!Sitecore.PageModes.PageEditor.isControlBarVisible()) {
      return Sitecore.PageModes.ChromeTypes.Rendering.testingBar.renderHidden(
        context,
        Sitecore.PageModes.Texts.Analytics.ChangeVariation        
       );
    }
    
    var ctrl = Sitecore.PageModes.ChromeTypes.Rendering.testingBar.render(context)
    chromeControls.commands.append(ctrl);     
    return false;
  }
});﻿Sitecore.PageModes.ChromeTypes.Field = Sitecore.PageModes.ChromeTypes.ChromeType.extend({
  constructor: function() {
    this.base();
    //Key codes which aren't tracked as ones that modify contenteditable fields
    this._ignoreKeyCodes = [16, 17, 18, 27, 35, 36, 37, 38, 39, 40];    
  },

  load: function() {           
    var persistedValue = Sitecore.PageModes.ChromeManager.getFieldValueContainerById(this.controlId());
    var fieldValueInput = this.chrome.element.prev().prev(".scFieldValue");
    if (fieldValueInput.length == 0) {
      fieldValueInput = null;
    }
            
    if (persistedValue) {
      this.fieldValue = $sc(persistedValue);
      if (fieldValueInput) {                                
        fieldValueInput.remove();
      }
    }
    else {      
      if (fieldValueInput) {
        this.fieldValue = fieldValueInput;
        Sitecore.PageModes.ChromeManager.addFieldValue(this.fieldValue);
      }
      else {  
        this.fieldValue = $sc({});
      }
    }
                    
    var modifiedControlId = this.fieldValue.data("modified"); 
    if (modifiedControlId && modifiedControlId !== this.controlId()) {
      this.setReadOnly();
      var notification = new Sitecore.PageModes.Notification("fieldchanges", Sitecore.PageModes.Texts.ContentWasEdited,
        {
          actionText: Sitecore.PageModes.Texts.SaveThePageToSeeTheChanges, 
          onActionClick:  $sc.proxy(Sitecore.PageModes.PageEditor.save, Sitecore.PageModes.PageEditor),
          type: "warning"
        });

      Sitecore.PageModes.PageEditor.notificationBar.addNotification(notification);
      Sitecore.PageModes.PageEditor.showNotificationBar();
    }

    this.initialAttributes = new Object();    
    if (this.chrome.element.attr("sc_parameters")) {
      this.parameters = $sc.parseQuery(this.chrome.element.attr("sc_parameters"));
    }
    else {
      this.parameters = new Object();
    }
    
    this.parentLink = this.chrome.element.closest("a").get(0);
    this.fieldType = this.chrome.element.attr("scfieldtype");
    this.onMouseDownHandler = $sc.proxy(this.onMouseDown, this); 
    this.chrome.element.mousedown(this.onMouseDownHandler);
   
    if (this.contentEditable()) {     
      if (this.chrome.element.attr("scWatermark") == "true") {        
        this.watermarkHTML = this.chrome.element.html();        
      }
     
      this.onKeyDownHandler = $sc.proxy(this.onKeyDown, this);
      this.onKeyUpHandler = $sc.proxy(this.onKeyUp, this);
      this.onCutPasteHandler = $sc.proxy(this.onCutPaste, this);
      this.onClickHandler = $sc.proxy(this.onClick, this);
      this.onBlurHandler = $sc.proxy(this.onBlur, this);     
      this.capabilityChangedHandler = $sc.proxy(this.setContentEditableState, this);
      Sitecore.PageModes.PageEditor.onCapabilityChanged.observe(this.capabilityChangedHandler);      
      this.saveHandler = $sc.proxy(this.onSave, this);
      Sitecore.PageModes.PageEditor.onSave.observe(this.saveHandler);
      this.setContentEditableState();
      // IE doesn't return calculated values for current style.
      if ($sc.util().isIE) {       
        var dummy = $sc("<div style='height:0px;width:1em;position:absolute'></div>");        
        this.chrome.element.parent().append(dummy);
        this.fontSize = dummy.get(0).offsetWidth;
        dummy.remove();
      }
      else {
        this.fontSize = parseInt(this.chrome.element.css("font-size"));       
      }
    }

    if (Sitecore.PageModes.Personalization) {
      Sitecore.PageModes.ChromeControls.registerCommandRenderer(
        "chrome:rendering:personalize",
        Sitecore.PageModes.ChromeTypes.Field.renderPersonalizationCommand,
        this);
    }
    
    if (Sitecore.PageModes.Testing) {
      Sitecore.PageModes.ChromeControls.registerCommandRenderer(
        "chrome:rendering:editvariations",
        Sitecore.PageModes.ChromeTypes.Field.renderEditVariationsCommand,     
        this);
    }    
  },

  // attaches content editable elements specific event handlers
  attachEventHandlers: function() {    
    this.chrome.element.bind("keyup", this.onKeyUpHandler);
    this.chrome.element.bind("keydown", this.onKeyDownHandler);
    this.chrome.element.bind("paste",  this.onCutPasteHandler);
    this.chrome.element.bind("cut", this.onCutPasteHandler);
    this.chrome.element.bind("click", this.onClickHandler);
    this.chrome.element.bind("blur", this.onBlurHandler);    
  },

  contentEditable: function() {
    var attrValue = this.chrome.element.attr(Sitecore.PageModes.ChromeTypes.Field.contentEditableAttrName);
    return attrValue === "true" || attrValue === "false";
  },

  // detaches content editable elements specific event handlers
  detachEventHandlers: function() {    
    this.chrome.element.unbind("keyup", this.onKeyUpHandler);
    this.chrome.element.unbind("keydown", this.onKeyDownHandler);
    this.chrome.element.unbind("paste",  this.onCutPasteHandler);
    this.chrome.element.unbind("cut", this.onCutPasteHandler);
    this.chrome.element.unbind("click", this.onClickHandler);
    this.chrome.element.unbind("blur", this.onBlurHandler);
  },

  dataNode: function(domElement) {
    return domElement.prev(".scChromeData");       
  },
  
  handleMessage: function(message, params) {
    switch (message) {
      case "chrome:field:insertimage":
        this.insertImage();
        break;
      case "chrome:field:imageinserted":
        this.imageInserted(params.html);
        break;
      case "chrome:field:insertlink":
        this.insertLink();
        break;
      case "chrome:field:linkinserted":
        this.linkInserted(params.url);
        break;
      case "chrome:field:editcontrol":             
        var chars = this.characteristics();
        this.editControl(chars.itemId, chars.language, chars.version, chars.fieldId, this.controlId(), params.command);
        break;
      case "chrome:field:editcontrolcompleted":
        this.editControlCompleted(params.value, params.plainValue, params.preserveInnerContent);
        break;
      case "chrome:field:execute":
        this.execute(params.command, params.userInterface, params.value);
        break;     
      case "chrome:personalization:conditionchange": case "chrome:rendering:personalize": case "chrome:rendering:editvariations": case "chrome:testing:variationchange":
        this.delegateMessageHandling(this.chrome, this.parentRendering(), message, params);        
        break;
      case "chrome:rendering:personalizationcompleted": case "chrome:rendering:editvariationscompleted":
        Sitecore.PageModes.ChromeManager.select(this.chrome);
        this.delegateMessageHandling(this.chrome, this.parentRendering(), message, params);               
        break;      
    }
  },
    
  isEnabled: function() {
    return $sc.inArray(Sitecore.PageModes.Capabilities.edit, Sitecore.PageModes.PageEditor.getCapabilities()) > -1 && this.base();
  },

  isFieldValueContainer: function(node) {
    return this.fieldValue && this.fieldValue.get(0) == node;
  },
  
  layoutRoot: function() {
    if (this.contentEditable()) {
      return this.chrome.element;
    }

    var children = this.chrome.element.children();
    if (children.length == 1) {
      return $sc(children[0]);
    }

    return this.chrome.element;
  },

  persistValue: function() {
    if (this.isWatermark()) return;    
       
    var html = this.chrome.element.html();
    if (this._extraLineBreakAdded) {
      var clone = this.chrome.element.clone();
      clone.find(".scExtraBreak").remove();     
      html = clone.html();      
    }
    
    this.fieldValue.val(html);
    this.chrome.element.removeAttr("scWatermark");
  },

  refreshValue: function() {
    if (this.contentEditable()) {
      this.chrome.element.update(this.fieldValue.val());
      this._tryUpdateFromWatermark();
      this.setModified();
    }
  },
  
  // Sets whether content editable elements are editable (depends on the mode(Edit, Design etc.))
  setContentEditableState: function() {
    if (this.contentEditable()) {
      var isEditable = this.isEnabled() && !this.isReadOnly();
      this.chrome.element.attr(Sitecore.PageModes.ChromeTypes.Field.contentEditableAttrName, isEditable.toString());
      if (isEditable) {
        this.attachEventHandlers();
      }
      else {
        this.detachEventHandlers();
      }
    }
  },

  setReadOnly: function() {
    this.base();
    this.setContentEditableState();    
  },
    
  /*--- Helpers section ---*/
  controlId: function() {
    return this.chrome.element.attr("id").replace("_edit", "");
  },

  convertToGuid: function(shortId) {
    return "{" + shortId.substr(0, 8) + "-" + shortId.substr(8, 4) + "-" + shortId.substr(12, 4) + "-" + shortId.substr(16, 4) + "-" + shortId.substr(20, 12) + "}";
  },

  characteristics: function() {
    //ID format:fld_ItemID_FieldID_Language_Version_Revision_edit
    var fieldCharacteristics = this.controlId().split('_');
    return {
      itemId: this.convertToGuid(fieldCharacteristics[1]),
      fieldId: this.convertToGuid(fieldCharacteristics[2]),
      language: fieldCharacteristics[3],
      version: fieldCharacteristics[4]
    };
  },

  id: function() {
    var chars = this.characteristics();
    return chars.fieldId;
  },
  
  insertHtmlFragment: function (html) {
    if (!this.selection) {
      return false;
    }

    if (document.selection && document.selection.createRange) {//IE
      this.selection.pasteHTML(html);
      return true;
    }

    if (window.getSelection && window.getSelection().getRangeAt) {//FF
      var node = this.selection.createContextualFragment(html);
      this.selection.insertNode(node);
      return true;
    }

    return false;
  },

  isWatermark: function() {
    return this.watermarkHTML == this.chrome.element.html();
  },

  /*--- Commands section---*/
  editControl: function(itemid, language, version, fieldid, controlid, message) {
    var control = Sitecore.PageModes.ChromeManager.getFieldValueContainerById(controlid);
    if (control == null) {
      console.error("control with id " + controlid + " not found");
      return;  
    }

    var plainValue = control.value;
    control = $sc("#" + controlid + "_edit");
    var value = control.html();
    var parameters = control.attr("sc_parameters");

    var ribbon = Sitecore.PageModes.PageEditor.ribbon();
    if (ribbon != null) {
      ribbon.contentWindow.scForm.browser.getControl("scHtmlValue").value = value;
      ribbon.contentWindow.scForm.browser.getControl("scPlainValue").value = plainValue;
      Sitecore.PageModes.PageEditor.postRequest(
          message + '(itemid=' + itemid + ',language=' + language + ',version=' + version + ',fieldid=' +
          fieldid + ',controlid=' + controlid + ',webeditparams=' + parameters + ')', null, false);
    }

    return false;
  },

  editControlCompleted: function(value, plainValue, preserveInnerContent) {
    this.fieldValue.val(typeof(plainValue) != "undefined" ? plainValue : value);
    if (!preserveInnerContent) {
      this.chrome.element.update(value);
    }
    else {
      var targetCtl = this.chrome.element.get(0).firstChild;
      var wrapper = document.createElement("span"); 
      wrapper.innerHTML = value;
      var sourceCtl = wrapper.firstChild;
      $sc.util().copyAttributes(sourceCtl, targetCtl);
      delete wrapper;                      
    }           
    
    this.setModified();
  },
  
  execute: function(command, userInterface, value) {
    if ($sc.browser.mozilla) {
      document.execCommand(command, null, null);
    }
    else {
      document.execCommand(command, userInterface, value);
    }

    // OnTime issue #341414
    this.persistValue()
    this.setModified();
    return false;
  },

  hasParentLink: function() {
    return this.parentLink != null;
  },

  insertImage: function () {
    this.chrome.element.focus();
    if (document.selection && document.selection.createRange) {
      this.selection = document.selection.createRange();
    }
    else if (window.getSelection && window.getSelection().getRangeAt) {
      this.selection = window.getSelection().getRangeAt(0);
    }

    var chars = this.characteristics();
    var parameters = this.chrome.element.attr("sc_parameters");
    Sitecore.PageModes.PageEditor.postRequest(
              "webedit:insertimage" + '(placement=cursor,itemid=' + chars.itemId + ',language=' +
              chars.language + ',version=' + chars.version + ',fieldid=' + chars.fieldId +
              ',controlid=' + this.controlId() + ',webeditparams=' + parameters + ')', null, false);

    return false;
  },

  imageInserted: function(html) {
    this.chrome.element.focus();
    if (this.insertHtmlFragment(html)) {
      this.setModified();
    }
  },

  insertLink: function() {
    var selectionText;  
    // MSIE
    if (document.selection && document.selection.createRange) {
      this.selection = document.selection.createRange();
      selectionText = this.selection.text;
    }
    else if (window.getSelection && window.getSelection().getRangeAt) {
      this.selection = window.getSelection().getRangeAt(0);
      selectionText = this.selection.toString();
    }
    
    if ($sc.trim(selectionText) == "") {
      alert(Sitecore.PageModes.Texts.SelectSomeText);
      return;
    }

    var chars = this.characteristics();
    this.editControl(chars.itemId, chars.language, chars.version, chars.fieldId, this.controlId(), "webedit:insertlink");
  },
  
  linkInserted: function(url) {
    var isIE = document.selection && document.selection.createRange;
    
    if (!this.selection) {
      return;
    }

    // TODO: add preserving link contents for FF.
    var data = {
      html: isIE ? this.selection.htmlText : this.selection.toString(),
      url: url
    };

    // If link is selected, replace it with a new one, preserving link contents.
    if (isIE) {      
      // OT issue#338106
      data.html = this._processHtml(data.html);
      var htmlSelection = $sc.trim(data.html.toLowerCase()) || "";
      if (htmlSelection.indexOf("<a ") == 0 && htmlSelection.indexOf("</a>") == (htmlSelection.length - "</a>".length)) {
        htmlSelection = data.html.substring(data.html.indexOf(">") + 1);
        htmlSelection = htmlSelection.substring(0, htmlSelection.length - "</a>".length);
        data.html = htmlSelection;
      }
    }

    var htmlToInsert = "<a href='" + data.url + "'>" + data.html + "</a>";
    if (isIE) {
      this.selection.pasteHTML(htmlToInsert);
    }
    else {
      var node = this.selection.createContextualFragment(htmlToInsert);
      this.selection.deleteContents();
      this.selection.insertNode(node);
    }

    this.setModified();
  },

  key: function() {
    return "field";
  },

  parentRendering: function() {
    var excludeFake = true;
    // The designing capablity may be turned off or user may not have designing rights    
    var enabledOnly = false;
    var chrome = this.chrome.parent(excludeFake, enabledOnly);    
    if (!this._parentRendering) {
      while (chrome && chrome.key() != "rendering") {
        chrome = chrome.parent(excludeFake, enabledOnly);
      }

      this._parentRendering = chrome;           
    }

    return this._parentRendering;
  },

  setModified: function() {
    if(!Sitecore.PageModes.PageEditor.isLoaded()) {
      return;
    }

    Sitecore.PageModes.PageEditor.setModified(true);    
    this.fieldValue.data("modified", this.controlId());
  },

  /*---Event handlers section---*/
  onBlur: function(e) {   
    this.persistValue();    
    this._tryUpdateFromWatermark();                
  },

  onClick: function(e) {
    if (!this.active) {          
      return;
    }

    if (this.isWatermark()) {
      this.chrome.element.update("");
      //Trick to make Chrome set focus on content editable element
      if ($sc.browser.webkit) {        
        var range = document.createRange();
        range.selectNodeContents(this.chrome.element.get(0));
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);        
      }
    }
    // Restore original values saved in MouseDown handler
    this._restoreInitialStyles();
  },

  onCutPaste: function(e) {
    if (!this.active) {
      e.preventDefault();      
      return;
    }
        
    this.setModified();
  },

  onDelete: function() {
    if (this.saveHandler) {
      Sitecore.PageModes.PageEditor.onSave.stopObserving(this.saveHandler);
    }

    if (this.capabilityChangedHandler) {
      Sitecore.PageModes.PageEditor.onCapabilityChanged.stopObserving(this.capabilityChangedHandler);
    }
  },

  onHide: function() {   
    this.active = false;
    if (this.parentLink && this.initialAttributes.linkTextDecoration != null) {
      this.parentLink.style.textDecoration = this.initialAttributes.linkTextDecoration;
    }

    this._restoreInitialStyles();    
  },

  onKeyDown: function(e) {
    if (!this.active) {
      e.preventDefault();
      return;
    }

    if (e.keyCode == 13) {
      if (this.parameters["prevent-line-break"] === "true") {
        e.stop();
        return;
      }
      
      if (this.parameters["linebreak"] == "br") {        
        e.stop();
        this._insertLineBreak();                
      }
    }
  },

  onKeyUp: function(event) {
    if ($sc.inArray(event.keyCode, this._ignoreKeyCodes) > -1) return;
    if (this.fieldValue.val() != event.currentTarget.innerHTML) {
      this.setModified();
      //at least one modification has been done, so we don't need to check for modifications any more
      this.chrome.element.unbind("keyup", this.onKeyUpHanler);
    }
  },

  onMouseDown: function(e) {     
     if (!e.isLeftButton()) {
      return;
     }

     if (e.ctrlKey) {
      if (!this.isEnabled()) {
        return;
      }

      var href = null;
      if (this.hasParentLink()) {        
        href = this.parentLink.href;
        this.parentLink.onclick = function () {return false;};
        // For IE
        this.parentLink.href = "javascript:return false";
      }

      var sender = e.target;
      if (sender.tagName.toUpperCase() == "A") {
        href = sender.href;       
        sender.onclick = function () {return false;};
        // For IE
        sender.href = "javascript:return false";       
      }
       
      if (!href || href.indexOf("javascript:") == 0) {
        return;
      }
      
      e.stop();
      try 
      {
        window.location.href = href;
      }
      catch(ex) {
      //silent
      }
    }
    else if (this.isEnabled() && this.contentEditable() && Sitecore.PageModes.Utility.isNoStandardsIE()) {
      // HACK FOR IE 7 issue with wrong cursor positioning in contentEditableElements
      this.initialAttributes.position = this.chrome.element.css("position");
      this.initialAttributes.zIndex = this.chrome.element.css("z-index");
      this.chrome.element.css("position", "relative");
      this.chrome.element.css("z-index", "9085");      
    }
  },

  onSave: function() {
    if (!this.isReadOnly() && Sitecore.PageModes.ChromeManager.selectedChrome() == this.chrome && this.contentEditable()) {
      this.persistValue();      
    }

    if (this.fieldValue) {
      this.fieldValue.removeData("modified");
    }
  },

  onShow: function() {    
    this.active = true;
    if (this.parentLink) {
      this.initialAttributes.linkTextDecoration = this.parentLink.style.textDecoration;
      this.parentLink.style.textDecoration = 'none';
    }    
  },

  getConditions: function() {
    var r = this.parentRendering();

    if (!r) {
      return [];
    }

    return r.type.getConditions();    
  },

  getVariations: function() {
    var r = this.parentRendering();

    if (!r) {
      return [];
    }

    return r.type.getVariations();    
  },

  _insertLineBreak: function() {
    var range, tmpRange, lineBreak, extraLineBreak, selection;
    // MSIE
    if (document.selection && document.selection.createRange) {
      this.insertHtmlFragment("<br/>");
      // Moving caret to new position
      range = document.selection.createRange();          
      range.select();
      return;
    }
   
    // Unsupported browser
    if (!document.createRange || !window.getSelection) {
      return;
    }

    // W3C compatible browser
    lineBreak = document.createElement("br");              
    range = window.getSelection().getRangeAt(0);      
    tmpRange = document.createRange();      
    tmpRange.selectNodeContents(this.chrome.element[0]);
    tmpRange.collapse(false);      
    tmpRange.setStart(range.startContainer, range.startOffset);
    // Adding 2 <br/> tags in case of pressing 'enter' while cursor is in the last position.
    // This trick forces cursor to move to the new line
    if (!tmpRange.toString() && !this.chrome.element.find(".scExtraBreak").length) {
      var extraLineBreak = document.createElement("br");      
      extraLineBreak.className = "scExtraBreak";
      range.insertNode(extraLineBreak);
      this._extraLineBreakAdded = true;
    } 
      
    range.insertNode(lineBreak);    
    tmpRange = document.createRange();
    tmpRange.selectNode(lineBreak);
    tmpRange.collapse(false);            
    // Moving cursor
    selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(tmpRange);
  },

  _processHtml: function(html) {
    if (!html) {
      return html;
    }

    var tmp, fieldContainer;
    try {
      tmp = $sc("<div></div>").html(html);
      fieldContainer = tmp.children(".scWebEditInput").eq(0);
    }
    catch(e) {
      Sitecore.PageModes.Utility.log("Failed to process html: " +  html);
    }

    return fieldContainer && fieldContainer.length ? fieldContainer.html() : html;
  },

  _restoreInitialStyles: function() {
    if (this.initialAttributes.position != null && this.initialAttributes.zIndex != null) {
      this.chrome.element.css("position", this.initialAttributes.position);
      this.chrome.element.css("z-index", this.initialAttributes.zIndex);
      this.initialAttributes.position = null;
      this.initialAttributes.zIndex = null;
    }
  },

  _tryUpdateFromWatermark: function() {
    if (this.watermarkHTML && 
        (this.chrome.element.html() == "" || this.fieldType == "text" && $sc.removeTags(this.chrome.element.html()) == "" )) {
          this.chrome.element.update(this.watermarkHTML);
          this.chrome.element.attr("scWatermark", "true");
    }
  } 
},
{
  contentEditableAttrName: $sc.util().isNoStandardsIE() ? "contentEditable" : "contenteditable",  
  renderPersonalizationCommand : function(command, isMoreCommand, chromeControls) {
    //Avoid duplication of condition personalization controls when there are nested fields.
    if (this.chrome.isFake()) {
      return null;
    }

    var rendering = this.parentRendering();
    if (!rendering) {
      return null;
    }
        
    command.disabled = false;
    var hasVariations = rendering.type.getVariations().length > 0;
    if (hasVariations || !Sitecore.PageModes.PageEditor.isPersonalizationAccessible()) {
      command.disabled = true;
      if (hasVariations) {
        return false;
      }                
    }
    
    // Personalization command should be enabled even for readonly fields
    command.enabledWhenReadonly = true;
    if (isMoreCommand) {
      return false;
    }
    
    var conditions = this.getConditions();
    var tag = null;
    if (conditions.length <=1 ) {
      if (!Sitecore.PageModes.PageEditor.isPersonalizationAccessible()) {
        return null;        
      }
      
      tag = chromeControls.renderCommandTag(command, this.chrome, isMoreCommand);
      if (!tag) {              
        return false;
      }
    }
    
    var retValue;
    if (!tag) {
      var context = new Sitecore.PageModes.Personalization.ControlsContext(this.chrome, chromeControls, command);
      if (!Sitecore.PageModes.ChromeTypes.Rendering.personalizationBar) {      
        Sitecore.PageModes.ChromeTypes.Rendering.personalizationBar = new Sitecore.PageModes.RichControls.Bar(
          new Sitecore.PageModes.Personalization.Panel(),
          new Sitecore.PageModes.Personalization.DropDown());
      }
    
      var context = new Sitecore.PageModes.Personalization.ControlsContext(this.chrome, chromeControls, command);
      if (!Sitecore.PageModes.PageEditor.isControlBarVisible()) {
        tag = Sitecore.PageModes.ChromeTypes.Rendering.personalizationBar.renderHidden(
                context,        
                Sitecore.PageModes.Texts.Analytics.ChangeCondition, 
                "/sitecore/shell/~/icon/PeopleV2/16x16/users3.png");
      }
      else {
        tag = Sitecore.PageModes.ChromeTypes.Rendering.personalizationBar.render(context)
        chromeControls.commands.append(tag);
        retValue = false;             
      }
    }
   
    if (tag) {
      tag.mouseenter($sc.proxy(function() {
          var r = this.parentRendering();
          if (r) {
            r.showHover();
          }
      }, this));

      tag.mouseleave($sc.proxy(function() {
        var r = this.parentRendering();
          if (r) {
            r.hideHover();
          }
      }, this));
    }

    if (typeof(retValue) == "undefined") {
      retValue = tag;  
    }
    
    return retValue;
  },

  renderEditVariationsCommand: function(command, isMoreCommand, chromeControls) {
     if (this.chrome.isFake()) {
      return null;
    }

    var rendering = this.parentRendering();
    if (!rendering) {
      return null;
    }
    
    var tag = null;
    var variations = this.getVariations();
    command.disabled = false;
    if (!Sitecore.PageModes.PageEditor.isTestingAccessible()) {
      command.disabled = true;  
    }
        
    if (variations.length <= 1) {     
      if (!Sitecore.PageModes.PageEditor.isTestingAccessible()) {
        return null;        
      }

      tag = chromeControls.renderCommandTag(command, this.chrome, isMoreCommand);
      if (!tag) {              
        return false;
      }            
    }

    // Personalization command should be enabled even for readonly fields
    command.enabledWhenReadonly = true;
    if (isMoreCommand) {
      return false;
    }
                
    var retValue;
    if (!tag) {
      if (!Sitecore.PageModes.ChromeTypes.Rendering.testingBar) {      
        Sitecore.PageModes.ChromeTypes.Rendering.testingBar = new Sitecore.PageModes.RichControls.Bar(
          new Sitecore.PageModes.Testing.Panel("scTestingPanel"),
          new Sitecore.PageModes.Testing.DropDown()
        );
      }
    
      var context = new Sitecore.PageModes.Testing.ControlsContext(this.chrome, chromeControls, command);
      if (!Sitecore.PageModes.PageEditor.isControlBarVisible()) {
        tag = Sitecore.PageModes.ChromeTypes.Rendering.testingBar.renderHidden(
          context,        
          Sitecore.PageModes.Texts.Analytics.ChangeVariation);
      }
      else {
        tag = Sitecore.PageModes.ChromeTypes.Rendering.testingBar.render(context)
        chromeControls.commands.append(tag);
        retValue = false;             
      }
    }
   
    if (tag) {
      tag.mouseenter($sc.proxy(function() {
          var r = this.parentRendering();
          if (r) {
            r.showHover();
          }
      }, this));

      tag.mouseleave($sc.proxy(function() {
        var r = this.parentRendering();
          if (r) {
            r.hideHover();
          }
      }, this));
    }

    if (typeof(retValue) == "undefined") {
      retValue = tag;  
    }
    
    return retValue;
  }
});
﻿Sitecore.PageModes.ChromeTypes.EditFrame = Sitecore.PageModes.ChromeTypes.ChromeType.extend({
  constructor: function() {
    this.base();
    this._editFrameUpdating = false;
    this.fieldsChangedDuringFrameUpdate = false;
  },
  
  handleMessage: function(message, params) {
    switch (message) {
      case "chrome:editframe:updatestart":
        this.updateStart();
        break;
      case "chrome:editframe:updateend":
        this.updateEnd();
        break;
    }
  },

  isEnabled: function() {
    return $sc.inArray(Sitecore.PageModes.Capabilities.edit, Sitecore.PageModes.PageEditor.getCapabilities()) > -1 && this.base();
  },

  key: function() {
    return "editframe";
  },

  load: function() {
  },

  updateStart: function() {  
    this._editFrameUpdating = true;
    this.fieldsChangedDuringFrameUpdate = false;    
  },

  updateEnd: function() {
    if (this.fieldsChangedDuringFrameUpdate) {
      this.chrome.element.addClass("scWebEditFrameModified");      
    }

    this._editFrameUpdating = false;
    this.fieldsChangedDuringFrameUpdate = false;
  }
});﻿// Class defines logic for Word document field in inline edititng mode
Sitecore.PageModes.ChromeTypes.WordField = Sitecore.PageModes.ChromeTypes.Field.extend({  
  load: function() {    
    try {
      var obj = new ActiveXObject("Edraw.OfficeViewer");
    }
    catch(e) {                                                   
      this.activeXAvailable = false;
      // change the style to make all word html visible, not only inside the frame user had defined.
      var wordObj = this.wordObj();
      if (wordObj) {
        wordObj.style.height = "auto";
        wordObj.style.width = "auto";
        this.chrome.element.css({padding:"0px", margin: "0px", height: "auto", width: "auto" });
      }

      return;
    }

    this.activeXAvailable = true;
    this.initWord();
    // Dirty hack. Can we find modified event in .ocx?   
    this.intervalID = setInterval($sc.proxy(this._checkWordFieldModified, this), 1000);
    this.onSaveHandler = $sc.proxy(function() {
      var word = this.wordObj();
      if (word == null) {                            
        return;
      }

      if (!word.IsDirty && !word.fileWasOpened) {
        return;
      }
                                                   
      this.updateWordField();                         
    }, this);

    Sitecore.PageModes.PageEditor.onSave.observe(this.onSaveHandler);       
    this.adjustSize();
    this.base();
  },
  
  adjustSize: function() {
    var width = this.chrome.data.custom.editorWidth;
    var minHeight = this.chrome.data.custom.editorHeight;
    var maxHeight = this.chrome.data.custom.editorMaxHeight;
    if (width > 0 && minHeight > 0 && maxHeight > 0 && maxHeight > minHeight) {
       var wordBorderHeight = 60;
       if(maxHeight <= wordBorderHeight) {
         return;
       }
   
       var word = this.wordObj();
       if (word == null) {
         return;
       }

       var rawHTMLContainer = $sc("<span />").update(word.innerHTML).find(".scWordHtml");       
       if ( rawHTMLContainer.length < 0) return;

       height = this._getHeight(rawHTMLContainer.html(), width, maxHeight - wordBorderHeight) + wordBorderHeight;
   
       if(height <= minHeight) {
         return;
       }
   
       word.style.height = height + "px";
       var topPadding = parseInt(this.chrome.element.css("padding-top"));
       var bottomPadding = parseInt(this.chrome.element.css("padding-bottom"));
       this.chrome.element.css({height: height + topPadding + bottomPadding + "px"});
    }
  },

  handleMessage: function(message, params) {
    switch (message) {      
      case "chrome:field:word:mediainserted":
        this.insertMediaToWord(params.path, params.alt);
        break;
      case "chrome:field:word:insertLink":
        this.insertLinkToWord(params.link, params.text);
        break;
      case "chrome:field:word:toggletoolbar":
        this.toggleWordToolbar();
        break;
      default:
        this.base(message, params);
        break;      
    }
  },

  isEnabled: function() {
    return this.activeXAvailable && this.base();
  },

  initWord: function() {
    this._wordObj = null;
    var word = this.wordObj();
    if (word) {
      WordOCX_Initialize(word);
      setTimeout($sc.proxy(function() {       
        var obj = this.wordObj();
        if (obj == null) return;
        obj.CreateNew("Word.Document");
        obj.currentView = word.ActiveDocument.ActiveWindow.View.Type;        
        if (this.chrome.data.custom.downloadLink) {
          obj.Open(this.chrome.data.custom.downloadLink, "Word.Document");
        } 
        else {
          obj.CreateNew("Word.Document");
        }          
      }, this), 500);
    }
  },

  insertMediaToWord: function(imagePath, alt) {    
    var word = this.wordObj();
    if(word != null) {
      WordOCX_InsertPicture(word, imagePath, alt);  
    }
  },

  insertLinkToWord: function(link, defaultText) {
    var word = this.wordObj();
    if(word != null) {
      WordOCX_InsertLink(word, link, defaultText);  
    }
  },

  hasModifications: function() {
    var obj = this.wordObj();
    return obj && obj.IsOpened != 'undefined' && obj.IsOpened == true && obj.IsDirty == true; 
  },
  
  key: function() {
    return "word field";
  },

  layoutRoot: function() {    
    return this.chrome.element;
  },

  onDelete: function() {
    if (this.intervalID) {
      clearInterval(this.intervalID);
    }

    if (this.onSaveHandler) {
       Sitecore.PageModes.PageEditor.onSave.stopObserving(this.onSaveHandler); 
    }

    if (this._wordObj && this._wordObj.IsOpened) {
      this._wordObj.Close();
    }

    this._wordObj = null;
  },

  onHide: function() {
  },
  
  onMouseDown: function(e) {
  },   

  onShow: function() { 
  },

  toggleWordToolbar: function() {
    var word = this.wordObj();
    if(word != null) {
      WordOCX_ToggleToolbar(word);  
    }
  },

  updateWordField: function() {
     var word = this.wordObj();  
     if (word == null) {
      return;
     }

     var uploadLink = this.chrome.data.custom.uploadLink;
     if(uploadLink && (word.IsDirty || word.fileWasOpened)){
       WordOCX_UploadDocument(word, uploadLink, true);
     }

     var fieldValue = $sc(word).nextAll("input.scWordBlobValue");
     if (fieldValue.length > 0 && fieldValue[0].id.indexOf("flds_") == 0) {
        var blobID = this.chrome.data.custom.blobID;
        if (blobID) {
          fieldValue[0].value = blobID;
        }
     }
     else {
      console.error("word field value input was not found");
     }
  },

  wordObj: function() {        
    if (!this._wordObj) {
      this._wordObj = this.chrome.element.get(0).firstChild;
    }
    
    return this._wordObj;  
  },

  _checkWordFieldModified: function() {    
    if (this.hasModifications()) {
      Sitecore.PageModes.PageEditor.setModified(true);
    }
  },

  _getHeight: function(html, width, maxHeight) {
      if(html == "") {
        return -1;
      }

      var doc = document;

      var element = doc.createElement("span");
      element.innerHTML = html;
      element.firstChild.style.display = "";
  
      if(typeof(maxHeight) == 'undefined') {
        maxHeight = doc.body.offsetHeight;
      }
  
      
      var div = $sc("<div style=\"position:absolute;left:99999;top:99999;width:" + width + "px;height:" + maxHeight + "px\"></div>")
                .appendTo(doc.body);
          
      var span = doc.createElement("span");
      div.append(span);
 
      span.appendChild(element); 
  
      var height = span.offsetHeight;
      div.remove();
  
      if(height > maxHeight) {
        height = maxHeight;
      }
  
      return height;
   }
});﻿
Sitecore.PageModes.ChromeTypes.WrapperlessField = Sitecore.PageModes.ChromeTypes.Field.extend({ 
  controlId: function() {
    return this.chrome.openingMarker().attr("id").replace("_edit", "");
  },

  dataNode: function(domElement) {
    if (!domElement) {
      $sc.util().log("no dom element");
      return null;
    }

    if (domElement.is("code[type='text/sitecore'][chromeType='field']")) {
      return domElement;
    }
    
    return null;      
  },

  editControlCompleted: function(value, plainValue, preserveInnerContent) {
     this.fieldValue.val(typeof(plainValue) != "undefined" ? plainValue : value);
    if (!preserveInnerContent) {
      var htmlValue = value || "";
      // If a plain text node, wrap it in a span
      if ($sc.removeTags(htmlValue) === htmlValue) {
        htmlValue = "<span class='scTextWrapper'>" + htmlValue + "</span>";  
      }

      var newElements = $sc(htmlValue);
      this.chrome.update(newElements);
    }
    else {
      var targetCtl = this.chrome.element[0];
      var wrapper = document.createElement("span"); 
      wrapper.innerHTML = value;
      var sourceCtl = wrapper.firstChild;
      $sc.util().copyAttributes(sourceCtl, targetCtl);
      delete wrapper;                      
    }           
    
    this.chrome.reset();
    this.setModified();  
  },

  elements: function(domElement) {
    if (!domElement.is("code[type='text/sitecore'][chromeType='field']")) {
      console.error("Unexpected DOM element passed to WrapplessFiled for initialization:");
      $sc.util().log(domElement);
      throw "Failed to parse page editor field demarked by CODE tags";
    }  

    return this._getElementsBetweenScriptTags(domElement);
  },

  layoutRoot: function() {        
    return this.chrome.element;
  }
});﻿Sitecore.PageModes.ChromeTypes.PlaceholderSorting = Base.extend({
  constructor: function(placeholder, rendering) {
    this.placeholder = placeholder;
    this.rendering = rendering;
    this.handles = new Array();
    this.defaultLeftMarginValue = 20;
  },
  
  activate: function() {
    var sorting = this;
    
    var rendering = this.rendering;
    var renderings = this.placeholder.type.renderings();
    var sortableRenderingPosition = $sc.inArray(rendering, renderings);

    var position = 0;    
    var totalPositionCount = renderings.length + 1;

    if (renderings.length == 0) {
       sorting.insertSortingHandle('before', this.placeholder, position, totalPositionCount);
       return;
    }
    
    $sc.each(renderings, function() {
      if (this != rendering && (sortableRenderingPosition < 0 || sortableRenderingPosition != position - 1)) {
        sorting.insertSortingHandle('before', this, position, totalPositionCount);
      }

      position++;
    });

    // if sortable rendering is not the last rendering in the placeholder
    if (renderings.length > 0 && renderings[renderings.length - 1] != rendering) {
      sorting.insertSortingHandle('after', renderings[renderings.length - 1], position, totalPositionCount);
    }
    
    //this.handles[length-1].css("margin-top", -this.handles[length-1].outerHeight() + 2 + "px");
  },
  
  deactivate: function() {
    $sc.each(this.handles, function() {
      this.remove();
    });
  },
    
  insertSortingHandle: function(where, chrome, insertPosition, positionCount) {
    var title = Sitecore.PageModes.Texts.MoveToPositionInPlaceholder.replace("{0}", insertPosition + 1).replace("{1}", positionCount).replace("{2}", this.placeholder.displayName());
    var handle = $sc("<div class='scSortingHandle'></div>").attr("title", title);
    
    $sc("<div class='scInsertionHandleLeft scMoveToHere'> </div>").appendTo(handle);    
    $sc("<div class='scInsertionHandleCenter'></div>").append($sc("<span></span>").text(Sitecore.PageModes.Texts.MoveToHere)).appendTo(handle);    
    $sc("<div class='scInsertionHandleRight'></div>").appendTo(handle);
                
    handle.click($sc.proxy(function(e) {
      e.stop();
      Sitecore.PageModes.DesignManager.sortingEnd();
      Sitecore.PageModes.DesignManager.moveControlTo(this.rendering, this.placeholder, insertPosition);      
    }, this));
           
    var offset = chrome.position.offset();
    var top = left = "";

    if (where == 'before') {
      top = offset.top;
      left = offset.left;
    }
    else if (where == 'after') {
      var dimensions = chrome.position.dimensions();

      top = offset.top + dimensions.height;
      left = offset.left;
    }
    
    top = top + "px";
    left = left - Math.min(this.defaultLeftMarginValue, left) + "px";

    handle.css({ left: left, top: top});

    handle.appendTo(document.body);        
    this.handles.push(handle);
  }
});﻿Sitecore.PageModes.ChromeTypes.PlaceholderInsertion = Base.extend({
  constructor: function(placeholder) {
    this.placeholder = placeholder;
    this.handles = new Array();
    this.defaultLeftMarginValue = 20;

    this.command = $sc.first(this.placeholder.commands, function() { return this.click.indexOf("chrome:placeholder:addControl") > -1; });

    if (!this.command) {
      this.command = new Object();
      this.command.tooltip = Sitecore.PageModes.Texts.AddNewRenderingToPlaceholder;
      this.command.header = Sitecore.PageModes.Texts.AddToHere;
    }
  },

  activate: function() {
    var inserter = this;
    var position = 0;

    var renderings = this.placeholder.type.renderings();

    inserter.addTarget('top', this.placeholder, position);

    $sc.each(renderings, function() {
      position++;
      
      if (position == 1) {
        return;
      }

      inserter.addTarget('before', this, position - 1);
    });

    if (renderings.length > 0) {
      inserter.addTarget('after', renderings[renderings.length - 1], position);
    }
   
    var length = this.handles.length;
    if (length > 1) {        
      this.handles[length-1].css("margin-top", -this.handles[length-1].outerHeight() + 4 + "px");
    }
  },

  addTarget: function (where, chrome, insertPosition) {
    var handle = $sc("<div class='scInsertionHandle'></div>").attr("title", this.command.tooltip.replace("{0}", this.placeholder.displayName()));
    $sc("<div class='scInsertionHandleLeft scAddToHere'> </div>").appendTo(handle);  
    $sc("<div class='scInsertionHandleCenter'></div>").append($sc("<span></span>").text(this.command.header)).appendTo(handle);
    $sc("<div class='scInsertionHandleRight'></div>").appendTo(handle);
          
    handle.click($sc.proxy(function(e) {
      e.stop();
      Sitecore.PageModes.ChromeManager.setCommandSender(this.placeholder);
      this.placeholder.type.addControl(insertPosition);
    }, this));

    var offset = chrome.position.offset();
    var top = left = "";

    if (where == 'top') {
      top = offset.top;
      left = this.placeholder.position.offset().left;
    }
    else if (where == 'before') {
      top = offset.top;
      left = offset.left;
    }
    else if (where == 'after') {
      var dimensions = chrome.position.dimensions();

      top = offset.top + dimensions.height;
      left = offset.left;
    }
    
    top = top + "px";
    left = left - Math.min(this.defaultLeftMarginValue, left) + "px";

    handle.css({ top: top, left: left});

    handle.appendTo(document.body);    
    this.handles.push(handle);
  },

  deactivate: function() {
    $sc.each(this.handles, function() {
      this.remove();
    });
  }
});﻿Sitecore.PageModes.MoveControlFrame = Sitecore.PageModes.ChromeFrame.extend({
  constructor: function() {
    this.base();
    this.bgVerticalPatternSize = {height: 3, width: 8};
    this.bgHorizontalPatternSize = {height: 8, width: 3};       
  },

  horizontalSideClassName: function() {
    return "scMoveControlSideHorizontal";
  },

  verticalSideClassName: function() {
    return "scMoveControlSideVertical";
  },

  calculateSideLengths: function(dimensions) {
    var horizontal = dimensions.width;
    var vertical = dimensions.height - 2 * this.bgHorizontalPatternSize.height;    
    return { horizontal: horizontal, vertical: vertical};    
  },    

  showSides: function(chrome) {    
    var offset = chrome.position.offset();
    var dimensions = chrome.position.dimensions();
            
    var sideLengths = this.calculateSideLengths(dimensions);
    
    var horizontalSideLengthLeft = Math.ceil(sideLengths.horizontal / 2);
    var horizontalSideLengthRight = Math.floor(sideLengths.horizontal / 2);
            
    var verticalSideLengthTop = Math.ceil(sideLengths.vertical / 2);
    var verticalSideLengthBottom = Math.floor(sideLengths.vertical / 2);
    
    var topHorizontalY = offset.top;
    var bottomHorizontalY = offset.top + dimensions.height - this.bgHorizontalPatternSize.height;

    var leftHorizontalX = offset.left;    
    var rightHorizontalX = leftHorizontalX + horizontalSideLengthLeft;

    var verticalRightX = rightHorizontalX + horizontalSideLengthRight - this.bgVerticalPatternSize.width;
    var verticalLeftX = offset.left;

    var verticalTopY = offset.top + this.bgHorizontalPatternSize.height;   
    var verticalBottomY = verticalTopY + verticalSideLengthTop; 
    
       
    this.setSideStyle(this.topLeftHorizontal, topHorizontalY, leftHorizontalX, horizontalSideLengthLeft);    
    this.setSideStyle(this.topRightHorizontal, topHorizontalY, rightHorizontalX, horizontalSideLengthRight);

    this.setSideStyle(this.rightTopVertical, verticalTopY, verticalRightX, verticalSideLengthTop);    
    this.setSideStyle(this.rightBottomVertical, verticalBottomY, verticalRightX, verticalSideLengthBottom);

    this.setSideStyle(this.bottomLeftHorizontal, bottomHorizontalY, leftHorizontalX, horizontalSideLengthLeft);    
    this.setSideStyle(this.bottomRightHorizontal, bottomHorizontalY, rightHorizontalX, horizontalSideLengthRight);

    this.setSideStyle(this.leftTopVertical, verticalTopY, verticalLeftX, verticalSideLengthTop);    
    this.setSideStyle(this.leftBottomVertical, verticalBottomY, verticalLeftX, verticalSideLengthBottom);

    this.base();
  },

  createSides: function() {
    this.topLeftHorizontal = $sc("<div></div>").addClass(this.horizontalSideClassName() + " scLeftPart scTopSide");    
    this.topRightHorizontal = $sc("<div></div>").addClass(this.horizontalSideClassName() + " scRightPart scTopSide");

    this.rightTopVertical = $sc("<div></div>").addClass(this.verticalSideClassName() + " scTopPart scRightSide");    
    this.rightBottomVertical = $sc("<div></div>").addClass(this.verticalSideClassName() + " scBottomPart scRightSide");
    
    this.bottomLeftHorizontal = $sc("<div></div>").addClass(this.horizontalSideClassName() + " scLeftPart scBottomSide");    
    this.bottomRightHorizontal = $sc("<div></div>").addClass(this.horizontalSideClassName() + " scRightPart scBottomSide");

    this.leftTopVertical = $sc("<div></div>").addClass(this.verticalSideClassName() + " scTopPart scLeftSide");    
    this.leftBottomVertical = $sc("<div></div>").addClass(this.verticalSideClassName() + " scBottomPart scLeftSide");

    sides = new Array();
    this.sides = sides;

    sides.push(this.topLeftHorizontal);    
    sides.push(this.topRightHorizontal);

    sides.push(this.bottomLeftHorizontal);    
    sides.push(this.bottomRightHorizontal);

    sides.push(this.rightTopVertical);    
    sides.push(this.rightBottomVertical);

    sides.push(this.leftTopVertical);    
    sides.push(this.leftBottomVertical);
    
    this.base();
  }
});﻿if (typeof(Sitecore.PageModes) == "undefined") Sitecore.PageModes = new Object();

Sitecore.PageModes.ChromeHighlightManager = new function() {
  this.interval = 1000;
  this._intervalID = null;
  this._shouldHighlightChromes = false;
  this._updatePlanned = false;
  
  this.activate = function() {
    this._shouldHighlightChromes = true;
    this._updatePlanned = true;
    this._stopped = false;
    this._intervalID = setInterval($sc.proxy(this._process, this), this.interval);
  };

  this.deactivate = function() {
    this._shouldHighlightChromes = false;
    this.highlightChromes();
    if (this._intervalID != null) {
      clearInterval(this.intervalID);
    }

    this._intervalID = null;
  }; 
  
  this.highlightChromes = function() {   
    var updated = true;
    var length = Sitecore.PageModes.ChromeManager.chromes().length;
    for (var i = 0; i < length; i++) {   
      if (this._stopped) {
        updated = false;
        return;
      }

      var chrome = Sitecore.PageModes.ChromeManager.chromes()[i];
      if (this.isHighlightActive(chrome)) {
        chrome.showHighlight();
      }
      else {
        chrome.hideHighlight();
      }
    }
    
    if (updated) {
      this._updatePlanned = false;  
    }
  };
  
  // Defines if the specified chrome should be highlighted.
  this.isHighlightActive = function(chrome) {
    return this._shouldHighlightChromes && chrome.isEnabled() && !chrome.isFake();
  };

  this.planUpdate = function() {
    this._updatePlanned = true;
  };

  this.resume = function() {
    this._stopped = false;
    this._process();
  };
  
  this.stop = function() {
     this._stopped = true;
  };
  
  this._process = function() {    
    if (this._updatePlanned && !this._stopped) {      
      this.highlightChromes();      
    }
  };    
};﻿if (typeof(Sitecore.PageModes) == "undefined") {
  Sitecore.PageModes = new Object();
}

/**
* @class Represents an overlay for chrome during it's update via Ajax
*/
Sitecore.PageModes.ChromeOverlay = new function() {
  this.overlay = null;
  this.animationStartDelay = 0;
  this.opacity = 0.5;
  this.animationDuration = 100;
  this.overlayVisibleDuration = 150;     
  /**
  * @description Show the overlay  
  * @param {Sitecore.PageModes.Chrome} currentChrome The chrome to show the overlay for. @see Sitecore.PageModes.Chrome
  */
  this.showOverlay = function (currentChrome) {
    var chrome = currentChrome;
    if (!chrome || !chrome.position) {
      return;
    }

    // When condition activation is initiated form a chrome the containing rendering should be overlayed
    if (chrome.key() == "field") {
       var r = chrome.type.parentRendering();
       if (!r) {
          return;
       }

       chrome = r;
    }

    var dimensions = chrome.position.dimensions();
    if (dimensions.width <= 0 || dimensions.height <= 0) {
      return;
    } 

    var offset = chrome.position.offset();    
    if (!this.overlay) {
      this.overlay = $sc("<div class='scChromeOverlay'></div>")
                    .click(function(e) {e.stop();})
                    .hide()
                    .appendTo(document.body);
    }

    this.overlay.stop(true);    
    this.overlay.css(
    {
      top: offset.top + "px",
      left: offset.left + "px",
      height: dimensions.height + "px",
      width: dimensions.width + "px",
      opacity: 0.0
    });
        
    this.overlay.show()
                .delay(this.animationStartDelay)
                .fadeTo(this.animationDuration, this.opacity)
                .delay(this.overlayVisibleDuration);        
  };

  /**
  * @description Hides the overlay
  */
  this.hideOverlay = function() {
    var overlay = this.overlay;
    if (overlay) {
      this.overlay.fadeTo(this.animationDuration, 0.0, function() {overlay.hide();});
    }
  };
  
  /**
   @description Gets the time need for voerlay to bw shown
   @returns {Number} Time in ms
  */
  this.getShowingDuration = function() {
    return this.animationStartDelay + this.animationDuration + this.overlayVisibleDuration;
  };  
};﻿if (typeof(Sitecore) == "undefined") {
  Sitecore = {};
}

(function(jQuery) {
  Sitecore.OutOfFrameGallery = new function() {
  this.frameName = "scOutOfFrameGalleryFrame";
  this._senderId = null,
  this._senderFrameId = null;
  this.frame = function() {
    if (!this._frame) {     
      this._frame = this.createFrameElement();
      this._overlay = this.createOverlayElement();                      
      
      this._attachEventHandler(this._frame, "blur", function() {      
        Sitecore.OutOfFrameGallery.hide();
      });
      
       this._attachEventHandler(this._frame, "load", function() {
        var overlay =  Sitecore.OutOfFrameGallery._overlay;
        if (overlay) {
          overlay.style.display = "none";
        }
      });           
    }
    
    return this._frame;
  };

  this.createFrameElement = function() {
    var element = jQuery("<iframe style=\"box-shadow: 3px 3px 3px 0 rgba(176,176,176, 0.5)\" name='" + 
                    this.frameName + "' id='" + this.frameName +
                     "' src='about:blank'  frameborder='0' scrolling='no' />")
                    .css({zIndex: "99999", position: "fixed"})
                    .hide()                    
                    .appendTo(document.body);
        
    return element.get(0);
  };

  this.createOverlayElement = function() {
     var element =  jQuery("<div>")
                      .css({background: "#fafafa url('/sitecore/shell/Themes/Standard/Images/sitecore-loader24.gif') no-repeat center center", position: "fixed", zIndex: 1000000})
                      .hide()
                      .appendTo(document.body);
     
     return element.get(0);                   
  };

  this.open = function(sender, destination, dimensions, params, httpVerb) {
    if (!sender) {
      return;
    }
    
    this._senderId = sender.id;        
    var gallery = this.getGalleryElement(sender);
    var elementAttachTo = gallery || sender;
    if (!elementAttachTo) {
      return;
    }

    var frame = this.frame();
    frame.src = 'about:blank';
    var url = "/sitecore/shell/default.aspx?xmlcontrol=" + destination;
    var offset = this._getCumulativeOffset(elementAttachTo);
    var doc = elementAttachTo.ownerDocument;    
    if (doc != window.document) {
      // The sender DOM node is inside a frame
      var iframe = this._getElementsFrame(elementAttachTo);
      if (iframe) {
        var frameOffset = this._getCumulativeOffset(iframe);
        offset.top += frameOffset.top;
        offset.left += frameOffset.left;
        if (iframe.id) {
          url += "&senderframe=" + encodeURIComponent(iframe.id);
          this._senderFrameId = iframe.id;
        }
        }
      } 

    this._applySenderStyles();

    // If Gallery attach to top. Otherwise bottom
    if (!gallery) {
      offset.top += elementAttachTo.offsetHeight;
    }
                    
    var frame = this.frame();
    if (typeof(dimensions.height) != "undefined") {
      frame.height = parseInt(dimensions.height) + "px";
      if (jQuery.browser.msie) {
        frame.style.width = "";      
        frame.style.height = "";
    }
    }

    if (typeof(dimensions.width) != "undefined") {
      frame.width = parseInt(dimensions.width) + "px";
      if (jQuery.browser.msie) {
        frame.style.width = "";
    }
    }

    frame.setAttribute("data-gallery-name", destination);    
    this.hide();    
    if (httpVerb === "POST") {            
      var form = this.getFormElement(params);
      form.setAttribute("action", url);               
      this.show(offset);
      form.submit();
      form.parentNode.removeChild(form);                     
    }
    else
    {
      var serializedParameters = this._serialize(params);
      if (serializedParameters) {
        url += "&" + serializedParameters;
      }

      frame.src = url;
      this.show(offset);
    }
  };

  this.getFormElement = function (params) {     
     var form = jQuery("<form style='display:none' method='post'></form>)").attr("target", this.frameName);
     if (params) {              
      for( var n in params) {
        jQuery("<input type='hidden' />").attr("name", n).val(params[n]).appendTo(form);                
      }
     }
               
     form.appendTo(document.body);
     return form.get(0);
  };

  this.getGalleryElement = function(element) {
    return jQuery(element).closest(".scRibbonGallery")[0];    
  };

  this.hide = function() {
    if (!this.isVisible) {
      return;
    }

    try {
      this._clearSenderStyles();
    }
    catch(err) {
      window.console.log("Clearing sender styles failed ", err);      
    }

    this._clearPersistedSender();
    var frame = this.frame();        
    frame.style.display = "none";
    if (jQuery.browser.msie) {
      frame.style.height = "0";
    }

    if (this._overlay) {
      this._overlay.style.display = "none";
    }

    this.isVisible = false;
  };

  this.show = function(position) {    
    var frame = this.frame();    
    frame.style.top = position.top + "px";
    frame.style.left = position.left + "px";        
    frame.style.display = "";       
    if (this._overlay) {    
      this._overlay.style.top = frame.style.top;
      this._overlay.style.left = frame.style.left;
      this._overlay.style.width = parseInt(frame.width) + "px";
      this._overlay.style.height = parseInt(frame.height) + "px";     
      this._overlay.style.display = "";       
    }

    this.isVisible = true;     
  };
  
  this._applySenderStyles = function() {
    var sender = this._getPersistedSender();
    if (!sender) {
      return;
    }

    var $sender = jQuery(sender);    
    if ($sender.is(".scRibbonToolbarLargeGalleryButton")) {
      $sender.addClass("scRibbonToolbarLargeGalleryButtonDown");
    }     
  };

  this._attachEventHandler = function(element, eventName, handler) {
    jQuery(element).bind(eventName, handler);
  };

  this._clearPersistedSender = function() {
    this._senderId = null;
    this._senderFrameId = null;
  };

  this._clearSenderStyles = function() {
    var sender = this._getPersistedSender();
    if (!sender) {
      return;
    }    
    
    jQuery(sender).removeClass("scRibbonToolbarLargeGalleryButtonDown");    
  };

  this._getCumulativeOffset = function(element) {
    var valueT = 0, valueL = 0;
    if (element.parentNode) {
      do {
        valueT += element.offsetTop  || 0;
        valueL += element.offsetLeft || 0;
        element = element.offsetParent;
      } while (element);
    }

    return {left:valueL, top: valueT}; 
  };

  this._getElementsFrame = function (element) {
    var doc = element.ownerDocument;
    var iframes = document.getElementsByTagName("iframe");
    for (var i = 0; i < iframes.length; i++) {
      var frameDoc = iframes[i].contentDocument || iframes[i].contentWindow.document;
      if (frameDoc == doc) {
        return iframes[i];
      }
    }

    return null;
  };

  this._getPersistedSender = function() {
    if (!this._senderId) {
      return;
    }

    var doc = window.document;
    if (this._senderFrameId) {
      var senderFrame = doc.getElementById(this._senderFrameId);
      if (!senderFrame) {
        return;
      }

      doc = senderFrame.contentDocument || senderFrame.contentWindow.document;
    }

    if (!doc) {
      return;
    }

    return doc.getElementById(this._senderId);
  };

  this._serialize = function (object) {
    if (!object) {
      return null;
    }

    if (Object.prototype.toString.call(object).toLowerCase() === "[object string]") {
      return object;
    }

    var result = "";
    for (var n in object) { 
      result += "&" + encodeURIComponent(n);
      result += "=" + encodeURIComponent(object[n]);
    }

    return result.length > 1 ? result.substr(1): null;
  };
};
})($sc || jQuery);if (typeof Sitecore == "undefined") {
  Sitecore = new Object();
}

Sitecore.WebEdit = new function() {
  this.loaded = false;
  this.mouseMoveObservers = new Array();
  this.modified = false;
  this.selectedRendering = "";  
}

Sitecore.WebEdit.disableContentSelecting = function() {
  return Sitecore.WebEditSettings.disableContentSelecting;
}
/* -- FIELD VALUES --*/

Sitecore.WebEdit._getFieldValueContainer = function(itemUri, fieldID) {
  Sitecore.PageModes.ChromeManager.getFieldValueContainer(itemUri, fieldID);
}

Sitecore.WebEdit.getFieldValue = function(itemUri, fieldID) {
  Sitecore.PageModes.ChromeManager.getFieldValue(itemUri, fieldID);
}

Sitecore.WebEdit.setFieldValue = function(itemUri, fieldID, value) { 
  Sitecore.PageModes.ChromeManager.setFieldValue(itemUri, fieldID, value);
}

Sitecore.ItemUri = function(id, language, version, revision) {
  this.id = id;
  this.language = language;
  this.version = version;
  this.revision = revision;
}

/* -- END FIELD VALUES --*/

//For backward compatibility
Sitecore.WebEdit.editControl = function (itemid, language, version, fieldid, controlid, message) {
  var params = new Object();
  params.itemId = itemid;
  params.language = language;
  params.version = version;
  params.fieldId = fieldid;
  params.controlId = controlid;
  params.command = message;
  Sitecore.PageModes.ChromeManager.handleMessage("chrome:field:editcontrol", params);
  return false;
}

Sitecore.WebEdit.postRequest = function(request, async) {
  var ctl = document.getElementById("scWebEditRibbon");
  
  if (ctl != null) {
    async = (async == null ? false : async)
  
    ctl.contentWindow.scForm.postRequest("", "", "", request, null, async);
  }
}

Sitecore.WebEdit.quirksMode = function() {
  return typeof(document.compatMode != "undefined") && document.compatMode == "BackCompat";
}

Sitecore.WebEdit.close = function() {
  var href = window.location.href;
  
  href = href.replace("sc_ce=1", "sc_ce=0");
  
  window.location.href = href;
}

Sitecore.WebEdit.changeContentEditorSize = function(element, evt, sign) {
  var iframe = element.parentNode.previousSibling.previousSibling;
  
  var height = iframe.offsetHeight - 48 * sign;
  
  if (height < 200) {
    height = 200;
  }
  
  iframe.style.height = "" + height + "px";
  
  this.setCookie("sitecore_webedit_contenteditorheight", height);
  
  return false;
}

Sitecore.WebEdit.setCookie = function(name, value, expires, path, domain, secure) {
  if (expires == null) {
    expires = new Date();
    expires.setMonth(expires.getMonth() + 3);
  }
  
  if (path == null) {
    path = "/";
  }

  document.cookie = name + "=" + escape(value) +
    (expires ? "; expires=" + expires.toGMTString() : "") +
    (path ? "; path=" + path : "") +
    (domain ? "; domain=" + domain : "") +
    (secure ? "; secure" : "");
}

/* LAYOUT DEFINITION */

Sitecore.WebEdit.showTooltip = function(element, evt) {
  var tooltip = $(element.lastChild);
  var x = Event.pointerX(evt);
  var y = Event.pointerY(evt);
  
  if (evt.type == "mouseover") {
    if (tooltip.style.display == "none") {
      clearTimeout(this.tooltipTimer);
      
      this.tooltipTimer = setTimeout(function() {
        var html = tooltip.innerHTML;
        
        if (html == "") {
          return;
        }
      
        var t = $("scCurrentTooltip");
        if (t == null) {
          t = new Element("div", { "id":"scCurrentTooltip", "class": "scPalettePlaceholderTooltip", "style": "display:none" });
          document.body.appendChild(t);
        }
        
        t.innerHTML = html;
      
        t.style.left = x + "px";
        t.style.top = y + "px";
        t.style.display = "";
      }, 450);
    }
  }
  else {
    clearTimeout(this.tooltipTimer);
    var t = $("scCurrentTooltip");
    if (t != null) {
      t.style.display = "none";
    }
  }
};
