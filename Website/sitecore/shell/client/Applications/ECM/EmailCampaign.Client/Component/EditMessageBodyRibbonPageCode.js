define(["/-/speak/v1/ExperienceEditor/RibbonPageCode.js"],
  function (ribbonPageCode) {
    var instance = window.scSitecore;
    instance.prototype._postRequestUrlRewriter = instance.prototype.postRequestUrlRewriter;
    instance.prototype.postRequestUrlRewriter = function (url) {
      var frameUrl = instance.prototype._postRequestUrlRewriter(url);
      return frameUrl.replace("/sitecore/client/Applications/ECM/Component/ExperienceEditorExtension/Ribbon.aspx", "/sitecore/shell/Applications/WebEdit/WebEditRibbon.aspx?");
    }
    return ribbonPageCode;
  });