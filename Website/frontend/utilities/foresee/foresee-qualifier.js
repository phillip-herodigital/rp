var $$FSR = {
   'timestamp': 'May 8, 2014 @ 4:25 PM',
   'version': '16.1.2.4',
   'build': '7',
   'enabled': true,
   'frames' : false,
   'sessionreplay': true,
   'auto' : true,
   'encode' : true,
   'files': '/frontend/utilities/foresee/',
   // needs to be set when foresee-transport.swf is not located at 'files'
   //'swf_files': '__swf_files_'
   'id': 'kzbIv02ODGyOI0exo0z+uQ==',
   'definition': 'foresee-surveydef.js',
   'swf' : 'foresee-transport.swf',
   'worker' : 'foresee-worker.js',
   'embedded': false,
   'replay_id': 'mystream.com',
   'attach': false,
   'renderer':'W3C',	// or "ASRECORDED"
   'layout':'CENTERFIXED',	// or "LEFTFIXED" or "LEFTSTRETCH" or "CENTERSTRETCH"
   'triggerDelay': undefined,
   'heartbeat' : true,
   'pools' : [
      {
         path: '.',
         sp: 100  // CHANGE ONLY WHEN INCLUDING SESSION REPLAY
      }
   ],
   'sites': [
      {
         path: /\w+-?\w+\.(com|org|edu|gov|net|co\.uk)/
      },
      {
         path: '.',
         domain: 'default'
      }
   ],
   storageOption: 'cookie',
   nameBackup:window.name
};

var FSRCONFIG = {};

