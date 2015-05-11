(function(){var n=this,t=n._,r={},e=Array.prototype,u=Object.prototype,i=Function.prototype,a=e.push,o=e.slice,c=e.concat,l=u.toString,f=u.hasOwnProperty,s=e.forEach,p=e.map,h=e.reduce,v=e.reduceRight,d=e.filter,g=e.every,m=e.some,y=e.indexOf,b=e.lastIndexOf,x=Array.isArray,_=Object.keys,j=i.bind,w=function(n){return n instanceof w?n:this instanceof w?(this._wrapped=n,void 0):new w(n)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=w),exports._=w):n._=w,w.VERSION="1.4.4";var A=w.each=w.forEach=function(n,t,e){if(null!=n)if(s&&n.forEach===s)n.forEach(t,e);else if(n.length===+n.length){for(var u=0,i=n.length;i>u;u++)if(t.call(e,n[u],u,n)===r)return}else for(var a in n)if(w.has(n,a)&&t.call(e,n[a],a,n)===r)return};w.map=w.collect=function(n,t,r){var e=[];return null==n?e:p&&n.map===p?n.map(t,r):(A(n,function(n,u,i){e[e.length]=t.call(r,n,u,i)}),e)};var O="Reduce of empty array with no initial value";w.reduce=w.foldl=w.inject=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),h&&n.reduce===h)return e&&(t=w.bind(t,e)),u?n.reduce(t,r):n.reduce(t);if(A(n,function(n,i,a){u?r=t.call(e,r,n,i,a):(r=n,u=!0)}),!u)throw new TypeError(O);return r},w.reduceRight=w.foldr=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),v&&n.reduceRight===v)return e&&(t=w.bind(t,e)),u?n.reduceRight(t,r):n.reduceRight(t);var i=n.length;if(i!==+i){var a=w.keys(n);i=a.length}if(A(n,function(o,c,l){c=a?a[--i]:--i,u?r=t.call(e,r,n[c],c,l):(r=n[c],u=!0)}),!u)throw new TypeError(O);return r},w.find=w.detect=function(n,t,r){var e;return E(n,function(n,u,i){return t.call(r,n,u,i)?(e=n,!0):void 0}),e},w.filter=w.select=function(n,t,r){var e=[];return null==n?e:d&&n.filter===d?n.filter(t,r):(A(n,function(n,u,i){t.call(r,n,u,i)&&(e[e.length]=n)}),e)},w.reject=function(n,t,r){return w.filter(n,function(n,e,u){return!t.call(r,n,e,u)},r)},w.every=w.all=function(n,t,e){t||(t=w.identity);var u=!0;return null==n?u:g&&n.every===g?n.every(t,e):(A(n,function(n,i,a){return(u=u&&t.call(e,n,i,a))?void 0:r}),!!u)};var E=w.some=w.any=function(n,t,e){t||(t=w.identity);var u=!1;return null==n?u:m&&n.some===m?n.some(t,e):(A(n,function(n,i,a){return u||(u=t.call(e,n,i,a))?r:void 0}),!!u)};w.contains=w.include=function(n,t){return null==n?!1:y&&n.indexOf===y?n.indexOf(t)!=-1:E(n,function(n){return n===t})},w.invoke=function(n,t){var r=o.call(arguments,2),e=w.isFunction(t);return w.map(n,function(n){return(e?t:n[t]).apply(n,r)})},w.pluck=function(n,t){return w.map(n,function(n){return n[t]})},w.where=function(n,t,r){return w.isEmpty(t)?r?null:[]:w[r?"find":"filter"](n,function(n){for(var r in t)if(t[r]!==n[r])return!1;return!0})},w.findWhere=function(n,t){return w.where(n,t,!0)},w.max=function(n,t,r){if(!t&&w.isArray(n)&&n[0]===+n[0]&&65535>n.length)return Math.max.apply(Math,n);if(!t&&w.isEmpty(n))return-1/0;var e={computed:-1/0,value:-1/0};return A(n,function(n,u,i){var a=t?t.call(r,n,u,i):n;a>=e.computed&&(e={value:n,computed:a})}),e.value},w.min=function(n,t,r){if(!t&&w.isArray(n)&&n[0]===+n[0]&&65535>n.length)return Math.min.apply(Math,n);if(!t&&w.isEmpty(n))return 1/0;var e={computed:1/0,value:1/0};return A(n,function(n,u,i){var a=t?t.call(r,n,u,i):n;e.computed>a&&(e={value:n,computed:a})}),e.value},w.shuffle=function(n){var t,r=0,e=[];return A(n,function(n){t=w.random(r++),e[r-1]=e[t],e[t]=n}),e};var k=function(n){return w.isFunction(n)?n:function(t){return t[n]}};w.sortBy=function(n,t,r){var e=k(t);return w.pluck(w.map(n,function(n,t,u){return{value:n,index:t,criteria:e.call(r,n,t,u)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||r===void 0)return 1;if(e>r||e===void 0)return-1}return n.index<t.index?-1:1}),"value")};var F=function(n,t,r,e){var u={},i=k(t||w.identity);return A(n,function(t,a){var o=i.call(r,t,a,n);e(u,o,t)}),u};w.groupBy=function(n,t,r){return F(n,t,r,function(n,t,r){(w.has(n,t)?n[t]:n[t]=[]).push(r)})},w.countBy=function(n,t,r){return F(n,t,r,function(n,t){w.has(n,t)||(n[t]=0),n[t]++})},w.sortedIndex=function(n,t,r,e){r=null==r?w.identity:k(r);for(var u=r.call(e,t),i=0,a=n.length;a>i;){var o=i+a>>>1;u>r.call(e,n[o])?i=o+1:a=o}return i},w.toArray=function(n){return n?w.isArray(n)?o.call(n):n.length===+n.length?w.map(n,w.identity):w.values(n):[]},w.size=function(n){return null==n?0:n.length===+n.length?n.length:w.keys(n).length},w.first=w.head=w.take=function(n,t,r){return null==n?void 0:null==t||r?n[0]:o.call(n,0,t)},w.initial=function(n,t,r){return o.call(n,0,n.length-(null==t||r?1:t))},w.last=function(n,t,r){return null==n?void 0:null==t||r?n[n.length-1]:o.call(n,Math.max(n.length-t,0))},w.rest=w.tail=w.drop=function(n,t,r){return o.call(n,null==t||r?1:t)},w.compact=function(n){return w.filter(n,w.identity)};var R=function(n,t,r){return A(n,function(n){w.isArray(n)?t?a.apply(r,n):R(n,t,r):r.push(n)}),r};w.flatten=function(n,t){return R(n,t,[])},w.without=function(n){return w.difference(n,o.call(arguments,1))},w.uniq=w.unique=function(n,t,r,e){w.isFunction(t)&&(e=r,r=t,t=!1);var u=r?w.map(n,r,e):n,i=[],a=[];return A(u,function(r,e){(t?e&&a[a.length-1]===r:w.contains(a,r))||(a.push(r),i.push(n[e]))}),i},w.union=function(){return w.uniq(c.apply(e,arguments))},w.intersection=function(n){var t=o.call(arguments,1);return w.filter(w.uniq(n),function(n){return w.every(t,function(t){return w.indexOf(t,n)>=0})})},w.difference=function(n){var t=c.apply(e,o.call(arguments,1));return w.filter(n,function(n){return!w.contains(t,n)})},w.zip=function(){for(var n=o.call(arguments),t=w.max(w.pluck(n,"length")),r=Array(t),e=0;t>e;e++)r[e]=w.pluck(n,""+e);return r},w.object=function(n,t){if(null==n)return{};for(var r={},e=0,u=n.length;u>e;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},w.indexOf=function(n,t,r){if(null==n)return-1;var e=0,u=n.length;if(r){if("number"!=typeof r)return e=w.sortedIndex(n,t),n[e]===t?e:-1;e=0>r?Math.max(0,u+r):r}if(y&&n.indexOf===y)return n.indexOf(t,r);for(;u>e;e++)if(n[e]===t)return e;return-1},w.lastIndexOf=function(n,t,r){if(null==n)return-1;var e=null!=r;if(b&&n.lastIndexOf===b)return e?n.lastIndexOf(t,r):n.lastIndexOf(t);for(var u=e?r:n.length;u--;)if(n[u]===t)return u;return-1},w.range=function(n,t,r){1>=arguments.length&&(t=n||0,n=0),r=arguments[2]||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=0,i=Array(e);e>u;)i[u++]=n,n+=r;return i},w.bind=function(n,t){if(n.bind===j&&j)return j.apply(n,o.call(arguments,1));var r=o.call(arguments,2);return function(){return n.apply(t,r.concat(o.call(arguments)))}},w.partial=function(n){var t=o.call(arguments,1);return function(){return n.apply(this,t.concat(o.call(arguments)))}},w.bindAll=function(n){var t=o.call(arguments,1);return 0===t.length&&(t=w.functions(n)),A(t,function(t){n[t]=w.bind(n[t],n)}),n},w.memoize=function(n,t){var r={};return t||(t=w.identity),function(){var e=t.apply(this,arguments);return w.has(r,e)?r[e]:r[e]=n.apply(this,arguments)}},w.delay=function(n,t){var r=o.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},w.defer=function(n){return w.delay.apply(w,[n,1].concat(o.call(arguments,1)))},w.throttle=function(n,t){var r,e,u,i,a=0,o=function(){a=new Date,u=null,i=n.apply(r,e)};return function(){var c=new Date,l=t-(c-a);return r=this,e=arguments,0>=l?(clearTimeout(u),u=null,a=c,i=n.apply(r,e)):u||(u=setTimeout(o,l)),i}},w.debounce=function(n,t,r){var e,u;return function(){var i=this,a=arguments,o=function(){e=null,r||(u=n.apply(i,a))},c=r&&!e;return clearTimeout(e),e=setTimeout(o,t),c&&(u=n.apply(i,a)),u}},w.once=function(n){var t,r=!1;return function(){return r?t:(r=!0,t=n.apply(this,arguments),n=null,t)}},w.wrap=function(n,t){return function(){var r=[n];return a.apply(r,arguments),t.apply(this,r)}},w.compose=function(){var n=arguments;return function(){for(var t=arguments,r=n.length-1;r>=0;r--)t=[n[r].apply(this,t)];return t[0]}},w.after=function(n,t){return 0>=n?t():function(){return 1>--n?t.apply(this,arguments):void 0}},w.keys=_||function(n){if(n!==Object(n))throw new TypeError("Invalid object");var t=[];for(var r in n)w.has(n,r)&&(t[t.length]=r);return t},w.values=function(n){var t=[];for(var r in n)w.has(n,r)&&t.push(n[r]);return t},w.pairs=function(n){var t=[];for(var r in n)w.has(n,r)&&t.push([r,n[r]]);return t},w.invert=function(n){var t={};for(var r in n)w.has(n,r)&&(t[n[r]]=r);return t},w.functions=w.methods=function(n){var t=[];for(var r in n)w.isFunction(n[r])&&t.push(r);return t.sort()},w.extend=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)n[r]=t[r]}),n},w.pick=function(n){var t={},r=c.apply(e,o.call(arguments,1));return A(r,function(r){r in n&&(t[r]=n[r])}),t},w.omit=function(n){var t={},r=c.apply(e,o.call(arguments,1));for(var u in n)w.contains(r,u)||(t[u]=n[u]);return t},w.defaults=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)null==n[r]&&(n[r]=t[r])}),n},w.clone=function(n){return w.isObject(n)?w.isArray(n)?n.slice():w.extend({},n):n},w.tap=function(n,t){return t(n),n};var I=function(n,t,r,e){if(n===t)return 0!==n||1/n==1/t;if(null==n||null==t)return n===t;n instanceof w&&(n=n._wrapped),t instanceof w&&(t=t._wrapped);var u=l.call(n);if(u!=l.call(t))return!1;switch(u){case"[object String]":return n==t+"";case"[object Number]":return n!=+n?t!=+t:0==n?1/n==1/t:n==+t;case"[object Date]":case"[object Boolean]":return+n==+t;case"[object RegExp]":return n.source==t.source&&n.global==t.global&&n.multiline==t.multiline&&n.ignoreCase==t.ignoreCase}if("object"!=typeof n||"object"!=typeof t)return!1;for(var i=r.length;i--;)if(r[i]==n)return e[i]==t;r.push(n),e.push(t);var a=0,o=!0;if("[object Array]"==u){if(a=n.length,o=a==t.length)for(;a--&&(o=I(n[a],t[a],r,e)););}else{var c=n.constructor,f=t.constructor;if(c!==f&&!(w.isFunction(c)&&c instanceof c&&w.isFunction(f)&&f instanceof f))return!1;for(var s in n)if(w.has(n,s)&&(a++,!(o=w.has(t,s)&&I(n[s],t[s],r,e))))break;if(o){for(s in t)if(w.has(t,s)&&!a--)break;o=!a}}return r.pop(),e.pop(),o};w.isEqual=function(n,t){return I(n,t,[],[])},w.isEmpty=function(n){if(null==n)return!0;if(w.isArray(n)||w.isString(n))return 0===n.length;for(var t in n)if(w.has(n,t))return!1;return!0},w.isElement=function(n){return!(!n||1!==n.nodeType)},w.isArray=x||function(n){return"[object Array]"==l.call(n)},w.isObject=function(n){return n===Object(n)},A(["Arguments","Function","String","Number","Date","RegExp"],function(n){w["is"+n]=function(t){return l.call(t)=="[object "+n+"]"}}),w.isArguments(arguments)||(w.isArguments=function(n){return!(!n||!w.has(n,"callee"))}),"function"!=typeof/./&&(w.isFunction=function(n){return"function"==typeof n}),w.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},w.isNaN=function(n){return w.isNumber(n)&&n!=+n},w.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"==l.call(n)},w.isNull=function(n){return null===n},w.isUndefined=function(n){return n===void 0},w.has=function(n,t){return f.call(n,t)},w.noConflict=function(){return n._=t,this},w.identity=function(n){return n},w.times=function(n,t,r){for(var e=Array(n),u=0;n>u;u++)e[u]=t.call(r,u);return e},w.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))};var M={escape:{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","/":"&#x2F;"}};M.unescape=w.invert(M.escape);var S={escape:RegExp("["+w.keys(M.escape).join("")+"]","g"),unescape:RegExp("("+w.keys(M.unescape).join("|")+")","g")};w.each(["escape","unescape"],function(n){w[n]=function(t){return null==t?"":(""+t).replace(S[n],function(t){return M[n][t]})}}),w.result=function(n,t){if(null==n)return null;var r=n[t];return w.isFunction(r)?r.call(n):r},w.mixin=function(n){A(w.functions(n),function(t){var r=w[t]=n[t];w.prototype[t]=function(){var n=[this._wrapped];return a.apply(n,arguments),D.call(this,r.apply(w,n))}})};var N=0;w.uniqueId=function(n){var t=++N+"";return n?n+t:t},w.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var T=/(.)^/,q={"'":"'","\\":"\\","\r":"r","\n":"n","	":"t","\u2028":"u2028","\u2029":"u2029"},B=/\\|'|\r|\n|\t|\u2028|\u2029/g;w.template=function(n,t,r){var e;r=w.defaults({},r,w.templateSettings);var u=RegExp([(r.escape||T).source,(r.interpolate||T).source,(r.evaluate||T).source].join("|")+"|$","g"),i=0,a="__p+='";n.replace(u,function(t,r,e,u,o){return a+=n.slice(i,o).replace(B,function(n){return"\\"+q[n]}),r&&(a+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'"),e&&(a+="'+\n((__t=("+e+"))==null?'':__t)+\n'"),u&&(a+="';\n"+u+"\n__p+='"),i=o+t.length,t}),a+="';\n",r.variable||(a="with(obj||{}){\n"+a+"}\n"),a="var __t,__p='',__j=Array.prototype.join,"+"print=function(){__p+=__j.call(arguments,'');};\n"+a+"return __p;\n";try{e=Function(r.variable||"obj","_",a)}catch(o){throw o.source=a,o}if(t)return e(t,w);var c=function(n){return e.call(this,n,w)};return c.source="function("+(r.variable||"obj")+"){\n"+a+"}",c},w.chain=function(n){return w(n).chain()};var D=function(n){return this._chain?w(n).chain():n};w.mixin(w),A(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=e[n];w.prototype[n]=function(){var r=this._wrapped;return t.apply(r,arguments),"shift"!=n&&"splice"!=n||0!==r.length||delete r[0],D.call(this,r)}}),A(["concat","join","slice"],function(n){var t=e[n];w.prototype[n]=function(){return D.call(this,t.apply(this._wrapped,arguments))}}),w.extend(w.prototype,{chain:function(){return this._chain=!0,this},value:function(){return this._wrapped}})}).call(this);
// Backbone.js 0.9.10

