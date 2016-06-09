﻿define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  function displayTab(tabControl) {
    ExperienceEditor.Common.displayTab(tabControl);
  }
  
  Sitecore.Factories.createBaseComponent({
    name: "Strip",
    base: "ControlBase",
    selector: ".sc-strip",
    attributes: [],

    initialize: function () {
      this.rendernTab(this);
      var previewTabId = "VersionStrip_ribbon_tab";
      var currentTab = this.getCookie("sitecore_webedit_activestrip");
      if (ExperienceEditor.Web.getUrlQueryStringValue("mode") == "preview"
        && document.getElementById(previewTabId) != null) {
        currentTab = previewTabId;
      }

      displayTab(document.getElementById(currentTab));
      this._super();
    },
    
    getCookie: function (name) {
      var regexp = new RegExp("(?:^" + name + "|;\s*" + name + ")=(.*?)(?:;|$)", "g");
      var result = regexp.exec(document.cookie);
      return (result === null) ? null : result[1];
    },
    
    rendernTab: function (context) {
      var stripId = context.$el[0].getAttribute("data-sc-id");
      var id = stripId + "_ribbon_tab";
      var tabName = this.$el.find("h3").text();
      var tabSource = "<a id=\"" + id + "\" stripId=\"" + stripId + "\" href=\"#\" class=\"sc-quickbar-item sc-quickbar-tab\">" + tabName + "</a>";
      
      var quickbar = jQuery(".sc-quickbar");
      if (!quickbar) {
        return;
      }
      
      quickbar.append(tabSource);

      var strip = document.getElementById(this.getCookie("sitecore_webedit_activestrip"));
      if (strip) {
        jQuery(strip).show();
      }

      var tab = jQuery("#" + id);
      tab.on("click", function (event) {
        displayTab(event.target);
      });
    },
    
  });
});