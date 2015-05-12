define(["sitecore"], function (_sc) {
  var Rules = _sc.Definitions.App.extend({
    initialized: function () {
      this.RulesDataSource.on("change:items", this.notifyChangeRules, this);
      this.RulePerformanceIndicator.on("change:selectedItem", this.updateWithSelectedValue, this);
      this.listenToOnce(this.RulePerformanceIndicator, "change:items", this.updateWithDefaultValue); 
    },
    
    updateWithDefaultValue: function()
    {
      var items = this.RulePerformanceIndicator.get("items");

      if (items && items.length > 0 && items[0].items && items[0].items.length > 1) {
        this.RulePerformanceIndicator.set("selectedItem", items[0].items[0]);
      }

      this.ThumbnailImage.set("isBusy", false);
      this.ThumbnailImage.refresh();
    },
    
    updateWithSelectedValue: function()
    {
      var app = this;
      var selectedItem = app.RulePerformanceIndicator.get("selectedItem");
      app.set("ruleId", selectedItem.guid);
      app.set("ruleSetId", selectedItem.RenderingId);
      app.set("ruleName", selectedItem.title);
      app.updateDetails();
    },
    
    notifyChangeRules: function()
    {
      var rulescount = this.RulesDataSource.get("RulesCount");
      var componentscount = this.RulesDataSource.get("ComponentCount");
      var template = _.template(this.StringDictionary.get("<%= ruleCount %> personalization rules in <%= componentCount %> components on this page"));

      this.DescriptionText.set("text", template({
        ruleCount: rulescount,
        componentCount: componentscount
      }));
    },
    updateDetails: function()
    {
      var app = this;
      var ruleId = app.get("ruleId");
      if (ruleId !== "")
      {
        app.RulePerformanceDataSource.set("ruleId", ruleId);
        app.RulePerformanceDataSource.set("ruleSetId", app.get("ruleSetId"));
        app.ReachDataSource.set("valueId", ruleId);
        app.PersonalizationRuleDataSource.set("ruleId", ruleId);
        app.RuleNameText.set("text", app.get("ruleName"));
        app.ThumbnailImage.set("testvalueid", ruleId);
      }
    },
    
    editPersonalization: function()
    {
      var message = "webedit:personalize";
      var selectedItem = this.RulePerformanceIndicator.get("selectedItem"); 
      if (selectedItem != "" && selectedItem != undefined)
      {
        var renderingId = this.formatGuid(selectedItem.RenderingId);
        var topwindow = window.parent.parent;
        
        var chromeManager = topwindow.Sitecore.PageModes.ChromeManager;
        var renderingChrome = $.grep(chromeManager.chromes(), function(item){ 
          return item.controlId() == 'r_'+renderingId
        })[0]; 
        chromeManager.select(renderingChrome);
        topwindow.Sitecore.PageModes.PageEditor.postRequest(message+"(uniqueId="+renderingId+")");
        this.close();
      }
    },
    
    formatGuid: function(guid)
    {
      var str = guid.replace("-", "").replace("-", "").replace("-", "").replace("-", "");
      str = str.toUpperCase();
      return str;
    },
    
    close: function() {
      window.top.dialogClose();
    }
  });

  return Rules;
});