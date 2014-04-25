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
/*! SPEAK.js, 1.0.2 - generated on 2014-02-13 */
!function(){for(var a,b=function(){},c=["assert","clear","count","debug","dir","dirxml","error","exception","group","groupCollapsed","groupEnd","info","log","markTimeline","profile","profileEnd","table","time","timeEnd","timeStamp","trace","warn"],d=c.length,e=window.console=window.console||{};d--;)a=c[d],e[a]||(e[a]=b)}(),function(){"use strict";var a,b,c,d,e,f,g,h=this,i=h.Sitecore,j=h.__SITECOREDEBUG||!1,k={},l=window._sc;b=a="undefined"!=typeof exports?exports:h.Sitecore=h._sc={};var m=h.jQuery,n=h._,o=h.ko;n||"undefined"==typeof require||(n=require("underscore")),Backbone||"undefined"==typeof require||(n=require("backbone")),o||"undefined"==typeof require||(o=require("knockout")),b.VERSION="1.0.1",b.__SITECOREDEBUG=j,b.__info=k,b.Pipelines={},b.Factories={},b.Commands={},b.Behaviors={},b.Definitions={Models:{},Views:{},Data:{}},c=b.Definitions.Models,d=b.Definitions.Views,e=b.Definitions.Data,f=b.Commands,g=b.Factories,b.Web={},b.SiteInfo={},b.SiteInfo.virtualFolder="/",b.debug=function(){if(j){switch(arguments.length){case 1:return void console.log(arguments[0]);case 2:return void console.log(arguments[0],arguments[1]);case 3:console.log(arguments[0],arguments[1],arguments[2]);case 4:return void console.log(arguments[0],arguments[1],arguments[2],arguments[3])}console.log(arguments)}};var p=function(a,b){var c=new o.bindingProvider,d=c.nodeHasBindings;return c.exclusionSelector=a,c.nodeHasBindings=function(a){return 8===a.nodeType||m(a).is(c.exclusionSelector)||0!==m(a).closest(b).length?8!==a.nodeType||a.registered?!1:d.call(this,a):d.call(this,a)},c};o.bindingProvider.instance=new p(".data-sc-registered",".data-sc-waiting"),o.bindingHandlers.readonly={update:function(a,b){var c=o.utils.unwrapObservable(b());c?a.setAttribute("readOnly",!0):a.removeAttribute("readOnly")}},h.dialogClose=function(a){b.trigger("sc-frame-message",a)},h.receiveMessage=function(a,c){b.trigger("sc-frame-message",a,c)},h.getParameterByName=function(a){return a=a.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]"),regexS="[\\?&]"+a+"=([^&#]*)",regex=new RegExp(regexS),results=regex.exec(window.location.href),null==results?"":decodeURIComponent(results[1].replace(/\+/g," "))},function(a){a.Model.extend=a.Collection.extend=a.Router.extend=a.View.extend=function(a,b){var d=c(this,a,b);return d.extend=this.extend,d};var b=function(){},c=function(c,d,e){var f,g=c.prototype,h=/xyz/.test(function(){})?/\b_super\b/:/.*/;if(f=d&&d.hasOwnProperty("constructor")?d.constructor:function(){c.apply(this,arguments)},n.extend(f,c),b.prototype=c.prototype,f.prototype=new b,d){n.extend(f.prototype,d);var i=d.nestedlayout||f.prototype.nestedlayout,j=f.prototype.modelType===a.Model;j||d.render||i||(d.render=function(){}),j||d.afterRender||i||(d.afterRender=function(){}),j||d.beforeRender||i||(d.beforeRender=function(){});for(var k in d)"function"==typeof d[k]&&"function"==typeof g[k]&&h.test(d[k])&&(f.prototype[k]=function(a,b){return function(){var c=this._super;this._super=g[a];var d=b.apply(this,arguments);return this._super=c,d}}(k,d[k])),i||j||"render"!==k&&"beforeRender"!==k&&"afterRender"!==k||(f.prototype[k]=function(a,b){return function(){if(b.apply(this,arguments),this.hasBehavior){var c=[];"render"===a&&(c=this.behaviorsRender),"afterRender"===a&&(c=this.behaviorsAfterRender),"beforeRender"===a&&(c=this.behaviorsBeforeRender),n.each(c,function(a){a.apply(this,arguments)},this)}}}(k,d[k]))}return e&&n.extend(f,e),f.prototype.constructor=f,f.__super__=c.prototype,f}}(Backbone),c.Model=Backbone.Model.extend({ko:!0,modelType:Backbone.Model,set:function(){var a=arguments[2];arguments[2]||(arguments[2]={});var b=(n.clone(arguments[2].silent),arguments[2].force);if(Backbone.Model.prototype.set.apply(this,arguments),a&&a.computed&&(this.computed=this.computed||{},this.computed[arguments[0]]=a),n.isObject(arguments[0])||a&&a.local||this.updateViewModel(arguments[0],b),n.isObject(arguments[0])&&(!a||!a.local)){var c=arguments[0],d=n.keys(c);n.each(d,function(a){this.updateViewModel(a)},this)}},constructor:function(b){this.ko&&(this.viewModel={}),this.defaults&&b&&n.isObject(b)&&(this.defaults=n.extend(this.defaults,b)),this.ko&&this.defaults&&(this._removeComputed(),this._creatingViewModelFromDefaults()),this.useLocalStorage&&(this.localStorage=new a.Definitions.Data.LocalStorage(b.name)),Backbone.Model.apply(this,[b]),this.ko&&(this._setComputed(),this._preventDefaultFunction(),this._creatingViewModel())},_preventDefaultFunction:function(){var a=["_creatingViewModel","_creatingViewModelFromDefaults","_setComputed","_findAppropriateAndApplyBinding","_removeComputed","_super","_preventDefaultFunction","_validate","bind","change","changedAttributes","clear","clone","constructor","destroy","escape","fetch","get","has","hasChanged","initialize","isNew","isValid","observable","off","on","parse","previous","previousAttributes","save","set","toJSON","trigger","unbind","unset","url"],b=n.functions(this);this.applicableFunctionsFromModel=n.reject(b,function(b){return n.indexOf(a,b)>=0})},_creatingViewModelFromDefaults:function(){var a=this,b=n.keys(this.defaults);n.each(b,function(a){this._findAppropriateAndApplyBinding(a,this.defaults)},this);var c={};this.applicableFunctionsFromModel&&n.each(this.applicableFunctionsFromModel,function(b){c[b]=function(){a[b].apply(a,arguments)}}),n.extend(this.viewModel,c)},_removeComputed:function(){var a=n.keys(this.defaults),b=this.defaults,c=this,d=[];n.each(a,function(a){var c=b[a];if(n.isObject(c)&&c.computed){var e=n.clone(c),f={computed:!0,read:e.read};e.write&&(f=n.extend(f,{write:e.write})),e.owner&&(f=n.extend(f,{owner:e.owner})),d.push({key:a,value:e.value,computed:f}),delete b[a]}}),c.computeds=d},_setComputed:function(){n.each(this.computeds,function(a){var b=a.value||"",c=n.extend(a.computed,{local:!0});this.set(a.key,b,a.computed,c)},this)},updateViewModel:function(a,b){(this.viewModel&&!this.viewModel[a]||b)&&this._findAppropriateAndApplyBinding(a,this.attributes,b)},_findAppropriateAndApplyBinding:function(a,b,c){var d=this.viewModel||{};if(!d[a]||c){if(n.isArray(b[a]))if(b[a].length>0&&b[a][0]&&b[a][0].modelType===Backbone.Model){var e=[];n.each(b[a],function(a){e.push(a.viewModel)}),d[a]=o.observableArray(e),d[a].nested=!0}else d[a]=o.observableArray(b[a]);else b[a]&&b[a].constructor&&n.isObject(b[a].constructor.__super__)&&b[a].ko?(d[a]=b[a].viewModel,d[a].nested=!0):this.computed&&this.computed[a]||(d[a]=o.observable(b[a]));this._registerComputed(a),this._registerSubscribe(a)}},_registerSubscribe:function(a){var b=this,c=this.subscriptions||[],d=this.viewModel||{};d[a].nested||(d[a].isComputed||b.on("change:"+a,function(){if(n.isArray(b.get(a))&&b.get(a).length>0&&b.get(a)[0]&&b.get(a)[0].modelType&&b.get(a)[0].modelType===Backbone.Model){var c=[];n.each(b.get(a),function(a){c.push(a.viewModel)}),d[a](c)}else d[a](b.get(a))}),d[a].subscribe&&(c[a]=d[a].subscribe(function(c){b.set(a,c)})))},_registerComputed:function(a){var b=this,c=this.viewModel||{};if(b.computed&&b.computed[a]){this.computed[a].write&&!this.computed[a].owner&&(b.computed[a].owner=this.viewModel);var d=n.pick(b.computed[a],"write","owner","read");c[a]=d.write?o.computed(d):o.computed(d.read,this.viewModel),c[a].isComputed=!0}},_creatingViewModel:function(){var a=n.keys(this.attributes);n.each(a,function(a){this._findAppropriateAndApplyBinding(a,this.attributes)},this),n.each(a,this._registerComputed,this),n.each(a,this._registerSubscribe,this)}}),c.Model.extend=Backbone.Model.extend,d.View=function(b){b&&(this.app=b.app?b.app:"No parent for this app",delete b.app);var c=this;b&&b.behaviors&&n.each(b.behaviors.split(" "),function(b){c.addBehavior(a.Behaviors[b])}),Backbone.View.apply(this,[b]),this.model&&this.$el&&!this.model.viewModel.$el&&(this.model.viewModel.$el=this.$el),this.model&&this.app&&!this.model.viewModel.app&&(this.model.viewModel.app=this.app),this.setupFunctionWhichCouldBeDataBound(),this.sync()},n.extend(a.Definitions.Views.View.prototype,Backbone.View.prototype,{setupFunctionWhichCouldBeDataBound:function(){var a=["$","_configure","_ensureElement","setupFunctionWhichCouldBeDataBound","applyBindingsIfApplicable","bind","constructor","delegateEvents","initialize","make","off","on","remove","render","setElement","trigger","unbind","undelegateEvents","afterRender","beforeRender","sync"],b=n.functions(this);this.applicableFunctionsFromView=n.reject(b,function(b){return n.indexOf(a,b)>=0});var c=this;n.each(this.applicableFunctionsFromView,function(a){if(this.model&&this.model.viewModel[a])throw"Conflicted names between Model and View, please provide different names: "+a;this.model&&(this.model.viewModel[a]=function(){return c[a].apply(c,arguments)})},this)},sync:function(){this.model&&this.model.ko&&(j&&console.log("Applying Binding for the element which has the data-sc-id: "+this.$el.data("sc-id")+". The viewModel you are trying to apply is:",this.model.viewModel),o.applyBindings(this.model.viewModel?this.model.viewModel:this.model,this.$el.get(0)))},listen:{}}),d.View.extend=Backbone.View.extend,a.Definitions.App=Backbone.Model.extend({appId:void 0,modelType:"application",initialize:function(){this.Controls=[],this.localStorage=this.appId?new a.Definitions.Data.LocalStorage(this.appId):"you need to provide a appID in order to use localStorage"},run:function(a,c,d){var e=b.Factories.createApp(a,c,d,this);return"undefined"!=typeof this.initialized&&this.initialized(),e.trigger("app:loaded"),e},insertControl:function(a,b,c){var d=this;m.post("/api/rendering",a,function(a){d.insertMarkups(a,name,b,c)})},insertRendering:function(a,b,c){var d,e,f=this,g={database:"core",path:"/"},c=c;n.isFunction(b)?c=b:b&&(g=n.extend(g,b),d=b.selector?b.selector:void 0,e=b.$el?b.$el:void 0),g.name||(g.name=n.uniqueId("subapp_")),m.get(g.path+"?sc_itemid="+a+"&sc_database="+g.database,function(a){f.insertMarkups(a,g.name,{selector:d,$el:e},c)})},insertMarkups:function(a,c,d,e){var f,g={prepend:!1,selector:void 0,parent:void 0,$el:void 0},d=n.extend(g,d),h="<div id='"+c+"' data-sc-app style='display:none;'>"+a+"</div>";f=d.$el?d.$el:m(d.selector?d.selector:"body"),d.prepend?f.prepend(h):f.append(h),b.load(window,f.find("#"+c),function(a){a.ScopedEl.show(),e&&e(a)})},destroy:function(){var b=this;n.each(b.Controls,function(a){a.view.$el.data("sc-app",null),a.view.$el.removeClass("data-sc-registered")});for(var c in b)b[c]instanceof a.Definitions.App&&n.each(b[c].Controls,function(a){a.view.$el.data("sc-app",null),a.view.$el.removeClass("data-sc-registered")});n.each(b.Controls,function(a){o.cleanNode(a.view.$el.get(0)),delete a.model,delete a.view});for(var c in b)delete b[c];return void 0},closeDialog:function(a){window.top.returnValue=a,window.top.dialogClose(a)},sendMessage:function(a){window.top.receiveMessage(a,h.getParameterByName("sp"))}}),a.Definitions.App.extend=Backbone.View.extend,n.extend(a,Backbone.Events),n.extend(d.View.prototype,{addBehavior:function(a){if(this.hasBehavior=!0,this.behaviors=this.behaviors||[],this.behaviorsBeforeRender=this.behaviorsBeforeRender||[],this.behaviorsAfterRender=this.behaviorsAfterRender||[],this.behaviorsRender=this.behaviorsRender||[],!(a.initialize||a.afterRender||a.render||a.beforeRender))throw"behavior should have an initialize or an after Render method";a.events&&(this.events?n.extend(this.events,a.events):this.events=a.events),a.initialize&&this.behaviors.push(a.initialize),a.afterRender&&this.behaviorsAfterRender.push(a.afterRender),a.render&&this.behaviorsRender.push(a.render),a.beforeRender&&this.behaviorsBeforeRender.push(a.beforeRender);var b=n.omit(a,"initialize","events","afterRender","render","beforeRender");n.extend(this,b)}}),n.extend(b,{destroy:function(b){if(!b&&!b.destroy)throw"you need an app to be destroy";var c=b.name;b.destroy(),delete a[c]},noConflict:function(b){return h._sc===a&&(h._sc=l),b&&h.Sitecore===a&&(h.Sitecore=i),a}}),n.extend(b,{load:function(c,d,e){var f=[],g=!1;d||(d=m("html"),g=!0),m(d).find("[data-sc-require]").each(function(){var a=m(this);a.is("[data-sc-app]")||m.each(a.data("sc-require").split(","),function(a,b){n.indexOf(f,b)<0&&f.push(b)})});var h=[],i=c.__sc_define;c.__sc_define=function(a,b,c){"string"==typeof a&&h.push(a),i&&i(a,b,c)},m(d).find("script[type='text/x-sitecore-pagescript']").each(function(){c.__sc_define(m(this).attr("src"))}),require(f,function(){var f=m(d).find("script[type='text/x-sitecore-pagecode']"),j=m(d),k=f.attr("src"),l=f.data("sc-behaviors"),n=null;j.attr("data-sc-behaviors",l);var o=function(){if(0==h.length){c.__sc_define=i;var a=new n;e?e(a.run(d.attr("id"),d.attr("id"))):a.run(),g&&b.Helpers.overlay.loadOverlays(a)}else{var f=h;h=[],b.debug("Requiring files: ",f),require(f,o)}},p=function(){if(0===h.length)if(k)b.debug("Requiring page code: ",[k]),require([k],function(a){n=a,o()});else{c.__sc_define=i;var f;f=g?a.Factories.createApp():a.Factories.createApp(d.attr("id"),d.attr("id")),g&&(b.Helpers.overlay.loadOverlays(f),"undefined"!=typeof f.initialized&&f.initialized(),f.trigger("app:loaded")),e&&e(f)}else{var j=h;h=[],b.debug("Requiring files: ",j),require(j,p)}};p()})}}),n.extend(f,{resolve:function(a){if(!n.isString(a))throw"provied a correct Path to resolve";for(var b=a.split("."),c=h||window,d=0;d<b.length;d++)if(c=c[b[d]],null==c)throw"Reference '"+a+"' not found";return c},executeCommand:function(a,b){if(!a||!n.isString(a))throw"cannot execute command without commandName";var c=f.getCommand(a);c.canExecute(b)&&c.execute(b)},getCommand:function(a){return f.resolve(a)}});var q=function(){var a=this._scAttrs;n.each(a,function(a){if(a.value&&-1!==a.value.indexOf("$el.")){var b=a.value.substring("$el.".length);if(-1!==b.indexOf(":")){var c=b.split(":");if(2===c.length){var d=this.$el[c[0]](c[1]);"undefined"!=typeof d?this.model.set(a.name,d):a.defaultValue&&this.model.set(a.name,a.defaultValue)}}else this.model.set(a.name,this.$el[b]())}},this),n.each(a,function(a){a.on&&this.model.on("change:"+a.name,this[a.on],this)},this)},r=function(){this._scAttrs&&n.each(this._scAttrs,function(a){var b=n.keys(a),c=this.localStorage.get(a.name);c?this.set(a.name,c):-1===b.indexOf("defaultValue")&&a.value&&-1!==a.value.indexOf("$el.")?this.set(a.name,null):-1===b.indexOf("defaultValue")&&-1===a.value.indexOf("$el.")?this.set(a.name,a.value):b.indexOf("defaultValue")>-1?this.set(a.name,a.defaultValue):this.set(a.name,void 0)},this)},s=function(){this._scAttrs&&n.each(this._scAttrs,function(a){var b=n.keys(a);-1===n.indexOf(b,"defaultValue")&&a.value&&-1!==a.value.indexOf("$el.")?this.set(a.name,null):-1===n.indexOf(b,"defaultValue")&&-1===a.value.indexOf("$el.")?this.set(a.name,a.value):n.indexOf(b,"defaultValue")>-1?this.set(a.name,a.defaultValue):this.set(a.name,void 0)},this)},t=function(a){var b=a;return function(){b.prototype.set.apply(this,arguments);var a=arguments[2];if(n.isObject(arguments[0])&&(!a||!a.local)){var c=arguments[0],d=n.keys(c);n.each(d,function(a){this.localStorage.set(a,c[a])},this)}n.isObject(arguments[0])||a&&a.computed||this.localStorage.set(arguments[0],arguments[1])}};n.extend(g,{createBehavior:function(a,c){if(b.Behaviors=b.Behaviors||{},b.Behaviors[a])throw"There is already a behavior with the same name";return b.Behaviors[a]=c,b.Behaviors[a]},createBaseComponent:function(a){if(!a.name||!a.selector)throw"provide a name and/or a selector";var e,f,g=a.name,h=a.selector,i=a.attributes,j=a.initialize,k=a.base,l=["attributes","name","selector","base","plugin","initialize","listenTo","_scInitFromObject","extendModel","_scInit","_scInitDefaultValue"],m=n.omit(a,l),o=c.Model,p=d.View,u=a.localStorage,v=a.extendModel||{},w=a.collection;k&&(e=n.find(b.Components,function(a){return a.type===k})),e&&(o=e.model,p=e.view);var x;u?(v=n.extend(v,{initialize:function(){this._super(),this._scInitDefaultValueFromLocalStorage()},set:t(o)},{useLocalStorage:!0}),x=o.extend(v)):(v=n.extend(v,{initialize:function(){this._super(),this._scInitDefaultValue()}}),x=o.extend(v));var y=p.extend({initialize:function(){b.debug("initialize - "+g),this._super(),this.model.componentName==g&&(this._scInitFromObject?(this._scInit(),this._scInitFromObject()):this._scInit())}});if(x=x.extend({_scAttrs:i,_scInitDefaultValue:s,_scInitDefaultValueFromLocalStorage:r}),f=n.extend(m,{_scAttrs:i,_scInit:q,_scInitFromObject:j}),a.listenTo){var z={},A=p.prototype.listen,B=a.listenTo,C=n.keys(B);n.each(C,function(a){z[a+":$this"]=B[a]}),z=n.extend(A,z),y=n.extend(y,z)}var D;return w&&(D=Backbone.Collection.extend({model:w})),y=y.extend(f),b.Factories.createComponent(g,x,y,h,D)},createComponent:function(a,c,d,e,f){var g;if(!(n.isString(a)&&c&&d&&n.isString(e)))throw"please provide a correct: type (str), model, view and el (html class or id)";return b.Components=b.Components||[],b.Definitions.Models[a]=c,b.Definitions.Views[a]=d,f&&(b.Definitions.Collections[a]=f),n.each(b.Components,function(a){if(a.el===e)throw"you are trying to add compoment with the same el (.class or #id)"}),g={type:a,model:c,view:d,el:e,collection:f},b.Components.push(g),g},createApp:function(a,c,d,e){var f={};return n.isObject(a)?(f=a,b.Pipelines.Application.execute(f),f.current):(f.name=a,f.id=c,f.mainApp=d,f.app=e,f.aborted=!1,b.Pipelines.Application.execute(f),f.current)},createPageCode:function(a,c){var d;return d=b.Definitions.App.extend(c),d=d.extend({appId:a})},createBindingConverter:function(a){if(!a.name||!a.convert)throw"invalid binding converter";if(b.BindingConverters&&b.BindingConverters[a.name])throw"already a converter with the same name";b.BindingConverters=b.BindingConverters||{},b.BindingConverters[a.name]=a.convert}}),c.ComponentModel=c.Model.extend({initialize:function(){}}),c.ControlModel=c.ComponentModel.extend({initialize:function(){this._super(),this.set("isVisible",!0)},toggle:function(){this.set("isVisible",!this.get("isVisible"))}}),c.BlockModel=c.ControlModel.extend({initialize:function(){this._super(),this.set("width",0),this.set("height",0)}}),c.InputModel=c.ControlModel.extend({initialize:function(){this._super(),this.set("isEnabled",!0)}}),c.ButtonBaseModel=c.ControlModel.extend({initialize:function(){this._super(),this.set("isEnabled",!0)}});var u=a.Definitions.Views;u.ComponentView=u.View.extend({listen:n.extend({},a.Definitions.Views.View.prototype.listen,{"set:$this":"set"}),initialize:function(){if(!this.model)throw"Model required in order to instantiate ComponentView";if(!this.el)throw"Element required in order to instantiate ComponentView";var a=this.$el.data("init");if(a){var b=n.keys(a);n.each(b,function(b){this.set(b,a[b])},this.model)}},set:function(a){a&&n.each(n.keys(a),function(b){this.model.set(b,a[b])},this)}}),u.ControlView=u.ComponentView.extend({listen:n.extend({},a.Definitions.Views.ComponentView.prototype.listen,{"toggle:$this":"toggle","focus:$this":"focus","show:$this":"show","hide:$this":"hide"}),initialize:function(){this._super(),this.model.set("isVisible","none"!==this.$el.css("display"))},focus:function(){this.$el.focus()},hide:function(){this.model.set("isVisible",!1)},show:function(){this.model.set("isVisible",!0)},toggle:function(){this.model.toggle()}}),u.BlockView=u.ControlView.extend({initialize:function(){this._super(),this.model.set("width",this.$el.width()),this.model.set("height",this.$el.height())}}),u.InputView=u.ControlView.extend({listen:n.extend({},a.Definitions.Views.ComponentView.prototype.listen,{"enable:$this":"enable","disable:$this":"disable"}),initialize:function(){this._super(),this.model.set("isEnabled","disabled"!=m(this.el).attr("disabled"))},disable:function(){this.model.set("isEnabled",!1)},enable:function(){this.model.set("isEnabled",!0)}}),u.ButtonBaseView=u.ControlView.extend({listen:n.extend({},a.Definitions.Views.ControlView.prototype.listen,{"enable:$this":"enable","disable:$this":"disable"}),initialize:function(){this._super(),this.model.set("isEnabled","disabled"!=m(this.el).attr("disabled"))},click:function(){if(this.model.get("isEnabled")){var b=this.$el.attr("data-sc-click");b&&a.Helpers.invocation.execute(b,{control:this,app:this.app}),this.model._events&&this.model._events.click&&n.each(this.model._events.click,function(a){a.callback&&a.context&&a.callback.call(a.context)})}},disable:function(){this.model.set("isEnabled",!1)},enable:function(){this.model.set("isEnabled",!0)}}),b.Definitions.Collections=b.Definitions.Collections||[],g.createComponent("ComponentBase",c.ComponentModel,d.ComponentView,".sc-componentbase"),g.createComponent("ControlBase",c.ControlModel,d.ControlView,".sc-controlbase"),g.createComponent("BlockBase",c.BlockModel,d.BlockView,".sc-blockbase"),g.createComponent("ButtonBase",c.ButtonBaseModel,d.ButtonBaseView,".sc-buttonBase"),g.createComponent("InputBase",c.InputModel,d.InputView,".sc-inputbase"),g.createComponent("PageBase",c.Model,d.View,"body"),g.createBindingConverter({name:"Has",convert:function(a){return a&&a[0]?n.isArray(a[0])?0===a[0].length?!1:!0:!0:!1}}),g.createBindingConverter({name:"Not",convert:function(a){return!(a&&a[0])}});var v={combine:function(){if(0===arguments.length)return"";var a=n.reduce(arguments,function(a,b){return b&&n.isString(b)?a+"/"+n.compact(b.split("/")).join("/"):a});return a?0===a.indexOf("/")?a:"/"+a:""},isParameterNameAlreadyInUrl:function(a,b){return a.indexOf("?"+b+"=")>=0||a.indexOf("&"+b+"=")>=0},addQueryParameters:function(a,b){var c,d=n.pairs(b),e="([\\?&])({{param}}=[^&]+)",f=a;return n.each(d,function(a){v.isParameterNameAlreadyInUrl(f,a[0])?(c=new RegExp(e.replace("{{param}}",encodeURIComponent(a[0])),"i"),f=f.replace(c,"$1"+a[0]+"="+a[1])):(f=f+=~f.indexOf("?")?"&":"?",f+=encodeURIComponent(a[0])+"="+encodeURIComponent(a[1]))}),f},getQueryParameters:function(a){var b,c={};return n.isString(a)?(b=a.split("?"),(b=b.length>1?b[1].split("&"):b[0].split("&"))?(n.each(b,function(a){var b=a.split("=");2===b.length&&(c[b[0]]=decodeURIComponent(b[1].replace(/\+/g," ")))}),c):void 0):c}},w={parseISO:function(a){var b,c,d,e,f,g;return n.isString(a)?(b=parseInt(a.substr(0,4),10),c=parseInt(a.substr(4,2),10)-1,d=parseInt(a.substr(6,2),10),8!==a.indexOf("T")?new Date(Date.UTC(b,c,d,0,0,0,0)):(e=parseInt(a.substr(9,2),10),f=parseInt(a.substr(11,2),10),g=parseInt(a.substr(13,2),10),new Date(Date.UTC(b,c,d,e,f,g)))):null},toISO:function(a){var b;return n.isDate(a)?(b="",b+=a.getUTCFullYear(),b+=this.ensureTwoDigits(a.getUTCMonth()+1),b+=this.ensureTwoDigits(a.getUTCDate()),b+="T",b+=this.ensureTwoDigits(a.getUTCHours()),b+=this.ensureTwoDigits(a.getUTCMinutes()),b+=this.ensureTwoDigits(a.getUTCSeconds())):b},isISO:function(a){var b;return!n.isString(a)||8!=a.length&&15!=a.length?!1:(b=this.parseISO(a),"[object Date]"===Object.prototype.toString.call(b)?isNaN(b.getYear())?!1:!0:!1)},ensureTwoDigits:function(a){return 10>a?"0"+a.toString():a.toString()}},x={isId:function(a){return n.isString(a)?/^\{?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\}?$/i.test(a):!1},toId:function(a){return a&&32===a.length?"{"+a.substr(0,8)+"-"+a.substr(8,4)+"-"+a.substr(12,4)+"-"+a.substr(16,4)+"-"+a.substr(20,12)+"}":a},toShortId:function(a){return n.isString(a)&&x.isId(a)?a.replace(/-|\{|\}/g,""):void 0}},y={endsWith:function(a,b){return b&&a?a.lastIndexOf(b)===a.length-b.length:!1},equals:function(a,b,c){return n.isString(a)&&n.isString(b)?c?n.isBoolean(c)?a===b:void 0:a.toLowerCase()===b.toLowerCase():void 0},format:function(a){return a?(n.each(arguments,function(b,c){a=a.replace(new RegExp("\\{"+(c-1)+"\\}","gi"),b)}),a):a},formatByTemplate:function(a,b){if("function"!=typeof b)return a;if("string"!=typeof a)return"";var c=/{{(.*?)}}/gi,d=a.match(c);return n.each(d,function(c){var d=c.replace("{{","").replace("}}",""),e=b(d);"undefined"!=typeof e&&null!=e&&(a=a.replace(c,e))}),a}},z={getOwnProperties:function(a){var b,c=[];for(b in a)a.hasOwnProperty(b)&&c.push(b);return c}},A={execute:function(a,c){if(a){var d=a.indexOf(":");if(0>=d)throw"Invocation is malformed (missing 'handler:')";c=c||{};var e=a.substr(0,d),f=a.substr(d+1),g=n.extend({},{handler:e,target:f},c);b.Pipelines.Invoke.execute(g)}}},B={loadOverlays:function(a){var c=m("script[type='text/x-sitecore-overlays']");if(0!=c.length){var d=c.data("sc-overlays").split("|"),e=c.data("sc-parameters");for(var f in d){var g=d[f]+"?speak="+b.VERSION+"&"+e;m.ajax({url:g,dataType:"json"}).done(function(c){b.Helpers.overlay.processOverlays(a,c,d[f])}).fail(function(a){console.log("Overlay url failed: "+g,a)})}}},processOverlays:function(a,b,c){var d=b.overlays;for(var e in d)this.processOverlay(a,d[e],c)},processOverlay:function(a,b,c){var d,e=b.command,f=b.selector,g=b.placement,h=b.html;if("component:"==f.substr(0,10)){var i=f.substr(10),j=n.find(a.Controls,function(a){return a.name==i});if(null==j)return void console.log("Overlay selector not found: "+f);d=j.view.$el}else d=m(f);if(null==d||0==d.length)return void console.log("Overlay selector not found: "+f);switch(e){case"insert":this.insert(a,d,g,h,c);break;case"remove":this.remove(a,d);break;case"replace":this.replace(a,d,h,c);break;default:console.log("Unknow overlay command: "+e)}},insert:function(a,c,d,e,f){e="<div data-sc-app id='"+n.uniqueId("overlay-")+"' >"+e,e+="</div>";var g=m(m.parseHTML(e));switch(d){case"before":g.insertBefore(c);break;case"after":g.insertAfter(c);break;case"prepend":c.prepend(e);break;case"append":c.append(e);break;default:console.log("Unknow overlay insert placement: "+d)}b.load(window,g,function(a){b.trigger("overlay-loaded",{app:a,url:f})})},remove:function(a,b){b.remove()},replace:function(a,c,d,e){d=m.parseHTML(d),$html=m(d),c.replaceWith($html),b.load(window,$html,function(a){b.trigger("overlay-loaded",{app:a,url:e})})}},C={init:function(){m(window).resize(function(){b.trigger("window:resize",m(window).width(),m(window).height())})},loaded:function(){b.trigger("window:loaded")}};n.extend(b,{Helpers:{url:v,date:w,id:x,string:y,object:z,invocation:A,overlay:B,window:C}}),b.Helpers.window.init();var D=b.Helpers,E={_current:0,converters:[],aborted:!1},F=function(){return E.converters.length},G=function(a){if(a=a||{},!(n.isFunction(a.canConvert)&&n.isFunction(a.convert)&&n.isFunction(a.reConvert)&&n.isString(a.name)))throw"invalid converter";E.converters.push(a)},H=function(a){E.converters=n.reject(E.converters,function(b){return b.name===a})},I=function(a){return n.find(E.converters,function(b){return b.name===a})},J=function(){return E.converters},K={name:"date",canConvert:function(a){return D.string.equals(a.type,this.name)||D.string.equals(a.type,"datetime")},convert:function(a){var b="",c=a.value;if(c)try{return D.date.parseISO(c).toLocaleDateString()}catch(d){return b}return b},reConvert:function(a){if(!a)return"";try{var b=new Date(a);return D.toISO(b)}catch(c){return a||""}},toStringWithFormat:function(a,b){if(D.date.isISO(a))try{var c=D.date.parseISO(a),d={mmss:{expression:"(\\W|^)mm(\\W+s{1,2}\\W|\\W+s{1,2}$)",value:D.date.ensureTwoDigits(c.getUTCMinutes())},mss:{expression:"(\\W|^)m(\\W+s{1,2}\\W|\\W+s{1,2}$)",value:c.getUTCMinutes().toString()},hmm:{expression:"(\\Wh{1,2}\\W+|^h{1,2}\\W+)mm(\\W|$)",value:D.date.ensureTwoDigits(c.getUTCMinutes())},hm:{expression:"(\\Wh{1,2}\\W+|^h{1,2}\\W+)m(\\W|$)",value:c.getUTCMinutes().toString()},ms:{expression:"(\\Wss\\W|^ss\\W)00(\\W|$)",value:D.date.ensureTwoDigits(c.getUTCMilliseconds())},ampm:{expression:"(\\W|^)AM/PM(\\W|$)",value:c.getUTCHours()>=12?"PM":"AM"},ap:{expression:"(\\W|^)A/P(\\W|$)",value:c.getUTCHours()>=12?"P":"A"},yyyy:{expression:"(\\W|^)yyyy(\\W|$)",value:c.getUTCFullYear().toString()},yy:{expression:"(\\W|^)yy(\\W|$)",value:D.date.ensureTwoDigits(c.getUTCFullYear()%100)},mm:{expression:"(\\W|^)mm(\\W|$)",value:D.date.ensureTwoDigits(c.getUTCMonth()+1)},m:{expression:"(\\W|^)m(\\W|$)",value:(c.getUTCMonth()+1).toString()},dd:{expression:"(\\W|^)dd(\\W|$)",value:D.date.ensureTwoDigits(c.getUTCDate())},d:{expression:"(\\W|^)d(\\W|$)",value:c.getUTCDate().toString()},hh:{expression:"(\\W|^)hh(\\W|$)",value:D.date.ensureTwoDigits(c.getUTCHours())},h:{expression:"(\\W|^)h(\\W|$)",value:c.getUTCHours()>12?(c.getUTCHours()-12).toString():(0==c.getUTCHours()?12:c.getUTCHours()).toString()},ss:{expression:"(\\W|^)ss(\\W|$)",value:D.date.ensureTwoDigits(c.getUTCSeconds())},s:{expression:"(\\W|^)s(\\W|$)",value:c.getUTCSeconds().toString()}};for(var e in d){var f=d[e]?d[e].expression:"",g="$1"+d[e].value+"$2";if(""!=f){var h=new RegExp(f,"g");b=b.replace(h,g)}}return b}catch(i){return a}return a}},L={name:"Icon",baseUrl:D.url.combine(b.SiteInfo.virtualFolder,"~/icon/"),canConvert:function(a){return D.string.equals(a.type,this.name)},convert:function(a){if(this.canConvert(a)){var b=a.value||"/sitecore/images/blank.gif";return 0!==b.indexOf("/sitecore/")&&(b=D.url.combine(this.baseUrl,b)),D.string.format('<img src="{0}" alt="" />',b)}},reConvert:function(){}},M={length:F,add:G,remove:H,get:I,getAll:J};M.add(K),M.add(L),n.extend(b,{Converters:M});var N=a.Pipelines=function(){var b=[];return{add:function(a){if(!a||!a.name||!n.isObject(a))throw new"invalid pipeline";b.push(a),this[a.name]=a},remove:function(c){b=n.reject(b,function(a){return a.name===c}),delete a.Pipelines[c]},length:function(){return b.length}}}();N.Pipeline=function(a){var b={name:a,processors:[],add:function(a){if(!(a&&a.priority&&a.execute&&n.isNumber(a.priority)&&n.isFunction(a.execute)))throw"not valid step";this.processors.push(a)},length:function(){return this.processors.length},remove:function(a){this.processors=n.reject(this.processors,function(b){return b===a})},execute:function(a){var b=n.sortBy(this.processors,function(a){return a.priority});n.each(b,function(b){return a.aborted?!1:void b.execute(a)})}};return b};var O=function(a,b){var c=a.split("."),d=c[0];if("this"===d)new Function(a).call(b.control.model);else if(b.app&&"app"===d){var e=a.replace("app","this");new Function(e).call(b.app)}else new Function(a)()},P={priority:1e3,execute:function(a){"javascript"===a.handler&&(a.target.indexOf(";")>0?n.each(a.target.split(";"),function(b){O(b,a)}):O(a.target,a))}},Q={priority:2e3,execute:function(b){"command"===b.handler&&a.executeCommand(b.target)}},R={priority:3e3,execute:function(b){if("serverclick"===b.handler){var c={url:b.target,type:"POST",dataType:"json"},d=function(c){a.Pipelines.ServerInvoke.execute({data:c,model:b.model})};m.ajax(c).done(d)}}},S={priority:4e3,execute:function(a){if("trigger"===a.handler){var b=a.app;if(!b)throw"An application is a required when triggering events";var c=a.target,d={},e=c.indexOf("(");if(e>=0){if(-1==c.indexOf(")",c.length-1))throw"Missing ')'";var f=c.substr(e+1,c.length-e-2);d=m.parseJSON(f),c=c.substr(0,e)}d.sender=a.control,b.trigger(c,d)}}},T={priority:1e3,execute:function(a){var b=a.data.ViewModel;null!=b&&o.mapping.fromJS(b,{},a.model)}},U=new a.Pipelines.Pipeline("Invoke");U.add(P),U.add(Q),U.add(R),U.add(S),a.Pipelines.add(U);var V=new a.Pipelines.Pipeline("ServerInvoke");V.add(T),a.Pipelines.add(V);var W=new N.Pipeline("Application"),X=function(){return{}},Y=function(a,b,c,d,e,f,g,h,i){var j,k,l,o,p,q=m(b);if(i){var r=q.find("[data-sc-app]");r.length>0&&m.each(r,function(){m(this).addClass("data-sc-waiting")})}if(!q.data("sc-app")){j=n.uniqueId("sc_"+a.type+"_"),k=q.attr("data-sc-id"),g.appId&&(k=g.appId+":"+k);var s=n.filter(q.prop("class").split(" "),function(a){return-1===a.indexOf("sc_")});if(q.prop("class",s.join(" ")),q.addClass(j),d&&m("[data-sc-exclude] ."+j).length)return{};if(e&&q.closest("[data-sc-app]").attr("id")&&"#"+q.closest("[data-sc-app]").attr("id")!=f)return{};l=new a.model({type:j,name:k}),l.componentName=a.type,q.data("sc-app",c),q.addClass("data-sc-registered"),a.collection&&(o=new a.collection);var t=q.data("sc-behaviors");if(p=new a.view({el:"."+j,model:l,collection:o,app:g,behaviors:t}),n.each(p.$el.find("[data-bind]"),function(a){var b=m(a);0==b.closest(".data-sc-waiting").length&&b.addClass("data-sc-registered")},this),p.$el.find("*").contents().each(function(){try{this.registered=8===this.nodeType?!0:!1}catch(a){}}),g[k]=l,o&&n.extend(g[k],X(o,a.collection.prototype.defaults)),h.Controls.push({name:k,model:l,view:p,collection:o}),i){var u=q.find(".data-sc-waiting");
u.each(function(){m(this).removeClass("data-sc-waiting")})}}return g},Z=function(a,b){return a||(b="body",a="app"),b||(b=a),"body"!==b&&b.indexOf("#")<0&&(b="#"+b),{name:a,el:b,$el:m(b)}},$=function(a,b){0===a.find("[data-sc-hasnested]").length?b(a):(n.each(a.find("[data-sc-hasnested]"),function(a){$(m(a),b)}),b(a))},_={priority:1e3,execute:function(c){c=c||{};var d=c.name,e=c.id,f=c.mainApp,g=c.app,h=Z(d,e),i=m(h.$el).find("[data-sc-exclude]"),k=i.length||!1,l=m(h.$el).find("[data-sc-app]").length||!1,o=[];if(c.Controls=[],g=g||new a.Definitions.App,f||(f=a),f[h.name])throw"already an app with this name";g.ScopedEl=h.$el,g.name=h.name,b.Components&&b.Components.length>0&&n.each(b.Components,function(a){m(h.$el).find(a.el+":not(.data-sc-registered)").each(function(){m(this).data("sc-hasnested")?o.push(a):Y(a,this,h.name,k,l,h.$el.selector,g,c)})}),o.length>0&&n.each(o,function(a){m(h.$el).find(a.el+":not(.data-sc-registered)").each(function(){var a=m(this);$(a,function(a){var b=n.find(o,function(b){return a.hasClass(b.el.substring(1))});Y(b,a.get(0),h.name,k,l,h.$el.selector,g,c,!0)})})}),n.each(c.Controls,function(a){if(a.view.listen){var b=n.keys(a.view.listen);n.each(b,function(b){var c=b;if(c.indexOf(":$this")>=0){var d=a.view.$el.attr("data-sc-id");if(!d)return;c=c.replace("$this",d)}g.on(c,a.view[a.view.listen[b]],a.view)})}}),f===a?f[h.name]=j?g:"application":(f[h.name]=g,f.nested=f.nested||[],f.nested.push(g)),g.Controls=c.Controls,h.$el.find("[data-sc-app]").each(function(){var a=m(this),c=a.attr("id"),d=a.attr("data-sc-require");d?require(d.split(","),function(a){var b=new a;b.run(c,c,g)}):b.Factories.createApp({name:c,id:c,mainApp:g,aborted:!1})}),c.current=g}},ab=function(a){var c=b.BindingConverters[a];return c?c:void 0},bb=function(a){if(a.converter){var b=[];return n.each(a.from,function(a){b.push(a.model.get(a.attribute))}),a.converter(b)}var c=a.from[0].model,d=a.from[0].attribute;return c.get(d)},cb=function(a){n.each(a.from,function(b){b.model.on("change:"+b.attribute,function(){a.model.set(a.to,bb(a))})}),a.model.set(a.to,bb(a))},db=function(a,b){var c=n.keys(a.attributes),d=n.find(c,function(a){return a===b});return d?b:b.charAt(0).toLowerCase()+b.slice(1)},eb=function(a,b){var c=n.keys(a),d=n.find(c,function(a){return a===b});return d?a[b]:a[b.charAt(0).toUpperCase()+b.slice(1)]},fb=function(a,b,c){var d=c,e=a.attr("data-sc-bindings"),f=[],g=b[d];if(0!=e.indexOf("{")){var h=[];n.each(e.split(","),function(a){var b=[];n.each(a.split(":"),function(a){b.push('"'+a+'"')}),h.push(b.join(":"))}),e="{"+h.join(",")+"}"}try{var i=JSON.parse(e);n.each(n.keys(i),function(a){var c,d,e={from:[],to:a,converter:void 0,model:g},h=i[a];e.to=db(g,a),n.isObject(h)?(e.converter=ab(h.converter),n.each(h.parameters,function(a){c=eb(b,a.split(".")[0]),d=db(c,a.split(".")[1]),e.from.push({model:c,attribute:d})})):(c=b[h.split(".")[0]],d=db(c,h.split(".")[1]),e.from.push({model:c,attribute:d})),f.push(e)}),n.each(f,cb)}catch(j){throw"Failed to data-bind: "+c+"\n"+j}},gb={priority:1500,execute:function(a){0!==a.current.Controls.length&&n.each(a.current.Controls,function(b){b.view.$el.attr("data-sc-bindings")&&fb(b.view.$el,a.current,b.view.$el.attr("data-sc-id"))})}},hb={priority:2e3,execute:function(a){n.each(a.Controls,function(a){a.view.beforeRender&&a.view.beforeRender()})}},ib={priority:3e3,execute:function(a){n.each(a.Controls,function(a){a.view.render&&a.view.render()})}},jb={priority:4e3,execute:function(a){n.each(a.Controls,function(a){a.view.afterRender&&a.view.afterRender()})}};W.add(_),W.add(gb),W.add(hb),W.add(ib),W.add(jb),a.Pipelines.add(W),n.extend(b.Web,{itemWebApi:{takeValidScope:function(a){switch(a){case"self":return"s";case"children":return"c";case"parent":return"p";default:throw"Unsupported scope. It must be either 'self', 'children' or 'parent'"}},addScope:function(a,c){if(c&&n.isArray(c)){var d=n.compact(n.map(c,b.Web.itemWebApi.takeValidScope)).join("|");a=b.Helpers.url.addQueryParameters(a,{scope:d})}return a},addDatabase:function(a,c){return c&&n.isString(c)&&(a=b.Helpers.url.addQueryParameters(a,{sc_database:c})),a},addContentDatabase:function(a,c){return c&&n.isString(c)&&(a=b.Helpers.url.addQueryParameters(a,{sc_content:c})),a},addItemSelectorUrlPortion:function(c,d,e){return d&&n.isString(d)&&(e&&e.facetsRootItemId&&(c=b.Helpers.url.addQueryParameters(c,{facetsRootItemId:e.facetsRootItemId})),0===d.indexOf("search:")?(c=b.Helpers.url.addQueryParameters(c,{search:d.substr("search:".length)}),e&&e.root&&a.Helpers.id.isId(e.root)&&(c=b.Helpers.url.addQueryParameters(c,{root:e.root})),e&&e.searchConfig&&(c=b.Helpers.url.addQueryParameters(c,{searchConfig:e.searchConfig}))):c=0===d.indexOf("query:")?b.Helpers.url.addQueryParameters(c,{query:d.substr("query:".length)}):b.Helpers.id.isId(d)?b.Helpers.url.addQueryParameters(c,{sc_itemid:d}):b.Helpers.url.combine(c,d)),c},addLanguage:function(a,c){return c&&(a=b.Helpers.url.addQueryParameters(a,{language:c})),a},addItemVersion:function(a,c){return c&&(a=b.Helpers.url.addQueryParameters(a,{sc_itemversion:c})),a},getUrl:function(a,c){c=c||{};var d="/-/item/v1",e="";c.webApi&&(d=c.webApi),c.virtualFolder&&(e=c.virtualFolder);var f=b.Helpers.url.combine(d,e);return f=this.addItemSelectorUrlPortion(f,a,c),c.scope&&(f=this.addScope(f,c.scope)),c.database&&""!=a&&0===a.indexOf("search:")?f=this.addContentDatabase(f,c.database):c.database&&(f=this.addDatabase(f,c.database)),c.language&&(f=this.addLanguage(f,c.language)),c.version&&(f=this.addItemVersion(f,c.version)),c.payLoad&&(f=b.Helpers.url.addQueryParameters(f,{payload:"full"})),c.formatting&&(f=b.Helpers.url.addQueryParameters(f,{format:c.formatting})),c.sorting&&(f=b.Helpers.url.addQueryParameters(f,{sorting:c.sorting})),c.fields&&(f=b.Helpers.url.addQueryParameters(f,{fields:c.fields.join("|")})),c.pageSize&&c.pageSize>0&&(f=b.Helpers.url.addQueryParameters(f,{pageIndex:c.pageIndex,pageSize:c.pageSize})),f}}}),function(b){var c,d=b.Backbone,e=b._,f=b.$,g=d.View.prototype._configure,h=(d.View.prototype.render,Array.prototype.push),i=Array.prototype.concat,j=Array.prototype.splice,k=a.Definitions.Views.View.extend({constructor:function(a){a=a||{},k.setupView(this,a),d.View.call(this,a)},nestedlayout:!0,insertView:function(a,b){return b?this.setView(a,b,!0):this.setView(a,!0)},insertViews:function(a){return e.isArray(a)?this.setViews({"":a}):(e.each(a,function(b,c){a[c]=e.isArray(b)?b:[b]}),this.setViews(a))},getView:function(a){return this.getViews(a).first().value()},getViews:function(a){var b=e.chain(this.views).map(function(a){return e.isArray(a)?a:[a]},this).flatten().value();return"string"==typeof a?e.chain([this.views[a]]).flatten():e.chain("function"==typeof a?e.filter(b,a):b)},setView:function(a,b,c){var d,f,g,h=this;if("string"!=typeof a&&(c=b,b=a,a=""),this.views=this.views||{},d=b.__manager__,f=this.views[a],!d)throw new Error("Please set `View#manage` property with selector '"+a+"' to `true`.");return g=b._options(),d.parent=h,d.selector=a,c?(this.views[a]=i.call([],f||[],b),d.append=!0,b):(d.hasRendered&&g.partial(h.el,d.selector,b.el,d.append),f&&e.each(i.call([],f),function(a){a.remove()}),this.views[a]=b)},setViews:function(a){return e.each(a,function(a,b){return e.isArray(a)?e.each(a,function(a){this.insertView(b,a)},this):void this.setView(b,a)},this),this},render:function(){function a(){function a(){var a=d.afterRender;a&&a.call(c,c),c.trigger("afterRender",c)}var b,e;return g&&(d.contains(g.el,c.el)||d.partial(g.el,f.selector,c.el,f.append)),c.delegateEvents(),f.hasRendered=!0,j.resolveWith(c,[c]),(b=f.queue.shift())?b():delete f.queue,i&&i.queue?(e=function(){g.off("afterRender",e,this),a()},g.on("afterRender",e,c)):void a()}function b(){{var b=c._options(),d=c.__manager__,f=d.parent;f&&f.__manager__}c._render(k._viewRender,b).done(function(){if(!e.keys(c.views).length)return a();var d=e.map(c.views,function(a){var c=e.isArray(a);return c&&a.length?a[0].render().pipe(function(){return b.when(e.map(a.slice(1),function(a){return a.render()}))}):c?a:a.render()});b.when(d).done(function(){a()})})}var c=this,d=c._options(),f=c.__manager__,g=f.parent,i=g&&g.__manager__,j=d.deferred();return f.queue?h.call(f.queue,function(){b()}):(f.queue=[],b(c,j)),j.view=c,j},remove:function(){return k._removeView(this,!0),this._remove.apply(this,arguments)},_options:function(){return k.augment({},this,k.prototype.options,this.options)}},{_cache:{},_makeAsync:function(a,b){var c=a.deferred();return c.async=function(){return c._isAsync=!0,b},c},_viewRender:function(a,b){function c(c){c&&b.html(a.$el,c),h.resolveWith(a,[a])}function d(a,d){var e,g=k._makeAsync(b,function(a){c(a)});k.cache(f,d),d&&(e=b.render.call(g,d,a)),g._isAsync||c(e)}{var f,g,h;a.__manager__}return{render:function(){var c=a.serialize||b.serialize,i=a.data||b.data,j=c||i,l=a.template||b.template,m="";return a.parent&&a.parent.$el&&(m=a.parent.$el.data("sc-id")),e.isFunction(j)&&(j=j.call(a)),h=k._makeAsync(b,function(a){d(j,a)}),"string"==typeof l&&(f=b.prefix+l),(g=k.cache(f+m))?(d(j,g,f),h):("string"==typeof l?g=b.fetch.call(h,b.prefix+l,m):null!=l&&(g=b.fetch.call(h,l)),h._isAsync||d(j,g),h)}}},_removeViews:function(a,b){"boolean"==typeof a&&(b=a,a=this),a=a||this,a.getViews().each(function(a){(a.__manager__.hasRendered||b)&&k._removeView(a,b)})},_removeView:function(a,b){var c,d=a.__manager__,f="boolean"==typeof a.keep?a.keep:a.options.keep;if(!f&&(d.append===!0||b)){if(k.cleanViews(a),a._removeViews(!0),a.$el.remove(),!d.parent)return;if(c=d.parent.views[d.selector],e.isArray(c))return e.each(e.clone(c),function(a,b){a&&a.__manager__===d&&j.call(c,b,1)});delete d.parent.views[d.selector]}},cleanViews:function(a){e.each(i.call([],a),function(a){a.unbind(),a.model instanceof d.Model&&a.model.off(null,null,a),a.collection instanceof d.Collection&&a.collection.off(null,null,a),a.cleanup&&a.cleanup.call(a)})},cache:function(a,b){return a in this._cache?this._cache[a]:null!=a&&null!=b?this._cache[a]=b:void 0},configure:function(a){this.augment(k.prototype.options,a),a.manage&&(d.View.prototype.manage=!0)},augment:e.forIn?function(a){return e.reduce(Array.prototype.slice.call(arguments,1),function(a,b){return e.forIn(b,function(b,c){a[c]=b}),a},a)}:e.extend,setupView:function(a,b){if(!a.__manager__){var f,g,h,j=d.LayoutManager.prototype,l=e.pick(a,c);e.defaults(a,{views:{},__manager__:{},_removeViews:k._removeViews,_removeView:k._removeView},k.prototype),b=a.options=e.defaults(b||{},a.options,j.options),h=e.pick(b,i.call(["events"],e.values(b.events))),k.augment(a,h),(l.render===k.prototype.render||l.render===d.View.prototype.render)&&delete l.render,k.augment(b,l),a._remove=d.View.prototype.remove,a._render=function(a,b){var c=this,d=c.__manager__,e=b.beforeRender;return d.hasRendered&&this._removeViews(),e&&e.call(this,this),this.trigger("beforeRender",this),a(this,b).render()},a.render=k.prototype.render,a.remove!==j.remove&&(a._remove=a.remove,a.remove=j.remove),f=b.views||a.views,e.keys(f).length&&(g=f,a.views={},a.setViews(g)),a.options.template?a.options.template=b.template:a.template&&(b.template=a.template,delete a.template)}}});a.Definitions.Views.CompositeView=d.Layout=d.LayoutView=d.LayoutManager=k,k.VERSION="0.7.5",d.View.prototype._configure=function(){var a=g.apply(this,arguments);return this.manage&&k.setupView(this),a},k.prototype.options={prefix:"",deferred:function(){return f.Deferred()},fetch:function(a){return e.template(f(a).html())},partial:function(a,b,c,d){var e=b?f(a).find(b):f(a);this[d?"append":"html"](e,c)},html:function(a,b){a.html(b)},append:function(a,b){a.append(b)},when:function(a){return f.when.apply(null,a)},render:function(a,b){return a(b)},contains:function(a,b){return f.contains(a,b)}},c=e.keys(k.prototype.options),k.prototype.options=e.extend(k.prototype.options,{fetch:function(a,b){var c="[data-layout-"+a+"]";b&&(c="[data-layout-"+a+"='"+b+"']");var d=f(c).html();if(void 0===d)throw"missing template data-layout-"+a+" in order to work";return e.template(d)}})}(this),e.DatabaseUri=function(a){if(!a)throw"Parameter 'databaseName' is null or empty";this.databaseName=a,this.webApi="",this.virtualFolder="/sitecore/shell"},n.extend(e.DatabaseUri.prototype,{getDatabaseName:function(){return this.databaseName}}),e.ItemUri=function(a,b){if(!a)throw"Parameter 'databaseUri' is null or empty";if(!b)throw"Parameter 'itemId' is null or empty";this.databaseUri=a,this.itemId=b},n.extend(e.ItemUri.prototype,{getDatabaseName:function(){return this.databaseUri.databaseName},getDatabaseUri:function(){return this.databaseUri},getItemId:function(){return this.itemId}}),e.ItemVersionUri=function(a,b,c){if(!a)throw"Parameter 'itemUri' is null";if(!b)throw"Parameter 'language' is null or empty";if(!n.isNumber(c))throw"Parameter 'version' is null or not a number";this.itemUri=a,this.language=b,this.version=c},n.extend(e.ItemVersionUri.prototype,{getDatabaseUri:function(){return this.itemUri.getDatabaseUri()},getDatabaseName:function(){return this.itemUri.getDatabaseName()},getItemUri:function(){return this.itemUri},getItemId:function(){return this.itemUri.getItemId()},getLanguage:function(){return this.language},getVersion:function(){return this.version}}),e.FieldUri=function(a,b){if(!a)throw"Parameter 'itemVersionUri' is null or empty";if(!b)throw"Parameter 'fieldId' is null or empty";this.itemVersionUri=a,this.fieldId=b},n.extend(e.FieldUri.prototype,{getDatabaseUri:function(){return this.itemVersionUri.getDatabaseUri()},getDatabaseName:function(){return this.itemVersionUri.getDatabaseName()},getItemUri:function(){return this.itemVersionUri.getItemUri()},getItemId:function(){return this.itemVersionUri.getItemId()},getLanguage:function(){return this.itemVersionUri.getLanguage()},getVersion:function(){return this.itemVersionUri.getVersion()},getFieldId:function(){return this.fieldId}}),e.Database=function(a){if(!a)throw"Parameter 'databaseUri' is null";this.databaseUri=a,this.ajaxOptions={dataType:"json"}},n.extend(e.Database.prototype,{convertToItem:function(a){return a.result?a.result.items?0===a.result.items.length?null:a.result.items.length>1?(console.debug("ERROR: Expected a single item"),null):new b.Definitions.Data.Item(a.result.items[0]):(console.debug("ERROR: No items from server"),null):(console.debug("ERROR: No data from server"),null)},convertToItems:function(a){if(!a.result)return console.debug("ERROR: No data from server"),{items:[],totalCount:0,data:a};if(!a.result.items)return console.debug("ERROR: No items from server"),{items:[],totalCount:0,data:a};var c=n.map(a.result.items,function(a){return new b.Definitions.Data.Item(a)});return{items:c,total:a.result.totalCount,data:a.result}},getItem:function(a,c,d){if(!a)throw"Parameter 'id' is null";if(!c)throw"Parameter 'completed' is null";d=d||{},a instanceof b.Definitions.Data.ItemUri&&(d.database=a.getDatabaseName(),a=a.getItemId()),a instanceof b.Definitions.Data.ItemVersionUri&&(d.database=a.getDatabaseName(),d.language=a.getLanguage(),d.version=a.getVersion(),a=a.getItemId());var e=this.getUrl(a,d);this.get(e).pipe(this.convertToItem).done(c).fail(function(a){c(null,a)})},search:function(a,b,c){if(!b)throw"Parameter 'completed' is null";var d=this.getUrl("search:"+a,c);this.get(d).pipe(this.convertToItems).done(function(a){b(a.items,a.total,a.data)}).fail(function(a){b([],0,a)})},query:function(a,b,c){if(!a)throw"Parameter 'queryExpression' is null";if(!b)throw"Parameter 'completed' is null";var d=this.getUrl("query:"+a,c);this.get(d).pipe(this.convertToItems).done(function(a){b(a.items,a.total,a.data)}).fail(function(a){b([],0,a)})},getChildren:function(a,b,c){if(!a)throw"Parameter 'id' is null";if(!b)throw"Parameter 'completed' is null";c=c||{},c.scope||(c.scope=["children"]);var d=this.getUrl(a,c);this.get(d).pipe(this.convertToItems).done(function(a){b(a.items,a.total,a.data)}).fail(function(a){b([],0,a)})},getUrl:function(b,c){c=c||{},c.database||(c.database=this.databaseUri.getDatabaseName()),c.webApi||(c.webApi=this.databaseUri.webApi),c.virtualFolder||(c.virtualFolder=this.databaseUri.virtualFolder);var d=a.Web.itemWebApi.getUrl(b,c);return d},get:function(a){return m.ajax({url:a,dataType:this.ajaxOptions.dataType})}}),e.Field=function(a,b,c,d,f){if(!a)throw"Parameter 'item' is null";if(!(b instanceof e.FieldUri))throw"Parameter 'fieldUri' is null";this.item=a,this.fieldUri=b,this.fieldName=c||"",this.value=d||"",this.type=f||"Single-Line Text"},n.extend(e.Field.prototype,{toModel:function(){return this.$model||(this.$model=new b.Definitions.Models.Model(this)),this.$model},toViewModel:function(){var a={fieldId:this.fieldUri.getFieldId(),fieldName:this.fieldName,type:this.type,value:new o.observable(this.value)},b=this;return a.value.subscribe(function(a){b.item[b.fieldName]=a,b.value=a}),a}}),e.LocalStorage=function(a){if(!a)throw"you need to provide a unique key";this.appID=a,this.fullKey=this.prefix+this.appID,this.localStorageLibrary=m.jStorage},n.extend(e.LocalStorage.prototype,{prefix:"#sc#",get:function(a){var b=this.fullKey+a;return this.localStorageLibrary.get(b)},getAll:function(){var a,b=this.localStorageLibrary.index(),c={};return a=n.filter(b,function(a){return a.indexOf(this.fullKey)>=0},this),n.each(a,function(a){var b=a.substring(this.fullKey.length,a.length);c[b]=this.localStorageLibrary.get(a)},this),c},deleteRecord:function(a){var b=this.fullKey+a;return this.localStorageLibrary.deleteKey(b)},set:function(a,b,c){var d=this.fullKey+a;return this.localStorageLibrary.set(d,b,c)},flush:function(){var a=this.localStorageLibrary.index(),b=n.filter(a,function(a){return a.indexOf(this.fullKey)>=0},this);n.each(b,function(a){this.localStorageLibrary.deleteKey(a)},this)}});var kb={options:function(a,b){return{dataType:"json",type:a,data:b}},convertResponse:function(a){return 200!==a.statusCode?m.Deferred().reject({readyState:4,status:a.statusCode,responseText:a.error.message}):a.result},createItem:function(a){return new b.Definitions.Data.Item(a.items[0])},triggerCreated:function(a){return b.trigger("item:created",a),a}},lb=function(a,c,d){var e=a;if(!a.name||!a.templateId||!a.parentId)throw"Provide valid parameter in order to create an Item";a.database||(a.database="core");var f=b.Web.itemWebApi.getUrl(e.parentId,{webApi:"/-/item/v1/sitecore/shell",database:a.database});return f=b.Helpers.url.addQueryParameters(f,{name:a.name}),f=b.Helpers.url.addQueryParameters(f,{template:a.templateId}),m.when(m.ajax(f,kb.options("POST",c))).pipe(kb.convertResponse).pipe(kb.createItem).pipe(kb.triggerCreated).done(d)},mb=function(a,c){var d;this.$fields?d=n.map(this.$fields,function(a){return{name:a.fieldName,value:this[a.fieldName]}},this):(d=n.map(this.attributes.$fields,function(a){var b;return this.attributes[a.fieldName]!==a.value?b={name:a.fieldName,value:this.attributes[a.fieldName]}:void 0},this),d=n.filter(d,function(a){return"undefined"!=typeof a}));var e=this.getUrl(),f={dataType:"json",type:"PUT",data:d},g=function(a){return b.trigger("item:updated",this),a};return m.when(m.ajax(e,f)).pipe(this.convertResponse).pipe(g).done(m.proxy(a,c))},nb=function(b,c){var d=this.getUrl(),e={dataType:"json",type:"GET"},f=function(b){if(!b.items)return this;if(0===b.items.length)throw"Item not found";if(date.items.length>1)throw"Expected a single item";var c=b.items[0];return n.each(c.Fields,function(b,c){this[b.Name]=b.Value;var d=this.getFieldById(c);null!=d?d.value=b.Value:this.$fields.push(this,new a.Definitions.Data.Field(fieldUri,b.Name,b.Value,b.Type))},this),this};return m.when(m.ajax(d,e)).pipe(this.convertResponse).pipe(f).done(m.proxy(b,c))},H=function(a,c){var d=this.getUrl(),e={dataType:"json",type:"DELETE"},f=function(a){return b.trigger("item:deleted",this),a};return m.when(m.ajax(d,e)).pipe(this.convertResponse).pipe(f).done(m.proxy(a,c))},ob=function(a,c,d){var e=[{name:"__itemName",value:a}],f=this.getUrl(),g={dataType:"json",type:"PUT",data:e},h=function(a){return b.trigger("item:renamed",this),a};return m.when(m.ajax(f,g)).pipe(this.convertResponse).pipe(h).done(m.proxy(c,d))};e.createItem=lb;var pb=function(a,b,c){var d=this;c=c||{};var e=c.success||function(){b&&b(d)};switch(a){case"read":this.read(this).pipe(e);break;case"create":throw"The 'create' operation is not supported";case"update":this.update(this,c).pipe(e);break;case"delete":this.remove(this).pipe(e)}},qb=a.Definitions.Models.Model.extend({idAttribute:"itemId",getUrl:function(){var a=this.get("itemUri"),b=new e.Database(a.getDatabaseUri());return b.getUrl(a.getItemId())},read:nb,remove:H,rename:ob,update:mb});if(e.Item=function(a,b){if(!b)if(b=a,b.itemUri)a=b.itemUri;else{var c=new e.DatabaseUri(b.Database);a=new e.ItemUri(c,b.ID)}return b instanceof e.Item?void this.shallowCopy(b):(this.$fields=[],n.each(b.Fields,function(b,c){this[b.Name]=b.Value;var d=new e.FieldUri(a,c),f=new e.Field(this,d,b.Name,b.Value,b.Type);b.FormattedValue&&(f.formattedValue=b.FormattedValue),b.LongDateValue&&(f.longDateValue=b.LongDateValue),b.ShortDateValue&&(f.shortDateValue=b.ShortDateValue),this.$fields.push(f)},this),this.itemUri=a,this.itemId=a.getItemId(),this.itemName=b.Name||"",this.$displayName=b.DisplayName||"",this.$database=b.Database||"",this.$language=b.language||"",this.$version=b.version||0,this.$templateName=b.TemplateName||"",this.$templateId=b.TemplateId||"",this.$hasChildren=b.HasChildren||!1,this.$path=b.Path||"",this.$url=b.Url||"",this.$mediaurl=b.MediaUrl||"",void(this.$icon=b.Icon||""))},n.extend(e.Item.prototype,{getFieldById:function(a){return n.find(this.$fields,function(b){return b.fieldUri.getFieldId()==a},this)},shallowCopy:function(a){this.$fields=a.$fields,n.each(a.$fields,function(a){this[a.Name]=a.Value},this),this.itemUri=a.itemUri,this.itemId=a.itemId,this.itemName=a.itemName,this.$displayName=a.$displayName,this.$language=a.$language,this.$version=a.$version,this.$templateName=a.$templateName,this.$templateId=a.$templateId,this.$hasChildren=a.$hasChildren,this.$path=a.$path,this.$url=a.$url,this.$mediaurl=a.$mediaurl},toModel:function(){if(!this.$model){var a=new qb(this);return a.sync=pb,a}return this.$model},toViewModel:function(){return this.toModel().viewModel},convertResponse:kb.convertResponse}),n.extend(b.Factories,{createJQueryUIComponent:function(a,b,c){var d=a.ControlModel.extend({initialize:function(){this._super(),c.model&&n.each(n.keys(c.model),function(a){this.model[a]=c.model[a]},this),n.each(c.attributes,function(a){var b="undefined"!=typeof a.defaultValue?a.defaultValue:null;this.set(a.name,b)},this),"undefined"!=typeof this.initialized&&this.initialized()}}),e=b.ControlView.extend({initialize:function(a){this._super();var b;a=a||{},c.view&&n.each(n.keys(c.view),function(a){this[a]=c.view[a]},this),n.each(c.attributes,function(c){var d="undefined"!=typeof c.defaultValue?c.defaultValue:null;"undefined"!=typeof d&&null!==d&&(b="undefined"!=typeof c.pluginProperty?c.pluginProperty:c.name,a[b]=d);var e=this.$el.attr("data-sc-option-"+b);e&&("true"==e&&(e=!0),"false"==e&&(e=!1),this.model.set(c.name,e),b="undefined"!=typeof c.pluginProperty?c.pluginProperty:c.name,a[b]=e)},this),n.each(c.events,function(b){if("undefined"==typeof a[b.name]){var c=this;a[b.name]=function(a,d){c.raiseEvent(b,a,d)}}},this),this.$el[c.control](a),this.widget=this.$el[c.control],this.widget=this.widget||this.$el.data(c.control),this.widget=this.widget||this.$el.data(c.namespace+c.control),n.each(c.functions,function(a){var b=this;this[a.name]=function(){if(!b.widget[a.name]){var c=b.widget;return c.apply(b.$el,[a.name,arguments[0]])}return b.widget[a.name].apply(b.widget,arguments)}},this),this.model.on("change",function(a){var b,d,e={};a.changed&&(n.each(n.keys(a.changed),function(f){n.find(c.attributes,function(a){return a.name==f&&1==a.added})||(d=n.find(c.attributes,function(a){return a.name==f}),b=d&&"undefined"!=typeof d.pluginProperty?d.pluginProperty:f,e[b]=a.get(f))}),this.$el[c.control]("option",e))},this),"undefined"!=typeof this.initialized&&this.initialized()},raiseEvent:function(a,b,c){a.on&&this[a.on](b,c);var d=this.$el.attr("data-sc-id"),e=this.app[d];e&&"undefined"!=typeof e[a.name]&&e[a.name](e,b,c),d&&this.app.trigger(a.name+":"+d,b,c)}});g.createComponent(c.componentName,d,e,c.selector)}}),j){var rb=0,sb=0,tb=0,ub=[],vb=function(a){var b=0,c=[],d=0;for(var e in a)if(a[e]&&"application"===a[e].modelType){var a=a[e];tb+=1,b+=1,n.each(a.Controls,function(a){sb+=1,d+=1,ub.push(a)}),c.push(vb(a[e]))}return{numberOfNestedApp:rb,nestedApps:c,nbControlInThisApp:d}},wb=function(){var b=vb(a);return{numberOfApps:rb,totalNumberOfControls:sb,totlaNumberOfApp:tb,alltheControls:ub,allApplications:b}};b.__info=function(){return{Components:{totalComponents:a.Components.length,compontentList:a.Components},Pipelines:{totalPipelines:a.Pipelines.length()},Applications:wb()}}}}.call(window);