// -------------------------------- DO NOT MODIFY ANYTHING BETWEEN THE DASHED LINES --------------------------------
if (typeof(FSR) == "undefined") {
(function(config){function F(){return function(){}}
(function(ba,Y){function x(a,b){return(b?a.get(b):a)||""}function M(a){return[a||m.o(),(a||m.o()).get("cp")||{}]}function U(a,b,c){var e=[];if(0<a.length){var f,h,g,k,n=a;a=/\.(?=([^"]*"[^"]*")*[^"]*$)|\[|#|:/g;var m=[];if(a.test(n)){a=n.match(a);for(var l=0;l<a.length;l++){var p=n.indexOf(a[l]);m.push({ya:n.substr(0,p),gc:a[l]});n=n.substr(p)}}m.push({ya:n});a=m[0].ya.toUpperCase();for(n=m.length-1;1<=n;n--)l=m[n-1].gc,p=m[n].ya,"["==l?(h=p.substr(1,p.length-2).split("="),1<h.length&&(h[1]=h[1].replace(/["']/g,
""))):"."==l?g=p.substr(1):"#"==l?f=p.substr(1):":"==l&&(k=parseInt(p.replace(":nth-child(","").replace(")","")));0==a.length&&(a="*");if(c)for(n=b.childNodes.length-1;0<=n;n--)c=b.childNodes[n],1!=c.nodeType||"*"!=a&&c.tagName!=a||e.push(c);else e=V(b.getElementsByTagName(a));if(f||h||g||k)for(n=e.length-1;0<=n;n--)k&&d.Ib(e[n])!=k-1||g&&-1==e[n].className.indexOf(g)||f&&e[n].id!=f?e.splice(n,1):h&&""!=h[0]&&(b=h[0],c=h[1]||"",m=e[n].getAttribute(b)||"","id"==b?c!=m&&e.splice(n,1):0>m.indexOf(c)&&
e.splice(n,1))}return e}function V(a){var b=[],c,d=0;for(c=b.length=a.length;d<c;d++)b[d]=a[d];return b}function N(a,b){var c,d,f,h,g=u,k,n=b[a];n&&("object"===typeof n&&"function"===typeof n.toJSON)&&(n=n.toJSON(a));"function"===typeof z&&(n=z.call(b,a,n));switch(typeof n){case "string":return P(n);case "number":return isFinite(n)?String(n):"null";case "boolean":case "null":return String(n);case "object":if(!n)return"null";u+=G;k=[];if("[object Array]"===Object.prototype.toString.apply(n)){h=n.length;
for(c=0;c<h;c+=1)k[c]=N(c,n)||"null";f=0===k.length?"[]":u?"[\n"+u+k.join(",\n"+u)+"\n"+g+"]":"["+k.join(",")+"]";u=g;return f}if(z&&"object"===typeof z)for(h=z.length,c=0;c<h;c+=1)"string"===typeof z[c]&&(d=z[c],(f=N(d,n))&&k.push(P(d)+(u?": ":":")+f));else for(d in n)Object.prototype.hasOwnProperty.call(n,d)&&(f=N(d,n))&&k.push(P(d)+(u?": ":":")+f);f=0===k.length?"{}":u?"{\n"+u+k.join(",\n"+u)+"\n"+g+"}":"{"+k.join(",")+"}";u=g;return f}}function P(a){Q.lastIndex=0;return Q.test(a)?'"'+a.replace(Q,
function(a){var c=Z[a];return"string"===typeof c?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function $(a,b){var c=[],d;for(d in a)a.hasOwnProperty(d)&&(c[d]=b(a[d]));return c}var d={},k=k=window,t=k.document;d.Ja=864E5;d.C=!!t.attachEvent;var H=Object.prototype.hasOwnProperty,A=[],I=!1,C,A=[],I=!1;d.k=function(a){return null!==a&&void 0!==a};d.Gb=function(a){for(var b=a.length-1;0<=b;b--)for(var c=b-1;0<=c;c--)a[c]==a[b]&&a.splice(b,1);return a};d.Ib=function(a){for(var b=
a.parentNode.childNodes,c,d=count=0;(c=b.item(d++))&&c!=a;)1==c.nodeType&&count++;return count};d.ca=function(a){return"[object Array]"==Object.prototype.toString.call(a)};d.Ba=function(a){if(a){if(a.length)for(var b=a.length-1;0<=b;b--)a[b]=null;for(var c in a)if(b=typeof a[c],"function"==b||"object"==b)a[c]=null}};d.B=function(a){return"function"==typeof a};d.Vb=function(a){return"object"==typeof a};d.trim=function(a){return a.toString().replace(/\s+/g," ").replace(/^\s+|\s+$/g,"")};d.Fc=function(a){var b=
a.getAttribute?a.getAttribute("id"):a.id;b&&!d.Jc(b)&&(b=a.attributes.id.value);return b};d.Jb=function(a){return a.toString().replace(/([-.*+?^${}()|[\]\/\\])/g,"\\$1")};d.l=function(){var a=arguments,b=a[0]||{},c=1,e=a.length,f,h,g;"object"===typeof b||d.B(b)||(b={});e===c&&(b=this,--c);for(;c<e;c++)if(null!=(f=a[c]))for(h in f)g=f[h],b!==g&&void 0!==g&&(b[h]=g);return b};d.F=F();d.now=function(){return+new Date};d.shift=function(a){return a.splice(0,1)[0]};d.Qa=function(a,b){for(var c in b)if(b[c]===
a)return c;return-1};d.Z=function(){return t.location.protocol};d.Hc=function(a,b){return-1!=d.Qa(a,b)};d.yc=function(a){return t.getElementById(a)};d.Ac=function(a,b,c){var e=a.split(".");b=b[d.shift(e)];for(var f=c,h;null!=b&&0<e.length;)b=b[d.shift(e)];if(b){for(e=a.split(".");e.length&&(h=d.shift(e));)f=f[h]?f[h]:f[h]={};e=a.split(".");for(f=c;e.length&&(h=d.shift(e));)0<e.length?f=f[h]:f[h]=b}};d.Q=function(){return t.location.href};d.aa=function(a){return encodeURIComponent(a)};d.oa=function(a){return decodeURIComponent(a)};
d.Ta=function(){return t.referrer};d.Mc={};d.Zb=function(a,b){a=a+"?build="+l.build;b=b||d.F;var c=t.createElement("script");c.type="text/javascript";d.C?c.onreadystatechange=function(){"loaded"!=this.readyState&&"complete"!=this.readyState||b("ok")}:c.onload=function(){b("ok")};c.onerror=function(){b("error")};c.src=0==d.Qa("//",a)?d.Z()+a:a;(t.getElementsByTagName("head")[0]||t.documentElement).appendChild(c)};d.K=function(a,b,c){c||(c=k);c=c.document;c=c.readyState;b=b||1;if(d.B(a)&&(a=function(a,
b){return function(){setTimeout(function(a){return function(){a.call(d.ma);a=null}}(a),b);a=null}}(a,b),c&&("complete"==c||"loaded"==c))){I=!0;for(A.push(a);a=d.shift(A);)a&&a.call(d.ma);return}if(!I&&d.B(a))A.push(a);else if(I&&d.B(a))a.call(d.ma);else if(!d.B(a))for(I=!0;0<A.length;)(a=d.shift(A))&&a.call(d.ma);a=c=c=c=null};t.addEventListener?C=function(){-1<"complete,loaded".indexOf(t.readyState)&&(t.removeEventListener("readystatechange",C,!1),d.K(null))}:d.C&&(C=function(){-1<"complete,loaded".indexOf(t.readyState)&&
(t.detachEvent("onreadystatechange",C),d.K(null))});t.addEventListener?(t.addEventListener("readystatechange",C,!1),t.addEventListener("DOMContentLoaded",d.K,!1)):d.C&&t.attachEvent("onreadystatechange",C);d.match=function(a){for(var b=[["urls",d.Q()],["local",d.Q()],["referrers",d.Ta()],["referrer",d.Ta()],["userAgents",k.navigator.userAgent],["browsers",{name:v.g.name,version:v.g.I}]],c=0;c<b.length;c++)for(var e=b[c],f=a[e[0]]||[],h=0;h<f.length;h++){var g=f[h];if(!d.Vb(e[1])){if(d.oa(e[1]).match(g))return!0}else if(d.oa(e[1].name.toLowerCase()).match(g.name.toLowerCase())&&
(!g.version||e[1].version==g.version))return!0}f=a.cookies||[];for(c=0;c<f.length;c++)if(e=f[c],b=m.f.ea(e.name))if(!e.operator||"eq"==e.operator){if(b.match(e.value||"."))return!0}else if((e.operator||"neq"==e.operator)&&null==b.match(e.value))return!0;c=m.La("fsr.ipo",m.Za("fsr.ipo"));if(a=a.variables)for(e=0,f=a.length;e<f;e++)if(b=a[e].name,h=a[e].value,b!=w.ipexclude||1!=c.get("value")){d.ca(b)||(b=[b],h=[h]);for(var l,g=!0,n=0,p=b.length,r=h.length;n<p&&n<r;n++){try{l=(new Function("return "+
b[n]))(),d.k(l)||(l="")}catch(q){l=""}var J;a:{J=l;var K=h[n];d.ca(K)||(K=[K]);for(var s=0,t=K.length;s<t;s++)if((J+"").match(K[s])){J=!0;break a}J=!1}if(!J){g=!1;break}}if(g)return!0}return!1};d.startTime=d.now();var w={},l=d.l({replay_id:"sitecom",site:{domain:"site.com"},renderer:"W3C",layout:"",swf_files:"/"},Y||{});d.wa=function(){for(var a={},b=arguments,c=0,e=b.length;c<e;c++){var f=b[c];if(d.da(f))for(var h in f){var g=f[h],k=a[h];a[h]=k&&d.da(g)&&d.da(k)?d.wa(k,g):d.Da(g)}}return a};d.Da=
function(a){var b;if(d.da(a)){b={};for(var c in a)b[c]=d.Da(a[c])}else if(d.ca(a)){b=[];c=0;for(var e=a.length;c<e;c++)b[c]=d.Da(a[c])}else b=a;return b};d.da=function(a){if(!a||("[object Object]"!==Object.prototype.toString.call(a)||a.nodeType||a.setInterval)||a.constructor&&!H.call(a,"constructor")&&!H.call(a.constructor.prototype,"isPrototypeOf"))return!1;for(var b in a);return void 0===b||H.call(a,b)||!H.call(a,b)&&H.call(Object.prototype,b)};d.pa=function(){A=l=null;d=k=k.FSR=null};d.Gc=function(a){var b=
d.now(),c;do c=d.now();while(c-b<a)};if(d.k(k.FSRCONFIG)){var q=k.FSRCONFIG;q.surveydefs&&(d.surveydefs=q.surveydefs,q.surveydefs=null);q.properties&&(d.properties=q.properties,q.properties=null)}k.FSR=d;k.FSR.opts=l;k.FSR.prop=w;d.r={};d.r.kb={};var s=d.r.kb;d.r.rb={};var p=d.r.rb;p.Dc=function(){for(var a=v.ka.replace(/[\s\\\/\.\(\);:]/gim,""),b="",c=d.now()+"",e=0;e<a.length-1;e+=a.length/7)b+=Number(a.charCodeAt(Math.round(e))%16).toString(16);7<b.length&&(b=b.substr(b.length-7));return b+"-"+
a.length+c.substr(c.length-6)+"-xxxx-xxxx-xxxxx".replace(/[xy]/g,function(a){var b=16*Math.random()|0;return("x"==a?b:b&3|8).toString(16)})};p.Nc=function(a,b){return a+Math.random()*(b-a)};p.mc=function(a,b){var c=k.document.createElement("a");c.href=k.location.href;var d=c.hostname,f=c.protocol;c.href=a;var h=c.hostname||d,g=0==c.protocol.indexOf("http")?c.protocol:f;c.href=b;f=0==c.protocol.indexOf("http")?c.protocol:f;return h.toLowerCase()==(c.hostname||d).toLowerCase()&&g.toLowerCase()==f.toLowerCase()};
p.s=function(a,b,c){var e="";if(a)for(var f in a)e+=(0!=e.length?"&":"")+(b?b+"["+f+"]":f)+"="+(c?a[f]:d.aa(a[f]));return e};p.hash=function(a){a=a.split("_");return 3*a[0]+1357+""+(9*a[1]+58)};p.Qb=function(a){var b=0,c="";if(0==a.length)return b;for(y=0;y<a.length;y++)c=a.charCodeAt(y),b=(b<<5)-b+c,b&=b;return b};p.J=function(a){a=a.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");a=RegExp("[\\?&+]"+a+"=([^&#]*)").exec(d.Q());return null==a?!1:a[1]};p.Ua=function(a,b,c){return a[b]||a[c]};p.Lc=function(a){a=
a.replace(/[^0-9]/g,"");return 10==a.length||"1"==a[0]&&11==a.length};p.Kc=function(a){return null!=a.match(/^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,6})+$/)};for(var R={},L=["onload","onerror","onabort"],y=0;y<L.length;y++)R[L[y]]=function(){this.bc(0==arguments.callee.Rb?1:0);this.t=!1},R[L[y]].Rb=y;s.H=function(a,b){this.options=d.l({},a);this.t=!1;this.event=b;this.Fa=0;return this};s.H.prototype.bc=function(a){if(this.t)switch(this.t=!1,this.status=a,a){case 1:(this.options.onSuccess||
d.F)(void 0);break;case 0:this.event?this.nc():(this.options.onFailure||d.F)(void 0);break;case -1:(this.options.onError||d.F)(void 0)}};s.H.prototype.nc=function(){if(3>this.Fa)this.Oa();else this.onFailure()};s.H.prototype.Db=function(a){var b;this.t=!0;a=p.s(d.l(a,{uid:d.now()}));a=d.Z()+"//"+this.options.host+this.options.path+this.options.url+"?"+a;b=d.l({},R,b);for(var c=new Image,e=0;e<L.length;e++){var f=L[e];c[f]=function(){var a=arguments.callee;a.O.onload=a.O.onerror=a.O.onabort=null;a.Lb.call(a.self,
a.O);a.O=null};c[f].Lb=b[f];c[f].O=c;c[f].self=this}c.src=a};s.H.prototype.send=function(a){this.pc=a;this.Oa()};s.H.prototype.Oa=function(){var a;this.Fa++;a=d.l({event:this.event,ver:this.Fa},this.pc,a);this.Db(a)};d.stringify=function(a,b,c){var e;k.Prototype&&(e=Array.prototype.toJSON,delete Array.prototype.toJSON);if(k.JSON&&"function"===typeof k.JSON.stringify)a=k.JSON.stringify(a,b,c);else{var f;G=u="";if("number"===typeof c)for(f=0;f<c;f+=1)G+=" ";else"string"===typeof c&&(G=c);if((z=b)&&
"function"!==typeof b&&("object"!==typeof b||"number"!==typeof b.length))throw Error("_4c.stringify");a=N("",{"":a})}d.k(e)&&(Array.prototype.toJSON=e);return a};d.parse=function(a){if(k.JSON&&d.B(k.JSON.parse))return k.JSON.parse(a);a=String(a);S.lastIndex=0;S.test(a)&&(a=a.replace(S,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return(new Function("return "+a))();throw new SyntaxError("_4c.parse");};var S=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,Q=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,u,G,Z={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},z;d.r.ib={};q=d.r.ib;q.wc=function(a,b){var c,e,f;d.k(a.length)||
(a=[a]);c=0;for(e=a.length;c<e;c++){f=a[c];var h=f.className||"";RegExp("\\b"+b+"\\b").test(h)||(f.className=(""==h?"":h+" ")+b)}};q.Oc=function(a,b){var c,e,f;d.k(a.length)||(a=[a]);c=0;for(e=a.length;c<e;c++)f=a[c],f.className&&(f.className=f.className.replace(RegExp("(\\s|^)"+b+"(\\s|$)")," ").replace(/^\s+|\s+$/g,""))};q.Bc=function(a,b){if(a){d.k(a.length)||(a=[a]);for(var c=0;c<a.length;c++)for(var e in b)e&&(-1=="zIndex".indexOf(e)&&("number"==typeof b[e]&&"opacity"!=e)&&(b[e]+="px"),a[c].style[e]=
b[e])}return a};q.xc=function(a,b){if(a){d.k(a.length)||(a=[a]);for(var c=0;c<a.length;c++)for(var e in b)a[c].setAttribute(e,b[e])}return a};q.outerHTML=function(a){if(d.k(a.outerHTML))return a.outerHTML;var b={TEXTAREA:!0},c={HR:!0,BR:!0,IMG:!0,INPUT:!0},e=[],f="",h=a.nodeName;switch(a.nodeType){case 1:f=f+"<"+h.toLowerCase();if(b[h])switch(h){case "TEXTAREA":for(b=0;b<a.attributes.length;b++)if("value"!=a.attributes[b].nodeName.toLowerCase())f+=" "+a.attributes[b].nodeName.toUpperCase()+'="'+a.attributes[b].nodeValue+
'"';else var g=a.attributes[b].nodeValue;f+=">";f+=g;f+="</"+h+">"}else{for(b=a.attributes.length-1;0<=b;b--)g=a.attributes[b].nodeName.toLowerCase(),-1<"style,class,id".indexOf(g.toLowerCase())&&(f+=" "+g+'="'+a.attributes[b].nodeValue+'"');f+=">";c[h]||(f+=a.innerHTML,f+="</"+h.toLowerCase()+">")}break;case 3:f+=a.nodeValue;break;case 8:f+="\x3c!--"+a.nodeValue+"--\x3e"}e.push(f);return e.join("")};p.j={};p.j.M={};p.j.ga=function(a,b,c,e){var f=p.j.M;if(a){f[b]||(f[b]=[]);f[b].push({Va:a,Y:c});
if("unload"==b){if(d.k(d.W)){d.W.push(c);return}d.W=[]}"propertychange"!=b&&a.addEventListener?a.addEventListener(b,c,!e):a.attachEvent&&a.attachEvent("on"+b,c)}};p.j.rc=function(a,b,c,d,f){var h=p.j;if(f){if(a.getAttribute("_fsr"+b))return!1;a.setAttribute("_fsr"+b,"true")}else if(f=h.M[b])for(h=f.length-1;0<=h;h--)if(f[h].Va==a&&(d||f[h].Y==c))return!1;p.j.ga(a,b,c)};p.j.sc=function(a,b,c){p.j.ga(a,b,c,!0)};p.j.qb=function(a,b,c){try{"propertychange"!=b&&a.removeEventListener?a.removeEventListener(b,
c,!1):a.detachEvent&&a.detachEvent("on"+b,c)}catch(d){}};var T=p.j.ga;p.j.jb=function(){for(var a=d.W.length-1;0<=a;a--)try{d.W[a].call()}catch(b){}d.Ba(d.W);p.j.nb();d.pa()};T(k,"unload",p.j.jb);p.j.nb=function(){if(d){var a=p.j,b;for(b in a.M){for(var c=a.M[b],e={};e=c.pop();)a.qb(e.Va,b,e.Y),d.Ba(e);delete a.M[b]}}};p.j.ha=function(){this.T=[];this.Hb=!1};p.j.ha.prototype.kc=function(a){this.T[this.T.length]={cc:!1,Y:a}};p.j.ha.prototype.N=function(){this.Hb=!0;for(var a=0;a<this.T.length;a++){var b=
this.T[a];b.Y.apply(this,arguments);b.cc&&(this.T.splice(a,1),a--)}};var D=p.j.ha;d.r.ia={};var r=d.r.ia;r.Nb=function(a,b){for(var c=a.name,d=[a.site,a.section,b,m.o("q"),m.o("l")],f=0;f<d.length;f++)c+=d[f]?"-"+d[f]:"";return c};r.$b=function(a,b){function c(b){"ok"===b&&d.surveydefs&&(d.l(w,d.properties),l.Ca=l.surveydefs=d.surveydefs,a())}var e=l.definition||"foresee-surveydef.js";b?setTimeout(function(){c("ok")},100):d.Zb(p.Ua(l.site,"js_files","files")+e,c)};r.log=function(a,b){if(w.events.enabled){var c=
m.o(),e=c.get("sd");d.k(e)||(e=c.get("cd"));d.k(e)||(e=0);var e=l.Ca[e],f=new Date;(new s.H((new r.X(w)).event(),"logit")).send({cid:l.id,rid:c.get("rid")||"",cat:e.name,sec:e.section||"",type:c.get("q")||"",site:l.site.name||"",lang:c.get("l")||(d.$S?d.$S.locale:""),msg:a,param:b,tms:f.getTime(),tmz:6E4*f.getTimezoneOffset()})}};q.mb={uc:{}};try{Array.prototype.slice.call(document.getElementsByTagName("html")),makeArray=function(a){return Array.prototype.slice.call(a)}}catch(ca){}var aa=q.mb.Pc=
function(a,b,c){b=b||t;c=!d.k(d.ia)||!d.ia.Ha.Qc||c;if(b.querySelectorAll&&!(d.C&&8>=v.g.I&&-1<a.indexOf("nth")))return V(b.querySelectorAll(a));if(!c&&k.$&&!k.Prototype)return k.$(a,b);a=a.split(",");c=[];for(var e=a.length-1;0<=e;e--){var f=a[e].replace(/^\s\s*/,"").replace(/\s\s*$/,"").replace(/\*=/g,"=").replace(/\>/g," > ").replace(/\s+/g," ");if(-1<f.indexOf(" ")){for(var f=f.split(" "),h=[b],g=!1,l=0;l<f.length;l++)if(">"==f[l])g=!0;else{for(var n=[],m=h.length-1;0<=m;m--)n=n.concat(U(f[l],
h[m],g));h=n;g=!1}c=c.concat(d.Gb(h))}else c=c.concat(U(f,b))}return c};s.h=function(a,b){var c={method:"POST",url:d.Q(),data:{},contentType:"application/x-www-form-urlencoded",L:d.F,A:d.F};this.gb=this.Ea=!1;var e=p.Ua;if(k.Worker&&!b){var f=p.mc,h=e(l.site,"js_files","files");if(f(h,k.location.href))this.xb(h+(l.worker||"foresee-worker.js"));else{var e=e(l.site,"html_files","files"),g=document.createElement("a");g.href=e;(this.sa=g.protocol+"//"+g.hostname)&&f(e,h)&&(this.wb(e+"iframe_proxier.html"),
h!=e&&this.yb(h+"foresee_worker.js"))}}this.options=d.l(c,a)};s.h.prototype.send=function(a,b){var c=d.l(this.options,a);!k.XDomainRequest||"IE"==v.g.name&&10<=v.g.I?this.gb&&!b?this.Pa(c):this.Ea&&!b?this.Ab(c):k.XMLHttpRequest&&this.Cb(c):this.Bb(c)};s.h.prototype.pa=function(){this.fa&&this.fa.terminate();this.v&&(this.v.parentNode.removeChild(ifr),ifr=null);d.Ba(this.options)};s.h.isSupported=function(){return d.C&&10>v.g.I&&"https"!=d.Q().substring(0,5)&&k==k.top?!1:!0};s.h.$a=function(a){a.call(s.h)};
s.h.prototype.wb=function(a){this.v=document.createElement("iframe");this.v.src=a;this.v.onload=s.h.tb(this);this.v.style.display="none";document.body.appendChild(this.v);this.V=0;this.S={};this.gb=!0;T(k,"message",function(a){return function(c){s.h.Ma(a,c)}}(this))};s.h.prototype.xb=function(a){try{this.fa=new Worker(a),this.Ea=!0}catch(b){}this.Ea&&(this.V=0,this.S={},this.fa.onmessage=function(a){return function(b){s.h.Ma(a,b)}}(this))};s.h.Ma=function(a,b){var c=a.S[b.data.i];switch(b.data.status){case 200:c.L&&
c.L.call(c,b.data.rt);break;case -1:d.Ka.Sa();break;default:c.A&&c.A.call(c,b.data.rt)}delete a.S[b.data.i]};s.h.tb=function(a){return function(){a.Sb=!0;if(a.G)for(var b=0;b<a.G.length;b++)a.Pa(a.G[b]);a.G=null}};s.h.prototype.Cb=function(a){var b=new k.XMLHttpRequest,c=d.k(a.za)&&!0==a.za?a.data:p.s(a.data,null,!1);try{b.open(a.method,a.url,!0)}catch(e){d.Ka.Sa();return}b.setRequestHeader("Accept","*/*");b.setRequestHeader("Content-Type",a.contentType);b.onreadystatechange=function(a,b){return function(){4==
b.readyState&&200==b.status?a.L&&a.L.apply(a,[b.responseText]):4==b.readyState&&200!=b.status&&a.A&&a.A.apply(a,[b.responseText])}}(a,b);b.send(c)};s.h.prototype.Ab=function(a){a=d.l(this.options,a);this.S[++this.V]=a;this.fa.postMessage(s.h.Na(a,this.V))};s.h.prototype.Pa=function(a){var b=d.l(this.options,a);this.Sb?(this.S[++this.V]=b,this.v.contentWindow.postMessage(s.h.Na(b,this.V),this.sa)):this.G?this.G[this.G.length]=a:this.G=[a]};s.h.prototype.Bb=function(a){var b=d.k(a.za)&&!0==a.za?a.data:
p.s(a.data,null,!1),c=new k.XDomainRequest;c.onerror=a.A;c.ontimeout=a.A;c.onprogress=d.F;c.onload=function(a,b){return function(){b.L(a.responseText);b=a=null}}(c,a);c.timeout=3E4;try{c.open("post",a.url)}catch(e){d.Ka.Sa();return}c.send(b)};s.h.prototype.yb=function(a){var b={m:"worker_url"};b.u=a;this.v.contentWindow.postMessage(b,this.sa)};s.h.Na=function(a,b){var c={i:b},d=["method","url","data","contentType"],f;for(f in d)c[d[f]]=a[d[f]];return{m:"CORS",d:c}};d.r.ob={};var m=d.r.ob;m.ra=function(a){return a+
(l.site.cookie?"."+l.site.cookie:"")};m.o=function(a,b){var c=m.ra("fsr.s"),c=m.La(c,m.Za(c));return a?d.k(b)?c.set(a,b):c.get(a):c};m.Za=function(a){var b;b="window"==l.storageOption&&m.sb.isSupported()?function(){var a=arguments.callee;return new m.sb(a.cb,a.Xa||{})}:function(){var a=arguments.callee;return new m.f(a.cb,d.l({path:"/",domain:a.xa.site.domain,secure:a.xa.site.secure,encode:a.xa.encode},a.Xa||{}))};b.cb=a;b.xa=l;b.Xa=void 0;return b};var W={};m.La=function(a,b){var c=W[a];return null!=
c?c:c=W[a]=new b};p.hb=function(){function a(){d.K(function(a,b,c){return function(){a.ua=b();a.Wb=c();a.bb=!0;a.Ra.N()}}(g,e,b))}function b(){var a=!0;g.D&&(g.ua=e(),"Android"==g.p.name&&(2.2>g.p.version?a=!1:3>g.p.version&&g.ua&&(a=!1)));return a}function c(){g.g.name=m.name;g.g.version=m.version;g.g.I="IE"!=g.g.name?g.g.version:6<g.g.version&&10>g.g.version?h("Trident")||7!=g.g.version?h("Trident/5.0")&&9>=g.g.version?9:h("Trident/4.0")&&9>g.g.version?8:g.g.version:7:g.g.version;g.p.name=f(g.D);
var a=g.p,b;g.D?(b=l.match(/Android[\/\s](\d+\.?\d+)/)||l.match(/Windows Phone OS[\/\s](\d+\.?\d+)/)||l.match(/Windows Phone[\/\s](\d+\.?\d+)/),b=null==b?1:b[1]):b=1;a.version=b}function e(){if("Winphone"!=g.p.name){var a=aa("head meta[name=viewport],head meta[name=VIEWPORT],head meta[name=Viewport]")||[];d.ca(a)||(a=[a]);if(0<a.length)for(var b=0;b<a.length;b++){var c=function(a,b){return a.match(RegExp("[\\w\\W]*"+b+"[\\s]*=[\\s]*([^\\s,;]*)[\\w\\W]*","i"))},e=c(a[b].content,"user-scalable"),f=
c(a[b].content,"initial-scale"),c=c(a[b].content,"maximum-scale");if(e&&1<e.length&&(0<="iphone,ipad,ipod".indexOf(g.p.name.toLowerCase())&&"0"==e[1].toLowerCase()||0<="android".indexOf(g.p.name.toLowerCase())&&"no"==e[1].toLowerCase()))return!1;if(f&&c)return!("1.0"==f[1]&&"1.0"==c[1])}return!0}return!1}function f(a){if(a)return h("iPod")?"iPod":h("iPad")?"iPad":h("iPhone")?"iPhone":(h("blackberry")||h("playbook")||h("BB10"))&&h("applewebkit")?"Blackberry":h("Windows Phone")?"Winphone":h("Kindle")||
h("Silk")?"Kindle":h("BNTV")||h("Nook")?"Nook":h("Android")?"Android":void 0!=k.orientation?"Mobile":"Other";if(h("Windows"))return"Windows";if(h("OS X"))return"Mac";if(h("Linux"))return"Linux";if(h("Mac"))return"Mac"}function h(a){return-1<l.toLowerCase().indexOf(a.toLowerCase())}var g=this;g.p={name:"",version:0};g.g={name:"",version:0,I:0};g.ka="";g.D=!1;g.ta=!1;g.Wb=!0;g.ua=!0;g.bb=!1;g.Ra=new D;g.ab=!1;g.eb=d.Z()+"//device.4seeresults.com/detect?accessToken=";var l=g.ka=k.navigator.userAgent;
g.D=/iphone|ipad|ipod|android|kindle|silk|bntv|nook|blackberry|playbook|mini|windows\sce|windows\sphone|palm|bb10/i.test(l);g.Xb=/Windows Phone/i.test(l);g.D&&(/iphone|ipad|ipod/i.test(l)&&(g.ab=!0),/ipad|silk|kindle|playbook|nook|bntv/i.test(l)&&(g.ta=!0));var m=function(a){var b="Unknown",c;null!=(c=a.match(/Opera[\/\s](\d+\.\d+)/))?b="Opera":null!=(c=a.match(/MSIE (\d+\.\d+)/))?b="IE":null!=(c=a.match(/Navigator[\/\s](\d+\.\d+)/))?b="Netscape":null!=(c=a.match(/Chrome[\/\s](\d+\.\d+)/))?b="Chrome":
null!=(c=a.match(/Safari[\/\s](\d+\.?\d+)/))?b="Safari":null!=(c=a.match(/Firefox[\/\s](\d+\.\d+)/))&&(b="Firefox");return{name:b,version:null!=c?parseFloat(c[1]):void 0}}(l);if(g.D)if(g.ab||""==g.eb||g.ta||g.Xb)c(),a(),a();else{var r=function(b){b=d.parse(b);g.g.name=b.browser.name;g.g.version=g.g.I=b.browser.version;g.p.name=b.os.name;g.p.version=b.os.version;g.D=b.isMobile;g.ta=b.isTablet;a()},q;if(k.sessionStorage){var t=k.sessionStorage;q=t.getItem("FSR_BROWSER")}q?r(q):(q={method:"GET",url:g.eb+
p.Qb(function(){var a=new Date,b=(a.getMonth()+1).toString(),c=a.getDate().toString();return a.getFullYear().toString()+(b[1]?b:"0"+b[0])+(c[1]?c:"0"+c[0])}()+"ForeSee"+(k.location.origin||"null"))+"&ua="+l,type:"*/*",contentType:"application/x-www-form-urlencoded",L:function(a){t&&t.setItem("FSR_BROWSER",a);r(a)},A:function(){c();a();a()}},(new s.h(q,!0)).send())}else c(),g.bb=!0,g.Ra.N()};var v=new p.hb,q={width:"1",height:"1",id:"_"+(""+Math.random()).slice(9),allowfullscreen:!0,allowscriptaccess:"always",
quality:"high",version:[3,0],ac:null,Kb:null,Ga:!1,Eb:!1};k.attachEvent&&k.attachEvent("onunload",function(){__flash_unloadHandler=F();__flash_savedUnloadHandler=F()});var O=d.l(d.Cc,{zc:q,Ob:function(){var a,b;try{b=navigator.plugins["Shockwave Flash"].description.slice(16)}catch(c){try{b=(a=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7"))&&a.GetVariable("$version")}catch(d){try{b=(a=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6"))&&a.GetVariable("$version")}catch(f){}}}return(b=/(\d+)[^\d]+(\d+)[^\d]*(\d*)/.exec(b))?
[b[1],b[3]]:[0,0]},la:function(a){if(null===a||void 0===a)return null;var b=typeof a;"object"==b&&a.push&&(b="array");switch(b){case "string":return a=a.replace(RegExp('(["\\\\])',"g"),"\\$1"),a=a.replace(/^\s?(\d+\.?\d*)%/,"$1pct"),'"'+a+'"';case "array":return"["+$(a,function(a){return O.la(a)}).join(",")+"]";case "function":return'"function()"';case "object":var b=[],c;for(c in a)a.hasOwnProperty(c)&&b.push('"'+c+'":'+O.la(a[c]));return"{"+b.join(",")+"}"}return String(a).replace(/\s/g," ").replace(/\'/g,
'"')},Ec:function(a,b){a=d.l({},a);var c='<object width="'+a.width+'" height="'+a.height+'" id="'+a.id+'" name="'+a.id+'"';a.Eb&&(a.src+=(-1!=a.src.indexOf("?")?"&":"?")+Math.random());c=a.Ga||!d.C?c+(' data="'+a.src+'" type="application/x-shockwave-flash"'):c+' classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"';c+=">";if(a.Ga||d.C)c+='<param name="movie" value="'+a.src+'" />';a.width=a.height=a.id=a.Ga=a.src=null;a.ac=a.version=a.Kb=null;for(var e in a)a[e]&&(c+='<param name="'+e+'" value="'+
a[e]+'" />');e="";if(b){for(var f in b)if(b[f]){var h=b[f];e+=f+"="+(/function|object/.test(typeof h)?O.la(h):h)+"&"}e=e.slice(0,-1);c+='<param name="flashvars" value=\''+e+"' />"}return c+"</object>"},isSupported:function(a){return B[0]>a[0]||B[0]==a[0]&&B[1]>=a[1]}}),B=d.Ia=O.Ob();d.Pb=null!=B&&0<B.length&&0<parseFloat(B[0]);d.Pb||(B=d.Ia=[0,0]);m.f=function(a,b){a||(a="STORAGE");this.ba=a.replace(/[- ]/g,"");m.f.q||m.f.$a();this.R=b||{};this.data={};this.pb=new D;this.Aa=0;this.jc=4E3;this.Ub=
!0};m.f.prototype.set=function(a,b){this.ja();this.q[a]=b;this.na()};m.f.prototype.get=function(a){this.ja();return a?this.q[a]:this.q};m.f.prototype.pa=function(a){this.ja();delete this.q[a];this.na()};m.f.prototype.va=function(){this.Aa=0;this.q={};var a=this.R.duration;this.R.duration=-1;this.na();a?this.R.duration=a:delete this.R.duration};m.f.prototype.ja=function(){this.q={};try{var a=m.f.ea(this.ba);a&&0<a.length&&(this.q=d.parse(a),d.k(this.q)?(this.Aa=this.ba.length+a.length+2,this.Ub=!1):
this.q={})}catch(b){this.q={}}};m.f.prototype.na=function(){var a=d.stringify(this.q);this.ba.length+d.aa(a).length>this.jc&&this.pb.N(this);this.Aa=m.f.write(this.ba,a,this.R)};m.f.ea=function(a){return(a=k.document.cookie.match("(?:^|;)\\s*"+d.Jb(a)+"=([^;]*)"))?d.oa(a[1]):null};m.f.write=function(a,b,c){b=c&&d.k(c.encode)&&!c.encode?b:d.aa(b);a=d.aa(a);for(var e in c)if(c[e]){var f=c[e];b+=";"+("duration"===e?"expires":e);switch(e){case "duration":b+="="+(new Date(d.now()+f*d.Ja)).toGMTString();
default:b+="="+f}}k.document.cookie=a+"="+b;return a.length+b.length+2};m.f.va=function(a,b){m.f.write(a,"",d.l(b,{duration:-1}))};m.f.$a=function(a){a&&a.apply(m.f)};m.f.isSupported=function(){return!0};r.w={};r.w.set=function(a,b,c,d){c=M(d);c[1][a]=b;c[0].set("cp",c[1])};r.w.get=function(a,b){return M(b)[1][a]};r.w.Wa=function(a,b){var c=M(b);delete c[1][a];c[0].set("cp",c[1])};r.w.append=function(a,b,c,d){d=M(d);d[1][a]=d[1][a]?d[1][a]+","+b:b;c&&(b=d[1][a].split(","),c=b.length>c?b.length-c:
0,d[1][a]=b.splice(c,b.length-1-c+1).join());d[0].set("cp",d[1])};r.w.s=function(a){a=a||m.o();var b=a.get("sd");d.k(b)||(b=a.get("cd"));b=l.Ca[b];a={browser:v.g.name+" "+v.g.version,os:v.p.name.match(/ipod|ipad|iphone/i)?"iOS":v.p.name,pv:a.get("pv"),url:x(a,"c"),entry:x(a,"ep"),ref_url:x(a,"ru"),locale:x(a,"l"),site:x(l.site.name),section:x(b.section),referrer:x(a,"r"),terms:x(a,"st"),sessionid:x(a,"rid"),replay_id:x(a,"mid"),flash:d.Ia.join(".")};v.p.name.match(/android|ipod|ipad|iphone|blackberry|firefox/i)&&
(a.screen=screen.width+"x"+screen.height);w.meta.user_agent&&(a.user_agent=v.ka);if(w.analytics.google_local||w.analytics.google){var c=m.f.ea("__utma"),b=m.f.ea("__utmz");c&&""!=c&&(c=c.split("."),a.first=c[2],a.last=c[3],a.current=c[4],a.visits=c[5]);if(b&&""!=b){var e,c=[];e=["utmgclid","utmcsr","utmccn","utmcmd","utmctr"];for(var f=0;f<e.length;f++)c.push(RegExp(e[f]+"=([^\\|]*)"));if(b.match(c[0]))a.source="Google",a.campaign="Google Adwords",a.medium="cpc";else{if(e=b.match(c[1]))a.source=e[1];
if(e=b.match(c[2]))a.campaign=e[1];if(e=b.match(c[3]))a.medium=e[1]}if(e=b.match(c[4]))a.keyword=e[1]}}b=m.o("cp");c=m.o("meta");a=d.l({},b||{},a||{},c||{});return p.s(a,"cpp")};q=r.w;k.FSR.CPPS=q;q.set=q.set;q.get=q.get;q.erase=q.Wa;q.append=q.append;var X={};k.ForeSee=X;X.CPPS=q;q.fsr$set=q.set;q.fsr$get=q.get;q.fsr$erase=q.Wa;q.fsr$append=q.append;r.n={};r.n.P=function(){var a,b=w.analytics.google_remote;if(b){var c=l.site.domain;b[c]&&(a=b[c])}return a};r.n.s=function(a){var b={},c=r.n.P();c&&
(b.domain="."+l.site.domain,b.id=c.id,b.name=c.name,a&&(b.event=a));return p.s(b,"ga")};r.n.Ya=function(a){var b,c=r.n.P();c&&c.events&&(b=c.events[a]);return b};r.n.fireEvent=function(a){var b=r.n.P();b&&(k._gaq=k._gaq||[],(a=r.n.Ya(a))&&k._gaq.push(["_trackEvent","foresee survey",a,b.name]))};r.n.Mb=function(a){var b=a;r.n.P()&&k._gat&&(b=k._gat._getTrackerByName()._getLinkerUrl(a));return b};r.n.Tb=function(){var a=r.n.P();if(a){k._gaq=k._gaq||[];k._gaq.push(["_setAccount",a.id]);k._gaq.push(["_setDomainName",
"."+l.site.domain]);k._gaq.push(["_trackPageview"]);a=document.createElement("script");a.type="text/javascript";a.async=!0;a.src=("https:"==document.location.protocol?"https://ssl":"http://www")+".google-analytics.com/ga.js";var b=document.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b)}};r.X=function(a){a=a&&a.survey||{};this.ub={name:a.host||"survey.foreseeresults.com"};this.vb={name:a.events_host||"events.foreseeresults.com"};this.tc={name:".4seeresults.com"};this.vc={name:"i.4see.mobi"};
this.zb=a.protocol||d.Z()};r.X.prototype.lc=function(){return{host:this.ub.name,path:"/survey",url:"/display",protocol:this.zb}};r.X.prototype.event=function(){return{host:this.vb.name,path:"/rec",url:"/process"}};d.qualifier={};var E;d.K(function(){l.qualifierState={};l.siteid=p.J("siteid");l.site=l.sites[l.siteid];l.site.name||(l.site.name=p.J("name"));l.site.domain||(l.site.domain=p.J("domain"));"default"==l.site.domain&&(l.site.domain=null);for(var a="files js_files image_files html_files css_files swf_files".split(" "),
b=0;b<a.length;b++){var c=a[b];l.site[c]||l[c]&&(l.site[c]=l[c])}E=l.qualifierState;E.canceled=!1});d.e=function(a){d.l(this,{options:d.l({},a),t:!1,U:null});l.controller=this;this.qc()};d.e.loaded=new D;d.e.lb=new D;d.e.hc=new D;d.e.fb=new D;d.e.prototype.qc=function(){var a=d.e.Ha;if(a.qa)for(var b=[["loaded",d.e.loaded],["initialized",d.e.Ic],["QualifierCanceled",d.e.lb],["qualifierShown",d.e.hc],["surveyShown",d.e.fb]],c=0;c<b.length;c++){var e=b[c];d.B(a.qa[e[0]])&&e[1].kc(a.qa[e[0]])}};d.e.prototype.load=
function(){if(this.t)return this;this.t=!0;r.$b(function(a){return function(){a.ic()}}(this),l.embedded)};d.e.prototype.ic=function(){d.e.loaded.N();r.n.Tb()};d.e.prototype.fc=function(){this.Fb();this.Yb()};d.e.prototype.Fb=function(){var a=m.o(),b=a.get("sd");d.k(b)||(b=a.get("cd"));a=l.Ca[b];a.idx=b;a.survey=d.wa(w.survey,a.survey||{});a.cancel=d.wa(w.cancel,a.cancel||{});this.U=a};d.e.prototype.Yb=function(){E.canceled?this.dc():this.ec()};d.e.prototype.ec=function(){d.e.fb.N(this.U,m.o());var a=
(new r.X(w)).lc(),b=this.U.survey,c=(k.screen.width-b.width)/2,e=(k.screen.height-b.height)/2,f=a.protocol,h=a.host,g=a.path,q=new Date-0+"_"+Math.round(1E13*Math.random()),n=p.hash(q),s=m.o("c")||"",n=p.s({sid:r.Nb(this.U,p.J("when")),cid:l.id,pattern:s,a:q,b:n,c:d.Ja,version:l.version}),s=r.w.s(),q=r.n.s(r.n.Ya("survey_shown")),a=f+"//"+h+g+a.url+"?"+n+"&"+s;q&&""!=q&&(a=a+"&"+q);a=r.n.Mb(a);r.log("400",m.o("c"));this.pop(a,c,e,b.width,b.height)};d.e.prototype.dc=function(){var a=this.U.cancel;
this.page(a);a=a.url+"?siteid="+p.J("siteid")+"&domain="+p.J("domain");r.log("500");this.pop(a)};d.e.prototype.pop=function(a,b,c,d,f){var h=arguments.length;setTimeout(function(){1<h&&(k.moveTo(b,c),k.resizeTo(d,f));k.focus();t.location.href=a},0)};d.e.prototype.page=function(a){var b=m.o("l");if(b)for(var c=a.locales||[],d=0,f=c.length;d<f;d++)if(c[d].locale==b){a.url=c[d].url;break}};d.e.prototype.oc=function(){this.t&&(this.t=!1)};k.FSR.qualified=function(){l.controller.fc()};k.FSR.qualify=function(a){E.canceled=
!1;a&&(E.qid=a,m.o("q",a))};k.FSR.cancel=function(){E.canceled=!0};k.FSR.reset=function(){m.f.va(m.ra("fsr.r"),{path:"/",domain:l.site.domain,secure:l.site.secure});m.f.va(m.ra("fsr.s"),{path:"/",domain:l.site.domain,secure:l.site.secure})};d.K(function(){(new d.e).load();T(k,"unload",function(a){return function(){a.controller.oc()}}(l))});d.e.Ha={qa:{loaded:F(),surveyShown:F()}}})(self,$$FSR);
})({});
}
// -------------------------------- DO NOT MODIFY ANYTHING BETWEEN THE DASHED LINES --------------------------------