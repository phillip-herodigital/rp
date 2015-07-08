Sitecore.UnitTests = {
  Constants: {   
    fieldChromeSelector: ".scWebEditInput",
    inlineEditableFieldChromeSelector: ".scWebEditInput[contenteditable='true']", 
    renderingChromeSelector: ".scpm[chromeType='rendering'][kind='open']",
    placeholderChromeSelector: ".scpm[chromeType='placeholder'][kind='open']",
    editFrameChromeSelector: ".scLooseFrameZone",
    sampleRenderingId: "493B3A830FA744848FC94680991CF743",
    sampleSublayoutId: "CE4ADCFB7990498083FBA00C1E3673DB"    
  },

  Helper: {
    requiredCondition:function(condition, msg) {
      var result;
      if (typeof(condition) == "function") {
        result = condition();
      }
      else {
        result = condition;
      }

      ok(result, "Cannot perform a test: " + msg);
      return result;
    }
  }
};

QUnit.config.autorun = false;
QUnit.config.reorder = false;
QUnit.config.autostart  = false;
Sitecore.PageModes.PageEditor.onLoadComplete.observe(function() {  
  QUnit.start();
});