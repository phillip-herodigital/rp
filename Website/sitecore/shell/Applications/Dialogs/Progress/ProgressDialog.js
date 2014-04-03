

function checkStatus() {
  scForm.postRequest("", "", "", "CheckStatus");
}

function progressTo(factor) {
  var filler = $("filler");
  var total = 353;
  
  var parsedFactor = parseFloat(factor);
  var width = factor * total;
  
  filler.setStyle({ width: width + "px" });
}

function showException() {
  scForm.browser.showModalDialog("/sitecore/shell/controls/error.htm", new Array($('ErrorMessage').value), "center:yes;help:no;resizable:yes;scroll:yes;status:no;");
}

function toggle() {
  if ($('LogContainer').style.display == '') {
    collapse();
  }
  else {
    expand();
  }
}

function expand() {
  initialDialogHeight = window.dialogHeight;
  window.dialogHeight = '387px';
  $("LogContainer").show();
  $("MoreImage").toggle();
  $("LessImage").toggle();
}

function collapse() {
  window.dialogHeight = initialDialogHeight;
  $("LogContainer").hide();
}

function appendLog(html) {
  $("Log").innerHTML += html;
}

var SitecoreProgressAnimation = new (Class.create({
  initialize: function() {
    this.step = 3;
    this.fillerWidth = 65;
    this.totalWidth = 353;    
  },
  
  play: function() {
    if (this.playing) {
      return;
    }
    
    $("filler").setStyle({ width: this.fillerWidth + "px" });
    this.playing = true;    
    this.loop();
  },
  
  loop: function() {
    var filler = $("filler");
    var left = filler.positionedOffset()[0];
    left += this.step;
    
    if (left >= this.totalWidth - this.fillerWidth + this.step) {
      left = 1;
    }
    
    filler.setStyle({ left: left + "px" });
    setTimeout("SitecoreProgressAnimation.loop()", 25);
  }
}));

Event.observe(window, "load", checkStatus);
