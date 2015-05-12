define(["sitecore"], function (Sitecore) {
  Sitecore.Factories.createBaseComponent({
    name: "Panel",

    base: "ControlBase",

    selector: ".sc-chunk-panel",

    attributes: [
        { name: "ID", value: "$el.data:sc-id" },
        { name: "FullContentSrc", value: "$el.data:sc-fullcontentsrc" },
        { name: "FullContentWidth", value: "$el.data:sc-fullcontentwidth" },
        { name: "FullContentHeight", value: "$el.data:sc-fullcontentheight" },
        { name: "HasFullContent", value: "$el.data:sc-hasfullcontent" }
    ],

    initialize: function () {
      var self = this;
      var panel = Sitecore.ExperienceEditor.Common.getElementById(this.model.get("ID"));
      var context = this;
      if (panel) {
        var hasFullContent = context.model.get("HasFullContent");
        if (hasFullContent.toLowerCase() == 'true') {
          var expandPanelButton = panel.querySelector(".showPanelButton");
          expandPanelButton.onclick = function (event) {
            var url = context.model.get("FullContentSrc") + "?" + context.getContextQueryString();
            var dimensions = {
              width: context.model.get("FullContentWidth"), height: context.model.get("FullContentHeight")
            };

            Sitecore.ExperienceEditor.Common.showGallery(url, panel, dimensions);
          };
        }
      }
      this._super();
    },

    getContextQueryString: function () {
      return "itemId=" + Sitecore.ExperienceEditor.instance.currentContext.itemId + "&" +
        "deviceId=" + Sitecore.ExperienceEditor.instance.currentContext.deviceId + "&" +
        "database=" + Sitecore.ExperienceEditor.instance.currentContext.database + "&" +
        "sc_lang=" + Sitecore.ExperienceEditor.Common.getCookieValue("shell#lang");
    }
  });
});