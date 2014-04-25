var SitecoreAttach = Class.create({
  onload: function() {
    if (Prototype.Browser.Gecko || Prototype.Browser.WebKit) {
      $$("form")[0].observe("submit", function(e) {
        e.stop();
      });
      
      $$("body")[0].addClassName("ff");
    }

    this.destination = "/sitecore/shell/applications/flashupload/attach/attachtarget.aspx" + window.location.search + "&uploadID=" + $$(".uploadID")[0].value;
    
    YAHOO.widget.Uploader.SWFURL = "/sitecore/shell/controls/lib/YUIupload/uploader/assets/uploader.swf";

    this.yUploader = new YAHOO.widget.Uploader("BrowseOverlay");
    
    this.yUploader.addListener("fileSelect", scUpload.fileQueued.bind(scUpload));
    this.yUploader.addListener("uploadStart", scUpload.uploadStart.bind(scUpload));
    this.yUploader.addListener("uploadProgress", scUpload.updateProgress.bind(scUpload));
    this.yUploader.addListener("uploadCompleteData", scUpload.complete.bind(scUpload));    
    this.yUploader.addListener("uploadError", scUpload.error.bind(scUpload));
  },
  
  cancel: function() {
    this.yUploader.cancel();
    scForm.postRequest("", "", "", "Cancel");
  },
  
  close: function() {
    scForm.postRequest("", "", "", "Close()");
  },
  
  complete: function(event) {
    this.uploadedFiles = event.data;
    
    var progress = $$('.progress')[0];    
    progress.setStyle({ background: "none" });

    var progressImage = $$(".progressImage")[0];
    progressImage.hide();
    
    var doneImage = $$(".doneImage")[0];
    doneImage.show();
    
    $("Message").innerHTML = "";
    
    this.close();

    return true;
  },
  
  error: function(event) {
    console.error("upload error: %s" + event.status);
    scForm.postRequest("", "", "", "OnError");
  },
  
  fileQueued: function(event) {
    this.queued = true;
    var file = event.fileList.file0;
    
    this.fileId = file.id;
  
    scForm.postRequest("", "", "", 'OnQueued("' + file.name + '", "' + file.size + '")');

    return true;
  },
  
  start: function() {
    if (!this.queued) {
      alert("Please select a file to upload");
      return;
    }
    
    var params = new Object();
    
    params["Mode"] = "simple";
    if (Prototype.Browser.Gecko || Prototype.Browser.WebKit) {      
      params["UploadSessionID"] = $$(".uploadSessionID")[0].value;
      params["UploadSessionID1"] = $$(".uploadSessionID1")[0].value;
    }
        
    this.yUploader.upload(this.fileId, this.destination, "POST", params);
  },
  
  uploadStart: function() {
    var progressImage = $$(".progressImage")[0];
    progressImage.show();
    
    scForm.postRequest("", "", "", "OnUpload");
  
    return true;
  },
  
  updateProgress: function(event) {
    var width = (event.bytesLoaded / event.bytesTotal) * 100;
    var progress = $$('.progress')[0];    
    progress.setStyle({ width: width + "%" });
    
    return true;
  }
});

var scUpload = new SitecoreAttach();
Event.observe(window, "load", scUpload.onload.bindAsEventListener(scUpload));
Event.observe(document, "unload", function () {
  scUpload.yUploader.destroy();
});