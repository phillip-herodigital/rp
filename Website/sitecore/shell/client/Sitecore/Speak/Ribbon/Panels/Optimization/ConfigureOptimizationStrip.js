define(["sitecore"], function (Sitecore) {
  // IE9 bug-fix
  Sitecore.ExperienceEditor = Sitecore.ExperienceEditor || {}; 
  Sitecore.ExperienceEditor.Hooks = Sitecore.ExperienceEditor.Hooks || [];

  Sitecore.ExperienceEditor.Hooks.push({
    execute: function (context) {
      var optimizationTabId = "TestingStrip_ribbon_tab";
      ensureStyles();

      var updateOptimizationTab = function() {
        Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("Optimization.ActiveItemTests.Count", function(response) {
          var testCount = response.responseValue.value;
          var el = $("#" + optimizationTabId);
          var indicatorExists = el.find("div.optimization-indicator").length > 0;

          if (testCount === 0) {
            el.find("div.optimization-indicator").remove();
          } else if (!indicatorExists) {
            el.prepend("<div class='optimization-indicator'></div>");
          }
        }, context.currentContext).execute(context);
      };

      var layout = window.top.document.getElementById("scLayout");
      if (layout) {
        layout.onchange = updateOptimizationTab;
      }

      updateOptimizationTab();
    }
  });

  function ensureStyles() {
    var head = $("head");
    var styleNode = head.find("style[id='ct']");
    if (styleNode.length === 0) {
      head.append("<style id='ct' rel='stylesheet' type='text/css'>.optimization-indicator{float:right;width:12px;height:12px;background-color:#dc1e11;border-radius:6px;margin:3px;}</style>");
    }
  }
});