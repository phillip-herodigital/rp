function scUpdatePosition(evt, eventType) {
  var ctl = scForm.browser.getControl("Position");
  var result = "";
  
  if (eventType == "move") {
    var offset = scForm.browser.getOffset(evt);
    result = "(" + offset.x + ", " + offset.y + ")";
  }
  
  if (rubberband != null && rubberband.visible) {
    var rect = rubberband.GetNormalizedRect();
    result += (result != "" ? "   " : "") + "[(" + rect.x + ", " + rect.y + ") -> (" + (rect.x + rect.w) + ", " + (rect.y + rect.h) + "), " + rect.w + "x" + rect.h + "]";
    
    var cropinfo = document.getElementById("CropInfo");
    cropinfo.value = rect.x + "," + rect.y + "," + rect.w + "," + rect.h;
  }
  
  ctl.innerHTML = (result != "" ? result : "&nbsp;");
}

///------------------------------------------------------------------------

function scRubberBand() {
  this.image = document.getElementById('Image');
  this.rubberband = document.getElementById('Rubber');

  this.x0 = 0;
  this.y0 = 0;
  this.x1 = 0;
  this.y1 = 0;
  
  this.moving = false;
  this.visible = false;
}

scRubberBand.prototype.GetRect = function() {
  if (!this.visible) {
    return null;
  }
  
  var rect = new Object();
  rect.x = (this.x0 < this.x1 ? this.x0 : this.x1);
  rect.y = (this.y0 < this.y1 ? this.y0 : this.y1);
  rect.w = Math.abs(this.x1 - this.x0);
  rect.h = Math.abs(this.y1 - this.y0);
  
  return rect;
}

scRubberBand.prototype.GetNormalizedRect = function() {
  var rect = this.GetRect();
  
  if (rect == null) {
    return;
  }
  
  var result = new Object();
  
  result.x = rect.x;
  result.y = rect.y;
  result.h = rect.h;
  result.w = rect.w;
  
  var image = scForm.browser.getControl("Image");
  
  if (result.x < 0) {
    result.w += result.x;
    result.x = 0;
  }
  else if (result.x >= image.offsetWidth) {
    result.x = image.offsetWidth - 1;
  }
  
  if (result.y < 0) {
    result.h += result.y;
    result.y = 0;
  }
  else if (result.y >= image.offsetHeight) {
    result.y = image.offsetHeight - 1;
  }

  if (result.x + result.w >= image.offsetWidth) {
    result.w = image.offsetWidth - result.x;
  }

  if (result.y + result.h >= image.offsetHeight) {
    result.h = image.offsetHeight - result.y;
  }
  
  return result;
}

scRubberBand.prototype.Track = function(x1, y1) {
  this.x1 = x1;
  this.y1 = y1;

  var rect = this.GetNormalizedRect();
  
  if (rect != null) {
    this.rubberband.style.left = rect.x + "px";
    this.rubberband.style.top = rect.y + "px";
    this.rubberband.style.width = rect.w + "px";
    this.rubberband.style.height = rect.h + "px";
  }
}

scRubberBand.prototype.Show = function() {
  this.rubberband.style.display = "block";
  this.visible = true;
}

scRubberBand.prototype.Hide = function() {
  var cropinfo = document.getElementById("CropInfo");
  cropinfo.value = "";

  this.rubberband.style.display = "none";
  this.visible = false;
}

scRubberBand.prototype.MouseDown = function(evt) {
  scForm.browser.clearEvent(evt, true);
  
  if (this.moving) {
    this.MouseUp();
  }
  else {
    scForm.browser.setCapture(this.image);
    var offset = scForm.browser.getOffset(evt);
    
    if (!evt.altKey) {
      this.x0 = offset.x;
      this.y0 = offset.y;
    }
    this.Show();
    this.Track(offset.x, offset.y);
    this.moving = true;
  }

  return false;
}

scRubberBand.prototype.MouseMove = function(evt) {
  scForm.browser.clearEvent(evt, true);

  if (this.moving) {
    var image = scForm.browser.getControl("Image");

    var ctl = scForm.browser.getSrcElement(evt);
    var offset = scForm.browser.getOffset(evt);

    if (ctl == this.rubberband) {
      this.Track(offset.x + this.rubberband.style.offsetLeft, offset.y + this.rubberband.style.offsetTop);
    }
    else {
      this.Track(offset.x, offset.y);
    }
  }
  
  return false;
}

scRubberBand.prototype.MouseUp = function(evt) {
  scForm.browser.clearEvent(evt, true);

  if (this.moving) {
    scForm.browser.releaseCapture(this.image);
    this.moving = false;
    
    var rect = this.GetRect();
    if (rect.w == 0 || rect.h == 0) {
      this.Hide();
    }
  }

  return false;
}

function scInitializeRubberBand() {
  rubberband = new scRubberBand();
}

scForm.browser.attachEvent(window, "onload", scInitializeRubberBand);

var rubberband = null;