// (c) 2010-2012 Jeremy Ashkenas, DocumentCloud Inc.
// Backbone may be freely distributed under the MIT license.
// For all details and documentation:
// http://backbonejs.org
(function(){var n=this,B=n.Backbone,h=[],C=h.push,u=h.slice,D=h.splice,g;g="undefined"!==typeof exports?exports:n.Backbone={};g.VERSION="0.9.10";var f=n._;!f&&"undefined"!==typeof require&&(f=require("underscore"));g.$=n.jQuery||n.Zepto||n.ender;g.noConflict=function(){n.Backbone=B;return this};g.emulateHTTP=!1;g.emulateJSON=!1;var v=/\s+/,q=function(a,b,c,d){if(!c)return!0;if("object"===typeof c)for(var e in c)a[b].apply(a,[e,c[e]].concat(d));else if(v.test(c)){c=c.split(v);e=0;for(var f=c.length;e<
f;e++)a[b].apply(a,[c[e]].concat(d))}else return!0},w=function(a,b){var c,d=-1,e=a.length;switch(b.length){case 0:for(;++d<e;)(c=a[d]).callback.call(c.ctx);break;case 1:for(;++d<e;)(c=a[d]).callback.call(c.ctx,b[0]);break;case 2:for(;++d<e;)(c=a[d]).callback.call(c.ctx,b[0],b[1]);break;case 3:for(;++d<e;)(c=a[d]).callback.call(c.ctx,b[0],b[1],b[2]);break;default:for(;++d<e;)(c=a[d]).callback.apply(c.ctx,b)}},h=g.Events={on:function(a,b,c){if(!q(this,"on",a,[b,c])||!b)return this;this._events||(this._events=
{});(this._events[a]||(this._events[a]=[])).push({callback:b,context:c,ctx:c||this});return this},once:function(a,b,c){if(!q(this,"once",a,[b,c])||!b)return this;var d=this,e=f.once(function(){d.off(a,e);b.apply(this,arguments)});e._callback=b;this.on(a,e,c);return this},off:function(a,b,c){var d,e,t,g,j,l,k,h;if(!this._events||!q(this,"off",a,[b,c]))return this;if(!a&&!b&&!c)return this._events={},this;g=a?[a]:f.keys(this._events);j=0;for(l=g.length;j<l;j++)if(a=g[j],d=this._events[a]){t=[];if(b||
c){k=0;for(h=d.length;k<h;k++)e=d[k],(b&&b!==e.callback&&b!==e.callback._callback||c&&c!==e.context)&&t.push(e)}this._events[a]=t}return this},trigger:function(a){if(!this._events)return this;var b=u.call(arguments,1);if(!q(this,"trigger",a,b))return this;var c=this._events[a],d=this._events.all;c&&w(c,b);d&&w(d,arguments);return this},listenTo:function(a,b,c){var d=this._listeners||(this._listeners={}),e=a._listenerId||(a._listenerId=f.uniqueId("l"));d[e]=a;a.on(b,"object"===typeof b?this:c,this);
return this},stopListening:function(a,b,c){var d=this._listeners;if(d){if(a)a.off(b,"object"===typeof b?this:c,this),!b&&!c&&delete d[a._listenerId];else{"object"===typeof b&&(c=this);for(var e in d)d[e].off(b,c,this);this._listeners={}}return this}}};h.bind=h.on;h.unbind=h.off;f.extend(g,h);var r=g.Model=function(a,b){var c,d=a||{};this.cid=f.uniqueId("c");this.attributes={};b&&b.collection&&(this.collection=b.collection);b&&b.parse&&(d=this.parse(d,b)||{});if(c=f.result(this,"defaults"))d=f.defaults({},
d,c);this.set(d,b);this.changed={};this.initialize.apply(this,arguments)};f.extend(r.prototype,h,{changed:null,idAttribute:"id",initialize:function(){},toJSON:function(){return f.clone(this.attributes)},sync:function(){return g.sync.apply(this,arguments)},get:function(a){return this.attributes[a]},escape:function(a){return f.escape(this.get(a))},has:function(a){return null!=this.get(a)},set:function(a,b,c){var d,e,g,p,j,l,k;if(null==a)return this;"object"===typeof a?(e=a,c=b):(e={})[a]=b;c||(c={});
if(!this._validate(e,c))return!1;g=c.unset;p=c.silent;a=[];j=this._changing;this._changing=!0;j||(this._previousAttributes=f.clone(this.attributes),this.changed={});k=this.attributes;l=this._previousAttributes;this.idAttribute in e&&(this.id=e[this.idAttribute]);for(d in e)b=e[d],f.isEqual(k[d],b)||a.push(d),f.isEqual(l[d],b)?delete this.changed[d]:this.changed[d]=b,g?delete k[d]:k[d]=b;if(!p){a.length&&(this._pending=!0);b=0;for(d=a.length;b<d;b++)this.trigger("change:"+a[b],this,k[a[b]],c)}if(j)return this;
if(!p)for(;this._pending;)this._pending=!1,this.trigger("change",this,c);this._changing=this._pending=!1;return this},unset:function(a,b){return this.set(a,void 0,f.extend({},b,{unset:!0}))},clear:function(a){var b={},c;for(c in this.attributes)b[c]=void 0;return this.set(b,f.extend({},a,{unset:!0}))},hasChanged:function(a){return null==a?!f.isEmpty(this.changed):f.has(this.changed,a)},changedAttributes:function(a){if(!a)return this.hasChanged()?f.clone(this.changed):!1;var b,c=!1,d=this._changing?
this._previousAttributes:this.attributes,e;for(e in a)if(!f.isEqual(d[e],b=a[e]))(c||(c={}))[e]=b;return c},previous:function(a){return null==a||!this._previousAttributes?null:this._previousAttributes[a]},previousAttributes:function(){return f.clone(this._previousAttributes)},fetch:function(a){a=a?f.clone(a):{};void 0===a.parse&&(a.parse=!0);var b=a.success;a.success=function(a,d,e){if(!a.set(a.parse(d,e),e))return!1;b&&b(a,d,e)};return this.sync("read",this,a)},save:function(a,b,c){var d,e,g=this.attributes;
null==a||"object"===typeof a?(d=a,c=b):(d={})[a]=b;if(d&&(!c||!c.wait)&&!this.set(d,c))return!1;c=f.extend({validate:!0},c);if(!this._validate(d,c))return!1;d&&c.wait&&(this.attributes=f.extend({},g,d));void 0===c.parse&&(c.parse=!0);e=c.success;c.success=function(a,b,c){a.attributes=g;var k=a.parse(b,c);c.wait&&(k=f.extend(d||{},k));if(f.isObject(k)&&!a.set(k,c))return!1;e&&e(a,b,c)};a=this.isNew()?"create":c.patch?"patch":"update";"patch"===a&&(c.attrs=d);a=this.sync(a,this,c);d&&c.wait&&(this.attributes=
g);return a},destroy:function(a){a=a?f.clone(a):{};var b=this,c=a.success,d=function(){b.trigger("destroy",b,b.collection,a)};a.success=function(a,b,e){(e.wait||a.isNew())&&d();c&&c(a,b,e)};if(this.isNew())return a.success(this,null,a),!1;var e=this.sync("delete",this,a);a.wait||d();return e},url:function(){var a=f.result(this,"urlRoot")||f.result(this.collection,"url")||x();return this.isNew()?a:a+("/"===a.charAt(a.length-1)?"":"/")+encodeURIComponent(this.id)},parse:function(a){return a},clone:function(){return new this.constructor(this.attributes)},
isNew:function(){return null==this.id},isValid:function(a){return!this.validate||!this.validate(this.attributes,a)},_validate:function(a,b){if(!b.validate||!this.validate)return!0;a=f.extend({},this.attributes,a);var c=this.validationError=this.validate(a,b)||null;if(!c)return!0;this.trigger("invalid",this,c,b||{});return!1}});var s=g.Collection=function(a,b){b||(b={});b.model&&(this.model=b.model);void 0!==b.comparator&&(this.comparator=b.comparator);this.models=[];this._reset();this.initialize.apply(this,
arguments);a&&this.reset(a,f.extend({silent:!0},b))};f.extend(s.prototype,h,{model:r,initialize:function(){},toJSON:function(a){return this.map(function(b){return b.toJSON(a)})},sync:function(){return g.sync.apply(this,arguments)},add:function(a,b){a=f.isArray(a)?a.slice():[a];b||(b={});var c,d,e,g,p,j,l,k,h,m;l=[];k=b.at;h=this.comparator&&null==k&&!1!=b.sort;m=f.isString(this.comparator)?this.comparator:null;c=0;for(d=a.length;c<d;c++)(e=this._prepareModel(g=a[c],b))?(p=this.get(e))?b.merge&&(p.set(g===
e?e.attributes:g,b),h&&(!j&&p.hasChanged(m))&&(j=!0)):(l.push(e),e.on("all",this._onModelEvent,this),this._byId[e.cid]=e,null!=e.id&&(this._byId[e.id]=e)):this.trigger("invalid",this,g,b);l.length&&(h&&(j=!0),this.length+=l.length,null!=k?D.apply(this.models,[k,0].concat(l)):C.apply(this.models,l));j&&this.sort({silent:!0});if(b.silent)return this;c=0;for(d=l.length;c<d;c++)(e=l[c]).trigger("add",e,this,b);j&&this.trigger("sort",this,b);return this},remove:function(a,b){a=f.isArray(a)?a.slice():[a];
b||(b={});var c,d,e,g;c=0;for(d=a.length;c<d;c++)if(g=this.get(a[c]))delete this._byId[g.id],delete this._byId[g.cid],e=this.indexOf(g),this.models.splice(e,1),this.length--,b.silent||(b.index=e,g.trigger("remove",g,this,b)),this._removeReference(g);return this},push:function(a,b){a=this._prepareModel(a,b);this.add(a,f.extend({at:this.length},b));return a},pop:function(a){var b=this.at(this.length-1);this.remove(b,a);return b},unshift:function(a,b){a=this._prepareModel(a,b);this.add(a,f.extend({at:0},
b));return a},shift:function(a){var b=this.at(0);this.remove(b,a);return b},slice:function(a,b){return this.models.slice(a,b)},get:function(a){if(null!=a)return this._idAttr||(this._idAttr=this.model.prototype.idAttribute),this._byId[a.id||a.cid||a[this._idAttr]||a]},at:function(a){return this.models[a]},where:function(a){return f.isEmpty(a)?[]:this.filter(function(b){for(var c in a)if(a[c]!==b.get(c))return!1;return!0})},sort:function(a){if(!this.comparator)throw Error("Cannot sort a set without a comparator");
a||(a={});f.isString(this.comparator)||1===this.comparator.length?this.models=this.sortBy(this.comparator,this):this.models.sort(f.bind(this.comparator,this));a.silent||this.trigger("sort",this,a);return this},pluck:function(a){return f.invoke(this.models,"get",a)},update:function(a,b){b=f.extend({add:!0,merge:!0,remove:!0},b);b.parse&&(a=this.parse(a,b));var c,d,e,g,h=[],j=[],l={};f.isArray(a)||(a=a?[a]:[]);if(b.add&&!b.remove)return this.add(a,b);d=0;for(e=a.length;d<e;d++)c=a[d],g=this.get(c),
b.remove&&g&&(l[g.cid]=!0),(b.add&&!g||b.merge&&g)&&h.push(c);if(b.remove){d=0;for(e=this.models.length;d<e;d++)c=this.models[d],l[c.cid]||j.push(c)}j.length&&this.remove(j,b);h.length&&this.add(h,b);return this},reset:function(a,b){b||(b={});b.parse&&(a=this.parse(a,b));for(var c=0,d=this.models.length;c<d;c++)this._removeReference(this.models[c]);b.previousModels=this.models.slice();this._reset();a&&this.add(a,f.extend({silent:!0},b));b.silent||this.trigger("reset",this,b);return this},fetch:function(a){a=
a?f.clone(a):{};void 0===a.parse&&(a.parse=!0);var b=a.success;a.success=function(a,d,e){a[e.update?"update":"reset"](d,e);b&&b(a,d,e)};return this.sync("read",this,a)},create:function(a,b){b=b?f.clone(b):{};if(!(a=this._prepareModel(a,b)))return!1;b.wait||this.add(a,b);var c=this,d=b.success;b.success=function(a,b,f){f.wait&&c.add(a,f);d&&d(a,b,f)};a.save(null,b);return a},parse:function(a){return a},clone:function(){return new this.constructor(this.models)},_reset:function(){this.length=0;this.models.length=
0;this._byId={}},_prepareModel:function(a,b){if(a instanceof r)return a.collection||(a.collection=this),a;b||(b={});b.collection=this;var c=new this.model(a,b);return!c._validate(a,b)?!1:c},_removeReference:function(a){this===a.collection&&delete a.collection;a.off("all",this._onModelEvent,this)},_onModelEvent:function(a,b,c,d){("add"===a||"remove"===a)&&c!==this||("destroy"===a&&this.remove(b,d),b&&a==="change:"+b.idAttribute&&(delete this._byId[b.previous(b.idAttribute)],null!=b.id&&(this._byId[b.id]=
b)),this.trigger.apply(this,arguments))},sortedIndex:function(a,b,c){b||(b=this.comparator);var d=f.isFunction(b)?b:function(a){return a.get(b)};return f.sortedIndex(this.models,a,d,c)}});f.each("forEach each map collect reduce foldl inject reduceRight foldr find detect filter select reject every all some any include contains invoke max min toArray size first head take initial rest tail drop last without indexOf shuffle lastIndexOf isEmpty chain".split(" "),function(a){s.prototype[a]=function(){var b=
u.call(arguments);b.unshift(this.models);return f[a].apply(f,b)}});f.each(["groupBy","countBy","sortBy"],function(a){s.prototype[a]=function(b,c){var d=f.isFunction(b)?b:function(a){return a.get(b)};return f[a](this.models,d,c)}});var y=g.Router=function(a){a||(a={});a.routes&&(this.routes=a.routes);this._bindRoutes();this.initialize.apply(this,arguments)},E=/\((.*?)\)/g,F=/(\(\?)?:\w+/g,G=/\*\w+/g,H=/[\-{}\[\]+?.,\\\^$|#\s]/g;f.extend(y.prototype,h,{initialize:function(){},route:function(a,b,c){f.isRegExp(a)||
(a=this._routeToRegExp(a));c||(c=this[b]);g.history.route(a,f.bind(function(d){d=this._extractParameters(a,d);c&&c.apply(this,d);this.trigger.apply(this,["route:"+b].concat(d));this.trigger("route",b,d);g.history.trigger("route",this,b,d)},this));return this},navigate:function(a,b){g.history.navigate(a,b);return this},_bindRoutes:function(){if(this.routes)for(var a,b=f.keys(this.routes);null!=(a=b.pop());)this.route(a,this.routes[a])},_routeToRegExp:function(a){a=a.replace(H,"\\$&").replace(E,"(?:$1)?").replace(F,
function(a,c){return c?a:"([^/]+)"}).replace(G,"(.*?)");return RegExp("^"+a+"$")},_extractParameters:function(a,b){return a.exec(b).slice(1)}});var m=g.History=function(){this.handlers=[];f.bindAll(this,"checkUrl");"undefined"!==typeof window&&(this.location=window.location,this.history=window.history)},z=/^[#\/]|\s+$/g,I=/^\/+|\/+$/g,J=/msie [\w.]+/,K=/\/$/;m.started=!1;f.extend(m.prototype,h,{interval:50,getHash:function(a){return(a=(a||this).location.href.match(/#(.*)$/))?a[1]:""},getFragment:function(a,
b){if(null==a)if(this._hasPushState||!this._wantsHashChange||b){a=this.location.pathname;var c=this.root.replace(K,"");a.indexOf(c)||(a=a.substr(c.length))}else a=this.getHash();return a.replace(z,"")},start:function(a){if(m.started)throw Error("Backbone.history has already been started");m.started=!0;this.options=f.extend({},{root:"/"},this.options,a);this.root=this.options.root;this._wantsHashChange=!1!==this.options.hashChange;this._wantsPushState=!!this.options.pushState;this._hasPushState=!(!this.options.pushState||
!this.history||!this.history.pushState);a=this.getFragment();var b=document.documentMode,b=J.exec(navigator.userAgent.toLowerCase())&&(!b||7>=b);this.root=("/"+this.root+"/").replace(I,"/");b&&this._wantsHashChange&&(this.iframe=g.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow,this.navigate(a));if(this._hasPushState)g.$(window).on("popstate",this.checkUrl);else if(this._wantsHashChange&&"onhashchange"in window&&!b)g.$(window).on("hashchange",this.checkUrl);
else this._wantsHashChange&&(this._checkUrlInterval=setInterval(this.checkUrl,this.interval));this.fragment=a;a=this.location;b=a.pathname.replace(/[^\/]$/,"$&/")===this.root;if(this._wantsHashChange&&this._wantsPushState&&!this._hasPushState&&!b)return this.fragment=this.getFragment(null,!0),this.location.replace(this.root+this.location.search+"#"+this.fragment),!0;this._wantsPushState&&(this._hasPushState&&b&&a.hash)&&(this.fragment=this.getHash().replace(z,""),this.history.replaceState({},document.title,
this.root+this.fragment+a.search));if(!this.options.silent)return this.loadUrl()},stop:function(){g.$(window).off("popstate",this.checkUrl).off("hashchange",this.checkUrl);clearInterval(this._checkUrlInterval);m.started=!1},route:function(a,b){this.handlers.unshift({route:a,callback:b})},checkUrl:function(){var a=this.getFragment();a===this.fragment&&this.iframe&&(a=this.getFragment(this.getHash(this.iframe)));if(a===this.fragment)return!1;this.iframe&&this.navigate(a);this.loadUrl()||this.loadUrl(this.getHash())},
loadUrl:function(a){var b=this.fragment=this.getFragment(a);return f.any(this.handlers,function(a){if(a.route.test(b))return a.callback(b),!0})},navigate:function(a,b){if(!m.started)return!1;if(!b||!0===b)b={trigger:b};a=this.getFragment(a||"");if(this.fragment!==a){this.fragment=a;var c=this.root+a;if(this._hasPushState)this.history[b.replace?"replaceState":"pushState"]({},document.title,c);else if(this._wantsHashChange)this._updateHash(this.location,a,b.replace),this.iframe&&a!==this.getFragment(this.getHash(this.iframe))&&
(b.replace||this.iframe.document.open().close(),this._updateHash(this.iframe.location,a,b.replace));else return this.location.assign(c);b.trigger&&this.loadUrl(a)}},_updateHash:function(a,b,c){c?(c=a.href.replace(/(javascript:|#).*$/,""),a.replace(c+"#"+b)):a.hash="#"+b}});g.history=new m;var A=g.View=function(a){this.cid=f.uniqueId("view");this._configure(a||{});this._ensureElement();this.initialize.apply(this,arguments);this.delegateEvents()},L=/^(\S+)\s*(.*)$/,M="model collection el id attributes className tagName events".split(" ");
f.extend(A.prototype,h,{tagName:"div",$:function(a){return this.$el.find(a)},initialize:function(){},render:function(){return this},remove:function(){this.$el.remove();this.stopListening();return this},setElement:function(a,b){this.$el&&this.undelegateEvents();this.$el=a instanceof g.$?a:g.$(a);this.el=this.$el[0];!1!==b&&this.delegateEvents();return this},delegateEvents:function(a){if(a||(a=f.result(this,"events"))){this.undelegateEvents();for(var b in a){var c=a[b];f.isFunction(c)||(c=this[a[b]]);
if(!c)throw Error('Method "'+a[b]+'" does not exist');var d=b.match(L),e=d[1],d=d[2],c=f.bind(c,this),e=e+(".delegateEvents"+this.cid);if(""===d)this.$el.on(e,c);else this.$el.on(e,d,c)}}},undelegateEvents:function(){this.$el.off(".delegateEvents"+this.cid)},_configure:function(a){this.options&&(a=f.extend({},f.result(this,"options"),a));f.extend(this,f.pick(a,M));this.options=a},_ensureElement:function(){if(this.el)this.setElement(f.result(this,"el"),!1);else{var a=f.extend({},f.result(this,"attributes"));
this.id&&(a.id=f.result(this,"id"));this.className&&(a["class"]=f.result(this,"className"));a=g.$("<"+f.result(this,"tagName")+">").attr(a);this.setElement(a,!1)}}});var N={create:"POST",update:"PUT",patch:"PATCH","delete":"DELETE",read:"GET"};g.sync=function(a,b,c){var d=N[a];f.defaults(c||(c={}),{emulateHTTP:g.emulateHTTP,emulateJSON:g.emulateJSON});var e={type:d,dataType:"json"};c.url||(e.url=f.result(b,"url")||x());if(null==c.data&&b&&("create"===a||"update"===a||"patch"===a))e.contentType="application/json",
e.data=JSON.stringify(c.attrs||b.toJSON(c));c.emulateJSON&&(e.contentType="application/x-www-form-urlencoded",e.data=e.data?{model:e.data}:{});if(c.emulateHTTP&&("PUT"===d||"DELETE"===d||"PATCH"===d)){e.type="POST";c.emulateJSON&&(e.data._method=d);var h=c.beforeSend;c.beforeSend=function(a){a.setRequestHeader("X-HTTP-Method-Override",d);if(h)return h.apply(this,arguments)}}"GET"!==e.type&&!c.emulateJSON&&(e.processData=!1);var m=c.success;c.success=function(a){m&&m(b,a,c);b.trigger("sync",b,a,c)};
var j=c.error;c.error=function(a){j&&j(b,a,c);b.trigger("error",b,a,c)};a=c.xhr=g.ajax(f.extend(e,c));b.trigger("request",b,a,c);return a};g.ajax=function(){return g.$.ajax.apply(g.$,arguments)};r.extend=s.extend=y.extend=A.extend=m.extend=function(a,b){var c=this,d;d=a&&f.has(a,"constructor")?a.constructor:function(){return c.apply(this,arguments)};f.extend(d,c,b);var e=function(){this.constructor=d};e.prototype=c.prototype;d.prototype=new e;a&&f.extend(d.prototype,a);d.__super__=c.prototype;return d};
var x=function(){throw Error('A "url" property or function must be specified');}}).call(this);
// Knockout JavaScript library v2.2.1
// (c) Steven Sanderson - http://knockoutjs.com/
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

(function() {function j(w){throw w;}var m=!0,p=null,r=!1;function u(w){return function(){return w}};var x=window,y=document,ga=navigator,F=window.jQuery,I=void 0;
function L(w){function ha(a,d,c,e,f){var g=[];a=b.j(function(){var a=d(c,f)||[];0<g.length&&(b.a.Ya(M(g),a),e&&b.r.K(e,p,[c,a,f]));g.splice(0,g.length);b.a.P(g,a)},p,{W:a,Ka:function(){return 0==g.length||!b.a.X(g[0])}});return{M:g,j:a.pa()?a:I}}function M(a){for(;a.length&&!b.a.X(a[0]);)a.splice(0,1);if(1<a.length){for(var d=a[0],c=a[a.length-1],e=[d];d!==c;){d=d.nextSibling;if(!d)return;e.push(d)}Array.prototype.splice.apply(a,[0,a.length].concat(e))}return a}function S(a,b,c,e,f){var g=Math.min,
h=Math.max,k=[],l,n=a.length,q,s=b.length,v=s-n||1,G=n+s+1,J,A,z;for(l=0;l<=n;l++){A=J;k.push(J=[]);z=g(s,l+v);for(q=h(0,l-1);q<=z;q++)J[q]=q?l?a[l-1]===b[q-1]?A[q-1]:g(A[q]||G,J[q-1]||G)+1:q+1:l+1}g=[];h=[];v=[];l=n;for(q=s;l||q;)s=k[l][q]-1,q&&s===k[l][q-1]?h.push(g[g.length]={status:c,value:b[--q],index:q}):l&&s===k[l-1][q]?v.push(g[g.length]={status:e,value:a[--l],index:l}):(g.push({status:"retained",value:b[--q]}),--l);if(h.length&&v.length){a=10*n;var t;for(b=c=0;(f||b<a)&&(t=h[c]);c++){for(e=
0;k=v[e];e++)if(t.value===k.value){t.moved=k.index;k.moved=t.index;v.splice(e,1);b=e=0;break}b+=e}}return g.reverse()}function T(a,d,c,e,f){f=f||{};var g=a&&N(a),g=g&&g.ownerDocument,h=f.templateEngine||O;b.za.vb(c,h,g);c=h.renderTemplate(c,e,f,g);("number"!=typeof c.length||0<c.length&&"number"!=typeof c[0].nodeType)&&j(Error("Template engine must return an array of DOM nodes"));g=r;switch(d){case "replaceChildren":b.e.N(a,c);g=m;break;case "replaceNode":b.a.Ya(a,c);g=m;break;case "ignoreTargetNode":break;
default:j(Error("Unknown renderMode: "+d))}g&&(U(c,e),f.afterRender&&b.r.K(f.afterRender,p,[c,e.$data]));return c}function N(a){return a.nodeType?a:0<a.length?a[0]:p}function U(a,d){if(a.length){var c=a[0],e=a[a.length-1];V(c,e,function(a){b.Da(d,a)});V(c,e,function(a){b.s.ib(a,[d])})}}function V(a,d,c){var e;for(d=b.e.nextSibling(d);a&&(e=a)!==d;)a=b.e.nextSibling(e),(1===e.nodeType||8===e.nodeType)&&c(e)}function W(a,d,c){a=b.g.aa(a);for(var e=b.g.Q,f=0;f<a.length;f++){var g=a[f].key;if(e.hasOwnProperty(g)){var h=
e[g];"function"===typeof h?(g=h(a[f].value))&&j(Error(g)):h||j(Error("This template engine does not support the '"+g+"' binding within its templates"))}}a="ko.__tr_ambtns(function($context,$element){return(function(){return{ "+b.g.ba(a)+" } })()})";return c.createJavaScriptEvaluatorBlock(a)+d}function X(a,d,c,e){function f(a){return function(){return k[a]}}function g(){return k}var h=0,k,l;b.j(function(){var n=c&&c instanceof b.z?c:new b.z(b.a.d(c)),q=n.$data;e&&b.eb(a,n);if(k=("function"==typeof d?
d(n,a):d)||b.J.instance.getBindings(a,n)){if(0===h){h=1;for(var s in k){var v=b.c[s];v&&8===a.nodeType&&!b.e.I[s]&&j(Error("The binding '"+s+"' cannot be used with virtual elements"));if(v&&"function"==typeof v.init&&(v=(0,v.init)(a,f(s),g,q,n))&&v.controlsDescendantBindings)l!==I&&j(Error("Multiple bindings ("+l+" and "+s+") are trying to control descendant bindings of the same element. You cannot use these bindings together on the same element.")),l=s}h=2}if(2===h)for(s in k)(v=b.c[s])&&"function"==
typeof v.update&&(0,v.update)(a,f(s),g,q,n)}},p,{W:a});return{Nb:l===I}}function Y(a,d,c){var e=m,f=1===d.nodeType;f&&b.e.Ta(d);if(f&&c||b.J.instance.nodeHasBindings(d))e=X(d,p,a,c).Nb;e&&Z(a,d,!f)}function Z(a,d,c){for(var e=b.e.firstChild(d);d=e;)e=b.e.nextSibling(d),Y(a,d,c)}function $(a,b){var c=aa(a,b);return c?0<c.length?c[c.length-1].nextSibling:a.nextSibling:p}function aa(a,b){for(var c=a,e=1,f=[];c=c.nextSibling;){if(H(c)&&(e--,0===e))return f;f.push(c);B(c)&&e++}b||j(Error("Cannot find closing comment tag to match: "+
a.nodeValue));return p}function H(a){return 8==a.nodeType&&(K?a.text:a.nodeValue).match(ia)}function B(a){return 8==a.nodeType&&(K?a.text:a.nodeValue).match(ja)}function P(a,b){for(var c=p;a!=c;)c=a,a=a.replace(ka,function(a,c){return b[c]});return a}function la(){var a=[],d=[];this.save=function(c,e){var f=b.a.i(a,c);0<=f?d[f]=e:(a.push(c),d.push(e))};this.get=function(c){c=b.a.i(a,c);return 0<=c?d[c]:I}}function ba(a,b,c){function e(e){var g=b(a[e]);switch(typeof g){case "boolean":case "number":case "string":case "function":f[e]=
g;break;case "object":case "undefined":var h=c.get(g);f[e]=h!==I?h:ba(g,b,c)}}c=c||new la;a=b(a);if(!("object"==typeof a&&a!==p&&a!==I&&!(a instanceof Date)))return a;var f=a instanceof Array?[]:{};c.save(a,f);var g=a;if(g instanceof Array){for(var h=0;h<g.length;h++)e(h);"function"==typeof g.toJSON&&e("toJSON")}else for(h in g)e(h);return f}function ca(a,d){if(a)if(8==a.nodeType){var c=b.s.Ua(a.nodeValue);c!=p&&d.push({sb:a,Fb:c})}else if(1==a.nodeType)for(var c=0,e=a.childNodes,f=e.length;c<f;c++)ca(e[c],
d)}function Q(a,d,c,e){b.c[a]={init:function(a){b.a.f.set(a,da,{});return{controlsDescendantBindings:m}},update:function(a,g,h,k,l){h=b.a.f.get(a,da);g=b.a.d(g());k=!c!==!g;var n=!h.Za;if(n||d||k!==h.qb)n&&(h.Za=b.a.Ia(b.e.childNodes(a),m)),k?(n||b.e.N(a,b.a.Ia(h.Za)),b.Ea(e?e(l,g):l,a)):b.e.Y(a),h.qb=k}};b.g.Q[a]=r;b.e.I[a]=m}function ea(a,d,c){c&&d!==b.k.q(a)&&b.k.T(a,d);d!==b.k.q(a)&&b.r.K(b.a.Ba,p,[a,"change"])}var b="undefined"!==typeof w?w:{};b.b=function(a,d){for(var c=a.split("."),e=b,f=0;f<
c.length-1;f++)e=e[c[f]];e[c[c.length-1]]=d};b.p=function(a,b,c){a[b]=c};b.version="2.2.1";b.b("version",b.version);b.a=new function(){function a(a,d){if("input"!==b.a.u(a)||!a.type||"click"!=d.toLowerCase())return r;var c=a.type;return"checkbox"==c||"radio"==c}var d=/^(\s|\u00A0)+|(\s|\u00A0)+$/g,c={},e={};c[/Firefox\/2/i.test(ga.userAgent)?"KeyboardEvent":"UIEvents"]=["keyup","keydown","keypress"];c.MouseEvents="click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave".split(" ");
for(var f in c){var g=c[f];if(g.length)for(var h=0,k=g.length;h<k;h++)e[g[h]]=f}var l={propertychange:m},n,c=3;f=y.createElement("div");for(g=f.getElementsByTagName("i");f.innerHTML="\x3c!--[if gt IE "+ ++c+"]><i></i><![endif]--\x3e",g[0];);n=4<c?c:I;return{Na:["authenticity_token",/^__RequestVerificationToken(_.*)?$/],o:function(a,b){for(var d=0,c=a.length;d<c;d++)b(a[d])},i:function(a,b){if("function"==typeof Array.prototype.indexOf)return Array.prototype.indexOf.call(a,b);for(var d=0,c=a.length;d<
c;d++)if(a[d]===b)return d;return-1},lb:function(a,b,d){for(var c=0,e=a.length;c<e;c++)if(b.call(d,a[c]))return a[c];return p},ga:function(a,d){var c=b.a.i(a,d);0<=c&&a.splice(c,1)},Ga:function(a){a=a||[];for(var d=[],c=0,e=a.length;c<e;c++)0>b.a.i(d,a[c])&&d.push(a[c]);return d},V:function(a,b){a=a||[];for(var d=[],c=0,e=a.length;c<e;c++)d.push(b(a[c]));return d},fa:function(a,b){a=a||[];for(var d=[],c=0,e=a.length;c<e;c++)b(a[c])&&d.push(a[c]);return d},P:function(a,b){if(b instanceof Array)a.push.apply(a,
b);else for(var d=0,c=b.length;d<c;d++)a.push(b[d]);return a},extend:function(a,b){if(b)for(var d in b)b.hasOwnProperty(d)&&(a[d]=b[d]);return a},ka:function(a){for(;a.firstChild;)b.removeNode(a.firstChild)},Hb:function(a){a=b.a.L(a);for(var d=y.createElement("div"),c=0,e=a.length;c<e;c++)d.appendChild(b.A(a[c]));return d},Ia:function(a,d){for(var c=0,e=a.length,g=[];c<e;c++){var f=a[c].cloneNode(m);g.push(d?b.A(f):f)}return g},N:function(a,d){b.a.ka(a);if(d)for(var c=0,e=d.length;c<e;c++)a.appendChild(d[c])},
Ya:function(a,d){var c=a.nodeType?[a]:a;if(0<c.length){for(var e=c[0],g=e.parentNode,f=0,h=d.length;f<h;f++)g.insertBefore(d[f],e);f=0;for(h=c.length;f<h;f++)b.removeNode(c[f])}},bb:function(a,b){7>n?a.setAttribute("selected",b):a.selected=b},D:function(a){return(a||"").replace(d,"")},Rb:function(a,d){for(var c=[],e=(a||"").split(d),f=0,g=e.length;f<g;f++){var h=b.a.D(e[f]);""!==h&&c.push(h)}return c},Ob:function(a,b){a=a||"";return b.length>a.length?r:a.substring(0,b.length)===b},tb:function(a,b){if(b.compareDocumentPosition)return 16==
(b.compareDocumentPosition(a)&16);for(;a!=p;){if(a==b)return m;a=a.parentNode}return r},X:function(a){return b.a.tb(a,a.ownerDocument)},u:function(a){return a&&a.tagName&&a.tagName.toLowerCase()},n:function(b,d,c){var e=n&&l[d];if(!e&&"undefined"!=typeof F){if(a(b,d)){var f=c;c=function(a,b){var d=this.checked;b&&(this.checked=b.nb!==m);f.call(this,a);this.checked=d}}F(b).bind(d,c)}else!e&&"function"==typeof b.addEventListener?b.addEventListener(d,c,r):"undefined"!=typeof b.attachEvent?b.attachEvent("on"+
d,function(a){c.call(b,a)}):j(Error("Browser doesn't support addEventListener or attachEvent"))},Ba:function(b,d){(!b||!b.nodeType)&&j(Error("element must be a DOM node when calling triggerEvent"));if("undefined"!=typeof F){var c=[];a(b,d)&&c.push({nb:b.checked});F(b).trigger(d,c)}else"function"==typeof y.createEvent?"function"==typeof b.dispatchEvent?(c=y.createEvent(e[d]||"HTMLEvents"),c.initEvent(d,m,m,x,0,0,0,0,0,r,r,r,r,0,b),b.dispatchEvent(c)):j(Error("The supplied element doesn't support dispatchEvent")):
"undefined"!=typeof b.fireEvent?(a(b,d)&&(b.checked=b.checked!==m),b.fireEvent("on"+d)):j(Error("Browser doesn't support triggering events"))},d:function(a){return b.$(a)?a():a},ua:function(a){return b.$(a)?a.t():a},da:function(a,d,c){if(d){var e=/[\w-]+/g,f=a.className.match(e)||[];b.a.o(d.match(e),function(a){var d=b.a.i(f,a);0<=d?c||f.splice(d,1):c&&f.push(a)});a.className=f.join(" ")}},cb:function(a,d){var c=b.a.d(d);if(c===p||c===I)c="";if(3===a.nodeType)a.data=c;else{var e=b.e.firstChild(a);
!e||3!=e.nodeType||b.e.nextSibling(e)?b.e.N(a,[y.createTextNode(c)]):e.data=c;b.a.wb(a)}},ab:function(a,b){a.name=b;if(7>=n)try{a.mergeAttributes(y.createElement("<input name='"+a.name+"'/>"),r)}catch(d){}},wb:function(a){9<=n&&(a=1==a.nodeType?a:a.parentNode,a.style&&(a.style.zoom=a.style.zoom))},ub:function(a){if(9<=n){var b=a.style.width;a.style.width=0;a.style.width=b}},Lb:function(a,d){a=b.a.d(a);d=b.a.d(d);for(var c=[],e=a;e<=d;e++)c.push(e);return c},L:function(a){for(var b=[],d=0,c=a.length;d<
c;d++)b.push(a[d]);return b},Pb:6===n,Qb:7===n,Z:n,Oa:function(a,d){for(var c=b.a.L(a.getElementsByTagName("input")).concat(b.a.L(a.getElementsByTagName("textarea"))),e="string"==typeof d?function(a){return a.name===d}:function(a){return d.test(a.name)},f=[],g=c.length-1;0<=g;g--)e(c[g])&&f.push(c[g]);return f},Ib:function(a){return"string"==typeof a&&(a=b.a.D(a))?x.JSON&&x.JSON.parse?x.JSON.parse(a):(new Function("return "+a))():p},xa:function(a,d,c){("undefined"==typeof JSON||"undefined"==typeof JSON.stringify)&&
j(Error("Cannot find JSON.stringify(). Some browsers (e.g., IE < 8) don't support it natively, but you can overcome this by adding a script reference to json2.js, downloadable from http://www.json.org/json2.js"));return JSON.stringify(b.a.d(a),d,c)},Jb:function(a,d,c){c=c||{};var e=c.params||{},f=c.includeFields||this.Na,g=a;if("object"==typeof a&&"form"===b.a.u(a))for(var g=a.action,h=f.length-1;0<=h;h--)for(var k=b.a.Oa(a,f[h]),l=k.length-1;0<=l;l--)e[k[l].name]=k[l].value;d=b.a.d(d);var n=y.createElement("form");
n.style.display="none";n.action=g;n.method="post";for(var w in d)a=y.createElement("input"),a.name=w,a.value=b.a.xa(b.a.d(d[w])),n.appendChild(a);for(w in e)a=y.createElement("input"),a.name=w,a.value=e[w],n.appendChild(a);y.body.appendChild(n);c.submitter?c.submitter(n):n.submit();setTimeout(function(){n.parentNode.removeChild(n)},0)}}};b.b("utils",b.a);b.b("utils.arrayForEach",b.a.o);b.b("utils.arrayFirst",b.a.lb);b.b("utils.arrayFilter",b.a.fa);b.b("utils.arrayGetDistinctValues",b.a.Ga);b.b("utils.arrayIndexOf",
b.a.i);b.b("utils.arrayMap",b.a.V);b.b("utils.arrayPushAll",b.a.P);b.b("utils.arrayRemoveItem",b.a.ga);b.b("utils.extend",b.a.extend);b.b("utils.fieldsIncludedWithJsonPost",b.a.Na);b.b("utils.getFormFields",b.a.Oa);b.b("utils.peekObservable",b.a.ua);b.b("utils.postJson",b.a.Jb);b.b("utils.parseJson",b.a.Ib);b.b("utils.registerEventHandler",b.a.n);b.b("utils.stringifyJson",b.a.xa);b.b("utils.range",b.a.Lb);b.b("utils.toggleDomNodeCssClass",b.a.da);b.b("utils.triggerEvent",b.a.Ba);b.b("utils.unwrapObservable",
b.a.d);Function.prototype.bind||(Function.prototype.bind=function(a){var b=this,c=Array.prototype.slice.call(arguments);a=c.shift();return function(){return b.apply(a,c.concat(Array.prototype.slice.call(arguments)))}});b.a.f=new function(){var a=0,d="__ko__"+(new Date).getTime(),c={};return{get:function(a,d){var c=b.a.f.la(a,r);return c===I?I:c[d]},set:function(a,d,c){c===I&&b.a.f.la(a,r)===I||(b.a.f.la(a,m)[d]=c)},la:function(b,f){var g=b[d];if(!g||!("null"!==g&&c[g])){if(!f)return I;g=b[d]="ko"+
a++;c[g]={}}return c[g]},clear:function(a){var b=a[d];return b?(delete c[b],a[d]=p,m):r}}};b.b("utils.domData",b.a.f);b.b("utils.domData.clear",b.a.f.clear);b.a.F=new function(){function a(a,d){var e=b.a.f.get(a,c);e===I&&d&&(e=[],b.a.f.set(a,c,e));return e}function d(c){var e=a(c,r);if(e)for(var e=e.slice(0),k=0;k<e.length;k++)e[k](c);b.a.f.clear(c);"function"==typeof F&&"function"==typeof F.cleanData&&F.cleanData([c]);if(f[c.nodeType])for(e=c.firstChild;c=e;)e=c.nextSibling,8===c.nodeType&&d(c)}
var c="__ko_domNodeDisposal__"+(new Date).getTime(),e={1:m,8:m,9:m},f={1:m,9:m};return{Ca:function(b,d){"function"!=typeof d&&j(Error("Callback must be a function"));a(b,m).push(d)},Xa:function(d,e){var f=a(d,r);f&&(b.a.ga(f,e),0==f.length&&b.a.f.set(d,c,I))},A:function(a){if(e[a.nodeType]&&(d(a),f[a.nodeType])){var c=[];b.a.P(c,a.getElementsByTagName("*"));for(var k=0,l=c.length;k<l;k++)d(c[k])}return a},removeNode:function(a){b.A(a);a.parentNode&&a.parentNode.removeChild(a)}}};b.A=b.a.F.A;b.removeNode=
b.a.F.removeNode;b.b("cleanNode",b.A);b.b("removeNode",b.removeNode);b.b("utils.domNodeDisposal",b.a.F);b.b("utils.domNodeDisposal.addDisposeCallback",b.a.F.Ca);b.b("utils.domNodeDisposal.removeDisposeCallback",b.a.F.Xa);b.a.ta=function(a){var d;if("undefined"!=typeof F)if(F.parseHTML)d=F.parseHTML(a);else{if((d=F.clean([a]))&&d[0]){for(a=d[0];a.parentNode&&11!==a.parentNode.nodeType;)a=a.parentNode;a.parentNode&&a.parentNode.removeChild(a)}}else{var c=b.a.D(a).toLowerCase();d=y.createElement("div");
c=c.match(/^<(thead|tbody|tfoot)/)&&[1,"<table>","</table>"]||!c.indexOf("<tr")&&[2,"<table><tbody>","</tbody></table>"]||(!c.indexOf("<td")||!c.indexOf("<th"))&&[3,"<table><tbody><tr>","</tr></tbody></table>"]||[0,"",""];a="ignored<div>"+c[1]+a+c[2]+"</div>";for("function"==typeof x.innerShiv?d.appendChild(x.innerShiv(a)):d.innerHTML=a;c[0]--;)d=d.lastChild;d=b.a.L(d.lastChild.childNodes)}return d};b.a.ca=function(a,d){b.a.ka(a);d=b.a.d(d);if(d!==p&&d!==I)if("string"!=typeof d&&(d=d.toString()),
"undefined"!=typeof F)F(a).html(d);else for(var c=b.a.ta(d),e=0;e<c.length;e++)a.appendChild(c[e])};b.b("utils.parseHtmlFragment",b.a.ta);b.b("utils.setHtml",b.a.ca);var R={};b.s={ra:function(a){"function"!=typeof a&&j(Error("You can only pass a function to ko.memoization.memoize()"));var b=(4294967296*(1+Math.random())|0).toString(16).substring(1)+(4294967296*(1+Math.random())|0).toString(16).substring(1);R[b]=a;return"\x3c!--[ko_memo:"+b+"]--\x3e"},hb:function(a,b){var c=R[a];c===I&&j(Error("Couldn't find any memo with ID "+
a+". Perhaps it's already been unmemoized."));try{return c.apply(p,b||[]),m}finally{delete R[a]}},ib:function(a,d){var c=[];ca(a,c);for(var e=0,f=c.length;e<f;e++){var g=c[e].sb,h=[g];d&&b.a.P(h,d);b.s.hb(c[e].Fb,h);g.nodeValue="";g.parentNode&&g.parentNode.removeChild(g)}},Ua:function(a){return(a=a.match(/^\[ko_memo\:(.*?)\]$/))?a[1]:p}};b.b("memoization",b.s);b.b("memoization.memoize",b.s.ra);b.b("memoization.unmemoize",b.s.hb);b.b("memoization.parseMemoText",b.s.Ua);b.b("memoization.unmemoizeDomNodeAndDescendants",
b.s.ib);b.Ma={throttle:function(a,d){a.throttleEvaluation=d;var c=p;return b.j({read:a,write:function(b){clearTimeout(c);c=setTimeout(function(){a(b)},d)}})},notify:function(a,d){a.equalityComparer="always"==d?u(r):b.m.fn.equalityComparer;return a}};b.b("extenders",b.Ma);b.fb=function(a,d,c){this.target=a;this.ha=d;this.rb=c;b.p(this,"dispose",this.B)};b.fb.prototype.B=function(){this.Cb=m;this.rb()};b.S=function(){this.w={};b.a.extend(this,b.S.fn);b.p(this,"subscribe",this.ya);b.p(this,"extend",
this.extend);b.p(this,"getSubscriptionsCount",this.yb)};b.S.fn={ya:function(a,d,c){c=c||"change";var e=new b.fb(this,d?a.bind(d):a,function(){b.a.ga(this.w[c],e)}.bind(this));this.w[c]||(this.w[c]=[]);this.w[c].push(e);return e},notifySubscribers:function(a,d){d=d||"change";this.w[d]&&b.r.K(function(){b.a.o(this.w[d].slice(0),function(b){b&&b.Cb!==m&&b.ha(a)})},this)},yb:function(){var a=0,b;for(b in this.w)this.w.hasOwnProperty(b)&&(a+=this.w[b].length);return a},extend:function(a){var d=this;if(a)for(var c in a){var e=
b.Ma[c];"function"==typeof e&&(d=e(d,a[c]))}return d}};b.Qa=function(a){return"function"==typeof a.ya&&"function"==typeof a.notifySubscribers};b.b("subscribable",b.S);b.b("isSubscribable",b.Qa);var C=[];b.r={mb:function(a){C.push({ha:a,La:[]})},end:function(){C.pop()},Wa:function(a){b.Qa(a)||j(Error("Only subscribable things can act as dependencies"));if(0<C.length){var d=C[C.length-1];d&&!(0<=b.a.i(d.La,a))&&(d.La.push(a),d.ha(a))}},K:function(a,b,c){try{return C.push(p),a.apply(b,c||[])}finally{C.pop()}}};
var ma={undefined:m,"boolean":m,number:m,string:m};b.m=function(a){function d(){if(0<arguments.length){if(!d.equalityComparer||!d.equalityComparer(c,arguments[0]))d.H(),c=arguments[0],d.G();return this}b.r.Wa(d);return c}var c=a;b.S.call(d);d.t=function(){return c};d.G=function(){d.notifySubscribers(c)};d.H=function(){d.notifySubscribers(c,"beforeChange")};b.a.extend(d,b.m.fn);b.p(d,"peek",d.t);b.p(d,"valueHasMutated",d.G);b.p(d,"valueWillMutate",d.H);return d};b.m.fn={equalityComparer:function(a,
b){return a===p||typeof a in ma?a===b:r}};var E=b.m.Kb="__ko_proto__";b.m.fn[E]=b.m;b.ma=function(a,d){return a===p||a===I||a[E]===I?r:a[E]===d?m:b.ma(a[E],d)};b.$=function(a){return b.ma(a,b.m)};b.Ra=function(a){return"function"==typeof a&&a[E]===b.m||"function"==typeof a&&a[E]===b.j&&a.zb?m:r};b.b("observable",b.m);b.b("isObservable",b.$);b.b("isWriteableObservable",b.Ra);b.R=function(a){0==arguments.length&&(a=[]);a!==p&&(a!==I&&!("length"in a))&&j(Error("The argument passed when initializing an observable array must be an array, or null, or undefined."));
var d=b.m(a);b.a.extend(d,b.R.fn);return d};b.R.fn={remove:function(a){for(var b=this.t(),c=[],e="function"==typeof a?a:function(b){return b===a},f=0;f<b.length;f++){var g=b[f];e(g)&&(0===c.length&&this.H(),c.push(g),b.splice(f,1),f--)}c.length&&this.G();return c},removeAll:function(a){if(a===I){var d=this.t(),c=d.slice(0);this.H();d.splice(0,d.length);this.G();return c}return!a?[]:this.remove(function(d){return 0<=b.a.i(a,d)})},destroy:function(a){var b=this.t(),c="function"==typeof a?a:function(b){return b===
a};this.H();for(var e=b.length-1;0<=e;e--)c(b[e])&&(b[e]._destroy=m);this.G()},destroyAll:function(a){return a===I?this.destroy(u(m)):!a?[]:this.destroy(function(d){return 0<=b.a.i(a,d)})},indexOf:function(a){var d=this();return b.a.i(d,a)},replace:function(a,b){var c=this.indexOf(a);0<=c&&(this.H(),this.t()[c]=b,this.G())}};b.a.o("pop push reverse shift sort splice unshift".split(" "),function(a){b.R.fn[a]=function(){var b=this.t();this.H();b=b[a].apply(b,arguments);this.G();return b}});b.a.o(["slice"],
function(a){b.R.fn[a]=function(){var b=this();return b[a].apply(b,arguments)}});b.b("observableArray",b.R);b.j=function(a,d,c){function e(){b.a.o(z,function(a){a.B()});z=[]}function f(){var a=h.throttleEvaluation;a&&0<=a?(clearTimeout(t),t=setTimeout(g,a)):g()}function g(){if(!q)if(n&&w())A();else{q=m;try{var a=b.a.V(z,function(a){return a.target});b.r.mb(function(c){var d;0<=(d=b.a.i(a,c))?a[d]=I:z.push(c.ya(f))});for(var c=s.call(d),e=a.length-1;0<=e;e--)a[e]&&z.splice(e,1)[0].B();n=m;h.notifySubscribers(l,
"beforeChange");l=c}finally{b.r.end()}h.notifySubscribers(l);q=r;z.length||A()}}function h(){if(0<arguments.length)return"function"===typeof v?v.apply(d,arguments):j(Error("Cannot write a value to a ko.computed unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.")),this;n||g();b.r.Wa(h);return l}function k(){return!n||0<z.length}var l,n=r,q=r,s=a;s&&"object"==typeof s?(c=s,s=c.read):(c=c||{},s||(s=c.read));"function"!=typeof s&&j(Error("Pass a function that returns the value of the ko.computed"));
var v=c.write,G=c.disposeWhenNodeIsRemoved||c.W||p,w=c.disposeWhen||c.Ka||u(r),A=e,z=[],t=p;d||(d=c.owner);h.t=function(){n||g();return l};h.xb=function(){return z.length};h.zb="function"===typeof c.write;h.B=function(){A()};h.pa=k;b.S.call(h);b.a.extend(h,b.j.fn);b.p(h,"peek",h.t);b.p(h,"dispose",h.B);b.p(h,"isActive",h.pa);b.p(h,"getDependenciesCount",h.xb);c.deferEvaluation!==m&&g();if(G&&k()){A=function(){b.a.F.Xa(G,arguments.callee);e()};b.a.F.Ca(G,A);var D=w,w=function(){return!b.a.X(G)||D()}}return h};
b.Bb=function(a){return b.ma(a,b.j)};w=b.m.Kb;b.j[w]=b.m;b.j.fn={};b.j.fn[w]=b.j;b.b("dependentObservable",b.j);b.b("computed",b.j);b.b("isComputed",b.Bb);b.gb=function(a){0==arguments.length&&j(Error("When calling ko.toJS, pass the object you want to convert."));return ba(a,function(a){for(var c=0;b.$(a)&&10>c;c++)a=a();return a})};b.toJSON=function(a,d,c){a=b.gb(a);return b.a.xa(a,d,c)};b.b("toJS",b.gb);b.b("toJSON",b.toJSON);b.k={q:function(a){switch(b.a.u(a)){case "option":return a.__ko__hasDomDataOptionValue__===
m?b.a.f.get(a,b.c.options.sa):7>=b.a.Z?a.getAttributeNode("value").specified?a.value:a.text:a.value;case "select":return 0<=a.selectedIndex?b.k.q(a.options[a.selectedIndex]):I;default:return a.value}},T:function(a,d){switch(b.a.u(a)){case "option":switch(typeof d){case "string":b.a.f.set(a,b.c.options.sa,I);"__ko__hasDomDataOptionValue__"in a&&delete a.__ko__hasDomDataOptionValue__;a.value=d;break;default:b.a.f.set(a,b.c.options.sa,d),a.__ko__hasDomDataOptionValue__=m,a.value="number"===typeof d?
d:""}break;case "select":for(var c=a.options.length-1;0<=c;c--)if(b.k.q(a.options[c])==d){a.selectedIndex=c;break}break;default:if(d===p||d===I)d="";a.value=d}}};b.b("selectExtensions",b.k);b.b("selectExtensions.readValue",b.k.q);b.b("selectExtensions.writeValue",b.k.T);var ka=/\@ko_token_(\d+)\@/g,na=["true","false"],oa=/^(?:[$_a-z][$\w]*|(.+)(\.\s*[$_a-z][$\w]*|\[.+\]))$/i;b.g={Q:[],aa:function(a){var d=b.a.D(a);if(3>d.length)return[];"{"===d.charAt(0)&&(d=d.substring(1,d.length-1));a=[];for(var c=
p,e,f=0;f<d.length;f++){var g=d.charAt(f);if(c===p)switch(g){case '"':case "'":case "/":c=f,e=g}else if(g==e&&"\\"!==d.charAt(f-1)){g=d.substring(c,f+1);a.push(g);var h="@ko_token_"+(a.length-1)+"@",d=d.substring(0,c)+h+d.substring(f+1),f=f-(g.length-h.length),c=p}}e=c=p;for(var k=0,l=p,f=0;f<d.length;f++){g=d.charAt(f);if(c===p)switch(g){case "{":c=f;l=g;e="}";break;case "(":c=f;l=g;e=")";break;case "[":c=f,l=g,e="]"}g===l?k++:g===e&&(k--,0===k&&(g=d.substring(c,f+1),a.push(g),h="@ko_token_"+(a.length-
1)+"@",d=d.substring(0,c)+h+d.substring(f+1),f-=g.length-h.length,c=p))}e=[];d=d.split(",");c=0;for(f=d.length;c<f;c++)k=d[c],l=k.indexOf(":"),0<l&&l<k.length-1?(g=k.substring(l+1),e.push({key:P(k.substring(0,l),a),value:P(g,a)})):e.push({unknown:P(k,a)});return e},ba:function(a){var d="string"===typeof a?b.g.aa(a):a,c=[];a=[];for(var e,f=0;e=d[f];f++)if(0<c.length&&c.push(","),e.key){var g;a:{g=e.key;var h=b.a.D(g);switch(h.length&&h.charAt(0)){case "'":case '"':break a;default:g="'"+h+"'"}}e=e.value;
c.push(g);c.push(":");c.push(e);e=b.a.D(e);0<=b.a.i(na,b.a.D(e).toLowerCase())?e=r:(h=e.match(oa),e=h===p?r:h[1]?"Object("+h[1]+")"+h[2]:e);e&&(0<a.length&&a.push(", "),a.push(g+" : function(__ko_value) { "+e+" = __ko_value; }"))}else e.unknown&&c.push(e.unknown);d=c.join("");0<a.length&&(d=d+", '_ko_property_writers' : { "+a.join("")+" } ");return d},Eb:function(a,d){for(var c=0;c<a.length;c++)if(b.a.D(a[c].key)==d)return m;return r},ea:function(a,d,c,e,f){if(!a||!b.Ra(a)){if((a=d()._ko_property_writers)&&
a[c])a[c](e)}else(!f||a.t()!==e)&&a(e)}};b.b("expressionRewriting",b.g);b.b("expressionRewriting.bindingRewriteValidators",b.g.Q);b.b("expressionRewriting.parseObjectLiteral",b.g.aa);b.b("expressionRewriting.preProcessBindings",b.g.ba);b.b("jsonExpressionRewriting",b.g);b.b("jsonExpressionRewriting.insertPropertyAccessorsIntoJson",b.g.ba);var K="\x3c!--test--\x3e"===y.createComment("test").text,ja=K?/^\x3c!--\s*ko(?:\s+(.+\s*\:[\s\S]*))?\s*--\x3e$/:/^\s*ko(?:\s+(.+\s*\:[\s\S]*))?\s*$/,ia=K?/^\x3c!--\s*\/ko\s*--\x3e$/:
/^\s*\/ko\s*$/,pa={ul:m,ol:m};b.e={I:{},childNodes:function(a){return B(a)?aa(a):a.childNodes},Y:function(a){if(B(a)){a=b.e.childNodes(a);for(var d=0,c=a.length;d<c;d++)b.removeNode(a[d])}else b.a.ka(a)},N:function(a,d){if(B(a)){b.e.Y(a);for(var c=a.nextSibling,e=0,f=d.length;e<f;e++)c.parentNode.insertBefore(d[e],c)}else b.a.N(a,d)},Va:function(a,b){B(a)?a.parentNode.insertBefore(b,a.nextSibling):a.firstChild?a.insertBefore(b,a.firstChild):a.appendChild(b)},Pa:function(a,d,c){c?B(a)?a.parentNode.insertBefore(d,
c.nextSibling):c.nextSibling?a.insertBefore(d,c.nextSibling):a.appendChild(d):b.e.Va(a,d)},firstChild:function(a){return!B(a)?a.firstChild:!a.nextSibling||H(a.nextSibling)?p:a.nextSibling},nextSibling:function(a){B(a)&&(a=$(a));return a.nextSibling&&H(a.nextSibling)?p:a.nextSibling},jb:function(a){return(a=B(a))?a[1]:p},Ta:function(a){if(pa[b.a.u(a)]){var d=a.firstChild;if(d){do if(1===d.nodeType){var c;c=d.firstChild;var e=p;if(c){do if(e)e.push(c);else if(B(c)){var f=$(c,m);f?c=f:e=[c]}else H(c)&&
(e=[c]);while(c=c.nextSibling)}if(c=e){e=d.nextSibling;for(f=0;f<c.length;f++)e?a.insertBefore(c[f],e):a.appendChild(c[f])}}while(d=d.nextSibling)}}}};b.b("virtualElements",b.e);b.b("virtualElements.allowedBindings",b.e.I);b.b("virtualElements.emptyNode",b.e.Y);b.b("virtualElements.insertAfter",b.e.Pa);b.b("virtualElements.prepend",b.e.Va);b.b("virtualElements.setDomNodeChildren",b.e.N);b.J=function(){this.Ha={}};b.a.extend(b.J.prototype,{nodeHasBindings:function(a){switch(a.nodeType){case 1:return a.getAttribute("data-bind")!=
p;case 8:return b.e.jb(a)!=p;default:return r}},getBindings:function(a,b){var c=this.getBindingsString(a,b);return c?this.parseBindingsString(c,b,a):p},getBindingsString:function(a){switch(a.nodeType){case 1:return a.getAttribute("data-bind");case 8:return b.e.jb(a);default:return p}},parseBindingsString:function(a,d,c){try{var e;if(!(e=this.Ha[a])){var f=this.Ha,g,h="with($context){with($data||{}){return{"+b.g.ba(a)+"}}}";g=new Function("$context","$element",h);e=f[a]=g}return e(d,c)}catch(k){j(Error("Unable to parse bindings.\nMessage: "+
k+";\nBindings value: "+a))}}});b.J.instance=new b.J;b.b("bindingProvider",b.J);b.c={};b.z=function(a,d,c){d?(b.a.extend(this,d),this.$parentContext=d,this.$parent=d.$data,this.$parents=(d.$parents||[]).slice(0),this.$parents.unshift(this.$parent)):(this.$parents=[],this.$root=a,this.ko=b);this.$data=a;c&&(this[c]=a)};b.z.prototype.createChildContext=function(a,d){return new b.z(a,this,d)};b.z.prototype.extend=function(a){var d=b.a.extend(new b.z,this);return b.a.extend(d,a)};b.eb=function(a,d){if(2==
arguments.length)b.a.f.set(a,"__ko_bindingContext__",d);else return b.a.f.get(a,"__ko_bindingContext__")};b.Fa=function(a,d,c){1===a.nodeType&&b.e.Ta(a);return X(a,d,c,m)};b.Ea=function(a,b){(1===b.nodeType||8===b.nodeType)&&Z(a,b,m)};b.Da=function(a,b){b&&(1!==b.nodeType&&8!==b.nodeType)&&j(Error("ko.applyBindings: first parameter should be your view model; second parameter should be a DOM node"));b=b||x.document.body;Y(a,b,m)};b.ja=function(a){switch(a.nodeType){case 1:case 8:var d=b.eb(a);if(d)return d;
if(a.parentNode)return b.ja(a.parentNode)}return I};b.pb=function(a){return(a=b.ja(a))?a.$data:I};b.b("bindingHandlers",b.c);b.b("applyBindings",b.Da);b.b("applyBindingsToDescendants",b.Ea);b.b("applyBindingsToNode",b.Fa);b.b("contextFor",b.ja);b.b("dataFor",b.pb);var fa={"class":"className","for":"htmlFor"};b.c.attr={update:function(a,d){var c=b.a.d(d())||{},e;for(e in c)if("string"==typeof e){var f=b.a.d(c[e]),g=f===r||f===p||f===I;g&&a.removeAttribute(e);8>=b.a.Z&&e in fa?(e=fa[e],g?a.removeAttribute(e):
a[e]=f):g||a.setAttribute(e,f.toString());"name"===e&&b.a.ab(a,g?"":f.toString())}}};b.c.checked={init:function(a,d,c){b.a.n(a,"click",function(){var e;if("checkbox"==a.type)e=a.checked;else if("radio"==a.type&&a.checked)e=a.value;else return;var f=d(),g=b.a.d(f);"checkbox"==a.type&&g instanceof Array?(e=b.a.i(g,a.value),a.checked&&0>e?f.push(a.value):!a.checked&&0<=e&&f.splice(e,1)):b.g.ea(f,c,"checked",e,m)});"radio"==a.type&&!a.name&&b.c.uniqueName.init(a,u(m))},update:function(a,d){var c=b.a.d(d());
"checkbox"==a.type?a.checked=c instanceof Array?0<=b.a.i(c,a.value):c:"radio"==a.type&&(a.checked=a.value==c)}};b.c.css={update:function(a,d){var c=b.a.d(d());if("object"==typeof c)for(var e in c){var f=b.a.d(c[e]);b.a.da(a,e,f)}else c=String(c||""),b.a.da(a,a.__ko__cssValue,r),a.__ko__cssValue=c,b.a.da(a,c,m)}};b.c.enable={update:function(a,d){var c=b.a.d(d());c&&a.disabled?a.removeAttribute("disabled"):!c&&!a.disabled&&(a.disabled=m)}};b.c.disable={update:function(a,d){b.c.enable.update(a,function(){return!b.a.d(d())})}};
b.c.event={init:function(a,d,c,e){var f=d()||{},g;for(g in f)(function(){var f=g;"string"==typeof f&&b.a.n(a,f,function(a){var g,n=d()[f];if(n){var q=c();try{var s=b.a.L(arguments);s.unshift(e);g=n.apply(e,s)}finally{g!==m&&(a.preventDefault?a.preventDefault():a.returnValue=r)}q[f+"Bubble"]===r&&(a.cancelBubble=m,a.stopPropagation&&a.stopPropagation())}})})()}};b.c.foreach={Sa:function(a){return function(){var d=a(),c=b.a.ua(d);if(!c||"number"==typeof c.length)return{foreach:d,templateEngine:b.C.oa};
b.a.d(d);return{foreach:c.data,as:c.as,includeDestroyed:c.includeDestroyed,afterAdd:c.afterAdd,beforeRemove:c.beforeRemove,afterRender:c.afterRender,beforeMove:c.beforeMove,afterMove:c.afterMove,templateEngine:b.C.oa}}},init:function(a,d){return b.c.template.init(a,b.c.foreach.Sa(d))},update:function(a,d,c,e,f){return b.c.template.update(a,b.c.foreach.Sa(d),c,e,f)}};b.g.Q.foreach=r;b.e.I.foreach=m;b.c.hasfocus={init:function(a,d,c){function e(e){a.__ko_hasfocusUpdating=m;var f=a.ownerDocument;"activeElement"in
f&&(e=f.activeElement===a);f=d();b.g.ea(f,c,"hasfocus",e,m);a.__ko_hasfocusUpdating=r}var f=e.bind(p,m),g=e.bind(p,r);b.a.n(a,"focus",f);b.a.n(a,"focusin",f);b.a.n(a,"blur",g);b.a.n(a,"focusout",g)},update:function(a,d){var c=b.a.d(d());a.__ko_hasfocusUpdating||(c?a.focus():a.blur(),b.r.K(b.a.Ba,p,[a,c?"focusin":"focusout"]))}};b.c.html={init:function(){return{controlsDescendantBindings:m}},update:function(a,d){b.a.ca(a,d())}};var da="__ko_withIfBindingData";Q("if");Q("ifnot",r,m);Q("with",m,r,function(a,
b){return a.createChildContext(b)});b.c.options={update:function(a,d,c){"select"!==b.a.u(a)&&j(Error("options binding applies only to SELECT elements"));for(var e=0==a.length,f=b.a.V(b.a.fa(a.childNodes,function(a){return a.tagName&&"option"===b.a.u(a)&&a.selected}),function(a){return b.k.q(a)||a.innerText||a.textContent}),g=a.scrollTop,h=b.a.d(d());0<a.length;)b.A(a.options[0]),a.remove(0);if(h){c=c();var k=c.optionsIncludeDestroyed;"number"!=typeof h.length&&(h=[h]);if(c.optionsCaption){var l=y.createElement("option");
b.a.ca(l,c.optionsCaption);b.k.T(l,I);a.appendChild(l)}d=0;for(var n=h.length;d<n;d++){var q=h[d];if(!q||!q._destroy||k){var l=y.createElement("option"),s=function(a,b,c){var d=typeof b;return"function"==d?b(a):"string"==d?a[b]:c},v=s(q,c.optionsValue,q);b.k.T(l,b.a.d(v));q=s(q,c.optionsText,v);b.a.cb(l,q);a.appendChild(l)}}h=a.getElementsByTagName("option");d=k=0;for(n=h.length;d<n;d++)0<=b.a.i(f,b.k.q(h[d]))&&(b.a.bb(h[d],m),k++);a.scrollTop=g;e&&"value"in c&&ea(a,b.a.ua(c.value),m);b.a.ub(a)}}};
b.c.options.sa="__ko.optionValueDomData__";b.c.selectedOptions={init:function(a,d,c){b.a.n(a,"change",function(){var e=d(),f=[];b.a.o(a.getElementsByTagName("option"),function(a){a.selected&&f.push(b.k.q(a))});b.g.ea(e,c,"value",f)})},update:function(a,d){"select"!=b.a.u(a)&&j(Error("values binding applies only to SELECT elements"));var c=b.a.d(d());c&&"number"==typeof c.length&&b.a.o(a.getElementsByTagName("option"),function(a){var d=0<=b.a.i(c,b.k.q(a));b.a.bb(a,d)})}};b.c.style={update:function(a,
d){var c=b.a.d(d()||{}),e;for(e in c)if("string"==typeof e){var f=b.a.d(c[e]);a.style[e]=f||""}}};b.c.submit={init:function(a,d,c,e){"function"!=typeof d()&&j(Error("The value for a submit binding must be a function"));b.a.n(a,"submit",function(b){var c,h=d();try{c=h.call(e,a)}finally{c!==m&&(b.preventDefault?b.preventDefault():b.returnValue=r)}})}};b.c.text={update:function(a,d){b.a.cb(a,d())}};b.e.I.text=m;b.c.uniqueName={init:function(a,d){if(d()){var c="ko_unique_"+ ++b.c.uniqueName.ob;b.a.ab(a,
c)}}};b.c.uniqueName.ob=0;b.c.value={init:function(a,d,c){function e(){h=r;var e=d(),f=b.k.q(a);b.g.ea(e,c,"value",f)}var f=["change"],g=c().valueUpdate,h=r;g&&("string"==typeof g&&(g=[g]),b.a.P(f,g),f=b.a.Ga(f));if(b.a.Z&&("input"==a.tagName.toLowerCase()&&"text"==a.type&&"off"!=a.autocomplete&&(!a.form||"off"!=a.form.autocomplete))&&-1==b.a.i(f,"propertychange"))b.a.n(a,"propertychange",function(){h=m}),b.a.n(a,"blur",function(){h&&e()});b.a.o(f,function(c){var d=e;b.a.Ob(c,"after")&&(d=function(){setTimeout(e,
0)},c=c.substring(5));b.a.n(a,c,d)})},update:function(a,d){var c="select"===b.a.u(a),e=b.a.d(d()),f=b.k.q(a),g=e!=f;0===e&&(0!==f&&"0"!==f)&&(g=m);g&&(f=function(){b.k.T(a,e)},f(),c&&setTimeout(f,0));c&&0<a.length&&ea(a,e,r)}};b.c.visible={update:function(a,d){var c=b.a.d(d()),e="none"!=a.style.display;c&&!e?a.style.display="":!c&&e&&(a.style.display="none")}};b.c.click={init:function(a,d,c,e){return b.c.event.init.call(this,a,function(){var a={};a.click=d();return a},c,e)}};b.v=function(){};b.v.prototype.renderTemplateSource=
function(){j(Error("Override renderTemplateSource"))};b.v.prototype.createJavaScriptEvaluatorBlock=function(){j(Error("Override createJavaScriptEvaluatorBlock"))};b.v.prototype.makeTemplateSource=function(a,d){if("string"==typeof a){d=d||y;var c=d.getElementById(a);c||j(Error("Cannot find template with ID "+a));return new b.l.h(c)}if(1==a.nodeType||8==a.nodeType)return new b.l.O(a);j(Error("Unknown template type: "+a))};b.v.prototype.renderTemplate=function(a,b,c,e){a=this.makeTemplateSource(a,e);
return this.renderTemplateSource(a,b,c)};b.v.prototype.isTemplateRewritten=function(a,b){return this.allowTemplateRewriting===r?m:this.makeTemplateSource(a,b).data("isRewritten")};b.v.prototype.rewriteTemplate=function(a,b,c){a=this.makeTemplateSource(a,c);b=b(a.text());a.text(b);a.data("isRewritten",m)};b.b("templateEngine",b.v);var qa=/(<[a-z]+\d*(\s+(?!data-bind=)[a-z0-9\-]+(=(\"[^\"]*\"|\'[^\']*\'))?)*\s+)data-bind=(["'])([\s\S]*?)\5/gi,ra=/\x3c!--\s*ko\b\s*([\s\S]*?)\s*--\x3e/g;b.za={vb:function(a,
d,c){d.isTemplateRewritten(a,c)||d.rewriteTemplate(a,function(a){return b.za.Gb(a,d)},c)},Gb:function(a,b){return a.replace(qa,function(a,e,f,g,h,k,l){return W(l,e,b)}).replace(ra,function(a,e){return W(e,"\x3c!-- ko --\x3e",b)})},kb:function(a){return b.s.ra(function(d,c){d.nextSibling&&b.Fa(d.nextSibling,a,c)})}};b.b("__tr_ambtns",b.za.kb);b.l={};b.l.h=function(a){this.h=a};b.l.h.prototype.text=function(){var a=b.a.u(this.h),a="script"===a?"text":"textarea"===a?"value":"innerHTML";if(0==arguments.length)return this.h[a];
var d=arguments[0];"innerHTML"===a?b.a.ca(this.h,d):this.h[a]=d};b.l.h.prototype.data=function(a){if(1===arguments.length)return b.a.f.get(this.h,"templateSourceData_"+a);b.a.f.set(this.h,"templateSourceData_"+a,arguments[1])};b.l.O=function(a){this.h=a};b.l.O.prototype=new b.l.h;b.l.O.prototype.text=function(){if(0==arguments.length){var a=b.a.f.get(this.h,"__ko_anon_template__")||{};a.Aa===I&&a.ia&&(a.Aa=a.ia.innerHTML);return a.Aa}b.a.f.set(this.h,"__ko_anon_template__",{Aa:arguments[0]})};b.l.h.prototype.nodes=
function(){if(0==arguments.length)return(b.a.f.get(this.h,"__ko_anon_template__")||{}).ia;b.a.f.set(this.h,"__ko_anon_template__",{ia:arguments[0]})};b.b("templateSources",b.l);b.b("templateSources.domElement",b.l.h);b.b("templateSources.anonymousTemplate",b.l.O);var O;b.wa=function(a){a!=I&&!(a instanceof b.v)&&j(Error("templateEngine must inherit from ko.templateEngine"));O=a};b.va=function(a,d,c,e,f){c=c||{};(c.templateEngine||O)==I&&j(Error("Set a template engine before calling renderTemplate"));
f=f||"replaceChildren";if(e){var g=N(e);return b.j(function(){var h=d&&d instanceof b.z?d:new b.z(b.a.d(d)),k="function"==typeof a?a(h.$data,h):a,h=T(e,f,k,h,c);"replaceNode"==f&&(e=h,g=N(e))},p,{Ka:function(){return!g||!b.a.X(g)},W:g&&"replaceNode"==f?g.parentNode:g})}return b.s.ra(function(e){b.va(a,d,c,e,"replaceNode")})};b.Mb=function(a,d,c,e,f){function g(a,b){U(b,k);c.afterRender&&c.afterRender(b,a)}function h(d,e){k=f.createChildContext(b.a.d(d),c.as);k.$index=e;var g="function"==typeof a?
a(d,k):a;return T(p,"ignoreTargetNode",g,k,c)}var k;return b.j(function(){var a=b.a.d(d)||[];"undefined"==typeof a.length&&(a=[a]);a=b.a.fa(a,function(a){return c.includeDestroyed||a===I||a===p||!b.a.d(a._destroy)});b.r.K(b.a.$a,p,[e,a,h,c,g])},p,{W:e})};b.c.template={init:function(a,d){var c=b.a.d(d());if("string"!=typeof c&&!c.name&&(1==a.nodeType||8==a.nodeType))c=1==a.nodeType?a.childNodes:b.e.childNodes(a),c=b.a.Hb(c),(new b.l.O(a)).nodes(c);return{controlsDescendantBindings:m}},update:function(a,
d,c,e,f){d=b.a.d(d());c={};e=m;var g,h=p;"string"!=typeof d&&(c=d,d=c.name,"if"in c&&(e=b.a.d(c["if"])),e&&"ifnot"in c&&(e=!b.a.d(c.ifnot)),g=b.a.d(c.data));"foreach"in c?h=b.Mb(d||a,e&&c.foreach||[],c,a,f):e?(f="data"in c?f.createChildContext(g,c.as):f,h=b.va(d||a,f,c,a)):b.e.Y(a);f=h;(g=b.a.f.get(a,"__ko__templateComputedDomDataKey__"))&&"function"==typeof g.B&&g.B();b.a.f.set(a,"__ko__templateComputedDomDataKey__",f&&f.pa()?f:I)}};b.g.Q.template=function(a){a=b.g.aa(a);return 1==a.length&&a[0].unknown||
b.g.Eb(a,"name")?p:"This template engine does not support anonymous templates nested within its templates"};b.e.I.template=m;b.b("setTemplateEngine",b.wa);b.b("renderTemplate",b.va);b.a.Ja=function(a,b,c){a=a||[];b=b||[];return a.length<=b.length?S(a,b,"added","deleted",c):S(b,a,"deleted","added",c)};b.b("utils.compareArrays",b.a.Ja);b.a.$a=function(a,d,c,e,f){function g(a,b){t=l[b];w!==b&&(z[a]=t);t.na(w++);M(t.M);s.push(t);A.push(t)}function h(a,c){if(a)for(var d=0,e=c.length;d<e;d++)c[d]&&b.a.o(c[d].M,
function(b){a(b,d,c[d].U)})}d=d||[];e=e||{};var k=b.a.f.get(a,"setDomNodeChildrenFromArrayMapping_lastMappingResult")===I,l=b.a.f.get(a,"setDomNodeChildrenFromArrayMapping_lastMappingResult")||[],n=b.a.V(l,function(a){return a.U}),q=b.a.Ja(n,d),s=[],v=0,w=0,B=[],A=[];d=[];for(var z=[],n=[],t,D=0,C,E;C=q[D];D++)switch(E=C.moved,C.status){case "deleted":E===I&&(t=l[v],t.j&&t.j.B(),B.push.apply(B,M(t.M)),e.beforeRemove&&(d[D]=t,A.push(t)));v++;break;case "retained":g(D,v++);break;case "added":E!==I?
g(D,E):(t={U:C.value,na:b.m(w++)},s.push(t),A.push(t),k||(n[D]=t))}h(e.beforeMove,z);b.a.o(B,e.beforeRemove?b.A:b.removeNode);for(var D=0,k=b.e.firstChild(a),H;t=A[D];D++){t.M||b.a.extend(t,ha(a,c,t.U,f,t.na));for(v=0;q=t.M[v];k=q.nextSibling,H=q,v++)q!==k&&b.e.Pa(a,q,H);!t.Ab&&f&&(f(t.U,t.M,t.na),t.Ab=m)}h(e.beforeRemove,d);h(e.afterMove,z);h(e.afterAdd,n);b.a.f.set(a,"setDomNodeChildrenFromArrayMapping_lastMappingResult",s)};b.b("utils.setDomNodeChildrenFromArrayMapping",b.a.$a);b.C=function(){this.allowTemplateRewriting=
r};b.C.prototype=new b.v;b.C.prototype.renderTemplateSource=function(a){var d=!(9>b.a.Z)&&a.nodes?a.nodes():p;if(d)return b.a.L(d.cloneNode(m).childNodes);a=a.text();return b.a.ta(a)};b.C.oa=new b.C;b.wa(b.C.oa);b.b("nativeTemplateEngine",b.C);b.qa=function(){var a=this.Db=function(){if("undefined"==typeof F||!F.tmpl)return 0;try{if(0<=F.tmpl.tag.tmpl.open.toString().indexOf("__"))return 2}catch(a){}return 1}();this.renderTemplateSource=function(b,c,e){e=e||{};2>a&&j(Error("Your version of jQuery.tmpl is too old. Please upgrade to jQuery.tmpl 1.0.0pre or later."));
var f=b.data("precompiled");f||(f=b.text()||"",f=F.template(p,"{{ko_with $item.koBindingContext}}"+f+"{{/ko_with}}"),b.data("precompiled",f));b=[c.$data];c=F.extend({koBindingContext:c},e.templateOptions);c=F.tmpl(f,b,c);c.appendTo(y.createElement("div"));F.fragments={};return c};this.createJavaScriptEvaluatorBlock=function(a){return"{{ko_code ((function() { return "+a+" })()) }}"};this.addTemplate=function(a,b){y.write("<script type='text/html' id='"+a+"'>"+b+"\x3c/script>")};0<a&&(F.tmpl.tag.ko_code=
{open:"__.push($1 || '');"},F.tmpl.tag.ko_with={open:"with($1) {",close:"} "})};b.qa.prototype=new b.v;w=new b.qa;0<w.Db&&b.wa(w);b.b("jqueryTmplTemplateEngine",b.qa)}"function"===typeof require&&"object"===typeof exports&&"object"===typeof module?L(module.exports||exports):"function"===typeof define&&define.amd?define(["exports"],L):L(x.ko={});m;
})();
/*
 * ----------------------------- JSTORAGE -------------------------------------
 * Simple local storage wrapper to save data on the browser side, supporting
 * all major browsers - IE6+, Firefox2+, Safari4+, Chrome4+ and Opera 10.5+
 *
 * Copyright (c) 2010 - 2012 Andris Reinman, andris.reinman@gmail.com
 * Project homepage: www.jstorage.info
 *
 * Licensed under MIT-style license:
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

 (function(){
    var
        /* jStorage version */
        JSTORAGE_VERSION = "0.3.2",

        /* detect a dollar object or create one if not found */
        $ = window.jQuery || window.$ || (window.$ = {}),

        /* check for a JSON handling support */
        JSON = {
            parse:
                window.JSON && (window.JSON.parse || window.JSON.decode) ||
                String.prototype.evalJSON && function(str){return String(str).evalJSON();} ||
                $.parseJSON ||
                $.evalJSON,
            stringify:
                Object.toJSON ||
                window.JSON && (window.JSON.stringify || window.JSON.encode) ||
                $.toJSON
        };

    // Break if no JSON support was found
    if(!JSON.parse || !JSON.stringify){
        throw new Error("No JSON support found, include //cdnjs.cloudflare.com/ajax/libs/json2/20110223/json2.js to page");
    }

    var
        /* This is the object, that holds the cached values */
        _storage = {__jstorage_meta:{CRC32:{}}},

        /* Actual browser storage (localStorage or globalStorage['domain']) */
        _storage_service = {jStorage:"{}"},

        /* DOM element for older IE versions, holds userData behavior */
        _storage_elm = null,

        /* How much space does the storage take */
        _storage_size = 0,

        /* which backend is currently used */
        _backend = false,

        /* onchange observers */
        _observers = {},

        /* timeout to wait after onchange event */
        _observer_timeout = false,

        /* last update time */
        _observer_update = 0,

        /* pubsub observers */
        _pubsub_observers = {},

        /* skip published items older than current timestamp */
        _pubsub_last = +new Date(),

        /* Next check for TTL */
        _ttl_timeout,

        /**
         * XML encoding and decoding as XML nodes can't be JSON'ized
         * XML nodes are encoded and decoded if the node is the value to be saved
         * but not if it's as a property of another object
         * Eg. -
         *   $.jStorage.set("key", xmlNode);        // IS OK
         *   $.jStorage.set("key", {xml: xmlNode}); // NOT OK
         */
        _XMLService = {

            /**
             * Validates a XML node to be XML
             * based on jQuery.isXML function
             */
            isXML: function(elm){
                var documentElement = (elm ? elm.ownerDocument || elm : 0).documentElement;
                return documentElement ? documentElement.nodeName !== "HTML" : false;
            },

            /**
             * Encodes a XML node to string
             * based on http://www.mercurytide.co.uk/news/article/issues-when-working-ajax/
             */
            encode: function(xmlNode) {
                if(!this.isXML(xmlNode)){
                    return false;
                }
                try{ // Mozilla, Webkit, Opera
                    return new XMLSerializer().serializeToString(xmlNode);
                }catch(E1) {
                    try {  // IE
                        return xmlNode.xml;
                    }catch(E2){}
                }
                return false;
            },

            /**
             * Decodes a XML node from string
             * loosely based on http://outwestmedia.com/jquery-plugins/xmldom/
             */
            decode: function(xmlString){
                var dom_parser = ("DOMParser" in window && (new DOMParser()).parseFromString) ||
                        (window.ActiveXObject && function(_xmlString) {
                    var xml_doc = new ActiveXObject('Microsoft.XMLDOM');
                    xml_doc.async = 'false';
                    xml_doc.loadXML(_xmlString);
                    return xml_doc;
                }),
                resultXML;
                if(!dom_parser){
                    return false;
                }
                resultXML = dom_parser.call("DOMParser" in window && (new DOMParser()) || window, xmlString, 'text/xml');
                return this.isXML(resultXML)?resultXML:false;
            }
        },

        _localStoragePolyfillSetKey = function(){};


    ////////////////////////// PRIVATE METHODS ////////////////////////

    /**
     * Initialization function. Detects if the browser supports DOM Storage
     * or userData behavior and behaves accordingly.
     */
    function _init(){
        /* Check if browser supports localStorage */
        var localStorageReallyWorks = false;
        if("localStorage" in window){
            try {
                window.localStorage.setItem('_tmptest', 'tmpval');
                localStorageReallyWorks = true;
                window.localStorage.removeItem('_tmptest');
            } catch(BogusQuotaExceededErrorOnIos5) {
                // Thanks be to iOS5 Private Browsing mode which throws
                // QUOTA_EXCEEDED_ERRROR DOM Exception 22.
            }
        }

        if(localStorageReallyWorks){
            try {
                if(window.localStorage) {
                    _storage_service = window.localStorage;
                    _backend = "localStorage";
                    _observer_update = _storage_service.jStorage_update;
                }
            } catch(E3) {/* Firefox fails when touching localStorage and cookies are disabled */}
        }
        /* Check if browser supports globalStorage */
        else if("globalStorage" in window){
            try {
                if(window.globalStorage) {
                    _storage_service = window.globalStorage[window.location.hostname];
                    _backend = "globalStorage";
                    _observer_update = _storage_service.jStorage_update;
                }
            } catch(E4) {/* Firefox fails when touching localStorage and cookies are disabled */}
        }
        /* Check if browser supports userData behavior */
        else {
            _storage_elm = document.createElement('link');
            if(_storage_elm.addBehavior){

                /* Use a DOM element to act as userData storage */
                _storage_elm.style.behavior = 'url(#default#userData)';

                /* userData element needs to be inserted into the DOM! */
                document.getElementsByTagName('head')[0].appendChild(_storage_elm);

                try{
                    _storage_elm.load("jStorage");
                }catch(E){
                    // try to reset cache
                    _storage_elm.setAttribute("jStorage", "{}");
                    _storage_elm.save("jStorage");
                    _storage_elm.load("jStorage");
                }

                var data = "{}";
                try{
                    data = _storage_elm.getAttribute("jStorage");
                }catch(E5){}

                try{
                    _observer_update = _storage_elm.getAttribute("jStorage_update");
                }catch(E6){}

                _storage_service.jStorage = data;
                _backend = "userDataBehavior";
            }else{
                _storage_elm = null;
                return;
            }
        }

        // Load data from storage
        _load_storage();

        // remove dead keys
        _handleTTL();

        // create localStorage and sessionStorage polyfills if needed
        _createPolyfillStorage("local");
        _createPolyfillStorage("session");

        // start listening for changes
        _setupObserver();

        // initialize publish-subscribe service
        _handlePubSub();

        // handle cached navigation
        if("addEventListener" in window){
            window.addEventListener("pageshow", function(event){
                if(event.persisted){
                    _storageObserver();
                }
            }, false);
        }
    }

    /**
     * Create a polyfill for localStorage (type="local") or sessionStorage (type="session")
     *
     * @param {String} type Either "local" or "session"
     * @param {Boolean} forceCreate If set to true, recreate the polyfill (needed with flush)
     */
    function _createPolyfillStorage(type, forceCreate){
        var _skipSave = false,
            _length = 0,
            i,
            storage,
            storage_source = {};

            var rand = Math.random();

        if(!forceCreate && typeof window[type+"Storage"] != "undefined"){
            return;
        }

        // Use globalStorage for localStorage if available
        if(type == "local" && window.globalStorage){
            localStorage = window.globalStorage[window.location.hostname];
            return;
        }

        // only IE6/7 from this point on
        if(_backend != "userDataBehavior"){
            return;
        }

        // Remove existing storage element if available
        if(forceCreate && window[type+"Storage"] && window[type+"Storage"].parentNode){
            window[type+"Storage"].parentNode.removeChild(window[type+"Storage"]);
        }

        storage = document.createElement("button");
        document.getElementsByTagName('head')[0].appendChild(storage);

        if(type == "local"){
            storage_source = _storage;
        }else if(type == "session"){
            _sessionStoragePolyfillUpdate();
        }

        for(i in storage_source){

            if(storage_source.hasOwnProperty(i) && i != "__jstorage_meta" && i != "length" && typeof storage_source[i] != "undefined"){
                if(!(i in storage)){
                    _length++;
                }
                storage[i] = storage_source[i];
            }
        }

        // Polyfill API

        /**
         * Indicates how many keys are stored in the storage
         */
        storage.length = _length;

        /**
         * Returns the key of the nth stored value
         *
         * @param {Number} n Index position
         * @return {String} Key name of the nth stored value
         */
        storage.key = function(n){
            var count = 0, i;
            _sessionStoragePolyfillUpdate();
            for(i in storage_source){
                if(storage_source.hasOwnProperty(i) && i != "__jstorage_meta" && i!="length" && typeof storage_source[i] != "undefined"){
                    if(count == n){
                        return i;
                    }
                    count++;
                }
            }
        }

        /**
         * Returns the current value associated with the given key
         *
         * @param {String} key key name
         * @return {Mixed} Stored value
         */
        storage.getItem = function(key){
            _sessionStoragePolyfillUpdate();
            if(type == "session"){
                return storage_source[key];
            }
            return $.jStorage.get(key);
        }

        /**
         * Sets or updates value for a give key
         *
         * @param {String} key Key name to be updated
         * @param {String} value String value to be stored
         */
        storage.setItem = function(key, value){
            if(typeof value == "undefined"){
                return;
            }
            storage[key] = (value || "").toString();
        }

        /**
         * Removes key from the storage
         *
         * @param {String} key Key name to be removed
         */
        storage.removeItem = function(key){
            if(type == "local"){
                return $.jStorage.deleteKey(key);
            }

            storage[key] = undefined;

            _skipSave = true;
            if(key in storage){
                storage.removeAttribute(key);
            }
            _skipSave = false;
        }

        /**
         * Clear storage
         */
        storage.clear = function(){
            if(type == "session"){
                window.name = "";
                _createPolyfillStorage("session", true);
                return;
            }
            $.jStorage.flush();
        }

        if(type == "local"){

            _localStoragePolyfillSetKey = function(key, value){
                if(key == "length"){
                    return;
                }
                _skipSave = true;
                if(typeof value == "undefined"){
                    if(key in storage){
                        _length--;
                        storage.removeAttribute(key);
                    }
                }else{
                    if(!(key in storage)){
                        _length++;
                    }
                    storage[key] = (value || "").toString();
                }
                storage.length = _length;
                _skipSave = false;
            }
        }

        function _sessionStoragePolyfillUpdate(){
                if(type != "session"){
                    return;
                }
                try{
                    storage_source = JSON.parse(window.name || "{}");
                }catch(E){
                    storage_source = {};
                }
            }

        function _sessionStoragePolyfillSave(){
            if(type != "session"){
                return;
            }
            window.name = JSON.stringify(storage_source);
        };

        storage.attachEvent("onpropertychange", function(e){
            if(e.propertyName == "length"){
                return;
            }

            if(_skipSave || e.propertyName == "length"){
                return;
            }

            if(type == "local"){
                if(!(e.propertyName in storage_source) && typeof storage[e.propertyName] != "undefined"){
                    _length ++;
                }
            }else if(type == "session"){
                _sessionStoragePolyfillUpdate();
                if(typeof storage[e.propertyName] != "undefined" && !(e.propertyName in storage_source)){
                    storage_source[e.propertyName] = storage[e.propertyName];
                    _length++;
                }else if(typeof storage[e.propertyName] == "undefined" && e.propertyName in storage_source){
                    delete storage_source[e.propertyName];
                    _length--;
                }else{
                    storage_source[e.propertyName] = storage[e.propertyName];
                }

                _sessionStoragePolyfillSave();
                storage.length = _length;
                return;
            }

            $.jStorage.set(e.propertyName, storage[e.propertyName]);
            storage.length = _length;
        });

        window[type+"Storage"] = storage;
    }

    /**
     * Reload data from storage when needed
     */
    function _reloadData(){
        var data = "{}";

        if(_backend == "userDataBehavior"){
            _storage_elm.load("jStorage");

            try{
                data = _storage_elm.getAttribute("jStorage");
            }catch(E5){}

            try{
                _observer_update = _storage_elm.getAttribute("jStorage_update");
            }catch(E6){}

            _storage_service.jStorage = data;
        }

        _load_storage();

        // remove dead keys
        _handleTTL();

        _handlePubSub();
    }

    /**
     * Sets up a storage change observer
     */
    function _setupObserver(){
        if(_backend == "localStorage" || _backend == "globalStorage"){
            if("addEventListener" in window){
                window.addEventListener("storage", _storageObserver, false);
            }else{
                document.attachEvent("onstorage", _storageObserver);
            }
        }else if(_backend == "userDataBehavior"){
            setInterval(_storageObserver, 1000);
        }
    }

    /**
     * Fired on any kind of data change, needs to check if anything has
     * really been changed
     */
    function _storageObserver(){
        var updateTime;
        // cumulate change notifications with timeout
        clearTimeout(_observer_timeout);
        _observer_timeout = setTimeout(function(){

            if(_backend == "localStorage" || _backend == "globalStorage"){
                updateTime = _storage_service.jStorage_update;
            }else if(_backend == "userDataBehavior"){
                _storage_elm.load("jStorage");
                try{
                    updateTime = _storage_elm.getAttribute("jStorage_update");
                }catch(E5){}
            }

            if(updateTime && updateTime != _observer_update){
                _observer_update = updateTime;
                _checkUpdatedKeys();
            }

        }, 25);
    }

    /**
     * Reloads the data and checks if any keys are changed
     */
    function _checkUpdatedKeys(){
        var oldCrc32List = JSON.parse(JSON.stringify(_storage.__jstorage_meta.CRC32)),
            newCrc32List;

        _reloadData();
        newCrc32List = JSON.parse(JSON.stringify(_storage.__jstorage_meta.CRC32));

        var key,
            updated = [],
            removed = [];

        for(key in oldCrc32List){
            if(oldCrc32List.hasOwnProperty(key)){
                if(!newCrc32List[key]){
                    removed.push(key);
                    continue;
                }
                if(oldCrc32List[key] != newCrc32List[key] && String(oldCrc32List[key]).substr(0,2) == "2."){
                    updated.push(key);
                }
            }
        }

        for(key in newCrc32List){
            if(newCrc32List.hasOwnProperty(key)){
                if(!oldCrc32List[key]){
                    updated.push(key);
                }
            }
        }

        _fireObservers(updated, "updated");
        _fireObservers(removed, "deleted");
    }

    /**
     * Fires observers for updated keys
     *
     * @param {Array|String} keys Array of key names or a key
     * @param {String} action What happened with the value (updated, deleted, flushed)
     */
    function _fireObservers(keys, action){
        keys = [].concat(keys || []);
        if(action == "flushed"){
            keys = [];
            for(var key in _observers){
                if(_observers.hasOwnProperty(key)){
                    keys.push(key);
                }
            }
            action = "deleted";
        }
        for(var i=0, len = keys.length; i<len; i++){
            if(_observers[keys[i]]){
                for(var j=0, jlen = _observers[keys[i]].length; j<jlen; j++){
                    _observers[keys[i]][j](keys[i], action);
                }
            }
        }
    }

    /**
     * Publishes key change to listeners
     */
    function _publishChange(){
        var updateTime = (+new Date()).toString();

        if(_backend == "localStorage" || _backend == "globalStorage"){
            _storage_service.jStorage_update = updateTime;
        }else if(_backend == "userDataBehavior"){
            _storage_elm.setAttribute("jStorage_update", updateTime);
            _storage_elm.save("jStorage");
        }

        _storageObserver();
    }

    /**
     * Loads the data from the storage based on the supported mechanism
     */
    function _load_storage(){
        /* if jStorage string is retrieved, then decode it */
        if(_storage_service.jStorage){
            try{
                _storage = JSON.parse(String(_storage_service.jStorage));
            }catch(E6){_storage_service.jStorage = "{}";}
        }else{
            _storage_service.jStorage = "{}";
        }
        _storage_size = _storage_service.jStorage?String(_storage_service.jStorage).length:0;

        if(!_storage.__jstorage_meta){
            _storage.__jstorage_meta = {};
        }
        if(!_storage.__jstorage_meta.CRC32){
            _storage.__jstorage_meta.CRC32 = {};
        }
    }

    /**
     * This functions provides the "save" mechanism to store the jStorage object
     */
    function _save(){
        _dropOldEvents(); // remove expired events
        try{
            _storage_service.jStorage = JSON.stringify(_storage);
            // If userData is used as the storage engine, additional
            if(_storage_elm) {
                _storage_elm.setAttribute("jStorage",_storage_service.jStorage);
                _storage_elm.save("jStorage");
            }
            _storage_size = _storage_service.jStorage?String(_storage_service.jStorage).length:0;
        }catch(E7){/* probably cache is full, nothing is saved this way*/}
    }

    /**
     * Function checks if a key is set and is string or numberic
     *
     * @param {String} key Key name
     */
    function _checkKey(key){
        if(!key || (typeof key != "string" && typeof key != "number")){
            throw new TypeError('Key name must be string or numeric');
        }
        if(key == "__jstorage_meta"){
            throw new TypeError('Reserved key name');
        }
        return true;
    }

    /**
     * Removes expired keys
     */
    function _handleTTL(){
        var curtime, i, TTL, CRC32, nextExpire = Infinity, changed = false, deleted = [];

        clearTimeout(_ttl_timeout);

        if(!_storage.__jstorage_meta || typeof _storage.__jstorage_meta.TTL != "object"){
            // nothing to do here
            return;
        }

        curtime = +new Date();
        TTL = _storage.__jstorage_meta.TTL;

        CRC32 = _storage.__jstorage_meta.CRC32;
        for(i in TTL){
            if(TTL.hasOwnProperty(i)){
                if(TTL[i] <= curtime){
                    delete TTL[i];
                    delete CRC32[i];
                    delete _storage[i];
                    changed = true;
                    deleted.push(i);
                }else if(TTL[i] < nextExpire){
                    nextExpire = TTL[i];
                }
            }
        }

        // set next check
        if(nextExpire != Infinity){
            _ttl_timeout = setTimeout(_handleTTL, nextExpire - curtime);
        }

        // save changes
        if(changed){
            _save();
            _publishChange();
            _fireObservers(deleted, "deleted");
        }
    }

    /**
     * Checks if there's any events on hold to be fired to listeners
     */
    function _handlePubSub(){
        if(!_storage.__jstorage_meta.PubSub){
            return;
        }
        var pubelm,
            _pubsubCurrent = _pubsub_last;

        for(var i=len=_storage.__jstorage_meta.PubSub.length-1; i>=0; i--){
            pubelm = _storage.__jstorage_meta.PubSub[i];
            if(pubelm[0] > _pubsub_last){
                _pubsubCurrent = pubelm[0];
                _fireSubscribers(pubelm[1], pubelm[2]);
            }
        }

        _pubsub_last = _pubsubCurrent;
    }

    /**
     * Fires all subscriber listeners for a pubsub channel
     *
     * @param {String} channel Channel name
     * @param {Mixed} payload Payload data to deliver
     */
    function _fireSubscribers(channel, payload){
        if(_pubsub_observers[channel]){
            for(var i=0, len = _pubsub_observers[channel].length; i<len; i++){
                // send immutable data that can't be modified by listeners
                _pubsub_observers[channel][i](channel, JSON.parse(JSON.stringify(payload)));
            }
        }
    }

    /**
     * Remove old events from the publish stream (at least 2sec old)
     */
    function _dropOldEvents(){
        if(!_storage.__jstorage_meta.PubSub){
            return;
        }

        var retire = +new Date() - 2000;

        for(var i=0, len = _storage.__jstorage_meta.PubSub.length; i<len; i++){
            if(_storage.__jstorage_meta.PubSub[i][0] <= retire){
                // deleteCount is needed for IE6
                _storage.__jstorage_meta.PubSub.splice(i, _storage.__jstorage_meta.PubSub.length - i);
                break;
            }
        }

        if(!_storage.__jstorage_meta.PubSub.length){
            delete _storage.__jstorage_meta.PubSub;
        }

    }

    /**
     * Publish payload to a channel
     *
     * @param {String} channel Channel name
     * @param {Mixed} payload Payload to send to the subscribers
     */
    function _publish(channel, payload){
        if(!_storage.__jstorage_meta){
            _storage.__jstorage_meta = {};
        }
        if(!_storage.__jstorage_meta.PubSub){
            _storage.__jstorage_meta.PubSub = [];
        }

        _storage.__jstorage_meta.PubSub.unshift([+new Date, channel, payload]);

        _save();
        _publishChange();
    }


    /**
     * JS Implementation of MurmurHash2
     *
     *  SOURCE: https://github.com/garycourt/murmurhash-js (MIT licensed)
     *
     * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
     * @see http://github.com/garycourt/murmurhash-js
     * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
     * @see http://sites.google.com/site/murmurhash/
     *
     * @param {string} str ASCII only
     * @param {number} seed Positive integer only
     * @return {number} 32-bit positive integer hash
     */

    function murmurhash2_32_gc(str, seed) {
        var
            l = str.length,
            h = seed ^ l,
            i = 0,
            k;

        while (l >= 4) {
            k =
                ((str.charCodeAt(i) & 0xff)) |
                ((str.charCodeAt(++i) & 0xff) << 8) |
                ((str.charCodeAt(++i) & 0xff) << 16) |
                ((str.charCodeAt(++i) & 0xff) << 24);

            k = (((k & 0xffff) * 0x5bd1e995) + ((((k >>> 16) * 0x5bd1e995) & 0xffff) << 16));
            k ^= k >>> 24;
            k = (((k & 0xffff) * 0x5bd1e995) + ((((k >>> 16) * 0x5bd1e995) & 0xffff) << 16));

            h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16)) ^ k;

            l -= 4;
            ++i;
        }

        switch (l) {
            case 3: h ^= (str.charCodeAt(i + 2) & 0xff) << 16;
            case 2: h ^= (str.charCodeAt(i + 1) & 0xff) << 8;
            case 1: h ^= (str.charCodeAt(i) & 0xff);
                h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16));
        }

        h ^= h >>> 13;
        h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16));
        h ^= h >>> 15;

        return h >>> 0;
    }

    ////////////////////////// PUBLIC INTERFACE /////////////////////////

    $.jStorage = {
        /* Version number */
        version: JSTORAGE_VERSION,

        /**
         * Sets a key's value.
         *
         * @param {String} key Key to set. If this value is not set or not
         *              a string an exception is raised.
         * @param {Mixed} value Value to set. This can be any value that is JSON
         *              compatible (Numbers, Strings, Objects etc.).
         * @param {Object} [options] - possible options to use
         * @param {Number} [options.TTL] - optional TTL value
         * @return {Mixed} the used value
         */
        set: function(key, value, options){
            _checkKey(key);

            options = options || {};

            // undefined values are deleted automatically
            if(typeof value == "undefined"){
                this.deleteKey(key);
                return value;
            }

            if(_XMLService.isXML(value)){
                value = {_is_xml:true,xml:_XMLService.encode(value)};
            }else if(typeof value == "function"){
                return undefined; // functions can't be saved!
            }else if(value && typeof value == "object"){
                // clone the object before saving to _storage tree
                value = JSON.parse(JSON.stringify(value));
            }

            _storage[key] = value;

            _storage.__jstorage_meta.CRC32[key] = "2."+murmurhash2_32_gc(JSON.stringify(value));

            this.setTTL(key, options.TTL || 0); // also handles saving and _publishChange

            _localStoragePolyfillSetKey(key, value);

            _fireObservers(key, "updated");
            return value;
        },

        /**
         * Looks up a key in cache
         *
         * @param {String} key - Key to look up.
         * @param {mixed} def - Default value to return, if key didn't exist.
         * @return {Mixed} the key value, default value or null
         */
        get: function(key, def){
            _checkKey(key);
            if(key in _storage){
                if(_storage[key] && typeof _storage[key] == "object" && _storage[key]._is_xml) {
                    return _XMLService.decode(_storage[key].xml);
                }else{
                    return _storage[key];
                }
            }
            return typeof(def) == 'undefined' ? null : def;
        },

        /**
         * Deletes a key from cache.
         *
         * @param {String} key - Key to delete.
         * @return {Boolean} true if key existed or false if it didn't
         */
        deleteKey: function(key){
            _checkKey(key);
            if(key in _storage){
                delete _storage[key];
                // remove from TTL list
                if(typeof _storage.__jstorage_meta.TTL == "object" &&
                  key in _storage.__jstorage_meta.TTL){
                    delete _storage.__jstorage_meta.TTL[key];
                }

                delete _storage.__jstorage_meta.CRC32[key];
                _localStoragePolyfillSetKey(key, undefined);

                _save();
                _publishChange();
                _fireObservers(key, "deleted");
                return true;
            }
            return false;
        },

        /**
         * Sets a TTL for a key, or remove it if ttl value is 0 or below
         *
         * @param {String} key - key to set the TTL for
         * @param {Number} ttl - TTL timeout in milliseconds
         * @return {Boolean} true if key existed or false if it didn't
         */
        setTTL: function(key, ttl){
            var curtime = +new Date();
            _checkKey(key);
            ttl = Number(ttl) || 0;
            if(key in _storage){

                if(!_storage.__jstorage_meta.TTL){
                    _storage.__jstorage_meta.TTL = {};
                }

                // Set TTL value for the key
                if(ttl>0){
                    _storage.__jstorage_meta.TTL[key] = curtime + ttl;
                }else{
                    delete _storage.__jstorage_meta.TTL[key];
                }

                _save();

                _handleTTL();

                _publishChange();
                return true;
            }
            return false;
        },

        /**
         * Gets remaining TTL (in milliseconds) for a key or 0 when no TTL has been set
         *
         * @param {String} key Key to check
         * @return {Number} Remaining TTL in milliseconds
         */
        getTTL: function(key){
            var curtime = +new Date(), ttl;
            _checkKey(key);
            if(key in _storage && _storage.__jstorage_meta.TTL && _storage.__jstorage_meta.TTL[key]){
                ttl = _storage.__jstorage_meta.TTL[key] - curtime;
                return ttl || 0;
            }
            return 0;
        },

        /**
         * Deletes everything in cache.
         *
         * @return {Boolean} Always true
         */
        flush: function(){
            _storage = {__jstorage_meta:{CRC32:{}}};
            _createPolyfillStorage("local", true);
            _save();
            _publishChange();
            _fireObservers(null, "flushed");
            return true;
        },

        /**
         * Returns a read-only copy of _storage
         *
         * @return {Object} Read-only copy of _storage
        */
        storageObj: function(){
            function F() {}
            F.prototype = _storage;
            return new F();
        },

        /**
         * Returns an index of all used keys as an array
         * ['key1', 'key2',..'keyN']
         *
         * @return {Array} Used keys
        */
        index: function(){
            var index = [], i;
            for(i in _storage){
                if(_storage.hasOwnProperty(i) && i != "__jstorage_meta"){
                    index.push(i);
                }
            }
            return index;
        },

        /**
         * How much space in bytes does the storage take?
         *
         * @return {Number} Storage size in chars (not the same as in bytes,
         *                  since some chars may take several bytes)
         */
        storageSize: function(){
            return _storage_size;
        },

        /**
         * Which backend is currently in use?
         *
         * @return {String} Backend name
         */
        currentBackend: function(){
            return _backend;
        },

        /**
         * Test if storage is available
         *
         * @return {Boolean} True if storage can be used
         */
        storageAvailable: function(){
            return !!_backend;
        },

        /**
         * Register change listeners
         *
         * @param {String} key Key name
         * @param {Function} callback Function to run when the key changes
         */
        listenKeyChange: function(key, callback){
            _checkKey(key);
            if(!_observers[key]){
                _observers[key] = [];
            }
            _observers[key].push(callback);
        },

        /**
         * Remove change listeners
         *
         * @param {String} key Key name to unregister listeners against
         * @param {Function} [callback] If set, unregister the callback, if not - unregister all
         */
        stopListening: function(key, callback){
            _checkKey(key);

            if(!_observers[key]){
                return;
            }

            if(!callback){
                delete _observers[key];
                return;
            }

            for(var i = _observers[key].length - 1; i>=0; i--){
                if(_observers[key][i] == callback){
                    _observers[key].splice(i,1);
                }
            }
        },

        /**
         * Subscribe to a Publish/Subscribe event stream
         *
         * @param {String} channel Channel name
         * @param {Function} callback Function to run when the something is published to the channel
         */
        subscribe: function(channel, callback){
            channel = (channel || "").toString();
            if(!channel){
                throw new TypeError('Channel not defined');
            }
            if(!_pubsub_observers[channel]){
                _pubsub_observers[channel] = [];
            }
            _pubsub_observers[channel].push(callback);
        },

        /**
         * Publish data to an event stream
         *
         * @param {String} channel Channel name
         * @param {Mixed} payload Payload to deliver
         */
        publish: function(channel, payload){
            channel = (channel || "").toString();
            if(!channel){
                throw new TypeError('Channel not defined');
            }

            _publish(channel, payload);
        },

        /**
         * Reloads the data from browser storage
         */
        reInit: function(){
            _reloadData();
        }
    };

    // Initialize jStorage
    _init();

})();
/*! SPEAK.js, 1.0.2 - generated on 2014-08-12 */
(function(){for(var e,t=function(){},i=["assert","clear","count","debug","dir","dirxml","error","exception","group","groupCollapsed","groupEnd","info","log","markTimeline","profile","profileEnd","table","time","timeEnd","timeStamp","trace","warn"],n=i.length,r=window.console=window.console||{};n--;)e=i[n],r[e]||(r[e]=t)})(),function(){"use strict";var e,t,i,n,r,a,o,s=this,l={},u=s.__SITECOREDEBUG||!1,d={},c=window._sc;s.Sitecore!==void 0?l=s.Sitecore.Speak:(s.Sitecore={},s.Sitecore.Speak={}),t=e="undefined"!=typeof exports?exports:s.Sitecore.Speak=s._sc={};var p=s.jQuery,h=s._,f=s.ko;h||"undefined"==typeof require||(h=require("underscore")),Backbone||"undefined"==typeof require||(h=require("backbone")),f||"undefined"==typeof require||(f=require("knockout")),t.VERSION="1.0.1",t.__SPEAKDEBUG=u,t.__info=d,t.Pipelines={},t.Factories={},t.Commands={},t.Behaviors={},t.Definitions={Models:{},Views:{},Data:{}},i=t.Definitions.Models,n=t.Definitions.Views,r=t.Definitions.Data,a=t.Commands,o=t.Factories,t.Web={},t.SiteInfo={},t.SiteInfo.virtualFolder="/",t.debug=function(){if(u){switch(arguments.length){case 1:return console.log(arguments[0]),void 0;case 2:return console.log(arguments[0],arguments[1]),void 0;case 3:console.log(arguments[0],arguments[1],arguments[2]);case 4:return console.log(arguments[0],arguments[1],arguments[2],arguments[3]),void 0}console.log(arguments)}};var m=function(e,t){var i=new f.bindingProvider,n=i.nodeHasBindings;return i.exclusionSelector=e,i.nodeHasBindings=function(e){return 8===e.nodeType||p(e).is(i.exclusionSelector)||0!==p(e).closest(t).length?8!==e.nodeType||e.registered?!1:n.call(this,e):n.call(this,e)},i};f.bindingProvider.instance=new m(".data-sc-registered",".data-sc-waiting"),f.bindingHandlers.readonly={update:function(e,t){var i=f.utils.unwrapObservable(t());i?e.setAttribute("readOnly",!0):e.removeAttribute("readOnly")}},s.dialogClose=function(e){t.trigger("sc-frame-message",e)},s.receiveMessage=function(e,i){t.trigger("sc-frame-message",e,i)},s.getParameterByName=function(e){return e=e.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]"),regexS="[\\?&]"+e+"=([^&#]*)",regex=RegExp(regexS),results=regex.exec(window.location.href),null==results?"":decodeURIComponent(results[1].replace(/\+/g," "))},function(e){e.Model.extend=e.Collection.extend=e.Router.extend=e.View.extend=function(e,t){var n=i(this,e,t);return n.extend=this.extend,n};var t=function(){},i=function(i,n,r){var a,o=i.prototype,s=/xyz/.test(function(){})?/\b_super\b/:/.*/;if(a=n&&n.hasOwnProperty("constructor")?n.constructor:function(){i.apply(this,arguments)},h.extend(a,i),t.prototype=i.prototype,a.prototype=new t,n){h.extend(a.prototype,n);var l=n.nestedlayout||a.prototype.nestedlayout,u=a.prototype.modelType===e.Model;u||n.render||l||(n.render=function(){}),u||n.afterRender||l||(n.afterRender=function(){}),u||n.beforeRender||l||(n.beforeRender=function(){});for(var d in n)"function"==typeof n[d]&&"function"==typeof o[d]&&s.test(n[d])&&(a.prototype[d]=function(e,t){return function(){var i=this._super;this._super=o[e];var n=t.apply(this,arguments);return this._super=i,n}}(d,n[d])),l||u||"render"!==d&&"beforeRender"!==d&&"afterRender"!==d||(a.prototype[d]=function(e,t){return function(){if(t.apply(this,arguments),this.hasBehavior){var i=[];"render"===e&&(i=this.behaviorsRender),"afterRender"===e&&(i=this.behaviorsAfterRender),"beforeRender"===e&&(i=this.behaviorsBeforeRender),h.each(i,function(e){e.apply(this,arguments)},this)}}}(d,n[d]))}return r&&h.extend(a,r),a.prototype.constructor=a,a.__super__=i.prototype,a}}(Backbone),i.Model=Backbone.Model.extend({ko:!0,modelType:Backbone.Model,set:function(){var e=arguments[2];arguments[2]||(arguments[2]={}),h.clone(arguments[2].silent);var t=arguments[2].force;if(Backbone.Model.prototype.set.apply(this,arguments),e&&e.computed&&(this.computed=this.computed||{},this.computed[arguments[0]]=e),h.isObject(arguments[0])||e&&e.local||this.updateViewModel(arguments[0],t),h.isObject(arguments[0])&&(!e||!e.local)){var i=arguments[0],n=h.keys(i);h.each(n,function(e){this.updateViewModel(e)},this)}},constructor:function(t){this.ko&&(this.viewModel={}),this.defaults&&t&&h.isObject(t)&&(this.defaults=h.extend(this.defaults,t)),this.ko&&this.defaults&&(this._removeComputed(),this._creatingViewModelFromDefaults()),this.useLocalStorage&&(this.localStorage=new e.Definitions.Data.LocalStorage(t.name)),Backbone.Model.apply(this,[t]),this.ko&&(this._setComputed(),this._preventDefaultFunction(),this._creatingViewModel())},_preventDefaultFunction:function(){var e=["_creatingViewModel","_creatingViewModelFromDefaults","_setComputed","_findAppropriateAndApplyBinding","_removeComputed","_super","_preventDefaultFunction","_validate","bind","change","changedAttributes","clear","clone","constructor","destroy","escape","fetch","get","has","hasChanged","initialize","isNew","isValid","observable","off","on","parse","previous","previousAttributes","save","set","toJSON","trigger","unbind","unset","url"],t=h.functions(this);this.applicableFunctionsFromModel=h.reject(t,function(t){return h.indexOf(e,t)>=0})},_creatingViewModelFromDefaults:function(){var e=this,t=h.keys(this.defaults);h.each(t,function(e){this._findAppropriateAndApplyBinding(e,this.defaults)},this);var i={};this.applicableFunctionsFromModel&&h.each(this.applicableFunctionsFromModel,function(t){i[t]=function(){e[t].apply(e,arguments)}}),h.extend(this.viewModel,i)},_removeComputed:function(){var e=h.keys(this.defaults),t=this.defaults,i=this,n=[];h.each(e,function(e){var i=t[e];if(h.isObject(i)&&i.computed){var r=h.clone(i),a={computed:!0,read:r.read};r.write&&(a=h.extend(a,{write:r.write})),r.owner&&(a=h.extend(a,{owner:r.owner})),n.push({key:e,value:r.value,computed:a}),delete t[e]}}),i.computeds=n},_setComputed:function(){h.each(this.computeds,function(e){var t=e.value||"",i=h.extend(e.computed,{local:!0});this.set(e.key,t,e.computed,i)},this)},updateViewModel:function(e,t){(this.viewModel&&!this.viewModel[e]||t)&&this._findAppropriateAndApplyBinding(e,this.attributes,t)},_findAppropriateAndApplyBinding:function(e,t,i){var n=this.viewModel||{};if(!n[e]||i){if(h.isArray(t[e]))if(t[e].length>0&&t[e][0]&&t[e][0].modelType===Backbone.Model){var r=[];h.each(t[e],function(e){r.push(e.viewModel)}),n[e]=f.observableArray(r),n[e].nested=!0}else n[e]=f.observableArray(t[e]);else t[e]&&t[e].constructor&&h.isObject(t[e].constructor.__super__)&&t[e].ko?(n[e]=t[e].viewModel,n[e].nested=!0):this.computed&&this.computed[e]||(n[e]=f.observable(t[e]));this._registerComputed(e),this._registerSubscribe(e)}},_registerSubscribe:function(e){var t=this,i=this.subscriptions||[],n=this.viewModel||{};n[e].nested||(n[e].isComputed||t.on("change:"+e,function(){if(h.isArray(t.get(e))&&t.get(e).length>0&&t.get(e)[0]&&t.get(e)[0].modelType&&t.get(e)[0].modelType===Backbone.Model){var i=[];h.each(t.get(e),function(e){i.push(e.viewModel)}),n[e](i)}else n[e](t.get(e))}),n[e].subscribe&&(i[e]=n[e].subscribe(function(i){t.set(e,i)})))},_registerComputed:function(e){var t=this,i=this.viewModel||{};if(t.computed&&t.computed[e]){this.computed[e].write&&!this.computed[e].owner&&(t.computed[e].owner=this.viewModel);var n=h.pick(t.computed[e],"write","owner","read");i[e]=n.write?f.computed(n):f.computed(n.read,this.viewModel),i[e].isComputed=!0}},_creatingViewModel:function(){var e=h.keys(this.attributes);h.each(e,function(e){this._findAppropriateAndApplyBinding(e,this.attributes)},this),h.each(e,this._registerComputed,this),h.each(e,this._registerSubscribe,this)}}),i.Model.extend=Backbone.Model.extend,n.View=function(t){t&&(this.app=t.app?t.app:"No parent for this app",delete t.app);var i=this;t&&t.behaviors&&h.each(t.behaviors.split(" "),function(t){i.addBehavior(e.Behaviors[t])}),Backbone.View.apply(this,[t]),this.model&&this.$el&&!this.model.viewModel.$el&&(this.model.viewModel.$el=this.$el),this.model&&this.app&&!this.model.viewModel.app&&(this.model.viewModel.app=this.app),this.setupFunctionWhichCouldBeDataBound(),this.sync()},h.extend(e.Definitions.Views.View.prototype,Backbone.View.prototype,{setupFunctionWhichCouldBeDataBound:function(){var e=["$","_configure","_ensureElement","setupFunctionWhichCouldBeDataBound","applyBindingsIfApplicable","bind","constructor","delegateEvents","initialize","make","off","on","remove","render","setElement","trigger","unbind","undelegateEvents","afterRender","beforeRender","sync"],t=h.functions(this);this.applicableFunctionsFromView=h.reject(t,function(t){return h.indexOf(e,t)>=0});var i=this;h.each(this.applicableFunctionsFromView,function(e){if(this.model&&this.model.viewModel[e])throw"Conflicted names between Model and View, please provide different names: "+e;this.model&&(this.model.viewModel[e]=function(){return i[e].apply(i,arguments)})},this)},sync:function(){this.model&&this.model.ko&&(u&&console.log("Applying Binding for the element which has the data-sc-id: "+this.$el.data("sc-id")+". The viewModel you are trying to apply is:",this.model.viewModel),f.applyBindings(this.model.viewModel?this.model.viewModel:this.model,this.$el.get(0)))},listen:{}}),n.View.extend=Backbone.View.extend,e.Definitions.App=Backbone.Model.extend({appId:void 0,modelType:"application",initialize:function(){this.Controls=[],this.localStorage=this.appId?new e.Definitions.Data.LocalStorage(this.appId):"you need to provide a appID in order to use localStorage"},run:function(e,i,n){var r=t.Factories.createApp(e,i,n,this);return this.initialized!==void 0&&this.initialized(),r.trigger("app:loaded"),r},insertControl:function(e,t,i){var n=this;p.post("/api/rendering",e,function(e){n.insertMarkups(e,name,t,i)})},insertRendering:function(e,t,i){var n,r,a,o,s=this,l=t.ajax||{},u={database:"core",path:"/"},d=i;return l&&l.success&&(o=l.success),h.isFunction(t)?d=t:t&&(u=h.extend(u,t),n=t.selector?t.selector:void 0,r=t.$el?t.$el:void 0),u.name||(u.name=h.uniqueId("subapp_")),a=p.ajax({url:u.path+"?sc_itemid="+e+"&sc_database="+u.database,method:"GET",beforeSend:l.beforeSend,success:function(e,t,i){o&&o.call(e,t,i),s.insertMarkups(e,u.name,{selector:n,$el:r},d)},error:l.error,complete:l.complete})},insertMarkups:function(e,i,n,r){var a,o={prepend:!1,selector:void 0,parent:void 0,$el:void 0},n=h.extend(o,n),s="<div id='"+i+"' data-sc-app style='display:none;'>"+e+"</div>";a=n.$el?n.$el:n.selector?p(n.selector):p("body"),n.prepend?a.prepend(s):a.append(s),t.load(window,a.find("#"+i),function(e){e.ScopedEl.show(),r&&r(e)})},destroy:function(){var t=this;h.each(t.Controls,function(e){e.view.$el.data("sc-app",null),e.view.$el.removeClass("data-sc-registered")});for(var i in t)t[i]instanceof e.Definitions.App&&h.each(t[i].Controls,function(e){e.view.$el.data("sc-app",null),e.view.$el.removeClass("data-sc-registered")});h.each(t.Controls,function(e){f.cleanNode(e.view.$el.get(0)),delete e.model,delete e.view});for(var i in t)delete t[i];return void 0},closeDialog:function(e){window.top.returnValue=e,window.top.dialogClose(e)},sendMessage:function(e){window.top.receiveMessage(e,s.getParameterByName("sp"))}}),e.Definitions.App.extend=Backbone.View.extend,h.extend(e,Backbone.Events),h.extend(n.View.prototype,{addBehavior:function(e){if(this.hasBehavior=!0,this.behaviors=this.behaviors||[],this.behaviorsBeforeRender=this.behaviorsBeforeRender||[],this.behaviorsAfterRender=this.behaviorsAfterRender||[],this.behaviorsRender=this.behaviorsRender||[],!(e.initialize||e.afterRender||e.render||e.beforeRender))throw"behavior should have an initialize or an after Render method";e.events&&(this.events?h.extend(this.events,e.events):this.events=e.events),e.initialize&&this.behaviors.push(e.initialize),e.afterRender&&this.behaviorsAfterRender.push(e.afterRender),e.render&&this.behaviorsRender.push(e.render),e.beforeRender&&this.behaviorsBeforeRender.push(e.beforeRender);var t=h.omit(e,"initialize","events","afterRender","render","beforeRender");h.extend(this,t)}}),h.extend(t,{destroy:function(t){if(!t&&!t.destroy)throw"you need an app to be destroy";var i=t.name;t.destroy(),delete e[i]},noConflict:function(t){return s._sc===e&&(s._sc=c),t&&s.Speak===e&&(s.Speak=l),e}}),h.extend(t,{load:function(i,n,r){var a=[],o=!1;n||(n=p("html"),o=!0),p(n).find("[data-sc-require]").each(function(){var e=p(this);e.is("[data-sc-app]")||p.each(e.data("sc-require").split(","),function(e,t){0>h.indexOf(a,t)&&a.push(t)})});var s=[],l=i.__sc_define;i.__sc_define=function(e,t,i){"string"==typeof e&&s.push(e),l&&l(e,t,i)},p(n).find("script[type='text/x-sitecore-pagescript']").each(function(){i.__sc_define(p(this).attr("src"))}),require(a,function(){var a=p(n).find("script[type='text/x-sitecore-pagecode']"),u=p(n),d=a.attr("src"),c=a.data("sc-behaviors"),h=null;u.attr("data-sc-behaviors",c);var f=function(){if(0==s.length){i.__sc_define=l;var e=new h;r?r(e.run(n.attr("id"),n.attr("id"))):e.run(),o&&t.Helpers.overlay.loadOverlays(e)}else{var a=s;s=[],t.debug("Requiring files: ",a),require(a,f)}},m=function(){if(0===s.length)if(d)t.debug("Requiring page code: ",[d]),require([d],function(e){h=e,f()});else{i.__sc_define=l;var a;a=o?e.Factories.createApp():e.Factories.createApp(n.attr("id"),n.attr("id")),o&&(t.Helpers.overlay.loadOverlays(a),a.initialized!==void 0&&a.initialized(),a.trigger("app:loaded")),r&&r(a)}else{var u=s;s=[],t.debug("Requiring files: ",u),require(u,m)}};m()})}}),h.extend(a,{resolve:function(e){if(!h.isString(e))throw"provied a correct Path to resolve";for(var t=e.split("."),i=s||window,n=0;t.length>n;n++)if(i=i[t[n]],null==i)throw"Reference '"+e+"' not found";return i},executeCommand:function(e,t){if(!e||!h.isString(e))throw"cannot execute command without commandName";var i=a.getCommand(e);i.canExecute(t)&&i.execute(t)},getCommand:function(e){return a.resolve(e)}});var v=function(){var e=this._scAttrs;h.each(e,function(e){if(e.value&&-1!==e.value.indexOf("$el.")){var t=e.value.substring("$el.".length);if(-1!==t.indexOf(":")){var i=t.split(":");if(2===i.length){var n=this.$el[i[0]](i[1]);n!==void 0?this.model.set(e.name,n):e.defaultValue&&this.model.set(e.name,e.defaultValue)}}else this.model.set(e.name,this.$el[t]())}},this),h.each(e,function(e){e.on&&this.model.on("change:"+e.name,this[e.on],this)},this)},g=function(){this._scAttrs&&h.each(this._scAttrs,function(e){var t=h.keys(e),i=this.localStorage.get(e.name);i?this.set(e.name,i):-1===t.indexOf("defaultValue")&&e.value&&-1!==e.value.indexOf("$el.")?this.set(e.name,null):-1===t.indexOf("defaultValue")&&-1===e.value.indexOf("$el.")?this.set(e.name,e.value):t.indexOf("defaultValue")>-1?this.set(e.name,e.defaultValue):this.set(e.name,void 0)},this)},w=function(){this._scAttrs&&h.each(this._scAttrs,function(e){var t=h.keys(e);-1===h.indexOf(t,"defaultValue")&&e.value&&-1!==e.value.indexOf("$el.")?this.set(e.name,null):-1===h.indexOf(t,"defaultValue")&&-1===e.value.indexOf("$el.")?this.set(e.name,e.value):h.indexOf(t,"defaultValue")>-1?this.set(e.name,e.defaultValue):this.set(e.name,void 0)},this)},y=function(e){var t=e;return function(){t.prototype.set.apply(this,arguments);var e=arguments[2];if(h.isObject(arguments[0])&&(!e||!e.local)){var i=arguments[0],n=h.keys(i);h.each(n,function(e){this.localStorage.set(e,i[e])},this)}h.isObject(arguments[0])||e&&e.computed||this.localStorage.set(arguments[0],arguments[1])}};h.extend(o,{createBehavior:function(e,i){return t.Behaviors=t.Behaviors||{},t.Behaviors[e]?t.debug("You are trying to create twice the behaviour "+e):t.Behaviors[e]=i,t.Behaviors[e]},createBaseComponent:function(e){if(!e.name||!e.selector)throw"provide a name and/or a selector";var r,a,o=e.name,s=e.selector,l=e.attributes,u=e.initialize,d=e.base,c=["attributes","name","selector","base","plugin","initialize","listenTo","_scInitFromObject","extendModel","_scInit","_scInitDefaultValue"],p=h.omit(e,c),f=i.Model,m=n.View,b=e.localStorage,x=e.extendModel||{},_=e.collection;d&&(r=h.find(t.Components,function(e){return e.type===d})),r&&(f=r.model,m=r.view);var C;b?(x=h.extend(x,{initialize:function(){this._super(),this._scInitDefaultValueFromLocalStorage()},set:y(f)},{useLocalStorage:!0}),C=f.extend(x)):(x=h.extend(x,{initialize:function(){this._super(),this._scInitDefaultValue()}}),C=f.extend(x));var V=m.extend({initialize:function(){t.debug("initialize - "+o),this._super(),this.model.componentName==o&&(this._scInitFromObject?(this._scInit(),this._scInitFromObject()):this._scInit())}});if(C=C.extend({_scAttrs:l,_scInitDefaultValue:w,_scInitDefaultValueFromLocalStorage:g}),a=h.extend(p,{_scAttrs:l,_scInit:v,_scInitFromObject:u}),e.listenTo){var I={},$=m.prototype.listen,D=e.listenTo,U=h.keys(D);h.each(U,function(e){I[e+":$this"]=D[e]}),I=h.extend($,I),V=h.extend(V,I)}var M;return _&&(M=Backbone.Collection.extend({model:_})),V=V.extend(a),t.Factories.createComponent(o,C,V,s,M)},createComponent:function(e,i,n,r,a){var o;if(!(h.isString(e)&&i&&n&&h.isString(r)))throw"please provide a correct: type (str), model, view and el (html class or id)";return t.Components=t.Components||[],t.Definitions.Models[e]=i,t.Definitions.Views[e]=n,a&&(t.Definitions.Collections[e]=a),h.each(t.Components,function(e){if(e.el===r)throw"you are trying to add compoment with the same el (.class or #id)"}),o={type:e,model:i,view:n,el:r,collection:a},t.Components.push(o),o},createApp:function(e,i,n,r){var a={};return h.isObject(e)?(a=e,t.Pipelines.Application.execute(a),a.current):(a.name=e,a.id=i,a.mainApp=n,a.app=r,a.aborted=!1,t.Pipelines.Application.execute(a),a.current)},createPageCode:function(e,i){var n;return n=t.Definitions.App.extend(i),n=n.extend({appId:e})},createBindingConverter:function(e){if(!e.name||!e.convert)throw"invalid binding converter";if(t.BindingConverters&&t.BindingConverters[e.name])throw"already a converter with the same name";t.BindingConverters=t.BindingConverters||{},t.BindingConverters[e.name]=e.convert}}),i.ComponentModel=i.Model.extend({initialize:function(){}}),i.ControlModel=i.ComponentModel.extend({initialize:function(){this._super(),this.set("isVisible",!0)},toggle:function(){this.set("isVisible",!this.get("isVisible"))}}),i.BlockModel=i.ControlModel.extend({initialize:function(){this._super(),this.set("width",0),this.set("height",0)}}),i.InputModel=i.ControlModel.extend({initialize:function(){this._super(),this.set("isEnabled",!0)}}),i.ButtonBaseModel=i.ControlModel.extend({initialize:function(){this._super(),this.set("isEnabled",!0)}});var b=e.Definitions.Views;b.ComponentView=b.View.extend({listen:h.extend({},e.Definitions.Views.View.prototype.listen,{"set:$this":"set"}),initialize:function(){if(!this.model)throw"Model required in order to instantiate ComponentView";if(!this.el)throw"Element required in order to instantiate ComponentView";var e=this.$el.data("init");if(e){var t=h.keys(e);h.each(t,function(t){this.set(t,e[t])},this.model)}},set:function(e){e&&h.each(h.keys(e),function(t){this.model.set(t,e[t])},this)}}),b.ControlView=b.ComponentView.extend({listen:h.extend({},e.Definitions.Views.ComponentView.prototype.listen,{"toggle:$this":"toggle","focus:$this":"focus","show:$this":"show","hide:$this":"hide"}),initialize:function(){this._super(),this.model.set("isVisible","none"!==this.$el.css("display"))},focus:function(){this.$el.focus()},hide:function(){this.model.set("isVisible",!1)},show:function(){this.model.set("isVisible",!0)},toggle:function(){this.model.toggle()}}),b.BlockView=b.ControlView.extend({initialize:function(){this._super(),this.model.set("width",this.$el.width()),this.model.set("height",this.$el.height())}}),b.InputView=b.ControlView.extend({listen:h.extend({},e.Definitions.Views.ComponentView.prototype.listen,{"enable:$this":"enable","disable:$this":"disable"}),initialize:function(){this._super(),this.model.set("isEnabled","disabled"!=p(this.el).attr("disabled"))},disable:function(){this.model.set("isEnabled",!1)},enable:function(){this.model.set("isEnabled",!0)}}),b.ButtonBaseView=b.ControlView.extend({listen:h.extend({},e.Definitions.Views.ControlView.prototype.listen,{"enable:$this":"enable","disable:$this":"disable"}),initialize:function(){this._super(),this.model.set("isEnabled","disabled"!=p(this.el).attr("disabled"))},click:function(){if(this.model.get("isEnabled")){var t=this.$el.attr("data-sc-click");t&&e.Helpers.invocation.execute(t,{control:this,app:this.app}),this.model._events&&this.model._events.click&&h.each(this.model._events.click,function(e){e.callback&&e.context&&e.callback.call(e.context)})}},disable:function(){this.model.set("isEnabled",!1)},enable:function(){this.model.set("isEnabled",!0)}}),t.Definitions.Collections=t.Definitions.Collections||[],o.createComponent("ComponentBase",i.ComponentModel,n.ComponentView,".sc-componentbase"),o.createComponent("ControlBase",i.ControlModel,n.ControlView,".sc-controlbase"),o.createComponent("BlockBase",i.BlockModel,n.BlockView,".sc-blockbase"),o.createComponent("ButtonBase",i.ButtonBaseModel,n.ButtonBaseView,".sc-buttonBase"),o.createComponent("InputBase",i.InputModel,n.InputView,".sc-inputbase"),o.createComponent("PageBase",i.Model,n.View,"body"),o.createBindingConverter({name:"Has",convert:function(e){return e&&e[0]?h.isArray(e[0])?0===e[0].length?!1:!0:!0:!1}}),o.createBindingConverter({name:"Not",convert:function(e){return!(e&&e[0])}});var x={combine:function(){if(0===arguments.length)return"";var e=h.reduce(arguments,function(e,t){return t&&h.isString(t)?e+"/"+h.compact(t.split("/")).join("/"):e});return e?0===e.indexOf("/")?e:"/"+e:""},isParameterNameAlreadyInUrl:function(e,t){return e.indexOf("?"+t+"=")>=0||e.indexOf("&"+t+"=")>=0},addQueryParameters:function(e,t){var i,n=h.pairs(t),r="([\\?&])({{param}}=[^&]+)",a=e;return h.each(n,function(e){x.isParameterNameAlreadyInUrl(a,e[0])?(i=RegExp(r.replace("{{param}}",encodeURIComponent(e[0])),"i"),a=a.replace(i,"$1"+e[0]+"="+e[1])):(a=a+=~a.indexOf("?")?"&":"?",a+=encodeURIComponent(e[0])+"="+encodeURIComponent(e[1]))}),a},getQueryParameters:function(e){var t,i={};return h.isString(e)?(t=e.split("?"),(t=t.length>1?t[1].split("&"):t[0].split("&"))?(h.each(t,function(e){var t=e.split("=");2===t.length&&(i[t[0]]=decodeURIComponent(t[1].replace(/\+/g," ")))}),i):void 0):i}},_={parseISO:function(e){var t,i,n,r,a,o;return h.isString(e)?(t=parseInt(e.substr(0,4),10),i=parseInt(e.substr(4,2),10)-1,n=parseInt(e.substr(6,2),10),8!==e.indexOf("T")?new Date(Date.UTC(t,i,n,0,0,0,0)):(r=parseInt(e.substr(9,2),10),a=parseInt(e.substr(11,2),10),o=parseInt(e.substr(13,2),10),new Date(Date.UTC(t,i,n,r,a,o)))):null},toISO:function(e){var t;return h.isDate(e)?(t="",t+=e.getUTCFullYear(),t+=this.ensureTwoDigits(e.getUTCMonth()+1),t+=this.ensureTwoDigits(e.getUTCDate()),t+="T",t+=this.ensureTwoDigits(e.getUTCHours()),t+=this.ensureTwoDigits(e.getUTCMinutes()),t+=this.ensureTwoDigits(e.getUTCSeconds())):t},isISO:function(e){var t,i=h.isString(e);return i&&":"===e.charAt(15)&&(e=e.substr(0,15)),!i||8!=e.length&&15!=e.length?!1:(t=this.parseISO(e),"[object Date]"===Object.prototype.toString.call(t)?isNaN(t.getYear())?!1:!0:!1)},ensureTwoDigits:function(e){return 10>e?"0"+(""+e):""+e}},C={isId:function(e){return h.isString(e)?/^\{?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\}?$/i.test(e):!1},toId:function(e){return e&&32===e.length?"{"+e.substr(0,8)+"-"+e.substr(8,4)+"-"+e.substr(12,4)+"-"+e.substr(16,4)+"-"+e.substr(20,12)+"}":e},toShortId:function(e){return h.isString(e)&&C.isId(e)?e.replace(/-|\{|\}/g,""):void 0}},V={endsWith:function(e,t){return t&&e?e.lastIndexOf(t)===e.length-t.length:!1},equals:function(e,t,i){return h.isString(e)&&h.isString(t)?i?h.isBoolean(i)?e===t:void 0:e.toLowerCase()===t.toLowerCase():void 0},format:function(e){return e?(h.each(arguments,function(t,i){e=e.replace(RegExp("\\{"+(i-1)+"\\}","gi"),t)}),e):e},formatByTemplate:function(e,t){if("function"!=typeof t)return e;if("string"!=typeof e)return"";var i=/{{(.*?)}}/gi,n=e.match(i);return h.each(n,function(i){var n=i.replace("{{","").replace("}}",""),r=t(n);r!==void 0&&null!=r&&(e=e.replace(i,r))}),e}},I={getOwnProperties:function(e){var t,i=[];for(t in e)e.hasOwnProperty(t)&&i.push(t);return i}},$={execute:function(e,i){if(e){var n=e.indexOf(":");if(0>=n)throw"Invocation is malformed (missing 'handler:')";i=i||{};var r=e.substr(0,n),a=e.substr(n+1),o=h.extend({},{handler:r,target:a},i);t.Pipelines.Invoke.execute(o)}}},D={loadOverlays:function(e){var i=p("script[type='text/x-sitecore-overlays']");if(0!=i.length){var n=i.data("sc-overlays").split("|"),r=i.data("sc-parameters");for(var a in n){var o=n[a]+"?speak="+t.VERSION+"&"+r;p.ajax({url:o,dataType:"json"}).done(function(i){t.Helpers.overlay.processOverlays(e,i,n[a])}).fail(function(e){console.log("Overlay url failed: "+o,e)})}}},processOverlays:function(e,t,i){var n=t.overlays;for(var r in n)this.processOverlay(e,n[r],i)},processOverlay:function(e,t,i){var n,r=t.command,a=t.selector,o=t.placement,s=t.html;if("component:"==a.substr(0,10)){var l=a.substr(10),u=h.find(e.Controls,function(e){return e.name==l});if(null==u)return console.log("Overlay selector not found: "+a),void 0;n=u.view.$el}else n=p(a);if(null==n||0==n.length)return console.log("Overlay selector not found: "+a),void 0;switch(r){case"insert":this.insert(e,n,o,s,i);break;case"remove":this.remove(e,n);break;case"replace":this.replace(e,n,s,i);break;default:console.log("Unknow overlay command: "+r)}},insert:function(e,i,n,r,a){r="<div data-sc-app id='"+h.uniqueId("overlay-")+"' >"+r,r+="</div>";var o=p(p.parseHTML(r));switch(n){case"before":o.insertBefore(i);break;case"after":o.insertAfter(i);break;case"prepend":i.prepend(r);break;case"append":i.append(r);break;default:console.log("Unknow overlay insert placement: "+n)}t.load(window,o,function(e){t.trigger("overlay-loaded",{app:e,url:a})})},remove:function(e,t){t.remove()},replace:function(e,i,n,r){n=p.parseHTML(n),$html=p(n),i.replaceWith($html),t.load(window,$html,function(e){t.trigger("overlay-loaded",{app:e,url:r})})}},U={init:function(){p(window).resize(function(){t.trigger("window:resize",p(window).width(),p(window).height())})},loaded:function(){t.trigger("window:loaded")}};h.extend(t,{Helpers:{url:x,date:_,id:C,string:V,object:I,invocation:$,overlay:D,window:U}}),t.Helpers.window.init();var M=t.Helpers,S={_current:0,converters:[],aborted:!1},A=function(){return S.converters.length},k=function(e){if(e=e||{},!(h.isFunction(e.canConvert)&&h.isFunction(e.convert)&&h.isFunction(e.reConvert)&&h.isString(e.name)))throw"invalid converter";S.converters.push(e)},O=function(e){S.converters=h.reject(S.converters,function(t){return t.name===e})},T=function(e){return h.find(S.converters,function(t){return t.name===e})},R=function(){return S.converters},B={name:"date",canConvert:function(e){return M.string.equals(e.type,this.name)||M.string.equals(e.type,"datetime")},convert:function(e){var t="",i=e.value;if(i)try{return M.date.parseISO(i).toLocaleDateString()}catch(n){return t}return t},reConvert:function(e){if(!e)return"";try{var t=new Date(e);return M.date.toISO(t)}catch(i){return e||""}},toStringWithFormat:function(e,t){if(M.date.isISO(e))try{var i=M.date.parseISO(e),n={mmss:{expression:"(\\W|^)mm(\\W+s{1,2}\\W|\\W+s{1,2}$)",value:M.date.ensureTwoDigits(i.getUTCMinutes())},mss:{expression:"(\\W|^)m(\\W+s{1,2}\\W|\\W+s{1,2}$)",value:""+i.getUTCMinutes()},hmm:{expression:"(\\Wh{1,2}\\W+|^h{1,2}\\W+)mm(\\W|$)",value:M.date.ensureTwoDigits(i.getUTCMinutes())},hm:{expression:"(\\Wh{1,2}\\W+|^h{1,2}\\W+)m(\\W|$)",value:""+i.getUTCMinutes()},ms:{expression:"(\\Wss\\W|^ss\\W)00(\\W|$)",value:M.date.ensureTwoDigits(i.getUTCMilliseconds())},ampm:{expression:"(\\W|^)AM/PM(\\W|$)",value:i.getUTCHours()>=12?"PM":"AM"},ap:{expression:"(\\W|^)A/P(\\W|$)",value:i.getUTCHours()>=12?"P":"A"},yyyy:{expression:"(\\W|^)yyyy(\\W|$)",value:""+i.getUTCFullYear()},yy:{expression:"(\\W|^)yy(\\W|$)",value:M.date.ensureTwoDigits(i.getUTCFullYear()%100)},mm:{expression:"(\\W|^)mm(\\W|$)",value:M.date.ensureTwoDigits(i.getUTCMonth()+1)},m:{expression:"(\\W|^)m(\\W|$)",value:""+(i.getUTCMonth()+1)},dd:{expression:"(\\W|^)dd(\\W|$)",value:M.date.ensureTwoDigits(i.getUTCDate())},d:{expression:"(\\W|^)d(\\W|$)",value:""+i.getUTCDate()},hh:{expression:"(\\W|^)hh(\\W|$)",value:M.date.ensureTwoDigits(i.getUTCHours())},h:{expression:"(\\W|^)h(\\W|$)",value:i.getUTCHours()>12?""+(i.getUTCHours()-12):""+(0==i.getUTCHours()?12:i.getUTCHours())},ss:{expression:"(\\W|^)ss(\\W|$)",value:M.date.ensureTwoDigits(i.getUTCSeconds())},s:{expression:"(\\W|^)s(\\W|$)",value:""+i.getUTCSeconds()}};for(var r in n){var a=n[r]?n[r].expression:"",o="$1"+n[r].value+"$2";if(""!=a){var s=RegExp(a,"g");t=t.replace(s,o)}}return t}catch(l){return e}return e}},P={name:"Icon",baseUrl:M.url.combine(t.SiteInfo.virtualFolder,"~/icon/"),canConvert:function(e){return M.string.equals(e.type,this.name)},convert:function(e){if(this.canConvert(e)){var t=e.value||"/sitecore/images/blank.gif";return 0!==t.indexOf("/sitecore/")&&(t=M.url.combine(this.baseUrl,t)),M.string.format('<img src="{0}" alt="" />',t)}},reConvert:function(){}},F={length:A,add:k,remove:O,get:T,getAll:R};F.add(B),F.add(P),h.extend(t,{Converters:F});var N=e.Pipelines=function(){var t=[];return{add:function(e){if(!e||!e.name||!h.isObject(e))throw new"invalid pipeline";t.push(e),this[e.name]=e},remove:function(i){t=h.reject(t,function(e){return e.name===i}),delete e.Pipelines[i]},length:function(){return t.length}}}();N.Pipeline=function(e){var t={name:e,processors:[],add:function(e){if(!(e&&e.priority&&e.execute&&h.isNumber(e.priority)&&h.isFunction(e.execute)))throw"not valid step";this.processors.push(e)},length:function(){return this.processors.length},remove:function(e){this.processors=h.reject(this.processors,function(t){return t===e})},execute:function(e){var t=h.sortBy(this.processors,function(e){return e.priority});h.each(t,function(t){return e.aborted?!1:(t.execute(e),void 0)})}};return t};var W=function(e,t){var i=e.split("."),n=i[0];if("this"===n)Function(e).call(t.control.model);else if(t.app&&"app"===n){var r=e.replace("app","this");Function(r).call(t.app)}else Function(e)()},j={priority:1e3,execute:function(e){"javascript"===e.handler&&(e.target.indexOf(";")>0?h.each(e.target.split(";"),function(t){W(t,e)}):W(e.target,e))}},E={priority:2e3,execute:function(t){"command"===t.handler&&e.Commands.executeCommand(t.target)}},H={priority:3e3,execute:function(t){if("serverclick"===t.handler){var i={url:t.target,type:"POST",dataType:"json"},n=function(i){e.Pipelines.ServerInvoke.execute({data:i,model:t.model})};p.ajax(i).done(n)}}},z={priority:4e3,execute:function(e){if("trigger"===e.handler){var t=e.app;if(!t)throw"An application is a required when triggering events";var i=e.target,n={},r=i.indexOf("(");if(r>=0){if(-1==i.indexOf(")",i.length-1))throw"Missing ')'";var a=i.substr(r+1,i.length-r-2);n=p.parseJSON(a),i=i.substr(0,r)}n.sender=e.control,t.trigger(i,n)}}},q={priority:1e3,execute:function(e){var t=e.data.ViewModel;null!=t&&f.mapping.fromJS(t,{},e.model)}},L=new e.Pipelines.Pipeline("Invoke");L.add(j),L.add(E),L.add(H),L.add(z),e.Pipelines.add(L);var Q=new e.Pipelines.Pipeline("ServerInvoke");Q.add(q),e.Pipelines.add(Q);var K=new N.Pipeline("Application"),J=function(){return{}},Y=function(e,t,i,n,r,a,o,s,l){var u,d,c,f,m,v=p(t);if(l){var g=v.find("[data-sc-app]");g.length>0&&p.each(g,function(){p(this).addClass("data-sc-waiting")})}if(!v.data("sc-app")){u=h.uniqueId("sc_"+e.type+"_"),d=v.attr("data-sc-id"),o.appId&&(d=o.appId+":"+d);var w=h.filter(v.prop("class").split(" "),function(e){return-1===e.indexOf("sc_")});if(v.prop("class",w.join(" ")),v.addClass(u),n&&p("[data-sc-exclude] ."+u).length)return{};if(r&&v.closest("[data-sc-app]").attr("id")&&"#"+v.closest("[data-sc-app]").attr("id")!=a)return{};c=new e.model({type:u,name:d}),c.componentName=e.type,v.data("sc-app",i),v.addClass("data-sc-registered"),e.collection&&(f=new e.collection);var y=v.data("sc-behaviors");if(m=new e.view({el:"."+u,model:c,collection:f,app:o,behaviors:y}),h.each(m.$el.find("[data-bind]"),function(e){var t=p(e);0==t.closest(".data-sc-waiting").length&&t.addClass("data-sc-registered")
},this),m.$el.find("*").contents().each(function(){try{this.registered=8===this.nodeType?!0:!1}catch(e){}}),o[d]=c,f&&h.extend(o[d],J(f,e.collection.prototype.defaults)),s.Controls.push({name:d,model:c,view:m,collection:f}),l){var b=v.find(".data-sc-waiting");b.each(function(){p(this).removeClass("data-sc-waiting")})}}return o},G=function(e,t){return e||(t="body",e="app"),t||(t=e),"body"!==t&&0>t.indexOf("#")&&(t="#"+t),{name:e,el:t,$el:p(t)}},X=function(e,t){0===e.find("[data-sc-hasnested]").length?t(e):(h.each(e.find("[data-sc-hasnested]"),function(e){X(p(e),t)}),t(e))},Z={priority:1e3,execute:function(i){i=i||{};var n=i.name,r=i.id,a=i.mainApp,o=i.app,s=G(n,r),l=p(s.$el).find("[data-sc-exclude]"),d=l.length||!1,c=p(s.$el).find("[data-sc-app]").length||!1,f=[];if(i.Controls=[],o=o||new e.Definitions.App,a||(a=e),a[s.name])throw"already an app with this name";o.ScopedEl=s.$el,o.name=s.name,t.Components&&t.Components.length>0&&h.each(t.Components,function(e){p(s.$el).find(e.el+":not(.data-sc-registered)").each(function(){p(this).data("sc-hasnested")?f.push(e):Y(e,this,s.name,d,c,s.$el.selector,o,i)})}),f.length>0&&h.each(f,function(e){p(s.$el).find(e.el+":not(.data-sc-registered)").each(function(){var e=p(this);X(e,function(e){var t=h.find(f,function(t){return e.is(t.el)});Y(t,e.get(0),s.name,d,c,s.$el.selector,o,i,!0)})})}),h.each(i.Controls,function(e){if(e.view.listen){var t=h.keys(e.view.listen);h.each(t,function(t){var i=t;if(i.indexOf(":$this")>=0){var n=e.view.$el.attr("data-sc-id");if(!n)return;i=i.replace("$this",n)}o.on(i,e.view[e.view.listen[t]],e.view)})}}),a===e?a[s.name]=u?o:"application":(a[s.name]=o,a.nested=a.nested||[],a.nested.push(o)),o.Controls=i.Controls,s.$el.find("[data-sc-app]").each(function(){var e=p(this),i=e.attr("data-sc-app"),n=e.attr("data-sc-require");n?require(n.split(","),function(e){var t=new e;t.run(i,i,o)}):t.Factories.createApp({name:i,id:i,mainApp:o,aborted:!1})}),i.current=o}},et=function(e){var i=t.BindingConverters[e];return i?i:void 0},tt=function(e){if(e.converter){var t=[];return h.each(e.from,function(e){t.push(e.model.get(e.attribute))}),e.converter(t)}var i=e.from[0].model,n=e.from[0].attribute;return i.get(n)},it=function(e){h.each(e.from,function(t){t.model.on("change:"+t.attribute,function(){e.model.set(e.to,tt(e))})}),e.model.set(e.to,tt(e))},nt=function(e,t){var i=h.keys(e.attributes),n=h.find(i,function(e){return e===t});return n?t:t.charAt(0).toLowerCase()+t.slice(1)},rt=function(e,t){var i=h.keys(e),n=h.find(i,function(e){return e===t});return n?e[t]:e[t.charAt(0).toUpperCase()+t.slice(1)]},at=function(e,t,i){var n=i,r=e.attr("data-sc-bindings"),a=[],o=t[n];if(0!=r.indexOf("{")){var s=[];h.each(r.split(","),function(e){var t=[];h.each(e.split(":"),function(e){t.push('"'+e+'"')}),s.push(t.join(":"))}),r="{"+s.join(",")+"}"}try{var l=JSON.parse(r);h.each(h.keys(l),function(e){var i,n,r={from:[],to:e,converter:void 0,model:o},s=l[e];r.to=nt(o,e),h.isObject(s)?(r.converter=et(s.converter),h.each(s.parameters,function(e){i=rt(t,e.split(".")[0]),n=nt(i,e.split(".")[1]),r.from.push({model:i,attribute:n})})):(i=t[s.split(".")[0]],n=nt(i,s.split(".")[1]),r.from.push({model:i,attribute:n})),a.push(r)}),h.each(a,it)}catch(u){throw"Failed to data-bind: "+i+"\n"+u}},ot={priority:1500,execute:function(e){0!==e.current.Controls.length&&h.each(e.current.Controls,function(t){t.view.$el.attr("data-sc-bindings")&&at(t.view.$el,e.current,t.view.$el.attr("data-sc-id"))})}},st={priority:2e3,execute:function(e){h.each(e.Controls,function(e){e.view.beforeRender&&e.view.beforeRender()})}},lt={priority:3e3,execute:function(e){h.each(e.Controls,function(e){e.view.render&&e.view.render()})}},ut={priority:4e3,execute:function(e){h.each(e.Controls,function(e){e.view.afterRender&&e.view.afterRender()})}};K.add(Z),K.add(ot),K.add(st),K.add(lt),K.add(ut),e.Pipelines.add(K),h.extend(t.Web,{itemWebApi:{takeValidScope:function(e){switch(e){case"self":return"s";case"children":return"c";case"parent":return"p";default:throw"Unsupported scope. It must be either 'self', 'children' or 'parent'"}},addScope:function(e,i){if(i&&h.isArray(i)){var n=h.compact(h.map(i,t.Web.itemWebApi.takeValidScope)).join("|");e=t.Helpers.url.addQueryParameters(e,{scope:n})}return e},addDatabase:function(e,i){return i&&h.isString(i)&&(e=t.Helpers.url.addQueryParameters(e,{sc_database:i})),e},addContentDatabase:function(e,i){return i&&h.isString(i)&&(e=t.Helpers.url.addQueryParameters(e,{sc_content:i})),e},addItemSelectorUrlPortion:function(i,n,r){return n&&h.isString(n)&&(r&&r.facetsRootItemId&&(i=t.Helpers.url.addQueryParameters(i,{facetsRootItemId:r.facetsRootItemId})),0===n.indexOf("search:")?(i=t.Helpers.url.addQueryParameters(i,{search:n.substr("search:".length)}),r&&r.root&&e.Helpers.id.isId(r.root)&&(i=t.Helpers.url.addQueryParameters(i,{root:r.root})),r&&r.searchConfig&&(i=t.Helpers.url.addQueryParameters(i,{searchConfig:r.searchConfig}))):i=0===n.indexOf("query:")?t.Helpers.url.addQueryParameters(i,{query:n.substr("query:".length)}):t.Helpers.id.isId(n)?t.Helpers.url.addQueryParameters(i,{sc_itemid:n}):t.Helpers.url.combine(i,n)),i},addLanguage:function(e,i){return i&&(e=t.Helpers.url.addQueryParameters(e,{language:i})),e},addItemVersion:function(e,i){return i&&(e=t.Helpers.url.addQueryParameters(e,{sc_itemversion:i})),e},getUrl:function(e,i){i=i||{};var n="/-/item/v1",r="";i.webApi&&(n=i.webApi),i.virtualFolder&&(r=i.virtualFolder);var a=t.Helpers.url.combine(n,r);return a=this.addItemSelectorUrlPortion(a,e,i),i.scope&&(a=this.addScope(a,i.scope)),i.database&&""!=e&&0===e.indexOf("search:")?a=this.addContentDatabase(a,i.database):i.database&&(a=this.addDatabase(a,i.database)),i.language&&(a=this.addLanguage(a,i.language)),i.version&&(a=this.addItemVersion(a,i.version)),i.payLoad&&(a=t.Helpers.url.addQueryParameters(a,{payload:"full"})),i.formatting&&(a=t.Helpers.url.addQueryParameters(a,{format:i.formatting})),i.sorting&&(a=t.Helpers.url.addQueryParameters(a,{sorting:i.sorting})),i.showHiddenItems&&(a=t.Helpers.url.addQueryParameters(a,{showHiddenItems:i.showHiddenItems})),i.fields&&(a=t.Helpers.url.addQueryParameters(a,{fields:i.fields.join("|")})),i.pageSize&&i.pageSize>0&&(a=t.Helpers.url.addQueryParameters(a,{pageIndex:i.pageIndex,pageSize:i.pageSize})),a}}}),function(t){var i,n=t.Backbone,r=t._,a=t.$,o=n.View.prototype._configure;n.View.prototype.render;var s=Array.prototype.push,l=Array.prototype.concat,u=Array.prototype.splice,d=e.Definitions.Views.View.extend({constructor:function(e){e=e||{},d.setupView(this,e),n.View.call(this,e)},nestedlayout:!0,insertView:function(e,t){return t?this.setView(e,t,!0):this.setView(e,!0)},insertViews:function(e){return r.isArray(e)?this.setViews({"":e}):(r.each(e,function(t,i){e[i]=r.isArray(t)?t:[t]}),this.setViews(e))},getView:function(e){return this.getViews(e).first().value()},getViews:function(e){var t=r.chain(this.views).map(function(e){return r.isArray(e)?e:[e]},this).flatten().value();return"string"==typeof e?r.chain([this.views[e]]).flatten():r.chain("function"==typeof e?r.filter(t,e):t)},setView:function(e,t,i){var n,a,o,s=this;if("string"!=typeof e&&(i=t,t=e,e=""),this.views=this.views||{},n=t.__manager__,a=this.views[e],!n)throw Error("Please set `View#manage` property with selector '"+e+"' to `true`.");return o=t._options(),n.parent=s,n.selector=e,i?(this.views[e]=l.call([],a||[],t),n.append=!0,t):(n.hasRendered&&o.partial(s.el,n.selector,t.el,n.append),a&&r.each(l.call([],a),function(e){e.remove()}),this.views[e]=t)},setViews:function(e){return r.each(e,function(e,t){return r.isArray(e)?r.each(e,function(e){this.insertView(t,e)},this):(this.setView(t,e),void 0)},this),this},render:function(){function e(){function e(){var e=n.afterRender;e&&e.call(i,i),i.trigger("afterRender",i)}var t,r;return o&&(n.contains(o.el,i.el)||n.partial(o.el,a.selector,i.el,a.append)),i.delegateEvents(),a.hasRendered=!0,u.resolveWith(i,[i]),(t=a.queue.shift())?t():delete a.queue,l&&l.queue?(r=function(){o.off("afterRender",r,this),e()},o.on("afterRender",r,i)):(e(),void 0)}function t(){var t=i._options(),n=i.__manager__,a=n.parent;a&&a.__manager__,i._render(d._viewRender,t).done(function(){if(!r.keys(i.views).length)return e();var n=r.map(i.views,function(e){var i=r.isArray(e);return i&&e.length?e[0].render().pipe(function(){return t.when(r.map(e.slice(1),function(e){return e.render()}))}):i?e:e.render()});t.when(n).done(function(){e()})})}var i=this,n=i._options(),a=i.__manager__,o=a.parent,l=o&&o.__manager__,u=n.deferred();return a.queue?s.call(a.queue,function(){t()}):(a.queue=[],t(i,u)),u.view=i,u},remove:function(){return d._removeView(this,!0),this._remove.apply(this,arguments)},_options:function(){return d.augment({},this,d.prototype.options,this.options)}},{_cache:{},_makeAsync:function(e,t){var i=e.deferred();return i.async=function(){return i._isAsync=!0,t},i},_viewRender:function(e,t){function i(i){i&&t.html(e.$el,i),s.resolveWith(e,[e])}function n(e,n){var r,o=d._makeAsync(t,function(e){i(e)});d.cache(a,n),n&&(r=t.render.call(o,n,e)),o._isAsync||i(r)}var a,o,s;return e.__manager__,{render:function(){var i=e.serialize||t.serialize,l=e.data||t.data,u=i||l,c=e.template||t.template,p="";return e.parent&&e.parent.$el&&(p=e.parent.$el.data("sc-id")),r.isFunction(u)&&(u=u.call(e)),s=d._makeAsync(t,function(e){n(u,e)}),"string"==typeof c&&(a=t.prefix+c),(o=d.cache(a+p))?(n(u,o,a),s):("string"==typeof c?o=t.fetch.call(s,t.prefix+c,p):null!=c&&(o=t.fetch.call(s,c)),s._isAsync||n(u,o),s)}}},_removeViews:function(e,t){"boolean"==typeof e&&(t=e,e=this),e=e||this,e.getViews().each(function(e){(e.__manager__.hasRendered||t)&&d._removeView(e,t)})},_removeView:function(e,t){var i,n=e.__manager__,a="boolean"==typeof e.keep?e.keep:e.options.keep;if(!a&&(n.append===!0||t)){if(d.cleanViews(e),e._removeViews(!0),e.$el.remove(),!n.parent)return;if(i=n.parent.views[n.selector],r.isArray(i))return r.each(r.clone(i),function(e,t){e&&e.__manager__===n&&u.call(i,t,1)});delete n.parent.views[n.selector]}},cleanViews:function(e){r.each(l.call([],e),function(e){e.unbind(),e.model instanceof n.Model&&e.model.off(null,null,e),e.collection instanceof n.Collection&&e.collection.off(null,null,e),e.cleanup&&e.cleanup.call(e)})},cache:function(e,t){return e in this._cache?this._cache[e]:null!=e&&null!=t?this._cache[e]=t:void 0},configure:function(e){this.augment(d.prototype.options,e),e.manage&&(n.View.prototype.manage=!0)},augment:r.forIn?function(e){return r.reduce(Array.prototype.slice.call(arguments,1),function(e,t){return r.forIn(t,function(t,i){e[i]=t}),e},e)}:r.extend,setupView:function(e,t){if(!e.__manager__){var a,o,s,u=n.LayoutManager.prototype,c=r.pick(e,i);r.defaults(e,{views:{},__manager__:{},_removeViews:d._removeViews,_removeView:d._removeView},d.prototype),t=e.options=r.defaults(t||{},e.options,u.options),s=r.pick(t,l.call(["events"],r.values(t.events||{}))),d.augment(e,s),(c.render===d.prototype.render||c.render===n.View.prototype.render)&&delete c.render,d.augment(t,c),e._remove=n.View.prototype.remove,e._render=function(e,t){var i=this,n=i.__manager__,r=t.beforeRender;return n.hasRendered&&this._removeViews(),r&&r.call(this,this),this.trigger("beforeRender",this),e(this,t).render()},e.render=d.prototype.render,e.remove!==u.remove&&(e._remove=e.remove,e.remove=u.remove),a=t.views||e.views,r.keys(a).length&&(o=a,e.views={},e.setViews(o)),e.options.template?e.options.template=t.template:e.template&&(t.template=e.template,delete e.template)}}});e.Definitions.Views.CompositeView=n.Layout=n.LayoutView=n.LayoutManager=d,d.VERSION="0.7.5",n.View.prototype._configure=function(){var e=o.apply(this,arguments);return this.manage&&d.setupView(this),e},d.prototype.options={prefix:"",deferred:function(){return a.Deferred()},fetch:function(e){return r.template(a(e).html())},partial:function(e,t,i,n){var r=t?a(e).find(t):a(e);this[n?"append":"html"](r,i)},html:function(e,t){e.html(t)},append:function(e,t){e.append(t)},when:function(e){return a.when.apply(null,e)},render:function(e,t){return e(t)},contains:function(e,t){return a.contains(e,t)}},i=r.keys(d.prototype.options),d.prototype.options=r.extend(d.prototype.options,{fetch:function(e,t){var i="[data-layout-"+e+"]";t&&(i="[data-layout-"+e+"='"+t+"']");var n=a(i).html();if(void 0===n)throw"missing template data-layout-"+e+" in order to work";return r.template(n)}})}(this),r.DatabaseUri=function(e){if(!e)throw"Parameter 'databaseName' is null or empty";this.databaseName=e,this.webApi="",this.virtualFolder="/sitecore/shell"},h.extend(r.DatabaseUri.prototype,{getDatabaseName:function(){return this.databaseName}}),r.ItemUri=function(e,t){if(!e)throw"Parameter 'databaseUri' is null or empty";if(!t)throw"Parameter 'itemId' is null or empty";this.databaseUri=e,this.itemId=t},h.extend(r.ItemUri.prototype,{getDatabaseName:function(){return this.databaseUri.databaseName},getDatabaseUri:function(){return this.databaseUri},getItemId:function(){return this.itemId}}),r.ItemVersionUri=function(e,t,i){if(!e)throw"Parameter 'itemUri' is null";if(!t)throw"Parameter 'language' is null or empty";if(!h.isNumber(i))throw"Parameter 'version' is null or not a number";this.itemUri=e,this.language=t,this.version=i},h.extend(r.ItemVersionUri.prototype,{getDatabaseUri:function(){return this.itemUri.getDatabaseUri()},getDatabaseName:function(){return this.itemUri.getDatabaseName()},getItemUri:function(){return this.itemUri},getItemId:function(){return this.itemUri.getItemId()},getLanguage:function(){return this.language},getVersion:function(){return this.version}}),r.FieldUri=function(e,t){if(!e)throw"Parameter 'itemVersionUri' is null or empty";if(!t)throw"Parameter 'fieldId' is null or empty";this.itemVersionUri=e,this.fieldId=t},h.extend(r.FieldUri.prototype,{getDatabaseUri:function(){return this.itemVersionUri.getDatabaseUri()},getDatabaseName:function(){return this.itemVersionUri.getDatabaseName()},getItemUri:function(){return this.itemVersionUri.getItemUri()},getItemId:function(){return this.itemVersionUri.getItemId()},getLanguage:function(){return this.itemVersionUri.getLanguage()},getVersion:function(){return this.itemVersionUri.getVersion()},getFieldId:function(){return this.fieldId}}),r.Database=function(e){if(!e)throw"Parameter 'databaseUri' is null";this.databaseUri=e,this.ajaxOptions={dataType:"json"}},h.extend(r.Database.prototype,{convertToItem:function(e){return e.result?e.result.items?0===e.result.items.length?null:e.result.items.length>1?(console.debug("ERROR: Expected a single item"),null):new t.Definitions.Data.Item(e.result.items[0]):(console.debug("ERROR: No items from server"),null):(console.debug("ERROR: No data from server"),null)},convertToItems:function(e){if(!e.result)return console.debug("ERROR: No data from server"),{items:[],totalCount:0,data:e};if(!e.result.items)return console.debug("ERROR: No items from server"),{items:[],totalCount:0,data:e};var i=h.map(e.result.items,function(e){return new t.Definitions.Data.Item(e)});return{items:i,total:e.result.totalCount,data:e.result}},getItem:function(e,i,n){if(!e)throw"Parameter 'id' is null";if(!i)throw"Parameter 'completed' is null";n=n||{},e instanceof t.Definitions.Data.ItemUri&&(n.database=e.getDatabaseName(),e=e.getItemId()),e instanceof t.Definitions.Data.ItemVersionUri&&(n.database=e.getDatabaseName(),n.language=e.getLanguage(),n.version=e.getVersion(),e=e.getItemId());var r=this.getUrl(e,n);this.get(r).pipe(this.convertToItem).done(i).fail(function(e){i(null,e)})},search:function(e,t,i){if(!t)throw"Parameter 'completed' is null";var n=this.getUrl("search:"+e,i);this.get(n).pipe(this.convertToItems).done(function(e){t(e.items,e.total,e.data)}).fail(function(e){t([],0,e)})},query:function(e,t,i){if(!e)throw"Parameter 'queryExpression' is null";if(!t)throw"Parameter 'completed' is null";var n=this.getUrl("query:"+e,i);this.get(n).pipe(this.convertToItems).done(function(e){t(e.items,e.total,e.data)}).fail(function(e){t([],0,e)})},getChildren:function(e,t,i){if(!e)throw"Parameter 'id' is null";if(!t)throw"Parameter 'completed' is null";i=i||{},i.scope||(i.scope=["children"]);var n=this.getUrl(e,i);this.get(n).pipe(this.convertToItems).done(function(e){t(e.items,e.total,e.data)}).fail(function(e){t([],0,e)})},getUrl:function(t,i){i=i||{},i.database||(i.database=this.databaseUri.getDatabaseName()),i.webApi||(i.webApi=this.databaseUri.webApi),i.virtualFolder||(i.virtualFolder=this.databaseUri.virtualFolder);var n=e.Web.itemWebApi.getUrl(t,i);return n},get:function(e){return p.ajax({url:e,dataType:this.ajaxOptions.dataType})}}),r.Field=function(e,t,i,n,a){if(!e)throw"Parameter 'item' is null";if(!(t instanceof r.FieldUri))throw"Parameter 'fieldUri' is null";this.item=e,this.fieldUri=t,this.fieldName=i||"",this.value=n||"",this.type=a||"Single-Line Text"},h.extend(r.Field.prototype,{toModel:function(){return this.$model||(this.$model=new t.Definitions.Models.Model(this)),this.$model},toViewModel:function(){var e={fieldId:this.fieldUri.getFieldId(),fieldName:this.fieldName,type:this.type,value:new f.observable(this.value)},t=this;return e.value.subscribe(function(e){t.item[t.fieldName]=e,t.value=e}),e}}),r.LocalStorage=function(e){if(!e)throw"you need to provide a unique key";this.appID=e,this.fullKey=this.prefix+this.appID,this.localStorageLibrary=p.jStorage},h.extend(r.LocalStorage.prototype,{prefix:"#sc#",get:function(e){var t=this.fullKey+e;return this.localStorageLibrary.get(t)},getAll:function(){var e,t=this.localStorageLibrary.index(),i={};return e=h.filter(t,function(e){return e.indexOf(this.fullKey)>=0},this),h.each(e,function(e){var t=e.substring(this.fullKey.length,e.length);i[t]=this.localStorageLibrary.get(e)},this),i},deleteRecord:function(e){var t=this.fullKey+e;return this.localStorageLibrary.deleteKey(t)},set:function(e,t,i){var n=this.fullKey+e;return this.localStorageLibrary.set(n,t,i)},flush:function(){var e=this.localStorageLibrary.index(),t=h.filter(e,function(e){return e.indexOf(this.fullKey)>=0},this);h.each(t,function(e){this.localStorageLibrary.deleteKey(e)},this)}});var dt={options:function(e,t){return{dataType:"json",type:e,data:t}},convertResponse:function(e){return 200!==e.statusCode?p.Deferred().reject({readyState:4,status:e.statusCode,responseText:e.error.message}):e.result},createItem:function(e){return new t.Definitions.Data.Item(e.items[0])},triggerCreated:function(e){return t.trigger("item:created",e),e}},ct=function(e,i,n){var r=e;if(!e.name||!e.templateId||!e.parentId)throw"Provide valid parameter in order to create an Item";e.database||(e.database="core");var a=t.Web.itemWebApi.getUrl(r.parentId,{webApi:"/-/item/v1/sitecore/shell",database:e.database});return a=t.Helpers.url.addQueryParameters(a,{name:e.name}),a=t.Helpers.url.addQueryParameters(a,{template:e.templateId}),p.when(p.ajax(a,dt.options("POST",i))).pipe(dt.convertResponse).pipe(dt.createItem).pipe(dt.triggerCreated).done(n)},pt=function(e,i){var n;this.$fields?n=h.map(this.$fields,function(e){return{name:e.fieldName,value:this[e.fieldName]}},this):(n=h.map(this.attributes.$fields,function(e){var t;return this.attributes[e.fieldName]!==e.value?t={name:e.fieldName,value:this.attributes[e.fieldName]}:void 0},this),n=h.filter(n,function(e){return e!==void 0}));var r=this.getUrl(),a={dataType:"json",type:"PUT",data:n},o=function(e){return t.trigger("item:updated",this),e};return p.when(p.ajax(r,a)).pipe(this.convertResponse).pipe(o).done(p.proxy(e,i))},ht=function(t,i){var n=this.getUrl(),r={dataType:"json",type:"GET"},a=function(t){if(!t.items)return this;if(0===t.items.length)throw"Item not found";if(date.items.length>1)throw"Expected a single item";var i=t.items[0];return h.each(i.Fields,function(t,i){this[t.Name]=t.Value;var n=this.getFieldById(i);null!=n?n.value=t.Value:this.$fields.push(this,new e.Definitions.Data.Field(fieldUri,t.Name,t.Value,t.Type))},this),this};return p.when(p.ajax(n,r)).pipe(this.convertResponse).pipe(a).done(p.proxy(t,i))},O=function(e,i){var n=this.getUrl(),r={dataType:"json",type:"DELETE"},a=function(e){return t.trigger("item:deleted",this),e};return p.when(p.ajax(n,r)).pipe(this.convertResponse).pipe(a).done(p.proxy(e,i))},ft=function(e,i,n){var r=[{name:"__itemName",value:e}],a=this.getUrl(),o={dataType:"json",type:"PUT",data:r},s=function(e){return t.trigger("item:renamed",this),e};return p.when(p.ajax(a,o)).pipe(this.convertResponse).pipe(s).done(p.proxy(i,n))};r.createItem=ct;var mt=function(e,t,i){var n=this;i=i||{};var r=i.success||function(){t&&t(n)};switch(e){case"read":this.read(this).pipe(r);break;case"create":throw"The 'create' operation is not supported";case"update":this.update(this,i).pipe(r);break;case"delete":this.remove(this).pipe(r)}},vt=e.Definitions.Models.Model.extend({idAttribute:"itemId",getUrl:function(){var e=this.get("itemUri"),t=new r.Database(e.getDatabaseUri());return t.getUrl(e.getItemId())},read:ht,remove:O,rename:ft,update:pt});if(r.Item=function(e,t){if(!t)if(t=e,t.itemUri)e=t.itemUri;else{var i=new r.DatabaseUri(t.Database);e=new r.ItemUri(i,t.ID)}return t instanceof r.Item?(this.shallowCopy(t),void 0):(this.$fields=[],h.each(t.Fields,function(t,i){this[t.Name]=t.Value;var n=new r.FieldUri(e,i),a=new r.Field(this,n,t.Name,t.Value,t.Type);t.FormattedValue&&(a.formattedValue=t.FormattedValue),t.LongDateValue&&(a.longDateValue=t.LongDateValue),t.ShortDateValue&&(a.shortDateValue=t.ShortDateValue),this.$fields.push(a)},this),this.itemUri=e,this.itemId=e.getItemId(),this.itemName=t.Name||"",this.$displayName=t.DisplayName||"",this.$database=t.Database||"",this.$language=t.Language||"",this.$version=t.Version||0,this.$templateName=t.TemplateName||"",this.$templateId=t.TemplateId||"",this.$hasChildren=t.HasChildren||!1,this.$path=t.Path||"",this.$url=t.Url||"",this.$mediaurl=t.MediaUrl||"",this.$icon=t.Icon||"",void 0)},h.extend(r.Item.prototype,{getFieldById:function(e){return h.find(this.$fields,function(t){return t.fieldUri.getFieldId()==e},this)},shallowCopy:function(e){this.$fields=e.$fields,h.each(e.$fields,function(e){this[e.Name]=e.Value},this),this.itemUri=e.itemUri,this.itemId=e.itemId,this.itemName=e.itemName,this.$displayName=e.$displayName,this.$language=e.$language,this.$version=e.$version,this.$templateName=e.$templateName,this.$templateId=e.$templateId,this.$hasChildren=e.$hasChildren,this.$path=e.$path,this.$url=e.$url,this.$mediaurl=e.$mediaurl},toModel:function(){if(!this.$model){var e=new vt(this);return e.sync=mt,e}return this.$model},toViewModel:function(){return this.toModel().viewModel},convertResponse:dt.convertResponse}),h.extend(t.Factories,{createJQueryUIComponent:function(e,t,i){var n=e.ControlModel.extend({initialize:function(){this._super(),i.model&&h.each(h.keys(i.model),function(e){this.model[e]=i.model[e]},this),h.each(i.attributes,function(e){var t=e.defaultValue!==void 0?e.defaultValue:null;this.set(e.name,t)},this),this.initialized!==void 0&&this.initialized()}}),r=t.ControlView.extend({initialize:function(e){this._super();var t;e=e||{},i.view&&h.each(h.keys(i.view),function(e){this[e]=i.view[e]},this),h.each(i.attributes,function(i){var n=i.defaultValue!==void 0?i.defaultValue:null;n!==void 0&&null!==n&&(t=i.pluginProperty!==void 0?i.pluginProperty:i.name,e[t]=n);var r=this.$el.attr("data-sc-option-"+t);r&&("true"==r&&(r=!0),"false"==r&&(r=!1),this.model.set(i.name,r),t=i.pluginProperty!==void 0?i.pluginProperty:i.name,e[t]=r)},this),h.each(i.events,function(t){if(e[t.name]===void 0){var i=this;e[t.name]=function(e,n){i.raiseEvent(t,e,n)}}},this),this.$el[i.control](e),this.widget=this.$el[i.control],this.widget=this.widget||this.$el.data(i.control),this.widget=this.widget||this.$el.data(i.namespace+i.control),h.each(i.functions,function(e){var t=this;this[e.name]=function(){if(!t.widget[e.name]){var i=t.widget;return i.apply(t.$el,[e.name,arguments[0]])}return t.widget[e.name].apply(t.widget,arguments)}},this),this.model.on("change",function(e){var t,n,r={};e.changed&&(h.each(h.keys(e.changed),function(a){h.find(i.attributes,function(e){return e.name==a&&1==e.added})||(n=h.find(i.attributes,function(e){return e.name==a}),t=n&&n.pluginProperty!==void 0?n.pluginProperty:a,r[t]=e.get(a))}),this.$el[i.control]("option",r))},this),this.initialized!==void 0&&this.initialized()},raiseEvent:function(e,t,i){e.on&&this[e.on](t,i);var n=this.$el.attr("data-sc-id"),r=this.app[n];r&&r[e.name]!==void 0&&r[e.name](r,t,i),n&&this.app.trigger(e.name+":"+n,t,i)}});o.createComponent(i.componentName,n,r,i.selector)}}),u){var gt=0,wt=0,yt=0,bt=[],xt=function(e){var t=0,i=[],n=0;for(var r in e)if(e[r]&&"application"===e[r].modelType){var e=e[r];yt+=1,t+=1,h.each(e.Controls,function(e){wt+=1,n+=1,bt.push(e)}),i.push(xt(e[r]))}return{numberOfNestedApp:gt,nestedApps:i,nbControlInThisApp:n}},_t=function(){var t=xt(e);return{numberOfApps:gt,totalNumberOfControls:wt,totlaNumberOfApp:yt,alltheControls:bt,allApplications:t}};t.__info=function(){return{Components:{totalComponents:e.Components.length,compontentList:e.Components},Pipelines:{totalPipelines:e.Pipelines.length()},Applications:_t()}}}}.call(window);