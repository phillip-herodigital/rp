define(["sitecore"], function (Sitecore) {
  // IE9 bug-fix
  Sitecore.ExperienceEditor = Sitecore.ExperienceEditor || {}; 
  Sitecore.ExperienceEditor.Hooks = Sitecore.ExperienceEditor.Hooks || [];

  Sitecore.ExperienceEditor.Hooks.push({
    execute: function (context) {
      var optimizationTabId = "TestingStrip_ribbon_tab";
      var optimizationTabValueId = optimizationTabId + "_value";

      var updateOptimizationTab = function () {
        var optimizationTabValue = $("#" + optimizationTabValueId);
        Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Analytics.MultiComponentTestingCountRequest", function (response) {
          var testsCount = response.responseValue.value;
          optimizationTabValue.text(testsCount);
          optimizationTabValue.css("display", testsCount > 0 ? "" : "none");
        }).execute(context);
      }

      $("#" + optimizationTabId).append("<span id='" + optimizationTabValueId + "' style='display:none;' class='scStripHeaderBage'></span>");
      var layout = window.top.document.getElementById("scLayout");
      if (layout) {
        layout.onchange = updateOptimizationTab;
      }

      updateOptimizationTab();
    }
  });
});