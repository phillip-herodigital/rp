define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  // IE9 bug-fix
  Sitecore.ExperienceEditor = Sitecore.ExperienceEditor || {}; 
  Sitecore.ExperienceEditor.Hooks = Sitecore.ExperienceEditor.Hooks || [];

  Sitecore.ExperienceEditor.Hooks.push({
    execute: function (context) {
      var optimizationTabId = "TestingStrip_ribbon_tab";
      var optimizationTabValueId = optimizationTabId + "_value";

      var tabControl = $("#" + optimizationTabId);
      tabControl.hide();
      if (context.currentContext.analyticsEnabled) {
        tabControl.show();
      } else {
        if (ExperienceEditor.Common.getCookieValue("sitecore_webedit_activestrip") == optimizationTabId) {
          ExperienceEditor.Common.displayTab(jQuery(".sc-quickbar-tab").first()[0]);
        }
        return;
      }

      var updateOptimizationTab = function () {
        var optimizationTabValue = $("#" + optimizationTabValueId);
        ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Analytics.MultiComponentTestingCountRequest", function(response) {
          var testsCount = response.responseValue.value;
          optimizationTabValue.text(testsCount);
          optimizationTabValue.css("display", testsCount > 0 ? "" : "none");
        }).execute(context);
      };

      tabControl.append("<span id='" + optimizationTabValueId + "' style='display:none;' class='scStripHeaderBage'></span>");
      var layout = window.top.document.getElementById("scLayout");
      if (layout) {
        layout.onchange = updateOptimizationTab;
      }

      updateOptimizationTab();
    }
  });
});