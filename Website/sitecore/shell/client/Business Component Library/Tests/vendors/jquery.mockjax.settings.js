// Workaround for IE's console log apply problem.
$.mockjaxSettings.log = function (msg) {
    if ( window[ 'console' ] && window.console.log) {
				if (window.console.log.apply) {
				  window.console.log.apply(console, arguments);
				  return;				  
				}

      window.console.log(msg);
    }   
}  