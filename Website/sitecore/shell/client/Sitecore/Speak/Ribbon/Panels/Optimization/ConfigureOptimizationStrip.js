require.config({
  paths: {
    activeTestState: "/sitecore/shell/client/Sitecore/ContentTesting/ActiveTestState"
  }
});

define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js", "activeTestState"], function (Sitecore, ExperienceEditor, ActiveTestState) {
  // IE9 bug-fix
  Sitecore.ExperienceEditor = Sitecore.ExperienceEditor || {}; 
  Sitecore.ExperienceEditor.Hooks = Sitecore.ExperienceEditor.Hooks || [];

  Sitecore.ExperienceEditor.Hooks.push({
    execute: function (context) {
      var optimizationTabId = "TestingStrip_ribbon_tab";
      ensureStyles();

      var updateOptimizationTab = function () {

        var isEnabled;
        var hasTest = false;
        if (ActiveTestState)
          hasTest = ActiveTestState.hasActiveTest(context);
        

        ExperienceEditor.PipelinesUtil.generateRequestProcessor("Optimization.IsContentTestingEnabledRequest", function (response) {
          isEnabled = response.responseValue.value;
          if (!isEnabled) {
            var statusChunkElement = $("[data-sc-id='StatusChunk']");
            statusChunkElement.remove();

            var pageReportChunkElement = $("[data-sc-id='PageReports']");
            pageReportChunkElement.remove();

            var listsChunkElement = $("[data-sc-id='Lists']");
            listsChunkElement.remove();

            var createChunkElement = $("[data-sc-id='Create']");
            createChunkElement.remove();
            
            var el = $("#" + optimizationTabId);
            var indicatorExists = el.find("div.optimization-indicator").length > 0;

            if (indicatorExists) {
              el.find("div.optimization-indicator").remove();
            }
          }
        }, context.currentContext).execute(context);

        if (!isEnabled) {
          return;
        }
        var el = $("#" + optimizationTabId);
        var indicatorExists = el.find("div.optimization-indicator").length > 0;

        if (!hasTest) {
          el.find("div.optimization-indicator").remove();
        } else if (!indicatorExists) {
          el.prepend("<div class='optimization-indicator'></div>");
        }
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