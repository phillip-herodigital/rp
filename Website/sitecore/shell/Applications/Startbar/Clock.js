function scSitecoreClock() {
  this.update();
  
  var now = new Date();
  
  setTimeout("scClock.tick()", 60 * 1000 - 1000 * now.getSeconds() - now.getMilliseconds());
}

scSitecoreClock.prototype.tick = function(msg) {
  this.update();

  var now = new Date();
  
  setTimeout("scClock.tick()", 60 * 1000 - 1000 * now.getSeconds() - now.getMilliseconds());
};

scSitecoreClock.prototype.right = function(s, n) {
  return s.substr(s.length - n);
}

scSitecoreClock.prototype.update = function() {
  var now = new Date();
  
  if (now.getMinutes() == 59) {
    now.setSeconds(58);
    var time = now.toLocaleTimeString();
    time = time.replace(/[\W]*58/gi, "");
  }
  else {
    now.setSeconds(59);
    var time = now.toLocaleTimeString();
    time = time.replace(/[\W]*59/gi, "");
  }
  
  var date = now.toLocaleDateString();
  
  var content = "&nbsp;<span title='" + date + "' style='cursor:default'>" + time + "</span>&nbsp;";

  var ctl = scForm.browser.getControl("Clock");
  ctl.innerHTML = content;
};

function scInitializeClock() {
  scClock = new scSitecoreClock();
}

scForm.browser.attachEvent(window, "onload", scInitializeClock);