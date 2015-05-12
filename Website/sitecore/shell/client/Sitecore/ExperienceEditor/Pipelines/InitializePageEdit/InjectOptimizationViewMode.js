﻿define(["sitecore"], function (Sitecore) {
  return {
    priority: 1,
    execute: function (context) {
      var sc = window.top.Sitecore;
      
      // Inject styles
      Sitecore.ExperienceEditor.Common.registerDocumentStyles(["/sitecore/shell/client/Sitecore/ExperienceEditor/Pipelines/InitializePageEdit/OptimizationViewMode.css"], window.top.document);
      
      if (typeof (sc.PageModes) === "undefined") sc.PageModes = {};

      // Injet Optimization View Mode
      sc.PageModes.ChromeOptimizationView = new function () {
        this._shouldHighlightChromes = false;

        this.activate = function () {
          this._shouldHighlightChromes = true;
          this.highlightChromes();
        };

        this.deactivate = function () {
          this._shouldHighlightChromes = false;
          this.highlightChromes();
        };

        this.highlightChromes = function () {
          var length = sc.PageModes.ChromeManager.chromes().length;

          for (var i = 0; i < length; i++) {
            var chrome = sc.PageModes.ChromeManager.chromes()[i];

            if (chrome && chrome.data && chrome.data.custom && chrome.data.custom.testVariations) {
              if (chrome.data.custom.testVariations.length > 0) {
                chrome.element.addClass("scEnabledChromeComponentTest");
              }
            }

            if (chrome && chrome.type && chrome.type instanceof sc.PageModes.ChromeTypes.Rendering && chrome.type.getConditions) {
              if (chrome.type.getConditions().length > 0) {
                chrome.element.addClass("scEnabledChromePersonalizationTest");
              }
            }

            if (chrome && chrome.type && chrome.type instanceof sc.PageModes.ChromeTypes.Field && chrome.type.parameters && chrome.type.parameters["sc-highlight-contentchange"] === "yes") {
              chrome.element.addClass("scEnabledChromePageVersionTest");
            }
          }
        };
      };
      
      // Turn on/off Optimization View mode
      Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor(
        "ExperienceEditor.ToggleRegistryKey.Get",
        function (response) {
          if (response.responseValue.value !== undefined && response.responseValue.value) {
            Sitecore.ExperienceEditor.PageEditorProxy.changeShowOptimization(true);
            response.context.button.set("isPressed", response.responseValue.value);
          }
        },
        { value: "/Current_User/Page Editor/Show/Optimization" }).execute(context);
    }
  };
});