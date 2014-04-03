function scKeyboard() {
}

scKeyboard.prototype.getKeyCode = function(evt) {
  var result = ""; 

  if (evt.shiftKey) {
    result += "s";
  }
  if (evt.ctrlKey) {
    result += "c";
  }
  if (evt.altKey) {
    result += "a";
  }
  
  result += evt.keyCode.toString();
  
  return result;
}

scKeyboard.prototype.isFunctionKey = function(evt, editorKeys) {
  return scForm.isFunctionKey(evt, editorkeys);
} 

function scKeyboardOnKeyDown(evt) {
  evt = evt || window.event;

  if (evt != null) {
    var keyboard = new scKeyboard();
    
    var key = keyboard.getKeyCode(evt);
    
    if (key == "c83") {
      scForm.browser.clearEvent(evt, true, false, 0);
      scForm.postEvent(evt.srcElement, evt, "item:save");

      return false;
    }
  }
}

function scKeyboardInitialize() {
  scForm.browser.attachEvent(document, "onkeydown", scKeyboardOnKeyDown);
}

scForm.browser.attachEvent(window, "onload", scKeyboardInitialize);

///============================================================================
//
///============================================================================
function scAnimation() {
}

scAnimation.prototype.start = function() {
  var args = arguments.caller || arguments;
  
  for(var i = 0; i < args.length; i++) {
    this.control = scForm.browser.getControl(args[i]);
    if (this.control && this.control.offsetWidth > 0) {
      break;
    }
  }
  
  this.control.animation = this;

  this.initialize();
  
  window.setTimeout("scRunAnimation('" + this.control.id + "')", 20);
}

scAnimation.prototype.run = function() {
  var result = this.beat();
  
  if (result) {
    window.setTimeout("scRunAnimation('" + this.control.id + "')", 20);
  }
  else {
    this.control.animation = null;
    this.finalize();
  }
  
  return result;
}

function scRunAnimation(id) {
  var ctl = scForm.browser.getControl(id);
  
  if (ctl != null) {
    var obj = ctl.animation;
    
    if (obj != null) {
      if (!obj.run()) {
        delete obj;
      }
    }
  }
}

function scSaveAnimation(id) {
  this.start(id);
}

scSaveAnimation.prototype = new scAnimation();

scSaveAnimation.prototype.initialize = function() {
  this.dx = this.control.offsetWidth / 10;
  this.dy = this.control.offsetHeight / 10;  
  
  if (this.dx < 2) {
    this.dx = 2;
  }
  
  if (this.dy < 2) {
    this.dy = 2;
  }
  
  var c = "<div id=\"saveAnimation\" style=\"font:1pt tahoma;border:2px groove;position:absolute;z-index:100\" />";

  scForm.browser.insertAdjacentHTML(this.control, "beforeBegin", c);  
  
  this.rect = document.getElementById("saveAnimation");

  this.rect.style.width = this.control.offsetWidth;
  this.rect.style.height = this.control.offsetHeight;
}

scSaveAnimation.prototype.finalize = function() {
  if (this.rect) {
    scForm.browser.removeChild(this.rect);
    this.rect = null;
    this.control = null;
  }
}

scSaveAnimation.prototype.beat = function() {
  if (!this.rect) {
    return false;
  }

  if (this.rect.offsetWidth < this.dx || this.rect.offsetHeight < this.dy) {
    return false;
  }

  this.rect.style.left = this.rect.offsetLeft + this.dx / 2;
  this.rect.style.top = this.rect.offsetTop + this.dy / 2
  this.rect.style.width = this.rect.offsetWidth - this.dx;
  this.rect.style.height = this.rect.offsetHeight - this.dy;

  return true;
}
