function scTGallery() {
  this.minHeight = 40;
  this.alignRightOffset = 0;
  this.scrollbarWidth = 18;
}

scTGallery.prototype.autoAdjustSize = function() {
  return true;
}

scTGallery.prototype.onKeyUp = function(evt) {
  evt = (evt != null ? evt : event);
  
  if (evt.keyCode == 27) {
    this.galleryFrame.style.display = "none";
  }
}

scTGallery.prototype.onLoad = function () {
  this.fixWidthInsideGalleryElements = scForm.browser.isIE ? [] :  $$('.scFixWidthInsideGallery');
  this.galleryFrame = scForm.browser.getFrameElement(window);
  this.galleryTable = Element.down(this.galleryFrame.contentWindow.document.body, 'table');

  var frame = this.galleryFrame;

  scForm.focus(frame);
  
  var width = "";
  var height = "";
  
  if (!scForm.browser.isIE) {
    width = frame.offsetWidth;
  }
  else if (frame.width != "") {
    width = frame.width;
  }
  
  if (frame.height != "") {
    height = frame.height;
  }
  
  if (width == "" || height == "") {
    var ctl = $(document.body.firstChild);
    var w = ctl.style.width;
    var h = ctl.style.height;
    
    if (scForm.browser.isIE) {
      ctl.style.width = "1px";
      ctl.style.height = "1px";
    }
    else {
      ctl.setStyle({ width: "auto", height: "auto" });
    }    
    ctl.style.position = "absolute";
    
    width = ctl.scrollWidth;
    height = ctl.scrollHeight;

    ctl.style.position = "";
    ctl.style.width = w;
    ctl.style.height = h;
  }

  if (width == "" || width < this.galleryTable.offsetWidth) {
    width = this.galleryTable.offsetWidth + this.scrollbarWidth;
  }

  if (height == "" || height < this.minHeight) {
    height = this.minHeight;
  }

  if (this.autoAdjustSize()) {   
  frame.style.height = height + "px";
  frame.style.width = width + "px";
  }
  
  var viewport = frame.ownerDocument.body;
  if (viewport.clientHeight == 0) {
    var form = $(frame.ownerDocument.body).down("form");
    if (form && form.clientHeight > 0) {
      viewport = form;
    }
  }
  
  if (frame.offsetLeft + frame.offsetWidth > viewport.offsetWidth) {
    frame.style.left = (viewport.offsetWidth - frame.offsetWidth - 1) + "px";
  }

  if (frame.offsetTop + frame.offsetHeight > viewport.offsetHeight) {
    frame.style.top = (viewport.offsetHeight - frame.offsetHeight - 1) + "px";
  }

  if (frame.offsetLeft < 0) {
    frame.style.left = "0px";
  }

  if (frame.offsetTop + 16 > viewport.offsetHeight || frame.offsetTop < 0) {
    frame.style.top = "0px";
  }
  
  if (this.autoAdjustSize()) {
    if (frame.offsetLeft + frame.offsetWidth > viewport.offsetWidth) {
      frame.style.width = (viewport.offsetWidth - frame.offsetLeft - 1) + "px";
    }

    if (frame.offsetTop + frame.offsetHeight > viewport.offsetHeight) {
      frame.style.height = (viewport.offsetHeight - frame.offsetTop - 1) + "px";
    }
  }

  // This autoresize is needed in case increasing gallery content
  this.autoResize = setInterval(function () {
    try {
      if (scGallery.galleryFrame.offsetWidth < scGallery.galleryTable.offsetWidth) {
        scGallery.galleryFrame.style.width = (scGallery.galleryTable.offsetWidth + scGallery.scrollbarWidth) + 'px';
      };
    }
    catch (e) {
      clearInterval(scGallery.autoResize);
    }
  }, 100);
}

scTGallery.prototype.mouseDown = function(tag, evt) {
  if (!this.dragging) {
    this.trackCursor = new scPoint();
    this.trackCursor.setPoint(evt.screenX, evt.screenY);
    
    this.dragging = true;
    this.delta = 0;                   
    
    scForm.browser.setCapture(tag);

    scForm.browser.clearEvent(evt, true, false);
  }
}

scTGallery.prototype.mouseMove = function (tag, evt) {
  if (this.dragging) {
    var dx = evt.screenX - this.trackCursor.x;
    var dy = evt.screenY - this.trackCursor.y;

    var frame = this.galleryFrame;

    var oldWidth = frame.offsetWidth;
    this.fixWidthInsideGalleryElements.each(function (element) {
      element.style.width = (element.offsetWidth + dx) + 'px';
    });
    frame.style.width = (frame.offsetWidth + dx) + 'px';
    if (frame.offsetWidth < this.galleryTable.offsetWidth) {
      this.fixWidthInsideGalleryElements.each(function (element) {
        element.style.width = (element.offsetWidth - dx) + 'px';
        });
      frame.style.width = oldWidth + 'px';
    }

    this.trackCursor.x = evt.screenX;

    if (frame.offsetHeight + dy > this.minHeight) {
      frame.style.height = (frame.offsetHeight + dy) + 'px';
      this.trackCursor.y = evt.screenY;
    }
    else {
      frame.style.height = this.minHeight + 'px';
    }

    scForm.browser.clearEvent(evt, true, false);
  }
}

scTGallery.prototype.mouseUp = function(tag, evt) {
  if (this.dragging) {
    this.dragging = false;

    scForm.browser.clearEvent(evt, true, false);

    scForm.browser.releaseCapture(tag);

    var frame = this.galleryFrame;

    var scGalleries = window.parent.document.getElementById("scGalleries");
    
    var value = scGalleries.value;
   
    var p = value.toQueryParams();
    p[frame.id] = frame.style.width + "q" + frame.style.height;
    scGalleries.value = Object.toQueryString(p);
  }
}

scTGallery.prototype.onHide = function() {
}

var scGallery = new scTGallery();

scForm.browser.attachEvent(window, "onload", function() { scGallery.onLoad() });
scForm.browser.attachEvent(document, "onkeyup", function() { scGallery.onKeyUp() });
